import { test } from "node:test";
import assert from "node:assert/strict";
import { placeMatchesLabel, averageRating, allThemeAndMoodLabels, isMoodLabel } from "../lib/theme-stats.ts";
import { SERVICE_THEMES, MOOD_KEYWORDS } from "./extract-themes.mjs";

function place(overrides = {}) {
  return {
    id: "p1",
    serviceThemes: [],
    moodKeywords: [],
    rating: null,
    ...overrides,
  };
}

test("placeMatchesLabel: true when the label is a service theme", () => {
  const p = place({ serviceThemes: [{ label: "Foot massage", count: 3 }] });
  assert.equal(placeMatchesLabel(p, "Foot massage"), true);
});

test("placeMatchesLabel: true when the label is a mood keyword", () => {
  const p = place({ moodKeywords: [{ label: "Quiet & relaxing", count: 2 }] });
  assert.equal(placeMatchesLabel(p, "Quiet & relaxing"), true);
});

test("placeMatchesLabel: false when the label matches neither array", () => {
  const p = place({ serviceThemes: [{ label: "Oil massage", count: 1 }] });
  assert.equal(placeMatchesLabel(p, "Foot massage"), false);
});

test("averageRating: computes the mean of non-null ratings, rounded to 1 decimal", () => {
  const places = [place({ rating: 4.2 }), place({ rating: 4.8 })];
  assert.equal(averageRating(places), 4.5);
});

test("averageRating: ignores places with a null rating", () => {
  const places = [place({ rating: 5.0 }), place({ rating: null }), place({ rating: 4.0 })];
  assert.equal(averageRating(places), 4.5);
});

test("averageRating: returns null when no place has a rating", () => {
  const places = [place({ rating: null }), place({ rating: null })];
  assert.equal(averageRating(places), null);
});

test("averageRating: returns null for an empty array", () => {
  assert.equal(averageRating([]), null);
});

test("allThemeAndMoodLabels: returns the union of every service-theme and mood-keyword label, deduplicated", () => {
  const places = [
    place({ serviceThemes: [{ label: "Foot massage", count: 3 }], moodKeywords: [{ label: "Clean", count: 1 }] }),
    place({ serviceThemes: [{ label: "Foot massage", count: 1 }], moodKeywords: [{ label: "Gentle", count: 2 }] }),
  ];
  const labels = allThemeAndMoodLabels(places);
  assert.deepEqual(new Set(labels), new Set(["Foot massage", "Clean", "Gentle"]));
  assert.equal(labels.length, 3);
});

test("allThemeAndMoodLabels: returns an empty array for no places", () => {
  assert.deepEqual(allThemeAndMoodLabels([]), []);
});

test("isMoodLabel: true for a mood keyword, false for a service theme", () => {
  assert.equal(isMoodLabel("Clean"), true);
  assert.equal(isMoodLabel("Foot massage"), false);
});

test("isMoodLabel: false for an unrecognized label", () => {
  assert.equal(isMoodLabel("Something Unmapped"), false);
});

test("regression: SERVICE_THEMES and MOOD_KEYWORDS (scripts/extract-themes.mjs) never share a label — placeMatchesLabel's OR of both arrays depends on this", () => {
  const serviceLabels = new Set(Object.keys(SERVICE_THEMES));
  const moodLabels = new Set(Object.keys(MOOD_KEYWORDS));
  const overlap = [...serviceLabels].filter((label) => moodLabels.has(label));
  assert.deepEqual(overlap, []);
});

test("isMoodLabel's hardcoded MOOD_LABELS set matches the real MOOD_KEYWORDS keys from extract-themes.mjs", () => {
  for (const label of Object.keys(MOOD_KEYWORDS)) {
    assert.equal(isMoodLabel(label), true, `"${label}" is a real mood keyword but isMoodLabel() doesn't recognize it`);
  }
  for (const label of Object.keys(SERVICE_THEMES)) {
    assert.equal(isMoodLabel(label), false, `"${label}" is a real service theme but isMoodLabel() incorrectly treats it as a mood`);
  }
});
