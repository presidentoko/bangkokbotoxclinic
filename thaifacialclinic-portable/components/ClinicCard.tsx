"use client";
import Link from "next/link";
import type { Clinic, Lang } from "@/lib/types";
import TrustScoreRing from "./TrustScoreRing";
import { showAffiliateLink, isPaidPartner } from "@/lib/partnerCheck";
import { useCompare } from "./CompareContext";

export default function ClinicCard({ c, lang }: { c: Clinic; lang: Lang }) {
  const partner = isPaidPartner(c);
  const trustTier = c.trust_score >= 70 ? "high" : c.trust_score >= 45 ? "mid" : "low";
  const { isSelected, toggle, canAdd } = useCompare();
  const selected = isSelected(c.id);

  return (
    <article className={`group relative flex flex-col overflow-hidden card card-hover ${partner ? "ring-2 ring-gold-400/40" : ""}`}>
      {/* Photo area */}
      <Link href={`/${lang}/clinic/${c.slug}/`} className="relative block aspect-[16/10] w-full overflow-hidden bg-navy-900">
        {c.top_photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.top_photo_url}
            alt={c.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-navy-800 to-navy-950">
            <svg width="56" height="56" viewBox="0 0 24 24" className="text-navy-600" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        )}
        {/* Photo overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        {/* Top-left badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {partner && (
            <span className="gold-ribbon inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-md">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.77l-6.18 3.25L7 13.14 2 8.27l6.91-1.01L12 1z"/></svg>
              Verified Partner
            </span>
          )}
          {c.is_suspected_viral && (
            <span className="rounded-full bg-red-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">
              ⚠ Viral-flagged
            </span>
          )}
        </div>

        {/* Top-right trust ring */}
        <div className="absolute right-3 top-3 grid h-14 w-14 place-items-center rounded-full bg-white/95 shadow-lg backdrop-blur">
          <TrustScoreRing score={c.trust_score} size={50} stroke={4} showLabel={false} />
        </div>
        {/* Compare checkbox */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(c.id); }}
          disabled={!selected && !canAdd}
          className={`absolute bottom-3 right-3 grid h-9 px-3 place-items-center rounded-full text-[11px] font-bold transition shadow-lg ${
            selected
              ? "bg-gold-500 text-navy-950"
              : "bg-white/95 text-navy-900 hover:bg-white disabled:opacity-50"
          }`}
          aria-pressed={selected}
        >
          {selected ? "✓ Comparing" : "+ Compare"}
        </button>

        {/* Bottom: title overlaid */}
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3 className="font-display text-lg font-bold leading-tight tracking-tight line-clamp-2">
            {c.name}
          </h3>
          <div className="mt-1 flex items-baseline justify-between gap-2">
            <p className="text-xs font-medium text-white/85 truncate">
              {c.city}{c.category && <> · {c.category}</>}
            </p>
            {c.bookimed_price_from && !["", "nan"].includes(String(c.bookimed_price_from)) && (
              <span className="shrink-0 rounded-md bg-gold-500/95 px-2 py-0.5 text-[11px] font-bold text-navy-950">
                from {c.bookimed_price_from}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className={`text-base font-bold tabular-nums ${trustTier === "high" ? "text-mint-700" : trustTier === "mid" ? "text-gold-700" : "text-[rgb(var(--fg))]"}`}>
              {c.trust_score}
            </div>
            <div className="text-[9px] font-bold uppercase tracking-wider muted">Trust</div>
          </div>
          <div className="border-x" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="text-base font-bold tabular-nums">
              {c.rating !== null ? c.rating.toFixed(1) : "—"}
            </div>
            <div className="text-[9px] font-bold uppercase tracking-wider muted">Rating</div>
          </div>
          <div>
            <div className="text-base font-bold tabular-nums">
              {c.review_count ?? 0}
            </div>
            <div className="text-[9px] font-bold uppercase tracking-wider muted">Reviews</div>
          </div>
        </div>

        {/* Top review snippet */}
        {c.top_review_text && (
          <p className="line-clamp-2 text-[13px] leading-relaxed muted italic">
            "{c.top_review_text}"
          </p>
        )}

        {/* Procedure pills */}
        {c.procedures.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {c.procedures.slice(0, 4).map((p) => (
              <span key={p} className="rounded-md bg-navy-50 px-1.5 py-0.5 text-[10px] font-semibold text-navy-700 dark:bg-navy-800 dark:text-navy-200">
                {p}
              </span>
            ))}
          </div>
        )}

        {/* CTA row */}
        <div className="mt-auto flex gap-2 pt-2">
          <Link
            href={`/${lang}/clinic/${c.slug}/#booking`}
            className="flex-1 rounded-lg bg-navy-900 px-3 py-2 text-center text-xs font-bold text-white transition hover:bg-navy-800 dark:bg-white dark:text-navy-900 dark:hover:bg-navy-100"
          >
            {partner ? "Book now →" : "View clinic →"}
          </Link>
          {c.website_line_id && (
            <a
              href={`https://line.me/R/ti/p/@${c.website_line_id}`}
              target="_blank"
              rel="nofollow noopener"
              className="inline-flex items-center gap-1 rounded-lg bg-mint-100 px-3 py-2 text-xs font-bold text-mint-700 transition hover:bg-mint-200"
            >
              LINE
            </a>
          )}
          {c.bookimed_url && showAffiliateLink(c) && (
            <a
              href={c.bookimed_url}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold transition hover:bg-[rgb(var(--bg))]"
              style={{ borderColor: "rgb(var(--border))" }}
            >
              Quote ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
