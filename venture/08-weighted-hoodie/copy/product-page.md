# Product page copy: {{PRODUCT_NAME}}

> **Editor:** Draft v1, written 2026-10-15. Nothing here goes live until the sample gate in `../compliance.md` ("Must-do before the first ad dollar") has passed. Lines that start with "Editor:" are internal and never go on the page. Everything else is customer-facing.

> **Editor:** How the tokens work (full list, sources and status in `claims-register.md`):
> - `{{BRAND_NAME}}`, `{{PRICE}}` and the other capitalised tokens come from the one product config. The brand name lives only there, so a rename is one edit.
> - `{{#if claims.KEY}} ... {{else}} ... {{/if}}` is gated text. It renders only when that config flag is on. A flag goes on only after the sample confirms it.
> - `{{VERIFY:claims.KEY}}` follows every weight, material and fill claim. When the flag is on, it renders as nothing. The build must refuse to publish if a marker is outside its own gate or its flag has not been set either way.
> - The Safety block between the SAFETY-BLOCK markers is fixed text. Copy it exactly. The banned-phrase check skips it, and nothing else.
> - The page as a whole publishes only when `sample.checked` is on. Whoever turns it on confirms every ungated "needs-sample" row in `claims-register.md` first.
> - A line that is left empty once its gate is removed gets dropped, so bullet lists don't break in two.
> - `claims.weight_lb` is only a measurement. Turn it on as soon as the sample is weighed, even if `claims.weighted` stays off, so the "we'll post the exact weight" fallback text never shows after the sample has arrived.
> - The `##` headings in this file are section labels for whoever builds the page. They are not page text. The `###` headings inside Sizing are page text.

---

## Page title and meta description

