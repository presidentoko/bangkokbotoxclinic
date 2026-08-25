import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadNicheDb, qualifyingNichePlaces, buildKlookIndex, nicheInfo } from "@/lib/niches";
import { NicheGrid } from "@/components/NicheGrid";
import { toGridPlace, toGridKlook } from "@/lib/gridPlace";
import { NicheItemListJsonLd, FaqJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import { ShareButton } from "@/components/ShareButton";

export const dynamic = "force-static";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

/**
 * "boutique spa bangkok" (596 impressions) + "boutique spa and wellness
 * bangkok" (232) pulled 828 impressions and 0 clicks over three months with
 * no page to land on — /activities/spa is the Thailand-wide hub, which
 * doesn't match "boutique" intent and sits too far down to rank for it
 * anyway. This is the page that query deserves.
 *
 * "Boutique" here is a data filter, not a curator's pick: independently
 * sized (50-600 reviews — enough to trust, too few to be a hotel chain
 * spa) and exceptionally rated (4.7+). The threshold is stated on the page
 * itself, which is also what lets it survive scrutiny as non-paid ranking.
 */
const MIN_RATING = 4.7;
const MIN_REVIEWS = 50;
const MAX_REVIEWS = 600;
const CARD_CAP = 60;

const PRICE_BAND_LABELS: Record<string, string> = {
  budget: "฿",
  mid: "฿฿",
  premium: "฿฿฿",
  luxury: "฿฿฿฿",
};

export const metadata: Metadata = {
  title: "Best Boutique Spas in Bangkok 2026 — Small, Independent, 4.7★+",
  description:
    "Independent Bangkok spas rated 4.7 stars or higher, sized 50-600 reviews — small enough to not be a hotel chain, proven enough to trust. Ranked by real Google reviews, no paid placements.",
  alternates: { canonical: "/activities/spa/boutique" },
  openGraph: {
    title: "Best Boutique Spas in Bangkok",
    description: "Independent, 4.7★+ Bangkok spas ranked by real Google reviews.",
  },
};

function medianPrice(places: { price_min_thb: number }[]): number | null {
  const p = places.map((x) => x.price_min_thb).filter((n) => n > 0).sort((a, b) => a - b);
  return p.length >= 5 ? p[Math.floor(p.length / 2)] : null;
}

export default async function BoutiqueSpaPage() {
  const info = nicheInfo("spa");
  const db = await loadNicheDb("spa");
  const places = qualifyingNichePlaces("spa", db.places).filter(
    (p) =>
      p.city === "Bangkok" &&
      !!p.rating &&
      p.rating >= MIN_RATING &&
      !!p.review_count &&
      p.review_count >= MIN_REVIEWS &&
      p.review_count <= MAX_REVIEWS,
  );
  if (places.length < 20) notFound();

  const carded = places.slice(0, CARD_CAP);
  const rest = places.slice(CARD_CAP);
  const klookMap = await buildKlookIndex(carded.map((p) => p.id));
  const pageUrl = `${SITE}/activities/spa/boutique`;
  const median = medianPrice(places);
  const top = places[0];

  const faqs = [
    {
      q: "What makes a spa \"boutique\" on Thaigle?",
      a: `We define boutique as independently sized and exceptionally rated: ${MIN_RATING}★ or higher on Google, with between ${MIN_REVIEWS} and ${MAX_REVIEWS} reviews. Below ${MIN_REVIEWS} isn't proven yet; above ${MAX_REVIEWS} usually means a hotel spa or a large chain — still good, just not what "boutique" means. ${places.length} Bangkok spas currently clear that bar.`,
    },
    {
      q: "What is the best boutique spa in Bangkok?",
      a: `${top.name} ranks highest of the ${places.length} boutique spas we track, with a Trust Score of ${top.trust_score}/100 from ${top.review_count?.toLocaleString()} Google reviews averaging ${top.rating}★. Trust Score weighs rating, review volume and reviewer credibility — nothing on this page is paid placement.`,
    },
    {
      q: "How much do boutique spas cost in Bangkok?",
      a: median
        ? `The median starting price across these spas is about ฿${median.toLocaleString()}. Independent spas price close to hotel spas at the top end and well below them at the low end — the gap is usually the building, not the massage.`
        : `Published prices vary and most independent spas quote on enquiry. Each spa's page links straight to the operator.`,
    },
    {
      q: "Boutique spa vs hotel spa — what's the actual difference?",
      a: "Hotel spas charge for the lobby, the robe and the pool you can use before your treatment. Independent boutique spas put more of the price into the therapist and less into the building — reviewers consistently rate the massage itself higher at boutique spas even where the room is plainer.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
      <nav className="text-sm text-[var(--muted)] mb-4 flex items-center gap-2 flex-wrap">
        <a href="/activities" className="hover:text-black">Activities</a>
        <span>›</span>
        <a href="/activities/spa" className="hover:text-black">{info.label}</a>
        <span>›</span>
        <span className="text-[var(--fg)]">Boutique</span>
      </nav>

      <div className="mb-6">
        <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="text-4xl">💆</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight text-balance">
                Best Boutique Spas in Bangkok
              </h1>
              <p className="text-sm text-[var(--muted)] mt-1">
                {places.length} independent spas · {MIN_RATING}★+ · ranked by real Google reviews
              </p>
            </div>
          </div>
          <ShareButton
            title="Best Boutique Spas in Bangkok"
            text={`${places.length} independent, ${MIN_RATING}★+ Bangkok spas ranked by real Google reviews — no paid picks`}
            url={pageUrl}
            kakao
            line
            whatsapp
          />
        </div>

        <p className="text-[15px] leading-relaxed text-[var(--fg)] mb-3">
          Small, independently run, and rated higher than the hotel spas twice their size. Every
          spa here clears {MIN_RATING}★ on Google with {MIN_REVIEWS}–{MAX_REVIEWS} reviews — proven,
          but not a chain.
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
            ★ {MIN_RATING}+ on Google
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold">
            {MIN_REVIEWS}–{MAX_REVIEWS} reviews
          </span>
          {median && (
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
              Median from ฿{median.toLocaleString()}
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">
            ✓ No paid rankings
          </span>
        </div>
      </div>

      <div className="mb-4 text-sm flex flex-wrap gap-x-4 gap-y-1">
        <span className="text-[var(--muted)]">Want a specific area? </span>
        <a href="/activities/spa" className="text-orange-600 font-bold hover:underline">
          See all {info.label} across Thailand →
        </a>
        <a href="/activities/wellness" className="text-orange-600 font-bold hover:underline">
          Browse Wellness centers →
        </a>
      </div>

      <NicheGrid
        places={carded.map(toGridPlace)}
        klookData={toGridKlook([...klookMap.entries()])}
        nicheSlug="spa"
        nicheIcon={info.icon}
        planType={info.planType}
        PRICE_BAND_LABELS={PRICE_BAND_LABELS}
      />

      {rest.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-black mb-3">All {places.length} Boutique Spas in Bangkok</h2>
          <p className="text-sm text-[var(--muted)] mb-3">
            Ranked {carded.length + 1}–{places.length} by Trust Score.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
            {rest.map((p) => (
              <li key={p.slug} className="flex items-baseline gap-2 min-w-0">
                <a
                  href={`/activities/spa/${encodeURIComponent(p.slug)}`}
                  className="truncate hover:text-orange-600 hover:underline"
                >
                  {p.name}
                </a>
                {p.rating ? (
                  <span className="shrink-0 text-xs text-[var(--muted)] tabular-nums">★{p.rating}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-black mb-4">FAQ — Boutique Spas in Bangkok</h2>
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
        name="Best Boutique Spas in Bangkok 2026"
        items={places.slice(0, 20).map((p) => ({
          name: p.name,
          slug: p.slug,
          niche: "spa",
          rating: p.rating,
          review_count: p.review_count,
          address: p.address,
          city: p.city,
        }))}
        url="/activities/spa/boutique"
      />
      <FaqJsonLd faqs={faqs} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Activities", url: "/activities" },
        { name: info.label, url: "/activities/spa" },
        { name: "Boutique", url: "/activities/spa/boutique" },
      ]} />
    </div>
  );
}
