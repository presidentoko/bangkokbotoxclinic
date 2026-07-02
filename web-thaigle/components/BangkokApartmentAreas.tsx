const AREAS = [
  {
    name: "Sukhumvit (Soi 1–55)",
    emoji: "🌆",
    priceRange: "Studio ฿8,000–30,000/month, 1BR ฿15,000–60,000",
    vibe: "Expat central, party zone, international food, nightlife",
    pros: "Best BTS coverage. Everything walkable. Most international restaurants and bars.",
    cons: "Noisy especially Soi 11 area. Expensive vs other areas. Traffic worst in Bangkok.",
    best: "First-timers in Bangkok. Short-term 1–3 months. Business expats with company housing allowance.",
    bts: "Nana, Asok, Phrom Phong, Thong Lo, Ekkamai (multiple BTS stops)",
  },
  {
    name: "Silom / Sathorn",
    emoji: "💼",
    priceRange: "Studio ฿9,000–25,000, 1BR ฿16,000–50,000",
    vibe: "Business district, calmer than Sukhumvit, riverside proximity",
    pros: "CBD location. Good value vs Sukhumvit. Excellent BTS + MRT. Quieter on weekends.",
    cons: "Weekend dead zone — businesses close. Less residential vibe.",
    best: "Business expats working in Silom area. Those wanting central location without tourist-zone noise.",
    bts: "Sala Daeng (BTS), Silom (MRT)",
  },
  {
    name: "Ari / Phahonyothin",
    emoji: "🌳",
    priceRange: "Studio ฿7,000–18,000, 1BR ฿12,000–35,000",
    vibe: "Local Thai neighborhood, cafés, markets, creative types",
    pros: "Genuine Bangkok neighborhood life. Amazing café culture. More affordable. Less touristy.",
    cons: "Less central. Need BTS or Grab for most destinations. Less English spoken.",
    best: "Longer-term residents (3+ months). Those wanting authentic Bangkok experience. Creative professionals.",
    bts: "Ari BTS, Saphan Khwai BTS",
  },
  {
    name: "Phra Khanong / On Nut",
    emoji: "🏘️",
    priceRange: "Studio ฿5,500–14,000, 1BR ฿9,000–25,000",
    vibe: "Thai residential, affordable, rapidly developing, good value",
    pros: "Best value along BTS Sukhumvit line. Tesco Lotus + Big C for shopping. Increasing cafe/restaurant options.",
    cons: "30 min to downtown by BTS. Less expat infrastructure.",
    best: "Budget-conscious expats. Longer stays. Those working from home or at nearby companies.",
    bts: "Phra Khanong, On Nut (BTS)",
  },
];

export function BangkokApartmentAreas() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        🏙️ Bangkok neighborhoods to rent — expat & long-stay guide
      </div>
      <div className="space-y-2">
        {AREAS.map((a) => (
          <details key={a.name} className="border border-blue-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-blue-50 transition">
              <span className="text-2xl shrink-0">{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{a.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{a.vibe}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700 max-w-[100px] text-right">{a.priceRange}</span>
            </summary>
            <div className="px-3 pb-3 border-t border-blue-100 pt-2 space-y-1">
              <div className="text-[10px] text-green-700">✅ Pros: {a.pros}</div>
              <div className="text-[10px] text-orange-500">⚠️ Cons: {a.cons}</div>
              <div className="text-[10px] text-blue-700">👤 Best for: {a.best}</div>
              <div className="text-[10px] text-[var(--muted)]">🚇 {a.bts}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
