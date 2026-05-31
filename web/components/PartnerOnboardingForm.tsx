"use client";
// Clinic-side "Become a partner" lead form. Posts to /api/partner-signup if available,
// otherwise /api/lead with source="partner_inquiry". Captures clinic-side leads for our sales team.

import { useState } from "react";

export default function PartnerOnboardingForm() {
  const [f, setF] = useState({ clinic: "", website: "", contact: "", email: "", phone: "", services: "" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      // Try partner-signup endpoint first
      const r = await fetch("/api/partner-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      if (!r.ok) {
        // Fallback to lead
        await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clinicName: f.clinic, name: f.contact, email: f.email, phone: f.phone,
            service: f.services, notes: `Website: ${f.website}`, _source: "partner_inquiry",
          }),
        });
      }
      setSent(true);
    } catch { /* ignore */ }
    finally { setBusy(false); }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-6 text-center">
        <div className="text-4xl mb-2">✓</div>
        <h3 className="text-xl font-black mb-1">We&apos;ll be in touch within 24h</h3>
        <p className="text-sm text-[var(--muted)]">Our partner team reviews every application. If approved, we&apos;ll send you a 14-day free trial link.</p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border-2 border-emerald-300 bg-white p-5 sm:p-6">
      <div className="mb-4">
        <div className="text-xs font-black uppercase tracking-widest text-emerald-700">For clinic owners</div>
        <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-1">Become a verified partner</h3>
        <p className="text-sm text-[var(--muted)] mt-1">14-day free trial · cancel anytime · no setup fee.</p>
      </div>
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3">
        <input required placeholder="Clinic name *" value={f.clinic} onChange={(e) => setF({ ...f, clinic: e.target.value })}
          className="rounded-lg border-2 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" style={{ borderColor: "var(--border)" }} />
        <input placeholder="Website" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })}
          className="rounded-lg border-2 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" style={{ borderColor: "var(--border)" }} />
        <input required placeholder="Your name *" value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })}
          className="rounded-lg border-2 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" style={{ borderColor: "var(--border)" }} />
        <input required type="email" placeholder="Email *" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })}
          className="rounded-lg border-2 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" style={{ borderColor: "var(--border)" }} />
        <input placeholder="WhatsApp / LINE" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })}
          className="rounded-lg border-2 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" style={{ borderColor: "var(--border)" }} />
        <input placeholder="Main services" value={f.services} onChange={(e) => setF({ ...f, services: e.target.value })}
          className="rounded-lg border-2 px-3 py-2.5 text-sm outline-none focus:border-emerald-500" style={{ borderColor: "var(--border)" }} />
        <button type="submit" disabled={busy}
          className="sm:col-span-2 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-3 text-base font-black hover:opacity-90 disabled:opacity-50">
          {busy ? "Submitting…" : "Apply for trial →"}
        </button>
      </form>
      <p className="text-[11px] text-[var(--muted)] mt-3 text-center">
        Partner approval is verification-based — we check Google rating, license, real reviews. ~70% approval rate.
      </p>
    </section>
  );
}
