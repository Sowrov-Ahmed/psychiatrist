/*!
 * js/ui.js — SHARED CORE (never edit). window.UI: helpers, icons, class recipes and ready-made BRUTALIST components.
 * Every component returns an HTML string. After injecting HTML call UI.mount(container) (binds motion, accordion, tabs, carousel).
 * tone: 'light' (ink text; use on white / concrete / lime sections)  |  'dark' (white text; use on ink / ultra / dusk sections)
 * Design law: NO rounded corners, NO blur/glass, NO soft shadows. Thick ink borders + solid offset shadows only.
 */
(function (window, document) {
  'use strict';
  var ICONS = {
    'arrow-right': '<line x1="4" y1="12" x2="20" y2="12"/><polyline points="13 5 20 12 13 19"/>', 'arrow-left': '<line x1="20" y1="12" x2="4" y2="12"/><polyline points="11 5 4 12 11 19"/>',
    'arrow-up': '<line x1="12" y1="20" x2="12" y2="4"/><polyline points="5 11 12 4 19 11"/>', 'arrow-down': '<line x1="12" y1="4" x2="12" y2="20"/><polyline points="19 13 12 20 5 13"/>', 'arrow-up-right': '<line x1="6" y1="18" x2="18" y2="6"/><polyline points="8 6 18 6 18 16"/>',
    'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    'mail': '<rect x="2" y="4" width="20" height="16"/><polyline points="2,5 12,13 22,5"/>', 'map-pin': '<path d="M12 22s8-7 8-13a8 8 0 0 0-16 0c0 6 8 13 8 13z"/><rect x="10" y="7" width="4" height="4"/>',
    'navigation': '<polygon points="3 11 22 2 13 21 11 13 3 11"/>', 'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    'calendar': '<rect x="3" y="4" width="18" height="18"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    'check': '<polyline points="20 6 9 17 4 12"/>', 'check-circle': '<circle cx="12" cy="12" r="10"/><polyline points="7 12 11 16 17 8"/>', 'alert-circle': '<circle cx="12" cy="12" r="10"/><line x1="12" y1="7" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    'info': '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="11"/><line x1="12" y1="7.5" x2="12.01" y2="7.5"/>', 'star': '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    'quote': '<path d="M3 21h7V11H6c0-3 1-5 4-6V2C5 3 3 7 3 12z"/><path d="M14 21h7V11h-4c0-3 1-5 4-6V2c-5 1-7 5-7 10z"/>',
    'menu': '<line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/>', 'x': '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    'chevron-down': '<polyline points="6 9 12 15 18 9"/>', 'chevron-up': '<polyline points="18 15 12 9 6 15"/>', 'chevron-left': '<polyline points="15 18 9 12 15 6"/>', 'chevron-right': '<polyline points="9 18 15 12 9 6"/>',
    'search': '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>', 'user': '<rect x="7" y="3" width="10" height="10"/><path d="M4 21v-3h16v3"/>', 'users': '<rect x="3" y="6" width="8" height="8"/><rect x="13" y="9" width="8" height="8"/><path d="M3 21v-3h8v3M13 21v-1h8v1"/>',
    'lock': '<rect x="4" y="11" width="16" height="10"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>', 'eye': '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><rect x="10" y="10" width="4" height="4"/>',
    'eye-off': '<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c7 0 11 7 11 7a18 18 0 0 1-3.2 4M6.1 6.1A18 18 0 0 0 1 12s4 7 11 7a10 10 0 0 0 4-.8"/>',
    'share': '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/>',
    'facebook': '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>', 'linkedin': '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><rect x="2" y="2" width="4" height="4"/>',
    'youtube': '<rect x="2" y="5" width="20" height="14"/><polygon points="10 9 16 12 10 15 10 9"/>', 'instagram': '<rect x="2" y="2" width="20" height="20"/><circle cx="12" cy="12" r="4.5"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
    'message-circle': '<path d="M3 3h18v14H8l-5 4z"/>', 'activity': '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>', 'shield': '<path d="M12 22s8-4 8-10V4H4v8c0 6 8 10 8 10z"/>',
    'award': '<circle cx="12" cy="8" r="6"/><polyline points="8.2 13.9 7 22 12 19 17 22 15.8 13.9"/>', 'heart': '<path d="M12 21 3 12a5 5 0 0 1 9-5 5 5 0 0 1 9 5z"/>', 'target': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="5"/><rect x="11" y="11" width="2" height="2"/>',
    'building': '<rect x="4" y="2" width="16" height="20"/><path d="M9 22v-4h6v4"/><path d="M8 6h2M14 6h2M8 10h2M14 10h2M8 14h2M14 14h2"/>', 'car': '<path d="M3 17h18v-5l-3-5H6l-3 5z"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/>',
    'wifi': '<path d="M5 12.5a10 10 0 0 1 14 0M1.4 9a15 15 0 0 1 21.2 0M8.5 16a5 5 0 0 1 7 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>', 'video': '<rect x="2" y="6" width="14" height="12"/><polygon points="16 10 22 6 22 18 16 14"/>',
    'wheelchair': '<circle cx="12" cy="4" r="1.5"/><path d="M12 7v6h5l3 5M8 11a5 5 0 1 0 6 7"/>', 'download': '<path d="M21 15v6H3v-6"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    'filter': '<polygon points="22 3 2 3 10 12.5 10 20 14 22 14 12.5 22 3"/>', 'tag': '<path d="M20.6 13.4 13.4 20.6a1 1 0 0 1-1.4 0L2 12V2h10l8.6 8.6a1 1 0 0 1 0 2.8z"/>',
    'book-open': '<path d="M2 3h7a3 3 0 0 1 3 3v15a2 2 0 0 0-2-2H2z"/><path d="M22 3h-7a3 3 0 0 0-3 3v15a2 2 0 0 1 2-2h8z"/>', 'play': '<polygon points="6 3 20 12 6 21 6 3"/>',
    'plus': '<line x1="12" y1="4" x2="12" y2="20"/><line x1="4" y1="12" x2="20" y2="12"/>', 'minus': '<line x1="4" y1="12" x2="20" y2="12"/>',
    'printer': '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H2v-8h20v8h-4"/><rect x="6" y="14" width="12" height="8"/>', 'external-link': '<path d="M18 13v8H3V6h8"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
    'globe': '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/>',
    'file-text': '<path d="M14 2H5v20h14V7z"/><polyline points="14 2 14 7 19 7"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>', 'credit-card': '<rect x="1" y="4" width="22" height="16"/><line x1="1" y1="10" x2="23" y2="10"/>',
    'copy': '<rect x="9" y="9" width="13" height="13"/><path d="M5 15H2V2h13v3"/>', 'trending-up': '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>', 'home': '<path d="M3 10 12 2l9 8v12H3z"/><rect x="9" y="14" width="6" height="8"/>',
    'log-in': '<path d="M15 3h6v18h-6"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>', 'send': '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
    'sparkles': '<path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>', 'layers': '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    'brain': '<path d="M9 3a4 4 0 0 0-4 4 4 4 0 0 0-2 5 4 4 0 0 0 2 5 4 4 0 0 0 4 4h6a4 4 0 0 0 4-4 4 4 0 0 0 2-5 4 4 0 0 0-2-5 4 4 0 0 0-4-4z"/><line x1="12" y1="3" x2="12" y2="21"/>', 'moon': '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>', 'sun': '<circle cx="12" cy="12" r="5"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>'
  };
  var INK = '#0A0A0A', LIME = '#CCFF00';
  function dk(t) { return t === 'dark'; }
  function press(tone) { return 'transition-all duration-150 ease-out hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0.5 active:translate-y-0.5 ' + (dk(tone) ? 'shadow-hard-lime hover:shadow-[12px_12px_0_0_#CCFF00]' : 'shadow-hard hover:shadow-[12px_12px_0_0_#0A0A0A]'); }
  function trim1(n) { return String(Math.round(n * 10) / 10).replace(/\.0$/, ''); }
  function shortBDT(n) { return n >= 100000 ? trim1(n / 100000) + ' lakh' : Number(n).toLocaleString('en-IN'); }
  var DISPLAY = "font-display font-black uppercase tracking-tighter [font-variation-settings:'wdth'_125]";

  var UI = {
    cls: {
      container: 'mx-auto w-full max-w-[90rem] px-4 sm:px-8',
      secWhite: 'relative border-b-4 border-ink bg-white py-16 text-ink md:py-28', secConcrete: 'relative border-b-4 border-ink bg-concrete py-16 text-ink md:py-28',
      secInk: 'relative border-b-4 border-ink bg-ink py-16 text-white md:py-28', secUltra: 'relative border-b-4 border-ink bg-ultra py-16 text-white md:py-28',
      secLime: 'relative border-b-4 border-ink bg-lime py-16 text-ink md:py-28', secDusk: 'relative border-b-4 border-ink bg-grad-dusk py-16 text-white md:py-28',
      secTang: 'relative border-b-4 border-ink bg-tang py-16 text-ink md:py-28',
      display: DISPLAY,
      h1: DISPLAY + ' text-[clamp(2.75rem,10.5vw,9.5rem)] leading-[0.86]',
      h2: DISPLAY + ' text-[clamp(2.25rem,7vw,6rem)] leading-[0.9]',
      h3: DISPLAY + ' text-2xl leading-[0.95] md:text-3xl',
      mono: 'font-mono text-xs font-bold uppercase tracking-[0.14em]',
      outline: 'text-transparent [-webkit-text-stroke:3px_currentColor]',
      box: 'border-4 border-ink bg-white text-ink shadow-hard',
      btnLime: 'inline-flex items-center justify-center gap-3 border-4 border-ink bg-lime px-6 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-ink shadow-hard transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#0A0A0A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra',
      btnInk: 'inline-flex items-center justify-center gap-3 border-4 border-ink bg-ink px-6 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-white shadow-hard-ultra transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#2A3BFF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime',
      btnWhite: 'inline-flex items-center justify-center gap-3 border-4 border-ink bg-white px-6 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-ink shadow-hard-lime transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#CCFF00] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime',
      btnOutline: 'inline-flex items-center justify-center gap-3 border-4 border-current bg-transparent px-6 py-3.5 font-mono text-sm font-bold uppercase tracking-wider transition-colors duration-150 hover:bg-ink hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra',
      iconBox: 'flex h-12 w-12 shrink-0 items-center justify-center border-4 border-ink bg-lime text-ink',
      arrowBtn: 'flex h-14 w-14 items-center justify-center border-4 border-ink bg-white text-ink shadow-hard-sm transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-lime active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra',
      tab: 'border-4 border-ink bg-white px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-lime aria-selected:bg-ink aria-selected:text-lime focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra',
      chip: 'border-4 border-ink bg-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-lime aria-pressed:bg-ink aria-pressed:text-lime focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra',
      stickerCls: 'inline-block border-4 border-ink px-3 py-1 font-mono text-xs font-black uppercase shadow-hard-sm'
    },
    ready: function (fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); },
    qs: function (s, r) { return (r || document).querySelector(s); },
    qsa: function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); },
    esc: function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); },
    emph: function (s) { return UI.esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>'); },
    getParam: function (n) { return new URLSearchParams(window.location.search).get(n); },
    debounce: function (fn, ms) { var t; return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { fn.apply(c, a); }, ms || 200); }; },
    slugify: function (s) { return String(s).toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); },
    pad: function (n) { return String(n).padStart(2, '0'); },
    formatBDT: function (n) { return '\u09F3' + Number(n).toLocaleString('en-IN'); },
    formatBDTRange: function (a, b) { if (a >= 100000 && b >= 100000) return '\u09F3' + trim1(a / 100000) + ' \u2013 ' + trim1(b / 100000) + ' lakh'; return '\u09F3' + shortBDT(a) + ' \u2013 ' + shortBDT(b); },
    formatDate: function (iso, style) { var d = new Date(String(iso).indexOf('T') > -1 ? iso : iso + 'T00:00:00'); return d.toLocaleDateString('en-GB', { day: 'numeric', month: style === 'short' ? 'short' : 'long', year: 'numeric' }); },
    formatTime: function (date) { return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); },
    isBDPhone: function (v) { return /^(?:\+?88)?01[3-9]\d{8}$/.test(String(v).replace(/[\s-]/g, '')); },
    icon: function (name, cls) {
      var filled = /-fill$/.test(name), base = name.replace(/-fill$/, ''), d = ICONS[base]; if (!d) return '';
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="' + (cls || 'h-5 w-5') + '" fill="' + (filled ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2.4" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false">' + d + '</svg>';
    },
    iconNames: function () { return Object.keys(ICONS); },
    img: function (src, alt, cls, o) { o = o || {}; var w = o.w || 800, h = o.h || 600; return '<img src="' + UI.esc(src) + '" alt="' + UI.esc(alt) + '" width="' + w + '" height="' + h + '" class="' + (cls || '') + '" loading="' + (o.eager ? 'eager' : 'lazy') + '"' + (o.eager ? ' fetchpriority="high"' : '') + ' decoding="async">'; },
    deco: function (src, cls) { return '<img src="' + UI.esc(src) + '" alt="" aria-hidden="true" width="400" height="400" class="' + (cls || '') + '" loading="lazy" decoding="async">'; },
    stars: function (r, cls) { var o = '<span class="inline-flex items-center gap-0.5" role="img" aria-label="Rated ' + r + ' out of 5">'; for (var i = 1; i <= 5; i++) o += UI.icon('star-fill', (cls || 'h-4 w-4') + (i <= Math.round(r) ? ' text-tang' : ' text-concrete-300')); return o + '</span>'; },

    badge: function (text, tone) { return '<span class="inline-block border-2 border-current px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider' + (dk(tone) ? ' text-white' : ' text-ink') + '">' + UI.esc(text) + '</span>'; },
    sticker: function (text, o) { o = o || {}; return '<span class="' + UI.cls.stickerCls + ' ' + (o.bg || 'bg-lime') + ' text-ink ' + (o.rotate || '-rotate-3') + '">' + UI.esc(text) + '</span>'; },
    breadcrumb: function (items) {
      return '<nav aria-label="Breadcrumb"><ol class="inline-flex flex-wrap border-4 border-ink bg-white font-mono text-xs font-bold uppercase text-ink shadow-hard-sm">' + items.map(function (it, i) {
        var last = i === items.length - 1, bd = last ? '' : ' border-r-4 border-ink';
        return '<li class="px-3 py-2' + bd + '">' + (last ? '<span aria-current="page" class="bg-lime px-1">' + UI.esc(it.label) + '</span>' : '<a href="' + it.href + '" class="underline-offset-4 hover:underline">' + UI.esc(it.label) + '</a>') + '</li>';
      }).join('') + '</ol></nav>';
    },
    /* ticker tape. tone: ink|lime|ultra|tang|white. items = strings */
    tape: function (items, o) {
      o = o || {}; var tn = { ink: 'bg-ink text-lime', lime: 'bg-lime text-ink', ultra: 'bg-ultra text-white', tang: 'bg-tang text-ink', white: 'bg-white text-ink' }[o.tone || 'ink'];
      var row = items.map(function (i) { return '<li class="flex items-center gap-6 whitespace-nowrap px-3"><span class="' + UI.cls.display + ' text-3xl md:text-5xl">' + UI.esc(i) + '</span>' + UI.icon('star-fill', 'h-6 w-6') + '</li>'; }).join('');
      return '<div class="overflow-x-clip py-2"><div data-component="Tape" aria-hidden="true" class="overflow-hidden border-y-4 border-ink py-3 ' + tn + ' ' + (o.rotate || '') + '"><ul class="flex w-max motion-safe:' + (o.reverse ? 'animate-ticker-rev' : 'animate-ticker') + ' hover:[animation-play-state:paused]">' + row + row + '</ul></div>';
    },
    /* o: {index:'01', eyebrow, title(*highlight*), lead, tone:'light'|'dark', align:'left'|'center'} */
    sectionHead: function (o) {
      var d = dk(o.tone), hl = d ? '[&_em]:bg-lime [&_em]:text-ink' : '[&_em]:bg-ink [&_em]:text-lime';
      return '<div data-component="SectionHead" class="' + (o.align === 'center' ? 'mx-auto max-w-5xl text-center' : 'max-w-5xl') + '"><div class="flex flex-wrap items-center gap-3 ' + (o.align === 'center' ? 'justify-center' : '') + '" data-reveal="cut">' + (o.index ? '<span class="border-4 border-ink bg-lime px-3 py-1 font-mono text-sm font-black text-ink">\u00A7' + UI.esc(o.index) + '</span>' : '') + (o.eyebrow ? '<span class="' + UI.cls.mono + '">' + UI.esc(o.eyebrow) + '</span>' : '') + '</div>' +
        '<h2 data-reveal="slam" class="mt-5 ' + UI.cls.h2 + ' ' + hl + ' [&_em]:not-italic [&_em]:px-2 [&_em]:[box-decoration-break:clone]">' + UI.emph(o.title) + '</h2>' + (o.lead ? '<p data-reveal="cut" data-delay="150" class="mt-6 max-w-2xl text-lg leading-relaxed ' + (d ? 'text-white/80' : 'text-ink/80') + '">' + UI.esc(o.lead) + '</p>' : '') + '</div>';
    },
    /* Standard inner-page hero. o:{index:'02',eyebrow,title(*highlight*),lead,crumbs:[{label,href}],actionsHTML,tone:'ultra'|'lime'|'ink'|'dusk'|'tang'} */
    pageHero: function (o) {
      var tone = o.tone || 'ultra', ob = SITE.img.objects;
      var bg = { ultra: 'bg-ultra text-white', lime: 'bg-lime text-ink', ink: 'bg-ink text-white', dusk: 'bg-grad-dusk text-white', tang: 'bg-tang text-ink' }[tone];
      var grid = (tone === 'lime' || tone === 'tang') ? 'bg-grid-ink' : 'bg-grid-white', hl = (tone === 'lime' || tone === 'tang') ? '[&_em]:bg-ink [&_em]:text-lime' : '[&_em]:bg-lime [&_em]:text-ink';
      return '<section data-component="PageHero" data-section="page-hero" id="page-hero" class="relative overflow-x-clip border-b-4 border-ink ' + bg + '"><div aria-hidden="true" class="absolute inset-0 ' + grid + ' [background-size:64px_64px]"></div>' +
        '<div aria-hidden="true" data-parallax="-0.18" class="pointer-events-none absolute -right-4 top-24 select-none font-display text-[34vw] font-black leading-none ' + UI.cls.outline + ' opacity-40 md:top-16">' + UI.esc(o.index || '00') + '</div>' +
        '<div aria-hidden="true" class="pointer-events-none absolute inset-0 hidden md:block"><div data-parallax="0.25" data-parallax-rotate="25" class="absolute right-[12%] top-[38%] w-40">' + UI.deco(ob.sun, 'w-full') + '</div><div data-parallax="-0.3" data-parallax-rotate="-20" class="absolute right-[34%] bottom-16 w-24">' + UI.deco(ob.cube, 'w-full') + '</div><div data-parallax="0.15" class="absolute left-[56%] top-28 w-28">' + UI.deco(ob.star, 'w-full motion-safe:animate-spin-step') + '</div></div>' +
        '<div class="' + UI.cls.container + ' relative pb-16 pt-32 md:pb-28 md:pt-44">' + (o.crumbs ? '<div data-reveal="cut">' + UI.breadcrumb(o.crumbs) + '</div>' : '') + (o.eyebrow ? '<p data-reveal="cut" data-delay="100" class="mt-8 inline-block border-4 border-ink bg-white px-3 py-1 font-mono text-xs font-black uppercase tracking-widest text-ink">' + UI.esc(o.eyebrow) + '</p>' : '') +
        '<h1 data-reveal="slam" data-delay="150" class="mt-6 max-w-6xl ' + UI.cls.h1 + ' ' + hl + ' [&_em]:not-italic [&_em]:px-3 [&_em]:[box-decoration-break:clone]">' + UI.emph(o.title) + '</h1>' +
        (o.lead ? '<p data-reveal="cut" data-delay="350" class="mt-8 max-w-2xl text-lg leading-relaxed md:text-xl ' + (tone === 'lime' || tone === 'tang' ? 'text-ink' : 'text-white/90') + '">' + UI.esc(o.lead) + '</p>' : '') +
        (o.actionsHTML ? '<div data-reveal="cut" data-delay="450" class="mt-10 flex flex-wrap gap-4">' + o.actionsHTML + '</div>' : '') + '</div></section>';
    },
    statBlock: function (o) {
      return '<div data-component="StatBlock" data-reveal="stamp" data-delay="' + (o.delay || 0) + '" class="border-4 border-ink bg-white p-5 text-ink ' + (dk(o.tone) ? 'shadow-hard-lime' : 'shadow-hard') + '"><p class="' + UI.cls.display + ' text-5xl leading-none md:text-7xl"><span data-counter="' + o.value + '"' + (o.suffix ? ' data-suffix="' + UI.esc(o.suffix) + '"' : '') + (o.decimals ? ' data-decimals="' + o.decimals + '"' : '') + '>' + o.value + '</span></p><p class="mt-3 border-t-4 border-ink pt-2 ' + UI.cls.mono + '">' + UI.esc(o.label) + '</p></div>';
    },
    serviceCard: function (s, o) {
      o = o || {}; var idx = o.index != null ? UI.pad(o.index) : s.id.replace('svc-', '').slice(-2);
      return '<article data-component="ServiceCard" data-category="' + UI.esc(s.category) + '" class="group h-full"><a href="' + SITE.url.service(s.slug) + '" class="flex h-full flex-col border-4 border-ink bg-white text-ink ' + press(o.tone) + ' group-hover:bg-lime focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra">' +
        '<div class="flex items-center justify-between border-b-4 border-ink px-4 py-2 ' + UI.cls.mono + '"><span>\u2116 ' + idx + '</span><span>' + UI.esc(s.category.replace('-', ' ')) + '</span></div>' +
        '<div data-parallax-img class="relative aspect-[4/3] overflow-hidden border-b-4 border-ink bg-concrete">' + UI.img(s.image, s.name, 'absolute inset-0 h-[125%] w-full object-cover', { w: 800, h: 600 }) + '</div>' +
        '<div class="flex flex-1 flex-col p-5"><h3 class="' + UI.cls.h3 + '">' + UI.esc(s.name) + '</h3><p class="mt-3 text-sm leading-relaxed text-ink/80">' + UI.esc(s.short) + '</p>' +
        '<div class="mt-auto flex items-end justify-between gap-3 border-t-4 border-ink pt-4"><p class="font-mono text-xs font-bold">' + UI.formatBDTRange(s.priceFrom, s.priceTo) + '<span class="block font-normal opacity-70">' + UI.esc(s.priceUnit) + '</span></p><span class="flex h-12 w-12 shrink-0 items-center justify-center border-4 border-ink bg-ink text-lime transition-transform duration-150 group-hover:translate-x-1">' + UI.icon('arrow-right', 'h-5 w-5') + '</span></div></div></a></article>';
    },
    chamberCard: function (c, o) {
      o = o || {}; var online = c.mode === 'online';
      return '<article data-component="ChamberCard" class="group h-full"><div class="flex h-full flex-col border-4 border-ink bg-white text-ink ' + press(o.tone) + '">' +
        '<div class="flex items-center justify-between border-b-4 border-ink px-4 py-2 ' + UI.cls.mono + '"><span>' + UI.esc(c.area) + ' \u00B7 ' + UI.esc(c.city) + '</span><span class="' + (online ? 'bg-tang' : 'bg-lime') + ' px-2">' + (online ? 'Online' : 'In person') + '</span></div>' +
        '<div data-parallax-img class="relative aspect-[4/3] overflow-hidden border-b-4 border-ink bg-concrete">' + UI.img(c.image, c.name + (online ? ' video consultation' : ' building'), 'absolute inset-0 h-[125%] w-full object-cover', { w: 800, h: 600 }) + '</div>' +
        '<div class="flex flex-1 flex-col p-5"><h3 class="' + UI.cls.h3 + '">' + UI.esc(c.name) + '</h3><ul class="mt-4 space-y-2 text-sm"><li class="flex gap-2">' + UI.icon(online ? 'video' : 'map-pin', 'mt-0.5 h-4 w-4 shrink-0') + '<span>' + UI.esc(c.address) + '</span></li>' +
        c.schedule.map(function (s) { return '<li class="flex gap-2">' + UI.icon('clock', 'mt-0.5 h-4 w-4 shrink-0') + '<span><b>' + UI.esc(s.label) + '</b> \u00B7 ' + UI.esc(s.hours) + '</span></li>'; }).join('') + '<li class="flex gap-2">' + UI.icon('credit-card', 'mt-0.5 h-4 w-4 shrink-0') + '<span>First visit ' + UI.formatBDT(c.fee.firstVisit) + ' \u00B7 Follow-up ' + UI.formatBDT(c.fee.followUp) + '</span></li></ul>' +
        '<div class="mt-auto flex flex-wrap gap-3 pt-6"><a href="' + SITE.url.appointment({ chamber: c.slug }) + '" class="' + UI.cls.btnLime + ' !px-4 !py-2.5 text-xs">Book here' + UI.icon('arrow-right', 'h-4 w-4') + '</a><a href="' + SITE.url.chamber(c.slug) + '" class="' + UI.cls.btnOutline + ' !px-4 !py-2.5 text-xs">Details</a></div></div></div></article>';
    },
    postCard: function (p, o) {
      o = o || {};
      return '<article data-component="PostCard" class="group h-full"><a href="' + SITE.url.blog(p.slug) + '" class="flex h-full flex-col border-4 border-ink bg-white text-ink ' + press(o.tone) + ' group-hover:bg-lime focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra">' +
        '<div data-parallax-img class="relative aspect-[16/10] overflow-hidden border-b-4 border-ink bg-concrete">' + UI.img(p.image, p.title, 'absolute inset-0 h-[125%] w-full object-cover', { w: 800, h: 500 }) + '</div>' +
        '<div class="flex flex-1 flex-col p-5"><div class="flex flex-wrap items-center gap-2 ' + UI.cls.mono + '"><span class="bg-ink px-2 py-0.5 text-lime">' + UI.esc(p.category) + '</span><span>' + UI.formatDate(p.date, 'short') + ' \u00B7 ' + p.readMinutes + ' min</span></div>' +
        '<h3 class="mt-4 ' + UI.cls.h3 + '">' + UI.esc(p.title) + '</h3><p class="mt-3 text-sm leading-relaxed text-ink/80">' + UI.esc(p.excerpt) + '</p><p class="mt-auto inline-flex items-center gap-2 pt-5 font-mono text-xs font-black uppercase">Read article' + UI.icon('arrow-right', 'h-4 w-4 transition-transform group-hover:translate-x-1') + '</p></div></a></article>';
    },
    testimonialCard: function (x, o) {
      o = o || {}; var s = SITE.getService(x.serviceSlug);
      return '<figure data-component="TestimonialCard" class="relative flex h-full flex-col border-4 border-ink bg-white p-6 text-ink ' + (dk(o.tone) ? 'shadow-hard-lime' : 'shadow-hard') + '"><span aria-hidden="true" class="absolute -top-5 right-4 -rotate-3 ' + UI.cls.stickerCls + ' bg-lime">Verified patient</span>' +
        '<span aria-hidden="true" class="font-display text-8xl font-black leading-[0.6]">\u201C</span><blockquote class="mt-4 text-lg font-medium leading-relaxed">' + UI.esc(x.quote) + '</blockquote>' +
        '<figcaption class="mt-auto flex items-center justify-between gap-4 border-t-4 border-ink pt-4 pt-5"><span class="min-w-0"><span class="block font-display text-lg font-black uppercase">' + UI.esc(x.name) + ', ' + x.age + '</span><span class="block truncate font-mono text-xs">' + UI.esc(x.area) + (s ? ' \u00B7 ' + UI.esc(s.name) : '') + '</span></span>' + UI.stars(x.rating) + '</figcaption></figure>';
    },
    faqItem: function (o) {
      var id = UI.esc(o.id), open = !!o.open;
      return '<div data-component="FaqItem" data-accordion-item class="border-4 border-ink bg-white text-ink ' + (dk(o.tone) ? 'shadow-hard-lime' : 'shadow-hard-sm') + '"><h3><button type="button" id="acc-btn-' + id + '" data-accordion-trigger aria-expanded="' + open + '" aria-controls="acc-panel-' + id + '" class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left ' + UI.cls.display + ' text-lg hover:bg-lime focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-ultra md:text-xl"><span>' + UI.esc(o.question) + '</span><span data-accordion-icon class="flex h-10 w-10 shrink-0 items-center justify-center border-4 border-ink bg-ink text-lime transition-transform duration-200' + (open ? ' rotate-45' : '') + '">' + UI.icon('plus', 'h-5 w-5') + '</span></button></h3>' +
        '<div id="acc-panel-' + id + '" role="region" aria-labelledby="acc-btn-' + id + '" data-accordion-panel' + (open ? '' : ' inert') + ' class="grid transition-[grid-template-rows] duration-200 ' + (open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]') + '"><div class="overflow-hidden"><div class="border-t-4 border-ink px-5 py-5 leading-relaxed">' + o.answerHTML + '</div></div></div></div>';
    },
    /* Complete lime CTA section. o:{title(*highlight*),lead,primaryLabel,primaryHref,secondaryLabel,secondaryHref} */
    ctaBand: function (o) {
      return '<section data-component="CtaBand" data-section="cta" id="cta" class="relative overflow-x-clip border-b-4 border-ink bg-lime text-ink"><div aria-hidden="true" class="absolute inset-0 bg-grid-ink [background-size:64px_64px]"></div><div class="' + UI.cls.container + ' relative py-16 md:py-28"><div class="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]"><h2 data-reveal="slam" class="' + UI.cls.h1 + ' [&_em]:bg-ink [&_em]:px-3 [&_em]:not-italic [&_em]:text-lime [&_em]:[box-decoration-break:clone]">' + UI.emph(o.title) + '</h2><div data-reveal="cut" data-delay="200"><p class="text-lg leading-relaxed md:text-xl">' + UI.esc(o.lead) + '</p><div class="mt-8 flex flex-wrap gap-4"><a href="' + (o.primaryHref || SITE.routes.appointment) + '" class="' + UI.cls.btnInk + '">' + UI.esc(o.primaryLabel || 'Book Appointment') + UI.icon('arrow-right', 'h-5 w-5') + '</a><a href="' + (o.secondaryHref || 'tel:' + SITE.contact.phone.e164) + '" class="' + UI.cls.btnWhite + ' !shadow-hard">' + UI.icon('phone', 'h-5 w-5') + UI.esc(o.secondaryLabel || SITE.contact.phone.display) + '</a></div></div></div></div></section>';
    },
    /* Form field. o:{label,name,type:'text|email|tel|password|date|number|select|textarea|checkbox',required,placeholder,options,rows,minlength,validate:'bd-phone',autocomplete,hint,tone,value,min,max,labelHTML} */
    field: function (o) {
      var id = 'f-' + o.name, type = o.type || 'text', d = dk(o.tone);
      var base = 'w-full border-4 border-ink bg-white px-4 py-3 font-mono text-base text-ink placeholder:text-ink/40 transition focus:bg-lime/30 focus:shadow-hard-ultra focus:outline-none aria-[invalid=true]:border-alert aria-[invalid=true]:bg-alert/10';
      var attrs = ' id="' + id + '" name="' + o.name + '"' + (o.required ? ' required' : '') + (o.minlength ? ' minlength="' + o.minlength + '"' : '') + (o.validate ? ' data-validate="' + o.validate + '"' : '') + (o.autocomplete ? ' autocomplete="' + o.autocomplete + '"' : '') + (o.placeholder ? ' placeholder="' + UI.esc(o.placeholder) + '"' : '') + ' aria-describedby="err-' + o.name + '"', ctl;
      if (type === 'select') ctl = '<div class="relative"><select' + attrs + ' class="' + base + ' appearance-none pr-12"><option value="">' + UI.esc(o.placeholder || 'Select\u2026') + '</option>' + (o.options || []).map(function (x) { var v = typeof x === 'string' ? x : x.value, l = typeof x === 'string' ? x : x.label; return '<option value="' + UI.esc(v) + '"' + (o.value === v ? ' selected' : '') + '>' + UI.esc(l) + '</option>'; }).join('') + '</select><span class="pointer-events-none absolute inset-y-0 right-0 flex w-11 items-center justify-center border-l-4 border-ink bg-ink text-lime">' + UI.icon('chevron-down', 'h-5 w-5') + '</span></div>';
      else if (type === 'textarea') ctl = '<textarea' + attrs + ' rows="' + (o.rows || 5) + '" class="' + base + '">' + UI.esc(o.value || '') + '</textarea>';
      else if (type === 'checkbox') return '<div data-component="Field"><label class="flex cursor-pointer items-start gap-3 text-sm ' + (d ? 'text-white' : 'text-ink') + '"><input type="checkbox"' + attrs + ' class="mt-0.5 h-6 w-6 shrink-0 appearance-none border-4 border-ink bg-white checked:bg-lime focus-visible:ring-4 focus-visible:ring-ultra"><span>' + o.labelHTML + '</span></label><p id="err-' + o.name + '" data-error-for="' + o.name + '" class="mt-1 hidden font-mono text-sm font-bold text-alert"></p></div>';
      else ctl = '<input type="' + type + '"' + attrs + (o.value ? ' value="' + UI.esc(o.value) + '"' : '') + (o.min ? ' min="' + o.min + '"' : '') + (o.max ? ' max="' + o.max + '"' : '') + ' class="' + base + '">';
      return '<div data-component="Field"><label for="' + id + '" class="mb-2 block ' + UI.cls.mono + ' ' + (d ? 'text-white' : 'text-ink') + '">' + UI.esc(o.label) + (o.required ? ' <span class="text-tang" aria-hidden="true">*</span>' : '') + '</label>' + ctl + (o.hint ? '<p class="mt-1 text-xs ' + (d ? 'text-white/70' : 'text-ink/70') + '">' + UI.esc(o.hint) + '</p>' : '') + '<p id="err-' + o.name + '" data-error-for="' + o.name + '" class="mt-1 hidden font-mono text-sm font-bold ' + (d ? 'text-lime' : 'text-alert') + '"></p></div>';
    },
    validateForm: function (form) {
      var ok = true, first = null;
      Array.prototype.forEach.call(form.querySelectorAll('[name]'), function (f) {
        if (f.disabled || f.type === 'hidden' || f.type === 'submit' || f.type === 'button') return;
        var m = form.querySelector('[data-error-for="' + f.name + '"]'), msg = '';
        var empty = f.type === 'checkbox' ? !f.checked : f.type === 'radio' ? !form.querySelector('[name="' + f.name + '"]:checked') : !String(f.value).trim();
        if (f.required && empty) msg = f.type === 'checkbox' ? 'Please tick this box to continue.' : 'This field is required.';
        else if (f.type === 'email' && f.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) msg = 'Enter a valid email address.';
        else if (f.getAttribute('data-validate') === 'bd-phone' && f.value && !UI.isBDPhone(f.value)) msg = 'Enter a valid Bangladeshi mobile number, e.g. 01712-345678.';
        else if (f.minLength > 0 && f.value && f.value.length < f.minLength) msg = 'Please enter at least ' + f.minLength + ' characters.';
        f.setAttribute('aria-invalid', msg ? 'true' : 'false');
        if (m) { m.textContent = msg; m.classList.toggle('hidden', !msg); }
        if (msg) { ok = false; if (!first) first = f; }
      });
      if (first) first.focus(); return ok;
    },
    toast: function (message, type) {
      type = type || 'success'; var root = document.getElementById('toast-root');
      if (!root) { root = document.createElement('div'); root.id = 'toast-root'; root.setAttribute('role', 'status'); root.setAttribute('aria-live', 'polite'); root.className = 'pointer-events-none fixed inset-x-0 top-24 z-[80] flex flex-col items-center gap-3 px-4'; document.body.appendChild(root); }
      var el = document.createElement('div'); el.className = 'pointer-events-auto flex max-w-md items-center gap-3 border-4 border-ink px-5 py-3 font-mono text-sm font-bold uppercase shadow-hard motion-safe:animate-slam ' + (type === 'error' ? 'bg-alert text-white' : type === 'info' ? 'bg-ultra text-white' : 'bg-lime text-ink');
      el.innerHTML = UI.icon(type === 'error' ? 'alert-circle' : 'check-circle', 'h-5 w-5 shrink-0') + '<span>' + UI.esc(message) + '</span>'; root.appendChild(el);
      setTimeout(function () { el.remove(); }, 4200);
    },
    copy: function (text) { var done = function () { UI.toast('Copied to clipboard'); }; if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(done); var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) { /* ignore */ } ta.remove(); return Promise.resolve(); },
    scrollLock: function (on) { document.documentElement.classList.toggle('overflow-hidden', !!on); },
    trapFocus: function (c) {
      var sel = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
      function k(e) { if (e.key !== 'Tab') return; var f = c.querySelectorAll(sel); if (!f.length) return; var a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
      c.addEventListener('keydown', k); return function () { c.removeEventListener('keydown', k); };
    },
    accordion: function (root) {
      if (!root || root.hasAttribute('data-accordion-bound')) return; root.setAttribute('data-accordion-bound', '');
      function set(btn, open) { var p = document.getElementById(btn.getAttribute('aria-controls')); if (!p) return; btn.setAttribute('aria-expanded', String(open)); p.classList.toggle('grid-rows-[1fr]', open); p.classList.toggle('grid-rows-[0fr]', !open); if (open) p.removeAttribute('inert'); else p.setAttribute('inert', ''); var ic = btn.querySelector('[data-accordion-icon]'); if (ic) ic.classList.toggle('rotate-45', open); }
      root.addEventListener('click', function (e) { var b = e.target.closest('[data-accordion-trigger]'); if (!b || !root.contains(b)) return; var will = b.getAttribute('aria-expanded') !== 'true'; if (root.hasAttribute('data-accordion-single')) UI.qsa('[data-accordion-trigger][aria-expanded="true"]', root).forEach(function (x) { if (x !== b) set(x, false); }); set(b, will); });
    },
    tabs: function (root) {
      if (!root || root.hasAttribute('data-tabs-bound')) return; root.setAttribute('data-tabs-bound', '');
      var tabs = UI.qsa('[data-tab]', root), panels = UI.qsa('[data-tab-panel]', root);
      function show(id, focus) { tabs.forEach(function (t) { var on = t.getAttribute('data-tab') === id; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); }); panels.forEach(function (p) { var on = p.getAttribute('data-tab-panel') === id; p.classList.toggle('hidden', !on); if (on) { p.classList.remove('motion-safe:animate-cut'); void p.offsetWidth; p.classList.add('motion-safe:animate-cut'); } }); root.dispatchEvent(new CustomEvent('tabchange', { detail: { id: id } })); }
      tabs.forEach(function (t, i) { t.addEventListener('click', function () { show(t.getAttribute('data-tab')); }); t.addEventListener('keydown', function (e) { var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null; if (n === null) return; e.preventDefault(); n = (n + tabs.length) % tabs.length; show(tabs[n].getAttribute('data-tab'), true); }); });
      var init = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0]; if (init) show(init.getAttribute('data-tab'));
      root.showTab = show;
    },
    carousel: function (root) {
      if (!root || root.hasAttribute('data-carousel-bound')) return; root.setAttribute('data-carousel-bound', '');
      var track = root.querySelector('[data-carousel-track]'), slides = UI.qsa('[data-carousel-slide]', root), dots = root.querySelector('[data-carousel-dots]'), idx = 0, timer = null;
      if (!track || !slides.length) return;
      function go(i) { idx = (i + slides.length) % slides.length; track.scrollTo({ left: slides[idx].offsetLeft - track.offsetLeft, behavior: window.FX && FX.reduced() ? 'auto' : 'smooth' }); mark(); }
      function mark() { if (dots) UI.qsa('button', dots).forEach(function (b, i) { b.setAttribute('aria-current', i === idx ? 'true' : 'false'); b.classList.toggle('bg-lime', i === idx); b.classList.toggle('bg-white', i !== idx); }); }
      if (dots) { dots.innerHTML = slides.map(function (_, i) { return '<button type="button" aria-label="Go to slide ' + (i + 1) + '" class="h-4 w-4 border-2 border-ink bg-white"></button>'; }).join(''); UI.qsa('button', dots).forEach(function (b, i) { b.addEventListener('click', function () { go(i); }); }); }
      var p = root.querySelector('[data-carousel-prev]'), n = root.querySelector('[data-carousel-next]'); if (p) p.addEventListener('click', function () { go(idx - 1); }); if (n) n.addEventListener('click', function () { go(idx + 1); });
      track.addEventListener('scroll', UI.debounce(function () { var best = 0, d = 1e9; slides.forEach(function (s, i) { var x = Math.abs(s.offsetLeft - track.offsetLeft - track.scrollLeft); if (x < d) { d = x; best = i; } }); idx = best; mark(); }, 80), { passive: true });
      root.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') go(idx + 1); if (e.key === 'ArrowLeft') go(idx - 1); });
      var ms = parseInt(root.getAttribute('data-autoplay') || '0', 10);
      if (ms && !(window.FX && FX.reduced())) { var start = function () { stop(); timer = setInterval(function () { go(idx + 1); }, ms); }, stop = function () { clearInterval(timer); }; root.addEventListener('pointerenter', stop); root.addEventListener('pointerleave', start); root.addEventListener('focusin', stop); root.addEventListener('focusout', start); start(); }
      mark();
    },
    mount: function (container) {
      var c = container || document;
      if (window.FX) FX.init(c);
      UI.qsa('[data-accordion]', c).forEach(UI.accordion); UI.qsa('[data-tabs]', c).forEach(UI.tabs); UI.qsa('[data-carousel]', c).forEach(UI.carousel);
      if (c !== document && c.matches) { if (c.matches('[data-accordion]')) UI.accordion(c); if (c.matches('[data-tabs]')) UI.tabs(c); if (c.matches('[data-carousel]')) UI.carousel(c); }
    }
  };
  window.UI = UI;
  UI.ready(function () { UI.mount(document); });
})(window, document);
