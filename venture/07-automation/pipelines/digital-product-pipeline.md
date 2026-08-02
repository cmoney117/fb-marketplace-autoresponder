# Pipeline: Digital Product → Live Listing

Run by the daily/weekly ops agent. Digital products are the highest-margin, lowest-risk lane: zero COGS, zero shipping, zero supplier, instant delivery. The pipeline builds real, genuinely useful files — a bad digital product earns refunds and 1-star reviews just like a bad physical one.

## Steps

1. **Pick from the validated candidate list** (`02-research/02-products-and-niches.md` + tracker signal). One product per run, done well, beats five templates nobody needs.

2. **Build with AI, to a spec.** Write a 10-line product spec first (audience, job-to-be-done, pages/tabs/features, format(s), what makes it better than the free alternative). Then produce:
   - Spreadsheets (budget planners, trackers): build the actual .xlsx with working formulas, instructions tab, both US-letter/A4 where relevant.
   - Printables (planners, wall art, checklists): print-ready PDF (300dpi, bleed where needed) + letter/A4.
   - Templates (invoices, contracts, social kits): editable format the audience actually uses (Canva-link products need a Canva account — queue for owner once; otherwise .docx/.xlsx/PDF-form).
   - Notion templates: build in a dedicated workspace, sell the duplication link (one-time owner setup).

3. **Self-QA checklist (blocking):** every formula works with sample data; every link live; spelling pass; file opens on a phone; ZIP under platform size limits; a `START-HERE.pdf` inside every download explaining the files (cuts support messages ~in half).

4. **Listing assets:** 5–8 mockup images (device/desk mockups, feature callouts, "what's inside" graphic) — generated programmatically or via mockup templates. Image 1 must communicate the product's value with zero reading.

5. **Copy + publish:** `listing-copy-generator.md` → Etsy digital listing (instant download ON) via API/queue, and Gumroad via API. Same product, both channels, prices per business plan.

6. **Log** rows; schedule the +3-day review-request email (T8) for buyers where the platform allows follow-up messages.

## Iteration rule
Digital winners iterate free: any product with 3+ sales → build the "pro" version at 2–3× price and bundle (starter+pro). Any product with views but no sales after 200 views → new cover image first, price test second, rewrite description third (in that order — image fixes 70% of these).
