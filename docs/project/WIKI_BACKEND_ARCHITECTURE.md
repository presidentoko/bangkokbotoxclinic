# Consolidated Wiki Backend — Architecture

목표: 방콕 클리닉(클리닉/덴탈/헤어) 분야에서 구글/AEO를 덮을 수 있는
단일 데이터 백엔드를 만들고, 기존 sister 사이트들이 그 위에서 niche view를 렌더.

## 핵심 원칙
1. **Single source of truth** — `web/data/master_db.json`이 canonical.
2. **Source-tagged enrichment** — Google / HDmall / Pantip / 향후 WhatClinic·Naver 각각 자기 namespace 필드.
3. **Bucket-aware** — 모든 clinic이 `buckets: [hair|cosmetic|dental]` 태그를 가져서 sister 사이트가 자기 카테고리만 필터.
4. **AEO/SEO ready** — 구조화된 데이터 + 구조화된 인용(snippet + source URL) → LLM 인용 가능.
5. **출처 투명** — 모든 fact에 source 표시 (영업 자료 신뢰도 + 위키 신뢰도 둘 다 챙김).

## 현재 데이터 흐름 (2026-05-22 기준)

```
┌─ Google Maps (live scraper)
│    bangkok_clinics/output/clinics.csv + reviews/
│    dental_output/<city>/                       (dental grid)
│    merge_handoff/_export/                       (pre-scraped hair/dental)
│
├─ HDmall (hdmall_scraper)
│    web/data/external_reviews/<id>.json
│    web/data/pricing/<id>.json
│    web/data/doctor_xref/<id>.json
│
├─ Pantip (pantip_scraper, **NEW 2026-05-22**)
│    pantip/output/clinics/<id>.json              (mention 인덱스)
│    pantip/output/threads/<tid>.json             (canonical thread 본문/댓글)
│
└─ master_db_builder (watch_and_build.py, 5min poll)
       ↓ build_master_db.py
       ↓   - GMaps + dental + merge_handoff → clinic record 생성
       ↓   - merge_external_data() — HDmall reviews + pricing
       ↓   - merge_pantip_data()    — Pantip mention 인덱스 (NEW)
       ↓
   web/data/master_db.json  (~5000 clinics, source-tagged enrichment)
       ↓
   각 sister site의 watch_and_build → niche view 생성
   - web                  → BangkokClinic (botox/dental B2C)
   - thaifacialclinic     → hair B2C
   - web-restaurants      → 식당 (별도)
   - web-factory          → ??
   - TopClinic Hostinger  → B2B 정적
```

## clinic record 스키마 (현재 + 향후)

```json
{
  "id": "0x...",
  "place_id": "...",
  "name": "Aura Bangkok Clinic Sathon",
  "name_lang": {"th": "...", "en": "..."},

  // === GMaps 핵심 필드 (이미 존재) ===
  "primary_type": "Skin care clinic",
  "address": "...",
  "city_label": "Bangkok",
  "district": "Sathon",
  "phone": "...",
  "website": "...",
  "lat": 13.7, "lng": 100.5,
  "rating": 4.5, "total_reviews": 3617,
  "categories": ["facial", "filler"],
  "scraped_review_count": 200,
  "language_breakdown": {"th": 150, "en": 50},
  "service_mentions": {"botox": 30, "filler": 80, ...},
  "sample_reviews_th": [...],
  "sample_reviews_en": [...],
  "sample_reviews_negative": [...],
  "doctor_stats": [{"name": "...", "clinic_doctor_url": "..."}],
  "rating_trend": {...},

  // === HDmall 보강 (이미 존재) ===
  "external_reviews": [...],     // HDmall scraper 결과
  "pricing": [...],              // 시술별 가격

  // === Pantip 보강 (NEW 2026-05-22) ===
  "pantip": {
    "fetched_at": "...",
    "candidates_total": 11,
    "mention_count": 10,
    "branch_specific_count": 9,   // 영업 자료 신뢰도 시그널
    "score_distribution": {"4": 1, "3": 7, "1": 2},
    "top_mentions": [             // 최대 5개, branch_specific 가산
      {
        "topic_id": "43093572",
        "url": "https://pantip.com/topic/43093572",
        "title": "...",
        "score": 3,
        "branch_specific": false,
        "op_mentioned": true,
        "title_mentioned": true,
        "comment_count_with_mention": 0,
        "sample_snippet": "..."
      }
    ]
  },

  // === 향후 enrichment 자리 ===
  "buckets": ["cosmetic"],         // hair/dental/cosmetic — sister site filter용 (NEW)
  // "whatclinic": {...},          // curl_cffi 뚫리면 추가
  // "naver_blog": {...},          // 한국 관광객 타겟 콘텐츠
  // "facebook": {...},            // FB 페이지 리뷰
  // "wiki": {                     // (향후) 위키 페이지 생성용 통합 콘텐츠
  //   "summary_th": "...",
  //   "summary_en": "...",
  //   "key_facts": [...],
  //   "faq": [...],
  //   "schema_org_jsonld": {...}  // SEO/AEO 직접 export
  // }
}
```

