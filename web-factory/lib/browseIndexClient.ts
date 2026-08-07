// Single client-side cache for public/browse-index.json.
//
// Three separate places used to call fetch("/browse-index.json") independently
// (hero search, valid-id pruning, and now the filterable supplier list). The file
// is ~1.9MB, so each extra caller was a real risk of a duplicate download —
// browsers only coalesce identical in-flight requests opportunistically. Everyone
// goes through this module now, so the payload is fetched at most once per page.
import type { BrowseEntry } from "./browseIndex";

let cache: Promise<BrowseEntry[]> | null = null;

export function loadBrowseIndex(): Promise<BrowseEntry[]> {
  if (typeof window === "undefined") return Promise.resolve([]);
  if (!cache) {
    cache = fetch("/browse-index.json")
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => {
        // Don't leave a rejected/empty promise cached — a transient network
        // failure would otherwise make every later caller see an empty index
        // for the rest of the session. Reset so the next call retries.
        cache = null;
        return [] as BrowseEntry[];
      });
  }
  return cache;
}
