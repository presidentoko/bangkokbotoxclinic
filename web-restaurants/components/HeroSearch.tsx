// ⚠️ AUTO-GENERATED from shared/components/HeroSearch.tsx
// DO NOT edit directly — edit shared/components/HeroSearch.tsx, then run `python scripts/sync_shared.py`.

// 홈페이지 hero — 큰 검색바 + 인기 키워드. site별 entity 타입 흡수.
// hero/heroSub 없으면 embedded mode (mega home page 안에 박을 때).

import { SearchBar, type SearchableEntity } from "./SearchBar";

export function HeroSearch({
  entities,
  hrefBase,
  hero,
  heroSub,
  popularSearches,
  popularLabel = "Popular",
  searchPlaceholder,
  searchLang = "en",
  noMatchesText,
  resultsHeader,
}: {
  entities: SearchableEntity[];
  hrefBase: string;
  hero?: string;
  heroSub?: string;
  popularSearches: { label: string; href: string }[];
  popularLabel?: string;
  searchPlaceholder?: string;
  searchLang?: "en" | "ko" | "th";
  noMatchesText?: string;
  resultsHeader?: string;
}) {
  const hasTitle = !!hero;
  const popularPills = popularSearches.length > 0 && (
    <div className="mt-4 flex items-center justify-center gap-2 flex-wrap text-xs">
      <span className="text-[var(--muted)]">{popularLabel}:</span>
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
  );

  if (!hasTitle) {
    return (
      <div className="max-w-2xl mx-auto">
        <SearchBar
          entities={entities}
          hrefBase={hrefBase}
          placeholder={searchPlaceholder}
          lang={searchLang}
          noMatchesText={noMatchesText}
          resultsHeader={resultsHeader}
        />
        {popularPills}
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-b from-white via-[color-mix(in_srgb,var(--accent)_15%,transparent)] to-transparent border-b border-[var(--border)]">
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-balance">{hero}</h1>
        {heroSub && (
          <p className="text-base md:text-lg text-[var(--muted)] mb-6 text-balance">{heroSub}</p>
        )}
        <div className="max-w-2xl mx-auto">
          <SearchBar
            entities={entities}
            hrefBase={hrefBase}
            placeholder={searchPlaceholder}
            lang={searchLang}
            noMatchesText={noMatchesText}
            resultsHeader={resultsHeader}
          />
        </div>
        {popularPills}
      </div>
    </section>
  );
}
