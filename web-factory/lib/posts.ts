// 블로그 포스트 — 짧은 형식 (300-700 words). 가이드(long-form)와 분리.
// AEO 위해 데이터 포인트 + 외부 사실로 풍부.
//
// POSTS_MANUAL = 사람이 직접 쓴 글 (이 파일).
// POSTS_AUTO   = scripts/generate_blog.py 가 master_db 기반으로 자동 생성 (posts_auto.ts).
// export 되는 POSTS = 둘을 합친 것 — 다른 모든 파일은 POSTS 만 import.

import { POSTS_AUTO } from "./posts_auto";

export type Post = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: string;       // "Industry", "Sourcing", "Korean SMEs", "Tier 1 OEM" etc.
  body: string;           // markdown-ish 본문 (h2 = ##, list = -)
  published: string;      // ISO date
  updated?: string;
  related?: string[];
};

const POSTS_MANUAL: Post[] = [
  {
    slug: "eastern-seaboard-by-the-numbers",
    title: "Thailand's Eastern Seaboard by the Numbers",
    metaTitle: "Thailand Eastern Seaboard Manufacturing — 5 Key Numbers",
    metaDescription:
      "Why ~70% of Thailand's manufacturing GDP concentrates in Chon Buri + Rayong. Five numbers that explain the cluster.",
    category: "Industry",
    published: "2026-05-09",
    body: `Thailand's Eastern Seaboard — Chon Buri and Rayong provinces — is the manufacturing heart of ASEAN. International buyers sourcing from Thailand land here for a reason. Five numbers that tell the story:

## 1. ~70% of Thai manufacturing exports

The two provinces account for roughly seven-tenths of Thailand's manufactured-goods exports. Automotive plants (Toyota, Honda, Mitsubishi, Isuzu, Mazda, Nissan) cluster here, and the entire Tier 1 / Tier 2 supplier ecosystem follows the OEM plants.

## 2. ~$25 billion annual auto exports

Thailand is the world's 10th-largest automotive producer. Most of the export volume — completed vehicles plus parts — ships out from this manufacturing belt to ASEAN, Australia, the Middle East, and beyond.

## 3. 4 major industrial estate operators

Pinthong, Amata, WHA (post-Hemaraj merger), and Rojana. They differ on location-vs-port access, infrastructure model, tenant mix, and lease economics. We mapped them all in [our buyer guide](/guide/eastern-seaboard-industrial-estates-compared).

## 4. ~30 minutes to Laem Chabang port

The closest cluster — Pinthong / Bowin — sits within a half-hour truck ride of Laem Chabang container port. Logistics economics are unbeatable.

## 5. ~3,000 active manufacturers in the directory

Our directory currently surfaces ~3,000 verified Thai manufacturers, the bulk concentrated in this belt. Filter by [auto parts](/c/auto_parts), [industrial estate](/c/industrial_estate), or [warehouse](/c/warehouse) to drill down.`,
    related: ["sourcing-agent-markup-real-cost", "korean-smes-thailand-quick-map"],
  },
  {
    slug: "sourcing-agent-markup-real-cost",
    title: "Sourcing Agent Markup — What 15-30% Really Costs",
    metaTitle: "Sourcing Agent Markup Thailand — Real Cost Breakdown",
    metaDescription:
      "What you actually pay when a Thai sourcing agent marks up your supplier quote 15-30%. A USD 50K example.",
    category: "Sourcing",
    published: "2026-05-09",
    body: `Sourcing agents in Thailand typically mark up supplier quotes 15-30%. That number sounds abstract until you run it on a real order.

## The math on a $50,000 order

Direct supplier quote: $50,000.
Through a sourcing agent at 20% markup: $60,000.
Through a sourcing agent at 30% markup: $65,000.

Annual reorder × 4: $40,000-60,000 in lost margin per year per supplier.

## When the agent earns it

Three real scenarios where 20-30% is fair:

- **Language friction**: you don't have a Thai-speaking sourcing team and the supplier's English is patchy. Agent translates spec, negotiates, handles QC.
- **Multi-supplier orchestration**: a project bundles 5+ vendors and someone has to coordinate timelines + integration.
- **Physical QC presence**: factory visits aren't feasible from your country and the agent has on-the-ground inspectors.

## When you're overpaying

- Single-supplier simple SKU
- Repeat orders with proven vendors
- Supplier has an English website with responsive sales (most Tier 1 OEM, large industrial-estate tenants do)
- You can travel to Thailand twice a year for QC

## The fix

Use a directory like Thai Supply Hub to get supplier phone + website directly. Send your first RFQ in English. Pay agents only when their value-add is real — not as a default tax.

See our [sourcing guide](/guide/sourcing-thai-suppliers-direct) for the 5-step process.`,
    related: ["eastern-seaboard-by-the-numbers", "korean-smes-thailand-quick-map"],
  },
  {
    slug: "korean-smes-thailand-quick-map",
    title: "한국 SME가 태국 어디로 가나 — Quick Map",
    metaTitle: "한국 SME 태국 진출 거점 매핑 — Eastern Seaboard / Ayutthaya / Bangkok",
    metaDescription:
      "한국 중소기업이 태국에서 OEM·산단·창고 검토할 때 가장 자주 가는 지역 4곳. 산업별 매핑.",
    category: "Korean SMEs",
    published: "2026-05-09",
    body: `한국 중소기업이 태국에서 OEM·산단·창고 검토할 때 도메인 별로 가는 지역이 다릅니다. 핵심만 정리.

## 자동차 부품 → Eastern Seaboard (Chon Buri / Rayong)

Toyota·Honda·Mitsubishi·Isuzu 본플랜트가 모두 여기. AISIN, AGC, Toyoda Gosei 같은 Tier 1 일본계도 인근. Pinthong / Amata City Chonburi / Amata City Rayong / WHA Eastern Seaboard 산단이 거점.

→ [태국 자동차 부품 카테고리](/ko/c/auto_parts) | [Amata vs WHA 비교](/ko/guide/korea-sme-amata-wha-comparison)

## 화학 / 정밀화학 → Map Ta Phut (Rayong)

PTT, IRPC, PTTGC, SCG Chemicals 통합 콤플렉스. 한국 LG화학·SK·롯데케미칼이 입주 검토.

→ [태국 화학 카테고리](/ko/c/chemical)

## 식품·화장품 OEM → Samut Sakhon / Ayutthaya / Pathum Thani

방콕 외곽 cluster. 냉동 해산물 (Samut Sakhon), 가공식품 (Pathum Thani), 화장품 ODM (방콕).

→ [태국 식품 제조사 카테고리](/ko/c/food_mfg)

## 본사·R&D → Bangkok

제조 plant 가 아닌 commercial / 영업 / R&D 거점. 한국 대기업 (포스코·LG·삼성) 의 태국 법인 본사 대부분 방콕.

→ [방콕 공급사](/ko/city/bangkok) | [전체 태국 OEM 직거래 가이드](/ko/guide/korea-sme-thai-oem-process)

## 한국 진출 패턴

대기업이 먼저 들어가고 협력사 SME 가 따라가는 구조. 포스코→Amata Rayong, LG화학→Map Ta Phut 같은 클러스터 효과. 신규 SME 진출은 보통 한국 협력사가 먼저 자리 잡은 산단 옆을 검토.`,
    related: ["sourcing-agent-markup-real-cost", "eastern-seaboard-by-the-numbers"],
  },
  {
    slug: "map-ta-phut-at-a-glance",
    title: "Map Ta Phut at a Glance — What's Actually There",
    metaTitle: "Map Ta Phut Industrial Estate — At a Glance",
    metaDescription:
      "Southeast Asia's biggest petrochemical complex in 5 minutes. PTT, IRPC, PTTGC, SCG Chemicals — what they make, who buys.",
    category: "Industry",
    published: "2026-05-10",
    body: `Map Ta Phut Industrial Estate in Rayong is the largest integrated petrochemical complex in Southeast Asia. For chemical buyers sourcing from Thailand, it's unavoidable. What's actually there:

## Upstream — the four anchors

- **PTT (state oil)**: natural gas separation, aromatics complex
- **IRPC**: integrated refinery + olefin plant
- **PTTGC (PTT Global Chemical)**: one of ASEAN's largest ethylene cracker complexes
- **SCG Chemicals**: olefins, polyolefins, downstream specialty

## Why the complex matters

Feedstock economics. Polyolefin compounders, specialty chemical formulators, rubber and plastic downstream operators all benefit from on-site or short-haul road access to upstream chemicals. Pricing on base chemicals at Map Ta Phut is competitive with or below most ASEAN comparables.

## What buyers source here

- Bulk plastics (HDPE, LDPE, PP) for downstream conversion
- Specialty chemicals (compounded resins, masterbatch, color concentrate)
- Industrial chemicals (lubricants, surfactants, adhesives)
- Rubber and rubber-derivative compounds

## Logistics

Map Ta Phut deep-sea port handles bulk chemical exports directly (chemical tankers, bulk LPG). For containerized chemical shipments, Laem Chabang is 45 min by truck.

## Buyer access

Tier 1 (PTT/PTTGC/IRPC/SCG): direct via corporate sales offices, not the plants. Long-term offtake contracts standard.

Tier 2/3 specialty: more accessible to international buyers, smaller MOQs, faster contracts. See our [chemical category](/c/chemical) for the directory.`,
    related: ["eastern-seaboard-by-the-numbers"],
  },
  {
    slug: "verified-supplier-what-we-check",
    title: "Verified Supplier — What We Actually Check",
    metaTitle: "Verified Supplier Verification Process — Thai Supply Hub",
    metaDescription:
      "What goes into a Verified / Verified Premium / Verified Enterprise badge on Thai Supply Hub. Tier-by-tier verification process.",
    category: "Methodology",
    published: "2026-05-10",
    body: `The Verified Supplier badge on a Thai Supply Hub listing isn't decorative — each tier carries specific verification work. Here's exactly what we check.

## Tier 1: Verified (₿5,000)

- Business registration certificate (Thai Department of Business Development) — confirmed against the public DBD database
- Factory address verification — site photo or street-view confirmation
- Phone + website live (not parking page or bounce)

This is the baseline tier. It says: "This is a real, registered Thai business, operating from a real address."

## Tier 2: Verified Premium (₿15,000)

Everything from Tier 1, plus:
- Quality certification verified against issuing authority's database:
  - **ISO 9001** (general quality management) — IAF-accredited bodies
  - **IATF 16949** (automotive quality) — for auto parts suppliers
  - **HACCP / FSSC 22000** (food safety) — for food manufacturers
  - **ISO 14001** (environmental) — optional add-on
- Cert expiry date logged. We re-verify on cert renewal cycles.

Premium tier signals: certified quality system actively maintained.

## Tier 3: Verified Enterprise (₿40,000)

Everything from Tier 2, plus:
- On-site visit to headquarters (we travel)
- Customer reference calls (3 named buyers we contact independently)
- Production capacity verification — claimed monthly volume cross-checked

Enterprise tier signals: this supplier survived end-to-end due diligence we'd run on any sourcing decision.

## Why this matters for buyers

Our directory pulls from public Google Business Profiles — neutral, but anyone can register. Verification adds accountability. If a Verified supplier turns out to be a fraud, we revoke and refund.

## Why this matters for suppliers

Buyers shortlist with verification filters. A blue/green/gold badge changes whether your listing gets clicked at all.

See [/for-suppliers](/for-suppliers) for tier pricing and application process.`,
    related: ["sourcing-agent-markup-real-cost"],
  },
  {
    slug: "trust-score-explained",
    title: "Trust Score Explained — How We Rank Suppliers",
    metaTitle: "Trust Score Methodology — Thai Supply Hub Supplier Ranking",
    metaDescription:
      "How Thai Supply Hub's Trust Score (0-100) is calculated. Two-factor formula combining Google rating and review volume.",
    category: "Methodology",
    published: "2026-05-10",
    body: `Trust Score is the number you see on every Thai Supply Hub listing — between 0 and 100. It's our composite ranking metric. Here's the formula and why it exists.

## The formula

\`\`\`
Trust Score = (Google rating ÷ 5) × 50      ← rating part, 0-50 points
            + log10(review_count) × 12       ← volume part, capped at 40
            + (scraped review coverage × 5)  ← bonus for analyzed reviews, capped at 5
            + (avg review text length × 1.5) ← bonus for detailed reviews, capped at 5
\`\`\`

A perfectly-rated supplier with 10,000 reviews and high coverage hits ~95-99. A 4.0-star supplier with 50 reviews lands around 60-70.

## Why volume matters

A 5-star rating with 3 reviews is statistical noise. A 4.2-star rating with 200 reviews is real signal. We use logarithmic scaling so 1,000 vs 10,000 reviews doesn't dominate the score — both indicate established operation; the gap to 30 reviews is what matters.

## Why coverage matters

Some suppliers have 500 Google reviews but only 5 of them are publicly accessible (Google de-duplicates and limits depth). Coverage = % of reviews we successfully scraped. Higher coverage means our reading of the supplier is fuller.

## Why text length matters

A reviewer who wrote three sentences saw the supplier more carefully than one who wrote "good." Average review text length is a quality signal for the review pool itself.

## What Trust Score is NOT

- Not a Google ranking. We compute it; Google doesn't see it.
- Not a guarantee of quality. New, excellent suppliers with 10 reviews score lower than mediocre suppliers with 1,000 reviews.
- Not paid. Sponsored slots are explicitly badged separately.

## How to read it

- **80-100**: top-tier established supplier with strong public proof
- **60-80**: solid mid-tier, worth shortlisting
- **40-60**: smaller / newer / niche — verify directly
- **<40**: thin signal, do extensive due diligence before contracting

The full ranked list is at [/best/highly-recommended](/best/highly-recommended).`,
    related: ["verified-supplier-what-we-check"],
  },
  {
    slug: "why-this-directory-exists",
    title: "Why This Directory Exists",
    metaTitle: "Why Thai Supply Hub Exists — The Sourcing Problem We Fix",
    metaDescription:
      "What Thai Supply Hub does and why it's not Alibaba. The middleman-stripping play.",
    category: "About",
    published: "2026-05-10",
    body: `If you've sourced from Thailand before, you've used some combination of: Alibaba, sourcing agents, trade shows, LinkedIn cold outreach, ASEAN Manufacturing Show. Each has a problem.

## The problem with each option

**Alibaba**: weaker for Thai suppliers than for Chinese. Listings are mostly agent-relisted or duplicate. Quality verification is opaque.

**Sourcing agents**: 15-30% markup baked into every quote. Useful for first-time / non-English buyers, but a permanent margin tax for everyone else.

**Trade shows**: physical, time-bound, you meet 30 suppliers in 2 days. Good for relationship-building, slow for shortlisting.

**Cold outreach**: low signal. You email 100, hear back from 5, of which 2 are real fits. Time-expensive.

## What we actually do

Thai Supply Hub aggregates Google Business Profile data on Thai manufacturers, runs B2C noise filters (no shopping malls, butcher shops, factory-outlet retail), and ranks the survivors by a transparent Trust Score.

Each listing shows the supplier's public phone and website — same data Google has, but organized for B2B browsing, not "near me" navigation.

## What we don't do

- Don't broker deals. Buyers contact suppliers directly.
- Don't take commission. No conflict-of-interest pressure on rankings.
- Don't write fake reviews. Reviews shown are direct excerpts from public Google reviews, attributed.

## How we monetize

- Sponsored slots (Editor's Pick / Recommended / Featured) — clearly badged, never replace organic
- Verified Supplier tiers (₿5K / ₿15K / ₿40K) — supplier pays for verification badge
- Eventually: lead generation for participating suppliers

## Who we built this for

Buyers who:
1. Have a clear product spec
2. Want to skip the agent layer when feasible
3. Prefer original-source data over marketing

Korean SMEs sourcing from Thailand are an outsized share of our /ko traffic. International electronics + automotive + food buyers dominate /en. Thai domestic SMEs use /th to find local OEM peers.

If that's you, [start on the homepage](/) or jump to a category — [manufacturers](/c/manufacturer), [auto parts](/c/auto_parts), [warehouses](/c/warehouse).`,
    related: ["sourcing-agent-markup-real-cost", "trust-score-explained", "verified-supplier-what-we-check"],
  },
  {
    slug: "thailand-boi-explained",
    title: "Thailand BOI Explained — What the Tax Holiday Actually Gets You",
    metaTitle: "Thailand BOI Incentives Explained — Tax Holiday for Manufacturers",
    metaDescription:
      "Board of Investment (BOI) promotion explained: what the tax holiday covers, which industries qualify, how to apply, and why location inside an industrial estate matters.",
    category: "Industry",
    published: "2026-06-07",
    body: `Thailand's Board of Investment (BOI) is the primary mechanism for attracting foreign manufacturers. If you're setting up production in Thailand, understanding BOI isn't optional.

## What BOI promotion means

A promoted company gets:
- **0% corporate income tax** for 3-8 years (activity-dependent)
- **Import duty exemption** on machinery and raw materials used in export production
- **Work permit and land ownership** facilitation for foreign staff
- **Customs fast-track** processing at Laem Chabang and Map Ta Phut

The tax holiday alone can save tens of millions of baht for a manufacturing setup — the math depends on capex scale.

## Which industries qualify

BOI groups activities into merit-based categories. High-eligibility sectors for foreign buyers:

| Industry | Typical holiday |
|---|---|
| Electronics / EMS | 5-8 years |
| Automotive parts (Tier 1) | 5-8 years |
| Food processing (export-focused) | 3-5 years |
| Chemical / specialty polymer | 3-5 years |
| Logistics / cold chain | 3 years |
| Bio-based / green energy | 5-8+ years |

## Why industrial estate location matters

BOI promotes activities in specific zones. Being inside an IEAT-designated estate — Amata, WHA, Pinthong, Rojana — can:
- Unlock higher promotion merit (additional tax years)
- Simplify customs (One-Stop Service on-site)
- Give access to ready-built factory shells (faster setup)

Industrial estate tenants already account for a large share of Thailand's BOI-promoted companies.

## How to apply

1. Submit promotion application to BOI (boi.go.th) — best done via a Thai legal firm
2. BOI reviews and issues promotion certificate (typically 3-6 months)
3. Set up Thai entity, register with Revenue Department
4. Begin operations under promotion framework

Foreign majority ownership (up to 100%) is allowed for BOI-promoted manufacturers.

## Suppliers in BOI-eligible industries

Browse [BOI-eligible manufacturers](/best/boi-eligible) in our directory — filtered by estate location and industry heuristic.`,
    related: ["eastern-seaboard-by-the-numbers", "verified-supplier-what-we-check"],
  },
  {
    slug: "thai-factory-moq-guide",
    title: "MOQ in Thailand — How to Negotiate Minimum Order Quantities",
    metaTitle: "MOQ Negotiation at Thai Factories — Buyer's Guide",
    metaDescription:
      "What MOQs look like at Thai manufacturers, how they differ by factory type, and four tactics that actually work to lower minimums.",
    category: "Sourcing",
    published: "2026-06-07",
    body: `Minimum order quantity is the first friction point for most international buyers contacting Thai factories. Here's how MOQs actually work in the Thai manufacturing context.

## MOQ norms by factory type

**Large industrial-estate manufacturers (100+ employees)**
- Established OEM with long-term clients
- MOQ is usually a floor they set once and rarely move
- Range: 500-2,000 units per run for plastics/auto parts; 1MT+ for chemicals
- Best move: commit to annual volume contract, not spot orders

**Mid-size B2B manufacturers (20-100 employees)**
- More flexible, especially if you come with a spec sheet and realistic timeline
- Range: 200-500 units for parts; 200kg-1MT for specialty chemicals
- Best move: offer a reference sample order with a written intent letter for follow-on volume

**Small specialist factories / cottage-industrial**
- MOQs negotiable, but quality control is the risk
- Range: 50-200 units depending on product complexity
- Best move: arrange a 3rd-party QC inspection before first shipment

## Four tactics that actually work

**1. Break the order into phases**
Instead of "I want 100 units" (which triggers MOQ rejection), say "I want 100 units for an evaluation run, then 500/month from quarter 2." Factories prioritize buyers with volume roadmaps.

**2. Share tooling cost**
If your product requires a mold or jig, offer to pay tooling cost upfront in exchange for lower MOQ on the first run. Many Thai factories will accept this — it de-risks the setup for them.

**3. Use a consignment test**
Some factories will run a small first order at spot (above normal) pricing, with a contract price locked for subsequent runs. Not all do, but it's worth asking.

**4. Reference a local agent or estate contact**
Cold emails from unknown overseas buyers get ignored. An intro from a Thai industrial estate's tenant-service team, a supplier from the same estate who knows you, or a local agent adds credibility that can move the MOQ conversation forward.

## What doesn't work

- Pointing at competitor pricing to force the MOQ down. Thai factories will just pass.
- "We'll get to volume later" without showing specifics. Vague promises don't move factories.
- Trying to negotiate over email with no phone call. Call first, email to confirm terms.

## Where to start

Find manufacturers with direct contact info at [/best/manufacturers](/best/manufacturers) or filter by category — [auto parts](/c/auto_parts), [packaging](/c/packaging), [food OEM](/c/food_mfg). Call the number listed, ask for the export sales team.`,
    related: ["sourcing-agent-markup-real-cost", "why-this-directory-exists"],
  },
  {
    slug: "chon-buri-vs-rayong-manufacturing",
    title: "Chon Buri vs Rayong — Which Province for Your Thai Factory?",
    metaTitle: "Chon Buri vs Rayong Manufacturing — Which Province Wins?",
    metaDescription:
      "Concrete comparison: port distance, land costs, industrial estate mix, labor pool, and sector fit. Which province makes more sense for your supply chain?",
    category: "Industry",
    published: "2026-06-07",
    body: `Both Chon Buri and Rayong sit on Thailand's Eastern Seaboard — 90 minutes from Bangkok, one port between them. But the two provinces serve different supply chains, and the choice matters more than most foreign buyers realize.

## Port Access

Laem Chabang container port straddles the border but falls administratively in Chon Buri (Si Racha district). Factories in **Chon Buri** — Pinthong, Bowin, Si Racha — sit within 20-30 minutes truck. Factories in **Rayong** (Amata City Rayong, WHA Eastern Seaboard, Map Ta Phut) face 40-75 minutes depending on traffic and route.

For high-frequency container movements, the Chon Buri proximity delta matters. For bulk chemical or petrochemical shipments, Map Ta Phut's dedicated pier in Rayong wins outright.

## Industrial Estate Tenant Mix

**Chon Buri dominates automotive**: Toyota Chachoengsao feeds Pinthong, Honda's Prachinburi plant feeds WHA, but the Tier 1/2 supplier ecosystem — seats, wiring harnesses, pressed parts, rubber — concentrates in Chon Buri estates.

**Rayong is Map Ta Phut + EV transition**: PTT, IRPC, and ~100 petrochemical plants cluster at Map Ta Phut industrial port. Simultaneously, Rayong is where Thailand's EV battery assembly push is landing — BYD's factory, AION, Foxconn.

## Land and Lease Costs

Ready-built factories (RBF):

| Province | RBF rate (฿/sqm/month) | Land lease |
|----------|------------------------|------------|
| Chon Buri | 220-320 | Higher (near port) |
| Rayong | 200-290 | Slightly lower inland |

Map Ta Phut industrial zone commands a premium for chemical-grade infrastructure (hazmat handling, dedicated pipelines). Rayong inland estates — WHA ESIE 3, Hemaraj Chonburi 8 — are more competitive on price.

## Labor Pool and Cost

Chon Buri's tighter labor market means slightly higher wages for assembly line workers (฿12,000-15,000/month) compared to Rayong's mixed pool (฿11,000-14,000/month). Both provinces have large migrant worker populations from Myanmar, Laos, Cambodia.

For high-skill manufacturing (precision machining, EMS), Chon Buri's proximity to Bangna-Trad corridor gives better access to engineers commuting from Bangkok.

## Sector Fit

| Your sector | Better province |
|-------------|----------------|
| Automotive Tier 1/2 | Chon Buri |
| Petrochemical / specialty chemicals | Rayong (Map Ta Phut) |
| EV assembly / battery | Rayong (emerging) |
| Electronics, HDD, EMS | Chon Buri (WHA, Pinthong) |
| Packaging, plastics | Either — cost drives the call |
| Food manufacturing | Chon Buri or Nakhon Ratchasima |
| Logistics / 3PL | Chon Buri (port proximity) |

## The Short Answer

**Choose Chon Buri** if you're in automotive supply chain, electronics, or need fast container turnaround.
**Choose Rayong** if you're in petrochemicals, bulk chemicals, or targeting Thailand's EV manufacturing cluster.

Browse suppliers by estate at [/best/industrial-estates](/best/industrial-estates) or by category — [auto parts](/c/auto_parts), [electronics](/c/electronics), [warehouses](/c/warehouse).`,
    related: ["eastern-seaboard-by-the-numbers", "map-ta-phut-at-a-glance"],
  },
  {
    slug: "chiang-mai-manufacturing-hub",
    title: "Chiang Mai as a Manufacturing Hub — Food OEM, Coffee, and Herbs",
    metaTitle: "Chiang Mai Manufacturing — Food OEM, Coffee, Herbal Products",
    metaDescription:
      "Why northern Thailand's Chiang Mai is a distinct sourcing destination for food OEM, specialty coffee, herbal extracts, and wellness products — separate from the Eastern Seaboard.",
    category: "Industry",
    published: "2026-06-07",
    body: `Most foreign buyers default to Chon Buri or Bangkok when sourcing from Thailand. Chiang Mai is a different story — and for specific product categories, it's the right call.

## What Chiang Mai Actually Makes

Northern Thailand has built a distinct manufacturing identity around:

- **Specialty coffee** — Arabica from Doi Chang, Doi Inthanon highlands. Chiang Mai has ~30 roasters, 15+ exporters, and growing contract roasting capacity
- **Herbal extracts** — Turmeric, lemongrass, galangal, butterfly pea flower. Most Thai herbal supplement OEM is concentrated here
- **Wellness and spa products** — Oils, balms, massage products. Thai herbal tradition + export capability
- **Food OEM / HACCP factories** — Chiang Mai Industrial Estate (NICEA) hosts 50+ tenants, several with BRC/IFS certification
- **Handicrafts and packaging** — Lower-cost decorative packaging with local artisan networks

## Chiang Mai Industrial Estate (NICEA)

The Chiang Mai Industrial Estate, operated by IEAT, is 10km from the airport. Tenants span food processing, packaging, light manufacturing. Rent: ฿120-200/sqm/month — significantly cheaper than Eastern Seaboard.

Chiang Mai's air cargo connection (Chiang Mai International Airport) makes it viable for premium/perishable products where airfreight margins work.

## Comparison with Eastern Seaboard

| Factor | Eastern Seaboard | Chiang Mai |
|--------|-----------------|------------|
| Port access | Laem Chabang (excellent) | Air only (Chiang Mai Airport) |
| Industrial scale | Very large | Smaller, artisanal |
| Labor cost | ฿11-15k/month | ฿9-12k/month |
| Category fit | Auto, electronics, chemicals | Food OEM, herbal, wellness |
| BOI incentives | Zone 1-2 | Zone 3 (higher incentive) |

Zone 3 BOI status means Chiang Mai-based factories can qualify for longer corporate tax exemptions (up to 8 years) — a meaningful advantage for new investment.

## Who Should Source from Chiang Mai

- Brands importing **specialty coffee** for private label
- Supplement brands needing **certified herbal extraction**
- Wellness / spa brands wanting **authentic Thai formulations**
- Food brands targeting **premium Thai-origin ingredients** with clean-label certification

Browse [food manufacturers](/c/food_mfg) in our directory or read the [Thai food manufacturer guide](/guide/thai-food-manufacturer-haccp-export) for certification requirements.`,
    related: ["eastern-seaboard-by-the-numbers", "thai-factory-moq-guide"],
  },
  {
    slug: "thai-rubber-latex-industry",
    title: "Thailand Rubber and Latex — The World's #1 Producer",
    metaTitle: "Thailand Rubber Sourcing — Natural Latex, Products, Key Suppliers",
    metaDescription:
      "Thailand produces ~35% of the world's natural rubber. Where it's grown, what products are made from it, and how to source rubber components and latex goods directly.",
    category: "Industry",
    published: "2026-06-07",
    body: `Thailand is the world's largest natural rubber producer — around 4.5 million tonnes per year, roughly 35% of global supply. If you're sourcing rubber-based products, Thailand should be your first stop.

## Where Rubber Comes From in Thailand

The rubber belt runs through the south: Surat Thani, Nakhon Si Thammarat, Songkhla, Trang, and Phatthalung. Most raw latex originates here before being shipped north to processing facilities.

Key processing hubs:
- **Songkhla / Hat Yai** — largest rubber processing and export center
- **Surat Thani** — sheet rubber and concentrated latex
- **Chon Buri / Rayong** — where rubber raw material meets industrial manufacturing

## What's Made from Thai Rubber

**Industrial products:**
- Automotive seals, gaskets, belts, hoses — huge supply base near Eastern Seaboard
- Conveyor belts, industrial rollers
- Vibration dampers for machinery

**Consumer products:**
- Medical gloves, examination gloves (HACCP / EN374 certified)
- Foam mattresses and pillows — Dunlop and Talalay processes
- Condoms, catheters (medical grade, ISO 13485)

**Specialty latex:**
- Foam rubber for furniture (furniture OEM Thailand is significant)
- Balloons, dipped goods

## Pricing Structure

Natural rubber price tracks the SICOM benchmark (Singapore Commodity Exchange). In 2024-2025:
- RSS3 (Ribbed Smoked Sheet Grade 3): ~$1.50-1.80/kg
- Concentrated latex (60% DRC): ~$1.20-1.60/kg
- Finished medical gloves: $0.04-0.08/glove (depends on grade/thickness)

Rubber product FOB pricing includes 20-40% conversion margin above raw material cost.

## How to Source Rubber Products

For **components** (seals, gaskets, mounts): Contact manufacturers in Chon Buri / Rayong directly — many are Tier 2 auto suppliers who also accept custom orders.

For **consumer goods** (gloves, mattresses): Look for factories with ISO 9001 + product-specific certification (EN374 for chemical protective gloves, EN ISO 10651 for medical).

For **raw latex**: Source through rubber cooperatives (สหกรณ์ยาง) in southern Thailand or large exporters in Hat Yai.

Browse [rubber product suppliers](/c/rubber) in our directory or see the [Thai rubber products sourcing guide](/guide/thai-rubber-products-sourcing-guide).`,
    related: ["eastern-seaboard-by-the-numbers", "chon-buri-vs-rayong-manufacturing"],
  },
  {
    slug: "thai-packaging-oem-options",
    title: "Thai Packaging OEM — Flexible, Rigid, and Sustainable Options",
    metaTitle: "Thailand Packaging Manufacturers — Flexible, Rigid, Eco Options 2026",
    metaDescription:
      "Thailand's packaging industry: who makes flexible pouches, rigid containers, glass, corrugated boxes, and sustainable packaging — and how to source directly.",
    category: "Sourcing",
    published: "2026-06-07",
    body: `Thailand has a mature, export-grade packaging manufacturing base. Whether you need flexible pouches for food products, rigid plastic containers, or sustainable alternatives, the supply base is here.

## Packaging Categories and Where They're Made

**Flexible packaging (pouches, films, laminates)**
- Concentrated in Samut Prakan, Chon Buri, and Pathum Thani
- Major capability: stand-up pouches (SUP), retort pouches, vacuum bags
- Certifications common: FDA-compliant, food-safe inks, HACCP facility
- MOQ: typically 10,000-50,000 units per SKU

**Rigid plastic (PET, HDPE, PP bottles and containers)**
- Scattered across industrial estates — Amata, WHA, Rojana
- Blow molding and injection molding both available
- Lead time: 3-6 weeks for standard runs; 8-12 weeks for new tooling
- Tooling cost: $2,000-15,000 depending on mold complexity

**Glass packaging**
- Smaller supply base — primarily located in Saraburi and Nakhon Pathom
- Thai Glass Industries (TGI) and Allied Glass dominate volume
- Better for premium products (spirits, sauces, cosmetics)

**Corrugated / carton boxes**
- Multiple large converters: Thai KI, Siam Corrugated Box, DS Smith Thailand
- E-flute, B-flute, heavy-duty export cartons all available
- Fast lead time: 7-14 days for standard orders

**Sustainable packaging (growing)**
- Bagasse, PLA, compostable films available from specialist converters
- Cost premium: 25-60% over conventional
- Thailand is early-stage on biodegradable infrastructure — compostable claims require end-market verification

## What to Look for in a Thai Packaging Supplier

- **DBD-registered** — verifiable legal entity, registered capital signal
- **ISO 9001 or BRC/IFS** for food-contact packaging
- **Printing capability** in-house vs. outsourced (affects lead time and quality control)
- **Export track record** — ask for active export client references (EU, US, Japan markets)

## MOQ and Sampling

Most flexible packaging suppliers require a minimum print run due to plate/cylinder costs. Expect:
- Gravure printing: MOQ 10,000-30,000 units (cylinder cost: $800-2,500)
- Digital printing: no plate cost, MOQ as low as 500 units, but higher unit price

Sample lead time: 2-4 weeks for stock materials; 4-8 weeks for custom structures.

Browse [packaging manufacturers](/c/packaging) in the directory or read the [Thai packaging guide](/guide/thai-packaging-manufacturer-guide).`,
    related: ["thai-factory-moq-guide", "chiang-mai-manufacturing-hub"],
  },
  {
    slug: "laem-chabang-port-logistics-guide",
    title: "Laem Chabang Port — How Exports Actually Leave Thailand",
    metaTitle: "Laem Chabang Port Guide — Thailand Container Export Process",
    metaDescription:
      "How Laem Chabang port works for international buyers: terminal layout, shipping lines, transit times to Korea/Japan/EU, and what to know before your first shipment.",
    category: "Sourcing",
    published: "2026-06-07",
    body: `Laem Chabang is the gateway for most Thai manufacturing exports. If you're sourcing from Thailand, your containers almost certainly leave from here. Here's how it actually works.

## Port Basics

Laem Chabang Port (LCBP) sits in Si Racha district, Chon Buri — about 100km southeast of Bangkok. It's Thailand's largest container port by volume (~8 million TEU/year) and one of Southeast Asia's top 10.

Three main terminals:
- **Terminal A** — oldest, handled by LCMT (Laem Chabang Container Terminal)
- **Terminal B** — expanded in 2010s, higher throughput
- **Terminal C** — ongoing phase-3 expansion (2025-2028), adding 3.5M TEU capacity

Most industrial estate suppliers in Chon Buri and Rayong are within 20-60km of the port entrance.

## Key Shipping Lines and Services

Major carriers calling Laem Chabang:

| Carrier | Main Services |
|---------|--------------|
| Evergreen | Intra-Asia, Europe |
| COSCO / OOCL | Asia, North America, Europe |
| Maersk / MSC | Global coverage |
| ONE (Ocean Network Express) | Japan, Korea, global |
| Yang Ming | Intra-Asia, transpacific |

Frequency: multiple sailings per week to Korea, Japan, China. Weekly to Europe (transit ~25-30 days via Suez).

## Transit Times from Laem Chabang

| Destination | Transit Time |
|-------------|-------------|
| Busan (Korea) | 4-6 days |
| Yokohama / Osaka (Japan) | 4-7 days |
| Shanghai / Ningbo | 3-5 days |
| Rotterdam (Europe) | 25-30 days |
| Los Angeles (US West) | 18-22 days |

## What Slows Shipments Down

Common delays buyers should budget for:
- **Cut-off missed** — containers must arrive at gate 24-48h before vessel departure
- **Document errors** — incorrect HS code, wrong Incoterm, missing C/O
- **Customs exam** — random X-ray or physical inspection adds 1-3 days
- **Port congestion** — rare but happens during peak season (Oct-Dec)

## Working with Freight Forwarders

Most Thai exporters use a freight forwarder (ตัวแทนขนส่ง) to handle booking, documentation, and port coordination. Fees: $100-300 per FCL. For first-time importers, using an experienced forwarder with Laem Chabang experience is strongly recommended.

Browse [logistics and 3PL suppliers](/c/logistics) in our directory or [warehouse operators near Laem Chabang](/c/warehouse) for bonded storage options.`,
    related: ["eastern-seaboard-by-the-numbers", "chon-buri-vs-rayong-manufacturing"],
  },
];

