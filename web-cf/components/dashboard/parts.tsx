// Small dashboard UI primitives — extracted from DashboardView for reuse.
// Pure presentational components, no state, no side effects.

import type { ReactNode } from "react";

export function Card({ children, accent }: { children: ReactNode; accent?: string }) {
  return (
    <div
      className="bg-white rounded-xl p-5 shadow-sm"
      style={{
        borderTop: accent ? `3px solid ${accent}` : undefined,
        border: accent ? `1px solid ${accent}30` : "1px solid var(--border)",
      }}
    >
      {children}
    </div>
  );
}

export function KPI({ label, value, sub, color, clickable, warning, href, lock }: {
  label: string; value: string; sub: string; color: string;
  clickable?: boolean; warning?: boolean; href?: string; lock?: boolean;
}) {
  const inner = (
    <div
      className={`bg-white rounded-xl p-4 border transition ${clickable ? "hover:shadow-md cursor-pointer" : ""}`}
      style={{ borderColor: warning ? `${color}80` : "var(--border)", borderWidth: warning ? 2 : 1 }}
    >
      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1 flex items-center gap-1">
        <span className="truncate">{label}</span>
        {lock && <span className="text-amber-600">🔒</span>}
      </div>
      <div className="text-2xl md:text-3xl font-black tabular-nums" style={{ color }}>{value}</div>
      <div className="text-[10px] text-[var(--muted)] mt-1 truncate">{sub}</div>
    </div>
  );
  return href ? <a href={href} className="block">{inner}</a> : inner;
}

export function ScoreLever({ label, value, max, hint, accent }: {
  label: string; value: number; max: number; hint: string; accent: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm tabular-nums">
          <span className="font-bold">{value}</span>
          <span className="text-[var(--muted)]">/{max}</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: accent }} />
      </div>
      <div className="text-xs text-[var(--muted)] mt-1">{hint}</div>
    </div>
  );
}

export function Stat({ label, value, count, tiny }: { label: string; value: string; count?: number; tiny?: boolean }) {
  return (
    <div className={tiny ? "" : "bg-white rounded-lg p-3"}>
      <div className="text-[10px] uppercase tracking-widest text-[var(--muted)]">{label}</div>
      <div className="text-lg font-black tabular-nums">{value}</div>
      {count !== undefined && <div className="text-[10px] text-[var(--muted)]">{count} reviews</div>}
    </div>
  );
}

export function RoiCell({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white/15 backdrop-blur rounded-lg p-3">
      <div className="text-[10px] uppercase tracking-widest opacity-80 mb-1 font-bold">{label}</div>
      <div className="text-xl md:text-2xl font-black tabular-nums">{value}</div>
      <div className="text-[10px] opacity-80 mt-1 truncate">{sub}</div>
    </div>
  );
}

export function LeadField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold min-w-[70px] pt-0.5">{label}</span>
      <span className="flex-1 break-words">{value}</span>
    </div>
  );
}
