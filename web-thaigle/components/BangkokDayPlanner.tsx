"use client";

import { useState } from "react";

const ACTIVITIES: Record<string, { label: string; duration: string; cost: string; area: string }[]> = {
  morning: [
    { label: "Sunrise at Wat Arun", duration: "90 min", cost: "฿4 ferry", area: "Old City" },
    { label: "Thai massage session", duration: "60–90 min", cost: "฿200–400", area: "Anywhere" },
    { label: "Chatuchak weekend market", duration: "2–3 hrs", cost: "Free entry", area: "Chatuchak" },
    { label: "Grand Palace & Emerald Buddha", duration: "2 hrs", cost: "฿500", area: "Old City" },
  ],
  afternoon: [
    { label: "Thai cooking class", duration: "3 hrs", cost: "฿800–1500", area: "Various" },
    { label: "Muay Thai gym session", duration: "90 min", cost: "฿400–800", area: "Various" },
    { label: "Or Tor Kor Market lunch", duration: "1–2 hrs", cost: "฿150–300", area: "Chatuchak" },
    { label: "Jim Thompson House tour", duration: "1 hr", cost: "฿200", area: "Siam" },
  ],
  evening: [
    { label: "Yaowarat (Chinatown) street food", duration: "2 hrs", cost: "฿300–500", area: "Chinatown" },
    { label: "Rooftop bar at sunset", duration: "2 hrs", cost: "฿400–800", area: "Silom" },
    { label: "Muay Thai bout at Rajadamnern", duration: "3 hrs", cost: "฿1,500–2,000", area: "Old City" },
    { label: "Chao Phraya dinner cruise", duration: "2 hrs", cost: "฿1,200–2,000", area: "Riverside" },
  ],
};

type Slot = "morning" | "afternoon" | "evening";
const SLOTS: Slot[] = ["morning", "afternoon", "evening"];
const SLOT_LABELS: Record<Slot, string> = { morning: "🌅 Morning", afternoon: "☀️ Afternoon", evening: "🌙 Evening" };

export function BangkokDayPlanner() {
  const [picks, setPicks] = useState<Partial<Record<Slot, number>>>({});

  const toggle = (slot: Slot, idx: number) => {
    setPicks((p) => ({ ...p, [slot]: p[slot] === idx ? undefined : idx }));
  };

  const totalCost = SLOTS.reduce((sum, slot) => {
    const idx = picks[slot];
    if (idx === undefined) return sum;
    const a = ACTIVITIES[slot][idx];
    const match = a.cost.match(/฿([\d,]+)/);
    if (match) sum += parseInt(match[1].replace(",", ""));
    return sum;
  }, 0);

  const pickedAll = SLOTS.every((s) => picks[s] !== undefined);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🗓️ Build your Bangkok day — pick one per slot
      </div>
      {SLOTS.map((slot) => (
        <div key={slot} className="mb-4">
          <div className="text-xs font-black text-[var(--fg)] mb-2">{SLOT_LABELS[slot]}</div>
          <div className="grid grid-cols-2 gap-1.5">
            {ACTIVITIES[slot].map((a, i) => {
              const selected = picks[slot] === i;
              return (
                <button
                  key={a.label}
                  onClick={() => toggle(slot, i)}
                  className={`text-left rounded-xl p-2.5 border transition text-[10px] ${selected ? "border-orange-400 bg-orange-50" : "border-[var(--border)] hover:border-orange-200"}`}
                >
                  <div className={`font-bold mb-0.5 ${selected ? "text-orange-700" : ""}`}>{a.label}</div>
                  <div className="text-[var(--muted)]">{a.duration} · {a.cost}</div>
                  <div className="text-blue-500">📍 {a.area}</div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {pickedAll && (
        <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black">Estimated budget</span>
            <span className="font-mono font-black text-orange-700 text-lg">฿{totalCost.toLocaleString()}+</span>
          </div>
          <div className="text-[10px] text-[var(--muted)] mt-1">
            {SLOTS.map((s) => {
              const idx = picks[s];
              return idx !== undefined ? `${SLOT_LABELS[s]}: ${ACTIVITIES[s][idx].label}` : null;
            }).filter(Boolean).join(" · ")}
          </div>
        </div>
      )}
    </div>
  );
}
