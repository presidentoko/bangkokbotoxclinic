import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShareButton } from "@/components/ShareButton";
import {
  NICHES,
  loadNicheDb,
  topNichePlaces,
  buildKlookIndex,
  cityScopeLabel,
} from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";
import { BreadcrumbJsonLd, FaqJsonLd, NicheItemListJsonLd } from "@/components/JsonLd";
import { NICHE_FAQS, NICHE_INTRO } from "@/lib/niche-content";
import { VersusVote } from "@/components/VersusVote";
import { BangkokTip } from "@/components/BangkokTip";
import { BangkokChallenge } from "@/components/BangkokChallenge";
import { RatingLegend } from "@/components/RatingLegend";
import { PhotoHints } from "@/components/PhotoHints";
import { CardImage } from "@/components/CardImage";
import { withKlookAid } from "@/lib/affiliate";

export const dynamic = "force-static";
export const dynamicParams = false;
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export function generateStaticParams() {
  return NICHES.map((n) => ({ niche: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ niche: string }>;
}): Promise<Metadata> {
  const { niche } = await params;
  const info = NICHES.find((n) => n.slug === niche);
  if (!info) return {};
  const db = await loadNicheDb(niche as NicheSlug);
  const top = topNichePlaces(db.places, 10);
  const scope = cityScopeLabel(top);
  return {
    title: `Top 10 ${info.label} in ${scope} (2026) — Ranked by Real Reviews`,
    description: `The 10 best ${info.label.toLowerCase()} in ${scope}, ranked by Trust Score from real Google reviews. No paid placements. Prices, tips, and Klook booking.`,
    alternates: {
      canonical: `/activities/${niche}/top-10`,
    },
    openGraph: {
      title: `Top 10 ${info.label} ${scope} 2026`,
      description: `Ranked by ${top.length > 0 ? `${top[0].review_count?.toLocaleString() ?? "thousands of"} Google` : "real"} reviews. Trust Score method, no paid rankings.`,
    },
  };
}

const TRUST_COLOR = (score: number) =>
  score >= 80 ? "#15803d" : score >= 70 ? "#16a34a" : score >= 60 ? "#059669" : "#ca8a04";

export default async function NicheTop10Page({
  params,
}: {
  params: Promise<{ niche: string }>;
}) {
  const { niche } = await params;
  const info = NICHES.find((n) => n.slug === niche);
  if (!info) notFound();

  const db = await loadNicheDb(niche as NicheSlug);
  const top10 = topNichePlaces(db.places, 10);
  const scope = cityScopeLabel(top10);
  const klookMap = await buildKlookIndex(top10.map((p) => p.id));

  const intro = NICHE_INTRO[niche as NicheSlug];
  const faqs = NICHE_FAQS[niche as NicheSlug] ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--muted)] mb-5 flex flex-wrap items-center gap-1.5">
        <a href="/" className="hover:text-black">Home</a>
        <span>›</span>
        <a href="/activities" className="hover:text-black">Activities</a>
        <span>›</span>
        <a href={`/activities/${niche}`} className="hover:text-black">{info.label}</a>
        <span>›</span>
        <span>Top 10</span>
      </nav>

      {/* Header */}
      <div className="mb-2">
        <span className="text-3xl mr-2">{info.icon}</span>
        <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-3">
          Ranked by Trust Score · 2026
        </span>
      </div>
      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-balance">
          Top 10 {info.label} in {scope}
        </h1>
        <ShareButton
          title={`Top 10 ${info.label} in ${scope} 2026`}
          text={`Best ${info.label} in ${scope} — ranked by real Google reviews. No sponsored results.`}
          url={`https://thaigle.com/activities/${niche}/top-10`}
          line whatsapp
        />
      </div>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-2">
        {intro?.sub ?? `${db.total} venues ranked by real Google reviews.`}
      </p>
      <p className="text-sm text-[var(--muted)] mb-8">
        Updated 2026 · Trust Score ranks by review volume, rating, and reviewer authority — no paid placements.
      </p>

      {/* Top 10 article list */}
      <section className="mb-10">
        <ol className="space-y-8">
          {top10.map((place, i) => {
            const klook = klookMap.get(place.id);
            const topProduct = klook?.products?.[0];
            const langs = place.languages
              ? Object.entries(place.languages)
                  .filter(([, v]) => v)
                  .map(([k]) => k.toUpperCase())
              : [];

            return (
              <li key={place.id}>
                {/* Rank + name header */}
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-black text-lg shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-black leading-tight mb-0.5">
                      <a href={`/activities/${niche}/${place.slug}`} className="hover:text-orange-600 transition">
                        {place.name}
                      </a>
                    </h2>
                    <p className="text-sm text-[var(--muted)]">
                      {place.address?.split(",").slice(-3, -1).join(",").trim() || place.city}
                    </p>
                  </div>
                </div>

                {/* Photo + details card */}
                <div className="border border-[var(--border)] rounded-2xl overflow-hidden bg-white ml-14">
                  {place.top_photo_url && (
                    <div className="h-48 overflow-hidden bg-gray-100">
                      <CardImage
                        src={place.top_photo_url}
                        alt={`${place.name} — #${i + 1} ${info.label} ${place.city}`}
                        className="w-full h-full object-cover"
                        fallbackIcon={info.icon}
                      />
                    </div>
                  )}

                  <div className="p-5">
                    {/* Stats row */}
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span
                        className="text-lg font-black px-2 py-0.5 rounded-lg text-white"
                        style={{ background: TRUST_COLOR(place.trust_score) }}
                      >
                        Trust {place.trust_score}
                      </span>
                      {place.rating && (
                        <span className="text-yellow-700 font-bold">★{place.rating.toFixed(1)}</span>
                      )}
                      {place.review_count && (
                        <span className="text-sm text-[var(--muted)]">({place.review_count.toLocaleString()} reviews)</span>
                      )}
                      {place.price_min_thb > 0 && (
                        <span className="text-sm font-bold text-green-700">From ฿{place.price_min_thb.toLocaleString()}</span>
                      )}
                    </div>

                    {/* Feature badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {place.is_beginner_friendly && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-bold">Beginner OK</span>
                      )}
                      {place.is_open_24h && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">Open 24h</span>
                      )}
                      {langs.map((l) => (
                        <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">{l}</span>
                      ))}
                    </div>

                    {/* Review snippet */}
                    {place.top_review_text && (
                      <blockquote className="text-sm text-[var(--muted)] italic leading-relaxed border-l-2 border-orange-300 pl-3 mb-4">
                        &ldquo;{place.top_review_text.slice(0, 200)}{place.top_review_text.length > 200 ? "…" : ""}&rdquo;
                      </blockquote>
                    )}

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-2">
                      {topProduct && (
                        <a
                          href={withKlookAid(topProduct.product_url)}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition"
                        >
                          Book on Klook
                          {topProduct.price_thb != null && ` · ฿${topProduct.price_thb.toLocaleString()}`}
                        </a>
                      )}
                      <a
                        href={`/activities/${niche}/${place.slug}`}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-[var(--border)] text-sm font-medium hover:border-orange-400 hover:text-orange-700 transition"
                      >
                        Full details →
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* FAQ section */}
      {faqs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-black mb-4">FAQ — {info.label} in {scope}</h2>
          <div className="space-y-3">
            {faqs.slice(0, 3).map((f, i) => (
              <details key={i} className="bg-white border border-[var(--border)] rounded-xl p-4 group">
                <summary className="font-semibold cursor-pointer flex items-center justify-between gap-3 text-sm">
                  <span>{f.q}</span>
                  <span className="text-[var(--muted)] group-open:rotate-180 transition shrink-0">⌄</span>
                </summary>
                <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <RatingLegend />
      <PhotoHints niche={niche} />

      {/* Daily Challenge */}
      <BangkokChallenge />

      {/* Daily Tip */}
      <BangkokTip />

      {/* Quick Poll */}
      <div className="mb-4">
        <VersusVote
          question={`${info.label} in Bangkok — what matters most to you?`}
          a={{ id: "reviews-data", label: "Real reviews + Trust Score", emoji: "📊", desc: "Data-driven — ranked by what verified reviewers actually say", url: `/activities/${niche}` }}
          b={{ id: "price-value", label: "Best value for money", emoji: "💸", desc: "Maximum experience at minimum cost — Bangkok specialty", url: "/activities/budget" }}
        />
      </div>

      {/* See all CTA */}
      <section className="p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="font-black">See all {db.total} venues</div>
          <div className="text-sm text-[var(--muted)]">Filter by price, language, Klook availability, and more</div>
        </div>
        <a
          href={`/activities/${niche}`}
          className="px-4 py-2.5 rounded-full bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition"
        >
          Browse {info.label} →
        </a>
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Activities", url: "/activities" },
        { name: info.label, url: `/activities/${niche}` },
        { name: `Top 10 ${info.label}`, url: `/activities/${niche}/top-10` },
      ]} />
      {faqs.length > 0 && <FaqJsonLd faqs={faqs.slice(0, 3)} />}
      <NicheItemListJsonLd
        name={`Top 10 ${info.label} in ${scope}`}
        items={top10.map((p, i) => ({
          name: p.name,
          slug: p.slug,
          niche: niche,
          rating: p.rating,
          review_count: p.review_count,
          address: p.address,
        }))}
        url={`/activities/${niche}/top-10`}
      />
    </div>
  );
}
