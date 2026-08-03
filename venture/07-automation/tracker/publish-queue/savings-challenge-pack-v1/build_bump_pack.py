#!/usr/bin/env python3
"""Savings Challenge Printable Pack — 16 print-ready US-letter pages (300dpi) + cover.

v2 (2026-08-03, per product-experience-review.md P2-2): expanded from 4 pages to 16.
The original 4 pages are unchanged; 12 new pages are added in the same visual
style (cream page, accent header band, rounded boxes, printer-friendly / B&W-safe).
Outputs one PDF per page (print just what you need) plus a combined 16-page PDF.

Every stated total is computed and asserted in Python below — if any chart's
arithmetic drifted, this script refuses to build. A source scan also refuses to
build if savings-promise language ("guarantee", "you'll save", ...) appears in
any rendered string.
"""
from PIL import Image, ImageDraw, ImageFont
import os

OUT = "/home/user/fb-marketplace-autoresponder/venture/07-automation/tracker/publish-queue/savings-challenge-pack-v1"
os.makedirs(OUT, exist_ok=True)
W, H = 2550, 3300  # US letter @300dpi
M = 190  # margins ~0.63"
NAVY=(31,58,95); TEAL=(46,125,107); GOLD=(242,193,78); CREAM=(252,251,247); DARK=(40,44,52); GRAY=(120,125,133); LINE=(205,208,214); RUST=(179,86,58)
FB="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"; FR="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
def F(p,s): return ImageFont.truetype(p,s)

# ------------------------------------------------------------------ verified math
T52 = sum(range(1, 53));            assert T52 == 1378   # 52-week (and its reverse)
T52R = sum(range(52, 0, -1));       assert T52R == 1378
BIWEEKLY_AMTS = [6*(i+1) for i in range(26)]
TBI = sum(BIWEEKLY_AMTS);           assert TBI == 2106   # biweekly $6 ladder
T1K = 25*40;                        assert T1K == 1000   # emergency fund
T500 = 25*20;                       assert T500 == 500   # starter fund
T5K = 50*100;                       assert T5K == 5000   # $5,000 challenge
assert (10*100, 25*100, 40*100) == (1000, 2500, 4000)    # $5k milestone captions
T260 = 52*5;                        assert T260 == 260   # easy-start
TKIDS = sum(range(1, 11));          assert TKIDS == 55   # kids ladder
TTEENS = sum(range(1, 21));         assert TTEENS == 210 # teens ladder
THOL = 20*25;                       assert THOL == 500   # holiday chart
assert 20*5 == 100                                        # vacation: 20 boxes x 5% = 100%

# every rendered string passes through T()/page()/grid_boxes() and lands here,
# then gets scanned for promise language before anything is saved
TEXTS = []
BANNED_PHRASES = [x + y for x, y in (("guarant", "ee"), ("you'll ", "save"), ("you will ", "save"),
                                     ("promis", "e"), ("get rich", ""), ("financial free", "dom"))]

def T(d, xy, s, font, fill):
    TEXTS.append(s)
    d.text(xy, s, font=font, fill=fill)

def page(title, subtitle, accent, title_fill=(255,255,255)):
    img = Image.new("RGB",(W,H),CREAM); d = ImageDraw.Draw(img)
    d.rectangle([0,0,W,240], fill=accent)
    assert d.textlength(title, font=F(FB,96)) <= W-2*M, f"title too wide: {title!r}"
    assert d.textlength(subtitle, font=F(FR,52)) <= W-2*M+60, f"subtitle too wide: {subtitle!r}"
    T(d, (M,70), title, F(FB,96), title_fill)
    T(d, (M,300), subtitle, F(FR,52), GRAY)
    T(d, (M,H-120), "Print on US Letter or A4  •  Personal use", F(FR,40), GRAY)
    return img, d

def grid_boxes(d, x0, y0, cols, rows, cw, ch, labels, label_font, sub=None):
    i = 0
    for r in range(rows):
        for c in range(cols):
            if i >= len(labels): return
            x, y = x0 + c*cw, y0 + r*ch
            d.rounded_rectangle([x, y, x+cw-40, y+ch-40], radius=18, outline=LINE, width=4, fill=(255,255,255))
            T(d, (x+30, y+25), labels[i], label_font, DARK)
            if sub: T(d, (x+30, y+ch-115), sub[i], F(FR,38), GRAY)
            # checkbox
            d.rectangle([x+cw-130, y+30, x+cw-70, y+90], outline=TEAL, width=5)
            i += 1

