"use client";
import { useState } from "react";

export function EmailSignup({ variant = "inline" }: { variant?: "inline" | "banner" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      // Store in Formspree — simple, no server required
      const res = await fetch("https://formspree.io/f/xblrzkyq", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, source: "snsstopper.com" }),
      });
      if (res.ok) {
        setStatus("done");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (variant === "banner") {
    return (
      <section className="bg-[var(--fg)] text-white py-10 px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-black mb-2">Get notified about big Trust Score changes</h2>
          <p className="text-sm text-gray-300 mb-5">
            New hidden gems and SNS Check updates, sent occasionally. No spam, unsubscribe anytime.
          </p>
          {status === "done" ? (
            <p className="text-green-400 font-semibold">✓ You're on the list.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 text-base focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-5 py-2.5 bg-[var(--accent)] text-white rounded-lg font-bold text-sm hover:opacity-90 disabled:opacity-50 transition whitespace-nowrap"
              >
                {status === "loading" ? "…" : "Subscribe"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="text-red-400 text-xs mt-2">Something went wrong. Try again.</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
      <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">Get updates</div>
      <h3 className="font-bold text-base mb-1">Bangkok restaurant updates</h3>
      <p className="text-sm text-[var(--muted)] mb-4">
        Occasional emails on new hidden gems and Trust Score changes. No spam.
      </p>
      {status === "done" ? (
        <p className="text-green-700 font-semibold text-sm">✓ You're on the list!</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 px-3 py-2 border border-[var(--border)] rounded-lg text-base focus:outline-none focus:border-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-4 py-2 bg-[var(--fg)] text-white rounded-lg font-bold text-sm hover:opacity-80 disabled:opacity-50 transition"
          >
            {status === "loading" ? "…" : "Go"}
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="text-red-600 text-xs mt-2">Something went wrong. Try again.</p>
      )}
    </div>
  );
}
