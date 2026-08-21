const SPOTS = [
  {
    name: "Thai Wood Carving & Traditional Crafts",
    emoji: "🪵",
    area: "Chatuchak Weekend Market (craft section, sections 7–8), Ratchada Road traditional craft shops, Thai Craft Fair at Benchasiri Park (occasional), National Museum Bangkok (craft education)",
    price: "Wood carving class: ฿1,500–4,000 half-day; Thai folk craft workshops: ฿800–2,500; Craft market purchases: ฿200–50,000+; Traditional Thai art supply stores: ฿500–5,000",
    why: "Thai wood carving is one of Southeast Asia's great craft traditions — the elaborate woodwork on temple doors, Buddha pedestals, ceremonial barges, and traditional Thai houses demonstrates centuries of accumulated mastery. The crafts extend beyond wood: Thai lacquerware (a complex layering of lacquer over bamboo frameworks), nielloware (silver inlaid with dark alloy patterns), Thai silk weaving (traditional court patterns with metallic threads), and mother-of-pearl inlay (the extraordinary decorative technique visible on wat doors and royal objects throughout Bangkok) all represent distinct Thai craft lineages. Learning opportunities in Bangkok have diversified — boutique craft workshops offering one-day introductions to Thai craft traditions have proliferated alongside the deeper apprenticeship-model schools that teach genuine mastery. The Thai government's OTOP (One Tambon One Product) program has also elevated craft from village economies into Bangkok's commercial mainstream, making authentic regional Thai crafts accessible in capital city contexts.",
    tip: "Bangkok craft exploration practical guide: (1) OTOP shops and designated craft stores: look for the OTOP certification mark on products — this indicates genuine Thai regional craft production versus mass-produced imitations; (2) The area around Ratchada Road (near Thai Cultural Center) has several traditional craft and art supply stores that serve working Thai artists and craftspeople — often better prices than tourist markets; (3) One-day intro workshops at Bangkok's boutique craft studios (lacquerware painting, traditional Thai flower garland making, golden leaf application, mother-of-pearl introduction) are excellent cultural experiences even without craft hobbyist background; (4) Chatuchak craft section vendors vary enormously in quality — examining joining techniques, finish quality, and asking about materials separates machine-made tourist products from genuine hand-craft; (5) Temple souvenir shops adjacent to major Bangkok wats sometimes sell genuinely crafted items by resident monks or associated artisan communities — these tend toward authenticity more than Khao San Road tourist market.",
  },
  {
    name: "Bangkok Leather Craft & Custom Accessories",
    emoji: "👜",
    area: "Pratunam area leather supply district, custom leather workshops in Silom/Sathorn, online leather craft communities ordering from Bangkok's leather district, specialty leather goods stores throughout the city",
    price: "Leather craft workshop: ฿1,800–5,000 for half-day; Custom leather bag: ฿3,000–30,000; Quality leather belt: ฿1,500–8,000; Leather supply district raw hide prices: ฿200–2,000/sq foot",
    why: "Bangkok has a well-developed leather goods manufacturing and craft ecosystem — partly legacy of Thailand's traditional use of leather in traditional crafts, partly driven by Bangkok's role as a manufacturing hub for international fashion brands and accessory makers. The city's leather supply district (primarily in the Pratunam and Bang Rak areas) supplies both large factories and small workshop craftspeople with quality leather at wholesale prices — creating an accessible entry point for custom leather work. Bangkok's leather craft workshop scene has grown alongside the broader maker culture: small studios offering half-day to full-day leather working classes teach basic techniques (hand-stitching, edge finishing, gusset construction) using quality leather, with participants completing a wallet, card holder, or small bag by the end of the session. Custom leather work in Bangkok — bespoke bags, belts, briefcases, and travel accessories — combines quality craftsmanship with prices significantly below equivalent European or American custom leather goods.",
    tip: "Bangkok leather craft navigation: (1) The Pratunam leather district (near Pratunam Market) has raw leather, leather supplies, and wholesale accessories at manufacturer prices — but minimum quantities and language barriers make this more accessible with a Thai-speaking guide or connection; (2) Custom leather bag workshops: several boutique leather studios in Bangkok offer 1-day workshops AND custom order services; bringing reference photos of desired pieces makes the commissioning process smoother; (3) Quality indicators for Bangkok leather goods: (a) full grain vs. corrected grain vs. bonded leather — full grain shows natural grain pattern, is most durable; (b) stitching: regular 8–10 stitches per cm, consistent spacing, saddle-stitch technique for durability; (c) hardware: brass or solid stainless hardware vs. hollow zinc alloy; (4) Leather sourcing tip: Thai leather craft uses both local hides and imported European leather — Italian vegetable-tanned leather is imported by better Bangkok leather suppliers and used in higher-end custom work.",
  },
  {
    name: "Bangkok Printmaking & Textile Printing Studios",
    emoji: "🖨️",
    area: "Sam Yan / Siam Square creative district (screen printing studios), Ekkamai creative space area, Ari neighborhood art community, individual printmaking studios throughout the city",
    price: "Screen printing workshop: ฿1,200–3,500; Risograph printing workshop: ฿1,500–4,000; Block printing workshop: ฿800–2,500; Print editions: ฿500–5,000 per piece",
    why: "Bangkok's printmaking community has grown significantly alongside the broader independent art and design scene that has expanded in areas like Sam Yan, Ari, and Ekkamai over the past decade. Traditional Thai printmaking drew from Buddhist manuscript production (accordion-fold paper manuscripts with wood-block illustrations), textile printing (hand-stamped batik-style patterns on silk and cotton), and later influenced by Western graphic arts introduced through mission schools in the 19th century. Contemporary Bangkok printmaking encompasses: (1) Screen printing — particularly strong in Bangkok's indie music, zine, and apparel communities; numerous small studios offer workshop sessions where participants screen-print their own designs onto fabric or paper; (2) Risograph printing — the Japanese risograph machine has been enthusiastically adopted by Bangkok's independent publishing community for zine production with its distinctive color palette and aesthetic; (3) Linocut and woodblock — traditional relief printing remains popular in Bangkok's fine art community; (4) Cyanotype and alternative photographic printing — photographic emulsion processes having a revival in Bangkok's art scene.",
    tip: "Bangkok printmaking community access: (1) The SAM YAN AREA (near Chulalongkorn University) has a creative cluster including printmaking studios, independent art spaces, and design-focused communities accessible to visitors; (2) Workshop booking: Bangkok printmaking workshops often fill quickly — booking 1–2 weeks in advance for weekend workshops at popular studios is advisable; (3) Zine culture: Bangkok has an active independent zine community with irregular zine fairs (Bangkok Zine Fair, occasional zine market events at Chatuchak) — attending one reveals the intersection of printmaking, independent publishing, and Bangkok's subculture scene; (4) Bring your own design: most screen printing and block printing workshops accommodate participants who bring their own designs (simplified high-contrast images work best) rather than using the studio's templates; (5) Riso print services: several Bangkok risograph studios offer print-on-demand services for independent publishers — pricing is significantly lower than offset printing for short runs (25–200 copies).",
  },
];

export function BangkokCraftsWorkshop() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-stone-700 mb-3">
        🪵 Bangkok crafts workshops — wood carving, leather making & printmaking studios
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-stone-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-stone-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
