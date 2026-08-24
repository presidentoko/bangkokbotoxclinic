// OEM/ODM 버티컬 허브 — thaisupplyhub.com 을 "태국 OEM 공장 찾기 1등 사이트"로.
//
// 왜 필요했나: GSC 데이터에서 "plastic injection molding thailand"(68회 노출,
// 0클릭), "thailand factory food"(21회), "premium food ingredient supplier"
// (22회) 처럼 제품 버티컬 검색어가 이미 우리를 노출시키고 있는데, 정작 그
// 검색어에 대응하는 페이지가 없다. 기존 /c/[cuisine] 카테고리는 업종 분류
// (manufacturer, plastic, food_mfg…)라서 바이어의 실제 검색 방식(제품 종류 ×
// OEM/ODM × 인증)과 어긋난다.
//
// 기존 카테고리와 겹치는 버티컬(전자·섬유·플라스틱 일반)은 일부러 넣지 않았다 —
// /c/electronics, /c/plastic 등과 사실상 같은 리스트를 다른 URL로 복제하면
// 중복 콘텐츠로 두 페이지 다 순위가 깎인다. 여기 들어간 건 (a) 기존 카테고리가
// 못 잡는 제품 세그먼트(화장품, 가구, 의료기기)이거나 (b) 같은 공급사 풀이라도
// 검색 의도가 명확히 다른 공정 특화 세그먼트(사출성형, EMS/PCBA, 의류 OEM)뿐.
//
// 매칭은 raw_categories(구글이 매긴 업종 태그, 원문 영어라 신뢰도 높음) 우선,
// 부족하면 회사명 키워드로 보강. TSIC 코드는 DBD 매칭된 851곳에만 있어
// 커버리지가 얕아 보조 신호로만 쓴다.

import type { Supplier } from "./types";

export type OemVertical = {
  slug: string;
  icon: string;
  title: string;            // "Cosmetics & Personal Care OEM/ODM"
  metaTitle: string;
  metaDescription: string;
  intro: string;            // hero 문단
  moq: string;               // 통상 MOQ 안내
  leadTime: string;          // 통상 리드타임 안내
  certifications: string[]; // 이 버티컬에서 자주 요구되는 인증
  faqs: { q: string; a: string }[];
  match: (r: Supplier) => boolean;
  relatedCategorySlug?: string; // 기존 /c/[slug] 로 보내는 "더 넓게 보기" 링크
};

function rawHas(r: Supplier, keywords: string[]): boolean {
  const raw = (r.raw_categories || []).map((c) => c.toLowerCase());
  return raw.some((c) => keywords.some((k) => c.includes(k)));
}

function nameHas(r: Supplier, keywords: string[]): boolean {
  const name = (r.name || "").toLowerCase();
  return keywords.some((k) => name.includes(k));
}

// 소비재 카테고리(음식점·호텔·소매점 등)로 잘못 걸리는 걸 막는 공통 가드.
function looksLikeStorefront(r: Supplier): boolean {
  const raw = (r.raw_categories || []).map((c) => c.toLowerCase());
  return raw.some((c) =>
    ["restaurant", "hotel", "retail", "cafe", "shop selling", " store"].some((s) => c.includes(s))
  );
}

