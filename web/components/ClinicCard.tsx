// 클리닉 카드 — 시각 + 수익 기능 통합.

import type { Clinic } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { TrustBadge } from "./TrustBadge";
import { CategoryIcon } from "./CategoryIcon";
import { AIVerifiedBadge } from "./Badges";
import { sponsoredTier } from "@/lib/sponsored";

export async function ClinicCard({ clinic, rank }: { clinic: Clinic; rank?: number }) {
  const trend = clinic.rating_trend.trend;
  const trending = trend === "improving";
  const tier = await sponsoredTier(clinic.id);

  const tierStyles = tier === "editors_pick"
    ? { wrapper: "shadow-lg shadow-amber-200/40 ring-2 ring-amber-300", corner: "from-amber-400 to-yellow-600" }
    : tier === "recommended"
    ? { wrapper: "shadow-lg shadow-blue-200/40 ring-2 ring-sky-300", corner: "from-sky-500 to-blue-600" }
    : tier === "featured"
    ? { wrapper: "shadow-lg shadow-purple-200/40 ring-2 ring-fuchsia-300", corner: "from-fuchsia-500 to-purple-600" }
    : { wrapper: "", corner: "" };

  return (
    <div
      className={`group block border border-[var(--border)] rounded-xl bg-white hover:shadow-md hover:border-gray-300 transition relative overflow-hidden ${tierStyles.wrapper}`}
    >
      {tier && (
        <div className={`absolute top-0 right-0 z-10 bg-gradient-to-r ${tierStyles.corner} text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg shadow-md`}>
          {tier === "editors_pick" ? "★ Editor's Pick" : tier === "recommended" ? "✓ Recommended" : "◆ Featured"}
        </div>
      )}

      <a href={`/clinic/${clinic.id}`} className="block p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-1 flex-wrap">
              {rank !== undefined && (
                <span className="font-bold text-[var(--fg)] tabular-nums">#{rank}</span>
              )}
              {clinic.district && (
                <span className="flex items-center gap-1">
                  <span aria-hidden>📍</span>
                  {clinic.district}
                </span>
              )}
              {clinic.business_status === "Open" && (
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
            </div>
            <h3 className="font-semibold text-base group-hover:text-[var(--accent)] transition truncate">
              {clinic.name}
            </h3>
            <p className="text-sm text-[var(--muted)] truncate mt-0.5">
              {clinic.primary_type}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="bg-yellow-50 text-yellow-900 px-2.5 py-1 rounded-md text-sm font-bold whitespace-nowrap">
              ★ {clinic.rating.toFixed(1)}
            </div>
            <div className="text-xs text-[var(--muted)] mt-1 tabular-nums">
              {clinic.total_reviews.toLocaleString()} reviews
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
          <TrustBadge score={clinic.trust_score} size="md" />
          <div className="flex flex-wrap gap-1.5 text-xs justify-end items-center">
            <AIVerifiedBadge clinic={clinic} size="sm" />
            {clinic.local_guide_count > 0 && (
              <span className="bg-purple-50 text-purple-800 px-2 py-0.5 rounded-full font-medium">
                {clinic.local_guide_count} Local Guides
              </span>
            )}
            {clinic.categories.slice(0, 2).map((c) => (
              <span key={c} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-medium">
                <CategoryIcon category={c} size={11} />
                {CATEGORY_LABELS[c] ?? c}
              </span>
            ))}
          </div>
        </div>
      </a>

      {/* CTA strip — LINE 빠른 연결 + Maps */}
      <div className="px-5 pb-4 flex gap-2">
        <a
          href={`/clinic/${clinic.id}`}
          className="flex-1 text-center py-2 px-3 rounded-lg bg-black text-white text-xs font-bold hover:bg-gray-800 transition"
        >
          View details →
        </a>
        <a
          href={clinic.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-3 rounded-lg bg-white border border-[var(--border)] text-xs font-bold hover:border-black transition flex items-center"
          title="View on Google Maps"
          aria-label="View on Google Maps"
        >
          📍
        </a>
        {clinic.phone && (
          <a
            href={`tel:${clinic.phone.replace(/[^+\d]/g, "")}`}
            className="py-2 px-3 rounded-lg bg-white border border-[var(--border)] text-xs font-bold hover:border-black transition flex items-center"
            title={`Call ${clinic.phone}`}
            aria-label="Call clinic"
          >
            📞
          </a>
        )}
      </div>
    </div>
  );
}
