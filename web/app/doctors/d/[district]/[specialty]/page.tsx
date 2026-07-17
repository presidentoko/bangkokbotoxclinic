import { notFound } from "next/navigation";
import { loadMasterDb, getAllDoctors, slugify } from "@/lib/data";
import { DoctorGrid } from "@/components/DoctorGrid";
import { CATEGORY_LABELS } from "@/lib/types";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { applySiteFilter, getSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

const VALID_SPECIALTIES = Object.keys(CATEGORY_LABELS);

// 봇 쓰레기 param(/d/wp-login.php 등)의 온디맨드 렌더+캐시 write 차단
// (Hobby ISR Writes 한도 누수, 2026-07-11 감사). GSP가 링크 공간 전체 커버.
export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const all = getAllDoctors(applySiteFilter(db.clinics, cfg));
  // district × specialty 조합 중 의사 ≥3 만 SSG 생성
  const counts = new Map<string, { district: string; specialty: string; n: number }>();
  for (const d of all) {
    if (!d.clinic.district) continue;
    for (const cat of d.clinic.categories) {
      if (!VALID_SPECIALTIES.includes(cat)) continue;
      const key = `${d.clinic.district}|${cat}`;
      const entry = counts.get(key) ?? { district: d.clinic.district, specialty: cat, n: 0 };
      entry.n += 1;
      counts.set(key, entry);
    }
  }
  return Array.from(counts.values())
    .filter((c) => c.n >= 1) // dynamicParams=false 와 짝 — 1-2명 조합 링크도 404 안 나게 전량 생성
    .map(({ district, specialty }) => ({ district: slugify(district), specialty }));
}

async function resolve(districtSlug: string, specialty: string) {
  if (!VALID_SPECIALTIES.includes(specialty)) return null;
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const all = getAllDoctors(applySiteFilter(db.clinics, cfg));
  const districts = new Set(all.map((d) => d.clinic.district).filter(Boolean));
  const district = Array.from(districts).find((d) => slugify(d) === districtSlug);
  if (!district) return null;
  return { db, all, district, specialty };
}

export async function generateMetadata(
  { params }: { params: Promise<{ district: string; specialty: string }> }
): Promise<Metadata> {
  const { district, specialty } = await params;
  const r = await resolve(district, specialty);
  if (!r) return { title: "Page not found" };
  const label = CATEGORY_LABELS[r.specialty];
  return {
    title: `Best ${label} doctors in ${r.district} — Bangkok patient reviews`,
    description: `${label} specialist physicians in ${r.district}, Bangkok. Patient review-based rankings with Korean / English / Thai language breakdown. Find the right specialist.`,
    alternates: { canonical: `/doctors/d/${district}/${specialty}` },
  };
}

export default async function DoctorsByDistrictSpecialty(
  { params }: { params: Promise<{ district: string; specialty: string }> }
) {
  const { district: districtSlug, specialty } = await params;
  const r = await resolve(districtSlug, specialty);
  if (!r) notFound();

  const label = CATEGORY_LABELS[r.specialty];
  const doctors = r.all
    .filter((d) =>
      d.clinic.district === r.district &&
      d.clinic.categories.includes(r.specialty)
    )
    .sort((a, b) => b.mentions - a.mentions);

  if (doctors.length === 0) notFound();

  const byKorean = doctors.filter((d) => (d.language_count.ko || 0) >= 2).slice(0, 10);
  const byEnglish = doctors.filter((d) => (d.language_count.en || 0) >= 5).slice(0, 10);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href="/doctors" className="hover:text-[var(--fg)]">Doctors</a>
        <span className="mx-2">›</span>
        <a href={`/doctors/d/${districtSlug}`} className="hover:text-[var(--fg)]">{r.district}</a>
        <span className="mx-2">›</span>
        <span className="text-[var(--fg)]">{label}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          Best {label} doctors in {r.district} · {doctors.length} specialists
        </h1>
        <p className="text-[var(--muted)] max-w-2xl">
          {label} specialist physicians in {r.district}, Bangkok. Each profile shows real patient language breakdown so you can find a {label.toLowerCase()} specialist who speaks your language.
        </p>
      </header>

      {byKorean.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-1">Korean-speaking {label} specialists in {r.district}</h2>
          <p className="text-xs text-[var(--muted)] mb-4">한국어 가능 {label} specialist — {r.district} 지역.</p>
          <DoctorGrid doctors={byKorean} />
        </section>
      )}

      {byEnglish.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-1">English-speaking patient favorites</h2>
          <DoctorGrid doctors={byEnglish} />
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-1">All {label} doctors in {r.district}</h2>
        <DoctorGrid doctors={doctors.slice(0, 60)} />
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Doctors", url: "/doctors" },
        { name: r.district, url: `/doctors/d/${districtSlug}` },
        { name: label, url: `/doctors/d/${districtSlug}/${specialty}` },
      ]} />
    </div>
  );
}
