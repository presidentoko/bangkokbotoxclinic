import fs from "node:fs";
import path from "node:path";
import type { CityData, Place } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

const cache = new Map<string, CityData>();

export function listCities(): string[] {
  if (!fs.existsSync(DATA_DIR)) return [];
  // .sort() matters here, not just cosmetic: fs.readdirSync's order is
  // alphabetical on Windows NTFS (where this was always developed/tested)
  // but unspecified on Linux ext4 (Vercel's build container) -- without
  // this, cities[0] (the hardcoded per-city fallback used by
  // service/[theme]/page.tsx and district/[district]/page.tsx) could
  // silently become a different city on any given deploy.
  return fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.startsWith("clinics.") && f.endsWith(".json"))
    .map((f) => f.slice("clinics.".length, -".json".length))
    .sort();
}

export function loadCity(city: string): CityData {
  const cached = cache.get(city);
  if (cached) return cached;
  const file = path.join(DATA_DIR, `clinics.${city}.json`);
  const empty: CityData = {
    city,
    generatedAt: new Date(0).toISOString(),
    places: [],
    themeAggregate: [],
    moodAggregate: [],
  };
  if (!fs.existsSync(file)) {
    cache.set(city, empty);
    return empty;
  }
  let parsed: CityData;
  try {
    parsed = JSON.parse(fs.readFileSync(file, "utf-8")) as CityData;
  } catch (e) {
    console.error(`loadCity: failed to parse ${file}, falling back to empty city data: ${(e as Error).message}`);
    cache.set(city, empty);
    return empty;
  }
  cache.set(city, parsed);
  return parsed;
}

export function getPlaceById(city: string, id: string): Place | null {
  return loadCity(city).places.find((p) => p.id === id) ?? null;
}

export function getAllPlaces(): { city: string; place: Place }[] {
  return listCities().flatMap((city) => loadCity(city).places.map((place) => ({ city, place })));
}
