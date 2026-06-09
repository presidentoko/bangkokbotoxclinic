// Auto-generated course-vs-course pairs. For each major city we take the
// top N courses by trust_score and emit all C(N,2) pairs. This produces
// ~50-80 pages with no manual curation. Slug format: {a-name}-vs-{b-name}.

import type { Course } from "./types";

const CITIES_FOR_PAIRS = [
  "bangkok",
  "chon_buri",              // Pattaya
  "prachuap_khiri_khan",    // Hua Hin
  "phuket",
  "chiang_mai",
  "chiang_rai",
  "rayong",
  "nakhon_ratchasima",      // Korat
];

const TOP_N_PER_CITY = 6;  // C(6,2) = 15 pairs × 8 cities ≈ 115 pairs

export type ComparePair = {
  slug: string;
  aId: string;
  bId: string;
  city: string;
  cityLabel: string;
};

function nameSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export function buildComparePairs(courses: Course[]): ComparePair[] {
  const pairs: ComparePair[] = [];
  const seen = new Set<string>();

  for (const citySlug of CITIES_FOR_PAIRS) {
    const cityCourses = courses
      .filter((c) =>
        c.city === citySlug &&
        c.trust_score >= 50 &&
        (c.categories.includes("course") ||
         c.categories.includes("club") ||
         c.categories.includes("country_club") ||
         c.categories.includes("resort"))
      )
      .sort((a, b) => b.trust_score - a.trust_score)
      .slice(0, TOP_N_PER_CITY);

    if (cityCourses.length < 2) continue;
    const cityLabel = cityCourses[0].city_label;

    for (let i = 0; i < cityCourses.length; i++) {
      for (let j = i + 1; j < cityCourses.length; j++) {
        const a = cityCourses[i];
        const b = cityCourses[j];
        const aSlug = nameSlug(a.name);
        const bSlug = nameSlug(b.name);
        // Order alphabetically for stable URLs
        const [first, second, firstId, secondId] = aSlug < bSlug
          ? [aSlug, bSlug, a.id, b.id]
          : [bSlug, aSlug, b.id, a.id];
        const slug = `${first}-vs-${second}`;
        if (seen.has(slug)) continue;
        seen.add(slug);
        pairs.push({
          slug,
          aId: firstId,
          bId: secondId,
          city: citySlug,
          cityLabel,
        });
      }
    }
  }
  return pairs;
}
