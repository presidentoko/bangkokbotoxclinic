import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates, cityLabel, localeFor, ogLocale } from "@/lib/site";
import { listCities, loadCity } from "@/lib/data";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = tFor(lang);
  return {
    title: `${t.cities.title} — ${SITE.name}`,
    description: t.cities.intro,
    alternates: {
      canonical: `/${lang}/city`,
      languages: hreflangAlternates((l) => `/${l}/city`),
    },
    openGraph: { url: `${SITE.origin}/${lang}/city`, siteName: SITE.name, locale: ogLocale(lang), type: "website", images: [`${SITE.origin}/opengraph-image`] },
  };
}

export default async function CitiesIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tFor(lang);
  const cities = listCities()
    .map((city) => ({ city, count: loadCity(city).places.length }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);
  if (cities.length === 0) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumbs items={[{ name: t.nav.home, href: `/${lang}` }, { name: t.cities.title, href: `/${lang}/city` }]} />
      <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">{t.cities.title}</h1>
      <p className="text-muted mb-8 max-w-xl leading-relaxed">{t.cities.intro}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cities.map(({ city, count }) => (
          <Link
            key={city}
            href={`/${lang}/city/${city}`}
            className="flex items-center justify-between rounded-xl border border-border bg-bg-elev p-5 hover:border-accent hover:shadow-sm transition"
          >
            <span className="font-display italic text-xl font-semibold">{cityLabel(city)}</span>
            <span className="text-sm text-muted tabular-nums">
              {count.toLocaleString(localeFor(lang))} {t.city.placeCount}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
