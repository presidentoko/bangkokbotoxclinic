const PUBS = [
  {
    name: "O'Reilly's Irish Pub",
    emoji: "🍺",
    area: "Silom Road (multiple locations)",
    price: "Pint of Guinness ฿280–360; Food ฿200–500",
    why: "Bangkok's most established Irish pub chain. Multiple locations including Silom and Sukhumvit. Classic pub atmosphere with dark wood, sports on TV, Guinness poured properly. Full pub food menu: fish and chips, shepherd's pie, club sandwiches. Sports streaming of European and international events.",
    sports: "Champions League, Premier League, Six Nations rugby, international cricket, Australian sports — most major events covered.",
  },
  {
    name: "Shenanigans Irish Pub",
    emoji: "☘️",
    area: "Sukhumvit Soi 23, near Asoke",
    price: "Pint ฿280–320; Kitchen meals ฿180–450",
    why: "Long-standing Sukhumvit Irish institution. Lively atmosphere, genuine Irish barmen, live music on weekends. The closest to a real Dublin pub feel in Bangkok — worn wooden floors, dart boards, mix of expats and travelers. Often has Irish memorabilia and themed events.",
    sports: "GAA matches (Gaelic football, hurling) occasionally shown for the Irish expat crowd — unique to this venue. European football always on.",
  },
  {
    name: "Bull's Head English Pub",
    emoji: "🐂",
    area: "Sukhumvit Soi 33/1",
    price: "Pint ฿250–320; Full meals ฿200–600",
    why: "Technically British rather than Irish, but Bangkok's most acclaimed pub for Sunday roast (฿595 all-in including Yorkshire pudding, roast potatoes, two meats, gravy). Award-winning burgers. Premier League and Champions League coverage. Very popular with UK and Australian expats.",
    sports: "Full UK sports coverage — domestic English football in addition to European competitions. Cricket test matches during major series.",
  },
];

const TIPS = [
  "Guinness in Bangkok: keg imported, properly conditioned — pint poured with 2-minute settle is correct form",
  "Sports timing: European evening kickoffs (9pm–11pm Bangkok time) — pubs fill with expats mid-evening",
  "Happy hours: most Irish pubs 4–8pm with 50–100฿ off pints",
  "Food ordering: kitchen usually closes 10–11pm; order food before crowds arrive on match nights",
  "Weekend nights: arrive early for major match screenings (Champions League, World Cup) — standing room fills fast",
];

export function BangkokIrishPubs() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        ☘️ Irish pubs in Bangkok — Guinness, sports screens & expat hangouts
      </h2>
      <div className="space-y-2 mb-3">
        {PUBS.map((p) => (
          <div key={p.name} className="border border-green-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{p.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{p.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{p.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{p.why}</div>
            <div className="text-[10px] text-green-700">📺 {p.sports}</div>
          </div>
        ))}
      </div>
      <details className="border border-green-100 rounded-xl overflow-hidden">
        <summary className="px-3 py-2 cursor-pointer text-[10px] font-bold text-green-700 hover:bg-green-50">
          Bangkok pub tips
        </summary>
        <ul className="px-3 pb-3 pt-1 space-y-0.5">
          {TIPS.map((t) => (
            <li key={t} className="text-[10px] text-[var(--fg)] flex items-start gap-1.5">
              <span className="text-green-400 shrink-0">•</span>{t}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
