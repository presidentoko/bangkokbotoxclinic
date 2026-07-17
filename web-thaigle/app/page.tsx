import type { Metadata } from "next";
import { loadMasterDb, topByTrust } from "@/lib/data";
import { getSlugMap, restaurantUrl, slugifySegment } from "@/lib/restaurants";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import { FaqJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { HOME_FAQS } from "@/lib/faq";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { HeroSearch } from "@/components/HeroSearch";
import { sortWithSponsored, sponsoredTier } from "@/lib/sponsored";
import { SponsoredHero } from "@/components/SponsoredHero";
import { GUIDES } from "@/lib/guides";
import { NICHES, loadNicheDb } from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";
import { SurpriseMe } from "@/components/SurpriseMe";
import type { SurpriseVenue } from "@/components/SurpriseMe";
import { BangkokTip } from "@/components/BangkokTip";
import { ThaiPhrase } from "@/components/ThaiPhrase";
import { BangkokChallenge } from "@/components/BangkokChallenge";
import { VersusVote } from "@/components/VersusVote";
import { OCCASION_NAV } from "@/lib/occasions";
import { BangkokBingo } from "@/components/BangkokBingo";
import { WeatherWidget } from "@/components/WeatherWidget";
import { PriceCompare } from "@/components/PriceCompare";
import { DontMiss } from "@/components/DontMiss";
import { CuisineMatch } from "@/components/CuisineMatch";
import { FoodPairing } from "@/components/FoodPairing";
import { ActivityFinder } from "@/components/ActivityFinder";
import { TripType } from "@/components/TripType";
import { OpenNow } from "@/components/OpenNow";
import { HighlightReel } from "@/components/HighlightReel";
import { BangkokFacts } from "@/components/BangkokFacts";
import { RecentlyViewedHome } from "@/components/RecentlyViewedHome";
import { SavedListHome } from "@/components/SaveButton";
import { BangkokStats } from "@/components/BangkokStats";
import { SeasonalTip } from "@/components/SeasonalTip";
import { PublicTransitGuide } from "@/components/PublicTransitGuide";
import { TopSearched } from "@/components/TopSearched";
import { BangkokCountdown } from "@/components/BangkokCountdown";
import { QuizTeaser } from "@/components/QuizTeaser";
import { ThaiWordOfDay } from "@/components/ThaiWordOfDay";
import { HiddenGemPicker } from "@/components/HiddenGemPicker";
import { BangkokMonthlyCalendar } from "@/components/BangkokMonthlyCalendar";
import { KlookTopDeals } from "@/components/KlookTopDeals";
import { BangkokNeighborhoodProfile } from "@/components/BangkokNeighborhoodProfile";
import { BespokeBanner } from "@/components/BespokeBanner";

export const dynamic = "force-static";

const OG_TITLE = "Thaigle — Bangkok Activities & Restaurants Ranked by Real Reviews (2026)";

export const metadata: Metadata = {
  title: OG_TITLE,
  description:
    "Bangkok's most trusted directory for 2026: 3,200+ restaurants, Muay Thai gyms, spas, yoga studios & cooking classes ranked by real Google reviews. No influencer picks. No paid placements.",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      th: "/th",
      ko: "/ko",
      ja: "/ja",
      ru: "/ru",
      ar: "/ar",
      "x-default": "/",
    },
  },
  openGraph: {
    title: OG_TITLE,
    description:
      "Bangkok 2026: 3,200+ restaurants & activity venues ranked by real Google reviews. Muay Thai, spas, yoga, cooking classes — no paid rankings, no influencer picks.",
    url: "/",
  },
  twitter: {
    title: OG_TITLE,
    description:
      "Bangkok 2026: 3,200+ restaurants & activities ranked by real Google reviews. No influencer picks, no paid placements.",
  },
};

