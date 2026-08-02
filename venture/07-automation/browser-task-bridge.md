# Browser Task Bridge — cloud Claude ⇄ desktop Claude (no human middleman)

**Bus:** Google Doc "🤖🤝🤖 Browser Task Queue" (ID `1v6rkBlZ7tv9a0mHNdcjJI1fp5uXgeZB55T7bktZlk4U`, in the Venture HQ Drive folder). Cloud agents write PENDING tasks; the owner's desktop Cowork Claude (scheduled task, browser control) executes them in the owner's logged-in browser and writes results to DONE / blockers to BLOCKED; a scheduled cloud Routine reads results and acts.

**Protocol rules (mirrored in the doc header):** one task per run oldest-first; no passwords/2FA/card entry ever (→ BLOCKED); no spending without an explicit `SPEND APPROVED: $X` line; page-mismatch → BLOCKED, never improvise.

**Cloud side:** Routine "Bridge-Check" (every 4h, fresh session) reads the doc → on TASK results: wires outputs (payment links into `store/build_store.py`, deploy triggers, config), commits/pushes (auto-deploys via Vercel git integration once TASK-001 completes), queues follow-up tasks, notifies owner only on meaningful progress or blockers.

**Desktop side (owner sets up ONCE):** Claude desktop app (Cowork) scheduled task every few hours: open the doc, follow its protocol. Requires: the machine on, Chrome profile logged into the business accounts, browser control enabled.

**What still needs the actual human:** identity/KYC verifications (Etsy taxpayer info, bank numbers), 2FA prompts, and any purchase approval — the queue is designed to park exactly those in BLOCKED with everything else done around them.
