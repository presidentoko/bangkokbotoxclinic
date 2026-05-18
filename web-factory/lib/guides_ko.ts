// 한국어 가이드 — 한국 SME buyer 관점. 영문 가이드의 단순 번역 X.

import type { Guide } from "./guides";

export const GUIDES_KO: Guide[] = [
  {
    slug: "korea-sme-thai-oem-process",
    title: "한국 SME가 태국 OEM 직거래로 발주하는 5단계 절차",
    metaTitle: "태국 OEM 직거래 절차 — 한국 SME 5단계 가이드",
    metaDescription:
      "한국 중소기업이 소싱 에이전트 마진(15-30%) 빼고 태국 공장에 직접 발주하는 5단계. 후보군 검색 → RFQ → 견적 비교 → 샘플 → 첫 PO. 실전 체크리스트.",
    updated: "2026-05-09",
    intro:
      "태국 OEM은 동남아에서 가장 성숙한 제조 클러스터. 한국 소싱 에이전트는 보통 견적에 15-30% 마크업을 붙입니다. 첫 발주거나 복잡한 다공급사 프로젝트면 그 비용이 합리적이지만, 단일 SKU·반복 발주·공급사가 영어 응대 가능하면 직거래가 매번 마진 누적. 이 가이드는 실전 5단계를 정리합니다.",
    sections: [
      {
        heading: "1단계 — 신뢰도 기반 후보군 작성",
        body:
          "Alibaba 검색 X. 트레이드쇼 명함 X. 출발점은 공개 Google Business Profile 데이터에 신뢰도 점수(평점 + 리뷰 수 log scale)를 적용한 디렉토리. " +
          "Thai Supply Hub 같은 곳에서 카테고리(Manufacturer / Auto Parts / Industrial Estate / Warehouse) + 지역(Chon Buri / Rayong / Pathum Thani — 동부해안 클러스터)으로 필터. " +
          "Trust Score 70-85 구간이 대개 5-10년 운영 + 공개 리뷰 충분. 50 미만은 신생 또는 비검증. 카테고리당 5-10곳 후보군 만들기.",
      },
      {
        heading: "2단계 — 영문 RFQ 1차 메일",
        body:
          "국제 발주를 받는 태국 제조사 대부분 영어 응대 sales 직원 1명 이상 보유. 첫 메일은 200단어 이하로: " +
          "(1) 회사 2-3줄 소개 (한국에서 어떤 일 하는 회사인지) " +
          "(2) 발주 카테고리 + 제품 (정확하게) " +
          "(3) 예상 발주량 (연간 또는 월간) " +
          "(4) 핵심 3 질문 — 리드타임, MOQ, 샘플 가능 여부. " +
          "스펙 시트 PDF 1장 첨부하면 응답률 ↑. 신뢰도 70+ 공급사 응답률은 보통 60-80% (48시간 내).",
      },
      {
        heading: "3단계 — 견적 비교 (가격만 아님)",
        body:
          "3-5곳에서 견적 받으면 비교 항목: 단가, MOQ, 리드타임, 샘플 비용 + 일정, 결제 조건(첫 거래는 T/T 30% 선결제 + 70% 출하 전이 표준), Incoterm (FOB Laem Chabang vs CIF 인천), 인증(ISO 9001, IATF 16949 자동차, HACCP/FSSC 22000 식품, RoHS/REACH 전자). " +
          "단가가 5% 비싸도 리드타임 60% 짧고 샘플 1주일 내 가능한 곳이 첫 발주에서는 거의 항상 정답. 첫 거래는 신속성과 응답성이 가격보다 비용 절감 큼.",
      },
      {
        heading: "4단계 — 샘플 → 공장 방문 → 첫 PO",
        body:
          "최종 후보 2-3곳에서 유료 샘플 발주. 무료 샘플 요구하지 마세요 — 동남아 사기는 대부분 이 단계에서 잡힘 (샘플 없이 큰 선결제 요구하는 곳은 즉시 후보군 제외). " +
          "USD 20,000 이상 또는 반복 거래는 공장 방문 권장. 한국어 통역 동행이 어려우면 태국어/영어 통역 1일 USD 50-100. 반나절 site walk 만으로도 QC 시그널의 80%는 잡힘. 사진 찍을 곳: 기계 컨디션(modern vs outdated), 창고 정리상태, QC 검사대, 포장 영역. " +
          "첫 PO는 의도한 연 발주량의 10-20% 규모로. 결제 조건은 buyer 우호적으로(T/T 30/70, 70%는 QC 합격 후 출하 직전). 신뢰 쌓이면 점진적으로 확대.",
      },
      {
        heading: "5단계 — 한국→태국 logistics + 통관",
        body:
          "FOB Laem Chabang 또는 FOB Bangkok Port가 가장 흔함. 컨테이너 운임은 부산항까지 보통 5-9일. 통관은 한국에서 받는 거고 별도 한국 관세사 사용 권장 (HS 코드 분류, FTA 활용 — 한-아세안 FTA로 다수 품목 관세 인하). " +
          "샘플 발주는 항공으로 (Suvarnabhumi → 인천 24시간 도어투도어). 본 발주는 LCL/FCL 컨테이너. 첫 거래는 신뢰할 수 있는 한국 포워더 필요 — Pantos, CJ Logistics, Glovis 같은 대형 또는 중소 전문 포워더.",
      },
      {
        heading: "흔한 함정",
        body:
          "100% 선결제 X — 리뷰 200+ 있는 공급사라도. T/T 30/70이 신규 buyer의 산업 표준. " +
          "Incoterm 모호하게 두지 말기. EXW vs FOB vs CIF 명확히. " +
          "구두 리드타임 X — Proforma Invoice(PI)에 서면으로. " +
          "검증 안 된 WhatsApp/LINE 연락처 사용 X — 공급사 공식 웹사이트 또는 전화 (Thai Supply Hub 같은 디렉토리에서 확인 가능)로 첫 컨택. " +
          "한국에서 자주 일어나는 사례: 카카오톡으로만 거래하는 '에이전트' — 태국 공장의 실제 직원이 아닐 가능성 매우 높음.",
      },
    ],
    faqs: [
      {
        q: "태국 공급사 다 영어로 응대 가능한가요?",
        a: "전부는 아닙니다. 국제 발주를 받는 곳 — Tier 1 OEM, 대형 산단 입주사, 영문 웹사이트 있는 모든 곳 — 은 영어 sales 직원 보유. 영문 웹사이트가 없는 작은 도메스틱 전용 공급사는 영어 약하거나 안 됩니다.",
      },
      {
        q: "에이전트 vs 직거래 어떤 게 더 빨라요?",
        a: "직거래: 첫 RFQ → 첫 PO까지 4-8주 (RFQ → 견적 → 샘플 → 계약 → 발주). 에이전트: 3-6주 (후보군은 빠르지만 계약 협상 늦어짐). 반복 발주는 직거래가 빠름.",
      },
      {
        q: "에이전트 적정 수수료는?",
        a: "단일 공급사 단순 SKU: 5-10% 정상. RFQ + QC + 물류 풀서비스: 10-20%. 화이트라벨 또는 비영어 사용자 대상: 25-30%. 단일 공급사 단순 발주에 15% 이상은 과도. 한국 소싱 에이전트들이 보통 20-30% 청구하는 이유는 한국어 응대 + 한국식 결제 흐름 처리 비용을 포함하기 때문.",
      },
      {
        q: "Alibaba에서 태국 공급사 검색하면 안 되나요?",
        a: "Alibaba의 태국 supplier listing은 중국 listing 대비 약합니다. 검증 공급사 적고, 에이전트 재상장 많고, 컨택 마찰 큼. 태국 소싱은 Google Business Profile 데이터 + 직접 전화/이메일이 Alibaba보다 검증된 공장 찾기에 효율적입니다.",
      },
      {
        q: "한국 부가세 처리는?",
        a: "수입 VAT는 인천 통관 시 발생 (10% 부가세). 환급 가능한 사업자라면 매입세액으로 처리. 직거래라도 통관·VAT는 한국 측에서 별개로 처리되며 공급사 가격에 영향 없음.",
      },
    ],
    related: ["korea-sme-amata-wha-comparison"],
  },
  {
    slug: "korea-sme-amata-wha-comparison",
    title: "한국 기업 태국 진출 — Amata vs WHA vs Pinthong vs Rojana 산단 비교",
    metaTitle: "태국 산단 입주 비교 — Amata vs WHA vs Pinthong vs Rojana (한국 기업)",
    metaDescription:
      "한국 SME가 태국 동부해안 산업단지 입주 검토 시 4대 산단 비교. 임대료, 한국 기업 입주 현황, 인프라 모델, 항만 접근성. 결정 트리 포함.",
    updated: "2026-05-09",
    intro:
      "포스코·LG화학·삼성SDI·SK 같은 대기업이 태국 동부해안에 입주한 후 한국 협력사·SME들도 점차 따라가는 추세. 4대 산단 운영사 (Amata · WHA · Pinthong · Rojana) 의 차이를 한국 입주 검토 관점으로 정리합니다.",
    sections: [
      {
        heading: "Amata — 인프라 자체 보유 모델",
        body:
          "Amata City Chonburi와 Amata City Rayong이 주력 산단. 특징: 산단 운영사가 인프라(전력 변전소·상수원·폐수처리)를 직접 보유·운영. 일반적으로 IEAT(태국 산단공사) 인프라에 의존하는 모델보다 인프라 안정성 높음. " +
          "한국 입주 현황: 포스코 태국 (Amata City Rayong), 한국 자동차 부품사 다수 (Amata Chonburi). " +
          "장점: 인프라 다운타임 낮음, 일본·한국 기업 입주율 높아 협력사·인력 풀 좋음. " +
          "단점: 임대료 가장 비싼 편 (THB 280-320/sqm/월).",
      },
      {
        heading: "WHA (구 Hemaraj) — 면적 1위, 입주사 다양",
        body:
          "2015년 Hemaraj 인수 후 11개 산단 약 7,800ha. 태국 1위 면적. " +
          "한국 입주 현황: SK 화학 (WHA Eastern Seaboard 2 일부), LG 디스플레이 (북부 산단). 다양한 한국 협력사 분산 입주. " +
          "특징: 입주 산업 다양 — Tier 1 자동차(AGC, Toyoda Gosei) + 석유화학(Map Ta Phut 인접) + 전자 + 식품 + logistics(WHA Logistics Park 2). " +
          "장점: 다공급사 소싱이 한 산단 내 가능. 3PL 창고 풍부. " +
          "단점: 산단 마다 인프라 모델·관리 수준 차이 있음 — 구체적 lot 별 검토 필요.",
      },
      {
        heading: "Pinthong — Sriracha 항만 인접, 자동차 강세",
        body:
          "Pinthong Industrial Estate 1-5, Bowin 지역. Laem Chabang 컨테이너 항만까지 트럭 30분 이내. " +
          "한국 입주 현황: 자동차 부품 OEM 다수 (한국 Tier 2 자동차 부품 진출 주요 거점). " +
          "장점: 수출 logistics 비용 가장 낮음. 일본 자동차 OEM 협력사 클러스터로 인력 풀·설비 노하우 풍부. " +
          "단점: 자동차 외 업종에는 불필요한 인프라 비용. 임대료 중상위.",
      },
      {
        heading: "Rojana — 분산 footprint, Ayutthaya/Prachinburi",
        body:
          "동부해안 외 Ayutthaya와 Prachinburi에 강한 입지. " +
          "한국 입주 현황: 한국 식품·화장품·소비재 ODM 다수 (Rojana Ayutthaya, Rojana Prachinburi). 가전 한국 공급사 일부 (Sony 인접). " +
          "장점: 동부해안 임금 상승 + 인력난 회피 가능. 방콕에서 1시간 (Ayutthaya) — 임원진·R&D 출장 효율. 임대료 가장 낮음 (THB 180-240/sqm/월). " +
          "단점: Laem Chabang 항만 거리 2-3시간 — 컨테이너 수출 비용 높음. Eastern Seaboard 일본 OEM 클러스터 효과 누리기 어려움.",
      },
      {
        heading: "한국 SME 입주 결정 트리",
        body:
          "(1) 자동차 부품 OEM/Tier 2 → Pinthong 또는 Amata Chonburi (일본 OEM 인접). " +
          "(2) 석유화학·정밀화학 → WHA Eastern Seaboard (Map Ta Phut 인접) 또는 Amata Rayong. " +
          "(3) 식품·화장품·ODM → Rojana Ayutthaya 또는 Prachinburi (방콕 인접 + 임대료 낮음). " +
          "(4) 전자·전기 → WHA 또는 Amata. " +
          "(5) 3PL/창고 → WHA Logistics Park 2. " +
          "(6) 인프라 다운타임 risk 회피 우선 → Amata. " +
          "(7) 임대료 우선 → Rojana 또는 외곽 WHA. " +
          "방문 없이 결정하지 마세요. 최소 2개 산단은 직접 보고 leasing office와 면담.",
      },
      {
        heading: "BOI 인센티브 활용",
        body:
          "어느 산단이든 BOI(Thailand Board of Investment) 통해 5-8년 법인세 면제 + 기계 수입관세 면제 받을 수 있음. 산단 자체가 인센티브 주는 게 아니라 BOI에 별도 신청. " +
          "한국 SME가 자주 놓치는 것: BOI 인센티브 받으려면 신청서를 영어로 작성 + 사업계획 + 기술적 fit을 BOI 카테고리에 맞춰야. 한국 회계법인의 태국 BOI consulting 부서를 통하는 게 일반적.",
      },
    ],
    faqs: [
      {
        q: "한국 기업이 태국 산단 입주할 때 가장 많이 가는 곳은?",
        a: "자동차 부품: Pinthong, Amata Chonburi. 화학: Map Ta Phut + WHA Eastern Seaboard. 식품/소비재: Rojana Ayutthaya. 전자: WHA, Amata. 대기업의 동선을 따라가는 패턴이 가장 일반적.",
      },
      {
        q: "임대 vs 매입 어떤 게 일반적인가요?",
        a: "신규 입주는 거의 모두 임대(land lease 30년 + 옵션 또는 ready-built factory 임대). 매입은 BOI 인센티브 fit이 안 되거나 30년 이상 운영 확신할 때만. 한국 SME 입주는 99% 임대.",
      },
      {
        q: "한국어 leasing 직원 있는 산단은?",
        a: "Amata와 WHA는 일본어/한국어 leasing 팀 별도 운영 (한국·일본 입주사 비중이 큼). Pinthong과 Rojana는 영어만 가능한 경우가 많음. 한국어 응대 필요하면 Amata나 WHA가 우선.",
      },
      {
        q: "초기 비용 (CapEx) 어느 정도 봐야 하나요?",
        a: "Ready-built factory 1,500-3,000 sqm 임대 + 기본 설비 셋업 + 직원 채용 + 등록 비용 합쳐서 USD 200K-500K 가 신규 입주 기본 CapEx. 대형 manufacturing 셋업은 USD 1M+. BOI 인센티브로 기계 수입 관세 절감 가능.",
      },
      {
        q: "한국 본사 vs 태국 법인 어떻게 운영하나요?",
        a: "대부분 한국 본사 100% 자회사로 태국 법인 설립. 태국 법은 외국인 100% 지분 일부 업종 제한 있지만 BOI 승인 사업이면 100% 외국인 보유 가능. 태국 ROE 회계 + 본사 합산은 한국 회계법인 태국 desk 활용이 표준.",
      },
    ],
    related: ["korea-sme-thai-oem-process"],
  },
];

export function findGuideKo(slug: string): Guide | null {
  return GUIDES_KO.find((g) => g.slug === slug) ?? null;
}
