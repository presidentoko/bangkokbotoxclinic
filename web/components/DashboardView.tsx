"use client";
// B2B clinic dashboard — peeyai 패턴 referenced.
// 클리닉 owner mode. Crisis alerts top → KPI bar → AI tools → competitors → insights.

import { useState, useCallback, useMemo, useEffect, useRef, type FormEvent } from "react";
import type { Clinic, RatingTrend } from "@/lib/types";
import { TOPIC_LABELS } from "@/lib/types";
import { draftReplyStyled, REPLY_CATEGORY_LABELS } from "@/lib/replyDrafts";
import type { ReplyStyle } from "@/lib/replyDrafts";
import type { LeadRecord } from "@/lib/leadStore";
import Avatar from "@/components/Avatar";
import ActionAlert from "@/components/ActionAlert";
import { LEAD_STATUS_META, reviewHash, relTime, type LeadStatus } from "@/lib/dashboardHelpers";
import { Card, KPI, ScoreLever, Stat, RoiCell, LeadField } from "@/components/dashboard/parts";
import { ViewsChart, RatingTrendChart } from "@/components/dashboard/charts";
import { PlatformReputationCard } from "@/components/dashboard/PlatformReputationCard";
import { PricingIntelCard } from "@/components/dashboard/PricingIntelCard";
import { PaymentCTABanner } from "@/components/dashboard/PaymentCTABanner";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";
import { HotLeadsRail } from "@/components/dashboard/HotLeadsRail";
import { WeeklyDigestPreview } from "@/components/dashboard/WeeklyDigestPreview";
import { CommandPalette } from "@/components/dashboard/CommandPalette";
import { PartnerTestimonials } from "@/components/dashboard/PartnerTestimonials";
import { OnboardingTour } from "@/components/dashboard/OnboardingTour";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { OnboardingProgressBar } from "@/components/dashboard/OnboardingProgressBar";

// Derive site domain from NEXT_PUBLIC_SITE_URL (inlined at build time). The default
// matches the botox site so the dental deploy must set NEXT_PUBLIC_SITE_URL.
const SITE_DOMAIN = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bangkokbotoxclinic.com")
  .replace(/^https?:\/\/(www\.)?/, "")
  .replace(/\/$/, "");

type Props = {
  clinic: Clinic;
  competitors: Clinic[];
  cityAvgRating: number | null;
  cityClinicCount: number;
  recentLeads?: LeadRecord[];
  totalLeads?: number;
  ticketAvg?: number;       // 평균 procedure 가격 (ROI 계산용)
  isPartner?: boolean;      // 유료 파트너 여부
  isDemo?: boolean;
  // Redis-backed persistent state
  leadStatusMap?: Record<string, LeadStatus>;
  leadNotesMap?: Record<string, string>;
  replyDoneHashes?: string[];
  profileViewsTotal?: number;
  profileViewsByDay?: { date: string; count: number }[];
  // Owner mode 에서 dashboard API 호출 시 x-dashboard-token 헤더로 전달.
  // Staff (admin 쿠키) 모드면 null — admin 쿠키가 자동 전송됨.
  accessToken?: string | null;
};

// ฿2,800 = Bangkok 피부과 Facebook 광고 평균 CAC.
// 8,000 = bundle 가격 reference (모든 서비스 묶을 때).
const FACEBOOK_CAC_THB = 2800;
const DASHBOARD_FEE_THB = 8000;
const LEAD_CLOSE_RATE = 0.4; // 폼 lead → 실제 procedure conversion

// Unbundle 서비스 가격 — /for-clinics 페이지와 동기화 필요시 양쪽 수정.
const PRICE_AUTO_REPLY_THB = 1500;       // 답글 자동 게시 (commodity)
const PRICE_REVIEW_CAMPAIGN_THB = 1500;  // 리뷰 요청 LINE/SMS 자동 발송
const PRICE_LEAD_ROUTING_THB = 5000;     // CPL ฿50/lead 또는 flat (기존 /for-clinics와 일치)
const PRICE_FEATURED_THB = 5000;         // Featured slot from (기존)
const PRICE_KOREAN_SEO_THB = 4500;       // Korean/EN 콘텐츠 제작
const PRICE_STRATEGY_CALL_THB = 2000;    // 월 1회 30분 컨설팅

// 부정 리뷰 답글 게시 시 Trust Score 추정 delta. Google reply rate signal 기반 추정치
// (Google이 공식 공식 미공개 — 보수적 0.3pt/답글).
const REPLY_TRUST_DELTA = 0.3;

// Review request 템플릿 — {clinic} 은 클리닉 이름으로 치환, {name}/[link]는 owner가 보낼 때 채움.
const REVIEW_TEMPLATES: Record<"en" | "ko" | "th", { label: string; timing: string; body: string }[]> = {
  en: [
    {
      label: "Initial ask",
      timing: "Same day / next day after visit",
      body: "Hi {name}, thanks for visiting {clinic} today! If you have 30 seconds, a quick Google review would mean a lot to our team 🙏 [link]",
    },
    {
      label: "Gentle follow-up",
      timing: "5–7 days after visit",
      body: "Hi {name}, hope you're loving your results from {clinic}! Your Google review would help other patients find us — and we read every one of them. [link]",
    },
    {
      label: "Thank-you after review",
      timing: "After they post",
      body: "Thank you so much for your review, {name}! 🙏 We've noted a complimentary aftercare option for your next visit. See you soon!",
    },
  ],
  ko: [
    {
      label: "초기 요청",
      timing: "시술 당일 또는 다음날",
      body: "{name}님, {clinic} 방문해 주셔서 감사합니다 🙏 30초만 시간 내주시면 Google 리뷰 한 줄 부탁드려요! [link]",
    },
    {
      label: "follow-up",
      timing: "시술 5~7일 후",
      body: "안녕하세요 {name}님, {clinic}입니다. 최근 시술 결과가 어떠셨나요? Google 리뷰 남겨주시면 다른 분들에게 큰 도움이 돼요 🙏 [link]",
    },
    {
      label: "리뷰 작성 후 감사",
      timing: "리뷰 게시 후",
      body: "{name}님, 따뜻한 리뷰 진심으로 감사합니다 🙏 다음 방문 시 무료 애프터케어 옵션 1가지 준비해뒀어요!",
    },
  ],
  th: [
    {
      label: "ขอรีวิวครั้งแรก",
      timing: "วันเดียวกัน หรือวันถัดไป",
      body: "สวัสดีค่ะคุณ{name} ขอบคุณที่ใช้บริการ {clinic} ค่ะ 🙏 รบกวนช่วยรีวิว Google สั้นๆ ได้ไหมคะ ใช้เวลาแค่ 30 วินาที [link]",
    },
    {
      label: "ติดตามอย่างนุ่มนวล",
      timing: "5–7 วันหลังบริการ",
      body: "สวัสดีค่ะคุณ{name} ผลลัพธ์เป็นอย่างไรบ้างคะ ถ้ามีเวลาช่วยรีวิว Google ให้เราหน่อยนะคะ จะเป็นกำลังใจให้ทีมงานมากค่ะ 🙏 [link]",
    },
    {
      label: "ขอบคุณหลังรีวิว",
      timing: "หลังจากรีวิว",
      body: "ขอบคุณมากค่ะคุณ{name}สำหรับรีวิวดีๆ 🙏 ครั้งหน้าทางเรามีบริการ aftercare ฟรี 1 อย่างให้เลือกค่ะ แล้วเจอกันใหม่นะคะ!",
    },
  ],
};

