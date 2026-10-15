# Weighted cloak: unit economics and paid test plan

Written 2026-10-15 for Cody. Research was done this session; sources are listed at the bottom. The full grid is in `economics.csv`, with one row per price and landed-cost scenario.

**Still pending:** the sample (weight, lining, quality, packaging) and the real Temu prices per size (`supplier/temu-eden-cloak/latest/listing.json`). Every number below depends on the landed-cost column you are in. When the real cost arrives, pick the matching column. Section 9 explains how.

> Naming rule: this doc calls the established weighted-cloak brand "the category leader" and does not use its product or trademark names. The same applies to all customer-facing copy.

---

## 1. The answer

| Decision | Value | Why (short) |
|---|---|---|
| **Launch price** | **$99.00**, free shipping, no compare-at price | Matches the category leader's $99.99 sale price, so we are never the expensive option. It is the lowest price where the base-case ad cost comes close to breakeven. At $89 the margin is too thin to buy customers at 2025-26 apparel ad costs (section 6). |
| Compare-at / "was" price | **None ($0)** | We have never sold it at a higher price. A fake "was $199" price breaks FTC rules and our own compliance doc §7. |
| Contribution before ads at $99 and $40 landed | **$43.59 per order (44.0%)** | This is after Stripe fees and allowances for refunds, replacements and chargebacks (section 3). |
| **Breakeven CPA** | **$43.59** (ROAS 2.27) | At $35 landed it is $48.74 (ROAS 2.03). At $45 landed it is $38.44 (ROAS 2.58). |
| **Target CPA** | **$33.53** (ROAS 2.95) | Breakeven divided by 1.3, the low end of the house target range. The point of the test is to validate, not to maximise profit. |
| **Test budget** | **$840 of Meta spend over 14 days** (two phases of $420), with stop-losses | At the base-case CPA this buys about 18 orders, which is the owner's 10 to 20 order goal. The kill rules hold the realistic worst case to roughly a $300 loss (section 8). |
| **Customer delivery promise** | **"Ships in 1-4 business days. Arrives 5-11 business days after you order (US, tracked)."** | Valid **only if the Temu listing ships from a US "Local" warehouse.** If it ships from China, the honest promise is 10-22 business days, and we should not run ads on it (section 7). |
| Honest expectation | At the base case (CPA $46.67), the $840 test gives about **18 orders and about a $55 loss** | Breaking even needs a funnel about 7% better than the base assumption. At $35 landed the same funnel makes about +$2 per order. The test is mostly buying data on which creative, angle and page converts. |

**Three things must be cleared before the first ad dollar.** Section 8 has the details.
1. **House rule conflict:** `05-marketing/ads-system.md` says no ads to the own-store checkout until the store has had at least 25 organic orders, to protect the Stripe account. A paid test of 10 to 20 orders breaks that rule. Cody has to choose: waive it for this capped test, or route this product through a separate Stripe account (Cody creates it; we do not).
2. **House rule conflict:** `04-operations/refund-and-shipping-policies.md` says to list dropship items only if they are stocked in a US warehouse. If the Temu listing is not marked "Local", the item fails this rule.
3. **Temu account risk:** Temu's published terms (the UK version was checked; check the US version too) limit use to "your own use, and not on behalf of or for the benefit of any third party." Ordering for customers is plausibly against those terms. Third-party guides also say Temu flags accounts that send many orders to many different addresses. Treat Temu as a short test channel only, and keep a backup supplier ready.

---

## 2. Research inputs

