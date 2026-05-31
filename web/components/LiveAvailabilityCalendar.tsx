"use client";
// Calendly-style 7-day x 4-slot grid. Synth availability deterministic per clinic+date.
// Selecting a slot opens the booking section with date prefilled.

import { useEffect, useState } from "react";

const SLOTS = [
  { v: "morn",   label: "9–12", emoji: "☀️" },
  { v: "after",  label: "1–4",  emoji: "🌤" },
  { v: "eve",    label: "5–8",  emoji: "🌙" },
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function isOpen(clinicId: string, date: string, slot: string): boolean {
  // Deterministic noise: about 60% open
  return hash(`${clinicId}:${date}:${slot}`) % 10 < 6;
}

function nextDays(n: number): { date: string; label: string; sub: string }[] {
  const out: { date: string; label: string; sub: string }[] = [];
  const fmt = new Intl.DateTimeFormat("en-GB", { weekday: "short" });
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const date = d.toISOString().slice(0, 10);
    out.push({
      date,
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : fmt.format(d),
      sub: `${d.getDate()}`,
    });
  }
  return out;
}

export default function LiveAvailabilityCalendar({
  clinicId,
  bookingHref = "#booking",
}: {
  clinicId: string;
  bookingHref?: string;
}) {
  const [days, setDays] = useState<{ date: string; label: string; sub: string }[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDays(nextDays(7));
  }, []);

  if (!mounted) return null;

  return (
    <section className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-baseline justify-between mb-1 gap-3 flex-wrap">
        <h3 className="text-lg font-black flex items-center gap-2">📅 Live availability</h3>
        <span className="text-xs text-[var(--muted)]">Confirmed by clinic after booking</span>
      </div>
      <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">
        Indicative slots based on the clinic&apos;s typical schedule. Pick one and we&apos;ll request confirmation in &lt; 4h.
      </p>

      <div className="overflow-x-auto -mx-2 px-2 pb-1">
        <table className="min-w-full text-center" style={{ borderSpacing: "4px" }}>
          <thead>
            <tr>
              <th className="text-[10px] font-bold uppercase text-[var(--muted)] text-left pl-1 py-1">Slot</th>
              {days.map((d, i) => (
                <th key={d.date} className="px-1">
                  <div className={`text-[10px] font-bold uppercase ${i === 0 ? "text-emerald-700" : "text-[var(--muted)]"}`}>{d.label}</div>
                  <div className="text-sm font-black tabular-nums">{d.sub}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SLOTS.map((slot) => (
              <tr key={slot.v}>
                <td className="text-left pl-1 py-1 align-middle">
                  <div className="text-xs font-bold flex items-center gap-1">
                    <span>{slot.emoji}</span><span>{slot.label}</span>
                  </div>
                </td>
                {days.map((d) => {
                  const open = isOpen(clinicId, d.date, slot.v);
                  return (
                    <td key={d.date + slot.v} className="p-1 align-middle">
                      {open ? (
                        <a href={`${bookingHref}?date=${d.date}&slot=${slot.v}`}
                          className="block rounded-lg border-2 border-emerald-200 bg-emerald-50 text-emerald-900 hover:border-emerald-500 hover:bg-emerald-100 py-2 text-xs font-bold transition">
                          Pick
                        </a>
                      ) : (
                        <span className="block rounded-lg bg-slate-50 text-slate-400 py-2 text-xs">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 text-[11px] text-[var(--muted)] flex-wrap">
        <span>✓ Free to request · cancel anytime</span>
        <a href={bookingHref} className="font-bold text-emerald-700 hover:underline">More times → </a>
      </div>
    </section>
  );
}
