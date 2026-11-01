#!/usr/bin/env python3
"""Turn organic/content-pack.md + chrome-posting-brief.md into one phone-friendly HTML page.

Usage: python3 -I build_phone_page.py <organic_dir> <out_dir> [pack_url]
Writes <out_dir>/index.html and copies graphics into <out_dir>/graphics/.
"""
import html, re, shutil, sys, datetime
from pathlib import Path

ORG = Path(sys.argv[1])
OUT = Path(sys.argv[2])
PACK_URL = sys.argv[3] if len(sys.argv) > 3 else "(this page's address)"
START = datetime.date(2026, 11, 2)  # Day 1 if Cody starts Mon 2 Nov

GFX = sorted(p.name for p in (ORG / "graphics").glob("*.png"))
(OUT / "graphics").mkdir(parents=True, exist_ok=True)
for g in GFX:
    shutil.copy2(ORG / "graphics" / g, OUT / "graphics" / g)

def esc(s):
    return html.escape(s, quote=True)

def slug(s):
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s[:48] or "s"

def inline(s):
    """Escape, then apply code spans, bold, italics, links."""
    parts = re.split(r"(`[^`]+`)", s)
    out = []
    for p in parts:
        if len(p) > 1 and p.startswith("`") and p.endswith("`"):
            c = p[1:-1]
            if c in GFX:
                out.append(f'<a class="gfx" href="graphics/{esc(c)}" target="_blank" rel="noopener"><code>{esc(c)}</code></a>')
            elif c.startswith("https://"):
                out.append(f'<button type="button" class="link" data-copy="{esc(c)}"><code>{esc(c)}</code><span class="lk">Copy</span></button>')
            else:
                out.append(f"<code>{esc(c)}</code>")
            continue
        t = esc(p)
        t = re.sub(r"\[([^\]]+)\]\((https?://[^)\s]+)\)", r'<a href="\2" target="_blank" rel="noopener">\1</a>', t)
        t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
        t = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<em>\1</em>", t)
        out.append(t)
    return "".join(out)

def table(rows):
    cells = [[c.strip() for c in r.strip().strip("|").split("|")] for r in rows]
    head, body = cells[0], [r for r in cells[2:]]
    h = "".join(f"<th>{inline(c)}</th>" for c in head)
    b = "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>" for r in body)
    return f'<div class="tw"><table><thead><tr>{h}</tr></thead><tbody>{b}</tbody></table></div>'

def render(md, skip_after=None):
    lines = md.split("\n")
    out, i, n = [], 0, len(lines)
    para, lst, ltype, lstart = [], [], None, 1
    def flush():
        nonlocal para, lst, ltype, lstart
        if para:
            out.append(f"<p>{inline(' '.join(para))}</p>")
            para = []
        if lst:
            tag = "ol" if ltype == "ol" else "ul"
            st = f' start="{lstart}"' if tag == "ol" and lstart != 1 else ""
            out.append(f"<{tag}{st}>" + "".join(f"<li>{inline(x)}</li>" for x in lst) + f"</{tag}>")
            lst, ltype = [], None
    while i < n:
        ln = lines[i]
        if skip_after and ln.strip() == skip_after:
            break
        if ln.startswith("```"):
            flush()
            j = i + 1
            buf = []
            while j < n and not lines[j].startswith("```"):
                buf.append(lines[j]); j += 1
            text = "\n".join(buf)
            out.append(f'<div class="box"><pre>{esc(text)}</pre><button type="button" class="cp" data-copy="{esc(text)}">Copy</button></div>')
            i = j + 1
            continue
        m = re.match(r"^(#{1,4})\s+(.*)$", ln)
        if m:
            flush()
            out.append(("H", len(m.group(1)), m.group(2)))
            i += 1
            continue
        if ln.startswith("|"):
            flush()
            rows = []
            while i < n and lines[i].startswith("|"):
                rows.append(lines[i]); i += 1
            out.append(table(rows))
            continue
        if ln.strip() == "---":
            flush(); i += 1; continue
        m = re.match(r"^\s*(?:- |(\d+)\. )(.*)$", ln)
        if m:
            if para:
                flush()
            t = "ol" if m.group(1) else "ul"
            if lst and ltype != t:
                flush()
            if not lst:
                lstart = int(m.group(1)) if m.group(1) else 1
            ltype = t
            lst.append(m.group(2))
            i += 1
            continue
        if not ln.strip():
            flush(); i += 1; continue
        if lst:  # continuation of a list item
            lst[-1] += " " + ln.strip(); i += 1; continue
        para.append(ln.strip())
        i += 1
    flush()
    return out

