// Directly imports the .ts source (see theme-labels.test.mjs's header comment
// for the Node-version caveat around native TS type-stripping).
import { test } from "node:test";
import assert from "node:assert/strict";
import { priceMedian, placeSummary } from "../lib/summary.ts";

function place(overrides = {}) {
  return {
    id: "p1",
    name: "Test Spa",
    serviceThemes: [],
    moodKeywords: [],
    priceMentions: [],
    ...overrides,
  };
}

test("priceMedian: empty array returns null", () => {
  assert.equal(priceMedian([]), null);
});

test("priceMedian: odd-length array returns the middle value", () => {
  assert.equal(priceMedian([300, 500, 400]), 400);
});

test("priceMedian: even-length array returns the average of the two middle values", () => {
  assert.equal(priceMedian([300, 400, 500, 600]), 450);
});

test("placeSummary: returns null when theme/mood/price are all empty", () => {
  assert.equal(placeSummary(place(), "en"), null);
});

test("placeSummary: combines theme and mood clauses in en, in that order", () => {
  const p = place({
    serviceThemes: [{ label: "Foot massage", count: 5 }],
    moodKeywords: [{ label: "Quiet & relaxing", count: 3 }],
    priceMentions: [300, 400, 500],
  });
  const result = placeSummary(p, "en");
  assert.equal(result, "Reviewers most often mention Foot massage here. Regulars describe the place as Quiet & relaxing.");
});

test("placeSummary: ignores priceMentions entirely (price already shown separately in the address card)", () => {
  const p = place({ priceMentions: [300, 400, 500] });
  assert.equal(placeSummary(p, "en"), null);
});

test("placeSummary: omits the mood clause when moodKeywords is empty", () => {
  const p = place({ serviceThemes: [{ label: "Oil massage", count: 2 }] });
  assert.equal(placeSummary(p, "en"), "Reviewers most often mention Oil massage here.");
});

test("placeSummary: translates the theme clause into Thai and Korean", () => {
  const p = place({ serviceThemes: [{ label: "Foot massage", count: 5 }] });
  assert.equal(placeSummary(p, "th"), "รีวิวพูดถึงนวดเท้าที่นี่บ่อยที่สุด");
  assert.equal(placeSummary(p, "ko"), "리뷰에서 이곳의 발마사지가 가장 많이 언급됩니다.");
});

test("placeSummary: uses only the top (index 0) theme and mood, ignoring the rest", () => {
  const p = place({
    serviceThemes: [
      { label: "Foot massage", count: 5 },
      { label: "Oil massage", count: 1 },
    ],
  });
  assert.equal(placeSummary(p, "en"), "Reviewers most often mention Foot massage here.");
});
