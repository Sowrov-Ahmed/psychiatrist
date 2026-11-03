# PART 3 — Services & Service Details

## 1. Files
| Path | Purpose |
|---|---|
| `services.html` | Catalogue page shell; static "pathway" sticky-stack section |
| `service-details.html` | Detail page shell (hero, detail, explore, CTA mounts) |
| `js/pages/services.js` | Hero, filterable catalogue, fees table, tape, CTA |
| `js/pages/service-details.js` | Merges index + detail by `?slug=`; renders all sections, scroll-spy, not-found panel |
| `js/data/services.js` | `window.SERVICES` — 8 DETAIL records |
| `docs/PART-3-services.md` | This file |

## 2. Pages → section ids → data-components
- **services**: `page-hero` (PageHero) · `catalogue` (ServiceCatalogue; grid of ServiceCard) · `pathway` (TreatmentPathway) · `fees` (FeesExplained) · `cta` (CtaBand)
- **service-details**: `page-hero` · `detail` (ServiceDetail) containing `overview`, `signs`, `who-it-helps`, `approach`, `benefits`, `considerations`, `timeline`, `pricing`, `faqs`, `related`; BookingBlock aside · `explore` (ServiceNav) · `cta`
- Unknown slug: `page-hero` + `not-found` + `cta`.

## 3. Globals & data schema
Only `window.SERVICES`. Detail records share `id`/`slug` with `SITE.servicesIndex`; no name, short, price, image or icon repeated.
```
{ id:'svc-006', slug:'sleep-insomnia', tagline:'…', overview:[p1,p2], signs:[5],
  whoItHelps:{ ideal:[3], notFor:[2] },
  approach:{ format, duration, steps:[{title,description}×5] },
  benefits:[{title,description}×4], considerations:[×3],
  timeline:[{phase,title,description}×4],
  pricing:{ inclusions:[4], exclusions:[3], note, paymentOptions:[…] },
  faqs:[{id:'sfaq-016',question,answer}×3], relatedSlugs:[2], relatedBlogSlugs:[1–2] }
```
Related slugs:
| Service | relatedSlugs | relatedBlogSlugs |
|---|---|---|
| depression-anxiety | psychotherapy-cbt, sleep-insomnia | stress-or-depression-warning-signs, antidepressants-myths-and-facts |
| ocd-trauma | psychotherapy-cbt, depression-anxiety | ocd-is-not-about-being-neat |
| bipolar-psychosis | depression-anxiety, sleep-insomnia | when-to-seek-emergency-psychiatric-help, mental-health-stigma-in-bangladesh |
| adhd-neurodevelopment | child-adolescent, psychotherapy-cbt | exam-pressure-teen-mental-health |
| child-adolescent | adhd-neurodevelopment, psychotherapy-cbt | exam-pressure-teen-mental-health, how-to-support-someone-with-anxiety |
| sleep-insomnia | depression-anxiety, psychotherapy-cbt | insomnia-why-you-cant-sleep |
| addiction-recovery | depression-anxiety, psychotherapy-cbt | mental-health-stigma-in-bangladesh, when-to-seek-emergency-psychiatric-help |
| psychotherapy-cbt | depression-anxiety, ocd-trauma | stress-or-depression-warning-signs, insomnia-why-you-cant-sleep |

## 4. Kit API used
UI: ready, getParam, esc, emph, debounce, pad, formatBDT, formatBDTRange, icon, img, badge, tape, sectionHead, pageHero, serviceCard, postCard, faqItem, ctaBand, mount, cls.*.
SITE read: servicesIndex, chambersIndex (fees, chamberName), getService, getPost, url.service, url.appointment, routes.*, contact.phone, contact.whatsappUrl.
URLs out: `appointment.html?service=<slug>`, `service-details.html?slug=`, `blog-details.html?slug=`, `services.html`. URL in: `services.html?category=`, `service-details.html?slug=`.

## 5. Forms
None. Catalogue search and sort are client-side controls only.

## 6. Techniques per page
- services: PageHero parallax, `data-scroll-x` outline text (catalogue), `data-parallax-img` card frames, filter with `data-reveal` cuts, sticky stack (pathway), `data-progress` bar, `data-scroll-x` reverse, halftone `data-parallax`, ticker tape, `bg-grad-dusk`.
- service-details: PageHero parallax, `data-parallax-img` overview and cards, sticky stack approach steps, `data-progress` timeline fill, `data-scroll-x` giant name, `bg-grad-bands` strip, halftone parallax, reveals (slam, cut, stamp, left, right), ticker tape, scroll-spy.

## 7. Next.js migration map
| Now | Next.js |
|---|---|
| `services.html` | `/services` (query `category`) |
| `service-details.html?slug=` | `/services/[slug]` |
| ServiceCatalogue, FeesExplained, TreatmentPathway | same-named components |
| ServiceDetail, BookingBlock, ServiceNav | same-named components |
| `SITE.servicesIndex` + `SERVICES` | `services` table + `service_details` (JSON columns or child tables) via `GET /api/services`, `GET /api/services/:slug` |
| Forms | none |

## 8. Merge notes
Reads only SITE and URLs. `service-details.html` needs `js/data/services.js` before its page script; `services.html` needs only SITE. Booking links prefill `appointment.html?service=<slug>` (Part 4).

## 9. QA result
QA — part 3 · static · runtime: ALL CLEAR · 0 warnings (services.html, ?category=adult, 8 service slugs, zz-not-found)

## 10. Known limits
Scroll-spy, parallax and sticky behaviour are not exercised by jsdom; check them in a browser. The mobile Book/Call bar is fixed at bottom centre, 11rem wide, to stay clear of the bottom-right buttons.
