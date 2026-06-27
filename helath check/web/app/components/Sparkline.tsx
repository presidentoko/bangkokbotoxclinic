// Inline SVG sparkline for price history.
// prices: array of float values from oldest to newest.
export function Sparkline({ prices, width = 72, height = 24 }: { prices: number[]; width?: number; height?: number }) {
  if (prices.length < 2) return null;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const step = width / (prices.length - 1);
  const pts = prices.map((p, i) => {
    const x = i * step;
    const y = height - ((p - min) / range) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const last = prices[prices.length - 1];
  const first = prices[0];
  const trend = last < first ? "down" : last > first ? "up" : "flat";
  const color = trend === "down" ? "#16a34a" : trend === "up" ? "#dc2626" : "#94a3b8";

  return (
    <span title={`Price history: ฿${first.toLocaleString()} → ฿${last.toLocaleString()}`} className="inline-flex items-center gap-1">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <span className="text-[10px] font-semibold" style={{ color }}>
        {trend === "down" ? "▼" : trend === "up" ? "▲" : "—"}
        {trend !== "flat" && ` ${Math.round(Math.abs((last - first) / first) * 100)}%`}
      </span>
    </span>
  );
}

export function PriceBadge({ current, previous }: { current: number; previous: number | null }) {
  if (!previous || previous === current) return null;
  const down = current < previous;
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${down ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
      {down ? "▼" : "▲"} {Math.round(Math.abs((current - previous) / previous) * 100)}%
    </span>
  );
}
