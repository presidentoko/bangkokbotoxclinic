const REGIONS = [
  {
    name: "Central (Bangkok)",
    emoji: "🏙️",
    flavor: "Balanced — sweet, sour, salty, mild spice",
    dishes: ["Pad Thai (ผัดไทย)", "Tom Yum Kung (ต้มยำกุ้ง)", "Massaman curry (แกงมัสมั่น)", "Green curry (แกงเขียวหวาน)"],
    try: "What tourists think all Thai food tastes like",
    where: "Everywhere in Bangkok",
  },
  {
    name: "Isaan (Northeast)",
    emoji: "🌶️",
    flavor: "Very spicy, sour, fermented flavors",
    dishes: ["Som Tam (ส้มตำ) — papaya salad", "Larb (ลาบ) — minced meat salad", "Sticky rice (ข้าวเหนียว)", "Grilled pork collar (คอหมูย่าง)"],
    try: "The spiciest, most intense Thai cuisine. Thais' favourite.",
    where: "Isaan restaurants near Ratchadaphisek or Victory Monument",
  },
  {
    name: "Northern (Chiang Mai style)",
    emoji: "🏔️",
    flavor: "Mild, herbal, influenced by Myanmar/Shan",
    dishes: ["Khao Soi (ข้าวซอย) — coconut curry noodles", "Sai Oua (ไส้อั่ว) — herbed pork sausage", "Nam Prik Num — roasted chili dip"],
    try: "Very different from central Thai. Khao Soi is a must-try.",
    where: "Northern Thai restaurants in Ekkamai or Ari area",
  },
  {
    name: "Southern (Phuket/Hat Yai style)",
    emoji: "🌴",
    flavor: "Very spicy, coconut-heavy, turmeric-based",
    dishes: ["Massaman (มัสมั่น) — deep Southern version", "Gaeng Tai Pla (แกงไตปลา) — salty fish kidney curry", "Kow Mok Gai — Thai biryani"],
    try: "Influences from Malaysia and India. Much heavier spice.",
    where: "Southern Thai restaurants near Yaowarat or in Silom",
  },
];

export function ThaiRegionalCuisine() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🗺️ Regional Thai cuisine — they're very different
      </div>
      <div className="space-y-3">
        {REGIONS.map((r) => (
          <div key={r.name} className="border border-[var(--border)] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{r.emoji}</span>
              <div>
                <div className="font-bold text-xs">{r.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{r.flavor}</div>
              </div>
            </div>
            <div className="space-y-0.5 mb-1.5">
              {r.dishes.map((d) => (
                <div key={d} className="text-[10px] text-[var(--fg)] flex gap-1.5 items-start">
                  <span className="text-orange-500 shrink-0 mt-px">▸</span>{d}
                </div>
              ))}
            </div>
            <div className="text-[10px] text-blue-600">{r.try}</div>
            <div className="text-[10px] text-[var(--muted)] mt-0.5">📍 {r.where}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
