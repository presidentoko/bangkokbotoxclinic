import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = tFor(lang);
  return {
    title: `${t.about.title} — ${SITE.name}`,
    description: t.about.body,
    alternates: {
      canonical: `/${lang}/about`,
      languages: hreflangAlternates((l) => `/${l}/about`),
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tFor(lang);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Breadcrumbs items={[{ name: t.nav.home, href: `/${lang}` }, { name: t.about.title, href: `/${lang}/about` }]} />
      <h1 className="text-3xl sm:text-4xl font-black mb-6 tracking-tight">{t.about.title}</h1>
      <p className="text-muted leading-relaxed text-lg">{t.about.body}</p>
    </div>
  );
}
