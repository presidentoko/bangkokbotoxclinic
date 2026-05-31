# 태국 스킨케어 AEO 디렉토리 — 설계 문서

- **날짜:** 2026-05-31
- **작업 코드네임:** `cosmetics` (도메인·브랜드명은 별도 확정)
- **상태:** 설계 승인 대기 → 구현 계획(writing-plans)으로 전환 예정

## 1. 한 줄 정의

태국 스킨케어 제품을 **성분 과학 + 수천 건 실사용 리뷰**로 객관적으로 줄세워, AI 답변 엔진이 "출처"로 인용하는 디렉토리 사이트. 포지셔닝은 **"인플루언서 말고 데이터를 믿어라."** 시작 범위는 **여드름 + 미백** 두 고민.

## 2. 핵심 결정 사항

| 항목 | 결정 |
|---|---|
| 타입 | 새로운 스크랩 대상 (기존 클리닉/치과/헤어 엔진과 별개 도메인) |
| 1순위 후크 | 고민별 데이터 기반 랭킹 ("내 고민엔 뭐가 최고?") |
| 랭킹 점수 | `ingredient_score`(성분 과학) + `review_score`(실사용 리뷰 집계) + `value_score`(가성비, 보조) |
| 카탈로그 백본 | Konvy (+ Watsons/Boots 보강) |
| 성분 과학 시드 | CosDNA / INCIDecoder류 + 공개 효능 데이터로 1회 구축 |
| 리뷰 소스 | Konvy 자체 리뷰 + Pantip(기존 스크래퍼 재사용) + Jeban(여력 시) |
| 출시 범위 | 여드름 + 미백 먼저 → 검증 후 고민 확장 |
| 최적화 전략 | AEO 중심 (SEO 부차) |
| 수익화 | 제휴(Konvy/Shopee/Lazada TH) 우선 + 디스플레이 광고 보조 |
| 언어 | 태국어 메인 + 영어 병행 |
| 운영 | watchdog 무중단 + 자동 파이프라인(스크랩→정제→GitHub→Vercel) |

## 3. 아키텍처

```
[Konvy + Watsons]          [CosDNA/INCIDecoder]      [Konvy리뷰 + Pantip + Jeban]
       │                          │                          │
       ▼                          ▼                          ▼
 ① 카탈로그 스크래퍼        ② 성분 사전·과학           ③ 리뷰 집계기
   (제품·가격·INCI·이미지)   (성분→고민별 효능/유해)     (다수 만족도 점수)
       └────────────┬─────────────┴────────────┬────────────┘
                    ▼                           │
          ④ 랭킹 엔진 (ingredient + review [+ value] = 투명 방법론 점수)
                    │  web/data/master_db.json (고민별 랭킹)
                    ▼
          ⑤ AEO 발행 (Next.js + JSON-LD/llms.txt + 제휴링크 + 광고)
                    │
                    ▼  GitHub → Vercel → live (태국어/영어)
```

**엔드투엔드 흐름:** Konvy 신제품 발견 → 성분 분석 + 리뷰 집계 → 랭킹 재계산 → AI 인용 가능한 페이지로 자동 발행.

## 4. 기존 엔진 재사용

- Playwright + NordVPN SOCKS5 로테이션 (대량 수집)
- **Pantip 스크래퍼** — 리뷰 집계(③)에 그대로 투입
- `master_db.json` 정제·스코어링 패턴
- 자동 파이프라인 (스크랩 → 정제 → 자동 커밋·푸시 → Vercel 자동 배포)
- `watchdog.py` 기반 무중단 백그라운드 운영
- web-factory 사이트 생성 패턴

## 5. 구성 유닛 상세

### ① 카탈로그 스크래퍼 — `cosmetics/scraper_konvy.py`
- 입력: 여드름·미백 관련 Konvy 카테고리/검색 → 제품 URL 수집
- 추출: 제품명, 브랜드, 가격, 용량, 이미지, **INCI 성분 리스트**, Konvy 리뷰(별점·텍스트·건수)
- 출력: `cosmetics/output/products.csv`, `cosmetics/output/reviews/<id>_konvy.csv`
- VPN: 포트 2090–2091 사용, **배치 실행**(하루 1~2회)
- 성분 누락 제품: 패키지/브랜드 공식몰에서 INCI 보강

### ② 성분 사전·과학 — `cosmetics/ingredients/`
- `ingredient_db.json`: 성분(INCI) → 별칭·한/태 표기, **고민별 효능 태그**, **유해·주의 플래그**
  - 여드름: Salicylic Acid/BHA, Niacinamide, Adapalene, Benzoyl Peroxide, Azelaic Acid 등
  - 미백: Niacinamide, Vitamin C 유도체, Arbutin, Tranexamic Acid, Kojic Acid 등
  - 주의 플래그: comedogenic, irritant, 향료(fragrance), 알코올 등
