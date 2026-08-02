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

*(Rows 9+ appended as research concludes and launch waves are chosen.)*
