# Supplier Comparison Tool — Design

**Goal:** Let buyers compare shortlisted suppliers side-by-side (resolves "Supplier
Comparison Tool"). Reuses the shared shortlist built for bulk-quote.

**Constraint:** Static export. The `/compare` page is client-rendered from the
localStorage shortlist (ids only), so it needs a client-fetchable data source for the
full compare fields.

**Compare attributes (user-selected core 5):** Trust Score, rating + review count,
verification status (DBD / Halal / Estate / TSIC), location (city + district), categories.

## Data source — slim static index

- `lib/compare.ts`: pure `toCompareEntry(supplier): CompareEntry` →
  `{ id, name, cityLabel, district, trust: { overall, tier }, rating, reviews,
  verifications: { dbd, halal, estate, tsic }, categories }`. `CompareIndex = Record<id,
  CompareEntry>`.
- `scripts/build_compare_index.mts`: reads `data/master_db.json`, writes
  `public/compare-index.json` keyed by id.
- `package.json` `prebuild` hook runs the script, so every `npm run build` (dev, CI,
  auto_rebuild) regenerates the index. No stale-data drift.

## `/compare` page

- `app/compare/page.tsx`: server component — exports `metadata` (`canonical: /compare`,
  `robots: noindex`) and a short intro; renders `<CompareClient />`.
- `components/CompareClient.tsx` (client):
  - `useShortlist()` → ids; on mount, `fetch("/compare-index.json")` once.
  - Builds rows for shortlisted ids present in the index (skips any missing).
  - Renders a comparison **table**: suppliers as columns, the 5 attributes as rows.
    Mobile: horizontal scroll. Each column has a supplier link + Remove button.
  - Per-row "best" emphasis where meaningful (highest Trust Score, highest rating, most
    review count) — bold + subtle highlight.
  - Empty state when the shortlist is empty (link to browse); loading placeholder until
    mounted + fetched (avoids hydration mismatch).

## Entry points

- `ShortlistTray`: add a "Compare" button alongside Clear / Request one quote.
- Footer "Site" column: link `/compare`.

## Out of scope (YAGNI)

Capital / years / contact rows (not selected this round), sorting/filtering inside the
table, and URL-shareable comparison params. The data index includes only the core-5 fields.

## Testing (`scripts/test_compare.mts`)

Locks `toCompareEntry`: verification flags reflect presence of each signal, trust overall
is a 0–100 number with a tier, rating/reviews/categories pass through, and the shape
matches `CompareEntry`.

## Verification

`npx tsx scripts/test_compare.mts` passes; `npm run build` regenerates
`public/compare-index.json` and prerenders `/compare`; selecting suppliers shows a
side-by-side table that persists across reloads.
