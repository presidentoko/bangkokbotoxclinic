"use client";
import { useState, useDeferredValue, useMemo } from "react";
import type { PackageRow } from "@/lib/db";

export function PackageSearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search hospital or package name..."
        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-white"
      />
      {value && (
        <button onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg leading-none">
          ×
        </button>
      )}
    </div>
  );
}

export function usePackageFilter(rows: PackageRow[]) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);

  const filtered = useMemo(() => {
    if (!deferred.trim()) return rows;
    const q = deferred.toLowerCase();
    return rows.filter(
      (r) =>
        r.hospital_name.toLowerCase().includes(q) ||
        r.package_name.toLowerCase().includes(q) ||
        (r.area ?? "").toLowerCase().includes(q),
    );
  }, [rows, deferred]);

  return { query, setQuery, filtered, totalCount: rows.length };
}
