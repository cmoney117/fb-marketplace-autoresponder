# Wave 1B — The Fast Lane (ads unlocked, Stripe accepted, profitability-first)

Round-2 owner directives: profit ASAP, ad money fine, Stripe risk accepted, **zero tolerance for waste**. This plan adds speed to Wave 1 without abandoning its zero-burn base. Every lane below states its max at-risk number.

## Lane A — Own store + capped ads (max at-risk ≈ $810 + $20/mo hosting)

**Built this session:** 4-page storefront ("Willow & Pine Studio" — rename trivial) with product landing pages, policies, success page — `store/` in the repo, generator script included. **3 finished products + bundle**: The Paycheck Budget ($14.99), Debt Payoff Planner ($14.99), Savings Goal Tracker ($12.99), Money Reset Bundle ($29.99 — the ad product). All formulas verified; covers + listing packages done.

**To go live (owner, ~40 min):** Stripe Payment Links for the 4 products + $9.99 bump (5 min each in the Stripe dashboard — exact steps in `06-account-setup/round-2-additions.md`), grant Vercel deploy permission (or one click in the dashboard), pick/buy a domain (~$12/yr), Pinterest + Meta ad accounts. Then ads follow `05-marketing/ad-launch-runbook.md` — $50/day behind gates, ~$810 max at-risk before the go/no-go verdict.

**Why this can be profitable in week 1–2 when Etsy takes weeks:** paid intent traffic to a 90%-margin bundle with AOV engineering; research says Pinterest CPA $20–30 vs our $30 breakeven — thin but real, and the downside is capped.

## Lane B — Etsy + Gumroad (unchanged, $0/mo — the compounding base)

Same products dual-listed; ornament/POD lanes per Wave 1. Etsy's organic buyers + reviews become the store's social proof. Nothing about the fast lane replaces this; it's the zero-CAC floor under everything.

## Lane C — Fiverr productized gigs (max at-risk ≈ $0; near-certain small dollars)

Research: the highest-certainty first-dollar play we have. Three gigs, launched with owner's account (~20 min signup, AI drafts everything, AI fulfills, owner/VA handles buyer chat):
1. **Etsy listing SEO makeover** ($35/$75/$150 tiers) — we literally run this playbook daily for ourselves.
2. **Custom spreadsheet/calculator builds** ($50–150) — our verified-formula pipeline is the fulfillment engine.
3. **Product/market research reports** ($75–250) — the research machinery that produced these documents.
Expectations: first order in 2–6 weeks, $400–800/mo median by month 3 (20% Fiverr fee). Ceiling is low; certainty is high; zero spend.

## Lane D — STAGED, owner decision required: B2B recurring revenue

Two plays from the idea scan, both needing owner sales involvement (4–10 hrs/wk) — presented, not launched:

1. **"FBM Lead Rescue" dealer CRM ($149–199/mo/rooftop).** Pivot of the existing extension: AI-drafted replies the salesperson clicks to send + automated SMS/email follow-up off-platform. **Hard constraint: the current auto-send version is NOT sellable** — it violates Meta ToS, Meta now gives sellers free native AI replies, and 2026 enforcement = 30-day bans on ID-verified accounts. The pivot is honest and buildable in ~2 AI-weeks on the existing Vercel CRM. Comps: Podium $399+, CARVID $249. GTM: dealer forums/groups + CAN-SPAM-compliant B2B email + the existing dealer as case study.
2. **AI receptionist / missed-call-text-back for home-services businesses ($199–299/mo).** ElevenLabs (already connected) + Twilio; the owner KNOWS this industry and can dogfood it on their own company first — a zero-cost case study. $200–700/mo market comps prove willingness to pay.

Both are real recurring revenue; both stall without a human doing demos. Decision belongs to the owner: allocate sales hours (or a commission-based closer), or leave staged.

## What round 2 explicitly rejected
Selling the FB autoresponder as-is (ToS + Meta-native-feature squeeze); TikTok Shop ads at our budget (minimums eat it); August gift advertising (demand doesn't exist yet); any play requiring brand authority we don't have.

## The combined machine at steady state
Etsy compounds free → store converts paid traffic at capped risk → Fiverr pays the tool bills → weekly review kills losers and feeds winners → Q4 ornaments (organic + ads) → Q5 budget-tool ad window in January. B2B lanes bolt on whenever the owner wants recurring revenue enough to sell it.
