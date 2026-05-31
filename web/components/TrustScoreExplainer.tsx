"use client";
// Click-to-reveal Trust Score breakdown. Builds credibility through transparency.
// Inline component that takes a score and renders a popover trigger button.

import { useState } from "react";
import type { Clinic } from "@/lib/types";

export default function TrustScoreExplainer({ clinic }: { clinic: Clinic }) {
  const [open, setOpen] = useState(false);

  // Approximate breakdown — Trust Score formula is: rating × volume + topic depth + recency
  // We display contributors so the user trusts the number.
  const contributors = [
    { label: "Rating quality (4.0+)",       weight: 30, met: clinic.rating >= 4.0,                                          val: clinic.rating.toFixed(1) },
    { label: "Review volume (100+)",        weight: 20, met: clinic.total_reviews >= 100,                                  val: clinic.total_reviews.toLocaleString() },
    { label: "Recent activity (3mo)",       weight: 15, met: (clinic.rating_trend?.recent?.count ?? 0) >= 5,                val: `${clinic.rating_trend?.recent?.count ?? 0} recent` },
    { label: "Multi-platform presence",     weight: 15, met: Object.keys(clinic.external_reviews ?? {}).length >= 1,        val: `${Object.keys(clinic.external_reviews ?? {}).length} platforms` },
    { label: "Topic depth (genuine signals)", weight: 10, met: (clinic.mentioned_topics?.length ?? 0) >= 5,                  val: `${clinic.mentioned_topics?.length ?? 0} topics` },
    { label: "Local Guides %",              weight: 10, met: (clinic.local_guide_count ?? 0) >= 10,                         val: `${clinic.local_guide_count ?? 0} guides` },
  ];
  const earned = contributors.filter((c) => c.met).reduce((s, c) => s + c.weight, 0);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-700 hover:underline"
      >
        ⓘ How
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 toast-fade-up" onClick={() => setOpen(false)} />
          <div role="dialog" aria-modal="true"
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92vw] max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden toast-fade-up">
            <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
              <h3 className="font-black">Trust Score: {clinic.trust_score.toFixed(0)} / 100</h3>
              <button onClick={() => setOpen(false)} className="text-[var(--muted)] hover:text-black text-lg -m-2 p-2">✕</button>
            </div>
            <div className="p-5">
              <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">
                Our formula reads only <strong>public data</strong>. We never charge clinics to boost this number.
                Earned {earned}/100 from these signals:
              </p>
              <ul className="space-y-2">
                {contributors.map((c, i) => (
                  <li key={i} className={`flex items-center gap-3 rounded-lg border p-3 ${c.met ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
                    <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-black ${c.met ? "bg-emerald-500 text-white" : "bg-slate-300 text-slate-700"}`}>
                      {c.met ? "✓" : "—"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold">{c.label}</div>
                      <div className="text-[11px] text-[var(--muted)]">Worth {c.weight} points · this clinic: {c.val}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <a href="/about/trust-score" className="mt-4 inline-block text-xs font-bold text-blue-700 hover:underline">
                Read the full Trust Score methodology →
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
