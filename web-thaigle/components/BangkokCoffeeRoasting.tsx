const SPOTS = [
  {
    name: "Bangkok's Third Wave Coffee Roasters",
    emoji: "☕",
    area: "Independent roasters throughout Bangkok: Roots Coffee Roaster (multiple branches, Ari/Thonglor), Brave Roasters (Charoenkrung), Pacamara (Thonglor/Ekkamai), Casa Lapin (Thonglor), and dozens of micro-roasters across creative neighborhoods",
    price: "Single origin coffee (in café): ฿90–180; Espresso: ฿70–150; Cold brew: ฿120–200; Coffee cupping session: ฿500–1,500; Specialty beans (100g): ฿200–800; Barista workshop: ฿2,000–5,000",
    why: "Bangkok's specialty coffee scene has undergone extraordinary growth in the past decade — from near-zero to one of Asia's most sophisticated coffee markets. The drivers: (1) Thai highland coffee — northern Thailand's mountain regions (Doi Chang, Doi Inthanon, Doi Saket in Chiang Rai and Chiang Mai) produce specialty arabica beans of increasing quality that have created a domestic specialty coffee supply chain; (2) Thai barista talent — Thai baristas compete at the World Barista Championship and have accumulated international competition trophies; (3) Café culture explosion — Bangkok's café density has reached the point where even side soi neighborhoods have multiple specialty options; (4) Consumer sophistication — Bangkok coffee consumers have rapidly developed palates for single-origin, natural and washed process, and micro-lot coffees. The result is a Bangkok specialty coffee scene where the average independent café has better dialed-in espresso and more interesting filter coffee selections than many equivalents in Western cities.",
    tip: "Bangkok specialty coffee exploration: (1) Distinct zones: Thonglor (Sukhumvit Soi 55) is Bangkok's most café-dense specialty neighborhood; Ari (north Bangkok, near Mo Chit) has a residential café culture with excellent options; Charoenkrung Creative District has heritage shophouse cafés alongside contemporary roasters; (2) Thai vs. imported: seek cafés that feature Thai-origin beans alongside their international selections — single-origin Doi Chang arabica, natural-process Mae Taeng, or carbonic maceration Thai highland coffee represent the domestic industry at its best; (3) Roaster visits: many Bangkok roasters operate their production roaster adjacent to or near their café — visiting on roasting days (typically weekdays mornings) allows watching the process; (4) Barista training: Bangkok's coffee industry has multiple SCA (Specialty Coffee Association)-certified training centers offering professional barista courses; even the Foundation level barista course (฿5,000–8,000, 2 days) provides useful coffee knowledge; (5) Bangkok's café maps: dedicated coffee enthusiast Instagram accounts like 'Bangkok Coffee Scene' and local coffee bloggers maintain current maps of the best new openings.",
  },
  {
    name: "Thai Coffee Origin & Highland Coffee Farms",
    emoji: "🌱",
    area: "Northern Thailand coffee farms: Doi Chang village (Chiang Rai province, 9 hours from Bangkok by overnight train/bus), Doi Saket, Mae Taeng, Doi Inthanon area; Bangkok-based coffee importers and roasters bringing highland coffee to the capital",
    price: "Bangkok coffee with Thai-origin beans: ฿90–200/cup; Direct farm coffee purchase (at origin): ฿400–1,500/250g; Bangkok roaster Thai-origin bag: ฿300–800/250g; Coffee farm tour (from Chiang Mai): ฿1,500–4,000",
    why: "Thai highland arabica coffee has evolved from a humble crop introduced to replace opium cultivation in northern hill tribe communities (through a royal development project by King Rama IX) to a sophisticated specialty coffee sector producing competition-winning beans. Doi Chang coffee — from the village of Ban Doi Chang in Chiang Rai province, inhabited primarily by the Akha hill tribe — was one of Thailand's first arabica coffees to achieve international specialty recognition; it is now exported to specialty roasters worldwide. Doi Inthanon (near Thailand's highest peak), Mae Taeng, and dozens of other northern highland growing areas have diversified Thailand's coffee origin profile. The stories behind Thai coffee are compelling: the royal development project connection, the hill tribe communities that now derive significant income from coffee, and the recent explosion in processing experimentation (natural, honey, washed, anaerobic, carbonic maceration) at Thai farms all create narrative richness that adds depth to every cup.",
    tip: "Thai coffee origin connection from Bangkok: (1) Best access from Bangkok: overnight train from Bangkok to Chiang Mai (11 hours, sleeping berth) connects to the northern coffee region most comfortably; flying (1.5 hours) is faster but misses the train experience; (2) Bangkok roasters with Thai-origin focus: seeking cafés and roasters that specifically prioritize sourcing from Thai farms (some list farms by name on their menu) directly supports the highland communities and provides the most interesting Thai coffee experience; (3) Coffee as souvenir: well-packaged Thai-origin specialty coffee is one of Bangkok's best food souvenirs — lightweight, culturally meaningful, and consumable after return; look for specialty coffee bags with roast date and origin information; (4) Hill tribe connection: purchasing Thai highland coffee at origin markets (via Chiang Rai or Chiang Mai day trip) means more money reaches the farming communities directly; (5) Bangkok Thai coffee events: the Thailand Coffee Fest and similar periodic Bangkok coffee events feature Thai-origin producers alongside international exhibitors — attending during your Bangkok visit provides concentrated exposure to the industry.",
  },
  {
    name: "Home Coffee Brewing & Bangkok Coffee Equipment",
    emoji: "🔧",
    area: "Coffee equipment shops in Sukhumvit (near Asok, near Phrom Phong), specialty coffee equipment importers, department store coffee sections (Siam Paragon, Emporium), and online Bangkok coffee shops for delivery",
    price: "AeroPress: ฿1,500–2,000; V60 pour-over kit: ฿800–3,000; Hario grinder (manual): ฿1,500–4,000; Baratza/Comandante grinder (electric): ฿8,000–30,000; Moka pot: ฿500–2,500; Quality kettle: ฿1,500–5,000",
    why: "Bangkok's specialty coffee ecosystem extends into home brewing equipment — a natural extension of the café culture for Bangkok's substantial home-brewing community. Japanese brewing equipment brands (Hario, Kalita, Kinto) have captured Bangkok's pour-over community with elegant designs and reliable brewing performance; these are available at Bangkok specialty coffee shops and online at Thai prices that are competitive with global retail. The moka pot tradition (Italian-origin pressurized stovetop brewing) has particular traction in Thailand because it fits Thai kitchen infrastructure (gas burner cooking is standard) and produces concentrated espresso-like coffee suitable for Thai iced coffee preparations. Bangkok has several dedicated coffee equipment retailers that also serve as community hubs — barista competition preparation gear, professional espresso machine parts, and roasting equipment are stocked by specialist importers who serve both professional and enthusiast markets.",
    tip: "Bangkok coffee equipment practical guide: (1) Import duty consideration: some premium coffee equipment (professional espresso machines, certain grinders) may be subject to Thai import duties that make prices higher than international retail; checking against home country prices before purchasing expensive equipment avoids overpaying; (2) V60 and AeroPress are Bangkok café favorites: these brewing devices are widely available at specialty coffee shops as retail items; often purchasing at a café where staff can demonstrate proper technique is better value than online-only purchase; (3) Bangkok online: Thailand's Shopee and Lazada platforms have extensive coffee equipment listings including authentic Japanese pour-over equipment at competitive prices with fast Bangkok delivery (next-day for many items); (4) Water quality: Bangkok tap water is treated but carries distinct taste; home brewers using serious equipment should filter water (Brita, reverse osmosis) or use bottled spring water for best extraction results; (5) Thai coffee grinder market: specialty coffee hand grinders are popular in Bangkok's café culture (Instagram-worthy, portable for travel) — the Hario Slim, Timemore C3, and 1Zpresso models all have Bangkok retail availability at fair prices.",
  },
];

export function BangkokCoffeeRoasting() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        ☕ Bangkok coffee culture — third wave roasters, Thai highland coffee & home brewing
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
