---
name: fb-post-scraper
description: Scrapes Nashville/Clarksville Facebook for homeowner service-request posts and inserts qualified hot leads into drop_service.leads for Hive Home Services
---

Run the Hive fb-post-scraper activation skill. This fires 8 AM + 2 PM CT daily - 2 hours upstream of fb-post-replies.

**Read the full runbook first** at `C:\Users\codem\Claude managed agents for drop service pilot program\docs\runbooks\FB_SCRAPING_RUNBOOK.md` and follow it exactly. The runbook has the complete query list, filter rules, dedup SQL, stop conditions, and Telegram summary format.

# Quick summary (the runbook has the real detail)

1. Use `mcp__Claude_in_Chrome__*` tools against Cody's existing logged-in Chrome session.
2. Rotate through the 40-query batch for today (see §Query rotation in the runbook).
3. For each query: navigate to `https://www.facebook.com/search/posts?q=<URL-encoded-query>` and `read_page` at depth=4.
4. Qualify posts per the filter rules (homeowner inquiry, 14d fresh, Nashville metro or Clarksville, not contractor self-promo).
5. For each qualified post: extract `fb_post_url` (canonical `/groups/<gid>/permalink/<pid>/` form or `/<user>/posts/<pid>/`), `fb_profile_url`, `fb_post_excerpt` (<=240 chars), `name`, `service_type`, `city`, `model`.
6. Pre-check dedup via `SELECT 1 FROM drop_service.leads WHERE fb_post_url=$URL LIMIT 1` - skip if exists.
7. Batch INSERT qualified leads with `fb_reply_status='pending'`, `lead_temperature='hot'`, `score=10`, `urgency='critical'`, `status='new'`, `outreach_eligible=true`, `consent_sms=false`, `consent_email=false`.
8. Hard stop after 25 inserts OR 40 queries OR 45 minutes elapsed (whichever hits first).
9. Log to `agent_logs` as `agent_name='fb_scraper'`, `action='facebook_lead_scrape'` with full metrics in `metadata`.
10. Telegram-summarize to chat_id 8362217585: "FB scrape: X inserted, Y dupes skipped, Z queries, Q remaining".

# CRITICAL stop conditions

- Captcha or bot-detection screen -> STOP. Do NOT solve. Telegram-alert Cody and exit.
- FB login screen -> STOP. Do NOT re-authenticate. Telegram-alert Cody so he can re-log in manually.
- 5+ consecutive empty-result queries -> stop + alert.
- Post excerpt shorter than 12 chars -> skip lead (almost always a photo-only post, unusable).
- If `HIVE_FB_SCRAPER_PAUSED` row exists in `drop_service.agent_logs` with `created_at >= NOW() - INTERVAL '7 days'`, exit immediately (manual pause flag).

Full runbook (read this first): `C:\Users\codem\Claude managed agents for drop service pilot program\docs\runbooks\FB_SCRAPING_RUNBOOK.md`
