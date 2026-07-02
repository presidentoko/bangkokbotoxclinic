const OPTIONS = [
  {
    name: "May Kaidee's Vegetarian Restaurant",
    emoji: "🌱",
    area: "Tanao Road (near Khao San, Rattanakosin)",
    price: "฿100–250/meal",
    type: "Fully vegetarian/vegan Thai",
    why: "Bangkok's most famous vegetarian restaurant since 1989. Thai food adapted to be 100% plant-based. Cooking classes available.",
    must: "Pad Thai tofu version (better than many meat versions), green curry with tofu, massaman curry",
    cert: "Vegetarian-owned, Buddhist philosophy restaurant",
  },
  {
    name: "Broccoli Revolution",
    emoji: "🥦",
    area: "Sukhumvit 49 (Ekkamai BTS area)",
    price: "฿200–500",
    type: "Modern vegan, health-food",
    why: "Bangkok's trendiest vegan restaurant. Excellent burgers, bowls, wraps. Popular with digital nomads and health-conscious expats.",
    must: "Vegan burger (฿280), acai bowl, jackfruit tacos, kombucha",
    cert: "Fully plant-based menu",
  },
  {
    name: "Gin Jay (เจ) Festival Stalls",
    emoji: "🟡",
    area: "Nationwide during Oct/Nov Vegetarian Festival",
    price: "฿30–100/dish — extremely affordable",
    type: "Thai-Chinese vegan (Taoist tradition)",
    why: "During the 9-day Vegetarian Festival (October), Bangkok transforms. Yellow flag stalls everywhere serve meat-free versions of any Thai dish.",
    must: "Yellow-flag stalls (เจ) mark full vegan food. Everything — pad krapao, pad see ew, noodles, curry — vegan versions.",
    cert: "The 'เจ' flag = certified no meat/fish/dairy/garlic/onion",
  },
  {
    name: "Whole Earth Restaurant",
    emoji: "🌍",
    area: "Lang Suan Rd (Chit Lom BTS area)",
    price: "฿250–500",
    type: "Vegetarian-friendly fine dining",
    why: "Elegant vegetarian restaurant with Thai and Indian options. Good for dates or business meals where dietary needs vary.",
    must: "Mushroom mock-meat dishes, Indian dal, lemongrass soup vegan version",
    cert: "Not fully vegan — check specific dishes",
  },
];

const PHRASES = [
  { thai: "กินเจ (gin jay)", en: "I eat vegan (Taoist vegetarian — strictest)" },
  { thai: "ไม่ใส่เนื้อ (mai sai nuea)", en: "Don't add meat" },
  { thai: "ทำได้ไหมโดยไม่มีเนื้อสัตว์ (tham dai mai doi mai mee nuea sat)", en: "Can you make it without any meat?" },
  { thai: "มังสวิรัติ (mang sa wi rat)", en: "Vegetarian" },
];

export function BangkokVeganOptions() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🌱 Bangkok vegan & vegetarian guide — restaurants & phrases
      </div>
      <div className="space-y-2 mb-3">
        {OPTIONS.map((o) => (
          <div key={o.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{o.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{o.type} · {o.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{o.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-orange-600 mb-0.5">⭐ {o.must}</div>
            <div className="text-[10px] text-green-700">✅ {o.cert}</div>
          </div>
        ))}
      </div>
      <div className="border border-green-100 rounded-xl p-3">
        <div className="text-[10px] font-bold text-green-700 mb-1.5">🗣️ Useful Thai phrases for vegans</div>
        <div className="space-y-1">
          {PHRASES.map((p, i) => (
            <div key={i} className="text-[10px] text-[var(--fg)]">
              <span className="font-bold text-green-700">{p.thai}</span> — {p.en}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
