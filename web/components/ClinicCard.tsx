import type { Clinic } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

export function ClinicCard({ clinic, rank }: { clinic: Clinic; rank?: number }) {
  const trend = clinic.rating_trend.trend;
  const trendBadge =
    trend === "improving" ? { text: "Trending up", color: "text-green-700 bg-green-50" }
    : trend === "declining" ? { text: "Declining", color: "text-orange-700 bg-orange-50" }
    : null;

  return (
    <a
      href={`/clinic/${clinic.id}`}
      className="block border border-[var(--border)] rounded-xl p-5 bg-white hover:shadow-md transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)] mb-1">
            {rank !== undefined && <span className="font-medium text-[var(--fg)]">#{rank}</span>}
            {clinic.district && <span>{clinic.district}</span>}
            {clinic.business_status && (
              <span className={clinic.business_status === "Open" ? "text-green-700" : "text-orange-700"}>
                {clinic.business_status}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-base truncate">{clinic.name}</h3>
          <p className="text-sm text-[var(--muted)] truncate mt-0.5">
            {clinic.primary_type}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="bg-yellow-50 text-yellow-900 px-2.5 py-1 rounded-md text-sm font-semibold whitespace-nowrap">
            ★ {clinic.rating.toFixed(1)}
          </div>
          <div className="text-xs text-[var(--muted)] mt-1">
            {clinic.total_reviews.toLocaleString()} reviews
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
        <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded-full">
          Trust {clinic.trust_score}
        </span>
        {clinic.local_guide_count > 0 && (
          <span className="bg-purple-50 text-purple-800 px-2 py-0.5 rounded-full">
            {clinic.local_guide_count} Local Guides
          </span>
        )}
        {trendBadge && (
          <span className={`px-2 py-0.5 rounded-full ${trendBadge.color}`}>
            {trendBadge.text}
          </span>
        )}
        {clinic.categories.slice(0, 3).map((c) => (
          <span key={c} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
            {CATEGORY_LABELS[c] ?? c}
          </span>
        ))}
      </div>
    </a>
  );
}
