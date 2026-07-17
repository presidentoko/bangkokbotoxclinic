import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { getSlugMap, getRestaurantBySlug, getAllRestaurantParams, restaurantUrl } from "@/lib/restaurants";
import { isThaiScript } from "@/lib/thaiName";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, RestaurantJsonLd } from "@/components/JsonLd";
import { TrustDonut } from "@/components/TrustBadge";
import { trustTierLong } from "@/lib/trust";
import { MapEmbed } from "@/components/MapEmbed";
import { RatingChart } from "@/components/RatingChart";
import { TopicCluster } from "@/components/TopicCluster";
import { AIVerifiedBadge, SponsoredBadge, Freshness, RelativeRanking } from "@/components/Badges";
import { sponsoredTier } from "@/lib/sponsored";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { ReportButton } from "@/components/ReportButton";
import { ShareButton } from "@/components/ShareButton";
import { SaveButton } from "@/components/SaveButton";
import { VersusVote } from "@/components/VersusVote";
import { BangkokTip } from "@/components/BangkokTip";
import { BangkokChallenge } from "@/components/BangkokChallenge";
import { VenueStamp } from "@/components/VenueStamp";
import { PopularTimes } from "@/components/PopularTimes";
import { QuickFacts } from "@/components/QuickFacts";
import { BangkokKhaoTom } from "@/components/BangkokKhaoTom";
import { BangkokSimCardGuide } from "@/components/BangkokSimCardGuide";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

