import { test } from "node:test";
import assert from "node:assert/strict";
import { trustScore } from "../lib/trust-score.ts";

function place(overrides = {}) {
  return {
    rating: null,
    reviewCount: 0,
    serviceThemes: [],
    moodKeywords: [],
    ...overrides,
  };
}

test("rating points: null rating scores 0", () => {
  const result = trustScore(place({ rating: null }));
  assert.equal(result.breakdown.ratingPoints, 0);
});

test("rating points: 5.0 scores the full 50", () => {
  const result = trustScore(place({ rating: 5 }));
  assert.equal(result.breakdown.ratingPoints, 50);
});

test("rating points: 4.3 scores 43 (linear, rating/5 * 50)", () => {
  const result = trustScore(place({ rating: 4.3 }));
  assert.equal(result.breakdown.ratingPoints, 43);
});

test("volume points: 0 reviews scores 0", () => {
  const result = trustScore(place({ reviewCount: 0 }));
  assert.equal(result.breakdown.volumePoints, 0);
});

test("volume points: exactly the 2000-review cap scores the full 35", () => {
  const result = trustScore(place({ reviewCount: 2000 }));
  assert.equal(result.breakdown.volumePoints, 35);
});

test("volume points: beyond the cap still scores 35, never more", () => {
  const result = trustScore(place({ reviewCount: 50000 }));
  assert.equal(result.breakdown.volumePoints, 35);
});

test("volume points: 107 reviews (log scale, not linear) scores 22", () => {
  const result = trustScore(place({ reviewCount: 107 }));
  assert.equal(result.breakdown.volumePoints, 22);
});

test("volume points: 5 reviews scores 8 — small counts still register meaningfully on the log scale", () => {
  const result = trustScore(place({ reviewCount: 5 }));
  assert.equal(result.breakdown.volumePoints, 8);
});

test("diversity points: counts distinct labels across serviceThemes and moodKeywords combined", () => {
  const result = trustScore(
    place({
      serviceThemes: [{ label: "Foot massage", count: 5 }, { label: "Oil massage", count: 2 }],
      moodKeywords: [{ label: "Clean", count: 3 }],
    })
  );
  assert.equal(result.breakdown.diversityPoints, 3);
});

test("diversity points: a label appearing in both arrays only counts once", () => {
  const result = trustScore(
    place({
      serviceThemes: [{ label: "Clean", count: 5 }],
      moodKeywords: [{ label: "Clean", count: 3 }],
    })
  );
  assert.equal(result.breakdown.diversityPoints, 1);
});

test("diversity points: capped at 15 even if more distinct labels were somehow present", () => {
  const manyThemes = Array.from({ length: 20 }, (_, i) => ({ label: `Label ${i}`, count: 1 }));
  const result = trustScore(place({ serviceThemes: manyThemes }));
  assert.equal(result.breakdown.diversityPoints, 15);
});

test("label bands: 85 and above is excellent", () => {
  assert.equal(trustScore(place({ rating: 5, reviewCount: 2000, serviceThemes: [{ label: "Foot massage", count: 1 }, { label: "Oil massage", count: 1 }, { label: "Thai massage", count: 1 }, { label: "Aromatherapy", count: 1 }, { label: "Deep tissue", count: 1 }] })).label, "excellent");
});

test("label bands: 70-84 is good, 50-69 is fair, below 50 is limited", () => {
  // rating 4.0 (40pts) + 0 reviews (0pts) + 3 diversity = 43 -> limited
  assert.equal(trustScore(place({ rating: 4.0, reviewCount: 0, serviceThemes: [{ label: "A", count: 1 }], moodKeywords: [{ label: "B", count: 1 }, { label: "C", count: 1 }] })).label, "limited");
  // rating 5.0 (50pts) + 107 reviews (22pts) + 0 diversity = 72 -> good
  assert.equal(trustScore(place({ rating: 5, reviewCount: 107 })).label, "good");
});

test("full integration: score equals the sum of the rounded breakdown components", () => {
  const p = place({
    rating: 4.3,
    reviewCount: 107,
    serviceThemes: [{ label: "Foot massage", count: 5 }],
    moodKeywords: [{ label: "Clean", count: 3 }, { label: "Quiet & relaxing", count: 2 }],
  });
  const result = trustScore(p);
  assert.equal(result.breakdown.ratingPoints, 43);
  assert.equal(result.breakdown.volumePoints, 22);
  assert.equal(result.breakdown.diversityPoints, 3);
  assert.equal(result.score, 43 + 22 + 3);
  assert.equal(result.label, "good");
});
