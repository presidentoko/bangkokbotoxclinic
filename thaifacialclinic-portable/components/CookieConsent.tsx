"use client";
// GDPR/CCPA-style cookie consent. Bottom-fixed banner. localStorage persist.
// Categories: necessary (always on) · analytics · ads. Accept-all + reject-all + customize.

import { useEffect, useState } from "react";

const KEY = "cookie_consent_v1";

type Consent = { analytics: boolean; ads: boolean; ts: number };

function load(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function save(c: Consent) {
  localStorage.setItem(KEY, JSON.stringify(c));
  window.dispatchEvent(new CustomEvent("cookie:consent", { detail: c }));
}

export default function CookieConsent() {
  const [shown, setShown] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [opts, setOpts] = useState({ analytics: true, ads: false });

  useEffect(() => {
    const existing = load();
    if (!existing) setShown(true);
  }, []);

  if (!shown) return null;

  function acceptAll() {
    save({ analytics: true, ads: true, ts: Date.now() });
    setShown(false);
  }
  function rejectAll() {
    save({ analytics: false, ads: false, ts: Date.now() });
    setShown(false);
  }
  function saveCustom() {
    save({ ...opts, ts: Date.now() });
    setShown(false);
  }

  return (
    <div className="safe-bottom fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 print:hidden toast-fade-up">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl border-2 border-slate-200 overflow-hidden">
        {!expanded ? (
          <div className="p-4 sm:p-5">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl shrink-0">🍪</span>
              <p className="text-sm leading-relaxed flex-1">
                We use cookies to keep the site working, learn how people use it, and (with your OK) show useful ads.
                {" "}
                <a href="/privacy" className="underline font-bold">Privacy</a>
                {" · "}
                <button onClick={() => setExpanded(true)} className="underline font-bold">Customize</button>
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={acceptAll}
                className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-bold hover:bg-black">
                Accept all
              </button>
              <button onClick={rejectAll}
                className="rounded-lg bg-white border border-slate-300 px-4 py-2 text-sm font-bold hover:bg-slate-50">
                Necessary only
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5">
            <div className="flex items-baseline justify-between mb-3 gap-3">
              <h3 className="font-black text-base">Cookie preferences</h3>
              <button onClick={() => setExpanded(false)} className="text-xs text-[rgb(var(--muted))] hover:underline">← Back</button>
            </div>
            <ul className="space-y-3">
              <li className="rounded-lg border bg-slate-50 p-3" style={{ borderColor: "rgb(var(--border))" }}>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-sm">Necessary</div>
                    <div className="text-xs text-[rgb(var(--muted))]">Required for the site to work (session, security).</div>
                  </div>
                  <span className="text-xs font-bold text-slate-600">Always on</span>
                </div>
              </li>
              <li className="rounded-lg border bg-white p-3" style={{ borderColor: "rgb(var(--border))" }}>
                <label className="flex items-center justify-between gap-2 cursor-pointer">
                  <div>
                    <div className="font-bold text-sm">Analytics</div>
                    <div className="text-xs text-[rgb(var(--muted))]">Anonymized usage stats so we can fix what&apos;s slow or broken.</div>
                  </div>
                  <input type="checkbox" checked={opts.analytics} onChange={(e) => setOpts({ ...opts, analytics: e.target.checked })}
                    className="h-5 w-5 accent-emerald-600" />
                </label>
              </li>
              <li className="rounded-lg border bg-white p-3" style={{ borderColor: "rgb(var(--border))" }}>
                <label className="flex items-center justify-between gap-2 cursor-pointer">
                  <div>
                    <div className="font-bold text-sm">Ads</div>
                    <div className="text-xs text-[rgb(var(--muted))]">Show personalized ads (Google AdSense). Off by default.</div>
                  </div>
                  <input type="checkbox" checked={opts.ads} onChange={(e) => setOpts({ ...opts, ads: e.target.checked })}
                    className="h-5 w-5 accent-emerald-600" />
                </label>
              </li>
            </ul>
            <button onClick={saveCustom}
              className="mt-4 w-full rounded-lg bg-slate-900 text-white px-4 py-2 text-sm font-bold hover:bg-black">
              Save preferences
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
