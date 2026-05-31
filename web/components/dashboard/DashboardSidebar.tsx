"use client";
// Left sticky-nav for dashboard. Highlights active section via IntersectionObserver.
// Hidden on mobile (uses MobileBottomNav instead).

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "crisis",         label: "Crisis alerts",    icon: "🚨" },
  { id: "leads",          label: "Leads",            icon: "📨" },
  { id: "views",          label: "Views",            icon: "👁" },
  { id: "roi",            label: "ROI",              icon: "💰" },
  { id: "competitors",    label: "Competitors",      icon: "👀" },
  { id: "review-requests", label: "Templates",        icon: "📝" },
];

export function DashboardSidebar() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0% -60% 0%" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="hidden xl:block fixed left-4 top-32 z-10 w-44 print:hidden">
      <div className="rounded-xl bg-white border shadow-sm p-2" style={{ borderColor: "var(--border)" }}>
        <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] px-2 pb-2 pt-1">Jump to</div>
        <ul className="space-y-0.5">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-bold transition ${
                  active === s.id ? "bg-emerald-50 text-emerald-900" : "text-slate-600 hover:bg-slate-50"
                }`}>
                <span className="text-base">{s.icon}</span>
                <span className="truncate">{s.label}</span>
                {active === s.id && <span className="ml-auto text-emerald-600">●</span>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
