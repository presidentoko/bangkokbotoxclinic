// localsScore (lib/places-data.json) ranges ~7-56 in practice (p50=43,
// p75=48) — it is NOT a 0-100 scale despite looking like one. Thresholds
// here are picked from the actual distribution so "Recently verified"
// picks aren't uniformly rendered as red/low-confidence.
export function localsScoreColor(score: number): string {
  if (score >= 45) return "#0F6E56";
  if (score >= 30) return "#B45309";
  return "#991B1B";
}
