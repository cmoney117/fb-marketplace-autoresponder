# Supplier watch (Mac mini)

Opens each supplier page in `listings.json` in a real Chrome window on the Mac mini, saves everything on the page, and pushes it to the repo so the cloud agent can read it. It exists because the cloud session cannot reach Temu, AliExpress or Alibaba, and those sites block cloud browsers anyway.

## What it saves

Into `venture/08-weighted-hoodie/supplier/<listing-id>/`:

| File | What it is |
|---|---|
| `latest/listing.json` | Title, every size/colour combination with its price and stock, page prices, rating, sold count, shipping lines, size-chart data, image list |
| `latest/screenshot-full.png` | The whole page as you would see it |
| `latest/size-guide.png`, `size-guide.txt` | The size guide pop-up, if the page has one |
| `latest/page.html`, `page.txt`, `raw.json` | The raw page, kept so nothing is lost if a field was not parsed |
| `images/` | Every product, colour and size-chart photo, full resolution, never duplicated |
| `price-history.csv` | One row per size/colour per run, so price changes show up |
| `snapshots/<date>/` | A small dated copy of `listing.json` and the run status |

## What it never does

It never logs in, never types into a form, never clicks add-to-cart, buy or checkout, and never spends money. Its browser profile lives in `~/.supplier-watch-profile`, outside the repo, so cookies are never committed.

## One-time setup (about 10 minutes)

1. Make sure Google Chrome and Node are installed. In Terminal:
   ```
   node -v || brew install node
   ```
2. Make sure the repo clone on the Mac mini can push. If `git push` asks for a login, run `gh auth login` or add an SSH key first.
3. Install the one dependency:
   ```
   cd <repo>/venture/07-automation/local-worker/supplier-watch
   git checkout claude/dropshipping-passive-income-q9a65v && git pull
   npm install
   ```
   If Google Chrome is not installed, also run `npx playwright install chromium`.
4. First run, by hand, while you are at the screen:
   ```
   ./run.sh
   ```
   A Chrome window opens on the Temu page and scrolls through it. If Temu shows a slider or "verify you are human" check, solve it in that window. The script waits up to 3 minutes and the profile remembers it next time. When it finishes it pushes the results. Total time is about 1 to 2 minutes.
5. Schedule it twice a day:
   ```
   sed "s#REPO_PATH#$(git rev-parse --show-toplevel)#" com.supplierwatch.daily.plist > ~/Library/LaunchAgents/com.supplierwatch.daily.plist
   launchctl load ~/Library/LaunchAgents/com.supplierwatch.daily.plist
   ```
   It runs at 9:07 and 21:07 while you are logged in. Logs go to `/tmp/supplier-watch.out.log`.

## Adding or changing a listing

Edit `listings.json`. Each entry needs a short lowercase `id` with dashes and the clean product URL with the tracking part after `?` removed. Set `"enabled": false` to pause one. For a one-off page:
```
./run.sh --url "<product url>" --id aliexpress-eden-alt
```

## If something goes wrong

- Exit code 2 means a bot check was not cleared. Run `./run.sh` by hand and solve it.
- `latest/status.json` says what happened on the last run.
- If `listing.json` shows no sizes or prices, the raw page is still saved and the cloud agent can parse it from `raw.json` and `page.txt`.

## Test

`npm test` runs the fetcher against a fake product page offline. It checks parsing, image saving, the size guide, the bot-check exit, and that add-to-cart and buy buttons are never pressed.
