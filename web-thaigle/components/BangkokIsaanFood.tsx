const DISHES = [
  {
    name: "Som Tam (ส้มตำ)",
    thai: "ส้มตำ",
    emoji: "🌶️",
    desc: "Shredded green papaya salad with lime, palm sugar, chili, fish sauce, tomatoes, long beans, peanuts. The defining Isaan dish.",
    where: "Any Isaan restaurant. Or just the green papaya salad carts on the street (look for the wooden mortar).",
    price: "฿50–80",
    spice: "Ask for 'ped nit noi' (a little spicy) or it may come very spicy.",
  },
  {
    name: "Larb (ลาบ)",
    thai: "ลาบ",
    emoji: "🥗",
    desc: "Minced meat salad (pork, chicken, or beef) with roasted rice powder, dried chili, mint, shallots, lime. Fresh herb-forward.",
    where: "Any Isaan restaurant. Often served in the same bowl with sticky rice.",
    price: "฿60–100",
    spice: "Medium-hot by default. Say 'mai ped' (not spicy) to tame it.",
  },
  {
    name: "Gai Yang (ไก่ย่าง)",
    thai: "ไก่ย่าง",
    emoji: "🐔",
    desc: "Charcoal-grilled chicken marinated in lemongrass, coriander root, garlic. Served with sweet chili or jaew dipping sauce.",
    where: "Any street corner with a rotating chicken on a spit. Look for charcoal smoke.",
    price: "฿80–150/half chicken",
    spice: "Not spicy — dipping sauce is where the heat is.",
  },
  {
    name: "Khao Niao (ข้าวเหนียว)",
    thai: "ข้าวเหนียว",
    emoji: "🟡",
    desc: "Sticky rice. Not a side dish — the MAIN CARB of Isaan cuisine. Roll into balls with your fingers, dip into som tam sauce.",
    where: "Any Isaan restaurant. Also sold in bamboo tubes at markets for ฿10–20.",
    price: "฿10–20 per basket",
    spice: "Not spicy. The perfect neutral base for all the spicy Isaan dishes.",
  },
  {
    name: "Moo Ping (หมูปิ้ง)",
    thai: "หมูปิ้ง",
    emoji: "🍢",
    desc: "Grilled pork skewers marinated in fish sauce, palm sugar, coriander. Street food breakfast of Bangkok.",
    where: "Every morning street food cart from 6–10am. Sold with sticky rice bags.",
    price: "฿10–15 per skewer",
    spice: "Not spicy. Perfect breakfast or anytime snack.",
  },
];

export function BangkokIsaanFood() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🌶️ Isaan cuisine in Bangkok — northeastern Thai food guide
      </div>
      <div className="text-[10px] bg-red-50 rounded-xl p-2.5 mb-3 text-red-800">
        Isaan (northeastern) cuisine is what most Thais eat daily. Spicier, more sour, uses fermented fish sauce (pla ra). Always eaten with sticky rice — hands are fine.
      </div>
      <div className="space-y-2">
        {DISHES.map((d) => (
          <div key={d.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1">
              <span className="text-2xl shrink-0">{d.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{d.name} <span className="text-[var(--muted)] font-normal text-[10px]">{d.thai}</span></div>
                <div className="text-[10px] text-[var(--muted)]">📍 {d.where} · {d.price}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{d.desc}</div>
            <div className="text-[10px] text-orange-600">🌶️ Spice: {d.spice}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
