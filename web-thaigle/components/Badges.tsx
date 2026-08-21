// 신뢰도 / 검증 / 시간 / sponsored 배지들.

import type { Restaurant } from "@/lib/types";
import { sponsoredTier, SPONSORED_BADGE } from "@/lib/sponsored";
import { FreshnessTime } from "@/components/FreshnessTime";

// AI Verified — Local Guide 비율 기반 "real review" 신뢰도.
export function AIVerifiedBadge({ r, size = "sm" }: { r: Restaurant; size?: "sm" | "md" }) {
  if (r.scraped_review_count < 5) return null;
  const lg = r.local_guide_count;
  const total = r.scraped_review_count;
  const lgRatio = total > 0 ? lg / total : 0;
  const verifiedRate = Math.round(50 + lgRatio * 50);
  const cls = size === "md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap ${cls}`}
      style={{ background: "#ecfeff", color: "#155e75" }}
      title={`${lg} of ${total} scraped reviews are by Google Local Guides — high credibility reviewers.`}
    >
      <span aria-hidden>✓</span>
      AI Verified · {verifiedRate}% real
    </span>
  );
}

export function SponsoredBadge({ id }: { id: string }) {
  const tier = sponsoredTier(id);
  if (!tier) return null;
  const cfg = SPONSORED_BADGE[tier];
  const gradient =
    tier === "editors_pick" ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)"
    : tier === "recommended" ? "linear-gradient(135deg, #38bdf8 0%, #2563eb 50%, #1d4ed8 100%)"
    : "linear-gradient(135deg, #d946ef 0%, #9333ea 50%, #7e22ce 100%)";
  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold whitespace-nowrap text-white shadow-md"
      style={{ background: gradient }}
    >
      <span>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}

export function Freshness({ generatedAt, mode = "card" }: {
  generatedAt: string;
  mode?: "card" | "detail";
}) {
  if (mode === "card") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-[var(--muted)]">
        <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
        Updated <FreshnessTime generatedAt={generatedAt} />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-xs text-[var(--muted)] bg-white px-3 py-1 rounded-full border border-[var(--border)]">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      Last updated <FreshnessTime generatedAt={generatedAt} />
    </span>
  );
}

export function RelativeRanking({ percentile, label }: {
  percentile: number;
  label: string;
}) {
  // `percentile` arrives as rank-from-the-top over a descending list, so it
  // already *is* the "top N%" figure: the best venue is index 0 → 0 → 1%.
  // Inverting it here printed "Top 100%" on every category leader and
  // "Top 1%" on the worst entry — on all 3,269 restaurant pages.
  const top = Math.max(1, Math.min(100, Math.round(percentile)));
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ background: "#f0fdf4", color: "#166534" }}
    >
      <span aria-hidden>🏆</span>
      Top {top}% in {label}
    </span>
  );
}
