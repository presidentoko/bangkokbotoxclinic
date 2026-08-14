import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLang, SITE, hreflangAlternates, ogLocale } from "@/lib/site";
import { tFor } from "@/lib/i18n";
import { getGuide, listGuides } from "@/lib/guides";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleJsonLd } from "@/components/JsonLd";
import { Faq } from "@/components/Faq";
import { ArrowRightIcon } from "@/components/Icon";

export function generateStaticParams() {
  return listGuides().map((g) => ({ slug: g.slug }));
}
export const dynamicParams = false;

// Without this, generateMetadata returned no `description` at all, so every
// guide inherited the identical homepage boilerplate from the root layout —
// all 4 guides looked the same to search engines. Truncates at a word
// boundary so it doesn't cut mid-word.
function metaDescriptionFrom(body: string, maxLength = 160): string {
  if (body.length <= maxLength) return body;
  const truncated = body.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang)) return {};
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: `${guide.title[lang]} — ${SITE.name}`,
    description: metaDescriptionFrom(guide.body[lang]),
    alternates: {
      canonical: `/${lang}/guide/${slug}`,
      languages: hreflangAlternates((l) => `/${l}/guide/${slug}`),
    },
    openGraph: { url: `${SITE.origin}/${lang}/guide/${slug}`, siteName: SITE.name, locale: ogLocale(lang), type: "article", images: [`${SITE.origin}/opengraph-image`] },
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLang(lang)) notFound();
  const guide = getGuide(slug);
  if (!guide) notFound();
  const t = tFor(lang);
  const sections = guide.sections?.[lang];
  const faqItems = guide.faq?.[lang];
  const relatedGuides = (guide.relatedGuides ?? [])
    .map((relSlug) => getGuide(relSlug))
    .filter((g): g is NonNullable<typeof g> => g != null);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <ArticleJsonLd
        headline={guide.title[lang]}
        description={metaDescriptionFrom(guide.body[lang])}
        url={`${SITE.origin}/${lang}/guide/${slug}`}
      />
      <Breadcrumbs
        items={[
          { name: t.nav.home, href: `/${lang}` },
          { name: t.guide.indexTitle, href: `/${lang}/guide` },
          { name: guide.title[lang], href: `/${lang}/guide/${slug}` },
        ]}
      />
      <h1 className="text-3xl sm:text-4xl font-black mb-6 tracking-tight">{guide.title[lang]}</h1>
      <p className="text-muted leading-relaxed text-lg whitespace-pre-line">{guide.body[lang]}</p>

      {/* Sections/FAQ are only present once a language's guide content has
          been restructured (see lib/guides.ts's Guide type) -- th/ko fall
          back to just the lede paragraph above until translated, same as
          before this change. */}
      {sections && sections.length > 0 && (
        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-xl font-bold mb-2">{section.heading}</h2>
              <p className="text-muted leading-relaxed whitespace-pre-line">{section.body}</p>
            </div>
          ))}
        </div>
      )}

      {faqItems && faqItems.length > 0 && (
        <div className="mt-12">
          <Faq title={t.place.faqTitle} items={faqItems} />
        </div>
      )}

      {/* Guides used to be the single biggest dead end on the site -- zero
          links to anywhere else. Related guides (per-guide, curated) plus
          these two fixed utility links (every guide, no data needed) fix
          that without requiring every guide to have hand-picked place
          links, which wouldn't make sense for general-advice content. */}
      {relatedGuides.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-xs uppercase tracking-wide text-muted font-semibold mb-3">{t.guide.relatedGuidesTitle}</h2>
          <ul className="space-y-2">
            {relatedGuides.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/${lang}/guide/${g.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
                >
                  {g.title[lang]} <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 pt-8 border-t border-border flex flex-wrap gap-4">
        <h2 className="sr-only">{t.guide.browseLinksTitle}</h2>
        <Link href={`/${lang}/prices`} className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
          {t.prices.title} <ArrowRightIcon className="w-3.5 h-3.5" />
        </Link>
        <Link href={`/${lang}/city`} className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
          {t.cities.title} <ArrowRightIcon className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
