# Customer Service SOP — AI-First, Dispute-Proof

**Goal:** every customer message answered in under 24h (target: under 4h), dispute rate held under 0.4%, owner time ≈ 0. Customer service is not a cost center here — it is the firewall protecting the Stripe account and marketplace ratings that the whole machine depends on.

## Operating model

1. **Tier 0 — Automated (AI agent, daily run):** The scheduled ops agent reads new messages (marketplace inboxes forwarded to Gmail + store contact form) and drafts replies using the template library below. Low-risk categories are sent; anything matching an escalation trigger is left as a Gmail draft flagged `NEEDS-HUMAN`.
2. **Tier 1 — VA (once volume > ~10 msgs/day):** VA works the same template library, empowered to refund up to $50 without approval. See `va-hiring-guide.md`.
3. **Tier 2 — Owner:** only legal threats, chargebacks over $100, and platform policy notices.

**Auto-send is allowed for:** order status, tracking requests, digital download help, sizing/product questions answered from the listing, "where is my order" within the promised window.
**Draft-only (human/VA approves) for:** refunds over $50, angry/legal language, chargeback notices, anything about allergies/injury/safety, press/influencer inquiries, platform policy messages.

## Standing powers (encoded into the AI agent's instructions)

- Refund or replace **without asking** anything ≤ $50 where the customer has a colorable complaint. Log it in the tracker with reason code.
- Never argue with a customer over ≤ $50. The math: a $25 refund costs $25 once; a chargeback costs $15 + the item + dispute-rate damage to the whole business.
- Never promise dates better than the supplier's current quoted window.
- Only state facts from the listing/supplier data — no improvising product claims (lesson imported from the FB autoresponder project's guardrails).

## Template library

Use these as bases; personalize name/order details; keep the warm-but-brief tone.

### T1 — Order status (in window)
> Hi {name}! Your order is in production/transit and on track — the current estimate is delivery by {date}. Tracking: {link}. Anything else you need, just reply here.

### T2 — Order delayed (past promised date) — FTC-compliant delay notice
> Hi {name}, I'm sorry — your order is running behind our promised date. New estimated delivery: {new_date}. Two options, your choice: (1) we add a {10–15%} refund for the wait and it stays on the way, or (2) full refund right now, no questions. Just reply 1 or 2. Either way, sorry for the delay.

*(This is the "delays become discounts/refunds" validation strategy done legally: notify + option to cancel.)*

### T3 — Damaged / wrong / poor-quality item (POD & dropship)
> Hi {name}, that's not okay and it's on us. Reply with a quick photo of what arrived and I'll have a free replacement in production the same day — no need to ship anything back. If you'd rather have a full refund instead, say the word.

*(Photo → file supplier reprint/refund claim: Printful/Printify replace defects free with photo evidence within 30 days. Keep-it refunds on low-cost items: return shipping is never worth it under ~$30.)*

### T4 — Digital product: download trouble
> Hi {name}! Here's a direct fresh download link: {link}. On Etsy, files also live under You > Purchases > Download Files (the email link sometimes expires). If the file won't open, tell me what device/app you're using and I'll get you a working version today.

### T5 — Refund request (no defect, buyer's remorse)
> Hi {name}, done — refund issued, you'll see it in 5–10 business days. If there was anything about the product that missed the mark, I'd genuinely love to know so we can fix it.

*(≤$50: just do it. >$50 physical: offer prepaid return OR 50% keep-it refund, VA/owner call.)*

### T6 — "Is this a scam / where's my stuff" (pre-dispute defusal — highest priority category)
> Hi {name}, totally fair question and I'm a real person who will fix this right now. Here's exactly where your order is: {status + tracking}. If it doesn't arrive by {date}, I'll refund you in full immediately — you have my word. You'll never need to file anything with your bank; I'm faster.

### T7 — Chargeback received (Stripe/PayPal) — evidence checklist, human reviews before submit
Respond via processor portal with: (1) order + timestamps, (2) IP/device match, (3) tracking + delivery confirmation, (4) the listing's stated delivery window, (5) all customer correspondence, (6) refund policy shown at checkout. **Simultaneously** message the customer: full refund offered if they withdraw the dispute (withdrawal beats winning — the filed dispute counts against rate either way, but goodwill reduces repeats). If tracking shows delivered + no prior complaint → fight it; otherwise refund-and-move-on.

### T8 — Review request (post-delivery +3 days, automated)
> Hi {name}! Hope {product} landed well. If you've got 20 seconds, a review would mean a lot to a small shop like ours: {review_link}. If anything's less than great — reply here first and I'll make it right before you do anything else. 🙂

*(Never incentivize reviews. The "reply here first" line legitimately intercepts bad reviews.)*

## Metrics (tracked weekly, see tracker)

| Metric | Green | Yellow | Red (act) |
|---|---|---|---|
| Median response time | <4h | <24h | >24h |
| Dispute rate (rolling 30d) | <0.2% | <0.4% | ≥0.4% → tripwire (see compliance doc §4) |
| Refund rate | <3% | <6% | >6% → product/supplier problem, investigate |
| Etsy/eBay rating | ≥4.8 | ≥4.6 | <4.6 → listing accuracy audit |
