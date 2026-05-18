// 한국어 블로그 — 한국 buyer 관점. 단순 번역 X.

import type { Post } from "./posts";

export const POSTS_KO: Post[] = [
  {
    slug: "korean-sme-thai-entry-pattern",
    title: "한국 SME 태국 진출 — 대기업이 먼저 가고 협력사가 따라가는 구조",
    metaTitle: "한국 SME 태국 진출 패턴 — 포스코 LG 삼성 + 협력사 클러스터",
    metaDescription:
      "한국 대기업이 태국 산단에 들어가면 협력사 SME가 따라가는 패턴. 포스코 라용, LG 화학, 삼성 SDI 사례.",
    category: "한국 SME",
    published: "2026-05-10",
    body: `한국 SME가 태국에서 OEM 발주가 아닌 **현지 법인 설립**을 검토할 때 — 패턴이 정해져 있습니다. 대기업이 먼저 진입한 산단에 협력사가 따라가는 클러스터 효과.

## 대기업 진출 사례 매핑

- **포스코 (POSCO)**: Amata City Rayong 본단. 자동차 강판 + 코일. Tier 1 자동차 (Toyota Thailand) 인접 supply.
- **LG 화학 (LG Chem)**: Map Ta Phut petrochemical complex 진출. PTT, IRPC 인접.
- **LG 이노텍**: Pathum Thani 또는 Rayong 검토 (전자 BOM supply).
- **삼성 SDI / 삼성 전기**: 동부해안 + Pathum Thani.
- **SK 하이닉스**: HDD 생태계 (Pathum Thani / Ayutthaya).
- **현대 / 기아**: Eastern Seaboard 자동차 협력사 진출 검토 단계.

## 협력사 SME가 따라가는 구조

대기업이 산단에 입주 결정 → 자체 supply 검증된 협력사 SME 가 옆 lot 임대 → 인근 한국 식당·교민 인프라 형성 → 비대기업 SME 도 같은 산단을 우선 검토.

이 효과로 **Amata Rayong (포스코), Map Ta Phut (LG 화학), Eastern Seaboard 자동차 산단**이 한국 SME 진출의 1순위 옵션이 됨.

## 한국 SME가 직접 결정해야 할 것

대기업 옆에 무조건 가는 게 정답이 아닙니다.

- **자동차 부품 OEM**: 일본계 OEM (Toyota/Honda) 협력사라면 **Pinthong / Amata Chonburi** 우선.
- **화학·정밀화학**: Map Ta Phut feedstock 인접이 결정적.
- **소비재 ODM (식품/화장품/생활용품)**: 동부해안 비싼 임대 피하고 **Rojana Ayutthaya / Prachinburi** 검토.
- **전자**: HDD 생태계면 Pathum Thani, EMS 면 동부해안.

자세한 산단 비교는 [Amata vs WHA vs Pinthong vs Rojana 가이드](/ko/guide/korea-sme-amata-wha-comparison) 참고.

## BOI 인센티브

어느 산단이든 BOI(Thailand Board of Investment) 통해 5-8년 법인세 면제 + 기계 수입 관세 면제 가능. SME 가 자주 놓치는 점: 신청서 영문, 사업계획 + 기술적 fit 을 BOI 카테고리에 맞춰 정렬해야. 보통 한국 회계법인의 태국 BOI desk 통해 신청 (수수료 5-20만 바트 / 프로젝트).`,
    related: ["amata-vs-wha-quick-take", "tier1-japanese-oem-thailand-overview"],
  },
  {
    slug: "amata-vs-wha-quick-take",
    title: "Amata vs WHA — 한국 SME 입장에서 무엇이 다른가",
    metaTitle: "Amata vs WHA Industrial Estate — 한국 SME 입주 비교",
    metaDescription:
      "Amata 와 WHA 의 실제 차이 — 인프라 모델, 입주사 mix, 임대료, 한국 buyer 관점 의사결정 트리.",
    category: "산단 비교",
    published: "2026-05-10",
    body: `한국 SME 가 태국 동부해안 산단 입주 검토할 때 가장 많이 비교하는 두 운영사 — Amata 와 WHA. 외부에서는 비슷해 보이지만 실제로는 운영 모델이 꽤 다릅니다.

## Amata — 인프라 자체 보유

전력 변전소, 상수원, 폐수 처리 — Amata 가 직접 운영. IEAT(태국 산단공사) 인프라 의존 모델보다 인프라 안정성 ↑.

- **장점**: 인프라 다운타임 낮음. 일본·한국 입주율 높아 협력사 풀 좋음.
- **단점**: 임대료 가장 비싼 편 (THB 280-320 / sqm / 월).
- **한국 입주**: 포스코 (Amata City Rayong), 한국 자동차 부품사 다수 (Amata Chonburi).

## WHA (구 Hemaraj) — 면적 1위

2015년 Hemaraj 인수 후 11개 산단 약 7,800ha. 태국 1위 면적.

- **장점**: 입주 산업 다양 (Tier 1 자동차 + Map Ta Phut 인접 화학 + 전자 + 식품 + 3PL). 다공급사 소싱 한 산단 안에서 가능.
- **단점**: 산단마다 인프라 모델·관리 수준 차이 — lot 별 검토 필요.
- **한국 입주**: SK (WHA Eastern Seaboard 일부), LG 디스플레이.

## 의사결정 트리 (한국 SME 관점)

- **자동차 부품 (일본 OEM 협력)** → Amata Chonburi (일본계 클러스터 효과)
- **인프라 다운타임 회피 우선** (capex-heavy operation) → Amata
- **화학·석유화학** → WHA Eastern Seaboard 2 (Map Ta Phut 인접)
- **3PL / 창고 / 로지스틱스** → WHA Logistics Park 2
- **다공급사 한 산단 내 소싱** → WHA
- **임대료 우선** → WHA 외곽 산단 또는 Rojana Ayutthaya

## 임대료 차이는 결정적이지 않다

Amata flagship (THB 280-320) vs WHA mid-tier (THB 220-260) 차이 = 약 25%. 절대값으로 1,500 sqm RBF 라면 월 60-90만 바트 차이. 30년 누적이면 큼. 하지만:

- 인프라 안정성 / 협력사 클러스터 / leasing office 한국어 응대 같은 비-금액 요소
- BOI 인센티브로 첫 5-8년 법인세 면제됨 — 이게 임대료 차이보다 큰 절감
- 출근 인력 confort / 한국 식당 / 교민 인프라

→ 첫 진출이라면 **2개 산단 직접 방문 + leasing office 와 면담** 권장. 임대료만 보고 결정 X.

자세한 4대 산단 비교는 [한국 SME 산단 비교 가이드](/ko/guide/korea-sme-amata-wha-comparison).`,
    related: ["korean-sme-thai-entry-pattern"],
  },
  {
    slug: "tier1-japanese-oem-thailand-overview",
    title: "태국 Tier 1 일본계 OEM — 누가 무엇을 만드나",
    metaTitle: "태국 Tier 1 일본계 OEM — AISIN AGC Toyoda Gosei Denso",
    metaDescription:
      "태국 자동차 Tier 1 일본계 OEM 8곳 — 무엇을 만들고 누구한테 supply 하는지. 한국 buyer 관점 직거래 가능 영역.",
    category: "Tier 1 OEM",
    published: "2026-05-10",
    body: `태국 자동차 Tier 1 부품사는 거의 일본계. Toyota / Honda / Mitsubishi / Isuzu 본플랜트의 supply chain 이 일본 본사 거래선을 그대로 옮겨온 결과. 한국 buyer 가 자주 만나는 8곳.

## AISIN POWERTRAIN (THAILAND)

Toyota 그룹 Aisin Seiki 의 태국 Tier 1. 자동변속기 (AT) 핵심. Toyota Thailand 본플랜트 단독 supply 가까움. **OEM-only — 일반 buyer 직거래 거의 안 받음.**

## AGC Automotive (Thailand)

아사히글래스 (AGC) 태국 자동차 유리 supply. 윈드실드, 사이드 글래스. Toyota / Honda / Mitsubishi 모두 supply. **Asian aftermarket 으로는 일부 sales — 직거래 검토 가능.**

## Toyoda Gosei (Thailand)

Toyota 그룹 부품사. 고무 / 플라스틱 인테리어 + 기능 부품 (에어백 모듈, 호스, 씰). Toyota / Lexus 본플랜트 단독 supply 가깝지만 일부 spec 은 Honda 등에도 cross-supply. **OEM-tier 직거래 어려움. Tier 2 협력사 통해 소싱이 일반.**

## Denso (Thailand)

전장 시스템 (스타터 / 알터네이터 / 에어컨 컴프레서 / 점화 시스템). Toyota / Honda / Mazda / Suzuki 폭넓게 supply. 글로벌 자동차 부품 1위 그룹 (Bosch / Magna / ZF / Aisin / Denso 5대 그룹). **태국 본플랜트는 OEM. 한국 SME 가 access 하려면 Denso 한국 (지사) 통해 거래선 등록.**

## Toyota Boshoku (Thailand)

자동차 시트 + 인테리어 직물 + 에어 필터. Toyota 본플랜트 직 supply. **OEM-only.**

## Toyota Tsusho (Thailand)

Toyota 그룹 종합상사. 부품 trading + 신규 OEM 거래 routing. **한국 SME 가 Tier 1 거래 새로 트는 채널로 활용 가능 — 토요타 Tsusho 한국 지사 통해 접근.**

## Yazaki (Thailand)

와이어링 하니스 (자동차 전선 다발). 글로벌 1위 와이어 하니스. Toyota / Honda / Mazda supply. **OEM-tier — Tier 2/3 와이어 부품 supply 별도 채널.**

## Bridgestone Manufacturing (Thailand)

타이어 — 자동차 OEM 신차용 + aftermarket. Toyota / Honda / Mazda 신차용 OE supply + 글로벌 aftermarket. **Aftermarket 영역은 일반 buyer 거래 가능.**

## 한국 buyer 가 access 가능한 영역

대부분 Tier 1 은 OEM 단독 supply. 한국 SME 가 직거래로 들어가는 영역은:

- **Aftermarket 부품**: Toyota / Honda 신차 부품의 replacement 시장 — Tier 2/3 협력사가 만든 동일 spec OEM-grade 부품을 aftermarket 명의로 판매.
- **Tier 2 정밀 가공**: 일본 OEM 의 sub-component 발주는 Tier 2 한국·일본 협력사를 통해 들어감.
- **신규 자동차 brand (BYD / MG / 중국 OEM 의 태국 진출)**: 기존 일본 OEM 와는 달리 한국 buyer 와 거래 채널 협상 가능.

자세한 OEM 시스템 가이드는 [태국 자동차 부품 Tier 1/2 영문 가이드](/guide/thai-auto-parts-tier1-tier2).`,
    related: ["korean-sme-thai-entry-pattern", "amata-vs-wha-quick-take"],
  },
  {
    slug: "thailand-vs-vietnam-sourcing-cost",
    title: "태국 vs 베트남 OEM — 단가 비교, 그리고 그 너머",
    metaTitle: "태국 vs 베트남 OEM 발주 비교 — 가격, 품질, 리드타임",
    metaDescription:
      "태국 vs 베트남 OEM 단가 차이 + 그 외 요소. 한국 buyer 가 결정할 때 가격만 보면 안 되는 이유.",
    category: "Sourcing",
    published: "2026-05-10",
    body: `한국 buyer 가 ASEAN OEM 발주 결정할 때 자주 보는 두 옵션 — 태국 vs 베트남. 단가만 비교하면 베트남이 우세하지만 결정은 그렇게 단순하지 않습니다.

## 단가 비교 (러프)

- **인건비**: 태국 1.0× → 베트남 0.5-0.6×.
- **단가 (의류 OEM 기준)**: 태국 1.0× → 베트남 0.7-0.8×.
- **단가 (자동차 부품)**: 태국 1.0× → 베트남 0.85-0.95× (베트남은 자동차 supply chain 깊이가 얕아 차이 작음).
- **단가 (전자 EMS)**: 태국 1.0× → 베트남 0.8× (베트남이 EMS 대규모 OEM 강점).

## 단가 외 요소

### 1) Supply chain 깊이

태국 자동차·전자 supply chain 30+년 누적. Tier 1/2/3 다 있음. 베트남은 10-15년, Tier 1 은 있지만 Tier 2/3 이 얕아 import 의존.

→ **태국 발주는 Tier 2/3 다 태국 안에서 해결**. 베트남 발주는 sub-component 일부 import 비용 + 리드타임.

### 2) MOQ 유연성

베트남 OEM 은 대량 single-SKU 에 강하고 작은 MOQ 에는 약함. 태국은 작은 MOQ (200-500 단위 의류, 1,000-2,000 단위 식품) 받아주는 OEM 더 많음.

→ **신규 SKU 출시 / 패션 브랜드 / 작은 batch 라면 태국 유리**.

### 3) 영어 응대

태국 국제 거래 OEM 의 영어 평균 > 베트남 cost-tier OEM. 한국 SME 가 영어로 RFQ 보낼 때 응답률 / 협상 quality 차이.

### 4) 리드타임

태국 → 부산 컨테이너: 5-9 일. 베트남 → 부산: 3-6 일. 베트남이 약간 빠르지만 태국이 항공으로 갈 때는 Suvarnabhumi 가 24h door-to-door 로 인천 가능 (베트남 노이바이 / 떤 손 녓 비슷한 수준).

→ **컨테이너 시간 차이는 결정적이지 않음**. 어차피 5-9일과 3-6일은 같은 분류.

### 5) BOI / 인센티브

태국 BOI: 5-8년 법인세 면제. 베트남: 4년 면제 + 9년 50% (기업 진출 결정 시). 베트남 인센티브 더 큰 편이지만 행정 처리 복잡.

## 그래서 어디?

- **저단가 commodity 의류 / 신발 / 단순 부품 대량 발주** → 베트남 (단가 우세)
- **자동차 부품 (Tier 2/3 OEM)** → 태국 (supply chain depth)
- **작은 MOQ / 신규 SKU / 패션** → 태국
- **전자 대량 EMS** → 베트남 (단가 + scale)
- **첫 진출 / 영어 응대 우선** → 태국
- **OEM 발주 + 본사 R&D / 한국 출장 빈도** → 태국 (Suvarnabhumi 직항 한국 일 여러 노선 + 비행 5-6h vs 베트남 5-6h 비슷)

## 둘 다 검토하면

한국 SME 가 진짜 큰 발주는 **태국 + 베트남 dual-base** 가 답이 될 수 있음. Amata 같은 운영사는 태국 + 베트남 (하노이) 둘 다 산단 운영 — 한 운영사 통해 dual-base 셋업 가능. 단계적 확장 패턴.`,
    related: ["korean-sme-thai-entry-pattern"],
  },
  {
    slug: "tier1-bangkok-hq-corporate-office-list",
    title: "태국 진출 한국 + 일본 기업 본사 매핑 — 방콕 corporate office",
    metaTitle: "태국 본사 디렉토리 — Toyota Honda LG 포스코 방콕 corporate",
    metaDescription:
      "태국 자동차/화학/전자 OEM 본사 + 한국 대기업 태국 법인 본사 — 방콕 corporate office 매핑. B2B 파트너십 routing 거점.",
    category: "본사 매핑",
    published: "2026-05-10",
    body: `태국 제조 plant 는 동부해안에 있지만 본사·R&D·commercial / 영업 헤드쿼터는 방콕에 집중. B2B 파트너십·전략 협상은 본사 컨택이 plant 보다 빠름. 한국 buyer 가 알아둘 본사 거점.

## 일본계 자동차 OEM 본사 (방콕)

- **Toyota Motor Thailand HQ**: 사뭇쁘라깐 (방콕 동남)
- **Honda Automobile Thailand HQ**: 라차다 (방콕)
- **Mitsubishi Motors Thailand HQ**: 방콕 사뭇쁘라깐
- **Isuzu Motors Thailand HQ**: 방콕 동부
- **Nissan Motor Thailand HQ**: 방콕 사뭇쁘라깐

→ Tier 1/2 자동차 부품사 신규 거래 협상은 본사 routing 이 빠름. plant 직접 컨택은 기존 contract 변경 / QC 협의 위주.

## 일본 Tier 1 부품사 corporate

- **AISIN Asia HQ**: 방콕 (전체 Asia 지역 routing)
- **Denso Thailand HQ**: 방콕 라마 9
- **Bridgestone Asia HQ**: 방콕

→ 한국 자동차 부품 buyer 가 신규 supply 거래 트는 1차 채널.

## 한국 대기업 태국 법인 본사

- **POSCO Thailand**: 방콕 (Wireless Rd / Sukhumvit)
- **LG Electronics Thailand**: 방콕
- **LG Chem Thailand**: Map Ta Phut + 방콕 commercial
- **Samsung Thailand**: 방콕 (전자 + 디스플레이)
- **SK 그룹 태국 자회사들**: 방콕

→ 한국 SME 가 협력 / 진출 검토할 때 방콕에서 한국어 응대 가능한 대기업 한국인 인력과 연결되는 채널.

## 태국 conglomerate 본사

- **CP Group (Charoen Pokphand)**: 방콕 (식품 / 통신 / 유통 거인)
- **Thai Union Group**: 방콕 (해산물 글로벌 1위)
- **Saha Group**: 사뭇쁘라깐 (의류 / 식품 / 코스메틱)
- **SCG (Siam Cement Group)**: 방콕 (건자재 / 화학)

→ B2B 파트너십, M&A, 합작 투자 검토 시 본사 corporate development 팀 컨택.

## 본사 컨택의 의미

Plant 직접 컨택 = 기존 거래 변경 / 일상 QC 협의.
Corporate office 컨택 = **신규 거래 트기 / 전략 파트너십 / 기술 라이선싱 / M&A 협의**.

태국에서 신규 사업 routing 의 70% 이상이 corporate office 거쳐서 들어감. 한국 SME 가 plant 만 컨택하면 보통 "기존 contract 가 있으면 못 받음" 답변. 본사로 routing 하면 다른 자회사 / 다른 spec 으로 거래 가능성 열림.

전체 corporate office 리스트는 [Bangkok 도시 페이지](/ko/city/bangkok) 또는 [corporate office 카테고리](/ko/c/corporate_office) 참고.`,
    related: ["korean-sme-thai-entry-pattern", "tier1-japanese-oem-thailand-overview"],
  },
];

export function findPostKo(slug: string): Post | null {
  return POSTS_KO.find((p) => p.slug === slug) ?? null;
}
