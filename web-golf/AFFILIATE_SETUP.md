# thailandgolfguide.com — Affiliate Setup Walkthrough

가입 우선순위, env 변수 매핑, 예상 수익. Korean golfer 트래픽 기준.

배포 후 사용자가 외부 affiliate 대시보드에 가입하면서 따라 진행하면 됩니다.

---

## TL;DR — 우선순위

| Tier | Partner | 가입 난이도 | 가입 → 승인 | 예상 commission | 즉시 적용 가능? |
|------|---------|------------|------------|------------------|------------------|
| 🔥 1 | **Klook Affiliate** | 쉬움 | 1-3일 | 3-7% / booking | ✅ AID 만 박으면 됨 |
| 🔥 1 | **Booking.com Partner** | 쉬움 | 즉시 | 25-40% of Booking commission (≈ 4-7% of stay) | ✅ AID 만 박으면 됨 |
| 🔥 1 | **Agoda Partner** | 쉬움 | 1-3일 | 4-7% / booking | ✅ AID 만 박으면 됨 |
| ⭐ 2 | **Trip.com Partner Center** | 쉬움 | 즉시 | 항공 ฿80-300 / segment | ✅ allianceid + sid 박으면 됨 |
| ⭐ 2 | **Expedia (via Impact)** | 중간 | 3-7일 | 3-6% | ❌ URL_TEMPLATE 필요 |
| ◯ 3 | **Skyscanner (via Partnerize)** | 어려움 | 1-2주 (트래픽 증명 필요) | $0.20-0.50 / click | ❌ URL_TEMPLATE 필요 |
| ◯ 3 | **Rentalcars (via Booking)** | 쉬움 | 즉시 | 6-12% | ✅ Booking AID 재사용 |
| ◯ 4 | **Golfsavers** | 어려움 | 직접 영업 필요 | 7-15% / round | ❌ URL_TEMPLATE 필요 |
| ◯ 4 | **Sawasdee Golf** | 어려움 | 직접 영업 필요 | 5-15% / round | ❌ URL_TEMPLATE 필요 |

**핵심 메시지**: 가입 직후 적용 가능한 4개 (Klook + Booking + Agoda + Trip.com)만으로 트래픽의 70% 수익화 가능. 나머지는 시간 두고 채우세요.

---

## 1. Klook Affiliate Program 🔥🔥🔥

**왜 중요한가**: 한국 골퍼들이 1회 라운드 / 공항 transfer 예약 가장 많이 쓰는 채널. Klook 한국어판 있어서 전환율 높음.

### 가입
1. https://affiliate.klook.com/ 접속
2. "Apply now" → 사이트명: `thailandgolfguide.com`, 카테고리: Travel / Activities
3. 평균 1-3일 내 승인. 거절되면 Impact / Awin 통해서 우회 가입 가능.

### 적용 방법 A — 빠른 시작 (AID)
대시보드 → Profile → Affiliate ID 복사 → Vercel/Cloudflare 환경변수:
```
NEXT_PUBLIC_KLOOK_AID=YOUR_KLOOK_AID
```

### 적용 방법 B — 정석 (URL Template, 트래킹 정확도 ↑)
대시보드 → Deep Link Generator → Sample Link 복사 → placeholder 치환:
```
NEXT_PUBLIC_KLOOK_URL_TEMPLATE=https://affiliate.klook.com/redirect?aid=YOUR_AID&aff_adid=thailandgolf&p=1&deeplink={target}
```

### 예상 수익
- 라운드 1회 ฿2,500 booking → ฿100-175 commission
- 공항 transfer ฿1,200 → ฿35-85 commission

---

## 2. Booking.com Partner Program 🔥🔥🔥

**왜 중요한가**: Golf+호텔 패키지가 객단가 가장 큼 (3박 ฿15,000+). Booking 수수료의 25-40% 받음.

### 가입
1. https://partner.booking.com/affiliate-program 접속
2. "Sign up" → 사이트 URL 입력 → 즉시 승인 (트래픽 무관)
3. 대시보드 → "Get your AID" → 9자리 숫자

### 적용 방법 A — 빠른 시작 (가장 간단)
```
NEXT_PUBLIC_BOOKING_AID=123456789
```

