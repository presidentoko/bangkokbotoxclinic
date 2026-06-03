export const dynamic = "force-dynamic"; // ?as=<clinicId> 처리 위해

import { loadMasterDb } from "@/lib/data";
import { DashboardView } from "@/components/DashboardView";
import { RoiCalculator } from "@/components/RoiCalculator";
import { makeLeadId, type LeadRecord } from "@/lib/leadStore";
import { getSiteConfig, applySiteFilter } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard preview — see what partners get",
  description: "Live demo of the clinic-side dashboard with realistic data. This is what every partner sees.",
  robots: { index: false, follow: false },
};

// 영업 시연용 가짜 lead 데이터 — 실제 클리닉이 받게 될 lead 모양.
// 사이트별로 적합한 시술 + 상태 다양화 (new / contacted / booked / no-show / cancelled).
function buildDemoLeads(focus: string, clinicId: string, clinicName: string): LeadRecord[] {
  const now = Date.now();
  const hours = (h: number) => new Date(now - h * 3600_000).toISOString();

  const dental = focus === "dental";

  // 사이트별 서비스 / 노트
  const leads = dental ? [
    { name: "Sarah K.", email: "sarah.k***@gmail.com", phone: "+65 9*** **** (LINE)", service: "implant",
      notes: "Two missing molars. Visiting Bangkok June 15-20. Budget ฿80-120K. Quote please.", ref: "google.com.sg", hrs: 1 },
    { name: "Tanaka M.", email: "m.tanaka***@yahoo.co.jp", phone: "+81 90 **** ****", service: "veneer",
      notes: "8 front teeth veneers. Considering Bangkok for cost. Need photos of past cases.", ref: "google.co.jp", hrs: 4 },
    { name: "Lee J.", email: "leejun***@naver.com", phone: "+82 10 **** **** (KakaoTalk)", service: "ortho",
      notes: "Invisalign 견적 부탁드립니다. 6월 중 방문 예정. 한국어 가능 의사 우대.", ref: "google.co.kr", hrs: 9 },
    { name: "David W.", email: "dwilson***@outlook.com", phone: "+44 7*** *** ***", service: "whitening",
      notes: "Professional whitening + cleaning before wedding (Aug). Looking at top-rated clinics.", ref: "perplexity.ai", hrs: 14 },
    { name: "Maria G.", email: "m.gonzalez***@gmail.com", phone: "+34 6** *** ***", service: "implant",
      notes: "All-on-4 lower jaw. Quoted $25K in Spain. Bangkok prices?", ref: "google.es", hrs: 22 },
    { name: "Robert C.", email: "rchen***@gmail.com", phone: "+1 415 *** ****", service: "consult",
      notes: "Full check-up + cleaning + 1-2 fillings. Bangkok resident, looking for English-speaking clinic.", ref: "google.com", hrs: 30 },
    { name: "Anna F.", email: "anna.f***@gmail.com", phone: "@anna_dental_2026", service: "whitening",
      notes: "Lived in Bangkok 3 years. Was at another clinic, looking to switch.", ref: "facebook.com", hrs: 48 },
    { name: "James P.", email: "j.park***@hotmail.com", phone: "", service: "implant",
      notes: "1 implant + crown. Asking 3 clinics for quotes.", ref: "google.com", hrs: 72 },
  ] : [
    { name: "Sarah K.", email: "sarah.k***@gmail.com", phone: "+65 9*** **** (LINE)", service: "botox",
      notes: "First-time botox, forehead + crow's feet. Prefer Allergan. English-speaking doctor please.", ref: "google.com", hrs: 2 },
    { name: "Lee J.", email: "leejun***@naver.com", phone: "@minjun_kr (LINE)", service: "filler",
      notes: "한국어 가능하신 의사선생님 부탁드립니다. 입꼬리 + 팔자주름 시술 견적 문의.", ref: "google.co.kr", hrs: 7 },
    { name: "Tanaka M.", email: "m.tanaka***@yahoo.co.jp", phone: "+81 90 **** ****", service: "hifu",
      notes: "Considering HIFU for jawline. Visiting Bangkok 5/19-5/22. Budget ฿15-25K.", ref: "google.co.jp", hrs: 19 },
    { name: "Anna W.", email: "anna.w***@outlook.com", phone: "", service: "facial",
      notes: "General consultation for skin texture concerns. Sukhumvit resident. Long-term patient potential.", ref: "perplexity.ai", hrs: 34 },
    { name: "Vivian L.", email: "vivianl***@gmail.com", phone: "+852 9*** ****", service: "filler",
      notes: "Lip filler — natural look. Allergic to lidocaine — please confirm clinic uses Restylane Kysse.", ref: "google.com.hk", hrs: 42 },
    { name: "Michael R.", email: "m.rodriguez***@gmail.com", phone: "+1 213 *** ****", service: "botox",
      notes: "Botox masseter (jaw slimming). 4-day Bangkok trip June 1-4. Strict timeline.", ref: "reddit.com", hrs: 60 },
    { name: "Priya S.", email: "priya.s***@gmail.com", phone: "+91 98 *** ****", service: "laser",
      notes: "Pico laser for melasma. Previous treatment in Mumbai. Want comparison consultation.", ref: "google.co.in", hrs: 78 },
    { name: "Emma B.", email: "emma.b***@gmail.com", phone: "", service: "consult",
      notes: "Combination package — botox + filler + HIFU. Want to know your most popular combo.", ref: "instagram.com", hrs: 96 },
  ];

  return leads.map((l) => ({
    id: makeLeadId(),
    clinic_id: clinicId, clinic_name: clinicName,
    name: l.name, email: l.email, phone: l.phone, service: l.service,
    date: "", time_slot: "",
    notes: l.notes, context: "booking_clinic",
    ua: "iOS Safari", ref: l.ref, at: hours(l.hrs),
  }));
}

