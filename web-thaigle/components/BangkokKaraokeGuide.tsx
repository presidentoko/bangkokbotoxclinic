const SPOTS = [
  {
    name: "Zaa Karaoke Box",
    emoji: "🎤",
    area: "Sukhumvit 11 (Nana BTS area)",
    price: "฿200–400/hr per room",
    capacity: "Room sizes: 2–4 person mini, 6–10 mid, 12–20 large",
    why: "Best-value private karaoke in central Bangkok. Song selection includes English, Thai, Korean, Japanese. Clean rooms, snack service available.",
    tip: "Book ahead for Friday-Saturday. Rooms fill by 9pm on weekends. Snacks/drinks brought to room — budget ฿100–200 extra per person.",
  },
  {
    name: "Zcene Karaoke (สนุก KTV)",
    emoji: "🎶",
    area: "Sukhumvit 15 (Asok BTS)",
    price: "฿300–500/hr depending on room size and time",
    capacity: "Multiple room sizes. VIP rooms seat 15–20.",
    why: "Thai KTV-style venue popular with Koreans and Japanese expats. Large song selection. Party packages with set food and drinks.",
    tip: "Afternoon discount (before 6pm): up to 30% off room rates. Bring your group — per-person cost drops with larger parties.",
  },
  {
    name: "Family KTV (Local Style)",
    emoji: "👨‍👩‍👧",
    area: "Near Silom, Huai Kwang, Lat Phrao",
    price: "฿100–200/hr",
    capacity: "Small to medium rooms, neighborhood-focused",
    why: "Where actual Bangkokians go. Less English selection but deeper Thai song catalog. Very affordable. No tourist premium.",
    tip: "Look for neon signs with 'KTV' (คาราโอเกะ) in neighborhood areas. Google Maps 'คาราโอเกะ near me' for nearest options.",
  },
];

const TIPS = [
  "Thai karaoke culture: you rent a private room, not sing in front of strangers (that's a small minority of venues).",
  "Tamboon (ตัมบูน) = the bill. Ask at end of session for 'check bin'.",
  "Song selection: English songs are usually in every venue. Korean/Japanese varies.",
  "Food and drinks: most venues let you order snacks. Mark-up is usually 50–100% over street prices — acceptable for private room service.",
  "Best nights: Thursday–Saturday get busy after 9pm. Sunday early evening is often quietest and cheapest.",
];

export function BangkokKaraokeGuide() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        🎤 Bangkok karaoke guide — KTV boxes & where to sing
      </div>
      <div className="space-y-2 mb-3">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-pink-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.capacity} · {s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-pink-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
      <div className="border border-pink-100 rounded-xl p-3">
        <div className="text-[10px] font-bold text-pink-700 mb-1.5">🎵 Bangkok karaoke tips</div>
        <ul className="space-y-0.5">
          {TIPS.map((t, i) => (
            <li key={i} className="text-[10px] text-[var(--fg)] leading-snug flex items-start gap-1.5">
              <span className="text-pink-400 shrink-0">•</span>{t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
