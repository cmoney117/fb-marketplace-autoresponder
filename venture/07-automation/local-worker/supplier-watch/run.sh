#!/bin/bash
# Fetch the supplier listings in listings.json, then commit and push only the
# results folder (plus listings.json) so the cloud agent can read them.
# Safe to run by hand or from launchd. Arguments pass through to fetch_listing.mjs.
#
# Everything lives inside main(), which bash parses in full before running it,
# so a `git pull` that updates this file mid-run cannot corrupt the run.
# Written for the bash 3.2 that ships with macOS.

main() {
  set -u
  HERE="$(cd "$(dirname "$0")" && pwd)"
  BRANCH="claude/dropshipping-passive-income-q9a65v"
  OUT_REL="venture/08-weighted-hoodie/supplier"
  LISTINGS_REL="venture/07-automation/local-worker/supplier-watch/listings.json"
  UNATTENDED="${SUPPLIER_WATCH_UNATTENDED:-}"
  PAUSE="$HOME/.supplier-watch-paused"
  LOCK="${TMPDIR:-/tmp}/supplier-watch.lock"
  if [ -d "$HOME/Library/Logs" ]; then LOG="$HOME/Library/Logs/supplier-watch.log"; else LOG="${TMPDIR:-/tmp}/supplier-watch.log"; fi
  STAGE=start; CODE=0; PUBLISHED=0; BRANCH_OK=0; REPO=""; WD=""

  # Bounded log. Interactive runs also print to the terminal.
  if [ -f "$LOG" ] && [ "$(wc -c < "$LOG")" -gt 2000000 ]; then tail -c 500000 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"; fi
  if [ -n "$UNATTENDED" ]; then exec >> "$LOG" 2>&1; else exec > >(tee -a "$LOG") 2>&1; fi
  echo "=== supplier-watch $(date '+%Y-%m-%d %H:%M:%S') unattended=${UNATTENDED:-0}"

  # After a bot check or sign-in wall, scheduled runs pause until a manual run succeeds.
  if [ -n "$UNATTENDED" ] && [ -e "$PAUSE" ]; then
    echo "paused: the last run needed a human (bot check or sign-in). Run ./run.sh by hand to clear."
    exit 0
  fi
  # Spread scheduled runs out so they do not hit the site at the same minute every day.
  if [ -n "$UNATTENDED" ]; then sleep $(( RANDOM % 1800 )); fi

  # One run at a time; a lock left by a crashed run is taken over.
  if [ -x /usr/bin/shlock ]; then
    /usr/bin/shlock -f "$LOCK" -p $$ || { echo "another run is in progress"; exit 1; }
  else
    if [ -e "$LOCK" ] && ! kill -0 "$(cat "$LOCK" 2>/dev/null)" 2>/dev/null; then rm -f "$LOCK"; fi
    ( set -o noclobber; echo $$ > "$LOCK" ) 2>/dev/null || { echo "another run is in progress"; exit 1; }
  fi
  trap finish EXIT
  MAINPID=$$
  ( trap 'kill "$SP" 2>/dev/null; exit 0' TERM
    sleep 3000 & SP=$!; wait "$SP"
    echo "watchdog: run.sh exceeded 50 minutes" >> "$LOG"
    kill -TERM -- "-$MAINPID" 2>/dev/null || kill -TERM "$MAINPID" ) >/dev/null 2>&1 &
  WD=$!

  # Find node even when it came from nvm, fnm, Volta, asdf or mise (launchd has a bare PATH).
  PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
  if ! command -v node >/dev/null 2>&1; then
    for d in "$HOME/.volta/bin" "$HOME/.asdf/shims" "$HOME/.local/share/mise/shims" "$HOME/.local/state/fnm_multishells"; do
      [ -d "$d" ] && PATH="$d:$PATH"
    done
    if [ -s "$HOME/.nvm/nvm.sh" ]; then set +u; export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh" >/dev/null 2>&1; set -u; fi
  fi
  if ! command -v node >/dev/null 2>&1; then
    n="$(/bin/zsh -lic 'command -v node' 2>/dev/null | tail -1)"
    [ -n "$n" ] && [ -x "$n" ] && PATH="$(dirname "$n"):$PATH"
  fi
  export PATH

  # Git must never wait for a password prompt or hang on a dead connection.
  export GIT_TERMINAL_PROMPT=0 GCM_INTERACTIVE=never GIT_HTTP_LOW_SPEED_LIMIT=1000 GIT_HTTP_LOW_SPEED_TIME=60
  export GIT_SSH_COMMAND="ssh -o BatchMode=yes -o ConnectTimeout=20 -o ServerAliveInterval=15 -o ServerAliveCountMax=4"
  ssh-add --apple-load-keychain >/dev/null 2>&1 || true

  STAGE=repo
  REPO="$(git -C "$HERE" rev-parse --show-toplevel 2>/dev/null)" || { echo "not inside a git clone"; exit 1; }
  cd "$REPO" || exit 1
  heal
  STAGE=checkout
  if [ "$(git rev-parse --abbrev-ref HEAD 2>/dev/null)" != "$BRANCH" ]; then
    git checkout "$BRANCH" || { echo "could not switch to $BRANCH"; exit 1; }
  fi
  BRANCH_OK=1

  STAGE=pull
  if ! t 120 git pull --rebase --autostash -X theirs origin "$BRANCH"; then
    echo "git pull failed; fetching with the local copy of the code, will push next run"
    heal
  fi

  STAGE=node
  command -v node >/dev/null 2>&1 || { echo "node not found on PATH=$PATH (install Node from nodejs.org or Homebrew)"; CODE=127; exit 127; }
  echo "node $(node -v)"
  cd "$HERE" || exit 1
  if [ ! -d node_modules/playwright ]; then
    STAGE=npm
    t 600 npm install --no-audit --no-fund || { echo "npm install failed"; CODE=1; exit 1; }
  fi

  STAGE=fetch
  node fetch_listing.mjs "$@"
  CODE=$?
  cd "$REPO" || exit 1
  case "$CODE" in
    2) touch "$PAUSE"
       osascript -e 'display notification "Temu needs a human: run supplier-watch/run.sh by hand" with title "Supplier watch"' >/dev/null 2>&1 || true ;;
    0|3) rm -f "$PAUSE" ;;
  esac

  STAGE=publish
  write_heartbeat "$CODE"
  publish || exit 1
  STAGE=done
  exit "$CODE"
}

