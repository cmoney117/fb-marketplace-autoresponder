# FBM Lead Rescue — MVP Blueprint & Sales Copy (Lane D-1)

**What it is:** the compliant pivot of this repo's extension, sold to independent used-car dealers at $149–199/mo/rooftop. **What it is NOT:** auto-send. That version violates Meta ToS, competes with Meta's free native AI replies (Mar 2026), and risks customers' ID-verified accounts (30-day bans, denied appeals). We sell honestly or not at all — the sales page says so out loud (it's a differentiator against the gray-zone tools charging $249–1,000/mo).

## MVP scope (~2 AI-weeks once the CRM repo is attached — backend lives in `usa-fleet-sales-crm`, not this session)

**Extension changes (this repo as the base):**
1. DELETE the send path: `sendReplyInBrowser` (`background.js:335-394`), synthetic Enter, auto-send loop pacing.
2. KEEP: inbox scan on the tab the dealer already has open, thread extraction (`content.js`), safety gates (buyer-initiated check, ignore-lists, topic gate, phone-number guardrail — all battle-tested).
3. ADD: sidebar panel — per-thread AI-drafted reply (via existing `/api/fb/generate-reply` contract) with [Copy] button; **the human pastes/clicks send in Facebook's own composer.** No injected sends, ever.
4. ADD: one-click "capture lead" → pushes name/thread/context to CRM; when a phone/email is captured, **all follow-up automation moves off-platform** (SMS via Twilio 10DLC + email) where it's legal and ban-proof.

**Backend changes (CRM):** multi-tenant (dealer_id on every table), per-dealer approved-facts config (inventory source, phone, hours), Stripe subscription billing, follow-up sequence engine re-pointed from Messenger to SMS/email, simple dashboard (leads, response times, appointments set).

## Pricing & packaging
$149/mo founding (first 10 rooftops, lifetime) → $199/mo list. 14-day free trial, no card for trial. Setup = 20-min form (mirror the EverAnswer Jotform pattern).

## Sales page copy (headline block)
> **Your Marketplace leads die in 20 minutes. Answer in 20 seconds — without risking your account.**
> Meta bans dealers for auto-responders (30-day bans, ID-verified accounts, denied appeals). We don't auto-send — and that's the point. Lead Rescue drafts the perfect reply the second a buyer messages; your salesperson clicks send. The moment they share a number, our automated SMS follow-up takes over — off Facebook, where automation is legal. Built by the team running it live at a Tennessee fleet dealer.

## GTM (owner-light)
DealerRefresh forum presence (genuine participation, human-written), 2 independent-dealer FB groups (human/VA only), CAN-SPAM email sequence (same rules as EverAnswer kit) to independent used-car dealers, existing dealer as the case study (with their OK). Cross-sell: every dealer "no" gets the EverAnswer receptionist pitch (Numa proved dealers buy AI phone coverage).

## Activation checklist
1. Owner: attach `usa-fleet-sales-crm` repo to a session (or approve greenfield rebuild). 2. Owner: OK to reference USA Fleet Sales results as the case study. 3. Build sprint. 4. Trial with the existing dealer as tenant #1. Nothing here blocks the other lanes; this runs whenever wanted.
