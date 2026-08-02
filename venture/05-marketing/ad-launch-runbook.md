# Ad Launch Runbook — $50/day, Hard Caps, No Wasted Money

Owner directive (2026-08-02): *"We HAVE to be profitable, I will not waste money."* This runbook encodes that: **every dollar has a predefined job, a decision gate, and a maximum loss before automatic shutoff.** Built from `02-research/06-paid-ads-fast-lane.md`.

## The at-risk ledger (worst-case, before ads earn a cent)

| Phase | Spend | Hard cap / tripwire |
|---|---|---|
| Week 0 setup | $0–110 (optional AI-video tool only if needed; static creatives are $0) | — |
| Week 1 test | $350 | Auto-pause if 0 add-to-carts by day 5 |
| Week 2 test | $350 | **Cumulative stop-loss: <$250 revenue by day 14 → ads OFF, offer rebuilt** |
| **Max at-risk to find out if the funnel works** | **≈$700–810** | Nothing scales until a profitable week is banked |

Scaling only happens FROM profit: budget increases (+20%/day max) require blended ROAS ≥1.3 over a trailing 7 days. The weekly review enforces; the owner sees every change in the Sunday report.

## Product & offer (per research — the math that makes $50/day survivable)

- **Ad product: Money Reset Bundle $29.99** (never the $14.99 singles — breakeven CPA ~$17 vs Meta's $30-38 median CPA loses by design).
- **Order bump at checkout: +$9–12 add-on** (Stripe Checkout native optional line item, $0 tooling) → target **AOV ≥ $33, breakeven CPA ≈ $30**.
- Target CPA: **$22** (ROAS ~1.5). Kill thresholds calibrated to it below.

## Platform sequence

1. **Pinterest $30/day** — keyword-targeted ("budget spreadsheet template", "debt snowball tracker", "paycheck budget", "zero based budget", "budget planner digital"), 5–8 pin variants, judge on 14–30 day windows (save-now-buy-later lag is real).
2. **Meta $20/day** — ONE campaign, ONE broad ad set (US, no interest stacks), 3 creatives, Purchase optimization, zero edits for 7 days. Learning-Limited is expected and fine at this budget; judge weekly blended ROAS only.
3. TikTok: not until organic content exists (its $50/day campaign minimum eats the whole budget — parked).

## Kill / scale rules (automatic flags in the weekly run; owner approves scale-ups)

- Creative: $66 spent (3× target CPA), 0 purchases → kill. $33 spent, 0 add-to-carts → kill early.
- Page: CTR ≥1% but conversion <0.8% over 300 clicks → pause ads, fix the PAGE (ads aren't the problem).
- Campaign: $250–400 spent, 0 purchases, no ATC pattern → full stop + offer rebuild.
- Scale: ROAS ≥1.3 × 7 days AND ≥3 purchases → +20%/day toward $75/day. Never >20%/day (learning reset). Winning hook → next creative batch's brief.
- **Never** kill a profitable-but-noisy campaign on a daily read at 1–2 sales/day volume.

## Calendar (locked to the research)

- **Aug:** evergreen digital funnel only. **No gift ads in August — that's paying full price to advertise Christmas to nobody.**
- **~Sept 20–Oct 1:** POD gift testing starts, $10–15/day Pinterest-only (holiday planners arrive there first); gift SKUs rebuilt for AOV ≥$40 (multipacks) before a dollar is spent.
- **Nov:** gifts take 70%+ of budget; BFCM CPMs run +50–80% — acceptable only because conversion peaks harder.
- **Dec 5–8:** last standard-shipping ad date (POD cutoffs) → express-only messaging → **Dec 14 stop** Christmas promises.
- **Dec 26–mid-Jan ("Q5"):** CPMs 20–28% below Q4 while New-Year budget-spreadsheet demand peaks — our single best ad window of the year; budget swings back to digital.

## Tracking & truth
Every ad UTM-tagged per `tracking-and-utm-conventions.md`; GA4 + Meta pixel + Pinterest tag client-side (server-side only at $1–2k/mo spend); weekly dashboard = spend, revenue by UTM, per-creative CPA, blended MER. The P&L in `tracker/pnl-weekly.csv` counts ad spend against profit the same week it's spent — no "investment phase" accounting games.
