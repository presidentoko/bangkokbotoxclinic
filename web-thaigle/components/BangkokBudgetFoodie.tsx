const SPOTS = [
  {
    name: "Pad Thai Fawng — Sampeng Lane",
    emoji: "🍜",
    location: "Sampeng Lane, Chinatown",
    price: "฿50–70",
    open: "11am–3pm (sell out early)",
    dish: "Pad Thai cooked to order in a wok-lined nook. Line of 15–20 people always. Takes 2 min per order.",
    why: "Best budget pad Thai in Bangkok. Cash only. Standing only.",
  },
  {
    name: "Jeh Oh Chula — Tom Yum Mama",
    emoji: "🌶️",
    location: "Phaya Thai Rd near Chula University",
    price: "฿50–80",
    open: "11pm–3am only",
    dish: "Tom Yum instant noodle soup from a tiny shop. Sounds gimmicky — is genuinely incredible. Extremely popular with Chula students.",
    why: "One of Bangkok's most viral street food spots — Tom Yum Mama noodle hybrid that is genuinely outstanding.",
  },
  {
    name: "Roti Mataba",
    emoji: "🫓",
    location: "Phra Athit Road near Banglamphu",
    price: "฿80–120",
    open: "Tue–Sun 9am–6pm (closed Monday)",
    dish: "Crispy roti with beef filling (murtabak) and massaman curry dip. Muslim-owned, halal.",
    why: "Bangkok institution for 50+ years. Best roti in Bangkok. Lunch queue out the door.",
  },
  {
    name: "Kor Panich — Khao Tom (Rice Porridge)",
    emoji: "🥣",
    location: "Tanao Road, Old City",
    price: "฿40–80",
    open: "6am–2pm",
    dish: "Century old shop. Rice porridge with minced pork or seafood. Simple, perfect Thai breakfast.",
    why: "Open since 1932. Local breakfast institution. Zero tourist trap energy.",
  },
  {
    name: "Sala Daeng Night Food Stalls",
    emoji: "🌙",
    location: "Behind Silom Complex (Sala Daeng BTS)",
    price: "฿40–100",
    open: "7pm–midnight",
    dish: "10+ stalls: grilled satay, papaya salad (som tam), larb (meat salad), isaan sausage.",
    why: "Most overlooked street food street in Bangkok. Office workers eat here. No tourist menus.",
  },
];

export function BangkokBudgetFoodie() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🍜 Bangkok budget foodie — best meals under ฿100
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">📍 {s.location} · 🕐 {s.open}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono font-black text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.dish}</div>
            <div className="text-[10px] text-orange-600">⭐ {s.why}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
