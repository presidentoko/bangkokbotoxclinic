import { loadMasterDb } from "@/lib/data";
import { DashboardView } from "@/components/DashboardView";
import { makeLeadId, type LeadRecord } from "@/lib/leadStore";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard preview — bangkokbotoxclinic.com B2B",
  description: "Live demo of the clinic-side dashboard. Real anonymized data.",
};

// 영업 시연용 데모 lead — 클리닉이 실제 받게 될 lead 모양을 보여줌.
// 실제 storage 와 무관, 페이지 렌더 시점에 생성.
function buildDemoLeads(clinicId: string, clinicName: string): LeadRecord[] {
  const now = Date.now();
  const hours = (h: number) => new Date(now - h * 3600_000).toISOString();
  return [
    {
      id: makeLeadId(), clinic_id: clinicId, clinic_name: clinicName,
      name: "Sarah K.", email: "sarah.k***@gmail.com", phone: "+65 9*** **** (LINE)",
      service: "botox", date: "2026-05-18", time_slot: "Afternoon (12–17)",
      notes: "First-time botox, forehead + crow's feet. Prefer Allergan. English-speaking doctor please.",
      context: "booking_clinic", ua: "iOS Safari", ref: "google.com", at: hours(2),
    },
    {
      id: makeLeadId(), clinic_id: clinicId, clinic_name: clinicName,
      name: "이민준", email: "minjun****@naver.com", phone: "@minjun_kr (LINE)",
      service: "filler", date: "2026-05-15", time_slot: "Morning (9–12)",
      notes: "한국어 가능하신 의사선생님 부탁드립니다. 입꼬리 + 팔자주름 시술 견적 문의.",
      context: "booking_clinic", ua: "Android Chrome", ref: "google.co.kr", at: hours(7),
    },
    {
      id: makeLeadId(), clinic_id: clinicId, clinic_name: clinicName,
      name: "Tanaka M.", email: "m.tanaka***@yahoo.co.jp", phone: "+81 90 **** ****",
      service: "hifu", date: "2026-05-20", time_slot: "Flexible",
      notes: "Considering HIFU for jawline. Visiting Bangkok 5/19-5/22. Budget ฿15-25K.",
      context: "booking_clinic", ua: "iOS Safari", ref: "google.co.jp", at: hours(19),
    },
    {
      id: makeLeadId(), clinic_id: clinicId, clinic_name: clinicName,
      name: "Anna W.", email: "anna.w***@outlook.com", phone: "",
      service: "consult", date: "", time_slot: "Evening (17–20)",
      notes: "General consultation for skin texture concerns. Sukhumvit resident. Long-term patient potential.",
      context: "booking_clinic", ua: "macOS Chrome", ref: "perplexity.ai", at: hours(34),
    },
  ];
}

export default async function DemoDashboardPage() {
  const db = await loadMasterDb();
  const c = db.clinics.find((x) => x.scraped_review_count >= 30 && x.mentioned_topics.length >= 3)
    ?? db.clinics[0];
  if (!c) {
    return <div className="max-w-2xl mx-auto p-12 text-center">No demo data available.</div>;
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

  const recentLeads = buildDemoLeads(c.id, c.name);

  return (
    <DashboardView
      clinic={c}
      competitors={competitors}
      cityAvgRating={cityAvgRating}
      cityClinicCount={cityClinicCount}
      recentLeads={recentLeads}
      totalLeads={47}
      ticketAvg={18000}
      isPartner={false}
      isDemo
    />
  );
}
