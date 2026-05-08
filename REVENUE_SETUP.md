# 수익화 셋업 체크리스트

bangkokbotoxclinic.com (클리닉) + snsstopper.com (식당) 양쪽 site에 활성화할 수익 채널.
모든 셋업은 **Vercel dashboard → Project → Settings → Environment Variables** 에서 추가.

## 우선순위 (가성비 큰 순)

### 1. Lead 알림 webhook (클리닉만, 5분 셋업)
**왜**: BookingForm 제출 → Slack/Discord에 즉시 알림 → 빠른 응답 → conversion ↑.
연수익 추정: 월 lead 50건 × ฿200/lead = **฿10,000/월** (CPL 모델 동작 시작점).

- Slack: Incoming Webhooks 앱 추가 → 채널 선택 → Webhook URL 복사
- Discord: 채널 → Edit → Integrations → New Webhook → URL 복사
- Vercel env: `LEAD_WEBHOOK_URL=https://hooks.slack.com/services/...`

### 2. Sponsored 슬롯 (양쪽 site, 10분 셋업, 즉시 매출)
**왜**: 고매출 클리닉/식당에 유료 노출 판매. 코드 변경 없이 env만 수정 → 즉시 반영.
첫 광고주 잡으면 ฿5,000~15,000/월. 5명 채우면 **฿50,000+/월**.

- 영업 (별도 작업): 매출 좋은 클리닉/식당 connect → 가격 협상
- 결제 받으면: clinic ID 또는 restaurant ID 를 env CSV에 추가
- ID 찾는 법: 사이트 URL의 `/clinic/<ID>` 또는 `/restaurant/<ID>` 부분
- Vercel env (예시):
  ```
  SPONSORED_EDITORS_PICK=ChIJ123abc,ChIJ456def
  SPONSORED_RECOMMENDED=ChIJ789ghi
  SPONSORED_FEATURED=
  ```
- 추가 후 Vercel 자동 redeploy (~2분) → 사이트에 배지 + 상단 정렬

### 3. Klook 어필리에이트 (양쪽 site, 1주일 승인)
**왜**: 사용자가 Klook 통해 예약 시 commission 자동 수령. 5-10% 수수료 평균.
태국 트래픽 + 외국인 타겟 = Klook 적합.

- 가입: https://affiliate.klook.com → 1-3일 승인
- AID 받으면 Vercel env: `NEXT_PUBLIC_KLOOK_AID=12345`
- 양쪽 site 둘 다 동일 ID 사용 가능

### 4. Google AdSense (양쪽 site, 1-4주 승인)
**왜**: 트래픽 1,000+ DAU 되면 의미 있음. 그 전엔 영향 미미.
승인 후 광고 슬롯 자동 활성화.

- 신청: https://www.google.com/adsense — 양쪽 도메인 각각 등록
- 승인 후 client ID 받으면: `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-1234567890`
- ads.txt 자동 생성 안 됨 → 별도 작업 필요할 수 있음

## SEO 검증 (필수 — 트래픽 확보 prerequisite)

### Google Search Console
- https://search.google.com/search-console
- 도메인 추가 → "Meta tag" 방식 verify 선택
- meta tag 의 `content="..."` 부분만 복사 → `NEXT_PUBLIC_GSC_VERIFICATION=...`

### Bing Webmaster (보너스, 5분)
- https://www.bing.com/webmasters
- Google Search Console import 가능 (가장 빠름)
- 또는 meta tag verify → `NEXT_PUBLIC_BING_VERIFICATION=...`

## 셋업 순서 권장

**오늘 가능 (외부 가입 X)**:
1. Lead webhook (Slack 5분) — 클리닉 lead 잡기 시작
2. Sponsored 슬롯 셋업 — 광고주 잡으면 즉시 매출

**1주일 내**:
3. Klook 어필리에이트 가입
4. Google Search Console verify (인덱싱 시작)

**트래픽 확보 후 (~1-3개월)**:
5. AdSense 신청
6. 영업 본격화 (clinic/restaurant 연 100곳 이상에 콜드아웃)

## 환경변수 셋업 명령 (Vercel CLI)

```bash
# 클리닉 프로젝트
vercel env add LEAD_WEBHOOK_URL production
# (붙여넣기 후 Enter)

# 또는 dashboard:
# Project → Settings → Environment Variables → Add → name + value
```

추가 후 자동 redeploy 또는 수동 trigger:
```bash
vercel --prod
```
