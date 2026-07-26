import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLang, SITE, hreflangAlternates } from "@/lib/site";
import { tFor } from "@/lib/i18n";
import { getGuide, listGuides } from "@/lib/guides";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleJsonLd } from "@/components/JsonLd";

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
    openGraph: { url: `${SITE.origin}/${lang}/guide/${slug}` },
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
    </div>
  );
}
