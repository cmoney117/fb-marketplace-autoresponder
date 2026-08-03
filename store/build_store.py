#!/usr/bin/env python3
"""Static storefront generator. Edit PRODUCTS/CONFIG, run, deploy the store/site/ folder.
Payment links: set per-product 'payment_link' to the real Stripe Payment Link URL when keys exist.
"""
import os, html, shutil

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(ROOT, "site")

CONFIG = {
    "brand": "The Paycheck Budget",
    "tagline": "Simple money tools that fit real life — built, tested, and guaranteed by a small US studio.",
    "support_email": "",  # set at launch; while empty, pages degrade gracefully (no placeholder text is ever shown to customers)
    "ga4_id": "",  # e.g. G-XXXXXXX — injected when set
    "meta_pixel_id": "",  # numeric Meta Pixel ID — injected when set (required before ads per campaign-build-sheets.md)
    "base_url": "https://fb-marketplace-autoresponder.vercel.app",  # e.g. https://thepaycheckbudget.com — enables og:url/og:image when set
    "statement_descriptor": "Hive Home Services (our parent company)",  # checkout runs on the owner's existing Stripe account (TASK-002N); replace with the exact descriptor string once the worker records it
}

GUARANTEE = "If the file doesn't work, doesn't match the description, or you bought a duplicate — full refund, no questions. Message us any time; a real human answers fast."

# Source folder for deliverable files (copied into site/dl/<token>/ at build).
PQ = os.path.join(os.path.dirname(ROOT), "venture", "07-automation", "tracker", "publish-queue")

