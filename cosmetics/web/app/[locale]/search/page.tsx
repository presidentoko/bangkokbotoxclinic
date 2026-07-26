import type { Metadata } from "next";
import { Suspense } from "react";
import { LOCALES, STATIC_LOCALES, type Locale } from "@/lib/i18n";
import { SearchClient } from "@/components/SearchClient";
import { buildSearchIndex, buildComparablePairs } from "@/lib/search-index";
import Link from "next/link";

// Static shell + client-side filtering over a prebuilt index (lib/search-index.ts)
// — no more force-dynamic + per-request full-catalog server scan.
export const revalidate = 86400;

const BASE = "https://bangkokfillers.com";

export function generateStaticParams() {
  return STATIC_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeRaw } = await params;
  const locale = localeRaw as Locale;

  const title =
    locale === "th"
      ? "ค้นหาสินค้า — BangkokFillers"
      : locale === "ko"
        ? "제품 검색 — BangkokFillers"
        : locale === "ar"
          ? "البحث عن المنتجات — BangkokFillers"
          : "Search Products — BangkokFillers";

  const description =
    locale === "th"
      ? "ค้นหาสินค้าสกินแคร์ไทย แบรนด์ หรือส่วนผสมที่คุณสนใจ"
      : locale === "ko"
        ? "태국 스킨케어 제품, 브랜드, 성분을 검색하세요"
        : locale === "ar"
          ? "ابحث عن منتجات العناية بالبشرة التايلاندية، العلامات التجارية، أو المكونات"
          : "Search Thai skincare products, brands, or ingredients";

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/search`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}/search`])),
    },
  };
}

export default async function SearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeRaw } = await params;
  const locale = localeRaw as Locale;

  const isTh = locale === "th";
  const heading = isTh ? "ค้นหาสินค้า" : locale === "ko" ? "제품 검색" : locale === "ar" ? "البحث عن المنتجات" : "Search Products";
  const emptyPrompt = isTh ? "พิมพ์ชื่อสินค้า แบรนด์ หรือส่วนผสมเพื่อเริ่มค้นหา" : locale === "ko" ? "제품명, 브랜드 또는 성분을 입력하여 검색을 시작하세요" : locale === "ar" ? "أدخل اسم المنتج أو العلامة التجارية أو المكوّن للبدء" : "Type a product name, brand, or ingredient to start searching";

  const popularCategories = [
    { th: "สิว", en: "Acne", href: `/${locale}/acne` },
    { th: "ฝ้า/กระ", en: "Whitening", href: `/${locale}/whitening` },
    { th: "ต่อต้านริ้วรอย", en: "Anti-aging", href: `/${locale}/antiaging` },
    { th: "ผิวแพ้ง่าย", en: "Sensitive skin", href: `/${locale}/sensitive` },
    { th: "ควบคุมมัน", en: "Oil control", href: `/${locale}/oilcontrol` },
  ].map((item) => ({ label: isTh ? item.th : item.en, href: item.href }));

  const zeroResultsFallback = (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-widest text-[#c9a86a] font-medium">
        {isTh ? "หมวดหมู่ยอดนิยม" : "Popular categories"}
      </p>
      <div className="flex flex-wrap gap-2">
        {popularCategories.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-[#efe1db] bg-white px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#2b2222]">
        {heading}
      </h1>

      {/* useSearchParams() inside SearchClient requires a Suspense boundary
          for this now-static page to build (Next bails to CSR for it). */}
      <Suspense fallback={null}>
        <SearchClient
          locale={locale}
          index={buildSearchIndex()}
          comparablePairs={buildComparablePairs()}
          zeroResultsFallback={zeroResultsFallback}
          emptyPrompt={emptyPrompt}
          popularCategories={popularCategories}
        />
      </Suspense>
    </div>
  );
}
