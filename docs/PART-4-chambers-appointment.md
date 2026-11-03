# Part 4 — Chambers & Appointment

## 1. Files
| Path | Purpose |
|---|---|
| `chambers.html` | Chambers page shell: hero mount, mounts for JS sections, static "What to bring" and "Privacy promise" sections |
| `js/pages/chambers.js` | Renders overview cards + live open status, weekly matrix, 3 chamber sections, comparison table, CTA; hash highlight |
| `js/data/chambers.js` | `window.CHAMBERS` detail records (extra fields only) |
| `appointment.html` | Appointment shell: hero mount, booking grid (wizard + summary mounts), "after" mount, static emergency section |
| `js/pages/appointment.js` | 5-step wizard, calendar, slots, review, confirmation, `.ics`, sessionStorage |

## 2. Pages → section ids → components
- **chambers** (`data-page="chambers"`): `page-hero` (PageHero) · `overview` (ChamberCard ×3) · `matrix` · `gulshan`, `bashundhara`, `online` (ChamberDetail, ids = slugs, tabs inside) · `compare` · `bring` (BringChecklist) · `privacy` (PrivacyPromise) · `cta` (CtaBand)
- **appointment** (`data-page="appointment"`): `page-hero` · `booking` (BookingWizard form `#booking-form`, BookingConfirmation `#confirmation`, summary aside + mobile accordion) · `after` (+ Tape) · `emergency`

## 3. Globals & data schema
Only `window.CHAMBERS`. Records are merged at runtime: `Object.assign({}, SITE.chambersIndex[i], detail)`.
```js
{ id:'ch-001', slug:'gulshan', bestFor:'…', about:['p1','p2'], landmark:'…',
  facilities:[{icon:'lock',title:'…',description:'…'}],            // 5–6 items, kit icons only
  howToReach:{ byRoad:'…', byRideshare:'…', byBus:'…', parking:'…' }, // in-person only
  patientTips:['…'], mapQuery:'<address text for keyless embed>' }
// online record: no howToReach/mapQuery; has howItWorks[{title,description}×4], techNeeds[4], privacyNotes[3]
```

## 4. Kit API used · SITE members read · URLs
- UI: `ready, esc, pad, icon, img, deco, sticker, tape, sectionHead, pageHero, chamberCard, faqItem, ctaBand, field, validateForm, formatBDT, formatBDTRange, formatDate, formatTime, getParam, debounce, copy, toast, mount, cls.*`
- SITE: `routes, url.appointment, url.chamber, chambersIndex, servicesIndex, getChamber, getService, doctor, contact, brand, img, nextOpening, submit`
- Links out: `SITE.url.appointment({chamber})`, Google Maps directions `https://www.google.com/maps/dir/?api=1&destination=<lat>,<lng>`, `tel:`, WhatsApp, `https://wa.me/?text=`.
- Expected in: `chambers.html#<slug>` (gulshan|bashundhara|online), `appointment.html?service=&chamber=&date=&type=`.
- Query-param contract: `service` (service slug), `chamber` (chamber slug), `date` (YYYY-MM-DD, today..+59 days), `type` (`new|follow-up|second-opinion|post-op`). Invalid values are ignored silently. Params override saved state.

## 5. Forms
| Form | Name | Payload |
|---|---|---|
| `#booking-form` | `SITE.submit('appointment', payload)` | see below |
```js
{ type, serviceSlug|null, chamberSlug, date:'YYYY-MM-DD', time:'HH:MM', slotMinutes:30, timezone:'Asia/Dhaka', feeBDT:int,
  paymentPreference:'chamber|bkash|nagad|card',
  patient:{ fullName, age:int, gender, phone:'01712345678', email|null, area },
  bookingFor:'self|family', relationship|null, concern, preferredContact:'phone|whatsapp|email', consent:true, submittedAt:ISO }
```
- Reference: `PSY-YYMMDD-XXXX` = booking date + last 4 alphanumerics of the submit id.
- sessionStorage key: `ortho:booking` (JSON of step, type, service, chamber, date, time, payment, details; consent never stored; removed on confirmation). Wrapped in try/catch.
- Booked-slot rule (deterministic): `h = 5381; for each char c of (chamberSlug + date + "HH:MM"): h = (h*33 + code(c)) mod 2^32`; the slot is **Booked** when `h % 4 === 0`.
- Slots: every `slotMinutes` from `start` while slot end <= `end` for the schedule entry matching the weekday (0=Sunday); past slots today are dropped; range = today + 59 days.
- Fee: `new`/`second-opinion` → `fee.firstVisit`; `follow-up`/`post-op` → `fee.followUp`.

## 6. Techniques per page
- chambers: `data-parallax` + `data-parallax-rotate` (overview/bring decoration), `data-parallax-img` (cards and frames), `data-scroll-x` giant slug text, `data-reveal` stamp/wipe/left/right, `data-tabs`, `data-bg-shift` + `bg-grad-bands`, `UI.tape` ticker, blinking status dots.
- appointment: `data-scroll-x`, `data-parallax(+rotate)`, `data-reveal="stamp"` (steps + confirmation), sticky summary aside, `UI.tape`, `bg-halftone`, hard-cut step transitions (`animate-cut`).

## 7. Next.js migration map
| Now | Next.js |
|---|---|
| `chambers.html` | `/chambers` (`app/chambers/page.tsx`), hash `#slug` kept |
| `appointment.html` | `/appointment` (client component `BookingWizard`) |
| ChamberDetail / ChamberCard / BookingWizard / BookingConfirmation | same-named React components |
| `window.CHAMBERS` | table `chambers` (+ `chamber_facilities`) via `GET /api/chambers` |
| `slotsFor` + booked hash | `GET /api/chambers/:slug/slots?date=` (real availability) |
| `SITE.submit('appointment')` | `POST /api/appointments` returning `{id, reference}` |

## 8. Merge notes
Owns no shared ids. Section ids on chambers (`gulshan`, `bashundhara`, `online`) are the targets of `SITE.url.chamber(slug)`. Reserved ids are not used. No window globals other than `CHAMBERS`.

## 9. QA result
`node tools/qa.js --part 4` → `✓ ALL CLEAR · 0 warnings` (chambers ×2 variants, appointment ×3 variants). An extra jsdom run drove all 5 steps to the confirmation, including validation, prefill and chamber-change clearing.

## 10. Known limits
- Availability and "Booked" are simulated and identical for everyone; real bookings need a backend.
- Maps are keyless Google embeds and need internet access.
- `.ics` download and `window.print()` need a real browser; they were not exercised in jsdom.
- Calendar is limited to the next 60 days; times use the visitor's device clock.
