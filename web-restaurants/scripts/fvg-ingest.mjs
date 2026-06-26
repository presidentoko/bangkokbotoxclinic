#!/usr/bin/env node
// scripts/fvg-ingest.mjs
// Ingest an Outscraper Instagram CSV export into data/ig-seed.json.
//
// Usage:
//   npm run fvg:ingest -- path/to/outscraper-export.csv
//   npm run fvg:ingest -- path/to/outscraper-export.csv bangkok-restaurants
//
// Arguments:
//   1. CSV file path (required)
//   2. category slug (optional, default: derived from filename or "bangkok-cafes")

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, "..");
const SEED_PATH = join(root, "data", "ig-seed.json");

const [csvPath, categoryArg] = process.argv.slice(2);

if (!csvPath) {
  console.error("Usage: npm run fvg:ingest -- <csv-path> [category-slug]");
  process.exit(1);
}

const category = categoryArg ?? basename(csvPath, ".csv").replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "bangkok-cafes";

console.log(`[fvg-ingest] Reading CSV: ${csvPath}`);
console.log(`[fvg-ingest] Target category: ${category}`);

// ── Minimal CSV parser (handles quoted fields) ────────────────────────────────
function splitCsvLine(line) {
  const result = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(field.trim());
      field = "";
    } else {
      field += ch;
    }
  }
  result.push(field.trim());
  return result;
}

// ── Configurable column map — update these to match your Outscraper export ────
// Run once without this map; the script will print detected headers on error.
const COLUMN_MAP = {
  name: "name",
  place_id: "place_id",
  district: "district",
  city: "city",
  tag_count: "tagged_posts",   // rename if your export uses a different column
  ig_signal_text: "hashtag",   // optional
};

const csvText = readFileSync(csvPath, "utf-8");
const lines = csvText.split(/\r?\n/).filter((l) => l.trim());

if (lines.length < 2) {
  console.error("[fvg-ingest] CSV appears empty (less than 2 lines).");
  process.exit(1);
}

const headers = splitCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/^"|"$/g, ""));
console.log(`[fvg-ingest] Detected headers: ${headers.join(", ")}`);

const nameCol = COLUMN_MAP.name.toLowerCase();
if (!headers.includes(nameCol)) {
  console.error(
    `[fvg-ingest] Required column "${COLUMN_MAP.name}" not found.\n` +
      `Update COLUMN_MAP in scripts/fvg-ingest.mjs to match your export.\n` +
      `Detected: ${headers.join(", ")}`
  );
  process.exit(1);
}

function col(row, key) {
  if (!key) return null;
  const idx = headers.indexOf(key.toLowerCase());
  if (idx === -1) return null;
  return (row[idx] ?? "").trim().replace(/^"|"$/g, "") || null;
}

const incoming = [];
for (const line of lines.slice(1)) {
  const row = splitCsvLine(line);
  const name = col(row, COLUMN_MAP.name);
  if (!name) continue;

  const tagRaw = col(row, COLUMN_MAP.tag_count);
  const tagCount = tagRaw ? parseInt(tagRaw.replace(/[^0-9]/g, ""), 10) || null : null;
  const igSignal = tagCount !== null
    ? `${tagCount.toLocaleString()} tagged posts`
    : "Frequently tagged on social";

  incoming.push({
    name,
    ig_signal: igSignal,
    tag_count: tagCount,
    place_id: col(row, COLUMN_MAP.place_id),
    district: col(row, COLUMN_MAP.district),
    city: col(row, COLUMN_MAP.city) ?? "bangkok",
    category,
  });
}

console.log(`[fvg-ingest] Parsed ${incoming.length} entries from CSV.`);

// ── Merge into existing seed (dedupe by place_id, then name+district) ─────────
const existing = JSON.parse(readFileSync(SEED_PATH, "utf-8"));
const byPlaceId = new Set(existing.filter((e) => e.place_id).map((e) => e.place_id));
const byNameDistrict = new Set(existing.map((e) => `${e.name.toLowerCase()}|${e.district ?? ""}`));

const added = [];
for (const entry of incoming) {
  if (entry.place_id && byPlaceId.has(entry.place_id)) continue;
  const key = `${entry.name.toLowerCase()}|${entry.district ?? ""}`;
  if (byNameDistrict.has(key)) continue;
  added.push(entry);
  if (entry.place_id) byPlaceId.add(entry.place_id);
  byNameDistrict.add(key);
}

const merged = [...existing, ...added];
writeFileSync(SEED_PATH, JSON.stringify(merged, null, 2) + "\n", "utf-8");

console.log(`[fvg-ingest] Done.`);
console.log(`  Existing entries : ${existing.length}`);
console.log(`  New entries added: ${added.length}`);
console.log(`  Total in seed    : ${merged.length}`);
console.log(`  Skipped (dupes)  : ${incoming.length - added.length}`);
console.log(`\nRun the audit to re-check distribution:`);
console.log(`  node scripts/fvg-audit.mjs`);
