import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { SupplierCard } from "@/components/SupplierCard";
import { BreadcrumbJsonLd, ItemListJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { BEST_FOR, findBestFor } from "@/lib/bestFor";
import { sortWithSponsored } from "@/lib/sponsored";
import { findGuide } from "@/lib/guides";
import { findPost } from "@/lib/posts";
import { ShareButton } from "@/components/ShareButton";
import { SupplierAlertSignup } from "@/components/SupplierAlertSignup";
import type { Metadata } from "next";

const CRITERION_TO_POST: Record<string, string> = {
  "boi-eligible": "thailand-boi-explained",
  "industrial-estates": "eastern-seaboard-by-the-numbers",
  "near-laem-chabang": "eastern-seaboard-by-the-numbers",
  "auto-parts": "chon-buri-vs-rayong-manufacturing",
  "manufacturers": "sourcing-agent-markup-real-cost",
  "highly-recommended": "verified-supplier-what-we-check",
};

const CRITERION_TO_GUIDE: Record<string, string> = {
  "highly-recommended": "sourcing-thai-suppliers-direct",
  "industrial-estates": "eastern-seaboard-industrial-estates-compared",
  "auto-parts": "thai-auto-parts-tier1-tier2",
  "warehouses": "laem-chabang-warehouse-logistics",
  "manufacturers": "sourcing-thai-suppliers-direct",
  "near-laem-chabang": "laem-chabang-warehouse-logistics",
  "dbd-verified-by-capital": "eastern-seaboard-industrial-estates-compared",
  "food-manufacturers": "thai-food-manufacturer-haccp-export",
  "electronics-manufacturers": "thai-electronics-manufacturer-hdd-ems",
  "export-ready": "thai-logistics-3pl-customs-guide",
  "boi-eligible": "eastern-seaboard-industrial-estates-compared",
};

export const dynamicParams = false;

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

  const db = await loadMasterDb();
  const filtered = sortWithSponsored(
    db.suppliers
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
        <a href="/best" className="hover:text-[var(--fg)]">Best of</a>
        <span className="mx-2">›</span>
        <span>{cfg.title.replace(/^Best |^Top |^Most /, "").replace(/ in Thailand$/, "")}</span>
      </nav>

      <div className="flex items-start justify-between gap-4 mb-3">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{cfg.title}</h1>
        <div className="shrink-0 mt-1">
          <ShareButton
            url={`/best/${criterion}`}
            title={`${cfg.title} — Thailand Supplier Rankings`}
            variant="compact"
          />
        </div>
      </div>
      <p className="text-[var(--muted)] mb-2 leading-relaxed text-balance">{cfg.intro}</p>
      <p className="text-xs text-[var(--muted)] mb-8 italic">
        {filtered.length} suppliers matched. Refreshed continuously from public Google reviews.
      </p>

      {filtered.length === 0 ? (
        <p className="text-[var(--muted)]">No suppliers matched this criterion yet — check back after the next data refresh.</p>
      ) : (
        <>
          <section>
            <div className="grid gap-3">
              {filtered.slice(0, 10).map((r, i) => (
                <SupplierCard key={r.id} r={r} rank={i + 1} />
              ))}
            </div>
            <AffiliateInline />
            <AdSlot slot="best-for-mid" />
            <div className="my-6">
              <SupplierAlertSignup category={cfg.title.replace(/^Best |^Top |^Most /, "").replace(/ in Thailand$/, "")} compact />
            </div>
            <div className="grid gap-3 mt-3">
              {filtered.slice(10).map((r, i) => (
                <SupplierCard key={r.id} r={r} rank={i + 11} />
              ))}
            </div>
          </section>

          {(() => {
            const guideSlug = CRITERION_TO_GUIDE[criterion];
            const guide = guideSlug ? findGuide(guideSlug) : null;
            if (!guide) return null;
            return (
              <a
                href={`/guide/${guide.slug}`}
                className="block mt-10 p-5 bg-emerald-50/40 border border-emerald-200 rounded-xl hover:border-emerald-400 hover:shadow-md transition group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl shrink-0">📖</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-1">Buyer guide</div>
                    <h2 className="font-bold text-lg leading-snug mb-1 group-hover:text-emerald-700 transition">
                      {guide.title}
                    </h2>
                    <p className="text-sm text-[var(--muted)] line-clamp-2">{guide.metaDescription}</p>
                  </div>
                  <span className="text-emerald-700 group-hover:translate-x-1 transition shrink-0 self-center text-xl">→</span>
                </div>
              </a>
            );
          })()}

          {(() => {
            const postSlug = CRITERION_TO_POST[criterion];
            const post = postSlug ? findPost(postSlug) : null;
            if (!post) return null;
            return (
              <a
                href={`/blog/${post.slug}`}
                className="block mt-6 p-4 bg-stone-50 border border-stone-200 rounded-xl hover:border-stone-400 hover:shadow-sm transition group"
              >
                <div className="flex items-start gap-3">
                  <div className="text-lg shrink-0">📝</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-0.5">Blog post</div>
                    <div className="font-bold text-sm leading-snug mb-1 group-hover:text-emerald-700 transition">{post.title}</div>
                    <p className="text-xs text-[var(--muted)] line-clamp-1">{post.metaDescription}</p>
                  </div>
                  <span className="text-stone-400 shrink-0 self-center">→</span>
                </div>
              </a>
            );
          })()}

          <section className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
              Other ways to find a supplier
            </h2>
            <div className="flex flex-wrap gap-2">
              {BEST_FOR.filter((x) => x.slug !== cfg.slug).map((x) => (
                <a
                  key={x.slug}
                  href={`/best/${x.slug}`}
                  className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  {x.title.replace(/^Best |^Top |^Most /, "").replace(/ in Thailand$/, "").trim()}
                </a>
              ))}
            </div>
          </section>
        </>
      )}

      <CollectionPageJsonLd
        name={cfg.title}
        description={cfg.metaDescription}
        url={`/best/${cfg.slug}`}
        numberOfItems={filtered.length}
      />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Best of", url: "/best" },
        { name: cfg.title, url: `/best/${cfg.slug}` },
      ]} />
      <ItemListJsonLd
        name={cfg.title}
        description={cfg.intro}
        items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: `/supplier/${r.id}` }))}
      />
    </div>
  );
}
