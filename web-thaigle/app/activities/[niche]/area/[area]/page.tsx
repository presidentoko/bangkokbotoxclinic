import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  NICHES,
  loadNicheDb,
  buildKlookIndex,
} from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";
import { AREA_MIN_VENUES, findArea, nicheAreaCounts, placesInArea } from "@/lib/areas";
import { NicheGrid } from "@/components/NicheGrid";
import { NicheItemListJsonLd, FaqJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { ShareButton } from "@/components/ShareButton";

export const dynamic = "force-static";
export const dynamicParams = false;
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

// The niche hub links 60 venues; the rest sit behind /activities/[niche]/all,
// a single page carrying 615 links. Google's response to that shape was 3,751
// URLs in "Discovered - currently not indexed" — crawled the index, declined
// to fetch what it pointed at.
//
// These pages exist to fix both ends of that at once. They shorten the path to
// ~850 venue pages that previously had one deep inbound link, and they target
// the queries that were already earning impressions with nothing to land on:
// "wellness spa sukhumvit" pulled 667 impressions and 0 clicks over three
// months, because the only page for it was a Thailand-wide hub sitting at
// position 31.
export async function generateStaticParams() {
  const params: { niche: string; area: string }[] = [];
  for (const n of NICHES) {
    const db = await loadNicheDb(n.slug as NicheSlug);
    for (const { area } of nicheAreaCounts(n.slug, db.places)) {
      params.push({ niche: n.slug, area: area.slug });
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

type Props = { params: Promise<{ niche: string; area: string }> };

function medianPrice(places: { price_min_thb: number }[]): number | null {
  const p = places.map((x) => x.price_min_thb).filter((n) => n > 0).sort((a, b) => a - b);
  return p.length >= 5 ? p[Math.floor(p.length / 2)] : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { niche, area: areaSlug } = await params;
  const info = NICHES.find((n) => n.slug === niche);
  const area = findArea(areaSlug);
  if (!info || !area) return {};
  const db = await loadNicheDb(niche as NicheSlug);
  const places = placesInArea(area, niche, db.places);
  if (places.length < AREA_MIN_VENUES) return {};

  return {
    title: `Best ${info.label} in ${area.label}, Bangkok 2026 — ${places.length} Ranked by Real Reviews`,
    description: `${places.length} ${info.label.toLowerCase()} venues in ${area.label}, Bangkok, ranked by Trust Score from real Google reviews. ${area.transit}. Prices, hours and booking — no paid placements.`,
    alternates: { canonical: `/activities/${niche}/area/${areaSlug}` },
    openGraph: {
      title: `Best ${info.label} in ${area.label}, Bangkok`,
      description: `${places.length} ${info.label.toLowerCase()} venues in ${area.label} ranked by Trust Score from verified Google reviews.`,
    },
  };
}

export default async function NicheAreaPage({ params }: Props) {
  const { niche, area: areaSlug } = await params;
  const info = NICHES.find((n) => n.slug === niche);
  const area = findArea(areaSlug);
  if (!info || !area) notFound();

  const db = await loadNicheDb(niche as NicheSlug);
  const places = placesInArea(area, niche, db.places);
  if (places.length < AREA_MIN_VENUES) notFound();

  // Same card cap as the niche hub, so the two pages weigh the same order of
  // magnitude; everything past it is listed as a link below.
  const CARD_CAP = 60;
  const carded = places.slice(0, CARD_CAP);
  const rest = places.slice(CARD_CAP);

  const klookMap = await buildKlookIndex(carded.map((p) => p.id));
  const pageUrl = `${SITE}/activities/${niche}/area/${areaSlug}`;
  const median = medianPrice(places);
  const label = info.label.toLowerCase();

  // Which other niches have a page for this same area, and which other areas
  // have a page for this same niche. These two rows are the reason the page
  // shortens crawl paths rather than just adding one more leaf.
  const siblingNiches: { slug: string; label: string; icon: string; count: number }[] = [];
  for (const n of NICHES) {
    if (n.slug === niche) continue;
    const other = await loadNicheDb(n.slug as NicheSlug);
    const count = placesInArea(area, n.slug, other.places).length;
    if (count >= AREA_MIN_VENUES) {
      siblingNiches.push({ slug: n.slug, label: n.label, icon: n.icon, count });
    }
  }
  const siblingAreas = nicheAreaCounts(niche, db.places).filter((a) => a.area.slug !== areaSlug);

  const top = places[0];
  const faqs = [
    {
      q: `What is the best ${label} in ${area.label}?`,
      a: `${top.name} ranks highest of the ${places.length} ${label} venues we track in ${area.label}, with a Trust Score of ${top.trust_score}/100${top.rating ? ` from ${top.review_count?.toLocaleString()} Google reviews averaging ${top.rating}` : ""}. Trust Score weighs rating, review volume and reviewer credibility from public Google Maps data — nothing on this page is paid placement.`,
    },
    {
      q: `How much does ${label} cost in ${area.label}?`,
      a: median
        ? `The median starting price across ${area.label} venues we have pricing for is about ฿${median.toLocaleString()}. Prices in ${area.label} run above the Bangkok average near the BTS and fall noticeably a few streets back from it.`
        : `Published prices vary widely in ${area.label} and most venues quote on enquiry. Each venue page lists a price band and links straight to the operator.`,
    },
    {
      q: `How do I get to ${label} in ${area.label}?`,
      a: `${area.transit}. Every venue listed here has its full address and a Google Maps link on its own page.`,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
      <nav className="text-sm text-[var(--muted)] mb-4 flex items-center gap-2 flex-wrap">
        <a href="/activities" className="hover:text-black">Activities</a>
        <span>›</span>
        <a href={`/activities/${niche}`} className="hover:text-black">{info.label}</a>
        <span>›</span>
        <span className="text-[var(--fg)]">{area.label}</span>
      </nav>

      <div className="mb-6">
        <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{info.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                Best {info.label} in {area.label}
              </h1>
              <p className="text-sm text-[var(--muted)] mt-1">
                {places.length} venues in Bangkok · ranked by real Google reviews
              </p>
            </div>
          </div>
          <ShareButton
            title={`Best ${info.label} in ${area.label}, Bangkok`}
            text={`${places.length} ${label} venues in ${area.label} ranked by real Google reviews — no paid picks`}
            url={pageUrl}
            kakao
            line
            whatsapp
          />
        </div>

        <p className="text-[15px] leading-relaxed text-[var(--fg)] mb-3">{area.blurb}</p>

        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">🚇 {area.transit}</span>
          {median && (
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
              Median from ฿{median.toLocaleString()}
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">✓ No paid rankings</span>
        </div>
      </div>

      <div className="mb-4 text-sm">
        <span className="text-[var(--muted)]">Want the wider selection? </span>
        <a href={`/activities/${niche}`} className="text-orange-600 font-bold hover:underline">
          See all {info.label} across Thailand →
        </a>
      </div>

      <NicheGrid
        places={carded}
        klookData={[...klookMap.entries()]}
        nicheSlug={niche}
        nicheIcon={info.icon}
        planType={info.planType}
        PRICE_BAND_LABELS={PRICE_BAND_LABELS}
      />

      {/* The tail, as plain links. Rendering all 151 Sukhumvit spas as cards
          produced a 1.6 MB page — heavier than the niche hub it is supposed to
          be a lighter entry point into. The crawl benefit of this page comes
          from the link, not from the card around it, so the tail costs ~100
          bytes a venue here instead of ~10 KB. */}
      {rest.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-black mb-3">
            All {places.length} {info.label} in {area.label}
          </h2>
          <p className="text-sm text-[var(--muted)] mb-3">
            Ranked {carded.length + 1}–{places.length} by Trust Score.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
            {rest.map((p) => (
              <li key={p.slug} className="flex items-baseline gap-2 min-w-0">
                <a
                  href={`/activities/${niche}/${encodeURIComponent(p.slug)}`}
                  className="truncate hover:text-orange-600 hover:underline"
                >
                  {p.name}
                </a>
                {p.rating ? (
                  <span className="shrink-0 text-xs text-[var(--muted)] tabular-nums">
                    ★{p.rating}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {siblingNiches.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-black mb-4">More to do in {area.label}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {siblingNiches.map((n) => (
              <a
                key={n.slug}
                href={`/activities/${n.slug}/area/${areaSlug}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-orange-400 transition-colors"
              >
                <span className="text-2xl">{n.icon}</span>
                <span className="min-w-0">
                  <span className="block font-bold text-sm truncate">{n.label}</span>
                  <span className="block text-xs text-[var(--muted)]">{n.count} in {area.label}</span>
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {siblingAreas.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-black mb-4">{info.label} in other Bangkok areas</h2>
          <div className="flex flex-wrap gap-2">
            {siblingAreas.map(({ area: a, count }) => (
              <a
                key={a.slug}
                href={`/activities/${niche}/area/${a.slug}`}
                className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm font-bold hover:border-orange-400 transition-colors"
              >
                {a.label} <span className="text-[var(--muted)] font-normal">{count}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-black mb-4">FAQ — {info.label} in {area.label}</h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q}>
              <h3 className="font-bold text-[15px] mb-1">{f.q}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <NicheItemListJsonLd
        name={`Best ${info.label} in ${area.label}, Bangkok 2026`}
        items={places.slice(0, 20).map((p) => ({
          name: p.name,
          slug: p.slug,
          niche,
          rating: p.rating,
          review_count: p.review_count,
          address: p.address,
        }))}
        url={`/activities/${niche}/area/${areaSlug}`}
      />
      <FaqJsonLd faqs={faqs} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Activities", url: "/activities" },
        { name: info.label, url: `/activities/${niche}` },
        { name: area.label, url: `/activities/${niche}/area/${areaSlug}` },
      ]} />
    </div>
  );
}
