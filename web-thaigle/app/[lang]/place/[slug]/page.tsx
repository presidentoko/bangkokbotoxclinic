import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  getPlace,
  getAllPlaceSlugs,
  CATEGORY_SCHEMA,
  PRICE_TIER_LABEL,
  CATEGORY_LABEL,
} from "@/lib/places";
import type { Lang, Place } from "@/lib/places";
import { AddToPlanButton } from "@/components/AddToPlanButton";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const dynamic = "force-static";
export const revalidate = 86400;
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com";

export function generateStaticParams() {
  return getAllPlaceSlugs().map(({ lang, slug }) => ({ lang, slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const place = getPlace(slug, lang as Lang);
  if (!place) return {};

  const t = place.i18n[lang as Lang] ?? place.i18n["en"];
  const desc = t.receipt.dataSays.slice(0, 140);
  const canonical = `/${lang}/place/${slug}`;

  return {
    title: `${t.name} — ${place.subtype} · ${place.area} | Thaigle`,
    description: desc,
    alternates: {
      canonical,
      languages: {
        th: `/th/place/${slug}`,
        en: `/en/place/${slug}`,
        ko: `/ko/place/${slug}`,
        "x-default": `/th/place/${slug}`,
      },
    },
    openGraph: {
      title: `${t.name} · ${place.subtype} · ${place.area}`,
      description: desc,
      images: place.hero.src.startsWith("/") ? [`${SITE}${place.hero.src}`] : [],
    },
  };
}

function PlaceSchemaLd({ place, lang }: { place: Place; lang: Lang }) {
  const t = place.i18n[lang] ?? place.i18n["en"];
  const schemaType = CATEGORY_SCHEMA[place.category];
  const ratingValue = (place.localsScore / 20).toFixed(1);

  const schema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: t.name,
    image: place.hero.src.startsWith("/") ? `${SITE}${place.hero.src}` : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: place.area,
      addressCountry: "TH",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: place.lat,
      longitude: place.lng,
    },
    priceRange: PRICE_TIER_LABEL[place.priceTier],
    url: `${SITE}/${lang}/place/${place.slug}`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      ratingCount: place.sources.reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: lang === "th"
          ? `${t.name} ดีจริงไหม?`
          : lang === "ko"
          ? `${t.name} 갈 만한가요?`
          : `Is ${t.name} worth visiting?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.receipt.dataSays,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

export default async function PlacePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const place = getPlace(slug, lang as Lang);
  if (!place) notFound();

  const t = place.i18n[lang as Lang] ?? place.i18n["en"];
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;

  return (
    <article className="max-w-2xl mx-auto pb-20 md:pb-0">
      {/* 1. HERO — LCP target, self-hosted only */}
      <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
        <Image
          src={place.hero.src}
          alt={place.hero.alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 672px"
        />
        {/* Category chip — top left */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-bold backdrop-blur-sm">
            {CATEGORY_LABEL[place.category]} · {place.subtype}
          </span>
        </div>
      </div>

      <div className="px-4 py-5">
        {/* 2. HEADER ROW */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0">
            <h1 className="text-xl font-black tracking-tight leading-tight mb-0.5">{t.name}</h1>
            <p className="text-xs text-[var(--muted)]">{place.area}</p>
          </div>
          <div className="text-right shrink-0">
            <div
              className="text-[26px] font-black leading-none tabular-nums"
              style={{ color: "var(--score)" }}
            >
              {Math.round(place.localsScore)}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mt-0.5">
              Locals Score
            </div>
          </div>
        </div>

        {/* 3. BADGE ROW */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {place.verifiedOpen && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: "var(--receipt-data-bg)", color: "var(--score)" }}
            >
              ✓ Open
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
            {PRICE_TIER_LABEL[place.priceTier]}
          </span>
          {place.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
              {tag}
            </span>
          ))}
        </div>

        {/* 4. THE RECEIPT */}
        <section className="mb-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">The Receipt</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          {/* FEED SAYS */}
          {t.receipt.feedSays && (
            <div
              className="rounded-xl p-4 mb-3"
              style={{ background: "var(--receipt-feed-bg)", color: "var(--receipt-feed-text)" }}
            >
              <div className="text-[10px] font-black uppercase tracking-widest mb-1.5 opacity-70">
                Feed says
              </div>
              <p className="text-sm leading-relaxed italic">&ldquo;{t.receipt.feedSays}&rdquo;</p>
            </div>
          )}

          {/* DATA SAYS */}
          <div
            className="rounded-xl p-4"
            style={{ background: "var(--receipt-data-bg)", color: "var(--receipt-data-text)" }}
          >
            <div className="text-[10px] font-black uppercase tracking-widest mb-1.5 opacity-70">
              Data says
            </div>
            <p className="text-sm leading-relaxed font-medium">{t.receipt.dataSays}</p>
          </div>
        </section>

        {/* 5. SOURCE TRANSPARENCY */}
        <section className="mb-5 border border-[var(--border)] rounded-xl p-4">
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="text-center">
              <div className="text-lg font-black tabular-nums">{place.sources.reviewCount.toLocaleString()}</div>
              <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider">Reviews</div>
            </div>
            <div className="text-center border-x border-[var(--border)]">
              <div className="text-lg font-black tabular-nums">{place.sources.sourceCount}</div>
              <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider">Sources</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-black tabular-nums">{place.sources.updatedDaysAgo}d</div>
              <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider">Updated</div>
            </div>
          </div>
          <p className="text-xs text-[var(--muted)] text-center">
            {place.sources.sourceNames.join(" · ")} — influencer/sponsored posts excluded
          </p>
        </section>

        {/* 6. CTA ROW */}
        <div className="flex items-center gap-3 flex-wrap">
          <AddToPlanButton
            item={{
              slug: place.slug,
              category: place.category,
              name: t.name,
              lat: place.lat,
              lng: place.lng,
              localsScore: place.localsScore,
              dataSays: t.receipt.dataSays,
            }}
          />
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-[var(--border)] text-sm font-medium hover:border-gray-400 transition"
          >
            <span>🗺</span>
            <span>Map</span>
          </a>
        </div>
      </div>

      {/* JSON-LD */}
      <PlaceSchemaLd place={place} lang={lang as Lang} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Places", url: "/en/place" },
        { name: t.name, url: `/${lang}/place/${slug}` },
      ]} />
    </article>
  );
}
