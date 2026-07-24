import type { Metadata } from "next";
import Link from "next/link";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates } from "@/lib/site";
import { listCities, loadCity } from "@/lib/data";
import { PlaceCard } from "@/components/PlaceCard";
import { Faq } from "@/components/Faq";
import { ReviewQuotes, type QuoteItem } from "@/components/ReviewQuotes";
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
  const totalReviews = bangkok.places.reduce((sum, p) => sum + p.reviews.length, 0);
  const totalMentions = bangkok.places.reduce((sum, p) => sum + p.therapistMentions.length, 0);

  const quotes: QuoteItem[] = bangkok.places
    .filter((p) => p.therapistMentions.length > 0)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 6)
    .map((p) => ({
      quote: p.therapistMentions[0].quotes[0],
      therapistName: p.therapistMentions[0].name,
      placeName: p.name,
      placeId: p.id,
    }))
    .filter((q) => Boolean(q.quote));

  return (
    <div>
      {/* Full-bleed premium hero */}
      <section className="relative overflow-hidden bg-ink text-on-ink sm:mx-[calc(50%-50vw)] px-6 sm:px-0">
        <div
          className="spa-glow bg-accent w-[420px] h-[420px] -top-40 -left-32"
          aria-hidden="true"
        />
        <div
          className="spa-glow bg-accent-warm w-[360px] h-[360px] -bottom-32 right-0"
          aria-hidden="true"
        />
        <div className="relative max-w-5xl mx-auto px-0 sm:px-6 pt-20 sm:pt-32 pb-14 sm:pb-16">
          {totalPlaces > 0 && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur px-3.5 py-1.5 text-xs font-semibold text-on-ink-muted mb-7">
              <span className="text-accent-warm" aria-hidden="true">✦</span>
              {t.home.trustBadge.replace("{count}", String(Math.floor(totalPlaces / 10) * 10))}
            </div>
          )}
          <h1 className="font-display italic font-semibold text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.08] max-w-3xl">
            {t.home.heroTitle}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-on-ink-muted max-w-xl leading-relaxed">
            {t.home.heroSub}
          </p>
          {cities.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 mt-10">
              <Link
                href={`/${lang}/city/${cities[0]}`}
                className="group inline-flex items-center gap-2 rounded-full bg-accent-warm text-ink font-semibold px-7 py-3.5 shadow-lg shadow-accent-warm/20 hover:shadow-xl hover:shadow-accent-warm/30 hover:-translate-y-0.5 transition"
              >
                {t.home.ctaBrowse}
                <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </Link>
              <Link
                href={`/${lang}/guide`}
                className="text-sm font-semibold text-on-ink-muted hover:text-on-ink transition-colors underline decoration-white/20 underline-offset-4"
              >
                {t.nav.guides}
              </Link>
            </div>
          )}
          <p className="mt-8 text-xs text-on-ink-muted/70 max-w-lg leading-relaxed">{t.home.manifesto}</p>
        </div>

        {/* Stat strip — converts trust claims into real numbers from data we already have. */}
        {totalPlaces > 0 && (
          <div className="relative border-t border-white/10">
            <div className="max-w-5xl mx-auto grid grid-cols-3 divide-x divide-white/10 text-center">
              {[
                { value: totalPlaces, label: t.home.stats.places },
                { value: totalReviews, label: t.home.stats.reviews },
                { value: totalMentions, label: t.home.stats.therapists },
              ].map((s) => (
                <div key={s.label} className="px-3 py-6 sm:py-8">
                  <div className="font-display text-2xl sm:text-4xl font-semibold tabular-nums text-accent-warm">
                    {s.value.toLocaleString()}+
                  </div>
                  <div className="text-[11px] sm:text-xs text-on-ink-muted mt-1.5 leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <div className="max-w-5xl mx-auto px-4 py-14 sm:py-16">
        <section className="mb-14 rounded-3xl border border-border bg-bg-elev p-7 sm:p-10">
          <h2 className="font-display italic text-2xl sm:text-3xl mb-3">{t.home.philosophyTitle}</h2>
          <p className="text-muted leading-relaxed text-base sm:text-lg max-w-2xl">{t.home.philosophyBody}</p>
        </section>

        {featured.length > 0 && (
          <section className="mb-14">
            <h2 className="font-display italic text-2xl sm:text-3xl mb-6">{t.home.featuredTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {featured.map((place, i) => (
                <PlaceCard key={place.id} place={place} lang={lang} editorsPick={i < 2} />
              ))}
            </div>
          </section>
        )}

        <ReviewQuotes title={t.home.quotesTitle} items={quotes} lang={lang} />

        <Faq title={t.home.faqTitle} items={t.home.faq} />
      </div>
    </div>
  );
}
