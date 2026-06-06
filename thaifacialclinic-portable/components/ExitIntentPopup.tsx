"use client";
// Mouse-leave detection on desktop. Shows once per visit. Mobile fallback: never triggers.
// Lead-magnet shaped — "Wait, here's something useful" guide CTA.

import { useEffect, useState } from "react";

const KEY = "exit_intent_shown_v1";

export default function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(KEY)) return;

    let armed = false;
    const armT = setTimeout(() => { armed = true; }, 5000); // arm after 5s on page

    function onLeave(e: MouseEvent) {
      if (!armed) return;
      // Only when cursor exits at the top of viewport
      if (e.clientY <= 0 && !sessionStorage.getItem(KEY)) {
        sessionStorage.setItem(KEY, "1");
        setOpen(true);
      }
    }
    document.addEventListener("mouseleave", onLeave);
    return () => {
      clearTimeout(armT);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/subscribe/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "exit_intent" }),
      });
      setSent(true);
      setTimeout(() => setOpen(false), 1800);
    } catch { /* ignore */ }
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 toast-fade-up" onClick={() => setOpen(false)} />
      <div role="dialog" aria-modal="true"
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92vw] max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden toast-fade-up">
        <div className="px-6 pt-6 pb-3">
          <button onClick={() => setOpen(false)} aria-label="Close"
            className="absolute top-3 right-3 text-[rgb(var(--muted))] hover:text-black -m-1 p-1 text-xl">✕</button>
          <div className="text-5xl mb-2 text-center">⏳</div>
          {sent ? (
            <div className="text-center">
              <h3 className="text-2xl font-black mb-1">Sent — check your inbox</h3>
              <p className="text-sm text-[rgb(var(--muted))]">PDF arrives within 1 minute.</p>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-black text-center mb-2">Don&apos;t book yet — read this first</h3>
              <p className="text-sm text-[rgb(var(--muted))] text-center mb-4 leading-relaxed">
                Our free 8-page buyer&apos;s guide covers verification, brand fraud, and the 5 red flags that mean walk out.
                Save you ฿20K+ in expensive mistakes.
              </p>
              <form onSubmit={submit} className="space-y-3">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500" />
                <button type="submit"
                  className="w-full rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-3 text-sm font-black hover:opacity-90">
                  📕 Send me the PDF →
                </button>
                <button type="button" onClick={() => setOpen(false)}
                  className="w-full text-xs text-[rgb(var(--muted))] hover:underline">
                  No thanks, I&apos;ll wing it
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
