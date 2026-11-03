/*
 * js/pages/blog-details.js — Single article: hero, editorial body, sticky aside (contents, takeaways, share), related content
 * Path: js/pages/blog-details.js · Owner: Part 5 · Purpose: renders blog-details.html?slug= from SITE.blogIndex + BLOGS
 * Depends on: SITE, UI, FX (kit), window.BLOGS (js/data/blogs.js) · Exposes: nothing
 */
(function () {
  'use strict';
  UI.ready(function () {
    var TONES = { 'depression-anxiety': 'ultra', sleep: 'ink', 'teens-children': 'lime', 'ocd-trauma': 'tang', medication: 'dusk', 'stigma-support': 'ultra', crisis: 'ink' };
    var slug = UI.getParam('slug') || '';
    var base = SITE.getPost(slug);
    var mounts = ['article-mount', 'services-mount', 'more-mount'];
    var hero = document.getElementById('hero-mount');

    function mergePost(p) {
      var d = (window.BLOGS || []).filter(function (b) { return b.slug === p.slug; })[0] || {};
      return Object.assign({ tags: [], views: 0, keyTakeaways: [], content: [], relatedSlugs: [], serviceSlugs: [], summary: p.excerpt }, p, d);
    }
    function meta(sel, val) { var el = document.querySelector(sel); if (el) el.setAttribute('content', val); }
    function inline(t) { return UI.esc(t).replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>'); }

    /* ---------- unknown slug: friendly not-found ---------- */
    if (!base) {
      document.title = 'Article not found | Dr. Rashed Anwar Khan – Psychiatrist';
      hero.innerHTML = UI.pageHero({
        index: '404', eyebrow: 'Article not found', title: 'We could not find that *article*', tone: 'ink',
        lead: 'The link may be old or mistyped. Every published article is on the blog page, and the newest ones are listed below.',
        crumbs: [{ label: 'Home', href: SITE.routes.home }, { label: 'Blog', href: SITE.routes.blog }, { label: 'Not found' }],
        actionsHTML: '<a href="' + SITE.routes.blog + '" class="' + UI.cls.btnLime + '">' + UI.icon('arrow-left', 'h-5 w-5') + 'Back to all articles</a>'
      });
      document.getElementById(mounts[0]).outerHTML = '<section id="not-found" data-section="not-found" class="' + UI.cls.secWhite + '"><div class="' + UI.cls.container + '">' +
        UI.sectionHead({ index: '01', eyebrow: 'Latest articles', title: 'Try one of these *instead*', tone: 'light' }) +
        '<div class="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">' + SITE.blogIndex.slice().sort(function (a, b) { return b.date.localeCompare(a.date); }).slice(0, 3).map(function (p) { return UI.postCard(p, { tone: 'light' }); }).join('') + '</div></div></section>';
      mounts.slice(1).forEach(function (id) { var m = document.getElementById(id); if (m) m.remove(); });
      document.getElementById('cta-mount').outerHTML = UI.ctaBand({ title: 'Need to talk to *someone*?', lead: 'Book a consultation in Gulshan, Bashundhara or online. Appointments are not for emergencies; in an emergency call ' + SITE.contact.nationalEmergency + '.' });
      UI.mount(document);
      return;
    }

    /* ---------- found: merge, meta, JSON-LD ---------- */
    var post = mergePost(base);
    var url = window.location.href.split('#')[0];
    document.title = post.title + (post.title.length + 17 <= 70 ? ' | Dr. Rashed Khan' : '');
    meta('meta[name="description"]', post.summary);
    meta('meta[property="og:title"]', post.title);
    meta('meta[property="og:description"]', post.summary);
    try {
      var ld = document.createElement('script');
      ld.type = 'application/ld+json';
      ld.textContent = JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.summary, datePublished: post.date, dateModified: post.date,
        articleSection: post.category, keywords: post.tags.join(', '), image: new URL(post.image, window.location.href).href,
        author: { '@type': 'Person', name: SITE.doctor.name, jobTitle: SITE.doctor.title }, publisher: { '@type': 'Organization', name: SITE.brand.name }
      }).replace(/</g, '\\u003c');
      document.head.appendChild(ld);
    } catch (e) { /* JSON-LD is optional */ }

    /* ---------- hero ---------- */
    var chip = 'border-4 border-ink bg-white px-3 py-2 font-mono text-xs font-bold uppercase text-ink';
    hero.innerHTML = UI.pageHero({
      index: UI.pad(SITE.blogIndex.indexOf(base) + 1), eyebrow: post.category, title: post.title, tone: TONES[post.categorySlug] || 'ultra', lead: post.excerpt,
      crumbs: [{ label: 'Home', href: SITE.routes.home }, { label: 'Blog', href: SITE.routes.blog }, { label: post.category, href: SITE.url.blogCategory(post.categorySlug) }, { label: post.title }],
      actionsHTML: '<span class="' + chip + '">' + UI.formatDate(post.date, 'long') + '</span><span class="' + chip + '">' + post.readMinutes + ' min read</span><span class="' + chip + '">' + post.views.toLocaleString('en-IN') + ' reads</span>'
    });

    /* ---------- article body ---------- */
    var h2n = 0, firstP = true;
    var toc = [];
    var body = post.content.map(function (b) {
      if (b.type === 'h2') {
        h2n++; toc.push({ id: 'part-' + h2n, text: b.text });
        return '<h2 id="part-' + h2n + '" class="mt-14 scroll-mt-32 border-t-4 border-ink pt-6 ' + UI.cls.h3 + ' !text-3xl md:!text-4xl"><span class="mb-3 block ' + UI.cls.mono + ' text-ultra">§' + UI.pad(h2n) + '</span>' + UI.esc(b.text) + '</h2>';
      }
      if (b.type === 'p') {
        var drop = firstP ? ' first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-[5.5rem] first-letter:font-black first-letter:leading-[0.8] first-letter:text-ultra' : '';
        firstP = false;
        return '<p class="mt-6 max-w-[68ch] text-lg leading-[1.8]' + drop + '">' + inline(b.text) + '</p>';
      }
      if (b.type === 'ul') {
        return '<ul class="mt-6 max-w-[68ch] space-y-3 border-4 border-ink bg-concrete p-5 shadow-hard-sm">' + (b.items || []).map(function (i) { return '<li class="flex gap-3 leading-relaxed"><span aria-hidden="true" class="mt-2.5 h-3 w-3 shrink-0 bg-ink"></span><span>' + inline(i) + '</span></li>'; }).join('') + '</ul>';
      }
      if (b.type === 'ol') {
        return '<ol class="mt-6 max-w-[68ch] space-y-3 border-4 border-ink bg-concrete p-5 shadow-hard-sm">' + (b.items || []).map(function (i, n) { return '<li class="flex gap-4 leading-relaxed"><span aria-hidden="true" class="font-display text-2xl font-black leading-none text-ultra">' + UI.pad(n + 1) + '</span><span>' + inline(i) + '</span></li>'; }).join('') + '</ol>';
      }
      if (b.type === 'quote') {
        return '<figure class="mt-8 max-w-[68ch] border-l-8 border-ultra bg-white py-2 pl-6"><blockquote class="font-display text-2xl font-black uppercase leading-tight tracking-tight">' + UI.esc(b.text) + '</blockquote>' + (b.cite ? '<figcaption class="mt-3 ' + UI.cls.mono + '">' + UI.esc(b.cite) + '</figcaption>' : '') + '</figure>';
      }
      if (b.type === 'callout') {
        var warn = b.tone === 'warning';
        return '<aside class="relative mt-10 max-w-[68ch] border-4 border-ink p-6 pt-8 text-ink shadow-hard ' + (warn ? 'bg-tang' : 'bg-lime') + '"><span class="' + UI.cls.stickerCls + ' absolute -top-4 left-4 bg-white ' + (warn ? 'rotate-2' : '-rotate-2') + '">' + (warn ? 'Important' : 'Tip') + '</span><p class="' + UI.cls.h3 + ' !text-xl">' + UI.esc(b.title) + '</p><p class="mt-3 leading-relaxed">' + inline(b.text) + '</p></aside>';
      }
      return '';
    }).join('');

    /* tags, author, disclaimer, crisis note */
    var tagsHtml = post.tags.map(function (t) { return '<li><a href="blog.html?q=' + encodeURIComponent(t) + '" class="inline-flex min-h-[44px] items-center border-4 border-ink bg-white px-3 py-2 font-mono text-xs font-bold uppercase hover:bg-lime focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra">#' + UI.esc(t) + '</a></li>'; }).join('');
    var d = SITE.doctor;
    var after = '<ul class="mt-14 flex flex-wrap gap-3" aria-label="Tags">' + tagsHtml + '</ul>' +
      '<div data-component="AuthorBlock" data-reveal="cut" class="mt-10 grid border-4 border-ink bg-white shadow-hard sm:grid-cols-[10rem_1fr]"><div class="relative aspect-square border-b-4 border-ink bg-ultra sm:border-b-0 sm:border-r-4">' + UI.img(SITE.img.portrait, 'Illustrated portrait of ' + d.name, 'absolute inset-0 h-full w-full object-cover', { w: 400, h: 400 }) + '</div>' +
      '<div class="p-5 md:p-6"><p class="' + UI.cls.mono + '">Written by</p><p class="' + UI.cls.h3 + ' mt-2">' + UI.esc(d.name) + '</p><p class="mt-1 text-sm font-medium">' + UI.esc(d.title) + ' · BMDC ' + UI.esc(d.bmdcNo) + '</p><p class="mt-3 leading-relaxed">' + d.experienceYears + ' years treating mood, anxiety, sleep and addiction in Dhaka. He writes in plain language so that families can understand and act.</p>' +
      '<a href="' + SITE.routes.about + '" class="mt-4 inline-flex min-h-[44px] items-center gap-2 font-mono text-xs font-black uppercase underline underline-offset-4 hover:text-ultra">About the doctor' + UI.icon('arrow-right', 'h-4 w-4') + '</a></div></div>' +
      '<p class="mt-8 max-w-[68ch] border-4 border-ink bg-concrete p-5 text-sm leading-relaxed"><b>General information, not a diagnosis.</b> This article is for education and cannot diagnose you or replace a consultation. Treatment decisions should be made with your own doctor.</p>' +
      '<p class="mt-4 max-w-[68ch] border-4 border-ink bg-alert p-5 font-medium leading-relaxed text-white">' + UI.icon('alert-circle', 'mr-2 inline h-5 w-5 align-text-bottom') + 'In an emergency, or if someone is in danger, call <strong>' + SITE.contact.nationalEmergency + '</strong> or go to the nearest hospital emergency department and stay with the person.</p>';

    /* aside: contents, takeaways, share, booking */
    var tocList = toc.map(function (t, i) { return '<li><a href="#' + t.id + '" data-toc-link class="flex min-h-[44px] items-center gap-3 border-b-4 border-ink px-4 py-2 text-sm font-bold hover:bg-lime focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-ultra"><span class="font-mono text-xs">' + UI.pad(i + 1) + '</span><span>' + UI.esc(t.text) + '</span></a></li>'; }).join('');
    var shareBtn = 'flex h-12 w-12 items-center justify-center border-4 border-ink bg-white text-ink shadow-hard-sm transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-lime active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra';
    var enc = encodeURIComponent(url), encT = encodeURIComponent(post.title);
    var svc = SITE.getService(post.serviceSlugs[0]);
    var aside = '<aside data-component="ArticleAside" class="space-y-6 lg:sticky lg:top-28">' +
      '<nav aria-label="Table of contents" class="border-4 border-ink bg-white shadow-hard-sm"><button type="button" id="toc-toggle" aria-expanded="false" aria-controls="toc-list" class="flex w-full items-center justify-between border-b-4 border-ink bg-ink px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-wider text-lime lg:pointer-events-none">On this page<span class="lg:hidden">' + UI.icon('chevron-down', 'h-5 w-5') + '</span></button><ol id="toc-list" class="hidden lg:block">' + tocList + '</ol></nav>' +
      '<div class="border-4 border-ink bg-lime p-5 shadow-hard-sm"><p class="' + UI.cls.mono + '">Key takeaways</p><ul class="mt-4 space-y-3">' + post.keyTakeaways.map(function (k) { return '<li class="flex gap-3 text-sm font-medium leading-snug"><span aria-hidden="true" class="mt-1.5 h-3 w-3 shrink-0 bg-ink"></span><span>' + UI.esc(k) + '</span></li>'; }).join('') + '</ul></div>' +
      '<div class="border-4 border-ink bg-white p-5 shadow-hard-sm"><p class="' + UI.cls.mono + '">Share this article</p><div class="mt-4 flex flex-wrap gap-3">' +
      '<button type="button" id="copy-link" aria-label="Copy link to this article" class="' + shareBtn + '">' + UI.icon('copy', 'h-5 w-5') + '</button>' +
      '<a href="https://wa.me/?text=' + encT + '%20' + enc + '" target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp (opens in a new tab)" class="' + shareBtn + '">' + UI.icon('message-circle', 'h-5 w-5') + '</a>' +
      '<a href="https://www.facebook.com/sharer/sharer.php?u=' + enc + '" target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook (opens in a new tab)" class="' + shareBtn + '">' + UI.icon('facebook', 'h-5 w-5') + '</a>' +
      '<a href="https://www.linkedin.com/sharing/share-offsite/?url=' + enc + '" target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn (opens in a new tab)" class="' + shareBtn + '">' + UI.icon('linkedin', 'h-5 w-5') + '</a></div></div>' +
      '<div class="border-4 border-ink bg-ink p-5 text-white shadow-hard-lime"><p class="' + UI.cls.mono + ' text-lime">Book a consultation</p><p class="mt-3 leading-relaxed">' + (svc ? 'Talk through ' + UI.esc(svc.name.toLowerCase()) + ' with ' : 'Talk it through with ') + UI.esc(d.shortName) + ' in Gulshan, Bashundhara or online.</p>' +
      '<a href="' + SITE.url.appointment({ service: post.serviceSlugs[0] }) + '" class="' + UI.cls.btnLime + ' mt-5 w-full">Book Appointment' + UI.icon('arrow-right', 'h-5 w-5') + '</a></div></aside>';

    document.getElementById(mounts[0]).outerHTML = '<section id="article" data-section="article" class="' + UI.cls.secWhite + '"><div class="' + UI.cls.container + '">' +
      '<div data-parallax-img class="relative aspect-[16/8] overflow-hidden border-4 border-ink bg-concrete shadow-hard">' + UI.img(post.image, post.title, 'absolute inset-0 h-[125%] w-full object-cover', { w: 1200, h: 600, eager: true }) + '</div>' +
      '<div class="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]"><article data-component="ArticleBody" class="min-w-0">' + body + after + '</article>' + aside + '</div></div></section>';

    /* ---------- related services ---------- */
    var svcCards = post.serviceSlugs.map(function (s) { return SITE.getService(s); }).filter(Boolean).map(function (s, i) { return '<div>' + UI.serviceCard(s, { tone: 'light', index: i + 1 }) + '</div>'; }).join('');
    document.getElementById(mounts[1]).outerHTML = '<section id="related-services" data-section="related-services" class="' + UI.cls.secConcrete + ' overflow-x-clip"><div aria-hidden="true" data-scroll-x="0.5" class="pointer-events-none absolute left-0 top-4 whitespace-nowrap font-display text-[14vw] font-black uppercase leading-none ' + UI.cls.outline + ' opacity-20">Care — Support — Follow-up — Care — Support</div><div class="' + UI.cls.container + ' relative">' +
      UI.sectionHead({ index: '02', eyebrow: 'Related care', title: 'Help for what you just *read*', tone: 'light' }) +
      '<div class="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">' + svcCards + '</div></div></section>';

    /* ---------- prev/next + related articles ---------- */
    var ordered = SITE.blogIndex.slice().sort(function (a, b) { return b.date.localeCompare(a.date); }), at = ordered.indexOf(base);
    var navBlock = function (p, label, icon, side) {
      if (!p) return '';
      return '<a href="' + SITE.url.blog(p.slug) + '" class="group flex flex-col border-4 border-white bg-ink p-6 text-white transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:bg-lime hover:text-ink hover:shadow-hard-lime focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime ' + side + '"><span class="inline-flex items-center gap-2 ' + UI.cls.mono + '">' + icon + label + '</span><span class="mt-4 font-display text-xl font-black uppercase leading-tight tracking-tight md:text-2xl">' + UI.esc(p.title) + '</span><span class="mt-3 font-mono text-xs uppercase opacity-80">' + UI.esc(p.category) + ' · ' + p.readMinutes + ' min</span></a>';
    };
    var related = post.relatedSlugs.map(function (s) { return SITE.getPost(s); }).filter(Boolean);
    document.getElementById(mounts[2]).outerHTML = UI.tape(['Read', 'Reflect', 'Ask', 'Talk'], { tone: 'lime', rotate: '-rotate-1' }) +
      '<section id="keep-reading" data-section="keep-reading" class="' + UI.cls.secInk + '"><div class="' + UI.cls.container + '">' +
      UI.sectionHead({ index: '03', eyebrow: 'Keep reading', title: 'More from the *journal*', tone: 'dark' }) +
      '<nav aria-label="Previous and next articles" class="mt-12 grid gap-6 md:grid-cols-2">' + navBlock(ordered[at - 1], 'Newer article', UI.icon('arrow-left', 'h-4 w-4'), 'md:col-start-1') + navBlock(ordered[at + 1], 'Older article', UI.icon('arrow-right', 'h-4 w-4'), 'md:col-start-2 md:text-right') + '</nav>' +
      '<h3 class="mt-16 ' + UI.cls.h3 + '">Related articles</h3><div class="mt-8 grid gap-8 md:grid-cols-2">' + related.map(function (p) { return UI.postCard(p, { tone: 'dark' }); }).join('') + '</div></div></section>';
    document.getElementById('cta-mount').outerHTML = UI.ctaBand({ title: 'Ready to *talk* it through?', lead: 'Book a first consultation in Gulshan, Bashundhara or online. Evening and Thursday and Friday online slots are available. Appointments are not for emergencies.' });
    UI.mount(document);

    /* ---------- behaviours: copy link, contents toggle, scroll-spy ---------- */
    document.getElementById('copy-link').addEventListener('click', function () { UI.copy(url); });
    var tg = document.getElementById('toc-toggle'), list = document.getElementById('toc-list');
    tg.addEventListener('click', function () { var open = tg.getAttribute('aria-expanded') !== 'true'; tg.setAttribute('aria-expanded', String(open)); list.classList.toggle('hidden', !open); });
    var links = UI.qsa('[data-toc-link]');
    if ('IntersectionObserver' in window && links.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (a) { var on = a.getAttribute('href') === '#' + en.target.id; a.classList.toggle('bg-lime', on); if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
        });
      }, { rootMargin: '-15% 0px -75% 0px' });
      toc.forEach(function (t) { var h = document.getElementById(t.id); if (h) io.observe(h); });
    }
  });
})();
