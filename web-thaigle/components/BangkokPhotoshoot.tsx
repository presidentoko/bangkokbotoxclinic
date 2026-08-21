const LOCATIONS = [
  {
    name: "Temple & Ancient Architecture Photoshoot",
    emoji: "🏛️",
    area: "Wat Pho, Wat Phra Kaew, Wat Suthat (Old City)",
    price: "Temple entry ฿100–500; Professional photographer ฿2,000–8,000",
    why: "Bangkok's ancient temples are the classic photoshoot backdrop — golden stupas, ornate murals, temple guardians (yaksha), and traditional Thai dress (renting Thai traditional costume is available near Sanam Luang/Ratchadamnoen). Wat Pho's reclining Buddha offers unusual compositional opportunities. Wat Suthat's swing and courtyard have less tourist traffic than the Grand Palace area. Best light: early morning (7–9am) for warm light and fewer crowds.",
    tip: "Thai traditional costume rental is available near Sanam Luang (฿200–400 per session) and is popular for both Thai and foreign visitors doing photoshoots at temples. Dress code enforcement at Grand Palace and Wat Phra Kaew is strict — check shoulder and knee coverage before travel. Professional photographers in Bangkok who specialize in temple photoshoots offer costume + makeup + session packages (฿3,000–10,000).",
  },
  {
    name: "Urban & Street Style Bangkok Photoshoot",
    emoji: "📷",
    area: "Chatuchak, Bangrak shophouses, Ari street art, Yaowarat",
    price: "Photographer ฿2,500–7,000/2 hours",
    why: "Bangkok's layered urban environment provides diverse backdrops: colorful Bangrak shophouse facades, Yaowarat neon signs, Chatuchak market corridors, Ari coffee shop exteriors, Bang Krachao orchard paths. The city's mix of old and ultramodern creates visual contrast unavailable in most Asian capitals. Bangkok street photographers (English-speaking) offer 'urban editorial' shoot packages increasingly popular with fashion travelers and content creators.",
    tip: "For Instagram/content creation shoots: the Bangrak shophouse district (between Bang Rak and Charoen Krung) has the most photogenic building facades in Bangkok — pastel Chinese-Portuguese colonial shophouses. The best time: early morning before businesses open (7–9am). Golden hour (5:30–7pm) in Chinatown/Yaowarat gives the neon-plus-warm-sky combination most photographers seek.",
  },
  {
    name: "Traditional Thai Dress Photoshoot at Ayutthaya",
    emoji: "👘",
    area: "Ayutthaya Historical Park (1.5 hrs from Bangkok)",
    price: "Day trip ฿600–1,200; Photographer ฿4,000–15,000",
    why: "Many Bangkok visitors combine a day trip to Ayutthaya's ancient ruins with a traditional Thai costume photoshoot — the ancient stone temples (Wat Mahathat's Buddha-in-tree-roots, Wat Chai Watthanaram's Khmer-style prang) create a backdrop unavailable in Bangkok. Thai costume rental and makeup services are available in Ayutthaya near the temple complex. The photoshoot demand has turned Ayutthaya into a destination specifically for photo travelers from China, Korea, and Japan.",
    tip: "Ayutthaya costume photoshoot logistics: costume rental shops open from 8am, best to arrive before 9am for morning light and before Japanese/Chinese tour groups arrive. Sunset shoots are also excellent at Ayutthaya (the ruins glow gold at 5–6pm). The bicycle route between temples (rented bicycles ฿50–80/day) allows covering multiple shooting locations in a half-day.",
  },
];

export function BangkokPhotoshoot() {
  return (
    <div className="rounded-2xl border border-fuchsia-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-fuchsia-700 mb-3">
        📷 Photoshoot locations in Bangkok — temples, urban street & Thai costume at Ayutthaya
      </h2>
      <div className="space-y-2">
        {LOCATIONS.map((l) => (
          <div key={l.name} className="border border-fuchsia-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{l.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{l.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{l.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{l.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{l.why}</div>
            <div className="text-[10px] text-fuchsia-700">💡 {l.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
