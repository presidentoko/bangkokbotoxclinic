import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLang, SITE, hreflangAlternates } from "@/lib/site";
import { tFor } from "@/lib/i18n";
import { getGuide, listGuides } from "@/lib/guides";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export function generateStaticParams() {
  return listGuides().map((g) => ({ slug: g.slug }));
}
export const dynamicParams = false;

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
    alternates: {
      canonical: `/${lang}/guide/${slug}`,
      languages: hreflangAlternates((l) => `/${l}/guide/${slug}`),
    },
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
