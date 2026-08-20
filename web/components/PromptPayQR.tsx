"use client";
// Renders OWNER's static PromptPay QR + "I just paid" flow → Telegram notify.
// Static QR = scan, type amount manually. Bank-level safety: no API integration needed.

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
  const [qrFailed, setQrFailed] = useState(false);
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
        {partnerName && <p className="text-sm text-[var(--muted)] mt-1">For {partnerName}</p>}
        <p className="text-[11px] text-[var(--muted)] mt-1">Recipient: <strong>{BENEFICIARY}</strong></p>
      </div>

      <div className="grid sm:grid-cols-[auto_1fr] gap-6 items-center">
        <div className="mx-auto">
          {/* 2026-08-20: public/promptpay-static.png 이 존재하지 않아 라이브에서
              404 였다 — 결제 안내의 핵심인 QR 자리에 깨진 이미지가 떠서 결제
              경로가 사실상 죽어 있었다. 이미지가 없을 때 깨진 아이콘 대신
              "송금처 이름을 직접 입력" 안내로 대체한다(PromptPay 는 수취인명
              검색으로도 송금 가능). QR 파일을 넣으면 자동으로 다시 노출된다. */}
          {!qrFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={QR_SRC} alt="PromptPay QR for MR YUNMIN SHIN" width={240} height={300}
              onError={() => setQrFailed(true)}
              className="rounded-xl border-2 border-emerald-200 max-w-full h-auto" />
          ) : (
            <div
              className="rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50 p-5 text-center"
              style={{ width: 240 }}
            >
              <div className="text-3xl mb-2">🏦</div>
              <div className="text-sm font-black text-emerald-900">Transfer by recipient name</div>
              <p className="mt-2 text-xs text-emerald-900/80 leading-relaxed">
                In your bank app choose <strong>PromptPay → Transfer</strong> and enter the
                recipient below, then continue from step 4.
              </p>
              <p className="mt-2 text-xs font-bold text-emerald-900">{BENEFICIARY}</p>
              <p className="mt-3 text-[11px] text-emerald-900/70">
                Need the QR? Message us and we&apos;ll send it directly.
              </p>
            </div>
          )}
        </div>
        <ol className="space-y-2 text-sm">
          <li className="flex gap-2"><span className="font-black text-emerald-700">1.</span>Open any Thai bank app (Kbank, SCB, BBL, KTB, TTB…)</li>
          <li className="flex gap-2"><span className="font-black text-emerald-700">2.</span>Tap &quot;Scan QR&quot; or &quot;PromptPay&quot;</li>
          <li className="flex gap-2"><span className="font-black text-emerald-700">3.</span>Scan this code — beneficiary auto-fills as <strong>MR YUNMIN SHIN</strong></li>
          <li className="flex gap-2"><span className="font-black text-emerald-700">4.</span>Type amount: <strong>฿{amountTHB.toLocaleString()}</strong></li>
          <li className="flex gap-2"><span className="font-black text-emerald-700">5.</span>Tap &quot;I just sent the transfer&quot; below — we get instant ping</li>
        </ol>
      </div>

      {reference && (
        <div className="mt-4 rounded-lg bg-slate-50 border p-3 text-xs" style={{ borderColor: "var(--border)" }}>
          <span className="font-bold">Reference (include in transfer note if possible):</span>{" "}
          <span className="font-mono">{reference}</span>
        </div>
      )}

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
            className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)" }}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email for activation (optional)"
            className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)" }}
          />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Bank reference number or extra note (optional)"
            rows={2}
            className="w-full rounded-lg border px-3 py-2 text-sm" style={{ borderColor: "var(--border)" }}
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

      <p className="text-[11px] text-[var(--muted)] mt-4 text-center leading-relaxed">
        We confirm payments within 4 business hours. Your dashboard activates immediately on confirmation.
        Direct bank-to-bank — no card data stored anywhere.
      </p>
    </section>
  );
}
