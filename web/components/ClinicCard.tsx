// 클리닉 카드 — 시각 강화 버전.

import type { Clinic } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { TrustBadge } from "./TrustBadge";
import { CategoryIcon } from "./CategoryIcon";
import { isSponsored } from "@/lib/sponsored";

export function ClinicCard({ clinic, rank }: { clinic: Clinic; rank?: number }) {
  const trend = clinic.rating_trend.trend;
  const trending = trend === "improving";
  const sponsored = isSponsored(clinic.id);

  return (
    <a
      href={`/clinic/${clinic.id}`}
      className="group block border border-[var(--border)] rounded-xl p-5 bg-white hover:shadow-md hover:border-gray-300 transition relative"
    >
      {sponsored && (
        <span className="absolute -top-2 left-4 bg-amber-500 text-white text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full">
          Featured
        </span>
      )}

      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-1">
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

      <div className="flex items-center justify-between gap-3 mt-3">
        <TrustBadge score={clinic.trust_score} size="md" />
        <div className="flex flex-wrap gap-1.5 text-xs justify-end">
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
  );
}
