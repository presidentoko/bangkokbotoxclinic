import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { getSlugMap, restaurantUrl, slugifySegment } from "@/lib/restaurants";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { ShareButton } from "@/components/ShareButton";
import { VersusVote } from "@/components/VersusVote";
import { BangkokTip } from "@/components/BangkokTip";
import { BangkokChallenge } from "@/components/BangkokChallenge";
import { RatingLegend } from "@/components/RatingLegend";
import { RestaurantTips } from "@/components/RestaurantTips";
import { NearbyThings } from "@/components/NearbyThings";
import { BangkokTransportGuide } from "@/components/BangkokTransportGuide";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  const pairs = new Set<string>();
  for (const r of db.restaurants) {
    if (r.district) {
      const districtSlug = slugifySegment(r.district);
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
    (r) => r.city === city && r.district && slugifySegment(r.district) === district
  );
  const topRestaurant = matches.sort((a, b) => b.trust_score - a.trust_score)[0];
  const topSnippet = topRestaurant ? ` Best: ${topRestaurant.name} (★${topRestaurant.rating}).` : "";
  return {
    title: `Best Restaurants in ${districtLabel}, ${cityLabel} 2026 — ${matches.length} Ranked`,
    description: `${matches.length} restaurants in ${districtLabel}, ${cityLabel} ranked by Trust Score from real Google reviews.${topSnippet} No influencer hype. Updated 2026.`,
    alternates: { canonical: `/restaurants/${city}/${district}` },
    openGraph: {
      title: `Best ${districtLabel} Restaurants 2026`,
      description: `${matches.length} restaurants in ${districtLabel} ranked by real Google reviews — no paid placements.`,
    },
  };
}

export default async function DistrictHub(
  { params }: { params: Promise<{ city: string; district: string }> }
) {
  const { city, district } = await params;
  const [db, slugMap] = await Promise.all([loadMasterDb(), getSlugMap()]);

  const restaurants = db.restaurants.filter(
    (r) => r.city === city && ((r.district && slugifySegment(r.district) === district) || (!r.district && district === "other"))
  );
  if (restaurants.length === 0) notFound();

  const districtLabel = district === "other" ? "Other Areas" : district.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const cityLabel = city.charAt(0).toUpperCase() + city.slice(1);
  const sorted = [...restaurants].sort((a, b) => b.trust_score - a.trust_score);

  const cuisineCounts: Record<string, number> = {};
  for (const r of restaurants) {
    for (const c of r.cuisines) {
      cuisineCounts[c] = (cuisineCounts[c] ?? 0) + 1;
    }
  }
  const topCuisines = Object.entries(cuisineCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Thaigle", url: "/" },
        { name: "Restaurants", url: "/restaurants" },
        { name: cityLabel, url: `/restaurants/${city}` },
        { name: districtLabel, url: `/restaurants/${city}/${district}` },
      ]} />
      <CollectionPageJsonLd
        name={`Best Restaurants in ${districtLabel}, ${cityLabel} 2026`}
        description={`${restaurants.length} restaurants in ${districtLabel} ranked by Trust Score from real Google reviews.`}
        url={`/restaurants/${city}/${district}`}
        items={sorted.slice(0, 20)}
        slugMap={slugMap}
      />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="text-sm text-[var(--muted)] mb-4">
          <a href="/" className="hover:text-black">Home</a>
          <span className="mx-1.5">›</span>
          <a href="/restaurants" className="hover:text-black">Restaurants</a>
          <span className="mx-1.5">›</span>
          <a href={`/restaurants/${city}`} className="hover:text-black">{cityLabel}</a>
          <span className="mx-1.5">›</span>
          <span>{districtLabel}</span>
        </nav>
        <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
          <h1 className="text-3xl font-bold">Best Restaurants in {districtLabel} (2026)</h1>
          <ShareButton
            title={`Best Restaurants in ${districtLabel} — Thaigle`}
            text={`${restaurants.length} restaurants in ${districtLabel}, ${cityLabel} — ranked by real Google reviews`}
            url={`${SITE}/restaurants/${city}/${district}`}
            line whatsapp
          />
        </div>
        <p className="text-[var(--muted)] mb-6">{restaurants.length.toLocaleString()} restaurants · {cityLabel} · Trust Score ranked</p>
        {topCuisines.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {topCuisines.map(([cat, count]) => (
              <a key={cat} href={`/restaurants/cuisine/${cat}`}
                 className="inline-flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs hover:bg-orange-50 hover:border-orange-400 transition font-medium">
                {CUISINE_ICONS[cat] && <span aria-hidden>{CUISINE_ICONS[cat]}</span>}
                {CUISINE_LABELS[cat] ?? cat}
                <span className="text-[var(--muted)]">{count}</span>
              </a>
            ))}
          </div>
        )}
        <div className="space-y-2">
          {sorted.map((r, i) => {
            const entry = slugMap[r.id];
            if (!entry) return null;
            return (
              <a key={r.id} href={restaurantUrl(entry)}
                 className="flex items-center gap-3 p-3 border rounded-lg hover:border-orange-400 transition">
                <span className="font-bold text-[var(--muted)] w-6 text-sm">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{r.name}</div>
                  <div className="text-xs text-[var(--muted)]">★{r.rating} · {r.total_reviews.toLocaleString()} reviews
                    {r.cuisines.length > 0 && ` · ${(CUISINE_LABELS[r.cuisines[0]] ?? r.cuisines[0])}`}
                  </div>
                </div>
                <div className="text-sm font-semibold text-orange-600 shrink-0">Trust {r.trust_score}</div>
              </a>
            );
          })}
        </div>

        <RestaurantTips />
        <RatingLegend />
        <NearbyThings context="restaurant" />
        <BangkokTransportGuide />
        <BangkokChallenge />
        <BangkokTip />

        {/* Poll */}
        <div className="mt-8 mb-4">
          <VersusVote
            question="When you're out in Bangkok — what drives your restaurant choice?"
            a={{ id: "walk-in", label: "Walk in & see what looks good", emoji: "🚶", desc: "Spontaneous, trusting your instincts and the crowd", url: "/trending" }}
            b={{ id: "research-first", label: "Research the Trust Score first", emoji: "📊", desc: "Check the data before you commit — no tourist trap risk", url: "/methodology" }}
          />
        </div>

        {/* Quiz CTA */}
        <div className="mt-4 p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="font-black text-sm">🎯 Not sure what to eat?</div>
            <div className="text-xs text-[var(--muted)] mt-0.5">Take our 5-question Bangkok quiz for personalized picks</div>
          </div>
          <a href="/quiz" className="shrink-0 px-4 py-2 rounded-full bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition">
            Take quiz →
          </a>
        </div>
      </div>
    </>
  );
}
