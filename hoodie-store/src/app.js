/* Product page behaviour: color/size selection, checkout link, sticky bar, events.
   Inlined into index.html by build.py. No frameworks; keep it small. */
(function () {
  'use strict';
  var D = JSON.parse(document.getElementById('product-data').textContent);
  var doc = document;
  function $(s, el) { return (el || doc).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || doc).querySelectorAll(s)); }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var state = { color: '', colorName: '', size: '', sizeName: '' };
  var hero = $('.hero');

  function mix(hex, to, t) {
    var a = parseInt(hex.slice(1), 16), b = parseInt(to.slice(1), 16), out = '#';
    for (var s = 16; s >= 0; s -= 8) {
      var x = (a >> s) & 255, y = (b >> s) & 255;
      out += ('0' + Math.round(x + (y - x) * t).toString(16)).slice(-2);
    }
    return out;
  }
  function paint(hex) {
    if (!hero || !D.artMode || !/^#[0-9a-f]{6}$/i.test(hex)) return;
    hero.style.setProperty('--cloak', hex);
    hero.style.setProperty('--cloak-shade', mix(hex, '#000000', 0.22));
    hero.style.setProperty('--cloak-deep', mix(hex, '#000000', 0.42));
    if (!D.liningShown) hero.style.setProperty('--lining', mix(hex, '#ffffff', 0.18));
  }
  function refresh() {
    var t = state.colorName + ' · ' + (state.size ? 'Size ' + state.sizeName : D.text.chooseSize);
    $$('[data-summary]').forEach(function (el) {
      el.textContent = el.getAttribute('data-summary') === 'short' ? t : t + ' · ' + D.text.qty;
    });
  }
  function setColor(input) {
    state.color = input.value;
    state.colorName = input.getAttribute('data-name');
    var v = $('#color-name');
    if (v) v.textContent = state.colorName;
    paint(input.getAttribute('data-hex'));
    refresh();
  }
  function setSize(input) {
    state.size = input.value;
    state.sizeName = input.getAttribute('data-name');
    var e = $('#size-err');
    if (e) e.hidden = true;
    var v = $('#size-name');
    if (v) v.textContent = state.sizeName;
    refresh();
  }

  function track(fbName, gaName, extra) {
    var item = { item_id: D.contentId, item_name: D.name, price: D.price, quantity: 1 };
    if (extra) item.item_variant = extra;
    try {
      if (window.fbq) window.fbq('track', fbName, { content_ids: [D.contentId], content_type: 'product', content_name: D.name, value: D.price, currency: D.currency, num_items: 1 });
    } catch (e) { /* ignore */ }
    try {
      if (window.gtag) window.gtag('event', gaName, { currency: D.currency, value: D.price, items: [item], transport_type: 'beacon' });
    } catch (e) { /* ignore */ }
  }

  function checkoutUrl() {
    var ref = (state.color + '-' + state.size).replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 200);
    var url = D.paymentLink + (D.paymentLink.indexOf('?') < 0 ? '?' : '&') + 'client_reference_id=' + encodeURIComponent(ref);
    try {
      var q = new URLSearchParams(window.location.search);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
        var v = q.get(k);
        if (v) url += '&' + k + '=' + encodeURIComponent(v.slice(0, 120));
      });
    } catch (e) { /* old browser: no UTM pass-through */ }
    return url;
  }

  function buy(ev) {
    ev.preventDefault();
    if (!D.paymentLink) return;
    if (!state.size) {
      var err = $('#size-err'), group = $('#size-group'), first = $('input[name="size"]');
      if (err) err.hidden = false;
      if (group) group.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      if (first) first.focus({ preventScroll: true });
      return;
    }
    var url = checkoutUrl();
    track('InitiateCheckout', 'begin_checkout', state.colorName + ' / ' + state.sizeName);
    var gone = false;
    var go = function () { if (!gone) { gone = true; window.location.assign(url); } };
    if (D.tracking) setTimeout(go, 300); else go();
  }

  $$('input[name="color"]').forEach(function (r) {
    r.addEventListener('change', function () { setColor(r); });
    if (r.checked) setColor(r);
  });
  $$('input[name="size"]').forEach(function (r) {
    r.addEventListener('change', function () { setSize(r); });
    if (r.checked) setSize(r);
  });
  $$('[data-buy]').forEach(function (b) { b.addEventListener('click', buy); });

  // Photo gallery (only when real photos exist).
  var stageImg = $('#stage-img');
  $$('[data-thumb]').forEach(function (t) {
    t.addEventListener('click', function () {
      if (!stageImg) return;
      stageImg.src = t.getAttribute('data-src');
      stageImg.alt = t.getAttribute('data-alt');
      $$('[data-thumb]').forEach(function (o) { o.setAttribute('aria-current', o === t ? 'true' : 'false'); });
    });
  });

  // Sticky mobile buy bar: shown once the main buy button has scrolled out of view above.
  // (A scroll check, not IntersectionObserver: a jump from above the button to far below it
  // never crosses the viewport edge, so an observer would not fire.)
  var bar = $('.buybar'), main = $('#buy-main'), queued = false;
  function syncBar() {
    queued = false;
    bar.classList.toggle('show', main.getBoundingClientRect().bottom < 0);
  }
  if (bar && main) {
    window.addEventListener('scroll', function () {
      if (!queued) { queued = true; window.requestAnimationFrame(syncBar); }
    }, { passive: true });
    window.addEventListener('resize', syncBar);
    syncBar();
  }

  // Date-limited lines (the holiday order-by line) disappear after their date, even without a rebuild.
  var now = new Date();
  $$('[data-hide-after]').forEach(function (el) {
    var p = el.getAttribute('data-hide-after').split('-');
    if (now >= new Date(+p[0], +p[1] - 1, +p[2])) {
      var parent = el.parentNode;
      el.parentNode.removeChild(el);
      if (parent && parent.tagName === 'P' && !parent.textContent.trim()) parent.parentNode.removeChild(parent);
    }
  });

  refresh();
  track('ViewContent', 'view_item');
})();
