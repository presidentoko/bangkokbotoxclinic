import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides";
import { SITE, SUPPORTED_LANGS } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import Header from "@/components/Header";

export const dynamic = "force-static";

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const url = `${SITE.origin}/${lang}/guide/`;
  return {
    title: "Hair Transplant Guides — Thailand",
    description: "Cost breakdowns, technique comparisons (FUE vs DHI), and real patient review roundups for hair transplant clinics in Thailand.",
    alternates: { canonical: url },
    openGraph: { title: "Hair Transplant Guides — Thai Facial Clinic", url },
  };
}

export default async function GuideHubPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20">
      <Header lang={lang} />
      <main className="space-y-10">
        <header className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-900 to-navy-950 px-6 py-10 text-white sm:px-10 sm:py-14">
          <div className="absolute inset-0 opacity-30 bg-grid" aria-hidden />
          <div className="relative">
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tighter-display sm:text-5xl">
              Hair transplant <span className="text-gold-300">guides</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-navy-100 sm:text-lg">
              {GUIDES.length} guides — cost breakdowns, technique comparisons, and real patient review roundups.
            </p>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g) => (
            <Link key={g.slug} href={`/${lang}/guide/${g.slug}/`} className="card card-hover p-5">
              <div className="font-display text-base font-bold tracking-tighter-display leading-tight">📖 {g.title}</div>
              <div className="mt-2 text-xs muted line-clamp-3">{g.intro}</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
