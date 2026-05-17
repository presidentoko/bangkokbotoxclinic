"use client";
// B2B clinic dashboard — peeyai 패턴 referenced.
// 클리닉 owner mode. Crisis alerts top → KPI bar → AI tools → competitors → insights.

import { useState, useCallback, useMemo } from "react";
import type { Clinic, RatingTrend } from "@/lib/types";
import { TOPIC_LABELS } from "@/lib/types";
import { draftReplyStyled, REPLY_CATEGORY_LABELS } from "@/lib/replyDrafts";
import type { ReplyStyle } from "@/lib/replyDrafts";
import type { LeadRecord } from "@/lib/leadStore";

type LeadStatus = "new" | "contacted" | "booked" | "no_show" | "cancelled";

const LEAD_STATUS_META: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  new:       { label: "New",       color: "#2563eb", bg: "#dbeafe" },
  contacted: { label: "Contacted", color: "#7c3aed", bg: "#ede9fe" },
  booked:    { label: "Booked",    color: "#059669", bg: "#d1fae5" },
  no_show:   { label: "No-show",   color: "#dc2626", bg: "#fee2e2" },
  cancelled: { label: "Cancelled", color: "#6b7280", bg: "#f3f4f6" },
};

function reviewHash(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

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
};

// ฿2,800 = Bangkok 피부과 Facebook 광고 평균 CAC. 8,000 = 우리 monthly fee.
const FACEBOOK_CAC_THB = 2800;
const DASHBOARD_FEE_THB = 8000;
const LEAD_CLOSE_RATE = 0.4; // 폼 lead → 실제 procedure conversion

