import { loadMasterDb, getRestaurantById } from "@/lib/data";
import { buildComparePairs } from "@/lib/comparePairs";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Compare Thailand Golf Courses — Head-to-Head Trust Score Scorecards",
  description:
    "Side-by-side comparisons of top Thailand golf courses by city. Trust Score, ratings, holes, par, Korean-friendly verification — all in one scan.",
  alternates: { canonical: "/compare" },
};

export default async function CompareIndexPage() {
  const db = await loadMasterDb();
  const pairs = buildComparePairs(db.restaurants);

  // Group by city
  const byCity = new Map<string, typeof pairs>();
  for (const p of pairs) {
    if (!byCity.has(p.cityLabel)) byCity.set(p.cityLabel, []);
    byCity.get(p.cityLabel)!.push(p);
  }
  const cities = [...byCity.entries()].sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Compare</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-3">Compare Thailand golf courses</h1>
        <p className="text-base text-[var(--muted)] leading-relaxed max-w-3xl">
          Head-to-head scorecards for top courses in each region — Trust Score, rating, holes, Korean-friendly verification, and reviewer topic tags compared side-by-side. {pairs.length} pre-built comparisons across {cities.length} cities.
        </p>
      </header>

      <div className="space-y-10">
        {cities.map(([cityLabel, items]) => (
          <section key={cityLabel}>
            <h2 className="text-xl font-bold mb-4 flex items-baseline gap-3">
              <span>{cityLabel}</span>
              <span className="text-xs text-[var(--muted)] font-normal">({items.length} comparisons)</span>
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {items.map((p) => {
                const a = getRestaurantById(db.restaurants, p.aId);
                const b = getRestaurantById(db.restaurants, p.bId);
                if (!a || !b) return null;
                return (
                  <a
                    key={p.slug}
                    href={`/compare/${p.slug}`}
                    className="block p-4 border border-[var(--border)] rounded-xl bg-white hover:border-emerald-400 hover:shadow-sm transition"
                  >
                    <div className="font-medium text-sm leading-tight mb-2 line-clamp-2">
                      {a.name} <span className="text-[var(--muted)] font-light">vs</span> {b.name}
                    </div>
                    <div className="text-xs text-[var(--muted)] flex items-center gap-2 flex-wrap">
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-medium tabular-nums">
                        Trust {a.trust_score.toFixed(0)}
                      </span>
                      <span className="text-[var(--muted)]">vs</span>
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-medium tabular-nums">
                        Trust {b.trust_score.toFixed(0)}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Compare", url: "/compare" },
      ]} />
    </div>
  );
}
