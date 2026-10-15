# Launch plan: Meta paid test and TikTok organic

Written 2026-10-15 for Cody. The Meta test spends **$840 over 14 days** in two phases of $420, on one ABO campaign with three ad sets of $20 a day, each testing one angle with two or three creatives. The TikTok plan costs $0 and can start as soon as the product page is live. Budget, breakeven and kill numbers come from `../economics.md`; claim rules from `../compliance.md`; UTMs from `../../05-marketing/tracking-and-utm-conventions.md`. Tokens and gates: `README.md`.

## The test in one table

| Item | Value | Source |
|---|---|---|
| Price | {{PRICE}} ($99), free US shipping, no compare-at price | economics §1 |
| Spend | $840 total: Phase 1 $420 (days 1-7), Phase 2 $420 (days 8-14) | economics §8 |
| Daily | $60: three ad sets at $20 each | economics §8 |
| Breakeven CPA (B) | $43.59 at $40 landed (ROAS 2.27) | economics §3 |
| Target CPA (T) | $33.53 at $40 landed (ROAS 2.95) | economics §3 |
| Ad set kill with 0 purchases | $65.38 (1.5 × B) | economics §8 |
| Campaign stop-loss | $300 spent with 2 or fewer purchases: all ads off | economics §8 |
| Cumulative stop-loss | At any time (Phase 1, Phase 2 or a re-test): spend − (orders × B) reaches $300 → all ads off | economics §8 |
| Expected result at the base case | about 18 orders and about a $55 loss; the test buys data | economics §5, §8 |
| Order goal | 10-20 orders; **never more than 20 through the Temu account** | compliance §1 |

If the confirmed landed cost is not $40, take every column-dependent figure (B, 1.5 × B, 3 × B, T, 2 × T, the Phase 1 gate purchase count and the breakeven order count) from the table in `../economics.md` §9 step 3, and rewrite them in the table above, §5, §7, §10 and the §13 rows before Day 1.

---

## 1. Go / no-go: every box ticked before the first dollar

| # | Gate | Owner | Done |
|---|---|---|---|
| 1 | Sample gate done (`compliance.md`, must-do 1): weighed, labels read, packaging photographed, order/ship/delivery dates and origin recorded. Claim flags set in the central config | Cody | |
| 2 | `claims.ships_from_us` is **on**: US "Local" origin confirmed in `listing.json` and on the sample's postage. **If it is off, stop here: no paid ads** | Cody | |
| 3 | Landed cost confirmed; `economics.csv` row chosen; §7 dollar figures updated. If landed is above $45, stop and re-price | Cody + agent | |
| 4 | Owner decisions made **in writing**: (a) waive the "25 organic orders before ads" rule for this capped test, or wait for organic orders; (b) separate Stripe account for the brand (recommended) or reuse the existing one with the `HUNKERHOOD` suffix verified on Payment Links; (c) the $840 cap approved | Cody | |
| 5 | Real creative ready: V1, V2, V3, V5 and S1, S2, S3, S6 at minimum, all from the sample, all in `asset-log.csv`, and `check_copy.py` shows 0 errors | Cody | |
| 6 | Product page live on the domain and checked on a phone: price from config, delivery promise from config, Safety block, fiber content and "Imported", contact email, business name and address, shipping policy with real windows, refund policy, terms, privacy policy (says shipping details go to fulfillment partners), USD prices | agent + Cody | |
| 7 | Stripe Payment Link: {{PRICE}}, US shipping address and phone collected, terms consent required, submit-button text with the delivery window and the statement descriptor, Radar on, receipts on, Stripe Tax decision made with TN registration in place | Cody | |
| 8 | Order emails live: confirmation (with descriptor, calendar dates and Safety block), shipped (with the partner-packaging note), delay-option notice set to fire if there is no tracking by the end of business day 3, delivered check-in | agent + Cody | |
| 9 | Meta pixel verified in Events Manager → Test events: PageView, ViewContent, InitiateCheckout, Purchase (value 99.00, USD, one per Stripe session). Domain verified | Cody | |
| 10 | Backup supplier found (same item, AliExpress with US warehouse or CJ US stock), and its blind-ship test order placed | Cody | |
| 11 | Temu test rules accepted: expendable account with no stored credit, 20 customer orders at most, no VA logs in, stop at the first warning or cancellation | Cody | |
| 12 | Dispute file template ready: Stripe payment, supplier order confirmation, tracking with delivery to the full address, every email, page snapshot at order time | agent | |
| 13 | All ads approved by Meta at least 24 hours before Day 1 | Cody | |
| 14 | About $1,300 available: $840 ads plus a float for paying the supplier before Stripe pays out | Cody | |

