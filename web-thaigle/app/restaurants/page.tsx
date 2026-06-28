import { loadMasterDb } from "@/lib/data";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { getSlugMap, restaurantUrl } from "@/lib/restaurants";
import { ShareButton } from "@/components/ShareButton";
import { VersusVote } from "@/components/VersusVote";
import { BangkokTip } from "@/components/BangkokTip";
import { BangkokChallenge } from "@/components/BangkokChallenge";
import { NearbyLink } from "@/components/NearbyLink";
import { CuisineMatch } from "@/components/CuisineMatch";
import { AreaGuide } from "@/components/AreaGuide";
import { OpenNow } from "@/components/OpenNow";
import { SeasonalTip } from "@/components/SeasonalTip";
import { PriceQuickView } from "@/components/PriceQuickView";
import { QuizTeaser } from "@/components/QuizTeaser";
import { NeighborhoodMatcher } from "@/components/NeighborhoodMatcher";
import { RestaurantTips } from "@/components/RestaurantTips";
import { StreetFoodDistrictMap } from "@/components/StreetFoodDistrictMap";
import { RestaurantDistricts } from "@/components/RestaurantDistricts";
import { VenueMatchQuiz } from "@/components/VenueMatchQuiz";
import { ThaiAllergenGuide } from "@/components/ThaiAllergenGuide";
import { BangkokNeighborhoodProfile } from "@/components/BangkokNeighborhoodProfile";
import { BangkokNightMarkets } from "@/components/BangkokNightMarkets";
import { ThaiRegionalCuisine } from "@/components/ThaiRegionalCuisine";
import { BangkokVeganGuide } from "@/components/BangkokVeganGuide";
import { BangkokStreetFoodMap } from "@/components/BangkokStreetFoodMap";
import { BangkokFoodDelivery } from "@/components/BangkokFoodDelivery";
import { BangkokSundayBrunch } from "@/components/BangkokSundayBrunch";
import { BangkokHiddenRestaurants } from "@/components/BangkokHiddenRestaurants";
import { BangkokMichelinGuide } from "@/components/BangkokMichelinGuide";
import { BangkokShoppingMallFood } from "@/components/BangkokShoppingMallFood";
import { BangkokThaiDesserts } from "@/components/BangkokThaiDesserts";
import { BangkokBrunch } from "@/components/BangkokBrunch";
import { BangkokChinatownFood } from "@/components/BangkokChinatownFood";
import { BangkokLateNightEats } from "@/components/BangkokLateNightEats";
import { BangkokBakeries } from "@/components/BangkokBakeries";
import { BangkokThaiFruitGuide } from "@/components/BangkokThaiFruitGuide";
import { BangkokHotelBreakfast } from "@/components/BangkokHotelBreakfast";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Best Restaurants in Bangkok & Pattaya 2026 — 3,200+ Ranked by Real Reviews",
  description: "Find the best restaurants in Bangkok and Pattaya in 2026. 3,200+ venues ranked by Trust Score from verified Google reviews. Thai, Japanese, Korean, Italian & more. No influencer picks, no paid rankings.",
  alternates: { canonical: "/restaurants" },
  openGraph: {
    title: "Best Bangkok & Pattaya Restaurants 2026 — Ranked by Real Reviews",
    description: "3,200+ restaurants in Bangkok and Pattaya ranked by Trust Score from real Google reviews. No influencer hype, no paid placements.",
  },
};

