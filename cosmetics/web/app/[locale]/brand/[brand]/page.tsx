import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  allBrands, brandSlug, brandFromSlug, brandProducts, brandStats,
  productSlug, getRanking, type Concern, CONCERNS,
} from "@/lib/data";
import { concernLabel, LOCALES, type Locale } from "@/lib/i18n";
import { brandFaqLd, breadcrumbLd, itemListLd } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { scoreColor, baht } from "@/lib/format";

const BASE = "https://bangkokfillers.com";
// 2026-07-13 긴급 픽스 — ISR Writes 한도 초과 대응. 유효 브랜드는
// generateStaticParams가 전부 열거하므로 온디맨드 렌더 허용할 이유 없음.
export const dynamicParams = false;

export async function generateStaticParams() {
  return allBrands().flatMap((b) =>
    LOCALES.map((locale) => ({ locale, brand: brandSlug(b) }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; brand: string }>;
}): Promise<Metadata> {
  const { locale, brand: brandSlugParam } = await params;
  const brand = brandFromSlug(brandSlugParam);
  if (!brand) return {};
  const isTh = locale === "th";
  const stats = brandStats(brand);
  const title = isTh
    ? `${brand} สกินแคร์ไทย — ${stats.count} ผลิตภัณฑ์ จัดอันดับโดยข้อมูล | BangkokFillers`
    : `${brand} Skincare in Thailand — ${stats.count} products ranked by data | BangkokFillers`;
  const description = isTh
    ? `ผลิตภัณฑ์ ${brand} ${stats.count} รายการ จัดอันดับด้วยคะแนนส่วนผสม รีวิวจาก Konvy และ Watsons ราคาตั้งแต่ ${baht(stats.minPrice)}`
    : `${stats.count} ${brand} products ranked by ingredient science, Konvy & Watsons reviews. Prices from ${baht(stats.minPrice)}.`;
  const url = `${BASE}/${locale}/brand/${brandSlugParam}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}/brand/${brandSlugParam}`])),
    },
    openGraph: { title, description, url },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ locale: string; brand: string }>;
}) {
  const { locale: localeRaw, brand: brandSlugParam } = await params;
  const locale = localeRaw as Locale;
  const isTh = locale === "th";

  const brand = brandFromSlug(brandSlugParam);
  if (!brand) notFound();

  const products = brandProducts(brand);
  const stats = brandStats(brand);
  if (!products.length) notFound();

  // Best product per concern (for AEO answer blocks)
  const concernBests: { concern: Concern; product: typeof products[0]; score: number }[] = [];
  for (const c of stats.concerns as Concern[]) {
    const ranking = getRanking(c);
    const best = ranking.find((r) => products.some((p) => p.product_id === r.product_id));
    if (best) {
      const p = products.find((p) => p.product_id === best.product_id)!;
      concernBests.push({ concern: c, product: p, score: Math.round(best.total_score) });
    }
  }

  const topProduct = products[0];
  const topConcern = stats.concerns[0] ?? "acne";

  const pageUrl = `${BASE}/${locale}/brand/${brandSlugParam}`;

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="space-y-3">
        <nav className="text-xs text-neutral-400 flex items-center gap-1.5">
          <Link href={`/${locale}`} className="hover:text-rose-500 transition-colors">BangkokFillers</Link>
          <span>›</span>
          <span className="text-neutral-600">{brand}</span>
        </nav>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#2b2222]">
          {brand}
        </h1>
        <p className="text-neutral-500 text-sm max-w-prose">
          {isTh
            ? `${stats.count} ผลิตภัณฑ์ · คะแนนเฉลี่ย ${Math.round(stats.avgScore)}/100 · ราคา ${baht(stats.minPrice)} – ${baht(stats.maxPrice)}`
            : `${stats.count} products · avg score ${Math.round(stats.avgScore)}/100 · ${baht(stats.minPrice)} – ${baht(stats.maxPrice)}`}
        </p>
        {stats.concerns.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {stats.concerns.map((c) => (
              <Link
                key={c}
                href={`/${locale}/${c}`}
                className="rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
              >
                {concernLabel(locale, c)}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Best per concern — AEO answer blocks */}
      {concernBests.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-serif-display text-lg font-semibold text-[#2b2222]">
            {isTh ? `${brand} ที่ดีที่สุดแยกตามปัญหาผิว` : `Best ${brand} by skin concern`}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {concernBests.map(({ concern: c, product: p, score }) => (
              <Link
                key={c}
                href={`/${locale}/product/${productSlug(p)}`}
                className="flex items-start gap-3 rounded-2xl border border-[#efe1db] bg-white hover:shadow-sm hover:border-rose-200 transition-all p-4 group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-rose-100 bg-rose-50">
                  {p.image_url && (
                    <Image src={p.image_url} alt={p.name} width={48} height={48} className="object-contain w-full h-full p-1" />
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#c9a86a]">
                    {concernLabel(locale, c)}
                  </p>
                  <p className="text-sm font-medium text-[#2b2222] line-clamp-2 group-hover:text-rose-500 transition-colors">
                    {p.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${scoreColor(score)}`}>{score} pts</span>
                    <span className="text-xs text-neutral-400">{baht(p.price_thb)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Full product grid */}
      <section className="space-y-4">
        <h2 className="font-serif-display text-lg font-semibold text-[#2b2222]">
          {isTh ? `ผลิตภัณฑ์ ${brand} ทั้งหมด` : `All ${brand} products`}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => {
            const scoreValues = Object.values(p.total_score);
            const bestScore = scoreValues.length ? Math.round(Math.max(...scoreValues)) : 0;
            const bestConcern = Object.entries(p.total_score).sort((a, b) => b[1] - a[1])[0]?.[0];
            return (
              <Link
                key={p.product_id}
                href={`/${locale}/product/${productSlug(p)}`}
                className="flex items-start gap-3 rounded-2xl border border-[#efe1db] bg-white hover:shadow-sm hover:border-rose-200 transition-all p-4 group"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border border-rose-100 bg-rose-50">
                  {p.image_url && (
                    <Image src={p.image_url} alt={p.name} width={56} height={56} className="object-contain w-full h-full p-1" />
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-xs font-medium text-neutral-500 line-clamp-2 group-hover:text-rose-500 transition-colors">
                    {p.name}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold ${scoreColor(bestScore)}`}>
                      {bestScore} pts
                    </span>
                    {bestConcern && CONCERNS.includes(bestConcern as Concern) && (
                      <span className="text-[10px] text-neutral-400">
                        {concernLabel(locale, bestConcern)}
                      </span>
                    )}
                    <span className="text-xs text-neutral-400">{baht(p.price_thb)}</span>
                  </div>
                  {p.konvy_rating > 0 && (
                    <p className="text-[10px] text-amber-500">
                      ★{p.konvy_rating.toFixed(1)} · {p.konvy_review_count.toLocaleString()} {isTh ? "รีวิว" : "reviews"}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* JSON-LD */}
      <JsonLd data={brandFaqLd(brand, locale, topProduct.name, topConcern)} />
      <JsonLd data={itemListLd(pageUrl, products, (p) => `${BASE}/${locale}/product/${productSlug(p)}`)} />
      <JsonLd data={breadcrumbLd([
        { name: "BangkokFillers", url: `${BASE}/${locale}` },
        { name: brand, url: pageUrl },
      ])} />
    </div>
  );
}
