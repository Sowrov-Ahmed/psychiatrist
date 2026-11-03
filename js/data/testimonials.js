/*
 * js/data/testimonials.js — Additional anonymised patient testimonials (first six live in SITE.testimonialsIndex)
 * Path: js/data/testimonials.js · Owner: Part 5 · Purpose: extra records merged by testimonials.js
 * Depends on: SITE (service slugs) · Exposes: window.TESTIMONIALS
 */
(function (window) {
  'use strict';
  window.TESTIMONIALS = [
    { id: 'tst-007', name: 'Rafiq U.', age: 31, area: 'Mohammadpur', serviceSlug: 'adhd-neurodevelopment', rating: 5, date: '2026-03-14', title: 'An explanation at last', outcome: 'Clearer focus at work', verified: true,
      quote: 'I assumed I was simply lazy. After a careful assessment I finally had an explanation for years of lost focus, and a practical plan for work. My manager noticed the difference within a few months, and so did I.' },
    { id: 'tst-008', name: 'Tasnim A.', age: 26, area: 'Dhanmondi', serviceSlug: 'psychotherapy-cbt', rating: 5, date: '2026-02-09', title: 'Sessions with a purpose', outcome: 'Calmer under pressure', verified: true,
      quote: 'Therapy here is structured, so every session had a purpose. My therapist gave me small tasks between visits and we reviewed them together. I now handle exam week and family pressure much better than before.' },
    { id: 'tst-009', name: 'Imran S.', age: 44, area: 'Gulshan', serviceSlug: 'depression-anxiety', rating: 4, date: '2026-01-20', title: 'Honest and unhurried', outcome: 'Understood his treatment', verified: true,
      quote: 'Waiting in the evening queue was long, and I wish the timing were better. But once inside, nothing was rushed. Dr. Rashed explained my medicine honestly, including the side effects, and he never once made me feel foolish for asking.' },
    { id: 'tst-010', name: 'Mahbuba N.', age: 38, area: 'Bashundhara R/A', serviceSlug: 'sleep-insomnia', rating: 5, date: '2025-12-04', title: 'A routine I can keep', outcome: 'Steadier sleep routine', verified: true,
      quote: 'Night shifts and school runs had wrecked my sleep. The programme gave me a simple routine, a fixed wake time and clear steps for bad nights. It is not magic, but my days are far steadier and I rely on far fewer tablets.' },
    { id: 'tst-011', name: 'Rumana P.', age: 47, area: 'Uttara', serviceSlug: 'bipolar-psychosis', rating: 5, date: '2026-04-27', title: 'The family felt prepared', outcome: 'Family involved in care', verified: true,
      quote: 'Treatment for my husband is long term, and the doctor never made us feel rushed. He involves the whole family, explains what to watch for and tells us when to call. We feel prepared now, not afraid.' },
    { id: 'tst-012', name: 'Parent of a 12-year-old', age: 40, area: 'Baridhara', serviceSlug: 'child-adolescent', rating: 5, date: '2026-05-08', title: 'Our daughter was heard', outcome: 'Back at school', verified: true,
      quote: 'Our daughter refused school for weeks. The doctor listened to her first, then to us, and wrote a short note so her teachers understood what she needed. She is attending again and sleeping better at night.' },
    { id: 'tst-013', name: 'Jahid K.', age: 33, area: 'Narayanganj', serviceSlug: 'addiction-recovery', rating: 5, date: '2026-06-11', title: 'Privacy and respect', outcome: 'Still in follow-up care', verified: true,
      quote: 'Confidentiality mattered most to me, and it was kept completely. The plan was firm but never harsh, and the follow-up visits keep me honest. I would not have started without knowing my privacy would be protected.' },
    { id: 'tst-014', name: 'Lamia T.', age: 28, area: 'Chattogram (online)', serviceSlug: 'depression-anxiety', rating: 4, date: '2026-07-22', title: 'Help without the long drive', outcome: 'Started care from home', verified: true,
      quote: 'The video link dropped once, but the doctor called back straight away and finished the session. Speaking from my own room, without a long journey to Dhaka, made it far easier to begin. I would only ask for clearer joining instructions.' },
    { id: 'tst-015', name: 'Nazmul B.', age: 39, area: 'Mohakhali', serviceSlug: 'ocd-trauma', rating: 5, date: '2026-09-15', title: 'A pace I controlled', outcome: 'Therapy at his own pace', verified: true,
      quote: 'I was afraid therapy would force me to face everything at once. Instead we moved in small steps that I agreed to every time. It took patience, but I feel in charge of my days again and I stopped hiding it from my family.' }
  ];
})(window);
