# SIMPLE TASKS — micro-task lane for the small local bot
_One task per run. Do exactly what the task says, nothing more. Report by adding one line to the results doc: https://docs.google.com/document/d/1v6rkBlZ7tv9a0mHNdcjJI1fp5uXgeZB55T7bktZlk4U/edit — start the line with "MINI:". Never log in to anything, never click Buy, never change any setting, never type into any form except the results doc._

## S1 — Store check (repeat every run until it says PUBLIC)
Open https://fb-marketplace-autoresponder.vercel.app in a private/incognito window.
- If you see budget products for sale → add line: `MINI: S1 STORE PUBLIC — first product shown: <name>`
- If you see a Vercel login page → add line: `MINI: S1 STORE STILL GATED`

## S2 — Gumroad shelf check (repeat every run)
Open https://pillarsmarketer.gumroad.com in a private window.
- Count the products shown. Add line: `MINI: S2 GUMROAD SHOWS <number> PRODUCTS — names: <first three names>`

## S3 — Demo check (once per day)
Open https://elevenlabs.io/app/talk-to?agent_id=agent_5001kz0fckd3ep5scqkwfhhgvj73 in a private window.
- If the page loads with a talk/start button → add line: `MINI: S3 DEMO PAGE LOADS`
- If it errors or asks for login → add line: `MINI: S3 DEMO PROBLEM — <what you saw>`

## S4 — Product page checks (only after S2 shows 1+ products)
Open each product page listed on https://pillarsmarketer.gumroad.com. For each: confirm it shows a price and an "I want this" button.
- Add one line per product: `MINI: S4 <product name> — price shown: <price>, buy button: YES/NO`

_That's the whole job. When all checks are green and unchanged, one line per run is enough: `MINI: all checks unchanged`._
