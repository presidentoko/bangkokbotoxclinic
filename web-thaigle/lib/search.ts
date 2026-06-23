// lib/search.ts
// Client-safe place search using the places DB
// NOTE: This is a simple prefix/fuzzy match — no external deps needed

import { getAllPlaces } from "@/lib/places";
import type { Place } from "@/lib/places";

export type SearchResult = {
  slug: string;
  name: string;
  category: Place["category"];
  subtype: string;
  area: string;
  localsScore: number;
};

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9฀-๿]/g, " ").replace(/\s+/g, " ").trim();
}

function score(query: string, place: Place): number {
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
  const places = getAllPlaces();
  return places
    .map((p) => ({ place: p, score: score(query, p) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ place }) => ({
      slug: place.slug,
      name: place.name,
      category: place.category,
      subtype: place.subtype,
      area: place.area,
      localsScore: place.localsScore,
    }));
}

export function isUrl(input: string): boolean {
  return (
    /^https?:\/\//.test(input.trim()) ||
    /^(www\.|tiktok\.com|instagram\.com|ig\.me)/.test(input.trim())
  );
}

export function detectPlatform(url: string): "tiktok" | "instagram" | "other" {
  if (/tiktok\.com/.test(url)) return "tiktok";
  if (/instagram\.com|ig\.me/.test(url)) return "instagram";
  return "other";
}
