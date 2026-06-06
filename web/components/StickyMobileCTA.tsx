"use client";
// Booking.com-style sticky CTA at bottom of mobile clinic-detail page.
// Shows on scroll past header (so it doesn't double up with the visible hero CTA).
// Hides on form scroll-into-view.

import { useEffect, useState } from "react";

export default function StickyMobileCTA({
  clinicName,
  ctaHref = "#booking",
  ctaLabel = "Get matched (free)",
  priceFrom,
  rating,
}: {
  clinicName: string;
  ctaHref?: string;
  ctaLabel?: string;
  priceFrom?: number;
  rating?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 350 && window.scrollY < (document.body.scrollHeight - window.innerHeight - 600));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-30 px-2 print:hidden toast-fade-up"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="mx-auto max-w-md rounded-2xl bg-white border-2 border-emerald-300 shadow-2xl p-2.5 flex items-center gap-2">
        <div className="flex-1 min-w-0 pl-1">
          <div className="font-bold text-xs truncate">{clinicName}</div>
          <div className="text-[10px] text-[var(--muted)] flex items-center gap-1.5">
            {rating && <span className="font-bold text-yellow-700">★{rating.toFixed(1)}</span>}
            {priceFrom && <span>· from ฿{(priceFrom / 1000).toFixed(0)}K</span>}
            {!rating && !priceFrom && <span>Free consult · reply &lt; 24h</span>}
          </div>
        </div>
        <a href={ctaHref}
          className="rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white px-4 py-2.5 text-xs font-black hover:opacity-90 active:scale-95 shrink-0 whitespace-nowrap">
          {ctaLabel} →
        </a>
      </div>
    </div>
  );
}
