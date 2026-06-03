// Pure server-renderable presentational
export function trustTier(score: number): "high" | "mid" | "low" {
  if (score >= 75) return "high";
  if (score >= 50) return "mid";
  return "low";
}

export default function TrustScoreBadge({ score, label }: { score: number; label?: string }) {
  const tier = trustTier(score);
  return (
    <span className="trust-chip" data-tier={tier} aria-label={`Trust Score ${score}`}>
      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
        <path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.77l-6.18 3.25L7 13.14 2 8.27l6.91-1.01L12 1z" />
      </svg>
      <span className="tabular-nums">{score}</span>
      <span className="opacity-60">/100</span>
      {label ? <span className="ml-1 font-normal opacity-70">{label}</span> : null}
    </span>
  );
}
