import { Month, monthLabel, usd } from '@/lib/value'

/**
 * Server-rendered SVG, no chart library: the numbers have to be in the HTML a
 * crawler fetches, and a client-side chart ships them as a JS payload instead.
 * Every point also appears in the table under the chart.
 */
export function MonthlyChart({ months, retail, locale }: { months: Month[]; retail?: number | null; locale: string }) {
  const pts = months.filter(m => m.median != null) as (Month & { median: number })[]
  if (pts.length < 2) return null
  const W = 640, H = 220, L = 56, R = 16, T = 16, B = 32
  const vals = pts.map(p => p.median)
  const showRetail = retail != null && retail < Math.max(...vals) * 2.5
  let lo = Math.min(...vals), hi = Math.max(...vals, showRetail ? retail! : -Infinity)
  const pad = (hi - lo) * 0.15 || hi * 0.1
  lo = Math.max(0, lo - pad); hi = hi + pad
  const x = (i: number) => L + (i * (W - L - R)) / (pts.length - 1)
  const y = (v: number) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B)
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.median).toFixed(1)}`).join(' ')
  const ticks = [lo, (lo + hi) / 2, hi]
  return (
    <figure className="my-6">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img"
        aria-label={locale === 'th' ? 'ราคาขายกลางรายเดือน' : 'Monthly median sold price'}>
        {ticks.map(t => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="#E8E2D9" strokeWidth="1" />
            <text x={L - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#6B6052">{usd(Math.round(t))}</text>
          </g>
        ))}
        {showRetail && (
          <g>
            <line x1={L} x2={W - R} y1={y(retail!)} y2={y(retail!)} stroke="#B08D57" strokeDasharray="4 4" strokeWidth="1.5" />
            <text x={W - R} y={y(retail!) - 6} textAnchor="end" fontSize="11" fill="#8A6A3A">
              {locale === 'th' ? 'ราคาป้าย' : 'Retail'} {usd(retail!)}
            </text>
          </g>
        )}
        <path d={path} fill="none" stroke="#1A1A1A" strokeWidth="2" />
        {pts.map((p, i) => (
          <g key={p.month}>
            <circle cx={x(i)} cy={y(p.median)} r="3.5" fill="#1A1A1A" />
            <text x={x(i)} y={H - 10} textAnchor="middle" fontSize="11" fill="#6B6052">{monthLabel(p.month, locale)}</text>
          </g>
        ))}
      </svg>
    </figure>
  )
}

/** Horizontal bars: median by condition, as a share of retail when known. */
export function GradeBars({ rows, retail }: {
  rows: { label: string; median: number; n: number }[]
  retail?: number | null
}) {
  if (rows.length === 0) return null
  const max = Math.max(...rows.map(r => r.median), retail ?? 0)
  return (
    <div className="space-y-3 my-4">
      {rows.map(r => (
        <div key={r.label}>
          <div className="flex justify-between text-sm mb-1">
            <span>{r.label} <span className="text-[#6B6052]">· n={r.n}</span></span>
            <span className="font-medium">
              {usd(r.median)}
              {retail ? <span className="text-[#6B6052]"> · {Math.round((r.median / retail) * 100)}%</span> : null}
            </span>
          </div>
          <div className="h-2 bg-[#F0EBE3] rounded">
            <div className="h-2 bg-[#1A1A1A] rounded" style={{ width: `${(r.median / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function StatTile({ label, value, note }: { label: string; value: string; note?: React.ReactNode }) {
  return (
    <div className="border border-[#E8E2D9] rounded-lg p-4 bg-white">
      <div className="text-xs uppercase tracking-wider text-[#6B6052]">{label}</div>
      <div className="text-2xl font-serif mt-1" style={{ fontFamily: 'var(--font-playfair)' }}>{value}</div>
      {note ? <div className="text-xs text-[#6B6052] mt-1">{note}</div> : null}
    </div>
  )
}
