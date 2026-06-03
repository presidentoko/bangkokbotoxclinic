# Konvy 스크래핑 Recon (2026-06-01)

태국 프록시(NordVPN SOCKS5) 경유로 실제 캡처한 결과. selector/엔드포인트는 모두 실측.

## 핵심: 차단 우회

- Konvy는 **Aliyun WAF** JS 챌린지(`aliyunwaf_*`, `acw_sc__v2` 쿠키 reload) 뒤에 있음.
- **httpx 단독 불가** — JS 챌린지를 못 푼다(빈 17KB 챌린지 페이지만 받음).
- **Playwright(헤드리스 크롬)로 해결** — 브라우저가 WAF JS를 자동 실행해 통과. 기존 `bangkok_clinics` 스크래퍼와 동일한 `socks5://127.0.0.1:<port>` 프록시 방식.
- 파싱은 렌더된 HTML에 BeautifulSoup 사용.

## VPN

- 전용 터널 2090–2091 기동 성공(`nordvpn_runner.py --ports 2 --base-port 2090 --auth nordvpn/auth.txt --proto tcp`).
  - **반드시 `PYTHONUTF8=1 PYTHONIOENCODING=utf-8`** 로 실행(러너가 한국어 로그를 cp1252로 못 찍어 죽음).
- 기존 8(2080–2087) + 신규 2 = 10 동시 접속 정상 → **계정 한도 = 10 확인됨**.
- 출구 국가는 랜덤(캡처 시 TW/US). 실제 가격/재고 정확도 위해선 추후 Thailand 서버 핀 고려(NordAPI country 필터). 단 DOM 구조는 국가 무관.

## URL 패턴

- **카테고리/목록**: `https://www.konvy.com/mall/list.php?param=<catId>-0-0-0&from=category`
  - 제품은 **스크롤로 lazy-load** → Playwright에서 `mouse.wheel`로 여러 번 스크롤 후 캡처.
  - 한 목록 페이지에서 제품 31개 확인.
- **제품 상세**: `https://www.konvy.com/<brand-slug>/<product-slug>-<id>.html`
  - 예: `/anessa/anessa-perfect-uv-sunscreen-milk-na-spf50%2b-pa%2b%2b%2b%2b-60ml-95356.html`
  - `<id>` = URL 끝 `-(\d+)\.html` → 이게 제품 식별자이자 리뷰 API의 `team_id`.
- **검색 hub** `search.php?q=...`는 제품 그리드가 아니라 브랜드/카테고리 허브(제품 거의 없음). 목록은 `mall/list.php` 사용.
- 제외할 링크: `/brand/`, `/list/`(속성 필터/카테고리), `list.php`, `team*`, `cart`, `static`, `javascript:`.

## 제품 상세 파싱 (product_sample.html, 577KB)

### ld+json `Product` 블록 — 메타 대부분 여기서 (가장 안정적)
`<script type="application/ld+json">` 1개. keys:
```
@context, @type=Product, name, image, sku, gtin8, description, brand,
aggregateRating { ratingValue, reviewCount, bestRating, worstRating },
offers { priceCurrency:"THB", price:"729" }
```
→ name, brand, image, sku, price(THB), konvy_rating(ratingValue), konvy_review_count(reviewCount) 전부 추출 가능.
(RECON_ldjson.json 에 실제 캡처본 저장됨.)

### 성분(INCI) — HTML
```
<div id="ingredient_data_main">
  <a class="ingredientFont ..." href="...attribute_value=Dimethicone">Dimethicone</a>
  <a class="ingredientFont ...">Water</a>
  ...
</div>
```
→ `soup.select('#ingredient_data_main a.ingredientFont')` 의 각 텍스트 = 성분명. **문자열 split 불필요** (이미 분해된 앵커들). label은 `ส่วนผสม`(성분).
- 성분 미기재 제품도 있을 수 있음 → 빈 리스트 허용.

### 가격
ld+json `offers.price`가 1순위(THB). HTML에도 `฿` 표기 있음(보조).

## 리뷰 — JSON API (HTML 파싱 불필요!)

- 엔드포인트:
  ```
  https://www.konvy.com/team/ajax_comment.php?action=comment_show_json_new&page=<N>&team_id=<id>&ctype=default&score=0&onlyhaveimg=0&imgbtnclicked=0
  ```
- `team_id` = 제품 URL 끝 숫자. `page`로 페이지네이션.
- **WAF 쿠키 필요** → 제품 페이지를 Playwright로 먼저 연 뒤, 같은 컨텍스트에서 `fetch()`(in-page) 또는 `page.request`로 호출해야 200 JSON.
- 응답은 JSON. 실제 필드명은 `tests/fixtures/reviews_sample.json` 참조(파서는 이 fixture로 TDD). rating/comment/author/date/helpful 류 키 존재.
- aggregateRating(ld+json)에 총 평점/리뷰수 요약 있으므로, 개별 리뷰 텍스트는 감성/키워드 집계(Unit ③)용.

## fixtures
- `list_acne_p1.html` — `mall/list.php` 실제 목록(제품 31개)
- `product_sample.html` — Anessa 제품 상세(ld+json + 성분)
- `reviews_sample.json` — ajax_comment 리뷰 JSON
- `RECON_ldjson.json` — 추출된 ld+json 원본(참고용)

## 플랜 대비 변경점 (중요)
1. **fetcher는 httpx가 아니라 Playwright 기반**이어야 함(WAF). config/모델은 그대로 유효.
2. parse_product: 추측 selector 대신 **ld+json + `#ingredient_data_main a.ingredientFont`** 사용.
3. parse_reviews: HTML 분기 불필요 — **ajax_comment JSON** 파싱.
4. parse_listing: `mall/list.php` + 스크롤, 제품 링크 정규식 `konvy\.com/<brand>/<slug>-<id>\.html` (제외 목록 적용).
5. listing_urls_for: 고민별 카테고리 `param` id 매핑 필요(여드름/미백 관련 catId는 추가 recon로 확정 — 우선 일반 스킨케어 catId로 스모크).