| Input | Number | Source and date | How it is used |
|---|---|---|---|
| Stripe US online card fee | 2.9% + $0.30 per successful charge | Third-party 2026 Stripe fee guides; matches the existing account | Fee on every order |
| Stripe fee on refunds | **Not returned.** Stripe keeps the original processing fee | Stripe support, "Understanding fees for refunded payments" | Fee stays a cost even when the order is refunded |
| Stripe dispute fee | $15 per dispute, not refunded. Since 17 Jun 2025 there is an extra $15 "counter fee" if you contest, refunded if you win | Chargeflow / Justt summaries of Stripe's US fee change | Chargeback allowance uses $15 (we refund rather than fight) |
| International cards | +1.5% | 2026 Stripe fee guides | Not modelled (US-only ads) |
| Meta CPM, apparel and fashion | about $9-11 (2026) | ContentStudio 2026 | Low end of the CPM range |
| Meta CPM, all industries (median) | about $13.48 | Triple Whale 2025 data | Base CPM rounded up to $14 for Q4 and a small new account |
| Meta CPA, apparel and accessories | **$36.76**; platform median about $38 | Influee 2026 / Triple Whale | Benchmark CPA column in the grid |
| Meta ROAS, apparel and accessories | about 2.18 | Influee 2026 | Compared with our breakeven ROAS |
| Meta CTR / CPC, apparel (traffic campaigns) | 1.29% / $0.86 | LocaliQ 2025 | Sanity check on the CTR assumption |
| Meta conversion rate / AOV (all accounts) | 1.60% / $71.69 | Triple Whale (about 35k accounts, 2025) | Our $99 is about 38% above the average AOV, so we assume a new-store CVR, not an above-average one |
| Q4 cost pressure | Meta average price per ad +6% YoY in Q4 2025; CPMs +7% late Oct and +3% early Nov 2025; peak on Black Friday weekend | Darkroom (reading of Meta earnings), Geist Media, Lebesgue | Base CPM is $14, not $11. New tests stay off Black Friday week |
| TikTok CPM / CPA (all industries) | $13.26 / $32.74 (2025) | Triple Whale TikTok benchmarks | Not used for the first test |
| TikTok apparel | CPM about $4-9, ROAS about 2.49 | Benly / Topgrowth; Influee 2026 | Promising later |
| TikTok minimum budget | $50/day per campaign, $20/day per ad group | Several 2026 guides | One campaign would use the whole test budget, so TikTok waits |
| Online return rate | 19.3% of online sales (all categories) | NRF 2025 Retail Returns Landscape | Upper reference |
| Apparel online return rate | 24.4% (2023); range 20-40%; fit and sizing cause up to 70% of apparel returns | Coresight 2023; Richpanel 2026 | Our refund allowance logic (section 3) |
| Dropship returns | 16-20% general; 30-40% for clothing (vendor claims, no methodology) | dodropshipping / EPROLO guides | Stress case of 20% |
| Chargeback reality | One dropship company was fighting a 0.96% chargeback rate. Visa VAMP "excessive" tier is 1.5% (from Apr 2026, per some sources). Our internal red line is 0.4% | Chargeback.io case study; Chargeflow / emerchantpay; `compliance-and-risk.md` §4 | Chargeback allowance 1% |
| Temu US shipping origin | Since the US ended de minimis on 2 May 2025, Temu US sells through local sellers and warehouses, and China-shipped items show as out of stock | CNBC via NBC; CBS; Chain Store Age | Listing is likely "Local". **Confirm on listing.json / sample** |
| Temu delivery, local warehouse | 1-3 business days in transit (third-party claim). Temu says it "may take 1-3 days to process". Temu's US page no longer shows a fixed range (Sept 2026 review) | dodropshipping; amzprep (Jun 2026); Parcelmonitor | Delivery promise (section 7) |
| Temu delivery, China-direct | Standard 6-20 / 6-22 days; express 4-9 / 4-11 days. Sellers report real times running longer than estimates | Daily Dot; Global Sources; dodropshipping | Fallback promise |
| Temu shipping cost | Standard is free on most orders. Express is about $12.90 under $129 (third-party guides; no current official page found). **No evidence of any extra fee for shipping to a different address** | dodropshipping; Temu guides | The $45 landed column roughly covers paying for express |
| Temu late credit | $5 for late standard, $13 for late express (goes to our Temu account, not the customer) | ShipBob; Global Sources | Upside, not modelled |
| AliExpress (backup) | Choice 7-12 days; standard 15-30 days; express 5-10 business days (2026 guides) | FindNiche; Parcelmonitor | Backup supplier |

**How reliable these are:** the benchmark sources are vendor blogs and they disagree with each other. Only the Stripe refund rule comes from Stripe directly. The CPA benchmarks are for brands with reviews and repeat traffic. A new store with no reviews should expect worse numbers, which is why the base case below is more cautious than the medians.

---

## 3. Per-order assumptions

**Landed cost (L)** is everything paid to the supplier to get one unit to the customer: the item price for the chosen size and colour, plus shipping, plus **the sales tax Temu charges at checkout** (Temu collects tax for the ship-to state, roughly 6-10%), plus any import charge. Example: a $33.00 item with 7% tax and free standard shipping is $35.31 landed, so use the $35 column. The same item with $12.90 express shipping is about $48 landed, which is above the grid and means we should not use express.

| Line | Rule | Why |
|---|---|---|
| Stripe fee | 2.9% × P + $0.30 on every order | Stripe keeps it even when the order is refunded or disputed |
| COGS | L on every order | It ships before any refund happens |
| **Refund allowance** | **10% of orders fully refunded** (expected cost 0.10 × P), **item not recovered** | Online apparel returns run about 20-25% (NRF 19.3% all categories; Coresight 24.4% apparel). Up to 70% of those are fit and sizing, but this item comes in one cut sized by height, and buyers cannot order two sizes to return one. That halves the usual rate. Risks that push it back up: Temu-branded packaging (a customer who sees it on Temu for about $35 asks for money back), slower dropship delivery, quality variance between units, and our deliberately generous "keep it" refund policy (`refund-and-shipping-policies.md`). Returns to Temu are not counted, so every refund loses the full COGS. The stress case of 20% is in the grid. |
| Replacement allowance | 3% of orders get a second unit at cost L (wrong height size, defect, lost parcel) | A size exchange means buying a new unit, because the first one cannot go back. Temu sometimes refunds us for a lost or defective item; that is not counted. |
| Chargeback allowance | 1% of orders lost to a dispute: P + $15 fee | That is 2.5× our 0.4% red line, so the model holds even if we reach the point where ads must stop. One chargeback in a 20-order test is a 5% rate, so the tripwire in section 8 also applies. |
| Apps and tools | $0 | Static site (existing Vercel), Stripe Payment Links (no fee beyond processing), MailerLite free tier, Meta pixel |
| **Not modelled** | | Sales tax we collect (passed through to the customer; the Stripe fee on the tax adds about 3¢). Stripe Tax if enabled (about 0.5% of P, so −$0.50 at $99). International cards (+1.5%). Temu late credits and Temu return recoveries (both upside). Creative costs (Cody films the sample: $0; AI generation is unavailable). The sample (already paid). |

