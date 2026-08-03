# Listing Package: The 10-Minute Simple Budget v1 (Wave-1 sibling — minimal/ADHD-friendly entry price point)

**Files:** `10-Minute-Simple-Budget.xlsx` (the product) · `01-cover.png` (listing image) · `store-card.svg` (storefront card, copied to `store/site/img/simple-budget.svg` only when it changes) · `build_product.py` (regenerates everything deterministically AND re-verifies every formula) · `verify_product.py` (independent ground truth: LibreOffice formula recalc + P1-fix structure checks)

**IP screen (2026-08-02): PASSED.** Web search on "10-Minute Budget" / "10 Minute Budget" found no registered brand or branded budgeting product on the phrase — results are generic branding-cost articles and unbranded Etsy budget-template market pages. (Paper + Spark markets an unrelated Etsy-seller bookkeeping spreadsheet with "10 minutes a month" phrasing — different product, different category; never reference their brand.) "ADHD" is used only as a descriptive audience term ("ADHD-friendly"), standard across the Etsy category; make no medical or treatment claims. No advice framing — this is a calculator/organizer tool, per the brand-authority filter.

**QA status (2026-08-03, post P1-review fixes):** all 29 formulas verified programmatically by `build_product.py`, and independently by `verify_product.py` with LibreOffice recalc as ground truth (worked example expected values: money in $2,750; planned out $2,570 → left over $180.00 on plan; spent $2,466.21 → LEFT OVER $283.79; the 10 example rows deliberately exercise all three traffic lights — 4 green / 4 yellow / 2 red; Bill Calendar 12 bills totaling $2,076.99/month, January worked example shows 8 of 12 paid, Feb–Dec count 0). Traffic-light conditional formatting + green paid-checkbox formatting verified present. P1 fixes verified in-file: the Bill Calendar "x" is now a real dropdown across the whole paid grid (no silent COUNTIF misses), LEFT OVER hero cells render $0.00 (not "-") at exactly zero, and a native Planned-vs-Spent bar chart (navy/gold house palette, wired to the live 10 lines) sits beside the Monthly Budget table; all tabs print landscape fit-to-width. Dropdown + chart convert on Google Sheets import (chart colors may shift slightly — noted honestly in the file's START HERE). Do a 2-minute visual check on first Google Sheets open — Sheets recalculates and converts the conditional formatting automatically. Preview-everything rule: listing images must show both working tabs.

## Etsy listing fields (paste as-is)

**Type:** Digital download · **Category:** accept Etsy's suggestion for "simple budget spreadsheet" · **Price:** $9.99 · **Quantity:** 999

**Title (126 chars — Etsy max 140):**
Simple Budget Spreadsheet, Easy Budget Template Google Sheets Excel, ADHD Budget Planner, Monthly Budget, Bill Payment Tracker

**Tags (13):**
`simple budget` · `easy budget` · `budget spreadsheet` · `budget template` · `adhd budget` · `adhd planner` · `monthly budget` · `bill tracker` · `budget google sheets` · `beginner budget` · `money tracker` · `bill calendar` · `budget for beginners`

**Description:**
The budget for people who hate budgeting.

Big budget spreadsheets fail for a simple reason: forty categories and twelve tabs are a chore, and chores get abandoned by February. This one is small on purpose. One page. Your money in, ten spending lines, and a LEFT OVER box. Traffic-light colors do the judging for you — green means fine, yellow means right at the line, red means over. Ten minutes to set up, about two to update.

WHAT YOU GET (instant download, use forever)
★ Monthly Budget — income, exactly 10 spending lines, a "left over" that calculates itself with traffic-light colors, and a little planned-vs-spent chart that updates as you type
★ Bill Calendar — 12 months × your bills; pick the x from the dropdown when paid and the box turns green (that tiny dopamine hit is the point)
★ Start-Here guide — color-coded cells and a full worked example, so you're never staring at a blank sheet
★ Nothing else. That's the feature.

WORKS WITH
✓ Google Sheets (free) — upload to Drive and it just works, colors and all
✓ Microsoft Excel (2010 or newer)
✓ Desktop, laptop, tablet

HOW IT WORKS
1. Download instantly after purchase
2. Type your income and 10 planned amounts in the yellow cells — that's the whole setup
3. Update Spent when you spend, pick the x when you pay a bill — the colors tell you the rest

Designed ADHD-friendly: minimal inputs, instant visual feedback, no maintenance guilt. (A tool, not advice — it just does the math on numbers you enter.)

Please note: this is a digital download — no physical item ships. Because of the nature of digital files all sales are final, BUT if the file doesn't work, doesn't match this description, or you bought a duplicate by accident, we'll refund you, full stop. Message us anytime — we're real humans and we answer fast.

*Spreadsheet template created with AI-assisted design tools and human review/testing.*

## Gumroad twin listing
Same files/copy · Price $8.99 · URL slug: `simple-budget-starter`
