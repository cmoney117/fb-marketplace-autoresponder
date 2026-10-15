#!/bin/bash
# Fetch the supplier listings in listings.json, then commit and push only the
# results folder so the cloud agent can read them. Safe to run by hand or from launchd.
# Any arguments are passed through to fetch_listing.mjs (e.g. --id temu-eden-cloak).

set -uo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(git -C "$HERE" rev-parse --show-toplevel)" || { echo "not inside the repo"; exit 1; }
BRANCH="claude/dropshipping-passive-income-q9a65v"
OUT_REL="venture/08-weighted-hoodie/supplier"
LOCK="/tmp/supplier-watch.lock"

# One run at a time (a second launchd fire or a manual run while one is going).
if ! mkdir "$LOCK" 2>/dev/null; then echo "another run is in progress ($LOCK)"; exit 1; fi
trap 'rmdir "$LOCK" 2>/dev/null' EXIT

cd "$REPO" || exit 1
if [ "$(git rev-parse --abbrev-ref HEAD)" != "$BRANCH" ]; then
  git checkout "$BRANCH" || { echo "could not switch to $BRANCH"; exit 1; }
fi
git pull --rebase --autostash origin "$BRANCH" || { echo "git pull failed"; exit 1; }

cd "$HERE" || exit 1
if [ ! -d node_modules/playwright ]; then
  npm install --no-audit --no-fund || { echo "npm install failed"; exit 1; }
fi

# Keep the Mac awake for the length of the run.
if command -v caffeinate >/dev/null 2>&1; then
  caffeinate -i node fetch_listing.mjs "$@"
else
  node fetch_listing.mjs "$@"
fi
code=$?

cd "$REPO" || exit 1
git add -- "$OUT_REL"
if ! git diff --cached --quiet -- "$OUT_REL"; then
  git commit -m "supplier-watch: $(date +%F) (exit $code)" -- "$OUT_REL" >/dev/null
  pushed=0
  for i in 1 2 3; do
    if git push origin "$BRANCH"; then pushed=1; break; fi
    git pull --rebase --autostash origin "$BRANCH" || true
    sleep $((i * 10))
  done
  [ "$pushed" = 1 ] || { echo "push failed after 3 tries; results are committed locally"; exit 1; }
fi
exit $code
