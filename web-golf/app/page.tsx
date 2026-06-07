import Image from "next/image";
import { loadMasterDb, topByTrust } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { HOME_FAQS } from "@/lib/faq";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { HeroSearch } from "@/components/HeroSearch";
import { sortWithSponsored, sponsoredTier } from "@/lib/sponsored";
import { SponsoredHero } from "@/components/SponsoredHero";
import { BEST_FOR } from "@/lib/bestFor";
import { GUIDES } from "@/lib/guides";

export const dynamic = "force-static";

function citySlug(label: string): string {
  return label.toLowerCase().replace(/\s+/g, "_");
}

export default async function HomePage() {
  const db = await loadMasterDb();
  const top = sortWithSponsored(topByTrust(db.restaurants, 50));

  const totalReviews = db.restaurants.reduce((s, r) => s + r.total_reviews, 0);
  const withScraped = db.restaurants.filter((r) => r.scraped_review_count > 0).length;
  const koCourses = db.restaurants.filter((c) => (c.language_breakdown?.ko ?? 0) > 0).length;
  const koFriendlyCount = db.restaurants.filter((c) => c.is_korean_friendly).length;
  const withVideos = db.restaurants.filter((c) => c.videos && c.videos.length > 0).length;
  const withPhotos = db.restaurants.filter((c) => (c.photos && c.photos.length > 0) || c.hero_image || c.top_photo_url).length;
  const provinces = Object.keys(db.city_counts).length;

  const cities = Object.entries(db.city_counts).sort((a, b) => b[1] - a[1]);

  const districtMap = new Map<string, number>();
  for (const r of db.restaurants) {
    if (r.district) districtMap.set(r.district, (districtMap.get(r.district) ?? 0) + 1);
  }
  const districts = [...districtMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);

  const categories = Object.entries(db.cuisine_counts).sort((a, b) => b[1] - a[1]);

  const popularSearches = [
    { label: "Bangkok", href: "/city/bangkok" },
    { label: "Pattaya", href: "/city/chon_buri" },
    { label: "Hua Hin", href: "/city/prachuap_khiri_khan" },
    { label: "Korean caddy", href: "/best/korean-friendly" },
  ];

  const searchIndex = db.restaurants.map((r) => ({
    id: r.id,
    name: r.name,
    district: r.district,
    city_label: r.city_label,
    rating: r.rating,
    trust_score: r.trust_score,
  }));

  // Featured 6 with photos prioritized (hero_image OR top_photo_url)
  const featured6 = top
    .slice(0, 30)
    .filter((r) => r.hero_image || r.top_photo_url)
    .slice(0, 6);
  const featuredFinal = featured6.length >= 6 ? featured6 : top.slice(0, 6);

  // Korean-popular — prefer Korean-friendly flagged, sort by korean_score
  const koTop = [...db.restaurants]
    .filter((r) => r.is_korean_friendly)
    .sort((a, b) => (b.korean_score ?? 0) - (a.korean_score ?? 0))
    .slice(0, 6);

  return (
    <>
      {/* MEGA HERO — insider/verified voice */}
      <section className="relative bg-gradient-to-b from-emerald-50 via-green-50/30 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute top-32 right-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 pt-16 md:pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Verified by real golfers · No agency markup
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] mb-6 text-balance">
            Thailand golf,<br />
            <span className="text-emerald-700">ranked by golfers</span>{" "}
            <span className="opacity-50 line-through decoration-emerald-500 decoration-4">— not agencies.</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted)] mb-8 max-w-2xl mx-auto text-balance">
            <span className="font-bold text-[var(--fg)]">{db.total_restaurants.toLocaleString()}</span> courses across{" "}
            <span className="font-bold text-[var(--fg)]">{provinces}</span> provinces. Caddy quality, course conditions, English/Korean support — extracted from <span className="font-bold text-[var(--fg)]">{totalReviews.toLocaleString()}</span> real Google reviews.
          </p>

          <HeroSearch
            entities={searchIndex}
            hrefBase="/course"
            popularSearches={popularSearches}
          />
        </div>
      </section>

      {/* MEGA STATS BAR */}
      <section className="border-y border-[var(--border)] bg-gradient-to-r from-emerald-700 via-green-700 to-emerald-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-4 gap-4 text-center">
          <Stat big={db.total_restaurants.toLocaleString()} label="Courses" />
          <Stat big={`${(totalReviews / 1000).toFixed(0)}K`} label="Reviews analyzed" />
          <Stat big={koFriendlyCount.toLocaleString()} label="🇰🇷 Korean-friendly" />
          <Stat big={withScraped.toLocaleString()} label="Deep-analyzed" />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {(() => {
          const hero = top.find((r) => sponsoredTier(r.id));
          return hero ? <SponsoredHero r={hero} /> : null;
        })()}

        {/* DATA TRANSPARENCY BAND */}
        <section className="mb-12 bg-white border border-[var(--border)] rounded-2xl p-5 md:p-7">
          <div className="text-xs uppercase tracking-widest text-emerald-700 font-bold mb-3">
            How this directory is built
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 text-sm">
            <DataPoint big="1,316" label="Places analyzed" hint="from public Google Maps directory" />
            <DataPoint big={withPhotos.toLocaleString()} label="With photos" hint="Google Maps + course websites" />
            <DataPoint big={withVideos.toString()} label="YouTube reviews matched" hint="via course-name fuzzy match" />
            <DataPoint big="201" label="Naver blog posts" hint="Korean blogger field reports" />
            <DataPoint big="152" label="Pantip threads" hint="Thai community forum discussions" />
            <DataPoint big={koFriendlyCount.toString()} label="🇰🇷 Korean-verified" hint="topic + caddy + blog signal OR" />
            <DataPoint big={withScraped.toLocaleString()} label="Deep-analyzed" hint="Apify review text NLP extraction" />
            <DataPoint big={provinces.toString()} label="Provinces" hint="across Thailand" />
          </div>
          <p className="text-xs text-[var(--muted)] leading-relaxed mt-4 max-w-3xl">
            Trust Score and Korean-friendly flags are computed automatically from the signals above — no editorial curation, no paid placements in the organic ranking. <a href="/methodology" className="underline hover:text-[var(--fg)] font-medium">Full methodology →</a> · <a href="/llms-full.txt" className="underline hover:text-[var(--fg)]">LLM-readable data</a>
          </p>
        </section>

        {/* MANIFESTO */}
        <section className="mb-12 grid md:grid-cols-3 gap-4">
          <Manifesto
            icon="🚫"
            title="No agency markup"
            body="Korean tour packages add 25-40% markup. We aggregate Google reviews and link to direct booking partners — pick the path that fits."
          />
          <Manifesto
            icon="📊"
            title="Trust Score"
            body="Rating + review volume + Local Guide ratio + reviewer authority. One transparent number, refreshed continuously."
          />
          <Manifesto
            icon="🇰🇷"
            title="Korean caddy mapped"
            body="Korean-speaking caddy mentions extracted from review text. 105+ courses with verified Korean reviewer presence."
          />
        </section>

        {/* FEATURED 6 with photos */}
        {featuredFinal.length >= 6 && (
          <section className="mb-12">
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                Top 6 this week
              </h2>
              <a href="/best/highly-recommended" className="text-sm text-emerald-700 font-medium hover:underline">
                See full ranking →
              </a>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {featuredFinal.map((r, i) => (
                <a
                  key={r.id}
                  href={`/course/${r.id}`}
                  className="group block border border-[var(--border)] rounded-2xl bg-white hover:shadow-xl hover:border-emerald-300 hover:-translate-y-0.5 transition relative overflow-hidden"
                >
                  {(r.hero_image || r.top_photo_url) ? (
                    <div className="relative h-40 overflow-hidden bg-gray-100">
                      <Image
                        src={(r.hero_image || r.top_photo_url)!}
                        alt={r.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        loading={i === 0 ? "eager" : "lazy"}
                      />
                      <div className="absolute top-2 left-2 text-xs font-bold text-white bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full tabular-nums">
                        #{i + 1}
                      </div>
                      <div className="absolute top-2 right-2 text-base font-black text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full tabular-nums">
                        {r.trust_score.toFixed(0)}
                      </div>
                    </div>
                  ) : (
                    <div className="px-5 pt-5 flex items-start justify-between gap-2">
                      <div className="text-2xl font-black tabular-nums text-[var(--muted)]">#{i + 1}</div>
                      <div className="text-3xl font-black tabular-nums" style={{
                        color: r.trust_score >= 75 ? "#16a34a" : r.trust_score >= 60 ? "#059669" : "#ca8a04"
                      }}>
                        {r.trust_score.toFixed(0)}
                      </div>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-base group-hover:text-emerald-700 transition leading-tight mb-1">{r.name}</h3>
                    <p className="text-sm text-[var(--muted)]">{r.district || r.city_label}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-[var(--muted)]">
                      <span className="text-yellow-700 font-bold">★ {r.rating.toFixed(1)}</span>
                      <span>·</span>
                      <span>{r.total_reviews.toLocaleString()} reviews</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {r.categories.slice(0, 2).map((c) => (
                        <span key={c} className="bg-emerald-50 text-emerald-800 text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-medium">
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

        {/* Korean coverage callout */}
        {koTop.length >= 3 && (
          <section className="mb-12 border border-[var(--border)] rounded-2xl bg-gradient-to-br from-emerald-50/40 via-white to-green-50/40 p-6 md:p-8">
            <div className="flex items-baseline justify-between gap-4 flex-wrap mb-5">
              <div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight">🇰🇷 한국 골퍼 인기 코스</h2>
                <p className="text-sm text-[var(--muted)] mt-1">
                  {koFriendlyCount}개 코스 한국 친화 검증 · {koCourses}개에 한국어 리뷰. 한국어 캐디 / 한국 투어그룹 인기.
                </p>
              </div>
              <a href="/ko" className="text-sm font-bold hover:text-emerald-700 hover:underline">한국어 사이트 →</a>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {koTop.map((r, i) => (
                <a key={r.id} href={`/course/${r.id}`} className="block bg-white rounded-xl border border-[var(--border)] p-3 hover:border-emerald-300 transition">
                  <div className="text-xs text-[var(--muted)] mb-1">
                    #{i + 1} · ko score {(r.korean_score ?? 0).toFixed(0)}
                    {(r.language_breakdown?.ko ?? 0) > 0 ? ` · ${r.language_breakdown.ko} KO 리뷰` : ""}
                  </div>
                  <div className="font-medium text-sm leading-tight">{r.name}</div>
                  <div className="text-xs text-[var(--muted)] mt-1">{r.city_label}</div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Browse by region */}
        {cities.length > 1 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By Region</h2>
            <div className="flex flex-wrap gap-2">
              {cities.map(([city, count]) => (
                <a
                  key={city}
                  href={`/city/${citySlug(city)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition font-medium"
                >
                  {city}
                  <span className="text-[var(--muted)] tabular-nums">{count}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Browse by type */}
        {categories.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By Type</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(([cat, count]) => (
                <a
                  key={cat}
                  href={`/c/${cat}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition"
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
                className="block px-4 py-3 rounded-xl border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                {c.title.replace(/^Best |^Most /, "").replace(/ in Thailand$/, "")}
              </a>
            ))}
          </div>
        </section>

        {/* Guides promo */}
        {GUIDES.length > 0 && (
          <section className="mb-12 border border-[var(--border)] rounded-2xl bg-gradient-to-br from-green-50/40 via-white to-emerald-50/40 p-6 md:p-8">
            <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
              <div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight">Editor's guides</h2>
                <p className="text-sm text-[var(--muted)] mt-1">No-fluff Thailand golf guides — what locals know.</p>
              </div>
              <a href="/guide" className="text-sm font-bold hover:text-emerald-700 hover:underline">All guides →</a>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {GUIDES.slice(0, 3).map((g) => (
                <a
                  key={g.slug}
                  href={`/guide/${g.slug}`}
                  className="block bg-white rounded-xl border border-[var(--border)] p-4 hover:border-emerald-300 transition"
                >
                  <div className="font-bold text-sm leading-tight mb-1">{g.title.replace(/ \(\d{4}\)$/, "")}</div>
                  <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">{g.metaDescription}</p>
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
                className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                📍 {d} <span className="text-[var(--muted)] tabular-nums">{count}</span>
              </a>
            ))}
          </div>
        </section>

        <AdSlot slot="home-mid" />

        <section>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-5">Top {Math.min(top.length, 50)} by Trust Score</h2>
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
          name="Top Thailand Golf Courses by Trust Score"
          items={top.slice(0, 20).map((r) => ({ name: r.name, url: `/course/${r.id}` }))}
        />
      </div>
    </>
  );
}

function Stat({ big, label }: { big: string; label: string }) {
  return (
    <div>
      <div className="text-2xl md:text-4xl font-black tabular-nums leading-none">{big}</div>
      <div className="text-[10px] md:text-xs uppercase tracking-widest opacity-90 mt-1.5 font-bold">{label}</div>
    </div>
  );
}

function Manifesto({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="p-5 rounded-2xl border border-[var(--border)] bg-white hover:shadow-md hover:border-emerald-300 transition">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-base mb-1">{title}</h3>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
    </div>
  );
}

function DataPoint({ big, label, hint }: { big: string; label: string; hint: string }) {
  return (
    <div>
      <div className="text-2xl md:text-3xl font-black tabular-nums text-[var(--fg)] leading-none">{big}</div>
      <div className="text-xs font-semibold text-[var(--fg)] mt-1.5">{label}</div>
      <div className="text-[11px] text-[var(--muted)] leading-snug mt-0.5">{hint}</div>
    </div>
  );
}
