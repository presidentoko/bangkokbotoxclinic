"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSearchIndex } from "@/lib/searchIndexClient";

export function SurpriseMeButton({ className, label = "🎲 Surprise me" }: {
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const entities = await fetchSearchIndex();
      if (entities.length === 0) return;
      const pick = entities[Math.floor(Math.random() * entities.length)];
      router.push(`/restaurant/${pick.id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={
        className ??
        "inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[var(--border)] bg-white text-sm font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition disabled:opacity-60"
      }
    >
      {loading ? "🎲 Picking…" : label}
    </button>
  );
}
