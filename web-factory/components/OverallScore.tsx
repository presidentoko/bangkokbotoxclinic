// Big concentric-ring scoreboard — overall + 4 sub-scores.
// SVG only. Eye-grabbing centerpiece.

type Sub = {
  label: string;
  score: number;        // 0-100
  color?: string;
};

type Props = {
  overall: number;      // 0-100
  subs: Sub[];          // 4 권장
  caption?: string;     // "TRUST INDEX"
};

const SIZE = 280;
const CENTER = SIZE / 2;
const STROKE = 12;
const GAP = 4;

export function OverallScore({ overall, subs, caption = "TRUST INDEX" }: Props) {
  // ring radii decreasing inward
  const ringRadii = subs.slice(0, 5).map((_, i) => 80 - i * (STROKE + GAP));

  const colors = ["#b45309", "#0f766e", "#b91c1c", "#7c3aed", "#475569"];

  return (
    <section className="relative bg-stone-900 text-amber-50 rounded-2xl overflow-hidden">
      <div aria-hidden className="absolute inset-0 opacity-30"
           style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(251,191,36,0.3), transparent 60%)" }} />
      <div className="relative grid md:grid-cols-2 gap-4 p-6 items-center">
        {/* SVG scoreboard */}
        <div className="flex justify-center">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} className="max-w-full">
            {/* outer ornamental ring */}
            <circle cx={CENTER} cy={CENTER} r="120" fill="none" stroke="#451a03" strokeWidth="2" />
            <circle cx={CENTER} cy={CENTER} r="116" fill="none" stroke="#78350f" strokeWidth="1" />

            {/* Sub rings (back) */}
            {subs.slice(0, 5).map((s, i) => {
              const r = ringRadii[i];
              const c = 2 * Math.PI * r;
              const target = c * (1 - Math.max(0, Math.min(100, s.score)) / 100);
              const fg = s.color || colors[i % colors.length];
              return (
                <g key={i}>
                  <circle cx={CENTER} cy={CENTER} r={r} fill="none" stroke="#27272a" strokeWidth={STROKE} />
                  <circle cx={CENTER} cy={CENTER} r={r} fill="none"
                          stroke={fg} strokeWidth={STROKE} strokeLinecap="round"
                          strokeDasharray={c} strokeDashoffset={target}
                          transform={`rotate(-90 ${CENTER} ${CENTER})`} />
                </g>
              );
            })}

            {/* Center text */}
            <text x={CENTER} y={CENTER - 8} textAnchor="middle"
                  fontSize="13" fill="#fbbf24" fontWeight="700"
                  style={{ letterSpacing: "0.2em" }}>{caption}</text>
            <text x={CENTER} y={CENTER + 28} textAnchor="middle"
                  fontSize="56" fontWeight="900" fill="#fef3c7"
                  className="font-mono-data">{Math.round(overall)}</text>
            <text x={CENTER} y={CENTER + 48} textAnchor="middle"
                  fontSize="11" fill="#a8a29e" fontWeight="600">/ 100</text>

            {/* tick marks 12-clock positions */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
              const x1 = CENTER + 130 * Math.cos(angle);
              const y1 = CENTER + 130 * Math.sin(angle);
              const x2 = CENTER + 135 * Math.cos(angle);
              const y2 = CENTER + 135 * Math.sin(angle);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#92400e" strokeWidth="1.5" />;
            })}
          </svg>
        </div>

        {/* Legend / sub-scores */}
        <div>
          <div className="space-y-3 max-w-md">
            {subs.slice(0, 5).map((s, i) => {
              const fg = s.color || colors[i % colors.length];
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-sm" style={{ background: fg }} />
                      <span className="text-xs uppercase tracking-widest font-bold text-stone-300">{s.label}</span>
                    </div>
                    <span className="text-sm font-bold font-mono-data" style={{ color: fg }}>{Math.round(s.score)}</span>
                  </div>
                  <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full" style={{
                      width: `${Math.max(0, Math.min(100, s.score))}%`,
                      background: fg,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed mt-4 max-w-md">
            Composite trust index. Weighted blend of registered capital tier, business longevity, review strength, active verifications, and site-evidence completeness.
          </p>
        </div>
      </div>
    </section>
  );
}
