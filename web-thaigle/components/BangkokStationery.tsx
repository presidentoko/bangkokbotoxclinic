const SPOTS = [
  {
    name: "Bangkok's Stationery Scene — Japanese Brands & More",
    emoji: "✍️",
    area: "Kinokuniya (Siam Paragon, EmQuartier), Boots (stationary section), B2S, Asiatique",
    price: "Premium pens ฿150–3,500; Notebooks ฿200–1,500; Budget stationery ฿20–200",
    why: "Bangkok has exceptional access to Japanese stationery brands at competitive prices — Muji (multiple Bangkok locations) sells their minimalist paper, pens, and desk accessories; Kinokuniya bookshop stocks Midori, Hobonichi, and other Japanese premium stationery brands. The Japanese expat community and Thai enthusiasm for Japanese lifestyle products means Japan's stationery culture transfers directly. Bangkok also has local Thai stationery designers producing interesting notebooks and desk accessories drawing on Thai graphic traditions.",
    tip: "Best stationery shopping in Bangkok: Kinokuniya Siam Paragon is the flagship for Japanese premium stationery (Zebra, Pilot, Uni-ball — Japanese versions with different nib sizes and ink formulations than exported versions). Muji has the most complete Thai network (Siam, Emquartier, Terminal 21, and more). For craft stationery and local designers: Asiatique Sunday market and Chatuchak Weekend Market have independent Thai stationery makers. The 'stationery and paper crafts' Facebook groups in Bangkok list limited-run notebooks and hand-crafted items from local makers.",
  },
  {
    name: "Washi Tape, Journaling & Bullet Journal Community",
    emoji: "📓",
    area: "Online groups; meet-ups at Bangkok cafés; Chatuchak craft sections",
    price: "Washi tape rolls ฿80–300; Journals ฿300–2,500",
    why: "Bangkok has an active journaling and planner community — the bullet journal (BuJo) aesthetic has particularly strong Thai participation, with Thai Instagram journaling communities among the most creative in Asia. Washi tape (decorative Japanese masking tape), stamps, stickers, and decorative paper goods are sold at Chatuchak, specialty stationery shops, and through Thai online sellers (Shopee, Lazada). The coffee shop culture of Bangkok perfectly aligns with the laptop-and-journal aesthetic — many Bangkok cafés see journalers as long-stay regulars.",
    tip: "Bangkok washi tape and craft supplies: the Chatuchak Weekend Market has dedicated stationery and craft vendors who sell Japanese washi tape at lower prices than boutique shops. Online: Thai sellers on Shopee carry both Japanese imported washi and locally designed Thai pattern washi tape — the latter often features Thai motifs (temples, Thai elephants rendered in the washi aesthetic). Bangkok journaling community events: check 'Bullet Journal Thailand' and 'BuJo Bangkok' Facebook groups for meetups at cafés where journalers show spreads and share supplies.",
  },
  {
    name: "Fountain Pens & Writing Instruments",
    emoji: "🖊️",
    area: "Pen shops at Chatuchak; specialty pen dealers; Narayana Phand (craft market)",
    price: "Entry fountain pens ฿300–1,500; Premium ฿3,000–50,000+",
    why: "Bangkok's fountain pen community is small but enthusiastic — specialist pen shops in Central and Chatuchak carry Japanese (Pilot, Sailor, Platinum), German (Lamy, Pelikan), and European brands. The availability of Japanese 'cool' limited editions (Pilot Iroshizuku ink bottles, Sailor limited editions, Platinum special runs) at Bangkok prices is notable — often available before Western markets. The Bangkok pen community (Fountain Pen Thailand Facebook group) organizes pen shows and swap meets.",
    tip: "Fountain pen shopping in Bangkok: the pen shops in CentralWorld's 6th floor book section carry Japanese fountain pen brands with full ink selection. The Bangkok Pen Show (typically annual, check Fountain Pen Thailand Facebook) brings specialty vendors together with collector/enthusiast community. For affordable entry pens: Lamy Safari and Pilot Metropolitan are both excellent starter pens available in Bangkok. Inks: Kinokuniya carries Pilot Iroshizuku inks; Pilot ink cartridges compatible with most Japanese pens are at every stationery shop.",
  },
];

export function BangkokStationery() {
  return (
    <div className="rounded-2xl border border-cyan-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-cyan-700 mb-3">
        ✍️ Stationery in Bangkok — Japanese brands, washi tape, journaling & fountain pens
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-cyan-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-cyan-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
