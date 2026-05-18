# thaisupplyhub.com 데이터 통합 가이드

이 문서는 `C:\dbd-scraper\export\` 안 CSV들을 thaisupplyhub 코드베이스에 무중단으로 연결하는 방법입니다.
Claude/AI 코딩 도구에 그대로 붙여넣으면 됩니다.

---

## 1. 파일 목록과 용도

| 파일 | 행 수 | 용도 | 1차 키 |
|---|---|---|---|
| **`thaisupplyhub_verified_final.csv`** | 890 | 🏆 `/best/highly-recommended` + 사이트 메인 후보. DBD 법인 검증된 B2B만. | `place_id` |
| **`thaisupplyhub_premium_final.csv`** | 3,347 | ✨ `/supplier/{place_id}` 메인 풀. 최소 1개 시그널 보유한 B2B. | `place_id` |
| `thaisupplyhub_master.csv` | 36,919 | 🔍 검색용 broad 풀 (지도/자동완성 백엔드). | `place_id` |
| `thaisupplyhub_reviews.csv` | 2,925 | 📝 long-format Google 리뷰 (이미 `*_final.csv`에 머지됨). | (`place_id`, reviewer) |
| `11_01_active_companies.csv` | 364,312 | 🔗 DBD active 회사 (fuzzy match로 supplier 보강에 이미 사용). 추가 머지가 필요할 때만. | `reg_no` |
| `11_02_dissolved_companies.csv` | 95,894 | ⚠️ DBD 폐업 — supplier 표시 전 블랙리스트 체크용. | `reg_no` |
| `halal_products.csv` | 913 | Halal 인증 제품 (브랜드별). | `halal_cert_no` |
| `ieat_tenants_from_dbd.csv` | 86 | 공단 입주 신규 등록 (보조 데이터). | `reg_no` |

> 사이트에 import 할 CSV: **`thaisupplyhub_verified_final.csv` + `thaisupplyhub_premium_final.csv`**.
> 나머지는 백엔드 lookup / 미래 보강용.

---

## 2. 1차 키: Google Place ID (CID)

모든 supplier 행은 `place_id` 컬럼이 **유일 키**입니다. 형식은 `ChIJxxxxxxxxxx` (Google Place CID, 27자).

thaisupplyhub URL이 이미 `/supplier/ChIJaTnheAW_4jAR2YEf_gcxkRQ` 형식을 쓰고 있으므로 **URL 패턴 변경 없이 바로 연결됨**.

```python
# 이 supplier의 사이트 URL
url = f"/supplier/{row['place_id']}"
```

---

## 3. CSV 컬럼 레퍼런스 (`*_final.csv`)

| 컬럼 | 타입 | 설명 | NULL 가능 |
|---|---|---|---|
| `place_id` | string | **Google Place CID — primary key, URL slug** | ❌ |
| `name` | string | 표시 이름 (Google Maps 기준) | ❌ |
| `lat`, `lng` | float | GPS 좌표 | ✅ |
| `rating` | float (0-5) | Google 평점 | ✅ |
| `review_count` | int | Google 리뷰 수 | ✅ |
| `phone` | string | 전화번호 (+66 또는 0xx) | ✅ |
| `website` | string | 공식 웹사이트 URL | ✅ |
| `google_category` | string | Google Maps 카테고리 (예: "Auto parts manufacturer") | ✅ |
| `address_street` | string | 주소 (영문 위주) | ✅ |
| `city_field`, `province_en` | string | 도시 / 영문 province | ✅ |
| `google_maps_url` | string | 원본 Google Maps URL (이미지/네이티브 링크용) | ✅ |
| **DBD enrichment** | | (verified는 100%, premium은 일부) | |
| `dbd_reg_no` | string | 태국 법인 등록번호 (13자리) | ✅ |
| `dbd_legal_name` | string | 정식 법인명 (태국어, `บจ.X จำกัด`) | ✅ |
| `dbd_capital_thb` | float | 등록 자본금 (THB) | ✅ |
| `dbd_registered_date` | date (ISO) | 설립일 (그레고리력으로 변환됨) | ✅ |
| `dbd_tsic_code` | string | 태국 표준산업분류 코드 | ✅ |
| `dbd_purpose` | string | 사업 목적 (태국어) | ✅ |
| `dbd_match_score` | float | 매칭 신뢰도 (0-100, 80↑만 매칭됨) | ✅ |
| `dbd_is_dissolved` | bool | 폐업 여부 (TRUE면 표시 제외) | ✅ |
| **YP enrichment** | | | |
| `yp_biz_id` | string | Yellow Pages 비즈 ID | ✅ |
| `yp_sub_category` | string | YP 세부 카테고리 | ✅ |
| `yp_description` | string | YP 비즈니스 설명 | ✅ |
| **Halal** | | | |
| `is_halal_certified` | bool | Halal 인증 보유 여부 | ✅ |
| `halal_brand_matched` | string | 매칭된 Halal 브랜드명 | ✅ |
| **공단 매핑** | | | |
| `estate_name` | string | 입주 공단명 (예: "Amata City Chonburi") | ✅ |
| `estate_slug` | string | URL-safe slug (예: "amata-city-chonburi") | ✅ |
| **계산 시그널** | | | |
| `years_in_business` | int | 사업 연수 (DBD 설립일 기준) | ✅ |
| `b2b_score` | float | 정렬용 B2B Score (높을수록 신뢰) | ❌ |
| `trust_score` | float | 구버전 (리뷰 가중) | ✅ |
| `data_sources` | string | 출처 (`gongdan,dbd,yp,halal` 같이 CSV) | ❌ |
| **리뷰 통합** | | | |
| `reviews_scraped_count` | int | 수집된 리뷰 수 | ✅ |
| `avg_scraped_rating` | float | 수집 리뷰 평균 평점 | ✅ |
| `top_review_text` | string | **가장 긴 리뷰 (메타 설명용)** | ✅ |
| `reviews_concat` | string | 파이프 구분 리뷰 스니펫 (SEO용) | ✅ |
| `reviews_json` | string (JSON) | **전체 리뷰 배열 — 페이지 렌더링용** | ✅ |
| **사진 통합** | | (verified 890 중 668 / 75% 보유) | |
| `photos_count` | int | 수집된 사진 URL 수 (보통 1-8개) | ✅ |
| `top_photo_url` | string | **첫 번째 사진 URL (썸네일·og:image용)** | ✅ |
| `photo_urls_concat` | string | 파이프 구분 사진 URL 목록 | ✅ |
| `photo_urls_json` | string (JSON) | **전체 사진 URL 배열 — 갤러리 렌더링용** | ✅ |
| **기타** | | | |
| `is_consumer` | bool | 소비자(식당/카페) 카테고리 (B2B 제외 플래그) | ❌ |

---

## 4. URL 패턴별 데이터 매핑

### 4.1 `/supplier/{place_id}` (개별 supplier 페이지)

```python
import pandas as pd, json