**Formula. All numbers are computed unrounded and rounded to cents at the end.**

```
Contribution before ads (CM) = P − (0.029P + 0.30) − L − 0.10P − 0.03L − 0.01(P + 15) − 0
                             = 0.861P − 1.03L − 0.45
Breakeven CPA   = CM                     (most you can pay Meta per order and still make $0)
Breakeven ROAS  = P ÷ CM                 (compare with Meta's "purchase ROAS", which uses gross order value)
Target CPA      = CM ÷ 1.3               Target ROAS = P ÷ Target CPA
Kill spend      = 1.5 × CM               (ad set spend with 0 purchases → off)
```

**Worked example: $99 at $40 landed**

| | $ |
|---|---:|
| Sale price | 99.00 |
| − Stripe fee (0.029 × 99 + 0.30 = 2.871 + 0.30) | −3.17 |
| − Landed cost | −40.00 |
| − Refund allowance (0.10 × 99) | −9.90 |
| − Replacement allowance (0.03 × 40) | −1.20 |
| − Chargeback allowance (0.01 × (99 + 15)) | −1.14 |
| − Tools | 0.00 |
| **= Contribution before ads = breakeven CPA** | **43.59** |
| Breakeven ROAS = 99 ÷ 43.589 | **2.27** |
| Target CPA = 43.589 ÷ 1.3 | **33.53** (ROAS 2.95) |
| Kill spend with 0 sales = 1.5 × 43.589 | **65.38** |

**The same waterfall at $40 landed for every price**

| Price | Stripe | Landed | Refund 10% | Replace 3% | Chargeback 1% | **CM = BE CPA** | CM % | BE ROAS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| $79 | 2.59 | 40.00 | 7.90 | 1.20 | 0.94 | **26.37** | 33.4% | 3.00 |
| $89 | 2.88 | 40.00 | 8.90 | 1.20 | 1.04 | **34.98** | 39.3% | 2.54 |
| $99 | 3.17 | 40.00 | 9.90 | 1.20 | 1.14 | **43.59** | 44.0% | 2.27 |
| $109 | 3.46 | 40.00 | 10.90 | 1.20 | 1.24 | **52.20** | 47.9% | 2.09 |
| $119 | 3.75 | 40.00 | 11.90 | 1.20 | 1.34 | **60.81** | 51.1% | 1.96 |

---

## 4. Margin grid: all 20 scenarios

The recommended launch scenario is in **bold**. Every row is in `economics.csv` with all of its columns.

**Breakeven CPA ($ of ad spend per order that nets $0)**

| Sale price | Landed $30 | Landed $35 | Landed $40 | Landed $45 |
|---|---:|---:|---:|---:|
| $79 | $36.67 | $31.52 | $26.37 | $21.22 |
| $89 | $45.28 | $40.13 | $34.98 | $29.83 |
| $99 | $53.89 | $48.74 | **$43.59** | $38.44 |
| $109 | $62.50 | $57.35 | $52.20 | $47.05 |
| $119 | $71.11 | $65.96 | $60.81 | $55.66 |

**Breakeven ROAS (Meta purchase ROAS below this loses money)**

| Sale price | Landed $30 | Landed $35 | Landed $40 | Landed $45 |
|---|---:|---:|---:|---:|
| $79 | 2.15 | 2.51 | 3.00 | 3.72 |
| $89 | 1.97 | 2.22 | 2.54 | 2.98 |
| $99 | 1.84 | 2.03 | **2.27** | 2.58 |
| $109 | 1.74 | 1.90 | 2.09 | 2.32 |
| $119 | 1.67 | 1.80 | 1.96 | 2.14 |

The Meta apparel benchmark ROAS is about 2.18. Cells **above** 2.18 lose money at benchmark performance. At $40 landed, that is every price of $99 or lower.

**Contribution margin before ads (% of price)**

| Sale price | Landed $30 | Landed $35 | Landed $40 | Landed $45 |
|---|---:|---:|---:|---:|
| $79 | 46.4% | 39.9% | 33.4% | 26.9% |
| $89 | 50.9% | 45.1% | 39.3% | 33.5% |
| $99 | 54.4% | 49.2% | **44.0%** | 38.8% |
| $109 | 57.3% | 52.6% | 47.9% | 43.2% |
| $119 | 59.8% | 55.4% | 51.1% | 46.8% |

