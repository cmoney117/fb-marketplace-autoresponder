# Marketing/Sales Copy Review — non-store surfaces (2026-08-03)

Scope: outreach batches 2–3 (35 emails), fiverr-gig-pack.md, receptionist-outreach-kit.md (emails 2–4), receptionist/index.html, BROWSER-TASKS.md TASK-003B/008G/008H copy (report-only — file not touched), 8 publish-queue listing.md files. Batch 1 checked only for systemic flaws (it has two — see the box below). No reviewed file was edited.

**Mechanical verification done:** CAN-SPAM footer (Nashville address + "no thanks" opt-out) present in **all 52 staged emails** (17+17+18 — the grep surplus is file headers). Etsy tags: all 8 listings have exactly 13 tags, all ≤20 chars. Etsy titles: 7 of 8 within 140 chars; **1 over limit** (finding P1-6). Debt-planner workbook opened and checked against its listing claims (finding P1-7).

---

## ⚠ SYSTEMIC FLAWS THAT ALSO AFFECT BATCH 1 (already in Gmail — fix before TASK-012 sends)

**S-1. GAP angle misfires on shops that advertise 24-hour answering.** The GAP question ("what happens... if the answer is 'voicemail'") lands wrong when the recipient's whole brand is answering 24/7 — their honest answer is "we pick up," and the email reads like the sender didn't look at their site. Batches 2–3 mostly handle this correctly (they either use COST or explicitly name the hours-vs-promise contradiction). **Batch 1 does not** — it's all-GAP, and three drafts hit 24/7-advertising shops:
- `drafts-batch1.md` #6 Hoffner ("open 24 hours / 7 days a week for emergency service")
- `drafts-batch1.md` #13 Envision Electric ("Mon-Sun 7am-10pm plus 24/7 emergency")
- `drafts-batch1.md` #17 Carolina Air Care ("after-hours emergency services available")
Fix: before sending those three Gmail drafts, swap the middle paragraph for the COST paragraph used in batches 2–3 ("You're one of the few that actually answer around the clock — so you know what that costs: either an answering service that just takes messages, or somebody's phone going off at 2am."). TASK-012 currently forbids the worker from editing drafts beyond typos — the owner (or a task amendment) needs to authorize this specific swap, or accept three tone-deaf sends.

**S-2. Blind `{Company}'s` possessive templating.** The GAP subject appends `'s` to any company name, producing "Pros's / Guys's / Services's" (three instances in batch 3 — P1-1). Batch 1 happens to contain no plural-final names, so **batch 1 is clean**, but the template rule should be fixed for all future batches: names ending in s take a bare apostrophe.

---

## P1 — Errors (typos, grammar, factual/honesty problems, platform-limit violations)

### P1-1. Batch 3: wrong possessives on plural company names (3 subjects + matching body context)
File: `venture/03-business-plans/outreach/drafts-batch3.md` #8, #10, #12.
- Current: `who answers Alabama Tree Pros's phone at 9pm?` → Proposed: `who answers Alabama Tree Pros' phone at 9pm?`
- Current: `who answers The Well Guys's phone at 9pm?` → Proposed: `who answers The Well Guys' phone at 9pm?`
- Current: `who answers Top Notch Chimney Sweeps & Services's phone at 9pm?` → Proposed: `who answers Top Notch Chimney Sweeps & Services' phone at 9pm?`
Rationale: "s's" is a grammar error in the first line the prospect sees — the subject — and instantly reads as mail-merge.

### P1-2. Batch 2: doubled "after hours" in both pest-control emails
File: `drafts-batch2.md` #11 (Central Exterminating) and #12 (Kapture), body paragraph 2.
- Current: `when a customer calls after hours because they hear scratching in the wall after hours, what happens?`
- Proposed: `when a customer calls after hours because they hear scratching in the wall, what happens?`
Rationale: the emergency phrase already contained "after hours," so the template doubled it — obvious typo in the money sentence.

