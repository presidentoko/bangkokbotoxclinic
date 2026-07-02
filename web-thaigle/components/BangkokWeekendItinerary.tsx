const PLAN = [
  {
    day: "Friday Evening",
    emoji: "🌆",
    must: [
      "Arrive. Drop bags at hotel. Freshen up.",
      "Street food dinner at Silom Soi 20 stalls (฿80–150)",
      "Walk to Patpong Night Market (free, interesting, 6pm–midnight)",
      "Rooftop drink at Octave (Marriott Thong Lo) for Bangkok skyline — no reservations needed before 7pm",
    ],
    budget: "฿500–800",
  },
  {
    day: "Saturday Morning",
    emoji: "🌅",
    must: [
      "7am: Catch sunrise at Wat Arun (ferry from Tha Tien pier, ฿5)",
      "8am: Thai massage at Wat Pho school (฿420/hr) — book on arrival",
      "10am: Grand Palace + Wat Phra Kaew (฿500, allow 2 hrs)",
      "12pm: Lunch at Tha Tien pier-side restaurant ฿150–250",
    ],
    budget: "฿1,300–1,700",
  },
  {
    day: "Saturday Afternoon",
    emoji: "☕",
    must: [
      "2pm: Khao San Road + surrounding streets — explore 30 min",
      "3pm: Canal taxi from Phan Fah to Pratunam (฿15–20)",
      "4pm: Chatuchak Weekend Market (open Sat–Sun) — 2 hrs browse",
      "6pm: Dinner at Or Tor Kor Market next to Chatuchak (฿80–150)",
    ],
    budget: "฿400–700",
  },
  {
    day: "Saturday Evening",
    emoji: "🌙",
    must: [
      "8pm: Ekkamai bar hopping (Standard Bangkok rooftop, Bar Yard)",
      "Optional: DJ set at Iron Balls or Standard basement club (฿200 entry, drinks ฿300–400)",
    ],
    budget: "฿500–1,500 (depending on drinks)",
  },
  {
    day: "Sunday Morning",
    emoji: "🥐",
    must: [
      "9am: Sunday brunch at Marriott Sukhumvit (฿1,899 — worth it once)",
      "OR: Budget brunch at Terminal 21 Pier 21 food court (฿80–150)",
    ],
    budget: "฿150–2,000",
  },
  {
    day: "Sunday Afternoon",
    emoji: "🛍️",
    must: [
      "12pm: Siam Paragon or EmQuartier shopping + browse",
      "2pm: Sea Life Bangkok (฿990) or BACC art gallery (free)",
      "4pm: Foot massage for tired feet (฿200/hr near BTS)",
      "6pm: Depart or evening flight home",
    ],
    budget: "฿300–1,500",
  },
];

export function BangkokWeekendItinerary() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        📅 Bangkok weekend itinerary — Fri evening to Sun
      </div>
      <div className="space-y-1.5">
        {PLAN.map((p) => (
          <details key={p.day} className="border border-[var(--border)] rounded-xl group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 text-xs font-bold text-[var(--fg)] hover:text-blue-700 transition">
              <span className="text-lg shrink-0">{p.emoji}</span>
              <span className="flex-1">{p.day}</span>
              <span className="text-[10px] font-mono text-green-700 shrink-0">{p.budget}</span>
              <span className="text-[var(--muted)] group-open:rotate-180 transition text-sm shrink-0">⌄</span>
            </summary>
            <div className="px-3 pb-3 space-y-1">
              {p.must.map((m) => (
                <div key={m} className="text-[10px] flex gap-1.5 items-start">
                  <span className="shrink-0 text-blue-500 mt-0.5">▸</span>
                  <span className="leading-snug">{m}</span>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-[var(--muted)] bg-gray-50 rounded-xl p-2.5">
        Total weekend estimate (excluding accommodation): <strong>฿3,150–8,200</strong>. Accommodation: hostel ฿600–900 × 2 nights or mid-range hotel ฿2,000–4,000 × 2 nights.
      </div>
    </div>
  );
}
