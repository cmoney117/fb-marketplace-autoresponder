// Offline test for fetch_listing.mjs against fake Temu-style pages.
// Run: npx playwright install chromium (once), then: node test/run_fixture_test.mjs
import http from 'node:http';
import zlib from 'node:zlib';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.resolve(HERE, '../fetch_listing.mjs');
const GID = '607560786669025';

// Minimal PNG with deterministic noise so it is a realistic size.
function png(w, h, [r, g, b]) {
  let seed = r * 65536 + g * 256 + b + 1;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed & 0x1f; };
  const rows = [];
  for (let y = 0; y < h; y++) {
    const row = Buffer.alloc(1 + w * 3);
    for (let x = 0; x < w; x++) { row[1 + x * 3] = (r + rnd()) & 255; row[2 + x * 3] = (g + rnd()) & 255; row[3 + x * 3] = (b + rnd()) & 255; }
    rows.push(row);
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(td));
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(Buffer.concat(rows))), chunk('IEND', Buffer.alloc(0))]);
}

const IMAGES = {
  '/img/gallery-1.png': png(400, 400, [20, 20, 20]),
  '/img/gallery-2.png': png(400, 400, [120, 120, 120]),
  '/img/black.png': png(400, 400, [0, 0, 0]),
  '/img/grey.png': png(400, 400, [128, 128, 128]),
  '/img/sizechart.png': png(600, 400, [240, 240, 240]),
  '/img/other.png': png(400, 400, [200, 30, 30]),
};

const requests = [];

function productHtml(base, { goodsId = GID, signedOut = true } = {}) {
  const rawData = {
    store: {
      crumbOptList: [{ title: "Women's Clothing" }],
      userInfo: { email: 'owner@example.com', name: 'Owner Name' },
      goods: {
        goodsId,
        goodsName: '2026 Unisex Punk Hooded Button Loose Cloak Fall Winter',
        minOnSalePrice: 2999, maxOnSalePrice: 3399, minToMaxPriceStr: '$29.99-$33.99',
        gallery: [{ id: 1, url: `${base}/img/gallery-1.png?imageView2/2/w/300` }, { id: 2, url: `${base}/img/gallery-2.png` }],
        productDetail: { floorList: [{ items: [{ url: `${base}/img/fake.png` }] }] },
      },
      sku: [
        { skuId: 1001, specs: [{ specKey: 'Color', specValue: 'Black' }, { specKey: 'Size', specValue: 'M' }], normalPrice: 2999, normalPriceStr: '$29.99', normalLinePrice: 5999, normalLinePriceStr: '$59.99', stockQuantity: 120, limitQuantity: 99, isOnsale: 1, thumbUrl: `${base}/img/black.png` },
        { skuId: 1002, specs: [{ specKey: 'Color', specValue: 'Black' }, { specKey: 'Size', specValue: 'L' }], normalPrice: 3199, normalPriceStr: '$31.99', normalLinePrice: 5999, normalLinePriceStr: '$59.99', stockQuantity: 80, isOnsale: 1, thumbUrl: `${base}/img/black.png` },
        { skuId: 1003, specs: [{ specKey: 'Color', specValue: 'Grey' }, { specKey: 'Size', specValue: 'XL' }], normalPrice: 3399, normalLinePrice: 5999, stockQuantity: 0, isOnsale: 1, priceType: 1, thumbUrl: `${base}/img/grey.png` },
        { skuId: 1004, specs: [{ specKey: '=HYPERLINK("http://evil")', specValue: 'M' }], normalPriceStr: '$29.99', stockQuantity: 5 },
      ],
      recommend: { goodsList: [{ goodsId: '999', goodsName: 'Other Product', gallery: [{ url: `${base}/img/other.png` }] }] },
      review: { list: [{ pic: `${base}/img/review-1.png` }] },
    },
  };
  return `<!doctype html><html><head><title>Temu fixture</title>
<meta property="og:title" content="2026 Unisex Punk Hooded Button Loose Cloak">
<script>window.rawData = ${JSON.stringify(rawData)};</script></head>
<body>
<header>${signedOut ? 'Sign in / Register' : 'Hi, Owner'}</header>
<h1>2026 Unisex Punk Hooded Button Loose Cloak Fall Winter</h1>
<div class="price">$29.99 <s>$59.99</s></div>
<div>4.6 out of 5 · 1,234 reviews · 10K+ sold</div>
<div>Free shipping · Delivery: Oct 21-28 · Ships from local warehouse</div>
<img src="/img/gallery-1.png" width="400" height="400" alt="g1">
<p><a href="/other.html">Women Plus Size Chart Fit Fleece Hoodie</a></p>
<button id="cart" onclick="fetch('/cart-clicked')">Add to cart</button>
<button id="buy" onclick="fetch('/buy-clicked')">Buy now</button>
<span role="button" id="sg" onclick="fetch('/api/oak/size_guide/render',{method:'POST'}).then(()=>{document.getElementById('modal').style.display='block'})">Size guide</span>
<div style="height:1500px">long description</div>
<h2>You may also like</h2>
<img src="/img/other.png" width="400" height="400" alt="other">
<div style="height:3000px">feed</div>
<div id="modal" role="dialog" style="display:none;position:fixed;top:10px;left:10px;background:#fff">
  <table><tr><th>Size</th><th>Length</th><th>Chest</th></tr><tr><td>M</td><td>45</td><td>60</td></tr><tr><td>L</td><td>47</td><td>63</td></tr></table>
  <img src="/img/sizechart.png" width="300" height="200" alt="chart">
</div>
</body></html>`;
}

