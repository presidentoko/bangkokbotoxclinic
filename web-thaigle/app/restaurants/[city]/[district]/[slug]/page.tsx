import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { getSlugMap, getRestaurantBySlug, getTop500Params, restaurantUrl } from "@/lib/restaurants";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, RestaurantJsonLd } from "@/components/JsonLd";
import { TrustDonut } from "@/components/TrustBadge";
import { MapEmbed } from "@/components/MapEmbed";
import { RatingChart } from "@/components/RatingChart";
import { TopicCluster } from "@/components/TopicCluster";
import { AIVerifiedBadge, SponsoredBadge, Freshness, RelativeRanking } from "@/components/Badges";
import { sponsoredTier } from "@/lib/sponsored";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import type { Metadata } from "next";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const [db, slugMap] = await Promise.all([
    loadMasterDb(),
    getSlugMap(),
  ]);
  return getTop500Params(db.restaurants, slugMap);
}

export async function generateMetadata(
  { params }: { params: Promise<{ city: string; district: string; slug: string }> }
): Promise<Metadata> {
  const { city, district, slug } = await params;
  const [db, slugMap] = await Promise.all([loadMasterDb(), getSlugMap()]);
  const r = getRestaurantBySlug(db.restaurants, slugMap, city, district, slug);
  if (!r) return { title: "Restaurant not found" };

  const cuisines = r.cuisines.map((c) => CUISINE_LABELS[c] ?? c).join(", ");
  const cityLabel = r.city_label || city.charAt(0).toUpperCase() + city.slice(1);
  const title = `${r.name} ${cityLabel} — ${r.total_reviews} Reviews ★${r.rating} | Thaigle`;
  const description = `${r.name} in ${r.district || cityLabel}: ★${r.rating} (${r.total_reviews} reviews). Trust Score ${r.trust_score}/100 — ${r.trust_score >= 80 ? "highly credible" : r.trust_score >= 60 ? "credible" : "verify yourself"}. ${cuisines || "Restaurant"}.`;
  const canonical = restaurantUrl({ city, district, slug });

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: "article" },
  };
}

export default async function RestaurantPage(
  { params }: { params: Promise<{ city: string; district: string; slug: string }> }
) {
  const { city, district, slug } = await params;
  const [db, slugMap] = await Promise.all([loadMasterDb(), getSlugMap()]);
  const r = getRestaurantBySlug(db.restaurants, slugMap, city, district, slug);
  if (!r) notFound();

  const tier = sponsoredTier(r.id);
  const samples = [...r.sample_reviews_en, ...r.sample_reviews_th].slice(0, 4);
  const cityLabel = r.city_label || city.charAt(0).toUpperCase() + city.slice(1);
  const districtLabel = r.district || cityLabel;
  const url = restaurantUrl({ city, district, slug });

  // Trust breakdown
  const ratingPart = (r.rating / 5) * 50;
  const volumePart = Math.min(40, Math.log10(Math.max(1, r.total_reviews)) * 12);
  const lgRatio = r.scraped_review_count > 0 ? r.local_guide_count / r.scraped_review_count : 0;
  const lgPart = Math.min(10, lgRatio * 20);
  const authPart = Math.min(5, Math.log10(Math.max(1, r.avg_author_review_count)) * 2);
  const breakdown = [
    { label: "Rating", value: ratingPart, max: 50, color: "#16a34a" },
    { label: "Volume", value: volumePart, max: 40, color: "#dc2626" },
    { label: "Local Gd", value: lgPart, max: 10, color: "#7c3aed" },
    { label: "Authority", value: authPart, max: 5, color: "#0891b2" },
  ];

  const cohort = r.cuisines.length > 0
    ? db.restaurants.filter((x) => x.cuisines.some((c) => r.cuisines.includes(c)) && x.city === r.city)
    : db.restaurants.filter((x) => x.city === r.city);
  const sortedTrust = cohort.map((x) => x.trust_score).sort((a, b) => b - a);
  const idx = sortedTrust.indexOf(r.trust_score);
  const percentile = sortedTrust.length > 0 ? Math.round((idx / sortedTrust.length) * 100) : 100;

  const cuisineLabel = r.cuisines.length > 0 ? (CUISINE_LABELS[r.cuisines[0]] ?? r.cuisines[0]) : "restaurant";
  const aeoSummary = `${r.name} is a ${cuisineLabel.toLowerCase()} in ${districtLabel}, ${cityLabel} — Trust Score ${r.trust_score}/100 based on ${r.total_reviews} verified Google reviews (${Math.round(lgRatio * 100)}% real-reviewer ratio).`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Thaigle", url: "/" },
          { name: "Restaurants", url: "/restaurants" },
          { name: cityLabel, url: `/restaurants/${city}` },
          { name: districtLabel, url: `/restaurants/${city}/${district}` },
          { name: r.name, url: url },
        ]}
      />
      <RestaurantJsonLd r={r} url={url} />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="sr-only">{aeoSummary}</p>

        {tier && <SponsoredBadge id={r.id} />}
        <h1 className="text-2xl font-bold mb-1">{r.name}</h1>
        <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-4 flex-wrap">
          <span>📍 {districtLabel}, {cityLabel}</span>
          {r.cuisines.slice(0, 2).map((c) => (
            <span key={c}>{CUISINE_ICONS[c] ?? "🍽️"} {CUISINE_LABELS[c] ?? c}</span>
          ))}
          <Freshness generatedAt={db.generated_at} />
        </div>

        <div className="flex gap-6 mb-6 flex-wrap">
          <TrustDonut score={r.trust_score} breakdown={breakdown} />
          <div>
            <div className="text-3xl font-bold">★ {r.rating}</div>
            <div className="text-sm text-[var(--muted)]">{r.total_reviews.toLocaleString()} reviews</div>
            <AIVerifiedBadge r={r} />
            <RelativeRanking percentile={percentile} label={cuisineLabel} />
          </div>
        </div>

        <RatingChart trend={r.rating_trend} />
        <TopicCluster topics={r.mentioned_topics} />

        {samples.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold mb-3">Sample Reviews</h2>
            <div className="space-y-3">
              {samples.map((s, i) => (
                <div key={i} className="border rounded-lg p-3 text-sm">
                  <div className="text-[var(--muted)] mb-1">★ {s.rating} — {s.author}</div>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <AdSlot slot="restaurant-bottom" />
        <AffiliateInline district={r.district || cityLabel} />

        {r.maps_url && (
          <div className="mt-6">
            <a href={r.maps_url} target="_blank" rel="noopener noreferrer"
               className="text-sm text-blue-600 underline">View on Google Maps →</a>
          </div>
        )}
        <MapEmbed lat={r.lat} lng={r.lng} name={r.name} />
      </div>
    </>
  );
}
