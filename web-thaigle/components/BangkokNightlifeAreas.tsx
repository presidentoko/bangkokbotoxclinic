const AREAS = [
  {
    area: "Silom Soi 4 (& Soi 2)",
    emoji: "🌈",
    vibe: "LGBTQ+ hub, inclusive, very social",
    crowd: "Mixed locals + expats + tourists. Gay-friendly",
    opens: "9pm–3am (Thu–Sun peak)",
    drinks: "Beer ฿100–150, cocktails ฿200–300",
    must: "DJ Station Soi 2 (biggest gay club), Telephone Bar, G Bangkok",
    tip: "Most welcoming nightlife area in Bangkok. Everyone is welcome. Soi 2 has the big clubs, Soi 4 is more bar-hopping.",
  },
  {
    area: "Ekkamai (Sukhumvit Soi 63)",
    emoji: "🎵",
    vibe: "Hipster, indie music, Thai locals mostly",
    crowd: "Young Bangkok Thais, creative crowd, some expats",
    opens: "8pm–2am (Fri–Sat best)",
    drinks: "Craft beer ฿150–250, natural wine ฿280–400/glass",
    must: "Standard Bangkok (rooftop bar + basement club), Bar Yard, Iron Balls",
    tip: "Least touristy nightlife in Bangkok. You'll be one of few foreigners. Uber/Grab back to hotel — no BTS at night.",
  },
  {
    area: "Sukhumvit Soi 11",
    emoji: "🌐",
    vibe: "International expat, pumping until 4am",
    crowd: "Mixed expats + tourists + locals. Very social",
    opens: "7pm–4am (open every night)",
    drinks: "Beer ฿150–200, cocktails ฿250–400",
    must: "Levels Club (multi-floor), Grease (live music + dancing), Hyde & Seek bar",
    tip: "Non-stop energy. Start at the street food stalls (moo ping, pad thai) before hitting the clubs. Grab home after.",
  },
  {
    area: "RCA (Royal City Avenue)",
    emoji: "🎧",
    vibe: "Mass Thai university crowd, EDM and Thai pop",
    crowd: "95% young Thai locals aged 18–25",
    opens: "10pm–3am (Thu–Sat)",
    drinks: "Table service with bottles — minimum spend ฿2,000/table",
    must: "Route 66 (huge, 3 zones), Cosmic Café, ONYX (electronic)",
    tip: "Real Bangkok youth nightlife. Most tourists don't know about this. Take Grab there and back — far from BTS.",
  },
  {
    area: "Khao San Road",
    emoji: "🎉",
    vibe: "Backpacker party street, buckets, dancing",
    crowd: "Tourists and backpackers 90%",
    opens: "6pm–4am (every night)",
    drinks: "Buckets (Red Bull + whiskey) ฿120–200",
    must: "Susie Pub, Hippie Bar Roof Garden, Bar Bar Bar",
    tip: "Not for everyone but iconic. Come here once. Pre-party cheap Chang beers (฿60) at 7-Eleven before entering.",
  },
];

export function BangkokNightlifeAreas() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🌙 Bangkok nightlife areas — which scene is yours?
      </h2>
      <div className="space-y-2">
        {AREAS.map((a) => (
          <div key={a.area} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-xl shrink-0">{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{a.area}</div>
                <div className="text-[10px] text-[var(--muted)]">{a.vibe}</div>
              </div>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-1">Crowd: {a.crowd}</div>
            <div className="text-[10px] text-blue-700 mb-0.5">🕐 {a.opens} · {a.drinks}</div>
            <div className="text-[10px] text-purple-700 mb-0.5">Must: {a.must}</div>
            <div className="text-[10px] text-orange-600">💡 {a.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
