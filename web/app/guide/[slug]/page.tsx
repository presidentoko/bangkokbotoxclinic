import { notFound } from "next/navigation";
import { GUIDES, findGuide, proceduresForGuide } from "@/lib/guides";
import { BreadcrumbJsonLd, FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { AffiliateInline } from "@/components/AffiliateSlot";
import { loadMasterDb, topByTrust } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { applySiteFilter, getSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bangkokbotoxclinic.com";

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
    },
  };
}

export default async function GuidePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const g = findGuide(slug);
  if (!g) notFound();

  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const focused = applySiteFilter(db.clinics, cfg);
  const featured = topByTrust(focused, 3);
  const related = (g.related ?? []).map((s) => findGuide(s)).filter(Boolean);

  const PROC_LABELS: Record<string, string> = {
    implants:  "Dental Implants",
    veneers:   "Dental Veneers",
    whitening: "Teeth Whitening",
    botox:     "Botox",
    filler:    "Dermal Fillers",
    hifu:      "HIFU Skin Lifting",
    hair:      "Hair Transplant",
  };
  const procedureLinks = proceduresForGuide(g).map((proc) => ({
    href: `/city/bangkok/${proc}`,
    label: `${PROC_LABELS[proc] ?? proc} clinics in Bangkok`,
  }));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.metaDescription,
    datePublished: g.updated,
    dateModified: g.updated,
    publisher: { "@type": "Organization", name: cfg.brand, url: SITE },
    author: { "@type": "Organization", name: `${cfg.brand} Editorial` },
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
          Updated {g.updated} · Editorial · Independent of any clinic
        </p>
      </header>

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
          <h2 className="text-xl font-bold mb-4">Top-Trust clinics right now</h2>
          <p className="text-sm text-[var(--muted)] mb-4">
            Highest Trust Score clinics — based on real Google review analysis.
          </p>
          <div className="grid gap-3">
            {featured.slice(0, 3).map((c, i) => (
              <ClinicCard key={c.id} clinic={c} rank={i + 1} />
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

          {procedureLinks.length > 0 && (
            <section className="mt-8 p-5 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
              <h2 className="text-base font-semibold mb-3">Browse clinics</h2>
              <div className="space-y-2">
                {procedureLinks.map((pl) => (
                  <a
                    key={pl.href}
                    href={pl.href}
                    className="flex items-center gap-2 text-sm text-[var(--accent)] hover:underline"
                  >
                    <span className="text-[var(--muted)] text-xs">→</span>
                    {pl.label}
                  </a>
                ))}
              </div>
            </section>
          )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Guides", url: "/guide" },
        { name: g.title, url: `/guide/${g.slug}` },
      ]} />
      <FaqJsonLd faqs={g.faqs} />
      {/* HowTo schema — 가이드 sections 의 heading이 "Step N —" 또는 숫자로 시작하면
          step-by-step guide로 인식. 현재 verifying-clinic-before-booking이 7단계라 매치. */}
      {g.sections.length >= 3 && /^(step|단계|01|1\.|^\d+\s*[—-])/i.test(g.sections[0].heading) && (
        <HowToJsonLd
          name={g.title}
          description={g.metaDescription}
          url={`/guide/${g.slug}`}
          steps={g.sections.map((s) => ({
            name: s.heading.replace(/^(step\s*\d+\s*[—-]?\s*|단계\s*\d+\s*[—-]?\s*|^\d+\.?\s*[—-]?\s*)/i, "").trim(),
            text: s.body.length > 500 ? s.body.slice(0, 497) + "..." : s.body,
          }))}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </article>
  );
}
