import type { Metadata } from "next";
import { LOCALES, type Locale } from "@/lib/i18n";
import { SearchBox } from "@/components/SearchBox";
import { SearchResults } from "@/components/SearchResults";

export const dynamic = "force-dynamic";

const BASE = "https://bangkokfillers.com";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
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
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale: localeRaw } = await params;
  const locale = localeRaw as Locale;
  const { q = "" } = await searchParams;

  const heading =
    locale === "th"
      ? "ค้นหาสินค้า"
      : locale === "ko"
        ? "제품 검색"
        : locale === "ar"
          ? "البحث عن المنتجات"
          : "Search Products";

  const emptyPrompt =
    locale === "th"
      ? "พิมพ์ชื่อสินค้า แบรนด์ หรือส่วนผสมเพื่อเริ่มค้นหา"
      : locale === "ko"
        ? "제품명, 브랜드 또는 성분을 입력하여 검색을 시작하세요"
        : locale === "ar"
          ? "أدخل اسم المنتج أو العلامة التجارية أو المكوّن للبدء"
          : "Type a product name, brand, or ingredient to start searching";

  return (
    <div className="space-y-6">
      <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#2b2222]">
        {heading}
      </h1>

      <SearchBox locale={locale} defaultValue={q} />

      {q.trim() ? (
        <SearchResults locale={locale} q={q} />
      ) : (
        <p className="text-sm text-neutral-500 mt-2">{emptyPrompt}</p>
      )}
    </div>
  );
}
