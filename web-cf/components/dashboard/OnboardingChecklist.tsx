"use client";
// First-30-second wow. Shows partner what their dashboard does within seconds of opening.
// Auto-checks items based on actual state (replied to a review, accepted a lead, etc.).
// Hidden once all 5 are done.

import { useState, useEffect } from "react";

type Step = { key: string; title: string; cta: string; href: string; done: boolean; reward: string };

export function OnboardingChecklist({
  hasLeads,
  hasRepliedToReview,
  hasContactedLead,
  isPartner,
  pendingReplies,
}: {
  hasLeads: boolean;
  hasRepliedToReview: boolean;
  hasContactedLead: boolean;
  isPartner: boolean;
  pendingReplies: number;
}) {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const steps: Step[] = [
    {
      key: "view_dashboard",
      title: "Open your dashboard",
      cta: "Done",
      href: "#",
      done: true,
      reward: "You see everything we know about your clinic",
    },
    {
      key: "first_reply",
      title: pendingReplies > 0
        ? `Draft AI reply to ${pendingReplies} unanswered review${pendingReplies === 1 ? "" : "s"}`
        : "Draft your first AI review reply",
      cta: "Draft reply →",
      href: "#crisis",
      done: hasRepliedToReview,
      reward: "Lifts Trust Score · Google ranks responsive clinics higher",
    },
    {
      key: "first_lead",
      title: hasLeads ? "Contact your first lead" : "Wait for first lead — we&apos;re sending traffic now",
      cta: hasLeads ? "Open lead inbox →" : "View setup",
      href: "#leads",
      done: hasContactedLead,
      reward: "First booked patient ≈ ฿15,000 procedure value",
    },
    {
      key: "watch_competitors",
      title: "See your top 3 competitors",
      cta: "Open competitors →",
      href: "#competitors",
      done: true, // auto-loaded
      reward: "Know where you rank · what to beat",
    },
    {
      key: "claim_partner",
      title: "Activate paid tier — keep the dashboard",
      cta: isPartner ? "Active ✓" : "Start 14-day trial",
      href: "/for-clinics#pricing",
      done: isPartner,
      reward: "Lead routing · weekly intel · LINE auto-replies",
    },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  const total = steps.length;
  if (doneCount === total || dismissed) return null;

  return (
    <section className="mb-6 rounded-2xl border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-3 mb-4 flex-wrap">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-blue-700">Get started</div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight mt-1">
            <span className="text-blue-700">{doneCount}/{total}</span> · Make this dashboard pay for itself this week
          </h2>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 underline"
        >
          Dismiss
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-blue-100 overflow-hidden mb-5">
        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
          style={{ width: `${(doneCount / total) * 100}%` }} />
      </div>

      <ol className="space-y-2">
        {steps.map((s, i) => (
          <li key={s.key}
            className={`flex items-center gap-3 rounded-xl border bg-white p-3 transition ${s.done ? "opacity-60" : "hover:border-blue-400 hover:shadow-sm"}`}
            style={{ borderColor: s.done ? "#dbeafe" : "var(--border)" }}>
            <span className={`grid h-8 w-8 place-items-center rounded-full text-sm font-black shrink-0 ${
              s.done ? "bg-emerald-500 text-white" : "bg-blue-100 text-blue-700"
            }`}>
              {s.done ? "✓" : i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-bold ${s.done ? "line-through" : ""}`} dangerouslySetInnerHTML={{ __html: s.title }} />
              <div className="text-[11px] text-[var(--muted)]">{s.reward}</div>
            </div>
            {!s.done && (
              <a href={s.href}
                className="text-xs font-bold px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap shrink-0">
                {s.cta}
              </a>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
