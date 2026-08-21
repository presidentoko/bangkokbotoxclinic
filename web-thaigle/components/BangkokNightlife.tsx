const VENUES = [
  {
    name: "Levels Club & Lounge",
    emoji: "🎵",
    area: "Sukhumvit Soi 11 (Asok BTS)",
    vibe: "International club / EDM & hip-hop",
    price: "Free before midnight / ฿400–600 after with 1 drink",
    peak: "Thu–Sat from 11pm. Lines form after midnight.",
    dress: "Smart casual. No shorts/flip-flops.",
    why: "Biggest mainstream club in Bangkok. Multiple floors, each with different music genre. International DJ guests regularly.",
  },
  {
    name: "Sing Sing Theater",
    emoji: "🎪",
    area: "Sukhumvit 45 (Phrom Phong BTS)",
    vibe: "Theatrical / Shanghai-inspired art-deco",
    price: "฿600–900 (includes drinks)",
    peak: "Sat from 9pm. Concept nights mid-week.",
    dress: "Dress up — this is a fashion venue.",
    why: "Most visually stunning nightlife venue in Bangkok. Burlesque, live band, drag shows rotate. Book ahead for key nights.",
  },
  {
    name: "Onyx at Royal City Avenue (RCA)",
    emoji: "🖤",
    area: "Rama 9 / RCA Club Strip",
    vibe: "Thai local party scene / major local artists",
    price: "฿200–500",
    peak: "Fri–Sat from 11pm. Massive local crowd.",
    dress: "Anything goes here.",
    why: "Where Bangkok actually goes to party — not tourists. Biggest club in Thailand by capacity. RCA has 10+ venues in the same strip.",
  },
  {
    name: "Bamboo Bar (Mandarin Oriental)",
    emoji: "🎷",
    area: "Charoen Krung (Saphan Taksin BTS then hotel boat)",
    vibe: "Jazz / live music fine drinking",
    price: "฿600–1,200+ (cocktails)",
    peak: "Tue–Sun from 8pm. Live jazz from 9:30pm.",
    dress: "Smart elegant required.",
    why: "Bangkok's most legendary bar (open since 1953). Intimate jazz setting. World-class rotating jazz artists. Hotel bar but no hotel snobbery.",
  },
];

export function BangkokNightlife() {
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-violet-700 mb-3">
        🎶 Bangkok nightlife — best clubs & bars by vibe
      </h2>
      <div className="text-[10px] bg-violet-50 rounded-xl p-2.5 mb-3 text-violet-800">
        <strong>Closing times:</strong> Bangkok nightlife closes at 2am legally (1am in some areas). RCA has special 2am+ extensions. Plan arrivals accordingly — places get good around 11pm–midnight.
      </div>
      <div className="space-y-2">
        {VENUES.map((v) => (
          <details key={v.name} className="border border-violet-100 rounded-xl overflow-hidden group">
            <summary className="px-3 py-2.5 cursor-pointer flex items-center gap-2 hover:bg-violet-50 transition">
              <span className="text-xl shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{v.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{v.vibe} · {v.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{v.price}</span>
            </summary>
            <div className="px-3 pb-3 space-y-1 border-t border-violet-100 pt-2">
              <div className="text-[10px] text-[var(--fg)] leading-snug">{v.why}</div>
              <div className="text-[10px] text-orange-600">⏰ Peak: {v.peak}</div>
              <div className="text-[10px] text-violet-700">👔 Dress: {v.dress}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
