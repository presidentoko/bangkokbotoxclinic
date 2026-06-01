# Konvy 스크래퍼 — 현재 상태 & 다음 단계 (2026-06-01)

## ✅ 완성·검증된 것 (코드)
- 전체 파이프라인 코드 완료 (Task 0~8), 단위테스트 **13/13 통과**.
- **실제 페이지에서 추출 검증됨** (격리 단일 fetch): 예) Kiehls Clearly Corrective Dark Spot Solution →
  name/brand/price(฿1270)/**성분 23개**/리뷰수 573 정상 추출. Anessa fixture도 동일.
- WAF 1차(JS reload) 통과, 목록 32개 파싱, 리뷰 JSON 파싱 동작.

## ⚠️ 대량 라이브 수집을 막는 2가지 (운영/안티봇 — 코드 아님)
1. **Aliyun WAF 에스컬레이션**: 한 IP로 목록→상세를 빠르게 연속 요청하면 슬라이더 CAPTCHA
   "Verification" 페이지(`aliyun_waf_aa`, `--aliyun-slide`)로 승격됨. 자동 reload로 안 풀림.
   - 격리(신선한 컨텍스트, 첫 요청)에서는 통과 → **상품마다 fresh context + 느린 페이싱 + IP 로테이션** 필요.
   - 탐지는 추가됨: `is_waf_challenge()`가 verification 페이지도 잡음.
2. **NordVPN 터널 불안정**: `nordvpn_runner`가 전 세계 랜덤 서버를 골라 다수가 establish 실패
   (로그에 `tunnel 실패` 빈발). 포트는 열려도 upstream이 죽어 `ERR_SOCKS_CONNECTION_FAILED` 발생.
   2090/2091 둘이 동시에 살아있는 시간이 짧음.

## 다음 단계 (우선순위)
1. **터널 안정화** (가장 시급):
   - `nordvpn_runner`에 **국가 필터** 추가 (NordAPI `filters[country_id]`) — 태국(id 약 211) 또는
     안정 지역 핀. Konvy가 THB/태국이므로 TH exit가 데이터 정확도에도 유리.
   - 사용 전 health-gate: 포트 open뿐 아니라 실제 GET 200 확인 후 투입 (vpn_up에 헬스체크 추가).
2. **안티봇 페이싱**:
   - 크롤러를 **상품 N개마다 fresh context (새 IP)** 로 돌리고, 상품 간 5~10s 랜덤 지연.
   - `is_waf_challenge` 감지 시 해당 포트 **IP 로테이션**(`/tmp/rotate_port_<idx>` touch) 후 재시도.
3. **리뷰**: ld+json `aggregateRating`(평점·리뷰수)는 상세에서 바로 확보됨 → 개별 리뷰 텍스트(JSON)는
   감성/키워드(Unit ③)용으로 best-effort. WAF로 막히면 ld+json 요약으로 충분.
4. **고민별 catId 정밀화**: 현재 시드 catId=113(일반 스킨케어). 여드름/미백 전용 카테고리 id 추가 recon.

## 한 줄 요약
스크래퍼는 **코드 완성 + 실데이터 추출 검증 완료**. 대량 라이브 수집은 터널 안정화 + 안티봇 페이싱이라는
운영 하드닝이 남음(기존 클리닉 엔진이 늘 다루는 종류의 문제).
