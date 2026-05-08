# 영업 / Cold Outreach 템플릿

bangkokbotoxclinic.com (클리닉) + snsstopper.com (식당) 양쪽에서 사용 가능.
유료 featured slot / B2B SaaS 판매 시작점.

## 1단계: 타겟 리스트 (자동 생성)

master_db.json 에서 추출 가능한 타겟 조건:

**고매출 가능성 (광고 의향 ↑)**:
- `total_reviews >= 100` (활성 영업)
- `rating >= 4.5` (질 높음)
- `trust_score >= 70`

**Trust Score 낮은데 reviews 많은 case** (마케팅 도움 절실 — 우리가 도울 가치 어필):
- `total_reviews >= 50` AND `trust_score < 50`

**자동 추출**:
```bash
python -c "
import json
with open('web/data/master_db.json') as f: db = json.load(f)
top = [c for c in db['clinics'] if c['total_reviews'] >= 100 and c['rating'] >= 4.5][:50]
for c in top:
    line_or_phone = c.get('phone') or c.get('website') or '?'
    print(f\"{c['name']}\\t{c['district']}\\t{c['rating']}\\t{c['total_reviews']}\\t{line_or_phone}\")
" | tee outreach_targets.tsv
```

## 2단계: 첫 메시지 — LINE / 이메일 (영어)

**Subject**: Featured listing for {clinic_name} on bangkokbotoxclinic.com

```
Hi {clinic_name} team,

I run bangkokbotoxclinic.com — an independent directory ranking 2,000+
Bangkok clinics by Google review credibility (we analyze every review for
authenticity, not just star count).

Your clinic ranks #{rank} of {category} clinics in {district} by our Trust
Score. You're already getting organic traffic from us this month
(~{est_visits} visits).

Two ways we can amplify this:

1. Featured Editor's Pick — top of category page + homepage featured slot.
   ฿15,000/month. First 5 clinics get 50% off (฿7,500/mo first 3 months).

2. Lead capture — when patients fill out our booking form for {category},
   you get the lead via LINE/email instantly. We bill ฿200/lead, no
   minimum.

Either or both. No long-term contract.

Want to see your stats page? I'll send a 1-minute summary.

— {your name}
{your LINE / phone}
```

## 3단계: 태국어 버전 (현지 클리닉)

```
สวัสดีครับ/ค่ะ {clinic_name}

ผมจาก bangkokbotoxclinic.com — เว็บไซต์อิสระจัดอันดับคลินิกในกรุงเทพ
จาก {total_reviews} รีวิว Google ที่วิเคราะห์ความน่าเชื่อถือ

คลินิกของท่านอยู่อันดับ #{rank} ในหมวด {category} ที่ {district}
ตาม Trust Score ของเรา และได้รับ traffic จากเราเดือนละประมาณ {est_visits} ครั้ง

เรามีบริการ:
1. Featured Editor's Pick — แสดงด้านบนของหน้าหมวด + หน้าแรก
   ฿15,000/เดือน (5 คลินิกแรกได้ 50%, ฿7,500/เดือน 3 เดือนแรก)

2. Lead capture — ลูกค้าจองผ่านเว็บเรา ส่งให้ท่านทันทีทาง LINE
   ฿200/lead ไม่มีขั้นต่ำ

สนใจดูรายงานสถิติคลินิกของท่านไหมครับ?

— {your name}
{LINE: ...}
```

## 4단계: 한국어 버전 (한국 환자 타겟 클리닉)

```
안녕하세요 {clinic_name} 담당자님,

bangkokbotoxclinic.com 운영자입니다. 방콕 클리닉 2,000개를
Google 리뷰의 신뢰도 분석으로 랭킹하는 독립 디렉토리입니다.

{clinic_name}은 {district} 의 {category} 카테고리에서
저희 Trust Score 기준 #{rank} 입니다. 이번 달 저희 사이트로부터
약 {est_visits}명이 방문했습니다.

추가로 두 가지 옵션 제안드립니다:

1. Featured Editor's Pick — 카테고리/홈페이지 상단 노출
   월 ฿15,000 (얼리 5곳 50% 할인)

2. 예약 lead — 환자가 폼 제출하면 즉시 LINE/이메일로 전달
   ฿200/lead, 최소 X

긴 약정 없습니다. 통계 리포트 보내드려도 될까요?

— {운영자 이름}
{LINE/카톡 ID}
```

## 5단계: Follow-up (3일 / 7일 / 14일)

Day 3 — soft reminder (영어):
```
Hi again {clinic_name},

Just bumping the previous message. Quick add: I sent traffic data for
your clinic last week. Curious if you want to see the dashboard?

— {your name}
```

Day 7 — case study:
```
{Other clinic name} signed up last month for the Editor's Pick slot.
Their bookings via our funnel: {N} in 30 days. Average conversion
rate from /clinic/{their_id} page: {pct}%.

Same available for you — but only 5 slots and 2 are taken.

— {your name}
```

Day 14 — last chance:
```
Wrapping up Q{quarter} sponsor list this week. Your slot will go to next
clinic on waitlist if not confirmed by {date}.

LINE / phone if interested:
— {your name}
```

## 6단계: 받은 lead 처리 SLA

Featured slot 등록 시 SLA 약속:
- **15분 안에 LINE 알림 전송**
- **48시간 안에 답 안 오면 retry**
- 월 lead conversion 통계 리포트 (월말)
- Cancel anytime, prorated refund

## 가격 가이드 (출발점 — 협상 가능)

| Slot | 위치 | 월정액 (권장) | 협상 마진 |
|---|---|---|---|
| Editor's Pick | 카테고리/홈 최상단, 보라 배지 | ฿15,000 | -50% (얼리), -30% (장기) |
| Recommended | 상위 그룹, 파란 배지 | ฿10,000 | -40% (얼리) |
| Featured | 상위 listing, 회색 배지 | ฿5,000 | -30% (얼리) |
| CPL (Lead) | 폼 제출 1건당 | ฿200/lead | 최소 보장 시 -20% |
| B2B Dashboard (월) | 자기 페이지 통계 + 경쟁사 | ฿8,000 | first-50% 할인 |

식당 (snsstopper.com) — 클리닉 대비 가격 60-70% 권장.

## 다음 단계 (메모)

1. outreach_targets.tsv 추출 (위 1단계)
2. 상위 20곳 manual triage (LINE 또는 이메일 채널 결정)
3. 메시지 1편 발송 → 반응 측정
4. 결제 받으면 Vercel env에 `SPONSORED_*` 추가 (REVENUE_SETUP.md 참조)
5. 첫 5곳 sign 받으면 case study 만들어 다음 batch 가속

## 진행 추적

```
□ outreach_targets.tsv 추출
□ 첫 batch 20곳 발송
□ 1주일 후 follow-up
□ 2주일 후 last-chance
□ 첫 sponsor sign
□ Featured slot env 셋업
□ 1차 lead webhook 테스트
□ Lead 통계 dashboard (수동 — Slack channel 모니터링)
```
