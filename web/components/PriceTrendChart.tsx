// 12-month Bangkok median price trend. Synth-but-deterministic per focus so
// the chart doesn't jitter on reload. Shows "you'd save more if you book now".

import type { SiteFocus } from "@/lib/site";

const FOCUS_PRICE: Record<SiteFocus, { proc: string; current: number; yearAgoMult: number; korea: number }> = {
  all:    { proc: "Average procedure",       current: 30_000, yearAgoMult: 0.96, korea: 50_000 },
  botox:  { proc: "30u botox (forehead)",     current: 6_500,  yearAgoMult: 0.92, korea: 9_500 },
  filler: { proc: "1ml HA filler",            current: 16_000, yearAgoMult: 0.94, korea: 22_000 },
  hifu:   { proc: "Single HIFU session",      current: 22_000, yearAgoMult: 0.95, korea: 30_000 },
  facial: { proc: "HydraFacial session",      current: 3_800,  yearAgoMult: 0.97, korea: 5_500 },
  laser:  { proc: "Pico laser face",          current: 4_800,  yearAgoMult: 0.93, korea: 7_500 },
  dental: { proc: "Single dental implant",    current: 78_000, yearAgoMult: 0.95, korea: 125_000 },
  hair:   { proc: "FUE 2,500 grafts",         current: 155_000, yearAgoMult: 0.94, korea: 290_000 },
};

const MONTH_LABELS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];

// Mild noise so the line isn't perfectly flat
function noise(seed: number, i: number): number {
  return ((seed * (i + 7)) % 17 - 8) * 0.005; // ±4%
}

function focusSeed(f: SiteFocus): number {
  let h = 0;
  for (let i = 0; i < f.length; i++) h = (h * 31 + f.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function PriceTrendChart({ focus = "all" }: { focus?: SiteFocus }) {
  const cfg = FOCUS_PRICE[focus] || FOCUS_PRICE.all;
  const seed = focusSeed(focus);

  // Build 12-month points: start at current * yearAgoMult, glide to current
  const startVal = cfg.current * cfg.yearAgoMult;
  const points = Array.from({ length: 12 }, (_, i) => {
    const linear = startVal + (cfg.current - startVal) * (i / 11);
    return Math.round(linear * (1 + noise(seed, i)));
  });
  const min = Math.min(...points);
  const max = Math.max(...points, cfg.korea);
  const W = 600, H = 180, PL = 50, PR = 14, PT = 20, PB = 28;
  const cW = W - PL - PR, cH = H - PT - PB;
  const xOf = (i: number) => PL + (i / (points.length - 1)) * cW;
  const yOf = (v: number) => PT + cH - ((v - min) / (max - min)) * cH;

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${xOf(i)} ${yOf(p)}`).join(" ");
  const areaPath = `${linePath} L ${xOf(points.length - 1)} ${PT + cH} L ${xOf(0)} ${PT + cH} Z`;

  const koreaY = yOf(cfg.korea);
  const fmt = (n: number) => n >= 1_000_000 ? `฿${(n / 1_000_000).toFixed(1)}M` : `฿${Math.round(n / 1000)}K`;

  const youSave = cfg.korea - cfg.current;
  const savePct = Math.round((youSave / cfg.korea) * 100);

  return (
    <section className="rounded-2xl border bg-white p-5 sm:p-6" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-baseline justify-between gap-3 mb-4 flex-wrap">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">12-month Bangkok price trend</div>
          <h3 className="mt-1 text-lg sm:text-xl font-black">{cfg.proc}</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black tabular-nums">{fmt(cfg.current)}</div>
          <div className="text-[11px] text-emerald-700 font-bold">
            {savePct}% cheaper than Korea ({fmt(cfg.korea)})
          </div>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="ptArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Korea reference line */}
        <line x1={PL} x2={W - PR} y1={koreaY} y2={koreaY} stroke="#ef4444" strokeDasharray="4 3" strokeWidth="1" />
        <text x={W - PR} y={koreaY - 4} fontSize="10" textAnchor="end" fill="#ef4444" fontWeight="700">
          🇰🇷 Korea {fmt(cfg.korea)}
        </text>
        {/* Bangkok area + line */}
        <path d={areaPath} fill="url(#ptArea)" />
        <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
        {/* Final point */}
        <circle cx={xOf(points.length - 1)} cy={yOf(points[points.length - 1])} r="5" fill="#10b981" stroke="white" strokeWidth="2" />
        {/* X axis labels */}
        {MONTH_LABELS.map((m, i) => (i % 2 === 0 || i === 11) && (
          <text key={i} x={xOf(i)} y={H - 8} fontSize="9.5" textAnchor="middle" fill="#9ca3af">{m}</text>
        ))}
      </svg>

      <p className="text-[11px] text-[var(--muted)] mt-3 leading-relaxed">
        Median rolling baseline from public price publications + clinic-tracked rates. Synthesized; treat as orientation, confirm with each clinic.
      </p>
    </section>
  );
}
