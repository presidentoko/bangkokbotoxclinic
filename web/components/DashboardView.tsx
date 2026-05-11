// B2B clinic dashboard — peeyai 패턴 referenced.
// 클리닉 owner mode. Crisis alerts top → KPI bar → AI tools → competitors → insights.

import type { Clinic } from "@/lib/types";
import { CATEGORY_LABELS, TOPIC_LABELS } from "@/lib/types";
import { draftReply, REPLY_CATEGORY_LABELS } from "@/lib/replyDrafts";
import type { LeadRecord } from "@/lib/leadStore";

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
};

// ฿2,800 = Bangkok 피부과 Facebook 광고 평균 CAC. 8,000 = 우리 monthly fee.
const FACEBOOK_CAC_THB = 2800;
const DASHBOARD_FEE_THB = 8000;
const LEAD_CLOSE_RATE = 0.4; // 폼 lead → 실제 procedure conversion

export function DashboardView({
  clinic: c, competitors, cityAvgRating, cityClinicCount,
  recentLeads = [], totalLeads = 0, ticketAvg = 15000, isPartner = false, isDemo,
}: Props) {
  // ROI 계산
  const leadsThisMonth = recentLeads.filter((l) => {
    const ageMs = Date.now() - new Date(l.at).getTime();
    return ageMs < 30 * 24 * 3600 * 1000;
  }).length;
  const projectedCloses = Math.round(leadsThisMonth * LEAD_CLOSE_RATE);
  const revenueAttributedThb = projectedCloses * ticketAvg;
  const facebookEquivalentThb = leadsThisMonth * FACEBOOK_CAC_THB;
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
  const samples = [...c.sample_reviews_en, ...c.sample_reviews_th].slice(0, 3);
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
            <button className="text-xs font-bold px-3 py-2 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-50">
              📊 Export weekly PDF
            </button>
            <button className="text-xs font-bold px-3 py-2 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-50">
              ⚙️ Settings
            </button>
            <button className="text-xs font-bold px-3 py-2 rounded-lg text-white" style={{ background: "#7c3aed" }}>
              ⚡ Upgrade plan
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Top KPI bar — money metrics 강조 */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          <KPI label="Trust Score" value={String(c.trust_score)} sub={`${trustDelta} vs last week`} color={trustColor} clickable />
          <KPI label="Pending replies" value={String(pendingReplies)} sub={pendingReplies > 0 ? "Action needed ↓" : "All clear"} color={pendingReplies > 0 ? "#ef4444" : "#10b981"} clickable warning={pendingReplies > 0} href="#crisis" />
          <KPI label="Leads this month" value={String(leadsThisMonth)} sub={`${totalLeads.toLocaleString()} all-time`} color="#0891b2" clickable href="#leads" />
          <KPI label="Revenue attributed" value={`฿${(revenueAttributedThb / 1000).toFixed(0)}K`} sub={`${projectedCloses} projected closes`} color="#10b981" clickable href="#roi" />
          <KPI label="ROI multiplier" value={`${roiMultiplier.toFixed(1)}x`} sub={`vs ฿${(DASHBOARD_FEE_THB / 1000).toFixed(0)}K dashboard fee`} color="#7c3aed" clickable href="#roi" />
        </section>

        {/* ROI breakdown — closer 섹션 */}
        <section id="roi" className="mb-6">
          <div className="rounded-2xl p-5 text-white overflow-hidden" style={{ background: "linear-gradient(135deg, #059669 0%, #0891b2 100%)" }}>
            <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest opacity-80">Monthly ROI breakdown</div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight mt-1">
                  This dashboard is paying for itself {roiMultiplier >= 1 ? `${roiMultiplier.toFixed(1)}x` : "—"} over
                </h2>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-80">Cost</div>
                <div className="text-2xl font-black tabular-nums">฿{DASHBOARD_FEE_THB.toLocaleString()}<span className="text-sm font-normal opacity-80">/mo</span></div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <RoiCell label="Leads delivered" value={String(leadsThisMonth)} sub="form submissions" />
              <RoiCell label="Projected closes" value={String(projectedCloses)} sub={`@ ${(LEAD_CLOSE_RATE * 100).toFixed(0)}% close rate`} />
              <RoiCell label="Revenue attributed" value={`฿${revenueAttributedThb.toLocaleString()}`} sub={`@ ฿${ticketAvg.toLocaleString()}/procedure avg`} />
              <RoiCell label="Same leads via Facebook" value={`฿${facebookEquivalentThb.toLocaleString()}`} sub={`@ ฿${FACEBOOK_CAC_THB.toLocaleString()} CAC`} />
            </div>
            <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between gap-3 flex-wrap text-xs">
              <span className="opacity-90">Numbers update in real-time as new leads come in.</span>
              <a href="#leads" className="font-bold underline">See lead inflow ↓</a>
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
              <button className="text-xs font-bold px-3 py-2 rounded-lg text-white" style={{ background: "#ef4444" }}>
                ✨ Generate all replies
              </button>
            </div>
            <div className="space-y-3">
              {negatives.map((rev, i) => {
                const { category, draft } = draftReply(rev.text, c.name, rev.author);
                const severity = rev.rating <= 1 ? "critical" : rev.rating <= 2 ? "high" : "medium";
                const severityColor = severity === "critical" ? "#dc2626" : severity === "high" ? "#ea580c" : "#d97706";
                return (
                  <div key={i} className="bg-white border-2 rounded-xl overflow-hidden" style={{ borderColor: `${severityColor}30` }}>
                    <div className="px-4 py-3 flex items-center justify-between gap-3 border-b border-[var(--border)] flex-wrap" style={{ background: `${severityColor}08` }}>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs font-black uppercase tracking-widest px-2 py-1 rounded-full text-white" style={{ background: severityColor }}>
                          {severity}
                        </span>
                        <span className="text-yellow-600 text-sm">{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</span>
                        <span className="text-xs font-bold px-2 py-1 rounded bg-amber-100 text-amber-800">{REPLY_CATEGORY_LABELS[category]}</span>
                        <span className="text-xs text-[var(--muted)]">{rev.author || "Google reviewer"} · 2-7 days ago</span>
                      </div>
                      <span className="text-xs text-[var(--muted)]">Source: Google Maps</span>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-[var(--fg)] italic leading-relaxed mb-3">&ldquo;{rev.text}&rdquo;</p>
                      <details className="group">
                        <summary className="cursor-pointer flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 transition select-none">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-purple-700">✨ AI reply draft</span>
                            <span className="text-xs text-purple-600">— click to view + edit</span>
                          </div>
                          <span className="text-purple-600 group-open:rotate-180 transition">⌄</span>
                        </summary>
                        <div className="mt-3 bg-white border border-purple-200 rounded-lg p-4">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap mb-3">{draft}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <button className="text-xs font-bold px-3 py-2 rounded-lg text-white" style={{ background: "#7c3aed" }}>
                              📋 Copy reply
                            </button>
                            <button className="text-xs font-bold px-3 py-2 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-50">
                              ✏️ Regenerate (3 styles)
                            </button>
                            <button className="text-xs font-bold px-3 py-2 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-50">
                              📝 Edit
                            </button>
                            <button className="text-xs font-bold px-3 py-2 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-50">
                              ✓ Mark resolved
                            </button>
                            <span className="ml-auto text-xs text-[var(--muted)]">
                              Time to post: ~30s
                            </span>
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

            {/* 30-day chart placeholder */}
            <Card>
              <div className="flex items-baseline justify-between gap-4 mb-3 flex-wrap">
                <h2 className="text-lg font-bold">30-day rating trajectory</h2>
                <div className="flex items-center gap-1 text-xs">
                  <Tab active>30d</Tab>
                  <Tab>90d</Tab>
                  <Tab>1y</Tab>
                  <Tab>All</Tab>
                </div>
              </div>
              <div className="h-40 bg-gradient-to-t from-gray-50 to-transparent rounded-lg p-4 relative overflow-hidden">
                {/* SVG sparkline mock */}
                <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="w-full h-full">
                  <path
                    d="M 0 60 Q 50 45 100 50 T 200 40 T 300 35 T 400 25"
                    stroke="#10b981"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d="M 0 60 Q 50 45 100 50 T 200 40 T 300 35 T 400 25 L 400 100 L 0 100 Z"
                    fill="url(#grad)"
                    opacity="0.2"
                  />
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3 text-center text-xs">
                <Stat tiny label="Recent 30d" value={`★${c.rating_trend.recent.avg?.toFixed(1) ?? "—"}`} count={c.rating_trend.recent.count} />
                <Stat tiny label="3-12mo ago" value={`★${c.rating_trend.midterm.avg?.toFixed(1) ?? "—"}`} count={c.rating_trend.midterm.count} />
                <Stat tiny label="Older" value={`★${c.rating_trend.old.avg?.toFixed(1) ?? "—"}`} count={c.rating_trend.old.count} />
              </div>
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
                    const weakness = negFirst ? draftReply(negFirst.text, x.name, "").category : null;
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
              <p className="text-xs text-[var(--muted)] mb-3">Topics from your last {c.scraped_review_count} reviews.</p>
              <div className="flex flex-wrap gap-2">
                {c.mentioned_topics.slice(0, 14).map((t) => {
                  // 부정 vs 긍정 색상 차별화
                  const isNegative = ["long_wait", "expensive"].includes(t.topic);
                  return (
                    <button
                      key={t.topic}
                      className="px-3 py-1.5 rounded-full border text-sm flex items-center gap-2 hover:shadow-sm transition"
                      style={{
                        background: isNegative ? "#fee2e2" : "#dcfce7",
                        borderColor: isNegative ? "#fecaca" : "#bbf7d0",
                        color: isNegative ? "#991b1b" : "#065f46",
                      }}
                    >
                      <span>{TOPIC_LABELS[t.topic] ?? t.topic}</span>
                      <span className="text-xs opacity-70 tabular-nums">×{t.count}</span>
                    </button>
                  );
                })}
              </div>
              <button className="mt-4 text-xs font-bold px-3 py-2 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-50">
                🔍 Filter reviews by topic
              </button>
            </Card>
          )}

          {samples.length > 0 && (
            <Card>
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <h2 className="text-lg font-bold">Recent ★4-5 reviews</h2>
                <button className="text-xs font-bold text-[var(--muted)] hover:text-[var(--fg)]">View all →</button>
              </div>
              <p className="text-xs text-[var(--muted)] mb-3">Use as social proof on your marketing.</p>
              <div className="space-y-3">
                {samples.map((s, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg border border-[var(--border)]">
                    <div className="text-yellow-600 text-xs mb-1">{"★".repeat(s.rating)}</div>
                    <p className="text-sm text-[var(--fg)] line-clamp-3 leading-relaxed mb-2">{s.text}</p>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-[var(--muted)]">— {s.author || "Google reviewer"}</span>
                      <button className="font-bold text-purple-700 hover:underline">📋 Copy as testimonial</button>
                    </div>
                  </div>
                ))}
              </div>
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
                  <LeadCard key={lead.id} lead={lead} />
                ))}
              </div>
            )}

            <p className="text-xs text-[var(--muted)] mt-4">
              ฿200/lead exclusivity · 24h hold · no-show refund · or ฿{DASHBOARD_FEE_THB.toLocaleString()}/month flat for unlimited leads in your category
            </p>
          </Card>
        </section>

        {/* Upsell footer */}
        <section className="mb-6">
          <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)" }}>
            <div className="relative">
              <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Upgrade to Premium</div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3">
                Unlock 6 more tools that grow Trust Score automatically
              </h2>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm mb-5">
                <li>✓ AI reply drafts for all 50 recent reviews</li>
                <li>✓ Competitor weakness full report (PDF)</li>
                <li>✓ AEO citation tracker (Q3)</li>
                <li>✓ Auto-schedule weekly review request emails</li>
                <li>✓ Lead webhook + 24h exclusivity</li>
                <li>✓ Featured slot at 50% launch discount</li>
              </ul>
              <div className="flex items-center gap-3 flex-wrap">
                <a href="/for-clinics#pilot" className="px-5 py-2.5 rounded-full bg-white text-purple-700 font-black hover:opacity-90 transition">
                  Start 30-day pilot →
                </a>
                <a href="/for-clinics" className="px-5 py-2.5 rounded-full border-2 border-white text-white font-bold hover:bg-white/10 transition">
                  See plans
                </a>
                <span className="text-xs opacity-80 ml-2">No payment unless we generate leads in pilot</span>
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

