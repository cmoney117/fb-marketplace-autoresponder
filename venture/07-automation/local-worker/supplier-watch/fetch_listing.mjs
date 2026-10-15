#!/usr/bin/env node
// Supplier listing fetcher. Runs on the Mac mini in a visible Chrome window.
// It only READS a public product page: it never logs in, never types, never
// clicks add-to-cart / buy / checkout, and never spends money.
//
// The repo it writes into is PUBLIC, so only product data goes there
// (listing.json, product.json, product photos, size guide, price history).
// Raw page dumps and full-page screenshots stay in a local cache on the Mac.

const HELP = `Usage:
  node fetch_listing.mjs                         every enabled listing in listings.json
  node fetch_listing.mjs --id temu-eden-cloak    one listing from listings.json
  node fetch_listing.mjs --url <url> --id <slug> an ad-hoc listing
Options:
  --headless            run without a window (more likely to be blocked)
  --wait-captcha <sec>  how long to wait for a human to clear a check (default 180)
  --max-images <n>      cap on product images per run (default 40)
  --out <dir>           output root (default venture/08-weighted-hoodie/supplier)
  --profile <dir>       browser profile (default ~/.supplier-watch-profile)
  --cache <dir>         local raw cache (default ~/.supplier-watch-cache)
  --date YYYY-MM-DD     snapshot date (default today, local time)
Exit codes: 0 all OK, 3 data saved but incomplete, 2 needs a human
(bot check or sign-in wall), 1 error / wrong page / wrong region.`;

