// jobs/learn-cooking/normalize.ts
// Adapts raw collected reviews from multiple sources into ReviewInput schema

import type { ReviewInput, ReviewSource } from "@/lib/receipt/types";
import { SOURCE_TRUST, SPONSORED_PATTERNS, CLASS_SIGNALS } from "./config";

export interface RawReview {
  id: number;
  source: string;
  ratingRaw?: number;   // Original scale varies (Klook: 10, GYG: 5, Google: 5)
  ratingScale?: number; // Denominator (default 5)
  text: string;
  daysAgo: number;
  authorName?: string;
}

export interface RawPlace {
  place_id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  gmbCategory?: string;
  reviews: RawReview[];
}

// ReviewSource union from lib/receipt/types.ts:
// "google" | "line" | "tiktok_comment" | "field" | "other"
// OTA sources (klook, getyourguide, viator, airbnb_exp) must map to "other"
const REVIEW_SOURCE_ALLOWLIST = new Set<ReviewSource>([
  "google",
  "line",
  "tiktok_comment",
  "field",
  "other",
]);

function toReviewSource(raw: string): ReviewSource {
  const normalized = raw.toLowerCase().replace(/[^a-z_]/g, "_") as ReviewSource;
  return REVIEW_SOURCE_ALLOWLIST.has(normalized) ? normalized : "other";
}

export function isSponsoredReview(text: string): boolean {
  return SPONSORED_PATTERNS.some((p) => p.test(text));
}

export function hasClassSignal(reviews: RawReview[]): boolean {
  return reviews.some((r) => CLASS_SIGNALS.some((p) => p.test(r.text)));
}

export function normalizeRating(raw: number, scale: number): number {
  // Normalize to 0–5 scale
  return Math.min(5, Math.max(0, (raw / scale) * 5));
}

export function normalizeReviews(place: RawPlace): ReviewInput {
  const reviews = place.reviews.map((r): ReviewInput["reviews"][number] => {
    const source = toReviewSource(r.source);
    const rating =
      r.ratingRaw !== undefined
        ? normalizeRating(r.ratingRaw, r.ratingScale ?? 5)
        : undefined;

    return {
      id: r.id,
      source,
      rating,
      text: r.text,
      daysAgo: r.daysAgo,
      sponsoredSignal: isSponsoredReview(r.text),
    };
  });

  return {
    placeName: place.name,
    category: "learn",
    subtype: "thai cooking class",
    reviews,
  };
}

// Detect duplicate review text (same campaign copy-paste)
export function dedupeByText(reviews: RawReview[]): RawReview[] {
  const seen = new Set<string>();
  return reviews.filter((r) => {
    const key = r.text.trim().toLowerCase().slice(0, 80);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
