import { notFound } from "next/navigation";
import { loadMasterDb } from "@/lib/data";
import { districtsForBuild, districtBySlug, suppliersInDistrict, districtCategoryCombos, MIN_COMBO_SUPPLIERS } from "@/lib/districts";
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

  // Category facets within district — only categories with an actually-built /c/<cat>/<district> page.
  const combos = districtCategoryCombos(db);
  const cats = Array.from(combos.entries())
    .filter(([k, n]) => k.endsWith(`::${district}`) && n >= MIN_COMBO_SUPPLIERS)
    .map(([k, n]): [string, number] => [k.slice(0, k.length - district.length - 2), n])
    .sort((a, b) => b[1] - a[1]);
  const cityLabel = group.cityLabel;
  const citySlug = group.citySlug;
  const verifiedCount = filtered.filter((r) => r.verified).length;

  // Estate breakdown for this district
  const estateMap = new Map<string, { slug: string; count: number }>();
  for (const r of filtered) {
    if (r.estate_name && r.estate_slug) {
      const e = estateMap.get(r.estate_name) ?? { slug: r.estate_slug, count: 0 };
      e.count++;
      estateMap.set(r.estate_name, e);
    }
  }

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
      <div className="flex flex-wrap gap-2 mb-6 text-xs">
        <span className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full font-medium tabular-nums">
          {filtered.length.toLocaleString()} suppliers
        </span>
        {verifiedCount > 0 && (
          <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-medium tabular-nums">
            ✓ {verifiedCount.toLocaleString()} DBD-verified
          </span>
        )}
        {cityLabel && (
          <a href={`/city/${citySlug}`} className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full font-medium hover:bg-stone-200 transition">
            📍 {cityLabel}
          </a>
        )}
      </div>

      {estateMap.size > 0 && (
        <section className="mb-8 border border-emerald-200 rounded-2xl bg-emerald-50/30 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-800 mb-3">
            🏘 Industrial Estates
          </h2>
          <div className="flex flex-wrap gap-2">
            {Array.from(estateMap.entries())
              .sort((a, b) => b[1].count - a[1].count)
              .map(([name, { slug, count }]) => (
                <a key={slug} href={`/estate/${slug}`}
                   className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-300 bg-white text-sm hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 transition font-medium">
                  {name} <span className="text-emerald-600 tabular-nums">{count}</span>
                </a>
              ))}
          </div>
        </section>
      )}

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

      <div className="mt-10 flex flex-wrap gap-3 text-sm">
        {citySlug && cityLabel && (
          <a href={`/city/${citySlug}`} className="text-emerald-700 font-semibold hover:underline">
            All {cityLabel} suppliers →
          </a>
        )}
        <a href="/best" className="text-amber-700 font-semibold hover:underline">🏆 Curated lists →</a>
        <a href="/guide" className="text-stone-600 hover:underline">Buyer guides →</a>
      </div>

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
