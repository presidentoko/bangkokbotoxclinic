const SPOTS = [
  {
    name: "Khao Tom Pratunam (24-hour legend)",
    emoji: "🌙",
    area: "Pratunam market area",
    price: "Rice congee set ฿60–120",
    why: "Bangkok's most famous late-night khao tom (rice soup). Open 24 hours since 1965. Chinese-Thai style congee with pork, seafood, or century egg. Extremely popular 11pm–3am.",
    tip: "Order the 'khao tom set' (฿70) — rice soup + side dishes. Add a raw egg to stir in. Century egg (kai yiao ma) is essential, not optional. Best at 1–2am when atmosphere is peak.",
    type: "Chinese-Thai rice soup (khao tom) — thin, silky, fragrant",
  },
  {
    name: "Jok Prince (Silom original)",
    emoji: "👑",
    area: "Silom area",
    price: "Jok ฿50–80",
    why: "Bangkok's most famous jok (thick rice porridge) vendor. Pork meatballs, liver, century egg, ginger, scallions. Thai-style jok is thicker than Chinese congee — almost like cream of rice.",
    tip: "Jok is traditionally a breakfast food (5–11am). Order extra ginger and white pepper. The raw egg stirred in adds richness. Queue forms early — arrive by 7am on weekends.",
    type: "Thai jok — thick rice porridge, breakfast food",
  },
  {
    name: "Yod Tan (Thai-Chinese Morning Shop)",
    emoji: "☀️",
    area: "Yaowarat / Chinatown",
    price: "Congee ฿60–100",
    why: "Traditional Yaowarat-style open-shop rice porridge. Watch the huge woks simmering all night. Fish congee (khao tom pla) is the specialty — whole fish steamed in the porridge.",
    tip: "Chinatown area has the most authentic 24-hour congee spots. Fish congee with ginger and sesame oil is the most Thai-Chinese dish you can try. Eat with the provided dipping sauces.",
    type: "Cantonese-influenced fish congee",
  },
];

export function BangkokKhaoTom() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-neutral-700 mb-3">
        🍚 Bangkok rice porridge (khao tom & jok) — where locals go
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-neutral-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.type} · {s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-neutral-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
