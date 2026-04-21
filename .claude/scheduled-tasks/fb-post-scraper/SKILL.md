---
name: fb-post-scraper
description: Scrapes Nashville/Clarksville Facebook for homeowner service-request posts and inserts qualified hot leads into drop_service.leads for Hive Home Services
---

# fb-post-scraper — Complete Execution Playbook

Fires at **8 AM CT** and **2 PM CT** daily. You are a fully autonomous agent. Execute every step below without stopping for input. The only time you stop early is a HARD STOP condition (§6).

---

## §1 — Pre-flight: pause flag check

Before doing anything else, run this SQL:

```sql
SELECT 1 FROM drop_service.agent_logs
WHERE agent_name = 'fb_scraper'
  AND action = 'HIVE_FB_SCRAPER_PAUSED'
  AND created_at >= NOW() - INTERVAL '7 days'
LIMIT 1;
```

If a row is returned → log `skipped=manual_pause` to agent_logs (§8) and **EXIT**. Do not scrape.

---

## §2 — Session state: initialize counters

```
inserted        = 0
dupes_skipped   = 0
queries_done    = 0
empty_streak    = 0
start_time      = NOW()
top_services    = {}   # {service_type: count}
top_cities      = {}   # {city: count}
stop_reason     = ""
```

---

## §3 — Query rotation (40 queries per run)

Determine today's batch by day-of-month parity:

```
day_of_month = today's date as integer (1–31)
if day_of_month is ODD  → use BATCH_A (trades 1–10)
if day_of_month is EVEN → use BATCH_B (trades 11–20)
```

**BATCH_A trades (odd days — 1, 3, 5, ...):**
handyman, painter, plumber, lawn care, pressure washing,
gutter cleaning, window cleaner, masonry, carpenter, remodel contractor

**BATCH_B trades (even days — 2, 4, 6, ...):**
house cleaner, carpet cleaner, junk removal, hvac, electrician,
roofer, tree service, landscaper, pool cleaner, window tinting

**4 search templates** (fill `{trade}` with each trade name):
1. `ISO {trade} clarksville`
2. `need a {trade} clarksville`
3. `looking for {trade} clarksville`
4. `recommend {trade} clarksville`

**Run all 40 queries:** 10 trades × 4 templates = 40. All Clarksville — Clarksville yields fresher active-looker posts. Nashville is Batch C (future expansion).

**Full expanded query list for BATCH_A (odd days):**
```
ISO handyman clarksville
need a handyman clarksville
looking for handyman clarksville
recommend handyman clarksville
ISO painter clarksville
need a painter clarksville
looking for painter clarksville
recommend painter clarksville
ISO plumber clarksville
need a plumber clarksville
looking for plumber clarksville
recommend plumber clarksville
ISO lawn care clarksville
need a lawn care clarksville
looking for lawn care clarksville
recommend lawn care clarksville
ISO pressure washing clarksville
need a pressure washing clarksville
looking for pressure washing clarksville
recommend pressure washing clarksville
ISO gutter cleaning clarksville
need a gutter cleaning clarksville
looking for gutter cleaning clarksville
recommend gutter cleaning clarksville
ISO window cleaner clarksville
need a window cleaner clarksville
looking for window cleaner clarksville
recommend window cleaner clarksville
ISO masonry clarksville
need a masonry clarksville
looking for masonry clarksville
recommend masonry clarksville
ISO carpenter clarksville
need a carpenter clarksville
looking for carpenter clarksville
recommend carpenter clarksville
ISO remodel contractor clarksville
need a remodel contractor clarksville
looking for remodel contractor clarksville
recommend remodel contractor clarksville
```

