import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { loadClinics, getClinicById } from "@/lib/data";
import { SITE } from "@/lib/i18n";
import { isAdminAuthedFromCookies } from "@/lib/adminAuth";
import { verifyAccess } from "@/lib/dashboardAccessStore";
import { getRecentLeads, getLeadCount } from "@/lib/leadStore";
import {
  getLeadStatusMap,
  getLeadNotesMap,
  getLeadRevenueMap,
  getTotalProfileViews,
  getProfileViewsByDay,
  getReplyDoneSet,
  reviewHash,
} from "@/lib/dashboardStore";
import { listPartners } from "@/lib/partnerStore";
import TrustScoreRing from "@/components/TrustScoreRing";
import Sparkline from "@/components/Sparkline";
import MiniBarChart from "@/components/MiniBarChart";
import MiniDonut from "@/components/MiniDonut";
import LeadInbox from "@/components/LeadInbox";
import AiReplyTool from "@/components/AiReplyTool";
import ProfileHealth from "@/components/ProfileHealth";
import ProfileViewsChart from "@/components/ProfileViewsChart";
import ActionAlert from "@/components/ActionAlert";
import TemplatesLibrary from "@/components/TemplatesLibrary";

// Per-clinic owner dashboard — dynamic (reads Redis on every request).
// Public report (intel) visible without token. Lead inbox + AI tools require ?k=TOKEN or admin cookie.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = getClinicById(id);
  return {
    title: c ? `${c.name} — Dashboard` : "Dashboard",
    robots: { index: false, follow: false, nocache: true },
  };
}

function trendFor(seed: number, base: number, len = 12) {
  const out: number[] = [];
  for (let i = 0; i < len; i++) {
    out.push(Math.max(0, Math.round(base + Math.sin(i / 2.2 + seed / 13) * (base * 0.25) + (i * seed) % 4)));
  }
  return out;
}

