"use client";
import { useEffect, useState } from "react";

// Pages using this are pure SSG (dynamicParams=false, no revalidate), so a
// server-computed "Xh ago" freezes at build/deploy time and drifts wrong
// between deploys. Computing it client-side keeps it honest against "now".
function relativeTimeFromIso(iso: string): string {
  const then = new Date(iso).getTime();
  if (isNaN(then)) return "recently";
  const diff = Math.max(0, Date.now() - then);
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

export function FreshnessTime({ generatedAt }: { generatedAt: string }) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    setText(relativeTimeFromIso(generatedAt));
  }, [generatedAt]);

  return <>{text ?? "—"}</>;
}
