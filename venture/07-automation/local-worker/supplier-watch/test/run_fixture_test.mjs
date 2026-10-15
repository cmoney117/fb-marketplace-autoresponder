// Offline test for fetch_listing.mjs against a fake Temu-style product page.
// Run: node test/run_fixture_test.mjs   (needs playwright + a Chromium build)
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

// Minimal PNG so the fixture has real, decodable images.
function png(w, h, [r, g, b]) {
  // Deterministic noise so the file is a realistic size (real photos are never a few hundred bytes).
  let seed = r * 65536 + g * 256 + b + 1;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed & 0x1f; };
  const rows = [];
  for (let y = 0; y < h; y++) {
    const row = Buffer.alloc(1 + w * 3);
    for (let x = 0; x < w; x++) { row[1 + x * 3] = (r + rnd()) & 255; row[2 + x * 3] = (g + rnd()) & 255; row[3 + x * 3] = (b + rnd()) & 255; }
    rows.push(row);
  }
  const rawRows = Buffer.concat(rows);
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(td));
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(rawRows)), chunk('IEND', Buffer.alloc(0))]);
}

const IMAGES = {
  '/img/gallery-1.png': png(400, 400, [20, 20, 20]),
  '/img/gallery-2.png': png(400, 400, [120, 120, 120]),
  '/img/black.png': png(400, 400, [0, 0, 0]),
  '/img/grey.png': png(400, 400, [128, 128, 128]),
  '/img/sizechart.png': png(600, 400, [240, 240, 240]),
};

const requests = [];

function productHtml(base) {
  const rawData = {
    store: {
      goods: {
        goodsId: '607560786669025',
        goodsName: '2026 Unisex Punk Hooded Button Loose Cloak Fall Winter',
        gallery: [{ url: `${base}/img/gallery-1.png` }, { url: `${base}/img/gallery-2.png` }],
      },
      sku: [
        { skuId: 1001, specs: [{ specKey: 'Color', specValue: 'Black' }, { specKey: 'Size', specValue: 'M' }], normalPrice: 3899, priceInfo: { price: 2999, priceStr: '$29.99' }, stockQuantity: 120, thumbUrl: `${base}/img/black.png` },
        { skuId: 1002, specs: [{ specKey: 'Color', specValue: 'Black' }, { specKey: 'Size', specValue: 'L' }], normalPrice: 3899, priceInfo: { price: 3199, priceStr: '$31.99' }, stockQuantity: 80, thumbUrl: `${base}/img/black.png` },
        { skuId: 1003, specs: [{ specKey: 'Color', specValue: 'Grey' }, { specKey: 'Size', specValue: 'XL' }], normalPrice: 3899, priceInfo: { price: 3399 }, stockQuantity: 0, thumbUrl: `${base}/img/grey.png` },
      ],
      sizeChart: { unit: 'in', rows: [['Size', 'Length', 'Chest'], ['M', '45', '60'], ['L', '47', '63'], ['XL', '49', '66']] },
    },
  };
  return `<!doctype html><html><head><title>Temu fixture</title>
<meta property="og:title" content="2026 Unisex Punk Hooded Button Loose Cloak">
<meta property="og:image" content="${base}/img/gallery-1.png">
<script>window.rawData = ${JSON.stringify(rawData)};</script></head>
<body>
<h1>2026 Unisex Punk Hooded Button Loose Cloak Fall Winter</h1>
<div class="price">$29.99 <s>$38.99</s></div>
<div>4.6 out of 5 · 1,234 reviews · 10K+ sold</div>
<div>Free shipping · Delivery: Oct 21-28 · Ships from local warehouse</div>
<img src="/img/gallery-1.png" width="400" height="400"><img src="/img/gallery-2.png" width="400" height="400">
<div style="height:2500px">long description</div>
<button id="cart" onclick="fetch('/cart-clicked')">Add to cart</button>
<button id="buy" onclick="fetch('/buy-clicked')">Buy now</button>
<button id="sg" onclick="document.getElementById('modal').style.display='block'">Size guide</button>
<div id="modal" role="dialog" style="display:none">
  <table><tr><th>Size</th><th>Length</th><th>Chest</th></tr><tr><td>M</td><td>45</td><td>60</td></tr><tr><td>L</td><td>47</td><td>63</td></tr></table>
  <img src="/img/sizechart.png" width="600" height="400">
</div>
</body></html>`;
}

const BLOCKED_HTML = `<!doctype html><html><body><h2>Security verification</h2><p>Slide to verify you are human</p></body></html>`;

function serve() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      requests.push(req.url);
      const base = `http://127.0.0.1:${srv.address().port}`;
      if (req.url.startsWith('/product.html')) { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(productHtml(base)); }
      if (req.url.startsWith('/blocked.html')) { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(BLOCKED_HTML); }
      const img = IMAGES[req.url.split('?')[0]];
      if (img) { res.writeHead(200, { 'content-type': 'image/png' }); return res.end(img); }
      res.writeHead(404); res.end('nf');
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

