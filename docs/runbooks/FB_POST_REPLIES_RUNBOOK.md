# FB Post Replies Runbook

This file lives in the git repo at `cmoney117/fb-marketplace-autoresponder` on branch `claude/facebook-lead-scraper-build-XfJXV`.
The authoritative copy on Cody's machine is at:
`C:\Users\codem\Claude managed agents for drop service pilot program\docs\runbooks\FB_POST_REPLIES_RUNBOOK.md`

Sync this repo copy to that path before each scheduled run.

---

<!-- Existing runbook content lives above this line on Cody's machine, -->
<!-- including the "Queue-gap root-cause + 2441-row quarantine" section added earlier 2026-04-19. -->
<!-- The section below is appended from the fb-lead-scraper build plan. -->

---

### Queue source (now live)

As of 2026-04-19, the queue is fed by the `fb-post-scraper` scheduled task (8 AM + 2 PM CT, 2 hrs upstream of this task). See `docs/runbooks/FB_SCRAPING_RUNBOOK.md` for the scraper runbook. If queue is empty at fire time, check `fb_scraper` entries in `agent_logs` to confirm the upstream ran.
