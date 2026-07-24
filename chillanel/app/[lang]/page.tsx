import type { Metadata } from "next";
import { tFor } from "@/lib/i18n";
import { isLang, SITE } from "@/lib/site";
import { loadCity } from "@/lib/data";
import { PlaceCard } from "@/components/PlaceCard";
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
    alternates: { canonical: `/${lang}` },
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
  const bangkok = loadCity("bangkok");
  const featured = bangkok.places
    .filter((p) => p.rating != null && p.reviewCount >= 10)
    .slice(0, 9);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <section className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
          {t.home.heroTitle}
        </h1>
        <p className="mt-4 text-lg text-muted max-w-2xl">{t.home.heroSub}</p>
      </section>

      <section className="mb-12 rounded-2xl border border-border bg-bg-elev p-6">
        <h2 className="text-xl font-bold mb-2">{t.home.philosophyTitle}</h2>
        <p className="text-muted leading-relaxed">{t.home.philosophyBody}</p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">{t.home.featuredTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {featured.map((place) => (
            <PlaceCard key={place.id} place={place} lang={lang} />
          ))}
        </div>
      </section>
    </div>
  );
}
