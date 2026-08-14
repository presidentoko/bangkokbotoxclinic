// scripts/build-data.mjs
// Reads spa_output/{city}/clinics.csv + reviews/*.csv → data/clinics.{city}.json
// Accepts CLI overrides (--clinics-csv, --reviews-dir, --city, --out) so the
// pipeline is testable against a small fixture instead of the live dataset.
import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { extractMentionsFromReviews } from "./extract-therapists.mjs";
import { extractThemeCounts, sumThemeCounts, SERVICE_THEMES, MOOD_KEYWORDS } from "./extract-themes.mjs";
import { extractPriceMentions } from "./extract-price.mjs";
import { nearestDistrict } from "./extract-district.mjs";
import { parseCoordsFromMapsUrl } from "./extract-coords.mjs";

function argValue(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const CITY = argValue("--city", "bangkok");
const ROOT = path.join(import.meta.dirname, "..", "..");
const CLINICS_CSV = argValue("--clinics-csv", path.join(ROOT, "spa_output", CITY, "clinics.csv"));
const REVIEWS_DIR = argValue("--reviews-dir", path.join(ROOT, "spa_output", CITY, "reviews"));
const OUT_FILE = argValue("--out", path.join(import.meta.dirname, "..", "data", `clinics.${CITY}.json`));

function num(v, fallback = null) {
  const n = parseFloat(String(v ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : fallback;
}

function readCsv(file) {
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, "utf-8").replace(/^﻿/, "");
  return parse(raw, { columns: true, skip_empty_lines: true, relax_column_count: true });
}

function reviewsForPlace(placeId) {
  const fname = placeId.replace(/:/g, "_") + "_reviews.csv";
  const rows = readCsv(path.join(REVIEWS_DIR, fname));
  return rows.map((r) => ({
    id: r.review_id || "",
    rating: num(r.rating, null),
    text: r.text || "",
    authorName: (r.author_name || "").slice(0, 60),
    relativeDate: (r.relative_date || "").slice(0, 30),
  }));
}

function ratingDistribution(reviews) {
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const r of reviews) {
    const rounded = r.rating != null ? Math.round(r.rating) : null;
    if (rounded >= 1 && rounded <= 5) dist[rounded] += 1;
  }
  return dist;
}

const CLOSED_STATUSES = new Set(["CLOSED_PERMANENTLY", "CLOSED_TEMPORARILY"]);

function buildPlaces() {
  const rows = readCsv(CLINICS_CSV);
  console.log(`[build-data] loaded ${rows.length} clinic rows from ${CLINICS_CSV}`);

  const places = rows
    .filter((r) => r.place_id && r.name)
    .filter((r) => !CLOSED_STATUSES.has(String(r.business_status || "").toUpperCase()))
    .map((r) => {
      const reviews = reviewsForPlace(r.place_id);
      const therapistMentions = extractMentionsFromReviews(reviews);
      // The clinics CSV's own latitude/longitude columns are empty for
      // every scraped row, but the maps_url the scraper does capture embeds
      // the same pin coordinates — recover them from there instead of
      // leaving every place un-located (see extract-coords.mjs).
      const csvCoords = { lat: num(r.latitude, null), lng: num(r.longitude, null) };
      const urlCoords = parseCoordsFromMapsUrl(r.maps_url);
      const lat = csvCoords.lat ?? urlCoords?.lat ?? null;
      const lng = csvCoords.lng ?? urlCoords?.lng ?? null;
      return {
        id: r.place_id.replace(/:/g, "_"),
        name: r.name,
        city: CITY,
        // Google Maps' scraped DOM text leaves a stray Private Use Area
        // codepoint (an icon-font glyph, invisible in most fonts/browsers)
        // at the start of formatted_address on 733/734 real places -- found
        // via the full-site audit when it surfaced in structured data even
        // though it never rendered visibly in the UI. Strip it at the
        // source so it's clean everywhere the address is used, not just here.
        address: (r.formatted_address || "").replace(/^[\u{E000}-\u{F8FF}]+/u, "").trim(),
        lat,
        lng,
        phone: r.phone || "",
        website: r.website || "",
        rating: num(r.rating, null),
        reviewCount: num(r.total_reviews, 0) || 0,
        primaryType: r.primary_type || "",
        mapsUrl: r.maps_url || "",
        reviews: reviews.slice(0, 20),
        therapistMentions,
        serviceThemes: extractThemeCounts(reviews, SERVICE_THEMES),
        moodKeywords: extractThemeCounts(reviews, MOOD_KEYWORDS),
        ratingDistribution: ratingDistribution(reviews),
        priceMentions: extractPriceMentions(reviews),
        district: nearestDistrict(lat, lng, CITY),
      };
    })
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount);

  return places;
}

