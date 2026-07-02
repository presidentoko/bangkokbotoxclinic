const ECO_ACTIVITIES = [
  {
    name: "Mangrove Forest Cycle (Bang Krachao)",
    emoji: "🌿",
    distance: "15 min by boat from Bangkok",
    cost: "Ferry ฿30 each way. Bike rental ฿50–100/half day.",
    why: "Bangkok's 'Green Lung' — 7,000 acres of mangrove forest inside the city. Absolute calm escape from Bangkok.",
    tip: "Rent a bike at the pier + explore 12km of cycling paths. Bangkok Garden (free) inside. Best: weekday morning before tourist surge.",
    season: "Year-round. Avoid midday heat — go 7–10am or 4–6pm.",
  },
  {
    name: "Koh Kret Pottery Island",
    emoji: "🏺",
    distance: "20km north of Bangkok (minibus + ferry)",
    cost: "฿100–200 including ferry",
    why: "Car-free island. Mon Khmer ethnic minority culture. Traditional pottery made by hand for 300 years.",
    tip: "Watch potters at work, buy authentic pieces ฿50–500. Small Buddhist temples + vegetarian restaurants on island. 3hr visit is perfect.",
    season: "Weekend festivals add cultural activities.",
  },
  {
    name: "Organic Farm Visit (Nonthaburi)",
    emoji: "🌱",
    distance: "30–40 min from city center",
    cost: "Tours from ฿800–1,500",
    why: "Bangkok farms using natural methods. Pick your own vegetables, learn about Thai organic agriculture.",
    tip: "Several farms run English tours Sat–Sun. Book via Airbnb Experiences ('Bangkok farm' search).",
    season: "Oct–Feb coolest for outdoor activities.",
  },
  {
    name: "Lumphini Park Dawn Wildlife",
    emoji: "🦎",
    distance: "In the city — Silom MRT",
    cost: "Free",
    why: "Giant monitor lizards, iguanas, cormorants, herons. More wildlife than you'd expect in an urban park.",
    tip: "5:30–7am: bird calls + undisturbed lizards. By 8am the joggers arrive. Bring camera.",
    season: "Year-round. Coolest Oct–Feb.",
  },
];

export function BangkokEcoTourism() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🌿 Bangkok eco-tourism — nature in the city
      </div>
      <div className="space-y-3">
        {ECO_ACTIVITIES.map((a) => (
          <div key={a.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{a.emoji}</span>
              <div>
                <div className="font-bold text-xs">{a.name}</div>
                <div className="text-[10px] text-[var(--muted)]">📍 {a.distance} · {a.cost}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1 leading-snug">{a.why}</div>
            <div className="text-[10px] text-orange-600 mb-0.5">💡 {a.tip}</div>
            <div className="text-[10px] text-green-700">🗓️ {a.season}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
