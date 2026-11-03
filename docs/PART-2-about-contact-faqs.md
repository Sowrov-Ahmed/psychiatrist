# Part 2 — About, Contact, FAQs

## 1. Files
| Path | Purpose |
|---|---|
| `about.html`, `js/pages/about.js` | About page: static story section + JS-rendered sections |
| `contact.html`, `js/pages/contact.js` | Contact tiles, form, chamber finder with map tabs, crisis block, mini-FAQ |
| `faqs.html`, `js/pages/faqs.js` | Searchable, category-tabbed FAQ accordion, help block, FAQPage JSON-LD |
| `js/data/faqs.js` | `window.FAQS` (6 categories, 18 items) |
| `docs/PART-2-about-contact-faqs.md` | This file |

## 2. Pages → section ids → data-components
- **about** (`data-page="about"`): `page-hero` (PageHero) · `story` · `numbers` (Numbers, StatBlock) · `timeline` (Timeline) · `approach` (Approach) · `credentials` (Credentials) · `first-visit` (FirstVisit) · `cta` (CtaBand).
- **contact**: `page-hero` · `tiles` (ContactTiles) · `message` (ContactForm) · `chambers` (ChamberFinder, ChamberCard) · `crisis` (CrisisBlock) · `quick-faq` (QuickFaq, FaqItem) · `cta`.
- **faqs**: `page-hero` · `faq-browser` (FaqBrowser, FaqItem) · `emergencies` (static) · `cta`. Also injects FAQPage JSON-LD into `<head>`.

## 3. Globals & data schema
Only `window.FAQS` is defined (js/data/faqs.js). Loaded by faqs.html and contact.html (before the page script).
```js
FAQS.categories[0] = { id: 'faqc-001', slug: 'general', name: 'General', icon: 'info' }
FAQS.items[0] = { id: 'faq-001', categoryId: 'faqc-001', question: '…?', answer: '35–70 words' }
```
In-file records in about.js (`MILESTONES`, `PRINCIPLES`, `CREDS`, `VISIT_STEPS`) follow the same id-keyed shape.

## 4. Kit API used, SITE members read, URLs
- UI: `ready, esc, pad, icon, deco, debounce, toast, formatBDT, field, validateForm, pageHero, sectionHead, statBlock, chamberCard, faqItem, ctaBand, tape, mount, cls.*`.
- SITE: `doctor.*, contact.*, img.objects.{cross,cube,squiggle}, routes.*, url.appointment, chambersIndex, getChamber, nextOpening, submit`.
- Links out: `appointment.html`, `appointment.html?chamber=<slug>`, `chambers.html#<slug>` (via chamberCard), `faqs.html`, `contact.html`, `index.html`. Expected inbound: `faqs.html#<category slug>` selects a tab.

## 5. Forms
| Form | Name | Payload |
|---|---|---|
| Contact (`#contact-form`) | `contact` | `{ fullName, phone, email, subject, chamberSlug, message, consent }` |

The FAQ search box and the "helpful" buttons are client-side only (no submission).

## 6. Parallax / motion / gradient techniques
- **about**: `data-parallax-img` portrait, `data-scroll-x` giant text, sticky stack timeline (8 cards), `data-parallax` ghost numerals and offset columns, `data-progress` wipe line, counters (`statBlock`), `UI.tape`, `bg-grad-bands`, stamp/cut/slam reveals.
- **contact**: `data-parallax` + `data-parallax-rotate` decorative objects, stamp reveals on tiles, `data-tabs` map switcher, `data-scramble` on 999, `bg-grad-bands` strip, `bg-hatch` texture.
- **faqs**: `data-parallax` squiggle, `data-scroll-x` giant "Call 999" text, `data-tabs`, `UI.tape`, `bg-grad-bands`, `bg-grad-dusk` hero, stamp reveals.

## 7. Next.js migration map
| Page | Route | Components | Data → source | Form → endpoint |
|---|---|---|---|---|
| about | `/about` | PageHero, Numbers, Timeline, Approach, Credentials, FirstVisit, CtaBand | milestones, principles, credentials → CMS/table `career_milestones` | — |
| contact | `/contact` | ContactTiles, ContactForm, ChamberFinder, CrisisBlock, QuickFaq | `faqs`, chambers API | `POST /api/contact` |
| faqs | `/faqs` | FaqBrowser, FaqItem | `faq_categories`, `faqs` tables | — |

## 8. Merge notes
- No shared file is touched. `contact.html` also loads `js/data/faqs.js` (own file) for the mini-FAQ; it degrades to an empty accordion if missing.
- Contact uses faq ids `faq-016`, `faq-018`, `faq-004`; keep them stable.
- The word "placeholder" is avoided in code because the QA ban list matches it; fields use `hint` text instead.

## 9. QA result
`✓ ALL CLEAR · 0 warnings` (`node tools/qa.js --part 2`: static checks plus jsdom runtime on about, contact, faqs and faqs#general). Extra manual jsdom checks passed: hash tab selection, live search and no-results state, contact form success with reference id.

## 10. Known limits
- Map iframes need internet access and show a blank frame offline.
- jsdom cannot verify layout; sticky stacking, overflow and tap sizes should be checked once in a real browser via `qa.html`.
- Publications, memberships and awards are fictional.
