import type { ThemeCount } from "./types";

export type TrustLabel = "excellent" | "good" | "fair" | "limited";

export type TrustScoreResult = {
  score: number;
  label: TrustLabel;
  breakdown: {
    ratingPoints: number;
    volumePoints: number;
    diversityPoints: number;
  };
};

// Normalization ceiling for the review-volume log scale — chosen at the
// live Bangkok dataset's ~95th percentile (see the design spec's
// Verification section), so the bulk of the distribution spreads across
// the full 0-35 range instead of clustering near the cap.
const VOLUME_CAP = 2000;

// 8 SERVICE_THEMES + 7 MOOD_KEYWORDS (scripts/extract-themes.mjs) — the
// fixed universe of labels a place's reviews can be mined for.
const MAX_DIVERSITY_LABELS = 15;

function ratingPoints(rating: number | null): number {
  if (rating == null) return 0;
  return Math.round((rating / 5) * 50);
}

function volumePoints(reviewCount: number): number {
  if (reviewCount <= 0) return 0;
  const raw = 35 * (Math.log10(reviewCount + 1) / Math.log10(VOLUME_CAP + 1));
  return Math.round(Math.min(35, raw));
}

function diversityPoints(serviceThemes: ThemeCount[], moodKeywords: ThemeCount[]): number {
  const labels = new Set([...serviceThemes.map((t) => t.label), ...moodKeywords.map((m) => m.label)]);
  return Math.min(labels.size, MAX_DIVERSITY_LABELS);
}

function labelFor(score: number): TrustLabel {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 50) return "fair";
  return "limited";
}

// A place's Trust Score: rating (50pts, linear) + review volume (35pts,
// log-scaled, capped) + review-mined signal diversity (15pts, 1 per
// distinct service-theme/mood-keyword label actually detected). See
// docs/superpowers/specs/2026-07-25-chillanel-trust-score-design.md for
// the full rationale, including why this replaces the 15 points of
// thaigle.com's formula that depend on Google reviewer-profile data this
// pipeline never scraped.
//
// Each component is rounded before summing — the breakdown shown on the
// place detail page must always add up to exactly this score.
export function trustScore(place: {
  rating: number | null;
  reviewCount: number;
  serviceThemes: ThemeCount[];
  moodKeywords: ThemeCount[];
}): TrustScoreResult {
  const rPts = ratingPoints(place.rating);
  const vPts = volumePoints(place.reviewCount);
  const dPts = diversityPoints(place.serviceThemes, place.moodKeywords);
  const score = rPts + vPts + dPts;
  return {
    score,
    label: labelFor(score),
    breakdown: { ratingPoints: rPts, volumePoints: vPts, diversityPoints: dPts },
  };
}
