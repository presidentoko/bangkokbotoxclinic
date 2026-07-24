import { test } from "node:test";
import assert from "node:assert/strict";
import { extractMentionsFromReviews } from "./extract-therapists.mjs";

test("extracts a name mentioned in 2+ reviews via 'ask for X' pattern", () => {
  const reviews = [
    { text: "Great place, ask for Nong, she's amazing." },
    { text: "Ask for Nong next time, best massage I've had." },
    { text: "Clean and relaxing overall." },
  ];
  const mentions = extractMentionsFromReviews(reviews);
  assert.equal(mentions.length, 1);
  assert.equal(mentions[0].name, "Nong");
  assert.equal(mentions[0].count, 2);
  assert.equal(mentions[0].quotes.length, 2);
});

test("drops a name mentioned in only 1 review (false-positive suppression)", () => {
  const reviews = [
    { text: "Ask for Somchai, he was great." },
    { text: "Nice quiet place, good pricing." },
  ];
  const mentions = extractMentionsFromReviews(reviews);
  assert.equal(mentions.length, 0);
});

test("extracts '[Name] was amazing' pattern", () => {
  const reviews = [
    { text: "Malee was amazing, best massage in Bangkok." },
    { text: "Went back on my second trip and Malee was amazing again." },
  ];
  const mentions = extractMentionsFromReviews(reviews);
  assert.equal(mentions.length, 1);
  assert.equal(mentions[0].name, "Malee");
});

test("ignores sentence-initial stopwords that look like names", () => {
  const reviews = [
    { text: "This was amazing, will come back." },
    { text: "This was amazing service overall." },
    { text: "Best massage ever, highly recommend." },
    { text: "Best place in town, highly recommend it." },
  ];
  const mentions = extractMentionsFromReviews(reviews);
  assert.equal(mentions.length, 0, `expected no false-positive names, got: ${JSON.stringify(mentions)}`);
});

test("deduplicates same name across different patterns and merges counts", () => {
  const reviews = [
    { text: "Ask for Ploy, she's the best." },
    { text: "Ploy was amazing, super strong hands." },
    { text: "Thanks to Ploy for a great session." },
  ];
  const mentions = extractMentionsFromReviews(reviews);
  assert.equal(mentions.length, 1);
  assert.equal(mentions[0].name, "Ploy");
  assert.equal(mentions[0].count, 3);
});

test("handles empty/whitespace-only review text without throwing", () => {
  const reviews = [{ text: "" }, { text: "   " }, { text: null }];
  assert.doesNotThrow(() => extractMentionsFromReviews(reviews));
  assert.equal(extractMentionsFromReviews(reviews).length, 0);
});
