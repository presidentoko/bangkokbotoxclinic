"use client";
import { useState, useEffect } from "react";

const ITEMS = [
  { id: "visa", label: "Check visa requirements", link: null },
  { id: "sim", label: "Get a Thai SIM card or e-SIM", link: null },
  { id: "cash", label: "Get Thai Baht (ATM in BKK is easiest)", link: null },
  { id: "grab", label: "Download Grab app (ride-hailing)", link: null },
  { id: "klook", label: "Pre-book popular activities on Klook", link: "/activities" },
  { id: "phrase", label: "Learn 3 Thai phrases", link: "/local-tips" },
  { id: "insurance", label: "Get travel insurance", link: null },
  { id: "sunscreen", label: "Pack sunscreen (SPF 50+)", link: null },
];

const KEY = "thaigle_checklist";

export function TravelChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      setChecked(new Set(saved));
    } catch {}
    setLoaded(true);
  }, []);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      try { localStorage.setItem(KEY, JSON.stringify([...next])); } catch {}
      return next;
    });
  };

  const pct = loaded ? Math.round((checked.size / ITEMS.length) * 100) : 0;

  if (!loaded) return null;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-black">✅ Bangkok Pre-Trip Checklist</div>
        <div className="text-xs font-bold text-orange-600">{checked.size}/{ITEMS.length}</div>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="space-y-2">
        {ITEMS.map((item) => (
          <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={checked.has(item.id)}
              onChange={() => toggle(item.id)}
              className="w-4 h-4 rounded accent-orange-500 shrink-0"
            />
            <span className={`text-sm transition ${checked.has(item.id) ? "line-through text-[var(--muted)]" : "group-hover:text-orange-700"}`}>
              {item.link ? <a href={item.link} className="underline decoration-dotted" onClick={(e) => e.stopPropagation()}>{item.label}</a> : item.label}
            </span>
          </label>
        ))}
      </div>
      {checked.size === ITEMS.length && (
        <div className="mt-3 text-center text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-xl py-2">
          🎉 You&apos;re ready for Bangkok!
        </div>
      )}
    </div>
  );
}
