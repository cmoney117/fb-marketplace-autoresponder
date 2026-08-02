# Research: Platforms, Suppliers, Fees & APIs Reference (August 2, 2026)

*Research method: ~24 searches. Verification legend: **[OFF]** = official page/help center/docs. **[3P]** = reputable 2026 third-party roundup where the official page blocked automated fetches (printful.com, help.etsy.com, stripe.com, vercel.com, developers.printify.com block bots) — triangulated across multiple current sources. **Re-confirm [3P] numbers in the seller dashboard before pricing.***

---

## SECTION 1 — Print-on-Demand Suppliers

| | **Printful** | **Printify** | **Gelato** |
|---|---|---|---|
| Model | Owns its factories | Marketplace of ~90 print providers | Network of local print partners (32+ countries) |
| Free plan | $0 forever [OFF] | $0 forever [OFF] | $0 forever [OFF] |
| Premium plan | **Growth: $24.99/mo**, free once past ~$12K/yr sales; up to 33% off products [OFF/3P] | **Premium: $39/mo** (raised from $29 eff. Feb 17, 2026) or $299/yr; up to 20% off [OFF] | **Gelato+: ~$23.99/mo or $19.99/mo annual**; discounts up to 33% [OFF/3P] |
| Bella+Canvas 3001 tee | ~$11.69 [3P] | ~$10.98 free / ~$8.77 Premium [3P] | Competitive, not cheapest [3P] |
| 11 oz mug | ~$5.95–8.25 [3P, conflicting] | ~$4.50–7 by provider [3P] | similar [3P] |
| US shipping, tee | $3.99 first / $1.90 addl [3P] | ~$4–5 first (Monster Digital ~$3.99) [3P] | partner-specific |
| Production | 2–5 business days | 1–5 days, provider-specific | 1–6 days + 2–5 US delivery |
| API | **Best-in-class:** v1+v2: catalog, product creation, store sync, orders, shipping rates, mockup generator, webhooks; 120 req/min [OFF] | **Full workflow:** catalog, image upload, product create, **publish endpoint pushes to connected Etsy**, orders, webhooks [OFF] | Solid: orders v4, products from templates, webhooks [OFF] |
| Store integrations | 23: Shopify, Etsy, Amazon, eBay, TikTok Shop, Gumroad, custom API [OFF/3P] | Shopify, Etsy, eBay, Amazon US, TikTok Shop US, Walmart, custom API [OFF/3P] | Shopify, Etsy, Woo, Wix; no eBay/TikTok native [3P] |

**Gooten / CustomCat:** Gooten — no monthly fee, API+EDI, pay per order. CustomCat — free tier + PRO $30/mo, up to 40% discounts; frequently cheapest BC3001 with PRO; API maturity below Printful/Printify [3P]. Price-check at volume.

### Sample margin math: $24.99 tee on Etsy (free US shipping), POD-fulfilled

Etsy fees: $0.20 listing + 6.5% ($1.62) + 3%+$0.25 processing ($1.00) = **$2.82 (11.3%)** (no Offsite Ad).

| Scenario | COGS | Net profit |
|---|---|---|
| Printful Free ($11.69 + $3.99) | $15.68 | **$6.49 (26%)** |
| Printify Free, Monster Digital | $15.73 | **$6.44** |
| Printify Premium ($8.77 + ~$4.75) | $13.52 | **$8.65** — Premium pays for $39/mo after ~18 tees/mo |
| Printful Growth (~$7.85 + $3.99) | $11.84 | **$10.33** — Growth pays for $24.99/mo after ~7 tees/mo |
| Any + **Offsite Ads sale (15%)** | −$3.75 | Printful Free drops to **$2.74** — price $27.99+ if expecting Offsite Ads traffic |

---

## SECTION 2 — Dropshipping Suppliers/Tools

| Tool | Pricing (2026) | US shipping | Automation | Connects to |
|---|---|---|---|---|
| **CJdropshipping** | **Free core**; optional $15.99–59.99/mo [3P] | US-stocked items 3–10 days; **most of catalog NOT US-stocked** (China 7–15+ days) [3P] | Auto order/tracking/inventory sync; **public REST API** — best raw API of the group [OFF] | 18+ platforms + API |
| **Spocket** | $39.99–299.99/mo, 14-day trial [3P] | US/EU suppliers, 2–5 day domestic [3P] | One-click import, auto-order paid tiers; no public API | Shopify, Wix, Woo, BigCommerce |
| **AutoDS** | ~$19.90–69.90/mo; $1 trial auto-renews — no free plan [3P] | 25+ suppliers incl. US [OFF] | Deepest multi-channel: repricing, Fulfilled-by-AutoDS, tracking | **Widest:** Shopify, eBay, Etsy, Amazon, TikTok, FB Marketplace [OFF] |
| **Zendrop** | Free / $49 / $79/mo; new users usage-based [OFF] | US warehousing for proven winners only | Auto-fulfill, branded inserts; no public API | Shopify, TikTok Shop, Wix only |
| **DSers** | Free / $19.90 / $49.90/mo [3P] | AliExpress partner — mostly China unless "ships from US" filter | Bulk ordering, tracking/stock sync | Shopify, Woo, Wix |

