// Receipt Generation Pipeline — Anti-Hallucination + Legal (Thailand §326-328) Guardrails
// Validates ReceiptOutput before it can be stored or served

import type { ReceiptOutput, ReviewInput } from "./types";

export type GuardrailResult = { ok: true } | { ok: false; reason: string };

const HANDLE_OR_URL_RE = /(@\w+|https?:\/\/\S+|#\w+)/i;
const NUMERIC_CLAIM_RE = /฿[\d,]+|[\d,]+\s*(baht|บาท)|[\d]+\s*times?/gi;

// Thailand defamation (CCA + Criminal Code §326–328): forbidden imputations.
// Truth is NOT a defense — only defensible as opinion + public interest.
const FORBIDDEN_TERMS_RE = new RegExp(
  [
    // English
    "scam", "fraud", "fake review", "bought review", "manipulat", "fake rating",
    "ripoff", "rip.?off", "overcharg", "unlicensed", "illegal", "unsafe",
    "unhygienic", "incompetent", "dishonest", "deceptive", "lied",
    // Thai equivalents
    "โกง", "ปลอม", "หลอก", "ฉ้อโกง", "ไม่มีใบอนุญาต", "อันตราย", "ไม่สะอาด",
    // Sponsorship leak: must not appear in public fields
    "% sponsored", "sponsored excluded", "fake",
  ].join("|"),
  "i"
);

/**
 * Runs all guardrail checks on a candidate ReceiptOutput.
 * Returns { ok: true } if all checks pass, or { ok: false, reason } on first failure.
 */
export function validateReceipt(
  output: ReceiptOutput,
  input: ReviewInput
): GuardrailResult {
  const validIds = new Set(input.reviews.map((r) => r.id));

  // 1. All evidence reviewIds must reference ids that exist in input
  for (const ev of output.evidence) {
    for (const rid of ev.reviewIds) {
      if (!validIds.has(rid)) {
        return {
          ok: false,
          reason: `Hallucinated evidence: reviewId ${rid} does not exist in input (claim: "${ev.claim}")`,
        };
      }
    }
  }

  // 2. feed_says must not contain @handles, URLs, or #hashtags (in any language)
  for (const lang of ["th", "en", "ko"] as const) {
    const text = output.feed_says[lang];
    if (HANDLE_OR_URL_RE.test(text)) {
      return {
        ok: false,
        reason: `feed_says[${lang}] contains a social handle, URL, or hashtag: "${text}"`,
      };
    }
  }

  // 3. If sponsored ratio > 60 % → force status to "needs_review"
  const totalReviews = input.reviews.length;
  const sponsoredCount = input.reviews.filter((r) => r.sponsoredSignal).length;
  if (totalReviews > 0 && sponsoredCount / totalReviews > 0.6) {
    // Mutate status in-place so the caller sees the corrected value
    output.status = "needs_review";
  }

  // 4. Numeric claims (฿, baht, times) in data_says must appear in evidence
  for (const lang of ["th", "en", "ko"] as const) {
    const text = output.data_says[lang];
    const numericMatches = text.match(NUMERIC_CLAIM_RE) ?? [];
    for (const match of numericMatches) {
      const appearsInEvidence = output.evidence.some((ev) =>
        ev.claim.includes(match)
      );
      if (!appearsInEvidence) {
        return {
          ok: false,
          reason: `data_says[${lang}] contains numeric claim "${match}" without a matching evidence entry`,
        };
      }
    }
  }

  // 5. Translation length ratio sanity check (warning only)
  const enLen = output.feed_says.en.length;
  for (const lang of ["th", "ko"] as const) {
    const ratio = output.feed_says[lang].length / (enLen || 1);
    if (ratio < 0.4) {
      console.warn(
        `[guardrails] feed_says[${lang}] is suspiciously short vs en ` +
          `(ratio ${ratio.toFixed(2)}). Possible missing translation.`
      );
    }
  }

  // 6. Legal guard (Thailand §326–328): forbidden imputations in public fields
  for (const field of ["feed_says", "data_says"] as const) {
    for (const lang of ["th", "en", "ko"] as const) {
      const text = output[field][lang];
      const match = text.match(FORBIDDEN_TERMS_RE);
      if (match) {
        return {
          ok: false,
          reason: `[legal] ${field}[${lang}] contains forbidden imputation: "${match[0]}" — reframe as aggregated opinion`,
        };
      }
    }
  }

  // 7. treat category: any negative score signal → needs_review for human audit
  if (input.category === "treat") {
    const negativeSentiment = output.scoring.weightedMean5 < 3.5 ||
      output.status === "needs_review";
    if (negativeSentiment) {
      output.status = "needs_review";
    }
    // Medical safety claims are always too risky
    const MEDICAL_RISK_RE = /safe|unsafe|danger|harm|infect|steril|licens/i;
    for (const lang of ["th", "en", "ko"] as const) {
      if (MEDICAL_RISK_RE.test(output.data_says[lang])) {
        return {
          ok: false,
          reason: `[legal] data_says[${lang}] contains medical safety claim — drop for treat category`,
        };
      }
    }
  }

  return { ok: true };
}
