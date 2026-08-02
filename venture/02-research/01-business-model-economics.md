# Research: Four Online-Selling Business Models — Economics Deep-Dive (August 2026)

**Scope:** Print-on-demand (POD), classic dropshipping, digital products, and online/retail arbitrage — evaluated for a solo US-based operator prioritizing maximum automation and minimum upfront investment, who plans to reuse an existing Stripe account.

**Methodology note:** Figures come from platform-published fee schedules, industry surveys (Jungle Scout, TrueProfit, Sift), and vendor blogs. Where a number originates from a tool vendor, supplier, or course-seller with an incentive to inflate, it is flagged **[self-reported/promotional]**. "Median" and "good case" profit figures for months 3/6/12 are **synthesized estimates** built from the cited failure rates, margin data, and timeline data — no rigorous longitudinal dataset of solo sellers exists for any of these models. Treat them as directional, not precise.

---

## Model 1: Print-on-Demand (Printful/Printify/Gelato → Etsy and/or own store)

### Startup costs
| Item | Cost |
|---|---|
| Etsy shop setup fee (one-time, charged to most new US shops) | $15–$29 ([eRank](https://help.erank.com/blog/understanding-etsys-new-15-setup-fee/), [InsideOutlined](https://insideoutlined.com/2025/04/etsy-shop-setup-fee-everything-to-know/)) |
| Etsy listings, 20–40 × $0.20 | $4–$8 |
| Printful/Printify/Gelato account | $0 (free plans) ([Printify pricing](https://www.ecommerceceo.com/printify-pricing/), [Printful pricing](https://avada.io/blog/printful-pricing/)) |
| Product samples (2–4 items, ~$15–$30 each shipped) | $30–$120 |
| Canva Pro (design) | $15/mo or $120/yr ([Orb](https://www.withorb.com/blog/canva-pricing)) |
| **Minimum viable spend** | **~$65–$175** (Etsy route) |

Own-store route adds Shopify Basic at ~$39/mo ([Popupsmart](https://popupsmart.com/blog/how-much-does-it-cost-to-start-dropshipping-on-shopify)) plus ad spend, which changes the economics entirely (see dropshipping section for ad math).

### Monthly fixed costs at small scale
$0–$55/mo: free supplier plan + Canva Pro ($15). Optional: Printify Premium $39/mo (or $24.99/mo annual) for ~20% product discounts; Printful Growth $24.99/mo (breaks even around 10–15 apparel orders/mo); Gelato+ $19.99–$29.99/mo ([Printify pricing changes 2026](https://mydesigns.io/blog/printify-pricing-changes-2026/), [PodVector](https://podvector.ai/articles/printful/premium/the-complete-guide-to-printful-premium-plus-and-pro-memberships), [Gelato plans](https://www.gelato.com/subscription-plans)). Research tool (eRank $5.99/mo or EverBee free tier) ([eRank vs Everbee](https://loveeattravelrepeat.com/erank-vs-everbee-vs-alura/)).

### Margins
- Etsy fee stack: $0.20 listing + 6.5% transaction + ~3% + $0.25 processing ≈ 10–11% of a typical order; Offsite Ads adds 12–15% on attributed orders (opt-out allowed under $10K/yr revenue, mandatory 12% above) ([Craftybase](https://craftybase.com/blog/the-complete-guide-to-etsy-fees), [Gelato/Etsy costs](https://www.gelato.com/blog/the-real-cost-of-selling-on-etsy)).
- Typical gross margin: 20–40%; premium/personalized niches 50%+ ([Printful](https://www.printful.com/blog/print-on-demand-statistics), [Merch Titans](https://merchtitans.com/blog/print-on-demand-profit-margins-guide) — note both are industry vendors). Etsy+Printify sellers net roughly **$5–$8 per t-shirt** after production and fees ([Merch Titans](https://merchtitans.com/blog/print-on-demand-profit-margins-guide)).
- Realistic **net margin: 10–25%** on Etsy organic traffic; many new sellers run 5–10% ([Printify stats](https://printify.com/blog/print-on-demand-statistics/) **[platform-published, promotional context]**). Marketplace margins have compressed ~5–10 points over three years ([Merch Titans](https://merchtitans.com/blog/print-on-demand-profit-margins-guide)).

### Time to first sale / time to $500/mo profit
- Printify's own data: average seller takes **165 days to reach first $1,000 in revenue** (not profit) ([Printify](https://printify.com/blog/print-on-demand-statistics/) **[self-reported/promotional — survivors only]**).
- First sale: typically 2 weeks–3 months on Etsy with 20+ listings. Time to $500/mo **profit**: realistically **6–12 months**; at $6/shirt profit that is ~85 sales/month, which requires 100–300+ live listings for most sellers. High-volume sellers with 500+ listings perform best ([Podbase stats](https://www.podbase.com/blogs/print-on-demand-statistics)).

### Failure modes and failure rate
- **~24% of POD shops are still operating three years after launch** — i.e., roughly three-quarters quit or die ([Podbase](https://www.podbase.com/blogs/print-on-demand-statistics), [DoDropshipping](https://dodropshipping.com/print-on-demand-statistics/)). Store conversion averages just 1.7%.
- Failure modes: invisible listings in saturated niches (generic quotes on shirts), trademark strikes from selling infringing designs (fast path to Etsy suspension), margin death from Offsite Ads + discounting, and slow POD production windows generating "where is my order" cases.

### Automation ceiling
- **Fully automatable:** order routing, production, shipping, tracking upload (Etsy↔Printful/Printify sync is genuinely hands-off) ([Printful/Etsy](https://www.printful.com/integrations/etsy), [Printify/Etsy](https://printify.com/etsy/)); bulk listing via MyDesigns/Flying Upload-type tools; AI-assisted design generation.
- **Needs a human:** niche/keyword research, design curation and QC, listing copy, customer messages (Etsy penalizes slow replies), reviews/disputes.
- **Steady-state hours: ~3–8 hrs/week** once listings exist; growth phase 10–15 hrs/week (estimate).

### Payment/chargeback risk (Stripe reuse)
On Etsy, **Etsy Payments is the processor — your Stripe account is never touched**, and Etsy answers card networks on your behalf (though it can recoup chargeback funds from you; its Purchase Protection covers qualifying orders) ([Etsy Help](https://help.etsy.com/hc/en-us/articles/115015729027-What-to-Do-If-There-s-a-Chargeback-in-Your-Shop), [Purchase Protection](https://help.etsy.com/hc/en-us/articles/5850122619287-What-is-Etsy-s-Purchase-Protection-for-Sellers)). Own-store POD on Stripe is moderate risk: apparel CNP baseline dispute rates ~0.6% ([Eightx benchmarks](https://eightx.co/blog/average-chargeback-rate-by-vertical)); 5–10 day production+shipping windows drive item-not-received disputes if you overpromise. **Verdict for Stripe reuse: safe on Etsy, moderate on own store.**

### Legal/tax
Etsy is a marketplace facilitator — it collects/remits sales tax in all sales-tax states ([Numeral](https://www.numeral.com/blog/marketplace-facilitator)); some states still want you registered and filing informational returns ([Beancount](https://beancount.io/blog/2026/05/10/marketplace-facilitator-laws-2026-amazon-etsy-shopify-sellers-sales-tax-zero-returns-multistate-compliance-guide)). Own store: you handle economic nexus yourself (most states: $100K sales threshold). FTC 30-day Mail Order Rule is rarely an issue (POD ships in under 2 weeks) but you must display honest processing times ([FTC rule](https://www.ftc.gov/legal-library/browse/rules/mail-internet-or-telephone-order-merchandise-rule)). Main legal landmine: **IP/trademark infringement in designs**.

### Profit distribution (synthesized estimates, Etsy-organic route)
| | Month 3 | Month 6 | Month 12 |
|---|---|---|---|
| **Median case** | $0–$50/mo | $50–$200/mo | $100–$400/mo (most quit before here) |
| **Good case** (competent, 150+ listings, niche focus) | $100–$300/mo | $400–$800/mo | $1,000–$2,500/mo |

---

## Model 2: Classic Dropshipping (US-warehouse suppliers → own store or TikTok Shop)

### Startup costs
| Item | Cost |
|---|---|
| Shopify Basic | $39/mo (or ~$27/mo annual) ([Popupsmart](https://popupsmart.com/blog/how-much-does-it-cost-to-start-dropshipping-on-shopify)) |
| Supplier/automation app: AutoDS $20–$50/mo, Zendrop free–$49/mo, Spocket $40–$100/mo, CJ free (20–40% markup baked into product cost) ([AutoDS comparison](https://www.autods.com/blog/subscription-costs-comparison-autods-cjdropshipping-zendrop/), [Spocket on CJ](https://www.spocket.co/blogs/cjdropshipping-overview)) | $0–$50/mo |
| Domain, apps, theme | $30–$100 |
| Product test samples | $50–$150 |
| **Ad budget (the real startup cost): $30–$50/day per product tested** | **$1,000–$1,500/mo** ([ProductLair](https://productlair.com/blog/how-much-to-spend-on-dropshipping-ads)) |
| TikTok Shop route: security deposit for self-operated sellers | $1,500 (raised from $500 in Dec 2025) ([Shoplazza](https://www.shoplazza.com/blog/tiktok-shop-policy-update)) |
| **Minimum viable spend** | **$1,500–$3,000 before knowing if you have a business** ([Dropship.it](https://dropship.it/article/how-much-does-it-cost-to-start-dropshipping/)) |

The "$200 to start dropshipping" claim is guru content; it excludes the ad spend that produces essentially all revenue in this model.

### Monthly fixed costs at small scale
$60–$140/mo (Shopify + AutoDS/Zendrop + apps) **plus** $1,000–$1,500/mo ads while testing. TikTok Shop: 6% referral fee (discounted ~2% for first 90 days) + $0.30/order instead of ad-dependence, if you can win organic/affiliate distribution ([Printify TikTok fees](https://printify.com/blog/tiktok-shop-fees/), [Darkroom](https://www.darkroomagency.com/observatory/tiktok-shop-fees-seller-cost-breakdown-2026)).

### Margins
- Gross margin: 65–70% is typical on marked-up impulse products ([TrueProfit](https://trueprofit.io/blog/dropshipping-profit-margin)).
- **Net margin after ads: 15–20% for functioning stores; median 16.2%** across stores spending $2K–$5K/mo on ads (TrueProfit analysis of 1,200+ real stores — the best dataset available) ([TrueProfit income data](https://trueprofit.io/blog/average-dropshipping-income)); beginners frequently sit below 10% or negative. Average ecommerce CAC is now $68–$84 and new ad accounts pay 30–45% more per customer ([Farabi Ulder benchmarks](https://farabiulder.com/blog/typical-customer-acquisition-cost), [ProductLair](https://productlair.com/blog/how-much-to-spend-on-dropshipping-ads)).

### Time to first sale / time to $500/mo profit
First sale: days after ads go live (ads buy sales immediately — profitability is the question). Time to $500/mo **net**: good case 2–4 months after finding a winning product; median case **never** — most operators burn their test budget across 5–15 losing products first.

### Failure modes and failure rate
- Commonly cited: **80–95% of dropshipping stores fail within months to a year; only ~10–20% achieve consistent profitability** ([TrueProfit](https://trueprofit.io/blog/dropshipping-success-rate), [Cloudways](https://www.cloudways.com/blog/dropshipping-success-tips/)). Provenance of these figures is weak (no census exists; abandoned stores inflate counts), but directionally every source agrees this is the highest-failure model of the four.
- Failure modes: ad costs exceeding margin (the #1 killer), product/creative fatigue, supplier stockouts and shipping delays (64% of 3,161 surveyed store owners cite delays as top pain point — [AutoDS survey](https://www.autods.com/blog/dropshipping-tips-strategies/dropshipping-statistics/) **[vendor survey]**), payment processor freezes, and TikTok Shop metric-based deactivations.

### Automation ceiling
- **Fully automatable:** product import, price/stock sync, order forwarding, tracking updates (AutoDS/Zendrop core function); basic email flows; post-purchase notifications.
- **Needs a human:** product research and validation, ad creative production (the actual job — constant), media buying decisions, customer service (refund requests, WISMO emails), supplier switching.
- **Steady-state hours: 10–20 hrs/week.** This is the least passive model despite its reputation; the fulfillment is automated but the *demand generation* never is.

### Payment/chargeback risk (Stripe reuse) — **HIGHEST RISK**
Dropshipping is explicitly treated as elevated-risk by processors. Stripe monitors dispute rates and takes action well below the 0.75% VAMP-era network threshold — reviews and reserves begin around 0.5–0.6%; outcomes include 10% rolling reserves for 90 days, frozen payouts, or termination with funds held up to 120 days ([Chargeback.io](https://www.chargeback.io/blog/stripe-high-risk-business-what-it-means), [ProductLair](https://productlair.com/blog/dropshipping-payment-processing), [Stripe docs](https://docs.stripe.com/disputes/monitoring-programs)). Community reports of Stripe accounts shut down specifically for dropshipping are common ([Shopify forum](https://community.shopify.com/t/can-i-use-shopify-payments-for-my-dropshipping-store/4410/1)). **Do not attach this to an existing Stripe account you value — a freeze takes down every business on that account. Use Shopify Payments or a fresh, accurately-described entity/account.**

### Legal/tax
- **FTC 30-day rule applies squarely**: you must ship within the advertised window or send delay notices offering cancellation; penalties can exceed $40K per violation ([FTC](https://ftc.gov/business-guidance/resources/business-guide-ftcs-mail-internet-or-telephone-order-merchandise-rule), [Fredrikson](https://www.fredlaw.com/alert-shipping-delays-can-cost-your-business-more-than-just-a-bad-review)). US warehouses (CJ US: 3–7 days delivery — [CJ blog](https://blog.cjdropshipping.com/detail/Unlock-3-Day-Delivery-with-CJ-s-New-US-Warehouses)) largely solve this; China-direct does not.
- Own store: you manage economic nexus registration once you cross state thresholds. TikTok Shop is a marketplace facilitator (collects sales tax for you) ([Synder](https://synder.com/blog/marketplace-facilitator/)).
- TikTok Shop permits supplier-based dropshipping if you meet fulfillment SLAs; retail arbitrage sourcing is prohibited ([BigSeller](https://www.bigseller.com/blog/articleDetails/3127/tiktok-shop-dropshipping.htm), [Shoplazza](https://www.shoplazza.com/blog/tiktok-shop-policy-update)). Tariff volatility on China-origin goods is an ongoing 2025–2026 margin risk ([CJ tariffs](https://blog.cjdropshipping.com/detail/How-CJdropshipping-Helps-You-Adapt-to-New-U-S--Tariffs)).

### Profit distribution (synthesized estimates)
| | Month 3 | Month 6 | Month 12 |
|---|---|---|---|
| **Median case** | **−$500 to −$1,500 cumulative** (testing losses) | $0 or quit | Quit (80–90%) |
| **Good case** (found a winner, decent creative skills) | $300–$1,000/mo | $1,000–$3,000/mo | $2,000–$8,000/mo (volatile; winners fatigue) |

---

## Model 3: Digital Products (Etsy printables/templates, Gumroad, Notion templates, SVGs)

### Startup costs
| Item | Cost |
|---|---|
| Etsy setup fee + 20 listings | $19–$33 |
| Gumroad account | $0 — 10% + $0.50/sale + ~3% processing (effective 13–19%) ([Dodo Payments](https://dodopayments.com/blogs/gumroad-fees-explained), [Checkoutpage](https://checkoutpage.com/blog/gumroad-fees)) |
| Canva Pro | $120/yr ([Orb](https://www.withorb.com/blog/canva-pricing)) |
| Creative Fabrica (fonts/graphics with commercial license) | ~$5–$29/mo ([PrintKK](https://www.printkk.com/blog/articles/creative-fabrica-reviews)) |
| Research tool (eRank/EverBee/Alura) | $0–$8/mo ([comparison](https://loveeattravelrepeat.com/erank-vs-everbee-vs-alura/)) |
| **Minimum viable spend** | **~$40–$150** — the cheapest model, period |

### Monthly fixed costs at small scale
**$10–$40/mo.** No inventory, no COGS, no fulfillment cost. Every incremental sale is nearly pure margin.

### Margins
- **Gross margin 90–97%** (fees are the only variable cost). Etsy digital: ~10–11% standard fees + 12–15% Offsite Ads where triggered ([Craftybase](https://craftybase.com/blog/the-complete-guide-to-etsy-fees)); Gumroad ~13–19% all-in, 30% on Discover-sourced sales ([Swell](https://www.swell.is/content/gumroad-pricing)).
- **Net margin 70–90%** is genuinely achievable and widely corroborated ([Insight Agent](https://www.insightagent.app/guides/average-etsy-seller-income)). The catch is the numerator: revenue is small and slow to build.

### Time to first sale / time to $500/mo profit
- First sale: 2 weeks–3 months on Etsy; sellers with well-researched listings typically hit a first $100 month within 60–90 days; consistent revenue tends to require 20–50+ optimized listings and 6–12 months ([Insight Agent printables](https://www.insightagent.app/guides/make-money-etsy-printables)).
- Gumroad brings essentially **zero traffic** — Discover accounts for only ~10–20% of even successful sellers' revenue; you supply the audience ([Medium/Nicholson](https://travisnicholson.medium.com/the-truth-about-gumroad-5-myths-new-creators-still-believe-de7897d6a2a2), [Kupkaike](https://kupkaike.com/blog/how-to-sell-digital-products-on-gumroad-for-beginners)). Etsy is the discovery engine for a no-audience operator.
- Time to $500/mo profit: median 8–14 months; good case 4–6 months.

### Failure modes and failure rate
- No credible failure-rate census exists. Proxy signals: the top 5% of Etsy shops take 43% of all sales ([Thunderbit](https://thunderbit.com/blog/etsy-stats)); a claimed median Etsy seller revenue of ~$574/mo is an unofficial third-party estimate spanning all sellers ([Insight Agent](https://www.insightagent.app/guides/average-etsy-seller-income) **[unverified methodology]**). Established printable sellers cluster at **$200–$2,000/mo**; Notion template creators mostly earn **$500–$2,000/mo** with a top 10% above $10K ([Kupkaike](https://kupkaike.com/blog/notion-templates-passive-income-how-much-can-you-earn), [Automateed](https://www.automateed.com/how-to-sell-notion-templates) **[both lean promotional]**).
- Failure modes: **AI-content flood has saturated generic niches** — buyers now actively avoid obviously AI-generated products, static PDFs are declining vs. editable Canva/Corjl templates ([Growing Your Craft](https://www.growingyourcraft.com/blog/most-popular-digital-products-on-etsy), [iscompliant](https://iscompliant.app/Blog/etsy-creativity-standards-pod-sellers-guide)); piracy/redistribution; Etsy algorithm/suspension dependence; producing 100 listings nobody searched for.

### Automation ceiling — **highest of the four**
- **Fully automatable:** delivery (instant download), payment, tax remittance (Gumroad is Merchant of Record since Jan 2025 — it calculates and remits sales tax/VAT globally ([Dodo Payments](https://dodopayments.com/blogs/gumroad-fees-explained)); Etsy remits as facilitator), and much of production (AI-assisted template generation, bulk listing tools).
- **Needs a human:** market research, product design/QC, listing SEO, occasional customer questions, refresh of stale listings.
- **Steady-state hours: 2–5 hrs/week** once a catalog exists — the only model here that approaches true passivity.

### Payment/chargeback risk (Stripe reuse)
Etsy and Gumroad both keep your Stripe account out of the flow entirely. **Caution:** if you later sell courses/info-products on your own site through Stripe, online info products carry the worst dispute rates of any vertical measured — **1.0–4.8%** ([Eightx](https://eightx.co/blog/average-chargeback-rate-by-vertical)) — far above Stripe's ~0.75% action threshold. Cheap templates/planners are much lower-risk than courses, but digital goods invite "friendly fraud" (download-then-dispute), and friendly fraud now drives ~75% of ecommerce disputes ([Chargeflow](https://www.chargeflow.io/blog/chargeback-statistics-trends-costs-solutions)). **Verdict: safest model for Stripe reuse if you stay on marketplaces/Gumroad; be careful moving high-ticket info products onto your own Stripe.**

### Legal/tax
Marketplace facilitator + Gumroad MoR means near-zero sales-tax workload ([Numeral](https://www.numeral.com/blog/marketplace-facilitator)). Selling on your own site: digital-goods taxability varies by state and you own nexus tracking. Main legal risks: using assets beyond their license terms (Canva content in resold templates has specific restrictions) and trademarked terms in listings.

### Profit distribution (synthesized estimates)
| | Month 3 | Month 6 | Month 12 |
|---|---|---|---|
| **Median case** | $0–$75/mo | $50–$250/mo | $150–$600/mo |
| **Good case** (50–150 listings, niched, editable templates) | $100–$400/mo | $500–$1,500/mo | $1,500–$4,000/mo |

---

## Model 4: Online/Retail Arbitrage (Amazon FBA + eBay, prep center, hands-off inventory)

### Startup costs
| Item | Cost |
|---|---|
| Amazon Professional account | $39.99/mo ([Red Stag](https://redstagfulfillment.com/amazon-seller-fees/)) |
| SellerAmp SAS (deal analysis) | $19.95–$27.95/mo ([Titan](https://titannetwork.com/selleramp/)) |
| Keepa (price history) | ~$19–$25/mo ([ProfitPath](https://profitpath.com/en/blog/best-online-arbitrage-tools)) |
| OA lead list subscription (outsourced sourcing) | ~$30–$200/mo ([OABeans](https://oabeans.com/), [Full-Time FBA](https://www.fulltimefba.com/profitable-deal-lists-for-amazon-fba-sellers/) **[self-reported/promotional claims of 85% ROI leads]**) |
| **Initial inventory capital** | **$500–$1,500 realistic minimum; $2,000–$3,000 to scale seriously** ([OABeans capital guide](https://oabeans.com/capital-need-for-online-arbitrag/), [Threecolts](https://www.threecolts.com/blog/online-arbitrage-for-beginners-getting-started/)) |
| **Minimum viable spend** | **~$800–$2,000 month one** |

### Monthly fixed costs at small scale
$80–$300/mo tools (add Tactical Arbitrage $59–$129/mo for automated scanning if not using lead lists ([Threecolts](https://www.threecolts.com/blog/best-online-arbitrage-tools/)); repricer BQool $25/mo or Aura from $27/mo ([Repricer.com](https://www.repricer.com/blog/best-amazon-repricer-2025/), [AMZ Prep](https://amzprep.com/amazon-repricer-tools/))). **Prep center: $0.90–$1.50+/unit, with $1.00–$1.50 arbitrage surcharges common; some prep centers refuse OA/RA clients entirely** ([PrepVia](https://prepvia.com/blogs/fba-prep-center-costs-2026), [Prime Time Prep](https://www.primetimeprep.com/online-retail-arbitrage), [AMZ Prep policy](https://amzprep.com/pricing/)).

### Margins
- Amazon takes ~15% referral + $3.22–$10+ FBA fulfillment per unit + storage ([Red Stag](https://redstagfulfillment.com/amazon-seller-fees/); fees frozen for 2025–2026 ([Amazon](https://sellingpartners.aboutamazon.com/update-to-us-referral-and-fulfillment-by-amazon-fees-for-2025))). eBay alternative: 13.6% FVF + $0.30 ([eBay Seller Center](https://www.ebay.com/sellercenter/resources/seller-updates/2025-january/final-value-fee)).
- Working targets: **30%+ ROI per unit, 15–25% net margin**; sustainable FBA net margin benchmark 20–25%; Jungle Scout surveys show 57% of Amazon sellers above 10% margin, ~28% above 20%, average 15–20% ([Aura guide](https://goaura.com/blog/retail-arbitrage-on-amazon), [AMZ Prep calculator](https://amzprep.com/amazon-fba-profit-margin-calculator/), [Red Stag/JS data](https://redstagfulfillment.com/how-much-do-amazon-sellers-make/)).
- Prep-center fees shave roughly 3–8 points of margin vs. self-prep on a typical $20–$30 item — the price of never touching inventory.

### Time to first sale / time to $500/mo profit
- **Fastest first sale of any model**: you list on existing Amazon pages with proven demand; sales typically start within days of inventory checking in. But **new-seller payouts can be delayed 4–6 weeks**, and the DD+7 policy (US rollout March 2026) holds funds 7 days past delivery ([Payability](https://www.payability.com/blog/account-level-reserve-amazon/), [Riverbend](https://riverbendconsulting.com/blog/dd7-amazon-payout-policy/)) — so cash flow, not sales, is the bottleneck.
- $500/mo profit needs roughly $2,500–$3,500/mo revenue at 15–20% net — achievable in **2–4 months median, 1–2 months good case** with $1,500–$2,500 working capital turned ~monthly. Experienced OA sellers commonly report ~$5,000/mo profit levels after a year+ ([Seller Sprite](https://www.sellersprite.com/en/blog/how-to-start-online-arbitrage-amazon-2025) **[directional, self-reported]**).

### Failure modes and failure rate
- Jungle Scout: ~13% of surveyed Amazon sellers are not yet profitable ([Red Stag/JS](https://redstagfulfillment.com/how-much-do-amazon-sellers-make/)) — but survey respondents skew toward active/engaged sellers; true quit rates among OA starters are higher and unmeasured.
- Failure modes are mostly **platform risk**: IP complaints and "inauthentic" claims (retail receipts are frequently **not accepted** as proof of sourcing — Amazon wants distributor invoices) ([AMZ Sellers Attorney](https://www.amazonsellers.attorney/blog/amazon-retail-arbitrage-risks-in-2025-avoid-suspension-amz-sellers-attorneyr), [OABeans IP guide](https://oabeans.com/ip-complaint-on-amazon/)); accelerating brand gating (Brand Registry grew from 500K to 700K+ brands in a year) ([Aura ungating](https://goaura.com/blog/amazon-top-restricted-brands-in-2025)); price-tanking races to the bottom; capital stuck in slow-moving inventory plus long-term storage fees at 180 days ([Nova](https://www.novadata.io/resources/blog/amazon-fba-clearance-arbitrage-guide-2025)).
- **Critical policy line:** buying from a retailer and having it shipped directly to your customer violates Amazon's (and eBay's) dropshipping policy and is a leading suspension trigger. The compliant structure is exactly what we'd use: **you take ownership, goods flow retailer → prep center → FBA, you are seller of record** ([Appeals Doctor](https://www.appealsdoctor.com/blog/amazon-dropshipping-policy-rules-violations-compliance), [eDesk](https://www.edesk.com/blog/dropshipping-amazon-ebay/), [SuperDS eBay policy](https://super-ds.com/blog/ebay-dropshipping-policy-2026)).

### Automation ceiling
- **Fully automatable:** repricing (BQool/Aura), fulfillment and returns (FBA), physical handling (prep center), price-history analysis (Keepa API), tracking/accounting.
- **Needs a human — and this is the ceiling:** deal selection. Even with lead lists and Tactical Arbitrage scans, a human must vet each buy (gating check, IP risk, Keepa sanity check), place retail orders (retailers cancel obvious reseller orders; gift cards/cashback stacking is manual), and handle account-health pings. **Steady-state hours: 8–15 hrs/week.** It is semi-automatable, never passive.

### Payment/chargeback risk (Stripe reuse)
**None.** Amazon/eBay process payments; A-to-Z claims replace chargebacks; your Stripe account is uninvolved. The financial risk is inverted: *your* buying card carries the float, and Amazon holds your payouts (reserves, DD+7).

### Legal/tax
- **Get a state sales-tax permit + resale certificate** to buy inventory tax-free (Walmart accepts readily; Target is hit-or-miss); paying sales tax at retail otherwise eats 6–10 points of margin ([ResaleCertificate.org](https://resalecertificate.org/articles/resale-certificate-for-amazon-sellers/), [RJM](https://rjmtaxexemption.com/post/understanding-resale-certificates-and-tax-exemption-when-ecommerce-sellers-can-avoid-paying-sales-tax/)). Never use it for personal purchases.
- Amazon/eBay remit sales tax as marketplace facilitators; keep your home-state permit active and file (often zero-dollar) returns ([Wipfli](https://www.wipfli.com/insights/articles/tax-marketplace-facilitators-and-sales-tax-what-you-need-to-know)).
- First-sale doctrine generally protects reselling genuine goods, but brands still weaponize IP complaints; Amazon suspends first and asks questions later ([DAM Law](https://damlawfirm.com/blog/retail-arbitrage-and-ip-infringement/)).

### Profit distribution (synthesized estimates, ~$1,500–$2,500 working capital)
| | Month 3 | Month 6 | Month 12 |
|---|---|---|---|
| **Median case** | $150–$400/mo | $300–$700/mo | $500–$1,200/mo (capital-constrained) |
| **Good case** (reinvesting, good lead flow, ungated in key categories) | $400–$800/mo | $800–$2,000/mo | $2,000–$5,000/mo |

---

## Comparison Table

| | **POD (Etsy)** | **Dropshipping** | **Digital Products** | **Online Arbitrage (prep center)** |
|---|---|---|---|---|
| Minimum viable startup | $65–$175 | $1,500–$3,000 | $40–$150 | $800–$2,000 |
| Fixed costs/mo (small) | $0–$55 | $60–$140 + $1,000+ ads | $10–$40 | $80–$300 + prep fees |
| Gross margin | 20–40% | 65–70% | 90–97% | 25–45% |
| Realistic net margin | 10–25% | 10–20% (if it works) | 70–90% | 15–25% |
| Time to first sale | 2 wks–3 mo | Days (paid) | 2 wks–3 mo | Days after check-in |
| Time to $500/mo profit (good case) | 4–6 mo | 2–4 mo | 4–6 mo | 1–2 mo |
| Failure/quit rate signal | ~76% gone by yr 3 | 80–95% fail (weak data, worst of four) | No census; heavy saturation | ~13% unprofitable (survey; survivor-biased) |
| Steady-state human hrs/wk | 3–8 | 10–20 | 2–5 | 8–15 |
| Stripe-reuse dispute risk | None (Etsy) / moderate (own site) | **Severe — do not reuse** | None (Etsy/Gumroad MoR) | None (Amazon pays you) |
| Biggest non-obvious risk | Trademark strikes | Ad-spend incineration + processor freeze | AI-flood saturation | IP claims/suspension + cash-flow holds |
| Capital at risk if platform bans you | ~$0 | Ad spend already gone | ~$0 | Entire inventory + held payouts |

---

## Researcher's verdict: pick two

**Launch online arbitrage and digital products first.**

Arbitrage is the fastest reliable path to real profit: you sell on listings with proven demand, so a competent operator with $1,500–$2,500 in working capital plausibly clears $500/month by month 2–3 — no other model gets there as dependably. The prep-center structure keeps it hands-off physically and fully compliant with Amazon policy, and it never touches your Stripe account. Its weaknesses — sourcing hours, suspension risk, capital lockup — are real but manageable at small scale.

Digital products are the opposite profile: slowest to compound, but near-zero cost, 90%+ gross margins, the highest automation ceiling (2–5 hrs/week at steady state), and zero payment-processor exposure via Etsy/Gumroad. Arbitrage's early cash funds the 6–12 month runway digital products need; by month 12 the digital catalog becomes the passive layer arbitrage can never be.

Skip classic dropshipping entirely given the Stripe constraint — it's the one model where reusing your existing account is genuinely dangerous, and its ad-dependent economics carry the worst failure odds per dollar. POD is a reasonable third addition later, launched inside the same Etsy shop as your digital products once that shop has reviews and traffic.

*(Note: this is the researcher's verdict optimizing fastest-profit + automation. The final launch-wave decision — which also weighs the owner's minimal-inventory and minimal-hours constraints — lives in `02-research/00-decision-matrix.md`.)*
