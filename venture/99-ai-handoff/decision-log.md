# Decision Log

Append-only. Every consequential decision gets a row. Newest last.

| # | Date | Decision | Why | Made by |
|---|---|---|---|---|
| 1 | 2026-08-02 | Venture HQ lives in this repo under `venture/`, on branch `claude/dropshipping-passive-income-q9a65v` | Build environment is remote (no desktop access); repo = versioned, agent-accessible | AI (constraint) |
| 2 | 2026-08-02 | Budget: minimal pre-validation, uncapped scaling post-profit | Owner directive | Owner |
| 3 | 2026-08-02 | Research all 4 models (POD / dropship / digital / arbitrage), sequencing decided by scored matrix | Owner directive ("maybe try all — research and weigh") | Owner |
| 4 | 2026-08-02 | Reuse existing Stripe account for own-store payments | Owner directive, risk flagged and accepted; mitigations + 0.4% dispute tripwire adopted; marketplaces self-process so Stripe exposure is own-store only | Owner (risk), AI (mitigations) |
| 5 | 2026-08-02 | Sales channels chosen by research, optimizing speed-to-profit | Owner directive | Owner |
| 6 | 2026-08-02 | Hard rule: no ToS-violating automation (engagement bots, DM spam, fake reviews); organic = marketplace SEO, official-API scheduling, email, human VAs | Account/processor bans are the #1 existential risk to an automation-first business; also legality (FTC fake-review rule) | AI |
| 7 | 2026-08-02 | "Sell before stock" implemented as POD/dropship/preorder with disclosed windows + auto delay-notify/refund (FTC 30-Day Rule) | Legal implementation of owner's validation-first philosophy | AI |
| 8 | 2026-08-02 | Tracker/state layer starts as files in-repo (`07-automation/tracker/`), Supabase deferred until scale demands it | Zero cost, git-versioned, every scheduled agent can read/write; avoids infra before revenue | AI |

| 9 | 2026-08-02 | **Wave 1 = one Etsy shop, two lanes: digital products + POD** (ornaments/pet-memorial/profession niches; budget spreadsheets/business templates/wedding-ops). $0/mo fixed, Stripe untouched | Decision matrix: digital 8.8, POD 7.3 on owner-weighted criteria; Q4 ornament window closes ~Labor Day | AI (per matrix) |
| 10 | 2026-08-02 | **Classic dropshipping NOT launched** | Bottom score (4.6): worst failure data (80–95%), real cost is $1,000–1,500/mo ads, and it's the one model where Stripe reuse is documented-dangerous | AI (per matrix) |
| 11 | 2026-08-02 | **Arbitrage staged as optional Wave 2** (eBay-first, books + Q4 clearance; solo or VA-driven modes) — owner asked once in late September | Fastest to profit (score hit: least hands-off + converts cash to inventory, both owner-weighted negatives) | AI; owner decides activation |
| 12 | 2026-08-02 | Own store (Wave 3) on **Cloudflare Pages free tier**, not Vercel Hobby | Vercel Hobby ToS prohibits commercial use; Cloudflare free tier permits it | AI (research) |
| 13 | 2026-08-02 | First product built pre-signup: Budget-by-Paycheck xlsx (formulas verified programmatically; LibreOffice recalc unavailable in build env — owner does 2-min visual check on first Sheets open) | Etsy signup requires one listing; makes the owner's 75-min setup fully paste-ready | AI |

*(Rows 14+ appended as launch proceeds.)*
