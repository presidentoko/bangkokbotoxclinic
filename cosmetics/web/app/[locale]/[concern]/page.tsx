import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CONCERNS,
  getRanking,
  getProduct,
  productSlug,
  generatedAt,
  type Concern,
} from "@/lib/data";
import { LOCALES, t, concernLabel, type Locale } from "@/lib/i18n";
import { itemListLd, faqLd } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { ComparisonTable } from "@/components/ComparisonTable";

const BASE = "https://bangkokfillers.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; concern: string }>;
}): Promise<Metadata> {
  const { locale: localeRaw, concern } = await params;
  const locale = localeRaw as Locale;
  const label = concernLabel(locale, concern);
  const title =
    locale === "th"
      ? `${label} : ผลิตภัณฑ์ที่ดีที่สุดจัดอันดับด้วยส่วนผสม + รีวิวจริง`
      : `Best products for ${label} — ranked by ingredients + real reviews`;
  const description =
    locale === "th"
      ? `อันดับ ${label} คำนวณจากคะแนนส่วนผสม 45% รีวิว 45% ความคุ้มค่า 10%`
      : `Top ${label} products ranked by 45% ingredient science, 45% aggregated reviews, 10% value.`;
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/${concern}`,
      languages: {
        th: `${BASE}/th/${concern}`,
        en: `${BASE}/en/${concern}`,
      },
    },
  };
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    CONCERNS.map((concern) => ({ locale, concern }))
  );
}

export default async function ConcernHub({
  params,
}: {
  params: Promise<{ locale: string; concern: string }>;
}) {
  const { locale: localeRaw, concern } = await params;
  const locale = localeRaw as Locale;

  if (!CONCERNS.includes(concern as Concern)) notFound();

  const rows = getRanking(concern).map((e, i) => {
    const p = getProduct(e.product_id)!;
    const key =
      p.ingredient_analysis.find((a) => a.concern_efficacy[concern] > 0)
        ?.inci ?? "—";
    return {
      rank: i + 1,
      id: p.product_id,
      slug: productSlug(p),
      name: p.name,
      brand: p.brand,
      score: e.total_score,
      keyIngredient: key,
      price: p.price_thb,
      rating: p.konvy_rating,
      reviews: p.konvy_review_count,
    };
  });

  const top = rows.slice(0, 20);
  const products = getRanking(concern)
    .slice(0, 20)
    .map((e) => getProduct(e.product_id)!);

  const labels = {
    rank: t(locale, "rank"),
    product: t(locale, "product"),
    score: t(locale, "score"),
    key_ingredient: t(locale, "key_ingredient"),
    price: t(locale, "price"),
    rating: t(locale, "rating"),
  };

  const title =
    locale === "th"
      ? `${concernLabel(locale, concern)} : ผลิตภัณฑ์ที่ดีที่สุดจัดอันดับด้วยส่วนผสม + รีวิวจริง`
      : `Best products for ${concernLabel(locale, concern)} — ranked by ingredients + real reviews`;

  const intro = `${title}. ${
    locale === "th"
      ? "อันดับคำนวณจากคะแนนส่วนผสม 45% รีวิว 45% ความคุ้มค่า 10%"
      : "Ranked by 45% ingredient science, 45% aggregated reviews, 10% value."
  }`;

  return (
    <article className="space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-gray-700">{intro}</p>
      <p className="text-xs text-gray-400">
        {t(locale, "updated")}: {generatedAt()?.slice(0, 10)}
      </p>
      <ComparisonTable rows={top} locale={locale} labels={labels} />
      <JsonLd
        data={itemListLd(
          `https://bangkokfillers.com/${locale}/${concern}`,
          products,
          (p) =>
            `https://bangkokfillers.com/${locale}/product/${productSlug(p)}`
        )}
      />
      <JsonLd data={faqLd([{ q: title, a: intro }])} />
    </article>
  );
}