export default async function RestaurantsHub() {
  const [db, slugMap] = await Promise.all([loadMasterDb(), getSlugMap()]);
  const cities = Object.entries(db.city_counts);
  const cuisines = Object.entries(db.cuisine_counts).slice(0, 12);
  const top10 = [...db.restaurants].sort((a, b) => b.trust_score - a.trust_score).slice(0, 10);

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Thaigle", url: "/" }, { name: "Restaurants", url: "/restaurants" }]} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h1 className="text-3xl font-bold">Best Restaurants in Bangkok & Pattaya (2026)</h1>
          <ShareButton title="Best Restaurants in Bangkok 2026 — Real Reviews, No Hype" text="3,200+ restaurants ranked by real Google reviews — Trust Score methodology" url={`${SITE}/restaurants`} line whatsapp />
        </div>
        <p className="text-[var(--muted)] mb-2">
          {db.total_restaurants.toLocaleString()} restaurants · Real Google reviews · No influencer hype
        </p>
        <p className="text-sm text-[var(--muted)] mb-8 leading-relaxed max-w-2xl">
          Trust Score ranks by Google rating, review volume, Local Guide ratio, and reviewer authority — no payment changes organic position.
        </p>

        <h2 className="font-semibold text-lg mb-3">Browse by City</h2>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {cities.map(([city, count]) => (
            <a key={city} href={`/restaurants/${city}`}
               className="border rounded-xl p-4 hover:border-orange-400 transition">
              <div className="font-medium capitalize">{city}</div>
              <div className="text-sm text-[var(--muted)]">{count} restaurants</div>
            </a>
          ))}
        </div>

        <h2 className="font-semibold text-lg mb-3">Browse by Cuisine</h2>
        <div className="flex flex-wrap gap-2 mb-8">
          {cuisines.map(([cuisine, count]) => (
            <a key={cuisine} href={`/restaurants/cuisine/${cuisine}`}
               className="flex items-center gap-1 border rounded-full px-3 py-1 text-sm hover:bg-orange-50 transition">
              <span>{CUISINE_ICONS[cuisine] ?? "🍽️"}</span>
              <span>{CUISINE_LABELS[cuisine] ?? cuisine}</span>
              <span className="text-[var(--muted)]">({count})</span>
            </a>
          ))}
        </div>

        <h2 className="font-semibold text-lg mb-3">Top Rated Right Now</h2>
        <div className="space-y-2">
          {top10.map((r, i) => {
            const entry = slugMap[r.id];
            if (!entry) return null;
            return (
              <a key={r.id} href={restaurantUrl(entry)}
                 className="flex items-center gap-3 p-3 border rounded-lg hover:border-orange-400 transition">
                <span className="font-bold text-[var(--muted)] w-6">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{r.name}</div>
                  <div className="text-xs text-[var(--muted)]">{r.district || r.city_label} · ★{r.rating} · {r.total_reviews} reviews</div>
                </div>
                <div className="text-sm font-semibold text-orange-600">Trust {r.trust_score}</div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Daily Challenge + Tip */}
      <div className="max-w-5xl mx-auto px-4 mb-2">
        <div className="flex items-center gap-3 mb-2">
          <NearbyLink />
        </div>
        <OpenNow />
        <SeasonalTip />
        <PriceQuickView type="restaurant" />
        <RestaurantTips />
        <VenueMatchQuiz />
        <BangkokVeganGuide />
        <BangkokStreetFoodMap />
        <BangkokFoodDelivery />
        <BangkokSundayBrunch />
        <BangkokHiddenRestaurants />
        <BangkokMichelinGuide />
        <BangkokShoppingMallFood />
        <BangkokThaiDesserts />
        <BangkokBrunch />
        <BangkokChinatownFood />
        <BangkokLateNightEats />
        <BangkokBakeries />
        <BangkokThaiFruitGuide />
        <BangkokHotelBreakfast />
        <ThaiRegionalCuisine />
        <BangkokNightMarkets />
        <BangkokNeighborhoodProfile />
        <ThaiAllergenGuide />
        <RestaurantDistricts />
        <StreetFoodDistrictMap />
        <NeighborhoodMatcher />
        <AreaGuide />
        <CuisineMatch />
        <QuizTeaser />
        <BangkokChallenge />
        <BangkokTip />
      </div>

      {/* Poll */}
      <div className="max-w-5xl mx-auto px-4 mb-4">
        <VersusVote
          question="Picking a Bangkok restaurant — what's your starting point?"
          a={{ id: "cuisine-first", label: "Choose cuisine first", emoji: "🍜", desc: "Thai, Japanese, Western — start with what you're craving", url: "/restaurants/cuisine/thai" }}
          b={{ id: "area-first", label: "Choose area first", emoji: "📍", desc: "Silom, Thonglor, Sukhumvit — go to what's nearby", url: "/restaurants/bangkok" }}
        />
      </div>

      {/* Engagement CTAs */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="grid sm:grid-cols-3 gap-3 mt-6">
          <a href="/quiz" className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 border border-orange-200 hover:border-orange-300 transition group">
            <span className="text-2xl shrink-0">🎯</span>
            <div>
              <div className="font-bold text-sm group-hover:text-orange-700 transition">Bangkok Traveler Quiz</div>
              <div className="text-xs text-[var(--muted)]">Get personalized restaurant picks</div>
            </div>
          </a>
          <a href="/local-tips" className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200 hover:border-blue-300 transition group">
            <span className="text-2xl shrink-0">🗺️</span>
            <div>
              <div className="font-bold text-sm group-hover:text-blue-700 transition">Local Tips</div>
              <div className="text-xs text-[var(--muted)]">Skip tourist traps · eat like locals</div>
            </div>
          </a>
          <a href="/for" className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] bg-white hover:border-orange-300 transition group">
            <span className="text-2xl shrink-0">✨</span>
            <div>
              <div className="font-bold text-sm group-hover:text-orange-700 transition">Perfect For...</div>
              <div className="text-xs text-[var(--muted)]">Date night · groups · budget</div>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
