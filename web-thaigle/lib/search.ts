// lib/search.ts
// Client-safe place search using a slim search index
// NOTE: This is a simple prefix/fuzzy match — no external deps needed

// This file is imported by client components (HomeSearch), so it must not
// pull in lib/places.ts's full 4.25MB places-data.json (hero images, i18n
// translations, receipts, etc.) — a search index only ever needs these 6
// fields. See scripts/build-search-index.mjs for how this file is generated.
//
// This module itself is meant to be loaded via dynamic import() from
// client components (not a static top-level import) — the JSON below is
// ~324KB, and isUrl/detectPlatform (needed on every keystroke) live in
// lib/searchUtils.ts specifically so they don't drag this in eagerly.
import SEARCH_INDEX from "@/lib/places-search-index.json";
import type { SearchResult } from "@/lib/searchUtils";

export type { SearchResult } from "@/lib/searchUtils";
export { isUrl, detectPlatform } from "@/lib/searchUtils";

const PLACES = SEARCH_INDEX as SearchResult[];

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9฀-๿]/g, " ").replace(/\s+/g, " ").trim();
}

function score(query: string, place: SearchResult): number {
  const q = normalize(query);
  const name = normalize(place.name);
  const area = normalize(place.area);
  const subtype = normalize(place.subtype);
  const combined = `${name} ${area} ${subtype}`;

  if (name === q) return 100;
  if (name.startsWith(q)) return 90;
  if (combined.includes(q)) return 70;

  // Word-level match
  const words = q.split(" ");
  const matchedWords = words.filter((w) => combined.includes(w));
  if (matchedWords.length === words.length) return 60;
  if (matchedWords.length > 0) return 40 * (matchedWords.length / words.length);

  return 0;
}

export function searchPlaces(query: string, limit = 5): SearchResult[] {
  if (!query.trim()) return [];
  return PLACES
    .map((p) => ({ place: p, score: score(query, p) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ place }) => place);
}
