import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadClinics } from "@/lib/data";
import { SITE, SUPPORTED_LANGS } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import Header from "@/components/Header";
import ClinicCard from "@/components/ClinicCard";

export const dynamic = "force-static";
export const dynamicParams = false;

function slugify(city: string): string {
  return city.toLowerCase().replace(/\s+/g, "-");
}

function citySlugs(): string[] {
  const { clinics } = loadClinics();
  return [...new Set(clinics.map((c) => c.city).filter(Boolean))].map(slugify);
}

export function generateStaticParams() {
  return SUPPORTED_LANGS.flatMap((lang) => citySlugs().map((city) => ({ lang, city })));
}

function findCityName(slug: string): string | null {
  const { clinics } = loadClinics();
  const match = clinics.find((c) => slugify(c.city) === slug);
  return match ? match.city : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang; city: string }>;
}): Promise<Metadata> {
  const { lang, city: citySlug } = await params;
  const cityName = findCityName(citySlug);
  if (!cityName) return {};
  const { clinics } = loadClinics();
  const count = clinics.filter((c) => c.city === cityName).length;
  const url = `${SITE.origin}/${lang}/city/${citySlug}/`;
  // 도시 소개문은 영어 전용 — 비영어는 en 으로 canonical 수렴 (guide/c 패턴과 동일)
  const canonicalUrl = lang === "en" ? url : `${SITE.origin}/en/city/${citySlug}/`;
  const title = `Hair Transplant ${cityName} — ${count} Verified Clinics, FUE & DHI 2026`;
  const description = `Compare ${count} verified hair transplant clinics in ${cityName}, Thailand. Trust Score ranked from real Google, Bookimed, Reddit & Naver reviews. Free consultation.`;
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    // 2026-09-02: siteName 은 페이지마다 다시 넣어야 한다 — Next 는 openGraph 를
    // 객체 단위로 교체해서, 루트 layout 에 있어도 페이지가 정의하면 사라진다.
    openGraph: { siteName: SITE.name, title, description, url },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ lang: Lang; city: string }>;
}) {
  const { lang, city: citySlug } = await params;
  const cityName = findCityName(citySlug);
  if (!cityName) notFound();

  const { clinics } = loadClinics();
  const list = clinics.filter((c) => c.city === cityName);
  const sorted = [...list].sort((a, b) => b.trust_score - a.trust_score);
  const pageUrl = `${SITE.origin}/${lang}/city/${citySlug}/`;

  const prices = sorted
    .flatMap((c) => (c.bookimed_price_from ? [c.bookimed_price_from] : []));

  const faqs = [
    {
      q: `How many hair transplant clinics are in ${cityName}?`,
      a: `We've verified ${sorted.length} hair transplant clinics in ${cityName} through Google, Bookimed, Reddit and Naver review analysis. Each is ranked by Trust Score, not paid placement.`,
    },
    {
      q: `What does a hair transplant cost in ${cityName}?`,
      a: `FUE typically starts from ฿65,000, DHI from ฿85,000, and SMP from ฿15,000 in Thailand — 50–70% less than Korea, the UK, or the US for comparable technique and surgeon experience.`,
    },
    {
      q: `Is ${cityName} good for medical tourism hair transplants?`,
      a: `Thailand is a top-3 global destination for hair restoration tourism, combining JCI-accredited clinics, English-speaking coordinators, and recovery-friendly travel infrastructure.`,
    },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.origin}/${lang}/` },
      { "@type": "ListItem", position: 2, name: cityName, item: pageUrl },
    ],
  };

  const itemListSchema = sorted.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Hair Transplant Clinics in ${cityName}`,
    description: `Top-ranked hair transplant clinics in ${cityName} by Trust Score`,
    numberOfItems: sorted.length,
    itemListElement: sorted.slice(0, 20).map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MedicalBusiness",
        name: c.name,
        url: `${SITE.origin}/${lang}/clinic/${c.slug}/`,
        aggregateRating: c.rating && c.review_count ? {
          "@type": "AggregateRating",
          ratingValue: c.rating,
          reviewCount: c.review_count,
          bestRating: 5,
        } : undefined,
      },
    })),
  } : null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {itemListSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="mx-auto max-w-6xl px-4 pb-20">
        <Header lang={lang} />
        <main className="space-y-10">
          <header className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-900 to-navy-950 px-6 py-10 text-white sm:px-10 sm:py-14">
            <div className="absolute inset-0 opacity-30 bg-grid" aria-hidden />
            <div className="blob -top-20 -right-20 h-72 w-72 bg-gold-500/30" aria-hidden />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-gold-300">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                {sorted.length} verified clinics
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tighter-display sm:text-5xl lg:text-6xl">
                Hair Transplant<br />
                <span className="text-gold-300">{cityName}</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-navy-100 sm:text-lg">
                {sorted.length} clinics in {cityName} · Sorted by Trust Score from real Google, Bookimed, Reddit &amp; Naver reviews.
                {prices.length > 0 && <> Prices from {prices[0]}.</>}
              </p>
            </div>
          </header>

          {sorted.length === 0 ? (
            <div className="rounded-2xl border border-dashed py-20 text-center" style={{ borderColor: "rgb(var(--border))" }}>
              <p className="text-base font-semibold">No clinics matched yet</p>
              <p className="mt-1 text-sm muted">Check back soon — we scrape new data continuously.</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {sorted.map((c) => <ClinicCard key={c.id} c={c} lang={lang} />)}
            </div>
          )}

          <section id="faq" className="rounded-2xl border p-6 sm:p-8" style={{ borderColor: "rgb(var(--border))" }}>
            <h2 className="font-display text-2xl font-bold tracking-tighter-display mb-6">
              Frequently asked about hair transplants in {cityName}
            </h2>
            <dl className="space-y-6">
              {faqs.map((f) => (
                <div key={f.q}>
                  <dt className="font-semibold text-[rgb(var(--fg))]">{f.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed muted">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </main>
      </div>
    </>
  );
}
