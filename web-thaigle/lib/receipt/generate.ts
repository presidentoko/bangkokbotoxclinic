// Receipt Generation Pipeline — Main Claude API Logic
// Produces localsScore, feed_says, data_says from raw reviews

import Anthropic from "@anthropic-ai/sdk";
import { createHash } from "crypto";
import type {
  ReviewInput,
  ReceiptOutput,
  ReceiptResult,
} from "./types";
import { validateReceipt } from "./guardrails";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 1500;
const CONCURRENCY = 5;
const MAX_ATTEMPTS = 3;

/** Source trust weights for Bayesian scoring */
const SOURCE_WEIGHT: Record<string, number> = {
  field: 1.0,
  google: 0.8,
  line: 0.7,
  other: 0.6,
  tiktok_comment: 0.5,
};

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are a Bangkok local-intelligence engine for thaigle.com.
Your job is to read raw place reviews and produce a structured Receipt JSON.

## Scoring formula (localsScore)
1. Exclude reviews flagged sponsoredSignal=true.
2. For each remaining review with a numeric rating (1–5):
   - weight = SOURCE_WEIGHT[source] × exp(-daysAgo / 180)   (recency decay, half-life ≈ 180 days)
3. weighted_mean = Σ(rating × weight) / Σ(weight)           (on 5-point scale)
4. variance = weighted variance of ratings
5. Bayesian adjustment (m=8, prior=3.0):
   adjusted = (n × weighted_mean + 8 × 3.0) / (n + 8)     where n = Σ(weight)
6. Variance penalty: final_5 = adjusted - 0.15 × sqrt(variance)
7. localsScore = round(final_5 × 2, 1)                      (rescale to 10-point, 1 decimal)
   Clamp to [0.0, 10.0].

Source weights: field=1.0, google=0.8, line=0.7, other=0.6, tiktok_comment=0.5

## Non-negotiable rules
- feed_says: EXACTLY 1 sentence per language. NO @handles, NO URLs, NO #hashtags.
- data_says: 2–3 sentences per language. Every numeric claim (฿, baht, times) MUST appear in the evidence array.
- evidence[].reviewIds: MUST reference real review ids from the input. Never fabricate ids.
- Translate to Thai (th), English (en), and Korean (ko) for every I18nText field.
- If fewer than 3 non-sponsored reviews with ratings exist, set status="insufficient" and still attempt scoring with what is available.

## Output format
Respond with ONLY valid JSON. No markdown fences, no explanation.
Schema:
{
  "localsScore": number,          // 0.0–10.0
  "status": "ok"|"insufficient"|"needs_review",
  "scoring": {
    "kept": number,
    "excludedSponsored": number,
    "weightedMean5": number,
    "variance": number
  },
  "feed_says": { "th": "...", "en": "...", "ko": "..." },
  "data_says": { "th": "...", "en": "...", "ko": "..." },
  "evidence": [{ "claim": "...", "reviewIds": [number] }],
  "faq": [{ "q": { "th":"","en":"","ko":"" }, "a": { "th":"","en":"","ko":"" } }]
}`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** SHA-256 fingerprint of the serialized input (for caching / dedup) */
export function hashInput(input: ReviewInput): string {
  const serialized = JSON.stringify(input, Object.keys(input).sort());
  return createHash("sha256").update(serialized).digest("hex");
}

/**
 * Review sampling: if >200 reviews, keep all from the last 90 days and
 * downsample older ones to 100 (uniformly).
 */
function sampleReviews(input: ReviewInput): ReviewInput {
  const reviews = input.reviews;
  if (reviews.length <= 200) return input;

  const recent = reviews.filter((r) => r.daysAgo <= 90);
  const older = reviews.filter((r) => r.daysAgo > 90);

  // Uniform downsample of older reviews to at most 100
  const sampled: typeof older = [];
  if (older.length <= 100) {
    sampled.push(...older);
  } else {
    const step = older.length / 100;
    for (let i = 0; i < 100; i++) {
      sampled.push(older[Math.floor(i * step)]);
    }
  }

  return { ...input, reviews: [...recent, ...sampled] };
}

/** Build the user-turn prompt from a (possibly sampled) ReviewInput */
export function buildUserPrompt(input: ReviewInput): string {
  const sampled = sampleReviews(input);
  return `Place: ${sampled.placeName}