const BLOCKED_HTML = `<!doctype html><html><body><h2>Security verification</h2><p>Slide to verify you are human</p></body></html>`;
const LOGIN_HTML = `<!doctype html><html><body><h2>Sign in / Register</h2><p>Please sign in to continue</p></body></html>`;

function serve() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      requests.push(req.url);
      const base = `http://127.0.0.1:${srv.address().port}`;
      const p = req.url.split('?')[0];
      const html = (body) => { res.writeHead(200, { 'content-type': 'text/html' }); res.end(body); };
      if (p === `/cloak-g-${GID}.html` || p === `/ca/cloak-g-${GID}.html`) return html(productHtml(base));
      if (p === `/signed-g-${GID}.html`) return html(productHtml(base, { signedOut: false }));
      if (p === '/cloak-g-111111111111.html') return html(productHtml(base));
      if (p === '/bgn_verification.html' || p === '/blocked.html') return html(BLOCKED_HTML);
      if (p === '/login.html') return html(LOGIN_HTML);
      if (p === '/other.html') return html('<h1>OTHER PRODUCT</h1>');
      if (p === '/api/oak/size_guide/render') { res.writeHead(200, { 'content-type': 'application/json' }); return res.end(JSON.stringify({ size_chart: { records_inch: [['M', '45', '60'], ['L', '47', '63']] } })); }
      if (p === '/img/fake.png') return html('<html>not an image</html>'.repeat(200));
      const img = IMAGES[p];
      if (img) { res.writeHead(200, { 'content-type': 'image/png' }); return res.end(img); }
      res.writeHead(404); res.end('nf');
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

function run(args) {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, [SCRIPT, ...args], { env: { ...process.env, SUPPLIER_WATCH_CHANNEL: 'chromium', SUPPLIER_WATCH_EXTRA_HOSTS: '127.0.0.1' }, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    p.stdout.on('data', (d) => { out += d; });
    p.stderr.on('data', (d) => { out += d; });
    p.on('close', (code) => resolve({ code, out }));
  });
}

const srv = await serve();
const base = `http://127.0.0.1:${srv.address().port}`;
const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'supplier-watch-test-'));
const out = path.join(tmp, 'out');
const common = ['--out', out, '--profile', path.join(tmp, 'profile'), '--cache', path.join(tmp, 'cache'), '--headless', '--wait-captcha', '0'];
let failures = 0;
const check = (name, fn) => { try { fn(); console.log(`PASS ${name}`); } catch (e) { failures++; console.log(`FAIL ${name}: ${e.message}`); } };
const readJson = async (f) => JSON.parse(await fs.readFile(f, 'utf8'));
const exists = (f) => fs.access(f).then(() => true, () => false);

