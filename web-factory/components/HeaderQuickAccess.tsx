"use client";

import { useEffect, useRef, useState } from "react";
import { loadRecent, subscribeRecent, type RecentItem } from "@/lib/recentlyViewed";
import { loadShortlist, subscribeShortlist, clearShortlist, type ShortlistItem } from "@/lib/shortlist";

export function HeaderQuickAccess() {
  const [recent, setRecent] = useState<RecentItem[]>([]);
  const [shortlist, setShortlist] = useState<ShortlistItem[]>([]);
  const [openPanel, setOpenPanel] = useState<"recent" | "shortlist" | null>(null);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecent(loadRecent());
    setShortlist(loadShortlist());
    const unsubRecent = subscribeRecent(() => setRecent(loadRecent()));
    const unsubShortlist = subscribeShortlist(() => setShortlist(loadShortlist()));
    return () => {
      unsubRecent();
      unsubShortlist();
    };
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenPanel(null);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function shareShortlist() {
    const ids = shortlist.map((x) => x.id).join(",");
    const url = `${window.location.origin}/compare?ids=${ids}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {});
  }

  if (recent.length === 0 && shortlist.length === 0) return null;

  return (
    <div ref={ref} className="flex items-center gap-1">
      {recent.length > 0 && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenPanel(openPanel === "recent" ? null : "recent")}
            className="relative p-2 rounded-lg hover:bg-[var(--gold-bg)] transition"
            aria-label={`Recently viewed (${recent.length})`}
          >
            <span aria-hidden className="text-base">🕒</span>
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--gold)] text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
              {recent.length}
            </span>
          </button>
          {openPanel === "recent" && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-[var(--border)] rounded-xl shadow-lg z-30 p-2">
              <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--muted)] px-2 py-1.5">
                Recently viewed
              </div>
              {recent.slice(0, 5).map((r) => (
                <a
                  key={r.id}
                  href={`/supplier/${r.id}`}
                  className="block px-2 py-2 rounded-lg hover:bg-[var(--gold-bg)] transition"
                >
                  <div className="text-sm font-semibold truncate">{r.name}</div>
                  <div className="text-xs text-[var(--muted)]">
                    {r.cityLabel || "Thailand"} · Trust {r.trustScore}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
      {shortlist.length > 0 && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenPanel(openPanel === "shortlist" ? null : "shortlist")}
            className="relative p-2 rounded-lg hover:bg-[var(--gold-bg)] transition"
            aria-label={`Shortlisted suppliers (${shortlist.length})`}
          >
            <span aria-hidden className="text-base">⚖️</span>
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--gold)] text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
              {shortlist.length}
            </span>
          </button>
          {openPanel === "shortlist" && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-[var(--border)] rounded-xl shadow-lg z-30 p-2">
              <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--muted)] px-2 py-1.5">
                Shortlisted
              </div>
              {shortlist.slice(0, 5).map((s) => (
                <a
                  key={s.id}
                  href={`/supplier/${s.id}`}
                  className="block px-2 py-2 rounded-lg hover:bg-[var(--gold-bg)] transition"
                >
                  <div className="text-sm font-semibold truncate">{s.name}</div>
                  <div className="text-xs text-[var(--muted)]">{s.cityLabel}</div>
                </a>
              ))}
              <div className="flex gap-1.5 mt-1 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={shareShortlist}
                  className="flex-1 text-xs font-bold py-1.5 rounded-lg border border-[var(--border)] hover:border-[var(--gold)] transition"
                >
                  {copied ? "✓ Copied!" : "🔗 Share"}
                </button>
                <a
                  href="/compare"
                  className="flex-1 text-center text-xs font-bold py-1.5 rounded-lg bg-[var(--gold)] text-white hover:opacity-90 transition"
                >
                  Compare →
                </a>
                <button
                  type="button"
                  onClick={clearShortlist}
                  className="text-xs font-bold py-1.5 px-2 rounded-lg border border-[var(--border)] hover:border-stone-700 transition"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
