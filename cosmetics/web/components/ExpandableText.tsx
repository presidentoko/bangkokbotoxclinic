"use client";
import { useState } from "react";

export function ExpandableText({
  text,
  locale,
  lines = 4,
}: {
  text: string;
  locale: string;
  lines?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const clampClass = expanded ? "" : `line-clamp-${lines}`;
  return (
    <div>
      <p
        className={`text-sm text-neutral-700 leading-relaxed whitespace-pre-line ${clampClass}`}
      >
        {text}
      </p>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-2 text-xs font-medium text-rose-500 hover:text-rose-700 transition-colors"
      >
        {expanded
          ? locale === "th" ? "ย่อลง ↑" : "Show less ↑"
          : locale === "th" ? "อ่านต่อ ↓" : "Read more ↓"}
      </button>
    </div>
  );
}
