"use client";

import { useState } from "react";
import { BookingForm } from "./BookingForm";

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

  const lineDeepLink = lineId
    ? `https://line.me/R/ti/p/@${encodeURIComponent(lineId.replace(/^@/, ""))}`
    : null;

  return (
    <>
      <div className="border-2 border-[var(--accent)] rounded-xl p-5 bg-white shadow-sm">
        <h2 className="text-lg font-bold text-[var(--fg)] mb-1">
          Get a Free Dental Consultation
        </h2>
        <ul className="text-sm text-[var(--muted)] mb-4 space-y-0.5">
          <li>✓ No obligation</li>
          <li>✓ English-speaking staff</li>
          <li>⏱ Usually responds within 2 hours</li>
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
