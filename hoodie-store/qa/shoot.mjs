// QA for the brand site: screenshots plus layout and checkout checks.
//
//   NODE_PATH=$(npm root -g) node qa/shoot.mjs [siteDir] [flowSiteDir]
//
// siteDir      the normal build (default: ../site). Screenshots go next to this script.
// flowSiteDir  optional build made with a test payment link and tracking IDs, e.g.
//              python3 build.py --out /tmp/flow --set payment_link=https://buy.stripe.com/test_qa \
//                --set meta_pixel_id=123456789012 --set ga4_id=G-TEST1234
//              Used to test the Buy flow (client_reference_id, UTM pass-through, events).
// Exits 1 if any check fails.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const { chromium } = createRequire(import.meta.url)('playwright'); // resolved through NODE_PATH

const here = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(process.argv[2] || path.join(here, '..', 'site'));
const flowDir = process.argv[3] ? path.resolve(process.argv[3]) : null;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.svg': 'image/svg+xml', '.js': 'text/javascript',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.txt': 'text/plain', '.xml': 'application/xml', '.json': 'application/json' };
const failures = [];
const ok = (cond, msg) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`); if (!cond) failures.push(msg); };

function serve(dir) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (p.endsWith('/')) p += 'index.html';
      const file = path.join(dir, p);
      if (!file.startsWith(dir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404, { 'content-type': types['.html'] });
        res.end(fs.readFileSync(path.join(dir, '404.html')));
        return;
      }
      res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
      res.end(fs.readFileSync(file));
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

// The browser talks to the local server directly. Google Fonts are fetched by Node instead
// (run with NODE_USE_ENV_PROXY=1 behind a proxy); if that fails the page uses fallback fonts.
const browser = await chromium.launch();
const fontCache = new Map();
async function newCtx(opts) {
  const ctx = await browser.newContext(opts);
  await ctx.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, async (route) => {
    const url = route.request().url();
    try {
      if (!fontCache.has(url)) {
        const r = await fetch(url, { headers: { 'user-agent': route.request().headers()['user-agent'] || 'Mozilla/5.0' } });
        fontCache.set(url, { status: r.status, type: r.headers.get('content-type') || '', body: Buffer.from(await r.arrayBuffer()) });
      }
      const c = fontCache.get(url);
      await route.fulfill({ status: c.status, contentType: c.type, body: c.body, headers: { 'access-control-allow-origin': '*' } });
    } catch {
      await route.fulfill({ status: 503, body: '' });
    }
  });
  return ctx;
}

async function layoutChecks(page, label) {
  const r = await page.evaluate(() => {
    const de = document.documentElement;
    const wide = [...document.querySelectorAll('body *')].filter((el) => {
      const b = el.getBoundingClientRect();
      return b.width > 0 && (b.right > de.clientWidth + 1 || b.left < -1) && getComputedStyle(el).position !== 'fixed';
    }).slice(0, 5).map((el) => el.tagName + '.' + el.className);
    const imgs = [...document.images].filter((i) => !i.getAttribute('alt'));
    const svgs = [...document.querySelectorAll('svg[role="img"]')].filter((s) => !s.getAttribute('aria-label'));
    const inlineJs = [...document.scripts].filter((s) => !s.src && !/json/.test(s.type)).reduce((n, s) => n + s.textContent.length, 0);
    // Side gutters: below 1200 px no text block may sit closer than 15 px to either screen edge.
    const tight = de.clientWidth > 1200 ? [] : [...document.querySelectorAll('main h1, main h2, main p, main li')].filter((el) => {
      const b = el.getBoundingClientRect();
      return b.width > 0 && b.height > 0 && (b.left < 15 || b.right > de.clientWidth - 15);
    }).slice(0, 5).map((el) => `${el.tagName}.${el.className} (${Math.round(el.getBoundingClientRect().left)}..${Math.round(el.getBoundingClientRect().right)})`);
    return { sw: de.scrollWidth, cw: de.clientWidth, wide, tight, noAlt: imgs.length, svgNoLabel: svgs.length, inlineJs,
      fonts: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family) };
  });
  ok(r.sw <= r.cw, `${label}: no horizontal scroll (scrollWidth ${r.sw} vs ${r.cw})${r.wide.length ? ' overflowing: ' + r.wide.join(', ') : ''}`);
  ok(r.tight.length === 0, `${label}: text keeps a side gutter of at least 15 px${r.tight.length ? ' too close: ' + r.tight.join(', ') : ''}`);
  ok(r.noAlt === 0 && r.svgNoLabel === 0, `${label}: every image has alt text / every drawing has a label`);
  ok(r.inlineJs < 15 * 1024, `${label}: inline JS ${r.inlineJs} bytes (< 15 KB)`);
  console.log(`      fonts loaded: ${[...new Set(r.fonts)].join(', ') || 'none (fallback fonts)'}`);
}

// ---- 1. Screenshots of the real build
// With the tracking IDs empty, no pixel or analytics loader may be in any page. (The guarded
// window.fbq / window.gtag calls in app.js are not pixel code: they do nothing without a loader.)
for (const f of fs.readdirSync(siteDir).filter((n) => n.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(siteDir, f), 'utf8');
  const hit = html.match(/connect\.facebook\.net|googletagmanager\.com|fbq\('init'/);
  ok(!hit, `${f}: no pixel or analytics loader with the IDs empty${hit ? ' (found ' + hit[0] + ')' : ''}`);
}
const server = await serve(siteDir);
const base = `http://127.0.0.1:${server.address().port}`;
for (const [name, viewport] of [['desktop', { width: 1366, height: 900 }], ['tablet', { width: 768, height: 1024 }], ['mobile', { width: 375, height: 812 }]]) {
  const ctx = await newCtx({ viewport, deviceScaleFactor: 1, isMobile: name === 'mobile', hasTouch: name !== 'desktop' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await layoutChecks(page, name);
  ok(errors.length === 0, `${name}: no console errors ${errors.join(' | ')}`);
  ok(await page.locator('#buy-main').isDisabled(), `${name}: Buy is disabled while payment_link is empty`);
  await page.screenshot({ path: path.join(here, `${name}.png`), fullPage: true });
  if (name === 'mobile') {
    const top = await newCtx({ viewport, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const p2 = await top.newPage();
    await p2.goto(base + '/', { waitUntil: 'networkidle' });
    await p2.screenshot({ path: path.join(here, 'mobile-top.png') });
    await p2.evaluate(() => window.scrollTo({ top: document.querySelector('#details').offsetTop, behavior: 'instant' }));
    await p2.waitForTimeout(800);
    ok(await p2.locator('.buybar').evaluate((el) => el.classList.contains('show') && getComputedStyle(el).visibility === 'visible'),
      'mobile: sticky buy bar shows after scrolling past the buy button');
    await p2.screenshot({ path: path.join(here, 'mobile-sticky.png') });
    await top.close();
  }
  for (const sub of ['policies.html', 'thank-you.html', 'no-such-page']) {
    await page.goto(`${base}/${sub}`, { waitUntil: 'networkidle' });
    await layoutChecks(page, `${name} ${sub}`);
    if (name === 'mobile' && sub === 'policies.html') await page.screenshot({ path: path.join(here, 'mobile-policies.png'), fullPage: true });
    if (name !== 'mobile' && sub === 'policies.html') await page.screenshot({ path: path.join(here, `${name}-policies.png`), fullPage: true });
  }
  await ctx.close();
}
server.close();

// ---- 2. Buy flow on a build with a test payment link and tracking IDs
if (flowDir) {
  const s2 = await serve(flowDir);
  const b2 = `http://127.0.0.1:${s2.address().port}`;
  const ctx = await newCtx({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  await ctx.route('https://connect.facebook.net/**', (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
  await ctx.route('https://www.googletagmanager.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
  let checkoutUrl = null;
  await ctx.route('https://buy.stripe.com/**', (r) => { checkoutUrl = r.request().url(); r.fulfill({ status: 200, contentType: 'text/html', body: '<p>stub checkout</p>' }); });
  const page = await ctx.newPage();
  await page.goto(`${b2}/?utm_source=meta&utm_campaign=cloak-test&fbclid=x`, { waitUntil: 'networkidle' });
  const q0 = await page.evaluate(() => (window.fbq.queue || []).map((a) => a[1]));
  ok(q0.includes('ViewContent'), `pixel: ViewContent fired on load (${q0.join(', ')})`);
  ok(await page.evaluate(() => window.dataLayer.some((a) => a[0] === 'event' && a[1] === 'view_item')), 'ga4: view_item fired on load');
  await page.locator('#buy-main').click();
  await page.waitForTimeout(400);
  ok(checkoutUrl === null && await page.locator('#size-err').isVisible(), 'buy without a size asks for a size and does not leave the page');
  await page.locator('label.choice:has(input[value="olive"])').click();
  ok(await page.evaluate(() => getComputedStyle(document.querySelector('.hero')).getPropertyValue('--cloak').trim()) === '#5e6249',
    'choosing a colour repaints the illustration');
  await page.locator('label.choice:has(input[name="size"][value="m"])').click();
  const summary = await page.locator('.summary').textContent();
  ok(/Olive .* Size M .* Qty 1/.test(summary), `summary line updates: "${summary}"`);
  await Promise.all([page.waitForURL(/buy\.stripe\.com/), page.locator('#buy-main').click()]);
  ok(checkoutUrl === 'https://buy.stripe.com/test_qa?client_reference_id=olive-m&utm_source=meta&utm_campaign=cloak-test',
    `checkout URL: ${checkoutUrl}`);
  await page.goBack({ waitUntil: 'networkidle' });
  // Sticky bar path
  checkoutUrl = null;
  await page.goto(`${b2}/`, { waitUntil: 'networkidle' });
  await page.locator('label.choice:has(input[name="size"][value="2xl"])').click();
  await page.evaluate(() => window.scrollTo({ top: document.querySelector('#faq').offsetTop, behavior: 'instant' }));
  await page.waitForTimeout(500);
  const q1 = page.evaluate(() => 0);
  await Promise.all([page.waitForURL(/buy\.stripe\.com/), page.locator('.buybar .btn').click()]);
  ok(checkoutUrl === 'https://buy.stripe.com/test_qa?client_reference_id=charcoal-2xl', `sticky bar checkout URL: ${checkoutUrl}`);
  await q1;
  // InitiateCheckout recorded before leaving
  const p3 = await ctx.newPage();
  await p3.goto(`${b2}/`, { waitUntil: 'networkidle' });
  await p3.evaluate(() => { window.__nav = null; });
  await p3.locator('label.choice:has(input[name="size"][value="l"])').click();
  await p3.route('https://buy.stripe.com/**', (r) => r.abort());
  await p3.locator('#buy-main').click();
  await p3.waitForTimeout(100);
  const q2 = await p3.evaluate(() => (window.fbq.queue || []).map((a) => a[1]));
  ok(q2.includes('InitiateCheckout'), 'pixel: InitiateCheckout fired on Buy click');
  ok(await p3.evaluate(() => window.dataLayer.some((a) => a[0] === 'event' && a[1] === 'begin_checkout')), 'ga4: begin_checkout fired on Buy click');
  // Thank-you page Purchase, once per session id
  const p4 = await ctx.newPage();
  await p4.goto(`${b2}/thank-you.html?session_id=cs_test_123`, { waitUntil: 'networkidle' });
  const q3 = await p4.evaluate(() => (window.fbq.queue || []).filter((a) => a[1] === 'Purchase').length);
  await p4.reload({ waitUntil: 'networkidle' });
  const q4 = await p4.evaluate(() => (window.fbq.queue || []).filter((a) => a[1] === 'Purchase').length);
  ok(q3 === 1 && q4 === 0, 'thank-you: Purchase fires once per checkout session, not on reload');
  await ctx.close();
  s2.close();
}

await browser.close();
console.log(failures.length ? `\n${failures.length} check(s) failed` : '\nAll checks passed');
process.exit(failures.length ? 1 : 0);
