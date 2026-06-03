"use client";
// Renders the OWNER's static PromptPay QR + "I paid" confirmation flow.
// Static QR = scan, type amount manually. "I paid" notifies via Telegram.

import { useState } from "react";

const QR_SRC = "/promptpay-static.png";
const BENEFICIARY = "MR YUNMIN SHIN · TTB Bank";

export default function PromptPayQR({
  amountTHB,
  partnerName,
  reference,
  clinicId,
}: {
  amountTHB: number;
  partnerName?: string;
  reference?: string;
  clinicId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [payer, setPayer] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  async function submit() {
    if (!payer.trim()) { setErr("Enter your name or clinic name"); return; }
    setSubmitting(true); setErr("");
    try {
      const res = await fetch("/api/partner/payment-claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinic_name: partnerName || payer.trim(),
          clinic_id: clinicId,
          amount_thb: amountTHB,
          reference,
          payer_name: payer.trim(),
          partner_email: email.trim(),
          note: note.trim(),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setDone(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-2xl border-2 border-emerald-300 bg-white p-6 sm:p-8">
      <div className="text-center mb-4">
        <div className="text-xs font-black uppercase tracking-widest text-emerald-700">PromptPay · Thai bank transfer</div>
        <h3 className="text-xl sm:text-2xl font-black mt-1">Transfer ฿{amountTHB.toLocaleString()}</h3>
        {partnerName && <p className="text-sm text-[rgb(var(--muted))] mt-1">For {partnerName}</p>}
        <p className="text-[11px] text-[rgb(var(--muted))] mt-1">Recipient: <strong>{BENEFICIARY}</strong></p>
      </div>

      <div className="grid sm:grid-cols-[auto_1fr] gap-6 items-center">
        <div className="mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={QR_SRC} alt="PromptPay QR for MR YUNMIN SHIN" width={240} height={300}
            className="rounded-xl border-2 border-emerald-200 max-w-full h-auto" />
        </div>
        <ol className="space-y-2 text-sm">
          <li className="flex gap-2"><span className="font-black text-emerald-700">1.</span>Open any Thai bank app (Kbank, SCB, BBL, KTB, TTB…)</li>
          <li className="flex gap-2"><span className="font-black text-emerald-700">2.</span>Tap &quot;Scan QR&quot; or &quot;PromptPay&quot;</li>
          <li className="flex gap-2"><span className="font-black text-emerald-700">3.</span>Scan this code — beneficiary auto-fills as <strong>MR YUNMIN SHIN</strong></li>
          <li className="flex gap-2"><span className="font-black text-emerald-700">4.</span>Type amount: <strong>฿{amountTHB.toLocaleString()}</strong></li>
          <li className="flex gap-2"><span className="font-black text-emerald-700">5.</span>Send screenshot to <a href="https://line.me/R/ti/p/@405zhjqb" target="_blank" rel="noopener noreferrer" className="underline font-bold">our LINE</a> or <a href="mailto:billing@thaifacialclinic.com" className="underline font-bold">billing@thaifacialclinic.com</a></li>
        </ol>
      </div>

      {reference && (
        <div className="mt-4 rounded-lg bg-slate-50 border p-3 text-xs" style={{ borderColor: "rgb(var(--border))" }}>
          <span className="font-bold">Reference (include in transfer note if possible):</span>{" "}
          <span className="font-mono">{reference}</span>
        </div>
      )}

      {/* "I just paid" — pings owner via Telegram so verification can start immediately */}
      {!done ? (
        <button
          onClick={() => setOpen(!open)}
          className="mt-5 w-full rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-3 font-black hover:opacity-90 active:scale-[0.99]">
          {open ? "Hide" : "✓  I just sent the transfer →"}
        </button>
      ) : (
        <div className="mt-5 rounded-xl bg-emerald-50 border-2 border-emerald-300 p-4 text-center">
          <div className="text-2xl mb-1">✅</div>
          <div className="font-black text-emerald-800">Owner notified</div>
          <div className="text-xs text-emerald-700 mt-1">
            We&apos;ll verify in TTB Bank within 4 business hours and email you on activation.
          </div>
        </div>
      )}

      {open && !done && (
        <div className="mt-3 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-4 space-y-3">
          <p className="text-xs leading-relaxed">
            We&apos;ll get an instant Telegram ping with your details so we can verify the deposit in TTB Bank app and activate your dashboard.
          </p>
          <input
            value={payer}
            onChange={(e) => { setPayer(e.target.value); setErr(""); }}
            placeholder="Your name or clinic name *"
            className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "rgb(var(--border))" }}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email for activation (optional)"
            className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "rgb(var(--border))" }}
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Bank reference number or extra note (optional)"
            rows={2}
            className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "rgb(var(--border))" }}
          />
          {err && <p className="text-xs text-red-600 font-bold">{err}</p>}
          <button
            onClick={submit}
            disabled={submitting}
            className="w-full rounded-lg bg-emerald-700 text-white py-2.5 font-bold text-sm hover:bg-emerald-800 disabled:opacity-50">
            {submitting ? "Sending…" : `Notify owner — ฿${amountTHB.toLocaleString()}`}
          </button>
        </div>
      )}

      <p className="text-[11px] text-[rgb(var(--muted))] mt-4 text-center leading-relaxed">
        We confirm payments within 4 business hours. Your dashboard activates immediately on confirmation.
        Direct bank-to-bank — no card data stored anywhere.
      </p>
    </section>
  );
}
