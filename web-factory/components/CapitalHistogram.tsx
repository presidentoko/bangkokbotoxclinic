// Capital distribution histogram — peer group capital distribution
// with arrow marker indicating this supplier's position.

type Props = {
  myCapital: number;
  peerCapitals: number[];   // 같은 TSIC peer 그룹 자본금
  tsicLabel?: string;
};

function formatCap(thb: number): string {
  if (thb >= 1_000_000_000) return `฿${(thb / 1_000_000_000).toFixed(1)}B`;
  if (thb >= 1_000_000) return `฿${(thb / 1_000_000).toFixed(0)}M`;
  if (thb >= 1_000) return `฿${(thb / 1_000).toFixed(0)}K`;
  return `฿${thb.toFixed(0)}`;
}

// log-scale bucket edges in THB
const BUCKETS = [
  { label: "<100K", min: 0,           max: 100_000 },
  { label: "100K-1M", min: 100_000,   max: 1_000_000 },
  { label: "1-10M", min: 1_000_000,   max: 10_000_000 },
  { label: "10-100M", min: 10_000_000,max: 100_000_000 },
  { label: "100M-1B", min: 100_000_000,max: 1_000_000_000 },
  { label: "1B+",   min: 1_000_000_000, max: Infinity },
];

function bucketIndex(thb: number): number {
  for (let i = 0; i < BUCKETS.length; i++) {
    if (thb >= BUCKETS[i].min && thb < BUCKETS[i].max) return i;
  }
  return BUCKETS.length - 1;
}

export function CapitalHistogram({ myCapital, peerCapitals, tsicLabel }: Props) {
  if (peerCapitals.length < 3) return null;

  const counts = BUCKETS.map(() => 0);
  for (const c of peerCapitals) counts[bucketIndex(c)]++;
  const maxCount = Math.max(...counts, 1);
  const myBucket = bucketIndex(myCapital);

  // Percentile rank
  const sorted = [...peerCapitals].sort((a, b) => a - b);
  const aboveMe = sorted.filter((x) => x > myCapital).length;
  const pctTop = peerCapitals.length > 0 ? Math.round((aboveMe / peerCapitals.length) * 100) : 0;

  const W = 600;
  const H = 220;
  const PADDING_X = 40;
  const PADDING_BOTTOM = 50;
  const PADDING_TOP = 30;
  const chartW = W - PADDING_X * 2;
  const chartH = H - PADDING_BOTTOM - PADDING_TOP;
  const barW = chartW / BUCKETS.length - 8;
  const gap = 8;

  return (
    <section className="bg-white border border-stone-200 rounded-2xl p-5">
      <div className="flex items-baseline justify-between mb-1 flex-wrap gap-2">
        <h3 className="text-base font-bold text-stone-900 font-display">Capital position vs peers</h3>
        <span className="text-xs text-stone-500 font-mono-data">{peerCapitals.length} peers</span>
      </div>
      {tsicLabel && <p className="text-xs text-stone-500 mb-3 font-mono-data">{tsicLabel}</p>}

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="max-w-full" preserveAspectRatio="xMidYMid meet">
        {/* y-axis baseline */}
        <line x1={PADDING_X} y1={PADDING_TOP + chartH} x2={W - PADDING_X} y2={PADDING_TOP + chartH} stroke="#e7e5e4" strokeWidth="1" />

        {/* bars */}
        {BUCKETS.map((b, i) => {
          const x = PADDING_X + i * (barW + gap) + gap / 2;
          const h = (counts[i] / maxCount) * chartH;
          const y = PADDING_TOP + chartH - h;
          const isMine = i === myBucket;
          return (
            <g key={i}>
              <rect
                x={x} y={y} width={barW} height={h}
                fill={isMine ? "#b45309" : "#d6d3d1"}
                rx="3"
              />
              {/* count label */}
              {counts[i] > 0 && (
                <text x={x + barW / 2} y={y - 4} textAnchor="middle"
                      fontSize="11" fontWeight="700"
                      fill={isMine ? "#b45309" : "#57534e"}>{counts[i]}</text>
              )}
              {/* bucket label */}
              <text x={x + barW / 2} y={PADDING_TOP + chartH + 16} textAnchor="middle"
                    fontSize="10" fontWeight="600" fill="#57534e">{b.label}</text>
              {/* arrow marker for my bucket */}
              {isMine && (
                <g>
                  <polygon
                    points={`${x + barW/2 - 6},${PADDING_TOP - 12} ${x + barW/2 + 6},${PADDING_TOP - 12} ${x + barW/2},${PADDING_TOP - 2}`}
                    fill="#b45309"
                  />
                  <text x={x + barW / 2} y={PADDING_TOP - 18} textAnchor="middle"
                        fontSize="10" fontWeight="800" fill="#b45309"
                        className="font-mono-data">{formatCap(myCapital)}</text>
                </g>
              )}
            </g>
          );
        })}

        {/* x-axis title */}
        <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="11" fill="#78716c">
          Registered capital (THB) — log scale
        </text>
      </svg>

      <p className="text-xs text-stone-600 mt-2 leading-relaxed">
        This supplier sits at <span className="font-bold text-amber-800 font-mono-data">{formatCap(myCapital)}</span> capital — {" "}
        {pctTop === 0 ? <span className="font-bold">top of the peer group</span>
          : pctTop <= 25 ? <span>in the <span className="font-bold text-amber-800">top {pctTop}%</span> of the {peerCapitals.length} TSIC peers</span>
          : pctTop <= 50 ? <span>above the median of {peerCapitals.length} TSIC peers</span>
          : <span>in the bottom {100 - pctTop}% of {peerCapitals.length} TSIC peers (early-stage capital)</span>}.
      </p>
    </section>
  );
}