if (!fs.existsSync(CLINICS_CSV)) {
  console.warn(`[build-data] clinics CSV not found: ${CLINICS_CSV}`);
  if (fs.existsSync(OUT_FILE)) {
    console.warn(`[build-data] keeping existing ${OUT_FILE} (no regen).`);
    process.exit(0);
  }
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(
    OUT_FILE,
    JSON.stringify(
      { city: CITY, generatedAt: new Date().toISOString(), places: [], themeAggregate: [], moodAggregate: [] },
      null,
      2
    )
  );
  console.warn(`[build-data] no existing output either — wrote empty stub.`);
  process.exit(0);
}

const places = buildPlaces();
const themeAggregate = sumThemeCounts(places.map((p) => p.serviceThemes));
const moodAggregate = sumThemeCounts(places.map((p) => p.moodKeywords));
fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(
  OUT_FILE,
  JSON.stringify(
    { city: CITY, generatedAt: new Date().toISOString(), places, themeAggregate, moodAggregate },
    null,
    2
  ),
  "utf-8"
);
console.log(`[build-data] wrote ${places.length} places → ${OUT_FILE}`);
console.log(`[build-data] places with therapist mentions: ${places.filter((p) => p.therapistMentions.length > 0).length}`);
console.log(`[build-data] top service themes: ${themeAggregate.slice(0, 5).map((t) => `${t.label}(${t.count})`).join(", ")}`);
console.log(`[build-data] top mood keywords: ${moodAggregate.slice(0, 5).map((t) => `${t.label}(${t.count})`).join(", ")}`);

// Rebuilds public/places-index.json from every data/clinics.*.json on disk
// (not just the city just written) — a client-fetchable index for the
// favorites/compare pages, which have no backend and only know place IDs
// from localStorage. Each place keeps every field except `reviews` (the
// full review text), which is the only field large enough to matter here;
// stripping it keeps a same-shape Place[] so client components can reuse
// PlaceCard directly with no separate slim type.
const DATA_DIR = path.join(import.meta.dirname, "..", "data");
const INDEX_FILE = path.join(import.meta.dirname, "..", "public", "places-index.json");
const allCityFiles = fs
  .readdirSync(DATA_DIR)
  .filter((f) => f.startsWith("clinics.") && f.endsWith(".json"));
const indexPlaces = allCityFiles.flatMap((f) => {
  const cityData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), "utf-8"));
  return (cityData.places ?? []).map((p) => ({ ...p, reviews: [] }));
});
fs.mkdirSync(path.dirname(INDEX_FILE), { recursive: true });
fs.writeFileSync(INDEX_FILE, JSON.stringify(indexPlaces), "utf-8");
console.log(`[build-data] wrote ${indexPlaces.length} places → ${INDEX_FILE} (client index, no review text)`);

// Slim search-only index for SearchBox.tsx — places-index.json above is
// ~2.5MB (every field but reviews) because favorites/compare need the full
// Place shape to render PlaceCard. A search box only needs enough to match
// a query and link to the place, so this is the fields that matter for
// that, nothing else.
const SEARCH_INDEX_FILE = path.join(import.meta.dirname, "..", "public", "search-index.json");
const searchEntries = indexPlaces.map((p) => ({
  id: p.id,
  name: p.name,
  city: p.city,
  district: p.district,
  rating: p.rating,
  reviewCount: p.reviewCount,
  themes: [...new Set([...p.serviceThemes.map((t) => t.label), ...p.moodKeywords.map((t) => t.label)])],
}));
fs.writeFileSync(SEARCH_INDEX_FILE, JSON.stringify(searchEntries), "utf-8");
console.log(`[build-data] wrote ${searchEntries.length} places → ${SEARCH_INDEX_FILE} (search index)`);

// id -> city lookup, server-side only (under data/, not public/ -- this is
// an internal fast-path, not something a client ever needs to fetch).
// place/[id]/page.tsx's on-demand route (dynamicParams=true, the only one
// in [lang]) used to find a place by scanning every city's *full* parsed
// JSON (lib/data.ts's getAllPlaces(), 44MB+ combined and growing with
// Bangkok collection) on every cold start, even for a Pattaya/Phuket place
// that only ever needed its own city's data. This tiny id->city map lets
// lib/data.ts load exactly one city's file instead of all three.
const CITY_INDEX_FILE = path.join(DATA_DIR, "place-city-index.json");
const cityIndex = Object.fromEntries(indexPlaces.map((p) => [p.id, p.city]));
fs.writeFileSync(CITY_INDEX_FILE, JSON.stringify(cityIndex), "utf-8");
console.log(`[build-data] wrote ${Object.keys(cityIndex).length} entries → ${CITY_INDEX_FILE} (id->city index)`);
