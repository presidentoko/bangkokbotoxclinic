import { notFound } from "next/navigation";
import { loadMasterDb, filterByCategory, filterByDistrict } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { CATEGORY_LABELS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { AffiliateInline } from "@/components/AffiliateSlot";
import { LeadCapture } from "@/components/LeadCapture";
import type { Metadata } from "next";

const VALID_SERVICES = new Set(["botox", "filler", "hifu", "facial", "laser", "dental", "hair_transplant", "eye"]);

function districtFromSlug(slug: string, all: string[]): string | null {
  const target = slug.toLowerCase();
  return all.find((d) => d.toLowerCase().replace(/\s+/g, "-") === target) ?? null;
}

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  const districts = Object.keys(db.district_counts);
  const params: { service: string; district: string }[] = [];
  for (const service of VALID_SERVICES) {
    for (const d of districts) {
      params.push({
        service,
        district: d.toLowerCase().replace(/\s+/g, "-"),
      });
    }
  }
  return params;
}

export async function generateMetadata(
  { params }: { params: Promise<{ service: string; district: string }> }
): Promise<Metadata> {
  const { service, district } = await params;
  const label = CATEGORY_LABELS[service] ?? service;
  const db = await loadMasterDb();
  const districtName = districtFromSlug(district, Object.keys(db.district_counts)) ?? district;
  return {
    title: `${label} Clinics in ${districtName}, Bangkok`,
    description: `${label} specialists in ${districtName}, Bangkok. Verified Trust Scores from real Google review analysis.`,
  };
}

export default async function ServiceDistrictPage(
  { params }: { params: Promise<{ service: string; district: string }> }
) {
  const { service, district } = await params;
  if (!VALID_SERVICES.has(service)) notFound();

  const db = await loadMasterDb();
  const districtName = districtFromSlug(district, Object.keys(db.district_counts));
  if (!districtName) notFound();

  const filtered = filterByDistrict(filterByCategory(db.clinics, service), districtName)
    .sort((a, b) => b.trust_score - a.trust_score);

  const label = CATEGORY_LABELS[service] ?? service;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href={`/c/${service}`} className="hover:text-[var(--fg)]">{label}</a>
        <span className="mx-2">›</span>
        <span>{districtName}</span>
      </nav>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        {label} Clinics in {districtName}
      </h1>
      <p className="text-[var(--muted)] mb-8">
        {filtered.length} {label.toLowerCase()} clinics in {districtName} — sorted by Trust Score.
      </p>

      {filtered.length === 0 ? (
        <p className="text-[var(--muted)]">No clinics matched this filter. Try a broader category or different district.</p>
      ) : (
        <>
          <div className="grid gap-3">
            {filtered.slice(0, 5).map((c, i) => (
              <ClinicCard key={c.id} clinic={c} rank={i + 1} />
            ))}
          </div>
          <AffiliateInline category={label} district={districtName} />
          <div className="grid gap-3 mt-3">
            {filtered.slice(5).map((c, i) => (
              <ClinicCard key={c.id} clinic={c} rank={i + 6} />
            ))}
          </div>
          <LeadCapture service={label} context={`category_district_${service}_${district}`} />
        </>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: label, url: `/c/${service}` },
        { name: districtName, url: `/c/${service}/${district}` },
      ]} />
      <ItemListJsonLd
        name={`${label} clinics in ${districtName}`}
        items={filtered.slice(0, 20).map((c) => ({
          name: c.name,
          url: `/clinic/${c.id}`,
        }))}
      />
    </div>
  );
}
