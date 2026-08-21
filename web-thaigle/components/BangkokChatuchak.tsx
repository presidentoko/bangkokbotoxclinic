const SPOTS = [
  {
    name: "Chatuchak Weekend Market — Navigation Guide",
    emoji: "🏪",
    area: "Chatuchak District, northwest Bangkok — MRT Chatuchak Park, BTS Mo Chit (5-minute walk)",
    price: "Entry free; Items ฿30–5,000+; Budget ฿500–3,000 for a shopping day; Meals ฿80–250",
    why: "Chatuchak Weekend Market (JJ Market) is the world's largest weekend market — 35 acres, 15,000 stalls, and reportedly up to 200,000 visitors on peak Sundays. It operates Saturday and Sunday only (most stalls open 9am–6pm; some sections open Friday evenings for wholesale). The market is organized into 27 numbered sections with product categories: Section 2–4 (plants and gardening), Section 7–8 (home décor and furniture), Section 26 (art and antiques), Section 15–17 (vintage clothing), Section 10–14 (accessories and fashion), and Section 2 (ceramics and pottery). The sheer scale makes it easy to be overwhelmed — successful visits require either a section-by-section strategy for specific categories or simply accepting that you'll find unexpected things while walking. The authentic local food stalls within the market are excellent.",
    tip: "Chatuchak survival guide: go early (opening time 9am) to avoid the midday heat and weekend crowd peak (11am–3pm is maximum congestion). Navigate by section number — numbered entrance gates and within-market maps identify sections. Water and heat management are real considerations — Bangkok weekend heat in the open market is intense; hydrate before arriving, identify shade when needed, and consider leaving by 1–2pm before afternoon peak heat. Bargaining: expected and appropriate in this context; starting at 60% of asking price and settling around 70–75% is typical. Do NOT bargain aggressively at food stalls — food prices are already fair. The plant section (Section 2–4) is exceptional — some of Bangkok's most unique tropical plants at prices far below international garden centers.",
  },
  {
    name: "Night Markets & Pop-Up Markets",
    emoji: "🌙",
    area: "Rot Fai Night Market (Ratchada/Srinakarin), Asiatique (Chao Phraya riverfront), various rotating locations",
    price: "Entry free (Asiatique has Ferris wheel ฿250); Street food ฿40–200; Shopping ฿100–3,000",
    why: "Bangkok's night market scene extends well beyond Chatuchak — the city has developed an excellent permanent and rotating night market ecosystem. Rot Fai (Train) Night Market at Ratchada Rot Fai Park (also known as Talad Rod Fai Ratchada, accessible via MRT Thailand Cultural Centre): a large vintage/retro-themed market with car culture, vintage clothing, antiques, and food courts open Thursday–Sunday from 5pm–midnight. Rot Fai Market Srinakarin (further out but the original): similar format but larger scale with more authentic vintage items. Asiatique the Riverfront is the most tourist-polished night market — warehouse complex along the Chao Phraya with Ferris wheel, live shows, restaurants, and hundreds of stalls, reachable by free shuttle boat from Saphan Taksin BTS pier.",
    tip: "Night market timing: arrive after 6pm when stalls are fully open and the atmosphere is at its best — earlier arrivals find half-closed stalls. Rot Fai Ratchada practical: the MRT Thailand Cultural Centre station is a 5-minute walk; the market wraps around the park's exterior. Authentic bargaining: night market bargaining is expected and friendly — start negotiations with a reasonable counter-offer. Bangkok's pop-up market calendar: new concept markets (organic markets, design markets, vintage markets) appear and move regularly — Instagram and Bangkok event Facebook groups track current locations. Artisan markets: TCDC Creative Market (rotating, creative professional focus) and the markets at The Commons (Thong Lor) and Onyx market (nearby) serve the design-conscious community.",
  },
  {
    name: "Or Tor Kor & Fresh Markets",
    emoji: "🥭",
    area: "Or Tor Kor Market (Chatuchak area, next to JJ Park, MRT Chatuchak Park exit)",
    price: "Durian ฿200–1,000/kg (season dependent); Fresh fruit ฿50–300/selection; Prepared food ฿80–200",
    why: "Or Tor Kor (OTK) is Bangkok's premium fresh market — designated by CNN Travel as one of the world's top fresh markets. Unlike street markets, Or Tor Kor is air-conditioned, clean, and sells the highest quality produce from across Thailand: the country's best tropical fruits (durian, mangosteen, rambutan, longan, dragon fruit, sa la, jackfruit), the highest grade seafood and meat, premium preserved and fermented foods, and prepared dishes from vendors with generations of market expertise. Located immediately adjacent to Chatuchak Weekend Market (making a Saturday/Sunday combination trip the standard approach), Or Tor Kor operates daily 6am–7pm. The durian section (during May–August durian season) is an event unto itself — more varieties and grades of durian than most visitors have ever seen.",
    tip: "Or Tor Kor practical guide: the market is organized into fresh produce, meat/seafood, prepared food, and preserved food sections. Durian buying: staff at good OTK stalls will open a durian for you to inspect before buying — accept this service. The prepared food section (ready-to-eat dishes and sweets) at the market's interior is exceptional quality at middle prices — an excellent lunch option. Fruit tasting: most fruit stalls will offer small tastes of fruits you're unfamiliar with — especially during peak season for unfamiliar varieties. Or Tor Kor vs. Chatuchak timing: the market combination of OTK (morning, 7–10am) followed by JJ Market (10am–2pm) uses the day efficiently and avoids the worst of both markets' peak heat.",
  },
];

export function BangkokChatuchak() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🏪 Bangkok markets — Chatuchak, night markets & Or Tor Kor fresh market guide
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-amber-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
