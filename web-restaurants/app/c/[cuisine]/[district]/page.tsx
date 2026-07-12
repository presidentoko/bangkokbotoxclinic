import { notFound } from "next/navigation";
import { loadMasterDb, filterByCuisine, filterByDistrict } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CUISINE_LABELS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { sortWithSponsored } from "@/lib/sponsored";
import type { Metadata } from "next";

const VALID_CUISINES = new Set(Object.keys(CUISINE_LABELS));

function districtFromSlug(slug: string, all: string[]): string | null {
  const target = slug.toLowerCase();
  return all.find((d) => d.toLowerCase().replace(/\s+/g, "-") === target) ?? null;
}

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  const districts = Array.from(new Set(
    Object.keys(db.district_counts).map((k) => k.split("/")[1])
  ));
  const params: { cuisine: string; district: string }[] = [];
  for (const cuisine of VALID_CUISINES) {
    for (const d of districts) {
      params.push({ cuisine, district: d.toLowerCase().replace(/\s+/g, "-") });
    }
  }
  return params;
}

export async function generateMetadata(
  { params }: { params: Promise<{ cuisine: string; district: string }> }
): Promise<Metadata> {
  const { cuisine, district } = await params;
  const label = CUISINE_LABELS[cuisine] ?? cuisine;
  const db = await loadMasterDb();
  const allDistricts = Array.from(new Set(
    Object.keys(db.district_counts).map((k) => k.split("/")[1])
  ));
  const districtName = districtFromSlug(district, allDistricts) ?? district;
  return {
    title: `${label} Restaurants in ${districtName}, Bangkok`,
    description: `${label} restaurants in ${districtName}, Bangkok. Verified Trust Scores from real Google review analysis.`,
    alternates: { canonical: `/c/${cuisine}/${district}` },
  };
}

export default async function CuisineDistrictPage(
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

  const filtered = sortWithSponsored(filterByDistrict(filterByCuisine(db.restaurants, cuisine), districtName));
  if (filtered.length === 0) notFound();
  const label = CUISINE_LABELS[cuisine] ?? cuisine;

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
        {label} Restaurants in {districtName}
      </h1>
      <p className="text-[var(--muted)] mb-8">
        {filtered.length} {label.toLowerCase()} restaurants in {districtName} — sorted by Trust Score.
      </p>

      <div className="grid gap-3">
        {filtered.slice(0, 5).map((r, i) => (
          <RestaurantCard key={r.id} r={r} rank={i + 1} />
        ))}
      </div>
      <AffiliateInline category={label} district={districtName} />
      <AdSlot slot="cuisine-district-mid" />
      <div className="grid gap-3 mt-3">
        {filtered.slice(5).map((r, i) => (
          <RestaurantCard key={r.id} r={r} rank={i + 6} />
        ))}
      </div>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: label, url: `/c/${cuisine}` },
        { name: districtName, url: `/c/${cuisine}/${district}` },
      ]} />
      <ItemListJsonLd
        name={`${label} restaurants in ${districtName}`}
        items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: `/restaurant/${r.id}` }))}
      />
    </div>
  );
}
