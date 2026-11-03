/*!
 * js/site.js — SHARED CORE (identical for every member; never edit)
 * window.SITE: doctor facts, contact, routes, URL builders, canonical indexes (services, chambers, blog, testimonials),
 * image paths, submit adapter, nextOpening(). Loaded (defer) before ui.js, fx.js, layout.js and page scripts.
 */
(function (window) {
  'use strict';
  /* QA hook: with ?qa=1 collect every runtime error (read by js/qa.js). Harmless otherwise. */
  if (/[?&]qa=1/.test(window.location.search)) {
    window.__qaErrors = window.__qaErrors || [];
    window.addEventListener('error', function (e) { var t = e.target; if (t && t !== window && (t.src || t.href)) window.__qaErrors.push({ type: 'resource', message: 'failed to load ' + (t.src || t.href) }); else window.__qaErrors.push({ type: 'error', message: e.message, src: (e.filename || '').replace(/^.*\//, '') + ':' + e.lineno }); }, true);
    window.addEventListener('unhandledrejection', function (e) { window.__qaErrors.push({ type: 'promise', message: String(e.reason && e.reason.message || e.reason) }); });
    var ce = console.error; console.error = function () { window.__qaErrors.push({ type: 'console.error', message: Array.prototype.join.call(arguments, ' ') }); ce.apply(console, arguments); };
  }
})(window);
(function (window) {
  'use strict';
  var IMG = 'assets/img/';
  var SITE = {
    version: '3.0.0',
    brand: { name: 'Dr. Rashed Anwar Khan', tagline: 'Clear minds. Steady lives.', domain: 'www.drrashedkhan.com', monogram: 'RK' },
    doctor: {
      id: 'doc-001', slug: 'dr-rashed-anwar-khan', name: 'Dr. Rashed Anwar Khan', shortName: 'Dr. Rashed Khan',
      title: 'Consultant Psychiatrist & Associate Professor', department: 'Department of Psychiatry',
      specialty: 'Psychiatrist — Mood, Anxiety, Sleep & Addiction',
      degrees: ['MBBS (Sir Salimullah Medical College)', 'MD (Psychiatry, BSMMU)', 'FCPS (Psychiatry)', 'Postgraduate Certificate in Cognitive Behavioural Therapy (London)'],
      bmdcNo: 'A-57921', experienceYears: 14, patientsTreated: 18000, sessionsDelivered: 62000, satisfactionPercent: 96,
      languages: ['Bangla', 'English'], image: IMG + 'doctor-portrait.svg'
    },
    contact: {
      phone: { display: '+880 1720-418395', e164: '+8801720418395', local: '01720-418395' },
      urgent: { display: '+880 1932-770146', e164: '+8801932770146', local: '01932-770146', note: 'For existing patients only' },
      nationalEmergency: '999',
      whatsappUrl: 'https://wa.me/8801720418395',
      email: 'care@drrashedkhan.com',
      deskHours: 'Appointment desk: Saturday – Thursday, 9:00 AM – 8:00 PM'
    },
    social: { facebook: 'https://www.facebook.com/drrashedkhanpsychiatrist', linkedin: 'https://www.linkedin.com/in/drrashedkhan', youtube: 'https://www.youtube.com/@drrashedkhanpsychiatrist', instagram: 'https://www.instagram.com/drrashedkhanpsychiatrist' },
    img: {
      portrait: IMG + 'doctor-portrait.svg', logo: IMG + 'logo-mark.svg',
      objects: { sun: IMG + 'obj-sun.svg', cross: IMG + 'obj-cross.svg', squiggle: IMG + 'obj-squiggle.svg', cube: IMG + 'obj-cube.svg', arrow: IMG + 'obj-arrow.svg', star: IMG + 'obj-star.svg', halftone: IMG + 'obj-halftone.svg' }
    },
    nav: [
      { label: 'Home', href: 'index.html', page: 'home' }, { label: 'About', href: 'about.html', page: 'about' },
      { label: 'Services', href: 'services.html', page: 'services' }, { label: 'Chambers', href: 'chambers.html', page: 'chambers' },
      { label: 'Contact', href: 'contact.html', page: 'contact' }
    ],
    routes: { home: 'index.html', about: 'about.html', services: 'services.html', serviceDetails: 'service-details.html', chambers: 'chambers.html', appointment: 'appointment.html', blog: 'blog.html', blogDetails: 'blog-details.html', testimonials: 'testimonials.html', contact: 'contact.html', faqs: 'faqs.html', signin: 'signin.html', notFound: '404.html' },
    url: {
      service: function (slug) { return 'service-details.html?slug=' + encodeURIComponent(slug); },
      blog: function (slug) { return 'blog-details.html?slug=' + encodeURIComponent(slug); },
      blogCategory: function (c) { return 'blog.html?category=' + encodeURIComponent(c); },
      chamber: function (slug) { return 'chambers.html#' + slug; },
      appointment: function (o) { var p = new URLSearchParams(); Object.keys(o || {}).forEach(function (k) { if (o[k]) p.set(k, o[k]); }); var q = p.toString(); return 'appointment.html' + (q ? '?' + q : ''); }
    },

    servicesIndex: [
      { id: 'svc-001', slug: 'depression-anxiety', name: 'Depression & Anxiety Care', category: 'adult', accent: 'ultra', icon: 'activity', image: IMG + 'svc-depression-anxiety.svg', priceFrom: 5000, priceTo: 30000, priceUnit: 'per treatment course', short: 'Accurate diagnosis, the right medication when needed, and a clear plan that gets you back to ordinary days.' },
      { id: 'svc-002', slug: 'ocd-trauma', name: 'OCD & Trauma Recovery', category: 'adult', accent: 'tang', icon: 'shield', image: IMG + 'svc-ocd-trauma.svg', priceFrom: 8000, priceTo: 45000, priceUnit: 'per treatment course', short: 'Evidence-based treatment for obsessions, compulsions, panic and trauma-related symptoms, at a pace you control.' },
      { id: 'svc-003', slug: 'bipolar-psychosis', name: 'Bipolar & Psychotic Disorders', category: 'adult', accent: 'lilac', icon: 'trending-up', image: IMG + 'svc-bipolar-psychosis.svg', priceFrom: 6000, priceTo: 40000, priceUnit: 'per treatment course', short: 'Steady, long-term care that stabilises mood and thinking, with family involvement and relapse prevention.' },
      { id: 'svc-004', slug: 'adhd-neurodevelopment', name: 'ADHD & Neuro development', category: 'child-teen', accent: 'lime', icon: 'target', image: IMG + 'svc-adhd-neurodevelopment.svg', priceFrom: 8000, priceTo: 35000, priceUnit: 'per assessment & plan', short: 'Structured assessment and practical support for attention, learning and behaviour, for children and adults.' },
      { id: 'svc-005', slug: 'child-adolescent', name: 'Child & Adolescent Psychiatry', category: 'child-teen', accent: 'ultra', icon: 'users', image: IMG + 'svc-child-adolescent.svg', priceFrom: 6000, priceTo: 30000, priceUnit: 'per assessment & plan', short: 'Gentle, family-centred care for exam stress, school refusal, low mood, anxiety and behavioural concerns.' },
      { id: 'svc-006', slug: 'sleep-insomnia', name: 'Sleep & Insomnia Clinic', category: 'adult', accent: 'ink', icon: 'clock', image: IMG + 'svc-sleep-insomnia.svg', priceFrom: 4000, priceTo: 18000, priceUnit: 'per programme', short: 'A structured programme to treat chronic insomnia without relying on sleeping pills.' },
      { id: 'svc-007', slug: 'addiction-recovery', name: 'Substance Use & Addiction Recovery', category: 'recovery', accent: 'tang', icon: 'heart', image: IMG + 'svc-addiction-recovery.svg', priceFrom: 60000, priceTo: 180000, priceUnit: 'per structured programme', short: 'Medically supervised detox, relapse-prevention therapy and long-term follow-up, with total confidentiality.' },
      { id: 'svc-008', slug: 'psychotherapy-cbt', name: 'Psycho therapy & CBT', category: 'therapy', accent: 'lime', icon: 'message-circle', image: IMG + 'svc-psychotherapy-cbt.svg', priceFrom: 2500, priceTo: 4000, priceUnit: 'per 50-minute session', short: 'Cognitive Behavioural Therapy and talking therapy in a private room, in person or on a secure video call.' }
    ],

    chambersIndex: [
      { id: 'ch-001', slug: 'gulshan', mode: 'in-person', name: 'Serene Care Hospital', chamberName: 'Gulshan Chamber', area: 'Gulshan', city: 'Dhaka',
        address: 'House 62, Road 90, Gulshan-2, Dhaka 1212', phone: { display: '+880 1611-382904', e164: '+8801611382904' },
        schedule: [{ days: [6, 1, 3], label: 'Sat, Mon, Wed', start: '17:00', end: '21:00', hours: '5:00 PM – 9:00 PM' }],
        fee: { firstVisit: 2000, followUp: 1000 }, slotMinutes: 30, lat: 23.7925, lng: 90.4143, image: IMG + 'ch-gulshan.svg' },
      { id: 'ch-002', slug: 'bashundhara', mode: 'in-person', name: 'Bashundhara NeuroCare Centre', chamberName: 'Bashundhara Chamber', area: 'Bashundhara R/A', city: 'Dhaka',
        address: 'Block D, Road 3, Bashundhara R/A, Dhaka 1229', phone: { display: '+880 1718-650273', e164: '+8801718650273' },
        schedule: [{ days: [0, 2], label: 'Sun, Tue', start: '16:00', end: '20:00', hours: '4:00 PM – 8:00 PM' }],
        fee: { firstVisit: 1500, followUp: 800 }, slotMinutes: 30, lat: 23.8193, lng: 90.4526, image: IMG + 'ch-bashundhara.svg' },
      { id: 'ch-003', slug: 'online', mode: 'online', name: 'Telepsychiatry (secure video)', chamberName: 'Online Consultation', area: 'Anywhere', city: 'Online',
        address: 'Secure video consultation from anywhere in Bangladesh or abroad; the link is sent on WhatsApp or email after booking', phone: { display: '+880 1720-418395', e164: '+8801720418395' },
        schedule: [{ days: [4], label: 'Thu', start: '18:00', end: '22:00', hours: '6:00 PM – 10:00 PM' }, { days: [5], label: 'Fri', start: '10:00', end: '13:00', hours: '10:00 AM – 1:00 PM' }],
        fee: { firstVisit: 1800, followUp: 900 }, slotMinutes: 30, lat: null, lng: null, image: IMG + 'ch-online.svg' }
    ],

    blogCategories: [
      { slug: 'depression-anxiety', name: 'Depression & Anxiety' }, { slug: 'sleep', name: 'Sleep' }, { slug: 'teens-children', name: 'Teens & Children' },
      { slug: 'ocd-trauma', name: 'OCD & Trauma' }, { slug: 'medication', name: 'Medication' }, { slug: 'stigma-support', name: 'Stigma & Support' }, { slug: 'crisis', name: 'Crisis' }
    ],
    blogIndex: [
      { id: 'blg-001', slug: 'stress-or-depression-warning-signs', title: 'Stress or Depression? The Signs Worth Taking Seriously', category: 'Depression & Anxiety', categorySlug: 'depression-anxiety', date: '2026-09-24', readMinutes: 6, image: IMG + 'blog-stress-or-depression-warning-signs.svg', excerpt: 'Everyone feels worn down sometimes. Here is how to tell ordinary stress from depression, and when it is time to talk to a professional.' },
      { id: 'blg-002', slug: 'how-to-support-someone-with-anxiety', title: 'How to Support Someone Who Lives With Anxiety', category: 'Depression & Anxiety', categorySlug: 'depression-anxiety', date: '2026-08-27', readMinutes: 6, image: IMG + 'blog-how-to-support-someone-with-anxiety.svg', excerpt: '“Just relax” never helped anyone. Practical, kind ways to support a family member or friend through panic and constant worry.' },
      { id: 'blg-003', slug: 'antidepressants-myths-and-facts', title: 'Antidepressants: Myths, Facts and What to Ask Your Doctor', category: 'Medication', categorySlug: 'medication', date: '2026-08-03', readMinutes: 7, image: IMG + 'blog-antidepressants-myths-and-facts.svg', excerpt: 'They are not addictive and they do not change your personality. A clear, honest guide to how antidepressants work and how long they take.' },
      { id: 'blg-004', slug: 'insomnia-why-you-cant-sleep', title: 'Insomnia: Why You Cannot Sleep and What Actually Helps', category: 'Sleep', categorySlug: 'sleep', date: '2026-07-16', readMinutes: 6, image: IMG + 'blog-insomnia-why-you-cant-sleep.svg', excerpt: 'Lying awake at 3 a.m. is exhausting. Learn the habits that keep insomnia going and the proven steps that break the cycle.' },
      { id: 'blg-005', slug: 'exam-pressure-teen-mental-health', title: 'Exam Pressure and Teen Mental Health: A Guide for Parents', category: 'Teens & Children', categorySlug: 'teens-children', date: '2026-06-18', readMinutes: 6, image: IMG + 'blog-exam-pressure-teen-mental-health.svg', excerpt: 'SSC and HSC season can overwhelm young people. How to spot burnout early and support your teenager without adding pressure.' },
      { id: 'blg-006', slug: 'ocd-is-not-about-being-neat', title: 'OCD Is Not About Being Neat: What It Really Looks Like', category: 'OCD & Trauma', categorySlug: 'ocd-trauma', date: '2026-05-14', readMinutes: 5, image: IMG + 'blog-ocd-is-not-about-being-neat.svg', excerpt: 'Obsessive-compulsive disorder is far more than tidy habits. Understand the cycle of obsessions and compulsions, and how treatment breaks it.' },
      { id: 'blg-007', slug: 'mental-health-stigma-in-bangladesh', title: 'Mental Health Stigma in Bangladesh: Breaking the Silence', category: 'Stigma & Support', categorySlug: 'stigma-support', date: '2026-04-09', readMinutes: 6, image: IMG + 'blog-mental-health-stigma-in-bangladesh.svg', excerpt: '“What will people say?” keeps too many families from seeking help. How to start the conversation and find care without shame.' },
      { id: 'blg-008', slug: 'when-to-seek-emergency-psychiatric-help', title: 'When to Seek Emergency Psychiatric Help', category: 'Crisis', categorySlug: 'crisis', date: '2026-03-05', readMinutes: 5, image: IMG + 'blog-when-to-seek-emergency-psychiatric-help.svg', excerpt: 'Some situations cannot wait for an appointment. Know the warning signs and exactly what to do, including who to call in Bangladesh.' }
    ],

    testimonialsIndex: [
      { id: 'tst-001', name: 'Samira R.', age: 29, area: 'Dhanmondi', serviceSlug: 'depression-anxiety', rating: 5, date: '2026-08-12', quote: 'For two years I called it tiredness. Dr. Rashed listened without judging and gave me a plan I could follow. Three months later I am laughing at the dinner table again.' },
      { id: 'tst-002', name: 'Tahmid H.', age: 34, area: 'Uttara', serviceSlug: 'sleep-insomnia', rating: 5, date: '2026-07-06', quote: 'I had not slept properly in a year. The sleep programme worked without a pile of tablets. I now sleep six solid hours and wake up clear.' },
      { id: 'tst-003', name: 'Nusrat J.', age: 41, area: 'Gulshan', serviceSlug: 'ocd-trauma', rating: 5, date: '2026-05-23', quote: 'I was ashamed of my rituals and hid them for years. He explained OCD in a way that finally made sense, and therapy gave me my mornings back.' },
      { id: 'tst-004', name: 'Parent of a 16-year-old', age: 45, area: 'Bashundhara R/A', serviceSlug: 'child-adolescent', rating: 5, date: '2026-06-30', quote: 'Our son stopped speaking at home during his SSC year. The doctor spent time with him first and then with us. He is back at school and talking again.' },
      { id: 'tst-005', name: 'Arif M.', age: 37, area: 'Mirpur', serviceSlug: 'addiction-recovery', rating: 5, date: '2026-04-18', quote: 'Nobody had treated me as a patient before, only as a problem. The programme was firm and respectful, and fourteen months later I am still in recovery.' },
      { id: 'tst-006', name: 'Farzana K.', age: 52, area: 'Banani', serviceSlug: 'bipolar-psychosis', rating: 5, date: '2026-09-02', quote: 'My brother has lived with bipolar disorder for years. Regular, patient care has kept him stable, working and part of the family. We are grateful.' }
    ],

    getService: function (slug) { return SITE.servicesIndex.filter(function (s) { return s.slug === slug; })[0] || null; },
    getChamber: function (slug) { return SITE.chambersIndex.filter(function (c) { return c.slug === slug; })[0] || null; },
    getPost: function (slug) { return SITE.blogIndex.filter(function (b) { return b.slug === slug; })[0] || null; },

    /* Form adapter. Today: short delay then success. Later: replace the body with a real API call. */
    submit: function (formName, payload) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          var id = formName.slice(0, 3).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
          try { sessionStorage.setItem('ortho:last:' + formName, JSON.stringify({ id: id, payload: payload, at: new Date().toISOString() })); } catch (e) { /* storage unavailable */ }
          resolve({ ok: true, id: id, formName: formName });
        }, 900);
      });
    },

    /* Next chamber opening from now. slug optional. -> {chamber, at, startAt, endAt, schedule, isToday} | null */
    nextOpening: function (slug) {
      var list = slug ? SITE.chambersIndex.filter(function (c) { return c.slug === slug; }) : SITE.chambersIndex;
      var now = new Date(), best = null;
      list.forEach(function (c) {
        c.schedule.forEach(function (s) {
          for (var i = 0; i < 8; i++) {
            var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
            if (s.days.indexOf(d.getDay()) === -1) continue;
            var st = s.start.split(':').map(Number), en = s.end.split(':').map(Number);
            var startAt = new Date(d.getFullYear(), d.getMonth(), d.getDate(), st[0], st[1]);
            var endAt = new Date(d.getFullYear(), d.getMonth(), d.getDate(), en[0], en[1]);
            if (endAt <= now) continue;
            var at = startAt > now ? startAt : now;
            if (!best || at < best.at) best = { chamber: c, at: at, startAt: startAt, endAt: endAt, schedule: s, isToday: i === 0 };
            break;
          }
        });
      });
      return best;
    }
  };
  window.SITE = SITE;
})(window);
