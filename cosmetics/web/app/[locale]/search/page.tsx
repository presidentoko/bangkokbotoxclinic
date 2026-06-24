import type { Metadata } from "next";
import { LOCALES, type Locale } from "@/lib/i18n";
import { SearchBox } from "@/components/SearchBox";
import { SearchResults } from "@/components/SearchResults";
import { getProduct, productIdFromSlug } from "@/lib/data";
import Link from "next/link";

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
  searchParams: Promise<{ q?: string; pick?: string }>;
}) {
  const { locale: localeRaw } = await params;
  const locale = localeRaw as Locale;
  const { q = "", pick } = await searchParams;

  const isTh = locale === "th";
  const heading = isTh ? "ค้นหาสินค้า" : locale === "ko" ? "제품 검색" : locale === "ar" ? "البحث عن المنتجات" : "Search Products";
  const emptyPrompt = isTh ? "พิมพ์ชื่อสินค้า แบรนด์ หรือส่วนผสมเพื่อเริ่มค้นหา" : locale === "ko" ? "제품명, 브랜드 또는 성분을 입력하여 검색을 시작하세요" : locale === "ar" ? "أدخل اسم المنتج أو العلامة التجارية أو المكوّن للبدء" : "Type a product name, brand, or ingredient to start searching";

  // Compare picker state
  const pickedProduct = pick ? getProduct(productIdFromSlug(pick)) : null;

  return (
    <div className="space-y-6">
      <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-[#2b2222]">
        {heading}
      </h1>

      <SearchBox locale={locale} defaultValue={q} />

      {/* Compare picker banner */}
      {pickedProduct && (
        <div className="flex items-center gap-3 rounded-2xl border-2 border-rose-300 bg-rose-50 px-4 py-3">
          <span className="text-rose-500 text-xl" aria-hidden="true">⚖️</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-rose-700 uppercase tracking-wide">
              {isTh ? "เปรียบเทียบกับ" : "Comparing with"}
            </p>
            <p className="text-sm font-semibold text-[#2b2222] truncate">{pickedProduct.name}</p>
            <p className="text-xs text-rose-600 mt-0.5">
              {isTh ? "แตะ "เทียบกับนี้" บนสินค้าอื่นเพื่อเปรียบเทียบ" : "Tap "vs this" on another product to compare"}
            </p>
          </div>
          <Link
            href={`/${locale}/search?q=${encodeURIComponent(q)}`}
            className="shrink-0 rounded-xl border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
          >
            {isTh ? "ยกเลิก" : "Clear"}
          </Link>
        </div>
      )}

      {q.trim() ? (
        <SearchResults locale={locale} q={q} compareSlug={pick} />
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-neutral-500">{emptyPrompt}</p>
          {/* Popular categories shortcut */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-[#c9a86a] font-medium">
              {isTh ? "หมวดหมู่ยอดนิยม" : "Popular categories"}
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { th: "สิว", en: "Acne", href: `/${locale}/acne` },
                { th: "ฝ้า/กระ", en: "Whitening", href: `/${locale}/whitening` },
                { th: "ต่อต้านริ้วรอย", en: "Anti-aging", href: `/${locale}/antiaging` },
                { th: "ผิวแพ้ง่าย", en: "Sensitive skin", href: `/${locale}/sensitive` },
                { th: "ควบคุมมัน", en: "Oil control", href: `/${locale}/oilcontrol` },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-[#efe1db] bg-white px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors"
                >
                  {isTh ? item.th : item.en}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
