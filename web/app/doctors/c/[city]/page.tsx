import { notFound } from "next/navigation";
import { loadMasterDb, getAllDoctors } from "@/lib/data";
import { DoctorGrid } from "@/components/DoctorGrid";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

const CITY_SLUG_MAP: Record<string, string> = {
  "bangkok": "Bangkok",
  "pattaya": "Pattaya",
  "phuket": "Phuket",
  "chiang-mai": "Chiang Mai",
  "koh-samui": "Koh Samui",
  "krabi": "Krabi",
  "hua-hin": "Hua Hin",
};

// 봇 쓰레기 param(/d/wp-login.php 등)의 온디맨드 렌더+캐시 write 차단
// (Hobby ISR Writes 한도 누수, 2026-07-11 감사). GSP가 링크 공간 전체 커버.
export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await loadMasterDb();
  const cities = new Set(getAllDoctors(db.clinics).map((d) => d.clinic.city_label));
  return Array.from(cities)
    .filter(Boolean)
    .map((c) => ({ city: c.toLowerCase().replace(/\s+/g, "-") }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ city: string }> }
): Promise<Metadata> {
  const { city: citySlug } = await params;
  const cityLabel = CITY_SLUG_MAP[citySlug];
  if (!cityLabel) return { title: "City not found" };
  return {
    title: `${cityLabel} specialist doctors — reviews & ratings`,
    description: `${cityLabel} specialist physicians — botox, filler, HIFU, laser, dental. Filterable by patient language (Korean / English / Thai / Japanese). Real review-based rankings.`,
    alternates: { canonical: `/doctors/c/${citySlug}` },
  };
}

export default async function DoctorsByCity(
  { params }: { params: Promise<{ city: string }> }
) {
  const { city: citySlug } = await params;
  const cityLabel = CITY_SLUG_MAP[citySlug];
  if (!cityLabel) notFound();

  const db = await loadMasterDb();
  const doctors = getAllDoctors(db.clinics)
    .filter((d) => d.clinic.city_label === cityLabel)
    .sort((a, b) => b.mentions - a.mentions);

  // Korean + English + Thai 별 sub-segment
  const byKorean = doctors.filter((d) => (d.language_count.ko || 0) >= 2).slice(0, 18);
  const byEnglish = doctors.filter((d) => (d.language_count.en || 0) >= 5).slice(0, 18);
  const byVolume = doctors.slice(0, 60);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href="/doctors" className="hover:text-[var(--fg)]">Doctors</a>
        <span className="mx-2">›</span>
        <span className="text-[var(--fg)]">{cityLabel}</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          {cityLabel} specialist doctors · {doctors.length}
        </h1>
        <p className="text-[var(--muted)] max-w-2xl">
          Verified physicians named in {cityLabel} patient reviews. Sorted by review activity. Below: language-specific sub-lists for international patients.
        </p>
      </header>

      {byKorean.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-1">Korean-speaking patients name these doctors most</h2>
          <p className="text-xs text-[var(--muted)] mb-4">한국어 환자가 자주 언급한 의사. 한국 의료관광 환자에게 검증된 specialist.</p>
          <DoctorGrid doctors={byKorean} />
        </section>
      )}

      {byEnglish.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-1">English-speaking patient favorites</h2>
          <p className="text-xs text-[var(--muted)] mb-4">Specialists most often praised by English-speaking expat + medical tourism patients.</p>
          <DoctorGrid doctors={byEnglish} />
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-1">Most-mentioned overall</h2>
        <p className="text-xs text-[var(--muted)] mb-4">Top doctors by total patient review mentions in {cityLabel}.</p>
        <DoctorGrid doctors={byVolume} />
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Doctors", url: "/doctors" },
        { name: cityLabel, url: `/doctors/c/${citySlug}` },
      ]} />
    </div>
  );
}
