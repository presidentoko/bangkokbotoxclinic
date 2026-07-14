// Header global search — merges category, region, and supplier matches into one
// ranked result list. Pure functions, no DOM — testable without a browser.
import { CATEGORY_LABELS } from "./types";
import { citySlugFromDisplay } from "./cityNorm";
import type { BrowseEntry } from "./browseIndex";

const MIN_QUERY_LEN = 2;

export type SearchResult =
  | { kind: "category"; key: string; label: string; href: string }
  | { kind: "region"; label: string; count: number; href: string }
  | { kind: "supplier"; id: string; name: string; cityLabel: string; district: string | null; trustScore: number; href: string };

export function matchCategories(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < MIN_QUERY_LEN) return [];
  return Object.entries(CATEGORY_LABELS)
    .filter(([, label]) => label.toLowerCase().includes(q))
    .map(([key, label]) => ({ kind: "category" as const, key, label, href: `/c/${key}` }));
}

/** Group browse-index entries by city_label. Compute once per fetched dataset. */
export function regionCounts(entries: BrowseEntry[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const e of entries) {
    if (!e.city_label) continue;
    m.set(e.city_label, (m.get(e.city_label) ?? 0) + 1);
  }
  return m;
}

export function matchRegions(query: string, counts: Map<string, number>): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < MIN_QUERY_LEN) return [];
  return Array.from(counts.entries())
    .filter(([label]) => label.toLowerCase().includes(q))
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({
      kind: "region" as const,
      label,
      count,
      href: `/city/${citySlugFromDisplay(label)}`,
    }));
}

export function matchSuppliers(query: string, entries: BrowseEntry[], limit: number): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < MIN_QUERY_LEN || limit <= 0) return [];
  return entries
    .filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        (e.district && e.district.toLowerCase().includes(q)) ||
        (e.city_label && e.city_label.toLowerCase().includes(q)),
    )
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, limit)
    .map((e) => ({
      kind: "supplier" as const,
      id: e.id,
      name: e.name,
      cityLabel: e.city_label,
      district: e.district,
      trustScore: e.trust_score,
      href: `/supplier/${e.id}`,
    }));
}

const MAX_RESULTS = 12;
const MAX_CATEGORY_RESULTS = 4;
const MAX_REGION_RESULTS = 4;

/** Category/region matches ranked first (cheap "browse many" wins), then top suppliers by trust. */
export function globalSearch(query: string, entries: BrowseEntry[], counts: Map<string, number>): SearchResult[] {
  const categories = matchCategories(query).slice(0, MAX_CATEGORY_RESULTS);
  const regions = matchRegions(query, counts).slice(0, MAX_REGION_RESULTS);
  const remaining = Math.max(0, MAX_RESULTS - categories.length - regions.length);
  const suppliers = matchSuppliers(query, entries, remaining);
  return [...categories, ...regions, ...suppliers];
}
