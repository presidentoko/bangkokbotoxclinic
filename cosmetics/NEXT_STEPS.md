# Konvy 스크래퍼 — 현재 상태 & 다음 단계 (2026-06-01 업데이트)

## 🔧 2026-06-03 — 415 정체 디버깅 & 수정 (근본원인 확정)
**증상:** forever 수집기가 96패스째 415개에서 `+0`(같은 상품만 반복).
**근본원인 (증거 기반):** discovery가 **페이지네이션을 안 함**. `config.search_listing_urls()`가
시드마다 **1페이지짜리 URL**만 만들고 `parse_listing`도 그 한 페이지(=정확히 32개, fixture 검증)만 긁음.
41시드 × ~32 = dedup하면 **415가 천장**. 그러나 Konvy는 `?page=N`으로 페이징하며, 저장된 카테고리
HTML에 `/list/skincare/?page=201` 링크가 박혀 있음 → 스킨케어 113 하나만 ~201p×32 ≈ 6,400개.
(`config.MAX_LIST_PAGES`가 정의만 되고 미사용이었음 = 빠진 자리.) 부차적으로 12h discovery 캐시가
TTL 내 패스에서 415를 그대로 재사용 → `+0`을 고착.
**수정 (TDD, 62 tests green):**
- `config.paged_url(base,page)` + `listing_seed_bases()` + `search_listing_urls(pages)` — `?page=N` 부착.
- `config.DISCOVER_PAGES_PER_SEED`(기본 8, 보수적; `COSMETICS_DISCOVER_PAGES`로 조정).
- `konvy_supervise.paginate_base()` — 시드 base를 page로 돌되 **새 URL 0개 페이지에서 조기 종료**
  (얇은 키워드는 낭비 0, 깊은 카테고리는 깊게). `discover()`가 이걸 사용하도록 리팩터.
- 신규 테스트: `tests/test_config_pagination.py`, `tests/test_supervise_paginate.py`.
**활성화 (운영):** 코드는 매 패스 `konvy_supervise`를 새 subprocess로 띄우는 구조라 **다음 패스에 자동 반영**.
단 stale 캐시 때문에 한 번 `state/discovered.json` 삭제 필요(또는 forever 스택 재시작). 그러면 다음
discovery가 paginated로 돌아 415→수백~1천대로 점진 확장(스루풋 상한 내에서).

---


## ✅ 완성·검증된 것
- **엔진 코드 완성**, 단위테스트 **16/16 통과** (parse/fetch/vpn + IP-rotation 헬퍼).
- **실데이터 추출 검증** (파이프라인 전 구간):
  - La Roche Posay Mela B3 Serum → ฿1950 / 4.9★ / 리뷰 249 (`output/products/97258.json`)
  - Nu Formula JIMMY Fan Box → ฿990 / 리뷰 13 / html 473KB (단독 fetch)
  - Kiehls Dark Spot (RECON) → 성분 23 / 리뷰 573

## 🏗️ 새 아키텍처 (2026-06-01 재설계) — `konvy_supervise.py`
기존 `konvy_scraper.crawl()`(단일 장수명 브라우저)는 두 가지로 죽었음. 그래서 **supervisor + 상품당 단명(短命) 워커** 구조로 전환:

- **`konvy_worker.py`** — `discover` / `product` 서브커맨드. 매번 **fresh 브라우저**(타깃이 첫 네비게이션이라 WAF 통과). 1세션 후 종료.
- **`konvy_supervise.py`** — discover 1회 → 상품마다 워커를 **subprocess로 spawn + 하드 타임아웃(90s) 후 `taskkill /T` 트리 강제종료**. 포트 헬스게이트, IP 로테이션, 페이싱, 상품당 `output/products/<id>.json` 체크포인트, `progress.json`(ok만 skip), 끝에 `products.csv` 재조립.

