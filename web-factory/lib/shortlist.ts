// Shared client-side "shortlist" of suppliers, backed by localStorage.
// First consumer is the bulk-quote feature; Comparison / Favorites can reuse it.
// Pure helpers (testable, no DOM) + thin localStorage wrappers (guard typeof window).

export type ShortlistItem = { id: string; name: string; cityLabel: string };

export const MAX_SHORTLIST = 50;
const KEY = "tsh_shortlist";
const EVENT = "shortlist:change";

// ── Pure helpers ──────────────────────────────────────────────
/** Add to the FRONT, dedupe by id, cap at MAX (drops the oldest). */
export function addItem(list: ShortlistItem[], item: ShortlistItem): ShortlistItem[] {
  const without = list.filter((x) => x.id !== item.id);
  return [item, ...without].slice(0, MAX_SHORTLIST);
}

export function removeItem(list: ShortlistItem[], id: string): ShortlistItem[] {
  return list.filter((x) => x.id !== id);
}

export function hasItem(list: ShortlistItem[], id: string): boolean {
  return list.some((x) => x.id === id);
}

/** "Name (City) [id], …" — used in the RFQ subject/body. */
export function formatSuppliersLine(list: ShortlistItem[]): string {
  return list.map((x) => `${x.name} (${x.cityLabel}) [${x.id}]`).join(", ");
}

// ── localStorage wrappers ─────────────────────────────────────
export function loadShortlist(): ShortlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is ShortlistItem =>
        x && typeof x.id === "string" && typeof x.name === "string" && typeof x.cityLabel === "string",
    );
  } catch {
    return [];
  }
}

function save(list: ShortlistItem[]): ShortlistItem[] {
  if (typeof window === "undefined") return list;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* quota / privacy mode — non-fatal */
  }
  return list;
}

export function addToShortlist(item: ShortlistItem): ShortlistItem[] {
  return save(addItem(loadShortlist(), item));
}

export function removeFromShortlist(id: string): ShortlistItem[] {
  return save(removeItem(loadShortlist(), id));
}

export function clearShortlist(): ShortlistItem[] {
  return save([]);
}

/** Subscribe to changes (same-tab CustomEvent + cross-tab storage). Returns unsubscribe. */
export function subscribeShortlist(cb: () => void): () => void {
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
