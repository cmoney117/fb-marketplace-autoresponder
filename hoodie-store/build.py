#!/usr/bin/env python3
"""Build the single-product brand site (standard library only).

    python3 build.py            build site/ (preview or live, per config.launch_live)
    python3 build.py --check    run every check and print the report; write nothing
    python3 build.py --out DIR --set payment_link=https://buy.stripe.com/test_x
                                QA build into another folder with config overrides

Sources:
  config.json                     every value, flag and claim (the brand name lives only there)
  <copy_dir>/product-page.md      product page copy, with {{#if}} gates and {{VERIFY}} markers
  <copy_dir>/policies.md          shipping, returns, contact, privacy, terms
  <compliance>                    banned-phrase list and the fixed Safety block
  assets/product/                 our own photos (optional)
  <supplier_listing_dir>/latest/  listing.json from the Mac mini fetcher (optional)
  src/style.css, src/app.js       styles and the page script

The build refuses to write anything if a banned phrase, a gate error or an unknown
token is found. With launch_live true it also refuses until every launch check passes.
"""
import argparse
import datetime as dt
import html
import json
import math
import os
import re
import shutil
import struct
import sys
from html.parser import HTMLParser

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "src")
FONTS_URL = ("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;"
             "9..144,600&family=Inter:wght@400;500;600&display=swap")
JS_BUDGET = 15 * 1024
TOUCH_ICON = os.path.join(SRC, "apple-touch-icon.png")   # 180x180, copied to site/ when present
IMG_EXT = (".jpg", ".jpeg", ".png", ".webp")
POLICY_IDS = {"shipping": "shipping", "returns and refunds": "returns", "contact": "contact",
              "privacy": "privacy", "terms of sale": "terms"}
LEGAL_SECTIONS = {"privacy", "terms"}
FOOTER_LINKS = {"Shipping": "shipping", "Returns and refunds": "returns", "Terms": "terms",
                "Privacy": "privacy", "Contact": "contact"}
# Phrases each gated claim controls (compliance.md, "Gated claims"). Used on the rendered
# pages: if a claim is not shown, none of its phrases may appear outside the Safety block.
GATED_PHRASES = {
    "weighted": [r"weighted", r"calming weight", r"comforting weight", r"gentle,? even weight",
                 r"weighted hug", r"heavy in the best way"],
    "weight_lbs": [r"about \d+(?:\.\d+)? ?lbs?"],
    "faux_fur_lining": [r"faux[- ]fur", r"sherpa", r"plush"],
    "outer_fiber": [r"cotton"],
    "care": [r"machine[- ]washable", r"machine[- ]wash", r"tumble[- ]dry"],
    "ships_from_us": [r"ships from the us", r"warehouse in the us", r"us warehouse"],
    "buttons": [r"buttons?"],
    "size_chart": [r"by height"],
    "origin": [r"imported"],
}
# Plain words for the preview banner (only claims shown without being verified).
CLAIM_WORDS = {"weighted": "the weight", "weight_lbs": "the weight figure", "faux_fur_lining": "the lining",
               "outer_fiber": "the fabric", "fill": "the fill", "care": "the care steps", "origin": "the origin",
               "ships_from_us": "US shipping", "size_chart": "the size chart", "buttons": "the buttons"}
KID_SIZE = re.compile(r"(?i)\b(kids?|child(ren)?|toddlers?|bab(y|ies)|infants?|newborns?|youth|teens?|"
                      r"boys?|girls?|junior)\b|\b\d{1,2}\s*(-\s*\d{1,2}\s*)?(y|yrs?|years?|t|m|months?)\b")
SENT_LINE = "\x05"     # marks a line that had content in the source
SENT_EMAIL = "\x03"    # wraps the support email
SENT_STAR = "\x06"     # an asterisk inside a token value
SENT_TABLE = "\x07"    # the size table
HOL_OPEN, HOL_CLOSE = "\x0e", "\x0f"


class BuildError(Exception):
    pass


class Report:
    def __init__(self):
        self.errors, self.warnings, self.blockers, self.info = [], [], [], []

    def err(self, m):
        self.errors.append(m)

    def warn(self, m):
        self.warnings.append(m)

    def block(self, m):
        self.blockers.append(m)

    def note(self, m):
        self.info.append(m)


# --------------------------------------------------------------------------- helpers

def rel(path):
    return os.path.normpath(os.path.join(HERE, path))


def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def e(s):
    return html.escape(str(s), quote=True)


def slug(s):
    s = str(s).replace("\u2019", "'").lower()
    return re.sub(r"[^a-z0-9]+", "_", s).strip("_") or "x"


def anchor(s):
    s = str(s).replace("\u2019", "'").lower()
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-") or "x"


def fmt_price(p):
    p = float(p)
    return f"${p:,.0f}" if p.is_integer() else f"${p:,.2f}"


def human_list(xs):
    xs = [str(x) for x in xs if x]
    if not xs:
        return ""
    return xs[0] if len(xs) == 1 else ", ".join(xs[:-1]) + " and " + xs[-1]


def long_date(d):
    return f"{d:%A}, {d:%B} {d.day}, {d.year}"


def parse_date(s, what, rep):
    try:
        return dt.date.fromisoformat(str(s))
    except ValueError:
        rep.err(f"config: {what} must be a date like 2026-12-04, got {s!r}")
        return None


def mix(hex_color, to, t):
    a, b = int(hex_color[1:], 16), int(to[1:], 16)
    out = "#"
    for s in (16, 8, 0):
        x, y = (a >> s) & 255, (b >> s) & 255
        out += f"{round(x + (y - x) * t):02x}"
    return out


def image_size(path):
    """(width, height) for PNG, JPEG or WebP, else None."""
    try:
        with open(path, "rb") as f:
            head = f.read(32)
            if head.startswith(b"\x89PNG\r\n\x1a\n"):
                return struct.unpack(">II", head[16:24])
            if head[:4] == b"RIFF" and head[8:12] == b"WEBP":
                f.seek(12)
                chunk = f.read(4)
                f.seek(20)
                d = f.read(10)
                if chunk == b"VP8X":
                    return (1 + int.from_bytes(d[4:7], "little"), 1 + int.from_bytes(d[7:10], "little"))
                if chunk == b"VP8 ":
                    w, h = struct.unpack("<HH", d[6:10])
                    return (w & 0x3FFF, h & 0x3FFF)
                if chunk == b"VP8L":
                    b = d[1:5]
                    bits = int.from_bytes(b, "little")
                    return ((bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1)
                return None
            if head[:2] == b"\xff\xd8":
                f.seek(2)
                while True:
                    marker = f.read(2)
                    if len(marker) < 2 or marker[0] != 0xFF:
                        return None
                    if marker[1] in (0xD8, 0x01) or 0xD0 <= marker[1] <= 0xD7:
                        continue
                    length = struct.unpack(">H", f.read(2))[0]
                    if marker[1] in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                        f.read(1)
                        h, w = struct.unpack(">HH", f.read(4))
                        return (w, h)
                    f.seek(length - 2, 1)
    except (OSError, struct.error):
        return None
    return None


# --------------------------------------------------------------------------- template engine
# Syntax used by the copy docs: {{#if KEY}} ... {{else}} ... {{/if}}, {{VERIFY:KEY}}, {{TOKEN}}.

TAG_RE = re.compile(r"\{\{\s*(#if\s+[\w.]+|else|/if|VERIFY:[\w.]+|[A-Z][A-Z0-9_]*)\s*\}\}")


def tparse(text, where):
    root, stack, cur, pos = [], [], None, 0
    cur = root
    for m in TAG_RE.finditer(text):
        if m.start() > pos:
            cur.append(text[pos:m.start()])
        pos = m.end()
        tag = m.group(1)
        if tag.startswith("#if"):
            key = tag.split(None, 1)[1]
            node = ["if", key, [], []]
            cur.append(node)
            stack.append({"key": key, "node": node, "in_else": False, "parent": cur})
            cur = node[2]
        elif tag == "else":
            if not stack or stack[-1]["in_else"]:
                raise BuildError(f"{where}: stray {{{{else}}}}")
            stack[-1]["in_else"] = True
            cur = stack[-1]["node"][3]
        elif tag == "/if":
            if not stack:
                raise BuildError(f"{where}: stray {{{{/if}}}}")
            cur = stack.pop()["parent"]
        elif tag.startswith("VERIFY:"):
            key = tag[7:]
            if key not in {f["key"] for f in stack if not f["in_else"]}:
                raise BuildError(f"{where}: {{{{VERIFY:{key}}}}} sits outside its own {{{{#if {key}}}}} gate")
            cur.append(["verify", key])
        else:
            cur.append(["tok", tag])
    if pos < len(text):
        cur.append(text[pos:])
    if stack:
        raise BuildError(f"{where}: {{{{#if {stack[-1]['key']}}}}} is never closed")
    if "{{" in "".join(x for x in root if isinstance(x, str)):
        raise BuildError(f"{where}: unrecognised {{{{...}}}} tag")
    return root


class Ctx:
    def __init__(self, flags, tokens, wraps):
        self.flags, self.tokens, self.wraps = flags, tokens, wraps
        self.missing = set()

    def flag(self, key):
        if key not in self.flags:
            raise BuildError(f"unknown gate key {key!r} (add it to the flag map in build.py)")
        return bool(self.flags[key])

    def token(self, name):
        if name not in self.tokens:
            raise BuildError(f"unknown token {{{{{name}}}}}")
        v = self.tokens[name]
        if v is None or v == "":
            self.missing.add(name)
            return f"\x00{name}\x00"
        if name == "SUPPORT_EMAIL":
            return f"{SENT_EMAIL}{v}{SENT_EMAIL}"
        if name == "SIZE_TABLE":
            return SENT_TABLE
        return str(v).replace("*", SENT_STAR)


def trender(nodes, ctx):
    out = []
    for n in nodes:
        if isinstance(n, str):
            out.append(n)
        elif n[0] == "tok":
            out.append(ctx.token(n[1]))
        elif n[0] == "verify":
            ctx.flag(n[1])
        else:
            on = ctx.flag(n[1])
            body = trender(n[2] if on else n[3], ctx)
            if on and n[1] in ctx.wraps and body.strip():
                body = HOL_OPEN + body + HOL_CLOSE
            out.append(body)
    return "".join(out)


def render_text(text, ctx, where):
    """Resolve gates and tokens. Lines that had content but were emptied by a gate are dropped."""
    marked = "\n".join(SENT_LINE + ln if ln.strip() else ln for ln in text.split("\n"))
    out = trender(tparse(marked, where), ctx)
    lines = []
    for ln in out.split("\n"):
        if SENT_LINE in ln and not ln.replace(SENT_LINE, "").strip():
            continue
        lines.append(ln.replace(SENT_LINE, ""))
    return "\n".join(lines)


def drop_missing(s, lead=True):
    """Hide text that depends on a value that isn't set, so no gap or placeholder ever
    reaches a customer. Works per ' · ' part, then per sentence:
      * a sentence holding a missing value is dropped;
      * a question that leads straight into a dropped sentence ('Between sizes? Email ...') goes too;
      * with lead=True, if the first sentence of a paragraph loses its value, the whole
        paragraph goes, since what follows only makes sense after it."""
    if "\x00" not in s:
        return s
    kept_parts = []
    for part in s.split(" \u00b7 "):
        if "\x00" not in part:
            kept_parts.append(part)
            continue
        sents = re.split(r"(?<=[.!?])\s+(?=\S)", part)
        if lead and "\x00" in sents[0]:
            continue
        kept = []
        for snt in sents:
            if "\x00" in snt:
                if kept and kept[-1].rstrip().endswith("?"):
                    kept.pop()
                continue
            kept.append(snt)
        if kept:
            kept_parts.append(" ".join(kept))
    out = " \u00b7 ".join(kept_parts).strip()
    if out.count(HOL_OPEN) != out.count(HOL_CLOSE):
        out = out.replace(HOL_OPEN, "").replace(HOL_CLOSE, "")
    if out.count("**") % 2:
        out = out.replace("**", "")
    return out


# --------------------------------------------------------------------------- tiny Markdown

def smarten(s):
    s = re.sub(r"(?<=[A-Za-z])'(?=[A-Za-z])", "\u2019", s)
    s = re.sub(r"(?<=[A-Za-z.,!?])'(?=[\s.,;:!?)]|$)", "\u2019", s)
    s = re.sub(r'(^|[\s(\[\x0e>\u00b7])"(?=\S)', "\\1\u201c", s)
    s = re.sub(r'(?<!\d)"', "\u201d", s)
    s = re.sub(r"(?<=\d)-(?=\d)", "\u2013", s)
    return s


def inline(s, hol_attr=""):
    s = html.escape(s, quote=False)
    s = smarten(s)
    s = re.sub(r"(?<=\d)\u2013(?=\d)", "\u2060\u2013\u2060", s)  # keep '5–11' on one line
    s = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<em>\1</em>", s)
    s = s.replace(SENT_STAR, "*")
    s = re.sub(SENT_EMAIL + r"(.+?)" + SENT_EMAIL, lambda m: f'<a href="mailto:{m.group(1)}">{m.group(1)}</a>', s)
    if s.count(HOL_OPEN) == s.count(HOL_CLOSE):
        s = s.replace(HOL_OPEN, f'<span class="dated"{hol_attr}>').replace(HOL_CLOSE, "</span>")
    else:
        s = s.replace(HOL_OPEN, "").replace(HOL_CLOSE, "")
    return s


def plain(s):
    s = s.replace("**", "").replace(HOL_OPEN, "").replace(HOL_CLOSE, "")
    s = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"\1", s)
    s = s.replace(SENT_EMAIL, "").replace(SENT_STAR, "*")
    return smarten(s).strip()


