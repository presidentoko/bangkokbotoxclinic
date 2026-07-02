const SPOTS = [
  {
    name: "Bangkok Thrift & Second-Hand Clothing",
    emoji: "👗",
    area: "Chatuchak Weekend Market (Section 2–5, vintage section), RCA vintage strip, On Nut thrift cluster",
    price: "Vintage jeans ฿300–2,000; Branded second-hand ฿500–5,000; Basic thrift ฿50–300",
    why: "Bangkok has a significant thrift and vintage clothing ecosystem — the Chatuchak Weekend Market's vintage clothing section is one of the largest in Southeast Asia, with vendors sourcing from Japan, Europe, and the US alongside domestic second-hand collections. The appeal is layered: young Bangkok creatives seek unique garments for street style, international visitors appreciate pricing (heavily discounted from Western resale prices on same items), and sustainability-conscious shoppers prefer second-hand over fast fashion. Bangkok's vintage scene skews heavily Japanese second-hand (used Japanese workwear, denim, and brand pieces are abundant) — reflecting the trade flow of Japanese vintage exports to Southeast Asian markets. The On Nut area has developed as a budget vintage hub: non-tourist-area pricing on comparable quality.",
    tip: "Chatuchak vintage sections: arrive before 10am for best selection (dealers sell to other dealers and serious buyers in early hours). The sections labeled for vintage clothing are 2, 3, 4, and 5 — vendors may move seasonally, so wandering rather than seeking specific stalls is more effective. Japanese brand second-hand in Bangkok: workwear labels (Evisu, Kapital, Japan Blue, Sugar Cane), archive sportswear, and Japanese street brands appear at Bangkok prices significantly below Japanese domestic second-hand or Western resale platforms. Authentication of luxury second-hand: Bangkok has many good counterfeit-detection resources but also abundant fakes — for investment-level purchases, stick to established resellers with return policies. Bangkok thrift apps: local Thai apps (LMD App, secondhand Facebook groups) supplement physical shopping with curated resellers.",
  },
  {
    name: "Japanese Second-Hand Shops in Bangkok",
    emoji: "🇯🇵",
    area: "Roppongi Used Clothing Bangkok (Asoke), Hard Off-style shops (various), Japanese consignment in Thonglor",
    price: "Japanese workwear piece ฿800–8,000; Archive Nike/Adidas ฿1,500–20,000; Japanese denim ฿1,500–15,000",
    why: "Bangkok's Japanese second-hand specialty market has grown alongside the city's large Japanese expat community and the global appetite for Japanese vintage — brands including Comme des Garçons, Yohji Yamamoto, Issey Miyake, and A Bathing Ape appear in Bangkok vintage specialists at prices above Chatuchak but below Western resale. The Japanese community's high-standard wardrobing and regular donation culture means steady flow of authentic Japanese vintage into Bangkok's second-hand market. Some Bangkok shops specifically target this market: Japanese-managed consignment shops in Thonglor source directly from Japanese community wardrobes — quality control is higher and authentication more reliable than general market stalls.",
    tip: "Bangkok Japanese vintage finding strategy: Japanese-owned or Japanese-managed second-hand shops in Thonglor are the most reliably authentic for archive designer pieces. Online marketups: Japan-based Mercari and Yahoo Auctions Japan ship to Thailand and offer access to Japanese second-hand inventory at Japanese prices (plus shipping) — a viable alternative when Bangkok's local supply lacks specific pieces. Deadstock (unworn old stock): Bangkok occasionally surfaces Japanese deadstock items — new-condition vintage garments with original tags — at extremely compelling prices relative to their Western resale value. Seasonal rotation: Bangkok thrift inventory changes with seasons — Japanese summer items arrive in Thai winter, winter items in Thai summer, reflecting Japan's donation cycle and shipping delay.",
  },
  {
    name: "Korean Fashion Resale & Import in Bangkok",
    emoji: "🇰🇷",
    area: "Korean fashion import shops (Thonglor Soi 13 'Korean Street'), Siam Square Korean fashion, Korea Town",
    price: "Korean brand second-hand ฿500–5,000; Korean import new clothing ฿800–8,000",
    why: "Bangkok's Korean fashion market serves the city's large Korean expat community and the broader Thai K-culture following. Korean fashion (ader error, TheHandsome, Matin Kim, and hundreds of independent Korean labels) appears in Bangkok through: Korean expat-operated import boutiques (direct imports from Dongdaemun and Korean online platforms), Thai buyers who travel to Seoul and import for resale, and second-hand from the Korean community wardrobing. Thonglor's Korean corridor (near Soi 13) has become a concentrated Korean lifestyle zone — Korean restaurants, beauty shops, and fashion boutiques create an ecosystem that brings Korean fashion choices without international travel. Korean streetwear labels with global hype (we11done, Ambush, Post Archive Faction) appear at Bangkok resellers at Asian resale market prices.",
    tip: "Bangkok Korean fashion market distinctions: brand-new imported Korean fashion versus Korean second-hand are typically different shops with different clientele — the new imports serve Koreans needing specific brands, while the resale market serves trend-conscious Thai buyers. Authenticity note: the K-fashion market in Bangkok includes both authentic imports and high-quality Thai-produced copies of Korean labels — ask specifically about origin. Thai-designed Korean-aesthetic fashion: Bangkok's local fashion designers increasingly produce in a Korean aesthetic vocabulary — some of the best value Korean-style Bangkok fashion is actually Thai-designed and produced, sold at Thai prices.",
  },
];

export function BangkokThriftShop() {
  return (
    <div className="rounded-2xl border border-lime-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-lime-700 mb-3">
        👗 Thrift & vintage shopping in Bangkok — second-hand, Japanese used clothing & Korean fashion
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-lime-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-lime-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
