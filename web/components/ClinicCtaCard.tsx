"use client";

import { useState } from "react";
import { BookingForm } from "./BookingForm";
import { getSiteConfig } from "@/lib/site";

export function ClinicCtaCard({
  clinicName,
  phone,
}: {
  clinicName: string;
  phone?: string;
}) {
  const [open, setOpen] = useState(false);
  const cfg = getSiteConfig();

  return (
    <>
      <div className="border-2 border-[var(--accent)] rounded-xl p-5 bg-white shadow-sm">
        {/* "Dental" 하드코딩 → focus-aware. "Usually responds within 2 hours"
            등 5,360개 전 클리닉에 걸친 검증 불가능한 주장은 제거 (2026-07-17 감사). */}
        <h2 className="text-lg font-bold text-[var(--fg)] mb-1">
          Get a Free {cfg.focus === "dental" ? "Dental" : cfg.focus === "hair" ? "Hair" : ""} Consultation
        </h2>
        <ul className="text-sm text-[var(--muted)] mb-4 space-y-0.5">
          <li>✓ No obligation</li>
          <li>✓ We relay your request directly to the clinic</li>
        </ul>

        <button
          onClick={() => setOpen(true)}
          className="w-full py-3 rounded-lg bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition mb-3"
        >
          Book Consultation →
        </button>

        {phone && (
          <div className="flex gap-2">
            <a
              href={`tel:${phone.replace(/[^+\d]/g, "")}`}
              className="flex-1 py-2 text-center rounded-lg border border-[var(--border)] text-sm hover:bg-gray-50 transition"
            >
              📞 Call directly
            </a>
          </div>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90dvh] overflow-y-auto p-6 relative">
            {/* h-11 w-11 정사각 히트박스 — 글리프 크기(약 12px)만큼만 탭 영역이던 것을
                min-height 규칙만으론 못 잡던 문제 수정 (2026-07-31 감사). */}
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
