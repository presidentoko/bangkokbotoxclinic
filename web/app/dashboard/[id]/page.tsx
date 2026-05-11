import { notFound } from "next/navigation";
import { loadMasterDb, getClinicById } from "@/lib/data";
import { DashboardView } from "@/components/DashboardView";
import { getRecentLeads, getLeadCount } from "@/lib/leadStore";
import { getPartner } from "@/lib/partners";
import type { Metadata } from "next";

// 대쉬보드는 private (robots disallow) + 실시간 lead 표시 필요 → dynamic 렌더링.
// SSG 캐시 안 함. 클리닉 owner 가 직접 방문할 때마다 최신 lead 가져옴.
export const dynamic = "force-dynamic";

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

  // 실시간 lead 데이터 (Upstash 미설정 시 빈 배열, ROI는 0)
  const [recentLeads, leadCount] = await Promise.all([
    getRecentLeads(c.id, 10),
    getLeadCount(c.id),
  ]);
  const partner = getPartner(c.id);
  const ticketAvg = partner?.monthly_ticket_avg_thb ?? 15000;

  return (
    <DashboardView
      clinic={c}
      competitors={competitors}
      cityAvgRating={cityAvgRating}
      cityClinicCount={cityClinicCount}
      recentLeads={recentLeads}
      totalLeads={leadCount}
      ticketAvg={ticketAvg}
      isPartner={!!partner}
    />
  );
}
