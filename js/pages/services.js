/*
 * js/pages/services.js — Services catalogue page
 * Path: js/pages/services.js · Owner: Part 3 · Purpose: hero, filterable catalogue, fees table, tape and CTA
 * Depends on: SITE, UI, FX (shared kit) · Exposes: nothing
 */
(function () {
  'use strict';
  UI.ready(function () {
    var all = SITE.servicesIndex.slice();
    var CATS = [{ slug: 'all', label: 'All' }, { slug: 'adult', label: 'Adult' }, { slug: 'child-teen', label: 'Child & teen' }, { slug: 'therapy', label: 'Therapy' }, { slug: 'recovery', label: 'Recovery' }];
    var state = { category: 'all', q: '', sort: 'name' };
    var wanted = UI.getParam('category');
    if (CATS.some(function (c) { return c.slug === wanted; })) state.category = wanted;

    /* 1. hero */
    document.getElementById('hero-mount').innerHTML = UI.pageHero({
      index: '03', eyebrow: 'Eight services, one doctor', title: 'Care that is *specific* to you', tone: 'dusk',
      lead: 'From first-time low mood to long-term recovery, each service has a clear method, a stated price range and an honest timeline.',
      crumbs: [{ label: 'Home', href: SITE.routes.home }, { label: 'Services' }],
      actionsHTML: '<a data-magnetic href="' + SITE.routes.appointment + '" class="' + UI.cls.btnLime + '">Book Appointment' + UI.icon('arrow-right', 'h-5 w-5') + '</a><a href="#catalogue" class="' + UI.cls.btnWhite + '">Browse services' + UI.icon('arrow-down', 'h-5 w-5') + '</a>'
    });

    /* 2. catalogue with filter bar */
    var chips = CATS.map(function (c) {
      return '<button type="button" class="' + UI.cls.chip + ' min-h-[44px]" data-filter="' + c.slug + '" aria-pressed="' + (c.slug === state.category) + '">' + UI.esc(c.label) + '</button>';
    }).join('');
    document.getElementById('catalogue-mount').outerHTML = '<section id="catalogue" data-section="catalogue" data-component="ServiceCatalogue" class="relative overflow-x-clip border-b-4 border-ink bg-white py-16 text-ink md:py-28">' +
      '<div aria-hidden="true" data-scroll-x="0.5" class="pointer-events-none absolute left-0 top-4 whitespace-nowrap font-display text-[16vw] font-black uppercase leading-none ' + UI.cls.outline + ' opacity-10">Adult — Child — Therapy — Recovery — Adult — Child</div>' +
      '<div class="' + UI.cls.container + ' relative">' + UI.sectionHead({ index: '01', eyebrow: 'The catalogue', title: 'Find the *right* service', lead: 'Filter by who the care is for, search by name or sort by price. Every card opens a full page on how the service works.', tone: 'light' }) +
      '<div class="sticky top-24 z-30 mt-12 border-4 border-ink bg-white p-4 shadow-hard-sm"><div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">' +
      '<div role="group" aria-label="Filter services by category" class="flex flex-wrap gap-2" id="svc-chips">' + chips + '</div>' +
      '<div class="flex flex-col gap-3 sm:flex-row"><div><label for="svc-search" class="mb-1 block ' + UI.cls.mono + '">Search</label><input id="svc-search" type="search" autocomplete="off" class="min-h-[44px] w-full border-4 border-ink bg-white px-3 py-2 font-mono text-sm text-ink focus:bg-lime/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-ultra sm:w-52"></div>' +
      '<div><label for="svc-sort" class="mb-1 block ' + UI.cls.mono + '">Sort by</label><select id="svc-sort" class="min-h-[44px] w-full border-4 border-ink bg-white px-3 py-2 font-mono text-sm text-ink focus:bg-lime/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-ultra sm:w-48"><option value="name">Name A–Z</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></div></div></div>' +
      '<p id="svc-count" role="status" aria-live="polite" class="mt-3 ' + UI.cls.mono + '"></p></div>' +
      '<div id="svc-grid" class="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"></div></div></section>';

    function visible() {
      var q = state.q.trim().toLowerCase();
      var list = all.filter(function (s) {
        return (state.category === 'all' || s.category === state.category) && (!q || (s.name + ' ' + s.short + ' ' + s.category).toLowerCase().indexOf(q) > -1);
      });
      list.sort(function (a, b) {
        if (state.sort === 'price-asc') return a.priceFrom - b.priceFrom;
        if (state.sort === 'price-desc') return b.priceTo - a.priceTo;
        return a.name.localeCompare(b.name);
      });
      return list;
    }
    function render() {
      var list = visible(), grid = document.getElementById('svc-grid');
      document.getElementById('svc-count').textContent = list.length + (list.length === 1 ? ' service shown' : ' services shown') + ' of ' + all.length;
      grid.innerHTML = list.length ? list.map(function (s, i) { return '<div data-reveal="cut" data-delay="' + (i % 4) * 80 + '" class="h-full">' + UI.serviceCard(s, { tone: 'light', index: i + 1 }) + '</div>'; }).join('') :
        '<div class="col-span-full border-4 border-ink bg-concrete p-8 shadow-hard"><p class="' + UI.cls.h3 + '">No service matches that</p><p class="mt-3 max-w-xl leading-relaxed">Try a different word or clear the filters. If you are unsure which service you need, book a first consultation and Dr. Rashed will guide you.</p><button type="button" data-reset class="' + UI.cls.btnInk + ' mt-6">Clear filters</button></div>';
      UI.mount(grid);
    }
    function setChips() {
      UI.qsa('#svc-chips [data-filter]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === state.category)); });
    }
    document.getElementById('svc-chips').addEventListener('click', function (e) {
      var b = e.target.closest('[data-filter]'); if (!b) return;
      state.category = b.getAttribute('data-filter'); setChips(); render();
    });
    document.getElementById('svc-search').addEventListener('input', UI.debounce(function (e) { state.q = e.target.value; render(); }, 200));
    document.getElementById('svc-sort').addEventListener('change', function (e) { state.sort = e.target.value; render(); });
    document.getElementById('svc-grid').addEventListener('click', function (e) {
      if (!e.target.closest('[data-reset]')) return;
      state = { category: 'all', q: '', sort: 'name' };
      document.getElementById('svc-search').value = ''; document.getElementById('svc-sort').value = 'name'; setChips(); render();
    });
    render();
    UI.mount(document.getElementById('catalogue'));

    /* 3. fees explained */
    var rows = all.map(function (s) {
      return '<tr class="border-b-2 border-ink last:border-b-0 hover:bg-lime"><th scope="row" class="px-4 py-3 text-left font-display text-sm font-black uppercase"><a class="underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra" href="' + SITE.url.service(s.slug) + '">' + UI.esc(s.name) + '</a></th><td class="px-4 py-3 font-mono text-xs font-bold uppercase">' + UI.esc(s.category.replace('-', ' ')) + '</td><td class="px-4 py-3 font-mono text-sm font-bold">' + UI.formatBDTRange(s.priceFrom, s.priceTo) + '</td><td class="px-4 py-3 text-sm">' + UI.esc(s.priceUnit) + '</td></tr>';
    }).join('');
    var pay = ['Cash', 'bKash', 'Nagad', 'Card at chamber'].map(function (x) { return '<li class="border-4 border-ink bg-white px-4 py-2 font-mono text-xs font-bold uppercase text-ink shadow-hard-sm">' + UI.esc(x) + '</li>'; }).join('');
    var fees = SITE.chambersIndex.map(function (c) { return '<li class="flex items-baseline justify-between gap-4 border-b-2 border-ink py-2 last:border-b-0"><span class="font-bold">' + UI.esc(c.chamberName) + '</span><span class="font-mono text-sm">' + UI.formatBDT(c.fee.firstVisit) + ' / ' + UI.formatBDT(c.fee.followUp) + '</span></li>'; }).join('');
    document.getElementById('fees-mount').outerHTML = '<section id="fees" data-section="fees" data-component="FeesExplained" class="relative overflow-x-clip border-b-4 border-ink bg-concrete py-16 text-ink md:py-28"><div aria-hidden="true" data-parallax="0.2" class="pointer-events-none absolute -left-10 top-20 h-64 w-64 bg-halftone [background-size:14px_14px] opacity-20"></div><div class="' + UI.cls.container + ' relative">' +
      UI.sectionHead({ index: '03', eyebrow: 'Fees explained', title: 'What you *pay* and why', lead: 'Prices are given as ranges because the length of treatment differs for every person. You are told the likely total after your first visit, before you commit to anything.', tone: 'light' }) +
      '<div class="mt-12 grid gap-10 lg:grid-cols-[1fr_1.6fr]"><div class="space-y-8"><div data-reveal="left" class="border-4 border-ink bg-white p-6 shadow-hard"><h3 class="' + UI.cls.h3 + '">Two kinds of fee</h3><p class="mt-4 leading-relaxed">A consultation fee is paid per visit at the chamber you choose. A treatment course range covers the plan that follows: reviews, therapy sessions and written materials. Medicines, laboratory tests and hospital charges are always separate.</p><ul class="mt-5">' + fees + '</ul><p class="mt-3 font-mono text-xs uppercase">First visit / follow-up</p></div>' +
      '<div data-reveal="left" data-delay="150"><h3 class="' + UI.cls.mono + '">Payment options</h3><ul class="mt-3 flex flex-wrap gap-3">' + pay + '</ul></div></div>' +
      '<div data-reveal="right"><div class="overflow-x-auto border-4 border-ink bg-white shadow-hard" tabindex="0" role="region" aria-label="Price table for all services"><table class="w-full min-w-[640px] border-collapse"><caption class="border-b-4 border-ink bg-ink px-4 py-3 text-left font-mono text-xs font-bold uppercase text-lime">All services, price ranges in Bangladeshi taka</caption><thead><tr class="border-b-4 border-ink bg-lime text-left font-mono text-xs font-bold uppercase"><th scope="col" class="px-4 py-3">Service</th><th scope="col" class="px-4 py-3">Category</th><th scope="col" class="px-4 py-3">Price range</th><th scope="col" class="px-4 py-3">Charged</th></tr></thead><tbody>' + rows + '</tbody></table></div></div></div>' +
      '<div data-reveal="stamp" class="mt-12 flex flex-col gap-4 border-4 border-ink bg-alert p-6 text-white shadow-hard sm:flex-row sm:items-center"><span class="flex h-12 w-12 shrink-0 items-center justify-center border-4 border-ink bg-white text-alert">' + UI.icon('alert-circle', 'h-6 w-6') + '</span><p class="text-lg font-medium leading-relaxed">If you or someone near you is in immediate danger, call <a href="tel:999" class="font-black underline underline-offset-4">999</a> or go to the nearest hospital emergency department. Appointments are not for emergencies.</p></div></div></section>' +
      UI.tape(all.map(function (s) { return s.name; }), { tone: 'ink', rotate: '-rotate-1' });
    UI.mount(document.getElementById('fees'));

    /* 4. CTA */
    document.getElementById('cta-mount').outerHTML = UI.ctaBand({ title: 'Not sure *which* service? Start here', lead: 'Book a first consultation and Dr. Rashed will help you choose. Appointments are Saturday to Thursday in Gulshan, Bashundhara or online.', primaryLabel: 'Book Appointment', primaryHref: SITE.routes.appointment, secondaryLabel: 'Call ' + SITE.contact.phone.display, secondaryHref: 'tel:' + SITE.contact.phone.e164 });
    UI.mount(document.getElementById('cta'));
  });
})();
