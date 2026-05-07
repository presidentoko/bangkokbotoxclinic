// 홈페이지 hero — 큰 검색바 + 인기 키워드.

import { SearchBar } from "./SearchBar";
import type { Clinic } from "@/lib/types";

export function HeroSearch({
  clinics, hero, heroSub, popularSearches,
}: {
  clinics: Pick<Clinic, "id" | "name" | "district" | "rating" | "trust_score">[];
  hero?: string;
  heroSub?: string;
  popularSearches: { label: string; href: string }[];
}) {
  const hasTitle = !!hero;
  if (!hasTitle) {
    return (
      <div className="max-w-2xl mx-auto">
        <SearchBar clinics={clinics} placeholder="Search clinic name or district..." />
        {popularSearches.length > 0 && (
          <div className="mt-4 flex items-center justify-center gap-2 flex-wrap text-xs">
            <span className="text-[var(--muted)]">Popular:</span>
            {popularSearches.map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="px-3 py-1 rounded-full bg-white border border-[var(--border)] hover:border-[var(--accent)] hover:bg-gray-50 text-[var(--fg)] transition"
              >
                {p.label}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-b from-white via-blue-50/30 to-transparent border-b border-[var(--border)]">
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-balance">{hero}</h1>
        {heroSub && <p className="text-base md:text-lg text-[var(--muted)] mb-6 text-balance">{heroSub}</p>}
        <div className="max-w-2xl mx-auto">
          <SearchBar clinics={clinics} placeholder="Search clinic name or district..." />
        </div>
        {popularSearches.length > 0 && (
          <div className="mt-4 flex items-center justify-center gap-2 flex-wrap text-xs">
            <span className="text-[var(--muted)]">Popular:</span>
            {popularSearches.map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="px-3 py-1 rounded-full bg-white border border-[var(--border)] hover:border-black hover:bg-gray-50 text-[var(--fg)] transition"
              >
                {p.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
