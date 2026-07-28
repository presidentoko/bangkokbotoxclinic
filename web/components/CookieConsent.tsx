"use client";

import { useState, useEffect } from "react";

const COOKIE_KEY = "cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(COOKIE_KEY)) setVisible(true);
    } catch {
      // localStorage unavailable — don't show
    }
  }, []);

  function accept() {
    try { localStorage.setItem(COOKIE_KEY, "accepted"); } catch {}
    setVisible(false);
  }

  function decline() {
    try { localStorage.setItem(COOKIE_KEY, "declined"); } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      // bottom-16: 모바일에서 MobileBottomNav(~54-64px)/FloatingContactBar(~64px)를
      // 완전히 덮어버리는 문제 수정 — 그 위에 띄운다 (2026-07-28 감사에서 발견).
      // 64px 자체가 노치 세이프에어리어보다 넉넉해서 별도 safe-area 패딩은 불필요.
      className="fixed bottom-16 sm:bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-xl"
    >
      <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-xs text-gray-600 flex-1 leading-relaxed">
          We use essential cookies for site function and Vercel Analytics for aggregate traffic counts (no
          personal data, no ad trackers).{" "}
          <a href="/privacy" className="underline hover:text-black">Privacy Policy</a>
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Decline optional
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 rounded-lg bg-black text-white text-xs font-bold hover:bg-gray-800 transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
