/*
 * js/pages/blog.js — Blog listing: hero search, featured post, filter/sort/paginate grid, topics, newsletter
 * Path: js/pages/blog.js · Owner: Part 5 · Purpose: renders blog.html from SITE.blogIndex merged with BLOGS
 * Depends on: SITE, UI, FX (kit), window.BLOGS (js/data/blogs.js) · Exposes: nothing
 */
(function () {
  'use strict';
  UI.ready(function () {
    var PER = 6, SORTS = [['newest', 'Newest'], ['oldest', 'Oldest'], ['popular', 'Most read'], ['shortest', 'Shortest read']];
    var detail = {};
    (window.BLOGS || []).forEach(function (b) { detail[b.slug] = b; });
    var posts = SITE.blogIndex.map(function (p) {
      var d = detail[p.slug] || {};
      return Object.assign({ views: 0, tags: [] }, p, d);
    });
    var catSlugs = SITE.blogCategories.map(function (c) { return c.slug; });
    var qCat = UI.getParam('category');
    var st = {
      category: catSlugs.indexOf(qCat) > -1 ? qCat : '',
      q: (UI.getParam('q') || '').trim().slice(0, 60),
      sort: 'newest',
      page: Math.max(1, parseInt(UI.getParam('page'), 10) || 1)
    };
    var CMP = {
      newest: function (a, b) { return b.date.localeCompare(a.date); },
      oldest: function (a, b) { return a.date.localeCompare(b.date); },
      popular: function (a, b) { return b.views - a.views; },
      shortest: function (a, b) { return a.readMinutes - b.readMinutes || b.date.localeCompare(a.date); }
    };
    function hay(p) { return (p.title + ' ' + p.excerpt + ' ' + p.category + ' ' + p.tags.join(' ')).toLowerCase(); }
    function filtered() {
      var q = st.q.toLowerCase();
      return posts.filter(function (p) { return (!st.category || p.categorySlug === st.category) && (!q || hay(p).indexOf(q) > -1); }).sort(CMP[st.sort]);
    }
    function catCount(slug) { return posts.filter(function (p) { return p.categorySlug === slug; }).length; }

    /* 1. hero with search */
    var search = '<form id="blog-search" role="search" novalidate class="flex w-full max-w-xl border-4 border-ink bg-white shadow-hard"><label for="blog-q" class="sr-only">Search articles</label>' +
      '<input id="blog-q" type="search" name="q" value="' + UI.esc(st.q) + '" maxlength="60" autocomplete="off" title="Search articles by topic, for example sleep or exams" class="min-w-0 flex-1 bg-white px-4 py-4 font-mono text-base text-ink focus:bg-lime/30 focus:outline-none">' +
      '<button type="submit" aria-label="Search articles" class="flex h-14 w-14 shrink-0 items-center justify-center border-l-4 border-ink bg-ink text-lime hover:bg-ultra focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra">' + UI.icon('search', 'h-6 w-6') + '</button></form>';
    document.getElementById('hero-mount').innerHTML = UI.pageHero({
      index: '05', eyebrow: 'The journal', title: 'Plain words on *mind* and health', tone: 'lime',
      lead: 'Clear, careful articles on mood, anxiety, sleep, medicine and family life, written by ' + SITE.doctor.shortName + ' for readers in Bangladesh. They are for education and cannot diagnose you.',
      crumbs: [{ label: 'Home', href: SITE.routes.home }, { label: 'Blog' }], actionsHTML: search
    });
    UI.mount(document.getElementById('page-hero'));

    /* 2. featured: newest post */
    var top = posts.slice().sort(CMP.newest)[0];
    document.getElementById('featured-mount').outerHTML = '<section id="featured" data-section="featured" class="' + UI.cls.secWhite + ' overflow-x-clip"><div aria-hidden="true" data-scroll-x="0.4" class="pointer-events-none absolute left-0 top-4 whitespace-nowrap font-display text-[14vw] font-black uppercase leading-none ' + UI.cls.outline + ' opacity-10">Read — Think — Talk — Read — Think — Talk</div>' +
      '<div aria-hidden="true" data-parallax-rotate="14" class="pointer-events-none absolute right-6 top-8 hidden md:block">' + UI.sticker('Latest', { bg: 'bg-tang' }) + '</div><div class="' + UI.cls.container + ' relative">' + UI.sectionHead({ index: '01', eyebrow: 'Latest article', title: 'Start with the *newest*', tone: 'light' }) +
      '<article data-component="FeaturedPost" class="mt-12 grid border-4 border-ink bg-white shadow-hard-lg lg:grid-cols-12"><div data-parallax-img class="relative aspect-[16/10] overflow-hidden border-b-4 border-ink bg-concrete lg:col-span-7 lg:aspect-auto lg:min-h-[28rem] lg:border-b-0 lg:border-r-4">' +
      UI.img(top.image, top.title, 'absolute inset-0 h-[125%] w-full object-cover', { w: 1000, h: 625 }) + '</div>' +
      '<div class="flex flex-col bg-lime p-6 md:p-10 lg:col-span-5"><div class="flex flex-wrap items-center gap-2 ' + UI.cls.mono + '"><span class="bg-ink px-2 py-0.5 text-lime">' + UI.esc(top.category) + '</span><span>' + UI.formatDate(top.date, 'long') + ' · ' + top.readMinutes + ' min read</span></div>' +
      '<h3 class="mt-6 ' + UI.cls.h2 + ' !text-[clamp(1.75rem,3.4vw,3rem)]">' + UI.esc(top.title) + '</h3><p class="mt-5 text-lg leading-relaxed">' + UI.esc(top.excerpt) + '</p>' +
      '<a href="' + SITE.url.blog(top.slug) + '" class="' + UI.cls.btnInk + ' mt-auto self-start">Read the article' + UI.icon('arrow-right', 'h-5 w-5') + '</a></div></article></div></section>';
    UI.mount(document.getElementById('featured'));

    /* 3. toolbar + grid */
    var chipBase = UI.cls.chip + ' min-h-[44px]';
    document.getElementById('browse-mount').outerHTML = '<section id="browse" data-section="browse" class="' + UI.cls.secConcrete + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ index: '02', eyebrow: 'All articles', title: 'Find what you *need*', tone: 'light' }) +
      '<div data-component="BlogToolbar" class="mt-10 flex flex-col gap-6 border-4 border-ink bg-white p-4 shadow-hard-sm md:p-6"><div id="blog-chips" role="group" aria-label="Filter by category" class="flex flex-wrap gap-3"></div>' +
      '<div class="flex flex-col gap-4 border-t-4 border-ink pt-4 md:flex-row md:items-center md:justify-between"><p id="blog-count" role="status" aria-live="polite" class="' + UI.cls.mono + '"></p>' +
      '<div class="flex items-center gap-3"><label for="blog-sort" class="' + UI.cls.mono + '">Sort by</label><div class="relative"><select id="blog-sort" class="min-h-[44px] w-full appearance-none border-4 border-ink bg-white py-2 pl-4 pr-14 font-mono text-sm font-bold uppercase text-ink focus:bg-lime/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-ultra">' +
      SORTS.map(function (s) { return '<option value="' + s[0] + '">' + s[1] + '</option>'; }).join('') + '</select><span class="pointer-events-none absolute inset-y-0 right-0 flex w-11 items-center justify-center border-l-4 border-ink bg-ink text-lime">' + UI.icon('chevron-down', 'h-5 w-5') + '</span></div></div></div></div>' +
      '<div id="blog-grid" data-component="PostGrid" class="mt-12"></div><nav id="blog-pager" aria-label="Pagination" class="mt-12"></nav>' +
      '<aside data-reveal="cut" class="mt-16 flex flex-col gap-4 border-4 border-ink bg-alert p-5 text-white shadow-hard md:flex-row md:items-center md:justify-between"><p class="max-w-3xl font-medium">' + UI.icon('alert-circle', 'mr-2 inline h-5 w-5 align-text-bottom') + 'These articles are general information, not a diagnosis. If you or someone near you is in danger, call <strong>' + SITE.contact.nationalEmergency + '</strong> or go to the nearest hospital emergency department.</p>' +
      '<a href="tel:' + SITE.contact.nationalEmergency + '" class="' + UI.cls.btnWhite + ' shrink-0">' + UI.icon('phone', 'h-5 w-5') + 'Call ' + SITE.contact.nationalEmergency + '</a></aside></div></section>' + UI.tape(['Read', 'Reflect', 'Ask', 'Talk'], { tone: 'lime', rotate: '-rotate-1' });
    var chips = document.getElementById('blog-chips'), grid = document.getElementById('blog-grid'), pager = document.getElementById('blog-pager'), count = document.getElementById('blog-count'), sortEl = document.getElementById('blog-sort');
    chips.innerHTML = [{ slug: '', name: 'All', n: posts.length }].concat(SITE.blogCategories.map(function (c) { return { slug: c.slug, name: c.name, n: catCount(c.slug) }; })).map(function (c) {
      return '<button type="button" class="' + chipBase + '" aria-pressed="false" data-filter="' + UI.esc(c.slug) + '">' + UI.esc(c.name) + ' <span class="opacity-70">(' + c.n + ')</span></button>';
    }).join('');

    function syncUrl() {
      var p = new URLSearchParams(window.location.search);
      [['category', st.category], ['q', st.q], ['page', st.page > 1 ? String(st.page) : '']].forEach(function (kv) { if (kv[1]) p.set(kv[0], kv[1]); else p.delete(kv[0]); });
      var qs = p.toString();
      try { window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash); } catch (e) { /* file:// or sandbox */ }
    }
    function pagerHtml(pages) {
      if (pages < 2) return '';
      var btn = function (label, page, opts) {
        opts = opts || {};
        var cur = page === st.page && !opts.nav;
        return '<li><button type="button" data-page="' + page + '"' + (cur ? ' aria-current="page"' : '') + (opts.disabled ? ' disabled' : '') + ' aria-label="' + (opts.aria || 'Page ' + page) + '" class="flex h-12 min-w-[3rem] items-center justify-center border-4 border-ink px-3 font-mono text-sm font-bold ' + (cur ? 'bg-ink text-lime' : 'bg-white text-ink hover:bg-lime') + ' disabled:opacity-40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra">' + label + '</button></li>';
      };
      var out = '<ul class="flex flex-wrap items-center justify-center gap-3">' + btn(UI.icon('arrow-left', 'h-5 w-5'), st.page - 1, { nav: true, disabled: st.page <= 1, aria: 'Previous page' });
      for (var i = 1; i <= pages; i++) out += btn(UI.pad(i), i);
      return out + btn(UI.icon('arrow-right', 'h-5 w-5'), st.page + 1, { nav: true, disabled: st.page >= pages, aria: 'Next page' }) + '</ul>';
    }
    function update() {
      var list = filtered(), pages = Math.max(1, Math.ceil(list.length / PER));
      st.page = Math.min(Math.max(1, st.page), pages);
      var from = (st.page - 1) * PER, slice = list.slice(from, from + PER);
      UI.qsa('[data-filter]', chips).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === st.category)); });
      sortEl.value = st.sort;
      count.textContent = list.length ? 'Showing ' + (from + 1) + '–' + (from + slice.length) + ' of ' + list.length + (list.length === 1 ? ' article' : ' articles') + (st.q ? ' for “' + st.q + '”' : '') : 'No articles found';
      if (!list.length) {
        grid.innerHTML = '<div data-component="EmptyState" class="border-4 border-ink bg-white p-8 text-center shadow-hard md:p-14"><p class="' + UI.cls.h3 + '">No articles match that search</p><p class="mx-auto mt-4 max-w-xl leading-relaxed">Try a shorter word such as “sleep” or “exam”, or clear the filters to see every article.</p><button type="button" data-clear class="' + UI.cls.btnLime + ' mt-8">Clear filters</button></div>';
      } else {
        grid.innerHTML = '<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">' + slice.map(function (p) { return UI.postCard(p, { tone: 'light' }); }).join('') + '</div>';
      }
      pager.innerHTML = pagerHtml(pages);
      UI.mount(grid);
      syncUrl();
    }
    function reset(page) { st.page = page || 1; update(); }

    chips.addEventListener('click', function (e) {
      var b = e.target.closest('[data-filter]'); if (!b) return;
      st.category = b.getAttribute('data-filter'); reset();
    });
    sortEl.addEventListener('change', function () { st.sort = CMP[sortEl.value] ? sortEl.value : 'newest'; reset(); });
    pager.addEventListener('click', function (e) {
      var b = e.target.closest('[data-page]'); if (!b || b.disabled) return;
      reset(parseInt(b.getAttribute('data-page'), 10) || 1);
      document.getElementById('browse').scrollIntoView({ behavior: FX.reduced() ? 'auto' : 'smooth', block: 'start' });
    });
    grid.addEventListener('click', function (e) {
      if (!e.target.closest('[data-clear]')) return;
      st.category = ''; st.q = ''; document.getElementById('blog-q').value = ''; reset();
    });
    var qIn = document.getElementById('blog-q');
    qIn.addEventListener('input', UI.debounce(function () { st.q = qIn.value.trim().slice(0, 60); reset(); }, 250));
    document.getElementById('blog-search').addEventListener('submit', function (e) {
      e.preventDefault(); st.q = qIn.value.trim().slice(0, 60); reset();
      document.getElementById('browse').scrollIntoView({ behavior: FX.reduced() ? 'auto' : 'smooth', block: 'start' });
    });
    update();

    /* 4. topics: tags, most read, newsletter */
    var tagCount = {};
    posts.forEach(function (p) { p.tags.forEach(function (t) { tagCount[t] = (tagCount[t] || 0) + 1; }); });
    var tags = Object.keys(tagCount).sort(function (a, b) { return tagCount[b] - tagCount[a] || a.localeCompare(b); }).slice(0, 12);
    var popular = posts.slice().sort(CMP.popular).slice(0, 3);
    document.getElementById('topics-mount').outerHTML = '<section id="topics" data-section="topics" class="' + UI.cls.secInk + ' overflow-x-clip"><div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-grid-white [background-size:64px_64px] opacity-30"></div><div class="' + UI.cls.container + ' relative">' +
      UI.sectionHead({ index: '03', eyebrow: 'Topics and updates', title: 'Read what *others* read', tone: 'dark' }) +
      '<div class="mt-12 grid gap-10 lg:grid-cols-3"><div data-component="PopularTags"><h3 class="' + UI.cls.h3 + '">Popular tags</h3><ul class="mt-6 flex flex-wrap gap-3">' + tags.map(function (t) {
        return '<li><a href="blog.html?q=' + encodeURIComponent(t) + '" data-tag="' + UI.esc(t) + '" class="inline-flex min-h-[44px] items-center border-4 border-white px-4 py-2 font-mono text-xs font-bold uppercase text-white hover:bg-lime hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime">' + UI.esc(t) + '</a></li>'; }).join('') + '</ul></div>' +
      '<div data-component="MostRead"><h3 class="' + UI.cls.h3 + '">Most read</h3><ol class="mt-6 space-y-4">' + popular.map(function (p, i) {
        return '<li><a href="' + SITE.url.blog(p.slug) + '" class="group flex gap-4 border-4 border-white p-4 hover:bg-lime hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime"><span class="font-display text-4xl font-black leading-none text-lime group-hover:text-ink">' + UI.pad(i + 1) + '</span><span><span class="block font-bold leading-snug">' + UI.esc(p.title) + '</span><span class="mt-1 block font-mono text-xs uppercase opacity-80">' + p.views.toLocaleString('en-IN') + ' reads · ' + p.readMinutes + ' min</span></span></a></li>'; }).join('') + '</ol></div>' +
      '<div data-component="NewsletterForm" id="newsletter-box" class="self-start border-4 border-ink bg-white p-6 text-ink shadow-hard-lime"><h3 class="' + UI.cls.h3 + '">One calm email a month</h3><p class="mt-3 text-sm leading-relaxed">New articles from ' + UI.esc(SITE.doctor.shortName) + ' and nothing else. Leave whenever you like.</p>' +
      '<form id="newsletter-form" novalidate class="mt-6 space-y-4">' + UI.field({ label: 'Email address', name: 'email', type: 'email', required: true, autocomplete: 'email', tone: 'light' }) +
      '<button type="submit" class="' + UI.cls.btnLime + ' w-full">Subscribe' + UI.icon('send', 'h-5 w-5') + '</button></form></div></div></div></section>';
    UI.mount(document.getElementById('topics'));
    document.getElementById('topics').addEventListener('click', function (e) {
      var a = e.target.closest('[data-tag]'); if (!a) return;
      e.preventDefault(); st.q = a.getAttribute('data-tag'); st.category = ''; qIn.value = st.q; reset();
      document.getElementById('browse').scrollIntoView({ behavior: FX.reduced() ? 'auto' : 'smooth', block: 'start' });
    });
    var form = document.getElementById('newsletter-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!UI.validateForm(form)) return;
      var btn = form.querySelector('button[type="submit"]'), email = form.elements.email.value.trim();
      btn.disabled = true; btn.textContent = 'Subscribing…';
      SITE.submit('newsletter', { email: email }).then(function (res) {
        document.getElementById('newsletter-box').innerHTML = '<div role="status" data-component="FormSuccess"><span class="' + UI.cls.iconBox + '">' + UI.icon('check', 'h-6 w-6') + '</span><h3 class="mt-4 ' + UI.cls.h3 + '">You are on the list</h3><p class="mt-3 text-sm leading-relaxed">We will send the next article to ' + UI.esc(email) + '. Reference: <b class="font-mono">' + UI.esc(res.id) + '</b></p></div>';
      });
    });

    /* 5. CTA */
    document.getElementById('cta-mount').outerHTML = UI.ctaBand({ title: 'Reading helps. A *conversation* helps more', lead: 'If something in these articles sounds familiar, book a consultation in Gulshan, Bashundhara or online. Appointments are not for emergencies.' });
    UI.mount(document.getElementById('cta'));
  });
})();
