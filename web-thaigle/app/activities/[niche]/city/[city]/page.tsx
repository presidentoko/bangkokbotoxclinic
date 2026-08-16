import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  NICHES,
  loadNicheDb,
  qualifyingNichePlaces,
  buildKlookIndex,
  NICHE_CITY_SLUGS,
  NICHE_CITY_MIN_VENUES,
  nicheCityCounts,
} from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";
import { nicheAreaCounts } from "@/lib/areas";
import { NicheGrid } from "@/components/NicheGrid";
import { NicheItemListJsonLd, FaqJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { ShareButton } from "@/components/ShareButton";

export const dynamic = "force-static";
export const dynamicParams = false;
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

// GSC data showed real search volume for area/city-qualified queries
// ("wellness spa sukhumvit", "cooking class chiang mai") that the
// Thailand-wide /activities/[niche] page doesn't target in its title/H1.
// Venue records have no usable district/address field (0% populated in the
// scraped data), so this only splits by `city`, which IS reliably
// populated — and only for niche×city combos with enough qualifying
// venues to be worth a dedicated page.
const SLUG_TO_CITY = Object.fromEntries(Object.entries(NICHE_CITY_SLUGS).map(([city, slug]) => [slug, city]));
const MIN_VENUES = NICHE_CITY_MIN_VENUES;

export async function generateStaticParams() {
  const params: { niche: string; city: string }[] = [];
  for (const n of NICHES) {
    const db = await loadNicheDb(n.slug as NicheSlug);
    for (const { slug } of nicheCityCounts(n.slug, db.places)) {
      params.push({ niche: n.slug, city: slug });
    }
  }
  return params;
}

const PRICE_BAND_LABELS: Record<string, string> = {
  budget: "฿",
  mid: "฿฿",
  premium: "฿฿฿",
  luxury: "฿฿฿฿",
};

type Props = { params: Promise<{ niche: string; city: string }> };

function cityFromSlug(slug: string): string | null {
  return SLUG_TO_CITY[slug] ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { niche, city: citySlug } = await params;
  const info = NICHES.find((n) => n.slug === niche);
  const city = cityFromSlug(citySlug);
  if (!info || !city) return {};
  const db = await loadNicheDb(niche as NicheSlug);
  const count = qualifyingNichePlaces(niche, db.places).filter((p) => p.city === city).length;
  if (count < MIN_VENUES) return {};

  return {
    title: `Best ${info.label} in ${city} 2026 — ${count} Ranked by Real Reviews`,
    description: `Find the best ${info.label.toLowerCase()} in ${city} in 2026. ${count} venues ranked by Trust Score from real Google reviews — prices and Klook booking. No paid picks.`,
    alternates: { canonical: `/activities/${niche}/city/${citySlug}` },
    openGraph: {
      title: `Best ${info.label} in ${city} 2026`,
      description: `${count} ${info.label.toLowerCase()} venues in ${city} ranked by Trust Score from verified Google reviews.`,
    },
  };
}

export default async function NicheCityPage({ params }: Props) {
  const { niche, city: citySlug } = await params;
  const info = NICHES.find((n) => n.slug === niche);
  const city = cityFromSlug(citySlug);
  if (!info || !city) notFound();

  const db = await loadNicheDb(niche as NicheSlug);
  const cityPlaces = qualifyingNichePlaces(niche, db.places).filter((p) => p.city === city);
  if (cityPlaces.length < MIN_VENUES) notFound();

  const klookMap = await buildKlookIndex(cityPlaces.map((p) => p.id));
  const pageUrl = `${SITE}/activities/${niche}/city/${citySlug}`;
  const areaLinks = city === "Bangkok" ? nicheAreaCounts(niche, db.places) : [];

  const faqs = [
    {
      q: `What's the best ${info.label.toLowerCase()} in ${city}?`,
      a: `${cityPlaces[0].name} currently ranks highest by Trust Score (${cityPlaces[0].trust_score}/100) among ${cityPlaces.length} ${info.label.toLowerCase()} venues we track in ${city}. Trust Score combines rating, review volume, and reviewer credibility from public Google Maps data — no paid placements.`,
    },
    {
      q: `How many ${info.label.toLowerCase()} venues are there in ${city}?`,
      a: `We track ${cityPlaces.length} ${info.label.toLowerCase()} venues in ${city} with enough real review data to rank confidently — see the full ranked list below.`,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
      <nav className="text-sm text-[var(--muted)] mb-4 flex items-center gap-2 flex-wrap">
        <a href="/activities" className="hover:text-black">Activities</a>
        <span>›</span>
        <a href={`/activities/${niche}`} className="hover:text-black">{info.label}</a>
        <span>›</span>
        <span className="text-[var(--fg)]">{city}</span>
      </nav>

      <div className="mb-6">
        <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{info.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                Best {info.label} in {city}
              </h1>
              <p className="text-sm text-[var(--muted)] mt-1">
                {cityPlaces.length} venues · ranked by real Google reviews
              </p>
            </div>
          </div>
          <ShareButton
            title={`Best ${info.label} in ${city}`}
            text={`${cityPlaces.length} ${info.label.toLowerCase()} venues in ${city} ranked by real Google reviews — no paid picks`}
            url={pageUrl}
            kakao
            line
            whatsapp
          />
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">✓ No paid rankings</span>
          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">📊 Trust Score method</span>
        </div>
      </div>

      <div className="mb-4 text-sm">
        <span className="text-[var(--muted)]">Want the wider selection? </span>
        <a href={`/activities/${niche}`} className="text-orange-600 font-bold hover:underline">
          See all {info.label} across Thailand →
        </a>
      </div>

      {/* Narrow down to an area. Only Bangkok has them — the area names are
          Bangkok's — and this is the step that keeps the city page from being
          a dead end between the hub and 150-odd venue pages. */}
      {areaLinks.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-[var(--muted)]">Narrow down by area:</span>
          {areaLinks.map(({ area, count }) => (
            <a
              key={area.slug}
              href={`/activities/${niche}/area/${area.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] bg-white text-sm font-medium hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 transition"
            >
              {area.label}
              <span className="text-[var(--muted)] tabular-nums text-xs">{count}</span>
            </a>
          ))}
        </div>
      )}

      <NicheGrid
        places={cityPlaces}
        klookData={[...klookMap.entries()]}
        nicheSlug={niche}
        nicheIcon={info.icon}
        planType={info.planType}
        PRICE_BAND_LABELS={PRICE_BAND_LABELS}
      />

      <NicheItemListJsonLd
        name={`Best ${info.label} in ${city} 2026`}
        items={cityPlaces.slice(0, 20).map((p) => ({
          name: p.name,
          slug: p.slug,
          niche,
          rating: p.rating,
          review_count: p.review_count,
          address: p.address,
        }))}
        url={`/activities/${niche}/city/${citySlug}`}
      />
      <FaqJsonLd faqs={faqs} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Activities", url: "/activities" },
        { name: info.label, url: `/activities/${niche}` },
        { name: city, url: `/activities/${niche}/city/${citySlug}` },
      ]} />
    </div>
  );
}
