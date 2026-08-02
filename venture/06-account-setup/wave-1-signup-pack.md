# Wave 1 Signup Pack — Your ~75 Minutes of Human Work

These are the only steps that legally/technically require you (identity, banking, account ownership). Everything is pre-written — you're mostly pasting. Do them in order, ideally in one sitting, from your **home internet (no VPN — VPN signups are Etsy's #1 instant-suspension trigger)**.

When you finish, tell the AI: **"accounts ready"** — it takes over from there (API keys → pipelines → scheduled runs).

---

## Step 0 — Pick the shop name (5 min)
Criteria: 2 words, easy to spell, gift-flexible (not niche-locked), no existing brand.
Candidates to check (or your own): **Willow & Pine Studio · KeepsakeCraft Co · The Gifted Nest**
Check all three boxes for whichever you pick:
1. USPTO trademark search: https://tmsearch.uspto.gov → no live marks in classes 25/21/16
2. Etsy search: https://www.etsy.com/search?q=YOURNAME → no existing shop with the name
3. Domain check (for Wave 3): the .com is available (any registrar)

## Step 1 — Support email (10 min)
1. In your Gmail (twopillarsmarketingteam@gmail.com or a new free Gmail dedicated to the shop — **new one recommended** to keep automation permissions clean): create it at https://accounts.google.com/signup if new.
2. This address is used for ALL signups below — one inbox = one place the AI reads.

## Step 2 — Etsy shop (25 min) — https://www.etsy.com/sell
Field-by-field:
- Email: the support Gmail · Name: **your exact legal name as on your bank account** (mismatch = suspension)
- Shop language `English` · country `United States` · currency `USD`
- Shop name: from Step 0
- **First listing requirement:** Etsy requires 1 listing to open. Use the starter listing package the AI has queued in `07-automation/tracker/publish-queue/` (copy/paste title, tags, description, upload the image file). Set quantity 10, price as specified.
- Billing: your card (covers the one-time $15–29 setup fee + $0.20 listings)
- Payout: your bank account (routing + account number) — again, name must match exactly
- Taxpayer info: your SSN (sole prop) — accurate, matching your legal name/address
- ⚠️ Expect a **payment reserve** as a new shop (~30% of each sale held ~45 days or until tracking uploads). Normal, not a problem — just don't be surprised.
- Then: Shop Manager → Settings → **About section: paste the pre-written bio** (below) — complete About sections feed the customer-experience score Etsy ranks by.

**Pre-written shop announcement (paste as-is, edit to taste):**
> Welcome! We make personalized keepsakes (made to order, just for you) and practical templates that save you hours. Small US shop — real humans, fast replies, and if anything's ever not right, we fix it, period.

**Pre-written About/bio:**
> We're a small US-based studio combining hand-finished personalization with modern design tools. Every physical item is made to order by our US production partners; every template is built and tested by us. Questions? Message us — we answer fast.

- Policies: Settings → Policies → use the text from `04-operations/refund-and-shipping-policies.md` (POD + digital sections).

## Step 3 — Printify (10 min) — https://printify.com/app/register
- Sign up with the support Gmail · plan: **Free**
- Connect Etsy: Manage stores → Add store → Etsy → authorize (2 clicks)
- Wallet/billing: add your card (Printify charges base cost per order as sales come in — you're always cash-positive because Etsy collected first)
- My profile → API tokens → **Generate token** → save it in your password manager (the AI will ask you to place it in the automation's secret store — never in this repo)

## Step 4 — Gumroad (5 min) — https://gumroad.com/signup
- Support Gmail · username = shop name (no spaces)
- Settings → Payments: bank account for weekly payouts
- Settings → Advanced → **Create application** → copy the access token → password manager (same drill)

## Step 5 — Etsy API key (10 min, do AFTER shop exists) — https://www.etsy.com/developers/register
- Log in with the shop account → register a new app
- App name: `ShopOps Agent` · Type: **Seller App** (own-shop automation — approval is typically instant)
- Describe use: "Automated listing management, order tracking, and inventory sync for my own shop."
- Copy the keystring + shared secret → password manager

## Step 6 — Pinterest + Buffer (10 min)
- Pinterest **business** account: https://business.pinterest.com → sign up with support Gmail → claim nothing yet
- Buffer free: https://buffer.com → connect the Pinterest account → that's it (the AI schedules pins through it)

## Done — hand back to the AI
Say **"accounts ready"** and (via your password manager / secrets flow, not chat) make available: Printify token, Etsy keystring+secret, Gumroad token. The AI then: publishes the queued starter listings (slow, human-paced for the first week — new-shop bot heuristics are real), wires the daily/weekly scheduled runs (`07-automation/routines/`), and starts the Pinterest pipeline.

## Later accounts (wave-triggered — do NOT create now)
| Account | When | Note |
|---|---|---|
| eBay seller | A POD niche hits 3+ sales/30d | 250 free listings; expect 10-item/$500 starter cap |
| MailerLite + Cloudflare Pages + (existing) Stripe | Digital ≥ $250/mo | Own-store stack; Stripe tripwire active day one |
| EIN (free, irs.gov) | First consistent sales month | 10 min; keeps SSN off tax forms |
| Resale certificate + eBay (if not already) | Wave 2 arbitrage activation | State revenue dept site |
| Amazon Professional | Only if arbitrage scales | Budget 1–3 weeks verification pain |
| OnlineJobs.ph employer | CS >30–45 min/day or Wave 2 VA mode | Job post template ready in `04-operations/va-hiring-guide.md` |
| LLC | Profit consistently >$1,500/mo | ~$50–500 by state |
