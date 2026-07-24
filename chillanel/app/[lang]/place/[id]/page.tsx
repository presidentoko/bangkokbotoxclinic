import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates, cityLabel } from "@/lib/site";
import { getAllPlaces } from "@/lib/data";
import { categoryBadgeLabel } from "@/lib/categories";
import { TherapistMentions } from "@/components/TherapistMentions";
import { LocalBusinessJsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export function generateStaticParams() {
  return getAllPlaces().map(({ place }) => ({ id: place.id }));
}
export const dynamicParams = false;

function findPlace(id: string) {
  return getAllPlaces().find(({ place }) => place.id === id) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isLang(lang)) return {};
  const found = findPlace(id);
  if (!found) return {};
  return {
    title: `${found.place.name} — ${SITE.name}`,
    description:
      found.place.rating != null
        ? `${found.place.name}: ★${found.place.rating.toFixed(1)} (${found.place.reviewCount} reviews). ${found.place.address}`
        : found.place.address,
    alternates: {
      canonical: `/${lang}/place/${id}`,
      languages: hreflangAlternates((l) => `/${l}/place/${id}`),
    },
  };
}

export default async function PlacePage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!isLang(lang)) notFound();
  const found = findPlace(id);
  if (!found) notFound();
  const { city, place } = found;
  const t = tFor(lang);
  const label = cityLabel(city);
  const badge = categoryBadgeLabel(place.primaryType, lang);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-10 sm:pt-12 pb-24 sm:pb-12">
      <LocalBusinessJsonLd place={place} />
      <Breadcrumbs
        items={[
          { name: t.nav.home, href: `/${lang}` },
          { name: label, href: `/${lang}/city/${city}` },
          { name: place.name, href: `/${lang}/place/${place.id}` },
        ]}
      />

      <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">{place.name}</h1>
      <div className="flex items-center flex-wrap gap-2 text-sm mb-6">
        {place.rating != null && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 text-accent font-bold px-3 py-1">
            <span aria-hidden="true">★</span> {place.rating.toFixed(1)}
          </span>
        )}
        <span className="text-muted">
          {place.reviewCount} {t.place.reviewCountLabel}
        </span>
        {badge && (
          <span className="rounded-full border border-border px-3 py-1 text-muted font-medium">{badge}</span>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-bg-elev p-5 mb-8">
        <div className="text-xs uppercase tracking-wide text-muted mb-1">{t.place.addressLabel}</div>
        <div className="mb-4">{place.address}</div>
        {place.mapsUrl && (
          <a
            href={place.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent text-white font-semibold px-5 py-2.5 hover:opacity-90 transition"
          >
            {t.place.viewOnMaps} →
          </a>
        )}
      </div>

      <section className="mb-10">
        <h2 className="text-lg font-bold mb-3">{t.place.therapistMentionsTitle}</h2>
        <TherapistMentions mentions={place.therapistMentions} lang={lang} />
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">{t.place.reviewsTitle}</h2>
        <div className="space-y-4">
          {place.reviews.slice(0, 10).map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-bg-elev p-4">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-accent/15 text-accent text-xs font-bold shrink-0">
                  {(r.authorName || t.place.anonymousReviewer).charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-sm">{r.authorName || t.place.anonymousReviewer}</span>
                {r.rating != null && <span className="text-xs text-accent font-bold">★ {r.rating}</span>}
                <span className="text-muted text-xs">{r.relativeDate}</span>
              </div>
              <p className="text-sm text-muted leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {place.mapsUrl && (
        <a
          href={place.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="sm:hidden fixed bottom-4 left-4 right-4 z-20 flex items-center justify-center gap-2 rounded-full bg-accent text-white font-semibold px-5 py-3.5 shadow-lg"
        >
          {t.place.viewOnMaps} →
        </a>
      )}
    </div>
  );
}
