/*
 * js/pages/about.js — About page script
 * Path: js/pages/about.js · Owner: Part 2 · Purpose: renders hero, numbers, sticky career timeline, approach, credentials, first-visit steps and CTA
 * Depends on: SITE, UI, FX (shared kit) · Exposes: nothing
 */
(function () {
  'use strict';

  /* Data shaped like DB records (career_milestones, principles, credentials, visit_steps). */
  var MILESTONES = [
    { id: 'ms-001', year: 2006, title: 'MBBS, Sir Salimullah Medical College', text: 'Graduates in medicine in Dhaka and chooses psychiatry after a final-year placement that shows how little patients were being heard.' },
    { id: 'ms-002', year: 2007, title: 'Internship and first wards', text: 'Rotates through medicine, surgery and paediatrics, then spends months on a psychiatric ward learning that calm, patient listening is a clinical skill.' },
    { id: 'ms-003', year: 2008, title: 'MD residency in Psychiatry, BSMMU', text: 'Begins specialist training at BSMMU, working in the outpatient department, the emergency room and the inpatient unit under senior teachers.' },
    { id: 'ms-004', year: 2012, title: 'FCPS in Psychiatry', text: 'Completes the fellowship examination and starts independent practice, with a rule he still keeps: no patient leaves without understanding the plan.' },
    { id: 'ms-005', year: 2013, title: 'First consultant post', text: 'Joins a Dhaka hospital as a consultant, building a service for depression, anxiety and sleep problems that families could reach without shame.' },
    { id: 'ms-006', year: 2017, title: 'Postgraduate Certificate in CBT, London', text: 'Studies Cognitive Behavioural Therapy in London and returns to Dhaka to offer structured talking therapy alongside medical care.' },
    { id: 'ms-007', year: 2021, title: 'Associate Professor of Psychiatry', text: 'Takes up an associate professorship, teaching junior doctors how to take a careful history and how to explain a diagnosis in plain Bangla.' },
    { id: 'ms-008', year: 2026, title: 'The 18,000th patient', text: 'Passes eighteen thousand patients treated across the Gulshan and Bashundhara chambers and online, a number he counts as eighteen thousand conversations.' }
  ];
  var PRINCIPLES = [
    { id: 'pr-001', icon: 'message-circle', title: 'Listen first', bg: 'bg-lime', text: 'The first part of every visit belongs to you. He asks, waits and asks again before suggesting anything, because a diagnosis made in a hurry is usually made twice.' },
    { id: 'pr-002', icon: 'book-open', title: 'Explain plainly', bg: 'bg-white', text: 'No jargon without a translation. You leave knowing what the condition is, what the plan is, how long it takes and what to do if you feel worse.' },
    { id: 'pr-003', icon: 'target', title: 'Treat proportionately', bg: 'bg-lilac', text: 'Mild problems get simple help. Medicine is used when it clearly adds benefit and therapy when it can do more than a tablet. Nothing is added without a reason you can repeat to your family.' },
    { id: 'pr-004', icon: 'check-circle', title: 'Follow through', bg: 'bg-tang', text: 'Every plan has a review date. If a medicine does not suit you or progress is slow, the plan changes, and you always know how to reach the desk between visits.' }
  ];
  var CREDS = {
    memberships: ['Bangladesh Society of Clinical Psychiatry', 'Dhaka Association for Cognitive Behavioural Therapy', 'South Asian Forum on Mood and Anxiety Disorders', 'Bangladesh Society for Addiction Medicine'],
    publications: [
      { title: 'Sleep disturbance and depressive symptoms among university students in Dhaka', source: 'Bangladesh Journal of Psychiatry', year: 2015 },
      { title: 'Group CBT for panic and generalised anxiety in an urban outpatient clinic', source: 'South Asian Journal of Mental Health', year: 2018 },
      { title: 'Family psychoeducation and relapse in bipolar disorder: a clinic-based follow-up', source: 'Bangladesh Journal of Psychiatry', year: 2020 },
      { title: 'Attitudes to seeking help for depression among adults in urban Bangladesh', source: 'South Asian Journal of Mental Health', year: 2023 }
    ],
    awards: [
      { title: 'Best Oral Presentation, National Psychiatry Conference', year: 2015 },
      { title: 'Excellence in Clinical Teaching, Department of Psychiatry', year: 2019 },
      { title: 'Mental Health Advocacy Award, Dhaka Medical Forum', year: 2022 }
    ]
  };
  var VISIT_STEPS = [
    { id: 'vs-001', title: 'Book your slot', text: 'Choose a chamber or an online session on the appointment page, or message the desk. You receive a confirmation on WhatsApp or email with directions or your video link.' },
    { id: 'vs-002', title: 'Arrive and settle', text: 'Reach the chamber ten minutes early. A short form asks for your name, contact details and the main reason for your visit. Nothing else is needed at the front desk.' },
    { id: 'vs-003', title: 'Talk, without hurry', text: 'The doctor listens first: what has been happening, since when, and how it affects sleep, work, appetite and family life. You can pause, or skip any question you are not ready for.' },
    { id: 'vs-004', title: 'Agree a plan', text: 'He explains what he thinks is happening, in plain words, and sets out the options: therapy, medicine, lifestyle steps or careful watching. Nothing starts until you agree.' },
    { id: 'vs-005', title: 'Leave with a next step', text: 'You go home with a written plan, a review date and the desk number. If medicine is started, you are told what to expect in the first two weeks and when to call.' }
  ];

  function inject(mountId, sectionId, html) { document.getElementById(mountId).outerHTML = html; UI.mount(document.getElementById(sectionId)); }
  function sec(id, cls, inner) { return '<section id="' + id + '" data-section="' + id + '" class="' + cls + ' overflow-x-clip">' + inner + '</section>'; }
  function ghost(text, extra) { return '<div aria-hidden="true" data-parallax="-0.15" class="pointer-events-none absolute select-none font-display font-black leading-none ' + UI.cls.outline + ' ' + extra + '">' + UI.esc(text) + '</div>'; }

  function renderHero(d) {
    document.getElementById('hero-mount').innerHTML = UI.pageHero({
      index: '02', eyebrow: 'About the doctor', title: 'Meet the psychiatrist who *listens first*', tone: 'ultra',
      lead: d.name + ' is a consultant psychiatrist and associate professor in Dhaka. He treats mood, anxiety, sleep and addiction with respect, and without hurry.',
      crumbs: [{ label: 'Home', href: SITE.routes.home }, { label: 'About' }],
      actionsHTML: '<a href="' + SITE.routes.appointment + '" class="' + UI.cls.btnLime + '">Book Appointment' + UI.icon('arrow-right', 'h-5 w-5') + '</a><a href="tel:' + SITE.contact.phone.e164 + '" class="' + UI.cls.btnWhite + '">' + UI.icon('phone', 'h-5 w-5') + UI.esc(SITE.contact.phone.display) + '</a>'
    });
  }

  function renderNumbers(d) {
    var stats = [[d.experienceYears, 'Years in practice'], [d.patientsTreated, 'Patients treated'], [d.sessionsDelivered, 'Therapy sessions'], [d.satisfactionPercent, 'Patient satisfaction']];
    inject('numbers-mount', 'numbers', sec('numbers', UI.cls.secInk, ghost(String(d.experienceYears), 'right-0 top-2 text-[34vw] text-white/25 md:text-[24vw]') +
      '<div data-component="Numbers" class="' + UI.cls.container + ' relative">' + UI.sectionHead({ index: '02', eyebrow: 'By the numbers', title: 'Fourteen years of *steady* work', tone: 'dark' }) +
      '<div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">' + stats.map(function (s, i) { return UI.statBlock({ value: s[0], suffix: i === 3 ? '%' : '+', label: s[1], tone: 'dark', delay: i * 100 }); }).join('') + '</div></div>') +
      UI.tape(['Listen first', 'Explain plainly', 'Treat proportionately', 'Follow through'], { tone: 'ultra', rotate: '-rotate-1' }));
  }

  function renderTimeline() {
    var tops = ['top-28', 'top-[8rem]', 'top-[9rem]', 'top-[10rem]', 'top-[11rem]', 'top-[12rem]', 'top-[13rem]', 'top-[14rem]'];
    var tones = ['bg-white text-ink', 'bg-ink text-white', 'bg-ultra text-white', 'bg-concrete text-ink', 'bg-lilac text-ink', 'bg-white text-ink', 'bg-ink text-white', 'bg-tang text-ink'];
    var cards = MILESTONES.map(function (m, i) {
      return '<li class="sticky ' + tops[i % tops.length] + ' mb-6 last:mb-0"><article data-reveal="cut" class="grid border-4 border-ink shadow-hard md:grid-cols-[13rem_1fr] ' + tones[i % tones.length] + '">' +
        '<div class="flex items-center justify-between gap-3 border-b-4 border-ink p-5 md:flex-col md:items-start md:justify-between md:border-b-0 md:border-r-4"><span class="' + UI.cls.mono + '">Step ' + UI.pad(i + 1) + ' / ' + UI.pad(MILESTONES.length) + '</span><time datetime="' + m.year + '" class="font-mono text-5xl font-black leading-none md:text-6xl">' + m.year + '</time></div>' +
        '<div class="p-5 md:p-8"><h3 class="' + UI.cls.h3 + '">' + UI.esc(m.title) + '</h3><p class="mt-3 max-w-2xl leading-relaxed">' + UI.esc(m.text) + '</p></div></article></li>';
    }).join('');
    inject('timeline-mount', 'timeline', sec('timeline', UI.cls.secLime, '<div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-grid-ink [background-size:64px_64px]"></div>' + ghost('20', '-left-2 top-4 text-[40vw] text-ink/20 md:text-[26vw]') +
      '<div data-component="Timeline" class="' + UI.cls.container + ' relative">' + UI.sectionHead({ index: '03', eyebrow: 'The career so far', title: 'Twenty years, *eight* steps', lead: 'Each card stacks on the last as you scroll. Nothing here happened quickly, and that is the point.', tone: 'light' }) + '<ol class="mt-12 md:mt-16">' + cards + '</ol></div>'));
  }

  function renderApproach() {
    var cols = PRINCIPLES.map(function (p, i) {
      return '<li ' + (i % 2 ? 'data-parallax="-0.08"' : 'data-parallax="0.05"') + '><div data-reveal="slam" data-delay="' + i * 100 + '" class="h-full"><article class="flex h-full flex-col border-4 border-ink p-6 shadow-hard ' + p.bg + '"><div class="flex items-center justify-between"><span class="' + UI.cls.iconBox + ' bg-white">' + UI.icon(p.icon, 'h-6 w-6') + '</span><span class="font-mono text-4xl font-black">' + UI.pad(i + 1) + '</span></div><h3 class="mt-8 ' + UI.cls.h3 + '">' + UI.esc(p.title) + '</h3><p class="mt-4 leading-relaxed">' + UI.esc(p.text) + '</p></article></div></li>';
    }).join('');
    inject('approach-mount', 'approach', sec('approach', UI.cls.secWhite, '<div class="' + UI.cls.container + '" data-component="Approach">' + UI.sectionHead({ index: '04', eyebrow: 'How he works', title: 'Four rules in *every* room', lead: 'They are simple on purpose. Patients can check the care they receive against them.', tone: 'light' }) + '<ul class="mt-14 grid gap-8 pb-8 sm:grid-cols-2 lg:grid-cols-4">' + cols + '</ul></div>'));
  }

  function credCard(title, icon, body, delay) {
    return '<div data-reveal="cut" data-delay="' + delay + '" class="h-full"><div class="h-full border-4 border-ink bg-white p-6 text-ink shadow-hard-lime md:p-8"><div class="flex items-center gap-4 border-b-4 border-ink pb-4"><span class="' + UI.cls.iconBox + '">' + UI.icon(icon, 'h-6 w-6') + '</span><h3 class="' + UI.cls.h3 + '">' + UI.esc(title) + '</h3></div>' + body + '</div></div>';
  }
  function renderCredentials(d) {
    var li = function (t, sub) { return '<li class="border-b-4 border-ink py-3 last:border-b-0"><span class="block font-bold">' + UI.esc(t) + '</span>' + (sub ? '<span class="mt-1 block font-mono text-xs uppercase tracking-wider">' + UI.esc(sub) + '</span>' : '') + '</li>'; };
    var deg = '<ul class="mt-2">' + d.degrees.map(function (x) { return li(x); }).join('') + '</ul><p class="mt-5 inline-block border-4 border-ink bg-lime px-3 py-2 font-mono text-sm font-black">BMDC reg. no. ' + UI.esc(d.bmdcNo) + '</p>';
    var mem = '<ul class="mt-2">' + CREDS.memberships.map(function (x) { return li(x); }).join('') + '</ul>';
    var pub = '<ul class="mt-2">' + CREDS.publications.map(function (x) { return li(x.title, x.source + ' · ' + x.year); }).join('') + '</ul>';
    var awd = '<ul class="mt-2">' + CREDS.awards.map(function (x) { return li(x.title, String(x.year)); }).join('') + '</ul>';
    inject('credentials-mount', 'credentials', sec('credentials', UI.cls.secInk, '<div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-grid-white opacity-40 [background-size:64px_64px]"></div><div class="' + UI.cls.container + ' relative" data-component="Credentials">' +
      UI.sectionHead({ index: '05', eyebrow: 'Credentials', title: 'Trained, *registered* and accountable', lead: 'Every qualification can be checked with the issuing body. The registration number below belongs to the Bangladesh Medical and Dental Council.', tone: 'dark' }) +
      '<div class="mt-12 grid gap-8 lg:grid-cols-2">' + credCard('Degrees', 'award', deg, 0) + credCard('Memberships', 'users', mem, 100) + credCard('Publications', 'file-text', pub, 200) + credCard('Awards', 'star', awd, 300) + '</div></div>'));
  }

  function renderVisit() {
    var steps = VISIT_STEPS.map(function (s, i) {
      return '<li data-reveal="cut" class="relative pb-10 pl-20 last:pb-0"><span class="absolute left-0 top-0 z-10 flex h-14 w-14 items-center justify-center border-4 border-ink bg-lime font-mono text-xl font-black shadow-hard-sm">' + UI.pad(i + 1) + '</span><h3 class="' + UI.cls.h3 + '">' + UI.esc(s.title) + '</h3><p class="mt-3 max-w-2xl leading-relaxed">' + UI.esc(s.text) + '</p></li>';
    }).join('');
    var intro = '<div class="lg:sticky lg:top-28"><div data-reveal="stamp" class="border-4 border-ink bg-white p-6 shadow-hard"><p class="' + UI.cls.mono + '">Good to know</p><ul class="mt-4 space-y-3 leading-relaxed"><li class="flex gap-3">' + UI.icon('clock', 'mt-1 h-5 w-5 shrink-0') + '<span>A first consultation takes about 50 minutes.</span></li><li class="flex gap-3">' + UI.icon('users', 'mt-1 h-5 w-5 shrink-0') + '<span>Bring a relative if it helps. You choose what is shared.</span></li><li class="flex gap-3">' + UI.icon('file-text', 'mt-1 h-5 w-5 shrink-0') + '<span>Bring old prescriptions and reports, if you have them.</span></li></ul></div>' +
      '<div role="note" data-reveal="stamp" data-delay="150" class="mt-8 border-4 border-ink bg-alert p-6 text-white shadow-hard"><p class="' + UI.cls.mono + '">If you are in danger now</p><p class="mt-3 leading-relaxed">This page cannot diagnose you. If you may harm yourself or someone else, call <a href="tel:999" class="font-black underline underline-offset-4">999</a> or go to the nearest hospital emergency department. Do not wait for an appointment.</p></div></div>';
    inject('visit-mount', 'first-visit', sec('first-visit', UI.cls.secConcrete, '<div class="' + UI.cls.container + '" data-component="FirstVisit">' + UI.sectionHead({ index: '06', eyebrow: 'Your first consultation', title: 'What happens on *day one*', tone: 'light' }) +
      '<div class="mt-12 grid items-start gap-12 lg:grid-cols-[1fr_1.5fr]">' + intro + '<div class="relative"><div aria-hidden="true" class="absolute left-[1.6rem] top-0 h-full w-1.5 bg-ink/20"></div><div aria-hidden="true" data-progress class="absolute left-[1.6rem] top-0 h-full w-1.5 origin-top bg-ink [transform:scaleY(var(--p,1))]"></div><ol class="relative">' + steps + '</ol></div></div></div>'));
  }

  UI.ready(function () {
    var d = SITE.doctor;
    renderHero(d); renderNumbers(d); renderTimeline(); renderApproach(); renderCredentials(d); renderVisit();
    document.getElementById('cta-mount').outerHTML = UI.ctaBand({ title: 'Start with *one* honest conversation', lead: 'Book a first consultation in Gulshan, Bashundhara or online. Evening slots, and Thursday and Friday online sessions, are available.' });
    UI.mount(document.getElementById('cta'));
  });
})();