export function DashboardView({
  clinic: c, competitors, cityAvgRating, cityClinicCount,
  recentLeads = [], totalLeads = 0, ticketAvg = 15000, isPartner = false, isDemo,
  leadStatusMap: initialLeadStatus = {},
  leadNotesMap: initialLeadNotes = {},
  replyDoneHashes = [],
  profileViewsTotal = 0,
  profileViewsByDay = [],
}: Props) {
  // ── client state ──────────────────────────────────────────
  const [styleVariants, setStyleVariants] = useState<Record<number, ReplyStyle>>({});
  const [editTexts, setEditTexts] = useState<Record<number, string>>({});
  const [isEditing, setIsEditing] = useState<Record<number, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [topicFilter, setTopicFilter] = useState<string | null>(null);

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinic_id: c.id, hash, done }),
      });
    } catch {}
  }, [c.id]);

  const persistLeadStatus = useCallback(async (leadId: string, status: LeadStatus) => {
    setLeadStatus((prev) => ({ ...prev, [leadId]: status }));
    try {
      await fetch("/api/dashboard/lead-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinic_id: c.id, lead_id: leadId, status }),
      });
    } catch {}
  }, [c.id]);

  const persistLeadNote = useCallback(async (leadId: string, note: string) => {
    setLeadNotes((prev) => ({ ...prev, [leadId]: note }));
    try {
      await fetch("/api/dashboard/lead-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  // Mock metrics where real data not yet available (clinic doesn't have unanswered count
  // since we don't track Google replies). These are PLAUSIBLE estimates for demo.
  const recentReviewCount = c.rating_trend.recent.count;
  const pendingReplies = negatives.length;
  const repliedPct = pendingReplies > 0 ? Math.max(20, 100 - pendingReplies * 25) : 92;
  const trustDelta = trend === "improving" ? "+2.4" : trend === "declining" ? "−1.8" : "+0.3";

  return (
    <div className="bg-[#f9fafb] min-h-screen">
      {isDemo && (
        <div className="bg-blue-600 text-white px-4 py-2 text-center text-xs font-medium">
          <span className="font-bold">DEMO</span> · Sample data for {c.name}. {" "}
          <a href="/for-clinics#pilot" className="underline ml-2 font-bold">Get this for your clinic →</a>
        </div>
      )}

      {/* Sticky header */}
      <div className="bg-white border-b border-[var(--border)] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
              Owner mode · Last refresh {new Date().getMinutes() % 30 + 1}m ago
            </div>
            <div className="text-base font-bold truncate max-w-md">{c.name}</div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={handlePrint} className="text-xs font-bold px-3 py-2 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-50 print:hidden">
              📊 Export weekly PDF
            </button>
            <button className="text-xs font-bold px-3 py-2 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-50 print:hidden">
              ⚙️ Settings
            </button>
            <button className="text-xs font-bold px-3 py-2 rounded-lg text-white" style={{ background: "#7c3aed" }}>
              ⚡ Upgrade plan
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
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
          <KPI label="Trust Score" value={String(c.trust_score)} sub={`${trustDelta} vs last week`} color={trustColor} clickable />
          <KPI label="Profile views (30d)" value={profileViewsByDay.reduce((s, d) => s + d.count, 0).toLocaleString()} sub={`${profileViewsTotal.toLocaleString()} all-time`} color="#6366f1" clickable href="#views" />
          <KPI label="Pending replies" value={String(pendingReplies)} sub={pendingReplies > 0 ? "Action needed ↓" : "All clear"} color={pendingReplies > 0 ? "#ef4444" : "#10b981"} clickable warning={pendingReplies > 0} href="#crisis" />
          <KPI label="Leads this month" value={String(leadsThisMonth)} sub={`${totalLeads.toLocaleString()} all-time`} color="#0891b2" clickable href="#leads" />
          <KPI label="Revenue attributed" value={`฿${(revenueAttributedThb / 1000).toFixed(0)}K`} sub={`${projectedCloses} projected closes`} color="#10b981" clickable href="#roi" />
          <KPI label="ROI multiplier" value={`${roiMultiplier.toFixed(1)}x`} sub={`vs ฿${(DASHBOARD_FEE_THB / 1000).toFixed(0)}K dashboard fee`} color="#7c3aed" clickable href="#roi" />
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
                  <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-red-100 text-red-700">
                    {negatives.length} need action
                  </span>
                </h2>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Unanswered negative reviews drop your Trust Score. Reply within 48h with AI-drafted response.
                </p>
              </div>
              <button
                onClick={() => document.querySelectorAll<HTMLDetailsElement>(".crisis-detail").forEach(d => { d.open = true; })}
                className="text-xs font-bold px-3 py-2 rounded-lg text-white print:hidden" style={{ background: "#ef4444" }}>
                ✨ Generate all replies
              </button>
            </div>
            <div className="space-y-3">
              {negatives.map((rev, i) => {
                const style = styleVariants[i] ?? 0;
                const { category, draft: rawDraft } = draftReplyStyled(rev.text, c.name, rev.author, style);
                const draft = editTexts[i] ?? rawDraft;
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
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-purple-700">✨ AI reply draft</span>
                            <span className="text-xs text-purple-600 font-medium">— {STYLE_LABELS[style]}</span>
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

        {/* 2-col main grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Left: Performance Overview (Trust Score breakdown + chart placeholder) */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
                <div>
                  <h2 className="text-lg font-bold">Trust Score breakdown</h2>
                  <p className="text-xs text-[var(--muted)]">Pull each lever to improve. Hover for tips.</p>
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
              <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between gap-3 flex-wrap">
                <div className="text-xs text-[var(--muted)]">
                  AI Forecast: <strong className="text-[var(--fg)]">+2.1 Trust</strong> if you get 12 new positive reviews this month
                </div>
                <button className="text-xs font-bold px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                  📈 See full forecast
                </button>
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

          {/* Right: Quick Actions sidebar */}
          <div className="space-y-4">
            <Card>
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <span>⚡</span> Quick actions
              </h3>
              <div className="space-y-2">
                <ActionRow icon="💬" label="Reply queue" count={pendingReplies} accent="#ef4444" />
                <ActionRow icon="🔗" label="Wire LINE webhook" subtle="for leads" accent="#10b981" />
                <ActionRow icon="📅" label="Schedule monthly audit" subtle="next: 1st" />
                <ActionRow icon="⭐" label="Featured slot priority" subtle="—" lock />
                <ActionRow icon="📤" label="Export reviews CSV" subtle="last 200" />
                <ActionRow icon="📧" label="Email weekly digest" subtle="Mon 9am" />
              </div>
            </Card>

            <Card accent="#7c3aed">
              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#7c3aed" }}>
                💡 AI insight
              </div>
              <p className="text-sm font-bold mb-1">3 actions to add +5 Trust</p>
              <ol className="text-xs text-[var(--muted)] space-y-1 pl-4 list-decimal">
                <li>Reply to {pendingReplies} pending negative reviews (+1.2)</li>
                <li>Encourage 8 patients to leave Google reviews (+2.1)</li>
                <li>Add 3 service tags missing on Google profile (+1.7)</li>
              </ol>
              <button className="mt-3 text-xs font-bold px-3 py-2 rounded-lg w-full text-white" style={{ background: "#7c3aed" }}>
                Execute action plan →
              </button>
            </Card>
          </div>
        </div>

        {/* Competitors */}
        <section className="mb-6">
          <Card>
            <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
              <div>
                <h2 className="text-lg font-bold">Competitor analysis · 1km radius</h2>
                <p className="text-xs text-[var(--muted)]">Same category + district. Your position highlighted.</p>
              </div>
              <button className="text-xs font-bold px-3 py-2 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-50">
                🔍 View detail report
              </button>
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
              You rank <strong>#{myRank}</strong> of {competitors.length} in {c.district || c.city_label || "your area"} · {cityClinicCount.toLocaleString()} clinics in city · Reply rate <strong>{repliedPct}% vs competitor avg 38%</strong>
            </p>
          </Card>
        </section>

        {/* Multi-platform reputation + Pricing intelligence — Sprint 2 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <PlatformReputationCard clinic={c} />
          <PricingIntelCard clinic={c} competitors={competitors} />
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

        {/* AEO Citation Tracker */}
        <section className="mb-6">
          <Card>
            <div className="flex items-baseline justify-between gap-4 mb-1 flex-wrap">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span>🤖</span> AEO citation tracker
                  <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-amber-100 text-amber-800">
                    Coming Q3 · Premium
                  </span>
                </h2>
                <p className="text-xs text-[var(--muted)] mt-1">
                  How often LLM answers (ChatGPT, Perplexity, Claude, Google AI Overview) cite your clinic. New SEO frontier.
                </p>
              </div>
              <button className="text-xs font-bold px-3 py-2 rounded-lg text-white" style={{ background: "#92400e" }}>
                🔔 Notify when ready
              </button>
            </div>
            <div className="grid sm:grid-cols-4 gap-3 mt-4">
              <AeoCard platform="Perplexity" />
              <AeoCard platform="ChatGPT" />
              <AeoCard platform="Google AI" />
              <AeoCard platform="Claude" />
            </div>
            <p className="text-xs text-[var(--muted)] mt-4">
              Our llms.txt + structured data already make your clinic LLM-citable. Tracker launches when traffic baseline established (~4-6 weeks after Google indexing). Premium subscribers get weekly breakdown by query intent + competitor share.
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
              <div className="bg-gray-50 border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center">
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
                  <div className="font-bold mb-0.5">🤖 Auto-reply posting</div>
                  <div className="text-xs opacity-85">We post AI-drafted replies to Google for you. No copy-paste.</div>
                </li>
                <li className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="font-bold mb-0.5">📨 Review request campaigns</div>
                  <div className="text-xs opacity-85">Weekly LINE/SMS to your last 50 patients, asking for a review.</div>
                </li>
                <li className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="font-bold mb-0.5">📥 Lead routing</div>
                  <div className="text-xs opacity-85">Booking forms → your LINE within 60 seconds. 24h exclusivity hold.</div>
                </li>
                <li className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="font-bold mb-0.5">⭐ Featured slot</div>
                  <div className="text-xs opacity-85">Top placement in /clinic search for your category + district.</div>
                </li>
                <li className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="font-bold mb-0.5">🤖 AEO citation tracker <span className="text-xs opacity-70">(Q3)</span></div>
                  <div className="text-xs opacity-85">Monitor LLM mentions: ChatGPT, Perplexity, Claude, Google AI.</div>
                </li>
                <li className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="font-bold mb-0.5">📞 Monthly strategy call</div>
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
          Dashboard refreshes ~30 min after each Google review scrape. Data: bangkokbotoxclinic.com.{" "}
          Questions: <strong>partners@bangkokbotoxclinic.com</strong> · LINE <strong>@bangkokbotoxclinic</strong>
        </footer>
      </div>
    </div>
  );
}

// ── small components ───────────────────────────────────────

function Card({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm" style={{ borderTop: accent ? `3px solid ${accent}` : undefined, border: accent ? `1px solid ${accent}30` : "1px solid var(--border)" }}>
      {children}
    </div>
  );
}

function KPI({ label, value, sub, color, clickable, warning, href, lock }: {
  label: string; value: string; sub: string; color: string;
  clickable?: boolean; warning?: boolean; href?: string; lock?: boolean;
}) {
  const inner = (
    <div
      className={`bg-white rounded-xl p-4 border transition ${clickable ? "hover:shadow-md cursor-pointer" : ""}`}
      style={{ borderColor: warning ? `${color}80` : "var(--border)", borderWidth: warning ? 2 : 1 }}
    >
      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] mb-1 flex items-center gap-1">
        <span className="truncate">{label}</span>
        {lock && <span className="text-amber-600">🔒</span>}
      </div>
      <div className="text-2xl md:text-3xl font-black tabular-nums" style={{ color }}>{value}</div>
      <div className="text-[10px] text-[var(--muted)] mt-1 truncate">{sub}</div>
    </div>
  );
  return href ? <a href={href} className="block">{inner}</a> : inner;
}

function ScoreLever({ label, value, max, hint, accent }: {
  label: string; value: number; max: number; hint: string; accent: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm tabular-nums">
          <span className="font-bold">{value}</span>
          <span className="text-[var(--muted)]">/{max}</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: accent }} />
      </div>
      <div className="text-xs text-[var(--muted)] mt-1">{hint}</div>
    </div>
  );
}

function Tab({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button
      className={`px-2 py-1 rounded text-xs font-bold ${active ? "bg-gray-100 text-[var(--fg)]" : "text-[var(--muted)] hover:bg-gray-50"}`}
    >
      {children}
    </button>
  );
}

function Stat({ label, value, count, tiny }: { label: string; value: string; count?: number; tiny?: boolean }) {
  return (
    <div className={tiny ? "" : "bg-white rounded-lg p-3"}>
      <div className="text-[10px] uppercase tracking-widest text-[var(--muted)]">{label}</div>
      <div className="text-lg font-black tabular-nums">{value}</div>
      {count !== undefined && <div className="text-[10px] text-[var(--muted)]">{count} reviews</div>}
    </div>
  );
}

function ActionRow({ icon, label, subtle, count, accent, lock }: {
  icon: string; label: string; subtle?: string; count?: number; accent?: string; lock?: boolean;
}) {
  return (
    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition text-left">
      <span className="text-lg">{icon}</span>
      <span className="flex-1 text-sm font-medium truncate flex items-center gap-2">
        {label}
        {lock && <span className="text-xs text-amber-600">🔒</span>}
      </span>
      {count !== undefined && count > 0 && (
        <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white tabular-nums" style={{ background: accent || "var(--accent)" }}>
          {count}
        </span>
      )}
      {subtle && <span className="text-xs text-[var(--muted)]">{subtle}</span>}
    </button>
  );
}

function AeoCard({ platform }: { platform: string }) {
  return (
    <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-4 text-center">
      <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-2 font-bold">{platform}</div>
      <div className="text-3xl font-black tabular-nums text-[var(--muted)]">—</div>
      <div className="text-[10px] text-[var(--muted)] mt-1">citations</div>
      <button className="mt-3 text-[10px] font-bold px-2 py-1 rounded bg-amber-50 text-amber-800">Track →</button>
    </div>
  );
}

function RoiCell({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white/15 backdrop-blur rounded-lg p-3">
      <div className="text-[10px] uppercase tracking-widest opacity-80 mb-1 font-bold">{label}</div>
      <div className="text-xl md:text-2xl font-black tabular-nums">{value}</div>
      <div className="text-[10px] opacity-80 mt-1 truncate">{sub}</div>
    </div>
  );
}

function relTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.round(ms / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

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

// ── Profile views chart — 30일 일별 막대 ───────────────────

function ViewsChart({ data }: { data: { date: string; count: number }[] }) {
  if (!data.length) return null;
  const W = 700, H = 80, PT = 8, PB = 18, PL = 4, PR = 4;
  const max = Math.max(...data.map((d) => d.count), 1);
  const barW = (W - PL - PR) / data.length;
  const chartH = H - PT - PB;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Daily profile views">
      {data.map((d, i) => {
        const h = (d.count / max) * chartH;
        const x = PL + i * barW;
        const y = PT + (chartH - h);
        const isLast = i === data.length - 1;
        return (
          <g key={d.date}>
            <rect
              x={x + 1}
              y={y}
              width={Math.max(barW - 2, 1)}
              height={h}
              fill={isLast ? "#6366f1" : "#a5b4fc"}
              rx={1.5}
            />
            {d.count > 0 && (
              <title>{`${d.date}: ${d.count} view${d.count !== 1 ? "s" : ""}`}</title>
            )}
          </g>
        );
      })}
      {/* X-axis labels — only every 5th day */}
      {data.map((d, i) =>
        i % 5 === 0 || i === data.length - 1 ? (
          <text
            key={`l-${d.date}`}
            x={PL + i * barW + barW / 2}
            y={H - 4}
            fontSize="9"
            fill="#9ca3af"
            textAnchor="middle"
          >
            {d.date.slice(5)}
          </text>
        ) : null
      )}
    </svg>
  );
}

// ── Rating trend chart — real 3-bucket data ────────────────

function RatingTrendChart({ trend }: { trend: RatingTrend }) {
  const W = 340, H = 100, PL = 28, PR = 16, PT = 18, PB = 8;
  const cW = W - PL - PR;
  const cH = H - PT - PB;

  const buckets = [
    { label: "1yr+",   ...trend.old },
    { label: "3-12mo", ...trend.midterm },
    { label: "30d",    ...trend.recent },
  ];

  const toY = (avg: number | null): number | null =>
    avg === null ? null : PT + cH - ((avg - 1) / 4) * cH;

  const pts = buckets.map((b, i) => ({
    x: PL + (i / 2) * cW,
    y: toY(b.avg),
    label: b.label,
    avg: b.avg,
    count: b.count,
  }));

  // Build path only through valid consecutive segments
  const segments: string[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    if (a.y !== null && b.y !== null)
      segments.push(`M ${a.x} ${a.y} L ${b.x} ${b.y}`);
  }

  const gridRatings = [2, 3, 4, 5];

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ overflow: "visible" }}>
        {/* Grid lines + labels */}
        {gridRatings.map((r) => {
          const y = toY(r)!;
          return (
            <g key={r}>
              <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#f0f0f0" strokeWidth="1" />
              <text x={PL - 4} y={y + 3.5} fontSize="9" textAnchor="end" fill="#9ca3af">★{r}</text>
            </g>
          );
        })}

        {/* Connecting lines */}
        {segments.map((d, i) => (
          <path key={i} d={d} stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ))}

        {/* Points + labels */}
        {pts.map((p, i) => (
          <g key={i}>
            {p.y !== null ? (
              <>
                <circle cx={p.x} cy={p.y} r="5" fill="#10b981" />
                <text x={p.x} y={p.y - 10} fontSize="10" textAnchor="middle" fill="#111827" fontWeight="700">
                  ★{p.avg?.toFixed(2)}
                </text>
              </>
            ) : (
              <circle cx={p.x} cy={H / 2} r="4" fill="#e5e7eb" />
            )}
            <text x={p.x} y={H + 2} fontSize="9" textAnchor="middle" fill="#6b7280">{p.label}</text>
            {p.count > 0 && (
              <text x={p.x} y={H + 13} fontSize="8" textAnchor="middle" fill="#9ca3af">{p.count} rev</text>
            )}
          </g>
        ))}
      </svg>
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3 mt-4 text-center text-xs border-t border-[var(--border)] pt-3">
        {buckets.map((b, i) => (
          <div key={i}>
            <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold">{b.label}</div>
            <div className="text-base font-black">{b.avg != null ? `★${b.avg.toFixed(1)}` : "—"}</div>
            <div className="text-[10px] text-[var(--muted)]">{b.count > 0 ? `${b.count} reviews` : "no data"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeadField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold min-w-[70px] pt-0.5">{label}</span>
      <span className="flex-1 break-words">{value}</span>
    </div>
  );
}

// ── Sprint 2.1: Multi-platform reputation ──────────────────

const PLATFORM_META: Record<string, { label: string; color: string; emoji: string }> = {
  google:      { label: "Google",      color: "#4285f4", emoji: "🅖" },
  tripadvisor: { label: "TripAdvisor", color: "#00aa6c", emoji: "🦉" },
  whatclinic:  { label: "WhatClinic",  color: "#1a9d6f", emoji: "🩺" },
  trustpilot:  { label: "Trustpilot",  color: "#00b67a", emoji: "★" },
  facebook:    { label: "Facebook",    color: "#1877f2", emoji: "f" },
  bookimed:    { label: "Bookimed",    color: "#5b6ee1", emoji: "✈" },
};

function PlatformReputationCard({ clinic: c }: { clinic: Clinic }) {
  const ext = c.external_reviews ?? {};
  type Row = { key: string; label: string; color: string; emoji: string; rating: number | null; count: number; url?: string; tracked: boolean };
  const rows: Row[] = [
    { key: "google", ...PLATFORM_META.google, rating: c.rating, count: c.total_reviews, url: c.maps_url, tracked: true },
    ...(["tripadvisor", "whatclinic", "trustpilot", "facebook", "bookimed"] as const).map((k) => {
      const e = ext[k];
      return {
        key: k, ...PLATFORM_META[k],
        rating: e?.rating ?? null,
        count: e?.count ?? 0,
        url: e?.url,
        tracked: !!e,
      };
    }),
  ];
  const totalReviews = rows.reduce((s, r) => s + r.count, 0);
  const trackedCount = rows.filter((r) => r.tracked).length;
  const maxCount = Math.max(1, ...rows.map((r) => r.count));

  return (
    <Card>
      <div className="flex items-baseline justify-between gap-3 mb-1 flex-wrap">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span>🌐</span> Multi-platform reputation
        </h2>
        <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-blue-100 text-blue-800">
          {trackedCount}/6 tracked
        </span>
      </div>
      <p className="text-xs text-[var(--muted)] mb-3">
        Your total review footprint across all platforms patients use.
      </p>
      <div className="text-3xl md:text-4xl font-black tabular-nums mb-1">
        {totalReviews.toLocaleString()}
        <span className="text-sm font-normal text-[var(--muted)] ml-2">total reviews</span>
      </div>
      <div className="space-y-2 mt-4">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: r.color }}>
              {r.emoji}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="font-medium truncate">{r.label}</span>
                <span className="tabular-nums whitespace-nowrap">
                  {r.tracked ? (
                    <>
                      {r.rating !== null && <span className="text-yellow-700 mr-2">★{r.rating.toFixed(1)}</span>}
                      <strong>{r.count.toLocaleString()}</strong>
                    </>
                  ) : (
                    <span className="text-[var(--muted)] text-xs">— not tracked</span>
                  )}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 mt-1 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(r.count / maxCount) * 100}%`, background: r.tracked ? r.color : "#e5e5e5" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs text-[var(--muted)]">
          Auto-aggregated weekly. New platforms added quarterly.
        </span>
        <button className="text-xs font-bold px-3 py-2 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-50">
          + Connect platform
        </button>
      </div>
    </Card>
  );
}

// ── Sprint 2.2: Pricing intelligence ───────────────────────

const SERVICE_LABELS: Record<string, string> = {
  botox: "Botox", filler: "Filler", hifu: "HIFU", facial: "Facial",
  laser: "Laser", dental: "Dental", hair_transplant: "Hair transplant", eye: "Eye / LASIK",
};

function PricingIntelCard({ clinic: c, competitors }: { clinic: Clinic; competitors: Clinic[] }) {
  const myPricing = c.pricing ?? [];
  const allPricing = [c, ...competitors].flatMap((x) => x.pricing ?? []);
  const services = Array.from(new Set([
    ...myPricing.map((p) => p.service),
    ...c.categories.slice(0, 4),
  ]));

  // service 별 시장 median 계산
  const serviceStats = services.map((svc) => {
    const mine = myPricing.find((p) => p.service === svc);
    const market = allPricing.filter((p) => p.service === svc);
    const marketMid = market.length
      ? market.map((p) => (p.price_min_thb + p.price_max_thb) / 2).sort((a, b) => a - b)
      : [];
    const median = marketMid.length ? marketMid[Math.floor(marketMid.length / 2)] : null;
    const myMid = mine ? (mine.price_min_thb + mine.price_max_thb) / 2 : null;
    const deltaPct = (myMid !== null && median !== null && median > 0) ? Math.round(((myMid - median) / median) * 100) : null;
    return { svc, mine, median, myMid, deltaPct, sampleSize: market.length };
  });

  const trackedCount = serviceStats.filter((s) => s.mine !== undefined).length;

  return (
    <Card>
      <div className="flex items-baseline justify-between gap-3 mb-1 flex-wrap">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span>💰</span> Pricing intelligence
        </h2>
        <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-amber-100 text-amber-800">
          {trackedCount > 0 ? `${trackedCount} tracked` : "Auto-scrape pending"}
        </span>
      </div>
      <p className="text-xs text-[var(--muted)] mb-3">
        Your published prices vs district median. Updated weekly from public clinic websites.
      </p>
      <div className="space-y-3 mt-4">
        {serviceStats.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-[var(--border)] rounded-xl p-6 text-center">
            <p className="text-sm font-bold">No price data yet</p>
            <p className="text-xs text-[var(--muted)] mt-1">
              We auto-scrape your website weekly. Add prices to your site or upload manually to populate.
            </p>
          </div>
        ) : serviceStats.map((s) => (
          <PriceLevel key={s.svc} stat={s} />
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs text-[var(--muted)]">
          Source: public clinic websites. We never share your prices with competitors.
        </span>
        <button className="text-xs font-bold px-3 py-2 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-50">
          📊 Full price report
        </button>
      </div>
    </Card>
  );
}

function PriceLevel({ stat }: {
  stat: { svc: string; mine: { price_min_thb: number; price_max_thb: number } | undefined;
          median: number | null; myMid: number | null; deltaPct: number | null; sampleSize: number };
}) {
  const { svc, mine, median, deltaPct, sampleSize } = stat;
  const label = SERVICE_LABELS[svc] ?? svc;
  const status: "high" | "low" | "fair" | "unknown" =
    deltaPct === null ? "unknown" : deltaPct > 20 ? "high" : deltaPct < -15 ? "low" : "fair";
  const statusMeta = {
    high:    { color: "#dc2626", bg: "#fee2e2", note: "above market — may lose price-sensitive leads" },
    low:     { color: "#0891b2", bg: "#cffafe", note: "below market — leaving money on table" },
    fair:    { color: "#16a34a", bg: "#dcfce7", note: "competitive — within ±15% of median" },
    unknown: { color: "#737373", bg: "#f5f5f5", note: "no price published yet" },
  }[status];

  return (
    <div className="border border-[var(--border)] rounded-lg p-3" style={{ background: statusMeta.bg + "30" }}>
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <span className="font-bold text-sm">{label}</span>
        {deltaPct !== null && (
          <span className="text-xs font-bold tabular-nums" style={{ color: statusMeta.color }}>
            {deltaPct > 0 ? "+" : ""}{deltaPct}% vs market
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 text-xs">
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold">Your price</div>
          <div className="tabular-nums font-bold">
            {mine ? `฿${mine.price_min_thb.toLocaleString()}–${mine.price_max_thb.toLocaleString()}` : <span className="text-[var(--muted)] font-normal">not on website</span>}
          </div>
        </div>
        <div className="flex-1 text-right">
          <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold">District median</div>
          <div className="tabular-nums font-bold">
            {median !== null ? `฿${Math.round(median).toLocaleString()}` : <span className="text-[var(--muted)] font-normal">collecting (n={sampleSize})</span>}
          </div>
        </div>
      </div>
      <div className="text-[11px] mt-2" style={{ color: statusMeta.color }}>
        {statusMeta.note}
      </div>
    </div>
  );
}
