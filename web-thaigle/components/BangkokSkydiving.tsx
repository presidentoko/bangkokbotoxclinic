const OPTIONS = [
  {
    name: "Fly Station Bangkok (Indoor Skydiving)",
    emoji: "🌪️",
    area: "Central Festival East Ville, Bangna area",
    price: "฿1,200–2,500 per session (2–3 min freefall)",
    why: "Thailand's first indoor skydiving wind tunnel. Experience freefall sensation without jumping from aircraft. 14-foot diameter flight chamber, wind speeds up to 175km/h. Professional instructors, full safety gear provided. Great for beginners and kids (min age 4 years). No experience needed.",
    tip: "Book online — walk-ins accepted but may wait. Wear comfortable fitted clothes (no loose items). Remove jewelry. The 2-minute session feels much longer in the tunnel. Spectator viewing area for non-participants. Videos purchaseable afterward.",
  },
  {
    name: "Tandem Skydiving (Pattaya / Hua Hin)",
    emoji: "🪂",
    area: "Pattaya (1.5 hrs from Bangkok), Hua Hin (2.5 hrs)",
    price: "฿13,000–19,500 tandem jump; GoPro video extra ฿3,000",
    why: "Actual aircraft jumping over Thailand's coastline. Altitude 10,000–14,000 ft. Tandem with instructor — no prior experience required. Views include Thai coastline, ocean, and countryside from freefall. Sky Divine (Pattaya) and Thai Sky Adventures (Hua Hin) are the main operators.",
    tip: "Book at least 1 week ahead (training required same day). Must be 18+, under 100kg. Weather-dependent — will reschedule if overcast (you need visibility for the jump). The 60-second freefall plus parachute ride down is a distinct experience from the wind tunnel. Not recommended for those with back/neck issues.",
  },
  {
    name: "Paragliding Near Bangkok",
    emoji: "🪁",
    area: "Khao Yai / Pak Chong area (3 hrs from Bangkok)",
    price: "฿2,500–5,000 tandem flight (20–40 min)",
    why: "Tandem paragliding over Khao Yai National Park and countryside. More serene than skydiving — float rather than freefall. Views of jungle, rice paddies, mountains. Thermal-based flight dependent on weather and season. November–May is best season for paragliding conditions.",
    tip: "Best operators base out of Pak Chong town (Khao Yai gateway). Day trip from Bangkok possible. Must be under 100kg. Tandem means you sit in front, instructor controls the glider from behind. Photos taken by instructor on request.",
  },
];

export function BangkokSkydiving() {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-sky-700 mb-3">
        🪂 Skydiving & aerial experiences near Bangkok
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
