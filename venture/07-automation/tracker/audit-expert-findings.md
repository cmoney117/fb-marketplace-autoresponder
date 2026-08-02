# Expert CRO/Ops Audit — 2026-08-02 (pre-launch)

Scope: store generator + generated site, receptionist landing, Etsy listing packages, "EverAnswer" trademark sanity screen. Compliance doc §7 applied throughout (no fake proof/scarcity/testimonials). Fixes already applied are listed at the bottom; everything above is **remaining work, ranked by expected conversion/revenue impact**.

---

## P0 — Launch blockers (fix before a dollar of spend or a single listing)

### 1. "EverAnswer" name conflicts with an operating competitor — rename before any public promotion
**Screen result (2026-08-02):**
- **Direct conflict: "Ever Answer AI" — everanswerai.com.** An existing company selling *AI phone agents for businesses*: 24/7 answering, urgent-call flagging, appointment booking, CRM integration — near-identical service, same buyer. Name differs from ours only by a space and "AI".
- **Adjacent: "EveryAnswer" — everyanswer.ai** (AI Q&A/support agents platform). Second confusion vector.
- USPTO TESS direct query was blocked by the sandbox proxy (tmsearch API 403); web/aggregator search surfaced **no registered "EVER ANSWER" wordmark**, but that is *not* clearance: Ever Answer AI has common-law rights in exactly our category, owns the .com, and owns the SERP. Even if we could register, we'd be building SEO for their brand and inviting a confusion claim.

**Verdict: do not launch, advertise, or cold-email under "EverAnswer."** The demo agent, Jotform, and landing page are unaffected mechanically — the name appears only in: `receptionist/index.html` (title, meta, header, hero, FAQ, footer), the agent greeting, and the Jotform title. A rename is a ~15-minute swap.
**Candidate names to screen next (each needs its own USPTO + web + domain screen before adoption; none screened yet):** RingSteady · FirstRing Desk · NightDesk · AnswerCrew · CallTended. Owner picks; log the screen in the decision log per standing rule #2. Decision-log row 25 records this screen.

### 2. Paycheck-budget Etsy listing will be rejected as written (title 141 chars; 4 tags over Etsy's 20-char limit)
File: `venture/07-automation/tracker/publish-queue/paycheck-budget-v1/listing.md`
- Title is **141 chars** (Etsy max 140).
- Tags over the 20-char cap: `budget template excel` (21) · `debt snowball tracker` (21) · `budget planner digital` (22) · `weekly budget planner` (21). Etsy's form will refuse them; a VA pasting "as-is" stalls.

**Exact patch — replace title with (131 chars):**
`Paycheck Budget Spreadsheet, Zero Based Budget Template, Google Sheets Excel Budget Planner, Biweekly Budget, Debt Snowball Tracker`
**Replace the 4 overlong tags with:** `excel budget` · `debt snowball` · `budget planner` · `weekly budget` (all ≤20; keeps the same 13-tag count and keyword coverage; top phrase "paycheck budget" still repeated title+tag per §1.1 practice).

### 3. Two of four products have no listing package at all
`debt-payoff-planner-v1/` and `savings-goal-tracker-v1/` contain only the xlsx + cover — **no listing.md**. They can't be published to Etsy/Gumroad, which blocks the "3 singles + bundle" catalog logic and the store's cross-sell story. Paste-ready drafts (titles/tags length-verified ≤140/≤20):

**debt-payoff-planner-v1/listing.md** — Price $14.99 · Qty 999 · Digital download
- Title (130): `Debt Snowball Spreadsheet, Debt Payoff Planner Google Sheets Excel, Debt Avalanche Calculator, Debt Free Tracker, Digital Download`
- Tags (13): `debt snowball` · `debt payoff planner` · `debt payoff tracker` · `debt avalanche` · `debt free tracker` · `debt spreadsheet` · `credit card payoff` · `loan payoff tracker` · `debt free journey` · `budget spreadsheet` · `money tracker` · `payoff calculator` · `digital download`
- Description: reuse the store page copy (headline/sub/bullets from `store/build_store.py`) + the standard WORKS WITH / HOW IT WORKS blocks + the guarantee paragraph + AI-disclosure line from paycheck listing, verbatim. Include the "not financial advice" line from the store FAQ.

