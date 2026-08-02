#!/usr/bin/env python3
"""Savings Challenge Printable Pack — 4 print-ready US-letter PDFs (300dpi) + cover."""
from PIL import Image, ImageDraw, ImageFont
import os

OUT = "/home/user/fb-marketplace-autoresponder/venture/07-automation/tracker/publish-queue/savings-challenge-pack-v1"
os.makedirs(OUT, exist_ok=True)
W, H = 2550, 3300  # US letter @300dpi
M = 190  # margins ~0.63"
NAVY=(31,58,95); TEAL=(46,125,107); GOLD=(242,193,78); CREAM=(252,251,247); DARK=(40,44,52); GRAY=(120,125,133); LINE=(205,208,214)
FB="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"; FR="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
def F(p,s): return ImageFont.truetype(p,s)

def page(title, subtitle, accent):
    img = Image.new("RGB",(W,H),CREAM); d = ImageDraw.Draw(img)
    d.rectangle([0,0,W,240], fill=accent)
    d.text((M,70), title, font=F(FB,96), fill=(255,255,255))
    d.text((M,300), subtitle, font=F(FR,52), fill=GRAY)
    d.text((M,H-120), "Print on US Letter or A4  •  Personal use", font=F(FR,40), fill=GRAY)
    return img, d

def grid_boxes(d, x0, y0, cols, rows, cw, ch, labels, label_font, sub=None):
    i = 0
    for r in range(rows):
        for c in range(cols):
            if i >= len(labels): return
            x, y = x0 + c*cw, y0 + r*ch
            d.rounded_rectangle([x, y, x+cw-40, y+ch-40], radius=18, outline=LINE, width=4, fill=(255,255,255))
            d.text((x+30, y+25), labels[i], font=label_font, fill=DARK)
            if sub: d.text((x+30, y+ch-115), sub[i], font=F(FR,38), fill=GRAY)
            # checkbox
            d.rectangle([x+cw-130, y+30, x+cw-70, y+90], outline=TEAL, width=5)
            i += 1

# --- 1. 52-Week Challenge ($1,378) ---
img, d = page("52-WEEK SAVINGS CHALLENGE", "Save the week number each week — $1 in week 1, $52 in week 52. Total: $1,378.", NAVY)
labels = [f"Wk {i+1}" for i in range(52)]
subs = [f"${i+1}" for i in range(52)]
grid_boxes(d, M, 460, 4, 13, (W-2*M)//4 + 10, 200, labels, F(FB,44), subs)
d.text((M, 3130), "Flip it: start at week 52 ($52) while motivation is highest.", font=F(FR,40), fill=GRAY)
img52 = img

# --- 2. Biweekly Challenge (26 deposits, $2,106 total: $6,$12,...,$156 arithmetic) ---
img, d = page("BIWEEKLY SAVINGS CHALLENGE", "Paid every two weeks? 26 deposits, $6 more each time. Total: $2,106.", TEAL)
amts = [6*(i+1) for i in range(26)]
labels = [f"#{i+1}" for i in range(26)]
subs = [f"${a}" for a in amts]
grid_boxes(d, M, 500, 4, 7, (W-2*M)//4 + 10, 330, labels, F(FB,48), subs)
d.text((M, 3000), f"Every deposit is $6 more than the last. Grand total: ${sum(amts):,}.", font=F(FR,44), fill=GRAY)
imgbw = img

# --- 3. $1,000 Emergency Fund (25 x $40) ---
img, d = page("$1,000 EMERGENCY FUND", "25 deposits of $40. Color a box every time you put $40 away.", (179,86,58))
labels = ["$40"]*25
grid_boxes(d, M, 500, 5, 5, (W-2*M)//5 + 10, 430, labels, F(FB,64))
d.text((M, 2900), "Done in 25 paydays — or double up and finish in 13.", font=F(FR,44), fill=GRAY)
img1k = img

# --- 4. No-Spend Month ---
img, d = page("NO-SPEND MONTH", "One box per day. Color it in if you spent $0 beyond planned essentials.", GOLD)
labels = [str(i+1) for i in range(31)]
grid_boxes(d, M, 500, 7, 5, (W-2*M)//7 + 8, 380, labels, F(FB,60))
d.text((M, 2650), "Rules you set (write them here):", font=F(FB,48), fill=DARK)
for i in range(3):
    y = 2760 + i*130
    d.line([M, y, W-M, y], fill=LINE, width=4)
imgns = img

# save as PDFs (300 dpi)
for name, im in [("52-Week-Challenge", img52), ("Biweekly-Challenge", imgbw), ("1000-Emergency-Fund", img1k), ("No-Spend-Month", imgns)]:
    im.save(f"{OUT}/{name}.pdf", "PDF", resolution=300.0)

# cover image for listing/bump
cv = Image.new("RGB",(2700,2025),(31,58,95)); d = ImageDraw.Draw(cv)
d.text((350,180), "SAVINGS CHALLENGE", font=F(FB,150), fill=(255,255,255))
d.text((350,360), "PRINTABLE PACK", font=F(FB,150), fill=(242,193,78))
items = ["52-Week Challenge  —  $1,378", "Biweekly Challenge  —  $2,106", "$1,000 Emergency Fund", "No-Spend Month Tracker"]
y=700
for t in items:
    d.rounded_rectangle([350,y,2350,y+220], radius=30, fill=(255,255,255))
    d.text((450,y+60), t, font=F(FB,80), fill=(31,58,95))
    y+=270
d.text((350,1870), "4 print-ready PDFs  •  US Letter + A4 friendly  •  Instant download", font=F(FB,58), fill=(242,193,78))
cv.save(f"{OUT}/01-cover.png", optimize=True)
print("pack built:", sorted(os.listdir(OUT)))
