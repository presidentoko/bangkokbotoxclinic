export type SearchIndexEntity = {
  id: string;
  name: string;
  district: string;
  city_label: string;
  rating: number;
  trust_score: number;
  cuisines: string[];
};

// Module-level singleton — LazySearch and LazyPersonalized both want the
// same 735KB payload on first home-page paint; without this they issued two
// independent parallel fetches for identical data.
let cached: Promise<SearchIndexEntity[]> | null = null;

export function fetchSearchIndex(): Promise<SearchIndexEntity[]> {
  if (!cached) {
    cached = fetch("/api/search-index")
      .then((res) => (res.ok ? res.json() : []))
      .catch(() => []);
  }
  return cached;
}
