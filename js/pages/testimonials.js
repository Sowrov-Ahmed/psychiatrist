/*
 * js/pages/testimonials.js — Patient voices: rating summary, filterable grid, featured story tabs, privacy, share form
 * Path: js/pages/testimonials.js · Owner: Part 5 · Purpose: renders testimonials.html from SITE.testimonialsIndex + TESTIMONIALS
 * Depends on: SITE, UI, FX (kit), window.TESTIMONIALS (js/data/testimonials.js) · Exposes: nothing
 */
(function () {
  'use strict';
  UI.ready(function () {
    var PER = 9;
    var OUTCOMES = { 'tst-001': 'Back to ordinary days', 'tst-002': 'Better sleep, fewer tablets', 'tst-003': 'Mornings back', 'tst-004': 'Talking at home again', 'tst-005': 'Fourteen months in recovery', 'tst-006': 'Stable and part of the family' };
    var all = SITE.testimonialsIndex.concat(window.TESTIMONIALS || []).map(function (t) { return Object.assign({ outcome: OUTCOMES[t.id] || '', title: '' }, t); });
    var st = { service: '', rating: '', sort: 'newest', shown: PER };
    var CMP = {
      newest: function (a, b) { return b.date.localeCompare(a.date); },
      oldest: function (a, b) { return a.date.localeCompare(b.date); },
      rating: function (a, b) { return b.rating - a.rating || b.date.localeCompare(a.date); }
    };
    var avg = all.reduce(function (n, t) { return n + t.rating; }, 0) / (all.length || 1);
    function inView(el, fn) {
      if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); fn(); } }, { threshold: 0.3 }); io.observe(el); } else fn();
    }

    /* 1. hero */
    document.getElementById('hero-mount').innerHTML = UI.pageHero({
      index: '09', eyebrow: 'Patient voices', title: 'In *their* own words', tone: 'ink',
      lead: 'Real experiences from people who came for help with mood, sleep, anxiety, family concerns and recovery. Every story is shared with consent and shown by initials only.',
      crumbs: [{ label: 'Home', href: SITE.routes.home }, { label: 'Testimonials' }],
      actionsHTML: '<a href="#share" class="' + UI.cls.btnLime + '">Share your experience' + UI.icon('arrow-down', 'h-5 w-5') + '</a><a href="' + SITE.routes.appointment + '" class="' + UI.cls.btnWhite + '">Book Appointment' + UI.icon('arrow-right', 'h-5 w-5') + '</a>'
    });
    UI.mount(document.getElementById('page-hero'));

    /* 2. rating summary */
    var dist = [5, 4, 3, 2, 1].map(function (r) { var n = all.filter(function (t) { return Math.round(t.rating) === r; }).length; return { r: r, n: n, pct: Math.round(n / (all.length || 1) * 100) }; });
    document.getElementById('summary-mount').outerHTML = '<section id="summary" data-section="summary" class="' + UI.cls.secLime + ' overflow-x-clip"><div aria-hidden="true" data-scroll-x="0.5" class="pointer-events-none absolute left-0 top-3 whitespace-nowrap font-display text-[14vw] font-black uppercase leading-none ' + UI.cls.outline + ' opacity-20">Heard — Respected — Supported — Heard — Respected</div><div class="' + UI.cls.container + ' relative">' +
      UI.sectionHead({ index: '01', eyebrow: 'Rating summary', title: 'What patients *rate*', tone: 'light' }) +
      '<div class="mt-12 grid gap-8 lg:grid-cols-[1fr_1.4fr_1fr]"><div data-component="RatingScore" data-reveal="stamp" class="border-4 border-ink bg-white p-6 text-ink shadow-hard"><p class="' + UI.cls.display + ' text-7xl leading-none md:text-8xl">' + avg.toFixed(1) + '</p><div class="mt-4">' + UI.stars(avg, 'h-6 w-6') + '</div><p class="mt-4 border-t-4 border-ink pt-3 ' + UI.cls.mono + '">Average from ' + all.length + ' patient reviews</p></div>' +
      '<div data-component="RatingBars" class="border-4 border-ink bg-white p-6 text-ink shadow-hard"><h3 class="sr-only">Rating distribution</h3><ul class="space-y-4">' + dist.map(function (d) {
        return '<li class="flex items-center gap-4"><span class="w-14 shrink-0 ' + UI.cls.mono + '">' + d.r + ' star' + (d.r > 1 ? 's' : '') + '</span><span class="h-6 flex-1 border-4 border-ink bg-concrete"><span data-bar="' + d.pct + '" class="block h-full w-0 bg-ink motion-safe:transition-[width] motion-safe:duration-700 motion-safe:ease-[steps(8,end)]"></span></span><span class="w-20 shrink-0 text-right ' + UI.cls.mono + '">' + d.n + ' · ' + d.pct + '%</span></li>'; }).join('') + '</ul></div>' +
      UI.statBlock({ value: SITE.doctor.satisfactionPercent, suffix: '%', label: 'Patient satisfaction', tone: 'light', delay: 150 }) + '</div></div></section>';
    var sum = document.getElementById('summary');
    UI.mount(sum);
    inView(sum.querySelector('[data-component="RatingBars"]'), function () { UI.qsa('[data-bar]', sum).forEach(function (b) { b.style.width = b.getAttribute('data-bar') + '%'; }); });

    /* 3. filter bar + grid */
    var svcWith = SITE.servicesIndex.filter(function (s) { return all.some(function (t) { return t.serviceSlug === s.slug; }); });
    var selCls = 'min-h-[44px] w-full appearance-none border-4 border-ink bg-white py-2 pl-4 pr-14 font-mono text-sm font-bold uppercase text-ink focus:bg-lime/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-ultra';
    var chev = '<span class="pointer-events-none absolute inset-y-0 right-0 flex w-11 items-center justify-center border-l-4 border-ink bg-ink text-lime">' + UI.icon('chevron-down', 'h-5 w-5') + '</span>';
    var sel = function (id, label, opts) { return '<div class="flex items-center gap-3"><label for="' + id + '" class="shrink-0 ' + UI.cls.mono + '">' + label + '</label><div class="relative">' + '<select id="' + id + '" class="' + selCls + '">' + opts.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + '</option>'; }).join('') + '</select>' + chev + '</div></div>'; };
    document.getElementById('stories-mount').outerHTML = '<section id="stories" data-section="stories" class="' + UI.cls.secWhite + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ index: '02', eyebrow: 'All reviews', title: 'Browse *every* story', tone: 'light' }) +
      '<div data-component="TestimonialToolbar" class="mt-10 space-y-5 border-4 border-ink bg-concrete p-4 shadow-hard-sm md:p-6"><div id="t-chips" role="group" aria-label="Filter by service" class="flex flex-wrap gap-3"></div>' +
      '<div class="flex flex-col gap-4 border-t-4 border-ink pt-4 lg:flex-row lg:items-center lg:justify-between"><p id="t-count" role="status" aria-live="polite" class="' + UI.cls.mono + '"></p><div class="flex flex-col gap-4 sm:flex-row">' +
      sel('t-rating', 'Rating', [['', 'All ratings'], ['5', '5 stars'], ['4', '4 stars']]) + sel('t-sort', 'Sort by', [['newest', 'Newest'], ['oldest', 'Oldest'], ['rating', 'Highest rated']]) + '</div></div></div>' +
      '<div id="t-grid" data-component="TestimonialGrid" class="mt-14"></div><div id="t-more" class="mt-12 text-center"></div></div></section>';
    var chips = document.getElementById('t-chips'), grid = document.getElementById('t-grid'), more = document.getElementById('t-more'), count = document.getElementById('t-count');
    chips.innerHTML = [{ slug: '', name: 'All services', n: all.length }].concat(svcWith.map(function (s) { return { slug: s.slug, name: s.name, n: all.filter(function (t) { return t.serviceSlug === s.slug; }).length }; })).map(function (c) {
      return '<button type="button" class="' + UI.cls.chip + ' min-h-[44px]" aria-pressed="false" data-filter="' + UI.esc(c.slug) + '">' + UI.esc(c.name) + ' <span class="opacity-70">(' + c.n + ')</span></button>';
    }).join('');
    function card(t) {
      return '<div class="flex h-full flex-col gap-4"><div class="flex-1">' + UI.testimonialCard(t, { tone: 'light' }) + '</div><div class="flex flex-wrap items-center gap-2 ' + UI.cls.mono + '">' + (t.outcome ? '<span class="bg-ink px-2 py-1 text-lime">' + UI.esc(t.outcome) + '</span>' : '') + '<span>' + UI.formatDate(t.date, 'long') + '</span></div></div>';
    }
    function update() {
      var list = all.filter(function (t) { return (!st.service || t.serviceSlug === st.service) && (!st.rating || Math.round(t.rating) === parseInt(st.rating, 10)); }).sort(CMP[st.sort]);
      var vis = list.slice(0, st.shown);
      UI.qsa('[data-filter]', chips).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === st.service)); });
      count.textContent = list.length ? 'Showing ' + vis.length + ' of ' + list.length + (list.length === 1 ? ' review' : ' reviews') : 'No reviews found';
      grid.innerHTML = list.length ? '<div class="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">' + vis.map(card).join('') + '</div>' :
        '<div data-component="EmptyState" class="border-4 border-ink bg-concrete p-8 text-center shadow-hard md:p-14"><p class="' + UI.cls.h3 + '">No reviews match these filters</p><p class="mx-auto mt-4 max-w-xl leading-relaxed">Try another service or rating, or clear the filters to see every review.</p><button type="button" data-clear class="' + UI.cls.btnLime + ' mt-8">Clear filters</button></div>';
      more.innerHTML = list.length > vis.length ? '<button type="button" data-more class="' + UI.cls.btnInk + '">Load more reviews' + UI.icon('plus', 'h-5 w-5') + '</button>' : '';
      UI.mount(grid);
    }
    chips.addEventListener('click', function (e) { var b = e.target.closest('[data-filter]'); if (!b) return; st.service = b.getAttribute('data-filter'); st.shown = PER; update(); });
    document.getElementById('t-rating').addEventListener('change', function (e) { st.rating = e.target.value; st.shown = PER; update(); });
    document.getElementById('t-sort').addEventListener('change', function (e) { st.sort = CMP[e.target.value] ? e.target.value : 'newest'; st.shown = PER; update(); });
    more.addEventListener('click', function (e) { if (!e.target.closest('[data-more]')) return; st.shown += PER; update(); });
    grid.addEventListener('click', function (e) {
      if (!e.target.closest('[data-clear]')) return;
      st.service = ''; st.rating = ''; document.getElementById('t-rating').value = ''; st.shown = PER; update();
    });
    update();

    /* 4. featured story: Before / During / After */
    var STORY = [
      { id: 'before', tab: 'Before', head: 'Telling everyone she was just tired', text: ['For almost a year, S., a teacher in her thirties from Dhaka, told everyone she was simply tired. She woke at three in the morning, dreaded the school run and stopped answering her sisters’ calls. At home she kept her voice bright; at night she cried quietly so the children would not hear.', 'A colleague finally said, “You do not seem like yourself.” That one sentence was enough to make her book a consultation.'] },
      { id: 'during', tab: 'During', head: 'A plan she understood', text: ['The first visit lasted almost an hour. Dr. Rashed asked about sleep, work, money and family, and explained that low mood is a medical condition, not a failing of character. Together they agreed a plan: a short course of medicine, weekly talking therapy for two months and a fixed bedtime routine.', 'Her husband joined one session. When early side effects appeared she called the appointment desk instead of stopping, and the plan was adjusted.'] },
      { id: 'after', tab: 'After', head: 'Quieter nights, easier mornings', text: ['Over several months the nights grew quieter and the mornings easier. She still has hard days, and she keeps her follow-up visits every few weeks. She says the biggest change was no longer feeling alone with it.', 'Every person’s course is different. This is one person’s experience, shared with her permission and with identifying details removed.'] }
    ];
    document.getElementById('story-mount').outerHTML = '<section id="story" data-section="story" class="' + UI.cls.secDusk + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ index: '03', eyebrow: 'Featured story', title: 'One year, in *three* parts', tone: 'dark' }) +
      '<div data-tabs data-component="StoryTabs" class="mt-12 max-w-5xl"><div role="tablist" aria-label="Stages of the story" class="flex flex-wrap gap-3">' + STORY.map(function (s, i) {
        return '<button type="button" role="tab" id="story-tab-' + s.id + '" data-tab="' + s.id + '" aria-controls="story-panel-' + s.id + '" aria-selected="' + (i === 0) + '" class="' + UI.cls.tab + ' min-h-[44px]">' + UI.pad(i + 1) + ' · ' + s.tab + '</button>'; }).join('') + '</div>' +
      STORY.map(function (s, i) {
        return '<div role="tabpanel" id="story-panel-' + s.id + '" data-tab-panel="' + s.id + '" aria-labelledby="story-tab-' + s.id + '" tabindex="0" class="' + (i ? 'hidden ' : '') + 'mt-6 border-4 border-ink bg-white p-6 text-ink shadow-hard-lime md:p-10"><h3 class="' + UI.cls.h3 + '">' + UI.esc(s.head) + '</h3><div class="mt-5 max-w-3xl space-y-4 text-lg leading-relaxed">' + s.text.map(function (p) { return '<p>' + UI.esc(p) + '</p>'; }).join('') + '</div></div>'; }).join('') + '</div></div></section>';
    UI.mount(document.getElementById('story'));

    /* 5. privacy */
    var priv = [['user', 'Initials only', 'Names are shortened to initials. We never publish a full name, phone number, address or photograph.'], ['shield', 'Consent first', 'Nothing is shown without the writer’s agreement. You can ask us to remove your words at any time.'], ['file-text', 'Moderated', 'Every submission is read by our team before publishing. We remove medical details, other people’s names and anything that could identify someone.']];
    document.getElementById('privacy-mount').outerHTML = '<section id="privacy" data-section="privacy" class="' + UI.cls.secConcrete + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ index: '04', eyebrow: 'Privacy statement', title: 'Your story stays *yours*', tone: 'light' }) +
      '<div class="mt-12 grid gap-8 md:grid-cols-3">' + priv.map(function (p, i) { return '<div data-reveal="stamp" data-delay="' + i * 120 + '" class="' + UI.cls.box + ' p-6"><span class="' + UI.cls.iconBox + '">' + UI.icon(p[0], 'h-6 w-6') + '</span><h3 class="mt-5 ' + UI.cls.h3 + '">' + p[1] + '</h3><p class="mt-3 leading-relaxed">' + p[2] + '</p></div>'; }).join('') + '</div>' +
      '<p class="mt-10 max-w-3xl leading-relaxed">Reviews describe personal experience and are not medical advice or a promise of results. Treatment and recovery differ from person to person. To have a review changed or removed, write to <a href="mailto:' + SITE.contact.email + '" class="font-bold underline underline-offset-4 hover:text-ultra">' + SITE.contact.email + '</a> or use the <a href="' + SITE.routes.contact + '" class="font-bold underline underline-offset-4 hover:text-ultra">contact page</a>.</p></div></section>';
    UI.mount(document.getElementById('privacy'));

    /* 6. share your experience */
    var stars = [5, 4, 3, 2, 1].map(function (n) { return '<label class="block cursor-pointer"><input type="radio" name="rating" value="' + n + '" required class="peer sr-only"><span class="flex min-h-[44px] items-center gap-2 border-4 border-ink bg-white px-4 py-2 font-mono text-sm font-bold text-ink peer-checked:bg-lime peer-focus-visible:ring-4 peer-focus-visible:ring-ultra hover:bg-lime/50">' + n + UI.icon('star-fill', 'h-4 w-4') + '<span class="sr-only"> stars</span></span></label>'; }).join('');
    document.getElementById('share-mount').outerHTML = '<section id="share" data-section="share" class="' + UI.cls.secWhite + '"><div class="' + UI.cls.container + '"><div class="grid gap-12 lg:grid-cols-[1fr_1.3fr]"><div>' +
      UI.sectionHead({ index: '05', eyebrow: 'Share your experience', title: 'Tell us how it *went*', tone: 'light', lead: 'Your words may help someone else take the first step. Reviews are checked by our team before they appear.' }) +
      '<ul class="mt-8 space-y-3 border-4 border-ink bg-lime p-5 shadow-hard-sm">' + ['Write about how the visit felt, not about other people.', 'Please leave out medicine names, doses and diagnoses.', 'Use your initials if you prefer.'].map(function (t) { return '<li class="flex gap-3 font-medium"><span aria-hidden="true" class="mt-2 h-3 w-3 shrink-0 bg-ink"></span>' + t + '</li>'; }).join('') + '</ul></div>' +
      '<div id="share-box" data-component="TestimonialForm" class="border-4 border-ink bg-concrete p-6 shadow-hard md:p-10"><form id="share-form" novalidate class="space-y-6">' +
      UI.field({ label: 'Name or initials', name: 'name', required: true, autocomplete: 'name', hint: 'Only your initials will be shown.' }) +
      UI.field({ label: 'Mobile number (optional)', name: 'phone', type: 'tel', validate: 'bd-phone', autocomplete: 'tel', hint: 'Used only if we need to check something. Never published.' }) +
      UI.field({ label: 'Service you used', name: 'service', type: 'select', required: true, options: SITE.servicesIndex.map(function (s) { return { value: s.slug, label: s.name }; }) }) +
      '<fieldset class="min-w-0"><legend class="mb-2 ' + UI.cls.mono + '">Your rating <span class="text-tang" aria-hidden="true">*</span></legend><div class="flex flex-wrap gap-3">' + stars + '</div><p id="err-rating" data-error-for="rating" class="mt-1 hidden font-mono text-sm font-bold text-alert"></p></fieldset>' +
      UI.field({ label: 'Title', name: 'title', required: true, minlength: 4, hint: 'A few words, for example: A calm first visit.' }) +
      UI.field({ label: 'Your experience', name: 'message', type: 'textarea', required: true, minlength: 30, rows: 6, hint: 'At least 30 characters.' }) +
      UI.field({ name: 'consent', type: 'checkbox', required: true, labelHTML: 'I agree that my review may be shown on this website using my initials only.' }) +
      '<button type="submit" class="' + UI.cls.btnLime + ' w-full sm:w-auto">Submit review' + UI.icon('send', 'h-5 w-5') + '</button></form></div></div></div></section>';
    UI.mount(document.getElementById('share'));
    var form = document.getElementById('share-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!UI.validateForm(form)) return;
      var f = form.elements, btn = form.querySelector('button[type="submit"]');
      var payload = { name: f.name.value.trim(), phone: f.phone.value.trim(), serviceSlug: f.service.value, rating: parseInt(form.querySelector('[name="rating"]:checked').value, 10) || 5, title: f.title.value.trim(), message: f.message.value.trim(), consent: f.consent.checked };
      btn.disabled = true; btn.textContent = 'Sending…';
      SITE.submit('testimonial', payload).then(function (res) {
        document.getElementById('share-box').innerHTML = '<div role="status" data-component="FormSuccess"><span class="' + UI.cls.iconBox + '">' + UI.icon('check', 'h-6 w-6') + '</span><h3 class="mt-5 ' + UI.cls.h3 + '">Thank you</h3><p class="mt-4 max-w-xl leading-relaxed">Your review has been received. Our team reads every submission and removes anything that could identify a person before it is published, so it may take a few days to appear.</p><p class="mt-4 ' + UI.cls.mono + '">Reference: ' + UI.esc(res.id) + '</p></div>';
        document.getElementById('share-box').scrollIntoView({ block: 'center', behavior: FX.reduced() ? 'auto' : 'smooth' });
      });
    });

    /* 7. CTA */
    document.getElementById('cta-mount').outerHTML = UI.ctaBand({ title: 'Your story can start with *one* call', lead: 'Book a first consultation in Gulshan, Bashundhara or online. Appointments are not for emergencies; in an emergency call ' + SITE.contact.nationalEmergency + '.' });
    UI.mount(document.getElementById('cta'));
  });
})();
