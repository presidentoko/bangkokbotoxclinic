import type { Metadata } from "next";
import Link from "next/link";
import { t, concernLabel, LOCALES, type Locale } from "@/lib/i18n";
import { CONCERNS, getRanking, bestSellersAllConcerns, topPicks, hotDeals, siteStats, mostLoved, getProduct, productSlug } from "@/lib/data";
import { ProductStrip } from "@/components/ProductStrip";
import { JsonLd } from "@/components/JsonLd";
import { getActiveByType } from "@/lib/ads";
import { SponsoredBadge } from "@/components/SponsoredBadge";
import { orgLd, websiteLd, faqLd } from "@/lib/schema";

const BASE = "https://bangkokfillers.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const TITLES: Record<string, string> = {
    th: "BangkokFillers — เชื่อข้อมูล ไม่ใช่อินฟลูเอนเซอร์",
    en: "BangkokFillers — Trust data, not influencers",
    ko: "방콕 화장품 추천 — 태국 여행 스킨케어 순위 | BangkokFillers",
    ja: "バンコク旅行コスメおすすめ — タイスキンケアランキング | BangkokFillers",
    ar: "أفضل مستحضرات تجميل تايلاند للسياح | BangkokFillers",
  };
  const DESCS: Record<string, string> = {
    th: "จัดอันดับผลิตภัณฑ์สกินแคร์ไทยด้วยข้อมูลส่วนผสมและรีวิวจริง — สิว, ฝ้า กระ จุดด่างดำ",
    en: "Thai skincare products ranked by ingredient science and real reviews — acne, brightening & dark spots.",
    ko: "방콕 여행에서 사야 할 태국 스킨케어 추천 — 4,000개 이상 제품을 성분 데이터와 실제 리뷰로 순위 매긴 완벽 가이드",
    ja: "バンコク旅行で買うべきタイスキンケア完全ガイド — 4,000以上の製品を成分データと実際のレビューでランキング",
    ar: "أفضل منتجات العناية بالبشرة التايلاندية للسياح في بانكوك — أكثر من 4,000 منتج مصنّف بالبيانات والمراجعات الحقيقية",
  };
  const title = { absolute: TITLES[loc] ?? TITLES["en"] };
  const description = DESCS[loc] ?? DESCS["en"];
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${loc}`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}`])),
    },
  };
}