### 적용 방법 B — Awin 통해 (높은 commission 가능)
1. https://www.awin.com/ 가입 → Publisher 등록
2. Booking.com merchant 신청 → 승인 후 deeplink generator
3. 예시 템플릿:
```
NEXT_PUBLIC_BOOKING_URL_TEMPLATE=https://www.awin1.com/awclick.php?mid=24010&id=YOUR_AWIN_ID&p={target}
```

### 예상 수익
- 3박 ฿15,000 hotel → Booking commission ฿2,250 (15%) → 본인 몫 ฿560-900 (25-40%)
- 한 달 100건 booking이면 ฿56,000-90,000 / 약 USD 1,600-2,500

---

## 3. Agoda Partner Program 🔥🔥🔥

**왜 중요한가**: 한국인 골프 여행객이 가장 많이 쓰는 호텔 예약 사이트. Agoda 한국어 + 원화 결제.

### 가입
1. https://partners.agoda.com/ 접속
2. "Become a partner" → 사이트 URL, 카테고리: Travel
3. 1-3일 내 승인

### 적용 방법 A
대시보드 → CID 복사:
```
NEXT_PUBLIC_AGODA_AID=1234567
```

### 적용 방법 B — Deep link template
```
NEXT_PUBLIC_AGODA_URL_TEMPLATE=https://www.agoda.com/partners/partnersearch.aspx?cid=YOUR_CID&pcs=1&hl=ko&url={target_raw}
```

### 예상 수익
- 호텔 1박 ฿3,000 booking → ฿120-210 commission

---

## 4. Trip.com (씨트립) Partner Center ⭐⭐

**왜 중요한가**: 한국→방콕/푸켓/치앙마이 항공편 가격 비교 1순위. 아시아 inbound 전문.

### 가입
1. https://partner.trip.com/ 접속
2. "Become a partner" → "Affiliate" → 사이트 URL
3. 즉시 승인 → Affiliate ID (alliance ID) 받음

### 적용
```
NEXT_PUBLIC_TRIPCOM_AID=123456789
```

(env에 박으면 code가 자동으로 `&allianceid={id}&sid=thailandgolf` 붙임)

### 예상 수익
- 인천→방콕 왕복 항공권 ฿18,000 → ฿80-300 / segment commission

---

## 5. Expedia (via Impact Radius) ⭐

**왜 중요한가**: Booking/Agoda 안 쓰는 미국·유럽 골퍼 캐치. 호텔+항공 패키지 강점.

### 가입 (Impact 경유)
1. https://impact.com/ → "I'm a Publisher" → 사이트 등록 (1-3일 승인)
2. Brand search → "Expedia Group" → 가입 신청 (3-7일 승인, 트래픽 증명 요구할 수 있음)
3. 승인 후 deep link generator → URL template 추출

### 적용
```
NEXT_PUBLIC_EXPEDIA_URL_TEMPLATE=https://expedia.com/_redirect?...&u={target}
```

### 예상 수익
- 3-6% / booking. Booking/Agoda 보다는 낮지만 영어권 트래픽이면 가치 있음.

---

## 6. Skyscanner (via Partnerize) ◯

**왜 까다로운가**: 트래픽 증명 (월 10K 클릭+) 요구. 초기 사이트는 거절될 수 있음.

### 가입
1. https://www.partnerize.com/ 신청
2. Brand: Skyscanner → 사이트 통계 제출
3. 1-2주 검토, 거절 시 3개월 뒤 재신청

### 적용
승인 받으면:
```
NEXT_PUBLIC_SKYSCANNER_URL_TEMPLATE=https://prf.hn/click/...?destination={target}
```

### 대안
초기엔 Skyscanner 건너뛰고 Trip.com 만으로 충분. 트래픽 쌓이면 신청.

---

## 7. Rentalcars (via Booking Partner) ◯

**왜 쉬운가**: Booking.com Partner 가입 시 Rentalcars AID 같이 발급됨.

### 적용
```
NEXT_PUBLIC_RENTALCARS_AID={Booking AID와 동일}
```

### 예상 수익
- 6-12% / 렌탈 (1일 ฿1,500 차량 → ฿90-180)

