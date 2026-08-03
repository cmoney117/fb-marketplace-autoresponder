# Listing Package: Wedding Budget & Guest Tracker v1 (Wave-1 sibling — wedding operational template)

**Files:** `Wedding-Budget-Guest-Tracker.xlsx` (the product) · `01-cover.png` (listing image) · `store-card.svg` (storefront card — the storefront pipeline copies it into `store/site/img/` at publish time; the build script no longer writes outside this folder) · `build_product.py` (regenerates everything deterministically AND re-verifies every formula plus the dropdowns, chart, and label/format fixes)

**IP screen (2026-08-02): PASSED.** Web search on "Wedding Budget & Guest Tracker" found no registered brand or dominant branded product — only generic descriptive tools (WeddingWire, Loverly, Vertex42 free templates, unbranded Etsy/Gumroad listings). All words in the name and copy are generic descriptive terms. Do not add wedding-platform brand names (The Knot, Zola, WeddingWire, Minted, Joy) to titles, tags, or descriptions — ever. Brand-authority filter: trust source = product preview + occasion (wedding), verdict ✅ Strong; sold as an organizer tool, zero advice framing.

**QA status (updated 2026-08-03 after the skeptical-buyer review):** all 66 formulas verified programmatically by `build_product.py` (worked example expected values: planned $24,000 of $24,000 budget → Left to Plan $0; typical-% column sums to 100% and Typical $ recomputes from the buyer's own budget; spent so far $22,061.75 → remaining $1,938.25; guests 12 parties = 8 yes / 2 no / 2 waiting, headcount 16, meals 9 chicken / 4 beef / 3 vegetarian, thank-yous owed 2; vendors $17,745 contracted, $4,500 deposits paid, $13,245 still to pay). Review fixes shipped and machine-asserted: real DataValidation dropdowns replace every "type this word exactly" cell (RSVP Yes/No/Waiting strict; meal Chicken/Beef/Vegetarian as a suggestion list so other meals stay allowed; gift/thank-you and vendor Deposit/Final "Paid?" strict Yes/No — all convert to Google Sheets dropdowns on upload); the two bottom-line labels merge across B:F so they can never clip, and both bottom-line cells plus vendor Paid-so-far/Still-to-pay render zero as $0.00, not "-", so "watch Left to Plan hit $0" actually pays off; guest-stat labels merge D:E (no more "Thank-yous still o…"); a native planned-vs-actual column chart (navy planned / teal actual, real E8:F19 ranges) sits on the Wedding Budget tab — Google Sheets converts it on upload (colors can shift slightly; data identical). Do a 2-minute visual check on first Google Sheets open — Sheets recalculates automatically. Preview-everything rule: listing images must show all four tabs.

## Etsy listing fields (paste as-is)

**Type:** Digital download · **Category:** accept Etsy's suggestion for "wedding budget spreadsheet" · **Price:** $16.99 · **Quantity:** 999

**Title:**
Wedding Budget Spreadsheet, Wedding Planner Template Google Sheets Excel, Guest List Tracker, RSVP Meal Tracker, Vendor Payment Schedule

**Tags (13):**
`wedding budget` · `wedding spreadsheet` · `wedding planner` · `guest list tracker` · `wedding template` · `rsvp tracker` · `vendor tracker` · `wedding excel` · `wedding google sheet` · `wedding planning` · `wedding organizer` · `bride to be gift` · `engagement gift`

**Description:**
Plan the wedding, not a spreadsheet.

One organized file runs the three things that actually go wrong: the money, the guest list, and the vendor payments. Enter your total budget and the sheet suggests a starting split from typical real-wedding percentages — then plan your own numbers and watch "Left to Plan" hit $0. Every RSVP, meal count, and thank-you note is counted for you — picked from dropdowns, so a stray typo can never break a total. Every deposit and final payment has a due date and a Yes/No paid dropdown, so nothing sneaks up the month before the wedding.

WHAT YOU GET (instant download, use forever)
★ Wedding Budget — 12 categories with typical %-of-budget guidance, planned vs actual per category, a planned-vs-actual chart, and a running total against YOUR budget
★ Guest List — 100 rows ready to go; RSVP and meal dropdowns (chicken/beef/vegetarian), headcount, meal counts, gifts, and thank-yous-owed all counted automatically
★ Vendor Payment Schedule — every contract, deposit, balance, and due date; Yes/No paid dropdowns keep "Paid so far" and "Still to pay" always current
★ Start-Here guide — color-coded cells and a full worked example, so you're never staring at a blank sheet

WORKS WITH
✓ Google Sheets (free) — upload to Drive and it just works
✓ Microsoft Excel (2010 or newer)
✓ Desktop, laptop, tablet

HOW IT WORKS
1. Download instantly after purchase
2. Enter your total budget in one yellow cell
3. Fill the yellow cells as you book, invite, and pay — the sheet does every bit of math

Please note: this is a digital download — no physical item ships. Because of the nature of digital files all sales are final, BUT if the file doesn't work, doesn't match this description, or you bought a duplicate by accident, we'll refund you, full stop. Message us anytime — we're real humans and we answer fast.

*Spreadsheet template created with AI-assisted design tools and human review/testing.*

## Gumroad twin listing
Same files/copy · Price $14.99 · URL slug: `wedding-budget-guest-tracker`