---

## 2. One-time setup in Meta

1. **Page and Instagram.** A Facebook Page named {{BRAND}} and the {{HANDLE}} Instagram account, linked in Meta Business Suite. Ads run from these, so viewers see the brand, not a person.
2. **Ad account.** Currency USD, time zone America/Chicago (Nashville). Add the payment method.
3. **Hard caps that Meta enforces for us.**
   - Account spending limit: **$840** (Billing and payments → Payment settings → Account spending limit).
   - Campaign spending limit: **$420** for Phase 1. Raise it to $840 only after the Phase 1 gate in §5 passes. A re-test after the $300 stop-loss runs in a new campaign with its own **$150** limit (§7).
4. **Pixel and events** (the site config holds the pixel ID; the store build injects it):
   - PageView on every page; ViewContent on the product page.
   - InitiateCheckout when the Buy button is tapped, just before the redirect to Stripe.
   - Purchase on the success page Stripe redirects to, with value 99.00 and currency USD, and the Stripe Checkout Session ID as the event ID so a refresh does not count twice.
   - Conversions API is not needed at this spend (house rule in `ads-system.md`: server-side from about $1-2k a month).
5. **Domain verification:** Business settings → Brand safety → Domains → add {{DOMAIN}} and verify it.
6. **Page moderation:** turn on the profanity filter and add a keyword block list for spam links. Do not block words people use to complain; complaints get answered (§9).
7. **Know where the customer feedback score lives** (Meta Business Suite, Page or Account Quality → customer feedback). It is checked weekly.

---

## 3. Campaign structure

**ABO, not CBO, and why.** At $60 a day across three angles, a CBO campaign (Meta now calls it "Advantage campaign budget") moves most of the money into whichever ad set gets cheap clicks in the first day or two, long before any of them has a purchase. Two of the three angles would get almost nothing, and we would finish the test without a fair read on them. ABO fixes each angle at $20 a day, so after seven days each has had about $140, which is enough to apply the same kill rules (§7) to all three. This matches the house testing framework in `ads-system.md`: test in ABO, scale winners in CBO.

**Not an Advantage+ sales campaign either:** it cannot hold three angles at fixed budgets, and its creative enhancements can rewrite text and change backgrounds outside our copy check.

| Level | Name | Settings |
|---|---|---|
| Campaign | `HC-T1 Sales ABO US18+` | Objective: Sales. Conversion location: Website. Advantage campaign budget: **off**. Campaign spending limit: $420 (Phase 1) |
| Ad set A | `HC-T1 A-demo` | $20/day. Angle 1, the hoodie that hugs back |
| Ad set B | `HC-T1 B-homebody` | $20/day. Angle 3, hood up, world out (plus angle 5 as the second creative) |
| Ad set C | `HC-T1 C-gift` | $20/day. Angle 2, gift for the person who's always cold |

**Every ad set:**
- Performance goal: maximise number of conversions. Conversion event: Purchase. Attribution: 7-day click, 1-day view (the default).
- Location: United States, people living in. Exclude Alaska and Hawaii unless the config's delivery windows are confirmed to hold there.
- **Age: 18 minimum, set as a hard audience control.** No upper limit. All genders. English.
- Targeting: broad. No interests, no lookalikes. If Advantage+ audience is used, it must keep the 18 minimum control and get no suggestions.
- Placements: Advantage+ placements, with 9:16 and 4:5 versions of every creative uploaded so each placement shows the right crop.
- No edits for 72 hours after launch, except the kill rules.

