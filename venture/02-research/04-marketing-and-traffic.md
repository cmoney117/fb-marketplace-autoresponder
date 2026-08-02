# Research: Traffic & Marketing Systems (August 2026)

*Research method: 21 web searches across marketplace SEO, Pinterest, short-form video, email, paid-ads benchmarks, VA rates, and platform-enforcement data. Numbers labeled "practitioner heuristics" are widely-used rules of thumb, not measured constants. Community-sourced figures carry survivorship bias — treat as order-of-magnitude planning inputs.*

**Operating constraints this playbook assumes:** solo operator, near-total automation via AI agents plus optional low-cost VAs, marketplace-first (Etsy/eBay) then own store, and a hard rule of **zero ToS-violating automation** — no engagement bots, no fake reviews, no DM spam. Every tactic below uses official APIs, approved schedulers, or humans doing human things.

---

## SECTION 1 — Organic channels, ranked by effort-to-result

**Ranking for this business model (highest leverage first):**

1. **Marketplace SEO (Etsy first, eBay second)** — the traffic is already commercial-intent; you "rank" by publishing good listings, which is exactly what AI agents are good at producing at volume.
2. **Pinterest** — the only social platform where scheduled, faceless, evergreen product content compounds; officially automatable via API partners.
3. **Email** — small absolute numbers early, but the highest revenue-per-hour once flows are built (build once, runs forever).
4. **Short-form video** — high variance, faceless content is viable, partially automatable via official APIs.
5. **Reddit/communities** — high trust value, zero automation allowed in practice; human/VA-only, low volume.
6. **Blog/programmatic SEO** — worst effort-to-result for year one; defer.

### 1.1 Etsy SEO (primary channel)

