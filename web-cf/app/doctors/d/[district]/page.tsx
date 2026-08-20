import { notFound } from "next/navigation";
import { loadMasterDb, getAllDoctors, slugify } from "@/lib/data";
import { DoctorGrid } from "@/components/DoctorGrid";
import { CATEGORY_LABELS } from "@/lib/types";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { applySiteFilter, getSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

// 봇 쓰레기 param(/d/wp-login.php 등)의 온디맨드 렌더+캐시 write 차단
// (Hobby ISR Writes 한도 누수, 2026-07-11 감사). GSP가 링크 공간 전체 커버.
export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const districts = new Set<string>();
  for (const d of getAllDoctors(applySiteFilter(db.clinics, cfg))) {
    if (d.clinic.district) districts.add(d.clinic.district);
  }
  return Array.from(districts).map((d) => ({ district: slugify(d) }));
}

async function resolveDistrict(slug: string) {
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const all = getAllDoctors(applySiteFilter(db.clinics, cfg));
  const districts = new Set(all.map((d) => d.clinic.district).filter(Boolean));
  const district = Array.from(districts).find((d) => slugify(d) === slug);
  if (!district) return null;
  return { db, all, district };
}

export async function generateMetadata(
  { params }: { params: Promise<{ district: string }> }
): Promise<Metadata> {
  const { district } = await params;
  const r = await resolveDistrict(district);
  if (!r) return { title: "District not found" };
  const doctors = r.all.filter((d) => d.clinic.district === r.district);
  return {
    title: `Best doctors in ${r.district} — patient-rated specialists`,
    description: `${doctors.length} specialist physicians in ${r.district}, Bangkok. Patient review-based rankings with language breakdown (Korean / English / Thai / Japanese).`,
    alternates: { canonical: `/doctors/d/${district}` },
  };
}

export default async function DoctorsByDistrict(
  { params }: { params: Promise<{ district: string }> }
) {
  const { district: slug } = await params;
  const r = await resolveDistrict(slug);
  if (!r) notFound();

  const doctors = r.all
    .filter((d) => d.clinic.district === r.district)
    .sort((a, b) => b.mentions - a.mentions);

  // specialty 별 카운트
  const specialtyCounts = new Map<string, number>();
  for (const d of doctors) {
    for (const cat of d.clinic.categories) {
      specialtyCounts.set(cat, (specialtyCounts.get(cat) || 0) + 1);
    }
  }
  const specialties = Array.from(specialtyCounts.entries())
    .filter(([, n]) => n >= 3)
    .sort((a, b) => b[1] - a[1]);

  const byKorean = doctors.filter((d) => (d.language_count.ko || 0) >= 2).slice(0, 12);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href="/doctors" className="hover:text-[var(--fg)]">Doctors</a>
        <span className="mx-2">›</span>
        <span className="text-[var(--fg)]">{r.district}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          {r.district} specialist doctors · {doctors.length}
        </h1>
        <p className="text-[var(--muted)] max-w-2xl">
          Verified physicians in {r.district}, Bangkok named in real patient reviews. Filter below by procedure type, or scroll for the full list sorted by review activity.
        </p>
      </header>

      {specialties.length > 0 && (
        <section className="mb-6">
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Browse by procedure</div>
          <div className="flex flex-wrap gap-2">
            {specialties.map(([cat, n]) => (
              <a
                key={cat}
                href={`/doctors/d/${slug}/${cat}`}
                className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-800 text-sm hover:bg-purple-100 transition"
              >
                {CATEGORY_LABELS[cat] ?? cat} <span className="opacity-60 tabular-nums text-xs">({n})</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {byKorean.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-1">Korean-speaking doctors in {r.district}</h2>
          <p className="text-xs text-[var(--muted)] mb-4">한국어 환자가 자주 언급한 specialist.</p>
          <DoctorGrid doctors={byKorean} />
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-1">All {r.district} doctors</h2>
        <DoctorGrid doctors={doctors.slice(0, 60)} />
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Doctors", url: "/doctors" },
        { name: r.district, url: `/doctors/d/${slug}` },
      ]} />
    </div>
  );
}
