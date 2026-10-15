# Brand site: single-product page for the hooded cloak

A static site for one product, built by `build.py` (Python 3, standard library only) into `site/`. It is separate from the budget store in `../store/`. Nothing here is deployed, committed or live yet.

> **The GitHub repo is public** (checked 2026-10-15). The internal docs this site reads name the competitor and the supplier. Until Cody makes the repo private, do not commit `hoodie-store/`, `../venture/08-weighted-hoodie/copy/` or `../venture/08-weighted-hoodie/ads/`, and never commit or deploy `site/` while `launch_live` is false. The supplier folder keeps its current name because the Mac mini fetcher writes there (its id is set in `../venture/07-automation/local-worker/supplier-watch/listings.json`).

```
python3 build.py            # build site/ (a preview while launch_live is false)
python3 build.py --check    # run every check and print the report; write nothing
```

Every build prints a report and saves it to `qa/build-report.txt`. The report lists the claims shown, the delivery promise, the colours and sizes, the Stripe text to paste, and, while the site is a preview, the launch blockers that are still open.

## What it reads

| Source | Used for |
|---|---|
| `config.json` | Every value and switch: brand name (written only here), price, colours, sizes, claims, delivery windows, Stripe link, tracking IDs, UI strings. It is also the single source for the copy docs' and the ad kit's tokens (key maps: `claims-register.md` section E and `ads/README.md`) |
| `../venture/08-weighted-hoodie/copy/product-page.md` | All product-page copy, parsed at build time with its `{{#if}}` gates and `{{VERIFY}}` markers. Edit the copy there, not in the HTML |
| `../venture/08-weighted-hoodie/copy/policies.md` | `policies.html` (Shipping, Returns and refunds, Contact, Privacy, Terms of sale) |
| `../venture/08-weighted-hoodie/compliance.md` | The banned-phrase list and the fixed Safety block. The build checks the page's Safety block against it word for word |
| `assets/product/` | Our own photos, when they exist |
| `../venture/08-weighted-hoodie/supplier/temu-eden-cloak/latest/listing.json` | Supplier sizes and colours in stock, when the Mac mini has fetched them |
| `src/style.css`, `src/app.js` | Styles and the page script (`app.js` is inlined; about 6 KB, with a 15 KB budget) |

## What the build refuses to do

The build writes nothing, and exits with code 1, if any of these happen:

- A banned phrase appears in customer-facing text. That covers page text, alt text, meta tags, JSON-LD, UI strings and image file names. The Safety block is skipped, as compliance.md allows. On the Privacy and Terms sections a hit is reported but not blocked.
- A gated phrase appears while its claim is off, for example "weighted" when `claims.weighted` isn't shown.
- A `{{VERIFY}}` marker sits outside its own gate, or a token or gate key is unknown.
- `compare_at` is set, or the price changed without a dated entry in `price_log`.
- Placeholder text, an unrendered token, an image without alt text or a hotlinked image would reach the page.
- `launch_live` is true while any launch check fails (see "Going live").

If a value isn't set yet, such as the support email, the statement descriptor or the policy date, the sentence that needs it is hidden. A customer never sees a gap or "TBD".

## Claims: how they get turned on

Each claim in `config.json` has a `value`, a `verified` flag and a `show_in_preview` flag.

- **Live build:** a claim shows only when `verified` is true. The build refuses while any claim is still `null`, or is on but not verified.
- **Preview build (`site/`):** `preview_unverified_claims` is false, so `site/` shows only verified claims, exactly like a live build would. Until the sample is checked that means no weight, lining, buttons or US-shipping lines, and the China-direct delivery window.
- **Claims preview (scratch only):** to review the page with the owner-stated claims (weighted, faux-fur lining, ships from the US, buttons: the ones with `show_in_preview: true`), run `python3 build.py --out <scratch dir> --set preview_unverified_claims=true`. Every page of that build carries a red "Preview only" banner naming the unconfirmed claims. Never commit or deploy it.
- A claim's `value` stays `null` until the sample gives it (the weight and the outer fiber start null; no expected or competitor figure is typed in). The build refuses `verified: true` while `value` is null.

When the sample arrives, work through section F of `claims-register.md` and set:

