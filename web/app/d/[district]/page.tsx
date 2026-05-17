import { notFound } from "next/navigation";
import { loadMasterDb, filterByDistrict } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { ClinicCardCompact } from "@/components/ClinicCardCompact";
import { BreadcrumbJsonLd, ItemListJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
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
  const count = db.district_counts[districtName] ?? 0;
  return {
    title: `${count} Clinics in ${districtName}, Bangkok — Verified by Reviews`,
    description: `${count} clinics in ${districtName}, Bangkok ranked by verified Google review analysis. Trust Score, reviewer credibility, service mentions for each.`,
    alternates: { canonical: `/d/${district}` },
    openGraph: {
      title: `Clinics in ${districtName}, Bangkok`,
      description: `${count} verified clinics. Trust Score ranking from real reviews.`,
      url: `/d/${district}`,
    },
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
      {filtered.length > 10 && (
        <div className="mt-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-3">
            #11 – #{Math.min(filtered.length, 200)} · runner-up rankings
          </h3>
          <div className="grid gap-1.5">
            {filtered.slice(10, 200).map((c, i) => (
              <ClinicCardCompact key={c.id} clinic={c} rank={i + 11} />
            ))}
          </div>
        </div>
      )}
      {filtered.length > 200 && (
        <p className="mt-6 text-sm text-[var(--muted)]">
          Showing top 200 of {filtered.length}. Use service filters to narrow results.
        </p>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: districtName, url: `/d/${district}` },
      ]} />
      <CollectionPageJsonLd
        name={`Clinics in ${districtName}, Bangkok`}
        description={`${filtered.length} clinics in ${districtName} ranked by Trust Score from Google review analysis.`}
        url={`/d/${district}`}
        items={filtered}
      />
    </div>
  );
}
