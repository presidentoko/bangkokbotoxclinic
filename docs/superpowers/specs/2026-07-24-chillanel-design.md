# chillanel.com — Design Spec

Status: approved (brainstorming session 2026-07-24)

## 1. Purpose

A Thai massage/spa directory + editorial content site. Core differentiator versus
existing review-aggregator sites in this repo (bangkokbotoxclinic.com etc.): massage
quality in Thailand depends far more on the individual therapist than on the
facility. Most competitors rank by facility polish; chillanel surfaces the person.

- **Not** a lead-gen/booking product. Content and organic traffic first;
  monetization deferred to a later phase (ads/affiliate/partnerships TBD then).
- Domain `chillanel.com` — already owned by the user, DNS/registrar confirmed
  live via RDAP (registrar: Hostinger) on 2026-07-24.

## 2. Scope

- **Cities**: Bangkok at launch. Architecture must not hardcode single-city
  assumptions — city becomes a route segment and a data-loader parameter from
  day one, so adding Pattaya/Phuket/Chiang Mai later is a data drop, not a
  code change.
- **Languages**: en / th / ko, all three at launch. `en` is default.
  District-level routes are explicitly out of scope for v1 (Bangkok-only launch
  doesn't need the extra facet yet) — add when a second city needs it.
- **Out of scope for v1**: lead capture/booking forms, partner CRM, payment
  (PromptPay), admin dashboard, LINE/WhatsApp/Telegram integration. None of the
  clinic-network's monetization machinery is needed for a content-first launch.

## 3. Architecture

- New standalone Next.js (App Router) project at `deliverable/chillanel/` —
  own `package.json`, own Vercel project (name: `chillanel`), own domain.
  Pattern matches `thaifacialclinic-portable/` (independent deploy) rather
  than `web/`'s multi-site `SiteFocus` env-switch pattern — chillanel's brand
  voice and feature set (therapist-mention extraction) are too different from
  the clinic-directory template to share that codebase cleanly.
- **Reused conventions** (copy the pattern, not the code, unless directly
  applicable): `lib/i18n.ts`-style translation dictionaries, `JsonLd`
  components (LocalBusiness schema for place pages), sitemap generation
  (`app/sitemap.ts` + per-section sitemap files if volume warrants it),
  canonical/hreflang handling, `scripts/build-data.mjs`-style
  CSV→JSON build step (same shape as `thaifacialclinic-portable`'s
  `build-data.mjs`).
- **Explicitly not reused**: admin dashboard, partner CRM (`partnerStore`),
  lead storage/routing (`leadStore`), payment claim flow, sponsored-slot
  system, any LINE/WhatsApp/Telegram code.

## 4. Data pipeline

Source: `spa_output/{city}/clinics.csv` + `spa_output/{city}/reviews/*.csv`
(scraped by `bangkok_clinics/scraper.py` + `scraper_grid.py` under the new
`VERTICAL="spa"` mode, covering both `SEARCH_QUERY=spa` and
`SEARCH_QUERY=massage` passes — already running as of this session).

Build step (`chillanel/scripts/build-data.mjs`, runs at deploy time):

1. Normalize business records (name, address, coords, rating, category,
   city).
2. **Therapist-mention extraction** from review text:
   - Pattern-match for name-attribution phrasing ("ask for X", "X was
     amazing", Thai/Korean equivalents).
   - Keep a candidate name only if it appears in **2+ independent reviews**
     for the same place, to suppress one-off false positives (nicknames,
     misparses).
   - Attach the matched quote(s) alongside each surfaced name — never just
     the bare name, always with its source sentence.
3. Emit `data/clinics.{lang}.json`, one per city (or a single file with a
   `city` field if volume stays small — decide at implementation time based
   on actual Bangkok row count).

**Accuracy caveat (binding constraint, not a suggestion)**: therapist-name
extraction from unstructured review text will produce false positives. The UI
must never present an extracted name as a factual claim ("Recommended
therapist: X"). It must always be framed as a sourced excerpt ("Reviewers
mentioned: ...", followed by the quote) with a visible disclaimer that the
mentions are auto-extracted and unverified. This directly follows the
fabricated-content lesson from the thaifacialclinic-portable P3 audit earlier
this repo's history — no unverifiable claims presented as fact.

## 5. Routes

```
/[lang]/                       Home — brand philosophy + featured places
/[lang]/city/[city]            Full listing per city (Bangkok only at launch)
/[lang]/place/[id]             Place detail — reviews, extracted therapist
                                mentions, rating, location
/[lang]/guide/[slug]           Editorial content (3-5 articles at launch:
                                how to pick a good massage place, guide to
                                Thai massage types, understanding pricing)
/[lang]/about                  Brand philosophy page
```

`city` route's `generateStaticParams` returns whatever cities have data —
no hardcoded city list. Adding a city later is a data-only change.

## 6. Deployment / refresh loop

- New watchdog service (`chillanel_refresher`, modeled on
  `thaigle_refresher`): watches `spa_output/**` for changes, rebuilds
  `data/*.json`, runs `vercel --prod` (no `--archive=tgz` — see the
  known Vercel-deploy gotcha below).
- Initial deploy ships with whatever `spa_output/bangkok` contains at build
  time (1,468 places / 1,374 with reviews as of 2026-07-24, growing as the
  spa+massage grid/review scrapers continue).

## 7. Known gotchas carried forward from this session (apply to chillanel too)

- **Never deploy with `vercel --prod --archive=tgz`** — it bypasses
  `.vercelignore` filtering and uploads the entire monorepo (600K+ files),
  causing multi-minute-to-stalled builds. Plain `vercel --prod` respects
  `.vercelignore` and uploads only the relevant ~10K files.
- Any server-side `fetch()` call used inside a page's render path with
  `cache: "no-store"` forces that entire route to fully dynamic (no CDN
  caching), which is expensive at scale. If chillanel ever needs
  request-time data (e.g. a live counter), use `next: { revalidate: N }`,
  never bare `no-store`, inside a Server Component render path.
