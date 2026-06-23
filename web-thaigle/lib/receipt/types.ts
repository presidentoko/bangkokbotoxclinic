// Receipt Generation Pipeline — Type Definitions
// Produces localsScore, feed_says, data_says from raw reviews via Claude API

export type ReviewSource = "google" | "line" | "tiktok_comment" | "field" | "other";

export interface ReviewInput {
  placeName: string;
  category: "eat" | "train" | "treat" | "learn" | "relax";
  subtype: string;
  reviews: {
    id: number;
    source: ReviewSource;
    rating?: number; // 1–5 stars; undefined if text-only
    text: string;
    daysAgo: number;
    sponsoredSignal?: boolean; // true if detected as sponsored/gifted
  }[];
}

export type ReceiptStatus = "ok" | "insufficient" | "needs_review";

export interface ScoringMeta {
  kept: number;          // reviews used after filtering
  excludedSponsored: number;
  weightedMean5: number; // weighted mean on 5-point scale before Bayesian adjustment
  variance: number;
}

export interface I18nText {
  th: string;
  en: string;
  ko: string;
}

export interface EvidenceItem {
  claim: string;       // short claim string (e.g. "฿140 per plate")
  reviewIds: number[]; // must reference valid ids from ReviewInput.reviews
}

export interface FaqItem {
  q: I18nText;
  a: I18nText;
}

export interface ReceiptOutput {
  localsScore: number;   // 0.0–10.0, one decimal place
  status: ReceiptStatus;
  scoring: ScoringMeta;
  feed_says: I18nText;  // 1-sentence hook for social feed; no @handles, URLs, #tags
  data_says: I18nText;  // 2–3 data-backed sentences; numeric claims must appear in evidence
  evidence: EvidenceItem[];
  faq: FaqItem[];
}

export interface ReceiptResult {
  output: ReceiptOutput | null;
  status: ReceiptStatus;
  error?: string;
  inputHash: string; // SHA-256 of serialized ReviewInput for caching/dedup
}
