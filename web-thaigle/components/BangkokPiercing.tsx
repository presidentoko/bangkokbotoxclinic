const SPOTS = [
  {
    name: "Body Piercing in Bangkok — Studio Standards",
    emoji: "💎",
    area: "Piercing studios throughout Bangkok — highest concentration in Sukhumvit, Silom, Thong Lor, and Khao San Road area",
    price: "Lobe piercing ฿300–600; Cartilage/helix ฿400–800; Nostril ฿500–900; Septum ฿600–1,200; Navel/industrial ฿800–1,500; Implant-grade jewelry included varies",
    why: "Bangkok has a developed body piercing studio landscape — from professional APP (Association of Professional Piercers) or equivalent standards studios to the higher-volume Khao San Road walk-in shops. The distinction matters significantly for safety: professional piercing studios use single-use sterilized needles, implant-grade titanium or ASTM F136 surgical steel jewelry (not 'surgical steel' grade), proper aftercare guidance, and experienced piercers who understand anatomy and placement. Bangkok's mid-to-high-end piercing studios serve the city's style-conscious expat and Thai youth community — the better studios in Thong Lor and Sukhumvit areas can be compared to quality Western piercing studios. Khao San Road shops are more accessible price-wise but vary dramatically in standards — the cheapest option is rarely the safest option for body modification.",
    tip: "Bangkok piercing safety checklist: (1) Is the piercer using an autoclave-sterilized needle (not a piercing gun)? Gun piercings are less precise, cause more tissue damage, and are inappropriate for most piercing placements; (2) Is the initial jewelry implant-grade titanium or ASTM F136 steel? Avoid costume jewelry, acrylic, or unknown metals for fresh piercings; (3) Does the piercer discuss your anatomy and placement options? Good piercers assess anatomy before piercing — not every placement works for every body; (4) Is the studio clean and does the piercer use gloves? Visual inspection of the studio environment is meaningful; (5) Aftercare guidance: a professional piercer provides specific aftercare instructions — generally sterile saline spray, avoiding unnecessary touching or rotation. Healing considerations: Bangkok's heat and humidity can affect healing; keeping the area clean and dry is more challenging here than in cooler climates.",
  },
  {
    name: "Traditional Sak Yant Tattoo — Sacred Geometry",
    emoji: "🔱",
    area: "Wat Bang Phra (Nakhon Pathom province, 1 hour from Bangkok), traditional tattoo masters throughout Thailand",
    price: "Sak Yant at traditional ajarn: ฿500–5,000+ (often donation-based); At temple Wai Kru ceremony: free with merit offering ฿200–2,000",
    why: "Sak Yant (Thai sacred tattoo, also called yantra tattoo) is a spiritually significant tattooing tradition practiced in Thailand, Cambodia, Laos, and Myanmar — the geometric designs (yantra) are believed to contain magical powers when performed by a qualified ajarn (Buddhist monk or lay master) using the traditional rod-tattooing technique (a sharpened metal rod rather than a tattoo machine). The most famous Sak Yant temple is Wat Bang Phra in Nakhon Pathom province — the annual Wai Kru ceremony held here (typically in March) involves thousands of devotees believed to enter spirit possession states associated with their Sak Yant's protective spirits. Bangkok area Sak Yant: several traditional ajarns operate in Bangkok and surrounding areas; Wat Phra Kaew area and traditional tattoo masters in the older residential districts have practitioners.",
    tip: "Sak Yant respectful engagement: the tradition has specific protocols — appropriate dress (long sleeves, long pants), correct behavior at a temple setting, the offering presented to the ajarn, and the behavioral rules (sak yant kata) that come with specific yantra designs. The kata (obligations) are usually explained by the ajarn through a translator — they typically include dietary restrictions (avoiding specific foods) and behavioral guidelines the devotee agrees to follow. For non-Buddhist foreigners: the tradition welcomes respectful participants who approach with genuine respect for the ritual significance — treating it as a tourist experience or a 'cool tattoo' without understanding the spiritual context is considered disrespectful. The tattoo's placement on the body is also spiritually specific — placement near the head versus feet has different meanings and traditions.",
  },
  {
    name: "Body Modification Culture in Bangkok",
    emoji: "🎨",
    area: "Bangkok modification studios, primarily Sukhumvit and Thong Lor area professional studios",
    price: "Dermal anchors ฿1,500–3,000; Surface piercings ฿2,000–4,000; Implants ฿5,000–20,000+; Scarification: specialist consultation required",
    why: "Bangkok's body modification community extends beyond standard piercings and tattoos into more advanced modification work — microdermal anchors (surface piercings), subdermal implants (silicone shapes implanted under skin for aesthetic effects), and scarification are practiced by the modification community here. Bangkok attracts international modification artists for guest appearances at studios — particularly those with skills not widely available locally (advanced scarification techniques, extreme modification). The community around advanced body modification in Bangkok is smaller and more specialized than the mainstream piercing/tattoo scene — connecting through the global modification community platforms (BME, modification-specific social media) helps identify Bangkok practitioners. Advanced modification carries higher risk and requires more extensive research and consultation than standard piercing.",
    tip: "Advanced body modification safety in Bangkok: for any work beyond standard piercings, the practitioner's experience and portfolio specifically in the modification type is the primary qualification — ask to see healed examples of their work specifically. Medical consideration: some modifications (implants, extreme piercings in sensitive areas) may interact with future medical procedures — research this before proceeding. Bangkok hospital access: in case of complications from any body modification, Bumrungrad International Hospital and Bangkok Hospital network facilities have English-speaking staff and comprehensive medical capabilities. The body modification community in Bangkok is accessible through Facebook groups, dedicated modification Instagram accounts, and the artists' own networks.",
  },
];

export function BangkokPiercing() {
  return (
    <div className="rounded-2xl border border-fuchsia-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-fuchsia-700 mb-3">
        💎 Bangkok piercing & body art — piercing studios, Sak Yant sacred tattoo & body modification
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-fuchsia-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-fuchsia-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
