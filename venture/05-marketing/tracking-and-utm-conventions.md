# Tracking & UTM Conventions — Know What Works, Kill What Doesn't

One rule: **no traffic effort without a measurement path.** If we can't attribute it, we don't spend on it (time or money).

## UTM scheme (own-store links only; marketplaces attribute internally)

`?utm_source={platform}&utm_medium={type}&utm_campaign={model}-{niche}&utm_content={asset-id}`

- `utm_source`: `pinterest`, `tiktok`, `meta`, `email`, `reddit`, `blog`
- `utm_medium`: `organic`, `paid`, `email`
- `utm_campaign`: e.g. `pod-nursehumor`, `digital-budgetplanner` (lowercase, hyphenless niche slugs, defined once in `tracker/experiments.csv`)
- `utm_content`: asset ID from the creative log, e.g. `pin-0042`, `vid-0013`

Asset IDs are assigned by the generation pipelines and logged with: creation date, channel, niche, creative angle/hook, destination listing. This is what makes "what's working" answerable by a script instead of a feeling.

## Source-of-truth metrics per channel

| Channel | Where numbers come from | Pulled by |
|---|---|---|
| Etsy | Shop stats (views, favorites, orders per listing) | Daily ops run (API/CSV export) |
| eBay | Seller Hub traffic report | Daily ops run |
| Gumroad | Sales API | Daily ops run |
| Own store | GA4 + Stripe | Daily ops run (GA4 Data API) |
| Email | ESP dashboard (open/click/revenue) | Weekly review |
| Paid ads (later) | Platform ads manager + UTM-matched GA4 conversions | Daily during active tests |

## KPI definitions (used identically everywhere)

- **Net margin per order** = price − platform fees − payment fees − COGS − shipping − allocated refund rate. (The per-model worked examples live in `03-business-plans/`.)
- **Breakeven ROAS** = 1 ÷ net margin %. (e.g., 30% net margin → any ad ROAS below 3.33 loses money.)
- **CAC ceiling (organic)** = time. An organic channel earning < $15/hour of human/VA time invested after 60 days gets killed too — time is spend.
- **Dispute rate** = disputes ÷ orders, rolling 30d (the tripwire metric).

## Experiment log (`tracker/experiments.csv`)

Every test — new niche, new channel, new creative angle, price change — gets a row: `id, start_date, hypothesis, channel, niche, budget/time, success_metric, threshold, deadline, outcome, decision`. The weekly review run closes out every row past its deadline with `scale / iterate / kill` — no zombie experiments.

*Benchmark numbers (CPMs, conversion rates, kill thresholds) are set in `ads-system.md` and `organic-playbook.md` from the research in `02-research/04-marketing-and-traffic.md`.*
