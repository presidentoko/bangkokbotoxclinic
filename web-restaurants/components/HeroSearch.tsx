import { SearchBar } from "./SearchBar";
import type { Restaurant } from "@/lib/types";

export function HeroSearch({
  restaurants, hero, heroSub, popularSearches,
}: {
  restaurants: Pick<Restaurant, "id" | "name" | "district" | "city_label" | "rating" | "trust_score">[];
  hero: string;
  heroSub: string;
  popularSearches: { label: string; href: string }[];
}) {
  return (
    <section className="bg-gradient-to-b from-white via-red-50/30 to-transparent border-b border-[var(--border)]">
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3 text-balance">
          {hero}
        </h1>
        <p className="text-base md:text-lg text-[var(--muted)] mb-6 text-balance">
          {heroSub}
        </p>
        <div className="max-w-2xl mx-auto">
          <SearchBar restaurants={restaurants} />
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
