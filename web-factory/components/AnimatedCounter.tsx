"use client";

import { useEffect, useRef, useState } from "react";

type FormatKind = "int" | "capital_thb" | "years" | "score" | "comma";

type Props = {
  value: number;
  duration?: number;
  format?: FormatKind;
  prefix?: string;
  suffix?: string;
  className?: string;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function fmt(n: number, kind: FormatKind | undefined): string {
  if (kind === "capital_thb") {
    if (n >= 1_000_000_000) return `฿${(n / 1_000_000_000).toFixed(2)}B`;
    if (n >= 1_000_000) return `฿${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `฿${(n / 1_000).toFixed(0)}K`;
    return `฿${n.toFixed(0)}`;
  }
  if (kind === "years") return `${n}y`;
  if (kind === "score") return `${n}`;
  if (kind === "comma" || kind === undefined) return n.toLocaleString();
  return `${n}`;
}

export function AnimatedCounter({ value, duration = 1100, format, prefix, suffix, className }: Props) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(1, elapsed / duration);
      setDisplay(Math.round(easeOutCubic(progress) * value));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return <span className={className}>{prefix}{fmt(display, format)}{suffix}</span>;
}
