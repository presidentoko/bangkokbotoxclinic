const TOPICS = [
  {
    title: "Crime & Personal Safety",
    emoji: "🔒",
    summary: "Bangkok is generally safe for tourists and expats — Thailand consistently ranks as one of Asia's safer countries for visitors. Violent crime against foreigners is statistically rare; the risks that exist are different. Bag snatching from motorbikes occurs around popular tourist areas (especially Khao San Road area, Silom evening hours). Pickpocketing in crowded areas (BTS during rush hour, night markets) warrants awareness. The tuk-tuk gem scam (being taken to overpriced shops instead of attractions) and the 'Grand Palace is closed today — follow me' approach scam are still active in the historical tourist core. Drink spiking in entertainment districts requires awareness when accepting drinks from strangers.",
    action: "Keep valuables in a front bag or cross-body; use ATMs inside 7-Elevens or bank lobbies (not street ATMs); arrange transport through apps (Grab/Bolt) rather than unmarked taxis; keep a scan of your passport separate from the original.",
  },
  {
    title: "Traffic & Road Safety",
    emoji: "🚗",
    summary: "Road traffic is Bangkok's most significant safety risk to visitors. Thailand has one of the world's higher road fatality rates — motorcycles are the leading risk vehicle. The BTS Skytrain and MRT subway are extremely safe. Traffic as a pedestrian hazard: Bangkok traffic flow disregards pedestrian crossings in practice — the 'look both ways' instruction applies even at signaled crossings. Motorbike taxis (orange vest riders) are efficient but higher risk than cars — helmet provision is mandatory by law but inconsistently enforced. Songkran (Thai New Year, mid-April) significantly elevates traffic accidents nationally.",
    action: "Prioritize BTS/MRT over road transport for most Bangkok movement; if renting a motorbike anywhere in Thailand, wear a helmet and have the required international driving permit; avoid road trips during Songkran holiday period.",
  },
  {
    title: "Food, Water & Health Safety",
    emoji: "🏥",
    summary: "Bangkok tap water is not recommended for drinking — safe bottled water is universally available and inexpensive (฿7–15 per bottle). Street food in Bangkok is generally safe when freshly cooked and hot — the risk is in pre-cooked items sitting at ambient temperature, not in fresh wok-cooked food. Sun exposure in Bangkok is intense — sunstroke is a genuine risk for those unused to tropical heat, especially during outdoor sightseeing. Bangkok's hospitals (Bumrungrad, Bangkok Hospital, Samitivej) are internationally excellent — medical care is easily accessible and comparatively inexpensive. Travel insurance covering medical evacuation is recommended for extended stays.",
    action: "Drink bottled or filtered water only; choose freshly cooked street food over pre-plated displays; keep oral rehydration salts if staying long-term; locate the nearest international hospital to your accommodation before you need it.",
  },
  {
    title: "Scams Targeting Tourists",
    emoji: "⚠️",
    summary: "Bangkok has a set of well-documented scams that persist because they work on new arrivals. The pattern is consistent: a friendly local approaches and offers help, builds rapport briefly, then leads the visitor to an overpriced shop where the local receives a commission. Tuk-tuk drivers who offer cheap city tours are typically operating this model. Gem shops claiming a one-day government discount are a particularly costly scam — some visitors lose significant sums. Black-market currency exchange offering superior rates is fraudulent (official rates apply consistently). Airport taxi touts (people in the arrivals hall offering private cars) charge significantly above meter rates.",
    action: "Use only the official meter taxis (refuse surcharges on top of meter) or Grab; decline tuk-tuk tours below market rates; never buy gems or jewelry based on a stranger's recommendation; use bank ATMs or bank exchange booths for currency.",
  },
];

export function BangkokSafetyGuide() {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-red-700 mb-3">
        🔒 Bangkok safety guide — crime, traffic, scams & health for visitors & residents
      </h2>
      <div className="space-y-2">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-red-100 rounded-xl p-3 group">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
              <span className="text-xl shrink-0">{t.emoji}</span>
              <span className="font-bold text-xs flex-1">{t.title}</span>
              <span className="text-[10px] text-red-400 group-open:hidden">▼ expand</span>
              <span className="text-[10px] text-red-400 hidden group-open:inline">▲ collapse</span>
            </summary>
            <div className="mt-2 space-y-1">
              <div className="text-[10px] text-[var(--fg)] font-medium leading-snug">{t.summary}</div>
              <div className="text-[10px] text-red-700 leading-snug">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
