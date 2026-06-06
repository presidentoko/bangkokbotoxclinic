export default function MiniDonut({
  segments,
  size = 100,
  stroke = 14,
  centerLabel,
  centerSub,
}: {
  segments: { value: number; color: string; label: string }[];
  size?: number;
  stroke?: number;
  centerLabel?: string;
  centerSub?: string;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-4">
      <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" strokeOpacity=".1" strokeWidth={stroke} fill="none" />
          {segments.map((s, i) => {
            const len = (s.value / total) * c;
            const seg = (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={s.color}
                strokeWidth={stroke}
                fill="none"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return seg;
          })}
        </svg>
        {centerLabel && (
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <div className="text-lg font-bold tabular-nums">{centerLabel}</div>
              {centerSub && <div className="text-[9px] uppercase tracking-wider muted">{centerSub}</div>}
            </div>
          </div>
        )}
      </div>
      <div className="space-y-1 text-xs">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            <span className="muted">{s.label}</span>
            <span className="ml-auto font-semibold tabular-nums">{Math.round((s.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
