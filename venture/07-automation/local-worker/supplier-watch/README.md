# Supplier watch (Mac mini)

Opens each supplier page in `listings.json` in a real Chrome window on the Mac mini, saves the product data and photos, and pushes them to the repo so the cloud agent can read them. It exists because the cloud session cannot reach Temu, AliExpress or Alibaba, and those sites block cloud browsers anyway.

**The repo is public.** So only product data goes into it. Raw page dumps and full-page screenshots stay on the Mac in `~/.supplier-watch-cache/`, and the page screenshot is only committed when the page shows you are signed out.

## What lands in the repo

Into `venture/08-weighted-hoodie/supplier/<listing-id>/`:

| File | What it is |
|---|---|
| `latest/listing.json` | Title, every size and colour with its price, list price and stock, the price range, rating, sold count, shipping lines, size-chart data, and the photo list with each photo's role (gallery, colour, description, size guide) |
| `latest/product.json` | The product's own raw data only, so the cloud agent can re-parse it |
| `latest/screenshot.jpg` | The product section of the page, only when signed out |
| `latest/size-guide.jpg`, `size-guide.txt`, `size-guide-api.json` | The size guide, when the page has one |
| `latest/status.json` | What happened on the last run |
| `images/` | Product, colour and size-chart photos at full size, never duplicated, never other products' photos |
| `price-history.csv` | One row per size and colour per run |
| `_runner/last-run.json` | Heartbeat: when the job last ran, how far it got, and the end of the log |

## What it never does

It never logs in, never types into a form, never clicks add-to-cart, buy, checkout, sign-in, coupons or links, and never spends money. The browser profile and the raw cache live outside the repo, and the script refuses to start if either is inside it.

## One-time setup (about 15 minutes)

1. **Put the clone outside Documents, Desktop, Downloads and iCloud Drive.** macOS blocks scheduled jobs from those folders. For example:
   ```
   mkdir -p ~/code && cd ~/code
   git clone https://github.com/cmoney117/fb-marketplace-autoresponder.git
   cd fb-marketplace-autoresponder && git checkout claude/dropshipping-passive-income-q9a65v
   ```
   If you already have a clone in one of those folders, move it with `mv`.
2. **Let this clone commit and push without prompts.**
   ```
   git config user.name "Mac mini supplier-watch"
   git config user.email "<your GitHub noreply address>"
   brew install gh && gh auth login        # choose HTTPS and "Authenticate Git with your GitHub credentials"
   ```
   If you sign commits with GPG globally, also run `git config commit.gpgsign false` in this clone, since a scheduled job cannot show a passphrase prompt.
3. **Install Node 20.15 or newer** (from nodejs.org or `brew install node`) and **Google Chrome**. Then:
   ```
   cd venture/07-automation/local-worker/supplier-watch
   npm install
   ```
   If Chrome is not installed, also run `npx playwright install chromium`.
4. **Keep the Mac awake.** System Settings > Energy: turn on "Prevent automatic sleeping when the display is off". The display can still sleep. If FileVault is on, nothing runs after a restart until you log in.
5. **First run, by hand, at the screen:**
   ```
   ./run.sh
   ```
   A Chrome window opens on the Temu page. If Temu shows a slider or "verify you are human" check, solve it in that window; the script waits up to 3 minutes and the profile remembers it. If Temu insists on a sign-in, you can sign in yourself in that window; the script never types anything, and while signed in it keeps the page screenshot off the public repo. When it finishes it pushes the results.
6. **Schedule it** (twice a day plus once at login):
   ```
   mkdir -p ~/Library/LaunchAgents
   sed "s#REPO_PATH#$(git rev-parse --show-toplevel)#" com.supplierwatch.daily.plist > ~/Library/LaunchAgents/com.supplierwatch.daily.plist
   plutil -lint ~/Library/LaunchAgents/com.supplierwatch.daily.plist
   launchctl bootout gui/$(id -u)/com.supplierwatch.daily 2>/dev/null
   launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.supplierwatch.daily.plist
   ```
7. **Prove the scheduled job works** (it starts within a few seconds because of RunAtLoad, then waits a random 0 to 30 minutes):
   ```
   launchctl kickstart -k gui/$(id -u)/com.supplierwatch.daily
   tail -f ~/Library/Logs/supplier-watch.log
   ```
   Look for `pushed` and `=== end stage=done`.

## Status codes

| `status.json` | Exit | Meaning | What to do |
|---|---|---|---|
| `OK` | 0 | Everything saved | Nothing |
| `PARTIAL` | 3 | Saved, but some prices, sizes or photos were not parsed | Nothing; the cloud agent re-parses `product.json` |
| `BLOCKED` / `LOGIN_REQUIRED` | 2 | Temu wants a human | Run `./run.sh` by hand and clear it. Scheduled runs pause until you do. |
| `OFF_PRODUCT` / `WRONG_REGION` | 1 | Landed on another product or a non-US Temu site | Check the URL in `listings.json` and that the Mac is not on a VPN |
| `ERROR` | 1 | Something broke | See `~/Library/Logs/supplier-watch.log` |

## Adding or changing a listing

Edit `listings.json`. Each entry needs a short lowercase `id` with dashes and the clean product URL with the part after `?` removed. Set `"enabled": false` to pause one. `run.sh` commits your `listings.json` change with the next results. For a one-off page:
```
./run.sh --url "<product url>" --id aliexpress-eden-alt
```

## Tests

```
npx playwright install chromium   # once
npm test                          # fetcher against fake Temu-style pages (37 checks)
bash test/run_sh_smoke.sh         # run.sh git handling against a throwaway local remote (11 checks)
```
