import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdvertiseForm } from "@/components/AdvertiseForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = tFor(lang);
  return {
    title: `${t.advertise.title} — ${SITE.name}`,
    description: t.advertise.intro,
    alternates: {
      canonical: `/${lang}/advertise`,
      languages: hreflangAlternates((l) => `/${l}/advertise`),
    },
    openGraph: { url: `${SITE.origin}/${lang}/advertise`, siteName: SITE.name, type: "website", images: [`${SITE.origin}/opengraph-image`] },
    // A lead-gen form for business owners has no search intent of its own
    // and would just be duplicate boilerplate in results next to every
    // real place/guide page.
    robots: { index: false, follow: true },
  };
}

export default async function AdvertisePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tFor(lang);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Breadcrumbs items={[{ name: t.nav.home, href: `/${lang}` }, { name: t.advertise.title, href: `/${lang}/advertise` }]} />
      <h1 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">{t.advertise.title}</h1>
      <p className="text-muted leading-relaxed text-lg mb-8">{t.advertise.intro}</p>
      <AdvertiseForm lang={lang} />
    </div>
  );
}
