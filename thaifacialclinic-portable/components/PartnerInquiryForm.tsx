"use client";

import { useState } from "react";

export default function PartnerInquiryForm() {
  const [clinic, setClinic] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<"cpl" | "featured" | "intelligence" | "not_sure">("not_sure");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicName: clinic,
          name: contact,
          email,
          phone: "",
          procedure: `B2B · ${plan}`,
          notes: `City: ${city}\nWebsite: ${website}\nMessage: ${message}`,
          context: `b2b-partnership · plan=${plan}`,
          _hp: hp,
        }),
      });
      if (!r.ok) throw new Error(String(r.status));
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "error");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-[2rem] border-2 bg-mint-50 p-10 text-center dark:bg-mint-950/30" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="inline-grid h-16 w-16 place-items-center rounded-full bg-mint-100 text-mint-700">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-mint-800 dark:text-mint-200">Got it. We'll be in touch within 24 hours.</h3>
        <p className="mt-2 text-sm muted max-w-md mx-auto">
          Watch your email for your private dashboard link with your clinic's free intelligence report.
        </p>
      </div>
    );
  }

  const inputCls = "rounded-xl border bg-[rgb(var(--bg-elev))] px-4 py-3 text-sm font-medium placeholder:text-[rgb(var(--muted))] focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-700/20 dark:focus:border-gold-400 dark:focus:ring-gold-400/20";

  return (
    <form onSubmit={onSubmit} className="rounded-[2rem] border-2 bg-[rgb(var(--bg-elev))] p-6 shadow-premium grid gap-3 sm:grid-cols-2 sm:p-8" style={{ borderColor: "rgb(var(--border))" }}>
      <input required value={clinic} onChange={(e) => setClinic(e.target.value)} placeholder="Clinic name *"
        className={`sm:col-span-2 ${inputCls}`} style={{ borderColor: "rgb(var(--border))" }} />
      <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City (Bangkok, Phuket, ...)"
        className={inputCls} style={{ borderColor: "rgb(var(--border))" }} />
      <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website (optional)"
        className={inputCls} style={{ borderColor: "rgb(var(--border))" }} />
      <input required value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Your name *"
        className={inputCls} style={{ borderColor: "rgb(var(--border))" }} />
      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email *"
        className={inputCls} style={{ borderColor: "rgb(var(--border))" }} />
      <select value={plan} onChange={(e) => setPlan(e.target.value as typeof plan)}
        className={`sm:col-span-2 ${inputCls}`} style={{ borderColor: "rgb(var(--border))" }}>
        <option value="not_sure">Plan: not sure yet — send me a free report first</option>
        <option value="cpl">Plan: CPL (฿100/lead, pay per consultation)</option>
        <option value="featured">Plan: Featured slot (฿5,000–฿15,000/mo)</option>
        <option value="intelligence">Plan: Intelligence subscription (฿8,000/mo)</option>
      </select>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Anything else? (optional)"
        className={`sm:col-span-2 resize-none ${inputCls}`} style={{ borderColor: "rgb(var(--border))" }} />
      <input type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} className="hidden" aria-hidden="true" />
      <button type="submit" disabled={busy} className="sm:col-span-2 btn-gold !py-3.5 !text-base disabled:opacity-50">
        {busy ? "Sending…" : (
          <>
            Send inquiry
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </>
        )}
      </button>
      {error && <p className="sm:col-span-2 text-center text-xs text-red-600">Error: {error}. Try again or email us directly.</p>}
      <p className="sm:col-span-2 text-[10px] muted text-center">
        No spam. We respond within 24h with your free intelligence report + onboarding details.
      </p>
    </form>
  );
}