def md_blocks(text):
    """Blocks: ('h', level, text) | ('p', [lines]) | ('ul'|'ol', [items]).
    A list continues across blank lines (a gate may have removed an item), and empty
    items or sentences that lost a missing value are dropped."""
    blocks, para, lst = [], [], None

    def flush():
        nonlocal para
        if para:
            lines = [drop_missing(x) for x in para]
            lines = [x for x in lines if x.strip()]
            if lines:
                blocks.append(["p", lines])
        para = []

    for raw in text.split("\n"):
        line = raw.rstrip()
        if not line.strip():
            flush()
            continue
        if re.fullmatch(r"\s*(?:[-*]|\d+\.)\s*", line):
            continue  # a list item emptied by a gate
        m_h = re.match(r"^(#{3,6})\s+(.*)$", line)
        m_ul = re.match(r"^\s*[-*]\s+(.*)$", line) if not line.lstrip().startswith("**") else None
        m_ol = re.match(r"^\s*\d+\.\s+(.*)$", line)
        if m_ul or m_ol:
            flush()
            kind = "ul" if m_ul else "ol"
            item = drop_missing((m_ul or m_ol).group(1))
            if lst is not None and lst[0] == kind:
                if item.strip():
                    lst[1].append(item)
            else:
                lst = [kind, [item] if item.strip() else []]
                blocks.append(lst)
            continue
        lst = None
        if m_h:
            flush()
            t = drop_missing(m_h.group(2))
            if t.strip():
                blocks.append(["h", len(m_h.group(1)), t])
            continue
        if re.match(r"^-{3,}$", line.strip()):
            flush()
            continue
        para.append(line)
    flush()
    return [b for b in blocks if not (b[0] in ("ul", "ol") and not b[1])]


def blocks_html(blocks, hol_attr="", h_base=3):
    out = []
    for b in blocks:
        if b[0] == "h":
            lvl = max(h_base, min(6, b[1]))
            t = inline(b[2], hol_attr)
            out.append(f'<h{lvl} id="{anchor(plain(b[2]))}">{t}</h{lvl}>')
        elif b[0] == "p":
            body = "<br>".join(inline(x, hol_attr) for x in b[1])
            if body.strip() == SENT_TABLE:
                out.append(SENT_TABLE)
            else:
                out.append(f"<p>{body}</p>")
        else:
            items = "".join(f"<li>{inline(x, hol_attr)}</li>" for x in b[1])
            out.append(f"<{b[0]}>{items}</{b[0]}>")
    return "\n".join(out)


# --------------------------------------------------------------------------- copy docs

def strip_editor(text):
    text = re.sub(r"<!--.*?-->", "", text, flags=re.S)
    return "\n".join(ln for ln in text.split("\n") if not ln.lstrip().startswith(">"))


def split_sections(md):
    """{normalised '## heading': (heading, raw text)}; raw keeps comments (Safety markers)."""
    secs, cur, buf = {}, None, []
    for line in md.split("\n"):
        if line.startswith("## "):
            if cur:
                secs[cur[0]] = (cur[1], "\n".join(buf))
            title = line[3:].strip()
            key = re.sub(r"\s*\(.*?\)\s*", " ", title).strip().lower()
            cur, buf = (key, title), []
        elif cur:
            buf.append(line)
    if cur:
        secs[cur[0]] = (cur[1], "\n".join(buf))
    return secs


def section(secs, prefix, doc):
    for k, v in secs.items():
        if k.startswith(prefix):
            return v
    raise BuildError(f"{doc}: no '## {prefix}...' section found")


def kv_items(blocks):
    """'**Key:** value' list items -> {key: value}."""
    out = {}
    for b in blocks:
        if b[0] == "ul":
            for it in b[1]:
                m = re.match(r"^\*\*(.+?):\*\*\s*(.*)$", it)
                if m:
                    out[m.group(1).strip()] = m.group(2).strip()
    return out


def load_safety_reference(compliance_text):
    m = re.search(r"\*\*Safety block for the product page[^\n]*\n\s*\n((?:>.*\n)+)", compliance_text)
    if not m:
        return None
    lines = [ln.lstrip("> ").strip() for ln in m.group(1).splitlines()]
    return [ln[2:].strip() for ln in lines if ln.startswith("- ") and "{weight_lb}" not in ln]


def load_banned(compliance_text):
    sec = compliance_text.split("## Banned phrases", 1)
    if len(sec) < 2:
        raise BuildError("compliance.md: no '## Banned phrases' section")
    m = re.search(r"```text\n(.*?)```", sec[1], re.S)
    if not m:
        raise BuildError("compliance.md: no ```text block under '## Banned phrases'")
    return [ln.strip() for ln in m.group(1).splitlines() if ln.strip() and not ln.strip().startswith("-- ")]


def phrase_regex(p):
    body = re.escape(p).replace(r"\-", "[- ]") if "-" in p else re.escape(p)
    left = r"(?<![A-Za-z0-9])" if p[0].isalnum() else ""
    right = r"(?![A-Za-z0-9])" if p[-1].isalnum() else ""
    return re.compile(left + body + right, re.I)


def normalise(s):
    for a, b in (("\u2019", "'"), ("\u2018", "'"), ("\u201c", '"'), ("\u201d", '"'), ("\u2013", "-"),
                 ("\u2014", "-"), ("\u00a0", " "), ("\u2032", "'"), ("\u2033", '"'), ("\u2060", "")):
        s = s.replace(a, b)
    return re.sub(r"\s+", " ", s)


# --------------------------------------------------------------------------- supplier data

def load_supplier(cfg, rep):
    base = rel(cfg["paths"]["supplier_listing_dir"])
    info = {"base": base, "listing": None, "sizes": None, "colors": None, "colors_all": []}
    lp = os.path.join(base, "latest", "listing.json")
    if not os.path.exists(lp):
        rep.note("Supplier data: none yet (listing.json not found). Using the sizes and colours in config.json.")
        return info
    try:
        listing = json.loads(read(lp))
    except (OSError, ValueError) as ex:
        rep.warn(f"Supplier data: listing.json could not be read ({ex}); ignored.")
        return info
    info["listing"] = listing
    status_p = os.path.join(base, "latest", "status.json")
    if os.path.exists(status_p):
        try:
            st = json.loads(read(status_p))
            rep.note(f"Supplier fetch status: {st.get('status')} on {st.get('date')} ({st.get('message', '')})")
        except ValueError:
            pass
    opts = listing.get("options") or {}
    skus = listing.get("skus") or []
    ckey = next((k for k in opts if re.search(r"colou?r", k, re.I)), None)
    skey = next((k for k in opts if re.search(r"size", k, re.I)), None)

    def stocked(key):
        vals = []
        for v in opts.get(key) or []:
            if any(s.get("inStock") and (s.get("specs") or {}).get(key) == v for s in skus):
                vals.append(v)
        return vals

    if skey:
        adult, dropped = [], []
        names = cfg.get("size_names") or {}
        for v in stocked(skey):
            (dropped if KID_SIZE.search(v) else adult).append(v)
        if dropped:
            rep.note(f"Supplier sizes left out as children's sizes: {', '.join(dropped)}")
        info["sizes"] = [names.get(v, v) for v in adult]
        info["size_map"] = {names.get(v, v): v for v in adult}
        rep.note(f"Supplier sizes in stock (adult): {', '.join(info['sizes']) or 'none'}")
    if ckey:
        info["colors"] = stocked(ckey)
        info["colors_all"] = list(opts.get(ckey) or [])
        rep.note(f"Supplier colours in stock: {', '.join(info['colors']) or 'none'}")
    prices = [s["priceUsd"] for s in skus if s.get("inStock") and isinstance(s.get("priceUsd"), (int, float))]
    if prices:
        hi = max(prices)
        rep.note(f"Supplier item prices in stock: ${min(prices):.2f} to ${hi:.2f}. Landed at about 8% tax on the "
                 f"highest: ${hi * 1.08:.2f} (economics.md section 9 picks the column).")
        if hi * 1.08 > 45:
            rep.warn("Landed cost looks above $45: economics.md says $99 with paid ads does not work there.")
    ship = listing.get("shipping") or []
    if ship:
        local = any(re.search(r"\blocal\b", x, re.I) for x in ship)
        rep.note("Supplier shipping lines: " + " | ".join(ship[:6]))
        if not local:
            rep.warn("No 'Local' warehouse line in listing.json: confirm US origin before claims.ships_from_us and before any ads.")
    for f in ("size-guide.jpg", "size-guide.txt", "size-guide-tables.html"):
        if os.path.exists(os.path.join(base, "latest", f)):
            rep.note(f"Supplier size guide present: latest/{f}. Check it against the sample, then fill claims.size_chart.table.")
            break
    return info


# --------------------------------------------------------------------------- images

def load_source_log(path):
    log = {}
    if not os.path.exists(path):
        return log
    for i, line in enumerate(read(path).splitlines()):
        if i == 0 or not line.strip():
            continue
        cells = [c.strip().strip('"') for c in line.split(",")]
        if cells and cells[0]:
            log[cells[0]] = cells
    return log


