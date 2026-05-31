// Per-TSIC industry averages — used for radar comparison vs peer group.
// Cached at module load (runs once per next build worker).

import type { MasterDb, Supplier } from "./types";

export type IndustryStats = {
  tsic: string;
  count: number;
  avgCapital: number;
  avgYears: number;
  avgRating: number;
  avgReviews: number;
  avgPhotos: number;
};

let _cache: Map<string, IndustryStats> | null = null;

export function industryStatsByTsic(db: MasterDb): Map<string, IndustryStats> {
  if (_cache) return _cache;
  const groups = new Map<string, Supplier[]>();
  for (const s of db.suppliers) {
    const code = s.dbd?.tsic_code;
    if (!code) continue;
    let arr = groups.get(code);
    if (!arr) { arr = []; groups.set(code, arr); }
    arr.push(s);
  }
  const out = new Map<string, IndustryStats>();
  for (const [tsic, arr] of groups) {
    const n = arr.length;
    if (n < 2) continue;  // 통계 의미 없는 그룹 제외
    const avg = (pick: (s: Supplier) => number) =>
      arr.reduce((s, x) => s + (pick(x) || 0), 0) / n;
    out.set(tsic, {
      tsic,
      count: n,
      avgCapital: avg((s) => s.dbd?.capital_thb || 0),
      avgYears:   avg((s) => s.years_in_business || 0),
      avgRating:  avg((s) => s.rating || 0),
      avgReviews: avg((s) => s.total_reviews || 0),
      avgPhotos:  avg((s) => (s.photos?.length || 0)),
    });
  }
  _cache = out;
  return out;
}

/** 0–100 percentile-ish score for a supplier value vs industry avg.
 *  100 = 2x or more above avg.   50 = at avg.   0 = zero. */
export function relScore(value: number, avg: number): number {
  if (!avg || avg <= 0) return 0;
  if (!value || value <= 0) return 0;
  const ratio = value / avg;
  // 0..2배 → 0..100, 2배 이상 cap.
  return Math.min(100, Math.max(0, ratio * 50));
}
