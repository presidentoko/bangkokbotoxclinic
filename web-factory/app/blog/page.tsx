import { POSTS } from "@/lib/posts";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Thai Sourcing Insights & Market Notes",
  description:
    "Short reads on Thai manufacturing — Eastern Seaboard, sourcing agent economics, Korean SME entry, Map Ta Phut petrochemical, Verified Supplier methodology.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const sorted = [...POSTS].sort((a, b) => b.published.localeCompare(a.published));

  // Group by category
  const byCategory = new Map<string, typeof POSTS>();
  for (const p of sorted) {
    const arr = byCategory.get(p.category) ?? [];
    arr.push(p);
    byCategory.set(p.category, arr);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Blog</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Blog</h1>
        <p className="text-base md:text-lg text-[var(--muted)] leading-relaxed text-balance">
          Short reads on Thai manufacturing — sourcing economics, industry geography, methodology notes.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {sorted.map((p) => (
          <a
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="block p-6 bg-white border border-[var(--border)] rounded-xl hover:border-emerald-400 hover:shadow-md transition group"
          >
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-2">
              {p.category}
            </div>
            <h2 className="font-bold text-lg leading-snug mb-2 group-hover:text-emerald-700 transition">
              {p.title}
            </h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-3">
              {p.metaDescription}
            </p>
            <div className="mt-3 text-xs text-[var(--muted)]">
              <time dateTime={p.published}>{p.published}</time>
            </div>
          </a>
        ))}
      </div>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Blog", url: "/blog" },
      ]} />
      <ItemListJsonLd
        name="Thai Supply Hub — Blog Posts"
        items={sorted.map((p) => ({ name: p.title, url: `/blog/${p.slug}` }))}
      />
    </div>
  );
}
