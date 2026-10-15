# Ad and content kit: weighted hooded cloak

Written 2026-10-15. Everything here is ready to shoot, generate or paste the day the sample arrives. Nothing in this folder has been posted, uploaded, generated or spent.

**Read with:** `../compliance.md` (banned phrases, gated claims, safety block), `../economics.md` (price, budget, kill rules), `../brand-screen.md` (working brand), `../../05-marketing/tracking-and-utm-conventions.md`.

## What is in the kit

| File | What it is | Used by |
|---|---|---|
| `angles.md` | 8 angles ranked by expected strength, with audience, hook line, reason and gates | Everyone; read first |
| `video-scripts.md` | 6 vertical scripts (9-25 s), shot by shot, plus the one-session shoot list for the sample | Cody with a phone; later the AI video pack |
| `static-ads.md` | 8 static ad concepts: headline, primary text (short and long), CTA, image, alt text | Meta ads, organic posts |
| `ai-prompt-pack.md` | 12 image prompts and 6 video prompts, with the re-shoot flag on every shot | Whoever runs generation once it is enabled |
| `launch-plan.md` | Meta test build (ABO, 3 ad sets, UTMs, daily checks, kill and scale rules) and the $0 TikTok organic plan | Cody running the test |
| `asset-log.csv` | The source log for every photo, clip and generated image (compliance §7: "log the source of every image") | Fill in as assets are made |
| `meta-daily-log.csv` | One row per ad per day during the Meta test | Daily check |
| `tiktok-post-log.csv` | One row per TikTok post, filled at 72 hours | Weekly TikTok review |
| `check_copy.py` | Runs the banned list, claim gates and number rule over every customer-facing line in this kit | Run after every edit |

## The four rules this kit is built on

1. **No product image exists yet, and none is faked.** Every visual is either Cody's own photo or clip of the sample, or an AI prompt waiting for generation to be switched on. Supplier and competitor photos are never used, not even as an AI reference image.
2. **Weight and material claims are switched, not written.** Every line that mentions weight, lining, fiber, care, sizes or delivery declares the central-config flag it needs (`**Requires:**`). If the sample disagrees, switch the flag off and every ad that needs it is out, together. Most weight-dependent pieces carry a fallback version that needs no flag.
3. **No number is typed into copy.** Price, weight, delivery windows, heights and the refund summary are `{{TOKENS}}` filled from the central config. The only raw numbers allowed are clock times in a joke ("after 5pm").
4. **Cody speaks as the seller, never as a customer.** No script has anyone pretend to be a buyer, and no copy contains a review, a rating, a customer count or a quote.

## Tokens

The central config is **`../../../hoodie-store/config.json`**, the same file the product page is built from. The brand name lives there only, as `brand_name`; this kit only ever writes `{{BRAND}}`. The middle column gives the real `config.json` key. The copy docs map their own tokens to the same keys in `../copy/claims-register.md` section E.

| Token | `config.json` key | Value today | Gate |
|---|---|---|---|
| `{{BRAND}}` | `brand_name` | Hunkerhood (working name) | none |
| `{{DOMAIN}}` | `domain` | empty: hunkerhood.com is **not bought yet** | none |
| `{{HANDLE}}` | `handle` | empty until claimed; then "@" + the brand slug | none |
| `{{BRAND_TAG}}` | `hashtag` | empty until chosen; then "#" + the brand slug | none |
| `{{LINK}}` | built per ad: `https://` + `domain` + `/` + the UTM string in `launch-plan.md` §4 | | none |
| `{{PRICE}}` | `price` (every change dated in `price_log`) | $99 (flat, no compare-at) | none |
| `{{REFUND_LINE}}` | `refund_summary` | one line that says exactly what the live Returns policy says (checked by `check_copy.py`) | none |
| `{{SUPPORT_EMAIL}}` | `support_email` | set at launch | none |
| `{{BUSINESS_NAME}}` | `legal_business_name` | the legal or trading name on the policies page | none |
| `{{BUSINESS_ADDRESS}}` | not in config: written out in the copy docs | 159 4th Ave N, Ste 100 #2179, Nashville, TN 37219 | none |
| `{{COLOURS}}` | `colors[].name` (only colours in stock in `listing.json`) | Charcoal, Oatmeal, Olive, Cocoa (placeholders) | none |
| `{{SHIP_WINDOW}}` | `delivery.profiles.<profile>.ship_window` | us_local: 1-4 business days | `claims.ships_from_us` |
| `{{ARRIVAL_WINDOW}}` | `delivery.profiles.<profile>.arrival_window` | us_local: 5-11 business days | `claims.ships_from_us` |
| `{{XMAS_LAST_ORDER}}` | `delivery.holiday.order_by` | 2026-12-04 (Fri 4 Dec) | `claims.ships_from_us` |
| `{{WEIGHT_LB}}` | `claims.weight_lbs.value` | null until the sample is weighed; rounded **down** to 0.5 lb | `claims.weighted` + `claims.weight_lb` |
| `{{LINING_DESC}}` | `claims.faux_fur_lining.fiber` | from the fiber label, e.g. "polyester faux-fur" | `claims.lining` |
| `{{OUTER_FIBER}}` | `claims.outer_fiber.value` | null until the label is read | `claims.outer_fiber` |
| `{{CARE_LINE}}` | `claims.care.value` | null until the care label is read | `claims.care` |
| `{{HEIGHT_MIN}}` / `{{HEIGHT_MAX}}` | `claims.size_chart.table` (first and last rows) | from the supplier size guide, adult sizes only | `claims.sizes` |
| `{{SIZE_CHART}}` | `claims.size_chart.table` | the height-to-size table as rendered on the product page | `claims.sizes` |
| `{{OWNER_HEIGHT}}` / `{{OWNER_SIZE}}` | shoot log (not config) | Cody's measured height and the size Cody wears in the clip | `claims.sizes` |

