const VENUES = [
  {
    name: "BITEC (Bangkok International Trade & Exhibition Centre)",
    emoji: "🏛️",
    area: "Bang Na, East Bangkok",
    price: "Venue from ฿80,000/day; Full-service packages ฿200,000+",
    why: "Bangkok's largest exhibition and conference center. 170,000 sqm. Hosts international trade shows, conventions, corporate summits. Multiple halls configurable for 100–50,000 delegates. Professional AV, catering, event management services.",
    tip: "For large events (500+ attendees), BITEC is the standard. On-site event management team available. Good for international conferences requiring MICE infrastructure. Bang Na location means airport transfers are straightforward (20 min from Suvarnabhumi).",
  },
  {
    name: "IMPACT Arena & Exhibition Hall",
    emoji: "🎪",
    area: "Muang Thong Thani, Nonthaburi",
    price: "Exhibition halls from ฿60,000/day",
    why: "Thailand's largest integrated convention center complex. 140,000 sqm. Theater, arena, exhibition halls, conference rooms, outdoor venues all in one complex. Free shuttle from MRT stations. Hotels on-site. Better for large gala dinners + conference combinations.",
    tip: "Challenger Hall is most versatile — good for award ceremonies, product launches, gala dinners for 300–2,000 pax. IMPACT has on-site AV and F&B vendor partnerships. Shuttle from MRT Muang Thong Thani. Accommodation options adjacent.",
  },
  {
    name: "Hotel Ballrooms (Luxury Tier)",
    emoji: "👔",
    area: "Sukhumvit, Sathorn, Riverside — many options",
    price: "Ballrooms from ฿50,000–400,000 minimum spend",
    why: "Bangkok's 5-star hotels offer ballrooms and conference facilities with full-service MICE teams. Mandarin Oriental, Centara Grand, Anantara Siam, JW Marriott. Professional event managers, catering, AV all in-house. Best for high-impression corporate events 50–500 pax.",
    tip: "Centara Grand at CentralWorld has the most flexible ballroom (connects to mall). For riverside dinner events: Mandarin Oriental or Shangri-La terraces are unbeatable. Negotiate F&B minimum rather than room hire fee — better value. Request site inspection before committing.",
  },
  {
    name: "Creative Event Spaces (Non-Traditional)",
    emoji: "🎨",
    area: "Various Bangkok neighborhoods",
    price: "From ฿15,000–100,000 depending on space and services",
    why: "Bangkok has a growing ecosystem of creative event spaces: industrial warehouses in Ratchaphruek, gallery spaces in Sathorn, rooftop terraces in Thonglor. For product launches, team offsites, brand events where 'different' matters. Spaces like WAREHOUSE 30, The 90s House, River Vibe.",
    tip: "Creative spaces require coordinating your own AV, catering, decor separately — add-on cost and effort vs hotel packages. But the uniqueness is worth it for brand events. Event management companies in Bangkok can handle logistics even if you book the space directly.",
  },
];

const TIPS = [
  "MICE visa: Thailand has a special MICE visa for conference attendees — inform international guests",
  "Best corporate event season: November–February (cool season, lower humidity, better outdoor events)",
  "Mandatory cost: AV and lighting production is expensive in Bangkok — budget ฿30,000+ per event",
  "Team dinner: private restaurant rooms generally cheaper and more intimate than hotel ballrooms",
  "Outdoor Bangkok events: always have indoor backup plan (sudden rain possible year-round)",
];

export function BangkokCorporateEvents() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-slate-700 mb-3">
        🏢 Corporate events in Bangkok — MICE venues, conferences & team events
      </h2>
      <div className="space-y-2 mb-3">
        {VENUES.map((v) => (
          <div key={v.name} className="border border-slate-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{v.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{v.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{v.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{v.why}</div>
            <div className="text-[10px] text-slate-600">💡 {v.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-slate-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-slate-700 hover:bg-slate-50">
          Bangkok MICE planning tips
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {TIPS.map((t) => (
            <li key={t} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-slate-400 shrink-0">•</span>{t}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