def find_images(cfg, bslug, product_name, sup, rep):
    ic = cfg["images"]
    adir = rel(ic["dir"])
    log = load_source_log(rel(ic["source_log"]))
    res = {"hero": None, "detail": [], "lifestyle": [], "size_chart": None, "copies": [], "all_own": True,
           "unlogged": []}
    files = sorted(os.listdir(adir)) if os.path.isdir(adir) else []

    def make(fn, src, kind, alt=None):
        stem, ext = os.path.splitext(fn)
        ext = ".jpg" if ext.lower() == ".jpeg" else ext.lower()
        out = f"{bslug}-cloak-{anchor(stem)}{ext}"
        if not alt:
            alt = ic.get("alt", {}).get(fn)
        if not alt:
            view = {"hero": "front view"}.get(stem) or stem.split("-", 1)[-1].replace("-", " ").replace("_", " ")
            if re.fullmatch(r"\d+", view.strip()):
                view = {"detail": "detail photo", "lifestyle": "lifestyle photo", "size_chart": "size chart"}.get(kind, "photo")
            alt = f"{product_name}, {view}"
            rep.warn(f"Image {fn}: no alt text in config.images.alt, using '{alt}'. Describe only what is visible.")
        size = image_size(src)
        img = {"src": src, "out": f"img/{out}", "alt": alt, "w": size[0] if size else None,
               "h": size[1] if size else None, "file": fn}
        res["copies"].append(img)
        return img

    for fn in files:
        stem, ext = os.path.splitext(fn)
        if ext.lower() not in IMG_EXT:
            continue
        path = os.path.join(adir, fn)
        if fn not in log:
            res["unlogged"].append(fn)
        if stem == ic["hero"]:
            res["hero"] = make(fn, path, "hero")
        elif stem.startswith(ic["detail_prefix"]):
            res["detail"].append(make(fn, path, "detail"))
        elif stem.startswith(ic["lifestyle_prefix"]):
            res["lifestyle"].append(make(fn, path, "lifestyle"))
        elif stem == ic["size_chart"]:
            res["size_chart"] = make(fn, path, "size_chart", ic.get("alt", {}).get(fn) or f"{product_name} size chart")
        else:
            rep.warn(f"assets/product/{fn}: name not recognised (use hero, detail-*, lifestyle-*, size-chart); not used.")

    # Supplier photos: only those cleared by all three checks in compliance.md section 7.
    for entry in ic.get("supplier_cleared") or []:
        need = [k for k in ("file", "reverse_search", "written_permission", "model_release", "alt") if not str(entry.get(k, "")).strip()]
        if need:
            rep.err(f"images.supplier_cleared entry {entry.get('file')!r} is missing {', '.join(need)}; supplier photos need all three checks.")
            continue
        src = os.path.join(sup["base"], entry["file"])
        if not os.path.exists(src):
            rep.err(f"images.supplier_cleared: {src} not found.")
            continue
        img = make("supplier-" + os.path.basename(entry["file"]), src, "detail", entry["alt"])
        res["detail"].append(img)
        res["all_own"] = False
    if res["unlogged"]:
        rep.warn("Images missing from image-sources.csv: " + ", ".join(res["unlogged"]))
    n = len(res["copies"])
    rep.note(f"Images: {n} found" + (" (hero photo present)" if res["hero"] else " (no hero photo: designed illustration is used)"))
    return res


# --------------------------------------------------------------------------- context

def build_context(cfg, sup, imgs, rep, today):
    live = bool(cfg.get("launch_live"))
    preview_claims = (not live) and bool(cfg.get("preview_unverified_claims", True))
    brand = cfg["brand_name"].strip()
    if not brand:
        raise BuildError("config: brand_name is empty")
    bslug = anchor(brand)
    product_name = f"{brand} {cfg.get('product_noun', '').strip()}".strip()

    claims, shown, flags = cfg["claims"], {}, {}
    for name, c in claims.items():
        if name.startswith("_"):
            continue
        v = c.get("value")
        if c.get("verified") is True and v is None:
            rep.err(f"config: claims.{name} is verified but its value is null: enter the measured or label value first.")
        on = bool(v) and (c.get("verified") is True or (preview_claims and bool(c.get("show_in_preview"))))
        shown[name] = on
        flags[c["copy_flag"]] = on
    for need in ("weighted", "weight_lbs", "faux_fur_lining", "outer_fiber", "fill", "care", "origin",
                 "ships_from_us", "size_chart", "buttons"):
        if need not in shown:
            raise BuildError(f"config: claims.{need} is missing")

    def text_claim(name):
        v = claims[name].get("value")
        if shown[name] and not isinstance(v, str):
            rep.err(f"config: claims.{name}.value must be the label text (a string) when it is on")
            return ""
        return v if shown[name] else ""

    weight = ""
    if shown["weight_lbs"]:
        raw = claims["weight_lbs"]["value"]
        if not isinstance(raw, (int, float)):
            rep.err("config: claims.weight_lbs.value must be a number")
        else:
            rounded = math.floor(raw * 2) / 2
            if rounded != raw:
                rep.warn(f"claims.weight_lbs {raw} rounded down to {rounded} lb (rule: down to the nearest 0.5 lb)")
            weight = f"{rounded:g}"
    care = text_claim("care")
    if care and not care.rstrip().endswith("."):
        care = care.rstrip() + "."

    profile_name = "us_local" if shown["ships_from_us"] else "china_direct"
    profile = cfg["delivery"]["profiles"][profile_name]
    hol = cfg["delivery"].get("holiday") or {}
    order_by = parse_date(hol.get("order_by"), "delivery.holiday.order_by", rep) if hol.get("order_by") else None
    arrive_by = parse_date(hol.get("arrive_by"), "delivery.holiday.arrive_by", rep) if hol.get("arrive_by") else None
    holiday_on = bool(hol.get("active")) and shown["ships_from_us"] and order_by and arrive_by and today <= order_by
    policy_date = ""
    if cfg.get("policy_date"):
        d = parse_date(cfg["policy_date"], "policy_date", rep)
        policy_date = f"{d:%B} {d.day}, {d.year}" if d else ""

    legal = (cfg.get("legal_business_name") or "").strip()
    stripe = cfg.get("stripe") or {}
    flags.update({
        "sample.checked": bool(cfg.get("sample_checked")),
        "config.photos_all_own": bool(cfg.get("photos_all_own")) and bool(imgs["copies"]) and imgs["all_own"] and not imgs["unlogged"],
        "config.holiday_cutoff_active": bool(holiday_on),
        "config.ship_restrictions": bool((cfg["delivery"].get("ship_restrictions") or "").strip()),
        "config.stripe_tax": bool(stripe.get("tax_enabled")),
        "config.import_charges_prepaid": bool(cfg["delivery"].get("import_charges_prepaid")),
        "config.dba": bool(legal) and legal != cfg["brand_name"],
        "config.height_field": bool(stripe.get("height_field")),
        "config.pixel": bool((cfg.get("meta_pixel_id") or "").strip()),
        "config.email_provider": bool((cfg.get("email_provider") or "").strip()),
        "config.delay_credit": False,
    })

    # Colours and sizes (supplier data wins when present).
    colors = []
    for c in cfg["colors"]:
        if not re.fullmatch(r"#[0-9a-fA-F]{6}", c.get("hex", "")):
            rep.err(f"config: colour {c.get('name')!r} needs a hex like #3b3936")
            continue
        sname = c.get("supplier_name")
        if sup["colors"] is not None and sname:
            if sname not in sup["colors"]:
                rep.note(f"Colour {c['name']} hidden: supplier colour {sname!r} is not in stock.")
                continue
        colors.append({"name": c["name"], "hex": c["hex"].lower(), "slug": slug(c["name"]),
                       "confirmed": bool(c.get("confirmed")) or (sup["colors"] is not None and sname in (sup["colors"] or []))})
    if sup["colors"]:
        mapped = {c.get("supplier_name") for c in cfg["colors"]}
        extra = [x for x in sup["colors"] if x not in mapped]
        if extra:
            rep.note("Supplier colours not on the page yet (add to config.colors with supplier_name): " + ", ".join(extra))
    if not colors:
        rep.err("No colours to sell.")
    if cfg.get("sizes_source", "auto") == "auto" and sup.get("sizes"):
        sizes = sup["sizes"]
        size_from = "listing.json"
    else:
        sizes = [s for s in cfg["sizes"] if not KID_SIZE.search(str(s))]
        size_from = "config.json"
    if len({slug(s) for s in sizes}) != len(sizes):
        rep.err("Two sizes share the same checkout code; rename one.")
    size_rows = claims["size_chart"].get("table") or []
    if shown["size_chart"] and not size_rows:
        rep.err("claims.size_chart is on but its table is empty.")

    descriptor = (stripe.get("statement_descriptor") or "").strip()
    tokens = {
        "BRAND_NAME": brand, "BRAND_SLUG": bslug, "BRAND_DOMAIN": cfg.get("domain") or "",
        "PRODUCT_NAME": product_name, "PRICE": fmt_price(cfg["price"]),
        "SHIP_WINDOW": profile.get("ship_window") or "", "ARRIVAL_WINDOW": profile.get("arrival_window") or "",
        "COLOR_OPTIONS": human_list([c["name"] for c in colors]), "SIZE_OPTIONS": human_list(sizes),
        "SUPPORT_EMAIL": (cfg.get("support_email") or "").strip(),
        "WEIGHT_LB": weight, "SIZE_WEIGHED": (claims["weight_lbs"].get("size_weighed") or "") if shown["weight_lbs"] else "",
        "FIBER_OUTER": text_claim("outer_fiber"),
        "FIBER_LINING": (claims["faux_fur_lining"].get("fiber") or "") if shown["faux_fur_lining"] else "",
        "FILL_DESCRIPTION": text_claim("fill"), "ORIGIN_DISCLOSURE": text_claim("origin"),
        "CARE_INSTRUCTIONS": care, "SIZE_TABLE": "table" if size_rows else "",
        "HOLIDAY_ORDER_BY": long_date(order_by) if order_by else "",
        "HOLIDAY_ARRIVE_BY": long_date(arrive_by) if arrive_by else "",
        "STATEMENT_DESCRIPTOR": descriptor, "LEGAL_BUSINESS_NAME": legal or brand,
        "SHIP_RESTRICTIONS": (cfg["delivery"].get("ship_restrictions") or "").strip(),
        "EMAIL_PROVIDER": (cfg.get("email_provider") or "").strip(), "POLICY_DATE": policy_date,
        "SENDER_NAME": "",
        "UNVERIFIED": human_list([CLAIM_WORDS.get(n, n) for n in claims if not n.startswith("_") and shown.get(n)
                                  and claims[n].get("verified") is not True]),
    }
    hide_after = (order_by + dt.timedelta(days=1)).isoformat() if order_by else ""
    ctx = Ctx(flags, tokens, {"config.holiday_cutoff_active": True})
    promise = drop_missing(render_text(cfg["delivery"]["promise_template"], ctx, "delivery.promise_template"), lead=False)
    if not (profile.get("ship_window") and profile.get("arrival_window")):
        rep.warn(f"delivery.profiles.{profile_name} has no ship or arrival window: delivery lines that need it are hidden.")
    tokens["DELIVERY_PROMISE"] = promise.replace("\x00", "")
    return {
        "cfg": cfg, "live": live, "brand": brand, "bslug": bslug, "product_name": product_name,
        "shown": shown, "flags": flags, "tokens": tokens, "ctx": ctx, "colors": colors, "sizes": sizes,
        "size_from": size_from, "size_rows": size_rows, "profile": profile_name, "hide_after": hide_after,
        "hol_attr": f' data-hide-after="{hide_after}"' if hide_after else "", "imgs": imgs,
        "domain": (cfg.get("domain") or "").strip().lower().rstrip("/").replace("https://", "").replace("http://", ""),
        "today": today, "legal": legal,
    }


def ui(S, text, where):
    """Render a short UI string from config.ui (gates and tokens allowed) to inline HTML."""
    out = drop_missing(render_text(text, S["ctx"], where))
    return inline(out, S["hol_attr"]) if out.strip() else ""


def ui_plain(S, text, where):
    out = drop_missing(render_text(text, S["ctx"], where))
    return plain(out)


# --------------------------------------------------------------------------- drawings

