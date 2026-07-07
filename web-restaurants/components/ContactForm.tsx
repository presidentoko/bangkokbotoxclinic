"use client";
import { useState } from "react";
import { useLocale } from "@/hooks/useLocale";
import { strings, tr } from "@/lib/strings";

export function ContactForm() {
  const locale = useLocale();
  const s = strings.contact;

  const PURPOSES = [
    { value: "ad",         label: tr(s.adLabel, locale) },
    { value: "correction", label: tr(s.correctionLabel, locale) },
    { value: "press",      label: tr(s.pressLabel, locale) },
    { value: "other",      label: tr(s.otherLabel, locale) },
  ];

  const [name, setName]       = useState("");
  const [purpose, setPurpose] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus]   = useState<"idle" | "sending" | "sent" | "error">("idle");

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
        <p className="font-bold text-[var(--fg)] text-lg">{tr(s.successTitle, locale)}</p>
        <p className="text-sm text-[var(--muted)] mt-2">{tr(s.successMsg, locale)}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-[var(--fg)] mb-2">
          {tr(s.purposeLabel, locale)} <span className="text-[var(--accent)]">*</span>
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

      <div>
        <label className="block text-sm font-semibold text-[var(--fg)] mb-1.5">
          {tr(s.nameLabel, locale)}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={tr(s.namePlaceholder, locale)}
          className="w-full border border-[var(--border)] rounded-xl px-4 py-2.5 text-base bg-white focus:outline-none focus:border-[var(--accent)]"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[var(--fg)] mb-1.5">
          {tr(s.contactLabel, locale)} <span className="text-[var(--accent)]">*</span>
          <span className="text-[var(--muted)] font-normal ml-1">{tr(s.contactHint, locale)}</span>
        </label>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder={tr(s.contactPlaceholder, locale)}
          required
          className="w-full border border-[var(--border)] rounded-xl px-4 py-2.5 text-base bg-white focus:outline-none focus:border-[var(--accent)]"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[var(--fg)] mb-1.5">
          {tr(s.messageLabel, locale)} <span className="text-[var(--accent)]">*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          placeholder={tr(s.messagePlaceholder, locale)}
          className="w-full border border-[var(--border)] rounded-xl px-4 py-2.5 text-base bg-white focus:outline-none focus:border-[var(--accent)] resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-500">{tr(s.errorMsg, locale)}</p>
      )}

      <button
        type="submit"
        disabled={!purpose || !contact.trim() || !message.trim() || status === "sending"}
        className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-bold text-sm disabled:opacity-40 transition hover:opacity-90"
      >
        {status === "sending" ? tr(s.sending, locale) : tr(s.submit, locale)}
      </button>

      <p className="text-xs text-[var(--muted)] text-center">{tr(s.hint, locale)}</p>
    </form>
  );
}
