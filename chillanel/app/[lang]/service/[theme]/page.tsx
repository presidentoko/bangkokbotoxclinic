import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates, cityLabel } from "@/lib/site";
import { listCities, loadCity, getAllPlaces } from "@/lib/data";
import { themeLabel, slugifyTheme } from "@/lib/theme-labels";
import { placeMatchesLabel, averageRating, allThemeAndMoodLabels, isMoodLabel } from "@/lib/theme-stats";
import { PlaceCard } from "@/components/PlaceCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";
import { ItemListJsonLd } from "@/components/JsonLd";

const MAX_SHOWN = 90; // same payload-size discipline as the city page

function findLabelForSlug(slug: string): string | null {
  const labels = allThemeAndMoodLabels(getAllPlaces().map(({ place }) => place));
  return labels.find((label) => slugifyTheme(label) === slug) ?? null;
}

export function generateStaticParams() {
  const labels = allThemeAndMoodLabels(getAllPlaces().map(({ place }) => place));
  return labels.map((label) => ({ theme: slugifyTheme(label) }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; theme: string }>;
}): Promise<Metadata> {
  const { lang, theme } = await params;
  if (!isLang(lang)) return {};
  const rawLabel = findLabelForSlug(theme);
  if (!rawLabel) return {};
  const t = tFor(lang);
  const label = themeLabel(rawLabel, lang);
  const cities = listCities();
  const cityDisplayLabel = cities.length > 0 ? cityLabel(cities[0]) : "";
  const listTitleTemplate = isMoodLabel(rawLabel) ? t.service.moodListTitle : t.service.listTitle;
  const pageTitle = listTitleTemplate.replace("{theme}", label).replace("{city}", cityDisplayLabel);
  return {
    title: `${pageTitle} — ${SITE.name}`,
    description: t.service.intro.replace("{theme}", label).replace("{city}", cityDisplayLabel),
    alternates: {
      canonical: `/${lang}/service/${theme}`,
      languages: hreflangAlternates((l) => `/${l}/service/${theme}`),
    },
    openGraph: { url: `${SITE.origin}/${lang}/service/${theme}` },
  };
}

export default async function ServiceThemePage({
  params,
}: {
  params: Promise<{ lang: string; theme: string }>;
}) {
  const { lang, theme } = await params;
  if (!isLang(lang)) notFound();
  const rawLabel = findLabelForSlug(theme);
  if (!rawLabel) notFound();
  const t = tFor(lang);
  const cities = listCities();
  if (cities.length === 0) notFound();
  const cityCode = cities[0];
  const cityData = loadCity(cityCode);
  const label = themeLabel(rawLabel, lang);
  const cityDisplayLabel = cityLabel(cityCode);
  const isMood = isMoodLabel(rawLabel);
  const pageTitle = (isMood ? t.service.moodListTitle : t.service.listTitle)
    .replace("{theme}", label)
    .replace("{city}", cityDisplayLabel);

  const allMatching = cityData.places
    .filter((p) => placeMatchesLabel(p, rawLabel))
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount);
  if (allMatching.length === 0) notFound();
  const places = allMatching.slice(0, MAX_SHOWN);

  const avgRating = averageRating(allMatching);
  const faqAnswer = [
    t.service.faqAnswer.replace("{count}", String(allMatching.length)).replace("{theme}", label).replace("{city}", cityDisplayLabel),
    avgRating != null ? t.service.faqAnswerRatingClause.replace("{rating}", avgRating.toFixed(1)) : null,
  ]
    .filter(Boolean)
    .join(" ");
  const faqItems = [
    {
      q: (isMood ? t.service.moodFaqQuestion : t.service.faqQuestion).replace("{theme}", label).replace("{city}", cityDisplayLabel),
      a: faqAnswer,
    },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-ink text-on-ink sm:mx-[calc(50%-50vw)] px-6 sm:px-0 pb-20 sm:pb-28">
        <div className="spa-glow bg-accent-warm w-[300px] h-[300px] -top-28 -left-20" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto px-0 sm:px-6 pt-14 sm:pt-20">
          <Breadcrumbs
            variant="ink"
            items={[
              { name: t.nav.home, href: `/${lang}` },
              { name: cityDisplayLabel, href: `/${lang}/city/${cityCode}` },
              { name: label, href: `/${lang}/service/${theme}` },
            ]}
          />
          <ItemListJsonLd
            name={pageTitle}
            numberOfItems={allMatching.length}
            items={places.map((p) => ({ name: p.name, url: `${SITE.origin}/${lang}/place/${p.id}` }))}
          />
          <h1 className="font-display italic font-semibold text-3xl sm:text-5xl tracking-tight mb-3">{pageTitle}</h1>
          <p className="text-on-ink-muted max-w-2xl leading-relaxed">
            {t.service.intro.replace("{theme}", label).replace("{city}", cityDisplayLabel)}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 sm:py-14">
        <Link
          href={`/${lang}/city/${cityCode}`}
          className="inline-block text-sm text-accent font-semibold mb-6 hover:underline"
        >
          {t.service.backToCity.replace("{city}", cityDisplayLabel)}
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} lang={lang} />
          ))}
        </div>
        <Faq title={t.service.faqTitle} items={faqItems} />
      </div>
    </div>
  );
}
