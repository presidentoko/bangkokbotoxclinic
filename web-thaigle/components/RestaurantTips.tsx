const TIPS = [
  {
    emoji: "🌶️",
    title: "Spice levels",
    body: "Tell them 'mai phet' (not spicy) upfront. 'Phet nit noi' means a little. 'Phet mak' = very spicy. Servers will give you tourist-level spice if you say nothing.",
  },
  {
    emoji: "🍜",
    title: "Shared dishes, Thai-style",
    body: "Thai meals are family-style. Order 2–3 dishes for 2 people with rice. Don't order individual dishes expecting a full plate.",
  },
  {
    emoji: "💳",
    title: "Cash vs card",
    body: "Street food and local spots: cash only. Malls and hotels: card OK. 1,000 baht bills not always broken at street stalls — carry 20–100 baht notes.",
  },
  {
    emoji: "🕐",
    title: "Peak hours",
    body: "Bangkok lunch rush is 12–1:30pm, dinner 6:30–8pm. Arrive 15 min before for top spots. Most good street food closes by 9pm.",
  },
  {
    emoji: "🪑",
    title: "No reservations (mostly)",
    body: "Most local places don't take reservations. High-end spots do — book through their website or Line app. Walk-in wait at popular spots is 15–30 min.",
  },
  {
    emoji: "🐾",
    title: "Street dogs at stalls",
    body: "Normal to see dogs near street stalls. They're generally harmless and fed by vendors. Don't worry — the food prep area stays clean.",
  },
];

export function RestaurantTips() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🍽️ Bangkok restaurant know-how
      </div>
      <div className="grid grid-cols-2 gap-2">
        {TIPS.map((t) => (
          <div key={t.title} className="bg-white rounded-xl p-3 border border-amber-100">
            <div className="flex items-center gap-1.5 mb-1">
              <span>{t.emoji}</span>
              <span className="text-xs font-bold">{t.title}</span>
            </div>
            <div className="text-[11px] text-[var(--muted)] leading-snug">{t.body}</div>
          </div>
        ))}
      </div>
      <a
        href="/restaurants"
        className="mt-3 block text-center text-xs font-bold text-amber-700 border border-amber-300 bg-amber-100 rounded-full py-1.5 hover:bg-amber-200 transition"
      >
        Find Bangkok restaurants by Trust Score →
      </a>
    </div>
  );
}
