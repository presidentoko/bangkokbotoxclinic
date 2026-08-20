// Pre-deploy: slim master_db.json to fit Vercel 10MB upload limit.
// Drops heavy fields not needed for listing/home/search pages.
// Detail-page data (reviews, doctors) loaded per-clinic at runtime (lib/data.ts).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const SRC = path.join(DATA_DIR, "master_db.json");

if (!fs.existsSync(SRC)) {
  console.log("[slim-db] no master_db.json — skip");
  process.exit(0);
}

const raw = JSON.parse(fs.readFileSync(SRC, "utf-8"));
const clinics = raw.clinics ?? raw;

// Aggressive slim — keep only fields needed for listing/home/search/filter pages.
// Detail pages (clinic/[id]) fetch full record from per-clinic JSON if needed.
const KEEP_FIELDS = new Set([
  "id", "place_id", "name", "name_lang",
  "primary_type", "city_label", "city_slug", "district",
  "rating", "total_reviews", "trust_score",
  "scraped_review_count", "local_guide_count", "avg_author_review_count",
  "categories", "service_mentions", "language_breakdown",
  "business_status", "lat", "lng",
  "phone", "website",  // maps_url dropped — derive from lat/lng at runtime
  "address",
  "_stub", "_source", "_needs_review",  // _match_confidence dropped
  "mentioned_topics", // /best/[criterion] uses this
  "rating_trend",     // ClinicCard + RatingChart
]);

// Trim mentioned_topics to top 8 per clinic (was 32KB/100 → ~3KB/100)
function trimTopics(topics) {
  if (!Array.isArray(topics)) return [];
  return topics
    .filter((t) => t && t.topic && (t.count ?? 0) > 0)
    .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
    .slice(0, 8)
    .map((t) => ({ topic: t.topic, count: t.count }));
}

const beforeSize = fs.statSync(SRC).size;
const slim = clinics.map((c) => {
  const cleaned = {};
  for (const k of Object.keys(c)) {
    if (KEEP_FIELDS.has(k)) cleaned[k] = c[k];
  }
  // Always-defined defaults so code accessing these doesn't crash
  cleaned.categories = cleaned.categories ?? [];
  cleaned.service_mentions = cleaned.service_mentions ?? {};
  cleaned.language_breakdown = cleaned.language_breakdown ?? { th: 0, en: 0, ko: 0, ja: 0, other: 0 };
  cleaned.rating_trend = cleaned.rating_trend ?? {
    recent: { avg: cleaned.rating ?? 0, count: 0 },
    midterm: { avg: cleaned.rating ?? 0, count: 0 },
    old: { avg: cleaned.rating ?? 0, count: 0 },
  };
  cleaned.mentioned_topics = trimTopics(cleaned.mentioned_topics);
  cleaned.business_status = cleaned.business_status ?? "";
  return cleaned;
});

const output = Array.isArray(raw) ? slim : { ...raw, clinics: slim };
fs.writeFileSync(SRC, JSON.stringify(output));
const afterSize = fs.statSync(SRC).size;

console.log(`[slim-db] ${clinics.length} clinics: ${(beforeSize/1048576).toFixed(1)}MB → ${(afterSize/1048576).toFixed(1)}MB (-${((1-afterSize/beforeSize)*100).toFixed(0)}%)`);
