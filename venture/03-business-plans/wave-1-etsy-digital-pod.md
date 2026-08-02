# Wave 1 Blueprint — Etsy Shop: Digital Products + POD (launching now)

**Model:** one Etsy shop, two product lanes. Digital products also dual-listed on Gumroad. Zero inventory, zero monthly fixed cost, payments handled by Etsy/Gumroad (Stripe untouched). Everything after account setup runs on the automation in `07-automation/`.

## Shop identity
- Working name: pick at signup (checklist has 3 vetted-available suggestions; criteria: 2 words, no trademark hits, works across gift niches, .com available for Wave 3).
- Positioning: personalized gifts + practical templates — "small US shop, fast responses, everything made to order just for you."

## Lane A — POD (Printify free plan → Etsy native publish)

**Launch niches (from research ranks 1, 2, 5):**
| Niche | Products | Price points | Est. net/sale after all fees |
|---|---|---|---|
| Personalized Christmas ornaments (pet memorial, first-Christmas, milestones) | Ceramic ornaments | $22.99–$29.99 | $9–15 |
| Personalized pet memorial art | Posters, canvas | $27.99–$44.99 | $12–22 |
| Profession micro-clusters (L&D nurse, kindergarten teacher squads) | Tees $24.99–27.99, sweatshirts $38.99–44.99 | | tee ~$6.50; sweatshirt ~$12–18 |

**Unit economics (worked, $24.99 tee, Printify free tier):** COGS ~$15.73 → Etsy fees $2.82 → **net ~$6.44 (26%)**. Sweatshirts and ornaments run higher %; personalization adds $5–8 to price at zero marginal cost — which is why every design ships with a personalized variant. At ~18 POD sales/mo, upgrade Printify Premium ($39/mo) and net jumps ~$2/tee.

**Launch volume:** 25–30 ornament listings (deadline: Labor Day — Q4 indexing), 15–20 memorial, 15–20 profession = 60–70 POD listings by mid-September, then +5–10/week steered by signal.

## Lane B — Digital (Etsy instant-download + Gumroad)

**Launch products (from research ranks 3, 4, 8):**
| Product | Build effort (AI-assisted) | Price | Net/sale |
|---|---|---|---|
| Budget-by-paycheck Google Sheets system (+ debt payoff, ADHD-friendly variants) | 2–4 days | $12.99–19.99 | ~$11–17 (Etsy ~89%) |
| Profession-specific business bundles (cleaners, pressure washers, HVAC, dog groomers: invoice + contract + intake + quote templates) | 2–3 days each | $24.99–49.99 | ~$22–44 |
| Wedding operational suites (seating chart, day-of timeline, hashtag signs — NOT invites) | 2–3 days | $14.99–29.99 | ~$13–26 |

**Bundle ladder rule:** any product with 3+ sales → build the $25 bundle → the $50 mega-bundle. Digital winners iterate at zero marginal cost.

**Why these:** budget spreadsheets have a predictable January demand spike (build catalog now, catch the wave); profession bundles exploit the owner's home-services domain knowledge in verticals nobody builds for; wedding ops items have demonstrated velocity (13 sales/day on a single competing bundle listing) with less saturation than invitations.

## Operating loop (all automated after setup — see `07-automation/`)
- Daily run: CS inbox → order health/delay-watcher → produce & publish the day's listings (via Printify publish API + Etsy Seller App API) → pull stats → NEEDS-HUMAN only if real.
- Weekly run: P&L rollup → kill/scale per listing/niche rules → next week's production slots → 10-line owner report.
- Pinterest: 10–15 pins/day auto-generated from new listings (Buffer free → Tailwind at volume).

## Targets & tripwires
- **30 days:** 60+ listings live, first sale (median expectation: silence is normal until ~week 4–8; the machine keeps listing).
- **60 days:** 100+ listings, ≥5 total sales or forced niche-refresh cycle kicks in.
- **90 days:** 150+ listings; any niche with 3+ sales/30d gets 50% of production slots; Q4 ornament peak carries October–December.
- **Kill discipline:** per `02-research/02-products-and-niches.md` §5 — <1% favorite rate + 0 sales at 100 views = refresh once, then archive.
- **Compliance always-on:** trademark screen before any design; production-partner + AI disclosures on every listing; new-shop throttle (first 5–10 listings manual-paced over days, agent bulk-publishing only after the shop is warmed up — new-Etsy-shop bot heuristics are a documented suspension trigger).

## Costs (total exposure)
One-time: Etsy setup $15–29 + ~$25 in listing fees + optional $30–60 for 2 product samples. Monthly: **$0** until sales volume justifies Printify Premium / eRank paid / Tailwind (~$50–65/mo combined, each with a stated break-even trigger). Worst case if zero sales ever: ~**$60–115 total burned.** That's the entire downside of Wave 1.
