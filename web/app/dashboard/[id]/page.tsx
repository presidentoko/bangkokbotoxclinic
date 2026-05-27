import { notFound } from "next/navigation";
import { loadMasterDb, getClinicById } from "@/lib/data";
import { DashboardView } from "@/components/DashboardView";
import { getRecentLeads, getLeadCount } from "@/lib/leadStore";
import { listPartners } from "@/lib/partnerStore";
import {
  getLeadStatusMap, getLeadNotesMap, getReplyDoneSet,
  getTotalProfileViews, getProfileViewsByDay,
} from "@/lib/dashboardStore";
import { verifyAccess } from "@/lib/dashboardAccessStore";
import { isAdminAuthedFromCookies } from "@/lib/adminAuth";
import { getSiteConfig } from "@/lib/site";
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
  { params, searchParams }: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ k?: string }>;
  }
) {
  const { id } = await params;
  const { k } = await searchParams;
  const db = await loadMasterDb();
  const c = getClinicById(db.clinics, id);
  if (!c) notFound();

  // Gate: 직원 (admin 쿠키) OR 클리닉 owner (?k=TOKEN) 만 통과.
  // 직원은 /admin 한번 로그인 후 모든 dashboard 자동 접근.
  const staff = await isAdminAuthedFromCookies();
  const accessOk = staff || (k ? await verifyAccess(id, k) : false);
  if (!accessOk) {
    const cfg = getSiteConfig();
    const partnerEmail = `partners@${cfg.domain}`;
    return (
      <div className="max-w-xl mx-auto px-4 py-20">
        <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "var(--accent)" }}>
          🔒 Private Dashboard
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-3">
          {c.name} — access required
        </h1>
        <p className="text-base text-[var(--muted)] leading-relaxed mb-6">
          This dashboard is private. To view it you need the secure link issued by our team. If you are the owner of <strong className="text-[var(--fg)]">{c.name}</strong> and have not received a link, please request access.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm">
          <div className="font-bold mb-1">What is inside</div>
          <ul className="space-y-1 opacity-90">
            <li>· Trust Score breakdown for your clinic</li>
            <li>· AI-drafted replies for unanswered negative reviews</li>
            <li>· Competitor ranking in your district</li>
            <li>· Real-time customer leads from this site</li>
          </ul>
        </div>
        <a
          href={`mailto:${partnerEmail}?subject=${encodeURIComponent(`Dashboard access request — ${c.name}`)}&body=${encodeURIComponent(`Hi,\n\nI am the owner of ${c.name} and would like the secure dashboard link.\n\nClinic ID: ${c.id}\nMaps: ${c.maps_url || ""}\n\nThank you.`)}`}
          className="inline-block bg-[var(--accent)] text-white font-bold px-5 py-3 rounded-xl"
        >
          Email {partnerEmail} to request access →
        </a>
        <p className="text-xs text-[var(--muted)] mt-6">
          Already have the link? Make sure it includes <code>?k=...</code> at the end.
        </p>
        <p className="text-[10px] text-[var(--muted)]/70 mt-2">
          (Internal staff: sign in at <code>/admin</code> to access without a token.)
        </p>
      </div>
    );
  }

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
      accessToken={staff ? null : (k ?? null)}
    />
  );
}
