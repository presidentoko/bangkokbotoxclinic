"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { scoreColor, score1, baht } from "@/lib/format";
import { t, type Locale } from "@/lib/i18n";
import type { SearchIndexEntry } from "@/lib/search-index";

interface SearchClientProps {
  locale: Locale;
  index: SearchIndexEntry[];
  zeroResultsFallback: ReactNode;
  emptyPrompt: string;
  popularCategories: { label: string; href: string }[];
  comparablePairs: Record<string, string>;
}

// Cheap typo/word-order tolerance: every whitespace-separated token in the
// query must appear somewhere in the haystack, rather than requiring the
// whole query to match as one substring.
function matches(entry: SearchIndexEntry, tokens: string[]): boolean {
  const haystack = `${entry.brand} ${entry.name} ${entry.ingredients.join(" ")}`.toLowerCase();
  return tokens.every((tok) => haystack.includes(tok));
}

function isExact(entry: SearchIndexEntry, lower: string): boolean {
  return entry.name.toLowerCase().startsWith(lower) || entry.brand.toLowerCase() === lower;
}

export function SearchClient({ locale, index, zeroResultsFallback, emptyPrompt, popularCategories, comparablePairs }: SearchClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isTh = locale === "th";

  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  const [pickSlug, setPickSlug] = useState<string | null>(null);

  // Keep the input in sync if ?q= changes via an external link (e.g. homepage
  // search) — adjust state during render rather than in an effect, per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [syncedUrlQuery, setSyncedUrlQuery] = useState(urlQuery);
  if (urlQuery !== syncedUrlQuery) {
    setSyncedUrlQuery(urlQuery);
    setQuery(urlQuery);
  }

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    const lower = q.toLowerCase();
    const tokens = lower.split(/\s+/).filter(Boolean);
    return index
      .filter((e) => matches(e, tokens))
      .sort((a, b) => {
        const aExact = isExact(a, lower);
        const bExact = isExact(b, lower);
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        return b.reviews - a.reviews;
      })
      .slice(0, 30);
  }, [query, index]);

  const compareLabel = isTh ? "เปรียบเทียบ" : "Compare";
  const vsLabel = isTh ? "เทียบกับนี้" : "vs this";
  const selectedLabel = isTh ? "✓ เลือกแล้ว" : "✓ Selected";
  const unavailableLabel = isTh ? "ยังเปรียบเทียบไม่ได้" : "Not comparable yet";

  const pickedEntry = pickSlug ? index.find((e) => e.slug === pickSlug) ?? null : null;

  const countLabel = query.trim()
    ? isTh
      ? `พบ ${results.length} ผลิตภัณฑ์`
      : `${results.length} product${results.length !== 1 ? "s" : ""} found`
    : "";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Update the URL so the query is shareable/bookmarkable without forcing a server round-trip.
    router.replace(`/${locale}/search?q=${encodeURIComponent(query.trim())}`, { scroll: false });
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="relative w-full" role="search">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a7a76] pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            isTh ? "ค้นหาสินค้า แบรนด์ หรือส่วนผสม…" : "Search products, brands, or ingredients…"
          }
          className="w-full rounded-2xl border border-[#efe1db] bg-white py-3 pl-10 pr-20 text-base text-[#2b2222] placeholder-[#b5a8a4] focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-colors"
          autoComplete="off"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-rose-500 px-4 py-2 min-h-[36px] text-xs font-semibold text-white hover:bg-rose-600 transition-colors"
        >
          {isTh ? "ค้นหา" : "Search"}
        </button>
      </form>

      {/* Compare picker banner */}
      {pickSlug && (
        <div className="flex items-center gap-3 rounded-2xl border-2 border-rose-300 bg-rose-50 px-4 py-3">
          <span className="text-rose-500 text-xl" aria-hidden="true">⚖️</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-rose-700 uppercase tracking-wide">
              {isTh ? "เปรียบเทียบกับ" : "Comparing with"}
            </p>
            <p className="text-sm font-semibold text-[#2b2222] truncate">
              {index.find((e) => e.slug === pickSlug)?.name}
            </p>
            <p className="text-xs text-rose-600 mt-0.5">
              {isTh ? "แตะ เทียบกับนี้ บนสินค้าอื่นเพื่อเปรียบเทียบ" : 'Tap "vs this" on another product to compare'}
            </p>
          </div>
          <button
            onClick={() => setPickSlug(null)}
            className="shrink-0 rounded-xl border border-rose-300 px-3 py-2 min-h-[36px] text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
          >
            {isTh ? "ยกเลิก" : "Clear"}
          </button>
        </div>
      )}

      {!query.trim() ? (
        <div className="space-y-4">
          <p className="text-sm text-neutral-500">{emptyPrompt}</p>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-[#c9a86a] font-medium">
              {isTh ? "หมวดหมู่ยอดนิยม" : "Popular categories"}
            </p>
            <div className="flex flex-wrap gap-2">
              {popularCategories.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-[#efe1db] bg-white px-3 py-2 min-h-[44px] flex items-center text-xs font-medium text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-neutral-500">
            {isTh ? `ไม่พบผลิตภัณฑ์สำหรับ "${query}"` : `No results found for "${query}"`}
          </p>
          {zeroResultsFallback}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-neutral-500">{countLabel}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {results.map((e) => {
              const isSelected = pickSlug === e.slug;
              return (
                <div
                  key={e.id}
                  className={`flex flex-col rounded-2xl border bg-white overflow-hidden shadow-sm transition-all ${isSelected ? "border-rose-400 shadow-rose-200 ring-2 ring-rose-300" : "border-[#efe1db] shadow-rose-100 hover:border-rose-300 hover:shadow-rose-200"}`}
                >
                  <Link href={`/${locale}/product/${e.slug}`} className="flex flex-col flex-1">
                    <div className="relative aspect-square bg-neutral-50 flex items-center justify-center">
                      {e.image ? (
                        <Image
                          src={e.image}
                          alt={e.name}
                          fill
                          sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, 200px"
                          className="object-contain p-2"
                        />
                      ) : (
                        <span className="text-neutral-300 text-3xl">✦</span>
                      )}
                      {e.score > 0 && (
                        <span className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold border bg-white shadow-sm ${scoreColor(e.score)}`}>
                          {score1(e.score)}
                        </span>
                      )}
                    </div>
                    <div className="px-3 py-2.5 flex-1 flex flex-col gap-1">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-[#c9a86a] truncate">
                        {e.brand}
                      </p>
                      <p className="text-xs text-[#2b2222] leading-snug line-clamp-2 flex-1">
                        {e.name}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap mt-auto">
                        {e.price > 0 && <span className="text-xs font-bold text-[#2b2222]">{baht(e.price)}</span>}
                        {e.reviews > 0 && (
                          <span className="text-[10px] text-neutral-400">
                            {e.reviews.toLocaleString("en-US")} {t(locale, "reviews_short")}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                  <div className="px-3 pb-2.5">
                    {isSelected ? (
                      <span className="block w-full text-center rounded-xl bg-rose-50 border border-rose-300 px-2 py-2 min-h-[36px] text-[10px] font-semibold text-rose-600">
                        {selectedLabel}
                      </span>
                    ) : pickedEntry ? (
                      (() => {
                        // Only /compare/[slugs] pairs prerendered by
                        // generateStaticParams exist (dynamicParams=false) —
                        // any other combo would 404, so gate the link on the
                        // exact canonical slug order from comparablePairs.
                        const pairKey = [pickedEntry.id, e.id].sort().join("~");
                        const canonicalSlugs = comparablePairs[pairKey];
                        return canonicalSlugs ? (
                          <Link
                            href={`/${locale}/compare/${canonicalSlugs}`}
                            className="block w-full text-center rounded-xl border px-2 py-2 min-h-[36px] text-[10px] font-semibold transition-colors bg-rose-500 border-rose-500 text-white hover:bg-rose-600"
                          >
                            {vsLabel}
                          </Link>
                        ) : (
                          <span
                            className="block w-full text-center rounded-xl border px-2 py-2 min-h-[36px] text-[10px] font-semibold bg-neutral-50 border-[#efe1db] text-neutral-300 cursor-not-allowed"
                            title={unavailableLabel}
                          >
                            {unavailableLabel}
                          </span>
                        );
                      })()
                    ) : (
                      <button
                        onClick={() => setPickSlug(e.slug)}
                        className="block w-full text-center rounded-xl border px-2 py-2 min-h-[36px] text-[10px] font-semibold transition-colors bg-neutral-50 border-[#efe1db] text-[#8a7a76] hover:border-rose-300 hover:text-rose-500"
                      >
                        {compareLabel}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
