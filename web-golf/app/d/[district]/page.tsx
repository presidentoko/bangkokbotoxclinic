import { notFound } from "next/navigation";
import { loadMasterDb, filterByDistrict } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { sortWithSponsored } from "@/lib/sponsored";
import type { Metadata } from "next";

export const revalidate = 604800; // 7 days

function districtFromSlug(slug: string, all: string[]): string | null {
  const target = slug.toLowerCase();
  return all.find((d) => d.toLowerCase().replace(/\s+/g, "-") === target) ?? null;
}

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  const districts = Array.from(new Set(
    Object.keys(db.district_counts).map((k) => k.split("/")[1])
  ));
  return districts.map((d) => ({ district: d.toLowerCase().replace(/\s+/g, "-") }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ district: string }> }
): Promise<Metadata> {
  const { district } = await params;
  const db = await loadMasterDb();
  const allDistricts = Array.from(new Set(
    Object.keys(db.district_counts).map((k) => k.split("/")[1])
  ));
  const districtName = districtFromSlug(district, allDistricts) ?? district;
  return {
    title: `Golf Courses in ${districtName}`,
    description: `Golf courses, driving ranges, and country clubs in ${districtName} with verified Google review analysis and Trust Scores.`,
    alternates: { canonical: `/d/${district}` },
  };
}

export default async function DistrictPage(
  { params }: { params: Promise<{ district: string }> }
) {
  const { district } = await params;
  const db = await loadMasterDb();
  const allDistricts = Array.from(new Set(
    Object.keys(db.district_counts).map((k) => k.split("/")[1])
  ));
  const districtName = districtFromSlug(district, allDistricts);
  if (!districtName) notFound();

  const filtered = sortWithSponsored(filterByDistrict(db.restaurants, districtName));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>{districtName}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        Golf Courses in {districtName}
      </h1>
      <p className="text-[var(--muted)] mb-8">
        {filtered.length} courses across all types in {districtName}.
      </p>

      <div className="grid gap-3">
        {filtered.slice(0, 10).map((r, i) => (
          <RestaurantCard key={r.id} r={r} rank={i + 1} />
        ))}
      </div>
      <AffiliateInline district={districtName} />
      <AdSlot slot="district-mid" />
      <div className="grid gap-3 mt-3">
        {filtered.slice(10, 200).map((r, i) => (
          <RestaurantCard key={r.id} r={r} rank={i + 11} />
        ))}
      </div>
      {filtered.length > 200 && (
        <p className="mt-6 text-sm text-[var(--muted)]">
          Showing top 200 of {filtered.length}. Use category filters to narrow.
        </p>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: districtName, url: `/d/${district}` },
      ]} />
      <ItemListJsonLd
        name={`Golf Courses in ${districtName}`}
        items={filtered.slice(0, 20).map((r) => ({ name: r.name, url: `/course/${r.id}` }))}
      />
    </div>
  );
}
