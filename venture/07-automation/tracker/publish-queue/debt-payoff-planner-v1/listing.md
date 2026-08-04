# Listing Package: Debt Payoff Planner v2 (Wave-1 sibling — debt strategy tool)

**Files:** `Debt-Payoff-Planner.xlsx` (the product) · **`listing-images/` (Etsy/Gumroad upload set, in order: `01-cover.png`, `02-my-debts.png`, `03-snowball-plan.png`, `04-progress-charts.png`, `05-start-here.png`, `06-whats-included.png`, `07-under-the-hood.png`) — real LibreOffice-rendered screenshots of the shipped v2 workbook (all 7 tabs shown incl. both charts and a schedule-engine peek), composed at 2000×1500 in the house palette.** The older root `01-cover.png` is the pre-review stylized mockup — superseded; kept for reference only, do not upload. · `build_debt.py` (regenerates the workbook deterministically) · `verify_debt.py` (re-derives every formula, re-runs the payoff engine in Python plus an independently coded second simulator, and compares every cached cell; must pass before publish).

**IP note (2026-08-02):** name and copy use only generic descriptive method terms ("debt snowball", "debt avalanche" — generic strategy names in wide unbranded use). Never add influencer or brand names (Dave Ramsey, Baby Steps, EveryDollar, The Budget Mom, Undebt.it, etc.) to titles, tags, or descriptions — ever. Sold as a calculator/organizer tool, never advice (brand-authority gate).

**QA status (v2, 2026-08-03):** the v1 file was first reproduced cell-for-cell from a generator script and diffed against the shipped xlsx (equivalent on values, formulas, formats, fills, fonts, borders, merges, widths) before any change — then v2 was built on top. v2 replaces the review-flagged unlinked 5-row strategy copies with a real payoff engine: two Schedule tabs amortize all 10 debts month by month for up to 360 months (interest at APR÷12; every debt gets its minimum; the whole extra payment plus every freed-up minimum rolls onto the top unpaid debt), and the Snowball/Avalanche tabs formula-link to My Debts (SMALL/MATCH/INDEX auto-ordering — no re-typing, no yellow cells there) and show a projected debt-free MONTH + YEAR per debt and overall, total interest, and months/interest saved vs a minimums-only run of the same engine. Verified three ways by `verify_debt.py`: all 46,436 formula strings re-derived and matched; 46,415 cached values matched a Python re-implementation of the engine (every month × every debt × plan + baseline × both strategies); an independently coded second simulator agreed on every balance, every payoff month, and total interest, with conservation and minimum-payment invariants asserted. Worked example: $18,190 of debt, $715/mo attack → Snowball debt-free month 31 with $3,387.30 interest, Avalanche month 30 with $3,163.88, minimums-only 42 months / $5,459.57 (extra payment saves 11 months and $2,072.27). Charts: native Excel balance-decline line (Snowball navy / Avalanche teal / minimums-only gold, first 120 months) + per-debt bars on Progress; Google Sheets converts them on upload (colors can shift slightly; data identical). Honest limits, stated in START HERE: monthly compounding at APR÷12, dates project from TODAY() and shift with real due dates; "30+ years" shown when a payment doesn't cover interest. Do a 2-minute visual check on first Google Sheets open — Sheets recalculates automatically.

## Etsy listing fields (paste as-is)

**Type:** Digital download · **Category:** accept Etsy's suggestion for "debt payoff spreadsheet" · **Price:** $14.99 · **Quantity:** 999

**Title (130 chars — Etsy max 140):**
Debt Snowball Spreadsheet, Debt Payoff Planner Google Sheets Excel, Debt Avalanche Calculator, Debt Free Tracker, Digital Download

**Tags (13, all ≤20 chars — Etsy cap):**
`debt snowball` · `debt payoff planner` · `debt payoff tracker` · `debt avalanche` · `debt free tracker` · `debt spreadsheet` · `credit card payoff` · `loan payoff tracker` · `debt free journey` · `budget spreadsheet` · `money tracker` · `payoff calculator` · `digital download`

**Description:**
Snowball or Avalanche — see your projected debt-free date either way.

Enter your debts and your extra payment once. The built-in month-by-month payoff engine runs both strategies on all your debts and shows the month and year you're projected to be debt-free — plus what your extra payment actually saves you.

WHAT YOU GET (instant download, use forever)
★ List up to 10 debts ONCE — the Snowball and Avalanche tabs re-order them automatically (nothing to re-type, ever)
★ A real amortization engine (up to 360 months, built from formulas — look under the hood on the Schedule tabs) computes each debt's payoff month AND your overall projected debt-free month + year
★ Total interest under each plan, and the months + interest your extra payment saves vs minimums only
★ Balance-decline chart (Snowball vs Avalanche vs minimums-only) + per-debt chart on the Progress tab
★ Progress log that makes paying debt weirdly satisfying

WORKS WITH
✓ Google Sheets (free) — upload to Drive and it just works (charts convert to Sheets charts)
✓ Microsoft Excel (2010 or newer)
✓ Desktop, laptop, tablet — formulas only, no macros, nothing to enable

HOW IT WORKS
1. Download instantly after purchase
2. Enter your debts and your extra payment in the yellow cells
3. Read your projected debt-free date under Snowball vs Avalanche, pick your plan, log every win

Projected dates assume steady monthly payments with interest at APR ÷ 12, counted from today — real due dates can shift things a few weeks.

This is a calculator/organizer tool, not financial advice — it does the math on numbers you enter.

Please note: this is a digital download — no physical item ships. Because of the nature of digital files all sales are final, BUT if the file doesn't work, doesn't match this description, or you bought a duplicate by accident, we'll refund you, full stop. Message us anytime — we're real humans and we answer fast.

*Spreadsheet template created with AI-assisted design tools and human review/testing.*

## Gumroad twin listing
Same files/copy · Price $12.99 · URL slug: `debt-payoff-planner`
