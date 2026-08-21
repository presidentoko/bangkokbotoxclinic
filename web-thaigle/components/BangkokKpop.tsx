const SPOTS = [
  {
    name: "K-Pop Dance Studios",
    emoji: "💃",
    area: "Siam Square, Asoke, Ekkamai",
    price: "Drop-in class ฿350–600",
    why: "Bangkok has 20+ dedicated K-pop dance studios teaching BTS, Blackpink, NewJeans, aespa choreography. Classes split by difficulty level (beginner/intermediate/advanced). Very popular with Thai university students. Clean studios, mirrors, good sound systems.",
    tip: "Most popular studios: Cover Dance Academy, Dope Dance Studio, MRD Dance Studio. Classes fill fast on weekends — book online 24–48h ahead. Beginner classes often in Thai — ask if English instruction available. Comfortable casual clothes, no heels.",
  },
  {
    name: "Siam Square K-Pop Shops",
    emoji: "🎭",
    area: "Siam Square 1–3 area",
    price: "Albums ฿600–1,500; Merchandise varies",
    why: "Siam Square (connected to BTS National Stadium and Siam) is Bangkok's K-pop merchandise hub. Multiple shops selling official albums, photocards, lightsticks, and idol merchandise. Also unofficial merchandise at lower prices. Bangkok's equivalent of Seoul's Hondae district for K-pop.",
    tip: "Official albums usually same price or cheaper than Korea (no import tax for those bought locally). Photocard trading is active in Siam Square — look for groups of teens showing cards. KTOWN4U Thailand has Bangkok pickup orders for official merchandise.",
  },
  {
    name: "K-Pop Karaoke (Norebang-style)",
    emoji: "🎤",
    area: "Multiple areas across Bangkok",
    price: "Private room ฿180–400/hr (2 people minimum)",
    why: "Bangkok's Korean karaoke culture has taken off among Thai K-pop fans. Venues with Korean-style private rooms, modern screens, huge K-pop song libraries (50,000+ songs). Very social, party-friendly. Several all-night options near Thonglor.",
    tip: "Best karaoke chains: Holiday Karaoke, PartyWorld, Nspace. Song library should have 'K-POP' section — confirm before booking. Weeknight pricing much lower than weekend (sometimes 50% off). Tambourine, maracas, and snack ordering are all part of the experience.",
  },
  {
    name: "K-Pop Fan Events & Group Buys",
    emoji: "📱",
    area: "CentralWorld events space, Siam Paragon Hall",
    price: "Varies by event",
    why: "K-pop fan-organized events happen regularly in Bangkok: group watching parties for award shows, album listening events, fan merchandise markets. CentralWorld and Siam Paragon regularly host official K-pop events (fan meetings, pop-up shops, mini-concerts).",
    tip: "Follow Bangkok K-pop fan Twitter/X accounts for event announcements. Major fan clubs (BTS TH, Blink TH) organize city-wide events. Idol birthday events are fan-organized celebrations — welcoming to international fans. Check Eventbrite Bangkok for upcoming K-pop events.",
  },
];

const CULTURE = [
  "Thailand has one of Asia's most passionate K-pop fan communities outside Korea",
  "Thai K-pop fans (T-pop) are creating their own music — 4EVE, BNK48 style mixed with K-pop",
  "Concert tickets: Korea concerts are expensive and hard to get — Bangkok concerts easier to access",
  "K-pop artists who have performed in Bangkok: BTS, Blackpink, Seventeen, NCT, EXO, Stray Kids",
  "Fan culture: fan accounts, lightstick events, streaming parties, fan art — very organized",
  "Thai-Korean cultural connection deepening — Korean language courses very popular with Thai youth",
];

export function BangkokKpop() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        🎤 K-pop Bangkok — dance studios, fan culture & merchandise guide
      </h2>
      <div className="space-y-2 mb-3">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-pink-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-pink-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
      <details className="border border-pink-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-pink-700 hover:bg-pink-50">
          K-pop fan culture in Bangkok
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {CULTURE.map((c) => (
            <li key={c} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-pink-400 shrink-0">•</span>{c}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
