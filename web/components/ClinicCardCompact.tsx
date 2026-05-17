// ClinicCardCompact — rank 11+ list-style row (rich ClinicCard 는 top 10 만).
// 한 줄 / 모바일에선 2 줄. Trust + rating + 한 가지 highlight chip.

import type { Clinic } from "@/lib/types";
import { sponsoredTier } from "@/lib/sponsored";

const POSITIVE_TOPICS: Record<string, { label: string; emoji: string }> = {
  english_speaking:   { label: "English",     emoji: "🇬🇧" },
  korean_doctor:      { label: "Korean Dr",   emoji: "🇰🇷" },
  genuine_brand:      { label: "Genuine",     emoji: "🛡" },
  clean_facility:     { label: "Clean",       emoji: "✨" },
  friendly_staff:     { label: "Friendly",    emoji: "😊" },
  no_pain:            { label: "Gentle",      emoji: "🌿" },
  affordable:         { label: "Affordable",  emoji: "💰" },
  premium:            { label: "Premium",     emoji: "✦" },
  results_satisfied:  { label: "Results",     emoji: "✓" },
  recommend:          { label: "Recommended", emoji: "👍" },
};

function topHighlight(clinic: Clinic): { label: string; emoji: string } | null {
  for (const t of clinic.mentioned_topics ?? []) {
    const meta = POSITIVE_TOPICS[t.topic];
    if (meta) return meta;
  }
  return null;
}

export async function ClinicCardCompact({ clinic, rank }: { clinic: Clinic; rank: number }) {
  const tier = await sponsoredTier(clinic.id);
  const highlight = topHighlight(clinic);
  const trustColor =
    clinic.trust_score >= 80 ? "#059669" :
    clinic.trust_score >= 65 ? "#2563eb" :
    clinic.trust_score >= 50 ? "#d97706" : "#6b7280";
  const tierBorder = tier === "editors_pick"
    ? "ring-1 ring-amber-300"
    : tier === "recommended"
    ? "ring-1 ring-sky-300"
    : tier === "featured"
    ? "ring-1 ring-fuchsia-300"
    : "";

  return (
    <a
      href={`/clinic/${clinic.id}`}
      className={`group flex items-center gap-3 px-4 py-3 bg-white border border-[var(--border)] rounded-lg hover:shadow-sm hover:border-gray-300 transition ${tierBorder}`}
    >
      {/* Rank */}
      <span className="text-xs font-black tabular-nums text-[var(--muted)] w-9 shrink-0">#{rank}</span>

      {/* Name + district (truncate, takes remaining width) */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3 className="font-semibold text-sm group-hover:text-[var(--accent)] transition truncate max-w-full">{clinic.name}</h3>
          {tier && (
            <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
              tier === "editors_pick" ? "bg-amber-100 text-amber-800" :
              tier === "recommended" ? "bg-sky-100 text-sky-800" :
              "bg-fuchsia-100 text-fuchsia-800"
            }`}>
              {tier === "editors_pick" ? "★" : tier === "recommended" ? "✓" : "◆"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--muted)] mt-0.5 flex-wrap">
          {clinic.district && <span>📍 {clinic.district}</span>}
          {clinic.business_status === "Open" && (
            <span className="text-green-700 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-green-500" />
              Open
            </span>
          )}
          {highlight && (
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-700">
              <span>{highlight.emoji}</span>
              {highlight.label}
            </span>
          )}
        </div>
      </div>

      {/* Right cluster: rating, trust, arrow */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <div className="text-xs font-bold text-yellow-700 whitespace-nowrap">★ {clinic.rating.toFixed(1)}</div>
          <div className="text-[10px] text-[var(--muted)] tabular-nums">{clinic.total_reviews.toLocaleString()}</div>
        </div>
        <div className="text-right pl-3 border-l border-[var(--border)]">
          <div className="text-base font-black tabular-nums leading-none" style={{ color: trustColor }}>
            {clinic.trust_score}
          </div>
          <div className="text-[10px] text-[var(--muted)] uppercase tracking-widest mt-0.5">Trust</div>
        </div>
        <span className="text-[var(--muted)] group-hover:text-[var(--fg)] transition text-lg hidden sm:inline">→</span>
      </div>
    </a>
  );
}
