"use client";

import type { FamousVsGoodEntry } from "@/lib/famous-vs-good";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.snsstopper.com";

function trustColor(score: number): string {
  if (score >= 85) return "#16a34a";
  if (score >= 75) return "#ca8a04";
  if (score >= 60) return "#ea580c";
  return "#dc2626";
}

function gapBadge(gap: FamousVsGoodEntry["gap"]): {
  label: string;
  bg: string;
  fg: string;
} {
  switch (gap) {
    case "holds_up":
      return { label: "Hype that holds up", bg: "#dcfce7", fg: "#15803d" };
    case "big_gap":
      return { label: "Credibility gap", bg: "#fff7ed", fg: "#c2410c" };
    case "decent":
      return { label: "Decent score", bg: "#fef9c3", fg: "#854d0e" };
    default:
      return { label: "Unmatched", bg: "#f3f4f6", fg: "#6b7280" };
  }
}

export function ComparisonCard({
  entry,
  rank,
}: {
  entry: FamousVsGoodEntry;
  rank: number;
}) {
  const { seed, restaurant, localGuideRatio, gap } = entry;
  if (!restaurant) return null;

  const badge = gapBadge(gap);
  const lgPct =
    localGuideRatio !== null ? Math.round(localGuideRatio * 100) : null;

  return (
    <article
      className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      aria-label={`Comparison card for ${restaurant.name}`}
    >
      {/* Rank + gap badge header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-[var(--border)] bg-[var(--bg)]">
        <span className="text-xs font-semibold text-[var(--muted)] tabular-nums">
          #{rank}
        </span>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ background: badge.bg, color: badge.fg }}
        >
          {badge.label}
        </span>
      </div>

      <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-0">
        {/* LEFT — Social side */}
        <div className="p-4 space-y-2">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)] mb-1">
            Social buzz
          </div>
          <h3 className="font-bold text-base leading-snug">{restaurant.name}</h3>
          {restaurant.district && (
            <p className="text-xs text-[var(--muted)]">
              📍 {restaurant.district}
            </p>
          )}
          <div className="mt-2 space-y-1">
            <span className="inline-flex items-center gap-1.5 bg-pink-50 text-pink-800 px-2.5 py-1 rounded-full text-xs font-medium">
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              {seed.ig_signal ?? "Frequently tagged on social"}
            </span>
            {seed.tag_count !== null && (
              <p className="text-xs text-[var(--muted)] pl-1">
                {seed.tag_count.toLocaleString()} tagged posts
              </p>
            )}
          </div>
        </div>

        {/* CENTER divider — visible on sm+ */}
        <div className="hidden sm:flex flex-col items-center justify-center px-2 py-4">
          <div className="w-px flex-1 bg-[var(--border)]" />
          <span
            className="my-2 text-xs font-bold px-2 py-1 rounded-full border"
            style={{ borderColor: badge.fg, color: badge.fg }}
          >
            vs
          </span>
          <div className="w-px flex-1 bg-[var(--border)]" />
        </div>

        {/* RIGHT — Verified side */}
        <div className="p-4 space-y-2 sm:border-l-0 border-t sm:border-t-0 border-[var(--border)]">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)] mb-1">
            Verified data
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-3xl font-black tabular-nums leading-none"
              style={{ color: trustColor(restaurant.trust_score) }}
            >
              {Math.round(restaurant.trust_score)}
            </span>
            <span className="text-xs text-[var(--muted)] font-medium">
              Trust Score
            </span>
          </div>
          <div className="space-y-0.5 text-xs text-[var(--muted)]">
            <p>
              <span className="font-semibold text-[var(--fg)]">
                {restaurant.total_reviews.toLocaleString()}
              </span>{" "}
              Google reviews
            </p>
            <p>
              ★{" "}
              <span className="font-semibold text-[var(--fg)]">
                {restaurant.rating.toFixed(1)}
              </span>{" "}
              avg rating
            </p>
            {lgPct !== null && (
              <p>
                <span className="font-semibold text-[var(--fg)]">{lgPct}%</span>{" "}
                Local Guide reviewers
              </p>
            )}
          </div>
          <p className="text-[10px] text-[var(--muted)] pt-1">Verified Google reviews</p>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-[var(--border)] bg-[var(--bg)] flex-wrap">
        <a
          href={`/restaurant/${restaurant.id}`}
          className="flex-1 min-w-[120px] text-center text-xs font-bold bg-[#ea580c] text-white px-3 py-2 rounded-lg hover:opacity-90 transition"
        >
          View full data →
        </a>
        <a
          href={restaurant.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[120px] text-center text-xs font-medium border border-[var(--border)] bg-white px-3 py-2 rounded-lg hover:border-gray-400 transition"
        >
          Google Maps ↗
        </a>
      </div>
    </article>
  );
}
