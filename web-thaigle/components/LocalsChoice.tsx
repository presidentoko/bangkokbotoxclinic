const PICKS = [
  { category: "Thai food", place: "Any shophouse on soi 38 Thonglor", why: "No sign, plastic chairs, 10/10", emoji: "🍜" },
  { category: "Massage", place: "Wat Pho Traditional Massage School", why: "Government-certified, cheapest legit massage in BKK", emoji: "💆" },
  { category: "Coffee", place: "Any Cafe Amazon on BTS route", why: "30฿, solid, everywhere, open 7am", emoji: "☕" },
  { category: "Street food", place: "Yaowarat (Chinatown) after 6pm", why: "The real food capital — every street is a feast", emoji: "🥟" },
  { category: "Night out", place: "Thonglor rooftop bars", why: "Thais who can afford it go here on weekends", emoji: "🍸" },
  { category: "Weekend escape", place: "Chatuchak Weekend Market 7–12am", why: "Go early before it hits 38°C and tourists arrive", emoji: "🛍️" },
];

export function LocalsChoice() {
  return (
    <div className="my-4 rounded-2xl border border-[var(--border)] bg-white overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <div className="text-sm font-black">🏙️ What locals actually do</div>
        <div className="text-xs text-[var(--muted)]">Not the tourist version</div>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {PICKS.map((p) => (
          <div key={p.category} className="flex items-start gap-3 px-4 py-3">
            <span className="text-lg shrink-0 mt-0.5">{p.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase font-bold text-[var(--muted)]">{p.category}</div>
              <div className="font-bold text-sm">{p.place}</div>
              <div className="text-xs text-[var(--muted)]">{p.why}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
