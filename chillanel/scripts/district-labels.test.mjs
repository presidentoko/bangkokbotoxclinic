import { test } from "node:test";
import assert from "node:assert/strict";
import { districtLabel, slugifyDistrict, allDistricts } from "../lib/district-labels.ts";

function place(district) {
  return { district };
}

test("translates a known district into Thai and Korean", () => {
  assert.equal(districtLabel("Sukhumvit", "en"), "Sukhumvit");
  assert.equal(districtLabel("Sukhumvit", "th"), "สุขุมวิท");
  assert.equal(districtLabel("Sukhumvit", "ko"), "수쿰빗");
});

test("falls back to the raw name for an unrecognized district", () => {
  assert.equal(districtLabel("Somewhere Else", "th"), "Somewhere Else");
});

test("slugifyDistrict handles '&' and produces a URL-safe slug", () => {
  assert.equal(slugifyDistrict("Silom & Sathorn"), "silom-and-sathorn");
  assert.equal(slugifyDistrict("Sukhumvit"), "sukhumvit");
  assert.equal(slugifyDistrict("Khao San & Old Town"), "khao-san-and-old-town");
});

test("all 8 districts from extract-district.mjs have th/ko translations (no silent fallback for real data)", () => {
  const allDistricts = [
    "Sukhumvit",
    "Silom & Sathorn",
    "Siam & Pathumwan",
    "Thonglor & Ekkamai",
    "Khao San & Old Town",
    "Chinatown",
    "Chatuchak",
    "Ari",
  ];
  for (const d of allDistricts) {
    assert.notEqual(districtLabel(d, "th"), d, `"${d}" has no Thai translation`);
    assert.notEqual(districtLabel(d, "ko"), d, `"${d}" has no Korean translation`);
  }
});

test("allDistricts: returns distinct non-null districts across places", () => {
  const places = [place("Sukhumvit"), place("Sukhumvit"), place("Ari"), place(null)];
  const result = allDistricts(places);
  assert.deepEqual(new Set(result), new Set(["Sukhumvit", "Ari"]));
  assert.equal(result.length, 2);
});

test("allDistricts: returns an empty array when no place has a district", () => {
  assert.deepEqual(allDistricts([place(null), place(null)]), []);
});
