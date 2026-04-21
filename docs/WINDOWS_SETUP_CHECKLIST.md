# Windows Setup Checklist — fb-post-scraper

**Branch:** `claude/facebook-lead-scraper-build-XfJXV`
**Supabase project:** `ptzeyjzwoyyovyxpqnhd` | schema: `drop_service`
**Run this on:** Cody's Windows Claude Code session (has Supabase, Chrome, and scheduled-tasks MCPs)

Work top-to-bottom. Each gate must pass before moving to the next.

---

## Pre-work: sync files from repo to Windows paths

These two files exist in the repo but need to be on the Windows machine:

**File 1 — SKILL.md** (the scheduled task's brain):
- Repo path: `.claude/scheduled-tasks/fb-post-scraper/SKILL.md`
- Windows destination: `C:\Users\codem\.claude\scheduled-tasks\fb-post-scraper\SKILL.md`
- Action: copy file (create the `fb-post-scraper` folder if it doesn't exist)

**File 2 — FB_SCRAPING_RUNBOOK.md** (supplementary context):
- Repo path: `docs/runbooks/FB_SCRAPING_RUNBOOK.md`
- Windows destination: append the "## Scheduled execution (added 2026-04-19)" section and everything below it to `C:\Users\codem\Claude managed agents for drop service pilot program\docs\runbooks\FB_SCRAPING_RUNBOOK.md`

**File 3 — FB_POST_REPLIES_RUNBOOK.md** (queue source cross-link):
- Repo path: `docs/runbooks/FB_POST_REPLIES_RUNBOOK.md`
- Windows destination: append the "### Queue source (now live)" section to `C:\Users\codem\Claude managed agents for drop service pilot program\docs\runbooks\FB_POST_REPLIES_RUNBOOK.md`

---

## §8.1 — Supabase: apply dedup migration

### Step 1: check for existing duplicates (safety pre-check)

Run this SQL. Expected result: **empty set**. If rows appear, de-dupe those fb_post_url values manually before proceeding.

```sql
SELECT fb_post_url, COUNT(*) AS n
FROM drop_service.leads
WHERE fb_post_url IS NOT NULL
GROUP BY fb_post_url
HAVING COUNT(*) > 1;
```

### Step 2: apply migration

```sql
-- Migration: migrations/20260419_fb_scraper_dedup.sql

CREATE UNIQUE INDEX IF NOT EXISTS leads_lead_source_fb_post_url_uniq
ON drop_service.leads (lead_source, fb_post_url)
WHERE fb_post_url IS NOT NULL;

CREATE INDEX IF NOT EXISTS leads_fb_post_url_lookup
ON drop_service.leads (fb_post_url)
WHERE fb_post_url IS NOT NULL;
```

### Step 3: verify indexes exist

```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'leads'
  AND schemaname = 'drop_service'
  AND indexname IN (
    'leads_lead_source_fb_post_url_uniq',
    'leads_fb_post_url_lookup'
  );
```

**Gate pass:** 2 rows returned, both index names present.

---

## §8.2 — Chrome session health check

Verify Cody's Facebook session is active and search works.

1. Use `mcp__Claude_in_Chrome__navigate` to open: `https://www.facebook.com/search/posts?q=ISO+handyman+clarksville`
2. Use `mcp__Claude_in_Chrome__read_page` (depth=2)
3. Confirm: page shows search results (not a login screen, not a checkpoint)

**Gate pass:** At least 1 post visible in results. No login wall, no CAPTCHA.

If login wall appears → Cody needs to manually log into Facebook in Chrome first.

---

## §8.3 — Dry run (no inserts, no Telegram)

Run the scraper agent with these constraints:
- Run 5 queries only (first 5 from today's batch per §3 of SKILL.md)
- Do NOT INSERT any rows
- Do NOT send Telegram message
- Report back: how many qualifying posts found, what service types, any stop conditions hit

**Gate pass:** Agent reports ≥1 qualifying post found, no CAPTCHA or login wall.

---

## §8.4 — Single live INSERT test

Run the scraper agent:
- Run 5 queries from today's batch
- Allow up to 1 INSERT (stop after first successful insert)
- Send Telegram summary
- Write agent_logs row

After agent completes, verify in Supabase:

```sql
-- Confirm the inserted row
SELECT id, name, service_type, city, fb_post_url, fb_reply_status,
       lead_source, lead_temperature, score, created_at
FROM drop_service.leads
WHERE lead_source = 'facebook'
  AND fb_reply_status = 'pending'
ORDER BY created_at DESC
LIMIT 5;
```

**Gate pass:**
- Row exists with `lead_source='facebook'`, `fb_reply_status='pending'`, `fb_post_url IS NOT NULL`
- Telegram message received in chat 8362217585
- `agent_logs` row exists: `SELECT * FROM drop_service.agent_logs WHERE agent_name='fb_scraper' ORDER BY created_at DESC LIMIT 1;`

---

## §8.5 — Full live run (40 queries, up to 25 inserts)

Run the scraper agent with full production settings (all 40 queries, all stop conditions live).

Expected outcome: 15–25 inserts on a good day, fewer if Clarksville posts are sparse.

After run:

```sql
-- Queue health check
SELECT fb_reply_status, COUNT(*) AS n
FROM drop_service.leads
WHERE lead_source = 'facebook'
  AND created_at >= NOW() - INTERVAL '14 days'
GROUP BY 1 ORDER BY 1;
```

**Gate pass:**
- `pending` count increased vs baseline
- `agent_logs` row written
- Telegram summary received with correct counts
- No CAPTCHA or session_expired stop

---

## §7 + §8.7 — Register scheduled tasks

Register both cron jobs using `mcp__scheduled-tasks__create_scheduled_task`:

**Task 1 — Morning run:**
```
name:        fb-post-scraper
skill_path:  C:\Users\codem\.claude\scheduled-tasks\fb-post-scraper\SKILL.md
cron:        0 8 * * *
timezone:    America/Chicago
enabled:     true
```

**Task 2 — Afternoon run:**
```
name:        fb-post-scraper-pm
skill_path:  C:\Users\codem\.claude\scheduled-tasks\fb-post-scraper\SKILL.md
cron:        0 14 * * *
timezone:    America/Chicago
enabled:     true
```

Note: both tasks point to the same SKILL.md — same queries, same logic, different fire times.

---

## §8.8 — Verify scheduled tasks registered

Use `mcp__scheduled-tasks__list_scheduled_tasks` and confirm:

| Check | Expected |
|---|---|
| Both tasks appear | `fb-post-scraper` and `fb-post-scraper-pm` |
| Both enabled | `enabled: true` |
| Cron expressions correct | `0 8 * * *` and `0 14 * * *` |
| Next run times correct | Next 8 AM CT and next 2 PM CT |

**Gate pass:** All 4 checks pass.

---

## §8.6 — Downstream check (run after next fb-post-replies fire)

`fb-post-replies` fires at 10 AM and 4 PM CT — 2 hours after the scraper. After it fires:

```sql
-- Check that pending rows from scraper are being consumed
SELECT fb_reply_status, COUNT(*) AS n
FROM drop_service.leads
WHERE lead_source = 'facebook'
  AND created_at >= NOW() - INTERVAL '1 day'
GROUP BY 1 ORDER BY 1;
```

**Gate pass:** Rows have moved from `pending` → `ready` → `posted`. If still all `pending`, check that `generate_fb_replies.py` ran and that `fb-post-replies` is picking up `ready` rows with `fb_post_url IS NOT NULL`.

---

## §12 — First real fire (8 AM CT next morning)

Observe the first autonomous scheduled fire:

1. Telegram message arrives in chat 8362217585 around 8:00–8:20 AM CT
2. Run queue health SQL to confirm new rows
3. Confirm `agent_logs` row written
4. 2 hours later at 10 AM: `fb-post-replies` should consume `ready` rows

If 8 AM comes and goes with no Telegram → check:
- Is the scheduled task enabled? (`list_scheduled_tasks`)
- Is Chrome running and logged in?
- Check Windows Task Scheduler or Claude Code scheduler logs

---

## Rollback / emergency stop

If scraper starts misfiring or inserting bad data:

```sql
-- Pause immediately (kills next scraper run within 7 days)
INSERT INTO drop_service.agent_logs (agent_name, action, success, input_summary, output_summary)
VALUES ('fb_scraper', 'HIVE_FB_SCRAPER_PAUSED', true, 'manual_pause', 'emergency stop by operator');
```

Then investigate before resuming (delete the row or wait 7 days).

---

## Quick reference: useful SQL

```sql
-- Most recent facebook leads
SELECT id, name, service_type, city, fb_reply_status, fb_post_url, created_at
FROM drop_service.leads
WHERE lead_source = 'facebook'
ORDER BY created_at DESC
LIMIT 20;

-- Scraper run history
SELECT created_at, success, input_summary, output_summary, metadata
FROM drop_service.agent_logs
WHERE agent_name = 'fb_scraper'
ORDER BY created_at DESC
LIMIT 10;

-- Check for pause flag
SELECT * FROM drop_service.agent_logs
WHERE agent_name = 'fb_scraper'
  AND action = 'HIVE_FB_SCRAPER_PAUSED'
  AND created_at >= NOW() - INTERVAL '7 days';

-- Verify dedup indexes
SELECT indexname FROM pg_indexes
WHERE tablename = 'leads' AND schemaname = 'drop_service'
ORDER BY indexname;
```
