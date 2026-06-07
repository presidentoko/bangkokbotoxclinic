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
      "th-TH": "/th/guide",
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

      <div className="mt-10 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">Curated lists</div>
          <div className="font-bold text-amber-900">14 ranked supplier lists</div>
          <p className="text-xs text-amber-800 mt-0.5">By sector, estate, export status — ranked by Trust Score.</p>
        </div>
        <a href="/best" className="shrink-0 px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 transition">
          Browse all lists →
        </a>
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
