"use client";
import { useState } from "react";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="text-xs font-bold px-3 py-1 rounded-lg transition-colors"
      style={{
        background: copied ? "#10b981" : "#374151",
        color: "white",
      }}
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}
