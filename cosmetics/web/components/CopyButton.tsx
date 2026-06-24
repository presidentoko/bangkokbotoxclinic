"use client";
import { useState } from "react";

interface CopyButtonProps {
  text: string;
  locale: string;
}

export function CopyButton({ text, locale }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (typeof navigator === "undefined") return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center gap-1.5 rounded-xl bg-neutral-100 px-3 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-200 transition-all active:scale-95"
    >
      {copied ? (
        <>
          <span>✓</span>
          <span>{locale === "th" ? "คัดลอก" : "Copy"}</span>
        </>
      ) : (
        <>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          <span>{locale === "th" ? "คัดลอก" : "Copy"}</span>
        </>
      )}
    </button>
  );
}
