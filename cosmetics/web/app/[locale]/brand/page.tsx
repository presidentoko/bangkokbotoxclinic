import type { Metadata } from "next";
import Link from "next/link";
import { allBrands, brandSlug, brandStats } from "@/lib/data";
import { LOCALES, type Locale } from "@/lib/i18n";
import { baht, scoreColor } from "@/lib/format";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/schema";

const BASE = "https://bangkokfillers.com";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTh = locale === "th";
  return {
    title: isTh
      ? "แบรนด์สกินแคร์ทั้งหมด — จัดอันดับโดยข้อมูล | BangkokFillers"
      : "All Skincare Brands — Ranked by Data | BangkokFillers",
    description: isTh
      ? "รวมแบรนด์สกินแคร์ทุกแบรนด์ที่วิเคราะห์ด้วยข้อมูลส่วนผสม รีวิวจริง และราคา — Garnier, CeraVe, La Roche Posay, COSRX และอีกมาก"
      : "All skincare brands analysed by ingredient science, real reviews, and price — Garnier, CeraVe, La Roche Posay, COSRX and more.",
    alternates: {
      canonical: `${BASE}/${locale}/brand`,
      languages: { th: `${BASE}/th/brand`, en: `${BASE}/en/brand` },
    },
  };
}

export default async function BrandIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeRaw } = await params;
  const locale = localeRaw as Locale;
  const isTh = locale === "th";

  const brands = allBrands();
  const brandData = brands.map((b) => ({ brand: b, ...brandStats(b) }));

  // Group alphabetically
  const groups: Record<string, typeof brandData> = {};
  for (const item of brandData) {
    const key = item.brand[0].toUpperCase();
    const letter = /[A-Z]/.test(key) ? key : "#";
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(item);
  }
  const sortedLetters = Object.keys(groups).sort((a, b) =>
    a === "#" ? 1 : b === "#" ? -1 : a.localeCompare(b)
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="space-y-3">
        <nav className="text-xs text-neutral-400 flex items-center gap-1.5">
          <Link href={`/${locale}`} className="hover:text-rose-500 transition-colors">BangkokFillers</Link>
          <span>›</span>
          <span className="text-neutral-600">{isTh ? "แบรนด์" : "Brands"}</span>
        </nav>
        <h1 className="font-serif-display text-3xl sm:text-4xl font-semibold text-[#2b2222]">
          {isTh ? "แบรนด์สกินแคร์ทั้งหมด" : "All skincare brands"}
        </h1>
        <p className="text-neutral-500 text-sm max-w-prose">
          {isTh
            ? `${brands.length} แบรนด์ · จัดอันดับด้วยคะแนนส่วนผสม รีวิวจริง และความคุ้มค่า`
            : `${brands.length} brands · ranked by ingredient science, real reviews, and value`}
        </p>
      </header>

      {/* Alpha nav */}
      <div className="flex flex-wrap gap-1.5">
        {sortedLetters.map((l) => (
          <a
            key={l}
            href={`#letter-${l}`}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
          >
            {l}
          </a>
        ))}
      </div>

      {/* Brand groups */}
      {sortedLetters.map((letter) => (
        <section key={letter} id={`letter-${letter}`} className="space-y-3 scroll-mt-20">
          <h2 className="font-serif-display text-xl font-semibold text-[#c9a86a] border-b border-[#f0d9d5] pb-2">
            {letter}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {groups[letter].map(({ brand, count, avgScore, minPrice, maxPrice, concerns }) => (
              <Link
                key={brand}
                href={`/${locale}/brand/${brandSlug(brand)}`}
                className="flex items-start justify-between gap-3 rounded-2xl border border-[#efe1db] bg-white hover:shadow-sm hover:border-rose-200 transition-all p-4 group"
              >
                <div className="min-w-0 space-y-1">
                  <p className="font-semibold text-[#2b2222] group-hover:text-rose-500 transition-colors leading-snug">
                    {brand}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {count} {isTh ? "ผลิตภัณฑ์" : "products"}
                    {minPrice > 0 && ` · ${baht(minPrice)}–${baht(maxPrice)}`}
                  </p>
                  {concerns.slice(0, 3).length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {concerns.slice(0, 3).map((c) => (
                        <span key={c} className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-600">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {avgScore > 0 && (
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <span className={`text-lg font-black ${scoreColor(avgScore)}`}>
                      {Math.round(avgScore)}
                    </span>
                    <span className="text-[9px] text-neutral-400">avg</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      ))}

      <JsonLd data={breadcrumbLd([
        { name: "BangkokFillers", url: `${BASE}/${locale}` },
        { name: isTh ? "แบรนด์" : "Brands", url: `${BASE}/${locale}/brand` },
      ])} />
    </div>
  );
}
