# Product Experience Review — skeptical-buyer pass on all 9 products
**Date:** 2026-08-03 · **Reviewer:** competitive product review agent (buyer-lens)
**Method:** every xlsx rendered to PDF/PNG via LibreOffice and visually inspected tab-by-tab (plus openpyxl inspection of labels, merges, validation, charts); all 4 printable PDFs rendered; all listing images and store pages opened; Etsy/Gumroad competitive bar checked by web search. No product or store file was modified.

---

## Headline findings (what a paying buyer actually sees)

1. **Zero charts in the entire catalog.** Every workbook was checked at the XML level: 0 chart parts, 0 drawings. "Year Dashboard", "P&L Dashboard", "Progress" are all plain number grids. Competing bestsellers lead with chart-filled dashboards (bookkeeping competitors ship 5–11 dashboard tabs with graphs; debt competitors tout "beautiful charts and graphs" and payoff curves).
2. **The hero cell of the flagship is visually broken.** In `Paycheck-Budget-System.xlsx` → Paycheck Budget tab, B33 holds `Left to Assign (planned) — get this to $0` but the cell is not merged and the value sits in the adjacent cell, so on screen the label clips to "Left to Assign (planned) — get this to". The single most important instruction in the product is unreadable. Same clipped-label pattern on the Wedding "bottom line" rows and Bookkeeping Ledger/Dashboard summary rows ("Money in (year s…", "Best month (p…").
3. **No listing shows the real product.** All cover images are stylized marketing mockups (idealized fake tables). Two products (bookkeeping, meal planner) have **zero** listing images. Etsy digital-download best practice is 6–10 images: real screenshot carousel + device mockup + what's-included + how-it-works, often plus video. Buyers who purchase off a pretty mockup and open a plainer real file are prime refund/1-star risk. Bonus bug: in `paycheck-budget-v1/02-whats-inside.png` the card text runs off the white card edge (lines end "…has a job" / "…changes" clipped at the border) — it looks broken inside an Etsy carousel.
4. **The "type this word exactly" pattern is a silent-breakage machine.** No workbook uses data-validation dropdowns anywhere. Wedding Guest List: "Type RSVP exactly as Yes / No / Waiting and meals as Chicken / Beef / Vegetarian — the counters above match those words." Vendor tab: "Type Yes in the Paid? columns exactly." Bookkeeping Ledger: "Type must be exactly Income or Expense." Meal grocery list: "Type Yes exactly." A buyer typing "yes ", "Y", or "paid" gets totals that are silently wrong — the classic "the formulas are broken" refund message.
5. **Date claims the files can't honor.** Store hero + Debt listing headline: "see your debt-free date". Savings cover image + store card copy: "Every goal gets a number, **a date**, and a plan." Neither file contains any date output — debt shows months-per-debt, savings uses a "Months left" input (the internal QA note even says "never claim editable dates in copy," yet the shipped cover and store copy do).
6. **Zeros render as "-"** (accounting format) exactly where the copy promises "$0" — "watch Left to Assign hit $0" pays off as a dash. Small, but it kills the promised moment.

---

## P1 — highest conversion / refund impact

