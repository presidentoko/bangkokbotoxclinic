import { notFound } from "next/navigation";
import { GUIDES, findGuide } from "@/lib/guides";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { AffiliateInline } from "@/components/AffiliateSlot";
import { AdSlot } from "@/components/AdSlot";
import { loadMasterDb, topByTrust } from "@/lib/data";
import { getSlugMap } from "@/lib/restaurants";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CardImage } from "@/components/CardImage";
import { loadNicheDb, qualifyingNichePlaces, buildKlookIndex, NICHES } from "@/lib/niches";
import type { NicheSlug } from "@/lib/niches";
import { ShareButton } from "@/components/ShareButton";
import { VersusVote } from "@/components/VersusVote";
import { BangkokTip } from "@/components/BangkokTip";
import { BangkokChallenge } from "@/components/BangkokChallenge";
import { DontMiss } from "@/components/DontMiss";
import { NearbyThings } from "@/components/NearbyThings";
import { SeasonalTip } from "@/components/SeasonalTip";
import { ThaiWordOfDay } from "@/components/ThaiWordOfDay";
import { InstagramSpots } from "@/components/InstagramSpots";
import { BangkokDessertGuide } from "@/components/BangkokDessertGuide";
import { BangkokCraftBeer } from "@/components/BangkokCraftBeer";
import { BangkokVintageShops } from "@/components/BangkokVintageShops";
import { BangkokKlongTour } from "@/components/BangkokKlongTour";
import { BangkokCabaret } from "@/components/BangkokCabaret";
import { BangkokCraftsWorkshops } from "@/components/BangkokCraftsWorkshops";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export const dynamicParams = false;

export async function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const g = findGuide(slug);
  if (!g) return { title: "Guide not found" };
  return {
    title: g.metaTitle,
    description: g.metaDescription,
    alternates: { canonical: `/guide/${slug}` },
    openGraph: {
      type: "article",
      title: g.title,
      description: g.metaDescription,
      publishedTime: g.updated,
      modifiedTime: g.updated,
    },
  };
}

