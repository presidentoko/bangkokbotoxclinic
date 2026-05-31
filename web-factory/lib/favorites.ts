// Saved/favorited suppliers — a per-browser bookmark list, separate from the
// bulk-quote shortlist (different intent). Reuses the shortlist module's pure,
// already-tested list helpers so there is no duplicate list logic.

import { addItem, removeItem, hasItem, type ShortlistItem } from "./shortlist";

export type FavoriteItem = ShortlistItem;

const KEY = "tsh_favorites";
const EVENT = "favorites:change";

export function loadFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is FavoriteItem =>
        x && typeof x.id === "string" && typeof x.name === "string" && typeof x.cityLabel === "string",
    );
  } catch {
    return [];
  }
}

function save(list: FavoriteItem[]): FavoriteItem[] {
  if (typeof window === "undefined") return list;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* quota / privacy mode — non-fatal */
  }
  return list;
}

export function toggleFavorite(item: FavoriteItem): FavoriteItem[] {
  const list = loadFavorites();
  return save(hasItem(list, item.id) ? removeItem(list, item.id) : addItem(list, item));
}

export function removeFavorite(id: string): FavoriteItem[] {
  return save(removeItem(loadFavorites(), id));
}

export function clearFavorites(): FavoriteItem[] {
  return save([]);
}

export function subscribeFavorites(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === KEY) cb();
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}
