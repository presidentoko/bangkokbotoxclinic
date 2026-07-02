const SPOTS = [
  {
    name: "Sukhumvit Soi 3/1 — Arab Street (Nana)",
    emoji: "🌙",
    area: "Nana BTS (BTS Nana)",
    desc: "Bangkok's Middle Eastern food hub. Lebanese, Egyptian, Saudi, Turkish and Malaysian restaurants in a 200m stretch.",
    picks: ["Al-Muslemeen — Lebanese, best shawarma in Bangkok (฿120)", "Al-Saray — huge halal buffet, Central Asian crowd", "Mango Thai — halal Thai food with English menu"],
    must: "Mango sticky rice from halal-certified stands on Soi 3 (฿60). Best time: evening when all restaurants buzz.",
  },
  {
    name: "Haroon Mosque Area — Bangrak",
    emoji: "🕌",
    area: "Charoen Krung, Bangrak (near Saphan Taksin)",
    desc: "100-year-old Muslim community around Haroon Mosque. Authentic Malay-Thai halal food, not tourist-oriented.",
    picks: ["Khao Tom Nai Phan — rice porridge since 1975 (฿60–120, halal)", "Muslim Restaurant — Thai-Muslim curries, biryani, massaman (฿80–200)", "Halal food stalls at dawn for Sehri/Suhoor (Ramadan)"],
    must: "Massaman curry with roti canai ฿80 — this is where the recipe comes from in Bangkok.",
  },
  {
    name: "Pratunam & Phetchaburi Soi 5 Area",
    emoji: "🍱",
    area: "Pratunam / Central Bangkok",
    desc: "Large Malay and Muslim Thai community. Night market atmosphere post-midnight with halal options.",
    picks: ["Phetchaburi Soi 5 Night Market — halal stalls open 11pm–5am", "Roti Mataba — famous roti canai and halal massaman (฿80)", "Night bazaar stalls: murtabak, satay, nasi lemak"],
    must: "Roti with egg and beef massaman dip at Roti Mataba (near Phra Athit) — one of Bangkok's great cheap eats.",
  },
];

export function BangkokHalalFood() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-3">
        🌙 Halal food in Bangkok — Muslim-friendly restaurants
      </div>
      <div className="space-y-3">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-emerald-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div>
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">📍 {s.area}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1.5 leading-snug">{s.desc}</div>
            <div className="flex flex-wrap gap-1 mb-1.5">
              {s.picks.map((p) => (
                <span key={p} className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full">{p}</span>
              ))}
            </div>
            <div className="text-[10px] text-orange-600">⭐ Must try: {s.must}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] bg-emerald-50 rounded-xl p-2.5 text-emerald-800">
        🕌 <strong>Tip:</strong> Look for green Halal Certified stickers issued by the Central Islamic Council of Thailand (CICOT). Most restaurants in Nana and Pratunam areas already display these.
      </div>
    </div>
  );
}
