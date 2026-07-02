const SPOTS = [
  {
    name: "Sustaina",
    emoji: "🥗",
    area: "Thonglor Soi 17",
    price: "฿200–450",
    type: "Organic / health-conscious",
    must: "Power salad bowl, quinoa wraps, cold-pressed juices, organic turmeric latte",
    why: "Bangkok's most serious health food restaurant. All organic sourcing, no refined sugar, macro-friendly menu.",
    hours: "Mon–Sat 8am–8pm",
  },
  {
    name: "Grab A Bite",
    emoji: "🥙",
    area: "Sathorn / Silom business district",
    price: "฿150–350",
    type: "Clean eating / fitness-focused",
    must: "Protein boxes, grilled chicken wraps, fitness meal preps (order weekly subscription)",
    why: "Most popular with Bangkok gym crowd. Macros listed on menu. Meal prep subscription available. Fast delivery.",
    hours: "Daily 10am–8pm",
  },
  {
    name: "Farm Kasetsart Produce Market",
    emoji: "🌱",
    area: "Kasetsart University (Mo Chit), also Chatuchak Sat/Sun",
    price: "฿50–200 (produce + ready-to-eat)",
    type: "Organic farmers market",
    must: "Organic salad bags, brown rice with seasonal vegetables, fresh herbal drinks",
    why: "Best organic produce direct from Thai farms. Excellent value. Saturday organic market. Thai grandma's health cooking.",
    hours: "Sat–Sun 7am–1pm",
  },
  {
    name: "Nourish Bangkok",
    emoji: "✨",
    area: "Ekkamai BTS",
    price: "฿250–500",
    type: "Wellness café",
    must: "Adaptogen lattes, açaí bowls, detox smoothies, Buddha bowls",
    why: "Bangkok's most Instagram-friendly health café. Genuinely nutritious, not just pretty. Excellent smoothie quality.",
    hours: "Daily 8am–7pm",
  },
];

export function BangkokHealthFood() {
  return (
    <div className="rounded-2xl border border-lime-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-lime-700 mb-3">
        🥗 Healthy & organic food in Bangkok
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-lime-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.type} · {s.area} · {s.hours}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-600">⭐ Order: {s.must}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
