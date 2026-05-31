"use client";
// Airbnb/Bumble-style 3-step concern quiz. Shows on first visit (localStorage-gated)
// or via "Find your clinic" CTA. Saves preferences and recommends results.
// Drops a banner suggesting tailored matches once complete.

import { useEffect, useState } from "react";

const SEEN_KEY = "quiz_seen_v1";
const PREFS_KEY = "quiz_prefs_v1";

type Prefs = {
  concern: string;
  budget: string;
  speakLang: string;
  completedAt: number;
};

type Step = {
  q: string;
  options: { v: string; label: string; emoji: string }[];
};

const STEPS: Step[] = [
  {
    q: "What's your main concern?",
    options: [
      { v: "results",   label: "Best possible results",   emoji: "✨" },
      { v: "price",     label: "Best value for money",     emoji: "💰" },
      { v: "english",   label: "English-speaking team",    emoji: "🇬🇧" },
      { v: "safety",    label: "Verified & safe",          emoji: "🛡️" },
    ],
  },
  {
    q: "Your budget range?",
    options: [
      { v: "lt-30k",  label: "Under ฿30,000",     emoji: "₿" },
      { v: "30-80k",  label: "฿30,000 – ฿80,000", emoji: "₿₿" },
      { v: "80-150k", label: "฿80,000 – ฿150,000", emoji: "₿₿₿" },
      { v: "150k+",   label: "฿150,000+",         emoji: "₿₿₿₿" },
    ],
  },
  {
    q: "Preferred language?",
    options: [
      { v: "en", label: "English",  emoji: "🇬🇧" },
      { v: "ko", label: "한국어",     emoji: "🇰🇷" },
      { v: "ar", label: "العربية",   emoji: "🇸🇦" },
      { v: "any", label: "Any works", emoji: "🌍" },
    ],
  },
];

export default function PersonalizationQuiz() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const seen = localStorage.getItem(SEEN_KEY);
    if (!seen) {
      // Open after 8 seconds on first visit
      const t = setTimeout(() => setOpen(true), 8000);
      return () => clearTimeout(t);
    }
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) setDone(true);
  }, []);

  function answer(v: string) {
    const next = [...answers];
    next[step] = v;
    setAnswers(next);
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      // Save prefs
      const prefs: Prefs = {
        concern: next[0],
        budget: next[1],
        speakLang: next[2],
        completedAt: Date.now(),
      };
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
      localStorage.setItem(SEEN_KEY, "1");
      setDone(true);
      // Close after 1s so user sees the "thanks" state
      setTimeout(() => setOpen(false), 1500);
    }
  }

  function dismiss() {
    localStorage.setItem(SEEN_KEY, "1");
    setOpen(false);
  }

  if (!mounted) return null;

  // Floating button to reopen (always available)
  const trigger = !open && (
    <button
      onClick={() => { setOpen(true); setStep(0); setDone(false); setAnswers(["", "", ""]); }}
      className="hidden sm:inline-flex fixed bottom-6 right-6 z-30 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-5 py-3 text-sm font-black shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition print:hidden"
    >
      <span className="mr-1">🎯</span> {done ? "Update preferences" : "Find your clinic"}
    </button>
  );

  if (!open) return trigger;

  const current = STEPS[step];
  const pct = ((step + 1) / STEPS.length) * 100;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 toast-fade-up" onClick={dismiss} />
      <div role="dialog" aria-modal="true"
        className="fixed left-1/2 -translate-x-1/2 top-[10vh] z-50 w-[90vw] max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden toast-fade-up">
        {done ? (
          <div className="p-7 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-2xl font-black mb-2">Tailored for you</h2>
            <p className="text-sm text-[var(--muted)] mb-5">
              Based on your answers, here&apos;s where to start:
            </p>
            <div className="grid gap-2 text-left">
              <a href="#directory" onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl border-2 border-blue-500 bg-blue-50 p-4 hover:bg-blue-100 hover:-translate-y-0.5 transition">
                <span className="text-2xl">📋</span>
                <div className="flex-1">
                  <div className="font-bold text-sm">Browse top-ranked clinics</div>
                  <div className="text-xs text-[var(--muted)]">Sorted by Trust Score for your filters</div>
                </div>
                <span className="text-blue-700">→</span>
              </a>
              <a href="https://line.me/R/ti/p/@405zhjqb" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border-2 border-emerald-400 bg-emerald-50 p-4 hover:bg-emerald-100 hover:-translate-y-0.5 transition">
                <span className="text-2xl">💬</span>
                <div className="flex-1">
                  <div className="font-bold text-sm">Get personal recommendations</div>
                  <div className="text-xs text-[var(--muted)]">DM us — free clinic match in 24h</div>
                </div>
                <span className="text-emerald-700">→</span>
              </a>
              <a href="/insights" onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl border-2 border-amber-400 bg-amber-50 p-4 hover:bg-amber-100 hover:-translate-y-0.5 transition">
                <span className="text-2xl">📊</span>
                <div className="flex-1">
                  <div className="font-bold text-sm">See market insights</div>
                  <div className="text-xs text-[var(--muted)]">Prices, trust distribution, district breakdown</div>
                </div>
                <span className="text-amber-700">→</span>
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="h-1 bg-slate-100">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300" style={{ width: `${pct}%` }} />
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
                  Step {step + 1} / {STEPS.length}
                </span>
                <button onClick={dismiss} aria-label="Close" className="text-[var(--muted)] hover:text-black -m-2 p-2">✕</button>
              </div>
              <h2 className="text-2xl font-black tracking-tight mb-5">{current.q}</h2>
              <div className="grid gap-2">
                {current.options.map((o) => (
                  <button key={o.v}
                    onClick={() => answer(o.v)}
                    className="flex items-center gap-3 w-full rounded-xl border-2 border-[var(--border)] bg-white p-4 text-left transition hover:border-blue-500 hover:bg-blue-50 hover:-translate-y-0.5"
                  >
                    <span className="text-2xl shrink-0">{o.emoji}</span>
                    <span className="font-bold flex-1">{o.label}</span>
                    <span className="text-[var(--muted)]">→</span>
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button onClick={() => setStep(step - 1)} className="mt-4 text-xs font-bold text-[var(--muted)] hover:text-black">
                  ← Back
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
