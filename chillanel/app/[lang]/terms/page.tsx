import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates, ogLocale } from "@/lib/site";
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
    title: `${t.terms.title} — ${SITE.name}`,
    description: t.terms.intro,
    alternates: {
      canonical: `/${lang}/terms`,
      languages: hreflangAlternates((l) => `/${l}/terms`),
    },
    openGraph: { url: `${SITE.origin}/${lang}/terms`, siteName: SITE.name, locale: ogLocale(lang), type: "website", images: [`${SITE.origin}/opengraph-image`] },
  };
}

// Indexable for the same reason as /privacy — see that file.
export default async function TermsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tFor(lang);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Breadcrumbs items={[{ name: t.nav.home, href: `/${lang}` }, { name: t.terms.title, href: `/${lang}/terms` }]} />
      <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">{t.terms.title}</h1>
      <p className="text-xs uppercase tracking-wide text-muted mb-6">{t.terms.updated}</p>
      <p className="text-muted leading-relaxed text-lg">{t.terms.intro}</p>
      {t.terms.sections.map((section) => (
        <section key={section.heading}>
          <h2 className="text-xl font-bold mt-10 mb-3">{section.heading}</h2>
          <p className="text-muted leading-relaxed">{section.body}</p>
        </section>
      ))}
      <h2 className="text-xl font-bold mt-10 mb-3">{t.terms.contactHeading}</h2>
      <p className="text-muted leading-relaxed">{t.terms.contactBody}</p>
      <Link href={`/${lang}/advertise`} className="inline-block mt-4 font-semibold text-accent hover:underline">
        {t.terms.contactCta}
      </Link>
    </div>
  );
}
