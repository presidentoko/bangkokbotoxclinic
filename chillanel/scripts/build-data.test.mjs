import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = import.meta.dirname;
// Writes into os.tmpdir(), not the live data/ dir: build-all-cities.mjs's
// places-index.json/search-index.json generation globs every
// data/clinics.*.json it finds, so a fixture file left behind here by a
// crashed test run (before its cleanup unlinkSync calls below) used to
// risk leaking fixture rows into the real production indexes on the next
// build.
const OUT_FILE = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "chillanel-build-data-")), "clinics.__fixture_test.json");

test("build-data pipeline: fixture CSV -> JSON with therapist mention", () => {
  execFileSync(
    process.execPath,
    [
      path.join(ROOT, "build-data.mjs"),
      "--clinics-csv", path.join(ROOT, "__fixtures__", "clinics.csv"),
      "--reviews-dir", path.join(ROOT, "__fixtures__", "reviews"),
      "--city", "__fixture_test",
      "--out", OUT_FILE,
    ],
    { stdio: "pipe" }
  );

  assert.ok(fs.existsSync(OUT_FILE), "output JSON was not written");
  const data = JSON.parse(fs.readFileSync(OUT_FILE, "utf-8"));
  assert.equal(data.places.length, 1);
  const place = data.places[0];
  assert.equal(place.name, "Test Spa Bangkok");
  assert.equal(place.reviews.length, 2);
  assert.equal(place.therapistMentions.length, 1);
  assert.equal(place.therapistMentions[0].name, "Nong");
  assert.equal(place.therapistMentions[0].count, 2);

  // The fixture's address is prefixed with the exact stray Private Use Area
  // codepoint (U+E0C8) found in 733/734 real scraped addresses -- an
  // icon-font glyph leaking from the scraped DOM text, invisible in the UI
  // but present when the raw string reaches structured data (JSON-LD). Must
  // be stripped, not just trimmed (it isn't whitespace).
  assert.equal(place.address, "123 Test Rd, Bangkok");
  assert.equal(place.address.codePointAt(0), "1".codePointAt(0));

  fs.unlinkSync(OUT_FILE);
});

test("build-data pipeline: wires theme/mood/rating/price/district extractors into output", () => {
  execFileSync(
    process.execPath,
    [
      path.join(ROOT, "build-data.mjs"),
      "--clinics-csv", path.join(ROOT, "__fixtures__", "clinics.csv"),
      "--reviews-dir", path.join(ROOT, "__fixtures__", "reviews"),
      // "bangkok", not an arbitrary fixture label, because the district
      // assertion below depends on nearestDistrict() clustering against
      // Bangkok's own centroid table (extract-district.mjs now has one
      // table per real city; an unrecognized city name returns
      // district=null instead of ever guessing).
      "--city", "bangkok",
      "--out", OUT_FILE,
    ],
    { stdio: "pipe" }
  );

  const data = JSON.parse(fs.readFileSync(OUT_FILE, "utf-8"));
  const place = data.places[0];

  // Fixture reviews ("Ask for Nong, she's amazing." x2) contain no theme/mood/
  // price keywords, so these should be present but empty — this test verifies
  // wiring (field exists, right shape), not extraction correctness (covered
  // by each extractor's own unit tests).
  assert.deepEqual(place.serviceThemes, []);
  assert.deepEqual(place.moodKeywords, []);
  assert.deepEqual(place.priceMentions, []);

  // Both fixture reviews are rating=5.
  assert.deepEqual(place.ratingDistribution, { 5: 2, 4: 0, 3: 0, 2: 0, 1: 0 });

  // Fixture coords (13.75, 100.53) are nearest "Siam & Pathumwan" (13.7466, 100.5347).
  assert.equal(place.district, "Siam & Pathumwan");

  // City-level aggregates must exist even when empty.
  assert.deepEqual(data.themeAggregate, []);
  assert.deepEqual(data.moodAggregate, []);

  fs.unlinkSync(OUT_FILE);
});

test("build-data pipeline: falls back to parsing lat/lng from maps_url when the CSV's own latitude/longitude columns are empty", () => {
  // Mirrors the real live dataset exactly: every scraped clinics.csv row has
  // empty latitude/longitude columns, but maps_url always carries the same
  // coordinates in a !3d!4d segment (see scripts/extract-coords.mjs).
  execFileSync(
    process.execPath,
    [
      path.join(ROOT, "build-data.mjs"),
      "--clinics-csv", path.join(ROOT, "__fixtures__", "clinics-no-csv-coords.csv"),
      "--reviews-dir", path.join(ROOT, "__fixtures__", "reviews"),
      // "bangkok" -- see the district-extractors test above for why.
      "--city", "bangkok",
      "--out", OUT_FILE,
    ],
    { stdio: "pipe" }
  );

  const data = JSON.parse(fs.readFileSync(OUT_FILE, "utf-8"));
  const place = data.places[0];

  assert.equal(place.lat, 13.7466);
  assert.equal(place.lng, 100.5347);
  // Same coordinates as the CSV-populated fixture test above, so this must
  // resolve to the same district: confirms the fallback feeds nearestDistrict
  // correctly, not just that lat/lng end up non-null.
  assert.equal(place.district, "Siam & Pathumwan");

  fs.unlinkSync(OUT_FILE);
});
