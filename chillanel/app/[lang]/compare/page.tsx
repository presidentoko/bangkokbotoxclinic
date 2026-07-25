import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CompareClient } from "@/components/CompareClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = tFor(lang);
  return {
    title: `${t.compare.title} — ${SITE.name}`,
    description: t.compare.intro,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `/${lang}/compare`,
      languages: hreflangAlternates((l) => `/${l}/compare`),
    },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tFor(lang);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumbs items={[{ name: t.nav.home, href: `/${lang}` }, { name: t.compare.title, href: `/${lang}/compare` }]} />
      <h1 className="font-display italic text-3xl sm:text-4xl font-semibold tracking-tight mb-2">{t.compare.title}</h1>
      <p className="text-muted mb-8 max-w-xl">{t.compare.intro}</p>
      <CompareClient lang={lang} />
    </div>
  );
}
