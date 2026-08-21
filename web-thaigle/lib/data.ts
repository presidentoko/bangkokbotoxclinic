// master_db.json 로딩 + 필터링 헬퍼.

import { promises as fs } from "node:fs";
import path from "node:path";
import type { MasterDb, Restaurant } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "master_db.json");

let _cache: MasterDb | null = null;

export async function loadMasterDb(): Promise<MasterDb> {
  if (_cache) return _cache;
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  const db = JSON.parse(raw) as MasterDb;
  for (const r of db.restaurants) {
    // Round once, here. trust_score is fractional in 2,873 of 3,269 rows and
    // was printed raw in the lists ("Trust 87.3") while TrustDonut rendered
    // Math.round of the same number ("87") a few hundred pixels away on the
    // same page. One value, one rounding.
    r.trust_score = Math.round(Math.max(0, Math.min(100, r.trust_score)));
  }
  _cache = db;
  return _cache;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9฀-๿]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function filterByCuisine(restaurants: Restaurant[], cuisine: string): Restaurant[] {
  return restaurants.filter((r) => isListable(r) && r.cuisines.includes(cuisine));
}

export function filterByDistrict(
  restaurants: Restaurant[], district: string, city?: string
): Restaurant[] {
  return restaurants.filter((r) => isListable(r) && r.district === district && (!city || r.city === city));
}

export function filterByCity(restaurants: Restaurant[], city: string): Restaurant[] {
  return restaurants.filter((r) => isListable(r) && r.city === city);
}

const NON_FOOD_TYPES = [
  "shopping mall", "shopping centre", "department store", "supermarket",
  "tourist attraction", "amusement park", "trampoline park",
];

export function isFood(r: Restaurant): boolean {
  const cat = (r.primary_type || "").toLowerCase();
  return !NON_FOOD_TYPES.some((t) => cat.includes(t));
}

/**
 * Permanently-closed venues, per Google. Temporarily-closed ones deliberately
 * stay: they reopen, and the detail page warns about it.
 */
export function isOpen(r: Restaurant): boolean {
  return !/^Permanently closed$/i.test((r.business_status || "").trim());
}

/**
 * Whether a venue belongs in a ranked list at all.
 *
 * isFood existed and nothing in the restaurant tree called it, so
 * /restaurants/cuisine/halal opened with "Central Pinklao" — a shopping
 * centre — at #1 of 103, and a trampoline park had a full restaurant page.
 * business_status was read only by the listing card, never by the ranking,
 * so a permanently-closed venue could hold a Trust Score of 92 on a hub.
 * Both gates belong at the same place: the point where a list is built.
 */
export function isListable(r: Restaurant): boolean {
  return isFood(r) && isOpen(r);
}

export function topByTrust(restaurants: Restaurant[], n: number): Restaurant[] {
  return [...restaurants].filter(isFood).sort((a, b) => b.trust_score - a.trust_score).slice(0, n);
}

export function getRestaurantById(restaurants: Restaurant[], id: string): Restaurant | undefined {
  return restaurants.find((r) => r.id === id);
}
