// Recently-viewed suppliers, backed by localStorage.
// Tracks the last 8 visited supplier pages across sessions.

export type RecentItem = {
  id: string;
  name: string;
  cityLabel: string;
  trustScore: number;
  categories: string[];
};

const KEY = "tsh_recent";
const MAX = 8;
const EVENT = "recent:change";

export function loadRecent(): RecentItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is RecentItem =>
        x &&
        typeof x.id === "string" &&
        typeof x.name === "string" &&
        typeof x.cityLabel === "string" &&
        typeof x.trustScore === "number",
    );
  } catch {
    return [];
  }
}

export function recordView(item: RecentItem): void {
  if (typeof window === "undefined") return;
  try {
    const current = loadRecent().filter((x) => x.id !== item.id);
    const next = [item, ...current].slice(0, MAX);
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    // non-fatal
  }
}

export function subscribeRecent(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
