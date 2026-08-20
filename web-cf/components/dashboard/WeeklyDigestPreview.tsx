// Stripe-style preview of the Monday email partner will receive each week.
// Proves the dashboard is not a one-time thing — recurring value.
// Pure server component, can be inlined anywhere.

import type { Clinic } from "@/lib/types";

export function WeeklyDigestPreview({
  clinic,
  competitors,
  newLeads,
  pendingReplies,
  isPartner,
}: {
  clinic: Clinic;
  competitors: Clinic[];
  newLeads: number;
  pendingReplies: number;
  isPartner: boolean;
}) {
  const competitor = competitors[0];
  const beatsCompetitor = competitor ? clinic.trust_score >= competitor.trust_score : true;

  return (
    <section className="mb-6 rounded-2xl border bg-white overflow-hidden shadow-sm" style={{ borderColor: "var(--border)" }}>
      {/* Email-style header */}
      <div className="px-5 py-3 border-b bg-slate-50 flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 grid place-items-center text-white text-xs font-black">B</div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-[var(--muted)]">From: weekly@bkkclinics.com · To: owner@{clinic.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com</div>
          <div className="font-bold text-sm truncate">Your weekly intel — Monday digest</div>
        </div>
        <span className="hidden sm:inline rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider px-2 py-1">Preview</span>
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="text-lg font-black tracking-tight">Hi {clinic.name.split(" ")[0]} team —</h3>
          <p className="text-sm text-[var(--muted)] mt-1">Here&apos;s what changed for your clinic in the last 7 days:</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "New leads", value: newLeads, hint: "Form submits" },
            { label: "Need replies", value: pendingReplies, hint: "Negative reviews" },
            { label: "Trust Score", value: clinic.trust_score.toFixed(0), hint: beatsCompetitor ? "Beats #1 competitor" : "Behind competitor #1" },
            { label: "Profile views", value: "+18%", hint: "vs prior week" },
          ].map((s, i) => (
            <div key={i} className="rounded-lg border bg-slate-50 p-3" style={{ borderColor: "var(--border)" }}>
              <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold">{s.label}</div>
              <div className="text-xl font-black tabular-nums">{s.value}</div>
              <div className="text-[10px] text-[var(--muted)] mt-0.5">{s.hint}</div>
            </div>
          ))}
        </div>

        <div className="border-l-4 border-amber-400 bg-amber-50 p-3 rounded-r-lg">
          <div className="text-xs font-black uppercase tracking-widest text-amber-800">This week&apos;s action item</div>
          <p className="text-sm mt-1">
            {pendingReplies > 0
              ? <>You have <strong>{pendingReplies} unanswered negative review{pendingReplies === 1 ? "" : "s"}</strong>. Drafted replies are waiting in your dashboard — 30 seconds to post.</>
              : <>Trust Score holding strong. Consider running a review-request campaign to push past competitor #1.</>}
          </p>
        </div>

        {competitor && (
          <div className="text-xs text-[var(--muted)] flex items-center gap-2 border-t pt-3" style={{ borderColor: "var(--border)" }}>
            <span>👀 Competitor watch:</span>
            <strong className="text-[var(--fg)]">{competitor.name}</strong>
            <span>· Trust {competitor.trust_score.toFixed(0)} ({beatsCompetitor ? "you lead" : "ahead of you"})</span>
          </div>
        )}

        {!isPartner && (
          <div className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4">
            <div className="text-xs font-black uppercase tracking-widest opacity-90">Sample only · Not subscribed</div>
            <p className="text-sm mt-1 mb-3">
              Activate paid tier to get this digest every Monday — plus AI auto-reply, LINE lead routing, and weekly competitor alerts.
            </p>
            <a href="/for-clinics#pricing"
              className="inline-block rounded-lg bg-white text-emerald-800 px-4 py-2 text-sm font-black hover:bg-emerald-50">
              Get the real digest →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
