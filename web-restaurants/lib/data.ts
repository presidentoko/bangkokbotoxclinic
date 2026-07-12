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
  // Pipeline occasionally emits scores slightly above 100 — clamp once here so
  // every consumer (titles, OG images, feed.xml, cards) gets a sane 0-100 value.
  for (const r of db.restaurants) {
    r.trust_score = Math.max(0, Math.min(100, r.trust_score));
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
  return restaurants.filter((r) => r.cuisines.includes(cuisine));
}

export function filterByDistrict(
  restaurants: Restaurant[], district: string, city?: string
): Restaurant[] {
  return restaurants.filter((r) => r.district === district && (!city || r.city === city));
}

export function filterByCity(restaurants: Restaurant[], city: string): Restaurant[] {
  return restaurants.filter((r) => r.city === city);
}

export function topByTrust(restaurants: Restaurant[], n: number): Restaurant[] {
  return [...restaurants].sort((a, b) => b.trust_score - a.trust_score).slice(0, n);
}

export function getRestaurantById(restaurants: Restaurant[], id: string): Restaurant | undefined {
  return restaurants.find((r) => r.id === id);
}