**How ranking actually works** — per Etsy's official [Search & Recommendation Ranking Disclosures](https://www.etsy.com/legal/policy/search-advertisement-recommendation/899478564529) and [eRank's factor breakdown](https://help.erank.com/blog/7-factors-that-affect-rank-on-etsy/), Etsy ranks on:

- **Relevancy:** how closely titles, tags, attributes, and (since 2022+) descriptions match the query. 2025-2026 commentary ([Marmalead](https://blog.marmalead.com/etsy-algorithm-2026/), [ListyBox](https://listybox.com/blog/etsy-algorithm-search-ranking-guide-2026)) describes a shift toward "contextual relevance" — better to convert well in 100 narrow searches than appear in 1,000 broad ones.
- **Listing quality score:** an undisclosed per-listing score built from CTR, add-to-cart, favorites, and purchases after impressions.
- **Recency:** new listings get a temporary boost while Etsy gathers interaction data; renewals get a smaller one.
- **Shop-level signals:** customer experience score (reviews, on-time shipping, complete About section), shipping price (US free-shipping favored), and market/language.

**Tag/title practice with evidence** ([eRank title guidance](https://help.erank.com/blog/seo/etsy-title-update-2025-how-to-write-better-etsy-listing-titles/), [eRank best practices](https://help.erank.com/listing-optimization/best-practices-for-etsy-listings/)):

- Front-load the most important keyword phrase in the title; keep it human-readable, not keyword soup. Etsy's 2025 title guidance explicitly says short, clear, descriptive; drop subjective filler ("beautiful") and promo language ("free shipping").
- Use **all 13 tags**, multi-word phrase tags, no wasted single words, repeat your top 1-2 keywords across title+tags, and use remaining tags to widen reach (synonyms, occasions, recipient, style).
- Fill every attribute — attributes function as extra tags.

**Listing count for meaningful traffic (community data, not official):** Etsy forum threads converge on: 4-10 listings to open, visible traffic pickup around **30-50 listings**, and sellers citing **100-150 listings** as where search traffic becomes meaningful ([Etsy community thread](https://community.etsy.com/t5/Etsy-Success/How-many-listings-should-you-have/td-p/79381593); one seller reported sales "soared" after expanding to 140). For POD/digital where marginal listing cost is ~$0.20 + agent time, the plan writes itself: **launch with 30-40, add 5-10/week to 150+**. First-sale expectations: typically 2 weeks-3 months for a cold shop; the algorithm takes ~30-60 days to "learn" new listings ([TechPenny](https://techpenny.com/when-expect-first-sale-on-etsy/), [Meer's World](https://www.meersworld.net/2026/02/how-long-does-it-take-to-get-sales-on-etsy-realistic-timelines.html)).

**Compliant automation:** listing creation/publishing through Printify/Printful integrations or Etsy Open API v3 tools (Vela, etc.) is explicitly permitted — approved uses include listing management, inventory sync, renewals, analytics ([Etsy API Terms](https://www.etsy.com/legal/api/)). Prohibited: auto-favoriting, review manipulation, mass messaging. Note: since 2025 Etsy requires **disclosure of AI-generated content in listings**, and non-disclosure has become an active suspension trigger ([ShieldMyShop](https://www.shieldmyshop.com/blog/2026-03-26-etsy-suspension-2026-new-rules-what-changed)) — the listing pipeline must tag AI-generated imagery.

### 1.2 eBay SEO basics

Cassini (eBay search) weighs ([Frooition eBay SEO guide](https://www.frooition.com/ebay-seo-guide/), [3Dsellers](https://www.3dsellers.com/blog/ebay-seo-cassini)):

- **Title:** highest-weighted input; primary keyword in the first 5-7 words of the 80 characters.
- **Item specifics:** fill every field — powers filters and relevance matching; the most common silent visibility killer.
- **CTR, sell-through rate, and sales consistency:** steady weekly sales outrank bursty ones.
- **Seller performance:** defect rate, late shipment, returns — good metrics lift your whole inventory.

**New-seller reality:** eBay caps new accounts at **10 items / $500 per month**, raised gradually with performance ([LitCommerce](https://litcommerce.com/blog/ebay-selling-limits/)). So eBay is a slow-build secondary channel: list your 10 best sellers from Etsy data, request limit increases monthly. Don't build eBay-first as a POD volume play.

### 1.3 Pinterest (best compliant "social" channel for this model)

**Still works in 2025-2026:** 619M MAU (Q4 2025, +12% YoY); 55% of users say they use Pinterest to shop; ~1.8% e-com conversion rate and 2.2x higher purchase intent vs. other social; Pinterest drove an estimated $3.65B in retailer e-com revenue in 2025 ([Sprout Social stats](https://sproutsocial.com/insights/pinterest-statistics/), [Charle Agency roundup](https://www.charleagency.com/articles/pinterest-statistics/)). Pinterest CPA for retail (~$7-8) is the lowest of major paid-social platforms, which matters later ([WebFX](https://www.webfx.com/blog/social-media/pinterest-marketing-benchmarks/)).

**Compliant automation:** Pinterest has an official API with approved partners — Tailwind (API partner since 2012), Buffer, Canva, Metricool — plus Pinterest's **native scheduler** ([Pinterest's own list](https://create.pinterest.com/blog/tools-to-automate-pin-scheduling/)). Programmatic pin creation via the API **is allowed**, but the [Developer Guidelines](https://policy.pinterest.com/en/developer-guidelines) run a spam-monitoring program with strikes for apps generating spam; practical guidance is to publish gradually, not in bulk bursts.

**Volume and expectations:** community consensus and scheduler data suggest **5-25 pins/day is the productive band; stay under ~50/day and never 50 in an hour** (spam-filter trigger) ([SmarterQueue](https://help.smarterqueue.com/article/460-pinterest-best-practices), [Madpin](https://madpinmedia.com/what-is-pinterest-spam-block-filter/)). Realistic trajectory from 2025 case studies: a consistent image-pin strategy took a blog from ~1,000 to ~7,650 outbound clicks/month over ~6 months, +163-433% YoY ([Caffeine & Conquer case study](https://caffeineandconquer.com/pinterest-case-study-traffic-growth/)). Translate: expect **months 1-3 near zero, meaningful clicks months 4-6**, compounding after. Static image pins currently outperform video for outbound clicks. Cost: Tailwind Pro $17.99/mo (150 posts) or Buffer free (3 channels) to start ([Tailwind pricing](https://socialrails.com/blog/tailwind-pricing), [Buffer plans](https://support.buffer.com/article/595-features-available-on-each-buffer-plan)).

**Agent workflow:** product image → AI-generated 2-3 pin variants (1000x1500) → scheduled via Tailwind/Buffer API at 10-15/day → links to Etsy listing or store. Fully compliant, fully automatable.

### 1.4 Short-form video (TikTok / Reels / Shorts)

**What's compliantly automatable:**

- **Creation:** AI product videos (slideshows, b-roll + text overlay, voiceover) violate nothing. Faceless content performs fine: one 2025 organic-growth report found faceless videos averaging 1.5M views vs 1.3M for face-led in its sample, with stronger engagement per 1,000 views ([Social Growth Engineers 2025 report](https://www.socialgrowthengineers.com/2025-tiktok-organic-growth-report-lessons-trends-and-the-road-to-2026)) — treat those absolute numbers as survivor-biased, but the format parity is the point.
- **Publishing:** Instagram via Meta's official **Instagram Graph API** (Reels publishing with `instagram_business_content_publish`) ([guide](https://postproxy.dev/blog/instagram-reels-api-publishing-guide/)); TikTok via the official **Content Posting API** (Direct Post or draft-to-inbox; note it has no native scheduling parameter — the agent handles timing) ([TikTok docs](https://developers.tiktok.com/doc/content-posting-api-get-started)); YouTube Shorts via YouTube Data API. Approved multi-platform schedulers (Buffer, Metricool, Later) wrap all of these.

**Realistic expectations:** high variance is the defining feature — most videos of a faceless product account get hundreds to low thousands of views; occasional outliers drive spikes. Practitioner reporting suggests ~10K followers in 2-3 months is an aggressive-but-possible outcome with daily posting ([InReels](https://www.inreels.ai/blog/faceless-tiktok-ideas), [Minea on TikTok organic dropshipping](https://www.minea.com/branded-dropshipping/branded-content-social-media/tiktok-organic-dropshipping)). Budget 1 video/day/platform from the agent pipeline and judge at 90 days. This is the lottery-ticket channel; Etsy SEO and Pinterest are the base rate.

### 1.5 Blog / programmatic SEO — defer

Realistic pSEO timeline: initial ranking movement 3-4 months, measurable traffic ~6 months, substantial stable traffic 12+ months; ~1 in 3 programmatic implementations hits a "traffic cliff" within 18 months from thin/cannibalized content ([Passionfruit pSEO guide](https://www.getpassionfruit.com/blog/programmatic-seo-traffic-cliff-guide), [Metrics Rule](https://www.metricsrule.com/research/realistic-seo-timeline/)). For a new store with zero domain authority, marketplaces beat a blog on every timeline. **Revisit only after** the own-store phase, with landing pages targeting long-tail product queries — not a generic blog.

### 1.6 Email (build flows on day one of the own-store phase)

**Tooling (2026 free tiers):** Klaviyo **killed its free plan in June 2025** (14-day trial only) ([Sender.net](https://www.sender.net/blog/klaviyo-alternatives/)). Start on **MailerLite** (free: 250 subs / automations included; paid cheap) or **Brevo** (free: 300 emails/day, unlimited contacts) ([Omnisend comparison](https://www.omnisend.com/blog/brevo-vs-mailerlite/)); migrate to Klaviyo when email revenue justifies ~$45+/mo — it remains the e-com standard.

**Flows worth building day one, with benchmarks (Klaviyo platform data):**

| Flow | Benchmark | Source |
|---|---|---|
| Abandoned cart (3 emails) | ~50% open, ~3.3% placed-order, **~$3.65 revenue/recipient** (elite: $28+) | [Klaviyo benchmarks](https://www.klaviyo.com/blog/abandoned-cart-benchmarks), [Attribuly](https://attribuly.com/blogs/abandoned-cart-recovery-rate-klaviyo/) |
| Welcome series | **~$2.65/recipient** | [Eightx flow benchmarks](https://eightx.co/blog/average-klaviyo-flow-revenue-contribution-benchmarks) |
| Post-purchase | 40-45% open; measure repeat-purchase rate (10-15%) | [BS&Co](https://bsandco.us/blog-post/klaviyo-flow-benchmarks) |
| Campaigns (for contrast) | ~$0.11/recipient | Klaviyo data via Attribuly |

Flows generate ~41% of email revenue from ~5% of sends — automation is the whole game here. Note: these flows only fully apply to your own store; on Etsy you don't own the email relationship (and off-Etsy marketing to Etsy buyers without consent violates Etsy policy — collect emails via inserts/free-download landing pages instead).

### 1.7 Reddit & communities — human/VA only

Reddit runs on the **90/10 rule** (≤10% self-promotional contributions) plus per-subreddit rules; violations get shadowbans, subreddit bans, or sitewide suspension ([RedShip guide](https://redship.io/blog/reddit-self-promotion-rules), [Indexly](https://indexly.ai/glossary/reddit-self-promotion-rules)). Automating Reddit posting/commenting for promo is both against our constraints and detectably ineffective — Reddit's spam detection and human moderators are the strictest of any platform. Use it only as: (a) niche research (read-only, agents fine), (b) occasional genuine participation by owner or a VA in niche subreddits, with disclosure, in promo-allowed threads. Expect low volume, high trust value. Never sockpuppet.

---

## SECTION 2 — Paid ads system (activate only after organic validates a product)

### 2.1 Benchmarks (2025-2026)

| Metric | Meta | TikTok | Pinterest |
|---|---|---|---|
| CPM | ~$13.50-16.80 median, e-com; +18-20% YoY | ~$9-13 (median $13.26 for e-com conversion campaigns) | ~$2-5 awareness; higher for conversion |
| CPC | ~$0.70-0.78 avg (apparel ~$0.45) | ~$0.45-1.00 | ~$0.30-1.50 |
| E-com CVR | ~1.57% median | ~0.46-0.85% | ~1.5% (shopping ads) |
| E-com CPA | ~$30 | ~$32.74 | ~$7-8 (retail) |

Sources: [Digital Applied Meta benchmarks](https://www.digitalapplied.com/blog/facebook-ads-benchmarks-2026-cpc-cpm-ctr-industry), [27five Meta e-com benchmarks](https://www.27five.com/blog/meta-ads-benchmarks-ecommerce-2026/), [Lebesgue TikTok benchmarks](https://lebesgue.io/tiktok-ads/tiktok-ads-benchmarks-for-ctr-cr-and-cpm), [Triple Whale TikTok](https://www.triplewhale.com/blog/tiktok-benchmarks), [Tailwind Pinterest ad costs](https://www.tailwindapp.com/blog/how-much-does-pinterest-advertising-cost), [WebFX Pinterest](https://www.webfx.com/blog/social-media/pinterest-marketing-benchmarks/). Site-wide e-com conversion baseline: ~2-3% global average; Shopify median ~1.4%, top 20% above 3.2% ([Shopify](https://www.shopify.com/blog/ecommerce-conversion-rate), [Red Stag](https://redstagfulfillment.com/average-conversion-rate-for-ecommerce/)).

### 2.2 Breakeven ROAS template (fill in before spending $1)

```
Breakeven ROAS = 1 ÷ contribution margin
Contribution margin = (AOV − COGS − shipping − fees − returns allowance) ÷ AOV
```

POD example: AOV $28, print+ship $14, fees $2, returns $1 → margin = $11/$28 = 39% → **breakeven ROAS = 2.55**. Target ROAS = breakeven × 1.3-1.5 for actual profit. A 20%-margin product needs 5.0 ROAS — effectively unadvertisable on Meta at 2026 CPMs; this math is why paid ads favor bundles/AOV boosters or digital products (80-95% margin → breakeven 1.05-1.25) ([Triple Whale breakeven ROAS](https://www.triplewhale.com/blog/breakeven-roas), [Redtrack](https://www.redtrack.io/blog/breakeven-roas/)).

### 2.3 Minimum viable testing (practitioner heuristics — labeled as such)

These are common frameworks used by media buyers, not laws:

- **Per-creative test spend:** evaluate only after **1-3x AOV spent per variant** (minimum ~$50-100/variant for typical SMB e-com) ([AI Advantage creative testing framework](https://aiadvantageagency.com/facebook-ads-creative-testing/)).
- **Kill rule:** pause at **~2x AOV (or 2x target CPA) spent with zero purchases** ([AdManage](https://admanage.ai/blog/when-to-kill-a-facebook-ad)); post-learning, kill anything running ≤50% of target ROAS for 7+ days.
- **Minimum monthly budget to test seriously:** at $50-100/creative and 4-8 creatives/month, ~**$500-1,000/month**; below that, stick to organic + maybe $5-10/day Pinterest (cheapest CPCs).
- Test new creatives **only against other new creatives** (old ads carry pixel history).

### 2.4 Structure: testing → scaling (2026 practice)

- **Test in ABO** (ad-set budgets) for clean, guaranteed spend per variant; **scale in CBO / Advantage+**. Current consensus: hybrid — 60-70% of budget in Advantage+ Sales on proven products, 30-40% in manual ABO testing campaigns ([Superscale CBO vs ABO](https://superscale.ai/learn/cbo-vs-abo-advantage-plus/), [Michael Diaz](https://michaeldconsulting.com/how-to-pick-the-right-budget-strategy-in-meta-ads-abo-cbo-or-advantage-shopping/)). Notably, Advantage+ share of Meta retail spend fell from ~38% to ~20% by Q1 2026 as advertisers took back control — don't go 100% black-box.
- **AI creatives (data, 2025-2026):** AI-generated ads showed ~12% higher CTR on Meta across 50K+ variations, and a Columbia/Harvard/CMU study (500M+ impressions) found 0.76% vs 0.65% CTR. But ROAS parity currently holds only **below ~$100 AOV** — squarely where POD lives — and humans still win on >15s video and high-trust products ([Digital Applied AI creative benchmarks](https://www.digitalapplied.com/blog/ai-ad-creative-benchmark-2026-ctr-roas-data)).
- **AI UGC tools:** Arcads at ~$110/mo for 10 videos (~$11/video, 300+ AI actors); alternatives exist cheaper; Trustpilot sentiment is mixed on value ([eesel Arcads pricing](https://www.eesel.ai/blog/arcads-ai-pricing), [Filmora review](https://filmora.wondershare.com/video-editor-review/arcads-review.html)). At $11/video vs $60-150 for human UGC, it's the right testing tool at low AOV. Disclose AI where platforms require it.

### 2.5 Tracking stack (small scale)

- **UTMs:** one convention, enforced by the agent that builds every link (see `05-marketing/tracking-and-utm-conventions.md`). Inconsistent UTMs = everything lands in "Unassigned" in GA4 ([UTM.io GA4 guide](https://web.utm.io/blog/utm-parameters-ga4/)).
- **GA4 + platform pixels** (Meta Pixel, TikTok Pixel, Pinterest Tag) via the store's native integrations. **Server-side tracking (CAPI): not required pre-scale.** Client-side is acceptable for small budgets; the practical trigger to add server-side conversion tracking is ~$1-2K/month spend or a 30%+ discrepancy between platform and store-reported conversions ([TagTuners](https://tagtuners.com/server%E2%80%91side-ga4-ecommerce-setup-is-it-worth-it-in-2025/), [ZealousWeb](https://www.zealousweb.com/blog/server-side-vs-client-side-tracking-ecommerce/)). Skip GTM server containers until 5-figure monthly spend.
- **Dashboard (minimum viable):** one sheet/Looker Studio pulling spend (per platform), store revenue by UTM, blended ROAS = total revenue ÷ total ad spend, plus MER and per-creative CPA. That's enough to run the weekly review.

### 2.6 Kill/scale rules to encode into the automated weekly review

Agent generates this report every Monday; owner approves actions (human hand on the budget):

1. Any ad ≥2x AOV spend, 0 purchases → **kill**.
2. Any ad ≥50 clicks, CTR <0.5% (Meta) → kill (creative failure).
3. Any ad ROAS ≥ target for 7 days and ≥3 purchases → **duplicate into scaling campaign** or raise budget 20-30% (never >50%/day — resets learning; practitioner heuristic).
4. Campaign-level: blended MER below breakeven for 14 days → cut spend 50%, back to creative testing.
5. Always: top creative's hook/angle → brief for next batch of AI variants (iterate winners, don't just add novelty).

---

## SECTION 3 — VAs & outsourcing

**Current rates (2025-2026):**

| Source | Role | Rate |
|---|---|---|
| OnlineJobs.ph (direct hire, no commission; platform sub $69-99/mo) | General/e-com VA, full-time | **$450-800/mo** entry-level admin/listings; $800-1,350/mo for social/customer-service mid-level ([OnlineJobs salary guide](https://blog.onlinejobs.ph/comprehensive-guide-to-virtual-assistant-salaries-in-the-philippines/), [HireTalent.ph](https://hiretalent.ph/blog/salary-guide-for-hiring-filipino-virtual-assistants)) |
| Upwork | VA hourly | ~$10-20/hr median $13; PH-based general admin $3-10/hr; e-com-specialized (Shopify/Klaviyo/Gorgias) higher ([Upwork rates page](https://www.upwork.com/hire/virtual-assistants/cost/), [Smart Outsourcing](https://smartoutsourcingsolution.com/resource/virtual-assistant-eor-hourly-rates-philippines/)) |

**VA vs AI agent task split.** Rule: *agents do generation and data; VAs do judgment calls on other humans' platforms and anything requiring a logged-in human.*

- **AI agent:** keyword research, listing drafts, tag sets, pin/video generation, scheduling via APIs, weekly ad report, email flow copy, competitor monitoring.
- **VA (part-time, 10-20 hrs/wk, ~$200-400/mo to start):** customer messages/disputes (marketplaces judge response quality), QA of AI-generated listings before publish, Reddit/community participation, order-issue resolution with POD suppliers, review responses.
- **Sequence:** don't hire until customer messages exceed ~30-45 min/day; before that, an agent-drafts/owner-approves inbox is enough.

**Management-light hiring (practitioner playbook):** post detailed job ad on OnlineJobs.ph → filter for a specific instruction buried in the ad (attention test) → **paid test task** (real listing upload or 5 sample customer replies, pay $10-20) → hire the best on a 30-day paid trial → SOPs as Loom video + written steps with explicit escalation rules ("refund up to $X without asking; escalate Y") → daily async end-of-day summary, no meetings ([InsideOut VA hiring guide](https://insideoutva.com/blog/how-to-hire-ecommerce-virtual-assistant-2026-complete-guide)). Start the VA read-only for week one.

---

## SECTION 4 — What NOT to do (documented enforcement)

1. **Engagement bots / unauthorized Instagram automation.** Meta ran ban waves through 2025 (May, June, August), suspending thousands of accounts including paying Meta Verified businesses; in October 2025 it cut DM rate limits ~96% (5,000→200/hr), breaking gray-area tools overnight. Browser-automation and input-simulating extensions trigger hard bans via ML behavioral detection ([SumGenius ban-wave report](https://sumgenius.ai/blog/instagram-dm-bot-ban-wave-2026/), [PostEngage](https://postengage.ai/blog/instagram-automation-ban-risk-truth)). Only Meta's official APIs and API-partner tools are safe.
2. **Mass DMs / cold outreach automation.** First detected wave: ~7-day messaging restriction; second: 30 days; then account loss ([CreatorFlow compliance guide](https://creatorflow.so/blog/instagram-dm-compliance-meta-rules/)). Also now largely illegal under spam regs in EU/UK contexts. Never worth it.
3. **Review manipulation.** Etsy suspends shops for shilling, review exchanges, buying reviews, or purchasing your own products ([ShopShield](https://www.shop-shield.com/blog/how-to-avoid-etsy-suspension-2025)). Federally, the **FTC Consumer Review Rule (effective Oct 21, 2024)** allows civil penalties of **$51,744 per violation** — each fake review counts separately, AI-generated included; first warning letters went out December 2025 ([FTC rule announcement](https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials), [FTC Q&A](https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers)).
4. **Buying followers/engagement.** Instagram purges bought followers and flags purchasing accounts; the FTC rule also explicitly covers buying fake social-media indicators. Zero commercial value — engagement rate collapse suppresses organic reach anyway.
5. **Pinterest bulk-spam.** 50+ pins/hour triggers automatic spam blocks; API apps generating spam get strikes and removal under the [Developer Guidelines](https://policy.pinterest.com/en/developer-guidelines).
6. **Etsy-specific traps:** undisclosed AI-generated listing imagery (2025+ disclosure requirement), running undisclosed multiple shops, and off-platform marketing to Etsy buyers' emails without consent — all suspension triggers ([GoLogin Etsy suspension guide](https://gologin.com/blog/etsy-account-suspended/)).
7. **Reddit sockpuppeting/vote manipulation** — shadowbans are silent; you'll waste weeks posting to nobody ([RedShip](https://redship.io/learn/how-to-avoid-getting-banned-marketing-reddit)).

**The safe-automation litmus test:** if the automation *publishes content you made, on your own account, via an official API or approved partner tool* — fine. If it *simulates a human interacting with other people or inflates social proof* — banned, detectable, and in the review case now federally fined.
