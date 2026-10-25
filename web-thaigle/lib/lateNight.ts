// Which venues are still open late — every night, not just on Saturdays.
//
// Built from the Google Maps opening hours already in data/by-niche (84-92% of
// spa and muay-thai venues carry a full week). "Open until midnight" here
// means the venue's *earliest* closing time across the days it trades is
// midnight or later (HoursSummary.earliestClose), so a place that stays up
// only at weekends is counted at its weekday hour. Pure, so the test can run
// it on the real dataset and the page prints exactly what the test checked.

import { adjustedRating, summarizeHours, type HoursSummary } from "./vsMetrics";

type Place = {
  id: string;
  slug: string;
  name: string;
  city: string;
  address?: string | null;
  rating?: number | null;
  review_count?: number | null;
  opening_hours_json?: string | null;
};

type KnownHours = Extract<HoursSummary, { known: true }>;

/**
 * Phone-only outcall services: no premises, so "open until" is not a question
 * that applies, and they are what most "24-hour massage" listings turn out to
 * be (5 of the first 6 in Bangkok on 2026-10-25). Matched on the name, which
 * is where these listings say it. "Home Massage" alone is a common shop name
 * and is deliberately not matched.
 */
const OUTCALL = /outcall|out-call|out call|on-demand|delivery|mobile massage|นวดนอกสถานที่|นวดที่บ้าน|นวดถึงบ้าน|출장|上门|在家|自宅/i;

export function isOutcall(p: { name: string }): boolean {
  return OUTCALL.test(p.name ?? "");
}

/** Thresholds, in one place. Minutes after midnight; 1440 = midnight. */
export const LATE = {
  midnight: 1440,
  oneAm: 1500,
  /** Venues with a full readable week a city needs before it gets a page. */
  minKnown: 150,
  /** Rows printed in the main list. Counts above it are the full totals. */
  show: 30,
  /** An area row is printed only when it has this many venues with hours. */
  minArea: 20,
} as const;

/** Closing-time buckets for the distribution table, by earliest nightly close. */
export const BUCKETS: { label: string; upTo: number }[] = [
  { label: "Before 9 PM", upTo: 21 * 60 - 1 },
  { label: "9–10 PM", upTo: 22 * 60 - 1 },
  { label: "10–11 PM", upTo: 23 * 60 - 1 },
  { label: "11 PM–midnight", upTo: LATE.midnight - 1 },
  { label: "Midnight–1 AM", upTo: LATE.oneAm - 1 },
  { label: "1 AM or later", upTo: Infinity },
];

export type LateVenue<P extends Place = Place> = {
  p: P;
  hours: KnownHours;
  adjusted: number | null;
};

export type LateReport<P extends Place = Place> = {
  /** Venues in the city at all (after the niche's own publishing gate). */
  total: number;
  /** Outcall-only services left out of everything below. */
  outcall: number;
  /** Venues with a full readable week. */
  known: number;
  open24: LateVenue<P>[];
  /** Open until midnight or later every night (not 24h). Best adjusted rating first. */
  midnight: LateVenue<P>[];
  /** Subset of midnight: until 1 AM or later every night. */
  oneAm: number;
  /** Count per BUCKETS row, excluding 24h venues. */
  buckets: number[];
  /** Median adjusted rating used as the prior; also printed. */
  prior: number;
};

function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** `places` must already be the niche's published set (qualifyingNichePlaces). */
export function lateReport<P extends Place>(places: P[], city: string): LateReport<P> {
  const all = places.filter((p) => p.city === city);
  const inCity = all.filter((p) => !isOutcall(p));
  const prior = median(inCity.map((p) => p.rating ?? NaN).filter((r) => Number.isFinite(r) && r > 0));
  const known: LateVenue<P>[] = [];
  for (const p of inCity) {
    const hours = summarizeHours(p.opening_hours_json);
    if (!hours.known) continue;
    known.push({ p, hours, adjusted: adjustedRating(p.rating ?? null, p.review_count ?? null, prior) });
  }
  const byAdjusted = (a: LateVenue<P>, b: LateVenue<P>) =>
    (b.adjusted ?? -1) - (a.adjusted ?? -1) || (b.p.review_count ?? 0) - (a.p.review_count ?? 0);
  const open24 = known.filter((v) => v.hours.open24).sort(byAdjusted);
  const rest = known.filter((v) => !v.hours.open24);
  const midnight = rest.filter((v) => v.hours.earliestClose >= LATE.midnight).sort(byAdjusted);
  const buckets = BUCKETS.map(() => 0);
  for (const v of rest) buckets[BUCKETS.findIndex((b) => v.hours.earliestClose <= b.upTo)]++;
  return {
    total: all.length,
    outcall: all.length - inCity.length,
    known: known.length,
    open24,
    midnight,
    oneAm: midnight.filter((v) => v.hours.earliestClose >= LATE.oneAm).length,
    buckets,
    prior: Math.round(prior * 100) / 100,
  };
}

export function hasLatePage<P extends Place>(places: P[], city: string): boolean {
  const r = lateReport(places, city);
  return r.known >= LATE.minKnown && r.midnight.length >= LATE.show / 2;
}

/** "Midnight" rather than "12 AM", which readers misread as noon or the night before. */
export function closeLabel(min: number, fmt: (m: number) => string): string {
  return min === 1440 ? "Midnight" : fmt(min);
}

export function pct(n: number, d: number): string {
  return d ? `${Math.round((n / d) * 100)}%` : "0%";
}
