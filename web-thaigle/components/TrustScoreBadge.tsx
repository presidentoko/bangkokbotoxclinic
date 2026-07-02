"use client";

import { useState } from "react";

type Props = {
  score: number;
  rating?: number | null;
  reviewCount?: number | null;
  scrapedCount?: number | null;
  localGuideCount?: number | null;
  avgAuthorReviewCount?: number | null;
  size?: "sm" | "md" | "lg";
};

function clamp(v: number, max: number) { return Math.min(v, max); }

function ScoreBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--muted)]">{label}</span>
        <span className="font-bold" style={{ color }}>{value.toFixed(1)} / {max}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export function TrustScoreBadge({ score: rawScore, rating, reviewCount, scrapedCount, localGuideCount, avgAuthorReviewCount, size = "md" }: Props) {
  const [open, setOpen] = useState(false);
  const score = Math.max(0, Math.min(100, rawScore));

  const color = score >= 80 ? "#16a34a" : score >= 65 ? "#059669" : score >= 50 ? "#ca8a04" : "#dc2626";
  const label = score >= 80 ? "Highly trustworthy" : score >= 65 ? "Credible" : score >= 50 ? "Moderate — verify independently" : "Low — inspect reviews carefully";

  // Compute breakdown components
  const hasFullData = rating != null && reviewCount != null && scrapedCount != null && localGuideCount != null && avgAuthorReviewCount != null;

  const comp1 = hasFullData ? clamp((rating! / 5) * 50, 50) : null;
  const comp2 = hasFullData ? clamp(Math.log10(Math.max(reviewCount!, 1)) * 12, 40) : null;
  const lgRatio = hasFullData && scrapedCount! > 0 ? (localGuideCount! / scrapedCount!) : 0;
  const comp3 = hasFullData ? clamp(lgRatio * 20, 10) : null;
  const comp4 = hasFullData ? clamp(Math.log10(Math.max(avgAuthorReviewCount!, 1)) * 2, 5) : null;

  const sizeClass = size === "sm" ? "text-lg" : size === "lg" ? "text-4xl" : "text-2xl";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex flex-col items-center cursor-pointer group"
        aria-expanded={open}
        aria-label={`Trust Score ${score} — click to see breakdown`}
      >
        <div className={`${sizeClass} font-black group-hover:scale-105 transition`} style={{ color }}>
          {score}
        </div>
        <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mt-0.5 flex items-center gap-1">
          Trust Score
          <span className="text-orange-400 font-bold text-[9px]">?</span>
        </div>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          {/* Breakdown panel */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-72 bg-white border border-[var(--border)] rounded-2xl shadow-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-black text-sm">Trust Score breakdown</div>
              <button onClick={() => setOpen(false)} className="text-[var(--muted)] hover:text-black text-lg leading-none">×</button>
            </div>

            <div className="text-xs font-bold mb-1" style={{ color }}>{score} / 100 — {label}</div>
            <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">
              Computed from public Google Maps data. Never edited. Payment cannot change this score.
            </p>

            {hasFullData ? (
              <div className="space-y-3">
                <ScoreBar label="Rating quality (rating ÷ 5 × 50)" value={comp1!} max={50} color="#f97316" />
                <ScoreBar label={`Review volume (log₁₀ of ${reviewCount?.toLocaleString()} reviews)`} value={comp2!} max={40} color="#3b82f6" />
                <ScoreBar label={`Local Guide ratio (${Math.round(lgRatio * 100)}% of scraped reviews)`} value={comp3!} max={10} color="#8b5cf6" />
                <ScoreBar label={`Author credibility (avg ${avgAuthorReviewCount?.toFixed(0)} reviews/author)`} value={comp4!} max={5} color="#10b981" />
              </div>
            ) : (
              <div className="space-y-2 text-xs text-[var(--muted)]">
                <p>Score components: rating quality (max 50) + review volume (max 40) + local guide ratio (max 10) + author credibility (max 5).</p>
                <p>All inputs from public Google Maps data.</p>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-[var(--border)] text-[10px] text-[var(--muted)]">
              Score ≥80 = statistically trustworthy · 65–79 = credible · &lt;65 = verify independently
            </div>
          </div>
        </>
      )}
    </div>
  );
}
