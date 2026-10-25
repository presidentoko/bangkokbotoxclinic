// When a restaurant's Google rating has really moved, and when it only looks
// like it has.
//
// scripts/build_master_db.py buckets each scraped review by its relative date
// ("2 months ago" → recent, "3-11 months" → midterm, "a year ago"+ → old) and
// labels the place improving/declining when the recent average differs from
// the older one by 0.3★ — with no minimum on either side. On the 2026-08-21
// build that put "Declining" on 614 restaurants, 272 of them on fewer than
// five recent reviews: one unhappy diner was enough to brand a place as
// getting worse.
//
// This is the one rule the site now uses. lib/data.ts rewrites `trend` with it
// at load time, so every badge, chart label, verdict line and the
// /restaurants/[city]/rating-changes page read the same answer. Pure, so the
// test can run it on the real dataset.

import type { RatingTrend, RatingTrendBucket } from "./types";

/** Thresholds, in one place. Changing these changes every page that shows a trend. */
export const CHANGE = {
  /** Reviews needed in the last-three-months bucket. */
  minRecent: 20,
  /** Reviews needed in the bucket it is compared against. */
  minEarlier: 20,
  /** Gap in average stars that counts as a move. */
  minDelta: 0.4,
} as const;

export type EarlierBucket = "old" | "midterm";

export type RatingChange = {
  direction: "down" | "up" | "flat";
  recent: { count: number; avg: number };
  earlier: { count: number; avg: number; bucket: EarlierBucket };
  /** recent − earlier, rounded to two places. */
  delta: number;
};

function usable(b: RatingTrendBucket | undefined, min: number): b is { count: number; avg: number } {
  return !!b && b.avg != null && b.count >= min;
}

/**
 * The comparison, or null when the sample cannot support one. "Earlier" is the
 * 1+ year bucket when it has enough reviews, otherwise 3-12 months — the
 * longest baseline the data will bear.
 */
export function ratingChange(t: RatingTrend | undefined): RatingChange | null {
  if (!t || !usable(t.recent, CHANGE.minRecent)) return null;
  const bucket: EarlierBucket | null = usable(t.old, CHANGE.minEarlier)
    ? "old"
    : usable(t.midterm, CHANGE.minEarlier)
      ? "midterm"
      : null;
  if (!bucket) return null;
  const e = t[bucket] as { count: number; avg: number };
  const delta = Math.round((t.recent.avg! - e.avg) * 100) / 100;
  const direction = delta <= -CHANGE.minDelta ? "down" : delta >= CHANGE.minDelta ? "up" : "flat";
  return {
    direction,
    recent: { count: t.recent.count, avg: t.recent.avg! },
    earlier: { count: e.count, avg: e.avg, bucket },
    delta,
  };
}

/** The trend label the site shows. */
export function reliableTrend(t: RatingTrend | undefined): RatingTrend["trend"] {
  const c = ratingChange(t);
  if (!c) return "insufficient_data";
  return c.direction === "down" ? "declining" : c.direction === "up" ? "improving" : "stable";
}

export function earlierLabel(b: EarlierBucket): string {
  return b === "old" ? "a year or more earlier" : "3–12 months earlier";
}

// ── City report ──────────────────────────────────────────────────────────
// Everything /restaurants/[city]/rating-changes prints, computed here so the
// test can read the same numbers the page does.

type Row = {
  id: string;
  name: string;
  district: string;
  city: string;
  rating: number;
  total_reviews: number;
  business_status: string;
  scraped_review_count: number;
  rating_trend: RatingTrend;
};

export type Mover<R extends Row = Row> = { r: R; change: RatingChange };

export type DistrictLine = { district: string; eligible: number; down: number; up: number };

export type RatingChangeReport<R extends Row = Row> = {
  /** Open restaurants in the city whose sample supports a comparison. */
  eligible: number;
  /** Open restaurants in the city at all. */
  total: number;
  down: Mover<R>[];
  up: Mover<R>[];
  flat: number;
  /** Median |recent − earlier| across eligible places, in stars. */
  medianAbsDelta: number;
  /** Median reviews collected per eligible place — the sample, not Google's total. */
  medianSample: number;
  /** Districts with at least MIN_DISTRICT eligible places, most eligible first. */
  districts: DistrictLine[];
};

/** A district row is printed only when it has this many comparable places. */
export const MIN_DISTRICT = 8;

/** A city gets a page only when this many places moved. Fewer is a list, not a finding. */
export const MIN_MOVERS = 10;

function closed(r: Row): boolean {
  const s = (r.business_status || "").toLowerCase();
  return s.startsWith("permanently") || s.startsWith("temporarily") || s === "closed";
}

