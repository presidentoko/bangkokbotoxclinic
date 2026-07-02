const PUBS = [
  {
    name: "The Londoner Brew Pub",
    emoji: "🍺",
    area: "Soi 33/1 Sukhumvit (multiple Bangkok locations)",
    price: "Craft pint ฿200–350; Food mains ฿250–550",
    why: "Bangkok's gastropub scene blends British pub culture with Bangkok's dining standards — The Londoner is the most established example, running since 1987 and maintaining British expat standards (proper bitter, pub quiz nights, Sunday roast). Beyond the Londoner, Bangkok has developed genuine gastropubs with chef-driven pub food (gourmet burgers, proper fish and chips, elevated sharing boards) alongside craft beer programs. The gastropub format suits Bangkok's social dining culture — staying all evening, grazing on food, multiple rounds.",
    tip: "The Londoner's Sunday roast (฿350–500 with all trimmings including Yorkshire pudding, roast potatoes, seasonal vegetables) is Bangkok's most authentic British Sunday lunch experience — arrive before 1pm for full selection. Pub quiz nights (usually weekly, check social media for schedule) are genuinely competitive and hugely social — teams form from strangers if you arrive solo. Bangkok's UK expat football watching culture means most gastropubs show Premier League, Champions League, and international matches live.",
  },
  {
    name: "Craft Beer Bars & Tap Rooms",
    emoji: "🍻",
    area: "Thonglor, Ekkamai, Ari — craft beer belt",
    price: "Craft pint ฿200–450; Flights ฿400–800",
    why: "Bangkok's craft beer scene has grown significantly from a handful of expat beer bars to a genuine craft brewing culture. Brewdog Bangkok (Ekkamai), TAP Craft Beer Bar (Sukhumvit), and smaller tap rooms across Thonglor stock imported craft alongside Thai craft breweries (Chatree, Full Moon, Sandport, Outlaw — local Thai craft brands). The craft beer community overlaps with Bangkok's music, creative, and tech communities — these are social gathering spots beyond just drinking.",
    tip: "Thai craft beer note: Thailand's brewing laws historically restricted craft brewing (only large commercial breweries held licenses), creating a generation of 'contract brewed' Thai craft beers made in Vietnam or Cambodia and imported back. This is changing with new licensing frameworks — ask bar staff which beers are genuinely locally brewed vs. contract overseas. The price difference between local and imported craft is significant — Thai-produced craft beers are typically ฿50–100 cheaper per pint for equivalent quality.",
  },
  {
    name: "Sports Bar & Entertainment Venues",
    emoji: "📺",
    area: "RCA Entertainment District, Asok-Sukhumvit junction",
    price: "Entry ฿0–300 (varies by night/event); Drinks ฿150–350",
    why: "Bangkok's sports bar scene has a dedicated geography — the Sukhumvit Soi 11 and Asok junction area has the highest concentration of sports bars showing international matches. FIFA World Cup, European football, NBA, cricket test matches, and rugby internationals all draw dedicated Bangkok crowds to specialized viewing venues. The social experience (crowd energy, sports knowledge sharing across nationalities) mirrors any major international city's sports bar culture with the added Bangkok ingredient of very late kitchen hours.",
    tip: "Sports bars in Bangkok for international matches: Cheap Charlie's (Sukhumvit Soi 11, legendary outdoor drinking scene), Bull's Head (attached pub), Q Bar (Sukhumvit Soi 11, landmark club but has sports screening area). For football: most English pubs (Londoner, Bull's Head, Shenanigan's) show UK premier league live — check kickoff times against Bangkok timezone (Bangkok is UTC+7, so UK 3pm kickoff = 10pm Bangkok). Time zone math matters for planning sports bar evenings.",
  },
];

export function BangkokGastropub() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🍺 Gastropubs & craft beer in Bangkok — British pubs, tap rooms & sports bars
      </div>
      <div className="space-y-2">
        {PUBS.map((p) => (
          <div key={p.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{p.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{p.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{p.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{p.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{p.why}</div>
            <div className="text-[10px] text-amber-700">💡 {p.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
