import { notFound } from "next/navigation";
import { GUIDES, findGuide, extractHowToSteps } from "@/lib/guides";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { loadMasterDb, topByTrust } from "@/lib/data";
import { SupplierCard } from "@/components/SupplierCard";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://thaisupplyhub.com";
const BRAND = process.env.NEXT_PUBLIC_BRAND || "Thai Supply Hub";

export const dynamicParams = false;

export async function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const g = findGuide(slug);
  if (!g) return { title: "Guide not found" };
  return {
    title: g.metaTitle,
    description: g.metaDescription,
    alternates: { canonical: `/guide/${slug}` },
    openGraph: {
      title: g.metaTitle,
      description: g.metaDescription,
      type: "article",
      url: `${SITE}/guide/${slug}`,
    },
  };
}

function howToJsonLd(g: ReturnType<typeof findGuide> & object) {
  const steps = extractHowToSteps(g);
  if (!steps) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: g.metaTitle,
          description: g.metaDescription,
          inLanguage: "en",
          step: steps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.name,
            text: s.text,
          })),
        }),
      }}
    />
  );
}

function articleJsonLd(g: ReturnType<typeof findGuide> & object) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: g.metaTitle,
          description: g.metaDescription,
          datePublished: g.updated,
          dateModified: g.updated,
          author: { "@type": "Organization", name: BRAND, url: SITE },
          publisher: {
            "@type": "Organization",
            name: BRAND,
            url: SITE,
            logo: { "@type": "ImageObject", url: `${SITE}/icon` },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}/guide/${g.slug}` },
          inLanguage: "en",
          articleSection: "Buyer Guides",
        }),
      }}
    />
  );
}

const GUIDE_TO_BEST: Record<string, { slug: string; label: string }> = {
  "sourcing-thai-suppliers-direct": { slug: "highly-recommended", label: "Top 50 Recommended Suppliers" },
  "eastern-seaboard-industrial-estates-compared": { slug: "industrial-estates", label: "Industrial Estate Suppliers" },
  "thai-auto-parts-tier1-tier2": { slug: "auto-parts", label: "Auto Parts Ranked List" },
  "laem-chabang-warehouse-logistics": { slug: "warehouses", label: "Warehouse & 3PL Ranked List" },
  "thai-food-manufacturer-haccp-export": { slug: "food-manufacturers", label: "Food Manufacturer Ranked List" },
  "thai-electronics-manufacturer-hdd-ems": { slug: "electronics-manufacturers", label: "Electronics Manufacturer Ranked List" },
  "thai-logistics-3pl-customs-guide": { slug: "export-ready", label: "Export-Ready Suppliers" },
  "map-ta-phut-petrochemical-cluster": { slug: "industrial-estates", label: "Industrial Estate Suppliers" },
  "thai-packaging-manufacturer-guide": { slug: "manufacturers", label: "Manufacturer Ranked List" },
  "thai-precision-machining-guide": { slug: "manufacturers", label: "Manufacturer Ranked List" },
  "thai-steel-metal-fabrication-guide": { slug: "manufacturers", label: "Manufacturer Ranked List" },
  "thai-chemical-manufacturer-guide": { slug: "manufacturers", label: "Manufacturer Ranked List" },
  "thai-rubber-products-sourcing-guide": { slug: "manufacturers", label: "Manufacturer Ranked List" },
  "thai-textile-apparel-oem-guide": { slug: "manufacturers", label: "Manufacturer Ranked List" },
};

export default async function GuidePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const g = findGuide(slug);
  if (!g) notFound();

  const db = await loadMasterDb();
  const topSuppliers = topByTrust(db.suppliers, 6);
  const bestFor = GUIDE_TO_BEST[slug];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href="/guide" className="hover:text-[var(--fg)]">Buyer Guides</a>
        <span className="mx-2">›</span>
        <span>{g.title.replace(/ \(\d{4}\)$/, "")}</span>
      </nav>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance leading-[1.1]">
            {g.title}
          </h1>
          <p className="text-lg text-[var(--muted)] leading-relaxed text-balance">{g.intro}</p>
          <div className="mt-4 text-xs text-[var(--muted)] flex items-center gap-2 flex-wrap">
            <time dateTime={g.updated}>Updated {g.updated}</time>
            <span>·</span>
            <span>{g.sections.length} sections</span>
            <span>·</span>
            <span>{g.faqs.length} FAQs</span>
            {bestFor && (
              <>
                <span>·</span>
                <a href={`/best/${bestFor.slug}`}
                   className="text-amber-700 font-semibold hover:underline">
                  🏆 {bestFor.label} →
                </a>
              </>
            )}
          </div>
        </header>

        <div className="prose prose-emerald max-w-none">
          {g.sections.map((s, i) => (
            <section key={i} className="mb-8">
              <h2 className="text-2xl font-bold mb-3 mt-8">{s.heading}</h2>
              <p className="text-base leading-relaxed text-[var(--fg)] whitespace-pre-line">{s.body}</p>
            </section>
          ))}
        </div>

        {g.faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-5">Frequently asked</h2>
            <div className="space-y-3">
              {g.faqs.map((f, i) => (
                <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4 group">
                  <summary className="font-medium cursor-pointer flex items-center justify-between gap-3">
                    <span>{f.q}</span>
                    <span className="text-[var(--muted)] group-open:rotate-180 transition">⌄</span>
                  </summary>
                  <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </article>

      {bestFor && (
        <section className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">Curated list</div>
            <div className="font-bold text-amber-900">{bestFor.label}</div>
            <p className="text-xs text-amber-800 mt-0.5">Ranked by Trust Score — DBD-verified, Google-reviewed.</p>
          </div>
          <a href={`/best/${bestFor.slug}`}
             className="shrink-0 px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 transition">
            Browse ranked list →
          </a>
        </section>
      )}

      <section className="mt-16 bg-emerald-50/40 border border-emerald-100 rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-bold mb-4">Top suppliers right now</h2>
        <p className="text-sm text-[var(--muted)] mb-5">
          Highest Trust Scores across all categories — verified from public Google reviews.
        </p>
        <div className="grid gap-3">
          {topSuppliers.slice(0, 3).map((r, i) => (
            <SupplierCard key={r.id} r={r} rank={i + 1} />
          ))}
        </div>
        <a
          href="/best/highly-recommended"
          className="inline-block mt-4 text-sm font-bold text-emerald-700 hover:underline"
        >
          See full top 50 →
        </a>
      </section>

      {g.related && g.related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
            Related guides
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {g.related.map((relSlug) => {
              const rel = findGuide(relSlug);
              if (!rel) return null;
              return (
                <a
                  key={relSlug}
                  href={`/guide/${relSlug}`}
                  className="block p-4 bg-white border border-[var(--border)] rounded-xl hover:border-emerald-400 transition"
                >
                  <div className="font-bold text-sm mb-1 leading-tight">{rel.title}</div>
                  <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
                    {rel.metaDescription}
                  </p>
                </a>
              );
            })}
          </div>
        </section>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Buyer Guides", url: "/guide" },
        { name: g.title, url: `/guide/${slug}` },
      ]} />
      <FaqJsonLd faqs={g.faqs} lang="en" />
      {articleJsonLd(g)}
      {howToJsonLd(g)}
    </div>
  );
}
