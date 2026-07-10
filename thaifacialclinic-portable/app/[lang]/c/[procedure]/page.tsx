import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { loadClinics } from "@/lib/data";
import { SITE, SUPPORTED_LANGS } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import Header from "@/components/Header";
import ClinicCard from "@/components/ClinicCard";
import { findGuide, PROC_TO_GUIDES } from "@/lib/guides";
import { PROCEDURE_FAQS } from "@/lib/faq";

export const dynamic = "force-static";
export const dynamicParams = false;

const PROC_MAP: Record<string, { name: string; match: RegExp; priceHint: string }> = {
  "fue": { name: "FUE Hair Transplant", match: /FUE/i, priceHint: "from ฿65,000 (2,000 grafts)" },
  "dhi": { name: "DHI Hair Transplant", match: /DHI/i, priceHint: "from ฿85,000 (2,000 grafts)" },
  "fut": { name: "FUT Hair Transplant", match: /FUT/i, priceHint: "from ฿55,000 (2,000 grafts)" },
  "prp": { name: "PRP Hair Treatment", match: /PRP/i, priceHint: "฿5,000–15,000 per session" },
  "smp": { name: "SMP / Scalp Micropigmentation", match: /SMP|Scalp Micropigmentation/i, priceHint: "฿15,000–50,000 per session" },
  "stem-cell": { name: "Stem Cell Therapy", match: /Stem Cell/i, priceHint: "from ฿40,000 per session" },
  "eyebrow": { name: "Eyebrow Transplant", match: /Eyebrow/i, priceHint: "฿35,000–80,000" },
  "beard": { name: "Beard Transplant", match: /Beard/i, priceHint: "฿50,000–120,000" },
  "scalp-care": { name: "Scalp Care / Scaling", match: /Scalp|head spa/i, priceHint: "฿3,000–12,000 per session" },
};

export function generateStaticParams() {
  return SUPPORTED_LANGS.flatMap((lang) =>
    Object.keys(PROC_MAP).map((procedure) => ({ lang, procedure }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang; procedure: string }> }): Promise<Metadata> {
  const { lang, procedure } = await params;
  const proc = PROC_MAP[procedure];
  if (!proc) return {};
  const url = `${SITE.origin}/${lang}/c/${procedure}/`;
  const canonicalUrl = lang === "en" ? url : `${SITE.origin}/en/c/${procedure}/`;
  const { clinics: allClinics } = loadClinics();
  const count = allClinics.filter((c) =>
    c.procedures.some((p) => proc.match.test(p)) || proc.match.test(c.category) || proc.match.test(c.name)
  ).length;
  return {
    title: `${proc.name} in Thailand — ${count} Verified Clinics, ${proc.priceHint}`,
    description: `Compare ${count} verified ${proc.name} clinics in Bangkok & Thailand. ${proc.priceHint}. Trust Score ranked from real Google + Bookimed + Reddit + Naver reviews. Free consultation.`,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${proc.name} in Bangkok — ${count} Verified Clinics`,
      description: `${count} clinics · ${proc.priceHint} · Trust Score ranked from real patient reviews.`,
      url,
    },
  };
}

export default async function ProcedurePage({
  params,
}: {
  params: Promise<{ lang: Lang; procedure: string }>;
}) {
  const { lang, procedure } = await params;
  const proc = PROC_MAP[procedure];
  if (!proc) notFound();
  const { clinics } = loadClinics();
  const list = clinics.filter((c) =>
    c.procedures.some((p) => proc.match.test(p)) || proc.match.test(c.category) || proc.match.test(c.name)
  );

  // Sort by trust desc
  const sorted = [...list].sort((a, b) => b.trust_score - a.trust_score);

  const relatedGuides = (PROC_TO_GUIDES[procedure] ?? [])
    .map((slug) => findGuide(slug))
    .filter((g): g is NonNullable<typeof g> => g !== undefined);

  const faqs = PROCEDURE_FAQS[procedure] ?? [];
  const pageUrl = `${SITE.origin}/${lang}/c/${procedure}/`;

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE.origin}/${lang}/` },
      { "@type": "ListItem", position: 2, name: proc.name, item: pageUrl },
    ],
  };

  const itemListSchema = sorted.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${proc.name} Clinics in Bangkok`,
    description: `Top-ranked ${proc.name} clinics in Bangkok by Trust Score`,
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

  return (
    <>
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {itemListSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />}
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
                {proc.name}<br />
                <span className="text-gold-300">in Bangkok</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-navy-100 sm:text-lg">
                {sorted.length} clinics · <strong className="text-gold-200">{proc.priceHint}</strong> · Sorted by Trust Score from real Google, Bookimed, Reddit, Naver &amp; Pantip reviews.
              </p>
            </div>
          </header>

          {sorted.length === 0 ? (
            <div className="rounded-2xl border border-dashed py-20 text-center" style={{ borderColor: "rgb(var(--border))" }}>
              <p className="text-base font-semibold">No clinics matched</p>
              <p className="mt-1 text-sm muted">Try a different procedure.</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {sorted.map((c) => <ClinicCard key={c.id} c={c} lang={lang} />)}
            </div>
          )}

          {relatedGuides.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-bold tracking-tighter-display mb-4">{proc.name} guides</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {relatedGuides.map((g) => (
                  <Link key={g.slug} href={`/${lang}/guide/${g.slug}/`} className="card card-hover p-4">
                    <div className="font-display text-base font-bold leading-tight">📖 {g.title}</div>
                    <div className="mt-1 text-xs muted line-clamp-2">{g.intro}</div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {faqs.length > 0 && (
            <section id="faq" className="rounded-2xl border p-6 sm:p-8" style={{ borderColor: "rgb(var(--border))" }}>
              <h2 className="font-display text-2xl font-bold tracking-tighter-display mb-6">Frequently asked about {proc.name}</h2>
              <dl className="space-y-6">
                {faqs.map((f) => (
                  <div key={f.q}>
                    <dt className="font-semibold text-[rgb(var(--fg))]">{f.q}</dt>
                    <dd className="mt-2 text-sm leading-relaxed muted">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </main>
      </div>
    </>
  );
}
