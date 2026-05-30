import { promises as fs } from "node:fs";
import path from "node:path";
import type { MasterDb, Supplier } from "./types";
import { computeTrustScore } from "./trustScore";

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
  }

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
