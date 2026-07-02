const REGIONS = [
  {
    region: "Central Thai (Bangkok style)",
    emoji: "🏙️",
    dishes: ["Pad Thai (ผัดไทย)", "Tom Yum Kung (ต้มยำกุ้ง)", "Green Curry (แกงเขียวหวาน)", "Massaman Curry (แกงมัสมั่น)"],
    taste: "Balanced — not too spicy, mild sweetness, coconut-forward. Most approachable for first-timers.",
    where: "Any restaurant in Bangkok — this is home territory.",
    tip: "Central Thai food is what most foreigners think of as 'Thai food.' Good starting point.",
  },
  {
    region: "Northern Thai (Lanna)",
    emoji: "🏔️",
    dishes: ["Khao Soi (ข้าวซอย) — curry noodle soup", "Nam Prik Ong (chili dip with pork)", "Sai Oua (Northern sausage)", "Larb Moo Dip (raw pork salad)"],
    taste: "Herbal, mild, uses turmeric and dried spices. Less coconut than central. Very unique character.",
    where: "Northern Thai restaurants — find 'Chiang Mai cuisine' or 'Lanna food' restaurants in Bangkok.",
    tip: "Khao Soi is available at many Bangkok restaurants. The best is at Tha Chang night market.",
  },
  {
    region: "Northeastern (Isaan)",
    emoji: "🌶️",
    dishes: ["Som Tam (ส้มตำ) — papaya salad", "Larb (ลาบ) — minced meat salad", "Gai Yang (ไก่ย่าง) — grilled chicken", "Sticky Rice (ข้าวเหนียว)"],
    taste: "Spicy, sour, fermented fish sauce (pla ra). Boldest flavors. Eaten with sticky rice.",
    where: "Isaan restaurants throughout Bangkok. Look for สไตล์อีสาน sign. Very popular with Thais.",
    tip: "Order som tam 'Thai' style (with shrimp paste) or 'Thai Phoo' (without fermented fish) if sensitivity. Always order sticky rice.",
  },
  {
    region: "Southern Thai",
    emoji: "🌴",
    dishes: ["Gaeng Tai Pla (fermented fish curry)", "Khua Kling (dry curry — very spicy)", "Khao Mok Gai (chicken biryani)", "Satay (สะเต๊ะ)"],
    taste: "Spiciest region. Turmeric-heavy, strong shrimp paste base. Halal influence in south.",
    where: "Southern Thai restaurants — look for 'Pak Tai' or 'cuisine du sud' labels. Rarer in Bangkok.",
    tip: "Warn the kitchen 'ped nit noi' (a little spicy) for Southern food — their baseline is 3x spicier than Central Thai.",
  },
];

export function BangkokThaiCuisineRegional() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🍛 Thai cuisine by region — what to eat and where to find it
      </div>
      <div className="space-y-2">
        {REGIONS.map((r) => (
          <details key={r.region} className="border border-orange-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-orange-50 transition">
              <span className="text-xl shrink-0">{r.emoji}</span>
              <div className="font-bold text-xs">{r.region}</div>
            </summary>
            <div className="px-3 pb-3 border-t border-orange-100 pt-2 space-y-1.5">
              <div className="flex flex-wrap gap-1">
                {r.dishes.map((d) => (
                  <span key={d} className="text-[9px] bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded-full">{d}</span>
                ))}
              </div>
              <div className="text-[10px] text-[var(--fg)] leading-snug">🎨 Flavor: {r.taste}</div>
              <div className="text-[10px] text-[var(--muted)]">📍 {r.where}</div>
              <div className="text-[10px] text-orange-600">💡 {r.tip}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
