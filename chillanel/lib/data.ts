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
  // A missing file means the city genuinely isn't scraped yet (cities are
  // discovered dynamically — see scripts/discover-cities.mjs) — empty is
  // correct here. A *parse failure* on a file that does exist means a
  // corrupt/truncated write, and used to fall back to this same empty
  // shape: the build would succeed while quietly dropping every page,
  // sitemap entry, and generateStaticParams slug for that city — an
  // outage disguised as "nothing to see here" for search engines. Since
  // this data is baked in at build time (no runtime DB), throwing here
  // just fails the build loudly instead of shipping a deindexing event.
  if (!fs.existsSync(file)) {
    const empty: CityData = {
      city,
      generatedAt: new Date(0).toISOString(),
      places: [],
      themeAggregate: [],
      moodAggregate: [],
    };
    cache.set(city, empty);
    return empty;
  }
  const parsed = JSON.parse(fs.readFileSync(file, "utf-8")) as CityData;
  cache.set(city, parsed);
  return parsed;
}

export function getPlaceById(city: string, id: string): Place | null {
  return loadCity(city).places.find((p) => p.id === id) ?? null;
}

let placeCityIndexCache: Record<string, string> | null = null;

function loadPlaceCityIndex(): Record<string, string> {
  if (placeCityIndexCache) return placeCityIndexCache;
  const file = path.join(DATA_DIR, "place-city-index.json");
  if (!fs.existsSync(file)) {
    placeCityIndexCache = {};
    return placeCityIndexCache;
  }
  placeCityIndexCache = JSON.parse(fs.readFileSync(file, "utf-8")) as Record<string, string>;
  return placeCityIndexCache;
}

// Finds a place by ID without parsing every city's data. place/[id]/page.tsx
// is the one route in [lang] with dynamicParams=true (see that file for
// why), so a request for a place beyond the prerendered top set used to
// cold-start into getAllPlaces() -- parsing all of data/*.json (44MB+,
// growing with Bangkok collection) just to find one place, even when that
// place's city was knowable in advance from build-data.mjs's
// place-city-index.json. This loads that tiny index first and, on a hit,
// parses only the one relevant city's file via the normal loadCity() cache.
// Falls back to the exhaustive getAllPlaces() scan when the index is
// missing/stale (e.g. a place added between an index rebuild and a
// mid-flight deploy) so correctness never depends on the index being
// perfectly in sync -- it's a fast path, not the source of truth.
export function findPlaceByIdFast(id: string): { city: string; place: Place } | null {
  const city = loadPlaceCityIndex()[id];
  if (city) {
    const place = getPlaceById(city, id);
    if (place) return { city, place };
  }
  return getAllPlaces().find(({ place }) => place.id === id) ?? null;
}

// sitemap.ts alone calls getAllPlaces() 4 times per language, and
// service/district pages call it 2-3x per render on top of that -- each
// call used to re-run flatMap over every city's already-parsed places
// (6,204+ entries and growing). loadCity's cache means the JSON itself is
// only read/parsed once per warm instance; this does the same for the
// flattened { city, place }[] view so repeat callers reuse one array
// instead of re-allocating it every time.
let allPlacesCache: { city: string; place: Place }[] | null = null;

export function getAllPlaces(): { city: string; place: Place }[] {
  if (allPlacesCache) return allPlacesCache;
  allPlacesCache = listCities().flatMap((city) => loadCity(city).places.map((place) => ({ city, place })));
  return allPlacesCache;
}
