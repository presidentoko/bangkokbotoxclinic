"use client";
// Floating contact bar — sticky bottom on mobile, fixed right on desktop.
// 모든 /clinic/[id] 페이지에 박혀서 전환 유도. 즉시 노출(스크롤 게이트 제거,
// 2026-07-17 감사) — 스크롤 200px까지는 사실상 fold 안에 CTA가 하나도 없었음.

import { useState } from "react";

// 사이트 공용 LINE OA — LineButton.tsx/app/layout.tsx 푸터와 동일 계정.
const SITE_LINE_OA = "405zhjqb";

export function FloatingContactBar({
  clinicName,
  phone,
  lineId,
}: {
  clinicName: string;
  phone?: string;
  lineId?: string | null;
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  // 클리닉 자체 LINE 없으면(거의 항상) 사이트 OA로 클리닉명 prefill —
  // 메인 버튼을 모달 경유 없는 직접 딥링크로 (2026-07-17 감사).
  const lineDeepLink = lineId
    ? `https://line.me/R/ti/p/@${encodeURIComponent(lineId.replace(/^@/, ""))}`
    : `https://line.me/R/oaMessage/@${SITE_LINE_OA}/?${encodeURIComponent(`I'm interested in ${clinicName}`)}`;

  return (
    <>
      {/* MOBILE — bottom sticky bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-white border-t border-[var(--border)] shadow-2xl px-3 py-2.5 flex gap-2 items-center">
          <a
            href={lineDeepLink}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex-1 py-3 px-3 rounded-lg font-bold text-sm text-white inline-flex items-center justify-center gap-2"
            style={{ background: "#06C755" }}
          >
            <LineLogo />
            Contact via LINE
          </a>
          {phone && (
            <a
              href={`tel:${phone.replace(/[^+\d]/g, "")}`}
              className="py-3 px-4 rounded-lg font-bold text-sm border border-[var(--border)] bg-white inline-flex items-center justify-center"
              aria-label={`Call ${clinicName}`}
            >
              📞
            </a>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="text-[var(--muted)] hover:text-[var(--fg)] text-lg leading-none px-2"
            aria-label="Dismiss contact bar"
          >
            ×
          </button>
        </div>
      </div>

      {/* DESKTOP — floating right button */}
      <div className="hidden md:flex fixed right-6 bottom-6 z-40 flex-col gap-2">
        <a
          href={lineDeepLink}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="px-5 py-3 rounded-full font-bold text-sm text-white shadow-xl inline-flex items-center gap-2 hover:scale-105 transition-transform"
          style={{ background: "#06C755" }}
        >
          <LineLogo />
          Contact via LINE
        </a>
        {phone && (
          <a
            href={`tel:${phone.replace(/[^+\d]/g, "")}`}
            className="px-5 py-3 rounded-full font-semibold text-sm bg-white border border-[var(--border)] shadow-lg inline-flex items-center gap-2 hover:scale-105 transition-transform"
          >
            📞 Call
          </a>
        )}
      </div>
    </>
  );
}

function LineLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
    </svg>
  );
}
