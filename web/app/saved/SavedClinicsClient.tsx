"use client";

import { useEffect, useState } from "react";
import WishlistButton from "@/components/WishlistButton";

const KEY = "wishlist_v1";
const EVENT = "wishlist:changed";

type Saved = { id: string; name?: string; district?: string; rating?: number; reviews?: number; trust?: number };

export default function SavedClinicsClient() {
  const [ids, setIds] = useState<string[]>([]);
  const [data, setData] = useState<Saved[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function load() {
      try {
        const raw = localStorage.getItem(KEY);
        const arr = raw ? JSON.parse(raw) : [];
        setIds(Array.isArray(arr) ? arr : []);
      } catch { setIds([]); }
    }
    load();
    function onChange() { load(); }
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);

  useEffect(() => {
    if (ids.length === 0) { setData([]); setLoading(false); return; }
    setLoading(true);
    // Best-effort fetch — these clinic pages are static, so we just synthesize a stub list
    // and link out. Future: hit a /api/clinics?ids=… endpoint.
    setData(ids.map((id) => ({ id })));
    setLoading(false);
  }, [ids]);

  if (loading) {
    return <p className="text-sm text-[var(--muted)]">Loading…</p>;
  }

  if (ids.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed bg-slate-50 p-10 text-center" style={{ borderColor: "var(--border)" }}>
        <div className="text-5xl mb-3">❤️</div>
        <p className="font-bold text-lg mb-2">Nothing saved yet</p>
        <p className="text-sm text-[var(--muted)] mb-4">
          Tap the heart on any clinic to add it here. Compare them side-by-side later.
        </p>
        <a href="/" className="inline-block rounded-xl bg-slate-900 text-white px-5 py-2.5 text-sm font-bold hover:bg-black">
          Browse clinics →
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((c) => (
        <article key={c.id} className="relative rounded-xl border bg-white p-4 flex items-center gap-4" style={{ borderColor: "var(--border)" }}>
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-red-50 text-2xl shrink-0">❤️</div>
          <div className="flex-1 min-w-0">
            <a href={`/clinic/${c.id}`} className="font-bold hover:underline truncate block">{c.name || `Clinic · ${c.id.slice(0, 12)}…`}</a>
            <p className="text-xs text-[var(--muted)] mt-0.5">Tap to view full details + reviews + photos</p>
          </div>
          <WishlistButton clinicId={c.id} variant="full" />
        </article>
      ))}

      <div className="mt-6 flex gap-3 flex-wrap">
        <a href="/compare" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-5 py-2.5 text-sm font-bold hover:bg-black">
          Compare these → ⚖
        </a>
        <a href="/" className="inline-flex items-center gap-2 rounded-xl bg-white border px-5 py-2.5 text-sm font-bold hover:bg-slate-50"
          style={{ borderColor: "var(--border)" }}>
          Add more
        </a>
      </div>
    </div>
  );
}
