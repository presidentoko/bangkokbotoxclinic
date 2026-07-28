"use client";
// Floating contact bar — sticky bottom on mobile, fixed right on desktop.
// 모든 /clinic/[id] 페이지에 박혀서 전환 유도. 즉시 노출(스크롤 게이트 제거,
// 2026-07-17 감사) — 스크롤 200px까지는 사실상 fold 안에 CTA가 하나도 없었음.

import { useState } from "react";
import { BookingForm } from "./BookingForm";

export function FloatingContactBar({
  clinicId,
  clinicName,
  phone,
}: {
  clinicId?: string;
  clinicName?: string;
  phone?: string;
}) {
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);

  if (dismissed) return null;

  return (
    <>
      {/* MOBILE — bottom sticky bar */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="bg-white border-t border-[var(--border)] shadow-2xl px-3 py-2.5 flex gap-2 items-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex-1 py-3 px-3 rounded-lg font-bold text-sm text-white inline-flex items-center justify-center gap-2"
            style={{ background: "var(--accent)" }}
          >
            Book Consultation →
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
            // w-11 h-11 = 44px 터치 타깃 (기존엔 ~26px, Book 버튼 바로 옆이라 오탭 위험 — 2026-07-28 감사)
            className="w-11 h-11 shrink-0 flex items-center justify-center text-[var(--muted)] hover:text-[var(--fg)] text-lg leading-none"
            aria-label="Dismiss contact bar"
          >
            ×
          </button>
        </div>
      </div>

      {/* DESKTOP — floating right button */}
      <div className="hidden md:flex fixed right-6 bottom-6 z-40 flex-col gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-5 py-3 rounded-full font-bold text-sm text-white shadow-xl inline-flex items-center gap-2 hover:scale-105 transition-transform"
          style={{ background: "var(--accent)" }}
        >
          Book Consultation →
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

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-[var(--muted)] hover:text-[var(--fg)] text-xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
            <BookingForm clinicId={clinicId} clinicName={clinicName} />
          </div>
        </div>
      )}
    </>
  );
}
