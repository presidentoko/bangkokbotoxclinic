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
import { ExposeStat } from "@/components/ExposeStat";
import { ResetPrefsButton } from "@/components/ResetPrefsButton";
import { OnboardingTrigger } from "@/components/OnboardingTrigger";
import { PersonalizedSection } from "@/components/PersonalizedSection";

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
    { label: "☕ Café hype", href: "/famous-vs-good/bangkok-cafes" },
    { label: "📍 Thonglor", href: "/d/thonglor" },
    { label: "🍜 Noodles", href: "/c/noodles" },
    { label: "⭐ Best ranked", href: "/best/highly-recommended" },
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
      {/* HERO */}
      <section className="bg-[var(--bg)] border-b border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-4 pt-16 md:pt-24 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            {totalReviews.toLocaleString()}개 실제 리뷰 기반
          </div>
          <h1 className="font-serif-display text-5xl md:text-7xl text-[var(--fg)] leading-tight mb-6">
            방콕 맛집,<br />
            인플루언서 말고<br />
            <span className="text-[var(--accent)]">데이터로</span> 찾으세요.
          </h1>
          <p className="text-base text-[var(--muted)] mb-10 max-w-xl mx-auto">
            광고비 한 푼 없는 Trust Score로{" "}
            <span className="font-bold text-[var(--fg)]">{db.total_restaurants.toLocaleString()}곳</span>{" "}
            랭킹. 인플루언서 피드 말고 130만 명의 실제 후기.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <ResetPrefsButton />
            <a
              href="#top-list"
              className="px-8 py-3.5 rounded-2xl border-2 border-[var(--border)] text-[var(--fg)] font-bold text-base hover:border-[var(--accent)] transition"
            >
              전체 랭킹 보기
            </a>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-3 gap-4 text-center">
          <Stat big={db.total_restaurants.toLocaleString()} label="맛집 추적 중" />
          <Stat big={`${(totalReviews / 1_000_000).toFixed(1)}M`} label="리뷰 교차검증" />
          <Stat big={withScraped.toLocaleString()} label="심층 분석 완료" />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* ONBOARDING TRIGGER + PERSONALIZED SECTION */}
        <OnboardingTrigger>
          <PersonalizedSection
            restaurants={db.restaurants.map((r) => ({
              id: r.id,
              name: r.name,
              district: r.district,
              city_label: r.city_label,
              rating: r.rating,
              trust_score: r.trust_score,
              cuisines: r.cuisines,
            }))}
          />
        </OnboardingTrigger>

        {/* COMMUNITY ACTIVITY */}
        <section className="mb-12 bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6">
          <h2 className="font-serif-display text-xl text-[var(--fg)] mb-1">🔥 요즘 핫한 신고</h2>
          <p className="text-xs text-[var(--muted)] mb-4">커뮤니티가 과대광고 의심 중인 곳들</p>
          <p className="text-sm text-[var(--muted)]">
            아직 신고 데이터가 쌓이는 중이에요. 카드에서 🚩 눌러서 참여해주세요!
          </p>
        </section>

        {/* SPONSORED HERO if any */}
        {(() => {
          const hero = top.find((r) => sponsoredTier(r.id));
          return hero ? <SponsoredHero r={hero} /> : null;
        })()}

        {/* MANIFESTO — movement pillars */}
        <section className="mb-12 grid md:grid-cols-3 gap-4">
          <Manifesto
            icon="—"
            title="Your feed is a paid ad."
            body="Every 'hidden gem' a foodie posts is either sponsored or algorithm-boosted. We don't guess. We count: 1.3M Google reviews, zero paid placements in our rankings."
          />
          <Manifesto
            icon="—"
            title="We're counting receipts."
            body="Trust Score = rating weight + review volume + Local Guide reviewer ratio + authority. Every number visible. No editorial override. Ever."
          />
          <Manifesto
            icon="—"
            title="No one bought our opinion."
            body="Scrapers, not humans. Rankings rebuild every 30 minutes from public Google data. Nothing is deleted. Nothing is boosted. No filter."
          />
        </section>

        {/* FEATURED 6 — bigger cards */}
        {top.length >= 6 && (
          <section className="mb-12">
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                What the data actually says
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
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-[var(--card)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition font-medium"
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
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] text-sm bg-[var(--card)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition font-medium"
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
                className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-[var(--card)] hover:border-[var(--accent)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition"
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
        <section id="top-list">
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
              <details key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 group">
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
      <div className="font-serif-display text-3xl md:text-4xl text-[var(--accent)] leading-none">{big}</div>
      <div className="text-[10px] md:text-xs uppercase tracking-widest text-[var(--muted)] mt-1.5 font-bold">{label}</div>
    </div>
  );
}

function Manifesto({ icon: _icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)] transition group">
      <div className="w-8 h-0.5 bg-[var(--accent)] mb-5" />
      <h3 className="font-serif-display text-lg text-[var(--fg)] mb-2 group-hover:text-[var(--accent)] transition">{title}</h3>
      <p className="text-sm text-[var(--muted)] leading-relaxed">{body}</p>
    </div>
  );
}
