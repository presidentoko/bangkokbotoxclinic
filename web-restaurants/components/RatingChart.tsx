// ⚠️ AUTO-GENERATED from shared/components/RatingChart.tsx
// DO NOT edit directly — edit shared/components/RatingChart.tsx, then run `python scripts/sync_shared.py`.

// Rating trend 시각화 — recent vs midterm vs old SVG bar chart.
//
// 2026-10-26: /th 용 lang 추가 (web/ 보톡스 /th 클리닉 현지화, 덴탈 web-cf 3280f7d 와 같은 문구).
// 선택 prop 이라 기존 호출부는 그대로 영어.

import type { RatingTrend } from "@/lib/types";

export function RatingChart({ trend, lang = "en" }: { trend: RatingTrend; lang?: "en" | "th" }) {
  const th = lang === "th";
  const buckets = [
    { label: th ? "มากกว่า 1 ปีก่อน" : "1+ year ago", data: trend.old, color: "#94a3b8" },
    { label: th ? "3–12 เดือนก่อน" : "3-12 months", data: trend.midterm, color: "#64748b" },
    { label: th ? "3 เดือนล่าสุด" : "Last 3 months", data: trend.recent, color: "#0f172a" },
  ];
  const max = 5;
  const hasData = buckets.some((b) => b.data.avg !== null);

  if (!hasData) {
    return (
      <div className="bg-white border border-[var(--border)] rounded-xl p-5 text-sm text-[var(--muted)]">
        {th ? "ข้อมูลรีวิวตามช่วงเวลายังไม่พอ" : "Insufficient review timeline data."}
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
    trend.trend === "improving" ? (th ? "ดีขึ้น" : "Improving")
    : trend.trend === "declining" ? (th ? "แย่ลง" : "Declining")
    : trend.trend === "stable" ? (th ? "คงที่" : "Stable")
    : (th ? "ข้อมูลไม่พอ" : "Insufficient data");

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-[var(--muted)]">{th ? "คะแนนตามช่วงเวลา" : "Rating timeline"}</div>
          <div className="text-base font-semibold mt-0.5">{th ? "แนวโน้มคุณภาพ" : "Quality trend"}</div>
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
            <div key={b.label} className="flex items-center gap-3 text-sm">
              <span className="w-28 text-xs text-[var(--muted)] shrink-0">{b.label}</span>
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
                    {th ? "ไม่มีข้อมูล" : "No data"}
                  </span>
                )}
              </div>
              <span className="w-16 text-xs text-[var(--muted)] tabular-nums text-right shrink-0">
                {th ? `${b.data.count} รีวิว` : `${b.data.count} review${b.data.count === 1 ? "" : "s"}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