**savings-goal-tracker-v1/listing.md** — Price $12.99 · Qty 999 · Digital download
- Title (127): `Savings Tracker Spreadsheet, Savings Goal Planner Google Sheets Excel, 52 Week Money Challenge, Sinking Funds, Digital Download`
- Tags (13): `savings tracker` · `savings goal tracker` · `savings planner` · `sinking funds` · `52 week challenge` · `savings challenge` · `emergency fund` · `savings spreadsheet` · `money tracker` · `money saving chart` · `google sheets budget` · `budget spreadsheet` · `digital download`
- Description: same assembly rule as above.

### 4. Stripe Payment Links still `#` / pixel IDs empty — funnel is un-measurable and un-buyable
Known/waiting-on-owner, but restating because every ad dollar before this is wasted: `payment_link` on all 5 products, `support_email`, `ga4_id`, `meta_pixel_id` (now supported in the generator — set the ID and rebuild), and Payment Link "after payment" redirect → `success.html` (Purchase event now fires there when pixel ID set).

---

## P1 — High conversion impact (do before/with first traffic)

### 5. Purchase event carries no value/currency
Meta optimizes markedly better with value. **Patch:** set each Payment Link's redirect to `success.html?p=<slug>`, and in `build_store.py` success page add:
```js
var v={"paycheck-budget":14.99,"debt-payoff-planner":14.99,"savings-goal-tracker":12.99,"savings-challenge-pack":9.99,"money-reset-bundle":29.99};
var p=new URLSearchParams(location.search).get("p");
if(window.fbq&&v[p])fbq('track','Purchase',{value:v[p],currency:'USD'});
```
(and remove the unconditional Purchase call for that variant). Low effort, direct ROAS-optimization payoff.

### 6. No Pinterest tag support, but Pinterest is the primary paid channel ($30/day vs Meta $20/day)
`campaign-build-sheets.md` runs Pinterest on Conversions objective — impossible without the tag. **Patch:** add `"pinterest_tag_id": ""` to CONFIG and a conditional snippet in `page()` mirroring the Meta pixel (base code + `pintrk('track','checkout',{value,currency})` on success).

### 7. No email capture anywhere on the store
`email-flows.md` exists; the savings-challenge pack's No-Spend page is already designated the freebie. Zero-review shops recover a meaningful share of non-buyers only via email. **Patch:** add to `build_store.py` a single-field footer block on all pages + a `free-sample` mini-page: "Get the No-Spend Month tracker free — we'll email it over." (MailerLite embed placeholder `ML_FORM_PLACEHOLDER`, activated with the account). No fake urgency, fully compliant.

### 8. Ad-landing headline congruence can go one step further (hook-matched H1)
Bundle sub now carries all three hook phrases (applied below), but the biggest CRO lever for cold traffic is the H1 mirroring the exact ad clicked. **Patch (small, no new pages):** in `page()` emit on the bundle page only:
```js
var h={"h1-A":"Budget by the paycheck, not the month","h1-B":"Budget by the paycheck, not the month","h2-A":"See your debt-free date","h3-A":"Every dollar gets a job","h3-B":"Every dollar gets a job","h4-A":"3 tools. $29.99. Done."};
var c=new URLSearchParams(location.search).get("utm_content");
if(h[c])document.querySelector(".pd h1").textContent=h[c];
```
Keeps one canonical page, zero extra maintenance.

### 9. Receptionist page: demo is web-widget only — a phone product should be provable by phone
The skeptic's test is "call it." **Patch:** attach a Twilio number to the ElevenLabs agent (~$1–2/mo + usage) and print it under the widget: "Or call the demo line yourself: (XXX) XXX-XXXX." Expected to be the single biggest trust lever on that page. Owner cost approval needed.

### 10. Receptionist founding-rate integrity (compliance §7 adjacency)
"First 5 businesses lock in $149/mo for life" is real today (0 customers) — it becomes fake scarcity the day it isn't. **Action:** track redemptions in the tracker; remove or update the badge at 5. Add a `NEEDS-HUMAN` reminder tied to the 5th signup. Optional strengthener once ≥1 is claimed: show honest remaining count.

