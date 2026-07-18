import { notFound } from "next/navigation";
import { GUIDES, findGuide } from "@/lib/guides";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { loadMasterDb, topByTrust } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import { BEST_FOR } from "@/lib/bestFor";
import { GenericShareButton } from "@/components/ShareButton";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.snsstopper.com";

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
      type: "article",
      title: g.title,
      description: g.metaDescription,
      publishedTime: g.updated,
      modifiedTime: g.updated,
      siteName: "SNS Stopper",
      url: `/guide/${slug}`,
    },
    twitter: {
      card: "summary",
      title: g.metaTitle,
      description: g.metaDescription,
    },
  };
}

export default async function GuidePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const g = findGuide(slug);
  if (!g) notFound();

  const db = await loadMasterDb();
  const featured = topByTrust(db.restaurants, 6);
  const related = (g.related ?? []).map((s) => findGuide(s)).filter(Boolean);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.metaDescription,
    datePublished: g.updated,
    dateModified: g.updated,
    publisher: { "@type": "Organization", name: "SNS Stopper", url: SITE },
    author: { "@type": "Organization", name: "SNS Stopper Editorial" },
    mainEntityOfPage: `${SITE}/guide/${g.slug}`,
  };

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href="/guide" className="hover:text-[var(--fg)]">Guides</a>
        <span className="mx-2">›</span>
        <span>{g.title.replace(/ \(\d{4}\)$/, "")}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-balance">
          {g.title}
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed">{g.intro}</p>
        <p className="text-xs text-[var(--muted)] mt-3 italic">
          Updated {g.updated} · Editorial · Independent of any restaurant
        </p>
        <div className="mt-4">
          <GenericShareButton
            title={g.title}
            text={g.metaDescription}
            url={`/guide/${g.slug}`}
            label="Share this guide"
          />
        </div>
      </header>

      <AdSlot slot="guide-top" />

      <div className="prose prose-sm max-w-none mt-8 space-y-8">
        {g.sections.map((s, i) => (
          <section key={i}>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-3 mt-2">{s.heading}</h2>
            <p className="text-base leading-relaxed text-[var(--fg)] whitespace-pre-line">{s.body}</p>
          </section>
        ))}
      </div>

      <AffiliateInline />

      {g.faqs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Frequently asked</h2>
          <div className="space-y-3">
            {g.faqs.map((f, i) => (
              <details key={i} className="bg-white border border-[var(--border)] rounded-lg p-4 group">
                <summary className="font-medium cursor-pointer flex items-center justify-between gap-3">
                  <span>{f.q}</span>
                  <span className="text-[var(--muted)] group-open:rotate-180 transition">⌄</span>
                </summary>
                <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed whitespace-pre-line">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">Top-rated restaurants right now</h2>
          <p className="text-sm text-[var(--muted)] mb-4">
            Highest Trust Score restaurants — based on real Google review analysis.
          </p>
          <div className="grid gap-3">
            {featured.slice(0, 3).map((r, i) => (
              <RestaurantCard key={r.id} r={r} rank={i + 1} />
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12 border-t border-[var(--border)] pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-4">
            Related guides
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {related.map((r) => r && (
              <a
                key={r.slug}
                href={`/guide/${r.slug}`}
                className="block p-4 border border-[var(--border)] rounded-xl bg-white hover:border-[var(--accent)] transition"
              >
                <div className="font-medium leading-tight">{r.title.replace(/ — .*$/, "")}</div>
                <p className="text-xs text-[var(--muted)] mt-1">{r.metaDescription.slice(0, 100)}…</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12 border-t border-[var(--border)] pt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-4">Browse by category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {BEST_FOR.slice(0, 6).map((b) => (
            <a
              key={b.slug}
              href={`/best/${b.slug}`}
              className="text-sm px-3 py-2 border border-[var(--border)] rounded-lg bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition truncate"
            >
              {b.title.replace(/^(Best Bangkok |Bangkok's Top |Most |Bangkok )/i, "")}
            </a>
          ))}
        </div>
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Guides", url: "/guide" },
        { name: g.title, url: `/guide/${g.slug}` },
      ]} />
      <FaqJsonLd faqs={g.faqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }}
      />
    </article>
  );
}
