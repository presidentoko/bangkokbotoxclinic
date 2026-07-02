const BREAKFASTS = [
  {
    hotel: "Chatrium Hotel Riverside",
    type: "Sunday Champagne Brunch",
    price: "฿1,800/person including champagne",
    highlights: "Best-value luxury Sunday brunch in Bangkok. River views, champagne pouring, live jazz, extensive international and Thai stations.",
    when: "Sunday 11am–2:30pm only",
    tip: "Book online at chatrium.com. Most popular table is river-facing. Champagne is included — pace yourself from the start.",
  },
  {
    hotel: "Mandarin Oriental Bangkok",
    type: "The Verandah Weekend Brunch",
    price: "฿4,500–5,500/person",
    highlights: "The most prestigious Sunday brunch address in Bangkok. River-facing terrace, heritage building, perfect service, Mandarin Oriental quality.",
    when: "Sat–Sun 11am–3pm",
    tip: "Reserve 2–3 weeks ahead. The 'Author's Lounge' afternoon tea is a lower-cost option (฿1,200) if brunch is too expensive.",
  },
  {
    hotel: "Capella Bangkok Breakfast",
    type: "Daily breakfast (in-hotel)",
    price: "฿1,200–1,800/person (or included in room)",
    highlights: "Bangkok's most elegant breakfast service. The river views from their breakfast area are unparalleled. Freshly made-to-order Thai and international options.",
    when: "Daily 6:30am–10:30am",
    tip: "Guests get breakfast included at high-category rates. Non-guests can pay at door. Worth the experience once.",
  },
  {
    hotel: "Budget Thai Hotel Breakfast",
    type: "Basic Thai morning spread (local hotels)",
    price: "Included or ฿100–200/person",
    highlights: "Khao tom (rice congee), soft-boiled eggs, fried eggs, toast, fresh fruit. Simple but satisfying and very Thai.",
    when: "Daily 6am–9am typically",
    tip: "Mid-range Thai hotels (฿1,500–3,000/night) often have surprisingly good included breakfasts. Much better value than international chain hotel add-on breakfasts.",
  },
];

export function BangkokHotelBreakfast() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🍳 Bangkok hotel breakfast guide — from budget to luxury brunch
      </div>
      <div className="space-y-2">
        {BREAKFASTS.map((b) => (
          <div key={b.hotel} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-lg shrink-0">🏨</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{b.hotel}</div>
                <div className="text-[10px] text-[var(--muted)]">{b.type} · {b.when}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{b.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{b.highlights}</div>
            <div className="text-[10px] text-amber-700">💡 {b.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
