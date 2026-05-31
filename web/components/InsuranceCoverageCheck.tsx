"use client";
// Quick "does your insurance cover Bangkok" lookup. Common providers only.

import { useState } from "react";

type Row = { name: string; verdict: "yes" | "partial" | "no"; note: string };

const PROVIDERS: Row[] = [
  { name: "Bupa Global",         verdict: "yes",     note: "Full cover for elective + emergency at JCI hospitals (Bumrungrad, BNH, Samitivej)" },
  { name: "Cigna Global",        verdict: "yes",     note: "Direct billing with most JCI hospitals" },
  { name: "Allianz Care",        verdict: "yes",     note: "Pre-authorization recommended for elective procedures" },
  { name: "AXA Global",          verdict: "partial", note: "Emergency yes; elective varies by plan tier" },
  { name: "April International", verdict: "partial", note: "Some plans exclude aesthetic procedures entirely" },
  { name: "MSH International",   verdict: "yes",     note: "Direct billing with most JCI hospitals" },
  { name: "Local US insurance",  verdict: "no",      note: "Most US plans do not cover overseas elective care. Need separate travel medical." },
  { name: "Local UK NHS",        verdict: "no",      note: "NHS does not cover overseas care. Some private NHS top-ups may." },
  { name: "Korean NHIS",         verdict: "no",      note: "National plan only covers emergency abroad. Elective excluded." },
];

export default function InsuranceCoverageCheck() {
  const [pick, setPick] = useState<Row | null>(null);

  return (
    <section className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--border)" }}>
      <div className="mb-3">
        <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Insurance quick check</div>
        <h3 className="text-base font-black mt-0.5">Does your plan cover Bangkok?</h3>
        <p className="text-xs text-[var(--muted)] mt-1">Common cover rules for international insurance providers.</p>
      </div>

      {pick ? (
        <>
          <div className="rounded-xl border-2 p-4" style={{ borderColor: pick.verdict === "yes" ? "#86efac" : pick.verdict === "partial" ? "#fcd34d" : "#fda4af", background: pick.verdict === "yes" ? "#f0fdf4" : pick.verdict === "partial" ? "#fffbeb" : "#fef2f2" }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">{pick.verdict === "yes" ? "✅" : pick.verdict === "partial" ? "⚠️" : "❌"}</span>
              <div>
                <div className="font-black text-base">{pick.name}</div>
                <div className="text-xs uppercase tracking-widest font-bold">
                  {pick.verdict === "yes" ? "Typically covered" : pick.verdict === "partial" ? "Partial cover" : "Not covered"}
                </div>
              </div>
            </div>
            <p className="text-xs leading-relaxed">{pick.note}</p>
          </div>
          <button onClick={() => setPick(null)} className="mt-3 text-xs font-bold text-emerald-700 hover:underline">← Check another</button>
        </>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {PROVIDERS.map((p) => (
            <button key={p.name} onClick={() => setPick(p)}
              className="text-left rounded-lg border bg-slate-50 hover:bg-white hover:border-slate-400 p-3 transition flex items-center gap-2"
              style={{ borderColor: "var(--border)" }}>
              <span className="text-lg shrink-0">
                {p.verdict === "yes" ? "✅" : p.verdict === "partial" ? "⚠️" : "❌"}
              </span>
              <span className="text-xs font-bold flex-1 min-w-0">{p.name}</span>
              <span className="text-[var(--muted)] text-xs">→</span>
            </button>
          ))}
        </div>
      )}

      <p className="text-[11px] text-[var(--muted)] mt-3 leading-relaxed">
        Verify with your insurer in writing before booking. Most aesthetic procedures are excluded from medical coverage regardless of provider.
      </p>
    </section>
  );
}
