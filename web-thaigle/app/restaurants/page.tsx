import { loadMasterDb } from "@/lib/data";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { getSlugMap, restaurantUrl } from "@/lib/restaurants";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Bangkok & Pattaya Restaurants — 3,200+ Real Reviews | Thaigle",
  description: "Find the best restaurants in Bangkok and Pattaya. Trust Scores from verified Google reviews. No influencer rankings, no paid placements.",
  alternates: { canonical: "/restaurants" },
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
        <h1 className="text-3xl font-bold mb-2">Thailand Restaurants</h1>
        <p className="text-[var(--muted)] mb-8">
          {db.total_restaurants.toLocaleString()} restaurants · Real Google reviews · No influencer hype
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
    </>
  );
}
