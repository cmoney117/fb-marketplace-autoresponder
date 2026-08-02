# Campaign Build Sheets — paste-ready (activates only per `ad-launch-runbook.md` caps)

Creatives: `creatives/ads/` (8 × 1080×1080, 4 hooks × 2 layouts) · `creatives/pins/` (8 × 1000×1500). Destination: bundle page + UTMs below. All copy passes compliance §7 (no income claims, no fake scarcity, no testimonials until we have real ones).

## Ad copy (Meta primary text ↔ matched to hooks)

- **h1-paycheck:** "Broke by Wednesday again? It's not a willpower problem — it's a monthly budget forced onto a biweekly life. This one budgets one paycheck at a time. Enter your check, give every dollar a job, done in 10 minutes." · Headline: "Budget by the paycheck, not the month" · CTA: Shop Now
- **h2-debtdate:** "Your debt already has an end date — you just can't see it yet. List every debt once and get the payoff month for each, snowball or avalanche. Knowing the date changes everything." · Headline: "See your debt-free date" · CTA: Shop Now
- **h3-zerodollar:** "$0 left over at the end of a paycheck — on purpose. Zero-based budgeting sounds intense; it's actually one yellow column and 10 minutes." · Headline: "Every dollar gets a job" · CTA: Shop Now
- **h4-newstart:** "The money reset you keep putting off takes 10 minutes and works in free Google Sheets. Budget + debt payoff + savings goals, one bundle, yours forever." · Headline: "3 tools. $29.99. Done." · CTA: Shop Now

## Pinterest pin titles/descriptions (keyword-mapped)

| Pin | Title | Description keywords |
|---|---|---|
| p1 | Budget Spreadsheet Template (Google Sheets + Excel) | budget spreadsheet template, zero based budget, budget planner digital download |
| p2 | Debt Snowball Tracker — See Your Debt-Free Date | debt snowball tracker, debt payoff tracker, debt free journey |
| p3 | Paycheck Budget That Actually Works | paycheck budget, biweekly budget, budget by pay period, zero based |
| p4 | Money Reset: Budget + Debt + Savings in One Bundle | budget bundle, money planner, savings tracker, finance spreadsheet |

## Meta build (exactly one campaign — per runbook)
Campaign: `WP-Bundle-Prospecting` · Objective: Sales · Budget: **$20/day at ad-set level (ABO)** · 1 ad set: US, 25–55, **broad (no interest stacks)**, Advantage placements · Optimization: Purchase · 3 ads to start: h1-A, h3-B, h4-A (add h2 in round 2) · **No edits for 7 days.** Pixel events required first: PageView + Purchase via Payment Link redirect to success.html.
UTM (destination = bundle page): `?utm_source=meta&utm_medium=paid&utm_campaign=digital-moneyreset&utm_content=h1-A` (per creative).

## Pinterest build
Campaign: `WP-Bundle-Search` · Objective: Conversions (fallback Consideration if account too new) · **$30/day** · 2 ad groups: (1) Budget keywords: "budget spreadsheet template", "budget template google sheets", "paycheck budget", "zero based budget", "biweekly budget", "budget planner digital"; (2) Debt/savings keywords: "debt snowball tracker", "debt payoff tracker", "savings tracker printable", "52 week challenge", "money saving challenge" · All 8 pins split across groups · Judge on 14–30 day windows only.
UTM: `utm_source=pinterest`, same convention.

## Order of operations at launch (agent-executed once ad accounts + links exist)
1. Pixels/tags installed → verify test events fire. 2. Pins published organically first (free, seeds boards). 3. Pinterest campaign live day 1; Meta day 1–2. 4. Daily: spend/CPA into `tracker/experiments.csv`; kill rules automatic. 5. Sunday report applies runbook gates.
