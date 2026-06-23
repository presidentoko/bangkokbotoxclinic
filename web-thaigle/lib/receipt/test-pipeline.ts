#!/usr/bin/env tsx
// Receipt Generation Pipeline — CLI Test Script
// Usage: npx tsx lib/receipt/test-pipeline.ts
//
// If ANTHROPIC_API_KEY is not set, the live API call is skipped.
// Guardrail tests run without an API key by directly calling validateReceipt.

import { validateReceipt } from "./guardrails";
import { generateReceipt } from "./generate";
import type { ReviewInput, ReceiptOutput } from "./types";

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const BRAVE_ROASTERS: ReviewInput = {
  placeName: "Brave Roasters",
  category: "eat",
  subtype: "cafe",
  reviews: [
    { id: 1,  source: "google",         rating: 5, text: "Best flat white in Bangkok, ฿120 and worth every baht.", daysAgo: 10 },
    { id: 2,  source: "google",         rating: 4, text: "Great vibes, a bit crowded on weekends.", daysAgo: 20 },
    { id: 3,  source: "field",          rating: 5, text: "Locals' secret. Staff amazing.", daysAgo: 5 },
    { id: 4,  source: "line",           rating: 4, text: "ลาเต้อร่อยมาก ราคาย่อมเยา", daysAgo: 30 },
    { id: 5,  source: "tiktok_comment", rating: 3, text: "Good but slow during rush hour", daysAgo: 45 },
    { id: 6,  source: "google",         rating: 5, text: "My go-to every Monday morning.", daysAgo: 15 },
    { id: 7,  source: "google",         rating: 4, text: "Pastries are fresh and delicious.", daysAgo: 60 },
    { id: 8,  source: "field",          rating: 5, text: "Always packed with regulars — good sign!", daysAgo: 3, sponsoredSignal: true },
    { id: 9,  source: "google",         rating: 3, text: "Coffee was fine, nothing special.", daysAgo: 90 },
    { id: 10, source: "line",           rating: 5, text: "ราคา ฿120 ดื่มแล้วอยากกลับมา", daysAgo: 12, sponsoredSignal: true },
    { id: 11, source: "other",          rating: 4, text: "Solid specialty coffee shop.", daysAgo: 75 },
  ],
};

// ---------------------------------------------------------------------------
// Guardrail-only test fixtures (no API call needed)
// ---------------------------------------------------------------------------

/** Fake output that references a reviewId (999) not in any input */
const HALLUCINATED_EVIDENCE_OUTPUT: ReceiptOutput = {
  localsScore: 8.5,
  status: "ok",
  scoring: { kept: 9, excludedSponsored: 2, weightedMean5: 4.3, variance: 0.5 },
  feed_says: { th: "กาแฟดี", en: "Great coffee", ko: "좋은 커피" },
  data_says: { th: "ราคา ฿120 บาท", en: "Priced at ฿120", ko: "가격은 ฿120" },
  evidence: [{ claim: "฿120", reviewIds: [999] }], // id 999 does not exist
  faq: [],
};

/** Fake output where feed_says contains a @handle */
const HANDLE_IN_FEED_OUTPUT: ReceiptOutput = {
  localsScore: 7.0,
  status: "ok",
  scoring: { kept: 9, excludedSponsored: 2, weightedMean5: 4.0, variance: 0.4 },
  feed_says: { th: "แวะมาได้เลย @bravecafe", en: "Visit @bravecafe today", ko: "@bravecafe 방문하세요" },
  data_says: { th: "ดี", en: "Good", ko: "좋아요" },
  evidence: [],
  faq: [],
};

/** Fake output with ฿140 in data_says but no matching evidence */
const NUMERIC_NO_EVIDENCE_OUTPUT: ReceiptOutput = {
  localsScore: 7.5,
  status: "ok",
  scoring: { kept: 9, excludedSponsored: 2, weightedMean5: 4.1, variance: 0.3 },
  feed_says: { th: "อร่อยมาก", en: "Really delicious", ko: "매우 맛있어요" },
  data_says: { th: "ราคา ฿140 ต่อจาน", en: "฿140 per plate", ko: "접시당 ฿140" },
  evidence: [], // empty — no evidence for ฿140
  faq: [],
};