## 영업/리드 직결 시그널

| 시그널 | 의미 | 출처 |
|---|---|---|
| `pantip.branch_specific_count >= 5` | 이 지점에 대한 실제 후기 다수 — 영업 시 "고객들이 말하는 우리 지점" 자료로 사용 | Pantip 매칭 |
| `pantip.score_distribution.4 > 0` | 제목+본문+댓글 모두 등장 = 강력한 brand awareness | Pantip 매칭 |
| `external_reviews.length > 10` | HDmall에서 실거래 리뷰 보유 | HDmall |
| `rating_trend.recent_avg < overall_avg` | 최근 평점 하락 — 위기 알림 후 영업 chance | GMaps |
| `language_breakdown.en > th * 0.3` | 외국인 환자 비중 높음 — 의료관광 영업 적합 | GMaps |

## SEO/AEO 콘텐츠 생성 전략 (향후 작업)

### Phase 1: 데이터 통합 (현재 완료)
- ✅ Pantip 머지 (2026-05-22)
- 🔲 WhatClinic 머지 (curl_cffi POC 통과 시)
- 🔲 Naver 블로그 머지 (한국 관광객 타겟 콘텐츠)
- 🔲 Facebook 페이지 리뷰 (가능하면)

### Phase 2: 양국어 위키 콘텐츠 생성
- 클리닉 1개당 long-form 페이지 (TH + EN)
- 자동 생성: GMaps 리뷰 요약 + HDmall 가격 표 + Pantip 토픽 발췌
- 수동 큐레이션 가능한 영역: 위치/접근성 가이드, 의사 프로필, 서비스 설명

### Phase 3: SEO/AEO 최적화
- `schema.org` JSON-LD 자동 생성 (MedicalBusiness, Review, AggregateRating)
- IndexNow ping (이미 `scripts/indexnow_ping.py` 존재) → 새 페이지 자동 색인 요청
- hreflang TH/EN
- canonical URL 전략
- AEO 형식: 명확한 Q&A 섹션, 비교 표, 날짜 표시 ("As of 2026-05")

### Phase 4: 자동 위키 (대안 단일 신규 도메인)
- 결정 보류 — 신규 도메인 vs 기존 sister 사이트 강화 — 사용자 결정 필요

## 첫 구체 결과물 (2026-05-22 23:00 기준)

- `build_master_db.py`에 `merge_pantip_data()` 함수 추가됨
- `watch_and_build.py`가 `pantip/output/clinics/` mtime 추적 → Pantip 새 데이터 들어오면 자동 재빌드
- 첫 빌드 결과: **42개 클리닉에 Pantip mention 머지 완료** (Vincent 16, APEX Pattaya 13, Smile Seasons 13, Sowon 12, Aura 11 등)
- master_db.json에 `with_pantip_mentions: 42` 통계 추가

## 다음 작업 제안 (사용자 review 후)

**즉시 가치 (1-2일)**:
1. sister 사이트 frontend가 `clinic.pantip` 필드를 표시하도록 업데이트 (예: "고객 후기 N건" 위젯)
2. `pantip.top_mentions[0].sample_snippet`를 SEO 본문에 통합 (실 후기 인용 → AEO에서 LLM이 인용)
3. `branch_specific_count` 활용 영업 우선순위 매기기 (지점별 신뢰 가능 데이터 가진 클리닉부터 영업)

**중장기 (1-4주)**:
1. WhatClinic 재시도 (curl_cffi)
2. Naver 블로그 스크래퍼 (한국 관광객 타겟 → ScanMyFate / ThaiFacialClinic SEO에 직접 도움)
3. 위키 페이지 자동 생성기 (clinic 1개당 markdown → next.js 페이지)
4. JSON-LD schema.org export
