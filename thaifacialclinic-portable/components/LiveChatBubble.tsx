"use client";
// Intercom/Crisp-style floating chat bubble. No backend chat — falls back to LINE / email.
// Quick-reply chips lead to concrete actions (Get matched / Cost / Visa) — short funnel.

import { useEffect, useRef, useState } from "react";

type Msg = { role: "bot" | "user"; text: string; t: number };

const LINE_URL = "https://line.me/R/ti/p/@405zhjqb";
const EMAIL = "hello@bkkclinics.com";

const QUICK_REPLIES = [
  { v: "match",    label: "Get matched with a clinic" },
  { v: "cost",     label: "How much will it cost?" },
  { v: "visa",     label: "Visa / travel help?" },
  { v: "english",  label: "English-speaking clinics?" },
  { v: "korean",   label: "Korean-speaking clinics?" },
];

const BOT_REPLIES: Record<string, string> = {
  match:    "Tap 'Find your clinic' (right bottom) for our 30-second concern quiz — we'll match you to 3 verified clinics that fit your goals + budget.",
  cost:     "Use the cost calculator on the homepage (or any clinic page) — real ranges from Bangkok market data. Final quotes come from clinics after a free consult.",
  visa:     "Most patients enter on a 30-day tourist visa. We can recommend hotels near your shortlisted clinics. Ask us via LINE for a custom plan.",
  english:  "Click 'English-friendly' in the Curated section on the homepage — we list every clinic with verified English staff (from review analysis).",
  korean:   "Korean-speaking clinics: same Curated section, 'Korean-friendly' card. Filtered from real review language signals — not just clinic claims.",
};

export default function LiveChatBubble() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // After 20s show notification pulse if user hasn't interacted
    const t = setTimeout(() => setShowPulse(true), 20_000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    if (msgs.length === 0) {
      // Initial greeting after open
      setTimeout(() => {
        setMsgs([{ role: "bot", text: "Hi 👋 I'm the BKK Clinics concierge. What would help most right now?", t: Date.now() }]);
      }, 300);
    }
  }, [open, msgs.length]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs]);

  function send(text: string, key?: string) {
    setMsgs((m) => [...m, { role: "user", text, t: Date.now() }]);
    setShowPulse(false);
    setTimeout(() => {
      const reply = key && BOT_REPLIES[key]
        ? BOT_REPLIES[key]
        : `Thanks! For complex questions, please message us on LINE @405zhjqb or email ${EMAIL} — a real human will reply within an hour during Bangkok working hours.`;
      setMsgs((m) => [...m, { role: "bot", text: reply, t: Date.now() }]);
    }, 700);
  }

  if (!mounted) return null;

  return (
    <>
      {!open && (
        <button
          onClick={() => { setOpen(true); setShowPulse(false); }}
          className="fixed bottom-6 right-24 sm:right-28 z-30 grid place-items-center h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-white text-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition print:hidden"
          aria-label="Open chat"
        >
          💬
          {showPulse && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
          )}
        </button>
      )}

      {open && (
        <>
          <div className="hidden sm:block fixed inset-0 z-30" onClick={() => setOpen(false)} aria-hidden />
          <div role="dialog" aria-modal="false"
            className="fixed bottom-6 right-4 sm:right-6 z-40 w-[92vw] max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden border-2 border-emerald-200 toast-fade-up print:hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white px-4 py-3 flex items-center gap-3">
              <span className="grid place-items-center h-10 w-10 rounded-full bg-white/20 text-xl">🌴</span>
              <div className="flex-1 min-w-0">
                <div className="font-black text-sm">BKK Clinics concierge</div>
                <div className="text-[10px] opacity-90 flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse" />
                  Usually replies in &lt; 1 hour
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-white/80 hover:text-white text-xl -m-2 p-2">✕</button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="max-h-[55vh] overflow-y-auto p-3 space-y-2.5 bg-slate-50">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user" ? "bg-emerald-600 text-white rounded-br-sm" : "bg-white border border-[rgb(var(--border))] rounded-bl-sm shadow-sm"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick replies */}
            {msgs.length > 0 && msgs[msgs.length - 1].role === "bot" && (
              <div className="border-t bg-white px-3 py-2 flex flex-wrap gap-1.5" style={{ borderColor: "rgb(var(--border))" }}>
                {QUICK_REPLIES.map((q) => (
                  <button key={q.v} onClick={() => send(q.label, q.v)}
                    className="text-xs font-bold border border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full transition">
                    {q.label}
                  </button>
                ))}
              </div>
            )}

            {/* Fallback actions */}
            <div className="border-t bg-white px-3 py-2.5 flex items-center gap-2" style={{ borderColor: "rgb(var(--border))" }}>
              <a href={LINE_URL} target="_blank" rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#06c755] text-white text-xs font-bold px-3 py-2 hover:opacity-90">
                💬 LINE
              </a>
              <a href={`mailto:${EMAIL}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-white border border-[rgb(var(--border))] text-xs font-bold px-3 py-2 hover:bg-slate-50">
                📧 Email
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
