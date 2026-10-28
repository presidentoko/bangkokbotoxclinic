import { test } from "node:test";
import assert from "node:assert/strict";
import { areaProfile, formatAreaMetric } from "../lib/area-stats.ts";

function place(id, over = {}) {
  return {
    id,
    rating: 4.6,
    reviewCount: 100,
    priceMentions: [500],
    insights: {
      analysed: 40,
      withText: 40,
      aspects: { cleanliness: { pos: 10, neg: 0 }, value: { pos: 10, neg: 0 }, staff: { pos: 10, neg: 0 }, skill: { pos: 0, neg: 0 }, pressure: { pos: 0, neg: 0 }, english: { pos: 0, neg: 0 } },
      tipPressure: 0,
      languages: {},
    },
    ...over,
  };
}

const many = (n, f) => Array.from({ length: n }, (_, i) => place(`p${i}`, f?.(i)));

test("returns null when the area has fewer than 5 comparable places", () => {
  assert.equal(areaProfile(many(3), many(40), "Area", "City", "en"), null);
});

test("headline names the metric with the biggest gap (tip pressure here)", () => {
  const area = many(10, () => ({ insights: { ...place("x").insights, tipPressure: 3 } }));
  const base = [...area, ...many(60)];
  const r = areaProfile(area, base, "Silom", "Bangkok", "en");
  assert.ok(r);
  assert.match(r.headline, /100% of places in Silom have reviewers reporting tip pressure, against 14% across Bangkok/);
});

test("no headline when the area looks like the baseline", () => {
  const all = many(60);
  const r = areaProfile(all.slice(0, 20), all, "Area", "City", "en");
  assert.ok(r);
  assert.equal(r.headline, null);
});

test("skips places under 30 Google reviews", () => {
  const thin = many(10, () => ({ reviewCount: 5 }));
  assert.equal(areaProfile(thin, many(40), "Area", "City", "en"), null);
});

test("formats metrics", () => {
  assert.equal(formatAreaMetric("rating", 4.56), "4.6");
  assert.equal(formatAreaMetric("price", 1200), "1,200");
  assert.equal(formatAreaMetric("tip", 12.4), "12%");
});
