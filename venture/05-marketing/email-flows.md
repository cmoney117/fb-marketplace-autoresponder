# Email Templates — Delivery + Flows (paste into MailerLite at store launch; delivery handled by ops agent until then)

## Order delivery emails (sent by the daily ops agent on each Stripe order until webhook automation lands)

**Subject:** Your {Product Name} is here — download inside 🎉
> Hi {first_name}! Thanks for your order — here's everything: {download_links}
> Two tips: ① In Google Sheets: Drive → New → File upload → open with Sheets. All formulas work instantly. ② Start on the "START HERE" tab — you'll only ever touch the yellow cells.
> Lost this email someday? Just reply — we resend forever. Anything not working? Reply and a human fixes it today. — Willow & Pine Studio

*(Bundle version lists all 3 tools + bump if purchased. Every delivery email doubles as chargeback evidence: order ID, delivery timestamp, links.)*

## Welcome flow (3 emails — trigger: freebie signup, i.e., the No-Spend Month page)
1. **Instant — deliver the freebie.** "Here's your No-Spend Month tracker" + one honest paragraph on how we use it + soft mention the full pack exists.
2. **+2 days — the useful one.** "The 10-minute paycheck reset" — a genuinely complete mini-guide to zero-based budgeting by paycheck (no purchase required to benefit) + bundle link at the end.
3. **+5 days — the offer.** Straight pitch: Money Reset Bundle, what's inside, guarantee, $29.99. One email, no fake urgency.

## Abandoned cart flow (3 emails — trigger: checkout started, no purchase; requires MailerLite + Stripe wiring at launch)
1. **+1 hour:** "Left something behind?" — link back, restate the guarantee (the #1 unsticker for a no-name shop).
2. **+24 hours:** answer the 3 real objections (Do I need Excel? What exactly do I get? What if it's not for me?) — pure FAQ, no discount.
3. **+72 hours:** final note + **10% code SAVE10** (single, honest discount — benchmarks say most recovered revenue comes from email 1; the code closes fence-sitters without training discount-waiting).

**Rules:** no purchased lists ever; unsubscribe honored instantly; no daily blasts — flows only, plus ≤2 campaigns/month once the list exists (new products, seasonal). Benchmarks and revenue-per-recipient data: `02-research/04-marketing-and-traffic.md` §1.6.
