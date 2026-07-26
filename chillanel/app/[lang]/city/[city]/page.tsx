import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates, cityLabel } from "@/lib/site";
import { listCities, loadCity } from "@/lib/data";
import { isRelevantCategory } from "@/lib/categories";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PriceFilterableGrid } from "@/components/PriceFilterableGrid";
import { Faq } from "@/components/Faq";
import { TagCloud } from "@/components/TagCloud";
import { ItemListJsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return listCities().map((city) => ({ city }));
}
export const dynamicParams = false;

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
    openGraph: { url: `${SITE.origin}/${lang}/city/${city}` },
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
      <section className="relative overflow-hidden bg-ink text-on-ink sm:mx-[calc(50%-50vw)] px-6 sm:px-0 pb-20 sm:pb-28">
        <div className="spa-glow bg-accent w-[320px] h-[320px] -top-32 -right-24" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-0 sm:px-6 pt-14 sm:pt-20">
          <Breadcrumbs
            variant="ink"
            items={[{ name: t.nav.home, href: `/${lang}` }, { name: label, href: `/${lang}/city/${city}` }]}
          />
          <ItemListJsonLd
            name={t.city.listTitle.replace("{city}", label)}
            numberOfItems={allRelevant.length}
            items={places.map((p) => ({ name: p.name, url: `${SITE.origin}/${lang}/place/${p.id}` }))}
          />
          <h1 className="font-display italic font-semibold text-3xl sm:text-5xl tracking-tight mb-3">
            {t.city.listTitle.replace("{city}", label)}
          </h1>
          <p className="text-on-ink-muted max-w-2xl leading-relaxed">{t.city.intro.replace("{city}", label)}</p>
        </div>
      </section>

      {/* Floating card bridging hero/content, same pattern as the home page —
          keeps the two pages feeling like one site rather than a hero
          template stamped onto every route. */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="relative -mt-12 sm:-mt-16 rounded-3xl bg-bg-elev border border-border shadow-2xl shadow-ink/20 px-6 sm:px-8 py-5 sm:py-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-display text-2xl sm:text-3xl font-semibold text-accent tabular-nums">
              {allRelevant.length}
            </span>
            <span className="text-muted ml-2">{t.city.placeCount}</span>
          </div>
          {allRelevant.length > places.length && (
            <p className="text-xs text-muted">{t.city.showingTop.replace("{shown}", String(places.length))}</p>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-14">
        <PriceFilterableGrid places={places} lang={lang} />
        {data.themeAggregate.length > 0 && (
          <section className="mb-14">
            <h2 className="font-display italic text-2xl sm:text-3xl mb-6">
              {t.city.trendingTitle.replace("{city}", label)}
            </h2>
            <TagCloud items={data.themeAggregate} lang={lang} linkToService max={15} />
          </section>
        )}
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