PRODUCTS = [
    {
        "slug": "paycheck-budget",
        "name": "The Paycheck Budget",
        "price": "$14.99",
        "payment_link": "#",
        "dl_token": "e09f9ec2de1071da",
        "files": ["paycheck-budget-v1/Paycheck-Budget-System.xlsx"],
        "headline": "The spreadsheet that budgets the way you actually get paid.",
        "sub": "Zero-based budgeting, one paycheck at a time. Enter your check, give every dollar a job, watch 'Left to Assign' hit $0. No math, no guesswork.",
        "bullets": [
            "Paycheck Budget tab — planned vs actual, per check",
            "Debt Snowball tab — exact payoff month for every debt",
            "Year Dashboard — watch your savings rate climb",
            "Start-Here guide + worked example — never a blank page",
            "Works in Google Sheets (free) and Excel",
        ],
        "img": "img/paycheck-budget.png",
        "in_bundle": True,
        "faq": [
            ("Is this a subscription?", "No — one payment, yours forever, including updates to this version."),
            ("Do I need Excel?", "No. Google Sheets (free) works perfectly — upload and go."),
            ("How do I get it?", "Instant download link on the confirmation page and by email right after checkout."),
            ("I'm not a spreadsheet person.", "That's who it's for. You only ever touch the yellow cells; a full example is pre-loaded."),
        ],
    },
    {
        "slug": "debt-payoff-planner",
        "name": "Debt Payoff Planner",
        "price": "$14.99",
        "payment_link": "#",
        "dl_token": "43c9ab2d3cd47ab0",
        "files": ["debt-payoff-planner-v1/Debt-Payoff-Planner.xlsx"],
        "headline": "Snowball or Avalanche — see your debt-free date either way.",
        "sub": "Enter your debts and your extra payment, see the payoff months under each strategy, pick the plan you'll stick to, and log every win.",
        "bullets": [
            "Room for 10 debts, with a pre-ranked worked example",
            "Months-to-payoff calculated for you, extra payment included",
            "Snowball vs Avalanche side-by-side — pick with eyes open",
            "Progress tab that makes paying debt weirdly satisfying",
            "Works in Google Sheets (free) and Excel",
        ],
        "img": "img/debt-payoff.png",
        "in_bundle": True,
        "faq": [
            ("Which strategy is better?", "Avalanche saves the most interest; Snowball wins on motivation. The planner shows both so you choose."),
            ("Is this financial advice?", "No — it's a calculator/organizer tool. It does the math on numbers you enter."),
            ("How do I get it?", "Instant download after checkout, plus email delivery."),
        ],
    },
    {
        "slug": "savings-goal-tracker",
        "name": "Savings Goal Tracker",
        "price": "$12.99",
        "payment_link": "#",
        "dl_token": "a67624e28243cea2",
        "files": ["savings-goal-tracker-v1/Savings-Goal-Tracker.xlsx"],
        "headline": "Every goal gets a number, a date, and a plan.",
        "sub": "Up to 8 goals with an automatic save-per-month plan, a deposit log, and the classic 52-Week Challenge built in ($1,378 by week 52).",
        "bullets": [
            "8 goals with % progress and required monthly savings",
            "52-Week Challenge tab with running total",
            "Savings log — every deposit recorded",
            "Works in Google Sheets (free) and Excel",
        ],
        "img": "img/savings-tracker.png",
        "in_bundle": True,
        "faq": [
            ("Can I change the goals?", "All of them — names, targets, timelines. The math follows."),
            ("How do I get it?", "Instant download after checkout, plus email delivery."),
        ],
    },
    {
        "slug": "savings-challenge-pack",
        "name": "Savings Challenge Printable Pack",
        "price": "$9.99",
        "payment_link": "#",
        "dl_token": "44bb991914a635a5",
        "files": ["savings-challenge-pack-v1/52-Week-Challenge.pdf", "savings-challenge-pack-v1/Biweekly-Challenge.pdf", "savings-challenge-pack-v1/1000-Emergency-Fund.pdf", "savings-challenge-pack-v1/No-Spend-Month.pdf"],
        "headline": "Four challenges that make saving weirdly fun.",
        "sub": "52-Week Challenge ($1,378), Biweekly Challenge ($2,106), $1,000 Emergency Fund chart, and a No-Spend Month tracker. Print at home, check the boxes, watch it stack.",
        "bullets": [
            "4 print-ready PDFs (US Letter, A4-friendly)",
            "52-Week Challenge — $1,378 by week 52",
            "Biweekly version for people paid every two weeks",
            "$1,000 Emergency Fund chart (25 × $40)",
            "Print as many times as you like, forever",
        ],
        "img": "img/challenge-pack.png",
        "faq": [
            ("Do I need a special printer?", "Any home printer — black and white looks great too."),
            ("How do I get it?", "Instant download after checkout, plus email delivery."),
        ],
    },
    {
        "slug": "wedding-budget-planner",
        "name": "Wedding Budget & Guest Tracker",
        "price": "$16.99",
        "payment_link": "#",
        "dl_token": "6526dd652b5a15fd",
        "files": ["wedding-budget-planner-v1/Wedding-Budget-Guest-Tracker.xlsx"],
        "headline": "Plan the wedding, not a spreadsheet.",
        "sub": "The budget, the guest list, and every vendor payment in one organized file. Typical %-of-budget guidance, RSVPs and meals counted for you, and no deposit ever sneaks up on you.",
        "bullets": [
            "Wedding Budget tab — 12 categories with typical % guidance, planned vs actual",
            "Running 'Left to Plan' against YOUR total budget",
            "Guest List — RSVPs, headcount, meal counts, gifts, and thank-yous counted automatically",
            "Vendor Payment Schedule — deposits, balances, due dates, paid so far vs still to pay",
            "Works in Google Sheets (free) and Excel",
        ],
        "img": "img/wedding-budget.png",
        "faq": [
            ("Can I change the categories?", "All of them — names, percentages, amounts. The math follows."),
            ("How many guests fit?", "100 rows ready to go; the RSVP and meal counters cover them all."),
            ("Is the typical % a rule?", "No — it's a starting split from real weddings. Your yellow cells are the plan; the % column is just guidance."),
            ("How do I get it?", "Instant download after checkout, plus email delivery."),
        ],
    },
    {
        "slug": "simple-budget-starter",
        "name": "The 10-Minute Simple Budget",
        "price": "$9.99",
        "payment_link": "#",
        "dl_token": "66a2786dce039efe",
        "files": ["simple-budget-starter-v1/10-Minute-Simple-Budget.xlsx"],
        "headline": "The budget for people who hate budgeting.",
        "sub": "One page. Money in, ten spending lines, and a LEFT OVER box. Traffic-light colors do the judging — ten minutes to set up, two to update.",
        "bullets": [
            "One Monthly Budget page — income, exactly 10 spending lines, done",
            "'Left over' calculated for you, with traffic-light colors",
            "Bill Calendar — 12 months of checkboxes that turn green when paid",
            "Designed ADHD-friendly: minimal inputs, instant feedback, zero maintenance guilt",
            "Works in Google Sheets (free) and Excel",
        ],
        "img": "img/simple-budget.png",
        "faq": [
            ("Why so small?", "On purpose. Ten lines you'll actually update beat forty categories you'll abandon by February."),
            ("How is this different from The Paycheck Budget?", "This is the minimal starter — one page a month. The Paycheck Budget is the full per-paycheck system with debt snowball and year dashboard."),
            ("How do I get it?", "Instant download after checkout, plus email delivery."),
        ],
    },
    {
        "slug": "money-reset-bundle",
        "name": "Money Reset Bundle",
        "price": "$29.99",
        "compare_at": "$42.97",
        "payment_link": "#",
        "dl_token": "e030dede919b1602",
        "files": ["paycheck-budget-v1/Paycheck-Budget-System.xlsx", "debt-payoff-planner-v1/Debt-Payoff-Planner.xlsx", "savings-goal-tracker-v1/Savings-Goal-Tracker.xlsx"],
        "headline": "Budget it. Crush the debt. Build the savings. One bundle.",
        "sub": "All three tools in one instant download: give every dollar a job one paycheck at a time, see your debt-free date, and put every savings goal on a schedule. Set up the first one in about 10 minutes.",
        "bullets": [
            "The Paycheck Budget ($14.99 on its own)",
            "Debt Payoff Planner ($14.99 on its own)",
            "Savings Goal Tracker ($12.99 on its own)",
            "Save $12.98 — 30% off the three sold separately",
            "Start-Here guide + worked example in every tool",
            "Works in Google Sheets (free) and Excel",
        ],
        "img": "img/bundle.png",
        "faq": [
            ("Is everything included?", "Yes — all three complete tools, every tab, instant download."),
            ("One payment?", "One payment, yours forever."),
        ],
        "featured": True,
    },
]

