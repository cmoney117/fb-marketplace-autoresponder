# Evening Verification Run — "done" means live, never draft

**Owner directive (2026-08-02):** a prior automation reported daily success while its output sat unseen in drafts. Therefore: **no self-report counts. Every claimed result is verified from the OUTSIDE, nightly.** Anything in a "draft/pending/saved/unpublished" state is NOT done — it stays open and gets flagged.

## Ground-truth table (how each artifact is verified — never by what an agent said)

| Claim | Verification (external) | "Live" means |
|---|---|---|
| Store deployed | WebFetch the public URL | HTTP 200 + product names present in HTML |
| Domain attached | WebFetch https://<domain> | 200 + serves the store, not a parking page |
| Stripe payment link | WebFetch the buy.stripe.com URL | 200 + shows product name + price (Stripe link pages are public) |
| Etsy listing | WebFetch the public listing URL logged out | 200 + "Add to cart" present (a DRAFT listing 404s publicly — the exact trap) |
| Fiverr gig | WebFetch public gig URL | 200 + gig title + pricing tiers visible |
| Gumroad product | WebFetch public product URL | 200 + buy button |
| Pinterest profile/pins | WebFetch profile URL | 200 + boards visible |
| Jotform | WebFetch form URL | 200 + form fields render |
| Receptionist demo | ElevenLabs get_agent (agent exists + active) + landing URL 200 | — |
| Emails "sent" | Gmail: message in SENT, not Drafts | Draft = NOT sent → flag |
| Agent runs happened | git log since yesterday shows the expected `bridge-check:`/`daily-ops:` commits | Missing commits = a scheduled run silently died → flag |
| Desktop worker alive | Results doc modifiedTime within 24h while unfinished tasks exist | Stale + pending work = worker stalled → flag "check the machine" |
| Triggers armed | list_triggers: all venture triggers enabled with future next_run_at | Disabled/ended = flag |
| Sales pipeline real | Stripe/marketplace order records ↔ tracker orders.csv match | Mismatch = tracker lying → flag |

## Output contract (every night, no exceptions — silence is itself a failure signal)
One short message to the owner:
- **Green:** "🌙 Audit: N/N live-checks passed · today's progress: <one line> · nothing needs you."
- **Red:** "⚠️ Audit: X passed, Y stuck: <artifact> is <actual state>; fix = <exact 30-second action or what I'm doing about it>."
Also: append a row per check to `tracker/verification-log.csv` (date, artifact, method, result) and commit — the audit trail itself is verifiable.

## Standing rules
- The auditor never "fixes silently": discrepancies get fixed where possible AND reported (trust requires seeing the catch).
- A check that can't run (URL unknown yet, account not created) is reported as N/A, never as passed.
- If the auditor itself fails to run, the owner notices by the missing nightly message — that's by design; absence of the audit IS the alert.

## Telegram channel (owner directive 2026-08-02)
When `venture/07-automation/telegram.conf` exists (TG_BOT_TOKEN + TG_CHAT_ID), every nightly audit line is ALSO sent via `scripts/notify_telegram.sh` — same message, same always-on rule. Verified-done milestones (store live, first sale, gig published) go to Telegram the moment they're externally verified, not when claimed.

## Weekly two-lens deep audit (owner directive 2026-08-02 — permanent standard)
Every Sunday the audit runs two extra passes over EVERYTHING built or changed that week:
1. **World-class operator lens:** pricing/offer congruence, page conversion practices (headline-promise match, guarantee placement, proof density, friction count to checkout), copy quality, funnel math still valid vs tracker data.
2. **Adversarial customer lens:** click every link and button as a skeptical stranger on a phone — dead buttons, placeholder text visible anywhere, broken images, confusing steps, files that don't open, prices that don't match between page/checkout/receipt. Every finding gets fixed or ticketed with an owner-visible line; "it's minor" is not a dismissal.
Findings + fixes land in `tracker/verification-log.csv` and the Sunday report.
