"use client";

import { useState } from "react";
import { clearShortlist } from "@/lib/shortlist";
import { useShortlist } from "./useShortlist";

export function ShortlistTray() {
  const { items, mounted } = useShortlist();
  const [copied, setCopied] = useState(false);

  if (!mounted || items.length === 0) return null;

  function shareList() {
    const ids = items.map((x) => x.id).join(",");
    const url = `${window.location.origin}/compare?ids=${ids}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t-2 border-emerald-600 bg-white/98 backdrop-blur-sm shadow-[0_-4px_20px_rgba(0,0,0,0.12)]">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black tabular-nums">
              {items.length}
            </span>
            <span className="text-sm font-semibold hidden sm:block">
              supplier{items.length > 1 ? "s" : ""} shortlisted
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1 overflow-x-auto max-w-xs">
            {items.slice(0, 3).map((x) => (
              <span key={x.id} className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full truncate max-w-[100px]">
                {x.name.split(" ")[0]}
              </span>
            ))}
            {items.length > 3 && (
              <span className="text-xs text-stone-400">+{items.length - 3}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={clearShortlist}
            className="py-2 px-3 rounded-lg text-xs font-bold border border-stone-300 bg-white hover:border-stone-700 transition hidden sm:block"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={shareList}
            className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
              copied
                ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                : "border-stone-300 bg-white hover:border-emerald-600 hover:text-emerald-700"
            }`}
          >
            {copied ? "✓ Copied!" : "🔗 Share"}
          </button>
          <a
            href="/compare"
            className="py-2 px-3 rounded-lg text-xs font-bold border border-stone-700 bg-white hover:bg-stone-50 transition"
          >
            ⚖ Compare
          </a>
          <a
            href="/quote"
            className="py-2 px-4 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition"
          >
            Request quote →
          </a>
        </div>
      </div>
    </div>
  );
}
