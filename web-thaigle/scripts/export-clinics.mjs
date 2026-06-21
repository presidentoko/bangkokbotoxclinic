// scripts/export-clinics.mjs
// Run: node scripts/export-clinics.mjs
import { readFileSync } from "fs";
import { writeFile } from "fs/promises";
import path from "path";

const CSV = path.join(process.cwd(), "..", "bangkok_clinics", "output", "clinics.csv");
const OUT = path.join(process.cwd(), "data", "clinics.json");

/**
 * RFC 4180-compliant CSV parser that handles quoted fields with embedded newlines/commas.
 * Returns array of objects keyed by header row.
 */
function parseCsv(text) {
  // Strip BOM if present
  const clean = text.startsWith("﻿") ? text.slice(1) : text;

  const records = [];
  let headers = null;
  let row = [];
  let field = "";
  let inQuote = false;
  let i = 0;

  while (i < clean.length) {
    const ch = clean[i];

    if (inQuote) {
      if (ch === '"') {
        // Check for escaped quote ""
        if (i + 1 < clean.length && clean[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        } else {
          inQuote = false;
          i++;
          continue;
        }
      } else {
        field += ch;
        i++;
        continue;
      }
    }

    if (ch === '"') {
      inQuote = true;
      i++;
      continue;
    }

    if (ch === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }

    if (ch === "\r" && i + 1 < clean.length && clean[i + 1] === "\n") {
      row.push(field);
      field = "";
      if (!headers) {
        headers = row;
      } else if (row.some((c) => c.trim())) {
        records.push(Object.fromEntries(headers.map((h, idx) => [h.trim(), (row[idx] ?? "").trim()])));
      }
      row = [];
      i += 2;
      continue;
    }

    if (ch === "\n") {
      row.push(field);
      field = "";
      if (!headers) {
        headers = row;
      } else if (row.some((c) => c.trim())) {
        records.push(Object.fromEntries(headers.map((h, idx) => [h.trim(), (row[idx] ?? "").trim()])));
      }
      row = [];
      i++;
      continue;
    }

    field += ch;
    i++;
  }

  // Handle last row if file doesn't end with newline
  if (field || row.length) {
    row.push(field);
    if (headers && row.some((c) => c.trim())) {
      records.push(Object.fromEntries(headers.map((h, idx) => [h.trim(), (row[idx] ?? "").trim()])));
    }
  }

  return records;
}

const raw = readFileSync(CSV, "utf-8");
const allRows = parseCsv(raw);

const rows = [];
for (const row of allRows) {
  if (!row.place_id || !row.name || row.business_status === "CLOSED_PERMANENTLY") continue;
  rows.push({
    id: row.place_id,
    name: row.name,
    type: row.primary_type || "clinic",
    address: row.formatted_address || "",
    lat: parseFloat(row.latitude) || null,
    lng: parseFloat(row.longitude) || null,
    phone: row.phone || "",
    website: row.website || "",
    rating: parseFloat(row.rating) || 0,
    total_reviews: parseInt(row.total_reviews) || 0,
    maps_url: row.maps_url || "",
  });
}

await writeFile(OUT, JSON.stringify({ generated_at: new Date().toISOString(), clinics: rows }, null, 2));
console.log(`✓ Exported ${rows.length} clinics → data/clinics.json`);