**Agent-automation verdict:** CJdropshipping (free + real API) and AutoDS (broadest coverage, subscription) fit an AI-agent workflow. Zendrop/Spocket are Shopify-app-centric, no public API.

---

## SECTION 3 — Sales Channels: Current Fees

### Etsy [OFF]
- Listing: $0.20/listing/4mo (auto-renews on sale) · Transaction: 6.5% of item+shipping · Processing (US): ~3% + $0.25 (on total incl. tax)
- **Offsite Ads:** 15% on attributed sales, optional below $10K trailing-365d revenue; **mandatory 12% above $10K forever**; capped $100/order
- One-time shop setup fee: $15–29 · Etsy Plus $10/mo optional
- **Typical all-in take (no ads): ~11–13% + $0.20**

### eBay [OFF/3P]
- 250 free listings/mo without store; $0.35 after · FVF most categories **13.6% up to $7,500 + $0.40/order** · Basic Store $7.95/mo annual (1,000 free listings, ~12.7% FVF)
- **New sellers: ~10 items / $500/mo limit**, reviewed monthly; payout holds up to 21–30 days early (released on delivery confirmation)

### Amazon [OFF]
- Individual $0.99/item; Professional $39.99/mo · Referral most categories 15%; apparel tiered 5%/10%/17% · FBA ~$3.86–4.75/unit standard-size + 3.5% fuel surcharge from Apr 17, 2026
- **New-seller verification notoriously strict** (OCR document matching, utility bill <90 days, possible video interview; budget 1–3 weeks)
- **Dropshipping policy:** allowed only as seller of record with own branding; retailer-to-customer shipping prohibited. POD via Printful/Printify is compliant.

### TikTok Shop US [OFF/3P]
- US divestiture deal closed Jan 22, 2026 — platform risk reduced, ecosystem settling
- Referral **6% flat** most categories (new-seller promo 3% for 30 days); individual sellers: ID + last-4 SSN + bank, no business license
- Reality: creator affiliate commissions (10–20%) + returns push real channel cost toward ~30%

### Gumroad [OFF]
- **10% + $0.50/sale + ~2.9% + $0.30 processing** (Merchant of Record since Jan 2025 — handles all sales tax/VAT). Effective ~13–15% on small items. **Discover-sourced sales: flat 30%.** No monthly fee.

### Walmart Marketplace [OFF/3P]
- No monthly fee; referral 6–15%. **Approval hard:** registered business (EIN), 2–4 week review, wants existing marketplace track record. Not a day-one channel.

### Shopify [OFF/3P]
- Starter $5/mo (no full store) · **Basic $39/mo ($29 annual)** · Payments 2.9%+$0.30; external gateway +2% on Basic

### Custom store: Next.js + Stripe + Vercel [OFF]
- Stripe 2.9% + $0.30 (no monthly); +1.5% international cards · **Vercel Hobby (free) is explicitly NON-COMMERCIAL — a Stripe-checkout store on Hobby violates ToS; Pro is $20/mo.** Cloudflare Pages/Workers free tier permits commercial use — the $0 alternative.

---

## SECTION 4 — Automation APIs (what an AI agent can and can't run)

### Etsy Open API v3 [OFF]
- **Approval: "Seller App" tier (2025+, own-shop only) — eligible sellers approved within MINUTES, no manual review.** This is our path. (Personal App: 24–48h+; Commercial: weeks.)
- Capabilities: full listing lifecycle (`createDraftListing`, price/inventory/variations, image + digital-file upload, publish); orders via `getShopReceipts` **including personalization text**; `createReceiptShipment` (tracking); payments/ledger. OAuth 2.0 + PKCE.
- **Agent automates:** listing creation at scale, price tests, order ingestion, personalization parsing, tracking upload, renewals. **Human:** app registration (one-time), customer Messages (API limited — support via dashboard/forwarded email).
- Rate limits: ~10,000/day, ~10/sec default [3P — confirm in docs].

### eBay Sell APIs [OFF]
- Instant developer signup; production keyset requires the account-deletion notification endpoint. No sales history needed.
- Inventory API (full listing automation) 2M calls/day; Fulfillment (orders/shipping) 100k/day; Finances; Marketing.
- **Agent automates:** everything operational. **Human:** monthly selling-limit increase requests, dispute judgment.

### Amazon SP-API [OFF]
- Register developer profile from verified Professional account; self-authorize private app. Standard roles: ~days. **PII roles (buyer addresses) require a data-protection audit — months for public apps.** Highest-friction channel for a new automated seller; build around Reports + Notifications, not polling.