### 고친 근본 버그 2개
1. **무한 멈춤** — `fetch_json`의 `page.evaluate(fetch)`에 타임아웃이 없어 터널이 죽으면 영원히 hang. + `page.goto`조차 SOCKS 반죽음 시 Playwright 내부 타임아웃을 무시하고 wedge.
   → **해결: 상품=단명 프로세스 + 외부 하드킬.** (`fetch_json`엔 AbortController 타임아웃도 추가)
2. **빈 추출(WAF 승격)** — 목록→상세를 한 컨텍스트/IP로 연속 요청하면 슬라이더 CAPTCHA로 승격, 빈 페이지 반환.
   → **해결: 상품마다 fresh 컨텍스트 + WAF 감지 시 IP 로테이션**(`TMPDIR/rotate_port_<idx>` touch → 러너가 exit 교체). discovery도 0개면 로테이션 후 재시도(최대 6회).

## ⚠️ 남은 단 하나의 병목 = 터널 품질 (코드 아님, 운영)
- 전용 NordVPN 2터널(2090/2091)이 **node-openvpn-socks로 글로벌 랜덤 서버에 접속** → 다수가 `tunnel 실패`(negotiation) 또는 `ECONNRESET`으로 reset-prone. 살아도 fetch 중 끊겨 **wedge(90s 하드킬 소모)**.
- 한 슬롯(보통 2091)이 한동안 안 뜨면 모든 fetch가 한 IP로 몰려 WAF 승격. → IP 로테이션으로 완화하지만 로테이션도 6서버쯤 실패 후 성공.
- **결과: 작동하지만 throughput이 낮음** (상품 1개에 수 분). 기존 클리닉 엔진은 8포트 이중화로 이걸 흡수함.

### 터널 개선 옵션 (우선순위)
1. **이중화**: 계정 슬롯 10개(8 prod + 2 dedicated)라 추가 불가. → prod 풀을 잠깐 6으로 줄이고 cosmetics에 4를 줄 수 있음(클리닉 영향).
2. **국가핀**: `nordvpn_runner.py`에 `--country-id` 추가(NordAPI `filters[country_id]`) — 안정 지역(JP/SG) 핀으로 negotiation 성공률↑. **추가형 옵션이라 8포트 러너엔 무영향** (worktree 카피가 아니라 메인 카피 수정 필요 — git 자동화 주의).
3. **하드킬 타임아웃 단축**: 90s→60s로 wedge 손실 축소(정상 fetch는 15~50s).
4. **시간대**: 터널 풀이 좋은 윈도우(둘 다 안정)에 돌리면 훨씬 빠름.

## 운영 메모
- 실행: `PYTHONUTF8=1 PYTHONIOENCODING=utf-8 python -m cosmetics.konvy_supervise --limit N`
- 전용 러너 재시작: 메인레포에서 `python nordvpn_runner.py --ports 2 --base-port 2090 --auth nordvpn/auth.txt --proto tcp` (worktree 카피는 node-openvpn-socks 빌드 없음 → 메인레포로 실행).
- 포트 헬스 = 단순 port-open이 아니라 **실 GET 200**(`vpn_up.port_healthy`, curl socks5h).

## 다음 단계
1. (운영) 위 터널 개선 1~2 중 택1로 throughput 확보 → limit 해제 풀수집(acne+whitening, catId 113).
2. 여드름/미백 **전용 catId 정밀화**(현재 113=일반 스킨케어).
3. 성분 빈 케이스(LRP serum 등) 파서 보강 — 일부 페이지는 ld+json 외 위치에 성분 표기.
4. 수집 후 **AEO 사이트(Unit ⑤)** — sortable 비교표, bangkokfillers.com.

## 한 줄 요약
엔진·하드닝 **완성**(테스트 16/16, 실데이터 추출 확인). 멈춤·WAF 두 근본버그 해결. 남은 건 순수 **터널 throughput**(NordVPN/JS-OpenVPN 불안정)이라는 운영 문제뿐.