| Sample check | config.json |
|---|---|
| Kitchen-scale weight (and a comparison hoodie) | `claims.weighted.verified`; `claims.weight_lbs.value` (the build rounds down to 0.5 lb), `size_weighed`, `verified` |
| Fiber label | `claims.outer_fiber.value` (the label text) and `verified`; `claims.faux_fur_lining.fiber` and `verified` |
| Origin label | `claims.origin.value` (for example "Imported") and `verified` |
| Care label | `claims.care.value` (plain English) and `verified` |
| What gives it its weight | `claims.fill.value` (plain words), or `false` if you can't tell |
| Buttons | `claims.buttons.verified`, or `value: false` |
| US postage and the "Local" tag | `claims.ships_from_us.verified`. Set `value: false` to switch to the China-direct windows, and then run no paid ads |
| Size chart checked with a tape measure | `claims.size_chart.value`, `verified` and `table` rows |
| All of the above | `sample_checked: true` |

If the sample disagrees with a claim, set that claim's `value` to `false`. The page, the JSON-LD, the illustration details and the Safety weight line all drop it together.

## Photos

Put your own photos in `assets/product/`. The build picks them up automatically. Shot list for the sample: `hero.jpg` (the cloak on a plain linen-colour backdrop, 4:5 or square), `detail-hood-up.jpg`, `detail-buttons.jpg` (only if `claims.buttons` is verified), `detail-lining.jpg` (only if `claims.faux_fur_lining` is verified), `detail-on-scale.jpg` (only after `claims.weight_lbs` is verified), and `lifestyle-couch.jpg` and `lifestyle-desk.jpg` with an adult model and a signed release. Until there is a hero photo, keep `launch_live` false and run no ads:

| File | Where it shows |
|---|---|
| `hero.jpg` | Main product image, `og:image` and JSON-LD (replaces the illustration) |
| `detail-*.jpg` | Gallery thumbnails, for example `detail-hood-inside.jpg` |
| `lifestyle-*.jpg` | A photo band under "What it is" (up to 3) |
| `size-chart.png` | Under the size chart, only while the size-chart claim is shown |

jpg, jpeg, png and webp all work. The files are copied to `site/img/` with brand file names, such as `hunkerhood-cloak-hero.jpg`.

- Add a row for every file to `assets/product/image-sources.csv` (file, source, date, notes). A live build refuses images that aren't logged.
- Give each photo alt text in `config.json` under `images.alt`, using the pattern `"<product name> in <color>, <what is visible>"`. Don't mention weight or lining unless that claim is on.
- **Supplier photos are never used automatically.** One is used only if it is listed in `images.supplier_cleared` with all three checks from compliance.md section 7 recorded: reverse-image search, written permission and model release.
- Without photos, the page uses designed fallbacks: an inline-SVG cloak illustration labelled "Illustration", a fabric tile and a hood tile, all drawn in the selected colour.

## Supplier data (Mac mini)

When `listing.json` lands, the next build does the following:

