# FB Marketplace Auto-Responder + Hive Home Services

## Active Branch
`claude/integrate-claude-design-oMOG3`

## Git Push (sandbox requires PAT)
Sandbox TLS inspection blocks standard git push. Use a GitHub Classic PAT:
```
git push "https://cmoney117:<GITHUB_PAT>@github.com/cmoney117/fb-marketplace-autoresponder.git" claude/integrate-claude-design-oMOG3
```
The PAT is stored in ~/.git-credentials on the sandbox machine.

## Claude Design Workflow (claude.ai/design)
Claude Design is a browser-only visual design tool — no public API.
To use it for Hive Home Services, paste this brand context block:

```
Brand: Hive Home Services
Website: hivehomeservicestn.com
Colors: Amber #F59E0B (primary), Dark #1C1917 (background), Red #DC2626 (emergency), Light #FAFAF9 (surface)
Font: Inter (400/500/600/700/900)
USP: Fixed upfront pricing · Licensed & insured · 5-min response · 24/7 emergency
Services: plumbing, painting, pressure washing, lawn mowing, gutter cleaning, house cleaning, junk removal, handyman
Target: Nashville and Middle Tennessee homeowners
Phone: (615) 000-0000
Tone: Direct, trustworthy, anti-hourly-billing
```

Export from Claude Design → "Code" → copy HTML/CSS → adapt to use design-tokens.css variables.

## Hive Website Structure (28 pages — all live on branch)
```
hive-website/
  index.html                  Homepage ✅
  book.html                   Booking / quote form (all forms POST here) ✅
  emergency-plumber.html      24/7 emergency plumbing page ✅
  plumbing.html               Plumbing service page ✅
  clarksville-plumbing.html   Clarksville location page ✅
  painting.html               Interior painting ✅
  exterior-painting.html      Exterior painting ✅
  pressure-washing.html       Pressure washing ✅
  lawn-mowing.html            Lawn mowing & maintenance ✅
  gutter-cleaning.html        Gutter cleaning ✅
  house-cleaning.html         House cleaning ✅
  junk-removal.html           Junk removal ✅
  handyman.html               Handyman ✅
  landscaping.html            Landscaping & mulching ✅
  css/
    design-tokens.css         CSS custom property brand system
    style.css                 Full component library
  areas/
    gallatin.html             ✅   goodlettsville.html   ✅
    nashville.html            ✅   brentwood.html        ✅
    franklin.html             ✅   mt-juliet.html        ✅
    hendersonville.html       ✅   murfreesboro.html     ✅
    antioch.html              ✅   madison.html          ✅
    smyrna.html               ✅   portland.html         ✅
    white-house.html          ✅   westmoreland.html     ✅
```

Verification: 28 pages, zero broken internal links, correct relative CSS
paths on every page, JSON-LD schema on every page. All quote forms link
to /book (clean-URL convention — same as canonical /plumbing → plumbing.html).

## Deploy Steps
1. Replace all `(615) 000-0000` and `tel:6150000000` with real phone number
2. Change all `/book` form actions to real booking URL
3. Upload to hivehomeservicestn.com root
4. Submit sitemap to Google Search Console

## Chrome Extension
Load unpacked from repo root in `chrome://extensions`. Files: manifest.json, background.js, content.js, popup.html, popup.js.
