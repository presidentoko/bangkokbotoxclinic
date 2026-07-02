const DISTRICTS = [
  {
    name: "Sukhumvit Soi 11 Indian Belt",
    emoji: "🇮🇳",
    desc: "Bangkok's Little India — highest concentration of Indian restaurants, grocery shops, and spice merchants",
    picks: [
      { name: "Rang Mahal", type: "North Indian fine dining", price: "฿600–1,500", note: "Best Indian in Bangkok — stunning Chao Phraya view on 26F Rembrandt Hotel" },
      { name: "Himali Cha Cha", type: "North Indian", price: "฿300–600", note: "Bangkok classic since 1972. Butter chicken, daal. No frills, big flavour." },
      { name: "Anand's", type: "South Indian + dosas", price: "฿150–350", note: "Best dosas in Bangkok. Masala dosa ฿120. Thali ฿250. Hugely popular with Tamil expats." },
    ],
  },
  {
    name: "Silom / Bangrak (Business)",
    emoji: "🍛",
    desc: "Smaller cluster near the business district with business lunch thalis",
    picks: [
      { name: "Thali Thai", type: "Lunch thali specialist", price: "฿150–280", note: "Unlimited rice + 5 curries + naan. Best value lunch in Silom." },
      { name: "Maharaja", type: "North Indian + biryani", price: "฿250–600", note: "Longest-running Indian restaurant in Silom. Consistent biryani." },
    ],
  },
];

const MUST_TRY = [
  { dish: "Butter Chicken", thai: "ไก่บัตเตอร์", price: "฿200–350", note: "Most popular — rich tomato cream sauce" },
  { dish: "Lamb Biryani", thai: "ข้าวหมกแกะ", price: "฿250–450", note: "Slow-cooked rice dish, fragrant spices" },
  { dish: "Masala Dosa", thai: "โดซา", price: "฿120–180", note: "South Indian crispy crepe, potato filling" },
  { dish: "Palak Paneer", thai: "ผักโขมชีส", price: "฿180–280", note: "Spinach + paneer cheese, vegetarian" },
  { dish: "Chicken Tikka Masala", thai: "ไก่ทิกก้า", price: "฿220–380", note: "Most ordered starter, also a main" },
];

export function BangkokIndianFood() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🇮🇳 Indian food in Bangkok — best curry & dhal
      </div>
      <div className="space-y-4 mb-4">
        {DISTRICTS.map((d) => (
          <div key={d.name}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{d.emoji}</span>
              <div>
                <div className="font-bold text-xs">{d.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{d.desc}</div>
              </div>
            </div>
            <div className="space-y-1.5">
              {d.picks.map((p) => (
                <div key={p.name} className="border border-orange-100 rounded-xl px-3 py-2 flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[11px]">{p.name}</div>
                    <div className="text-[10px] text-[var(--muted)]">{p.type}</div>
                    <div className="text-[10px] text-orange-600 mt-0.5">{p.note}</div>
                  </div>
                  <span className="shrink-0 text-[10px] font-mono text-green-700">{p.price}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs font-bold mb-2">Must-try dishes</div>
      <div className="space-y-1">
        {MUST_TRY.map((m) => (
          <div key={m.dish} className="flex items-center gap-2 text-[10px]">
            <span className="shrink-0 text-orange-500 font-bold w-28">{m.dish}</span>
            <span className="shrink-0 text-[var(--muted)] font-mono w-16">{m.price}</span>
            <span className="text-[var(--fg)]">{m.note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
