#!/bin/bash
# Smoke test for run.sh git handling, using a throwaway local bare remote and a stub fetcher.
# Run: bash test/run_sh_smoke.sh   (no network, no browser)
set -u
SRC="$(cd "$(dirname "$0")/.." && pwd)"
T="$(mktemp -d)"
trap 'rm -rf "$T"' EXIT
BR="claude/dropshipping-passive-income-q9a65v"
SW="venture/07-automation/local-worker/supplier-watch"
OUT="venture/08-weighted-hoodie/supplier"
FAIL=0
pass() { echo "PASS $1"; }
fail() { echo "FAIL $1"; FAIL=$((FAIL+1)); }

export HOME="$T/home"; mkdir -p "$HOME"
export GIT_CONFIG_GLOBAL="$T/gitconfig"
git config --global user.name tester; git config --global user.email tester@example.com
git config --global init.defaultBranch main

# Remote with the branch and the supplier-watch folder.
git init -q --bare "$T/remote.git"
git clone -q "$T/remote.git" "$T/seed" 2>/dev/null
cd "$T/seed"
git checkout -q -b "$BR"
mkdir -p "$SW/node_modules/playwright" "$OUT"
cp "$SRC/run.sh" "$SW/run.sh"
cp "$SRC/listings.json" "$SW/listings.json"
cat > "$SW/fetch_listing.mjs" <<'EOF'
import fs from 'node:fs';
import path from 'node:path';
const out = path.resolve(process.cwd(), '../../../../venture/08-weighted-hoodie/supplier/stub');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'listing.json'), JSON.stringify({ run: process.env.STUB_TAG || 'x' }));
process.exit(Number(process.env.STUB_CODE || 0));
EOF
echo "node_modules/" > "$SW/.gitignore"
git add -A && git commit -qm seed && git push -q origin "$BR" 2>/dev/null
cd "$T"
git clone -q -b "$BR" "$T/remote.git" "$T/mac" 2>/dev/null
mkdir -p "$T/mac/$SW/node_modules/playwright"
RUN="$T/mac/$SW/run.sh"
remote_has() { git --git-dir="$T/remote.git" show "$BR:$1" 2>/dev/null; }

# A. Normal run: data and heartbeat are pushed.
STUB_TAG=a bash "$RUN" >/dev/null 2>&1; rc=$?
[ $rc -eq 0 ] && remote_has "$OUT/stub/listing.json" | grep -q '"a"' && pass "normal run pushes data" || fail "normal run (rc=$rc)"
remote_has "$OUT/_runner/last-run.json" | grep -q '"exit_code": 0' && pass "heartbeat pushed" || fail "heartbeat missing"
remote_has "$OUT/_runner/last-run.json" | grep -q "$HOME" && fail "heartbeat leaks HOME path" || pass "heartbeat has no absolute home path"

# B. Upstream changed the same data file: the Mac's data wins, no stuck rebase.
git clone -q -b "$BR" "$T/remote.git" "$T/other" 2>/dev/null
( cd "$T/other" && echo '{"run":"upstream"}' > "$OUT/stub/listing.json" && git commit -qam upstream && git push -q origin "$BR" 2>/dev/null )
( cd "$T/mac" && echo '{"run":"local-unpushed"}' > "$OUT/stub/listing.json" && git commit -qam local )
STUB_TAG=b bash "$RUN" >/dev/null 2>&1; rc=$?
[ $rc -eq 0 ] && remote_has "$OUT/stub/listing.json" | grep -q '"b"' && pass "conflicting upstream change resolved" || fail "conflict case (rc=$rc)"
[ -d "$T/mac/.git/rebase-merge" ] || [ -d "$T/mac/.git/rebase-apply" ] && fail "left mid-rebase" || pass "not left mid-rebase"

# C. A half-finished rebase from an earlier crash is cleaned up.
( cd "$T/other" && git pull -q origin "$BR" 2>/dev/null; echo '{"run":"up2"}' > "$OUT/stub/listing.json" && git commit -qam up2 && git push -q origin "$BR" 2>/dev/null )
( cd "$T/mac" && echo '{"run":"local2"}' > "$OUT/stub/listing.json" && git commit -qam local2 && git pull -q --rebase origin "$BR" >/dev/null 2>&1 )
[ -d "$T/mac/.git/rebase-merge" ] || [ -d "$T/mac/.git/rebase-apply" ] && echo "  (set up: repo is mid-rebase)"
STUB_TAG=c bash "$RUN" >/dev/null 2>&1; rc=$?
[ $rc -eq 0 ] && remote_has "$OUT/stub/listing.json" | grep -q '"c"' && pass "recovers from a stuck rebase" || fail "stuck rebase case (rc=$rc)"

# D. A failing commit is reported as a failure, not a silent success.
( cd "$T/mac" && git config user.useConfigOnly true && git config --unset-all user.email 2>/dev/null; true )
GIT_CONFIG_GLOBAL=/dev/null STUB_TAG=d bash "$RUN" >/dev/null 2>&1; rc=$?
[ $rc -ne 0 ] && pass "commit failure exits non-zero" || fail "commit failure exited 0"
( cd "$T/mac" && git config --unset user.useConfigOnly; git reset -q 2>/dev/null; true )

# E. A bot check (exit 2) pauses scheduled runs until a manual run succeeds.
STUB_CODE=2 STUB_TAG=e bash "$RUN" >/dev/null 2>&1; rc=$?
[ $rc -eq 2 ] && [ -e "$HOME/.supplier-watch-paused" ] && pass "exit 2 pauses scheduled runs" || fail "pause not set (rc=$rc)"
out="$(SUPPLIER_WATCH_UNATTENDED=1 STUB_TAG=e2 bash "$RUN" 2>&1; cat "${TMPDIR:-/tmp}/supplier-watch.log" 2>/dev/null | tail -3)"
echo "$out" | grep -q paused && pass "scheduled run skips while paused" || fail "scheduled run did not skip"
STUB_TAG=f bash "$RUN" >/dev/null 2>&1
[ ! -e "$HOME/.supplier-watch-paused" ] && pass "manual success clears the pause" || fail "pause not cleared"

# F. A stale lock from a killed run is taken over.
echo 999999 > "${TMPDIR:-/tmp}/supplier-watch.lock"
STUB_TAG=g bash "$RUN" >/dev/null 2>&1; rc=$?
[ $rc -eq 0 ] && pass "stale lock taken over" || fail "stale lock blocked the run (rc=$rc)"

echo; [ $FAIL -eq 0 ] && echo "ALL PASSED" || echo "$FAIL FAILED"
exit $FAIL