import fs from 'node:fs/promises';
import { existsSync, realpathSync, mkdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');

// ---------- small helpers ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const first = (s, n = 160) => String(s ?? '').split('\n')[0].slice(0, n);

function parseArgs(argv) {
  const a = { headless: false };
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
    else if (k === '--cache') a.cache = next();
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

function realLower(p) {
  mkdirSync(p, { recursive: true });
  return realpathSync(p).toLowerCase();
}

// Goods id from the listing URL: Temu ...-g-<id>.html, AliExpress /item/<id>.html.
function goodsIdFromUrl(u) {
  try {
    const p = new URL(u).pathname;
    const m = p.match(/-g-(\d{6,})\.html$/) || p.match(/\/item\/(\d{6,})\.html$/);
    return m ? m[1] : null;
  } catch { return null; }
}

// ---------- safety ----------
// Nothing whose text, aria-label, title or value matches this is ever clicked.
const FORBIDDEN_CLICK = /add to (cart|bag)|buy now|checkout|check out|place order|pay now|sign ?in|log ?in|register|subscribe|claim|coupon|spin|gift|join|download (the )?app/i;

async function safeClick(locator) {
  await locator.scrollIntoViewIfNeeded({ timeout: 4000 }).catch(() => {});
  const info = await locator.evaluate((e) => {
    const label = (el) => (el ? [el.innerText, el.getAttribute && el.getAttribute('aria-label'), el.getAttribute && el.getAttribute('title'), el.getAttribute && el.getAttribute('value')].filter(Boolean).join(' ') : '');
    const r = e.getBoundingClientRect();
    if (!r.width || !r.height) return { hidden: true };
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    const target = hit ? (hit.closest('a,button,[role=button],[onclick]') || hit) : null;
    const covered = !!hit && !e.contains(hit) && !hit.contains(e);
    return { self: label(e), hit: label(target), covered };
  }).catch(() => null);
  if (!info) return { clicked: false, reason: 'element not measurable' };
  if (info.hidden) return { clicked: false, reason: 'element not visible' };
  if (FORBIDDEN_CLICK.test(info.self) || FORBIDDEN_CLICK.test(info.hit)) return { clicked: false, reason: 'forbidden text on the click target' };
  if (info.covered) return { clicked: false, reason: 'another element (likely a pop-up) covers it' };
  try {
    await locator.click({ timeout: 4000 });
    return { clicked: true };
  } catch (e) {
    return { clicked: false, reason: first(e.message) };
  }
}

// ---------- page state ----------
const BLOCK_PATH = /\/(bgn_verification|verify|verification|captcha)[^/]*\.html?$|\/_+tmd_+\/|\/punish|\/captcha/i;
const LOGIN_PATH = /\/(login|signin|sign-in|register)(\.html)?$/i;
const BLOCK_TEXT = /slide to (verify|complete)|security (check|verification)|verify (you are|you're) (human|not a robot)|are you a robot|unusual traffic|captcha|access denied|press (and|&) hold|click on the (items|objects|images) in the order|drag the slider|complete the puzzle|verify to continue/i;
const LOGIN_TEXT = /sign in to continue|please (sign|log) in|sign in or register to/i;
const VERIFY_SELECTORS = '.verifyDialog, #captchaImg, #imageSemantics, iframe[src*="verif" i], iframe[src*="captcha" i], [role="dialog"] #slider, [role="dialog"] #slide-button';
const RECO_HEADING = /you may also like|explore your interests|recommended for you|more to love|similar items|people also (viewed|bought)/i;
const REGION_PREFIX = /^\/[a-z]{2}(-[a-z]{2})?\//;

// Returns { kind: product | blocked | login | off | region | unknown, detail }
async function pageState(page, expectedId) {
  let u;
  try { u = new URL(page.url()); } catch { return { kind: 'unknown', detail: 'no url' }; }
  const info = await page.evaluate(() => {
    const t = document.body ? document.body.innerText : '';
    let goodsId = null;
    try { const g = window.rawData && window.rawData.store && window.rawData.store.goods; goodsId = g ? String(g.goodsId ?? g.goods_id ?? '') : null; } catch {}
    return { head: t.slice(0, 4000), tail: t.slice(-4000), len: t.length, goodsId };
  }).catch(() => ({ head: '', tail: '', len: 0, goodsId: null }));
  const verifyVisible = await page.locator(VERIFY_SELECTORS).filter({ visible: true }).count().catch(() => 0);
  let frameText = '';
  for (const f of page.frames()) {
    if (f === page.mainFrame()) continue;
    frameText += ' ' + (await f.evaluate(() => (document.body ? document.body.innerText.slice(0, 2000) : '')).catch(() => ''));
  }
  const dialogText = await page.locator('[role="dialog"], [aria-modal="true"]').filter({ visible: true }).allInnerTexts().catch(() => []);
  const bodyText = `${info.head}\n${info.tail}`;
  const hasPrice = /\$\s?\d/.test(bodyText);
  const isTemu = /(^|\.)temu\.com$/i.test(u.hostname) || /-g-\d{6,}\.html$/.test(u.pathname);

  if (BLOCK_PATH.test(u.pathname)) return { kind: 'blocked', detail: `verification page ${u.pathname}` };
  if (LOGIN_PATH.test(u.pathname)) return { kind: 'login', detail: `sign-in page ${u.pathname}` };
  if (verifyVisible > 0 || BLOCK_TEXT.test(frameText) || dialogText.some((t) => BLOCK_TEXT.test(t))) return { kind: 'blocked', detail: 'verification dialog on screen' };
  if (dialogText.some((t) => LOGIN_TEXT.test(t))) return { kind: 'login', detail: 'sign-in dialog on screen' };
  if (isTemu && REGION_PREFIX.test(u.pathname)) return { kind: 'region', detail: `regional site ${u.pathname.split('/')[1]}` };
  if (expectedId && !u.pathname.includes(expectedId) && !(info.goodsId && info.goodsId === expectedId)) {
    return { kind: 'off', detail: `page is ${u.pathname}, not goods ${expectedId}` };
  }
  if (info.len === 0) return { kind: 'unknown', detail: 'empty page' };
  if (BLOCK_TEXT.test(bodyText) && !hasPrice) return { kind: 'blocked', detail: 'verification text on page' };
  if (LOGIN_TEXT.test(bodyText) && !hasPrice) return { kind: 'login', detail: 'sign-in text on page' };
  return { kind: 'product', detail: 'ok' };
}

// ---------- JSON helpers ----------
function walk(node, visit, pathArr = [], seen = new Set(), skip = null) {
  if (!node || typeof node !== 'object' || seen.has(node)) return;
  seen.add(node);
  if (skip && skip(node)) return;
  visit(node, pathArr);
  if (Array.isArray(node)) node.forEach((v, i) => walk(v, visit, pathArr.concat(i), seen, skip));
  else for (const [k, v] of Object.entries(node)) walk(v, visit, pathArr.concat(k), seen, skip);
}

const idOf = (n) => (n && typeof n === 'object' && !Array.isArray(n) ? n.goodsId ?? n.goods_id ?? n.productId ?? null : null);

// The goods object for THIS product (never a recommended product).
function findGoods(raw, expectedId) {
  const direct = raw?.rawData?.store?.goods;
  if (direct && (!expectedId || String(idOf(direct)) === expectedId)) return direct;
  if (!expectedId) return direct || null;
  let found = null;
  walk(raw, (n) => {
    if (found || Array.isArray(n)) return;
    if (String(idOf(n)) === expectedId && (n.goodsName || n.goods_name || n.gallery)) found = n;
  });
  return found;
}

// Skip subtrees that clearly belong to another product.
const otherProduct = (expectedId) => (n) => {
  const id = idOf(n);
  return !!(expectedId && id !== null && id !== undefined && String(id) !== expectedId);
};

// ---------- money ----------
function parseMoney(v) {
  const m = String(v ?? '').replace(/,/g, '').match(/(?:^|[^A-Za-z])([A-Z]{0,3})\s*([$€£¥])\s*(\d+(?:\.\d{1,2})?)/);
  if (!m) return null;
  const prefix = m[1] || '';
  const currency = m[2] === '$' && (prefix === '' || prefix === 'US') ? 'USD' : `${prefix}${m[2]}`;
  return { value: Number(m[3]), currency };
}

const LIST_KEY = /(line_?price|market|original|retail|was|before|strike|crossed)/i;
const NOT_PRICE_KEY = /type|flag|show|reduc|save|discount|coupon|percent|limit|count|rate|tag|icon|rich/i;

// Price for one SKU. Temu: normalPrice(Str) is what you pay, normalLinePrice(Str) is the crossed-out list price.
function skuPrices(n) {
  const out = { priceUsd: null, listPriceUsd: null, currency: null, source: null };
  const pick = (strKeys, numKeys) => {
    for (const k of strKeys) {
      const m = parseMoney(n[k]);
      if (m) return { ...m, source: k };
    }
    for (const k of numKeys) {
      if (Number.isFinite(n[k]) && n[k] > 0) return { value: Math.round(n[k]) / 100, currency: null, source: `${k}/100` };
    }
    return null;
  };
  const cur = pick(['normalPriceStr', 'salePriceStr', 'priceStr'], ['normalPrice', 'salePrice']);
  const list = pick(['normalLinePriceStr', 'linePriceStr', 'marketPriceStr'], ['normalLinePrice', 'linePrice', 'marketPrice']);
  if (cur) { out.priceUsd = cur.value; out.currency = cur.currency; out.source = cur.source; }
  if (list) out.listPriceUsd = list.value;
  if (out.priceUsd === null) {
    // Generic fallback for other sites: display strings first, then integer cents.
    const entries = [];
    for (const [k, v] of Object.entries(n)) {
      if (!/price/i.test(k) || LIST_KEY.test(k) || NOT_PRICE_KEY.test(k)) continue;
      if (typeof v === 'string' || typeof v === 'number') entries.push([k, v]);
      else if (v && typeof v === 'object' && !Array.isArray(v)) {
        for (const [k2, v2] of Object.entries(v)) {
          if (LIST_KEY.test(k2) || NOT_PRICE_KEY.test(k2)) continue;
          if (typeof v2 === 'string' || typeof v2 === 'number') entries.push([`${k}.${k2}`, v2]);
        }
      }
    }
    for (const [k, v] of entries) {
      const m = typeof v === 'string' ? parseMoney(v) : null;
      if (m) { out.priceUsd = m.value; out.currency = m.currency; out.source = k; break; }
    }
    if (out.priceUsd === null) {
      for (const [k, v] of entries) {
        if (typeof v === 'number' && Number.isInteger(v) && v >= 100 && v < 1000000) { out.priceUsd = v / 100; out.source = `${k}/100`; break; }
      }
    }
  }
  return out;
}

// ---------- SKUs ----------
function specPair(s) {
  if (!s || typeof s !== 'object') return null;
  const key = s.specKey ?? s.spec_key ?? s.parentSpecName ?? s.key ?? s.name ?? s.attrName ?? s.propName;
  const val = s.specValue ?? s.spec_value ?? s.specName ?? s.value ?? s.attrValue ?? s.propValue;
  if (typeof key === 'string' && (typeof val === 'string' || typeof val === 'number')) return [key.trim(), String(val).trim()];
  return null;
}

function skuFromNode(n) {
  const specArr = n.specs ?? n.specList ?? n.skuSpecs ?? n.spec ?? n.attrs ?? n.saleAttrs;
  if (!Array.isArray(specArr) || !specArr.length) return null;
  const pairs = specArr.map(specPair).filter(Boolean);
  if (!pairs.length) return null;
  const prices = skuPrices(n);
  const hasId = n.skuId !== undefined || n.sku_id !== undefined;
  if (prices.priceUsd === null && !hasId) return null;
  const priceFields = {};
  for (const [k, v] of Object.entries(n)) if (/price/i.test(k) && (typeof v === 'number' || typeof v === 'string')) priceFields[k] = v;
  const stock = Number.isFinite(n.stockQuantity) ? n.stockQuantity : Number.isFinite(n.stock) ? n.stock : null;
  const onSale = n.isOnsale ?? n.isOnSale ?? n.onSale;
  const thumb = n.thumbUrl ?? n.specShowImageUrl ?? n.thumb ?? n.imageUrl ?? n.image ?? null;
  return {
    skuId: String(n.skuId ?? n.sku_id ?? pairs.map((p) => p.join('=')).join('|')),
    specs: Object.fromEntries(pairs),
    priceUsd: prices.priceUsd,
    listPriceUsd: prices.listPriceUsd,
    currency: prices.currency,
    priceSource: prices.source,
    stock,
    inStock: (onSale === undefined || onSale === 1 || onSale === true) && (stock === null || stock > 0),
    sizeDesc: Array.isArray(n.sizeDescHoverLists) ? n.sizeDescHoverLists : undefined,
    thumb: typeof thumb === 'string' ? thumb : null,
    priceFields,
  };
}

function extractSkus(raw, expectedId) {
  const skus = [];
  const seen = new Set();
  const add = (s) => { if (s && !seen.has(s.skuId)) { seen.add(s.skuId); skus.push(s); } };
  const temuSkus = raw?.rawData?.store?.sku;
  if (Array.isArray(temuSkus) && temuSkus.length) {
    temuSkus.forEach((n) => add(skuFromNode(n)));
    return skus;
  }
  walk(raw, (n) => { if (!Array.isArray(n)) add(skuFromNode(n)); }, [], new Set(), otherProduct(expectedId));
  return skus;
}

function optionGroups(skus) {
  const groups = {};
  for (const s of skus) for (const [k, v] of Object.entries(s.specs)) {
    groups[k] ??= [];
    if (!groups[k].includes(v)) groups[k].push(v);
  }
  return groups;
}

function extractSizeChart(goods, skus) {
  const hits = [];
  walk(goods, (n, p) => {
    if (Array.isArray(n)) return;
    for (const [k, v] of Object.entries(n)) {
      if (/size.?(chart|guide|table|info|desc)|measure/i.test(k) && v !== null && v !== undefined && v !== '') hits.push({ path: p.concat(k).join('.'), value: v });
    }
  });
  const fromSkus = skus.filter((s) => s.sizeDesc).slice(0, 12).map((s) => ({ skuId: s.skuId, specs: s.specs, sizeDesc: s.sizeDesc }));
  return { fromGoods: hits.slice(0, 20), fromSkus };
}

// ---------- images ----------
const IMG_URL = /https?:\/\/[a-z0-9.-]+(?::\d+)?\/[^"'\s)\\<>]+?\.(?:jpe?g|png|webp|avif)/gi;
const IMG_JUNK = /upload_aimg|review|material-put|\/mall|logo|icon|avatar|banner|coupon|badge|sprite/i;

function allowedHost(u) {
  try {
    const h = new URL(u).hostname;
    if (/(^|\.)(kwcdn\.com|alicdn\.com|aliexpress-media\.com|temu\.com)$/i.test(h)) return true;
    const extra = (process.env.SUPPLIER_WATCH_EXTRA_HOSTS || '').split(',').map((s) => s.trim()).filter(Boolean);
    return extra.includes(h);
  } catch { return false; }
}

function canonicalImage(u) {
  try {
    const url = new URL(String(u).replace(/\\u002F/g, '/').replace(/\\\//g, '/'));
    url.search = '';
    url.hash = '';
    url.pathname = url.pathname.replace(/(\.(?:jpe?g|png|webp))_\d+x\d+[^/]*$/i, '$1');
    return url.toString();
  } catch { return null; }
}

function roleFromPath(p) {
  const s = p.join('.').toLowerCase();
  if (/size/.test(s)) return 'sizeGuide';
  if (/gallery|banner_?img|main_?img|image_?list|imagelist/.test(s)) return 'gallery';
  if (/detail|desc|floor/.test(s)) return 'description';
  if (/sku|spec|skc|color|colour/.test(s)) return 'colour';
  return 'other';
}

// Role-tagged product images from the goods object only (never recommendations or reviews).
function productImages(goods, skus, ogImage) {
  const list = [];
  const add = (u, role, extra = {}) => {
    const c = canonicalImage(u);
    if (!c || IMG_JUNK.test(c) || !allowedHost(c) || list.some((x) => x.url === c)) return;
    list.push({ url: c, role, ...extra });
  };
  for (const s of skus) if (s.thumb) add(s.thumb, 'colour', { spec: s.specs });
  if (goods) {
    walk(goods, (n, p) => {
      if (Array.isArray(n)) return;
      for (const [k, v] of Object.entries(n)) {
        if (typeof v !== 'string') continue;
        const s = v.replace(/\\u002F/g, '/').replace(/\\\//g, '/');
        for (const m of s.matchAll(IMG_URL)) add(m[0], roleFromPath(p.concat(k)), { srcPath: p.concat(k).join('.').slice(0, 120) });
      }
    }, [], new Set(), (n) => /review|comment|recommend|similar/i.test(Object.keys(n).join(',')) && !n.gallery);
  }
  if (ogImage) add(ogImage, 'gallery', { srcPath: 'og:image' });
  const order = { gallery: 0, colour: 1, description: 2, sizeGuide: 3, other: 4 };
  return list.sort((a, b) => order[a.role] - order[b.role]);
}

function extFor(contentType) {
  return { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/avif': '.avif', 'image/gif': '.gif' }[(contentType || '').split(';')[0].trim()] || null;
}

// ---------- text helpers ----------
function pickLines(text, re, max = 8) {
  const out = [];
  for (const l of text.split('\n').map((x) => x.trim()).filter(Boolean)) {
    if (re.test(l) && l.length < 200 && !out.includes(l)) out.push(l);
    if (out.length >= max) break;
  }
  return out;
}

const csvCell = (v) => {
  let s = String(v ?? '');
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

// ---------- per listing ----------
async function fetchListing(context, listing, opts) {
  const { id, url } = listing;
  const expectedId = goodsIdFromUrl(url);
  const listingDir = path.join(opts.out, id);
  const latestDir = path.join(listingDir, 'latest');
  const snapDir = path.join(listingDir, 'snapshots', opts.date);
  const imgDir = path.join(listingDir, 'images');
  const cacheDir = path.join(opts.cache, id);
  for (const d of [latestDir, snapDir, imgDir, cacheDir, path.join(cacheDir, 'api')]) await fs.mkdir(d, { recursive: true });
  // Per-run files that must not survive from an older run.
  for (const f of ['screenshot.jpg', 'size-guide.jpg', 'size-guide.txt', 'size-guide-tables.html', 'size-guide-api.json']) await fs.rm(path.join(latestDir, f), { force: true });

  const status = { id, date: opts.date, fetchedAt: new Date().toISOString(), status: 'ERROR', message: '', counts: {}, notes: [] };
  const page = await context.newPage();

  // Record JSON the page itself requests (size guide, sku/detail data). Never send requests of our own.
  const captured = [];
  page.on('response', (r) => {
    try {
      if (captured.length >= 40) return;
      const rt = r.request().resourceType();
      if (rt !== 'xhr' && rt !== 'fetch') return;
      const u = r.url();
      if (!/size|sku|goods|detail|spec|guide/i.test(u)) return;
      captured.push(r.text().then((t) => (t.length < 2_000_000 ? { url: u.split('?')[0], body: t } : null)).catch(() => null));
    } catch {}
  });

  const finish = async (st, msg) => {
    status.status = st;
    status.message = msg;
    return status;
  };

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await sleep(2500);

    // Wait for a human to clear a bot check or sign-in wall (headed runs only).
    let state = await pageState(page, expectedId);
    if (state.kind === 'unknown') { await sleep(4000); state = await pageState(page, expectedId); }
    if (state.kind !== 'product' && !opts.headless && opts.waitCaptcha > 0 && (state.kind === 'blocked' || state.kind === 'login' || state.kind === 'unknown')) {
      console.log(`[${id}] ${state.detail}. Clear it in the Chrome window (solve the check, or sign in if Temu insists); waiting up to ${opts.waitCaptcha}s...`);
      const until = Date.now() + opts.waitCaptcha * 1000;
      while (Date.now() < until && state.kind !== 'product') {
        await sleep(5000);
        state = await pageState(page, expectedId);
        if (state.kind === 'off' && !BLOCK_PATH.test(new URL(page.url()).pathname)) {
          // Temu sometimes lands on the home page after a check; go back to the product once.
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
          await sleep(3000);
          state = await pageState(page, expectedId);
        }
      }
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    }
    if (state.kind !== 'product') {
      await page.screenshot({ path: path.join(cacheDir, `${state.kind}.png`) }).catch(() => {});
      const map = { blocked: 'BLOCKED', login: 'LOGIN_REQUIRED', off: 'OFF_PRODUCT', region: 'WRONG_REGION', unknown: 'BLOCKED' };
      return await finish(map[state.kind] || 'ERROR', `${state.detail} at ${page.url().split('?')[0]}`);
    }

    // Dismiss pop-ups without clicking anything inside them.
    for (let i = 0; i < 3; i++) { await page.keyboard.press('Escape').catch(() => {}); await sleep(300); }

    // Scroll through the product section only; stop at the recommendations feed.
    const recoY = await page.evaluate(async (recoSrc) => {
      const reco = new RegExp(recoSrc, 'i');
      const findReco = () => {
        for (const el of document.querySelectorAll('h1,h2,h3,h4,div,span,p')) {
          if (el.children.length > 3) continue;
          const t = (el.innerText || '').trim();
          if (t.length < 60 && reco.test(t)) return el.getBoundingClientRect().top + window.scrollY;
        }
        return null;
      };
      const step = Math.max(400, Math.floor(window.innerHeight * 0.8));
      let stopAt = null;
      for (let y = 0; y < 12000; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 350));
        stopAt = findReco();
        if (stopAt !== null && y + window.innerHeight >= stopAt) break;
        if (y > document.documentElement.scrollHeight) break;
      }
      window.scrollTo(0, 0);
      return stopAt;
    }, RECO_HEADING.source).catch(() => null);
    await sleep(1200);

    // Capture everything BEFORE any click, so the data always comes from this product page.
    const raw = await page.evaluate(() => {
      const pick = (v) => { try { return v ? JSON.parse(JSON.stringify(v)) : null; } catch { return null; } };
      return { rawData: pick(window.rawData), nextData: pick(window.__NEXT_DATA__), initialState: pick(window.__INITIAL_STATE__), runParams: pick(window.runParams) };
    }).catch(() => ({}));
    const html = await page.content();
    const text = await page.locator('body').innerText().catch(() => '');
    const ldjson = await page.locator('script[type="application/ld+json"]').evaluateAll((s) => s.map((x) => x.textContent)).catch(() => []);
    const meta = await page.evaluate(() => {
      const m = (sel) => document.querySelector(sel)?.getAttribute('content') || null;
      return { ogTitle: m('meta[property="og:title"]'), ogImage: m('meta[property="og:image"]'), description: m('meta[name="description"]'), h1: document.querySelector('h1')?.innerText?.trim() || null };
    }).catch(() => ({}));
    const domImages = await page.evaluate((maxY) => {
      const out = [];
      for (const img of document.querySelectorAll('img')) {
        const r = img.getBoundingClientRect();
        const y = r.top + window.scrollY;
        if (maxY !== null && y >= maxY) continue;
        if ((img.naturalWidth || 0) < 300 && (img.naturalHeight || 0) < 300) continue;
        const src = img.currentSrc || img.src;
        if (src && /^https?:/.test(src)) out.push(src);
      }
      return out;
    }, recoY).catch(() => []);
    const loggedOutProof = /sign in\s*\/\s*register/i.test(text.slice(0, 3000));

    // Local cache (never committed): the full raw page.
    await fs.writeFile(path.join(cacheDir, 'page.html'), html);
    await fs.writeFile(path.join(cacheDir, 'page.txt'), text);
    await fs.writeFile(path.join(cacheDir, 'raw.json'), JSON.stringify({ ...raw, ldjson }, null, 1));
    await page.screenshot({ path: path.join(cacheDir, 'screenshot-full.png'), fullPage: true, timeout: 90000 }).catch(() => {});

    // Extract.
    const ldParsed = ldjson.map((s) => { try { return JSON.parse(s); } catch { return null; } }).filter(Boolean);
    const pageGoodsId = idOf(raw?.rawData?.store?.goods);
    if (expectedId && pageGoodsId !== null && pageGoodsId !== undefined && String(pageGoodsId) !== expectedId) {
      return await finish('OFF_PRODUCT', `page data is goods ${pageGoodsId}, expected ${expectedId}`);
    }
    const goods = findGoods(raw, expectedId);
    const skus = extractSkus(raw, expectedId);
    const ldProduct = ldParsed.flatMap((x) => (Array.isArray(x) ? x : [x])).find((x) => x && /product/i.test(String(x['@type'])));
    const title = goods?.goodsName || goods?.goods_name || raw?.runParams?.data?.titleModule?.subject || ldProduct?.name || meta.ogTitle || meta.h1 || null;
    const goodsPrice = goods ? {
      min: Number.isFinite(goods.minOnSalePrice) ? goods.minOnSalePrice / 100 : null,
      max: Number.isFinite(goods.maxOnSalePrice) ? goods.maxOnSalePrice / 100 : null,
      text: goods.minToMaxPriceStr || goods.priceStr || null,
    } : null;
    const currencies = [...new Set(skus.map((s) => s.currency).filter(Boolean))];
    if (currencies.some((c) => c !== 'USD')) {
      return await finish('WRONG_REGION', `prices are in ${currencies.join(', ')}, not USD`);
    }
    const domPrices = [...new Set((text.slice(0, 6000).match(/\$\s?\d{1,4}(?:[.,]\d{2})?/g) || []).map((p) => p.replace(/\s/g, '')))].slice(0, 12);

    // Page screenshot goes to the public repo only when the page proves we are signed out.
    if (loggedOutProof) {
      const h = Math.min(await page.evaluate(() => document.documentElement.scrollHeight).catch(() => 4000), recoY ? Math.max(1200, recoY) : 8000, 8000);
      await page.screenshot({ path: path.join(latestDir, 'screenshot.jpg'), type: 'jpeg', quality: 60, fullPage: true, clip: { x: 0, y: 0, width: 1366, height: h }, timeout: 90000 })
        .catch((e) => status.notes.push(`screenshot failed: ${first(e.message)}`));
    } else {
      status.notes.push('page screenshot kept in the local cache only (could not prove the browser is signed out)');
    }

    // Size guide (read-only click), captured last.
    const urlBefore = page.url();
    const sizeGuide = { status: 'not found', text: null, tables: 0, images: [] };
    const SIZE_RE = /size (guide|chart)|sizing (guide|chart)|size reference/i;
    const candidates = (await page.getByText(SIZE_RE).all().catch(() => [])).slice(0, 12);
    for (const c of candidates) {
      const ok = await c.evaluate((e) => {
        const r = e.getBoundingClientRect();
        if (!r.width || !r.height) return false;
        if ((e.innerText || '').trim().length > 40) return false;
        const a = e.closest('a[href]');
        return !(a && !/^(#|javascript:)/i.test(a.getAttribute('href') || ''));
      }).catch(() => false);
      if (!ok) continue;
      const respP = page.waitForResponse((r) => /size_?guide|size.?chart/i.test(r.url()), { timeout: 8000 }).catch(() => null);
      const res = await safeClick(c);
      if (!res.clicked) { sizeGuide.status = `click skipped: ${res.reason}`; continue; }
      await respP;
      await sleep(1500);
      if (page.url() !== urlBefore) {
        sizeGuide.status = 'click navigated away; went back';
        await page.goBack({ timeout: 30000 }).catch(() => {});
        continue;
      }
      const dlg = page.locator('[role="dialog"], [aria-modal="true"], [class*="modal" i], [class*="popup" i], [class*="drawer" i]')
        .filter({ visible: true }).filter({ hasText: /chest|bust|length|waist|hip|sleeve|shoulder|\bcm\b|inch/i }).last();
      await dlg.waitFor({ state: 'visible', timeout: 6000 }).catch(() => {});
      if (!(await dlg.count().catch(() => 0))) { sizeGuide.status = 'clicked but no size dialog appeared'; break; }
      sizeGuide.text = (await dlg.innerText().catch(() => '')).slice(0, 8000);
      const tables = await dlg.locator('table').evaluateAll((ts) => ts.map((t) => t.outerHTML)).catch(() => []);
      sizeGuide.tables = tables.length;
      if (tables.length) await fs.writeFile(path.join(latestDir, 'size-guide-tables.html'), tables.join('\n\n'));
      sizeGuide.images = await dlg.locator('img').evaluateAll((is) => is.map((i) => i.currentSrc || i.src).filter((s) => /^https?:/.test(s))).catch(() => []);
      await dlg.screenshot({ path: path.join(latestDir, 'size-guide.jpg'), type: 'jpeg', quality: 75, timeout: 30000 })
        .catch((e) => status.notes.push(`size guide screenshot failed: ${first(e.message)}`));
      if (sizeGuide.text) await fs.writeFile(path.join(latestDir, 'size-guide.txt'), sizeGuide.text);
      sizeGuide.status = 'captured';
      await page.keyboard.press('Escape').catch(() => {});
      break;
    }

    // Captured API JSON: everything to the local cache; size-guide responses also to the repo.
    const apis = (await Promise.allSettled(captured)).map((r) => r.value).filter(Boolean);
    let n = 0;
    const sgApi = [];
    for (const a of apis) {
      await fs.writeFile(path.join(cacheDir, 'api', `${String(++n).padStart(2, '0')}.json`), JSON.stringify(a, null, 1)).catch(() => {});
      if (/size_?guide|size.?chart/i.test(a.url)) { try { sgApi.push({ url: a.url, json: JSON.parse(a.body) }); } catch {} }
    }
    if (sgApi.length) await fs.writeFile(path.join(latestDir, 'size-guide-api.json'), JSON.stringify(sgApi, null, 1));

    // Images: product-only, role-tagged.
    let images = productImages(goods, skus, meta.ogImage);
    for (const u of sizeGuide.images) {
      const c = canonicalImage(u);
      if (c && allowedHost(c) && !images.some((x) => x.url === c)) images.push({ url: c, role: 'sizeGuide', srcPath: 'size guide dialog' });
    }
    if (!images.length) {
      for (const u of domImages) {
        const c = canonicalImage(u);
        if (c && allowedHost(c) && !IMG_JUNK.test(c) && !images.some((x) => x.url === c)) images.push({ url: c, role: 'other', srcPath: 'page image above recommendations' });
      }
    }
    const queue = images.slice(0, opts.maxImages);
    const notAttempted = images.length - queue.length;
    const saved = [];
    const failed = [];
    async function worker() {
      while (queue.length) {
        const img = queue.shift();
        try {
          const res = await context.request.get(img.url, { timeout: 30000, headers: { referer: url } });
          const ct = res.headers()['content-type'] || '';
          const ext = extFor(ct);
          if (!res.ok()) { failed.push({ url: img.url, why: `http ${res.status()}` }); continue; }
          if (!ext) { failed.push({ url: img.url, why: `not an image (${ct || 'no type'})` }); continue; }
          const body = await res.body();
          if (body.length < 2000 || body.length > 3 * 1024 * 1024) { failed.push({ url: img.url, why: `size ${body.length}` }); continue; }
          const file = `${crypto.createHash('sha256').update(body).digest('hex').slice(0, 16)}${ext}`;
          const dest = path.join(imgDir, file);
          if (!existsSync(dest)) await fs.writeFile(dest, body);
          saved.push({ ...img, file: `images/${file}`, bytes: body.length });
        } catch (e) {
          failed.push({ url: img.url, why: first(e.message, 120) });
        }
      }
    }
    await Promise.all([worker(), worker()]);
    saved.sort((a, b) => images.findIndex((x) => x.url === a.url) - images.findIndex((x) => x.url === b.url));

    const missingPrices = skus.filter((s) => s.priceUsd === null).length;
    const listingJson = {
      id, url, goodsId: expectedId, finalUrl: page.url().split('?')[0], fetchedAt: status.fetchedAt, date: opts.date,
      title, goodsPrice,
      options: optionGroups(skus),
      skus: skus.map(({ priceFields, ...s }) => s),
      domPrices,
      rating: pickLines(text, /(\d(\.\d)?\s*(out of 5|stars?|★))|(\d[\d,.]*k?\+?\s*reviews?)/i, 4),
      sold: pickLines(text, /\d[\d,.]*k?\+?\s*sold/i, 3),
      shipping: pickLines(text, /free shipping|delivery|arrives|ships? from|local warehouse|days?\b.*deliver/i, 8),
      sizeChart: { ...extractSizeChart(goods, skus), dialog: sizeGuide.status, tables: sizeGuide.tables, api: sgApi.length },
      images: saved,
      imageFailures: failed.slice(0, 40),
      imagesNotAttempted: notAttempted,
    };
    await fs.writeFile(path.join(latestDir, 'listing.json'), JSON.stringify(listingJson, null, 2));
    await fs.writeFile(path.join(snapDir, 'listing.json'), JSON.stringify(listingJson, null, 2));
    // Product-only raw data (no session or account data) so the cloud agent can re-parse.
    await fs.writeFile(path.join(latestDir, 'product.json'), JSON.stringify({ goods, sku: raw?.rawData?.store?.sku ?? skus.map((s) => s.priceFields), ldProduct: ldProduct ?? null }, null, 1));

    // Price history.
    const histFile = path.join(listingDir, 'price-history.csv');
    if (!existsSync(histFile)) await fs.writeFile(histFile, 'date,fetched_at,sku_id,options,price_usd,list_price_usd,stock,in_stock\n');
    if (skus.length) {
      const rows = skus.map((s) => [opts.date, status.fetchedAt, s.skuId, Object.entries(s.specs).map(([k, v]) => `${k}=${v}`).join('; '), s.priceUsd ?? '', s.listPriceUsd ?? '', s.stock ?? '', s.inStock ? 'yes' : 'no'].map(csvCell).join(','));
      await fs.appendFile(histFile, rows.join('\n') + '\n');
    }

    // Prune photos that are no longer part of the listing (git history keeps them).
    if (saved.length) {
      const keep = new Set(saved.map((s) => path.basename(s.file)));
      for (const f of await fs.readdir(imgDir)) if (!keep.has(f)) await fs.rm(path.join(imgDir, f), { force: true });
    }

    status.counts = { skus: skus.length, skusWithoutPrice: missingPrices, optionGroups: Object.keys(listingJson.options).length, imagesFound: images.length, imagesSaved: saved.length, imageFailures: failed.length, imagesNotAttempted: notAttempted };
    if (!skus.length) return await finish('PARTIAL', 'page saved but no size/colour data parsed; product.json kept for manual parsing');
    if (missingPrices) return await finish('PARTIAL', `${missingPrices} of ${skus.length} sizes/colours have no parsed price; see product.json`);
    if (!saved.length) return await finish('PARTIAL', 'no product photos saved; see imageFailures');
    return await finish('OK', 'ok');
  } catch (e) {
    await page.screenshot({ path: path.join(cacheDir, 'error.png') }).catch(() => {});
    return await finish('ERROR', first(e.stack || e, 500));
  } finally {
    await fs.writeFile(path.join(latestDir, 'status.json'), JSON.stringify(status, null, 2)).catch(() => {});
    await fs.writeFile(path.join(snapDir, 'status.json'), JSON.stringify(status, null, 2)).catch(() => {});
    await page.close().catch(() => {});
  }
}

// ---------- entry ----------
const EXIT = { OK: 0, PARTIAL: 3, BLOCKED: 2, LOGIN_REQUIRED: 2, OFF_PRODUCT: 1, WRONG_REGION: 1, ERROR: 1 };

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) { console.log(HELP); return 0; }
  const opts = {
    headless: args.headless,
    waitCaptcha: Number.isFinite(args.waitCaptcha) ? args.waitCaptcha : 180,
    maxImages: Number.isFinite(args.maxImages) ? args.maxImages : 40,
    out: path.resolve(args.out || path.join(REPO, 'venture/08-weighted-hoodie/supplier')),
    profile: path.resolve(args.profile || path.join(os.homedir(), '.supplier-watch-profile')),
    cache: path.resolve(args.cache || path.join(os.homedir(), '.supplier-watch-cache')),
    date: args.date || localDate(),
  };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(opts.date)) throw new Error(`bad --date ${opts.date}`);
  const repoReal = realpathSync(REPO).toLowerCase();
  for (const [name, dir] of [['profile', opts.profile], ['cache', opts.cache]]) {
    const r = realLower(dir);
    if (r === repoReal || r.startsWith(repoReal + path.sep)) throw new Error(`${name} dir must be outside the repo (the repo is public)`);
  }

  let listings;
  if (args.url) {
    if (!args.id) throw new Error('--url needs --id <slug>');
    listings = [{ id: args.id, url: args.url }];
  } else {
    const cfg = JSON.parse(await fs.readFile(path.join(HERE, 'listings.json'), 'utf8'));
    listings = cfg.listings.filter((l) => l.enabled !== false && (!args.id || l.id === args.id));
    if (!listings.length) throw new Error(args.id ? `no enabled listing with id ${args.id}` : 'no enabled listings');
  }
  for (const l of listings) if (!/^[a-z0-9][a-z0-9-]{1,60}$/.test(l.id)) throw new Error(`bad listing id ${l.id} (lowercase letters, digits, dashes)`);

  // Whole-run watchdog: a hung page or browser can never block the next scheduled run.
  setTimeout(() => { console.error('watchdog: run exceeded 25 minutes'); process.exit(1); }, 25 * 60_000).unref();

  const { chromium } = await import('playwright');
  const launch = (channel, profile) => chromium.launchPersistentContext(profile, {
    channel, headless: opts.headless, viewport: { width: 1366, height: 900 }, locale: 'en-US', acceptDownloads: false,
  });
  let context;
  const wanted = process.env.SUPPLIER_WATCH_CHANNEL ?? 'chrome';
  try {
    context = await launch(wanted === 'chromium' ? undefined : wanted, opts.profile);
  } catch (e) {
    console.error(`${wanted} launch failed: ${first(e.message)}`);
    if (!existsSync(chromium.executablePath())) throw new Error('No usable browser. Install Google Chrome, or run: npx playwright install chromium');
    context = await launch(undefined, `${opts.profile}-chromium`);
  }
  console.log(`browser: ${context.browser()?.version() ?? 'persistent context'}`);

  const results = [];
  try {
    for (const l of listings) {
      console.log(`[${l.id}] fetching ${l.url}`);
      const r = await Promise.race([
        fetchListing(context, l, opts),
        sleep(10 * 60_000).then(() => ({ id: l.id, status: 'ERROR', message: 'listing timed out after 10 minutes', counts: {} })),
      ]);
      console.log(`[${l.id}] ${r.status}: ${r.message} ${JSON.stringify(r.counts)}`);
      results.push(r);
      await sleep(3000);
    }
  } finally {
    await context.close().catch(() => {});
  }
  const codes = results.map((r) => EXIT[r.status] ?? 1);
  if (codes.includes(1)) return 1;
  if (codes.includes(2)) return 2;
  if (codes.includes(3)) return 3;
  return 0;
}

main().then((code) => process.exit(code)).catch((e) => { console.error(e.message || e); process.exit(1); });
