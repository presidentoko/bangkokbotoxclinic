"use client";
// Floating contact bar — sticky bottom on mobile, fixed right on desktop.
// 모든 /clinic/[id] 페이지에 박혀서 전환 유도. 스크롤 200px 이후 자동 노출.

import { useState, useEffect } from "react";
import { BookingForm } from "./BookingForm";

export function FloatingContactBar({
  clinicName,
  phone,
  lineId,
}: {
  clinicName: string;
  phone?: string;
  lineId?: string | null;
}) {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 스크롤 200px 이후 노출 (페이지 위쪽 충돌 방지)
    const handler = () => {
      if (window.scrollY > 200) setShow(true);
      else setShow(false);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (dismissed) return null;

  const lineDeepLink = lineId
    ? `https://line.me/R/ti/p/@${encodeURIComponent(lineId.replace(/^@/, ""))}`
    : null;

  return (
    <>
      {/* MOBILE — bottom sticky bar */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
          show ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!show}
      >
        <div className="bg-white border-t border-[var(--border)] shadow-2xl px-3 py-2.5 flex gap-2 items-center">
          <button
            onClick={() => setOpen(true)}
            className="flex-1 py-3 px-3 rounded-lg font-bold text-sm text-white inline-flex items-center justify-center gap-2"
            style={{ background: "#06C755" }}
          >
            <LineLogo />
            Contact via LINE
          </button>
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
      <div
        className={`hidden md:flex fixed right-6 bottom-6 z-40 flex-col gap-2 transition-all duration-300 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-hidden={!show}
      >
        <button
          onClick={() => setOpen(true)}
          className="px-5 py-3 rounded-full font-bold text-sm text-white shadow-xl inline-flex items-center gap-2 hover:scale-105 transition-transform"
          style={{ background: "#06C755" }}
        >
          <LineLogo />
          Contact via LINE
        </button>
        {phone && (
          <a
            href={`tel:${phone.replace(/[^+\d]/g, "")}`}
            className="px-5 py-3 rounded-full font-semibold text-sm bg-white border border-[var(--border)] shadow-lg inline-flex items-center gap-2 hover:scale-105 transition-transform"
          >
            📞 Call
          </a>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4 overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-[var(--bg)] rounded-t-2xl md:rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
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
            <div className="p-4 space-y-3">
              {lineDeepLink && (
                <a
                  href={lineDeepLink}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="w-full py-3 px-4 rounded-lg font-bold text-white text-center inline-flex items-center justify-center gap-2"
                  style={{ background: "#06C755" }}
                >
                  <LineLogo /> Open LINE directly
                </a>
              )}
              <p className="text-sm text-[var(--muted)]">
                Or send your request via this form and we&apos;ll relay it to {clinicName} within 24 hours.
              </p>
              <BookingForm clinicName={clinicName} />
            </div>
          </div>
        </div>
      )}
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
