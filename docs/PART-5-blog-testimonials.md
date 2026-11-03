# PART 5 — Blog, Blog Details, Testimonials

## 1. Files
| Path | Purpose |
|---|---|
| `blog.html` · `js/pages/blog.js` | Blog listing: search, featured post, category filter, sort, pagination, topics, newsletter |
| `blog-details.html` · `js/pages/blog-details.js` | Single article from `?slug=`, contents, takeaways, share, related content, not-found panel |
| `testimonials.html` · `js/pages/testimonials.js` | Ratings summary, filter grid, featured story tabs, privacy statement, share form |
| `js/data/blogs.js` | `window.BLOGS` — 8 article DETAIL records |
| `js/data/testimonials.js` | `window.TESTIMONIALS` — 9 additional testimonials (`tst-007`…`tst-015`) |

## 2. Pages → section ids → `data-component`
- **blog** (`data-page="blog"`): `page-hero` (PageHero, search form `#blog-search`) → `featured` (FeaturedPost) → `browse` (BlogToolbar, PostGrid, PostCard, EmptyState) → `topics` (PopularTags, MostRead, NewsletterForm, FormSuccess) → `cta` (CtaBand).
- **blog-details**: `page-hero` → `article` (ArticleBody, AuthorBlock, ArticleAside) → `related-services` (ServiceCard) → `keep-reading` (PostCard) → `cta`. Unknown slug: `page-hero` → `not-found` (PostCard) → `cta`.
- **testimonials**: `page-hero` → `summary` (RatingScore, RatingBars, StatBlock) → `stories` (TestimonialToolbar, TestimonialGrid, TestimonialCard, EmptyState) → `story` (StoryTabs) → `privacy` → `share` (TestimonialForm, FormSuccess) → `cta`.

## 3. Globals & data schema
`window.BLOGS` and `window.TESTIMONIALS` only (both inside IIFEs).
```js
// BLOGS record (detail fields only; title, category, date, image, excerpt come from SITE.blogIndex)
{ id:'blg-003', slug:'antidepressants-myths-and-facts', tags:['Antidepressants','Medication','Myths'], views:2410,
  summary:'…meta description…', keyTakeaways:['…','…','…'], relatedSlugs:['…','…'], serviceSlugs:['depression-anxiety'],
  content:[{type:'p',text:'…'},{type:'callout',tone:'warning',title:'…',text:'…'}] }
// TESTIMONIALS record
{ id:'tst-007', name:'Rafiq U.', age:31, area:'Mohammadpur', serviceSlug:'adhd-neurodevelopment', rating:5, date:'2026-03-14',
  quote:'…', title:'…', outcome:'…', verified:true }
```
**Block types** (all rendered by `blog-details.js`): `p` · `h2` (feeds table of contents, ids `part-N`) · `ul` · `ol` · `quote` (`text`, `cite`) · `callout` (`tone` tip|warning, `title`, `text`). Inline `**bold**` is converted after `UI.esc`.

## 4. Kit API used · SITE members read · URLs
- UI: `ready, qs, qsa, esc, emph, getParam, debounce, pad, formatDate, icon, img, stars, sticker, tape, sectionHead, pageHero, statBlock, serviceCard, postCard, testimonialCard, ctaBand, field, validateForm, copy, mount, cls.*`.
- SITE: `doctor`, `contact`, `brand`, `img.portrait`, `routes.*`, `url.blog`, `url.blogCategory`, `url.appointment`, `blogIndex`, `blogCategories`, `testimonialsIndex`, `servicesIndex`, `getService`, `getPost`, `submit`.
- Links out: `appointment.html?service=<slug>`, `service-details.html?slug=` (via `serviceCard`), `about.html`, `contact.html`, `blog.html?category=&q=&page=`, `blog-details.html?slug=`, `tel:999`.
- Expected in: `blog.html`, `blog-details.html?slug=`, `blog.html?category=` and `testimonials.html` from header, footer, home and service pages.

## 5. Forms
| Form | `SITE.submit` name | Payload |
|---|---|---|
| Newsletter (`#newsletter-form`) | `newsletter` | `{ email }` |
| Share your experience (`#share-form`) | `testimonial` | `{ name, phone, serviceSlug, rating, title, message, consent }` |

