// Category-별 FAQ — AEO + Google FAQPage 리치결과.

export type Faq = { q: string; a: string };

// /c/[category] FAQ — supply edition. 각 카테고리별 buyer 관점 FAQ.
export const CUISINE_FAQS: Record<string, Faq[]> = {
  manufacturer: [
    {
      q: "How do I contact a Thai manufacturer directly?",
      a: "Each listing shows the manufacturer's public phone and website where available. We never paywall or gatekeep contact info. Many buyers go through sourcing agents who add 15-30% markup — direct contact saves margin and gives you control of the relationship.",
    },
    {
      q: "What does the Trust Score mean for a manufacturer?",
      a: "Trust Score (0-100) combines Google rating and review volume on a logarithmic scale. Higher score = larger, more established operation with more public reviews. It's a directional signal — pair it with direct due diligence (factory visits, samples, references).",
    },
    {
      q: "Are Thai manufacturers DBD-verified?",
      a: "DBD-verified suppliers on this directory have been cross-checked with Thailand's Department of Business Development (Ministry of Commerce). Verified profiles show the official legal name, registration number, registered capital, founding date, and TSIC industry code. Non-verified listings are sourced from Google Business Profiles and may still be legitimate operating businesses.",
    },
  ],
  auto_parts: [
    {
      q: "Why is Thailand a top auto-parts hub?",
      a: "Thailand's Eastern Seaboard hosts Toyota, Honda, Mitsubishi, Isuzu, Mazda, and Nissan plants — and the entire Tier 1 / Tier 2 supplier ecosystem around them (Aisin, AGC, Denso, Toyoda Gosei, Summit, Thai Summit Harness, etc.).",
    },
    {
      q: "How do I source from Tier 1 auto parts suppliers?",
      a: "Listings here show direct phone and website. Note that Tier 1 OEM suppliers typically only sell to OEMs — for aftermarket parts, look at Tier 2 / 3 suppliers or local distributors.",
    },
    {
      q: "What auto parts are manufactured in Thailand?",
      a: "Thai auto parts manufacturing spans the full vehicle supply chain: engine components, body stampings, plastic interior parts, electrical harnesses, seats, glass, rubber seals, brake systems, and chassis parts. The Eastern Seaboard (Chon Buri, Rayong, Ayutthaya) hosts the densest cluster.",
    },
  ],
  industrial_estate: [
    {
      q: "What's the difference between Pinthong, Amata, WHA, and Rojana?",
      a: "All major Thai industrial estate operators. Pinthong (5 estates near Sriracha port), Amata (Chonburi, Rayong, Hanoi VN), WHA / Hemaraj (largest by area, owns 11 estates), Rojana (mixed-use estates across the Eastern Seaboard). Amata and WHA dominate by total leased area.",
    },
    {
      q: "Can I tour an industrial estate?",
      a: "Yes — most estates run buyer / tenant tours by appointment. Contact the estate's leasing office (phone listed here) to arrange. Major estates have visitor centers with sample factory units and infrastructure overviews.",
    },
    {
      q: "Do Thai industrial estates offer BOI tax incentives?",
      a: "Yes — factories inside IEAT-designated industrial estates are eligible for Board of Investment (BOI) promotion including corporate income tax exemption (up to 8 years), import duty exemption on machinery, and land ownership rights for foreign entities. Eligibility depends on industry sector and investment size.",
    },
  ],
  warehouse: [
    {
      q: "What rental rates are typical for warehouses in Chon Buri?",
      a: "Eastern Seaboard warehouse rents typically run THB 150-280 per sqm per month for standard ready-built warehouses, depending on location, ceiling height, and dock count. Premium temperature-controlled facilities run higher.",
    },
    {
      q: "How close should a warehouse be to Laem Chabang port?",
      a: "Most export-focused operations target within 30-45 minutes of Laem Chabang. Sriracha, Bowin, and Bang Lamung corridors are densest. Pinthong, Amata City, and WHA Logistics Park 2 all sit inside this radius.",
    },
    {
      q: "Are bonded warehouses available in Thailand?",
      a: "Yes — bonded warehouses (Type 1-3 under the Customs Act) allow duty-free storage of imported goods pending re-export or domestic clearance. Most bonded facilities concentrate near Laem Chabang port, Suvarnabhumi Airport, and Bangkok's Klong Toey customs zone.",
    },
  ],
  logistics: [
    {
      q: "Which logistics providers serve Eastern Seaboard manufacturers?",
      a: "Major 3PL operators (Linfox, DHL, Kerry, Yusen, Whale Logistics) all have strong Eastern Seaboard presence. Most can be contacted directly via the phone numbers listed here for facility tours and quotes.",
    },
    {
      q: "What is a 3PL provider in Thailand?",
      a: "A 3PL (third-party logistics) provider in Thailand manages warehousing, transportation, and customs brokerage on behalf of manufacturers and importers. Leading Thai 3PLs — Linfox, DHL Supply Chain, Kerry Logistics, Yusen Logistics — operate large-scale facilities near Laem Chabang port and major industrial estates.",
    },
    {
      q: "How do I arrange last-mile logistics from a Thai factory to export?",
      a: "Most Eastern Seaboard factories use 3PL providers or in-house trucks to Laem Chabang (containers) or Don Mueang / Suvarnabhumi (air freight). Request contact from each logistics provider listed here to compare rates and transit times for your specific commodity.",
    },
  ],
  food_mfg: [
    {
      q: "Are Thai food manufacturers HACCP / FSSC 22000 certified?",
      a: "Major Thai food manufacturers (frozen seafood, poultry, ready meals, snacks) are typically HACCP, GMP, and FSSC 22000 certified — Thailand is a top-3 global processed food exporter. Confirm certifications directly with each supplier before contracting.",
    },
    {
      q: "Where can I find premium food ingredient suppliers in Thailand?",
      a: "Thailand is a major source of premium food ingredients: coconut products, tapioca starch, rice flour, palm oil, tropical fruit extracts, fish sauce, shrimp paste, and spice blends. Most ingredient manufacturers cluster in Samut Sakhon, Pathum Thani, and Chon Buri. Use the directory filters here to find certified suppliers with direct export capacity.",
    },
    {
      q: "Do Thai food manufacturers offer private-label / OEM production?",
      a: "Yes — OEM and private-label food production is well-developed in Thailand. Minimum order quantities vary widely: large co-packers may require container-load orders (20+ tonnes), while mid-size OEMs accept smaller trial runs. Request quotes directly from suppliers using the contact details on each listing.",
    },
  ],
  plastic: [
    {
      q: "Who are the top plastic injection molding suppliers in Thailand?",
      a: "Thailand's plastic injection molding sector is dominated by Eastern Seaboard operators in Chon Buri and Rayong, supplying Toyota, Honda, and packaging OEMs. The sector includes precision automotive mold shops (dashboard, lighting parts), food-grade packaging molders (caps, bottles, trays), and general industrial molders. Browse the listings here by city to find suppliers near your target factory.",
    },
    {
      q: "What is the typical MOQ for plastic injection molding in Thailand?",
      a: "MOQs for plastic injection molding vary by project. Automotive suppliers typically require tooling investment (THB 50,000–500,000 per mold) before production runs. Packaging molders often quote on volume per SKU. Send a drawing or sample to each supplier for a project-specific quote — contact details are shown on every listing.",
    },
    {
      q: "What certifications do Thai plastic injection molding suppliers hold?",
      a: "Automotive-grade Thai plastic molders typically hold IATF 16949 (automotive quality management) or ISO 9001. Food-contact packaging molders may carry FDA and GMP certifications. Confirm certification scope directly with each supplier before contracting.",
    },
  ],
  chemical: [
    {
      q: "Where is Thailand's chemical manufacturing cluster?",
      a: "Map Ta Phut Industrial Complex in Rayong is Southeast Asia's largest petrochemical cluster — PTT, IRPC, PTTGC, and SCG Chemicals all operate here. Downstream specialty chemicals spread across the Eastern Seaboard. Most bulk chemicals produced here are export-grade.",
    },
    {
      q: "Can I source industrial chemicals directly from Thai manufacturers?",
      a: "Yes, many Thai chemical manufacturers sell direct to industrial buyers for B2B orders. Bulk commodity chemicals (polymers, aromatics, solvents) typically require licensed importers or local distributors. Specialty chemicals and chemical blends may have direct export capacity — contact each supplier using the details on their listing.",
    },
    {
      q: "What types of chemicals are produced in Thailand?",
      a: "Thailand's chemical production spans: petrochemicals (ethylene, propylene, PTA), performance polymers (polyethylene, polypropylene, PVC), specialty chemicals (surfactants, adhesives, coatings), agrochemicals, and personal-care ingredients. The Map Ta Phut complex handles upstream; Bangkok suburbs and Eastern Seaboard handle downstream specialty production.",
    },
  ],
  electronics: [
    {
      q: "Is Thailand a major electronics manufacturing hub?",
      a: "Yes — Thailand is the world's #2 hard disk drive manufacturer (Western Digital, Seagate both operate here). The sector spans HDD assembly, PCB fabrication, automotive electronics, and EMS contract manufacturing. Pathum Thani and Bang Pa-In host the densest electronics clusters; Chon Buri hosts automotive electronics Tier 1 suppliers.",
    },
    {
      q: "How do I find EMS (contract electronics manufacturing) suppliers in Thailand?",
      a: "Filter by the Electronics category and then city (Pathum Thani for HDD/EMS, Chon Buri for automotive electronics). Most EMS suppliers require NDA before quoting. Direct phone and website are shown on each listing — cold outreach via email or the quote form is the standard starting point.",
    },
    {
      q: "What PCB capabilities are available from Thai manufacturers?",
      a: "Thai PCB manufacturers offer single-layer through multilayer (up to 12–20 layers) production, surface mount assembly (SMT), through-hole, and conformal coating. The Bang Pa-In / Pathum Thani cluster supplies automotive (ABS, ECU) and consumer electronics OEMs. Request capability spec sheets from each listed supplier.",
    },
  ],
  packaging: [
    {
      q: "What packaging formats are manufactured in Thailand?",
      a: "Thai packaging manufacturers produce carton boxes, corrugated boards, flexible film (stand-up pouches, laminated film), plastic packaging (bottles, caps, trays, clamshells), and food-grade / aseptic packaging. Most operators cluster around Pathum Thani (food/pharma) and Chon Buri (industrial).",
    },
    {
      q: "Do Thai packaging manufacturers offer food-grade certification?",
      a: "Yes — many Thai packaging manufacturers targeting the food export sector hold HACCP, GMP, and BRC IOP certification. Scope varies (food contact materials, recyclable, recyclable content). Confirm certifications directly with each supplier before ordering.",
    },
    {
      q: "What are typical lead times for custom packaging from Thailand?",
      a: "Custom packaging lead times in Thailand typically run 3–6 weeks for standard carton and flexible film orders from die-stage, depending on print complexity. Rush production (2 weeks) is available with some suppliers. Contact suppliers directly for project-specific timelines.",
    },
  ],
  rubber: [
    {
      q: "Why is Thailand the world's top rubber producer?",
      a: "Thailand produces over 4 million tonnes of natural rubber annually — roughly 30% of global supply. Southern Thailand (Songkhla / Hat Yai) is the plantation and initial processing hub. Downstream rubber products (automotive seals, gloves, latex goods) manufacture throughout the Eastern Seaboard.",
    },
    {
      q: "Can I source natural rubber directly from Thailand?",
      a: "Ribbed smoked sheets (RSS) and technically specified rubber (TSR/STR) are traded via licensed exporters registered with the Rubber Authority of Thailand (RAOT). Downstream rubber products — molded parts, gloves, hoses, conveyor belts — can often be sourced directly from the manufacturers listed here.",
    },
    {
      q: "What rubber products are available from Thai manufacturers?",
      a: "Thai rubber manufacturers produce: automotive seals and gaskets (Eastern Seaboard Tier 2 suppliers), latex examination and surgical gloves (southern Thailand cluster), conveyor belts, rubber hoses, footwear soles, and industrial rubber sheets. Most producers have export certifications for EU and US markets.",
    },
  ],
  textile: [
    {
      q: "What textile products are manufactured in Thailand?",
      a: "Thai textile manufacturers produce apparel OEM (fast fashion, workwear, sportswear), technical textiles (automotive interior fabric, industrial cloth), and custom fabric. Most apparel OEM clusters near Bangkok (Samut Prakan, Pathum Thani). Typical MOQs are 500–3,000 pieces per style.",
    },
    {
      q: "Is Thailand competitive for apparel OEM manufacturing?",
      a: "Thailand offers higher quality and compliance standards than some lower-cost alternatives, but is competitive for mid-to-premium apparel OEM. Strengths include advanced dyeing/finishing, good logistics infrastructure, and stable labor. Contact suppliers directly using the details on each listing for price comparisons.",
    },
  ],
  steel: [
    {
      q: "Who are the major steel manufacturers in Thailand?",
      a: "Thailand's steel sector is led by SCG (Saraburi cluster), Tata Steel Thailand, NTS Steel, and G Steel. Downstream steel fabricators for automotive (structural, stamped, tube) cluster on the Eastern Seaboard. Long products (bars, rods, wire rod) mostly originate from Saraburi.",
    },
    {
      q: "Can I import Thai steel directly?",
      a: "Yes — Thailand is a net steel exporter of certain products (structural sections, wire rod, hot-rolled coil). Contact manufacturers listed here directly with your specification and volume for export pricing. Most have English-language sales teams familiar with international trade documentation.",
    },
  ],
  machining: [
    {
      q: "What machining capabilities do Thai suppliers offer?",
      a: "Thai precision machining shops offer CNC turning, CNC milling, EDM (wire and sinker), surface grinding, jig boring, and CMM inspection — primarily serving automotive Tier 2/3 supply chains in Chon Buri and Rayong. Tolerances to ±0.005 mm are common in established shops. Most require technical drawings (DXF/STEP) for quoting.",
    },
    {
      q: "How do I get a quote from a Thai CNC machining supplier?",
      a: "Prepare a technical drawing (2D PDF/DXF and/or 3D STEP file), specify material, quantity, and surface finish requirements, then contact suppliers directly using the phone or website listed. Most shops respond to quote requests within 2–5 business days.",
    },
  ],
  equipment: [
    {
      q: "What industrial equipment can I source from Thailand?",
      a: "Thailand's industrial equipment sector supplies factory automation components, conveyor systems, packaging machinery, material handling equipment, and tooling to the Eastern Seaboard manufacturing base. Most distributors maintain local stock for fast delivery to factory floors.",
    },
    {
      q: "Do Thai equipment suppliers offer installation and after-sales support?",
      a: "Most major equipment suppliers listed here have local Thai service teams. After-sales support terms (warranty period, response time, spare parts availability) vary by supplier — ask directly during the quotation process.",
    },
  ],
  factory: [
    {
      q: "How do I verify a Thai factory is legitimate before ordering?",
      a: "Cross-check the supplier's DBD registration (visible on verified listings here), visit the factory if possible, request ISO or quality certifications, and check Google Maps reviews. The Trust Score on this directory combines registration, review volume, and public photo evidence as a directional check.",
    },
  ],
  exporter: [
    {
      q: "How do I find export-ready Thai suppliers?",
      a: "Export-ready Thai suppliers typically have an active website, English-speaking sales team, experience with international trade documentation (commercial invoice, packing list, certificate of origin), and familiarity with INCOTERMS. Listings tagged as exporters here explicitly market international sales — contact them directly for export pricing.",
    },
    {
      q: "What certifications do Thai exporters need?",
      a: "Required export certifications depend on the destination market and product. Common certifications include: Certificate of Origin (Form D for AFTA, Form A for GSP), FDA for food/cosmetics, HACCP for food, ISO 9001 for quality management. Confirm which certifications apply to your import country with each supplier.",
    },
  ],
};

