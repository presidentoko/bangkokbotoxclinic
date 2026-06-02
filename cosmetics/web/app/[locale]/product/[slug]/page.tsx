import type { Metadata } from "next";
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

function fallbackSummary(p: { name: string; total_score?: Record<string, number>; konvy_review_count: number }, locale: Locale, concern: string) {
  const sc = (p.total_score?.[concern] ?? 0).toFixed(0);
  return locale === "th"
    ? `${p.name} ได้คะแนนรวม ${sc}/100 จากส่วนผสมและรีวิว ${p.konvy_review_count} รายการ`
    : `${p.name} scores ${sc}/100 from its ingredients and ${p.konvy_review_count} reviews.`;
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-xs text-neutral-500">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-neutral-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-teal-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-8 text-right text-xs font-semibold text-neutral-700">{pct}</span>
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

  return (
    <article className="space-y-8">
      {/* ── Header block ── */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {p.image_url && (
          <div className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.image_url}
              alt={p.name}
              width={160}
              height={160}
              className="rounded-xl border border-neutral-200 object-contain bg-white"
              style={{ width: 160, height: 160 }}
            />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-teal-600">{p.brand}</p>
          <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-neutral-900 leading-snug">
            {p.name}
          </h1>
          {/* Verdict line */}
          <p className="text-sm text-neutral-600 leading-relaxed">
            <span className={`text-4xl font-bold tabular-nums mr-2 ${scoreColor(totalScore)}`}>
              {totalScore}
            </span>
            <span className="text-neutral-400">/100 · </span>
            {summary}
          </p>
        </div>
      </div>

      {/* ── Price row ── */}
      <div className="flex flex-wrap items-center gap-3 border-t border-b border-neutral-100 py-4">
        <AffiliateButton p={p} locale={locale} />
        {p.discount_pct > 0 && (
          <>
            <span className="text-sm text-neutral-400 line-through">
              ฿{Math.round(p.list_price_thb).toLocaleString()}
            </span>
            <span className="rounded-full bg-teal-50 border border-teal-200 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
              -{p.discount_pct}%
            </span>
          </>
        )}
      </div>

      {/* ── Score breakdown ── */}
      <section className="space-y-3">
        <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
          {locale === "th" ? "รายละเอียดคะแนน" : "Score Breakdown"}
        </h2>
        <div className="rounded-xl border border-neutral-100 bg-white px-5 py-4 space-y-3 shadow-sm">
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

      {/* ── Ingredients ── */}
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

      {/* ── Reviews ── */}
      <section className="space-y-4">
        <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
          {t(locale, "reviews")}
        </h2>
        <p className="text-sm text-neutral-600">
          <span className="text-amber-500 mr-1">★</span>
          <strong>{p.konvy_rating}</strong>
          <span className="mx-1 text-neutral-300">·</span>
          <span>{p.konvy_review_count.toLocaleString()} {locale === "th" ? "รีวิว" : "reviews"}</span>
        </p>

        {/* Keyword chips */}
        {(posKws.length > 0 || negKws.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {posKws.slice(0, 6).map((kw) => (
              <span key={kw} className="rounded-full bg-teal-50 border border-teal-200 px-3 py-0.5 text-xs text-teal-700 font-medium">
                {kw}
              </span>
            ))}
            {negKws.slice(0, 4).map((kw) => (
              <span key={kw} className="rounded-full bg-amber-50 border border-amber-200 px-3 py-0.5 text-xs text-amber-700 font-medium">
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
              className="rounded-xl border border-neutral-100 bg-white px-5 py-4 shadow-sm"
            >
              <p className="text-sm text-neutral-700 leading-relaxed">
                &ldquo;{r.body}&rdquo;
              </p>
              <footer className="mt-2 text-xs text-neutral-400">
                {'★'.repeat(r.rating)}{'☆'.repeat(Math.max(0, 5 - r.rating))}
                {r.author && <span className="ml-2">{r.author}</span>}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <JsonLd data={productLd(p, pageUrl)} />
    </article>
  );
}