**Every ad:**
- Identity: the {{BRAND}} Page and Instagram account.
- Primary text: the **short** version in Phase 1. Headline, description and CTA as in `static-ads.md` and `video-scripts.md`.
- **Turn off every Advantage+ creative enhancement:** text improvements and text variations, visual touch-ups, image expansion, generated backgrounds, adding music, adding overlays, relevant comments, CTA enhancements, site links, translations. They can add words or change how the cloak looks, and none of that would have passed the copy check or the sample check.
- Multi-advertiser ads: off.

**Creatives per ad set** (two or three live, the rest in reserve to swap in when one is killed):

| Ad set | Live in Phase 1 | Reserve (swap in, in this order) |
|---|---|---|
| A-demo | vid-hc01, img-hc01, img-hc06 (carousel) | vid-hc01 with the "The hoodie that hugs back." opening (vid-hc01b) |
| B-homebody | vid-hc02, vid-hc05, img-hc03 | vid-hc02b, vid-hc02c, img-hc04, img-hc08 |
| C-gift | vid-hc03, img-hc02 | vid-hc04, img-hc05 |

**If `claims.weighted` is off:** ad set A runs the fallback copy for vid-hc01 and img-hc01, and img-hc06 runs without card 4. Re-run `economics.md` before launching an unweighted product at all.

---

## 4. Ad names and UTMs

Convention (`tracking-and-utm-conventions.md`): `?utm_source={platform}&utm_medium={type}&utm_campaign={model}-{niche}&utm_content={asset-id}`.

- `utm_campaign` is **`dropship-hoodedcloak`** for everything about this product. The slug names the product, not the brand, so it survives a rename, and it never puts "weighted" in a URL in case that claim is switched off.
- `utm_content` is the asset ID. Suffix `-l` when the same asset runs with the long primary text, and `-fb` when it runs with the fallback copy.
- Ad name = asset ID + a short label + copy length, so a report row reads on its own.

Destination: the product page on {{DOMAIN}}. Put the string in Meta's **URL parameters** field, not in the website URL, so it is easy to audit.

| Ad set | Ad name | URL parameters |
|---|---|---|
| A | `vid-hc01 blanket-hoodie s` | `utm_source=meta&utm_medium=paid&utm_campaign=dropship-hoodedcloak&utm_content=vid-hc01` |
| A | `img-hc01 hugs-back s` | `utm_source=meta&utm_medium=paid&utm_campaign=dropship-hoodedcloak&utm_content=img-hc01` |
| A | `img-hc06 details carousel s` | `utm_source=meta&utm_medium=paid&utm_campaign=dropship-hoodedcloak&utm_content=img-hc06` |
| B | `vid-hc02 social-battery s` | `utm_source=meta&utm_medium=paid&utm_campaign=dropship-hoodedcloak&utm_content=vid-hc02` |
| B | `vid-hc05 couch-season s` | `utm_source=meta&utm_medium=paid&utm_campaign=dropship-hoodedcloak&utm_content=vid-hc05` |
| B | `img-hc03 hood-up s` | `utm_source=meta&utm_medium=paid&utm_campaign=dropship-hoodedcloak&utm_content=img-hc03` |
| C | `vid-hc03 blanket-thief s` | `utm_source=meta&utm_medium=paid&utm_campaign=dropship-hoodedcloak&utm_content=vid-hc03` |
| C | `img-hc02 always-cold s` | `utm_source=meta&utm_medium=paid&utm_campaign=dropship-hoodedcloak&utm_content=img-hc02` |
| C reserve | `vid-hc04 thermostat s` | `utm_source=meta&utm_medium=paid&utm_campaign=dropship-hoodedcloak&utm_content=vid-hc04` |

Organic links use the same campaign slug:

| Where | URL parameters |
|---|---|
| TikTok bio | `utm_source=tiktok&utm_medium=organic&utm_campaign=dropship-hoodedcloak&utm_content=bio` |
| Instagram bio | `utm_source=meta&utm_medium=organic&utm_campaign=dropship-hoodedcloak&utm_content=ig-bio` |
| Facebook Page button | `utm_source=meta&utm_medium=organic&utm_campaign=dropship-hoodedcloak&utm_content=fb-page` |
| Order and check-in emails | `utm_source=email&utm_medium=email&utm_campaign=dropship-hoodedcloak&utm_content={email-id}` |