**Target CPA (breakeven ÷ 1.3) and target ROAS**

| Sale price | Landed $30 | Landed $35 | Landed $40 | Landed $45 |
|---|---:|---:|---:|---:|
| $79 | $28.21 (2.80) | $24.25 (3.26) | $20.28 (3.89) | $16.32 (4.84) |
| $89 | $34.83 (2.56) | $30.87 (2.88) | $26.91 (3.31) | $22.95 (3.88) |
| $99 | $41.45 (2.39) | $37.49 (2.64) | **$33.53 (2.95)** | $29.57 (3.35) |
| $109 | $48.08 (2.27) | $44.11 (2.47) | $40.15 (2.71) | $36.19 (3.01) |
| $119 | $54.70 (2.18) | $50.74 (2.35) | $46.78 (2.54) | $42.81 (2.78) |

**Kill spend: ad set spend with 0 purchases at which it is turned off (1.5 × breakeven CPA)**

| Sale price | Landed $30 | Landed $35 | Landed $40 | Landed $45 |
|---|---:|---:|---:|---:|
| $79 | $55.00 | $47.28 | $39.55 | $31.83 |
| $89 | $67.92 | $60.19 | $52.47 | $44.74 |
| $99 | $80.83 | $73.11 | **$65.38** | $57.66 |
| $109 | $93.75 | $86.02 | $78.30 | $70.57 |
| $119 | $106.66 | $98.94 | $91.21 | $83.49 |

**Profit per order after ads, at the Meta apparel benchmark CPA ($36.76)**

| Sale price | Landed $30 | Landed $35 | Landed $40 | Landed $45 |
|---|---:|---:|---:|---:|
| $79 | −$0.09 | −$5.24 | −$10.39 | −$15.54 |
| $89 | $8.52 | $3.37 | −$1.78 | −$6.93 |
| $99 | $17.13 | $11.98 | **$6.83** | $1.68 |
| $109 | $25.74 | $20.59 | $15.44 | $10.29 |
| $119 | $34.35 | $29.20 | $24.05 | $18.90 |

**Profit per order after ads, at our new-store base-case CPA ($46.67, section 5)**

| Sale price | Landed $30 | Landed $35 | Landed $40 | Landed $45 |
|---|---:|---:|---:|---:|
| $79 | −$10.00 | −$15.15 | −$20.30 | −$25.45 |
| $89 | −$1.39 | −$6.54 | −$11.69 | −$16.84 |
| $99 | $7.22 | $2.07 | **−$3.08** | −$8.23 |
| $109 | $15.83 | $10.68 | $5.53 | $0.38 |
| $119 | $24.44 | $19.29 | $14.14 | $8.99 |

**Stress case: 20% of orders refunded (instead of 10%). Breakeven CPA (breakeven ROAS)**

| Sale price | Landed $30 | Landed $35 | Landed $40 | Landed $45 |
|---|---:|---:|---:|---:|
| $79 | $28.77 (2.75) | $23.62 (3.34) | $18.47 (4.28) | $13.32 (5.93) |
| $89 | $36.38 (2.45) | $31.23 (2.85) | $26.08 (3.41) | $20.93 (4.25) |
| $99 | $43.99 (2.25) | $38.84 (2.55) | **$33.69 (2.94)** | $28.54 (3.47) |
| $109 | $51.60 (2.11) | $46.45 (2.35) | $41.30 (2.64) | $36.15 (3.02) |
| $119 | $59.21 (2.01) | $54.06 (2.20) | $48.91 (2.43) | $43.76 (2.72) |

Every 1 point of refund rate costs $0.99 per order at $99. If real refunds hit 20%, the $99/$40 breakeven CPA falls to the old target CPA. That is why the refund rate is an ops tripwire in section 8.

---

## 5. What CPA to expect: funnel math

`CPA = CPM ÷ (1,000 × link CTR × click-to-purchase rate)`

| Case | CPM | Link CTR | Click → purchase | Purchases per 1,000 impressions | **CPA** | vs $99/$40 breakeven ($43.59) |
|---|---:|---:|---:|---:|---:|---|
| Pessimistic (weak creative, Q4 CPM) | $18 | 1.0% | 1.0% | 0.10 | **$180.00** | Kill rules stop this within about $65 per ad set |
| **Base (new store, no reviews)** | $14 | 1.5% | 2.0% | 0.30 | **$46.67** | −$3.08 per order |
| Optimistic (strong demo video, gift season) | $11 | 2.0% | 3.0% | 0.60 | **$18.33** | +$25.26 per order |

Why the base case is 0.30 purchases per 1,000 impressions: Triple Whale's medians (CPM about $13.48, CPA about $38) work out to about 0.35 for established accounts. A store with no reviews, selling a $99 item to cold traffic, should assume a bit less. The base case is a planning number, not a forecast. The test exists to replace it with real data.

**How much better than base the funnel has to be to break even** (at a $14 CPM):

