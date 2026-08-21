const SPOTS = [
  {
    name: "Tijuana (Sukhumvit Soi 55)",
    emoji: "🌮",
    area: "Thong Lo / Soi 55",
    price: "Tacos ฿120–180, Burrito ฿280–380",
    why: "Bangkok's most popular Mexican restaurant for 15+ years. Owner is Mexican-American. Proper corn tortillas, slow-cooked carnitas, fish tacos with lime crema. Best margarita in Bangkok.",
    tip: "Tuesday Taco Night: all tacos ฿90. Arrive before 7pm or expect 30-min wait. Take-away Grab delivery available but tacos don't travel well — eat in.",
  },
  {
    name: "El Corazon (Silom area)",
    emoji: "❤️",
    area: "Silom / Sathorn",
    price: "Tacos ฿100–160, Nachos ฿280",
    why: "Authentic street-style Mexican tucked into Bangkok's business district. Street tacos on soft corn tortillas, excellent aguachile, fresh salsa made daily. Expat lunch crowd fills it 12:30–1:30pm.",
    tip: "Weekday lunch set is best value (฿250 includes 3 tacos + agua fresca). Weekend brunches include bottomless brunch option. Al pastor tacos with pineapple are their signature.",
  },
  {
    name: "Sunrise Tacos (Central Bangkok)",
    emoji: "☀️",
    area: "Near Lumphini Park",
    price: "Tacos ฿140–190, Combo plate ฿320–490",
    why: "Bangkok's Tex-Mex institution. American-run since 1997. Generous portions, Americanized Mexican that hits perfectly after too many Thai-only meals. Exceptional nachos and quesadillas.",
    tip: "More Tex-Mex than authentic Mexican — if you want Chipotle-style, this is your place. Queso dip and guacamole are excellent. Happy hour margaritas 5–7pm best deal.",
  },
];

export function BangkokTacos() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🌮 Tacos & Mexican food in Bangkok — best spots
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-red-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-red-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