---

## 5. Phases and calendar

**Phase 1, days 1-7 ($420).** All three ad sets at $20 a day. Kill rules only.

**Gate to Phase 2** (economics §8): blended CPA on actual spend at or below $65.38 (on the full $420, at least 7 purchases) **and** at least one ad set at or below $43.59. If the gate fails, Phase 2 does not run; see §10.

**Phase 2, days 8-14 ($420).** About $60 a day across the ad sets that survived, plus fresh creatives built from the winning hook:

| Winning angle | Add in Phase 2 |
|---|---|
| A, demo | vid-hc01b (new opening line), img-hc06 with long text (`-l`), V1 re-cut at 9 s |
| B, homebody | vid-hc02b and vid-hc02c (alternative openings), img-hc04, img-hc08 |
| C, gift | vid-hc04, img-hc05, img-hc02 with long text (`-l`) until Thu 3 Dec |
| Any | the best-performing TikTok hook (§12), re-cut for Meta |

Duplicate the best ad with the long primary text as its own ad (`-l`) to test long against short on the same asset.

**Dates that matter:**

| Date | What happens |
|---|---|
| Day 1 | The first weekday after every gate in §1 is ticked |
| Example: Mon 2 Nov | Phase 1 runs Mon 2 to Sun 8 Nov, review Mon 9 Nov; Phase 2 runs Mon 9 to Sun 15 Nov, final review Mon 16 Nov |
| After about Mon 16 Nov | If the gates clear this late, run Phase 1 only, then decide whether to wait for the late-December drop in ad prices (economics §8) |
| Mon 23 to Mon 30 Nov | Black Friday week (Black Friday is Fri 27 Nov). No new tests and no new ad sets; winners keep running |
| End of Thu 3 Dec | All Christmas wording stops: the V3 Christmas end card and the S2 Christmas long text come down. Ad set C switches to the evergreen versions or pauses |
| Fri 4 Dec | Last order date for Christmas delivery (`delivery.xmas_last_order` in config, Local listing only) |
| Sat 26 Dec to mid Jan | Ad prices fall after Christmas. Angles 1, 3, 4 and 6 suit January |

---

## 6. Daily check (about 15 minutes, same time each morning)

Log one row per live ad in `meta-daily-log.csv`.

| # | Check | Where | If it trips |
|---|---|---|---|
| 1 | Spend today and to date, against the campaign and account limits | Ads Manager | Never raise a limit without written approval |
| 2 | Each ad: spend, link CTR, CPC, adds to cart, purchases | Ads Manager | Ad-level kill rules (§7) |
| 3 | Each ad set: spend, purchases, CPA | Ads Manager | Ad set kill and scale rules (§7) |
| 4 | Campaign: total spend against purchases | Ads Manager | Stop-loss: $300 with 2 or fewer purchases → all ads off. Cumulative: spend − (orders × B) at $300 or more → all ads off |
| 5 | New orders; Meta purchases reconciled against Stripe | Stripe | If Meta shows more purchases than Stripe, use Stripe's count for the stop-loss |
| 6 | Any dispute or early fraud warning | Stripe | **Stop all ads** (§8) |
| 7 | Every paid order placed with the supplier the same business day; confirmation saved to the dispute file; running count of supplier orders | Supplier account, dispute files | At 20 orders, stop for the mandatory review |
| 8 | Any order with no tracking by the end of business day 3 | Order sheet | Send the delay-option notice today (compliance §2) |
| 9 | Customer emails and DMs answered (under 24 hours, aim for 4) | Inbox | Reply from `customer-service-sop.md` templates; for delays use `../copy/emails.md` 3a-3d only |
| 10 | Ad comments answered or moderated | Business Suite | §9 |
| 11 | Ad review status | Ads Manager | §11 |
| 12 | Frequency above 2.5 on an ad set while CTR falls | Ads Manager | Note it; swap in a reserve creative at the next allowed edit |

