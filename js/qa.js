/*!
 * js/qa.js — SHARED QA ENGINE (never edit). Runs inside any page (browser or jsdom).
 * Browser: open any page with ?qa=1 (layout.js loads this file) → panel at bottom-left + postMessage to a parent runner (qa.html).
 * Node:    tools/qa.js evaluates this file in jsdom and calls QA.run({env:'jsdom'}).
 * Returns { page, url, width, env, findings:[{level:'FAIL'|'WARN', rule, msg}], stats }.
 */
(function (w, d) {
  'use strict';
  var FORBID = [
    [/^rounded(?!-none$)(-.*)?$/, 'rounded corner (Brutalist = square edges only; use rounded-none)'], [/^backdrop-/, 'backdrop blur/glass (not allowed)'], [/^(blur|drop-shadow)(-.*)?$/, 'blur / soft shadow filter'],
    [/^shadow(-(sm|md|lg|xl|2xl|inner))?$/, 'soft shadow (use shadow-hard*)'], [/^border$/, 'thin 1px border (use border-2 or border-4)'], [/^border-[trblxy]$/, 'thin 1px border (use border-t-4 etc.)'], [/^border-[01]$/, 'hairline border'],
    [/^font-serif$/, 'serif font'], [/^bg-gradient-to-/, 'default gradient utility (use bg-grad-* tokens)'], [/^(from|via|to)-/, 'default gradient stop (use bg-grad-* tokens)'],
    [/^(bg|text|border|ring|fill|stroke|shadow|divide|outline|decoration|accent|caret|placeholder)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+/, 'off-palette colour (use ink/concrete/ultra/lime/tang/lilac/alert/white)'], [/^\[border-radius:/, 'rounded corner via arbitrary property']
  ];
  function stripVariants(t) { var m; while ((m = t.match(/^(\[[^\]]*\]|[a-z0-9-]+):(.+)$/))) t = m[2]; return t; }
  function sel(el) { return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''); }
  function visibleText(doc) { var c = doc.body.cloneNode(true); Array.prototype.forEach.call(c.querySelectorAll('script,style,noscript,[aria-hidden="true"],#toast-root,[inert]'), function (n) { n.remove(); }); return c.textContent.replace(/\s+/g, ' '); }
  function accName(el) { return (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || '').trim() || (el.querySelector('img[alt]') && el.querySelector('img[alt]').getAttribute('alt').trim()) || (el.getAttribute('aria-labelledby') && (d.getElementById(el.getAttribute('aria-labelledby')) || {}).textContent) || ''; }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function sampleFor(f, form) {
    var n = (f.name || '').toLowerCase(), t = f.type;
    if (t === 'checkbox') return { checked: true }; if (t === 'radio') return { checked: true };
    if (t === 'email') return { value: 'qa.tester@mail.test' };
    if (t === 'tel' || /phone|mobile/.test(n)) return { value: '01712345678' };
    if (t === 'password') return { value: 'Strong#Pass123' };
    if (t === 'number') return { value: /age/.test(n) ? '34' : '3' };
    if (t === 'date') { var x = new Date(Date.now() + 5 * 864e5); return { value: x.toISOString().slice(0, 10) }; }
    if (f.tagName === 'SELECT') { var o = Array.prototype.filter.call(f.options, function (o) { return o.value; })[0]; return o ? { value: o.value } : {}; }
    if (f.tagName === 'TEXTAREA') return { value: 'This is a realistic test message written by the automated quality check to exercise validation.' };
    if (/name/.test(n)) return { value: 'QA Tester' };
    return { value: 'QA test entry' };
  }

  async function run(opts) {
    opts = opts || {}; var env = opts.env || 'browser', F = [], stats = {};
    var fail = function (rule, msg) { F.push({ level: 'FAIL', rule: rule, msg: msg }); }, warn = function (rule, msg) { F.push({ level: 'WARN', rule: rule, msg: msg }); };
    var page = d.body.getAttribute('data-page') || '?', isHome = page === 'home';
    var doc = d;

    /* browser: scroll through the page so scroll-triggered reveals fire */
    if (env === 'browser') { var h = d.documentElement.scrollHeight, step = Math.max(300, Math.floor(w.innerHeight * 0.8)); for (var y = 0; y < h; y += step) { w.scrollTo(0, y); await sleep(110); } w.scrollTo(0, 0); await sleep(500); }

    /* interactions (before static DOM checks so dynamically revealed content is also checked) */
    var before = (w.__qaErrors || []).length;
    try {
      Array.prototype.forEach.call(doc.querySelectorAll('[data-tabs]'), function (root) { var tabs = root.querySelectorAll('[data-tab]'); Array.prototype.forEach.call(tabs, function (t) { t.click(); var vis = Array.prototype.filter.call(root.querySelectorAll('[data-tab-panel]'), function (p) { return !p.classList.contains('hidden'); }).length; if (vis !== 1) fail('INTERACT', 'tabs: ' + vis + ' panels visible after selecting tab "' + t.getAttribute('data-tab') + '" (must be exactly 1)'); }); if (tabs[0]) tabs[0].click(); });
      Array.prototype.forEach.call(doc.querySelectorAll('[data-accordion-trigger]'), function (b, i) { if (i > 24) return; var was = b.getAttribute('aria-expanded'); b.click(); if (b.getAttribute('aria-expanded') === was) fail('INTERACT', 'accordion trigger does not toggle: ' + sel(b)); b.click(); });
      Array.prototype.forEach.call(doc.querySelectorAll('[data-carousel-next],[data-carousel-prev]'), function (b) { b.click(); });
      Array.prototype.forEach.call(doc.querySelectorAll('button[aria-pressed]'), function (b, i) { if (i < 20) b.click(); });
    } catch (e) { fail('INTERACT', 'exception during interaction: ' + e.message); }
    var forms = Array.prototype.slice.call(doc.querySelectorAll('main form'));
    for (var fi = 0; fi < forms.length; fi++) {
      var form = forms[fi];
      try {
        var ev = new w.Event('submit', { cancelable: true, bubbles: true }); form.dispatchEvent(ev);
        if (!ev.defaultPrevented) fail('FORM', 'form #' + (form.id || fi) + ' submit was not prevented (page would reload) — call e.preventDefault()');
        var req = form.querySelectorAll('[required]'); if (req.length && !form.querySelector('[aria-invalid="true"]') && form.offsetParent !== null && env === 'browser') warn('FORM', 'empty submit showed no invalid fields in form #' + (form.id || fi));
        if (env === 'jsdom') {
          Array.prototype.forEach.call(form.querySelectorAll('[name]'), function (f) { if (f.type === 'hidden' || f.type === 'submit' || f.type === 'button') return; var s = sampleFor(f, form); if ('checked' in s) f.checked = true; else if (s.value != null) f.value = s.value; if (f.name === 'confirmPassword') f.value = 'Strong#Pass123'; });
          form.dispatchEvent(new w.Event('submit', { cancelable: true, bubbles: true })); await sleep(1300);
          var bad = form.querySelectorAll('[aria-invalid="true"]'); if (bad.length) warn('FORM', 'valid sample data still flagged invalid in form #' + (form.id || fi) + ': ' + Array.prototype.map.call(bad, function (b) { return b.name; }).join(', '));
        }
      } catch (e) { fail('FORM', 'exception in form #' + (form.id || fi) + ': ' + e.message); }
    }
    await sleep(150);
    var errs = (w.__qaErrors || []); errs.forEach(function (e, i) { fail(i < before ? 'JS-ERROR' : 'JS-ERROR(interaction)', (e.type || 'error') + ': ' + e.message + (e.src ? ' [' + e.src + ']' : '')); });

    /* structure */
    var hdr = doc.getElementById('site-header'), ftr = doc.getElementById('site-footer'), main = doc.getElementById('main');
    if (!main) fail('STRUCT', 'missing <main id="main">'); if (!hdr || !hdr.children.length) fail('STRUCT', 'header not injected (layout.js did not run?)'); if (!ftr || !ftr.children.length) fail('STRUCT', 'footer not injected');
    if (!doc.documentElement.lang) fail('A11Y', '<html lang> missing'); var title = (doc.title || '').trim(); if (title.length < 15 || title.length > 75) warn('SEO', 'title length ' + title.length + ' (aim 20–70)');
    if (!doc.querySelector('meta[name="description"]')) fail('SEO', 'meta description missing'); if (!doc.querySelector('a[href="#main"]')) warn('A11Y', 'skip link missing');
    var h1s = doc.querySelectorAll('h1'); if (h1s.length !== 1) fail('STRUCT', h1s.length + ' <h1> elements (need exactly 1)');
    var nf = /[?&]slug=zz-not-found/.test(w.location.search);
    var secs = main ? main.querySelectorAll('section') : [], minSecs = nf ? 1 : isHome ? 10 : (page === '404' ? 1 : 3); stats.sections = secs.length;
    if (nf) { var tx = (main ? main.textContent : '').replace(/\s+/g, ' '); if (!/not found|couldn.t find|could not find|no longer|doesn.t exist|does not exist|isn.t available/i.test(tx)) fail('NOT-FOUND', 'unknown slug did not show a friendly not-found message'); if (!main || !main.querySelector('a[href$=".html"]')) fail('NOT-FOUND', 'not-found state has no link back to the listing'); }
    if (secs.length < minSecs) fail('CONTENT', 'only ' + secs.length + ' <section> in main (page needs ≥ ' + minSecs + ')');
    Array.prototype.forEach.call(secs, function (s, i) { if (!s.id) fail('STRUCT', 'section #' + (i + 1) + ' has no id'); if (!s.hasAttribute('data-section')) fail('STRUCT', 'section "' + (s.id || i + 1) + '" has no data-section'); if ((s.textContent || '').replace(/\s+/g, ' ').trim().length < 25 && !s.querySelector('img,svg,form,iframe')) fail('CONTENT', 'section "' + (s.id || i + 1) + '" is empty');
      if (s.classList && !/\b(bg-|border-b-4)/.test(s.className)) warn('DESIGN', 'section "' + (s.id || i + 1) + '" has no background tone / border-b-4 (use UI.cls.sec*)'); });
    Array.prototype.forEach.call(doc.querySelectorAll('[data-component]'), function (c) { var n = c.getAttribute('data-component'); if (!/^[A-Z][A-Za-z0-9]+$/.test(n)) warn('STRUCT', 'data-component "' + n + '" is not PascalCase'); if (!(c.textContent || '').trim() && !c.querySelector('img,svg,iframe')) fail('CONTENT', 'rendered component "' + n + '" is empty'); });

    /* text hygiene */
    var txt = visibleText(doc); stats.words = txt.split(' ').length;
    var m1 = txt.match(/\b(undefined|NaN|null)\b|\[object Object\]|\{\{|\}\}|\$\{/); if (m1) fail('TEXT', 'broken output in visible text: "' + txt.substr(Math.max(0, txt.indexOf(m1[0]) - 30), 70) + '"');
    var m2 = txt.match(/lorem|ipsum|placeholder|sample text|dummy|coming soon|\bTBD\b|john doe|\bdemo\b|mock-?up|example\.com/i); if (m2) fail('TEXT', 'placeholder wording in visible text: "' + m2[0] + '"');
    var m3 = txt.match(/\b(crazy|insane|psycho|lunatic|junkie|retarded|mental patient|commit(ted|s)? suicide|addicts?)\b/i); if (m3) fail('LANGUAGE', 'stigmatising / unsafe wording in visible text: "' + m3[0] + '" (use person-first, safe-messaging language)');
    if (!nf && !isHome && page !== '404' && stats.words < 350) warn('CONTENT', 'page has only ~' + stats.words + ' words (thin content)');

    /* ids, headings */
    var seen = {}; Array.prototype.forEach.call(doc.querySelectorAll('[id]'), function (e) { if (seen[e.id]) fail('IDS', 'duplicate id "' + e.id + '"'); seen[e.id] = 1; });
    var last = 0; Array.prototype.forEach.call(doc.querySelectorAll('h1,h2,h3,h4,h5,h6'), function (hh) { var lv = +hh.tagName[1]; if (last && lv > last + 1) warn('A11Y', 'heading jumps h' + last + ' → h' + lv + ': "' + hh.textContent.trim().slice(0, 40) + '"'); if (!hh.textContent.trim()) fail('A11Y', 'empty heading ' + hh.tagName); last = lv; });

    /* images */
    var imgs = doc.querySelectorAll('img'); stats.images = imgs.length;
    Array.prototype.forEach.call(imgs, function (im) { var src = im.getAttribute('src'); if (!src) fail('IMG', 'img without src'); if (!im.hasAttribute('alt')) fail('IMG', 'img without alt: ' + src); if (!im.getAttribute('width') || !im.getAttribute('height')) warn('IMG', 'img without width/height: ' + src); if (env === 'browser' && im.complete && im.naturalWidth === 0 && src && !/^data:/.test(src)) fail('IMG', 'broken image: ' + src); if (/^https?:/.test(src || '')) fail('IMG', 'remote image not allowed: ' + src); });

    /* links, buttons, form labels */
    Array.prototype.forEach.call(doc.querySelectorAll('a'), function (a) { var href = a.getAttribute('href'); if (href == null || href === '') fail('LINK', 'anchor without href: ' + sel(a)); else if (href === '#') fail('LINK', 'dead link href="#": ' + (a.textContent || '').trim().slice(0, 30)); else if (href.charAt(0) === '#' && !doc.getElementById(href.slice(1))) fail('LINK', 'anchor target missing: ' + href); else if (/^(javascript:)/i.test(href)) fail('LINK', 'javascript: link'); if (!accName(a)) fail('A11Y', 'link without accessible name: ' + sel(a) + ' → ' + href); if (a.getAttribute('target') === '_blank' && !/noopener/.test(a.getAttribute('rel') || '')) warn('LINK', 'target=_blank without rel=noopener: ' + href); });
    Array.prototype.forEach.call(doc.querySelectorAll('button'), function (b) { if (!accName(b)) fail('A11Y', 'button without accessible name: ' + sel(b)); if (!b.hasAttribute('type') && b.closest('form')) warn('FORM', 'button in form without type: ' + (b.textContent || '').trim().slice(0, 20)); });
    Array.prototype.forEach.call(doc.querySelectorAll('input,select,textarea'), function (f) { if (/hidden|submit|button|reset/.test(f.type)) return; var ok = f.getAttribute('aria-label') || f.getAttribute('aria-labelledby') || (f.id && doc.querySelector('label[for="' + f.id + '"]')) || f.closest('label'); if (!ok) fail('A11Y', 'form control without label: ' + sel(f) + ' name=' + f.name); if (f.required && f.name && f.form && !f.form.querySelector('[data-error-for="' + f.name + '"]')) warn('FORM', 'required field "' + f.name + '" has no [data-error-for] message element'); });
    Array.prototype.forEach.call(doc.querySelectorAll('iframe'), function (i) { if (!i.getAttribute('title')) fail('A11Y', 'iframe without title'); });

    /* Brutalist design lint on live DOM */
    var dl = {}; Array.prototype.forEach.call(doc.querySelectorAll('body *'), function (el) { if (el.closest && el.closest('svg') && el.tagName.toLowerCase() !== 'svg') return; var c = el.getAttribute('class'); if (!c) return; c.split(/\s+/).forEach(function (tk) { if (!tk) return; var t = stripVariants(tk).replace(/^!/, ''); for (var i = 0; i < FORBID.length; i++) if (FORBID[i][0].test(t)) { dl[tk + '|' + FORBID[i][1]] = (dl[tk + '|' + FORBID[i][1]] || 0) + 1; break; } }); });
    Object.keys(dl).slice(0, 12).forEach(function (k) { var p = k.split('|'); fail('DESIGN', '"' + p[0] + '" ×' + dl[k] + ' — ' + p[1]); });
    if (Object.keys(dl).length > 12) fail('DESIGN', '…and ' + (Object.keys(dl).length - 12) + ' more design violations');

    /* browser-only layout checks */
    if (env === 'browser') {
      var vw = w.innerWidth, sw = d.documentElement.scrollWidth; if (sw > vw + 1) { var off = []; Array.prototype.forEach.call(d.querySelectorAll('main *'), function (e) { var r = e.getBoundingClientRect(); if (r.right > vw + 2 && r.width > 0 && off.length < 4 && !e.closest('[class*="overflow-x-clip"],[class*="overflow-x-auto"],[class*="overflow-hidden"]')) off.push(sel(e) + ' (right=' + Math.round(r.right) + ')'); }); fail('LAYOUT', 'horizontal overflow at ' + vw + 'px (page is ' + sw + 'px wide). Offenders: ' + (off.join('; ') || 'unknown')); }
      var stuck = Array.prototype.filter.call(d.querySelectorAll('[data-reveal].opacity-0'), function (e) { return e.offsetParent !== null; }); if (stuck.length) fail('MOTION', stuck.length + ' [data-reveal] element(s) stayed invisible after scrolling: ' + stuck.slice(0, 3).map(sel).join('; '));
      var small = Array.prototype.filter.call(d.querySelectorAll('main button, main [role=tab], main input:not([type=hidden]):not([type=checkbox]):not([type=radio]), main select'), function (e) { var r = e.getBoundingClientRect(); return r.width > 0 && (r.height < 40 || r.width < 40); }); if (small.length) warn('TAP', small.length + ' tap target(s) smaller than 40px, e.g. ' + small.slice(0, 2).map(sel).join('; '));
      var txtNodes = 0; Array.prototype.forEach.call(d.querySelectorAll('main p,main li'), function (e) { var fs = parseFloat(getComputedStyle(e).fontSize); if (fs && fs < 12) txtNodes++; }); if (txtNodes) warn('LAYOUT', txtNodes + ' text blocks below 12px');
      var tw = d.querySelector('[data-section]'); if (tw && w.getComputedStyle(d.body).fontFamily.toLowerCase().indexOf('space grotesk') < 0) warn('DESIGN', 'body font is not Space Grotesk — is Tailwind/fonts loaded?');
    }
    return { page: page, url: String(w.location.href).replace(/^.*\//, ''), width: w.innerWidth, env: env, findings: F, stats: stats };
  }

  function panel(rep) {
    var f = rep.findings.filter(function (x) { return x.level === 'FAIL'; }), wn = rep.findings.length - f.length;
    var el = d.createElement('div'); el.id = 'qa-panel'; el.setAttribute('role', 'region'); el.setAttribute('aria-label', 'QA report');
    el.className = 'fixed bottom-2 left-2 z-[200] max-h-[60vh] w-[min(34rem,95vw)] overflow-auto border-4 border-ink bg-white p-3 font-mono text-xs text-ink shadow-hard';
    el.innerHTML = '<p class="font-black uppercase">' + (f.length ? '✗ ' + f.length + ' FAIL' : '✓ PASS') + ' · ' + wn + ' warn · ' + rep.page + ' @' + rep.width + 'px</p>' + rep.findings.map(function (x) { return '<p class="mt-1 ' + (x.level === 'FAIL' ? 'bg-alert text-white' : 'bg-lime') + ' px-1"><b>' + x.level + ' ' + x.rule + '</b> ' + String(x.msg).replace(/</g, '&lt;') + '</p>'; }).join('');
    d.body.appendChild(el);
  }
  var QA = { run: run, panel: panel };
  w.QA = QA;
  if (/[?&]qa=1/.test(w.location.search) && !w.__qaNode) {
    var go = function () { setTimeout(function () { run({ env: 'browser' }).then(function (rep) { if (w.parent !== w) w.parent.postMessage({ source: 'qa', report: rep }, '*'); else panel(rep); }).catch(function (e) { var rep = { page: d.body.getAttribute('data-page'), url: w.location.href, width: w.innerWidth, env: 'browser', findings: [{ level: 'FAIL', rule: 'QA-CRASH', msg: e.message }], stats: {} }; if (w.parent !== w) w.parent.postMessage({ source: 'qa', report: rep }, '*'); else panel(rep); }); }, 1200); };
    if (d.readyState === 'complete') go(); else w.addEventListener('load', go);
  }
})(window, document);
