# Listing Package: Savings Goal Tracker v1 (Wave-1 sibling — savings goals tool)

**Files:** `Savings-Goal-Tracker.xlsx` (the product) · `01-cover.png` (listing image) · `build_product.py` (regenerates the xlsx deterministically — added 2026-08-03 after a verified cell-for-cell reproduction of the shipped v1) · `verify_product.py` (structure checks + LibreOffice formula recalc — run after any rebuild)

**IP note (2026-08-02):** name and copy use only generic descriptive terms ("savings tracker", "sinking funds", "52 week money challenge" — generic method names in wide unbranded use). Never add influencer or brand names (The Budget Mom, Dave Ramsey, EveryDollar, etc.) to titles, tags, or descriptions — ever. Sold as a calculator/organizer tool, never advice (brand-authority gate).

**QA status (2026-08-03, post P1-review fixes):** `verify_product.py` passes — every key formula recalculated with LibreOffice as ground truth (goal $/mo 215/167/175 match the cover image; 52-week total $1,378; Savings Log total range matches the yellow input rows exactly). P1 fixes verified in-file: **the "a date" promise is now honored** — a "Funded by (auto)" column computes each goal's funded month via `EDATE(TODAY(), months left)` (shows FUNDED! once saved ≥ target), so the cover/copy line "a number, a date, and a plan" is true. Note the date is *computed from the months-left input* — still never claim buyers can type a target date. Also added: native per-goal progress bar chart + data-bar conditional formatting on "% there" (teal house palette, wired to live ranges), Savings Log "Goal" dropdown fed by the My Goals names (defined name `GoalList`), 52-Week "Done?" x-dropdown, hero cells render $0.00 (not "-"), landscape fit-to-width print setup. Chart and dropdowns convert on Google Sheets import (chart colors may shift slightly — noted honestly in the file's START HERE). Do a 2-minute visual check on first Google Sheets open — Sheets recalculates automatically.

## Etsy listing fields (paste as-is)

**Type:** Digital download · **Category:** accept Etsy's suggestion for "savings tracker spreadsheet" · **Price:** $12.99 · **Quantity:** 999

**Title (127 chars — Etsy max 140):**
Savings Tracker Spreadsheet, Savings Goal Planner Google Sheets Excel, 52 Week Money Challenge, Sinking Funds, Digital Download

**Tags (13, all ≤20 chars — Etsy cap):**
`savings tracker` · `savings goal tracker` · `savings planner` · `sinking funds` · `52 week challenge` · `savings challenge` · `emergency fund` · `savings spreadsheet` · `money tracker` · `money saving chart` · `google sheets budget` · `budget spreadsheet` · `digital download`

**Description:**
Every goal gets a number, a date, and a plan.

Up to 8 goals with an automatic save-per-month plan and a computed "Funded by" month for each goal, a deposit log, and the classic 52-Week Challenge built in ($1,378 by week 52).

WHAT YOU GET (instant download, use forever)
★ 8 goals with % progress, required monthly savings, and the month each goal is funded — calculated for you
★ Progress chart + in-cell progress bars that fill as you save
★ 52-Week Challenge tab with running total
★ Savings log — every deposit recorded, with a goal dropdown so entries always match your goals

WORKS WITH
✓ Google Sheets (free) — upload to Drive and it just works
✓ Microsoft Excel (2010 or newer)
✓ Desktop, laptop, tablet

HOW IT WORKS
1. Download instantly after purchase
2. Enter each goal's name, target, and months left in the yellow cells
3. Save the monthly amount it calculates — it shows the month each goal is funded, and the progress bars fill as you log deposits

This is a calculator/organizer tool, not financial advice — it does the math on numbers you enter.

Please note: this is a digital download — no physical item ships. Because of the nature of digital files all sales are final, BUT if the file doesn't work, doesn't match this description, or you bought a duplicate by accident, we'll refund you, full stop. Message us anytime — we're real humans and we answer fast.

*Spreadsheet template created with AI-assisted design tools and human review/testing.*

## Gumroad twin listing
Same files/copy · Price $10.99 · URL slug: `savings-goal-tracker`
