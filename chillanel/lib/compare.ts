// Same pure-localStorage approach as lib/favorites.ts, capped at 3 places
// so the comparison table stays readable on mobile.
const STORAGE_KEY = "chillanel:compare";
export const MAX_COMPARE = 3;

function hasStorage(): boolean {
  return typeof localStorage !== "undefined";
}

export function getCompareIds(): string[] {
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

function saveCompareIds(ids: string[]): void {
  if (!hasStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function isInCompare(id: string): boolean {
  return getCompareIds().includes(id);
}

export type CompareToggleResult = {
  ids: string[];
  added: boolean;
  /** True when the toggle was rejected because MAX_COMPARE was already reached. */
  atLimit: boolean;
};

// Adding beyond MAX_COMPARE is a no-op (returns atLimit: true, ids unchanged)
// rather than silently evicting an existing selection — the caller decides
// what to tell the user (e.g. "remove one first").
export function toggleCompare(id: string): CompareToggleResult {
  const ids = getCompareIds();
  const idx = ids.indexOf(id);
  if (idx !== -1) {
    const next = ids.filter((existing) => existing !== id);
    saveCompareIds(next);
    return { ids: next, added: false, atLimit: false };
  }
  if (ids.length >= MAX_COMPARE) {
    return { ids, added: false, atLimit: true };
  }
  const next = [...ids, id];
  saveCompareIds(next);
  return { ids: next, added: true, atLimit: false };
}

export function clearCompare(): void {
  saveCompareIds([]);
}
