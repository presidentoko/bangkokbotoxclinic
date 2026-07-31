"use client";

import { useState } from "react";
import { BookingForm } from "./BookingForm";

export function StickyClinicBar({
  clinicName,
  phone,
}: {
  clinicName: string;
  phone?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* top-14 = SiteHeader의 h-14 높이만큼 offset — 겹쳐서 헤더/햄버거 메뉴를 가리는 것 방지 */}
      <div className="sticky top-14 z-20 bg-white border-b border-[var(--border)] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
          <p className="font-semibold text-sm truncate max-w-[200px] md:max-w-xs text-[var(--fg)]">
            {clinicName}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            {phone && (
              <a
                href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-[var(--border)] text-sm hover:bg-gray-50 transition"
              >
                📞 <span className="hidden sm:inline">Call</span>
              </a>
            )}
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition whitespace-nowrap"
            >
              {/* 360px에서 전체 문구 쓰면 이름+전화 버튼과 함께 두 줄로 밀림 (2026-07-28 감사) */}
              <span className="sm:hidden">Book →</span>
              <span className="hidden sm:inline">Book Free Consultation →</span>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90dvh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 grid h-11 w-11 place-items-center text-[var(--muted)] hover:text-[var(--fg)] text-xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
            <BookingForm clinicName={clinicName} />
          </div>
        </div>
      )}
    </>
  );
}