### 11. Receptionist page: no path for the not-ready visitor
Only exits are the form or the back button. **Patch:** add below the FAQ: "Not ready? Email us a question: SUPPORT_EMAIL — a human answers." plus (post-rename) a one-field "send me the one-page PDF" capture. Cheap recovery of the 90%+ who won't fill a 10-minute form on visit one.

---

## P2 — Meaningful, not urgent

### 12. Store SEO plumbing: favicon, robots.txt, sitemap.xml, canonical, Product JSON-LD
Generator now emits OG tags (gated on `base_url`). Still missing: favicon (one-line, use the $ glyph on navy), `robots.txt` + `sitemap.xml` (trivial to emit in `build()` once `base_url` is set), `<link rel=canonical>`, and per-product `schema.org/Product` JSON-LD with `offers` (NO `aggregateRating` — zero reviews, §7). All are 20-line additions to `build_store.py`.

### 13. Challenge-pack listing description is a stub
`savings-challenge-pack-v1/listing.md` says "(Same guarantee + AI-disclosure lines as other listings.)" — a VA pasting "as-is" will omit both (the AI disclosure is a suspension trigger per research §1.1). **Patch:** paste the two paragraphs verbatim from `paycheck-budget-v1/listing.md` (the "Please note…" paragraph and the italic AI-disclosure line) into the description text.

### 14. Proof density: one honest proof line available and unused
True and verifiable claim sitting in QA logs: every formula machine-verified before release, with a pre-loaded worked example. **Patch (copy field):** add bullet "Every formula machine-tested before release" to the three spreadsheet products. Also: the paycheck product has `02-whats-inside.png` / `03-how-it-works.png` in its publish-queue folder — adding a second image to its store page (simple `<img>` under the FAQ) is the cheapest "see inside" proof a zero-review shop can offer.

### 15. Bundle price ends $0.01 above the two $14.99 singles
$29.99 vs $29.98 — nobody will do that math consciously, and the false "less than the price of two" line is already removed, but $29.97 would make "cheaper than any two" literally true and ad-quotable. Pricing = owner call; impact small.

### 16. success.html is delivery-blind
It promises an email but can't resend or link. Fine for launch (Payment Link receipts + delivery email cover it). Later: per-product success param (already needed for #5) can also render the direct download link.

---

## Applied in this audit (already committed; `store/site/` regenerated)

**store/build_store.py**
- Removed false claim: bundle "for less than the price of two" ($29.99 > $14.99+$14.99). Now: concrete "Save $12.98 — 30% off the three sold separately" (real math, §7-safe).
- Ad-hook congruence: bundle sub now contains the h1/h2/h3 hook phrases ("every dollar a job… one paycheck at a time… debt-free date… ~10 minutes"); homepage hero rewritten around the paycheck promise (was a generic tagline duplicated twice) + bundle-first gold CTA; "Bundle" added to site-wide nav.
- Proof density: swapped abstract SVG placeholders for the real product-cover PNGs (planned-vs-actual screenshot content) on the 4 products that have them; alt text now descriptive.
- Friction: second buy CTA after the FAQ (mobile users no longer scroll back up); buy buttons full-width on mobile; trust line gains "No account needed"; cross-sell to the bundle added on the three component product pages.
- Measurement/SEO: Meta Pixel conditional injection (PageView all pages, Purchase on success) — required by campaign-build-sheets before launch; OG/twitter tags (gated on new `base_url` config); real meta descriptions on product/policy/success pages (was headline-only); removed dead `{badge and ''}` artifact.

**receptionist/index.html**
- Hero now has CTAs ("Hear it answer a call right now" → #demo, "See pricing" → #pricing) — previously zero clickable elements above the widget.
- Removed the dead **Subscribe** button (`STRIPE_PAYMENT_LINK_PLACEHOLDER` would 404 on a live page); single primary CTA (the form) + honest de-risking line: "The form costs nothing and books nothing — you'll hear your own test number answer before you decide."
- Added 3-step "How it works" (form → private test number in 2–3 days → forward calls), making the try-before-you-pay flow visible instead of buried in FAQ.
- Added FAQ differentiating from traditional answering services (flat rate vs per-minute, first-ring at 3am, configured on your prices).
