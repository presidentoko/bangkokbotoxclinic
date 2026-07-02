const ROUTES = [
  {
    type: "Tuk-tuk",
    emoji: "🛺",
    fromTo: "Khao San Road → Grand Palace",
    distance: "2km",
    fairPrice: "฿60–฿100",
    tip: "Agree price BEFORE getting in. Driver asks ฿200–฿300 initially. ฿80 is fair. Never let them take you to a 'temple that's closed today' — it's a scam.",
    duration: "5–10 min",
  },
  {
    type: "Khlong express boat",
    emoji: "⛵",
    fromTo: "Tha Chang → Saphan Taksin (full run)",
    distance: "5km",
    fairPrice: "฿10–฿50 (by zone)",
    tip: "Orange flag = express (faster, more stops). Yellow/green flag = local, more stops. Boat leaves when full — squeeze in. Best used 7–9am to skip road traffic.",
    duration: "20–35 min",
  },
  {
    type: "Chao Phraya Tourist Boat",
    emoji: "🚢",
    fromTo: "Sathorn Pier ↔ Phra Arthit Pier",
    distance: "12km",
    fairPrice: "฿60 (unlimited day pass ฿200)",
    tip: "Blue flag tourist boat. Slower, air-conditioned, stops at all major sites. Day pass best value if visiting multiple riverside temples.",
    duration: "60–90 min full route",
  },
  {
    type: "Songthaew (red truck taxi)",
    emoji: "🚌",
    fromTo: "Silom / BTS stops → local destinations",
    distance: "Varies",
    fairPrice: "฿10–฿20/person",
    tip: "Shared minibus. Flag one down and tell the driver where you're going. Pay when you get off. Rare in tourist areas but common in local neighbourhoods.",
    duration: "Depends on traffic",
  },
];

export function TukTukRoutes() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🛺 Tuk-tuks, boats & local transport — real prices
      </div>
      <div className="space-y-2">
        {ROUTES.map((r) => (
          <div key={r.type} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{r.emoji}</span>
              <div>
                <div className="font-bold text-xs">{r.type}</div>
                <div className="text-[10px] text-[var(--muted)]">{r.fromTo}</div>
              </div>
              <span className="ml-auto text-xs font-mono font-black text-green-700">{r.fairPrice}</span>
            </div>
            <div className="text-[10px] text-[var(--muted)] mb-0.5">🕐 {r.duration}</div>
            <div className="text-[10px] text-orange-600 leading-snug">💡 {r.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