### Printful API [OFF]
- v1 stable + v2 beta: catalog, sync products (push to connected store), orders (draft→confirm), shipping quotes, **mockup generation**, webhooks. 120 req/min. Marketplace orders auto-import + auto-fulfill with zero code.
- **Agent automates the entire pipeline** (art → mockup → listing → fulfillment → tracking). Human: billing card top-up, quality disputes.

### Printify API [OFF]
- REST v1, personal token: shops, catalog, image upload, **product create + `publish` (pushes to connected Etsy)**, orders, webhooks. ~600 req/min global, stricter publish limits [3P]. Handle 429/Retry-After.
- **Agent automates bulk product creation/publishing** (the "500 designs to Etsy" pipeline). Human: print-provider selection (quality varies — order samples), publish validation errors.

### Gumroad API [OFF]
- v2 REST: products read/edit, sales read, subscribers, payouts, **license-key verification**. Product *creation* is dashboard-centric — treat API as read/update + licensing. **Human: creating products, uploading files.**

### Stripe API [OFF]
- Everything API-first: Products/Prices, **Payment Links (zero-frontend selling)**, Checkout, webhooks, Tax, Radar. **Agent automates:** products, payment links, refunds, tracking upload. **Human:** KYC, dispute evidence judgment. New accounts: first payout ~7 days.

---

## SECTION 5 — Payout Mechanics & Risk

| Platform | Schedule | New-seller holds |
|---|---|---|
| Etsy | New sellers default weekly (Mondays); bank +1–5 days [OFF] | **Reserve: commonly ~30% of each sale held ~45 days or until tracking shows movement; typical first 90 days / until ~$10K sales** [OFF] |
| eBay | Available 1–2 days after payment; payout daily→monthly [OFF] | Holds up to 21–30 days early; released on delivery confirmation — upload tracking fast [OFF] |
| Amazon | 14-day settlement; **DD+7 (funds locked until 7 days post-delivery) extended from Mar 12, 2026**; first payout 3–4 weeks [OFF/3P] | Effectively always reserved until velocity history builds |
| TikTok Shop | ~15 days post-delivery standard; 1–8 days with strong performance [3P] | Intro settlement period first month |
| Gumroad | Weekly (Fridays) for balances settled 7+ days [OFF] | Standard 7-day settle |
| Stripe | 2-day rolling US | First payout ~7 days; volume spikes on new accounts trigger reviews |

### New-seller suspension triggers — and avoidance
1. **Etsy "suspended at signup"** — widespread. Triggers: VPN during registration, mismatched bank/ID/tax details, thin profile + instant bulk listings, brand keywords in tags. *Avoid:* residential IP, exact legal name matching bank + SSN, complete profile, **list 5–10 items manually over days before agent bulk-publishing**, USPTO trademark screens on every phrase. [3P]
2. **Amazon verification failure** — image quality, address-format mismatches ("St." vs "Street"), wrong document types. *Avoid:* utility bill <90 days, exact-match addresses everywhere. [3P]
3. **Amazon dropshipping deactivation** — retail-packaged goods from other retailers. *Avoid:* only seller-of-record-compliant fulfillment.
4. **eBay MC999/risk holds** — high-risk brands day one, exceeding limits, Amazon-logo packages → ban. *Avoid:* low-risk items first, monthly limit raises, compliant suppliers.
5. **TikTok Shop** — late shipment kills privileges fast; POD handling time: set 5+ days.
6. **Stripe** — sudden volume with no history triggers reviews; warm up gradually.

---

## Recommended Lowest-Cost Stacks (August 2026)

### (a) POD launch — **$0/mo fixed**
Etsy (one-time $15–29 setup + $0.20/listing) + Printify Free (cheapest tees) or Printful Free (best API/QC), native auto-fulfill. Etsy Seller App API key (instant) + supplier API. Upgrade: Printify Premium at ~18+ tees/mo; Printful Growth at ~7+ tees/mo.

### (b) Digital products launch — **$0/mo fixed**
Gumroad ($0 fixed, ~13–15%/sale) + Etsy digital listings ($0.20, ~11% take) for marketplace traffic. Migrate winners to custom Next.js + Stripe (≈4% effective) at ~$250–300/mo revenue — on Vercel Pro $20/mo or **Cloudflare Pages free (commercial use allowed)**.

### (c) Dropshipping launch — **$0/mo fixed**
eBay (250 free listings) + CJdropshipping free plan, **US-warehouse-filtered products only**, CJ API + auto tracking. Upgrade: AutoDS ~$20–40/mo when multi-channel; Shopify Basic only when owned-store margins justify.

**Cross-cutting:** every recommended platform (Etsy Seller App, eBay Sell, Printful, Printify, CJ, Gumroad, Stripe) grants API keys same-day with no sales history. The genuinely slow gates: Amazon SP-API PII roles, Walmart approval, new-seller risk models. **Design agents to throttle activity on accounts younger than 30 days.**
