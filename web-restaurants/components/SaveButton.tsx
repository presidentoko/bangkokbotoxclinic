"use client";
import { useEffect, useState } from "react";
import { isSaved, toggleSaved } from "@/lib/savedRestaurants";

export function SaveButton({ id, className }: { id: string; className?: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isSaved(id));
  }, [id]);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setSaved(toggleSaved(id));
      }}
      aria-label={saved ? "Remove from saved" : "Save restaurant"}
      aria-pressed={saved}
      title={saved ? "Saved" : "Save for later"}
      className={`min-h-[44px] min-w-[44px] py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center ${
        saved
          ? "bg-red-50 border-red-200 text-red-500"
          : "bg-[var(--card)] border-[var(--border)] hover:border-red-300 hover:text-red-500"
      } ${className ?? ""}`}
    >
      {saved ? "❤️" : "🤍"}
    </button>
  );
}
