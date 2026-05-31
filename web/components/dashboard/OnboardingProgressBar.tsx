"use client";
// Top-of-dashboard thin progress bar showing dashboard-feature exploration %.
// Each session, marks sections viewed via IntersectionObserver, stores in sessionStorage.

import { useEffect, useState } from "react";

const SECTIONS = ["crisis", "leads", "views", "roi", "competitors", "review-requests"];
const KEY = "dash_explored_v1";

export function OnboardingProgressBar() {
  const [explored, setExplored] = useState<Set<string>>(new Set());

  useEffect(() => {
    const raw = sessionStorage.getItem(KEY);
    if (raw) {
      try { setExplored(new Set(JSON.parse(raw))); } catch { /* ignore */ }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let changed = false;
        const next = new Set(explored);
        entries.forEach((e) => {
          if (e.isIntersecting && !next.has(e.target.id)) {
            next.add(e.target.id);
            changed = true;
          }
        });
        if (changed) {
          setExplored(next);
          sessionStorage.setItem(KEY, JSON.stringify([...next]));
        }
      },
      { rootMargin: "-30% 0% -30% 0%" }
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct = (explored.size / SECTIONS.length) * 100;

  if (pct === 100) return null; // hide after full exploration

  return (
    <div className="bg-white border-b border-[var(--border)] print:hidden">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] shrink-0">
          Dashboard tour
        </span>
        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[10px] font-bold text-slate-700 tabular-nums shrink-0">
          {explored.size}/{SECTIONS.length} sections
        </span>
      </div>
    </div>
  );
}