- **Title tag:** {{PRODUCT_NAME}}: a wearable blanket with a hood, for staying in
- **Meta description:** A roomy hooded cloak{{#if claims.weighted}} with a calming weight{{VERIFY:claims.weighted}}{{/if}}{{#if claims.sizes}}, sized by height{{/if}}. {{PRICE}} with free US shipping and 30 days to decide.

---

## Headline options (pick one)

1. **Hood up, world out.** *(recommended: it works whatever the sample shows, and it matches the ad hooks)*
2. **A wearable hug for quiet nights in.**
3. {{#if claims.weighted}}**Warm and heavy in the best way.**{{VERIFY:claims.weighted}}{{else}}**Settle in. Stay in.**{{/if}}

## Subhead

A roomy hooded cloak{{#if claims.weighted}} with a calming weight{{VERIFY:claims.weighted}}{{/if}}{{#if claims.lining}} and a soft faux-fur lining{{VERIFY:claims.lining}}{{/if}}. Throw it on over anything, pull the hood up and settle in.

---

## Buy box

- **Product line:** {{#if claims.weighted}}Weighted hooded cloak{{VERIFY:claims.weighted}}{{else}}Hooded cloak{{/if}} · Unisex · Adult sizes
- **Price:** {{PRICE}} USD · Free US shipping
- **Delivery:** {{DELIVERY_PROMISE}}
- **Color:** {{COLOR_OPTIONS}}
- **Size{{#if claims.sizes}} (by height){{/if}}:** {{SIZE_OPTIONS}}
- **Button:** Buy now
- **Under the button:** 30 days to decide · Questions? {{SUPPORT_EMAIL}}

> **Editor:** List only colors and adult sizes that are in stock in `listing.json`. If the listing has smaller sizes meant for under-18s, leave them out completely. No countdowns, stock counters or "people are viewing this" widgets.

---

## Benefits (7 bullets)

{{#if claims.weighted}}- **A calming weight.** {{#if claims.weight_lb}}About {{WEIGHT_LB}} lb{{VERIFY:claims.weight_lb}}, resting{{else}}It rests{{/if}} across your shoulders and back. It feels like a hug.{{VERIFY:claims.weighted}}{{/if}}
{{#if claims.lining}}- **Soft faux-fur lining.** Plush on the inside, so it feels warm the moment you put it on.{{VERIFY:claims.lining}}{{/if}}
- **A full hood.** Pull it up whenever you want your quiet corner.
- **Throw it on over anything.** A loose, roomy cut that goes over pajamas, a sweatshirt or whatever you're already wearing. Unisex.
{{#if features.buttons}}- **Buttons down the front.** Close it up to stay cocooned, or wear it open.{{VERIFY:features.buttons}}{{/if}}
{{#if claims.sizes}}- **Sized by height.** Choose your size by how tall you are. Adult sizes only.{{else}}- **Adult sizes only.** Choose from {{SIZE_OPTIONS}}.{{#if config.height_field}} Not sure which? Type your height at checkout and we'll check it against the maker's chart.{{/if}}{{/if}}
- **Free US shipping, 30 days to decide.** Tracked delivery, {{ARRIVAL_WINDOW}} after you order. If it isn't for you, send it back within 30 days of delivery. For a change-of-mind return, you pay the return postage.

> **Editor:** If `claims.weighted`, `claims.lining` or `features.buttons` is off, its bullet disappears and the list still has at least 4. "Sized by height" needs `claims.sizes` (the same gate as the ad kit): until the maker's chart is checked, the menu is plain sizes, so that bullet becomes the "Adult sizes only" one. Don't swap in a replacement claim that the sample hasn't confirmed.

---

## What it is

It's a hooded cloak, somewhere between a blanket and a hoodie. You put it on like a coat, pull the hood up, and you're wrapped up{{#if claims.weighted}} with a gentle, even weight on your shoulders{{VERIFY:claims.weighted}}{{/if}}.

Wear it on the couch, at your desk, in your reading nook, or on the porch with a coffee. It's made for staying in: couch season, slow mornings, quiet nights in, a bit of me-time.

It's for homebodies and introverts, for anyone who's always cold, and for the friend who steals every blanket.

It's made to wear while you're up and about. It isn't a bed blanket.

{{#if config.photos_all_own}}Every photo on this page is of the sample we bought and checked ourselves.{{/if}}

---

## Materials and care

{{#if claims.outer_fiber}}- **Outer fabric:** {{FIBER_OUTER}}{{VERIFY:claims.outer_fiber}}{{/if}}
{{#if claims.lining}}- **Lining:** {{FIBER_LINING}}{{VERIFY:claims.lining}}{{/if}}
{{#if claims.fill}}- **What gives it its weight:** {{FILL_DESCRIPTION}}{{VERIFY:claims.fill}}{{/if}}
{{#if claims.weight_lb}}- **Weight:** about {{WEIGHT_LB}} lb, weighed on our own sample in size {{SIZE_WEIGHED}}{{VERIFY:claims.weight_lb}}{{/if}}
- **Fit:** Loose and roomy, unisex{{#if claims.sizes}}, sized by height{{/if}}. Adult sizes only.
{{#if features.buttons}}- **Closure:** Buttons down the front{{VERIFY:features.buttons}}{{/if}}
{{#if claims.origin}}- **Made in:** {{ORIGIN_DISCLOSURE}}{{VERIFY:claims.origin}}{{/if}}
- **Colors:** {{COLOR_OPTIONS}}

**Care**

{{#if claims.care}}{{CARE_INSTRUCTIONS}}{{VERIFY:claims.care}} Let it dry all the way through before you wear it or put it away.{{else}}We're confirming the care steps from the label on our sample and will post them here.{{/if}}

Keep it away from open flames, candles and heaters.

> **Editor:** Fiber content and "Imported" (or the true origin) are legally required on this page (Textile Act, `../compliance.md` §9). So `FIBER_OUTER`, `FIBER_LINING` and `ORIGIN_DISCLOSURE` hold exactly what the sewn-in label says, even if it is not what we expected (for example "80% cotton, 20% polyester"). If the label disagrees with the expected value, change the config value; don't hide the line. If there is no label at all, that is blocker 6 in `../compliance.md`: stop and decide before launch.
>
> `FILL_DESCRIPTION` says plainly what makes it heavy, taken from the label and from handling the sample. Examples: "a dense, heavy fabric and lining, no beads" or "glass beads sewn into quilted pockets". Never guess. If you can't tell, leave `claims.fill` off.
>
> The care `{{else}}` text is only for a preview before the sample arrives. The page can't publish with it, because `sample.checked` needs `claims.care` set.

---

## Sizing

{{#if claims.sizes}}

### Size chart

{{SIZE_TABLE}}

Measure your height without shoes and find it in the chart. It's a loose cut, so your height matters more than your build.

It shouldn't drag on the floor: a long hem can catch on stairs.

Between two sizes? Email {{SUPPORT_EMAIL}} with your height and we'll help you choose. Adult sizes only.

{{else}}

### How sizing works

It's a loose, roomy cut, so your height matters more than your build.

**The exact chart is coming.** We're checking the maker's size guide against our own sample with a tape measure. We'll post the chart here once the numbers match. We won't post a chart we haven't checked.

**How to choose in the meantime:**

1. Measure your height without shoes.
2. Pick your usual size in the menu.
3. Type your height in the "Your height" box at checkout.
4. Before we place your order, we check your height against the maker's chart. If a different size looks like a better fit, we email you, and you decide. If we haven't heard back by the end of the next business day, we send the size you picked, so your order isn't held up.

It shouldn't drag on the floor: a long hem can catch on stairs. Adult sizes only.

If it still isn't right when it arrives, you get one free size swap. See "What if it doesn't fit?" below.

{{/if}}

> **Editor:** Step 4 is a real job. Cody checks each "Your height" answer against the maker's chart when placing the supplier order, which happens on business day 0-1. A mismatch email can use up one of the four ship days. If the order then can't ship by the ship-by date, the delay notice in `emails.md` must go out before that date. Turn on `claims.sizes` only when the maker's chart has been checked against the sample. Then the height check becomes optional.

---

## FAQ (10 questions)

**1. When will my order arrive?**
It ships in {{SHIP_WINDOW}} and arrives {{ARRIVAL_WINDOW}} after you order, with tracking. Business days are Monday to Friday, not counting US federal holidays. Your order confirmation email gives you the actual dates. That's slower than the big stores, and we'd rather tell you the real window now than surprise you later. If your order is going to be late, we'll email you before the ship-by date with a new date and the choice to cancel for a full refund.

**2. Who ships it, and what will the package look like?**
We're a small shop, and a fulfillment partner packs and ships your order for us{{#if claims.ships_from_us}} from a warehouse in the US{{VERIFY:claims.ships_from_us}}{{/if}}. It may arrive in their packaging rather than a {{BRAND_NAME}} box, and we can't add gift wrap or a note. Please don't send anything back to the return address on the package. It belongs to our partner, and returns sent there don't reach us. Returns come to us in Nashville; the address is in our Returns and refunds policy.

**3. How heavy is it?**
{{#if claims.weight_lb}}About {{WEIGHT_LB}} lb{{VERIFY:claims.weight_lb}}. We weighed our own sample in size {{SIZE_WEIGHED}} on a kitchen scale and rounded down.{{#if claims.weighted}} The weight rests across your shoulders and back, so it feels like a hug, not a load.{{VERIFY:claims.weighted}}{{/if}}{{#if claims.fill}} The weight comes from {{FILL_DESCRIPTION}}.{{VERIFY:claims.fill}}{{/if}}{{else}}We'll post the exact weight here once we've weighed our sample. Email {{SUPPORT_EMAIL}} and we'll tell you.{{/if}}

**4. How do I wash it?**
{{#if claims.care}}{{CARE_INSTRUCTIONS}}{{VERIFY:claims.care}} Let it dry all the way through before you wear it or put it away.{{else}}We're confirming the care steps from the label on our sample and will post them here.{{/if}}

**5. Which size should I get?**
{{#if claims.sizes}}Go by your height: find it in the size chart above.{{else}}The exact chart is coming. Until then, pick your usual size and type your height at checkout. We'll check it against the maker's chart before we place your order.{{/if}} Between sizes? Email {{SUPPORT_EMAIL}} with your height and we'll help. We sell adult sizes only.

**6. What if it doesn't fit?**
Email us within 30 days of delivery with your order number and your height. We'll send you a prepaid return label and ship the right size as soon as the carrier scans your return. That swap is free, once per order. If the size you need isn't available, we'll refund you in full instead.

**7. Can I return it if I just don't love it?**
Yes. You have 30 days from delivery. Send it back unworn and unwashed (trying it on at home is fine) to our address in Nashville, and we'll refund the full amount you paid within 1 business day of it arriving. For this kind of return, you pay the return postage. If it arrived damaged or faulty, or isn't as described, that's on us: email a photo and we'll refund or replace it, and you won't need to send it back. Please email us before you send anything so we can match it to your order. Full details are in our Returns and refunds policy.

**8. Is it a good gift?**
It's a good one for the person who's always cold, or the friend who steals every blanket. Find out their height first. You can ship it straight to them by entering their address at checkout. It ships in our partner's packaging, so there's no gift wrap or note. The tracking and order emails come to you, and size swaps work for gifts too: you just email us.{{#if claims.ships_from_us}}{{#if config.holiday_cutoff_active}} For delivery by {{HOLIDAY_ARRIVE_BY}}, order by {{HOLIDAY_ORDER_BY}} (contiguous US).{{VERIFY:claims.ships_from_us}}{{/if}}{{/if}}

**9. Who is it not for?**
It's an adult garment, made and sized for adults (18+), and only adults should wear it. Never put it on, or lay it over, anyone younger. Don't put it on anyone who can't take it off easily on their own. It's made to wear while you're awake, so don't sleep with the hood pulled over your face. If you're pregnant, or have breathing, circulation or sleep problems or limited mobility, check with your doctor before wearing it. Please read the Safety notes below too.

**10. What will I see on my card statement?**
The charge shows as **{{STATEMENT_DESCRIPTOR}}**. If you see a charge you don't recognize, or anything about your order looks wrong, email {{SUPPORT_EMAIL}} before you call your bank. We reply within 1 business day, and we can usually sort it out faster.

> **Editor:** FAQ 8: once the sample arrives, check whether the parcel has a packing slip showing a price. If it does, add one sentence to FAQ 8: "The package may include a packing slip from our partner." Turn `config.holiday_cutoff_active` off at the end of {{HOLIDAY_ORDER_BY}}, and stop gift-delivery wording in ads a day earlier (`../economics.md` §7). The cutoff dates only hold for the US-warehouse delivery window, which is why they sit inside `claims.ships_from_us`.

---

## Safety

<!-- SAFETY-BLOCK:START (fixed text from ../compliance.md section 5; copy exactly) -->
**Safety**
- Adult garment. Not for children.
- Never use on or around babies or children under 3. Weighted products are not safe for infants.
- Only wear it if you can take it off easily on your own.
- Keep your face and nose clear. Don't sleep with the hood pulled over your face.
- If you are pregnant, or have breathing, circulation or sleep problems or limited mobility, check with your doctor before using any weighted product.
- Keep away from open flames, candles and heaters.
{{#if claims.weight_lb}}- Weight: about {{WEIGHT_LB}} lb.{{VERIFY:claims.weight_lb}}{{/if}}
<!-- SAFETY-BLOCK:END -->

> **Editor:** The Safety block shows on the page as written, whatever the sample shows. It also goes in the order confirmation email, because we can't put anything in the parcel. Place it right after the FAQ, not behind a click.

---

## About {{BRAND_NAME}}

{{BRAND_NAME}} is a small online shop based in Nashville, Tennessee. Right now we sell one thing: this cloak.

The name comes from "hunker down", which means to stay put for a while. That's the whole idea. Hood up, settle in, stay in.

We don't make the cloak ourselves. A manufacturer makes it, and a fulfillment partner ships it to you. {{#if sample.checked}}Before we listed it, we ordered one for ourselves. We weighed it, measured it, read the labels and wore it around the house.{{/if}}

If something isn't right, email {{SUPPORT_EMAIL}}. We reply within 1 business day.

> **Editor:** Keep this true and small. No founder name, origin story, "family business" or "years of experience". If Cody wants a sign-off name, use `{{SENDER_NAME}}` as in the emails. "A real person reads every message" may be added only if Cody confirms that no automated replies go out for this brand (the house SOP allows auto-sent replies). See `claims-register.md` S5.

---

## Reviews

Every genuine review from customers of this shop appears here, good or bad.

> **Editor:** This block renders only once `reviews` in `hoodie-store/config.json` holds at least one real review (`{"text": "...", "name": "first name or initials", "date": "2026-11-20"}`); until then the page has no Reviews block at all. No star widget, no "0 reviews" stars, no borrowed or imported reviews, no AI-written quotes. When the first real reviews arrive, show them all (we may hold back only spam, abuse or personal details). Reviews from friends or family must say so.

---

## Trust strip and footer

- **Trust strip (under the buy box):** Free US shipping · Tracked delivery · 30 days to decide · Help within 1 business day
- **Footer:** {{LEGAL_BUSINESS_NAME}} · 159 4th Ave N, Ste 100 #2179, Nashville, TN 37219 · {{SUPPORT_EMAIL}} · Shipping · Returns and refunds · Terms · Privacy · All prices in USD

> **Editor:** If `LEGAL_BUSINESS_NAME` is the same as `BRAND_NAME`, show it once. The footer links point to the sections of `policies.md`.

---

## Checkout (Stripe Payment Link) text

- **Submit-button custom text:** Ships in {{SHIP_WINDOW}}. Arrives {{ARRIVAL_WINDOW}} after you order (US, tracked). Your card statement will show {{STATEMENT_DESCRIPTOR}}.
- **Custom field, optional, text, only while `claims.sizes` is off:** label "Your height (for sizing)", placeholder "e.g. 5 ft 9 in"
- **Terms consent:** Stripe's own checkbox, linking to the Terms section of `policies.md`.

> **Editor:** Stripe settings (shipping address US only, phone, Radar, receipts, tax) are listed in `../compliance.md` §6. Check that the button text still fits Stripe's custom-text limit once the tokens are filled in.

---

## Image alt text and file names (for when real photos exist)

- **Alt text pattern:** "{{PRODUCT_NAME}} in {{COLOR}}, {{VIEW}}", where `{{VIEW}}` describes only what is visible, for example "front view, hood up", "back view", "close-up of the inside of the hood", "folded on a couch".
- **File name pattern:** `{{BRAND_SLUG}}-cloak-{{COLOR_SLUG}}-{{VIEW_SLUG}}.jpg`, for example `-front-hood-up`.

> **Editor:** Alt text and file names go through the banned-phrase check too. Don't describe weight, lining or fabric in alt text unless that claim's flag is on. Every image needs a line in the image source log (`../compliance.md` §7). Only adults appear in photos, and there is a signed release for anyone recognizable.
