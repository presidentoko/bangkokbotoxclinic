const SPOTS = [
  {
    area: "Siam Paragon Food Hall",
    emoji: "🍱",
    highlight: "Best Japanese supermarket in Bangkok (Tops Supermarket B1). Japanese grocery + prepared bento.",
    must: "Yamazaki bakery + Japanese deli + sushi counter. Affordable omakase sets ฿250–450.",
    tip: "Best for: solo lunch, authentic Japanese groceries, premium bento.",
  },
  {
    area: "Emporium / EmQuartier",
    emoji: "🍣",
    highlight: "Helix Quartier 5F–8F: largest concentration of premium Japanese restaurants in Bangkok.",
    must: "Kisso Japanese Restaurant (best sashimi), Umi (omakase), Nagiya (ramen), Genki Sushi",
    tip: "Go early for lunch (12–12:30pm) before the Phrom Phong office crowd floods in.",
  },
  {
    area: "Robinhood (Soi Silom 4)",
    emoji: "🍜",
    highlight: "Japanese ramen + izakaya belt on Silom Soi 2–4 — dense cluster of authentic spots.",
    must: "Ryu Ramen (tonkotsu legend), Honda Izakaya (chef trained in Osaka)",
    tip: "Silom Japanese izakayas are popular with Japanese expat workers — most authentic after-work crowd.",
  },
  {
    area: "Klong Toey / Asok",
    emoji: "🎌",
    highlight: "Sukhumvit 21–26 area has Tokyo-level density of Japanese restaurants.",
    must: "Sushi Zo (high-end omakase ฿3,500+), Kanayama Ramen, Menya Itto, Yakiniku Like",
    tip: "Yakiniku Like is solo-BBQ concept from Japan. Individual grill, no group needed. Perfect for solo travelers. ฿180–380/meal.",
  },
];

export function BangkokJapaneseFood() {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
        🇯🇵 Japanese food in Bangkok — where to go
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.area} className="border border-rose-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-xl shrink-0">{s.emoji}</span>
              <div className="font-bold text-xs flex-1">{s.area}</div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">{s.highlight}</div>
            <div className="text-[10px] text-blue-700 mb-0.5">Must try: {s.must}</div>
            <div className="text-[10px] text-orange-600">💡 {s.tip}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[10px] text-[var(--muted)] bg-rose-50 rounded-xl p-2.5">
        Bangkok has 5,000+ Japanese restaurants — second most in Asia after Tokyo. Authentic quality thanks to large Japanese expat community (40,000+ residents).
      </div>
    </div>
  );
}
