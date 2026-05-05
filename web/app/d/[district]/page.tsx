import { notFound } from "next/navigation";
import { loadMasterDb, filterByDistrict } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { AffiliateInline } from "@/components/AffiliateSlot";
import type { Metadata } from "next";

function districtFromSlug(slug: string, all: string[]): string | null {
  const target = slug.toLowerCase();
  return all.find((d) => d.toLowerCase().replace(/\s+/g, "-") === target) ?? null;
}

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  return Object.keys(db.district_counts).map((d) => ({
    district: d.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ district: string }> }
): Promise<Metadata> {
  const { district } = await params;
  const db = await loadMasterDb();
  const districtName = districtFromSlug(district, Object.keys(db.district_counts)) ?? district;
  return {
    title: `Clinics in ${districtName}, Bangkok`,
    description: `All clinics in ${districtName}, Bangkok with verified Google review analysis and Trust Scores.`,
  };
}

export default async function DistrictPage(
  { params }: { params: Promise<{ district: string }> }
) {
  const { district } = await params;
  const db = await loadMasterDb();
  const districtName = districtFromSlug(district, Object.keys(db.district_counts));
  if (!districtName) notFound();

  const filtered = filterByDistrict(db.clinics, districtName)
    .sort((a, b) => b.trust_score - a.trust_score);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>{districtName}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        Clinics in {districtName}
      </h1>
      <p className="text-[var(--muted)] mb-8">
        {filtered.length} clinics across all categories in {districtName}, Bangkok.
      </p>

      <div className="grid gap-3">
        {filtered.slice(0, 10).map((c, i) => (
          <ClinicCard key={c.id} clinic={c} rank={i + 1} />
        ))}
      </div>
      <AffiliateInline district={districtName} />
      <div className="grid gap-3 mt-3">
        {filtered.slice(10, 200).map((c, i) => (
          <ClinicCard key={c.id} clinic={c} rank={i + 11} />
        ))}
      </div>
      {filtered.length > 200 && (
        <p className="mt-6 text-sm text-[var(--muted)]">
          Showing top 200 of {filtered.length}. Use service filters to narrow results.
        </p>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: districtName, url: `/d/${district}` },
      ]} />
      <ItemListJsonLd
        name={`Clinics in ${districtName}, Bangkok`}
        items={filtered.slice(0, 20).map((c) => ({
          name: c.name,
          url: `/clinic/${c.id}`,
        }))}
      />
    </div>
  );
}
