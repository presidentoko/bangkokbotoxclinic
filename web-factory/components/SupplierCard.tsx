import type { Supplier } from "@/lib/types";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { TrustBadge } from "./TrustBadge";
import { AIVerifiedBadge } from "./Badges";
import { sponsoredTier } from "@/lib/sponsored";
import { verifiedTier, VERIFIED_BADGE } from "@/lib/verified";
import { photoUrl } from "@/lib/photoUrl";
import { computeTrustScore } from "@/lib/trustScore";
import { TrustScoreInfo } from "./TrustScoreInfo";
import { ShortlistButton } from "./ShortlistButton";
import { FavoriteButton } from "./FavoriteButton";

export function SupplierCard({ r, rank }: { r: Supplier; rank?: number }) {
  const tier = sponsoredTier(r.id);
  const verified = verifiedTier(r.id);
  const verifiedConf = verified ? VERIFIED_BADGE[verified] : null;
  const photo = r.hero_image;
  const trust = computeTrustScore(r);

  const tierStyles = tier === "editors_pick"
    ? { wrapper: "shadow-lg shadow-amber-200/40 ring-2 ring-amber-300", corner: "from-amber-400 to-yellow-600" }
    : tier === "recommended"
    ? { wrapper: "shadow-lg shadow-blue-200/40 ring-2 ring-sky-300", corner: "from-sky-500 to-blue-600" }
    : tier === "featured"
    ? { wrapper: "shadow-lg shadow-purple-200/40 ring-2 ring-fuchsia-300", corner: "from-fuchsia-500 to-purple-600" }
    : { wrapper: "", corner: "" };

  return (
    <div
      className={`group flex flex-col h-full border border-[var(--border)] rounded-xl bg-white hover:shadow-md hover:border-gray-300 transition relative overflow-hidden ${tierStyles.wrapper}`}
    >
      {tier && (
        <div className={`absolute top-0 right-0 z-10 bg-gradient-to-r ${tierStyles.corner} text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg shadow-md`}>
          {tier === "editors_pick" ? "★ Editor's Pick" : tier === "recommended" ? "✓ Recommended" : "◆ Featured"}
        </div>
      )}

      <a href={`/supplier/${r.id}`} className="block">
        {photo && (
          <div className="relative h-40 bg-gray-100 overflow-hidden border-b border-[var(--border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl(photo)}
              alt={r.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {r.verified && r.dbd?.match_score !== undefined && r.dbd.match_score >= 90 && (
              <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                ✓ DBD Verified
              </span>
            )}
            {r.verified && r.dbd?.match_score !== undefined && r.dbd.match_score >= 80 && r.dbd.match_score < 90 && (
              <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/95 text-white text-[10px] font-bold uppercase tracking-wider shadow"
                    title={`Likely match (${r.dbd.match_score.toFixed(0)}%)`}>
                ≈ DBD-listed
              </span>
            )}
          </div>
        )}

        <div className="p-5 pb-2">
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
              </div>
              <h3 className="font-semibold text-base group-hover:text-emerald-700 transition flex items-start gap-1.5">
                <span className="line-clamp-2">{r.name}</span>
                {verifiedConf && (
                  <span
                    title={verifiedConf.description}
                    aria-label={verifiedConf.label}
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold tabular-nums shrink-0 mt-0.5"
                    style={{ background: verifiedConf.bg, color: verifiedConf.fg }}
                  >
                    {verifiedConf.icon} {verifiedConf.shortLabel}
                  </span>
                )}
              </h3>
              <p className="text-sm text-[var(--muted)] truncate mt-0.5">
                {r.primary_type}
              </p>
              {(r.dbd?.capital_thb || r.years_in_business || r.dbd?.registered_date) && (
                <p className="text-xs text-stone-600 truncate mt-1 flex items-center gap-2 flex-wrap">
                  {r.dbd?.registered_date && <span>📅 Est. {r.dbd.registered_date.slice(0, 4)}</span>}
                  {r.years_in_business ? <span>· {r.years_in_business}y</span> : null}
                  {r.dbd?.capital_thb ? (
                    <span>· 💰 ฿{r.dbd.capital_thb >= 1_000_000 ? `${(r.dbd.capital_thb / 1_000_000).toFixed(1)}M` : `${(r.dbd.capital_thb / 1000).toFixed(0)}K`}</span>
                  ) : null}
                </p>
              )}
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
        </div>
      </a>

      {/* Trust + categories — OUTSIDE the anchor so the tooltip <details> is valid */}
      <div className="px-5 pb-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <TrustBadge score={trust.overall} size="md" />
          <TrustScoreInfo subs={trust.subs} />
          <FavoriteButton id={r.id} name={r.name} cityLabel={r.city_label || ""} variant="icon" />
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs justify-end items-center">
          <AIVerifiedBadge r={r} size="sm" />
          {r.categories.slice(0, 3).map((c) => (
            <span key={c} className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-medium">
              <span aria-hidden>{CATEGORY_ICONS[c] ?? "🏭"}</span>
              {CATEGORY_LABELS[c] ?? c}
            </span>
          ))}
        </div>
      </div>

      <div className="px-5 pb-4 flex gap-2 mt-auto">
        <a
          href={`/supplier/${r.id}`}
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
            aria-label="Call supplier"
          >
            📞
          </a>
        )}
        {r.website && (
          <a
            href={r.website}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="py-2 px-3 rounded-lg bg-white border border-[var(--border)] text-xs font-bold hover:border-black transition flex items-center"
            title={`Website: ${r.website}`}
            aria-label="Supplier website"
          >
            🌐
          </a>
        )}
        <ShortlistButton id={r.id} name={r.name} cityLabel={r.city_label} variant="icon" />
      </div>
    </div>
  );
}
