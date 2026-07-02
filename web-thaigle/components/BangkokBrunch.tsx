const SPOTS = [
  {
    name: "Never Ending Summer (NES)",
    emoji: "☀️",
    area: "Charoen Nakhon, West Bank (opposite ICONSIAM, ferry or Grab)",
    price: "฿300–700/person",
    hours: "Sat–Sun 8am–3pm (limited weekdays)",
    why: "Bangkok's most beautiful brunch venue. Heritage wooden shophouse on Chao Phraya riverside. Extensive Thai-Western brunch menu.",
    must: "Overnight oat set, eggs benedict with Thai holy basil, morning glory salad, passionfruit mimosa",
    reserve: "Must book 1 week ahead for weekends. Website or direct call.",
  },
  {
    name: "The Pelican Bar and Restaurant",
    emoji: "🦢",
    area: "ICONSIAM mall, Charoen Nakhon waterfront",
    price: "฿400–800/person",
    hours: "Daily 8am–4pm",
    why: "Most reliable weekend brunch in Bangkok. River view, live music on Sundays, extensive buffet + à la carte. Very family-friendly.",
    must: "Eggs florentine, full English breakfast, homemade granola, detox smoothie",
    reserve: "Walk-in friendly on weekdays. Weekend reservation recommended.",
  },
  {
    name: "Dean & DeLuca (Multiple)",
    emoji: "☕",
    area: "Centralworld / Emporium / ICONSIAM",
    price: "฿250–500/person",
    hours: "Daily 7am–7pm",
    why: "Premium New York-style café chain. Best pastries in Bangkok. Quick brunch when you don't want to sit long. Airport locations too.",
    must: "Croissant, eggs of the day, specialty latte, avocado toast",
    reserve: "Walk-in only. Weekend mornings queue 10–15 min.",
  },
  {
    name: "Roast Coffee & Eatery",
    emoji: "🫙",
    area: "EmQuartier (BTS Phrom Phong)",
    price: "฿300–600/person",
    hours: "Daily 8am–8pm",
    why: "Bangkok's most popular specialty brunch spot. Long queues on weekends — for good reason. Own-roasted coffee, fresh ingredients, creative menu.",
    must: "Smashed avo toast with poached eggs, granola bowl, cold brew with tonic, shakshouka",
    reserve: "Queue up to 45 min on Sat/Sun 9–11am. Worth it.",
  },
];

export function BangkokBrunch() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🍳 Bangkok brunch — best weekend brunch spots
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area} · {s.hours}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-600 mb-0.5">⭐ Order: {s.must}</div>
            <div className="text-[10px] text-yellow-700">📱 Reservation: {s.reserve}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
