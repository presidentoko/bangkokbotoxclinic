"use client";

import { useState } from "react";
import type { Lang } from "@/lib/site";
import { tFor } from "@/lib/i18n";

type Status = "idle" | "sending" | "success" | "error";

export function AdvertiseForm({ lang }: { lang: Lang }) {
  const t = tFor(lang);
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "advertise",
          name: data.get("name"),
          contact: data.get("contact"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <p className="rounded-xl border border-border bg-bg-elev p-5 text-sm">{t.advertise.success}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Honeypot: real visitors never see this field; a bot that fills
          every input on the page fills it too, and the API route silently
          drops submissions where it's non-empty. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px] w-px h-px opacity-0"
        aria-hidden="true"
      />
      <div>
        <label htmlFor="advertise-name" className="block text-sm font-semibold mb-1.5">
          {t.advertise.nameLabel}
        </label>
        <input
          id="advertise-name"
          name="name"
          type="text"
          required
          maxLength={200}
          className="w-full min-h-11 rounded-xl border border-border bg-bg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>
      <div>
        <label htmlFor="advertise-contact" className="block text-sm font-semibold mb-1.5">
          {t.advertise.contactLabel}
        </label>
        <input
          id="advertise-contact"
          name="contact"
          type="text"
          required
          maxLength={200}
          placeholder={t.advertise.contactPlaceholder}
          className="w-full min-h-11 rounded-xl border border-border bg-bg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>
      <div>
        <label htmlFor="advertise-message" className="block text-sm font-semibold mb-1.5">
          {t.advertise.messageLabel}
        </label>
        <textarea
          id="advertise-message"
          name="message"
          required
          rows={5}
          maxLength={2000}
          placeholder={t.advertise.messagePlaceholder}
          className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>
      {status === "error" && <p className="text-sm text-red-500">{t.advertise.error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center gap-2 rounded-full bg-accent-warm text-ink font-semibold px-6 py-3 min-h-11 shadow-md shadow-accent-warm/20 hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-60 disabled:pointer-events-none"
      >
        {status === "sending" ? t.advertise.sending : t.advertise.submit}
      </button>
    </form>
  );
}