export const HOME_FAQS: Faq[] = [
  {
    q: "How is the Trust Score calculated?",
    a: "Trust Score (0-100) combines: Google rating (50% weight) and review volume on logarithmic scale (50%). It's our derived metric — not a Google ranking. We rebuild it continuously from public Google Maps data to surface established operations with public proof.",
  },
  {
    q: "Are these listings sponsored?",
    a: "Organic listings are never paid. Some suppliers buy clearly-labelled Editor's Pick / Recommended / Featured slots, but we never delete or downrank organic listings. Sponsored slots appear with explicit badges.",
  },
  {
    q: "How fresh is this data?",
    a: "Listings and Trust Scores rebuild from Google Maps data. Phone and website fields come from each supplier's own Google Business Profile — we don't republish or cache scraped contact info.",
  },
  {
    q: "Why do I need this site if I can just search Google Maps?",
    a: "Google Maps alone surfaces nearest-N matches, mixing real factories with auto-parts retail stores, butcher shops, and 'factory outlet' malls. We aggressively filter B2C noise so the directory only shows real B2B suppliers — manufacturers, factories, warehouses, industrial estates.",
  },
  {
    q: "Do you broker deals or take commission?",
    a: "No. We're an independent directory. Buyers contact suppliers directly via the phone or website listed. No middleman markup. We monetize via clearly-labelled sponsored slots and (eventually) verified-supplier subscription tiers — never via deal commission.",
  },
  {
    q: "What if my company isn't listed?",
    a: "Visit /for-suppliers — listings are free for verified Thai manufacturers and industrial operators. Verification is a one-time process to confirm operational status.",
  },
  {
    q: "What types of suppliers are listed on Thai Supply Hub?",
    a: "The directory covers Thailand's entire B2B manufacturing and logistics ecosystem: manufacturers (automotive, electronics, food, chemicals, plastics, rubber, textiles, packaging, steel, machining), industrial estates, warehouses, 3PL logistics providers, and corporate offices. All listings are filtered to exclude B2C retail, restaurants, and factory-outlet shopping centers.",
  },
  {
    q: "What is a 3PL provider in Thailand and which ones operate here?",
    a: "A third-party logistics (3PL) provider manages warehousing, transportation, and customs services on behalf of manufacturers and importers. Major 3PL operators in Thailand include DHL Supply Chain, Kerry Logistics, Yusen Logistics, Linfox Thailand, and Whale Logistics — all with strong coverage near Laem Chabang port and the Eastern Seaboard industrial estates.",
  },
  {
    q: "What is DBD verification and why does it matter for sourcing?",
    a: "DBD verification means a supplier's listing has been cross-checked against Thailand's Department of Business Development (Ministry of Commerce) business registry. Verified suppliers show their official legal name, registration number, registered capital, founding date, and TSIC industry code. This lets buyers confirm the legal entity before signing contracts — something Google Maps alone doesn't provide.",
  },
  {
    q: "Which region of Thailand has the most manufacturers?",
    a: "The Eastern Seaboard (Chon Buri and Rayong provinces) hosts the densest concentration of manufacturers — anchored by Toyota, Honda, and petrochemical groups. Bangkok and suburbs (Pathum Thani, Samut Sakhon, Samut Prakan) form the second cluster. The North (Chiang Mai) and Northeast (Khon Kaen, Korat) have growing agri-food and logistics sectors.",
  },
  {
    q: "How do I find a warehouse for rent in a specific city in Thailand?",
    a: "Use the category filter (Warehouses) combined with the city filter on this directory. Ready-built warehouses near Laem Chabang port (Chon Buri / Si Racha) are most plentiful for export-focused operations. For inland provinces like Khon Kaen, select the city filter to see available logistics and warehouse operators in that area. Contact each listing directly using the phone or website shown.",
  },
];

