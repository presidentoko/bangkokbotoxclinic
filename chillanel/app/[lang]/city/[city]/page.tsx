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
    <div>
      <section className="relative overflow-hidden bg-ink text-on-ink sm:mx-[calc(50%-50vw)] px-6 sm:px-0">
        <div className="spa-glow bg-accent w-[320px] h-[320px] -top-32 -right-24" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-0 sm:px-6 py-14 sm:py-20">
          <Breadcrumbs
            variant="ink"
            items={[{ name: t.nav.home, href: `/${lang}` }, { name: label, href: `/${lang}/city/${city}` }]}
          />
          <h1 className="font-display italic font-semibold text-3xl sm:text-5xl tracking-tight mb-3">
            {t.city.listTitle.replace("{city}", label)}
          </h1>
          <p className="text-on-ink-muted mb-1">
            {allRelevant.length} {t.city.placeCount}
          </p>
          <p className="text-on-ink-muted max-w-2xl leading-relaxed">{t.city.intro.replace("{city}", label)}</p>
          {allRelevant.length > places.length && (
            <p className="text-xs text-on-ink-muted/70 mt-1">
              {t.city.showingTop.replace("{shown}", String(places.length))}
            </p>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-14">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} lang={lang} />
          ))}
        </div>
        <Faq
          title={t.city.faqTitle.replace("{city}", label)}
          items={t.city.faq.map((f) => ({
            q: f.q.replace("{city}", label),
            a: f.a.replace("{city}", label),
          }))}
        />
      </div>
    </div>
  );
}
