import type { Metadata } from "next";
import { NICHES, loadNicheDb, topNichePlaces } from "@/lib/niches";
import { AREA_DEFS, THEME_DEFS } from "@/lib/day-plans";
import type { AreaSlug, ThemeSlug } from "@/lib/day-plans";
import type { NicheSlug } from "@/lib/niches";
import { loadMasterDb } from "@/lib/data";
import { getSlugMap, restaurantUrl } from "@/lib/restaurants";
import { getAffiliateLink } from "@/lib/affiliate";
import { AffiliateLink } from "@/components/AffiliateLink";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { ShareButton } from "@/components/ShareButton";
import { VersusVote } from "@/components/VersusVote";
import { BangkokTip } from "@/components/BangkokTip";
import { WeatherWidget } from "@/components/WeatherWidget";
import { BudgetCalculator } from "@/components/BudgetCalculator";
import { HighlightReel } from "@/components/HighlightReel";
import { SavingsCounter } from "@/components/SavingsCounter";
import { NearbyThings } from "@/components/NearbyThings";
import { NeighborhoodMatcher } from "@/components/NeighborhoodMatcher";
import { FirstDayItinerary } from "@/components/FirstDayItinerary";
import { WeekendPlan } from "@/components/WeekendPlan";
import { DayTripGuide } from "@/components/DayTripGuide";
import { BangkokDayPlanner } from "@/components/BangkokDayPlanner";
import { BangkokDayTripsExpanded } from "@/components/BangkokDayTripsExpanded";
import { BangkokCruiseGuide } from "@/components/BangkokCruiseGuide";
import { BangkokWaterfallsDayTrips } from "@/components/BangkokWaterfallsDayTrips";
import { BangkokWeekendItinerary } from "@/components/BangkokWeekendItinerary";
import { BangkokNightTrains } from "@/components/BangkokNightTrains";
import { BangkokIslandHopping } from "@/components/BangkokIslandHopping";

export const revalidate = 86400;
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const metadata: Metadata = {
  title: "Bangkok Day Plan — Eat · Train · Treat · Learn · Relax",
  description:
    "One curated Bangkok day across five pillars: best restaurant, Muay Thai session, spa, cooking class, and wellness. All bookable. All ranked by real Google data.",
  alternates: { canonical: "/day-plan" },
  openGraph: {
    title: "Bangkok Day Plan — Eat · Train · Treat · Learn · Relax",
    description: "A full Bangkok day you can actually book: top restaurant + Muay Thai + spa + cooking class + wellness.",
  },
};

const PILLARS = [
  { key: "eat",   icon: "🍜", label: "Eat",   niche: null,         desc: "Best restaurant by Trust Score" },
  { key: "train", icon: "🥊", label: "Train",  niche: "muay-thai",  desc: "Muay Thai session" },
  { key: "treat", icon: "💆", label: "Treat",  niche: "spa",        desc: "Spa & massage" },
  { key: "learn", icon: "👨‍🍳", label: "Learn",  niche: "cooking",    desc: "Thai cooking class" },
  { key: "relax", icon: "🌿", label: "Relax",  niche: "wellness",   desc: "Wellness & meditation" },
] as const;

