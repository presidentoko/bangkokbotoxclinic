// 한국어 블로그 — 한국 buyer 관점. 단순 번역 X.
// POSTS_KO_MANUAL = 사람이 직접 쓴 글 (이 파일).
// POSTS_AUTO_KO   = scripts/generate_blog_ko.py 가 master_db 기반 자동 생성.
// export 되는 POSTS_KO = 둘을 합친 것.

import type { Post } from "./posts";
import { POSTS_AUTO_KO } from "./posts_auto_ko";

const POSTS_KO_MANUAL: Post[] = [
  {
    slug: "thailand-oem-first-guide",
    title: "태국 OEM 처음 알아보는 분 — 한국 브랜드 사장님 가이드",
    metaTitle: "태국 OEM 처음 — 한국 브랜드 사장님용 실전 가이드",
    metaDescription: "태국 OEM 알아보는 한국 브랜드 사장님 정리. 어떤 카테고리가 강한지, 어디서 찾는지, MOQ/단가/리드타임, DBD 검증, RFQ 보내는 법.",
    category: "한국 바이어 가이드",
    published: "2026-05-22",
    body: `\"중국 OEM 단가 오르고 품질 들쑥날쑥하니 태국 OEM 알아보자\" — 요즘 한국 브랜드 사장님들 가장 많이 묻는 질문 정리.

## 태국 OEM 강한 카테고리

태국이 중국보다 경쟁력 있는 카테고리:

- **화장품 / 스킨케어 / 코스메슈티컬** — 동남아 ODM 강자. Aloe, Tropical fruit extract 등 현지 원료 + 글로벌 인증 (GMP, ISO 22716).
- **식품 / 가공식품 / 소스 / 음료** — 수산물 (사뭇사콘), 과일/채소 가공, 라이스 제품, 인스턴트 누들.
- **자동차 부품** — Toyota, Honda, Mitsubishi 등 일본계 OEM 정착. Tier 1/2 부품 공급망.
- **고무 / 라텍스** — 태국 = 세계 라텍스 1위. 매트리스, 장갑, 산업 부품.
- **섬유 / 의류** — 중급 OEM (단가는 베트남보다 비싸지만 품질 안정).
- **플라스틱 가공** — 패키징, 가전 부품, 소비재.
- **할랄 식품** — 무슬림 시장 진출 시 필수.

중국이 더 강한 카테고리: 전자 부품, 저가 OEM (T-shirt 등), 화학 원료. 태국으로 가지 마세요.

## 어디서 찾나

옵션 3가지:

1. **알리바바 / Made-in-China** — 중국 위주, 태국 공급사도 일부. 다만 검증이 약함 (brassplate 다수).
2. **한국 무역 에이전시** — 15-30% 마진. 처음이고 영어 부담이면 OK.
3. **태국 directory** (우리 사이트 같은 곳) — DBD 검증된 공급사 직접 컨택. 단가 절감.

[알리바바 vs 태국 직접 소싱 비교](/ko/blog/alibaba-vs-thailand-direct) 글에서 더 자세히.

## 단가 — 중국 vs 태국 vs 베트남

대략적인 단가 비교 (참고용):

| 카테고리 | 중국 | 태국 | 베트남 |
|---|---|---|---|
| 화장품 ODM | 100 | 110-130 | 130-160 |
| 식품 가공 | 100 | 90-105 | 85-95 |
| 자동차 부품 | 100 | 110-125 | 105-120 |
| 섬유 OEM | 100 | 130-150 | 90-110 |
| 고무 제품 | 100 | 85-95 | 95-110 |

태국이 식품 / 고무에서 단가 우위 + 화장품/자동차 부품에서 품질 우위.

## MOQ — 최소 발주 수량

- **화장품 ODM**: 1,000-5,000 units (자체 brand 신규). PB (제조사 자체 브랜드 베이스) 활용시 500부터.
- **식품**: 컨테이너 단위 (1FCL = 20피트 또는 40피트). 음료 캔 50,000개+ 흔함.
- **자동차 부품**: 부품 spec에 따라 다름. 5,000-100,000 unit.
- **고무 제품**: 1,000-10,000 unit.
- **섬유**: 1,000-3,000 unit (스타일 1개당).

처음 거래는 **샘플 발주 (50-300 unit)** → **정식 PO** 순서. 샘플 단가는 정식 단가의 2-5배 (개발비 포함).

## 리드타임

- **샘플**: 2-4주
- **양산 첫 lot**: 30-60일 (샘플 승인 후)
- **재발주**: 20-40일
- **컨테이너 출항 + 한국 도착**: 5-7일 (FCL Laem Chabang → 부산)

총 처음 거래 4-5개월 잡으세요.

## 결제 조건

- **T/T (Telegraphic Transfer / 송금)**: 30% 선금 + 70% 출항 전 (B/L 카피 받고). 가장 흔함.
- **L/C (Letter of Credit / 신용장)**: 큰 발주 또는 처음 거래시 안전. 은행 수수료 0.3-0.5%.
- **D/P, D/A**: 중간 형태. 적게 사용.

[T/T vs L/C 결제 비교](/ko/blog/tt-vs-lc-payment) 참고.

## DBD 검증이 차별점

태국 상무부 (Department of Business Development) 공식 사업자 등록 정보를 우리가 매칭한 결과 — 법인명, 자본금, 등록일, TSIC 코드를 확인해서 \"실재 법인인지\" 검증.

알리바바엔 이 검증이 없어요. brassplate (서류상 회사) 위험 있음. [DBD 검증이 뭐고 왜 중요한가](/ko/blog/dbd-verification-explained) 글에 자세히.

## 다음 단계

처음이라면:

1. **카테고리 결정** — 위 강한 카테고리 중 본인 제품 매칭
2. **5-10곳 후보 추리기** — 우리 directory 또는 [/c/manufacturer](/c/manufacturer) 등 카테고리 페이지
3. **RFQ 보내기** — 5-10곳 동시에 spec 보내고 견적 비교 ([RFQ 보내는 법](/ko/blog/rfq-how-to-thailand))
4. **샘플 발주** — 단가 + 품질 + 응대 종합 평가
5. **현지 실사** (선택) — 큰 발주 전 1회 권장 ([공장 실사 체크리스트](/ko/blog/factory-audit-checklist))

## RFQ 폼

우리 사이트 [RFQ 폼](/contact)에 한국어로 spec 적어주시면 영문 번역 + 공급사 매칭까지 무료. 거래 성사 시 우리 수수료 X (Direct connection 모델).`,
    related: ["alibaba-vs-thailand-direct", "rfq-how-to-thailand", "dbd-verification-explained", "moq-negotiation-thai-oem"],
  },
  {
    slug: "alibaba-vs-thailand-direct",
    title: "알리바바 vs 태국 공급사 직접 — 단가, 품질, 위험 비교",
    metaTitle: "알리바바 vs 태국 직접 OEM — 단가/품질/위험 정직 비교",
    metaDescription: "알리바바 통한 OEM vs 태국 공급사 직접 컨택 비교. 단가 차이, brassplate 위험, MOQ 협상, DBD 검증, 실전 sourcing 워크플로우.",
    category: "한국 바이어 가이드",
    published: "2026-05-22",
    body: `한국 브랜드 사장님 처음 OEM 알아볼 때 \"알리바바부터 보자\" 시작하는 게 디폴트지만, 카테고리에 따라 알리바바가 답 아닐 수 있어요.

## 알리바바 강한 카테고리

- **중국 본토 공급사** — 알리바바가 압도적. 단가 + 선택지.
- **저가 일반 카테고리** — T-shirt, 가전 액세서리, 일반 패키징.
- **샘플 1-10 unit 소량** — 가장 편함.

## 알리바바 약한 카테고리

- **태국 / 베트남 OEM** — 등록 공급사 적음. 있어도 검증 약함.
- **고급 화장품 ODM** — 큰 공급사들은 자체 sales 채널 운영, 알리바바 등록 안 함.
- **식품 (한국 식약처 등록 필요)** — 알리바바엔 정보 부족.
- **자동차 부품 Tier 1** — 일본계 OEM 협력사들은 자체 영업.

## 단가 차이 (실제)

같은 spec 화장품 ODM, 알리바바 vs 태국 공급사 직접:

| 항목 | 알리바바 | 태국 직접 |
|---|---|---|
| FOB 단가 | $2.50 | $2.00-2.20 |
| MOQ | 3,000 | 1,000 |
| 샘플비 | $50/sample | $30/sample |
| 리드타임 | 45일 | 30-40일 |
| 응대 속도 | 평균 24시간 | 평균 4-12시간 |

알리바바는 sourcing agent 마진이 단가에 포함되어 있음 — 15-25%. 직접 컨택하면 그 마진 절감.

## Brassplate (페이퍼 컴퍼니) 위험

알리바바 \"Gold Supplier\" 인증은 매년 ~$5,000 멤버십 결제만 하면 받음. 실제 공장 보유 검증 X.

발주 후 깨닫는 흔한 사례:

- 공장 사진 다 가짜 (스톡 사진)
- 발주 받으면 다른 진짜 공장에 outsource (품질 변동성)
- 분쟁 시 알리바바 중재가 미흡 (큰 금액일 수록 더)
- 회사 등록 자체가 의심 (홍콩 SPC 등)

태국 DBD 검증의 가치는 \"이 회사가 실제로 등록된 법인이고 자본금이 있고 TSIC 코드가 카테고리랑 맞다\"는 사실 검증.

## 한국 사례 — 알리바바 사기 패턴

자주 보는 패턴:

1. **선금 받고 잠적** — 30% T/T 후 연락 두절. 알리바바 분쟁 절차로 일부 회복 가능하지만 시간 6개월+.
2. **샘플 vs 양산 품질 차이** — 샘플은 다른 공장 제품, 양산은 본인 공장 (저급).
3. **MOQ 협상 후 변경** — 1,000 MOQ 합의 후 \"공장 측 사정\"으로 5,000 강요.
4. **B/L (선하증권) 조작** — 출항 안 한 상태에서 B/L 위조 → 잔금 받음.

## 태국 직접의 위험

100% 안전은 아닙니다. 위험:

- **언어 장벽** — 태국 공급사 영어 OK하지만 한국어 거의 없음. 미세한 spec 의사소통 실패 가능.
- **시간대 (한국 -2시간)** — 미국/유럽보다 편하지만 미스커뮤니케이션은 똑같음.
- **태국 신년 (4월 송끄란)** — 일주일 가까이 휴무. 일정 영향.
- **위생 / 인증 격차** — 한국 식약처 / KC 인증 요구사항 맞추는 데 시간.

## 실전 워크플로우 추천

### Option A: 알리바바 + 우리 directory 병행

- 알리바바에서 후보 추리기 (10-20곳)
- 우리 사이트에서 같은 카테고리 태국 공급사 5-10곳 추가
- RFQ 동시 발송 → 견적 + MOQ 비교
- 직접 응대 빠른 곳 (8시간 이내) 우선 진행

### Option B: 우리 directory 직접 (단가 최저)

- 우리 사이트 카테고리 + 도시 페이지에서 DBD 검증 강한 곳 추리기
- RFQ 폼으로 5-10곳 동시 발송
- 영어 또는 한국어 (한국어면 우리가 번역)

### Option C: 한국 무역 에이전시 (편함 우선)

- 이엔에프, 인터플렉스, 한국무역상사 등
- 15-30% 마진 붙음
- 처음이고 영어 100% 부담 시 1-2건만 한정 활용

## 우리 사이트의 차별점

- **3,305 공급사 → 853 DBD 검증** — alibaba에 없는 검증 신호
- **법인명 / 자본금 / 등록일 / TSIC 코드** 공개 — 신뢰 판단 가능
- **RFQ 폼** — 한국어 OK, 우리가 영문 번역 + 매칭
- **수수료 X** — 거래 성사돼도 우리 수수료 안 받음 (Direct connection)

## 결론

\"알리바바 vs 태국 직접\" 양자택일 아닙니다. **병행이 정답**. 알리바바로 시장가 파악 + 태국 직접으로 단가/품질 검증 + 우리 directory로 DBD 검증된 후보 추가.

[RFQ 보내는 법](/ko/blog/rfq-how-to-thailand)에서 실전 RFQ 양식 + 예시 메일 정리.

[RFQ 폼 보러 가기](/contact)`,
    related: ["thailand-oem-first-guide", "rfq-how-to-thailand", "dbd-verification-explained", "factory-audit-checklist"],
  },
  {
    slug: "dbd-verification-explained",
    title: "DBD 검증이 뭐고 왜 한국 바이어한테 중요한가",
    metaTitle: "태국 DBD 검증 — 한국 OEM 바이어가 알아야 할 것",
    metaDescription: "태국 상무부 DBD (Department of Business Development) 검증이란? 법인명, 자본금, 등록일, TSIC 코드 의미. 알리바바와 차이. 한국 바이어 활용법.",
    category: "한국 바이어 가이드",
    published: "2026-05-22",
    body: `\"이 태국 공급사 실재하는 회사 맞나?\" — 발주 전 가장 큰 질문. DBD 검증으로 거의 다 해결.

## DBD가 뭐냐

**DBD = Department of Business Development**, 태국 상무부 산하 기관. 모든 태국 법인의 공식 사업자 등록 정보를 관리.

한국의 \"국세청 사업자등록 + 공정거래위원회 + 법인등기부등본\" 합친 거라고 생각하시면 됩니다.

DBD에 등록되어 있다 = 진짜 법인 + 자본금 신고 + 사업자등록 + 세무 신고 (이론적으로) 다 갖춤.

## 우리가 매칭하는 정보

- **Legal Name (법인명)** — 공식 등록명. 종종 마케팅 이름과 다름.
- **Capital THB (자본금)** — 등록 자본금. 큰 발주 신뢰도 신호.
- **Registered Date (등록일)** — 회사 영업 연도.
- **TSIC Code** — 태국 표준산업분류 (한국 KSIC 대응). 등록 사업과 실제 사업이 일치하는지 확인.
- **Status** — Active / Dissolved (해산). 해산 회사는 우리가 자동 필터.
- **Director Names** — 등기 임원 (선택 정보).

## 신뢰 매칭 점수 (Match Score)

우리가 자동 매칭한 결과의 신뢰도:

- **≥90 (강함)** — Google 이름, 주소, 카테고리, 도메인 다 일치. 거의 확실.
- **80-89 (가능성 높음)** — 핵심 정보 일치. 일부 변형. 직접 추가 확인 권장.
- **<80** — 우리가 자동 추정 안 함. 미검증 표시.

전체 3,305 공급사 중 **853곳 DBD 검증**, 그 중 **329곳 강함 (≥90)**, **520곳 가능성 높음 (80-89)**.

## 알리바바와 차이

알리바바 \"Gold Supplier / Verified\" 인증:

- 알리바바가 자체 검증 (실사 X)
- 멤버십 결제만 하면 받음 ($5K+/년)
- 회사 등록 자체는 검증 안 함 (홍콩 SPC, BVI 등 페이퍼 컴퍼니 가능)

DBD 검증:

- 태국 정부 공식 데이터
- 자본금 / 등록일 / 임원 다 공개
- 위조 불가능 (정부 기관)
- 단점: 알리바바보다 데이터 범위 작음 (태국 등록 법인만)

## 한국 바이어가 어떻게 활용하면

### 발주 전 체크 사항

1. **법인명이 마케팅 이름과 같은가** — 다르면 \"왜 다른지\" 물어보기. 정상적 이유 (그룹 자회사 등) 있을 수 있음.
2. **자본금이 발주 규모 대비 적당한가** — ฿1M 자본금 회사에 $500K 발주 보내면 risk. ฿100M+ 회사에 $100K 발주는 안전 신호.
3. **등록 연도가 충분히 오래됐나** — 1년 미만 신생 회사는 신중. 5년+ 안정.
4. **TSIC 코드가 본인 카테고리와 맞는가** — 예: 화장품 발주인데 TSIC 코드가 \"건축자재\"면 의심.

### 우리 페이지에서 확인하는 법

각 공급사 페이지 (예: /supplier/[id] 형태) 가면 DBD 정보 박스에 위 정보 다 표시. 강함 배지 (🛡️) 또는 검증 배지 (✅) 있으면 안전 신호.

## 자본금 (Capital THB) 해석

- **<฿1M** — 영세 (스타트업 또는 1인 사업). 작은 발주만.
- **฿1M-฿10M** — 중소 (정상 OEM 운영 가능).
- **฿10M-฿100M** — 중견 (큰 발주 안전).
- **฿100M-฿1B** — 대형 (Tier 1 OEM).
- **฿1B+** — 글로벌 거대 OEM (Charoen Pokphand, Siam Cement 등).

자본금이 클수록 \"실재 자산 + 법적 책임\" 신호. 분쟁시 법인 자산으로 회복 가능성 ↑.

## 한국 바이어가 자주 묻는 거

**Q. DBD 검증 강함이면 100% 안전?**
A. 아닙니다. 회사 등록은 진짜지만 운영 능력 / 품질 / 정직성은 별개. 발주 전 샘플 + 화상 통화 + 가능하면 실사.

**Q. 미검증 공급사는 위험?**
A. 우리가 자동 매칭 못 했을 뿐 — 실제로는 등록되어 있을 가능성 큼. 본인이 DBD 사이트에서 직접 검색 가능 (영문 검색 일부 가능).

**Q. 자본금이 자주 변경되나?**
A. 아닙니다. 큰 변경은 1-2년에 한 번. 등록일 / 자본금 정보는 안정.

**Q. 우리 사이트 데이터는 얼마나 최신?**
A. 우리 자동 매칭 시점 기준. 정확한 거래 직전엔 직접 또는 우리 RFQ 폼을 통해 한 번 더 확인.

## 다음 단계

- [공장 실사 체크리스트](/ko/blog/factory-audit-checklist) — DBD 검증 후 추가 안전장치
- [RFQ 보내는 법](/ko/blog/rfq-how-to-thailand) — 검증된 공급사에 첫 메일
- [태국 OEM 처음 가이드](/ko/blog/thailand-oem-first-guide)`,
    related: ["thailand-oem-first-guide", "factory-audit-checklist", "alibaba-vs-thailand-direct"],
  },
  {
    slug: "rfq-how-to-thailand",
    title: "RFQ 태국 공급사한테 보내는 법 — 양식 + 예시 메일",
    metaTitle: "태국 OEM RFQ 보내는 법 — 양식, 예시 메일, 견적 비교",
    metaDescription: "태국 공급사한테 RFQ (Request for Quotation) 보내는 실전 가이드. 양식 항목, 예시 메일 (영문), 5-10곳 동시 발송, 견적 비교, 첫 응대 평가.",
    category: "한국 바이어 가이드",
    published: "2026-05-22",
    body: `RFQ (Request for Quotation) 작성법. 첫 메일이 응답률 결정해요. 양식 잘 만들면 5-10곳 동시 발송 → 견적 비교 → 협상 단계로 빠르게 진입.

## RFQ 필수 항목

영문 RFQ에 꼭 들어가야 할 거:

1. **회사 소개 (3-5줄)** — 한국 어느 도시 어떤 회사, 어떤 제품, 발주 의도.
2. **Product specification** — 정확한 spec. 그림/도면 첨부.
3. **MOQ 요청** — \"What's your MOQ for this spec?\"
4. **Quantity (annual or first order)** — 예상 발주량.
5. **Material / Ingredient** — 재료 또는 원료 spec.
6. **Packaging** — 어떻게 포장할지.
7. **Certifications required** — KFDA, GMP, ISO 등.
8. **Lead time** — 첫 lot 리드타임.
9. **Payment terms** — T/T 30/70 또는 L/C.
10. **Incoterms** — FOB Laem Chabang, CIF Busan 등.
11. **Deadline for response** — 보통 5-7일.

## 예시 메일 (영문)

처음 보내는 cold RFQ 예시 — 화장품 ODM 케이스:

\`\`\`
Subject: RFQ — Facial Serum ODM Project — 5,000 units initial order

Dear [Sales Manager],

I'm [name] from [Korean Company Name], a Seoul-based skincare brand
launching a new facial serum line for the Korean market in Q3 2026.

I came across [Their Company Name] on Thai Supply Hub and would like
to request a quotation for the following ODM project.

Product Specification:
- Product type: Hyaluronic acid + Vitamin C facial serum
- Volume per unit: 30 ml
- Bottle: Glass pump dropper (frosted finish)
- Outer carton: Single unit kraft box
- Initial order: 5,000 units
- Annual estimate: 30,000 units

Required:
- Formulation: Your standard hyaluronic + vitamin C base (we are
  open to your formula recommendation)
- Certifications: GMP, ISO 22716, suitable for KFDA registration
- Country of manufacture: Thailand

Could you please provide:
1. FOB Laem Chabang unit price for the initial 5,000 order
2. Your MOQ for this category
3. Sample lead time and cost
4. Production lead time after sample approval
5. Payment terms (T/T 30/70 is our standard)

Please respond by [date, 1 week out]. Happy to schedule a video call
to discuss further.

Best regards,
[Name]
[Korean Company Name]
[Phone] / [Email]
[KakaoTalk / WeChat ID — optional]
\`\`\`

## 한국어 → 영문 번역 팁

태국 공급사 sales manager 영어 수준 평균:

- 일상 영어 (B1-B2) — 90%
- 비즈니스 영어 (B2-C1) — 50%
- Native 수준 — 10%

너무 복잡한 문장 X. 단문 + 명확한 spec. 의문문은 번호 매겨서.

## 동시 5-10곳 발송

같은 RFQ를 5-10곳에 동시 발송하는 게 시장가 파악의 핵심. \"이 한 곳에만 보내고 견적 받자\"는 절대 X.

방법:

- 각 메일 개별 발송 (CC X) — 받는 쪽 \"본인만 받은 줄 알도록\"
- 회사명 + sales 담당자 이름 매번 변경
- 본인 회사 소개도 약간씩 톤 다르게 (스팸 필터 회피)

## 응답률 + 응답 시간 평가

좋은 공급사 신호:

- **24시간 이내 응답** — 사장님 또는 sales manager 직접
- **본인 spec에 맞춰 답변** (generic 카탈로그 첨부 X)
- **명확한 견적** (단가 + MOQ + 리드타임 다 적힘)
- **추가 질문** — 본인 spec에 관심 있어서 더 물어봄 (좋은 신호)

피해야 할 공급사:

- 5일+ 응답 없음
- generic 카탈로그만 첨부 + 단가 모호
- 본인 spec 무시하고 다른 상품 추천
- WhatsApp / Line으로만 응대 (이메일 회피)

## 견적 비교 표

받은 견적 정리용 (구글 시트 추천):

| 공급사 | FOB 단가 | MOQ | 샘플비 | 샘플 LT | 양산 LT | 응대 속도 | DBD |
|---|---|---|---|---|---|---|---|
| A사 | $2.10 | 1,000 | $30 | 2주 | 35일 | 6시간 | 강함 |
| B사 | $1.95 | 3,000 | $40 | 3주 | 30일 | 24시간 | 검증 |
| C사 | $2.30 | 500 | $25 | 1주 | 40일 | 4시간 | 강함 |

\"가장 싼 곳\" ≠ 좋은 선택. **DBD 검증 + 응대 속도 + MOQ 유연성** 종합 평가.

## 우리 RFQ 폼 활용

영문 부담 또는 한 번에 여러 공급사한테 보내고 싶으면:

[우리 RFQ 폼](/contact) — 한국어로 spec 적어주시면:
1. 영문 번역
2. 우리 directory에서 매칭되는 5-10곳 공급사한테 자동 발송
3. 응답 모아서 비교 정리 (구글 시트로)

무료. 거래 성사 수수료 X.

## 다음 단계

- [태국 OEM 처음 가이드](/ko/blog/thailand-oem-first-guide)
- [공장 실사 체크리스트](/ko/blog/factory-audit-checklist) — 견적 받은 후 단계
- [MOQ 협상 가이드](/ko/blog/moq-negotiation-thai-oem)`,
    related: ["thailand-oem-first-guide", "factory-audit-checklist", "moq-negotiation-thai-oem", "alibaba-vs-thailand-direct"],
  },
  {
    slug: "factory-audit-checklist",
    title: "태국 공장 실사 체크리스트 — 한국 사장님 직접 가실 때",
    metaTitle: "태국 공장 실사 체크리스트 — 직접 방문 한국 바이어용",
    metaDescription: "태국 공장 실사 직접 방문 가이드. 실사 일정, 체크리스트 (서류, 공장 라인, 인력, 품질관리), 사진 찍는 법, 한국 항공권 일정.",
    category: "한국 바이어 가이드",
    published: "2026-05-22",
    body: `큰 발주 (USD 50K+) 직전 또는 신규 공급사 첫 거래 시 직접 실사 1회 권장. 한국 사장님이 직접 가시면 1-2일이면 충분.

## 실사 일정 — 1박 2일 모델

### Day 1 — 도착 + 첫 미팅

- **09:00** 인천 → 방콕 출발
- **14:00** 방콕 도착
- **15:30** 호텔 체크인 (공급사 근처 또는 방콕 도심)
- **17:00** 공급사 sales manager 미팅 (저녁 식사)
- **사전 준비**: 본인 회사 자료 (영문), 통역 (선택)

### Day 2 — 공장 실사

- **08:00** 공급사 픽업 또는 그랩
- **09:00** 공장 도착, 사무실 미팅
- **10:00** 공장 라인 투어
- **12:00** 점심 (공급사 제공)
- **13:00** 품질관리 / 창고 / R&D 라인
- **15:00** 마무리 미팅 + 협상
- **17:00** 공항 픽업
- **20:00** 방콕 출발 → 인천

## 사전 준비 — 한국에서

1. **NDA / 협력 의향서** — 본인 spec 보호용. 영문 + 변호사 검토.
2. **본인 회사 소개 자료** — 영문 1-2장, 매출 / 시장 / 제품 라인 정리.
3. **체크리스트** (아래) — 인쇄 또는 태블릿.
4. **카메라 / 폰** — 사진 + 영상 (공급사 양해 받고).
5. **명함** — 영문 + 한국어 dual.
6. **현금** — 캐디팁이 아니라 비상금. 약 ฿20,000.

## 체크리스트 — 서류 (사무실)

- [ ] **DBD 등록증** 원본 (벽에 거의 있음, 확인)
- [ ] **공장 등록증 (Factory License)** — 태국 산업부 발급
- [ ] **품질 인증서** — GMP, ISO, HACCP 등 본인 발주에 필요한 거 다
- [ ] **수출 라이센스** — 해당시
- [ ] **할랄 인증** — 무슬림 시장 필요시
- [ ] **최근 거래 사례** — 해외 발주 레퍼런스 2-3건 사진 또는 자료
- [ ] **재무제표** (선택) — 큰 발주시 자본금 / 매출 확인

## 체크리스트 — 공장 라인

- [ ] **청결도** — 바닥, 벽, 기계 청결 상태
- [ ] **인력** — 라인 가동 인원, 보호장비 착용
- [ ] **기계 상태** — 노후 / 최신 / 가동률
- [ ] **품질관리 lab** — 검사 장비, 시료, 절차
- [ ] **창고** — 원자재 + 완제품 보관 환경
- [ ] **포장 라인** — 본인 발주 패키징 가능한지
- [ ] **R&D / 시험 라인** — 새 spec 개발 가능한지

## 체크리스트 — 인력 / 운영

- [ ] **본인 발주 담당 sales / PM 누구**
- [ ] **영어 능력** (sales 외에도 라인 매니저 영어 OK한지)
- [ ] **한국 거래 경험** (다른 한국 고객 있는지)
- [ ] **태국 신년 / 연휴 영향**
- [ ] **클레임 대응 절차** (지난 클레임 사례)
- [ ] **리드타임 평균 vs 본인 발주 spec 리드타임**

## 사진 / 영상 찍는 법

- 공급사 양해 받고 (대부분 OK, 일부 R&D 라인 X)
- 본인 발주에 관련된 라인 위주
- 라인 가동 영상 5-10초씩
- 인증서 원본 사진 (서명 / 도장 확인)
- 사장님 본인 + 공장 입구 사진 (회의록용)

## 한국 사장님 자주 묻는 거

**Q. 한국어 통역 필요?**
A. Sales manager 영어 OK하면 보통 불필요. 라인 매니저 영어 약하면 통역 도움. 방콕에 한국어-영어 통역사 약 ฿3,000-5,000/일.

**Q. 실사 한 곳만 가도 되나?**
A. 큰 발주면 2-3곳 다녀와서 비교 추천. 1일 방콕 인근 코스 안에 2-3곳 가능 (지리적으로 가까운 공급사 선택).

**Q. 실사 비용 누가 내?**
A. 본인 항공권 + 호텔. 공급사가 픽업 + 점심 + 가끔 저녁 제공. 큰 발주면 호텔도 제공하는 경우 있음.

**Q. 실사 후 협상 어떻게?**
A. 실사 직후 (Day 2 오후) 협상이 강함. 본 라인 본 직후라 정보 가장 많고, 공급사도 본인 진지함 인정.

## 실사 후 절차

1. **사진 / 노트 정리** (한국 돌아온 다음날)
2. **여러 공급사 비교 정리** (간단한 점수표)
3. **2-3주 내 결정** → 샘플 발주 또는 정식 PO
4. **NDA / 본 계약 서명** — 한국 변호사 + 태국 변호사 검토

## 항공권 / 호텔

방콕 출장 1박 2일:

- 항공권 LCC: \\₩400,000-700,000
- 4성 호텔 1박: \\₩100,000-150,000
- 교통 (그랩): \\₩50,000
- 식비: \\₩100,000
- 통역 (필요시): \\₩100,000
- **총 1박 2일 비용**: 약 \\₩700,000-1,200,000

대형 발주 (USD 50K+) 보호 가치 대비 저렴.

## 우리가 도와드리는 것

[RFQ 폼](/contact)을 통해 5-10곳 공급사 매칭 후 견적 비교까지 무료. 실사 일정 잡는 거 (공급사 컨택, 픽업 협상)도 요청하시면 도움.

## 다음 단계

- [RFQ 보내는 법](/ko/blog/rfq-how-to-thailand)
- [T/T vs L/C 결제 비교](/ko/blog/tt-vs-lc-payment)
- [MOQ 협상 가이드](/ko/blog/moq-negotiation-thai-oem)`,
    related: ["rfq-how-to-thailand", "tt-vs-lc-payment", "moq-negotiation-thai-oem", "dbd-verification-explained"],
  },
  {
    slug: "tt-vs-lc-payment",
    title: "T/T vs L/C 결제 — 태국 OEM 발주시 어느 쪽 쓸까",
    metaTitle: "T/T vs L/C 태국 OEM — 한국 바이어 결제 방식 비교",
    metaDescription: "태국 공급사 발주 결제 방식 비교. T/T (송금) 30/70 vs L/C (신용장) 장단점, 비용, 안전성. 발주 규모별 추천 결제 방식.",
    category: "한국 바이어 가이드",
    published: "2026-05-22",
    body: `발주 단계에서 \"T/T로 할까 L/C로 할까\" 자주 갈리는 부분. 발주 규모와 신뢰도에 따라 선택 다름.

## T/T (Telegraphic Transfer / 송금)

가장 흔한 방식. 한국 은행에서 SWIFT 송금.

### 일반적 구조

- **30% 선금** — PO 확정시 송금. 공급사가 원자재 구매 + 양산 시작.
- **70% 잔금** — 출항 전 B/L (선하증권) 카피 받고 송금. 송금 확인 후 B/L 원본 전달.

### 비용

- 송금 수수료: \\₩20,000-40,000/건 (한국 은행)
- 환전 수수료: 1.5-2.5% (스프레드)
- 받는 쪽 (태국) 수수료: ~$10-30

### 장점

- **빠름** — 송금 1-2영업일
- **간단** — L/C 서류 복잡함 X
- **저렴** — L/C 0.3-0.5% 수수료 없음
- **소액 발주 적합** — USD 50K 미만

### 단점

- **선금 30% 위험** — 공급사 부도 / 잠적 시 선금 회수 어려움
- **잔금 70% 위험** — 잔금 송금 후 품질 문제 발견 시 협상력 X
- **분쟁시 보호 약함** — 양 측 합의 외 절차 없음

### 추천 케이스

- 발주 USD 50K 미만
- 신뢰 관계 있는 공급사 (2-3회+ 거래)
- DBD 검증 강함 + 실사 완료

## L/C (Letter of Credit / 신용장)

은행이 \"중간 보장\" 역할. 한국 은행이 태국 은행에게 \"이 조건 충족시 결제 보장\"이라는 신용장 발행.

### 일반적 구조

1. 한국 바이어 → 한국 은행에 L/C 개설 신청
2. 한국 은행 → 태국 공급사 측 은행에 L/C 발행
3. 공급사 출항 후 서류 (B/L, Invoice, Packing List 등) → 태국 은행
4. 태국 은행 → 한국 은행 검토
5. 서류 일치시 한국 은행 → 태국 은행 결제 (한국 바이어 계좌 차감)

### 비용

- L/C 개설 수수료: 0.2-0.4%/3개월 (한국 은행)
- 통지 수수료: $50-150 (태국 은행)
- 수정 / 연장 수수료: $30-100/회
- 검토 / 결제 수수료: 0.1-0.2%

총 약 0.3-0.7%의 발주 금액. USD 100K = $300-700.

### 장점

- **안전** — 은행 보장. 공급사 출항 + 서류 일치해야 결제됨
- **bank validation** — 한국 은행이 태국 공급사 검증 (간접)
- **분쟁시 보호 강함** — 서류 불일치시 결제 정지
- **세무 / 회계 깔끔** — 자동 기록

### 단점

- **느림** — 개설 1주, 처리 2-3주
- **복잡** — 서류 한 글자 틀려도 \"불일치\" → 협상 또는 수정 필요
- **비용** — 0.3-0.7% 추가
- **공급사 부담** — 서류 작성 / 은행 절차 시간

### 추천 케이스

- 발주 USD 100K 이상
- 첫 거래 공급사
- 큰 신뢰 부담 (DBD 검증 미흡 등)

## D/P, D/A — 중간 형태

### D/P (Documents against Payment)

- 공급사 출항 후 서류 은행 통해 송부
- 한국 바이어가 결제해야 서류 받음
- L/C보다 간단, T/T보다 안전

### D/A (Documents against Acceptance)

- 공급사 출항 후 서류 송부 (외상)
- 30-90일 후 결제 약속
- 가장 신뢰 관계 깊을 때만

태국 OEM 거래에서 D/P는 가끔, D/A는 거의 안 씀.

## 발주 규모별 추천

| 발주 규모 | 추천 방식 | 이유 |
|---|---|---|
| <USD 10K (샘플) | 100% T/T 선금 | 작은 금액, L/C 비용 비효율 |
| USD 10K-50K | T/T 30/70 | 표준 |
| USD 50K-100K | T/T 30/70 또는 L/C | 신뢰도에 따라 |
| USD 100K-500K | L/C 또는 T/T (검증된 거래) | 큰 발주는 보호 우선 |
| USD 500K+ | L/C 또는 분할 T/T (3-4회) | 안전 + 부담 분산 |

## 한국 은행 — 어디 쓰면

- **무역 거래 전문**: 신한, KB국민, 우리, 외환은행
- **T/T 환율 좋음**: 외환은행, KEB 하나
- **L/C 절차 익숙**: 신한, KB국민

태국 거래는 거래 은행에 미리 \"태국 SWIFT 코드\" 확인 + 환율 정책 협상 권장.

## 분쟁 발생시

### T/T 분쟁

- 한국 변호사 + 태국 변호사 협업
- 태국 법정 (Civil Court) 절차
- 시간 1-3년, 비용 $5K-50K
- 회수율 30-50% (현실)

### L/C 분쟁

- 은행 간 처리 (UCP 600 국제 규정)
- 보통 3-6개월 내 결론
- 회수율 70-90%

L/C는 분쟁 시 압도적 보호.

## 자주 묻는 거

**Q. 작은 발주 T/T 100% 선금 받겠다는 공급사 있는데 OK?**
A. 보통 X. 30/70이 표준. 100% 선금 요구는 의심 신호. 단, 카스텀 spec / R&D 비용 큰 경우는 예외.

**Q. L/C 처음 해보는데 한국 은행이 다 알려주나?**
A. 네. 거래 은행 \"무역금융 데스크\"에서 단계별 안내. 처음이라고 말씀하시면 더 친절.

**Q. 환율 변동 위험?**
A. T/T는 송금 시점 환율 적용. L/C도 마찬가지. 환율 헤지 (Forward contract) 별도 활용 가능.

## 다음 단계

- [RFQ 보내는 법](/ko/blog/rfq-how-to-thailand)
- [공장 실사 체크리스트](/ko/blog/factory-audit-checklist)
- [컨테이너 물류 가이드](/ko/blog/container-logistics-korea-thailand)`,
    related: ["rfq-how-to-thailand", "factory-audit-checklist", "container-logistics-korea-thailand", "thailand-oem-first-guide"],
  },
  {
    slug: "moq-negotiation-thai-oem",
    title: "태국 OEM MOQ 협상 — 1,000부터 가능한가? 5,000부터인가?",
    metaTitle: "태국 OEM MOQ 협상 — 한국 작은 브랜드 사장님 가이드",
    metaDescription: "태국 OEM 최소 발주 수량 (MOQ) 협상 가이드. 카테고리별 표준 MOQ, 작은 브랜드 사장님 협상법, PB (Private Brand) 활용, 첫 거래 5% rule.",
    category: "한국 바이어 가이드",
    published: "2026-05-22",
    body: `한국 작은 브랜드 사장님 가장 큰 장벽이 \"MOQ\". 5,000개 발주는 부담인데 1,000개로 가능한지 협상이 관건.

## 카테고리별 표준 MOQ

| 카테고리 | 일반 MOQ | 협상 하한 | 비고 |
|---|---|---|---|
| 화장품 ODM (신규 처방) | 5,000-10,000 | 2,000 | PB 활용시 500 |
| 화장품 PB (기존 처방) | 500-1,000 | 300 | 라벨만 |
| 식품 가공 (캔/병) | 컨테이너 단위 | 50%+ FCL | 1FCL = 약 20,000 unit |
| 식품 분말/포장 | 1,000-3,000 | 500 | 한국 식약처 등록 후 |
| 자동차 부품 | 5,000-100,000 | spec 따라 다름 | Tier 1 협력 |
| 고무 제품 | 1,000-10,000 | 500 | 매트리스 등 큰 거 100 |
| 섬유 (스타일당) | 1,000-3,000 | 500 | 100% 협상 가능 |
| 플라스틱 가공 | 5,000-50,000 | 2,000 | 금형 비용 별도 |
| 패키징 | 1,000-10,000 | 500 | 디지털 인쇄 활용 |

## MOQ가 높은 이유

태국 OEM 입장에서 MOQ는:

1. **원자재 발주 단위** — 원자재 자체가 MOQ 있음 (예: 화장품 베이스 200kg 단위)
2. **라인 셋업 비용** — 라인 멈췄다 가동하는 데 8-24시간
3. **공급사 수익률** — 작은 발주는 수익률 ↓
4. **품질관리** — 큰 lot 검사가 효율적

이걸 알면 협상 카드가 보임.

## 작은 브랜드 사장님 협상 전략

### 전략 1: PB (Private Brand) 활용

기존 공급사 처방 + 본인 브랜드 라벨. MOQ 가장 낮음.

- 화장품: 500부터 가능 (라벨/포장만 변경)
- 식품: 1,000부터 (스티커 라벨)
- 단점: 본인 \"고유 처방\" X. 다른 브랜드도 같은 제품.

처음 시장 진입할 때 좋음.

### 전략 2: 작은 spec 변형 + 큰 카테고리 진입

신규 ODM이지만 공급사 기존 baseline에 약간만 변형:

- 화장품: 기존 \"수분크림 베이스\"에 향료만 변경
- 식품: 기존 \"매운맛 라면 베이스\"에 spice 조정

공급사가 \"R&D 부담 적다\" 판단 → MOQ 2,000-3,000으로 조정 가능.

### 전략 3: 시즌별 분할 발주

\"한 번에 5,000\" 부담스러우면 \"분기마다 1,000 × 4번 = 4,000\" 협상. 공급사가 연간 PO 확정 받으면 가능.

장점: 본인 현금 부담 분산.
단점: 라인 셋업 4번 → 단가 5-10% ↑.

### 전략 4: 다품종 통합 발주

스킨케어 5개 제품 × 1,000개씩 = 총 5,000. 공급사가 \"같은 라인에서 처방만 바꿔 가동\" → MOQ 합산 OK 케이스 많음.

### 전략 5: 공급사 신생/소형 선택

큰 OEM (Charoen Pokphand 등)은 MOQ 5,000+ 양보 안 함. 신생 / 중소 OEM은 비즈니스 확장 욕심 + MOQ 1,000부터 OK.

우리 directory에서 자본금 ฿1M-฿10M 공급사 추리면 협상 여지 큼.

## 협상 메일 예시

\`\`\`
Hi [Name],

Thank you for the quotation. We're very interested in moving forward,
but our initial Korean market test requires a smaller batch.

Could you accommodate:
- 1,500 units initial order (vs. your standard 5,000 MOQ)
- We commit to a follow-up 5,000 order within 6 months
  contingent on market response
- Slightly higher unit price (we understand setup cost)

Alternatively, do you offer a PB option where we use your existing
[product] formula with our brand label? That would allow us to
start with a smaller batch.

Looking forward to your thoughts.

Best,
[Name]
\`\`\`

## MOQ vs 단가 트레이드오프

MOQ 낮추면 단가 올라가는 게 정상:

| 발주량 | 단가 인덱스 |
|---|---|
| MOQ 표준 (예: 5,000) | 100 |
| 50% (2,500) | 110-115 |
| 30% (1,500) | 120-130 |
| 20% (1,000) | 130-150 |

작은 발주 1,000개 × 30% 비싼 단가 = 큰 발주 1,300개와 동일 비용. 시장 검증 후 큰 발주 단가 회복 가능.

## 첫 거래 5% 룰

연간 시장 추정량의 5% 정도만 첫 발주 권장:

- 연 5만개 예상 시장 → 첫 2,500개
- 연 1만개 예상 시장 → 첫 500개
- 연 50만개 예상 시장 → 첫 25,000개

100% 시장 검증 안 된 상태에서 큰 MOQ = 재고 부담. 작게 시작 → 시장 반응 → 확장.

## MOQ 협상이 안 되는 경우

- 발주가 너무 작음 (< 500 unit)
- 큰 OEM (Tier 1, 글로벌 공급사)
- 카스텀 spec이 너무 복잡 (R&D 부담 큼)
- 공급사가 한국 시장 경험 없음 (위험 회피)

이 경우 다른 공급사로 이동 또는 PB 옵션 활용.

## 우리가 도와드리는 것

[RFQ 폼](/contact)을 통해 \"MOQ 1,000 기준\" 명시하시면, 우리가 directory에서 MOQ 협상 가능한 공급사 우선 매칭. 자본금 + DBD + 한국 거래 경험 종합 평가.

## 다음 단계

- [RFQ 보내는 법](/ko/blog/rfq-how-to-thailand)
- [태국 OEM 처음 가이드](/ko/blog/thailand-oem-first-guide)
- [공장 실사 체크리스트](/ko/blog/factory-audit-checklist)`,
    related: ["rfq-how-to-thailand", "thailand-oem-first-guide", "factory-audit-checklist", "alibaba-vs-thailand-direct"],
  },
  {
    slug: "cosmetics-oem-korean-brand",
    title: "태국 화장품 OEM — 한국 브랜드 사장님 가이드 (K-Beauty 역수출)",
    metaTitle: "태국 화장품 OEM/ODM — 한국 브랜드 사장님 실전 가이드",
    metaDescription: "태국 화장품 OEM/ODM 한국 K-Beauty 브랜드 가이드. 강한 카테고리, MOQ, GMP/KFDA 인증, 단가 비교, 추천 공급사 도시, RFQ 양식.",
    category: "한국 바이어 가이드",
    published: "2026-05-22",
    body: `\"K-Beauty 브랜드인데 한국 OEM 단가 부담 → 태국 OEM 알아본다\" 한국 사장님 사례 늘어남. 태국 화장품 OEM 실전 정리.

## 태국 화장품 OEM이 강한 이유

- **GMP 인증 OEM 다수** — 글로벌 cosmetic GMP, ISO 22716 보유
- **자생 원료** — Aloe Vera, Mangosteen, Tamarind, Tropical fruit 등 차별 원료
- **단가 우위** — 한국 대비 30-40% 절감 (작은 spec)
- **노동 비용** — 한국 1/3 수준
- **물류** — Laem Chabang → 부산 5-7일 컨테이너

## 단점

- **K-Beauty 트렌드 매칭** — 한국 트렌드 (글래스 스킨, 슬릭 등) 반영 늦음
- **포장 디자인** — 한국 디자인 감각 약함. 자체 디자인 필요.
- **새 처방 R&D** — 한국 OEM (코스맥스, 한국콜마)에 비해 느림

## 강한 카테고리

태국 OEM이 한국 OEM 대비 경쟁력 있는 카테고리:

- **클렌징** — 폼클렌징, 워시오프 마스크
- **수분 크림** (기본형) — 보습 중심
- **자외선 차단제** — 글로벌 인증 보유
- **바디케어** — 로션, 미스트, 바디 워시
- **마스크팩** — 시트 마스크 (저가)
- **남성 케어** — 진입 장벽 낮음

## 약한 카테고리

태국으로 가지 마세요:

- **고급 안티에이징** (펩타이드, 줄기세포 등) — 한국 OEM 우위
- **고기능성 카테고리** (코스메슈티컬 의약품 등) — 한국 식약처 등록 복잡
- **메이크업** (틴트, 쿠션 파운데이션) — 한국 OEM 압도

## 추천 공급사 도시

DBD 검증 강한 화장품 OEM 클러스터:

1. **방콕** — 본사 / sales / R&D. 가장 많은 공급사.
2. **사뭇사콘** — 식품 OEM과 함께 화장품 패키징 강함.
3. **사뭇쁘라깐** — 중급 OEM 다수.
4. **아유타야 (Rojana)** — 큰 OEM 일부.

[방콕 화장품 OEM TOP 10 → 자동 생성 글 / 또는 \"방콕 OEM 제조사 TOP 10\"](/ko/blog/top-manufacturer-suppliers-in-bangkok) 같이 보세요.

## MOQ 표준

- **PB (기존 처방 + 본인 라벨)**: 500-1,000 unit
- **신규 ODM (작은 처방 변형)**: 2,000-3,000 unit
- **신규 ODM (완전 신규 처방)**: 5,000-10,000 unit
- **샘플**: 50-300 unit

[MOQ 협상 가이드](/ko/blog/moq-negotiation-thai-oem)에 협상법.

## 단가 (참고용)

기본 보습 크림 30ml, 글래스 펌프 보틀:

| 항목 | 한국 OEM | 태국 OEM | 차이 |
|---|---|---|---|
| FOB 단가 | \\₩4,500 | \\₩3,000 | -33% |
| MOQ | 3,000 | 5,000 | +67% |
| 샘플비 | \\₩50,000 | \\₩40,000 | -20% |
| 리드타임 | 30일 | 35-40일 | +10-30% |

태국이 단가 1/3 절감 + MOQ 약간 높음.

## 인증 — 한국 식약처 (KFDA) 등록

태국 OEM 제품을 한국 시장 판매하려면 한국 식약처 등록 필요:

1. **태국 공급사 인증 확인** — GMP, ISO 22716, 자체 안전성 시험 결과
2. **한국 식약처 \"화장품 제조판매업\" 등록** — 본인 회사 명의
3. **개별 제품 등록** — 성분 / 안전성 시험 자료 제출
4. **식약처 심사 + 등록 완료** — 통상 1-3개월

태국 공급사가 KFDA 등록 직접 안 함 (한국 시장 진출 책임은 본인). 단, 공급사가 GMP / 안전성 시험 자료 제공해야 등록 절차 빨라짐.

[한국 식약처 등록 가이드 (외부)](https://www.mfds.go.kr) 참고.

## 할랄 인증

무슬림 시장 (말레이시아, 인도네시아, 중동) 진출 시 할랄 인증 필요. 태국 공급사 다수 할랄 보유 — RFQ 시 명시 요청.

## RFQ — 화장품 specific

화장품 OEM RFQ에 추가할 항목:

- **Product category** (skincare, cleansing, sun care 등)
- **Target market** (Korea / SEA / global)
- **Active ingredients** 요청 (Niacinamide 5%, Hyaluronic Acid 등)
- **pH / 점성 / 색상 / 향**
- **Container spec** (병 종류, 펌프, 캡, 라벨)
- **Outer box / 디자인** 별도 또는 OEM 디자인 활용
- **Certifications** required (KFDA registrable, GMP, ISO 22716)
- **Allergen / vegan claim** (해당시)

## 실전 단계

### Step 1 — 시장 조사 (한국)
- 어느 카테고리? K-Beauty 트렌드 어떤지?
- 본인 브랜드 USP 명확화

### Step 2 — 태국 공급사 RFQ
- [우리 사이트 화장품 ODM 카테고리](/c/manufacturer) — DBD 강함 우선
- 5-10곳 RFQ 동시 발송 ([RFQ 보내는 법](/ko/blog/rfq-how-to-thailand))

### Step 3 — 견적 비교
- 단가 + MOQ + 인증 + 응대 종합
- 상위 2-3곳 추리기

### Step 4 — 샘플 발주
- 50-300 unit, 각 후보사
- 품질 비교 + 본인 처방 fine-tuning

### Step 5 — 한국 식약처 등록
- 공급사 자료 받아 등록 절차 시작
- 1-3개월 소요

### Step 6 — 정식 PO
- T/T 30/70 또는 L/C
- 양산 30-60일 + 컨테이너 5-7일
- 한국 시장 출시

## 자주 묻는 거

**Q. 작은 브랜드인데 태국 OEM이 응대 잘 해주나?**
A. 신생 OEM (자본금 ฿1M-฿10M)은 OK. 대형 OEM (Charoen Pokphand 같은 곳)은 작은 발주 대응 늦음.

**Q. K-Beauty 트렌드 맞춰 줄 수 있나?**
A. 한국 OEM 대비 늦음. 본인이 한국에서 트렌드 보고 spec 명확히 전달 + 샘플 여러번 fine-tuning.

**Q. 태국 화장품을 \"한국산\" 으로 표기 가능?**
A. X. 원산지 표기는 제조국 (Thailand). \"기획 / 디자인 by Korea\" 정도 가능.

## 다음 단계

- [RFQ 보내는 법](/ko/blog/rfq-how-to-thailand)
- [MOQ 협상 가이드](/ko/blog/moq-negotiation-thai-oem)
- [태국 OEM 처음 가이드](/ko/blog/thailand-oem-first-guide)`,
    related: ["thailand-oem-first-guide", "rfq-how-to-thailand", "moq-negotiation-thai-oem", "alibaba-vs-thailand-direct"],
  },
  {
    slug: "food-oem-kfda",
    title: "태국 식품 OEM + 한국 식약처 (KFDA) 등록 — 실전 가이드",
    metaTitle: "태국 식품 OEM + KFDA 등록 — 한국 식품 브랜드 가이드",
    metaDescription: "태국 식품 OEM 한국 시장 진출 가이드. KFDA 등록 절차, HACCP/GMP 인증, 강한 카테고리, 사뭇사콘 클러스터, MOQ/리드타임.",
    category: "한국 바이어 가이드",
    published: "2026-05-22",
    body: `\"태국 식품 가공 강하다는데 한국 식약처 등록은 어떻게 하지?\" — 식품 OEM 사장님 가장 큰 장벽.

## 태국 식품 OEM 강한 이유

- **수산물 OEM 세계 최강** — 사뭇사콘 클러스터 (참치캔, 새우, 어묵)
- **가공식품 OEM** — 인스턴트 라면, 소스, 토핑
- **음료 OEM** — 코코넛 워터, 과일 주스, 인스턴트 커피
- **할랄 인증** — 글로벌 무슬림 시장
- **저단가** — 한국 OEM 대비 15-30% 절감 (대량)

## 한국 식약처 (KFDA) 등록 — 큰 그림

태국 OEM 제품을 한국 판매하려면:

1. **태국 공급사 인증** — HACCP, GMP, ISO 22000 등
2. **한국 식약처 \"수입식품영업 등록\"** — 본인 회사 명의
3. **개별 제품 \"수입신고\"** — 통관시마다
4. **표시기준 / 영양정보** 한글 라벨 부착

대분류:

- **건강기능식품**: 식약처 심사 + 기능성 인정 (개별 인정형 1년+)
- **일반 식품**: 비교적 간단 (수입신고 + 한글 라벨)
- **건강식품 / 다이어트**: 일반 식품 분류, 기능성 표시 X

## 등록 절차 (일반 식품 기준)

### Step 1 — 사업자 등록 (수입식품영업)
- 한국 식약처 \"수입식품영업 등록\" 신청
- 1-2개월
- 비용 약 \\₩100,000 (수수료) + 사무실 등록

### Step 2 — 태국 공급사 자료 수집
- HACCP 또는 GMP 인증서
- 제조 공정 자료
- 성분 분석 자료
- 미생물 / 중금속 시험 결과
- 식품첨가물 사용 자료

### Step 3 — 한글 라벨 작성
- 제품명 / 제조국 / 제조사 / 유통기한 / 보관방법
- 원재료 (모든 성분 함량 표시)
- 영양성분 (탄/단/지/나트륨 등)
- 알레르기 정보
- 본인 회사 정보

### Step 4 — 수입신고 (통관시)
- 식약처 수입식품 통합시스템 신고
- 통관 검사 (서류 + 샘플)
- 통관 1-2주

### Step 5 — 시판
- 한국 유통

## 건강기능식품 (개별 인정형)

훨씬 복잡:

- **\"새로운 기능성\" 인정 신청** — 식약처 심사 1-2년+
- **임상시험 자료** — 한국인 대상 임상 또는 충분한 해외 자료
- **안전성 시험** — 광범위
- **비용** — \\₩500만-수억

대부분 한국 OEM에서 진행. 태국 OEM 통한 건강기능식품은 \"이미 인정받은 기능성 + 본인 브랜드\" 형태로만 진행 가능.

## 강한 카테고리 — 태국 식품 OEM

1. **수산물 가공** (사뭇사콘 클러스터)
   - 참치캔, 새우, 어묵, 시푸드 믹스
   - MOQ: 컨테이너 단위 (1FCL ≈ 20,000-40,000 unit)

2. **음료** (방콕 + 사뭇쁘라깐)
   - 코코넛 워터, 과일 주스, 인스턴트 커피
   - MOQ: 컨테이너 단위 또는 5,000-10,000 unit

3. **가공식품 / 소스** (방콕 외곽)
   - 라면, 소스, 카레, 인스턴트
   - MOQ: 5,000-20,000 unit

4. **건과일 / 스낵** (북부)
   - 망고 칩, 코코넛 칩, 견과류
   - MOQ: 1,000-5,000 unit

5. **할랄 식품** (전국)
   - 일반 식품 + 할랄 인증
   - 무슬림 시장 진출시 필수

## 추천 공급사 도시

- **사뭇사콘** — 수산물 / 식품 가공 압도적
- **사뭇쁘라깐** — 음료 / 가공식품
- **방콕** — 본사 / sales
- **빠툼타니 (Nava Nakorn)** — 가공식품
- **나콘빠톰** — 경공업 식품
- **콘깬** — 동북부 농산물 가공

[사뭇사콘 식품 OEM TOP 10](/ko/blog/top-food-mfg-suppliers-in-samut-sakhon) 참고.

## 인증 우선순위

태국 공급사 보유 인증 중요한 것:

1. **HACCP** — 식품 안전 시스템. 필수.
2. **GMP** — 제조 시설 위생.
3. **ISO 22000** — 식품 안전 관리 시스템.
4. **할랄 (JAKIM Malaysia / MUI Indonesia)** — 무슬림 시장.
5. **BRC / IFS** — 영국 / 유럽 슈퍼마켓 인증 (글로벌 강함 신호).
6. **FDA Thailand (อย.)** — 태국 식약처 등록.

RFQ 시 위 인증 보유 여부 + 사본 요청.

## MOQ + 리드타임

- **샘플**: 50-200 unit, 2-3주
- **첫 lot (테스트)**: 1,000-5,000 unit (분량형 식품) 또는 1FCL (캔/음료)
- **양산 리드타임**: 30-60일

## 단가 비교 (참고)

일반 음료 (250ml 캔):

| 항목 | 한국 OEM | 태국 OEM | 중국 OEM |
|---|---|---|---|
| FOB 단가 | \\₩600 | \\₩400 | \\₩350 |
| MOQ | 50,000 | 100,000 | 80,000 |
| 컨테이너 LT | 30일 | 35일 + 7일 | 30일 + 5일 |
| KFDA 절차 | 간단 | 보통 | 보통 |

태국이 단가 중간 + 품질 안정.

## 자주 묻는 거

**Q. 태국 공급사가 한국 KFDA 절차 도와주나?**
A. 아닙니다. 본인 책임. 단, 공급사 자료 (인증서, 시험결과) 제공해야 절차 가능.

**Q. 한글 라벨 누가 작성?**
A. 본인. 한국 식품 디자인 회사 또는 식약처 등록 대행 (\\₩100K-500K/건) 활용 가능.

**Q. 통관시 문제 자주 생기나?**
A. 첫 거래시 통관 검사 강함. 서류 / 라벨 미흡시 통관 정지. 한국 통관 대행사 활용 권장.

**Q. 건강식품 (다이어트 보충제 등)도 태국 OEM 가능?**
A. 가능. 단 \"건강기능식품\" 분류는 어렵고, \"일반 식품\" 분류로 출시 추천 (기능성 표시 X).

## 통관 대행 + 식약처 등록 대행

처음이면 전문 대행사 활용 권장:

- **식약처 등록 대행**: \\₩300K-1,000K/건
- **통관 대행**: 1% 또는 \\₩300K/컨테이너
- **한글 라벨 디자인**: \\₩100K-500K/품목

총 등록 + 첫 통관 \\₩1-3M 비용 잡으세요.

## 우리 RFQ 폼 활용

[RFQ 폼](/contact) — 한국어로 spec + 인증 요구사항 입력. 우리가 HACCP/GMP/할랄 보유 공급사 5-10곳 매칭. 한국 KFDA 등록 가능한 자료 보유 여부도 확인.

## 다음 단계

- [RFQ 보내는 법](/ko/blog/rfq-how-to-thailand)
- [공장 실사 체크리스트](/ko/blog/factory-audit-checklist)
- [컨테이너 물류 가이드](/ko/blog/container-logistics-korea-thailand)`,
    related: ["rfq-how-to-thailand", "thailand-oem-first-guide", "factory-audit-checklist", "container-logistics-korea-thailand"],
  },
  {
    slug: "container-logistics-korea-thailand",
    title: "태국 → 한국 컨테이너 물류 — FCL vs LCL, 비용, 일정",
    metaTitle: "태국 → 한국 컨테이너 물류 — FCL/LCL 비용, 부산항 통관",
    metaDescription: "태국에서 한국으로 컨테이너 발송 가이드. FCL vs LCL 비용 비교, Laem Chabang 출항 → 부산 직항 5-7일, 통관 절차, Incoterms (FOB/CIF/DAP).",
    category: "한국 바이어 가이드",
    published: "2026-05-22",
    body: `OEM 발주 후 물류 단계. 태국 공급사가 출항하면 한국까지 5-7일 + 통관 1-2주. 단가/일정/위험 정리.

## 출항 항구 — 태국

- **Laem Chabang Port (촌부리)** — 메인 항구. 컨테이너 80%+ 통과.
- **Bangkok Port (Khlong Toei)** — 강 항구. 작은 화물 / 일부 컨테이너.
- **Map Ta Phut Port (라용)** — 석유화학 / 액체 화물.

발주시 공급사한테 \"FOB Laem Chabang\" 명시 권장 (단가 표준).

## 도착 항구 — 한국

- **부산항 (Busan)** — 메인. 태국 직항 컨테이너 80%+.
- **인천항** — 일부 노선. 부산보다 느림 (2-3일 추가).
- **광양항** — 동남부 / 부산 보조.

## 운송 시간

- **FCL (Full Container Load) 직항**: Laem Chabang → 부산 5-7일
- **LCL (Less than Container Load)**: 7-12일 (다른 화물과 통합)
- **항공**: 1-2일 (긴급용. 비용 5-10배)

## FCL vs LCL

### FCL (전체 컨테이너)

- **20피트 컨테이너 (20'GP)**: 약 28-30 CBM, 운임 $1,500-2,500 (Laem Chabang-Busan)
- **40피트 컨테이너 (40'GP)**: 약 58-60 CBM, 운임 $2,000-3,500
- **40피트 하이큐브 (40'HC)**: 약 68-72 CBM, 운임 $2,200-3,800

\"가득 채우는\" 발주는 FCL이 절대적 저렴. 일반 화장품 30ml 100,000 unit ≈ 1FCL (40').

### LCL (혼적)

- **CBM 단가**: $80-150/CBM (라이트 시즌 vs 성수기)
- **추가 비용**: 통합 / 분리 비용 $30-50/건
- **단점**: 시간 더 걸림, 분실/손상 위험 약간 더, 다른 화물 영향

작은 발주 (1-5 CBM)는 LCL. 큰 발주 (10 CBM+) 는 FCL 가성비.

## Incoterms 2020

발주시 어디까지 누가 책임지는지:

- **EXW (Ex-Works)** — 공장 출고시 책임 끝. 한국 바이어가 픽업 + 항만 + 통관 + 한국 운송 다 책임. 가장 싸지만 가장 복잡.
- **FOB (Free On Board)** — 출항 항구 컨테이너 적재까지 공급사 책임. 그 이후 (해상 운송 + 한국 통관 + 한국 운송) 본인.
- **CIF (Cost, Insurance, Freight)** — 한국 항만까지 공급사 책임 (운임 + 보험 포함). 본인은 통관 + 한국 운송만.
- **DAP (Delivered at Place)** — 본인 창고까지 공급사 책임 (한국 통관 + 운송 포함). 가장 편하지만 가장 비쌈.

**한국 바이어가 가장 흔히 쓰는 거**: FOB Laem Chabang 또는 CIF Busan.

## FOB 비용 구조

FOB Laem Chabang 예시 (40' FCL):

| 항목 | 비용 | 누가 |
|---|---|---|
| 제품 단가 | $50,000 | 공급사 → 바이어 |
| 공장 → Laem Chabang | $300-500 | 공급사 |
| 컨테이너 적재 / 항만 비용 | $200-400 | 공급사 |
| 해상 운임 | $2,500-3,500 | 바이어 |
| 보험 | $50-150 | 바이어 (선택) |
| 부산 항만 비용 | \\₩300K-500K | 바이어 |
| 한국 통관 | \\₩200K-500K | 바이어 |
| 부산 → 본인 창고 | \\₩300K-800K | 바이어 |

총 운송 비용 약 $3K + \\₩1-2M.

## 통관 — 한국

### 절차

1. **B/L 원본 수령** — 공급사로부터 (T/T 잔금 송금 후)
2. **한국 통관 대행사 선정** — 사전 협의
3. **수입신고서 작성** — 통관 대행사가 처리
4. **세관 검사** — 서류 + 샘플 (10-30% 확률)
5. **통관 완료 → 한국 창고 운송**

### 세금

- **관세** — HS 코드에 따라 0-30%. 화장품 보통 8%, 식품 0-20%, 의류 13%.
- **부가가치세 (VAT)** — 10%
- **한국-태국 FTA** — 적용시 관세 0-50% 할인 (원산지 증명서 필요)

총 세금 약 발주 금액의 15-40%. 미리 계산 필요.

### FTA 활용

한-아세안 FTA + 한-태국 양국 협정:

- 원산지 증명서 (CO) — 공급사가 발급 가능 (Form D 또는 Form AK)
- 관세 0-50% 할인
- 화장품 / 식품 / 의류 등 대부분 카테고리 혜택

RFQ 시 \"Can you issue Form D/AK certificate of origin?\" 명시 요청.

## 통관 대행사

한국 통관 대행 (Customs Broker):

- **대형**: 동방, 세방, 한진해운 (KCS) — 1% 또는 \\₩500K/건
- **중소**: 지역 통관사 — \\₩200K-400K/건
- **소규모 LCL 전문**: \\₩100K-200K/건

부산 항만 인접 통관사 가성비 좋음.

## 한국 운송 — 부산 → 본인 창고

- **컨테이너 배달 (FCL)**: \\₩500K-1,000K (부산 → 서울 기준)
- **LCL 인출 + 배달**: \\₩100K-300K
- **냉장 / 냉동 화물**: +50-100%

## 일정 타임라인 (실전)

40' FCL 화장품 발주:

| 일차 | 단계 | 위치 |
|---|---|---|
| Day 1 | PO 확정 + 30% T/T | 한국 |
| Day 1-30 | 양산 | 태국 공장 |
| Day 31 | 출항 + B/L | Laem Chabang |
| Day 32 | 70% T/T | 한국 → 태국 |
| Day 32-38 | 해상 운송 | 태평양 |
| Day 38 | 부산 도착 | 부산 |
| Day 38-45 | 통관 + 검사 | 부산 |
| Day 46 | 본인 창고 도착 | 한국 |
| Day 47+ | 출시 준비 | 한국 |

PO부터 시장 출시까지 약 50일.

## 위험 + 보험

해상 운송 위험:

- **컨테이너 분실** — 드물지만 발생 (1만건 중 1건)
- **습기 / 곰팡이** — 컨테이너 내부
- **해상 사고** — 침몰 등 극히 드뭄
- **세관 검사 지연** — 1-2주 지연

해상 보험 (Marine Insurance) 비용: 화물 가치의 0.1-0.3%. CIF 인코텀즈는 공급사가 가입. FOB는 본인 가입.

## 자주 묻는 거

**Q. LCL인데 다른 화물과 섞여서 손상 위험?**
A. 약간 있음. 포장 강하게 + 사진 기록 권장. 손상시 LCL 대행사 보험으로 처리.

**Q. 부산항 통관 얼마나 걸리나?**
A. 일반 1-3일. 검사 걸리면 1-2주.

**Q. 컨테이너 안 가득 차면 빈 공간 비용 부담?**
A. FCL은 컨테이너당 가격이라 빈 공간 손해. LCL이 적당.

**Q. 한국 항공 운송 가능?**
A. 인천공항 / 김포공항 → 가능. 단 단가 5-10배. 긴급 또는 작은 고가 화물만.

## 다음 단계

- [T/T vs L/C 결제 비교](/ko/blog/tt-vs-lc-payment)
- [공장 실사 체크리스트](/ko/blog/factory-audit-checklist)
- [태국 OEM 처음 가이드](/ko/blog/thailand-oem-first-guide)`,
    related: ["tt-vs-lc-payment", "thailand-oem-first-guide", "factory-audit-checklist"],
  },
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
  {
    slug: "thailand-ev-manufacturing-shift",
    title: "태국 EV 전환 — 한국 부품사가 알아야 할 5가지",
    metaTitle: "태국 EV 전환 — BYD, 현대, LG 그리고 한국 부품사 기회",
    metaDescription:
      "태국이 내연기관 생산기지에서 EV 조립 허브로 전환 중. BYD·AION·Foxconn 입주, 현대·기아 현지 생산, 배터리 팩 공급망 재편 — 한국 부품 SME의 기회와 현실.",
    category: "Industry",
    published: "2026-06-07",
    body: `태국 정부는 2030년까지 자동차 생산의 30%를 EV로 전환하겠다는 목표를 발표했다. 숫자만 보면 '먼 얘기'처럼 들리지만, 공장 착공 속도는 이미 2026년을 달리고 있다.

## 1. 누가 공장을 짓고 있나

**BYD**: Rayong 라용 WHA Eastern Seaboard 산단에 연산 15만 대 규모 조립공장. 2024년 착공, 2025년 말 가동. 태국·ASEAN 내수 + 수출 겸용.

**AION (GAC)**: 라용에 조립공장 착공. 연산 5만 대 규모.

**Foxconn + PTT**: MIH 플랫폼 기반 EV 조립 합작 — Eastern Seaboard.

**현대자동차**: 기존 태국 딜러망 활용. 아직 현지 조립은 없지만 ASEAN 수출 기지 검토 중.

**LG에너지솔루션 / 삼성SDI**: 라용 Map Ta Phut 인근 — 셀 공급은 한국·폴란드 공장이지만 **배터리 팩 조립**은 태국 현지화 논의 진행.

## 2. 부품 공급망 재편의 핵심 — Tier 2/3

BYD가 태국에서 조립하면 기존 Toyota/Honda 라인을 보던 일본계 Tier 1 부품사가 수혜를 보는 게 아니다. BYD는 **직접 조달** 또는 **중국계 Tier 1**을 먼저 당긴다.

한국 SME 기회가 있는 레이어: **Tier 2/3 범용 부품** — 금속 프레스, 사출 성형, 배선 하네스, 냉각 시스템 하우징, 인버터 케이스, 충전 커넥터 하우징.

이 카테고리는 BYD가 "현지 조달" 요구 시 **ISO 9001 + IATF 16949**를 보유한 태국 현지 공급사로 routing되는데, 한국 SME가 **태국 현지법인** 또는 **OEM 파트너** 방식으로 참여할 수 있다.

## 3. 배터리 팩 vs 배터리 셀

셀 공급은 단기적으로 한국·중국 공장이 지배. 태국에서 현실적인 기회는 **팩 조립 + BMS (Battery Management System)** — 셀을 모듈·팩으로 묶는 공정이다.

LG엔솔·삼성SDI는 이미 태국 현지 파트너 탐색 중. EV 팩 조립은 **자동차 배선 하네스 경험**이 있는 업체가 가장 빠르게 전환 가능하다.

## 4. 태국 정부 BOI 인센티브 — EV 전용

BOI는 EV 관련 투자에 최대 **8년 법인세 면제** + 기계류 수입관세 면제를 제공. 해당 카테고리:
- EV 완성차 조립 (A1)
- 배터리 팩·모듈 조립
- 모터·인버터·컨트롤러
- 충전 인프라 제조

한국 SME가 태국에 **제조 법인**을 세우고 EV 부품을 생산하면 BOI 신청 자격이 된다. [BOI 승인 공장 목록](/best/boi-eligible) 참고.

## 5. 리스크와 현실

**일본계 Tier 1의 반격**: Toyota·Honda 내연기관 감산 → 일본계 Tier 1이 EV 부품으로 전환 시도. 한국 SME보다 기존 관계망이 강함.

**중국계 부품사 직진입**: BYD 공장 주변으로 CITIC, Sunwoda, CATL 등 중국계 부품사가 태국 법인 설립 중. 가격 경쟁력 우위.

**현실적 결론**: 태국 EV 전환은 기회이지만 **'내연기관 → EV 자동 전환'은 아니다**. 신규 고객(BYD, AION)에 적합한 **새 부품**을 개발하거나, 기존 태국 법인의 생산 라인을 EV 부품 방향으로 확장하는 전략이 현실적.

관련 공급사: [자동차 부품](/c/auto_parts) · [제조사](/c/manufacturer) · [BOI 승인 공장](/best/boi-eligible)`,
    related: ["korean-sme-thai-entry-pattern", "amata-vs-wha-quick-take"],
  },
];

export const POSTS_KO: Post[] = [...POSTS_KO_MANUAL, ...POSTS_AUTO_KO].sort(
  (a, b) => (a.published < b.published ? 1 : -1),
);

export function findPostKo(slug: string): Post | null {
  return POSTS_KO.find((p) => p.slug === slug) ?? null;
}
