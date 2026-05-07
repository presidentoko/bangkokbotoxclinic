import { loadMasterDb, topByTrust } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { HOME_FAQS } from "@/lib/faq";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { HeroSearch } from "@/components/HeroSearch";
import { StatsBar } from "@/components/StatsBar";
import { getSiteConfig } from "@/lib/site";
import { sortWithSponsored, sponsoredTier } from "@/lib/sponsored";
import { SponsoredHero } from "@/components/SponsoredHero";
import { BEST_FOR } from "@/lib/bestFor";

export const dynamic = "force-static";

function citySlug(label: string): string {
  return label.toLowerCase().replace(/\s+/g, "_");
}

export default async function HomePage() {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const top = sortWithSponsored(topByTrust(db.restaurants, 50));

  const totalReviews = db.restaurants.reduce((s, r) => s + r.total_reviews, 0);
  const withScraped = db.restaurants.filter((r) => r.scraped_review_count > 0).length;
  const koCourses = db.restaurants.filter((c) => (c.language_breakdown?.ko ?? 0) > 0).length;

  const cities = Object.entries(db.city_counts).sort((a, b) => b[1] - a[1]);

  const districtMap = new Map<string, number>();
  for (const r of db.restaurants) {
    if (r.district) districtMap.set(r.district, (districtMap.get(r.district) ?? 0) + 1);
  }
  const districts = [...districtMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);

  const categories = Object.entries(db.cuisine_counts).sort((a, b) => b[1] - a[1]);

  const popularSearches = [
    { label: "Bangkok", href: "/city/bangkok" },
    { label: "Pattaya / Chonburi", href: "/city/chon_buri" },
    { label: "Hua Hin", href: "/city/prachuap_khiri_khan" },
    { label: "Korean-friendly", href: "/best/korean-friendly" },
  ];

  const searchIndex = db.restaurants.map((r) => ({
    id: r.id,
    name: r.name,
    district: r.district,
    city_label: r.city_label,
    rating: r.rating,
    trust_score: r.trust_score,
  }));

  // Korean-popular top 6 — for the dedicated KO carousel
  const koTop = [...db.restaurants]
    .filter((r) => (r.language_breakdown?.ko ?? 0) > 0)
    .sort((a, b) => (b.language_breakdown?.ko ?? 0) - (a.language_breakdown?.ko ?? 0))
    .slice(0, 6);

  return (
    <>
      <HeroSearch
        restaurants={searchIndex}
        hero={cfg.hero}
        heroSub={`${db.total_restaurants.toLocaleString()} courses · ${totalReviews.toLocaleString()} Google reviews analyzed · No influencer placements.`}
        popularSearches={popularSearches}
      />

      <StatsBar
        generatedAt={db.generated_at}
        totalClinics={db.total_restaurants}
        totalReviews={totalReviews}
        withScraped={withScraped}
        label="With deep review analysis"
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Editor's Pick hero — first sponsored only */}
        {(() => {
          const hero = top.find((r) => sponsoredTier(r.id));
          return hero ? <SponsoredHero r={hero} /> : null;
        })()}

        {/* Featured top 3 */}
        {top.length >= 3 && (
          <section className="mb-12">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-4">
              Featured this week
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {top.slice(0, 3).map((r, i) => (
                <a
                  key={r.id}
                  href={`/course/${r.id}`}
                  className="group block border border-[var(--border)] rounded-2xl bg-white hover:shadow-lg hover:border-[var(--accent)] transition relative overflow-hidden"
                >
                  {r.hero_image ? (
                    <div className="relative h-44 overflow-hidden bg-gray-100 border-b border-[var(--border)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={r.hero_image}
                        alt={r.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 text-xs font-bold text-white bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full tabular-nums">
                        #{i + 1}
                      </div>
                      <div className="absolute top-2 right-2 text-base font-bold text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full tabular-nums">
                        {r.trust_score.toFixed(0)}
                      </div>
                    </div>
                  ) : (
                    <div className="px-5 pt-5 flex items-start justify-between gap-2">
                      <div className="text-xs font-bold tabular-nums text-[var(--muted)]">#{i + 1}</div>
                      <div className="text-2xl font-bold tabular-nums" style={{
                        color: r.trust_score >= 75 ? "#16a34a" : r.trust_score >= 60 ? "#059669" : "#ca8a04"
                      }}>
                        {r.trust_score.toFixed(0)}
                      </div>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-base group-hover:text-[var(--accent)] transition leading-tight">{r.name}</h3>
                    <p className="text-sm text-[var(--muted)] mt-1">{r.district || r.city_label}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-[var(--muted)]">
                      <span>★ {r.rating.toFixed(1)}</span>
                      <span>·</span>
                      <span>{r.total_reviews.toLocaleString()} reviews</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {r.categories.slice(0, 2).map((c) => (
                        <span key={c} className="bg-emerald-50 text-emerald-800 text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <span aria-hidden>{CATEGORY_ICONS[c] ?? "⛳"}</span>
                          {CATEGORY_LABELS[c] ?? c}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* By Region */}
        {cities.length > 1 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By Region</h2>
            <div className="flex flex-wrap gap-2">
              {cities.map(([city, count]) => (
                <a
                  key={city}
                  href={`/city/${citySlug(city)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition font-medium"
                >
                  {city}
                  <span className="text-[var(--muted)] tabular-nums">{count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* By Type */}
        {categories.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By Type</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(([cat, count]) => (
                <a
                  key={cat}
                  href={`/c/${cat}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  <span aria-hidden>{CATEGORY_ICONS[cat] ?? "⛳"}</span>
                  {CATEGORY_LABELS[cat] ?? cat}
                  <span className="text-[var(--muted)] tabular-nums">{count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Best of */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">Best of</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {BEST_FOR.slice(0, 9).map((c) => (
              <a
                key={c.slug}
                href={`/best/${c.slug}`}
                className="block px-4 py-3 rounded-xl border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                {c.title.replace(/^Best |^Most /, "").replace(/ in Thailand$/, "")}
              </a>
            ))}
          </div>
        </section>

        {/* Korean coverage callout */}
        {koTop.length >= 3 && (
          <section className="mb-12 border border-[var(--border)] rounded-2xl bg-gradient-to-br from-emerald-50/40 to-white p-6">
            <div className="flex items-baseline justify-between gap-4 flex-wrap mb-4">
              <div>
                <h2 className="text-lg font-bold">한국인 골퍼 추천 코스</h2>
                <p className="text-sm text-[var(--muted)] mt-0.5">
                  {koCourses}개 코스에 한국어 리뷰 — 한국어 캐디·한국 투어그룹 인기.
                </p>
              </div>
              <a href="/ko" className="text-sm font-medium hover:text-[var(--accent)] underline-offset-4 hover:underline">
                Full Korean view →
              </a>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {koTop.map((r, i) => (
                <a key={r.id} href={`/course/${r.id}`} className="block bg-white rounded-xl border border-[var(--border)] p-3 hover:border-[var(--accent)] transition">
                  <div className="text-xs text-[var(--muted)] mb-1">#{i + 1} · {(r.language_breakdown?.ko ?? 0)} KO reviews</div>
                  <div className="font-medium text-sm leading-tight">{r.name}</div>
                  <div className="text-xs text-[var(--muted)] mt-1">{r.city_label}</div>
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
          name="Top Thailand Golf Courses by Trust Score"
          items={top.slice(0, 20).map((r) => ({ name: r.name, url: `/course/${r.id}` }))}
        />
      </div>
    </>
  );
}
