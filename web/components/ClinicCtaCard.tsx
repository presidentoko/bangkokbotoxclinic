"use client";

import { useState } from "react";
import { BookingForm } from "./BookingForm";
import { getSiteConfig } from "@/lib/site";

// 사이트 공용 LINE OA — LineButton.tsx/app/layout.tsx 푸터와 동일 계정.
const SITE_LINE_OA = "405zhjqb";

export function ClinicCtaCard({
  clinicName,
  phone,
  lineId,
}: {
  clinicName: string;
  phone?: string;
  lineId?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const cfg = getSiteConfig();

  // 클리닉 자체 LINE 없으면(거의 항상) 사이트 OA로 클리닉명 prefill —
  // 예전엔 lineId 없으면 LINE 버튼 자체가 안 뜸 (2026-07-17 감사).
  const lineDeepLink = lineId
    ? `https://line.me/R/ti/p/@${encodeURIComponent(lineId.replace(/^@/, ""))}`
    : `https://line.me/R/oaMessage/@${SITE_LINE_OA}/?${encodeURIComponent(`I'm interested in ${clinicName}`)}`;

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

        <div className="flex gap-2">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex-1 py-2 text-center rounded-lg border border-[var(--border)] text-sm hover:bg-gray-50 transition"
            >
              📞 Call directly
            </a>
          )}
          {lineDeepLink && (
            <a
              href={lineDeepLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 text-center rounded-lg border border-[var(--border)] text-sm hover:bg-gray-50 transition"
            >
              💬 LINE
            </a>
          )}
        </div>
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
            <BookingForm clinicName={clinicName} />
          </div>
        </div>
      )}
    </>
  );
}