**Weekly (Mondays):** customer feedback score; refund rate against the 20% tripwire; number of orders delivered late; supplier account status; price log; `../../07-automation/tracker/experiments.csv` rows updated; landed cost still in the same column.

---

## 7. Kill and scale rules

B = breakeven CPA, T = target CPA, from the landed-cost column (economics §4). Dollar figures are for {{PRICE}} at $40 landed. Never kill a profitable but noisy ad set on one day's numbers at one or two sales a day.

| Level | Rule | $ at $99 / $40 landed |
|---|---|---:|
| Ad | After $15 spent (about 1,000 impressions), link CTR below 0.8% → off | $15.00 |
| Ad | Spend at or above 1.0 × B with 0 adds to cart → off | $43.59 |
| **Ad set** | **Spend at or above 1.5 × B with 0 purchases → off** | **$65.38** |
| Ad set | Spend at or above 3 × B with fewer than 3 purchases → off | $130.77 |
| Ad set | 7-day CPA at or above 2 × T → off (house rule in `ads-system.md`; it still applies once an ad set has 3 or more purchases) | $67.06 |
| Ad set | CPA between T and B → leave it alone; judge weekly | $33.53-43.59 |
| **Scale** | At least 3 purchases and CPA at or below T over the last 7 days (house rule) → budget +20%, no more than once every 48-72 hours | ≤ $33.53 |
| Page | 300+ link clicks, CTR at least 1.2%, click-to-purchase below 1% → pause and fix the page, not the ads (price display, delivery promise, photos, refund line) | |
| Checkout | Add-to-cart rate at least 8% but under 30% of carts reach payment → fix checkout friction (surprise tax, the handoff to Stripe) | |
| **Campaign** | Total spend reaches $300 with 2 or fewer purchases → **all ads off.** Rebuild the offer or creative. Any re-test runs in a new campaign with a $150 campaign spending limit and comes out of Phase 2's $420 (the account limit stays $840) | $300 |
| **Cumulative** | At any time, including Phase 2 and any re-test: spend − (orders × B) reaches $300 → **all ads off.** This caps the whole test at about a $300 loss (economics §8) | $300 net loss |
| Hard cap | Total spend never passes $840 without new written approval (the account spending limit enforces it) | $840 |

When an ad is killed, swap in the next reserve creative for that ad set (§3) at the next allowed edit, so each ad set keeps two or three live ads.

---

## 8. Ops tripwires: stop all ads at once, whatever the CPA

- Any chargeback.
- Two or more orders delivered after the promised date.
- Refunds above 20% of delivered orders.
- Any warning, flag or cancellation wave from the supplier account.
- The sample or the first orders show weight or material different from the page. Switch the claim off in config first, then stop.
- `claims.ships_from_us` switched off for any reason.
- 20 supplier orders reached: mandatory review of delivery times, refunds and reviews before any more (and move to the backup supplier before scaling).
- The customer feedback score drops into the warning range. Third-party guides say below 2 cuts delivery; Meta has not published the number, so treat any warning as a stop.

---

## 9. Comments and DMs on ads

Answer within 24 hours, using only facts that are in the config. Never delete or hide honest criticism; hide only spam, scams, hate, and posts with someone's personal details. Move anything about an order to email. Never name the supplier, never argue, never guess a weight or a material.

