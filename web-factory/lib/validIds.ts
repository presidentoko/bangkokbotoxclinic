// Validates supplier IDs stored client-side (favorites/shortlist/recently-viewed)
// against the current dataset. A supplier can be removed in a later data
// refresh; without this check, its ID lingers in localStorage forever and
// clicking it hits the /supplier/* middleware, which now answers 410 Gone.
import { loadBrowseIndex } from "./browseIndexClient";

let cache: Promise<Set<string>> | null = null;

export function loadValidIds(): Promise<Set<string>> {
  if (typeof window === "undefined") return Promise.resolve(new Set());
  if (!cache) {
    cache = loadBrowseIndex().then((data) => {
      // An empty index means the fetch failed (loadBrowseIndex already reset its
      // own cache). Don't memoize that as "zero valid ids" — every future
      // .has(id) check would be false and prune every real entry.
      if (data.length === 0) {
        cache = null;
        return new Set<string>();
      }
      return new Set(data.map((d) => d.id));
    });
  }
  return cache;
}
