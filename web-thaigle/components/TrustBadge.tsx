// Note: this started as a copy of shared/components/TrustBadge.tsx, but
// web-thaigle was never added to scripts/sync_shared.py's target list
// (web/, web-restaurants/, web-golf/ only) — this copy has already
// diverged (thresholds unified with TrustScoreBadge below) and edits here
// are web-thaigle-local. shared/components/TrustBadge.tsx is a different,
// still-live source for the other three sites — don't edit it for this.

// Trust Score 시각화 — 0-100 그라데이션 바 + 숫자.

import { trustColor, trustTierShort } from "@/lib/trust";

export function TrustBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const pct = Math.max(0, Math.min(100, score));
  const tier = trustTierShort(pct);
  const color = trustColor(pct);

  if (size === "sm") {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
        style={{ background: `${color}15`, color }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: color }}
        />
        {pct.toFixed(0)}
      </span>
    );
  }

  return (
    <div className="inline-flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-[var(--muted)]">Trust Score</span>
        <span className="font-bold tabular-nums" style={{ color }}>
          {pct.toFixed(0)}
        </span>
        <span className="text-xs font-medium" style={{ color }}>
          {tier}
        </span>
      </div>
      <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function TrustDonut({ score, breakdown }: {
  score: number;
  breakdown?: { label: string; value: number; max: number; color: string }[];
}) {
  const pct = Math.max(0, Math.min(100, score));
  const tier = trustTierShort(pct);
  const color = trustColor(pct);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-5">
      <div className="flex items-center gap-5">
        <svg width="120" height="120" className="shrink-0 -rotate-90">
          <circle cx="60" cy="60" r={radius} stroke="#f3f4f6" strokeWidth="10" fill="none" />
          <circle
            cx="60" cy="60" r={radius}
            stroke={color} strokeWidth="10" fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
          <text
            x="60" y="60" textAnchor="middle" dominantBaseline="central"
            fill={color} fontWeight="700" fontSize="28"
            transform="rotate(90 60 60)"
            className="tabular-nums"
          >
            {pct.toFixed(0)}
          </text>
        </svg>
        <div className="flex-1 min-w-0">
          <div className="text-xs uppercase tracking-wide text-[var(--muted)]">Trust Score</div>
          <div className="text-2xl font-bold" style={{ color }}>{tier}</div>
          {breakdown && (
            <div className="mt-3 space-y-1.5">
              {breakdown.map((b) => (
                <div key={b.label} className="text-xs flex items-center gap-2">
                  <span className="w-20 text-[var(--muted)]">{b.label}</span>
                  <div className="flex-1 h-1 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(b.value / b.max) * 100}%`, background: b.color }}
                    />
                  </div>
                  <span className="tabular-nums w-8 text-right font-medium">{b.value.toFixed(0)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