`<profile>` is `us_local` while `claims.ships_from_us` is on, otherwise `china_direct`.

## Claim gates (from `compliance.md`, "Gated claims")

Each gate name is a claim's `copy_flag` in `config.json`. A gate is on when that claim has a `value` and `verified: true`.

| Flag | Words in this kit that need it | Turn on only when |
|---|---|---|
| `claims.weighted` | weighted, weight, weighs, heavy, calming weight, comforting weight, weighted hug | The sample has real added weight |
| `claims.weight_lb` | `{{WEIGHT_LB}}`, lb, pounds | Kitchen-scale weight recorded |
| `claims.lining` | faux fur, sherpa, plush, fleece, fur, lining, lined | Lining matches and the fiber label confirms it |
| `claims.outer_fiber` | cotton, `{{OUTER_FIBER}}` | The sewn-in label says so |
| `claims.care` | washable, wash, dryer, `{{CARE_LINE}}` | The care label says so |
| `claims.ships_from_us` | `{{SHIP_WINDOW}}`, `{{ARRIVAL_WINDOW}}`, Christmas, arrives | US "Local" origin confirmed (`listing.json` + sample postage) |
| `claims.sizes` | sized by height, tall, size chart, heights, mid-calf | Size table built from the supplier guide and checked on the sample. Adult sizes only |
| `claims.origin` | Imported | The sewn-in label gives the origin |
| `features.buttons` (config: `claims.buttons`) | button, buttons, buttoned | Buttons run down the front of the sample and close it |

**If `claims.ships_from_us` is off, no paid ad runs at all** (`economics.md` §7). Organic posts may continue, using only the honest China-direct promise from config.

**If `claims.weighted` is off,** the product is a lined hooded cloak, not a weighted one. Angles 1 and the weight cards fall away (see `angles.md`, "If the weight claim is off"). Re-run `economics.md` before spending on an unweighted version.

## How to check copy

```
python3 -I venture/08-weighted-hoodie/ads/check_copy.py
```

It reads the banned list straight from `../compliance.md`, so a phrase added there is enforced here on the next run. It checks every ` ```copy ` block, every table column named Hook line, On-screen text, Voiceover, Caption, Headline, On-image text, Alt text, Card text, Copy or Reply, every media file name, and runs the banned list over the AI prompts. It fails on: a banned phrase, a gated word without its flag, an unknown token, a typed number, or the literal brand name. It prints watch-list words (introvert, nap, "are you" and so on) for a human to read. Text inside ` ```safety ` blocks is the fixed Safety block and is skipped, as compliance allows.

The check covers this folder. Copy pasted into Ads Manager, TikTok or an email tool must be the same text as here; if it is edited there, paste it back here and re-run.

## Order of operations

1. **Sample arrives:** run the sample gate in `../compliance.md` (weigh, label, packaging, dates, origin). Set the claim flags.
2. **Shoot day** (`video-scripts.md`, "Shoot list"): one session, about 2.5-3 hours, everything filmed and photographed. Log every file in `asset-log.csv` (every planned file already has a row).
3. **Edit** the 6 videos and 8 statics. Fill tokens from config. Run `check_copy.py`.
4. **TikTok organic** can start as soon as the product page is live (`launch-plan.md` §12). It costs $0 and tells us which hooks hold attention before Meta money is spent.
5. **Meta test** starts only when every gate in `launch-plan.md` §1 is ticked.
6. **AI generation** runs whenever it is enabled (`ai-prompt-pack.md`). Its outputs fill gaps and test new scenes; they never replace the real-sample shots marked "re-shoot".
