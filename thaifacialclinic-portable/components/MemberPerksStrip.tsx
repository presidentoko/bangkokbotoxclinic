"use client";
// Signup loyalty strip. 3 perks side-by-side with a single email field that submits to /api/subscribe.

import { useState } from "react";

const PERKS = [
  { emoji: "📕", title: "Free PDF buyer's guide", body: "8-page deep guide. Email-gated." },
  { emoji: "📱", title: "Concierge SMS",          body: "Optional Bangkok arrival/help SMS thread." },
  { emoji: "🔔", title: "Price-drop alerts",       body: "We email when a clinic you saved drops price." },
];

export default function MemberPerksStrip() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !email) return;
    setBusy(true);
    try {
      await fetch("/api/subscribe/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "member_perks" }),
      });
      setSent(true);
    } catch { /* ignore */ }
    finally { setBusy(false); }
  }

  return (
    <section className="rounded-2xl border-2 border-violet-300 bg-gradient-to-br from-violet-50 to-purple-50 p-5 sm:p-7">
      <div className="text-center mb-5">
        <div className="text-xs font-black uppercase tracking-widest text-violet-700">Free membership</div>
        <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-1">Get 3 things — pay zero</h3>
      </div>
      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        {PERKS.map((p, i) => (
          <div key={i} className="rounded-xl bg-white border border-violet-200 p-3 text-center">
            <div className="text-3xl mb-1">{p.emoji}</div>
            <div className="font-black text-sm">{p.title}</div>
            <p className="text-[11px] text-[rgb(var(--muted))] mt-1">{p.body}</p>
          </div>
        ))}
      </div>
      {sent ? (
        <div className="rounded-xl bg-emerald-50 border-2 border-emerald-300 p-4 text-center">
          <p className="font-black text-emerald-800">✓ You&apos;re in — check your inbox for the PDF</p>
        </div>
      ) : (
        <form onSubmit={submit} className="flex gap-2 max-w-md mx-auto">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 rounded-xl border-2 border-violet-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-violet-500" />
          <button type="submit" disabled={busy}
            className="rounded-xl bg-violet-700 text-white px-5 py-2.5 text-sm font-black hover:bg-violet-800 disabled:opacity-50">
            {busy ? "…" : "Join free"}
          </button>
        </form>
      )}
    </section>
  );
}
