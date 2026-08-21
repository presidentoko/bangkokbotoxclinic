const SPOTS = [
  {
    name: "Bangkok's Premium Cigar Lounges",
    emoji: "🍷",
    area: "La Casa del Habano Bangkok (Sathorn/Silom area), Havana House Bangkok (hotel cigar lounges in major luxury hotels — Mandarin Oriental, Peninsula, Park Hyatt), specialty cigar shops in Sukhumvit area",
    price: "Premium Cuban cigar: ฿800–8,000+; Cigar lounge entry (with drink): ฿300–1,000; Luxury hotel cigar lounge minimum: ฿1,500–5,000; Specialty humidors: ฿3,000–50,000+",
    why: "Bangkok has a small but discerning cigar culture — primarily centered around the city's luxury hotel cigar lounges and a handful of dedicated specialty retailers. The appeal for cigar enthusiasts: Bangkok's tropical climate (high humidity) requires careful humidor management, making good local storage critical; Bangkok's duty structure on luxury goods (cigars are subject to substantial import duties) makes premium Cuban cigars more expensive here than in Europe but significantly more accessible than in some markets. The city's luxury hotel bars — particularly those in the Mandarin Oriental, Peninsula Bangkok, and Park Hyatt — maintain dedicated cigar programs including proper humidor storage, a trained concierge team knowledgeable about current stock, and outdoor or ventilated smoking areas appropriate to the cigar experience. Bangkok also serves as a regional hub for the Southeast Asia cigar trade, meaning specialist retailers often have curated selection across Cuban, New World, and occasional boutique cigar makers.",
    tip: "Bangkok cigar experience guidance: (1) Thai law on smoking: Thailand has one of Southeast Asia's strictest public smoking enforcement environments — smoking is prohibited in air-conditioned spaces, restaurants, bars, and public areas; dedicated outdoor or ventilated smoking areas at hotels are the legal venue for cigar enjoyment; (2) Authentication: counterfeit Cuban cigars are present throughout Bangkok's tourist areas (Khao San Road, night markets); genuine authorized retailers (look for La Casa del Habano licensing) provide authenticity guarantees; (3) Humidity management: Bangkok's outdoor humidity (80–90%) is higher than ideal cigar storage humidity (65–70%); a proper humidor or traveling cigar case with boveda packs preserves purchased cigars during Bangkok stays; (4) Airport duty-free: Suvarnabhumi Airport's duty-free shops carry a limited but often quality selection of cigars at pre-tax prices — last chance opportunity before international travel; (5) Social context: Bangkok's cigar lounges attract a mix of expat executives, Thai business elite, and traveling enthusiasts — the social atmosphere is typically convivial and a contrast to the city's bustling energy outside.",
  },
  {
    name: "Bangkok Pipe Tobacco & Gentleman's Club Culture",
    emoji: "🪄",
    area: "Specialist tobacco retailers in Silom, River City Bangkok (antique and specialty shopping complex), specialty men's shops in Sukhumvit, occasional hobby meet-ups at hotel bars and members' clubs",
    price: "Quality pipe tobacco (50g): ฿400–1,200; Entry pipe: ฿800–3,000; Mid-range briar pipe: ฿3,000–15,000; Pipe smoking class/introduction: ฿1,000–3,000 (rare)",
    why: "Bangkok's pipe tobacco and traditional men's hobby culture occupies a quiet niche within the city's broader luxury leisure landscape. Traditional pipe smoking (distinguished from cigarettes by its thoughtful, slow-paced ritual) has a small but devoted community in Bangkok — primarily among older expats, Thai professionals who discovered the tradition abroad, and collectors of antique meerschaum pipes. River City Bangkok, the antique and specialty shopping complex near Chinatown, occasionally surfaces vintage pipe collections from Bangkok estates. The specialist tobacco market in Silom has historically served the pipe tobacco community with Virginia, Latakia, and English blend imports. Bangkok's 'gentleman's club' culture — private members' clubs, business clubs at luxury hotels — often provides private smoking rooms where pipe tobacco is permitted, creating spaces for a tradition that is increasingly restricted in public spaces worldwide.",
    tip: "Bangkok pipe tobacco access: (1) Dedicated pipe tobacco shops are rare in Bangkok — checking with specialist importers or the hospitality team at luxury hotels may be necessary to locate current stock; (2) Pipe collecting: Bangkok's antique markets (River City, Chatuchak, occasional estate sales) sometimes surface vintage meerschaum or briar pipes from the collections of former expat residents; prices vary wildly based on vendor knowledge; (3) The social dimension: finding Bangkok's pipe smoking community (primarily through online expat forums or tobacco retailer connections) leads to private gathering invitations where the ritual aspect of pipe smoking — slow, contemplative, convivial — is the focus; (4) Thai customs regulations: bringing pipe tobacco and pipes into Thailand requires staying within personal use allowances (typically 250g tobacco duty-free); declare amounts over this to avoid customs issues.",
  },
  {
    name: "Bangkok Whisky Bars & Scotch Appreciation",
    emoji: "🥃",
    area: "Single malt whisky bars in Sukhumvit (Soi 11, Thonglor, Ekamai areas), hotel whisky programs (Four Seasons, Marriott Marquis), Silom whisky retailers, specialist whisky events at Bangkok",
    price: "Premium single malt pour: ฿400–3,000+; Rare/vintage pour: ฿2,000–20,000+; Whisky tasting event: ฿2,000–8,000; Full bottle rare whisky: ฿5,000–500,000+",
    why: "Bangkok has developed into one of Southeast Asia's most sophisticated whisky markets — driven by Thai culture's existing enthusiasm for Scotch whisky (Thai people are significant per-capita consumers of Scotch globally), a growing community of international spirits enthusiasts, and Bangkok's position as a regional hub for whisky distribution and events. The city's whisky bar scene has evolved significantly: dedicated single malt bars in Thonglor and Ekamai stock comprehensive selections from across Scotland's whisky regions (Speyside, Islay, Highland, Lowland, Campbeltown), Japan (Yamazaki, Nikka, craft distilleries), and increasingly Irish, American, and Indian whisky. Bangkok also receives Asian exclusive bottlings — limited releases produced specifically for Asian markets (Taiwan, Japan, Thailand) that are unavailable elsewhere. The international whisky auction and investment community has a presence in Bangkok, with rare bottle trading in the higher price brackets.",
    tip: "Bangkok whisky experience navigation: (1) 'Whisky' vs 'whiskey': Scotland/Japan use 'whisky' (no 'e'); Ireland/USA use 'whiskey'; this distinction matters in specialty bars where understanding the staff's knowledge baseline; (2) Versus the Johnnie Walker culture: Thai mass-market Scotch consumption is dominated by Johnnie Walker Blue Label at restaurant/nightclub tables — specialty whisky bars are a completely different world of single malts, independent bottlings, and distillery exclusives; (3) Bangkok whisky pricing: import duties make whisky expensive in Thailand vs. UK/US retail prices; duty-free purchases at airport are genuinely better value for commonly available bottles; specialty and rare bottles that are unavailable elsewhere may be worth Bangkok prices; (4) Whisky tasting events: Bangkok's specialist retailers and hotel bars occasionally host distillery ambassador tastings, vertical flights, and comparative tastings — checking social media and hospitality news for current schedule reveals opportunities; (5) Japanese whisky in Bangkok: Bangkok is an excellent market for Japanese whisky including limited releases that don't reach Western markets.",
  },
];

export function BangkokCigar() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-zinc-700 mb-3">
        🍷 Bangkok premium leisure — cigars, pipe culture & whisky appreciation
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-zinc-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-zinc-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
