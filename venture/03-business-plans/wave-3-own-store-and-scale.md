# Wave 3 Blueprint — Own Store, Channel Expansion, Paid Ads (triggered by signal, not by calendar)

**Status: staged.** Wave 3 actions fire automatically as tracker triggers are hit — the weekly review checks them.

## Trigger 1 — Digital revenue ≥ $250–300/mo → launch own store
- **Why that number:** Gumroad takes ~13–15%; a Stripe-checkout store takes ~4% effective. The gap pays hosting + effort above ~$250–300/mo (research §3 crossover math).
- **Stack:** Next.js storefront on **Cloudflare Pages (free tier explicitly allows commercial use)** — NOT Vercel Hobby (ToS prohibits commercial; Vercel Pro $20/mo is the fallback if we want Vercel features). Stripe Payment Links first (zero-frontend, live in an hour), full checkout later. MailerLite free tier + abandoned-cart/welcome/post-purchase flows on day one.
- **Stripe protections from order #1** (this is where the reused account meets the public): tracking/delivery-evidence upload automated, brand-name statement descriptor, delivery windows on every page, 0.4% dispute tripwire with auto-pause (see compliance §4).

## Trigger 2 — Any POD niche with 3+ sales/30 days → eBay expansion
250 free listings/mo, no store subscription; new-seller cap (~10 items/$500/mo) makes eBay a winners-only channel: port the proven designs, request limit raises monthly. Printful/Printify both integrate eBay natively.

## Trigger 3 — Any product ≥5 organic sales/30 days AND margin clears breakeven-ROAS bar → paid ads
Start Pinterest $5–10/day (cheapest CPA, our demographic, creatives already exist from the organic pin pipeline). Meta only at ≥$500–1,000/mo test budget. Full framework: `05-marketing/ads-system.md`. Owner approves each budget tier once; the weekly run manages within it.

## Trigger 4 — Sustained $2k+/mo profit → structure upgrades
LLC formation, bookkeeping tool, separate business banking, quarterly estimated taxes, Printify Premium/Printful Growth if not already, VA for CS. Each is a checklist item in `06-account-setup/`, pre-researched, executed when the trigger hits — not before.

## Explicitly deferred indefinitely
- TikTok Shop (fee + affiliate + returns stack ≈30% real cost; revisit only with proven winners and video creative pipeline running).
- Amazon for POD/digital (verification gauntlet + strictest automation limits; arbitrage may use it first).
- Programmatic SEO/blog (12+ month payback; marketplaces win every earlier month).
- Classic dropshipping (see decision matrix — not launching).
