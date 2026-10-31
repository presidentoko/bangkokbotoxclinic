"use client";

import { useState } from "react";
import { CONTACT_METHODS, PROCEDURES, lineShareLink } from "@/lib/auctionText";
import type { ContactMethod, Procedure } from "@/lib/auctionStore";

export const MY_QUOTE_KEY = "myQuote";

const input = "w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-black";

export default function QuoteForm() {
  const [procedure, setProcedure] = useState<Procedure>("botox");
  const [method, setMethod] = useState<ContactMethod>("whatsapp");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          procedure,
          details: f.get("details"),
          area: f.get("area"),
          when: f.get("when"),
          name: f.get("name"),
          contact_method: method,
          contact: f.get("contact"),
          notes: f.get("notes"),
          _hp: f.get("_hp"),
        }),
      });
      if (res.status === 429) throw new Error("You've sent several requests already. Please try again in an hour.");
      if (!res.ok) {
        const t = await res.text();
        throw new Error(
          t === "contact" ? "Check your contact details — we need a way to reach you."
          : t === "details" ? "Tell us a little about what you want done."
          : "Something went wrong. Please try again.",
        );
      }
      const j = (await res.json()) as { url?: string; secret?: string };
      if (!j.url) throw new Error("Something went wrong. Please try again.");
      try { localStorage.setItem(MY_QUOTE_KEY, JSON.stringify({ secret: j.secret, at: Date.now() })); } catch {}
      setUrl(j.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (url) {
    const msg = `My clinic quotes: ${url}`;
    return (
      <div className="border-2 border-green-300 bg-green-50 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-2">Request sent</h2>
        <p className="text-sm leading-relaxed mb-4">
          We&apos;re asking Bangkok clinics for their prices now. Quotes appear on your private page as they come in,
          usually within 48 hours. <strong>Save this link</strong> — it&apos;s the only way to see your quotes.
        </p>
        <div className="bg-white border border-[var(--border)] rounded-lg p-3 text-sm break-all mb-3">{url}</div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => { navigator.clipboard.writeText(url).then(() => setCopied(true)).catch(() => {}); }}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium"
          >
            {copied ? "Copied" : "Copy link"}
          </button>
          <a href={`https://wa.me/?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg border border-[var(--border)] bg-white text-sm font-medium">
            Send to myself on WhatsApp
          </a>
          <a href={lineShareLink(msg)} target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg border border-[var(--border)] bg-white text-sm font-medium">
            Send to myself on LINE
          </a>
          <a href={url} className="px-4 py-2 rounded-lg border border-[var(--border)] bg-white text-sm font-medium">
            Open my quotes page
          </a>
        </div>
      </div>
    );
  }

  const hint = PROCEDURES.find((p) => p.value === procedure)?.hint ?? "";
  const placeholder = CONTACT_METHODS.find((m) => m.value === method)?.placeholder ?? "";

  return (
    <form onSubmit={submit} className="bg-white border border-[var(--border)] rounded-xl p-5 space-y-5">
      <fieldset>
        <legend className="text-sm font-semibold mb-2">Treatment</legend>
        <div className="flex flex-wrap gap-2">
          {PROCEDURES.map((p) => (
            <button key={p.value} type="button" onClick={() => setProcedure(p.value)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium ${procedure === p.value ? "bg-black text-white border-black" : "border-[var(--border)] hover:bg-gray-50"}`}>
              {p.en}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="text-sm font-semibold">What do you want done?</span>
        <textarea name="details" required minLength={2} maxLength={500} rows={3} placeholder={hint} className={`${input} mt-1`} />
      </label>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-semibold">Preferred area <span className="font-normal text-[var(--muted)]">(optional)</span></span>
          <input name="area" maxLength={100} placeholder="Sukhumvit, Siam, Silom…" className={`${input} mt-1`} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">When <span className="font-normal text-[var(--muted)]">(optional)</span></span>
          <input name="when" maxLength={100} placeholder="e.g. 10–14 Nov" className={`${input} mt-1`} />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-semibold">Your name <span className="font-normal text-[var(--muted)]">(optional)</span></span>
        <input name="name" maxLength={100} className={`${input} mt-1`} />
      </label>

      <fieldset>
        <legend className="text-sm font-semibold mb-2">How should we reach you?</legend>
        <div className="flex flex-wrap gap-2 mb-2">
          {CONTACT_METHODS.map((m) => (
            <button key={m.value} type="button" onClick={() => setMethod(m.value)}
              className={`px-3 py-1.5 rounded-lg border text-sm ${method === m.value ? "bg-black text-white border-black" : "border-[var(--border)] hover:bg-gray-50"}`}>
              {m.label}
            </button>
          ))}
        </div>
        <input name="contact" required minLength={3} maxLength={120} placeholder={placeholder}
          type={method === "email" ? "email" : "text"} className={input} />
        <p className="text-xs text-[var(--muted)] mt-1">Clinics don&apos;t see this. We only use it to connect you with the clinic you pick.</p>
      </fieldset>

      <label className="block">
        <span className="text-sm font-semibold">Anything else? <span className="font-normal text-[var(--muted)]">(optional)</span></span>
        <textarea name="notes" maxLength={1000} rows={2} placeholder="Brand preference, budget, first time or not…" className={`${input} mt-1`} />
      </label>

      <input name="_hp" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={busy} className="w-full py-3 rounded-lg bg-black text-white font-semibold disabled:opacity-50">
        {busy ? "Sending…" : "Get quotes from clinics"}
      </button>
    </form>
  );
}
