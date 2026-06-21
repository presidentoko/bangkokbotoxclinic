import { notFound } from "next/navigation";
import { loadMasterDb, filterByCuisine } from "@/lib/data";
import { getSlugMap, restaurantUrl } from "@/lib/restaurants";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  return Object.keys(db.cuisine_counts).map((cuisine) => ({ cuisine }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ cuisine: string }> }
): Promise<Metadata> {
  const { cuisine } = await params;
  const label = CUISINE_LABELS[cuisine] ?? cuisine;
  const db = await loadMasterDb();
  const list = filterByCuisine(db.restaurants, cuisine);
  const totalReviews = list.reduce((s, r) => s + r.total_reviews, 0);
  return {
    title: `${label} Food Bangkok — ${list.length} Restaurants, No Influencer Rankings | Thaigle`,
    description: `${list.length} ${label.toLowerCase()} restaurants in Bangkok and Pattaya from ${totalReviews.toLocaleString()} Google reviews. Trust Score ranked. No paid influencer rankings.`,
    alternates: { canonical: `/restaurants/cuisine/${cuisine}` },
  };
}

export default async function CuisineHub(
  { params }: { params: Promise<{ cuisine: string }> }
) {
  const { cuisine } = await params;
  const [db, slugMap] = await Promise.all([loadMasterDb(), getSlugMap()]);
  const label = CUISINE_LABELS[cuisine] ?? cuisine;
  const list = filterByCuisine(db.restaurants, cuisine);
  if (list.length === 0) notFound();
  const sorted = [...list].sort((a, b) => b.trust_score - a.trust_score);

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Thaigle", url: "/" },
        { name: "Restaurants", url: "/restaurants" },
        { name: label, url: `/restaurants/cuisine/${cuisine}` },
      ]} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{CUISINE_ICONS[cuisine]} {label} Restaurants in Bangkok</h1>
        <p className="text-[var(--muted)] mb-8">{list.length} restaurants · Trust Score ranked · No influencer hype</p>
        <div className="space-y-2">
          {sorted.slice(0, 50).map((r, i) => {
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
