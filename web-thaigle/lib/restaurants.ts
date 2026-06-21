import { promises as fs } from "node:fs";
import path from "node:path";
import type { Restaurant } from "./types";

export type SlugEntry = { city: string; district: string; slug: string };
export type SlugMap = Record<string, SlugEntry>;

let _slugMap: SlugMap | null = null;

export async function getSlugMap(): Promise<SlugMap> {
  if (_slugMap) return _slugMap;
  const raw = await fs.readFile(
    path.join(process.cwd(), "data", "slug-map.json"),
    "utf-8"
  );
  _slugMap = JSON.parse(raw) as SlugMap;
  return _slugMap;
}

export function restaurantUrl(entry: SlugEntry): string {
  return `/restaurants/${entry.city}/${entry.district}/${entry.slug}`;
}

export function getRestaurantBySlug(
  restaurants: Restaurant[],
  slugMap: SlugMap,
  city: string,
  district: string,
  slug: string
): Restaurant | undefined {
  const id = Object.entries(slugMap).find(
    ([, v]) => v.city === city && v.district === district && v.slug === slug
  )?.[0];
  if (!id) return undefined;
  return restaurants.find((r) => r.id === id);
}

export function getAllRestaurantParams(slugMap: SlugMap): SlugEntry[] {
  return Object.values(slugMap);
}

export function getTop500Params(
  restaurants: Restaurant[],
  slugMap: SlugMap
): SlugEntry[] {
  const top500ids = [...restaurants]
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 500)
    .map((r) => r.id);
  return top500ids
    .map((id) => slugMap[id])
    .filter((e): e is SlugEntry => !!e);
}
