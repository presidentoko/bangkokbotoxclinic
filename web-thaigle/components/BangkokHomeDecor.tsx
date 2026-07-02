const SPOTS = [
  {
    name: "Chatuchak Weekend Market — Home Decor Section",
    emoji: "🏠",
    area: "Chatuchak Weekend Market, Sections 7, 8, 9, 10 — home & decor",
    price: "Artisan pieces ฿200–5,000; Wholesale minimum ฿50–500",
    why: "Chatuchak's home decor sections are among Bangkok's best-kept shopping secrets — handmade ceramics, teak furniture, rattan, woven textiles, vintage Thai artifacts, lacquerware, silk cushions, and decorative items at direct-from-artisan prices. Sections 7–10 concentrate on home furnishings and decor. Independent artisan vendors selling handmade pieces you won't find in retail stores. The quality and variety rivals what you'd find in boutique design stores in London or New York at a fraction of the price.",
    tip: "Chatuchak home decor navigation: arrive by 9am Saturday for the best furniture and large piece selection (vendors start packing from noon). For ceramics: sections 7 and 9 have the highest concentration. For teak and wooden items: look for vendors displaying polished wood with grain detail — these distinguish quality craft pieces from mass-produced alternatives. Haggling is appropriate and expected — opening at 70–80% of asking price and settling around 75–85% is the normal Bangkok market dynamic. Have cash in small bills.",
  },
  {
    name: "Silom Village & Thai Craft Markets",
    emoji: "🎎",
    area: "Silom Village (Silom Soi 24), River City (Si Phraya), numerous antique shops",
    price: "Craft items ฿300–10,000; Antiques ฿2,000–100,000+",
    why: "Silom Village (a complex of Thai crafts, silk, and antique shops in a traditional architecture setting) provides curated Thai home decor and craft shopping with fixed pricing and air conditioning — contrasting with Chatuchak's chaos. River City Shopping Center near Si Phraya pier is Bangkok's premier antique destination — Thai antiques (Buddha images excepted, which require export permits), Sino-Portuguese furniture, vintage ceramics, and Asian artifacts. The Charoen Krung antique belt (between River City and the Oriental) has numerous specialist dealers.",
    tip: "Thai antique export regulations: Buddha images and Thai national treasures cannot be exported without permits (technically any old Buddha image, practically enforced for obvious antiques). Decorative items, modern reproductions, and non-religious antiques can be exported. When purchasing antiques intended for export: ask for documentation of age, origin, and whether it's export-eligible. River City Shopping Center has dealers who are experienced with export documentation. Budget extra time at Customs if bringing large items home.",
  },
  {
    name: "Contemporary Thai Design — TCDC, Warehouse 30 & Design Shops",
    emoji: "✏️",
    area: "Charoen Krung Creative District, Ekkamai design shops",
    price: "Design objects ฿500–20,000",
    why: "Contemporary Thai design has found its identity — Thai designers at TCDC and connected studios are producing furniture, ceramics, textiles, and home objects that blend Thai craft traditions with international design sensibility. The Charoen Krung neighborhood (Warehouse 30, Jam Factory, and surrounding shops) has the highest concentration of contemporary Thai design objects. Ekkamai's independent shop strip has several design-focused lifestyle stores. The difference from Chatuchak craft: these are designed objects with brand identity, not artisan market items.",
    tip: "Contemporary Thai design worth buying: elephant motif items HAVE reached saturation (avoid these as gifts — they read as tourist trinkets). Better Thai design souvenirs: contemporary ceramic vessels from Thai potters who blend Sukhothai traditions with modernist forms; silk products from Jim Thompson or Queen's SUPPORT Foundation that show contemporary weaving design; lacquerware objects from northern Thailand artisan cooperatives (beautiful and genuinely traditional). TCDC's gift shop has curated Thai design objects — quality-vetted by the design center's standards.",
  },
];

export function BangkokHomeDecor() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🏠 Home decor shopping in Bangkok — Chatuchak artisans, antiques & contemporary Thai design
      </div>
      <div className="space-y-2">
        {SPOTS.map((s) => (
          <div key={s.name} className="border border-amber-100 rounded-xl p-3">
            <div className="flex items-start gap-2 mb-1.5">
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">{s.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{s.area}</div>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-green-700">{s.price}</span>
            </div>
            <div className="text-[10px] text-[var(--fg)] mb-0.5 leading-snug">{s.why}</div>
            <div className="text-[10px] text-amber-700">💡 {s.tip}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
