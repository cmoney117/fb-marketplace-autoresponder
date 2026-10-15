# Compliance and Blockers: Weighted Hooded Cloak (dropship test)

Checked 2026-10-15. This is first-pass research, not legal advice, and nobody involved is a lawyer. It covers what we must say, must not say, and must do before the first order. It also lists the things that could stop the plan.

**How the sources were read.** This network refuses connections to temu.com, ftc.gov, ecfr.gov, transparency.meta.com, ads.tiktok.com, stripe.com, cpsc.gov and most other primary sites. So every quote below comes from search-engine excerpts of those pages, and the source URL is the page itself. Quotes marked *(excerpt)* should be checked on the live page before anyone relies on the exact wording. Where sources disagreed, the doc says so.

**Read with:** `economics.md` (price, landed cost, delivery promise), `brand-screen.md` (working brand **Hunkerhood**), `../04-operations/compliance-and-risk.md` (house rules), `../04-operations/customer-service-sop.md` (email templates), `../05-marketing/ads-system.md`.

---

## Summary

| # | Topic | Verdict | What it means for us |
|---|---|---|---|
| 1 | Temu as a dropship supplier | **Not allowed by Temu's terms.** No clause names dropshipping, but the own-use clause covers it, and Temu says it does not support dropshipping. Enforcement is uneven. | Fine for the sample. For customer orders, use it only for a short test of 20 orders or fewer, on an account we can afford to lose, with a backup supplier ready. |
| 1 | AliExpress | **Allowed.** It runs a Dropshipping Center and names official dropshipping partners. | Best backup if the same item is on AliExpress with a US warehouse. |
| 1 | CJ Dropshipping | **Allowed.** Dropshipping is CJ's whole business. | Best backup for blank packaging and US-warehouse stock. Confirm with a test order. |
| 2 | FTC Mail Order Rule | Applies to every order. It is our duty even though the supplier ships. | We need a shipping promise we can back up, a delay notice **before** the promised ship date, and refunds within 7 working days. |
| 3 | Meta / TikTok ad policies | No health claims, no "you" + mental-health hooks, no before/after, no absolute claims. | Use the banned-phrase check on every ad and page. |
| 4 | FTC reviews and pricing | No fake or borrowed reviews. No "compare at" or "was" price. | Launch at $99 flat (already decided in `economics.md`). |
| 5 | Weighted products and children | Weighted products are unsafe for infants. Weighted blankets are not advised for under-3s, and older kids need supervision. | Adult-only product, adult-only ads, a safety block on the page and in the order email. |
| 6 | Stripe | Dropshipping is not on Stripe's US prohibited list. Long delivery windows are a stated reason for reserves. | A separate Stripe account for the brand is strongly preferred. Set the statement descriptor. Use the order emails below. |
| 7 | Trademark / copyright | Do-not-use list below. Supplier photos are presumed unusable. | Our own photos of the sample only, unless the supplier proves it owns its photos. |
| 8 | Sales tax | Tennessee-based, so we collect TN tax on TN deliveries from the first sale. | Register with TN, then turn on Stripe Tax on the Payment Link with TN registered. |
| 9 | Labels and flammability | The garment needs a fiber/origin/maker label and must meet the clothing flammability standard. | Check the sample's sewn-in label. Put fiber content and "Imported" on the page. |

---

## 1. Supplier terms: buying for resale and shipping to customers

### Temu: not allowed under its terms

**The clause.** Temu's US Terms of Use, §3.1 *(excerpt)*:

> "3.1 You agree to use the Services for your own use, and not on behalf of or for the benefit of any third party."

