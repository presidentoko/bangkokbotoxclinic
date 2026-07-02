const SPOTS = [
  {
    name: "Zum Bruno Austrian/German Restaurant",
    emoji: "🍺",
    area: "Silom / Bang Rak area",
    price: "Main dishes ฿350–700; Beer ฿200–350",
    why: "One of Bangkok's longest-running European-Central European restaurants. Austrian and German dishes: Wiener Schnitzel, Bratwurst, Sauerbraten, Sauerkraut, pretzels, Black Forest cake. German beer on tap (Hofbräu, Paulaner). European expat community staple. Very different from standard Bangkok dining — hearty portions, cold climate comfort food.",
    tip: "Wiener Schnitzel here is genuinely tender and properly breaded — not a Thai approximation. German Oktoberfest beers available during October. The Black Forest cake (Schwarzwälder Kirschtorte) is better than most European bakeries in Bangkok.",
  },
  {
    name: "Oktoberfest Events (Seasonal)",
    emoji: "🪗",
    area: "Major Bangkok hotels and German restaurants, October",
    price: "Entry with stein ฿1,200–2,500; Beer tokens additional",
    why: "Bangkok holds several Oktoberfest events annually in October. Biggest at major German-owned restaurants and hotel rooftops. Dirndl and lederhosen encouraged, live German folk music, authentic Bavarian beer (shipped specially), German food stalls. The event attracts Bangkok's German community and beer enthusiasts.",
    tip: "Bangkok Oktoberfest at The Westin, Novotel, or German-backed event organizers typically run the best authentic events. Book tickets ahead — events sell out among Bangkok's German expat community. The stein (1L mug) challenge is a staple.",
  },
  {
    name: "German Bakeries & Delis",
    emoji: "🥨",
    area: "Silom area and international grocery stores",
    price: "Pretzels ฿80–150; Bread ฿120–250",
    why: "Several German-Thai bakeries operate in Bangkok serving authentic German bread — rye, pumpernickel, Vollkornbrot — and pretzels. German cold cuts (Aufschnitt), mustards, and pickled vegetables available at Villa Market and some specialty delis. Home cooking for German expats and bread enthusiasts.",
    tip: "German bread in Bangkok is a genuine specialty — the humidity affects standard baking, so finding proper German Brotkultur is noteworthy. The Silom area German deli sections have the widest selection of imported German products.",
  },
];

export function BangkokGermanFood() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🍺 German food in Bangkok — schnitzel, Oktoberfest & German bakeries
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-amber-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
