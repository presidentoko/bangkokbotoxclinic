const SPOTS = [
  { emoji: "🌅", name: "Wat Arun sunrise", district: "Thonburi", tip: "Arrive before 6:30am. Opposite bank from Wat Pho.", url: "/for/views" },
  { emoji: "🌃", name: "Vertigo Rooftop", district: "Silom", tip: "Best shot: order one drink, golden hour from the edge.", url: "/for/views" },
  { emoji: "🏮", name: "Chinatown at night", district: "Yaowarat", tip: "Neon signage + street food smoke = perfect backdrop.", url: "/restaurants/bangkok/chinatown" },
  { emoji: "🏛️", name: "Jim Thompson House", district: "Ratchathewi", tip: "Bougainvillea courtyard — morning light is magical.", url: "/activities" },
  { emoji: "🌸", name: "Benchakitti Forest Park", district: "Ratchadaphisek", tip: "New park, rarely crowded, stunning in late afternoon light.", url: "/activities" },
  { emoji: "☕", name: "Ari café strip", district: "Phahonyothin", tip: "Local cafés with lush greenery — Instagram without the crowds.", url: "/restaurants/bangkok/ari" },
];

export function InstagramSpots() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-pink-50 p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        📸 Most photographed in Bangkok
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        {SPOTS.map((s) => (
          <a
            key={s.name}
            href={s.url}
            className="flex items-start gap-3 p-3 rounded-xl bg-white border border-pink-200 hover:border-pink-400 hover:bg-pink-100 transition group"
          >
            <span className="text-xl shrink-0 leading-none mt-0.5">{s.emoji}</span>
            <div className="min-w-0">
              <div className="text-xs font-bold text-pink-900 group-hover:text-pink-700 transition truncate">{s.name}</div>
              <div className="text-[10px] text-pink-600 font-medium">{s.district}</div>
              <div className="text-[10px] text-pink-800 opacity-80 leading-snug mt-0.5">{s.tip}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
