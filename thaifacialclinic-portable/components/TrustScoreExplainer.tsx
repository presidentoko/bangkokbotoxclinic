"use client";
// Trust Score breakdown popover — adapted for hair's Clinic shape.

import { useState } from "react";
import type { Clinic } from "@/lib/types";

export default function TrustScoreExplainer({ clinic }: { clinic: Clinic }) {
  const [open, setOpen] = useState(false);

  const rating = clinic.rating ?? 0;
  const reviews = clinic.review_count ?? 0;
  const sources = Object.values(clinic.source_badges || {}).filter((n) => (n as number) >= 1).length;

  const contributors = [
    { label: "Rating quality (4.0+)",       weight: 30, met: rating >= 4.0,                                val: rating.toFixed(1) },
    { label: "Review volume (100+)",         weight: 20, met: reviews >= 100,                              val: reviews.toLocaleString() },
    { label: "Scraped depth (50+)",          weight: 15, met: (clinic.reviews_scraped_count ?? 0) >= 50,    val: `${clinic.reviews_scraped_count ?? 0} scraped` },
    { label: "Multi-source presence",        weight: 15, met: sources >= 2,                                val: `${sources} sources` },
    { label: "Photo evidence (5+)",          weight: 10, met: (clinic.photos_count ?? 0) >= 5,             val: `${clinic.photos_count ?? 0} photos` },
    { label: "Video evidence",               weight: 10, met: (clinic.videos_count ?? 0) >= 1,             val: `${clinic.videos_count ?? 0} videos` },
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
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)} />
          <div role="dialog" aria-modal="true"
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92vw] max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "rgb(var(--border))" }}>
              <h3 className="font-black">Trust Score: {clinic.trust_score.toFixed(0)} / 100</h3>
              <button onClick={() => setOpen(false)} className="text-[rgb(var(--muted))] hover:text-black text-lg -m-2 p-2">✕</button>
            </div>
            <div className="p-5">
              <p className="text-xs text-[rgb(var(--muted))] mb-4 leading-relaxed">
                Our formula reads <strong>public data only</strong>. We never charge clinics to boost this number.
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
                      <div className="text-[11px] text-[rgb(var(--muted))]">Worth {c.weight} points · this clinic: {c.val}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
}
