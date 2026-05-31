"use client";
// Bell icon with dropdown — synth activity feed for dashboard.
// In real usage this would fetch from /api/owner/notifications.

import { useEffect, useRef, useState } from "react";
import { relTime } from "@/lib/dashboardHelpers";

type Notif = { id: string; icon: string; text: string; at: string; read: boolean };

function genFeed(clinicId: string): Notif[] {
  const now = Date.now();
  const feed: Notif[] = [
    { id: "n1", icon: "📨", text: "New lead — Min-jun from Seoul",                    at: new Date(now - 5 * 60_000).toISOString(),         read: false },
    { id: "n2", icon: "⭐", text: "+0.1 Trust Score this week",                        at: new Date(now - 3 * 3600_000).toISOString(),       read: false },
    { id: "n3", icon: "💬", text: "Negative review needs reply (★2)",                 at: new Date(now - 7 * 3600_000).toISOString(),       read: false },
    { id: "n4", icon: "👀", text: "Competitor Apex Profound +2 reviews this week",    at: new Date(now - 26 * 3600_000).toISOString(),      read: true },
    { id: "n5", icon: "📅", text: "Weekly digest sent",                                at: new Date(now - 5 * 86_400_000).toISOString(),     read: true },
  ];
  // Make deterministic per clinic: shuffle slightly
  return feed.map((f, i) => ({ ...f, id: `${clinicId}-${i}` }));
}

export function NotificationCenter({ clinicId }: { clinicId: string }) {
  const [open, setOpen] = useState(false);
  const [feed, setFeed] = useState<Notif[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFeed(genFeed(clinicId));
  }, [clinicId]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const unread = feed.filter((f) => !f.read).length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-xs font-bold hover:bg-slate-50 print:hidden"
        aria-label="Notifications"
      >
        <span>🔔</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 grid place-items-center h-5 min-w-[20px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-white shadow-2xl border z-30 overflow-hidden toast-fade-up" style={{ borderColor: "var(--border)" }}>
          <div className="px-4 py-2.5 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
            <span className="font-black text-sm">Notifications</span>
            <button
              onClick={() => setFeed((f) => f.map((n) => ({ ...n, read: true })))}
              className="text-xs text-emerald-700 font-bold hover:underline"
            >
              Mark all read
            </button>
          </div>
          <ul className="max-h-80 overflow-y-auto divide-y" style={{ borderColor: "var(--border)" }}>
            {feed.map((n) => (
              <li key={n.id} className={`px-4 py-2.5 flex items-start gap-3 ${n.read ? "" : "bg-blue-50/40"}`}>
                <span className="text-lg shrink-0">{n.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs ${n.read ? "" : "font-bold"}`}>{n.text}</div>
                  <div className="text-[10px] text-[var(--muted)] mt-0.5">{relTime(n.at)}</div>
                </div>
                {!n.read && <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
