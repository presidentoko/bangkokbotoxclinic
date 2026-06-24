"use client";

import { useState } from "react";

interface Props {
  category?: string;   // e.g. "Auto Parts"
  city?: string;       // e.g. "Chon Buri"
  compact?: boolean;   // inline single-row vs. card
}

type Status = "idle" | "submitting" | "done" | "error";

export function SupplierAlertSignup({ category, city, compact = false }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");

  const context = [category, city].filter(Boolean).join(" · ") || "Thailand";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");

    const fd = new FormData();
    fd.set("name", "Alert subscriber");
    fd.set("email", email);
    fd.set("message", `🔔 New supplier alert signup\nCategory: ${category || "any"}\nCity: ${city || "any"}`);

    try {
      const res = await fetch("/api/inquiry", { method: "POST", body: fd });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className={`${compact ? "py-2" : "p-5 rounded-2xl border border-emerald-200 bg-emerald-50"} flex items-center gap-2 text-sm text-emerald-800 font-bold`}>
        <span>✓</span>
        <span>You&apos;ll be notified when new {context} suppliers are added.</span>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={submit} className="flex gap-2 items-center flex-wrap">
        <span className="text-xs font-semibold text-stone-600 shrink-0">
          🔔 Alert me for new {context} suppliers:
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 min-w-[160px] px-3 py-1.5 rounded-lg border border-stone-300 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 disabled:opacity-50 transition shrink-0"
        >
          {status === "submitting" ? "…" : "Notify me"}
        </button>
        {status === "error" && <span className="text-xs text-red-700">Error — try again</span>}
      </form>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5">
      <div className="flex items-start gap-3">
        <div className="text-2xl">🔔</div>
        <div className="flex-1">
          <h3 className="font-bold text-base mb-1">
            Get alerts for new {context} suppliers
          </h3>
          <p className="text-sm text-stone-600 mb-3">
            We add new verified suppliers every week. Be the first to know when relevant ones are added.
          </p>
          <form onSubmit={submit} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-3 py-2 rounded-lg border border-stone-300 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-sm font-bold hover:bg-emerald-800 disabled:opacity-50 transition whitespace-nowrap"
            >
              {status === "submitting" ? "…" : "Notify me"}
            </button>
          </form>
          {status === "error" && <p className="text-xs text-red-700 mt-2">Something went wrong — try again.</p>}
          <p className="text-[10px] text-stone-500 mt-2">No spam. One email per batch of new suppliers.</p>
        </div>
      </div>
    </div>
  );
}
