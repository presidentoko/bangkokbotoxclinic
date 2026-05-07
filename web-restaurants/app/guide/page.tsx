import { GUIDES } from "@/lib/guides";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bangkok Food Guides — Where Locals Actually Eat",
  description:
    "Practical Bangkok food guides — Thai districts, Korean food, rooftop dining. No tourist traps, no influencer placements.",
  alternates: { canonical: "/guide" },
};

export const dynamic = "force-static";

export default function GuideIndexPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Guides</span>
      </nav>

      <h1 className="text-4xl font-bold tracking-tight mb-3">Bangkok Food Guides</h1>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-10 max-w-2xl">
        No-fluff guides written by editors who actually eat in Bangkok. No paid placements, no influencer talking points — just what you need to know before you book.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {GUIDES.map((g) => (
          <a
            key={g.slug}
            href={`/guide/${g.slug}`}
            className="group block p-6 border border-[var(--border)] rounded-2xl bg-white hover:border-[var(--accent)] hover:shadow-md transition"
          >
            <h2 className="text-lg font-bold leading-tight group-hover:text-[var(--accent)] transition">
              {g.title.replace(/ \(\d{4}\)$/, "")}
            </h2>
            <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">{g.metaDescription}</p>
            <div className="mt-3 text-xs text-[var(--muted)]">Updated {g.updated}</div>
          </a>
        ))}
      </div>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Guides", url: "/guide" },
      ]} />
    </div>
  );
}
