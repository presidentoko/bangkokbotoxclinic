"use client";

import { useState } from "react";
import { BookingForm } from "./BookingForm";

export function StickyClinicBar({
  clinicName,
  phone,
  lineId,
}: {
  clinicName: string;
  phone?: string;
  lineId?: string | null;
}) {
  const [open, setOpen] = useState(false);

  const lineDeepLink = lineId
    ? `https://line.me/R/ti/p/@${encodeURIComponent(lineId.replace(/^@/, ""))}`
    : null;

  return (
    <>
      <div className="sticky top-0 z-40 bg-white border-b border-[var(--border)] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
          <p className="font-semibold text-sm truncate max-w-[200px] md:max-w-xs text-[var(--fg)]">
            {clinicName}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-sm hover:bg-gray-50 transition"
              >
                📞 <span className="hidden sm:inline">Call</span>
              </a>
            )}
            {lineDeepLink && (
              <a
                href={lineDeepLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-sm hover:bg-gray-50 transition"
              >
                💬 <span className="hidden sm:inline">LINE</span>
              </a>
            )}
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition"
            >
              Book Free Consultation →
            </button>
          </div>
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
