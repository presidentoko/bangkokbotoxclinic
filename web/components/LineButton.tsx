"use client";
// LINE 빠른 연결 — 핵심 CTA. clinic.line_id 있으면 그 클리닉으로 직접
// deep link, 없으면(대부분) 사이트 공식 LINE OA로 클리닉명 prefill 딥링크
// — 예전엔 이 경우 무조건 4단계 BookingForm 모달로 빠져서 "원탭 연결"이
// 실제론 폼 작성이었음 (2026-07-17 감사: 5,360개 중 4건만 clinic.line_id
// 있어서 사실상 전 클리닉이 이 경로였음). 폼은 보조 경로로 남김.

import { useState } from "react";
import { BookingForm } from "./BookingForm";

// 사이트 공용 LINE OA — app/layout.tsx 푸터와 동일 계정 (모든 도메인 공유).
const SITE_LINE_OA = "405zhjqb";

export function LineButton({
  clinicName, lineId, phone, size = "md",
}: {
  clinicName: string;
  lineId?: string | null;
  phone?: string;
  size?: "sm" | "md" | "lg";
}) {
  const [open, setOpen] = useState(false);

  // 클리닉 자체 LINE 있으면 그쪽으로 직접, 없으면 사이트 OA로 클리닉명 prefill.
  const directLine = lineId
    ? `https://line.me/R/ti/p/@${encodeURIComponent(lineId.replace(/^@/, ""))}`
    : `https://line.me/R/oaMessage/@${SITE_LINE_OA}/?${encodeURIComponent(`I'm interested in ${clinicName}`)}`;

  return (
    <>
      <a
        href={directLine}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={btnClass(size)}
        style={{ background: "#06C755", color: "white" }}
      >
        <LineLogo /> Quick contact via LINE
      </a>
      {!lineId && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="block mt-1.5 text-xs text-[var(--muted)] hover:text-[var(--fg)] underline underline-offset-2"
        >
          or send a request instead
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-[var(--bg)] rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-white sticky top-0">
              <h3 className="font-bold">Contact {clinicName}</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-2xl text-[var(--muted)] hover:text-[var(--fg)] leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-[var(--muted)] mb-4">
                We&apos;ll relay your request to {clinicName} via their LINE
                {phone ? ` or phone (${phone})` : ""} within 24 hours.
              </p>
              <BookingForm clinicName={clinicName} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function btnClass(size: "sm" | "md" | "lg") {
  const s =
    size === "sm" ? "py-1.5 px-3 text-xs"
    : size === "lg" ? "py-3 px-5 text-base"
    : "py-2.5 px-4 text-sm";
  return `inline-flex items-center justify-center gap-2 rounded-lg font-bold hover:opacity-90 transition ${s}`;
}

function LineLogo() {
  // Inline SVG of LINE logo (simple word "LINE")
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
    </svg>
  );
}
