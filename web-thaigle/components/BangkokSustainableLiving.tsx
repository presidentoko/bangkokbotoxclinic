const TOPICS = [
  {
    title: "Zero Waste Living in Bangkok — Eco Markets, Bulk Refill & Plastic Alternatives",
    emoji: "♻️",
    summary: "Bangkok's sustainability movement has developed from niche to mainstream across several channels: (1) Bulk/refill stores: Bangkok's refill store scene offers package-free detergent, shampoo, conditioner, and household products; stores like Refill Station (multiple locations in Sukhumvit), Thann (eco-concept), and community cooperative stores in Bang Sue and Lad Phrao allow consumers to bring their own containers; (2) Zero-waste grocery options: Eathai (Central Embassy food hall), Tops Market organic section, Gourmet Market, and specialty stores (Villa Market, Foodland) increasingly stock package-reduced or organic products alongside conventional options; Or Tor Kor Market's open-market format allows direct purchase without packaging from vendors; (3) Vintage and second-hand culture: Bangkok's vintage clothing scene (Chatuchak Market, Siam Square thrift shops, online platforms Vintage.i.am, TPOP) intersects with sustainability; buying second-hand extends garment lifespan and reduces fast fashion impact; (4) Community fridges and food sharing: Bangkok's community refrigerator network (ตู้เย็นชุมชน) distributes surplus food from supermarkets and restaurants to communities with food insecurity; started during COVID and now operating in multiple Bangkok neighborhoods; (5) Reusable bag culture: Thai cultural practice of using reusable bags (ถุงผ้า) at markets has strong local precedent that predates the global sustainability movement; traditional market culture (Chatuchak, Or Tor Kor) never fully abandoned reusables; the government's plastic bag ban (at large retail stores from 2020) has accelerated this practice.",
    action: "Refill Station (refillstationthailand.com) for bulk product refill locations; Bangkok's zero-waste community network on Facebook (Zero Waste Thailand group); Chatuchak Weekend Market Section 4 for vintage and upcycled goods; Or Tor Kor Market for package-minimal fresh produce.",
  },
  {
    title: "Sustainable Transportation in Bangkok — E-Bikes, BTS Expansion & Car-Free Days",
    emoji: "🚲",
    summary: "Bangkok's transport sustainability has been shaped by rapid BTS expansion, emerging cycling culture, and EV adoption: (1) BTS Skytrain sustainability: the BTS extension program (Bang Wa, Bearing, Kheha, to multiple outer-Bangkok destinations) continues to reduce vehicle trips; the BTS system carried over 800,000 daily riders pre-COVID and is returning toward those numbers; electric-powered BTS trains are Bangkok's most energy-efficient mass transport; (2) E-bike growth: Thailand's electric bicycle market has grown rapidly; JIFI, E-Twow, Yadea, and domestic Thai brands sell electric bicycles and scooters at ฿10,000–50,000; the Phuket and Chiang Mai models of resort-area e-bike rental are being adapted for some Bangkok neighborhoods; (3) Car-Free Days: Bangkok hosts periodic Car-Free Day events (historically November–December) on major roads; Ratchadamri Road and central Bangkok streets temporarily close to vehicles for cycling and pedestrian events; (4) MuvMi electric tuk-tuk: MuvMi operates a shared electric tuk-tuk ride service in Bangkok neighborhoods (Ekkamai, Thong Lo, Sukhumvit) using app-booked shared rides; a more sustainable, community-scaled version of ride-sharing in compact neighborhoods; (5) Bangkok Cycling Club: the Bangkok Cycling Club and Cycling Thailand communities organize group rides (often Sunday morning before traffic builds); the Bang Krachao green lung cycling circuit (15km canal-side loop) and early-morning Rama IX Park cycling routes provide the best car-minimized Bangkok cycling infrastructure.",
    action: "MuvMi electric tuk-tuk app (muvmi.com) for Thong Lo/Ekkamai neighborhood eco transport; BTS skytrain system (bts.co.th) for carbon-low transit; Bang Krachao cycling: ferry from Klong Toey pier + bicycle rental at island entrance (฿60–150/hour).",
  },
  {
    title: "Bangkok's Urban Agriculture & Community Gardens",
    emoji: "🌱",
    summary: "Urban agriculture has emerged as a Bangkok sustainability trend combining food security, community building, and green space: (1) Rooftop and vertical farms: Bangkok's high-density urban core has seen the emergence of rooftop farms (Sky Vegetables near Mo Chit, Central Group's farm-to-table initiatives on shopping center roofs, Mah Boon Krong's urban farm experiments); the limited land in dense Bangkok makes vertical and rooftop approaches the most viable urban agriculture format; (2) Community gardens and urban farming cooperatives: community-organized growing spaces have developed in Bangkok's less dense outer districts (Lat Krabang, Bang Khun Thian, and Bang Khen); the Bangkok Metropolitan Administration's community farm program has allocated city land parcels for community food growing; (3) Organic certification in Thailand: Thailand's Participatory Guarantee System (PGS) organic certification provides affordable organic verification for small farmers; the PGS network connects Bangkok consumers directly with certified producers; Bangkok's Saturday and Sunday organic markets (Kasetsart University market, Thammasat organic market) source from PGS-certified farmers; (4) Hydroponic and indoor growing: Thailand's climate makes year-round outdoor growing possible, but Bangkok's urban heat island and pollution make indoor hydroponic systems (available commercially at Robinson, The Mall, and urban growing product shops) an urban apartment growing option; (5) Farm-to-fork restaurant integration: Bangkok's sustainability-focused restaurants (Baan, The Never Ending Summer, Bo.lan, 100 Mahaseth) source from named farms and cooperatives; transparency about sourcing is a differentiating value proposition in Bangkok's premium restaurant market.",
    action: "Bangkok community garden access: Chatuchak Park community growing area; Bangkok Metropolitan Administration (bangkok.go.th) for information on community farm programs; Kasetsart University Weekend Market for direct-from-farm organic produce (Saturday morning, Kasetsart main campus); PGS Thailand organic certification network.",
  },
  {
    title: "Bangkok's Environmental Challenges & Conservation Action",
    emoji: "🌏",
    summary: "Bangkok faces significant environmental challenges; understanding these is essential context for sustainable visitors: (1) Air quality reality: Bangkok's PM2.5 particulate matter levels significantly exceed WHO guidelines during November–March dry season (particularly January–March); vehicles, agricultural burning upwind in northern Thailand, and industrial emissions combine to produce hazard-category air quality during peak periods; checking IQAir Bangkok real-time data before outdoor activities is a practical safety measure; (2) Chao Phraya water quality: despite improvement projects, the Chao Phraya carries significant industrial runoff, agricultural chemical runoff, and urban sewage; sustainable seafood in Bangkok requires awareness of sourcing; the government's waterway cleaning efforts (buoy barriers for plastic collection, increased wastewater treatment) show measurable progress; (3) Canal pollution: Bangkok's remaining canal network faces plastic waste, organic waste, and chemical runoff; community canal clean-up efforts (บุญคืนชีพคลอง — canal revival merit-making programs) have mobilized volunteers and achieved visible cleanup in specific canals; (4) Biodiversity and urban wildlife: Bangkok's urban parks (Suan Rot Fai, Lumphini, Ram Intra, Suan Luang Rama IX) support significant bird populations (over 200 species recorded in urban Bangkok) and mammals (monitor lizards, civets); Lumphini Park's Siamese monitor lizard population is Bangkok's most famous urban wildlife resident; (5) Climate change Bangkok flooding: Bangkok's low-lying geography (1–3m above sea level) and subsidence (ground sinking due to groundwater extraction — the city sinks 1–2cm/year in some areas) make it one of Southeast Asia's most climate-vulnerable major cities; 2011's historic flooding partially inundated Bangkok and influenced city-wide flood management infrastructure investment.",
    action: "Bangkok real-time air quality: iqair.com/thailand/bangkok; Pollution Control Department Thailand (pcd.go.th) for official air quality monitoring; Community canal clean-up: Seub Nakhasathien Foundation (seub.or.th) for conservation news; Lumphini Park bird watching map available at park information center.",
  },
];

export function BangkokSustainableLiving() {
  return (
    <div className="rounded-2xl border border-green-200 bg-white p-4 my-4">
      <div className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">
        🌱 Bangkok sustainable living — zero waste, eco transport, urban farms & environmental reality
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
