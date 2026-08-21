const SPAS = [
  {
    name: "Yunomori Onsen & Spa",
    emoji: "♨️",
    area: "A-Square Mall, Sukhumvit 26",
    price: "Onsen entry ฿650 (weekday) / ฿750 (weekend). Massage add-ons from ฿600.",
    why: "Bangkok's most authentic Japanese-style public onsen. Multiple bath types: jet bath, herbal bath, outdoor bath, sauna, salt sauna, steam room. Genuine Japanese bathing culture experience.",
    tip: "Bring swimwear or rent at reception (฿50). Salt sauna is the most unusual experience — spend 15 min then shower. Weekday 10am–3pm least crowded. Couples can use mixed-gender areas.",
    duration: "2–3 hours recommended",
  },
  {
    name: "Mee Hoo Onsen",
    emoji: "🌿",
    area: "Sukhumvit Soi 20",
    price: "Onsen ฿550 (weekday), traditional Thai massage ฿400–600",
    why: "Bangkok's cosiest onsen. Smaller, more intimate than Yunomori. Outdoor onsen bath in garden setting. Mineral-infused water imported from Japan. Good combination with Thai massage.",
    tip: "Smaller space = no crowding on weekdays. The outdoor bath at night is particularly atmospheric. Reservations recommended for weekend evenings. Book bath + massage package for best value.",
    duration: "1.5–2 hours",
  },
  {
    name: "Divana Virtue Spa",
    emoji: "🌸",
    area: "Sukhumvit Soi 25",
    price: "Signature treatments ฿2,800–4,500 (2+ hours)",
    why: "Award-winning Thai spa — multiple 'World's Best Spa' awards. Thai ingredients (jasmine, lemongrass, kaffir lime) in every treatment. Traditional Thai healing techniques combined with modern comfort.",
    tip: "Book 'Thai Journey' package (3 hours, ฿3,900) for the full experience. Arrive 30 minutes early to use steam room and hydrotherapy pre-treatment. Best spa for genuine Thai wellness philosophy.",
    duration: "2–3 hours",
  },
];

export function BangkokOnsenSpa() {
  return (
    <div className="rounded-2xl border border-teal-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-teal-700 mb-3">
        ♨️ Onsen & luxury spas in Bangkok — bathing culture & wellness
      </h2>
      <div className="space-y-2">
        {SPAS.map((s) => (
          <div key={s.name} className="border border-teal-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area} · {s.duration}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-teal-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