| Question | Reply | Requires |
|---|---|---|
| How heavy is it? | About {{WEIGHT_LB}} lb, weighed on our own sample. | claims.weighted, claims.weight_lb |
| What's it made of? | {{OUTER_FIBER}} outside, {{LINING_DESC}} lining inside. The full details are on the product page. | claims.outer_fiber, claims.lining |
| Can it go in the washing machine? | {{CARE_LINE}} | claims.care |
| How long does delivery take? | It ships in {{SHIP_WINDOW}} and arrives {{ARRIVAL_WINDOW}} after you order, with tracking. Shipping is free in the US. | claims.ships_from_us |
| Will it fit me? / I'm tall | It's sized by height, from {{HEIGHT_MIN}} to {{HEIGHT_MAX}}. Tell us your height and we'll help you pick, or check the size chart on the product page. | claims.sizes |
| Do you ship outside the US? | Right now we ship to the contiguous US only. | none |
| Is this the same as another brand's? | We can't speak for other brands' products. Ours is a roomy hooded cloak, and the product page lists exactly what it's made of. | none |
| I saw this cheaper somewhere else | Thanks for asking. Like most small shops, we work with a manufacturing partner and a fulfillment partner. What you get from us: an honest delivery date, free US shipping, and help at {{SUPPORT_EMAIL}} within one business day. {{REFUND_LINE}} | none |
| Is this legit? | Fair question. We're {{BUSINESS_NAME}}, {{BUSINESS_ADDRESS}}. Every order gets tracking, and we answer at {{SUPPORT_EMAIL}} within one business day. | none |
| Does it help with (a health condition)? | We don't make health claims about it. It's a cozy hooded cloak that feels like a hug, and that's what we sell. | none |
| Where's my order? | Sorry about the wait. Please email {{SUPPORT_EMAIL}} with your order number and we'll check it today. | none |

**Can a child wear it?** Reply with the fixed Safety block lines, word for word:

```safety
Adult garment. Not for children.
Never use on or around babies or children under 3. Weighted products are not safe for infants.
```

---

## 10. After day 14 (or after a failed Phase 1 gate)

| Result | Decision |
|---|---|
| Total CPA at or below B (20+ orders on $840; in practice, the 20-order supplier cap reached on $840 or less) | Profitable. 19 orders on $840 is a loss (CPA $44.21). Scale by the house rules: +20% no more than every 48-72 hours; move winners into a CBO campaign (about 60-70% of budget to proven ads, 30-40% to new tests). Test the 2-pack at $179. Move to the backup supplier before passing 20 orders on the Temu account |
| CPA between B and 1.5 × B | Close. Hold at $40 a day or less, ship new creatives from the best hook, test the 2-pack, push for a lower landed cost |
| CPA above 1.5 × B, or the Phase 1 gate failed | Stop paid ads on this product. The funnel numbers show which step failed: CTR (creative), add to cart (page or price), checkout (Stripe handoff). TikTok organic carries on for $0 |

---

## 11. If an ad is rejected or the account is restricted

- Read Meta's reason. For personal attributes or health, rewrite the line in the third person or as a plain product description, re-run `check_copy.py`, and resubmit. Do not appeal health-wording calls.
- Appeal once, with a short note, if it is a clear misread (for example "weighted" read as weight loss).
- **Never** change the landing page after approval to something the reviewer did not see, and never open a new ad account to get around a restriction. Both get accounts banned for good.

---

## 12. TikTok organic plan ($0)

TikTok paid waits (its minimum budget would use most of the test budget: $700 of $840 over 14 days; economics §2). Organic costs nothing, reaches people Meta does not, and tells us which hooks hold attention before Meta money is spent. Start when the product page is live, ideally a week before Meta Day 1. Organic orders also count towards the house "25 organic orders" rule, if Cody keeps it.

If `claims.ships_from_us` is off, organic can still run, using only the honest China-direct promise from config.

### Setup (Cody, once)

1. Claim {{HANDLE}} and switch it to a **Business account**. That gives the Commercial Music Library (the only music brand posts may use) and post analytics.
2. **Bio:**

```copy requires=none
Hooded cloaks for staying in. {{PRICE}}, free US shipping.
```

3. **Link:** the product page with `utm_source=tiktok&utm_medium=organic&utm_campaign=dropship-hoodedcloak&utm_content=bio`. If TikTok does not offer a website link to the account yet, put {{DOMAIN}} in the bio as text.
4. **Disclosure:** where TikTok shows the content disclosure setting, turn it on and choose "Your brand".
5. **Age:** if the account offers audience controls that limit a post to adults (18+), turn them on for every post.
6. Profile photo: the wordmark, or a crop of `ph-hc02`.

### What to post

| Pillar | Share | Material |
|---|---|---|
| What it is (demo) | 30% | V1 and its alternative openings; the S6 detail photos as a TikTok photo carousel; the scale clip on its own |
| Homebody and couch season | 30% | V2 with its three openings, V5, weekend-uniform cuts |
| Gift and thermostat | 25% | V3, V4. Christmas wording only until the end of Thu 3 Dec |
| Answers | 15% | Video replies to real comments: fit (V6), weight, care, delivery, "is this legit" (business name, address, support email) |

