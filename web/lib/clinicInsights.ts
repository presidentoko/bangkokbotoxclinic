import data from "../data/clinic-insights.json";

/**
 * Per-clinic aspect counts mined from every scraped review
 * (scripts/build_clinic_insights.py, 2026-10-23). Numbers only — no review text.
 *
 * Stored compact for the Workers bundle: [analysed, pos, neg, pos, neg, ...]
 * in `aspect_order`.
 */

export type ClinicAspect = "painless" | "explanation" | "staff" | "cleanliness" | "value" | "english";

export interface ClinicInsights {
  analysed: number;
  aspects: Record<ClinicAspect, { pos: number; neg: number }>;
}

const file = data as unknown as { aspect_order: ClinicAspect[]; clinics: Record<string, number[]> };

export function getClinicInsights(clinicId: string): ClinicInsights | null {
  const row = file.clinics[clinicId];
  if (!row) return null;
  const aspects = {} as ClinicInsights["aspects"];
  file.aspect_order.forEach((k, i) => {
    aspects[k] = { pos: row[1 + i * 2], neg: row[2 + i * 2] };
  });
  return { analysed: row[0], aspects };
}

/** Wilson score lower bound (95%) — 3/3 praise must not outrank 190/200. */
export function wilson(pos: number, n: number): number {
  if (n === 0) return 0;
  const z = 1.96;
  const p = pos / n;
  return (p + (z * z) / (2 * n) - z * Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / n)) / (1 + (z * z) / n);
}

/** Ranking score for one aspect, or 0 when there are too few mentions to say anything. */
export function aspectScore(clinicId: string, aspect: ClinicAspect, minMentions = 5): number {
  const ins = getClinicInsights(clinicId);
  if (!ins) return 0;
  const { pos, neg } = ins.aspects[aspect];
  return pos + neg >= minMentions ? wilson(pos, pos + neg) : 0;
}
