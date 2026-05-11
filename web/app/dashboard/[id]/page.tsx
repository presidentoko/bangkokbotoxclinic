import { notFound } from "next/navigation";
import { loadMasterDb, getClinicById } from "@/lib/data";
import { DashboardView } from "@/components/DashboardView";
import type { Metadata } from "next";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const db = await (await import("@/lib/data")).loadMasterDb();
  return db.clinics.map((c) => ({ id: c.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const db = await loadMasterDb();
  const c = getClinicById(db.clinics, id);
  return {
    title: c ? `${c.name} — Clinic Dashboard` : "Dashboard not found",
    robots: { index: false, follow: false },
  };
}

export default async function ClinicDashboardPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = await loadMasterDb();
  const c = getClinicById(db.clinics, id);
  if (!c) notFound();

  const sameDistrict = c.district
    ? db.clinics.filter((x) => x.district === c.district)
    : db.clinics.filter((x) => x.city_label === c.city_label);
  const sameCategory = c.categories.length > 0
    ? sameDistrict.filter((x) => x.categories.some((cat) => c.categories.includes(cat)))
    : sameDistrict;
  const competitors = sameCategory.sort((a, b) => b.trust_score - a.trust_score).slice(0, 10);

  const cityList = db.clinics.filter((x) => x.city_label === c.city_label);
  const cityClinicCount = cityList.length;
  const cityAvgRating = cityList.length
    ? cityList.reduce((s, x) => s + x.rating, 0) / cityList.length
    : null;

  return (
    <DashboardView
      clinic={c}
      competitors={competitors}
      cityAvgRating={cityAvgRating}
      cityClinicCount={cityClinicCount}
    />
  );
}
