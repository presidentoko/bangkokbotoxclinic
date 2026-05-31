// Dashboard SVG mini-charts. Pure presentational, no state.

import type { RatingTrend } from "@/lib/types";

export function ViewsChart({ data }: { data: { date: string; count: number }[] }) {
  if (!data.length) return null;
  const W = 700, H = 80, PT = 8, PB = 18, PL = 4, PR = 4;
  const max = Math.max(...data.map((d) => d.count), 1);
  const barW = (W - PL - PR) / data.length;
  const chartH = H - PT - PB;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Daily profile views">
      {data.map((d, i) => {
        const h = (d.count / max) * chartH;
        const x = PL + i * barW;
        const y = PT + (chartH - h);
        const isLast = i === data.length - 1;
        return (
          <g key={d.date}>
            <rect
              x={x + 1}
              y={y}
              width={Math.max(barW - 2, 1)}
              height={h}
              fill={isLast ? "#6366f1" : "#a5b4fc"}
              rx={1.5}
            />
            {d.count > 0 && (
              <title>{`${d.date}: ${d.count} view${d.count !== 1 ? "s" : ""}`}</title>
            )}
          </g>
        );
      })}
      {data.map((d, i) =>
        i % 5 === 0 || i === data.length - 1 ? (
          <text
            key={`l-${d.date}`}
            x={PL + i * barW + barW / 2}
            y={H - 4}
            fontSize="9"
            fill="#9ca3af"
            textAnchor="middle"
          >
            {d.date.slice(5)}
          </text>
        ) : null
      )}
    </svg>
  );
}

export function RatingTrendChart({ trend }: { trend: RatingTrend }) {
  const W = 340, H = 100, PL = 28, PR = 16, PT = 18, PB = 8;
  const cW = W - PL - PR;
  const cH = H - PT - PB;

  const buckets = [
    { label: "1yr+",   ...trend.old },
    { label: "3-12mo", ...trend.midterm },
    { label: "30d",    ...trend.recent },
  ];

  const toY = (avg: number | null): number | null =>
    avg === null ? null : PT + cH - ((avg - 1) / 4) * cH;

  const pts = buckets.map((b, i) => ({
    x: PL + (i / 2) * cW,
    y: toY(b.avg),
    label: b.label,
    avg: b.avg,
    count: b.count,
  }));

  const segments: string[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    if (a.y !== null && b.y !== null)
      segments.push(`M ${a.x} ${a.y} L ${b.x} ${b.y}`);
  }

  const gridRatings = [2, 3, 4, 5];

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: "visible" }}>
        {gridRatings.map((r) => {
          const y = toY(r)!;
          return (
            <g key={r}>
              <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#f0f0f0" strokeWidth="1" />
              <text x={PL - 4} y={y + 3.5} fontSize="9" textAnchor="end" fill="#9ca3af">★{r}</text>
            </g>
          );
        })}

        {segments.map((d, i) => (
          <path key={i} d={d} stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ))}

        {pts.map((p, i) => (
          <g key={i}>
            {p.y !== null ? (
              <>
                <circle cx={p.x} cy={p.y} r="5" fill="#10b981" />
                <text x={p.x} y={p.y - 10} fontSize="10" textAnchor="middle" fill="#111827" fontWeight="700">
                  ★{p.avg?.toFixed(2)}
                </text>
              </>
            ) : (
              <circle cx={p.x} cy={H / 2} r="4" fill="#e5e7eb" />
            )}
            <text x={p.x} y={H + 2} fontSize="9" textAnchor="middle" fill="#6b7280">{p.label}</text>
            {p.count > 0 && (
              <text x={p.x} y={H + 13} fontSize="8" textAnchor="middle" fill="#9ca3af">{p.count} rev</text>
            )}
          </g>
        ))}
      </svg>
      <div className="grid grid-cols-3 gap-3 mt-4 text-center text-xs border-t border-[var(--border)] pt-3">
        {buckets.map((b, i) => (
          <div key={i}>
            <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold">{b.label}</div>
            <div className="text-base font-black">{b.avg != null ? `★${b.avg.toFixed(1)}` : "—"}</div>
            <div className="text-[10px] text-[var(--muted)]">{b.count > 0 ? `${b.count} reviews` : "no data"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
