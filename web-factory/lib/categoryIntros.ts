// 카테고리별 unique intro 카피 + meta description.
// 모든 카테고리 페이지가 동일한 boilerplate 쓰지 않도록 — AEO/SEO 핵심.
// title, metaDesc, intro 모두 다르게.

export type CategoryIntro = {
  title: string;        // <h1> 본문
  metaTitle: string;    // <title>
  metaDescription: string;
  intro: string;        // h1 아래 문단 (1-3 문장)
  longContext?: string; // 페이지 하단 보조 카피 (있으면 더 좋음, AEO bonus)
};

export const CATEGORY_INTROS: Record<string, CategoryIntro> = {
  manufacturer: {
    title: "Thai Manufacturers",
    metaTitle: "Top Thai Manufacturers — Verified Trust Scores from Real Reviews",
    metaDescription:
      "Verified Thai manufacturers across all sectors — automotive, electronics, food, plastics, chemicals, packaging. Trust Score from real Google reviews. Direct contact, no agency markup.",
    intro:
      "Thailand's manufacturing base is the largest in ASEAN by output. The directory below ranks verified Thai manufacturers by Trust Score derived from real Google reviews — surfacing established operations with public proof, not agency-promoted listings.",
    longContext:
      "Manufacturer listings here come from public Google Business Profiles filtered against a B2C category blocklist (retail stores, restaurants, factory outlet malls are excluded). Each listing shows direct contact (phone + website where available) so buyers can skip sourcing-agent markups when contracts allow.",
  },
  auto_parts: {
    title: "Auto Parts Manufacturers in Thailand",
    metaTitle: "Top Auto Parts Manufacturers in Thailand — Tier 1 OEM Directory",
    metaDescription:
      "Thailand's Tier 1 and Tier 2 automotive parts manufacturers — Aisin, AGC, Toyoda Gosei, Summit, Thai Summit Harness. Eastern Seaboard cluster mapped with Trust Scores.",
    intro:
      "Thailand is the world's 10th-largest automotive producer and ASEAN's automotive hub. Toyota, Honda, Mitsubishi, Isuzu, Mazda, Nissan all operate full plants here — and the Tier 1 / Tier 2 supplier ecosystem clusters tightly around them on the Eastern Seaboard.",
    longContext:
      "Listings include Tier 1 OEM suppliers (typically OEM-only sales) and Tier 2/3 component manufacturers (more accessible to aftermarket buyers). Use the city filter to focus on Chon Buri / Rayong (Eastern Seaboard plants) or Pathum Thani / Ayutthaya (older clusters around Bangkok).",
  },
  industrial_estate: {
    title: "Industrial Estates in Thailand",
    metaTitle: "Industrial Estates in Thailand — Pinthong, Amata, WHA, Rojana",
    metaDescription:
      "Major Thai industrial estates ranked by Trust Score. Pinthong, Amata City, WHA Logistics Park, Hemaraj, Rojana — Eastern Seaboard manufacturing belt mapped.",
    intro:
      "Thailand's industrial estates concentrate manufacturing tenants, infrastructure, and customs incentives in defined zones. The four major operators — Pinthong, Amata, WHA (post-Hemaraj merger), and Rojana — anchor most flagship estates along the Eastern Seaboard.",
    longContext:
      "Each estate operator has a distinct profile: Pinthong is closest to Sriracha port (best for export-heavy tenants); Amata owns infrastructure and offers the highest occupancy rates; WHA is largest by total leased area after the Hemaraj acquisition; Rojana spreads across Eastern Seaboard plus Ayutthaya and Prachinburi.",
  },
  warehouse: {
    title: "Warehouses in Thailand",
    metaTitle: "Warehouses for Lease in Thailand — Eastern Seaboard Logistics",
    metaDescription:
      "Verified warehouse facilities across Thailand's manufacturing belt. Sriracha, Bowin, Bang Lamung — within 30-45 minutes of Laem Chabang port.",
    intro:
      "Warehouse supply concentrates around Thailand's two major export gateways — Laem Chabang (containers) and Suvarnabhumi (air cargo). Listings prioritize ready-built facilities operated by major 3PL providers and industrial estate tenants.",
    longContext:
      "Eastern Seaboard warehouse rents typically run THB 150-280/sqm/month for standard ready-built. Premium temperature-controlled and bonded warehouses run higher. Most listings show direct phone for facility tour scheduling.",
  },
  logistics: {
    title: "Logistics Providers in Thailand",
    metaTitle: "Logistics Companies in Thailand — Eastern Seaboard 3PL Directory",
    metaDescription:
      "Thai logistics providers — Whale Logistics, Linfox Thailand, DHL, Kerry, Yusen — ranked by Trust Score. Eastern Seaboard 3PL coverage.",
    intro:
      "Logistics providers serving Thailand's manufacturing belt range from international 3PL giants to specialized Eastern Seaboard operators. Listings here focus on operators with public Google Business profiles and verified operational reviews.",
  },
  packaging: {
    title: "Packaging Manufacturers in Thailand",
    metaTitle: "Packaging Manufacturers in Thailand — Carton, Plastic, Flexible",
    metaDescription:
      "Thai packaging manufacturers across cartons, plastic, flexible, food-grade, and industrial packaging. Eastern Seaboard + Pathum Thani cluster.",
    intro:
      "Thai packaging manufacturers serve the country's massive food, automotive, and electronics export sectors. Listings include carton printers, plastic packaging molders, flexible packaging converters, and industrial packaging specialists.",
  },
  food_mfg: {
    title: "Food Manufacturers in Thailand",
    metaTitle: "Food Manufacturers in Thailand — Frozen, Processed, Packaged",
    metaDescription:
      "Thai food manufacturers — frozen seafood, poultry, processed food, packaged snacks. HACCP / FSSC 22000 / GMP certifications standard.",
    intro:
      "Thailand is one of the world's top processed food exporters. Major Thai food manufacturers operate to HACCP, GMP, and FSSC 22000 standards by default — and many run halal-certified parallel lines for ASEAN/Middle East markets.",
  },
  electronics: {
    title: "Electronics Manufacturers in Thailand",
    metaTitle: "Electronics Manufacturers in Thailand — HDD, EMS, PCB",
    metaDescription:
      "Thai electronics manufacturers and EMS providers. Hard drives, PCBs, automotive electronics — Pathum Thani and Bang Pa-In clusters.",
    intro:
      "Thailand is the world's #2 hard disk drive manufacturer and a major EMS contract manufacturing hub. Listings span HDD assembly, PCB fabrication, automotive electronics, and consumer electronics OEM.",
  },
  chemical: {
    title: "Chemical Manufacturers in Thailand",
    metaTitle: "Chemical Manufacturers in Thailand — Map Ta Phut Petrochemical",
    metaDescription:
      "Thai chemical manufacturers concentrated in Map Ta Phut industrial complex (PTT, IRPC, PTTGC, SCG). Petrochemical, specialty, and industrial chemicals.",
    intro:
      "Thailand's chemical industry centers on the Map Ta Phut Industrial Complex in Rayong — Southeast Asia's largest petrochemical cluster. PTT, IRPC, PTTGC, and SCG Chemicals operate integrated complexes here, surrounded by downstream specialty chemical operators.",
  },
  plastic: {
    title: "Plastic Fabrication Companies in Thailand",
    metaTitle: "Plastic Fabrication Companies in Thailand — Injection Molding, Sheet",
    metaDescription:
      "Thai plastic fabricators across injection molding, blow molding, sheet, and custom plastic. Eastern Seaboard cluster supplying automotive and packaging.",
    intro:
      "Plastic fabrication in Thailand serves automotive, packaging, and consumer goods sectors. Most operators cluster on the Eastern Seaboard near OEM customers, with a secondary cluster around Pathum Thani.",
  },
  steel: {
    title: "Steel & Metal Fabricators in Thailand",
    metaTitle: "Steel & Metal Fabricators in Thailand — Saraburi, Eastern Seaboard",
    metaDescription:
      "Thai steel mills and metal fabricators. SCG, Daido Steel, structural steel and precision sheet metal. Saraburi and Eastern Seaboard clusters.",
    intro:
      "Steel and metal fabrication in Thailand splits between heavy mills (Saraburi cluster, dominated by SCG) and precision fabrication (Eastern Seaboard, supplying automotive). Listings include both flagship integrated operators and mid-tier fabricators.",
  },
  machining: {
    title: "Machining & Mechanical Engineering in Thailand",
    metaTitle: "Machining & Mechanical Engineering Thailand — CNC, Precision",
    metaDescription:
      "Thai precision machining — CNC, EDM, mechanical engineering. Tier 2/3 automotive supply chain backbone clustered around Eastern Seaboard.",
    intro:
      "Precision machining is the backbone of Thailand's automotive Tier 2/3 supply chain. Most operators cluster around Chon Buri and Rayong to feed Tier 1 OEMs, with a secondary cluster in Samut Sakhon.",
  },
  equipment: {
    title: "Industrial Equipment Suppliers in Thailand",
    metaTitle: "Industrial Equipment Suppliers in Thailand — Factory Equipment",
    metaDescription:
      "Industrial equipment suppliers serving Thai factories — machinery, tooling, automation, factory equipment. Eastern Seaboard distributor network.",
    intro:
      "Industrial equipment distribution in Thailand serves the manufacturing tenant base of every major industrial estate. Most suppliers maintain Eastern Seaboard branches for fast delivery to factory floors.",
  },
  corporate_office: {
    title: "Corporate Headquarters in Thailand",
    metaTitle: "Corporate Headquarters in Thailand — Manufacturer HQs & Offices",
    metaDescription:
      "Corporate offices and headquarters of Thai manufacturers. Bangkok and Eastern Seaboard. Direct contact for partnership and procurement inquiries.",
    intro:
      "Manufacturer headquarters in Thailand split between Bangkok (commercial/finance) and Eastern Seaboard (production). For procurement and strategic partnerships, contacting the corporate office often routes faster than the plant itself.",
  },
  factory: {
    title: "Factories in Thailand",
    metaTitle: "Factories in Thailand — Verified Industrial Operators",
    metaDescription:
      "Verified Thai factories across automotive, food, electronics, chemicals, packaging. Trust Score from real Google reviews.",
    intro:
      "Factory listings here are verified industrial operators — distinguished from B2C 'factory outlet' retail by category filtering. Each entry shows public contact info for direct buyer outreach.",
  },
  rubber: {
    title: "Rubber Manufacturers in Thailand",
    metaTitle: "Rubber Manufacturers in Thailand — Hat Yai Songkhla Cluster",
    metaDescription:
      "Thai rubber manufacturers concentrated in southern Thailand (Songkhla / Hat Yai). Natural rubber, latex products, automotive rubber components.",
    intro:
      "Thailand is the world's largest natural rubber producer. Most upstream rubber processors cluster in southern Thailand (Songkhla, Hat Yai region), with downstream rubber product manufacturers spread across the Eastern Seaboard automotive belt.",
  },
  textile: {
    title: "Textile Manufacturers in Thailand",
    metaTitle: "Textile Manufacturers in Thailand — Apparel, Fabric, OEM",
    metaDescription:
      "Thai textile manufacturers — apparel OEM, fabric production, custom textile manufacturing. Bangkok and Samut Prakan cluster.",
    intro:
      "Thai textile manufacturing serves apparel OEM, technical textiles, and automotive interior fabric markets. Most operators concentrate around Bangkok suburbs (Samut Prakan, Pathum Thani) with smaller clusters in the south.",
  },
  machinery: {
    title: "Machinery Manufacturers in Thailand",
    metaTitle: "Machinery Manufacturers in Thailand — Industrial Equipment",
    metaDescription:
      "Thai machinery and industrial equipment manufacturers. Production machinery, conveyor systems, packaging equipment.",
    intro:
      "Domestic machinery manufacturers serve Thailand's broader manufacturing base — production line equipment, conveyor systems, packaging machinery. Most cluster around Bangkok and Eastern Seaboard.",
  },
  exporter: {
    title: "Thai Exporters",
    metaTitle: "Verified Thai Exporters — Direct B2B Sourcing",
    metaDescription:
      "Verified Thai exporters across all major categories. Direct contact for international buyers. Trust Score from real Google reviews.",
    intro:
      "Listings tagged as exporters explicitly market international sales channels. For most B2B inquiries, the direct contact path is faster than going through a sourcing agent.",
  },
};

