# Global Search/Recall + Visual System Unification — Design

**Goal:** Time-pressed buyers should find a supplier by name/category/region from any
page in one interaction, get back to what they found on a return visit without
re-searching, and share/compare without hunting for the feature. Separately, unify the
site's visual language: the supplier detail page already has a strong gold/black "trust
certificate" identity (`cert-frame`, `dbd-stamp`, gold trust colors) that the homepage and
list pages don't use — they're still on generic emerald Tailwind classes left over from
before that palette existed.

**Constraint:** Static export (`output: "export"`). No server at runtime — all dynamic
behavior (search, recent, shortlist) is client-side against localStorage or a
build-time-generated static JSON, following the pattern already established by
`compare-index.json` / `browse-index.json`.

## Part 1 — Global search + recall

### Problem today

- Name/region search (`SearchBar`/`HeroSearch`) only exists in the homepage hero. It
  doesn't match categories. Once a user is anywhere else (category page, city page,
  supplier detail), there's no search at all.
- `RecentlyViewed` and the shortlist/compare flow already work (localStorage-backed,
  `lib/recentlyViewed.ts`, `lib/shortlist.ts`) but only surface on the homepage or as a
  bottom tray — nothing anchors them across every page for a returning visitor.
- `app/page.tsx` passes the full supplier list (all ~8,200 rows) directly into
  `HeroSearch` server-side, embedding it in the homepage's HTML/RSC payload. The rest of
  the codebase already solved this with `LazyHeroSearch`, which lazy-fetches
  `public/browse-index.json` client-side instead — the homepage just didn't switch to it.

### `GlobalSearch` (new component, header)

- Single input, rendered in the sticky header on every page (see Header layout below).
- On first focus, lazy-`fetch("/browse-index.json")` once (existing file, no new build
  step — already contains `{id, name, city_label, district, rating, trust_score,
  categories, dbd}` for every supplier, ~1.9MB, already the pattern `LazyHeroSearch` uses).
- Category matches: `CATEGORY_LABELS` (already a bundled constant, no fetch needed) —
  match query against label, jump to `/c/{key}`.
- Region matches: derived client-side by grouping the fetched browse-index by
  `city_label` (a `Map<city_label, count>` built once after fetch, cached in the
  component) — match query against city label, jump to `/city/{slug}` (reuse
  `citySlugFromDisplay` from `lib/cityNorm.ts`).
- Supplier matches: same substring match `SearchBar` already does (name/district/city),
  reused logic, sorted by `trust_score`.
- Results dropdown: merges the three kinds, category/region matches pinned above supplier
  matches (they resolve "browse many" faster), each row tagged with a small icon
  (🏷 category / 📍 region / 🏭 supplier). Cap ~12 rows total.
- Not a shared/synced component (`shared/components/*`) — this one is site-local to
  web-factory, so no `sync_shared.py` step needed.

### `HeaderQuickAccess` (new component, header)

- Two icon buttons: 🕒 Recent, ⚖️ Shortlist — each with a count badge, each opens a
  popover on click (not hover, for mobile parity).
- Recent popover: last 5 from `loadRecent()` / `subscribeRecent()` (existing,
  unchanged) + "View all" → homepage recently-viewed section (or a dedicated
  `/recently-viewed` if the popover feels cramped — decide during implementation, not a
  spec-blocking decision).
- Shortlist popover: last 5 from `loadShortlist()` / `subscribeShortlist()` (existing,
  unchanged) + Compare / Share / Clear actions (same actions `ShortlistTray` already
  has) + "View all" → `/compare`.
- Both badges hidden (icon not rendered) when their list is empty — avoids showing dead
  UI to first-time visitors.
- `ShortlistTray` (bottom sticky bar) stays as-is — it's the "I'm actively building a
  shortlist" nudge; `HeaderQuickAccess` is the "get back to it later" anchor. Different
  jobs, both stay.

### Header layout

- Desktop (`md:` and up): one row — Logo · `GlobalSearch` (flex-grow) · `HeaderQuickAccess`
  · existing `HeaderNav` links · lang switcher. `GlobalSearch` takes the space currently
  empty between logo and nav.
- Mobile: two rows — row 1 unchanged (logo + hamburger), row 2 is `GlobalSearch` full-width
  beneath it. `HeaderQuickAccess` icons move into row 1 (next to hamburger) since mobile
  width can't fit them on row 2 with the input.
