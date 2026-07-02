const SPOTS = [
  {
    name: "Thai Silk — Jim Thompson & Royal Silk Heritage",
    emoji: "🧵",
    area: "Jim Thompson House Museum (MBK area), Thai Silk stores throughout Bangkok, Pratunam fabric district",
    price: "Thai silk fabric (per metre): ฿500–8,000; Jim Thompson shop products: ฿500–10,000+; Custom tailored silk garment: ฿3,000–30,000; Museum entry ฿200",
    why: "Thai silk is one of Thailand's most internationally recognized craft products — the combination of the distinctive 'mudmee' ikat-style weaving technique unique to northeast Thailand (Isan region), the naturally lustrous Thai silk thread (from Thai silkworms fed on mulberry leaves cultivated on the northeastern plateau), and the design revival championed by American entrepreneur Jim Thompson in the 1950s–60s has produced an international heritage product. Jim Thompson (who disappeared mysteriously in Malaysia in 1967) is credited with bringing Thai silk to international fashion markets and saving traditional silk weaving communities from economic decline. Bangkok's Jim Thompson House Museum (his traditional Thai house compound in Bangkok) is both a museum and a luxury retail brand flagship. The royal silk connection: Thai silk has been produced for the royal court for centuries — patterns and colors carry traditional meaning, and certain weave patterns are associated with Thai royalty.",
    tip: "Thai silk purchasing guidance: (1) Authentic Thai silk identification — genuine Thai silk has a subtle irregularity in texture from hand-weaving, natural luster that changes at different angles, and a slightly rough feel on the back vs. front; machine-made imitations feel uniform and lack this complexity; (2) Pratunam fabric district (near BTS Ratchaprarop): the most comprehensive and price-competitive fabric market in Bangkok for both Thai silk and imported fabrics — browse before purchasing at branded shops; (3) Mudmee silk specifically: the northeast Isan mudmee ikat weaving (where threads are resist-dyed before weaving to create patterns) is the most distinctive Thai weaving tradition — available at specialist shops and direct from Isan weaving communities at weekend markets; (4) Jim Thompson vs. alternatives: Jim Thompson products are reliable quality and internationally design-focused, but comparable quality at lower prices is available at textile shops in Pratunam and specialist Thai silk vendors at Or Tor Kor market.",
  },
  {
    name: "Batik & Thai Traditional Textiles",
    emoji: "🎨",
    area: "Batik production areas (southern Thailand influence), traditional textile museums, Chatuchak textile section (section 22–27)",
    price: "Thai batik sarong ฿200–800; Handmade batik fabric ฿500–3,000/metre; Traditional phaa sin (wrap skirt) ฿300–2,000; Batik-making workshop ฿500–1,500",
    why: "Thailand's textile heritage extends beyond silk to diverse regional weaving and dyeing traditions — batik (wax-resist fabric dyeing) arrived in Thailand via southern Malaysia and the Muslim south, where Thai batik (often called 'batik Thai') has developed distinct local characteristics. The phaa sin (ผ้าซิ่น) — the traditional Thai wrap skirt worn by Thai women for formal and cultural occasions — represents one of the most significant local textile traditions, with regional variations (northern, northeastern, central, southern) that encode cultural identity and geographic origin. Bangkok's textile shopping diversity: Chatuchak Weekend Market sections 22–27 contain textile, clothing, and fabric vendors including authentic regional Thai textiles at market prices far below boutique shop pricing. Natural dyeing: several Bangkok and Chiang Mai-based textile artisans work with traditional Thai natural dyes (indigo, jackfruit wood, mangosteen rind) producing textiles with natural color depth unavailable from synthetic dyes.",
    tip: "Bangkok textile exploration guide: (1) The Chatuchak Market textile section (early morning Saturday and Sunday) has the highest density of authentic regional textile products from vendors who often have direct relationships with weaving communities; (2) Teacher identification: vendors who can explain the origin region and weaving technique of their products are more reliably selling authentic pieces than vendors focused only on price; (3) Custom tailoring integration: Bangkok's custom tailoring shops (particularly in Sukhumvit area) can work with fabrics you source independently from Pratunam — bringing your own Thai silk to a custom tailor is often a better combination than purchasing pre-made garments; (4) Thai batik as souvenirs: authentic hand-stamped or hand-drawn Thai batik from southern Thailand vendors (Phuket or Hat Yai-based producers represented at Bangkok markets) is a genuinely distinctive purchase compared to mass-produced tourist textiles.",
  },
  {
    name: "Indigo Dyeing & Natural Textile Workshops",
    emoji: "💙",
    area: "Specialist craft studios in Bangkok, community workshops at craft cultural centers, day trips to artisan communities in surrounding provinces",
    price: "Indigo dyeing workshop (2–3 hours): ฿800–2,000; Natural dye scarf workshop: ฿1,000–2,500; Advanced textile course (multi-day): ฿5,000–15,000",
    why: "Indigo dyeing is experiencing a significant revival in Thailand — the traditional indigo dyeing technique using fermented indigo paste (Indigofera tinctoria plants, traditionally grown and processed into paste by rural communities, particularly in Surin and northeastern Thailand) produces the distinctive deep blue fabric associated with Thai hillside communities, Hmong traditional dress, and the growing natural dye fashion movement. Bangkok craft studios have begun offering indigo dyeing workshops that connect urban visitors and residents with this agricultural and cultural tradition. The appeal: indigo dyeing produces living color — the fabric initially appears greenish-yellow when removed from the dye bath and oxidizes to blue as it dries, creating a genuine chemistry-in-action experience. Natural indigo blue (distinctively warm and rich compared to synthetic indigo) also develops a patina of character with washing and wear that synthetic dyed fabric cannot replicate.",
    tip: "Indigo dyeing Bangkok workshop experience: (1) Natural indigo fermentation vats are living systems that require maintenance and care — a healthy vat produces deep blue; an off vat produces pale blue or damaged results; ask about the vat's age and health before booking; (2) Preparing for an indigo workshop: wear old clothes or bring a change, as indigo transferring to skin and clothing during the process is normal and expected — natural indigo fades from skin within a day or two; (3) Taking your indigo piece home: fresh indigo pieces require a rinse in cold water with a small amount of white vinegar to set the color; avoid hot water in initial washes; (4) The deeper craft: serious natural dye interest connects to the broader shibori, resist-dyeing, and natural fiber crafting communities — Bangkok has small but growing communities of natural textile artisans accessible through craft market events and Instagram.",
  },
];

export function BangkokTextiles() {
  return (
    <div className="rounded-2xl border border-purple-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        🧵 Bangkok textiles & fabric arts — Thai silk, traditional weaving & indigo dyeing
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-purple-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-purple-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
