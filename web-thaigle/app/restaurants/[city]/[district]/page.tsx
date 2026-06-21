import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { getSlugMap, restaurantUrl } from "@/lib/restaurants";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  const pairs = new Set<string>();
  for (const r of db.restaurants) {
    if (r.district) {
      const districtSlug = r.district.toLowerCase().replace(/\s+/g, "-");
      pairs.add(`${r.city}|${districtSlug}`);
    }
  }
  return Array.from(pairs).map((p) => {
    const [city, district] = p.split("|");
    return { city, district };
  });
}

export async function generateMetadata(
  { params }: { params: Promise<{ city: string; district: string }> }
): Promise<Metadata> {
  const { city, district } = await params;
  const db = await loadMasterDb();
  const districtLabel = district.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const cityLabel = city.charAt(0).toUpperCase() + city.slice(1);
  const matches = db.restaurants.filter(
    (r) => r.city === city && r.district?.toLowerCase().replace(/\s+/g, "-") === district
  );
  return {
    title: `Best Restaurants in ${districtLabel} ${cityLabel} — ${matches.length} Verified | Thaigle`,
    description: `${matches.length} restaurants in ${districtLabel}, ${cityLabel} ranked by Trust Score. No influencer hype — real Google review data.`,
    alternates: { canonical: `/restaurants/${city}/${district}` },
  };
}

export default async function DistrictHub(
  { params }: { params: Promise<{ city: string; district: string }> }
) {
  const { city, district } = await params;
  const [db, slugMap] = await Promise.all([loadMasterDb(), getSlugMap()]);

  const restaurants = db.restaurants.filter(
    (r) => r.city === city && (r.district?.toLowerCase().replace(/\s+/g, "-") === district || (!r.district && district === "other"))
  );
  if (restaurants.length === 0) notFound();

  const districtLabel = district === "other" ? "Other Areas" : district.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const cityLabel = city.charAt(0).toUpperCase() + city.slice(1);
  const sorted = [...restaurants].sort((a, b) => b.trust_score - a.trust_score);

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Thaigle", url: "/" },
        { name: "Restaurants", url: "/restaurants" },
        { name: cityLabel, url: `/restaurants/${city}` },
        { name: districtLabel, url: `/restaurants/${city}/${district}` },
      ]} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Restaurants in {districtLabel}</h1>
        <p className="text-[var(--muted)] mb-8">{restaurants.length} restaurants · {cityLabel}</p>
        <div className="space-y-2">
          {sorted.map((r, i) => {
            const entry = slugMap[r.id];
            if (!entry) return null;
            return (
              <a key={r.id} href={restaurantUrl(entry)}
                 className="flex items-center gap-3 p-3 border rounded-lg hover:border-orange-400 transition">
                <span className="font-bold text-[var(--muted)] w-6">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{r.name}</div>
                  <div className="text-xs text-[var(--muted)]">★{r.rating} · {r.total_reviews} reviews</div>
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
