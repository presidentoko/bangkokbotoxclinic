"use client";
import { useState, useEffect } from "react";

const KEY = "bkk_saved_packages";

function getSaved(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const v = localStorage.getItem(KEY);
    return v ? new Set(JSON.parse(v) as number[]) : new Set();
  } catch { return new Set(); }
}

function setSaved(ids: Set<number>) {
  localStorage.setItem(KEY, JSON.stringify([...ids]));
}

export function SaveButton({ packageId }: { packageId: number }) {
  const [saved, setSavedState] = useState(false);

  useEffect(() => {
    setSavedState(getSaved().has(packageId));
  }, [packageId]);

  function toggle() {
    const s = getSaved();
    if (s.has(packageId)) s.delete(packageId);
    else s.add(packageId);
    setSaved(s);
    setSavedState(s.has(packageId));
  }

  return (
    <button
      onClick={toggle}
      title={saved ? "Remove from saved" : "Save package"}
      className={`text-lg leading-none transition-colors ${saved ? "text-amber-400" : "text-slate-200 hover:text-amber-300"}`}
    >
      {saved ? "★" : "☆"}
    </button>
  );
}

export function SavedCount() {
  const [count, setCount] = useState(0);
  useEffect(() => { setCount(getSaved().size); }, []);
  if (!count) return null;
  return <span className="ms-1 text-xs bg-amber-400 text-white rounded-full px-1.5 py-0.5">{count}</span>;
}