export default async function GuidePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const g = findGuide(slug);
  if (!g) notFound();

  const [db, slugMap] = await Promise.all([loadMasterDb(), getSlugMap()]);
  const featured = topByTrust(db.restaurants, 6);
  const related = (g.related ?? []).map((s) => findGuide(s)).filter(Boolean);

  // Load niche places if this guide is linked to an activity niche
  const nicheInfo = g.nicheSlug ? NICHES.find(n => n.slug === g.nicheSlug) : null;
  // Scoped to Bangkok before the slice. The heading below reads "Top-rated X
  // in Bangkok" while qualifyingNichePlaces ranks nationwide, so
  // /guide/best-yoga-studios-bangkok listed Hat Yai, Krabi, Chiang Mai, Krabi
  // and Phuket — five venues, none of them in Bangkok, under a heading
  // promising Bangkok.
  const nichePlaces = g.nicheSlug
    ? await loadNicheDb(g.nicheSlug as NicheSlug).then((db) =>
        qualifyingNichePlaces(g.nicheSlug as string, db.places)
          .filter((p) => p.city === "Bangkok")
          .slice(0, 5),
      )
    : [];
  const nicheKlook = nichePlaces.length > 0 ? await buildKlookIndex(nichePlaces.map(p => p.id)) : new Map();

  const brand = process.env.NEXT_PUBLIC_BRAND || "Thaigle";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.metaDescription,
    datePublished: g.updated,
    dateModified: g.updated,
    image: `${SITE}/opengraph-image`,
    publisher: {
      "@type": "Organization",
      name: brand,
      url: SITE,
      logo: { "@type": "ImageObject", url: `${SITE}/icon`, width: 512, height: 512 },
    },
    author: { "@type": "Organization", name: `${brand} Editorial`, url: SITE },
    mainEntityOfPage: `${SITE}/guide/${g.slug}`,
    about: {
      "@type": "Thing",
      name: "Bangkok Activities and Restaurants",
      description: "Activities, restaurants, and experiences in Bangkok, Thailand",
    },
  };

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href="/guide" className="hover:text-[var(--fg)]">Guides</a>
        <span className="mx-2">›</span>
        <span>{g.title.replace(/ \(\d{4}\)$/, "")}</span>
      </nav>

      <header className="mb-8">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
            {g.title}
          </h1>
          <ShareButton
            title={g.metaTitle}
            text={g.metaDescription}
            url={`${SITE}/guide/${g.slug}`}
            whatsapp
            line
            facebook
          />
        </div>
        <p className="text-base text-[var(--muted)] leading-relaxed">{g.intro}</p>
        <p className="text-xs text-[var(--muted)] mt-3 italic">
          Updated {g.updated} · Editorial · Independent of any restaurant
        </p>
      </header>

      <AdSlot name="articleMid" />

      <div className="prose prose-sm max-w-none mt-8 space-y-8">
        {g.sections.map((s, i) => (
          <section key={i}>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-3 mt-2">{s.heading}</h2>
            <p className="text-base leading-relaxed text-[var(--fg)] whitespace-pre-line">{s.body}</p>
          </section>
        ))}
      </div>

      <AffiliateInline />

      {g.faqs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Frequently asked</h2>
          <div className="space-y-3">
            {g.faqs.map((f, i) => (
              <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4 group">
                <summary className="font-medium cursor-pointer flex items-center justify-between gap-3">
                  <span>{f.q}</span>
                  <span className="text-[var(--muted)] group-open:rotate-180 transition">⌄</span>
                </summary>
                <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed whitespace-pre-line">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Show niche places for activity guides, restaurants otherwise */}
      {nicheInfo && nichePlaces.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-2">
            Top-rated {nicheInfo.label} in Bangkok
          </h2>
          <p className="text-sm text-[var(--muted)] mb-4">
            Ranked by Trust Score from real Google reviews.
          </p>
          <div className="space-y-3">
            {nichePlaces.map((p, i) => {
              const klook = nicheKlook.get(p.id);
              return (
                <a
                  key={p.id}
                  href={`/activities/${g.nicheSlug}/${p.slug}`}
                  className="group flex items-center gap-4 bg-white border border-[var(--border)] rounded-xl p-4 hover:border-orange-300 hover:shadow-md transition"
                >
                  {p.top_photo_url && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <CardImage
                        src={p.top_photo_url}
                        alt={p.name}
                        className="w-16 h-16 object-cover"
                        fallbackIcon={NICHES.find((n) => n.slug === g.nicheSlug)?.icon ?? "📷"}
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-black text-[var(--muted)] tabular-nums">#{i + 1}</span>
                      <span
                        className="text-xs font-black px-1.5 py-0.5 rounded-full text-white"
                        style={{ background: p.trust_score >= 75 ? "#16a34a" : p.trust_score >= 60 ? "#059669" : "#ca8a04" }}
                      >
                        {p.trust_score}
                      </span>
                    </div>
                    <div className="font-bold text-sm group-hover:text-orange-600 transition truncate">{p.name}</div>
                    <div className="text-xs text-[var(--muted)] truncate">{p.address ? p.address.split(",").slice(-3, -1).join(",").trim() : p.city}</div>
                    {p.rating && <div className="text-xs text-yellow-700 font-bold mt-0.5">★{p.rating.toFixed(1)} · {(p.review_count ?? 0).toLocaleString()} reviews</div>}
                  </div>
                  {klook?.products?.[0] && (
                    <span className="shrink-0 text-xs bg-orange-500 text-white px-3 py-1.5 rounded-full font-bold">
                      Book →
                    </span>
                  )}
                </a>
              );
            })}
          </div>
          <a
            href={`/activities/${g.nicheSlug}`}
            className="mt-4 block text-center text-sm font-bold text-orange-600 hover:underline"
          >
            See all {nicheInfo.label} →
          </a>
        </section>
      ) : featured.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">Top-rated restaurants right now</h2>
          <p className="text-sm text-[var(--muted)] mb-4">
            Highest Trust Score restaurants — based on real Google review analysis.
          </p>
          <div className="grid gap-3">
            {featured.slice(0, 3).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 1} slugMap={slugMap} />
            ))}
          </div>
        </section>
      ) : null}

      {related.length > 0 && (
        <section className="mt-12 border-t border-[var(--border)] pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-4">
            Related guides
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {related.map((r) => r && (
              <a
                key={r.slug}
                href={`/guide/${r.slug}`}
                className="block p-4 border border-[var(--border)] rounded-xl bg-white hover:border-[var(--accent)] transition"
              >
                <div className="font-medium leading-tight">{r.title.replace(/ — .*$/, "")}</div>
                <p className="text-xs text-[var(--muted)] mt-1">{r.metaDescription.slice(0, 100)}…</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <DontMiss />
      <SeasonalTip />
      <ThaiWordOfDay />
      <InstagramSpots />
      <NearbyThings context="general" />
      <BangkokDessertGuide />
      <BangkokCraftBeer />
      <BangkokVintageShops />
      <BangkokKlongTour />
      <BangkokCabaret />
      <BangkokCraftsWorkshops />

      {/* Daily Challenge */}
      <BangkokChallenge />

      {/* Daily Tip */}
      <BangkokTip />

      {/* Poll */}
      <div className="mt-4">
        <VersusVote
          question="When you're visiting Bangkok — how do you plan?"
          a={{ id: "research-data", label: "Research with data", emoji: "📊", desc: "Trust Score, reviews, rankings — let the numbers guide you", url: "/trending" }}
          b={{ id: "go-with-flow", label: "Explore & discover", emoji: "🗺️", desc: "Wander the streets, follow your nose — no plan, no regrets", url: "/activities" }}
        />
      </div>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Guides", url: "/guide" },
        { name: g.title, url: `/guide/${g.slug}` },
      ]} />
      <FaqJsonLd faqs={g.faqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </article>
  );
}
