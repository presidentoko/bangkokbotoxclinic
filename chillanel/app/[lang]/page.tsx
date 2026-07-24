import type { Metadata } from "next";
import Link from "next/link";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates } from "@/lib/site";
import { listCities, loadCity } from "@/lib/data";
import { PlaceCard } from "@/components/PlaceCard";
import { Faq } from "@/components/Faq";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = tFor(lang);
  return {
    title: `${SITE.name} — ${t.home.heroTitle}`,
    description: t.home.heroSub,
    alternates: { canonical: `/${lang}`, languages: hreflangAlternates((l) => `/${l}`) },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tFor(lang);
  const cities = listCities();
  const bangkok = cities.length > 0 ? loadCity(cities[0]) : { city: "", generatedAt: "", places: [] };
  const featured = bangkok.places
    .filter((p) => p.rating != null && p.reviewCount >= 10)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount)
    .slice(0, 9);
  const totalPlaces = bangkok.places.length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
      <section className="mb-10">
        {totalPlaces > 0 && (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-elev px-3 py-1 text-xs font-semibold text-muted mb-5">
            <span aria-hidden="true">✓</span>
            {t.home.trustBadge.replace("{count}", String(Math.floor(totalPlaces / 10) * 10))}
          </div>
        )}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05]">
          {t.home.heroTitle}
        </h1>
        <p className="mt-5 text-lg sm:text-xl text-muted max-w-2xl leading-relaxed">{t.home.heroSub}</p>
        {cities.length > 0 && (
          <Link
            href={`/${lang}/city/${cities[0]}`}
            className="inline-flex items-center gap-2 mt-7 rounded-full bg-accent text-white font-semibold px-6 py-3 hover:opacity-90 transition"
          >
            {t.home.ctaBrowse} →
          </Link>
        )}
      </section>

      <section className="mb-12 rounded-2xl border border-border bg-bg-elev p-6 sm:p-8">
        <h2 className="text-xl font-bold mb-2">{t.home.philosophyTitle}</h2>
        <p className="text-muted leading-relaxed">{t.home.philosophyBody}</p>
      </section>

      {featured.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4">{t.home.featuredTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {featured.map((place) => (
              <PlaceCard key={place.id} place={place} lang={lang} />
            ))}
          </div>
        </section>
      )}

      <Faq title={t.home.faqTitle} items={t.home.faq} />
    </div>
  );
}
