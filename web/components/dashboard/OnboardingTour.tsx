"use client";
// First-visit product tour for dashboard. 5 steps highlighting key sections via backdrop spotlight.
// Skippable, persists "seen" in localStorage. Ignored if user manually dismissed via "Skip tour" button.

import { useEffect, useState } from "react";

const KEY = "dash_tour_seen_v1";

const STEPS = [
  {
    sel: "[data-tour=cta]",
    title: "Free trial",
    body: "Activate the 14-day trial to keep everything below — AI replies, lead inbox, weekly digest.",
    placement: "below" as const,
  },
  {
    sel: "[data-tour=leads]",
    title: "Hot leads (4h timer)",
    body: "Forms-submits that need a reply. Conversion drops 50% if you wait > 4 hours.",
    placement: "below" as const,
  },
  {
    sel: "[data-tour=checklist]",
    title: "Get-started checklist",
    body: "5 things to do this week. Each unlocks a feature or saves you money.",
    placement: "below" as const,
  },
  {
    sel: "[data-tour=crisis]",
    title: "Crisis alerts",
    body: "Negative reviews with AI-drafted replies. Copy → paste to Google in 30 seconds.",
    placement: "above" as const,
  },
  {
    sel: "[data-tour=competitors]",
    title: "Competitor radar",
    body: "Top 3 nearby competitors with Trust Score gaps. Know what to beat.",
    placement: "above" as const,
  },
];

type Box = { top: number; left: number; width: number; height: number } | null;

export function OnboardingTour({ disabled = false }: { disabled?: boolean }) {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [box, setBox] = useState<Box>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (disabled) return;
    if (localStorage.getItem(KEY)) return;
    // Wait 1.5s so other content renders + scroll positions settle
    const t = setTimeout(() => setActive(true), 1500);
    return () => clearTimeout(t);
  }, [disabled]);

  useEffect(() => {
    if (!active) return;
    const s = STEPS[step];
    if (!s) return;
    const el = document.querySelector(s.sel) as HTMLElement | null;
    if (!el) {
      // Skip missing targets gracefully
      if (step < STEPS.length - 1) setStep((i) => i + 1);
      else end();
      return;
    }
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      const r = el.getBoundingClientRect();
      setBox({ top: r.top, left: r.left, width: r.width, height: r.height });
    }, 350);
  }, [active, step]);

  function end() {
    localStorage.setItem(KEY, String(Date.now()));
    setActive(false);
  }

  if (!mounted || !active || !box) return null;

  const s = STEPS[step];
  const tipTop = s.placement === "below" ? box.top + box.height + 16 : box.top - 200;

  return (
    <div className="fixed inset-0 z-50 print:hidden">
      {/* Backdrop with spotlight cutout */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ mixBlendMode: "normal" }}>
        <defs>
          <mask id="tour-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect x={box.left - 6} y={box.top - 6} width={box.width + 12} height={box.height + 12} rx="14" fill="black" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.65)" mask="url(#tour-mask)" />
      </svg>

      {/* Spotlight outline */}
      <div
        className="absolute border-2 border-emerald-400 rounded-2xl pointer-events-none animate-pulse"
        style={{ top: box.top - 6, left: box.left - 6, width: box.width + 12, height: box.height + 12 }}
      />

      {/* Tooltip */}
      <div
        className="absolute z-10 w-[88vw] max-w-xs rounded-2xl bg-white shadow-2xl border-2 border-emerald-400 p-4 toast-fade-up"
        style={{ top: Math.max(12, tipTop), left: Math.max(12, Math.min(box.left, (typeof window !== "undefined" ? window.innerWidth : 800) - 340)) }}
      >
        <div className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-1">
          Tour · {step + 1}/{STEPS.length}
        </div>
        <h4 className="font-black text-base mb-1.5">{s.title}</h4>
        <p className="text-xs leading-relaxed text-[var(--muted)] mb-3">{s.body}</p>
        <div className="flex items-center justify-between gap-2">
          <button onClick={end} className="text-xs font-bold text-slate-500 hover:underline">Skip tour</button>
          <div className="flex gap-2">
            {step > 0 && (
              <button onClick={() => setStep((i) => i - 1)} className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-bold hover:bg-slate-50">
                ← Back
              </button>
            )}
            <button
              onClick={() => step < STEPS.length - 1 ? setStep((i) => i + 1) : end()}
              className="rounded-lg bg-emerald-600 text-white px-3 py-1.5 text-xs font-black hover:bg-emerald-700"
            >
              {step < STEPS.length - 1 ? "Next →" : "Finish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
