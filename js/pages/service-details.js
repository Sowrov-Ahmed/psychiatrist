/*
 * js/pages/service-details.js — Single service page, driven by ?slug=
 * Path: js/pages/service-details.js · Owner: Part 3 · Purpose: merges SITE index + SERVICES detail and renders every section
 * Depends on: SITE, UI, FX (shared kit), window.SERVICES (js/data/services.js) · Exposes: nothing
 */
(function () {
  'use strict';
  var CAT = { adult: 'Adult', 'child-teen': 'Child & teen', therapy: 'Therapy', recovery: 'Recovery' };
  var TONE = { ultra: 'ultra', tang: 'tang', lilac: 'dusk', lime: 'lime', ink: 'ink' };
  var PRESS = 'transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#0A0A0A] active:translate-x-0.5 active:translate-y-0.5';
  var NAV = [['overview', 'Overview'], ['signs', 'Signs'], ['who-it-helps', 'Who it helps'], ['approach', 'Approach'], ['benefits', 'Benefits'], ['considerations', 'Considerations'], ['timeline', 'Timeline'], ['pricing', 'Pricing'], ['faqs', 'Questions'], ['related', 'Related']];

  function sec(id, cls, inner) { return '<section id="' + id + '" data-section="' + id + '" class="scroll-mt-40 ' + cls + '">' + inner + '</section>'; }
  function box(bg) { return 'border-4 border-ink ' + bg + ' p-6 shadow-hard md:p-10'; }
  function head(n, eyebrow, title, dark) {
    return '<div class="mb-8"><div data-reveal="cut" class="flex flex-wrap items-center gap-3"><span class="border-4 border-ink bg-lime px-3 py-1 font-mono text-sm font-black text-ink">\u00A7' + n + '</span><span class="' + UI.cls.mono + '">' + UI.esc(eyebrow) + '</span></div>' +
      '<h2 data-reveal="slam" class="mt-4 break-words ' + UI.cls.display + ' text-2xl leading-[0.9] sm:text-5xl md:text-6xl ' + (dark ? '[&_em]:bg-lime [&_em]:text-ink' : '[&_em]:bg-ink [&_em]:text-lime') + ' [&_em]:px-2 [&_em]:not-italic">' + UI.emph(title) + '</h2></div>';
  }
  function list(items, icon, cls) { return '<ul class="space-y-3">' + items.map(function (x) { return '<li class="flex gap-3 leading-relaxed">' + UI.icon(icon, 'mt-1 h-5 w-5 shrink-0 ' + (cls || '')) + '<span>' + UI.esc(x) + '</span></li>'; }).join('') + '</ul>'; }
  function meta(sel, attr, val) { var el = document.querySelector(sel); if (el) el.setAttribute(attr, val); }

  function booking(s) {
    var fees = SITE.chambersIndex.map(function (c) { return '<li class="flex items-baseline justify-between gap-3 border-t-2 border-ink py-2 text-sm"><span class="font-bold">' + UI.esc(c.chamberName.replace(' Chamber', '').replace(' Consultation', '')) + '</span><span class="font-mono text-xs">' + UI.formatBDT(c.fee.firstVisit) + ' / ' + UI.formatBDT(c.fee.followUp) + '</span></li>'; }).join('');
    return '<aside data-component="BookingBlock" aria-label="Book this service" class="hidden self-start border-4 border-ink bg-white p-6 text-ink shadow-hard-lime lg:sticky lg:top-28 lg:block"><p class="' + UI.cls.mono + '">Treatment course</p><p class="mt-2 ' + UI.cls.display + ' text-3xl leading-none">' + UI.formatBDTRange(s.priceFrom, s.priceTo) + '</p><p class="mt-1 text-sm">' + UI.esc(s.priceUnit) + '</p>' +
      '<p class="mt-5 ' + UI.cls.mono + '">Consultation, first / follow-up</p><ul class="mt-2">' + fees + '</ul><div class="mt-5 grid gap-3"><a href="' + SITE.url.appointment({ service: s.slug }) + '" class="' + UI.cls.btnLime + '">Book Appointment' + UI.icon('arrow-right', 'h-5 w-5') + '</a><a href="tel:' + SITE.contact.phone.e164 + '" class="' + UI.cls.btnInk + '">' + UI.icon('phone', 'h-5 w-5') + 'Call ' + UI.esc(SITE.contact.phone.local) + '</a><a href="' + SITE.contact.whatsappUrl + '" target="_blank" rel="noopener noreferrer" class="' + UI.cls.btnWhite + '">' + UI.icon('message-circle', 'h-5 w-5') + 'WhatsApp<span class="sr-only"> (opens in a new tab)</span></a></div></aside>';
  }
  function body(s) {
    var d = s.approach, tops = ['top-44 xl:top-24', 'top-48 xl:top-28', 'top-52 xl:top-32', 'top-56 xl:top-36', 'top-60 xl:top-40'], bgs = ['bg-lime', 'bg-white', 'bg-tang', 'bg-lilac', 'bg-white'];
    var hov = 'border-4 border-ink bg-white p-5 text-ink shadow-hard ' + PRESS;
    var icons = ['target', 'shield', 'award', 'heart'];
    var out = [];
    out.push(sec('overview', box('bg-white'), head('01', 'Overview', 'Overview') + '<div class="grid gap-10 lg:grid-cols-2 lg:items-start"><div data-parallax-img class="relative aspect-[4/3] overflow-hidden border-4 border-ink bg-concrete shadow-hard">' + UI.img(s.image, s.name + ' illustration', 'absolute inset-0 h-[125%] w-full object-cover', { w: 800, h: 600 }) + '</div><div><div data-reveal="cut" class="space-y-5 text-lg leading-relaxed">' + s.overview.map(function (x) { return '<p>' + UI.esc(x) + '</p>'; }).join('') + '</div><dl class="mt-8 grid gap-3 sm:grid-cols-3">' +
      [['Format', d.format], ['First visit', d.duration], ['For', CAT[s.category] || 'All ages']].map(function (r) { return '<div class="border-4 border-ink bg-lime p-3 text-ink"><dt class="' + UI.cls.mono + '">' + r[0] + '</dt><dd class="mt-1 text-sm font-bold">' + UI.esc(r[1]) + '</dd></div>'; }).join('') + '</dl></div></div>'));
    out.push(sec('signs', box('bg-concrete'), head('02', 'You may recognise this if\u2026', 'Signs') + '<ul class="grid gap-4 sm:grid-cols-2">' + s.signs.map(function (x, i) { return '<li data-reveal="cut" data-delay="' + i * 70 + '" class="flex gap-4 border-4 border-ink bg-white p-5 shadow-hard-sm"><span class="' + UI.cls.display + ' text-3xl leading-none">' + UI.pad(i + 1) + '</span><span class="leading-relaxed">' + UI.esc(x) + '</span></li>'; }).join('') + '</ul><p class="mt-6 font-mono text-xs font-bold uppercase">This page cannot diagnose you. Only an assessment can.</p>'));
    out.push(sec('who-it-helps', box('bg-white'), head('03', 'Fit', 'Who it helps') + '<div class="grid gap-6 md:grid-cols-2"><div data-reveal="left" class="border-4 border-ink bg-lime p-6 text-ink shadow-hard"><h3 class="' + UI.cls.h3 + '">A good fit if</h3><div class="mt-5">' + list(s.whoItHelps.ideal, 'check-circle') + '</div></div><div data-reveal="right" class="border-4 border-ink bg-ink p-6 text-white shadow-hard-lime"><h3 class="' + UI.cls.h3 + '">Not the right route if</h3><div class="mt-5">' + list(s.whoItHelps.notFor, 'alert-circle', 'text-lime') + '</div></div></div>'));
    out.push(sec('approach', box('bg-ultra text-white'), head('04', d.format + ' \u00B7 ' + d.duration, 'Approach', true) + '<ol class="space-y-6">' + d.steps.map(function (st, i) { return '<li class="sticky ' + tops[i % 5] + ' border-4 border-ink ' + bgs[i % 5] + ' p-5 text-ink shadow-hard-lime md:p-7"><div class="flex items-start gap-4"><span class="' + UI.cls.display + ' text-5xl leading-none md:text-7xl">' + UI.pad(i + 1) + '</span><div><h3 class="' + UI.cls.h3 + '">' + UI.esc(st.title) + '</h3><p class="mt-2 max-w-2xl leading-relaxed">' + UI.esc(st.description) + '</p></div></div></li>'; }).join('') + '</ol>'));
    out.push(sec('benefits', box('bg-lime'), head('05', 'What you gain', 'Benefits') + '<div class="grid gap-6 sm:grid-cols-2">' + s.benefits.map(function (b, i) { return '<article data-reveal="stamp" data-delay="' + i * 90 + '" class="' + hov + '"><span class="' + UI.cls.iconBox + '">' + UI.icon(icons[i % 4], 'h-6 w-6') + '</span><h3 class="mt-4 ' + UI.cls.h3 + '">' + UI.esc(b.title) + '</h3><p class="mt-2 leading-relaxed">' + UI.esc(b.description) + '</p></article>'; }).join('') + '</div>'));
    out.push(sec('considerations', box('bg-tang'), head('06', 'Honest limits', 'Considerations') + '<div class="grid gap-6 md:grid-cols-3">' + s.considerations.map(function (c, i) { return '<article data-reveal="cut" data-delay="' + i * 90 + '" class="border-4 border-ink bg-white p-5 text-ink shadow-hard-sm"><p class="' + UI.cls.mono + ' border-b-4 border-ink pb-2">Consider \u2116 ' + UI.pad(i + 1) + '</p><h3 class="mt-4 ' + UI.cls.h3 + '">' + UI.esc(c.title) + '</h3><p class="mt-2 leading-relaxed">' + UI.esc(c.description) + '</p></article>'; }).join('') + '</div>'));
    out.push(sec('timeline', box('bg-concrete'), head('07', 'What to expect', 'Timeline') + '<div class="relative pl-14 md:pl-20"><div aria-hidden="true" class="absolute left-4 top-0 h-full w-2 bg-concrete-300 md:left-7"></div><div aria-hidden="true" data-progress class="absolute left-4 top-0 h-full w-2 origin-top bg-ultra [transform:scaleY(var(--p))] md:left-7"></div><ol class="space-y-8">' +
      s.timeline.map(function (t) { return '<li class="relative"><span aria-hidden="true" class="absolute -left-12 top-5 h-6 w-6 border-4 border-ink bg-lime md:-left-[3.75rem]"></span><div data-reveal="cut" class="border-4 border-ink bg-white p-5 text-ink shadow-hard-sm"><p class="inline-block bg-ink px-2 py-1 ' + UI.cls.mono + ' text-lime">' + UI.esc(t.phase) + '</p><h3 class="mt-3 ' + UI.cls.h3 + '">' + UI.esc(t.title) + '</h3><p class="mt-2 leading-relaxed">' + UI.esc(t.description) + '</p></div></li>'; }).join('') + '</ol></div>'));
    var pr = s.pricing;
    out.push(sec('pricing', box('bg-ink text-white'), head('08', 'Fees', 'Pricing', true) + '<p class="' + UI.cls.display + ' text-3xl leading-none text-lime sm:text-5xl">' + UI.formatBDTRange(s.priceFrom, s.priceTo) + '</p><p class="mt-2 font-mono text-sm uppercase">' + UI.esc(s.priceUnit) + '</p><div class="mt-8 grid gap-8 md:grid-cols-2"><div><h3 class="' + UI.cls.mono + '">Included</h3><div class="mt-3">' + list(pr.inclusions, 'check', 'text-lime') + '</div></div><div><h3 class="' + UI.cls.mono + '">Not included</h3><div class="mt-3">' + list(pr.exclusions, 'x', 'text-tang') + '</div></div></div><p class="mt-8 max-w-2xl leading-relaxed">' + UI.esc(pr.note) + '</p><ul class="mt-6 flex flex-wrap gap-3" aria-label="Payment options">' + pr.paymentOptions.map(function (x) { return '<li class="border-4 border-ink bg-white px-3 py-1.5 font-mono text-xs font-bold uppercase text-ink">' + UI.esc(x) + '</li>'; }).join('') + '</ul><a href="' + SITE.url.appointment({ service: s.slug }) + '" class="' + UI.cls.btnLime + ' mt-8">Book this service' + UI.icon('arrow-right', 'h-5 w-5') + '</a>'));
    out.push(sec('faqs', box('bg-white'), head('09', 'Questions', 'Questions') + '<div data-accordion data-accordion-single class="space-y-4">' + s.faqs.map(function (f, i) { return UI.faqItem({ id: f.id, question: f.question, answerHTML: '<p>' + UI.esc(f.answer) + '</p>', tone: 'light', open: i === 0 }); }).join('') + '</div>'));
    var rel = (s.relatedSlugs || []).map(function (x) { return SITE.getService(x); }).filter(Boolean), posts = (s.relatedBlogSlugs || []).map(function (x) { return SITE.getPost(x); }).filter(Boolean);
    out.push(sec('related', box('bg-concrete'), head('10', 'Keep reading', 'Related') + '<h3 class="' + UI.cls.mono + '">Related services</h3><div class="mt-4 grid gap-6 md:grid-cols-2">' + rel.map(function (r, i) { return UI.serviceCard(r, { tone: 'light', index: i + 1 }); }).join('') + '</div>' + (posts.length ? '<h3 class="mt-10 ' + UI.cls.mono + '">Articles</h3><div class="mt-4 grid gap-6 md:grid-cols-2">' + posts.map(function (p) { return UI.postCard(p, { tone: 'light' }); }).join('') + '</div>' : '')));
    return out.join('<div aria-hidden="true" class="h-12"></div>');
  }
  function spy() {
    var links = UI.qsa('[data-spy-link]');
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) links.forEach(function (a) { a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + en.target.id)); }); });
    }, { rootMargin: '-25% 0px -65% 0px' });
    NAV.forEach(function (n) { var el = document.getElementById(n[0]); if (el) io.observe(el); });
  }
  function cta(s) {
    return UI.ctaBand({ title: s ? 'Ready to *start* with ' + s.name.split(' ')[0] + '?' : 'Not sure *where* to begin?', lead: 'Book a first consultation in Gulshan, Bashundhara or online. The appointment desk is open Saturday to Thursday, 9:00 AM to 8:00 PM.', primaryLabel: 'Book Appointment', primaryHref: s ? SITE.url.appointment({ service: s.slug }) : SITE.routes.appointment, secondaryLabel: 'Call ' + SITE.contact.phone.display, secondaryHref: 'tel:' + SITE.contact.phone.e164 });
  }

  UI.ready(function () {
    var slug = UI.getParam('slug') || '', idx = SITE.getService(slug);
    var det = (window.SERVICES || []).filter(function (x) { return x.slug === slug; })[0];
    var hero = document.getElementById('hero-mount'), main = document.getElementById('detail-mount'), explore = document.getElementById('explore-mount'), ctaMount = document.getElementById('cta-mount');

    if (!idx || !det) {
      document.title = 'Service not found | Dr. Rashed Khan \u2013 Psychiatrist';
      hero.innerHTML = UI.pageHero({ index: '04', eyebrow: 'Service details', title: 'That service was *not found*', tone: 'ink', lead: 'The link may be old or mistyped. Choose one of the eight services below.', crumbs: [{ label: 'Home', href: SITE.routes.home }, { label: 'Services', href: SITE.routes.services }, { label: 'Not found' }] });
      main.outerHTML = sec('not-found', 'relative border-b-4 border-ink bg-white py-16 text-ink md:py-28', '<div class="' + UI.cls.container + '"><h2 class="sr-only">All services</h2><p class="max-w-2xl text-lg leading-relaxed">We could not find a service with that name. Every service is listed on the services page, with its price range and a full description.</p><a href="' + SITE.routes.services + '" class="' + UI.cls.btnLime + ' mt-8">' + UI.icon('arrow-left', 'h-5 w-5') + 'Back to all services</a><div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">' + SITE.servicesIndex.map(function (x, i) { return UI.serviceCard(x, { tone: 'light', index: i + 1 }); }).join('') + '</div></div>');
      explore.remove(); ctaMount.outerHTML = cta(null);
      UI.mount(document.getElementById('not-found')); UI.mount(document.getElementById('cta')); return;
    }

    var s = Object.assign({}, idx, det), tone = TONE[s.accent] || 'ultra', dark = tone !== 'lime' && tone !== 'tang';
    var desc = s.tagline + ' ' + s.short + ' Fees from ' + UI.formatBDT(s.priceFrom) + '.';
    document.title = s.name + ' | Dr. Rashed Khan \u2013 Psychiatrist';
    meta('meta[name="description"]', 'content', desc); meta('meta[property="og:title"]', 'content', s.name); meta('meta[property="og:description"]', 'content', desc);

    var words = s.name.split(' '), last = words.pop();
    hero.innerHTML = UI.pageHero({
      index: s.id.replace('svc-', '').slice(-2), eyebrow: (CAT[s.category] || 'Service') + ' \u00B7 ' + s.priceUnit, title: words.join(' ') + ' *' + last + '*', tone: tone, lead: s.tagline + ' ' + s.short,
      crumbs: [{ label: 'Home', href: SITE.routes.home }, { label: 'Services', href: SITE.routes.services }, { label: s.name }],
      actionsHTML: '<div class="flex w-full flex-wrap items-center gap-3"><span class="border-4 border-ink bg-white px-3 py-1.5 font-mono text-sm font-black text-ink">' + UI.formatBDTRange(s.priceFrom, s.priceTo) + '</span>' + UI.badge(CAT[s.category] || 'Service', dark ? 'dark' : 'light') + '</div>' +
        '<a data-magnetic href="' + SITE.url.appointment({ service: s.slug }) + '" class="' + (dark ? UI.cls.btnLime : UI.cls.btnInk) + '">Book Appointment' + UI.icon('arrow-right', 'h-5 w-5') + '</a><a href="tel:' + SITE.contact.phone.e164 + '" class="' + UI.cls.btnWhite + '">' + UI.icon('phone', 'h-5 w-5') + 'Call ' + UI.esc(SITE.contact.phone.local) + '</a>'
    });

    var nav = '<nav aria-label="On this page" class="sticky top-24 z-30 self-start border-4 border-ink bg-white p-2 shadow-hard-sm lg:col-span-2 xl:top-28 xl:col-span-1"><p class="mb-2 hidden ' + UI.cls.mono + ' xl:block">On this page</p><ul class="flex gap-2 overflow-x-auto [scrollbar-width:none] xl:flex-col xl:overflow-visible">' + NAV.map(function (n, i) {
      return '<li class="shrink-0"><a data-spy-link href="#' + n[0] + '" aria-current="' + (i === 0) + '" class="flex min-h-[44px] items-center whitespace-nowrap border-4 border-ink bg-white px-3 font-mono text-xs font-bold uppercase text-ink hover:bg-lime aria-[current=true]:bg-ink aria-[current=true]:text-lime focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra">' + n[1] + '</a></li>';
    }).join('') + '</ul></nav>';
    main.outerHTML = '<section id="detail" data-section="detail" data-component="ServiceDetail" class="relative overflow-x-clip border-b-4 border-ink bg-white py-12 text-ink md:py-20"><div aria-hidden="true" data-parallax="0.25" class="pointer-events-none absolute -right-10 top-40 hidden h-72 w-72 bg-halftone [background-size:14px_14px] opacity-20 md:block"></div><div class="' + UI.cls.container + ' relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[13rem_minmax(0,1fr)_21rem]">' + nav + '<div class="min-w-0">' + body(s) + '</div>' + booking(s) + '</div>' +
      '<div class="fixed bottom-4 left-1/2 z-[60] flex w-44 -translate-x-1/2 border-4 border-ink bg-white shadow-hard-sm lg:hidden"><a href="' + SITE.url.appointment({ service: s.slug }) + '" class="flex min-h-[44px] flex-1 items-center justify-center bg-lime font-mono text-xs font-black uppercase text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra">Book</a><a href="tel:' + SITE.contact.phone.e164 + '" aria-label="Call the appointment desk" class="flex min-h-[44px] flex-1 items-center justify-center border-l-4 border-ink bg-ink font-mono text-xs font-black uppercase text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime">Call</a></div></section>';

    var all = SITE.servicesIndex, i = all.indexOf(idx), prev = all[(i + all.length - 1) % all.length], next = all[(i + 1) % all.length];
    function step(x, dir) {
      return '<a data-reveal="cut" href="' + SITE.url.service(x.slug) + '" class="group flex items-center gap-4 border-4 border-ink bg-white p-5 text-ink shadow-hard-lime ' + PRESS + ' hover:bg-lime focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra' + (dir === 'next' ? ' md:flex-row-reverse md:text-right' : '') + '"><span class="' + UI.cls.iconBox + '">' + UI.icon(dir === 'next' ? 'arrow-right' : 'arrow-left', 'h-6 w-6') + '</span><span><span class="block ' + UI.cls.mono + '">' + (dir === 'next' ? 'Next service' : 'Previous service') + '</span><span class="mt-1 block ' + UI.cls.display + ' text-xl leading-tight md:text-2xl">' + UI.esc(x.name) + '</span></span></a>';
    }
    explore.outerHTML = '<section id="explore" data-section="explore" data-component="ServiceNav" class="relative overflow-x-clip border-b-4 border-ink bg-ink py-16 text-white md:py-24"><div aria-hidden="true" data-scroll-x="0.5" class="pointer-events-none absolute left-0 top-4 whitespace-nowrap font-display text-[16vw] font-black uppercase leading-none text-transparent [-webkit-text-stroke:3px_#FFFFFF] opacity-10">' + UI.esc(s.name) + ' \u2014 ' + UI.esc(s.name) + '</div><div class="' + UI.cls.container + ' relative"><h2 class="sr-only">More services and emergency help</h2><div class="grid gap-6 md:grid-cols-2">' + step(prev, 'prev') + step(next, 'next') + '</div>' +
      '<div data-reveal="stamp" class="mt-10 flex flex-col gap-4 border-4 border-ink bg-alert p-6 text-white shadow-hard-lime sm:flex-row sm:items-center"><span class="flex h-12 w-12 shrink-0 items-center justify-center border-4 border-ink bg-white text-alert">' + UI.icon('alert-circle', 'h-6 w-6') + '</span><p class="text-lg font-medium leading-relaxed">If you or someone near you is in immediate danger, call <a href="tel:999" class="font-black underline underline-offset-4">999</a> or go to the nearest hospital emergency department. Appointments are not for emergencies.</p></div></div></section>' + UI.tape([s.name, 'Talk first', 'Treat proportionately', 'Review regularly'], { tone: 'lime', rotate: '-rotate-1' });
    ctaMount.outerHTML = cta(s);
    UI.mount(document.getElementById('detail')); UI.mount(document.getElementById('explore')); UI.mount(document.getElementById('cta'));
    spy();
  });
})();
