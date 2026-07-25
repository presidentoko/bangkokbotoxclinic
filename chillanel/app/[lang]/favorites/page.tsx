import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FavoritesClient } from "@/components/FavoritesClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = tFor(lang);
  return {
    title: `${t.favorites.title} — ${SITE.name}`,
    description: t.favorites.intro,
    // Client-rendered (localStorage-backed), no reason for it to rank —
    // avoids a search engine indexing an empty shell.
    robots: { index: false, follow: true },
    alternates: {
      canonical: `/${lang}/favorites`,
      languages: hreflangAlternates((l) => `/${l}/favorites`),
    },
  };
}

export default async function FavoritesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tFor(lang);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Breadcrumbs items={[{ name: t.nav.home, href: `/${lang}` }, { name: t.favorites.title, href: `/${lang}/favorites` }]} />
      <h1 className="font-display italic text-3xl sm:text-4xl font-semibold tracking-tight mb-2">{t.favorites.title}</h1>
      <p className="text-muted mb-8 max-w-xl">{t.favorites.intro}</p>
      <FavoritesClient lang={lang} />
    </div>
  );
}
