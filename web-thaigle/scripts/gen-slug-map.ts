import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { makeUniqueSlug } from "../lib/slugify";

const DB_PATH = path.join(process.cwd(), "data", "master_db.json");
const OUT_PATH = path.join(process.cwd(), "data", "slug-map.json");

const db = JSON.parse(readFileSync(DB_PATH, "utf-8"));
const seen = new Set<string>();
const map: Record<string, { city: string; district: string; slug: string }> = {};

for (const r of db.restaurants) {
  const district = r.district || "other";
  const slug = makeUniqueSlug(r.name, district, seen);
  map[r.id] = { city: r.city, district, slug };
}

writeFileSync(OUT_PATH, JSON.stringify(map, null, 2));
console.log(`Generated slug map for ${Object.keys(map).length} restaurants`);