CSS = """
*{margin:0;padding:0;box-sizing:border-box}
:root{--navy:#1f3a5f;--teal:#2e7d6b;--gold:#f2c14e;--cream:#f8f6f0;--dark:#282c34;--gray:#5a5f69}
body{font-family:Georgia,'Times New Roman',serif;color:var(--dark);background:var(--cream);line-height:1.6}
.sans{font-family:Helvetica,Arial,sans-serif}
header{background:var(--navy);color:#fff;padding:14px 24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}
header a{color:#fff;text-decoration:none}
header .brand{font-size:1.25rem;font-weight:bold}
nav{display:flex;gap:16px;flex-wrap:wrap}
nav a{font-family:Helvetica,Arial,sans-serif;font-size:.95rem}
.wrap{max-width:1080px;margin:0 auto;padding:0 20px}
.hero{padding:64px 0 40px;text-align:center}
.hero h1{font-size:2.4rem;color:var(--navy);margin-bottom:14px}
.hero p{font-size:1.15rem;color:var(--gray);max-width:640px;margin:0 auto}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px;padding:40px 0}
.card{background:#fff;border:1px solid #e2ddd2;border-radius:14px;overflow:hidden;display:flex;flex-direction:column}
.card img{width:100%;height:auto;display:block;background:#eee}
.card .body{padding:18px;display:flex;flex-direction:column;gap:8px;flex:1}
.card h3{color:var(--navy)}
.price{font-family:Helvetica,Arial,sans-serif;font-weight:bold;font-size:1.15rem}
.compare{color:var(--gray);text-decoration:line-through;font-weight:normal;font-size:.95rem;margin-left:8px}
.btn{display:inline-block;background:var(--teal);color:#fff!important;padding:14px 28px;border-radius:10px;font-family:Helvetica,Arial,sans-serif;font-weight:bold;text-decoration:none;text-align:center;font-size:1.05rem}
.btn.gold{background:var(--gold);color:var(--dark)!important}
.btn:hover{opacity:.92}
.btn.soon{background:#e7e3d8;color:var(--gray)!important;cursor:default}
.btn.soon:hover{opacity:1}
.badge{display:inline-block;background:var(--gold);color:var(--dark);font-family:Helvetica,Arial,sans-serif;font-size:.78rem;font-weight:bold;padding:4px 10px;border-radius:20px}
.pd{display:grid;grid-template-columns:1fr 1fr;gap:40px;padding:48px 0;align-items:start}
.pd img{width:100%;border-radius:14px;border:1px solid #e2ddd2}
.pd h1{color:var(--navy);font-size:2rem;margin-bottom:10px}
.pd .sub{color:var(--gray);font-size:1.08rem;margin-bottom:18px}
.pd ul{margin:18px 0 24px 20px}
.pd li{margin-bottom:8px}
.guarantee{background:#fff;border-left:5px solid var(--gold);padding:14px 18px;border-radius:8px;font-size:.98rem;margin:22px 0}
.trust{font-family:Helvetica,Arial,sans-serif;font-size:.85rem;color:var(--gray);margin-top:10px}
.faq{padding:20px 0 60px}
.faq h2{color:var(--navy);margin-bottom:16px}
.faq details{background:#fff;border:1px solid #e2ddd2;border-radius:10px;padding:14px 18px;margin-bottom:10px}
.faq summary{font-weight:bold;cursor:pointer}
footer{background:var(--navy);color:#cfd8e3;padding:28px 24px;font-family:Helvetica,Arial,sans-serif;font-size:.85rem;text-align:center}
footer a{color:#fff}
.policy{padding:48px 0;max-width:760px}
.policy h1,.policy h2{color:var(--navy);margin:22px 0 10px}
.upsell{font-family:Helvetica,Arial,sans-serif;font-size:.95rem;margin-top:14px}
.cta2{text-align:center;padding:0 0 64px}
@media(max-width:760px){.pd{grid-template-columns:1fr}.hero h1{font-size:1.8rem}.pd .btn,.cta2 .btn{display:block}}
"""