**30 days, one post a day,** two on weekend days when there is material. Batch-film twice a week, about 90 minutes each.

| Week | Posts | Goal |
|---|---|---|
| 1 | The six scripts, the detail carousel | Find which formats hold attention |
| 2 | Three openings each on the two best from week 1; first answer videos | Find the best first line |
| 3 | Three new versions of the top two formats in new rooms or light; more answers | Confirm the winner is the idea, not luck |
| 4 | Winners again; gift push if before Thu 3 Dec; answers | Feed the best hook to Meta Phase 2 |

**How to test a hook:** same footage, change only the first on-screen line. V1 and V2 have their alternative lines written out in `video-scripts.md`; for any other script, take them from that script's angle in `angles.md`. A hook "wins" when its post gets at least twice the account's median views in 72 hours, or viewers watch at least 60% of it on average. Log every post in `tiktok-post-log.csv`.

**Pinned comment** (on every post, while the promise is valid):

```copy requires=claims.ships_from_us
{{PRICE}}, free US shipping. Ships in {{SHIP_WINDOW}}, arrives {{ARRIVAL_WINDOW}} after you order. Link in bio.
```

**Hashtags:** three to five, product and mood only: {{BRAND_TAG}}, #cozy, #couchseason, #homebody, #nightin, #wearableblanket, #readingnook, #giftideas, #thermostatwars, #cozyathome. Never #weightedblanket: it is a garment, not a blanket, and that tag mostly carries health-claim content we can't make. Skip #booktok and anything school-year (both skew young).

### Engagement rules

- Reply to every comment in the first hour after posting. Answer good questions with a video reply.
- Comment as the brand on cozy-home creators' posts only when there is something real to say. No copy-paste comments.
- **Never:** buy views, likes or followers; join engagement pods; run giveaways during the test (review-incentive and sweepstakes rules); have friends post comments as if they were customers; use music outside the Commercial Music Library; repost anyone's video without written permission.
- **Never post:** children, teens or school themes; before/after; health or sleep claims; "POV: you're stressed" style hooks; competitor or supplier names or hashtags; supplier packaging; "was" prices.

### Cross-post for free

Export the original files from the editor (without the TikTok watermark) and post the same videos to Instagram Reels and Facebook Reels from the {{BRAND}} accounts, and to YouTube Shorts. Mood stills (S4, S6, the flat lay) can go to Pinterest, which compounds slowly (`organic-playbook.md`). Same captions, same copy check.

### Weekly review (Sunday, 20 minutes)

Fill `tiktok-post-log.csv`, pick the top two hooks, plan the next batch, and collect recurring questions from comments. Those become answer videos and FAQ lines on the product page.

---

## 13. Rows for `07-automation/tracker/experiments.csv`

Paste these when the test is scheduled (this kit does not write outside `ads/`). Replace the dates.

```csv
hc-01,YYYY-MM-DD,"Meta Phase 1: of three angles (demo, homebody, gift) at $20/day each, at least one reaches CPA at or below breakeven",meta,hoodedcloak,$420 / 7 days,blended CPA and best ad set CPA,"blended CPA <= $65.38 and one ad set <= $43.59",YYYY-MM-DD,,
hc-02,YYYY-MM-DD,"Meta Phase 2: the surviving angles plus fresh creatives from the winning hook hold CPA at or below breakeven at about $60/day",meta,hoodedcloak,$420 / 7 days,total CPA over 14 days,"<= $43.59 (20+ orders on $840, i.e. the 20-order cap reached on $840 or less)",YYYY-MM-DD,,
hc-03,YYYY-MM-DD,"TikTok organic: one of eight hooks earns 2x the account median views and at least one tracked order",tiktok,hoodedcloak,30 posts / 30 days,views per post and bio-link orders,"one hook at 2x median views and 1+ order with utm_source=tiktok",YYYY-MM-DD,,
```
