// Multi-platform review footprint — shows clinic's total review count split by source.
// Extracted from DashboardView for testability and reuse.

import type { Clinic } from "@/lib/types";
import { Card } from "./parts";

const PLATFORM_META: Record<string, { label: string; color: string; emoji: string }> = {
  google:      { label: "Google",      color: "#4285f4", emoji: "🅖" },
  tripadvisor: { label: "TripAdvisor", color: "#00aa6c", emoji: "🦉" },
  whatclinic:  { label: "WhatClinic",  color: "#1a9d6f", emoji: "🩺" },
  trustpilot:  { label: "Trustpilot",  color: "#00b67a", emoji: "★" },
  facebook:    { label: "Facebook",    color: "#1877f2", emoji: "f" },
  bookimed:    { label: "Bookimed",    color: "#5b6ee1", emoji: "✈" },
};

export function PlatformReputationCard({ clinic: c, isDemo = false }: { clinic: Clinic; isDemo?: boolean }) {
  const ext = c.external_reviews ?? {};
  type Row = { key: string; label: string; color: string; emoji: string; rating: number | null; count: number; url?: string; tracked: boolean; isDemo?: boolean };

  // Demo mode — inject realistic synthetic numbers for sales pitch (≈10-20% of Google volume).
  // Scaled to the actual clinic's google footprint so it looks proportional.
  const demoRow = (k: keyof typeof PLATFORM_META, ratio: number, ratingDelta = 0): Row => {
    const count = Math.round(c.total_reviews * ratio);
    return {
      key: k, ...PLATFORM_META[k],
      rating: c.rating ? Math.min(5, Math.max(3.5, c.rating + ratingDelta)) : 4.5,
      count, tracked: true, isDemo: true,
    };
  };

  const rows: Row[] = [
    { key: "google", ...PLATFORM_META.google, rating: c.rating, count: c.total_reviews, url: c.maps_url, tracked: true },
    ...(["tripadvisor", "whatclinic", "trustpilot", "facebook", "bookimed"] as const).map((k, idx) => {
      const e = ext[k];
      if (e) return {
        key: k, ...PLATFORM_META[k],
        rating: e.rating ?? null, count: e.count ?? 0, url: e.url, tracked: true,
      };
      if (isDemo) {
        const ratios = [0.06, 0.04, 0.05, 0.12, 0.08]; // demo scale per platform
        const deltas = [-0.1, 0.1, 0, -0.05, 0.05];
        return demoRow(k, ratios[idx] ?? 0.05, deltas[idx] ?? 0);
      }
      return {
        key: k, ...PLATFORM_META[k],
        rating: null, count: 0, url: undefined, tracked: false,
      };
    }),
  ];
  const totalReviews = rows.reduce((s, r) => s + r.count, 0);
  const trackedCount = rows.filter((r) => r.tracked).length;
  const maxCount = Math.max(1, ...rows.map((r) => r.count));

  return (
    <Card>
      <div className="flex items-baseline justify-between gap-3 mb-1 flex-wrap">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span>🌐</span> Multi-platform reputation
        </h2>
        <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-blue-100 text-blue-800">
          {trackedCount}/6 tracked
        </span>
      </div>
      <p className="text-xs text-[var(--muted)] mb-3">
        Your total review footprint across all platforms patients use.
      </p>
      <div className="text-3xl md:text-4xl font-black tabular-nums mb-1">
        {totalReviews.toLocaleString()}
        <span className="text-sm font-normal text-[var(--muted)] ml-2">total reviews</span>
      </div>
      <div className="space-y-2 mt-4">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: r.color }}>
              {r.emoji}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="font-medium truncate">{r.label}</span>
                <span className="tabular-nums whitespace-nowrap">
                  {r.tracked ? (
                    <>
                      {r.rating !== null && <span className="text-yellow-700 mr-2">★{r.rating.toFixed(1)}</span>}
                      <strong>{r.count.toLocaleString()}</strong>
                      {r.isDemo && <span className="ml-1 text-[9px] text-amber-700 font-bold">(sample)</span>}
                    </>
                  ) : (
                    <span className="text-[var(--muted)] text-xs">— not tracked</span>
                  )}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 mt-1 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(r.count / maxCount) * 100}%`, background: r.tracked ? r.color : "#e5e5e5" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs text-[var(--muted)]">
          Auto-aggregated weekly. New platforms added quarterly.
        </span>
        <button className="text-xs font-bold px-3 py-2 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-50">
          + Connect platform
        </button>
      </div>
    </Card>
  );
}