The same §3.1 wording appears on Temu's other regional terms pages. The UK terms go further: users represent that they use the services for personal, non-commercial use *(paraphrase of excerpt)*. §3.2 says account credentials must not be shared with any third party, so a VA must not log in to Cody's Temu account.
Sources: [Temu US Terms of Use](https://www.temu.com/terms-of-use.html), [Temu US terms (bgp page)](https://www.temu.com/bgp_terms_policy.html), [Temu UK Terms of Use](https://temu.com/uk/terms-of-use.html).

**Temu's own help center.** Several guides report a Temu support article, "Does Temu support drop shipping?", that says Temu does not support dropshipping. We could not open the page, so this is second-hand.
Sources: [WorldFirst: Temu dropshipping](https://worldfirst.com/uk/marketplace-sellers/e-commerce-guides/temu-dropshipping), [Quora thread linking temu.com/support](https://www.quora.com/Can-you-use-Temu-temu-com-for-drop-shipping), [Branvas: Temu dropshipping risks 2026](https://branvas.com/blogs/news/temu-dropshipping-risks-alternatives).

**Plain verdict.** Ordering from Temu and shipping to our customers is **against Temu's terms as written**. The terms do not use the word "dropshipping", but placing an order "on behalf of or for the benefit of" a customer is exactly what §3.1 excludes. Buying the sample for ourselves is fine. Reselling an item we bought for ourselves is lawful (first-sale doctrine). The problem is the contract with Temu, not the law.

**Practical risk:**

| Risk | Detail | How bad |
|---|---|---|
| Account closure | Temu can close the account. Pending orders, credits and refund claims can be lost. Third-party guides report Temu flags patterns like many orders to many different addresses, and billing/shipping name mismatches. | High at scale; moderate for 20 orders or fewer |
| Order cancellation or refund refusal | Guides report Temu cancelling orders or refusing refunds when it decides a purchase is for resale. | Moderate |
| Order limits | We found **no published per-account order limit**. The limit is whatever triggers the pattern flags. | Unknown |
| Temu-branded packaging | Temu ships in bright orange Temu-branded mailers, and the sender name on the label shows Temu. **We cannot change this.** A customer who searches Temu finds the item for about $35, which leads to refund requests and chargebacks. We found no reliable source saying a packing slip shows the price. Check the sample. | High; this is the biggest day-to-day risk |
| No inserts | We cannot add a packing slip, a care card or the safety warning to the parcel. | The warning must live on the page and in the order email (section 5) |
| Customer data | We give each customer's name and address to Temu. | The privacy policy must say we share shipping details with fulfillment partners |

Sources: [Branvas](https://branvas.com/blogs/news/temu-dropshipping-risks-alternatives), [TrueProfit: Temu dropshipping](https://trueprofit.io/blog/temu-dropshipping), [USAdrop: Temu dropshipping](https://usadrop.com/?p=23715), [dodropshipping: Temu dropshipping with Shopify](https://dodropshipping.com/temu-dropshipping-with-shopify/), [WorldFirst](https://worldfirst.com/uk/marketplace-sellers/e-commerce-guides/temu-dropshipping).

**Rules if Cody runs the Temu test anyway:**
1. Use a Temu account that holds nothing we would miss: no stored credits, and not one Cody needs for personal shopping.
2. Cap it at 20 customer orders, then stop and review (this matches the `economics.md` tripwires).
3. Tell customers plainly on the page and in emails that the item ships from a fulfillment partner in plain or partner packaging. Never claim "our warehouse" or "our studio".
4. Keep a backup supplier set up before the first ad dollar (AliExpress or CJ, below).
5. Any warning, cancellation wave or flag from Temu is an immediate stop (already a tripwire in `economics.md`).

### AliExpress: allowed

AliExpress supports dropshipping officially. It runs a Dropshipping Center inside AliExpress, and it names official dropshipping partners: DSers says it is the "AliExpress official dropshipping partner", and Modalyst says AliExpress "selected" it as an official partner of the AliExpress Dropshipping Booster Program. Orders go to the end customer's address.
Sources: [AliDrop: AliExpress Dropshipping Center](https://www.alidrop.co/blogs/aliexpress-dropshipping-center), [Modalyst: official AliExpress partner](https://support.modalyst.co/en/articles/3974717-is-modalyst-an-official-partner-of-aliexpress-com), [DSers on Wix](https://wix.com/app-market/web-solution/dsers-aliexpress-dropshipping), [Wise: AliExpress dropshipping](https://wise.com/sg/blog/aliexpress-dropshipping).

Practical risks: practices vary from seller to seller. Write "no invoice, no price, no promotional inserts" in the note to the seller, but expect some sellers to ignore it ([dodropshipping: inform AliExpress suppliers](https://dodropshipping.com/should-you-inform-aliexpress-suppliers-before-dropshipping/)). China-direct shipping is slow, so use only listings that ship from a US warehouse for paid traffic. Reverse-image-search the listing photos (section 7).

### CJ Dropshipping: allowed

Dropshipping is CJ's core business. It has a signed dropshipping agreement for customers ([CJ support](https://support.cjdropshipping.cn/?p=844)), US warehouses (third-party reviews put delivery at 2-7 days from the US warehouse; [easync review 2026](https://easync.io/articles/cj-dropshipping-review/), [Spocket overview](https://www.spocket.co/blogs/cjdropshipping-overview)), and custom packaging and logo inserts for a fee ([hustlegotreal review](https://hustlegotreal.com/?p=5107)). CJ can also source a specific item on request.

Practical risks: only some SKUs are stocked in the US. When US stock runs out, orders can fall back to China (7-22 days). We found no CJ policy text on default blank packaging, so place one test order to our own address before switching ([Dropified: US suppliers](https://www.dropified.com/?p=15570)).

---

## 2. FTC Mail, Internet, or Telephone Order Merchandise Rule (16 CFR Part 435)

**Who it binds:** the seller, which is us. A supplier's delay is still our violation.

**What we must state and do:**

1. **Ship within the time we advertise, and have a reasonable basis for it.** If the page states no time, the default is **30 days** from a properly completed order. "Ship" means handed to the carrier. Delivery-date promises ("arrives in 5-11 business days") are covered by the general FTC Act ban on deception, so they need a basis too.
2. **Keep the evidence.** If we have no records showing how we set the promise, the rule presumes we had no reasonable basis *(excerpt, §435.1(b))*. Keep: the supplier listing's stated processing and shipping times (`listing.json`), the sample's order/ship/delivery dates, and each order's supplier order date and tracking.
3. **When we learn we can't ship on time,** send a **delay-option notice** within a reasonable time and **before the promised ship date passes**. It must:
   - give a **definite revised ship date**, or say we don't know and explain why;
   - offer the right to **cancel for a full, prompt refund**, with a free way to do it (reply to the email or click a link).
4. **Silence rules:**
   - Revised date **30 days or less** after the original: the notice must say that if the customer doesn't cancel, they are deemed to agree to wait. Silence then counts as consent.
   - Revised date **more than 30 days** late, or unknown: we need the customer's express "yes". Otherwise the order is cancelled and refunded automatically, unless we ship within 30 days of the original date.
   - **A second delay** after they agreed to the first: send a new notice before the revised date passes. Only an express "yes" keeps the order. Silence means cancel and refund.
5. **Refund deadline:** for card payments, within **7 working days** of the cancellation (2014 amendment; the old "one billing cycle" now applies only to store-issued credit). Our house target is the same or next business day through Stripe.

Sources: [FTC business guide to the rule](https://ftc.gov/business-guidance/resources/business-guide-ftcs-mail-internet-or-telephone-order-merchandise-rule), [eCFR 16 CFR Part 435](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-435), [Cornell LII §435.2](https://www.law.cornell.edu/cfr/text/16/435.2), [GovInfo 2024 CFR Part 435 PDF](https://www.govinfo.gov/content/pkg/CFR-2024-title16-vol1/pdf/CFR-2024-title16-vol1-part435.pdf), [Federal Register 2014 amendments](https://www.federalregister.gov/documents/2014/09/17/2014-22092/mail-or-telephone-order-merchandise-rule), [Loeb & Loeb: FTC updates its mail order rule](https://www.loeb.com/en/insights/publications/2014/10/ftc-updates-its-mail-order-rule), [Arent Fox: Mail Order Rule makeover](https://www.afslaw.com/perspectives/the-fine-print/mailin-it-the-ftc-gives-the-mail-order-rule-makeover).

**For this product:**
- The promise text comes from one config value, not hand-typed copy. The current candidate from `economics.md` §7 is "Ships in 1-4 business days. Arrives 5-11 business days after you order (US, tracked)." It is valid **only** if the listing ships from a US "Local" warehouse. If it ships from China, the honest promise is 10-22 business days, and no paid ads run on it.
- **Fix to the house T2 email:** `customer-service-sop.md` T2 fires "past promised date". The rule needs the notice **before** the promised **ship** date passes. New trigger: if a supplier order has no tracking by the end of business day 3 after the customer's order, send the delay notice that day (the promise is "ships in 1-4 business days").
- If Temu cancels or stocks out, tell the customer the same day and either refund at once or offer a new definite date with the cancel option.

**Delay-option notice for this product** (this replaces T2 for the cloak; the optional 10-15% credit from T2 can be added):

> Subject: Your order #{order} is running late. Your choice.
>
> Hi {first_name}, your {product_name} hasn't shipped yet and won't ship by {original_ship_by_date}. Our fulfillment partner now expects to ship it by **{revised_ship_date}**, so it should arrive around {revised_arrival_date}.
>
> 1. **Keep your order:** do nothing. If we don't hear from you before {revised_ship_date}, we'll take that as OK to wait.
> 2. **Cancel for a full refund:** reply "cancel" or use {cancel_link} at any time before it ships. We refund the full {amount} to your card within 1 business day.
>
> Sorry for the wait. {sender_name}, {brand} · {support_email}

If the revised date is more than 30 days after the original date, or unknown, replace option 1 with: "If we can't ship by {original_plus_30}, we will cancel and refund you automatically unless you reply 'keep it'."

---

## 3. Meta and TikTok ad policies

### Meta

**Personal attributes (the "Are you anxious?" rule).** Meta's Advertising Standards *(excerpt)*: ads must not contain content that asserts or implies personal attributes, including "direct or indirect assertions or implications about a person's race, ethnicity, religion, beliefs, age, sexual orientation or practices, gender identity, disability, physical or mental health (including medical conditions), vulnerable financial status, voting status, membership in a trade union, criminal record, or name."
- Banned pattern: "you/your" + a health or mental state. Examples: "Are you anxious?", "Struggling with stress?", "Your anxiety deserves a break", "Can't sleep?".
- Allowed pattern: describe the product, or speak in the first or third person. Examples: "A calming weight for quiet nights in", "Made for homebodies".
- "Introvert" is not on Meta's list, but "Are you an introvert?" next to calm/stress copy can read as implying mental health. Use it only in the third person ("for homebodies and introverts").
Sources: [Meta: Privacy violations and personal attributes](https://transparency.meta.com/policies/ad-standards/objectionable-content/privacy-violations-personal-attributes/), [Meta: Introduction to the Advertising Standards](https://transparency.meta.com/policies/ad-standards/), [Stackmatix: personal attributes policy](https://www.stackmatix.com/blog/meta-ads-personal-attributes-policy), [LeadSync: personal attributes explained](https://leadsync.me/blog/meta-privacy-violations-and-personal-attributes-advertising-policy/).

**Health claims.** Meta's Unacceptable Business Practices policy bars "deceptive or exaggerated claims about the success of a product" and lists exaggerated health benefits among the examples *(excerpt)*. "Reduces anxiety", "calms your nervous system" and "better sleep" are exaggerated health benefits for a hoodie. [Meta: Unacceptable business practices](https://transparency.meta.com/policies/ad-standards/fraud-scams/unacceptable-business-practices/).

**Before/after.** Meta's health and wellness standard barred before/after transformations and ads that create negative self-perception. Trackers report a July 2026 rewrite that moved review to the claims made, and sources disagree about what changed. Our rule is stricter than either version: **no before/after framing at all.** That includes a "stressed face, then calm face in the cloak" sequence, because it implies a mental-health result. Sources: [Meta: Health and wellness](https://transparency.meta.com/policies/ad-standards/restricted-goods-services/health-wellness), [Conduct Atlas: Meta policy diff](https://conductatlas.com/diff/meta-ads/meta-advertising-policies/2204/5215/), [Adligator: 2026 update](https://adligator.com/blog/meta-health-wellness-ad-policy-update-2026).

**Weighted products.** We found no Meta or TikTok policy that names weighted blankets or weighted apparel as a restricted product. They are judged on their claims. Two cautions:
- Weighted **infant** products are a live safety issue (section 5). Never show or mention babies or children.
- Avoid any body-weight language ("lose", "slim", "burn"), so automated review does not misread "weighted" as weight loss.

**Customer feedback score (delivery complaints).** Meta collects post-purchase feedback. Meta has said advertisers with high negative feedback can see "a reduction in ad delivery or loss of advertising eligibility", and it names slow shipping as a common complaint ([Meta newsroom 2018](https://about.fb.com/news/2018/06/improving-customer-service/)). Third-party guides report thresholds (score below 2: reduced delivery; below 1: blocked from advertising), but we could not confirm them on Meta's own pages ([CJ blog](https://blog.cjdropshipping.cn/detail/1418486260478390274), [Bïrch 2026](https://bir.ch/blog/facebook-feedback-score)). An honest, padded delivery promise protects the ad account as well as the Stripe account.

**Targeting:** adults 18+ only.

### TikTok

- **Misleading and false content:** TikTok bars ads that "promise or exaggerate results concerning a product's effect". It restricts exaggerated information and **absolute terms** ("best", "#1", "first"), and its rejection examples include before/after comparisons *(excerpt)*. Sources: [TikTok: Misleading and false content](https://ads.tiktok.com/help/article/tiktok-ads-policy-misleading-and-false-content), [TikTok SMB ad policy PDF](https://ads.tiktok.com/business/library/TikTok_Ad_Policy_SMB2024.pdf).
- **Healthcare:** products that diagnose, treat or monitor a condition are medical devices under TikTok's healthcare policy and face market rules. Treatment claims would push us into that category. [TikTok: Healthcare and pharmaceuticals](https://ads.tiktok.com/help/article/tiktok-ads-policy-healthcare-pharmaceuticals).
- **Landing page:** for e-commerce, TikTok requires visible contact details, company name and address, local-currency pricing, shipping information, a return and refund policy, terms and conditions, and a privacy policy (for example in the footer). The page must be complete and work on mobile. [TikTok: Ad format and functionality](https://ads.tiktok.com/help/article/tiktok-ads-policy-ad-format-and-functionality), [TikTok: landing page checklist](https://ads.tiktok.com/help/article/ad-review-checklist-landing-page).
- **Targeting:** adults 18+ only.

### Why the health line is real, not just platform policy

- **NAD, weighted blankets (2019):** the National Advertising Division told Weighting Comforts to **discontinue "reduces anxiety"** claims. It rejected the argument that these were mere "general wellness" statements because "anxiety is a mental health disorder and anxiety symptoms can be measured". It **allowed** the company to say the blankets give users a **sense of security**. [BBB National Programs decision](https://bbbprograms.org/media/newsroom/decisions/following-nad-inquiry-weighting-comforts-to-modify-discontinue-certain-performance-claims-for-its-we), [Manatt: NAD throws wet blanket on weighted blanket claims](https://www.manatt.com/insights/newsletters/advertising-law/nad-throws-wet-blanket-on-weighted-blanket-claims).
- **Gravity Blanket (2017):** after raising $3M, Gravity withdrew its claims to treat anxiety and insomnia. Saying a product "treats" a condition can make it a medical device. [Scientific American](https://www.scientificamerican.com/article/makers-of-crowdfunded-gravity-blanket-withdraw-unsupported-medical-claims-after-raising-3-million/), [Consumer Reports](https://www.consumerreports.org/consumerist/after-raising-3m-on-kickstarter-gravity-blanket-stops-claiming-to-treat-anxiety/).
- **FTC Health Products Compliance Guidance (Dec 2022):** this covers **all** health-related claims, not just supplements. They need competent and reliable scientific evidence, generally randomized controlled human trials. Hedges like "may help" do not fix an unsupported claim, and testimonials cannot say what we couldn't say ourselves. [Covington summary](https://www.cov.com/en/news-and-insights/insights/2023/01/ftc-issues-new-guidance-on-health-related-claims-to-replace-the-dietary-supplements-advertising-guide), [Jones Day summary](https://m.jonesday.com/en/insights/2023/01/ftc-overhauls-and-expands-25yearold-health-products-advertising-compliance-guide).

So the market leader's "made for anxiety" positioning is **not** something we copy, even in softened form. We sell comfort, coziness and a sense of security.

---

## 4. FTC advertising: reviews and reference prices

### Reviews: Consumer Review Rule, 16 CFR Part 465 (in force since 21 Oct 2024)

It carries civil penalties of up to about $53,088 per violation (2025 inflation figure). It bans:
- **Fake reviews:** reviews from people who don't exist, AI-generated reviews, and reviews from anyone with no real experience of the product.
- **Buying reviews:** paying for or incentivising reviews conditioned on positive (or negative) sentiment.
- **Undisclosed insider reviews:** reviews by Cody, staff or immediate family (spouse, parent, child, sibling) without disclosing the relationship.
- **Review suppression:** hiding negative reviews while presenting the rest as the full picture, or threatening reviewers.
- **Fake social influence:** buying followers, views or likes.

**Borrowed reviews are also deceptive.** Showing Free the Sheep's 798 reviews or 4.94 stars, Temu's reviews, or AliExpress reviews as if they were ours misrepresents our product's reputation. The FTC's first "review hijacking" case (The Bountiful Company, 2023) cost $600,000 for attaching new products to the reviews of other products.

**Our rule:** zero reviews and zero star ratings on the page until real customers of **our** store leave them. Never use AI-written testimonials or "customer quotes". Ask every buyer for an honest review with no incentive during the test. If friends or family review, they disclose it.

Sources: [FTC final rule (Federal Register text)](https://www.ftc.gov/system/files/ftc_gov/pdf/r311003consumerreviewstestimonialsfinalrulefrn.pdf), [FTC 2025 warning letter template](https://search.ftc.gov/system/files/ftc_gov/pdf/2025-Fake-Review-Warning-Template.pdf), [Benesch: FTC turns up enforcement](https://www.beneschlaw.com/insight/five-stars-zero-tolerance-ftc-turns-up-enforcement-under-consumer-review-rule/pdf/), [Venable: heightened enforcement (Dec 2025)](https://www.venable.com/insights/publications/2025/12/ftc-signals-heightened-enforcement-of-new), [Goodwin: final rule](https://www.goodwinlaw.com/en/insights/publications/2024/09/alerts-practices-cldr-ftc-finalizes-rule-on-consumer-reviews), [BCLP: insider reviews](https://www.bclplaw.com/en-US/events-insights-news/part-4-what-the-ftcs-final-rule-means-for-insider-reviews.html), [Fortune: Bountiful review hijacking](https://fortune.com/2023/04/11/ftc-amazon-bountiful-review-hijacking).

### Reference prices: FTC Guides Against Deceptive Pricing, 16 CFR Part 233

- **"Was" or strikethrough prices (§233.1)** *(excerpt)*: "If the former price is the actual, bona fide price at which the article was offered to the public on a regular basis for a reasonably substantial period of time, it provides a legitimate basis for the advertising of a price comparison." If it is "not bona fide but fictitious", the bargain "is a false one". A price is not fictitious just because nothing sold at it, but it must have been openly offered in good faith for a substantial period. Raising a price briefly just to "discount" it is deceptive.
- **"Compare to $X elsewhere" (§233.2):** this needs the **same merchandise** to have sold in substantial amounts at that price in our trading area. Free the Sheep's $199.99 is a different brand's list price. Their own current price is $99.99, so a $199.99 comparison fails twice.
- **"Retail value" / "MSRP" (§233.3):** this needs a price at which substantial sales are actually made. We have none.
- **California (Bus. & Prof. Code §17501)** is stricter: a "former price" must be the prevailing market price within the **three months** before the ad, unless the date is clearly stated. Class actions over strikethrough pricing are common (Michael Kors $4.875M settlement; J.C. Penney).

**Our rule:** $99, no compare-at price, no "% off", no "was". Any later sale must start from a price we actually charged for a real period (log the dates). A legitimate alternative is an **introductory price** that we really raise on a stated date: "Launch price $89 until {date}, then $99". It is only allowed if we actually raise it.

Sources: [eCFR 16 CFR Part 233](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-233), [Cornell LII §233.1](https://www.law.cornell.edu/cfr/text/16/233.1), [Cornell LII Part 233](https://www.law.cornell.edu/cfr/text/16/part-233), [K&L Gates: strike-through pricing (Apr 2025)](https://www.klgates.com/Dont-Let-Strike-Through-Pricing-Strike-Out-Your-DTC-Website-Comparison-Pricing-Is-Effective-but-Carries-Risk-4-29-2025), [Manatt: California §17501 upheld](https://www.manatt.com/insights/newsletters/advertising-law/california-appellate-panel-upholds-validity-of-pri).

---

## 5. Weighted products and children

**What the authorities say:**
- **CPSC (Commissioner Trumka, 15 Apr 2024):** parents should not use weighted blankets or weighted swaddles for babies, and retailers should consider stopping sales. It cites NIH and CDC guidance that weighted products are not safe for infants. Major retailers then pulled weighted infant sleep sacks. [CPSC statement PDF](https://www.cpsc.gov/s3fs-public/Trumka-Statement-on-Weighted-Infant-Blankets-4-15-24.pdf?VersionId=DKKBE2QXMxcKzfM2AqlXchE0fctDsNCa), [CBS News](https://www.cbsnews.com/news/safety-concerns-arise-over-weighted-baby-sleeping-products-after-cpsc-warning/).
- **AAP:** advises against weighted blankets, sleep sacks and swaddles for infants (2022 safe-sleep guidance and a 2023 letter to CPSC). A federal bill (the Safeguarding Infants from Dangerous Sleep Act, 2024) would ban weighted infant sleep products. We found no record of it passing. [Consumer Reports advocacy](https://advocacy.consumerreports.org/press_release/consumer-reports-supports-new-bill-in-congress-to-ban-weighted-infant-sleep-products), [Consumer Federation of America](https://consumerfed.org/press_release/congress-introduces-bills-to-protect-infants-from-hazardous-weighted-sleep-products/), [NPR](https://www.npr.org/2024/08/06/nx-s1-5065485/).
- **Older children:** in 2022 Target recalled Pillowfort weighted blankets after two children, aged 4 and 6, died trapped inside the blanket's zippered cover. Experts do not recommend weighted blankets for children under 3. [Kherkher Garcia summary](https://www.kherkhergarcia.com/two-deaths-pillowfort-weighted-blankets/), [Business Insider](https://www.businessinsider.nl/2-young-girls-died-from-suffocation-inside-a-weighted-blanket-from-target-prompting-the-store-to-recall-200000-products/).
- **Clinical guidance for children** (NHS therapy services): no more than about 10% of body weight, the child must be able to get out unaided, supervised use, and not overnight. [Somerset NHS guidance](https://www.somersetft.nhs.uk/children-and-young-peoples-therapy-service/guidance-on-the-use-of-weighted-blankets/).
- **No mandatory US standard or warning label** for weighted blankets or weighted apparel was found. The label below is voluntary and based on the guidance above.

**What we must avoid:**
- Any child sizes, child models, or child-directed copy, images, ads or targeting (adults 18+ only). **If the supplier listing includes kids' sizes, we do not list them.** Children's upper outerwear with hood or neck drawstrings is also a federal substantial-product-hazard issue (16 CFR 1120), which is one more reason to stay adult-only.
- Any sleep claim ("sleep in it", "better sleep", "fall asleep faster") and any condition linked to children ("autism", "ADHD", "sensory processing", "meltdowns").
- Any suggestion that it is suitable as a blanket for a baby, a nursery or a crib.

**Safety block for the product page and the order-confirmation email.** It is fixed text and the banned-phrase check skips it (see the note on the check). We can't put an insert in the parcel, so it must appear in both places:

> **Safety**
> - Adult garment. Not for children.
> - Never use on or around babies or children under 3. Weighted products are not safe for infants.
> - Only wear it if you can take it off easily on your own.
> - Keep your face and nose clear. Don't sleep with the hood pulled over your face.
> - If you are pregnant, or have breathing, circulation or sleep problems or limited mobility, check with your doctor before using any weighted product.
> - Keep away from open flames, candles and heaters.
> - Weight: about {weight_lb} lb. *(Shown only when the sample confirms it; see the gated claims below.)*

---

## 6. Stripe: dropshipping, long delivery and disputes

**Is dropshipping allowed on Stripe?** It is not on Stripe's US prohibited list. The current list (updated 22 Sep 2026) mentions "advisory services related to drop shipping and the resale of goods", and that entry appears under a Japan heading *(excerpt)*. Stripe has historically treated drop shipping as higher risk, and its restricted-business FAQ says each account is reviewed individually. Sources: [Stripe: Prohibited and restricted businesses](https://stripe.com/legal/restricted-businesses), [Stripe: restricted business FAQ](https://support.stripe.com/questions/restricted-business-list-faqs), [Stripe blog: why some businesses aren't allowed](https://stripe.com/blog/why-some-businesses-arent-allowed).

**Reserves.** Stripe's reserves FAQ lists, as reasons to hold back funds, a business in "an industry with longer-than-average delivery windows" and a higher risk of not fulfilling orders. It also weighs the dispute rate and refund rate. Reserves are normally held 30-90 days. A slow dropship order is exactly that profile, which is another reason to promise only what a US warehouse can deliver. Sources: [Stripe: Reserves FAQ](https://support.stripe.com/questions/reserved-funds), [Stripe: reserves topic](https://support.stripe.com/topics/reserves).

**The existing account (house rule conflict, `economics.md` §1).** Reusing the existing Stripe account has three problems:
1. A dispute spike or reserve hits the existing business.
2. Stripe Checkout and Payment Links show the account's public business name and branding, so a Hunkerhood buyer sees another business's name at checkout.
3. The statement descriptor shows the existing business's name.

A **separate Stripe account for the brand** fixes all three. Cody creates it from the existing Stripe login; we do not.

**Statement descriptor** (what appears on the customer's card statement):
- Rules: 5-22 characters, Latin letters only, none of `< > \ ' " *`, and it must reflect the business name, DBA or URL. The shortened descriptor (prefix) is up to 10 characters. For card payments, a per-payment dynamic **suffix** is joined as `PREFIX* SUFFIX`, 22 characters total. [Stripe docs: statement descriptors](https://docs.stripe.com/get-started/account/statement-descriptors), [Stripe support: statement descriptor requirements](https://support.stripe.com/questions/statement-descriptor-information).
- **New account:** descriptor `HUNKERHOOD.COM` (14 characters) and shortened descriptor `HUNKERHOOD` (10 characters).
- **If the existing account is reused:** set the suffix `HUNKERHOOD` so the statement reads `{EXISTINGPREFIX}* HUNKERHOOD`. A prefix of up to 10 characters fits in 22. Checkout supports this through `payment_intent_data.statement_descriptor_suffix`. **Confirm in the Stripe API reference that Payment Links accept the same parameter.** If they don't, the statement shows only the existing business name, which is a known chargeback trigger.
- Every order email states the exact descriptor (see below).

**Payment Link settings:**
- Collect the shipping address (US only) and a phone number.
- `consent_collection.terms_of_service = required` (needs a Terms URL in Stripe public details).
- Submit-button custom text: "Ships in {ship_window}. Arrives {arrival_window} (US, tracked). Your card statement will show {descriptor}." Custom text may not conflict with Stripe's own checkout text. [Stripe: Checkout policies and custom text](https://edge-docs.stripe.com/payments/checkout/customization/policies).
- Turn on Stripe's customer email receipts. Radar default rules on.

**Order emails that keep disputes down** (MailerLite or manual; these are transactional, not marketing):
1. **Order confirmed** (immediately): item, height size and colour; amount paid; "Your card statement will show **{descriptor}**"; the ship-by date and arrival window as **calendar dates**; "Tracking is emailed when it ships"; who to contact ({support_email}, reply within 1 business day); a one-line summary of the refund policy plus link; "Anything wrong? Reply to this email first. We fix or refund fast, usually the same day"; the safety block from section 5.
2. **Shipped** (within 24 hours of supplier tracking): carrier and tracking link, the arrival window again, and "It ships from our fulfillment partner and may arrive in their packaging". This sets expectations for a Temu or AliExpress mailer.
3. **Delay-option notice** (section 2), sent before the ship-by date passes.
4. **Delivered + check-in** (1-2 days after delivery): "How does it fit?" with a direct path to a size swap or refund. This catches unhappy buyers before they go to their bank.

**Dispute evidence to keep for every order:** the Stripe payment; the supplier order confirmation; the tracking number with **delivery confirmation to the full street address the customer entered** (Stripe says delivery proof lifts "product not received" win rates substantially); every customer email; the product page as it looked on the order date (screenshot or archived HTML). Refund through Stripe, not outside it. Sources: [Stripe docs: dispute best practices](https://docs.stripe.com/disputes/best-practices), [Stripe blog: evidence that wins "product not received" disputes](https://stripe.com/blog/analyzing-the-evidence-that-helps-businesses-win-product-not-received-disputes), [Stripe support: how to handle disputes](https://support.stripe.com/questions/how-to-handle-disputes).

House thresholds stay as in `compliance-and-risk.md` §4: a 0.4% internal red line, and any chargeback during the test stops ads.

---

## 7. Trademark and copyright

**Do-not-use list (names, in any customer-facing text, ad, URL, tag, alt text, file name or hashtag):**

| Name | Why |
|---|---|
| Eden, Eden Hoodie | Competitor product name |
| Free the Sheep, freethesheep, Mellow Days | Competitor brand. FREE THE SHEEP, MELLOW DAYS application, serial 97451254, class 25 (hooded sweatshirts). Also avoid sheep imagery and the word "sheep" ([Justia record](https://trademarks.justia.com/974/51/free-the-sheep-mellow-97451254.html)) |
| Justin Tubis | Competitor founder; using his name is a publicity-rights issue |
| Indio, Indio Cloak, Arcane, Arcane Hoodie | Names used on the Walmart knock-off listing |
| The Comfy | Cozy Comfort's registered class 25 marks for wearable blankets (e.g. Reg. 6896826). The company sues: it won $18M+ at trial against Top Brand before the Federal Circuit reversed in Jul 2025 ([Justia: THE COMFY](https://trademark.justia.com/985/32/the-98532270.html), [Schwabe: Top Brand v. Cozy Comfort](https://www.schwabe.com/publication/latest-federal-court-cases-top-brand-llc-v-cozy-comfort-company-llc/)) |
| Snuggie, Oodie, Gravity Blanket, Bearaby, Covered in Comfort, Hush | Other brands in the wearable-blanket and weighted-blanket category (Hush Blankets: see `brand-screen.md`) |
| Temu, AliExpress, CJ | Supplier names never appear in customer-facing marketing |
| "dupe", "knockoff", "replica", "inspired by", "same factory", "same maker", "same supplier as" | Rides on the competitor's mark. The "same factory" claim is also **unverified** (it is Cody's belief, not a fact we can prove) |

**Photos and video:**
- **Free the Sheep's photos, videos, model shots and lifestyle images: never**, cropped or edited or not.
- **Supplier photos are presumed unusable.** If the Temu item really is the same product as Eden, its listing photos are quite likely Free the Sheep's own images re-uploaded. Use a supplier photo **only if** all of these are true:
  1. A reverse-image search (Google Lens and TinEye) finds no match on freethesheep.com, its ads, its Amazon/Walmart listings or its social accounts;
  2. the supplier confirms **in writing** that it shot the photo and grants us the right to use it; and
  3. it shows no recognisable model, or the supplier confirms it has a model release.
  The seller who publishes an infringing photo is the one liable. "My supplier gave it to me" is not a defense, and US statutory damages run $750-$30,000 per work ([Revision Legal: drop-shipping](https://revisionlegal.com/internet-law/drop-shipping-what-to-know-before-you-sell-online/), [Sourcinbox: copyright in dropshipping](https://www.sourcinbox.com/blog/how-to-avoid-copyright-infringement-when-dropshipping), [lawyerinfo.ca: IP risks for dropshippers](https://lawyerinfo.ca/guides/money-taxes-ip/intellectual-property/intellectual-property-risks-for-canadian-dropshippers/)).
- **Default plan:** Cody photographs and films the sample. AI-generated images are allowed later, once generation is enabled, but must never imitate Free the Sheep's shots, models or settings. They may only show product details the sample confirms.

**Copy:** write everything from scratch. Do not paraphrase their product description, FAQ, size chart wording or reviews. Do not claim "first", "original" or "#1".

**Product design:** we found no Free the Sheep patent. The weighted-apparel design patents we found belong to Omorpho (fitness). An unpatented product design is protected as trade dress only if it has acquired distinctiveness (*Wal-Mart v. Samara*, 2000), which is hard to prove for a hooded cloak. The design risk is low **as long as** we use none of their names, photos, copy or logo-like details. Re-check if they publish a patent number on their site or packaging.

---

## 8. Sales tax (Tennessee seller, Stripe Payment Links)

- **Tennessee orders: collect from the first sale.** We are physically based in TN, so the economic-nexus threshold does not apply to TN. Register for sales tax with the TN Department of Revenue (free, through TNTAP) before the first TN order, or add this activity to the existing business's TN account if it has one. The rate is 7% state plus up to 2.75% local. Sources disagree on whether an in-state seller uses its own local rate (origin) or the buyer's (destination). Let Stripe Tax calculate it, and confirm with the TN Department of Revenue.
- **Other states:** no obligation at this volume. Economic-nexus thresholds are commonly $100,000 of sales (some states also count 200 transactions) per state per year.
- **Shipping:** we charge free shipping, so the question of whether delivery charges are taxable does not come up.
- **Stripe Tax (optional, recommended):** turn on "Collect tax automatically" on the Payment Link. Add the Tennessee registration in Stripe Tax and set the product tax code to clothing. It costs 0.5% of the transaction in registered jurisdictions (about $0.50 per order at $99). The basic plan calculates and collects but does **not** register us or file returns. Without Stripe Tax, a single Payment Link can't charge TN buyers tax and others none.
- **Filing:** returns are due on the 20th of the month after the period. TN business tax: no return is needed under $100,000 gross receipts per jurisdiction. Counties still list a minimal-activity license for $3,000-$100,000, so check with the Davidson County Clerk.
- **TN sales-tax holiday:** clothing priced at $100 or less per item is exempt on the last weekend of July. Our $99 price qualifies.
- The tax Temu charges us at checkout is a cost (already in `economics.md`). We found no evidence that Temu accepts resale certificates.

Sources: [TaxJar: Tennessee](https://www.taxjar.com/sales-tax/tennessee), [Kintsugi: Tennessee 2026](https://trykintsugi.com/sales-tax-guides/usa/tennessee), [Sovos: TN economic nexus](https://sovos.com/blog/sut/important-details-on-the-tennessee-economic-nexus), [Stripe docs: tax on Payment Links](https://docs.stripe.com/tax/payment-links), [Stripe support: Stripe Tax pricing](https://support.stripe.com/questions/understanding-stripe-tax-pricing), [Stripe docs: Tennessee](https://edge-docs.stripe.com/tax/supported-countries/united-states/tennessee), [TN DOR: business tax law changes](https://www.tennessee.gov/content/dam/tn/revenue/documents/taxpayer_education/biztax/business_tax_law_changes.pdf), [Marcum: TN business tax threshold](https://marcumllp.com/insights/tennessee-taxpayers-beware-tennessees-tax-law-has-changed-filing-requirements-for-the-2023-business-tax).

---

## 9. The garment itself: labels and flammability (check on the sample)

- **Textile labeling (FTC Textile Act, 16 CFR 303):** the garment must carry a label with fiber content, country of origin and the maker's or marketer's identity (an RN number or name), plus a permanent care label under the Care Labeling Rule. The product page must state fiber content and "Imported" (or the true origin) clearly. If the sample has no compliant label, that is a problem for scaling: the seller can be liable for selling misbranded goods. [Cornell LII 16 CFR Part 303](https://www.law.cornell.edu/cfr/text/16/part-303), [Cornell LII §303.34](https://www.law.cornell.edu/cfr/text/16/303.34), [FTC complaint describing Textile Act duties](https://search.ftc.gov/system/files/ftc_gov/pdf/2523127americanalibertycomplaint.pdf).
- **Flammability (16 CFR 1610):** all adult clothing must meet it. Raised-pile fabrics like faux fur are the riskier kind. Testing exemptions cover plain-surface fabrics of 2.6 oz/yd² or more, and any fabric made entirely of acrylic, modacrylic, nylon, olefin, polyester or wool. A heavy cotton outer and a 100% polyester faux-fur lining would both fall inside the exemptions. A blended pile would not. The exemption is from testing, not from the standard. [CPSC: clothing flammability FAQ](https://www.cpsc.gov/FAQ/Clothing), [CPSC: adult apparel enforcement discretion](https://www.cpsc.gov/s3fs-public/StatementofPolicyEnforcmentDiscretionRegardingGeneralConformityAdultWearingApparelExemptfromTesting.pdf). **Never** claim "fire resistant" or "flame retardant".

---

## Banned phrases (automated check)

**How to run it:** use case-insensitive, whole-word or whole-phrase matching on all customer-facing text: site pages, product data, ad copy, captions, on-screen video text, email templates, image alt text and file names. Skip the fixed **Safety** block (section 5), which must contain "children", "infants" and "doctor", and the legal pages (terms, privacy). Internal docs like this one are not checked. A hit blocks publishing until a human rewrites it. In the list below, lines starting with `-- ` are section labels, not phrases (`#1` is a real entry).

```text
-- IP / competitor / supplier
eden
eden hoodie
free the sheep
freethesheep
mellow days
justin tubis
indio
indio cloak
arcane
arcane hoodie
sheep
the comfy
snuggie
oodie
gravity blanket
bearaby
covered in comfort
temu
aliexpress
cjdropshipping
dupe
knockoff
knock-off
replica
inspired by
same factory
same supplier
same maker
same manufacturer
-- health / medical / mental-health claims
anxiety
anxious
anti-anxiety
made for anxiety
stress relief
relieves stress
relieve stress
reduces stress
reduce stress
stress-relieving
relief
depression
depressed
panic attack
ptsd
adhd
autism
autistic
sensory processing
insomnia
sleep aid
sleep better
better sleep
fall asleep faster
improves sleep
improve sleep
treats
treating
treatment
to treat
therapy
therapeutic
therapist
clinically
clinical
proven
studies show
research shows
science-backed
backed by science
doctor recommended
doctor-recommended
psychologist
medical
medically
heal
healing
cure
cures
cortisol
serotonin
dopamine
melatonin
oxytocin
nervous system
deep pressure
mental health
mental illness
symptoms
disorder
health benefits
pain
safe for
-- Meta personal-attribute hooks (you + condition)
are you anxious
are you stressed
are you depressed
are you lonely
do you have anxiety
do you struggle
struggling with
suffer from
suffering from
your anxiety
your stress
your depression
your adhd
your insomnia
your mental health
your trauma
trauma
can't sleep
cant sleep
-- fake pricing / fake scarcity
compare at
compare-at
was $
originally
regular price
retail value
valued at
msrp
$199
199.99
% off
half off
half price
sale ends
limited time
today only
ends tonight
selling out
almost gone
low stock
last chance
-- fake social proof / absolute claims
as seen on
featured in
best-selling
bestselling
best seller
bestseller
#1
number one
no. 1
world's first
first-ever
first ever
the first weighted
4.94
798 reviews
thousands of happy
happy customers
loved by
5-star
five-star
viral
guarantee
guaranteed
-- children
kids
kid
children
child
toddler
baby
babies
infant
newborn
nursery
teen
teens
teenager
youth
boys
girls
little ones
school
-- shipping / origin misstatements
fast shipping
ships today
same-day
same day shipping
next-day
next day
2-day
two-day
overnight shipping
ships in 24 hours
prime
our warehouse
our factory
our studio
handmade
made in usa
made in the usa
-- unsubstantiated material / safety claims
hypoallergenic
non-toxic
nontoxic
organic
eco-friendly
sustainable
antibacterial
antimicrobial
fire resistant
fire-resistant
flame retardant
flame-retardant
lifetime warranty
-- before / after
before and after
before & after
before/after
```

**Gated claims.** These are not banned, but each may only render from the central product config, with its flag switched on after the sample confirms it. If the sample disagrees, switch the flag off and every page and ad loses the claim together.

| Config key | Phrases it controls | Turn on only when |
|---|---|---|
| `claims.weighted` | "weighted", "calming weight", "comforting weight", "gentle, even weight", "weighted hug", "heavy in the best way" | The sample has real added weight (record kitchen-scale weight; the cloak should be clearly heavier than an ordinary sherpa hoodie) |
| `claims.weight_lb` | "about {n} lb" | Use the measured weight, rounded down to the nearest 0.5 lb |
| `claims.lining` | "faux fur", "faux-fur", "sherpa", "plush lining" | The sample lining matches, and the fiber content is confirmed from the label |
| `claims.outer_fiber` | "100% cotton", "cotton outer" | The sewn-in label says so |
| `claims.care` | "machine washable", any wash instructions | The care label says so |
| `claims.ships_from_us` | "ships from the US", arrival windows of 11 business days or less | Supplier origin is a US warehouse (`listing.json` + sample postage) |
| `claims.sizes` | the size-by-height table | Built from the supplier size guide and checked against the sample. Adult sizes only |

**Watch list.** These are not auto-blocked; a human reviews them. "introvert" (third person only), "overthinking", "overwhelmed", "calm your mind", "wellness", "self-care", "breathable", "nap", "bedtime", "hush".

## Allowed comfort phrases

The weight-dependent ones need `claims.weighted` to be on. Everything else is always allowed.

- calming weight *(gated)*
- comforting weight *(gated)*
- feels like a hug
- a wearable hug
- a weighted hug *(gated)*
- a sense of security (wording NAD accepted for weighted blankets)
- a sense of comfort
- cozy
- snug
- cocooned
- wrapped up
- warm and heavy in the best way *(gated)*
- hood up, world out
- hunker down
- settle in
- stay in
- your quiet corner
- made for quiet nights in
- for homebodies and introverts
- unwind
- slow down
- relax
- me-time
- couch season
- reading-nook ready
- throw it on over anything
- one size, sized by height
- soft faux-fur lining *(gated)*

---

## Must-do before the first ad dollar

1. **Sample gate:** weigh it, read the fiber/origin/care label, photograph the packaging and any price slip, and record the order → ship → delivery dates. Turn each gated claim on or off in the central config.
2. **Supplier origin:** confirm a US warehouse (`listing.json` + sample postage). If it ships from China, run no paid ads (`economics.md` §7).
3. **Backup supplier:** find the same item on AliExpress (US warehouse) or CJ (US stock), and place one blind-ship test order before scaling past the Temu test.
4. **Temu test limits:** no more than 20 orders, on an expendable account. No VA logs in. Stop at the first Temu warning or cancellation.
5. **Photos:** use only our own sample photos/video, or supplier photos that pass all three tests in section 7. Log the source of every image.
6. **Copy:** run the banned-phrase check on every page, ad, caption, email and alt text. Never mention children. Never use before/after framing.
7. **Price:** $99 flat. No compare-at, "was", "% off" or "MSRP". Log every price change with its date.
8. **Reviews:** none shown until real reviews of our store exist. No AI testimonials. No incentives during the test. Friends and family must disclose.
9. **Delivery promise** from config only, with +2 business days of padding. Keep the evidence of how it was set.
10. **Delay notice** (section 2) is automated to fire **before** the ship-by date. Refunds go out within 1 business day (legal maximum: 7 working days).
11. **Safety block** (section 5) appears on the product page and in the order-confirmation email.
12. **Page requirements** (TikTok and good practice): contact email, business name and address (159 4th Ave N, Ste 100 #2179, Nashville, TN 37219), shipping policy with real windows, return/refund policy, terms, privacy policy (saying we share shipping details with fulfillment partners), USD prices, fiber content and "Imported".
13. **Stripe:** Cody decides between a separate account for the brand (recommended) and reusing the existing one. Set the descriptor (`HUNKERHOOD.COM` / `HUNKERHOOD`, or the `HUNKERHOOD` suffix if reusing). Collect the shipping address. Require terms consent. Use the submit-button text with the delivery window and descriptor. Radar on. Receipts on.
14. **Order emails:** confirmation (with the descriptor, dates and safety block), shipped (with tracking and the partner-packaging note), delay option, and delivered check-in.
15. **Dispute file per order:** payment, supplier order, tracking with delivery to the full address, emails, and a page snapshot.
16. **Sales tax:** TN registration in place, and Stripe Tax on with TN registered (or a deliberate decision not to).
17. **Ads:** adults 18+ only. No "you + condition" hooks, no health claims, no absolutes. Watch Meta's customer feedback score weekly.
18. **Owner decisions already pending in `economics.md`** (25-organic-orders rule, the Stripe account, the $840 cap) are made in writing before launch.

## Blockers (anything here can stop the plan)

1. **Temu terms forbid ordering on behalf of customers (§3.1).** This does not legally stop a small test, but Temu can close the account or cancel orders at any time, and orange Temu packaging cannot be removed. **Not a viable channel for scaling.** The plan needs AliExpress (US warehouse) or CJ (US stock) to carry the same item before any scale-up.
2. **No usable product imagery yet.** Supplier photos are presumed to be Free the Sheep's, and AI generation is unavailable. **Nothing can launch until the sample arrives and is photographed and filmed**, or a supplier proves it owns its photos.
3. **Weight and material are unverified.** If the sample is not meaningfully weighted, the product is just a sherpa cloak. The "weighted hug" positioning, the $99 price and the ad angles all fall away. Re-run `economics.md` before launching an unweighted version.
4. **China-direct shipping.** If the item ships from China, the honest promise is 10-22 business days. That breaks the house US-warehouse rule and raises Mail Order Rule, Meta feedback-score and Stripe reserve risk together. **No paid ads** in that case.
5. **Stripe account choice.** Reusing the existing account shows another business's name at checkout and on statements (dispute risk), puts the existing business at risk of reserves, and conflicts with the house "25 organic orders before ads" rule. The test should not start until Cody either creates a separate Stripe account for the brand or waives the rule in writing and confirms the descriptor suffix works on Payment Links.
6. **Missing garment label (possible).** If the sample has no fiber/origin/maker/care label, we are selling a misbranded textile product. That is tolerable for a 20-order test only with the facts stated on the page, and it blocks scaling until a supplier with proper labels is found.
7. **Child sizes on the supplier listing (possible).** If the only sizes that fit the product shots are children's, that variant cannot be sold.

---

## Sources (all)

**Suppliers:** [Temu US Terms of Use](https://www.temu.com/terms-of-use.html) · [Temu US terms (bgp)](https://www.temu.com/bgp_terms_policy.html) · [Temu UK terms](https://temu.com/uk/terms-of-use.html) · [Branvas: Temu dropshipping risks 2026](https://branvas.com/blogs/news/temu-dropshipping-risks-alternatives) · [TrueProfit](https://trueprofit.io/blog/temu-dropshipping) · [USAdrop](https://usadrop.com/?p=23715) · [WorldFirst](https://worldfirst.com/uk/marketplace-sellers/e-commerce-guides/temu-dropshipping) · [dodropshipping: Temu with Shopify](https://dodropshipping.com/temu-dropshipping-with-shopify/) · [Quora: Temu support link](https://www.quora.com/Can-you-use-Temu-temu-com-for-drop-shipping) · [AliDrop: AliExpress Dropshipping Center](https://www.alidrop.co/blogs/aliexpress-dropshipping-center) · [Modalyst](https://support.modalyst.co/en/articles/3974717-is-modalyst-an-official-partner-of-aliexpress-com) · [DSers (Wix)](https://wix.com/app-market/web-solution/dsers-aliexpress-dropshipping) · [Wise](https://wise.com/sg/blog/aliexpress-dropshipping) · [dodropshipping: informing AliExpress suppliers](https://dodropshipping.com/should-you-inform-aliexpress-suppliers-before-dropshipping/) · [CJ support](https://support.cjdropshipping.cn/?p=844) · [easync CJ review](https://easync.io/articles/cj-dropshipping-review/) · [Spocket CJ overview](https://www.spocket.co/blogs/cjdropshipping-overview) · [hustlegotreal CJ review](https://hustlegotreal.com/?p=5107) · [Dropified US suppliers](https://www.dropified.com/?p=15570)

**FTC Mail Order Rule:** [FTC business guide](https://ftc.gov/business-guidance/resources/business-guide-ftcs-mail-internet-or-telephone-order-merchandise-rule) · [eCFR Part 435](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-435) · [Cornell §435.2](https://www.law.cornell.edu/cfr/text/16/435.2) · [GovInfo PDF](https://www.govinfo.gov/content/pkg/CFR-2024-title16-vol1/pdf/CFR-2024-title16-vol1-part435.pdf) · [Federal Register 2014](https://www.federalregister.gov/documents/2014/09/17/2014-22092/mail-or-telephone-order-merchandise-rule) · [Loeb & Loeb](https://www.loeb.com/en/insights/publications/2014/10/ftc-updates-its-mail-order-rule) · [Arent Fox](https://www.afslaw.com/perspectives/the-fine-print/mailin-it-the-ftc-gives-the-mail-order-rule-makeover)

**Ads:** [Meta personal attributes](https://transparency.meta.com/policies/ad-standards/objectionable-content/privacy-violations-personal-attributes/) · [Meta Advertising Standards](https://transparency.meta.com/policies/ad-standards/) · [Meta unacceptable business practices](https://transparency.meta.com/policies/ad-standards/fraud-scams/unacceptable-business-practices/) · [Meta health and wellness](https://transparency.meta.com/policies/ad-standards/restricted-goods-services/health-wellness) · [Conduct Atlas diff](https://conductatlas.com/diff/meta-ads/meta-advertising-policies/2204/5215/) · [Adligator](https://adligator.com/blog/meta-health-wellness-ad-policy-update-2026) · [Stackmatix](https://www.stackmatix.com/blog/meta-ads-personal-attributes-policy) · [LeadSync](https://leadsync.me/blog/meta-privacy-violations-and-personal-attributes-advertising-policy/) · [Meta newsroom: customer feedback](https://about.fb.com/news/2018/06/improving-customer-service/) · [CJ blog: feedback score](https://blog.cjdropshipping.cn/detail/1418486260478390274) · [Bïrch](https://bir.ch/blog/facebook-feedback-score) · [TikTok misleading content](https://ads.tiktok.com/help/article/tiktok-ads-policy-misleading-and-false-content) · [TikTok SMB policy PDF](https://ads.tiktok.com/business/library/TikTok_Ad_Policy_SMB2024.pdf) · [TikTok healthcare](https://ads.tiktok.com/help/article/tiktok-ads-policy-healthcare-pharmaceuticals) · [TikTok ad format and functionality](https://ads.tiktok.com/help/article/tiktok-ads-policy-ad-format-and-functionality) · [TikTok landing page checklist](https://ads.tiktok.com/help/article/ad-review-checklist-landing-page)

**Health claims:** [BBB National Programs: Weighting Comforts](https://bbbprograms.org/media/newsroom/decisions/following-nad-inquiry-weighting-comforts-to-modify-discontinue-certain-performance-claims-for-its-we) · [Manatt](https://www.manatt.com/insights/newsletters/advertising-law/nad-throws-wet-blanket-on-weighted-blanket-claims) · [Scientific American: Gravity Blanket](https://www.scientificamerican.com/article/makers-of-crowdfunded-gravity-blanket-withdraw-unsupported-medical-claims-after-raising-3-million/) · [Consumer Reports: Gravity Blanket](https://www.consumerreports.org/consumerist/after-raising-3m-on-kickstarter-gravity-blanket-stops-claiming-to-treat-anxiety/) · [Covington: FTC health guidance](https://www.cov.com/en/news-and-insights/insights/2023/01/ftc-issues-new-guidance-on-health-related-claims-to-replace-the-dietary-supplements-advertising-guide) · [Jones Day](https://m.jonesday.com/en/insights/2023/01/ftc-overhauls-and-expands-25yearold-health-products-advertising-compliance-guide)

**Reviews and pricing:** [FTC final rule text](https://www.ftc.gov/system/files/ftc_gov/pdf/r311003consumerreviewstestimonialsfinalrulefrn.pdf) · [FTC warning template 2025](https://search.ftc.gov/system/files/ftc_gov/pdf/2025-Fake-Review-Warning-Template.pdf) · [Benesch](https://www.beneschlaw.com/insight/five-stars-zero-tolerance-ftc-turns-up-enforcement-under-consumer-review-rule/pdf/) · [Venable](https://www.venable.com/insights/publications/2025/12/ftc-signals-heightened-enforcement-of-new) · [Goodwin](https://www.goodwinlaw.com/en/insights/publications/2024/09/alerts-practices-cldr-ftc-finalizes-rule-on-consumer-reviews) · [BCLP insider reviews](https://www.bclplaw.com/en-US/events-insights-news/part-4-what-the-ftcs-final-rule-means-for-insider-reviews.html) · [Fortune: Bountiful](https://fortune.com/2023/04/11/ftc-amazon-bountiful-review-hijacking) · [eCFR Part 233](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-233) · [Cornell §233.1](https://www.law.cornell.edu/cfr/text/16/233.1) · [Cornell Part 233](https://www.law.cornell.edu/cfr/text/16/part-233) · [K&L Gates](https://www.klgates.com/Dont-Let-Strike-Through-Pricing-Strike-Out-Your-DTC-Website-Comparison-Pricing-Is-Effective-but-Carries-Risk-4-29-2025) · [Manatt: §17501](https://www.manatt.com/insights/newsletters/advertising-law/california-appellate-panel-upholds-validity-of-pri)

**Children and weighted products:** [CPSC Trumka statement](https://www.cpsc.gov/s3fs-public/Trumka-Statement-on-Weighted-Infant-Blankets-4-15-24.pdf?VersionId=DKKBE2QXMxcKzfM2AqlXchE0fctDsNCa) · [CBS News](https://www.cbsnews.com/news/safety-concerns-arise-over-weighted-baby-sleeping-products-after-cpsc-warning/) · [Consumer Reports advocacy](https://advocacy.consumerreports.org/press_release/consumer-reports-supports-new-bill-in-congress-to-ban-weighted-infant-sleep-products) · [Consumer Federation of America](https://consumerfed.org/press_release/congress-introduces-bills-to-protect-infants-from-hazardous-weighted-sleep-products/) · [NPR](https://www.npr.org/2024/08/06/nx-s1-5065485/) · [Kherkher Garcia: Pillowfort](https://www.kherkhergarcia.com/two-deaths-pillowfort-weighted-blankets/) · [Business Insider: Pillowfort](https://www.businessinsider.nl/2-young-girls-died-from-suffocation-inside-a-weighted-blanket-from-target-prompting-the-store-to-recall-200000-products/) · [Somerset NHS](https://www.somersetft.nhs.uk/children-and-young-peoples-therapy-service/guidance-on-the-use-of-weighted-blankets/)

**Stripe:** [Restricted businesses](https://stripe.com/legal/restricted-businesses) · [Restricted FAQ](https://support.stripe.com/questions/restricted-business-list-faqs) · [Stripe blog](https://stripe.com/blog/why-some-businesses-arent-allowed) · [Reserves FAQ](https://support.stripe.com/questions/reserved-funds) · [Reserves topic](https://support.stripe.com/topics/reserves) · [Statement descriptors (docs)](https://docs.stripe.com/get-started/account/statement-descriptors) · [Statement descriptor requirements](https://support.stripe.com/questions/statement-descriptor-information) · [Checkout custom text](https://edge-docs.stripe.com/payments/checkout/customization/policies) · [Dispute best practices](https://docs.stripe.com/disputes/best-practices) · [Product-not-received evidence](https://stripe.com/blog/analyzing-the-evidence-that-helps-businesses-win-product-not-received-disputes) · [How to handle disputes](https://support.stripe.com/questions/how-to-handle-disputes)

**IP:** [Justia: FREE THE SHEEP, MELLOW DAYS](https://trademarks.justia.com/974/51/free-the-sheep-mellow-97451254.html) · [Justia: THE COMFY](https://trademark.justia.com/985/32/the-98532270.html) · [Schwabe: Top Brand v. Cozy Comfort](https://www.schwabe.com/publication/latest-federal-court-cases-top-brand-llc-v-cozy-comfort-company-llc/) · [Revision Legal](https://revisionlegal.com/internet-law/drop-shipping-what-to-know-before-you-sell-online/) · [Sourcinbox](https://www.sourcinbox.com/blog/how-to-avoid-copyright-infringement-when-dropshipping) · [lawyerinfo.ca](https://lawyerinfo.ca/guides/money-taxes-ip/intellectual-property/intellectual-property-risks-for-canadian-dropshippers/)

**Tax:** [TaxJar TN](https://www.taxjar.com/sales-tax/tennessee) · [Kintsugi TN](https://trykintsugi.com/sales-tax-guides/usa/tennessee) · [Sovos TN](https://sovos.com/blog/sut/important-details-on-the-tennessee-economic-nexus) · [Stripe Tax on Payment Links](https://docs.stripe.com/tax/payment-links) · [Stripe Tax pricing](https://support.stripe.com/questions/understanding-stripe-tax-pricing) · [Stripe Tax Tennessee](https://edge-docs.stripe.com/tax/supported-countries/united-states/tennessee) · [TN DOR business tax changes](https://www.tennessee.gov/content/dam/tn/revenue/documents/taxpayer_education/biztax/business_tax_law_changes.pdf) · [Marcum](https://marcumllp.com/insights/tennessee-taxpayers-beware-tennessees-tax-law-has-changed-filing-requirements-for-the-2023-business-tax)

**Garment rules:** [Cornell 16 CFR 303](https://www.law.cornell.edu/cfr/text/16/part-303) · [Cornell §303.34](https://www.law.cornell.edu/cfr/text/16/303.34) · [FTC Textile Act complaint](https://search.ftc.gov/system/files/ftc_gov/pdf/2523127americanalibertycomplaint.pdf) · [CPSC clothing FAQ](https://www.cpsc.gov/FAQ/Clothing) · [CPSC adult apparel policy](https://www.cpsc.gov/s3fs-public/StatementofPolicyEnforcmentDiscretionRegardingGeneralConformityAdultWearingApparelExemptfromTesting.pdf)