| Price | Landed $35 | Landed $40 |
|---|---:|---:|
| $79 | +48% | +77% |
| $89 | +16% | +33% |
| **$99** | already −4% (profitable at base) | **+7%** |
| $109 | −19% (profitable at base) | −11% (profitable at base) |
| $119 | −29% | −23% |

---

## 6. Price recommendation: $99.00, competing on value rather than discount

**The market:**

| Seller | Price | Note |
|---|---|---|
| Category leader (weighted, lined cloak) | $99.99 "sale" / $199.99 "list" | About 800 on-site reviews at 4.94★, plus Trustpilot. Positioned on mental health, which we do not copy |
| Weighted hoodie (another brand, Walmart) | about $160 | |
| Cheap marketplace copy | $29.99 | 2.5★. Cheap copies fail on quality |
| Unweighted sherpa blanket hoodie | $49.99 retail (Bedsure); $19-43 AliExpress | A different product; no weight |

**Why not $79 or $89 (undercutting):**
- At $40 landed, $89 leaves a $34.98 breakeven CPA, which is below the Meta apparel median CPA ($36.76). Average performance would lose about $1.78 per order. Base-case performance would lose about $11.69 per order. To match $99's breakeven, the $10 cut would have to raise conversion by about 33% at $40 landed (16% at $35), which a 10% price cut rarely does for an impulse comfort buy. $79 needs +48% to +77%.
- Undercutting the leader by $10 does not close the gap that matters, which is trust: about 800 reviews against none. Money spent on a discount is better spent on proof (real video of the sample, a strong guarantee) and on creative.

**Why not $109 or $119 yet:** they are the most profitable cells, and $109 is profitable even at the base case. But until we have our own reviews, a no-name brand priced above the leader's sale price will lose comparison shoppers. Test $109 later (see below).

**How $99 competes on value, using only claims we can back:**
1. Free shipping included, and an honest delivery date on the page.
2. A 30-day "if it isn't the coziest thing you own, we refund you" guarantee. A photo is enough, and the customer keeps it. That is the house policy, and the 10% refund allowance pays for it.
3. Real footage of the actual sample: the weight on a scale, the drape, the lining, a height-to-size chart. Weight and material claims come from the sample, from one central config, never from the supplier page.
4. Gift positioning for Q4 ("for the person who's always cold"). This is comfort language only: no anxiety, therapy or treatment claims, and no ads to under-18s.

**Optional add-ons. Test them after Phase 1, not at launch:**
- **2-pack at $179** (one to keep, one to gift). At $40 landed per unit: Stripe $5.49, CM **$71.27**, breakeven ROAS 2.51. That is **$27.68 more profit per conversion** than a single unit, if the conversion rate holds. At $35 landed: CM $81.57. Do not offer it until we know Temu ships two units on time to one address.
- **Launch code** ($10 off the first 50 orders, for an effective $89): legal as a discount from a real current price. But at $40 landed the breakeven CPA falls to $34.98, so only use it if Phase 1 CTR is good and checkout conversion is the weak step.
- **Price step-up:** after 10 or more genuine reviews, test $109. At $40 landed the breakeven CPA rises to $52.20 and the base case turns profitable (+$5.53 per order).

---

## 7. Delivery promise for a dropshipped order

**The chain when the Temu listing ships from a US "Local" warehouse:**

| Step | Business days | Basis |
|---|---:|---|
| Customer pays → Cody places the Temu order to the customer's address | 0-1 | Manual step. Orders on weekends wait until Monday |
| Temu processing → handed to carrier | 1-3 | Temu's own shipping page: "may take 1-3 days to process" |
| Transit (USPS does final delivery) | 1-5 | Third-party guides say 1-3 business days for local items. Allow 5 for cross-country and real-world slippage |
| **Real window** | **2-9** | |
| House padding (+2 business days on the top end, per `refund-and-shipping-policies.md`) | +2 | |
| **Promise** | **Ships in 1-4 business days. Arrives 5-11 business days after you order.** | US only, tracking emailed |

**If the listing ships from China** (no "Local" tag, or the sample arrives with Chinese postage): standard is 6-22 days and express is 4-11 days. Real times often run longer than Temu's estimate, and there may be import charges. The honest promise would be **"arrives in 10-22 business days."** That breaks the house US-warehouse-only rule and would raise refunds and chargebacks. **Do not run paid ads on a China-direct listing.** Find a Local listing of the same item, use an AliExpress Choice listing (7-12 days quoted), or hold a small stock in the US.

**Shipping to a customer's address on Temu:**
- **Cost:** no evidence of any extra fee for using a different address. Standard shipping is free on most orders. Express is about $12.90 under $129, per third-party guides (check at checkout, because there is no current official page). Express would push landed cost to about $45-48, so promise standard only.
- **Rules:** Temu's terms limit use to "your own use, not on behalf of ... any third party" (UK §3.1 seen; check the US terms). Third-party guides say Temu watches for one account ordering to many addresses. Keep the test small (20 orders or fewer), do not reuse a business-critical Temu account, and keep a backup supplier ready.
- **Packaging:** Temu parcels may carry Temu branding or a packing slip with the price. If the sample does, customers will see it. That is a refund and chargeback risk already priced into the 10% allowance. If the slip shows a price, it is a reason to switch supplier.
- **Delays:** if an order will miss the promised date, the T2 delay email goes out (notify, give a new date, offer a refund). This is the FTC 30-Day Rule, per `compliance-and-risk.md` §1.

