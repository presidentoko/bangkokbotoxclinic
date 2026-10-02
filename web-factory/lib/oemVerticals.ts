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

  // ── 제품 단위 버티컬용 (2026-10-02) ───────────────────────────────
  // 회사 이름으로 검색하는 사람은 이미 그 공장을 아는 사람이라 소싱 수요가 아니다.
  // 수입 바이어는 제품으로 검색하고, 공장 목록보다 먼저 "조건이 맞나"를 본다 —
  // HS 코드(관세 계산), 수출 항구, 최소 수량. 그래서 목록 위에 이것부터 둔다.
  hsCodes?: string[];      // 관세·랜디드코스트 계산의 출발점
  exportPorts?: string;    // 어디서 실리는가
  // ChatGPT·Perplexity 가 그대로 인용할 수 있는 한 문단. 숫자는 이 DB 에서 나온다.
  directAnswer?: (n: number, provinces: string[]) => string;
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
  // ── 제품 단위 버티컬 (2026-10-02) ─────────────────────────────────
  //
  // 기존 7개는 공정·업종 단위였다. 수입 바이어는 "frozen seafood supplier
  // thailand" 처럼 제품으로 검색한다 — GSC 에서 "frozen food suppliers for
  // restaurants"(27위), "thailand factory food"(40회 노출 71위)가 그 신호다.
  //
  // 기존 /c/ 카테고리와 범위가 같은 건 일부러 뺐다: metal fabrication(/c/steel),
  // auto parts(/c/auto_parts), chemical(/c/chemical), rubber(/c/rubber),
  // textile(/c/textile), furniture(/oem/furniture). 같은 목록을 다른 URL 로
  // 복제하면 두 페이지 다 깎인다. 아래 5개는 전부 기존 카테고리보다 좁다.
  {
    slug: "frozen-seafood",
    icon: "🦐",
    title: "Frozen Seafood Processing & Export",
    metaTitle: "Frozen Seafood Suppliers Thailand — Factories, MOQ & Export Info",
    metaDescription:
      "Frozen seafood processors and exporters in Thailand — shrimp, tuna, squid, surimi. HACCP and EU-approved plants, container MOQs, Laem Chabang and Songkhla export. DBD-verified.",
    intro:
      "Thailand is one of the world's largest frozen seafood exporters. In this directory the processors cluster in Samut Sakhon — the plant belt south of Bangkok — with further capacity in Chon Buri and Chachoengsao, all within trucking distance of Laem Chabang. Plants at this level run to HACCP and GMP as a baseline because EU, Japanese and US buyers require it, and many hold EU establishment approval numbers that let them ship into the European market.",
    moq: "Usually priced and shipped by container: one 20ft reefer holds roughly 10–12 tonnes, a 40ft about 24–26 tonnes. Trial orders below a full container are possible through consolidators but cost noticeably more per kilo.",
    leadTime: "Sampling 2–3 weeks. Production 3–6 weeks depending on species and season — shrimp and tuna supply swings with catch cycles, so confirm the harvest window before committing to a date.",
    certifications: ["HACCP", "GMP", "BRCGS or IFS (retail buyers)", "EU establishment approval number", "MSC / ASC (sustainability)", "Halal (where relevant)"],
    hsCodes: ["0306 — crustaceans (shrimp, prawns)", "0303 / 0304 — frozen fish and fillets", "0307 — molluscs (squid, cuttlefish)", "1604 — prepared or preserved fish"],
    exportPorts: "Laem Chabang (main container port, about 2h from the Samut Sakhon cluster), Bangkok Port for smaller consignments, and Songkhla for southern plants shipping to Malaysia and Singapore.",
    directAnswer: (n, provinces) =>
      `Thai Supply Hub lists ${n} frozen seafood processors and exporters in Thailand, concentrated in ${provinces.join(", ")}. HACCP and GMP are standard; EU-bound shipments additionally need the plant's EU establishment approval number. Orders are normally quoted per reefer container (10–12 t for a 20ft, 24–26 t for a 40ft), with 3–6 weeks production after sample approval and most volume shipping through Laem Chabang.`,
    faqs: [
      { q: "What certifications does a Thai frozen seafood plant need to export to the EU?", a: "HACCP plus an EU establishment approval number issued through Thailand's Department of Fisheries — without that number the consignment cannot clear EU border control. Retail buyers usually add BRCGS or IFS on top. Ask for the certificate scan and check the expiry date before sampling." },
      { q: "What is the minimum order for frozen seafood from Thailand?", a: "Most processors quote by reefer container — roughly 10–12 tonnes for a 20ft and 24–26 tonnes for a 40ft. Smaller trial quantities are possible through consolidators who combine several buyers into one container, but expect a meaningfully higher price per kilo." },
      { q: "Is shrimp available year round?", a: "Farmed shrimp supply is relatively steady but prices move with harvest cycles and disease pressure; wild-caught species such as tuna and squid swing much harder by season. For fixed-price annual contracts, discuss the pricing basis openly rather than assuming a flat rate." },
      { q: "Which province should I source from?", a: "Samut Sakhon has the densest concentration of processing plants in this directory and the shortest drive to Laem Chabang, with Chon Buri and Chachoengsao next. Southern plants around Songkhla exist but are thinner here; they mainly suit buyers shipping to Malaysia and Singapore or needing halal-certified capacity, so ask us if that is your route." },
    ],
    match: (r) =>
      !looksLikeStorefront(r) &&
      (rawHas(r, ["seafood", "fish processing", "frozen food", "shrimp"]) ||
        nameHas(r, ["seafood", "frozen", "shrimp", "tuna", "surimi", "อาหารทะเล", "แช่แข็ง"])) &&
      !rawHas(r, ["fish store", "seafood restaurant", "fish market"]),
    relatedCategorySlug: "food_mfg",
  },
  {
    slug: "corrugated-packaging",
    icon: "📦",
    title: "Corrugated Box & Paper Packaging",
    metaTitle: "Corrugated Box Manufacturers Thailand — Carton Factories, MOQ & Specs",
    metaDescription:
      "Corrugated carton and paper packaging factories in Thailand — single and double wall, printed shipper cartons, offset-laminated retail boxes. MOQ, lead times and flute specs.",
    intro:
      "Corrugated packaging is bought locally almost everywhere, because shipping empty boxes across borders rarely pays. Thai carton plants cluster around the manufacturing belt they serve — here that means Samut Sakhon, Bangkok and Samut Prakan first, then Chon Buri — and most hold tooling for repeat runs, which is what makes the second order cheaper than the first.",
    moq: "Plain shipper cartons typically start around 1,000–3,000 pieces per size. Printed retail packaging starts higher because of plate and die costs, often 5,000+. Dies and printing plates are usually a one-time charge amortised across reorders.",
    leadTime: "Sample or white-box mock-up 3–7 days. First production run 2–4 weeks including die and plate making; repeat runs on existing tooling often ship in 7–10 days.",
    certifications: ["ISO 9001", "FSC chain of custody", "ISO 14001", "Food-contact grade liner (primary food packaging)"],
    hsCodes: ["4819 — cartons, boxes and cases of paper or paperboard", "4808 — corrugated paper and paperboard", "4811 — coated or impregnated paper"],
    exportPorts: "Mostly domestic delivery by truck. For export, Laem Chabang — though shipping empty cartons internationally is usually uneconomic unless they are flat-packed and high value.",
    directAnswer: (n, provinces) =>
      `Thai Supply Hub lists ${n} corrugated box and paper packaging factories in Thailand, mainly in ${provinces.join(", ")}. Plain shipper cartons typically start at 1,000–3,000 pieces per size and printed retail boxes at 5,000+, with one-time die and plate charges. First runs take 2–4 weeks; repeat runs on existing tooling ship in about 7–10 days.`,
    faqs: [
      { q: "What do I need to give a carton factory to get a quote?", a: "Internal dimensions in millimetres (length x width x height), flute type if you know it, board strength or the weight the box must carry, number of print colours, and quantity. If you have an existing box, photographs of it flat with a ruler in frame get you a usable quote faster than a description." },
      { q: "What flute should I choose?", a: "B and C flute single wall covers most retail and general shipping. BC or EB double wall is for heavy or stacked loads. E flute is thin and takes fine printing, so it suits small retail boxes. If you are unsure, state the product weight and stacking height and let the plant specify — that is what they do all day." },
      { q: "Who pays for the die and printing plates?", a: "The buyer normally pays a one-time tooling charge and the plant stores the tooling for reorders. Confirm in writing who owns that tooling and whether it can be transferred if you later move factories." },
      { q: "Does it make sense to import cartons from Thailand?", a: "Usually only for flat-packed, high-value or specialised packaging. Corrugated boxes are mostly air by volume, so freight can exceed the product cost. Buyers who do import from Thailand generally do it because their goods are already packed here." },
    ],
    match: (r) =>
      !looksLikeStorefront(r) &&
      (rawHas(r, ["corrugated", "cardboard box", "paper bag", "packaging company", "paper mill", "box manufactur"]) ||
        nameHas(r, ["corrugat", "carton", "packaging", "กล่อง", "กระดาษ", "บรรจุภัณฑ์"])) &&
      !rawHas(r, ["stationery store", "office supply", "gift shop"]),
    relatedCategorySlug: "packaging",
  },
  {
    slug: "rice-milling",
    icon: "🌾",
    title: "Rice Mills & Grain Processing",
    metaTitle: "Rice Mill Suppliers Thailand — Exporters, Grades, MOQ & Shipping",
    metaDescription:
      "Rice mills and grain processors in Thailand — jasmine (hom mali), white, parboiled and glutinous rice. Grades, container quantities, export documents and mill locations.",
    intro:
      "Thailand is a top-three rice exporter, and the trade runs on grade and crop year rather than brand. Mills sit out in the growing regions rather than in one cluster — in this directory they are spread across Surin, Roi Et and the northeast for jasmine rice, plus Kanchanaburi and the central plain — while most exporters and consolidators keep offices in Bangkok. For a first purchase the practical question is whether you are buying from the mill or from a trading house, because the paperwork and the price both change.",
    moq: "Export sales are normally by container: about 25 tonnes in a 20ft. Many mills quote minimums of one to several containers. Below that you are generally buying from a trading house or packer rather than the mill.",
    leadTime: "2–4 weeks for grades held in stock; longer immediately after harvest, or when a specific crop year and grade must be sourced and blended to spec.",
    certifications: ["HACCP", "GMP", "ISO 22000", "Halal (Middle East and Indonesian markets)", "Organic certification (where claimed)", "Phytosanitary certificate per shipment"],
    hsCodes: ["1006.30 — semi-milled or wholly milled rice", "1006.20 — husked / brown rice", "1006.40 — broken rice", "1904 — prepared cereal products"],
    exportPorts: "Laem Chabang for containerised shipments; Bangkok Port and Koh Sichang anchorage for bulk vessels. Mills in the northeast truck to Laem Chabang, which adds inland freight worth asking to see itemised.",
    directAnswer: (n, provinces) =>
      `Thai Supply Hub lists ${n} rice mills and grain processors in Thailand, including mills in ${provinces.join(", ")}. Export sales are normally quoted per container of about 25 tonnes, by grade and crop year rather than brand. Every shipment needs a phytosanitary certificate; HACCP and ISO 22000 are common at export-oriented mills, and most containers leave through Laem Chabang.`,
    faqs: [
      { q: "What should a rice quotation specify?", a: "Grade and variety (for example Thai hom mali 100% grade B), broken percentage, crop year, moisture content, packing (jute, PP woven, or retail bags and what weight), Incoterm, and port. A quote missing broken percentage and crop year is not comparable to another quote." },
      { q: "Should I buy from a mill or an exporter?", a: "A mill can be cheaper and gives more control over grade and crop year, but many mills lack export documentation experience and will not handle the paperwork. A trading house costs more but handles the phytosanitary certificate, fumigation and shipping. For a first container the trading house is usually lower risk." },
      { q: "What documents does a rice shipment need?", a: "Commercial invoice, packing list, bill of lading, certificate of origin, phytosanitary certificate, and usually a fumigation certificate. Destination countries add their own requirements — several importing markets require pre-shipment inspection, so check before the container is sealed." },
      { q: "Is jasmine rice always from the northeast?", a: "Genuine Thai hom mali is grown mainly in the northeast, and that origin is part of what the premium pays for. Mills elsewhere do process it, but if origin matters to your market, ask for the growing region and supporting documentation rather than taking the label at face value." },
    ],
    match: (r) =>
      !looksLikeStorefront(r) &&
      (rawHas(r, ["rice mill", "grain", "agricultural product"]) ||
        nameHas(r, ["rice mill", "โรงสี", "ข้าว"])) &&
      !rawHas(r, ["rice restaurant", "grocery", "convenience"]),
    relatedCategorySlug: "food_mfg",
  },
  {
    slug: "cold-storage",
    icon: "❄️",
    title: "Cold Storage & Temperature-Controlled Warehousing",
    metaTitle: "Cold Storage Thailand — Temperature-Controlled Warehouses & 3PL",
    metaDescription:
      "Cold storage and temperature-controlled warehouses in Thailand — frozen, chilled and pharma-grade facilities near Laem Chabang, Bangkok and the Samut Sakhon food cluster.",
    intro:
      "Cold storage is the part of a Thai food or pharmaceutical supply chain that quietly decides whether everything else works. Capacity follows the cargo: in this directory that is Samut Sakhon for seafood and processed food, then Pathum Thani and Suphan Buri on the northern side of Bangkok. This is a thinner list than our factory categories — cold stores are fewer and often unlisted, so treat it as a starting set rather than the whole market.",
    moq: "Charged by pallet position per month or by weight, usually with a minimum commitment. Expect separate charges for inbound and outbound handling, blast freezing, and value-added work such as repacking or labelling.",
    leadTime: "Space can often be confirmed within days when capacity exists, but availability tightens sharply around harvest peaks and before Chinese New Year shipping. Pharma-grade and validated rooms need longer notice.",
    certifications: ["HACCP", "GMP", "ISO 22000", "GDP (pharmaceutical distribution)", "Halal-segregated storage (where required)"],
    hsCodes: ["Not applicable — this is a service. Tariff codes apply to the goods stored, not the storage."],
    exportPorts: "Laem Chabang is the main export gateway; facilities along the Bangna–Trad corridor and in Samut Prakan are positioned for both the port and Suvarnabhumi air cargo.",
    directAnswer: (n, provinces) =>
      `Thai Supply Hub lists ${n} cold storage and temperature-controlled warehouse operators in Thailand, concentrated in ${provinces.join(", ")}. Storage is charged per pallet position per month or by weight, with separate inbound, outbound and blast-freezing charges. Facilities handling food typically hold HACCP and ISO 22000, while pharmaceutical cargo requires GDP-compliant validated rooms.`,
    faqs: [
      { q: "What temperature ranges do Thai cold stores operate?", a: "Commonly chilled at around 0 to 4°C, frozen at about −18 to −25°C, and blast freezing down to roughly −35°C. Pharmaceutical storage at 2 to 8°C requires validated rooms with continuous monitoring and alarms — confirm the facility is GDP-compliant rather than just cold." },
      { q: "How is cold storage priced?", a: "Usually per pallet position per month, or per tonne. Handling in and out is billed separately, as are blast freezing, repacking, labelling and order picking. Ask for a worked example at your expected volume, because a low storage rate with high handling fees can cost more than the reverse." },
      { q: "Do I need a facility near the port or near my factory?", a: "If the goods are finished and for export, staging near Laem Chabang cuts reefer trucking and the risk of a missed cut-off. If you are still processing or repacking, being near the plant matters more. Many buyers end up using both, with the port-side facility for outbound consolidation." },
      { q: "Can the same facility store food and non-food?", a: "Physically yes, but food buyers and auditors expect segregation, and halal cargo requires it. Ask specifically how the facility segregates product types and whether it has been audited on that point — it comes up in buyer audits more often than operators expect." },
    ],
    match: (r) =>
      rawHas(r, ["cold storage", "refrigerat"]) ||
      nameHas(r, ["cold storage", "cold chain", "ห้องเย็น"]),
    relatedCategorySlug: "warehouse",
  },
  {
    slug: "chocolate-confectionery",
    icon: "🍫",
    title: "Chocolate & Confectionery Manufacturing",
    metaTitle: "Chocolate & Confectionery Manufacturers Thailand — OEM, MOQ & Certs",
    metaDescription:
      "Chocolate and confectionery factories in Thailand for private label and OEM — compound and couverture chocolate, gummies, hard candy. MOQ, lead times, HACCP and halal.",
    intro:
      "Thailand has a small but real chocolate and confectionery manufacturing base, serving both the domestic market and export private-label work. It is a heat-managed category: anything shipped or stored above about 20°C needs either compound chocolate formulated for tropical conditions or a temperature-controlled chain from factory to shelf, and that single decision shapes the whole specification.",
    moq: "Private-label runs commonly start in the hundreds of kilograms to a few tonnes per SKU. Custom moulds and printed wrappers raise the floor because of tooling and print minimums — a plain bar is far cheaper to start than a moulded shape in printed film.",
    leadTime: "Formulation and sampling 3–6 weeks, longer when a recipe is developed rather than adapted. Production 4–8 weeks, plus mould and packaging lead time if either is custom.",
    certifications: ["HACCP", "GMP", "Thai FDA registration", "Halal (ASEAN and Middle East)", "ISO 22000", "Organic or Fairtrade (where claimed)"],
    hsCodes: ["1806 — chocolate and other cocoa preparations", "1704 — sugar confectionery (gummies, hard candy)", "1805 — cocoa powder"],
    exportPorts: "Laem Chabang in reefer or temperature-controlled containers; air freight through Suvarnabhumi for samples and small high-value consignments.",
    directAnswer: (n, provinces) =>
      `Thai Supply Hub lists ${n} chocolate and confectionery manufacturers in Thailand, mainly around ${provinces.join(", ")}. Private-label runs typically start from a few hundred kilograms to a few tonnes per SKU, with 3–6 weeks for sampling and 4–8 weeks for production. HACCP, GMP and Thai FDA registration are standard, and halal certification is common for ASEAN and Middle East markets.`,
    faqs: [
      { q: "Compound or real chocolate for a hot climate?", a: "Compound chocolate replaces cocoa butter with vegetable fat, so it tolerates heat far better and needs no tempering — which is why most products sold unrefrigerated in Southeast Asia use it. Couverture tastes better and can be labelled as chocolate in more markets, but needs tempering and a controlled chain. Decide this before sampling, because it changes cost, shelf life and labelling." },
      { q: "What is a realistic minimum order for private-label chocolate?", a: "Usually a few hundred kilograms to a few tonnes per SKU. The binding constraint is often not the chocolate but the packaging: printed film and custom moulds carry their own minimums, which can exceed the chocolate volume you wanted to start with." },
      { q: "Can a Thai factory develop a recipe from scratch?", a: "Some will; others only adapt existing base recipes to your sugar, fat and inclusion preferences. Adaptation is faster and cheaper; full development takes longer and the factory may ask for a volume commitment. Ask which you are getting, since both are described as OEM." },
      { q: "Do I need halal certification?", a: "For Indonesia, Malaysia and most Middle East markets, effectively yes — and it constrains ingredients such as emulsifiers and alcohol-based flavourings. Thailand's halal certification body is well established and many factories already hold it, so ask upfront rather than reformulating later." },
    ],
    match: (r) =>
      !looksLikeStorefront(r) &&
      (rawHas(r, ["chocolate", "candy manufactur", "confection"]) ||
        nameHas(r, ["chocolate", "confection", "ช็อกโกแลต"])) &&
      !rawHas(r, ["chocolate shop", "dessert", "cafe", "bakery shop"]),
    relatedCategorySlug: "food_mfg",
  },
];

export function findOemVertical(slug: string): OemVertical | undefined {
  return OEM_VERTICALS.find((v) => v.slug === slug);
}

export function matchedSuppliers(v: OemVertical, suppliers: Supplier[]): Supplier[] {
  return suppliers.filter((r) => r.business_status !== "Closed" && v.match(r));
}