export function DashboardView({
  clinic: c, competitors, cityAvgRating, cityClinicCount,
  recentLeads = [], totalLeads = 0, ticketAvg = 15000, isPartner = false, isDemo,
  leadStatusMap: initialLeadStatus = {},
  leadNotesMap: initialLeadNotes = {},
  replyDoneHashes = [],
  profileViewsTotal = 0,
  profileViewsByDay = [],
  accessToken = null,
}: Props) {
  // Dashboard API 인증 헤더 — owner 모드면 ?k= 토큰을 헤더로 전달, staff 모드면 빈 객체
  // (admin_session 쿠키가 자동 동봉).
  const dashHeaders = (): Record<string, string> => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (accessToken) h["x-dashboard-token"] = accessToken;
    return h;
  };
  // ── client state ──────────────────────────────────────────
  const [styleVariants, setStyleVariants] = useState<Record<number, ReplyStyle>>({});
  const [editTexts, setEditTexts] = useState<Record<number, string>>({});
  const [isEditing, setIsEditing] = useState<Record<number, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [topicFilter, setTopicFilter] = useState<string | null>(null);
  const [reviewLang, setReviewLang] = useState<"ko" | "en" | "th">("en");
  const [showSampleLead, setShowSampleLead] = useState(false);
  const [digestEmail, setDigestEmail] = useState("");
  const [digestStatus, setDigestStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  // AI reply drafts — keyed by `${reviewIndex}-${style}`. Auto-fetched on mount/style-change.
  const [aiDrafts, setAiDrafts] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState<Set<string>>(() => new Set());
  const aiFetchedRef = useRef<Set<string>>(new Set());

  const submitDigestSignup = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (digestStatus === "submitting" || digestStatus === "done") return;
    const email = digestEmail.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setDigestStatus("error");
      return;
    }
    setDigestStatus("submitting");
    try {
      const res = await fetch("/api/email-signup", {
        method: "POST",
        headers: dashHeaders(),
        body: JSON.stringify({ email, clinic_id: c.id }),
      });
      setDigestStatus(res.ok ? "done" : "error");
    } catch {
      setDigestStatus("error");
    }
  }, [c.id, digestEmail, digestStatus]);

  // Persistent reply done set (synced with Redis)
  const [replyDoneSet, setReplyDoneSet] = useState<Set<string>>(() => new Set(replyDoneHashes));
  // Persistent lead status / notes
  const [leadStatus, setLeadStatus] = useState<Record<string, LeadStatus>>(initialLeadStatus);
  const [leadNotes, setLeadNotes] = useState<Record<string, string>>(initialLeadNotes);

  const persistReplyDone = useCallback(async (hash: string, done: boolean) => {
    setReplyDoneSet((prev) => {
      const n = new Set(prev);
      if (done) n.add(hash); else n.delete(hash);
      return n;
    });
    try {
      await fetch("/api/dashboard/reply-done", {
        method: "POST",
        headers: dashHeaders(),
        body: JSON.stringify({ clinic_id: c.id, hash, done }),
      });
    } catch {}
  }, [c.id]);

  const persistLeadStatus = useCallback(async (leadId: string, status: LeadStatus) => {
    setLeadStatus((prev) => ({ ...prev, [leadId]: status }));
    try {
      await fetch("/api/dashboard/lead-status", {
        method: "POST",
        headers: dashHeaders(),
        body: JSON.stringify({ clinic_id: c.id, lead_id: leadId, status }),
      });
    } catch {}
  }, [c.id]);

  const persistLeadNote = useCallback(async (leadId: string, note: string) => {
    setLeadNotes((prev) => ({ ...prev, [leadId]: note }));
    try {
      await fetch("/api/dashboard/lead-status", {
        method: "POST",
        headers: dashHeaders(),
        body: JSON.stringify({ clinic_id: c.id, lead_id: leadId, note }),
      });
    } catch {}
  }, [c.id]);

  const handleCopy = useCallback(async (text: string, key: string) => {
    try { await navigator.clipboard.writeText(text); } catch {
      const el = document.createElement("textarea");
      el.value = text; document.body.appendChild(el); el.select();
      document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);

  const handlePrint = () => window.print();

  const cycleStyle = (i: number) =>
    setStyleVariants((p) => ({ ...p, [i]: (((p[i] ?? 0) + 1) % 3) as ReplyStyle }));

  // ── ROI 계산
  const leadsThisMonth = recentLeads.filter((l) => {
    const ageMs = Date.now() - new Date(l.at).getTime();
    return ageMs < 30 * 24 * 3600 * 1000;
  }).length;
  // 비파트너 가설 모드: 평균 10 leads/month 베이스라인 (이 클리닉 trust_score 기반 ±20% 보정)
  const projectedLeadsBaseline = Math.round(10 * Math.max(0.6, Math.min(1.4, c.trust_score / 60)));
  const roiLeads = isPartner ? leadsThisMonth : projectedLeadsBaseline;
  const projectedCloses = Math.round(roiLeads * LEAD_CLOSE_RATE);
  const revenueAttributedThb = projectedCloses * ticketAvg;
  const facebookEquivalentThb = roiLeads * FACEBOOK_CAC_THB;
  const roiMultiplier = DASHBOARD_FEE_THB > 0 ? revenueAttributedThb / DASHBOARD_FEE_THB : 0;

  const trustColor = c.trust_score >= 75 ? "#10b981" : c.trust_score >= 50 ? "#f59e0b" : "#ef4444";
  const trend = c.rating_trend.trend;
  const trendBadge = {
    improving: { label: "↗ Improving", color: "#10b981", bg: "#dcfce7" },
    declining: { label: "↘ Declining", color: "#ef4444", bg: "#fee2e2" },
    stable: { label: "→ Stable", color: "#737373", bg: "#f5f5f5" },
    insufficient_data: { label: "— Limited data", color: "#737373", bg: "#f5f5f5" },
  }[trend];

  const myRank = competitors.findIndex((x) => x.id === c.id) + 1;
  const TOPIC_KEYWORDS: Record<string, string[]> = {
    english_speaking: ["english", "english-speaking", "english speaking"],
    genuine_brand: ["genuine", "authentic", "original", "real"],
    clean_facility: ["clean", "hygiene", "hygienic", "spotless"],
    long_wait: ["wait", "waiting", "slow", "late", "delay"],
    expensive: ["expensive", "pricey", "overpriced", "overcharged"],
    affordable: ["affordable", "cheap", "reasonable", "price"],
    professional: ["professional", "expert", "skilled"],
    friendly_staff: ["friendly", "kind", "warm", "welcoming"],
    results_satisfied: ["result", "satisfied", "happy", "great result", "love it"],
    no_pain: ["pain", "painless", "no pain", "comfortable"],
    recommend: ["recommend", "recommend!", "would recommend"],
    korean_doctor: ["korean", "korea", "한국", "kmd", "korean-trained"],
    promotion: ["promotion", "discount", "deal", "offer"],
    premium: ["premium", "luxury", "high-end"],
  };
  const allSamples = [...(c.sample_reviews_en ?? []), ...(c.sample_reviews_th ?? [])];
  const samples = (topicFilter
    ? allSamples.filter((s) => {
        const kws = TOPIC_KEYWORDS[topicFilter] ?? [];
        const low = s.text.toLowerCase();
        return kws.some((k) => low.includes(k));
      })
    : allSamples
  ).slice(0, topicFilter ? 10 : 3);
  const negatives = c.sample_reviews_negative ?? [];

  // Auto-fetch AI reply drafts for visible negative reviews. Dedupes via ref so
  // toggling style back and forth doesn't re-hit the API. Server-side Redis cache
  // (30d TTL keyed by review_hash+style) keeps real cost near zero.
  useEffect(() => {
    negatives.forEach((rev, i) => {
      const style = (styleVariants[i] ?? 0) as number;
      const key = `${i}-${style}`;
      if (aiFetchedRef.current.has(key)) return;
      aiFetchedRef.current.add(key);
      setAiLoading((prev) => new Set(prev).add(key));
      fetch("/api/dashboard/ai-reply", {
        method: "POST",
        headers: dashHeaders(),
        body: JSON.stringify({
          clinic_id: c.id,
          review_text: rev.text,
          clinic_name: c.name,
          author_name: rev.author || "",
          style,
        }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { draft?: string } | null) => {
          if (data?.draft) {
            setAiDrafts((prev) => ({ ...prev, [key]: data.draft as string }));
          }
        })
        .catch(() => {})
        .finally(() => {
          setAiLoading((prev) => {
            const n = new Set(prev);
            n.delete(key);
            return n;
          });
        });
    });
  }, [negatives, styleVariants, c.name]);

  // pendingReplies = 미해결로 마크된 부정 리뷰 수 (replyDoneSet 반영, 라이브 업데이트)
  const pendingReplies = negatives.filter((rev) => !replyDoneSet.has(reviewHash(rev.text))).length;
  const trustDelta = trend === "improving" ? "+2.4" : trend === "declining" ? "−1.8" : "+0.3";

  return (
    <div className="bg-[#f9fafb] min-h-screen">
      {isDemo && (
        <div className="bg-blue-600 text-white px-4 py-2 text-center text-xs font-medium">
          <span className="font-bold">DEMO</span> · Sample data for {c.name}. {" "}
          <a href="/for-clinics#pilot" className="underline ml-2 font-bold">Get this for your clinic →</a>
        </div>
      )}

      {/* Sticky header — sits below the global SiteHeader (which is sticky top-0 z-30).
          Without the top-14 offset the two stuck headers overlap at the same y=0 line
          and their text bleeds into each other. */}
      <div className="bg-white border-b border-[var(--border)] sticky top-14 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--muted)] truncate">
              Owner mode · <span className="hidden sm:inline">Refreshed daily from public Google data</span><span className="sm:hidden">Daily refresh</span>
            </div>
            <div className="text-base font-bold truncate">{c.name}</div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`/clinic/${c.id}`}
              target="_blank"
              rel="noopener"
              className="text-xs font-bold px-3 py-2 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-50 print:hidden"
            >
              👁 View as patient
            </a>
            <button onClick={handlePrint} className="text-xs font-bold px-3 py-2 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-50 print:hidden">
              📊 Export PDF
            </button>
            <NotificationCenter clinicId={c.id} />
            <CommandPalette
              clinicId={c.id}
              shareUrl={typeof window !== "undefined" ? window.location.href : `/dashboard/${c.id}`}
            />
          </div>
        </div>
      </div>

      <DashboardSidebar />
      <OnboardingProgressBar />

      {/* Payment CTA — first thing partner sees (hidden if already paying) */}
      <div data-tour="cta">
        <PaymentCTABanner
          clinicName={c.name}
          isPartner={isPartner}
          recentLeadsCount={recentLeads.length}
        />
      </div>

      {/* First-visit interactive tour (auto-disabled for partners) */}
      <OnboardingTour disabled={isPartner || isDemo} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Sticky "action needed" — hidden when nothing to act on */}
        <ActionAlert
          newLeads={recentLeads.filter((l) => (leadStatus[l.id] ?? "new") === "new").length}
          pendingReplies={pendingReplies}
        />

        {/* Hot leads with countdown — drives immediate action */}
        <div data-tour="leads">
          <HotLeadsRail leads={recentLeads} statuses={leadStatus} />
        </div>

        {/* Onboarding checklist — auto-hides when all done */}
        <div data-tour="checklist">
        <OnboardingChecklist
          hasLeads={recentLeads.length > 0}
          hasRepliedToReview={replyDoneSet.size > 0}
          hasContactedLead={Object.values(leadStatus).some((s) => s !== "new")}
          isPartner={isPartner}
          pendingReplies={pendingReplies}
        />
        </div>
        {/* Free-report hero banner — non-partner wedge.
            Partners (paid) skip this; they get the data-first experience. */}
        {!isPartner && !isDemo && (
          <section className="mb-6">
            <div className="rounded-2xl p-5 md:p-6 relative overflow-hidden border-2"
                 style={{ background: "linear-gradient(135deg, #ecfdf5 0%, #f0f9ff 100%)", borderColor: "#10b98140" }}>
              <div className="flex items-start gap-4 flex-wrap md:flex-nowrap">
                <div className="text-4xl md:text-5xl shrink-0">🎁</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "#059669" }}>
                    Free reputation report · No signup
                  </div>
                  <h2 className="text-xl md:text-2xl font-black tracking-tight mb-2">
                    Your clinic's intelligence report is ready
                  </h2>
                  <p className="text-sm text-[var(--fg)] opacity-80 leading-relaxed mb-4">
                    Built from public Google data. {pendingReplies > 0 ? `${pendingReplies} unanswered negative review${pendingReplies > 1 ? "s" : ""} below with AI-drafted replies.` : "All recent negative reviews handled."}
                    {" "}You can act on everything here today — copy the AI replies, share with your team, or save the report.
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleCopy(typeof window !== "undefined" ? window.location.href : `/dashboard/${c.id}`, "share-url")}
                      className="text-sm font-bold px-4 py-2 rounded-lg text-white transition"
                      style={{ background: copiedKey === "share-url" ? "#10b981" : "#059669" }}
                    >
                      {copiedKey === "share-url" ? "✓ Link copied!" : "📤 Share with your team"}
                    </button>
                    <button
                      onClick={handlePrint}
                      className="text-sm font-bold px-4 py-2 rounded-lg border-2 border-[#059669] text-[#059669] bg-white hover:bg-emerald-50 transition print:hidden"
                    >
                      📄 Save as PDF
                    </button>
                    <a
                      href="#crisis"
                      className="text-sm font-bold px-4 py-2 rounded-lg text-[#059669] hover:underline"
                    >
                      ↓ Jump to action items
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Top KPI bar — money metrics 강조 */}
        <section className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
          <KPI
            label="Trust Score"
            value={String(c.trust_score)}
            sub={pendingReplies > 0
              ? `+${(pendingReplies * REPLY_TRUST_DELTA).toFixed(1)} projected if you reply`
              : `${trustDelta} vs last week`}
            color={trustColor}
            clickable
            href={pendingReplies > 0 ? "#crisis" : undefined}
          />
          <KPI label="Profile views (30d)" value={profileViewsByDay.reduce((s, d) => s + d.count, 0).toLocaleString()} sub={`${profileViewsTotal.toLocaleString()} all-time`} color="#6366f1" clickable href="#views" />
          <KPI label="Pending replies" value={String(pendingReplies)} sub={pendingReplies > 0 ? "Action needed ↓" : "All clear"} color={pendingReplies > 0 ? "#ef4444" : "#10b981"} clickable warning={pendingReplies > 0} href="#crisis" />
          <KPI
            label={isPartner ? "Leads this month" : "Projected leads/mo"}
            value={String(roiLeads)}
            sub={isPartner ? `${totalLeads.toLocaleString()} all-time` : "if you join lead routing"}
            color="#0891b2"
            clickable
            href={isPartner ? "#leads" : "#roi"}
          />
          <KPI
            label={isPartner ? "Revenue attributed" : "Projected revenue"}
            value={`฿${(revenueAttributedThb / 1000).toFixed(0)}K`}
            sub={`${projectedCloses} projected closes`}
            color="#10b981"
            clickable
            href="#roi"
          />
          <KPI label="ROI multiplier" value={`${roiMultiplier.toFixed(1)}x`} sub={`vs ฿${(DASHBOARD_FEE_THB / 1000).toFixed(0)}K service fee`} color="#7c3aed" clickable href="#roi" />
        </section>

        {/* Profile views chart */}
        {profileViewsTotal > 0 && (
          <section id="views" className="mb-6">
            <Card accent="#6366f1">
              <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--muted)]">👁 Profile views — last 30 days</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-indigo-600 tabular-nums">
                    {profileViewsByDay.reduce((s, d) => s + d.count, 0).toLocaleString()}
                  </span>
                  <span className="text-xs text-[var(--muted)]">unique sessions · all-time {profileViewsTotal.toLocaleString()}</span>
                </div>
              </div>
              <ViewsChart data={profileViewsByDay} />
            </Card>
          </section>
        )}

        {/* ROI breakdown — partner: 실제 수치 / non-partner: 가설 모드 */}
        <section id="roi" className="mb-6">
          <div className="rounded-2xl p-5 text-white overflow-hidden" style={{ background: "linear-gradient(135deg, #059669 0%, #0891b2 100%)" }}>
            <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">
                  {isPartner ? "Monthly ROI breakdown" : "Projected ROI · if you join lead routing"}
                </div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight mt-1">
                  {isPartner
                    ? `This dashboard is paying for itself ${roiMultiplier >= 1 ? `${roiMultiplier.toFixed(1)}x` : "—"} over`
                    : `A clinic like yours would earn ${roiMultiplier.toFixed(1)}x the service fee`}
                </h2>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-80">{isPartner ? "Cost" : "Lead service from"}</div>
                <div className="text-2xl font-black tabular-nums">฿{DASHBOARD_FEE_THB.toLocaleString()}<span className="text-sm font-normal opacity-80">/mo</span></div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <RoiCell
                label={isPartner ? "Leads delivered" : "Projected leads/mo"}
                value={String(roiLeads)}
                sub={isPartner ? "form submissions" : "based on your Trust Score"}
              />
              <RoiCell label="Projected closes" value={String(projectedCloses)} sub={`@ ${(LEAD_CLOSE_RATE * 100).toFixed(0)}% close rate`} />
              <RoiCell label="Revenue attributed" value={`฿${revenueAttributedThb.toLocaleString()}`} sub={`@ ฿${ticketAvg.toLocaleString()}/procedure avg`} />
              <RoiCell label="Same leads via Facebook" value={`฿${facebookEquivalentThb.toLocaleString()}`} sub={`@ ฿${FACEBOOK_CAC_THB.toLocaleString()} CAC`} />
            </div>
            <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between gap-3 flex-wrap text-xs">
              <span className="opacity-90">
                {isPartner
                  ? "Numbers update in real-time as new leads come in."
                  : "Projection only — actual leads depend on your category, location, and pricing."}
              </span>
              {isPartner ? (
                <a href="#leads" className="font-bold underline">See lead inflow ↓</a>
              ) : (
                <a href="/for-clinics#pilot" className="font-bold underline">Want this real? Talk to us →</a>
              )}
            </div>
          </div>
        </section>

        {/* CRISIS ALERTS — TOP PRIORITY (peeyai pattern: negative actionable first) */}
        {negatives.length > 0 && (
          <section id="crisis" className="mb-6">
            <div className="flex items-baseline justify-between gap-4 mb-3 flex-wrap">
              <div>
                <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                  <span className="text-red-600">🚨</span>
                  Crisis alerts
                  {pendingReplies > 0 ? (
                    <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-red-100 text-red-700">
                      {pendingReplies} need action
                    </span>
                  ) : (
                    <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                      All handled ✓
                    </span>
                  )}
                </h2>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Unanswered negative reviews drop your Trust Score. Reply within 48h with AI-drafted response.
                </p>
              </div>
              {pendingReplies > 0 && (
                <button
                  onClick={() => document.querySelectorAll<HTMLDetailsElement>(".crisis-detail").forEach(d => { d.open = true; })}
                  className="text-xs font-bold px-3 py-2 rounded-lg text-white print:hidden" style={{ background: "#ef4444" }}>
                  ✨ Generate all replies
                </button>
              )}
            </div>

            {/* Progress + projected Trust delta */}
            <div className="mb-4 bg-white rounded-xl border border-[var(--border)] p-4">
              <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
                <div className="text-sm font-bold">
                  Progress: <span className="tabular-nums">{negatives.length - pendingReplies}</span> of <span className="tabular-nums">{negatives.length}</span> resolved
                </div>
                <div className="text-xs text-[var(--muted)]">
                  {pendingReplies > 0
                    ? <>Projected <strong className="text-emerald-700">Trust +{(pendingReplies * REPLY_TRUST_DELTA).toFixed(1)}</strong> when you finish remaining</>
                    : <span className="text-emerald-700 font-bold">+{(negatives.length * REPLY_TRUST_DELTA).toFixed(1)} captured ✓</span>}
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${Math.round(((negatives.length - pendingReplies) / negatives.length) * 100)}%`,
                    background: "linear-gradient(90deg, #ef4444 0%, #10b981 100%)",
                  }}
                />
              </div>
            </div>
            <div className="space-y-3">
              {negatives.map((rev, i) => {
                const style = styleVariants[i] ?? 0;
                const { category, draft: rawDraft } = draftReplyStyled(rev.text, c.name, rev.author, style);
                const aiKey = `${i}-${style}`;
                const aiDraft = aiDrafts[aiKey];
                const isAiLoading = aiLoading.has(aiKey);
                // Preference: user edit > LLM draft > template fallback
                const draft = editTexts[i] ?? aiDraft ?? rawDraft;
                const usingAi = !editTexts[i] && !!aiDraft;
                const severity = rev.rating <= 1 ? "critical" : rev.rating <= 2 ? "high" : "medium";
                const severityColor = severity === "critical" ? "#dc2626" : severity === "high" ? "#ea580c" : "#d97706";
                const hash = reviewHash(rev.text);
                const resolved = replyDoneSet.has(hash);
                const copyKey = `reply-${i}`;
                const STYLE_LABELS: Record<number, string> = { 0: "Formal", 1: "Warm", 2: "Brief" };
                return (
                  <div key={i} className={`bg-white border-2 rounded-xl overflow-hidden transition ${resolved ? "opacity-50" : ""}`} style={{ borderColor: `${severityColor}30` }}>
                    <div className="px-4 py-3 flex items-center justify-between gap-3 border-b border-[var(--border)] flex-wrap" style={{ background: `${severityColor}08` }}>
                      <div className="flex items-center gap-3 flex-wrap">
                        {resolved ? (
                          <span className="text-xs font-black uppercase tracking-widest px-2 py-1 rounded-full text-white bg-gray-400">resolved</span>
                        ) : (
                          <span className="text-xs font-black uppercase tracking-widest px-2 py-1 rounded-full text-white" style={{ background: severityColor }}>{severity}</span>
                        )}
                        <span className="text-yellow-600 text-sm">{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</span>
                        <span className="text-xs font-bold px-2 py-1 rounded bg-amber-100 text-amber-800">{REPLY_CATEGORY_LABELS[category]}</span>
                        <span className="text-xs text-[var(--muted)]">{rev.author || "Google reviewer"} · 2-7 days ago</span>
                      </div>
                      <button onClick={() => persistReplyDone(hash, !resolved)} className="text-xs font-bold px-2 py-1 rounded border border-[var(--border)] bg-white hover:bg-gray-50">
                        {resolved ? "↩ Unresolve" : "✓ Mark resolved"}
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-[var(--fg)] italic leading-relaxed mb-3">&ldquo;{rev.text}&rdquo;</p>
                      <details className="crisis-detail group">
                        <summary className="cursor-pointer flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 transition select-none">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold uppercase tracking-widest text-purple-700">✨ AI reply draft</span>
                            <span className="text-xs text-purple-600 font-medium">— {STYLE_LABELS[style]}</span>
                            {isAiLoading && (
                              <span className="text-xs text-purple-500 font-medium flex items-center gap-1">
                                <span className="inline-block w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                                generating…
                              </span>
                            )}
                            {usingAi && !isAiLoading && (
                              <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                                LLM
                              </span>
                            )}
                          </div>
                          <span className="text-purple-600 group-open:rotate-180 transition-transform">⌄</span>
                        </summary>
                        <div className="mt-3 bg-white border border-purple-200 rounded-lg p-4">
                          {isEditing[i] ? (
                            <textarea
                              className="w-full text-sm leading-relaxed border border-purple-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 mb-3"
                              rows={5}
                              value={draft}
                              onChange={(e) => setEditTexts((p) => ({ ...p, [i]: e.target.value }))}
                            />
                          ) : (
                            <p className="text-sm leading-relaxed whitespace-pre-wrap mb-3">{draft}</p>
                          )}
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => handleCopy(draft, copyKey)}
                              className="text-xs font-bold px-3 py-2 rounded-lg text-white transition"
                              style={{ background: copiedKey === copyKey ? "#10b981" : "#7c3aed" }}
                            >
                              {copiedKey === copyKey ? "✓ Copied!" : "📋 Copy reply"}
                            </button>
                            <button
                              onClick={() => { cycleStyle(i); setEditTexts((p) => { const n = { ...p }; delete n[i]; return n; }); }}
                              className="text-xs font-bold px-3 py-2 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-50"
                            >
                              ✏️ Style: {STYLE_LABELS[style]} →
                            </button>
                            <button
                              onClick={() => setIsEditing((p) => ({ ...p, [i]: !p[i] }))}
                              className={`text-xs font-bold px-3 py-2 rounded-lg border transition ${isEditing[i] ? "border-purple-400 bg-purple-50 text-purple-700" : "border-[var(--border)] bg-white hover:bg-gray-50"}`}
                            >
                              {isEditing[i] ? "✓ Done" : "📝 Edit"}
                            </button>
                            <span className="ml-auto text-xs text-[var(--muted)]">~30s to post</span>
                          </div>
                        </div>
                      </details>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Quick-win checklist — real numbers, actionable per clinic state */}
        {(() => {
          const reviewMilestone = (Math.floor(c.total_reviews / 50) + 1) * 50;
          const reviewsToTarget = reviewMilestone - c.total_reviews;
          const lgRatio = c.scraped_review_count > 0 ? c.local_guide_count / c.scraped_review_count : 0;
          const wins: { id: string; title: string; current: number; target: number; unit: string; sub: string; href?: string; done?: boolean }[] = [];
          if (negatives.length > 0) {
            wins.push({
              id: "reply",
              title: "Reply to pending negative reviews",
              current: negatives.length - pendingReplies,
              target: negatives.length,
              unit: "replied",
              sub: pendingReplies === 0
                ? `All ${negatives.length} handled — Trust +${(negatives.length * REPLY_TRUST_DELTA).toFixed(1)} captured`
                : `${pendingReplies} remaining · projected Trust +${(pendingReplies * REPLY_TRUST_DELTA).toFixed(1)}`,
              href: "#crisis",
              done: pendingReplies === 0,
            });
          }
          if (c.total_reviews < 5000) {
            wins.push({
              id: "reviews",
              title: `Get to ${reviewMilestone.toLocaleString()} total reviews`,
              current: c.total_reviews,
              target: reviewMilestone,
              unit: "reviews",
              sub: `${reviewsToTarget} more this month — copy our request templates ↓`,
              href: "#review-requests",
              done: false,
            });
          }
          if (c.rating < 4.5) {
            wins.push({
              id: "rating",
              title: "Improve average rating to 4.5★",
              current: Math.round(c.rating * 10),
              target: 45,
              unit: "(rating × 10)",
              sub: `Currently ★${c.rating.toFixed(1)} — every new 5★ review pulls the average up`,
              done: false,
            });
          }
          if (lgRatio < 0.10 && c.scraped_review_count >= 10) {
            wins.push({
              id: "lg",
              title: "Get more Local Guide reviewers",
              current: c.local_guide_count,
              target: Math.max(c.local_guide_count + 5, Math.ceil(c.scraped_review_count * 0.1)),
              unit: "Local Guides",
              sub: `Currently ${(lgRatio * 100).toFixed(0)}% — Google weights LG reviews higher. Ask power-reviewer patients.`,
              done: false,
            });
          }
          if (wins.length === 0) return null;
          return (
            <section className="mb-6">
              <Card accent="#10b981">
                <div className="flex items-baseline justify-between gap-3 mb-1 flex-wrap">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <span>🎯</span> Quick wins this month
                    <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      {wins.filter((w) => !w.done).length} open
                    </span>
                  </h2>
                </div>
                <p className="text-xs text-[var(--muted)] mb-4">
                  Actions ranked by impact, with real numbers from your data. Click to jump to the section.
                </p>
                <ol className="space-y-3">
                  {wins.map((w, i) => {
                    const pct = Math.min(100, Math.round((w.current / w.target) * 100));
                    return (
                      <li key={w.id} className={`border border-[var(--border)] rounded-lg p-3 ${w.done ? "opacity-60" : ""}`}>
                        <div className="flex items-baseline justify-between gap-3 mb-1.5 flex-wrap">
                          <div className="text-sm font-bold flex items-center gap-2">
                            <span className="text-xs font-black tabular-nums w-5 h-5 rounded-full inline-flex items-center justify-center bg-emerald-100 text-emerald-700">
                              {w.done ? "✓" : i + 1}
                            </span>
                            {w.href ? (
                              <a href={w.href} className="hover:underline">{w.title}</a>
                            ) : (
                              <span>{w.title}</span>
                            )}
                          </div>
                          <div className="text-xs tabular-nums text-[var(--muted)]">
                            <strong className="text-[var(--fg)]">{w.current.toLocaleString()}</strong> / {w.target.toLocaleString()} {w.unit}
                          </div>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                          <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="text-xs text-[var(--muted)]">{w.sub}</div>
                      </li>
                    );
                  })}
                </ol>
              </Card>
            </section>
          );
        })()}

        {/* Performance Overview (Trust Score breakdown + Rating trajectory) */}
        <div className="space-y-6 mb-6">
            <Card>
              <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
                <div>
                  <h2 className="text-lg font-bold">Trust Score breakdown</h2>
                  <p className="text-xs text-[var(--muted)]">
                    Pull each lever to improve. Hover for tips.
                    {" "}
                    <a href="/about/trust-score" target="_blank" rel="noopener" className="text-blue-600 hover:underline">
                      How is this computed? →
                    </a>
                  </p>
                </div>
                <div
                  className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                  style={{ background: trendBadge.bg, color: trendBadge.color }}
                >
                  {trendBadge.label}
                </div>
              </div>
              <div className="space-y-3">
                <ScoreLever
                  label="Rating quality"
                  value={Math.round((c.rating / 5) * 50)}
                  max={50}
                  hint={`★${c.rating.toFixed(1)} of 5 · biggest lever — convert detractors`}
                  accent="#7c3aed"
                />
                <ScoreLever
                  label="Review volume"
                  value={Math.min(40, Math.round(Math.log10(Math.max(1, c.total_reviews)) * 12))}
                  max={40}
                  hint={`${c.total_reviews.toLocaleString()} reviews — log-scaled, diminishing returns past 5,000`}
                  accent="#0891b2"
                />
                <ScoreLever
                  label="Local Guide ratio"
                  value={c.scraped_review_count > 0 ? Math.min(10, Math.round((c.local_guide_count / c.scraped_review_count) * 20)) : 0}
                  max={10}
                  hint={`${c.local_guide_count} verified · attract Google Local Guides`}
                  accent="#10b981"
                />
                <ScoreLever
                  label="Reviewer authority"
                  value={Math.min(5, Math.round(Math.log10(Math.max(1, c.avg_author_review_count)) * 2))}
                  max={5}
                  hint={`avg ${c.avg_author_review_count.toFixed(1)} reviews per reviewer`}
                  accent="#f59e0b"
                />
              </div>
            </Card>

            {/* 30-day rating trajectory — real data */}
            <Card>
              <div className="flex items-baseline justify-between gap-4 mb-3 flex-wrap">
                <h2 className="text-lg font-bold">Rating trajectory</h2>
                <span className="text-xs px-2 py-1 rounded-full font-bold"
                  style={{ background: trendBadge.bg, color: trendBadge.color }}>
                  {trendBadge.label}
                </span>
              </div>
              <RatingTrendChart trend={c.rating_trend} />
            </Card>
        </div>

        {/* Beat competitor #1 — challenge widget */}
        {(() => {
          const topComp = competitors.find((x) => x.id !== c.id && x.trust_score > c.trust_score);
          if (!topComp) return null;
          const ratingGap = topComp.rating - c.rating;
          const myVolumeLever = Math.min(40, Math.round(Math.log10(Math.max(1, c.total_reviews)) * 12));
          const compVolumeLever = Math.min(40, Math.round(Math.log10(Math.max(1, topComp.total_reviews)) * 12));
          const reviewsNeeded = compVolumeLever > myVolumeLever
            ? Math.ceil(Math.pow(10, compVolumeLever / 12) - c.total_reviews)
            : 0;
          const trustGap = topComp.trust_score - c.trust_score;
          return (
            <section className="mb-6">
              <div className="rounded-2xl p-5 text-white overflow-hidden" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)" }}>
                <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest opacity-80">🥇 Beat your #1 competitor</div>
                    <h2 className="text-xl md:text-2xl font-black tracking-tight mt-1">
                      {topComp.name}
                    </h2>
                  </div>
                  <div className="text-right">
                    <div className="text-xs opacity-80">Trust gap</div>
                    <div className="text-3xl font-black tabular-nums">+{trustGap}</div>
                  </div>
                </div>
                <p className="text-sm opacity-90 mb-3">
                  To surpass them, pick the faster path:
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-white/15 backdrop-blur rounded-lg p-3">
                    <div className="text-[10px] uppercase tracking-widest opacity-80 mb-1 font-bold">Path 1 — rating</div>
                    {ratingGap > 0 ? (
                      <>
                        <div className="text-xl font-black">★{topComp.rating.toFixed(1)} <span className="text-sm font-normal opacity-80">(+{ratingGap.toFixed(1)})</span></div>
                        <div className="text-xs opacity-85 mt-1">Each new 5★ pulls your avg up. Reply to negatives to convert detractors.</div>
                      </>
                    ) : (
                      <>
                        <div className="text-xl font-black">★{c.rating.toFixed(1)} <span className="text-sm font-normal opacity-80">(match)</span></div>
                        <div className="text-xs opacity-85 mt-1">Rating already matches — focus on Path 2.</div>
                      </>
                    )}
                  </div>
                  <div className="bg-white/15 backdrop-blur rounded-lg p-3">
                    <div className="text-[10px] uppercase tracking-widest opacity-80 mb-1 font-bold">Path 2 — review volume</div>
                    {reviewsNeeded > 0 ? (
                      <>
                        <div className="text-xl font-black tabular-nums">+{reviewsNeeded.toLocaleString()}</div>
                        <div className="text-xs opacity-85 mt-1">Reviews needed to match their volume lever. Use the templates below.</div>
                      </>
                    ) : (
                      <>
                        <div className="text-xl font-black">match ✓</div>
                        <div className="text-xs opacity-85 mt-1">Volume already matches — focus on Path 1.</div>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between gap-3 flex-wrap text-xs">
                  <span className="opacity-90">Updated as their data changes — track weekly.</span>
                  <a href="#review-requests" className="font-bold underline">Get review templates ↓</a>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Competitors */}
        <section className="mb-6">
          <Card>
            <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
              <div>
                <h2 className="text-lg font-bold">Competitor analysis · 1km radius</h2>
                <p className="text-xs text-[var(--muted)]">Same category + district. Your position highlighted.</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wider text-[var(--muted)] border-b border-[var(--border)]">
                  <tr>
                    <th className="text-left py-2 font-bold">#</th>
                    <th className="text-left py-2 font-bold">Clinic</th>
                    <th className="text-right py-2 font-bold">Rating</th>
                    <th className="text-right py-2 font-bold">Reviews</th>
                    <th className="text-right py-2 font-bold">Trust</th>
                    <th className="text-center py-2 font-bold">Weakness</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.slice(0, 6).map((x, i) => {
                    const me = x.id === c.id;
                    const negFirst = (x.sample_reviews_negative ?? [])[0];
                    const weakness = negFirst ? draftReplyStyled(negFirst.text, x.name, "", 0).category : null;
                    return (
                      <tr key={x.id} className={me ? "bg-blue-50" : "hover:bg-gray-50"}>
                        <td className="py-2 text-xs tabular-nums font-bold">#{i + 1}</td>
                        <td className="py-2 truncate max-w-xs font-medium">
                          {x.name}
                          {me && <span className="ml-2 text-xs text-blue-700 font-bold">(you)</span>}
                        </td>
                        <td className="py-2 text-right tabular-nums">★{x.rating.toFixed(1)}</td>
                        <td className="py-2 text-right tabular-nums text-[var(--muted)]">{x.total_reviews.toLocaleString()}</td>
                        <td className="py-2 text-right tabular-nums font-bold">{x.trust_score}</td>
                        <td className="py-2 text-center">
                          {weakness ? (
                            <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800">{REPLY_CATEGORY_LABELS[weakness]}</span>
                          ) : (
                            <span className="text-xs text-[var(--muted)]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[var(--muted)] mt-3">
              You rank <strong>#{myRank}</strong> of {competitors.length} in {c.district || c.city_label || "your area"} · {cityClinicCount.toLocaleString()} clinics in city
            </p>
          </Card>
        </section>

        {/* Multi-platform reputation + Pricing intelligence — Sprint 2 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <PlatformReputationCard clinic={c} isDemo={isDemo} />
          <PricingIntelCard clinic={c} competitors={competitors} isDemo={isDemo} />
        </div>

        {/* Topics + Sample reviews 2-col */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {c.mentioned_topics.length > 0 && (
            <Card>
              <h2 className="text-lg font-bold mb-1">What reviewers say about you</h2>
              <p className="text-xs text-[var(--muted)] mb-3">
                Topics from your last {c.scraped_review_count} reviews.
                {topicFilter && (
                  <button onClick={() => setTopicFilter(null)} className="ml-2 text-blue-600 font-bold hover:underline">
                    ✕ Clear filter
                  </button>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {c.mentioned_topics.slice(0, 14).map((t) => {
                  const isNegative = ["long_wait", "expensive"].includes(t.topic);
                  const active = topicFilter === t.topic;
                  return (
                    <button
                      key={t.topic}
                      onClick={() => setTopicFilter(active ? null : t.topic)}
                      className="px-3 py-1.5 rounded-full border text-sm flex items-center gap-2 hover:shadow-sm transition"
                      style={{
                        background: active ? (isNegative ? "#fca5a5" : "#6ee7b7") : (isNegative ? "#fee2e2" : "#dcfce7"),
                        borderColor: active ? (isNegative ? "#ef4444" : "#10b981") : (isNegative ? "#fecaca" : "#bbf7d0"),
                        color: isNegative ? "#991b1b" : "#065f46",
                        fontWeight: active ? 800 : undefined,
                        outline: active ? "2px solid currentColor" : undefined,
                      }}
                    >
                      <span>{TOPIC_LABELS[t.topic] ?? t.topic}</span>
                      <span className="text-xs opacity-70 tabular-nums">×{t.count}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          )}

          {samples.length > 0 && (
            <Card>
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <h2 className="text-lg font-bold">
                  {topicFilter ? `Reviews mentioning "${TOPIC_LABELS[topicFilter] ?? topicFilter}"` : "Recent ★4-5 reviews"}
                </h2>
                {topicFilter && (
                  <button onClick={() => setTopicFilter(null)} className="text-xs font-bold text-blue-600 hover:underline">✕ Clear</button>
                )}
              </div>
              <p className="text-xs text-[var(--muted)] mb-3">
                {topicFilter ? `${samples.length} matching review${samples.length !== 1 ? "s" : ""} — use as social proof.` : "Use as social proof on your marketing."}
              </p>
              {samples.length === 0 ? (
                <p className="text-sm text-[var(--muted)] py-4 text-center">No reviews match this topic.</p>
              ) : (
                <div className="space-y-3">
                  {samples.map((s, i) => {
                    const tKey = `testimonial-${i}`;
                    const testimonialText = `"${s.text}" — ${s.author || "Google reviewer"} ★${s.rating}/5`;
                    return (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg border border-[var(--border)]">
                        <div className="text-yellow-600 text-xs mb-1">{"★".repeat(s.rating)}</div>
                        <p className="text-sm text-[var(--fg)] line-clamp-3 leading-relaxed mb-2">{s.text}</p>
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="text-[var(--muted)]">— {s.author || "Google reviewer"}</span>
                          <button
                            onClick={() => handleCopy(testimonialText, tKey)}
                            className="font-bold transition"
                            style={{ color: copiedKey === tKey ? "#10b981" : "#7c3aed" }}
                          >
                            {copiedKey === tKey ? "✓ Copied!" : "📋 Copy as testimonial"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Review request templates — 클리닉이 환자한테 보내는 LINE/SMS 템플릿 */}
        <section id="review-requests" className="mb-6">
          <Card>
            <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span>📨</span> Review request templates
                </h2>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Copy these to your LINE / SMS broadcast. Replace <code className="bg-gray-100 px-1 rounded">{"{name}"}</code> with the patient's first name and <code className="bg-gray-100 px-1 rounded">{"[link]"}</code> with your Google review URL.
                </p>
              </div>
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {([
                  ["en", "EN"],
                  ["ko", "한국어"],
                  ["th", "ไทย"],
                ] as const).map(([code, label]) => (
                  <button
                    key={code}
                    onClick={() => setReviewLang(code)}
                    className={`text-xs font-bold px-3 py-1.5 rounded transition ${
                      reviewLang === code ? "bg-white shadow-sm text-[var(--fg)]" : "text-[var(--muted)] hover:text-[var(--fg)]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3 mt-4">
              {REVIEW_TEMPLATES[reviewLang].map((tpl, idx) => {
                const filled = tpl.body.replace(/\{clinic\}/g, c.name);
                const copyKey = `review-tpl-${reviewLang}-${idx}`;
                return (
                  <div key={copyKey} className="border border-[var(--border)] rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 flex items-center justify-between border-b border-[var(--border)]">
                      <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
                        {tpl.label} · {tpl.timing}
                      </div>
                      <button
                        onClick={() => handleCopy(filled, copyKey)}
                        className="text-xs font-bold px-3 py-1.5 rounded text-white transition"
                        style={{ background: copiedKey === copyKey ? "#10b981" : "#7c3aed" }}
                      >
                        {copiedKey === copyKey ? "✓ Copied!" : "📋 Copy"}
                      </button>
                    </div>
                    <div className="p-3 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {filled}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-[var(--muted)] mt-4 leading-relaxed">
              💡 Want us to send these automatically to your last 50 patients each week?{" "}
              <a href="/for-clinics" className="font-bold underline">Review request campaigns →</a>
              {" "}฿{PRICE_REVIEW_CAMPAIGN_THB.toLocaleString()}/mo
            </p>
          </Card>
        </section>

        {/* Lead inflow */}
        <section id="leads" className="mb-6">
          <Card>
            <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span>📥</span> Lead inflow
                  {recentLeads.length > 0 && (
                    <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                      {recentLeads.length} recent
                    </span>
                  )}
                </h2>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Booking form submissions from <code className="bg-gray-100 px-1.5 py-0.5 rounded">/clinic/{c.id.slice(0, 16)}…</code>
                </p>
              </div>
              {isPartner ? (
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">● Live · routing active</span>
                </div>
              ) : (
                <a
                  href="/for-clinics#pilot"
                  className="text-xs font-bold px-3 py-2 rounded-lg text-white"
                  style={{ background: "#10b981" }}
                >
                  🔗 Wire LINE webhook
                </a>
              )}
            </div>

            {recentLeads.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-[var(--border)] rounded-xl p-6">
                <div className="text-center">
                  <div className="text-4xl mb-2 opacity-40">📭</div>
                  <p className="text-sm font-bold text-[var(--fg)]">No leads yet</p>
                  <p className="text-xs text-[var(--muted)] mt-1 max-w-md mx-auto">
                    Your /clinic/{c.id.slice(0, 12)}… page is indexed and accepting form submissions. Leads will appear here in real-time.
                  </p>
                  <div className="mt-4 grid sm:grid-cols-3 gap-2 max-w-md mx-auto text-xs">
                    <Stat tiny label="Page indexed" value="✓" />
                    <Stat tiny label="Form active" value="✓" />
                    <Stat tiny label="Notify channel" value={isPartner ? "✓" : "—"} />
                  </div>
                  <button
                    onClick={() => setShowSampleLead((v) => !v)}
                    className="mt-5 text-xs font-bold px-3 py-2 rounded-lg bg-white border border-[var(--border)] hover:bg-gray-50"
                  >
                    {showSampleLead ? "✕ Hide sample" : "👁 Preview a sample lead"}
                  </button>
                </div>
                {showSampleLead && (
                  <div className="mt-5 pt-5 border-t border-[var(--border)]">
                    <div className="text-xs text-[var(--muted)] mb-2 text-center">
                      🧪 <strong>This is a sample</strong> — actual leads will look like this in your dashboard.
                    </div>
                    <LeadCard
                      lead={{
                        id: "sample-001",
                        clinic_id: c.id,
                        clinic_name: c.name,
                        name: "Suchada P.",
                        email: "suchada.p@example.com",
                        phone: "+66 81 234 5678",
                        service: c.categories[0] || "Botox",
                        date: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString().slice(0, 10),
                        time_slot: "Afternoon",
                        notes: "First-time visit. Found you via 'best Botox Bangkok' search.",
                        context: "/clinic/" + c.id.slice(0, 8),
                        ua: "Mozilla/5.0",
                        ref: "google",
                        at: new Date(Date.now() - 1800 * 1000).toISOString(),
                      }}
                      status="new"
                      note=""
                      onStatusChange={() => {}}
                      onNoteChange={() => {}}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    status={leadStatus[lead.id] ?? "new"}
                    note={leadNotes[lead.id] ?? ""}
                    onStatusChange={(s) => persistLeadStatus(lead.id, s)}
                    onNoteChange={(n) => persistLeadNote(lead.id, n)}
                  />
                ))}
              </div>
            )}

            {isPartner && (
              <p className="text-xs text-[var(--muted)] mt-4">
                ฿200/lead exclusivity · 24h hold · no-show refund · or ฿{DASHBOARD_FEE_THB.toLocaleString()}/month flat for unlimited leads in your category
              </p>
            )}
          </Card>
        </section>

        {/* Partner testimonials — social proof for conversion (only non-partners see it) */}
        <PartnerTestimonials isPartner={isPartner} />

        {/* Weekly digest preview — recurring-value proof */}
        <WeeklyDigestPreview
          clinic={c}
          competitors={competitors}
          newLeads={recentLeads.filter((l) => (leadStatus[l.id] ?? "new") === "new").length}
          pendingReplies={pendingReplies}
          isPartner={isPartner}
        />

        {/* Email weekly digest signup — lead capture for non-partners */}
        {!isPartner && (
          <section className="mb-6">
            <Card accent="#6366f1">
              <div className="grid md:grid-cols-[1fr_auto] gap-4 items-center">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2 mb-1">
                    <span>📧</span> Email me when this changes
                  </h2>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">
                    Get a weekly summary every Monday — new reviews, Trust Score moves, and competitor changes.
                    No spam, no payment, unsubscribe anytime.
                  </p>
                </div>
                {digestStatus === "done" ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm font-bold text-emerald-700">
                    ✓ Subscribed — first digest arrives next Monday.
                  </div>
                ) : (
                  <form onSubmit={submitDigestSignup} className="flex gap-2 flex-wrap">
                    <input
                      type="email"
                      required
                      placeholder="you@clinic.com"
                      value={digestEmail}
                      onChange={(e) => { setDigestEmail(e.target.value); if (digestStatus === "error") setDigestStatus("idle"); }}
                      className="px-3 py-2 rounded-lg border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 min-w-[200px]"
                    />
                    <button
                      type="submit"
                      disabled={digestStatus === "submitting"}
                      className="text-sm font-bold px-4 py-2 rounded-lg text-white disabled:opacity-50"
                      style={{ background: "#6366f1" }}
                    >
                      {digestStatus === "submitting" ? "..." : "Subscribe"}
                    </button>
                  </form>
                )}
              </div>
              {digestStatus === "error" && (
                <p className="text-xs text-red-600 mt-2">Couldn&apos;t subscribe — please check the email and try again.</p>
              )}
            </Card>
          </section>
        )}

        {/* Upsell footer — partner: subscription mgmt / non-partner: service unbundle */}
        <section className="mb-6">
          <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)" }}>
            <div className="relative">
              <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">
                {isPartner ? "Your subscription" : "The dashboard is free. Want us to do the work?"}
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3">
                {isPartner ? "Manage your services" : "Pick the services that take work off your plate"}
              </h2>
              {!isPartner && (
                <p className="text-sm opacity-90 mb-5 max-w-2xl">
                  Everything on this dashboard is yours to keep, free. These add-ons are if you want us to actually <em>do</em> the work — post replies for you, send review requests, route leads to your LINE, etc.
                </p>
              )}
              <ul className="grid sm:grid-cols-2 gap-3 text-sm mb-6">
                <li className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="flex items-baseline justify-between gap-2 mb-0.5 flex-wrap">
                    <span className="font-bold">🤖 Auto-reply posting</span>
                    <span className="text-xs font-black tabular-nums opacity-90">฿{PRICE_AUTO_REPLY_THB.toLocaleString()}/mo</span>
                  </div>
                  <div className="text-xs opacity-85">We post AI-drafted replies to Google for you. No copy-paste.</div>
                </li>
                <li className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="flex items-baseline justify-between gap-2 mb-0.5 flex-wrap">
                    <span className="font-bold">📨 Review request campaigns</span>
                    <span className="text-xs font-black tabular-nums opacity-90">฿{PRICE_REVIEW_CAMPAIGN_THB.toLocaleString()}/mo</span>
                  </div>
                  <div className="text-xs opacity-85">Weekly LINE/SMS to your last 50 patients, asking for a review.</div>
                </li>
                <li className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="flex items-baseline justify-between gap-2 mb-0.5 flex-wrap">
                    <span className="font-bold">📥 Lead routing</span>
                    <span className="text-xs font-black tabular-nums opacity-90">฿50/lead · or ฿{PRICE_LEAD_ROUTING_THB.toLocaleString()}/mo</span>
                  </div>
                  <div className="text-xs opacity-85">Booking forms → your LINE within 60 seconds. 24h exclusivity hold.</div>
                </li>
                <li className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="flex items-baseline justify-between gap-2 mb-0.5 flex-wrap">
                    <span className="font-bold">⭐ Featured slot</span>
                    <span className="text-xs font-black tabular-nums opacity-90">from ฿{PRICE_FEATURED_THB.toLocaleString()}/mo</span>
                  </div>
                  <div className="text-xs opacity-85">Top placement in /clinic search for your category + district.</div>
                </li>
                <li className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="flex items-baseline justify-between gap-2 mb-0.5 flex-wrap">
                    <span className="font-bold">🌐 Korean / EN SEO</span>
                    <span className="text-xs font-black tabular-nums opacity-90">฿{PRICE_KOREAN_SEO_THB.toLocaleString()}/mo</span>
                  </div>
                  <div className="text-xs opacity-85">Localized content + reviews — capture medical tourism search.</div>
                </li>
                <li className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="flex items-baseline justify-between gap-2 mb-0.5 flex-wrap">
                    <span className="font-bold">📞 Monthly strategy call</span>
                    <span className="text-xs font-black tabular-nums opacity-90">฿{PRICE_STRATEGY_CALL_THB.toLocaleString()}/mo</span>
                  </div>
                  <div className="text-xs opacity-85">30-min 1-on-1 — review your numbers, plan next month.</div>
                </li>
              </ul>
              <div className="flex items-center gap-3 flex-wrap">
                <a href="/for-clinics#pilot" className="px-5 py-2.5 rounded-full bg-white text-purple-700 font-black hover:opacity-90 transition">
                  {isPartner ? "Add a service →" : "Talk to us — pick what fits →"}
                </a>
                <a href="/for-clinics" className="px-5 py-2.5 rounded-full border-2 border-white text-white font-bold hover:bg-white/10 transition">
                  See pricing
                </a>
                <span className="text-xs opacity-80 ml-2">
                  {isPartner ? "Cancel any service anytime via LINE." : "Pay only for what you pick. No bundle lock-in."}
                </span>
              </div>
            </div>
          </div>
        </section>

        <footer className="text-xs text-[var(--muted)] text-center py-4">
          Dashboard refreshes ~30 min after each Google review scrape. Data: {SITE_DOMAIN}.{" "}
          Questions: <strong>partners@{SITE_DOMAIN}</strong> · LINE <strong>@405zhjqb</strong>
        </footer>
      </div>
    </div>
  );
}

// ── small components ───────────────────────────────────────

function LeadCard({
  lead, status, note, onStatusChange, onNoteChange,
}: {
  lead: LeadRecord;
  status: LeadStatus;
  note: string;
  onStatusChange: (s: LeadStatus) => void;
  onNoteChange: (n: string) => void;
}) {
  const [showNote, setShowNote] = useState(!!note);
  const [draftNote, setDraftNote] = useState(note);
  const isFresh = Date.now() - new Date(lead.at).getTime() < 6 * 3600_000;
  const meta = LEAD_STATUS_META[status];
  const dim = status === "no_show" || status === "cancelled";

  return (
    <div className={`border border-[var(--border)] rounded-xl overflow-hidden bg-white transition ${dim ? "opacity-60" : ""}`}>
      <div
        className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between gap-2 flex-wrap"
        style={{ background: status === "new" && isFresh ? "#ecfdf5" : "#fafafa" }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <Avatar name={lead.name || lead.email} email={lead.email} size={32} />
          <span
            className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
            style={{ color: meta.color, background: meta.bg }}
          >
            {meta.label}
          </span>
          <span className="text-sm font-bold">{lead.name || "(no name)"}</span>
          {lead.service && (
            <span className="text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-800">{lead.service}</span>
          )}
        </div>
        <span className="text-xs text-[var(--muted)] tabular-nums">{relTime(lead.at)}</span>
      </div>
      <div className="p-4 space-y-2 text-sm">
        <LeadField label="Contact" value={lead.email + (lead.phone ? ` · ${lead.phone}` : "")} />
        {(lead.date || lead.time_slot) && (
          <LeadField label="Preferred" value={[lead.date, lead.time_slot].filter(Boolean).join(" · ")} />
        )}
        {lead.notes && <LeadField label="Customer notes" value={lead.notes} />}
        {lead.ref && lead.ref !== "direct" && (
          <LeadField label="Source" value={lead.ref.replace(/^https?:\/\//, "").slice(0, 60)} />
        )}
        {showNote && (
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">Internal note</div>
            <textarea
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              onBlur={() => { if (draftNote !== note) onNoteChange(draftNote); }}
              rows={2}
              placeholder="Add internal note (saved automatically)"
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-xs resize-y focus:outline-none focus:border-gray-400"
            />
          </div>
        )}
      </div>
      <div className="px-4 py-3 border-t border-[var(--border)] bg-gray-50 flex items-center gap-2 flex-wrap">
        <a
          href={`mailto:${lead.email}?subject=${encodeURIComponent(`Re: your ${lead.service || "consultation"} inquiry at ${lead.clinic_name}`)}`}
          className="text-xs font-bold px-3 py-2 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700"
        >
          📧 Email
        </a>
        {lead.phone && (
          <a
            href={`tel:${lead.phone.replace(/[^+\d]/g, "")}`}
            className="text-xs font-bold px-3 py-2 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-100"
          >
            📞 Call
          </a>
        )}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as LeadStatus)}
          className="text-xs font-bold px-3 py-2 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-100 cursor-pointer"
        >
          {(Object.keys(LEAD_STATUS_META) as LeadStatus[]).map((s) => (
            <option key={s} value={s}>{LEAD_STATUS_META[s].label}</option>
          ))}
        </select>
        <button
          onClick={() => setShowNote((v) => !v)}
          className="text-xs font-bold px-3 py-2 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-100"
        >
          {showNote ? "− Hide note" : "+ Note"}
        </button>
        <span className="ml-auto text-[10px] text-[var(--muted)] tabular-nums font-mono">{lead.id.slice(0, 10)}</span>
      </div>
    </div>
  );
}