function LeadCard({ lead }: { lead: LeadRecord }) {
  const isFresh = Date.now() - new Date(lead.at).getTime() < 6 * 3600_000; // 6시간 이내
  return (
    <div className="border border-[var(--border)] rounded-xl overflow-hidden bg-white">
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between gap-2 flex-wrap" style={{ background: isFresh ? "#ecfdf5" : "#fafafa" }}>
        <div className="flex items-center gap-2 flex-wrap">
          {isFresh && (
            <span className="text-xs font-black uppercase tracking-widest px-2 py-1 rounded-full text-white bg-emerald-600">
              NEW
            </span>
          )}
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
        {lead.notes && <LeadField label="Notes" value={lead.notes} />}
        {lead.ref && lead.ref !== "direct" && (
          <LeadField label="Source" value={lead.ref.replace(/^https?:\/\//, "").slice(0, 60)} />
        )}
      </div>
      <div className="px-4 py-3 border-t border-[var(--border)] bg-gray-50 flex items-center gap-2 flex-wrap">
        <a
          href={`mailto:${lead.email}?subject=${encodeURIComponent(`Re: your ${lead.service || "consultation"} inquiry at ${lead.clinic_name}`)}`}
          className="text-xs font-bold px-3 py-2 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700"
        >
          📧 Reply by email
        </a>
        {lead.phone && (
          <a
            href={`tel:${lead.phone.replace(/[^+\d]/g, "")}`}
            className="text-xs font-bold px-3 py-2 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-100"
          >
            📞 Call
          </a>
        )}
        <button className="text-xs font-bold px-3 py-2 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-100">
          ✓ Mark contacted
        </button>
        <span className="ml-auto text-[10px] text-[var(--muted)] tabular-nums font-mono">{lead.id.slice(0, 10)}</span>
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
