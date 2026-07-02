const DAYS = [
  {
    day: "Day 1 — Arrive & Explore Old City",
    morning: "Take Airport Rail Link (฿45) to Phaya Thai. Check in to hostel. Nap if needed.",
    afternoon: "Wat Pho (฿200) → walk to Tha Tien pier → ferry to Wat Arun (฿100) → photograph from east bank (free)",
    evening: "Yaowarat Chinatown for dinner. Budget ฿120–200 for food.",
    daily: "฿700–900",
  },
  {
    day: "Day 2 — Temples + Markets",
    morning: "Grand Palace + Wat Phra Kaew (฿500, 2 hrs). Go early 8:30am before crowds.",
    afternoon: "Street food lunch near Tha Chang pier (฿60–80). Walk Khao San Road area. Free.",
    evening: "Asiatique Night Market (free ferry from Saphan Taksin). Dinner ฿150–250.",
    daily: "฿850–1,050",
  },
  {
    day: "Day 3 — Sukhumvit & BTS Day",
    morning: "Chatuchak Market (free entry, Sat/Sun only — else skip to afternoon)",
    afternoon: "Terminal 21 food court lunch (฿39–80/dish). Walk Siam Square shopping. Window browse.",
    evening: "Sukhumvit Soi 11 or Ekkamai bar area. Street beer (฿55–65) from 7-Eleven nearby.",
    daily: "฿500–700",
  },
  {
    day: "Day 4 — Day Trip: Ayutthaya",
    morning: "Train from Hua Lamphong (฿20, 1.5 hrs). Bike rentals at Ayutthaya station (฿50/day).",
    afternoon: "Cycle between Wat Mahathat, Wat Phra Sri Sanphet, Wat Chaiwatthanaram. Admission ฿30–50 each.",
    evening: "Return train to Bangkok (฿20). Dinner at Victory Monument noodle alley (฿50–80).",
    daily: "฿400–600",
  },
  {
    day: "Day 5 — Wellness Day",
    morning: "Lumpini Park early walk (free). Pad kra pao at Victory Monument stalls (฿50–70).",
    afternoon: "Wat Pho massage (1 hr ฿420). Foot massage nearby (1 hr ฿150–200).",
    evening: "Local neighbourhood walk. Buy supplies at local market (฿30–60) for snacks.",
    daily: "฿750–900",
  },
  {
    day: "Day 6 — Food Focus Day",
    morning: "Or Tor Kor Market (free entry) for premium produce + street food. Try exotic fruits ฿50–150.",
    afternoon: "Bangkok Art & Culture Centre BACC (free). Siam Paragon food hall explore.",
    evening: "Cooking class (optional, ฿1,300+ at Silom Thai Cooking School) OR self-cook from Or Tor Kor.",
    daily: "฿600–1,800 (with/without cooking class)",
  },
  {
    day: "Day 7 — Relax & Depart",
    morning: "Final café hopping in Ari. Pack bags.",
    afternoon: "Late checkout → mall aircon escape → Airport Rail Link (฿45)",
    evening: "Depart. Airport food: MK restaurant at Suvarnabhumi ฿150–250.",
    daily: "฿300–500",
  },
];

export function BangkokBudgetWeek() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        💰 7-day Bangkok budget itinerary — ฿5,000–7,000 total
      </div>
      <div className="space-y-1.5">
        {DAYS.map((d) => (
          <details key={d.day} className="border border-[var(--border)] rounded-xl group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center justify-between gap-2 text-xs font-bold text-[var(--fg)] hover:text-blue-700 transition">
              <span className="flex-1">{d.day}</span>
              <span className="shrink-0 text-green-700 font-mono text-[10px]">{d.daily}</span>
              <span className="text-[var(--muted)] group-open:rotate-180 transition text-sm shrink-0">⌄</span>
            </summary>
            <div className="px-3 pb-3 space-y-1.5">
              <div className="text-[10px]"><span className="font-bold text-orange-500">Morning: </span>{d.morning}</div>
              <div className="text-[10px]"><span className="font-bold text-blue-500">Afternoon: </span>{d.afternoon}</div>
              <div className="text-[10px]"><span className="font-bold text-purple-500">Evening: </span>{d.evening}</div>
            </div>
          </details>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-[var(--muted)] bg-gray-50 rounded-xl p-2.5">
        Total 7-day budget estimate: <strong>฿5,200–7,500</strong> (~$148–214 USD). Excludes accommodation (hostels ฿300–600/night add ฿2,100–4,200). Not included: flights, visa, travel insurance.
      </div>
    </div>
  );
}