const TRUST_POINTS = [
  {
    key: "ingredient",
    th: "ส่วนผสม",
    en: "Ingredients",
    descTh: "วิเคราะห์ส่วนผสมจากฐานข้อมูลวิทยาศาสตร์",
    descEn: "Analysed against peer-reviewed ingredient databases",
  },
  {
    key: "review",
    th: "รีวิว",
    en: "Reviews",
    descTh: "รวบรวมคะแนนรีวิวจริงจากผู้ใช้จริง",
    descEn: "Aggregated from real verified purchaser reviews",
  },
  {
    key: "value",
    th: "ความคุ้มค่า",
    en: "Value",
    descTh: "เปรียบเทียบราคาต่อมล./กรัม",
    descEn: "Price-per-ml/g comparison across brands",
  },
] as const;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale as Locale;
  const isTh = locale === "th";

  // Data for discovery strips
  const trending = bestSellersAllConcerns(10);
  const [featuredSlot] = await getActiveByType("homepage_featured");
  const featuredProduct = featuredSlot ? getProduct(featuredSlot.productId) : null;
  const acnePicks = topPicks("acne", 8);
  const whiteningPicks = topPicks("whitening", 8);
  const antiagingPicks = topPicks("antiaging", 8);
  const deals = hotDeals(30, 10);
  const loved = mostLoved("acne", 8);
  const stats = siteStats();

  const fmtNum = (n: number) =>
    n >= 1_000_000
      ? `${(n / 1_000_000).toFixed(1)}M`
      : n >= 1_000
        ? `${Math.round(n / 1_000)}K`
        : String(n);

  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="pt-6 pb-2 space-y-5">
        <h1 className="font-serif-display text-4xl sm:text-5xl font-semibold text-[#2b2222] leading-tight max-w-2xl">
          {t(locale, "site_name")}
        </h1>
        <p className="text-xl text-[#8a7a76] max-w-xl leading-relaxed">
          {t(locale, "tagline")}
        </p>

        {/* Stats bar — social proof */}
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {[
            {
              value: fmtNum(stats.products),
              label: isTh ? "ผลิตภัณฑ์" : "products analysed",
            },
            {
              value: fmtNum(stats.reviews),
              label: isTh ? "รีวิวที่รวบรวม" : "reviews aggregated",
            },
            {
              value: fmtNum(stats.sold),
              label: isTh ? "ยอดสั่งซื้อรวม" : "total units sold",
            },
          ].map(({ value, label }) => (
            <div key={label} className="flex items-baseline gap-1.5">
              <span className="font-serif-display text-2xl font-black text-rose-500 tabular-nums">
                {value}
              </span>
              <span className="text-xs text-neutral-500">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Quiz CTA */}
      <section>
        <Link
          href={`/${locale}/quiz`}
          className="flex items-center justify-between gap-4 rounded-3xl overflow-hidden px-6 py-5 transition-all hover:shadow-md hover:shadow-rose-100 hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #fff0f3 0%, #fce4ec 50%, #fff8f0 100%)",
            border: "1.5px solid #f0d9d5",
          }}
        >
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-widest text-[#c9a86a] font-bold">
              {isTh ? "แบบทดสอบ 3 ข้อ" : "3-question quiz"}
            </p>
            <p className="font-serif-display text-lg font-semibold text-[#2b2222]">
              {isTh ? "หาสกินแคร์ที่ใช่สำหรับคุณ 🌸" : "Find your perfect skincare 🌸"}
            </p>
            <p className="text-xs text-neutral-500">
              {isTh ? "แชร์ผลลัพธ์กับเพื่อนได้เลย" : "Get personalised picks · shareable results"}
            </p>
          </div>
          <div className="flex-shrink-0 bg-rose-500 text-white rounded-2xl px-4 py-2.5 font-semibold text-sm shadow-sm shadow-rose-200 whitespace-nowrap">
            {isTh ? "เริ่มเลย →" : "Start →"}
          </div>
        </Link>
      </section>

      {/* Concern cards */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CONCERNS.map((c) => {
            const count = getRanking(c).length;
            return (
              <Link
                key={c}
                href={`/${locale}/${c}`}
                className="group rounded-2xl border border-[#efe1db] bg-white p-6 sm:p-7 hover:shadow-md hover:shadow-rose-100 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
              >
                <div className="font-serif-display text-xl font-semibold text-[#2b2222] group-hover:text-rose-500 transition-colors break-words">
                  {concernLabel(locale, c)}
                </div>
                <div className="mt-2 text-sm font-medium text-neutral-600">
                  {count} {t(locale, "product")}
                </div>
                <div className="mt-1 text-xs text-neutral-400 uppercase tracking-wide">
                  {isTh ? "จัดอันดับตามข้อมูล" : "data-ranked"}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Sponsored: Homepage Featured */}
      {featuredProduct && (
        <section className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-4 items-center">
            <img
              src={featuredProduct.image_url}
              alt={featuredProduct.name}
              className="w-20 h-20 object-contain rounded-lg shrink-0 bg-white"
            />
            <div className="flex-1 min-w-0">
              <SponsoredBadge locale={locale} className="mb-1" />
              <p className="font-semibold text-sm line-clamp-2">{featuredProduct.name}</p>
              <p className="text-rose-600 font-semibold text-sm">฿{featuredProduct.price_thb}</p>
            </div>
            <a
              href={`/${locale}/product/${productSlug(featuredProduct)}`}
              className="shrink-0 rounded-lg bg-rose-600 px-3 py-1.5 text-sm text-white font-medium"
            >
              {locale === "th" ? "ดูเลย" : "View"}
            </a>
          </div>
        </section>
      )}

      {/* Trending strip */}
      {trending.length > 0 && (
        <ProductStrip
          title={t(locale, "trending")}
          eyebrow={isTh ? "ฮิตตอนนี้" : "Hot right now"}
          products={trending}
          locale={locale}
          proof="sold"
        />
      )}

      {/* Our Picks — Acne */}
      {acnePicks.length > 0 && (
        <ProductStrip
          title={
            isTh
              ? `${t(locale, "our_picks")} · ${concernLabel(locale, "acne")}`
              : `${t(locale, "our_picks")} · ${concernLabel(locale, "acne")}`
          }
          eyebrow={isTh ? "บรรณาธิการแนะนำ" : "Editor's picks"}
          subtitle={
            isTh
              ? "คัดโดยคะแนนส่วนผสม + รีวิวจริง"
              : "Selected by ingredient score + real reviews"
          }
          products={acnePicks}
          locale={locale}
          concern="acne"
          proof="score"
        />
      )}

      {/* Our Picks — Whitening */}
      {whiteningPicks.length > 0 && (
        <ProductStrip
          title={
            isTh
              ? `${t(locale, "our_picks")} · ${concernLabel(locale, "whitening")}`
              : `${t(locale, "our_picks")} · ${concernLabel(locale, "whitening")}`
          }
          eyebrow={isTh ? "บรรณาธิการแนะนำ" : "Editor's picks"}
          subtitle={
            isTh
              ? "คัดโดยคะแนนส่วนผสม + รีวิวจริง"
              : "Selected by ingredient score + real reviews"
          }
          products={whiteningPicks}
          locale={locale}
          concern="whitening"
          proof="score"
        />
      )}

      {/* Hot deals */}
      {deals.length > 0 && (
        <ProductStrip
          title={isTh ? "ดีลร้อน — ลดราคาหนักมาก" : "Hot deals — biggest discounts"}
          eyebrow={isTh ? "ราคาถูก" : "Price drop"}
          subtitle={isTh ? "ลด 30% ขึ้นไป จัดอันดับตามส่วนลด" : "30%+ off, ranked by discount"}
          products={deals}
          locale={locale}
          proof="sold"
        />
      )}

      {/* Antiaging */}
      {antiagingPicks.length > 0 && (
        <ProductStrip
          title={isTh ? `${t(locale, "our_picks")} · ${concernLabel(locale, "antiaging")}` : `${t(locale, "our_picks")} · ${concernLabel(locale, "antiaging")}`}
          eyebrow={isTh ? "ต่อต้านริ้วรอย" : "Anti-aging"}
          subtitle={isTh ? "เรตินอล วิตามินซี คอลลาเจน — คะแนนสูงสุด" : "Retinol, Vitamin C, Collagen — top scored"}
          products={antiagingPicks}
          locale={locale}
          concern="antiaging"
          proof="score"
        />
      )}

      {/* Most loved */}
      {loved.length > 0 && (
        <ProductStrip
          title={t(locale, "most_loved")}
          eyebrow={isTh ? "รีวิวเยอะสุด" : "Most reviewed"}
          subtitle={isTh ? "รีวิวมากที่สุด เรตติ้งสูงสุด" : "Highest review count and rating"}
          products={loved}
          locale={locale}
          concern="acne"
          proof="loved"
        />
      )}

      {/* Trust strip */}
      <section className="border-t border-[#efe1db] pt-10 space-y-5">
        <p className="text-xs uppercase tracking-widest text-[#c9a86a] font-medium">
          {isTh ? "วิธีที่เราจัดอันดับ" : "How we rank"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TRUST_POINTS.map((p) => (
            <div key={p.key} className="space-y-1">
              <div className="font-serif-display text-base font-semibold text-[#1a1a1a]">
                {isTh ? p.th : p.en}
              </div>
              <div className="text-sm text-neutral-500 leading-snug">
                {isTh ? p.descTh : p.descEn}
              </div>
            </div>
          ))}
        </div>
        <div>
          <Link
            href={`/${locale}/methodology`}
            className="text-sm text-rose-500 hover:text-rose-600 transition-colors underline underline-offset-2"
          >
            {t(locale, "methodology")} &rarr;
          </Link>
        </div>
      </section>
      <JsonLd data={orgLd("https://bangkokfillers.com")} />
      <JsonLd data={websiteLd("https://bangkokfillers.com", locale)} />
      <JsonLd data={faqLd(isTh ? [
        { q: "BangkokFillers จัดอันดับผลิตภัณฑ์อย่างไร", a: "คะแนนมาจาก 3 มิติ: ส่วนผสมออกฤทธิ์ 45% (อ้างอิงฐานข้อมูลวิทยาศาสตร์), รีวิวจากผู้ซื้อจริง 45% (รวบรวมจาก Konvy, Watsons, Boots, iHerb), และความคุ้มค่าต่อมล/กรัม 10%" },
        { q: "ข้อมูลราคาอัปเดตบ่อยแค่ไหน", a: "ราคาและสต็อกอัปเดตอัตโนมัติทุกวันจากแหล่งขายออนไลน์ชั้นนำในไทย" },
        { q: "ผลิตภัณฑ์ไทยสำหรับสิวที่ดีที่สุดคืออะไร", a: "ดูหน้าจัดอันดับสิว — อันดับ 1 คำนวณจากส่วนผสม เช่น Salicylic Acid, Niacinamide และรีวิวจากผู้ใช้จริงกว่าหมื่นรีวิว" },
        { q: "สามารถเปรียบเทียบผลิตภัณฑ์ได้ไหม", a: "ได้ — ใช้ฟีเจอร์ Compare เปรียบเทียบส่วนผสม ราคา และคะแนนรีวิวแบบเคียงข้างกันได้สูงสุด 3 รายการ" },
        { q: "ข้อมูลส่วนผสมมาจากไหน", a: "วิเคราะห์จากฐานข้อมูลส่วนผสมที่ผ่านการตรวจสอบทางวิทยาศาสตร์ ครอบคลุมประสิทธิภาพและความปลอดภัยของส่วนผสมแต่ละตัว" },
      ] : [
        { q: "How does BangkokFillers rank products?", a: "Scores are built from 3 dimensions: Active ingredients 45% (peer-reviewed evidence database), Real buyer reviews 45% (aggregated from Konvy, Watsons, Boots, iHerb), and Value-per-ml/g 10%." },
        { q: "How often is pricing data updated?", a: "Prices and stock are updated automatically every day from leading Thai online retailers." },
        { q: "What is the best Thai skincare product for acne?", a: "See the acne ranking page — #1 is calculated from actives like Salicylic Acid and Niacinamide combined with tens of thousands of real user reviews." },
        { q: "Can I compare products side by side?", a: "Yes — use the Compare feature to compare ingredients, pricing, and review scores for up to 3 products at once." },
        { q: "Where does the ingredient data come from?", a: "Analysed against a peer-reviewed ingredient efficacy and safety database covering the mechanism and evidence level of each active." },
      ])} />
    </div>
  );
}