GA4 = '<script async src="https://www.googletagmanager.com/gtag/js?id={gid}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag("js",new Date());gtag("config","{gid}");</script>'
PIXEL = "<script>!function(f,b,e,v,n,t,s){{if(f.fbq)return;n=f.fbq=function(){{n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)}};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','{pid}');fbq('track','PageView');{extra}</script>"
UTM_JS = "<script>try{const p=new URLSearchParams(location.search);if(p.get('utm_source')){localStorage.setItem('utm',JSON.stringify(Object.fromEntries(p)))}}catch(e){}</script>"
FAVICON = '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 rx=%2212%22 fill=%22%231f3a5f%22/%3E%3Ctext x=%2232%22 y=%2246%22 font-size=%2238%22 text-anchor=%22middle%22 fill=%22%23f2c14e%22 font-family=%22Georgia,serif%22 font-weight=%22bold%22%3E%24%3C/text%3E%3C/svg%3E">'

def support_contact_html():
    """Support email once set; graceful, honest fallback while it isn't."""
    email = CONFIG["support_email"]
    if email and "PLACEHOLDER" not in email:
        return f'Questions? {email}'
    return 'Questions? See the <a href="policies.html#contact">contact page</a>.'

def contact_section_html():
    email = CONFIG["support_email"]
    if email and "PLACEHOLDER" not in email:
        return f"Email: {email} — a real human answers, usually within a few hours."
    return ("Our support inbox opens together with checkout (any day now) and will be posted right here. "
            "Until checkout is live nothing can be ordered on this site, so no customer is ever waiting on an answer. "
            "Bought one of our tools on Etsy or Gumroad? Message us there — same humans, fast replies.")

