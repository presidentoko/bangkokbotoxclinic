const SPOTS = [
  {
    name: "The Commons (Thong Lo)",
    emoji: "☀️",
    area: "Thong Lo BTS, Sukhumvit 55",
    price: "Brunch items ฿280–600",
    open: "Sat–Sun from 9am (weekday from 7am)",
    why: "Bangkok's most Instagram-friendly brunch complex. Multiple vendors in a beautiful outdoor space. Roast by Villa Market, Roots Coffee, Guss Damn Good ice cream — all premium.",
    tip: "Weekday brunch much quieter. Weekend 10–1pm peak — arrive at 9am to grab a table without waiting. Dog-friendly, stroller-friendly.",
  },
  {
    name: "Rocket Coffeebar",
    emoji: "🚀",
    area: "Sathorn (Soi 12) and Sukhumvit locations",
    price: "Brunch ฿250–490",
    open: "Daily 7am–5pm",
    why: "Bangkok's best brunch eggs. Seriously good eggs benedict, Shakshuka, avocado toast. Specialty coffee. Laid-back Australian café vibe. Where expats eat Saturday morning.",
    tip: "Sathorn branch (S12) is the original and most popular. Get there 8:30am on weekends — by 10am queues form. Their house-baked sourdough is excellent.",
  },
  {
    name: "Gallow Green (Thonglor)",
    emoji: "🌿",
    area: "Thong Lo, Sukhumvit 55",
    price: "Brunch ฿320–580",
    open: "Sat–Sun 9am–3pm",
    why: "Weekend brunch only concept. Garden setting, botanical atmosphere, very good eggs and pancakes. Champagne brunch option. Perfect for celebrating a special morning.",
    tip: "Reserve for weekend — they stop walk-ins after 11am. The green shakshuka (tomatillo-based) is their signature. Free-flow Prosecco brunch ฿990 is worth it for a special occasion.",
  },
  {
    name: "Breakfast Club Bangkok",
    emoji: "🍳",
    area: "Thong Lo, Ekkamai, and Silom locations",
    price: "Brunch ฿220–460",
    open: "Daily 8am–3pm",
    why: "Bangkok's most consistent brunch chain. Big portions, reliable quality, good coffee. Classic eggs all-day — not trendy but dependable. Good for families and groups.",
    tip: "Full English breakfast available — rare in Bangkok. Thong Lo location has a terrace. Weekday mornings quiet and pleasant for working brunch.",
  },
];

export function BangkokBrunchGuide() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🍳 Bangkok brunch spots — where Bangkok eats on weekend mornings
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area} · {s.open}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-yellow-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
