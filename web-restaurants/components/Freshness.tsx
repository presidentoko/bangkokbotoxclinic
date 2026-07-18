"use client";
import { useEffect, useState } from "react";
import { relativeTimeFromIso } from "./Badges";

// Computed client-side on mount — this sits on force-static pages, so a
// server-computed relative time would freeze at whatever it was during the
// last build (e.g. "Updated 2h ago" staying literally true forever) until
// the next deploy.
export function Freshness({ generatedAt, mode = "card" }: {
  generatedAt: string;
  mode?: "card" | "detail";
}) {
  const [ago, setAgo] = useState<string | null>(null);
  useEffect(() => {
    setAgo(relativeTimeFromIso(generatedAt));
  }, [generatedAt]);

  if (mode === "card") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-[var(--muted)]">
        <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
        Updated {ago ?? "recently"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-xs text-[var(--muted)] bg-white px-3 py-1 rounded-full border border-[var(--border)]">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      Last updated {ago ?? "recently"}
    </span>
  );
}
