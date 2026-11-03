# PART 1 — Home, Sign-in & 404

## 1. Files
- `index.html` — home page shell: static hero, care-stack and why sections plus mount points
- `js/pages/home.js` — renders stats, about, services, chambers, quick booking, testimonials, blog, FAQs, crisis, CTA
- `signin.html` / `js/pages/signin.js` — split-screen sign-in, create account and forgot-password
- `404.html` / `js/pages/404.js` — not-found page with popular-page blocks and a service finder
- `docs/PART-1-home-signin-404.md` — this file

## 2. Pages → section ids → data-components
- Home `data-page="home"`: `hero` (HomeHero) · `ticker-stats` (StatsSection) · `about` (AboutSection) · `services` (ServicesSection) · `care-stack` (CareStack) · `why` (WhySection) · `chambers` (ChambersSection) · `book` (QuickBookSection, QuickBookForm) · `testimonials` (TestimonialsSection) · `blog` (BlogSection) · `faqs` (FaqSection) · `crisis` (CrisisSection) · `cta` (CtaBand)
- Sign-in `data-page="signin"`: `auth` (AuthSplit, AuthTabs, SignInForm, RegisterForm, ForgotPasswordForm) · `account-help` (AccountHelp) · `auth-safety` (AuthSafety)
- 404 `data-page="404"`: `notfound` (NotFoundHero) · `popular` (PopularPages)

## 3. Globals & data schema
No `window.X` globals are created. Home FAQs are a local array inside `home.js`:
`{ q: 'Do I need a referral to book?', a: 'No. You can book directly…' }`
Migration note: move to the FAQ table (`id`, `question`, `answer`, `category`) in Part 2.

## 4. Kit API used
- `UI`: ready, esc, icon, img, pad, mount, field, validateForm, sectionHead, statBlock, tape, serviceCard, chamberCard, postCard, testimonialCard, faqItem, ctaBand, toast, formatTime, cls.*
- `SITE` read: doctor, contact (phone, urgent, nationalEmergency), routes, url.service, url.appointment, servicesIndex, chambersIndex, blogIndex, testimonialsIndex, getService, getChamber, nextOpening, submit
- URLs linked out: about.html, services.html, service-details.html?slug=, chambers.html#slug, appointment.html?service&chamber&date&type, blog.html, blog-details.html?slug=, faqs.html
- Expected in: all pages link to index.html, signin.html and 404.html

## 5. Forms
| Form | Name | Payload |
|---|---|---|
| Sign in | `signin` | `{ identifier, remember }` (password never sent to the adapter) |
| Create account | `register` | `{ fullName, phone, email, acceptedTerms }` |
| Forgot password | `forgot-password` | `{ identifier }` |
| Quick booking | none (navigates to `SITE.url.appointment`) | `service, chamber, date, type` in the query string |

## 6. Parallax / motion / gradient techniques
- Home: data-parallax and data-parallax-rotate (hero objects, about block), data-parallax-img (portrait, cards), data-scroll-x (hero, why, book), data-progress (care-stack bar), sticky stack (care-stack), data-bg-shift + bg-grad-bands (why), data-scramble (hero eyebrow), counters, UI.tape, reveal slam/stamp/cut, live opening labels with blink
- Sign-in: data-parallax, data-scroll-x, data-bg-shift, reveal left/slam/stamp, tab cut animation
- 404: data-scroll-x, data-parallax, reveal stamp/slam

## 7. Next.js migration map
- `/` ← index.html (components: Hero, StatsBand, AboutPanel, ServiceFilterGrid, CareStack, WhyBento, ChamberCards, QuickBookForm, TestimonialCarousel, LatestPosts, FaqAccordion, CrisisBlock, CtaBand)
- `/signin` ← signin.html → `POST /api/auth/signin`, `/api/auth/register`, `/api/auth/forgot-password`
- `not-found.tsx` ← 404.html; service finder uses `/services/[slug]`
- Data: services, chambers, posts, testimonials come from the shared tables or API

## 8. Merge notes
Only Part 1 files are included. Home links to pages owned by Parts 2 to 5 using `SITE.routes` and `SITE.url.*` only. No shared kit file was changed.

## 9. QA result
`node tools/qa.js --part 1 -v` → ✓ ALL CLEAR · 0 warnings (index.html, signin.html, 404.html: 0 fail · 0 warn)

## 10. Known limits
- Sign-in and registration are front-end only (`SITE.submit` resolves after a short delay)
- Opening labels use the visitor's device clock
- jsdom cannot navigate, so redirects are verified only in a real browser
