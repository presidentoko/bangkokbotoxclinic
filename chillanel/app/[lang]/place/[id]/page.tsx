import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE } from "@/lib/site";
import { getAllPlaces, getPlaceById } from "@/lib/data";
import { TherapistMentions } from "@/components/TherapistMentions";
import { LocalBusinessJsonLd } from "@/components/JsonLd";

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
    description: found.place.address,
    alternates: { canonical: `/${lang}/place/${id}` },
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <LocalBusinessJsonLd place={place} />
      <p className="text-xs uppercase tracking-widest text-muted mb-2">{city}</p>
      <h1 className="text-3xl font-black mb-2">{place.name}</h1>
      <div className="flex items-center gap-3 text-sm mb-6">
        {place.rating != null && (
          <span className="font-semibold">
            {t.place.ratingLabel}: ★ {place.rating.toFixed(1)}
          </span>
        )}
        <span className="text-muted">
          {place.reviewCount} {t.place.reviewCountLabel}
        </span>
      </div>

      <div className="rounded-2xl border border-border bg-bg-elev p-4 mb-8 text-sm">
        <div className="text-muted mb-1">{t.place.addressLabel}</div>
        <div className="mb-3">{place.address}</div>
        {place.mapsUrl && (
          <a href={place.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-accent font-semibold">
            {t.place.viewOnMaps} →
          </a>
        )}
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">{t.place.therapistMentionsTitle}</h2>
        <TherapistMentions mentions={place.therapistMentions} lang={lang} />
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">{t.place.reviewsTitle}</h2>
        <div className="space-y-3">
          {place.reviews.slice(0, 10).map((r) => (
            <div key={r.id} className="border-b border-border pb-3">
              <div className="flex items-center gap-2 text-sm mb-1">
                <span className="font-semibold">{r.authorName || "Anonymous"}</span>
                {r.rating != null && <span>★ {r.rating}</span>}
                <span className="text-muted text-xs">{r.relativeDate}</span>
              </div>
              <p className="text-sm text-muted">{r.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