**Record from the sample order** (it is the only real data point): order date and time, ship date, delivery date, carrier, origin (Local or China), packaging photos, any price slip, the weight on a kitchen scale, and the lining material.

**Q4 cutoffs (Local listing, 5-11 business days + 2 days peak slack):** last order date for delivery by Wed 23 Dec is **Fri 4 Dec 2026**. Gift-angle ads and "arrives by Christmas" wording stop Thu 3 Dec. For China-direct it would be about Tue 17 Nov. Holidays counted: Veterans Day 11 Nov and Thanksgiving 26 Nov.

---

## 8. Test plan: $840, 14 days, Meta only

**Before the first dollar (all must be true):**
1. The sample matches: weight and lining confirmed, quality acceptable, packaging acceptable. Weight and material claims are switched on in the central config only if the sample confirms them.
2. The listing is confirmed "Local", and the delivery promise above is put on the page, the checkout and the confirmation email.
3. Landed cost is confirmed from listing.json and the sample receipt, so we know which column we are in. If landed is above $45, stop and re-price (section 9).
4. Real creative exists: 6-9 short videos and photos of the sample, filmed by Cody. **Never use supplier images.** If the supplier is the same factory as the category leader, its photos may be the leader's own.
5. Stripe Payment Link at $99, statement descriptor set, Radar on. Meta pixel firing Purchase on the thank-you page. UTMs per `tracking-and-utm-conventions.md`.
6. Cody approves the $840 cap in writing and decides on the 25-organic-orders rule and the Stripe account question (section 1).

**Structure:** one Meta Sales campaign, ABO, optimising for Purchase, US only, ages **18+** (never under 18), broad targeting, Advantage+ placements. No edits for 72 hours after launch except the kill rules. TikTok waits: its $50/day campaign minimum would use most of the budget.

| Ad set (one angle each, 2-3 creatives) | Daily | Example hook (comfort language only) |
|---|---:|---|
| A: "Wearable weighted blanket" product demo | $20 | "It's a blanket. It's a hoodie. It weighs about [X] lb." [X] comes from the sample, via config |
| B: Homebody / do-not-disturb mode | $20 | "My social battery after 5pm:" |
| C: Gift for the person who's always cold | $20 | "Found the gift for the friend who steals every blanket." |

| Phase | Days | Spend cap | Goal | Gate to continue |
|---|---|---:|---|---|
| 1: Angle test | 1-7 | $420 (3 × $20 × 7) | Find which angles get purchases | Blended CPA ≤ 1.5 × breakeven ($65.38), so at least 7 purchases on $420, **and** at least one ad set at or below breakeven |
| 2: Confirm | 8-14 | $420 (about $60/day on the surviving ad sets, plus fresh creatives built from the winning hook) | Reach 10-20 total orders and a stable CPA | See "after day 14" |
| **Total** | 14 | **$840** | | |

**Kill and scale rules.** B is the breakeven CPA and T is the target CPA from your landed column. The dollar figures are for $99 at $40 landed: B = $43.59, T = $33.53.

| Level | Rule | $ at $99/$40 |
|---|---|---:|
| Ad (creative) | After $15 spent (about 1,000 impressions), link CTR below 0.8% → turn the ad off | $15.00 |
| Ad (creative) | Spend ≥ 1.0 × B with 0 add-to-carts → off | $43.59 |
| **Ad set** | **Spend ≥ 1.5 × B with 0 purchases → off** | **$65.38** |
| Ad set | Spend ≥ 3 × B with fewer than 3 purchases (CPA above breakeven) → off | $130.77 |
| Ad set | CPA between T and B → leave alone (no edits; judge weekly, not daily) | $33.53-$43.59 |
| **Scale** | At least 3 purchases and CPA ≤ T over the last 3+ days → budget +20%, no more than once every 48-72 hours (house rule: never more than +20%/day) | ≤ $33.53 |
| Page diagnosis | 300 or more link clicks, CTR at least 1.2%, but click-to-purchase below 1% → **pause and fix the page**, not the ads (price display, delivery promise, photos, guarantee) | |
| Checkout diagnosis | Add-to-cart rate at least 8% but fewer than 30% of carts reach payment → fix checkout friction (surprise shipping or tax, the Stripe link handoff) | |
| **Campaign stop-loss** | Total spend reaches $300 with 2 or fewer purchases → **all ads off**. Rebuild the offer or creative. Any re-test is limited to $150 and comes out of Phase 2's $420, never on top of it | $300 |
| Hard cap | Total spend never goes above $840 without a new written approval | $840 |