### P1-3. Batch 3: recursive "calls…because…sends them calling" in both chimney emails
File: `drafts-batch3.md` #12 (Top Notch) and #13 (Chimney Sweep Clean), body paragraph 2.
- Current: `when a customer calls after hours because a chimney-fire scare sends them calling after dark, what happens?`
- Proposed: `when a chimney-fire scare has someone calling after dark, what happens?`
Rationale: "calls because a scare sends them calling" is a nested tangle; the fix is shorter and keeps the fear-hook.

### P1-4. Batch 2 #16: COST claim contradicted by the email's own research
File: `drafts-batch2.md` #16 (Local Water Damage Restoration, Charlotte).
- Current: personalization says `indexed pages push the contact form and show no phone number` — then the next paragraph asserts `You're one of the few that actually answer around the clock`.
- Proposed (switch to GAP, use the real hook): `Found Local Water Damage Restoration while looking at Charlotte water damage restoration companies — 24/7 emergency water removal across Charlotte, Greensboro and Winston-Salem. One thing jumped out: the pages I found push a contact form, no phone number. When someone's got water coming through the ceiling at 2am, they're not filling out a form — they're calling whoever answers. We built an AI receptionist for service companies — it answers 24/7, triages real emergencies, and books the job. [demo line + footer unchanged]`
Rationale: telling a company with no listed phone number that they "actually answer around the clock" proves the email wasn't really read — and wastes the best hook in the whole batch.

