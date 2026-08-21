const TOURS = [
  {
    name: "Chao Phraya Tourist Boat (Blue Flag)",
    emoji: "⛵",
    route: "Sathorn Pier ↔ Phra Arthit Pier",
    price: "All-day pass ฿200",
    why: "Best value hop-on hop-off boat for tourists. Stops at Asiatique, Tha Tien (near Wat Pho & Grand Palace), Maharaj (Wat Mahathat), Phra Arthit (near Khao San Road). English commentary available.",
    tip: "Buy at Sathorn Pier (BTS Saphan Taksin). The blue flag = tourist boat. Express boats (orange, green, yellow flags) are faster but locals-only feel and no English. Get the all-day pass — it's the same as 2 single trips.",
  },
  {
    name: "Klong Bang Luang Private Longtail Tour",
    emoji: "🛥️",
    route: "Bang Luang Floating Market & heritage canals",
    price: "฿1,500–2,500 per boat (holds 6 people)",
    why: "Explore Bangkok's surviving klong (canal) system. See traditional wooden houses, floating markets, and Thai community life unchanged for decades. Old Bangkok that most tourists miss completely.",
    tip: "Book through your hotel concierge or Saphan Phut pier. Negotiate price for the full boat — cheaper per person in groups. Wear sunscreen. Best 7–10am before heat. Locals wave and smile — engage with the experience.",
  },
  {
    name: "Thonburi Klong (Bangkok Noi Canal) Tour",
    emoji: "🌿",
    route: "Bangkok Noi / Thonburi canals",
    price: "฿500–800 per person (shared boat tours)",
    why: "Official Klongsan and Thonburi canal tour from Bangkok Yai station. Passes Wat Arun (Temple of Dawn) from the water, then into small canals with temples, orchid farms, and traditional Thai houses. 1.5–2 hour experience.",
    tip: "Sunrise tours (6am departure) offer the best light for photography and cooler temperatures. Book through Tha Chang Pier or Maharaj Pier. Bring water bottle — no stops for 90 minutes once in the klongs.",
  },
];

const ETIQUETTE = [
  "Remove shoes when entering any canal-side temple (quick stops are common on tours)",
  "Don't litter in the canal — even accidentally dropped bottles are noticed by locals",
  "Bargaining for boats at piers is normal — first price is usually 30–50% higher",
  "Life jackets available on most boats — ask if not offered",
  "Temple visits during tours: dress respectfully (knees and shoulders covered)",
];

export function BangkokKlongTour() {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-cyan-700 mb-3">
        ⛵ Bangkok canal tours (klong) — boat trips through the Venice of Asia
      </h2>
      <div className="space-y-2 mb-3">
        {TOURS.map((t) => (
          <div key={t.name} className="border border-cyan-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{t.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{t.route}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{t.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{t.why}</div>
            <div className="text-[10px] text-cyan-700">💡 {t.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-cyan-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-cyan-700 hover:bg-cyan-50">
          Canal tour etiquette
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {ETIQUETTE.map((e) => (
            <li key={e} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-cyan-400 shrink-0">•</span>{e}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
