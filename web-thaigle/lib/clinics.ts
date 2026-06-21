// lib/clinics.ts
import { promises as fs } from "node:fs";
import path from "node:path";

export type Clinic = {
  id: string;
  name: string;
  type: string;
  address: string;
  lat: number | null;
  lng: number | null;
  phone: string;
  website: string;
  rating: number;
  total_reviews: number;
  maps_url: string;
};

export type ClinicDb = {
  generated_at: string;
  clinics: Clinic[];
};

let _cache: ClinicDb | null = null;

export async function loadClinicDb(): Promise<ClinicDb> {
  if (_cache) return _cache;
  const raw = await fs.readFile(path.join(process.cwd(), "data", "clinics.json"), "utf-8");
  _cache = JSON.parse(raw) as ClinicDb;
  return _cache;
}

export function topClinicsByRating(clinics: Clinic[], n: number): Clinic[] {
  return [...clinics]
    .filter((c) => c.total_reviews >= 10)
    .sort((a, b) => b.rating * Math.log10(b.total_reviews + 1) - a.rating * Math.log10(a.total_reviews + 1))
    .slice(0, n);
}
