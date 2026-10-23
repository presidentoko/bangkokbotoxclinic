import { test } from "node:test";
import assert from "node:assert/strict";
import {
  aspectCounts, tipPressureCount, ratingTrend, relativeToMonths, reviewerProfile,
  languageCounts, spentMidpoint, placeInsights,
} from "./extract-insights.mjs";

test("negative wins over positive in the same review, once per side", () => {
  const a = aspectCounts([
    { text: "The room was not clean, quite dirty actually." },
    { text: "Very clean and spotless room, clean towels." },
  ]);
  assert.deepEqual(a.cleanliness, { pos: 1, neg: 1 });
});

test("negated positive is not counted", () => {
  const a = aspectCounts([{ text: "Staff were not very friendly." }, { text: "Kind of slow but ok." }]);
  assert.equal(a.staff.pos, 0);
});

test("english aspect reads both directions", () => {
  const a = aspectCounts([
    { text: "She spoke good English and asked about the pressure." },
    { text: "Little English but the massage was great." },
    { text: "They don't speak English at all." },
  ]);
  assert.deepEqual(a.english, { pos: 1, neg: 2 });
  assert.equal(a.pressure.pos, 1);
});

test("tip pressure counts reports", () => {
  assert.equal(tipPressureCount([
    { text: "After the massage she asked for a tip twice." },
    { text: "I left a tip because it was great." },
    { text: "Tips are expected and they pressure you." },
  ]), 2);
});

test("relative dates incl. edited prefix", () => {
  assert.equal(relativeToMonths("Edited a year ago"), 12);
  assert.equal(relativeToMonths("3 weeks ago"), 1);
  assert.equal(relativeToMonths(""), null);
});

test("trend needs 8+ reviews in both windows", () => {
  const mk = (n, rating, rel) => Array.from({ length: n }, () => ({ rating, relativeDate: rel }));
  assert.equal(ratingTrend([...mk(7, 5, "a month ago"), ...mk(10, 3, "2 years ago")]), null);
  const t = ratingTrend([...mk(8, 5, "a month ago"), ...mk(10, 3, "2 years ago"), ...mk(5, 1, "5 years ago")]);
  assert.deepEqual(t, { recentAvg: 5, recentN: 8, beforeAvg: 3, beforeN: 10 });
});

test("reviewer profile", () => {
  const rs = [1, 2, 3, 4, 5].map((n, i) => ({ isLocalGuide: i < 2, authorReviewCount: n * 10 }));
  assert.deepEqual(reviewerProfile(rs), { localGuidePct: 40, medianAuthorReviews: 30 });
  assert.equal(reviewerProfile(rs.slice(0, 4)), null);
});

test("languages by script", () => {
  assert.deepEqual(languageCounts([{ text: "마사지 최고" }, { text: "很好" }, { text: "ดีมาก" }, { text: "great" }]),
    { ko: 1, zh: 1, th: 1 });
});

test("spent midpoints", () => {
  assert.equal(spentMidpoint("฿200–400"), 300);
  assert.equal(spentMidpoint("฿1,000–1,500"), 1250);
  assert.equal(spentMidpoint("฿2,000+"), 2000);
  assert.equal(spentMidpoint(""), null);
});

test("placeInsights never returns review text", () => {
  const out = placeInsights([{ text: "Very clean, friendly staff", rating: 5, relativeDate: "a month ago", spent: "฿200–400" }]);
  assert.ok(!JSON.stringify(out).includes("friendly staff"));
  assert.deepEqual(out.spent, [300]);
});

test("negated complaints are not complaints", () => {
  const a = aspectCounts([{ text: "The price wasn't too expensive either." }, { text: "Room was not dirty at all." }]);
  assert.equal(a.value.neg, 0);
  assert.equal(a.cleanliness.neg, 0);
});

test("'don't know English' beats a later 'can speak English'", () => {
  const a = aspectCounts([{ text: "Staff don't know english, no one that can speak english." }]);
  assert.deepEqual(a.english, { pos: 0, neg: 1 });
});

test("korean reviews count too, 불친절 is not 친절", () => {
  const a = aspectCounts([
    { text: "직원분들 너무 친절하고 깨끗해요. 가성비 최고" },
    { text: "불친절하고 방이 지저분했어요" },
    { text: "압 조절도 잘해주시고 시원했어요" },
  ]);
  assert.deepEqual(a.staff, { pos: 1, neg: 1 });
  assert.deepEqual(a.cleanliness, { pos: 1, neg: 1 });
  assert.equal(a.value.pos, 1);
  assert.equal(a.pressure.pos, 1);
  assert.equal(tipPressureCount([{ text: "끝나고 팁을 계속 요구해서 불쾌" }]), 1);
});

test("korean negation flips both ways", () => {
  const a = aspectCounts([
    { text: "가격도 그리 비싸지 않았는데 만족" },
    { text: "좋은 냄새가 나고 청결합니다" },
    { text: "너무 아프지도 않고 좋아요" },
    { text: "안시원해요" },
  ]);
  assert.equal(a.value.neg, 0);
  assert.deepEqual(a.cleanliness, { pos: 1, neg: 0 });
  assert.equal(a.pressure.neg, 0);
  assert.equal(a.skill.pos, 0);
  assert.equal(tipPressureCount([{ text: "마사지 후에 팁을 요구하지 않습니다" }]), 0);
});