def icon(name):
    paths = {
        "truck": '<path d="M2.5 6.5h11v9h-11z"/><path d="M13.5 9.5h4l3.5 3.5v2.5h-7.5"/><circle cx="6.5" cy="17" r="1.8"/><circle cx="17" cy="17" r="1.8"/>',
        "pin": '<path d="M12 21s-6.5-5.8-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.2 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.3"/>',
        "calendar": '<rect x="3.5" y="5.5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v5M16 3v5"/>',
        "chat": '<path d="M4 5.5h16v10.5H10l-5 4v-4H4z"/>',
        "hood": '<path d="M6 28C5 16 10 5 16 5s11 11 10 23"/><path d="M11 28c0-8 2-15 5-15s5 7 5 15"/>',
        "couch": '<path d="M9 21v-5a3 3 0 0 1 3-3h24a3 3 0 0 1 3 3v5"/><path d="M5 22a3 3 0 0 1 6 0v3h26v-3a3 3 0 0 1 6 0v9H5z"/><path d="M9 31v4M39 31v4"/>',
        "desk": '<path d="M11 13h26v16H11z"/><path d="M5 33h38"/><path d="M20 37h8"/>',
        "book": '<path d="M24 15c-5-3.5-11-3.5-17-1.5v21c6-2 12-2 17 1.5 5-3.5 11-3.5 17-1.5v-21c-6-2-12-2-17 1.5z"/><path d="M24 15v21"/>',
        "mug": '<path d="M10 19h21v11a7 7 0 0 1-7 7h-7a7 7 0 0 1-7-7z"/><path d="M31 22h3a4.5 4.5 0 0 1 0 9h-3"/><path d="M16 9c-2 2.5 2 4.5 0 7M23 9c-2 2.5 2 4.5 0 7"/>',
    }
    vb = "0 0 32 32" if name == "hood" else ("0 0 48 48" if name in ("couch", "desk", "book", "mug") else "0 0 24 24")
    sw = "2.4" if name == "hood" else ("2" if vb.endswith("48") else "1.6")
    return (f'<svg viewBox="{vb}" fill="none" stroke="currentColor" stroke-width="{sw}" stroke-linecap="round" '
            f'stroke-linejoin="round" aria-hidden="true" focusable="false">{paths[name]}</svg>')


BODY = ("M154,166 C130,176 102,192 90,224 C80,300 70,380 60,456 C100,470 140,462 200,470 "
        "C260,462 300,470 340,456 C330,380 320,300 310,224 C298,192 270,176 246,166 C230,176 170,176 154,166 Z")
HOOD_OUT = "M132,186 C114,116 148,50 200,50 C252,50 286,116 268,186 C240,176 160,176 132,186 Z"
HOOD_RIM = "M151,172 C145,122 166,80 200,80 C234,80 255,122 249,172 C230,165 170,165 151,172 Z"
HOOD_DEEP = "M167,172 C163,132 178,101 200,101 C222,101 237,132 233,172 C222,167 178,167 167,172 Z"
FUR = ('<pattern id="{p}-fur" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M1.5,8 q1.5,-5 3,0 '
       'M5.5,4 q1.5,-4 3,0" stroke="#000" stroke-opacity=".09" fill="none" stroke-width="1.1"/></pattern>')


def grain_defs(uid, freq=".9", alpha=".22"):
    return (f'<filter id="{uid}-gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" '
            f'baseFrequency="{freq}" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  '
            f'0 0 0 0 0  0 0 0 0 0  {alpha} 0 0 0 0"/></filter>')


def cloak_art(label, buttons, lining):
    folds = "".join(f'<path class="ck-fold" d="{d}"/>' for d in (
        "M120,250 C114,320 106,390 98,458", "M152,262 C148,330 144,400 142,464",
        "M250,262 C254,330 258,400 260,464", "M282,250 C288,320 296,390 304,458"))
    btns = "".join(f'<circle class="ck-btn" cx="209" cy="{y}" r="5.5"/>' for y in (214, 262, 310, 358)) if buttons else ""
    fur = FUR.format(p="a") if lining else ""
    fur_fill = f'<path fill="url(#a-fur)" d="{HOOD_RIM}"/>' if lining else ""
    return f'''<svg class="art" viewBox="0 0 400 500" role="img" aria-label="{e(label)}" preserveAspectRatio="xMidYMid meet">
<defs><pattern id="a-tw" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><rect width="3" height="7" fill="#000" opacity=".06"/></pattern>{fur}{grain_defs("a")}<clipPath id="a-cl"><path d="{BODY}"/></clipPath><clipPath id="a-hc"><path d="{HOOD_OUT}"/></clipPath><radialGradient id="a-in" cx="50%" cy="20%" r="90%"><stop offset="0" stop-color="#1c1712" stop-opacity=".62"/><stop offset="1" stop-color="#1c1712" stop-opacity=".22"/></radialGradient><radialGradient id="a-lt" cx="36%" cy="24%" r="78%"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".65" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
<circle cx="200" cy="240" r="172" fill="#fff" opacity=".22"/>
<rect class="rail" x="70" y="25" width="260" height="10" rx="5"/>
<path class="wall-shadow" transform="translate(10 12)" d="{HOOD_OUT}"/><path class="wall-shadow" transform="translate(10 12)" d="{BODY}"/>
<path class="ck-shade" d="{HOOD_OUT}"/><path fill="url(#a-tw)" d="{HOOD_OUT}"/><rect width="400" height="500" filter="url(#a-gr)" clip-path="url(#a-hc)"/>
<path class="ck-lining" d="{HOOD_RIM}"/>{fur_fill}<path class="ck-lining" d="{HOOD_DEEP}"/><path fill="url(#a-in)" d="{HOOD_DEEP}"/>
<path class="ck-body" d="{BODY}"/><path fill="url(#a-tw)" d="{BODY}"/><rect width="400" height="500" filter="url(#a-gr)" clip-path="url(#a-cl)"/><path fill="url(#a-lt)" d="{BODY}"/>
<path class="ck-line" d="M154,166 C170,176 230,176 246,166"/>
{folds}<path class="ck-edge" d="M200,176 C201,260 201,370 202,468"/>{btns}
<circle class="peg" cx="200" cy="39" r="9"/><path class="ck-line" d="M193,52 C194,42 206,42 207,52"/>
</svg>'''


def fabric_tile(label, buttons, lining):
    btn = ('<circle class="ck-btn" cx="170" cy="118" r="15"/><g class="ck-hole"><circle cx="165" cy="113" r="2.2"/>'
           '<circle cx="175" cy="113" r="2.2"/><circle cx="165" cy="123" r="2.2"/><circle cx="175" cy="123" r="2.2"/></g>') if buttons else ""
    turn = "M236,300 C268,236 322,196 400,178 L400,300 Z"
    fur = FUR.format(p="f") if lining else ""
    lining_turn = (f'<path class="wall-shadow" transform="translate(-8 -4)" d="{turn}"/><path class="ck-lining" d="{turn}"/>'
                   f'<path fill="url(#f-fur)" d="{turn}"/><path class="ck-line" d="M236,300 C268,236 322,196 400,178"/>') if lining else ""
    return f'''<svg viewBox="0 0 400 300" role="img" aria-label="{e(label)}" preserveAspectRatio="xMidYMid slice">
<defs><pattern id="f-tw" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><rect width="4.5" height="11" fill="#000" opacity=".08"/></pattern>{fur}{grain_defs("f", ".75", ".3")}<linearGradient id="f-lt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
<rect class="ck-body" width="400" height="300"/><rect fill="url(#f-tw)" width="400" height="300"/><rect width="400" height="300" filter="url(#f-gr)"/>
<path class="ck-shade" opacity=".55" d="M0,236 C90,206 170,250 260,226 L260,300 L0,300 Z"/><path class="ck-fold" d="M0,236 C90,206 170,250 260,226"/>
<rect fill="url(#f-lt)" width="400" height="300"/>{btn}{lining_turn}
</svg>'''


def hood_tile(label, lining):
    outer = "M58,330 C34,160 112,28 200,28 C288,28 366,160 342,330 Z"
    rim = "M104,330 C92,190 146,96 200,96 C254,96 308,190 296,330 Z"
    deep = "M138,330 C130,210 164,142 200,142 C236,142 270,210 262,330 Z"
    fur = FUR.format(p="h") if lining else ""
    fur_fill = f'<path fill="url(#h-fur)" d="{rim}"/>' if lining else ""
    return f'''<svg viewBox="0 0 400 300" role="img" aria-label="{e(label)}" preserveAspectRatio="xMidYMid slice">
<defs>{fur}{grain_defs("h")}<clipPath id="h-cl"><path d="{outer}"/></clipPath><radialGradient id="h-in" cx="50%" cy="15%" r="95%"><stop offset="0" stop-color="#1c1712" stop-opacity=".62"/><stop offset="1" stop-color="#1c1712" stop-opacity=".2"/></radialGradient></defs>
<rect class="tile-bg" width="400" height="300"/>
<path class="wall-shadow" transform="translate(9 9)" d="{outer}"/>
<path class="ck-shade" d="{outer}"/><rect width="400" height="300" filter="url(#h-gr)" clip-path="url(#h-cl)"/>
<path class="ck-lining" d="{rim}"/>{fur_fill}<path class="ck-lining" d="{deep}"/><path fill="url(#h-in)" d="{deep}"/>
</svg>'''


ART_CSS = """
/* Designed fallback art (inline SVG) */
.art .rail{fill:var(--wood)}.art .peg{fill:var(--wood-2)}
.wall-shadow{fill:#5a4630;opacity:.1}
.ck-body{fill:var(--cloak)}.ck-shade{fill:var(--cloak-shade)}.ck-lining{fill:var(--lining)}
.ck-fold{fill:none;stroke:var(--cloak-deep);stroke-width:2.2;stroke-linecap:round;opacity:.45}
.ck-edge{fill:none;stroke:var(--cloak-deep);stroke-width:2.6;stroke-linecap:round;opacity:.8}
.ck-line{fill:none;stroke:var(--cloak-deep);stroke-width:2;stroke-linecap:round;opacity:.6}
.ck-btn{fill:var(--cloak-deep)}.ck-hole{fill:var(--cloak)}.ck-deep{fill:var(--cloak-deep)}
.tile-bg{fill:#e6dbcb}
"""


# --------------------------------------------------------------------------- page parts

def head_html(S, title, desc, path, noindex=False, og_image=None, root=""):
    cfg = S["cfg"]
    out = ['<!doctype html>', '<html lang="en-US">', '<head>', '<meta charset="utf-8">',
           '<meta name="viewport" content="width=device-width,initial-scale=1">', f"<title>{e(title)}</title>"]
    if desc:
        out.append(f'<meta name="description" content="{e(desc)}">')
    if noindex or not S["live"]:
        out.append('<meta name="robots" content="noindex,nofollow">')
    # Sharing tags. Title, description and card go on even without a domain; only og:url
    # and og:image need absolute URLs, so they wait for the domain.
    big = bool(og_image and S["domain"])
    out += [f'<meta property="og:type" content="{"product" if path == "" else "website"}">',
            f'<meta property="og:site_name" content="{e(S["brand"])}">',
            f'<meta property="og:title" content="{e(title)}">']
    if desc:
        out.append(f'<meta property="og:description" content="{e(desc)}">')
    if S["domain"]:
        url = f"https://{S['domain']}/{path}"
        out.append(f'<link rel="canonical" href="{e(url)}">')
        out.append(f'<meta property="og:url" content="{e(url)}">')
        if og_image:
            img_url = f"https://{S['domain']}/{og_image['out']}"
            out.append(f'<meta property="og:image" content="{e(img_url)}">')
            if og_image.get("w"):
                out.append(f'<meta property="og:image:width" content="{og_image["w"]}"><meta property="og:image:height" content="{og_image["h"]}">')
            out.append(f'<meta property="og:image:alt" content="{e(og_image["alt"])}">')
    out += [f'<meta name="twitter:card" content="{"summary_large_image" if big else "summary"}">',
            f'<meta name="twitter:title" content="{e(title)}">']
    if desc:
        out.append(f'<meta name="twitter:description" content="{e(desc)}">')
    out += ['<meta name="theme-color" content="#f5f1ea">',
            f'<link rel="icon" href="{root}favicon.svg" type="image/svg+xml">'] + (
           [f'<link rel="apple-touch-icon" href="{root}apple-touch-icon.png">'] if os.path.exists(TOUCH_ICON) else []) + [
            '<link rel="preconnect" href="https://fonts.googleapis.com">',
            '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
            f'<link rel="stylesheet" href="{FONTS_URL}">',
            f'<link rel="stylesheet" href="{root}style.css">']
    pid = (cfg.get("meta_pixel_id") or "").strip()
    if pid:
        out.append("<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?"
                   "n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;"
                   "n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;"
                   "s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',"
                   f"'https://connect.facebook.net/en_US/fbevents.js');fbq('init','{pid}');fbq('track','PageView');</script>")
    gid = (cfg.get("ga4_id") or "").strip()
    if gid:
        out.append(f'<script async src="https://www.googletagmanager.com/gtag/js?id={gid}"></script>'
                   "<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}"
                   f"gtag('js',new Date());gtag('config','{gid}');</script>")
    out.append("</head>")
    return "\n".join(out)


