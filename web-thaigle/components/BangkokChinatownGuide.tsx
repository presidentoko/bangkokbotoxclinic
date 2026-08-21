const SECTIONS = [
  {
    section: "Yaowarat Night Food Street",
    emoji: "🏮",
    hours: "Evening 6pm–midnight",
    approach: "Walk from Hua Lamphong MRT or Sanam Chai MRT, 15 min walk",
    musthave: ["Braised duck noodles (เป็ดพะโล้) — ฿80–120", "Khao man gai (poached chicken rice) — ฿60–80", "Crispy pork belly rice — ฿70–100", "Mango sticky rice from Sanguan Sri — ฿120"],
    tip: "Walk the entire Yaowarat Road (1km) before eating. Smell everything first. Best congee spot: T&K Seafood.",
  },
  {
    section: "Gold & Jewelry District",
    emoji: "💛",
    hours: "9am–6pm (shops closed Sunday)",
    approach: "Yaowarat Road main stretch",
    musthave: ["24k gold shops at Thai gold purity standard (96.5%)", "Thai gold is priced daily — check Thai gold price (ทองคำ)", "Best for: real gold jewelry, not silver/gemstones", "Amulet market nearby (Tha Prachan)"],
    tip: "Thai gold price is listed on goldtraders.or.th. Safe to buy — high-regulation industry. VAT 7% applies.",
  },
  {
    section: "Talad Noi Old Community",
    emoji: "🎨",
    hours: "Daytime 9am–5pm (some cafés until 8pm)",
    approach: "Walk south from Yaowarat Arch 10 min",
    musthave: ["Street art murals (new ones added monthly)", "100-year-old Chinese mechanics workshops", "Café & art space conversions", "Port-era architecture still intact"],
    tip: "Bangkok's most photogenic non-tourist area. Authentic Chinese-Thai heritage. Best light for photos: 7–9am or 4–5pm.",
  },
  {
    section: "Pak Klong Talad (Flower Market)",
    emoji: "🌸",
    hours: "24 hours — but best midnight–5am",
    approach: "Sanam Chai MRT + 5 min walk south along river",
    musthave: ["Endless jasmine garlands", "Buddhist offerings", "Fresh-cut flowers wholesale", "Amazing fragrance experience"],
    tip: "Go at 2–3am when trucks unload. Extraordinary visual + sensory experience. Safe, busy with vendors. Cheap flowers to take back.",
  },
];

export function BangkokChinatownGuide() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🏮 Chinatown Bangkok — complete area guide
      </h2>
      <div className="space-y-3">
        {SECTIONS.map((s) => (
          <div key={s.section} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div>
                <div className="font-bold text-xs">{s.section}</div>
                <div className="text-[10px] text-[var(--muted)]">🕐 {s.hours}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--muted)] mb-1.5">🚉 {s.approach}</div>
            <div className="space-y-0.5 mb-1.5">
              {s.musthave.map((m) => (
                <div key={m} className="text-[10px] flex gap-1.5">
                  <span className="shrink-0 text-red-500">▸</span>{m}
                </div>
              ))}
            </div>
            <div className="text-[10px] text-orange-600">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
