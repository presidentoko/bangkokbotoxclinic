import { test } from "node:test";
import assert from "node:assert/strict";
import { themeLabel, slugifyTheme } from "../lib/theme-labels.ts";

test("translates a known service theme label into Thai and Korean", () => {
  assert.equal(themeLabel("Foot massage", "en"), "Foot massage");
  assert.equal(themeLabel("Foot massage", "th"), "นวดเท้า");
  assert.equal(themeLabel("Foot massage", "ko"), "발마사지");
});

test("translates a known mood keyword label into Thai and Korean", () => {
  assert.equal(themeLabel("Quiet & relaxing", "en"), "Quiet & relaxing");
  assert.equal(themeLabel("Quiet & relaxing", "th"), "เงียบสงบ ผ่อนคลาย");
  assert.equal(themeLabel("Quiet & relaxing", "ko"), "조용하고 편안함");
});

test("falls back to the raw label for an unrecognized string", () => {
  assert.equal(themeLabel("Something Unmapped", "th"), "Something Unmapped");
});

test("slugifyTheme produces a URL-safe slug, including for labels with '&'", () => {
  assert.equal(slugifyTheme("Foot massage"), "foot-massage");
  assert.equal(slugifyTheme("Quiet & relaxing"), "quiet-and-relaxing");
  assert.equal(slugifyTheme("Hot stone"), "hot-stone");
});

test("all 8 SERVICE_THEMES and 7 MOOD_KEYWORDS labels have th/ko translations (no silent fallback for real data)", () => {
  const allLabels = [
    "Foot massage", "Oil massage", "Thai massage", "Aromatherapy",
    "Deep tissue", "Hot stone", "Facial", "Body scrub",
    "Clean", "Quiet & relaxing", "Strong pressure", "Gentle",
    "Friendly staff", "Good value", "Walk-in friendly",
  ];
  for (const label of allLabels) {
    assert.notEqual(themeLabel(label, "th"), label, `"${label}" has no Thai translation`);
    assert.notEqual(themeLabel(label, "ko"), label, `"${label}" has no Korean translation`);
  }
});