**Ops tripwires (stop ads at once, regardless of CPA):** any chargeback; 2 or more orders delivered after the promised date; refunds above 20% of delivered orders; any warning or flag from Temu on the account; the sample or the first orders show weight or material that differs from the page (pull the claims through the central config first). After 20 orders there is a mandatory review of delivery times, refunds and reviews before any scaling.

**After day 14:**
- Total CPA ≤ B (19 or more orders on $840): profitable. Scale per the house rules (ROAS ≥ breakeven × 1.3 over 7 days → +20%), add the 2-pack, and start ordering some inventory for faster shipping.
- CPA between B and 1.5 × B: close. Hold budget flat at no more than $40/day, ship new creatives built from the best hook, test the 2-pack, and push for a lower landed cost.
- CPA above 1.5 × B: stop paid ads on this product. The data (CTR, add-to-cart rate, checkout rate) shows which step failed.

**What $840 buys at different CPAs ($99 at $40 landed, CM $43.59)**

| Realised CPA | Orders on $420 | Net on $420 | Orders on $840 | Net on $840 |
|---:|---:|---:|---:|---:|
| $18.33 (optimistic) | 22.9 | +$578.79 | 45.8 | +$1,157.58 |
| $24.44 | 17.2 | +$329.09 | 34.4 | +$658.18 |
| $36.76 (Meta apparel median) | 11.4 | +$78.04 | 22.9 | +$156.07 |
| $43.59 (breakeven) | 9.6 | $0.00 | 19.3 | $0.00 |
| $46.67 (base case) | 9.0 | −$27.72 | 18.0 | −$55.44 |
| $60.00 | 7.0 | −$114.87 | 14.0 | −$229.74 (Phase 2 would not unlock: 7 < gate) |
| $80.00 | 5.2 | −$191.15 | n/a (stopped at the Phase 1 gate) | n/a |

Net = orders × $43.59 − spend. The worst realistic loss with the rules followed: about $196 if all three ad sets are killed at $65.38 with no sales, up to about $300 at the campaign stop-loss. Passing the Phase 1 gate and then ending Phase 2 at 1.5 × B loses about $280.

**Cash needed:** about $840 for ads, plus a COGS float (Cody pays Temu when each order is placed; Stripe pays out on a rolling 2-business-day schedule on an established account, so about 3 days of orders, roughly $300-400). Plan on **about $1,300 available**. The sample is already paid.

**Calendar example** (Day 1 = the first weekday after all six gates clear):
- If Day 1 is Mon 26 Oct: Phase 1 runs 26 Oct to 1 Nov, Phase 2 runs 2-8 Nov, review on Mon 9 Nov. The first orders would arrive about 2-10 Nov.
- Do not start a *new* test in Black Friday week (BF is Fri 27 Nov 2026). CPMs peak then. Keep only winners running.
- If the gates slip past about 16 Nov, run Phase 1 and then decide whether to wait for the late-December slump in CPMs rather than paying peak prices with an unproven page.

---

## 9. Updating this when the supplier data arrives