function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export function ratingChangeReport<R extends Row>(all: R[], city: string): RatingChangeReport<R> {
  const open = all.filter((r) => r.city === city && !closed(r));
  const movers: Mover<R>[] = [];
  let flat = 0;
  const deltas: number[] = [];
  const samples: number[] = [];
  const byDistrict = new Map<string, DistrictLine>();
  for (const r of open) {
    const change = ratingChange(r.rating_trend);
    if (!change) continue;
    deltas.push(Math.abs(change.delta));
    samples.push(r.scraped_review_count);
    const d = r.district || "";
    if (d) {
      const line = byDistrict.get(d) ?? { district: d, eligible: 0, down: 0, up: 0 };
      line.eligible++;
      if (change.direction !== "flat") line[change.direction]++;
      byDistrict.set(d, line);
    }
    if (change.direction === "flat") flat++;
    else movers.push({ r, change });
  }
  const down = movers.filter((m) => m.change.direction === "down").sort((a, b) => a.change.delta - b.change.delta);
  const up = movers.filter((m) => m.change.direction === "up").sort((a, b) => b.change.delta - a.change.delta);
  const districts = [...byDistrict.values()]
    .filter((l) => l.eligible >= MIN_DISTRICT)
    .sort((a, b) => b.eligible - a.eligible || a.district.localeCompare(b.district));
  return {
    eligible: deltas.length,
    total: open.length,
    down,
    up,
    flat,
    medianAbsDelta: Math.round(median(deltas) * 100) / 100,
    medianSample: Math.round(median(samples)),
    districts,
  };
}

export function pct(n: number, d: number): string {
  return d ? `${Math.round((n / d) * 100)}%` : "0%";
}

/** FAQ answers carry this page's own numbers; nothing here is boilerplate. */
export function ratingChangeFaqs(rep: RatingChangeReport, cityLabel: string, collected: string): { q: string; a: string }[] {
  const faqs: { q: string; a: string }[] = [];
  faqs.push({
    q: `Do ${cityLabel} restaurant ratings change much over time?`,
    a: `Mostly not. Of ${rep.eligible.toLocaleString()} open ${cityLabel} restaurants with at least ${CHANGE.minRecent} recent and ${CHANGE.minEarlier} earlier reviews in our sample, ${rep.flat.toLocaleString()} (${pct(rep.flat, rep.eligible)}) kept their average within ${CHANGE.minDelta} stars. The typical gap between recent and earlier reviews was ${rep.medianAbsDelta.toFixed(2)} stars.`,
  });
  if (rep.down.length) {
    const w = rep.down[0];
    faqs.push({
      q: `Which ${cityLabel} restaurant's rating fell the most?`,
      a: `${w.r.name}${w.r.district ? ` (${w.r.district})` : ""}: its ${w.change.recent.count} reviews from the last three months average ★${w.change.recent.avg.toFixed(2)}, against ★${w.change.earlier.avg.toFixed(2)} across ${w.change.earlier.count} reviews from ${earlierLabel(w.change.earlier.bucket)} — a fall of ${Math.abs(w.change.delta).toFixed(2)} stars. ${rep.down.length} restaurants fell by ${CHANGE.minDelta} stars or more.`,
    });
  }
  if (rep.up.length) {
    const b = rep.up[0];
    faqs.push({
      q: `Which ${cityLabel} restaurant improved the most?`,
      a: `${b.r.name}${b.r.district ? ` (${b.r.district})` : ""}: recent reviews average ★${b.change.recent.avg.toFixed(2)} across ${b.change.recent.count}, up from ★${b.change.earlier.avg.toFixed(2)} across ${b.change.earlier.count}. ${rep.up.length} restaurants rose by ${CHANGE.minDelta} stars or more.`,
    });
  }
  faqs.push({
    q: "Why isn't the Google star rating enough?",
    a: `The headline rating averages every review a place has ever had, so a restaurant that changed hands or chefs can carry years of old praise. Comparing the last three months with earlier reviews shows the direction; the headline number cannot.`,
  });
  faqs.push({
    q: "How recent is this?",
    a: `"Recent" means the three months before the reviews were collected, using the age Google shows on each review. This data was compiled ${collected}. A restaurant's direction can change after that, so treat a fall as a reason to read its latest reviews, not as a verdict.`,
  });
  return faqs;
}

/** Whether a city gets the page. Route params, sitemap and the city-page link all ask this. */
export function hasRatingChangePage<R extends Row>(all: R[], city: string): boolean {
  const rep = ratingChangeReport(all, city);
  return rep.down.length + rep.up.length >= MIN_MOVERS;
}
