import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LOCALES, type Locale } from "@/lib/i18n";
import { productSlug } from "@/lib/data";
import { SALE_EVENTS, getSaleEvent, getSaleRanking } from "@/lib/sale";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 86400;

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://bangkokfillers.com";

export async function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    SALE_EVENTS.map((e) => ({ locale, event: e.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; event: string }>;
}): Promise<Metadata> {
  const { locale, event } = await params;
  const loc = locale as Locale;
  const ev = getSaleEvent(event);
  if (!ev) return {};

  const title =
    loc === "th"
      ? `ดีลสกินแคร์ ${ev.labelTh} ที่คุ้มสุด 2026 | BangkokFillers`
      : `Best Skincare ${ev.labelEn} Deals 2026 | BangkokFillers`;
  const description =
    loc === "th"
      ? `รวมสกินแคร์ลดราคา ${ev.labelTh} จัดอันดับโดยข้อมูล — ส่วนลดสูงสุด × คะแนนจากรีวิวจริง`
      : `Top skincare ${ev.labelEn} discounts ranked by data — highest discount × real review scores`;

  const pageUrl = `${BASE}/${locale}/sale/${event}`;
  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}/sale/${event}`])),
    },
    openGraph: { title, description, url: pageUrl },
  };
}

export default async function SalePage({
  params,
}: {
  params: Promise<{ locale: string; event: string }>;
}) {
  const { locale, event } = await params;
  const loc = locale as Locale;
  if (!LOCALES.includes(loc)) notFound();

  const ev = getSaleEvent(event);
  if (!ev) notFound();

  const products = getSaleRanking(60);
  const isTh = loc === "th";

  const heading = isTh
    ? `ดีลสกินแคร์ ${ev.labelTh} คุ้มสุด`
    : `Best Skincare ${ev.labelEn} Deals`;
  const sub = isTh
    ? `จัดอันดับโดยส่วนลด × คะแนนจากรีวิวจริง`
    : `Ranked by discount × real review scores`;

  const pageUrl = `${BASE}/${loc}/sale/${event}`;

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
      <p className="text-gray-500 mb-8">{sub}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((p, i) => {
          const slug = productSlug(p);
          return (
            <a
              key={p.product_id}
              href={`/${loc}/product/${slug}`}
              className="group relative rounded-xl border bg-white p-3 flex flex-col hover:shadow-md transition-shadow"
            >
              <span className="absolute top-2 left-2 rounded-full bg-rose-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center">
                {i + 1}
              </span>
              <span className="absolute top-2 right-2 rounded-full bg-amber-400 text-white text-xs font-bold px-1.5 py-0.5">
                -{p.discount_pct}%
              </span>
              <img
                src={p.image_url}
                alt={p.name}
                className="w-full h-28 object-contain mb-2"
              />
              <p className="text-xs font-medium line-clamp-2 flex-1">{p.name}</p>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-rose-600 font-bold text-sm">฿{p.price_thb}</span>
                {p.list_price_thb > p.price_thb && (
                  <span className="text-gray-400 text-xs line-through">฿{p.list_price_thb}</span>
                )}
              </div>
            </a>
          );
        })}
      </div>

      <p className="mt-12 text-sm text-gray-500 max-w-2xl">
        {isTh
          ? `รายการนี้คัดจากสินค้าที่มีส่วนลด จัดอันดับโดยสูตร "ส่วนลด × คะแนนจากรีวิวจริง" อัปเดตทุก 5 นาที`
          : `This list is compiled from discounted products ranked by "discount × real review score", updated every 5 minutes.`}
      </p>

      <JsonLd data={itemList} />
    </main>
  );
}