## 6. Parallax / motion / gradient techniques
- **blog**: hero `data-parallax` layers, `data-parallax-img` (featured and every card), `data-scroll-x` giant text, `data-parallax-rotate` sticker, `data-bg-shift` band, `UI.tape`, `bg-grad-bands`, reveal slam/cut.
- **blog-details**: hero parallax, `data-parallax-img` cover, sticky aside (`lg:sticky`), `data-scroll-x`, `UI.tape`, `bg-grad-bands`, reveal `cut`.
- **testimonials**: hero parallax, `data-scroll-x`, counters (`statBlock`), `data-reveal="stamp"`, stepped bar fills, `data-tabs`, `bg-grad-dusk`, `data-bg-shift`.

## 7. Next.js migration map
| Page | Route | Data | API |
|---|---|---|---|
| blog | `/blog` | `blogs` table (`category_slug`, `date`, `views`) | `GET /api/posts?category=&q=&sort=&page=` |
| blog-details | `/blog/[slug]` | `blogs` + `blog_blocks` (type, text, items, position) | `GET /api/posts/[slug]` |
| testimonials | `/testimonials` | `testimonials` (`status` pending/published) | `GET /api/testimonials?service=&rating=` |
Components: `PostCard`, `PostGrid`, `FeaturedPost`, `ArticleBody`, `ArticleAside`, `AuthorBlock`, `TestimonialCard`, `RatingBars`, `StoryTabs`, `TestimonialForm`, `NewsletterForm`. Forms → `POST /api/newsletter`, `POST /api/testimonials` (moderated queue). `renderGrid()` logic becomes server-side filtering with the same query string.

## 8. Merge notes
- Only `window.BLOGS` and `window.TESTIMONIALS` are assigned. No other part's globals are read.
- Page scripts need the kit and data files loaded first (script order is set in each HTML file).
- `history.replaceState` keeps `?category=&q=&page=` in sync on the blog listing; invalid values are ignored or clamped.
- Article titles on `blog-details.html` are set at runtime; the `<title>` in the HTML is a generic fallback.

## 9. QA result
```
node tools/qa.js --part 5
✓ ALL CLEAR · 0 warnings   (13 runtime page variants, 0 fail, 0 warn)
```

## 10. Known limits
- Article pages are generated from a script, so search engines that do not run JavaScript see the generic title until migration to Next.js.
- Share links to WhatsApp, Facebook and LinkedIn use the current page URL, which is a local path when opened from disk.
- Testimonial submissions are simulated by `SITE.submit`; nothing is stored until the API exists.

## Appendix — the 8 articles
| Slug | Tags | relatedSlugs | serviceSlugs |
|---|---|---|---|
| stress-or-depression-warning-signs | Depression, Stress, Warning signs | how-to-support-someone-with-anxiety, when-to-seek-emergency-psychiatric-help | depression-anxiety, psychotherapy-cbt |
| how-to-support-someone-with-anxiety | Anxiety, Family, Support | stress-or-depression-warning-signs, mental-health-stigma-in-bangladesh | depression-anxiety, psychotherapy-cbt |
| antidepressants-myths-and-facts | Antidepressants, Medication, Myths | stress-or-depression-warning-signs, insomnia-why-you-cant-sleep | depression-anxiety |
| insomnia-why-you-cant-sleep | Insomnia, Sleep habits, CBT | stress-or-depression-warning-signs, antidepressants-myths-and-facts | sleep-insomnia, psychotherapy-cbt |
| exam-pressure-teen-mental-health | Teenagers, Exams, Parenting | mental-health-stigma-in-bangladesh, how-to-support-someone-with-anxiety | child-adolescent, psychotherapy-cbt |
| ocd-is-not-about-being-neat | OCD, Obsessions, Treatment | how-to-support-someone-with-anxiety, mental-health-stigma-in-bangladesh | ocd-trauma, psychotherapy-cbt |
| mental-health-stigma-in-bangladesh | Stigma, Family, Seeking help | when-to-seek-emergency-psychiatric-help, how-to-support-someone-with-anxiety | depression-anxiety, psychotherapy-cbt |
| when-to-seek-emergency-psychiatric-help | Emergency, Crisis, Safety | stress-or-depression-warning-signs, mental-health-stigma-in-bangladesh | depression-anxiety, bipolar-psychosis |
