# Team Kit 3 — "Concrete Signal": Brutalist + Premium psychiatrist portfolio

Style: Brutalist + Premium. Primary technique: **parallax**, plus gradient and motion design. Square edges, 4px ink borders, solid offset shadows, flat colour blocks (ink / concrete / ultramarine / acid lime / tangerine / lilac), expanded black Archivo headlines, Space Mono labels, ticker tapes, sticky stacked sections, scroll-driven parallax layers, stepped "cut / slam / stamp" motion.
It deliberately shares no design principles with the earlier kits (no rounded shapes, no glass or blur, no soft shadows, no light-blue or aurora palettes).

## What is in the zip
`js/` shared kit (design tokens, parallax engine, components, fixed header/footer, QA engine) · `assets/img/` 28 illustrations in one Brutalist style · `qa.html` browser QA runner · `tools/qa.js` + bundled jsdom (offline test runner) · `tools/golden-about.*` (tested reference page) · `tools/page-template.html` · `prompts/PROMPT-1…5`.

## Normal chat vs artifacts → normal chat with file creation
Settings → Capabilities → switch ON **Code execution and file creation**. Artifacts cannot hold a multi-file site, cannot run the QA tool and would need ~10 copy-downloads per person.

## Steps for each member (≈ 3 minutes of your time)
1. Unzip `team-kit-3.zip` once (creates `site/`).
2. New Claude chat (Sonnet). **Attach `team-kit-3.zip`** and paste your prompt file (`prompts/PROMPT-N-…md`) as the message. Send.
3. Claude unzips the kit, writes your files, runs `node tools/qa.js --part N`, fixes every failure, and gives you **`part-N.zip`**. If it stops, send `RESUME`.
4. Unzip `part-N.zip` into your `site/` folder and open your pages (double-click).
If the chat cannot accept the zip, paste the prompt alone: it falls back to Mode B (writes files + written self-review, no automated QA) — then run the QA yourself in step 5 below.

| Person | Prompt | Delivers |
|---|---|---|
| 1 | PROMPT-1-home-signin-404 | Home (13 sections), Sign-in, 404 |
| 2 | PROMPT-2-about-contact-faqs | About, Contact, FAQs |
| 3 | PROMPT-3-services | Services, Service Details (8 services) |
| 4 | PROMPT-4-chambers-appointment | Chambers, 5-step Appointment wizard |
| 5 | PROMPT-5-blog-testimonials | Blog, Blog Details (8 articles), Testimonials |

## Merge + QA (the strong-QA part)
1. Unzip all five `part-N.zip` into the same `site/` folder (no file is shared, nothing is overwritten).
2. **Automated, needs Node:** `node tools/qa.js` — static checks (kit-API misuse, design-law linter, data integrity, links, template, ownership) + runtime test of every page and URL variant (≈ 40 loads): scripts executed, every tab/accordion/carousel/filter clicked, every form submitted empty and with valid data, then structure/text/a11y/JS-error checks. Exit code 1 if anything fails. Add `-v` for warnings.
3. **In a real browser, no install:** open `qa.html` from the project root and press *Run quick check* (or *Run every variant*). It loads each page at 390 px and 1280 px, scrolls it, clicks the widgets and reports failures, including layout overflow, broken images, tap targets and reveal animations that never fired.
4. Fix any failure in the owning part (each `docs/PART-*.md` lists its files). Re-run until clear.
5. Any single page can be inspected live: add `?qa=1` to its URL (a report panel appears bottom-left).

## Honest limits
The shared kit and the QA tool were tested here in jsdom (including planted bugs, which were all caught). A real browser was not available, so `qa.html` and the browser-only checks (overflow, tap size, broken-image detection, scroll reveals) could not be run end-to-end by me; treat their first run as part of your QA. The prompts themselves were not run through Claude's free tier.
