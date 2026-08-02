# The Autonomous Revenue Engine — Who Does Every Job (Owner: Nobody)

Owner directive (2026-08-02): *"The plan must generate revenue/sales WITHOUT me. You can do it or use any AI setup — I cannot be involved."*

This document maps every activity that produces a sale to the non-owner actor that performs it. It is the operating contract for the scheduled AI runs (`07-automation/routines/`).

## The one thing that cannot be delegated (legal fact, not a design choice)

Payment processors and marketplaces are legally required (KYC/AML, the INFORM Consumers Act, IRS reporting) to verify a **human identity** and a **bank account** before money can flow. No AI, VA, or "setup" can lawfully do this instead of you — anyone claiming otherwise is describing fraud, and handing your identity documents to a VA would violate every platform's ToS and expose you personally. **This is ~90–120 minutes, once, ever** — reduced to paste-ready steps in `06-account-setup/`. After that boundary is crossed, the table below is the entire business, and you appear nowhere in it.

## The job map

| Revenue job | Who does it | How |
|---|---|---|
| Deciding what to make next | AI (weekly review Routine) | Signal-driven production slots from tracker data; kill/scale rules pre-agreed |
| Making products (spreadsheets, designs, listings) | AI (daily Routine) | Build pipelines in `07-automation/pipelines/`; formulas machine-verified; IP + authority screens blocking |
| Publishing listings | AI via APIs | Etsy Seller-App API, Printify publish, Gumroad; queue for VA where no API |
| **Bringing in buyers — organic** | AI + the marketplaces | Etsy's own search traffic (the listing machine feeds it), Pinterest 10–15 pins/day via Buffer API, listing SEO refresh cycles |
| **Bringing in buyers — paid** | AI (within pre-set caps) | Campaigns built/managed via ad platform APIs per `05-marketing/ad-launch-runbook.md`. You approve a budget TIER once (e.g., "$50/day, $810 max at-risk"); the runs operate inside it and can only cut spend, never raise it past the tier, without a new approval. **Default on silence = keep current tier.** |
| Converting visitors | The store + marketplace listings | Landing pages already built to conversion-research spec; guarantee/FAQ/policies in place |
| Taking payment | Stripe / Etsy Payments / Gumroad | Automatic |
| Fulfillment | Automatic | Instant download (digital); Printify prints & ships (POD); tracking auto-uploaded |
| Customer service | AI (daily Routine), VA at volume | SOP + templates T1–T8; auto-send for safe categories; ≤$50 refunds automatic; VA hired *and managed* per `va-hiring-guide.md` when messages exceed ~30 min/day — the AI writes the job post, screens applicants, grades the test task, audits output; you only pay the invoice |
| Delay/dispute prevention | AI (delay-watcher) | FTC-compliant delay notices, tracking evidence uploads, dispute tripwires |
| Books, P&L, kill/scale decisions | AI (weekly Routine) | `tracker/pnl-weekly.csv`; every experiment closed out scale/iterate/kill |
| Reporting | AI → your inbox | 10-line Sunday email. **Read-only.** You never have to reply; tripwires are the only events that genuinely wait on you |

## Your total ongoing involvement (after the one-time signups)

1. **Read a 10-line email on Sundays.** Optional.
2. **Pay the bills** (card on file does it automatically).
3. **Answer a tripwire** if one fires (dispute spike, platform policy warning, budget-tier proposal). Frequency target: ~monthly or less. Every tripwire message comes with a recommended default so even silence is a safe answer.

## The ownerless B2B experiment (bonus lane, $0 owner hours, capped)

The two staged B2B plays were gated on owner sales time — that gate is now removed by redesign instead:
- **The AI receptionist demos itself.** Prospects don't need a salesperson; they call the number and the AI answers, books, and texts back. Landing page + self-demo line + Stripe payment link + automated onboarding form = a sales motion with no humans on our side.
- **Outreach is AI-run and legal:** low-volume (≤50/day), individually personalized, CAN-SPAM-compliant email to home-services businesses and used-car dealers (accurate sender, physical address, honored opt-out; B2B cold email requires no prior consent under US law). No DMs, no scraping social accounts, no volume blasting — this is the compliant channel that exists precisely for B2B.
- Cap: this lane gets built only after the store/Etsy lanes are live (they're closer to revenue), and its runbook gets the same at-risk discipline (tool costs ≤$50/mo until first customer).

## What this plan does NOT rely on (kept honest)

- No income guarantee — the engine guarantees *shots on goal at capped cost*, taken continuously without you. Research medians and good cases are in `00-decision-matrix.md`.
- No gray-zone shortcuts: every acquisition channel above survives an account review, because accounts ARE the machine.
- No "the AI owns the money" fictions: revenue lands in accounts under your identity, because that's the only legal architecture that exists.
