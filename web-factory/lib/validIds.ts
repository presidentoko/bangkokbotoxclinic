// Validates supplier IDs stored client-side (favorites/shortlist/recently-viewed)
// against the current dataset. A supplier can be removed in a later data
// refresh; without this check, its ID lingers in localStorage forever and
// clicking it hits the /supplier/* catch-all redirect straight to the
// homepage instead of a helpful "no longer listed" state.
let cache: Promise<Set<string>> | null = null;

export function loadValidIds(): Promise<Set<string>> {
  if (typeof window === "undefined") return Promise.resolve(new Set());
  if (!cache) {
    cache = fetch("/browse-index.json")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: { id: string }[]) => new Set(data.map((d) => d.id)))
      .catch(() => new Set<string>());
  }
  return cache;
}
