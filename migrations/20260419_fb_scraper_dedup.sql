-- Safety check before applying: confirm no current duplicates.
-- Expected result: empty set. If not empty, de-dupe manually first.
--
-- SELECT fb_post_url, COUNT(*) AS n
-- FROM drop_service.leads
-- WHERE fb_post_url IS NOT NULL
-- GROUP BY fb_post_url
-- HAVING COUNT(*) > 1;

-- Prevent duplicate FB posts from the scraper if it re-sees the same permalink.
-- Partial index so NULL fb_post_url stays unconstrained (pre-scraper legacy rows + quarantined rows OK).
CREATE UNIQUE INDEX IF NOT EXISTS leads_lead_source_fb_post_url_uniq
ON drop_service.leads (lead_source, fb_post_url)
WHERE fb_post_url IS NOT NULL;

-- Helpful lookup index used by the scraper's "does this post already exist" pre-check.
CREATE INDEX IF NOT EXISTS leads_fb_post_url_lookup
ON drop_service.leads (fb_post_url)
WHERE fb_post_url IS NOT NULL;
