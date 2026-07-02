const ACCOMMODATION = [
  {
    type: "Hostel (Dorm)",
    emoji: "🛏️",
    range: "฿250–700/night",
    best: "Solo travelers, budget backpackers",
    where: "Khao San Road, Banglamphu, Silom",
    pros: "Meet other travelers instantly. Kitchens, common areas. Luggage storage.",
    cons: "Noise, shared bathrooms, no privacy.",
    top: "Lub d Bangkok Silom (฿500/dorm) — best hostel in Asia multiple years",
  },
  {
    type: "Guesthouse / Budget Hotel",
    emoji: "🏠",
    range: "฿500–1,500/night (private room)",
    best: "Couples, travelers wanting basic privacy",
    where: "Silom, Sukhumvit, Old City",
    pros: "Private room, often includes breakfast, local area feel.",
    cons: "Smaller bathrooms, fewer amenities than hotels.",
    top: "Ibis Bangkok Siam ฿1,200–1,800 — best value/location ratio",
  },
  {
    type: "Airbnb / Serviced Apartment",
    emoji: "🏢",
    range: "฿2,000–8,000/night (full apartment)",
    best: "Families, longer stays (1 week+), groups",
    where: "Sukhumvit, Silom, Ari, Thonglor",
    pros: "Full kitchen, washing machine, more space. Feel like a local.",
    cons: "No daily maid service by default. Check-in process varies.",
    top: "Look for 'superior studio' with pool in Thonglor for ฿2,500–4,000",
  },
  {
    type: "Luxury Hotel",
    emoji: "🏨",
    range: "฿8,000–40,000+/night",
    best: "Honeymoon, anniversary, special occasion",
    where: "Sukhumvit, Riverside, Siam",
    pros: "Pool, gym, concierge, daily housekeeping, 24hr room service.",
    cons: "Price. Many extras charged additionally (breakfast, minibar).",
    top: "Capella Bangkok ฿22,000+ — best luxury hotel. Rosewood ฿18,000+ — second.",
  },
];

export function BangkokSharehouseAirbnb() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🏠 Bangkok accommodation types — which is right for you?
      </div>
      <div className="space-y-2">
        {ACCOMMODATION.map((a) => (
          <details key={a.type} className="border border-[var(--border)] rounded-xl group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 text-xs font-bold text-[var(--fg)] hover:text-blue-700 transition">
              <span className="text-lg shrink-0">{a.emoji}</span>
              <span className="flex-1">{a.type}</span>
              <span className="text-[10px] font-mono text-green-700 shrink-0">{a.range}</span>
              <span className="text-[var(--muted)] group-open:rotate-180 transition text-sm shrink-0">⌄</span>
            </summary>
            <div className="px-3 pb-3 space-y-1.5">
              <div className="text-[10px]"><span className="font-bold">Best for:</span> {a.best}</div>
              <div className="text-[10px]"><span className="font-bold">Where:</span> {a.where}</div>
              <div className="text-[10px] text-green-700">✅ Pros: {a.pros}</div>
              <div className="text-[10px] text-orange-600">⚠️ Cons: {a.cons}</div>
              <div className="text-[10px] text-blue-700">⭐ Try: {a.top}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
