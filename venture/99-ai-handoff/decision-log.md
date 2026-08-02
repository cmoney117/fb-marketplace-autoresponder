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

| 14 | 2026-08-02 | **Brand-authority filter adopted as a blocking gate** in both product pipelines; Notion templates + AI prompt packs demoted out of launch waves; $49.99 price ceiling until 25+ reviews; finance/health/legal sold as tools only, never advice | Owner directive: only pursue products sellable without brand authority we don't have ("Dave Ramsey could sell a million budgeting calculators — we can't") | Owner (directive), AI (implementation) |
| 15 | 2026-08-02 | Starter product renamed "Budget by Paycheck" → **"The Paycheck Budget"** (`paycheck-budget-v1/`); files, images, and listing copy rebuilt; the phrase banned from all future titles/tags/copy | IP screen (prompted by the authority review) found "Budget by Paycheck®" is The Budget Mom, LLC's registered method brand (THE BUDGET MOM: USPTO reg. 6012668, spreadsheets/workbooks in financial planning) | AI |

| 16 | 2026-08-02 | **Ads unlocked; Stripe-ban risk explicitly accepted by owner; profitability-first constraint added ("I will not waste money")** | Owner directives (round 2) | Owner |
| 17 | 2026-08-02 | Fast lane launched: own store built (`store/`, Willow & Pine Studio) + 2 sibling products + Money Reset Bundle $29.99 as the AD product (AOV engineering — singles can't beat $30-38 CPAs); $50/day runbook with **hard $810 max at-risk cap** before go/no-go | `02-research/06-paid-ads-fast-lane.md`; owner's no-waste rule | AI (per research) |
| 18 | 2026-08-02 | Pinterest-first ads (keyword intent, $30/day), Meta second ($20/day); NO gift ads before ~Sept 20; Q5 (Dec 26+) reserved for budget-tool push | Research: platform economics + seasonal demand curves | AI (per research) |
| 19 | 2026-08-02 | **FB autoresponder will NOT be sold as-is** (Meta ToS + free native Meta AI replies + 2026 ban waves). Compliant pivot "FBM Lead Rescue" (draft-assist + off-platform follow-up, $149-199/mo) STAGED pending owner sales commitment; AI-receptionist play also staged | `02-research/07-fast-revenue-idea-scan.md` compliance findings | AI (verdict), Owner (activation pending) |
| 20 | 2026-08-02 | Fiverr productized-gig lane (Lane C) adopted as zero-risk certain-revenue floor: Etsy SEO, spreadsheet builds, research reports | Highest-certainty first-dollar play in scan; platform supplies trust | AI |
| 21 | 2026-08-02 | Blockers logged: GitHub write 403 (7 commits local-only) and Vercel project-create 403 — both need one-time owner permission grants; deliverables mirrored via zip + Drive meanwhile | Session constraints | AI |

*(Rows 22+ appended as launch proceeds.)*
