const OPTIONS = [
  {
    name: "Pun Pun Bike (Bang Krachao)",
    emoji: "🌿",
    area: "Bang Nam Phueng pier, across from Chao Phraya",
    price: "฿50–100/day for basic bicycle",
    type: "Regular and electric bicycles",
    route: "Bang Krachao Green Lung — 10km loop through elevated orchard paths",
    why: "Bangkok's most magical cycling route. Bang Krachao is a forested island with no cars on the inner paths. 10km loop through orchards, canals, Buddhist shrines, and floating market.",
    tip: "Take Grab to Bang Nam Phueng pier (Prapadaeng area). Rent at pier when you arrive. Electric bike recommended for the non-cyclist — routes are flat but long. Bring water.",
  },
  {
    name: "RentAbike Bangkok (Multiple Zones)",
    emoji: "🚴",
    area: "Lumpini Park, Chatuchak Park, various city locations",
    price: "฿50–150/hour, ฿200–400/day",
    type: "Standard road bikes, some electric",
    route: "Lumpini Park loop (2km), along Chao Phraya promenade",
    why: "City cycling infrastructure improving yearly. Lumpini Park at dawn (before 7am) is remarkable — Thais exercising, cool air, peaceful. Chao Phraya promenade path is new.",
    tip: "Lumpini Park cyclists must use the park perimeter paths (not cut through), and travel counter-clockwise. Dawn cycling (5:30–7am) before the heat is best.",
  },
  {
    name: "Plearn Wan Bang Krachao Tours",
    emoji: "🗺️",
    area: "Bang Krachao",
    price: "Half-day guided bike tour ฿800–1,200 including bike, guide, lunch",
    type: "Guided bicycle tours, electric and standard",
    route: "Curated 12km route with stops at floating market, orchards, and Sri Nakhon Khuean Khan Park",
    why: "Guided option if you want history, culture, and food context with cycling. Stops at key points explained in English. Groups of 2–8 people.",
    tip: "Book online 2 days ahead. Tours run 7am–noon (avoid afternoon heat). Best April–October for orchards in bloom.",
  },
  {
    name: "WE Cycle (Shared City Bikes)",
    emoji: "📱",
    area: "Selected areas: Asok, Phrom Phong, On Nut, along Sukhumvit",
    price: "฿1/minute or ฿10/30min (app-based)",
    type: "Shared dockless electric bikes",
    route: "Short urban trips along designated cycle lanes",
    why: "Bangkok's dockless bike sharing system for urban trips. Good for first/last mile connection from BTS. Limited cycle lanes but improving.",
    tip: "Download WE Cycle app. Lock the bike at designated spots — don't lock randomly or you'll be charged. Avoid rush hours — Bangkok drivers and bike lanes don't mix safely.",
  },
];

export function BangkokBicycleRentals() {
  return (
    <div className="rounded-2xl border border-lime-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-lime-700 mb-3">
        🚴 Bangkok cycling & bicycle rentals — routes, rentals & guided tours
      </h2>
      <div className="space-y-2">
        {OPTIONS.map((o) => (
          <div key={o.name} className="border border-lime-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{o.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{o.area} · {o.type}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{o.price}</span>
            </div>
            <div className="text-[10px] text-lime-700 mb-0.5">🗺️ Route: {o.route}</div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-orange-600">💡 {o.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
