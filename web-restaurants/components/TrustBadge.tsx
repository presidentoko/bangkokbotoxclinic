// ⚠️ AUTO-GENERATED from shared/components/TrustBadge.tsx
// DO NOT edit directly — edit shared/components/TrustBadge.tsx, then run `python scripts/sync_shared.py`.

// Trust Score 시각화 — 0-100 그라데이션 바 + 숫자.

export function TrustBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const pct = Math.max(0, Math.min(100, score));
  const tier = pct >= 75 ? "Excellent" : pct >= 60 ? "Strong" : pct >= 40 ? "Fair" : "Limited";
  const color = pct >= 75 ? "#16a34a" : pct >= 60 ? "#059669" : pct >= 40 ? "#ca8a04" : "#94a3b8";

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
  const tier = pct >= 75 ? "Excellent" : pct >= 60 ? "Strong" : pct >= 40 ? "Fair" : "Limited";
  const color = pct >= 75 ? "#16a34a" : pct >= 60 ? "#059669" : pct >= 40 ? "#ca8a04" : "#94a3b8";
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
          <a href="/about/trust-score" className="text-[10px] text-[var(--muted)] hover:text-[var(--fg)] underline underline-offset-2">
            How is this calculated? →
          </a>
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
