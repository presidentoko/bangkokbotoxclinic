"use client";
// 다단계 예약/문의 폼 — service → date → contact → confirm.

import { useState } from "react";

type ServiceOpt = { id: string; label: string; emoji: string };

// Focus 별 서비스 목록 — Dental 사이트에 implants/veneers가 없거나
// Hair 사이트에 botox만 보이는 mismatch 방지.
const ALL_SERVICES: ServiceOpt[] = [
  { id: "botox", label: "Botox", emoji: "💉" },
  { id: "filler", label: "Filler", emoji: "💧" },
  { id: "hifu", label: "HIFU / Ulthera", emoji: "⚡" },
  { id: "facial", label: "Facial / Skincare", emoji: "🌸" },
  { id: "laser", label: "Laser", emoji: "✨" },
  { id: "consult", label: "General consultation", emoji: "💬" },
];

const DENTAL_SERVICES: ServiceOpt[] = [
  { id: "dental_implant", label: "Dental implant", emoji: "🦷" },
  { id: "veneers", label: "Veneers", emoji: "✨" },
  { id: "whitening", label: "Whitening", emoji: "🌟" },
  { id: "orthodontics", label: "Orthodontics / Braces", emoji: "😬" },
  { id: "all_on_4", label: "All-on-4", emoji: "🦷" },
  { id: "consult", label: "General consultation", emoji: "💬" },
];

const HAIR_SERVICES: ServiceOpt[] = [
  { id: "fue", label: "FUE Transplant", emoji: "💇" },
  { id: "dhi", label: "DHI Transplant", emoji: "💇‍♂️" },
  { id: "smp", label: "Scalp Micropigmentation", emoji: "🎨" },
  { id: "beard_transplant", label: "Beard / Eyebrow", emoji: "🧔" },
  { id: "scalp_care", label: "Scalp / PRP / Mesotherapy", emoji: "💧" },
  { id: "consult", label: "General consultation", emoji: "💬" },
];

function servicesForFocus(): ServiceOpt[] {
  // NEXT_PUBLIC_SITE_FOCUS는 client에서도 접근 가능 (빌드시 inline).
  const focus = process.env.NEXT_PUBLIC_SITE_FOCUS;
  if (focus === "dental") return DENTAL_SERVICES;
  if (focus === "hair") return HAIR_SERVICES;
  return ALL_SERVICES;
}

const SERVICES = servicesForFocus();

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
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");

  const today = new Date();
  today.setDate(today.getDate() + 1); // 내일부터 가능
  // toISOString()은 UTC 기준이라 태국 새벽(UTC+7)엔 하루 밀림 — 로컬 날짜로 조립.
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

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
      <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 border-2 border-green-300 rounded-xl p-8 text-center shadow-lg">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-500 text-white flex items-center justify-center text-3xl font-black shadow-md">
          ✓
        </div>
        <h3 className="font-black text-xl mb-2">Request received</h3>
        <p className="text-sm text-[var(--muted)] max-w-md mx-auto leading-relaxed">
          We&apos;ll contact you within <strong className="text-[var(--fg)]">24 hours</strong> with confirmed times and pricing.
          {clinicName ? <> <strong className="text-[var(--fg)]">{clinicName}</strong> will be notified of your request.</> : ""}
        </p>
        <p className="text-[11px] text-[var(--muted)] mt-4 opacity-80">
          Watch your inbox · Mark our messages as not-spam to keep replies fast
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
        {/* Data-handling disclosure — visible upfront, before user fills anything */}
        <div className="mt-3 text-[11px] leading-relaxed text-[var(--muted)] bg-slate-50 border border-[var(--border)] rounded-lg p-3">
          <strong className="text-[var(--fg)]">Where this goes:</strong>{" "}
          {clinicName
            ? <>We forward your details to <strong className="text-[var(--fg)]">{clinicName}</strong> so a staff member can confirm time, pricing, and brand availability — and to our internal admin for follow-up if they don&apos;t respond within 24h.</>
            : <>We forward your details to the clinic(s) best matching your request, and to our internal admin so we can follow up if there&apos;s no response within 24h.</>}
          {" "}We don&apos;t sell or rent your data. See{" "}
          <a href="/privacy" target="_blank" rel="noreferrer" className="underline text-[var(--fg)] hover:opacity-70">privacy policy</a>.
        </div>
        {/* Progress — 큰 step indicator + 현재 step label */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-1.5 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    i < step
                      ? "bg-green-500 text-white shadow-sm"
                      : i === step
                      ? "bg-black text-white ring-4 ring-black/15 scale-105"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-1 rounded-full transition-colors ${i < step ? "bg-green-500" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 text-[11px] uppercase tracking-widest text-[var(--muted)] font-bold">
            Step {step + 1} of {steps.length} · <span className="text-[var(--fg)]">{steps[step]}</span>
          </div>
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
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-black"
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
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Phone / LINE / WhatsApp <span className="text-[var(--muted)] font-normal">(optional)</span></label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+66 ..."
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Notes <span className="text-[var(--muted)] font-normal">(optional)</span></label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Any specific concerns, areas, or questions"
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-black resize-none"
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

            {/* Consent — required before submit */}
            <label className="flex items-start gap-2 cursor-pointer select-none p-3 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-black shrink-0"
              />
              <span className="text-xs leading-relaxed text-[var(--fg)]">
                I agree to share my contact details with{" "}
                {clinicName ? <strong>{clinicName}</strong> : "the matching clinic"}{" "}
                and the site admin for the purpose of confirming this booking, in line with the{" "}
                <a href="/privacy" target="_blank" rel="noreferrer" className="underline">privacy policy</a>.
              </span>
            </label>

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
                disabled={status === "submitting" || !consent}
                className="flex-1 px-4 py-2.5 rounded-lg bg-black text-white text-sm font-bold hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
                title={!consent ? "Please tick consent above" : undefined}
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