**Full expanded query list for BATCH_B (even days):**
```
ISO house cleaner clarksville
need a house cleaner clarksville
looking for house cleaner clarksville
recommend house cleaner clarksville
ISO carpet cleaner clarksville
need a carpet cleaner clarksville
looking for carpet cleaner clarksville
recommend carpet cleaner clarksville
ISO junk removal clarksville
need a junk removal clarksville
looking for junk removal clarksville
recommend junk removal clarksville
ISO hvac clarksville
need a hvac clarksville
looking for hvac clarksville
recommend hvac clarksville
ISO electrician clarksville
need a electrician clarksville
looking for electrician clarksville
recommend electrician clarksville
ISO roofer clarksville
need a roofer clarksville
looking for roofer clarksville
recommend roofer clarksville
ISO tree service clarksville
need a tree service clarksville
looking for tree service clarksville
recommend tree service clarksville
ISO landscaper clarksville
need a landscaper clarksville
looking for landscaper clarksville
recommend landscaper clarksville
ISO pool cleaner clarksville
need a pool cleaner clarksville
looking for pool cleaner clarksville
recommend pool cleaner clarksville
ISO window tinting clarksville
need a window tinting clarksville
looking for window tinting clarksville
recommend window tinting clarksville
```

---

## §4 — Search and qualify loop

For each query in today's 40-query list:

### 4a. Navigate and read

```
url = "https://www.facebook.com/search/posts?q=" + URL_encode(query)
navigate Chrome to url
read_page(depth=4)
```

### 4b. Hard stop checks (check on EVERY page load)

- Page URL contains `checkpoint` or `login` → **HARD STOP: session_expired**
- Page body contains `unusual activity` or `confirm you're human` → **HARD STOP: captcha**

### 4c. Post collection

Collect all visible posts. A "post" is a FB search result card with:
- Author name / profile link
- Post body text
- Relative timestamp ("2 hours ago", "yesterday", etc.)
- Post permalink URL (extract from card link)

If page has 0 visible posts:
- `empty_streak += 1`
- if `empty_streak >= 5` → **HARD STOP: rate_limited**
- continue to next query

If page has ≥1 posts → `empty_streak = 0`

### 4d. Qualify each post

Skip the post if ANY of:
- `fb_post_excerpt` is < 12 characters (photo-only, no text)
- Post is from a business page / appears to be a contractor advertising services (NOT a homeowner asking for one)
- Timestamp is older than 14 days
- Text is clearly not a service request (e.g., selling items, asking about prices for their own business)

Keep the post if:
- Author appears to be a homeowner/resident asking for a recommendation or provider
- The need matches one of Hive's service types (cleaning, handyman, plumbing, HVAC, lawn, roofing, painting, pressure washing, gutters, windows, carpentry, masonry, electrical, tree/landscaping, junk removal, pool, carpet, remodel)
- Posted within 14 days

### 4e. Extract fields for qualified posts

```
fb_post_url     = canonical post permalink, format:
                  /groups/<group_id>/permalink/<post_id>/
                  OR /<username>/posts/<post_id>/
                  (always absolute: https://www.facebook.com/...)
fb_profile_url  = author's FB profile URL
fb_post_excerpt = first 240 chars of post body text (no truncation mid-word)
name            = author's display name (first name only if only first visible)
service_type    = inferred Hive service (e.g. "handyman", "lawn care", "hvac")
city            = "Clarksville" (capitalized)
model           = "facebook_post"
notes           = raw post text, first 500 chars
search_query    = the query string used (e.g. "ISO handyman clarksville")
```

---

## §5 — Dedup + INSERT

### 5a. Dedup pre-check (required — run before every INSERT)

```sql
SELECT 1 FROM drop_service.leads
WHERE fb_post_url = '<fb_post_url>'
LIMIT 1;
```

If row exists → `dupes_skipped += 1`, skip INSERT. Continue to next post.