def page(title, body, desc="", path="", img="", purchase=False, noindex=False):
    ga = GA4.format(gid=CONFIG["ga4_id"]) if CONFIG["ga4_id"] else ""
    px = PIXEL.format(pid=CONFIG["meta_pixel_id"], extra="fbq('track','Purchase');" if purchase else "") if CONFIG["meta_pixel_id"] else ""
    og = f'\n<meta property="og:title" content="{html.escape(title)}"><meta property="og:description" content="{html.escape(desc)}"><meta property="og:type" content="website">'
    if noindex:
        og += '<meta name="robots" content="noindex,nofollow">'
    if CONFIG["base_url"]:
        og += f'<meta property="og:url" content="{CONFIG["base_url"]}/{path}">'
        if img:
            og += f'<meta property="og:image" content="{CONFIG["base_url"]}/{img}"><meta name="twitter:card" content="summary_large_image">'
    return f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">{og}
<link rel="stylesheet" href="style.css">{FAVICON}{ga}{px}{UTM_JS}</head><body>
<header><a class="brand" href="index.html">{CONFIG['brand']}</a>
<nav><a href="index.html">Shop</a><a href="money-reset-bundle.html">Bundle</a><a href="policies.html">Policies</a><a href="policies.html#contact">Contact</a></nav></header>
{body}
<footer>© 2026 {CONFIG['brand']} · <a href="policies.html">Refunds & Policies</a> · <a href="policies.html#privacy">Privacy</a> · <a href="policies.html#terms">Terms</a><br>
Digital products deliver instantly. {support_contact_html()}</footer>
</body></html>"""

def product_card(p):
    compare = f"<span class='compare'>{p['compare_at']}</span>" if p.get("compare_at") else ""
    badge = "<span class='badge'>BEST VALUE</span>" if p.get("featured") else ""
    return f"""<div class="card"><a href="{p['slug']}.html"><img src="{p['img']}" alt="{html.escape(p['name'])} — preview of what's inside"></a>
<div class="body">{badge}<h3>{html.escape(p['name'])}</h3><p class="sans" style="color:var(--gray);font-size:.95rem">{html.escape(p['headline'])}</p>
<div class="price">{p['price']}{compare}</div>
<a class="btn" href="{p['slug']}.html">See inside →</a></div></div>"""

def checkout_live(p):
    link = p.get("payment_link") or ""
    return bool(link) and link != "#" and "PLACEHOLDER" not in link

def buy_button(p, label):
    """Real buy link when the Stripe Payment Link is wired; honest 'coming' state until then
    (never a dead '#' link that silently jumps to the top of the page)."""
    if checkout_live(p):
        return f'<a class="btn gold" href="{p["payment_link"]}" data-slug="{p["slug"]}">{label}</a>'
    return f'<span class="btn soon" data-slug="{p["slug"]}" aria-disabled="true" title="Checkout is being wired up — nothing is charged today">Checkout opens this week</span>'

def pay_provider(p):
    link = p.get("payment_link") or ""
    return "Gumroad" if "gumroad.com" in link else "Stripe"

def buy_trust(p):
    if checkout_live(p):
        return f'<p class="trust">Secure checkout by {pay_provider(p)} · Instant delivery · No subscription · No account needed</p>'
    return '<p class="trust">Payments are being switched on — no orders are taken until checkout is live. Check back shortly.</p>'

def product_page(p):
    compare = f"<span class='compare'>{p['compare_at']}</span>" if p.get("compare_at") else ""
    bullets = "".join(f"<li>{html.escape(b)}</li>" for b in p["bullets"])
    faqs = "".join(f"<details><summary>{html.escape(q)}</summary><p>{html.escape(a)}</p></details>" for q, a in p["faq"])
    upsell = ""
    if p.get("in_bundle"):
        upsell = """<p class="upsell">Want all three tools? <a href="money-reset-bundle.html"><b>Get the Money Reset Bundle — $29.99</b></a> (save 30% vs separately).</p>"""
    body = f"""<div class="wrap"><div class="pd">
