# Resume Instructions — for any AI session picking this up cold

You are resuming an automated e-commerce venture. This folder is sufficient context. Read in this order: `00-original-brief.md` (what the owner wants) → `decision-log.md` (what's been decided; never re-litigate silently) → this file → `../07-automation/tracker/NEEDS-HUMAN.md` and the tracker CSVs (current state).

## Where everything lives
Repo `cmoney117/fb-marketplace-autoresponder`, branch `claude/dropshipping-passive-income-q9a65v`, folder `venture/`. The repo is the business's brain: tracker CSVs are the operational state, docs are the policy. Commit and push every state change (`daily-ops: YYYY-MM-DD` / `weekly-review: YYYY-WW` style messages). The 5 files at repo root are an UNRELATED Chrome extension (USA Fleet Sales FB autoresponder) — never touch them.

## Current state (update this section whenever it changes)
- **Phase: PRE-LAUNCH.** All research/docs/automation specs built (session of 2026-08-02). Waiting on the owner to complete `06-account-setup/wave-1-signup-pack.md` (~75 min: Etsy + Printify + Gumroad + Pinterest/Buffer + API keys).
- First product finished and queued: `07-automation/tracker/publish-queue/budget-by-paycheck-v1/` (xlsx verified, 3 images, listing copy).
- No accounts exist yet · no listings live · no revenue · no Routines scheduled yet.
- **Next actions when owner says "accounts ready":** (1) verify API tokens reachable via the owner's secret store — NEVER stored in this repo; (2) publish starter listings SLOWLY (5–10 over first week, human-paced — new-shop bot heuristics suspend); (3) create the two scheduled Routines from `07-automation/routines/*.md` (owner approves once); (4) begin daily production per `03-business-plans/wave-1-etsy-digital-pod.md` (ornament niche first — Q4 deadline); (5) append decisions to the decision log.
- **Wave 2 (arbitrage):** staged, owner decision pending — ask once in late September.
- **Wave 3 (own store/ads):** trigger-gated; see `03-business-plans/wave-3-own-store-and-scale.md`.

## Non-negotiable operating rules (compressed; full versions in 04-operations/)
1. Compliant automation only: official APIs, approved schedulers, human VAs. No engagement bots, DM spam, fake reviews (FTC fines + account bans — the machine's existential risk is account loss, not competition).
2. Trademark-screen every design phrase (USPTO) before listing; log the screen. No brands/characters/lyrics ever.
3. Etsy disclosures always: production partner (POD) + AI-generated content.
4. FTC 30-Day Rule: real delivery windows (+2 days padding), auto delay-notice with refund option (template T2).
5. Refund ≤$50 complaints instantly (cap $200/day auto). Dispute-rate red line 0.4% → tripwire (pause + escalate). The owner's EXISTING Stripe account is reused for Wave 3 — a freeze hurts their other business; protect it obsessively.
6. Fail closed; idempotent actions (log before acting); facts only from listing/supplier/tracker data; never touch payout/bank settings; throttle on accounts <30 days old; platform policy warning = pause that channel until a human clears.
7. Restricted products list in compliance doc §8 — when in doubt, skip.

## Key numbers (from research — don't re-derive, cite `02-research/`)
Etsy take ~11–13%+$0.20 · Gumroad ~13–15% · $24.99 tee nets ~$6.44 (Printify free) · digital nets ~89% · 150+ listings = meaningful-traffic threshold · first sale median week 2–8 · breakeven ROAS = 1/margin · Pinterest 10–15 pins/day, never >50/hr · eBay newbie cap 10 items/$500/mo · Vercel Hobby prohibits commercial (use Cloudflare Pages free) · Etsy new-shop reserve ~30%/~45 days is normal.

## Prompts/assets inventory
Routine prompts: `07-automation/routines/` (paste-ready). Pipelines: `07-automation/pipelines/` (design/digital/copy/CS specs with embedded prompt frames). CS templates T1–T8: `04-operations/customer-service-sop.md`. Signup pack with pre-written fields: `06-account-setup/wave-1-signup-pack.md`. Owner-facing summary: `01-START-HERE.md`.

## Owner profile (for tone/decisions)
Wants maximum hands-off + lean spend until profit, then aggressive scale. Comfortable with AI autonomy; wants hard numbers, not hype; explicitly accepted Stripe-reuse risk (with mitigations) and "sell before you stock" validation implemented legally. Communicate in plain language, lead with the bottom line, only surface decisions that are genuinely theirs.
