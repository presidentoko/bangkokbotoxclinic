import { test } from "node:test";
import assert from "node:assert/strict";
import { extractPriceMentions } from "./extract-price.mjs";

test("extracts a baht amount with symbol prefix", () => {
  const reviews = [{ text: "Paid ฿500 for a 1-hour massage, worth it." }];
  assert.deepEqual(extractPriceMentions(reviews), [500]);
});

test("extracts a baht amount with word suffix", () => {
  const reviews = [{ text: "Only 300 baht for foot massage, great value." }];
  assert.deepEqual(extractPriceMentions(reviews), [300]);
});

test("extracts multiple mentions across reviews, sorted ascending", () => {
  const reviews = [
    { text: "600 THB for oil massage." },
    { text: "Foot massage was 250 baht." },
  ];
  assert.deepEqual(extractPriceMentions(reviews), [250, 600]);
});

test("does not match a bare number with no currency marker", () => {
  const reviews = [{ text: "Called them 5 times, never picked up." }];
  assert.deepEqual(extractPriceMentions(reviews), []);
});

test("handles empty/null review text without throwing", () => {
  const reviews = [{ text: "" }, { text: null }];
  assert.doesNotThrow(() => extractPriceMentions(reviews));
  assert.deepEqual(extractPriceMentions(reviews), []);
});
