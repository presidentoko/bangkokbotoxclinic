const SPOTS = [
  {
    name: "Broccoli Revolution",
    emoji: "🥦",
    area: "Sukhumvit 49",
    type: "Restaurant",
    why: "Bangkok's most-loved plant-based restaurant. Burgers, bowls, smoothies. Fully vegan menu.",
    cost: "฿฿",
  },
  {
    name: "May Veggie Home",
    emoji: "🌿",
    area: "Phaya Thai (near BTS)",
    type: "Restaurant",
    why: "Long-running vegan Thai restaurant. Authentic Thai dishes, no fish sauce. Very affordable.",
    cost: "฿",
  },
  {
    name: "Veganerie Concept",
    emoji: "🌱",
    area: "Various branches (Siam, Ekkamai)",
    type: "Café & restaurant",
    why: "Western-style vegan café. Great for brunch. Multiple locations across Bangkok.",
    cost: "฿฿",
  },
  {
    name: "J Festival restaurants (September)",
    emoji: "🟡",
    area: "Citywide (yellow flag = vegetarian/vegan)",
    type: "Seasonal",
    why: "During the annual 9-day Taoist festival, thousands of restaurants go fully vegan. Yellow flags mark participating restaurants.",
    cost: "฿",
  },
];

const PHRASES = [
  { thai: "ไม่กินเนื้อ", roman: "Mai gin neua", meaning: "I don't eat meat" },
  { thai: "ไม่ใส่น้ำปลา", roman: "Mai sai nam pla", meaning: "No fish sauce" },
  { thai: "ไม่ใส่กะปิ", roman: "Mai sai gapi", meaning: "No shrimp paste" },
  { thai: "เป็นมังสวิรัติ", roman: "Pen mangsa-wi-rat", meaning: "I'm vegetarian" },
  { thai: "กินเจ", roman: "Gin jae", meaning: "Vegan (strict Buddhist)" },
];

export function BangkokVeganGuide() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🌱 Vegan & vegetarian in Bangkok
      </div>
      <div className="space-y-2 mb-3">
        {SPOTS.map((s) => (
          <div key={s.name} className="flex gap-3 border border-green-100 rounded-xl p-3">
            <span className="text-2xl shrink-0">{s.emoji}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="font-bold text-xs">{s.name}</span>
                <span className="text-[10px] font-mono text-green-700">{s.cost}</span>
              </div>
              <div className="text-[10px] text-[var(--muted)] mb-0.5">📍 {s.area} · {s.type}</div>
              <div className="text-[10px] text-[var(--fg)] leading-snug">{s.why}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs font-black mb-2">Key phrases for vegans</div>
      <div className="space-y-1">
        {PHRASES.map((p) => (
          <div key={p.roman} className="flex items-center justify-between border border-[var(--border)] rounded-lg px-2.5 py-1.5">
            <div>
              <span className="text-xs font-mono font-bold">{p.roman}</span>
              <span className="text-[10px] text-[var(--muted)] ml-2">{p.meaning}</span>
            </div>
            <span className="text-[10px] text-[var(--muted)] font-mono">{p.thai}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-amber-700 bg-amber-50 rounded-xl p-2 border border-amber-100">
        <strong>Watch out:</strong> Shrimp paste (gapi) is in most Thai cooking. Even 'vegan' Thai dishes may contain fish sauce (nam pla). Always specify both: "mai sai nam pla, mai sai gapi."
      </div>
    </div>
  );
}
