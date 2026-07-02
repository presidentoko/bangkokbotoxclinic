"use client";
import { useState, useEffect } from "react";

type SavedItem = {
  id: string;
  name: string;
  type: string;
  rating?: number;
  trust?: number;
  url?: string;
  icon?: string;
};

export function CompareCard() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [a, setA] = useState<SavedItem | null>(null);
  const [b, setB] = useState<SavedItem | null>(null);

  useEffect(() => {
    try {
      const saved: SavedItem[] = JSON.parse(localStorage.getItem("thaigle_saved") ?? "[]");
      setItems(saved);
      if (saved.length >= 2) { setA(saved[0]); setB(saved[1]); }
    } catch {}
  }, []);

  if (items.length < 2) return null;

  const winner = a && b && a.trust != null && b.trust != null
    ? (a.trust > b.trust ? a : b.trust > a.trust ? b : null)
    : null;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-bold uppercase tracking-wide text-[var(--muted)] mb-3">⚖️ Compare saved places</div>
      <div className="flex gap-2 mb-3">
        <select
          className="flex-1 text-sm border border-[var(--border)] rounded-lg px-2 py-1.5 bg-[var(--bg)]"
          value={a?.id ?? ""}
          onChange={(e) => setA(items.find((i) => i.id === e.target.value) ?? null)}
        >
          {items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
        <span className="text-[var(--muted)] self-center font-bold text-sm">vs</span>
        <select
          className="flex-1 text-sm border border-[var(--border)] rounded-lg px-2 py-1.5 bg-[var(--bg)]"
          value={b?.id ?? ""}
          onChange={(e) => setB(items.find((i) => i.id === e.target.value) ?? null)}
        >
          {items.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </div>
      {a && b && (
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[a, b].map((v) => (
            <div key={v.id} className={`p-3 rounded-xl border ${winner?.id === v.id ? "border-orange-400 bg-orange-50" : "border-[var(--border)]"}`}>
              <div className="font-bold truncate text-xs mb-1">
                {winner?.id === v.id && <span className="text-orange-600 mr-1">👑</span>}
                {v.name}
              </div>
              {v.trust != null && <div className="text-xs text-[var(--muted)]">Trust <span className="font-bold text-[var(--fg)]">{v.trust}</span>/100</div>}
              {v.rating != null && <div className="text-xs text-[var(--muted)]">★ <span className="font-bold text-[var(--fg)]">{v.rating.toFixed(1)}</span></div>}
              {v.url && <a href={v.url} className="text-xs text-orange-600 hover:underline mt-1 block">View →</a>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