<div><img src="{p['img']}" alt="{html.escape(p['name'])} — preview of what's inside"></div>
<div><h1>{html.escape(p['name'])}</h1>
<p class="sub">{html.escape(p['headline'])} {html.escape(p['sub'])}</p>
<div class="price" style="font-size:1.5rem">{p['price']}{compare}</div>
<ul>{bullets}</ul>
{buy_button(p, "Buy now — instant download")}
{buy_trust(p)}
<div class="guarantee"><b>Our guarantee:</b> {html.escape(GUARANTEE)}</div>{upsell}
</div></div>
<div class="faq wrap"><h2>Questions, answered</h2>{faqs}</div>
<div class="wrap cta2">{buy_button(p, f"Buy now — instant download · {p['price']}")}
<p class="trust">Covered by the no-questions guarantee above.</p></div>"""
    desc = f"{p['headline']} {p['sub']}"
    desc = desc if len(desc) <= 158 else desc[:155].rsplit(" ", 1)[0] + "…"
    return page(f"{p['name']} — {CONFIG['brand']}", body, desc, path=f"{p['slug']}.html", img=p["img"])

def build():
    os.makedirs(os.path.join(SITE, "img"), exist_ok=True)
    with open(os.path.join(SITE, "style.css"), "w") as f: f.write(CSS)
    cards = "".join(product_card(p) for p in PRODUCTS)
    home = f"""<div class="wrap"><div class="hero"><h1>Budget the way you actually get paid.</h1>
<p>Zero-based money tools built around your paycheck — budget one check at a time, see your debt-free date, give every savings goal a plan. Instant download, works in free Google Sheets, and every purchase is covered by a no-questions guarantee.</p>
<p style="margin-top:24px"><a class="btn gold" href="money-reset-bundle.html">Get all 3 tools — Money Reset Bundle, $29.99</a></p></div>
<div class="grid">{cards}</div></div>"""
    with open(os.path.join(SITE, "index.html"), "w") as f:
        f.write(page(f"{CONFIG['brand']} — budget, debt & savings spreadsheets", home, CONFIG["tagline"], path="index.html", img="img/bundle.png"))
    for p in PRODUCTS:
        with open(os.path.join(SITE, f"{p['slug']}.html"), "w") as f:
            f.write(product_page(p))
    policies = f"""<div class="wrap policy">
<h1>Policies</h1>
<h2 id="refunds">Refunds (digital products)</h2>
<p>Because files can't be returned, all sales are technically final — but if the file doesn't work, doesn't match the description, or you bought a duplicate by accident, we'll refund you, full stop. If you're unhappy for any other reason, contact us; we're reasonable humans and we'd rather fix it than argue.</p>
<h2 id="delivery">Delivery</h2>
<p>Digital products deliver instantly: a download link appears on the confirmation page and is emailed to you right after checkout. Lost the link? Email us any time — forever.</p>
<h2 id="terms">Terms</h2>
<p>Products are for personal use (or single-business use for business templates). Please don't resell or redistribute the files. Calculators and planners are organizational tools, not financial advice. The charge on your card statement carries the name shown at checkout — Gumroad (our checkout provider) for card purchases, or {CONFIG['statement_descriptor']} for purchases made via our Stripe links.</p>
<h2 id="privacy">Privacy</h2>
<p>We collect only what checkout requires (handled by Stripe) and your email for delivery. No data sales, no spam — you'll only hear from us about your order unless you opt in to more.</p>
<h2 id="contact">Contact</h2>
<p>{contact_section_html()}</p>
</div>"""
    with open(os.path.join(SITE, "policies.html"), "w") as f:
        f.write(page(f"Policies — {CONFIG['brand']}", policies, "Refunds, delivery, terms and privacy for our digital products.", path="policies.html"))
    success = f"""<div class="wrap policy"><h1>Thank you! 🎉</h1>
