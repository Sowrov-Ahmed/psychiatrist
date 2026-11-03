/*!
 * js/fx.js — SHARED CORE (never edit). Scroll-driven PARALLAX + hard-cut motion engine, driven by data-attributes.
 *   data-reveal="slam|wipe|wipe-up|stamp|cut|left|right" [data-delay=ms]   scroll-in animation (default slam)
 *   data-parallax="0.2"          vertical parallax; positive = slower than scroll (background feel), negative = faster
 *   data-parallax-x="0.3"        horizontal drift with scroll
 *   data-parallax-rotate="12"    rotation (deg) across the viewport pass
 *   data-parallax-scale="0.15"   scale boost as the element nears viewport centre
 *   data-parallax-img [="0.12"]  on a FRAME (relative overflow-hidden): its first <img class="absolute inset-0 h-[125%] w-full object-cover"> glides inside the frame
 *   data-scroll-x="0.6"          giant text row slides sideways as you scroll (negative = other direction)
 *   data-progress                sets CSS variable --p (0→1) on the element while it crosses the viewport (use in arbitrary values)
 *   data-bg-shift                moves a 300%-wide gradient background with scroll (pair with bg-[length:300%_100%])
 *   data-scramble                text scrambles into place when it enters view (plain-text elements only)
 *   data-counter="5200" [data-prefix] [data-suffix] [data-decimals]   animated number
 * RULE: one element may combine several data-parallax* attributes, but NEVER combine data-reveal with any parallax attribute or data-scroll-x
 * on the same element (both use transform) — wrap one inside the other.
 * FX.init(root?) is idempotent; call it (or UI.mount) after injecting HTML.
 */
