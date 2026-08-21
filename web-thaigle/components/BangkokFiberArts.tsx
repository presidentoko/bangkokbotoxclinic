const SPOTS = [
  {
    name: "Thai Embroidery & Beadwork Traditions",
    emoji: "🪡",
    area: "Traditional craft markets (Chatuchak sections 7–8, sections 22–26), Thai silk weaving workshops in Bang Rak and Pratunam areas, specialist embroidery studios in Silom, Jim Thompson House (educational display)",
    price: "Embroidery workshop (3–4 hours): ฿800–2,500; Traditional Thai embroidery supplies: ฿200–2,000; Beadwork beginner set: ฿400–1,500; Completed embroidered textile: ฿1,000–50,000+",
    why: "Thai embroidery encompasses a range of regional and courtly traditions — from the elaborately gold-threaded court robes of traditional Rattanakosin formal dress to the colorful geometric beadwork of hill tribe communities (Karen, Akha, Hmong) to the fine silk embroidery of Thai bride and groom wedding garments. Each tradition has distinct aesthetics, techniques, and cultural significance. The most accessible Thai embroidery for visitors is workshop-based — boutique studios in Bangkok offer introductions to Thai hand embroidery techniques using silk thread on cotton or silk base fabric, creating small pieces (floral motifs, traditional patterns) as take-home items. Thai beadwork (phuk nae) — used in traditional ceremonial objects, merit-making gifts, and decorative items — is a distinct craft with its own vocabulary. The Chatuchak market's craft sections stock complete embroidery supplies at manufacturing prices accessible to hobbyists at any level.",
    tip: "Bangkok embroidery and fiber arts access: (1) Jim Thompson House museum (Ratchadamri area): the historic silk entrepreneur's house maintains displays of traditional Thai textiles, silk weaving, and embroidery contexts that provide excellent background before attempting craft exploration; (2) Hill tribe textiles at Chatuchak: sections 24–26 of Chatuchak sell genuine hill tribe textiles (Hmong batik, Karen weaving, Akha beadwork) produced in northern Thai villages; many are authentic craft products rather than mass-produced imitations; (3) Embroidery supply district: the area around Pahonyothin (near Chatuchak) has wholesale fabric and embroidery supply shops stocking full ranges of silk thread, metallic thread, and needlework tools; (4) Gold thread work (canework): Thai court embroidery using gold and silver metallic thread on silk is taught at a very small number of specialist schools; accessing these requires Thai-language connections or through cultural institutions; (5) Sustainable souvenir consideration: purchasing directly from artisans at Chatuchak (not from middlemen resellers) means more of the purchase price reaches the craftsperson.",
  },
  {
    name: "Macramé, Weaving & Fiber Arts Bangkok",
    emoji: "🧵",
    area: "Contemporary craft studios in Ekkamai, Ari, and Charoenkrung creative districts; yarn and fiber arts shops in Pratunam and on Ratchadaphisek; online Bangkok craft communities; occasional fiber arts markets",
    price: "Macramé beginner workshop (3h): ฿800–1,500; Weaving workshop: ฿1,000–2,500; Fiber arts supply shop visit: ฿500–5,000 depending on materials; Monthly fiber arts class: ฿3,000–6,000",
    why: "Contemporary fiber arts (macramé, hand weaving, natural dyeing, tapestry) have experienced a Bangkok renaissance over the past 5 years — part of the broader maker culture movement that has established boutique workshops, craft cafés, and creative studio spaces throughout Bangkok's newer neighborhood creative clusters. Macramé (knotting cord into decorative and functional items — wall hangings, plant holders, jewelry) has particular popularity in Bangkok's maker scene, with multiple dedicated studios offering workshops ranging from 2-hour beginner sessions to multi-week courses. Hand weaving has a related Bangkok community — both using traditional Thai-style looms (for authentic cultural weaving) and modern rigid-heddle looms (more accessible for beginners). Bangkok's craft market has also seen growth in natural dyeing workshops using indigenous Thai plant materials (indigo, turmeric, rosewood, tannin sources from tamarind bark) that connect fiber arts to Thai botanical and agricultural traditions.",
    tip: "Bangkok fiber arts community navigation: (1) Craft café model: several Bangkok establishments combine fiber arts workshop space with café service — creating a relaxed social environment for craft learning that feels like hanging out rather than taking a class; (2) Instagram discovery: Bangkok's fiber arts studios maintain strong Instagram presences; searching #bangkokcraftworkshop, #macramébangkok, or #bangkokweaving reveals currently active studios and upcoming workshops; (3) Yarn market: Bangkok's Pratunam area and surrounding streets have wholesale yarn shops used by Bangkok's Thai knitting and crochet community — these carry imported and Thai-produced yarn at below-retail prices; (4) Natural dyeing: Bangkok's natural dye workshop community is small but active; workshops that take participants from raw fiber to naturally dyed yarn or cloth over a half-day to full-day session provide the most complete craft experience; (5) Portability: macramé and small weaving projects can be purchased in kit form to continue at home — Bangkok craft shops sell quality packaged kits that serve as souvenir craft projects.",
  },
  {
    name: "Bangkok Flower Arrangement & Phuang Malai",
    emoji: "🌸",
    area: "Pak Khlong Talat flower market (Bangkok's 24-hour wholesale flower market, near Saphan Phut), traditional phuang malai classes at community centers and craft schools, contemporary ikebana studios, floral design workshops",
    price: "Phuang malai garland making class (2h): ฿600–1,500; Contemporary floral arrangement workshop: ฿1,200–3,000; Pak Khlong Talat flower shopping: ฿50–500; Fresh flowers for DIY arrangement: ฿100–500",
    why: "Flower crafts in Bangkok operate at two distinct levels: (1) Traditional phuang malai (พวงมาลัย) — jasmine garlands threaded by hand, used as offerings at Buddha images, spirit houses, and as gifts in Thai culture — represents one of Bangkok's oldest living craft traditions, practiced daily by vendors throughout the city; (2) Contemporary floral design — Western-influenced arrangement workshops and Thai contemporary florists creating modern installations — represents the boutique end of Bangkok's booming floral design industry. Pak Khlong Talat, Bangkok's legendary flower market operating around the clock near the river, is one of Bangkok's most atmospheric markets — flowers arrive from all over Thailand overnight, wholesale buyers handle enormous quantities, and the visual and olfactory impact (jasmine, roses, orchids, marigolds, lotus) is extraordinary. Orchid cultivation is deeply embedded in Thai culture (Thailand is one of the world's largest orchid producers), and Bangkok has dedicated orchid farms accessible by day trip that combine botanical education with retail.",
    tip: "Bangkok flower culture access: (1) Pak Khlong Talat timing: the market is most spectacular between midnight and 4am when wholesale deliveries arrive and buyers purchase for the day; visiting at this time reveals Bangkok's pre-dawn professional life; (2) Phuang malai making: traditional jasmine garland threading workshops are offered at community cultural centers, some hotel activities programs, and traditional craft schools — the repetitive meditative threading technique (jasmine flowers strung on a needle through a cotton thread) is accessible to anyone; (3) Spirit house flowers: Bangkok's spirit houses (san phra phum) in front of nearly every building receive daily fresh flower offerings — the jasmine-focused offering systems are commercially supported by street vendors who sell pre-made garlands from 7am; (4) Orchid markets: Bangkok's Chatuchak Weekend Market section has extensive orchid vendors; dedicated orchid markets in outer Bangkok provide competition-quality specimens; (5) Floral design workshops: contemporary Bangkok floral design studios in Thonglor, Ari, and Silom areas offer bouquet-making and arrangement workshops with imported and Thai flowers at reasonable workshop fees.",
  },
];

export function BangkokFiberArts() {
  return (
    <div className="rounded-2xl border border-pink-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-pink-700 mb-3">
        🪡 Bangkok fiber arts & flowers — embroidery, macramé & Pak Khlong Talat
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
