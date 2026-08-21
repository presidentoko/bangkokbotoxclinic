const SPOTS = [
  {
    name: "Thai Contemporary Sculpture & Public Art",
    emoji: "🗿",
    area: "Bangkok Art and Culture Centre (BACC), outdoor sculpture parks, Charoen Krung art district",
    price: "BACC free entry; Sculpture workshops ฿800–3,000; Custom commissions ฿5,000–500,000+",
    why: "Bangkok's contemporary sculpture scene operates at two levels — institutional (BACC's permanent collection and rotating exhibitions, major gallery shows) and street-level (public sculpture installations in Charoen Krung, Bangkok's emerging creative district). Thai sculptors blend Buddhist iconography and classical Sukhothai traditions with contemporary materials and concepts. The BACC hosts international sculpture exhibitions alongside Thai artists — major Thai sculptors have exhibited globally. Public art commissions in Bangkok's new urban development projects increasingly incorporate Thai and international sculptors.",
    tip: "Bangkok sculpture discovery: BACC (Bangkok Art and Culture Centre at National Stadium BTS) has permanent sculpture collection and rotating contemporary shows — free entry, open Tuesday–Sunday. Gallery walking in Charoen Krung and Sukhumvit areas surfaces gallery exhibitions including sculpture. For sculpture workshops: several Bangkok ceramics and sculpture studios offer adult workshops in clay sculpture, resin casting, and traditional Thai carving techniques — search Facebook for 'Bangkok sculpture workshop' or 'Bangkok art class'. The annual Bangkok Art Biennale (every 2 years) transforms heritage sites into large-scale sculpture installations — unmissable when active.",
  },
  {
    name: "Thai Classical Woodcarving & Lacquerware",
    emoji: "🪵",
    area: "Craft workshops near Wat Pho, traditional artisan areas, Chiangmai-trained Bangkok artisans",
    price: "Woodcarving workshop ฿1,500–4,000/day; Handmade piece ฿2,000–50,000+",
    why: "Thailand's classical woodcarving tradition — figures, temple panels, decorative furniture, spirit houses — is one of Southeast Asia's most refined craft forms. Historically centered in northern Thailand (Chiang Mai) but practiced throughout the country, Thai woodcarving uses teak, jackfruit, and other hardwoods to create intricate relief panels with Buddhist and mythological imagery. Bangkok workshops connect visitors with this tradition — experienced carvers teach through demonstration and hands-on practice. The craft tradition is facing generational transition as younger Thai artisans choose other careers; workshops that still operate with master carvers are preservation institutions.",
    tip: "Bangkok woodcarving access: the area around Wat Pho and the Grand Palace has traditional craft shops with genuine handmade items (distinguish from factory-produced items by the small irregularities that indicate hand work). For workshops: Chiang Mai is the primary woodcarving education destination in Thailand — Bangkok-based workshops are rarer. River City Shopping Center (antique area near Si Phraya Pier) has dealers selling quality Thai antique woodcarvings. Contemporary Thai design objects using woodcarving techniques: Chatuchak Weekend Market has Thai designers applying woodcarving to contemporary product designs (cutting boards, decorative objects).",
  },
  {
    name: "Ceramic Art & Potter Communities",
    emoji: "🏺",
    area: "Pottery studios (Ekkamai, Sukhumvit), ceramic art galleries, Chatuchak ceramic vendors",
    price: "Pottery class ฿800–2,000/session; Ceramic artworks ฿200–50,000+",
    why: "Bangkok's ceramic art scene has grown significantly — influenced by Korean and Japanese ceramics culture (Bangkok's Korean and Japanese communities maintain strong pottery traditions from their home countries) as well as Thai celadon tradition (the distinctive pale green glaze of Sukhothai-era ceramics). Modern Bangkok pottery studios offer wheel-throwing, hand-building, and glaze development workshops in contemporary studio settings. Thai ceramic artists are producing gallery-quality work that commands serious collector attention. The 'wabi-sabi' Japanese aesthetic influence on Bangkok ceramics is visible in asymmetric forms and natural glaze effects.",
    tip: "Bangkok pottery class finding: Nakorn Bangkok, Pottery Studio, and similar studios (search Facebook/Instagram for 'Bangkok pottery') offer beginner through advanced classes. Class format: most sessions include 2–3 hours of throwing or hand-building with instructor guidance, followed by kiln firing (pieces ready 1–2 weeks later for pickup or shipping). Thai celadon ceramics: the celadon tradition uses iron-bearing glazes fired in reduction atmosphere to produce the characteristic green — several Bangkok shops sell quality contemporary celadon alongside tourist-grade versions. Chatuchak ceramic vendors: the pottery section (near sections 7–8) has Thai artisan ceramics at moderate prices.",
  },
];

export function BangkokSculpture() {
  return (
    <div className="rounded-2xl border border-stone-300 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-stone-700 mb-3">
        🗿 Sculpture & crafts in Bangkok — contemporary art, Thai woodcarving & ceramics
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