Category: ${sampled.category} / ${sampled.subtype}
Reviews (${sampled.reviews.length}):
${JSON.stringify(sampled.reviews, null, 2)}

Generate the Receipt JSON now.`;
}

/** Strip markdown code fences that Claude sometimes adds despite instructions */
function parseReceiptJson(raw: string): ReceiptOutput {
  const stripped = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();
  return JSON.parse(stripped) as ReceiptOutput;
}

/** Single Claude call */
async function callClaude(
  client: Anthropic,
  userPrompt: string,
  temperature: number
): Promise<string> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    temperature,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const block = response.content[0];
  if (block.type !== "text") {
    throw new Error(`Unexpected content block type: ${block.type}`);
  }
  return block.text;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a Receipt for a single place.
 * Retries once with temperature=0 on JSON parse failure.
 */
export async function generateReceipt(
  input: ReviewInput,
  apiKey?: string
): Promise<ReceiptResult> {
  const inputHash = hashInput(input);
  const client = new Anthropic({ apiKey: apiKey ?? process.env.ANTHROPIC_API_KEY });
  const userPrompt = buildUserPrompt(input);

  let lastError: string | undefined;

  // Attempt 1 at temperature 0.2, retry at 0 on parse failure
  for (const [attempt, temperature] of [[0, 0.2], [1, 0]] as [number, number][]) {
    try {
      const raw = await callClaude(client, userPrompt, temperature);
      const output = parseReceiptJson(raw);

      const guard = validateReceipt(output, input);
      if (!guard.ok) {
        if (attempt === 0) {
          lastError = guard.reason;
          continue; // retry
        }
        return {
          output: null,
          status: "needs_review",
          error: guard.reason,
          inputHash,
        };
      }

      return { output, status: output.status, inputHash };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      if (attempt === 1) break;
    }
  }

  return {
    output: null,
    status: "needs_review",
    error: lastError ?? "Unknown error",
    inputHash,
  };
}

/**
 * Batch-generate receipts with concurrency=5 and exponential backoff on 429s.
 * onProgress is called after each item completes.
 */
export async function generateReceiptBatch(
  inputs: ReviewInput[],
  apiKey?: string,
  onProgress?: (done: number, total: number, result: ReceiptResult) => void
): Promise<ReceiptResult[]> {
  const results: ReceiptResult[] = new Array(inputs.length);
  let nextIndex = 0;
  let done = 0;
  const total = inputs.length;

  async function worker(): Promise<void> {
    while (true) {
      const idx = nextIndex++;
      if (idx >= inputs.length) return;

      let result: ReceiptResult | undefined;
      let attempt = 0;

      while (attempt < MAX_ATTEMPTS) {
        try {
          result = await generateReceipt(inputs[idx], apiKey);
          break;
        } catch (err) {
          const isRateLimit =
            err instanceof Anthropic.APIError && err.status === 429;
          if (isRateLimit && attempt < MAX_ATTEMPTS - 1) {
            const delayMs = 1000 * Math.pow(2, attempt); // 1s, 2s, 4s
            await new Promise((res) => setTimeout(res, delayMs));
            attempt++;
          } else {
            result = {
              output: null,
              status: "needs_review",
              error: err instanceof Error ? err.message : String(err),
              inputHash: hashInput(inputs[idx]),
            };
            break;
          }
        }
      }

      results[idx] = result!;
      done++;
      onProgress?.(done, total, result!);
    }
  }

  // Launch CONCURRENCY workers
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, inputs.length) }, () => worker())
  );

  return results;
}