### P1-5. Outreach kit: emails 2–4 specs don't mandate the CAN-SPAM footer
File: `venture/03-business-plans/receptionist-outreach-kit.md`, "The sequence" section.
- Current: only the Email 1 template carries `{address} · reply "no thanks"…`; the Email 2–4 one-line specs say nothing about the footer (Email 4 alone says "unsubscribe reiterated").
- Proposed: add one line under the sequence header: `Every touch — 1 through 4 — carries the same footer: AnswerPine — 159 4th Ave N, Ste 100 #2179, Nashville, TN 37219 · Reply "no thanks" and you'll never hear from me again.`
Rationale: CAN-SPAM requires the physical address and working opt-out on **every** commercial email, not just the first; the spec as written lets a future draft legally drift. (Batches 1–3 as staged are compliant — this is about touches 2–4, which don't exist as drafts yet.)

### P1-6. Etsy: Simple Budget title is 144 characters — over Etsy's 140 max
File: `venture/07-automation/tracker/publish-queue/simple-budget-starter-v1/listing.md`, Title field (the file gives no char count for this one; every sibling does — that's how it slipped).
- Current (144): `Simple Budget Spreadsheet, Easy Budget Template Google Sheets Excel, ADHD Budget Planner, Monthly Budget, Bill Payment Tracker, Digital Download`
- Proposed (126): `Simple Budget Spreadsheet, Easy Budget Template Google Sheets Excel, ADHD Budget Planner, Monthly Budget, Bill Payment Tracker`
Rationale: Etsy will reject or truncate it at publish time; "Digital Download" is the lowest-value phrase (it's already the listing type and a tag on siblings).

### P1-7. Etsy: Debt Payoff Planner description overstates the strategy tabs (verified against the xlsx)
File: `publish-queue/debt-payoff-planner-v1/listing.md`, Description bullet 1.
- Verified in `Debt-Payoff-Planner.xlsx`: **My Debts** accepts 10 debts (totals sum C7:C16), but **Snowball** and **Avalanche** each hold only 5 calculated rows.
- Current: `★ Room for 10 debts, with a pre-ranked worked example`
- Proposed: `★ List up to 10 debts; compare your top 5 side-by-side under Snowball vs Avalanche (a pre-ranked worked example shows you how)`
Rationale: a buyer with 8 debts finds 5 calculated comparison rows — refund/1-star risk; the file's own QA note documents the 5-row limitation but the customer-facing copy doesn't.

### P1-8. Etsy: Savings Goal Tracker hook claims "a date" — the file's own QA note forbids that
File: `publish-queue/savings-goal-tracker-v1/listing.md`, Description line 1.
- Current: `Every goal gets a number, a date, and a plan.` — but the QA note in the same file says: "goal timelines use a 'Months left' input, not a date field — never claim editable dates in copy."
- Proposed: `Every goal gets a number, a monthly amount, and a plan.`
Rationale: the hook violates the listing's own stated accuracy rule; "monthly amount" is also the tool's actual headline output.

### P1-9. Etsy: Savings Challenge Pack description ends in an unexpanded meta-instruction
File: `publish-queue/savings-challenge-pack-v1/listing.md`, Description field.
- Current: `…Instant download. *(Same guarantee + AI-disclosure lines as other listings.)*`
- Proposed: replace the parenthetical with the actual lines used on every sibling: `Please note: this is a digital download — no physical item ships. Because of the nature of digital files all sales are final, BUT if the file doesn't work, doesn't match this description, or you bought a duplicate by accident, we'll refund you, full stop. Message us anytime — we're real humans and we answer fast.` + `*Printables created with AI-assisted design tools and human review/testing.*`
Rationale: the file is labeled "paste as-is" elsewhere — a worker either publishes the placeholder verbatim or silently drops the guarantee and the AI disclosure (disclosure drift, the hard rule).

### P1-10. Fiverr Gig 1: "I run these exact playbooks on live shops daily" — credential inflation
File: `venture/03-business-plans/fiverr-gig-pack.md`, Gig 1 description, last sentence.
- Current: `I run these exact playbooks on live shops daily.`
- Proposed: `You get the same playbook I use on my own listings — reasoning shown, nothing hidden.`
Rationale: the venture's Etsy shop isn't open yet (TASK-006 parked) and no client shops exist; "live shops daily" is a claim we can't back — the honesty policy is the brand, and this is the one line that breaks it. (If even "my own listings" isn't live at posting time, cut the sentence entirely; the description stands without it.)

---

## P2 — Conversion upgrades (would a busy tradesperson reply / click / buy?)

### P2-1. Batches 2–3: research-note "surveillance voice" leaking into personalization lines
Several personalization clauses read like the internal prospect-research spreadsheet pasted into the email — analyst jargon plus an implicit "I audited your weaknesses" vibe. A tradesperson reads these as a dig, not homework. The GAP/COST split and the personalization facts stay; only the framing changes. Specific rewrites:

- `drafts-batch3.md` #2 (Glenn's 24hr Towing) — Current: `family-run 45+ years with 24hr literally in the company name; contact page still lists a fax line — minimal phone infrastructure.` → Proposed: `family-run 45+ years with 24hr literally in the company name.` (Drop the fax/infrastructure autopsy — the name alone carries the pitch.)
- `drafts-batch3.md` #4 (Knights Towing) — Current: `site routes larger jobs to a gmail address and everything else to one phone number — family-owned 24/7 shop with no dispatch layer.` → Proposed: `family-owned 24/7 shop where one phone number handles everything.` ("No dispatch layer" is consultant-speak; the one-number fact is the hook.)
- `drafts-batch3.md` #13 (Chimney Sweep Clean) — Current: `one small crew advertising 18+ service-area cities across the Baltimore metro (Annapolis to Hagerstown) — huge geographic promise for a shop reachable only by one cell and a gmail.` → Proposed: `one crew covering 18+ cities across the Baltimore metro, Annapolis to Hagerstown — that's a lot of ground for one phone.` (Same fact, admiration instead of audit.)
- `drafts-batch3.md` #18 (Major Drain) — Current: `family-owned Omaha drain specialist whose address is a Dodge Street mail-drop suite (#345) — truck-based operation with no storefront or front desk.` → Proposed: `family-owned Omaha drain specialist that runs from the trucks — no front desk between the customer and the crew.` (Citing their mail-drop suite number reads as creepy recon; the truck-based fact works without it.)
- `drafts-batch3.md` #16 (Brock's) — Current: `family-owned company claiming 24/7 emergency availability with a PO Box for an office — owner is almost certainly fielding after-hours calls personally.` → Proposed: `family-owned with 24/7 emergency availability — which in a shop your size almost always means the owner's cell IS the after-hours plan.` ("Claiming" is accusatory and the PO-Box observation adds surveillance flavor, not persuasion.)
- `drafts-batch3.md` #17 (ProDrain) — Current: `contact email is office@ — a small office answers, so nights/weekends clogs likely hit voicemail.` → Proposed: `a small office answers the phones — which usually means nights and weekends go to voicemail.` (Also fixes the "nights/weekends clogs" grammar; inferring staffing from an email prefix reads as a stretch.)

### P2-2. Batch 3: two angle mismatches on 24/7-branded towing companies
- `drafts-batch3.md` #6 (Northland Towing, domain 24hourtowingcompany.com) is GAP but profiles as COST. Current middle: `One question: when a customer calls after hours… If the answer is "voicemail," that job usually goes to whoever picks up.` → Proposed: swap in the standard COST paragraph (`You're one of the few that actually answer around the clock — so you know what that costs…`) and re-tag [COST]. Rationale: asking a company named "24 hour towing" who answers at 9pm invites a one-word dismissal ("we do").
- `drafts-batch3.md` #3 (Bozeman Road Rescue) is GAP on a self-described 24/7 outfit; the real hook is their own contact page admitting 3-hour response on written inquiries. Proposed middle paragraph: `Your own contact page says written inquiries can wait 3 hours and tells people to call instead — so at 2am, every job rides on one phone getting answered. What happens when it's already on a call?` Rationale: uses their admission instead of a voicemail premise they'd reject.

### P2-3. All batches: Email 1 has no reply path — add a one-line confidence hook
Files: `drafts-batch2.md` / `drafts-batch3.md` (and the kit template for future batches), after the demo sentence.
- Current: `…try to stump it.` (then straight to signature)
- Proposed addition: `…try to stump it. If it fumbles anything, reply and tell me what — I fix it the same day.`
Rationale: the demo-is-the-pitch design is right, but there's currently zero reason to reply; this adds a low-friction ask that doubles as a confidence signal, without lengthening the pitch. (Keeps address + opt-out untouched.)

### P2-4. COST subject line runs ~78 chars — company name gets truncated on phones
Files: `drafts-batch2.md` / `drafts-batch3.md`, all [COST] subjects.
- Current: `quick one — what does answering 24/7 actually cost David's Urgent Garage Door?`
- Proposed: `what does answering 24/7 actually cost {Company}?` (drop the "quick one — " prefix on COST only)
Rationale: mobile clients show ~40 chars; the current form cuts before the personalization, which is the only proof a human wrote it. GAP subjects are fine as-is.

### P2-5. Outreach kit: draft the actual Email 2–4 copy (currently one-line specs)
File: `receptionist-outreach-kit.md`. Proposed send-ready templates (footer per P1-5 on all three):
- **Email 2** — Subject: `the 9pm call, again` — `Hi — Cody again (the AI receptionist). No made-up industry stats, just your math: if your average job is $300 and one after-hours call a week hits voicemail, that's roughly $15,000 a year going to whoever picks up. Your numbers are different — that's worth 60 seconds to check. The demo's still up if you want to lean on it: {demo link}.`
- **Email 3** — Subject: `one missed job vs $249` (replaces the garbled `what it costs you vs what it costs`) — `AnswerPine is $249/mo flat — for most trades, one recovered after-hours job covers it. The first five businesses lock in $149/mo for life. Setup is a 10-minute form, and you hear it answering as YOUR company on a private test number before you pay a dollar: {form link}.`
- **Email 4** — Subject: `closing the file on {Company}` — `No reply needed — I'll assume the phones are covered and stop here. If a 2am voicemail ever costs you a job you wanted, the demo will still be at {landing URL}. Good luck out there.`
Rationale: email 3's current subject is genuinely confusing copy, and specs-not-drafts means the money touches get improvised later under time pressure; the conditional-math framing in Email 2 keeps the "sourced honestly" intent without inventing a statistic.

### P2-6. Landing page: price is invisible in the 5-second test
File: `receptionist/index.html`, hero buttons (line 42).
- Current: `<a class="btn" href="#pricing">See pricing</a>`
- Proposed: `<a class="btn" href="#pricing">$249/mo flat — see pricing</a>`
Rationale: hero answers "what is it" and "prove it" (demo button) but not "what's it cost"; naming the flat price up front qualifies clicks and matches the no-tricks brand.

### P2-7. Landing page: no CTA after the FAQ — the page just ends
File: `receptionist/index.html`, after the `.faq` div (before line 86 `</div>`).
- Proposed insert: `<div style="text-align:center;padding:0 0 50px"><a class="btn gold" href="#demo">Talk to the demo</a> <a class="btn" href="https://form.jotform.com/262131333242039">Start the 10-minute form</a></div>`
Rationale: a reader who scrolls through six objection-handling FAQs is the warmest visitor on the page and currently has to scroll back up to act.

### P2-8. Gumroad (TASK-008G/008H): one-line descriptions will publish as the entire product page
The ①–⑨ blurbs in BROWSER-TASKS.md are good subtitles but thin as full Gumroad descriptions. Proposed pattern for later application (do not edit the file mid-run): publish each with `[existing one-liner as opening line]` + the WHAT YOU GET bullets, WORKS WITH block, refund paragraph, and AI-disclosure line from the matching `publish-queue/*/listing.md` description (they're already written and honesty-vetted). For the two with no listing.md source:
- ④ Money Reset Bundle: `All three tools in one: Paycheck Budget + Debt Payoff Planner + Savings Goal Tracker — $29.99 instead of $42.97 separately (save 30%). Budget one paycheck at a time, put a payoff month on every debt, and give every savings goal a monthly number. Works in free Google Sheets and Excel. Instant download.` + refund + AI-disclosure lines.
- ⑤ Savings Challenge Pack: reuse the Etsy pack description with P1-9's expanded closing lines.
Rationale: Gumroad's description IS the sales page; the strong copy already exists and just needs routing there.

### P2-9. Pricing consistency: listing.md "Gumroad twin" prices contradict TASK-008G prices — and would break the "Save 30%" claim
Files: all `publish-queue/*/listing.md` "Gumroad twin listing" lines ($12.99/$12.99/$10.99/$8.99/$14.99/$10.99/$17.99) vs BROWSER-TASKS.md TASK-008G (Etsy-level prices: $14.99/$14.99/$12.99…).
- Proposed: pick one price set and update the losing document (recommend TASK-008G's set, since it's what's publishing). Note: at the listing.md twin prices, the bundle's `Save 30% vs separately` becomes ~19% — a false claim. At TASK-008G prices the 30% claim is correct ($42.97 → $29.99).
Rationale: whichever set publishes second inherits either a price war with itself or an untrue savings percentage.

### P2-10. Fiverr Gig 3 title misses the search phrase buyers actually type
File: `fiverr-gig-pack.md`, Gig 3 title.
- Current: `I will research your product niche, competitors, and pricing with a sourced report`
- Proposed: `I will do market research on your product niche, competitors, and pricing` (74 chars)
Rationale: buyers search "market research," which never appears in the current title; "with a sourced report" moves to the description where it already lives ("every claim has a source link").

### P2-11. Fiverr Gigs 2–3: add the AI-disclosure FAQ that Gig 1 has
File: `fiverr-gig-pack.md`, Gig 2 and Gig 3 FAQ lists.
- Proposed addition to both: `"Do you use AI?" → AI-assisted with human review — that's how the price and turnaround are possible; you get the same tested, explained deliverable either way.`
Rationale: the disclosure lives in the profile bio and Gig 1, but a buyer landing directly on Gig 2/3 never sees it — consistency protects the "honest AI studio" positioning (and against Fiverr policy disputes).

### P2-12. Pinterest pins (TASK-003B): tighten the two clunkiest descriptions
For later application (file not edited):
- p1 — Current: `…this budget planner digital download — instant download, no subscription.` → Proposed: `…this budget planner digital download — no subscription, yours forever.` (kills the download/download repeat, keeps both keywords)
- p2 — Current: `Debt snowball tracker + debt payoff tracker in one spreadsheet: list your debts once and see the payoff month for every one. Snowball or avalanche — your debt free journey gets a date.` → Proposed: `Debt snowball tracker and debt payoff planner in one spreadsheet — list your debts once, see the payoff month for every one. Snowball or avalanche, your debt free journey gets a date.` ("tracker + tracker" reads as keyword stuffing; "planner" is the stronger second keyword anyway)
Rationale: Pinterest surfaces descriptions in search; these two read machine-written where p3/p4 read human.

---

## P3 — Polish

### P3-1. Landing page: "books the appointment into your schedule rules" (line 40)
Current: `…books the appointment into your schedule rules, and texts you what happened.` → Proposed: `…books the appointment inside your scheduling rules, and texts you what happened.` — "into your schedule rules" parses as a typo on first read.

### P3-2. Landing page: demo heading says "call," but the widget is browser talk (line 46)
Current: `Don't take our word for it — call our fake company.` → Proposed: `Don't take our word for it — talk to our fake company.` — matches what actually happens when they click; "Hear it answer a call right now" (hero button) can stay, it reads as the caller's experience.

### P3-3. Landing page: founding rate vs setup fee ambiguity (lines 69–70)
Current: `+ $199 one-time setup…` directly above `Founding rate: first 5 businesses lock in $149/mo for life`. Proposed: state it either way, e.g. `Founding rate: first 5 businesses lock in $149/mo for life (setup fee still applies)` — or waive it and say so. One-line clarity beats a support question later.

### P3-4. Landing page footer vs kit: "reaches a human fast" vs the ownerless close path
`index.html` footer says the setup form `reaches a human fast`; `receptionist-outreach-kit.md` says `A human appears nowhere on our side`. Either commit to a human reviewing form submissions quickly (then the footer is fine) or soften to `The setup form is the fastest way to reach us — no commitment, no payment.` Honest-brand consistency; small but this is exactly the kind of line the policy exists for.

### P3-5. Fiverr Gig 1 title grammar + risky em dash
Current: `I will rewrite your Etsy listing SEO — title, 13 tags, and description` → Proposed: `I will rewrite your Etsy listing SEO title, 13 tags, and description`. "Rewrite your listing SEO" is off-grammar, and Fiverr title fields are picky about punctuation; the dash-free version also front-loads "Etsy listing SEO title" as one search phrase.

### P3-6. Fiverr Gig 2 FAQ label: `"My data confidential?"` → `"Is my data confidential?"` — telegraphic to the point of typo.

### P3-7. Fiverr Gig 4 Premium: `30-min handoff notes doc` is ambiguous
Proposed: `handoff notes doc (a ~30-minute read covering limits, maintenance, and next steps)` — "30-min" currently reads like a call that the ownerless model can't deliver.

### P3-8. Outreach kit: Email 1 template is stale vs the shipped batches
The kit's Email 1 shows GAP-only with `(nice reviews on {specific detail})`; batches 2–3 shipped a better two-angle (GAP/COST) structure. Update the kit template to match so future batches inherit the improved version, and note the possessive rule from S-2.

### P3-9. Batch 2/3 file headers: "owner mailing address replaces `AnswerPine — 159 4th Ave N…`" reads backwards
The address shown IS the final address (headers also say "address baked in"). Proposed header wording: `mailing address baked into every footer: AnswerPine — 159 4th Ave N, Ste 100 #2179, Nashville, TN 37219`. Internal-only, but the current phrasing invites a worker to think a replacement is still pending.

### P3-10. Publish queue is 8 listings, not 9
The task brief said 9 products; `publish-queue/` holds 8 listing.md files. The 9th sellable product (Money Reset Bundle) exists only as the TASK-008G one-liner — P2-8's bundle description covers the gap if it ever needs a full page.

---

## Honesty-compliance verdict (hard rules)

- **Income promises:** none found anywhere. Meal planner and Fiverr Gig 1 FAQ explicitly refuse to promise outcomes — on-brand, keep.
- **Fake credentials/testimonials:** one violation — Fiverr Gig 1 "live shops daily" (P1-10). No fake testimonials anywhere.
- **AI disclosure:** intact on Fiverr profile/Gig 1 (extend per P2-11), on the demo ("fictional HVAC company" in every email; "fake company" + AI-FAQ on the landing page), and on 7 of 8 Etsy listings — the 8th is the placeholder problem (P1-9).
- **Self-undermining drift:** none found worth flagging; the honest lines (refund paragraph, "not tax advice," "honest scope" on Gig 4, "we won't promise savings") all earn their space.
- **CAN-SPAM:** address + opt-out verified present in all 52 staged emails; every proposed rewrite above leaves the footer untouched; the only gap is the not-yet-drafted touches 2–4 (P1-5).
