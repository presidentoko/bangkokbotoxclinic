import { notFound } from "next/navigation";
import { loadMasterDb, getAllDoctors } from "@/lib/data";
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
  return VALID_SPECIALTIES.map((s) => ({ specialty: s }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ specialty: string }> }
): Promise<Metadata> {
  const { specialty } = await params;
  const label = CATEGORY_LABELS[specialty];
  if (!label) return { title: "Specialty not found" };
  return {
    title: `Best ${label} doctors in Bangkok — patient reviews`,
    description: `${label} specialist physicians in Bangkok, Pattaya, Phuket. Patient review-based rankings with language breakdown for Korean / English / Thai patients.`,
    alternates: { canonical: `/doctors/s/${specialty}` },
  };
}

export default async function DoctorsBySpecialty(
  { params }: { params: Promise<{ specialty: string }> }
) {
  const { specialty } = await params;
  const label = CATEGORY_LABELS[specialty];
  if (!label) notFound();

  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  const doctors = getAllDoctors(applySiteFilter(db.clinics, cfg))
    .filter((d) => d.clinic.categories.includes(specialty))
    .sort((a, b) => b.mentions - a.mentions);

  // By city sub-segments (Bangkok top tier in this specialty)
  const byBangkok = doctors.filter((d) => d.clinic.city_label === "Bangkok").slice(0, 18);
  const byKorean = doctors.filter((d) => (d.language_count.ko || 0) >= 2).slice(0, 12);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href="/doctors" className="hover:text-[var(--fg)]">Doctors</a>
        <span className="mx-2">›</span>
        <span className="text-[var(--fg)]">{label}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          Best {label} doctors · {doctors.length} specialists
        </h1>
        <p className="text-[var(--muted)] max-w-2xl">
          {label} specialist physicians named in real patient reviews. Includes practice language breakdown — find the right specialist for your language preference and procedure type.
        </p>
      </header>

      {byKorean.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-1">Korean-speaking {label} specialists</h2>
          <p className="text-xs text-[var(--muted)] mb-4">한국어 가능 {label} specialist. 한국 의료관광 + expat 검증.</p>
          <DoctorGrid doctors={byKorean} />
        </section>
      )}

      {byBangkok.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-1">Bangkok {label} top doctors</h2>
          <DoctorGrid doctors={byBangkok} />
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-1">All {label} specialists</h2>
        <DoctorGrid doctors={doctors.slice(0, 60)} />
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Doctors", url: "/doctors" },
        { name: label, url: `/doctors/s/${specialty}` },
      ]} />
    </div>
  );
}
