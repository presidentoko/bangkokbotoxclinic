// 5-up trust gauge row — donut charts for at-a-glance credibility.
// SVG only (no chart lib). Each donut animates stroke-dashoffset on mount.

import { AnimatedCounter } from "./AnimatedCounter";

type FormatKind = "int" | "capital_thb" | "years" | "score" | "comma";

type Gauge = {
  label: string;
  sub?: string;
  score: number;
  display: string | number;
  format?: FormatKind;
  animateValue?: number;
  color?: "gold" | "red" | "emerald" | "stone";
};

type Props = {
  gauges: Gauge[];
};

const COLOR: Record<NonNullable<Gauge["color"]>, { fg: string; bg: string }> = {
  gold:    { fg: "#b45309", bg: "#fef3c7" },
  red:     { fg: "#b91c1c", bg: "#fee2e2" },
  emerald: { fg: "#047857", bg: "#d1fae5" },
  stone:   { fg: "#57534e", bg: "#f5f5f4" },
};

export function TrustGauges({ gauges }: Props) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-${gauges.length} gap-3`}>
      {gauges.map((g, i) => (
        <GaugeCard key={i} g={g} />
      ))}
    </div>
  );
}

function GaugeCard({ g }: { g: Gauge }) {
  const palette = COLOR[g.color || "gold"];
  // donut math
  const R = 38;
  const C = 2 * Math.PI * R;          // circumference
  const target = C * (1 - Math.max(0, Math.min(100, g.score)) / 100);
  const styleVars = { ["--full" as never]: `${C}`, ["--target" as never]: `${target}` } as React.CSSProperties;

  return (
    <div className="relative bg-white border border-stone-200 rounded-2xl px-4 py-4 overflow-hidden">
      {/* corner ribbon */}
      <span aria-hidden className="absolute top-0 left-0 w-2 h-full" style={{ background: palette.fg }} />

      <div className="flex items-center gap-3">
        <svg viewBox="0 0 100 100" width="84" height="84" className="shrink-0">
          {/* track */}
          <circle cx="50" cy="50" r={R} fill="none" stroke={palette.bg} strokeWidth="10" />
          {/* arc */}
          <circle
            cx="50" cy="50" r={R} fill="none"
            stroke={palette.fg} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={C}
            transform="rotate(-90 50 50)"
            className="gauge-draw"
            style={{ ...styleVars, strokeDashoffset: target }}
          />
          {/* center score */}
          <text
            x="50" y="55" textAnchor="middle"
            fontWeight="800" fontSize="22"
            fill={palette.fg}
            className="font-mono-data"
          >
            {Math.round(g.score)}
          </text>
        </svg>
        <div className="min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{g.label}</div>
          <div className="text-base md:text-lg font-bold counter-pop leading-tight mt-0.5 font-mono-data" style={{ color: palette.fg }}>
            {g.animateValue !== undefined ? (
              <AnimatedCounter value={g.animateValue} format={g.format} />
            ) : (
              <span>{g.display}</span>
            )}
          </div>
          {g.sub && <div className="text-[10px] text-stone-500 mt-0.5">{g.sub}</div>}
        </div>
      </div>
    </div>
  );
}