df = pd.read_csv("thaisupplyhub_premium_final.csv", encoding="utf-8-sig")
row = df[df["place_id"] == "ChIJxxxxxxxx"].iloc[0]

reviews = json.loads(row["reviews_json"]) if pd.notna(row["reviews_json"]) else []
photos  = json.loads(row["photo_urls_json"]) if pd.notna(row["photo_urls_json"]) else []

page = {
    "title": row["name"],
    "h1": row["name"],
    "meta_description": (row["top_review_text"] or row["dbd_purpose"] or "")[:160],
    "og_image": row["top_photo_url"],   # 첫 번째 사진을 OG/썸네일로
    "phone": row["phone"],
    "website": row["website"],
    "address": row["address_street"],
    "lat": row["lat"], "lng": row["lng"],
    "rating": row["rating"], "review_count": row["review_count"],
    "category": row["yp_sub_category"] or row["google_category"],
    "established": row["dbd_registered_date"][:4] if pd.notna(row["dbd_registered_date"]) else None,
    "years": row["years_in_business"],
    "capital_thb": row["dbd_capital_thb"],
    "legal_name": row["dbd_legal_name"],
    "registration_no": row["dbd_reg_no"],
    "is_halal": bool(row.get("is_halal_certified")),
    "estate": row["estate_name"],
    "reviews": reviews,        # [{reviewer, rating, date, text}, ...]
    "photos": photos,          # ["https://lh3.googleusercontent.com/...", ...]
    "trust_score": row["b2b_score"],
}
```

### 4.2 `/c/{category}` (카테고리 페이지)

```python
# 카테고리 슬러그 매핑 (사이트 기존 카테고리에 맞춤)
CATEGORY_MAP = {
    "manufacturer": ["Manufacturer", "Industrial equipment supplier"],
    "auto_parts": ["Auto parts manufacturer", "Auto parts store"],
    "warehouse":  ["Warehouse", "Storage facility"],
    "industrial_estate": ["Industrial estate"],
    # ... 사이트 기존 슬러그와 매핑
}

