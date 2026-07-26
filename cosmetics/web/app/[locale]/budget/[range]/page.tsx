import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LOCALES, STATIC_LOCALES, type Locale } from "@/lib/i18n";
import { allProducts, productSlug } from "@/lib/data";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = false;
// 2026-07-13 긴급 픽스 — ISR Writes 한도 초과 대응. range는 3개 고정값뿐이라
// 온디맨드 렌더 허용할 이유 없음.
export const dynamicParams = false;

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://bangkokfillers.com";

const BUDGET_RANGES = [
  { slug: "under-300",  max: 300,  th: "งบ 300 บาท",  en: "Under ฿300"  },
  { slug: "under-500",  max: 500,  th: "งบ 500 บาท",  en: "Under ฿500"  },
  { slug: "under-1000", max: 1000, th: "งบ 1000 บาท", en: "Under ฿1000" },
] as const;

function getRange(slug: string) {
  return BUDGET_RANGES.find((r) => r.slug === slug) ?? null;
}

function getBudgetProducts(max: number, limit = 40) {
  return allProducts()
    .filter((p) => p.price_thb > 0 && p.price_thb <= max)
    .map((p) => {
      const vals = Object.values(p.total_score ?? {});
      const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
      return { ...p, _avg: avg };
    })
    .sort((a, b) => b._avg - a._avg)
    .slice(0, limit);
}

export async function generateStaticParams() {
  return STATIC_LOCALES.flatMap((locale) =>
    BUDGET_RANGES.map((r) => ({ locale, range: r.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; range: string }>;
}): Promise<Metadata> {
  const { locale, range } = await params;
  const loc = locale as Locale;
  const r = getRange(range);
  if (!r) return {};

  const title =
    loc === "th"
      ? `สกินแคร์${r.th} — ตัวเลือกที่ดีที่สุด | BangkokFillers`
      : `Best Skincare ${r.en} | BangkokFillers`;
  const description =
    loc === "th"
      ? `รวมสกินแคร์ ${r.th} จัดอันดับโดยคะแนนรีวิวจริงและประสิทธิภาพของส่วนผสม`
      : `Top skincare products ${r.en}, ranked by real reviews and ingredient efficacy`;

  const pageUrl = `${BASE}/${locale}/budget/${range}`;
  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}/budget/${range}`])),
    },
    openGraph: { title, description, url: pageUrl },
  };
}

export default async function BudgetPage({
  params,
}: {
  params: Promise<{ locale: string; range: string }>;
}) {
  const { locale, range } = await params;
  const loc = locale as Locale;
  if (!LOCALES.includes(loc)) notFound();

  const r = getRange(range);
  if (!r) notFound();

  const products = getBudgetProducts(r.max);
  const isTh = loc === "th";
  const heading = isTh ? `สกินแคร์${r.th} ดีที่สุด` : `Best Skincare ${r.en}`;
  const pageUrl = `${BASE}/${loc}/budget/${range}`;

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": heading,
    "url": pageUrl,
    "numberOfItems": products.length,
    "itemListElement": products.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": p.name,
      "url": `${BASE}/${loc}/product/${productSlug(p)}`,
    })),
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-1">{heading}</h1>
      <p className="text-gray-500 mb-8">
        {isTh
          ? `จัดอันดับโดยคะแนนรีวิวจริงและประสิทธิภาพส่วนผสม — ${products.length} รายการ`
          : `Ranked by real reviews and ingredient scores — ${products.length} products`}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((p, i) => (
          <a
            key={p.product_id}
            href={`/${loc}/product/${productSlug(p)}`}
            className="relative group rounded-xl border bg-white p-3 flex flex-col hover:shadow-md transition-shadow"
          >
            <span className="absolute top-2 left-2 rounded-full bg-rose-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center">
              {i + 1}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image_url} alt={p.name} className="w-full h-28 object-contain mb-2" />
            <p className="text-xs font-medium line-clamp-2 flex-1">{p.name}</p>
            <span className="mt-2 text-rose-600 font-bold text-sm">฿{p.price_thb}</span>
          </a>
        ))}
      </div>

      <p className="mt-12 text-sm text-gray-500 max-w-2xl">
        {isTh
          ? `รายการนี้รวมสินค้าที่ราคาไม่เกิน ฿${r.max} จัดอันดับโดยข้อมูลจริง อัปเดตทุก 5 นาที`
          : `Products priced under ฿${r.max}, ranked by real data, updated every 5 minutes.`}
      </p>

      <JsonLd data={itemList} />
    </main>
  );
}
