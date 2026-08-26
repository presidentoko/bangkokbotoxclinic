const TOURS = [
  {
    name: "Bangkok by Bike (River Tours)",
    emoji: "🚲",
    area: "Departure: Banglamphu / Khao San area",
    price: "฿800–1,500/person",
    duration: "3–4 hours",
    why: "Most popular guided cycling tour in Bangkok. Ferry + bike combination. Crosses to less-developed west bank for canal village experience.",
    route: "Khao San → ferry → canal villages → Bang Krachao approach → local market → return ferry",
    bookAt: "bangkokbybike.com. Also on Klook. Group max 12 people.",
    tip: "Bring water and sunscreen. Morning tours (7–11am) much cooler than afternoon.",
  },
  {
    name: "Bang Krachao Green Loop (Self-Guided)",
    emoji: "🌿",
    area: "Ferry from Klong Toey Port to Bang Krachao",
    price: "Ferry ฿4 + bike rental ฿50–80/hr",
    duration: "3–5 hours self-paced",
    why: "Bangkok's 'green lung' — a river meander that's 80% jungle/garden despite being 5km from central Bangkok. Sri Nakhon Khuean Khan Park in center.",
    route: "12km fully flat loop through jungle paths, over suspension bridges, past orchid gardens and local food stalls.",
    bookAt: "No booking — take ferry from Si Phraya pier (near Sathorn) on weekends. Rent bike on arrival.",
    tip: "Weekend mornings only (quieter). 7am ferry least crowded. Bring ฿500 cash for bike + food.",
  },
  {
    name: "Rattanakosin Heritage Night Ride",
    emoji: "🏛️",
    area: "Departure: Tha Maharaj Pier (near Sanam Luang)",
    price: "฿1,200–1,800/person",
    duration: "3 hours (evening)",
    why: "Old Bangkok by bike after dark when streets empty. Temple illuminations, canal paths, avoiding daytime traffic.",
    route: "Grand Palace → Wat Arun → canal paths → Khao San → Sanam Luang",
    bookAt: "viator.com, or book direct with the operator. Group size 4–14.",
    tip: "Wear light clothing — Bangkok evenings still warm. River breeze makes it pleasant. Bring small bag only.",
  },
];

export function BangkokCyclingTours() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🚲 Bangkok cycling tours — guided & self-guided bike routes
      </h2>
      <div className="space-y-2">
        {TOURS.map((t) => (
          <details key={t.name} className="border border-green-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-green-50 transition">
              <span className="text-2xl shrink-0">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{t.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{t.duration} · {t.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{t.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-green-100 pt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{t.why}</div>
              <div className="text-[10px] text-green-700">🗺️ Route: {t.route}</div>
              <div className="text-[10px] text-orange-600">📱 Book: {t.bookAt}</div>
              <div className="text-[10px] text-[var(--muted)]">💡 {t.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
