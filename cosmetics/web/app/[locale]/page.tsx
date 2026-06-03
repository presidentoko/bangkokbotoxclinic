import type { Metadata } from "next";
import Link from "next/link";
import { t, concernLabel, type Locale } from "@/lib/i18n";
import { CONCERNS, getRanking, bestSellersAllConcerns, topPicks } from "@/lib/data";
import { ProductStrip } from "@/components/ProductStrip";

const BASE = "https://bangkokfillers.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  const title =
    loc === "th"
      ? { absolute: "BangkokFillers — เชื่อข้อมูล ไม่ใช่อินฟลูเอนเซอร์" }
      : { absolute: "BangkokFillers — Trust data, not influencers" };
  const description =
    loc === "th"
      ? "จัดอันดับผลิตภัณฑ์สกินแคร์ไทยด้วยข้อมูลส่วนผสมและรีวิวจริง — สิว, ฝ้า กระ จุดด่างดำ"
      : "Thai skincare products ranked by ingredient science and real reviews — acne, brightening & dark spots.";
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${loc}`,
      languages: {
        th: `${BASE}/th`,
        en: `${BASE}/en`,
      },
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
  const acnePicks = topPicks("acne", 8);
  const whiteningPicks = topPicks("whitening", 8);

  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="pt-6 pb-2 space-y-4">
        <h1 className="font-serif-display text-4xl sm:text-5xl font-semibold text-[#2b2222] leading-tight max-w-2xl">
          {t(locale, "site_name")}
        </h1>
        <p className="text-xl text-[#8a7a76] max-w-xl leading-relaxed">
          {t(locale, "tagline")}
        </p>
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
    </div>
  );
}
