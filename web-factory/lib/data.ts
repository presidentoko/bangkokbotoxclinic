import { promises as fs } from "node:fs";
import path from "node:path";
import type { MasterDb, Supplier } from "./types";
import { computeTrustScore } from "./trustScore";
import { normalizeProvince } from "./provinceNorm";
import { normalizeCity, citySlugFromDisplay } from "./cityNorm";

const DATA_PATH = path.join(process.cwd(), "data", "master_db.json");
const PHOTOS_PATH = path.join(process.cwd(), "data", "supplier_photos.json");

let _cache: MasterDb | null = null;

export async function loadMasterDb(): Promise<MasterDb> {
  if (_cache) return _cache;
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  const db = JSON.parse(raw) as MasterDb;

  // Optional sidecar — supplier hero photos scraped from supplier websites.
  let photos: Record<string, string> = {};
  try {
    const pRaw = await fs.readFile(PHOTOS_PATH, "utf-8");
    photos = JSON.parse(pRaw);
  } catch {
    // sidecar optional
  }
  for (const s of db.suppliers) {
    if (photos[s.id]) s.hero_image = photos[s.id];
    s.province_en = normalizeProvince(s.province_en);
    // city_label is the display string grouped/filtered on across the site
    // (By Region lists, filter dropdowns). Raw source data has Latin-spelling
    // and Thai-script duplicates of the same province — collapse them here so
    // every consumer downstream sees one canonical label for free.
    // normalizeProvince() already handles "no match" by passing the trimmed
    // original straight through (NORM[trimmed] ?? trimmed) — it only returns
    // "" for values explicitly mapped to it (known garbage like raw "City"/
    // "N/A"). A `|| s.city_label` fallback here would undo that on purpose,
    // reviving the exact garbage value normalization was meant to discard.
    const normalizedLabel = normalizeProvince(s.city_label);
    s.city_label = normalizedLabel;
    s.city = normalizeCity(s.city);
    if (!s.city || s.city === "thailand" || s.city === "city") {
      s.city = citySlugFromDisplay(normalizedLabel) || s.city;
    }
  }

  // db.city_counts is a raw aggregate baked in by the (out-of-repo) build
  // pipeline and was never run through the normalization above, so it still
  // has Latin/Thai-script duplicate keys ("Chon Buri" vs "Chonburi" vs
  // "ชลบุรี") for provinces the per-supplier loop just collapsed. Recompute
  // it from the now-normalized city_label so every consumer that reads
  // db.city_counts (city filter dropdowns, By Region pills, /city/[name]'s
  // generateStaticParams, the browse/city index build scripts) sees one
  // canonical key per city instead of rebuilding this fix independently.
  const cityCounts: Record<string, number> = {};
  for (const s of db.suppliers) {
    if (!s.city_label) continue;
    cityCounts[s.city_label] = (cityCounts[s.city_label] ?? 0) + 1;
  }
  db.city_counts = cityCounts;

  _cache = db;
  return _cache;
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9฀-๿]+/g, "-").replace(/^-+|-+$/g, "");
}

export function filterByCategory(suppliers: Supplier[], cat: string): Supplier[] {
  return suppliers.filter((s) => s.categories.includes(cat));
}

export function filterByDistrict(suppliers: Supplier[], district: string, city?: string): Supplier[] {
  return suppliers.filter((s) => s.district === district && (!city || s.city === city));
}

export function filterByCity(suppliers: Supplier[], city: string): Supplier[] {
  return suppliers.filter((s) => s.city === city);
}

export function topByTrust(suppliers: Supplier[], n: number): Supplier[] {
  return [...suppliers]
    .sort((a, b) => computeTrustScore(b).overall - computeTrustScore(a).overall)
    .slice(0, n);
}

export function getSupplierById(suppliers: Supplier[], id: string): Supplier | undefined {
  return suppliers.find((s) => s.id === id);
}
