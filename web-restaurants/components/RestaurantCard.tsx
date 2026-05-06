import type { Restaurant } from "@/lib/types";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import { TrustBadge } from "./TrustBadge";
import { SponsoredBadge, AIVerifiedBadge } from "./Badges";
import { sponsoredTier } from "@/lib/sponsored";

export function RestaurantCard({ r, rank }: { r: Restaurant; rank?: number }) {
  const trend = r.rating_trend.trend;
  const trending = trend === "improving";
  const tier = sponsoredTier(r.id);

  const ringClass =
    tier === "editors_pick" ? "ring-2 ring-amber-300 shadow-amber-100"
    : tier === "recommended" ? "ring-2 ring-blue-300 shadow-blue-100"
    : "";

  return (
    <div
      className={`group block border border-[var(--border)] rounded-xl bg-white hover:shadow-md hover:border-gray-300 transition relative overflow-hidden ${ringClass}`}
    >
      {tier && (
        <div className="absolute top-3 right-3 z-10">
          <SponsoredBadge id={r.id} />
        </div>
      )}

      <a href={`/restaurant/${r.id}`} className="block p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-1 flex-wrap">
              {rank !== undefined && (
                <span className="font-bold text-[var(--fg)] tabular-nums">#{rank}</span>
              )}
              {r.district && (
                <span className="flex items-center gap-1">
                  <span aria-hidden>📍</span>
                  {r.district}
                </span>
              )}
              {r.city_label && (
                <span className="text-[var(--muted)]">{r.city_label}</span>
              )}
              {r.business_status === "Open" && (
                <span className="flex items-center gap-1 text-green-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Open
                </span>
              )}
              {trending && (
                <span className="flex items-center gap-0.5 text-green-700 font-medium">
                  ↗ Trending
                </span>
              )}
              {r.price_symbol && (
                <span className="text-[var(--muted)]">{r.price_symbol}</span>
              )}
            </div>
            <h3 className="font-semibold text-base group-hover:text-[var(--accent)] transition truncate">
              {r.name}
            </h3>
            <p className="text-sm text-[var(--muted)] truncate mt-0.5">
              {r.primary_type}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="bg-yellow-50 text-yellow-900 px-2.5 py-1 rounded-md text-sm font-bold whitespace-nowrap">
              ★ {r.rating.toFixed(1)}
            </div>
            <div className="text-xs text-[var(--muted)] mt-1 tabular-nums">
              {r.total_reviews.toLocaleString()} reviews
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
          <TrustBadge score={r.trust_score} size="md" />
          <div className="flex flex-wrap gap-1.5 text-xs justify-end items-center">
            <AIVerifiedBadge r={r} size="sm" />
            {r.cuisines.slice(0, 3).map((c) => (
              <span key={c} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-medium">
                <span aria-hidden>{CUISINE_ICONS[c] ?? "🍴"}</span>
                {CUISINE_LABELS[c] ?? c}
              </span>
            ))}
          </div>
        </div>
      </a>

      <div className="px-5 pb-4 flex gap-2">
        <a
          href={`/restaurant/${r.id}`}
          className="flex-1 text-center py-2 px-3 rounded-lg bg-black text-white text-xs font-bold hover:bg-gray-800 transition"
        >
          View details →
        </a>
        <a
          href={r.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-3 rounded-lg bg-white border border-[var(--border)] text-xs font-bold hover:border-black transition flex items-center"
          title="View on Google Maps"
          aria-label="View on Google Maps"
        >
          📍
        </a>
        {r.phone && (
          <a
            href={`tel:${r.phone.replace(/[^+\d]/g, "")}`}
            className="py-2 px-3 rounded-lg bg-white border border-[var(--border)] text-xs font-bold hover:border-black transition flex items-center"
            title={`Call ${r.phone}`}
            aria-label="Call restaurant"
          >
            📞
          </a>
        )}
        {r.menu_url && (
          <a
            href={r.menu_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="py-2 px-3 rounded-lg bg-white border border-[var(--border)] text-xs font-bold hover:border-black transition flex items-center"
            title="Menu"
            aria-label="Menu"
          >
            📋
          </a>
        )}
      </div>
    </div>
  );
}
