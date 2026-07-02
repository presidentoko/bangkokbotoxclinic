"use client";
import { useEffect, useState } from "react";

const BASE = 47;
const VARIANCE = 28;

export function LiveCount({ city = "Bangkok" }: { city?: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const seed = Math.floor(Date.now() / 300000);
    const pseudo = ((seed * 1103515245 + 12345) & 0x7fffffff) % VARIANCE;
    setCount(BASE + pseudo);

    const timer = setInterval(() => {
      const jitter = Math.floor(Math.random() * 7) - 3;
      setCount((c) => Math.max(10, (c ?? BASE) + jitter));
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  if (count === null) return null;

  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] bg-[var(--bg)] border border-[var(--border)] rounded-full px-3 py-1">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
      <span><strong className="text-[var(--fg)]">{count}</strong> people exploring {city} right now</span>
    </div>
  );
}
