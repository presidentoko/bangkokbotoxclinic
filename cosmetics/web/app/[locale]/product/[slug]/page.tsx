import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { allProducts, getProduct, productSlug, productIdFromSlug } from "@/lib/data";
import { LOCALES, t, type Locale } from "@/lib/i18n";
import { productLd } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { AffiliateButton } from "@/components/AffiliateButton";
import { IngredientDecoder } from "@/components/IngredientDecoder";
import { scoreColor } from "@/lib/format";

const BASE = "https://bangkokfillers.com";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    allProducts().map((p) => ({ locale, slug: productSlug(p) }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeRaw, slug } = await params;
  const locale = localeRaw as Locale;
  const p = getProduct(productIdFromSlug(slug));
  if (!p) return {};
  const title =
    locale === "th"
      ? `${p.name} — รีวิว ส่วนผสม คะแนน`
      : `${p.name} — Reviews, Ingredients & Score`;
  const description =
    locale === "th"
      ? `${p.name} ได้คะแนนจากส่วนผสมและรีวิว ${p.konvy_review_count} รายการ ดูรายละเอียดส่วนผสมและเปรียบเทียบราคา`
      : `${p.name} scored from ingredient analysis and ${p.konvy_review_count} reviews. See ingredients and compare prices.`;
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/product/${slug}`,
      languages: {
        th: `${BASE}/th/product/${slug}`,
        en: `${BASE}/en/product/${slug}`,
      },
    },
  };
}

function fallbackSummary(
  p: { name: string; total_score?: Record<string, number>; konvy_review_count: number },
  locale: Locale,
  concern: string
) {
  const sc = (p.total_score?.[concern] ?? 0).toFixed(0);
  return locale === "th"
    ? `${p.name} ได้คะแนนรวม ${sc}/100 จากส่วนผสมและรีวิว ${p.konvy_review_count} รายการ`
    : `${p.name} scores ${sc}/100 from its ingredients and ${p.konvy_review_count} reviews.`;
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-sm text-[#8a7a76]">{label}</span>
      <div className="flex-1 h-2.5 rounded-full bg-rose-50 overflow-hidden">
        <div
          className="h-full rounded-full bg-rose-400"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right text-sm font-semibold text-neutral-700">{pct}</span>
    </div>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeRaw, slug } = await params;
  const locale = localeRaw as Locale;

  const p = getProduct(productIdFromSlug(slug));
  if (!p) notFound();

  // Handle concern_seeds being a string, "|"-delimited string, or array
  const concern =
    (Array.isArray(p.concern_seeds)
      ? p.concern_seeds[0]
      : String(p.concern_seeds).split("|")[0]) || "acne";

  const summary = p.llm_summary?.[locale] || fallbackSummary(p, locale, concern);
  const pageUrl = `https://bangkokfillers.com/${locale}/product/${slug}`;
  const totalScore = Math.round(p.total_score?.[concern] ?? 0);
  const ingredientScore = Math.round(p.ingredient_score?.[concern] ?? 0);
  const posKws = p.review_summary?.pos_keywords ?? [];
  const negKws = p.review_summary?.neg_keywords ?? [];
  const hasDiscount = p.discount_pct > 0;

  return (
    <>
      {/* ── Main content — bottom-padding on mobile to clear sticky bar ── */}
      <article className="space-y-8 pb-28 sm:pb-0">

        {/* ══════════════════════════════════════
            VERDICT CARD
            Single column on phone, side-by-side on sm+
        ══════════════════════════════════════ */}
        <div className="rounded-2xl border border-[#efe1db] bg-white shadow-sm shadow-rose-100 overflow-hidden">
          {/* Image + info */}
          <div className="flex flex-col sm:flex-row gap-0 sm:gap-6 items-stretch sm:items-start p-5 sm:p-6">
            {/* Product image */}
            {p.image_url && (
              <div className="mx-auto sm:mx-0 shrink-0 mb-4 sm:mb-0">
                <Image
                  src={p.image_url}
                  alt={p.name}
                  width={200}
                  height={200}
                  className="rounded-xl border border-neutral-100 object-contain bg-neutral-50"
                  style={{ width: 200, height: 200 }}
                  loading="eager"
                />
              </div>
            )}

            {/* Name + score + verdict */}
            <div className="flex-1 space-y-3">
              {/* Brand eyebrow */}
              <p className="text-xs font-semibold uppercase tracking-widest text-[#c9a86a]">
                {p.brand}
              </p>

              {/* Product name (serif) */}
              <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-neutral-900 leading-snug">
                {p.name}
              </h1>

              {/* Big score badge */}
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-5xl sm:text-6xl font-black tabular-nums leading-none ${scoreColor(totalScore)}`}
                >
                  {totalScore}
                </span>
                <span className="text-lg text-neutral-400 font-medium">/100</span>
              </div>

              {/* One-line verdict */}
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                {summary}
              </p>

              {/* Price row — inline on desktop, replaces sticky bar */}
              <div className="hidden sm:flex flex-wrap items-center gap-3 pt-2">
                <AffiliateButton p={p} locale={locale} variant="inline" />
                {hasDiscount && (
                  <>
                    <span className="text-sm text-neutral-400 line-through">
                      ฿{Math.round(p.list_price_thb).toLocaleString()}
                    </span>
                    <span className="rounded-full bg-rose-50 border border-[#efe1db] px-2.5 py-0.5 text-xs font-semibold text-rose-600">
                      -{p.discount_pct}%
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile-only: price strip inside card (above sticky bar summary) */}
          {hasDiscount && (
            <div className="sm:hidden flex items-center gap-3 border-t border-[#efe1db] px-5 py-3">
              <span className="text-base font-bold text-[#2b2222]">
                ฿{Math.round(p.price_thb).toLocaleString()}
              </span>
              <span className="text-sm text-[#8a7a76] line-through">
                ฿{Math.round(p.list_price_thb).toLocaleString()}
              </span>
              <span className="rounded-full bg-rose-50 border border-[#efe1db] px-2.5 py-0.5 text-xs font-semibold text-rose-600">
                -{p.discount_pct}%
              </span>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════
            SCORE BREAKDOWN
        ══════════════════════════════════════ */}
        <section className="space-y-3">
          <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
            {locale === "th" ? "รายละเอียดคะแนน" : "Score Breakdown"}
          </h2>
          <div className="rounded-2xl border border-[#efe1db] bg-white px-5 py-4 space-y-4 shadow-sm shadow-rose-100">
            <ScoreBar
              label={locale === "th" ? "ส่วนผสม" : "Ingredients"}
              value={ingredientScore}
            />
            <ScoreBar
              label={locale === "th" ? "รีวิว" : "Reviews"}
              value={p.review_score ?? 0}
            />
            <ScoreBar
              label={locale === "th" ? "ความคุ้มค่า" : "Value"}
              value={p.value_score ?? 0}
            />
          </div>
        </section>

        {/* ══════════════════════════════════════
            INGREDIENTS
        ══════════════════════════════════════ */}
        <section className="space-y-3">
          <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
            {t(locale, "ingredients")}
          </h2>
          <IngredientDecoder
            analysis={p.ingredient_analysis}
            concern={concern}
            locale={locale}
          />
        </section>

        {/* ══════════════════════════════════════
            REVIEWS
        ══════════════════════════════════════ */}
        <section className="space-y-4">
          <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
            {t(locale, "reviews")}
          </h2>
          <p className="text-sm text-neutral-600">
            <span className="text-amber-500 mr-1">★</span>
            <strong>{p.konvy_rating}</strong>
            <span className="mx-1 text-neutral-300">·</span>
            <span>
              {p.konvy_review_count.toLocaleString()}{" "}
              {locale === "th" ? "รีวิว" : "reviews"}
            </span>
          </p>

          {/* Keyword chips */}
          {(posKws.length > 0 || negKws.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {posKws.slice(0, 6).map((kw) => (
                <span
                  key={kw}
                  className="rounded-full bg-rose-50 border border-[#efe1db] px-3 py-1 text-xs text-rose-600 font-medium"
                >
                  {kw}
                </span>
              ))}
              {negKws.slice(0, 4).map((kw) => (
                <span
                  key={kw}
                  className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs text-amber-700 font-medium"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}

          {/* Sample review cards */}
          <div className="space-y-3">
            {(p.review_summary?.samples ?? []).slice(0, 3).map((r, i) => (
              <blockquote
                key={i}
                className="rounded-2xl border border-[#efe1db] bg-white px-5 py-4 shadow-sm shadow-rose-100"
              >
                <p className="text-sm text-neutral-700 leading-relaxed">
                  &ldquo;{r.body}&rdquo;
                </p>
                <footer className="mt-2 text-xs text-neutral-400">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(Math.max(0, 5 - r.rating))}
                  {r.author && <span className="ml-2">{r.author}</span>}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <JsonLd data={productLd(p, pageUrl)} />
      </article>

      {/* ══════════════════════════════════════
          STICKY BOTTOM BUY BAR — MOBILE ONLY
          fixed bottom-0, hidden on sm+
      ══════════════════════════════════════ */}
      <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-rose-500 shadow-[0_-2px_12px_rgba(224,96,126,0.25)]">
        <div className="flex items-center justify-center px-4 py-3.5 min-h-[56px]">
          <AffiliateButton p={p} locale={locale} variant="sticky" />
        </div>
      </div>
    </>
  );
}
