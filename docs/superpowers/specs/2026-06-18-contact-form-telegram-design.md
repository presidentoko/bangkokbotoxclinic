# Contact Form → Telegram Design Spec

**Date:** 2026-06-18
**Status:** Approved

## Goal

Replace all hardcoded email contact info on bangkokfillers.com with a dedicated `/contact` page. Form submissions are forwarded to the owner's Telegram chat via Bot API. No email exposed publicly.

## Architecture

```
cosmetics/web/
  app/[locale]/contact/
    page.tsx          ← generateStaticParams, generateMetadata, Server Action, page UI
  components/
    ContactForm.tsx   ← "use client" — form state, submit handler, success/error display
  app/sitemap.ts      ← add /th/contact to coreEntries()
  components/Footer.tsx ← replace email link → /[locale]/contact link
  app/[locale]/media-kit/page.tsx ← replace CONTACT_EMAIL / mailto → /[locale]/contact link
  lib/featured.ts     ← update comment
```

**No new API route.** Server Action inline in `page.tsx` keeps the pattern consistent with `app/admin/actions.ts`.

## Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| 이름 (Name) | text | ✓ | 1–100 chars |
| 이메일 (Email) | email | ✓ | valid email format |
| 유형 (Type) | select | ✓ | one of: 광고문의 / 제휴 / 기타 |
| 메시지 (Message) | textarea | ✓ | 10–2000 chars |

## Server Action

```typescript
// In page.tsx
async function submitContact(formData: FormData) {
  "use server";
  // 1. Extract + validate fields (server-side)
  // 2. Build Markdown message
  // 3. POST to https://api.telegram.org/bot{TOKEN}/sendMessage
  // 4. Return { ok: true } or { ok: false, error: string }
}
```

Credentials via env vars (never in code):
- `TELEGRAM_BOT_TOKEN` — bot token
- `TELEGRAM_CHAT_ID` — owner's chat ID

## Telegram Message Format

```
🌸 *BangkokFillers 문의*
━━━━━━━━━━━━━━━━
*유형:* 광고문의
*이름:* 홍길동
*이메일:* hong@example.com
━━━━━━━━━━━━━━━━
메시지 내용이 여기 들어갑니다.
```

API call: `parse_mode: "Markdown"`, `chat_id: TELEGRAM_CHAT_ID`.

## ContactForm Component

- `"use client"` component
- `useActionState` (or `useState` + manual fetch) for pending/success/error state
- Submit button disabled while pending (`isPending`)
- On success: show inline "✅ 문의가 접수됐습니다" — no page navigation
- On error: show inline "⚠️ 잠시 후 다시 시도해 주세요"
- No page reload on submit

## Locale Handling

- `generateStaticParams`: `["th", "en"]` only (ko/ar are noindex)
- TH/EN text: inline ternary `th ? "..." : "..."` (same pattern as rest of codebase)
- `generateMetadata`: canonical + `alternates.languages` for th + en

## Sitemap

Add to `coreEntries()` in `sitemap.ts`:
```typescript
out.push(entry(`${BASE}/th/contact`, 0.6, "monthly"));
```

## Files to Remove Email From

| File | Current | Change |
|------|---------|--------|
| `components/Footer.tsx` | `mailto:chillanel22@gmail.com` link | Link to `/[locale]/contact` |
| `app/[locale]/media-kit/page.tsx` | `CONTACT_EMAIL` constant + CTA | Link to `/[locale]/contact` |
| `lib/featured.ts` | email in comment | update comment text |

## What This Is NOT

- No rate limiting (Server Action only, no KV dependency added)
- No file attachments
- No email confirmation to submitter
- No admin dashboard for viewing submissions (Telegram is the dashboard)
