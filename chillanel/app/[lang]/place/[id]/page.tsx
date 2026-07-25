import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates, cityLabel } from "@/lib/site";
import { getAllPlaces, loadCity } from "@/lib/data";
import { categoryBadgeLabel } from "@/lib/categories";
import { TherapistMentions } from "@/components/TherapistMentions";
import { LocalBusinessJsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RatingBars, hasRatingData } from "@/components/RatingBars";
import { TagCloud } from "@/components/TagCloud";
import { PlaceCard } from "@/components/PlaceCard";
import { themeLabel } from "@/lib/theme-labels";
import { placeSummary, priceMedian } from "@/lib/summary";
import { relatedPlaces } from "@/lib/related";

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
  const summary = placeSummary(found.place, lang);
  return {
    title: `${found.place.name} — ${SITE.name}`,
    description:
      summary ??
      (found.place.rating != null
        ? `${found.place.name}: ★${found.place.rating.toFixed(1)} (${found.place.reviewCount} reviews). ${found.place.address}`
        : found.place.address),
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
  const priceMedianValue = priceMedian(place.priceMentions);
  const summary = placeSummary(place, lang);
  const related = relatedPlaces(place, loadCity(city).places);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-10 sm:pt-12 pb-24 sm:pb-12">
      <LocalBusinessJsonLd place={place} description={summary} />
      <Breadcrumbs
        items={[
          { name: t.nav.home, href: `/${lang}` },
          { name: label, href: `/${lang}/city/${city}` },
          { name: place.name, href: `/${lang}/place/${place.id}` },
        ]}
      />

      <h1 className="font-display italic font-semibold text-3xl sm:text-4xl mb-3 tracking-tight">{place.name}</h1>
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

      {summary && <p className="text-muted leading-relaxed mb-6 max-w-2xl">{summary}</p>}

      <div className="rounded-2xl border border-border bg-bg-elev p-5 mb-8">
        <div className="text-xs uppercase tracking-wide text-muted mb-1">{t.place.addressLabel}</div>
        <div className="mb-4">{place.address}</div>
        {place.mapsUrl && (
          <a
            href={place.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-accent-warm text-ink font-semibold px-5 py-2.5 shadow-md shadow-accent-warm/20 hover:shadow-lg hover:shadow-accent-warm/30 hover:-translate-y-0.5 transition"
          >
            {t.place.viewOnMaps} →
          </a>
        )}
        {priceMedianValue != null && (
          <p className="text-sm text-muted mt-4 pt-4 border-t border-border">
            {t.place.priceRangeLabel.replace("{price}", priceMedianValue.toLocaleString())}
          </p>
        )}
      </div>

      {hasRatingData(place.ratingDistribution) && (
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-3">{t.place.ratingBreakdownTitle}</h2>
          <RatingBars distribution={place.ratingDistribution} />
        </section>
      )}

      <section className="mb-10">
        <h2 className="text-lg font-bold mb-3">{t.place.therapistMentionsTitle}</h2>
        <TherapistMentions mentions={place.therapistMentions} lang={lang} />
      </section>

      {place.serviceThemes.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-3">{t.place.serviceThemesTitle}</h2>
          <div className="flex flex-wrap gap-2">
            {place.serviceThemes.map((theme) => (
              <span
                key={theme.label}
                className="rounded-full border border-accent-warm/30 bg-accent-warm/10 px-3 py-1.5 text-sm text-accent-warm font-medium"
              >
                {themeLabel(theme.label, lang)} <span className="font-semibold">{theme.count}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {place.moodKeywords.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-3">{t.place.moodKeywordsTitle}</h2>
          <TagCloud items={place.moodKeywords} lang={lang} />
        </section>
      )}

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

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold mb-3">{t.place.similarPlacesTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <PlaceCard key={r.id} place={r} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {place.mapsUrl && (
        <a
          href={place.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="sm:hidden fixed bottom-4 left-4 right-4 z-20 flex items-center justify-center gap-2 rounded-full bg-accent-warm text-ink font-semibold px-5 py-3.5 shadow-xl shadow-accent-warm/30"
        >
          {t.place.viewOnMaps} →
        </a>
      )}
    </div>
  );
}