export const OEM_VERTICALS: OemVertical[] = [
  {
    slug: "cosmetics",
    icon: "💄",
    title: "Cosmetics & Personal Care OEM/ODM",
    metaTitle: "Cosmetics OEM Manufacturer Thailand — Private Label & ODM Factories",
    metaDescription:
      "Thai cosmetics and personal-care OEM/ODM factories — private label skincare, haircare, and cosmetics manufacturers. DBD registration, capital, and direct contact — no sourcing-agent markup.",
    intro:
      "Thailand is Southeast Asia's largest cosmetics manufacturing base, supplying private-label skincare, haircare, and color cosmetics to brands across the region. These are OEM/ODM factories that formulate and pack under your brand — verified against public Google data and Thailand's official DBD company registry.",
    moq: "Typical MOQ starts around 500–3,000 units per SKU for standard formulations; custom formulation runs are often higher.",
    leadTime: "Sampling: 2–4 weeks. Production after approval: 4–8 weeks, longer for new formulations.",
    certifications: ["Thai FDA (อย.) cosmetic notification", "GMP (ASEAN Cosmetic GMP)", "Halal (for Muslim-market export)", "ISO 22716"],
    faqs: [
      { q: "Can a Thai cosmetics factory formulate from scratch, or do I need my own formula?", a: "Most OEM factories offer a catalog of existing base formulas you can customize (fragrance, packaging, active ingredients) — cheaper and faster than a from-scratch ODM formulation, which typically needs a larger MOQ and longer lead time." },
      { q: "Do I need Thai FDA registration to sell internationally?", a: "No — Thai FDA (อย.) notification is required to manufacture and sell in Thailand. For export, you'll separately need your target market's cosmetic registration (e.g. Korea MFDS, US FDA, EU CPNP). A good OEM partner can supply the documentation your registration needs." },
      { q: "How is this different from sourcing on Alibaba?", a: "Every factory here is cross-checked against Thailand's official business registry (DBD) for legal name, registered capital, and founding date, plus real Google review history — not just a paid supplier badge." },
    ],
    match: (r) => !looksLikeStorefront(r) && (rawHas(r, ["cosmetic"]) || nameHas(r, ["cosmetic", "เครื่องสำอาง"])),
  },
  {
    slug: "food-beverage",
    icon: "🥫",
    title: "Food & Beverage OEM / Private Label Manufacturing",
    metaTitle: "Food & Beverage OEM Manufacturer Thailand — Private Label Factories",
    metaDescription:
      "Thai food and beverage OEM/private-label manufacturers — sauces, snacks, beverages, frozen and processed food. HACCP/GMP status, DBD registration, direct factory contact.",
    intro:
      "Thailand is one of the world's largest food-exporting nations, with deep OEM capacity across sauces, snacks, beverages, frozen and processed foods. These are private-label and contract manufacturers — cross-checked against Thailand's DBD company registry and ranked by real Google review history.",
    moq: "Typical MOQ: 1,000–10,000 units per SKU depending on packaging format; beverage co-packers often set MOQ by production-run hours, not units.",
    leadTime: "Sampling: 2–3 weeks. Production: 4–6 weeks after formula and packaging approval.",
    certifications: ["Thai FDA (อย.) food license", "HACCP", "GMP (Codex)", "Halal", "BRCGS / IFS (for EU/UK retail export)"],
    faqs: [
      { q: "What certifications should I require before ordering?", a: "At minimum, Thai FDA (อย.) food manufacturing license and GMP. For export to the EU, UK, or major retail chains, look for HACCP plus BRCGS or IFS. Halal certification matters for Middle East and Muslim-majority export markets." },
      { q: "Can a factory handle my own recipe under NDA?", a: "Most established OEM food manufacturers sign NDAs as standard practice for private-label work — ask before sharing a formulation, and confirm in writing." },
      { q: "How do I verify a factory is a real, registered company before wiring a deposit?", a: "Check the DBD registration table on this page — legal name, 13-digit registration number, registered capital, and founding date are pulled directly from Thailand's official business registry, not self-reported." },
    ],
    match: (r) => r.categories.includes("food_mfg"),
    relatedCategorySlug: "food_mfg",
  },
  {
    slug: "garment-apparel",
    icon: "👕",
    title: "Garment & Apparel OEM Manufacturing",
    metaTitle: "Garment OEM Manufacturer Thailand — Apparel & Sportswear Factories",
    metaDescription:
      "Thai garment and apparel OEM factories — cut-and-sew, sportswear, uniforms, and private-label clothing manufacturers. DBD registration and direct factory contact, no agent markup.",
    intro:
      "Thailand's garment industry runs from small cut-and-sew workshops to large export-grade apparel factories serving sportswear and fashion brands. These are manufacturing and OEM-capable garment factories — cross-checked against Thailand's DBD company registry and Google review history.",
    moq: "Cut-and-sew workshops: 100–300 units per style. Larger export factories: 1,000+ units per style, often per color/size run.",
    leadTime: "Sampling: 2–3 weeks. Bulk production: 4–8 weeks depending on order size and fabric sourcing.",
    certifications: ["BSCI / Sedex (SMETA) social compliance", "OEKO-TEX (fabric safety)", "ISO 9001"],
    faqs: [
      { q: "Can Thai garment factories work from my own tech pack and patterns?", a: "Yes — most OEM-capable factories work from a supplied tech pack, pattern, and fabric spec. Factories that also offer ODM can develop the pattern from a sketch or reference sample." },
      { q: "Is Thailand competitive on price versus Vietnam or Bangladesh for apparel?", a: "Thailand generally sits above Vietnam and well above Bangladesh on unit labor cost, but wins on shorter lead times to regional markets, more consistent quality control, and lower minimum order quantities — better fit for smaller or fast-turnaround brands than for high-volume basics." },
      { q: "What social-compliance audit should I ask for?", a: "BSCI or Sedex/SMETA are the most commonly requested audits by international apparel buyers. Ask the factory whether they hold a current audit report before placing a bulk order." },
    ],
    match: (r) => !looksLikeStorefront(r) && rawHas(r, ["garment", "clothes and fabric", "sportwear", "shoe factory", "weaving mill", "clothing manufactur"]),
    relatedCategorySlug: "textile",
  },
  {
    slug: "furniture",
    icon: "🪑",
    title: "Furniture OEM Manufacturing",
    metaTitle: "Furniture OEM Manufacturer Thailand — Wood, Metal & Custom Factories",
    metaDescription:
      "Thai furniture OEM factories — wood, metal, and rattan furniture manufacturers for private-label and export orders. DBD registration and direct factory contact.",
    intro:
      "Thailand has a long-established furniture manufacturing base spanning solid wood, engineered wood, metal, and rattan/wicker construction, much of it export-oriented. These are OEM-capable furniture factories — cross-checked against Thailand's DBD company registry and Google review history.",
    moq: "Typically a full container load (20ft/40ft) for export orders; some factories accept smaller mixed-container runs for new buyers.",
    leadTime: "Sampling: 3–5 weeks (custom designs take longer). Production: 6–10 weeks after sample approval.",
    certifications: ["FSC (wood sourcing)", "ISO 9001", "BSCI (for retail-chain buyers)"],
    faqs: [
      { q: "Can Thai furniture factories build to my own CAD design?", a: "Most OEM furniture manufacturers work from a supplied CAD file or technical drawing and produce a physical sample for approval before committing to a production run." },
      { q: "Do I need FSC certification for the wood?", a: "It depends on your market — many EU and US retail buyers require FSC chain-of-custody certification for solid-wood furniture. Ask the factory whether they hold current FSC certification before assuming it." },
      { q: "What's the real minimum order for a first-time export buyer?", a: "Container-load minimums are standard, but several factories will accept a mixed-SKU container for a first order from a new buyer to reduce your upfront commitment — worth asking directly rather than assuming a single-SKU minimum." },
    ],
    match: (r) => !looksLikeStorefront(r) && rawHas(r, ["furniture manufactur", "furniture maker"]),
  },
  {
    slug: "electronics-ems",
    icon: "🔌",
    title: "Electronics OEM / EMS Contract Manufacturing",
    metaTitle: "Electronics Contract Manufacturer Thailand — EMS & PCBA Assembly",
    metaDescription:
      "Thai electronics manufacturing services (EMS) — PCBA assembly, box-build, and electronics contract manufacturers. DBD registration, capital, and direct factory contact.",
    intro:
      "Thailand is a major Southeast Asian electronics manufacturing hub — home to global EMS players and a deep base of PCBA assembly, box-build, and electro-mechanical contract manufacturers. These are electronics manufacturing and assembly factories — cross-checked against Thailand's DBD company registry and Google review history.",
    moq: "PCBA assembly: often 500–1,000 boards for a first run with a new customer; established EMS partners may accept lower volumes for prototyping.",
    leadTime: "NPI (new product introduction) / first article: 3–6 weeks. Volume production: 4–8 weeks per run after component procurement.",
    certifications: ["ISO 9001", "ISO 13485 (medical electronics)", "IATF 16949 (automotive electronics)", "IPC-A-610 workmanship"],
    faqs: [
      { q: "What's the difference between an EMS provider and a component supplier?", a: "An EMS (Electronics Manufacturing Services) provider assembles finished boards or products from your design — PCBA, box-build, and testing. A component supplier just sells parts. Most factories in this list are assembly/EMS providers, not parts distributors." },
      { q: "Can a Thai EMS factory handle component sourcing, or do I need to supply parts (consignment)?", a: "Both models exist — 'turnkey' (factory sources components) and 'consignment' (you supply components, factory assembles only). Turnkey is simpler for a first order; consignment gives you more control over part sourcing and cost." },
      { q: "Do I need IPC-A-610 or IATF 16949 certification for my order?", a: "IPC-A-610 workmanship standards are worth confirming for any board assembly. IATF 16949 matters specifically if your end product goes into a vehicle — ask the factory directly rather than assuming certification level from company size." },
    ],
    match: (r) => !looksLikeStorefront(r) && rawHas(r, ["electronics manufactur", "electronic parts supplier", "computer hardware manufactur"]),
    relatedCategorySlug: "electronics",
  },
  {
    slug: "plastic-injection-molding",
    icon: "🧩",
    title: "Plastic Injection Molding OEM",
    metaTitle: "Plastic Injection Molding Thailand — OEM Factories & Tooling",
    metaDescription:
      "Thai plastic injection molding factories — custom tooling, mold-making, and injection-molded parts for OEM production. DBD registration and direct factory contact.",
    intro:
      "Plastic injection molding is one of Thailand's deepest manufacturing capabilities, serving automotive, electronics, packaging, and consumer-goods OEM production. These are injection molding and mold-making factories — cross-checked against Thailand's DBD company registry and Google review history.",
    moq: "Depends on part complexity and whether tooling already exists; with a new mold, per-part MOQ is often driven by amortizing the tooling cost rather than a fixed unit minimum.",
    leadTime: "New mold/tooling: 4–8 weeks. Production once tooling exists: 2–4 weeks per run.",
    certifications: ["ISO 9001", "IATF 16949 (automotive parts)", "ISO 13485 (medical-grade parts)"],
    faqs: [
      { q: "Who owns the mold/tooling — the factory or me?", a: "Standard practice is that the buyer who pays for the tooling owns it, and can request it be released to a different factory later. Get this in writing before paying for a mold — it's the single most common dispute in injection molding OEM." },
      { q: "Can a Thai molder handle my resin spec, or only their standard materials?", a: "Most factories run a standard set of resins (PP, ABS, PC, nylon, etc.) they stock in volume for cost efficiency. A less common or medical/food-grade resin may require the factory to special-order material, which affects both price and lead time — confirm before quoting." },
      { q: "How many cavities does a typical mold have, and does that matter for my order size?", a: "Cavity count directly drives cycle output — a single-cavity mold is cheaper to build but slower per part; multi-cavity tooling costs more upfront but lowers per-unit cost at volume. Ask the factory to quote both options if your order size isn't fixed yet." },
    ],
    match: (r) => !looksLikeStorefront(r) && rawHas(r, ["plastic injection molding service", "plastic fabrication company", "molding supplier"]),
    relatedCategorySlug: "plastic",
  },
  {
    slug: "medical-devices",
    icon: "🩺",
    title: "Medical Device & Healthcare Product OEM",
    metaTitle: "Medical Device OEM Manufacturer Thailand — Healthcare Product Factories",
    metaDescription:
      "Thai medical device and healthcare product OEM factories — gloves, medical-grade plastics, and healthcare equipment manufacturers. DBD registration and direct factory contact.",
    intro:
      "Thailand is a BOI-promoted medical device manufacturing hub, particularly for gloves, disposables, and medical-grade plastic and electronic components. These are medical device and healthcare product manufacturers — cross-checked against Thailand's DBD company registry and Google review history.",
    moq: "Varies widely by product class — consumables (gloves, disposables) run in large volumes; Class II/III device components are typically lower volume, higher precision.",
    leadTime: "Sampling and qualification: 4–8 weeks, longer if a new ISO 13485 process qualification is required. Production: 4–8 weeks per run.",
    certifications: ["ISO 13485 (medical device QMS)", "Thai FDA medical device registration", "CE marking (EU export)", "US FDA 510(k) support"],
    faqs: [
      { q: "Does the factory need ISO 13485, or is ISO 9001 enough?", a: "For anything classified as a medical device in your target market, ISO 13485 is the standard buyers should require — it's a stricter quality management system specific to medical devices, not a general manufacturing certification." },
      { q: "Can a Thai factory support my FDA 510(k) or CE submission with documentation?", a: "Established medical-device OEM factories maintain design history files and manufacturing records that support regulatory submissions, but confirm this capability directly — it varies significantly by factory size and export experience." },
      { q: "Is BOI promotion relevant to me as a buyer?", a: "BOI (Board of Investment) promotion is a factory-side incentive, not something that directly affects your purchase — but it's a useful signal that the factory has passed government review for export-oriented medical manufacturing." },
    ],
    match: (r) => !looksLikeStorefront(r) && rawHas(r, ["medical equipment manufactur", "medical device"]),
  },
];

export function findOemVertical(slug: string): OemVertical | undefined {
  return OEM_VERTICALS.find((v) => v.slug === slug);
}

export function matchedSuppliers(v: OemVertical, suppliers: Supplier[]): Supplier[] {
  return suppliers.filter((r) => r.business_status !== "Closed" && v.match(r));
}