// A minimal valid input for the guardrail-only fixtures
const MINIMAL_INPUT: ReviewInput = {
  placeName: "Brave Roasters",
  category: "eat",
  subtype: "cafe",
  reviews: BRAVE_ROASTERS.reviews.slice(0, 5), // ids 1–5 only
};

// ---------------------------------------------------------------------------
// Test runner
// ---------------------------------------------------------------------------

type TestResult = { name: string; passed: boolean; detail: string };

function assert(name: string, condition: boolean, detail: string): TestResult {
  const passed = condition;
  const icon = passed ? "PASS" : "FAIL";
  console.log(`  [${icon}] ${name}: ${detail}`);
  return { name, passed, detail };
}

async function runGuardrailTests(): Promise<TestResult[]> {
  console.log("\n== Guardrail Tests (no API key required) ==");
  const results: TestResult[] = [];

  // Test: hallucinated reviewId should FAIL
  {
    const r = validateReceipt(HALLUCINATED_EVIDENCE_OUTPUT, MINIMAL_INPUT);
    results.push(
      assert(
        "HALLUCINATED_EVIDENCE",
        !r.ok,
        r.ok ? "Expected FAIL but got ok=true" : `Correctly rejected: ${(r as { ok: false; reason: string }).reason}`
      )
    );
  }

  // Test: @handle in feed_says should FAIL
  {
    const r = validateReceipt(HANDLE_IN_FEED_OUTPUT, MINIMAL_INPUT);
    results.push(
      assert(
        "HANDLE_IN_FEED",
        !r.ok,
        r.ok ? "Expected FAIL but got ok=true" : `Correctly rejected: ${(r as { ok: false; reason: string }).reason}`
      )
    );
  }

  // Test: numeric claim without evidence should FAIL
  {
    const r = validateReceipt(NUMERIC_NO_EVIDENCE_OUTPUT, MINIMAL_INPUT);
    results.push(
      assert(
        "NUMERIC_NO_EVIDENCE",
        !r.ok,
        r.ok ? "Expected FAIL but got ok=true" : `Correctly rejected: ${(r as { ok: false; reason: string }).reason}`
      )
    );
  }

  return results;
}

async function runLiveApiTest(): Promise<TestResult[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.log("\n== Live API Test ==");
    console.log("  [SKIP] ANTHROPIC_API_KEY not set — skipping live call.");
    return [];
  }

  console.log("\n== Live API Test (BRAVE_ROASTERS) ==");
  const results: TestResult[] = [];

  console.log("  Calling Claude API…");
  const result = await generateReceipt(BRAVE_ROASTERS, apiKey);

  results.push(
    assert(
      "BRAVE_ROASTERS status",
      result.status === "ok" || result.status === "needs_review",
      `status=${result.status}`
    )
  );

  if (result.output) {
    results.push(
      assert(
        "localsScore in range",
        result.output.localsScore >= 0 && result.output.localsScore <= 10,
        `localsScore=${result.output.localsScore}`
      )
    );
    results.push(
      assert(
        "feed_says has all langs",
        Boolean(result.output.feed_says.th && result.output.feed_says.en && result.output.feed_says.ko),
        `th="${result.output.feed_says.th.slice(0, 40)}…"`
      )
    );
    results.push(
      assert(
        "data_says has all langs",
        Boolean(result.output.data_says.th && result.output.data_says.en && result.output.data_says.ko),
        `en="${result.output.data_says.en.slice(0, 60)}…"`
      )
    );
    console.log("\n  Full output:");
    console.log(JSON.stringify(result.output, null, 2));
  } else {
    results.push(
      assert("API returned output", false, `error: ${result.error}`)
    );
  }

  return results;
}

async function main() {
  console.log("Receipt Pipeline Test\n" + "=".repeat(40));

  const allResults: TestResult[] = [];

  allResults.push(...(await runGuardrailTests()));
  allResults.push(...(await runLiveApiTest()));

  // Summary
  const passed = allResults.filter((r) => r.passed).length;
  const failed = allResults.filter((r) => !r.passed).length;
  const skipped = allResults.length === 0 ? "0 tests" : "";

  console.log("\n" + "=".repeat(40));
  console.log(`Results: ${passed} passed, ${failed} failed${skipped}`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
