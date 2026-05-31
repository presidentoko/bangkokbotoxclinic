# Bulk Quote + Shared Shortlist — Design

**Goal:** Let buyers select multiple suppliers and send one inquiry to all of them
(resolves "No Bulk Supplier Inquiry Feature"). Build the selection as a **shared
shortlist** so future Comparison / Favorites features reuse the same store.

**Constraint:** Next.js static export (`output: "export"`). Everything is client-side,
backed by `localStorage`. Bulk submission reuses the existing RFQ pattern
(`NEXT_PUBLIC_RFQ_ENDPOINT` POST with `mailto:` fallback to `NEXT_PUBLIC_CONTACT_EMAIL`).

## Components

### `lib/shortlist.ts` — single source of truth
- `ShortlistItem = { id: string; name: string; cityLabel: string }` — minimal info captured
  at add-time, so the client never needs the full supplier DB.
- **Pure, testable helpers:** `addItem(list, item)` (dedupe by `id`, cap at `MAX = 50`,
  newest first), `removeItem(list, id)`, `hasItem(list, id)`, `formatSuppliersLine(list)`
  (→ `"Name (City) [id], …"` for the RFQ body/subject).
- **localStorage wrappers (guard `typeof window`):** `loadShortlist()`, and mutators
  `addToShortlist/removeFromShortlist/clearShortlist` that read-modify-write then dispatch a
  `shortlist:change` `CustomEvent` on `window`.
- `subscribeShortlist(cb)` — registers the change + cross-tab `storage` listener, returns an
  unsubscribe fn. Key: `tsh_shortlist`.

### `components/ShortlistButton.tsx` (client)
Toggle "＋ Add to quote" / "✓ Added". Props `{ id, name, cityLabel }`. Mounted-guarded to
avoid hydration mismatch. Placed in `SupplierCard`'s action row and on the supplier detail
page.

### `components/ShortlistTray.tsx` (client)
Fixed bottom bar, shown only when the shortlist is non-empty: "N suppliers selected ·
[Request one quote] · [Clear]". Mounted once globally in `app/layout.tsx`. Renders nothing
when empty or before mount.

### `app/quote/page.tsx`
Server component (exports `metadata`, `canonical: /quote`, `noindex`) wrapping a
`BulkQuoteClient` client component that:
- reads the shortlist, lists each supplier (name, city, link, remove button),
- shows an empty state when none,
- renders `<RfqForm suppliers={items} />`.

### `RfqForm` — extend (no duplication)
Add optional prop `suppliers?: ShortlistItem[]`. When present:
- show a "Requesting quotes from:" chip list,
- add `<input type="hidden" name="suppliers" value={formatSuppliersLine(items)} />`,
- subject → `Bulk RFQ — N suppliers`, and include the list in the `mailto:` body.
All existing single-supplier behavior, i18n, and submit logic are unchanged.

## Entry points
ShortlistButton on `SupplierCard` + supplier detail page; ShortlistTray global; `/quote`
linked from the tray (and footer "Site" column).

## Out of scope (YAGNI)
Server persistence, auth, per-supplier message/quantity, multilingual `/quote` (EN first,
like `/community`), and Comparison/Favorites UIs (store is built to support them later).

## Testing (`scripts/test_shortlist.mts`)
Locks the pure helpers: add dedupes by id, cap honored (oldest dropped at >50), newest-first
order, remove, has, and `formatSuppliersLine` output shape.

## Verification
`npx tsx scripts/test_shortlist.mts` passes; `npm run build` succeeds with `/quote`
prerendered and no hydration warnings; tray + button appear and persist across reloads.
