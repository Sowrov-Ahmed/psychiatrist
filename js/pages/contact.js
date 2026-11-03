/*
 * js/pages/contact.js — Contact page script
 * Path: js/pages/contact.js · Owner: Part 2 · Purpose: hero, contact tiles, validated contact form, chamber cards with map tabs, crisis block, mini-FAQ and CTA
 * Depends on: SITE, UI, FX (shared kit), js/data/faqs.js (window.FAQS, optional) · Exposes: nothing
 */
(function () {
  'use strict';
  var C = SITE.contact;
  var SUBJECTS = ['Appointment query', 'Fees & insurance', 'Online consultation', 'Second opinion on reports', 'Feedback', 'Other'];
  var NEXT_STEPS = [
    { id: 'nx-001', title: 'We read it', text: 'The appointment desk reads your message on the same working day.' },
    { id: 'nx-002', title: 'We reply', text: 'You get an answer by WhatsApp, phone or email within one working day.' },
    { id: 'nx-003', title: 'You decide', text: 'We suggest a chamber and a time. Nothing is booked until you say yes.' }
  ];
  var ONLINE_STEPS = ['Book an online slot on the appointment page, or ask the desk.', 'Pay by bKash or Nagad and receive your receipt on WhatsApp or email.', 'Ten minutes before the session, a private video link arrives on WhatsApp or email.', 'Join from a quiet room on a phone or laptop. No app account is needed.'];
  var MINI_FAQ_IDS = ['faq-016', 'faq-018', 'faq-004'];
  var PRESS = 'transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0.5 active:translate-y-0.5';

  function inject(mountId, sectionId, html) { document.getElementById(mountId).outerHTML = html; UI.mount(document.getElementById(sectionId)); }

  function renderHero() {
    document.getElementById('hero-mount').innerHTML = UI.pageHero({
      index: '10', eyebrow: 'Contact', title: 'Get in touch, *get a real answer*', tone: 'lime',
      lead: 'Questions about booking, fees, online sessions or reports? The appointment desk is open Saturday to Thursday, 9:00 AM to 8:00 PM, and a person replies to every message.',
      crumbs: [{ label: 'Home', href: SITE.routes.home }, { label: 'Contact' }],
      actionsHTML: '<a href="tel:' + C.phone.e164 + '" class="' + UI.cls.btnInk + '">' + UI.icon('phone', 'h-5 w-5') + UI.esc(C.phone.display) + '</a><a href="' + C.whatsappUrl + '" target="_blank" rel="noopener noreferrer" class="' + UI.cls.btnWhite + '">' + UI.icon('message-circle', 'h-5 w-5') + 'WhatsApp</a>'
    });
  }

  function renderTiles() {
    var tiles = [
      { id: 'tile-phone', icon: 'phone', label: 'Appointment line', value: C.phone.display, note: C.deskHours.replace('Appointment desk: ', 'Desk: '), href: 'tel:' + C.phone.e164, bg: 'bg-lime' },
      { id: 'tile-whatsapp', icon: 'message-circle', label: 'WhatsApp', value: 'Message the desk', note: 'Send questions or reports. Replies come in desk hours.', href: C.whatsappUrl, ext: true, bg: 'bg-white' },
      { id: 'tile-email', icon: 'mail', label: 'Email', value: C.email, note: 'We reply within one working day.', href: 'mailto:' + C.email, bg: 'bg-lilac' },
      { id: 'tile-urgent', icon: 'alert-circle', label: 'Urgent line', value: C.urgent.display, note: C.urgent.note + '. Not an emergency service.', href: 'tel:' + C.urgent.e164, bg: 'bg-tang' }
    ];
    var cards = tiles.map(function (t, i) {
      return '<li data-reveal="stamp" data-delay="' + i * 100 + '" class="h-full"><a href="' + t.href + '"' + (t.ext ? ' target="_blank" rel="noopener noreferrer"' : '') + ' class="group flex h-full flex-col border-4 border-ink bg-white text-ink shadow-hard-lime ' + PRESS + ' hover:shadow-[12px_12px_0_0_#CCFF00] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra">' +
        '<span class="flex items-center justify-between border-b-4 border-ink px-4 py-3 ' + UI.cls.mono + ' ' + t.bg + '"><span>№ ' + UI.pad(i + 1) + ' · ' + UI.esc(t.label) + '</span>' + UI.icon(t.icon, 'h-5 w-5') + '</span>' +
        '<span class="flex flex-1 flex-col p-5"><span class="' + UI.cls.display + ' text-xl leading-tight [overflow-wrap:anywhere] md:text-2xl">' + UI.esc(t.value) + '</span><span class="mt-3 text-sm leading-relaxed">' + UI.esc(t.note) + '</span><span class="mt-auto flex items-center gap-2 pt-5 font-mono text-xs font-black uppercase">' + (t.ext ? 'Open chat' : t.href.indexOf('mailto') === 0 ? 'Write email' : 'Call now') + UI.icon('arrow-right', 'h-4 w-4 transition-transform group-hover:translate-x-1') + '</span></span></a></li>';
    }).join('');
    inject('tiles-mount', 'tiles', '<section id="tiles" data-section="tiles" class="' + UI.cls.secInk + ' overflow-x-clip"><div class="' + UI.cls.container + '" data-component="ContactTiles">' + UI.sectionHead({ index: '01', eyebrow: 'Direct lines', title: 'Four ways *in*', lead: 'Use whichever feels easiest. The urgent line is for existing patients only. In an emergency, call 999.', tone: 'dark' }) + '<ul class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">' + cards + '</ul></div></section>');
  }

  function nextOpeningHTML() {
    var nx = SITE.nextOpening();
    if (!nx) return '';
    return '<p class="mt-5 flex gap-3 border-t-4 border-ink pt-5 leading-relaxed">' + UI.icon('calendar', 'mt-1 h-5 w-5 shrink-0') + '<span><b>Next session:</b> ' + UI.esc(nx.chamber.chamberName) + ', ' + (nx.isToday ? 'today' : UI.esc(nx.startAt.toLocaleDateString('en-GB', { weekday: 'long' }))) + ' from ' + UI.formatTime(nx.startAt) + '.</span></p>';
  }

  function successHTML(id, payload) {
    var ch = SITE.getChamber(payload.chamberSlug);
    return '<div role="status" class="border-4 border-ink bg-lime p-6 text-ink shadow-hard md:p-10"><p class="' + UI.cls.mono + '">' + UI.icon('check-circle', 'mr-2 inline h-5 w-5') + 'Message received</p><h3 class="mt-4 ' + UI.cls.h2 + '">Thank you, ' + UI.esc(payload.fullName.split(' ')[0]) + '</h3>' +
      '<p class="mt-5 max-w-xl text-lg leading-relaxed">Your message about “' + UI.esc(payload.subject) + '”' + (ch ? ' for the ' + UI.esc(ch.chamberName) : '') + ' has reached the appointment desk. We will reply on ' + UI.esc(payload.phone) + ' or by email within one working day.</p>' +
      '<p class="mt-6 inline-block border-4 border-ink bg-white px-4 py-3 font-mono text-sm font-black">Reference: <span id="contact-ref">' + UI.esc(id) + '</span></p>' +
      '<div class="mt-8 flex flex-wrap gap-4"><a href="' + SITE.routes.appointment + '" class="' + UI.cls.btnInk + '">Book Appointment' + UI.icon('arrow-right', 'h-5 w-5') + '</a><a href="' + SITE.routes.faqs + '" class="' + UI.cls.btnWhite + '">Read the FAQs</a></div>' +
      '<p class="mt-6 text-sm">Not an emergency service. If someone is in danger, call 999.</p></div>';
  }

  function bindForm(form, wrap) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!UI.validateForm(form)) return;
      var btn = form.querySelector('button[type="submit"]'), label = btn.innerHTML, f = form.elements;
      btn.disabled = true; btn.setAttribute('aria-busy', 'true'); btn.textContent = 'Sending…';
      var payload = { fullName: f.fullName.value.trim(), phone: f.phone.value.replace(/[\s-]/g, ''), email: f.email.value.trim(), subject: f.subject.value, chamberSlug: f.chamberSlug.value, message: f.message.value.trim(), consent: f.consent.checked };
      SITE.submit('contact', payload).then(function (res) {
        wrap.innerHTML = successHTML(res.id, payload); wrap.focus(); UI.toast('Message sent. Reference ' + res.id);
      }).catch(function () {
        btn.disabled = false; btn.removeAttribute('aria-busy'); btn.innerHTML = label; UI.toast('Could not send. Please call the desk instead.', 'error');
      });
    });
  }

  function renderForm() {
    var chambers = SITE.chambersIndex.map(function (c) { return { value: c.slug, label: c.chamberName + (c.mode === 'online' ? ' (video)' : ' · ' + c.area) }; });
    var form = '<form id="contact-form" novalidate aria-label="Contact form" class="space-y-6">' +
      UI.field({ label: 'Full name', name: 'fullName', required: true, autocomplete: 'name' }) +
      '<div class="grid gap-6 md:grid-cols-2">' + UI.field({ label: 'Mobile number', name: 'phone', type: 'tel', required: true, validate: 'bd-phone', autocomplete: 'tel', hint: 'We reply on this number, including WhatsApp. Example: 01712-345678.' }) + UI.field({ label: 'Email (optional)', name: 'email', type: 'email', autocomplete: 'email' }) + '</div>' +
      '<div class="grid gap-6 md:grid-cols-2">' + UI.field({ label: 'Subject', name: 'subject', type: 'select', required: true, options: SUBJECTS }) + UI.field({ label: 'Chamber (optional)', name: 'chamberSlug', type: 'select', options: chambers, hint: 'Leave blank if you are not sure yet.' }) + '</div>' +
      UI.field({ label: 'Your message', name: 'message', type: 'textarea', required: true, minlength: 20, rows: 6, hint: 'Tell us how we can help, in at least 20 characters. Please do not send emergencies here, and do not include passwords or card numbers.' }) +
      UI.field({ label: 'Consent', name: 'consent', type: 'checkbox', required: true, labelHTML: 'I agree that Dr. Rashed’s team may contact me about this message. I understand this form is not for emergencies.' }) +
      '<div class="flex flex-wrap items-center gap-5"><button type="submit" class="' + UI.cls.btnInk + ' w-full disabled:cursor-wait disabled:opacity-60 sm:w-auto">Send message' + UI.icon('send', 'h-5 w-5') + '</button><p class="max-w-xs text-sm leading-relaxed">In a crisis, call <a href="tel:999" class="font-black underline underline-offset-4">999</a>. This form is not monitored around the clock.</p></div></form>';
    var steps = NEXT_STEPS.map(function (s, i) { return '<li class="flex gap-4"><span class="flex h-10 w-10 shrink-0 items-center justify-center border-4 border-ink bg-lime font-mono text-sm font-black">' + UI.pad(i + 1) + '</span><span><b class="block">' + UI.esc(s.title) + '</b>' + UI.esc(s.text) + '</span></li>'; }).join('');
    var side = '<aside aria-label="Desk hours and what happens next" class="space-y-8 lg:sticky lg:top-28"><div data-reveal="stamp" class="border-4 border-ink bg-lime p-6 shadow-hard"><p class="' + UI.cls.mono + '">Desk hours</p><p class="mt-3 ' + UI.cls.h3 + '">Saturday – Thursday</p><p class="mt-1 text-lg">9:00 AM – 8:00 PM</p><p class="mt-4 leading-relaxed">Friday is a day off, apart from the online session from 10:00 AM to 1:00 PM. Messages sent then are answered on the next working day.</p>' + nextOpeningHTML() + '</div>' +
      '<div data-reveal="cut" class="border-4 border-ink bg-white p-6 shadow-hard"><p class="' + UI.cls.mono + '">What happens next</p><ol class="mt-5 space-y-5 leading-relaxed">' + steps + '</ol></div></aside>';
    inject('form-mount', 'message', '<section id="message" data-section="message" class="' + UI.cls.secWhite + ' overflow-x-clip"><div aria-hidden="true" data-parallax="-0.2" data-parallax-rotate="20" class="pointer-events-none absolute -left-8 top-16 hidden w-32 md:block">' + UI.deco(SITE.img.objects.cross, 'w-full') + '</div><div class="' + UI.cls.container + ' relative" data-component="ContactForm">' +
      UI.sectionHead({ index: '02', eyebrow: 'Write to us', title: 'Send a *message*', lead: 'Two minutes, no account. We use your details only to reply to you.', tone: 'light' }) +
      '<div class="mt-12 grid items-start gap-10 lg:grid-cols-[1.5fr_1fr]"><div id="contact-form-wrap" tabindex="-1" class="border-4 border-ink bg-concrete-100 p-6 shadow-hard focus:outline-none md:p-10">' + form + '</div>' + side + '</div></div></section>');
    bindForm(document.getElementById('contact-form'), document.getElementById('contact-form-wrap'));
  }

  function mapPanel(c) {
    var q = encodeURIComponent(c.address);
    return '<div class="grid lg:grid-cols-[1.6fr_1fr]"><iframe title="Map showing ' + UI.esc(c.name) + ', ' + UI.esc(c.area) + '" src="https://www.google.com/maps?q=' + q + '&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" class="h-80 w-full border-b-4 border-ink lg:h-full lg:min-h-[26rem] lg:border-b-0 lg:border-r-4"></iframe>' +
      '<div class="p-6 md:p-8"><h3 class="' + UI.cls.h3 + '">' + UI.esc(c.name) + '</h3><p class="mt-4 flex gap-3 leading-relaxed">' + UI.icon('map-pin', 'mt-1 h-5 w-5 shrink-0') + '<span>' + UI.esc(c.address) + '</span></p>' +
      c.schedule.map(function (s) { return '<p class="mt-3 flex gap-3 leading-relaxed">' + UI.icon('clock', 'mt-1 h-5 w-5 shrink-0') + '<span><b>' + UI.esc(s.label) + '</b> · ' + UI.esc(s.hours) + '</span></p>'; }).join('') +
      '<p class="mt-3 flex gap-3">' + UI.icon('phone', 'mt-1 h-5 w-5 shrink-0') + '<a class="font-bold underline underline-offset-4" href="tel:' + c.phone.e164 + '">' + UI.esc(c.phone.display) + '</a></p>' +
      '<div class="mt-8 flex flex-wrap gap-4"><a href="https://www.google.com/maps/dir/?api=1&destination=' + c.lat + ',' + c.lng + '" target="_blank" rel="noopener noreferrer" class="' + UI.cls.btnLime + ' !px-4 !py-2.5 text-xs">' + UI.icon('navigation', 'h-4 w-4') + 'Get directions</a><a href="' + SITE.url.appointment({ chamber: c.slug }) + '" class="' + UI.cls.btnOutline + ' !px-4 !py-2.5 text-xs">Book here</a></div></div></div>';
  }
  function onlinePanel(c) {
    return '<div class="grid lg:grid-cols-[1fr_1fr]"><div class="border-b-4 border-ink bg-ultra p-6 text-white md:p-8 lg:border-b-0 lg:border-r-4"><span class="' + UI.cls.iconBox + '">' + UI.icon('video', 'h-6 w-6') + '</span><h3 class="mt-6 ' + UI.cls.h3 + '">' + UI.esc(c.name) + '</h3><p class="mt-4 leading-relaxed text-white/90">See Dr. Rashed from home, anywhere in Bangladesh or abroad. Sessions run on Thursday from 6:00 PM to 10:00 PM and on Friday from 10:00 AM to 1:00 PM.</p><p class="mt-4 font-mono text-sm font-bold">First visit ' + UI.formatBDT(c.fee.firstVisit) + ' · Follow-up ' + UI.formatBDT(c.fee.followUp) + '</p></div>' +
      '<div class="p-6 md:p-8"><p class="' + UI.cls.mono + '">How a video visit works</p><ol class="mt-5 space-y-4 leading-relaxed">' + ONLINE_STEPS.map(function (s, i) { return '<li class="flex gap-4"><span class="flex h-9 w-9 shrink-0 items-center justify-center border-4 border-ink bg-lime font-mono text-xs font-black">' + UI.pad(i + 1) + '</span><span>' + UI.esc(s) + '</span></li>'; }).join('') + '</ol><a href="' + SITE.url.appointment({ chamber: c.slug }) + '" class="mt-8 ' + UI.cls.btnLime + ' !px-4 !py-2.5 text-xs">Book online' + UI.icon('arrow-right', 'h-4 w-4') + '</a></div></div>';
  }

  function renderChambers() {
    var list = SITE.chambersIndex, cards = list.map(function (c, i) { return '<li data-reveal="cut" data-delay="' + i * 100 + '" class="h-full">' + UI.chamberCard(c, { tone: 'light' }) + '</li>'; }).join('');
    var tabs = list.map(function (c, i) { return '<button type="button" role="tab" id="map-tab-' + c.slug + '" data-tab="' + c.slug + '" aria-selected="' + (i === 0) + '" aria-controls="map-panel-' + c.slug + '" class="' + UI.cls.tab + '">' + UI.esc(c.chamberName) + '</button>'; }).join('');
    var panels = list.map(function (c, i) { return '<div role="tabpanel" id="map-panel-' + c.slug + '" data-tab-panel="' + c.slug + '" aria-labelledby="map-tab-' + c.slug + '" class="' + (i ? 'hidden ' : '') + 'mt-6 border-4 border-ink bg-white text-ink shadow-hard">' + (c.mode === 'online' ? onlinePanel(c) : mapPanel(c)) + '</div>'; }).join('');
    inject('chambers-mount', 'chambers', '<section id="chambers" data-section="chambers" class="' + UI.cls.secConcrete + ' overflow-x-clip"><div aria-hidden="true" data-parallax="0.2" class="pointer-events-none absolute -right-6 top-10 hidden w-40 md:block">' + UI.deco(SITE.img.objects.cube, 'w-full') + '</div><div class="' + UI.cls.container + ' relative" data-component="ChamberFinder">' +
      UI.sectionHead({ index: '03', eyebrow: 'Find us', title: 'Three ways to *sit down* with the doctor', lead: 'Two in-person chambers in Dhaka and one secure online room. Fees are shown on each card.', tone: 'light' }) + '<ul class="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">' + cards + '</ul>' +
      '<div data-tabs id="map-tabs" class="mt-16"><p class="mb-4 ' + UI.cls.mono + '">Map and directions</p><div role="tablist" aria-label="Choose a chamber" class="flex flex-wrap gap-3">' + tabs + '</div>' + panels + '</div></div></section>');
  }

  function renderCrisis() {
    inject('crisis-mount', 'crisis', '<section id="crisis" data-section="crisis" class="' + UI.cls.secTang + ' overflow-x-clip"><div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-hatch opacity-10"></div><div class="' + UI.cls.container + ' relative" data-component="CrisisBlock"><div class="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">' +
      '<div><p data-reveal="cut" class="' + UI.cls.stickerCls + ' bg-white">Emergency</p><h2 data-reveal="slam" class="mt-5 ' + UI.cls.h2 + ' [&_em]:bg-ink [&_em]:px-2 [&_em]:not-italic [&_em]:text-lime">If it cannot wait, <em>call 999</em></h2><div data-parallax="-0.08" class="mt-6"><p data-scramble class="font-display text-[clamp(6rem,26vw,16rem)] font-black leading-[0.8] tracking-tighter">999</p></div></div>' +
      '<div data-reveal="stamp" class="border-4 border-ink bg-white p-6 text-ink shadow-hard md:p-8"><p class="' + UI.cls.mono + '">Call 999 or go to the nearest hospital emergency department now if:</p><ul class="mt-5 space-y-4 leading-relaxed">' +
      ['You are thinking about ending your life, or you have hurt yourself and need medical care.', 'You feel unable to keep yourself or someone else safe.', 'Someone is very confused, extremely agitated or not responding normally, and you are frightened for them.', 'You or someone else has taken too much of a medicine or a substance.'].map(function (t) { return '<li class="flex gap-3">' + UI.icon('check', 'mt-1 h-5 w-5 shrink-0') + '<span>' + UI.esc(t) + '</span></li>'; }).join('') + '</ul>' +
      '<p class="mt-6 border-t-4 border-ink pt-5 leading-relaxed">Stay with the person and stay calm until help arrives. The appointment desk, WhatsApp and this website are not emergency services. Existing patients may also use the urgent line on ' + UI.esc(C.urgent.display) + ', but call 999 first when a life is at risk.</p>' +
      '<a href="tel:999" class="mt-6 ' + UI.cls.btnInk + ' w-full sm:w-auto">' + UI.icon('phone', 'h-5 w-5') + 'Call 999</a></div></div></div></section>');
  }

  function renderMiniFaq() {
    var all = (window.FAQS && window.FAQS.items) || [];
    var rows = MINI_FAQ_IDS.map(function (id) { return all.filter(function (q) { return q.id === id; })[0]; }).filter(Boolean);
    var acc = rows.map(function (q, i) { return UI.faqItem({ id: 'contact-' + q.id, question: q.question, answerHTML: '<p>' + UI.esc(q.answer) + '</p>', tone: 'light', open: i === 0 }); }).join('<div class="h-4"></div>');
    inject('faq-mount', 'quick-faq', '<section id="quick-faq" data-section="quick-faq" class="' + UI.cls.secWhite + ' overflow-x-clip"><div class="' + UI.cls.container + '" data-component="QuickFaq"><div class="grid items-start gap-12 lg:grid-cols-[1fr_1.4fr]"><div>' + UI.sectionHead({ index: '04', eyebrow: 'Quick answers', title: 'Before you *write*', lead: 'The three questions the desk hears most often.', tone: 'light' }) + '<a href="' + SITE.routes.faqs + '" class="mt-8 ' + UI.cls.btnInk + '">All ' + all.length + ' answers' + UI.icon('arrow-right', 'h-5 w-5') + '</a></div><div data-accordion data-accordion-single>' + acc + '</div></div></div></section>');
  }

  UI.ready(function () {
    renderHero(); renderTiles(); renderForm(); renderChambers(); renderCrisis(); renderMiniFaq();
    document.getElementById('cta-mount').outerHTML = UI.ctaBand({ title: 'Prefer to *talk* in person?', lead: 'Choose a chamber in Gulshan or Bashundhara, or a secure video session, and book a time that suits you.' });
    UI.mount(document.getElementById('cta'));
  });
})();
