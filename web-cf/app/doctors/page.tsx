import { loadMasterDb, getAllDoctors } from "@/lib/data";
import { DoctorGrid } from "@/components/DoctorGrid";
import { CATEGORY_LABELS } from "@/lib/types";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { applySiteFilter, getSiteConfig } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bangkok specialist doctors — reviews & ratings",
  description: "Browse 900+ specialist physicians across Bangkok, Pattaya, Phuket. Filter by city, specialty, and patient language. Real review-based rankings.",
  alternates: { canonical: "/doctors" },
};

export default async function DoctorsIndexPage() {
  const db = await loadMasterDb();
  const cfg = getSiteConfig();
  // 이 사이트 소관 클리닉 의사만 — 타 버티컬 의사를 링크하면 doctor/[slug]가
  // dynamicParams=false 로 그 id를 prerender 안 해서 404 (2026-07-17 감사).
  const doctors = getAllDoctors(applySiteFilter(db.clinics, cfg))
    .sort((a, b) => b.mentions - a.mentions);

  const total = doctors.length;
  const top = doctors.slice(0, 60);

  // city / specialty 그룹 카운트
  const cityCounts: Record<string, number> = {};
  const specialtyCounts: Record<string, number> = {};
  for (const d of doctors) {
    const city = d.clinic.city_label || "Bangkok";
    cityCounts[city] = (cityCounts[city] || 0) + 1;
    for (const cat of d.clinic.categories) {
      specialtyCounts[cat] = (specialtyCounts[cat] || 0) + 1;
    }
  }

  const cities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);
  const specialties = Object.entries(specialtyCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span className="text-[var(--fg)]">Doctors</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          Specialist doctors · {total.toLocaleString()} verified
        </h1>
        <p className="text-[var(--muted)] max-w-2xl">
          Physicians named in patient reviews across Bangkok, Pattaya, Phuket. Sorted by review activity — most-recommended first. Each profile shows real patient language breakdown so you can find an English / Korean / Thai-speaking specialist.
        </p>
      </header>

      {/* Filter chips */}
      <section className="mb-6 space-y-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">By city</div>
          <div className="flex flex-wrap gap-2">
            {cities.map(([city, count]) => (
              <a
                key={city}
                href={`/doctors/c/${city.toLowerCase().replace(/\s+/g, "-")}`}
                className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-800 text-sm hover:bg-blue-100 transition"
              >
                {city} <span className="opacity-60 tabular-nums text-xs">({count})</span>
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">By specialty</div>
          <div className="flex flex-wrap gap-2">
            {specialties.map(([cat, count]) => (
              <a
                key={cat}
                href={`/doctors/s/${cat}`}
                className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-800 text-sm hover:bg-purple-100 transition"
              >
                {CATEGORY_LABELS[cat] ?? cat} <span className="opacity-60 tabular-nums text-xs">({count})</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between gap-3 mb-3">
          <h2 className="text-xl font-bold">Most-mentioned doctors</h2>
          <span className="text-xs text-[var(--muted)]">showing top 60 of {total.toLocaleString()}</span>
        </div>
        <DoctorGrid doctors={top} />
      </section>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Doctors", url: "/doctors" },
      ]} />
    </div>
  );
}
