# Pipeline: POD Design → Live Listing

Run by the daily ops agent. Input: a niche from the active-niche list (weekly review assigns production slots). Output: live product listing(s) + tracker rows. Target: fully hands-free once shop + supplier accounts are connected.

## Steps

1. **Concept batch.** Generate {5} design concepts for the niche. Prompt frame:
   > You are designing print-on-demand {product type} for the "{niche}" audience. Study what this audience finds funny/meaningful: {niche notes from research}. Produce 5 distinct concepts. For each: the exact text/visual idea, the emotional hook (pride/humor/identity/gift-occasion), who buys it and for whom, and why it isn't generic. Avoid: any brand names, trademarked phrases, celebrity references, song lyrics, or existing designs.

2. **IP screen (mandatory, blocking).** For every phrase: search USPTO trademark database (tmsearch.uspto.gov) for live marks in relevant classes (25 apparel, 21 drinkware, 16 paper); common-sense check against brands/teams/characters/lyrics. Log each check in the design log (`concept, screened_date, result`). Any hit or doubt → discard concept. **No screen log = no listing.**

3. **Design generation.** Text-forward designs (typography does most POD selling): generate as high-res transparent PNG (4500×5400 for apparel) — AI image tools or programmatic SVG→PNG for pure-type designs. One design → light/dark variants.

4. **Product creation via supplier API** (Printify/Printful): create product from blueprint (tee/mug/poster per niche fit), attach print file, set variants.

5. **Pricing from the margin floor:** `list_price = max(niche_market_price, (base_cost + ship_share) / (1 − platform_fee% − target_margin%))`. Target net margin ≥ {30}% after ALL fees; if the niche's market price can't support it on this product type, switch product type or drop the concept.

6. **Listing copy** via `listing-copy-generator.md` (SEO title, 13 Etsy tags, description with gift-occasion framing, production-partner disclosure ON).

7. **Publish** via supplier's shop connection (Printify→Etsy native push) or platform API; if neither: package (files + copy + price) into `tracker/publish-queue/` for VA.

8. **Log:** new rows in `products.csv` + `listings.csv`; concepts and screen results appended to the design log.

## Caps & quality gates
- ≤ {20} new listings/day/platform; ≤ {3} niches in production at once (signal clarity beats volume).
- Every 10th run: order 0 samples (POD quality is supplier-standardized; instead, review supplier's per-product ratings quarterly and after any 2 defect reports on the same blueprint → switch print provider for that product).
- Sibling-variant rule: any sale within 30 days of listing → generate {3–5} sibling designs same niche next run.
