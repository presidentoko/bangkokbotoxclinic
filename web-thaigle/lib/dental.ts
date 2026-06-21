// lib/dental.ts
import { promises as fs } from "node:fs";
import path from "node:path";

export type DentalClinic = {
  id: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  phone: string;
  website: string;
  rating: number;
  total_reviews: number;
  maps_url: string;
};

export type DentalDb = {
  generated_at: string;
  clinics: DentalClinic[];
};

let _cache: DentalDb | null = null;

export async function loadDentalDb(): Promise<DentalDb> {
  if (_cache) return _cache;
  const raw = await fs.readFile(path.join(process.cwd(), "data", "dental.json"), "utf-8");
  _cache = JSON.parse(raw) as DentalDb;
  return _cache;
}

export function topDentalByRating(clinics: DentalClinic[], n: number): DentalClinic[] {
  return [...clinics]
    .filter((c) => c.total_reviews >= 5)
    .sort((a, b) => b.rating * Math.log10(b.total_reviews + 1) - a.rating * Math.log10(a.total_reviews + 1))
    .slice(0, n);
}