try {
  // 1. Normal product page.
  const r1 = await run(['--url', `${base}/cloak-g-${GID}.html`, '--id', 'fixture-product', '--date', '2026-10-15', ...common]);
  console.log(r1.out.trim());
  const dir = path.join(out, 'fixture-product');
  const listing = await readJson(path.join(dir, 'latest/listing.json'));
  const status = await readJson(path.join(dir, 'latest/status.json'));
  const sku = (id) => listing.skus.find((s) => s.skuId === id);
  check('exit 0 and OK', () => { assert.equal(r1.code, 0); assert.equal(status.status, 'OK'); });
  check('title is the product, not a breadcrumb', () => assert.match(listing.title, /Punk Hooded Button Loose Cloak/));
  check('4 skus from store.sku', () => assert.equal(listing.skus.length, 4));
  check('selling price from normalPriceStr', () => { assert.equal(sku('1001').priceUsd, 29.99); assert.equal(sku('1002').priceUsd, 31.99); });
  check('numbers-only sku uses normalPrice/100, not list price', () => assert.equal(sku('1003').priceUsd, 33.99));
  check('list price recorded separately', () => assert.equal(sku('1001').listPriceUsd, 59.99));
  check('stock and in-stock flags', () => { assert.equal(sku('1001').stock, 120); assert.equal(sku('1003').inStock, false); assert.equal(sku('1001').inStock, true); });
  check('goods price range', () => { assert.equal(listing.goodsPrice.min, 29.99); assert.equal(listing.goodsPrice.max, 33.99); });
  check('option groups', () => { assert.ok(listing.options.Color.includes('Black') && listing.options.Color.includes('Grey')); assert.deepEqual(listing.options.Size, ['M', 'L', 'XL']); });
  check('size guide captured from the real button', () => assert.equal(listing.sizeChart.dialog, 'captured'));
  check('never followed the decoy size-chart link', () => assert.ok(!requests.some((u) => u.startsWith('/other.html')), 'visited /other.html'));
  check('never clicked cart or buy', () => assert.ok(!requests.some((u) => /cart-clicked|buy-clicked/.test(u))));
  const files = listing.images.map((i) => i.url);
  check('product photos saved with roles', () => {
    for (const f of ['gallery-1.png', 'gallery-2.png', 'black.png', 'grey.png', 'sizechart.png']) assert.ok(files.some((u) => u.endsWith(f)), `missing ${f}`);
    assert.ok(listing.images.find((i) => i.url.endsWith('gallery-1.png')).role === 'gallery');
    assert.ok(listing.images.find((i) => i.url.endsWith('black.png')).role === 'colour');
  });
  check('resize query stripped from photo urls', () => assert.ok(files.every((u) => !u.includes('imageView2'))));
  check('no recommendation or review photos', () => assert.ok(!files.some((u) => /other\.png|review/.test(u))));
  check('html served as an image is rejected', () => assert.ok(listing.imageFailures.some((f) => /fake\.png/.test(f.url) && /not an image/.test(f.why))));
  const imgFiles = await fs.readdir(path.join(dir, 'images'));
  check('5 image files on disk', () => assert.equal(imgFiles.length, 5));
  const repoFiles = await fs.readdir(path.join(dir, 'latest'));
  check('raw page kept out of the repo folder', () => assert.ok(!repoFiles.some((f) => /page\.html|raw\.json|page\.txt|\.png$/.test(f)), repoFiles.join(',')));
  const cacheOk = await exists(path.join(tmp, 'cache/fixture-product/raw.json'));
  check('local cache has raw.json', () => assert.ok(cacheOk));
  check('signed-out page screenshot committed as jpg', () => assert.ok(repoFiles.includes('screenshot.jpg')));
  check('size guide files', () => { assert.ok(repoFiles.includes('size-guide.jpg')); assert.ok(repoFiles.includes('size-guide-api.json')); });
  const productJson = await fs.readFile(path.join(dir, 'latest/product.json'), 'utf8');
  const listingTxt = await fs.readFile(path.join(dir, 'latest/listing.json'), 'utf8');
  check('no account data in committed json', () => { assert.ok(!/owner@example\.com|Owner Name/.test(productJson + listingTxt)); });
  const hist = await fs.readFile(path.join(dir, 'price-history.csv'), 'utf8');
  check('price history rows', () => assert.equal(hist.trim().split('\n').length, 5));
  check('csv formula injection neutralised', () => { assert.ok(hist.includes(`"'=HYPERLINK`), 'apostrophe guard missing'); assert.ok(!/(^|,)"[=+@-]/m.test(hist), 'a cell starts with a formula character'); });

  // 2. Rerun: photos not duplicated, history appended.
  const r2 = await run(['--url', `${base}/cloak-g-${GID}.html`, '--id', 'fixture-product', '--date', '2026-10-16', ...common]);
  check('rerun exit 0', () => assert.equal(r2.code, 0));
  const imgFiles2 = await fs.readdir(path.join(dir, 'images'));
  check('rerun photo count unchanged', () => assert.equal(imgFiles2.length, imgFiles.length));
  const hist2 = await fs.readFile(path.join(dir, 'price-history.csv'), 'utf8');
  check('rerun appends history', () => assert.equal(hist2.trim().split('\n').length, 9));

  // 3. Product URL after a solved check carries refer_page_name=bgn_verification: still a product page.
  const r3 = await run(['--url', `${base}/cloak-g-${GID}.html?refer_page_name=bgn_verification&is_back=1`, '--id', 'fixture-refer', '--date', '2026-10-15', ...common]);
  check('post-check redirect is not treated as blocked', () => assert.equal(r3.code, 0, r3.out));

  // 4. Verification page: BLOCKED, exit 2, nothing written but status.
  const r4 = await run(['--url', `${base}/bgn_verification.html`, '--id', 'fixture-blocked', '--date', '2026-10-15', ...common]);
  const st4 = await readJson(path.join(out, 'fixture-blocked/latest/status.json'));
  check('verification page -> BLOCKED exit 2', () => { assert.equal(r4.code, 2); assert.equal(st4.status, 'BLOCKED'); });
  const noListing = !(await exists(path.join(out, 'fixture-blocked/latest/listing.json')));
  check('blocked: no listing.json', () => assert.ok(noListing));

  // 5. Sign-in wall: LOGIN_REQUIRED, exit 2.
  const r5 = await run(['--url', `${base}/login.html`, '--id', 'fixture-login', '--date', '2026-10-15', ...common]);
  const st5 = await readJson(path.join(out, 'fixture-login/latest/status.json'));
  check('sign-in wall -> LOGIN_REQUIRED exit 2', () => { assert.equal(r5.code, 2); assert.equal(st5.status, 'LOGIN_REQUIRED'); });

  // 6. Page data belongs to a different goods id: OFF_PRODUCT, exit 1.
  const r6 = await run(['--url', `${base}/cloak-g-111111111111.html`, '--id', 'fixture-off', '--date', '2026-10-15', ...common]);
  const st6 = await readJson(path.join(out, 'fixture-off/latest/status.json'));
  check('wrong product -> OFF_PRODUCT exit 1', () => { assert.equal(r6.code, 1); assert.equal(st6.status, 'OFF_PRODUCT'); });

  // 7. Regional site: WRONG_REGION, exit 1.
  const r7 = await run(['--url', `${base}/ca/cloak-g-${GID}.html`, '--id', 'fixture-region', '--date', '2026-10-15', ...common]);
  const st7 = await readJson(path.join(out, 'fixture-region/latest/status.json'));
  check('regional site -> WRONG_REGION exit 1', () => { assert.equal(r7.code, 1); assert.equal(st7.status, 'WRONG_REGION'); });

  // 8. Signed-in looking page: data saved, but no page screenshot in the repo.
  const r8 = await run(['--url', `${base}/signed-g-${GID}.html`, '--id', 'fixture-signed', '--date', '2026-10-15', ...common]);
  const files8 = await fs.readdir(path.join(out, 'fixture-signed/latest'));
  check('signed-in page: OK but no screenshot committed', () => { assert.equal(r8.code, 0); assert.ok(!files8.includes('screenshot.jpg')); });

  // 9. Unsafe id refused.
  const r9 = await run(['--url', `${base}/cloak-g-${GID}.html`, '--id', 'Bad Id', ...common]);
  check('bad id refused', () => assert.equal(r9.code, 1));

  // 10. Profile inside the repo refused.
  const repoRoot = path.resolve(HERE, '../../../../..');
  const r10 = await run(['--url', `${base}/cloak-g-${GID}.html`, '--id', 'fixture-x', '--out', out, '--profile', path.join(repoRoot, 'tmp-profile-should-not-exist'), '--cache', path.join(tmp, 'cache'), '--headless']);
  await fs.rm(path.join(repoRoot, 'tmp-profile-should-not-exist'), { recursive: true, force: true });
  check('profile inside the repo refused', () => { assert.equal(r10.code, 1); assert.match(r10.out, /outside the repo/); });

  // 11. --help works without starting a browser.
  const r11 = await run(['--help']);
  check('--help prints usage', () => { assert.equal(r11.code, 0); assert.match(r11.out, /Usage:/); assert.ok(!/import /.test(r11.out)); });
} finally {
  srv.close();
  if (!process.env.KEEP) await fs.rm(tmp, { recursive: true, force: true });
  else console.log(`kept ${tmp}`);
}
console.log(failures ? `${failures} FAILED` : 'ALL PASSED');
process.exit(failures ? 1 : 0);
