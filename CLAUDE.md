# Claude Code — Project Guide

## Repositories in this workspace

| Project | Description |
|---|---|
| `fb-marketplace-autoresponder/` | Chrome extension — FB Marketplace AI auto-reply for USA Fleet Sales |
| `hive-website/` | Improved website for Hive Home Services TN (`hivehomeservicestn.com`) |

---

## Claude Design Integration

**Claude Design** lives at `claude.ai/design` (requires Claude Pro / Max / Team / Enterprise).
It turns prompts into polished visual designs, then exports a **handoff bundle** that Claude Code implements directly.

### Workflow: Design → Code

```
1. Open claude.ai/design
2. Paste the brand context from hive-website/design-tokens.css
3. Describe the page or component you want designed
4. Claude Design generates a visual mockup using the Hive brand system
5. Click "Hand off to Claude Code" → download the .zip bundle
6. Drop the bundle into hive-website/ and tell Claude Code:
   "Implement the Claude Design handoff in hive-website/"
7. Claude Code reads the spec, design tokens, and assets and writes the code
8. Run: npx serve hive-website/ to preview locally
```

### What Claude Design can create

- Landing pages & homepages
- Service pages (plumbing, painting, etc.)
- Pricing tables
- Testimonial / review sections
- Email templates
- Social media graphics
- Pitch decks / one-pagers

### Export formats

| Format | Use |
|---|---|
| Standalone HTML | Drop into `hive-website/` and implement |
| ZIP bundle | Full handoff to Claude Code |
| PDF / PPTX | Stakeholder review |
| Canva | Further editing |
| Internal share URL | Team review |

### Brand context to paste into Claude Design

```
Brand: Hive Home Services
Location: Nashville, TN & Middle Tennessee
Colors: Amber #F59E0B (primary), Dark #1C1917 (bg-dark), White #FAFAF9 (bg-light),
        Red #DC2626 (emergency/urgent), Slate #64748B (muted text)
Font: Inter (system-ui fallback)
Tone: Trustworthy, local, professional. No hourly rates — fixed prices only.
USP: Fixed upfront pricing · Licensed & insured · 5-min response · Satisfaction guaranteed
Services: Plumbing (incl. 24/7 emergency), Painting, Pressure Washing,
          Masonry, Window Tinting, Junk Removal, House Cleaning, Lawn Mowing, Gutter Cleaning
Service area: Nashville, Brentwood, Franklin, Mt. Juliet, Hendersonville,
              Murfreesboro, Clarksville, Gallatin, Goodlettsville
CTA phone: (615) 000-0000  [replace with real number]
CTA booking: /book
```

---

## hive-website — Development

### Local preview
```bash
npx serve hive-website/
# or
python3 -m http.server 8080 --directory hive-website/
```

### File structure
```
hive-website/
├── index.html              # Homepage
├── emergency-plumber.html  # 24/7 emergency plumbing page
├── css/
│   ├── design-tokens.css   # Brand design system (colors, type, spacing)
│   └── style.css           # Component & layout styles
└── assets/                 # Images / icons (add here)
```

### Deploying changes to the live site
1. Build / export the updated files from this folder
2. Upload via your hosting platform (Wix / Squarespace / Vercel / cPanel / etc.)
3. Verify on mobile + desktop after uploading
4. Test all CTAs (phone link, booking form, contact form)

---

## FB Marketplace Extension — Development

### Load in Chrome
1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select this folder
4. Open `https://www.facebook.com/messages/`

### Key files
| File | Purpose |
|---|---|
| `manifest.json` | Extension config, permissions |
| `background.js` | Poll loop, AI reply generation, follow-up engine |
| `content.js` | Scans Facebook DOM, detects Marketplace messages |
| `popup.html/js` | Extension popup UI |

### Environment variables (stored in Chrome local storage)
- `config.agentSecret` — CRM API secret key
- `config.enabled` — auto-reply on/off toggle
- `config.fallbackReply` — message to send if AI fails
