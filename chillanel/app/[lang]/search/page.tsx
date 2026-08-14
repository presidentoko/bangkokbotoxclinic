import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates, ogLocale } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SearchResultsClient } from "@/components/SearchResultsClient";
import { PlaceCardSkeleton } from "@/components/PlaceCardSkeleton";

// Query-driven results page, not real content of its own -- same noindex
// treatment as compare/favorites. SearchBox's dropdown (top 8 matches) and
// this page (every match) share lib/search-match.ts's matching rule.
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const { q } = await searchParams;
  const t = tFor(lang);
  const title = q ? t.search.resultsForQuery.replace("{query}", q) : t.search.title;
  return {
    title: `${title} — ${SITE.name}`,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `/${lang}/search`,
      languages: hreflangAlternates((l) => `/${l}/search`),
    },
    openGraph: { url: `${SITE.origin}/${lang}/search`, siteName: SITE.name, locale: ogLocale(lang), type: "website", images: [`${SITE.origin}/opengraph-image`] },
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const { q } = await searchParams;
  const t = tFor(lang);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Breadcrumbs items={[{ name: t.nav.home, href: `/${lang}` }, { name: t.search.title, href: `/${lang}/search` }]} />
      <h1 className="text-3xl sm:text-4xl font-black mb-8 tracking-tight">
        {q ? t.search.resultsForQuery.replace("{query}", q) : t.search.title}
      </h1>
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {Array.from({ length: 6 }, (_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <PlaceCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <SearchResultsClient lang={lang} />
      </Suspense>
    </div>
  );
}
