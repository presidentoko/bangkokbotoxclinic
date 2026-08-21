const SPOTS = [
  {
    name: "Bangkok Street Fashion & Youth Culture",
    emoji: "👗",
    area: "Siam Square (Bangkok's original street fashion epicenter), Chatuchak Weekend Market (section 5–8 youth fashion), Platinum Fashion Mall, Asiatique night market",
    price: "Street fashion items: ฿200–2,000; Platinum Mall wholesale: ฿80–500/piece; Chatuchak fashion: ฿150–1,500; Custom made fashion: ฿500–5,000",
    why: "Bangkok's street fashion culture is one of Southeast Asia's most dynamic — the city serves as a regional fashion trendsetting hub where K-pop influenced styles, Japanese Harajuku aesthetics, local Thai design sensibility, and Western streetwear converge in a uniquely Bangkok synthesis. Siam Square (particularly the Siam Square One complex and the surrounding soi areas) has been Bangkok's youth fashion center for decades — young Thai designers, indie boutiques, and experimental fashion sit alongside Korean beauty stores and Japanese fashion imports. Bangkok's fashion identity has evolved significantly: the current generation of Thai designers is internationally trained and commercially sophisticated, producing Thai-made fashion that competes internationally while drawing on local craft traditions and tropical aesthetic. The Chatuchak Weekend Market fashion sections are remarkable for both independent designers selling original work and vintage dealers with extensive Thai and international vintage clothing.",
    tip: "Bangkok fashion shopping guide: (1) Siam Square soi exploration: the numbered soi off Siam Square's main pedestrian area have independent boutiques, small Thai designer shops, and experimental fashion studios not found in malls; (2) Platinum Fashion Mall (near BTS Ratchaprarop): 2,000+ stalls selling wholesale fashion at near-factory prices — genuinely exceptional value but requires minimum quantity purchasing (usually 3–5 pieces per style) for best pricing; individual piece pricing is available but higher; (3) Chatuchak section 5–8 for vintage and independent fashion: arrive at opening (8am Saturday/Sunday) for best selection; (4) Thai fast fashion: Jaspal, Jaspal Sport, and similar Thai fashion chains in malls offer good-quality basics and workwear at middle-market prices — quality is often better than international fast fashion equivalents.",
  },
  {
    name: "Tailor-Made Fashion in Bangkok",
    emoji: "✂️",
    area: "Tailoring district along Silom Road and Sukhumvit Soi 3–13, Khao San Road tourist tailors, MBK Center tailor shops, hotel arcade tailors",
    price: "Men's suit (2-piece): ฿5,000–25,000; Women's dress: ฿2,000–15,000; Shirt: ฿1,000–3,500; Alterations: ฿200–1,000; Replica design: 30–50% of original garment price",
    why: "Bangkok custom tailoring is globally known — the city's tailoring tradition (driven by the large expat business community, international business traveler traffic, and Thai expertise in fabric sourcing and construction) produces quality custom garments at prices dramatically below equivalent Western tailoring. Bangkok's established tailoring street (Silom area) has shops that have been producing suits for decades for returning international clients. The quality differential in Bangkok tailoring is significant: the best Bangkok tailors (Ricky's, Raja's Fashions, and a handful of others consistently recommended in expat communities) produce genuinely excellent garments — while tourist-facing shops with pressure salespeople and very low prices often produce poor results. Linen, silk, and tropical-weight wool fabrics available at Bangkok tailors make the city particularly good for tropical climate formal wear.",
    tip: "Bangkok tailor guide: (1) Time allocation: quality custom tailoring requires minimum 2 fittings — first fitting to check construction, second fitting for adjustments. A 3-day turnaround is genuinely possible but 5–7 days produces better results; (2) Photograph your existing garments: bringing a suit or shirt that fits well as a reference (or photographs from multiple angles) communicates fit preferences that words often fail to convey; (3) Research recommendations: expat forums (Thaivisa.com, Bangkok Expats Facebook, Reddit /r/ThailandTourism) have extensive tailor discussions — recommendations from return customers over years of experience are the most reliable quality signal; (4) Deposit payments: reputable tailors take 30–50% deposits, not 100% upfront — a shop requiring full payment before work is started is a quality warning sign.",
  },
  {
    name: "Bangkok Sneaker Culture",
    emoji: "👟",
    area: "Central Embassy, Siam Center and Siam Paragon, Street fashion markets, Asiatique sneaker vendors",
    price: "Domestic Thai sneaker brands: ฿800–3,000; Global brands at Thai retail: 5–20% below Western retail; Rare/limited releases: varies dramatically; Replica sneakers at markets: ฿300–1,500",
    why: "Bangkok has a significant sneaker culture — the combination of the Thai youth fashion identity, the city's position in global sneaker distribution (Thai retail often receives limited Nike/Jordan/Adidas releases), and the large youth spending power of Bangkok's middle class has produced a vibrant sneaker community. Bangkok sneaker highlights: Nike and Adidas Thailand flag stores at Siam Center and Siam Paragon receive brand release allocations that sometimes include limited regional editions; Jordan Brand culture is particularly strong among Bangkok's young fashion community; the vintage/retro sneaker market in Bangkok's fashion districts has Thai collectors with serious collections. Thai domestic sneaker brands: several Thai fashion brands produce quality sneakers at accessible prices — Fly shoes and local athletic brands available at Chatuchak are significantly cheaper than international equivalents with comparable construction quality.",
    tip: "Bangkok sneaker purchasing: (1) Limited release information: following Nike Thailand, Adidas Thailand, and New Balance Thailand Instagram accounts provides advance notice of exclusive releases — these sell out immediately at retail; (2) Siam Center's 'Siam Center THE CRAFT' area has the highest concentration of legitimate premium and limited sneaker vendors in Bangkok; (3) Replica awareness: Bangkok's markets sell high-quality sneaker replicas — these are counterfeit goods and carry import duty and legal risk if carried across borders in quantity; wear-home personal use is a different situation than commercial quantities; (4) End-of-season sales: Thai retail has significant year-end and mid-year sales events (similar to global patterns) where athletic footwear is heavily discounted — October and April see the deepest sale pricing at department stores.",
  },
];

export function BangkokStreetFashion() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        👗 Bangkok street fashion — youth culture, custom tailoring & sneaker scene
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-pink-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-pink-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
