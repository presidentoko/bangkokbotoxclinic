import type { Metadata } from "next";
import { loadMasterDb, topByTrust } from "@/lib/data";
import { getSlugMap, restaurantUrl } from "@/lib/restaurants";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import { NICHES, loadNicheDb, topNichePlaces } from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { VersusVote } from "@/components/VersusVote";
import { ShareButton } from "@/components/ShareButton";
import { BangkokTip } from "@/components/BangkokTip";
import { BangkokChallenge } from "@/components/BangkokChallenge";
import { LocalsChoice } from "@/components/LocalsChoice";
import { OpenNow } from "@/components/OpenNow";
import { BangkokFacts } from "@/components/BangkokFacts";
import { TopSearched } from "@/components/TopSearched";
import { BangkokCountdown } from "@/components/BangkokCountdown";
import { InstagramSpots } from "@/components/InstagramSpots";
import { ThaiWordOfDay } from "@/components/ThaiWordOfDay";
import { ThaiNumberGuide } from "@/components/ThaiNumberGuide";
import { BangkokPhotoSpots } from "@/components/BangkokPhotoSpots";
import { BangkokFestivalCalendar } from "@/components/BangkokFestivalCalendar";
import { BangkokNightMarkets } from "@/components/BangkokNightMarkets";
import { BangkokCafeHopping } from "@/components/BangkokCafeHopping";
import { BangkokNightlifeAreas } from "@/components/BangkokNightlifeAreas";
import { BangkokMidnightFood } from "@/components/BangkokMidnightFood";
import { BangkokPhotographyWalks } from "@/components/BangkokPhotographyWalks";
import { BangkokEventCalendar } from "@/components/BangkokEventCalendar";
import { BangkokCoffeeShops } from "@/components/BangkokCoffeeShops";
import { BangkokFestivalsCalendar } from "@/components/BangkokFestivalsCalendar";
import { BangkokTechScene } from "@/components/BangkokTechScene";
import { BangkokWeekendItinerary } from "@/components/BangkokWeekendItinerary";
import { BangkokBeerGuide } from "@/components/BangkokBeerGuide";
import { BangkokSoloActivities } from "@/components/BangkokSoloActivities";
import { BangkokThingsNearBTS } from "@/components/BangkokThingsNearBTS";
import { BangkokSeasonalEvents } from "@/components/BangkokSeasonalEvents";
import { BangkokCoworkingSpaces } from "@/components/BangkokCoworkingSpaces";
import { BangkokLiveMusic } from "@/components/BangkokLiveMusic";
import { BangkokEscapeRooms } from "@/components/BangkokEscapeRooms";
import { BangkokFleaMarkets } from "@/components/BangkokFleaMarkets";
import { BangkokSilentDisco } from "@/components/BangkokSilentDisco";
import { BangkokSportsWatching } from "@/components/BangkokSportsWatching";
import { BangkokChristmasNewYear } from "@/components/BangkokChristmasNewYear";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const metadata: Metadata = {
  title: "Trending in Bangkok This Week — Top-Rated Restaurants & Activities",
  description: "What's trending in Bangkok right now: top-rated restaurants and activities this week, ranked by real Google reviews. Updated daily.",
  alternates: { canonical: "/trending" },
};

export const dynamic = "force-static";

