import { test } from "node:test";
import assert from "node:assert/strict";
import { nearestDistrict } from "./extract-district.mjs";

test("assigns a coordinate at a known Bangkok centroid to that district", () => {
  assert.equal(nearestDistrict(13.7248, 100.5296, "bangkok"), "Silom & Sathorn");
});

test("assigns a different Bangkok coordinate to its own nearest district", () => {
  assert.equal(nearestDistrict(13.7398, 100.5645, "bangkok"), "Sukhumvit");
});

test("returns null when either coordinate is missing", () => {
  assert.equal(nearestDistrict(null, 100.53, "bangkok"), null);
  assert.equal(nearestDistrict(13.72, null, "bangkok"), null);
});

test("returns null for coordinates far outside greater Bangkok", () => {
  assert.equal(nearestDistrict(14.5, 101.5, "bangkok"), null);
});

test("assigns a Pattaya coordinate to its own nearest area, not a Bangkok one", () => {
  assert.equal(nearestDistrict(12.9351, 100.8871, "pattaya"), "Central Pattaya");
});

test("assigns a Phuket coordinate to its own nearest area", () => {
  assert.equal(nearestDistrict(7.8965, 98.2966, "phuket"), "Patong");
});

test("a Pattaya coordinate against the Bangkok table (city mismatch) never falls back to a Bangkok district", () => {
  // Regression: before per-city tables, every Pattaya/Phuket place matched
  // against Bangkok's centroids -- always >100km away, so it silently
  // always resolved to null instead of ever pointing at a real nearby area.
  assert.equal(nearestDistrict(12.9351, 100.8871, "bangkok"), null);
});

test("returns null for an unknown city with no district table", () => {
  assert.equal(nearestDistrict(13.7248, 100.5296, "chiang_mai"), null);
});
