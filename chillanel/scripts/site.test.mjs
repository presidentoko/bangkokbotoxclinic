import { test } from "node:test";
import assert from "node:assert/strict";
import { cityLabel } from "../lib/site.ts";

test("title-cases a single-word city slug", () => {
  assert.equal(cityLabel("bangkok"), "Bangkok");
});

test("title-cases every word of an underscore-joined multi-word city slug", () => {
  // Multi-word cities under spa_output/ use underscores, mirroring
  // watchdog.py's city_tag convention (e.g. "chiang_mai", "koh_samui").
  assert.equal(cityLabel("chiang_mai"), "Chiang Mai");
  assert.equal(cityLabel("koh_samui"), "Koh Samui");
  assert.equal(cityLabel("hua_hin"), "Hua Hin");
});

test("also handles hyphen-joined slugs", () => {
  assert.equal(cityLabel("chiang-mai"), "Chiang Mai");
});
