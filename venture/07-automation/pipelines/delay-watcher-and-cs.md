# Pipeline: Delay-Watcher & Customer Service Run

The single most important automation for compliance + dispute prevention. Runs inside the daily ops session.

## Delay-watcher
1. Pull open orders from `tracker/orders.csv` + supplier/platform status (API where connected).
2. Any order where `today > promised_by` and not delivered → send T2 delay email (notify + partial-credit-or-refund choice, per `04-operations/customer-service-sop.md`), set `issue=delayed`, log action ID (idempotent — never double-send).
3. Any order unshipped 48h past the supplier's production window → open supplier ticket, flag in NEEDS-HUMAN if unresolved in 24h.
4. Supplier shipping windows re-checked weekly → listing delivery estimates updated automatically (windows shown = supplier current +2 days).

## CS run
1. Read support inbox (all marketplace messages forward to the support Gmail).
2. Classify → template (T1–T8) → auto-send low-risk categories; draft + flag per the SOP's draft-only list.
3. Standing powers: refund/replace ≤$50 with colorable complaint, same day, log with reason code. Daily auto-refund cap $200 total; above → NEEDS-HUMAN.
4. Post-delivery +3 days → T8 review request (once, ever, per order).
5. Metrics to tracker: response time, refund rate, dispute count (tripwire check).
