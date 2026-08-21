const SPOTS = [
  {
    name: "Bangkok Supercar & Exotic Car Rental",
    emoji: "🏎️",
    area: "Supercar rental companies in Sukhumvit area: Exotic Auto Thailand (Asok), Driver Thailand (multiple locations), Thailand Supercar (Silom), premium hotel concierge connections, private owner-driver services throughout Bangkok",
    price: "Lamborghini/Ferrari (per day): ฿30,000–80,000; Porsche 911 (per day): ฿15,000–30,000; Premium Mercedes/BMW (per day): ฿5,000–12,000; Chauffeur-driven supercar experience (3 hours): ฿8,000–25,000; Full weekend supercar rental: ฿60,000–200,000",
    why: "Bangkok's exotic and supercar rental market has grown substantially — driven by the combination of Thailand's growing high-net-worth resident population, the significant premium car market (Thailand is among the world's largest Lamborghini and Ferrari markets per capita), and the appeal to international visitors who want to experience Bangkok from a different perspective. Legitimate supercar rental companies in Bangkok provide a surprisingly accessible path to experiencing vehicles that would cost 2–3x more per day in equivalent European or US rental markets. The Bangkok driving experience in a supercar is fundamentally different from European driving: traffic is dense and often slow in the city (meaning the exotic car becomes more about the experience of being in the vehicle and being seen than about performance driving), while highway runs to Pattaya or Kanchanaburi allow actual high-speed driving in straight-line performance. The visual and social dynamics of arriving in a Lamborghini or Ferrari in Bangkok's social scene (particularly in Thonglor and Ekkamai entertainment areas) create experiences that local affluent Bangkok society has normalized within its lifestyle culture.",
    tip: "Bangkok supercar rental navigation: (1) Insurance is critical: legitimate Bangkok supercar rental companies carry comprehensive insurance with clearly defined excess (deductible) amounts — understanding the coverage and excess before signing is essential; (2) International driving license: Thailand requires an international driving permit (IDP) alongside your home license for driving; obtaining this from your home country's automobile club before departing is the straightforward approach; (3) Traffic reality check: Bangkok's city traffic means supercars spend significant time in slow traffic where the performance advantage is irrelevant; clients who want highway performance typically plan a Sukhumvit–Pattaya highway run (using the expressway to get out of the city) or the beautiful mountain roads of Khao Yai; (4) Photography package: most Bangkok supercar rental companies offer photography services alongside the vehicle; having professional photos taken with the vehicle is part of the Bangkok supercar rental culture; (5) Legitimate vs. grey market: use only companies with clear business registration, proper insurance documentation, and transparent rental contracts; Bangkok's supercar rental market has both professional operators and informal 'owner wants income' arrangements with very different risk profiles.",
  },
  {
    name: "Bangkok Classic Car Scene & Vintage Automobiles",
    emoji: "🚗",
    area: "Classic car showrooms in Bang Na district, vintage car meets (periodic events at Bang Na, Siam Circuit area), Royal Automobile Association of Thailand events, private collector circles throughout Bangkok",
    price: "Classic car show admission (typical): ฿200–500; Private collector consultation (finding a vehicle): variable; Bangkok classic car purchase (vintage Thai-market cars): ฿300,000–5,000,000+; Classic car restoration services: ฿100,000–1,000,000+",
    why: "Bangkok harbors a serious classic car community built on Thailand's unique automotive history — the decades when Thai import duties were prohibitively high meant that Thais kept vehicles running far longer than Western counterparts, creating a stock of genuinely vintage cars in various states of preservation. The Thai classic car scene has particular strength in: (1) American iron from the 1950s–60s — the post-WWII American military and commercial presence in Thailand deposited American-made vehicles that became deeply integrated into Thai car culture; (2) Classic Japanese vehicles — the Toyota Crown, Datsun, and Honda variants that shaped Thai motoring are now collectible; (3) European classics — particularly Mercedes-Benz ponton and fin-tail era vehicles that the Thai aristocracy and military establishment imported; (4) Classic Thai tuk-tuks and Baht buses — vintage versions of Bangkok's iconic three-wheeler and the minibus-on-pickup-truck format. The Royal Automobile Association of Thailand (RAAT) hosts events that draw Bangkok's most serious classic car collectors and provide access to private collections.",
    tip: "Bangkok classic car exploration: (1) Bang Na showrooms: the Bang Na area (eastern Bangkok, near Mega Bangna mall and Suvarnabhumi Airport expressway) has concentrated several of Bangkok's classic car specialists — dealers who import, restore, and sell vintage vehicles; visiting this district on weekday mornings finds the most active dealer stock; (2) Classic car events: Bangkok hosts several annual classic car events (Thailand Grand Prix circuit events, RAAT rallies, luxury lifestyle events at Impact Arena) that concentrate the enthusiast community; (3) Restoration quality: Bangkok has skilled automotive restoration workshops — Thai craftsmen capable of period-correct paint, upholstery, and mechanical restoration at rates significantly below what equivalent work costs in Europe or the US; (4) Import considerations: vehicles manufactured before 1991 are classified differently for import duty purposes in Thailand; understanding the current regulations is essential before considering a Bangkok classic car purchase; (5) Community access: Bangkok's classic car community is relationship-driven; being introduced by an existing community member opens access to private sales, events, and the most interesting private collections.",
  },
  {
    name: "Bangkok Track Day & Performance Driving",
    emoji: "🏁",
    area: "Bira Circuit (Pattaya, 150km from Bangkok) — Thailand's international FIA circuit; Bangkok Kart Circuit (Bangna); Siam Circuit (Samut Prakan, near Bangkok); occasional events at Don Mueang Airport area",
    price: "Track day at Bira Circuit (open pitlane): ฿5,000–10,000 per session; Private circuit hire (for group): ฿100,000–500,000/day; Performance driving instruction: ฿15,000–40,000 per session; Karting at Bangkok circuit: ฿500–1,500/session; Race car passenger lap (Bira): ฿5,000–15,000",
    why: "Thailand's motorsport infrastructure centers on Bira International Circuit in Pattaya (Bang Saen area, 150km from Bangkok) — an FIA Grade 2-certified permanent circuit that hosts everything from grassroots club racing to international touring car events. For Bangkok visitors or residents wanting actual performance driving beyond city traffic, Bira Circuit is the primary option — offering track days where participants bring their own vehicle or rent from circuit-partnered companies, and instruction sessions with racing drivers who provide heel-toe, trail braking, and cornering technique coaching. The circuit also hosts regular karting and the occasional supercar track experience package where participants receive passenger laps in professional racing vehicles before driving themselves. Bangkok's supercar rental companies increasingly offer circuit-day packages that combine car hire with Bira Circuit access — solving the 'where can I actually drive it fast' problem that accompanies city-only supercar rental.",
    tip: "Bangkok performance driving practical information: (1) Bira Circuit distance from Bangkok: the circuit is approximately 2 hours from central Bangkok by highway; early departure (6–7am) avoids Bangkok morning traffic and reaches the circuit before the day's heat peaks; (2) Booking track days: Bira Circuit tracks days are bookable through their official website and through the circuit's affiliated instructor/driver network; weekday track days have fewer participants and more track time per person than weekend events; (3) Helmet and suit requirements: bringing your own SNELL-certified helmet enables participation; borrowed helmets are typically available from track operators; fire suits are required for open-wheel driving and recommended for high-speed track sessions; (4) Vehicle preparation before track days: any vehicle being brought to a track day should have brake pads checked (track driving consumes brake material far faster than street driving) and tire condition verified; (5) Corporate track day format: Bira Circuit and Bangkok Kart circuit both offer corporate group event packages with catering, team competition formats, and photography that work for company events or premium group experiences.",
  },
];

export function BangkokLuxuryCar() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-zinc-700 mb-3">
        🏎️ Bangkok car culture — supercar rentals, classic cars & track day performance driving
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
