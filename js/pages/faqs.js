/*
 * js/pages/faqs.js — FAQs page script
 * Path: js/pages/faqs.js · Owner: Part 2 · Purpose: hero, searchable category-tabbed accordion, help block, FAQPage JSON-LD and CTA
 * Depends on: SITE, UI, FX (shared kit), js/data/faqs.js (window.FAQS) · Exposes: nothing
 */
(function () {
  'use strict';
  UI.ready(function () {
    var D = window.FAQS || { categories: [], items: [] };
    var cats = D.categories, items = D.items, C = SITE.contact;
    var catById = {}; cats.forEach(function (c) { catById[c.id] = c; });
    var current = 'all';

    function renderHero() {
      document.getElementById('hero-mount').innerHTML = UI.pageHero({
        index: '11', eyebrow: 'Questions answered', title: 'Straight answers, *no jargon*', tone: 'dusk',
        lead: items.length + ' plain answers about confidentiality, medicines, therapy, children and fees. If yours is not here, ask the desk and a person will reply.',
        crumbs: [{ label: 'Home', href: SITE.routes.home }, { label: 'FAQs' }],
        actionsHTML: '<a href="' + SITE.routes.contact + '" class="' + UI.cls.btnLime + '">Ask us directly' + UI.icon('arrow-right', 'h-5 w-5') + '</a><a href="' + SITE.routes.appointment + '" class="' + UI.cls.btnWhite + '">Book Appointment</a>'
      });
    }

    function rowsFor(list, prefix) {
      return list.map(function (q) {
        var text = (q.question + ' ' + q.answer).toLowerCase();
        return '<div data-faq-row data-text="' + UI.esc(text) + '">' + UI.faqItem({ id: prefix + '-' + q.id, question: q.question, answerHTML: '<p>' + UI.esc(q.answer) + '</p>', tone: 'light', open: prefix === 'all' && q.id === items[0].id }) + '</div>';
      }).join('<div class="h-4"></div>');
    }

    function panel(key, label, list, i) {
      return '<div role="tabpanel" id="faq-panel-' + key + '" data-tab-panel="' + key + '" aria-labelledby="faq-tab-' + key + '" class="' + (i ? 'hidden ' : '') + 'mt-8"><p class="mb-5 ' + UI.cls.mono + '">' + UI.esc(label) + ' · ' + list.length + ' questions</p><div data-accordion data-accordion-single>' + rowsFor(list, key) + '</div></div>';
    }

    function renderBrowser() {
      var tabs = [{ key: 'all', label: 'All', list: items }].concat(cats.map(function (c) { return { key: c.slug, label: c.name, list: items.filter(function (q) { return q.categoryId === c.id; }) }; }));
      var tabBtns = tabs.map(function (t, i) { return '<button type="button" role="tab" id="faq-tab-' + t.key + '" data-tab="' + t.key + '" aria-selected="' + (i === 0) + '" aria-controls="faq-panel-' + t.key + '" class="' + UI.cls.tab + '">' + UI.esc(t.label) + ' (' + t.list.length + ')</button>'; }).join('');
      var side = '<aside aria-label="Still have a question" class="lg:sticky lg:top-28"><div data-reveal="stamp" class="border-4 border-ink bg-lime p-6 text-ink shadow-hard"><p class="' + UI.cls.mono + '">Still have a question?</p><h3 class="mt-3 ' + UI.cls.h3 + '">Ask a person, not a search box</h3><p class="mt-4 leading-relaxed">The appointment desk answers calls and messages Saturday to Thursday, 9:00 AM to 8:00 PM.</p>' +
        '<div class="mt-6 flex flex-col gap-4"><a href="tel:' + C.phone.e164 + '" class="' + UI.cls.btnInk + '">' + UI.icon('phone', 'h-5 w-5') + UI.esc(C.phone.display) + '</a><a href="' + C.whatsappUrl + '" target="_blank" rel="noopener noreferrer" class="' + UI.cls.btnWhite + '">' + UI.icon('message-circle', 'h-5 w-5') + 'WhatsApp</a><a href="' + SITE.routes.contact + '" class="' + UI.cls.btnOutline + '">Contact page' + UI.icon('arrow-right', 'h-5 w-5') + '</a></div></div>' +
        '<div class="mt-8 border-4 border-ink bg-white p-6 text-ink shadow-hard-sm"><p id="helpful-label" class="' + UI.cls.mono + '">Was this page helpful?</p><div id="helpful-box" class="mt-4 flex gap-3" role="group" aria-labelledby="helpful-label"><button type="button" data-helpful="yes" class="' + UI.cls.chip + '">Yes</button><button type="button" data-helpful="no" class="' + UI.cls.chip + '">Not quite</button></div></div></aside>';
      document.getElementById('faq-mount').outerHTML = '<section id="faq-browser" data-section="faq-browser" class="' + UI.cls.secWhite + ' overflow-x-clip"><div aria-hidden="true" data-parallax="-0.15" class="pointer-events-none absolute -right-6 top-24 hidden w-44 md:block">' + UI.deco(SITE.img.objects.squiggle, 'w-full') + '</div><div class="' + UI.cls.container + ' relative">' +
        UI.sectionHead({ index: '01', eyebrow: 'Browse and search', title: 'Find *your* question', lead: 'Type a word, or pick a category. Every answer is written for patients and families in Bangladesh, not for textbooks.', tone: 'light' }) +
        '<div class="mt-12 grid items-start gap-10 lg:grid-cols-[1fr_22rem]"><div data-component="FaqBrowser"><div role="search"><label for="faq-search" class="mb-2 block ' + UI.cls.mono + '">Search the questions</label><div class="relative"><span class="pointer-events-none absolute inset-y-0 left-0 flex w-14 items-center justify-center border-r-4 border-ink bg-ink text-lime">' + UI.icon('search', 'h-5 w-5') + '</span>' +
        '<input id="faq-search" type="search" autocomplete="off" aria-describedby="faq-hint faq-count" class="w-full border-4 border-ink bg-white py-3.5 pl-20 pr-4 font-mono text-base text-ink focus:bg-lime/30 focus:shadow-hard-ultra focus:outline-none"></div><p id="faq-hint" class="mt-2 text-sm text-ink/80">Try a word such as confidential, bKash, sleeping or exam.</p><p id="faq-count" role="status" aria-live="polite" class="mt-3 ' + UI.cls.mono + '"></p></div>' +
        '<div data-tabs id="faq-tabs" class="mt-6"><div role="tablist" aria-label="Question categories" class="flex flex-wrap gap-3">' + tabBtns + '</div>' + tabs.map(function (t, i) { return panel(t.key, t.label, t.list, i); }).join('') + '</div>' +
        '<div id="faq-empty" class="mt-8 hidden border-4 border-ink bg-lime p-6 text-ink shadow-hard"><p class="' + UI.cls.h3 + '">No match yet</p><p class="mt-3 leading-relaxed">Try one short word, such as “fees” or “sleep”, or clear the search and browse by category. You can also ask the desk directly.</p><button type="button" id="faq-clear" class="mt-5 ' + UI.cls.btnInk + '">Clear search</button></div></div>' + side + '</div></div></section>' +
        UI.tape(['Plain answers', 'Confidential care', 'Fees stated upfront', 'Sat – Thu desk'], { tone: 'lime', rotate: '-rotate-1' });
      UI.mount(document.getElementById('faq-browser'));
    }

    function bindBrowser() {
      var root = document.getElementById('faq-tabs'), input = document.getElementById('faq-search'), count = document.getElementById('faq-count'), empty = document.getElementById('faq-empty');
      function update() {
        var q = input.value.trim().toLowerCase(), words = q ? q.split(/\s+/) : [];
        UI.qsa('[data-faq-row]').forEach(function (r) { var t = r.getAttribute('data-text'); r.classList.toggle('hidden', !words.every(function (w) { return t.indexOf(w) > -1; })); });
        var pn = document.getElementById('faq-panel-' + current), shown = pn ? UI.qsa('[data-faq-row]:not(.hidden)', pn).length : 0, total = pn ? UI.qsa('[data-faq-row]', pn).length : 0;
        empty.classList.toggle('hidden', shown > 0);
        count.textContent = q ? shown + ' of ' + total + ' questions match “' + input.value.trim() + '”' : total + ' questions' + (current === 'all' ? ' across every category' : ' in this category');
      }
      root.addEventListener('tabchange', function (e) { current = e.detail.id; update(); });
      input.addEventListener('input', UI.debounce(function () { if (input.value.trim() && current !== 'all' && root.showTab) root.showTab('all'); update(); }, 150));
      document.getElementById('faq-clear').addEventListener('click', function () { input.value = ''; update(); input.focus(); });
      function fromHash() { var h = decodeURIComponent(window.location.hash.replace('#', '')); if (h && root.showTab && (h === 'all' || cats.some(function (c) { return c.slug === h; }))) root.showTab(h); }
      window.addEventListener('hashchange', fromHash); fromHash(); update();
      document.getElementById('helpful-box').addEventListener('click', function (e) {
        var b = e.target.closest('[data-helpful]'); if (!b) return;
        UI.qsa('[data-helpful]').forEach(function (x) { x.disabled = true; });
        UI.toast(b.getAttribute('data-helpful') === 'yes' ? 'Thank you. We are glad it helped.' : 'Thank you. Please ask the desk and we will improve this page.', b.getAttribute('data-helpful') === 'yes' ? 'success' : 'info');
      });
    }

    function renderJsonLd() {
      var ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map(function (q) { return { '@type': 'Question', name: q.question, acceptedAnswer: { '@type': 'Answer', text: q.answer } }; }) };
      var s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(ld); document.head.appendChild(s);
    }

    function renderCta() {
      document.getElementById('cta-mount').outerHTML = UI.ctaBand({ title: 'Ready to *talk* it through?', lead: 'Book a first consultation in Gulshan, Bashundhara or online, or call the desk and ask anything you like before you decide.' });
      UI.mount(document.getElementById('cta'));
    }

    renderHero(); renderBrowser(); bindBrowser(); renderJsonLd(); renderCta();
    UI.mount(document.getElementById('main'));
  });
})();