// 합본 export. published desc — 신규 자동 글이 위로 오게.
export const POSTS: Post[] = [...POSTS_MANUAL, ...POSTS_AUTO].sort(
  (a, b) => (a.published < b.published ? 1 : -1),
);

export function findPost(slug: string): Post | null {
  return POSTS.find((p) => p.slug === slug) ?? null;
}

// 단순 markdown → HTML 변환 (h2 + 단락 + 리스트만 지원).
export type Block =
  | { type: "h2"; content: string }
  | { type: "p"; content: string }
  | { type: "ul"; content: string[] }
  | { type: "table"; content: { header: string[]; rows: string[][] } };

function parseTableRow(line: string): string[] {
  return line.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}

function isTableSeparator(line: string): boolean {
  return /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line);
}

export function renderBody(body: string): Block[] {
  const blocks: Block[] = [];
  const lines = body.split("\n");
  let buf: string[] = [];
  let mode: "p" | "ul" | "table" | null = null;
  let tableHeader: string[] | null = null;

  const flush = () => {
    if (buf.length === 0 && mode !== "table") { mode = null; return; }
    if (mode === "ul") blocks.push({ type: "ul", content: buf });
    else if (mode === "p") blocks.push({ type: "p", content: buf.join(" ") });
    else if (mode === "table" && tableHeader) {
      blocks.push({ type: "table", content: { header: tableHeader, rows: buf.map(parseTableRow) } });
    }
    buf = [];
    tableHeader = null;
    mode = null;
  };

  for (const line of lines) {
    const t = line.trim();
    if (!t) { flush(); continue; }
    if (t.startsWith("## ")) {
      flush();
      blocks.push({ type: "h2", content: t.slice(3) });
      continue;
    }
    if (t.startsWith("- ")) {
      if (mode !== "ul") flush();
      mode = "ul";
      buf.push(t.slice(2));
      continue;
    }
    if (t.startsWith("|") && t.endsWith("|") && t.length > 2) {
      if (isTableSeparator(t)) {
        if (mode === "table" && buf.length === 1) {
          tableHeader = parseTableRow(buf[0]);
          buf = [];
        }
        continue;
      }
      if (mode !== "table") flush();
      mode = "table";
      buf.push(t);
      continue;
    }
    if (mode !== "p") flush();
    mode = "p";
    buf.push(t);
  }
  flush();
  return blocks;
}

// markdown link [text](url) → <a> 변환.
export function inlineMd(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-emerald-700 hover:underline">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}
