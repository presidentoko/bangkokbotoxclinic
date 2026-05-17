import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { ClinicCardCompact } from "@/components/ClinicCardCompact";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { AffiliateInline } from "@/components/AffiliateSlot";
import { BookingForm } from "@/components/BookingForm";
import { BEST_FOR, findBestFor } from "@/lib/bestFor";
import { applySiteFilter, getSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return BEST_FOR.map((c) => ({ criterion: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ criterion: string }> }
): Promise<Metadata> {
  const { criterion } = await params;
  const cfg = findBestFor(criterion);
  if (!cfg) return { title: "Not found" };
  return {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    alternates: { canonical: `/best/${cfg.slug}` },
  };
}

export default async function BestForPage(
  { params }: { params: Promise<{ criterion: string }> }
) {
  const { criterion } = await params;
  const cfg = findBestFor(criterion);
  if (!cfg) notFound();

  const site = getSiteConfig();
  const db = await loadMasterDb();
  const focused = applySiteFilter(db.clinics, site);

  const filtered = focused
    .filter((c) => !cfg.filterFn || cfg.filterFn(c))
    .map((c) => ({ ...c, _score: cfg.scoreFn(c) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, 50);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Best</span>
        <span className="mx-2">›</span>
        <span>{cfg.title.replace(/^Best |^Most |^Bangkok /, "")}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
        {cfg.title}
      </h1>
      <p className="text-[var(--muted)] mb-2">
        {cfg.intro}
      </p>
      <p className="text-xs text-[var(--muted)] mb-8 italic">
        {filtered.length} clinics matched. Last refreshed from public Google reviews — see methodology on{" "}
        <a href="/about" className="underline">/about</a>.
      </p>

      {filtered.length === 0 ? (
        <p className="text-[var(--muted)]">No clinics matched this criterion yet. Data refreshes every 30 minutes.</p>
      ) : (
        <>
          <section>
            <div className="grid gap-3">
              {filtered.slice(0, 10).map((c, i) => (
                <ClinicCard key={c.id} clinic={c} rank={i + 1} />
              ))}
            </div>
            <AffiliateInline />
            {filtered.length > 10 && (
              <div className="mt-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-3">
                  #11 – #{filtered.length} · runner-up rankings
                </h3>
                <div className="grid gap-1.5">
                  {filtered.slice(10).map((c, i) => (
                    <ClinicCardCompact key={c.id} clinic={c} rank={i + 11} />
                  ))}
                </div>
              </div>
            )}
          </section>

          <div className="my-8">
            <BookingForm />
          </div>

          <section className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
              Other ways to find a clinic
            </h2>
            <div className="flex flex-wrap gap-2">
              {BEST_FOR.filter((x) => x.slug !== cfg.slug).map((x) => (
                <a
                  key={x.slug}
                  href={`/best/${x.slug}`}
                  className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  {x.title.replace(/^Best Bangkok |^Bangkok |^Most /, "").replace(/Aesthetic Clinics?|Clinics?/, "").trim()}
                </a>
              ))}
            </div>
          </section>
        </>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: cfg.title, url: `/best/${cfg.slug}` },
      ]} />
      <ItemListJsonLd
        name={cfg.title}
        items={filtered.slice(0, 20).map((c) => ({
          name: c.name,
          url: `/clinic/${c.id}`,
        }))}
      />
    </div>
  );
}
