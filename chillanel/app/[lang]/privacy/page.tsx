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
    title: `${t.privacy.title} — ${SITE.name}`,
    description: t.privacy.intro,
    alternates: {
      canonical: `/${lang}/privacy`,
      languages: hreflangAlternates((l) => `/${l}/privacy`),
    },
    openGraph: { url: `${SITE.origin}/${lang}/privacy`, siteName: SITE.name, locale: ogLocale(lang), type: "website", images: [`${SITE.origin}/opengraph-image`] },
  };
}

// Deliberately left indexable (unlike /advertise, which sets robots.index
// false): ad networks and app-store style reviewers check that a privacy
// policy is publicly reachable and crawlable before approving a site, so
// this page has to be in the index and in the sitemap.
export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tFor(lang);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Breadcrumbs items={[{ name: t.nav.home, href: `/${lang}` }, { name: t.privacy.title, href: `/${lang}/privacy` }]} />
      <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">{t.privacy.title}</h1>
      <p className="text-xs uppercase tracking-wide text-muted mb-6">{t.privacy.updated}</p>
      <p className="text-muted leading-relaxed text-lg">{t.privacy.intro}</p>
      {t.privacy.sections.map((section) => (
        <section key={section.heading}>
          <h2 className="text-xl font-bold mt-10 mb-3">{section.heading}</h2>
          <p className="text-muted leading-relaxed">{section.body}</p>
        </section>
      ))}
      <h2 className="text-xl font-bold mt-10 mb-3">{t.privacy.contactHeading}</h2>
      <p className="text-muted leading-relaxed">{t.privacy.contactBody}</p>
      <Link href={`/${lang}/advertise`} className="inline-block mt-4 font-semibold text-accent hover:underline">
        {t.privacy.contactCta}
      </Link>
    </div>
  );
}
