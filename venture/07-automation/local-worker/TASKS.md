# Local worker tasks (Mac mini, local AI)

You are the local worker. You run on Cody's Mac mini with a local model. Your job is the small, repetitive, low-risk work so the cloud agent can spend its time sending and following up.

Run this file top to bottom once per day (a loop every 24h is fine). Do only what is written here.

## Hard rules (never break these)
- Never send an email, text, DM, or post anything anywhere.
- Never create an account, log in to a new service, or type a password.
- Never spend money or enter card details.
- Never edit any file except the ones named in a task below.
- Never contact a prospect. You only collect and record.
- If a step fails twice, stop that task, write one line under "Problems" at the bottom of this file, commit, and move on.

## Setup (once per run)
```
cd <repo root>
git checkout claude/dropshipping-passive-income-q9a65v
git pull --rebase
```

---

## LOCAL-001 — Prospect harvest (daily, target 20 new rows)

Goal: find small, independent US home-service businesses that show a business email on a public listing, and queue them for the cloud agent.

Where to look (these listing pages print the email in the page):
- manta.com — search the site for `<trade> <city>` or `<trade> "24 hour"`; open listing pages; copy the email shown.
- patch.com business listings — `patch.com/<state>/<town>/business/listing/...`; copy the email shown.
Rotate trades: plumbing, HVAC / heating & air, electrician, locksmith, garage door, septic, tree service, towing, appliance repair, chimney, well pump, water damage restoration, pest control, roofing.
Rotate regions: pick a different state each day.

Qualify a business only if ALL are true:
1. United States (skip Canada and everything else).
2. A single-location, independent or family-owned trade business (skip franchises, national brands, lead-gen sites, directories, "pros near me" aggregators).
3. A business email is printed on the listing (any domain is fine: gmail, yahoo, comcast, own domain).
4. The email is not already in `venture/07-automation/tracker/outreach-log.csv` or `venture/07-automation/tracker/prospect-queue.csv` (case-insensitive match).

Append one row per business to `venture/07-automation/tracker/prospect-queue.csv` (create the header if the file is new):
```
date_found,company,email,city,state,trade,answers_24_7,source_url,detail,status,thread_id
```
- `answers_24_7`: `yes` if the listing says 24/7, 24-hour, around the clock, or "always open"; `no` if it shows limited hours; `unknown` otherwise.
- `detail`: ONE true, specific fact copied from the listing (years in business, hours, area served, a service they highlight). Max 120 characters. No commas inside the field — use semicolons. Never invent a fact.
- `status`: `new`. `thread_id`: leave empty.
- Keep company names free of commas.

Then commit:
```
git add venture/07-automation/tracker/prospect-queue.csv
git commit -m "local-worker: +<N> prospects <YYYY-MM-DD>"
git push -u origin claude/dropshipping-passive-income-q9a65v
```
If the push is rejected, run `git pull --rebase` once and push again. If it fails again, stop and log it under Problems.

## LOCAL-002 — Store signal log (daily, read-only)

If the browser is already logged in (do not log in yourself), record yesterday's numbers and append one row to `venture/07-automation/tracker/store-signals.csv`:
```
date,gsc_impressions,gsc_clicks,gumroad_views,gumroad_sales,gumroad_revenue,notes
```
- Google Search Console property: `https://paycheck-budget-usa1.vercel.app` (Performance report, last 1 day).
- Gumroad: `https://app.gumroad.com/dashboard` for the pillarsmarketer account (views, sales, revenue).
- Any number you cannot read: write `n/a`. Never change any setting on either site.
Commit the same way as LOCAL-001 with message `local-worker: store signals <YYYY-MM-DD>`.

## LOCAL-003 — Queue hygiene (weekly, Sundays)

In `prospect-queue.csv`, any row with `status=new` whose `date_found` is more than 14 days old: change `status` to `stale`. Change nothing else. Commit with message `local-worker: queue hygiene <YYYY-MM-DD>`.

---

## Problems
(one line per failure, newest last)
