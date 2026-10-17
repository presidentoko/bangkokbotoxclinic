import { GUIDES, type Guide } from "@/lib/guides";
import { BEST_FOR } from "@/lib/bestFor";
import { loadMasterDb } from "@/lib/data";
import { GuideDepth } from "@/components/GuideDepth";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Find Factories in Thailand — Sourcing Guides & Supplier Data",
  description:
    "How to find and vet a factory in Thailand: five steps, supplier counts by industry and province, DBD company checks, plus guides on industrial estates, auto parts, food, logistics and more.",
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

// 가이드를 주제별로 묶는다. 목록에 없는 새 가이드는 "By industry" 로 간다.
const GROUPS: { title: string; slugs: string[] }[] = [
  { title: "Getting started", slugs: ["sourcing-thai-suppliers-direct"] },
  {
    title: "Locations & logistics",
    slugs: ["eastern-seaboard-industrial-estates-compared", "map-ta-phut-petrochemical-cluster", "laem-chabang-warehouse-logistics", "thai-logistics-3pl-customs-guide"],
  },
];

function grouped(): { title: string; guides: Guide[] }[] {
  const placed = new Set(GROUPS.flatMap((g) => g.slugs));
  return [
    ...GROUPS.map((g) => ({ title: g.title, guides: GUIDES.filter((x) => g.slugs.includes(x.slug)) })),
    { title: "By industry", guides: GUIDES.filter((x) => !placed.has(x.slug)) },
  ].filter((g) => g.guides.length > 0);
}

export default async function GuideIndex() {
  const db = await loadMasterDb();
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Buyer Guides</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">How to Find Factories in Thailand</h1>
        <p className="text-base md:text-lg text-[var(--muted)] leading-relaxed text-balance">
          Buyer guides and live supplier data for sourcing from Thailand. No agency-promo content — just how the supplier ecosystem actually works.
        </p>
      </header>

      <GuideDepth db={db} />

      <h2 className="text-2xl font-bold mb-6">Buyer guides</h2>
      {grouped().map((grp) => (
        <section key={grp.title} className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)] mb-3">{grp.title}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
        {grp.guides.map((g) => (
          <a
            key={g.slug}
            href={`/guide/${g.slug}`}
            className="block p-6 bg-white border border-[var(--border)] rounded-xl hover:border-emerald-400 hover:shadow-md transition group"
          >
            <h4 className="font-bold text-lg leading-snug mb-2 group-hover:text-emerald-700 transition">
              {g.title}
            </h4>
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
        </section>
      ))}

      <div className="mt-10 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">Curated lists</div>
          <div className="font-bold text-amber-900">{BEST_FOR.length} ranked supplier lists</div>
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
