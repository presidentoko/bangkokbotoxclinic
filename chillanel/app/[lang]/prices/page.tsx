import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates, cityLabel, localeFor, ogLocale } from "@/lib/site";
import { listCities, loadCity } from "@/lib/data";
import { priceGlossaryForCity } from "@/lib/price-glossary";
import { themeLabel } from "@/lib/theme-labels";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = tFor(lang);
  return {
    title: `${t.prices.title} — ${SITE.name}`,
    description: t.prices.intro,
    alternates: {
      canonical: `/${lang}/prices`,
      languages: hreflangAlternates((l) => `/${l}/prices`),
    },
    openGraph: { url: `${SITE.origin}/${lang}/prices`, siteName: SITE.name, locale: ogLocale(lang), type: "website", images: [`${SITE.origin}/opengraph-image`] },
  };
}

export default async function PricesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tFor(lang);
  const locale = localeFor(lang);

  const cities = listCities()
    .map((city) => ({ city, rows: priceGlossaryForCity(loadCity(city).places) }))
    .filter((c) => c.rows.length > 0);

  // AEO direct-answer: the single most-evidenced row per city, as a real
  // question+answer pair (same pattern as the district/service pages' "top
  // pick" sentence) -- these numbers are exactly what an answer engine or a
  // "how much does massage cost in Bangkok" search wants to quote.
  const faqItems = cities
    .map(({ city, rows }) => {
      const top = rows[0];
      if (!top) return null;
      const cityName = cityLabel(city);
      const themeName = themeLabel(top.theme, lang);
      return {
        q: t.prices.faqQuestion.replace("{theme}", themeName).replace("{city}", cityName),
        a: t.prices.faqAnswer
          .replace("{theme}", themeName)
          .replace("{city}", cityName)
          .replace("{price}", top.median.toLocaleString(locale)),
      };
    })
    .filter((item) => item != null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumbs items={[{ name: t.nav.home, href: `/${lang}` }, { name: t.prices.title, href: `/${lang}/prices` }]} />
      <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">{t.prices.title}</h1>
      <p className="text-muted mb-10 max-w-xl leading-relaxed">{t.prices.intro}</p>

      <div className="space-y-10">
        {cities.map(({ city, rows }) => (
          <section key={city}>
            <h2 className="font-display italic text-2xl mb-4">{cityLabel(city)}</h2>
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg-elev">
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wide text-muted font-semibold">
                      {t.prices.themeColumnLabel}
                    </th>
                    <th className="text-right py-3 px-4 text-xs uppercase tracking-wide text-muted font-semibold">
                      {t.prices.priceColumnLabel}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.theme} className="border-b border-border last:border-0">
                      <td className="py-3 px-4 font-medium">{themeLabel(row.theme, lang)}</td>
                      <td className="py-3 px-4 text-right tabular-nums">
                        <span className="font-semibold text-accent">~{row.median.toLocaleString(locale)}฿</span>
                        <span className="block text-xs text-muted mt-0.5">
                          {t.prices.sampleSizeLabel.replace("{n}", String(row.sampleSize))}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>

      {faqItems.length > 0 && <Faq title={t.prices.faqTitle} items={faqItems} />}
    </div>
  );
}
