"use client";

import { useEffect, useState } from "react";
import { usePlanner } from "@/components/PlannerContext";

const KEY = "thaigle_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const { plan } = usePlanner();
  // Was fixed at the exact same bottom-16/z-50 offset as PlannerBar — the
  // two banners collided pixel-for-pixel whenever a first-time visitor
  // already had plan items. Mirror the offset MobileStickyBar already uses
  // to stack above PlannerBar instead of on top of it.
  const bottomClass = plan.items.length > 0 ? "bottom-[7.5rem]" : "bottom-16";

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {}
  }, []);

  function accept() {
    try { localStorage.setItem(KEY, "1"); } catch {}
    setVisible(false);
  }

  function decline() {
    try { localStorage.setItem(KEY, "0"); } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className={`fixed ${bottomClass} left-0 right-0 z-50 p-3 md:p-4 bg-white border-t border-[var(--border)] shadow-xl md:bottom-4 md:left-4 md:right-auto md:max-w-sm md:rounded-2xl md:border`}>
      <p className="text-xs text-[var(--muted)] mb-3 leading-relaxed">
        เราใช้คุกกี้เพื่อวิเคราะห์การใช้งาน (Vercel Analytics) ไม่มีโฆษณาบุคคลที่สาม
        <br />
        We use analytics cookies only — no third-party ad tracking.{" "}
        <a href="/privacy" className="underline hover:text-black">Privacy Policy</a>
      </p>
      <div className="flex gap-2">
        <button
          onClick={accept}
          className="flex-1 bg-black text-white text-xs font-bold py-2 px-3 rounded-xl hover:bg-gray-800 transition"
        >
          Accept
        </button>
        <button
          onClick={decline}
          className="flex-1 bg-white border border-[var(--border)] text-xs font-bold py-2 px-3 rounded-xl hover:border-black transition"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
