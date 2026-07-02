const BARS = [
  {
    name: "Vertigo Rooftop",
    emoji: "🌇",
    hotel: "Banyan Tree",
    floor: "61F",
    vibe: "Most dramatic views. Outdoor, 360°. Bangkok's most famous rooftop.",
    entryFee: "Free (min spend ฿800)",
    bestTime: "Sunset (6:30pm). Reserve early.",
    dressCode: "Smart casual — no shorts/flip-flops",
    url: "/for/date-night",
  },
  {
    name: "Octave Rooftop",
    emoji: "🎵",
    hotel: "Marriott Sukhumvit",
    floor: "45–49F",
    vibe: "DJ music, panoramic Sukhumvit views, young crowd.",
    entryFee: "Free entry (buy 1 drink ≈฿350)",
    bestTime: "8pm–midnight. Walk-in fine.",
    dressCode: "Casual",
    url: "/for/date-night",
  },
  {
    name: "Three Sixty Jazz Lounge",
    emoji: "🎷",
    hotel: "Millennium Hilton",
    floor: "32F",
    vibe: "Live jazz, Chao Phraya river views, sophisticated crowd.",
    entryFee: "Free (drinks ฿300–500)",
    bestTime: "Jazz starts 7pm. Great river view at dusk.",
    dressCode: "Smart casual",
    url: "/for/date-night",
  },
  {
    name: "Cielo Sky Bar",
    emoji: "☁️",
    hotel: "Asoke Residence",
    floor: "36F",
    vibe: "Less touristy, local favourite. Casual vibe with great city views.",
    entryFee: "Free entry. Cocktails ฿250–400",
    bestTime: "Any evening — rarely crowded. Go weekday for best experience.",
    dressCode: "Casual OK",
    url: "/for/date-night",
  },
];

export function RooftopBars() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        🌆 Bangkok rooftop bars — the real ones
      </div>
      <div className="space-y-2">
        {BARS.map((b) => (
          <a key={b.name} href={b.url} className="block border border-[var(--border)] rounded-xl p-3 hover:border-purple-200 hover:shadow-sm transition group">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xl">{b.emoji}</span>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-xs group-hover:text-purple-700 transition">{b.name}</span>
                <span className="text-[10px] text-[var(--muted)] ml-1.5">{b.hotel} · {b.floor}</span>
              </div>
              <span className="shrink-0 text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">{b.entryFee}</span>
            </div>
            <div className="text-[11px] text-[var(--fg)] mb-0.5">{b.vibe}</div>
            <div className="text-[10px] text-[var(--muted)]">⏰ {b.bestTime} · 👔 {b.dressCode}</div>
          </a>
        ))}
      </div>
      <a
        href="/for/date-night"
        className="mt-3 block text-center text-xs font-bold text-purple-600 border border-purple-200 bg-purple-50 rounded-full py-1.5 hover:bg-purple-100 transition"
      >
        Best Bangkok date night spots →
      </a>
    </div>
  );
}
