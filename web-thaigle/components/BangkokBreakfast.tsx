const OPTIONS = [
  {
    name: "Thai Street Breakfast (Jok & Khao Tom)",
    emoji: "🍚",
    area: "Street stalls across Bangkok, best near markets",
    price: "฿30–80 per dish",
    why: "Authentic Thai breakfast: jok (congee/rice porridge with pork, ginger, soft egg), khao tom (boiled rice soup), kuay teow (noodle soup). Available from 5:30am outside fresh markets. Very gentle on the stomach, deeply comforting. What most Bangkok locals actually eat for breakfast.",
    where: "Pak Khlong market area (flower market) has some of the best 5am breakfast vendors. Also any fresh market entrance — look for the steam clouds.",
  },
  {
    name: "Kaya Toast (Singapore-Style Thai-Chinese)",
    emoji: "🍞",
    area: "Coffee shops throughout Bangkok, especially Silom",
    price: "Set meal ฿60–120",
    why: "Bangkok's beloved kopitiam-style breakfast: kaya (pandan coconut jam) spread on thick-cut toasted white bread, soft boiled eggs with kecap manis (sweet dark soy), strong Thai iced coffee or hot Milo. Chinese-Thai kopitiam culture serves this until 11am.",
    where: "Ek Coffee, Porcupine Café and similar Chinese-Thai coffee shops in Silom, Chinatown, and Bang Rak areas. The older the shophouse, the better the kaya toast.",
  },
  {
    name: "Hotel Breakfast Buffet",
    emoji: "🥐",
    area: "5-star hotels city-wide",
    price: "฿550–2,500 per person depending on hotel",
    why: "Bangkok's hotel breakfast buffets are internationally renowned for variety and quality. Thai section (noodles, congee, satay), Western section (eggs any style, pastries, cold cuts), Asian section (dim sum, miso), fresh fruit wall. JW Marriott, Mandarin Oriental, and Capella Bangkok are top-tier.",
    where: "Hotel breakfast is also sold to walk-in guests at most 5-stars — call ahead. Sunday brunch at Capella Bangkok (฿3,200+) is a Bangkok bucket-list experience.",
  },
  {
    name: "Brunch Culture (Thonglor/Ekkamai)",
    emoji: "🥑",
    area: "Thonglor, Ekkamai, Ari neighborhoods",
    price: "฿250–650 per dish",
    why: "Bangkok's trendy brunch scene: avocado toast, eggs Benedict, acai bowls, cold brew coffee, Instagrammable presentations. Thonglor and Ekkamai have Bangkok's most developed café brunch culture. Open 9am–2pm Saturday/Sunday with queues at popular spots.",
    where: "Popular brunch spots: The Commons Thonglor (outdoor food market with multiple stalls), W District, various Ekkamai sois with independent café clusters. Arrive before 10am to avoid queues at most popular spots on weekends.",
  },
];

export function BangkokBreakfast() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        🍳 Breakfast in Bangkok — street food, kaya toast, hotel buffets & brunch
      </div>
      <div className="space-y-2">
        {OPTIONS.map((o) => (
          <div key={o.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{o.name}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{o.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{o.why}</div>
            <div className="text-[10px] text-yellow-700">📍 {o.where}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
