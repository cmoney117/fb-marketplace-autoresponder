#!/usr/bin/env python3
"""Copy check for the ad and content kit.

Runs the banned-phrase list from ../compliance.md, the claim gates, and the
"numbers must be tokens" rule over every customer-facing line in the kit.

Usage (from anywhere):
    python3 -I venture/08-weighted-hoodie/ads/check_copy.py            # checks the kit's .md files
    python3 -I venture/08-weighted-hoodie/ads/check_copy.py file.md    # checks the given files

Exit code 0 = clean, 1 = at least one error. Warnings are for a human to read.

What counts as customer-facing (everything else in the docs is internal notes):
  * fenced blocks whose info string starts with `copy`   (ads, captions, on-image text, replies)
  * table columns headed exactly: Hook line, On-screen text, Voiceover, Caption,
    Headline, On-image text, Alt text, Card text, Copy, Reply
  * every image/video file name anywhere in the doc (file names are customer-facing)
Fenced blocks starting with `prompt` (AI prompts) get the banned list only.
Fenced blocks starting with `safety` hold the fixed Safety block text and are skipped,
as compliance.md allows.

Claim gates: a section declares `**Requires:** claims.x, claims.y` (or `none`) and
everything under that heading inherits it, until a heading of the same or higher
level. A copy block can override with `requires=claims.x,claims.y` or `requires=none`
in its info string, and a table with a `Requires` column sets the gate row by row.
A gated word in copy that does not declare its gate is an error. `features.x` keys
(for example features.buttons) work exactly like `claims.x` keys.

The ad-kit strings in hoodie-store/config.json (refund_summary, handle, hashtag) are
checked too: banned list and gated words, not the number rule.
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
COMPLIANCE = os.path.join(os.path.dirname(HERE), "compliance.md")
# The single central config. Its ad-kit strings (refund_summary, handle, hashtag) are
# token values, so they get the banned list too (but not the number rule).
CONFIG = os.path.normpath(os.path.join(HERE, "..", "..", "..", "hoodie-store", "config.json"))
CONFIG_STRINGS = ["refund_summary", "handle", "hashtag"]
DEFAULT_FILES = ["README.md", "angles.md", "video-scripts.md", "static-ads.md",
                 "ai-prompt-pack.md", "launch-plan.md"]

CUSTOMER_COLUMNS = {"hook line", "on-screen text", "voiceover", "caption", "headline",
                    "on-image text", "alt text", "card text", "copy", "reply"}

# Gated vocabulary. Keys are the copy_flag values in the central config
# (hoodie-store/config.json, claims.*.copy_flag; compliance.md, "Gated claims").
GATES = {
    "claims.weighted": [r"weighted", r"weight", r"weighs", r"heavy", r"heavier", r"heft",
                        r"\{\{WEIGHT_LB\}\}"],
    "claims.weight_lb": [r"\{\{WEIGHT_LB\}\}", r"lb", r"lbs", r"pound", r"pounds"],
    "claims.lining": [r"faux[- ]fur", r"sherpa", r"plush", r"fleece", r"fur", r"fluffy",
                      r"lining", r"lined", r"\{\{LINING_DESC\}\}"],
    "claims.outer_fiber": [r"cotton", r"\{\{OUTER_FIBER\}\}"],
    "claims.care": [r"washable", r"machine[- ]wash", r"wash", r"washing", r"dryer", r"tumble",
                    r"\{\{CARE_LINE\}\}"],
    "claims.ships_from_us": [r"\{\{SHIP_WINDOW\}\}", r"\{\{ARRIVAL_WINDOW\}\}",
                             r"\{\{XMAS_LAST_ORDER\}\}", r"christmas", r"arrives", r"arrive by",
                             r"ships from the us", r"us warehouse", r"delivery by"],
    "claims.sizes": [r"\{\{HEIGHT_MIN\}\}", r"\{\{HEIGHT_MAX\}\}", r"\{\{OWNER_HEIGHT\}\}",
                     r"\{\{OWNER_SIZE\}\}", r"\{\{SIZE_CHART\}\}", r"sized by height", r"tall",
                     r"taller", r"mid-calf", r"ankle", r"floor-length", r"long enough",
                     r"size chart"],
    "claims.origin": [r"imported"],
    "features.buttons": [r"buttons?", r"buttoned", r"buttoning"],
}

KNOWN_TOKENS = {
    "BRAND", "DOMAIN", "HANDLE", "BRAND_TAG", "PRICE", "SHIP_WINDOW", "ARRIVAL_WINDOW",
    "XMAS_LAST_ORDER", "REFUND_LINE", "WEIGHT_LB", "OUTER_FIBER", "LINING_DESC", "CARE_LINE",
    "HEIGHT_MIN", "HEIGHT_MAX", "SIZE_CHART", "COLOURS", "SUPPORT_EMAIL", "BUSINESS_NAME",
    "BUSINESS_ADDRESS", "OWNER_HEIGHT", "OWNER_SIZE", "LINK",
}

# Watch list from compliance.md: not blocked, but a human reads each hit.
WATCH = [r"introverts?", r"overthinking", r"overwhelmed", r"calm your mind", r"wellness",
         r"self-care", r"breathable", r"nap", r"naps", r"bedtime", r"hush",
         r"social battery", r"your social", r"(?:are|do|did|does) you\b"]

TIME_OF_DAY = re.compile(r"\b\d{1,2}(?::\d{2})?\s?(?:am|pm)\b", re.I)
TOKEN = re.compile(r"\{\{([A-Z0-9_]+)\}\}")
MEDIA_NAME = re.compile(r"\b[\w.-]+\.(?:png|jpe?g|webp|mp4|mov|gif)\b", re.I)
FENCE = re.compile(r"^```(.*)$")
HEADING = re.compile(r"^(#{1,6})\s")
REQUIRES_LINE = re.compile(r"^\s*(?:[-*]\s*)?\*\*Requires:\*\*\s*(.*)$")


def phrase_regex(phrase):
    """Case-insensitive whole-word/phrase match. Edges that are not letters/digits
    (like '#1', '$199', '% off', 'was $') skip the boundary check on that side."""
    body = re.escape(phrase)
    left = r"(?<![A-Za-z0-9])" if phrase[0].isalnum() else ""
    right = r"(?![A-Za-z0-9])" if phrase[-1].isalnum() else ""
    return re.compile(left + body + right, re.I)


def word_regex(pattern):
    return re.compile(r"(?<![A-Za-z0-9])(?:" + pattern + r")(?![A-Za-z0-9])", re.I)


def load_banned():
    text = open(COMPLIANCE, encoding="utf-8").read()
    sec = text.split("## Banned phrases", 1)
    if len(sec) < 2:
        sys.exit("check_copy: could not find '## Banned phrases' in compliance.md")
    m = re.search(r"```text\n(.*?)```", sec[1], re.S)
    if not m:
        sys.exit("check_copy: no ```text block under '## Banned phrases'")
    phrases = []
    for line in m.group(1).splitlines():
        line = line.strip()
        if not line or line.startswith("-- "):
            continue
        phrases.append(line)
    return phrases


def normalise(s):
    return (s.replace("’", "'").replace("‘", "'")
             .replace("“", '"').replace("”", '"')
             .replace("–", "-").replace("—", "-"))


def parse_requires(spec):
    spec = spec.strip()
    if not spec:
        return None
    if spec.lower().startswith("none"):
        return set()
    found = set(re.findall(r"(?:claims|features)\.[a-z_]+", spec))
    return found if found else None


def split_row(line):
    s = line.strip()
    if s.startswith("|"):
        s = s[1:]
    if s.endswith("|"):
        s = s[:-1]
    cells, cur, esc = [], [], False
    for ch in s:
        if ch == "\\" and not esc:
            esc = True
            cur.append(ch)
            continue
        if ch == "|" and not esc:
            cells.append("".join(cur).strip())
            cur = []
        else:
            cur.append(ch)
        esc = False
    cells.append("".join(cur).strip())
    return cells


def segments(path):
    """Yield (kind, line_no, text, requires_or_None) for each checked piece of text."""
    lines = open(path, encoding="utf-8").read().splitlines()
    req_stack = []  # list of (level, requires)
    cur_level = 0
    i = 0
    table_cols = None
    while i < len(lines):
        line = lines[i]
        h = HEADING.match(line)
        if h:
            cur_level = len(h.group(1))
            req_stack = [(lvl, r) for (lvl, r) in req_stack if lvl < cur_level]
            table_cols = None
            i += 1
            continue
        rq = REQUIRES_LINE.match(line)
        if rq:
            parsed = parse_requires(rq.group(1))
            if parsed is not None:
                req_stack = [(lvl, r) for (lvl, r) in req_stack if lvl < cur_level]
                req_stack.append((cur_level, parsed))
            i += 1
            continue
        section_req = req_stack[-1][1] if req_stack else None
        f = FENCE.match(line)
        if f:
            info = f.group(1).strip()
            start = i + 1
            j = start
            while j < len(lines) and not lines[j].startswith("```"):
                j += 1
            body = "\n".join(lines[start:j])
            kind = info.split()[0].lower() if info else ""
            if kind == "copy":
                m = re.search(r"requires=(\S+)", info)
                req = parse_requires(m.group(1).replace(",", " ")) if m else section_req
                if m and m.group(1).lower() == "none":
                    req = set()
                yield ("copy", start + 1, body, req)
            elif kind == "prompt":
                yield ("prompt", start + 1, body, None)
            # safety and other fences are skipped
            i = j + 1
            table_cols = None
            continue
        if line.strip().startswith("|"):
            cells = split_row(line)
            if table_cols is None:
                # header row (next line should be the --- separator)
                table_cols = [c.strip().strip("*").lower() for c in cells]
                i += 1
                if i < len(lines) and re.match(r"^\s*\|?\s*:?-{2,}", lines[i]):
                    i += 1
                continue
            row_req = section_req
            if "requires" in table_cols:
                ridx = table_cols.index("requires")
                if ridx < len(cells):
                    parsed = parse_requires(cells[ridx].replace("`", ""))
                    if parsed is not None:
                        row_req = parsed
            for idx, cell in enumerate(cells):
                if idx < len(table_cols) and table_cols[idx] in CUSTOMER_COLUMNS and cell:
                    yield ("cell:" + table_cols[idx], i + 1, cell, row_req)
            i += 1
            continue
        table_cols = None
        i += 1


def main(argv):
    files = argv[1:] or [os.path.join(HERE, f) for f in DEFAULT_FILES]
    files = [f for f in files if os.path.exists(f)]
    banned = [(p, phrase_regex(p)) for p in load_banned()]
    # (is_token_pattern, regex): token patterns are searched in the raw text, word
    # patterns in the text with tokens blanked, so {{WEIGHT_LB}} does not read as "weight".
    gates = {g: [(p.startswith(r"\{\{"), word_regex(p)) for p in pats] for g, pats in GATES.items()}
    watch = [word_regex(p) for p in WATCH]
    errors, warnings, counted = [], [], {}

    for path in files:
        rel = os.path.relpath(path, os.getcwd())
        raw = open(path, encoding="utf-8").read()
        # file names anywhere in the doc
        for ln, line in enumerate(raw.splitlines(), 1):
            for m in MEDIA_NAME.finditer(line):
                spaced = re.sub(r"[-_.]", " ", m.group(0))
                for p, rx in banned:
                    if rx.search(spaced):
                        errors.append(f"{rel}:{ln}: file name '{m.group(0)}' contains banned '{p}'")
        n = 0
        for kind, ln, text, req in segments(path):
            n += 1
            t = normalise(text)
            plain = TOKEN.sub(" TOKEN ", t)
            for p, rx in banned:
                if rx.search(plain):
                    errors.append(f"{rel}:{ln}: [{kind}] banned phrase '{p}' in: {text.strip()[:90]}")
            if kind == "prompt":
                continue
            for tok in TOKEN.findall(t):
                if tok not in KNOWN_TOKENS:
                    errors.append(f"{rel}:{ln}: [{kind}] unknown token {{{{{tok}}}}}")
            if re.search(r"hunkerhood", t, re.I):
                errors.append(f"{rel}:{ln}: [{kind}] literal brand name; use {{{{BRAND}}}}, {{{{DOMAIN}}}} or {{{{HANDLE}}}}")
            if req is None:
                errors.append(f"{rel}:{ln}: [{kind}] no **Requires:** declared for: {text.strip()[:70]}")
                req = set()
            for g, rxs in gates.items():
                if g in req:
                    continue
                for is_tok, rx in rxs:
                    m = rx.search(t if is_tok else plain)
                    if m:
                        errors.append(f"{rel}:{ln}: [{kind}] '{m.group(0)}' needs {g} but the section requires {sorted(req) or 'none'}")
                        break
            nums = TIME_OF_DAY.sub(" ", TOKEN.sub(" ", t))
            for m in re.finditer(r"\d+", nums):
                errors.append(f"{rel}:{ln}: [{kind}] raw number '{m.group(0)}' (use a config token) in: {text.strip()[:70]}")
                break
            for rx in watch:
                m = rx.search(t)
                if m:
                    warnings.append(f"{rel}:{ln}: [{kind}] watch-list '{m.group(0)}' (human check): {text.strip()[:80]}")
        counted[rel] = n

    # Ad-kit strings held in the central config (token values such as {{REFUND_LINE}}).
    if os.path.exists(CONFIG):
        try:
            cfg = json.load(open(CONFIG, encoding="utf-8"))
        except ValueError as ex:
            cfg = {}
            errors.append(f"{CONFIG}: not valid JSON ({ex})")
        n = 0
        for key in CONFIG_STRINGS:
            val = cfg.get(key)
            if not isinstance(val, str) or not val.strip():
                continue
            n += 1
            t = normalise(val)
            for p, rx in banned:
                if rx.search(t):
                    errors.append(f"config.json {key}: banned phrase '{p}' in: {val[:90]}")
            for g, rxs in gates.items():
                for is_tok, rx in rxs:
                    m = rx.search(t)
                    if m:
                        errors.append(f"config.json {key}: '{m.group(0)}' needs {g}; token values must not carry gated claims")
                        break
        counted[os.path.relpath(CONFIG, os.getcwd())] = n

    for rel, n in counted.items():
        print(f"checked {n:4d} customer-facing segments in {rel}")
    for w in warnings:
        print("WARN  " + w)
    for e in errors:
        print("ERROR " + e)
    print(f"\n{len(errors)} error(s), {len(warnings)} watch-list note(s), banned list: {len(banned)} phrases from compliance.md")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