(function (w, d) {
  'use strict';
  var REVEAL = { slam: 'slam', wipe: 'wipe-right', 'wipe-up': 'wipe-up', stamp: 'stamp', cut: 'cut', left: 'slide-left', right: 'slide-right' };
  function reduced() { return !!(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function all(root, sel) { return Array.prototype.slice.call((root || d).querySelectorAll(sel)); }
  function num(el, a, def) { var v = parseFloat(el.getAttribute(a)); return isNaN(v) ? def : v; }
  var hasIO = 'IntersectionObserver' in w, revealIO, scrambleIO, counterIO, visIO, items = [], visible = new Set(), ticking = false;

  function ensure() {
    if (!hasIO || revealIO) return;
    revealIO = new IntersectionObserver(function (es, o) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; var el = e.target; o.unobserve(el);
        var cls = 'animate-' + (REVEAL[el.getAttribute('data-reveal')] || 'slam'), delay = parseInt(el.getAttribute('data-delay') || '0', 10), dcls = delay ? '[animation-delay:' + delay + 'ms]' : '';
        el.classList.remove('opacity-0'); el.classList.add(cls); if (dcls) el.classList.add(dcls);
        el.addEventListener('animationend', function () { el.classList.remove(cls); if (dcls) el.classList.remove(dcls); el.setAttribute('data-revealed', 'true'); }, { once: true });
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    scrambleIO = new IntersectionObserver(function (es, o) { es.forEach(function (e) { if (e.isIntersecting) { o.unobserve(e.target); scramble(e.target); } }); }, { threshold: 0.5 });
    counterIO = new IntersectionObserver(function (es, o) { es.forEach(function (e) { if (e.isIntersecting) { o.unobserve(e.target); runCounter(e.target); } }); }, { threshold: 0.4 });
    visIO = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); }); schedule(); }, { rootMargin: '150px 0px 150px 0px' });
  }

  function reveal(root) {
    all(root, '[data-reveal]:not([data-reveal-bound])').forEach(function (el) {
      el.setAttribute('data-reveal-bound', '');
      if (reduced() || !hasIO) return;
      el.classList.add('opacity-0'); revealIO.observe(el);
    });
  }
  function scrollFx(root) {
    all(root, '[data-parallax],[data-parallax-x],[data-parallax-rotate],[data-parallax-scale],[data-parallax-img],[data-scroll-x],[data-progress],[data-bg-shift]').forEach(function (el) {
      if (el.hasAttribute('data-px-bound')) return; el.setAttribute('data-px-bound', '');
      if (reduced() || !hasIO) return; items.push(el); visIO.observe(el);
    });
  }
  function schedule() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  function update() {
    ticking = false; var vh = w.innerHeight, vw = w.innerWidth;
    visible.forEach(function (el) {
      var r = el.getBoundingClientRect(), n = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2 || 1); n = Math.max(-1, Math.min(1, n));
      var tx = 0, ty = 0, rot = 0, sc = 1, tf = false;
      if (el.hasAttribute('data-parallax')) { ty = -(r.top + r.height / 2 - vh / 2) * num(el, 'data-parallax', 0.2); tf = true; }
      if (el.hasAttribute('data-parallax-x')) { tx = -n * vw * num(el, 'data-parallax-x', 0.2); tf = true; }
      if (el.hasAttribute('data-scroll-x')) { tx = -n * vw * num(el, 'data-scroll-x', 0.5); tf = true; }
      if (el.hasAttribute('data-parallax-rotate')) { rot = -n * num(el, 'data-parallax-rotate', 10); tf = true; }
      if (el.hasAttribute('data-parallax-scale')) { sc = 1 + (1 - Math.abs(n)) * num(el, 'data-parallax-scale', 0.1); tf = true; }
      if (tf) el.style.transform = 'translate3d(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px,0)' + (rot ? ' rotate(' + rot.toFixed(2) + 'deg)' : '') + (sc !== 1 ? ' scale(' + sc.toFixed(3) + ')' : '');
      if (el.hasAttribute('data-parallax-img')) { var im = el.querySelector('img'); if (im) im.style.transform = 'translate3d(0,' + (-n * r.height * (num(el, 'data-parallax-img', 0.12) || 0.12)).toFixed(1) + 'px,0)'; }
      if (el.hasAttribute('data-progress')) el.style.setProperty('--p', Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.9))).toFixed(3));
      if (el.hasAttribute('data-bg-shift')) el.style.backgroundPosition = ((1 - (n + 1) / 2) * 100).toFixed(1) + '% 50%';
    });
  }

  function scramble(el) {
    var final = el.textContent, glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@+=?', frame = 0, total = Math.min(36, Math.max(14, final.length));
    el.setAttribute('aria-label', final);
    (function tick() {
      var done = Math.floor(frame / total * final.length), out = '';
      for (var i = 0; i < final.length; i++) out += (i < done || final[i] === ' ') ? final[i] : glyphs[Math.floor(Math.random() * glyphs.length)];
      el.textContent = out; frame++;
      if (done < final.length) setTimeout(tick, 32); else el.textContent = final;
    })();
  }
  function scrambleInit(root) {
    all(root, '[data-scramble]:not([data-scr-bound])').forEach(function (el) { el.setAttribute('data-scr-bound', ''); if (reduced() || !hasIO || el.children.length) return; scrambleIO.observe(el); });
  }
  function fmtN(el, v) { var dec = parseInt(el.getAttribute('data-decimals') || '0', 10); return (el.getAttribute('data-prefix') || '') + v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + (el.getAttribute('data-suffix') || ''); }
  function runCounter(el) {
    var target = num(el, 'data-counter', 0), dur = parseInt(el.getAttribute('data-duration') || '1600', 10), t0 = performance.now();
    (function tick(t) { var p = Math.min(1, (t - t0) / dur); el.textContent = fmtN(el, p < 1 ? target * (Math.floor(p * 14) / 14) : target); if (p < 1) requestAnimationFrame(tick); })(t0);
  }
  function counters(root) {
    all(root, '[data-counter]:not([data-counter-bound])').forEach(function (el) {
      el.setAttribute('data-counter-bound', ''); var target = num(el, 'data-counter', 0);
      if (reduced() || !hasIO) { el.textContent = fmtN(el, target); return; }
      el.textContent = fmtN(el, 0); counterIO.observe(el);
    });
  }

  var FX = { init: function (root) { ensure(); reveal(root); scrollFx(root); scrambleInit(root); counters(root); schedule(); }, reduced: reduced };
  w.addEventListener('scroll', function () { if (visible.size) schedule(); }, { passive: true });
  w.addEventListener('resize', schedule, { passive: true });
  w.FX = FX;
  function boot() { FX.init(d); }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot); else boot();
})(window, document);
