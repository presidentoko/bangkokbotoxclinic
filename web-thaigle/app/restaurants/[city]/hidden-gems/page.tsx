import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { getSlugMap, restaurantUrl } from "@/lib/restaurants";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { VersusVote } from "@/components/VersusVote";
import { ShareButton } from "@/components/ShareButton";
import { BangkokTip } from "@/components/BangkokTip";
import { BangkokChallenge } from "@/components/BangkokChallenge";
import { LocalsChoice } from "@/components/LocalsChoice";
import { StreetFoodGuide } from "@/components/StreetFoodGuide";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const dynamicParams = false;

export async function generateStaticParams() {
  return [{ city: "bangkok" }, { city: "pattaya" }];
}

export async function generateMetadata(
  { params }: { params: Promise<{ city: string }> }
): Promise<Metadata> {
  const { city } = await params;
  const label = city.charAt(0).toUpperCase() + city.slice(1);
  return {
    title: `Hidden Gem Restaurants in ${label} — High Trust, Low Hype | Thaigle`,
    description: `${label} restaurants with Trust Score 85+ but under 500 reviews — genuinely great places that haven't been discovered by the influencer machine yet.`,
    alternates: { canonical: `/restaurants/${city}/hidden-gems` },
  };
}

export default async function HiddenGemsPage(
  { params }: { params: Promise<{ city: string }> }
) {
  const { city } = await params;
  const [db, slugMap] = await Promise.all([loadMasterDb(), getSlugMap()]);
  const cityRestaurants = db.restaurants.filter((r) => r.city === city);
  if (cityRestaurants.length === 0) notFound();

  const label = city.charAt(0).toUpperCase() + city.slice(1);

  // trust_score >= 85 AND total_reviews < 500 (진짜 좋은데 아직 덜 알려진)
  const gems = cityRestaurants
    .filter((r) => r.trust_score >= 85 && r.total_reviews < 500)
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 30);

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Thaigle", url: "/" },
        { name: "Restaurants", url: "/restaurants" },
        { name: label, url: `/restaurants/${city}` },
        { name: "Hidden Gems", url: `/restaurants/${city}/hidden-gems` },
      ]} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h1 className="text-3xl font-bold">Hidden Gem Restaurants in {label}</h1>
          <ShareButton title={`Hidden Gem Restaurants in ${label} 2026`} text="Real hidden gems — high Trust Score, low review count, no hype" url={`${SITE}/restaurants/${city}/hidden-gems`} line whatsapp />
        </div>
        <p className="text-[var(--muted)] mb-4">Trust Score 85+ · Under 500 reviews · Not yet discovered by influencers</p>
        <p className="mb-8 text-sm bg-green-50 border border-green-200 rounded-lg p-4">
          These places score extremely well on real reviewer credibility but haven't been taken over by influencer traffic yet. Find them before everyone else does.
        </p>
        <div className="space-y-3">
          {gems.map((r) => {
            const entry = slugMap[r.id];
            if (!entry) return null;
            return (
              <a key={r.id} href={restaurantUrl(entry)}
                 className="block border border-green-200 rounded-xl p-4 hover:border-green-400 transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{r.name}</div>
                    <div className="text-xs text-[var(--muted)]">{r.district || label}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-green-700">Trust {r.trust_score}</div>
                    <div className="text-xs text-[var(--muted)]">★{r.rating} · {r.total_reviews} reviews</div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <LocalsChoice />
        <StreetFoodGuide />
        <BangkokChallenge />
        <BangkokTip />
      </div>

      {/* Poll */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <VersusVote
          question="How do you find hidden gem restaurants in Bangkok?"
          a={{ id: "local-ask", label: "Ask a local / expat", emoji: "🤝", desc: "Personal recommendations, real insights", url: "/local-tips", highlight: "Most trusted" }}
          b={{ id: "explore-walk", label: "Just explore on foot", emoji: "🚶", desc: "Wander side streets, follow your nose", url: "/restaurants" }}
        />
      </div>
    </>
  );
}
