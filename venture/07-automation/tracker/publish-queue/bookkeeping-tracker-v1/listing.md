# Listing Package: Small Business Bookkeeping & Invoice Tracker v1 (Wave-2 — small-business vertical, $19.99 anchor)

**Files:** `Small-Business-Bookkeeping-Tracker.xlsx` (the product) · `store-card.svg` (1200x1200 storefront card — NOT yet copied to `store/site/img/`, do that at publish time) · `build_bookkeeping.py` (regenerates xlsx + svg deterministically) · `verify_bookkeeping.py` (re-derives every formula and expected value; must pass before publish). **`listing-images/` (Etsy/Gumroad upload set, in order: `01-cover.png`, `02-pl-dashboard.png`, `03-ledger.png`, `04-invoice-tracker.png`, `05-start-here.png`, `06-whats-included.png`, `07-tax-mileage.png`) — real LibreOffice-rendered screenshots of the shipped workbook (all 6 tabs shown incl. the Ledger AND the Invoice Tracker per the preview-everything rule; P&L chart visible), composed at 2000×1500 in the house palette.**

**IP screen (2026-08-03): PASSED.** "Small business bookkeeping", "invoice tracker", "income & expense ledger", "mileage log" are generic category terms used across the entire template market (Vertex42, Smartsheet, Microsoft's own template gallery, dozens of Etsy sellers) — no registered brand found on the name or any phrase in the copy. Do not add accounting-software brand names (QuickBooks, FreshBooks, Wave, Xero, Bench) or other sellers' shop names to titles, tags, or descriptions — ever. "IRS" appears only in factual references to the standard mileage rate and Form 1040-ES; never write "IRS-approved" or imply endorsement.

**QA status (updated 2026-08-03 after the skeptical-buyer review):** all 925 formulas verified programmatically by `verify_bookkeeping.py` — every formula string matched its expected ranges, and 541 key values were recomputed independently in Python and matched the LibreOffice-recalculated cache (worked example: ledger in $4,650.00 / out $725.46 / net $3,924.54; Jan $1,500.00 in, April net −$61.00 exercising the red light; invoiced $5,740.00, collected $4,650.00, outstanding $1,090.00 with 2 OVERDUE = $610.00 and 1 SENT as of the 2026-08-03 build — statuses are TODAY()-based and refresh on open; mileage 232 mi × $0.70 = $162.40; tax estimate $951.14 total → 20.5% suggested set-aside; dashboard year margin 84.4%, best month $1,409.41). Traffic-light conditional formatting verified on ledger monthly net, invoice status, days-overdue aging, and dashboard profit. Review fixes shipped and machine-asserted: real DataValidation dropdowns on the Ledger — Type is a strict Income/Expense dropdown (the totals count those exact words, so typos can no longer silently zero them) and Category is a 17-option suggestion dropdown that still accepts free text; invoice Status needs no dropdown because it is computed by formula (PAID/SENT/OVERDUE — nothing to type at all); the Ledger "Money in / Money out / Net profit (year so far)" labels merge B:E and the Dashboard "Best month (profit)" / "Average month" labels merge B:D so nothing clips; all money summary cells (ledger stats, invoice Invoiced/Collected/Outstanding/Overdue, dashboard best/average) render zero as $0.00 instead of "-"; and the P&L Dashboard now leads with a native chart — money-in/money-out columns (navy/gold) plus a teal profit line on ONE shared $ axis, fed by the real dashboard ranges. Google Sheets converts the chart and dropdowns on upload (chart colors can shift slightly; data identical). No macros; 2,304 yellow input cells and none contains a formula. Do a 2-minute visual check on first Google Sheets open — Sheets recalculates automatically.

## Etsy listing fields (paste as-is)

**Type:** Digital download · **Category:** accept Etsy's suggestion for "bookkeeping spreadsheet" · **Price:** $19.99 · **Quantity:** 999

**Title (134 chars — Etsy max 140):**
Small Business Bookkeeping Spreadsheet, Invoice Tracker Template Google Sheets Excel, Income Expense Ledger, Mileage Log, Tax Estimate

**Tags (13, all ≤20 chars — Etsy cap):**
`bookkeeping` · `invoice tracker` · `small business` · `income expense` · `expense tracker` · `bookkeeping template` · `mileage log` · `profit and loss` · `self employed` · `quarterly taxes` · `cleaning business` · `freelancer` · `invoice template`

**Description:**
Know exactly where your business money goes — and who still owes you.

You started your cleaning, landscaping, or freelance business to do the work, not the paperwork. This one workbook keeps the paperwork to minutes a week: log money in and out on one ledger, track every invoice until it's PAID (overdue ones turn red on their own), and see a suggested tax set-aside built from your real numbers so quarterly taxes never ambush you.

WHAT YOU GET (instant download, use forever)
★ Income & Expense Ledger — Income/Expense and category dropdowns (no typos, no broken totals), monthly subtotals and year totals that fill themselves
★ Invoice Tracker — sent / due / paid dates; every invoice stamped PAID, SENT, or OVERDUE with days-overdue aging and who-owes-you totals
★ Quarterly Tax Estimate — a simplified set-aside estimate from your ledger (an estimate, not tax advice — bring the number to your tax pro)
★ P&L Dashboard — income vs expense chart with a profit line, profit by month with traffic-light colors, margins, year totals
★ Mileage Log — log drives, type in the current standard mileage rate, the deduction math is done for you
★ Start-Here guide — color-coded cells and a complete worked example business, so you're never staring at a blank sheet

WORKS WITH
✓ Google Sheets (free) — upload to Drive and it just works, colors and all
✓ Microsoft Excel (2010 or newer)
✓ Desktop, laptop, tablet — formulas only, no macros, nothing to enable

HOW IT WORKS
1. Download instantly after purchase
2. Replace the example numbers in the yellow cells with your own — everything recalculates as you type
3. Minutes a week: log payments and expenses, mark invoices paid, chase the red rows

Please note: the tax tab is a simplified estimate to help you set money aside — it is not tax, legal, or accounting advice, and this product is not affiliated with or endorsed by any government agency. Confirm your actual numbers with a tax professional.

Please note: this is a digital download — no physical item ships. Because of the nature of digital files all sales are final, BUT if the file doesn't work, doesn't match this description, or you bought a duplicate by accident, we'll refund you, full stop. Message us anytime — we're real humans and we answer fast.

*Spreadsheet template created with AI-assisted design tools and human review/testing.*

## Gumroad twin listing
Same files/copy · Price $17.99 · URL slug: `small-business-bookkeeping-tracker`
