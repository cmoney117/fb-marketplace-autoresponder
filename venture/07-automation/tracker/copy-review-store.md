# Storefront Copy Review — The Paycheck Budget (2026-08-03)

Scope: every customer-visible string in `store/build_store.py` (single source of truth), cross-checked against rendered `store/site/*.html` (index, paycheck-budget, money-reset-bundle, policies, success, ty-e09f9ec2…), the 7 deliverable workbooks in `publish-queue/` (tab names, in-file labels), `listings.csv`, `NEEDS-HUMAN.md`, `email-flows.md`, and the two 2026-08-02 audits. All fixes below are proposed against `build_store.py` — nothing was edited.

---

## P1 — Must-fix errors

### P1-1. Broken grammar on thank-you pages: "Your The Paycheck Budget is ready."
- **Location:** `build()` → per-product `ty` template, `<h1>Thank you! 🎉 Your {html.escape(p['name'])} is ready.</h1>`
- **Current (rendered, ty-e09f9ec2…):** "Thank you! 🎉 Your The Paycheck Budget is ready." (also breaks for "The 10-Minute Simple Budget": "Your The 10-Minute…")
- **Proposed:** `Thank you! 🎉 Your copy of {html.escape(p['name'])} is ready.` → "Thank you! 🎉 Your copy of The Paycheck Budget is ready." (reads correctly for all 9 names).
- **Why:** Double determiner ("Your The") on the first line the paying customer sees — the highest-visibility grammar error on the site.

### P1-2. Product page title: "The Paycheck Budget — The Paycheck Budget"
- **Location:** `product_page()` → `page(f"{p['name']} — {CONFIG['brand']}", …)`; leaks into `<title>` and `og:title`.
- **Current:** flagship tab/SERP/share title is the name doubled.
- **Proposed:** one-line special case: `title = f"{p['name']} — paycheck-by-paycheck budget spreadsheet" if p['name'] == CONFIG['brand'] else f"{p['name']} — {CONFIG['brand']}"`
- **Why:** The doubled title looks like a template bug in the browser tab, search results, and every social share of the flagship product.