<p>Your order is confirmed. Your download link is on its way to your inbox right now (check spam/promotions the first time).</p>
<p>If it isn't there within 10 minutes, {"email " + CONFIG["support_email"] if CONFIG["support_email"] and "PLACEHOLDER" not in CONFIG["support_email"] else "reply to your order receipt email"} and a human will send it personally.</p>
<p><a class="btn" href="index.html">Back to the shop</a></p></div>"""
    with open(os.path.join(SITE, "success.html"), "w") as f:
        f.write(page(f"Order confirmed — {CONFIG['brand']}", success, "Your order is confirmed — download link on the way.", path="success.html", purchase=True))
    # Per-product delivery: tokenized thank-you page + files under site/dl/<token>/.
    # Stripe Payment Links redirect here after payment (BROWSER-TASKS TASK-002S).
    for p in PRODUCTS:
        if not p.get("dl_token") or not p.get("files"):
            continue
        dl_dir = os.path.join(SITE, "dl", p["dl_token"])
        os.makedirs(dl_dir, exist_ok=True)
        buttons = []
        for rel in p["files"]:
            src = os.path.join(PQ, rel)
            fname = os.path.basename(rel)
            shutil.copyfile(src, os.path.join(dl_dir, fname))
            size_kb = max(1, os.path.getsize(src) // 1024)
            buttons.append(f'<p><a class="btn gold" href="dl/{p["dl_token"]}/{fname}" download>Download {html.escape(fname)}</a> <span class="trust">({size_kb} KB)</span></p>')
        bump = ""
        if p["slug"] != "savings-challenge-pack":
            pack = next((x for x in PRODUCTS if x["slug"] == "savings-challenge-pack"), None)
            if pack and pack.get("dl_token"):
                bump = f'<p class="upsell">Added the <b>Savings Challenge Printable Pack</b> at checkout? <a href="ty-{pack["dl_token"]}.html">Download it here →</a></p>'
        ty = f"""<div class="wrap policy"><h1>Thank you! 🎉 Your {html.escape(p['name'])} is ready.</h1>
<p><b>Download your file{'s' if len(p['files']) > 1 else ''} below right now</b> — no account needed. Bookmark this page; your download link never expires, and a backup copy is emailed to you.</p>
{''.join(buttons)}{bump}
<p>Spreadsheets work in free Google Sheets (upload at sheets.google.com → blank sheet → File → Import) and in Excel. The Start-Here tab walks you through setup.</p>
<div class="guarantee"><b>Our guarantee:</b> {html.escape(GUARANTEE)}</div>
<p class="trust">Heads up: the charge on your card statement appears under {html.escape(CONFIG['statement_descriptor'])}.</p>
<p class="trust">Problem with a file? {support_contact_html()} Lost this page? Reply to your Stripe receipt email and a human resends everything.</p>
<p><a href="index.html">Back to the shop →</a></p></div>"""
        with open(os.path.join(SITE, f"ty-{p['dl_token']}.html"), "w") as f:
            f.write(page(f"Your download — {CONFIG['brand']}", ty, "Order confirmed — your files are ready to download.", path=f"ty-{p['dl_token']}.html", purchase=True, noindex=True))
    with open(os.path.join(SITE, "robots.txt"), "w") as f:
        f.write("User-agent: *\nDisallow: /dl/\nDisallow: /ty-\n")
    print("built", SITE)

if __name__ == "__main__":
    build()
