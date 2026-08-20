"use client";
// HubSpot-style "hot leads" rail. Top 3 most recent unanswered leads with countdown to "stale"
// (every minute a lead waits, conversion rate drops by ~3%/hour after the first hour).
// Visceral, drives immediate action.

import { useEffect, useState } from "react";
import type { LeadRecord } from "@/lib/leadStore";
import { type LeadStatus } from "@/lib/dashboardHelpers";
import Avatar from "@/components/Avatar";

const STALE_HOURS = 4; // industry: contacting within 1h = 7× conversion vs 24h

function formatCountdown(ms: number): { label: string; color: string; bg: string } {
  if (ms <= 0) return { label: "🥶 cold", color: "#6b7280", bg: "#f3f4f6" };
  const mins = Math.floor(ms / 60_000);
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  if (hrs > 0) {
    return { label: `${hrs}h ${remMins}m left`, color: hrs >= 2 ? "#d97706" : "#dc2626", bg: hrs >= 2 ? "#fef3c7" : "#fee2e2" };
  }
  return { label: `${remMins}m left`, color: "#dc2626", bg: "#fee2e2" };
}

export function HotLeadsRail({
  leads,
  statuses,
}: {
  leads: LeadRecord[];
  statuses: Record<string, LeadStatus>;
}) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  // Hot = status "new" AND not contacted, sorted newest first, top 3
  const hot = leads
    .filter((l) => (statuses[l.id] ?? "new") === "new")
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 3);

  if (hot.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="flex items-baseline justify-between mb-3 px-1">
        <h2 className="text-sm font-black uppercase tracking-widest text-red-700 flex items-center gap-2">
          🔥 Hot leads · contact in 4h
        </h2>
        <a href="#leads" className="text-xs font-bold text-red-700 hover:underline">All leads →</a>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {hot.map((l) => {
          const ageMs = now - new Date(l.at).getTime();
          const remainingMs = STALE_HOURS * 3600_000 - ageMs;
          const cd = formatCountdown(remainingMs);

          return (
            <div key={l.id}
              className="relative rounded-2xl bg-white border-2 p-4 shadow-sm hover:shadow-md transition"
              style={{ borderColor: cd.bg === "#fee2e2" ? "#fecaca" : cd.bg === "#fef3c7" ? "#fde68a" : "var(--border)" }}>
              <div className="flex items-start gap-3">
                <Avatar name={l.name || l.email} email={l.email} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate text-sm">{l.name || "(no name)"}</div>
                  <div className="text-[11px] text-[var(--muted)] truncate">{l.email}</div>
                  {l.service && (
                    <span className="mt-1 inline-block rounded-md bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-800">{l.service}</span>
                  )}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider tabular-nums"
                  style={{ background: cd.bg, color: cd.color }}>
                  ⏱ {cd.label}
                </span>
                <a
                  href={`mailto:${l.email}?subject=${encodeURIComponent(`Re: your ${l.service || "consultation"} inquiry`)}`}
                  className="rounded-lg bg-emerald-600 text-white px-3 py-1.5 text-xs font-bold hover:bg-emerald-700"
                >
                  📧 Reply
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
