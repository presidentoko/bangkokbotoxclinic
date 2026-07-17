// Single canonical Trust Score threshold table. TrustBadge, TrustScoreBadge,
// and the restaurant detail page each had their own cut points (75/60/40 vs
// 80/65/50 vs 80/60) — the same venue could read "Excellent" on a card and
// "Credible" on its own detail page, undermining the one metric the whole
// site is built around.
export function trustColor(score: number): string {
  if (score >= 80) return "#16a34a";
  if (score >= 65) return "#059669";
  if (score >= 50) return "#ca8a04";
  return "#dc2626";
}

/** Short tier word for compact badges (cards, lists). */
export function trustTierShort(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Strong";
  if (score >= 50) return "Fair";
  return "Limited";
}

/** Longer tier phrase for detail-page explainers. */
export function trustTierLong(score: number): string {
  if (score >= 80) return "Highly trustworthy";
  if (score >= 65) return "Credible";
  if (score >= 50) return "Moderate — verify independently";
  return "Low — inspect reviews carefully";
}
