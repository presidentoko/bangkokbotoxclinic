"use client";
// Linear-style Cmd+K command palette. Type to filter, ↑↓ to navigate, Enter to act.
// Hotkey: Cmd+K (Mac) or Ctrl+K (Win). Actions: scroll to section, open links, copy share URL.

import { useEffect, useRef, useState } from "react";

type Cmd = {
  id: string;
  label: string;
  hint?: string;
  icon: string;
  action: () => void;
  keywords?: string[];
};

export function CommandPalette({
  clinicId,
  shareUrl,
}: {
  clinicId: string;
  shareUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const cmds: Cmd[] = [
    { id: "crisis",   label: "Open crisis alerts (negative reviews)", icon: "🚨", action: () => scrollTo("#crisis"),    keywords: ["reply", "review", "negative"] },
    { id: "leads",    label: "Open lead inbox",                       icon: "📨", action: () => scrollTo("#leads"),     keywords: ["form", "inquiry", "contact"] },
    { id: "views",    label: "Profile views (30-day chart)",          icon: "👁",  action: () => scrollTo("#views"),     keywords: ["traffic", "analytics"] },
    { id: "roi",      label: "ROI calculator",                        icon: "💰", action: () => scrollTo("#roi"),       keywords: ["money", "value", "revenue"] },
    { id: "competitors", label: "Competitor analysis",                 icon: "👀", action: () => scrollTo("#competitors"), keywords: ["rivals", "ranking"] },
    { id: "templates", label: "Reply templates",                       icon: "📝", action: () => scrollTo("#review-requests"), keywords: ["line", "sms", "message"] },
    { id: "share",    label: "Copy shareable dashboard URL",           icon: "🔗", action: () => { navigator.clipboard.writeText(shareUrl); }, keywords: ["link", "url"] },
    { id: "preview",  label: "View public clinic page",                icon: "🌐", action: () => window.open(`/clinic/${clinicId}`, "_blank"), keywords: ["patient", "frontend"] },
    { id: "upgrade",  label: "Activate paid plan",                     icon: "⭐", action: () => { window.location.href = "/for-clinics#pricing"; }, keywords: ["subscribe", "pay", "trial"] },
    { id: "print",    label: "Export PDF report",                      icon: "📊", action: () => window.print(),         keywords: ["save", "download"] },
    { id: "help",     label: "Contact support",                        icon: "💬", action: () => { window.location.href = "/contact"; }, keywords: ["chat", "email"] },
  ];

  function scrollTo(sel: string) {
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
        setActiveIdx(0);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const filtered = !query.trim()
    ? cmds
    : cmds.filter((c) => {
        const q = query.toLowerCase();
        return c.label.toLowerCase().includes(q) || (c.keywords || []).some((k) => k.includes(q));
      });

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(filtered.length - 1, i + 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIdx((i) => Math.max(0, i - 1)); }
    if (e.key === "Enter") {
      e.preventDefault();
      const c = filtered[activeIdx];
      if (c) { c.action(); setOpen(false); }
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="hidden md:inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs text-[var(--muted)] hover:bg-slate-50 print:hidden"
        title="Press Cmd+K"
      >
        <span>🔍</span>
        <span>Quick actions</span>
        <kbd className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono">⌘K</kbd>
      </button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 toast-fade-up" onClick={() => setOpen(false)} />
      <div role="dialog" aria-modal="true" className="fixed left-1/2 -translate-x-1/2 top-[12vh] z-50 w-[92vw] max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden toast-fade-up">
        <div className="flex items-center gap-2 border-b p-3" style={{ borderColor: "var(--border)" }}>
          <span className="text-[var(--muted)]">🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
            onKeyDown={onKey}
            placeholder="Search actions..."
            className="flex-1 outline-none text-sm bg-transparent"
          />
          <kbd className="rounded bg-slate-100 px-2 py-1 text-[10px] font-mono text-[var(--muted)]">ESC</kbd>
        </div>
        <ul className="max-h-[55vh] overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <li className="p-6 text-center text-sm text-[var(--muted)]">No actions match &ldquo;{query}&rdquo;</li>
          ) : filtered.map((c, i) => (
            <li key={c.id}>
              <button
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => { c.action(); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm ${i === activeIdx ? "bg-blue-50" : "hover:bg-slate-50"}`}
              >
                <span className="text-xl shrink-0">{c.icon}</span>
                <span className="flex-1 font-medium">{c.label}</span>
                {i === activeIdx && <span className="text-xs text-blue-600 font-bold">↵</span>}
              </button>
            </li>
          ))}
        </ul>
        <div className="border-t bg-slate-50 px-3 py-2 text-[10px] text-[var(--muted)] flex items-center gap-3" style={{ borderColor: "var(--border)" }}>
          <span><kbd className="rounded bg-white border px-1 py-0.5 font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="rounded bg-white border px-1 py-0.5 font-mono">↵</kbd> select</span>
          <span><kbd className="rounded bg-white border px-1 py-0.5 font-mono">ESC</kbd> close</span>
        </div>
      </div>
    </>
  );
}
