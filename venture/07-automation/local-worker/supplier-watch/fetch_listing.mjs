#!/usr/bin/env node
// Supplier listing fetcher. Runs on the Mac mini in a real, visible browser so
// marketplaces (Temu, AliExpress, Alibaba) treat it like a normal shopper.
//
// It only READS a public product page. It never logs in, never types into a
// form, never clicks add-to-cart / buy / checkout, and never spends money.
//
// Usage:
//   node fetch_listing.mjs                    # every enabled listing in listings.json
//   node fetch_listing.mjs --id temu-eden     # one listing from listings.json
//   node fetch_listing.mjs --url <url> --id <slug>   # ad-hoc listing
// Options:
//   --headless            run without a window (more likely to be blocked)
//   --wait-captcha <sec>  how long to wait for a human to clear a bot check (default 180)
//   --max-images <n>      cap on images downloaded per run (default 80)
//   --out <dir>           output root (default: venture/08-weighted-hoodie/supplier)
//   --profile <dir>       browser profile dir (default: ~/.supplier-watch-profile)
//   --date YYYY-MM-DD     override the snapshot date (default: today, local time)
//
// Exit codes: 0 all OK, 2 at least one listing blocked by a bot check, 1 error.

import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');

// ---------- args ----------
function parseArgs(argv) {
  const a = { headless: false, waitCaptcha: 180, maxImages: 80 };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    const next = () => {
      const v = argv[++i];
      if (v === undefined || v.startsWith('--')) throw new Error(`missing value for ${k}`);
      return v;
    };
    if (k === '--headless') a.headless = true;
    else if (k === '--url') a.url = next();
    else if (k === '--id') a.id = next();
    else if (k === '--out') a.out = next();
    else if (k === '--profile') a.profile = next();
    else if (k === '--date') a.date = next();
    else if (k === '--wait-captcha') a.waitCaptcha = Number(next());
    else if (k === '--max-images') a.maxImages = Number(next());
    else if (k === '--help' || k === '-h') a.help = true;
    else throw new Error(`unknown argument ${k}`);
  }
  return a;
}

function localDate() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- safety ----------
// Anything whose visible text matches this is never clicked.
const FORBIDDEN_CLICK = /add to (cart|bag)|buy now|checkout|check out|place order|pay now|sign in|log ?in|register|subscribe|claim|coupon|spin|gift/i;

async function safeClick(locator) {
  const text = ((await locator.innerText().catch(() => '')) || '').trim();
  if (FORBIDDEN_CLICK.test(text)) return false;
  await locator.click({ timeout: 4000 }).catch(() => {});
  return true;
}

