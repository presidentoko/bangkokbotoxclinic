# LINE Messaging API 셋업 가이드

첫 partner가 등록되면 그 partner LINE으로 lead + crisis alert 푸시 보내야 함. LINE Messaging API 1회 셋업하면 모든 partner 공통으로 사용.

## 왜 LINE?
- 태국 클리닉 owner 95%+ LINE 사용 (Email보다 응답률 4-5배)
- Push 알림 즉시 도착 — crisis alert 15분 SLA 가능
- Free tier: 200 push/월 (partner 1-2명까지 무료)
- Light plan: ¥5,000/월 = ฿1,250 = partner 3명 넘으면 매출로 충당

## 단계별 (총 15-20분)

### ① LINE Developers 가입
1. https://developers.line.biz/ 접속
2. 우측 상단 **Log in** → LINE 계정으로 로그인 (개인 LINE 계정 OK)
3. 첫 가입이면 Developer 프로필 입력 (이름 / 이메일)
4. **Console** 들어가면 비어있는 dashboard 보임

### ② Provider 만들기 (회사/브랜드 단위)
1. **Create** → **Create a new provider**
2. Provider name: `Bangkok Botox Clinic`
3. **Create**

### ③ Messaging API channel 만들기
1. 방금 만든 provider 클릭 → **Create a Messaging API channel**
2. 입력값:
   - **Channel type**: Messaging API (기본 선택)
   - **Provider**: Bangkok Botox Clinic (자동 선택됨)
   - **Channel icon**: 클리닉 로고 또는 본인 로고 업로드 (256×256 PNG 권장)
   - **Channel name**: `Bangkok Clinic Alerts`
   - **Channel description**: `Real-time review + lead alerts for partner clinics`
   - **Category**: Healthcare → **Medical**
   - **Subcategory**: **Aesthetic clinic** (또는 비슷한 거)
   - **Email**: 본인 이메일 (chillanel22@gmail.com)
3. **약관 동의** 두 개 체크 → **Create**

### ④ Channel access token 발급 (가장 중요)
1. 방금 만든 채널 들어감 → **Messaging API** 탭
2. 맨 아래 **Channel access token (long-lived)** 섹션
3. **Issue** 버튼 클릭 → 긴 토큰 생성됨 (`eyJ...` 형식)
4. 토큰 클릭 → 복사. **닫으면 다시 못 봄. 메모장에 저장.**

### ⑤ Vercel env에 추가
1. https://vercel.com 프로젝트 → Settings → Environment Variables
2. 새 변수 추가:
   - Name: `LINE_DEFAULT_BOT_TOKEN`
   - Value: 위 토큰 붙여넣기
   - Type: **Sensitive**
   - Environments: **Production + Preview** ✓ (Development 풀기)
3. Save → Deployments 탭 → 최신 ⋯ → Redeploy

### ⑥ 본인 LINE user ID 얻기 (테스트용)
**가장 헤매는 단계.** 두 방법 중 하나:

**방법 A: webhook.site 사용 (제일 쉬움)**
1. https://webhook.site 접속 → 자동으로 unique URL 생성됨 (`https://webhook.site/abc-123-xyz`)
2. 그 URL 복사
3. LINE Developers 콘솔 → 본인 채널 → **Messaging API** 탭
4. **Webhook settings** → **Webhook URL** 에 webhook.site URL 붙여넣기 → **Update**
5. **Use webhook** 토글 **ON**
6. 같은 페이지 위쪽 **Bot info** 섹션에 **QR code** 있음. 스마트폰 LINE 앱으로 스캔 → 봇 친구추가
7. 봇한테 LINE 메시지 보내기 (아무거나, "test" 같은 거)
8. webhook.site 페이지에 events 도착함 — JSON 안에 `"source": { "userId": "U..." }` 보이면 그게 본인 user ID. 복사.
9. 끝나면 webhook.site URL 지우고 webhook 비활성화 권장 (보안)

**방법 B: 우리 production curl로 테스트 (admin user_id 알아야 함, 더 어려움)**
생략 — 방법 A로 가자.

### ⑦ 테스트 — 본인 LINE에 push 보내기
PowerShell에서 (위에서 얻은 token + user_id 사용):

```powershell
$token = "eyJ..."        # ⑤에서 받은 토큰
$userId = "U..."         # ⑥에서 얻은 user ID
$body = '{"to":"' + $userId + '","messages":[{"type":"text","text":"Test from Bangkok Botox Clinic system - it works!"}]}'
Invoke-WebRequest -Method POST -Uri "https://api.line.me/v2/bot/message/push" `
  -Headers @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" } `
  -Body $body
```

성공 → 본인 LINE에 "Test from Bangkok Botox Clinic system..." 메시지 도착. 1-2초 안.
실패 → 응답 status + body 확인:
- `401 Invalid token` → 토큰 잘못 복사. 재발급.
- `400 invalid user` → user_id 다시 확인. `U` 로 시작하는 33자.
- `403 friendship` → 봇한테 한 번 메시지 보낸 적 없음. ⑥ step 6 다시.

### ⑧ Production에서 자동 push 작동 확인
Vercel redeploy 끝났으면 (env 추가 후), 본인을 첫 partner로 임시 등록:

`web/data/clinic_partners.json` 에 추가:
```json
{
  "partners": [
    {
      "clinic_id": "<아무 클리닉 ID — 본인이 운영 중인 척>",
      "contact_email": "chillanel22@gmail.com",
      "line_user_id": "U... (본인 user ID)",
      "plan_tier": "trial",
      "monthly_ticket_avg_thb": 15000,
      "started_at": "2026-05-12"
    }
  ]
}
```

Push to git → Vercel redeploy → 그 clinic_id에 lead 폼 제출 → 본인 LINE에 push 도착 = end-to-end 작동.

## 향후 확장 (참고)
- **per-partner bot**: 각 클리닉이 본인 LINE OA token 우리에게 줘서 partner마다 다른 bot 운영 가능. `clinic_partners.json` 의 `line_bot_token` 필드. (선택사항 — 보통 우리 공통 bot으로 충분)
- **Push 한도**: Free 200/월 → partner 3명+ 되면 Light plan ¥5,000 (฿1,250)/월 결제. partner 1명 fee가 ฿8K이므로 0.16x 비용. 무시 가능.
- **Webhook for 양방향**: 지금은 push만. 만약 partner가 봇한테 "stop alerts" 같은 메시지 보내면 받기 가능. 별도 webhook handler 필요. V2.

## Troubleshooting

| 증상 | 원인 | 해결 |
|---|---|---|
| Test push 401 | Token typo or 만료 | LINE 콘솔에서 token re-issue |
| Test push 400 invalid user | user_id 오타 | webhook.site로 다시 추출 |
| Test push 403 friendship | partner가 봇 친구추가 안 함 | partner에게 QR code 보내서 추가 부탁 |
| Vercel `[notify.line] no token` 로그 | env 안 적용 | Redeploy + env 변수명 `LINE_DEFAULT_BOT_TOKEN` 정확 확인 |
| LINE 메시지 받았지만 너무 길어서 잘림 | LINE 4900자 한도 | `sendLinePush` 에서 이미 truncate — 알림 본문 줄이기 |