function run(args) {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, [SCRIPT, ...args], { env: { ...process.env, SUPPLIER_WATCH_CHANNEL: 'chromium' }, stdio: ['ignore', 'pipe', 'pipe'] });
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
const profile = path.join(tmp, 'profile');
let failures = 0;
const check = (name, fn) => { try { fn(); console.log(`PASS ${name}`); } catch (e) { failures++; console.log(`FAIL ${name}: ${e.message}`); } };

try {
  // 1. Normal product page.
  const r1 = await run(['--url', `${base}/product.html`, '--id', 'fixture-product', '--out', out, '--profile', profile, '--headless', '--date', '2026-10-15']);
  console.log(r1.out.trim());
  const dir = path.join(out, 'fixture-product');
  const listing = JSON.parse(await fs.readFile(path.join(dir, 'latest/listing.json'), 'utf8'));
  const status = JSON.parse(await fs.readFile(path.join(dir, 'latest/status.json'), 'utf8'));
  check('exit code 0', () => assert.equal(r1.code, 0));
  check('status OK', () => assert.equal(status.status, 'OK'));
  check('title from rawData', () => assert.match(listing.title, /Punk Hooded Button Loose Cloak/));
  check('3 skus parsed', () => assert.equal(listing.skus.length, 3));
  check('option groups', () => { assert.deepEqual(listing.options.Color, ['Black', 'Grey']); assert.deepEqual(listing.options.Size, ['M', 'L', 'XL']); });
  check('price uses display string', () => assert.equal(listing.skus.find((s) => s.skuId === '1001').priceUsd, 29.99));
  check('price from integer cents', () => assert.equal(listing.skus.find((s) => s.skuId === '1003').priceUsd, 33.99));
  check('list price not used', () => assert.ok(listing.skus.every((s) => s.priceUsd < 38)));
  check('size chart from data', () => assert.ok(listing.sizeChartFromData.some((h) => /sizeChart/.test(h.path))));
  check('size guide opened', () => assert.match(listing.sizeGuideText || '', /Length/));
  check('images saved', () => assert.ok(listing.images.length >= 4, `saved ${listing.images.length}`));
  const imgFiles = await fs.readdir(path.join(dir, 'images'));
  check('image files on disk', () => assert.ok(imgFiles.length >= 4 && imgFiles.length <= 5, `files ${imgFiles.length}`));
  const exists = async (f) => fs.access(path.join(dir, f)).then(() => true, () => false);
  const shots = [await exists('latest/screenshot-full.png'), await exists('latest/size-guide.png')];
  check('screenshots saved', () => assert.deepEqual(shots, [true, true]));
  check('shipping lines', () => assert.ok(listing.shipping.some((l) => /local warehouse/.test(l))));
  check('sold + rating lines', () => { assert.ok(listing.sold.length >= 1); assert.ok(listing.rating.length >= 1); });
  const hist = await fs.readFile(path.join(dir, 'price-history.csv'), 'utf8');
  check('price history rows', () => assert.equal(hist.trim().split('\n').length, 4));
  check('never clicked cart or buy', () => assert.ok(!requests.some((u) => /cart-clicked|buy-clicked/.test(u)), requests.join(' ')));

  // 2. Second run same day: images not duplicated, history appended.
  const r2 = await run(['--url', `${base}/product.html`, '--id', 'fixture-product', '--out', out, '--profile', profile, '--headless', '--date', '2026-10-16']);
  const imgFiles2 = await fs.readdir(path.join(dir, 'images'));
  check('rerun exit 0', () => assert.equal(r2.code, 0));
  check('rerun no duplicate images', () => assert.equal(imgFiles2.length, imgFiles.length));
  const hist2 = await fs.readFile(path.join(dir, 'price-history.csv'), 'utf8');
  check('rerun appends history', () => assert.equal(hist2.trim().split('\n').length, 7));

  // 3. Bot-check page in headless mode: reported as BLOCKED, exit 2.
  const r3 = await run(['--url', `${base}/blocked.html`, '--id', 'fixture-blocked', '--out', out, '--profile', profile, '--headless', '--wait-captcha', '0', '--date', '2026-10-15']);
  const st3 = JSON.parse(await fs.readFile(path.join(out, 'fixture-blocked/latest/status.json'), 'utf8'));
  check('blocked exit 2', () => assert.equal(r3.code, 2));
  check('blocked status', () => assert.equal(st3.status, 'BLOCKED'));

  // 4. An id that is not a safe folder name is refused.
  const r4 = await run(['--url', `${base}/product.html`, '--id', 'Bad Id', '--out', out, '--profile', profile, '--headless']);
  check('bad id refused', () => assert.equal(r4.code, 1));
} finally {
  srv.close();
  if (!process.env.KEEP) await fs.rm(tmp, { recursive: true, force: true });
  else console.log(`kept ${tmp}`);
}
console.log(failures ? `${failures} FAILED` : 'ALL PASSED');
process.exit(failures ? 1 : 0);