def header_html(S, nav, root=""):
    links = "".join(f'<a href="{e(h)}">{e(t)}</a>' for h, t in nav)
    banner = ""
    if S["tokens"]["UNVERIFIED"]:
        banner = f'<p class="preview-banner" role="note">{ui(S, S["cfg"]["ui"]["preview_banner"], "ui.preview_banner")}</p>\n'
    return (f'{banner}<a class="skip" href="#main">Skip to content</a>\n<header class="top"><div class="wrap bar">'
            f'<a class="brand" href="{root or "./"}">{icon("hood")}<span>{e(S["brand"])}</span></a>'
            f'<nav aria-label="Site">{links}</nav></div></header>')


def footer_html(S, P, root=""):
    parts = [p.strip() for p in P["footer"].split(" \u00b7 ")]
    text, links, email = [], [], ""
    for p in parts:
        if "\x00" in p or not p:
            continue
        if SENT_EMAIL in p:
            email = inline(p)
            continue
        if p in FOOTER_LINKS:
            links.append(f'<a href="{root}policies.html#{FOOTER_LINKS[p]}">{e(p)}</a>')
            continue
        if p == S["tokens"]["LEGAL_BUSINESS_NAME"] and S["flags"]["config.dba"]:
            p = f"{p}, trading as {S['brand']}"
        text.append(inline(p))
    if not any('#contact"' in x for x in links) and email:
        links.append(f'<a href="{root}policies.html#contact">Contact</a>')
    usd = [t for t in text if "USD" in t]
    text = [t for t in text if "USD" not in t]
    adult = ui(S, S["cfg"]["ui"]["footer_adult"], "ui.footer_adult")
    year = S["today"].year
    rows = [f'<a class="brand" href="{root or "./"}">{icon("hood")}<span>{e(S["brand"])}</span></a>',
            f"<p>{' &middot; '.join(text)}</p>"]
    if email:
        rows.append(f"<p>{email}</p>")
    rows.append(f'<nav aria-label="Policies">{"".join(links)}</nav>')
    if usd:
        rows.append(f"<p>{' &middot; '.join(usd)}</p>")
    if adult:
        rows.append(f'<p class="adult">{adult}</p>')
    rows.append(f"<p>&copy; {year} {e(S['tokens']['LEGAL_BUSINESS_NAME'])}</p>")
    return '<footer class="foot"><div class="wrap">' + "\n".join(rows) + "</div></footer>"


def safety_html(P, heading_level=2):
    items = "".join(f"<li>{inline(x)}</li>" for x in P["safety_items"])
    return (f'<aside class="safety" id="safety" data-check="safety" aria-labelledby="safety-h">'
            f'<h{heading_level} id="safety-h">{inline(P["safety_title"])}</h{heading_level}><ul>{items}</ul></aside>')


def size_table_html(S):
    rows = S["size_rows"]
    has_len = any(r.get("length") for r in rows)
    head = "<tr><th scope=\"col\">Size</th><th scope=\"col\">Your height</th>" + ("<th scope=\"col\">Length</th>" if has_len else "") + "</tr>"
    body = "".join(f"<tr><th scope=\"row\">{e(r.get('size', ''))}</th><td>{e(smarten(str(r.get('height', ''))))}</td>"
                   + (f"<td>{e(r.get('length', ''))}</td>" if has_len else "") + "</tr>" for r in rows)
    return f'<div class="table-wrap"><table class="size-table">{head}{body}</table></div>'


def link_xrefs(fragment, faq_ids):
    """Turn copy cross-references into links."""
    fragment = fragment.replace("Returns and refunds policy", '<a href="policies.html#returns">Returns and refunds policy</a>')
    fragment = fragment.replace("Safety notes below", '<a href="#safety">Safety notes below</a>')

    def q(m):
        target = anchor(m.group(1))
        if target in faq_ids:
            return f'<a href="#faq-{target}">\u201c{m.group(1)}\u201d</a> below'
        return m.group(0)
    return re.sub(r"\u201c([^\u201d<]{3,60})\u201d below", q, fragment)


# --------------------------------------------------------------------------- copy parsing

def parse_product_copy(S, md, compliance_text, rep):
    ctx, hol = S["ctx"], S["hol_attr"]
    secs = split_sections(md)
    P = {}

    def rendered(prefix):
        title, raw = section(secs, prefix, "product-page.md")
        return render_text(strip_editor(raw), ctx, f"product-page.md ## {title}")

    kv = kv_items(md_blocks(rendered("page title")))
    P["title"] = plain(kv.get("Title tag", S["product_name"]))
    P["meta"] = plain(kv.get("Meta description", ""))

    heads = [b for b in md_blocks(rendered("headline")) if b[0] == "ol"]
    options = heads[0][1] if heads else []
    n = int(S["cfg"].get("headline_option", 1))
    if not 1 <= n <= len(options):
        raise BuildError(f"config: headline_option {n} is not one of the {len(options)} options in product-page.md")
    m = re.search(r"\*\*(.+?)\*\*", options[n - 1])
    P["headline"] = m.group(1) if m else options[n - 1]

    sub = [b for b in md_blocks(rendered("subhead")) if b[0] == "p"]
    P["subhead"] = " ".join(sub[0][1]) if sub else ""

    P["buy"] = kv_items(md_blocks(rendered("buy box")))
    for k in ("Product line", "Price", "Delivery", "Button"):
        if k not in P["buy"]:
            raise BuildError(f"product-page.md Buy box: '{k}' line not found")

    P["benefits"] = []
    for b in md_blocks(rendered("benefits")):
        if b[0] == "ul":
            for it in b[1]:
                mm = re.match(r"^\*\*(.+?)\*\*\s*(.*)$", it)
                P["benefits"].append((mm.group(1), mm.group(2)) if mm else ("", it))
    if len(P["benefits"]) < 4:
        rep.warn(f"Only {len(P['benefits'])} benefit bullets are showing (copy note: keep at least 4).")

    P["what"] = md_blocks(rendered("what it is"))
    P["materials"] = md_blocks(rendered("materials"))
    P["sizing"] = md_blocks(rendered("sizing"))

    faq_text = rendered("faq")
    items, cur = [], None
    for line in faq_text.split("\n"):
        mm = re.match(r"^\*\*(\d+)\.\s+(.+?)\*\*\s*$", line.strip())
        if mm:
            cur = {"q": mm.group(2), "lines": []}
            items.append(cur)
        elif cur is not None:
            cur["lines"].append(line)
    P["faq"] = []
    for it in items:
        blocks = md_blocks("\n".join(it["lines"]))
        if blocks:
            P["faq"].append({"q": it["q"], "id": anchor(plain(it["q"])), "html": blocks_html(blocks, hol)})

    title, raw = section(secs, "safety", "product-page.md")
    sm = re.search(r"<!--\s*SAFETY-BLOCK:START.*?-->(.*?)<!--\s*SAFETY-BLOCK:END\s*-->", raw, re.S)
    if not sm:
        raise BuildError("product-page.md: Safety block markers not found")
    raw_lines = [ln.strip() for ln in sm.group(1).strip().split("\n") if ln.strip()]
    ref = load_safety_reference(compliance_text)
    copy_items = [ln[2:].strip() for ln in raw_lines if ln.startswith("- ") and "{{" not in ln]
    if ref is None:
        rep.warn("compliance.md: could not find the Safety block to compare against")
    elif [normalise(x) for x in copy_items] != [normalise(x) for x in ref]:
        rep.err("Safety block in product-page.md differs from compliance.md section 5; it must be copied exactly.")
    safety = md_blocks(render_text("\n".join(raw_lines), ctx, "Safety block"))
    P["safety_title"] = "Safety"
    P["safety_items"] = []
    for b in safety:
        if b[0] == "p":
            P["safety_title"] = plain(b[1][0]) or "Safety"
        elif b[0] == "ul":
            P["safety_items"] += b[1]

    atitle, araw = section(secs, "about", "product-page.md")
    P["about_title"] = drop_missing(render_text(atitle, ctx, "About heading"))
    P["about"] = md_blocks(render_text(strip_editor(araw), ctx, f"product-page.md ## {atitle}"))
    P["reviews"] = md_blocks(rendered("reviews"))

    tf = kv_items(md_blocks(rendered("trust strip")))
    trust_key = next((k for k in tf if k.lower().startswith("trust strip")), None)
    P["trust"] = [x.strip() for x in drop_missing(tf.get(trust_key, "")).split(" \u00b7 ") if x.strip()] if trust_key else []
    P["footer"] = tf.get("Footer", "")

    ck_title, ck_raw = section(secs, "checkout", "product-page.md")
    P["checkout"] = kv_items(md_blocks(render_text(strip_editor(ck_raw), ctx, "Checkout text")))
    return P


def parse_policies(S, md, rep):
    ctx = S["ctx"]
    secs = split_sections(md)
    out = []
    for key, (title, raw) in secs.items():
        pid = POLICY_IDS.get(key)
        if not pid:
            continue
        text = render_text(strip_editor(raw), ctx, f"policies.md ## {title}")
        legal = S["tokens"]["LEGAL_BUSINESS_NAME"]
        if legal == S["brand"]:
            text = text.replace(f'{legal} ("{legal}", "we")', f'{legal} ("we")')
        blocks = md_blocks(text)
        if pid == "privacy" and (S["cfg"].get("ga4_id") or "").strip():
            extra = drop_missing(render_text(S["cfg"]["privacy_extra"]["ga4"], ctx, "privacy_extra.ga4"))
            for b in blocks:
                if b[0] == "ul" and any("Vercel" in x for x in b[1]):
                    idx = next(i for i, x in enumerate(b[1]) if "Vercel" in x)
                    b[1].insert(idx + 1, extra)
                    break
            else:
                rep.err("GA4 is on but the Privacy section has no sharing list to add Google Analytics to.")
        out.append({"id": pid, "title": title, "html": blocks_html(blocks, S["hol_attr"])})
    if len(out) < 5:
        rep.err("policies.md: expected Shipping, Returns and refunds, Contact, Privacy and Terms of sale sections")
    return out


# --------------------------------------------------------------------------- pages