export default async function HomePage() {
  const [db, slugMap, nicheCounts, nicheTopPlaces] = await Promise.all([
    loadMasterDb(),
    getSlugMap(),
    Promise.all(NICHES.map(async (n) => {
      const nd = await loadNicheDb(n.slug as NicheSlug);
      return { slug: n.slug, label: n.label, icon: n.icon, total: nd.total };
    })),
    Promise.all(NICHES.map(async (n) => {
      const { topNichePlaces } = await import("@/lib/niches");
      const nd = await loadNicheDb(n.slug as NicheSlug);
      return { slug: n.slug, label: n.label, icon: n.icon, top: topNichePlaces(nd.places, 8) };
    })),
  ]);
  const top = sortWithSponsored(topByTrust(db.restaurants, 50));

  // Build SurpriseMe venue pool
  const surpriseVenues: SurpriseVenue[] = [
    ...top.slice(0, 30).map((r) => ({
      name: r.name,
      url: restaurantUrl(slugMap[r.id] ?? { city: r.city, district: r.district || "other", slug: r.id }),
      type: "restaurant" as const,
      rating: r.rating,
      reviews: r.total_reviews,
      tag: CUISINE_LABELS[r.cuisines[0]] ?? "Restaurant",
      trust: r.trust_score,
      location: r.district || r.city_label,
      emoji: CUISINE_ICONS[r.cuisines[0]] ?? "🍽️",
    })),
    ...nicheTopPlaces.flatMap((n) =>
      n.top.map((p) => ({
        name: p.name,
        url: `/activities/${n.slug}/${p.slug}`,
        type: "activity" as const,
        rating: p.rating ?? 4.5,
        reviews: p.review_count ?? 0,
        tag: n.label,
        trust: p.trust_score,
        location: p.address?.split(",")[0] ?? "Bangkok",
        emoji: n.icon,
      }))
    ),
  ];

  const totalReviews = db.restaurants.reduce((s, r) => s + r.total_reviews, 0);
  const withScraped = db.restaurants.filter((r) => r.scraped_review_count > 0).length;

  const cities = Object.entries(db.city_counts);

  const districtMap = new Map<string, { count: number; city: string }>();
  for (const r of db.restaurants) {
    if (r.district) {
      const prev = districtMap.get(r.district);
      if (!prev) {
        districtMap.set(r.district, { count: 1, city: r.city });
      } else {
        districtMap.set(r.district, { count: prev.count + 1, city: prev.city });
      }
    }
  }
  const districts = [...districtMap.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 12);

  const cuisines = Object.entries(db.cuisine_counts);

  const popularSearches = [
    { label: "🌶️ Thai", href: "/restaurants/cuisine/thai" },
    { label: "🍜 Noodles", href: "/restaurants/cuisine/street_food" },
    { label: "🍱 Japanese", href: "/restaurants/cuisine/japanese" },
    { label: "☕ Cafés", href: "/restaurants/cuisine/cafe" },
  ];

  // SearchBar takes entities as a prop, not a fetched dataset, so every
  // entry here gets serialized straight into this page's RSC/HTML payload.
  // All 3,269 restaurants measured ~593KB raw (~149KB gzip) — capping to
  // the top 400 by trust score covers what people are actually searching
  // for from the homepage (the long tail is still reachable via district/
  // cuisine browsing) at a fraction of the payload.
  const searchIndex = [...db.restaurants]
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 400)
    .map((r) => ({
      id: restaurantUrl(slugMap[r.id] ?? { city: r.city, district: r.district || "other", slug: r.id }).slice(1),
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
      city: r.city,
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
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] mb-4 text-balance">
            Stop searching{" "}
            <span className="line-through decoration-orange-500 decoration-4 opacity-60">on SNS.</span>
            <br />
            Do what <span className="text-orange-600">locals</span> actually do.
          </h1>
          <p className="text-base md:text-lg font-semibold text-[var(--muted)] mb-2 max-w-2xl mx-auto text-balance tracking-wide uppercase">
            Bangkok activities &amp; restaurants — ranked by real Google reviews
          </p>
          <p className="text-lg md:text-xl text-[var(--muted)] mb-8 max-w-2xl mx-auto text-balance">
            <span className="font-bold text-[var(--fg)]">{db.total_restaurants.toLocaleString()}</span> restaurants &amp;{" "}
            activities ranked by{" "}
            <span className="font-bold text-[var(--fg)]">{totalReviews.toLocaleString()}</span> Google reviews — every single one analyzed for credibility.
          </p>

          <HeroSearch
            entities={searchIndex}
            hrefBase=""
            hero=""
            heroSub=""
            popularSearches={popularSearches}
            popularLabel="Try"
          />
        </div>
        <OpenNow />
        <QuizTeaser />
      </section>

      {/* QUIZ + SURPRISE ME STRIP */}
      <section className="border-b border-[var(--border)] bg-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-3">
          <a href="/quiz" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-orange-300 bg-orange-50 text-orange-800 font-bold text-sm hover:bg-orange-100 hover:border-orange-500 transition">
            🎯 What Bangkok traveler are you?
          </a>
          <span className="text-[var(--muted)] text-xs hidden sm:block">·</span>
          <a href="/bingo" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-200 bg-green-50 text-green-800 font-bold text-sm hover:bg-green-100 transition">
            🏆 Bangkok Bucket List
          </a>
          <span className="text-[var(--muted)] text-xs hidden md:block">·</span>
          <a href="/for" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-white font-medium text-sm hover:border-orange-400 hover:text-orange-700 transition hidden md:inline-flex">
            💑 Date night · 🌆 Views · 💸 Budget →
          </a>
          <span className="text-[var(--muted)] text-xs hidden lg:block">·</span>
          <a href="/local-tips" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-white font-medium text-sm hover:border-blue-400 hover:text-blue-700 transition hidden lg:inline-flex">
            🗺️ Local insider tips →
          </a>
        </div>
      </section>

      {/* MEGA STATS BAR — visual numbers */}
      <section className="border-y border-[var(--border)] bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <Stat big={db.total_restaurants.toLocaleString()} label="Restaurants" />
          <Stat big={`${(totalReviews / 1_000_000).toFixed(1)}M`} label="Reviews analyzed" />
          <Stat big={withScraped.toLocaleString()} label="Deep-analyzed" />
          <Stat big={nicheCounts.reduce((s, n) => s + n.total, 0).toLocaleString()} label="Activity venues" />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Was buried 7 sections down past the entire widget stack — moved
            right after hero+stats so it's visible within the first screen
            instead of requiring 3-5 screens of scrolling to reach. */}
        <BespokeBanner />

        {/* SPONSORED HERO if any */}
        {(() => {
          const hero = top.find((r) => sponsoredTier(r.id));
          return hero ? <SponsoredHero r={hero} slugMap={slugMap} /> : null;
        })()}

        {/* TRENDING THIS WEEK teaser */}
        <section className="mb-8 -mx-4 px-4 py-4 bg-gradient-to-r from-orange-600/5 via-amber-600/5 to-transparent border-b border-orange-100">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-orange-700">Live</span>
              <span className="font-bold">Trending in Bangkok</span>
              <span className="text-sm text-[var(--muted)]">— updated {db.generated_at.split("T")[0]}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-2 flex-wrap">
                {top.slice(0, 3).map((r) => (
                  <a key={r.id} href={restaurantUrl(slugMap[r.id] ?? { city: r.city, district: r.district || "other", slug: r.id })}
                    className="text-xs px-2.5 py-1 rounded-full bg-white border border-[var(--border)] hover:border-orange-400 hover:text-orange-700 transition font-medium truncate max-w-[120px]">
                    {r.name}
                  </a>
                ))}
              </div>
              <a href="/trending" className="text-xs font-bold text-orange-600 hover:underline whitespace-nowrap">See all →</a>
            </div>
          </div>
        </section>

        {/* PERFECT FOR — occasion browsing */}
        <section className="mb-10">
          <div className="flex items-baseline justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight">Perfect for...</h2>
              <p className="text-sm text-[var(--muted)] mt-0.5">Find the right place for your situation</p>
            </div>
            <a href="/for" className="text-sm font-bold hover:text-orange-600 hover:underline">All occasions →</a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {OCCASION_NAV.slice(0, 8).map((o) => (
              <a
                key={o.slug}
                href={`/for/${o.slug}`}
                className="group flex items-center gap-2 p-3 rounded-xl border border-[var(--border)] bg-white hover:border-orange-300 hover:shadow-md hover:bg-orange-50 transition"
              >
                <span className="text-xl">{o.emoji}</span>
                <span className="font-medium text-sm group-hover:text-orange-700 transition leading-tight">{o.label}</span>
              </a>
            ))}
          </div>
        </section>

        {/* WEATHER WIDGET */}
        <WeatherWidget />
        <SeasonalTip />
        <TripType />

        {/* DON'T MISS */}
        <BangkokFacts />
        <HighlightReel />
        <DontMiss />
        <ActivityFinder />
        <CuisineMatch />
        <FoodPairing />

        {/* DAILY CHALLENGE */}
        <BangkokChallenge />

        {/* DAILY GEM + THAI PHRASE */}
        <HiddenGemPicker />
        <ThaiWordOfDay />
        <ThaiPhrase />

        {/* TRANSIT GUIDE */}
        <PublicTransitGuide />

        {/* DAILY TIP */}
        <BangkokTip />

        {/* SURPRISE ME */}
        <section className="mb-12">
          <SurpriseMe venues={surpriseVenues} />
        </section>

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
                  href={restaurantUrl(slugMap[r.id] ?? { city: r.city, district: r.district || "other", slug: r.id })}
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
                  href={restaurantUrl(slugMap[q.id] ?? { city: q.city, district: "other", slug: q.id })}
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
                  href={`/restaurants/cuisine/${cat}`}
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
                  href={`/restaurants/${city}`}
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
            {districts.map(([d, { count, city }]) => (
              <a
                key={d}
                href={`/restaurants/${city}/${slugifySegment(d)}`}
                className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 transition"
              >
                📍 {d} <span className="text-[var(--muted)] tabular-nums">{count}</span>
              </a>
            ))}
          </div>
        </section>

        {/* ACTIVITIES PROMO */}
        <section className="mb-12">
          <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
            <div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight">Activities in Bangkok</h2>
              <p className="text-sm text-[var(--muted)] mt-1">Muay Thai · Spa · Yoga · Cooking · Diving — ranked by real reviews</p>
            </div>
            <a href="/activities" className="text-sm font-bold hover:text-orange-600 hover:underline">All activities →</a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {nicheCounts.slice(0, 4).map((n) => (
              <a
                key={n.slug}
                href={`/activities/${n.slug}`}
                className="group block bg-white border border-[var(--border)] rounded-2xl p-4 hover:border-orange-300 hover:shadow-md transition text-center"
              >
                <div className="text-3xl mb-2">{n.icon}</div>
                <div className="font-bold text-sm group-hover:text-orange-600 transition leading-tight">{n.label}</div>
                <div className="text-xs text-[var(--muted)] mt-1 tabular-nums">{n.total.toLocaleString()} venues</div>
              </a>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3">
            {nicheCounts.slice(4).map((n) => (
              <a
                key={n.slug}
                href={`/activities/${n.slug}`}
                className="group block bg-white border border-[var(--border)] rounded-xl p-3 hover:border-orange-300 hover:shadow-md transition text-center"
              >
                <div className="text-2xl mb-1">{n.icon}</div>
                <div className="font-bold text-xs group-hover:text-orange-600 transition">{n.label}</div>
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

        <KlookTopDeals />
        <TopSearched />
        <BangkokMonthlyCalendar />
        <BangkokNeighborhoodProfile />
        <BangkokCountdown />

        {/* PERSONAL STATS (client-side, localStorage) */}
        <BangkokStats />

        {/* RECENTLY VIEWED (client-side, localStorage) */}
        <RecentlyViewedHome />

        {/* SAVED WISHLIST (client-side, localStorage) */}
        <SavedListHome />

        {/* PRICE COMPARE */}
        <section className="mb-12">
          <PriceCompare />
        </section>

        {/* BUCKET LIST BINGO */}
        <section className="mb-12">
          <BangkokBingo />
        </section>

        {/* QUICK POLL */}
        <div className="mb-12">
          <VersusVote
            question="Bangkok trip — what's your bigger priority?"
            a={{ id: "food", label: "Eating", emoji: "🌶️", desc: "World-class Thai food at street prices — the real reason to visit", url: "/restaurants/cuisine/thai", highlight: "Most popular" }}
            b={{ id: "activities", label: "Experiences", emoji: "🥊", desc: "Muay Thai, Thai massage, cooking class — doing > eating", url: "/activities" }}
          />
        </div>

        {/* TOP 50 LIST */}
        <section>
          <div className="flex items-baseline justify-between gap-4 mb-5">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              Top {Math.min(top.length, 50)} by Trust Score
            </h2>
          </div>
          <div className="grid gap-3">
            {top.slice(0, 10).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 1} slugMap={slugMap} />
            ))}
          </div>

          <AffiliateInline />

          <div className="grid gap-3 mt-3">
            {top.slice(10).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 11} slugMap={slugMap} />
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
          items={top.slice(0, 20).map((r) => ({ name: r.name, url: restaurantUrl(slugMap[r.id] ?? { city: r.city, district: r.district || "other", slug: r.id }) }))}
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