export default async function TrendingPage() {
  const [db, slugMap, nicheDbs] = await Promise.all([
    loadMasterDb(),
    getSlugMap(),
    Promise.all(NICHES.map(async (n) => {
      const nd = await loadNicheDb(n.slug as NicheSlug);
      return { ...n, top: topNichePlaces(nd.places, 5) };
    })),
  ]);

  const topRest = topByTrust(db.restaurants, 10);
  const recentlyReviewed = db.restaurants
    .filter((r) => r.rating_trend?.trend === "improving")
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 8);
  const hidden = db.restaurants
    .filter((r) => r.trust_score >= 65 && r.total_reviews < 500 && r.total_reviews >= 50)
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 6);

  const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Trending in Bangkok", url: "/trending" },
      ]} />
      <ItemListJsonLd
        name="Trending Bangkok Restaurants This Week"
        items={topRest.map((r) => ({ name: r.name, url: restaurantUrl(slugMap[r.id] ?? { city: r.city, district: r.district || "other", slug: r.id }) }))}
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="text-sm text-[var(--muted)] mb-5">
          <a href="/" className="hover:text-black">Home</a>
          <span className="mx-2">›</span>
          <span>Trending</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600">Live rankings</span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Trending in Bangkok</h1>
            <ShareButton title="Trending in Bangkok — Real-Time Rankings" text={`Top-rated Bangkok venues — updated daily from real Google reviews`} url={`${SITE}/trending`} line whatsapp />
          </div>
          <p className="text-[var(--muted)]">Updated daily from real Google review data — {db.generated_at.split("T")[0]}</p>
        </div>

        {/* Top 10 restaurants */}
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xl font-black">🏆 Top 10 Restaurants Right Now</h2>
            <a href="/restaurants" className="text-sm text-orange-600 font-bold hover:underline">Full ranking →</a>
          </div>
          <div className="space-y-2">
            {topRest.map((r, i) => {
              const entry = slugMap[r.id];
              if (!entry) return null;
              return (
                <a key={r.id} href={restaurantUrl(entry)}
                  className="flex items-center gap-3 p-3 border rounded-xl hover:border-orange-400 hover:shadow-sm transition bg-white group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${
                    i === 0 ? "bg-yellow-400 text-yellow-900" : i === 1 ? "bg-gray-200 text-gray-700" : i === 2 ? "bg-orange-200 text-orange-800" : "bg-gray-100 text-gray-500"
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold truncate group-hover:text-orange-700 transition">{r.name}</div>
                    <div className="text-xs text-[var(--muted)]">
                      📍 {r.district || r.city_label} · ★{r.rating.toFixed(1)} · {r.total_reviews.toLocaleString()} reviews
                      {r.cuisines[0] && ` · ${CUISINE_ICONS[r.cuisines[0]] ?? ""} ${CUISINE_LABELS[r.cuisines[0]] ?? r.cuisines[0]}`}
                    </div>
                  </div>
                  <div className="shrink-0 font-black text-green-600">Trust {r.trust_score}</div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Improving reviews */}
        {recentlyReviewed.length > 0 && (
          <section className="mb-12">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <h2 className="text-xl font-black">📈 Getting Better — Rising Ratings</h2>
                <p className="text-sm text-[var(--muted)]">Restaurants whose recent reviews are better than their older ones</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {recentlyReviewed.slice(0, 6).map((r) => {
                const entry = slugMap[r.id];
                if (!entry) return null;
                return (
                  <a key={r.id} href={restaurantUrl(entry)}
                    className="flex items-start gap-3 p-4 border rounded-xl hover:border-orange-400 transition bg-white group">
                    <div className="text-2xl shrink-0">{CUISINE_ICONS[r.cuisines[0]] ?? "🍽️"}</div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold group-hover:text-orange-700 transition truncate">{r.name}</div>
                      <div className="text-xs text-[var(--muted)]">{r.district || r.city_label}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-green-600 font-bold">📈 Improving</span>
                        <span className="text-xs text-[var(--muted)]">★{r.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-sm font-black text-orange-600">Trust {r.trust_score}</div>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* Hidden gems */}
        {hidden.length > 0 && (
          <section className="mb-12">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <h2 className="text-xl font-black">💎 Hidden Gems — High Trust, Low Fame</h2>
                <p className="text-sm text-[var(--muted)]">Great restaurants that haven&apos;t blown up yet</p>
              </div>
              <a href="/restaurants/bangkok/hidden-gems" className="text-sm text-orange-600 font-bold hover:underline">All gems →</a>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {hidden.map((r) => {
                const entry = slugMap[r.id];
                if (!entry) return null;
                return (
                  <a key={r.id} href={restaurantUrl(entry)}
                    className="block p-4 border rounded-xl hover:border-orange-400 hover:shadow-sm transition bg-white group">
                    <div className="text-2xl mb-2">{CUISINE_ICONS[r.cuisines[0]] ?? "🍽️"}</div>
                    <div className="font-bold group-hover:text-orange-700 transition truncate mb-1">{r.name}</div>
                    <div className="text-xs text-[var(--muted)] mb-2">{r.district || r.city_label}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-yellow-700">★{r.rating.toFixed(1)} ({r.total_reviews} reviews)</span>
                      <span className="text-xs font-black text-green-600">Trust {r.trust_score}</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* Top activities */}
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xl font-black">🎯 Top Activities This Week</h2>
            <a href="/activities" className="text-sm text-orange-600 font-bold hover:underline">All activities →</a>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {nicheDbs.map((n) => n.top[0] && (
              <a key={n.slug} href={`/activities/${n.slug}/${n.top[0].slug}`}
                className="block p-4 border rounded-xl hover:border-orange-400 transition bg-white group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{n.icon}</span>
                  <span className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">{n.label}</span>
                </div>
                <div className="font-bold group-hover:text-orange-700 transition truncate mb-1">{n.top[0].name}</div>
                <div className="text-xs text-yellow-700">★{(n.top[0].rating ?? 0).toFixed(1)} · Trust {n.top[0].trust_score}</div>
              </a>
            ))}
          </div>
        </section>

        <TopSearched />
        <BangkokCountdown />
        <ThaiWordOfDay />
        <ThaiNumberGuide />
        <BangkokNightMarkets />
        <BangkokCafeHopping />
        <BangkokNightlifeAreas />
        <BangkokMidnightFood />
        <BangkokPhotographyWalks />
        <BangkokEventCalendar />
        <BangkokCoffeeShops />
        <BangkokFestivalsCalendar />
        <BangkokFestivalCalendar />
        <BangkokTechScene />
        <BangkokWeekendItinerary />
        <BangkokBeerGuide />
        <BangkokSoloActivities />
        <BangkokThingsNearBTS />
        <BangkokSeasonalEvents />
        <BangkokCoworkingSpaces />
        <BangkokLiveMusic />
        <BangkokEscapeRooms />
        <BangkokFleaMarkets />
        <BangkokSilentDisco />
        <BangkokSportsWatching />
        <BangkokChristmasNewYear />
        <BangkokPhotoSpots />
        <InstagramSpots />
        <BangkokFacts />
        <OpenNow />
        <LocalsChoice />
        <BangkokChallenge />
        <BangkokTip />

        {/* Poll */}
        <div className="mb-6">
          <VersusVote
            question="When you're in Bangkok — what do you trust more?"
            a={{ id: "rankings-data", label: "Data rankings", emoji: "📊", desc: "Trust Score, verified Google reviewers, no paid placements", url: "/methodology" }}
            b={{ id: "friends-locals", label: "Friend / local recommendations", emoji: "🤝", desc: "Someone who knows Bangkok personally — irreplaceable", url: "/local-tips" }}
          />
        </div>

        {/* CTA */}
        <div className="grid sm:grid-cols-2 gap-4">
          <a href="/quiz" className="block p-5 rounded-2xl bg-orange-50 border border-orange-200 hover:shadow-md transition">
            <div className="text-3xl mb-2">🎯</div>
            <div className="font-black mb-1">What&apos;s your Bangkok type?</div>
            <div className="text-sm text-[var(--muted)]">Take the 5-question quiz for personalized picks</div>
          </a>
          <a href="/for" className="block p-5 rounded-2xl bg-amber-50 border border-amber-200 hover:shadow-md transition">
            <div className="text-3xl mb-2">✨</div>
            <div className="font-black mb-1">Perfect For...</div>
            <div className="text-sm text-[var(--muted)]">Browse by occasion: date night, group dinner, budget</div>
          </a>
          <a href="/bingo" className="block p-5 rounded-2xl bg-green-50 border border-green-200 hover:shadow-md transition">
            <div className="text-3xl mb-2">🏆</div>
            <div className="font-black mb-1">Bangkok Bucket List Bingo</div>
            <div className="text-sm text-[var(--muted)]">Tick what you&apos;ve done — share your score</div>
          </a>
        </div>
      </div>
    </>
  );
}
