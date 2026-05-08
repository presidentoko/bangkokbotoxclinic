import { notFound } from "next/navigation";
import { loadMasterDb, filterByDistrict } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import { AffiliateInline, AdSlot } from "@/components/AffiliateSlot";
import { sortWithSponsored } from "@/lib/sponsored";
import type { Metadata } from "next";

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
  const count = db.restaurants.filter((r) => r.district === districtName).length;
  return {
    title: `${count} Restaurants in ${districtName} — Real Reviews, Not SNS Hype`,
    description: `${count} restaurants in ${districtName} ranked by verified Google review analysis. Trust Score, reviewer credibility, and what diners actually mention.`,
    alternates: { canonical: `/d/${district}` },
    openGraph: {
      title: `Restaurants in ${districtName}`,
      description: `${count} verified restaurants. Trust Score ranking from real reviews.`,
      url: `/d/${district}`,
    },
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
        Restaurants in {districtName}
      </h1>
      <p className="text-[var(--muted)] mb-8">
        {filtered.length} restaurants across all cuisines in {districtName}.
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
          Showing top 200 of {filtered.length}. Use cuisine filters to narrow.
        </p>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: districtName, url: `/d/${district}` },
      ]} />
      <CollectionPageJsonLd
        name={`Restaurants in ${districtName}`}
        description={`${filtered.length} restaurants in ${districtName} ranked by Trust Score from Google review analysis.`}
        url={`/d/${district}`}
        items={filtered}
      />
    </div>
  );
}
