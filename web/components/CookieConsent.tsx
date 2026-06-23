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
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-xl"
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
