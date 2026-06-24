"use client";
// Native share API + copy link + WhatsApp/LINE/X quick share.
// On clinic detail. Tracks share events to a public counter (best-effort).

import { useState } from "react";

export default function ShareToFriend({
  clinicName,
  url,
}: {
  clinicName: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);
  const text = `Check out ${clinicName} on Thai Facial Clinic — verified across 6 independent sources.`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  }

  async function nativeShare() {
    if (navigator.share) {
      try { await navigator.share({ title: clinicName, text, url }); } catch { /* user cancelled */ }
    } else {
      copy();
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-4 sm:p-5" style={{ borderColor: "rgb(var(--border))" }}>
      <div className="flex items-baseline justify-between mb-3 gap-3">
        <h3 className="font-black text-sm">Share with someone considering this</h3>
        <button onClick={nativeShare} className="text-xs font-bold text-emerald-700 hover:underline">Share →</button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[rgb(var(--border))] bg-white px-3 py-2 text-xs font-bold hover:bg-slate-50">
          {copied ? "✓ Copied!" : "🔗 Copy link"}
        </button>
        <a target="_blank" rel="noopener noreferrer"
          href={`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#25d366] text-white px-3 py-2 text-xs font-bold hover:opacity-90">
          📱 WhatsApp
        </a>
        <a target="_blank" rel="noopener noreferrer"
          href={`https://line.me/R/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#06c755] text-white px-3 py-2 text-xs font-bold hover:opacity-90">
          💬 LINE
        </a>
        <a target="_blank" rel="noopener noreferrer"
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 text-white px-3 py-2 text-xs font-bold hover:opacity-90">
          𝕏 X
        </a>
        <a target="_blank" rel="noopener noreferrer"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#1877f2] text-white px-3 py-2 text-xs font-bold hover:opacity-90">
          f Facebook
        </a>
      </div>
    </div>
  );
}
