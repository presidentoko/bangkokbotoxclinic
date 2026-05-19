"use client";

import { useState } from "react";

export function EmbedSnippet({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API blocked — fall through, user can still select manually
    }
  };
  return (
    <div className="relative">
      <pre className="bg-gray-900 text-gray-100 text-xs p-4 rounded-xl overflow-x-auto leading-relaxed whitespace-pre-wrap break-all">
        {code}
      </pre>
      <button
        type="button"
        onClick={onCopy}
        className="absolute top-2 right-2 text-xs font-medium bg-white text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition"
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
    </div>
  );
}
