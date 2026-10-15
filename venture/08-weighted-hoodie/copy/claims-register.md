# Claims register: {{BRAND_NAME}} cloak copy

**Internal: not customer-facing.** Written 2026-10-15. This lists every factual claim and every promise in `product-page.md`, `policies.md` and `emails.md`, with where each one came from and whether it can be shown yet. Section E maps every token and flag to its key in `../../../hoodie-store/config.json`, which is the one place the brand name and every gated value live.

Read with `../compliance.md` (banned phrases, gated claims, Safety block, FTC rules) and `../economics.md` (price, delivery promise, Q4 dates).

---

## Status key

| Status | Meaning |
|---|---|
| **verified** | Checked this session against a source we can cite, or true by how the business works (we dropship, so a partner ships). |
| **owner-stated** | Cody told us, or it comes from the supplier listing title as Cody relayed it. We have not seen the supplier page (this network can't reach it). |
| **needs-sample** | Must be confirmed on the physical sample, its labels, its packaging or its delivery record before it may render. |
| **needs-owner** | Depends on a setup step or decision that only Cody can make (Stripe, domain, email, legal name, a policy that costs money). |

Promises (section C) also use **decided**: already settled in a research doc or house policy in this repo.

## How a claim gets onto the page

1. Gated claims render only inside `{{#if KEY}} ... {{/if}}` and only when that config flag is on. Each weight, material and fill claim is followed by `{{VERIFY:KEY}}`. The build refuses to publish if a marker sits outside its gate or its flag has not been set either way.
2. Ungated claims marked **needs-sample** are covered by `sample.checked`. The page doesn't publish until that flag is on, and whoever sets it has ticked every needs-sample row below.
3. **needs-owner** rows block launch until Cody has done the step. Rows marked "NEW" are promises this draft introduces; Cody approves or deletes each one.

---

## P. Product claims

| ID | Claim, as worded in the copy | Used in | Source | Status | Gate | What confirms it / what happens if it's false |
|---|---|---|---|---|---|---|
| P1 | Weighted: "calming weight", "Weighted hooded cloak", "Warm and heavy in the best way", "a gentle, even weight on your shoulders", "rests across your shoulders and back", "feels like a hug, not a load" | Page: meta, headline 3, subhead, buy box, bullet 1, What it is, FAQ 3 | Cody believes the supplier item is the category leader's cloak (about 4 lb). Not seen by us. | needs-sample | `claims.weighted` | On a kitchen scale the sample is clearly heavier than an ordinary lined hoodie (weigh one for comparison and record both). If not: flag off, all weight wording drops together, and `../economics.md` is re-run before any launch (compliance blocker 3). |
| P2 | "About {{WEIGHT_LB}} lb", "weighed on our own sample in size {{SIZE_WEIGHED}} on a kitchen scale and rounded down" | Page: bullet 1, Materials, FAQ 3, Safety block. Email 1: Safety block | None yet | needs-sample | `claims.weight_lb` | Measured weight, rounded **down** to the nearest 0.5 lb, with the size weighed and a photo of the scale kept. Never use the category leader's figure. |
| P3 | "The weight comes from {{FILL_DESCRIPTION}}" | Page: Materials, FAQ 3 | None | needs-sample | `claims.fill` (added; see note 1) | Label plus handling: feel for beads or quilted pockets, check the seams. If it's unclear, leave the flag off. |
| P4 | "soft faux-fur lining", "Plush on the inside, so it feels warm the moment you put it on", "Lining: {{FIBER_LINING}}" | Page: subhead, bullet 2, Materials | Cody (believes it is faux-fur lined). The category leader lists a polyester faux-fur lining, but that is their product, not ours. | needs-sample | `claims.lining` | The lining looks and feels like faux fur, and the label gives its fiber. `FIBER_LINING` is the label text, for example "100% polyester". |
| P5 | "Outer fabric: {{FIBER_OUTER}}" (expected "100% cotton") | Page: Materials | Expected from the category leader's listing; ours unconfirmed | needs-sample | `claims.outer_fiber` | Sewn-in fiber label. This disclosure is required by law, so if the label says something else, that text goes into `FIBER_OUTER`. |
| P6 | "{{CARE_INSTRUCTIONS}}" | Page: Care, FAQ 4. Email 4 | None | needs-sample | `claims.care` | Care label, copied in plain English. Never write "machine washable" unless the label says so. |
| P7 | "Let it dry all the way through before you wear it or put it away." | Page: Care, FAQ 4. Email 4 | General garment-care advice | verified (advice, not a property of the product) | none | Harmless whatever the label says. |
| P8 | "Made in: {{ORIGIN_DISCLOSURE}}" (expected "Imported") | Page: Materials | None | needs-sample | `claims.origin` (added; see note 1) | Country of origin on the label. Required disclosure. |
| P9 | Hooded: "Hood up, world out", "A full hood you can pull up whenever you want your quiet corner" | Page: headline 1, bullet 3, What it is | Supplier listing title as relayed ("2026 Unisex Punk Hooded Button Loose Cloak Fall Winter") | owner-stated | `sample.checked` | The hood pulls up over an adult head on the sample. |
| P10 | "Buttons down the front. Close it up to stay cocooned, or wear it open." "Closure: buttons down the front" | Page: bullet 5, Materials | Listing title ("Button") | owner-stated; placement needs-sample | `features.buttons` | Buttons run down the front and close it. If they don't, the flag goes off. |
| P11 | "A loose, roomy cut that goes over pajamas, a sweatshirt or whatever you're already wearing", "Throw it on over anything", "loose and roomy" | Page: subhead, bullet 4, Materials, sizing | Listing title ("Loose") | owner-stated; the over-a-sweatshirt part needs-sample | `sample.checked` | Try the sample on over a sweatshirt. |
| P12 | "Unisex" | Page: buy box, bullet 4, Materials | Listing title ("Unisex") | owner-stated | none | None needed. |
| P13 | "Sized by height" (and "Size (by height)"); "Adult sizes only"; "Pick your usual size in the menu" | Page: meta, bullets, Materials, Sizing, FAQ 5 | Cody: the listing has several sizes. The category leader sizes by height. The supplier size guide hasn't been seen. | needs-sample | `claims.sizes` for "by height" (the build enforces it, as the ad kit does); `sample.checked` for the rest | `listing.json` size names or `size-guide.*` give height ranges. If the supplier sizes by chest or S/M/L only, we build our own height chart from tape measurements before launch. Sizes meant for under-18s are never listed. |
| P14 | The size chart, `{{SIZE_TABLE}}` | Page: Sizing | Supplier size guide (`latest/size-guide.*` in the supplier folder) checked against the sample | needs-sample | `claims.sizes` | The sample's measured length is within 1 inch of the guide for its size. Until then, the "chart is coming" text and the checkout height field are used. |
| P15 | Colors, `{{COLOR_OPTIONS}}` | Page: buy box, Materials | Cody (several colors). The exact list comes from `listing.json`. | owner-stated | data | Only colors in stock in `listing.json`, named in our own plain words. |
| P16 | Feel words: "soft", "warm", "cozy", "feels like a hug", "a wearable hug", "wrapped up", "cocooned" | Page: throughout | Allowed comfort phrases (`../compliance.md`) | needs-sample (sense check) | `sample.checked` | If the sample is thin, scratchy or cold, "soft" and "warm" come out. |
| P17 | "It's made to wear while you're up and about. It isn't a bed blanket." "Don't sleep with the hood pulled over your face." | Page: What it is, FAQ 9, Safety. Email 4 | Our own usage instruction (`../compliance.md` §5) | verified (instruction) | none | None needed. |
| P18 | "Every photo on this page is of the sample we bought and checked ourselves." | Page: What it is | Own-photos rule (`../compliance.md` §7) | needs-owner | `config.photos_all_own` | On only if every image on the page is Cody's own, and each one is in the image source log. |
| P19 | "Before we listed it, we ordered one for ourselves. We weighed it, measured it, read the labels and wore it around the house." | Page: About | Sample gate | needs-sample | `sample.checked` | All four done and recorded. |
| P20 | "a hooded cloak, somewhere between a blanket and a hoodie. You put it on like a coat" | Page: What it is | Listing title, and Cody's description | owner-stated | `sample.checked` | It goes on like a coat (arms or an open front), not over the head. If it goes over the head, change "like a coat". |

**Note 1.** `claims.fill` and `claims.origin` are added to the seven gated keys in `../compliance.md`. The task asked for `{{VERIFY}}` markers on fill claims, and origin comes from the same label check. `features.buttons` is a feature flag, using the same mechanism.

---

## D. Shipping and delivery claims

| ID | Claim | Used in | Source | Status | Gate | What confirms it / if false |
|---|---|---|---|---|---|---|
| D1 | "Ships in {{SHIP_WINDOW}}" (US-warehouse value: "1-4 business days") | Page: buy box, FAQ 1, checkout button. Policies: Shipping. Emails: as `SHIP_BY_DATE` | `../economics.md` §7: order placed 0-1 business days, plus supplier processing of 1-3 business days (the supplier's help page says it "may take 1-3 days to process", via third-party excerpts) | needs-sample | config `origin` = `us_local` | Sample timeline (ordered → shipped) and the shipping lines in `listing.json`. If the sample took longer, widen the window in config before launch. |
| D2 | "Arrives {{ARRIVAL_WINDOW}} after you order" (US-warehouse value: "5-11 business days") | Page: bullet 7, FAQ 1, checkout. Policies. Emails: as `ARRIVE_FROM_DATE`/`ARRIVE_BY_DATE` | `../economics.md` §7: real window 2-9 business days, plus the house padding of 2 | needs-sample | `claims.ships_from_us` (any window of 11 business days or less needs it) | Sample order-to-delivery time, plus each order's tracking. Keep the evidence as the Mail Order Rule "reasonable basis" (`../compliance.md` §2). |
| D3 | China-direct fallback window: "10-22 business days" | Config only (not typed into the copy) | `../economics.md` §7, third-party data | needs-sample (used only if the origin is China) | config `origin` = `china_direct` | If used, no paid ads run (`../economics.md` §7). |
| D4 | "from a warehouse in the US" | Page: FAQ 2. Policies: Shipping | Expected "Local" tag. News reports say the supplier's US site moved to local warehouses after May 2025. | needs-sample | `claims.ships_from_us` | US postage on the sample, plus the "Local" tag in `listing.json`. |
| D5 | "with tracking", "tracked", "we email you the carrier and a tracking link" | Page, Policies, Emails 1-2 | `../economics.md` §7 | needs-sample | `sample.checked` | The sample arrived with a working tracking number. Every order's tracking goes in its dispute file. |
| D6 | Holiday line: order by {{HOLIDAY_ORDER_BY}} (Friday, December 4, 2026) for delivery by {{HOLIDAY_ARRIVE_BY}} (Wednesday, December 23, 2026) | Page: FAQ 8. Policies: Shipping | `../economics.md` §7. Date maths re-checked this session: 4 Dec plus 11 business days is Mon 21 Dec, plus 2 days of peak slack is Wed 23 Dec, with Veterans Day and Thanksgiving excluded | verified (the date maths); holds only if D1 and D2 hold | `claims.ships_from_us` and `config.holiday_cutoff_active` | Turn the flag off at the end of 4 Dec. Gift-delivery wording in ads stops 3 Dec. |
| D7 | "a fulfillment partner packs and ships your order", "we don't hold stock ourselves" | Page: FAQ 2, About. Policies. Emails | How the business works | verified | none | None needed. |
| D8 | "may arrive in their packaging rather than a {{BRAND_NAME}} box", "the sender name on the label may be theirs" | Page: FAQ 2, FAQ 8. Policies. Emails 1-2 | `../compliance.md` §1 (partner-branded mailers; the partner shows as sender) | verified (as worded, "may"); what the parcel looks like needs-sample | none | Photograph the sample packaging. If a price slip is inside, add the FAQ 8 sentence (see the editor note there). |
| D9 | "we can't add gift wrap or a note" | Page: FAQ 2, FAQ 8 | `../compliance.md` §1 (no inserts possible) | verified | none | Change it only if a backup supplier allows notes. |
| D10 | "Please don't use the return address printed on the package ... returns sent there don't reach us" | Page: FAQ 2. Policies. Email 2 | The label's return address is the partner's | verified | none | None needed. |
| D11 | "Your bank may take 5-10 business days to show it" | Policies: Refund timing, How refunds are paid. Email 3d | Stripe support, "Where is my customer's refund?" (support.stripe.com/questions/how-long-do-refunds-take-to-reach-my-customer), seen through search on 2026-10-15 | verified | none | None needed. |
| D12 | "Business days are Monday to Friday, not counting US federal holidays"; weekend and holiday orders count from the next business day | Page: FAQ 1. Policies. Emails (date maths) | Our definition | verified (a definition) | none | The date calculator must use the same rule. |
| D13 | China case only: "Any import charges are paid before it ships, so you won't be asked to pay anything on delivery" | Policies: Shipping | News reports that the supplier collects import charges at checkout | needs-owner | `config.import_charges_prepaid`, inside the not-`claims.ships_from_us` branch | Confirm at the supplier's checkout. |
| D14 | "US addresses only", plus `{{SHIP_RESTRICTIONS}}` (now: contiguous US only, no Alaska, Hawaii, PO boxes or APO/FPO) | Policies: Shipping. Page: FAQ 8 "(contiguous US)" | Decision (US-only promise and ads); the delivery windows have no basis outside the contiguous US yet | needs-owner | `config.ship_restrictions` | Ask the supplier about Alaska, Hawaii, PO boxes and APO/FPO. Widen the sentence only for what it confirms. Stripe can only limit the country, so any order to an excluded address is contacted the same day and refunded if it can't be served. |
| D15 | "The charge shows as {{STATEMENT_DESCRIPTOR}}" | Page: FAQ 10, checkout button. Email 1 | `../compliance.md` §6: `HUNKERHOOD.COM` on a separate account, or `{EXISTINGPREFIX}* HUNKERHOOD` if the existing one is reused | needs-owner | none | A real test charge shows exactly this text. If the suffix doesn't work on Payment Links, show the real descriptor instead. |

---

## S. Shop and brand claims

| ID | Claim | Used in | Source | Status | What confirms it / if false |
|---|---|---|---|---|---|
| S1 | The brand name `{{BRAND_NAME}}` = Hunkerhood | Everywhere | `../brand-screen.md`: clear at first-pass screen; hunkerhood.com was available on 2026-10-15 (not bought) | verified (screen); domain and TSDR checks needs-owner | Cody buys the domain and checks serials 98353171, 98530861 and 98821765 in TSDR. A rename is one edit: `brand_name` in `hoodie-store/config.json`. |
| S2 | "a small online shop based in Nashville, Tennessee" | Page: About | The business address on existing materials; `../compliance.md` §8 (TN-based) | owner-stated | If Cody isn't actually based in or near Nashville, change it to "based in Tennessee". |
| S3 | "Right now we sell one thing: this cloak." | Page: About | True for this brand at launch | owner-stated | Edit it when a second product is added. |
| S4 | "'hunker down', which means to stay put for a while" | Page: About | Merriam-Webster, "hunker down": "to stay in one place for a period of time" (merriam-webster.com/dictionary/hunker%20down), seen through search on 2026-10-15 | verified | None needed. |
| S5 | "A real person reads every message" (**not used**) | Nowhere yet | House SOP Tier 0 lets an AI agent auto-send some replies (`../04-operations/customer-service-sop.md`) | needs-owner | Add it only if Cody confirms that no automated replies go out for this brand. |
| S6 | "We don't make the cloak ourselves. A manufacturer makes it, and a fulfillment partner ships it to you." | Page: About | How the business works | verified | None needed. |
| S7 | `{{LEGAL_BUSINESS_NAME}}` and "trading as {{BRAND_NAME}}" | Page footer. Policies: Contact, Privacy, Terms. Email footer | None yet | needs-owner | Cody gives the legal name, and checks with the Davidson County Clerk whether the trade name needs registering, along with the minimal-activity business license (`../compliance.md` §8). |
| S8 | 159 4th Ave N, Ste 100 #2179, Nashville, TN 37219 | Page footer. Policies. Email footer | The address on existing outreach materials in this repo | owner-stated | See C7 for receiving parcels. |
| S9 | "No reviews yet" | Page: Reviews | True: no store reviews exist | verified | Replace it with the real reviews once they exist. |
| S10 | `{{SUPPORT_EMAIL}}` | Everywhere | None yet | needs-owner | Suggested: an address on hunkerhood.com once it's bought. Until then, nothing launches. |

---

## C. Commitments (promises the copy makes)

| ID | Promise | Used in | Source | Status | Note |
|---|---|---|---|---|---|
| C1 | `{{PRICE}}` = "$99", USD, flat. No former or comparison price. | Page, Terms | `../economics.md` §1 and the research decisions | decided | Log every price change with its date. An introductory price is allowed only if it is really raised on the stated date. |
| C2 | Free US shipping on every order | Page, Policies, Terms, Email 1 | `../economics.md` §1 | decided | The supplier's standard shipping must be free. Check that on the sample receipt (needs-sample). |
| C3 | 30 days from delivery to return | Page, Policies, Emails 1 and 4 | House policy (`../04-operations/refund-and-shipping-policies.md`, dropship) | decided | None. |
| C4 | Damaged, faulty, wrong or not as described: email a photo; we refund or replace; you don't send it back | Page: FAQ 7. Policies | House policy (dropship: "photo is enough") | decided | None. |
| C5 | Change of mind: unworn and unwashed with any tags; customer pays return postage; full refund of the amount paid within 1 business day of arrival; no restocking fee | Page: FAQ 7. Policies | House policy says "return unused for a refund of the item price" and "within 48 hours of approval". This copy tightens that to 1 business day and says who pays postage. | needs-owner | `../economics.md` §6 describes a looser "photo is enough, keep it" refund for any reason. This copy follows the house policy and the brief instead (returns come back to Nashville). Cody chooses one. |
| C6 | **NEW.** One free size swap per order: we send a prepaid return label, and ship the new size when the carrier scans the return | Page: Sizing, FAQ 6. Policies. Emails 1 and 4 | This draft | needs-owner | Cost is one unit at landed cost plus one return label. The 3% replacement allowance in `../economics.md` covers the unit, not the label. |
| C7 | Returns go to the Nashville address; email first; a note with the order number goes inside | Page: FAQ 2 and 7. Policies. Email 2 | The brief | needs-owner | Confirm that the Ste 100 #2179 mailbox accepts and holds parcels of about 5 lb from USPS, UPS and FedEx. |
| C8 | Cancel any time before it ships, for a full refund | Policies. Emails 1 and 3a-3c | `../compliance.md` §2 | decided | If the supplier won't cancel in time, Cody refunds anyway and keeps the unit. |
| C9 | Delay notice before the ship-by date, with a new date and a free cancel option. Silence means OK only when the delay is 30 days or less. Over 30 days, unknown, or a second delay needs an express yes, otherwise we refund. | Page: FAQ 1. Policies. Emails 3a-3c | FTC Mail Order Rule, 16 CFR 435 (`../compliance.md` §2) | decided (legal requirement; read from excerpts, not legal advice) | Trigger: no tracking by the end of business day 3. This replaces the house T2 email. |
| C10 | Refunds within 1 business day of canceling or receiving a return | Policies. Emails 3a-3d | House target (`../compliance.md` §2). The legal maximum for card refunds on canceled orders is 7 working days. | decided | Always through Stripe. |
| C11 | **NEW.** Lost or stuck parcel: email us if it isn't there by the last day of the window or tracking hasn't moved for 3 business days; replacement or refund if it doesn't turn up within 3 business days of the email | Policies | This draft | needs-owner | The 3% replacement allowance covers it. |
| C12 | We reply within 1 business day, Monday to Friday | Page, Policies, Emails | `../compliance.md` §6 | decided; needs-owner to staff it | Matches the house SOP target of under 24 hours. |
| C13 | We ask every customer for a review, give nothing in return, and post every genuine review, good or bad | Page: Reviews. Email 5 | FTC Consumer Review Rule, 16 CFR 465 (`../compliance.md` §4) | decided | Keep a log of anything held back (spam, abuse, personal details) and why. |
| C14 | **NEW.** Height check before the supplier order: email on a mismatch; if there's no reply by the end of the next business day, send the size picked | Page: Sizing (pre-chart), FAQ 5. Email 1 | This draft | needs-owner | Needs the optional Stripe custom field "Your height (for sizing)". A mismatch email can eat into the 4 ship days, so the delay notice applies if the ship-by date would be missed. |
| C15 | **NEW.** A return that comes back used: we email photos, then offer a partial refund or to send it back at our cost | Policies | This draft | needs-owner | None. |
| C16 | Sales tax added at checkout for Tennessee addresses | Policies: Shipping, Terms. Email 1 | `../compliance.md` §8 | needs-owner | `config.stripe_tax` goes on only after TN registration and Stripe Tax are set up. |
| C17 | **NEW.** You must be 18 or older to order | Policies: Terms | This draft (adult-only product) | needs-owner | None. |
| C18 | Privacy: the sharing list (fulfillment partners and carriers, Stripe, MailerLite, Vercel, Meta Pixel), and "We don't sell your personal information" | Policies: Privacy | `../compliance.md` must-do 12 | needs-owner | Switch on only the tools really in use, and add any new tool before it goes live. |
| C19 | If the partner runs out or cancels, we tell you the same business day, and refund or offer a definite new date | Policies. Email 3d | `../compliance.md` §2 | decided | None. |
| C20 | **NEW.** We can usually fix a wrong address before the supplier order is placed | Policies | This draft | needs-owner | Low risk. Only true if Cody places orders with a short delay. |
| C21 | Optional: a credit of `{{DELAY_CREDIT}}` (fixed dollars) for customers who wait | Email 3a | `../compliance.md` §2 (optional credit from house T2) | needs-owner | `config.delay_credit` is off by default. |
| C22 | A price change never affects an order already placed | Policies: Terms | True by how checkout works | decided | None. |

---

## Claims the copy deliberately does not make

These come from `../compliance.md` (banned list and §3, §4, §5, §7, §9). The banned list is the authority. This is the short reason for each.

- No effect on mood, mind, body or sleep, of any kind, hedged or not. Comfort words only (`../compliance.md` §3).
- Nothing about who makes it, or whether it matches any other brand's product. That's unverified (Cody's belief) and a trademark risk.
- No other brand's name, price, reviews or photos, and no comparison with them.
- No former, list, comparison or "worth" price, and no percentage savings.
- No review counts, star ratings or customer quotes until real ones exist.
- No "first", "original", "best" or any ranking.
- No pockets. They aren't confirmed on our listing.
- No beads or any specific fill unless the label or the sample shows it.
- No skin, eco or fire-related properties of the fabric.
- No delivery faster than the config window. No "arrives by" date except the gated holiday line.
- No sizes, models, copy or targeting aimed at under-18s.
- No suggestion that we make, store or pack it ourselves.
- No word that implies a payment-free trial or a no-questions-asked refund. Returns follow C3-C5.

Watch-list words used, and reviewed: "introverts" appears once, in the third person ("It's for homebodies and introverts"), on the product page. No other watch-list word is used.

---

## E. Tokens and where their values live

**`hoodie-store/config.json` is the single source** for the brand name, every claim flag and every value the copy uses. The brand name is written only there, as `brand_name`; to rename, change that one value (and `domain`, `handle`, `hashtag` once they exist). This section only maps each token and flag to its key. It holds no values of its own, so nothing here can drift out of step with the site build. The ad kit's tokens are mapped in `../ads/README.md`.

A claim flag is on when its claim in `config.json` has a `value` and `verified: true` (a preview build may also show claims with `show_in_preview: true`). Each claim's `copy_flag` is the gate name the copy uses.

| Token or gate in the copy | `config.json` key | Notes |
|---|---|---|
| `BRAND_NAME` | `brand_name` | S1. The only place the name is written |
| `BRAND_SLUG` | derived from `brand_name` | file names, URLs |
| `BRAND_DOMAIN` | `domain` | empty until bought (needs-owner) |
| `PRODUCT_NAME` | `brand_name` + `product_noun` | no leading "The": the copy writes "your {{PRODUCT_NAME}}" |
| `LEGAL_BUSINESS_NAME` | `legal_business_name` | S7, needs-owner |
| `SUPPORT_EMAIL` | `support_email` | S10, needs-owner |
| `POLICY_DATE` | `policy_date` | date the policies go live |
| `PRICE` | `price` (with `price_log`) | C1. Flat; `compare_at` stays null |
| `STATEMENT_DESCRIPTOR` | `stripe.statement_descriptor` | D15. Empty until a real test charge shows it; never pre-filled. Emails must not go out while it is empty |
| `SHIP_WINDOW`, `ARRIVAL_WINDOW` | `delivery.profiles.us_local` or `.china_direct` (`ship_window`, `arrival_window`) | D1-D3. The profile follows `claims.ships_from_us` |
| `DELIVERY_PROMISE` | `delivery.promise_template` | rendered from the two windows |
| `SHIP_BY_DATE`, `ARRIVE_FROM_DATE`, `ARRIVE_BY_DATE` | derived per order from the windows | date rules in `emails.md` (offsets 4, 5 and 11 business days for us_local) |
| `HOLIDAY_ORDER_BY`, `HOLIDAY_ARRIVE_BY`, `config.holiday_cutoff_active` | `delivery.holiday.order_by`, `.arrive_by`, `.active` | D6. Shown only with `claims.ships_from_us`, and only until the order-by date |
| `SHIP_RESTRICTIONS`, `config.ship_restrictions` | `delivery.ship_restrictions` | D14 |
| `config.import_charges_prepaid` | `delivery.import_charges_prepaid` | D13 (China case only) |
| `config.stripe_tax` | `stripe.tax_enabled` | C16 |
| `config.height_field` | `stripe.height_field` | C14, while `claims.sizes` is off |
| `config.pixel` | `meta_pixel_id` (on when set) | C18 |
| `config.email_provider`, `EMAIL_PROVIDER` | `email_provider` | C18 |
| `config.dba` | `legal_business_name` differs from `brand_name` | S7 |
| `config.photos_all_own` | `photos_all_own` (and every image logged) | P18 |
| `sample.checked` | `sample_checked` | P19 and every ungated needs-sample row |
| `claims.weighted` | `claims.weighted` | P1 |
| `claims.weight_lb`, `WEIGHT_LB`, `SIZE_WEIGHED` | `claims.weight_lbs` (`value`, `size_weighed`) | P2. `value` stays null until the sample is weighed |
| `claims.fill`, `FILL_DESCRIPTION` | `claims.fill` | P3 |
| `claims.lining`, `FIBER_LINING` | `claims.faux_fur_lining` (`fiber` holds the label text) | P4 |
| `claims.outer_fiber`, `FIBER_OUTER` | `claims.outer_fiber` | P5. `value` stays null until the label is read |
| `claims.care`, `CARE_INSTRUCTIONS` | `claims.care` | P6 |
| `claims.origin`, `ORIGIN_DISCLOSURE` | `claims.origin` | P8 |
| `claims.ships_from_us` | `claims.ships_from_us` | D2, D4, D6 |
| `claims.sizes`, `SIZE_TABLE` | `claims.size_chart` (`table` rows) | P13, P14 |
| `features.buttons` | `claims.buttons` | P10 |
| `COLOR_OPTIONS`, `SIZE_OPTIONS` | `colors`, `sizes` (or the in-stock adult sizes from `listing.json`) | P15 |
| `REFUND_LINE` (ad kit) | `refund_summary` | must say exactly what the live Returns policy says |
| `SENDER_NAME`, `DELAY_CREDIT`, `config.delay_credit`, `RETURNS_URL`, `REVIEW_LINK`, `CANCEL_LINK` | no key yet | needs-owner. Add each to `config.json` before the emails are automated; until then they are filled by hand from this table, never from memory |

Per-order values, filled for each order by the email step: `FIRST_NAME`, `ORDER_ID`, `ORDER_DATE`, `SIZE`, `COLOR`, `AMOUNT_PAID`, `TAX_AMOUNT`, `SHIPPING_ADDRESS`, `CUSTOMER_HEIGHT`, `CARRIER`, `TRACKING_URL`, `TRACKING_NUMBER`, `REVISED_SHIP_DATE`, `REVISED_ARRIVE_BY_DATE`, `ORIGINAL_PLUS_30_DATE`, `SECOND_REVISED_SHIP_DATE`, `SECOND_REVISED_ARRIVE_BY_DATE`, `DELAY_REASON`, and the flags `order.tax`, `order.height`, `order.delay_reason`, `order.revised_date_known`, `order.second_revised_date_known`.

The business address (159 4th Ave N, Ste 100 #2179, Nashville, TN 37219, S8) is written out in the copy, not held in config.

Image-only tokens (`COLOR`, `COLOR_SLUG`, `VIEW`, `VIEW_SLUG`) are described in `product-page.md`.

Order numbers are never written with a hash sign in front, because a hash sign followed by the digit 1 is on the banned list.

---

## F. Sample gate: what to check and which flag it sets

| Check on the sample | Sets | Record |
|---|---|---|
| Weigh it on a kitchen scale, and weigh an ordinary lined hoodie for comparison | `claims.weighted`, `claims.weight_lb`, `WEIGHT_LB` (rounded down to 0.5 lb), `SIZE_WEIGHED` | Photo of the scale with the sample on it |
| Feel for beads, pockets or panels, and check the seams | `claims.fill`, `FILL_DESCRIPTION` | Notes and photo |
| Read the fiber label (outer and lining), the origin and the RN or maker | `claims.outer_fiber`, `claims.lining`, `claims.origin` and their values | Photo of every label |
| Read the care label | `claims.care`, `CARE_INSTRUCTIONS` | Photo |
| Check the buttons | `features.buttons` | Note |
| Measure the length (and the hood) against the supplier size guide | `claims.sizes`, `SIZE_TABLE` | Tape-measure photos |
| Record the order, ship and delivery dates, the carrier, the tracking and the postage origin | `claims.ships_from_us`, `delivery.origin`, a check of D1 and D2 | Screenshots of the supplier order and tracking |
| Photograph the packaging, the label sender and any packing or price slip | D8 wording, the FAQ 8 sentence | Photos |
| Try it on over a sweatshirt: does it pull on like a coat, and does it feel soft and warm? | P11, P16, P20 | Note |
| Cody's own photos and video | `config.photos_all_own` | Image source log |
| All of the above done | `sample.checked` | Date and initials |

---

## Copy check run on 2026-10-15

- **Banned phrases:** 206 entries were parsed from the list in `../compliance.md`. Matching was case-insensitive and whole-word or whole-phrase. Hyphen and space variants were treated as the same (a hyphenated entry also catches its spaced form), and curly apostrophes were normalized. Only the fixed Safety block was skipped. Editor notes were checked too. Result: **0 hits** in `product-page.md`, `policies.md`, `emails.md` and this file, including the Privacy and Terms sections.
- **Gated phrases:** weight, lining, fiber, care, US-warehouse, size-chart, fill and origin wording appears only inside its own `{{#if}}` branch. Result: **0 outside their gates.**
- **VERIFY markers:** 28 in the copy, all inside their own gates.
- Rerun the check after every edit, and on the rendered pages, ads, alt text and file names before publishing.