### P1-1 · Real screenshot listing image sets for all 9 listings
**Products:** all (bookkeeping + meal planner currently have zero images; others have 1–3 mockups)
**Build:** per product, a 6–8 image set: (1) branded cover, (2–5) real tab screenshots (per the internal "preview-everything rule" — every working tab shown at least once), (6) what's-included grid, (7) how-it-works 1-2-3, (8) "works in Google Sheets + Excel" device shot. Generate deterministically (render xlsx → crop) so rebuilds stay honest. Fix the text-overflow bug in `02-whats-inside.png` while regenerating. Copy final sets into each `publish-queue/*/` and `store/site/img/`.
**Why:** Etsy conversion guidance is unambiguous (image 1 = clearest result, image 2 = what's included, image 3 = format/instructions); every top competitor runs a full screenshot carousel. Mockup-only previews also create a "file doesn't look like the photo" refund vector.
**Effort:** ~6–8 agent-hours (build one templated pipeline, run for 9).

### P1-2 · Put an actual chart on everything called a dashboard
**Products:** paycheck-budget (Year Dashboard), bookkeeping (P&L Dashboard), debt-payoff (Progress), savings-goal (My Goals), simple-budget (optional mini)
**Build:** native Excel charts that survive Google Sheets import: Year Dashboard — income vs spent columns + savings-rate line; P&L — monthly profit columns colored by sign; Debt — balance-remaining decline curve + paid-off progress bar; Savings — per-goal progress bars (data-bar conditional formatting works fine in Sheets and is zero-risk). Screenshot the charts for the new listing images (P1-1 pays twice).
**Why:** every "dashboard/watch it climb" phrase in our copy is currently a grid of numbers; chart-led dashboards are the visible difference between us and the $12–$25 bestsellers, and the #1 driver of "worth the price" on first open.
**Effort:** ~4–6 agent-hours across 5 workbooks (verify Sheets round-trip once, then repeat).

### P1-3 · Replace every "type this exactly" cell with a data-validation dropdown
**Products:** wedding (RSVP, Meal choice, Deposit/Final/Thank-you Yes/No), bookkeeping (Type Income/Expense, Category), meal planner (Got it? Yes), simple-budget (paid "x" — accept checkbox-style list), paycheck (none needed)
**Build:** openpyxl `DataValidation` lists on the input columns (validation converts cleanly to Google Sheets dropdowns); keep the free-text fallback wording as a comment row. Update the generator + verify scripts.
**Why:** free-text-driven COUNTIF totals silently break on any variant spelling — the most likely "this is broken" refund trigger in the wedding and bookkeeping files, and the cheapest one to eliminate.
**Effort:** ~2–3 agent-hours.

### P1-4 · Fix clipped hero labels and dash-for-zero formats
**Products:** paycheck-budget, wedding, bookkeeping (labels); all workbooks (zero format in hero cells)
**Build:** merge the bottom-line label cells across their section width (they're the only unmerged long labels — section headers already merge B:E) or widen/wrap; change hero-cell number format so 0 renders "$0.00" not "-". Re-verify with a render pass.
**Why:** the flagship's key instruction ("get this to $0") is literally unreadable in the shipped file; "Left to Assign" hitting "-" instead of $0 undercuts the product's one promised moment.
**Effort:** ~1–2 agent-hours.

### P1-5 · Debt Payoff Planner v2: link strategy tabs, 10 rows, real debt-free date
**Products:** debt-payoff-planner (and the Debt Snowball tab inside paycheck-budget: 3 rows only)
**Build:** formula-link Snowball/Avalanche to My Debts (already queued internally — confirm priority: this review ranks it P1), support all 10 debts on both strategy tabs, and add a computed **debt-free month/year date** (TODAY()/EDATE off max months) plus a total-interest-free "months saved with extra payment" line. Give the paycheck-budget Snowball tab 10 rows too (store page bullet says "exact payoff month for every debt" over a 3-row table).
**Why:** (a) buyer enters 10 debts, opens Snowball, still sees the 5 example debts — instant "it doesn't work"; (b) the strategy tabs' cells aren't yellow yet require manual entry, contradicting the file's own color legend ("yellow = yours to edit, everything else calculates — don't type over it"); (c) headline and store hero promise a debt-free *date* the file never shows, while competitor listings tout "automatic debt-free date" as their core feature.
**Effort:** ~4–5 agent-hours including verify script.

### P1-6 · Kill or honor the "date" claim on Savings Goal Tracker
**Products:** savings-goal-tracker (cover image, store index + product page copy)
**Build:** preferred — add a "Target date" input column and compute months-left from it (then the cover is true); fallback — regenerate cover/copy to "a number, a monthly amount, and a plan". Either way, cover image and store copy must match the file.
**Why:** the shipped cover PNG and store copy promise "a date" that the file does not have; the internal QA note already flags this exact claim as forbidden. Straight listing-vs-file mismatch = refund clause territory ("doesn't match this description").
**Effort:** ~2 agent-hours.

### P1-7 · Answer "what do I do with my SECOND paycheck?" in the flagship
**Products:** paycheck-budget (and bundle)
**Build:** either ship 4–6 pre-built paycheck sections/tabs (Check 1 / Check 2 …) with a month roll-up, or at minimum add an explicit START HERE step: "Next check: right-click the tab → Duplicate (Sheets) / Move or Copy (Excel), rename it, budget the new check." Store bullet already says "planned vs actual, **per check**".
**Why:** the entire pitch is "budget one check at a time," but the file has exactly one paycheck sheet and zero instructions for check #2 — the most predictable day-14 support message/refund on the flagship. Competitor "biweekly paycheck budget" bestsellers ship per-paycheck sheets.
**Effort:** ~2–3 agent-hours.

---

## P2 — strong value adds

### P2-1 · Delivery upgrade: quick-start PDF + Google Sheets one-click copy link
**Products:** all spreadsheet products + bundle
**Build:** a 1–2 page branded PDF in every download: 3-step start, color legend, "open in Google Sheets" section with a **template /copy link** (host each workbook as a view-only Sheet; buyers hit "Make a copy" — one click, no upload dance), support contact. Keep the xlsx as-is for Excel users.
**Why:** the Etsy Google Sheets category norm is "PDF with link" delivery; our current delivery is a bare .xlsx file. The copy-link removes the biggest non-Excel-user friction (Drive upload + conversion doubt) and the PDF is where the guarantee/support message belongs.
**Effort:** ~3–4 agent-hours (template once, stamp 8 times) + accounts/links setup.

### P2-2 · Savings Challenge Pack: 4 pages is not $9.99
**Products:** savings-challenge-pack (also the order-bump on every Stripe link — AOV engine)
**Build:** expand to 15–25 pages: mini/envelope challenges ($500, $5k, 100-envelope, low-income $1–$20 versions), a color-in thermometer/jar page per challenge, A6 + Letter sizes, and a "pick your challenge" index page. Keep the clean brand style; coloring-tracker pages are the category's dopamine feature.
**Why:** compared bestseller bundles ship 26, 47, even 120+ pages at $5–$12; ours is 4 plain checkbox grids. As the universal order bump, its perceived value caps every cart's AOV. "That's it?" is the likely reaction at $9.99.
**Effort:** ~4–6 agent-hours (generator already exists; add page templates).

### P2-3 · Bookkeeping: category dropdown + expense-by-category P&L
**Products:** bookkeeping-tracker
**Build:** category dropdown on the Ledger (P1-3 covers the mechanics) feeding a new "Where the money went" section on the P&L Dashboard (SUMIF by category, year + monthly), roughly Schedule-C-shaped categories. Plus the P1-2 chart.
**Why:** a $19.99 "bookkeeping + tax" buyer expects to answer "what did I spend on supplies this year" at tax time; our P&L only shows in/out/net. Competitors ship category reports and multi-period dashboards as the headline feature.
**Effort:** ~3–4 agent-hours including verify script update.

### P2-4 · Wedding: add a Checklist/Timeline tab
**Products:** wedding-budget-planner
**Build:** one pre-filled 12-months-out → wedding-week checklist tab (40–60 rows, done-checkbox with count) in the existing style.
**Why:** every top wedding-spreadsheet listing bundles budget + guests + vendors **+ timeline/checklist** (some add seating charts); we cover three of four and the gap is visible in side-by-side listing comparisons. Cheap addition, big "complete planner" perception jump at $16.99.
**Effort:** ~2–3 agent-hours.

### P2-5 · Meal planner: make the Grocery List Builder actually build
**Products:** meal-grocery-planner
**Build:** minimum honest version — a "This week's meals" auto-summary on the Grocery List tab (pulled from the active week) so the list is built *beside* the plan; stretch version — small recipe/staples table with dropdown meal picking that pre-fills list items. If neither ships, rename the tab "Grocery List & Price Check" in v2 copy.
**Why:** category leaders are "automated grocery list" templates (pick meals from dropdowns → list generates). Ours is fully manual; the name "Builder" over-promises against what 2026 buyers see elsewhere.
**Effort:** ~3–5 agent-hours depending on version.

### P2-6 · Sheet protection with unlocked yellow cells
**Products:** all workbooks
**Build:** lock formula cells, unlock yellow input cells, protect each sheet with no password; note in START HERE how to unprotect. (Survives Google Sheets import as protected ranges w/ warning.)
**Why:** the color legend asks buyers not to type over formulas; protection enforces it. "I broke a formula" is a recurring template-shop refund reason, and the fix costs almost nothing since inputs are already yellow-flagged.
**Effort:** ~1–2 agent-hours.

### P2-7 · Print setup on every workbook
**Products:** all
**Build:** set print areas, landscape + fit-to-width, repeat header rows. (Current files have no page setup — the default export slices every tab into confetti across A4 portrait pages; that's exactly what a buyer's Ctrl+P produces.)
**Why:** budget-spreadsheet buyers print; first print preview currently looks broken.
**Effort:** ~1 agent-hour (loop in generators).

### P2-8 · 30–60s screen-capture video per listing
**Products:** all Etsy listings
**Build:** short capture per product: open file → type in a yellow cell → totals/colors react → dashboard chart. Etsy listings support video; competitors use it.
**Why:** video is the strongest "it actually works" proof for spreadsheets and lifts search CTR on Etsy.
**Effort:** ~3–4 agent-hours once P1-2 charts exist.

---

## P3 — polish

- **P3-1 Dark-mode variants** (paycheck, simple-budget first): "dark mode" is a differentiated, searched keyword with multiple bestsellers; ship as second file in the same download. (~2h per product)
- **P3-2 Mobile-view tab**: a compact single-column "today" view per core workbook; competitors tout phone-friendliness. (~2–3h)
- **P3-3 Bundle START HERE**: one page telling bundle buyers which file to open first (currently three bare files). (~1h)
- **P3-4 Progress tab upgrade (debt)**: turn the empty "Debts Destroyed" log into a visual (auto progress bar vs total debt; keep "How it felt" column). Partially covered by P1-2. (~1h)
- **P3-5 52-Week Challenge current-week highlight** (savings-goal): TODAY()-based row highlight; tiny delight feature. (~0.5h)
- **P3-6 Wedding meal-choice flexibility**: dropdown fed by an editable 3–5 option list (fish/vegan/kids). (~1h)
- **P3-7 A4 print variants for printables** (already claimed "Letter or A4" — verify A4 margins on the 4 PDFs; cover says Letter 300dpi only). (~1h)
- **P3-8 Consistent "-" vs "$0.00" sweep** across all non-hero total rows for taste (P1-4 handles hero cells). (~0.5h)

---

## Per-product verdicts (ready to sell as-is?)

| Product | Verdict | The one thing |
|---|---|---|
| Paycheck Budget System ($14.99) | **No** | Second-paycheck workflow is unanswered (and the "get this to $0" label is clipped) — fix P1-7/P1-4 before ads spend a dollar. |
| Debt Payoff Planner ($14.99) | **No** | Strategy tabs are unlinked 5-row manual copies and the promised debt-free *date* doesn't exist in the file. Ship v2 (P1-5) first. |
| Savings Goal Tracker ($12.99) | **No (close)** | The cover/store promise of "a date" isn't in the file — honor it (target-date column) or cut the word. Otherwise sellable. |
| Savings Challenge Pack ($9.99) | **No at this price** | 4 plain pages vs competitors' 26–120. Expand the pack (P2-2) or it drags every order bump down. |
| Wedding Budget & Guest Tracker ($16.99) | **Yes, barely** | Free-text RSVP/meal counters will silently break — add dropdowns (P1-3); timeline tab (P2-4) closes the visible competitor gap. |
| 10-Minute Simple Budget ($9.99) | **Yes** | Best first-open impression in the catalog; just needs real screenshots in the listing. Ship it. |
| Bookkeeping & Invoice Tracker ($19.99) | **No** | Zero listing images exist, and a $19.99 bookkeeping buyer expects category-level P&L + a chart. Invoice tab is genuinely strong. |
| Meal Plan & Grocery Planner ($12.99) | **Yes, barely** | Content is solid and honest; needs listing images (none exist) and the "Builder" naming softened or semi-automated (P2-5). |
| Money Reset Bundle ($29.99) | **No** | Inherits paycheck + debt + savings issues; also needs a one-page bundle START HERE. Fix the three components first. |

Store-wide note (out of scope but observed): every store CTA says "Checkout opening soon — nothing is sold yet," so today the store cannot convert at all; and each product page has exactly one mockup image where a screenshot gallery should be.

---

## Honesty check

Every item above is a real file change, real screenshot, or real feature — verified against what the files actually contain. Explicitly **not** recommended anywhere in this backlog: fabricated reviews/testimonials or "as seen on" social proof; fake scarcity or countdowns ("only 3 left" on a digital file); invented sales counts, "bestseller" badges, or star ratings; savings-amount promises ("save $500/month"); "IRS-approved"/expert-endorsement implications; or brand-name piggybacking (per the IP notes in each listing). The bundle's $42.97 compare-at is legitimate (true sum of components). The existing "AI-assisted design tools and human review" disclosure should stay. If P1-6/P1-5 date features don't ship, the corresponding date claims in covers and store copy must be deleted — that's the honest direction of travel, not softer wording.

---

## Sources (competitive pass)

- [Etsy market: budget spreadsheet](https://www.etsy.com/market/budget_spreadsheet) · [budget templates](https://www.etsy.com/market/budget_templates) · [spreadsheets top selling](https://www.etsy.com/market/spreadsheets_top_selling)
- [NichePursuits — How to Sell Digital Downloads on Etsy (2026)](https://www.nichepursuits.com/how-to-sell-digital-downloads-on-etsy/) · [MerchTitans guide](https://merchtitans.com/blog/etsy-digital-downloads-guide) · [Insight Agent digital downloads guide](https://www.insightagent.app/guides/digital-downloads-on-etsy-complete-guide)
- Dark mode budget bestsellers: [listing 1711773192](https://www.etsy.com/listing/1711773192/dark-mode-excel-and-google-sheets-budget) · [listing 1711623355](https://www.etsy.com/listing/1711623355/503020-budget-spreadsheet-dark-mode) · [listing 1726512880](https://www.etsy.com/listing/1726512880/simple-budget-spreadsheet-dark-mode)
- Wedding: [PrioriDigitalStudio listing 1702251197 (11.6k favorites, timeline+checklist+seating)](https://www.etsy.com/listing/1702251197/wedding-planner-spreadsheet-wedding) · [listing 4379687049 (ultimate planner scope)](https://www.etsy.com/listing/4379687049/wedding-planner-spreadsheet-budget)
- Bookkeeping: [listing 1202732233 (P&L + charts dashboard)](https://www.etsy.com/listing/1202732233/small-business-bookkeeping-spreadsheet) · [listing 1588204479 (11-tab multi-dashboard)](https://www.etsy.com/listing/1588204479/etsy-seller-bookkeeping-spreadsheet)
- Debt: [listing 1113109107 (charts + debt-free date)](https://www.etsy.com/listing/1113109107/debt-snowball-spreadsheet-calculator-for) · [Tiller — best debt snowball spreadsheets](https://tiller.com/debt-snowball-spreadsheet/)
- Savings printables: [listing 1071420538 (47 pages)](https://www.etsy.com/listing/1071420538/money-saving-challenge-printables) · [listing 1512940143 (120+ challenges)](https://www.etsy.com/listing/1512940143/ultimate-savings-challenges-bundle) · [listing 1577988359 (26 pages, low income)](https://www.etsy.com/listing/1577988359/low-income-money-saving-challenge-bundle)
- Meal planning: [listing 1324370051 (automated planner + grocery list generator)](https://www.etsy.com/listing/1324370051/meal-planner-spreadsheet-for-google) · [listing 1732830863 (auto grocery list)](https://www.etsy.com/listing/1732830863/weekly-meal-planner-and-automated)
- Google Sheets delivery norm: [How to sell Google Sheets on Etsy — PDF-with-link delivery](https://plr.plannerforall.com/how-to-sell-google-sheets-on-etsy/)
