# Order emails: {{BRAND_NAME}}

> **Editor:** Draft v1, written 2026-10-15. These are transactional emails, one set per order. Lines that start with "Editor:" are internal. Tokens and gates work as described at the top of `product-page.md`. Sources for every promise are in `claims-register.md`. Every email ends with the shared footer below. Use plain text or very light HTML: no countdowns, no product upsells, no discount codes.

> **Editor:** Token values come only from `../../../hoodie-store/config.json`. `claims-register.md` section E maps each token and flag to its key. Never fill a token from memory or from an older draft, and never send an email while a token it needs is empty there (for example `stripe.statement_descriptor`).

> **Editor:** For this product, 3a-3d replace house template T2 (`../../04-operations/customer-service-sop.md`). T2 now also fires before the ship-by date, but 3a-3d carry the exact wording for each case. The FTC Mail Order Rule needs the notice **before** the promised ship-by date (`../compliance.md` §2). The rest of the house SOP still applies (response times, refund powers, chargeback steps).

---

## When each email goes out

| # | Email | Trigger | Who sends |
|---|---|---|---|
| 1 | Order confirmation | Right after payment (Stripe checkout completed) | Automated or Cody, within 1 hour |
| 2 | Shipped | Within 24 hours of the supplier showing a tracking number | Cody or automation |
| 3a | Delay notice: new date 30 days or less late | End of business day 3 with no tracking, or any earlier moment we learn it will miss the ship-by date. Always before `{{SHIP_BY_DATE}}` passes | Cody (never skipped) |
| 3b | Delay notice: new date more than 30 days late, or unknown | Same trigger as 3a | Cody |
| 3c | Second delay | Before `{{REVISED_SHIP_DATE}}` passes, when the order will miss it | Cody |
| 3d | Can't fill: refunded | The same business day the supplier cancels or runs out, if no new date is offered | Cody |
| 4 | Delivered + care tips | 1-2 days after tracking shows delivered | Automated or Cody |
| 5 | Review request | 7 days after delivery, to **every** delivered order. If the customer has an open problem, wait until it's closed, then send | Automated or Cody |

> **Editor:** How the dates are worked out. Business days are Monday to Friday, not counting US federal holidays.
> - Day 0 is the order date if it is a business day. Otherwise it is the next business day.
> - `SHIP_BY_DATE` = business day 4. `ARRIVE_FROM_DATE` = business day 5. `ARRIVE_BY_DATE` = business day 11. These match "Ships in 1-4 business days. Arrives 5-11 business days after you order", which already includes the padding of 2 business days. If the config windows change, these offsets change with them.
> - `REVISED_ARRIVE_BY_DATE` = `REVISED_SHIP_DATE` + 7 business days (the same gap as the original promise).
> - `ORIGINAL_PLUS_30_DATE` = `SHIP_BY_DATE` + 30 calendar days.
> - Check: an order on Fri 4 Dec 2026 gives ship-by Thu 10 Dec and arrive-by Mon 21 Dec. That leaves 2 business days of slack before the Wed 23 Dec holiday promise.
>
> Keep every sent email in the order's dispute file (`../compliance.md` §6). Stripe's own receipt and refund emails stay switched on; they don't replace these.

### Shared footer (all emails)

{{BRAND_NAME}} · {{LEGAL_BUSINESS_NAME}} · 159 4th Ave N, Ste 100 #2179, Nashville, TN 37219 · {{SUPPORT_EMAIL}}
You're getting this email because you placed an order with us.

---

## 1. Order confirmation

**Subject:** Order {{ORDER_ID}} confirmed: your {{PRODUCT_NAME}}
**Preview text:** Ships by {{SHIP_BY_DATE}}. Arrives {{ARRIVE_FROM_DATE}} to {{ARRIVE_BY_DATE}}.

Hi {{FIRST_NAME}},

Thanks for your order. Here's everything in one place.