export function findCategoryIntro(slug: string): CategoryIntro | null {
  return CATEGORY_INTROS[slug] ?? null;
}

// 카테고리 → 가장 관련 깊은 가이드 슬러그.
// 카테고리 페이지에서 cross-link 카드 노출 + supplier 페이지의 contextual link 에 사용.
export const CATEGORY_TO_GUIDE: Record<string, string> = {
  manufacturer:      "sourcing-thai-suppliers-direct",
  auto_parts:        "thai-auto-parts-tier1-tier2",
  factory:           "sourcing-thai-suppliers-direct",
  warehouse:         "laem-chabang-warehouse-logistics",
  industrial_estate: "eastern-seaboard-industrial-estates-compared",
  logistics:         "thai-logistics-3pl-customs-guide",
  food_mfg:          "thai-food-manufacturer-haccp-export",
  electronics:       "thai-electronics-manufacturer-hdd-ems",
  chemical:          "thai-chemical-manufacturer-guide",
  plastic:           "thai-packaging-manufacturer-guide",
  steel:             "thai-steel-metal-fabrication-guide",
  machining:         "thai-precision-machining-guide",
  equipment:         "thai-precision-machining-guide",
  corporate_office:  "sourcing-thai-suppliers-direct",
  packaging:         "thai-packaging-manufacturer-guide",
  rubber:            "thai-rubber-products-sourcing-guide",
  textile:           "thai-textile-apparel-oem-guide",
  machinery:         "thai-precision-machining-guide",
  exporter:          "sourcing-thai-suppliers-direct",
};
