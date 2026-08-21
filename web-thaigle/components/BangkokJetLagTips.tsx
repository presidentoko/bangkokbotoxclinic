const TIPS = [
  {
    phase: "Landing at Suvarnabhumi",
    emoji: "✈️",
    tip: "Don't sleep in the taxi. Force yourself to Thai local time immediately. Bangkok airport has 24hr food courts — eat if you're hungry, then get sunlight.",
    action: "Get to your hotel, dump bags, go find an outdoor café with natural light.",
  },
  {
    phase: "First Afternoon (Day 1)",
    emoji: "☀️",
    tip: "Lumpini Park or Chatuchak Weekend Market (if weekend). Walking in sunlight resets your circadian rhythm faster than anything else.",
    action: "Walk 1–2 hours outdoors. Eat Thai food at lunch — lighter meal than you think you want.",
  },
  {
    phase: "First Night",
    emoji: "🌙",
    tip: "Don't go to bed before 10pm local time, even if exhausted. Short rest in afternoon okay (max 20 min). Melatonin 0.5–1mg at 9pm helps.",
    action: "Evening street food walk (Yaowarat or Sukhumvit 38 area). Tires you out and gives you daylight → dark transition.",
  },
  {
    phase: "Day 2 Mornings",
    emoji: "🌅",
    tip: "You'll wake at 4–5am for the first few days. Don't fight it. Sunrise at Wat Arun or Lumpini Park dawn walk is spectacular at 6am.",
    action: "Wat Arun sunrise ferry (Pier 8 from Saphan Taksin) — other tourists are asleep, you have it mostly to yourself.",
  },
  {
    phase: "Caffeine Strategy",
    emoji: "☕",
    tip: "Thai iced coffee (oliang) hits differently — very strong. Limit to before 2pm or you'll be wired at midnight. Coconut water and fresh juice help hydration.",
    action: "Roots Coffee early morning, switch to coconut water after 2pm, Singha beer (low ABV) in the evening if you drink.",
  },
];

export function BangkokJetLagTips() {
  return (
    <div className="rounded-2xl border border-indigo-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-indigo-700 mb-3">
        😴 Jet lag in Bangkok — how to recover fast
      </h2>
      <div className="text-[10px] bg-indigo-50 rounded-xl p-2.5 mb-3 text-indigo-800">
        Bangkok is <strong>GMT+7</strong>. Coming from Europe: +6–7hrs behind. From US West Coast: +14–15hrs. Worst jet lag is usually from Pacific crossings. Recovery time: 2–3 days typically.
      </div>
      <div className="space-y-1.5">
        {TIPS.map((t) => (
          <div key={t.phase} className="border border-indigo-100 rounded-xl px-3 py-2 flex items-start gap-2">
            <span className="text-xl shrink-0">{t.emoji}</span>
            <div>
              <div className="font-bold text-[11px] mb-0.5">{t.phase}</div>
              <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{t.tip}</div>
              <div className="text-[10px] text-orange-600">→ {t.action}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
