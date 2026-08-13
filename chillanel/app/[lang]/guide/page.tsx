import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates } from "@/lib/site";
import { listGuides } from "@/lib/guides";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return {
    title: `${tFor(lang).guide.indexTitle} — ${SITE.name}`,
    description: tFor(lang).guide.indexDescription,
    alternates: {
      canonical: `/${lang}/guide`,
      languages: hreflangAlternates((l) => `/${l}/guide`),
    },
    openGraph: { url: `${SITE.origin}/${lang}/guide`, siteName: SITE.name, type: "website", images: [`${SITE.origin}/opengraph-image`] },
  };
}

export default async function GuideIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tFor(lang);
  const guides = listGuides();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumbs items={[{ name: t.nav.home, href: `/${lang}` }, { name: t.guide.indexTitle, href: `/${lang}/guide` }]} />
      <h1 className="text-3xl sm:text-4xl font-black mb-8 tracking-tight">{t.guide.indexTitle}</h1>
      <div className="space-y-3">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/${lang}/guide/${g.slug}`}
            className="block rounded-xl border border-border bg-bg-elev p-5 hover:border-accent hover:shadow-sm transition font-semibold"
          >
            {g.title[lang]}
          </Link>
        ))}
      </div>
    </div>
  );
}
