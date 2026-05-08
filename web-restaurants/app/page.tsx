import { loadMasterDb, topByTrust } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import { FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { HOME_FAQS } from "@/lib/faq";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { HeroSearch } from "@/components/HeroSearch";
import { sortWithSponsored, sponsoredTier } from "@/lib/sponsored";
import { SponsoredHero } from "@/components/SponsoredHero";
import { GUIDES } from "@/lib/guides";

export const dynamic = "force-static";

export default async function HomePage() {
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

  const popularSearches = [
    { label: "🌶️ Thai", href: "/c/thai" },
    { label: "🍜 Noodles", href: "/c/noodles" },
    { label: "🍱 Japanese", href: "/c/japanese" },
    { label: "☕ Cafés", href: "/c/cafe" },
  ];

  const searchIndex = db.restaurants.map((r) => ({
    id: r.id,
    name: r.name,
    district: r.district,
    city_label: r.city_label,
    rating: r.rating,
    trust_score: r.trust_score,
  }));

  // Pull a few standout reviews to display as social proof
  const reviewQuotes = db.restaurants
    .filter((r) => r.trust_score >= 80 && r.sample_reviews_en && r.sample_reviews_en.length > 0)
    .slice(0, 6)
    .map((r) => ({
      restaurant: r.name,
      district: r.district || r.city_label,
      rating: r.rating,
      review: r.sample_reviews_en[0],
      id: r.id,
    }));

  return (
    <>
      {/* MEGA HERO — anti-SNS manifesto */}
      <section className="relative bg-gradient-to-b from-orange-50 via-amber-50/40 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute top-32 right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 pt-16 md:pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            No influencer · No paid review
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] mb-6 text-balance">
            Stop searching{" "}
            <span className="line-through decoration-orange-500 decoration-4 opacity-60">on SNS.</span>
            <br />
            Eat what <span className="text-orange-600">locals</span> rate.
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted)] mb-8 max-w-2xl mx-auto text-balance">
            <span className="font-bold text-[var(--fg)]">{db.total_restaurants.toLocaleString()}</span> restaurants ranked by{" "}
            <span className="font-bold text-[var(--fg)]">{totalReviews.toLocaleString()}</span> Google reviews — every single one analyzed for credibility.
          </p>

          <HeroSearch
            entities={searchIndex}
            hrefBase="/restaurant"
            hero=""
            heroSub=""
            popularSearches={popularSearches}
            popularLabel="Try"
          />
        </div>
      </section>

      {/* MEGA STATS BAR — visual numbers */}
      <section className="border-y border-[var(--border)] bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-3 gap-4 text-center">
          <Stat big={db.total_restaurants.toLocaleString()} label="Restaurants" />
          <Stat big={`${(totalReviews / 1_000_000).toFixed(1)}M`} label="Reviews analyzed" />
          <Stat big={withScraped.toLocaleString()} label="Deep-analyzed" />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* SPONSORED HERO if any */}
        {(() => {
          const hero = top.find((r) => sponsoredTier(r.id));
          return hero ? <SponsoredHero r={hero} /> : null;
        })()}

        {/* MANIFESTO — why this exists */}
        <section className="mb-12 grid md:grid-cols-3 gap-4">
          <Manifesto
            icon="🚫"
            title="No influencer spam"
            body="Real reviewers, not paid posts. We aggregate Google reviews — the most regulated review system on earth."
          />
          <Manifesto
            icon="📊"
            title="Trust Score"
            body="Rating + volume + reviewer credibility (Local Guide ratio) + reviewer authority. One number, fully transparent."
          />
          <Manifesto
            icon="🔄"
            title="Live data"
            body="Every 30 minutes, fresh from public Google Maps. No editorial intervention. No deletions."
          />
        </section>

        {/* FEATURED 6 — bigger cards */}
        {top.length >= 6 && (
          <section className="mb-12">
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                Featured this week
              </h2>
              <a href="/best/highly-recommended" className="text-sm text-[var(--accent)] font-medium hover:underline">
                See full ranking →
              </a>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {top.slice(0, 6).map((r, i) => (
                <a
                  key={r.id}
                  href={`/restaurant/${r.id}`}
                  className="group block border border-[var(--border)] rounded-2xl p-5 bg-white hover:shadow-xl hover:border-orange-300 hover:-translate-y-0.5 transition relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="text-2xl font-black tabular-nums text-[var(--muted)]">
                      #{i + 1}
                    </div>
                    <div className="text-3xl font-black tabular-nums" style={{
                      color: r.trust_score >= 75 ? "#16a34a" : r.trust_score >= 60 ? "#059669" : "#ca8a04"
                    }}>
                      {r.trust_score.toFixed(0)}
                    </div>
                  </div>
                  <h3 className="font-bold text-base group-hover:text-orange-600 transition leading-tight mb-1">{r.name}</h3>
                  <p className="text-sm text-[var(--muted)]">{r.district || r.city_label}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-[var(--muted)]">
                    <span className="text-yellow-700 font-bold">★ {r.rating.toFixed(1)}</span>
                    <span>·</span>
                    <span>{r.total_reviews.toLocaleString()} reviews</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {r.cuisines.slice(0, 2).map((c) => (
                      <span key={c} className="bg-orange-50 text-orange-800 text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-medium">
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

        {/* REAL REVIEW QUOTES — social proof carousel */}
        {reviewQuotes.length >= 3 && (
          <section className="mb-12 relative">
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                What real reviewers say
              </h2>
              <span className="text-xs text-[var(--muted)]">From verified Google reviews</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviewQuotes.slice(0, 3).map((q, i) => (
                <a
                  key={i}
                  href={`/restaurant/${q.id}`}
                  className="group block bg-white border border-[var(--border)] rounded-2xl p-5 hover:shadow-md hover:border-orange-300 transition"
                >
                  <div className="text-orange-500 text-3xl leading-none mb-2">"</div>
                  <p className="text-sm leading-relaxed mb-4 line-clamp-4">
                    {q.review.text}
                  </p>
                  <div className="border-t border-[var(--border)] pt-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-bold text-sm truncate group-hover:text-orange-600 transition">
                        {q.restaurant}
                      </div>
                      <div className="text-xs text-[var(--muted)] truncate">{q.district}</div>
                    </div>
                    <div className="text-yellow-700 font-bold text-sm shrink-0">★ {q.rating.toFixed(1)}</div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* BROWSE — pill clouds */}
        {cuisines.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By Cuisine</h2>
            <div className="flex flex-wrap gap-2">
              {cuisines.map(([cat, count]) => (
                <a
                  key={cat}
                  href={`/c/${cat}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 transition font-medium"
                >
                  <span aria-hidden>{CUISINE_ICONS[cat] ?? "🍴"}</span>
                  {CUISINE_LABELS[cat] ?? cat}
                  <span className="text-[var(--muted)] tabular-nums">{count}</span>
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-sm bg-white hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 transition font-medium"
                >
                  {city.charAt(0).toUpperCase() + city.slice(1)}
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
                className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 transition"
              >
                📍 {d} <span className="text-[var(--muted)] tabular-nums">{count}</span>
              </a>
            ))}
          </div>
        </section>

        {/* GUIDES PROMO */}
        {GUIDES.length > 0 && (
          <section className="mb-12 border border-[var(--border)] rounded-2xl bg-gradient-to-br from-amber-50/40 via-white to-orange-50/40 p-6 md:p-8">
            <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
              <div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight">Editor's guides</h2>
                <p className="text-sm text-[var(--muted)] mt-1">No-fluff Bangkok food guides — what locals know.</p>
              </div>
              <a href="/guide" className="text-sm font-bold hover:text-orange-600 hover:underline">All guides →</a>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {GUIDES.map((g) => (
                <a
                  key={g.slug}
                  href={`/guide/${g.slug}`}
                  className="block bg-white rounded-xl border border-[var(--border)] p-4 hover:border-orange-300 transition"
                >
                  <div className="font-bold text-sm leading-tight mb-1">{g.title.replace(/ \(\d{4}\)$/, "")}</div>
                  <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">{g.metaDescription}</p>
                </a>
              ))}
            </div>
          </section>
        )}

        <AdSlot slot="home-mid" />

        {/* TOP 50 LIST */}
        <section>
          <div className="flex items-baseline justify-between gap-4 mb-5">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              Top {Math.min(top.length, 50)} by Trust Score
            </h2>
          </div>
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
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Frequently asked</h2>
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
          items={top.slice(0, 20).map((r) => ({ name: r.name, url: `/restaurant/${r.id}` }))}
        />
      </div>
    </>
  );
}

function Stat({ big, label }: { big: string; label: string }) {
  return (
    <div>
      <div className="text-3xl md:text-5xl font-black tabular-nums leading-none">{big}</div>
      <div className="text-[10px] md:text-xs uppercase tracking-widest opacity-90 mt-1.5 font-bold">{label}</div>
    </div>
  );
}

function Manifesto({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="p-5 rounded-2xl border border-[var(--border)] bg-white hover:shadow-md hover:border-orange-300 transition">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-base mb-1">{title}</h3>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
    </div>
  );
}
