import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { districtsForBuild, districtBySlug, suppliersInDistrict } from "@/lib/districts";
import { SupplierCard } from "@/components/SupplierCard";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { sortWithSponsored } from "@/lib/sponsored";
import type { Metadata } from "next";

export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await loadMasterDb();
  return districtsForBuild(db).map((g) => ({ district: g.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ district: string }> }
): Promise<Metadata> {
  const { district } = await params;
  const db = await loadMasterDb();
  const group = districtBySlug(db, district);
  const districtName = group?.display ?? district;
  return {
    title: `Suppliers in ${districtName} — Verified B2B Directory`,
    description: `Manufacturers, warehouses, and industrial operators in ${districtName} with Trust Scores from real Google reviews.`,
    alternates: { canonical: `/d/${district}` },
  };
}

export default async function DistrictPage(
  { params }: { params: Promise<{ district: string }> }
) {
  const { district } = await params;
  const db = await loadMasterDb();
  const group = districtBySlug(db, district);
  if (!group) notFound();
  const districtName = group.display;

  const filtered = sortWithSponsored(suppliersInDistrict(db, district));

  // Category facets within district
  const catMap = new Map<string, number>();
  for (const r of filtered) {
    for (const c of r.categories) catMap.set(c, (catMap.get(c) ?? 0) + 1);
  }
  const cats = [...catMap.entries()].filter(([, n]) => n >= 1).sort((a, b) => b[1] - a[1]);
  const cityLabel = group.cityLabel;
  const citySlug = group.citySlug;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        {cityLabel && (
          <>
            <span className="mx-2">›</span>
            <a href={`/city/${citySlug}`} className="hover:text-[var(--fg)]">{cityLabel}</a>
          </>
        )}
        <span className="mx-2">›</span>
        <span>{districtName}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        Suppliers in {districtName}
      </h1>
      <p className="text-[var(--muted)] mb-8">
        {filtered.length.toLocaleString()} verified suppliers in {districtName}{cityLabel ? `, ${cityLabel}` : ""} — ranked by Trust Score.
      </p>

      {cats.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">By Type</h2>
          <div className="flex flex-wrap gap-2">
            {cats.slice(0, 16).map(([c, n]) => (
              <a
                key={c}
                href={`/c/${c}/${district}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 transition"
              >
                <span aria-hidden>{CATEGORY_ICONS[c] ?? "🏭"}</span>
                {CATEGORY_LABELS[c] ?? c}
                <span className="text-[var(--muted)] tabular-nums">{n}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-3">
        {filtered.slice(0, 10).map((r, i) => (
          <SupplierCard key={r.id} r={r} rank={i + 1} />
        ))}
      </div>
      <AffiliateInline district={districtName} />
      <AdSlot slot="district-mid" />
      <div className="grid gap-3 mt-3">
        {filtered.slice(10, 200).map((r, i) => (
          <SupplierCard key={r.id} r={r} rank={i + 11} />
        ))}
      </div>
      {filtered.length > 200 && (
        <p className="mt-6 text-sm text-[var(--muted)]">
          Showing top 200 of {filtered.length.toLocaleString()}. Use category filters above to narrow.
        </p>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        ...(cityLabel ? [{ name: cityLabel, url: `/city/${citySlug}` }] : []),
        { name: districtName, url: `/d/${district}` },
      ]} />
      <ItemListJsonLd
        name={`Suppliers in ${districtName}`}
        items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: `/supplier/${r.id}` }))}
      />
    </div>
  );
}