---

## 8. Golfsavers / Sawasdee Golf ◯

**왜 까다로운가**: 둘 다 공개 affiliate program 없음. 직접 영업 이메일 → 개별 deal.

### 접근법
1. 사이트에 "월 트래픽 X천 + 한국 골퍼 비중 Y%" 데이터 정리
2. 영업 이메일:
   - Golfsavers: partners@golfsavers.com
   - Sawasdee: info@sawasdeebangkokgolf.com
3. 제안: 코스 페이지 sponsored 버튼 + UTM 트래킹, commission share 7-15% / booking
4. 합의 시 redirect URL 받아서 `_URL_TEMPLATE` 으로 박기

### 대안
당장은 plain search link (트래킹 없음) 으로 보내고, 트래픽 쌓이면 정식 deal.

---

## 환경변수 적용 — Vercel

```bash
# Vercel 대시보드 → Project → Settings → Environment Variables
# 또는 CLI:
vercel env add NEXT_PUBLIC_KLOOK_AID production
vercel env add NEXT_PUBLIC_BOOKING_AID production
vercel env add NEXT_PUBLIC_AGODA_AID production
vercel env add NEXT_PUBLIC_TRIPCOM_AID production
# ...

# 변경 후 재배포 필요 (Vercel은 자동, Cloudflare Pages는 수동 redeploy)
```

## 환경변수 적용 — Cloudflare Pages

1. CF Pages 대시보드 → Project → Settings → Environment variables
2. Production / Preview 양쪽에 동일 값 추가
3. "Redeploy" 클릭하거나 git push 트리거

---

## 확인 방법

배포 후 어디든 sponsored 링크 (Klook/Booking 등) 우클릭 → "주소 복사" → AID 들어가있는지 확인.

또는 `/methodology` 페이지 또는 dev console 에서 `affiliateConfigStatus()` 호출하면 partner별 mode (template / aid / fallback) 확인 가능.

---

## 예상 월 수익 (보수 추정)

| 트래픽 | 환산 affiliate 클릭 | Klook | Booking+Agoda | Trip.com | Misc | **합계** |
|--------|-------------------|-------|---------------|----------|------|----------|
| 월 10,000 PV | 500 clicks | $30 | $250 | $40 | $30 | **~$350** |
| 월 50,000 PV | 2,500 clicks | $200 | $1,300 | $250 | $200 | **~$2,000** |
| 월 200,000 PV | 10,000 clicks | $900 | $5,500 | $1,200 | $900 | **~$8,500** |

(전환율 0.5-1% / 평균 객단가 USD 50-150 / Korean golfer 비중 60% 가정)

큰 비중은 **Booking + Agoda** (호텔). Klook · Trip.com 은 항공·activity 보조. 초기 1-2달 USD 200-500 부터 시작 가정.

---

## 흔한 함정

- **AID만 박았는데 commission 안 잡힘**: 일부 partner (Expedia, Skyscanner, Rentalcars) 는 native query param 으로 트래킹 안 함. 반드시 affiliate network redirect URL 사용해야 함. URL_TEMPLATE 환경변수가 더 안전.
- **승인 거절**: 신규 사이트라 트래픽 증명 못 함. → Awin/CJ/Impact 통한 우회 가입은 더 관대함.
- **클릭은 잡히는데 commission 0**: 쿠키 만료 (보통 7-30일) 또는 사용자가 쿠키 차단. 모바일 in-app browser (네이버 앱 등) 에서 트래킹 잘 안 잡힘.
- **Booking + Agoda 동시 가입**: 둘 다 OK. 어느 한쪽 거절돼도 다른 쪽 가능.

---

## 다음 단계

1. **이번 주**: Klook + Booking + Agoda + Trip.com 가입 (1-3시간 작업)
2. **2주차**: AID 박고 배포 → /methodology 페이지 또는 sponsored 링크 1개씩 클릭해서 트래킹 확인
3. **1개월차**: 첫 commission 정산 확인 → 추가 partner (Expedia, Rentalcars) 신청
4. **3개월차**: 트래픽 안정화되면 Skyscanner / Golfsavers / Sawasdee 직접 영업
