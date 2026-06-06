"use client";
// Heart toggle with localStorage persistence. RealSelf/Pinterest pattern.
// On a clinic detail page, prominent. On a card, compact corner icon.
// Wishlist count exposed via custom event so Header can show a badge.

import { useEffect, useState } from "react";

const KEY = "wishlist_v1";
const EVENT = "wishlist:changed";

function loadList(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch { return []; }
}

function saveList(list: string[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(EVENT, { detail: list }));
}

export default function WishlistButton({
  clinicId,
  variant = "compact",
}: {
  clinicId: string;
  variant?: "compact" | "full";
}) {
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSaved(loadList().includes(clinicId));
    function onChange(e: Event) {
      const list = (e as CustomEvent<string[]>).detail;
      setSaved(list.includes(clinicId));
    }
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, [clinicId]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const list = loadList();
    const next = saved ? list.filter((x) => x !== clinicId) : [...list, clinicId];
    saveList(next);
    setSaved(!saved);
  }

  if (!mounted) return null;

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={saved ? "Remove from saved" : "Save clinic"}
        className={`absolute top-2 right-2 z-10 grid h-9 w-9 place-items-center rounded-full backdrop-blur shadow-md transition ${
          saved ? "bg-red-500 text-white" : "bg-white/90 text-slate-700 hover:bg-white"
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-bold transition ${
        saved
          ? "bg-red-50 border-red-300 text-red-700"
          : "bg-white border-[rgb(var(--border))] text-[rgb(var(--fg))] hover:border-red-300"
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      {saved ? "Saved" : "Save"}
    </button>
  );
}

// Count component — read-only badge for header
export function WishlistCount({ className = "" }: { className?: string }) {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCount(loadList().length);
    function onChange(e: Event) {
      setCount(((e as CustomEvent<string[]>).detail || []).length);
    }
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);

  if (!mounted || count === 0) return null;

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold ${className}`}>
      <span className="text-red-500">❤</span>
      <span>{count}</span>
    </span>
  );
}
