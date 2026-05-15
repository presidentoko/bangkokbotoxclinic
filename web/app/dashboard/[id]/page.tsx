import { notFound } from "next/navigation";
import { loadMasterDb, getClinicById } from "@/lib/data";
import { DashboardView } from "@/components/DashboardView";
import { getRecentLeads, getLeadCount } from "@/lib/leadStore";
import { listPartners } from "@/lib/partnerStore";
import {
  getLeadStatusMap, getLeadNotesMap, getReplyDoneSet,
  getTotalProfileViews, getProfileViewsByDay,
} from "@/lib/dashboardStore";
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

  // 실시간 lead 데이터 + 상태 + 답글 완료 + 뷰 통계 (병렬 fetch)
  // 뷰 카운트는 /clinic/[id] 공개 페이지에서 increment — 여기는 owner view 라 카운트 안 함
  const [recentLeads, leadCount, partners, leadStatusMap, leadNotesMap, replyDoneSet, viewsTotal, viewsByDay] = await Promise.all([
    getRecentLeads(c.id, 10),
    getLeadCount(c.id),
    listPartners(),
    getLeadStatusMap(c.id),
    getLeadNotesMap(c.id),
    getReplyDoneSet(c.id),
    getTotalProfileViews(c.id),
    getProfileViewsByDay(c.id, 30),
  ]);
  const partner = partners.find((p) => p.clinic_id === c.id) ?? null;
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
      leadStatusMap={leadStatusMap}
      leadNotesMap={leadNotesMap}
      replyDoneHashes={Array.from(replyDoneSet)}
      profileViewsTotal={viewsTotal}
      profileViewsByDay={viewsByDay}
    />
  );
}
