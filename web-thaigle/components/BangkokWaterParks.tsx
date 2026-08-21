const PARKS = [
  {
    name: "Pororo AquaPark Bangkok",
    emoji: "🐧",
    area: "Ramkhamhaeng, East Bangkok",
    price: "Adult ฿700–900, Child ฿500–700",
    why: "Bangkok's newest and most modern water park. Korean-designed Pororo (penguin character) themed. Wave pool, lazy river, slides, kids' zone, toddler area. Indoor and outdoor sections. Excellent for families with children aged 3–12. Air-conditioned rest zones.",
    tip: "Weekdays significantly less crowded. Book tickets online for 10–15% discount. Bring waterproof sandals — ground is hot. Lockers are small: leave big bags at hotel. Grab Food delivery available to park entrance area.",
  },
  {
    name: "Siam Park City",
    emoji: "🎡",
    area: "Khan Na Yao, East Bangkok (about 25 min from city center)",
    price: "Water park ฿550–750; combo tickets include theme park",
    why: "Bangkok's largest entertainment complex. Water park + traditional theme park + go-kart track. Giant wave pool (one of SE Asia's largest), multiple extreme slides, family slides. Been operating for 30+ years so rides are classic rather than cutting-edge but large and reliable.",
    tip: "Combo ticket worth it if going for full day — water park + theme park + go-karts. Take BTS to Min Buri then taxi (20 min). The wave pool operates on schedule (every 30 min, check board). Food inside is reasonably priced. Allow 6–8 hours for full experience.",
  },
  {
    name: "Cartoon Network Amazone Waterpark (Pattaya)",
    emoji: "🏄",
    area: "Pattaya (90 min from Bangkok)",
    price: "Adult ฿1,190–1,590, Child ฿800–990",
    why: "Thailand's premiere water park, 45 minutes from Pattaya. Cartoon Network themed with 35+ rides — extreme slides, wave pools, lazy river, kids areas with cartoon characters. World-class by international standards. Best for water park enthusiasts willing to travel.",
    tip: "Day trip from Bangkok: minivan from Ekkamai BTS ฿120 to Pattaya, then taxi to park. Morning sessions (open to 1pm) sometimes cheaper. Book online — walk-up prices higher. FastPass available for ฿400 extra to skip queues on peak days.",
  },
  {
    name: "Dream World (Water Zone)",
    emoji: "💦",
    area: "Rangsit, North Bangkok (40 min from city)",
    price: "All-inclusive day pass ฿650–900",
    why: "Dream World amusement park includes a water zone. Not a standalone water park but offers water slides + wave pool within the larger theme park. Good value as the day pass includes all rides. Most popular with Thai domestic tourists.",
    tip: "Dream World works best as an all-day theme park experience — rides, shows, water zone. Thai domestic crowd means signage in Thai — staff usually speak enough English. Check Snow Town add-on (indoor snow experience, extra ฿200) — unique experience for Thai heat.",
  },
];

export function BangkokWaterParks() {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
        💦 Water parks near Bangkok — Pororo, Siam Park City & day trips
      </h2>
      <div className="space-y-2">
        {PARKS.map((p) => (
          <div key={p.name} className="border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{p.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{p.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{p.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{p.why}</div>
            <div className="text-[10px] text-blue-700">💡 {p.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
