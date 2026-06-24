import Image from "next/image";
import Link from "next/link";
import { allProducts, productSlug } from "@/lib/data";
import { scoreColor, score1, baht } from "@/lib/format";
import { t, type Locale } from "@/lib/i18n";

interface SearchResultsProps {
  locale: Locale;
  q: string;
  compareSlug?: string;
}

export function SearchResults({ locale, q, compareSlug }: SearchResultsProps) {
  if (!q.trim()) return null;

  const lower = q.toLowerCase();
  const results = allProducts()
    .filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.brand.toLowerCase().includes(lower) ||
        p.ingredient_analysis?.some((a) => a.inci?.toLowerCase().includes(lower))
    )
    .sort((a, b) => {
      // Exact brand/name match first
      const aExact =
        a.name.toLowerCase().startsWith(lower) ||
        a.brand.toLowerCase() === lower;
      const bExact =
        b.name.toLowerCase().startsWith(lower) ||
        b.brand.toLowerCase() === lower;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return (b.konvy_review_count ?? 0) - (a.konvy_review_count ?? 0);
    })
    .slice(0, 30);

  // Determine the "best" concern for a product (highest scoring concern)
  function bestConcern(p: (typeof results)[0]): string {
    const entries = Object.entries(p.total_score ?? {});
    if (!entries.length) return "acne";
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  }

  const countLabel =
    locale === "th"
      ? `พบ ${results.length} ผลิตภัณฑ์`
      : locale === "ko"
        ? `${results.length}개 제품 발견`
        : locale === "ar"
          ? `تم العثور على ${results.length} منتج`
          : `${results.length} product${results.length !== 1 ? "s" : ""} found`;

  if (results.length === 0) {
    const noResultLabel =
      locale === "th"
        ? `ไม่พบผลิตภัณฑ์สำหรับ "${q}"`
        : locale === "ko"
          ? `"${q}"에 대한 결과가 없습니다`
          : locale === "ar"
            ? `لا توجد نتائج لـ "${q}"`
            : `No results found for "${q}"`;
    return (
      <p className="text-sm text-neutral-500 mt-4">{noResultLabel}</p>
    );
  }

  const compareLabel = locale === "th" ? "เปรียบเทียบ" : locale === "ko" ? "비교" : locale === "ar" ? "قارن" : "Compare";
  const vsLabel = locale === "th" ? "เทียบกับนี้" : locale === "ko" ? "이것과 비교" : locale === "ar" ? "قارن مع هذا" : "vs this";
  const selectedLabel = locale === "th" ? "✓ เลือกแล้ว" : "✓ Selected";

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-500">{countLabel}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {results.map((p) => {
          const concern = bestConcern(p);
          const slug = productSlug(p);
          const score = Math.round(p.total_score?.[concern] ?? 0);
          const isSelected = compareSlug === slug;
          const compareHref = compareSlug && !isSelected
            ? `/${locale}/compare/${compareSlug}-vs-${slug}`
            : `/${locale}/search?q=${encodeURIComponent(q)}&pick=${slug}`;
          return (
            <div
              key={p.product_id}
              className={`flex flex-col rounded-2xl border bg-white overflow-hidden shadow-sm transition-all ${isSelected ? "border-rose-400 shadow-rose-200 ring-2 ring-rose-300" : "border-[#efe1db] shadow-rose-100 hover:border-rose-300 hover:shadow-rose-200"}`}
            >
              <Link href={`/${locale}/product/${slug}`} className="flex flex-col flex-1">
                {/* Thumbnail */}
                <div className="relative aspect-square bg-neutral-50 flex items-center justify-center">
                  {p.image_url ? (
                    <Image
                      src={p.image_url}
                      alt={p.name}
                      width={160}
                      height={160}
                      className="object-contain w-full h-full p-2"
                    />
                  ) : (
                    <span className="text-neutral-300 text-3xl">✦</span>
                  )}
                  {score > 0 && (
                    <span
                      className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold border bg-white shadow-sm ${scoreColor(score)}`}
                    >
                      {score1(score)}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="px-3 py-2.5 flex-1 flex flex-col gap-1">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[#c9a86a] truncate">
                    {p.brand}
                  </p>
                  <p className="text-xs text-[#2b2222] leading-snug line-clamp-2 flex-1">
                    {p.name}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap mt-auto">
                    {p.price_thb > 0 && (
                      <span className="text-xs font-bold text-[#2b2222]">
                        {baht(p.price_thb)}
                      </span>
                    )}
                    {p.konvy_review_count > 0 && (
                      <span className="text-[10px] text-neutral-400">
                        {p.konvy_review_count.toLocaleString()} {t(locale, "reviews_short")}
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              {/* Compare button */}
              <div className="px-3 pb-2.5">
                {isSelected ? (
                  <span className="block w-full text-center rounded-xl bg-rose-50 border border-rose-300 px-2 py-1.5 text-[10px] font-semibold text-rose-600">
                    {selectedLabel}
                  </span>
                ) : (
                  <Link
                    href={compareHref}
                    className={`block w-full text-center rounded-xl border px-2 py-1.5 text-[10px] font-semibold transition-colors ${compareSlug ? "bg-rose-500 border-rose-500 text-white hover:bg-rose-600" : "bg-neutral-50 border-[#efe1db] text-[#8a7a76] hover:border-rose-300 hover:text-rose-500"}`}
                  >
                    {compareSlug ? vsLabel : compareLabel}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
