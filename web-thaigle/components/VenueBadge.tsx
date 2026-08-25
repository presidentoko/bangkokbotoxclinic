"use client";

import { useState } from "react";

type Props = {
  niche: string;
  slug: string;
  pageUrl: string;
  placeName: string;
};

/**
 * Free embed offered to every ranked venue: an <img> badge wrapped in a
 * link back to its Thaigle page. Backlinks are the one thing an
 * aggregator with near-zero domain authority can't get any other way, and
 * 2,000+ ranked spas alone are 2,000+ potential linkers.
 */
export function VenueBadge({ niche, slug, pageUrl, placeName }: Props) {
  const [copied, setCopied] = useState(false);
  const badgeSrc = `/api/badge/${niche}/${encodeURIComponent(slug)}`;
  const embed = `<a href="${pageUrl}" target="_blank" rel="noopener"><img src="${badgeSrc}" width="320" height="120" alt="${placeName} — ranked on Thaigle" style="border:0"></a>`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(embed);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be blocked (permissions, non-secure context) —
      // the textarea below still lets a visitor select-and-copy by hand.
    }
  }

  return (
    <section className="mb-6 border border-[var(--border)] rounded-2xl p-5 bg-white">
      <h2 className="font-black text-base mb-1">Run this venue? Add your badge, free.</h2>
      <p className="text-sm text-[var(--muted)] mb-4">
        Embed this on your own site — it links back to your ranking here and updates itself as reviews come in.
      </p>
      <div className="mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={badgeSrc} width={320} height={120} alt={`${placeName} — ranked on Thaigle`} className="rounded-xl border border-[var(--border)]" />
      </div>
      <div className="flex items-start gap-2">
        <textarea
          readOnly
          value={embed}
          rows={2}
          className="flex-1 text-xs font-mono bg-[var(--bg-subtle,#f7f5f2)] border border-[var(--border)] rounded-lg px-3 py-2 resize-none"
          onFocus={(e) => e.currentTarget.select()}
        />
        <button
          type="button"
          onClick={copy}
          className="shrink-0 px-3 py-2 rounded-lg bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition"
        >
          {copied ? "Copied ✓" : "Copy code"}
        </button>
      </div>
    </section>
  );
}
