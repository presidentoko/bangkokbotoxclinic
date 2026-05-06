import { loadMasterDb, topByTrust } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import { FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { HOME_FAQS } from "@/lib/faq";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { HeroSearch } from "@/components/HeroSearch";
import { StatsBar } from "@/components/StatsBar";
import { getSiteConfig } from "@/lib/site";
import { sortWithSponsored } from "@/lib/sponsored";

export const dynamic = "force-static";

export default async function HomePage() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const top = sortWithSponsored(topByTrust(db.restaurants, 50));

  const totalReviews = db.restaurants.reduce((s, r) => s + r.total_reviews, 0);
  const withScraped = db.restaurants.filter((r) => r.scraped_review_count > 0).length;

  const cities = Object.entries(db.city_counts);

  const districtMap = new Map<string, number>();
  for (const r of db.restaurants) {
    if (r.district) districtMap.set(r.district, (districtMap.get(r.district) ?? 0) + 1);
  }
  const districts = [...districtMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);

  const cuisines = Object.entries(db.cuisine_counts);

  const popularSearches = cuisines.slice(0, 4).map(([c]) => ({
    label: CUISINE_LABELS[c] ?? c,
    href: `/c/${c}`,
  }));

  const searchIndex = db.restaurants.map((r) => ({
    id: r.id,
    name: r.name,
    district: r.district,
    city_label: r.city_label,
    rating: r.rating,
    trust_score: r.trust_score,
  }));

  return (
    <>
      <HeroSearch
        restaurants={searchIndex}
        hero={cfg.hero}
        heroSub={`${db.total_restaurants.toLocaleString()} restaurants · ${totalReviews.toLocaleString()} Google reviews analyzed.`}
        popularSearches={popularSearches}
      />

      <StatsBar
        generatedAt={db.generated_at}
        totalClinics={db.total_restaurants}
        totalReviews={totalReviews}
        withScraped={withScraped}
        label="With full reviews"
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {top.length >= 3 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-4">
              Featured this week
            </h2>
            <div className="grid md:grid-cols-3 gap-3">
              {top.slice(0, 3).map((r, i) => (
                <a
                  key={r.id}
                  href={`/course/${r.id}`}
                  className="group block border border-[var(--border)] rounded-xl p-5 bg-white hover:shadow-md hover:border-gray-300 transition relative"
                >
                  <div className="text-xs font-bold tabular-nums text-[var(--muted)] mb-2">#{i + 1}</div>
                  <h3 className="font-bold text-base group-hover:text-[var(--accent)] transition">{r.name}</h3>
                  <p className="text-sm text-[var(--muted)] mt-0.5">{r.district || r.city_label}</p>
                  <div className="flex items-baseline gap-3 mt-3">
                    <span className="text-2xl font-bold tabular-nums" style={{
                      color: r.trust_score >= 75 ? "#16a34a" : r.trust_score >= 60 ? "#059669" : "#ca8a04"
                    }}>
                      {r.trust_score.toFixed(0)}
                    </span>
                    <span className="text-xs text-[var(--muted)] uppercase tracking-wide">Trust</span>
                    <span className="text-xs text-[var(--muted)] ml-auto">★ {r.rating.toFixed(1)}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {r.categories.slice(0, 2).map((c) => (
                      <span key={c} className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <span aria-hidden>{CUISINE_ICONS[c] ?? "🍴"}</span>
                        {CUISINE_LABELS[c] ?? c}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {cities.length > 1 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By City</h2>
            <div className="flex flex-wrap gap-2">
              {cities.map(([city, count]) => (
                <a
                  key={city}
                  href={`/city/${city}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition font-medium"
                >
                  {city.charAt(0).toUpperCase() + city.slice(1)}
                  <span className="text-[var(--muted)] tabular-nums">{count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {cuisines.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By Cuisine</h2>
            <div className="flex flex-wrap gap-2">
              {cuisines.map(([cat, count]) => (
                <a
                  key={cat}
                  href={`/c/${cat}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  <span aria-hidden>{CUISINE_ICONS[cat] ?? "🍴"}</span>
                  {CUISINE_LABELS[cat] ?? cat}
                  <span className="text-[var(--muted)] tabular-nums">{count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By District</h2>
          <div className="flex flex-wrap gap-2">
            {districts.map(([d, count]) => (
              <a
                key={d}
                href={`/d/${encodeURIComponent(d.toLowerCase().replace(/\s+/g, "-"))}`}
                className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                📍 {d} <span className="text-[var(--muted)] tabular-nums">{count}</span>
              </a>
            ))}
          </div>
        </section>

        <AdSlot slot="home-mid" />

        <section>
          <h2 className="text-xl font-bold mb-4">Top {Math.min(top.length, 50)} by Trust Score</h2>
          <div className="grid gap-3">
            {top.slice(0, 10).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 1} />
            ))}
          </div>

          <AffiliateInline />

          <div className="grid gap-3 mt-3">
            {top.slice(10).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 11} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">Frequently asked</h2>
          <div className="space-y-3">
            {HOME_FAQS.map((f, i) => (
              <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4 group">
                <summary className="font-medium cursor-pointer flex items-center justify-between gap-3">
                  <span>{f.q}</span>
                  <span className="text-[var(--muted)] group-open:rotate-180 transition">⌄</span>
                </summary>
                <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <FaqJsonLd faqs={HOME_FAQS} />
        <ItemListJsonLd
          name="Top Bangkok Restaurants by Trust Score"
          items={top.slice(0, 20).map((r) => ({ name: r.name, url: `/course/${r.id}` }))}
        />
      </div>
    </>
  );
}
