"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import type { Locale } from "@/lib/i18n";

export function SearchBox({
  locale,
  defaultValue = "",
}: {
  locale: Locale;
  defaultValue?: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = inputRef.current?.value.trim() ?? "";
    if (!value) return;
    router.push(`/${locale}/search?q=${encodeURIComponent(value)}`);
  }

  const placeholder =
    locale === "th"
      ? "ค้นหาสินค้า แบรนด์ หรือส่วนผสม…"
      : locale === "ko"
        ? "제품, 브랜드, 성분 검색…"
        : locale === "ar"
          ? "ابحث عن منتج أو علامة تجارية أو مكوّن…"
          : "Search products, brands, or ingredients…";

  return (
    <form onSubmit={handleSubmit} className="relative w-full" role="search">
      {/* Magnifying glass icon */}
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a7a76] pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        ref={inputRef}
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[#efe1db] bg-white py-3 pl-10 pr-4 text-sm text-[#2b2222] placeholder-[#b5a8a4] focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-colors"
        autoComplete="off"
        autoFocus
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-rose-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-600 transition-colors"
      >
        {locale === "th" ? "ค้นหา" : locale === "ko" ? "검색" : locale === "ar" ? "بحث" : "Search"}
      </button>
    </form>
  );
}
