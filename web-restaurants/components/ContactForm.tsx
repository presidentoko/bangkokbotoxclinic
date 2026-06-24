"use client";
import { useState } from "react";

const PURPOSES = [
  { value: "ad", label: "📢 Ad / Sponsorship" },
  { value: "correction", label: "✏️ Data Correction" },
  { value: "press", label: "📰 Media / Press" },
  { value: "other", label: "❓ Other" },
];

export function ContactForm() {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || !purpose) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, purpose, contact, message }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-[var(--accent-light)] border border-[var(--accent)] rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <p className="font-bold text-[var(--fg)] text-lg">Message sent!</p>
        <p className="text-sm text-[var(--muted)] mt-2">
          Leave your contact info and we&apos;ll get back to you fast.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* Purpose */}
      <div>
        <label className="block text-sm font-semibold text-[var(--fg)] mb-2">
          Inquiry type <span className="text-[var(--accent)]">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PURPOSES.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPurpose(p.value)}
              className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition ${
                purpose === p.value
                  ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]"
                  : "border-[var(--border)] bg-white text-[var(--fg)] hover:border-[var(--accent)]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-[var(--fg)] mb-1.5">
          Name / Company
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John / Acme Inc."
          className="w-full border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--accent)]"
        />
      </div>

      {/* Contact */}
      <div>
        <label className="block text-sm font-semibold text-[var(--fg)] mb-1.5">
          Your contact <span className="text-[var(--accent)]">*</span>
          <span className="text-[var(--muted)] font-normal ml-1">(email / Telegram / LINE)</span>
        </label>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="your@email.com  or  @telegram_id"
          required
          className="w-full border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--accent)]"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-semibold text-[var(--fg)] mb-1.5">
          Message <span className="text-[var(--accent)]">*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          placeholder="Tell us what you need."
          className="w-full border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--accent)] resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-500">Failed to send. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={!purpose || !contact.trim() || !message.trim() || status === "sending"}
        className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-bold text-sm disabled:opacity-40 transition hover:opacity-90"
      >
        {status === "sending" ? "Sending..." : "Send message →"}
      </button>

      <p className="text-xs text-[var(--muted)] text-center">
        Include your contact so we can reply directly.
      </p>
    </form>
  );
}
