const ZONES = [
  {
    zone: "Chinatown (Yaowarat Road)",
    emoji: "🏮",
    bts: "Hua Lamphong MRT or Sanam Chai MRT",
    hours: "Evening 5pm–midnight (best after 7pm)",
    signature: ["Khao mun gai (poached chicken rice)", "Braised duck noodles", "Dim sum from 6am–11am", "Fried crab claws", "Mango sticky rice at Sanguan Sri"],
    budget: "฿50–150/dish, eat 3–5 dishes to be full",
    tip: "Go hungry. Start at the Hua Lamphong end and walk toward the arch. Best on weekends when vendors double.",
  },
  {
    zone: "Or Tor Kor Market",
    emoji: "🌿",
    bts: "Mo Chit BTS (Chatuchak area)",
    hours: "6am–6pm daily",
    signature: ["Grade-A mangoes + mangosteen", "Durian by the piece", "Som tam stations", "Boat noodles (kuay teow reua)", "Fresh coconut ice cream"],
    budget: "Premium quality — ฿30–200/item",
    tip: "Bangkok's premium fresh market. No tourist markup, just quality. Great for exotic fruit tasting without going deep into Chatuchak.",
  },
  {
    zone: "Silom Complex Street",
    emoji: "🏙️",
    bts: "BTS Sala Daeng (S2)",
    hours: "11am–9pm weekdays (lunch rush 12–1:30pm)",
    signature: ["Pad see ew from ฿60", "Moo ping (pork skewers) breakfast", "Green curry rice boxes", "Papaya salad som tam", "Kra pao khai (basil + fried egg)"],
    budget: "Cheapest in the city area — ฿40–80/plate",
    tip: "Office worker lunch spots = best value + freshness. Avoid tourist restaurants on the main strip — duck into the sois.",
  },
  {
    zone: "Chatuchak Weekend Market",
    emoji: "🛒",
    bts: "Mo Chit BTS / Chatuchak Park MRT",
    hours: "Sat–Sun 9am–6pm only",
    signature: ["Boat noodles area (Soi 24–25)", "Coconut pancakes khanom krok", "Grilled pork neck (kor moo yang)", "Fresh coconut shake ฿40", "Pad thai from market stalls ฿60"],
    budget: "Street food ฿40–100, eat while walking",
    tip: "Have lunch at 10am before crowds peak. Section 26 has the best concentrated street food zone.",
  },
  {
    zone: "Victory Monument",
    emoji: "🏛️",
    bts: "BTS Victory Monument (N3)",
    hours: "11am–9pm daily, some 24hr stalls",
    signature: ["Boat noodles (among the best in Bangkok)", "Northern Thai khao soi", "Pad kra pao from ฿50", "Sukhothai-style noodles", "Wonton soup"],
    budget: "Real local prices — ฿50–90/bowl",
    tip: "Boat noodle alley near the monument is legendary. Tiny bowls = ฿12–15 each. Eat 5–8 bowls. Not a tourist attraction — real deal.",
  },
];

export function BangkokStreetFoodMap() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🍜 Bangkok street food zones — what to eat where
      </div>
      <div className="space-y-3">
        {ZONES.map((z) => (
          <div key={z.zone} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{z.emoji}</span>
              <div>
                <div className="font-bold text-xs">{z.zone}</div>
                <div className="text-[10px] text-[var(--muted)]">🚉 {z.bts} · 🕐 {z.hours}</div>
              </div>
            </div>
            <div className="space-y-0.5 mb-1.5">
              {z.signature.map((s) => (
                <div key={s} className="text-[10px] flex gap-1.5">
                  <span className="shrink-0 text-orange-500">▸</span>{s}
                </div>
              ))}
            </div>
            <div className="text-[10px] text-green-700 mb-0.5">{z.budget}</div>
            <div className="text-[10px] text-blue-600">💡 {z.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
