import type { Metadata } from "next";
import { getAllPlacesServer } from "@/lib/places-server";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { CATEGORY_LABEL } from "@/lib/places";
import type { Category } from "@/lib/places";
import { PLACE_TREE_INDEXABLE } from "@/lib/placeIndexing";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "All Verified Bangkok Places — Full Index",
  description:
    "Every Bangkok venue with a Thaigle verification page: restaurants, gyms, spas, cooking classes and wellness studios, checked against real Google review data rather than influencer posts.",
  alternates: { canonical: "/en/place" },
  // Follows the tree it indexes. The detail pages went noindex (see
  // PLACE_TREE_INDEXABLE) but this hub kept "index, follow", so the one page
  // whose entire purpose is to list 1,647 thin pages was still inviting
  // Google to rank it. follow stays on: the crawler should still walk through
  // to read each page's own noindex.
  ...(PLACE_TREE_INDEXABLE ? {} : { robots: { index: false, follow: true } }),
};

/**
 * Crawl path for the /en/place/* tree.
 *
 * Those 1,647 pages were reopened to search (see lib/placeIndexing.ts) and
 * re-listed in sitemap.xml, but the only page that linked into them was /en,
 * which is itself noindex — so a crawler had no route in and the tree would
 * have sat in "Discovered - currently not indexed" regardless of robots.txt.
 * A sitemap entry is a hint; an inbound link is the actual path.
 */
export default async function PlaceIndexPage() {
  const places = await getAllPlacesServer();

  const byCategory = new Map<Category, typeof places>();
  for (const p of places) {
    if (!byCategory.has(p.category)) byCategory.set(p.category, []);
    byCategory.get(p.category)!.push(p);
  }
  const groups = [...byCategory.entries()].sort((a, b) => b[1].length - a[1].length);

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Thaigle", url: "/" },
        { name: "Verified places", url: "/en/place" },
      ]} />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-sm text-[var(--muted)] mb-4">
          <a href="/" className="hover:text-[var(--fg)]">Home</a>
          <span className="mx-2">›</span>
          <span>Verified places</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          All {places.length.toLocaleString()} Verified Places
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed mb-8 max-w-2xl">
          Every Bangkok venue with a verification page — what the review data actually says about a
          place, as opposed to what a sponsored post claims. Grouped by type.
        </p>

        {groups.map(([category, list]) => (
          <section key={category} className="mb-10">
            <h2 className="text-sm font-black uppercase tracking-widest text-[var(--muted)] mb-3">
              {CATEGORY_LABEL[category] ?? category} · {list.length}
            </h2>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
              {list.map((p) => (
                <li key={p.slug} className="border-b border-[var(--border)] last:border-0">
                  <a
                    href={`/en/place/${encodeURIComponent(p.slug)}`}
                    className="flex items-baseline justify-between gap-3 py-2 min-h-[44px] hover:text-orange-600 transition"
                  >
                    <span className="text-sm leading-snug">{p.name}</span>
                    <span className="shrink-0 text-xs text-[var(--muted)]">{p.area}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
