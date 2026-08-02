# Automation Architecture — How This Runs Without the Owner

**Design goal:** every recurring task is done by (in priority order) ① a platform API called by code, ② a scheduled AI agent session, ③ a VA following an SOP, ④ the owner — with ④ reserved for identity/banking/account-creation and a weekly 15-minute review.

## The engine: scheduled AI agent sessions ("Routines")

The owner's Claude Max subscription supports scheduled Claude Code sessions (cron-triggered, fresh session per run) with access to this repo, Gmail, Google Drive, and the web. Two standing Routines run the business:

### R1 — Daily Ops Run (every morning, ~06:00 owner-local)
1. `git pull` this repo (the repo is the business's brain — state lives in `07-automation/tracker/`).
2. **Customer service:** read support inbox (Gmail) → draft/send replies per `04-operations/customer-service-sop.md` tiers → log actions.
3. **Order health:** check supplier/platform order statuses (API where connected, email-parse where not) → any order past promised date triggers the T2 delay email → update tracker.
4. **Production:** generate the day's new product batch per the active pipeline (`pipelines/` — e.g., 3 new POD designs or 1 new digital product), run the trademark screen, prepare listing packages (copy + tags + files) → publish via API where connected; otherwise queue in `tracker/publish-queue/` for VA/owner.
5. **Signals:** pull yesterday's views/favorites/sales per listing (API/CSV) into the tracker.
6. **Output:** commit tracker updates; write `tracker/NEEDS-HUMAN.md` (only if something actually needs a human) and email it to the owner ONLY when non-empty. No news = no email = nothing for the owner to do.

### R2 — Weekly Review Run (Sunday evening)
1. Roll up the week: revenue, fees, COGS, refunds, net per product/channel → append to `tracker/pnl-weekly.csv`.
2. Apply **kill/scale rules** (below) → archive losers, clone/expand winners (more variants, more designs in winning niche).
3. Check tripwires: dispute rate ≥0.4%? Supplier defect rate >4%? Rating <4.6? → escalate per compliance doc.
4. Produce the owner's weekly report (email + `tracker/weekly-report-YYYY-WW.md`): 10 lines max — what made money, what got killed, what's queued, any decision needed.
5. Propose next week's production focus (which niches get the design budget) based on signal.

*Both Routines are created at go-live with the owner's one-time approval. Their full prompts live in `routines/` (written at go-live). They run without the owner; the owner only reads the weekly report.*

## Data layer (the tracker)

Phase 1 (launch): **files in this repo** under `07-automation/tracker/` — `products.csv`, `listings.csv`, `orders.csv`, `pnl-weekly.csv`, `experiments.csv`, `publish-queue/`, `NEEDS-HUMAN.md`. Versioned by git (free audit log), readable/writable by every agent run, zero infrastructure cost.
Phase 2 (>~20 orders/day or own-store launch): migrate orders/metrics to Supabase (schema draft in `tracker/supabase-schema.sql` when we get there); repo keeps strategy/state docs.

## Integration map — what's automatable per platform

| Platform | Fully automatable (API/code) | Needs human/VA | Notes |
|---|---|---|---|
| Printify/Printful | Product creation, variant pricing, publish→connected shop, order auto-fulfill, shipping-status read | Account creation, payment method | Best automation surface in the whole stack; POD runs ~100% hands-free after setup |
| Etsy | Listing CRUD, inventory, orders, messages via **Open API v3** — requires an app-approval request | Shop creation (identity + bank), app-approval wait; until approved: Printify's native Etsy publish covers listing push | Personalization orders readable via API |
| Gumroad | Product upload, price, sales data via API | Account creation, payout setup | Digital products end-to-end automatable |
| eBay | Full Sell API suite (listings, orders, fulfillment) | Account creation, new-seller limits | Selling limits throttle the first months |
| Stripe (own store) | Checkout, tracking upload, Radar, disputes-evidence via API | Nothing after keys exist | Reused account — tripwire rules apply (compliance §4) |
| TikTok Shop / Amazon | APIs exist but heavier approval | Account + approval process | Later waves only |
| Pinterest / Meta | Pin/post scheduling via official APIs & approved schedulers | Account creation | Organic content distribution |
| Gmail (support hub) | Read, draft, send, label via connected tools | — | All marketplace messages forward here → one inbox for the agent |

## Pipelines (specs in `pipelines/`, one file each)

1. **POD design pipeline:** niche (from research/tracker signal) → N design concepts (AI) → trademark & IP screen (mandatory, logged) → image generation → mockup via supplier API → pricing from margin floor → listing copy (SEO title/tags per `05-marketing/`) → publish → log.
2. **Digital product pipeline:** candidate (from research) → build with AI (spreadsheet/template/planner) → self-QA checklist → listing images (mockups) → publish → log.
3. **Listing-copy generator:** platform-specific SEO rules; personalization fields where supported.
4. **Delay-watcher:** orders past promise date → T2 email + tracker flag (this single loop is most of FTC compliance and dispute prevention).
5. **Ad-creative pipeline (dormant until ads wave):** winning product → hooks × angles matrix → creative briefs/copy → UTM-tagged links per `05-marketing/tracking-and-utm-conventions.md` → results back into `experiments.csv` → kill/scale.

## Kill / scale rules (defaults — recalibrated by research + live data)

- **Listing-level (organic):** a listing with <{threshold} views after 30 days and 0 favorites → refresh copy/tags once; still dead after 30 more days → archive. A listing with a sale in its first 30 days → immediately produce {3–5} sibling variants (same niche, new designs/angles).
- **Niche-level:** a niche with 3+ sales across listings in 30 days → it gets 50% of next week's production slots. Zero sales across 20+ listings in 60 days → niche killed, post-mortem logged in `experiments.csv`.
- **Ad-level (when active):** kill a creative at ~2× target CPA spent with no purchase; scale +20–30% budget per 3 days while ROAS > breakeven ROAS = 1/net-margin%. Exact numbers set in `05-marketing/ads-system.md` from research benchmarks.

## Guardrails (imported from the FB-autoresponder project's hard lessons)

That project's history shows most post-launch commits were safety patches. We start with the guardrails instead of learning them:
1. **Approved-facts-only:** agents state only facts present in listing/supplier/tracker data. No invented claims, dates, or policies.
2. **Fail closed:** if data is ambiguous (is this message a buyer? is this order shipped?), do nothing and flag, rather than act.
3. **Caps:** ≤{20} new listings/day/platform (avoid platform spam flags), ≤${200}/day total auto-refunds (above → human), ≤1 outbound email per customer per event.
4. **No-touch list:** payout/bank settings, legal/policy responses to platforms, anything modifying Stripe beyond tracking-upload — always human.
5. **Idempotency:** every automated action writes an ID to the tracker first; agents check the log before acting (no double-refunds, double-sends, double-publishes).
6. **Tripwires** (auto-pause + escalate): dispute tripwire (compliance §4), supplier defect >4%, platform policy warning email received → that channel's automation pauses until a human clears it.
