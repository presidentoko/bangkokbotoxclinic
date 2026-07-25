// No backend/auth in this app, so "favoriting" is pure client-side
// localStorage — matches the site's 100% free/static constraint. Guarded
// with `typeof localStorage !== "undefined"` (not a window check) so this
// module is safe to import from a Server Component too (it just no-ops),
// even though in practice only client components call it.
const STORAGE_KEY = "chillanel:favorites";

function hasStorage(): boolean {
  return typeof localStorage !== "undefined";
}

export function getFavoriteIds(): string[] {
  if (!hasStorage()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function saveFavoriteIds(ids: string[]): void {
  if (!hasStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function isFavorite(id: string): boolean {
  return getFavoriteIds().includes(id);
}

// Flips membership and returns the new state (true = now favorited) so
// callers can update their own UI without a second isFavorite() read.
export function toggleFavorite(id: string): boolean {
  const ids = getFavoriteIds();
  const idx = ids.indexOf(id);
  if (idx === -1) {
    saveFavoriteIds([...ids, id]);
    return true;
  }
  saveFavoriteIds(ids.filter((existing) => existing !== id));
  return false;
}
