import { notFound } from "next/navigation";
import { loadMasterDb, filterByCategory, filterByDistrict } from "@/lib/data";
import { SupplierCard } from "@/components/SupplierCard";
import { CATEGORY_LABELS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { sortWithSponsored } from "@/lib/sponsored";
import type { Metadata } from "next";

const VALID_CUISINES = new Set(Object.keys(CATEGORY_LABELS));

function districtFromSlug(slug: string, all: string[]): string | null {
  const target = slug.toLowerCase();
  return all.find((d) => d.toLowerCase().replace(/\s+/g, "-") === target) ?? null;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  // (category × district) 조합 중 supplier 5+ 있는 것만 prerender — thin content + 빌드 한도 절감.
  const counts = new Map<string, number>();
  for (const s of db.suppliers) {
    if (!s.district) continue;
    const dSlug = s.district.toLowerCase().replace(/\s+/g, "-");
    for (const cat of s.categories) {
      if (!VALID_CUISINES.has(cat)) continue;
      const key = `${cat}|${dSlug}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .filter(([, n]) => n >= 7)
    .map(([key]) => {
      const [cuisine, district] = key.split("|");
      return { cuisine, district };
    });
}

export async function generateMetadata(
  { params }: { params: Promise<{ cuisine: string; district: string }> }
): Promise<Metadata> {
  const { cuisine, district } = await params;
  const label = CATEGORY_LABELS[cuisine] ?? cuisine;
  const db = await loadMasterDb();
  const allDistricts = Array.from(new Set(
    Object.keys(db.district_counts).map((k) => k.split("/")[1])
  ));
  const districtName = districtFromSlug(district, allDistricts) ?? district;
  // thin content (1건 이하) cross-product 은 noindex — quality signal 보호.
  const matchCount = db.suppliers.filter((s) =>
    s.categories.includes(cuisine) &&
    s.district &&
    s.district.toLowerCase().replace(/\s+/g, "-") === district
  ).length;
  return {
    title: `${label} in ${districtName}, Thailand — Verified Suppliers`,
    description: `${label} suppliers in ${districtName}. Trust Scores from real Google review analysis. Direct contact info — no sourcing-agent middleman.`,
    alternates: { canonical: `/c/${cuisine}/${district}` },
    robots: matchCount < 2 ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function CategoryDistrictPage(
  { params }: { params: Promise<{ cuisine: string; district: string }> }
) {
  const { cuisine, district } = await params;
  if (!VALID_CUISINES.has(cuisine)) notFound();

  const db = await loadMasterDb();
  const allDistricts = Array.from(new Set(
    Object.keys(db.district_counts).map((k) => k.split("/")[1])
  ));
  const districtName = districtFromSlug(district, allDistricts);
  if (!districtName) notFound();

  const filtered = sortWithSponsored(filterByDistrict(filterByCategory(db.suppliers, cuisine), districtName));
  const label = CATEGORY_LABELS[cuisine] ?? cuisine;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href={`/c/${cuisine}`} className="hover:text-[var(--fg)]">{label}</a>
        <span className="mx-2">›</span>
        <span>{districtName}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        {label} in {districtName}
      </h1>
      <p className="text-[var(--muted)] mb-8">
        {filtered.length} {label.toLowerCase()} suppliers in {districtName} — sorted by Trust Score.
      </p>

      {filtered.length === 0 ? (
        <p className="text-[var(--muted)]">No matches in this district yet. Try a broader category or different district.</p>
      ) : (
        <>
          <div className="grid gap-3">
            {filtered.slice(0, 5).map((r, i) => (
              <SupplierCard key={r.id} r={r} rank={i + 1} />
            ))}
          </div>
          <AffiliateInline category={label} district={districtName} />
          <AdSlot slot="cuisine-district-mid" />
          <div className="grid gap-3 mt-3">
            {filtered.slice(5).map((r, i) => (
              <SupplierCard key={r.id} r={r} rank={i + 6} />
            ))}
          </div>
        </>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: label, url: `/c/${cuisine}` },
        { name: districtName, url: `/c/${cuisine}/${district}` },
      ]} />
      <ItemListJsonLd
        name={`${label} in ${districtName}`}
        items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: `/supplier/${r.id}` }))}
      />
    </div>
  );
}