def json_script(obj, id_=None, typ="application/json"):
    s = json.dumps(obj, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    ida = f' id="{id_}"' if id_ else ""
    return f'<script type="{typ}"{ida}>{s}</script>'


def product_ld(S, P, imgs):
    cfg, t = S["cfg"], S["tokens"]
    offer = {"@type": "Offer", "price": f"{float(cfg['price']):.2f}", "priceCurrency": cfg["currency"],
             "itemCondition": "https://schema.org/NewCondition"}
    if cfg.get("payment_link"):
        offer["availability"] = "https://schema.org/InStock"
    if S["domain"]:
        offer["url"] = f"https://{S['domain']}/"
    ship = {"@type": "OfferShippingDetails",
            "shippingRate": {"@type": "MonetaryAmount", "value": "0", "currency": cfg["currency"]},
            "shippingDestination": {"@type": "DefinedRegion", "addressCountry": "US"}}
    win = [re.findall(r"\d+", t["SHIP_WINDOW"]), re.findall(r"\d+", t["ARRIVAL_WINDOW"])]
    if len(win[0]) == 2 and len(win[1]) == 2:
        s_lo, s_hi, a_lo, a_hi = int(win[0][0]), int(win[0][1]), int(win[1][0]), int(win[1][1])
        ship["deliveryTime"] = {
            "@type": "ShippingDeliveryTime",
            "businessDays": {"@type": "OpeningHoursSpecification",
                             "dayOfWeek": ["https://schema.org/" + d for d in ("Monday", "Tuesday", "Wednesday", "Thursday", "Friday")]},
            "handlingTime": {"@type": "QuantitativeValue", "minValue": s_lo, "maxValue": s_hi, "unitCode": "DAY"},
            "transitTime": {"@type": "QuantitativeValue", "minValue": max(1, a_lo - s_lo), "maxValue": max(1, a_hi - s_hi), "unitCode": "DAY"}}
    offer["shippingDetails"] = ship
    offer["hasMerchantReturnPolicy"] = {
        "@type": "MerchantReturnPolicy", "applicableCountry": "US",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": int(cfg.get("returns_window_days", 30)),
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/ReturnFeesCustomerResponsibility"}
    ld = {"@context": "https://schema.org", "@type": "Product", "name": S["product_name"],
          "description": P["meta"], "brand": {"@type": "Brand", "name": S["brand"]},
          "sku": f"{S['bslug']}-cloak", "color": ", ".join(c["name"] for c in S["colors"]), "offers": offer}
    if t["FIBER_OUTER"]:
        ld["material"] = t["FIBER_OUTER"]
    if S["domain"] and imgs["hero"]:
        ld["image"] = [f"https://{S['domain']}/{i['out']}" for i in [imgs["hero"]] + imgs["detail"]]
    return ld


def img_tag(img, cls="", lazy=True, extra=""):
    wh = f' width="{img["w"]}" height="{img["h"]}"' if img.get("w") else ""
    load = ' loading="lazy" decoding="async"' if lazy else ' fetchpriority="high" decoding="async"'
    c = f' class="{cls}"' if cls else ""
    return f'<img src="{e(img["out"])}" alt="{e(img["alt"])}"{wh}{load}{c}{extra}>'


def index_html(S, P, app_js):
    cfg, t, imgs, hol = S["cfg"], S["tokens"], S["imgs"], S["hol_attr"]
    U = cfg["ui"]
    shown = S["shown"]
    first = S["colors"][0]
    style = (f'--cloak:{first["hex"]};--cloak-shade:{mix(first["hex"], "#000000", .22)};'
             f'--cloak-deep:{mix(first["hex"], "#000000", .42)}' +
             ("" if shown["faux_fur_lining"] else f';--lining:{mix(first["hex"], "#ffffff", .18)}'))

    # Gallery
    if imgs["hero"]:
        thumbs = ""
        gallery_imgs = [imgs["hero"]] + imgs["detail"]
        if len(gallery_imgs) > 1:
            btns = "".join(
                f'<button type="button" data-thumb data-src="{e(g["out"])}" data-alt="{e(g["alt"])}" '
                f'aria-current="{"true" if i == 0 else "false"}">{img_tag(g)}</button>'
                for i, g in enumerate(gallery_imgs))
            thumbs = f'<div class="thumbs" role="group" aria-label="More photos">{btns}</div>'
        hero_img = img_tag(imgs["hero"], lazy=False, extra=' id="stage-img"')
        gallery = f'<div class="stage">{hero_img}</div>{thumbs}'
    else:
        gallery = (f'<div class="stage">{cloak_art(ui_plain(S, U["art_label"], "ui.art_label"), shown["buttons"], shown["faux_fur_lining"])}'
                   f'<span class="chip">{ui(S, U["art_chip"], "ui.art_chip")}</span></div>'
                   f'<div class="tiles"><figure class="tile">{fabric_tile(ui_plain(S, U["tile_fabric_label"], "ui"), shown["buttons"], shown["faux_fur_lining"])}</figure>'
                   f'<figure class="tile">{hood_tile(ui_plain(S, U["tile_hood_label"], "ui"), shown["faux_fur_lining"])}</figure></div>')

    # Buy box
    pm = re.match(r"^(\$[\d,.]+)\s*(.*)$", plain(P["buy"]["Price"]))
    amt, cur = (pm.group(1), pm.group(2)) if pm else (t["PRICE"], "")
    color_label = U["color_label"]
    size_key = next((k for k in P["buy"] if k.lower().startswith("size")), "Size")
    heights = {str(r.get("size")): str(r.get("height", "")) for r in S["size_rows"]} if shown["size_chart"] else {}
    swatches = "".join(
        f'<label class="choice"><input type="radio" name="color" value="{c["slug"]}" data-name="{e(c["name"])}" '
        f'data-hex="{c["hex"]}"{" checked" if i == 0 else ""}><span class="dot" style="--c:{c["hex"]}"></span>'
        f'<span class="sr">{e(c["name"])}</span></label>' for i, c in enumerate(S["colors"]))
    pills = "".join(
        f'<label class="choice"><input type="radio" name="size" value="{slug(s)}" data-name="{e(s)}">'
        f'<span class="pill">{e(smarten(s))}{f"<small>{e(smarten(heights[s]))}</small>" if heights.get(s) else ""}</span></label>'
        for s in S["sizes"])
    height_note = ui(S, U["height_note"], "ui.height_note") if not shown["size_chart"] else ""
    pay = (cfg.get("payment_link") or "").strip()
    buy_label = inline(P["buy"]["Button"])
    if pay:
        # app.js builds the real checkout URL (with colour and size) from product-data.
        btn_main = (f'<a class="btn" id="buy-main" href="#size-group" data-buy>{buy_label}</a>'
                    f'<noscript><p class="note">{ui(S, U["noscript"], "ui.noscript")}</p></noscript>')
        btn_bar = f'<a class="btn" href="#size-group" data-buy>{buy_label}</a>'
        note = ""
    else:
        dis = ui(S, U["buy_disabled"], "ui.buy_disabled")
        btn_main = f'<button class="btn" id="buy-main" type="button" disabled>{dis}</button>'
        btn_bar = f'<button class="btn" type="button" disabled>{dis}</button>'
        note = f'<p class="note">{ui(S, U["buy_disabled_note"], "ui")}</p>'
    under = P["buy"].get("Under the button", "")
    under = drop_missing(under) if under else ""
    summary_short = f'{e(first["name"])} &middot; {ui(S, U["choose_size"], "ui")}'
    summary0 = f'{summary_short} &middot; {ui(S, U["qty"], "ui")}'
    trust_icons = ["truck", "pin", "calendar", "chat"]
    trust = "".join(f"<li>{icon(trust_icons[i % 4])}<span>{inline(x)}</span></li>" for i, x in enumerate(P["trust"]))

    intro = (f'<div class="intro"><p class="eyebrow">{inline(P["buy"]["Product line"])}</p>'
             f'<h1>{inline(P["headline"])}</h1><p class="sub">{inline(P["subhead"])}</p></div>')
    purchase = f'''<div class="purchase" id="buy">
<p class="price"><span class="amt">{e(amt)}</span><span class="cur">{inline(cur)}</span></p>
<p class="ship">{icon("truck")}<span>{inline(P["buy"]["Delivery"])}</span></p>
<fieldset class="opt" id="color-group"><legend>{e(color_label)}: <span class="val" id="color-name">{e(first["name"])}</span></legend><div class="choices">{swatches}</div></fieldset>
<fieldset class="opt" id="size-group"><legend>{inline(size_key)} <span class="val" id="size-name"></span><a href="#sizing">{ui(S, U["size_help"], "ui")}</a></legend><div class="choices">{pills}</div>{f'<p class="hint">{height_note}</p>' if height_note else ""}</fieldset>
<p class="summary" data-summary aria-live="polite">{summary0}</p>
<p class="err" id="size-err" role="alert" hidden>{ui(S, U["size_first"], "ui")}</p>
{btn_main}
{note}
{f'<p class="under">{inline(under)}</p>' if under.strip() else ""}
<ul class="trust">{trust}</ul>
</div>'''

    # Sections
    benefits = "".join(f"<li><h3>{inline(a)}</h3><p>{inline(b)}</p></li>" for a, b in P["benefits"])
    moments = "".join(f"<li>{icon(n)}<span>{ui(S, m, 'ui.moments')}</span></li>"
                      for n, m in zip(("couch", "desk", "book", "mug"), U["moments"]))
    what = blocks_html(P["what"], hol)
    lifestyle = ""
    if imgs["lifestyle"]:
        figs = "".join(f'<figure class="tile">{img_tag(i)}</figure>' for i in imgs["lifestyle"][:3])
        lifestyle = f'<section class="sec sand" aria-label="Photos"><div class="wrap"><div class="tiles life">{figs}</div></div></section>'

    # Materials: first list becomes a fact table, '**Care**' becomes a heading.
    mat_html = []
    for b in P["materials"]:
        if b[0] == "ul" and not any("<dl" in x for x in mat_html):
            rows = []
            for it in b[1]:
                mm = re.match(r"^\*\*(.+?):\*\*\s*(.*)$", it)
                if mm:
                    rows.append(f"<dt>{inline(mm.group(1))}</dt><dd>{inline(mm.group(2), hol)}</dd>")
            mat_html.append(f'<dl class="facts">{"".join(rows)}</dl>')
        elif b[0] == "p" and len(b[1]) == 1 and re.fullmatch(r"\*\*(.+)\*\*", b[1][0].strip()):
            mat_html.append(f"<h3>{inline(b[1][0].strip()[2:-2])}</h3>")
        else:
            mat_html.append(blocks_html([b], hol))
    sizing = blocks_html(P["sizing"], hol)
    if SENT_TABLE in sizing:
        tbl = size_table_html(S) if S["size_rows"] else ""
        if imgs["size_chart"] and shown["size_chart"]:
            tbl += img_tag(imgs["size_chart"])
        sizing = sizing.replace(SENT_TABLE, tbl)
    faq_ids = {f["id"] for f in P["faq"]}
    sizing = link_xrefs(sizing, faq_ids)
    faq = "".join(f'<details id="faq-{f["id"]}"><summary>{inline(f["q"])}</summary><div class="ans">{link_xrefs(f["html"], faq_ids)}</div></details>'
                  for f in P["faq"])
    about = blocks_html(P["about"], hol)
    real_reviews = [r for r in (cfg.get("reviews") or []) if str(r.get("text", "")).strip()]
    reviews = ""
    if real_reviews:
        def when(r):
            try:
                d = dt.date.fromisoformat(str(r.get("date", "")))
                return f", {d:%B} {d.day}, {d.year}"
            except ValueError:
                return ""
        quotes = "".join(
            f'<blockquote><p>{inline(str(r["text"]).strip())}</p><footer>{e(str(r.get("name", "")).strip())}'
            f'{when(r)}</footer></blockquote>' for r in real_reviews)
        reviews = f'<div class="reviews"><h2>{ui(S, U["headings"]["reviews"], "ui")}</h2>{blocks_html(P["reviews"], hol)}{quotes}</div>'

    H = U["headings"]
    cta_line = f"{e(amt)} {inline(cur)}" + (f" &middot; {inline(under.split(' · ')[0])}" if under.strip() else "")

    pdata = {"paymentLink": pay, "price": float(cfg["price"]), "currency": cfg["currency"],
             "contentId": f"{S['bslug']}-cloak", "name": S["product_name"], "artMode": not imgs["hero"],
             "liningShown": shown["faux_fur_lining"],
             "tracking": bool((cfg.get("meta_pixel_id") or "").strip() or (cfg.get("ga4_id") or "").strip()),
             "text": {"chooseSize": ui_plain(S, U["choose_size"], "ui"), "qty": ui_plain(S, U["qty"], "ui")}}
    nav = [(h, ui_plain(S, x, "ui.nav")) for h, x in U["nav"]]
    body = f'''{header_html(S, nav)}
<main id="main">
<section class="hero" style="{style}" aria-label="{e(S["product_name"])}"><div class="wrap hero-grid">
{intro}
<div class="gallery">{gallery}</div>
{purchase}
</div></section>

<section class="sec alt" id="details" aria-labelledby="details-h"><div class="wrap split">
<div class="split-head"><h2 id="details-h">{ui(S, H["benefits"], "ui")}</h2></div>
<ul class="benefits">{benefits}</ul>
</div></section>

<section class="sec" id="what" aria-labelledby="what-h"><div class="wrap what">
<div class="prose"><h2 id="what-h">{ui(S, H["what_it_is"], "ui")}</h2>{what}</div>
<ul class="moments">{moments}</ul>
</div></section>
{lifestyle}
<section class="sec sand" id="materials"><div class="wrap cards">
<div class="card"><h2>{ui(S, H["materials"], "ui")}</h2>{"".join(mat_html)}</div>
<div class="card" id="sizing"><h2>{ui(S, H["sizing"], "ui")}</h2>{sizing}</div>
</div></section>

<section class="sec" id="faq" aria-labelledby="faq-h"><div class="wrap">
<div class="faq-wrap faq"><h2 id="faq-h">{ui(S, H["faq"], "ui")}</h2>{faq}</div>
{safety_html(P)}
</div></section>

<section class="sec alt" id="about" aria-labelledby="about-h"><div class="wrap about{"" if reviews else " solo"}">
<div class="prose"><h2 id="about-h">{inline(P["about_title"])}</h2>{about}</div>
{reviews}
</div></section>

<section class="cta" aria-labelledby="cta-h"><div class="wrap">
<h2 id="cta-h">{inline(P["headline"])}</h2>
<p>{cta_line}</p>
<a class="btn ghost" href="#buy">{ui(S, U["cta_button"], "ui")}</a>
</div></section>
</main>
{footer_html(S, P)}
<div class="buybar" role="region" aria-label="Quick buy"><div class="bb-text"><span class="bb-price">{e(amt)}</span><span class="bb-sel" data-summary="short">{summary_short}</span></div>{btn_bar}</div>
{json_script(pdata, "product-data")}
<script>{app_js}</script>'''
    og = imgs["hero"]
    ld = json_script(product_ld(S, P, imgs), typ="application/ld+json")
    head = head_html(S, P["title"], P["meta"], "", og_image=og)
    head = head.replace("</head>", f"<style>{ART_CSS.strip()}</style>\n{ld}\n</head>")
    return f"{head}\n<body>\n{body}\n</body>\n</html>\n"


def policies_html(S, P, pol):
    U = S["cfg"]["ui"]
    H = U["headings"]
    toc = "".join(f'<li><a href="#{p["id"]}">{e(p["title"])}</a></li>' for p in pol)
    legal_attr = ' data-check="legal"'
    secs = "".join(
        f'<section id="{p["id"]}" aria-labelledby="{p["id"]}-h"{legal_attr if p["id"] in LEGAL_SECTIONS else ""}>'
        f'<h2 id="{p["id"]}-h">{e(p["title"])}</h2>{p["html"]}</section>' for p in pol)
    title = f"{ui_plain(S, H['policies_title'], 'ui')} | {S['brand']}"
    desc = ui_plain(S, H["policies_intro"], "ui")
    nav = [("./", "Shop")]
    body = f'''{header_html(S, nav)}
<main id="main">
<div class="wrap page-head"><h1>{ui(S, H["policies_title"], "ui")}</h1><p>{ui(S, H["policies_intro"], "ui")}</p></div>
<div class="wrap policy-grid">
<nav class="toc" aria-label="On this page"><ul>{toc}</ul></nav>
<div class="policy">{secs}</div>
</div>
</main>
{footer_html(S, P)}'''
    return f"{head_html(S, title, desc, 'policies.html')}\n<body>\n{body}\n</body>\n</html>\n"


def thank_you_html(S, P):
    cfg = S["cfg"]
    T = cfg["ui"]["thank_you"]
    steps = [ui(S, x, "ui.thank_you.steps") for x in T["steps"]]
    steps = "".join(f"<li>{x}</li>" for x in steps if x)
    statement = ui(S, T["statement"], "ui.thank_you.statement")
    helpline = ui(S, T["help"], "ui.thank_you.help")
    data = {"price": float(cfg["price"]), "currency": cfg["currency"], "contentId": f"{S['bslug']}-cloak",
            "name": S["product_name"]}
    tracking = bool((cfg.get("meta_pixel_id") or "").strip() or (cfg.get("ga4_id") or "").strip())
    js = ""
    if tracking:
        js = (json_script(data, "order-data") + "<script>(function(){var D=JSON.parse(document.getElementById('order-data').textContent);"
              "var sid=new URLSearchParams(location.search).get('session_id');if(!sid)return;var k='purchase_'+sid;"
              "try{if(localStorage.getItem(k))return;localStorage.setItem(k,'1')}catch(e){}"
              "try{if(window.fbq)fbq('track','Purchase',{value:D.price,currency:D.currency,content_ids:[D.contentId],"
              "content_type:'product',num_items:1},{eventID:sid})}catch(e){}"
              "try{if(window.gtag)gtag('event','purchase',{transaction_id:sid,value:D.price,currency:D.currency,"
              "items:[{item_id:D.contentId,item_name:D.name,price:D.price,quantity:1}]})}catch(e){}})();</script>")
    body = f'''{header_html(S, [("./", "Shop")])}
<main id="main" class="simple"><div class="wrap"><div class="inner">
<h1>{ui(S, T["title"], "ui.thank_you.title")}</h1>
<p class="lede">{ui(S, T["lede"], "ui.thank_you.lede")}</p>
<h2>{ui(S, T["next_heading"], "ui")}</h2>
<ol>{steps}</ol>
{f"<p>{statement}</p>" if statement else ""}
{f"<p>{helpline}</p>" if helpline else ""}
{safety_html(P)}
<div class="links"><a href="./">{ui(S, cfg["ui"]["back_to_shop"], "ui")}</a><a href="policies.html">{ui(S, T["policies_link"], "ui")}</a></div>
</div></div></main>
{footer_html(S, P)}
{js}'''
    return f"{head_html(S, 'Thank you | ' + S['brand'], '', 'thank-you.html', noindex=True)}\n<body>\n{body}\n</body>\n</html>\n"


def not_found_html(S, P):
    N = S["cfg"]["ui"]["not_found"]
    body = f'''{header_html(S, [("/", "Shop")], root="/")}
<main id="main" class="simple"><div class="wrap"><div class="inner">
<h1>{ui(S, N["title"], "ui.not_found")}</h1>
<p class="lede">{ui(S, N["lede"], "ui.not_found")}</p>
<div class="links"><a class="btn" style="width:auto;display:inline-flex" href="/">{ui(S, S["cfg"]["ui"]["back_to_shop"], "ui")}</a></div>
</div></div></main>
{footer_html(S, P, root="/")}'''
    return f"{head_html(S, 'Page not found | ' + S['brand'], '', '404.html', noindex=True, root='/')}\n<body>\n{body}\n</body>\n</html>\n"


def favicon_svg():
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#f5f1ea"/>'
            '<path d="M7 27C6 16 10.5 6 16 6s10 10 9 21" fill="none" stroke="#8b5a3c" stroke-width="2.6" stroke-linecap="round"/>'
            '<path d="M11.5 27c0-7.5 2-13.5 4.5-13.5s4.5 6 4.5 13.5" fill="none" stroke="#55603f" stroke-width="2.6" stroke-linecap="round"/></svg>\n')


def robots_txt(S):
    if not S["live"]:
        return "# Not launched yet (config.launch_live is false): keep every page out of search.\nUser-agent: *\nDisallow: /\n"
    out = "User-agent: *\nDisallow: /thank-you.html\nAllow: /\n"
    if S["domain"]:
        out += f"\nSitemap: https://{S['domain']}/sitemap.xml\n"
    return out


def sitemap_xml(S):
    urls = ""
    if S["domain"] and S["live"]:
        urls = "".join(f"  <url><loc>https://{S['domain']}/{p}</loc></url>\n" for p in ("", "policies.html"))
    return f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n'


def vercel_json(S):
    headers = [{"key": "X-Content-Type-Options", "value": "nosniff"},
               {"key": "Referrer-Policy", "value": "strict-origin-when-cross-origin"},
               {"key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()"}]
    if not S["live"]:
        headers.append({"key": "X-Robots-Tag", "value": "noindex, nofollow"})
    rules = [{"source": "/(.*)", "headers": headers},
             {"source": "/thank-you.html", "headers": [{"key": "X-Robots-Tag", "value": "noindex, nofollow"}]}]
    return json.dumps({"cleanUrls": False, "trailingSlash": False, "headers": rules}, indent=2) + "\n"


# --------------------------------------------------------------------------- checks

class Grab(HTMLParser):
    VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
    BLOCK = {"p", "li", "h1", "h2", "h3", "h4", "h5", "h6", "dt", "dd", "summary", "td", "th", "title", "div",
             "section", "header", "footer", "main", "nav", "ul", "ol", "dl", "table", "tr", "label", "legend",
             "fieldset", "button", "figure", "figcaption", "details", "aside", "body", "head", "html", "a"}

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack, self.chunks, self.ld, self.buf, self.buf_mode = [], [], [], [], None

    def mode(self):
        return self.stack[-1][1] if self.stack else None

    def flush(self):
        text = "".join(self.buf).strip()
        if text and self.buf_mode not in ("skip", "ld"):
            self.chunks.append((self.buf_mode, text))
        self.buf = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cur = self.mode()
        m = cur
        if tag in ("script", "style"):
            m = "ld" if a.get("type") == "application/ld+json" else "skip"
        elif a.get("data-check") in ("safety", "legal") and cur not in ("skip",):
            m = a["data-check"]
        if tag in self.BLOCK or m != cur:
            self.flush()
        for k in ("alt", "aria-label", "title", "placeholder", "data-alt", "data-name"):
            if a.get(k) and m not in ("skip", "ld"):
                self.chunks.append((m, a[k]))
        if tag == "meta" and a.get("content") and (a.get("name") in ("description", "twitter:title", "twitter:description")
                                                    or (a.get("property") or "").startswith("og:")):
            self.chunks.append((None, a["content"]))
        if tag == "br":
            self.buf.append(" ")
        if tag not in self.VOID:
            self.stack.append((tag, m))
        self.buf_mode = self.mode()

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                if tag in self.BLOCK or self.stack[i][1] != (self.stack[i - 1][1] if i else None):
                    self.flush()
                del self.stack[i:]
                break
        self.buf_mode = self.mode()

    def handle_data(self, data):
        if self.mode() == "ld":
            self.ld.append(data)
        elif self.mode() != "skip":
            self.buf_mode = self.mode()
            self.buf.append(data)

    def close(self):
        super().close()
        self.flush()


def ld_strings(obj):
    if isinstance(obj, str):
        if not obj.startswith("http"):
            yield obj
    elif isinstance(obj, dict):
        for v in obj.values():
            yield from ld_strings(v)
    elif isinstance(obj, list):
        for v in obj:
            yield from ld_strings(v)


def check_pages(S, pages, banned, rep, img_names):
    regs = [(p, phrase_regex(p)) for p in banned]
    gated = {k: [re.compile(r"(?<![A-Za-z0-9])" + p + r"(?![A-Za-z0-9])", re.I) for p in v] for k, v in GATED_PHRASES.items()}
    stats = {}
    for name, doc in pages.items():
        if not name.endswith(".html"):
            continue
        g = Grab()
        g.feed(doc)
        g.close()
        chunks = list(g.chunks)
        for raw in g.ld:
            try:
                chunks += [(None, s) for s in ld_strings(json.loads(raw))]
            except ValueError:
                rep.err(f"{name}: JSON-LD is not valid JSON")
        n = 0
        for mode, text in chunks:
            if mode == "safety":
                continue
            n += 1
            t = normalise(text)
            for p, rx in regs:
                if rx.search(t):
                    msg = f"{name}: banned phrase '{p}' in: {t[:110]}"
                    (rep.warn if mode == "legal" else rep.err)(msg + (" (legal page: reported, not blocked)" if mode == "legal" else ""))
            for claim, rxs in gated.items():
                if S["shown"].get(claim):
                    continue
                for rx in rxs:
                    m = rx.search(t)
                    if m:
                        rep.err(f"{name}: '{m.group(0)}' needs claims.{claim}, which is not shown, in: {t[:100]}")
                        break
            if re.search(r"\b(lorem|ipsum|tbd|todo|xxx|placeholder)\b", t, re.I):
                rep.err(f"{name}: placeholder text in: {t[:100]}")
        stats[name] = n
        visible = re.sub(r"<(script|style)\b.*?</\1>", "", doc, flags=re.S)
        leak = re.search(r"[\x00-\x08\x0e\x0f]", doc) or re.search(r"\{\{|\}\}", visible)
        if leak:
            rep.err(f"{name}: an unrendered token or internal marker reached the page: {doc[max(0, leak.start() - 80):leak.end() + 40]!r}")
        for m in re.finditer(r"<img\b[^>]*>", doc):
            if not re.search(r'\balt="[^"]+"', m.group(0)):
                rep.err(f"{name}: an <img> has no alt text")
        if re.search(r'<img[^>]+src="(?:https?:)?//', doc):
            rep.err(f"{name}: an image is hotlinked from another site")
    for fn in img_names:
        words = re.sub(r"[-_.]", " ", fn)
        for p, rx in regs:
            if rx.search(words):
                rep.err(f"image file name '{fn}' contains banned '{p}'")
    return stats


def launch_checks(S, rep):
    cfg, shown = S["cfg"], S["shown"]
    out = []
    if not cfg.get("sample_checked"):
        out.append("sample_checked is false: finish the sample gate (claims-register.md section F).")
    for name, c in cfg["claims"].items():
        if name.startswith("_"):
            continue
        v = c.get("value")
        if v is None:
            out.append(f"claims.{name} is unset (null): set it after the sample, or false to leave it off.")
        elif v and c.get("verified") is not True:
            out.append(f"claims.{name} is on but not verified by the sample.")
    if not (cfg["claims"]["weight_lbs"].get("size_weighed") or "") and cfg["claims"]["weight_lbs"].get("value"):
        out.append("claims.weight_lbs.size_weighed is empty.")
    if cfg["claims"]["faux_fur_lining"].get("value") and not cfg["claims"]["faux_fur_lining"].get("fiber"):
        out.append("claims.faux_fur_lining.fiber (the lining label text) is empty.")
    for need in ("outer_fiber", "origin"):
        if not (cfg["claims"][need].get("value") and cfg["claims"][need].get("verified") is True):
            out.append(f"claims.{need} must be on and verified: fiber content and origin are required on the page.")
    for key, why in (("payment_link", "Stripe Payment Link"), ("support_email", "support email"),
                     ("legal_business_name", "legal business name"), ("domain", "domain"),
                     ("policy_date", "policy date")):
        if not (cfg.get(key) or "").strip():
            out.append(f"{key} is empty ({why}).")
    if not (cfg.get("stripe", {}).get("statement_descriptor") or "").strip():
        out.append("stripe.statement_descriptor is empty: copy it from a real test charge.")
    if not S["imgs"]["hero"]:
        out.append("No hero photo of our own sample (compliance blocker 2).")
    if S["imgs"]["unlogged"]:
        out.append("Images missing from image-sources.csv: " + ", ".join(S["imgs"]["unlogged"]))
    unconfirmed = [c["name"] for c in S["colors"] if not c["confirmed"]]
    if unconfirmed:
        out.append("Colours not confirmed against listing.json: " + ", ".join(unconfirmed))
    if S["size_from"] == "config.json" and not cfg.get("sizes_confirmed"):
        out.append("Sizes come from config.json, not listing.json: check them against the supplier's adult sizes, then set sizes_confirmed true.")
    if not shown["size_chart"] and not cfg.get("stripe", {}).get("height_field"):
        out.append("No size chart and no checkout height field: customers have no way to size.")
    prof = cfg["delivery"]["profiles"]["us_local" if shown["ships_from_us"] else "china_direct"]
    if not (prof.get("ship_window") and prof.get("arrival_window")):
        out.append("The delivery profile in use needs both ship_window and arrival_window (set from listing.json and the sample).")
    if not shown["ships_from_us"]:
        rep.warn("Delivery uses the China-direct windows: run no paid ads (economics.md section 7).")
    return out


def validate_config(cfg, rep):
    if cfg.get("compare_at") not in (None, "", 0):
        rep.err("compare_at must stay null: no compare-at, was, % off or MSRP prices (compliance.md section 4).")
    if cfg.get("currency") != "USD":
        rep.err("currency must be USD.")
    log = cfg.get("price_log") or []
    if not log or float(log[-1].get("price", -1)) != float(cfg["price"]):
        rep.err("price changed without a dated entry in price_log: add {date, price, note} for every change.")
    pay = (cfg.get("payment_link") or "").strip()
    if pay and not pay.startswith("https://"):
        rep.err("payment_link must be an https:// Stripe Payment Link.")
    elif pay and not pay.startswith("https://buy.stripe.com/"):
        rep.warn("payment_link is not a buy.stripe.com link; check it is the Stripe Payment Link.")
    pid = (cfg.get("meta_pixel_id") or "").strip()
    if pid and not re.fullmatch(r"\d{8,20}", pid):
        rep.err("meta_pixel_id must be the numeric Pixel ID.")
    gid = (cfg.get("ga4_id") or "").strip()
    if gid and not re.fullmatch(r"G-[A-Z0-9]{4,16}", gid):
        rep.err("ga4_id must look like G-XXXXXXXXXX.")
    em = (cfg.get("support_email") or "").strip()
    if em and not re.fullmatch(r"[^@\s<>\"]+@[^@\s<>\"]+\.[a-z]{2,}", em, re.I):
        rep.err("support_email does not look like an email address.")
    dom = (cfg.get("domain") or "").strip()
    if dom and not re.fullmatch(r"(https?://)?[a-z0-9.-]+\.[a-z]{2,}/?", dom, re.I):
        rep.err("domain should look like example.com")


# --------------------------------------------------------------------------- main

def apply_sets(cfg, sets):
    for s in sets:
        key, _, raw = s.partition("=")
        try:
            val = json.loads(raw)
        except ValueError:
            val = raw
        node = cfg
        parts = key.split(".")
        for p in parts[:-1]:
            node = node.setdefault(p, {})
        if isinstance(node.get(parts[-1]), str) and not isinstance(val, str):
            val = raw  # keep IDs like a Pixel ID as text
        node[parts[-1]] = val


def safe_replace_dir(tmp, dest):
    if os.path.isdir(dest):
        marker = os.path.join(dest, ".built-by-build-py")
        if os.listdir(dest) and not os.path.exists(marker):
            raise BuildError(f"{dest} exists and was not made by build.py; refusing to overwrite it.")
        shutil.rmtree(dest)
    os.replace(tmp, dest)


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--check", action="store_true", help="run every check and print the report; write nothing")
    ap.add_argument("--out", help="write the site here instead of site/ (for QA builds)")
    ap.add_argument("--set", action="append", default=[], metavar="KEY=VALUE",
                    help="override a config value for this build only (dotted keys, JSON values)")
    ap.add_argument("--config", default=os.path.join(HERE, "config.json"))
    ap.add_argument("--today", help="pretend today is this date (YYYY-MM-DD), for testing date rules")
    args = ap.parse_args(argv)

    rep = Report()
    S = P = None
    stats = {}
    cfg = json.loads(read(args.config))
    apply_sets(cfg, args.set)
    today = dt.date.fromisoformat(args.today) if args.today else dt.date.today()
    try:
        validate_config(cfg, rep)
        compliance_text = read(rel(cfg["paths"]["compliance"]))
        banned = load_banned(compliance_text)
        copy_dir = rel(cfg["paths"]["copy_dir"])
        product_md = read(os.path.join(copy_dir, "product-page.md"))
        policies_md = read(os.path.join(copy_dir, "policies.md"))
        sup = load_supplier(cfg, rep)
        bslug = anchor(cfg["brand_name"])
        imgs = find_images(cfg, bslug, f"{cfg['brand_name']} {cfg.get('product_noun', '')}".strip(), sup, rep)
        S = build_context(cfg, sup, imgs, rep, today)
        P = parse_product_copy(S, product_md, compliance_text, rep)
        pol = parse_policies(S, policies_md, rep)
        app_js = read(os.path.join(SRC, "app.js"))
        if len(app_js.encode()) > JS_BUDGET:
            rep.err(f"src/app.js is {len(app_js.encode())} bytes; the budget is {JS_BUDGET}.")
        css = read(os.path.join(SRC, "style.css"))
        pages = {
            "index.html": index_html(S, P, app_js),
            "policies.html": policies_html(S, P, pol),
            "thank-you.html": thank_you_html(S, P),
            "404.html": not_found_html(S, P),
            "style.css": css,
            "favicon.svg": favicon_svg(),
            "robots.txt": robots_txt(S),
            "sitemap.xml": sitemap_xml(S),
            "vercel.json": vercel_json(S),
        }
        stats = check_pages(S, pages, banned, rep, [os.path.basename(i["out"]) for i in imgs["copies"]])
        if S["ctx"].missing:
            rep.note("Values not set yet (their sentences are hidden): " + ", ".join(sorted(S["ctx"].missing)))
        blockers = launch_checks(S, rep)
        if S["live"]:
            for b in blockers:
                rep.err("LAUNCH CHECK: " + b)
        else:
            rep.blockers = blockers
    except BuildError as ex:
        rep.err(str(ex))
        S = P = None

    # ---- report
    lines = [f"Build {dt.datetime.now():%Y-%m-%d %H:%M} | mode: {'LIVE' if cfg.get('launch_live') else 'preview'}"]
    if S:
        lines.append("Claims shown: " + ", ".join(f"{k}={'on' if v else 'off'}" for k, v in S["shown"].items()))
        lines.append(f"Delivery profile: {S['profile']} -> {S['tokens']['DELIVERY_PROMISE']}")
        lines.append(f"Colours: {S['tokens']['COLOR_OPTIONS']} | Sizes ({S['size_from']}): {S['tokens']['SIZE_OPTIONS']}")
        lines.append("Checkout: " + ("Payment Link set" if cfg.get("payment_link") else "no payment_link, button shows 'Launching soon'"))
        ck = P["checkout"] if P else {}
        if ck:
            lines.append("Stripe Payment Link text to paste (rendered from product-page.md):")
            for k, v in ck.items():
                v = drop_missing(v).replace("**", "").replace(SENT_STAR, "*").replace(SENT_EMAIL, "")
                lines.append(f"  - {k}: {v or '(waiting for a value; see config)'}")
            if not S["tokens"]["STATEMENT_DESCRIPTOR"]:
                lines.append("    (the statement-descriptor sentence is added once stripe.statement_descriptor is set)")
        lines.append("Customer-facing text chunks checked: " + ", ".join(f"{k} {v}" for k, v in stats.items()))
    for m in rep.info:
        lines.append("note: " + m)
    for m in rep.warnings:
        lines.append("WARN: " + m)
    if rep.blockers:
        lines.append(f"Launch blockers ({len(rep.blockers)}), shown because launch_live is false:")
        lines += [f"  [ ] {b}" for b in rep.blockers]
    for m in rep.errors:
        lines.append("ERROR: " + m)
    lines.append(f"{len(rep.errors)} error(s), {len(rep.warnings)} warning(s).")
    report = "\n".join(lines)
    print(report)
    if rep.errors:
        print("Nothing written." if not args.check else "")
        return 1
    if args.check:
        return 0

    # ---- write (atomically: build in a temp folder, then swap)
    dest = os.path.abspath(args.out) if args.out else os.path.join(HERE, "site")
    tmp = dest.rstrip("/") + ".tmp-build"
    if os.path.exists(tmp):
        shutil.rmtree(tmp)
    os.makedirs(os.path.join(tmp, "img"))
    for name, content in pages.items():
        with open(os.path.join(tmp, name), "w", encoding="utf-8") as f:
            f.write(content)
    for img in imgs["copies"]:
        shutil.copyfile(img["src"], os.path.join(tmp, img["out"]))
    if os.path.exists(TOUCH_ICON):
        shutil.copyfile(TOUCH_ICON, os.path.join(tmp, "apple-touch-icon.png"))
    open(os.path.join(tmp, ".built-by-build-py"), "w").close()
    safe_replace_dir(tmp, dest)
    if not args.out:
        os.makedirs(os.path.join(HERE, "qa"), exist_ok=True)
        with open(os.path.join(HERE, "qa", "build-report.txt"), "w", encoding="utf-8") as f:
            f.write(report + "\n")
    print(f"Wrote {dest}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
