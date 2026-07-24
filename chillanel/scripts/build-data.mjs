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
      const lat = num(r.latitude, null);
      const lng = num(r.longitude, null);
      return {
        id: r.place_id.replace(/:/g, "_"),
        name: r.name,
        city: CITY,
        address: (r.formatted_address || "").trim(),
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
        district: nearestDistrict(lat, lng),
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
