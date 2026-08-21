const LEVELS = [
  {
    level: "ไม่เผ็ด (mai phet)",
    en: "Not spicy",
    emoji: "😊",
    reality: "Truly no chili. Safe for all. Order this if you have zero heat tolerance.",
    dishes: "Most pad thai (if requested), fried rice (khao pad), most noodle soups",
    tip: "The magic phrase. Say 'mai phet' clearly. Thai cooks understand and respect this request.",
  },
  {
    level: "เผ็ดน้อย (phet noi)",
    en: "A little spicy",
    emoji: "🌶️",
    reality: "Mild by Thai standards. Some Western visitors find this spicy. Very approachable.",
    dishes: "Pad krapao (basil stir-fry, mild version), green curry light",
    tip: "Good starting point. Thai restaurants may interpret this as medium.",
  },
  {
    level: "เผ็ดกลาง (phet klang)",
    en: "Medium spicy",
    emoji: "🌶️🌶️",
    reality: "Real Thai medium. Definitely spicy. Comfortable for regular chili eaters.",
    dishes: "Standard som tam, pad krapao as normally made, red curry",
    tip: "This is what you get if you don't specify. Definitely hot for chili newcomers.",
  },
  {
    level: "เผ็ดมาก (phet mak)",
    en: "Very spicy",
    emoji: "🌶️🌶️🌶️",
    reality: "Thai-level hot. Will make most foreigners sweat. Real capsaicin experience.",
    dishes: "Papaya salad north/Isaan style, larb duck, jungle curry (gaeng pa)",
    tip: "Order with rice and cold drinks. Milk or yogurt helps more than water. Don't try to impress locals — this is genuinely hot.",
  },
];

const RELIEF = [
  "Rice absorbs spice — eat white rice alongside any spicy dish.",
  "Sweet drinks (Thai iced tea, coconut water) more soothing than plain water.",
  "7-Eleven: Yakult ฿10, plain milk ฿20 — keep these handy for street food adventures.",
  "Bread or banana neutralizes heat — local bakeries and fruit stalls everywhere.",
  "Avoid: alcohol makes chili heat more intense, not less.",
];

export function BangkokSpiceLevels() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🌶️ Thai spice level guide — what to order (and how to say it)
      </h2>
      <div className="space-y-2 mb-3">
        {LEVELS.map((l) => (
          <div key={l.level} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{l.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{l.level}</div>
                <div className="text-[10px] text-[var(--muted)]">"{l.en}"</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{l.reality}</div>
            <div className="text-[10px] text-orange-600 mb-0.5">Examples: {l.dishes}</div>
            <div className="text-[10px] text-red-600">💡 {l.tip}</div>
          </div>
        ))}
      </div>
      <div className="border border-red-100 rounded-xl p-3">
        <div className="text-[10px] font-bold text-red-700 mb-1.5">🚒 Spice relief tips</div>
        <ul className="space-y-0.5">
          {RELIEF.map((r, i) => (
            <li key={i} className="text-[10px] text-[var(--fg)] leading-snug flex items-start gap-1.5">
              <span className="text-red-400 shrink-0">•</span>{r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
