"use client";
// Country-specific Thailand visa rules for tourists. Updates as user picks origin country.
// Last updated 2026 — common cases only, link out for official sources.

import { useState } from "react";

type VisaRow = {
  flag: string; country: string; visa: string;
  days: string; note: string;
};

const RULES: VisaRow[] = [
  { flag: "🇰🇷", country: "Korea",      visa: "Visa-free",          days: "90 days",  note: "Bilateral agreement, must hold return ticket" },
  { flag: "🇯🇵", country: "Japan",      visa: "Visa-free",          days: "30 days",  note: "Extendable +30 days at immigration office for ฿1,900" },
  { flag: "🇨🇳", country: "China",      visa: "Visa-free (2024+)",  days: "30 days",  note: "Mutual visa exemption from Mar 2024" },
  { flag: "🇭🇰", country: "Hong Kong",  visa: "Visa-free",          days: "30 days",  note: "Same as China rule" },
  { flag: "🇸🇬", country: "Singapore",  visa: "Visa-free",          days: "30 days",  note: "ASEAN nationality" },
  { flag: "🇲🇾", country: "Malaysia",   visa: "Visa-free",          days: "30 days",  note: "ASEAN nationality" },
  { flag: "🇺🇸", country: "USA",         visa: "Visa-free",          days: "60 days",  note: "Extended to 60 days from July 2024" },
  { flag: "🇬🇧", country: "UK",          visa: "Visa-free",          days: "60 days",  note: "Same as USA 60-day rule" },
  { flag: "🇦🇺", country: "Australia",   visa: "Visa-free",          days: "60 days",  note: "Same 60-day extension" },
  { flag: "🇸🇦", country: "Saudi Arabia", visa: "Visa-free",         days: "30 days",  note: "Confirmed by Royal Thai Embassy" },
  { flag: "🇦🇪", country: "UAE",         visa: "Visa-free",          days: "30 days",  note: "Same 30-day rule" },
  { flag: "🇮🇳", country: "India",        visa: "Visa-free (2024+)", days: "60 days",  note: "Extended visa-free rules in effect" },
];

export default function VisaInfoBar() {
  const [country, setCountry] = useState<VisaRow>(RULES[0]);
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-2xl border bg-white p-5" style={{ borderColor: "rgb(var(--border))" }}>
      <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-[rgb(var(--muted))]">Visa quick check</div>
          <h3 className="text-base font-black mt-0.5">Coming from {country.country}?</h3>
        </div>
        <button onClick={() => setOpen(!open)}
          className="text-xs font-bold text-blue-700 hover:underline">
          {open ? "← Back" : "Pick country →"}
        </button>
      </div>

      {open ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {RULES.map((r) => (
            <button key={r.country} onClick={() => { setCountry(r); setOpen(false); }}
              className={`flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-xs font-bold text-left transition ${
                country.country === r.country ? "border-emerald-500 bg-emerald-50" : "border-[rgb(var(--border))] hover:border-slate-400"
              }`}>
              <span className="text-lg">{r.flag}</span>
              <span>{r.country}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="rounded-lg border bg-slate-50 p-3" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[rgb(var(--muted))]">Visa</div>
            <div className="text-sm font-black mt-0.5">{country.visa}</div>
          </div>
          <div className="rounded-lg border bg-slate-50 p-3" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[rgb(var(--muted))]">Max stay</div>
            <div className="text-sm font-black mt-0.5">{country.days}</div>
          </div>
          <div className="rounded-lg border bg-slate-50 p-3" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[rgb(var(--muted))]">Note</div>
            <div className="text-xs mt-0.5">{country.note}</div>
          </div>
        </div>
      )}
      <p className="text-[11px] text-[rgb(var(--muted))] mt-3 leading-relaxed">
        Rules change. Confirm with your nearest Royal Thai Embassy or{" "}
        <a href="https://www.thaievisa.go.th/" target="_blank" rel="noopener noreferrer" className="underline">thaievisa.go.th</a>{" "}
        before booking flights.
      </p>
    </section>
  );
}
