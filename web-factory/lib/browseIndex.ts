// Slim per-supplier record shared by the homepage/category search box and
// filterable list. scripts/build_browse_index.mts maps the whole DB into
// public/browse-index.json (sorted by trust score) so pages can ship only a
// small initial slice server-side and lazy-fetch the rest client-side,
// instead of embedding all ~5,000 suppliers in every page's HTML.
import type { Supplier } from "./types";
import { computeTrustScore } from "./trustScore";

export type BrowseEntry = {
  id: string;
  name: string;
  city_label: string;
  district: string | null;
  rating: number;
  trust_score: number;
  categories: string[];
  dbd: boolean;
};

// city_label is expected to already be normalized (lib/data.ts's loadMasterDb()
// runs every supplier through normalizeProvince() before this is called) — do
// not re-normalize here. A previous version did `normalizeProvince(s.city_label)
// || s.city_label`, which undid normalizeProvince's intentional "" for known
// garbage values (e.g. raw "City") by falling back to the un-normalized original.
export function toBrowseEntry(s: Supplier): BrowseEntry {
  return {
    id: s.id,
    name: s.name,
    city_label: s.city_label || "",
    district: s.district ?? null,
    rating: s.rating || 0,
    trust_score: computeTrustScore(s).overall,
    categories: s.categories || [],
    dbd: !!s.dbd,
  };
}
