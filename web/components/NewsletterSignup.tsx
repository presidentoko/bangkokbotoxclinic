"use client";
// Newsletter signup — focus-aware copy. Drop into footer or wherever you want.
// Honeypot + per-IP rate limit handled server-side in /api/subscribe.

import { useState } from "react";
import type { SiteFocus } from "@/lib/site";
import { useToast } from "@/components/Toast";

type Copy = { title: string; sub: string };

const FOCUS_COPY: Record<SiteFocus, Copy> = {
  all: {
    title: "Bangkok clinic intel — monthly",
    sub: "New verified clinics, Trust Score swings, price trends. No spam, unsubscribe anytime.",
  },
  botox: {
    title: "Bangkok botox briefing — monthly",
    sub: "New verified botox clinics, genuine-brand alerts, price drops, real Korean/foreigner reviews. No spam.",
  },
  filler: {
    title: "Bangkok filler briefing — monthly",
    sub: "New verified filler clinics, HA brand alerts, lip/cheek/jawline trends. No spam, unsubscribe anytime.",
  },
  hifu: {
    title: "Bangkok HIFU briefing — monthly",
    sub: "Ultherapy / Thermage / Ultraformer specialists, machine alerts, session-pricing trends.",
  },
  facial: {
    title: "Bangkok skincare briefing — monthly",
    sub: "HydraFacial, LED, peel and brightening — new clinics, packages, trend data.",
  },
  laser: {
    title: "Bangkok laser briefing — monthly",
    sub: "Pico, CO2, IPL and hair-removal — verified specialists, pricing, brand alerts.",
  },
  dental: {
    title: "Bangkok dental briefing — monthly",
    sub: "Verified implant, veneer, ortho and whitening specialists. Insurance angle, price comparisons.",
  },
  hair: {
    title: "Thai hair-transplant briefing — monthly",
    sub: "Verified hair clinics, FUE/DHI cost trends, real patient stories. No spam, unsubscribe anytime.",
  },
};

export default function NewsletterSignup({
  focus = "all",
  source = "footer",
}: {
  focus?: SiteFocus;
  source?: string;
}) {
  const c = FOCUS_COPY[focus] || FOCUS_COPY.all;
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const toast = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const r = await fetch("/api/subscribe/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, _hp: hp }),
      });
      if (r.ok) {
        setSent(true);
        toast.push("success", "Subscribed");
      } else {
        const j = await r.json().catch(() => ({}));
        toast.push("error", (j as { error?: string }).error || "Subscribe failed");
      }
    } catch {
      toast.push("error", "Network error");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50 px-5 py-4 text-center">
        <p className="font-bold text-emerald-800">✓ Subscribed — check your inbox.</p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border-2 bg-white p-5 sm:p-6" style={{ borderColor: "var(--border)" }}>
      <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto]">
        <div>
          <div className="font-bold text-lg sm:text-xl">{c.title}</div>
          <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{c.sub}</p>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="rounded-xl border px-4 py-2.5 text-sm font-medium sm:w-64 bg-white"
            style={{ borderColor: "var(--border)" }}
          />
          <input type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} className="hidden" aria-hidden />
          <button type="submit" disabled={busy}
            className="rounded-xl px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            style={{ background: "var(--accent)" }}>
            {busy ? "…" : "Subscribe →"}
          </button>
        </form>
      </div>
    </section>
  );
}
