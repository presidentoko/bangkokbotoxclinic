"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

const SUGGESTIONS = ["Niacinamide", "Retinol", "CeraVe", "La Roche-Posay", "Vitamin C"];

export function HomeSearchBar({ locale }: { locale: Locale }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const isTh = locale === "th";

  function navigate(value: string) {
    const q = value.trim();
    if (!q) return;
    router.push(`/${locale}/search?q=${encodeURIComponent(q)}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(query);
  }

  function handleChip(s: string) {
    setQuery(s);
    navigate(s);
  }

  return (
    <section className="space-y-3">
      <form
        onSubmit={handleSubmit}
        role="search"
        className="rounded-2xl border-2 border-[#efe1db] focus-within:border-rose-300 bg-white flex items-center gap-2 px-4 py-3 shadow-sm transition-colors"
      >
        {/* Search icon */}
        <span className="text-[#8a7a76] pointer-events-none shrink-0" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>

        <input
          ref={inputRef}
          type="search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isTh ? "ค้นหาสกินแคร์..." : "Search skincare products..."}
          className="flex-1 bg-transparent outline-none text-base text-[#2b2222] placeholder-[#8a7a76]"
          autoComplete="off"
        />

        <button
          type="submit"
          className="rounded-xl bg-rose-500 text-white px-4 py-1.5 text-sm font-semibold hover:bg-rose-600 transition-colors shrink-0"
        >
          {isTh ? "ค้นหา" : "Search"}
        </button>
      </form>

      {/* Popular suggestion chips */}
      <div className="flex flex-wrap gap-2 pt-2">
        <span className="text-xs text-neutral-400 self-center">
          {isTh ? "ยอดนิยม:" : "Popular:"}
        </span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => handleChip(s)}
            className="rounded-full bg-white border border-[#efe1db] px-3 py-2 text-xs text-rose-600 font-medium hover:bg-rose-50 hover:border-rose-300 transition-colors min-h-[36px]"
          >
            {s}
          </button>
        ))}
      </div>
    </section>
  );
}