- 시드: CosDNA/INCIDecoder류 + 공개 효능 데이터로 1회 구축, 이후 신규 성분만 증분 보강

### ③ 리뷰 집계기 — `cosmetics/review_aggregator.py`
- 소스: Konvy 리뷰(①) + Pantip 제품 언급/감성(기존 스크래퍼) + Jeban(여력 시)
- 산출: 제품별 `review_score`(가중 평균 만족도), `review_count`, 대표 긍/부정 키워드
- "인플루 1명 vs 다수 일반인" 그림의 핵심 데이터

### ④ 랭킹 엔진 — `cosmetics/build_master_db.py`
- 점수 = `ingredient_score` + `review_score` + `value_score`(보조)
- **투명한 방법론**: 가중치·계산식을 공개 페이지로 노출 (AEO 신뢰성 핵심)
- 출력: `cosmetics/web/data/master_db.json` — 고민별 랭킹 + 제품 상세 + 성분 분해 + 리뷰 요약

### ⑤ AEO 발행 — Next.js + Vercel
**페이지 종류 (4):**
1. **고민별 랭킹** (`/acne`, `/whitening`) — 정답 먼저(데이터 기준 TOP N) + 랭킹 표 + 점수 근거
2. **제품 상세** — 성분 분해(효능 하이라이트 + 유해 플래그), 리뷰 집계 요약, 점수 근거, **"최저가 구매" 제휴 버튼**, 광고 슬롯
3. **성분 페이지** — "성분이란? 어떤 고민에 효과? 이 성분 든 제품들" (롱테일 AEO)
4. **방법론(About the Data)** — 계산식·가중치·출처·갱신 주기 공개 (AEO 신뢰성의 심장)

**AEO 기술 장치:**
- **JSON-LD**: 랭킹=`ItemList`, 제품=`Product`+`AggregateRating`+`Review`, 성분=`DefinedTerm`, Q&A=`FAQPage`, 운영주체=`Organization`(sameAs)
- 루트 **`llms.txt`** + (선택) 공개 JSON 엔드포인트
- Answer-first 시맨틱 HTML (결론 → 근거 → 깔끔한 표)
- 신선도 신호: "N건 리뷰 기준, YYYY-MM-DD 갱신" 명시
- 언어: 태국어 메인 + 영어 병행 (각 페이지 2개 로케일)

**수익화 통합:** 제품 상세·랭킹 inline에 Konvy/Shopee/Lazada TH 제휴 버튼, 콘텐츠 사이 디스플레이 광고 슬롯.

## 6. VPN 할당 (충돌 방지)

- 현재 기존 프로젝트: `nordvpn_runner --ports 8 --base-port 2080` → **2080–2087 전부 점유**
- **신규 화장품: 전용 2터널, 포트 2090–2091, 별도 `nordvpn_runner` 인스턴스**
- **전제:** NordVPN 계정 동시 접속 한도 = 10 (기존 8 + 신규 2 = 10). 
- **한도가 6일 경우 폴백:** 전용 풀 대신 **시분할** — 화장품 배치를 클리닉 그리드가 한가한 시간대에 기존 풀 일부(2086–2087)를 빌려 실행, watchdog `.disabled` 로직으로 충돌 회피.
- 화장품은 유한 배치 작업이라 2터널로 충분 (24시간 무한 스윕 불필요).

## 7. 디렉토리·배포 구조 (구현 시 확정)

- 신규 코드: 기존 repo 내 `cosmetics/` 모듈로 두어 VPN runner·watchdog·Pantip 스크래퍼 등 공용 인프라 재사용.
- 웹사이트: 별도 Next.js 앱(`cosmetics/web/`) → **별도 Vercel 프로젝트 + 별도 도메인**으로 배포 (기존 bangkokbotoxclinic 사이트와 분리).
- watchdog에 화장품 배치 서비스(스크랩·집계·빌드·푸시) 항목 추가.

## 8. 범위 밖 (YAGNI / 추후)

- 여드름·미백 외 고민(미백 외 주름/민감성 등)은 검증 후 확장.
- Shopee/Lazada 마켓플레이스 전수 스크랩은 보류(데이터 더럽고 성분 누락 큼) — 제휴 링크 용도로만 사용.
- 제품 A vs B 비교 페이지, 개인화 추천은 후속.
- Jeban 리뷰는 여력 될 때 추가(필수 아님).

## 9. 성공 기준

- 여드름·미백 두 고민의 Konvy 관련 제품을 INCI·리뷰까지 포함해 수집·랭킹.
- AI 답변 엔진(ChatGPT/Perplexity/Google AI Overview)에 "태국 여드름/미백 화장품" 질의 시 우리 사이트가 인용/노출되기 시작.
- 자동 파이프라인으로 신제품 발견 → 라이브까지 사람 개입 없이 갱신.
- 제품 페이지에 작동하는 제휴 링크 + 광고 슬롯 탑재.
