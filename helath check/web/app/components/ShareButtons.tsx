"use client";
import { useState } from "react";

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("input");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const waUrl = `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`;
  const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400 hidden sm:inline">Share:</span>
      <button
        onClick={copyLink}
        className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1.5 rounded-lg transition-colors"
      >
        {copied ? "✓ Copied!" : "🔗 Copy link"}
      </button>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs bg-green-50 hover:bg-green-100 text-green-700 px-2.5 py-1.5 rounded-lg transition-colors"
      >
        WhatsApp
      </a>
      <a
        href={twUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1.5 rounded-lg transition-colors"
      >
        𝕏 Tweet
      </a>
    </div>
  );
}