def write_line(d, x0, x1, y):
    d.line([x0, y, x1, y], fill=LINE, width=4)

PAGES = []  # (file-stem, image) in pack order

# ===================================================================== page 1: index
img, d = page("PICK YOUR CHALLENGE", "16 print-ready pages — every total checked to the dollar.", NAVY)
sections = [
    ("THE CLASSICS", [
        ("52-Week Challenge", f"$1 up to $52, one week at a time — total ${T52:,}"),
        ("52-Week Reverse", f"same chart, biggest deposits first — total ${T52R:,}"),
        ("Easy-Start $5 a Week", f"one gentle number all year — total ${T260}"),
        ("Biweekly Challenge", f"26 paydays, $6 more each time — total ${TBI:,}"),
    ]),
    ("EMERGENCY FUNDS", [
        ("$500 Starter Fund", "25 boxes of $20"),
        ("$1,000 Emergency Fund", "25 boxes of $40"),
        ("$5,000 Challenge", "50 boxes of $100"),
    ]),
    ("NO-SPEND", [
        ("No-Spend Month", "31 daily boxes plus your own rules"),
        ("No-Spend Calendar", "any month — a weekday grid you date yourself"),
        ("No-Spend Year Tracker", "12 months at a glance"),
    ]),
    ("LIFE & GOALS", [
        ("Kids & Teens Challenge", f"${TKIDS} in 10 weeks / ${TTEENS} in 20 weeks"),
        ("Holiday Savings", f"20 weeks of $25 = ${THOL} by late November"),
        ("Vacation Fund Tracker", "any goal — each box is 5% of it"),
        ("Round-Up Savings Log", "bank the spare change from every purchase"),
        ("Savings Thermometer", "any goal — color as you climb"),
    ]),
]
y = 470
for header, items in sections:
    T(d, (M, y), header, F(FB,54), TEAL); y += 100
    for name, desc in items:
        d.rectangle([M, y+14, M+28, y+42], fill=GOLD)
        T(d, (M+60, y), name, F(FB,46), DARK)
        T(d, (M+60+d.textlength(name, font=F(FB,46))+20, y+4), "—  "+desc, F(FR,42), GRAY)
        y += 92
    y += 36
T(d, (M, y+20), "Print only the pages you need — or the whole pack.", F(FR,44), GRAY)
PAGES.append(("Pick-Your-Challenge-Index", img))

