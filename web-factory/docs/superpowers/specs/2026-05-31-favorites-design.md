# Save / Favorite Suppliers — Design

**Goal:** Let users bookmark suppliers and revisit them later (resolves "Save & Favorite
Suppliers"). No accounts — persists per-browser via localStorage.

**Constraint:** Static export. Client-side only. A separate store from the bulk-quote
shortlist (different intent: "save for later" vs "quote these now"), but reuses the
shortlist module's pure, already-tested list helpers — no duplicate logic, no edits to the
shipped shortlist store.

## Components

- `lib/favorites.ts`: own localStorage key (`tsh_favorites`) + `favorites:change` event.
  `FavoriteItem = ShortlistItem` (`{id,name,cityLabel}`). Reuses `addItem / removeItem /
  hasItem` from `lib/shortlist`. Exposes `loadFavorites`, `toggleFavorite`,
  `removeFavorite`, `clearFavorites`, `subscribeFavorites`.
- `components/useFavorites.ts`: mounted-guarded hook mirroring `useShortlist`.
- `components/FavoriteButton.tsx` (client): heart toggle (♡ → ♥, rose when saved).
  `variant="icon"` for cards, `"full"` for the detail page.
- `app/favorites/page.tsx` (server, noindex) + `components/FavoritesClient.tsx` (client):
  lists saved suppliers (name, city, supplier link, remove), empty state, and cross-links
  to /compare and /quote.

## Entry points

- FavoriteButton on `SupplierCard` (in the trust/badge row, to avoid crowding the action
  button row) and on the supplier detail page (next to the bulk-quote button).
- Footer "Site" column links `/favorites`.

## Out of scope (YAGNI)

Server sync / accounts, folders/tags, notes per favorite, and a separate cap (reuses the
shared helper's cap of 50, which is ample for a personal bookmark list).

## Verification

`npm run build` succeeds with `/favorites` prerendered; the heart toggles and persists
across reloads; favorites and the quote shortlist stay independent.
