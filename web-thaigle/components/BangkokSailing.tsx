const OPTIONS = [
  {
    name: "Pattaya Sailing Scene",
    emoji: "⛵",
    area: "Pattaya, Gulf of Thailand (2 hrs from Bangkok)",
    price: "Day sail ฿1,500–3,000/person; RYA course ฿8,000–25,000",
    why: "Pattaya is Bangkok's sailing hub — Royal Varuna Yacht Club (est. 1947), Ocean Marina, and several sailing schools operate here. RYA (Royal Yachting Association) Day Skipper and Competent Crew courses run regularly. Pattaya Regattas in March bring international competitors. The Gulf of Thailand's conditions are forgiving for beginners — light chop, warm water, predictable winds.",
    tip: "RYA courses in Pattaya are taught to the same standard as UK courses — the qualification is internationally recognized. Competent Crew (5 days, ฿15,000–25,000) is the entry course — no experience required. Day Skipper adds navigation theory and exam. The Royal Varuna Club social scene is strong — racing crew positions available for those who want to crew competitive boats.",
  },
  {
    name: "Sailing Charters — Day & Sunset",
    emoji: "🌅",
    area: "Pattaya, Hua Hin, Koh Samet day trips",
    price: "Day charter ฿2,500–5,000/person; Private boat ฿20,000–60,000",
    why: "Chartered sailing day trips from Pattaya or Hua Hin — typically a 32–45ft monohull or catamaran with skipper/crew, snorkeling stops, lunch on board. Koh Samet day sail from Pattaya is popular (2-hour sail each way). Island-hopping routes available for multi-day charters. Romantic sunset cruises popular for couples and small groups.",
    tip: "Sailing charter companies in Pattaya: search Facebook for 'Pattaya yacht charter' — most operators post availability daily. Private charter (exclusive use of boat) is economically viable for groups of 6–10. Include snorkeling gear, kayaks, and BBQ on the boat for a full day experience.",
  },
  {
    name: "Gulf Islands Sailing (Koh Chang, Koh Kood)",
    emoji: "🏝️",
    area: "Eastern Gulf islands, 4–6 hours from Bangkok/Pattaya",
    price: "Liveaboard charter ฿8,000–20,000/person/week",
    why: "Multi-day sailing liveaboards in the Eastern Gulf islands (Koh Chang archipelago, Koh Kood) offer one of Thailand's best coastal cruising experiences. The islands are underdeveloped and only properly accessible by private boat. Typically 38–50ft sailboats with 4–8 berths. Best season: October–February NE monsoon brings reliable sailing winds.",
    tip: "Koh Chang sailing charters typically depart from Laem Ngob (near Koh Chang) or Pattaya. Liveaboard sailing is the fastest way to see multiple Thai islands without airport/ferry logistics. For first-time liveaboard guests: bring seasickness medication regardless of how you feel on land — offshore conditions differ from coastal.",
  },
];

export function BangkokSailing() {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-sky-700 mb-3">
        ⛵ Sailing near Bangkok — Pattaya yacht club, RYA courses & Gulf island charters
      </h2>
      <div className="space-y-2">
        {OPTIONS.map((o) => (
          <div key={o.name} className="border border-sky-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{o.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{o.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{o.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-sky-700">💡 {o.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
