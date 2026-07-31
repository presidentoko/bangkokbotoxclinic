"use client";

import { useState } from "react";
import { trackShare } from "@/lib/track";

type Props = {
  title: string;
  text?: string;
  url: string;
  kakao?: boolean;
  whatsapp?: boolean;
  line?: boolean;
  facebook?: boolean;
};

function withUtm(rawUrl: string, medium: string): string {
  try {
    const u = new URL(rawUrl);
    const campaign = u.pathname.split("/").filter(Boolean)[0] || "home";
    u.searchParams.set("utm_source", "share");
    u.searchParams.set("utm_medium", medium);
    u.searchParams.set("utm_campaign", campaign);
    return u.toString();
  } catch {
    return rawUrl;
  }
}

export function ShareButton({ title, text, url, kakao = false, whatsapp = false, line = false, facebook = false }: Props) {
  const [copied, setCopied] = useState(false);
  const campaign = (() => {
    try { return new URL(url).pathname.split("/").filter(Boolean)[0] || "home"; } catch { return "home"; }
  })();

  async function handleShare() {
    const shareUrl = withUtm(url, "native");
    trackShare("native", campaign);
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch {
        // fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (HTTP context, denied permission, old
      // browser) — nothing more we can do; avoid an unhandled rejection.
    }
  }

  const shareText = text ? `${title}\n${text}` : title;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 px-3 min-h-[44px] rounded-full border border-[var(--border)] text-sm font-medium bg-white hover:bg-orange-50 hover:border-orange-400 hover:text-orange-700 transition active:scale-95"
        aria-label="Share"
      >
        {copied ? (
          <>✓ Copied</>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </>
        )}
      </button>

      {/* LINE — Thailand + Japan primary messaging app */}
      {line && (
        <a
          href={`https://line.me/R/msg/text/?${encodeURIComponent(shareText + "\n" + withUtm(url, "line"))}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackShare("line", campaign)}
          className="inline-flex items-center gap-1.5 px-3 min-h-[44px] rounded-full text-sm font-bold bg-[#00B900] text-white hover:brightness-95 transition active:scale-95"
          aria-label="Share on LINE"
        >
          LINE
        </a>
      )}

      {/* WhatsApp — Middle East + global */}
      {whatsapp && (
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText + "\n" + withUtm(url, "whatsapp"))}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackShare("whatsapp", campaign)}
          className="inline-flex items-center gap-1.5 px-3 min-h-[44px] rounded-full text-sm font-bold bg-[#25D366] text-white hover:brightness-95 transition active:scale-95"
          aria-label="Share on WhatsApp"
        >
          WhatsApp
        </a>
      )}

      {/* KakaoTalk — Korean tourists */}
      {kakao && (
        <a
          href={`https://story.kakao.com/share?url=${encodeURIComponent(withUtm(url, "kakao"))}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackShare("kakao", campaign)}
          className="inline-flex items-center gap-1.5 px-3 min-h-[44px] rounded-full text-sm font-bold bg-[#FEE500] text-[#3C1E1E] hover:brightness-95 transition active:scale-95"
          aria-label="Share on KakaoTalk"
        >
          Kakao
        </a>
      )}

      {/* Facebook — popular in Thailand */}
      {facebook && (
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(withUtm(url, "facebook"))}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackShare("facebook", campaign)}
          className="inline-flex items-center gap-1.5 px-3 min-h-[44px] rounded-full text-sm font-bold bg-[#1877F2] text-white hover:brightness-95 transition active:scale-95"
          aria-label="Share on Facebook"
        >
          Facebook
        </a>
      )}
    </div>
  );
}
