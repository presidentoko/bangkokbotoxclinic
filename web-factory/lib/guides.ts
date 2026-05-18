// Long-form guides — long-tail SEO + AEO answer extraction.
// 1,500-2,500 words each. FAQPage Schema 제공으로 Google rich result 노출.

export type Faq = { q: string; a: string };

export type Guide = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faqs: Faq[];
  related?: string[];
  city_slugs?: string[];
  category_slugs?: string[];
  updated: string;
  // HowTo Schema 활성 시 어떤 섹션이 step 인지 표시. heading 이 'Step 1' / '1단계' / 'ขั้นตอนที่ 1' 같은 패턴이면 자동 감지.
  isHowTo?: boolean;
};

// Heuristic: 섹션 heading 이 step 패턴이면 HowTo step.
const STEP_PATTERN = /^(Step\s*\d|\d단계|ขั้นตอนที่\s*\d)/i;

export function extractHowToSteps(g: Guide): { name: string; text: string }[] | null {
  const steps = g.sections
    .filter((s) => STEP_PATTERN.test(s.heading))
    .map((s) => ({ name: s.heading, text: s.body.slice(0, 500) }));
  return steps.length >= 2 ? steps : null;
}

export const GUIDES: Guide[] = [
  {
    slug: "sourcing-thai-suppliers-direct",
    title: "How to Source from Thai Manufacturers Directly (Without an Agent)",
    metaTitle: "Sourcing Thai Suppliers Directly — Skip the 15-30% Agent Markup",
    metaDescription:
      "Step-by-step guide to contacting Thai manufacturers directly. When sourcing agents add value, when they don't, and how to build supplier shortlists from public data.",
    updated: "2026-05-09",
    intro:
      "Sourcing agents in Thailand typically mark up supplier quotes by 15-30%. For some buyers — first-timers, complex multi-supplier projects, or non-English-speaking sourcing teams — that's worth it. For everyone else, direct contact saves serious margin and gives you control of the supplier relationship. This guide shows the practical workflow.",
    sections: [
      {
        heading: "When agents add real value (and when they don't)",
        body:
          "Agents earn their cut on three things: language friction (when you don't speak Thai or basic English fails), QC physical presence (when factory visits aren't feasible), and multi-supplier orchestration (when one project spans 5+ vendors). " +
          "Agents do NOT add real value when: you've already shortlisted suppliers, the supplier has English website + responsive sales team, the order is straightforward (single SKU, standard spec), or you're doing repeat orders with proven vendors. " +
          "If your scenario fits the second list, going direct saves 15-30% margin permanently — every reorder.",
      },
      {
        heading: "Step 1 — Build a shortlist from verified public data",
        body:
          "Skip the trade-show / agent-introduction paths first. Start with a directory like Thai Supply Hub that surfaces verified Google Business Profiles. Filter by category (Manufacturer / Auto Parts / Industrial Estate / Warehouse) and city (Chon Buri / Rayong / Pathum Thani for Eastern Seaboard cluster). " +
          "Trust Score (0-100) = Google rating × 50% + log10(review volume) × 50%. Suppliers in the 70-85 range are typically established 5-10+ year operations with public proof. Below 50 = newer or less-reviewed. Build a shortlist of 5-10 candidates per category.",
      },
      {
        heading: "Step 2 — Send the first RFQ in English",
        body:
          "Most Thai manufacturers handling international orders have at least one English-speaking sales contact. The first email should: introduce your company in 2-3 lines, state the product/service category exactly, give an order volume estimate (annual or per-month), and ask three questions: lead time, MOQ, sample availability. " +
          "Keep the first email under 200 words. Attach a one-page spec sheet PDF if you have one. Reply rates from established Thai suppliers are around 60-80% within 48 hours when the email is clear and the volume signal is real.",
      },
      {
        heading: "Step 3 — Compare quotes on more than just price",
        body:
          "When 3-5 quotes come back, compare on: per-unit price, MOQ, lead time, sample cost & timing, payment terms (typically T/T 30% deposit + 70% before shipment for new buyers, L/C for larger), Incoterm options (FOB Laem Chabang vs CIF your port), and certifications (ISO 9001, ISO 14001, IATF 16949 for auto, HACCP/FSSC 22000 for food, RoHS/REACH for electronics). " +
          "A supplier 5% more expensive with a 60% shorter lead time and one-week sample turnaround is almost always the better choice for first-time orders.",
      },
      {
        heading: "Step 4 — Sample → factory visit → first PO",
        body:
          "Order paid samples from 2-3 finalists. Pay for them — most ASEAN supplier scams are caught here (no sample, request large deposit). " +
          "If the order is over USD 20,000 or recurring, plan a factory visit. Even a half-day site walk with a Thai-speaking translator (USD 50-100/day) gives you 80% of the QC signal a full audit would. Take photos of: machine condition (modern vs outdated), warehouse organization, QC inspection station, packaging area. " +
          "First PO should be small (10-20% of intended annual volume) with payment terms favoring you (T/T 30/70 with the 70% paid before shipment after QC pass). Build the relationship from there.",
      },
      {
        heading: "Common pitfalls",
        body:
          "Don't pay 100% upfront — even to suppliers with 200+ Google reviews. T/T 30/70 is the industry default for new buyers. " +
          "Don't skip Incoterm clarity. EXW vs FOB vs CIF affects who pays for what — clarify on the first quote. " +
          "Don't accept verbal lead times. Get them in writing in the PI (Proforma Invoice). " +
          "Don't use unverified WhatsApp/LINE contacts. Always go through the supplier's published website or phone (visible on Thai Supply Hub listings) for the first contact.",
      },
    ],
    faqs: [
      {
        q: "Do all Thai manufacturers speak English?",
        a: "No, but suppliers actively serving international markets do. Tier 1 OEM (Aisin, AGC, Toyoda Gosei), large industrial-estate tenants, and any supplier with an English-language website typically have English sales contacts. Smaller domestic-only suppliers often don't.",
      },
      {
        q: "How long does direct sourcing take vs through an agent?",
        a: "Direct: 4-8 weeks from first email to first PO for a new supplier (RFQ → quote → sample → contract → first order). Through an agent: 3-6 weeks (faster shortlist, slower contract negotiation). The time gap shrinks for repeat orders to the same supplier.",
      },
      {
        q: "What's a fair sourcing-agent commission?",
        a: "Typical commission ranges: 5-10% for buyer-side agents on simple sourcing, 10-20% for full-service (RFQ + QC + logistics), 25-30% for white-label or for buyers in non-English markets. If you're paying more than 15% for a single-supplier simple SKU order, you're overpaying.",
      },
      {
        q: "What about Alibaba?",
        a: "Alibaba's Thai supplier listings are weaker than its China listings — fewer verified suppliers, more agent re-listings, more contact friction. For Thai sourcing specifically, Google Business Profile data + direct phone/email beats Alibaba for finding established factories. For consumables and small-volume orders, Alibaba is still useful.",
      },
    ],
    related: ["eastern-seaboard-industrial-estates-compared", "thai-auto-parts-tier1-tier2"],
  },
  {
    slug: "eastern-seaboard-industrial-estates-compared",
    title: "Pinthong, Amata, WHA, Rojana — Eastern Seaboard Industrial Estates Compared",
    metaTitle: "Pinthong vs Amata vs WHA vs Rojana — Industrial Estate Comparison Thailand",
    metaDescription:
      "Side-by-side comparison of Thailand's four major industrial estate operators. Tenant mix, location, port access, lease rates, and which one fits your operation.",
    updated: "2026-05-09",
    intro:
      "Thailand's Eastern Seaboard manufacturing belt is anchored by four estate operators: Pinthong, Amata, WHA (post-Hemaraj merger), and Rojana. They all sound similar from the outside but profile differently on tenant mix, port access, lease economics, and infrastructure model. This guide breaks down the differences for buyers shortlisting a Thai manufacturing base.",
    sections: [
      {
        heading: "Pinthong — port-adjacent, automotive-heavy",
        body:
          "Pinthong operates 5 estates in the Sriracha / Bowin area, with Pinthong Industrial Estate 1 being the flagship. Strongest single attribute: physical proximity to Laem Chabang container port (under 30 min by truck). " +
          "Tenant mix skews automotive Tier 2/3 and packaging — Sumitomo, Bridgestone, Yamaha, Daikin all have facilities here or in walking distance. " +
          "Best fit for: export-heavy buyers shipping containers, automotive parts manufacturers, and anyone whose lead time is dominated by ocean freight.",
      },
      {
        heading: "Amata — large-scale infrastructure ownership",
        body:
          "Amata City Chonburi and Amata City Rayong are the two flagship estates. Amata's distinctive model: it owns and operates infrastructure (water, power substations, waste treatment) directly rather than leaving it to industrial-estate authority. " +
          "Tenant mix is broad — Toyota, Mitsubishi, Honda, Mazda automotive plants all have facilities in or near Amata estates. Occupancy runs 90%+ in the flagship Chonburi estate. Amata also operates an industrial estate in Hanoi (Vietnam) — useful for buyers planning Thailand+Vietnam dual-base manufacturing. " +
          "Best fit for: buyers wanting integrated infrastructure (less utility-side risk), large-scale long-term tenants, and Japanese automotive supply chain.",
      },
      {
        heading: "WHA (post-Hemaraj merger) — largest by area",
        body:
          "WHA acquired Hemaraj in 2015 and now operates 11 estates across Thailand totaling ~7,800 hectares — the largest industrial-estate operator in Thailand by total leased area. " +
          "Tenant mix is the most diverse of the four: Tier 1 automotive (AGC, Toyoda Gosei), petrochemical (in Rayong properties adjacent to Map Ta Phut), electronics, food, logistics. WHA Logistics Park 2 (formerly Hemaraj Logistics) is a top warehouse cluster for 3PL operators. " +
          "Best fit for: buyers wanting tenant-base diversity (multi-supplier sourcing in one zone), and warehouse / 3PL tenants.",
      },
      {
        heading: "Rojana — most distributed footprint",
        body:
          "Rojana operates estates in Chonburi/Rayong (Eastern Seaboard) but is also strongest in Ayutthaya and Prachinburi — outside the dense Eastern Seaboard cluster. " +
          "The Ayutthaya estates host Honda automotive and Sony electronics plants; Prachinburi serves food and packaging. " +
          "Best fit for: buyers wanting to escape Eastern Seaboard congestion and labor cost pressure, food/agriculture-adjacent operations, or those needing Bangkok proximity (Ayutthaya is 1 hour north of Bangkok vs Rayong's 2.5 hours).",
      },
      {
        heading: "Lease rate context",
        body:
          "Standard ready-built factory (RBF) lease rates across all four estates run THB 200-320 / sqm / month for standard tenants in 2026. " +
          "Land lease rates run THB 6-12 million / rai / 30-year lease for raw industrial land. Premium estates (Amata flagship Chonburi, Pinthong 1) command top of range. Newer estates and Ayutthaya properties run lower. " +
          "All four estates offer BOI tax incentive support (typically 5-8 year corporate income tax holiday for qualifying manufacturing) — apply through the Thailand Board of Investment, not the estate itself.",
      },
      {
        heading: "How to actually shortlist",
        body:
          "Decision tree: " +
          "(1) If port-export is the core economics → Pinthong. " +
          "(2) If you want infrastructure reliability for capital-intensive operations → Amata. " +
          "(3) If you want diverse co-located suppliers (multi-supplier sourcing) or 3PL warehouse → WHA. " +
          "(4) If Eastern Seaboard congestion / labor cost is a concern → Rojana Ayutthaya or Prachinburi. " +
          "Visit at least two before committing — leasing terms, corporate-tenant culture, and on-site amenities differ noticeably.",
      },
    ],
    faqs: [
      {
        q: "Which estate has the best lease rates?",
        a: "All four are within ~25% of each other for ready-built factory lease. Rojana Ayutthaya and newer WHA properties are lowest; Amata flagship Chonburi and Pinthong 1 are highest. The 25% spread rarely outweighs other factors (port access, supplier ecosystem, infrastructure model).",
      },
      {
        q: "Can I tour an estate before signing?",
        a: "Yes — all four operate visitor centers and offer scheduled tours. Contact the leasing office directly (phone listed on Thai Supply Hub estate pages) to arrange. A typical tour covers a sample factory unit, infrastructure facilities, and amenities.",
      },
      {
        q: "What about Map Ta Phut Industrial Estate?",
        a: "Map Ta Phut is a separate cluster operated by IEAT (Industrial Estate Authority of Thailand) plus several private operators. It's specifically the petrochemical cluster — PTT, IRPC, PTTGC, SCG Chemicals operate integrated complexes here. Different operator, different tenant profile from the four above.",
      },
      {
        q: "Are these estates only for large tenants?",
        a: "No — most operators offer ready-built factories from ~1,500 sqm up to 30,000+ sqm. Smaller (sub-1,000 sqm) tenants typically lease in incubator-style sub-zones or share larger facilities. Direct lease office contact via supplier listings clarifies what's available currently.",
      },
    ],
    related: ["sourcing-thai-suppliers-direct", "thai-auto-parts-tier1-tier2", "laem-chabang-warehouse-logistics"],
  },
  {
    slug: "map-ta-phut-petrochemical-cluster",
    title: "Map Ta Phut — Southeast Asia's Petrochemical Hub Explained",
    metaTitle: "Map Ta Phut Industrial Estate Guide — PTT, IRPC, PTTGC, SCG Chemicals",
    metaDescription:
      "Map Ta Phut is ASEAN's largest petrochemical complex. PTT, IRPC, PTTGC, and SCG Chemicals operate integrated complexes here. Buyer guide for chemical sourcing.",
    updated: "2026-05-09",
    intro:
      "Map Ta Phut Industrial Estate in Rayong is Southeast Asia's largest integrated petrochemical complex. PTT (state oil), IRPC (Integrated Refinery and Petrochemical Complex), PTTGC (PTT Global Chemical), and SCG Chemicals all operate full upstream-to-downstream complexes here. For chemical buyers sourcing from Thailand, the Map Ta Phut zone is unavoidable.",
    sections: [
      {
        heading: "What's at Map Ta Phut",
        body:
          "Upstream: PTT operates natural gas separation and aromatics complexes. IRPC runs an integrated refinery + olefin plant. PTTGC operates one of the largest ethylene cracker complexes in ASEAN. SCG Chemicals runs olefins, polyolefins, and downstream specialty plants. " +
          "Downstream: hundreds of specialty chemical, polymer compounding, and chemical-product manufacturers cluster around the upstream operators — supplied by direct pipeline or short-haul road. " +
          "Logistics: Map Ta Phut deep-sea port handles bulk chemical exports directly. Rail and road connect to Laem Chabang for container shipping.",
      },
      {
        heading: "Why buyers go to Map Ta Phut",
        body:
          "Pricing: integrated complexes mean petrochemical feedstock is cheaper at Map Ta Phut than anywhere else in ASEAN. Polyolefin compounders, specialty chemical formulators, and rubber/plastic downstream operators all benefit from the feedstock proximity. " +
          "Volume: monthly export capacity from Map Ta Phut handles bulk chemical shipments comfortably — buyers needing container loads or full vessels can source here without supply-chain stress.",
      },
      {
        heading: "How to engage suppliers in this cluster",
        body:
          "Tier 1 operators (PTT, PTTGC, IRPC, SCG Chemicals) are large public companies — direct sales contact requires going through their corporate offices, not the plant. Their websites have B2B sales portals. " +
          "Tier 2/3 specialty manufacturers (compounders, formulators, packaging chemical operators) are more accessible — most have public Google Business profiles with direct phone and sales email. Thai Supply Hub's chemical category listings surface these.",
      },
      {
        heading: "Environmental and safety context",
        body:
          "Map Ta Phut has been the focus of environmental regulation tightening since the 2009 emissions case. New tenants must clear EIA/EHIA review. " +
          "From a buyer perspective, this means: tenants here today have cleared modern environmental compliance bars. Sourcing from Map Ta Phut is typically lower environmental-risk than sourcing from older, less-regulated chemical clusters in some other ASEAN markets.",
      },
    ],
    faqs: [
      {
        q: "Can foreign buyers source from Map Ta Phut suppliers?",
        a: "Yes. Both upstream operators (PTT/PTTGC/IRPC/SCG) and the downstream chemical specialists in Map Ta Phut sell internationally. The major upstream players have dedicated international sales teams; downstream specialty operators typically work with overseas distributors or sell direct.",
      },
      {
        q: "Is Map Ta Phut accessible by container vs bulk?",
        a: "Both. Map Ta Phut deep-sea port handles bulk chemical exports directly (chemical tankers, bulk LPG, etc.). For containerized chemical shipments, Laem Chabang port (45 min by truck) handles container traffic.",
      },
      {
        q: "Are there smaller/specialty chemical suppliers near Map Ta Phut?",
        a: "Yes — Rayong and the surrounding zones host hundreds of Tier 2/3 chemical specialists. Compound formulators, masterbatch makers, specialty polymer compounders, packaging chemicals — all benefit from feedstock proximity to the upstream complexes.",
      },
    ],
    related: ["eastern-seaboard-industrial-estates-compared", "sourcing-thai-suppliers-direct"],
  },
  {
    slug: "thai-auto-parts-tier1-tier2",
    title: "Thai Auto Parts — Tier 1 / Tier 2 / Tier 3 Supplier Ecosystem",
    metaTitle: "Thai Auto Parts Manufacturing — Tier 1 Tier 2 Supplier Guide",
    metaDescription:
      "Thailand is ASEAN's automotive hub. Aisin, AGC, Toyoda Gosei (Tier 1) plus Tier 2/3 ecosystem mapped. Sourcing guide for OEM and aftermarket buyers.",
    updated: "2026-05-09",
    intro:
      "Thailand is the world's 10th-largest automotive producer and ASEAN's automotive hub. Toyota, Honda, Mitsubishi, Isuzu, Mazda, Nissan all operate full plants — and the entire Tier 1 / Tier 2 / Tier 3 supplier ecosystem clusters tightly around them on the Eastern Seaboard. This guide explains how the supplier hierarchy works and how buyers source at each tier.",
    sections: [
      {
        heading: "How the OEM supplier tiers work",
        body:
          "Tier 1: direct supplier to automotive OEMs. Examples in Thailand: Aisin Powertrain (Toyota Group), AGC Automotive (Asahi Glass — auto glass), Toyoda Gosei (rubber/plastic interior + functional parts), Denso Thailand (electrical/electronic systems), Summit Group (chassis, body), Thai Summit Harness (wiring harnesses). " +
          "Tier 2: supplies parts/components to Tier 1. Mid-size precision machining, plastic injection, metal stamping. " +
          "Tier 3: supplies raw inputs (steel, plastic resin, fasteners) to Tier 2. " +
          "Aftermarket: independent supply chain for replacement parts — distinct from OEM tiers. Tier 2/3 operators often serve both OEM and aftermarket.",
      },
      {
        heading: "Tier 1 — usually OEM-only",
        body:
          "Tier 1 suppliers operate under multi-year supply contracts with specific OEMs. Their entire production is typically reserved for those contracts. " +
          "For buyers: Tier 1 is reachable for international OEM partnerships, joint venture / technology licensing discussions, but usually not for spot purchasing. If you need parts that AGC Automotive makes for Toyota Thailand, you'll source from a Tier 2/3 aftermarket supplier or import from AGC's parent Japan operation, not from the Thai Tier 1 plant.",
      },
      {
        heading: "Tier 2 / Tier 3 — accessible for sourcing",
        body:
          "Most Thai-domestic mid-tier auto parts manufacturers serve both OEM (as Tier 2/3) and aftermarket. They cluster heavily in Chon Buri (Pinthong, Amata, Hemaraj) and Rayong (Amata City Rayong). " +
          "Categories include: precision machining (CNC, EDM), plastic injection molding, metal stamping & fabrication, rubber/sealing components, wiring harness assembly, brake/clutch components, suspension parts. " +
          "These are the suppliers buyers typically engage for: aftermarket parts manufacturing, white-label OEM for smaller automotive brands, custom auto parts for specialty applications.",
      },
      {
        heading: "How to engage by tier",
        body:
          "Tier 1: corporate office contact only. Long sales cycle (6-18 months to first contract). Joint venture / multi-year supply structure. " +
          "Tier 2: direct factory contact via website or phone (most have public Google Business profiles). Sales cycle 2-4 months for first PO. RFQ with spec sheets and volume signal. " +
          "Tier 3 / aftermarket: faster sales cycle (4-8 weeks). Often single-product specialists. Multiple suppliers per part type — easy to compare 5+ quotes.",
      },
      {
        heading: "Geographic concentration",
        body:
          "Chon Buri (Pinthong, Amata City Chonburi, Hemaraj Eastern Seaboard): densest Tier 1 + Tier 2 cluster, primarily Japanese OEM supply chain. " +
          "Rayong (Amata City Rayong, WHA Eastern Seaboard, IRPC adjacent): chemical/petrochemical-adjacent Tier 1 + downstream rubber/plastic Tier 2. " +
          "Pathum Thani / Ayutthaya: secondary cluster (Honda automotive plant in Ayutthaya, smaller Tier 2/3 ecosystem). Less dense but lower labor/lease cost than Chon Buri/Rayong.",
      },
    ],
    faqs: [
      {
        q: "Can I source from Aisin or AGC Thailand directly?",
        a: "For OEM-volume programs (multi-year, multi-million USD): yes, via their corporate offices. For aftermarket / smaller orders: usually no — these Tier 1 plants don't serve spot buyers. Source equivalent parts from Tier 2/3 specialists instead.",
      },
      {
        q: "What's typical lead time for Thai auto parts?",
        a: "Tier 2/3 with established sample: 8-14 weeks for new molds/tooling, 4-8 weeks for repeat orders. Tier 1: depends on OEM program scheduling. Aftermarket spot orders: 2-6 weeks for stocked items, 6-10 weeks for built-to-order.",
      },
      {
        q: "Are Thai auto parts certified to international quality standards?",
        a: "Yes — Tier 1 suppliers run IATF 16949 (automotive ISO standard) by default. Most Tier 2 specialists hold ISO 9001 + IATF 16949. Tier 3 / aftermarket varies; ISO 9001 is standard, IATF 16949 less common for parts not destined for OEM.",
      },
      {
        q: "How does Thailand compare to Vietnam for auto parts?",
        a: "Thailand has 30+ years of automotive supplier ecosystem maturity vs Vietnam's 10-15 years. Tooling quality, lead times, English communication, and supplier diversity all favor Thailand. Vietnam wins on labor cost. For complex parts or first-time sourcing, Thailand's ecosystem typically delivers better total cost despite higher labor rates.",
      },
    ],
    related: ["sourcing-thai-suppliers-direct", "eastern-seaboard-industrial-estates-compared"],
  },
  {
    slug: "laem-chabang-warehouse-logistics",
    title: "Laem Chabang Logistics — Warehousing and 3PL Around Thailand's Main Port",
    metaTitle: "Laem Chabang Warehouse & 3PL Guide — Eastern Seaboard Logistics",
    metaDescription:
      "Thailand's main container export port is Laem Chabang. Warehouse rents, 3PL operators, transit times. Buyer guide for warehousing near the Eastern Seaboard cluster.",
    updated: "2026-05-09",
    intro:
      "Laem Chabang is Thailand's largest container port and the export gateway for ~75% of Thai manufactured goods. Buyers sourcing from Eastern Seaboard manufacturers need either bonded warehouse or 3PL coverage in the Sriracha / Bowin / Bang Lamung corridor surrounding the port. This guide covers the practical logistics economics.",
    sections: [
      {
        heading: "Warehouse rent map",
        body:
          "Standard ready-built warehouse near Laem Chabang: THB 150-280 / sqm / month for plain non-bonded. Bonded warehouses: 20-30% premium. Temperature-controlled (cold chain): 50-100% premium. " +
          "Cheapest cluster: Bowin / Pluak Daeng (15-30 min from port, slightly inland) — THB 150-200/sqm. " +
          "Mid-tier: Sriracha / Si Racha district (10-20 min from port) — THB 200-260. " +
          "Premium: directly adjacent to port (Bang Lamung port-side) — THB 260-320, mostly leased to large 3PL operators or direct manufacturer-owned facilities.",
      },
      {
        heading: "3PL operator landscape",
        body:
          "International giants: DHL Supply Chain, Linfox Thailand, Yusen Logistics, Kerry Logistics — all operate large facilities in WHA Logistics Park 2 (post-Hemaraj merger) and along the Sriracha-Bowin corridor. Strong on integrated services (warehouse + transport + customs). " +
          "Regional specialists: Whale Logistics (Thailand-domestic), Thai Posten, JWD Group — competitive on cost and Thai-domestic distribution. " +
          "For buyers: international 3PLs are the safe choice for cross-border/multi-modal complexity. Regional specialists win on Thailand-domestic rates and faster contracting.",
      },
      {
        heading: "Transit time context",
        body:
          "Eastern Seaboard manufacturer → Laem Chabang gate-in: 30-90 minutes by truck depending on distance. " +
          "Laem Chabang → ASEAN ports (Singapore, Ho Chi Minh, Manila): 5-9 days. " +
          "Laem Chabang → North Asia (Yokohama, Busan, Shanghai): 6-12 days. " +
          "Laem Chabang → US West Coast: 16-22 days (Los Angeles direct or via Singapore transhipment). " +
          "Laem Chabang → North Europe: 22-30 days (Suez routing). " +
          "For air freight: Suvarnabhumi airport (90-120 min from Eastern Seaboard) handles roughly 10% of high-value Thai exports — typically electronics, automotive precision parts, specialty chemicals.",
      },
      {
        heading: "Picking a warehouse: priority checklist",
        body:
          "(1) Distance to your supplier base — under 30 min ideal for daily pickup operations. " +
          "(2) Distance to Laem Chabang or Suvarnabhumi for export coverage. " +
          "(3) Bonded vs non-bonded — bonded is required if you want to defer customs duty until export or domestic sale. " +
          "(4) Temperature control if needed (food/pharma/specialty chemicals). " +
          "(5) Building condition: ready-built warehouses (RBW) under 5 years old vs older spec — newer typically has better dock count, ceiling height (10m+), and electrical capacity. " +
          "(6) 3PL bundled service vs lease-only: pick based on your in-house logistics capability.",
      },
    ],
    faqs: [
      {
        q: "Do I need a Thai legal entity to lease a warehouse?",
        a: "Generally yes for direct lease. Foreign buyers without a Thai entity typically work through a 3PL operator (which holds the lease and provides bundled service) rather than direct lease. Thai 3PLs are accustomed to this model and quote it routinely.",
      },
      {
        q: "What's the difference between bonded and free trade zone (FTZ) warehouses?",
        a: "Bonded warehouse: customs duty deferred until goods leave; goods can be domestic-released or re-exported. Free Trade Zone warehouse: customs treatment as if outside Thailand — preferred for re-export operations. Most Eastern Seaboard 3PLs offer both options. Choice depends on whether you're importing for domestic distribution or re-export.",
      },
      {
        q: "Can I tour a warehouse before leasing?",
        a: "Yes — 3PL operators routinely host tours by appointment. Direct phone numbers on Thai Supply Hub warehouse listings reach the leasing/sales contacts. A typical tour covers facility, dock count/spec, neighbouring tenant mix, and proximity demonstration to port.",
      },
      {
        q: "How do I handle Thai customs from a warehouse?",
        a: "Customs brokerage is typically bundled with the 3PL service or handled by a separate licensed broker. Major operators (DHL, Linfox, Yusen, Kerry) all offer bundled brokerage. Independent brokers charge per-shipment (typically THB 500-2,500 per export declaration depending on complexity).",
      },
    ],
    related: ["sourcing-thai-suppliers-direct", "eastern-seaboard-industrial-estates-compared"],
  },
  {
    slug: "thai-food-manufacturer-haccp-export",
    title: "Thai Food Manufacturers — HACCP, FSSC 22000, and Export Sourcing",
    metaTitle: "Thai Food Manufacturers — HACCP / FSSC 22000 Export Suppliers",
    metaDescription:
      "Thailand is a top-3 processed food exporter. HACCP, FSSC 22000, GMP, halal certifications. Frozen seafood, poultry, snacks, ready meals — buyer guide.",
    updated: "2026-05-09",
    intro:
      "Thailand is one of the world's top three processed food exporters. Frozen seafood, poultry, ready meals, packaged snacks — all manufactured at scale to international food safety standards. This guide covers the certification landscape, geographic clusters, and how international buyers source.",
    sections: [
      {
        heading: "Certification baseline",
        body:
          "Thai food manufacturers serving international markets routinely hold: HACCP (universal), GMP (manufacturing baseline), FSSC 22000 (the global food-safety standard preferred by EU/US buyers), BRC Food Safety (UK retail). Halal certification is parallel — many Thai food manufacturers run halal-certified production lines for ASEAN/Middle East markets. " +
          "Confirm cert status during RFQ. The supplier should attach scan copies of valid certs (with expiry dates) in the first quote. Anyone hesitant to share certs upfront is a red flag.",
      },
      {
        heading: "Geographic clusters",
        body:
          "Samut Sakhon: largest cluster for frozen seafood, prepared seafood, sauces. Adjacent to Bangkok port. " +
          "Pathum Thani / Bangkok northern suburbs: ready meals, packaged snacks, beverages, dairy. " +
          "Chon Buri: poultry, processed meat, animal feed adjacent to Eastern Seaboard. " +
          "Songkhla / Hat Yai (south): rubber-adjacent food and seafood. Strong halal certification base. " +
          "Each cluster has 50-200 medium-large food manufacturers; smaller specialty operators dot the map elsewhere.",
      },
      {
        heading: "Major sub-categories",
        body:
          "Frozen seafood: shrimp, tuna, crab, mixed seafood — Thai Union Group, CP Foods, Thaco Foods are flagship. Tier 2/3 specialists serve niche markets. " +
          "Poultry: GFPT, Charoen Pokphand (CP) integrated chicken operations. Halal-certified parallel lines standard. " +
          "Ready meals: pouch-pack, tray-pack, frozen-and-shelf-stable. Strong export to UK / EU / Japan. " +
          "Snacks: fried/baked snacks, ASEAN-style flavors. Mostly OEM-friendly for white-label brands. " +
          "Beverages: bottled water, energy drinks, juice (Tipco, Doi Kham).",
      },
      {
        heading: "How to source",
        body:
          "Step 1: Shortlist 5-10 suppliers per category from a verified directory like Thai Supply Hub (filter by city + category 'food_mfg'). " +
          "Step 2: First RFQ includes target SKU, target volume (annual or monthly), target market (regulatory differs by country), MOQ tolerance, and target shelf life. Most Thai food manufacturers respond within 48 hours. " +
          "Step 3: Sample order. Pay for samples (USD 50-200 typical). Verify shelf-life and packaging quality on receipt. " +
          "Step 4: Factory audit. For food, on-site visit is more important than other categories — verify HACCP/FSSC compliance physically, view production lines, taste/test product. " +
          "Step 5: First PO with payment terms T/T 30/70 (industry standard for food sourcing).",
      },
    ],
    faqs: [
      {
        q: "Are Thai food MOQs realistic for a small brand?",
        a: "Frozen seafood: typically 1 container (15-20 tons) MOQ. Snacks/ready meals: 5,000-20,000 units depending on packaging complexity. Some Thai food OEMs accept 1,000-2,000 unit pilot runs at higher unit cost — useful for new-brand SKU testing.",
      },
      {
        q: "Halal certification — when does it matter?",
        a: "Required for export to ASEAN Muslim-majority (Indonesia, Malaysia, Brunei) and Middle East markets. Most large Thai food manufacturers run halal-certified parallel production. Confirm before RFQ if your target market requires it — adds zero cost for buyers but cert verification matters.",
      },
      {
        q: "Cold chain logistics from Thailand — how does it work?",
        a: "FOB Laem Chabang for reefer container exports — most Thai food manufacturers handle reefer container booking themselves or through 3PL. Air freight via Suvarnabhumi for premium/perishable. Cold-chain temperature documentation typically included per-shipment.",
      },
      {
        q: "Lead times for first order?",
        a: "Sample: 2-3 weeks. First production after sample approval: 4-8 weeks for new SKU/spec, 2-4 weeks for catalog SKU. Reorder cycle: 3-5 weeks typical.",
      },
    ],
    related: ["sourcing-thai-suppliers-direct"],
  },
  {
    slug: "thai-electronics-manufacturer-hdd-ems",
    title: "Thai Electronics Manufacturing — HDD, EMS, PCB, Automotive Electronics",
    metaTitle: "Thai Electronics Manufacturers — HDD, EMS, PCB Sourcing Guide",
    metaDescription:
      "Thailand is the world's #2 hard disk drive manufacturer. EMS/PCB/automotive electronics ecosystem mapped. Pathum Thani + Eastern Seaboard clusters.",
    updated: "2026-05-09",
    intro:
      "Thailand is the world's #2 hard disk drive (HDD) manufacturer behind the United States, and a significant EMS contract manufacturing hub. Western Digital, Seagate, Toshiba HDD operations, plus a deep Tier 2/3 PCB and electronics-component ecosystem cluster around Bangkok suburbs and the Eastern Seaboard. Buyer guide for sourcing Thai electronics.",
    sections: [
      {
        heading: "Sub-categories and cluster maps",
        body:
          "HDD assembly: Pathum Thani / Ayutthaya cluster. Western Digital, Seagate run major plants here — and the entire Tier 2 component supply (substrates, motors, head assemblies) clusters around them. " +
          "EMS (Electronic Manufacturing Services): broader cluster across Pathum Thani, Bangkok suburbs, Eastern Seaboard. Both international (Flex, Celestica) and domestic Thai EMS providers. " +
          "PCB fabrication: medium-tier domestic operators across Pathum Thani / Bangna industrial zones. Multilayer PCB capability (4-12 layers) widely available. HDI / flex PCB more limited. " +
          "Automotive electronics: Eastern Seaboard adjacent to OEM plants. Denso Thailand, Robert Bosch, Continental, AGC Automotive Electronics all operate here.",
      },
      {
        heading: "What buyers source from Thailand vs China",
        body:
          "Thailand wins for: HDD-related components (no other location has the cluster), automotive-grade electronics (IATF 16949 baseline, Toyota/Honda supply chain), low-volume / mid-tier EMS where China minimums are too high, ASEAN-customs-friendly origin for AFTA tariff routing. " +
          "China still wins for: consumer electronics OEM at scale, high-volume HDI/flex PCB, lithium battery integrated electronics. " +
          "Vietnam wins for: low-cost EMS at large volume, smartphone/laptop OEM. " +
          "Thailand is best fit for: automotive-tier electronics, mid-volume specialty EMS, HDD-supply components.",
      },
      {
        heading: "Sourcing process",
        body:
          "Tier 1 (Western Digital, Seagate, Denso, Bosch): not accessible for spot purchasing. Multi-year OEM contracts only. " +
          "Tier 2/3 EMS and PCB: direct via website/phone. Most have public Google Business profiles. RFQ should include: BOM (Bill of Materials), board specs (layer count, dimensions, thickness), PCBA assembly volume, certifications required (UL, FCC, RoHS, IATF 16949 for auto). " +
          "Sample expectation: PCBA prototype 2-4 weeks for new design, 1-2 weeks for catalog. First production: 6-12 weeks for new design, 3-6 weeks for repeat orders.",
      },
      {
        heading: "Certifications buyers should check",
        body:
          "RoHS (Restriction of Hazardous Substances): EU/global market default — all Thai electronics manufacturers exporting hold this. " +
          "REACH compliance: EU chemical regulation. Required for EU-bound electronics. " +
          "UL listing: US market for safety-related electronics (power supplies, lithium-related). " +
          "IATF 16949: automotive-grade quality system. Required for automotive-grade electronics. " +
          "ISO 9001 + ISO 14001: baseline for any serious electronics manufacturer.",
      },
    ],
    faqs: [
      {
        q: "Can I source small-volume PCBs from Thailand?",
        a: "Most Thai PCB fabricators have minimums of 50-100 panels for prototype runs. Smaller (1-10 piece) prototype runs are typically routed through China (PCBWay, JLCPCB) — Thai cost competitiveness shows up at 50+ panel volumes.",
      },
      {
        q: "Is automotive-electronics certification standard at Thai EMS?",
        a: "Tier 1 plants: yes (IATF 16949 mandatory). Specialized Tier 2 EMS serving automotive: yes. General Thai EMS providers: variable — explicitly request automotive-grade if you need it.",
      },
      {
        q: "What about lead times for HDD-related component sourcing?",
        a: "HDD supply chain in Thailand is heavily interlocked with WD/Seagate production schedules. Independent buyers face longer lead times (8-16 weeks) and may need to negotiate volume commitments to access supply during peak HDD production cycles.",
      },
    ],
    related: ["thai-auto-parts-tier1-tier2", "sourcing-thai-suppliers-direct"],
  },
  {
    slug: "thai-packaging-manufacturer-guide",
    title: "Thai Packaging Manufacturers — Carton, Plastic, Flexible, Industrial",
    metaTitle: "Thai Packaging Manufacturers — Carton, Plastic, Flexible Packaging",
    metaDescription:
      "Thailand's packaging industry serves food, automotive, electronics export. Carton printers, plastic molders, flexible converters mapped. Sourcing guide.",
    updated: "2026-05-09",
    intro:
      "Thailand's packaging manufacturing serves the country's massive food, automotive, and electronics export sectors. Carton printers, plastic injection/blow molders, flexible packaging converters, and industrial packaging specialists all cluster around the manufacturing hubs they serve. This guide covers buyer-side sourcing.",
    sections: [
      {
        heading: "Sub-segments",
        body:
          "Carton/corrugated: cluster around Pathum Thani, Samut Sakhon, Eastern Seaboard. Print capabilities range from basic 2-color to 6+ color flexo. " +
          "Plastic packaging: injection molding (PET bottles, caps, custom containers), blow molding (HDPE/PP bottles), thermoforming (food trays). Heavy clusters in Samut Sakhon (food-adjacent) and Eastern Seaboard (automotive-adjacent). " +
          "Flexible packaging: laminated film, pouches, sachets — Bangkok / Pathum Thani cluster. Lower environmental compliance bar than EU but improving rapidly. " +
          "Industrial packaging: wooden crates, heavy-duty paper, bulk packaging — Eastern Seaboard for export-bound goods.",
      },
      {
        heading: "Sourcing process",
        body:
          "Spec sheet matters more than for other categories — packaging is heavily spec-driven. Include: dimensions (exact), material grade (board weight, plastic resin grade), printing requirements (color count, finish), testing standards (ISTA, drop tests for export), MOQ tolerance. " +
          "Most Thai packaging manufacturers respond to RFQ within 24 hours when the spec is clear. Lead time for first order: 4-8 weeks for custom spec, 2-4 weeks for catalog. Tooling/dies for custom designs add 4-8 weeks one-time. " +
          "Key cost drivers: order volume (large drops unit cost ~30%), color count (each additional flexo color +5-10%), material spec (premium board / virgin plastic vs recycled).",
      },
      {
        heading: "Sustainability angle",
        body:
          "Thai packaging industry is upgrading sustainability — recycled content, biodegradable options, reduced-plastic designs. Buyers wanting credible sustainability claims should: ask for recycled content % certification, FSC certification for paper, PCR (post-consumer recycled) plastic content disclosure. " +
          "Greenwashing risk: many manufacturers claim 'eco-friendly' without measurable backing. Demand documented metrics in the quote.",
      },
    ],
    faqs: [
      {
        q: "Lead time for custom packaging design?",
        a: "Tooling/dies: 4-8 weeks initial. Production after tooling: 2-4 weeks. Total first-order timeline: 6-12 weeks. Catalog spec orders: 2-4 weeks production, no tooling delay.",
      },
      {
        q: "What MOQs are realistic?",
        a: "Carton: 1,000-5,000 units depending on design complexity. Plastic injection: 5,000-20,000 (driven by tooling amortization). Flexible: 10,000-50,000 (printing setup). Many operators offer pilot runs at higher unit cost.",
      },
      {
        q: "Can Thai packaging suppliers handle complex multi-component packaging?",
        a: "Yes for most — combo packs (carton + insert + protective foam) are routine. Multi-vendor coordination (e.g., paper + plastic + label from 3 suppliers) is buyer's job — Thai packaging integrators (full-service) exist but charge premium for orchestration.",
      },
    ],
    related: ["sourcing-thai-suppliers-direct", "thai-food-manufacturer-haccp-export"],
  },
  {
    slug: "thai-textile-apparel-oem-guide",
    title: "Thai Textile & Apparel OEM — Sourcing Guide",
    metaTitle: "Thai Textile & Apparel OEM — Bangkok Manufacturer Sourcing Guide",
    metaDescription:
      "Thai textile and apparel OEM. Lower MOQ than Vietnam/China, faster turnaround, technical fabrics specialty. Sourcing guide for international fashion buyers.",
    updated: "2026-05-09",
    intro:
      "Thailand's textile and apparel OEM is smaller in scale than Vietnam or China but specializes in lower-MOQ runs, technical fabrics, and faster sample-to-production cycles. For brands launching new SKUs or sourcing technical apparel, Thailand often wins on flexibility despite higher unit costs. Buyer guide.",
    sections: [
      {
        heading: "Where Thai textile OEM wins",
        body:
          "Lower MOQ: 200-500 units per SKU realistic vs Vietnam/China 1,000-3,000. Useful for fashion brands launching test SKUs. " +
          "Technical fabrics: performance wear, UV-protective, moisture-wicking — Thai specialty cluster strong. " +
          "Faster sample turnaround: 1-2 weeks Thai vs 3-4 weeks China for new design samples. " +
          "Stronger English communication: most Thai textile OEM serving international has decent English; not always true at China cost-tier suppliers.",
      },
      {
        heading: "Where Thailand doesn't win",
        body:
          "Cost at scale: for 50,000+ unit single-SKU orders, Vietnam and China beat Thailand on unit cost by 20-40%. " +
          "Cotton-heavy basics: Bangladesh is hard to beat on T-shirt economics. " +
          "Premium denim: Vietnam has deeper denim ecosystem. " +
          "Thailand's sweet spot: 500-10,000 unit runs of tech apparel, sportswear, swimwear, intimate apparel, and small-brand fashion launches.",
      },
      {
        heading: "Geographic clusters",
        body:
          "Bangkok / Samut Prakan: largest apparel OEM cluster — full-service factories with cut-and-sew, embroidery, printing, packaging. " +
          "Pathum Thani: secondary cluster, technical fabrics specialty. " +
          "Northern Thailand (Chiang Mai region): smaller cluster, hand-finished and specialty (handicraft-adjacent apparel).",
      },
      {
        heading: "Sourcing checklist",
        body:
          "Before RFQ: have tech pack ready (sketches + measurements + fabric spec + trim spec). Without tech pack, Thai OEM will quote vague and slow. " +
          "Confirm vertical capability: cut-and-sew only? Embroidery in-house? Printing capability (screen, sublimation, DTG)? Most Thai OEM is full-service but verify upfront. " +
          "Fabric sourcing: many Thai OEM source fabric from Thai mills (Saha Group, Thai Acrylic Fibre) or import from China — this affects lead time. Stock fabric (catalog) cuts 2-4 weeks vs custom-developed fabric. " +
          "Sample order: 2-3 finalist factories should each produce a sample. Pay for samples (USD 30-100 per piece). Compare on stitch quality, fabric hand-feel, finishing detail.",
      },
    ],
    faqs: [
      {
        q: "Can Thai OEMs handle very small orders (50-200 units)?",
        a: "Some smaller specialty operators yes, with significant unit-cost premium (50-80% above MOQ pricing). Most established Thai OEM minimums sit at 200-500 units. Below that, niche specialty operators or shared-production-line approaches needed.",
      },
      {
        q: "What about samples — paid or free?",
        a: "Pay for samples — universal best practice. USD 30-100 per piece for stock-fabric samples, USD 100-300 for custom-fabric. Free samples are a red flag (poor production quality, no skin in the game).",
      },
      {
        q: "Is Thailand competitive for sustainable / certified apparel?",
        a: "Yes — Thai OEM increasingly hold OEKO-TEX, GOTS (organic), GRS (recycled). Verify cert before quote-acceptance. Sustainability credentials are a buyer-driven trend with significant variability across Thai OEMs — explicit ask matters.",
      },
    ],
    related: ["sourcing-thai-suppliers-direct"],
  },
  {
    slug: "thai-chemical-manufacturer-guide",
    title: "Thai Chemical Manufacturers — Specialty, Industrial, Petrochemical Sourcing",
    metaTitle: "Thai Chemical Manufacturers — Specialty & Industrial Chemical Sourcing",
    metaDescription:
      "Thai chemical industry: Map Ta Phut petrochemical core + downstream specialty + industrial chemical operators. Sourcing guide with REACH/RoHS context.",
    updated: "2026-05-09",
    intro:
      "Thailand's chemical sector splits across three layers: upstream petrochemical (concentrated at Map Ta Phut), midstream specialty chemicals, and downstream industrial-application chemical formulators. International buyers can source at every layer — but the access pattern differs by tier.",
    sections: [
      {
        heading: "Upstream — Map Ta Phut Tier 1",
        body:
          "PTT, IRPC, PTTGC, SCG Chemicals operate integrated complexes at Map Ta Phut. Direct buyer access requires contact through corporate sales offices — not the plants. Standard products (polyolefins, aromatics, base chemicals) sold via long-term offtake contracts. " +
          "For containerized export buyers: PTTGC and SCG Chemicals run dedicated international sales teams handling 20+ container monthly volume. Smaller volume sourcing typically routed through trading houses or downstream specialty operators.",
      },
      {
        heading: "Midstream — specialty chemicals",
        body:
          "Hundreds of specialty chemical operators downstream of Map Ta_Phut. Categories: polymer compounding (masterbatch, color concentrate), surfactants, lubricants, adhesives, coatings. " +
          "Most have public Google Business profiles + dedicated B2B sales contact. Lead times 4-8 weeks for first order, 2-4 weeks for repeat. Standard MOQ 1-5 tons per spec. " +
          "Quality cert baseline: ISO 9001 + ISO 14001 universal. REACH (EU) and RoHS for export-bound chemicals. SDS (Safety Data Sheets) provided per shipment.",
      },
      {
        heading: "Downstream — industrial application",
        body:
          "Thai chemical formulators serving local industries: agrochemical, automotive (lubricants, coolants, treatments), construction (additives, sealants), textile (dyes, finishes), pharma (excipients, intermediates). " +
          "Most accessible to international buyers. Smaller MOQs (100-500 kg typical). Faster sample-to-PO cycles. Translation needed less often — most have English-capable sales contacts.",
      },
      {
        heading: "Buyer process",
        body:
          "Step 1: Determine your tier need — bulk feedstock (Tier 1), specialty intermediate (Tier 2), or finished application chemical (Tier 3). Tier dictates supplier shortlist size and access difficulty. " +
          "Step 2: Confirm regulatory requirements — REACH for EU, TSCA for US, K-REACH for Korea. Most Thai exporters handle this routinely; verify via supplier-provided certs. " +
          "Step 3: SDS review — request Safety Data Sheets (English / target-market language). Confirm hazard classification, storage requirements, transport restrictions before PO. " +
          "Step 4: Stability + COA testing — request Certificate of Analysis with each lot. Specify retention sample requirement (supplier holds 100g per lot for 1-2 years for dispute resolution).",
      },
    ],
    faqs: [
      {
        q: "Can I source from Map Ta Phut Tier 1 with smaller volumes?",
        a: "Tier 1 (PTT, PTTGC, IRPC, SCG) typically requires 20+ container monthly minimum for direct international sales. Smaller volumes routed through trading houses or downstream Tier 2 buyers. The trading-house markup is usually 5-15% over Tier 1 list price.",
      },
      {
        q: "REACH compliance — is it standard for Thai exporters?",
        a: "For chemicals routinely exported to EU: yes, REACH-compliant supply is standard. Verify cert status during RFQ. For chemicals primarily for ASEAN domestic markets: REACH may not be in scope — explicit ask matters if you'll re-export to EU.",
      },
      {
        q: "What about specialty chemical lead times for new formulations?",
        a: "Custom-formulated specialty chemical: 6-12 weeks first order (formulation development + scale-up + production). Catalog spec: 4-6 weeks. Repeat orders: 3-4 weeks once formulation is locked.",
      },
    ],
    related: ["map-ta-phut-petrochemical-cluster", "sourcing-thai-suppliers-direct"],
  },
  {
    slug: "thai-precision-machining-guide",
    title: "Thai Precision Machining — CNC, EDM, and Mechanical Engineering",
    metaTitle: "Thai Precision Machining — CNC, EDM, Mechanical Engineering Sourcing",
    metaDescription:
      "Thai precision machining ecosystem — CNC, EDM, surface grinding, mechanical fabrication. Tier 2/3 automotive supply chain backbone. Sourcing guide.",
    updated: "2026-05-09",
    intro:
      "Precision machining is the unsung backbone of Thailand's automotive Tier 2/3 supply chain. Most operators serve OEM Tier 1 contracts (Aisin, Denso, Toyota Auto Body) but accept independent buyer work for prototype runs, low-volume production, and aftermarket parts. This guide covers sourcing patterns.",
    sections: [
      {
        heading: "Capability landscape",
        body:
          "CNC milling/turning: 3-axis universally available. 4-axis and 5-axis CNC at top-tier operators (mostly serving aerospace + medical-device tier customers). " +
          "EDM (Electrical Discharge Machining): wire EDM widely available, sinker EDM at fewer specialists. Used for mold-making and complex internal features. " +
          "Surface grinding, jig boring, gear cutting: niche specialists in Chon Buri and Pathum Thani. Find via category 'machining' filter on directories. " +
          "Inspection capability: CMM (Coordinate Measuring Machine) at IATF-certified operators (automotive Tier 2/3 baseline). Vision-system inspection at top tier.",
      },
      {
        heading: "Cluster geography",
        body:
          "Chon Buri (especially Pinthong / Amata): densest precision machining cluster, Japanese OEM-supply heritage. " +
          "Rayong (Amata City Rayong adjacent): petrochemical-equipment-related machining, valves and fittings specialists. " +
          "Samut Sakhon: cost-tier machining, smaller-batch and aftermarket-focused operators. " +
          "Pathum Thani: HDD-supply and electronics-frame machining, smaller component focus.",
      },
      {
        heading: "Sourcing process for buyers",
        body:
          "RFQ requirements: 2D drawing (PDF) + 3D model (STEP / IGES preferred). Material spec (alloy grade, heat treatment if any). Tolerance class (general ISO 2768-m or specific). Surface finish requirement. Quantity (prototype 1-50 pcs vs production 50+ pcs). " +
          "Lead time expectation: prototype 2-4 weeks, production batches 4-8 weeks first run, 2-4 weeks repeat. Tooling/fixture amortization: typically buyer-paid for first order, owned by supplier (not transferable to other suppliers easily). " +
          "Sample inspection: request first-article inspection (FAI) report with Cpk values for critical dimensions. Standard for IATF-certified suppliers.",
      },
      {
        heading: "Cost structure",
        body:
          "Thai precision machining: typically 25-50% above Vietnam, 30-60% below Japan/Korea, 15-30% above Chinese cost-tier. " +
          "Where Thailand wins: tolerance achievement (better than Vietnam at similar tolerance class), tooling quality (better than Chinese cost-tier), English communication (much better than Vietnam at this tier). " +
          "Where Thailand doesn't win: very high volume (Vietnam beats), complex 5-axis aerospace tier (Japan/Korea win), commodity-grade simple parts (China still cheaper).",
      },
    ],
    faqs: [
      {
        q: "Can Thai machining handle prototype quantities (1-10 pcs)?",
        a: "Yes — many operators take small prototype work as fill-in for OEM contracts. Unit cost will be 3-5x production-tier pricing due to setup amortization. Sample/prototype runs of 1-10 pieces routine.",
      },
      {
        q: "What's typical for 5-axis CNC capability?",
        a: "5-axis CNC is available at premium operators only — typically those serving Honda Aircraft, medical device OEMs, or specialized automotive tooling. Capacity is limited; lead times longer (6-10 weeks).",
      },
      {
        q: "How do I verify tolerance capability?",
        a: "Request First Article Inspection (FAI) report on a sample part. Cpk > 1.33 on critical dimensions is standard expectation. Operators unable to provide FAI documentation are below Tier 2 quality bar.",
      },
    ],
    related: ["thai-auto-parts-tier1-tier2", "sourcing-thai-suppliers-direct"],
  },
  {
    slug: "thai-steel-metal-fabrication-guide",
    title: "Thai Steel & Metal Fabrication — Mills, Fabricators, Welding",
    metaTitle: "Thai Steel & Metal Fabricators — SCG, Saraburi Cluster, Eastern Seaboard",
    metaDescription:
      "Thai steel mills (SCG, GS, Daido) + metal fabricators. Saraburi heavy industry cluster + Eastern Seaboard precision fabrication. Sourcing guide.",
    updated: "2026-05-09",
    intro:
      "Thai steel and metal fabrication splits between heavy mills (Saraburi-cluster, dominated by SCG) and precision fabrication (Eastern Seaboard, supplying automotive). For buyers, the supply economics differ sharply by tier. This guide covers both.",
    sections: [
      {
        heading: "Heavy steel mills",
        body:
          "SCG (Siam Cement Group) operates the largest integrated steel operations — multiple mills clustered in Saraburi province. Output: hot-rolled coil, cold-rolled, galvanized, structural steel. " +
          "Tata Steel Thailand and Sahaviriya Steel Industries (SSI) operate flat steel mills serving automotive supply chain. " +
          "Daido Steel Thailand specializes in alloy and tool steel for automotive (Aisin, Denso supply chain). " +
          "For international buyers: long-term offtake contracts standard for mill direct. Spot purchases via trading houses or service centers.",
      },
      {
        heading: "Metal fabrication tiers",
        body:
          "Tier 2 (Eastern Seaboard): precision sheet metal, structural welding, pipe spool fabrication. Mostly serving automotive Tier 1 + petrochemical EPC contractors. IATF 16949 + ASME welding standards baseline. " +
          "Tier 3 (Samut Sakhon, Bangkok suburbs): general metal fabrication, structural steel for construction, custom equipment frames. Faster lead times, smaller batches. " +
          "Specialty: stainless steel for food/pharma applications, pressure vessel fabrication (Saraburi cluster, ASME U-stamp holders), heat exchangers.",
      },
      {
        heading: "Sourcing checklist",
        body:
          "Material certification matters: mill test certs (MTC), heat traceability, alloy composition documentation. Standard for automotive and pressure-vessel supply. " +
          "Welding qualification: WPS (Welding Procedure Specification) and PQR (Procedure Qualification Record) for any pressure-bearing or structural application. ASME IX or AWS D1.1 baseline. " +
          "NDT (Non-Destructive Testing) capability: visual + dye penetrant universal, RT (radiographic) + UT (ultrasonic) at IATF/ASME-certified shops. " +
          "Surface treatment: galvanizing, paint systems, powder coating in-house at top fabricators; outsourced at smaller shops.",
      },
      {
        heading: "Lead time + cost context",
        body:
          "Mill-direct (sheet/plate steel): 4-8 weeks production cycle, 2-3 weeks shipping. Spot from service center: 1-2 weeks. " +
          "Custom fabrication (sheet metal, structural welding): 4-12 weeks for first order including engineering, 3-6 weeks repeat. " +
          "Pressure vessel / heat exchanger: 12-24 weeks for first order, complex engineering and qualification cycles add time. " +
          "Cost: Thai metal fabrication runs 30-50% above Vietnam, 20-40% below Japan/Korea, comparable to Chinese mid-tier. Quality bar typically higher than Chinese cost-tier.",
      },
    ],
    faqs: [
      {
        q: "Can I source small-volume custom steel parts?",
        a: "Yes — Tier 3 fabricators in Samut Sakhon and Bangkok suburbs handle low-volume custom work. Unit cost premium 30-100% vs production-tier pricing, but lead times faster (3-5 weeks). Useful for prototypes and replacement parts.",
      },
      {
        q: "How does Thai steel quality compare to Korean / Japanese?",
        a: "Standard grade (S275, S355, AISI 1018-1045): comparable. Specialty / aerospace grade: Japan and Korea lead. Tool/alloy steel from Daido Thailand: Japanese parent quality with Thailand cost base — competitive option for automotive tooling.",
      },
      {
        q: "Welding qualifications — what's typical?",
        a: "Tier 2 fabricators: ASME IX or AWS D1.1 qualified. Tier 3: variable — verify per project. Shops doing pressure-bearing or load-bearing work without proper WPS/PQR documentation are not safe choices regardless of price.",
      },
    ],
    related: ["thai-auto-parts-tier1-tier2", "thai-precision-machining-guide"],
  },
  {
    slug: "thai-rubber-products-sourcing-guide",
    title: "Thai Rubber Products — Latex, Tires, Industrial Rubber Components",
    metaTitle: "Thai Rubber Products Sourcing — Latex, Industrial Rubber, OEM",
    metaDescription:
      "Thailand is the world's largest natural rubber producer. Latex products, industrial rubber components, automotive rubber supply chain. Sourcing guide.",
    updated: "2026-05-09",
    intro:
      "Thailand is the world's largest producer of natural rubber. Upstream processing concentrates in southern Thailand (Songkhla / Hat Yai region); downstream rubber product manufacturing spreads across the Eastern Seaboard automotive supply chain. International buyers source at both layers.",
    sections: [
      {
        heading: "Upstream — natural rubber processing",
        body:
          "Concentrated in southern Thailand: Songkhla, Surat Thani, Yala provinces. Output: ribbed smoked sheet (RSS), block rubber (TSR/STR), latex concentrate. " +
          "Major operators: Sri Trang Agro-Industry (world's largest rubber group), Thai Rubber Latex, Vongbandit. " +
          "For international buyers: bulk rubber sourcing via mill-direct contracts or trading houses. Spot market via Thai Rubber Trade Association rates (RSS3, STR20).",
      },
      {
        heading: "Latex products",
        body:
          "Medical gloves: Top Glove Thailand, Sri Trang Gloves, others. Major export category — Thailand competes with Malaysia for global supply. " +
          "Latex foam mattresses + pillows: cluster around Bangkok suburbs and southern processing zones. Strong export to Japan, Korea, China consumer markets. " +
          "Industrial latex: dipping compounds for specialty applications, balloons, balloons-derived crafts.",
      },
      {
        heading: "Industrial rubber components",
        body:
          "Eastern Seaboard cluster: rubber seals, gaskets, hoses, mounts, vibration dampeners — primarily serving automotive Tier 1 (Toyoda Gosei is the flagship Tier 1 with Thailand operations). " +
          "Tier 2/3: smaller rubber molders serving automotive aftermarket, industrial machinery, and HVAC sectors. " +
          "Custom rubber compounding: specialized operators in Pathum Thani and Chon Buri formulating EPDM, NBR, silicone, FKM compounds for specific applications.",
      },
      {
        heading: "Buyer access",
        body:
          "Bulk natural rubber: mill-direct typical minimum 1 container (20-25 tons). Trading houses route smaller volumes with 5-10% markup. " +
          "Latex products: most major manufacturers have direct international sales (Top Glove, Sri Trang have dedicated export teams). MOQ 1-2 containers for first order. " +
          "Industrial rubber: Tier 2/3 manufacturers handle smaller orders (5-50 kg per spec for prototype, larger for production). Tooling for custom rubber molds typically buyer-paid first order.",
      },
    ],
    faqs: [
      {
        q: "How does Thai rubber pricing work?",
        a: "Natural rubber: priced via Thai Rubber Trade Association daily quotes (RSS3, STR20 grades). Latex products: typically priced per dozen (gloves) or per kg (latex foam). Industrial rubber: per kg of finished compound or per piece for molded components.",
      },
      {
        q: "Are Thai rubber suppliers competitive vs Malaysian?",
        a: "Natural rubber: Thai dominant (largest producer). Latex gloves: Malaysia-Thailand split, Malaysia slightly bigger global share. Industrial rubber for automotive: Thailand strong (Toyoda Gosei + ecosystem). Choice depends on specific product and target market.",
      },
      {
        q: "Sustainability certifications — common in Thai rubber?",
        a: "FSC (Forest Stewardship Council) for natural rubber: increasingly common, driven by EU buyer demand. Major Thai rubber groups (Sri Trang, Vongbandit) hold FSC. Smaller upstream processors variable — request certs for sustainability-claim products.",
      },
    ],
    related: ["sourcing-thai-suppliers-direct", "thai-auto-parts-tier1-tier2"],
  },
  {
    slug: "thai-logistics-3pl-customs-guide",
    title: "Thailand 3PL Logistics — Customs Brokerage, Bonded Warehouse, Multi-Modal",
    metaTitle: "Thai 3PL Logistics Guide — Customs, Bonded Warehouse, Multi-Modal Shipping",
    metaDescription:
      "Thailand 3PL operators, customs brokerage, bonded warehouse, multi-modal logistics. Buyer guide for export logistics from Thai manufacturing base.",
    updated: "2026-05-09",
    intro:
      "Thai logistics infrastructure handles ~75% of manufacturing exports through Laem Chabang port, plus growing air-freight via Suvarnabhumi for high-value goods. International 3PL providers compete with regional Thai operators on cost vs service-bundle depth. This guide covers buyer-side decisions.",
    sections: [
      {
        heading: "3PL operator landscape",
        body:
          "International giants: DHL Supply Chain, Linfox (Australian), Yusen Logistics (Japanese), Kerry Logistics (HK), Bollore — full-service warehouse + transport + customs + value-added. Higher cost, deeper service. " +
          "Regional Thai specialists: WHA Logistics (estate-tied), Whale Logistics, JWD Group, Thai Posten — competitive cost, strong on Thai-domestic distribution and Eastern Seaboard manufacturing supply. " +
          "Customs broker specialists: Suvarnabhumi-based for air, Laem Chabang-based for ocean. Often used by larger buyers separately from warehouse 3PL.",
      },
      {
        heading: "Bonded vs free trade zone (FTZ) warehouse",
        body:
          "Bonded warehouse: customs duty deferred until goods leave for domestic market or re-export. Useful for import-process-re-export operations. " +
          "Free Trade Zone (FTZ) warehouse: customs treatment as if outside Thailand. Simpler for re-export but goods can't enter domestic market without paying full duty. Most Eastern Seaboard 3PLs offer both options. " +
          "For buyers: choice depends on whether you're importing for domestic Thai distribution (bonded preferred) or pure re-export (FTZ simpler).",
      },
      {
        heading: "Customs brokerage essentials",
        body:
          "HS code classification: critical for tariff and trade-agreement applicability. Errors cost duty + penalty. Reputable brokers do this routinely. " +
          "FTA utilization: Thailand has ASEAN+3 FTAs (China, Korea, Japan, India), Australia, New Zealand, plus RCEP. Properly claimed FTA can eliminate or reduce duty significantly — broker should handle Form D / Form AK / Form AANZFTA etc. paperwork. " +
          "Restricted goods: certain chemicals, defense-related, pharmaceutical-precursor goods need special permits — confirm during RFQ if your goods touch these.",
      },
      {
        heading: "Air vs ocean — when to choose",
        body:
          "Ocean (Laem Chabang): standard for manufacturing exports. Transit times 5-30 days depending on destination. Cost-efficient at $500-3,000/container range depending on lane. " +
          "Air (Suvarnabhumi): premium for high-value, time-sensitive goods. 2-5 day transit globally. Cost: $4-8/kg standard, $2-4/kg for routine routes. " +
          "Use air for: electronics, automotive precision parts, specialty chemicals, fashion seasonal SKUs, medical devices. Use ocean for: bulk goods, large furniture, low-value-density products.",
      },
    ],
    faqs: [
      {
        q: "Can buyers handle customs themselves vs use a broker?",
        a: "Technically yes if you have a Thai legal entity and customs licensee. Practically: 99% of buyers use brokers — paperwork volume and HS-code classification complexity makes self-clearance economically irrational unless you're moving 100+ shipments monthly.",
      },
      {
        q: "Typical customs brokerage cost?",
        a: "Per-shipment fee: THB 500-2,500 for standard exports (export declaration + Bill of Lading + Form D paperwork). Bundled with 3PL service: usually included in per-cubic-meter or per-pallet warehouse fee. Standalone broker: per-shipment plus consultation hourly if FTA optimization needed.",
      },
      {
        q: "How long does customs clearance actually take?",
        a: "Routine export goods: 2-6 hours from documentation submission to release. Goods requiring inspection: 1-2 days additional. Goods with permit requirements (chemicals, defense, pharma): 3-10 days additional depending on agency.",
      },
      {
        q: "Best 3PL for first-time international buyers?",
        a: "If you have headroom in budget: international 3PL (DHL, Yusen, Kerry) — full English communication, integrated service, lower learning curve. If budget-constrained: regional Thai 3PL with English-capable account manager. Avoid going customs-broker-only without warehouse partner unless you have local Thai operations team.",
      },
    ],
    related: ["laem-chabang-warehouse-logistics", "sourcing-thai-suppliers-direct"],
  },
];

export function findGuide(slug: string): Guide | null {
  return GUIDES.find((g) => g.slug === slug) ?? null;
}
