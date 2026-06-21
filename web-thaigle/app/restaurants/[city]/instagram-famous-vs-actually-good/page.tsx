import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { getSlugMap, restaurantUrl } from "@/lib/restaurants";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
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
    title: `Instagram Famous vs Actually Good Restaurants in ${label} | Thaigle`,
    description: `Which ${label} restaurants are Instagram famous but actually overrated? Trust Score data reveals the gap between social media hype and real diner reviews.`,
    alternates: { canonical: `/restaurants/${city}/instagram-famous-vs-actually-good` },
  };
}

export default async function InstagramFamousPage(
  { params }: { params: Promise<{ city: string }> }
) {
  const { city } = await params;
  const [db, slugMap] = await Promise.all([loadMasterDb(), getSlugMap()]);
  const cityRestaurants = db.restaurants.filter((r) => r.city === city);
  if (cityRestaurants.length === 0) notFound();

  const label = city.charAt(0).toUpperCase() + city.slice(1);

  // 판별 기준: total_reviews 상위 20% AND trust_score 하위 40%
  const sorted = [...cityRestaurants].sort((a, b) => b.total_reviews - a.total_reviews);
  const top20pct = sorted.slice(0, Math.ceil(sorted.length * 0.2));
  const byTrust = [...cityRestaurants].sort((a, b) => b.trust_score - a.trust_score);
  const bottom40pctIds = new Set(
    byTrust.slice(Math.ceil(byTrust.length * 0.6)).map((r) => r.id)
  );
  const overhyped = top20pct
    .filter((r) => bottom40pctIds.has(r.id))
    .sort((a, b) => b.total_reviews - a.total_reviews)
    .slice(0, 30);

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Thaigle", url: "/" },
        { name: "Restaurants", url: "/restaurants" },
        { name: label, url: `/restaurants/${city}` },
        { name: "Instagram Famous vs Actually Good", url: `/restaurants/${city}/instagram-famous-vs-actually-good` },
      ]} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Instagram Famous vs Actually Good</h1>
        <p className="text-[var(--muted)] mb-2">{label} · Updated from {db.generated_at.slice(0, 10)}</p>
        <p className="mb-8 text-sm bg-orange-50 border border-orange-200 rounded-lg p-4">
          These restaurants have <strong>high review counts</strong> (lots of visitors) but <strong>low Trust Scores</strong> — meaning the ratings may not reflect the real diner experience. High volume + low trust = social media hype ≠ quality.
        </p>
        <div className="space-y-3">
          {overhyped.map((r) => {
            const entry = slugMap[r.id];
            if (!entry) return null;
            const lgRatio = r.scraped_review_count > 0
              ? Math.round((r.local_guide_count / r.scraped_review_count) * 100)
              : 0;
            return (
              <a key={r.id} href={restaurantUrl(entry)}
                 className="block border rounded-xl p-4 hover:border-orange-400 transition">
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
                <div className="mt-2 text-xs text-[var(--muted)]">
                  {r.total_reviews} reviews · Trust Score {r.trust_score}/100 · {lgRatio}% verified reviewers
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}
