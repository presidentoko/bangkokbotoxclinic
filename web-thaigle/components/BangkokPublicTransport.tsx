const TRANSPORT = [
  {
    name: "BTS Skytrain",
    emoji: "🚇",
    price: "฿17–62 per trip based on zones",
    coverage: "Sukhumvit line (Khu Khot–Kheha) + Silom line (National Stadium–Bang Wa)",
    tip: "Rabbit Card (฿100 + load) saves 15% vs single tickets. Buy at any BTS station. Works on buses too.",
    best: "Sukhumvit corridor, Silom area, shopping malls. Not useful for Old City/Chinatown.",
    hours: "5:30am–midnight",
  },
  {
    name: "MRT Subway",
    emoji: "🚊",
    price: "฿17–70 per trip based on zones",
    coverage: "Blue line (Tha Phra–Lak Song + Hua Lamphong–Bangsu) + Purple line",
    tip: "Connects with BTS at multiple interchanges (Asok/Sukhumvit, Sala Daeng/Silom, Mo Chit/Chatuchak). Very useful for Silom–Chatuchak.",
    best: "Chatuchak area, Lumphini, Rattanakosin (Sanam Chai MRT is the temple area station).",
    hours: "5:30am–midnight",
  },
  {
    name: "Chao Phraya Express Boat",
    emoji: "⛵",
    price: "฿15–40 per trip",
    coverage: "Chao Phraya River: Nonthaburi to Wat Rajsingkhorn (central Bangkok stops)",
    tip: "Orange-flag boat (no flag) = all stops, tourist ferry. Blue-flag = express, fewer stops. Most useful: Saphan Taksin → Asiatique/Old City piers.",
    best: "Getting to Rattanakosin temples, Chinatown, Asiatique. More scenic than Grab.",
    hours: "5:45am–8:45pm",
  },
  {
    name: "Public Bus",
    emoji: "🚌",
    price: "฿6.50–23 per ride",
    coverage: "Comprehensive city-wide network — reaches everywhere BTS/MRT doesn't",
    tip: "Very cheap but confusing routes. Download ViaBus app for Bangkok bus routes. AC buses ฿10–23. Non-AC: ฿6.50 flat.",
    best: "Old City to Chatuchak (bus 59), Banglamphu to Silom (bus 15). Gaps BTS/MRT can't fill.",
    hours: "24 hours (limited late-night service)",
  },
  {
    name: "Songthaew (Red/Blue Truck Taxi)",
    emoji: "🚐",
    price: "฿10–30 per ride",
    coverage: "Fixed routes in outer areas (Sukhumvit 71, Ramkhamhaeng, etc.)",
    tip: "Shared pickup truck taxi on fixed routes. Wave to stop, pay when you exit. No app needed. Negotiate price if going off-route.",
    best: "Reaching areas not covered by BTS/MRT. Very local experience.",
    hours: "6am–8pm typically",
  },
];

export function BangkokPublicTransport() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🚇 Bangkok public transport — complete guide
      </h2>
      <div className="text-[10px] bg-blue-50 rounded-xl p-2.5 mb-3 text-blue-800">
        <strong>Bangkok transport tip:</strong> Combine BTS+MRT for cross-city trips. Use river boat for Old City. Use Grab for anywhere public transit doesn't reach. Avoid taxis in rush hour (7–9am, 5–7pm).
      </div>
      <div className="space-y-2">
        {TRANSPORT.map((t) => (
          <details key={t.name} className="border border-blue-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-blue-50 transition">
              <span className="text-xl shrink-0">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{t.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{t.hours} · {t.coverage}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{t.price}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-blue-100 pt-2 space-y-1">
              <div className="text-[10px] text-orange-600">💡 {t.tip}</div>
              <div className="text-[10px] text-blue-700">⭐ Best for: {t.best}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