- Both rows `sticky top-0` (mobile: the 2-row block is one sticky unit).

### Small fixes bundled in (same area, same session, low cost)

- Homepage: swap the direct `<HeroSearch entities={searchIndex} .../>` call for
  `<LazyHeroSearch .../>` (already exists, already used elsewhere) — removes the
  server-embedded full supplier list from the homepage payload.
- `SupplierListWithFilter`: "View all N suppliers" currently links to a fixed
  `/best/highly-recommended`, ignoring whatever category/city/DBD filter is active. Fix:
  when exactly one of category/city is set, link to `/c/{category}` or `/city/{citySlug}`
  instead; when both or neither are set, keep the existing fallback.

## Part 2 — Visual system unification

### What exists today

`app/globals.css` already defines a "B2B trust palette" — `--gold`, `--gold-light`,
`--gold-bg`, `--gold-deep`, `--red`, plus `.cert-frame` / `.cert-frame-dark` /
`.dbd-stamp` utility classes. The supplier detail page (`HeroCertificate`, `MedalWall`,
`TrustGauges`, the `dbd-stamp` badge) uses this and it's the page the user called out as
"really good" — an "Alibaba Gold Supplier" certificate look. The homepage and most cards
(`SupplierCard`, `SectorCard`, homepage sections) instead hardcode Tailwind `emerald-*`
utility classes, a leftover from before the gold palette was introduced (see the
`globals.css` comment: `--accent: #0f766e; /* Compat with legacy emerald usage */`).

### Direction (confirmed): light version, not full dark cert-frame

Full dark `cert-frame-dark` treatment stays exclusive to the supplier detail hero (one
supplier, one hero — dramatic works there). Homepage and list pages get gold as an
**accent on a light background**, not a dark backdrop — badges, buttons, stat numbers,
active/hover states, section headers. This keeps list-density pages (dozens of cards per
screen) scannable instead of visually heavy.

### Scope of the swap

- `SupplierCard`: trust badge, category chip backgrounds, hover border/shadow —
  emerald → gold/black. (`TrustBadge` itself may already be palette-driven — check before
  assuming a rewrite is needed.)
- `SectorCard`: hover states, count badges.
- Homepage: hero gradient (emerald → light gold-tinted), stats bar (emerald gradient bar →
  black/gold), "Compare CTA" band, Manifesto icons, section headers, "By Region" pills,
  guide/blog card hover states.
- Category (`/c/[cat]`) and city (`/city/[name]`) list page headers/hero bands — same
  token swap, not a layout change.
- Mechanism: replace hardcoded `emerald-*` / `green-*` Tailwind classes with the existing
  CSS custom properties (`var(--gold)`, `var(--gold-bg)`, `var(--fg)` for black, etc.) via
  inline style or a small set of new Tailwind-friendly utility classes in `globals.css`
  (e.g. `.accent-gold`, `.badge-gold`) so this isn't 40 files of raw `style={}` props.
  Concrete utility set gets decided in the implementation plan, not here.

### Out of scope

- Changing the CSS variable *values* (the gold/black/red palette itself is approved,
  not up for re-litigation here).
- Layout restructuring of list pages (grid vs. table, filter bar mechanics) — colors
  and accent treatment only.
- Typography changes.

## Out of scope (both parts)

- Full visual redesign of every page (blog, guides, about, etc.) — this pass covers
  homepage, header (global), `SupplierCard`, `SectorCard`, category/city list headers.
  Anything not named above keeps its current look for now.
- New backend/data pipeline — everything reuses `browse-index.json`, `recentlyViewed.ts`,
  `shortlist.ts` as they exist today.

## Verification

- `npm run build` succeeds; `/browse-index.json` still generated by the existing
  `build_browse_index.mts` prebuild step (unchanged).
- Manual: from a category page and a supplier detail page (not just homepage), the
  header search finds a supplier by name, a category by label, and a region by city name,
  and each jump goes to the right URL.
- Manual: view 2-3 suppliers, refresh, header Recent icon shows them without visiting the
  homepage; shortlist 2 suppliers, header Shortlist icon shows count and Compare link
  works.
- Visual: homepage/category/city pages read as the same "trust certificate" family as
  the supplier detail page at a glance — no emerald/green surviving in the swapped
  components.
