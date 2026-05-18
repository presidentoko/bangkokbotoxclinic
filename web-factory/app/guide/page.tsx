import { GUIDES } from "@/lib/guides";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buyer Guides — Thai Sourcing, Industrial Estates, Logistics",
  description:
    "Practical guides for B2B buyers sourcing from Thailand. Direct sourcing process, industrial estate comparison, Map Ta Phut petrochemical, auto parts ecosystem, Laem Chabang logistics.",
  alternates: {
    canonical: "/guide",
    languages: {
      "en-US": "/guide",
      "ko-KR": "/ko/guide",
      "x-default": "/guide",
    },
  },
};

export default function GuideIndex() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Buyer Guides</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Buyer Guides</h1>
        <p className="text-base md:text-lg text-[var(--muted)] leading-relaxed text-balance">
          Practical guides for B2B buyers sourcing from Thailand. No fluff, no agency-promo content — just how the supplier ecosystem actually works.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {GUIDES.map((g) => (
          <a
            key={g.slug}
            href={`/guide/${g.slug}`}
            className="block p-6 bg-white border border-[var(--border)] rounded-xl hover:border-emerald-400 hover:shadow-md transition group"
          >
            <h2 className="font-bold text-lg leading-snug mb-2 group-hover:text-emerald-700 transition">
              {g.title}
            </h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-3">
              {g.metaDescription}
            </p>
            <div className="mt-3 text-xs text-[var(--muted)] flex items-center gap-2">
              <span>Updated {g.updated}</span>
              <span>·</span>
              <span>{g.sections.length} sections</span>
              <span>·</span>
              <span>{g.faqs.length} FAQs</span>
            </div>
          </a>
        ))}
      </div>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Buyer Guides", url: "/guide" },
      ]} />
      <ItemListJsonLd
        name="Thai Supply Hub — Buyer Guides"
        items={GUIDES.map((g) => ({ name: g.title, url: `/guide/${g.slug}` }))}
      />
    </div>
  );
}
