"use client";
// Email-gated PDF lead magnet. Submits to /api/subscribe with source="guide".
// On success shows "check your inbox" message + reveals the download link
// (the link is just to a Google Docs draft or static asset for now).

import { useState } from "react";
import type { SiteFocus } from "@/lib/site";

const FOCUS_GUIDE: Partial<Record<SiteFocus, { title: string; sub: string; bullets: string[]; pdfUrl: string }>> = {
  botox: {
    title: "Bangkok botox — the buyer's guide (2026)",
    sub: "Genuine brand verification, real per-unit pricing, what 'Korean botox' actually means.",
    bullets: ["Allergan vs Dysport vs Korean — when to pick which", "Per-unit pricing 2024–2026 from 14 clinics", "5 red flags that mean walk out"],
    pdfUrl: "/guides/bangkok-botox-buyer-guide.pdf",
  },
  dental: {
    title: "Bangkok dental implants — the smart-patient guide",
    sub: "What lab actually makes your crown, single-vs-two-trip, warranty fine print.",
    bullets: ["Straumann vs Nobel vs Osstem — what your money buys", "Single-trip vs two-trip implants (with cost math)", "Reading clinic warranties (what's covered, what isn't)"],
    pdfUrl: "/guides/bangkok-dental-guide.pdf",
  },
  hair: {
    title: "Thai hair-transplant — the no-nonsense playbook",
    sub: "FUE vs DHI, what donor over-harvesting looks like, real cost ranges.",
    bullets: ["FUE / DHI / FUT — pick by Norwood pattern", "Real graft pricing from 12 clinics (with quote PDFs)", "What 'mega-session' means + why some surgeons push it"],
    pdfUrl: "/guides/thai-hair-transplant-guide.pdf",
  },
  filler: {
    title: "Bangkok filler — the safety guide",
    sub: "Cannula vs needle, vascular occlusion signs, when to leave the clinic.",
    bullets: ["Brand chart: Juvederm / Restylane / Korean HA", "Cannula vs needle — which area, why", "What an occluded artery feels like (10-min recognition)"],
    pdfUrl: "/guides/bangkok-filler-guide.pdf",
  },
};

export default function DownloadableGuide({ focus }: { focus: SiteFocus }) {
  const cfg = FOCUS_GUIDE[focus];
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!cfg) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !email) return;
    setBusy(true);
    try {
      await fetch("/api/subscribe/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "guide:" + focus }),
      });
      setSent(true);
    } catch { /* surface generic */ }
    finally { setBusy(false); }
  }

  return (
    <section className="rounded-2xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-blue-50 p-5 sm:p-7">
      <div className="grid sm:grid-cols-[1fr_auto] gap-5 items-center">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-1">📕 Free guide · no signup paywall</div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-1">{cfg.title}</h3>
          <p className="text-sm text-[var(--muted)] mb-3">{cfg.sub}</p>
          <ul className="text-xs space-y-1 mb-4">
            {cfg.bullets.map((b, i) => (
              <li key={i} className="flex gap-2"><span className="text-indigo-600">→</span><span>{b}</span></li>
            ))}
          </ul>
        </div>
        <div className="sm:w-72">
          {sent ? (
            <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-4 text-center">
              <p className="font-bold text-emerald-800 mb-2">✓ Check your inbox</p>
              <a href={cfg.pdfUrl} download className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 text-white px-3 py-2 text-xs font-bold">
                Or download now ↓
              </a>
            </div>
          ) : (
            <form onSubmit={submit} className="rounded-xl bg-white border-2 p-3" style={{ borderColor: "var(--border)" }}>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full border-b border-slate-200 px-2 py-2 text-base outline-none focus:border-indigo-500" />
              <button type="submit" disabled={busy}
                className="mt-2 w-full rounded-lg bg-indigo-600 text-white px-3 py-2 text-sm font-black hover:bg-indigo-700 disabled:opacity-50">
                {busy ? "…" : "Get the PDF →"}
              </button>
              <p className="text-[10px] text-[var(--muted)] mt-1.5 text-center">No spam. Unsubscribe anytime.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