# perl-based timeout (macOS has no `timeout` command).
t() { local s="$1"; shift; perl -e 'alarm shift; exec @ARGV or die "exec failed: $!\n"' "$s" "$@"; }

# Abort a half-finished rebase or merge so one conflict can never stop every later run.
heal() {
  local d
  for d in rebase-merge rebase-apply; do
    if [ -d "$(git rev-parse --git-path "$d")" ]; then git rebase --abort >/dev/null 2>&1 || true; fi
  done
  if git diff --name-only --diff-filter=U 2>/dev/null | grep -q .; then git reset --merge >/dev/null 2>&1 || true; fi
}

json_escape() {
  printf '%s' "$1" | LC_ALL=C tr -d '\000-\010\013\014\016-\037' | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' | awk 'BEGIN{ORS="\\n"}{print}'
}

# Heartbeat so the cloud agent can tell "Mac asleep" from "broken". No absolute paths, no tokens.
write_heartbeat() {
  local rc="$1" dir tail_txt nodev
  [ -n "$REPO" ] || return 0
  dir="$REPO/$OUT_REL/_runner"; mkdir -p "$dir" || return 0
  tail_txt="$(tail -n 40 "$LOG" 2>/dev/null | sed -e "s#$HOME#~#g" -e 's#://[^/@ ]*@#://***@#g')"
  nodev="$(node -v 2>/dev/null || echo none)"
  cat > "$dir/last-run.json" <<EOF
{
  "date": "$(date -u '+%Y-%m-%dT%H:%M:%SZ')",
  "host": "mac-mini",
  "stage": "$STAGE",
  "exit_code": $rc,
  "unattended": "${UNATTENDED:-0}",
  "node": "$nodev",
  "log_tail": "$(json_escape "$tail_txt")"
}
EOF
}

publish() {
  [ "$PUBLISHED" = 1 ] && return 0
  PUBLISHED=1
  [ "$BRANCH_OK" = 1 ] || { echo "not on $BRANCH; not committing"; return 1; }
  [ "$(git rev-parse --abbrev-ref HEAD 2>/dev/null)" = "$BRANCH" ] || { echo "not on $BRANCH; not committing"; return 1; }
  git add -A -- "$OUT_REL" "$LISTINGS_REL" || { echo "git add failed"; return 1; }
  # Never commit a file over 5 MB to the (public) repo.
  git diff --cached --name-only -- "$OUT_REL" | while IFS= read -r f; do
    if [ -f "$f" ] && [ "$(wc -c < "$f")" -gt 5000000 ]; then git reset -q -- "$f"; echo "skipped large file $f"; fi
  done
  if git diff --cached --quiet -- "$OUT_REL" "$LISTINGS_REL"; then
    echo "nothing new to commit"
  else
    git commit -q -m "supplier-watch: $(date +%F) stage=$STAGE exit=$CODE" -- "$OUT_REL" "$LISTINGS_REL" \
      || { echo "git commit failed (set git user.name and user.email in this clone)"; return 1; }
  fi
  local i
  for i in 1 2 3; do
    if t 120 git push origin "$BRANCH"; then echo "pushed"; return 0; fi
    t 120 git pull --rebase -X theirs origin "$BRANCH" || heal
    sleep $(( i * 10 ))
  done
  echo "push failed after 3 tries; results are committed locally and will go up on the next run"
  return 1
}

finish() {
  local rc=$?
  [ -n "${WD:-}" ] && kill "$WD" >/dev/null 2>&1
  # Early failure while the repo is usable: still leave a heartbeat in the repo.
  if [ "$PUBLISHED" = 0 ] && [ "$BRANCH_OK" = 1 ] && [ "$STAGE" != "done" ]; then
    heal
    write_heartbeat "$rc"
    publish || true
  fi
  rm -f "$LOCK"
  echo "=== end stage=$STAGE exit=$rc"
}

main "$@"; exit $?
