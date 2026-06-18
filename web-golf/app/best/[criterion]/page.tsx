import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { BEST_FOR, findBestFor } from "@/lib/bestFor";
import { sortWithSponsored } from "@/lib/sponsored";
import type { Metadata } from "next";

export const revalidate = 604800; // 7 days — course data refreshes weekly

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
    alternates: {
      canonical: `/best/${cfg.slug}`,
      languages: {
        "x-default": `/best/${cfg.slug}`,
        "en-US": `/best/${cfg.slug}`,
        ...(cfg.slug === "korean-friendly" ? { "ko-KR": "/ko/best/korean-friendly" } : {}),
      },
    },
  };
}

export default async function BestForPage(
  { params }: { params: Promise<{ criterion: string }> }
) {
  const { criterion } = await params;
  const cfg = findBestFor(criterion);
  if (!cfg) notFound();

  const db = await loadMasterDb();
  const filtered = sortWithSponsored(
    db.restaurants
      .filter((r) => !cfg.filterFn || cfg.filterFn(r))
      .map((r) => ({ ...r, _score: cfg.scoreFn(r) }))
      .sort((a, b) => b._score - a._score)
      .slice(0, 50)
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Best</span>
        <span className="mx-2">›</span>
        <span>{cfg.title.replace(/^Best |^Most /, "").replace(/ in Thailand$/, "")}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{cfg.title}</h1>
      <p className="text-[var(--muted)] mb-2">{cfg.intro}</p>
      <p className="text-xs text-[var(--muted)] mb-8 italic">
        {filtered.length} courses matched. Refreshed continuously from public Google reviews.
      </p>

      {filtered.length === 0 ? (
        <p className="text-[var(--muted)]">No courses matched this criterion yet.</p>
      ) : (
        <>
          <section>
            <div className="grid gap-3">
              {filtered.slice(0, 10).map((r, i) => (
                <RestaurantCard key={r.id} r={r} rank={i + 1} />
              ))}
            </div>
            <AffiliateInline />
            <AdSlot slot="best-for-mid" />
            <div className="grid gap-3 mt-3">
              {filtered.slice(10).map((r, i) => (
                <RestaurantCard key={r.id} r={r} rank={i + 11} />
              ))}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
              Other ways to find a course
            </h2>
            <div className="flex flex-wrap gap-2">
              {BEST_FOR.filter((x) => x.slug !== cfg.slug).map((x) => (
                <a
                  key={x.slug}
                  href={`/best/${x.slug}`}
                  className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
                >
                  {x.title.replace(/^Best Bangkok |^Bangkok |^Most |^Bangkok's /, "").replace(/Courses?|Golf /g, "").trim()}
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
        items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: `/course/${r.id}` }))}
      />
    </div>
  );
}
