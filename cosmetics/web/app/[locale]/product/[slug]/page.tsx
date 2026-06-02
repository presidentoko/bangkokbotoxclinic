import { notFound } from "next/navigation";
import { allProducts, getProduct, productSlug, productIdFromSlug } from "@/lib/data";
import { LOCALES, t, type Locale } from "@/lib/i18n";
import { productLd } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { AffiliateButton } from "@/components/AffiliateButton";
import { IngredientDecoder } from "@/components/IngredientDecoder";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    allProducts().map((p) => ({ locale, slug: productSlug(p) }))
  );
}

function fallbackSummary(p: { brand: string; name: string; total_score?: Record<string, number>; konvy_review_count: number }, locale: Locale, concern: string) {
  const sc = (p.total_score?.[concern] ?? 0).toFixed(0);
  return locale === "th"
    ? `${p.brand} ${p.name} ได้คะแนนรวม ${sc}/100 จากส่วนผสมและรีวิว ${p.konvy_review_count} รายการ`
    : `${p.brand} ${p.name} scores ${sc}/100 from its ingredients and ${p.konvy_review_count} reviews.`;
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

  return (
    <article className="space-y-4">
      <h1 className="text-xl font-bold">
        {p.brand} {p.name}
      </h1>
      <p className="text-lg">
        {(p.total_score?.[concern] ?? 0).toFixed(0)}/100 · {summary}
      </p>
      <div className="flex items-center gap-3">
        <AffiliateButton p={p} locale={locale} />
        {p.discount_pct > 0 && (
          <span className="text-sm text-gray-500 line-through">
            ฿{Math.round(p.list_price_thb).toLocaleString()}
          </span>
        )}
        {p.discount_pct > 0 && (
          <span className="text-sm text-pink-700">-{p.discount_pct}%</span>
        )}
      </div>
      <section>
        <h2 className="font-semibold">{t(locale, "ingredients")}</h2>
        <IngredientDecoder
          analysis={p.ingredient_analysis}
          concern={concern}
          locale={locale}
        />
      </section>
      <section>
        <h2 className="font-semibold">
          {t(locale, "reviews")} ({p.konvy_review_count})
        </h2>
        <p className="text-sm">
          ★ {p.konvy_rating} ·{" "}
          {p.review_summary?.pos_keywords?.slice(0, 5).join(", ")}
        </p>
        <ul className="mt-2 space-y-1 text-sm text-gray-700">
          {(p.review_summary?.samples ?? []).slice(0, 3).map((r, i) => (
            <li key={i}>
              &ldquo;{r.body}&rdquo; — {r.rating}★
            </li>
          ))}
        </ul>
      </section>
      <JsonLd data={productLd(p, pageUrl)} />
    </article>
  );
}