### P1-3. Contact page implies marketplace listings that don't exist yet
- **Location:** `contact_section_html()` fallback, last sentence.
- **Current:** "Bought one of our tools on Etsy or Gumroad? Message us there — same humans, fast replies."
- **Facts:** `listings.csv` has zero rows; Gumroad signup is still pending (NEEDS-HUMAN #1); Etsy is blocked at ID verification (NEEDS-HUMAN #6). Nobody has ever bought anything on either platform.
- **Proposed:** delete the sentence, leaving: "Our support inbox opens together with checkout (any day now) and will be posted right here. Until checkout is live nothing can be ordered on this site, so no customer is ever waiting on an answer." (Re-add the marketplace line the day a listing is actually live.)
- **Why:** Honesty hard rule — it fabricates an existing sales track record and a support channel neither of which exists.

### P1-4. Email-delivery timing promises the ops loop cannot keep
Delivery emails are sent manually by the daily-ops agent "until webhook automation lands" (`venture/05-marketing/email-flows.md`, `daily-ops-routine.md`) — i.e., hours, not minutes. Three strings over-promise:
- **(a) Location:** `build()` → `success` template.
  **Current:** "Your download link is on its way to your inbox right now (check spam/promotions the first time)." + "If it isn't there within 10 minutes, reply to your order receipt email and a human will send it personally."
  **Proposed:** "Your download link is on its way to your inbox (check spam or Promotions the first time)." + "If it hasn't arrived within a few hours, reply to your order receipt email and a real human will send it personally."
- **(b) Location:** `build()` → `policies` Delivery section.
  **Current:** "a download link appears on the confirmation page and is emailed to you right after checkout."
  **Proposed:** "a download link appears on the confirmation page the moment you pay, and a copy is emailed to you as backup."
- **(c) Location:** `PRODUCTS[paycheck-budget].faq` "How do I get it?"
  **Current:** "Instant download link on the confirmation page and by email right after checkout."
  **Proposed:** "Instant download link on the confirmation page, plus a backup copy by email." (also harmonizes with the other 8 products' wording).
- **Why:** The on-page instant download (Stripe redirect → ty page) is real; the "right now / within 10 minutes" email claim is not. A broken first promise is the fastest route to disputes. The generic "plus email delivery" lines elsewhere are fine — only the timing claims need truing.

### P1-5. Policies contradict themselves on the checkout provider
- **Location:** `build()` → `policies` Terms + Privacy paragraphs.
- **Current (Terms):** "…Gumroad (our checkout provider) for card purchases, or Hive Home Services (our parent company) for purchases made via our Stripe links." — incoherent split: Stripe purchases are also card purchases.
- **Current (Privacy):** "We collect only what checkout requires (handled by Stripe)…" — contradicts Terms, which names Gumroad as the checkout provider; the venture's recommended path is Gumroad-only (NEEDS-HUMAN #1/#5).
- **Proposed (Terms):** "The charge on your card statement carries the name shown at checkout — purchases through Gumroad appear as Gumroad; purchases through our Stripe checkout appear as {CONFIG['statement_descriptor']}."
- **Proposed (Privacy):** "We collect only what checkout requires (handled securely by our checkout provider — Gumroad or Stripe, depending on where you buy) and your email for delivery."
- **Why:** A visitor who reads Terms then Privacy gets two different stories about who processes their card; consistency here is a chargeback defense, not just polish.

### P1-6. Support channel dead end (known owner input — impact note)
- **Location:** `CONFIG["support_email"] = ""`.
- **Impact chain:** The guarantee (shown on every product + ty page) says "Message us any time; a real human answers fast" → footer says "Questions? See the contact page" → contact page says the inbox doesn't exist yet. Policies Delivery also says "Lost the link? Email us any time — forever." The store's #1 trust asset (the guarantee) currently terminates in "no channel exists." No copy fix — this is the single highest-leverage owner input (`support_email` + rebuild) and should land before checkout opens, since P1-4's "reply to your receipt email" is the only working channel until then.

---

## P2 — Conversion upgrades

### P2-1. "Checkout opens this week" is a dated claim that will rot
- **Location:** `buy_button()` soon-state span.
- **Current:** "Checkout opens this week"
- **Proposed:** "Checkout opening soon — nothing is sold yet" (tooltip stays as-is).
- **Why:** Checkout depends on a pending human step (Gumroad signup); if it slips past the week, an honest store is displaying a false date on every page. "Soon" can't expire.

### P2-2. Hero CTA "all 3 tools" contradicts the 9-product grid below it
- **Location:** `build()` → `home` hero CTA.
- **Current:** "Get all 3 tools — Money Reset Bundle, $29.99"
- **Proposed:** "Get the 3 core tools — Money Reset Bundle, $29.99"
- **Why:** A first-time visitor reads "all 3 tools," then scrolls into nine cards — "core" resolves the mismatch in one word. (Same tweak optional in the product-page upsell: "Want all three tools?" → "Want all three core tools?")

### P2-3. Bundle headline carries the store's only hype verb
- **Location:** `PRODUCTS[money-reset-bundle].headline`
- **Current:** "Budget it. Crush the debt. Build the savings. One bundle."
- **Proposed:** "Budget every paycheck. Pay off the debt. Build the savings. One download."
- **Why:** "Crush" is off-voice for a zero-hype store and "Budget it" has no referent; the rewrite keeps the cadence, names the outcomes, and "One download" restates instant delivery.

### P2-4. Bundle FAQ skips the real objection: "I already own one of these"
- **Location:** `PRODUCTS[money-reset-bundle].faq` — add a third entry.
- **Proposed:** `("Already own one of the three?", "Then the bundle usually isn't your deal — the two you're missing cost $27.98–$29.98 on their own, about the same as the bundle. Just buy what you're missing; we'd rather you buy right than buy big.")`
- **Why:** It's the question every returning buyer has; answering it against our own interest is the cheapest trust move on the site and is mathematically true ($14.99+$14.99 / $14.99+$12.99).

### P2-5. Wedding FAQ claims data provenance we don't have
- **Location:** `PRODUCTS[wedding-budget-planner].faq` "Is the typical % a rule?"
- **Current:** "No — it's a starting split from real weddings. Your yellow cells are the plan; the % column is just guidance."
- **Proposed:** "No — it's a common starting split for typical wedding budgets. Your yellow cells are the plan; the % column is just guidance."
- **Why:** "From real weddings" asserts a dataset we can't substantiate; "common starting split" is equally reassuring and fully honest.

### P2-6. Challenge Pack bullets list only 3 of the 4 PDFs
- **Location:** `PRODUCTS[savings-challenge-pack].bullets`
- **Current:** bullets cover 52-Week, Biweekly, and $1,000 Emergency Fund; the No-Spend Month tracker appears only in the sub.
- **Proposed:** insert before the "Print as many times" bullet: "No-Spend Month tracker — one page, a box for every day"
- **Why:** Bullet-scanners are the majority; a quarter of the product is invisible to them.

### P2-7. Product meta descriptions end mid-sentence
- **Location:** `product_page()` → `desc = f"{p['headline']} {p['sub']}"` + 155-char truncation.
- **Current:** 8 of 9 product SERP/share descriptions end "…watch…", "…RSVPs and…", etc.; none mention price or the guarantee.
- **Proposed:** support an optional per-product `"meta"` key (fall back to current auto-cut). Example for paycheck-budget: "Zero-based budgeting one paycheck at a time — plan each check, give every dollar a job, watch your savings rate climb. $14.99, instant download."
- **Why:** The meta description is the ad you don't pay for; a hand-finished sentence with the price outperforms an ellipsis cut.

### P2-8. Storefront URL is the internal project name (known owner input — impact note)
- **Location:** `CONFIG["base_url"] = "https://fb-marketplace-autoresponder.vercel.app"`; propagates into every `og:url`/`og:image`.
- **Impact:** A budget-spreadsheet shopper lands on a domain that says "fb-marketplace-autoresponder" — reads as unrelated at best, scammy at worst, and it gets baked into social shares. Owner action: buy thepaycheckbudget.com (NEEDS-HUMAN #3), set `base_url`, rebuild.

---

## P3 — Polish

### P3-1. Quoted in-file labels don't match the workbooks' exact casing
Customers will look for these labels by name; match the file.
- `build()` ty template: "The Start-Here tab walks you through setup." → "The START HERE tab walks you through setup." (all 7 workbooks' tab is literally `START HERE`).
- `PRODUCTS[money-reset-bundle].bullets` + `PRODUCTS[paycheck-budget].bullets`: "Start-Here guide + worked example…" → "Start Here guide + worked example…"
- `PRODUCTS[simple-budget-starter].bullets`: "'Left over' calculated for you, with traffic-light colors" → "LEFT OVER calculated for you, with traffic-light colors" (workbook cell B25 is `LEFT OVER`; the sub already says "a LEFT OVER box").
- `PRODUCTS[wedding-budget-planner].bullets`: "Running 'Left to Plan' against YOUR total budget" → "Running 'Left to plan' against your total budget" (workbook label is `Left to plan…`; also drops the off-voice all-caps YOUR).

### P3-2. "Designed ADHD-friendly" reads as broken grammar
- **Location:** `PRODUCTS[simple-budget-starter].bullets`
- **Current:** "Designed ADHD-friendly: minimal inputs, instant feedback, zero maintenance guilt"
- **Proposed:** "ADHD-friendly by design: minimal inputs, instant feedback, zero maintenance guilt"

### P3-3. "paying debt" → "paying off debt", and the duplicated "weirdly" tic
- **Location:** `PRODUCTS[debt-payoff-planner].bullets`
- **Current:** "Progress tab that makes paying debt weirdly satisfying"
- **Proposed:** "Progress tab that makes paying off debt genuinely satisfying"
- **Why:** "paying debt" is non-idiomatic, and "weirdly" already carries the Challenge Pack headline ("weirdly fun") — one quirk per store.

### P3-4. Thank-you page: stacked questions and an awkward opener
- **Location:** `build()` ty template.
- **Current:** "Problem with a file? Questions? See the contact page. Lost this page? Reply to your Stripe receipt email…" (the double question comes from prefixing `support_contact_html()`), and "**Download your file below right now**".
- **Proposed:** "**Your file is below — download it now**" for the opener; and replace the support line with "Problem with a file, or lost this page? Reply to your Stripe receipt email and a human resends everything." (use `support_contact_html()` alone once `support_email` is set).

### P3-5. Guarantee: "you bought a duplicate" is terse to the point of ambiguity
- **Location:** `GUARANTEE` constant.
- **Current:** "…or you bought a duplicate — full refund, no questions."
- **Proposed:** "…or you accidentally bought it twice — full refund, no questions." (matches the policies page's "duplicate by accident").

### P3-6. Hero paragraph list isn't parallel
- **Location:** `build()` → `home` hero `<p>`.
- **Current:** "Instant download, works in free Google Sheets, and every purchase is covered by a no-questions guarantee."
- **Proposed:** "Everything downloads instantly, works in free Google Sheets, and is covered by a no-questions guarantee."

### P3-7. "savings vs last month" could scan as a savings claim
- **Location:** `PRODUCTS[meal-grocery-planner].bullets`
- **Current:** "Monthly view: weekly actuals, savings vs last month"
- **Proposed:** "Monthly view: weekly actuals, spend vs last month"
- **Why:** It's a spend-difference cell; "spend vs" is both clearer and safer under the no-savings-promises rule.

### P3-8. Statement-descriptor gloss lives in the config value, not the template
- **Location:** `CONFIG["statement_descriptor"] = "Hive Home Services (our parent company)"`, injected verbatim into the ty trust line and Terms.
- **Risk:** the config comment says to replace the value with the exact Stripe descriptor string — doing so silently deletes the customer-facing "(our parent company)" explanation (or ships a raw `HIVEHOMESVCS` with no gloss).
- **Proposed:** keep CONFIG as the bare descriptor and move "(our parent company)" into the two templates: "…appears under {descriptor} (our parent company)."

### P3-9. Flagship headline repeats the hero verbatim on the homepage (note, optional)
Hero h1 "Budget the way you actually get paid." sits directly above the flagship card's "The spreadsheet that budgets the way you actually get paid." Defensible as brand reinforcement; if it grates, vary the card only (e.g. "The flagship: zero-based budgeting, one paycheck at a time.") — do not change the product page headline, which is strong.

---

## Verified OK (checked, no action)

- **Bundle math, everywhere:** $14.99 + $14.99 + $12.99 = **$42.97** = `compare_at`; $42.97 − $29.99 = **$12.98** = "Save $12.98"; 12.98/42.97 = **30.2%**, so "30% off" / "save 30% vs separately" is accurate and slightly conservative. Component prices in bundle bullets match the individual product pages exactly.
- **Challenge numbers:** 52-week 1+2+…+52 = **$1,378** ✓; Emergency Fund 25 × $40 = **$1,000** ✓; Biweekly **$2,106** ($6 steps × 26) render-verified by the 2026-08-02 customer audit.
- **Feature claims vs files:** all 7 workbooks have a `START HERE` tab; "Left to Assign" (paycheck), "Left to plan" (wedding), `LEFT OVER` (simple budget) all exist; meal planner really contains a 4-week grid (WEEK 1–4); savings tracker tabs (My Goals / 52-Week Challenge / Savings Log) and bookkeeping tabs (Ledger / Invoice Tracker / Quarterly Tax Estimate / P&L Dashboard / Mileage Log) match their bullets.
- **Honesty posture:** no income/savings promises (meal-planner FAQ "We don't promise a number; the tool makes the number honest" is a model answer worth reusing), no testimonials, no fake scarcity; tax content correctly labeled "estimate only — not tax advice" in both the bullet and the FAQ, with "Your tax professional has the final word." No over-hedging found that needs strengthening — the guarantee already does the heavy lifting.
- **Names & tone:** product names identical across cards, pages, FAQs, bundle bullets, and cross-references; buy-button states honest in both live and pre-launch forms; live trust line ("Secure checkout by Stripe · Instant delivery · No subscription · No account needed") accurate; footer "© 2026" correct; alt text meaningful on every image.