- Uses the in-stock adult sizes from the listing. Children's sizes are dropped and reported. `size_names` renames sizes, for example XXL to 2XL.
- Keeps a colour only while its `supplier_name` is in stock. Supplier colours that aren't mapped yet are listed in the report: add them to `colors` with our own colour name and a hex value.
- Prints the price range with a landed-cost estimate, the shipping lines (and warns if there's no "Local" line), and whether a size guide was captured.

## Stripe Payment Link

1. In the Stripe dashboard (the separate brand account is recommended; see compliance.md section 6), create a product for the cloak at **$99.00 USD** and a Payment Link for it.
2. Payment Link settings:
   - Quantity fixed at 1.
   - Collect shipping address (US only) and phone number. Stripe can't exclude Alaska, Hawaii, PO boxes or APO/FPO addresses, which `delivery.ship_restrictions` rules out for now: check every order's address before placing the supplier order, and contact and refund any you can't serve the same day.
   - Require terms of service consent. This needs the Terms URL `https://<domain>/policies.html#terms` in the public details.
   - While there's no checked size chart, add an optional text custom field labelled "Your height (for sizing)" with placeholder "e.g. 5 ft 9 in".
   - Submit-button custom text: copy it from the build report. It is rendered from product-page.md. The statement-descriptor sentence appears once `stripe.statement_descriptor` is set.
   - After payment, redirect to `https://<domain>/thank-you.html?session_id={CHECKOUT_SESSION_ID}`. The session id lets the thank-you page fire the Purchase event once per order.
   - Turn on receipts and Radar. Turn on Stripe Tax if Tennessee is registered, then set `stripe.tax_enabled` to true.
3. Paste the link into `config.json` as `payment_link` and rebuild. The "Launching soon" button becomes "Buy now".
4. Each checkout gets `client_reference_id=<color>-<size>`, for example `olive-m`, and passes through any `utm_*` parameters. The colour and size show on the payment in Stripe, so order them from the supplier exactly as shown. Without a size picked, Buy asks for one instead of leaving the page. The Buy buttons never carry the raw Payment Link (their `href` is `#size-group`; the page script builds the checkout URL), so a browser without JavaScript can't reach checkout without a colour and size. It sees a "Checkout needs JavaScript switched on." note instead.
5. Make a real test charge. Copy the descriptor it shows into `stripe.statement_descriptor`.

## Tracking

- Fonts load from Google Fonts on every page, so the Privacy section always names Google Fonts (`copy/policies.md`). Self-hosting the two fonts would remove that line.
- `meta_pixel_id`: the Meta Pixel loads on every page with PageView. The product page fires ViewContent on load and InitiateCheckout on Buy; the thank-you page fires Purchase once per checkout session. The Privacy section's Meta lines switch on automatically.
- `ga4_id`: GA4 fires view_item, begin_checkout and purchase. Setting it also adds the Google Analytics line (`privacy_extra.ga4`) to the Privacy section.
- With neither ID set, no tracking code is on the page.

## Vercel

The site is plain static files, so no build runs on Vercel. Do not commit or deploy `site/` until `launch_live` is true (and the repo is private; see the top of this file). Then commit `site/` after running `build.py`.

1. In the Vercel team **usa1** (`team_gnfB7jT0qmJynACDfVkyIKqS`), add a **new** project from this repository. Leave the existing store project alone: it serves `store/site` only.
2. Root Directory: `hoodie-store/site`. Framework Preset: Other. Build Command: none (override to empty). Output Directory: `.` (default).
3. Production branch: the branch you build and commit on.
4. Once the domain is bought, add it in the project's Domains tab, then set `domain` in `config.json` and rebuild. That turns on canonical, Open Graph and Twitter tags, the sitemap and absolute JSON-LD URLs.
5. `site/vercel.json` adds security headers. While `launch_live` is false it also sends `X-Robots-Tag: noindex`. On top of that, robots.txt disallows everything and every page has a noindex meta tag. `404.html` is served for unknown paths.

## Going live

Set `launch_live: true` and run `python3 build.py`. The build refuses until every launch check passes. The checks are:

- The sample gate is done and every claim is set and verified (or switched off).
- Fiber content and origin are verified. They are required on the page.
- The payment link, support email, legal business name, domain, policy date and statement descriptor are all set.
- There is a hero photo of our own sample, and every image is logged.
- Colours are confirmed against `listing.json`, or marked `confirmed`. Sizes come from the listing, or `sizes_confirmed` is set.
- The delivery profile in use has both windows.

Preview builds print the same list as unchecked boxes. The holiday order-by line (Fri 4 Dec 2026) is removed by the build after that date, and by the page script too, even if nobody rebuilds.

## QA

```
python3 build.py --out /tmp/flow-site --set payment_link=https://buy.stripe.com/test_qa \
  --set meta_pixel_id=123456789012 --set ga4_id=G-TEST1234
NODE_USE_ENV_PROXY=1 NODE_PATH=$(npm root -g) node qa/shoot.mjs site /tmp/flow-site
```

This saves `qa/desktop.png` (1366x900), `qa/tablet.png` (768x1024), `qa/mobile.png` (375x812) and close-ups. It checks for horizontal scroll, side gutters (no text closer than 15 px to the screen edge below 1200 px), alt text, the JS budget, console errors and, with the IDs empty, that no pixel or analytics loader is on the page. It also tests the Buy flow: size required, colour repaint, the exact checkout URL with `client_reference_id` and UTMs, the sticky bar, pixel and GA4 events, and Purchase firing only once. `--set` overrides any config value for one build without editing `config.json`.
