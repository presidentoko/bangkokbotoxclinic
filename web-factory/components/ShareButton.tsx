"use client";

import { useState } from "react";

interface Props {
  url: string;
  title: string;
  /** Compact icon-only variant for sidebars; default is "full" labelled bar */
  variant?: "full" | "compact";
}

export function ShareButton({ url, title, variant = "full" }: Props) {
  const [copied, setCopied] = useState(false);

  const abs = typeof window !== "undefined"
    ? (url.startsWith("http") ? url : `${window.location.origin}${url}`)
    : url;

  function copyLink() {
    const target = typeof window !== "undefined"
      ? (url.startsWith("http") ? url : `${window.location.origin}${url}`)
      : url;
    navigator.clipboard.writeText(target).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // fallback: select input
      const el = document.createElement("textarea");
      el.value = target;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const waText = encodeURIComponent(`${title}\n${abs}`);
  const emailSubject = encodeURIComponent(title);
  const emailBody = encodeURIComponent(`Hi,\n\nI found this Thai supplier and thought it might be useful:\n\n${title}\n${abs}\n\nBest`);

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={copyLink}
          title="Copy link"
          className="py-1.5 px-2.5 rounded-lg text-xs font-bold border border-[var(--border)] bg-white hover:border-stone-900 transition flex items-center gap-1"
        >
          {copied ? "✓ Copied" : "🔗 Copy"}
        </button>
        <a
          href={`https://wa.me/?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on WhatsApp"
          className="py-1.5 px-2.5 rounded-lg text-xs font-bold border border-[var(--border)] bg-white hover:border-green-600 hover:text-green-700 transition"
        >
          WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-bold uppercase tracking-wide text-stone-500">Share</span>
      <button
        type="button"
        onClick={copyLink}
        className={`inline-flex items-center gap-1.5 py-2 px-3.5 rounded-lg text-sm font-bold border transition ${
          copied
            ? "bg-emerald-50 border-emerald-400 text-emerald-800"
            : "bg-white border-stone-300 hover:border-stone-800"
        }`}
      >
        {copied ? "✓ Link copied!" : "🔗 Copy link"}
      </button>
      <a
        href={`https://wa.me/?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-lg text-sm font-bold border border-stone-300 bg-white hover:border-green-600 hover:text-green-700 transition"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.112 1.523 5.837L.057 23.882l6.21-1.452A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.893 0-3.664-.527-5.176-1.437l-.371-.22-3.686.862.902-3.589-.241-.381A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
        WhatsApp
      </a>
      <a
        href={`mailto:?subject=${emailSubject}&body=${emailBody}`}
        className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-lg text-sm font-bold border border-stone-300 bg-white hover:border-stone-800 transition"
      >
        ✉ Email
      </a>
    </div>
  );
}
