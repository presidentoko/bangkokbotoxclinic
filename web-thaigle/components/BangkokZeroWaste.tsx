const TOPICS = [
  {
    title: "Zero Waste Living in Bangkok",
    emoji: "♻️",
    summary: "Bangkok's zero waste movement has grown from a niche expat concern into a visible Thai consumer lifestyle trend. Zero waste initiatives available in Bangkok: (1) Package-free grocery shops — Refill Station Bangkok (Phrom Phong area) and similar shops allow customers to bring containers and purchase dry goods, cleaning products, and personal care items by weight without packaging; (2) Bring-your-own culture — Bangkok coffee shops increasingly offer cup discounts for customers with reusable cups (฿10–20 reduction at Starbucks, many independent cafés follow similar practice); (3) Beeswax wraps and silicone alternatives to plastic wrap — available at Thonglor's zero waste shops and online Thai vendors; (4) Secondhand markets — Bangkok's strong secondhand culture (Chatuchak, various vintage markets, Facebook Marketplace Thailand) inherently supports circular consumption; (5) Food waste composting — Bangkok's Compost Station app and community composting points enable residents without gardens to contribute organic waste to municipal composting programs.",
    action: "Zero waste Bangkok resources: Refill Station BKK (Instagram: refillstationbkk), Green Bangkok community Facebook group, and Compost Thailand app for composting point locations.",
  },
  {
    title: "Bangkok's Secondhand & Thrift Culture",
    emoji: "👕",
    summary: "Bangkok's secondhand market ecosystem has diversified dramatically — from the original Chatuchak secondhand section to specialized vintage clothing, furniture, and electronics markets: (1) Chatuchak Weekend Market sections 2, 3, 4 — classic secondhand clothing, vintage jewelry, antiques; (2) The Pastel vintage market (Ekkamai area) — curated vintage fashion market with quality curation above Chatuchak; (3) Carousell Thailand — the secondhand selling platform dominant in Bangkok's digital resale market for electronics, fashion, and household goods; (4) Facebook Marketplace and Facebook groups — massive informal secondhand market for everything from furniture to kitchen equipment to electronics; (5) Book republic — secondhand English books, Bangkok's answer to the global secondhand book culture; (6) MBK Center Level 4 — secondhand electronics, refurbished phones, and tech resale in Bangkok's original tech market.",
    action: "Bangkok secondhand resources: Carousell Thailand app, Facebook Marketplace Bangkok, Chatuchak Weekend Market (weekend mornings), and 'Buy Nothing Bangkok' Facebook group for free item exchange.",
  },
  {
    title: "Bangkok Green Spaces & Environmental Activism",
    emoji: "🌿",
    summary: "Bangkok has been expanding its public green space infrastructure while the environmental activism community has grown more organized around specific issues: (1) Benchakitti Forest Park (Asok area) — Bangkok's newest and largest green corridor, extending from the existing park toward Asiatique with pedestrian and cycling paths through urban forest; (2) Bang Kachao — the 'Green Lung' river island that Bangkok's environmental community has successfully protected from development pressure; critical environmental battle for Bangkok's urban cooling; (3) River and canal clean-up organizations — multiple NGOs organize regular Bangkok river/canal clean-up events coordinated through social media; (4) Lumpini Park environmental events — Lumpini's park management hosts sustainability events, tree planting days, and nature education programs; (5) Thai Young Environmental Group (YEG Thailand) — the most visible Thai youth environmental organization, organizing events and advocacy around plastic pollution, carbon emissions, and biodiversity.",
    action: "Connect with Bangkok environmental activism: YEG Thailand (Instagram: yeg_thailand), Greenpeace Thailand (community events), and Trash Hero Bangkok for clean-up event coordination.",
  },
  {
    title: "Bangkok Sustainable Fashion & Ethical Consumption",
    emoji: "👗",
    summary: "Bangkok's position as a global fashion production hub creates unique opportunities for ethical fashion engagement: (1) Thai artisan fashion — buying directly from Thai traditional textile producers (northern highland silk, northeastern mudmee silk, natural indigo-dyed cotton) supports artisan communities and provides unique, craft-made pieces at fair prices; (2) Ethical fashion brands in Bangkok — a growing number of Bangkok-based fashion brands (Praya Palazzo, various social enterprise fashion labels) explicitly use sustainable production practices and transparent supply chains; (3) Sustainable fabric shopping — Bangkok's fashion district (Pratunam, Bo Bae Tower) has fabric vendors with deadstock fabric (overstock from production runs) at low prices; the best material for upcycled fashion; (4) Repair culture — Bangkok has tailors who repair and alter clothing at prices that make repairing versus replacing economically rational (hem repair: ฿100–300; zip replacement: ฿150–500); (5) Slow fashion events — the Bangkok fashion community has a small but active slow fashion scene that hosts periodic sample sales, sustainable fashion markets, and brand events at venues like Warehouse 30 and Nap Park.",
    action: "Bangkok ethical fashion: Chatuchak section 8 for antique textiles, Pratunam for deadstock fabric, and Nowhere By Nomads Bangkok for conscious fashion pop-up events.",
  },
];

export function BangkokZeroWaste() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        ♻️ Bangkok sustainability — zero waste living, secondhand culture & green spaces
      </div>
      <div className="space-y-1.5">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-green-100 rounded-xl">
            <summary className="px-3 py-2 cursor-pointer font-bold text-xs flex items-center gap-2">
              <span>{t.emoji}</span>
              <span>{t.title}</span>
            </summary>
            <div className="px-3 pb-3">
              <div className="text-[10px] text-[var(--fg)] leading-snug mb-1">{t.summary}</div>
              <div className="text-[10px] text-green-700">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