export default async function ClinicDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ k?: string }>;
}) {
  const { id } = await params;
  const { k } = await searchParams;
  const c = getClinicById(id);
  if (!c) notFound();

  const staff = await isAdminAuthedFromCookies();
  const tokenOk = k ? await verifyAccess(c.id, k) : false;
  const accessOk = staff || tokenOk;

  const { clinics } = loadClinics();
  const cityPool = clinics.filter((x) => x.city && x.city !== "nan" && x.city === c.city && x.is_hair_relevant);
  const cityRanked = [...cityPool].sort((a, b) => b.trust_score - a.trust_score);
  const myRank = cityRanked.findIndex((x) => x.id === c.id) + 1;
  const cityAvg = cityPool.length ? Math.round(cityPool.reduce((s, x) => s + x.trust_score, 0) / cityPool.length) : 0;
  const competitors = cityRanked.filter((x) => x.id !== c.id).slice(0, 5);

  // Live leads + views — only fetched if authed
  const empty = accessOk ? null : true;
  const recentLeads = empty ? [] : await getRecentLeads(c.id, 50);
  const totalLeads = empty ? 0 : await getLeadCount(c.id);
  const statusMap: Record<string, import("@/lib/dashboardStore").LeadStatus> = empty ? {} : await getLeadStatusMap(c.id);
  const notesMap: Record<string, string> = empty ? {} : await getLeadNotesMap(c.id);
  const revenueMap: Record<string, number> = empty ? {} : await getLeadRevenueMap(c.id);
  const totalViews = empty ? 0 : await getTotalProfileViews(c.id);
  const viewsByDay = empty ? [] : await getProfileViewsByDay(c.id, 30);
  const replyDoneSet: Set<string> = empty ? new Set() : await getReplyDoneSet(c.id);
  const partners = empty ? [] : await listPartners();

  // Computed alert metrics (authed only)
  const newLeadCount = accessOk ? recentLeads.filter((l) => !statusMap[l.id] || statusMap[l.id] === "new").length : 0;
  const pendingReplyCount = accessOk
    ? c.reviews_sample.filter((r) => !replyDoneSet.has(reviewHash(r.text)) && (r.rating ?? 5) <= 3).length
    : 0;

  const partner = partners.find((p) => p.clinic_id === c.id) ?? null;

  const trendMe = trendFor(c.trust_score, Math.max(c.trust_score / 6, 6));
  const trendCity = trendFor(cityAvg + 7, Math.max(cityAvg / 7, 5));

  const sourcePie = [
    { value: c.source_badges.google_reviews, color: "#3b82f6", label: "Google" },
    { value: c.source_badges.photos, color: "#8b5cf6", label: "Photos" },
    { value: c.source_badges.videos, color: "#ef4444", label: "YouTube" },
    { value: c.source_badges.bookimed * 30, color: "#0ea5e9", label: "Bookimed" },
    { value: c.source_badges.website * 5, color: "#94a3b8", label: "Website" },
  ].filter((s) => s.value > 0);

  const sovPool = [c, ...competitors].slice(0, 4);
  const sovTotal = sovPool.reduce((s, x) => s + x.trust_score, 0) || 1;
  const sovValues = sovPool.map((x) => Math.round((x.trust_score / sovTotal) * 100 * 10) / 10);
  const sovLabels = sovPool.map((_, i) => (i === 0 ? "YOU" : `Comp ${String.fromCharCode(64 + i)}`));

  const partnerEmail = `partners@${new URL(SITE.origin).hostname}`;
  const claimMailto = `mailto:${partnerEmail}?subject=${encodeURIComponent(`Dashboard access — ${c.name}`)}&body=${encodeURIComponent(
    `Hi,\n\nI'd like the secure dashboard link for ${c.name}.\nClinic ID: ${c.id}\n\nThanks.`
  )}`;

  const noFouc = `(function(){try{var s=localStorage.getItem('theme');var d=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: noFouc }} />
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/" className="text-xs muted hover:text-clinic">← Public site</Link>
            <div className="flex items-center gap-2">
              {staff && (
                <span className="rounded-full bg-clinic/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-clinic">
                  👤 Staff session
                </span>
              )}
              {tokenOk && !staff && (
                <span className="rounded-full bg-trust-high/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-trust-high">
                  🔑 Owner access
                </span>
              )}
              {!accessOk && (
                <span className="rounded-full border border-amber-300/40 bg-amber-50 dark:bg-amber-950/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  🔒 Public preview · request access
                </span>
              )}
            </div>
          </div>
          <div className="mt-3 text-[11px] font-black uppercase tracking-widest text-clinic">
            Clinic dashboard
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{c.name}</h1>
          <p className="mt-2 max-w-2xl text-sm muted">
            {c.city}{c.category ? ` · ${c.category}` : ""} · clinic ID {c.id.slice(-12)}
          </p>
        </header>

        {/* Action-needed sticky alert (authed only) */}
        {accessOk && <ActionAlert newLeads={newLeadCount} pendingReplies={pendingReplyCount} />}

        {/* KPI tiles */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider muted">Trust Score</div>
                <div className="mt-1 text-2xl font-bold tabular-nums">{c.trust_score}/100</div>
                <div className={`mt-1 text-[11px] font-semibold ${c.trust_score >= cityAvg ? "text-trust-high" : "text-trust-low"}`}>
                  {c.trust_score >= cityAvg ? "↑" : "↓"} {Math.abs(c.trust_score - cityAvg)} vs city avg ({cityAvg})
                </div>
              </div>
              <TrustScoreRing score={c.trust_score} size={64} stroke={6} showLabel={false} />
            </div>
          </div>

          <div className="card p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider muted">City rank</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">
              {myRank > 0 ? `#${myRank}` : "—"}<span className="text-base font-medium muted"> / {cityRanked.length}</span>
            </div>
            <div className="mt-1 text-[11px] font-semibold muted">{c.city} · hair niche</div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider muted">{accessOk ? "Leads (lifetime)" : "Review base"}</div>
                <div className="mt-1 text-2xl font-bold tabular-nums">{accessOk ? totalLeads : (c.review_count ?? 0)}</div>
                <div className="mt-1 text-[11px] font-semibold muted">
                  {accessOk ? `${recentLeads.length} recent · ${totalViews} views` : `rating ${(c.rating || 0).toFixed(1)}`}
                </div>
              </div>
              <Sparkline data={trendMe} width={70} height={36} stroke="#10b981" />
            </div>
          </div>

          <div className="card p-4">
            <div className="text-[10px] font-bold uppercase tracking-wider muted">Partnership</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">
              {partner ? partner.plan_tier.toUpperCase() : c.is_partner ? "PARTNER" : "—"}
            </div>
            <div className="mt-1 text-[11px] font-semibold muted">
              {partner ? `since ${partner.started_at ?? "?"}` : "not enrolled"}
            </div>
          </div>
        </section>

        {/* Interactive lead inbox with revenue tracking (authed only) */}
        {accessOk ? (
          <div id="leads" className="mt-8 scroll-mt-32">
            <LeadInbox
              clinicId={c.id}
              accessToken={k || null}
              initialLeads={recentLeads}
              initialStatuses={statusMap}
              initialNotes={notesMap}
              initialRevenue={revenueMap}
              totalLeads={totalLeads}
            />
          </div>
        ) : (
          <section className="mt-8 overflow-hidden rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-50 to-transparent dark:from-amber-950/30 p-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row">
              <div className="rounded-2xl bg-amber-100 dark:bg-amber-900/50 p-4 text-amber-700 dark:text-amber-300">🔒</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold">Lead inbox locked</h3>
                <p className="mt-1 text-sm muted">
                  Real-time leads, profile views, and AI-drafted review replies are unlocked when you become a Verified Partner. Email us with your clinic ID and we'll send you a private dashboard link within 24h.
                </p>
                <a href={claimMailto} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-ink-900 dark:bg-white px-5 py-2.5 text-sm font-bold text-white dark:text-ink-900">
                  Request access →
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Charts */}
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider muted">Trust trajectory · You vs City Avg</h3>
              <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${c.trust_score >= cityAvg ? "bg-trust-high/15 text-trust-high" : "bg-trust-low/15 text-trust-low"}`}>
                {c.trust_score >= cityAvg ? "above" : "below"} avg
              </span>
            </div>
            <div className="mt-4 relative h-40">
              <div className="absolute inset-0 grid grid-rows-4 text-[10px] muted">
                {[100, 75, 50, 25].map((y) => (
                  <div key={y} className="border-t border-ink-100 dark:border-ink-800"><span>{y}</span></div>
                ))}
              </div>
              <div className="absolute inset-0">
                <Sparkline data={trendMe} width={500} height={160} stroke="#0ea5e9" />
              </div>
              <div className="absolute inset-0 opacity-50">
                <Sparkline data={trendCity} width={500} height={160} stroke="#94a3b8" />
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider muted">Share of voice · {c.city}</h3>
            <div className="mt-4">
              <MiniBarChart data={sovValues} labels={sovLabels} highlightIndex={0} height={140} />
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider muted">Source mix</h3>
            <div className="mt-4 flex items-center justify-center">
              <MiniDonut
                size={140}
                stroke={20}
                centerLabel={String(c.reviews_scraped_count || c.review_count || 0)}
                centerSub="signals"
                segments={sourcePie.length ? sourcePie : [{ value: 1, color: "#94a3b8", label: "—" }]}
              />
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider muted">Competitor leaderboard</h3>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[360px] text-sm">
                <thead>
                  <tr className="border-b border-ink-100 dark:border-ink-800 text-left text-[10px] uppercase tracking-wider muted">
                    <th className="py-2 pr-3">Clinic</th>
                    <th className="py-2 pr-3 tabular-nums">Trust</th>
                    <th className="py-2 pr-3 tabular-nums">Reviews</th>
                    <th className="py-2 pr-3 tabular-nums">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                  <tr className="bg-clinic/5 font-semibold">
                    <td className="py-2 pr-3 text-clinic truncate max-w-[180px]">YOU · {c.name}</td>
                    <td className="py-2 pr-3 tabular-nums">{c.trust_score}</td>
                    <td className="py-2 pr-3 tabular-nums">{c.review_count ?? 0}</td>
                    <td className="py-2 pr-3 tabular-nums">{(c.rating || 0).toFixed(1)}</td>
                  </tr>
                  {competitors.map((cmp, i) => (
                    <tr key={cmp.id}>
                      <td className="py-2 pr-3 muted">{accessOk ? cmp.name : `Competitor ${String.fromCharCode(65 + i)}`}</td>
                      <td className="py-2 pr-3 tabular-nums">{cmp.trust_score}</td>
                      <td className="py-2 pr-3 tabular-nums">{cmp.review_count ?? 0}</td>
                      <td className="py-2 pr-3 tabular-nums">{(cmp.rating || 0).toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!accessOk && <p className="mt-2 text-[10px] muted">Names redacted in public preview. Unlock with owner access.</p>}
          </div>
        </section>

        {/* Profile views trend (authed only) */}
        {accessOk && (
          <div className="mt-8">
            <ProfileViewsChart byDay={viewsByDay} total={totalViews} />
          </div>
        )}

        {/* Profile health — actionable Trust Score improvements (authed only) */}
        {accessOk && (
          <div className="mt-8">
            <ProfileHealth c={c} />
          </div>
        )}

        {/* AI Reply Tool — interactive, calls /api/ai/reply per review */}
        {accessOk && c.reviews_sample.length > 0 && (
          <div id="replies" className="mt-8 scroll-mt-32">
            <AiReplyTool
              clinicId={c.id}
              clinicName={c.name}
              accessToken={k || null}
              reviews={c.reviews_sample}
              initialDoneHashes={Array.from(replyDoneSet)}
            />
          </div>
        )}

        {/* LINE / email templates library (authed only) */}
        {accessOk && (
          <div className="mt-8">
            <TemplatesLibrary />
          </div>
        )}

        <footer className="mt-10 text-center text-[10px] muted">
          {accessOk ? "Owner / staff view" : "Public intelligence preview"} · {SITE.name}
        </footer>
      </div>
    </>
  );
}
