# Compliance & Risk — The Rules That Keep the Machine Running

This venture's biggest existential risks are not competition — they are **account terminations** (marketplace, ad, payment). Every rule below exists because breaking it kills an income stream overnight. Automated agents and VAs must treat these as hard constraints.

## 1. Selling before you stock — the legal way

The "sell first, buy inventory later" approach (the Tate-style validation strategy) is legal **if done as dropshipping/POD or clearly-disclosed preorder**, and illegal-ish (FTC trouble + platform bans) if done as silent delayed shipping.

- **FTC Mail/Internet Order Rule ("30-Day Rule")**: you must have a reasonable basis to believe you can ship within the time you advertise (or 30 days if you don't state one). If a delay happens: notify the customer, give a revised date, and offer a full refund. Consent or refund — no silent delays.
- **How we comply automatically**: POD and dropship suppliers hold the stock, so there is no gap between sale and ability to ship. Product pages always display the supplier's real production + shipping window with 2 days of padding. Any order that hasn't shipped by the promised date triggers an automatic apology + choice of wait/refund email (see `customer-service-sop.md`).
- **Never** list an item we have no fulfillment path for. "Test listings" must be fulfillable, even if at a temporary loss.

## 2. Sales tax

- **Marketplaces (Etsy, eBay, Amazon, TikTok Shop, Walmart)**: marketplace facilitator laws in effectively all US states make the *platform* collect and remit sales tax. Selling marketplace-first means near-zero sales-tax admin. This is a real (and underrated) reason our launch waves start on marketplaces.
- **Own store (Stripe checkout)**: economic nexus thresholds are typically $100k revenue or 200 transactions *per state* per year. Early on, the only registration that matters is the **home state**. Revisit when own-store revenue passes ~$3k/mo (set as a tracker alert).
- **Arbitrage**: get a **resale certificate** (free/cheap in most states) so inventory purchases are tax-exempt; without it you pay sales tax on inventory AND the marketplace collects on the sale.

## 3. Income tax & entity

- Start as **sole proprietor** (zero setup cost, report on Schedule C). Get a free **EIN** from irs.gov (10 minutes, keeps your SSN off platform tax forms).
- Form an **LLC** when either (a) monthly profit consistently exceeds ~$1,500, or (b) we begin holding inventory / signing supplier agreements. Cost varies by state (~$50–$500). Not a launch blocker.
- Expect **1099-K** forms from each marketplace/processor (current federal threshold is low — assume everything is reported). The weekly P&L tracker doubles as the tax record. Set aside ~25–30% of net profit for taxes; pay quarterly estimates once profit is real.

## 4. Payment risk — protecting the Stripe account (READ THIS ONE)

Owner decision: **reuse the existing Stripe account** for the custom store. Marketplaces process their own payments, so Stripe exposure exists **only** on our own store. That decision is workable but comes with non-negotiable mitigations, because Stripe monitors dispute rate and a bad month can freeze the account your *existing* business also depends on:

1. Stripe's early-warning threshold is a **~0.75% dispute rate** (Visa/Mastercard monitoring programs kick in around 0.9%–1%). Our internal red line is **0.4%** — half the danger zone.
2. **Refund fast, refund generously.** A $25 refund is always cheaper than a $25 chargeback ($15 fee + dispute-rate damage). Standing rule: any complaint under $50 where the customer is even *arguably* right → instant refund or free replacement, no questions. This is also the Tate playbook applied correctly: discounts/refunds as the cost of testing.
3. **Set the statement descriptor** to the store's brand name so customers recognize the charge (unrecognized descriptors are a top chargeback cause).
4. **Upload tracking numbers to Stripe** on every order (automated via API) — it's the core evidence in "item not received" disputes.
5. **Realistic delivery promises** on every page, checkout, and confirmation email.
6. Enable **Stripe Radar** default rules; block prepaid cards + mismatched-country cards if fraud appears.
7. **Tripwire**: if disputes hit 3 in any rolling 30 days OR 0.4% rate, the automated weekly review flags it, we pause paid traffic to the store, and we open a separate Stripe account for the venture before scaling further. This tripwire is encoded in `07-automation/architecture.md`.

## 5. Platform terms of service — what we automate and what we don't

| Allowed (we do) | Banned (we never do) |
|---|---|
| Creating/managing listings via official APIs (Etsy v3, eBay Sell, Printify) | Bots that mass-comment, mass-DM, auto-follow, or fake engagement |
| Scheduling posts via official tools/APIs (Pinterest, Meta publishing API, Buffer/Tailwind) | Buying followers/reviews, review swaps, incentivized reviews |
| AI-generated product designs, listings, and ad creatives (with IP screening) | Copying competitor listings/photos wholesale |
| Email marketing to our own opted-in customers | Purchased email lists / cold email blasts to consumers |
| Human VAs genuinely participating in communities under disclosed accounts | Sockpuppet accounts, astroturfing, undisclosed self-promo in communities |
| Repricing/inventory automation on our own listings | Circumventing platform fees (fee avoidance = ban) |

Platform-specific dropshipping rules that matter:
- **Amazon**: dropshipping allowed ONLY if we are the seller of record and packaging shows us — retail-arbitrage-style dropshipping (Walmart→Amazon direct ship) is **banned** and a fast suspension. Arbitrage on Amazon means real inventory through FBA/prep centers, not dropshipping.
- **eBay**: fulfillment from wholesale suppliers is allowed; ordering from another *retailer* to ship to your buyer is banned.
- **Etsy**: POD is allowed with the print provider disclosed as a "production partner" on the listing (a checkbox in the listing flow — our listing pipeline includes it). Etsy requires designs be our own/our design direction — fully-AI-generated is currently permitted but must be disclosed under Etsy's 2024+ creativity standards where applicable.

## 6. Intellectual property — the #1 POD account-killer

- **Never** put trademarked phrases, brand names, logos, sports teams, character names, or celebrity names/likenesses on products. This includes "parody" — parody is a legal defense, not a listing strategy, and platforms remove first and never ask.
- The design pipeline (`07-automation/`) includes a mandatory **trademark screen**: every design phrase gets checked against USPTO's trademark search (tess/tmsearch) + a common-sense brand check before listing. Screening output is logged.
- Fonts/graphics used in designs must be commercially licensed (use commercial-free sources; log the license per asset).

## 7. Advertising & marketing claims

- No income claims, no fake scarcity ("only 2 left" when untrue), no fake countdown timers, no "was $80 now $20" fake compare-at pricing (FTC + platform policies).
- AI-generated review-style content presented as real customer reviews is illegal under the FTC's 2024 fake-reviews rule. Testimonials only from real customers.
- Product claims (e.g., health/safety benefits) must be substantiated; avoid regulated categories entirely at our scale: supplements, cosmetics contacting skin with claims, children's sleep products, anything ingestible, electronics without certifications (battery/charging products carry real liability).

## 8. Restricted/blocked product categories (standing rule for all agents)

Never source or list: supplements/ingestibles, weapons/knives beyond kitchenware, counterfeit-adjacent items, recalled products (check CPSC for arbitrage buys), children's products requiring CPSIA testing (unless supplier provides certs), batteries/chargers without UL/FCC docs, medical devices, CBD, and adult content. When in doubt → skip; product selection is never worth the account.
