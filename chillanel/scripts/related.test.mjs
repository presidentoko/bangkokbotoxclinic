import { test } from "node:test";
import assert from "node:assert/strict";
import { relatedPlaces } from "../lib/related.ts";

function place(id, overrides = {}) {
  return {
    id,
    name: id,
    primaryType: "Massage spa",
    rating: null,
    reviewCount: 0,
    serviceThemes: [],
    ...overrides,
  };
}

test("returns places sharing the top theme, sorted by rating desc then reviewCount desc", () => {
  const target = place("target", { serviceThemes: [{ label: "Foot massage", count: 5 }] });
  const a = place("a", { serviceThemes: [{ label: "Foot massage", count: 1 }], rating: 4.2, reviewCount: 50 });
  const b = place("b", { serviceThemes: [{ label: "Foot massage", count: 1 }], rating: 4.8, reviewCount: 10 });
  const c = place("c", { serviceThemes: [{ label: "Oil massage", count: 9 }], rating: 5.0, reviewCount: 100 });
  const result = relatedPlaces(target, [target, a, b, c]);
  assert.deepEqual(result.map((p) => p.id), ["b", "a"]);
});

test("excludes the place itself even when it matches its own theme", () => {
  const target = place("target", { serviceThemes: [{ label: "Foot massage", count: 5 }] });
  const result = relatedPlaces(target, [target]);
  assert.deepEqual(result, []);
});

test("falls back to matching primaryType when the place has no serviceThemes", () => {
  const target = place("target", { primaryType: "Spa" });
  const same = place("same", { primaryType: "Spa", rating: 4.5, reviewCount: 20 });
  const different = place("different", { primaryType: "Nail salon", rating: 5.0, reviewCount: 999 });
  const result = relatedPlaces(target, [target, same, different]);
  assert.deepEqual(result.map((p) => p.id), ["same"]);
});

test("respects the max limit", () => {
  const target = place("target", { serviceThemes: [{ label: "Foot massage", count: 5 }] });
  const others = Array.from({ length: 5 }, (_, i) =>
    place(`p${i}`, { serviceThemes: [{ label: "Foot massage", count: 1 }], rating: 4, reviewCount: i })
  );
  const result = relatedPlaces(target, [target, ...others], 2);
  assert.equal(result.length, 2);
});

test("returns an empty array when nothing matches", () => {
  const target = place("target", { serviceThemes: [{ label: "Foot massage", count: 5 }] });
  const other = place("other", { serviceThemes: [{ label: "Oil massage", count: 1 }], primaryType: "Nail salon" });
  assert.deepEqual(relatedPlaces(target, [target, other]), []);
});

test("handles an empty allInCity array without throwing", () => {
  const target = place("target");
  assert.deepEqual(relatedPlaces(target, []), []);
});
