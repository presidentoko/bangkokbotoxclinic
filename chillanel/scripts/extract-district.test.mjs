import { test } from "node:test";
import assert from "node:assert/strict";
import { nearestDistrict } from "./extract-district.mjs";

test("assigns a coordinate at a known centroid to that district", () => {
  assert.equal(nearestDistrict(13.7248, 100.5296), "Silom & Sathorn");
});

test("assigns a different coordinate to its own nearest district", () => {
  assert.equal(nearestDistrict(13.7398, 100.5645), "Sukhumvit");
});

test("returns null when either coordinate is missing", () => {
  assert.equal(nearestDistrict(null, 100.53), null);
  assert.equal(nearestDistrict(13.72, null), null);
});

test("returns null for coordinates far outside greater Bangkok", () => {
  assert.equal(nearestDistrict(14.5, 101.5), null);
});
