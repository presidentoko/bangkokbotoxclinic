import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STATIC_LOCALES, localeAlternates, type Locale } from "@/lib/i18n";
import { brandSlug, productSlug, getProduct } from "@/lib/data";
import { faqLd, breadcrumbLd } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { FaqSection } from "@/components/FaqSection";
import {
  trendingData,
  trendingBrands,
  trendingProducts,
  hasTrendingData,
} from "@/lib/trending";

const BASE = "https://bangkokfillers.com";

// Rebuilt by deploy like every other page — data/trending.json is a static
// import, so regenerating on a timer would write identical bytes and spend ISR
// quota for nothing (the mistake that blew this project's write limit once).
export const revalidate = false;

export function generateStaticParams() {
  return STATIC_LOCALES.map((locale) => ({ locale }));
}

function copy(locale: Locale) {
  const isTh = locale === "th";
  const d = trendingData();
  return {
    isTh,
    // "recently", never "this week" — a cosmetics brand draws one to three
    // Pantip threads a quarter, so a weekly framing would be a claim the data
    // cannot support. See cosmetics/pantip_trending.py.
    title: isTh
      ? `คนไทยกำลังพูดถึงแบรนด์ไหนใน Pantip (${d.window_days} วันล่าสุด)`
      : `What Thai Pantip is discussing (last ${d.window_days} days)`,
    description: isTh
      ? `รวมกระทู้ Pantip ที่พูดถึงแบรนด์สกินแคร์ในช่วง ${d.window_days} วันล่าสุด พร้อมวันที่และลิงก์กระทู้จริง อัปเดต ${d.generated_at.slice(0, 10)}`
      : `Pantip threads discussing skincare brands over the last ${d.window_days} days, with real dates and links. Updated ${d.generated_at.slice(0, 10)}.`,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  if (!hasTrendingData()) return { robots: { index: false, follow: true } };
  const { title, description } = copy(loc);
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${loc}/trending`,
      languages: localeAlternates((l) => `${BASE}/${l}/trending`),
    },
    openGraph: { title, description, url: `${BASE}/${loc}/trending` },
  };
}

export default async function TrendingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = raw as Locale;
  // An empty collection means the collector has not run or found nothing.
  // Publishing an empty "what people are discussing" page is worse than not
  // having one.
  if (!hasTrendingData()) notFound();

  const d = trendingData();
  const { isTh, title, description } = copy(locale);
  const brands = trendingBrands(20);
  const products = trendingProducts(12);
  const updated = d.generated_at.slice(0, 10);

  const faqs = isTh
    ? [
        {
          q: "ข้อมูลนี้มาจากไหน",
          a: `เรารวบรวมกระทู้จากการค้นหาชื่อแบรนด์บน Pantip ทั้งภาษาอังกฤษและภาษาไทย แล้วเก็บเฉพาะกระทู้ที่โพสต์ภายใน ${d.window_days} วันล่าสุดและมีเนื้อหาเกี่ยวกับเครื่องสำอางหรือสกินแคร์ ทุกกระทู้ในหน้านี้ลิงก์กลับไปยังต้นทางจริงพร้อมวันที่`,
        },
        {
          q: "จัดอันดับอย่างไร",
          a: "เรียงตามความถี่ของการพูดถึงถ่วงน้ำหนักด้วยความใหม่และจำนวนความเห็น กระทู้ที่เพิ่งโพสต์มีน้ำหนักมากกว่ากระทู้เก่า ไม่ใช่คะแนนคุณภาพสินค้า และไม่เกี่ยวกับคะแนนจัดอันดับของเรา",
        },
        {
          q: "ทำไมถึงเป็นช่วง 90 วัน ไม่ใช่รายสัปดาห์",
          a: "แบรนด์เครื่องสำอางหนึ่งแบรนด์มีกระทู้บน Pantip ราวไตรมาสละ 1-3 กระทู้ การทำเป็นชาร์ตรายสัปดาห์จึงเป็นการอ้างเกินกว่าที่ข้อมูลรองรับ",
        },
        {
          q: "การถูกพูดถึงมาก แปลว่าดีไหม",
          a: "ไม่ กระทู้จำนวนมากอาจมาจากโฆษณา ดราม่า หรือคำถามเรื่องผลข้างเคียงก็ได้ ให้ดูคะแนนและส่วนผสมในหน้าสินค้าประกอบเสมอ",
        },
      ]
    : [
        {
          q: "Where does this come from?",
          a: `Pantip threads found by searching each brand name in both English and Thai, kept when they were posted within the last ${d.window_days} days and are actually about cosmetics. Every thread links back to its source with its date.`,
        },
        {
          q: "How is it ordered?",
          a: "By how often a brand is mentioned, weighted towards recent threads and reply counts. It is not a quality score and is unrelated to our product ranking.",
        },
        {
          q: "Why 90 days rather than weekly?",
          a: "A cosmetics brand draws roughly one to three Pantip threads a quarter. A weekly chart would claim more than the data supports.",
        },
        {
          q: "Does more discussion mean better?",
          a: "No. Volume can come from advertising, controversy or side-effect questions. Read it alongside the score and ingredients on the product page.",
        },
      ];

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <nav className="text-xs text-neutral-400 flex items-center gap-1.5">
          <Link href={`/${locale}`} className="hover:text-rose-500 transition-colors">
            BangkokFillers
          </Link>
          <span>›</span>
          <span className="text-neutral-600">{isTh ? "กำลังถูกพูดถึง" : "Being discussed"}</span>
        </nav>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#2b2222]">
          {title}
        </h1>
        <p className="text-neutral-500 text-sm max-w-prose leading-relaxed">{description}</p>
        <p className="text-xs text-[#8a7a76]">
          {isTh
            ? `สแกน ${d.threads_in_window} กระทู้ในช่วง ${d.window_days} วัน · ระบุแบรนด์ได้ ${d.threads_attributed} กระทู้ · อัปเดต ${updated}`
            : `${d.threads_in_window} threads scanned in the ${d.window_days}-day window · ${d.threads_attributed} matched to a brand we cover · updated ${updated}`}
        </p>
      </header>

      {/* ── Brands ───────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="font-serif-display text-lg font-semibold text-[#2b2222]">
          {isTh ? "แบรนด์ที่ถูกพูดถึง" : "Brands being discussed"}
        </h2>
        <div className="space-y-3">
          {brands.map((b, i) => (
            <div
              key={b.brand}
              className="rounded-2xl border border-[#efe1db] bg-white shadow-sm shadow-rose-100 px-5 py-4 space-y-2"
            >
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-sm font-bold text-[#c9a86a]">{i + 1}</span>
                <Link
                  href={`/${locale}/brand/${brandSlug(b.brand)}`}
                  className="font-semibold text-[#2b2222] hover:text-rose-600 transition-colors"
                >
                  {b.brand}
                </Link>
                {b.brand_th && (
                  <span className="text-sm text-[#8a7a76]">{b.brand_th}</span>
                )}
                <span className="text-xs text-neutral-400">
                  {isTh ? `${b.thread_count} กระทู้` : `${b.thread_count} threads`}
                </span>
              </div>
              <ul className="space-y-1.5">
                {b.threads.map((t) => (
                  <li key={t.topic_id} className="text-sm leading-relaxed">
                    <a
                      href={t.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-neutral-700 hover:text-rose-600 transition-colors"
                    >
                      {t.title}
                    </a>
                    <span className="text-xs text-neutral-400 ml-2 whitespace-nowrap">
                      {t.date}
                      {t.replies > 0 && ` · ${t.replies} ${isTh ? "ความเห็น" : "replies"}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Products. Usually empty: publishing a product needs two separate
             threads, and one thread naming a line matched six pack variants of
             it on the first run. ─────────────────────────────────────── */}
      {products.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-serif-display text-lg font-semibold text-[#2b2222]">
            {isTh ? "สินค้าที่ถูกพูดถึงเป็นชื่อรุ่น" : "Products named specifically"}
          </h2>
          <div className="space-y-3">
            {products.map((p) => {
              const prod = getProduct(p.product_id);
              return (
                <div
                  key={p.product_id}
                  className="rounded-2xl border border-[#efe1db] bg-white shadow-sm shadow-rose-100 px-5 py-4 space-y-2"
                >
                  <p className="text-xs text-rose-500 font-semibold">{p.brand}</p>
                  {prod ? (
                    <Link
                      href={`/${locale}/product/${productSlug(prod)}`}
                      className="font-semibold text-[#2b2222] hover:text-rose-600 transition-colors"
                    >
                      {p.name}
                    </Link>
                  ) : (
                    <span className="font-semibold text-[#2b2222]">{p.name}</span>
                  )}
                  <ul className="space-y-1.5">
                    {p.threads.map((t) => (
                      <li key={t.topic_id} className="text-sm">
                        <a
                          href={t.url}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="text-neutral-700 hover:text-rose-600 transition-colors"
                        >
                          {t.title}
                        </a>
                        <span className="text-xs text-neutral-400 ml-2">{t.date}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <p className="text-xs text-[#8a7a76] leading-relaxed max-w-prose">
        {isTh
          ? "การถูกพูดถึงบ่อยไม่ได้แปลว่าดี กระทู้อาจมาจากโฆษณาหรือคำถามเรื่องผลข้างเคียงก็ได้ — อ่านคู่กับคะแนนและส่วนผสมในหน้าสินค้าเสมอ"
          : "Being discussed is not the same as being good — threads can come from advertising or from side-effect questions. Read this alongside the score and ingredients on each product page."}
      </p>

      <FaqSection faqs={faqs} locale={locale} />

      <JsonLd data={faqLd(faqs)} />
      <JsonLd
        data={breadcrumbLd([
          { name: "BangkokFillers", url: `${BASE}/${locale}` },
          { name: isTh ? "กำลังถูกพูดถึง" : "Being discussed", url: `${BASE}/${locale}/trending` },
        ])}
      />
    </div>
  );
}
