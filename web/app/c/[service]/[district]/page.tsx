import { notFound } from "next/navigation";
import { loadMasterDb, filterByCategory, filterByDistrict } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { ClinicCardCompact } from "@/components/ClinicCardCompact";
import { CATEGORY_LABELS } from "@/lib/types";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/JsonLd";
import { AffiliateInline } from "@/components/AffiliateSlot";
import { BookingForm } from "@/components/BookingForm";
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
  const count = filterByDistrict(filterByCategory(db.clinics, service), districtName).length;
  const robots = count < 3 ? { index: false, follow: true } : undefined;
  return {
    title: `${count} ${label} Clinics in ${districtName}, Bangkok — Trust Score Ranking`,
    description: `${count} verified ${label.toLowerCase()} clinics in ${districtName}, Bangkok. Trust Scores from real Google review analysis. Compare options, read reviews.`,
    alternates: { canonical: `/c/${service}/${district}` },
    ...(robots && { robots }),
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

  // 같은 서비스의 다른 지역들 (클리닉 2개 이상, 현재 district 제외, 상위 8개)
  const allForService = filterByCategory(db.clinics, service);
  const districtCountMap = new Map<string, number>();
  for (const c of allForService) {
    if (!c.district || c.district === districtName) continue;
    districtCountMap.set(c.district, (districtCountMap.get(c.district) ?? 0) + 1);
  }
  const otherDistricts = [...districtCountMap.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  // Compare top 2 CTA
  const compareLink = filtered.length >= 2
    ? `/compare/${filtered[0].id}/${filtered[1].id}`
    : null;

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
        <div>
          <p className="text-[var(--muted)] mb-6">No clinics matched this filter. Try a nearby district:</p>
          {otherDistricts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {otherDistricts.map(([d, n]) => (
                <a key={d} href={`/c/${service}/${d.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition">
                  {label} in {d} <span className="text-[var(--muted)]">{n}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {compareLink && (
            <a href={compareLink}
              className="mb-6 flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border)] bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition text-sm font-medium w-fit">
              ⚖️ Compare #{1} vs #{2}: {filtered[0].name} vs {filtered[1].name} →
            </a>
          )}
          <div className="grid gap-3">
            {filtered.slice(0, 5).map((c, i) => (
              <ClinicCard key={c.id} clinic={c} rank={i + 1} />
            ))}
          </div>
          <AffiliateInline category={label} district={districtName} />
          {filtered.length > 5 && (
            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-3">
                #6 – #{filtered.length} · runner-up rankings
              </h3>
              <div className="grid gap-1.5">
                {filtered.slice(5).map((c, i) => (
                  <ClinicCardCompact key={c.id} clinic={c} rank={i + 6} />
                ))}
              </div>
            </div>
          )}
          <div className="my-6">
            <BookingForm defaultService={service} />
          </div>
          {otherDistricts.length > 0 && (
            <section className="mt-8 pt-6 border-t border-[var(--border)]">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)] mb-3">
                {label} in other districts
              </h2>
              <div className="flex flex-wrap gap-2">
                {otherDistricts.map(([d, n]) => (
                  <a key={d} href={`/c/${service}/${d.toLowerCase().replace(/\s+/g, "-")}`}
                    className="px-3 py-1.5 rounded-full border border-[var(--border)] text-sm bg-white hover:border-[var(--accent)] hover:text-[var(--accent)] transition">
                    {d} <span className="text-[var(--muted)] tabular-nums">{n}</span>
                  </a>
                ))}
              </div>
            </section>
          )}
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
