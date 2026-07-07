import { loadMasterDb, filterByCategory } from "@/lib/data";
import { applySiteFilter, getSiteConfig, FOCUS_VALID } from "@/lib/site";
import { CATEGORY_LABELS } from "@/lib/types";
import { CategoryIcon } from "@/components/CategoryIcon";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const ALL_SERVICES = ["botox", "filler", "hifu", "facial", "laser", "dental", "hair_transplant", "eye"];

export const dynamic = "force-static";

export function generateMetadata(): Metadata {
  const cfg = getSiteConfig();
  return {
    title: `Browse Clinics by Category — ${cfg.brand}`,
    description: `Browse all clinic categories on ${cfg.brand}, ranked by Trust Score from verified Google reviews.`,
    alternates: { canonical: "/c" },
  };
}

export default async function CategoryHubPage() {
  const cfg = getSiteConfig();
  const focusValid = FOCUS_VALID[cfg.focus];
  const services = focusValid ? ALL_SERVICES.filter((s) => focusValid.has(s)) : ALL_SERVICES;

  const db = await loadMasterDb();
  const scoped = applySiteFilter(db.clinics, cfg);
  const counts = services.map((service) => ({
    service,
    label: CATEGORY_LABELS[service] ?? service,
    count: filterByCategory(scoped, service).length,
  })).filter((s) => s.count > 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Browse</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Browse by category</h1>
      <p className="text-[var(--muted)] mb-8">
        {counts.reduce((s, c) => s + c.count, 0)} clinics across {counts.length} categories, ranked by Trust Score.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {counts.map((c) => (
          <a
            key={c.service}
            href={`/c/${c.service}`}
            className="flex flex-col items-center gap-2 border border-[var(--border)] rounded-xl p-5 text-center hover:border-[var(--accent)] hover:bg-emerald-50/40 transition"
          >
            <CategoryIcon category={c.service} size={28} />
            <span className="font-semibold text-sm">{c.label}</span>
            <span className="text-xs text-[var(--muted)]">{c.count} clinics</span>
          </a>
        ))}
      </div>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Browse", url: "/c" },
      ]} />
    </div>
  );
}
