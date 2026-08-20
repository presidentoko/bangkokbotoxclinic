"use client";
// Multi-select lead checkboxes + floating bottom bar with bulk apply.
// Gmail-style UX. State-only — would wire to API in next iteration.

import { useState } from "react";
import { LEAD_STATUS_META, type LeadStatus } from "@/lib/dashboardHelpers";

export function BulkLeadActions({
  leadIds,
  onApplyStatus,
  onExport,
}: {
  leadIds: string[];
  onApplyStatus: (ids: string[], status: LeadStatus) => void;
  onExport: (ids: string[]) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  }

  function toggleAll() {
    setSelected(selected.size === leadIds.length ? new Set() : new Set(leadIds));
  }

  if (leadIds.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={toggleAll}
          className="rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-bold hover:bg-slate-50"
        >
          {selected.size === leadIds.length ? "Deselect all" : `Select all (${leadIds.length})`}
        </button>
        {selected.size > 0 && (
          <span className="text-xs font-bold text-emerald-700">{selected.size} selected</span>
        )}
      </div>

      {selected.size > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 rounded-2xl bg-slate-900 text-white shadow-2xl px-4 py-3 flex items-center gap-3 flex-wrap toast-fade-up print:hidden">
          <span className="text-sm font-bold">{selected.size} selected</span>
          <div className="h-5 w-px bg-white/30" />
          {(Object.keys(LEAD_STATUS_META) as LeadStatus[]).map((s) => (
            <button key={s} onClick={() => { onApplyStatus([...selected], s); setSelected(new Set()); }}
              className="text-xs font-bold px-2.5 py-1.5 rounded-md hover:bg-white/10">
              {LEAD_STATUS_META[s].label}
            </button>
          ))}
          <div className="h-5 w-px bg-white/30" />
          <button onClick={() => onExport([...selected])}
            className="text-xs font-bold px-2.5 py-1.5 rounded-md hover:bg-white/10">
            📥 Export
          </button>
          <button onClick={() => setSelected(new Set())}
            className="text-xs text-white/60 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* expose toggle for parent rows — they call SelectBox below */}
      <div className="sr-only" data-selected={[...selected].join(",")} />
    </>
  );
}

// Helper checkbox to drop into each lead row
export function LeadSelectBox({ id, on, toggle }: { id: string; on: boolean; toggle: (id: string) => void }) {
  return (
    <input
      type="checkbox"
      checked={on}
      onChange={() => toggle(id)}
      className="h-4 w-4 accent-emerald-600 cursor-pointer"
      onClick={(e) => e.stopPropagation()}
    />
  );
}
