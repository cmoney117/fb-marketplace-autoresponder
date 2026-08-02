# Round-2 Setup Additions — Fast Lane (do AFTER or alongside the Wave-1 signup pack)

## A. Two permission fixes (5 min total — unblocks me completely)
1. **GitHub write access:** github.com → Settings → Applications → Claude → grant write for `cmoney117/fb-marketplace-autoresponder`. (I have 6+ commits waiting to push.)
2. **Vercel deploy permission:** the Claude/Vercel integration currently can't create projects (403). Either grant it project-create permission in the Vercel dashboard (team "usa1"), or create an empty project named `willow-pine-store` yourself — then I deploy the finished store in minutes. Note: commercial use needs Vercel Pro ($20/mo) — flip when the store goes live, not before.

## B. Stripe Payment Links (~20 min, in your existing Stripe dashboard)
Create 5 products at dashboard.stripe.com → Product catalog → Add product; for each, "Create payment link":
| Product | Price | After payment |
|---|---|---|
| The Paycheck Budget | $14.99 | Redirect to `<store-url>/success.html` |
| Debt Payoff Planner | $14.99 | same |
| Savings Goal Tracker | $12.99 | same |
| Money Reset Bundle | $29.99 | same |
| (Bump) Printable Savings Challenge Pack | $9.99 | added as an OPTIONAL item on the four links above ("Add another product" → mark optional) |
Also: Settings → Public details → statement descriptor = `PAYCHECKBUDGET` (matches the store brand — buyers must see the same name on the ad, the store, and the bank statement) — ONLY if that doesn't disturb the descriptor your existing business uses. Paste the 4 payment-link URLs to me (they're public URLs, safe to share in chat) and I wire them into the store + set up delivery emails.

## C. Ad accounts (~25 min — no spend happens at signup)
1. **Pinterest business** account (Wave-1 pack Step 6 — same account) → Ads → set up billing. Do NOT launch anything; I prepare campaigns, you approve the $50/day start.
2. **Meta Business Suite:** business.facebook.com → create Business portfolio → Ad account (USD) + Meta Pixel (Data Sources → create pixel, name `store-pixel`, send me the pixel ID — it's public-safe). New ad accounts often carry a ~$50/day cap initially; that matches our plan anyway.
3. **Domain** (~$12/yr, any registrar): pick per Wave-1 Step 0 naming rules. Needed before ads run (ads to a vercel.app URL convert poorly and look untrusted).

## D. Fiverr (Lane C, ~20 min, $0)
Sign up at fiverr.com with the support Gmail → complete seller profile (real name, photo, honest "AI-assisted studio" description). I've drafted all three gig listings — say "fiverr ready" and I'll hand you the paste-ready gig copy + images. You (or a VA later) handle buyer messages; I fulfill.

## E. Optional Lane D (only if you want B2B recurring revenue)
Say "build lead rescue" (dealer CRM pivot, ~2 AI-weeks, you sell 4-8 hrs/wk) and/or "build receptionist" (AI phone agent — we can dogfood it on your home-services business first as the case study). Nothing happens on these without your explicit go.
