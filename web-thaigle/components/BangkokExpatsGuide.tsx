const SECTIONS = [
  {
    title: "Best Neighborhoods for Expats",
    emoji: "🏘️",
    items: [
      { name: "Sukhumvit 39–55 (Phrom Phong–Thong Lo)", desc: "Most popular expat area. International schools, hospitals, restaurants. Walk to BTS. Rent ฿25,000–80,000/month." },
      { name: "Ari / Phahon Yothin", desc: "Creative class, less foreigner-heavy. Great cafés. Quieter. Rent ฿15,000–40,000/month." },
      { name: "Sathorn / Silom", desc: "Business district. Near BTS/MRT interchange. More corporate expats. Rent ฿20,000–60,000/month." },
      { name: "Bangna / Bearing", desc: "More affordable. Large house compounds. Good if you have car or need more space. Rent ฿12,000–30,000/month." },
    ],
  },
  {
    title: "Visas for Long Stay",
    emoji: "🛂",
    items: [
      { name: "Thailand Elite Visa (5yr / ฿900,000)", desc: "Best option for retirees and remote workers. No work permit needed. Renewable." },
      { name: "SMART Visa (4yr)", desc: "For tech workers, investors, and skilled professionals. Must meet eligibility criteria." },
      { name: "Tourist Visa + Border Run", desc: "Short-term: 30-day entry, 30-day extension (฿1,900). Border run for additional 30 days. Messy but common." },
      { name: "ED (Education) Visa", desc: "Thai language or Muay Thai school enrollment. 1-year student visa with 90-day extensions." },
    ],
  },
  {
    title: "Banking & Money",
    emoji: "💳",
    items: [
      { name: "Kasikorn (KBank)", desc: "Best bank for expats. English app. Easy to open with passport + proof of address. Required for many services." },
      { name: "Bangkok Bank", desc: "Oldest, most branches. Good for international wire transfers. Easier foreign currency accounts." },
      { name: "Wise / Revolut", desc: "Best for receiving money from abroad. Link to Thai bank. Avoid SWIFT wire fees (~฿600–1,200 per transfer)." },
    ],
  },
];

export function BangkokExpatsGuide() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-slate-700 mb-3">
        🌏 Bangkok expat guide — living & staying long-term
      </h2>
      <div className="space-y-4">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{s.emoji}</span>
              <div className="font-bold text-xs">{s.title}</div>
            </div>
            <div className="space-y-1.5">
              {s.items.map((item) => (
                <div key={item.name} className="border border-slate-100 rounded-xl px-3 py-2">
                  <div className="font-bold text-[11px] mb-0.5">{item.name}</div>
                  <div className="text-[10px] text-[var(--muted)]">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
