// Slim per-supplier record for the side-by-side comparison tool.
// toCompareEntry is pure; scripts/build_compare_index.mts maps the whole DB into
// public/compare-index.json (keyed by id) so the client /compare page can fetch
// only the fields it needs without shipping the full supplier database.

import type { Supplier } from "./types";
import { computeTrustScore } from "./trustScore";

export type CompareEntry = {
  id: string;
  name: string;
  cityLabel: string;
  district: string;
  trust: { overall: number; tier: string };
  rating: number;
  reviews: number;
  verifications: { dbd: boolean; halal: boolean; estate: boolean; tsic: boolean };
  categories: string[];
};

export type CompareIndex = Record<string, CompareEntry>;

export function toCompareEntry(s: Supplier): CompareEntry {
  const t = computeTrustScore(s);
  return {
    id: s.id,
    name: s.name,
    cityLabel: s.city_label || "",
    district: s.district || "",
    trust: { overall: t.overall, tier: t.tier },
    rating: s.rating || 0,
    reviews: s.total_reviews || 0,
    verifications: {
      dbd: !!s.dbd,
      halal: !!s.halal_certified,
      estate: !!s.estate_name,
      tsic: !!s.dbd?.tsic_code,
    },
    categories: s.categories || [],
  };
}
