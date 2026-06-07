import { BEST_FOR } from "@/lib/bestFor";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Thai Suppliers — Ranked by Category & Buyer Signals",
  description:
    "Curated lists of Thailand's top B2B suppliers by category. DBD-verified manufacturers, industrial estate tenants, export-ready companies, BOI-eligible factories — ranked by real buyer review signals.",
  alternates: {
    canonical: "/best",
    languages: {
      "en-US": "/best",
      "ko-KR": "/ko/best",
      "x-default": "/best",
    },
  },
};

const ICONS: Record<string, string> = {
  "highly-recommended": "🏆",
  "industrial-estates": "🏘",
  "auto-parts": "🚗",
  "warehouses": "🏪",
  "manufacturers": "🏭",
  "with-website": "🌐",
  "near-laem-chabang": "🚢",
  "dbd-verified-by-capital": "💰",
  "competitive-price": "💲",
  "on-time-delivery": "⏱",
  "food-manufacturers": "🍜",
  "electronics-manufacturers": "💡",
  "export-ready": "📦",
  "boi-eligible": "⭐",
};

export default function BestIndexPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Best of</span>
      </nav>

      <header className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
          🏆 {BEST_FOR.length} curated lists
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Best Thai Suppliers
        </h1>
        <p className="text-base md:text-lg text-[var(--muted)] leading-relaxed text-balance">
          Curated, buyer-signal-ranked supplier lists for each sourcing need. Sourced from DBD registry data and real Google reviews — no agency promotion.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BEST_FOR.map((c) => (
          <a
            key={c.slug}
            href={`/best/${c.slug}`}
            className="group block p-5 bg-white border border-[var(--border)] rounded-xl hover:border-emerald-400 hover:shadow-md transition"
          >
            <div className="text-2xl mb-2">{ICONS[c.slug] ?? "🏭"}</div>
            <h2 className="font-bold text-base leading-snug mb-2 group-hover:text-emerald-700 transition">
              {c.title}
            </h2>
            <p className="text-xs text-[var(--muted)] leading-relaxed line-clamp-3">
              {c.metaDescription}
            </p>
            <div className="mt-3 text-xs text-emerald-700 font-medium group-hover:underline">
              Browse list →
            </div>
          </a>
        ))}
      </div>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Best of", url: "/best" },
      ]} />
      <ItemListJsonLd
        name="Best Thai Suppliers — Curated Lists"
        items={BEST_FOR.map((c) => ({ name: c.title, url: `/best/${c.slug}` }))}
      />
    </div>
  );
}