for slug, gmap_cats in CATEGORY_MAP.items():
    suppliers = df[df["google_category"].isin(gmap_cats)] \
                  .sort_values("b2b_score", ascending=False)
    # /c/{slug} 페이지 생성
```

### 4.3 `/estate/{estate_slug}` (공단 페이지)

```python
estates = df[df["estate_slug"].notna() & (df["estate_slug"] != "")] \
            .groupby("estate_slug") \
            .agg(tenants=("place_id", "count"),
                 name=("estate_name", "first")) \
            .reset_index()
# 각 estate_slug마다 /estate/{slug} 페이지
# 페이지 내용: 그 estate에 입주한 supplier 목록 (tenants)
```

### 4.4 `/best/highly-recommended` (큐레이션 페이지)

```python
verified = pd.read_csv("thaisupplyhub_verified_final.csv", encoding="utf-8-sig")
top = verified.sort_values("b2b_score", ascending=False).head(50)
# 상위 50개로 highly-recommended 리스트 생성
```

### 4.5 `/city/{city_slug}` (지역 페이지)

```python
# city_field 또는 province_en 기준 group
for city, grp in df.groupby("city_field"):
    if pd.isna(city) or not city: continue
    slug = slugify(city)
    # /city/{slug} 페이지
```

---

## 5. JSON-LD Schema.org (SEO/AEO 핵심)

각 `/supplier/{place_id}` 페이지에 다음을 삽입하면 Google + LLM이 인용:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://thaisupplyhub.com/supplier/{place_id}",
  "name": "{name}",
  "legalName": "{dbd_legal_name}",
  "image": ["{top_photo_url}", ...photo_urls_json],   // 갤러리 — schema는 사진 배열 받음
  "identifier": {
    "@type": "PropertyValue",
    "name": "Thai Business Registration",
    "value": "{dbd_reg_no}"
  },
  "foundingDate": "{dbd_registered_date}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{address_street}",
    "addressLocality": "{city_field}",
    "addressRegion": "{province_en}",
    "addressCountry": "TH"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": {lat},
    "longitude": {lng}
  },
  "telephone": "{phone}",
  "url": "{website}",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": {rating},
    "reviewCount": {review_count}
  },
  "review": [
    {
      "@type": "Review",
      "author": {"@type": "Person", "name": "{reviewer}"},
      "datePublished": "{date}",
      "reviewBody": "{text}"
    }
    // reviews_json을 펼친 것
  ]
}
</script>
```

### Open Graph (소셜 공유 메타)

```html
<meta property="og:image" content="{top_photo_url}">
<meta property="og:title" content="{name} - Verified Thai Supplier">
<meta property="og:description" content="{top_review_text or dbd_purpose}">
<meta property="og:type" content="business.business">
```

**이게 중요한 이유:** Trust Score "verified by DBD" 라는 사이트 셀링포인트가 schema의 `identifier`(공식 등록번호) + `foundingDate`(설립일)로 표현됨. LLM이 "이 공급사 신뢰할 만한가?"에 답할 때 이걸 인용함.

---

## 6. 폴백 규칙 (필수)

| 상황 | 처리 |
|---|---|
| `name` 없음 | 행 무시 |
| `rating` 없음 | "No reviews yet" 표시, schema의 aggregateRating 생략 |
| `dbd_reg_no` 없음 | "Unverified" 뱃지 (verified 풀은 100% 있음) |
| `dbd_is_dissolved == True` | **페이지 생성 안 함 / 404** |
| `phone` 없음 | "Contact via website" / "Visit Google Maps" |
| `website` 없음 | `google_maps_url`로 fallback |
| `reviews_json` 없음 | 리뷰 섹션 hide, schema의 review 생략 |
| `photo_urls_json` 없음 (~25% 없음) | `og:image` 폴백: placeholder 이미지 또는 카테고리 아이콘 |
| `top_photo_url` 없음 | 카드 미리보기에 카테고리 아이콘 사용 |
| `is_consumer == True` | **B2B 디렉토리에서 제외** (premium은 이미 필터됨) |

---

## 7. 코드 예시 — Node.js (Next.js 가정)

