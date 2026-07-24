import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = import.meta.dirname;
const OUT_FILE = path.join(ROOT, "..", "data", "clinics.__fixture_test.json");

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

  fs.unlinkSync(OUT_FILE);
});

test("build-data pipeline: wires theme/mood/rating/price/district extractors into output", () => {
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