**Your order ({{ORDER_ID}}, placed {{ORDER_DATE}})**
- {{PRODUCT_NAME}}, size {{SIZE}}, {{COLOR}}
- Paid: {{AMOUNT_PAID}}, with free US shipping{{#if order.tax}} (includes {{TAX_AMOUNT}} sales tax){{/if}}
- Shipping to: {{SHIPPING_ADDRESS}}
{{#if order.height}}- Your height: {{CUSTOMER_HEIGHT}}. We'll check it against the size chart before we place your order. If another size looks like a better fit, we'll email you. If we haven't heard back by the end of the next business day, we'll send the size you picked.{{/if}}

**When it will arrive**
- Ships by: **{{SHIP_BY_DATE}}**
- Arrives: **between {{ARRIVE_FROM_DATE}} and {{ARRIVE_BY_DATE}}**, tracked

We'll email your tracking link as soon as it ships. It ships from our fulfillment partner, so it may arrive in their packaging. If it's going to be late, we'll email you before {{SHIP_BY_DATE}} with a new date and the option to cancel for a full refund.

**On your card statement**
The charge will show as **{{STATEMENT_DESCRIPTOR}}**.

**Changed your mind?**
You can cancel any time before it ships for a full refund: just reply to this email. After it's delivered, you have 30 days to return it. If the size is wrong, we'll swap it once for free. Full details: {{RETURNS_URL}}

**Anything wrong? Please reply to this email before contacting your bank.**
We reply within 1 business day, and we fix or refund quickly. You can also write to {{SUPPORT_EMAIL}}.

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

Thanks again,
{{SENDER_NAME}}, {{BRAND_NAME}}

> **Editor:** `STATEMENT_DESCRIPTOR` must match exactly what Stripe will print: `HUNKERHOOD.COM` on a separate account, or `{EXISTINGPREFIX}* HUNKERHOOD` if the existing account is reused and the suffix is confirmed to work on Payment Links (`../compliance.md` §6). If that can't be confirmed, write the existing account's real descriptor here. Never send the email with a descriptor we haven't seen on a real test charge. `RETURNS_URL` links to the Returns and refunds section of the policies page.

---

## 2. Shipped, with tracking

**Subject:** Your {{PRODUCT_NAME}} is on its way
**Preview text:** Tracking inside. Arriving by {{ARRIVE_BY_DATE}}.

Hi {{FIRST_NAME}},

Good news: order {{ORDER_ID}} has shipped.

- **Carrier:** {{CARRIER}}
- **Tracking:** {{TRACKING_URL}} (number {{TRACKING_NUMBER}})
- **Arrives:** between {{ARRIVE_FROM_DATE}} and {{ARRIVE_BY_DATE}}

**About the package:** it ships from our fulfillment partner, so it may arrive in their packaging, not a {{BRAND_NAME}} box. The sender name on the label may be theirs too. That's normal, and it's your order.

**About returns:** if you ever need to send it back, email us first. Please don't use the return address on the package. It belongs to our partner, and returns sent there don't reach us.

Questions? Just reply.

{{SENDER_NAME}}, {{BRAND_NAME}}

> **Editor:** If the tracking shows a different carrier from the one the supplier named, use the one in the tracking. Check that the tracking's destination town and ZIP match the customer's address before sending. If they don't, contact the supplier that day.

---

## 3a. Delay notice: new ship date 30 days or less after the original

**Subject:** Order {{ORDER_ID}} is running late. Your choice.
**Preview text:** New ship date {{REVISED_SHIP_DATE}}, or a full refund. Up to you.

Hi {{FIRST_NAME}},

Your {{PRODUCT_NAME}} hasn't shipped yet, and it won't ship by {{SHIP_BY_DATE}}, the date we gave you.{{#if order.delay_reason}} {{DELAY_REASON}}{{/if}} Our fulfillment partner now expects to ship it by **{{REVISED_SHIP_DATE}}**, so it should arrive by {{REVISED_ARRIVE_BY_DATE}}.

You have two choices:

1. **Keep your order:** do nothing. If we don't hear from you before {{REVISED_SHIP_DATE}}, we'll take that as OK to wait.{{#if config.delay_credit}} If you keep it, we'll also refund {{DELAY_CREDIT}} of what you paid, for the wait.{{/if}}
2. **Cancel for a full refund:** reply "cancel" or use {{CANCEL_LINK}} any time before it ships. We'll refund the full {{AMOUNT_PAID}} to your card within 1 business day.

Sorry for the wait.

{{SENDER_NAME}}, {{BRAND_NAME}} · {{SUPPORT_EMAIL}}

> **Editor:** Use 3a only when `REVISED_SHIP_DATE` is no more than 30 calendar days after `SHIP_BY_DATE`. The revised date has to be one we can back up: get it from the supplier in writing (screenshot it into the dispute file). `DELAY_REASON` is one short, honest sentence, for example "Our partner ran short of your size and is restocking." `config.delay_credit` is optional. If it's used, `DELAY_CREDIT` is a fixed dollar amount (for example "$10"), refunded through Stripe.

---

## 3b. Delay notice: new ship date more than 30 days after the original, or unknown

**Subject:** Order {{ORDER_ID}} is delayed. Please tell us what you'd like.
**Preview text:** Reply "keep it" or "cancel". If we don't hear from you, we'll refund you.

Hi {{FIRST_NAME}},

Your {{PRODUCT_NAME}} hasn't shipped yet, and it won't ship by {{SHIP_BY_DATE}}, the date we gave you. {{#if order.revised_date_known}}Our fulfillment partner now expects to ship it by **{{REVISED_SHIP_DATE}}**, so it should arrive by {{REVISED_ARRIVE_BY_DATE}}.{{else}}We don't know yet when it will ship. {{DELAY_REASON}}{{/if}}

You have two choices:

1. **Keep your order:** reply "keep it".
2. **Cancel for a full refund:** reply "cancel" or use {{CANCEL_LINK}}. We'll refund the full {{AMOUNT_PAID}} to your card within 1 business day.

If we don't hear from you, and it still hasn't shipped by {{ORIGINAL_PLUS_30_DATE}}, we'll cancel your order and refund you in full automatically.

Sorry about this.

{{SENDER_NAME}}, {{BRAND_NAME}} · {{SUPPORT_EMAIL}}

> **Editor:** When the date is unknown, `DELAY_REASON` is required, because the rule asks us to explain why. Record the customer's reply in the dispute file. On `ORIGINAL_PLUS_30_DATE`, if there is no "keep it" and it hasn't shipped, refund through Stripe that day and send 3d.

---

## 3c. Second delay

**Subject:** Order {{ORDER_ID}} is delayed again. We need your OK to keep it.
**Preview text:** Reply "keep it" by {{REVISED_SHIP_DATE}}, or we'll refund you in full.

Hi {{FIRST_NAME}},

I'm sorry. Your {{PRODUCT_NAME}} is late again, and it won't ship by {{REVISED_SHIP_DATE}} as we last told you. {{#if order.second_revised_date_known}}Our partner now expects to ship it by **{{SECOND_REVISED_SHIP_DATE}}**, so it should arrive by {{SECOND_REVISED_ARRIVE_BY_DATE}}.{{else}}We don't know yet when it will ship. {{DELAY_REASON}}{{/if}}

Because this is the second delay, we'll keep your order only if you tell us to.

1. **Keep your order:** reply "keep it" before {{REVISED_SHIP_DATE}}.
2. **Cancel for a full refund:** reply "cancel" or use {{CANCEL_LINK}}.

If we don't hear from you by {{REVISED_SHIP_DATE}}, we'll cancel your order and refund the full {{AMOUNT_PAID}} to your card within 1 business day.

{{SENDER_NAME}}, {{BRAND_NAME}} · {{SUPPORT_EMAIL}}

> **Editor:** After a second delay, silence means cancel. No "keep it" by `REVISED_SHIP_DATE` → refund that day, send 3d, and cancel the supplier order. Two late orders in the test is an ops tripwire that stops ads (`../economics.md` §8).

---

## 3d. Can't fill: refunded

**Subject:** Order {{ORDER_ID}}: we've refunded you in full
**Preview text:** {{AMOUNT_PAID}} is on its way back to your card.

Hi {{FIRST_NAME}},

I'm sorry: we can't fill your order for the {{PRODUCT_NAME}} in size {{SIZE}}, {{COLOR}}.{{#if order.delay_reason}} {{DELAY_REASON}}{{/if}}

We've refunded the full {{AMOUNT_PAID}} to your card today. Your bank may take 5-10 business days to show it.

If you'd still like one in a different size or color, reply and we'll tell you what's available.

{{SENDER_NAME}}, {{BRAND_NAME}} · {{SUPPORT_EMAIL}}

---

## 4. Delivered, with care tips

**Subject:** How does it fit?
**Preview text:** Care tips, plus what to do if the size isn't right.

Hi {{FIRST_NAME}},

Tracking says your {{PRODUCT_NAME}} has arrived. We hope it's already on.

**How does it fit?** If it's too long or too short, reply with your height within 30 days of delivery, and we'll swap it for the right size, free, once per order. If it's not for you at all, you have 30 days to send it back. Please email us first so we can give you the return details.

**Not there?** If tracking says delivered but you can't find it, check around your door and with your neighbors, then reply to this email. We'll sort it out with you.

**Looking after it**
{{#if claims.care}}- {{CARE_INSTRUCTIONS}}{{VERIFY:claims.care}}{{else}}- Check the care label sewn inside before you wash it.{{/if}}
- Let it dry all the way through before you wear it or put it away.
- Keep it away from open flames, candles and heaters.
- Keep your face clear, and don't sleep with the hood pulled over your face.

Anything else, just reply.

{{SENDER_NAME}}, {{BRAND_NAME}}

---

## 5. Review request

**Subject:** Would you review your {{PRODUCT_NAME}}?
**Preview text:** Good, bad or in between. Two minutes, no strings.

Hi {{FIRST_NAME}},

You've had your {{PRODUCT_NAME}} for about a week. Would you tell other people what you think of it?

{{REVIEW_LINK}}

Good, bad or in between, we want the honest version. We ask everyone who orders, we don't give anything in return for a review, and we post every genuine review, critical ones included.

If something is wrong with your order, reply here too and we'll fix it. That's separate from your review, and you're welcome to do both.

Thanks,
{{SENDER_NAME}}, {{BRAND_NAME}}

> **Editor:** Rules from the FTC Consumer Review Rule (`../compliance.md` §4): no discount, credit, gift or entry into a draw for a review, during the test or after. Send to every delivered order, not only to people who seem happy. Never ask for a positive review, and never ask someone to change or remove a review. Post every genuine review on the page. Hold back only spam, abuse or personal details, and keep a log of anything held back and why. Cody, staff and family don't review, or they say who they are in the review. `REVIEW_LINK` is a simple form we control (name or initials, rating, text, optional photo, and a checkbox giving permission to publish). Don't send this email to anyone who has asked us to stop emailing them.
