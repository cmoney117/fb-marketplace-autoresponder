# Listing Package: Meal Plan & Grocery Budget Planner v1 (Wave-1 sibling — grocery-adjacent buyers of the budget spreadsheets)

**Files:** `Meal-Plan-Grocery-Budget-Planner.xlsx` (the product) · `store-card.svg` (1200x1200 storefront card) · `build_mealplanner.py` (regenerates the xlsx deterministically) · `verify_mealplanner.py` (recomputes every expected value independently in Python and re-verifies all 87 formulas; `--recalc` runs the LibreOffice cached-value pass and re-injects the brand chart colors — run `python3 build_mealplanner.py && python3 verify_mealplanner.py --recalc` after any change). **`listing-images/` (Etsy/Gumroad upload set, in order: `01-cover.png`, `02-grocery-list-builder.png`, `03-weekly-meal-plan.png`, `04-monthly-grocery-budget.png`, `05-start-here.png`, `06-whats-included.png`, `07-price-book-pantry.png`) — real LibreOffice-rendered screenshots of the shipped workbook (all six tabs shown per the preview-everything rule; budget chart visible), composed at 2000×1500 in the house palette.**

**IP screen (2026-08-03): PASSED.** Web search on the exact name found no registered brand or dominant branded product — only generic and free templates (Vertex42, Tiller, Someka) and unbranded Etsy/Gumroad listings. All words in the name and copy are generic descriptive terms. Do not add meal-planning or budget brand names (Budget Bytes, eMeals, Mealime, PlateJoy, $5 Dinners / Grocery Budget Makeover, Plan to Eat, Tiller, Vertex42, The Budget Mom, Dave Ramsey) to titles, tags, or descriptions — ever. Store-name note: the Price Book example deliberately uses neutral "Store 1 / 2 / 3" headers — keep real supermarket chain names out of listing copy and screenshots too.

**QA status (v2, 2026-08-03 — review fixes applied):** all 87 formulas verified programmatically by `verify_mealplanner.py` — exact formula strings (correct ranges), Python-recomputed expected values, AND LibreOffice-recalculated cached values all agree (worked example: grocery list $134.86 of a $150 budget → "Left vs budget" $15.14 green; Week 1 meal counter 28/28, weeks 2–4 = 0; dinner panel pulls Week 1's 7 dinners live; month $583.17 spent of $600 → $16.83 left, 97.2% used, $71.83 less than last month; weekly over/under 11.58 / −11.85 / 0.00 / 17.10 exercises green/red/amber/green; Price Book cheapest-store picks verified on 10 example staples; pantry 10 items / 3 use-first flags). v2 additions, all verified by the same script: data-validation dropdowns everywhere free text used to drive counters (Got it? Yes/No, Use first? Yes/No, pantry Where, week picker 1–4 — no more "type Yes exactly"); native clustered-bar chart on Monthly Grocery Budget (Budget navy #1f3a5f vs Actual teal #2e7d6b, driven by the real C9:D12 range); hero/total cells render $0.00 instead of "-" at zero; every sheet protected with NO password (yellow inputs unlocked — 690 cells); print setup on all six tabs (print areas, fit-to-width, repeated header rows → whole file prints in 8 clean pages, was 19 fragments). Formulas only — NO macros; every function is Excel-2007-era, works in Excel 2010+ and free Google Sheets. Do a 2-minute visual check on first Google Sheets open — Sheets recalculates automatically.

## Etsy listing fields (paste as-is)

**Type:** Digital download · **Category:** accept Etsy's suggestion for "meal planner spreadsheet" · **Price:** $12.99 · **Quantity:** 999

**Title (130 chars — Etsy max 140):**
Meal Planner Spreadsheet, Grocery Budget Template Google Sheets Excel, Weekly Meal Plan, Grocery List Price Book, Pantry Inventory

**Tags (13, all ≤20 chars — Etsy cap):**
`meal planner` · `grocery budget` · `meal plan template` · `grocery list` · `budget spreadsheet` · `meal prep planner` · `grocery tracker` · `price book` · `pantry inventory` · `weekly meal plan` · `family meal planner` · `google sheets meal` · `grocery savings`

**Description:**
The grocery bill isn't decided at the store — it's decided before you leave the house.

This planner runs the weekly loop that keeps food spending in check: see what's already in the pantry, plan 7 days of meals around it, price your list, and know whether you're over or under BEFORE you shop. No math, no spreadsheet skills — fill the yellow cells and the traffic lights show exactly where you stand.

We won't promise you'll save a specific amount — nobody honestly can, that depends on your stores and your week. What this planner does is put the number in front of you while you can still change it: swap a dinner, cut an item, and watch "Left vs budget" go green before you spend a dollar.

WHAT YOU GET (instant download, use forever)
★ Weekly Meal Plan — 4 full weeks of breakfast / lunch / dinner / snack, with Week 1 pre-planned as a realistic example
★ Grocery List Builder — pick a week and its 7 dinners appear right beside the list, pulled live from your meal plan; categorized list (produce, meat, dairy, pantry, frozen, household) with per-item estimated prices, auto-totaled against your weekly budget: green = under, red = over
★ Price Book — jot staple prices across 3 stores (rename them to yours); the cheapest price lights up, so you learn where each item genuinely costs less and can spot a real sale
★ Monthly Grocery Budget — weekly actuals vs budget with a real bar chart, month summary, and how the month compares to last month
★ Pantry Inventory — what you already own, with use-first dropdown flags so food gets eaten instead of tossed
★ Start-Here guide — color-coded cells and a full worked example (one real week for a family of four), so you're never staring at a blank sheet
★ No fragile typing — Yes/No and week choices are dropdowns, formulas are protected (no password) so nothing breaks by accident, and every tab prints clean

WORKS WITH
✓ Google Sheets (free) — upload to Drive and it just works
✓ Microsoft Excel (2010 or newer)
✓ Desktop, laptop, tablet

HOW IT WORKS
1. Download instantly after purchase
2. Enter your weekly grocery budget in one yellow cell
3. Flag the pantry, plan the week, price the list — and shop when the light is green

Please note: this is a digital download — no physical item ships. Because of the nature of digital files all sales are final, BUT if the file doesn't work, doesn't match this description, or you bought a duplicate by accident, we'll refund you, full stop. Message us anytime — we're real humans and we answer fast.

*Spreadsheet template created with AI-assisted design tools and human review/testing.*

## Gumroad twin listing
Same files/copy · Price $10.99 · URL slug: `meal-plan-grocery-budget-planner`
