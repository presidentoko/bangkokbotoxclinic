"use client";

import { useEffect, useState } from "react";
import { ADS_ENABLED } from "@/lib/ads";

const KEY = "thaigle_cookie_consent";

type Decision = "granted" | "denied";

function gtagConsent(decision: Decision) {
  const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof g !== "function") return;
  g("consent", "update", {
    ad_storage: decision,
    ad_user_data: decision,
    ad_personalization: decision,
    analytics_storage: decision,
  });
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {
      // Storage blocked (private mode, embedded webview). Treat as a first
      // visit: showing the banner again is harmless, silently assuming
      // consent is not.
    }

    if (stored === null) {
      setVisible(true);
      return;
    }

    // Re-apply the stored decision on every load.
    //
    // ConsentMode sets the defaults inline on each fresh document, and in the
    // EEA those defaults are `denied`. A returning visitor who accepted last
    // month starts every new page load denied again, so without this line
    // their consent silently expires on navigation — and the site under-counts
    // exactly the audience it already has permission to measure. Consent Mode
    // is designed around this: the default is what holds until an update
    // arrives, and replaying the stored answer is the update.
    gtagConsent(stored === "1" ? "granted" : "denied");
  }, []);

  function decide(decision: Decision) {
    try {
      localStorage.setItem(KEY, decision === "granted" ? "1" : "0");
    } catch {}
    gtagConsent(decision);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      className="fixed top-0 left-0 right-0 z-50 p-3 md:p-4 bg-white border-b border-[var(--border)] shadow-xl md:top-auto md:bottom-4 md:left-4 md:right-auto md:max-w-sm md:rounded-2xl md:border"
    >
      <p className="text-xs text-[var(--muted)] mb-3 leading-relaxed">
        {/* The previous copy promised "analytics cookies only — no
            third-party ad tracking", which stops being true the moment
            AdSense is switched on. A consent notice that misdescribes what it
            is asking consent for is both an AdSense policy problem and a
            GDPR one, so the wording follows ADS_ENABLED rather than being
            written once and forgotten. */}
        {ADS_ENABLED ? (
          <>
            We use cookies for analytics and to show ads. Our advertising
            partners, including Google, may use cookies to personalise the ads
            you see.{" "}
          </>
        ) : (
          <>We use analytics cookies to understand how the site is used. </>
        )}
        <a href="/privacy" className="underline hover:text-black">
          Privacy&nbsp;Policy
        </a>
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => decide("granted")}
          className="flex-1 bg-black text-white text-xs font-bold py-2.5 px-3 rounded-xl hover:bg-gray-800 transition"
        >
          Accept
        </button>
        <button
          onClick={() => decide("denied")}
          className="flex-1 bg-white border border-[var(--border)] text-xs font-bold py-2.5 px-3 rounded-xl hover:border-black transition"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
