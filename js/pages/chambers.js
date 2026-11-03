/*
 * js/pages/chambers.js — Chambers page script
 * Path: js/pages/chambers.js · Owner: Part 4 · Purpose: renders overview, weekly matrix, chamber details, comparison and CTA
 * Depends on: SITE, UI, FX (kit), window.CHAMBERS (js/data/chambers.js) · Exposes: nothing
 */
(function () {
  'use strict';
  UI.ready(function () {
    var DETAILS = window.CHAMBERS || [];
    var chambers = SITE.chambersIndex.map(function (ci) {
      var d = DETAILS.filter(function (x) { return x.slug === ci.slug; })[0] || {};
      return Object.assign({}, ci, d);
    });
    var bySlug = {}; chambers.forEach(function (c) { bySlug[c.slug] = c; });
    var ORDER = [6, 0, 1, 2, 3, 4, 5], DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    var MONO = UI.cls.mono;

    function toMin(hm) { var p = hm.split(':'); return Number(p[0]) * 60 + Number(p[1]); }
    function fmt(hm) { var p = hm.split(':').map(Number); return UI.formatTime(new Date(2026, 0, 1, p[0], p[1])); }

    /* live status: "Open now · until 9:00 PM" or "Next: Today 5:00 PM" */
    function statusFor(c) {
      var now = new Date(), mins = now.getHours() * 60 + now.getMinutes(), open = null;
      c.schedule.forEach(function (s) { if (s.days.indexOf(now.getDay()) > -1 && mins >= toMin(s.start) && mins < toMin(s.end)) open = s; });
      if (open) return { open: true, text: 'Open now · until ' + fmt(open.end) };
      var n = SITE.nextOpening(c.slug);
      if (!n) return { open: false, text: 'Closed this week' };
      var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1), s = n.startAt;
      var when = n.isToday ? 'Today' : (s.getDate() === tomorrow.getDate() && s.getMonth() === tomorrow.getMonth() ? 'Tomorrow' : s.toLocaleDateString('en-GB', { weekday: 'short' }));
      return { open: false, text: 'Next: ' + when + ' ' + UI.formatTime(s) };
    }
    function refreshStatus() {
      UI.qsa('[data-open-status]').forEach(function (el) {
        var c = bySlug[el.getAttribute('data-open-status')]; if (!c) return;
        var st = statusFor(c), t = el.querySelector('[data-status-text]'), dot = el.querySelector('[data-status-dot]');
        if (t) t.textContent = st.text;
        if (dot) { dot.classList.toggle('bg-lime', st.open); dot.classList.toggle('bg-tang', !st.open); }
      });
    }

    document.getElementById('hero-mount').innerHTML = UI.pageHero({
      index: '04', eyebrow: 'Chambers and online', title: 'Three ways to *sit down* with the doctor', tone: 'ink',
      lead: 'Two in-person chambers in Gulshan and Bashundhara, and a secure video clinic for everyone else. Same doctor, same care, same quiet room, wherever you choose.',
      crumbs: [{ label: 'Home', href: SITE.routes.home }, { label: 'Chambers' }],
      actionsHTML: '<a data-magnetic href="' + SITE.routes.appointment + '" class="' + UI.cls.btnLime + '">Book Appointment' + UI.icon('arrow-right', 'h-5 w-5') + '</a><a href="#matrix" class="' + UI.cls.btnOutline + '">See the weekly timetable' + UI.icon('arrow-down', 'h-5 w-5') + '</a>'
    });

    /* 01 overview */
    var cards = chambers.map(function (c, i) {
      var st = statusFor(c);
      return '<div data-reveal="stamp" data-delay="' + (i * 120) + '" class="flex flex-col [&>article]:flex-1"><p data-open-status="' + UI.esc(c.slug) + '" class="mb-4 inline-flex w-fit items-center gap-3 border-4 border-ink bg-ink px-3 py-2 ' + MONO + ' text-white"><span data-status-dot aria-hidden="true" class="h-3 w-3 ' + (st.open ? 'bg-lime' : 'bg-tang') + ' motion-safe:animate-blink"></span><span data-status-text>' + UI.esc(st.text) + '</span></p>' + UI.chamberCard(c, { tone: 'light' }) + '</div>';
    }).join('');
    document.getElementById('overview-mount').outerHTML = '<section id="overview" data-section="overview" class="' + UI.cls.secWhite + ' overflow-x-clip"><div aria-hidden="true" data-parallax="0.2" data-parallax-rotate="30" class="pointer-events-none absolute -right-10 top-10 hidden w-48 md:block">' + UI.deco(SITE.img.objects.cross, 'w-full') + '</div><div class="' + UI.cls.container + ' relative">' +
      UI.sectionHead({ index: '01', eyebrow: 'Choose a chamber', title: 'Where would you *like to be seen*?', tone: 'light', lead: 'Pick the place that is easiest to reach. The label above each card shows whether the chamber is open right now and, if not, when it opens next.' }) +
      '<div class="mt-12 grid gap-8 lg:grid-cols-3">' + cards + '</div>' +
      '<p data-reveal="cut" class="mt-12 flex max-w-3xl items-start gap-4 border-4 border-ink bg-lime p-5 font-medium">' + UI.icon('alert-circle', 'mt-0.5 h-6 w-6 shrink-0') + '<span>Appointments are not for emergencies. If you or someone near you is in immediate danger, call ' + UI.esc(SITE.contact.nationalEmergency) + ' or go to the nearest hospital emergency department.</span></p></div></section>';

    /* 02 weekly matrix */
    var today = new Date().getDay();
    function cell(c, d) {
      var s = c.schedule.filter(function (x) { return x.days.indexOf(d) > -1; })[0], hi = d === today ? ' bg-lime' : ' bg-white';
      return '<td class="border-4 border-ink p-3 align-top' + hi + '">' + (s ? '<span class="block font-bold leading-snug">' + UI.esc(s.hours) + '</span>' : '<span class="block ' + MONO + '">Closed</span>') + '</td>';
    }
    var head = '<th scope="col" class="border-4 border-ink bg-ink p-3 text-white ' + MONO + '">Chamber</th>' + ORDER.map(function (d, i) {
      return '<th scope="col"' + (d === today ? ' aria-current="date"' : '') + ' class="border-4 border-ink p-3 ' + MONO + (d === today ? ' bg-lime text-ink' : ' bg-ink text-white') + '">' + DAYS[i] + (d === today ? '<span class="block text-[11px]">Today</span>' : '') + '</th>';
    }).join('');
    var rows = chambers.map(function (c) {
      return '<tr><th scope="row" class="border-4 border-ink bg-white p-3 text-left font-display text-base font-black uppercase">' + UI.esc(c.chamberName) + '<span class="mt-1 block ' + MONO + '">' + (c.mode === 'online' ? 'Video' : 'In person') + '</span></th>' + ORDER.map(function (d) { return cell(c, d); }).join('') + '</tr>';
    }).join('');
    document.getElementById('matrix-mount').outerHTML = '<section id="matrix" data-section="matrix" class="' + UI.cls.secConcrete + ' overflow-x-clip"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ index: '02', eyebrow: 'The week at a glance', title: 'Saturday to *Friday*, one table', tone: 'light', lead: 'Today is highlighted. Friday is a day off, apart from the online session in the morning. All visits are booked in 30-minute slots.' }) +
      '<div data-reveal="wipe" class="mt-12"><div role="region" tabindex="0" aria-label="Weekly timetable, scroll sideways on small screens" class="overflow-x-auto border-4 border-ink bg-white shadow-hard"><table class="w-full min-w-[56rem] border-collapse text-left text-sm"><caption class="sr-only">Opening hours of each chamber from Saturday to Friday</caption><thead><tr>' + head + '</tr></thead><tbody>' + rows + '</tbody></table></div></div></div></section>' + UI.tape(['Gulshan', 'Bashundhara', 'Online', 'Sat \u2013 Thu'], { tone: 'lime', rotate: '-rotate-1' });

    /* 03-05 chamber details */
    var TONES = ['secInk', 'secLime', 'secInk'], SX = ['data-scroll-x="0.35"', 'data-scroll-x="-0.35"'];
    function tab(c, key, label) { return '<button type="button" role="tab" id="tab-' + c.slug + '-' + key + '" aria-controls="panel-' + c.slug + '-' + key + '" aria-selected="false" data-tab="' + key + '" class="' + UI.cls.tab + '">' + UI.esc(label) + '</button>'; }
    function panel(c, key, html) { return '<div role="tabpanel" id="panel-' + c.slug + '-' + key + '" aria-labelledby="tab-' + c.slug + '-' + key + '" data-tab-panel="' + key + '" class="hidden border-4 border-ink bg-white p-5 text-ink shadow-hard-sm">' + html + '</div>'; }
    function list(items) { return '<ul class="space-y-3">' + items.map(function (x) { return '<li class="flex gap-3">' + UI.icon('check', 'mt-1 h-5 w-5 shrink-0') + '<span>' + UI.esc(x) + '</span></li>'; }).join('') + '</ul>'; }
    function fact(label, html) { return '<div class="flex gap-4 p-4"><dt class="w-24 shrink-0 ' + MONO + '">' + label + '</dt><dd class="min-w-0 font-medium">' + html + '</dd></div>'; }

    function detail(c, i) {
      var dark = i !== 1, tone = dark ? 'dark' : 'light', online = c.mode === 'online', h = c.howToReach || {};
      var b1 = dark ? UI.cls.btnLime : UI.cls.btnInk, b2 = UI.cls.btnWhite + (dark ? '' : ' !shadow-hard'), b3 = UI.cls.btnOutline;
      var tabs, panels;
      if (online) {
        tabs = tab(c, 'how', 'How it works') + tab(c, 'need', 'What you need') + tab(c, 'privacy', 'Privacy');
        panels = panel(c, 'how', '<ol class="space-y-4">' + (c.howItWorks || []).map(function (s, n) { return '<li class="flex gap-4"><span class="flex h-10 w-10 shrink-0 items-center justify-center border-4 border-ink bg-lime font-mono text-sm font-black">' + UI.pad(n + 1) + '</span><span><b class="block font-display uppercase">' + UI.esc(s.title) + '</b>' + UI.esc(s.description) + '</span></li>'; }).join('') + '</ol>') + panel(c, 'need', list(c.techNeeds || [])) + panel(c, 'privacy', list(c.privacyNotes || []));
      } else {
        tabs = tab(c, 'road', 'Road') + tab(c, 'rideshare', 'Rideshare') + tab(c, 'bus', 'Bus') + tab(c, 'parking', 'Parking');
        panels = panel(c, 'road', '<p>' + UI.esc(h.byRoad) + '</p>') + panel(c, 'rideshare', '<p>' + UI.esc(h.byRideshare) + '</p>') + panel(c, 'bus', '<p>' + UI.esc(h.byBus) + '</p>') + panel(c, 'parking', '<p>' + UI.esc(h.parking) + '</p>');
      }
      var sched = c.schedule.map(function (s) { return '<span class="block">' + UI.esc(s.label) + ' · ' + UI.esc(s.hours) + '</span>'; }).join('');
      var facts = (online ? fact('Format', UI.esc(c.address)) : fact('Address', UI.esc(c.address) + (c.landmark ? '<span class="mt-1 block text-sm font-normal">' + UI.esc(c.landmark) + '</span>' : ''))) + fact('Hours', sched) + fact('Phone', '<a class="underline underline-offset-4" href="tel:' + UI.esc(c.phone.e164) + '">' + UI.esc(c.phone.display) + '</a>') + fact('Fees', 'First visit ' + UI.formatBDT(c.fee.firstVisit) + '<span class="block">Follow-up ' + UI.formatBDT(c.fee.followUp) + '</span>') + fact('Slot', UI.esc(c.slotMinutes) + ' minutes');
      var buttons = '<a data-magnetic href="' + SITE.url.appointment({ chamber: c.slug }) + '" class="' + b1 + '">Book here' + UI.icon('arrow-right', 'h-5 w-5') + '</a>' +
        (!online && c.lat != null ? '<a href="https://www.google.com/maps/dir/?api=1&destination=' + c.lat + ',' + c.lng + '" target="_blank" rel="noopener noreferrer" class="' + b2 + '">' + UI.icon('navigation', 'h-5 w-5') + 'Get directions</a>' : '') +
        '<a href="tel:' + UI.esc(c.phone.e164) + '" class="' + b3 + '">' + UI.icon('phone', 'h-5 w-5') + 'Call</a><a href="' + SITE.contact.whatsappUrl + '" target="_blank" rel="noopener noreferrer" class="' + b3 + '">' + UI.icon('message-circle', 'h-5 w-5') + 'WhatsApp</a>';
      var fac = (c.facilities || []).map(function (f) { return '<li class="flex gap-4 border-4 border-ink bg-white p-4 text-ink shadow-hard-sm"><span class="' + UI.cls.iconBox + '">' + UI.icon(f.icon, 'h-6 w-6') + '</span><div><h4 class="font-display text-lg font-black uppercase leading-tight">' + UI.esc(f.title) + '</h4><p class="mt-1 text-sm leading-relaxed">' + UI.esc(f.description) + '</p></div></li>'; }).join('');
      var map = online ? '' : '<h3 class="' + UI.cls.h3 + ' mb-4">Find us on the map</h3><iframe title="Map showing the ' + UI.esc(c.chamberName) + ' at ' + UI.esc(c.address) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=' + encodeURIComponent(c.mapQuery || c.address) + '&output=embed" class="h-72 w-full border-4 border-ink bg-white md:h-96"></iframe>';
      var tips = '<div class="' + (online ? '' : 'mt-8 ') + 'border-4 border-ink ' + (dark ? 'bg-lime' : 'bg-white') + ' p-5 text-ink shadow-hard-sm"><h3 class="' + UI.cls.h3 + '">Before you ' + (online ? 'join' : 'come') + '</h3><div class="mt-4">' + list(c.patientTips || []) + '</div></div>';
      return '<section id="' + c.slug + '" data-section="' + c.slug + '" data-component="ChamberDetail" class="' + UI.cls[TONES[i]] + ' scroll-mt-24 overflow-x-clip">' +
        '<div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-4 overflow-x-clip select-none"><p ' + SX[i % 2] + ' class="whitespace-nowrap font-display text-[24vw] font-black uppercase leading-none ' + UI.cls.outline + ' opacity-25">' + UI.esc(c.slug) + ' ' + UI.esc(c.slug) + ' ' + UI.esc(c.slug) + '</p></div>' +
        '<div class="' + UI.cls.container + ' relative">' + UI.sectionHead({ index: UI.pad(i + 3), eyebrow: online ? 'Online · anywhere' : c.area + ' · ' + c.city, title: c.chamberName.replace(/ (Chamber|Consultation)$/, ' *$1*'), tone: tone }) +
        '<div class="mt-12 grid gap-10 lg:grid-cols-12"><div data-reveal="left" class="lg:col-span-5"><div class="relative"><div data-parallax-img class="relative aspect-[4/3] overflow-hidden border-4 border-ink bg-concrete ' + (dark ? 'shadow-hard-lime' : 'shadow-hard') + '">' + UI.img(c.image, c.name + (online ? ' video consultation' : ' building'), 'absolute inset-0 h-[125%] w-full object-cover', { w: 800, h: 600 }) + '</div><div aria-hidden="true" class="absolute -top-4 right-4">' + UI.sticker(online ? 'Video visit' : 'In person', { bg: online ? 'bg-tang' : 'bg-lime', rotate: 'rotate-3' }) + '</div></div>' +
        '<dl class="mt-8 divide-y-4 divide-ink border-4 border-ink bg-white text-ink ' + (dark ? 'shadow-hard-lime' : 'shadow-hard') + '">' + facts + '</dl></div>' +
        '<div data-reveal="right" class="lg:col-span-7"><div class="max-w-2xl space-y-5 text-lg leading-relaxed">' + (c.about || []).map(function (p) { return '<p>' + UI.esc(p) + '</p>'; }).join('') + '</div><p data-open-status="' + c.slug + '" class="mt-6 inline-flex items-center gap-3 border-4 border-ink bg-white px-3 py-2 ' + MONO + ' text-ink"><span data-status-dot aria-hidden="true" class="h-3 w-3 bg-tang motion-safe:animate-blink"></span><span data-status-text>' + UI.esc(statusFor(c).text) + '</span></p><div class="mt-8 flex flex-wrap gap-4">' + buttons + '</div></div></div>' +
        '<h3 class="' + UI.cls.h3 + ' mt-16 mb-6">Facilities</h3><ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">' + fac + '</ul>' +
        '<div class="mt-16 grid gap-10 lg:grid-cols-2"><div data-tabs><h3 class="' + UI.cls.h3 + ' mb-4">' + (online ? 'How online visits work' : 'How to reach us') + '</h3><div role="tablist" aria-label="' + (online ? 'Online consultation details' : 'Ways to reach the ' + UI.esc(c.chamberName)) + '" class="mb-4 flex flex-wrap gap-2">' + tabs + '</div>' + panels + '</div><div>' + map + tips + '</div></div></div></section>';
    }
    document.getElementById('details-mount').outerHTML = chambers.map(detail).join('');

    /* 06 comparison */
    var rowsDef = [
      ['Format', function (c) { return c.mode === 'online' ? 'Secure video call' : 'In person, private room'; }],
      ['Where', function (c) { return c.mode === 'online' ? 'Anywhere in Bangladesh or abroad' : c.area + ', ' + c.city; }],
      ['Days', function (c) { return c.schedule.map(function (s) { return s.label; }).join(' and '); }],
      ['Hours', function (c) { return c.schedule.map(function (s) { return s.hours; }).join(' / '); }],
      ['First visit', function (c) { return UI.formatBDT(c.fee.firstVisit); }],
      ['Follow-up', function (c) { return UI.formatBDT(c.fee.followUp); }],
      ['Slot length', function (c) { return c.slotMinutes + ' minutes'; }],
      ['Best for', function (c) { return c.bestFor || ''; }]
    ];
    var cmpHead = '<th scope="col" class="border-4 border-ink bg-ink p-3 text-white ' + MONO + '">Compare</th>' + chambers.map(function (c) { return '<th scope="col" class="border-4 border-ink bg-ink p-3 font-display text-lg font-black uppercase text-lime">' + UI.esc(c.chamberName) + '</th>'; }).join('');
    var cmpRows = rowsDef.map(function (r) { return '<tr><th scope="row" class="border-4 border-ink bg-lime p-3 text-left ' + MONO + '">' + r[0] + '</th>' + chambers.map(function (c) { return '<td class="border-4 border-ink bg-white p-3 font-medium">' + UI.esc(r[1](c)) + '</td>'; }).join('') + '</tr>'; }).join('') +
      '<tr><th scope="row" class="border-4 border-ink bg-lime p-3 text-left ' + MONO + '">Book</th>' + chambers.map(function (c) { return '<td class="border-4 border-ink bg-white p-3"><a href="' + SITE.url.appointment({ chamber: c.slug }) + '" class="inline-flex items-center gap-2 font-mono text-xs font-black uppercase underline underline-offset-4">Book ' + UI.esc(c.area === 'Anywhere' ? 'online' : c.area) + UI.icon('arrow-right', 'h-4 w-4') + '</a></td>'; }).join('') + '</tr>';
    document.getElementById('compare-mount').outerHTML = '<section id="compare" data-section="compare" class="' + UI.cls.secWhite + ' overflow-x-clip"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ index: '06', eyebrow: 'Side by side', title: 'Which chamber *suits you*?', tone: 'light', lead: 'The doctor, the standard of care and the 30-minute visit are the same everywhere. Only the place, the days and the fee differ.' }) +
      '<div data-reveal="wipe" class="mt-12"><div role="region" tabindex="0" aria-label="Chamber comparison, scroll sideways on small screens" class="overflow-x-auto border-4 border-ink shadow-hard"><table class="w-full min-w-[48rem] border-collapse text-left text-sm"><caption class="sr-only">Comparison of the three chambers</caption><thead><tr>' + cmpHead + '</tr></thead><tbody>' + cmpRows + '</tbody></table></div></div></div></section>';

    /* 07 checklist counter */
    var boxes = UI.qsa('[data-bring]'), out = document.getElementById('bring-count');
    function count() { var n = boxes.filter(function (b) { return b.checked; }).length; if (out) out.textContent = n + ' of ' + boxes.length + ' ticked'; }
    boxes.forEach(function (b) { b.addEventListener('change', count); }); count();

    /* 09 CTA */
    document.getElementById('cta-mount').outerHTML = UI.ctaBand({ title: 'Choose a chamber, then *choose a time*', lead: 'Booking takes about three minutes. Evening slots, Saturday sessions and online visits are open for the next sixty days.' });

    UI.mount(document.getElementById('main'));
    refreshStatus(); setInterval(refreshStatus, 60000);

    /* hash: scroll to the chamber and flash a ring for 2 seconds */
    function flash() {
      var id = decodeURIComponent((window.location.hash || '').replace('#', '')), el = bySlug[id] ? document.getElementById(id) : null;
      if (!el) return;
      el.scrollIntoView(); el.classList.add('ring-4', 'ring-inset', 'ring-ultra');
      setTimeout(function () { el.classList.remove('ring-4', 'ring-inset', 'ring-ultra'); }, 2000);
    }
    window.addEventListener('hashchange', flash); flash();
  });
})();
