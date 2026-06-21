import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { getSlugMap, restaurantUrl } from "@/lib/restaurants";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return [{ city: "bangkok" }, { city: "pattaya" }];
}

export async function generateMetadata(
  { params }: { params: Promise<{ city: string }> }
): Promise<Metadata> {
  const { city } = await params;
  const label = city.charAt(0).toUpperCase() + city.slice(1);
  return {
    title: `Tourist Trap Restaurants in ${label} — Real Review Analysis | Thaigle`,
    description: `Restaurants in ${label} flagged as potential tourist traps by real Google reviewers. Data-driven, not opinion.`,
    alternates: { canonical: `/restaurants/${city}/tourist-traps` },
  };
}

export default async function TouristTrapsPage(
  { params }: { params: Promise<{ city: string }> }
) {
  const { city } = await params;
  const [db, slugMap] = await Promise.all([loadMasterDb(), getSlugMap()]);
  const cityRestaurants = db.restaurants.filter((r) => r.city === city);
  if (cityRestaurants.length === 0) notFound();

  const label = city.charAt(0).toUpperCase() + city.slice(1);

  // tourist_trap topic 언급 + trust_score < 55
  const traps = cityRestaurants
    .filter((r) => {
      const hasTouristTrapMention = r.mentioned_topics.some(
        (t) => t.topic === "tourist_trap" && t.count >= 1
      );
      return hasTouristTrapMention || r.trust_score < 55;
    })
    .sort((a, b) => b.total_reviews - a.total_reviews)
    .slice(0, 30);

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Thaigle", url: "/" },
        { name: "Restaurants", url: "/restaurants" },
        { name: label, url: `/restaurants/${city}` },
        { name: "Tourist Traps", url: `/restaurants/${city}/tourist-traps` },
      ]} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Tourist Trap Restaurants in {label}</h1>
        <p className="text-[var(--muted)] mb-4">Flagged by real Google reviewers and Trust Score analysis. Not our opinion — the data speaks.</p>
        <p className="mb-8 text-sm bg-red-50 border border-red-200 rounded-lg p-4">
          These restaurants appear frequently in searches but show signs of tourist targeting: low Trust Scores, "tourist trap" mentions in reviews, or inflated-looking ratings.
        </p>
        <div className="space-y-3">
          {traps.map((r) => {
            const entry = slugMap[r.id];
            if (!entry) return null;
            return (
              <a key={r.id} href={restaurantUrl(entry)}
                 className="block border border-red-200 rounded-xl p-4 hover:border-red-400 transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{r.name}</div>
                    <div className="text-xs text-[var(--muted)]">{r.district || label}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-red-600">Trust {r.trust_score}</div>
                    <div className="text-xs text-[var(--muted)]">★{r.rating} · {r.total_reviews} reviews</div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}
