const EVENTS = [
  {
    name: "W Bangkok Wet Deck (Weekend Pool Party)",
    emoji: "💦",
    area: "W Bangkok Hotel, Silom",
    time: "Saturday & Sunday daytime events (check W Bangkok events page)",
    price: "Day pass ฿1,500–3,500 (includes drink credit)",
    why: "Bangkok's most famous pool party venue. W Hotel's rooftop Wet Deck pool hosts branded events, DJ sets, and day parties with skyline views. Music ranges from chill house to commercial EDM. Instagram-optimized environment. International party crowd.",
    tip: "Book tickets online — day passes sell out. Poolside cabanas (฿4,000–12,000 minimum spend) include premium service. Best time: arrive 2–3pm when music peaks and crowd is most active. Smart party attire required for hotel entrance. Cover charge may apply for peak events.",
  },
  {
    name: "Movenpick Hotel Bangkok Pool Day",
    emoji: "🌊",
    area: "Movenpick Hotel, Sukhumvit",
    time: "Weekends 10am–8pm",
    price: "Day pass ฿1,000–2,000 (F&B credit included)",
    why: "More relaxed than W Bangkok — good for groups who want pool access without full EDM party energy. Infinity pool with city views, comfortable loungers, quality F&B. Professional pool service. Popular with hotel guests but open to walk-ins for day pass.",
    tip: "Weekday access often available at lower rates — great value if schedule is flexible. Kids allowed at certain hours (check policy). Sunscreen essential on rooftop — UV index in Bangkok regularly 8–11+. Request poolside shade lounge if available.",
  },
  {
    name: "Private Villa Pool Party (Airbnb)",
    emoji: "🏡",
    area: "Bangkok suburbs: Bangna, Pinklao, Nonthaburi",
    time: "Book by the day",
    price: "Villa: ฿8,000–40,000/day; catering additional",
    why: "The most private Bangkok pool party option. Rent an entire villa with pool. Invite your own guests, your own music, your own food. No hotel rules about hours or guest counts. Best for groups 8–30 people who want genuine party atmosphere without public venue restrictions.",
    tip: "MUST confirm: does the villa allow events? Some Airbnb hosts decline parties — read listing carefully. Ask host explicitly: 'Can we host a birthday party with 15 guests?' Also confirm: pool heating (rare in Bangkok, unnecessary), sound system available, parking.",
  },
];

export function BangkokPoolParty() {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-cyan-700 mb-3">
        💦 Pool parties in Bangkok — W Wet Deck, hotel day passes & private villas
      </div>
      <div className="space-y-2">
        {EVENTS.map((e) => (
          <div key={e.name} className="border border-cyan-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{e.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{e.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{e.time} · {e.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{e.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{e.why}</div>
            <div className="text-[10px] text-cyan-700">💡 {e.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
