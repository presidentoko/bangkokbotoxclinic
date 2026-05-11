"use client";
// 다단계 예약/문의 폼 — service → date → contact → confirm.

import { useState } from "react";

const SERVICES = [
  { id: "botox", label: "Botox", emoji: "💉" },
  { id: "filler", label: "Filler", emoji: "💧" },
  { id: "hifu", label: "HIFU / Ulthera", emoji: "⚡" },
  { id: "facial", label: "Facial / Skincare", emoji: "🌸" },
  { id: "laser", label: "Laser", emoji: "✨" },
  { id: "consult", label: "General consultation", emoji: "💬" },
];

const TIME_SLOTS = [
  "Morning (9–12)",
  "Afternoon (12–17)",
  "Evening (17–20)",
  "Flexible",
];

export function BookingForm({
  clinicId, clinicName, defaultService,
}: {
  clinicId?: string;
  clinicName?: string;
  defaultService?: string;
}) {
  const [step, setStep] = useState(0);
  const [service, setService] = useState(defaultService ?? "");
  const [dateStr, setDateStr] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");

  const today = new Date();
  today.setDate(today.getDate() + 1); // 내일부터 가능
  const minDate = today.toISOString().slice(0, 10);

  async function submit() {
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          message: notes,
          clinicId,
          clinicName,
          service,
          context: clinicName ? "booking_clinic" : "booking_general",
          name,
          phone,
          date: dateStr,
          timeSlot,
          _hp: honeypot,
        }),
      });
      setStatus(res.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="bg-white border border-green-300 rounded-xl p-6 text-center">
        <div className="text-4xl mb-2">✓</div>
        <h3 className="font-bold text-lg mb-1">Request received</h3>
        <p className="text-sm text-[var(--muted)] max-w-md mx-auto">
          We&apos;ll contact you within 24 hours with confirmed times and pricing.
          {clinicName ? ` ${clinicName} will be notified of your request.` : ""}
        </p>
      </div>
    );
  }

  const heading = clinicName ? `Book consultation at ${clinicName}` : "Reserve your consultation";
  const steps = ["Service", "Date", "Contact", "Review"];

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
      {/* Honeypot — 봇만 채우는 invisible field */}
      <input
        type="text"
        name="website_url_confirm"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
        aria-hidden="true"
      />
      <div className="px-5 pt-5">
        <h3 className="font-bold text-lg">{heading}</h3>
        <p className="text-xs text-[var(--muted)] mt-1">
          Free, no obligation. We confirm within 24h.
        </p>
        {/* Progress dots */}
        <div className="flex items-center gap-2 mt-4">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  i <= step ? "bg-black text-white" : "bg-gray-100 text-gray-400"
                }`}
              >
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 ${i < step ? "bg-black" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-5">
        {step === 0 && (
          <div>
            <label className="block text-sm font-medium mb-3">Which service?</label>
            <div className="grid grid-cols-2 gap-2">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => { setService(s.id); setStep(1); }}
                  className={`text-left px-3 py-3 rounded-lg border transition flex items-center gap-2 ${
                    service === s.id
                      ? "border-black bg-gray-50"
                      : "border-[var(--border)] hover:border-gray-400"
                  }`}
                >
                  <span className="text-xl">{s.emoji}</span>
                  <span className="text-sm font-medium">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Preferred date</label>
              <input
                type="date"
                value={dateStr}
                min={minDate}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Time slot</label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeSlot(t)}
                    className={`px-3 py-2 rounded-lg border text-sm transition ${
                      timeSlot === t
                        ? "border-black bg-gray-50 font-medium"
                        : "border-[var(--border)] hover:border-gray-400"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!dateStr || !timeSlot}
                className="flex-1 px-4 py-2.5 rounded-lg bg-black text-white text-sm font-bold hover:bg-gray-800 disabled:opacity-40"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Your name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Phone / LINE / WhatsApp <span className="text-[var(--muted)] font-normal">(optional)</span></label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+66 ..."
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Notes <span className="text-[var(--muted)] font-normal">(optional)</span></label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Any specific concerns, areas, or questions"
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-black resize-none"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!name || !email || !email.includes("@")}
                className="flex-1 px-4 py-2.5 rounded-lg bg-black text-white text-sm font-bold hover:bg-gray-800 disabled:opacity-40"
              >
                Review →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4 space-y-1.5 text-sm">
              <Row label="Service" value={SERVICES.find(s => s.id === service)?.label ?? service} />
              <Row label="Date" value={dateStr} />
              <Row label="Time" value={timeSlot} />
              <Row label="Name" value={name} />
              <Row label="Email" value={email} />
              {phone && <Row label="Phone" value={phone} />}
              {clinicName && <Row label="Clinic" value={clinicName} />}
              {notes && <Row label="Notes" value={notes} />}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={status === "submitting"}
                className="flex-1 px-4 py-2.5 rounded-lg bg-black text-white text-sm font-bold hover:bg-gray-800 disabled:opacity-40"
              >
                {status === "submitting" ? "Sending..." : "Confirm request"}
              </button>
            </div>
            {status === "error" && (
              <p className="text-xs text-red-700 text-center">Could not send. Try again or contact directly.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-[var(--muted)] text-xs uppercase tracking-wide">{label}</span>
      <span className="font-medium text-right truncate max-w-[60%]">{value}</span>
    </div>
  );
}
