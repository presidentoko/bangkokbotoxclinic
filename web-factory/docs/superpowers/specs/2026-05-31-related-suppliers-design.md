# Related Suppliers — Design

**Goal:** Resolve the "No Related Supplier Recommendations" gap. Add a server-rendered
"Related suppliers" section to the supplier detail page that recommends similar
suppliers (same industry, nearby region), improving internal navigation + SEO and
giving buyers an easy next step.

**Constraint:** Site is a Next.js static export (`output: "export"`). The feature must be
pure server-render — **zero client JS** — so it works under static export and adds
crawlable internal links.

## Matching logic (`lib/related.ts`)

`relatedSuppliers(db: MasterDb, supplier: Supplier, limit = 6): Supplier[]`

Pure + deterministic. Score every other supplier (self excluded by `id`):

| Signal | Weight |
|---|---|
| Same DBD TSIC code (`dbd.tsic_code`, non-empty) | +100 |
| Each shared category (`categories` overlap) | +25 each |
| Same canonical district (`lib/districts` `normalizeDistrict` key) | +40 |
| Same city (`city`) | +20 |

- Candidates with score 0 are dropped (no spurious matches).
- Sort by score desc, tiebreak by `computeTrustScore(x).overall` desc, then `id` asc
  (stable/deterministic).
- Return top `limit`.

Rationale: TSIC is the strongest "same industry" signal; category overlap is the
fallback when TSIC is absent; region weights implement the "industry + region weighted"
choice without letting region outrank a true same-industry match.

## Rendering (`app/supplier/[id]/page.tsx`)

- Compute `const related = relatedSuppliers(db, r);` in the page (db + r already loaded).
- New `<section>` placed after the existing internal-links section (before the JSON-LD
  block), reusing the existing `SupplierCard` (no `rank`) in a responsive grid
  (`sm:grid-cols-2 lg:grid-cols-3`).
- If `related.length === 0`, render nothing.
- Heading reuses the page's `SectionHeading` component for visual consistency.

## Testing (`scripts/test_related.mts`)

Node/tsx test (repo convention). Locks:
1. Self is never in the results.
2. A same-TSIC supplier ranks above a region-only match.
3. Score-0 candidates (no shared signal) are excluded.
4. Result length ≤ limit and is deterministic across two calls.

## Out of scope (YAGNI)

Separate ItemList JSON-LD, a "similarity %" badge, pagination, and any client-side
interactivity. Can revisit if needed.

## Verification

`npx tsx scripts/test_related.mts` passes; `npm run build` succeeds; the supplier detail
page shows up to 6 related cards with no hydration/client-JS added.