// 30일 일별 뷰 카운트 — 현실적인 패턴 (주말 dip, 점진 증가)
function buildDemoViews(): { date: string; count: number }[] {
  const days = 30;
  const now = new Date();
  const out: { date: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay();
    const baseGrowth = 8 + (days - i) * 0.4;             // 점진 증가
    const weekendDip = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1; // 주말 -30%
    const noise = 0.7 + Math.sin(i * 1.3) * 0.3;          // 자연 변동
    const count = Math.max(0, Math.round(baseGrowth * weekendDip * noise));
    out.push({ date: d.toISOString().slice(0, 10), count });
  }
  return out;
}

export default async function DemoDashboardPage(
  { searchParams }: { searchParams: Promise<{ as?: string }> }
) {
  const cfg = getSiteConfig();
  const db = await loadMasterDb();
  const focused = applySiteFilter(db.clinics, cfg);

  // ?as=<clinicId> → 그 클리닉으로 데모 (영업용 맞춤 링크)
  const { as: targetId } = await searchParams;
  const targeted = targetId ? db.clinics.find((x) => x.id === targetId) : null;

  // 데모용 클리닉 픽: targeted 있으면 그거, 없으면 리뷰 많고 topic 풍부한 곳
  const c = targeted
    ?? focused.find((x) => x.scraped_review_count >= 50 && x.mentioned_topics.length >= 5 && x.doctor_stats && x.doctor_stats.length > 0)
    ?? focused.find((x) => x.scraped_review_count >= 30 && x.mentioned_topics.length >= 3)
    ?? focused[0];

  if (!c) {
    return <div className="max-w-2xl mx-auto p-12 text-center">No demo data available.</div>;
  }

  const sameDistrict = c.district
    ? focused.filter((x) => x.district === c.district)
    : focused.filter((x) => x.city_label === c.city_label);
  const sameCategory = c.categories.length > 0
    ? sameDistrict.filter((x) => x.categories.some((cat) => c.categories.includes(cat)))
    : sameDistrict;
  const competitors = sameCategory.sort((a, b) => b.trust_score - a.trust_score).slice(0, 10);

  const cityList = focused.filter((x) => x.city_label === c.city_label);
  const cityClinicCount = cityList.length;
  const cityAvgRating = cityList.length
    ? cityList.reduce((s, x) => s + x.rating, 0) / cityList.length
    : null;

  const recentLeads = buildDemoLeads(cfg.focus, c.id, c.name);

  // 리드 상태 다양화 — CRM 작동 보여줌
  const leadStatusMap: Record<string, "new" | "contacted" | "booked" | "no_show" | "cancelled"> = {};
  const leadNotesMap: Record<string, string> = {};
  if (recentLeads[0]) leadStatusMap[recentLeads[0].id] = "new";
  if (recentLeads[1]) { leadStatusMap[recentLeads[1].id] = "contacted"; leadNotesMap[recentLeads[1].id] = "Called back via LINE. Sending photos of past results."; }
  if (recentLeads[2]) { leadStatusMap[recentLeads[2].id] = "booked"; leadNotesMap[recentLeads[2].id] = "Booked for May 21, 14:00. Confirmed via email."; }
  if (recentLeads[3]) leadStatusMap[recentLeads[3].id] = "contacted";
  if (recentLeads[4]) { leadStatusMap[recentLeads[4].id] = "booked"; leadNotesMap[recentLeads[4].id] = "Initial consult booked. Quote sent ฿95,000."; }
  if (recentLeads[5]) leadStatusMap[recentLeads[5].id] = "contacted";
  if (recentLeads[6]) leadStatusMap[recentLeads[6].id] = "no_show";
  if (recentLeads[7]) leadStatusMap[recentLeads[7].id] = "new";

  // 일부 답글 완료 표시 (review hash — DashboardView 의 reviewHash 와 동일 알고리즘)
  const reviewHash = (text: string): string => {
    let h = 0;
    for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
    return Math.abs(h).toString(36);
  };
  const allNegSamples = c.sample_reviews_negative ?? [];
  const replyDoneHashes = allNegSamples.slice(0, Math.min(2, allNegSamples.length)).map((r) => reviewHash(r.text));

  // 뷰 통계 — 30일 차트 + 누적
  const viewsByDay = buildDemoViews();
  const viewsTotal = viewsByDay.reduce((s, d) => s + d.count, 0) + 312; // 누적이 30일보다 큼

  return (
    <>
      {/* DEMO BANNER — personalized when ?as=<clinicId> */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-3 px-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
              {targeted ? "Your Preview" : "Preview"}
            </span>
            {targeted ? (
              <span className="font-semibold">This is what <strong>{c.name}</strong>&rsquo;s dashboard would look like.</span>
            ) : (
              <span className="font-semibold">This is what your dashboard looks like.</span>
            )}
            <span className="text-white/80 hidden md:inline">{targeted ? "Real data + simulated leads." : "Realistic but fabricated data."}</span>
          </div>
          <a
            href="/onboarding/partner"
            className="bg-white text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-gray-100 transition whitespace-nowrap"
          >
            Start 30-day free trial →
          </a>
        </div>
      </div>

      <DashboardView
        clinic={c}
        competitors={competitors}
        cityAvgRating={cityAvgRating}
        cityClinicCount={cityClinicCount}
        recentLeads={recentLeads}
        totalLeads={viewsTotal > 200 ? 47 : 23}
        ticketAvg={cfg.focus === "dental" ? 35000 : 18000}
        isPartner={false}
        isDemo
        leadStatusMap={leadStatusMap}
        leadNotesMap={leadNotesMap}
        replyDoneHashes={replyDoneHashes}
        profileViewsTotal={viewsTotal}
        profileViewsByDay={viewsByDay}
      />

      {/* ROI Calculator — interactive sales tool */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <RoiCalculator />

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 text-center mt-6">
          <h2 className="text-2xl md:text-3xl font-black mb-3">Ready to activate this for your clinic?</h2>
          <p className="text-white/90 mb-5 max-w-xl mx-auto">
            30-day free trial. No credit card. Cancel anytime. Real leads start arriving the day you activate.
          </p>
          <a href="/onboarding/partner" className="inline-block bg-white text-indigo-700 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition">
            Start free trial →
          </a>
        </div>
      </div>
    </>
  );
}
