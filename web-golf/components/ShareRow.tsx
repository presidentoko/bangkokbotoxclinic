"use client";
import { useState } from "react";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thailandgolfguide.com";

export function ShareRow({
  path,
  title,
  locale = "en",
  className = "",
}: {
  path: string;
  title: string;
  locale?: "en" | "ko" | "th";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const url = `${SITE}${path}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — silently ignore, link stays selectable in URL bar
    }
  }

  const buttonClass =
    "flex items-center justify-center w-9 h-9 rounded-full border border-[var(--border)] bg-white hover:border-black transition text-sm";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mr-1">
        Share
      </span>
      <a
        href={`https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Share on LINE"
        title="Share on LINE"
      >
        <span aria-hidden style={{ color: "#06C755" }}>💬</span>
      </a>
      {locale === "ko" && (
        <button
          type="button"
          onClick={copyLink}
          className={buttonClass}
          aria-label="Copy link to share on KakaoTalk"
          title="카카오톡 공유 (링크 복사)"
        >
          <span aria-hidden style={{ color: "#FEE500" }}>💛</span>
        </button>
      )}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Share on WhatsApp"
        title="Share on WhatsApp"
      >
        <span aria-hidden style={{ color: "#25D366" }}>📱</span>
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Share on Facebook"
        title="Share on Facebook"
      >
        <span aria-hidden>📘</span>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        aria-label="Share on X"
        title="Share on X"
      >
        <span aria-hidden>✕</span>
      </a>
      <button
        type="button"
        onClick={copyLink}
        className={buttonClass}
        aria-label="Copy link"
        title="Copy link"
      >
        <span aria-hidden>{copied ? "✓" : "🔗"}</span>
      </button>
    </div>
  );
}
