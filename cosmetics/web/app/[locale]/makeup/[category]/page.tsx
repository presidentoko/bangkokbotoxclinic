import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MAKEUP_CATEGORIES,
  MAKEUP_CATEGORY_META,
  getMakeupRanking,
  getProduct,
  productSlug,
} from "@/lib/data";
import { STATIC_LOCALES, localeAlternates, type Locale } from "@/lib/i18n";
import { baht, scoreColor } from "@/lib/format";
import { JsonLd } from "@/components/JsonLd";
import { faqLd, breadcrumbLd, itemListLd } from "@/lib/schema";

const BASE = "https://bangkokfillers.com";
// Same reasoning as every other enumerable route on this site: the valid
// categories are exactly MAKEUP_CATEGORIES (only ones with >=8 listings get a
// page — see build_master_db.py's med_by_makeup_cat), so on-demand rendering
// for anything else would just mean a bot-probed URL burning an ISR write.
export const dynamicParams = false;

export function generateStaticParams() {
  const result: { locale: string; category: string }[] = [];
  for (const locale of STATIC_LOCALES) {
    for (const category of MAKEUP_CATEGORIES) {
      result.push({ locale, category });
    }
  }
  return result;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const loc = locale as Locale;
  const isTh = loc === "th";
  const meta = MAKEUP_CATEGORY_META[category];
  if (!meta) return {};

  const label = isTh ? meta.th : meta.en;
  const count = getMakeupRanking(category).length;

  const title = isTh
    ? `${label}ที่ดีที่สุด ${count} อันดับ 2026`
    : `Best ${label} in Thailand — ${count} Ranked 2026`;
  const description = isTh
    ? `จัดอันดับ${label} ${count} รายการจากรีวิวจริงและราคา — ไม่มีการจ่ายเงินเพื่อขึ้นอันดับ`
    : `${count} ${label} products ranked by real reviews and value. No paid rankings.`;

  const url = `${BASE}/${locale}/makeup/${category}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: localeAlternates((l) => `${BASE}/${l}/makeup/${category}`),
    },
    openGraph: { title, description, url },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function MakeupCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale: localeRaw, category } = await params;
  const locale = localeRaw as Locale;
  const isTh = locale === "th";
  const meta = MAKEUP_CATEGORY_META[category];
  if (!meta) notFound();

  const ranking = getMakeupRanking(category);
  if (ranking.length < 8) notFound();

  const products = ranking
    .map((r) => getProduct(r.product_id))
    .filter((p): p is NonNullable<typeof p> => p != null);
  if (products.length === 0) notFound();

  const label = isTh ? meta.th : meta.en;
  const h1 = isTh ? `${label}ที่ดีที่สุด` : `Best ${label} in Thailand`;
  const intro = isTh
    ? `รวม ${products.length} ${label} จัดอันดับจากรีวิวจริง (70%) และความคุ้มค่า (30%) — ไม่มีการวิเคราะห์ส่วนผสม เพราะรายการส่วนผสมของเมคอัพไม่บ่งบอกถึงคุณภาพการคลุมผิว`
    : `${products.length} ${label} products ranked by real reviews (70%) and value (30%). No ingredient scoring — a makeup ingredient list says nothing about coverage or wear the way a serum's does.`;

  const topProduct = products[0];
  const faqQas = isTh
    ? [
        {
          q: `${label}ตัวไหนดีที่สุด`,
          a: `${topProduct.brand} ${topProduct.name} ได้คะแนนสูงสุดในหมวด${label} จากรีวิวจริงและความคุ้มค่า`,
        },
        {
          q: `จัดอันดับ${label}นี้อย่างไร`,
          a: `จัดอันดับจากคะแนนรีวิวที่ปรับตามความเชื่อมั่นทางสถิติ (70%) และราคาเทียบกับค่ากลางในหมวดเดียวกัน (30%) พร้อมคะแนนเสริมหากมี SPF`,
        },
      ]
    : [
        {
          q: `What is the best ${label} in Thailand?`,
          a: `${topProduct.brand} ${topProduct.name} scores highest for ${label}, based on real reviews and value.`,
        },
        {
          q: `How is this ${label} ranking calculated?`,
          a: `Ranked by review score (70%, confidence-adjusted) and price versus the category median (30%), with a small bonus for SPF where labelled.`,
        },
      ];

  return (
    <article className="space-y-10">
      <nav className="text-xs text-[#8a7a76] flex flex-wrap gap-1 items-center">
        <Link href={`/${locale}`} className="hover:text-rose-500 transition-colors">
          {isTh ? "หน้าหลัก" : "Home"}
        </Link>
        <span>/</span>
        <span className="text-[#2b2222] font-medium">{label}</span>
      </nav>

      <header className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-[#c9a86a] font-bold">
          {meta.emoji} {isTh ? "เมคอัพ" : "Makeup"}
        </p>
        <h1 className="font-serif-display text-2xl sm:text-4xl font-semibold text-[#2b2222] leading-tight">
          {h1}
        </h1>
        <p className="text-base text-neutral-600 max-w-prose leading-relaxed">{intro}</p>
      </header>

      {MAKEUP_CATEGORIES.length > 1 && (
        <section className="space-y-2">
          <p className="text-xs text-neutral-400 uppercase tracking-wider">
            {isTh ? "หมวดอื่น:" : "Other categories:"}
          </p>
          <div className="flex flex-wrap gap-2">
            {MAKEUP_CATEGORIES.filter((c) => c !== category).map((c) => {
              const m = MAKEUP_CATEGORY_META[c];
              return (
                <Link
                  key={c}
                  href={`/${locale}/makeup/${c}`}
                  className="text-sm px-3 py-1.5 rounded-full border border-[#efe1db] bg-white text-[#8a7a76] hover:text-rose-500 hover:border-rose-300 transition-colors"
                >
                  {m.emoji} {isTh ? m.th : m.en}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="font-serif-display text-xl font-semibold text-[#2b2222]">
          {isTh ? `${products.length} ผลิตภัณฑ์ — เรียงตามคะแนน` : `${products.length} products — ranked by score`}
        </h2>
        <div className="rounded-2xl border border-[#efe1db] overflow-hidden bg-white">
          <div className="hidden sm:grid grid-cols-[40px_1fr_80px_80px_80px] border-b border-[#efe1db] bg-[#faf5f4] px-4 py-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#c9a86a]">#</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#c9a86a]">
              {isTh ? "ผลิตภัณฑ์" : "Product"}
            </span>
            <span className="text-xs font-bold text-center uppercase tracking-wider text-[#c9a86a]">
              {isTh ? "คะแนน" : "Score"}
            </span>
            <span className="text-xs font-bold text-center uppercase tracking-wider text-[#c9a86a]">
              {isTh ? "ราคา" : "Price"}
            </span>
            <span className="text-xs font-bold text-center uppercase tracking-wider text-[#c9a86a]">
              {isTh ? "รีวิว" : "Reviews"}
            </span>
          </div>

          {products.slice(0, 30).map((p, idx) => {
            const score = p.makeup_score ?? 0;
            return (
              <Link
                key={p.product_id}
                href={`/${locale}/product/${productSlug(p)}`}
                className="grid grid-cols-[40px_1fr] sm:grid-cols-[40px_1fr_80px_80px_80px] items-center px-4 py-3 border-b last:border-b-0 border-[#f5ecec] hover:bg-rose-50/30 transition-colors group"
              >
                <span className="text-sm font-bold text-[#c9a86a]">{idx + 1}</span>
                <div className="min-w-0">
                  <p className="text-xs text-rose-500 font-semibold">{p.brand}</p>
                  <p className="text-sm font-semibold text-[#2b2222] leading-snug group-hover:text-rose-600 transition-colors truncate">
                    {p.name}
                  </p>
                  <p className="sm:hidden text-xs text-neutral-400 mt-0.5">
                    {score > 0 ? (
                      <span className={`font-bold ${scoreColor(score)}`}>{Math.round(score)}/100</span>
                    ) : null}
                    {" · "}
                    {baht(p.price_thb)}
                  </p>
                </div>
                <span
                  className={`hidden sm:block text-sm font-bold text-center ${
                    score > 0 ? scoreColor(score) : "text-neutral-300"
                  }`}
                >
                  {score > 0 ? Math.round(score) : "—"}
                </span>
                <span className="hidden sm:block text-sm text-neutral-600 text-center">
                  {baht(p.price_thb)}
                </span>
                <span className="hidden sm:block text-sm text-neutral-400 text-center">
                  {p.konvy_review_count > 0 ? p.konvy_review_count.toLocaleString() : "—"}
                </span>
              </Link>
            );
          })}
        </div>
        {products.length > 30 && (
          <p className="text-xs text-neutral-400 text-center">
            {isTh
              ? `แสดง 30 อันดับแรก จาก ${products.length} ผลิตภัณฑ์`
              : `Showing top 30 of ${products.length} products`}
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-serif-display text-2xl font-semibold text-[#2b2222]">
          {isTh ? "คำถามที่พบบ่อย" : "Frequently asked"}
        </h2>
        {faqQas.map(({ q, a }) => (
          <div key={q} className="rounded-2xl border border-[#efe1db] bg-white px-5 py-4 space-y-1.5">
            <p className="font-semibold text-sm text-[#2b2222]">{q}</p>
            <p className="text-sm text-neutral-600 leading-snug">{a}</p>
          </div>
        ))}
      </section>

      <JsonLd data={faqLd(faqQas)} />
      <JsonLd
        data={itemListLd(
          `${BASE}/${locale}/makeup/${category}`,
          products.slice(0, 30),
          (p) => `${BASE}/${locale}/product/${productSlug(p)}`
        )}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "BangkokFillers", url: `${BASE}/${locale}` },
          { name: label, url: `${BASE}/${locale}/makeup/${category}` },
        ])}
      />
    </article>
  );
}
