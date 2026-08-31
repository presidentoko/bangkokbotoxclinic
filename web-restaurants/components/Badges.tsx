// 신뢰도 / 검증 / 시간 / sponsored 배지들.

import type { Restaurant } from "@/lib/types";
import { sponsoredTier, SPONSORED_BADGE } from "@/lib/sponsored";

// Local Guide 비율 — 리뷰어가 실제로 얼마나 믿을 만한지.
//
// This used to render `50 + lgRatio * 50`, so a venue with zero Local Guides
// among its reviewers displayed "50% real" — a number with no referent, floored
// so it always looked reassuring. Publishing an invented statistic next to a
// checkmark is worse than publishing nothing. It now shows the real ratio, and
// shows nothing at all when the sample is too small to state one.
export function AIVerifiedBadge({ r, size = "sm" }: { r: Restaurant; size?: "sm" | "md" }) {
  const total = r.scraped_review_count;
  // Below this, the ratio swings wildly on a single reviewer and means nothing.
  if (total < 10) return null;
  const lg = r.local_guide_count;
  const lgPct = Math.round((lg / total) * 100);
  // A low ratio is a real finding, but it isn't a "verified" badge — say it
  // plainly rather than dressing it up with a checkmark.
  const strong = lgPct >= 40;
  const cls = size === "md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap ${cls}`}
      style={
        strong
          ? { background: "#ecfeff", color: "#155e75" }
          : { background: "#f8fafc", color: "#475569" }
      }
      title={`${lg} of the ${total} recent reviews we analysed were written by Google Local Guides — reviewers with a long, public review history.`}
    >
      <span aria-hidden>{strong ? "✓" : "·"}</span>
      {lgPct}% Local Guides
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

export function RelativeRanking({ percentile, label }: {
  percentile: number;
  label: string;
}) {
  const top = Math.max(1, Math.round(percentile));
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

// Kept here so Freshness.tsx (a client component, since it must compute
// relative time at view time rather than baking it into force-static HTML)
// can import it without pulling client-only code into this server file.
export function relativeTimeFromIso(iso: string): string {
  const then = new Date(iso).getTime();
  if (isNaN(then)) return "recently";
  const diff = Math.max(0, Date.now() - then);
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}
