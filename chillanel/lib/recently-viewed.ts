// Same client-only-localStorage pattern as favorites.ts/compare.ts -- no
// backend, so "recently viewed" is purely a per-device trail. A visitor who
// leaves a place page without favoriting it currently has no way back to it
// except re-searching; this is the browser-history equivalent scoped to
// this site.
const STORAGE_KEY = "chillanel:recently-viewed";
const MAX_ENTRIES = 12;

function hasStorage(): boolean {
  return typeof localStorage !== "undefined";
}

export function getRecentlyViewedIds(): string[] {
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

// Most-recently-viewed first; re-viewing a place moves it back to the
// front instead of duplicating it. Capped at MAX_ENTRIES so this stays a
// short "where was I" trail, not an ever-growing log.
export function recordView(id: string): void {
  if (!hasStorage()) return;
  const existing = getRecentlyViewedIds().filter((existingId) => existingId !== id);
  const next = [id, ...existing].slice(0, MAX_ENTRIES);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full/disabled (private browsing, quota) -- recently-viewed is
    // a convenience feature, not core functionality, so fail silently.
  }
}
