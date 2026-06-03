"use client";

import { useMemo, useState } from "react";
import type { LeadRecord } from "@/lib/leadStore";
import { LEAD_STATUS_META, type LeadStatus } from "@/lib/dashboardStore";
import { useToast } from "./Toast";
import Avatar from "./Avatar";

type Props = {
  clinicId: string;
  accessToken: string | null;
  initialLeads: LeadRecord[];
  initialStatuses: Record<string, LeadStatus>;
  initialNotes: Record<string, string>;
  initialRevenue: Record<string, number>;
  totalLeads: number;
};

const STATUSES: LeadStatus[] = ["new", "contacted", "booked", "no_show", "cancelled"];

function thb(n: number): string {
  return `฿${n.toLocaleString()}`;
}

export default function LeadInbox({
  clinicId, accessToken, initialLeads, initialStatuses, initialNotes, initialRevenue, totalLeads,
}: Props) {
  const [statuses, setStatuses] = useState(initialStatuses);
  const [notes, setNotes] = useState(initialNotes);
  const [revenue, setRevenue] = useState(initialRevenue);
  const [filter, setFilter] = useState<"all" | LeadStatus>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const toast = useToast();

  const filtered = useMemo(() => {
    if (filter === "all") return initialLeads;
    return initialLeads.filter((l) => (statuses[l.id] ?? "new") === filter);
  }, [filter, initialLeads, statuses]);

  // Revenue summary
  const summary = useMemo(() => {
    let bookedCount = 0;
    let totalRev = 0;
    for (const l of initialLeads) {
      const st = statuses[l.id] ?? "new";
      const rev = revenue[l.id] ?? 0;
      if (st === "booked") bookedCount++;
      totalRev += rev;
    }
    const conv = initialLeads.length ? (bookedCount / initialLeads.length) * 100 : 0;
    const avg = bookedCount ? totalRev / bookedCount : 0;
    return { bookedCount, totalRev, conv, avg };
  }, [initialLeads, statuses, revenue]);

  async function update(leadId: string, patch: { status?: LeadStatus; note?: string; revenue_thb?: number }, label: string) {
    try {
      const r = await fetch("/api/owner/lead/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinic_id: clinicId, access_token: accessToken, lead_id: leadId, ...patch }),
      });
      if (r.ok) toast.push("success", `${label} saved`);
      else toast.push("error", `${label} failed`);
    } catch {
      toast.push("error", "Network error");
    }
  }

  function changeStatus(leadId: string, status: LeadStatus) {
    setStatuses((s) => ({ ...s, [leadId]: status }));
    update(leadId, { status }, "Status");
  }

  function changeNote(leadId: string, note: string) {
    setNotes((s) => ({ ...s, [leadId]: note }));
    update(leadId, { note }, "Note");
  }

  function changeRevenue(leadId: string, raw: string) {
    const n = parseInt(raw.replace(/[,\s฿]/g, ""), 10);
    if (!Number.isFinite(n) || n < 0) {
      setRevenue((s) => { const c = { ...s }; delete c[leadId]; return c; });
      update(leadId, { revenue_thb: 0 }, "Revenue");
      return;
    }
    setRevenue((s) => ({ ...s, [leadId]: n }));
    update(leadId, { revenue_thb: n }, "Revenue");
  }

  function exportCsv() {
    const rows = [
      ["At", "Name", "Email", "Phone", "Procedure", "Status", "Revenue (THB)", "Notes"],
      ...initialLeads.map((l) => [
        l.at, l.name, l.email, l.phone, l.procedure,
        statuses[l.id] ?? "new",
        String(revenue[l.id] ?? ""),
        notes[l.id] ?? "",
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${(c || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `leads-${clinicId.slice(-8)}-${Date.now()}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="card overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3 border-b p-5" style={{ borderColor: "rgb(var(--border))" }}>
        <div>
          <div className="eyebrow">Live inbox</div>
          <h2 className="mt-1 font-display text-2xl font-bold">Leads · {totalLeads} lifetime</h2>
        </div>
        <button onClick={exportCsv} className="text-xs font-bold underline muted hover:text-[rgb(var(--fg))]">
          Export CSV ↓
        </button>
      </div>

      {/* Revenue summary */}
      <div className="grid grid-cols-2 border-b sm:grid-cols-4" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="p-4 text-center bg-gold-50/40 dark:bg-gold-950/20">
          <div className="text-[10px] font-bold uppercase tracking-wider muted">Revenue from us</div>
          <div className="mt-1 font-display text-2xl font-bold tabular-nums text-gold-800 dark:text-gold-200">{thb(summary.totalRev)}</div>
          <div className="text-[10px] muted">lifetime</div>
        </div>
        <div className="p-4 text-center border-l" style={{ borderColor: "rgb(var(--border))" }}>
          <div className="text-[10px] font-bold uppercase tracking-wider muted">Booked</div>
          <div className="mt-1 font-display text-2xl font-bold tabular-nums text-mint-700">{summary.bookedCount}</div>
          <div className="text-[10px] muted">of {initialLeads.length} recent</div>
        </div>
        <div className="p-4 text-center border-l" style={{ borderColor: "rgb(var(--border))" }}>
          <div className="text-[10px] font-bold uppercase tracking-wider muted">Conversion</div>
          <div className="mt-1 font-display text-2xl font-bold tabular-nums">{summary.conv.toFixed(0)}%</div>
          <div className="text-[10px] muted">booked / lead</div>
        </div>
        <div className="p-4 text-center border-l" style={{ borderColor: "rgb(var(--border))" }}>
          <div className="text-[10px] font-bold uppercase tracking-wider muted">Avg ticket</div>
          <div className="mt-1 font-display text-2xl font-bold tabular-nums">{summary.avg ? thb(Math.round(summary.avg)) : "—"}</div>
          <div className="text-[10px] muted">per booking</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-2 border-b p-3" style={{ borderColor: "rgb(var(--border))" }}>
        <button onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1 text-xs font-bold transition ${filter === "all" ? "bg-navy-900 text-white" : "bg-[rgb(var(--bg))] muted"}`}>
          All · {initialLeads.length}
        </button>
        {STATUSES.map((s) => {
          const count = initialLeads.filter((l) => (statuses[l.id] ?? "new") === s).length;
          const meta = LEAD_STATUS_META[s];
          return (
            <button key={s} onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1 text-xs font-bold transition ${filter === s ? "ring-2 ring-offset-2 ring-offset-[rgb(var(--bg-elev))]" : ""}`}
              style={{ background: filter === s ? meta.color : meta.bg, color: filter === s ? "#fff" : meta.color }}>
              {meta.label} · {count}
            </button>
          );
        })}
      </div>

      {/* Lead rows */}
      {filtered.length === 0 ? (
        <p className="p-10 text-center text-sm muted">
          {initialLeads.length === 0 ? "No leads yet. Future booking-form submissions will appear here in real time." : "No leads with this status."}
        </p>
      ) : (
        <ul className="divide-y" style={{ borderColor: "rgb(var(--border))" }}>
          {filtered.map((l) => {
            const status = statuses[l.id] ?? "new";
            const meta = LEAD_STATUS_META[status];
            const isOpen = expanded === l.id;
            return (
              <li key={l.id}>
                <div className="grid grid-cols-[1fr_auto] gap-3 p-4 sm:grid-cols-[auto_1.5fr_1fr_1fr_auto] sm:items-center">
                  <div className="text-xs muted tabular-nums whitespace-nowrap">
                    {new Date(l.at).toLocaleDateString()}<br />
                    <span className="text-[10px]">{new Date(l.at).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={l.name || l.email} email={l.email} size={40} />
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{l.name || "(no name)"}</div>
                      <div className="text-xs muted truncate">{l.email}{l.phone && ` · ${l.phone}`}</div>
                      {l.procedure && <div className="mt-0.5 inline-block rounded bg-navy-50 px-1.5 py-0.5 text-[10px] font-bold text-navy-700 dark:bg-navy-800 dark:text-navy-200">{l.procedure}</div>}
                    </div>
                  </div>
                  <select value={status} onChange={(e) => changeStatus(l.id, e.target.value as LeadStatus)}
                    className="rounded-lg border bg-[rgb(var(--bg))] px-2 py-1.5 text-xs font-bold"
                    style={{ borderColor: meta.color, color: meta.color }}>
                    {STATUSES.map((s) => <option key={s} value={s}>{LEAD_STATUS_META[s].label}</option>)}
                  </select>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs muted">฿</span>
                    <input type="text" inputMode="numeric"
                      defaultValue={revenue[l.id] ? revenue[l.id].toLocaleString() : ""}
                      onBlur={(e) => changeRevenue(l.id, e.target.value)}
                      placeholder="0"
                      className="w-full rounded-lg border bg-[rgb(var(--bg))] py-1.5 pl-5 pr-2 text-xs font-bold tabular-nums"
                      style={{ borderColor: "rgb(var(--border))" }}
                    />
                  </div>
                  <button onClick={() => setExpanded(isOpen ? null : l.id)}
                    className="text-xs font-bold muted hover:text-[rgb(var(--fg))]">
                    {isOpen ? "−" : "+"} note
                  </button>
                </div>
                {isOpen && (
                  <div className="border-t bg-[rgb(var(--bg))] p-4" style={{ borderColor: "rgb(var(--border))" }}>
                    <textarea
                      defaultValue={notes[l.id] ?? ""}
                      onBlur={(e) => changeNote(l.id, e.target.value)}
                      placeholder="Add a note about this lead (e.g., 'wants FUE 2,500 grafts, free Jun 5'). Saved when you click away."
                      rows={3}
                      className="w-full rounded-lg border bg-[rgb(var(--bg-elev))] px-3 py-2 text-sm"
                      style={{ borderColor: "rgb(var(--border))" }}
                    />
                    {l.notes && (
                      <div className="mt-3 rounded bg-[rgb(var(--bg-elev))] p-3 text-xs">
                        <div className="font-bold uppercase tracking-wider muted text-[10px]">Patient's message</div>
                        <div className="mt-1">{l.notes}</div>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
