# Policies: {{BRAND_NAME}}

> **Editor:** Draft v1, written 2026-10-15. This is not legal advice, and nobody involved is a lawyer. Cody reviews it before launch. Lines that start with "Editor:" are internal. Tokens and gates work as described at the top of `product-page.md`, and every promise here is listed with its source in `claims-register.md` (section "Commitments"). Sections in order: Shipping, Returns and refunds, Contact, Privacy, Terms of sale. The task asked for the first four. Terms is added because Stripe's terms-consent checkbox and the TikTok landing-page rules need a terms page (`../compliance.md` §3 and §6).

> **Editor:** The delivery windows come from config only (`SHIP_WINDOW`, `ARRIVAL_WINDOW`). They already include the house padding of 2 business days. Never type a window by hand. The delay rules below follow the FTC Mail Order Rule (`../compliance.md` §2). If you edit them, keep the three cases (30 days or less, more than 30 days or unknown, second delay) and the refund timing.

---

## Shipping

**Where we ship:** US addresses only.{{#if config.ship_restrictions}} {{SHIP_RESTRICTIONS}}{{/if}}

**Cost:** Free on every order.

**When it ships:** within {{SHIP_WINDOW}} of your order.

**When it arrives:** {{ARRIVAL_WINDOW}} after you order, with tracking.

Business days are Monday to Friday, not counting US federal holidays. If you order on a weekend or holiday, the count starts on the next business day. Your order confirmation email gives your ship-by date and arrival dates as calendar dates.

**Who ships it:** We're a small shop and we don't hold stock ourselves. When you order, we place your order with our fulfillment partner, who packs and ships it{{#if claims.ships_from_us}} from a warehouse in the US{{VERIFY:claims.ships_from_us}}{{/if}}. It may arrive in our partner's packaging, not a {{BRAND_NAME}} box, and the sender name on the label may be theirs.

**Tracking:** When your order ships, we email you the carrier and a tracking link.

{{#if claims.ships_from_us}}{{#if config.holiday_cutoff_active}}**Holiday orders:** To have it by {{HOLIDAY_ARRIVE_BY}}, order by {{HOLIDAY_ORDER_BY}}. Orders placed after that may not arrive before December 25.{{VERIFY:claims.ships_from_us}}{{/if}}{{/if}}

{{#if config.stripe_tax}}**Sales tax:** Our prices don't include sales tax. Where we're required to collect it (right now, Tennessee addresses), it's added at checkout.{{/if}}

{{#if claims.ships_from_us}}{{else}}{{#if config.import_charges_prepaid}}**Import charges:** Your order ships from outside the US. Any import charges are paid before it ships, so you won't be asked to pay anything on delivery.{{/if}}{{/if}}

### If your order is running late

If we learn your order won't ship by the ship-by date in your confirmation email, we'll email you **before** that date. The email gives you a new ship date, or tells you we don't know yet and why. It also gives you two choices:

- **Wait for it.** If the new date is no more than 30 days after the original ship-by date, you don't need to do anything. If you don't reply, we'll take that as OK to wait.
- **Cancel for a full refund.** Reply "cancel", or use the link in the email, any time before it ships.

If the new date is more than 30 days after the original ship-by date, or we can't give you a date, we'll keep your order only if you tell us to. If you don't reply, and it still hasn't shipped 30 days after the original ship-by date, we'll cancel it and refund you in full.

If the order is delayed a second time, we'll email you again before the new date passes. This time we'll keep your order only if you reply to say yes. If you don't, we'll cancel it and refund you in full.

### Canceling

Email us any time before your order ships, and we'll cancel it and refund you in full. Once it has shipped, use our returns process below.

### If we can't fill your order

If our partner runs out or cancels your order, we'll tell you the same business day we find out. We'll either refund you in full straight away or, if you'd rather wait, give you a definite new date along with the option to cancel.

### Wrong address

Please check your shipping address at checkout. If it's wrong, email us right away. We can usually fix it before we place the order with our partner, but not after it ships.

### Lost, stuck or damaged parcels

If your order hasn't arrived by the last day of your delivery window, or tracking hasn't moved for 3 business days, email us. We'll chase it with the carrier. If it doesn't turn up within 3 business days of your email, we'll send a replacement or refund you in full, whichever you prefer.

If tracking says delivered but you can't find it, check around your door and with your neighbors, then email us. We'll open a claim with the carrier and work it out with you.

If it arrives damaged, email us a photo. See "If something's wrong" below.

### Refund timing

We send refunds to your original payment method within 1 business day of canceling your order or receiving your return. Your bank may take 5-10 business days to show it.

> **Editor:** Internal triggers that make this section true (details in `emails.md`): no supplier tracking by the end of business day 3 → send the delay notice that day. Refunds always go through Stripe, never outside it. The legal limit for card refunds on a canceled order is 7 working days, and our house target is 1 business day. `SHIP_RESTRICTIONS` (`delivery.ship_restrictions` in config) limits shipping to the contiguous US, because the delivery windows have no basis for Alaska, Hawaii, PO boxes or APO/FPO addresses yet. Widen it only for what the supplier confirms in writing. Stripe can only limit the country, so an order to an excluded address is contacted the same day and refunded if it can't be served. The import-charges paragraph shows only in the China-direct case, and only if Cody confirms the supplier collects those charges at checkout. Paid ads never run in that case (`../economics.md` §7).

---

## Returns and refunds

You have **30 days from delivery** to decide.

### If something's wrong

If it arrived damaged or faulty, it's the wrong item, or it isn't as described, email us a photo within 30 days of delivery. We'll refund you in full or send a replacement, whichever you prefer. You don't need to send it back.

### If the size is wrong

Email us within 30 days of delivery with your order number and your height. We'll email you a prepaid return label and send the new size as soon as the carrier scans your return. That's free, once per order. If the size you need isn't available, we'll refund you in full once your return is on its way.

### If you've changed your mind

Send it back within 30 days of delivery, unworn and unwashed, with any tags it came with. Trying it on at home is fine. For this kind of return, you pay the return postage. We suggest a tracked service, because we can't refund a parcel that never reaches us. We refund the full amount you paid within 1 business day of it arriving. Shipping was free, so nothing is taken off, and there's no restocking fee.

### Where returns go

Returns come to us in Nashville. Please don't use the return address printed on the package. That address belongs to our fulfillment partner, and returns sent there don't reach us.

Email {{SUPPORT_EMAIL}} before you send anything, so we can match your return to your order. Put a note with your order number inside the package, and send it to:

{{BRAND_NAME}} Returns
159 4th Ave N, Ste 100 #2179
Nashville, TN 37219
USA

### Returns that come back used

If a return arrives worn, washed or damaged, or smelling of smoke or pets, we'll email you photos. Then we'll offer you either a partial refund or to send it back to you at our cost.

### How refunds are paid

Every refund goes back to your original payment method through our payment processor. Your bank may take 5-10 business days to show it.

### Before you contact your bank

If anything about your order is wrong, please email us first. We reply within 1 business day, and we can usually sort it out faster than a bank dispute can.

> **Editor:** The free size swap, the "send a replacement or refund after 3 business days" rule for lost parcels, and the used-return handling are new commitments in this draft. They need Cody's OK (`claims-register.md`, Commitments C6, C11, C16). Before launch, confirm that the Ste 100 #2179 mailbox accepts and holds parcels of about 5 lb from USPS, UPS and FedEx (C7). Returned units stay with Cody. They can be used for photos and video, or offered later as open-box, but never resent as new.

---

## Contact

**Email:** {{SUPPORT_EMAIL}}. We reply within 1 business day, Monday to Friday. For anything about an order, please include your order number.

**Business:** {{LEGAL_BUSINESS_NAME}}{{#if config.dba}}, trading as {{BRAND_NAME}}{{/if}}

**Mailing address (post and returns only, no visits):**
159 4th Ave N, Ste 100 #2179
Nashville, TN 37219
USA

All prices are in US dollars.

> **Editor:** Turn on `config.dba` only if the legal business name differs from the brand name. Fill in `LEGAL_BUSINESS_NAME` with whatever Cody's business is legally called (an LLC name, or Cody's own name for a sole proprietorship). A trade name may need registering. See the Davidson County Clerk item in `claims-register.md`.

---

<!-- LEGAL:START (privacy and terms are legal pages: reported, not blocked, by the banned-phrase check) -->

## Privacy

*Last updated {{POLICY_DATE}}.*

This note explains what {{LEGAL_BUSINESS_NAME}} ("{{BRAND_NAME}}", "we") collects when you visit or buy, and what we do with it.

**What we collect when you order:** your name, email address, phone number and shipping address; the item, size and color you chose{{#if config.height_field}}; the height you give us for sizing{{/if}}; and your payment details. Card details are handled by Stripe, our payment processor. We never see or store your full card number.

**What we collect when you browse:** basic visit information, such as the pages you view and your browser and device type{{#if config.pixel}}. We also use the Meta Pixel, which sends Meta information about your visit and any purchase so we can measure our ads on Facebook and Instagram{{/if}}.

**How we use it:** to fulfill and deliver your order, send you order emails, answer your questions, handle returns, refunds and disputes, prevent fraud, and keep the tax and business records the law requires{{#if config.pixel}}, and to measure our ads{{/if}}.

**Who we share it with:**
- **Fulfillment partners and delivery carriers** get your name, shipping address and phone number so they can pack and deliver your order.
- **Stripe** processes your payment and screens for fraud.
- {{#if config.email_provider}}**{{EMAIL_PROVIDER}}** sends our order emails, and any marketing emails you've opted into.{{/if}}
- **Vercel** hosts this website, so it handles basic visit logs.
- **Google Fonts** supplies the typefaces on this site, so your browser requests them from Google, which receives your IP address and browser details.
- {{#if config.pixel}}**Meta** receives visit and purchase information through the Meta Pixel, as described above.{{/if}}
- **Authorities**, when the law requires it.

We don't sell your personal information.

**Marketing emails:** only if you opt in. Every one has an unsubscribe link. Order emails (confirmation, shipping, delays, delivery) are part of your order and are sent either way.

**Cookies:** Stripe uses cookies at checkout to prevent fraud.{{#if config.pixel}} The Meta Pixel uses cookies to measure ads. You can manage the ads you see in your Facebook or Instagram ad preferences.{{/if}} You can block cookies in your browser, but checkout won't work without Stripe's.

**How long we keep it:** order records are kept as long as tax, accounting and payment-dispute rules require. Other information is deleted when we no longer need it.

**Your choices:** email {{SUPPORT_EMAIL}} to see, correct or delete the information we hold about you. We'll keep only what the law requires us to keep, such as tax records.

**Age:** this shop is for adults. We don't knowingly collect information from anyone under 18.

**Changes:** when this note changes, we update the date at the top.

> **Editor:** Turn on only the tool lines that are really in use at launch (`config.email_provider` with `EMAIL_PROVIDER` = "MailerLite"; `config.pixel` once the Meta Pixel is installed; `config.height_field` while the checkout height field exists). If another analytics tool is added (for example Vercel Web Analytics or Google Analytics), add a line for it before it goes live. Cody should check that nothing here conflicts with what Stripe, MailerLite and Meta each require a privacy policy to say.

---

## Terms of sale

*Last updated {{POLICY_DATE}}.*

**Who you're buying from:** {{LEGAL_BUSINESS_NAME}}{{#if config.dba}}, trading as {{BRAND_NAME}}{{/if}}, 159 4th Ave N, Ste 100 #2179, Nashville, TN 37219, USA. Email: {{SUPPORT_EMAIL}}.

**Who can order:** you must be 18 or older to place an order.

**Prices:** all prices are in US dollars and include US shipping.{{#if config.stripe_tax}} Sales tax is added at checkout where we're required to collect it.{{/if}} The price at checkout is the price you pay. We may change prices for future orders, but a change never affects an order you've already placed.

**Your order:** we accept your order when we send the order confirmation email. We may cancel an order, for example if the item is unavailable, a price was clearly shown in error, or a payment looks fraudulent. If we do, we refund you in full.

**What we describe:** we describe only what we've checked on our own sample. Colors can look a little different on screen. Weights and measurements are approximate and can vary slightly from one piece to the next.

**Shipping, delays, returns and refunds:** see our Shipping and Returns and refunds policies above. They are part of these terms.

**Using it:** this is an adult garment. Please follow the Safety notes on the product page and the care label.

**Our responsibility:** as far as the law allows, our total responsibility for any order is limited to the amount you paid for it. Nothing in these terms limits any right you have under consumer protection law.

**Governing law:** these terms are governed by the laws of the State of Tennessee, USA.

**Questions:** email {{SUPPORT_EMAIL}}.

> **Editor:** The terms are short on purpose, and they are a draft for Cody (or a lawyer) to review. "18 or older to order" matches the adult-only rule for this product. If Cody would rather not require it, remove that line, but keep adults-only targeting and the Safety notes.

<!-- LEGAL:END -->