```javascript
// lib/loadSuppliers.js
const fs = require("fs");
const csv = require("csv-parse/sync");

let cache = null;
function loadSuppliers() {
  if (cache) return cache;
  const raw = fs.readFileSync(
    "data/thaisupplyhub_premium_final.csv",
    { encoding: "utf-8" }
  ).replace(/^﻿/, "");  // strip BOM
  const rows = csv.parse(raw, { columns: true, skip_empty_lines: true });
  cache = rows.map(r => ({
    ...r,
    lat: r.lat ? parseFloat(r.lat) : null,
    lng: r.lng ? parseFloat(r.lng) : null,
    rating: r.rating ? parseFloat(r.rating) : null,
    review_count: r.review_count ? parseInt(r.review_count) : null,
    dbd_capital_thb: r.dbd_capital_thb ? parseFloat(r.dbd_capital_thb.replace(/,/g, "")) : null,
    is_halal_certified: r.is_halal_certified === "True",
    is_consumer: r.is_consumer === "True",
    reviews: r.reviews_json ? JSON.parse(r.reviews_json) : [],
    photos: r.photo_urls_json ? JSON.parse(r.photo_urls_json) : [],
  }));
  return cache;
}

// pages/supplier/[place_id].js
export async function getStaticPaths() {
  const all = loadSuppliers();
  return {
    paths: all.map(s => ({ params: { place_id: s.place_id } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const all = loadSuppliers();
  const supplier = all.find(s => s.place_id === params.place_id);
  return { props: { supplier } };
}
```

---

## 8. 마이그레이션 체크리스트

기존 thaisupplyhub.com에 650 supplier가 이미 있다고 했었죠. 통합 순서:

- [ ] 1. 기존 650개의 `place_id` 추출 → CSV로 export
- [ ] 2. `thaisupplyhub_premium_final.csv`와 `place_id` 기준 LEFT JOIN
- [ ] 3. 매칭된 supplier: 기존 데이터를 새 enrichment로 **upsert** (덮어쓰지 말고 NULL인 필드만 채움 추천)
- [ ] 4. 매칭 안 된 신규: 새 row로 추가 (~3,000개 신규 supplier)
- [ ] 5. `dbd_is_dissolved == True`인 기존 supplier → 사이트에서 비공개 / 410 Gone
- [ ] 6. 새 estate_slug 21개 → `/estate/{slug}` 페이지 생성
- [ ] 7. sitemap.xml 재생성 → Google Search Console에 ping
- [ ] 8. JSON-LD schema 삽입 확인 (rich result test)

---

## 9. 알아두면 좋은 것

- **CSV 인코딩**: 모든 파일 UTF-8 **BOM 포함** (Excel + 모든 파서 안전).
- **태국 불교력**: DBD `registered_date`는 이미 그레고리력으로 변환됨 (2026이 그대로 2026).
- **TSIC 코드**: 태국 표준산업분류. 영어 매핑이 필요하면 별도 lookup table 필요 (https://www.tsi.or.th).
- **Halal 인증**: `is_halal_certified` 플래그는 브랜드 fuzzy match 기반 — 자체 검증 권장.
- **DBD 매칭 신뢰도**: `dbd_match_score >= 80`만 매칭된 것. 90+면 거의 확실.
- **place_id 충돌**: Google이 가끔 CID를 변경함. 6개월마다 재크롤 권장.

---

## 10. 추후 추가 가능한 데이터

이미 수집됐지만 `*_final.csv`엔 안 들어간 것들 — 필요 시 머지 가능:

- `yp_*.csv` 16개 카테고리 (~14,629 행) — YP 다른 카테고리 풀
- `halal_products.csv` (913 행) — Halal 제품 상세 + 인증 만료일
- `11_01_active_companies.csv` (364K 행) — DBD 미매칭 supplier 추가 검색용
- `misc/dataset_*.csv` — 외국 회사 통계, 정부 조달 등 (분석용)

추가 머지 필요하면 `C:\dbd-scraper\merge_thaisupplyhub.py` 와 `merge_reviews_into_master.py` 수정/재실행.

---

## 11. 빠른 검증 명령어

```python
import pandas as pd
df = pd.read_csv("thaisupplyhub_verified_final.csv", encoding="utf-8-sig", low_memory=False)
print(f"Total verified: {len(df)}")
print(f"With reviews scraped: {df['reviews_scraped_count'].notna().sum()}")
print(f"With photos: {df['photos_count'].notna().sum()}")
print(f"With phone: {df['phone'].notna().sum()}")
print(f"With website: {df['website'].notna().sum()}")
print(f"In industrial estate: {(df['estate_name'].notna() & (df['estate_name'] != '')).sum()}")
print(f"Halal flagged: {(df['is_halal_certified'] == True).sum()}")
print(f"Top province: {df['province_en'].value_counts().head()}")
```

---

문제 생기면 이 문서 + 해당 CSV 헤더를 Claude에 던지세요. 끝.
