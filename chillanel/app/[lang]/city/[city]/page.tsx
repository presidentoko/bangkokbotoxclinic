import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates, cityLabel } from "@/lib/site";
import { listCities, loadCity } from "@/lib/data";
import { isRelevantCategory } from "@/lib/categories";
import { PlaceCard } from "@/components/PlaceCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";

export function generateStaticParams() {
  return listCities().map((city) => ({ city }));
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
    title: `${t.city.listTitle.replace("{city}", label)} — ${SITE.name}`,
    description: t.city.intro.replace("{city}", label),
    alternates: {
      canonical: `/${lang}/city/${city}`,
      languages: hreflangAlternates((l) => `/${l}/city/${city}`),
    },
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
  const MAX_SHOWN = 90; // keeps the static HTML payload reasonable — a full
  // Bangkok render (734 places) was 1.6MB of HTML in one page, the same
  // class of bug already hit once in this repo's sibling `facial` project.
  const allRelevant = data.places
    .filter((p) => isRelevantCategory(p.primaryType))
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount);
  const places = allRelevant.slice(0, MAX_SHOWN);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-12">
      <Breadcrumbs items={[{ name: t.nav.home, href: `/${lang}` }, { name: label, href: `/${lang}/city/${city}` }]} />
      <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">
        {t.city.listTitle.replace("{city}", label)}
      </h1>
      <p className="text-muted mb-1">
        {allRelevant.length} {t.city.placeCount}
      </p>
      <p className="text-muted max-w-2xl leading-relaxed">{t.city.intro.replace("{city}", label)}</p>
      <p className="text-xs text-muted mt-1 mb-8">
        {allRelevant.length > places.length ? t.city.showingTop.replace("{shown}", String(places.length)) : " "}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-14">
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} lang={lang} />
        ))}
      </div>
      <Faq title={t.city.faqTitle.replace("{city}", label)} items={t.city.faq.map((f) => ({ q: f.q.replace("{city}", label), a: f.a.replace("{city}", label) }))} />
    </div>
  );
}