pack = (ORG / "content-pack.md").read_text()
brief_md = (ORG / "chrome-posting-brief.md").read_text()
brief_txt = re.search(r"```text\n(.*?)\n```", brief_md, re.S).group(1).replace("{{PACK_URL}}", PACK_URL)

blocks = render(pack, skip_after="## How this pack was checked")

# Assemble: H1 dropped (the page has its own hero), H2 = sections, H3 "Day N" = collapsible day cards.
body, nav = [], []
open_day = False
in_section = False
def close_day():
    global open_day
    if open_day:
        body.append("</div></details>")
        open_day = False
for b in blocks:
    if isinstance(b, tuple):
        _, lvl, txt = b
        if lvl == 1:
            continue
        if lvl == 2:
            close_day()
            if in_section:
                body.append("</section>")
            sid = "s-" + slug(txt)
            short = re.sub(r"^\d+\.\s*", "", txt).split(":")[0]
            nav.append((sid, short))
            body.append(f'<section class="sec" id="{sid}"><h2>{inline(txt)}</h2>')
            in_section = True
            continue
        if lvl == 3:
            close_day()
            m = re.match(r"^Day (\d+)(.*)$", txt)
            if m:
                d = int(m.group(1))
                date = START + datetime.timedelta(days=d - 1)
                ds = date.strftime("%a %-d %b")
                body.append(
                    f'<details class="day" id="day-{d}" data-date="{date.isoformat()}"><summary>'
                    f'<span class="dn">Day {d}</span><span class="dd">{ds}</span>'
                    f'<span class="dx">{inline(m.group(2).strip(" :·"))}</span>'
                    f'<label class="done"><input type="checkbox" id="done-{d}" data-done="{d}"> Done</label>'
                    f'</summary><div class="dbody">')
                open_day = True
            else:
                body.append(f'<h3 id="h-{slug(txt)}">{inline(txt)}</h3>')
            continue
        body.append(f"<h4>{inline(txt)}</h4>")
        continue
    body.append(b)
close_day()
if in_section:
    body.append("</section>")

gallery = "".join(
    f'<figure class="g"><a href="graphics/{g}" target="_blank" rel="noopener">'
    f'<img src="graphics/{g}" alt="Hunkerhood graphic {esc(g)}" loading="lazy"></a>'
    f'<figcaption>{esc(g)}</figcaption></figure>' for g in GFX)

navhtml = "".join(f'<a href="#{sid}">{esc(t)}</a>' for sid, t in nav)
days = "".join(f'<a class="dchip" href="#day-{d}">{d}</a>' for d in range(1, 16))

