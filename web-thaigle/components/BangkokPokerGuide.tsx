const LEGAL_NOTE = "Thailand's gambling law (1935 Gambling Act) prohibits most forms of gambling including card games for money in private homes. However, legal card game clubs operate in a grey area and social poker with no rake is widely practiced.";

const VENUES = [
  {
    name: "Pokerthai.com Club Nights",
    emoji: "🃏",
    type: "Organized semi-private poker events",
    area: "Bangkok rotating venues (check website)",
    price: "฿500–1,500 tournament buy-in",
    why: "Thailand's largest organized poker community runs semi-regular tournament nights. English and Thai tables. MTT (multi-table tournament) format. Serious players attend.",
    tip: "Register online in advance — events sell out. Chips-only (no cash on table). PokerThai also runs poker schools for beginners.",
  },
  {
    name: "Hotel Card Games (Hilton, Marriott poker nights)",
    emoji: "🏨",
    type: "Hotel-organized private games",
    area: "Various 5-star hotels",
    price: "฿1,000–5,000 buy-in",
    why: "Several Bangkok hotels host semi-regular private poker nights for guests. Framed as entertainment not gambling. Best option for tourists wanting a legitimate venue.",
    tip: "Ask your hotel concierge — don't search publicly. Four Seasons, Marriott Marquis, and Grand Hyatt have intermittently hosted these events. Not always advertised online.",
  },
  {
    name: "Expat Home Games (Facebook: Bangkok Poker Group)",
    emoji: "👥",
    type: "Expat community home games",
    area: "Private condos around Sukhumvit",
    price: "฿200–1,000 home game buy-in",
    why: "Established expat poker community with regular home games. Multiple groups active on Facebook. Social and cash games, range from micro-stakes fun to serious play.",
    tip: "Join 'Bangkok Poker Players' Facebook group. Post to verify regular games. Most groups require introduction from existing member. Social home games treated as private entertainment.",
  },
];

const ALTERNATIVES = [
  "Online poker via VPN (PokerStars, GGPoker) — technically illegal but unpoliced for individual players",
  "Video poker in legal casinos across the border (Poipet, Cambodia — 4 hours by bus)",
  "Macau or Singapore for serious casino poker (short flights from BKK)",
  "Thai card game Pok Deng (ป๊อกเด้ง) — legal to play in some provinces",
];

export function BangkokPokerGuide() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-3">
        🃏 Poker in Bangkok — where to find games (legally)
      </h2>
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3 text-[10px] text-amber-800">
        ⚠️ {LEGAL_NOTE}
      </div>
      <div className="space-y-2 mb-3">
        {VENUES.map((v) => (
          <div key={v.name} className="border border-emerald-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{v.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{v.type} · {v.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{v.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{v.why}</div>
            <div className="text-[10px] text-emerald-700">💡 {v.tip}</div>
          </div>
        ))}
      </div>
      <div className="border border-emerald-100 rounded-xl p-3">
        <div className="text-[10px] font-bold text-emerald-700 mb-1.5">Legal alternatives near Bangkok:</div>
        <ul className="space-y-0.5">
          {ALTERNATIVES.map((a) => (
            <li key={a} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-emerald-400 shrink-0">•</span>{a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
