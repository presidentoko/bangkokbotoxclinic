import { test } from "node:test";
import assert from "node:assert/strict";
import { localReading } from "../lib/local-reading.ts";

const DIST = { 1: 0, 2: 0, 3: 1, 4: 4, 5: 45 };

function place(id, lat, lng, rating, reviewCount, overrides = {}) {
  return {
    id,
    name: id,
    primaryType: "Massage spa",
    lat,
    lng,
    rating,
    reviewCount,
    ratingDistribution: { ...DIST },
    ...overrides,
  };
}

// 서로 멀리 떨어진 도시 배경 25곳 (반경 1km 밖). 평점 4.0~4.6.
function backdrop() {
  return Array.from({ length: 25 }, (_, i) => place(`bg${i}`, 20 + i * 0.5, 100, 4 + (i % 7) / 10, 100 + i));
}

test("returns null when the place has no coordinates or rating", () => {
  const all = backdrop();
  assert.equal(localReading(place("x", null, null, 4.5, 80), all, "Bangkok", "en"), null);
  assert.equal(localReading(place("y", 1, 1, null, 80), all, "Bangkok", "en"), null);
});

test("returns null when the city has too few comparable places", () => {
  const me = place("me", 1, 1, 4.5, 80);
  assert.equal(localReading(me, [me, place("a", 1, 1.001, 4.4, 90)], "Bangkok", "en"), null);
});

test("ranks within 1 km and links the nearest higher-rated rival", () => {
  const me = place("me", 13, 100, 4.2, 80);
  const near = [
    place("n1", 13.001, 100, 4.9, 200),
    place("n2", 13.004, 100, 4.6, 150),
    place("n3", 13.002, 100, 4.0, 90),
  ];
  const r = localReading(me, [...backdrop(), me, ...near], "Bangkok", "en");
  assert.ok(r);
  assert.match(r.sentences.join(" "), /ranks #3 of 4/);
  assert.equal(r.rival.id, "n1");
  assert.equal(r.rival.rating, 4.9);
});

test("says highest rated when nothing nearby beats it, and offers no rival", () => {
  const me = place("me", 13, 100, 4.9, 300);
  const near = [
    place("n1", 13.001, 100, 4.2, 200),
    place("n2", 13.004, 100, 4.1, 150),
    place("n3", 13.002, 100, 4.0, 90),
  ];
  const r = localReading(me, [...backdrop(), me, ...near], "Bangkok", "en");
  assert.ok(r);
  assert.match(r.sentences.join(" "), /highest rated/);
  assert.equal(r.rival, null);
});

test("flags a polarised rating shape against the city median", () => {
  const me = place("me", 40, 100, 4.1, 80, { ratingDistribution: { 1: 12, 2: 6, 3: 4, 4: 8, 5: 20 } });
  const r = localReading(me, [...backdrop(), me], "Bangkok", "en");
  assert.ok(r);
  assert.match(r.sentences.join(" "), /Opinions split/);
});

test("writes the sentences in the requested language", () => {
  const me = place("me", 13, 100, 4.9, 300);
  const near = [place("n1", 13.001, 100, 4.2, 200), place("n2", 13.004, 100, 4.1, 150), place("n3", 13.002, 100, 4.0, 90)];
  const all = [...backdrop(), me, ...near];
  assert.match(localReading(me, all, "방콕", "ko").sentences.join(" "), /반경 1km/);
  assert.match(localReading(me, all, "กรุงเทพฯ", "th").sentences.join(" "), /ในรัศมี 1 กม\./);
});

test("uses at most three sentences", () => {
  const me = place("me", 13, 100, 4.9, 5000, { ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 2, 5: 98 } });
  const near = [place("n1", 13.001, 100, 4.2, 200), place("n2", 13.004, 100, 4.1, 150), place("n3", 13.002, 100, 4.0, 90)];
  const r = localReading(me, [...backdrop(), me, ...near], "Bangkok", "en");
  assert.ok(r.sentences.length <= 3);
});