// City-level FAQ — for FaqJsonLd on city pages
export const CITY_FAQS: Record<string, Faq[]> = {
  chon_buri: [
    {
      q: "What industries are concentrated in Chon Buri?",
      a: "Chon Buri is Thailand's automotive and electronics manufacturing hub. Toyota, Honda, Mitsubishi, and Isuzu operate main plants here, surrounded by Tier 1 and Tier 2 supplier clusters inside estates like Pinthong, Amata City Chonburi, and WHA Chonburi. Electronics, plastics, and packaging manufacturers are also major tenants.",
    },
    {
      q: "Which industrial estates are in Chon Buri?",
      a: "Major industrial estates in Chon Buri include: Pinthong Industrial Estate (1–5, near Sriracha), Amata City Chonburi, WHA Chonburi Industrial Estate, Hemaraj Chonburi Industrial Estate, and 304 Industrial Park. Together they host thousands of manufacturers from automotive, electronics, food, and chemical sectors.",
    },
  ],
  rayong: [
    {
      q: "What is Map Ta Phut in Rayong?",
      a: "Map Ta Phut Industrial Complex is Southeast Asia's largest petrochemical cluster, located in Rayong province. PTT, IRPC, PTTGC, and SCG Chemicals operate integrated complexes here with dedicated deep-sea port and pipeline infrastructure. It's the primary sourcing base for bulk polymers, aromatics, and specialty chemicals in Thailand.",
    },
    {
      q: "Which automotive manufacturers operate in Rayong?",
      a: "Toyota Motor Thailand, Ford Thailand, and multiple Japanese Tier 1 suppliers operate in Rayong. Amata City Rayong and Hemaraj Eastern Seaboard Industrial Estate anchor the automotive cluster. The province also hosts significant auto-parts and rubber product manufacturers.",
    },
  ],
  khon_kaen: [
    {
      q: "What warehouses are available in Khon Kaen?",
      a: "Khon Kaen is Northeast Thailand's main logistics hub with a growing number of warehouse operators serving the Isan region. Available facilities include ready-built logistics warehouses, agri-commodity storage, and cold-chain units for food processing. Use the directory filters here to find warehouse operators in Khon Kaen with direct contact details.",
    },
    {
      q: "What industries operate in Khon Kaen?",
      a: "Khon Kaen's main industries are agri-food processing (tapioca starch, sugarcane, poultry, cassava), logistics and warehousing, and some automotive component manufacturing. The Khon Kaen Special Economic Zone is attracting new investment. The city serves as the commercial and logistics hub for all of Northeast Thailand.",
    },
  ],
  bangkok: [
    {
      q: "Where are manufacturer headquarters located in Bangkok?",
      a: "Bangkok concentrates corporate headquarters, R&D offices, and commercial departments of major Thai and multinational manufacturers — rather than production plants, which tend to sit in Eastern Seaboard or suburban industrial estates. Lat Krabang Industrial Estate within Bangkok's boundaries does host some production facilities.",
    },
  ],
  samut_sakhon: [
    {
      q: "What food manufacturers are in Samut Sakhon?",
      a: "Samut Sakhon is Thailand's top processed food cluster, especially for frozen and fresh seafood (shrimp, squid, fish), poultry processing, and ready meals. Major operators are HACCP and GMP certified with export capacity to EU, US, and Japan. The province also hosts significant plastic packaging manufacturers.",
    },
  ],
  chiang_mai: [
    {
      q: "What manufacturers are based in Chiang Mai?",
      a: "Chiang Mai's manufacturing base focuses on agri-food OEM (coffee, herbs, health foods, coconut products), traditional crafts (lacquerware, ceramics, hand-woven textiles), and small-batch precision manufacturing. Chiang Mai Industrial Estate hosts some electronics and food processing firms. The city also has a growing cold-chain logistics sector.",
    },
  ],
};
