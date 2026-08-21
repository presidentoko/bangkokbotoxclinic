const SPOTS = [
  {
    name: "Custom Suit & Tailoring in Bangkok",
    emoji: "🧵",
    area: "Sukhumvit tailor strip (Soi 11, Soi 13), Silom tailor district, Pratunam garment area",
    price: "Bespoke suit ฿8,000–35,000; Shirt (custom) ฿1,500–6,000; Alterations ฿200–2,000",
    why: "Bangkok's custom tailoring industry is internationally known — the city's combination of skilled tailors, competitive pricing, and quality fabric imports has made it a destination for custom clothing. The Sukhumvit tailor strip caters primarily to the tourist and expat market with experience-package deals (suit + shirts + tie in 24-48 hours). The more experienced tailoring establishments have been operating for decades and have established relationships with customers who return on each Bangkok visit. Indian tailors historically dominate Bangkok's custom suit scene (drawing on the South Asian subcontinent's deep tailoring tradition); Thai tailors have developed strong custom shirt and women's garment programs.",
    tip: "Bangkok tailoring reality check: the '24-hour suits' marketed at tourist-strip tailors prioritize speed over quality — a suit requiring multiple fittings over 5–7 days produces dramatically better results. The most important indicator: a tailor who measures carefully, asks about your posture and fit preferences, and suggests a preliminary fitting before cutting is taking the craft seriously. Fabric selection: Bangkok tailors have fabric sample books covering woolens, linens, cotton, silk, and synthetic blends — import-quality Italian and English woolens are available at significant premiums over Thai-woven alternatives. For women's custom garments: Bangkok's custom dressmaking scene (Thai silk qipao, cocktail dresses, formal gowns) has excellent practitioners — Thai silk is genuinely beautiful for formal occasion clothing.",
  },
  {
    name: "Thai Silk & Fabric Markets",
    emoji: "🪡",
    area: "Jim Thompson Silk (multiple Bangkok locations), Pak Khlong Talat fabric section, Pahurat Indian fabric market",
    price: "Thai silk ฿800–5,000/meter; Batik ฿300–1,500/meter; Indian fabric ฿200–3,000/meter",
    why: "Thailand's silk weaving tradition — particularly the northeast Isan region's distinctive mudmee ikat silk and the smooth Thai dupioni silk — represents one of the country's most significant cultural crafts. Jim Thompson transformed Thai silk into an international luxury brand in the mid-20th century; his house-museum in Bangkok traces this history while the shops distribute globally. The Pak Khlong Talat market has fabric stalls alongside the flower market — primarily synthetic and cotton blends for everyday garments, with some silk. The Indian fabric market in Pahurat (near Chinatown) carries Indian silk, embroidered fabrics, and South Asian textile traditions alongside Thai fabric. Premium Thai silk from specific weaving regions (Khon Kaen for mudmee, Lamphun for northern silk) is available at Bangkok specialty shops.",
    tip: "Thai silk authentication: genuine Thai silk has distinctive features — natural fiber irregularity visible in fabric, a characteristic soft luster (different from synthetic sheen), and the ability to hold a firm shape while draping fluidly. Burn test: genuine silk burns cleanly with a smell similar to burning hair and leaves a crushable ash — synthetic fabric melts and smells of burning plastic. Bangkok fabric market negotiation: fixed prices at Jim Thompson and established fabric shops; negotiation is standard at market stalls and small shops. For making traditional Thai garments: Thai silk in traditional patterns (appropriate for royal colors, formal occasions) requires cultural knowledge about when and where specific patterns are appropriate — your tailor can advise on context appropriateness.",
  },
  {
    name: "Embroidery, Crafts & Textile Arts",
    emoji: "🧶",
    area: "Chatuchak Weekend Market (textile and craft sections), Narayana Phand (government craft center), River City Bangkok",
    price: "Thai embroidered fabric ฿500–8,000; Craft workshop ฿1,500–5,000; Handwoven textile ฿800–10,000",
    why: "Bangkok's textile craft traditions extend well beyond silk — Thai embroidery (pak mai or bead embroidery on ceremonial garments), northern Thailand's hill tribe weaving (Hmong, Karen, Akha patchwork and woven textiles), and Isan's natural-dyed mudmee weaving all represent distinct artistic traditions accessible through Bangkok's craft market ecosystem. River City Bangkok (near Charoen Krung) houses galleries and dealers in high-end Thai antiques and textile arts. The Narayana Phand government craft center near the central Ratchaprasong area provides an authentic government-vetted craft selection (theoretically guaranteeing origin and quality). Chatuchak Market's craft and textile sections have a wide range — from mass-produced craft souvenirs to genuine artisan work — requiring selective shopping.",
    tip: "Bangkok craft textile shopping strategy: price is not a reliable quality indicator in the tourist craft market — a high-priced item in an air-conditioned shop may be machine-produced while a lower-priced item from a small vendor might be genuinely handmade. Look for production evidence: irregular patterns in handwoven textiles (machine-woven patterns are perfectly uniform), visible hand-stitching in embroidery work, and the presence of slight color variations indicating natural dyes. Learning the craft: several Bangkok organizations offer embroidery and weaving workshops for visitors — BACC (Bangkok Arts and Culture Centre) and community-based organizations in Bangkok occasionally run textile arts workshops. Silk weaving in Thailand's context: the best textile arts programs are actually in weaving villages outside Bangkok — day trips to ethnic weaving communities can be arranged through tour operators.",
  },
];

export function BangkokCustomTailoring() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-orange-700 mb-3">
        🧵 Custom tailoring & textiles in Bangkok — bespoke suits, Thai silk & fabric markets
      </h2>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-orange-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs">{s.name}</h3>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="min-w-0 break-words text-right text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-orange-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