export default async function DayPlanPage() {
  const [db, slugMap, nicheDbs] = await Promise.all([
    loadMasterDb(),
    getSlugMap(),
    Promise.all(
      PILLARS.filter((p) => p.niche).map((p) =>
        loadNicheDb(p.niche as NicheSlug).then((d) => ({
          niche: p.niche as string,
          top: topNichePlaces(d.places, 3),
        }))
      )
    ),
  ]);

  const topRestaurant = [...db.restaurants]
    .sort((a, b) => b.trust_score - a.trust_score)
    .find((r) => r.trust_score >= 75);

  const nicheTop = Object.fromEntries(nicheDbs.map((d) => [d.niche, d.top]));

  const pillarItems = PILLARS.map((p) => {
    if (p.niche === null) {
      // eat
      if (!topRestaurant) return { ...p, venue: null, url: "/restaurants/bangkok", bookLink: null };
      const entry = slugMap[topRestaurant.id];
      const venueUrl = entry ? restaurantUrl(entry) : `/restaurants/bangkok/other/${topRestaurant.id}`;
      const book = getAffiliateLink({ venue: { name: topRestaurant.name }, activityType: "restaurant", city: topRestaurant.city_label });
      return {
        ...p,
        venue: { name: topRestaurant.name, trust_score: topRestaurant.trust_score, rating: topRestaurant.rating, city: topRestaurant.city_label },
        url: venueUrl,
        bookLink: book,
      };
    }
    const top = nicheTop[p.niche]?.[0];
    if (!top) return { ...p, venue: null, url: `/activities/${p.niche}`, bookLink: null };
    const book = getAffiliateLink({ venue: { name: top.name, affiliate: top.affiliate }, activityType: p.niche, city: top.city });
    return {
      ...p,
      venue: { name: top.name, trust_score: top.trust_score, rating: top.rating, city: top.city },
      url: `/activities/${p.niche}/${top.slug}`,
      bookLink: book,
    };
  });

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Bangkok Day Plan — Eat · Train · Treat · Learn · Relax",
    url: `${SITE}/day-plan`,
    numberOfItems: pillarItems.filter((i) => i.venue).length,
    itemListElement: pillarItems
      .filter((i) => i.venue)
      .map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: item.venue!.name,
        url: `${SITE}${item.url}`,
      })),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Day Plan</span>
      </nav>

      <header className="mb-10 text-center">
        <div className="flex justify-center gap-2 mb-4 text-2xl">
          {PILLARS.map((p) => (
            <span key={p.key} title={p.label}>{p.icon}</span>
          ))}
        </div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Your Bangkok Day
          </h1>
          <ShareButton title="Bangkok Day Planner 2026 — Real Picks, Fully Bookable" text="One full Bangkok day: eat, train, treat, learn, relax. All ranked by real Google data." url={`${SITE}/day-plan`} line whatsapp />
        </div>
        <p className="text-[var(--muted)] text-base max-w-xl mx-auto">
          One full day across five pillars — all ranked by real Google data, all bookable.
          Eat · Train · Treat · Learn · Relax.
        </p>
      </header>

      <div className="space-y-6 mb-12">
        {pillarItems.map((item, idx) => (
          <div key={item.key} className="bg-white border border-[var(--border)] rounded-2xl p-5 hover:border-orange-300 transition">
            <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-xl shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
                    {String(idx + 1).padStart(2, "0")} — {item.label}
                  </div>
                  <div className="font-black text-lg leading-tight">
                    {item.venue ? item.venue.name : item.desc}
                  </div>
                  {item.venue && (
                    <div className="text-xs text-[var(--muted)] mt-0.5">
                      Trust {Math.min(100, item.venue.trust_score)} · ★{item.venue.rating?.toFixed(1) ?? "—"} · {item.venue.city}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <a
                  href={item.url}
                  className="text-xs text-[var(--muted)] hover:text-black transition underline underline-offset-2"
                >
                  See details →
                </a>
                {item.bookLink && (
                  <AffiliateLink
                    href={item.bookLink.url}
                    tracking={{ type: "affiliate", provider: item.bookLink.provider, activityType: item.key === "eat" ? "restaurant" : ((item.niche as string | null) ?? item.key), surface: "dayplan" }}
                    className="text-xs font-bold bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition active:scale-95 whitespace-nowrap"
                  >
                    {item.bookLink.isDirect ? `Book on ${item.bookLink.provider}` : `Find on ${item.bookLink.provider}`} →
                  </AffiliateLink>
                )}
              </div>
            </div>

            <p className="text-sm text-[var(--muted)]">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 text-center mb-8">
        <div className="text-2xl mb-2">🗺️</div>
        <h2 className="font-black text-xl mb-2">Save & share this plan</h2>
        <p className="text-sm text-[var(--muted)] mb-4">
          Add any venue to My Trip to build your own itinerary, optimise route, and share with friends.
        </p>
        <a
          href="/plan"
          className="inline-block bg-black text-white font-bold px-6 py-3 rounded-xl hover:bg-gray-800 transition"
        >
          Open Trip Planner →
        </a>
      </div>

      <p className="text-xs text-[var(--muted)] text-center mb-8">
        We may earn a commission on bookings. Rankings are never paid.
      </p>

      {/* C2: Area hubs — high-authority entry points crawlable from this page */}
      <section className="mb-10">
        <h2 className="text-xl font-black mb-1">Bangkok by neighbourhood</h2>
        <p className="text-sm text-[var(--muted)] mb-5">
          Pick an area to see all day-plan themes for that neighbourhood.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(Object.keys(AREA_DEFS) as AreaSlug[]).map((area) => {
            const ad = AREA_DEFS[area];
            return (
              <a
                key={area}
                href={`/day-plan/hub/${area}`}
                className="block border border-[var(--border)] rounded-xl p-3 hover:border-orange-400 transition group"
              >
                <div className="font-black text-sm group-hover:text-orange-600 transition">{ad.label}</div>
                <div className="text-[10px] text-[var(--muted)] line-clamp-2 mt-0.5">{ad.desc}</div>
              </a>
            );
          })}
        </div>
      </section>

      {/* C2: Theme hubs */}
      <section className="mb-10">
        <h2 className="text-xl font-black mb-1">Browse by theme</h2>
        <p className="text-sm text-[var(--muted)] mb-5">
          See all area variations for a single theme.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(Object.keys(THEME_DEFS) as ThemeSlug[]).map((theme) => {
            const td = THEME_DEFS[theme];
            return (
              <a
                key={theme}
                href={`/day-plan/hub/theme/${theme}`}
                className="flex items-center gap-2 border border-[var(--border)] rounded-xl p-3 hover:border-orange-400 transition group"
              >
                <span className="text-xl shrink-0">{td.icon}</span>
                <div className="font-bold text-sm group-hover:text-orange-600 transition">{td.label}</div>
              </a>
            );
          })}
        </div>
      </section>

      {/* Engagement CTAs */}
      <div className="mt-8 grid sm:grid-cols-3 gap-3">
        <a href="/quiz" className="flex items-center gap-3 p-4 rounded-2xl bg-orange-50 border border-orange-200 hover:border-orange-300 transition group">
          <span className="text-2xl shrink-0">🎯</span>
          <div>
            <div className="font-bold text-sm group-hover:text-orange-700 transition">Find your type</div>
            <div className="text-xs text-[var(--muted)]">5-question quiz</div>
          </div>
        </a>
        <a href="/for" className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 hover:border-amber-300 transition group">
          <span className="text-2xl shrink-0">✨</span>
          <div>
            <div className="font-bold text-sm group-hover:text-amber-700 transition">Perfect For...</div>
            <div className="text-xs text-[var(--muted)]">Browse by occasion</div>
          </div>
        </a>
        <a href="/bingo" className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-200 hover:border-green-300 transition group">
          <span className="text-2xl shrink-0">🏆</span>
          <div>
            <div className="font-bold text-sm group-hover:text-green-700 transition">Bucket List Bingo</div>
            <div className="text-xs text-[var(--muted)]">Track your Bangkok journey</div>
          </div>
        </a>
      </div>

      <WeatherWidget />
      <HighlightReel />
      <SavingsCounter />
      <BangkokDayPlanner />
      <FirstDayItinerary />
      <WeekendPlan />
      <DayTripGuide />
      <BangkokDayTripsExpanded />
      <BangkokCruiseGuide />
      <BangkokWaterfallsDayTrips />
      <BangkokWeekendItinerary />
      <BangkokNightTrains />
      <BangkokIslandHopping />
      <NeighborhoodMatcher />
      <NearbyThings context="general" />
      <BudgetCalculator />
      <BangkokTip />

      {/* Poll */}
      <div className="mb-8">
        <VersusVote
          question="Planning your Bangkok day — which matters more?"
          a={{ id: "food-first", label: "Food first", emoji: "🌶️", desc: "Plan around the best meals — activities fill the gaps", url: "/restaurants/cuisine/thai" }}
          b={{ id: "activities-first", label: "Activities first", emoji: "🥊", desc: "Lock in the experiences — eat wherever you end up", url: "/activities" }}
        />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Day Plan", url: "/day-plan" },
      ]} />
    </div>
  );
}
