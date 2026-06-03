// Industry radar — this supplier vs same-TSIC industry average.
// Pure SVG, no deps. Two layered polygons.

type Axis = {
  label: string;       // 짧게 ("Capital", "Years", ...)
  supplier: number;    // 0-100
  industry: number;    // 0-100
};

type Props = {
  axes: Axis[];        // 5개 권장
  title?: string;
  tsicLabel?: string;  // e.g. "TSIC 26200 · Electronics"
};

const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = 100;
const PADDING = 18;

function point(angleRad: number, value0to100: number): [number, number] {
  const r = RADIUS * (value0to100 / 100);
  return [CENTER + r * Math.cos(angleRad), CENTER + r * Math.sin(angleRad)];
}

export function IndustryRadar({ axes, title, tsicLabel }: Props) {
  if (axes.length < 3) return null;
  const n = axes.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  // grid rings (25, 50, 75, 100)
  const rings = [25, 50, 75, 100];

  const supplierPoly = axes
    .map((a, i) => point(startAngle + i * angleStep, a.supplier).join(","))
    .join(" ");
  const industryPoly = axes
    .map((a, i) => point(startAngle + i * angleStep, a.industry).join(","))
    .join(" ");

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5">
      {title && (
        <div className="mb-3">
          <h3 className="text-base font-bold text-stone-900">{title}</h3>
          {tsicLabel && <p className="text-xs text-stone-500 font-mono-data mt-0.5">{tsicLabel}</p>}
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center gap-4">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE} className="shrink-0 max-w-full">
          {/* grid rings */}
          {rings.map((pct) => {
            const poly = axes
              .map((_, i) => point(startAngle + i * angleStep, pct).join(","))
              .join(" ");
            return <polygon key={pct} points={poly} fill="none" stroke="#e7e5e4" strokeWidth="1" />;
          })}
          {/* spokes */}
          {axes.map((_, i) => {
            const [x, y] = point(startAngle + i * angleStep, 100);
            return <line key={i} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="#e7e5e4" strokeWidth="1" />;
          })}
          {/* industry polygon (back) */}
          <polygon points={industryPoly} fill="#78716c" fillOpacity="0.15" stroke="#78716c" strokeWidth="1.5" strokeDasharray="4 3" />
          {/* supplier polygon (front, gold) */}
          <polygon points={supplierPoly} fill="#b45309" fillOpacity="0.25" stroke="#b45309" strokeWidth="2.5" />
          {/* axis labels */}
          {axes.map((a, i) => {
            const angle = startAngle + i * angleStep;
            const labelR = RADIUS + 14;
            const lx = CENTER + labelR * Math.cos(angle);
            const ly = CENTER + labelR * Math.sin(angle);
            const align = Math.cos(angle) > 0.3 ? "start" : Math.cos(angle) < -0.3 ? "end" : "middle";
            return (
              <text key={i} x={lx} y={ly} textAnchor={align} dominantBaseline="middle"
                    fontSize="11" fontWeight="700" fill="#44403c">
                {a.label}
              </text>
            );
          })}
          {/* supplier points */}
          {axes.map((a, i) => {
            const [x, y] = point(startAngle + i * angleStep, a.supplier);
            return <circle key={i} cx={x} cy={y} r="3.5" fill="#b45309" stroke="white" strokeWidth="1.5" />;
          })}
        </svg>

        <div className="flex flex-col gap-3 text-xs min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-3 rounded-sm" style={{ background: "#b45309" }} />
            <span className="font-bold text-stone-900">This supplier</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-3 rounded-sm" style={{ background: "#78716c", opacity: 0.4 }} />
            <span className="text-stone-700">Industry average</span>
          </div>
          <div className="text-[11px] text-stone-500 leading-relaxed mt-1">
            Axes scaled 0–100. 50 = at industry average for this TSIC; 100 = 2× industry average. Computed across all DBD-verified peers in the same Thai Standard Industrial Classification.
          </div>
        </div>
      </div>
    </div>
  );
}
