const TIPS = [
  {
    topic: "Grab vs Taxi — When to Use Which",
    emoji: "🚕",
    grab: "Always use Grab for: airport trips, late night, areas you don't know, long distances. Price is fixed, driver comes to you, no negotiation.",
    taxi: "Metered taxi is fine for: known areas, when Grab has surge pricing (rush hour), or when you're at a taxi stand. Always insist on meter.",
    avoid: "Never take unmetered taxis at Suvarnabhumi airport outside the official taxi queue — ฿600–1,200 scam is common.",
  },
  {
    topic: "Grab App Setup",
    emoji: "📱",
    grab: "Download Grab (green icon). Register with Thai SIM or international number. Card or cash both work. GrabPay wallet loads easily.",
    taxi: "Enable location services. Book GrabCar (air-conditioned car), GrabBike (fast but no luggage), GrabExpress (delivery).",
    avoid: "Don't use GrabTaxi type if you want fixed price — it's still metered. Use GrabCar for fixed.",
  },
  {
    topic: "Price Reality Check",
    emoji: "💰",
    grab: "Airport (BKK) to Sukhumvit: ฿350–450 fixed. Sukhumvit to Silom: ฿80–120. Across central Bangkok: ฿60–150.",
    taxi: "Metered taxis: flag fall ฿35, then ฿2/km. Expressway tolls extra (฿45–75). Tip: not expected but ฿20 appreciated.",
    avoid: "Surge pricing 7–9am and 5–7pm can triple prices. Walk to BTS if distance < 1km, wait 30 min, or use BTS.",
  },
  {
    topic: "Communication with Drivers",
    emoji: "🗣️",
    grab: "Grab chat has auto-translate. Drop a pin, type your destination, driver navigates. No Thai needed.",
    taxi: "Show driver the address on your phone in Thai (Google Maps has it). Say 'pai' (go) + show screen. Most helpful: 'pai [place name]'.",
    avoid: "Don't expect English. Hotel names most drivers know. For unknown locations, show Google Maps Thai address on screen.",
  },
];

export function BangkokGrabTips() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🚕 Bangkok taxis & Grab — complete transport guide
      </h2>
      <div className="space-y-2">
        {TIPS.map((t) => (
          <details key={t.topic} className="border border-green-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-green-50 transition">
              <span className="text-xl shrink-0">{t.emoji}</span>
              <div className="font-bold text-xs">{t.topic}</div>
            </summary>
            <div className="px-3 pb-3 border-t border-green-100 pt-2 space-y-1.5">
              <div className="text-[10px] text-green-800 leading-snug"><span className="font-bold">Grab: </span>{t.grab}</div>
              <div className="text-[10px] text-[var(--fg)] leading-snug"><span className="font-bold">Taxi: </span>{t.taxi}</div>
              <div className="text-[10px] text-red-600 leading-snug">⚠️ Avoid: {t.avoid}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
