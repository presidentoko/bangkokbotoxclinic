import { notFound } from "next/navigation";
import { loadMasterDb, filterByCity } from "@/lib/data";
import { getSlugMap, restaurantUrl } from "@/lib/restaurants";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  return Object.keys(db.city_counts).map((name) => ({ city: name }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ city: string }> }
): Promise<Metadata> {
  const { city } = await params;
  const db = await loadMasterDb();
  const count = db.city_counts[city] ?? 0;
  const label = city.charAt(0).toUpperCase() + city.slice(1);
  return {
    title: `${label} Restaurants Guide — ${count} Places, Real Reviews | Thaigle`,
    description: `${count} restaurants in ${label} ranked by Trust Score from verified Google reviews. No influencer rankings.`,
    alternates: { canonical: `/restaurants/${city}` },
  };
}

export default async function CityHub(
  { params }: { params: Promise<{ city: string }> }
) {
  const { city } = await params;
  const [db, slugMap] = await Promise.all([loadMasterDb(), getSlugMap()]);
  const restaurants = filterByCity(db.restaurants, city);
  if (restaurants.length === 0) notFound();

  const label = city.charAt(0).toUpperCase() + city.slice(1);
  const districts = [...new Set(restaurants.map((r) => r.district).filter(Boolean))].sort();
  const top = [...restaurants].sort((a, b) => b.trust_score - a.trust_score).slice(0, 20);

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Thaigle", url: "/" },
        { name: "Restaurants", url: "/restaurants" },
        { name: label, url: `/restaurants/${city}` },
      ]} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{label} Restaurants</h1>
        <p className="text-[var(--muted)] mb-8">
          {restaurants.length.toLocaleString()} restaurants · Real Google reviews · No influencer hype
        </p>

        {districts.length > 0 && (
          <>
            <h2 className="font-semibold text-lg mb-3">Browse by Area</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {districts.map((d) => (
                <a key={d} href={`/restaurants/${city}/${d!.toLowerCase().replace(/\s+/g, "-")}`}
                   className="border rounded-full px-3 py-1 text-sm hover:bg-orange-50 transition">
                  {d}
                </a>
              ))}
            </div>
          </>
        )}

        <h2 className="font-semibold text-lg mb-3">Top Rated in {label}</h2>
        <div className="space-y-2">
          {top.map((r, i) => {
            const entry = slugMap[r.id];
            if (!entry) return null;
            return (
              <a key={r.id} href={restaurantUrl(entry)}
                 className="flex items-center gap-3 p-3 border rounded-lg hover:border-orange-400 transition">
                <span className="font-bold text-[var(--muted)] w-6">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{r.name}</div>
                  <div className="text-xs text-[var(--muted)]">{r.district || label} · ★{r.rating} · {r.total_reviews} reviews</div>
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
