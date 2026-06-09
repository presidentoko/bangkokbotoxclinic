// ⚠️ AUTO-GENERATED from shared/components/RatingChart.tsx
// DO NOT edit directly — edit shared/components/RatingChart.tsx, then run `python scripts/sync_shared.py`.

// Rating trend 시각화 — recent vs midterm vs old SVG bar chart.

import type { RatingTrend } from "@/lib/types";

export function RatingChart({ trend }: { trend: RatingTrend }) {
  const buckets = [
    { label: "1+ year ago", data: trend.old, color: "#94a3b8" },
    { label: "3-12 months", data: trend.midterm, color: "#64748b" },
    { label: "Last 3 months", data: trend.recent, color: "#0f172a" },
  ];
  const max = 5;
  const hasData = buckets.some((b) => b.data.avg !== null);

  if (!hasData) {
    return (
      <div className="bg-white border border-[var(--border)] rounded-xl p-5 text-sm text-[var(--muted)]">
        Insufficient review timeline data.
      </div>
    );
  }

  const trendIcon =
    trend.trend === "improving" ? "↗"
    : trend.trend === "declining" ? "↘"
    : trend.trend === "stable" ? "→"
    : "·";
  const trendColor =
    trend.trend === "improving" ? "#16a34a"
    : trend.trend === "declining" ? "#ea580c"
    : "#64748b";
  const trendLabel =
    trend.trend === "improving" ? "Improving"
    : trend.trend === "declining" ? "Declining"
    : trend.trend === "stable" ? "Stable"
    : "Insufficient data";

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-[var(--muted)]">Rating timeline</div>
          <div className="text-base font-semibold mt-0.5">Quality trend</div>
        </div>
        <span
          className="text-sm font-bold flex items-center gap-1"
          style={{ color: trendColor }}
        >
          <span className="text-xl">{trendIcon}</span>
          {trendLabel}
        </span>
      </div>

      <div className="space-y-3">
        {buckets.map((b) => {
          const pct = b.data.avg !== null ? (b.data.avg / max) * 100 : 0;
          return (
            <div key={b.label} className="flex items-center gap-2 sm:gap-3 text-sm">
              <span className="w-20 sm:w-28 text-xs text-[var(--muted)] shrink-0 leading-tight">{b.label}</span>
              <div className="flex-1 h-7 bg-gray-50 rounded-md overflow-hidden relative">
                {b.data.avg !== null && (
                  <div
                    className="h-full rounded-md flex items-center justify-end px-2 text-xs font-semibold text-white"
                    style={{ width: `${pct}%`, background: b.color, minWidth: "44px" }}
                  >
                    ★ {b.data.avg.toFixed(2)}
                  </div>
                )}
                {b.data.avg === null && (
                  <span className="absolute inset-0 flex items-center px-2 text-xs text-[var(--muted)]">
                    No data
                  </span>
                )}
              </div>
              <span className="w-10 sm:w-16 text-xs text-[var(--muted)] tabular-nums text-right shrink-0">
                {b.data.count} review{b.data.count === 1 ? "" : "s"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
