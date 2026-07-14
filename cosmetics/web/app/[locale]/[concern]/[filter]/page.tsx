import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CONCERNS,
  CONCERN_FILTER_SLUGS,
  FILTER_CONFIGS,
  getFilter,
  filterRanking,
  productSlug,
  type Concern,
} from "@/lib/data";
import { LOCALES, type Locale, concernLabel, concernLabelShort } from "@/lib/i18n";
import { baht, scoreColor } from "@/lib/format";
import { JsonLd } from "@/components/JsonLd";
import { faqLd, breadcrumbLd, itemListLd } from "@/lib/schema";

const BASE = "https://bangkokfillers.com";
// 2026-07-13 긴급 픽스 — ISR Writes 한도 초과(1.5M/200K) 대응. 유효 조합은
// generateStaticParams가 전부 열거하므로 온디맨드 렌더 허용할 이유 없음.
export const dynamicParams = false;

export function generateStaticParams() {
  const result: { locale: string; concern: string; filter: string }[] = [];
  for (const locale of LOCALES) {
    for (const concern of CONCERNS) {
      const slugs = CONCERN_FILTER_SLUGS[concern] ?? [];
      for (const filter of slugs) {
        result.push({ locale, concern, filter });
      }
    }
  }
  return result;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; concern: string; filter: string }>;
}): Promise<Metadata> {
  const { locale, concern, filter } = await params;
  const loc = locale as Locale;
  const isTh = loc === "th";
  const fc = getFilter(filter);
  if (!fc || !CONCERNS.includes(concern as Concern)) return {};

  const concernLbl = concernLabel(loc, concern);
  const filterLbl = isTh ? fc.th : fc.en;

  const title = isTh
    ? `${concernLbl} ${filterLbl} อันดับ — BangkokFillers`
    : `Best ${filterLbl} for ${concernLbl} in Thailand — Data Ranked`;
  const description = isTh
    ? `อันดับ${concernLbl}${filterLbl}ที่ดีที่สุด คำนวณจากส่วนผสม + รีวิวจริงจาก Konvy, Watsons, Boots`
    : `Top ${filterLbl} products for ${concernLbl} in Thailand — ranked by ingredient science (45%) + verified reviews (45%) + value (10%).`;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${loc}/${concern}/${filter}`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}/${concern}/${filter}`])),
    },
  };
}

