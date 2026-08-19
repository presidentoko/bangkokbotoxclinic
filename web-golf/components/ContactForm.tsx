"use client";
import { useState } from "react";

const REASONS = [
  { value: "partnership", label: "Golf club partnership" },
  { value: "correction", label: "Data correction" },
  { value: "claim", label: "Claim listing" },
  { value: "press", label: "Press / media" },
  { value: "general", label: "General" },
];

export function ContactForm({
  defaultReason = "general",
  context,
}: {
  defaultReason?: string;
  context?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      reason: String(data.get("reason") ?? "general"),
      message: String(data.get("message") ?? ""),
      context: context ?? "",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Failed to send");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to send");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
        <div className="text-2xl mb-2">✅</div>
        <div className="font-bold text-emerald-900 mb-1">Message sent</div>
        <p className="text-sm text-emerald-800">
          We typically respond within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-1.5">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-1.5">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="reason" className="block text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-1.5">
          Reason
        </label>
        <select
          id="reason"
          name="reason"
          defaultValue={defaultReason}
          className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
        >
          {REASONS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-1.5">
          Message <span className="text-red-600">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={context ? `Regarding: ${context}` : "Include the relevant course name or page URL when applicable."}
          className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-700">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center gap-2 bg-black text-white py-3 px-6 rounded-lg font-bold hover:bg-gray-800 text-sm disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
