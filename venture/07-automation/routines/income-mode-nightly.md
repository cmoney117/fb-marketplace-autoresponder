# Income-mode nightly routine (effective 2026-09-04)

Owner directive (verbatim intent): no more involving Cody; results only in dollars; say nothing to him until income is generated.
Scope: online sales only — Paycheck Budget store + AnswerPine. Never touch or report Hive items in this chain.

## Every night, in order
1. `date -u`, `git pull`.
2. **Revenue watch**
   - Gmail inbox (last 2 days): replies to the 3 personal launch emails (matt.horn415 / chelseapeterman14 / scureton1201), replies on any outreach thread, any Gumroad sale or receipt email.
   - Jotform form 262131333242039 — a submission is a hot lead.
   - Drive metadata probe on results doc `1v6rkBlZ7tv9a0mHNdcjJI1fp5uXgeZB55T7bktZlk4U`; read in full only if modifiedTime advanced past the last-read stamp in verification-log.csv. Look for TASK-017 `GUMROAD-SALES` with N>0, TASK-014 verified/sitemap, TASK-015 executed. Skip Hive sections.
3. **Wave cadence** (kit: `venture/03-business-plans/receptionist-outreach-kit.md`; footer on every touch; reply in-thread to the latest message; verify every send by its returned id against thread evidence):
   - Each nightly cohort is tracked by its Email-1 send date in `outreach-log.csv`.
   - Email-2 at +4 days, Email-3 at +8, Email-4 at +12. Wave-5 cohort of 2026-09-04 → Sep 8 / Sep 12 / Sep 16.
   - Replies: "no thanks" → suppress + log. Interested → reply helpfully in Cody's voice (demo link + Jotform form), then report to Cody (income-adjacent).
4. **Harvest + send 10+ new openers**
   - WebSearch patterns that surface emails in snippets: `<trade> "email us at" "@"`, `<trade> "email:" "@gmail.com" "family owned"`, plus `"24/7"` / `"same day"` / `"free estimates"`. Rotate trades (plumbing, HVAC, electrical, locksmith, garage door, septic, tree, towing, appliance, chimney, well pump, water damage, pest) and regions.
   - Qualify: small or family-owned home-services company with a real contact email. Skip aggregators, lead-gen sites, franchises, and anyone already in `outreach-log.csv`.
   - Pick GAP vs COST per the kit rule; personalize the first line from the snippet; send via Gmail send_message; ≤50 sends/day total; stop after 2 consecutive classifier denials (retry singles once later).
5. **Log**: append rows to `outreach-log.csv` (with thread ids) and one row to `verification-log.csv`; commit with the attribution footer; push.
6. **Reporting rule**: if a sale, a Jotform signup, or a genuinely interested reply exists → message Cody immediately with the dollars/lead and next step. Otherwise end the turn with no text to Cody.
7. **Re-arm** the nightly trigger 24h out with a short prompt pointing at this file.

## Standing rules
- Suppressed forever: info@eppingwell.com, info@cleanearthseptic.com, admin@tahomahc.com, support@elkappliance.com, info@24hourtowingcompany.com, info@michaelbarlowwelldrilling.com, plus any new "no thanks" or bounce.
- Never re-contact the original 46 (fully sequenced Aug 27) unless they reply first.
- Never log a send without its returned message id.
- Commit footer: `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` + `Claude-Session: https://claude.ai/code/session_01YXXCjK6mADrUUCHM2odCz1`.
- Re-clone the repo if the container was recycled.
