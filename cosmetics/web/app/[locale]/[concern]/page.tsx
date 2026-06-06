import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CONCERNS,
  getRanking,
  getProduct,
  productSlug,
  allProducts,
  generatedAt,
  topPicks,
  bestSellers,
  mostLoved,
  getFilter,
  CONCERN_FILTER_SLUGS,
  type Concern,
} from "@/lib/data";
import { LOCALES, t, concernLabel, type Locale } from "@/lib/i18n";
import { itemListLd, concernFaqLd, breadcrumbLd } from "@/lib/schema";
import { getFeaturedMap } from "@/lib/adminData";
import { JsonLd } from "@/components/JsonLd";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ProductStrip } from "@/components/ProductStrip";
import { IngredientGuide } from "@/components/IngredientGuide";
import { ProductFilter } from "@/components/ProductFilter";
import { scoreColor } from "@/lib/format";

const BASE = "https://bangkokfillers.com";
export const revalidate = 300; // 5 min — picks up KV changes without full rebuild

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
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${BASE}/${l}/${concern}`])
      ),
    },
  };
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    CONCERNS.map((concern) => ({ locale, concern }))
  );
}

// Rank badge colors for podium cards
const PODIUM_COLORS = [
  { badge: "bg-rose-500 text-white", border: "border-[#efe1db]", ring: "ring-rose-100" },
  { badge: "bg-emerald-500 text-white", border: "border-emerald-200", ring: "ring-emerald-50" },
  { badge: "bg-emerald-400 text-white", border: "border-emerald-200", ring: "ring-emerald-50" },
];

function productDisplayName(brand: string, name: string): string {
  if (name.toLowerCase().startsWith(brand.toLowerCase())) return name;
  return `${brand} ${name}`;
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
      image: p.image_url,
    };
  });

  // AEO: direct-answer paragraph for AI search engines
  const totalReviews = getRanking(concern)
    .slice(0, 20)
    .reduce((sum, e) => {
      const p = getProduct(e.product_id);
      return sum + (p?.konvy_review_count ?? 0);
    }, 0);
  const topProduct = rows[0];
  const rankingCount = rows.length;
  const directAnswer =
    locale === "ko" && topProduct
      ? `태국에서 ${concernLabel(locale, concern)} 최고 제품 TOP ${rankingCount}를 성분 데이터와 실제 리뷰로 분석했습니다. 1위는 ${topProduct.brand} ${topProduct.name}입니다.`
      : locale === "en" && topProduct
        ? `We ranked ${rankingCount} Thai skincare products for ${concernLabel(locale, concern)} by ingredient efficacy and ${totalReviews.toLocaleString()} verified reviews. Top pick: ${topProduct.brand} ${topProduct.name}.`
        : null;

  const top = rows.slice(0, 20);
  const podium = rows.slice(0, 3);
  const products = getRanking(concern)
    .slice(0, 20)
    .map((e) => getProduct(e.product_id)!);

  // Discovery strip data
  const picks = topPicks(concern, 8);
  const sellers = bestSellers(concern, 8);
  const loved = mostLoved(concern, 8);
  const featuredMap = await getFeaturedMap();
  const featuredId = featuredMap[concern];
  const featuredProduct = featuredId ? getProduct(featuredId) : null;

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

  const intro =
    locale === "th"
      ? "อันดับคำนวณจากคะแนนส่วนผสม 45% รีวิว 45% ความคุ้มค่า 10%"
      : "Ranked by 45% ingredient science, 45% aggregated reviews, 10% value.";

  const fullIntro = `${title}. ${intro}`;

  return (
    <article className="space-y-6 sm:space-y-10">
      {/* Editorial page header */}
      <header className="space-y-2 sm:space-y-3">
        <h1 className="font-serif-display text-2xl sm:text-4xl font-semibold leading-tight text-[#1a1a1a]">
          {title}
        </h1>
        {directAnswer && (
          <p className="text-sm text-neutral-600 max-w-prose">
            {directAnswer}
          </p>
        )}
        <p className="text-base sm:text-lg text-neutral-700 max-w-prose leading-relaxed">
          {intro}
        </p>
        <p className="text-xs text-neutral-400">
          {t(locale, "updated")}: {generatedAt()?.slice(0, 10)}
        </p>
      </header>

      {/* Filter chips — links to SEO sub-pages */}
      {(CONCERN_FILTER_SLUGS[concern] ?? []).length > 0 && (
        <div className="flex flex-wrap gap-2 -mt-2">
          {(CONCERN_FILTER_SLUGS[concern] ?? []).map((slug) => {
            const fc = getFilter(slug);
            if (!fc) return null;
            return (
              <Link
                key={slug}
                href={`/${locale}/${concern}/${slug}`}
                className="text-xs px-3 py-1.5 rounded-full border border-[#efe1db] bg-white text-[#8a7a76] hover:text-rose-500 hover:border-rose-300 transition-colors"
              >
                {fc.emoji} {locale === "th" ? fc.th : fc.en}
              </Link>
            );
          })}
        </div>
      )}

      {/* ── Sponsored slot — clearly labelled, rankings not affected ── */}
      {featuredProduct && (
        <section className="rounded-2xl border-2 border-[#c9a86a]/40 bg-[#fffbf5] p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {featuredProduct.image_url && (
              <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden border border-[#efe1db] bg-white">
                <img src={featuredProduct.image_url} alt={featuredProduct.name} className="w-full h-full object-contain p-1" />
              </div>
            )}
            <div className="min-w-0">
              <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#c9a86a] mb-0.5">
                {locale === "th" ? "ผู้สนับสนุน" : "Sponsored"}
              </span>
              <Link
                href={`/${locale}/product/${productSlug(featuredProduct)}`}
                className="block font-semibold text-sm text-[#2b2222] hover:text-rose-500 transition-colors truncate"
              >
                {featuredProduct.brand} {featuredProduct.name}
              </Link>
              <p className="text-xs text-neutral-500 mt-0.5">฿{Math.round(featuredProduct.price_thb).toLocaleString("en-US")}</p>
            </div>
          </div>
          <Link
            href={featuredProduct.url}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl px-4 py-2.5 transition-colors"
          >
            {locale === "th" ? "ดูสินค้า" : "View"} →
          </Link>
        </section>
      )}

      {/* ── 성분 가이드 ── */}
      <IngredientGuide concern={concern} locale={locale} />

      {/* Our Picks strip */}
      {picks.length > 0 && (
        <ProductStrip
          title={t(locale, "our_picks")}
          eyebrow={locale === "th" ? "บรรณาธิการแนะนำ" : "Editor's picks"}
          subtitle={
            locale === "th"
              ? "คัดโดยคะแนนส่วนผสม + รีวิวจริง"
              : "Top-scored by ingredient science + real reviews"
          }
          products={picks}
          locale={locale}
          concern={concern}
          proof="score"
        />
      )}

      {/* Bestsellers strip */}
      {sellers.length > 0 && (
        <ProductStrip
          title={t(locale, "bestsellers")}
          eyebrow={locale === "th" ? "ขายดี" : "Hot sellers"}
          subtitle={
            locale === "th"
              ? "สินค้าที่มียอดขายสูงสุด"
              : "Most purchased in this category"
          }
          products={sellers}
          locale={locale}
          concern={concern}
          proof="sold"
        />
      )}

      {/* Most Loved strip */}
      {loved.length > 0 && (
        <ProductStrip
          title={t(locale, "most_loved")}
          eyebrow={locale === "th" ? "คนรัก" : "Fan favourites"}
          subtitle={
            locale === "th"
              ? "รีวิวมากที่สุด เรตติ้งดีที่สุด"
              : "Most reviewed & highest rated"
          }
          products={loved}
          locale={locale}
          concern={concern}
          proof="loved"
        />
      )}

      {/* Top-3 Podium cards */}
      {podium.length > 0 && (
        <section>
          <h2 className="font-serif-display text-lg font-semibold text-neutral-700 mb-3">
            {locale === "th" ? "อันดับต้น 3" : "Top 3"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {podium.map((r, i) => {
              const c = PODIUM_COLORS[i];
              return (
                <div
                  key={r.id}
                  className={`relative rounded-xl border ${c.border} bg-white ring-2 ${c.ring} p-4 flex flex-col gap-2 shadow-sm`}
                >
                  {/* Rank badge */}
                  <span
                    className={`absolute -top-3 -left-2 inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold shadow ${c.badge}`}
                  >
                    {i + 1}
                  </span>
                  {/* Product name */}
                  <Link
                    href={`/${locale}/product/${r.slug}`}
                    className="text-rose-600 hover:text-rose-800 font-medium leading-snug pt-1 hover:underline underline-offset-2"
                  >
                    {productDisplayName(r.brand, r.name)}
                  </Link>
                  {/* Score pill */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${scoreColor(r.score)} ${
                        r.score >= 85
                          ? "bg-emerald-50"
                          : r.score >= 70
                            ? "bg-amber-50"
                            : "bg-rose-50"
                      }`}
                    >
                      {(Math.round(r.score * 10) / 10).toFixed(1)}
                    </span>
                    <span className="text-xs text-neutral-500">
                      ฿{Math.round(r.price).toLocaleString("en-US")}
                    </span>
                  </div>
                  {/* Key ingredient */}
                  {r.keyIngredient !== "—" && (
                    <p className="text-xs text-neutral-500 mt-auto">
                      <span className="font-medium text-neutral-600">
                        {labels.key_ingredient}:
                      </span>{" "}
                      {r.keyIngredient}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── แนะนำสำหรับคุณ / Find your match ── */}
      <ProductFilter
        products={allProducts().filter((p) => {
          const seeds = p.concern_seeds;
          return Array.isArray(seeds) ? seeds.includes(concern) : String(seeds).split("|").includes(concern);
        })}
        concern={concern}
        locale={locale}
      />

      {/* Full comparison table */}
      <section>
        <h2 className="font-serif-display text-lg font-semibold text-neutral-700 mb-3">
          {locale === "th" ? "ตารางเปรียบเทียบทั้งหมด" : "Full comparison table"}
        </h2>
        <ComparisonTable rows={top} locale={locale} labels={labels} />
      </section>

      <JsonLd
        data={itemListLd(
          `https://bangkokfillers.com/${locale}/${concern}`,
          products,
          (p) =>
            `https://bangkokfillers.com/${locale}/product/${productSlug(p)}`
        )}
      />
      <JsonLd data={concernFaqLd(
        concern,
        locale,
        rows[0]?.name ?? "",
        Math.round(rows[0]?.score ?? 0)
      )} />
      <JsonLd data={breadcrumbLd([
        { name: "BangkokFillers", url: `https://bangkokfillers.com/${locale}` },
        { name: concernLabel(locale, concern), url: `https://bangkokfillers.com/${locale}/${concern}` },
      ])} />
    </article>
  );
}