### 5b. INSERT

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
  '<service_type>', '<city>', '<notes>', '<name>', 'facebook_post',
  '<fb_post_url>', '<fb_profile_url>', '<fb_post_excerpt>',
  'pending',
  true, false, false,
  jsonb_build_object(
    'scraper', 'fb_post_scraper',
    'scraped_at', to_char(NOW(), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
    'query', '<search_query>',
    'posted_relative', '<relative_timestamp_str>'
  )
)
RETURNING id;
```

On success:
```
inserted += 1
top_services[service_type] += 1
top_cities[city] += 1
```

### 5c. INSERT cap

After each INSERT: if `inserted >= 25` → normal stop (`stop_reason = "cap_inserted"`).

### 5d. Query cap / timeout

After each query: 
- if `queries_done >= 40` → normal stop (`stop_reason = "cap_queries"`)
- if `elapsed >= 45 minutes` → **HARD STOP: timeout**

---

## §6 — Hard stop conditions

| Trigger | stop_reason | Telegram message |
|---|---|---|
| URL has `checkpoint` or `login` | `session_expired` | "FB scraper STOPPED - session needs re-auth. Log into Facebook manually in Chrome." |
| Page body has `unusual activity` or `confirm you're human` | `captcha` | "FB scraper STOPPED - CAPTCHA detected. Pausing. Insert HIVE_FB_SCRAPER_PAUSED row in agent_logs to keep paused." |
| 5 consecutive empty queries | `rate_limited` | "FB scraper STOPPED - 5 empty queries in a row, likely rate-limited. inserted=X queries=Z" |
| elapsed >= 45 min | `timeout` | "FB scraper STOPPED - 45 min timeout. inserted=X queries=Z" |

On hard stop: send Telegram alert first, then write agent_logs row with `success=false`, then EXIT.

---

## §7 — Telegram summary (send after every run, including normal stops)

**Bot endpoint:** POST `https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/sendMessage`
**chat_id:** `8362217585`

IMPORTANT: Use hyphens only, no em-dashes (em-dashes cause 400 errors).

Format (plain ASCII):
```
FB scrape: X inserted, Y dupes skipped, Z queries, Q remaining
- Top services: handyman (5), painter (3), plumber (2)
- Top cities: Clarksville (10)
- Runtime: N min
- Next run: [8 AM CT or 2 PM CT]
- Stop: [cap_inserted | cap_queries | rate_limited | captcha | session_expired | timeout | manual_pause]
```

Where:
- `X` = inserted
- `Y` = dupes_skipped
- `Z` = queries_done
- `Q` = 40 - queries_done
- `N` = elapsed minutes (round to nearest minute)
- Next run: if current fire is 8 AM say "2 PM CT", if 2 PM say "8 AM CT tomorrow"

---

## §8 — Write agent_logs row

```sql
INSERT INTO drop_service.agent_logs (
  agent_name, action, success, input_summary, output_summary, metadata
) VALUES (
  'fb_scraper',
  'facebook_lead_scrape',
  <true if stop_reason IN (cap_inserted, cap_queries) else false>,
  'scheduled_fire_<YYYY-MM-DD>_<HH:MM>_CT',
  'inserted=<X> dupes=<Y> queries=<Z> runtime_sec=<N> stop=<stop_reason>',
  jsonb_build_object(
    'inserted', <X>,
    'dupes_skipped', <Y>,
    'queries_processed', <Z>,
    'runtime_sec', <N>,
    'top_services', '<json object>',
    'top_cities', '<json object>',
    'stop_reason', '<stop_reason>',
    'skill_version', 'v2-2026-04-21'
  )
);
```

---

## §9 — Pipeline context (read-only reference)

- `fb_reply_status = 'pending'` signals the reply generator (`scripts/generate_fb_replies.py`) to pick up this lead, write `fb_reply_text`, and flip status to `'ready'`.
- `fb-post-replies` (fires 10 AM + 4 PM CT, 2 hrs downstream) pulls `ready` rows with `fb_post_url IS NOT NULL` and posts the reply to Facebook.
- Queue health check (run anytime for operator visibility):
  ```sql
  SELECT fb_reply_status, COUNT(*) AS n
  FROM drop_service.leads
  WHERE lead_source = 'facebook'
    AND created_at >= NOW() - INTERVAL '14 days'
  GROUP BY 1 ORDER BY 1;
  ```

---

## §10 — Manual pause kill switch

If Cody needs to halt scraping without un-scheduling the task, run:

```sql
INSERT INTO drop_service.agent_logs (agent_name, action, success, input_summary, output_summary)
VALUES ('fb_scraper', 'HIVE_FB_SCRAPER_PAUSED', true, 'manual_pause', 'paused by operator');
```

The scraper checks for this row at startup (§1). To resume: either delete the row or wait 7 days.

---

*Skill version: v2-2026-04-21 | Supabase project: ptzeyjzwoyyovyxpqnhd | Schema: drop_service*
