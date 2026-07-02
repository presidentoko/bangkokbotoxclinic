const SPOTS = [
  {
    name: "Bangkok's Jewelry District & Gems",
    emoji: "💎",
    area: "Silom Road gem district, Mahanak gem district (near Wangburapa), Silom/Bangrak jewelry shops",
    price: "Thai gold (baht weight) ฿30,000–35,000/baht; Ruby/sapphire range ฿500–500,000+; Custom jewelry varies",
    why: "Bangkok is one of the world's major centers for colored gemstone trading — Thailand is the world's largest exporter of processed rubies, sapphires, and other colored stones, with the gem district on and around Silom Road hosting hundreds of wholesalers and retailers. The Bangkok gem market divides: wholesale (Mahanak area, requires trade credentials), retail (Silom jewelry shops, Siam Paragon's higher-end jewelry floor), and custom fabrication (design, stone setting, and goldsmithing services throughout). Thai gold jewelry (23.5k gold, distinctive yellow) is sold by baht weight with a fabrication premium — the price is transparent and linked to the daily gold market rate. Bangkok is the starting point for sapphires from Sri Lanka, Myanmar rubies, and Thai rubies and sapphires from Chanthaburi province.",
    tip: "Bangkok gem market consumer protection: the Thai gem and jewelry market has had historical issues with tourist scams — any street-directed 'today only' government export discount gem deal is fraudulent without exception. For legitimate gem purchase: Silom Road's established jewelry shops (with fixed premises, display windows, receipts, and certificates) are genuine; Chanthaburi province (a day trip from Bangkok, 4 hours) is the world's largest colored gemstone trading market if you want wholesale prices. Thai gold shop system: gold shops display their own prices prominently (linked to the daily gold price) — there's no negotiation on gold weight price, only fabrication charge. For custom engagement rings: Bangkok's custom jewelry fabrication (consultation, stone selection, CAD design, casting, setting) can produce international-quality work at 30–50% of Western prices through established jewelers.",
  },
  {
    name: "Contemporary Jewelry Design",
    emoji: "💍",
    area: "Design galleries (TCDC, BACC area shops), Chatuchak designer jewelry section, craft markets",
    price: "Artisan jewelry ฿800–30,000; Designer piece ฿2,000–80,000+",
    why: "Bangkok has a growing contemporary jewelry design community — Thai jewelry designers trained at international art schools (Central Saint Martins, RCA in London, Parsons in New York) have returned to Bangkok and established design practices that blend Thai cultural motifs with contemporary aesthetics. The TCDC (Thailand Creative and Design Center) adjacent community in Charoen Krung nurtures product designers including jewelry designers. Thai-material-specific design: jewelry incorporating Thai silk thread, lac, traditional niello silverwork (krueang tong), and lotus fiber represents jewelry uniquely tied to Thai material culture. Bangkok's contemporary jewelry differs from the gem trade — it's conceptual art jewelry as much as precious object.",
    tip: "Finding Bangkok contemporary jewelry: BACC's commercial gallery floors and adjacent design shops in the Siam area, Chatuchak's section 26 (designer objects), and the Bangkok Design Week pop-up market (January) provide access to Bangkok's contemporary jewelry designers. Bangkok design markets: several seasonal design markets (The Jam Factory on weekends, Saturday night markets at Asiatique) feature independent jewelry designers at emerging artist prices. Thai niello silverwork: traditional krueang tong (decorated with dark niello inlay on silver) is a distinctly Thai craft — available from traditional silversmiths in Nakhon Si Thammarat (near Bangkok) and select Bangkok craft shops. For wearable silver: Thai silversmithing at the craft level (less refined but authentic) is available at Chatuchak at accessible prices.",
  },
  {
    name: "Gold & Buddhist Amulets",
    emoji: "🙏",
    area: "Tha Phra Chan amulet market (Sanam Luang riverside), Chatuchak amulet section, temple fair amulets",
    price: "Common amulets ฿50–500; Certified antique/monk-blessed ฿1,000–1,000,000+; Gold votive offerings ฿500–10,000",
    why: "The Buddhist amulet market in Bangkok is a serious commercial and spiritual ecosystem — Tha Phra Chan Amulet Market (near Thammasat University, riverside) is the largest dedicated amulet market in Southeast Asia, operating daily. Amulets (phra kruang) created by revered monks carry believed protective power; their value is determined by the issuing monk's reputation, age, condition, rarity, and certified provenance. The amulet market has a collector dimension independent of religious belief — certified antique amulets from famous historical monks command prices comparable to fine art or rare numismatic coins. Thai gold Buddha images and Ganesha figures serve as both decorative objects and devotional items — available from temple shops, specialist religious objects stores, and the amulet markets.",
    tip: "Amulet market etiquette: treat the amulet market with the same respect as a temple — Buddhist imagery and blessed objects deserve consideration. For casual visitors: the amulet market is fascinating to observe without purchasing — the diversity of amulet types, the magnifying glass inspections of serious collectors, and the social energy of the market make it an extraordinary cultural observation site. Buying amulets as a non-Buddhist: generally acceptable — amulets in Thailand are worn by people of various beliefs, and foreign collectors are welcomed by vendors. For serious amulet collecting: the certification and grading system (from the Chao Phraya Amulet Center and other recognized authentication bodies) distinguishes collectible certified pieces from decorative reproductions — certified examples have graded value.",
  },
];

export function BangkokJewelry() {
  return (
    <div className="rounded-2xl border border-yellow-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-3">
        💎 Jewelry & gems in Bangkok — Silom gem market, contemporary design & Buddhist amulets
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-yellow-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-yellow-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
