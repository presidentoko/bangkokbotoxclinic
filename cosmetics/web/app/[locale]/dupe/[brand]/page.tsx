import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LOCALES, STATIC_LOCALES, localeAlternates, localeOgImage, type Locale } from "@/lib/i18n";
import {
  allBrands,
  brandSlug,
  brandFromSlug,
  brandProducts,
  cheaperAlternatives,
  productSlug,
  CONCERNS,
  type Concern,
} from "@/lib/data";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = false;
// 2026-07-13 긴급 픽스 — ISR Writes 한도 초과 대응. 유효 브랜드는
// generateStaticParams가 전부 열거하므로 온디맨드 렌더 허용할 이유 없음.
export const dynamicParams = false;

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://bangkokfillers.com";

/**
 * Extract the primary concern from concern_seeds (string | string[]).
 * Returns a value from CONCERNS, defaulting to "acne".
 */
function primaryConcern(seeds: string | string[]): Concern {
  const arr = Array.isArray(seeds) ? seeds : String(seeds ?? "").split("|");
  for (const s of arr) {
    const trimmed = s.trim() as Concern;
    if (CONCERNS.includes(trimmed)) return trimmed;
  }
  return "acne";
}

export async function generateStaticParams() {
  const brands = allBrands();
  return STATIC_LOCALES.flatMap((locale) =>
    brands.map((brand) => ({
      locale,
      brand: brandSlug(brand),
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; brand: string }>;
}): Promise<Metadata> {
  const { locale, brand: brandSlugParam } = await params;
  const loc = locale as Locale;
  const brandName = brandFromSlug(brandSlugParam);
  if (!brandName) return {};

  const title =
    loc === "th"
      ? `ดูปของ ${brandName} — ตัวทดแทนราคาประหยัด`
      : `${brandName} Dupes — Affordable Alternatives`;
  const description =
    loc === "th"
      ? `ค้นหาสกินแคร์ราคาประหยัดที่ใกล้เคียงกับ ${brandName} วิเคราะห์จากส่วนผสมและคะแนนรีวิวจริง`
      : `Find affordable skincare alternatives to ${brandName}, matched by ingredient profile and real review scores`;

  const pageUrl = `${BASE}/${locale}/dupe/${brandSlugParam}`;
  // Brands with too few products to build a real dupe comparison produce thin,
  // near-boilerplate pages — keep them crawlable (no internal 404) but out of the index.
  const isThin = brandProducts(brandName).length < 3;
  return {
    title,
    description,
    ...(isThin ? { robots: { index: false, follow: true } } : {}),
    alternates: {
      canonical: pageUrl,
      languages: localeAlternates((l) => `${BASE}/${l}/dupe/${brandSlugParam}`),
    },
    openGraph: { title, description, url: pageUrl, images: [localeOgImage(loc)] },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [localeOgImage(loc).url],
    },
  };
}

export default async function DupePage({
  params,
}: {
  params: Promise<{ locale: string; brand: string }>;
}) {
  const { locale, brand: brandSlugParam } = await params;
  const loc = locale as Locale;
  if (!LOCALES.includes(loc)) notFound();

  const brandName = brandFromSlug(brandSlugParam);
  if (!brandName) notFound();

  const originals = brandProducts(brandName).slice(0, 8);
  if (originals.length === 0) notFound();

  const isTh = loc === "th";
  const heading = isTh ? `ดูปของ ${brandName}` : `${brandName} Dupes`;

  const pairs = originals
    .map((p) => {
      const concern = primaryConcern(p.concern_seeds);
      const dupes = cheaperAlternatives(p, concern).slice(0, 3);
      return { original: p, concern, dupes };
    })
    .filter((pair) => pair.dupes.length > 0);

  if (pairs.length === 0) notFound();

  const pageUrl = `${BASE}/${loc}/dupe/${brandSlugParam}`;
  const allDupes = pairs.flatMap((pair) => pair.dupes);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": heading,
    "url": pageUrl,
    "numberOfItems": allDupes.length,
    "itemListElement": allDupes.map((d, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": d.name,
      "url": `${BASE}/${loc}/product/${productSlug(d)}`,
    })),
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{heading}</h1>
      <p className="text-gray-500 mb-8">
        {isTh
          ? `ตัวทดแทนราคาประหยัดที่มีส่วนผสมใกล้เคียงกัน — วิเคราะห์จากข้อมูลจริง`
          : `Affordable alternatives with similar ingredient profiles — data-matched`}
      </p>

      <div className="space-y-10">
        {pairs.map(({ original, dupes }) => (
          <section key={original.product_id}>
            <div className="flex gap-3 items-center mb-4 p-4 rounded-xl bg-gray-50 border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={original.image_url}
                alt={original.name}
                className="w-16 h-16 object-contain rounded-lg shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                  {isTh ? "ของแท้" : "Original"}
                </p>
                <p className="font-semibold text-sm line-clamp-2">{original.name}</p>
                <p className="text-gray-600 text-sm">฿{original.price_thb}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {dupes.map((d) => {
                const saved = original.price_thb - d.price_thb;
                return (
                  <a
                    key={d.product_id}
                    href={`/${loc}/product/${productSlug(d)}`}
                    className="group rounded-xl border bg-white p-3 flex flex-col hover:shadow-md transition-shadow"
                  >
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 rounded px-1.5 py-0.5 self-start mb-2">
                      {isTh ? `ประหยัด ฿${saved}` : `Save ฿${saved}`}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={d.image_url}
                      alt={d.name}
                      className="w-full h-24 object-contain mb-2"
                    />
                    <p className="text-xs font-medium line-clamp-2 flex-1">{d.name}</p>
                    <p className="text-rose-600 font-bold text-sm mt-1">฿{d.price_thb}</p>
                  </a>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-12 text-sm text-gray-500">
        {isTh
          ? `ดูปเหล่านี้ถูกจับคู่โดยคะแนนส่วนผสมและคะแนนรีวิวรวม — ไม่ใช่การเปรียบเทียบทางการตลาด`
          : `These dupes are matched by ingredient score and overall review rating — not a marketing comparison.`}
      </p>

      <JsonLd data={itemList} />
    </main>
  );
}
