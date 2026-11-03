/*
 * js/pages/home.js — Home page renderer
 * Path: js/pages/home.js · Owner: Part 1 · Purpose: renders hero details and sections 2-4, 7-13 of the home page; quick-booking redirect
 * Depends on: SITE, UI, FX (shared kit) · Exposes: nothing
 */
(function () {
  'use strict';
  UI.ready(function () {
    var cls = UI.cls, d = SITE.doctor, c = SITE.contact;
    var HL_DARK = ' [&_em]:bg-lime [&_em]:text-ink';

    function box(inner) { return '<div class="' + cls.container + '">' + inner + '</div>'; }
    function section(id, comp, klass, inner) {
      return '<section id="' + id + '" data-section="' + id + '" data-component="' + comp + '" class="' + klass + '">' + inner + '</section>';
    }
    function place(id, html) {
      var m = document.getElementById(id + '-mount');
      if (!m) return null;
      m.outerHTML = html;
      var el = document.getElementById(id);
      UI.mount(el);
      return el;
    }
    function isoToday() { var n = new Date(); return n.getFullYear() + '-' + UI.pad(n.getMonth() + 1) + '-' + UI.pad(n.getDate()); }

    /* ---------- 1. hero details (section is static in index.html) ---------- */
    var heroMount = document.getElementById('hero-mount');
    if (heroMount) heroMount.remove();
    var trust = document.getElementById('hero-trust');
    if (trust) {
      trust.innerHTML = ['BMDC ' + d.bmdcNo, 'FCPS Psychiatry', d.experienceYears + '+ years in practice', d.satisfactionPercent + '% patient satisfaction'].map(function (t) {
        return '<li class="border-2 border-ink bg-white px-3 py-1.5 font-mono text-xs font-bold uppercase text-ink">' + UI.esc(t) + '</li>';
      }).join('');
    }
    var actions = document.getElementById('hero-actions');
    if (actions) {
      actions.innerHTML = '<a data-magnetic href="' + SITE.routes.appointment + '" class="' + cls.btnLime + '">Book Appointment' + UI.icon('arrow-right', 'h-5 w-5') + '</a>' +
        '<a href="tel:' + c.phone.e164 + '" class="' + cls.btnWhite + '">' + UI.icon('phone', 'h-5 w-5') + UI.esc(c.phone.display) + '</a>';
    }

    /* ---------- 2. ticker + stats ---------- */
    place('ticker-stats', section('ticker-stats', 'StatsSection', cls.secInk + ' !pt-0 overflow-x-clip',
      UI.tape(['Listen first', 'Explain clearly', 'Treat fairly', 'Follow up'], { tone: 'lime', rotate: '-rotate-1' }) +
      '<div class="mt-16 md:mt-24">' + box(
        UI.sectionHead({ index: '02', eyebrow: 'In numbers', title: 'Fourteen years of *steady* work', tone: 'dark' }) +
        '<div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">' +
        UI.statBlock({ value: d.experienceYears, suffix: '+', label: 'Years in practice', tone: 'dark' }) +
        UI.statBlock({ value: d.patientsTreated, suffix: '+', label: 'Patients treated', tone: 'dark', delay: 100 }) +
        UI.statBlock({ value: d.sessionsDelivered, suffix: '+', label: 'Therapy sessions', tone: 'dark', delay: 200 }) +
        UI.statBlock({ value: d.satisfactionPercent, suffix: '%', label: 'Patient satisfaction', tone: 'dark', delay: 300 }) +
        '</div>') + '</div>'));

    /* ---------- 3. about ---------- */
    var creds = d.degrees.map(function (g) {
      return '<li class="flex items-start gap-3 border-b-4 border-ink py-3"><span class="' + cls.iconBox + ' !h-8 !w-8 !border-2">' + UI.icon('check', 'h-4 w-4') + '</span><span class="font-medium">' + UI.esc(g) + '</span></li>';
    }).join('');
    place('about', section('about', 'AboutSection', cls.secConcrete + ' overflow-x-clip', box(
      '<div class="grid items-center gap-16 lg:grid-cols-12">' +
      '<div class="relative lg:col-span-5"><div aria-hidden="true" data-parallax="0.2" class="absolute -bottom-8 -right-6 h-2/3 w-2/3 border-4 border-ink bg-lilac bg-halftone [background-size:14px_14px]"></div>' +
      '<div data-parallax-img class="relative z-10 aspect-[4/5] overflow-hidden border-4 border-ink bg-lime shadow-hard">' + UI.img(d.image, 'Illustrated portrait of ' + d.name + ' in a white coat', 'absolute inset-0 h-[125%] w-full object-cover', { w: 600, h: 750 }) + '</div></div>' +
      '<div class="lg:col-span-7">' + UI.sectionHead({ index: '03', eyebrow: 'The doctor', title: 'Medicine that *listens* first', tone: 'light' }) +
      '<div class="mt-8 space-y-5 text-lg leading-relaxed"><p>' + UI.esc(d.name) + ' is a consultant psychiatrist and associate professor in the Department of Psychiatry. He treats mood, anxiety, sleep problems and addiction in adults, teenagers and children.</p>' +
      '<p>His method is plain. A long first conversation, a clear explanation of what is happening, and a plan you understand and agree with. Medicine is used when it helps, never without explanation.</p></div>' +
      '<ul class="mt-8 border-t-4 border-ink">' + creds + '</ul>' +
      '<p class="mt-4 font-mono text-xs font-bold uppercase">BMDC registration no. ' + UI.esc(d.bmdcNo) + '</p>' +
      '<div class="mt-8 flex flex-wrap gap-4"><a href="' + SITE.routes.about + '" class="' + cls.btnInk + '">About the doctor' + UI.icon('arrow-right', 'h-5 w-5') + '</a><a href="' + SITE.routes.appointment + '" class="' + cls.btnLime + '">Book Appointment</a></div></div></div>')));

    /* ---------- 4. services with filter chips ---------- */
    var FILTERS = [['all', 'All'], ['adult', 'Adult'], ['child-teen', 'Child & teen'], ['therapy', 'Therapy'], ['recovery', 'Recovery']];
    var chips = FILTERS.map(function (f, i) {
      return '<button type="button" class="' + cls.chip + '" aria-pressed="' + (i === 0) + '" data-filter="' + f[0] + '">' + UI.esc(f[1]) + '</button>';
    }).join('');
    var svcEl = place('services', section('services', 'ServicesSection', cls.secInk, box(
      UI.sectionHead({ index: '04', eyebrow: 'Services', title: 'Eight kinds of *care*, one clinic', lead: 'Pick a category to narrow the list. Every service page shows what to expect and what it costs.', tone: 'dark' }) +
      '<div role="group" aria-label="Filter services by category" data-filter-bar class="mt-10 flex flex-wrap gap-3">' + chips + '</div>' +
      '<p id="svc-count" role="status" aria-live="polite" class="mt-6 ' + cls.mono + '"></p>' +
      '<div id="svc-grid" class="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"></div>' +
      '<div class="mt-12"><a href="' + SITE.routes.services + '" class="' + cls.btnLime + '">All services' + UI.icon('arrow-right', 'h-5 w-5') + '</a></div>')));
    function renderServices(cat) {
      var list = SITE.servicesIndex.filter(function (s) { return cat === 'all' || s.category === cat; });
      var grid = document.getElementById('svc-grid');
      grid.innerHTML = list.length ? list.map(function (s, i) { return UI.serviceCard(s, { tone: 'dark', index: i + 1 }); }).join('') :
        '<p class="border-4 border-white p-6 sm:col-span-2 lg:col-span-4">No services in this category yet. Choose another filter.</p>';
      document.getElementById('svc-count').textContent = 'Showing ' + list.length + ' of ' + SITE.servicesIndex.length + ' services';
      UI.mount(grid);
    }
    renderServices('all');
    if (svcEl) {
      svcEl.querySelector('[data-filter-bar]').addEventListener('click', function (e) {
        var b = e.target.closest('[data-filter]');
        if (!b) return;
        UI.qsa('[data-filter]', svcEl).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        renderServices(b.getAttribute('data-filter'));
      });
    }

    /* ---------- 7. chambers with live opening label ---------- */
    function openInfo(slug) {
      var nx = SITE.nextOpening(slug), now = new Date();
      if (!nx) return { live: false, text: 'See the schedule' };
      if (nx.startAt <= now) return { live: true, text: 'Open now \u00B7 until ' + UI.formatTime(nx.endAt) };
      if (nx.isToday) return { live: true, text: 'Open today \u00B7 from ' + UI.formatTime(nx.startAt) };
      return { live: false, text: 'Next: ' + nx.startAt.toLocaleDateString('en-GB', { weekday: 'short' }) + ' ' + UI.formatTime(nx.startAt) };
    }
    function labelHTML(slug) {
      var o = openInfo(slug);
      return '<span aria-hidden="true" class="inline-block h-3 w-3 shrink-0 bg-ink ' + (o.live ? 'motion-safe:animate-blink' : 'opacity-40') + '"></span><span>' + UI.esc(o.text) + '</span>';
    }
    var chCards = SITE.chambersIndex.map(function (ch) {
      return '<div class="flex h-full flex-col"><p data-open-label="' + UI.esc(ch.slug) + '" class="flex items-center gap-3 border-4 border-b-0 border-ink bg-lime px-4 py-2 ' + cls.mono + '">' + labelHTML(ch.slug) + '</p><div class="flex-1">' + UI.chamberCard(ch, { tone: 'light' }) + '</div></div>';
    }).join('');
    place('chambers', section('chambers', 'ChambersSection', cls.secWhite, box(
      UI.sectionHead({ index: '07', eyebrow: 'Chambers', title: 'Three ways to *meet* the doctor', lead: 'Two chambers in Dhaka and a secure video clinic. Saturday to Thursday, with a Friday-morning online session.', tone: 'light' }) +
      '<div class="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">' + chCards + '</div>' +
      '<p class="mt-10 max-w-3xl border-l-8 border-ink pl-4 font-medium">Appointments are not for emergencies. In an emergency call ' + UI.esc(c.nationalEmergency) + ' or go to the nearest hospital emergency department.</p>')));
    setInterval(function () {
      UI.qsa('[data-open-label]').forEach(function (el) { el.innerHTML = labelHTML(el.getAttribute('data-open-label')); });
    }, 60000);

    /* ---------- 8. quick booking ---------- */
    var TYPES = [{ value: 'new', label: 'First consultation' }, { value: 'follow-up', label: 'Follow-up visit' }, { value: 'second-opinion', label: 'Second opinion' }, { value: 'post-op', label: 'After a hospital stay' }];
    var bookEl = place('book', section('book', 'QuickBookSection', cls.secUltra + ' overflow-x-clip',
      '<div aria-hidden="true" data-scroll-x="-0.4" class="pointer-events-none absolute left-0 top-6 whitespace-nowrap font-display text-[16vw] font-black uppercase leading-none text-transparent [-webkit-text-stroke:3px_#FFFFFF] opacity-20">Book — Book — Book — Book</div>' +
      box('<div class="relative grid items-start gap-12 lg:grid-cols-12"><div class="lg:col-span-5">' +
        UI.sectionHead({ index: '08', eyebrow: 'Quick booking', title: 'Pick a day, *start* the visit', lead: 'Choose a chamber, a service and a date. You confirm your details on the next page, and nothing is booked until then.', tone: 'dark' }) +
        '<ul class="mt-8 space-y-3 font-mono text-sm font-bold uppercase"><li>Appointment desk Saturday to Thursday</li><li>9:00 AM \u2013 8:00 PM</li></ul></div>' +
        '<form id="quick-book" novalidate data-component="QuickBookForm" class="space-y-5 border-4 border-ink bg-white p-6 text-ink shadow-hard-lime md:p-8 lg:col-span-7">' +
        '<div class="grid gap-5 sm:grid-cols-2">' +
        UI.field({ label: 'Chamber', name: 'chamber', type: 'select', required: true, options: SITE.chambersIndex.map(function (ch) { return { value: ch.slug, label: ch.chamberName + (ch.mode === 'online' ? ' (video)' : ' \u00B7 ' + ch.area) }; }) }) +
        UI.field({ label: 'Service', name: 'service', type: 'select', required: true, options: SITE.servicesIndex.map(function (s) { return { value: s.slug, label: s.name }; }) }) +
        UI.field({ label: 'Preferred date', name: 'date', type: 'date', required: true, min: isoToday() }) +
        UI.field({ label: 'Visit type', name: 'type', type: 'select', required: true, options: TYPES }) +
        '</div><button type="submit" class="' + cls.btnInk + ' w-full sm:w-auto">Continue to booking' + UI.icon('arrow-right', 'h-5 w-5') + '</button></form></div>')));
    var form = document.getElementById('quick-book');
    function showDateError(msg) {
      var el = form.elements.date, m = form.querySelector('[data-error-for="date"]');
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      m.textContent = msg; m.classList.toggle('hidden', !msg);
      if (msg) el.focus();
    }
    function dateProblem(ch, iso) {
      var day = new Date(iso + 'T00:00:00');
      if (isNaN(day.getTime())) return 'Enter a valid date.';
      if (iso < isoToday()) return 'Choose today or a later date.';
      var open = ch.schedule.some(function (s) { return s.days.indexOf(day.getDay()) !== -1; });
      if (open) return '';
      return ch.chamberName + ' is open on ' + ch.schedule.map(function (s) { return s.label + ' (' + s.hours + ')'; }).join(' and ') + '. Please choose one of those days.';
    }
    if (form) {
      form.addEventListener('change', function () { showDateError(''); });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = UI.validateForm(form), f = form.elements, ch = SITE.getChamber(f.chamber.value);
        if (ok && ch) { var p = dateProblem(ch, f.date.value); if (p) { showDateError(p); ok = false; } }
        if (!ok) return;
        window.location.href = SITE.url.appointment({ service: f.service.value, chamber: f.chamber.value, date: f.date.value, type: f.type.value });
      });
    }

    /* ---------- 9. testimonials carousel ---------- */
    var slides = SITE.testimonialsIndex.map(function (t) { return '<div data-carousel-slide class="w-[85%] shrink-0 snap-start md:w-[45%] lg:w-[31%]">' + UI.testimonialCard(t, { tone: 'light' }) + '</div>'; }).join('');
    place('testimonials', section('testimonials', 'TestimonialsSection', cls.secConcrete, box(
      UI.sectionHead({ index: '09', eyebrow: 'Patients say', title: 'In their *own* words', tone: 'light' }) +
      '<div data-carousel data-autoplay="6500" class="mt-10"><div data-carousel-track tabindex="0" aria-label="Patient testimonials" class="flex snap-x snap-mandatory gap-6 overflow-x-auto px-2 pb-10 pt-8 [scrollbar-width:none]">' + slides + '</div>' +
      '<div class="flex items-center justify-between gap-6"><div data-carousel-dots class="flex gap-2"></div><div class="flex gap-3"><button type="button" data-carousel-prev aria-label="Previous testimonial" class="' + cls.arrowBtn + '">' + UI.icon('arrow-left', 'h-6 w-6') + '</button><button type="button" data-carousel-next aria-label="Next testimonial" class="' + cls.arrowBtn + '">' + UI.icon('arrow-right', 'h-6 w-6') + '</button></div></div></div>' +
      '<p class="mt-8 max-w-3xl font-mono text-xs font-bold uppercase">Names are shortened to initials to protect privacy. Every story is shared with consent. Results differ from person to person.</p>')));

    /* ---------- 10. latest blog posts ---------- */
    var latest = SITE.blogIndex.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 3);
    place('blog', section('blog', 'BlogSection', cls.secInk, box(
      UI.sectionHead({ index: '10', eyebrow: 'Reading', title: 'Clear answers, *no* jargon', lead: 'Short guides written by the doctor on the questions patients ask most.', tone: 'dark' }) +
      '<div class="mt-12 grid gap-8 md:grid-cols-3">' + latest.map(function (p) { return UI.postCard(p, { tone: 'dark' }); }).join('') + '</div>' +
      '<div class="mt-12"><a href="' + SITE.routes.blog + '" class="' + cls.btnLime + '">All articles' + UI.icon('arrow-right', 'h-5 w-5') + '</a></div>')));

    /* ---------- 11. faqs ---------- */
    var FAQS = [
      { q: 'Do I need a referral to book?', a: 'No. You can book directly through the website, by phone or on WhatsApp. If you already have reports or a prescription from another doctor, bring them to the first visit.' },
      { q: 'Will what I say stay confidential?', a: 'Yes. Your conversations and records stay private. The only exception is a serious risk to someone\u2019s safety, and the doctor explains this clearly at the start of your first visit.' },
      { q: 'Will I have to take medicine?', a: 'Not always. Many people improve with talking therapy, better sleep routines and support. When medicine is the better choice, he explains how it works, what side effects to expect and how long it is usually needed.' },
      { q: 'Are antidepressants addictive?', a: 'No. Antidepressants are not addictive. Sleeping pills and some anti-anxiety tablets can cause dependence, so they are prescribed carefully, for short periods, and only when needed.' },
      { q: 'How long is a first appointment?', a: 'First visits are booked in 30-minute slots. If you need more time, the doctor will plan a longer follow-up with you rather than rush the conversation.' },
      { q: 'Can I consult online?', a: 'Yes. Secure video sessions run on Thursday evenings and Friday mornings, from anywhere in Bangladesh or abroad. The link is sent on WhatsApp or email after you book.' }
    ];
    place('faqs', section('faqs', 'FaqSection', cls.secWhite, box(
      '<div class="grid gap-12 lg:grid-cols-[1fr_1.6fr]"><div class="self-start lg:sticky lg:top-32">' +
      UI.sectionHead({ index: '11', eyebrow: 'Questions', title: 'Things people *ask first*', tone: 'light' }) +
      '<a href="' + SITE.routes.faqs + '" class="' + cls.btnInk + ' mt-8">All FAQs' + UI.icon('arrow-right', 'h-5 w-5') + '</a></div>' +
      '<div data-accordion data-accordion-single class="space-y-4">' + FAQS.map(function (f, i) { return UI.faqItem({ id: 'home-' + i, question: f.q, answerHTML: '<p>' + UI.esc(f.a) + '</p>', tone: 'light', open: i === 0 }); }).join('') + '</div></div>')));

    /* ---------- 12. crisis ---------- */
    place('crisis', section('crisis', 'CrisisSection', cls.secTang + ' overflow-x-clip',
      '<div aria-hidden="true" class="absolute inset-0 bg-hatch opacity-10"></div>' +
      box('<div class="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]"><div>' +
        '<p class="inline-block border-4 border-ink bg-white px-3 py-1 ' + cls.mono + '">\u00A712 \u00B7 Crisis</p>' +
        '<h2 class="mt-5 ' + cls.h2 + '">In crisis? Do not wait for an appointment.</h2>' +
        '<ul class="mt-8 max-w-2xl space-y-3 text-lg font-medium leading-relaxed"><li>Call <b>' + UI.esc(c.nationalEmergency) + '</b> if someone is in immediate danger or is thinking about ending their life.</li>' +
        '<li>Go to the nearest hospital emergency department.</li><li>Stay with the person until help arrives. Listen calmly and do not leave them alone.</li></ul>' +
        '<p class="mt-6 max-w-2xl">Existing patients can reach the urgent line on ' + UI.esc(c.urgent.display) + ' (' + UI.esc(c.urgent.note.toLowerCase()) + '). It does not replace emergency services.</p></div>' +
        '<div class="border-4 border-ink bg-white p-6 text-ink shadow-hard"><p class="' + cls.mono + '">National emergency</p><p class="' + cls.display + ' mt-2 text-8xl leading-none">' + UI.esc(c.nationalEmergency) + '</p>' +
        '<a href="tel:' + UI.esc(c.nationalEmergency) + '" class="' + cls.btnInk + ' mt-6 w-full">' + UI.icon('phone', 'h-5 w-5') + 'Call ' + UI.esc(c.nationalEmergency) + '</a></div></div>')));

    /* ---------- 13. final call to action ---------- */
    var cta = document.getElementById('cta-mount');
    if (cta) { cta.outerHTML = UI.ctaBand({ title: 'One conversation can *change* the next year', lead: 'Book a first consultation in Gulshan, Bashundhara or online. Evening and weekend slots are available.' }); UI.mount(document.getElementById('cta')); }
  });
})();
