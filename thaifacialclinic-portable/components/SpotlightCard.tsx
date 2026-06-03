import Link from "next/link";
import type { Clinic, Lang } from "@/lib/types";
import TrustScoreRing from "./TrustScoreRing";
import { isPaidPartner } from "@/lib/partnerCheck";

export default function SpotlightCard({ c, lang }: { c: Clinic; lang: Lang }) {
  const partner = isPaidPartner(c);

  return (
    <article className="group relative overflow-hidden rounded-[2rem] bg-[rgb(var(--bg-elev))] shadow-premium-lg ring-1" style={{ ["--tw-ring-color" as never]: "rgb(var(--border))" }}>
      <div className="grid lg:grid-cols-[1.4fr_1fr]">
        {/* Photo side */}
        <Link href={`/${lang}/clinic/${c.slug}/`} className="relative block aspect-[16/10] overflow-hidden bg-navy-900 lg:aspect-auto">
          {c.top_photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={c.top_photo_url}
              alt={c.name}
              loading="eager"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-navy-800 to-navy-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Top-left ribbon */}
          <div className="absolute left-5 top-5">
            {partner ? (
              <span className="gold-ribbon inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.77l-6.18 3.25L7 13.14 2 8.27l6.91-1.01L12 1z"/></svg>
                Verified Partner
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-navy-900 shadow-lg">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-mint-500" />
                Editor's Pick #{1}
              </span>
            )}
          </div>
        </Link>

        {/* Info side */}
        <div className="flex flex-col justify-between p-7 sm:p-10">
          <div>
            <div className="eyebrow">{c.category || "Hair Transplant Clinic"}</div>
            <h3 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tighter-display sm:text-4xl">
              {c.name}
            </h3>
            <p className="mt-2 text-sm muted">{c.address || c.city}</p>

            {c.top_review_text && (
              <blockquote className="mt-5 border-l-2 border-gold-400 pl-4 text-sm leading-relaxed italic muted line-clamp-3">
                "{c.top_review_text}"
              </blockquote>
            )}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 border-y py-5" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="flex flex-col items-center">
              <TrustScoreRing score={c.trust_score} size={56} stroke={5} showLabel={false} />
              <div className="mt-1 text-[10px] font-bold uppercase tracking-wider muted">Trust</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold tabular-nums">{(c.rating ?? 0).toFixed(1)}<span className="text-base font-medium muted">★</span></div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-wider muted">Rating</div>
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold tabular-nums">{c.review_count ?? 0}</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-wider muted">Reviews</div>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href={`/${lang}/clinic/${c.slug}/#booking`} className="btn-primary flex-1 sm:flex-none">
              {partner ? "Book consultation" : "View clinic"} →
            </Link>
            {c.website_line_id && (
              <a href={`https://line.me/R/ti/p/@${c.website_line_id}`} target="_blank" rel="nofollow noopener"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-mint-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-mint-700">
                LINE
              </a>
            )}
          </div>

          {c.procedures.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {c.procedures.slice(0, 6).map((p) => (
                <span key={p} className="rounded-md bg-navy-50 px-2 py-1 text-[11px] font-semibold text-navy-700 dark:bg-navy-800 dark:text-navy-200">
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
