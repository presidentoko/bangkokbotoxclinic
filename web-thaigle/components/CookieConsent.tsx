"use client";

import { useEffect, useState } from "react";

const KEY = "thaigle_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

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

  // Mobile has up to 3 other fixed bottom bars (bottom nav, planner bar,
  // per-page sticky booking CTA) whose combined height varies by page and
  // plan state — anchoring here at the top avoids fighting all of them for
  // the same real estate. Desktop has no such stack, so bottom-left is fine.
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-3 md:p-4 bg-white border-b border-[var(--border)] shadow-xl md:top-auto md:bottom-4 md:left-4 md:right-auto md:max-w-sm md:rounded-2xl md:border">
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