1. Open `supplier/temu-eden-cloak/latest/listing.json`. For each size and colour you will sell, take `skus[].priceUsd`. Use the **highest** price among the sizes you will offer, because sizes often cost different amounts. Check `shipping` for "Local warehouse" or "free shipping".
2. Landed = that price + shipping (if any) + sales tax at about 7-10% (use the actual tax line from the sample receipt) + any import charge. Then pick the column, rounding up.
3. Read the row for $99 from `economics.csv` (and $109 for comparison). The kill and scale dollar figures in section 8 come from `breakeven_cpa`, `target_cpa` and `kill_spend_zero_sales` in that row.
4. Decision rules by landed cost:
   - **$35 or less:** keep $99. Breakeven CPA $48.74 or more, and the base case is profitable. Do not cut the price; spend the margin on creative and the guarantee.
   - **$35-40:** keep $99 and use the $40 column (this document's default).
   - **$40-45:** $99 needs ROAS 2.58 at $45. Lead with the 2-pack ($179) to raise profit per conversion, or launch at $109 if the sample clearly beats the leader on materials or weight.
   - **Above $45:** the item does not work at $99 with paid ads (breakeven CPA below $38.44). Find a cheaper supplier, hold inventory (bulk freight is cheaper per unit), or sell only organically.
5. Off-grid scenarios can be recomputed with the formula `CM = 0.861P − 1.03L − 0.45`. For example, P = $99 and L = $37.50 gives 85.239 − 38.625 − 0.45 = **$46.16 breakeven CPA**, ROAS 2.14. If the refund assumption changes to rate R, the 0.861 becomes (0.961 − R).

---

## Sources

- Stripe fees (2.9% + 30¢; +1.5% international): [Flexprice 2026](https://flexprice.io/blog/stripe-pricing-breakdown-2026), [Superdupr 2026](https://superdupr.com/blog/stripe-fees), [Dodo Payments calculator](https://dodopayments.com/blogs/stripe-fees-calculator)
- Stripe keeps fees on refunds: [Stripe support: Understanding fees for refunded payments](https://support.stripe.com/questions/understanding-fees-for-refunded-payments)
- Stripe dispute and counter fees: [Chargeflow: Stripe dispute fees](https://www.chargeflow.io/blog/stripe-dispute-fees), [Justt: Stripe's new dispute fees](https://justt.ai/blog/stripe-dispute-fee)
- Card network monitoring thresholds: [emerchantpay: Visa VAMP 2025](https://www.emerchantpay.com/amp/insights/visas-new-vamp-rules-2025-what-merchants-need-to-know), [Chargeflow: VAMP guide](https://www.chargeflow.io/blog/what-are-visas-new-vamp-rules-a-2025-guide-for-merchants), [Shopify: monitoring programs](https://help.shopify.com/en/manual/payments/shopify-payments/managing-chargebacks/monitoring-programs)
- Dropship chargeback example: [Chargeback.io: Dropship.io case study](https://www.chargeback.io/blog/dropship-io-case-study)
- Meta benchmarks: [Triple Whale: Facebook ads benchmarks](https://triplewhale.com/blog/facebook-ads-benchmarks), [Influee: Facebook ads benchmarks 2026](https://influee.co/blog/facebook-ads-benchmarks), [Influee: average CPA](https://influee.co/blog/average-cpa-facebook-ads), [ContentStudio: Meta ads benchmarks 2026](https://contentstudio.io/blog/meta-ads-benchmarks), [LocaliQ: Facebook advertising benchmarks](https://localiq.com/blog/facebook-advertising-benchmarks/)
- Q4 CPM: [Darkroom: BFCM paid media plan](https://www.darkroomagency.com/observatory/the-bfcm-paid-media-plan), [Geist Media: Q4 2025 ad rate trends](https://geistm.com/tag/campaign-optimization), [Lebesgue: how to run Facebook ads](https://lebesgue.io/facebook-ads/how-to-run-facebook-ads-in-2022)
- TikTok: [Triple Whale: TikTok benchmarks](https://www.triplewhale.com/blog/tiktok-benchmarks), [Influee: TikTok ads benchmarks 2026](https://influee.co/blog/tiktok-ads-benchmarks), [Darkroom: TikTok cost 2026](https://darkroomagency.com/observatory/how-much-does-tiktok-advertising-cost-in-2026), [Tlinky: TikTok minimum budget 2026](https://tlinky.com/tiktok-ads-minimum-budget/), [Topgrowth: TikTok ads cost](https://topgrowthmarketing.com/tiktok-ads-cost/page/2/?et_blog)
- Returns: [Richpanel: ecommerce return rates](https://www.richpanel.com/blog/ecommerce-return-rates), [Red Stag: average return rates](https://redstagfulfillment.com/average-return-rates-for-ecommerce/), [Size.ly: ecommerce return statistics](https://www.size.ly/blog/ecommerce-return-statistics), [dodropshipping: returns from China](https://dodropshipping.com/dropshipping-from-china-returns/), [EPROLO: clothing return solutions](https://eprolo.com/clothing-dropshipping-return-solutions)
- Temu US model and shipping: [CNBC via NBC: Temu halts shipping direct from China](https://www.nbcchicago.com/news/business/money-report/temu-halts-shipping-direct-from-china-as-de-minimis-tariff-loophole-is-cut-off/3736633/), [CBS News](https://www.cbsnews.com/amp/news/temu-halts-shipments-to-us-from-china-de-minimis-tariffs), [Chain Store Age](https://chainstoreage.com/temu-reportedly-ends-us-direct-shipments-china), [KTVU: Temu import charges](https://www.ktvu.com/news/temu-import-charges-trump-tariffs-what-know), [Parcelmonitor: Temu shipping time](https://www.parcelmonitor.com/blog/temu-shipping-time-tracking), [dodropshipping: Temu shipping time](https://dodropshipping.com/temu-shipping-time/), [dodropshipping: where does Temu ship from](https://dodropshipping.com/where-does-temu-ship-from), [amzprep: Temu warehouse guide (Jun 2026)](https://amzprep.com/where-is-temu-warehouse-located/), [SlashGear: Temu to USA](https://www.slashgear.com/1433139/how-long-does-it-take-temu-ship-usa/), [Global Sources: Temu shipping](https://www.globalsources.com/knowledge/how-long-does-temu-take-to-ship/), [Branvas: Temu dropshipping risks 2026](https://branvas.com/blogs/news/temu-dropshipping-risks-alternatives)
- Temu terms ("own use"): [Temu UK terms of use](https://temu.com/uk/terms-of-use.html)
- AliExpress delivery: [FindNiche: AliExpress shipping time 2026](https://findniche.com/blog/aliexpress-shipping-time), [Parcelmonitor: AliExpress shipping](https://www.parcelmonitor.com/blog/aliexpress-shipping-time-tracking)
- Internal: `05-marketing/ad-launch-runbook.md`, `05-marketing/ads-system.md`, `05-marketing/tracking-and-utm-conventions.md`, `04-operations/refund-and-shipping-policies.md`, `04-operations/compliance-and-risk.md`
