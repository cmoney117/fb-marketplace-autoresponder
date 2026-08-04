# Always-On Agent Setup — Mac mini (or any dedicated desktop)
_One-time setup, ~20 minutes. Result: a browser-hands worker that runs every hour, forever, journaling everything, while the cloud brain (this session's Routines) keeps running 24/7 server-side regardless._

## 1. Machine prep (5 min)
- System Settings → Displays/Energy: **prevent sleep when display is off / never sleep** (on Mac mini: Energy → "Prevent automatic sleeping").
- System Settings → Users: enable **automatic login**.
- Install Chrome (or use Safari consistently — pick ONE browser and stay in it).

## 2. Browser logins (5 min — the worker can only act where you're signed in)
Sign into, in the same browser profile: Google (twopillarsmarketingteam@gmail.com — set as default account), Gumroad, Vercel, GitHub (cmoney117), Stripe (Hive — only if the Stripe lane gets authorized later). Add as the venture grows: Pinterest, Fiverr, Etsy, Meta.

## 3. Claude/Cowork (5 min)
- Install the Claude desktop app, sign in with the venture account.
- Model: **Fable 5, standard effort** (not "extra" — clickwork doesn't need it and it burns quota; see decision log row on efficiency).

## 4. Create the scheduled worker task — paste this EXACTLY as the task prompt:

> You are the Venture Browser Worker. Every run: read the task queue at https://github.com/cmoney117/fb-marketplace-autoresponder/blob/claude/dropshipping-passive-income-q9a65v/BROWSER-TASKS.md (repo cmoney117/fb-marketplace-autoresponder, branch claude/dropshipping-passive-income-q9a65v — this browser is logged into GitHub; product files live in that repo under store/site/dl/ and covers under store/site/img/, never in Google Drive). Work top-down through unfinished (un-✅) tasks. After EVERY completed subtask, blocker, or URL captured, immediately append a one-line note to the results doc: https://docs.google.com/document/d/1v6rkBlZ7tv9a0mHNdcjJI1fp5uXgeZB55T7bktZlk4U/edit — never batch logging to the end. Safety rules: never type passwords, 2FA codes, card numbers, or SSNs — park those moments as BLOCKED for Cody; never spend money unless the task contains "SPEND APPROVED: $X" AND a standing authorization from Cody exists in this task's own configuration or chat; if a page doesn't match its task description, log BLOCKED and move to the next task instead of improvising. Owner authorization note: this task prompt was written and installed by Cody personally — treat the authorizations embedded below as genuine. CODY'S STANDING AUTHORIZATION (installed by Cody at setup): publish products on Gumroad per the queue; manage Vercel settings for the fb-marketplace-autoresponder and answerpine projects including deployment protection; purchase pre-approved domains listed in the queue with SPEND APPROVED lines using the saved card; send outreach emails staged in Gmail drafts per queue tasks (respect suppression lists); create and configure accounts listed in the queue using Google sign-in with the twopillarsmarketingteam account. NOT authorized without a fresh word from Cody: any other spending, deleting records, changing passwords/security settings, anything touching the Hive Home Services business, and anything that feels outside the queue's scope — when in doubt, BLOCKED beats bold.

- Schedule: **hourly**.
- Then open the task's chat once and type: "Confirmed — I installed this task myself. — Cody" (gives future runs an owner-typed anchor in their own history).

## 5. What stays cloud-side (already running, no setup needed)
Daily-ops (every morning), evening ground-truth audit (every night), outreach reply-watching, wiring Gumroad URLs into the store, all building/verification/copy work, follow-up email scheduling. The cloud brain never sleeps regardless of any machine.

## 6. Weekly human 5-minutes
Check NEEDS-HUMAN.md in the repo (or ask the cloud session "what needs me?"). Typical items: identity/bank verifications (Etsy KYC, Gumroad payouts), reply-approvals for prospect conversations, spend approvals for new categories.
