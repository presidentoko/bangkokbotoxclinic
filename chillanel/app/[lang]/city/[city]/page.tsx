import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE } from "@/lib/site";
import { listCities, loadCity } from "@/lib/data";
import { PlaceCard } from "@/components/PlaceCard";

export function generateStaticParams() {
  return listCities().map((city) => ({ city }));
}

function cityLabel(city: string): string {
  return city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, " ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; city: string }>;
}): Promise<Metadata> {
  const { lang, city } = await params;
  if (!isLang(lang)) return {};
  const t = tFor(lang);
  const label = cityLabel(city);
  return {
    title: `${t.city.listTitle} ${label} — ${SITE.name}`,
    alternates: { canonical: `/${lang}/city/${city}` },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ lang: string; city: string }>;
}) {
  const { lang, city } = await params;
  if (!isLang(lang)) notFound();
  const data = loadCity(city);
  if (data.places.length === 0) notFound();
  const t = tFor(lang);
  const label = cityLabel(city);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-1">
        {t.city.listTitle} {label}
      </h1>
      <p className="text-muted mb-8">
        {data.places.length} {t.city.placeCount}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data.places.map((place) => (
          <PlaceCard key={place.id} place={place} lang={lang} />
        ))}
      </div>
    </div>
  );
}
