# FB Scraping Runbook

This file lives in the git repo at `cmoney117/fb-marketplace-autoresponder` on branch `claude/facebook-lead-scraper-build-XfJXV`.
The authoritative copy on Cody's machine is at:
`C:\Users\codem\Claude managed agents for drop service pilot program\docs\runbooks\FB_SCRAPING_RUNBOOK.md`

Sync this repo copy to that path before each scheduled run.

---

<!-- Existing 116-line live-hunt content lives above this line on Cody's machine. -->
<!-- The sections below are appended additions from 2026-04-19. -->

---

## Scheduled execution (added 2026-04-19)

When this runbook is invoked by the scheduled `fb-post-scraper` skill (cron `0 8 * * *` + `0 14 * * *`), follow these constraints in addition to the manual rules above:

### Query rotation (40/run)

The scraper runs 2x/day. Don't repeat the same query within 24 hours. Pull today's batch deterministically from the query bank:

**Query bank (80 queries total - covers 2 days, rotate by day-of-month parity):**

```python
# Morning (8 AM) and afternoon (2 PM) pull the SAME 40-query batch per day.
# Odd day-of-month -> batch A. Even day-of-month -> batch B.
# Each batch = 40 (trade, template, city) triples.

TRADES = [
    "handyman", "painter", "plumber", "lawn care", "pressure washing",
    "gutter cleaning", "window cleaner", "masonry", "carpenter", "remodel contractor",
    "house cleaner", "carpet cleaner", "junk removal", "hvac", "electrician",
    "roofer", "tree service", "landscaper", "pool cleaner", "window tinting",
]

TEMPLATES = [
    "ISO {trade}",
    "need a {trade}",
    "recommend {trade}",
    "looking for {trade}",
]

CITIES = ["nashville", "clarksville"]

# Batch A (odd days): trades[0:10] x 4 templates x 2 cities = 80; pick first 40
# Batch B (even days): trades[10:20] x 4 templates x 2 cities = 80; pick first 40
```

**Clarksville-first order** - validated in 2026-04-19 session #2: Clarksville searches surface fresher active-looker posts than Nashville equivalents. Within each batch, interleave Clarksville queries ahead of Nashville.

### Dedup pre-check (required before every INSERT)

```sql
SELECT 1 FROM drop_service.leads
WHERE fb_post_url = $1
LIMIT 1;
```

If row returns, skip - this post was already scraped. Increment `dupes_skipped` counter.

### Insert columns (full list - do not deviate)

```sql
INSERT INTO drop_service.leads (
  lead_source, lead_temperature, score, urgency, status,
  service_type, city, notes, name, model,
  fb_post_url, fb_profile_url, fb_post_excerpt,
  fb_reply_status,
  outreach_eligible, consent_sms, consent_email,
  raw_data
) VALUES (
  'facebook', 'hot', 10, 'critical', 'new',
  $service_type, $city, $notes, $name, $model,
  $fb_post_url, $fb_profile_url, $fb_post_excerpt,
  'pending',
  true, false, false,
  jsonb_build_object(
    'scraper', 'fb_post_scraper',
    'scraped_at', to_char(NOW(), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
    'query', $search_query,
    'group_id', $group_id_or_null,
    'group_name', $group_name_or_null,
    'posted_relative', $relative_timestamp_str
  )
)
RETURNING id, fb_post_url IS NOT NULL AS has_url;
```

Note: `fb_reply_status='pending'` is the key signal for downstream. The reply-generator (`scripts/generate_fb_replies.py`) picks up `pending` and writes `fb_reply_text` + flips to `'ready'`. Then `fb-post-replies` (10 AM + 4 PM CT) pulls `'ready'` + `fb_post_url IS NOT NULL` and posts.

### Stop conditions (hard)

Exit immediately and Telegram Cody with `telegram_alert(message)` if ANY of:

| Condition | Cause | Action |
|---|---|---|
| Page URL contains `checkpoint` or `login` | Session expired or security check | STOP. Telegram: "FB session needs re-auth - log in manually" |
| Page body contains "We've received unusual activity" or "confirm you're human" | CAPTCHA / bot detection | STOP. Telegram: "FB CAPTCHA hit - scraper paused, log a `HIVE_FB_SCRAPER_PAUSED` row in agent_logs" |
| 5 consecutive queries return 0 visible posts | Search rate-limited | STOP. Telegram: "FB search rate-limited after N queries, Y inserts before stop" |
| Runtime >= 45 minutes | Runaway session | STOP. Telegram: "FB scrape timed out at 45m, Y inserts" |
| Successful inserts >= 25 | Cap reached | Normal stop. Telegram: standard summary |
| Queries processed >= 40 | Cap reached | Normal stop. Telegram: standard summary |

### Telegram summary format (post-run)

Send as plain ASCII to chat_id `8362217585` (em-dashes cause 400 errors - use hyphens):

```
FB scrape: X inserted, Y dupes skipped, Z queries, Q remaining
- Top services: handyman (5), painter (3), plumber (2)
- Top cities: Clarksville (6), Nashville (4)
- Runtime: 18 min
- Next run: 2 PM CT
```

### agent_logs row (required)

```sql
INSERT INTO drop_service.agent_logs (agent_name, action, success, input_summary, output_summary, metadata)
VALUES (
  'fb_scraper',
  'facebook_lead_scrape',
  true,
  'scheduled_fire_2026-04-19_08:00_CT',
  'inserted=X dupes=Y queries=Z runtime_sec=N captcha=false',
  jsonb_build_object(
    'inserted', X,
    'dupes_skipped', Y,
    'queries_processed', Z,
    'runtime_sec', N,
    'top_services', jsonb_build_object('handyman', 5, 'painter', 3),
    'top_cities', jsonb_build_object('Clarksville', 6, 'Nashville', 4),
    'stop_reason', 'cap_reached | rate_limited | captcha | session_expired',
    'telegram_msg_id', telegram_msg_id_int,
    'skill_version', 'v1-2026-04-19'
  )
);
```

### Manual pause (kill switch)

If Cody needs to pause the scraper without un-scheduling the task:

```sql
INSERT INTO drop_service.agent_logs (agent_name, action, success, input_summary, output_summary)
VALUES ('fb_scraper', 'HIVE_FB_SCRAPER_PAUSED', true, 'manual_pause', 'paused by operator');
```

Each scraper run checks for this row created within the last 7 days and exits with `skipped=manual_pause` if found. To resume: no action required after 7 days, or delete the row.

---

## Related

- Downstream: `docs/runbooks/FB_POST_REPLIES_RUNBOOK.md` - the reply-posting scheduled task that consumes rows created by this scraper.
- Skill stub: `C:\Users\codem\.claude\scheduled-tasks\fb-post-scraper\SKILL.md`.
- Queue health SQL (operator dashboard):
  ```sql
  SELECT fb_reply_status, COUNT(*) FILTER (WHERE fb_post_url IS NOT NULL) AS has_url
  FROM drop_service.leads
  WHERE lead_source='facebook'
    AND created_at >= NOW() - INTERVAL '14 days'
  GROUP BY 1 ORDER BY 1;
  ```
