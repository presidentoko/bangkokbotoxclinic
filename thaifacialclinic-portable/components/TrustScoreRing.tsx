import { trustTier } from "./TrustScoreBadge";

export default function TrustScoreRing({
  score,
  size = 88,
  stroke = 8,
  showLabel = true,
}: {
  score: number;
  size?: number;
  stroke?: number;
  showLabel?: boolean;
}) {
  const tier = trustTier(score);
  const color = tier === "high" ? "#10b981" : tier === "mid" ? "#f59e0b" : "#ef4444";
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(100, score)) / 100);

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 6px ${color}55)` }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center leading-none">
          <div
            className="font-bold tabular-nums"
            style={{ fontSize: size * 0.32, color }}
          >
            {score}
          </div>
          {showLabel && (
            <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-500">
              Trust
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
