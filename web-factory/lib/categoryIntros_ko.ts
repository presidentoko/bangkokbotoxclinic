// 한국어 카테고리별 intro — 한국 buyer 관점. 단순 번역 X.
// 한국 SME가 태국 소싱할 때 검색하는 키워드 (태국 OEM, 자동차 부품 제조사 등) 자연스럽게.

import type { CategoryIntro } from "./categoryIntros";

export const CATEGORY_INTROS_KO: Record<string, CategoryIntro> = {
  manufacturer: {
    title: "태국 제조사 / OEM 디렉토리",
    metaTitle: "태국 제조사 OEM 디렉토리 — 직거래용 신뢰도 점수",
    metaDescription:
      "태국 제조사 디렉토리. 자동차·전자·식품·플라스틱·화학·포장 OEM. 신뢰도 점수 + 직접 연락처 — 소싱 에이전트 마진 빼고.",
    intro:
      "태국은 ASEAN 최대 제조 기지. 한국 SME가 OEM/ODM 발주할 때 가장 자주 보는 카테고리입니다. 신뢰도 점수(공개 Google 평점 + 리뷰 수)로 정렬 — 5-10년 운영 + 공개 검증 가능한 곳들이 위로.",
    longContext:
      "이 페이지의 제조사들은 Apify로 수집한 공개 Google Business Profile 데이터에 우리 B2C 차단 필터를 적용한 결과입니다. 매장·소매점·factory outlet 몰 같은 노이즈는 자동 제거. 진짜 B2B 제조 사업자만 남아있습니다.",
  },
  auto_parts: {
    title: "태국 자동차 부품 제조사 / Tier 1 OEM",
    metaTitle: "태국 자동차 부품 제조사 — Aisin · AGC · Toyoda Gosei",
    metaDescription:
      "태국 Tier 1 / Tier 2 자동차 부품 제조사. AISIN, AGC, Toyoda Gosei, Summit, Thai Summit Harness. 동부해안 클러스터 매핑.",
    intro:
      "태국은 세계 10위 자동차 생산국. Toyota·Honda·Mitsubishi·Isuzu·Mazda·Nissan 본플랜트 + Tier 1/2 협력사 생태계가 동부해안에 집중. 한국 자동차 부품 buyer가 태국 소싱할 때 1순위 카테고리.",
    longContext:
      "Tier 1 OEM (AISIN/AGC/Denso 등)은 보통 long-term OEM 계약 only — 일반 buyer 소량 발주 거의 안 받음. Tier 2/3 (정밀 가공·플라스틱·금속·고무)이 한국 buyer 직거래 가능 영역.",
  },
  industrial_estate: {
    title: "태국 산업단지 — Pinthong, Amata, WHA, Rojana",
    metaTitle: "태국 산업단지 비교 — Pinthong / Amata / WHA / Rojana",
    metaDescription:
      "태국 4대 산업단지 운영사 비교. 입주 검토 + 임대 + BOI. 한국 SME 진출 가이드와 함께.",
    intro:
      "태국 산업단지는 입주 + 인프라 + BOI 인센티브의 패키지. 4대 운영사 (Pinthong / Amata / WHA-Hemaraj / Rojana)가 동부해안 본단을 차지. 한국 기업 진출 기지로 가장 많이 검토되는 영역.",
    longContext:
      "각 운영사의 특징이 다릅니다. Pinthong은 항만 인접, Amata는 인프라 자체 보유, WHA는 면적 1위, Rojana는 분산형(아유타야/Prachin Buri까지). 사업 특성에 맞춰 선택. 자세한 비교는 한국어 가이드(/ko/guide/korea-sme-amata-wha-comparison) 참고.",
  },
  warehouse: {
    title: "태국 창고 / 3PL — Eastern Seaboard 물류 거점",
    metaTitle: "태국 창고 임대 + 3PL — 동부해안 물류 디렉토리",
    metaDescription:
      "태국 동부해안 창고. Sriracha · Bowin · Bang Lamung — Laem Chabang 항구 30-45분 거리. 임대료 150-280바트/㎡/월.",
    intro:
      "태국 컨테이너 수출의 ~75%가 Laem Chabang 항구를 통과. 동부해안 제조사들이 직거래하려면 인근 창고/3PL 필수. 한국 buyer 입장에서 통관·운송 효율 직결.",
  },
  logistics: {
    title: "태국 물류 / 3PL 디렉토리",
    metaTitle: "태국 3PL 물류 회사 — DHL · Linfox · Yusen · Kerry",
    metaDescription:
      "태국 3PL 물류 회사 디렉토리. DHL Supply Chain · Linfox · Yusen · Kerry · Whale Logistics. 동부해안 manufacturing 공급망.",
    intro:
      "태국 manufacturing 수출 절대 다수가 Laem Chabang 컨테이너 항구 + Suvarnabhumi 항공 화물 통과. 3PL 운영사가 창고 + 운송 + 통관 풀서비스. 한국 buyer는 보통 영문 응대 가능한 인터내셔널 3PL을 선호.",
  },
  packaging: {
    title: "태국 포장 제조사 — 종이박스 · 플라스틱 · 연질포장",
    metaTitle: "태국 포장 제조사 — 종이박스 / 플라스틱 / 연질포장 OEM",
    metaDescription:
      "태국 포장 제조사. 종이박스 · 플라스틱 사출 · 연질포장 · 산업용 포장. 식품 / 자동차 / 전자 export 공급망.",
    intro:
      "태국 포장 산업은 식품·자동차·전자 export 공급망에 직접 연결. 종이박스 인쇄 (2-6 색 flexo), 플라스틱 사출/블로우, 연질포장 라미네이트 — 한국 식품·소비재 buyer가 ASEAN 진출 시 자주 사용.",
  },
  food_mfg: {
    title: "태국 식품 제조사 — 냉동 / 가공식품 / OEM",
    metaTitle: "태국 식품 제조사 — HACCP / FSSC 22000 / 할랄 OEM",
    metaDescription:
      "태국 식품 제조사. 냉동 해산물 · 닭고기 · 가공식품 · 스낵 · 음료. HACCP / FSSC 22000 / 할랄 인증 디렉토리.",
    intro:
      "태국은 가공식품 세계 3대 수출국. HACCP / GMP / FSSC 22000 표준 + 할랄 인증 병행 라인 보편. 한국 식품 buyer 입장에서 ASEAN OEM 1순위 발주처.",
  },
  electronics: {
    title: "태국 전자 제조사 — HDD · EMS · PCB",
    metaTitle: "태국 전자 제조사 — HDD · EMS · PCB · 자동차 전자",
    metaDescription:
      "태국 전자 제조사. Western Digital / Seagate HDD 생태계, EMS 컨트랙트 제조, PCB 양산, 자동차 전자.",
    intro:
      "태국은 세계 2위 HDD 생산국 + ASEAN EMS 컨트랙트 제조 거점. Pathum Thani / Ayutthaya 클러스터에 Western Digital, Seagate 본플랜트 + Tier 2 부품. 한국 buyer가 자동차 전자 grade(IATF 16949)에서 강점.",
  },
  chemical: {
    title: "태국 화학 제조사 — Map Ta Phut 석유화학 + Specialty",
    metaTitle: "태국 화학 제조사 — Map Ta Phut · PTT · IRPC · SCG",
    metaDescription:
      "태국 화학 제조사. Map Ta Phut 석유화학 + 다운스트림 specialty + 산업용 화학.",
    intro:
      "태국 화학 산업의 핵심은 라용 Map Ta Phut Industrial Estate — 동남아 최대 석유화학 단지. PTT, IRPC, PTTGC, SCG Chemicals 통합 콤플렉스 + 다운스트림 specialty 운영사. 한국 화학 buyer 핵심 거점.",
  },
  plastic: {
    title: "태국 플라스틱 가공 제조사",
    metaTitle: "태국 플라스틱 사출 제조사 — 자동차 / 포장 / 소비재",
    metaDescription:
      "태국 플라스틱 사출 / 블로우 / 시트 가공 제조사. 자동차 OEM + 포장 + 소비재 supply.",
    intro:
      "태국 플라스틱 가공은 자동차·포장·소비재 supply 중심. 동부해안 (자동차 OEM 인접) + Pathum Thani 2개 cluster. 한국 buyer가 OEM 사출 발주할 때 Tier 2/3 영역.",
  },
  steel: {
    title: "태국 철강 / 금속 가공",
    metaTitle: "태국 철강 제조사 + 금속 가공 — SCG / Daido / 정밀",
    metaDescription:
      "태국 철강 mill (SCG · Tata · SSI · Daido) + 정밀 금속 가공. 사라부리 중공업 + 동부해안 정밀 가공 cluster.",
    intro:
      "태국 철강·금속은 사라부리 (SCG 중심 중공업) + 동부해안 (자동차 정밀 가공) 2개 cluster. 한국 자동차 부품 buyer가 도면 기반 정밀 가공 발주에 자주 사용.",
  },
  machining: {
    title: "태국 정밀 가공 — CNC · EDM · 기계 가공",
    metaTitle: "태국 정밀 가공 제조사 — CNC · EDM · 기계 부품",
    metaDescription:
      "태국 CNC · EDM · 정밀 기계 가공. Tier 2/3 자동차 supply chain backbone.",
    intro:
      "태국 정밀 가공은 자동차 Tier 2/3 supply chain의 backbone. 동부해안 (Toyota·Honda·Mitsubishi 협력사 생태계) + Pathum Thani / Samut Sakhon 2개 cluster. 한국 OEM도면 발주에 적합.",
  },
  equipment: {
    title: "태국 산업 설비 / 공장 장비 공급사",
    metaTitle: "태국 산업 설비 공급사 — 공장 자동화 · 기계",
    metaDescription:
      "태국 산업 설비 공급사. 공장 자동화 · 기계 · 공구 · 포장 설비 디스트리뷰터 네트워크.",
    intro:
      "태국 산업 설비 공급사는 모든 주요 산단의 입주 제조사 supply 담당. 동부해안 분점이 빠른 출고에 유리. 한국 기업이 태국 진출 시 설비 셋업 단계에서 자주 사용.",
  },
  corporate_office: {
    title: "태국 기업 본사 / R&D 거점",
    metaTitle: "태국 기업 본사 디렉토리 — 방콕 + Eastern Seaboard",
    metaDescription:
      "태국 제조사 본사 + R&D 거점. 방콕 (상업·재무) + 동부해안 (생산). B2B 파트너십 + 조달 문의 직접 라우팅.",
    intro:
      "태국 제조사 본사는 보통 방콕 (commercial/finance) + 동부해안 (production) 분리. B2B 조달·전략 파트너십 문의는 본사 컨택이 plant보다 빠름. 한국 buyer 의 Strategic Partnership / 한국 진출 등 협상은 corporate office가 정문.",
  },
  factory: {
    title: "태국 공장 디렉토리",
    metaTitle: "태국 공장 디렉토리 — 검증된 산업 운영사",
    metaDescription:
      "태국 공장 디렉토리. B2C factory outlet 매장 노이즈 자동 차단. 진짜 산업 운영사 + 신뢰도 점수.",
    intro:
      "이 카테고리의 공장들은 B2C 'factory outlet' 매장 (쇼핑몰)과 분리된 진짜 산업 운영사입니다. 카테고리 필터링으로 노이즈 자동 제거.",
  },
  rubber: {
    title: "태국 고무 제품 — 천연고무 · 라텍스 · 산업용",
    metaTitle: "태국 고무 제품 제조사 — 라텍스 · 천연고무 · 산업용",
    metaDescription:
      "태국 고무 제품 제조사. 라텍스 글러브 · 천연고무 (Sri Trang) · 산업용 고무 · 자동차 고무 부품.",
    intro:
      "태국은 세계 1위 천연고무 생산국. 업스트림 가공은 남부 (송클라/핫야이), 다운스트림 고무 제품은 동부해안 자동차 supply chain. 한국 medical/automotive 고무 buyer 거점.",
  },
  textile: {
    title: "태국 섬유 / 의류 OEM",
    metaTitle: "태국 의류 OEM — 패션 / 기능성 섬유 / 작은 MOQ",
    metaDescription:
      "태국 의류 OEM. 베트남/중국 대비 작은 MOQ + 빠른 샘플 + 영어 응대 강점. 패션 / 기능성 섬유 / 스포츠웨어.",
    intro:
      "태국 섬유·의류 OEM은 베트남·중국 대비 규모는 작지만 작은 MOQ + 기능성 섬유 + 빠른 샘플 사이클이 강점. 한국 패션 brand 신규 SKU 출시에 자주 사용.",
  },
  machinery: {
    title: "태국 기계 제조사 — 산업 장비",
    metaTitle: "태국 기계 제조사 — 생산 라인 / 컨베이어 / 포장 기계",
    metaDescription:
      "태국 도메스틱 기계 제조사. 생산 라인 장비 · 컨베이어 시스템 · 포장 기계.",
    intro:
      "태국 도메스틱 기계 제조사는 태국 broader manufacturing 기지를 supply — 생산 라인 장비, 컨베이어, 포장 기계. 방콕 + 동부해안 cluster.",
  },
  exporter: {
    title: "태국 수출 전문 공급사",
    metaTitle: "태국 수출 전문 공급사 — 직거래 B2B",
    metaDescription:
      "태국 수출 전문 공급사 — 국제 sales 채널 보유. 한국·일본·미국 buyer 직거래 가능.",
    intro:
      "이 카테고리의 공급사들은 국제 sales 채널을 명시적으로 운영. 한국·일본·미국 buyer가 직거래 채널로 가장 빠르게 들어가는 진입점.",
  },
};

export function findCategoryIntroKo(slug: string): CategoryIntro | null {
  return CATEGORY_INTROS_KO[slug] ?? null;
}
