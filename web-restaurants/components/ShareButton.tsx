"use client";
import { useState } from "react";

export function ShareButton({
  name,
  rating,
  trustScore,
  url,
}: {
  name: string;
  rating: number;
  trustScore: number;
  url: string;
}) {
  const [copied, setCopied] = useState(false);

  const fullUrl = `https://www.snsstopper.com${url}`;
  const shareText = `${name} — Trust Score ${trustScore.toFixed(0)}, ★${rating.toFixed(1)} (${fullUrl})`;

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: name, text: shareText, url: fullUrl });
        return;
      } catch {
        // cancelled or not supported — fall through to copy
      }
    }
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 px-3 min-h-[36px] rounded-full border border-[var(--border)] text-xs text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition font-medium"
    >
      {copied ? (
        <>✓ Copied!</>
      ) : (
        <><span aria-hidden>↗</span> Share</>
      )}
    </button>
  );
}

/** Generic share button for non-restaurant pages (collections, verdict cards). */
export function GenericShareButton({
  title,
  text,
  url,
  label = "Share this verdict",
}: {
  title: string;
  text: string;
  url: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const fullUrl = `https://www.snsstopper.com${url}`;
  const shareText = `${text} ${fullUrl}`;

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: fullUrl });
        return;
      } catch {
        // cancelled or not supported — fall through to copy
      }
    }
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 px-4 min-h-[44px] rounded-full bg-[var(--fg)] text-white text-sm font-bold hover:opacity-80 transition"
    >
      {copied ? (
        <>✓ Copied to clipboard!</>
      ) : (
        <><span aria-hidden>↗</span> {label}</>
      )}
    </button>
  );
}

export function WhatsAppShare({ name, url }: { name: string; url: string }) {
  const fullUrl = `https://www.snsstopper.com${url}`;
  const text = encodeURIComponent(`Check out ${name} on SNS Stopper: ${fullUrl}`);
  return (
    <a
      href={`https://wa.me/?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 px-3 min-h-[44px] rounded-full border border-[var(--border)] text-xs text-[var(--muted)] hover:border-green-500 hover:text-green-600 transition font-medium"
    >
      WhatsApp
    </a>
  );
}
