const TOPICS = [
  {
    title: "Bangkok Furniture Shopping — From Factory Direct to Designer Imports",
    emoji: "🛋️",
    summary: "Bangkok's furniture market serves both export and domestic consumption and offers extraordinary variety at competitive prices: (1) Thai furniture manufacturing: Thailand is one of Southeast Asia's largest furniture manufacturers (primarily teak, rubberwood, and rattan furniture); Bangkok's furniture wholesale market (Lad Phrao Road, On Nut area) offers factory-direct prices; Thai furniture quality for teak and rubberwood products is internationally respected; (2) Chatuchak furniture section: the Chatuchak Weekend Market has a dedicated furniture section (sections 8–10) selling both handmade Thai furniture and imported pieces; small decorative furniture (stools, side tables, carved wood pieces) purchased at Chatuchak can realistically be transported via taxi or airline; (3) MBK Center and shopping mall imports: Bangkok's shopping malls carry imported furniture from Italy, Scandinavia, and other design countries at Thai import tax-adjusted prices; the premium furniture brands (B&B Italia, Flos, Vitra, Cassina) at high-end Bangkok interiors showrooms are available but at international pricing; (4) Bangrak furniture district: Bangkok's professional furniture district (around Charoen Krung and Bangrak area) has showrooms catering to architects, interior designers, and hotel procurement; visiting this area provides access to both Thai-manufactured and imported commercial-grade furniture; (5) Custom furniture in Bangkok: Bangkok has a substantial custom furniture manufacturing industry; providing a design (photo, sketch, measurement specification) to Bangkok furniture workshops allows custom production in 2–6 weeks at 40–70% below Western custom furniture pricing; the rubberwood and teak craftsmanship quality in Bangkok's workshops is high.",
    action: "Chatuchak Weekend Market section 8–10 for furniture; Lad Phrao Road furniture wholesale strip (north Bangkok); Bangkok Furniture Fair (annual, BITEC Bangna, check schedule); Homepro stores (Thai equivalent of Home Depot, multiple Bangkok locations) for hardware and fittings; IKEA Bangkok (Bangna, on BTS access route) for Scandinavian design flat-pack; Chatuchak market map for furniture sections at chatuchakguide.com.",
  },
  {
    title: "Bangkok Interior Design Scene — Thai Architects, Designers & Renovation",
    emoji: "🏡",
    summary: "Bangkok has a sophisticated interior design industry serving both expats and high-end Thai clients: (1) Thai interior design aesthetic: Bangkok's contemporary Thai interior design merges traditional Thai aesthetics (deep wood tones, intricate lacquerwork, tropical plant elements) with modern minimalism; the result is a distinctive 'tropical modern' aesthetic that is widely copied internationally; Bangkok's high-end hotels (particularly boutique hotels in Charoen Krung and Sukhumvit) demonstrate this aesthetic; (2) Design week influence: the annual Bangkok Design Week (BKKDW, January, Charoen Krung district) has elevated Thailand's design industry visibility; international architecture and design publications increasingly feature Bangkok-based projects; Thai architects (Duangrit Bunnag Architect, CHAT Architects, Walllasia) have achieved international recognition; (3) Renovation complexity for foreigners: foreigners renting Bangkok properties who want to renovate must navigate lease agreements (renovations typically require landlord approval), Thai contractor relationships (language barrier and project management communication), and material procurement (Bangkok material suppliers cater primarily to Thai contractors); using bilingual project managers or expat-experienced contractors reduces renovation friction; (4) Thai contractor market: Bangkok has a large informal construction and renovation contractor market; finding reliable contractors through expat communities (Facebook Bangkok Expats, specific neighborhood groups) is more reliable than random contractor selection; established firms with portfolio documentation and English-speaking project managers exist in Bangkok's expat-focused service economy; (5) Thailand's architecture education: Bangkok's architecture faculties (Chulalongkorn, King Mongkut's Institute of Technology Ladkrabang, Silpakorn) produce internationally competitive architects; several Bangkok firms have won international design awards; Walllasia's housing projects and CHAT Architects' Bangkok Bank HQ renovation have received major international recognition.",
    action: "Thailand Association of Interior Designers (TAID) for professional directory; Bangkok Design Week (bkkdw.net) for current Thai design showcase; Homepro (homepro.co.th) Thai home improvement store; Thailand Builder magazine for Bangkok architecture news; Pinterest for Bangkok interior design reference; Duangrit Bunnag Architect (dbalp.com) for reference example of high-end Thai contemporary architecture.",
  },
  {
    title: "Bangkok Supermarkets & Imported Grocery Guide",
    emoji: "🛒",
    summary: "Bangkok has extensive international food availability for expatriate and international residents: (1) Main supermarket chains: Tops Market (Central Group, highest-quality domestic chain, significant imported food selection); Gourmet Market (premium, in Siam Paragon, Emporium, Icon Siam — the most comprehensive imported food selection); Villa Market (expat-focused, multiple Bangkok locations, strong Western import range); Foodland (24-hour, multiple locations, good domestic and some imports); Lotus's (formerly Tesco Lotus, largest discount chain, 100+ Bangkok locations); BigC (discount hypermarket); (2) Imported food availability: Bangkok's premium supermarkets carry most common Western food imports: European cheeses, French butter, Australian beef, New Zealand lamb, Japanese wagyu, Spanish ham, Italian pasta varieties, French wines, craft beers, British biscuits, American cereals; prices for imports are 1.5–3x equivalent Bangkok domestic products; (3) Specialty international food sources: Bangkok's specialty food community is served by: Villa Market (Australian and British imports); Gourmet Market (widest selection of European delicacies); Asian specialist supermarkets (Japanese: Fuji Supermarket, Maruetsu nearby Phrom Phong; Korean: K-grocery stores near Ekkamai); Indian grocery (Nana area South Asian groceries); Halal butchers (Nana area, Haroon Mosque vicinity); (4) Bangkok's fresh produce quality: Bangkok's fresh produce markets (Or Tor Kor, near Chatuchak) offer superior domestic Thai fresh produce quality; tropical fruits (mangosteen, longan, durian, rambutan, dragonfruit) are at their best in Bangkok markets; imported produce (European berries, apples, temperate vegetables) is available at premium pricing through Gourmet Market and specialty stores; (5) Organic and health food: Bangkok's health food retail has grown significantly; organic domestic produce is available through Lemon Farm (health food chain, multiple Bangkok locations), organic farmers markets (Chatuchak Sunday market has organic section, KasetsartUniversity Organic Market), and health food sections in Tops Market and Gourmet Market.",
    action: "Tops Market locations across Bangkok for mid-range domestic and imported grocery; Gourmet Market (Siam Paragon B1, EmQuartier, Icon Siam) for highest import selection; Villa Market Bangkok for British and Australian imports (villamarket.com for locations); Fuji Supermarket (Phrom Phong area, BTS Phrom Phong adjacent) for Japanese groceries; Lemon Farm (lemonfarm.co.th) for Thai organic groceries; Or Tor Kor Market (adjacent Chatuchak, MRT Kamphaeng Phet) for premium Thai fresh produce.",
  },
];

export function BangkokFurnitureHome() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
        🛋️ Bangkok living essentials — furniture shopping, interior design & expatriate grocery guide
      </h2>
      <div className="space-y-1.5">
        {TOPICS.map((t) => (
          <details key={t.title} className="border border-amber-100 rounded-xl">
            <summary className="px-3 py-2 cursor-pointer font-bold text-xs flex items-center gap-2">
              <span>{t.emoji}</span>
              <span>{t.title}</span>
            </summary>
            <div className="px-3 pb-3">
              <div className="text-[10px] text-[var(--fg)] leading-snug mb-1">{t.summary}</div>
              <div className="text-[10px] text-amber-700">→ {t.action}</div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
