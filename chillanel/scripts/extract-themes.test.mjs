import { test } from "node:test";
import assert from "node:assert/strict";
import { extractThemeCounts, sumThemeCounts, SERVICE_THEMES, MOOD_KEYWORDS } from "./extract-themes.mjs";

test("counts a service theme once per review even if mentioned twice in the same review", () => {
  const reviews = [
    { text: "Great foot massage, the foot massage technique was excellent." },
    { text: "Loved the oil massage here." },
  ];
  const counts = extractThemeCounts(reviews, SERVICE_THEMES);
  const foot = counts.find((c) => c.label === "Foot massage");
  assert.equal(foot.count, 1);
});

test("counts multiple distinct themes across reviews, sorted by frequency desc", () => {
  const reviews = [
    { text: "Best foot massage in town." },
    { text: "The foot massage was so relaxing." },
    { text: "Really good oil massage." },
  ];
  const counts = extractThemeCounts(reviews, SERVICE_THEMES);
  assert.equal(counts[0].label, "Foot massage");
  assert.equal(counts[0].count, 2);
  assert.equal(counts.find((c) => c.label === "Oil massage").count, 1);
});

test("mood keywords match synonyms under the same label", () => {
  const reviews = [
    { text: "The room was spotless and hygienic." },
    { text: "Very clean overall." },
  ];
  const counts = extractThemeCounts(reviews, MOOD_KEYWORDS);
  assert.equal(counts.find((c) => c.label === "Clean").count, 2);
});

test("handles empty/whitespace/null review text without throwing", () => {
  const reviews = [{ text: "" }, { text: "   " }, { text: null }];
  assert.doesNotThrow(() => extractThemeCounts(reviews, SERVICE_THEMES));
  assert.equal(extractThemeCounts(reviews, SERVICE_THEMES).length, 0);
});

test("sumThemeCounts merges per-place counts into a city-wide total", () => {
  const perPlace = [
    [{ label: "Clean", count: 2 }, { label: "Friendly staff", count: 1 }],
    [{ label: "Clean", count: 3 }],
  ];
  const total = sumThemeCounts(perPlace);
  assert.equal(total.find((t) => t.label === "Clean").count, 5);
  assert.equal(total.find((t) => t.label === "Friendly staff").count, 1);
});