// All 3,269 restaurants are already in the sitemap, so pre-render all of them
// — leaving 2,769 to render on-demand (dynamicParams=true) turned every
// sitemap-following crawler hit into a function invocation + ISR write
// against the 9.7MB master_db.json, plus a duplicate cost for the OG image.
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugMap = await getSlugMap();
  return getAllRestaurantParams(slugMap);
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
  const districtName = r.district || cityLabel;
  // Star-count-first titles ("★4.5 (1,234 Reviews)") target zero-search-
  // volume decoration — Google/Maps/TripAdvisor already own the brand-name
  // query. Leading with the cuisine targets what people actually search
  // ("mookata thonglor", "korean bbq sukhumvit").
  const cuisineFragment = r.cuisines.length > 0 ? (CUISINE_LABELS[r.cuisines[0]] ?? r.cuisines[0]) : "Restaurant";
  const title = `${r.name} — ${cuisineFragment} Restaurant in ${districtName}, ${cityLabel} (Menu, Prices & Reviews)`;
  const trustLabel = trustTierLong(r.trust_score);
  const description = `${r.name} in ${districtName}, ${cityLabel}: ★${r.rating} from ${r.total_reviews.toLocaleString()} Google reviews. Trust Score ${r.trust_score}/100 (${trustLabel}). ${cuisines || "Restaurant"}. View reviews, address & photos.`;
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
  // Some scraped rows have price_level polluted with a review-photo alt-text
  // sentence or a raw address instead of a real price descriptor. Real
  // values ("Moderately priced", "$$") top out well under this; garbage
  // rows measured 66+ chars.
  const priceLevel = r.price_level && r.price_level.length < 40 ? r.price_level : undefined;

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

  // Similar restaurants
  const similar = db.restaurants
    .filter((x) => x.id !== r.id && x.city === r.city && x.cuisines.some((c) => r.cuisines.includes(c)))
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 4);

  const cohort = r.cuisines.length > 0
    ? db.restaurants.filter((x) => x.cuisines.some((c) => r.cuisines.includes(c)) && x.city === r.city)
    : db.restaurants.filter((x) => x.city === r.city);
  const sortedTrust = cohort.map((x) => x.trust_score).sort((a, b) => b - a);
  const idx = sortedTrust.indexOf(r.trust_score);
  const percentile = sortedTrust.length > 0 ? Math.round((idx / sortedTrust.length) * 100) : 100;

  const cuisineLabel = r.cuisines.length > 0 ? (CUISINE_LABELS[r.cuisines[0]] ?? r.cuisines[0]) : "restaurant";
  const cuisines = r.cuisines.map((c) => CUISINE_LABELS[c] ?? c).join(", ");
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

        {/* Breadcrumb — was JSON-LD-only, so every restaurant page passed
            zero crawlable link equity up to the district/city hubs. */}
        <nav className="text-sm text-[var(--muted)] mb-4 flex items-center gap-2 flex-wrap">
          <a href="/restaurants" className="hover:text-black">Restaurants</a>
          <span>›</span>
          <a href={`/restaurants/${city}`} className="hover:text-black">{cityLabel}</a>
          <span>›</span>
          <a href={`/restaurants/${city}/${district}`} className="hover:text-black">{districtLabel}</a>
          <span>›</span>
          <span className="text-[var(--fg)] truncate max-w-[200px]">{r.name}</span>
        </nav>

        {tier && <SponsoredBadge id={r.id} />}
        <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
          <h1 className="text-2xl font-bold flex items-center gap-2 flex-wrap">
            {r.name}
            {isThaiScript(r.name) && (
              <span
                className="text-xs font-medium text-[var(--muted)] border border-[var(--border)] rounded-full px-2 py-0.5"
                title="No English name on file for this venue — use the map link to navigate"
              >
                Thai name — no English listing
              </span>
            )}
          </h1>
          <div className="flex items-center gap-2 shrink-0">
            <SaveButton item={{ id: r.id, name: r.name, type: "restaurant", url: `${url}` }} />
            <ShareButton
              title={`${r.name} — ★${r.rating} (Trust Score ${r.trust_score}) | Thaigle`}
              text={`Check out ${r.name} in ${districtLabel}, ${cityLabel} — ranked by real Google reviews`}
              url={`${SITE}${url}`}
              whatsapp
              line
              facebook
            />
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--muted)] mb-4 flex-wrap">
          <span>📍 {districtLabel}, {cityLabel}</span>
          {r.cuisines.slice(0, 2).map((c) => (
            <span key={c}>{CUISINE_ICONS[c] ?? "🍽️"} {CUISINE_LABELS[c] ?? c}</span>
          ))}
          <Freshness generatedAt={db.generated_at} />
        </div>

        {/* Primary action row — previously the only next-action on this
            template was a small blue text link buried after the map. */}
        {(r.maps_url || r.phone || r.website) && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {r.maps_url && (
              <a
                href={r.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-bold hover:bg-orange-700 transition"
              >
                📍 Directions
              </a>
            )}
            {r.phone && (
              <a
                href={`tel:${r.phone}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[var(--border)] bg-white text-sm font-bold hover:border-orange-300 hover:text-orange-600 transition"
              >
                📞 Call
              </a>
            )}
            {r.website && (
              <a
                href={r.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[var(--border)] bg-white text-sm font-bold hover:border-orange-300 hover:text-orange-600 transition"
              >
                🌐 Website
              </a>
            )}
          </div>
        )}

        <div className="flex gap-6 mb-6 flex-wrap">
          <TrustDonut score={r.trust_score} breakdown={breakdown} />
          <div>
            <div className="text-3xl font-bold">★ {r.rating}</div>
            <div className="text-sm text-[var(--muted)]">{r.total_reviews.toLocaleString()} reviews</div>
            <AIVerifiedBadge r={r} />
            <RelativeRanking percentile={percentile} label={cuisineLabel} />
          </div>
        </div>

        <QuickFacts priceRange={priceLevel} />
        <RatingChart trend={r.rating_trend} />
        <PopularTimes type="restaurant" />
        <TopicCluster topics={r.mentioned_topics} />

        {samples.length > 0 && (
          <section className="mt-6">
            <h2 className="font-semibold mb-3">What Google Reviewers Say About {r.name}</h2>
            <div className="space-y-3">
              {samples.map((s, i) => (
                <div key={i} className="border rounded-lg p-3 text-sm">
                  <div className="text-[var(--muted)] mb-1">★ {s.rating} — {s.author}</div>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <AdSlot slot="restaurant-bottom" />
        <AffiliateInline district={r.district || cityLabel} />

        <section className="mt-6 border border-[var(--border)] rounded-xl p-4 bg-white">
          <h2 className="font-semibold mb-3 text-sm uppercase tracking-wide text-[var(--muted)]">About {r.name}</h2>
          <dl className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex gap-2">
              <dt className="text-[var(--muted)] shrink-0 w-24">Location</dt>
              <dd>{r.address || `${districtLabel}, ${cityLabel}`}</dd>
            </div>
            {r.cuisines.length > 0 && (
              <div className="flex gap-2">
                <dt className="text-[var(--muted)] shrink-0 w-24">Cuisine</dt>
                <dd>{cuisines}</dd>
              </div>
            )}
            {priceLevel && (
              <div className="flex gap-2">
                <dt className="text-[var(--muted)] shrink-0 w-24">Price range</dt>
                <dd>{priceLevel}</dd>
              </div>
            )}
            <div className="flex gap-2">
              <dt className="text-[var(--muted)] shrink-0 w-24">Trust Score</dt>
              <dd>{r.trust_score}/100 — {trustTierLong(r.trust_score)}</dd>
            </div>
            {r.phone && (
              <div className="flex gap-2">
                <dt className="text-[var(--muted)] shrink-0 w-24">Phone</dt>
                <dd><a href={`tel:${r.phone}`} className="text-orange-600 hover:underline">{r.phone}</a></dd>
              </div>
            )}
            {r.website && (
              <div className="flex gap-2">
                <dt className="text-[var(--muted)] shrink-0 w-24">Website</dt>
                <dd><a href={r.website} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline truncate">{r.website.replace(/^https?:\/\//, "")}</a></dd>
              </div>
            )}
          </dl>
        </section>

        <section className="mt-4">
          <h2 className="sr-only">Map — {r.name}</h2>
          <MapEmbed lat={r.lat} lng={r.lng} name={r.name} />
        </section>
        <div className="mt-4">
          <VenueStamp venueId={r.id} venueName={r.name} />
          <ReportButton venueName={r.name} venueUrl={`${SITE}${restaurantUrl(slugMap[r.id] ?? { city, district, slug })}`} />
        </div>

        {/* Similar restaurants */}
        {similar.length > 0 && (
          <section className="mt-8">
            <h2 className="font-semibold mb-3 text-sm uppercase tracking-wide text-[var(--muted)]">
              More {cuisineLabel} restaurants in {cityLabel}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {similar.map((s) => {
                const entry = slugMap[s.id];
                if (!entry) return null;
                return (
                  <a key={s.id} href={restaurantUrl(entry)}
                    className="block p-3 border rounded-xl hover:border-orange-400 hover:bg-orange-50 transition group">
                    <div className="font-medium text-sm group-hover:text-orange-700 transition truncate">{s.name}</div>
                    <div className="text-xs text-[var(--muted)] mt-0.5">★{s.rating.toFixed(1)} · Trust {s.trust_score}</div>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* Daily Challenge */}
        <BangkokChallenge />

        {/* Daily Tip */}
        <BangkokTip />

        {/* Quick Poll */}
        <div className="mt-4">
          <VersusVote
            question="When dining in Bangkok — what do you prefer?"
            a={{ id: "street-food", label: "Street food stalls", emoji: "🥢", desc: "Plastic stools, 50 baht, maximum flavour", url: "/restaurants/cuisine/street_food" }}
            b={{ id: "restaurant", label: "Sit-down restaurant", emoji: "🍽️", desc: "AC, menu, proper service — worth paying more", url: "/restaurants/cuisine/thai" }}
          />
        </div>

        <BangkokKhaoTom />
        <BangkokSimCardGuide />

        {/* Quiz CTA */}
        <div className="mt-4 p-4 rounded-2xl bg-orange-50 border border-orange-200 text-center">
          <div className="text-2xl mb-1">🎯</div>
          <div className="font-black mb-1">Not sure what to try next?</div>
          <div className="text-sm text-[var(--muted)] mb-3">Take our Bangkok traveler quiz for personalized picks.</div>
          <a href="/quiz" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition">
            Take the quiz →
          </a>
        </div>
      </div>
    </>
  );
}
