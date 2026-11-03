/*
 * js/pages/404.js — Not-found page renderer
 * Path: js/pages/404.js · Owner: Part 1 · Purpose: action buttons, popular-page blocks and a service finder
 * Depends on: SITE, UI (shared kit) · Exposes: nothing
 */
(function () {
  'use strict';
  UI.ready(function () {
    var cls = UI.cls, R = SITE.routes;
    var hm = document.getElementById('hero-mount');
    if (hm) hm.remove();

    document.getElementById('nf-actions').innerHTML =
      '<a href="' + R.home + '" class="' + cls.btnLime + '">' + UI.icon('home', 'h-5 w-5') + 'Go to home</a>' +
      '<a href="' + R.appointment + '" class="' + cls.btnWhite + '">Book Appointment' + UI.icon('arrow-right', 'h-5 w-5') + '</a>';

    document.getElementById('nf-head').innerHTML = UI.sectionHead({ index: '02', eyebrow: 'Popular pages', title: 'Try one of *these*', tone: 'light' });

    var pages = [
      ['Services', 'Eight kinds of care, with prices.', R.services, 'bg-lime'],
      ['Chambers', 'Gulshan, Bashundhara and online.', R.chambers, 'bg-tang'],
      ['Blog', 'Clear guides from the doctor.', R.blog, 'bg-lilac'],
      ['FAQs', 'Answers to common questions.', R.faqs, 'bg-concrete']
    ];
    var grid = document.getElementById('nf-pages');
    grid.innerHTML = pages.map(function (p, i) {
      return '<a data-reveal="stamp" data-delay="' + i * 100 + '" href="' + p[2] + '" class="group flex h-full flex-col border-4 border-ink ' + p[3] + ' p-6 text-ink shadow-hard transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#0A0A0A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ultra">' +
        '<span class="' + cls.mono + '">\u2116 ' + UI.pad(i + 1) + '</span><span class="' + cls.h3 + ' mt-4">' + UI.esc(p[0]) + '</span><span class="mt-3 leading-relaxed">' + UI.esc(p[1]) + '</span>' +
        '<span class="mt-auto pt-6">' + UI.icon('arrow-right', 'h-6 w-6 transition-transform group-hover:translate-x-1') + '</span></a>';
    }).join('');

    var care = document.getElementById('nf-care');
    care.innerHTML = '<h2 class="' + cls.h3 + '">Looking for care?</h2><p class="mt-2 leading-relaxed">Choose a service and we will take you to its page.</p><div class="mt-5">' +
      UI.field({ label: 'Service', name: 'service', type: 'select', options: SITE.servicesIndex.map(function (s) { return { value: s.slug, label: s.name }; }) }) + '</div>';
    care.querySelector('select').addEventListener('change', function (e) {
      var s = SITE.getService(e.target.value);
      if (s) window.location.href = SITE.url.service(s.slug);
    });
    UI.mount(document.getElementById('popular'));
  });
})();
