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
