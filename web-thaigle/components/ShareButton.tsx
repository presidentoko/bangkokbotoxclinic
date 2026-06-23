"use client";

import { useState } from "react";

type Props = {
  title: string;
  text?: string;
  url: string;
  kakao?: boolean;
  whatsapp?: boolean;
  line?: boolean;
};

export function ShareButton({ title, text, url, kakao = false, whatsapp = false, line = false }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // fall through to copy
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const shareText = text ? `${title}\n${text}` : title;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] text-sm font-medium bg-white hover:bg-orange-50 hover:border-orange-400 hover:text-orange-700 transition active:scale-95"
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
          href={`https://line.me/R/msg/text/?${encodeURIComponent(shareText + "\n" + url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-[#00B900] text-white hover:brightness-95 transition active:scale-95"
          aria-label="Share on LINE"
        >
          LINE
        </a>
      )}

      {/* WhatsApp — Middle East + global */}
      {whatsapp && (
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText + "\n" + url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-[#25D366] text-white hover:brightness-95 transition active:scale-95"
          aria-label="Share on WhatsApp"
        >
          WhatsApp
        </a>
      )}

      {/* KakaoTalk — Korean tourists */}
      {kakao && (
        <a
          href={`https://story.kakao.com/share?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-[#FEE500] text-[#3C1E1E] hover:brightness-95 transition active:scale-95"
          aria-label="KakaoTalk 공유"
        >
          카카오
        </a>
      )}
    </div>
  );
}