export default async function FilterPage({
  params,
}: {
  params: Promise<{ locale: string; concern: string; filter: string }>;
}) {
  const { locale: localeRaw, concern, filter } = await params;
  const locale = localeRaw as Locale;
  const isTh = locale === "th";

  if (!CONCERNS.includes(concern as Concern)) notFound();
  const fc = getFilter(filter);
  if (!fc) notFound();

  const products = filterRanking(concern, filter);
  if (products.length < 3) notFound();

  const concernLbl = concernLabel(locale, concern);
  const filterLbl = isTh ? fc.th : fc.en;

  const h1 = isTh
    ? `${concernLbl} ${filterLbl} : อันดับที่ดีที่สุด`
    : `Best ${filterLbl} for ${concernLbl} in Thailand`;

  const intro = isTh
    ? `รวม ${products.length} ผลิตภัณฑ์${concernLbl} ${filterLbl} จัดอันดับจากคะแนนส่วนผสม + รีวิวจริงจาก Konvy, Watsons, Boots — ไม่มีการจ่ายเงินเพื่อขึ้นอันดับ`
    : `${products.length} ${filterLbl} products for ${concernLbl} ranked by ingredient science + verified reviews from Konvy, Watsons, Boots. No paid rankings.`;

  // Related filter chips (other filters for same concern, excluding current)
  const relatedFilters = (CONCERN_FILTER_SLUGS[concern] ?? [])
    .filter((s) => s !== filter)
    .slice(0, 5);

  // FAQ
  const topProduct = products[0];
  const faqQas = isTh
    ? [
        {
          q: `${concernLbl} ${filterLbl} ตัวไหนดีที่สุด`,
          a: `${topProduct.brand} ${topProduct.name} ได้คะแนนสูงสุดในหมวด${concernLbl}${filterLbl} ด้วยคะแนน ${Math.round(topProduct.total_score[concern] ?? 0)}/100`,
        },
        {
          q: `มี ${filterLbl} สำหรับ${concernLbl} ที่ดีจริงไหม`,
          a: `มี — BangkokFillers พบ ${products.length} ผลิตภัณฑ์${filterLbl}สำหรับ${concernLbl} คะแนนส่วนผสม 85+ ถือว่าดีเยี่ยม`,
        },
        {
          q: `${filterLbl}ทำให้ผลิตภัณฑ์${concernLbl}ดีขึ้นไหม`,
          a:
            filter === "fragrance-free"
              ? `น้ำหอมเป็นสารก่อความระคายเคืองที่พบบ่อย สำหรับผิวแพ้ง่ายหรือผิวมีสิว การเลือก fragrance-free ลดความเสี่ยงระคายเคืองได้มาก`
              : filter.startsWith("under-")
                ? `ราคาไม่ได้บ่งบอกถึงประสิทธิภาพ — ผลิตภัณฑ์ในรายการนี้ผ่านเกณฑ์ส่วนผสม + รีวิวในงบ ${filterLbl}`
                : `การมี${filterLbl}ช่วยเพิ่มประสิทธิภาพสำหรับ${concernLbl}โดยตรง ดูคะแนนส่วนผสมเพื่อยืนยัน`,
        },
      ]
    : [
        {
          q: `What is the best ${filterLbl} for ${concernLbl} in Thailand?`,
          a: `${topProduct.brand} ${topProduct.name} scores highest among ${filterLbl} products for ${concernLbl} with ${Math.round(topProduct.total_score[concern] ?? 0)}/100.`,
        },
        {
          q: `Are there effective ${filterLbl} products for ${concernLbl}?`,
          a: `Yes — BangkokFillers found ${products.length} ${filterLbl} products for ${concernLbl}. Scores of 85+ are considered excellent.`,
        },
        {
          q: `Does ${filterLbl} matter for ${concernLbl} skincare?`,
          a:
            filter === "fragrance-free"
              ? `Fragrance is one of the most common contact irritants. For acne-prone or sensitive skin, fragrance-free reduces the risk of inflammation significantly.`
              : filter.startsWith("under-")
                ? `Price doesn't correlate with efficacy. Products in this list have strong ingredient profiles and reviews within the ${filterLbl} budget.`
                : `Products with ${filterLbl} are specifically beneficial for ${concernLbl}. Check ingredient scores to verify potency.`,
        },
      ];

  return (
    <article className="space-y-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-[#8a7a76] flex flex-wrap gap-1 items-center">
        <Link href={`/${locale}`} className="hover:text-rose-500 transition-colors">
          {isTh ? "หน้าหลัก" : "Home"}
        </Link>
        <span>/</span>
        <Link href={`/${locale}/${concern}`} className="hover:text-rose-500 transition-colors">
          {concernLbl}
        </Link>
        <span>/</span>
        <span className="text-[#2b2222] font-medium">{filterLbl}</span>
      </nav>

      {/* Hero */}
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-[#c9a86a] font-bold">
          {fc.emoji} {filterLbl}
        </p>
        <h1 className="font-serif-display text-2xl sm:text-4xl font-semibold text-[#2b2222] leading-tight">
          {h1}
        </h1>
        <p className="text-base text-neutral-600 max-w-prose leading-relaxed">{intro}</p>
      </header>

      {/* Related filter chips */}
      {relatedFilters.length > 0 && (
        <section className="space-y-2">
          <p className="text-xs text-neutral-400 uppercase tracking-wider">
            {isTh ? "ดูเพิ่มเติม:" : "Also:"}
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/${locale}/${concern}`}
              className="text-sm px-3 py-1.5 rounded-full border border-[#efe1db] bg-white text-[#8a7a76] hover:text-rose-500 hover:border-rose-300 transition-colors"
            >
              {isTh ? `${concernLabelShort(locale, concern)} ทั้งหมด` : `All ${concernLabelShort(locale, concern)}`}
            </Link>
            {relatedFilters.map((slug) => {
              const f = getFilter(slug);
              if (!f) return null;
              return (
                <Link
                  key={slug}
                  href={`/${locale}/${concern}/${slug}`}
                  className="text-sm px-3 py-1.5 rounded-full border border-[#efe1db] bg-white text-[#8a7a76] hover:text-rose-500 hover:border-rose-300 transition-colors"
                >
                  {f.emoji} {isTh ? f.th : f.en}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Product list */}
      <section className="space-y-3">
        <h2 className="font-serif-display text-xl font-semibold text-[#2b2222]">
          {isTh ? `${products.length} ผลิตภัณฑ์ — เรียงตามคะแนน` : `${products.length} products — ranked by score`}
        </h2>
        <div className="rounded-2xl border border-[#efe1db] overflow-hidden bg-white">
          {/* Table header */}
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
            const score = p.total_score[concern] ?? 0;
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

      {/* FAQ blocks */}
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

      {/* Other concerns */}
      <section className="space-y-3 border-t border-[#efe1db] pt-8">
        <p className="text-xs uppercase tracking-widest text-[#c9a86a] font-bold">
          {isTh ? "ดูหมวดอื่น" : "Other concerns"}
        </p>
        <div className="flex flex-wrap gap-2">
          {CONCERNS.filter((c) => c !== concern).map((c) => (
            <Link
              key={c}
              href={`/${locale}/${c}/${filter}`}
              className="text-sm px-3 py-1.5 rounded-full border border-[#efe1db] bg-white text-[#8a7a76] hover:text-rose-500 hover:border-rose-300 transition-colors"
            >
              {concernLabelShort(locale, c)} {fc.emoji}
            </Link>
          ))}
        </div>
      </section>

      <JsonLd data={faqLd(faqQas)} />
      <JsonLd
        data={itemListLd(
          `${BASE}/${locale}/${concern}/${filter}`,
          products.slice(0, 30),
          (p) => `${BASE}/${locale}/product/${productSlug(p)}`
        )}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "BangkokFillers", url: `${BASE}/${locale}` },
          { name: concernLbl, url: `${BASE}/${locale}/${concern}` },
          { name: filterLbl, url: `${BASE}/${locale}/${concern}/${filter}` },
        ])}
      />
    </article>
  );
}
