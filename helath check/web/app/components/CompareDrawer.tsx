"use client";
import { useState, createContext, useContext, useCallback } from "react";
import type { PackageRow } from "@/lib/db";

// ── Context ───────────────────────────────────────────────────────────────────

type CompareCtx = {
  selected: PackageRow[];
  toggle: (row: PackageRow) => void;
  clear: () => void;
  isSelected: (id: number) => boolean;
};

const Ctx = createContext<CompareCtx>({
  selected: [], toggle: () => {}, clear: () => {}, isSelected: () => false,
});

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<PackageRow[]>([]);

  const toggle = useCallback((row: PackageRow) => {
    setSelected((prev) => {
      const has = prev.some((r) => r.package_id === row.package_id);
      if (has) return prev.filter((r) => r.package_id !== row.package_id);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, row];
    });
  }, []);

  const clear = useCallback(() => setSelected([]), []);
  const isSelected = useCallback((id: number) => selected.some((r) => r.package_id === id), [selected]);

  return <Ctx.Provider value={{ selected, toggle, clear, isSelected }}>{children}</Ctx.Provider>;
}

export function useCompare() { return useContext(Ctx); }

// ── Checkbox button for each card ─────────────────────────────────────────────

export function CompareCheckbox({ row }: { row: PackageRow }) {
  const { toggle, isSelected, selected } = useCompare();
  const checked = isSelected(row.package_id);
  const disabled = !checked && selected.length >= 3;

  return (
    <button
      onClick={() => toggle(row)}
      disabled={disabled}
      title={disabled ? "Max 3 packages" : checked ? "Remove from comparison" : "Add to comparison"}
      className={`text-xs px-2 py-1 rounded-lg border font-medium transition-colors ${
        checked
          ? "bg-blue-600 text-white border-blue-600"
          : disabled
          ? "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed"
          : "bg-white text-slate-500 border-slate-200 hover:border-blue-400 hover:text-blue-600"
      }`}>
      {checked ? "✓ Comparing" : "+ Compare"}
    </button>
  );
}

// ── Sticky bottom drawer ──────────────────────────────────────────────────────

const ROWS = [
  { key: "price", label: "Price" },
  { key: "has_blood", label: "Blood tests" },
  { key: "has_xray", label: "X-Ray" },
  { key: "has_ultrasound", label: "Ultrasound" },
  { key: "has_ct", label: "CT scan" },
  { key: "has_mri", label: "MRI" },
  { key: "has_ecg", label: "ECG" },
  { key: "has_treadmill", label: "Treadmill test" },
  { key: "has_cancer_marker", label: "Cancer markers" },
  { key: "has_doctor_consult", label: "Doctor consult" },
  { key: "has_interpreter", label: "Interpreter" },
  { key: "results_days", label: "Results in" },
  { key: "jci", label: "JCI accredited" },
] as const;

function CellValue({ row, field }: { row: PackageRow; field: string }) {
  if (field === "price") {
    return <span className="font-bold text-slate-900">{row.price ? `฿${parseFloat(row.price).toLocaleString()}` : "POA"}</span>;
  }
  if (field === "results_days") {
    return <span className="text-slate-600">{row.results_days != null ? `${row.results_days} days` : "—"}</span>;
  }
  if (field === "jci") {
    return row.jci === 1
      ? <span className="text-emerald-600 font-bold">✓ Yes</span>
      : <span className="text-slate-300">✗</span>;
  }
  const val = row[field as keyof PackageRow] as number | null;
  if (val === 1) return <span className="text-emerald-500 font-bold text-base">✓</span>;
  if (val === 0) return <span className="text-red-300 text-base">✗</span>;
  return <span className="text-slate-300">—</span>;
}

export function CompareDrawer() {
  const { selected, clear } = useCompare();
  const [open, setOpen] = useState(false);

  if (selected.length < 2) {
    if (selected.length === 1) {
      return (
        <div className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white rounded-2xl shadow-xl px-4 py-3 text-sm font-medium flex items-center gap-3">
          <span>1 selected — pick 1 more to compare</span>
          <button onClick={clear} className="text-blue-200 hover:text-white text-lg leading-none">×</button>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      {/* Trigger bar */}
      {!open && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-blue-700 text-white px-4 py-3 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm">{selected.length} packages selected</span>
            <div className="flex gap-2">
              {selected.map((r) => (
                <span key={r.package_id} className="bg-blue-600 text-xs px-2 py-0.5 rounded-lg max-w-[120px] truncate">{r.hospital_name}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setOpen(true)}
              className="bg-white text-blue-700 font-bold text-sm px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors">
              Compare now →
            </button>
            <button onClick={clear} className="text-blue-300 hover:text-white text-xl leading-none px-1">×</button>
          </div>
        </div>
      )}

      {/* Full comparison modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-4xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
              <h2 className="font-bold text-slate-900 text-lg">Package Comparison</h2>
              <div className="flex items-center gap-2">
                <button onClick={clear} className="text-xs text-slate-400 hover:text-red-500 underline underline-offset-2">Clear all</button>
                <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700 text-2xl leading-none min-w-11 min-h-11 flex items-center justify-center rounded-full hover:bg-slate-100">×</button>
              </div>
            </div>

            {/* Scroll body */}
            <div className="overflow-auto flex-1">
              <table className="w-full text-sm border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50 sticky top-0">
                    <th className="px-4 py-3 text-start text-xs font-semibold text-slate-500 w-32">Feature</th>
                    {selected.map((r) => (
                      <th key={r.package_id} className="px-4 py-3 text-center">
                        <p className="font-bold text-slate-800 text-sm">{r.hospital_name}</p>
                        <p className="text-xs text-slate-400 font-normal mt-0.5 line-clamp-1">{r.package_name}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row, i) => (
                    <tr key={row.key} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                      <td className="px-4 py-2.5 text-xs font-medium text-slate-500">{row.label}</td>
                      {selected.map((pkg) => (
                        <td key={pkg.package_id} className="px-4 py-2.5 text-center">
                          <CellValue row={pkg} field={row.key} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CTA row */}
            <div className="px-5 py-4 border-t border-slate-100 shrink-0 flex gap-3 overflow-x-auto">
              {selected.map((r) => {
                const url = r.source_url || r.checkup_url || "#";
                return (
                  <a key={r.package_id} href={url} target="_blank" rel="noopener noreferrer"
                    className="flex-1 min-w-[140px] bg-blue-600 text-white text-sm font-bold py-2.5 px-4 rounded-xl text-center hover:bg-blue-700 transition-colors whitespace-nowrap">
                    Book {r.hospital_name.split(" ")[0]} →
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