page = f"""<title>Hunkerhood Launch Kit</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap">
<style>
/* Layout: one reading column, a sticky day strip, every post a copy box. Brand tokens from the store's style.css. */
:root {{
  --bg:#f5f1ea; --paper:#fbf8f3; --sand:#ece3d6; --line:#ddd2c3;
  --ink:#2b2a28; --ink-2:#5a5148; --clay:#8b5a3c; --olive:#55603f; --code:#efe6d9;
  --serif:"Fraunces",Georgia,"Times New Roman",serif;
  --sans:"Inter",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
}}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{
  --bg:#24201d; --paper:#2f2a26; --sand:#3a332e; --line:#4a423b;
  --ink:#efe7dc; --ink-2:#c3b7a8; --clay:#d9a27f; --olive:#b5c08f; --code:#3a332e; color-scheme:dark }} }}
:root[data-theme="dark"] {{
  --bg:#24201d; --paper:#2f2a26; --sand:#3a332e; --line:#4a423b;
  --ink:#efe7dc; --ink-2:#c3b7a8; --clay:#d9a27f; --olive:#b5c08f; --code:#3a332e; color-scheme:dark }}
* {{ box-sizing:border-box }}
body {{ background:var(--bg); color:var(--ink); font:16px/1.55 var(--sans); }}
body::before {{ content:""; position:fixed; inset:0 0 auto; height:env(safe-area-inset-top,0px); z-index:10; background:var(--paper) }}
.wrap {{ max-width:760px; margin:0 auto; padding-left:max(16px, env(safe-area-inset-left,0px)); padding-right:max(16px, env(safe-area-inset-right,0px)); padding-block:0 64px }}
header.top {{ position:sticky; top:env(safe-area-inset-top,0px); z-index:5; background:var(--paper); border-bottom:1px solid var(--line) }}
header.top .in {{ max-width:760px; margin:0 auto; padding-left:max(16px, env(safe-area-inset-left,0px)); padding-right:max(16px, env(safe-area-inset-right,0px)); padding-block:8px }}
.strip {{ display:flex; gap:6px; overflow-x:auto; scrollbar-width:none; padding-bottom:2px }}
.strip::-webkit-scrollbar {{ display:none }}
.strip a {{ flex:0 0 auto; text-decoration:none; color:var(--ink-2); font-size:13px; font-weight:500; padding:5px 10px; border-radius:999px; border:1px solid var(--line); white-space:nowrap }}
.strip a.dchip {{ min-width:32px; text-align:center; padding:5px 0 }}
.strip a.today {{ background:var(--clay); border-color:var(--clay); color:var(--paper) }}
.strip a.isdone {{ text-decoration:line-through; opacity:.6 }}
.strip + .strip {{ margin-top:6px }}
.hero {{ padding-block:28px 8px }}
.eyebrow {{ font-size:12px; letter-spacing:.12em; text-transform:uppercase; color:var(--olive); font-weight:600 }}
h1 {{ font-family:var(--serif); font-weight:600; font-size:clamp(30px,7vw,44px); line-height:1.08; margin:6px 0 10px; text-wrap:balance }}
.lede {{ color:var(--ink-2); margin:0 0 16px; max-width:60ch }}
.steps {{ display:grid; gap:10px; margin:0; padding:0; list-style:none; counter-reset:st }}
.steps li {{ counter-increment:st; display:grid; grid-template-columns:28px 1fr; gap:10px; align-items:start }}
.steps li::before {{ content:counter(st); width:28px; height:28px; border-radius:50%; background:var(--sand); color:var(--clay); font-weight:600; font-size:14px; display:grid; place-items:center }}
h2 {{ font-family:var(--serif); font-weight:600; font-size:26px; line-height:1.2; margin:40px 0 12px; text-wrap:balance; scroll-margin-top:110px }}
h3 {{ font-family:var(--serif); font-weight:600; font-size:20px; margin:28px 0 8px; scroll-margin-top:110px }}
h4 {{ font-size:16px; margin:20px 0 6px }}
.sec {{ scroll-margin-top:110px }}
p, li {{ max-width:68ch }}
a {{ color:var(--clay) }}
code {{ font-family:var(--mono); font-size:.86em; background:var(--code); padding:1px 5px; border-radius:5px; overflow-wrap:anywhere }}
.tw {{ overflow-x:auto; margin:12px 0; border:1px solid var(--line); border-radius:12px; background:var(--paper) }}
table {{ border-collapse:collapse; width:100%; font-size:14px; min-width:520px }}
th, td {{ text-align:left; vertical-align:top; padding:8px 10px; border-bottom:1px solid var(--line) }}
th {{ font-size:12px; letter-spacing:.06em; text-transform:uppercase; color:var(--ink-2); font-weight:600; background:var(--sand) }}
tr:last-child td {{ border-bottom:0 }}
.box {{ position:relative; margin:10px 0 16px; background:var(--paper); border:1px solid var(--line); border-radius:12px }}
.box pre {{ margin:0; padding:14px 14px 48px; white-space:pre-wrap; overflow-wrap:anywhere; font:15px/1.5 var(--sans); color:var(--ink) }}
button {{ font:inherit; cursor:pointer }}
.cp {{ position:absolute; right:8px; bottom:8px; border:0; background:var(--clay); color:var(--paper); font-weight:600; font-size:14px; padding:7px 16px; border-radius:999px }}
.cp.ok {{ background:var(--olive) }}
.link {{ display:inline-flex; gap:8px; align-items:center; text-align:left; border:0; background:none; padding:0; color:inherit }}
.link .lk {{ font-size:12px; font-weight:600; color:var(--clay); white-space:nowrap }}
.link.ok .lk {{ color:var(--olive) }}
button:focus-visible, a:focus-visible, summary:focus-visible {{ outline:2px solid var(--clay); outline-offset:2px }}
.gal {{ display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:12px; margin:14px 0 4px }}
.g {{ margin:0 }}
.g img {{ display:block; width:100%; height:200px; object-fit:contain; background:var(--sand); border-radius:10px }}
.g figcaption {{ font-size:12px; color:var(--ink-2); margin-top:4px; font-family:var(--mono) }}
.note {{ font-size:14px; color:var(--ink-2) }}
details.day {{ background:var(--paper); border:1px solid var(--line); border-radius:14px; margin:10px 0; scroll-margin-top:110px }}
details.day > summary {{ list-style:none; display:grid; grid-template-columns:auto auto 1fr auto; gap:4px 10px; align-items:baseline; padding:14px 14px; cursor:pointer }}
details.day > summary::-webkit-details-marker {{ display:none }}
details.day[open] > summary {{ border-bottom:1px solid var(--line) }}
.dn {{ font-family:var(--serif); font-weight:600; font-size:20px }}
.dd {{ font-size:13px; color:var(--olive); font-weight:600 }}
.dx {{ font-size:13px; color:var(--ink-2); min-width:0 }}
.done {{ font-size:13px; color:var(--ink-2); display:flex; gap:6px; align-items:center; justify-self:end }}
details.day.isdone .dn {{ text-decoration:line-through; opacity:.6 }}
details.day.today {{ border-color:var(--clay); box-shadow:0 0 0 1px var(--clay) }}
.dbody {{ padding:4px 14px 14px; min-width:0 }}
.dbody > .tw:first-child {{ margin-top:12px }}
@media (max-width:480px) {{ details.day > summary {{ grid-template-columns:auto 1fr auto }} .dx {{ grid-column:1 / -1 }} }}
@media (prefers-reduced-motion: no-preference) {{ html {{ scroll-behavior:smooth }} }}
</style>

<header class="top"><div class="in">
  <nav class="strip" aria-label="Days">{days}</nav>
  <nav class="strip" aria-label="Sections"><a href="#images">Images</a><a href="#chrome">Claude in Chrome</a>{navhtml}</nav>
</div></header>

<main class="wrap">
  <div class="hero">
    <div class="eyebrow">Organic test · $0 · 14 days</div>
    <h1>Hunkerhood launch kit</h1>
    <p class="lede">Every post for the next two weeks, ready to copy. About 20 minutes a day. Dates assume Day 1 is Mon 2 Nov; if you start later, just follow the day numbers.</p>
    <ol class="steps">
      <li><span><strong>Once:</strong> save the 10 images below to your phone (tap one, then press and hold to save). On a computer, save them into a <code>hunkerhood</code> folder in Downloads for Claude in Chrome.</span></li>
      <li><span><strong>Each day:</strong> tap the day number at the top, copy each box, paste it, attach the image the table names, post. Tick Done.</span></li>
      <li><span><strong>Want Claude to post for you?</strong> Copy the Claude in Chrome brief below into Claude in Chrome on your computer, with the day number filled in.</span></li>
    </ol>
  </div>

  <section class="sec" id="images">
    <h2>The 10 images</h2>
    <p class="note">Tap an image to open it full size, then save it. Every image that shows the drawing already says "Illustration" on it.</p>
    <div class="gal">{gallery}</div>
  </section>

  <section class="sec" id="chrome">
    <h2>Claude in Chrome brief</h2>
    <p class="note">Open Claude in Chrome on the computer where you're signed in to your social accounts. Copy this, change <code>[N]</code> to today's day number (both places), and send. It posts only what's in this kit, stops before anything that costs money or needs a password, and asks you before any sign-up.</p>
    <div class="box"><pre>{esc(brief_txt)}</pre><button type="button" class="cp" data-copy="{esc(brief_txt)}">Copy</button></div>
  </section>

  {''.join(body)}
</main>

<script>
(function () {{
  'use strict';
  function copy(btn) {{
    var t = btn.getAttribute('data-copy');
    var done = function () {{
      btn.classList.add('ok');
      var lab = btn.classList.contains('cp') ? btn : btn.querySelector('.lk');
      var old = lab.textContent; lab.textContent = 'Copied';
      setTimeout(function () {{ btn.classList.remove('ok'); lab.textContent = old; }}, 1600);
    }};
    var fallback = function () {{
      var pre = btn.parentNode.querySelector('pre') || btn.querySelector('code');
      if (!pre) return;
      var r = document.createRange(); r.selectNodeContents(pre);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      var lab = btn.classList.contains('cp') ? btn : btn.querySelector('.lk');
      lab.textContent = 'Selected: press Copy';
      setTimeout(function () {{ lab.textContent = 'Copy'; }}, 2400);
    }};
    try {{
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, fallback);
      else fallback();
    }} catch (e) {{ fallback(); }}
  }}
  document.addEventListener('click', function (ev) {{
    var b = ev.target.closest('[data-copy]');
    if (b) {{ ev.preventDefault(); copy(b); }}
    var lab = ev.target.closest('label.done');
    if (lab) ev.stopPropagation();
  }});

  // Done ticks: kept in this browser only.
  var store = {{}};
  try {{ store = JSON.parse(localStorage.getItem('hh_done') || '{{}}') || {{}}; }} catch (e) {{ store = {{}}; }}
  function paintDone(d, on) {{
    var det = document.getElementById('day-' + d);
    if (det) det.classList.toggle('isdone', !!on);
    var chip = document.querySelector('.dchip[href="#day-' + d + '"]');
    if (chip) chip.classList.toggle('isdone', !!on);
  }}
  Array.prototype.forEach.call(document.querySelectorAll('[data-done]'), function (cb) {{
    var d = cb.getAttribute('data-done');
    cb.checked = !!store[d]; paintDone(d, cb.checked);
    cb.addEventListener('click', function (ev) {{ ev.stopPropagation(); }});
    cb.addEventListener('change', function () {{
      store[d] = cb.checked; paintDone(d, cb.checked);
      try {{ localStorage.setItem('hh_done', JSON.stringify(store)); }} catch (e) {{ /* storage blocked */ }}
    }});
  }});

  // Today's card opens by itself (dates assume Day 1 = Mon 2 Nov).
  var now = new Date(), iso = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2);
  var today = document.querySelector('details.day[data-date="' + iso + '"]');
  if (today) {{
    today.open = true; today.classList.add('today');
    var chip = document.querySelector('.dchip[href="#' + today.id + '"]');
    if (chip) chip.classList.add('today');
  }} else {{
    var first = document.getElementById('day-1'); if (first) first.open = true;
  }}
  function openHash() {{
    var id = (location.hash || '').slice(1);
    if (!/^[A-Za-z0-9-]+$/.test(id)) return;
    var el = document.getElementById(id);
    if (el && el.tagName === 'DETAILS') {{ el.open = true; el.scrollIntoView(); }}
  }}
  window.addEventListener('hashchange', openHash);
  document.addEventListener('click', function (ev) {{
    var a = ev.target.closest('a[href^="#day-"]');
    if (!a) return;
    var el = document.getElementById(a.getAttribute('href').slice(1));
    if (el) {{ el.open = true; }}
  }}, true);
  openHash();
}})();
</script>
"""
(OUT / "index.html").write_text(page)
print("ok", len(page), "bytes;", len(GFX), "graphics;", sum(1 for b in body if 'class="box"' in b), "boxes;", len(nav), "sections")
