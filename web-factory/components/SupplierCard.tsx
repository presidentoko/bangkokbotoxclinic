"use client";

// Deliberately a client component, despite only needing the client for its
// leaf buttons. Converting it to a server component was tried and measured on
// /city/chon_buri (100 cards) — it made the page 66% BIGGER:
//
//   client component: 495KB markup + 221KB RSC payload = 728KB
//   server component: 495KB markup + 700KB RSC payload = 1,208KB
//
// A client component serializes only its props into the payload (one Supplier
// object per card). A server component serializes its entire rendered element
// tree, and this card is ~40 elements deep with long Tailwind class strings —
// far heavier than the data it was built from.
//
// The payload here is still worth shrinking, but the way to do it is to pass a
// slim projection instead of the full Supplier (the card never reads
// sample_reviews_*, raw_categories, language_breakdown, mentioned_topics), not
// to move the render to the server.
import type { Supplier } from "@/lib/types";
import { isRealEstateSlug } from "@/lib/estates";
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
              sizes="(max-width: 640px) 100vw, 900px"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              // Google 이 서명해 준 사진 URL 은 만료되면 403 을 준다. 빌드 때
              // scripts/validate_photo_urls.py 가 죽은 건 걸러내지만, 빌드와 조회
              // 사이에 만료되는 것까지는 못 막는다. 그때 깨진 이미지 아이콘 대신
              // 이 div 의 회색 배경만 남게 한다.
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
            {r.verified && r.dbd?.match_score !== undefined && r.dbd.match_score >= 90 && (
              <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--gold)] text-white text-[10px] font-bold uppercase tracking-wider shadow">
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
              <h3 className="font-semibold text-base group-hover:text-[var(--gold-deep)] transition flex items-start gap-1.5">
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
              {r.estate_name && isRealEstateSlug(r.estate_slug) && (
                <a
                  href={`/estate/${r.estate_slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--gold-deep)] bg-[var(--gold-bg)] border border-[var(--gold-light)] px-2 py-0.5 rounded-full hover:bg-[var(--gold-bg)]/60 transition"
                >
                  🏘 {r.estate_name}
                </a>
              )}
            </div>
            {/* 리뷰가 없는 공급사(전체의 33%, 2,939곳)를 "★ 0.0 / 0 reviews" 로
                그리면 바이어는 "평점 0점" 으로 읽는다 — 아직 평가가 없는 것과
                최악의 평가를 받은 것은 완전히 다른 뜻이다. 상세 페이지는 이미
                "no reviews" 로 구분해서 그리고 있었고 카드만 어긋나 있었다. */}
            <div className="text-right shrink-0">
              {r.total_reviews > 0 && r.rating > 0 ? (
                <>
                  <div className="bg-yellow-50 text-yellow-900 px-2.5 py-1 rounded-md text-sm font-bold whitespace-nowrap">
                    ★ {r.rating.toFixed(1)}
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-1 tabular-nums">
                    {r.total_reviews.toLocaleString()} reviews
                  </div>
                </>
              ) : (
                <div className="bg-stone-100 text-stone-500 px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap">
                  No reviews yet
                </div>
              )}
            </div>
          </div>
        </div>
      </a>

      {/* Trust + categories — OUTSIDE the anchor so the tooltip <details> is valid */}
      <div className="px-5 pb-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <TrustBadge score={trust.overall} size="md" />
          <TrustScoreInfo subs={trust.subs} />
          <FavoriteButton id={r.id} name={r.name} cityLabel={r.city_label || ""} variant="icon" />
          {r.language_breakdown?.ko && r.language_breakdown.ko > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200" title="Has Korean reviews">KO</span>
          )}
          {r.language_breakdown?.ja && r.language_breakdown.ja > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200" title="Has Japanese reviews">JA</span>
          )}
          {r.language_breakdown?.en && r.language_breakdown.en >= 3 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-50 text-stone-600 border border-stone-200" title={`${r.language_breakdown.en} English reviews`}>EN</span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs justify-end items-center">
          <AIVerifiedBadge r={r} size="sm" />
          {r.categories.slice(0, 3).map((c) => (
            <span key={c} className="bg-[var(--gold-bg)] text-[var(--gold-deep)] px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-medium">
              <span aria-hidden>{CATEGORY_ICONS[c] ?? "🏭"}</span>
              {CATEGORY_LABELS[c] ?? c}
            </span>
          ))}
        </div>
      </div>

      {(() => {
        const reviews = r.external_reviews ?? [];
        const isLatin = (t: string) => /[a-zA-Z]/.test(t) && !/[฀-๿]/.test(t);
        const snippet =
          reviews.find((rev) => rev.text && rev.text !== "nan" && rev.text.length > 15 && isLatin(rev.text)) ??
          reviews.find((rev) => rev.text && rev.text !== "nan" && rev.text.length > 15);
        if (!snippet) return null;
        const text = snippet.text!.slice(0, 90) + (snippet.text!.length > 90 ? "…" : "");
        return (
          <div className="px-5 pb-2">
            <p className="text-xs text-stone-500 italic leading-snug line-clamp-2">
              &ldquo;{text}&rdquo;
            </p>
          </div>
        );
      })()}

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
