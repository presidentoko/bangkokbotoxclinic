// Editor's-pick organic Spotlight — used when no sponsored clinic is present.
// Sibling to SponsoredHero but with neutral palette (no paid gold ribbons).

import type { Clinic } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcon";
import { loadPhotos } from "@/lib/photos";

export async function SpotlightCard({ c, accent = "#0f766e" }: { c: Clinic; accent?: string }) {
  const photoSet = await loadPhotos(c.id);
  const hero = photoSet?.photos?.[0];

  return (
    <article className="my-8 group relative overflow-hidden rounded-3xl bg-white shadow-xl border border-[var(--border)]">
      <div className="grid lg:grid-cols-[1.4fr_1fr]">
        {/* Photo side */}
        <a href={`/clinic/${c.id}`} className="relative block aspect-[16/10] overflow-hidden bg-slate-100 lg:aspect-auto">
          {hero ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hero.large}
              alt={c.name}
              loading="eager"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-400" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute left-5 top-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 shadow-lg backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
              Editor&apos;s Pick #1
            </span>
          </div>
        </a>

        {/* Info side */}
        <div className="flex flex-col justify-between p-7 sm:p-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>
              Hand-picked by our editors
            </div>
            <h3 className="mt-3 text-3xl sm:text-4xl font-black leading-tight tracking-tight">
              {c.name}
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {c.district || c.city_label || "Bangkok"}
              {c.primary_type && <> · {c.primary_type}</>}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 border-y py-5" style={{ borderColor: "var(--border)" }}>
            <div className="text-center">
              <div className="text-2xl font-black tabular-nums" style={{
                color: c.trust_score >= 75 ? "#16a34a" : c.trust_score >= 60 ? "#059669" : "#ca8a04",
              }}>
                {c.trust_score.toFixed(0)}
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Trust</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black tabular-nums">
                {c.rating.toFixed(1)}<span className="text-base font-medium text-[var(--muted)]">★</span>
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black tabular-nums">{c.total_reviews.toLocaleString()}</div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Reviews</div>
            </div>
          </div>

          {c.categories.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {c.categories.slice(0, 5).map((cat) => (
                <span key={cat} className="bg-white border border-[var(--border)] text-xs px-2.5 py-1 rounded-full inline-flex items-center gap-1 font-medium">
                  <CategoryIcon category={cat} size={14} />
                  {CATEGORY_LABELS[cat] ?? cat}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={`/clinic/${c.id}`}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition shadow-md hover:opacity-90"
              style={{ background: accent }}
            >
              View details <span aria-hidden>→</span>
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
    </article>
  );
}