# ===================================================================== page 2: 52-week (UNCHANGED from v1)
img, d = page("52-WEEK SAVINGS CHALLENGE", f"Save the week number each week — $1 in week 1, $52 in week 52. Total: ${T52:,}.", NAVY)
labels = [f"Wk {i+1}" for i in range(52)]
subs = [f"${i+1}" for i in range(52)]
grid_boxes(d, M, 460, 4, 13, (W-2*M)//4 + 10, 200, labels, F(FB,44), subs)
T(d, (M, 3130), "Flip it: start at week 52 ($52) while motivation is highest.", F(FR,40), GRAY)
PAGES.append(("52-Week-Challenge", img))

# ===================================================================== page 3: 52-week reverse (NEW)
img, d = page("52-WEEK REVERSE CHALLENGE", f"Same chart, flipped — $52 in week 1 down to $1 in week 52. Total: ${T52R:,}.", NAVY)
rev = list(range(52, 0, -1))
labels = [f"Wk {i+1}" for i in range(52)]
subs = [f"${a}" for a in rev]
grid_boxes(d, M, 460, 4, 13, (W-2*M)//4 + 10, 200, labels, F(FB,44), subs)
T(d, (M, 3130), "December money is tight money — here the big weeks are already banked.", F(FR,40), GRAY)
PAGES.append(("52-Week-Reverse-Challenge", img))

# ===================================================================== page 4: easy-start $260 (NEW)
img, d = page("EASY-START CHALLENGE", f"The habit beats the number: $5 a week, every week, for a year. Total: ${T260}.", TEAL)
labels = [f"Wk {i+1}" for i in range(52)]
subs = ["$5"] * 52
grid_boxes(d, M, 460, 4, 13, (W-2*M)//4 + 10, 200, labels, F(FB,44), subs)
T(d, (M, 3130), "Every box is the same — no scary weeks. Double any box on a good week.", F(FR,40), GRAY)
PAGES.append(("Easy-Start-5-Dollar-Challenge", img))

# ===================================================================== page 5: biweekly (UNCHANGED from v1)
img, d = page("BIWEEKLY SAVINGS CHALLENGE", f"Paid every two weeks? 26 deposits, $6 more each time. Total: ${TBI:,}.", TEAL)
labels = [f"#{i+1}" for i in range(26)]
subs = [f"${a}" for a in BIWEEKLY_AMTS]
grid_boxes(d, M, 500, 4, 7, (W-2*M)//4 + 10, 330, labels, F(FB,48), subs)
T(d, (M, 3000), f"Every deposit is $6 more than the last. Grand total: ${TBI:,}.", F(FR,44), GRAY)
PAGES.append(("Biweekly-Challenge", img))

# ===================================================================== page 6: $500 starter fund (NEW)
img, d = page("$500 STARTER FUND", f"25 deposits of $20 — a first cushion against surprise bills.", RUST)
labels = ["$20"]*25
grid_boxes(d, M, 500, 5, 5, (W-2*M)//5 + 10, 430, labels, F(FB,64))
T(d, (M, 2900), "Finished? Graduate to the $1,000 chart — same habit, bigger boxes.", F(FR,44), GRAY)
PAGES.append(("500-Starter-Fund", img))

# ===================================================================== page 7: $1,000 emergency fund (UNCHANGED from v1)
img, d = page("$1,000 EMERGENCY FUND", "25 deposits of $40. Color a box every time you put $40 away.", RUST)
labels = ["$40"]*25
grid_boxes(d, M, 500, 5, 5, (W-2*M)//5 + 10, 430, labels, F(FB,64))
T(d, (M, 2900), "Done in 25 paydays — or double up and finish in 13.", F(FR,44), GRAY)
PAGES.append(("1000-Emergency-Fund", img))

# ===================================================================== page 8: $5,000 challenge (NEW)
img, d = page("$5,000 CHALLENGE", f"50 deposits of $100, weekly or at your own pace. Total: ${T5K:,}.", NAVY)
labels = ["$100"]*50
grid_boxes(d, M, 480, 5, 10, (W-2*M)//5 + 10, 250, labels, F(FB,54))
T(d, (M, 3040), "Milestones: box 10 = $1,000  ·  box 25 = $2,500  ·  box 40 = $4,000.", F(FR,44), GRAY)
PAGES.append(("5000-Challenge", img))

# ===================================================================== page 9: no-spend month (UNCHANGED from v1)
img, d = page("NO-SPEND MONTH", "One box per day. Color it in if you spent $0 beyond planned essentials.", GOLD)
labels = [str(i+1) for i in range(31)]
grid_boxes(d, M, 500, 7, 5, (W-2*M)//7 + 8, 380, labels, F(FB,60))
T(d, (M, 2650), "Rules you set (write them here):", F(FB,48), DARK)
for i in range(3):
    y = 2760 + i*130
    write_line(d, M, W-M, y)
PAGES.append(("No-Spend-Month", img))

# ===================================================================== page 10: no-spend calendar, any month (NEW)
img, d = page("NO-SPEND CALENDAR", "Write in the dates, then color each day you spent $0 beyond essentials.", GOLD, title_fill=NAVY)
T(d, (M, 450), "Month:", F(FB,44), DARK); write_line(d, M+180, M+740, 500)
T(d, (M+840, 450), "Goal (days):", F(FB,44), DARK); write_line(d, M+1140, M+1460, 500)
T(d, (M+1560, 450), "Reward:", F(FB,44), DARK); write_line(d, M+1770, W-M, 500)
cw = (W-2*M)//7
for i, day in enumerate(("SUN","MON","TUE","WED","THU","FRI","SAT")):
    x = M + i*cw
    T(d, (x + (cw-40-d.textlength(day, font=F(FB,44)))//2, 590), day, F(FB,44), DARK)
y0, ch = 670, 330
for r in range(6):
    for c in range(7):
        x, y = M + c*cw, y0 + r*ch
        d.rounded_rectangle([x, y, x+cw-30, y+ch-40], radius=18, outline=LINE, width=4, fill=(255,255,255))
        write_line(d, x+25, x+100, y+75)   # corner slot to write the date
T(d, (M, y0 + 6*ch + 20), "Weeks start Sunday — cross out the boxes before the 1st and after the last day.", F(FR,40), GRAY)
PAGES.append(("No-Spend-Calendar", img))

# ===================================================================== page 11: no-spend year tracker (NEW)
img, d = page("NO-SPEND YEAR TRACKER", "One box per month: tally your no-spend days and watch the year add up.", GOLD, title_fill=NAVY)
MONTHS = ("JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
          "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER")
cw, ch = (W-2*M)//3, 520
for i, mo in enumerate(MONTHS):
    x, y = M + (i%3)*cw, 480 + (i//3)*ch
    d.rounded_rectangle([x, y, x+cw-40, y+ch-40], radius=18, outline=LINE, width=4, fill=(255,255,255))
    T(d, (x+35, y+30), mo, F(FB,54), DARK)
    T(d, (x+35, y+ch-190), "no-spend days:", F(FR,40), GRAY)
    write_line(d, x+400, x+cw-90, y+ch-140)
yb = 480 + 4*ch + 30
T(d, (M, yb), "Year total:", F(FB,48), DARK); write_line(d, M+290, M+700, yb+52)
T(d, (M+840, yb), "Best month:", F(FB,48), DARK); write_line(d, M+1180, M+1700, yb+52)
PAGES.append(("No-Spend-Year-Tracker", img))

# ===================================================================== page 12: kids & teens (NEW)
img, d = page("KIDS & TEENS CHALLENGE", "Save the week number in dollars — pocket-money sized, big-kid proud.", TEAL)
T(d, (M, 450), f"KIDS — 10 weeks, $1 to $10, total ${TKIDS}", F(FB,56), DARK)
labels = [f"Wk {i+1}" for i in range(10)]
subs = [f"${i+1}" for i in range(10)]
grid_boxes(d, M, 560, 5, 2, (W-2*M)//5 + 10, 250, labels, F(FB,44), subs)
T(d, (M, 1180), f"TEENS — 20 weeks, $1 to $20, total ${TTEENS}", F(FB,56), DARK)
labels = [f"Wk {i+1}" for i in range(20)]
subs = [f"${i+1}" for i in range(20)]
grid_boxes(d, M, 1290, 5, 4, (W-2*M)//5 + 10, 250, labels, F(FB,44), subs)
T(d, (M, 2440), "House rules (who matches what, what counts — write yours):", F(FB,48), DARK)
write_line(d, M, W-M, 2570); write_line(d, M, W-M, 2700); write_line(d, M, W-M, 2830)
PAGES.append(("Kids-Teens-Challenge", img))

# ===================================================================== page 13: holiday savings (NEW)
img, d = page("HOLIDAY SAVINGS", f"20 weekly deposits of $25 = ${THOL} before the holiday spending starts.", RUST)
labels = ["$25"]*20
subs = ["week of  _______"]*20
grid_boxes(d, M, 480, 4, 5, (W-2*M)//4 + 10, 400, labels, F(FB,60), subs)
T(d, (M, 2560), "Start the week after July 4th and the last box lands just before Thanksgiving.", F(FB,44), DARK)
T(d, (M, 2660), "Starting later? Double up boxes until you catch up — the chart still totals $500.", F(FR,44), GRAY)
PAGES.append(("Holiday-Savings-Tracker", img))

# ===================================================================== page 14: vacation fund (NEW)
img, d = page("VACATION FUND TRACKER", "Each box is 5% of your trip goal. Color one every time you bank it.", TEAL)
T(d, (M, 450), "Trip:", F(FB,44), DARK); write_line(d, M+140, M+900, 500)
T(d, (M+1000, 450), "Goal: $", F(FB,44), DARK); write_line(d, M+1190, M+1560, 500)
T(d, (M+1660, 450), "1 box = goal ÷ 20: $", F(FB,44), DARK); write_line(d, M+2190, W-M+30, 500)
labels = [f"{(i+1)*5}%" for i in range(20)]
grid_boxes(d, M, 570, 5, 4, (W-2*M)//5 + 10, 300, labels, F(FB,54))
T(d, (M, 1810), "One full row = 25% of the trip. Last box = wheels up.", F(FR,44), GRAY)
T(d, (M, 1960), "Deposit log (date · amount):", F(FB,48), DARK)
for i in range(6):
    write_line(d, M, W-M, 2090 + i*130)
PAGES.append(("Vacation-Fund-Tracker", img))

# ===================================================================== page 15: round-up log (NEW)
img, d = page("ROUND-UP SAVINGS LOG", "Round each purchase up to the next dollar — bank the difference here.", NAVY)
T(d, (M, 440), "Example: $4.35 coffee  →  call it $5.00  →  $0.65 moves to savings.", F(FR,44), GRAY)
cols = [(M, "Date"), (M+340, "What you bought"), (M+1180, "Price"), (M+1560, "Rounded to"), (M+1990, "Saved")]
y0, rh, nrows = 560, 95, 24
d.rectangle([M, y0, W-M, y0+90], fill=NAVY)
for x, name in cols:
    T(d, (x+25, y0+22), name, F(FB,40), (255,255,255))
for i in range(nrows+1):
    write_line(d, M, W-M, y0+90+i*rh)
for x, _ in cols[1:]:
    d.line([x, y0, x, y0+90+nrows*rh], fill=LINE, width=4)
yb = y0 + 90 + nrows*rh + 60
T(d, (M, yb), "Total saved this page: $", F(FB,48), DARK); write_line(d, M+660, M+1160, yb+52)
T(d, (M+1300, yb+6), "Move it to savings once a week.", F(FR,44), GRAY)
PAGES.append(("Round-Up-Savings-Log", img))

# ===================================================================== page 16: savings thermometer (NEW)
img, d = page("SAVINGS THERMOMETER", "Write the goal, mark each line at goal ÷ 10, color as you climb.", RUST)
T(d, (M, 450), "Saving for:", F(FB,44), DARK); write_line(d, M+300, M+1100, 500)
T(d, (M+1250, 450), "Goal: $", F(FB,44), DARK); write_line(d, M+1440, M+1900, 500)
cx, top, bottom = W//2, 640, 2760
d.rounded_rectangle([cx-130, top-40, cx+130, bottom], radius=90, outline=DARK, width=8, fill=(255,255,255))
d.ellipse([cx-170, bottom-60, cx+170, bottom+280], outline=DARK, width=8, fill=(255,255,255))
step = (bottom - top) // 10
for i in range(1, 11):
    y = bottom - i*step
    d.line([cx-130, y, cx+130, y], fill=LINE, width=5)
    pct = f"{i*10}%"
    T(d, (cx-220-d.textlength(pct, font=F(FB,44)), y-26), pct, F(FB,44), DARK)
    write_line(d, cx+220, cx+640, y+26)
    T(d, (cx+220, y-64), "$", F(FR,38), GRAY)
PAGES.append(("Savings-Thermometer", img))

# ============================================================== promise-language gate
lower_texts = [s.lower() for s in TEXTS]
for phrase in BANNED_PHRASES:
    hits = [s for s in lower_texts if phrase in s]
    assert not hits, f"promise language {phrase!r} found in: {hits[:3]}"

# ============================================================== save: 16 singles + combined
assert len(PAGES) == 16, f"pack must be 16 pages, got {len(PAGES)}"
for name, im in PAGES:
    im.save(f"{OUT}/{name}.pdf", "PDF", resolution=300.0)
PAGES[0][1].save(f"{OUT}/Savings-Challenge-Pack-All-16-Pages.pdf", "PDF", resolution=300.0,
                 save_all=True, append_images=[im for _, im in PAGES[1:]])

# cover image for listing/bump
cv = Image.new("RGB",(2700,2025),(31,58,95)); d = ImageDraw.Draw(cv)
d.text((350,180), "SAVINGS CHALLENGE", font=F(FB,150), fill=(255,255,255))
d.text((350,360), "PRINTABLE PACK", font=F(FB,150), fill=(242,193,78))
items = [f"52-Week & Reverse  —  ${T52:,} each",
         f"Biweekly ${TBI:,}  ·  Easy-Start ${T260}",
         "$500 / $1,000 / $5,000 fund charts",
         "No-spend, kids & teens, holiday + more"]
y=700
for t in items:
    d.rounded_rectangle([350,y,2350,y+220], radius=30, fill=(255,255,255))
    d.text((450,y+60), t, font=F(FB,80), fill=(31,58,95))
    y+=270
d.text((350,1870), "16 print-ready pages  •  US Letter + A4 friendly  •  Instant download", font=F(FB,58), fill=(242,193,78))
cv.save(f"{OUT}/01-cover.png", optimize=True)

print(f"pack built: 16 pages — totals verified: 52wk ${T52:,} · reverse ${T52R:,} · "
      f"biweekly ${TBI:,} · $500/$1,000/$5,000 funds · easy-start ${T260} · "
      f"kids ${TKIDS} / teens ${TTEENS} · holiday ${THOL}")
print("files:", sorted(n for n in os.listdir(OUT) if n.endswith(('.pdf', '.png'))))
