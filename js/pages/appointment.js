/*
 * js/pages/appointment.js — 5-step booking wizard
 * Path: js/pages/appointment.js · Owner: Part 4 · Purpose: prefill, wizard, calendar, slots, review, confirmation, .ics
 * Depends on: SITE, UI, FX (kit) · Exposes: nothing (reads/writes sessionStorage key "ortho:booking")
 */
(function () {
  'use strict';
  var KEY = 'ortho:booking', MONO = UI.cls.mono, RANGE_DAYS = 60;
  var TYPES = [
    { key: 'new', title: 'New consultation', desc: 'Your first visit with Dr. Rashed.', icon: 'user', fee: 'firstVisit' },
    { key: 'follow-up', title: 'Follow-up', desc: 'A review within 30 days of your last visit.', icon: 'clock', fee: 'followUp' },
    { key: 'second-opinion', title: 'Second opinion', desc: 'Bring reports and prescriptions from another doctor.', icon: 'file-text', fee: 'firstVisit' },
    { key: 'post-op', title: 'Review after treatment', desc: 'A progress check after a course of treatment.', icon: 'activity', fee: 'followUp' }
  ];
  var STEPS = [
    { n: 1, label: 'Visit', title: 'What brings you in?' }, { n: 2, label: 'Chamber', title: 'Where would you like to be seen?' },
    { n: 3, label: 'Date & time', title: 'Pick a day and a time' }, { n: 4, label: 'Details', title: 'Tell us about the patient' }, { n: 5, label: 'Confirm', title: 'Check everything, then confirm' }
  ];
  var PAYMENTS = [{ v: 'chamber', l: 'Pay at chamber' }, { v: 'bkash', l: 'bKash' }, { v: 'nagad', l: 'Nagad' }, { v: 'card', l: 'Card at chamber' }];
  var WEEK = [6, 0, 1, 2, 3, 4, 5], SHORT = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'], LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var GENERAL = 'general', WIDTH = ['w-1/5', 'w-2/5', 'w-3/5', 'w-4/5', 'w-full'];
  var state = { step: 1, type: 'new', service: '', chamber: '', date: '', time: '', view: null, focusIso: '', payment: 'chamber', submitting: false, done: null,
    details: { fullName: '', age: '', gender: '', phone: '', email: '', area: '', bookingFor: 'Myself', patientRelation: '', concern: '', preferredContact: 'Phone', consent: false } };

  /* ---------- pure helpers ---------- */
  function pad(n) { return UI.pad(n); }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseISO(s) { if (!/^\d{4}-\d{2}-\d{2}$/.test(String(s || ''))) return null; var d = new Date(s + 'T00:00:00'); return isNaN(d.getTime()) || iso(d) !== s ? null : d; }
  function startOfToday() { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function inRange(d) { var t = startOfToday(); return d >= t && d <= addDays(t, RANGE_DAYS - 1); }
  function toMin(hm) { var p = hm.split(':'); return Number(p[0]) * 60 + Number(p[1]); }
  function fmt(hm) { var p = hm.split(':').map(Number); return UI.formatTime(new Date(2026, 0, 1, p[0], p[1])); }
  function longDate(s) { var d = parseISO(s); return d ? LONG[d.getDay()] + ', ' + UI.formatDate(s) : ''; }
  /* booked rule: h = 5381; for each char of (chamberSlug + date + "HH:MM"): h = (h * 33 + code) mod 2^32; booked when h % 4 === 0 */
  function hash(s) { var h = 5381, i; for (i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) % 4294967296; return h; }
  function isBooked(slug, date, hhmm) { return hash(slug + date + hhmm) % 4 === 0; }
  function getCh(slug) { return SITE.getChamber(slug); }
  function svcName(slug) { if (slug === GENERAL) return 'Not sure yet \u2014 general consultation'; var s = SITE.getService(slug); return s ? s.name : ''; }
  function typeOf(key) { return TYPES.filter(function (t) { return t.key === key; })[0] || TYPES[0]; }
  function feeFor(ch) { return ch ? ch.fee[typeOf(state.type).fee] : null; }
  function slotsFor(ch, dateIso) {
    var d = parseISO(dateIso), out = [], now = new Date(); if (!d || !ch) return out;
    ch.schedule.forEach(function (s) {
      if (s.days.indexOf(d.getDay()) === -1) return;
      for (var m = toMin(s.start); m + ch.slotMinutes <= toMin(s.end); m += ch.slotMinutes) {
        var hh = pad(Math.floor(m / 60)) + ':' + pad(m % 60);
        if (new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(m / 60), m % 60) <= now) continue;
        out.push({ time: hh, label: fmt(hh), booked: isBooked(ch.slug, dateIso, hh) });
      }
    });
    return out.sort(function (a, b) { return a.time < b.time ? -1 : 1; });
  }
  function dayState(ch, dateIso) {
    var d = parseISO(dateIso); if (!d || !inRange(d)) return 'out';
    var sl = slotsFor(ch, dateIso); if (!sl.length) return 'closed';
    return sl.some(function (x) { return !x.booked; }) ? 'ok' : 'full';
  }
  function earliest(ch) {
    for (var i = 0; i < RANGE_DAYS; i++) { var di = iso(addDays(startOfToday(), i)), f = slotsFor(ch, di).filter(function (x) { return !x.booked; })[0]; if (f) return { date: di, slot: f }; }
    return null;
  }
  function reconcile() {
    var ch = getCh(state.chamber);
    if (state.date && !parseISO(state.date)) state.date = '';
    if (state.date && !inRange(parseISO(state.date))) state.date = '';
    if (ch && state.date) { if (dayState(ch, state.date) !== 'ok') state.date = ''; }
    if (!state.date) state.time = '';
    else if (ch && state.time && !slotsFor(ch, state.date).some(function (x) { return x.time === state.time && !x.booked; })) state.time = '';
  }
  function save() { try { var s = JSON.parse(JSON.stringify(state)); delete s.view; delete s.submitting; delete s.done; delete s.focusIso; s.details.consent = false; sessionStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* storage unavailable */ } }
  function clearSaved() { try { sessionStorage.removeItem(KEY); } catch (e) { /* storage unavailable */ } }
  function load() {
    var s = null; try { s = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { s = null; }
    if (s && typeof s === 'object') {
      if (typeOf(s.type).key === s.type) state.type = s.type;
      if (s.service === GENERAL || SITE.getService(s.service)) state.service = s.service;
      if (getCh(s.chamber)) state.chamber = s.chamber;
      if (parseISO(s.date)) state.date = s.date;
      if (typeof s.time === 'string' && /^\d{2}:\d{2}$/.test(s.time)) state.time = s.time;
      if (PAYMENTS.some(function (p) { return p.v === s.payment; })) state.payment = s.payment;
      if (s.details && typeof s.details === 'object') Object.keys(state.details).forEach(function (k) { if (k !== 'consent' && typeof s.details[k] === 'string') state.details[k] = s.details[k]; });
      state.step = Math.max(1, Math.min(4, parseInt(s.step, 10) || 1));
    }
    var q = UI.getParam('type'); if (q && typeOf(q).key === q) state.type = q;
    q = UI.getParam('service'); if (q && SITE.getService(q)) state.service = q;
    q = UI.getParam('chamber'); if (q && getCh(q)) state.chamber = q;
    q = UI.getParam('date'); if (q && parseISO(q) && inRange(parseISO(q))) state.date = q;
    reconcile();
    if (!state.service) state.step = 1; else if (!state.chamber) state.step = Math.min(state.step, 2); else if (!state.date || !state.time) state.step = Math.min(state.step, 3);
    var base = parseISO(state.date) || startOfToday(); state.view = { y: base.getFullYear(), m: base.getMonth() };
  }

  /* ---------- shared markup ---------- */
  function radioCard(o) {
    return '<label class="group relative block cursor-pointer"><input type="radio" name="' + o.name + '" value="' + UI.esc(o.value) + '"' + (o.checked ? ' checked' : '') + ' required aria-describedby="err-' + o.name + '" class="peer sr-only">' +
      '<span class="flex h-full gap-3 border-4 border-ink bg-white p-4 text-ink transition-all duration-150 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-hard-sm peer-checked:bg-lime peer-checked:shadow-hard peer-focus-visible:ring-4 peer-focus-visible:ring-ultra"><span class="' + UI.cls.iconBox + ' !bg-white">' + UI.icon(o.icon, 'h-6 w-6') + '</span><span class="min-w-0 pr-8"><b class="block font-display text-base font-black uppercase leading-tight">' + UI.esc(o.title) + '</b><span class="mt-1 block text-sm leading-snug">' + o.sub + '</span></span></span>' +
      '<span aria-hidden="true" class="absolute right-3 top-3 hidden h-7 w-7 items-center justify-center bg-ink text-lime peer-checked:flex">' + UI.icon('check', 'h-4 w-4') + '</span></label>';
  }
  function chip(name, val, label, checked) {
    return '<label class="relative block cursor-pointer"><input type="radio" name="' + name + '" value="' + UI.esc(val) + '"' + (checked ? ' checked' : '') + ' required aria-describedby="err-' + name + '" class="peer sr-only"><span class="flex min-h-[3rem] items-center justify-center border-4 border-ink bg-white px-4 py-2 text-center ' + MONO + ' text-ink transition-colors hover:bg-lime peer-checked:bg-ink peer-checked:text-lime peer-focus-visible:ring-4 peer-focus-visible:ring-ultra">' + UI.esc(label) + '</span></label>';
  }
  function group(legend, name, opts, cur) {
    return '<fieldset class="min-w-0"><legend class="mb-2 ' + MONO + '">' + legend + ' <span class="text-tang" aria-hidden="true">*</span></legend><div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">' + opts.map(function (o) { return chip(name, o, o, cur === o); }).join('') + '</div><p id="err-' + name + '" data-error-for="' + name + '" class="mt-1 hidden font-mono text-sm font-bold text-alert"></p></fieldset>';
  }
  function errLine(name) { return '<p id="err-' + name + '" data-error-for="' + name + '" class="mt-3 hidden font-mono text-sm font-bold text-alert"></p>'; }
  function row(label, html, goto) {
    return '<div class="flex flex-wrap items-start justify-between gap-3 p-4"><dt class="w-32 shrink-0 ' + MONO + '">' + label + '</dt><dd class="min-w-0 flex-1 font-medium">' + html + '</dd>' + (goto ? '<button type="button" data-goto="' + goto + '" class="min-h-[2.75rem] px-2 ' + MONO + ' underline underline-offset-4 hover:bg-lime focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra">Edit<span class="sr-only"> ' + UI.esc(label) + '</span></button>' : '') + '</div>';
  }

  /* ---------- steps ---------- */
  function step1() {
    var types = TYPES.map(function (t) { return radioCard({ name: 'visitType', value: t.key, checked: state.type === t.key, title: t.title, sub: UI.esc(t.desc), icon: t.icon }); }).join('');
    var svcs = SITE.servicesIndex.map(function (s) { return radioCard({ name: 'service', value: s.slug, checked: state.service === s.slug, title: s.name, sub: UI.esc(UI.formatBDTRange(s.priceFrom, s.priceTo)), icon: s.icon }); }).join('') +
      radioCard({ name: 'service', value: GENERAL, checked: state.service === GENERAL, title: 'Not sure yet', sub: 'General consultation. The doctor will help you decide.', icon: 'info' });
    return '<fieldset class="min-w-0"><legend class="mb-4 ' + MONO + '">Type of visit</legend><div class="grid gap-4 sm:grid-cols-2">' + types + '</div>' + errLine('visitType') + '</fieldset>' +
      '<fieldset class="mt-10 min-w-0"><legend class="mb-4 ' + MONO + '">What would you like help with?</legend><div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">' + svcs + '</div>' + errLine('service') + '</fieldset>';
  }
  function step2() {
    var cards = SITE.chambersIndex.map(function (c) {
      var online = c.mode === 'online', sched = c.schedule.map(function (s) { return '<span class="block">' + UI.esc(s.label) + ' \u00B7 ' + UI.esc(s.hours) + '</span>'; }).join('');
      return '<label class="group relative block cursor-pointer"><input type="radio" name="chamber" value="' + UI.esc(c.slug) + '"' + (state.chamber === c.slug ? ' checked' : '') + ' required aria-describedby="err-chamber" class="peer sr-only">' +
        '<span class="flex h-full flex-col border-4 border-ink bg-white text-ink transition-all duration-150 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-hard-sm peer-checked:bg-lime peer-checked:shadow-hard peer-focus-visible:ring-4 peer-focus-visible:ring-ultra"><span class="relative block aspect-[16/9] overflow-hidden border-b-4 border-ink bg-concrete">' + UI.img(c.image, c.name, 'absolute inset-0 h-full w-full object-cover', { w: 640, h: 360 }) + '</span>' +
        '<span class="flex flex-1 flex-col gap-2 p-4"><span class="flex items-center justify-between gap-2 ' + MONO + '"><span>' + UI.esc(c.area) + '</span><span class="px-2 ' + (online ? 'bg-tang' : 'bg-ink text-lime') + '">' + (online ? 'Online' : 'In person') + '</span></span><b class="font-display text-xl font-black uppercase leading-tight">' + UI.esc(c.chamberName) + '</b><span class="text-sm">' + UI.esc(online ? 'Secure video call from anywhere' : c.address) + '</span><span class="text-sm">' + sched + '</span><span class="mt-auto border-t-4 border-ink pt-3 font-mono text-sm font-bold">' + UI.formatBDT(feeFor(c)) + ' <span class="font-normal">for this visit</span></span></span></span>' +
        '<span aria-hidden="true" class="absolute right-3 top-3 hidden h-8 w-8 items-center justify-center bg-ink text-lime peer-checked:flex">' + UI.icon('check', 'h-5 w-5') + '</span></label>';
    }).join('');
    return '<fieldset class="min-w-0"><legend class="mb-4 ' + MONO + '">Choose a chamber \u00B7 fee shown for: ' + UI.esc(typeOf(state.type).title) + '</legend><div class="grid gap-5 md:grid-cols-3">' + cards + '</div>' + errLine('chamber') + '</fieldset>';
  }
  function viewBounds() { var t = startOfToday(), mx = addDays(t, RANGE_DAYS - 1); return { first: t.getFullYear() * 12 + t.getMonth(), last: mx.getFullYear() * 12 + mx.getMonth() }; }
  function cellHTML(ch, ds, focusIso) {
    if (!ds) return '<div role="gridcell" aria-hidden="true" class="h-11"></div>';
    var d = parseISO(ds), st = dayState(ch, ds), ok = st === 'ok', sel = state.date === ds, tip = ok ? 'available' : st === 'full' ? 'fully booked' : 'closed';
    var cls = sel ? 'bg-ink text-lime' : ok ? 'bg-white text-ink hover:bg-lime' : st === 'full' ? 'bg-concrete-100 text-ink line-through' : 'bg-concrete-100 text-ink/50';
    return '<div role="gridcell" aria-selected="' + sel + '"><button type="button" data-date="' + ds + '"' + (ok ? '' : ' aria-disabled="true"') + ' tabindex="' + (ds === focusIso ? 0 : -1) + '" aria-label="' + LONG[d.getDay()] + ' ' + UI.esc(UI.formatDate(ds)) + ', ' + tip + '" class="h-11 w-full border-2 border-ink font-mono text-sm font-bold ' + cls + (ds === iso(startOfToday()) ? ' underline decoration-4 underline-offset-4' : '') + ' focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra">' + d.getDate() + '</button></div>';
  }
  function calendar(ch) {
    var v = state.view, lead = (new Date(v.y, v.m, 1).getDay() + 1) % 7, n = new Date(v.y, v.m + 1, 0).getDate(), all = [], rows = [], i, b = viewBounds(), idx = v.y * 12 + v.m;
    for (i = 0; i < lead; i++) all.push(null);
    for (i = 1; i <= n; i++) all.push(iso(new Date(v.y, v.m, i)));
    while (all.length % 7) all.push(null);
    var inView = function (s) { return s && parseISO(s).getMonth() === v.m && parseISO(s).getFullYear() === v.y; };
    var focusIso = inView(state.focusIso) ? state.focusIso : inView(state.date) ? state.date : (all.filter(function (s) { return s && dayState(ch, s) === 'ok'; })[0] || all.filter(Boolean)[0]);
    state.focusIso = focusIso;
    for (i = 0; i < all.length; i += 7) rows.push('<div role="row" class="grid grid-cols-7 gap-1.5">' + all.slice(i, i + 7).map(function (s) { return cellHTML(ch, s, focusIso); }).join('') + '</div>');
    var navCls = UI.cls.arrowBtn + ' !h-11 !w-11 disabled:opacity-40';
    return '<div class="flex items-center justify-between gap-3"><button type="button" data-cal="-1" aria-label="Previous month" class="' + navCls + '"' + (idx <= b.first ? ' disabled' : '') + '>' + UI.icon('chevron-left', 'h-5 w-5') + '</button><h4 id="cal-title" aria-live="polite" class="font-display text-xl font-black uppercase">' + MONTHS[v.m] + ' ' + v.y + '</h4><button type="button" data-cal="1" aria-label="Next month" class="' + navCls + '"' + (idx >= b.last ? ' disabled' : '') + '>' + UI.icon('chevron-right', 'h-5 w-5') + '</button></div>' +
      '<div role="grid" aria-labelledby="cal-title" class="mt-4 space-y-1.5"><div role="row" class="grid grid-cols-7 gap-1.5">' + WEEK.map(function (w, k) { return '<div role="columnheader" aria-label="' + LONG[w] + '" class="py-1 text-center ' + MONO + '">' + SHORT[k] + '</div>'; }).join('') + '</div>' + rows.join('') + '</div>' +
      '<p class="mt-4 text-sm">White days have free times. Struck-through days are fully booked; faded days are closed. You can book up to ' + RANGE_DAYS + ' days ahead.</p>';
  }
  function slotsPanel(ch) {
    var e = earliest(ch), todayIso = iso(startOfToday()), out = '';
    out += e ? '<div class="border-4 border-ink bg-lime p-4 text-ink"><p class="' + MONO + '">Earliest available</p><p class="mt-1 font-display text-xl font-black uppercase">' + (e.date === todayIso ? 'Today' : UI.esc(longDate(e.date))) + ' \u00B7 ' + UI.esc(e.slot.label) + '</p><button type="button" data-earliest class="' + UI.cls.btnInk + ' mt-3 !px-4 !py-2.5 text-xs">Take this slot</button></div>' : '<p class="border-4 border-ink bg-white p-4 font-medium">No free slots in the next ' + RANGE_DAYS + ' days. Please call the desk on ' + UI.esc(SITE.contact.phone.display) + '.</p>';
    if (!state.date) return out + '<p class="mt-6 text-lg">Choose a day on the calendar to see the times.</p>';
    var sl = slotsFor(ch, state.date), free = sl.filter(function (x) { return !x.booked; }).length;
    return out + '<h4 class="mt-6 font-display text-xl font-black uppercase">' + UI.esc(longDate(state.date)) + '</h4><p id="slot-count" aria-live="polite" class="mt-1 font-mono text-sm font-bold">' + free + ' of ' + sl.length + ' times free</p><div role="group" aria-label="Available times" class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">' + sl.map(function (s) {
      var on = state.time === s.time;
      return '<button type="button" data-slot="' + s.time + '"' + (s.booked ? ' disabled' : ' aria-pressed="' + on + '"') + ' class="min-h-[3rem] border-4 border-ink px-2 py-2 font-mono text-sm font-bold ' + (s.booked ? 'bg-concrete-100 text-ink line-through' : on ? 'bg-ink text-lime' : 'bg-white text-ink hover:bg-lime') + ' focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra">' + UI.esc(s.label) + (s.booked ? '<span class="block text-[11px] font-normal">Booked</span>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function step3() {
    var ch = getCh(state.chamber); if (!ch) return '<p class="text-lg">Please choose a chamber first.</p><button type="button" data-goto="2" class="' + UI.cls.btnInk + ' mt-4">Back to chambers</button>';
    return '<p class="mb-6 flex items-start gap-3 font-medium">' + UI.icon(ch.mode === 'online' ? 'video' : 'map-pin', 'mt-0.5 h-5 w-5 shrink-0') + '<span>' + UI.esc(ch.chamberName) + ' \u00B7 ' + ch.schedule.map(function (s) { return UI.esc(s.label + ' ' + s.hours); }).join(' \u00B7 ') + ' \u00B7 ' + ch.slotMinutes + '-minute visits</span></p>' +
      '<div class="grid gap-8 lg:grid-cols-[1.1fr_1fr]"><div data-cal-area class="border-4 border-ink bg-white p-4 md:p-5">' + calendar(ch) + '</div><div data-slot-area>' + slotsPanel(ch) + '</div></div>' + errLine('datetime');
  }
  function step4() {
    var d = state.details, fam = d.bookingFor === 'Family member';
    return '<p class="mb-6 max-w-2xl">These details are only used to arrange your visit. Fields marked with a star are required.</p><div class="grid gap-6 md:grid-cols-2">' +
      UI.field({ label: 'Patient\u2019s full name', name: 'fullName', required: true, autocomplete: 'name', value: d.fullName, hint: 'As it appears on official papers, for example Nusrat Jahan.' }) +
      UI.field({ label: 'Age', name: 'age', type: 'number', required: true, min: 1, max: 110, value: d.age, hint: 'Between 1 and 110 years.' }) +
      '<div class="md:col-span-2">' + group('Gender', 'gender', ['Female', 'Male', 'Another gender', 'Prefer not to say'], d.gender) + '</div>' +
      UI.field({ label: 'Mobile number', name: 'phone', type: 'tel', required: true, validate: 'bd-phone', autocomplete: 'tel', value: d.phone, hint: 'For example 01712-345678. We use it to confirm your booking.' }) +
      UI.field({ label: 'Email (optional)', name: 'email', type: 'email', autocomplete: 'email', value: d.email, hint: 'For reminders and the online video link.' }) +
      UI.field({ label: 'Area you live in', name: 'area', required: true, autocomplete: 'address-level2', value: d.area, hint: 'For example Uttara, Mirpur or Chattogram.' }) +
      '<div class="md:col-span-2">' + group('Who is this booking for?', 'bookingFor', ['Myself', 'Family member'], d.bookingFor) + '</div>' +
      '<div data-relation class="md:col-span-2' + (fam ? '' : ' hidden') + '">' + UI.field({ label: 'Your relationship to the patient', name: 'patientRelation', required: true, value: d.patientRelation, hint: 'For example mother, husband or friend.' }) + '</div>' +
      '<div class="md:col-span-2">' + UI.field({ label: 'What would you like help with?', name: 'concern', type: 'textarea', required: true, minlength: 15, rows: 5, value: d.concern, hint: 'You do not need to tell us everything now. A few honest lines are enough. The doctor will ask the rest in person.' }) + '</div>' +
      '<div class="md:col-span-2">' + group('Best way to reach you', 'preferredContact', ['Phone', 'WhatsApp', 'Email'], d.preferredContact) + '</div>' +
      '<div class="md:col-span-2">' + UI.field({ type: 'checkbox', name: 'consent', required: true, labelHTML: 'I agree that the clinic may use these details to arrange my appointment and contact me. I understand that appointments are not for emergencies.' }) + '</div></div>';
  }
  function step5() {
    var ch = getCh(state.chamber), d = state.details, t = typeOf(state.type);
    return '<dl class="divide-y-4 divide-ink border-4 border-ink bg-white">' + row('Visit', UI.esc(t.title), 1) + row('Service', UI.esc(svcName(state.service)), 1) + row('Chamber', UI.esc(ch ? ch.chamberName + ' \u00B7 ' + (ch.mode === 'online' ? 'Online' : ch.address) : ''), 2) +
      row('When', UI.esc(longDate(state.date)) + ' \u00B7 ' + UI.esc(state.time ? fmt(state.time) : ''), 3) +
      row('Patient', UI.esc(d.fullName) + ', ' + UI.esc(d.age) + ' \u00B7 ' + UI.esc(d.gender) + '<span class="block text-sm font-normal">' + UI.esc(d.phone) + (d.email ? ' \u00B7 ' + UI.esc(d.email) : '') + ' \u00B7 ' + UI.esc(d.area) + '</span>', 4) +
      row('Booked by', UI.esc(d.bookingFor === 'Family member' ? 'Family member (' + d.patientRelation + ')' : 'The patient') + '<span class="block text-sm font-normal">Prefers: ' + UI.esc(d.preferredContact) + '</span>', 4) + row('Concern', '<span class="font-normal">' + UI.esc(d.concern) + '</span>', 4) +
      row('Fee', '<span class="font-display text-2xl font-black">' + (ch ? UI.formatBDT(feeFor(ch)) : '') + '</span><span class="block text-sm font-normal">Paid after your visit. Nothing is charged online.</span>') + '</dl>' +
      '<fieldset class="mt-8 min-w-0"><legend class="mb-3 ' + MONO + '">How would you like to pay? (preference only)</legend><div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">' + PAYMENTS.map(function (p) { return chip('payment', p.v, p.l, state.payment === p.v); }).join('') + '</div>' + errLine('payment') + '</fieldset>' +
      '<p class="mt-8 flex items-start gap-3 border-4 border-ink bg-concrete p-4 text-sm">' + UI.icon('info', 'mt-0.5 h-5 w-5 shrink-0') + '<span>You can change or cancel free of charge up to 12 hours before your slot. Call ' + UI.esc(SITE.contact.phone.display) + ' or message us on WhatsApp. Please cancel early so another patient can have the time.</span></p>';
  }
  var RENDER = [null, step1, step2, step3, step4, step5];

  /* ---------- summary (mobile accordion + sticky aside) ---------- */
  function sumRow(label, v) { return '<div class="py-3"><dt class="' + MONO + '">' + label + '</dt><dd class="mt-1 font-bold">' + (v ? UI.esc(v) : '<span class="font-normal italic">Not chosen yet</span>') + '</dd></div>'; }
  function summaryHTML() {
    var ch = getCh(state.chamber), d = SITE.doctor;
    return '<dl class="divide-y-4 divide-ink">' + sumRow('Visit', typeOf(state.type).title) + sumRow('Service', svcName(state.service)) + sumRow('Chamber', ch ? ch.chamberName : '') + sumRow('Date', state.date ? longDate(state.date) : '') + sumRow('Time', state.time ? fmt(state.time) : '') + sumRow('Fee', ch ? UI.formatBDT(feeFor(ch)) : '') + '</dl>' +
      '<div class="mt-4 flex items-center gap-4 border-4 border-ink bg-concrete p-3"><span class="block h-20 w-20 shrink-0 overflow-hidden border-4 border-ink bg-white">' + UI.img(SITE.img.portrait, 'Portrait of ' + d.name, 'h-full w-full object-cover', { w: 160, h: 160 }) + '</span><span class="min-w-0"><b class="block font-display text-base font-black uppercase leading-tight">' + UI.esc(d.shortName) + '</b><span class="block text-xs">' + UI.esc(d.title) + '</span><span class="block font-mono text-[11px] font-bold">BMDC ' + UI.esc(d.bmdcNo) + '</span></span></div>' +
      '<div class="mt-4 flex flex-wrap gap-3"><a href="tel:' + SITE.contact.phone.e164 + '" class="' + UI.cls.btnOutline + ' !px-3 !py-2.5 text-xs">' + UI.icon('phone', 'h-4 w-4') + 'Call</a><a href="' + SITE.contact.whatsappUrl + '" target="_blank" rel="noopener noreferrer" class="' + UI.cls.btnOutline + ' !px-3 !py-2.5 text-xs">' + UI.icon('message-circle', 'h-4 w-4') + 'WhatsApp</a></div>' +
      '<div class="mt-5">' + UI.sticker('Strictly confidential', { rotate: '-rotate-2' }) + '</div>';
  }
  function refreshSummary() { UI.qsa('[data-summary]').forEach(function (el) { el.innerHTML = summaryHTML(); }); }

  /* ---------- wizard shell ---------- */
  var mount, form;
  function $(id) { return document.getElementById(id); }
  function announce(t) { var l = $('booking-live'); if (l) l.textContent = t; }
  function renderIndicator() {
    $('step-list').innerHTML = STEPS.map(function (s) {
      var done = s.n < state.step, cur = s.n === state.step, tone = cur ? 'bg-ink text-lime' : done ? 'bg-lime text-ink' : 'bg-white text-ink';
      var inner = '<span class="flex h-11 w-11 items-center justify-center border-4 border-ink font-mono text-sm font-black ' + tone + '">' + (done ? UI.icon('check', 'h-5 w-5') : s.n) + '</span><span class="hidden text-center ' + MONO + ' !text-[11px] sm:block">' + UI.esc(s.label) + '</span><span class="sr-only">Step ' + s.n + ': ' + UI.esc(s.label) + (done ? ' (completed)' : '') + '</span>';
      return '<li' + (cur ? ' aria-current="step"' : '') + ' class="flex justify-center">' + (done ? '<button type="button" data-goto="' + s.n + '" class="flex flex-col items-center gap-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra">' + inner + '</button>' : '<span class="flex flex-col items-center gap-1">' + inner + '</span>') + '</li>';
    }).join('');
    var bar = $('step-bar'), pg = $('step-progress'); WIDTH.forEach(function (w) { bar.classList.remove(w); }); bar.classList.add(WIDTH[state.step - 1]); pg.setAttribute('aria-valuenow', String(state.step));
  }
  function renderStep(focus) {
    var s = STEPS[state.step - 1];
    $('step-body').innerHTML = '<div class="motion-safe:animate-cut"><p class="' + MONO + '">Step ' + s.n + ' of 5</p><h3 id="step-title" tabindex="-1" class="mb-6 mt-2 ' + UI.cls.h3 + ' focus:outline-none">' + UI.esc(s.title) + '</h3>' + RENDER[state.step]() + '</div>';
    renderIndicator(); showError('');
    var back = $('btn-back'), next = $('btn-next');
    back.classList.toggle('invisible', state.step === 1);
    next.innerHTML = (state.step === 5 ? 'Confirm booking' : 'Continue') + UI.icon(state.step === 5 ? 'check' : 'arrow-right', 'h-5 w-5');
    next.disabled = false; syncRelation(); refreshSummary();
    if (focus) { var t = $('step-title'); if (t) t.focus(); announce('Step ' + s.n + ' of 5: ' + s.title); form.scrollIntoView(); }
  }
  function showError(msg) { var p = $('step-error'); if (!p) return; p.textContent = msg; p.classList.toggle('hidden', !msg); }
  function syncRelation() {
    var wrap = mount.querySelector('[data-relation]'); if (!wrap) return;
    var fam = state.details.bookingFor === 'Family member', input = wrap.querySelector('input'); wrap.classList.toggle('hidden', !fam); if (input) input.disabled = !fam;
  }
  function val(n) { var e = form.querySelector('[name="' + n + '"]:checked'); return e ? e.value : null; }
  function collect() {
    var d = state.details, v;
    if (state.step === 1) { if ((v = val('visitType'))) state.type = v; if ((v = val('service'))) state.service = v; }
    if (state.step === 2 && (v = val('chamber'))) { if (v !== state.chamber) { state.chamber = v; } }
    if (state.step === 4) {
      ['fullName', 'age', 'phone', 'email', 'area', 'patientRelation', 'concern'].forEach(function (n) { var e = form.querySelector('[name="' + n + '"]'); if (e) d[n] = e.value; });
      ['gender', 'bookingFor', 'preferredContact'].forEach(function (n) { if ((v = val(n))) d[n] = v; });
      var c = form.querySelector('[name="consent"]'); if (c) d.consent = c.checked;
    }
    if (state.step === 5 && (v = val('payment'))) state.payment = v;
    reconcile(); save();
  }
  function validate() {
    showError('');
    if (state.step === 3) {
      var ch = getCh(state.chamber), msg = '';
      if (!state.date) msg = 'Choose a day from the calendar.'; else if (!state.time) msg = 'Choose a time for ' + longDate(state.date) + '.'; else if (!ch || dayState(ch, state.date) === 'out') msg = 'That day is no longer available. Please pick another.';
      var p = $('err-datetime'); if (p) { p.textContent = msg; p.classList.toggle('hidden', !msg); }
      if (msg) announce(msg); return !msg;
    }
    var ok = UI.validateForm(form), age = form.querySelector('[name="age"]');
    if (age && !age.disabled && age.value) { var a = parseInt(age.value, 10), m = form.querySelector('[data-error-for="age"]'); if (isNaN(a) || a < 1 || a > 110) { age.setAttribute('aria-invalid', 'true'); if (m) { m.textContent = 'Enter an age between 1 and 110.'; m.classList.remove('hidden'); } age.focus(); ok = false; } }
    if (!ok) showError('Please check the highlighted fields.');
    return ok;
  }
  function go(n) { state.step = Math.max(1, Math.min(5, n)); reconcile(); save(); renderStep(true); }

  /* ---------- calendar & slots interaction ---------- */
  function redraw3(focusSel) {
    var ch = getCh(state.chamber); if (!ch) return;
    mount.querySelector('[data-cal-area]').innerHTML = calendar(ch); mount.querySelector('[data-slot-area]').innerHTML = slotsPanel(ch); refreshSummary();
    var f = focusSel && mount.querySelector(focusSel); if (f) f.focus();
  }
  function pickDate(ds) {
    var ch = getCh(state.chamber); if (!ch || dayState(ch, ds) !== 'ok') { announce('That day is not available.'); return; }
    if (state.date !== ds) state.time = ''; state.date = ds; state.focusIso = ds; save(); redraw3('[data-date="' + ds + '"]');
    announce(longDate(ds) + ' selected. ' + $('slot-count').textContent + '.');
  }
  function moveFocus(from, key) {
    var d = parseISO(from), t = null, idx = (d.getDay() + 1) % 7;
    if (key === 'ArrowLeft') t = addDays(d, -1); else if (key === 'ArrowRight') t = addDays(d, 1); else if (key === 'ArrowUp') t = addDays(d, -7); else if (key === 'ArrowDown') t = addDays(d, 7);
    else if (key === 'Home') t = addDays(d, -idx); else if (key === 'End') t = addDays(d, 6 - idx);
    else if (key === 'PageUp') t = new Date(d.getFullYear(), d.getMonth() - 1, Math.min(d.getDate(), 28)); else if (key === 'PageDown') t = new Date(d.getFullYear(), d.getMonth() + 1, Math.min(d.getDate(), 28));
    if (!t) return false;
    var tm = startOfToday(), mx = addDays(tm, RANGE_DAYS - 1); if (t < tm) t = tm; if (t > mx) t = mx;
    state.focusIso = iso(t); state.view = { y: t.getFullYear(), m: t.getMonth() }; redraw3('[data-date="' + state.focusIso + '"]'); return true;
  }

  /* ---------- submit, confirmation, ics ---------- */
  function payload() {
    var ch = getCh(state.chamber), d = state.details, fam = d.bookingFor === 'Family member';
    return { type: state.type, serviceSlug: state.service === GENERAL ? null : state.service, chamberSlug: state.chamber, date: state.date, time: state.time, slotMinutes: ch.slotMinutes, timezone: 'Asia/Dhaka', feeBDT: feeFor(ch), paymentPreference: state.payment,
      patient: { fullName: d.fullName.trim(), age: parseInt(d.age, 10), gender: d.gender, phone: d.phone.replace(/[\s-]/g, ''), email: d.email.trim() || null, area: d.area.trim() },
      bookingFor: fam ? 'family' : 'self', relationship: fam ? d.patientRelation.trim() : null, concern: d.concern.trim(), preferredContact: d.preferredContact.toLowerCase(), consent: true, submittedAt: new Date().toISOString() };
  }
  function makeRef(id) { var t = new Date(); return 'PSY-' + String(t.getFullYear()).slice(2) + pad(t.getMonth() + 1) + pad(t.getDate()) + '-' + String(id || '').replace(/[^A-Za-z0-9]/g, '').slice(-4).toUpperCase().padStart(4, '0'); }
  function submit() {
    if (state.submitting) return; state.submitting = true;
    var btn = $('btn-next'); btn.disabled = true; btn.textContent = 'Confirming\u2026'; announce('Confirming your booking.');
    var p = payload();
    SITE.submit('appointment', p).then(function (res) { state.submitting = false; done(res, p); }).catch(function () { state.submitting = false; btn.disabled = false; renderStep(false); UI.toast('Something went wrong. Please try again.', 'error'); });
  }
  function icsEsc(s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n'); }
  function icsStamp(dateIso, hhmm, plus) { var m = toMin(hhmm) + (plus || 0), d = parseISO(dateIso); return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + 'T' + pad(Math.floor(m / 60)) + pad(m % 60) + '00'; }
  function buildICS(ref, p) {
    var ch = getCh(p.chamberSlug), z = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z'), online = ch.mode === 'online';
    var desc = 'Reference ' + ref + '. ' + (online ? 'The video link arrives on WhatsApp or email 30 minutes before.' : 'Please arrive 10 minutes early.') + ' Call ' + SITE.contact.phone.display + ' to change or cancel. Not for emergencies: call 999.';
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Dr. Rashed Anwar Khan//Appointments//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VTIMEZONE', 'TZID:Asia/Dhaka', 'BEGIN:STANDARD', 'DTSTART:19700101T000000', 'TZOFFSETFROM:+0600', 'TZOFFSETTO:+0600', 'TZNAME:+06', 'END:STANDARD', 'END:VTIMEZONE',
      'BEGIN:VEVENT', 'UID:' + ref + '@drrashedkhan.com', 'DTSTAMP:' + z, 'DTSTART;TZID=Asia/Dhaka:' + icsStamp(p.date, p.time), 'DTEND;TZID=Asia/Dhaka:' + icsStamp(p.date, p.time, p.slotMinutes), 'SUMMARY:' + icsEsc('Appointment with ' + SITE.doctor.shortName), 'LOCATION:' + icsEsc(online ? 'Online video consultation' : ch.address), 'DESCRIPTION:' + icsEsc(desc),
      'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', 'DESCRIPTION:Appointment in one hour', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  }
  function downloadICS(ref, p) {
    if (!window.Blob || !window.URL || !URL.createObjectURL) { UI.toast('Calendar download is not supported in this browser.', 'info'); return; }
    var url = URL.createObjectURL(new Blob([buildICS(ref, p)], { type: 'text/calendar;charset=utf-8' })), a = document.createElement('a');
    a.href = url; a.download = 'appointment-' + ref + '.ics'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function shareText(ref, p) { var ch = getCh(p.chamberSlug); return 'My appointment with ' + SITE.doctor.shortName + ': ' + longDate(p.date) + ', ' + fmt(p.time) + ', ' + ch.chamberName + '. Reference ' + ref + '. ' + SITE.brand.domain; }
  function confirmHTML(ref, p) {
    var ch = getCh(p.chamberSlug), online = ch.mode === 'online', d = state.details;
    var info = function (l, v) { return '<div class="flex flex-wrap gap-3 p-4"><dt class="w-32 shrink-0 ' + MONO + '">' + l + '</dt><dd class="min-w-0 flex-1 font-medium">' + v + '</dd></div>'; };
    return '<div id="confirmation" data-component="BookingConfirmation" class="border-4 border-ink bg-white p-5 text-ink shadow-hard md:p-10"><div data-reveal="stamp" class="inline-block -rotate-2 border-4 border-ink bg-lime px-6 py-3 font-display text-4xl font-black uppercase shadow-hard-sm md:text-6xl">Booked</div>' +
      '<h3 id="confirm-title" tabindex="-1" class="mt-8 ' + UI.cls.h3 + ' focus:outline-none">Your appointment is confirmed</h3><p class="mt-3 max-w-2xl text-lg">Thank you, ' + UI.esc(d.fullName.split(' ')[0]) + '. The appointment desk will message you on ' + UI.esc(d.preferredContact) + ' within a few hours. ' + UI.esc(SITE.contact.deskHours) + '.</p>' +
      '<div class="mt-8 flex flex-wrap items-center gap-4 border-4 border-ink bg-concrete p-4"><div><p class="' + MONO + '">Reference</p><p id="booking-ref" class="font-mono text-3xl font-black md:text-5xl">' + UI.esc(ref) + '</p></div><button type="button" data-action="copy" class="' + UI.cls.btnWhite + ' !shadow-hard !px-4 !py-2.5 text-xs">' + UI.icon('copy', 'h-4 w-4') + 'Copy</button></div>' +
      (online ? '<p class="mt-6 flex items-start gap-3 border-4 border-ink bg-ultra p-4 font-medium text-white">' + UI.icon('video', 'mt-0.5 h-5 w-5 shrink-0') + '<span>This is an online visit. The video link arrives on WhatsApp or email 30 minutes before your appointment.</span></p>' : '<p class="mt-6 flex items-start gap-3 border-4 border-ink bg-lime p-4 font-medium">' + UI.icon('map-pin', 'mt-0.5 h-5 w-5 shrink-0') + '<span>Please arrive ten minutes early at ' + UI.esc(ch.name) + ', ' + UI.esc(ch.address) + '.</span></p>') +
      '<dl class="mt-6 divide-y-4 divide-ink border-4 border-ink">' + info('When', UI.esc(longDate(p.date)) + ' \u00B7 ' + UI.esc(fmt(p.time))) + info('Where', UI.esc(ch.chamberName)) + info('Service', UI.esc(svcName(state.service))) + info('Patient', UI.esc(p.patient.fullName)) + info('Fee', UI.formatBDT(p.feeBDT) + ' \u00B7 ' + UI.esc((PAYMENTS.filter(function (x) { return x.v === p.paymentPreference; })[0] || PAYMENTS[0]).l)) + '</dl>' +
      '<div class="mt-8 flex flex-wrap gap-4"><button type="button" data-action="ics" class="' + UI.cls.btnLime + '">' + UI.icon('calendar', 'h-5 w-5') + 'Add to calendar</button><button type="button" data-action="print" class="' + UI.cls.btnWhite + ' !shadow-hard">' + UI.icon('printer', 'h-5 w-5') + 'Print</button><a href="https://wa.me/?text=' + encodeURIComponent(shareText(ref, p)) + '" target="_blank" rel="noopener noreferrer" class="' + UI.cls.btnWhite + ' !shadow-hard">' + UI.icon('share', 'h-5 w-5') + 'Share on WhatsApp</a><button type="button" data-action="again" class="' + UI.cls.btnInk + '">Book another</button></div>' +
      '<p class="mt-8 flex items-start gap-3 border-t-4 border-ink pt-5 text-sm">' + UI.icon('alert-circle', 'mt-0.5 h-5 w-5 shrink-0') + '<span>Appointments are not for emergencies. If you or someone near you is in immediate danger, call ' + UI.esc(SITE.contact.nationalEmergency) + ' or go to the nearest hospital emergency department.</span></p></div>';
  }
  function wrapMode(confirmed) {
    UI.qsa('[data-summary-wrap]').forEach(function (e) { e.classList.toggle('!hidden', confirmed); });
    var g = $('booking-grid'); if (g) g.classList.toggle('lg:grid-cols-[minmax(0,1fr)_24rem]', !confirmed);
  }
  function done(res, p) {
    var ref = makeRef(res && res.id); state.done = { ref: ref, payload: p }; clearSaved(); wrapMode(true);
    mount.innerHTML = confirmHTML(ref, p); UI.mount(mount); var t = $('confirm-title'); if (t) t.focus(); announce('Booking confirmed. Reference ' + ref + '.'); mount.scrollIntoView();
  }
  function reset() {
    state.step = 1; state.type = 'new'; state.service = ''; state.chamber = ''; state.date = ''; state.time = ''; state.payment = 'chamber'; state.done = null; state.focusIso = '';
    var d = state.details; Object.keys(d).forEach(function (k) { d[k] = k === 'bookingFor' ? 'Myself' : k === 'preferredContact' ? 'Phone' : k === 'consent' ? false : ''; });
    var b = startOfToday(); state.view = { y: b.getFullYear(), m: b.getMonth() }; wrapMode(false); build(); renderStep(true);
  }

  /* ---------- build & events ---------- */
  function build() {
    var ghost = UI.cls.btnOutline + ' !bg-white';
    mount.innerHTML = '<form id="booking-form" novalidate aria-label="Appointment booking" data-component="BookingWizard" class="border-4 border-ink bg-white text-ink shadow-hard"><div class="border-b-4 border-ink bg-concrete p-4 md:p-6"><ol id="step-list" class="grid grid-cols-5 gap-2"></ol>' +
      '<div id="step-progress" role="progressbar" aria-label="Booking progress" aria-valuemin="0" aria-valuemax="5" aria-valuenow="1" class="mt-4 border-4 border-ink bg-white"><div id="step-bar" class="h-4 bg-lime transition-all duration-300"></div></div></div>' +
      '<div id="step-body" class="p-5 md:p-8"></div><p id="step-error" role="alert" class="mx-5 mb-4 hidden border-4 border-ink bg-alert p-3 font-mono text-sm font-bold text-white md:mx-8"></p>' +
      '<div class="flex flex-wrap items-center justify-between gap-4 border-t-4 border-ink bg-concrete p-4 md:p-6"><button type="button" id="btn-back" class="' + ghost + '">' + UI.icon('arrow-left', 'h-5 w-5') + 'Back</button><button type="submit" id="btn-next" class="' + UI.cls.btnLime + ' disabled:opacity-60">Continue</button></div></form><p id="booking-live" class="sr-only" aria-live="polite"></p>';
    form = $('booking-form');
  }
  function bind() {
    mount.addEventListener('submit', function (e) { e.preventDefault(); if (!form || e.target !== form) return; collect(); if (!validate()) return; if (state.step < 5) go(state.step + 1); else submit(); });
    mount.addEventListener('change', function (e) {
      var n = e.target && e.target.name; if (!n || !form) return; collect(); showError('');
      if (n === 'bookingFor') syncRelation();
      refreshSummary();
    });
    mount.addEventListener('input', UI.debounce(function (e) { if (form && e.target && e.target.name) { collect(); refreshSummary(); } }, 250));
    mount.addEventListener('click', function (e) {
      var t = e.target.closest('[data-goto],[data-date],[data-slot],[data-cal],[data-earliest],[data-action],#btn-back'); if (!t || !mount.contains(t)) return;
      if (t.id === 'btn-back') { collect(); go(state.step - 1); return; }
      if (t.hasAttribute('data-goto')) { collect(); go(parseInt(t.getAttribute('data-goto'), 10) || 1); return; }
      if (t.hasAttribute('data-date')) { pickDate(t.getAttribute('data-date')); return; }
      if (t.hasAttribute('data-slot')) { state.time = t.getAttribute('data-slot'); save(); redraw3('[data-slot="' + state.time + '"]'); announce(fmt(state.time) + ' selected.'); return; }
      if (t.hasAttribute('data-cal')) { var b = viewBounds(), idx = state.view.y * 12 + state.view.m + parseInt(t.getAttribute('data-cal'), 10); if (idx < b.first || idx > b.last) return; state.view = { y: Math.floor(idx / 12), m: idx % 12 }; state.focusIso = ''; redraw3(null); return; }
      if (t.hasAttribute('data-earliest')) { var ch = getCh(state.chamber), er = earliest(ch); if (er) { state.date = er.date; state.time = er.slot.time; state.focusIso = er.date; var pd = parseISO(er.date); state.view = { y: pd.getFullYear(), m: pd.getMonth() }; save(); redraw3('[data-slot="' + er.slot.time + '"]'); announce(longDate(er.date) + ', ' + er.slot.label + ' selected.'); } return; }
      var a = t.getAttribute('data-action');
      if (a === 'ics' && state.done) downloadICS(state.done.ref, state.done.payload); else if (a === 'print') window.print(); else if (a === 'copy' && state.done) UI.copy(state.done.ref); else if (a === 'again') reset();
    });
    mount.addEventListener('keydown', function (e) { var t = e.target.closest ? e.target.closest('[data-date]') : null; if (!t) return; if (moveFocus(t.getAttribute('data-date'), e.key)) e.preventDefault(); });
  }
  function afterSection() {
    var steps = [['Confirmed', 'The desk checks your slot and messages you the same day.'], ['Reminded', 'You get a reminder the evening before. Online visits also get the video link 30 minutes ahead.'], ['Seen', 'You sit down with Dr. Rashed for a full 30 minutes. Nobody rushes you.']];
    return '<section id="after" data-section="after" class="' + UI.cls.secInk + ' overflow-x-clip"><div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-6 overflow-x-clip select-none"><p data-scroll-x="0.4" class="whitespace-nowrap font-display text-[20vw] font-black uppercase leading-none ' + UI.cls.outline + ' opacity-25">Book \u00B7 Confirm \u00B7 Visit \u00B7 Book \u00B7 Confirm \u00B7 Visit</p></div><div aria-hidden="true" data-parallax="0.2" data-parallax-rotate="25" class="pointer-events-none absolute -right-6 bottom-24 hidden w-40 md:block">' + UI.deco(SITE.img.objects.sun, 'w-full') + '</div><div class="' + UI.cls.container + ' relative">' +
      UI.sectionHead({ index: '02', eyebrow: 'After you book', title: 'What happens *next*', tone: 'dark', lead: 'Three plain steps, nothing hidden. If anything changes, call ' + SITE.contact.phone.display + ' and the desk will move your slot.' }) +
      '<div class="mt-12 grid gap-6 md:grid-cols-3">' + steps.map(function (s, i) { return '<div data-reveal="stamp" data-delay="' + (i * 150) + '" class="border-4 border-ink bg-white p-6 text-ink shadow-hard-lime"><p class="font-display text-6xl font-black leading-none">' + UI.pad(i + 1) + '</p><h3 class="mt-4 ' + UI.cls.h3 + '">' + s[0] + '</h3><p class="mt-3 leading-relaxed">' + UI.esc(s[1]) + '</p></div>'; }).join('') + '</div></div></section>' +
      UI.tape(['Book online', 'Confirmed same day', 'Private by default', 'Sat \u2013 Thu'], { tone: 'lime', rotate: '-rotate-1' });
  }

  UI.ready(function () {
    document.getElementById('hero-mount').innerHTML = UI.pageHero({
      index: '05', eyebrow: 'Appointment', title: 'Book a visit in *five steps*', tone: 'ultra',
      lead: 'Choose what you need, where you would like to be seen, and a time that suits you. It takes about three minutes and nothing is charged online.',
      crumbs: [{ label: 'Home', href: SITE.routes.home }, { label: 'Appointment' }]
    });
    mount = $('wizard-mount'); if (!mount) return;
    load(); build(); bind();
    $('summary-mobile-mount').innerHTML = '<div data-accordion data-summary-wrap class="mb-8 lg:hidden">' + UI.faqItem({ id: 'summary', question: 'Your booking summary', answerHTML: '<div data-summary></div>', tone: 'light' }) + '</div>';
    $('summary-mount').innerHTML = '<aside data-summary-wrap aria-label="Booking summary" class="hidden lg:block"><div class="border-4 border-ink bg-white p-5 text-ink shadow-hard lg:sticky lg:top-28"><h3 class="' + UI.cls.h3 + ' mb-3">Your booking</h3><div data-summary></div></div></aside>';
    $('after-mount').outerHTML = afterSection();
    renderStep(false); UI.mount(document.getElementById('main'));
  });
})();