// ---------- bot-check detection ----------
const BLOCK_URL = /verification|captcha|bgn_verify|punish|\/verify|challenge/i;
const BLOCK_TEXT = /slide to (verify|complete)|security (check|verification)|verify (you are|you're) (human|not a robot)|are you a robot|unusual traffic|captcha|access denied|press (and|&) hold/i;

async function isBlocked(page) {
  if (BLOCK_URL.test(page.url())) return true;
  const text = await page.evaluate(() => (document.body ? document.body.innerText.slice(0, 4000) : '')).catch(() => '');
  if (!text.trim()) return false;
  // A product page that merely mentions "verify" somewhere still has a price.
  const hasPrice = /\$\s?\d/.test(text);
  return BLOCK_TEXT.test(text) && !hasPrice;
}

// ---------- JSON helpers ----------
function walk(node, visit, pathArr = [], seen = new Set()) {
  if (node && typeof node === 'object') {
    if (seen.has(node)) return;
    seen.add(node);
    visit(node, pathArr);
    if (Array.isArray(node)) node.forEach((v, i) => walk(v, visit, pathArr.concat(i), seen));
    else for (const [k, v] of Object.entries(node)) walk(v, visit, pathArr.concat(k), seen);
  }
}

function firstString(obj, keys) {
  let found = null;
  walk(obj, (n) => {
    if (found || Array.isArray(n)) return;
    for (const k of keys) {
      if (typeof n[k] === 'string' && n[k].trim().length > 3) { found = n[k].trim(); return; }
    }
  });
  return found;
}

// Normalise a spec entry like {specKey:'Color', specValue:'Black'} or {key, value} or {name, value}.
function specPair(s) {
  if (!s || typeof s !== 'object') return null;
  const key = s.specKey ?? s.spec_key ?? s.parentSpecName ?? s.key ?? s.name ?? s.attrName ?? s.propName;
  const val = s.specValue ?? s.spec_value ?? s.specName ?? s.value ?? s.attrValue ?? s.propValue;
  if (typeof key === 'string' && (typeof val === 'string' || typeof val === 'number')) return [key.trim(), String(val).trim()];
  return null;
}

// Find SKU-like objects: objects carrying a specs array plus at least one price-ish field.
function extractSkus(raw) {
  const skus = [];
  const seenIds = new Set();
  walk(raw, (n) => {
    if (Array.isArray(n)) return;
    const specArr = n.specs ?? n.specList ?? n.skuSpecs ?? n.spec ?? n.attrs ?? n.saleAttrs;
    if (!Array.isArray(specArr) || specArr.length === 0) return;
    const pairs = specArr.map(specPair).filter(Boolean);
    if (!pairs.length) return;
    const priceFields = {};
    const stockFields = {};
    for (const [k, v] of Object.entries(n)) {
      if (/price/i.test(k) && (typeof v === 'number' || typeof v === 'string')) priceFields[k] = v;
      else if (/price/i.test(k) && v && typeof v === 'object' && !Array.isArray(v)) {
        for (const [k2, v2] of Object.entries(v)) {
          if (typeof v2 === 'number' || typeof v2 === 'string') priceFields[`${k}.${k2}`] = v2;
        }
      }
      if (/stock|quantity|onsale|soldout|limit/i.test(k) && (typeof v === 'number' || typeof v === 'string' || typeof v === 'boolean')) stockFields[k] = v;
    }
    if (!Object.keys(priceFields).length && !('skuId' in n) && !('sku_id' in n)) return;
    const id = String(n.skuId ?? n.sku_id ?? n.id ?? JSON.stringify(pairs));
    if (seenIds.has(id)) return;
    seenIds.add(id);
    const thumb = n.thumbUrl ?? n.thumb ?? n.imageUrl ?? n.image ?? n.img ?? null;
    skus.push({
      skuId: id,
      specs: Object.fromEntries(pairs),
      priceFields,
      priceUsd: bestPriceUsd(priceFields),
      stockFields,
      thumb: typeof thumb === 'string' ? thumb : null,
    });
  });
  return skus;
}

// Pick the most likely current selling price, in dollars.
// Temu often stores prices as integer cents (2999 = $29.99) and also as display strings ("$29.99").
function bestPriceUsd(fields) {
  const entries = Object.entries(fields);
  const fromString = (v) => {
    const m = String(v).replace(/,/g, '').match(/\$?\s*(\d+(?:\.\d{1,2})?)/);
    return m ? Number(m[1]) : null;
  };
  const rank = (k) => {
    const s = k.toLowerCase();
    if (/(market|original|line|normal|retail|was|before)/.test(s)) return 3; // list price, not what you pay
    if (/(str|text|display|show)/.test(s)) return 0; // display string is the safest
    if (/(sale|current|final|price$|price\.price|price\.)/.test(s)) return 1;
    return 2;
  };
  entries.sort((a, b) => rank(a[0]) - rank(b[0]));
  for (const [k, v] of entries) {
    if (rank(k) === 3) continue;
    if (typeof v === 'string' && /\$|\./.test(v)) {
      const n = fromString(v);
      if (n && n > 0 && n < 5000) return n;
    }
  }
  for (const [k, v] of entries) {
    if (rank(k) === 3) continue;
    const n = typeof v === 'number' ? v : Number(String(v).replace(/[^\d.]/g, ''));
    if (!Number.isFinite(n) || n <= 0) continue;
    if (Number.isInteger(n) && n >= 100) return n / 100; // integer cents
    if (n < 5000) return n;
  }
  return null;
}

// Collect option groups (e.g. Color: [Black, Grey], Size: [S, M, L]) from SKU specs.
function optionGroups(skus) {
  const groups = {};
  for (const s of skus) {
    for (const [k, v] of Object.entries(s.specs)) {
      groups[k] ??= [];
      if (!groups[k].includes(v)) groups[k].push(v);
    }
  }
  return groups;
}

// Size-chart-ish data anywhere in the JSON: keys mentioning size + chart/guide/table.
function extractSizeChart(raw) {
  const hits = [];
  walk(raw, (n, p) => {
    if (Array.isArray(n)) return;
    for (const [k, v] of Object.entries(n)) {
      if (/size.?(chart|guide|table|info)|measure/i.test(k) && v !== null && v !== undefined && v !== '') {
        hits.push({ path: p.concat(k).join('.'), value: v });
      }
    }
  });
  return hits.slice(0, 20);
}

// ---------- image helpers ----------
const IMG_URL = /https?:\/\/[a-z0-9.-]*(?:kwcdn\.com|alicdn\.com|aliexpress-media\.com|temu\.com)\/[^"'\s)\\<>]+?\.(?:jpe?g|png|webp|avif)/gi;

function canonicalImage(u) {
  try {
    const url = new URL(u.replace(/\\u002F/g, '/').replace(/\\\//g, '/'));
    url.search = ''; // drop resize/crop parameters to get the original
    url.hash = '';
    // AliExpress appends size suffixes like _640x640.jpg_.webp
    url.pathname = url.pathname.replace(/(\.(?:jpe?g|png|webp))_\d+x\d+[^/]*$/i, '$1');
    return url.toString();
  } catch {
    return null;
  }
}

function imagesFromText(text) {
  const out = [];
  const unescaped = text.replace(/\\u002F/g, '/').replace(/\\\//g, '/');
  for (const m of unescaped.matchAll(IMG_URL)) {
    const c = canonicalImage(m[0]);
    if (c && !out.includes(c)) out.push(c);
  }
  return out;
}

function extFor(url, contentType) {
  const fromType = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/avif': '.avif' }[(contentType || '').split(';')[0]];
  if (fromType) return fromType;
  const m = url.match(/\.(jpe?g|png|webp|avif)(?:$|\?)/i);
  return m ? `.${m[1].toLowerCase().replace('jpeg', 'jpg')}` : '.img';
}

// ---------- DOM text helpers ----------
function pickLines(text, re, max = 8) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const out = [];
  for (const l of lines) {
    if (re.test(l) && l.length < 200 && !out.includes(l)) out.push(l);
    if (out.length >= max) break;
  }
  return out;
}

// ---------- main per-listing ----------
async function fetchListing(context, listing, opts) {
  const { id, url } = listing;
  const listingDir = path.join(opts.out, id);
  const latestDir = path.join(listingDir, 'latest');
  const snapDir = path.join(listingDir, 'snapshots', opts.date);
  const imgDir = path.join(listingDir, 'images');
  await fs.mkdir(latestDir, { recursive: true });
  await fs.mkdir(snapDir, { recursive: true });
  await fs.mkdir(imgDir, { recursive: true });

  const status = { id, url, date: opts.date, status: 'ERROR', message: '', counts: {} };
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await sleep(2500);

    // Bot check: wait for a human to clear it in the visible window.
    if (await isBlocked(page)) {
      if (!opts.headless && opts.waitCaptcha > 0) {
        console.log(`[${id}] Bot check on screen. Clear it in the browser window; waiting up to ${opts.waitCaptcha}s...`);
        const until = Date.now() + opts.waitCaptcha * 1000;
        while (Date.now() < until && (await isBlocked(page))) await sleep(5000);
      }
      if (await isBlocked(page)) {
        await page.screenshot({ path: path.join(latestDir, 'blocked.png') }).catch(() => {});
        status.status = 'BLOCKED';
        status.message = `bot check not cleared at ${page.url()}`;
        return status;
      }
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await sleep(2000);
    }

    // Dismiss pop-ups (login prompts, coupons) without clicking anything inside them.
    for (let i = 0; i < 3; i++) { await page.keyboard.press('Escape').catch(() => {}); await sleep(400); }

    // Scroll to the bottom slowly so lazy images, descriptions and reviews load.
    await page.evaluate(async () => {
      const step = Math.max(400, Math.floor(window.innerHeight * 0.8));
      for (let y = 0; y < document.body.scrollHeight && y < 40000; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 350));
      }
      window.scrollTo(0, 0);
    }).catch(() => {});
    await sleep(1500);

    await page.screenshot({ path: path.join(latestDir, 'screenshot-top.png') }).catch(() => {});
    await page.screenshot({ path: path.join(latestDir, 'screenshot-full.png'), fullPage: true }).catch(() => {});

    // Size guide: open it if there is a button for it (read-only), capture text + screenshot.
    let sizeGuideText = '';
    const sizeBtn = page.getByText(/size (guide|chart)|sizing (guide|chart)|size reference/i).first();
    if (await sizeBtn.count().catch(() => 0)) {
      await sizeBtn.scrollIntoViewIfNeeded().catch(() => {});
      if (await safeClick(sizeBtn)) {
        await sleep(2500);
        const dialog = page.locator('[role="dialog"], [class*="modal" i], [class*="popup" i], [class*="drawer" i]').last();
        const target = (await dialog.count().catch(() => 0)) ? dialog : page;
        sizeGuideText = await target.innerText().catch(() => '');
        await (target === page ? page : dialog).screenshot({ path: path.join(latestDir, 'size-guide.png') }).catch(() => {});
        const tables = await page.locator('table').evaluateAll((ts) => ts.map((t) => t.outerHTML)).catch(() => []);
        if (tables.length) await fs.writeFile(path.join(latestDir, 'size-guide-tables.html'), tables.join('\n\n'));
        await page.keyboard.press('Escape').catch(() => {});
        await sleep(500);
      }
    }

    // Raw data: Temu ships the whole product in window.rawData; try other common globals too.
    const raw = await page.evaluate(() => {
      const pick = (v) => { try { return v ? JSON.parse(JSON.stringify(v)) : null; } catch { return null; } };
      return {
        rawData: pick(window.rawData),
        nextData: pick(window.__NEXT_DATA__),
        initialState: pick(window.__INITIAL_STATE__),
        runParams: pick(window.runParams),
      };
    }).catch(() => ({}));
    const html = await page.content();
    const text = await page.evaluate(() => document.body.innerText).catch(() => '');
    const ldjson = await page.locator('script[type="application/ld+json"]').evaluateAll((s) => s.map((x) => x.textContent)).catch(() => []);
    const meta = await page.evaluate(() => {
      const m = (sel) => document.querySelector(sel)?.getAttribute('content') || null;
      return { ogTitle: m('meta[property="og:title"]'), ogImage: m('meta[property="og:image"]'), description: m('meta[name="description"]'), h1: document.querySelector('h1')?.innerText?.trim() || null };
    }).catch(() => ({}));

    await fs.writeFile(path.join(latestDir, 'page.html'), html);
    await fs.writeFile(path.join(latestDir, 'page.txt'), text);
    await fs.writeFile(path.join(latestDir, 'raw.json'), JSON.stringify({ ...raw, ldjson }, null, 1));
    if (sizeGuideText) await fs.writeFile(path.join(latestDir, 'size-guide.txt'), sizeGuideText);

    // Extract structured fields.
    const allRaw = { ...raw, ldjson: ldjson.map((s) => { try { return JSON.parse(s); } catch { return null; } }) };
    const skus = extractSkus(allRaw);
    const title = firstString(allRaw, ['goodsName', 'goods_name', 'subject', 'productTitle', 'title']) || meta.h1 || meta.ogTitle;
    const domPrices = [...new Set((text.match(/\$\s?\d{1,4}(?:[.,]\d{2})?/g) || []).map((p) => p.replace(/\s/g, '')))].slice(0, 12);

    const domImages = await page.evaluate(() => {
      const out = [];
      for (const img of document.querySelectorAll('img')) {
        const big = (img.naturalWidth || 0) >= 300 || (img.naturalHeight || 0) >= 300;
        const src = img.currentSrc || img.src;
        if (big && src && /^https?:/.test(src)) out.push(src);
      }
      return out;
    }).catch(() => []);
    const imageUrls = [];
    const addImg = (u) => { const c = canonicalImage(u) || u; if (c && !imageUrls.includes(c)) imageUrls.push(c); };
    for (const s of skus) if (s.thumb) addImg(s.thumb);
    imagesFromText(JSON.stringify(allRaw)).forEach(addImg);
    if (meta.ogImage) addImg(meta.ogImage);
    domImages.forEach(addImg);

    // Download images (content-addressed, so repeat runs do not duplicate files).
    const downloaded = [];
    const failed = [];
    const queue = imageUrls.slice(0, opts.maxImages);
    const skipped = imageUrls.length - queue.length;
    async function worker() {
      while (queue.length) {
        const u = queue.shift();
        try {
          const res = await context.request.get(u, { timeout: 30000, headers: { referer: url } });
          if (!res.ok()) { failed.push({ url: u, status: res.status() }); continue; }
          const body = await res.body();
          if (body.length < 2000 || body.length > 12 * 1024 * 1024) { failed.push({ url: u, status: `size ${body.length}` }); continue; }
          const hash = crypto.createHash('sha256').update(body).digest('hex').slice(0, 16);
          const file = `${hash}${extFor(u, res.headers()['content-type'])}`;
          const dest = path.join(imgDir, file);
          if (!existsSync(dest)) await fs.writeFile(dest, body);
          downloaded.push({ url: u, file: `images/${file}`, bytes: body.length });
        } catch (e) {
          failed.push({ url: u, status: String(e.message || e).slice(0, 120) });
        }
      }
    }
    await Promise.all([worker(), worker(), worker(), worker()]);
    // Keep the manifest in page order, not download-finish order.
    downloaded.sort((a, b) => imageUrls.indexOf(a.url) - imageUrls.indexOf(b.url));

    const listingJson = {
      id,
      url,
      finalUrl: page.url(),
      fetchedAt: new Date().toISOString(),
      date: opts.date,
      title,
      meta,
      options: optionGroups(skus),
      skus,
      domPrices,
      rating: pickLines(text, /(\d(\.\d)?\s*(out of 5|stars?|★))|(\d[\d,.]*k?\+?\s*reviews?)/i, 4),
      sold: pickLines(text, /\d[\d,.]*k?\+?\s*sold/i, 3),
      shipping: pickLines(text, /free shipping|delivery|arrives|ships? from|local warehouse|days?\b.*deliver/i, 8),
      sizeChartFromData: extractSizeChart(allRaw),
      sizeGuideText: sizeGuideText ? sizeGuideText.slice(0, 6000) : null,
      images: downloaded,
      imageFailures: failed.slice(0, 40),
      imagesNotAttempted: skipped,
      files: {
        html: 'latest/page.html', text: 'latest/page.txt', raw: 'latest/raw.json',
        screenshotTop: 'latest/screenshot-top.png', screenshotFull: 'latest/screenshot-full.png',
        sizeGuide: sizeGuideText ? 'latest/size-guide.png' : null,
      },
    };
    await fs.writeFile(path.join(latestDir, 'listing.json'), JSON.stringify(listingJson, null, 2));
    await fs.writeFile(path.join(snapDir, 'listing.json'), JSON.stringify({ ...listingJson, files: undefined }, null, 2));

    // Price history: one row per SKU per run (or one row with the page prices if no SKUs were found).
    const histFile = path.join(listingDir, 'price-history.csv');
    if (!existsSync(histFile)) await fs.writeFile(histFile, 'date,sku_id,options,price_usd,stock,page_prices\n');
    const csv = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = skus.length
      ? skus.map((s) => [opts.date, s.skuId, Object.entries(s.specs).map(([k, v]) => `${k}=${v}`).join('; '), s.priceUsd ?? '', JSON.stringify(s.stockFields), ''].map(csv).join(','))
      : [[opts.date, '', '', '', '', domPrices.join(' ')].map(csv).join(',')];
    await fs.appendFile(histFile, rows.join('\n') + '\n');

    status.status = 'OK';
    status.counts = { skus: skus.length, optionGroups: Object.keys(listingJson.options).length, imagesFound: imageUrls.length, imagesSaved: downloaded.length, imageFailures: failed.length, domPrices: domPrices.length };
    status.message = skus.length ? 'ok' : 'page saved but no SKU data parsed; raw.json/page.txt kept for manual parsing';
    return status;
  } catch (e) {
    status.status = 'ERROR';
    status.message = String(e.stack || e).slice(0, 500);
    await page.screenshot({ path: path.join(latestDir, 'error.png') }).catch(() => {});
    return status;
  } finally {
    await fs.writeFile(path.join(latestDir, 'status.json'), JSON.stringify(status, null, 2)).catch(() => {});
    await fs.writeFile(path.join(snapDir, 'status.json'), JSON.stringify(status, null, 2)).catch(() => {});
    await page.close().catch(() => {});
  }
}

// ---------- entry ----------
async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(await fs.readFile(fileURLToPath(import.meta.url), 'utf8').then((s) => s.split('\n').slice(1, 22).join('\n')));
    return 0;
  }
  const opts = {
    headless: args.headless,
    waitCaptcha: Number.isFinite(args.waitCaptcha) ? args.waitCaptcha : 180,
    maxImages: Number.isFinite(args.maxImages) ? args.maxImages : 80,
    out: path.resolve(args.out || path.join(REPO, 'venture/08-weighted-hoodie/supplier')),
    profile: path.resolve(args.profile || path.join(os.homedir(), '.supplier-watch-profile')),
    date: args.date || localDate(),
  };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(opts.date)) throw new Error(`bad --date ${opts.date}`);
  if (opts.profile.startsWith(REPO + path.sep)) throw new Error('profile dir must be outside the repo (it holds cookies)');

  let listings;
  if (args.url) {
    if (!args.id) throw new Error('--url needs --id <slug>');
    listings = [{ id: args.id, url: args.url, enabled: true }];
  } else {
    const cfg = JSON.parse(await fs.readFile(path.join(HERE, 'listings.json'), 'utf8'));
    listings = cfg.listings.filter((l) => l.enabled !== false && (!args.id || l.id === args.id));
    if (!listings.length) throw new Error(args.id ? `no enabled listing with id ${args.id}` : 'no enabled listings');
  }
  for (const l of listings) if (!/^[a-z0-9][a-z0-9-]{1,60}$/.test(l.id)) throw new Error(`bad listing id ${l.id} (lowercase letters, digits, dashes)`);

  // Prefer the installed Google Chrome (looks like a normal shopper); fall back to Playwright's Chromium.
  const launch = (channel) => chromium.launchPersistentContext(opts.profile, {
    channel,
    headless: opts.headless,
    viewport: { width: 1366, height: 900 },
    locale: 'en-US',
    acceptDownloads: false,
    args: ['--disable-blink-features=AutomationControlled'],
  });
  let context;
  try { context = await launch(process.env.SUPPLIER_WATCH_CHANNEL ?? 'chrome'); }
  catch { context = await launch(undefined); }

  const results = [];
  try {
    for (const l of listings) {
      console.log(`[${l.id}] fetching ${l.url}`);
      const r = await fetchListing(context, l, opts);
      console.log(`[${l.id}] ${r.status}: ${r.message} ${JSON.stringify(r.counts)}`);
      results.push(r);
      await sleep(3000);
    }
  } finally {
    await context.close().catch(() => {});
  }
  if (results.some((r) => r.status === 'ERROR')) return 1;
  if (results.some((r) => r.status === 'BLOCKED')) return 2;
  return 0;
}

main().then((code) => process.exit(code)).catch((e) => { console.error(e.message || e); process.exit(1); });
