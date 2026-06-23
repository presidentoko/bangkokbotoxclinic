// Editor's Pick / Recommended / Featured 대형 hero — 홈/카테고리 상단.

import type { Clinic } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcon";
import { sponsoredTier, SPONSORED_BADGE } from "@/lib/sponsored";
import { formatTrustScore } from "@/lib/utils";

export async function SponsoredHero({ c }: { c: Clinic }) {
  const tier = await sponsoredTier(c.id);
  if (!tier) return null;
  const cfg = SPONSORED_BADGE[tier];

  const styles = {
    editors_pick: {
      borderGradient: "from-amber-300 via-yellow-200 to-amber-400",
      bg: "from-amber-50 via-white to-yellow-50",
      badgeBg: "bg-gradient-to-r from-amber-400 to-yellow-500",
      glow: "shadow-amber-200/60",
      ribbon: "from-amber-500 to-yellow-600",
    },
    recommended: {
      borderGradient: "from-sky-300 via-blue-200 to-indigo-400",
      bg: "from-sky-50 via-white to-blue-50",
      badgeBg: "bg-gradient-to-r from-sky-500 to-blue-600",
      glow: "shadow-blue-200/50",
      ribbon: "from-sky-500 to-blue-600",
    },
    featured: {
      borderGradient: "from-fuchsia-300 via-purple-200 to-violet-400",
      bg: "from-fuchsia-50 via-white to-purple-50",
      badgeBg: "bg-gradient-to-r from-fuchsia-500 to-purple-600",
      glow: "shadow-purple-200/50",
      ribbon: "from-fuchsia-500 to-purple-600",
    },
  }[tier];

  return (
    <section className="my-8 relative">
      <div className={`relative rounded-3xl p-[2px] bg-gradient-to-r ${styles.borderGradient} shadow-xl ${styles.glow}`}>
        <div className={`relative rounded-3xl bg-gradient-to-br ${styles.bg} overflow-hidden`}>
          <div className="absolute top-0 right-0 z-10">
            <div className={`bg-gradient-to-r ${styles.ribbon} text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-md flex items-center gap-1.5`}>
              <span>{cfg.icon}</span>
              <span>{cfg.label}</span>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">
              {tier === "editors_pick" ? "Hand-picked by our editors" :
               tier === "recommended" ? "Recommended by us" :
               "Featured this week"}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight mb-2">
              {c.name}
            </h2>
            <p className="text-sm text-[var(--muted)] mb-4">
              {c.district || "Bangkok"}
              {c.primary_type && <> · {c.primary_type}</>}
            </p>

            <div className="flex items-baseline gap-4 mb-5">
              <div>
                <div className="text-3xl font-bold tabular-nums" style={{
                  color: c.trust_score >= 75 ? "#16a34a" : c.trust_score >= 60 ? "#059669" : "#ca8a04"
                }}>
                  {formatTrustScore(c.trust_score)}
                </div>
                <div className="text-[10px] uppercase text-[var(--muted)] tracking-wider">Trust</div>
              </div>
              <div className="text-yellow-700">
                <div className="text-xl font-bold">★ {c.rating.toFixed(1)}</div>
                <div className="text-[10px] text-[var(--muted)]">{c.total_reviews.toLocaleString()} reviews</div>
              </div>
            </div>

            {c.categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {c.categories.slice(0, 4).map((cat) => (
                  <span key={cat} className="bg-white/70 backdrop-blur-sm border border-[var(--border)] text-xs px-2.5 py-1 rounded-full inline-flex items-center gap-1 font-medium">
                    <CategoryIcon category={cat} size={14} />
                    {CATEGORY_LABELS[cat] ?? cat}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              <a
                href={`/clinic/${c.id}`}
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white text-sm font-bold ${styles.badgeBg} hover:opacity-90 transition shadow-md`}
              >
                View details
                <span aria-hidden>→</span>
              </a>
              <a
                href={c.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[var(--border)] text-sm font-semibold hover:border-black transition"
              >
                📍 Maps
              </a>
              {c.website && (
                <a
                  href={c.website}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[var(--border)] text-sm font-semibold hover:border-black transition"
                >
                  🌐 Site
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
