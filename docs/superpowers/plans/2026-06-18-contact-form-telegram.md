# Contact Form → Telegram Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all hardcoded email contact info with a `/contact` page containing a form that forwards submissions to the owner's Telegram chat.

**Architecture:** Server Action in `app/[locale]/contact/actions.ts` calls the Telegram Bot API directly server-side. A `"use client"` `ContactForm` component handles pending/success/error state via React 19's `useActionState`. Footer and media-kit pages swap email links for `/[locale]/contact` links.

**Tech Stack:** Next.js 16 App Router, React 19 (`useActionState`), Telegram Bot API, Vitest

---

## File Map

| File | Change |
|------|--------|
| Create: `cosmetics/web/app/[locale]/contact/actions.ts` | Server Action + Telegram API call |
| Create: `cosmetics/web/components/ContactForm.tsx` | `"use client"` form with pending/success/error state |
| Create: `cosmetics/web/app/[locale]/contact/page.tsx` | Page shell, metadata, renders ContactForm |
| Create: `cosmetics/web/lib/__tests__/contact.test.ts` | Unit tests for server action |
| Modify: `cosmetics/web/components/Footer.tsx` | Replace email `<a>` with contact page `<Link>` |
| Modify: `cosmetics/web/app/[locale]/media-kit/page.tsx` | Remove `CONTACT_EMAIL`, replace email CTAs with contact page links, fix FAQ strings |
| Modify: `cosmetics/web/lib/featured.ts` | Update comment |
| Modify: `cosmetics/web/app/sitemap.ts` | Add `/th/contact` to `coreEntries()` |

---

## Task 1: Server Action + Tests

**Files:**
- Create: `cosmetics/web/app/[locale]/contact/actions.ts`
- Create: `cosmetics/web/lib/__tests__/contact.test.ts`

The server action validates form fields, builds a Markdown Telegram message, and calls `sendMessage`. Returns `{ ok: boolean; error?: string }`.

- [ ] **Step 1: Write the failing tests**

Create `cosmetics/web/lib/__tests__/contact.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Import after env stubs to avoid module-level WRAP read
// (dynamic import inside each test if needed, but vi.stubEnv before import works in vitest)

describe("submitContact", () => {
  beforeEach(() => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "test-token-123");
    vi.stubEnv("TELEGRAM_CHAT_ID", "99999999");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("returns error when name is empty", async () => {
    const { submitContact } = await import("@/app/[locale]/contact/actions");
    const fd = new FormData();
    fd.set("name", "");
    fd.set("email", "test@example.com");
    fd.set("type", "광고문의");
    fd.set("message", "This message is long enough to pass validation.");
    const result = await submitContact(null, fd);
    expect(result?.ok).toBe(false);
    expect(result?.error).toBeTruthy();
  });

  it("returns error when message is shorter than 10 chars", async () => {
    const { submitContact } = await import("@/app/[locale]/contact/actions");
    const fd = new FormData();
    fd.set("name", "Test User");
    fd.set("email", "test@example.com");
    fd.set("type", "광고문의");
    fd.set("message", "short");
    const result = await submitContact(null, fd);
    expect(result?.ok).toBe(false);
  });

  it("calls Telegram API and returns ok:true on success", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    const { submitContact } = await import("@/app/[locale]/contact/actions");
    const fd = new FormData();
    fd.set("name", "Test User");
    fd.set("email", "test@example.com");
    fd.set("type", "광고문의");
    fd.set("message", "This message is long enough to pass the validation check.");
    const result = await submitContact(null, fd);
    expect(result?.ok).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.telegram.org/bottest-token-123/sendMessage",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("returns ok:false when Telegram API fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    const { submitContact } = await import("@/app/[locale]/contact/actions");
    const fd = new FormData();
    fd.set("name", "Test User");
    fd.set("email", "test@example.com");
    fd.set("type", "광고문의");
    fd.set("message", "This message is long enough to pass the validation check.");
    const result = await submitContact(null, fd);
    expect(result?.ok).toBe(false);
    expect(result?.error).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run tests — confirm they fail (file not found)**

```bash
cd cosmetics/web && npm test -- lib/__tests__/contact.test.ts 2>&1
```
(PowerShell: `cd cosmetics\web; npm test -- lib/__tests__/contact.test.ts`)

Expected: FAIL — `Cannot find module '@/app/[locale]/contact/actions'`

- [ ] **Step 3: Create the server action**

Create `cosmetics/web/app/[locale]/contact/actions.ts`:

```typescript
"use server";

export type ContactState = { ok: boolean; error?: string } | null;

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = ((formData.get("name") as string) ?? "").trim();
  const email = ((formData.get("email") as string) ?? "").trim();
  const type = ((formData.get("type") as string) ?? "").trim();
  const message = ((formData.get("message") as string) ?? "").trim();

  if (!name || !email || !type || !message) {
    return { ok: false, error: "모든 필드를 입력해 주세요." };
  }
  if (message.length < 10) {
    return { ok: false, error: "메시지를 10자 이상 입력해 주세요." };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { ok: false, error: "서버 설정 오류입니다." };
  }

  const text = [
    "🌸 *BangkokFillers 문의*",
    "━━━━━━━━━━━━━━━━",
    `*유형:* ${type}`,
    `*이름:* ${name}`,
    `*이메일:* ${email}`,
    "━━━━━━━━━━━━━━━━",
    message,
  ].join("\n");

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    }
  );

  if (!res.ok) {
    return { ok: false, error: "잠시 후 다시 시도해 주세요." };
  }
  return { ok: true };
}
```

- [ ] **Step 4: Run tests — all 4 should pass**

```bash
cd cosmetics/web && npm test -- lib/__tests__/contact.test.ts
```

Expected: 4 passed

- [ ] **Step 5: Commit**

```bash
git add "cosmetics/web/app/[locale]/contact/actions.ts" cosmetics/web/lib/__tests__/contact.test.ts
git commit -m "feat(contact): server action — validate + forward to Telegram"
```

---

## Task 2: ContactForm Client Component

**Files:**
- Create: `cosmetics/web/components/ContactForm.tsx`

React 19 `useActionState` manages the action state (pending/success/error). On success, replaces the form with a confirmation message in-place.

- [ ] **Step 1: Create the component**

Create `cosmetics/web/components/ContactForm.tsx`:

```tsx
"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/[locale]/contact/actions";
import type { Locale } from "@/lib/i18n";

const TYPE_OPTIONS: Record<string, string[]> = {
  th: ["광고문의", "제휴", "기타"],
  en: ["Advertising", "Partnership", "Other"],
};

export function ContactForm({ locale }: { locale: Locale }) {
  const [state, action, isPending] = useActionState<ContactState, FormData>(
    submitContact,
    null
  );
  const th = locale === "th";
  const types = th ? TYPE_OPTIONS.th : TYPE_OPTIONS.en;

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-[#efe1db] bg-white px-6 py-10 text-center shadow-sm shadow-rose-100">
        <p className="text-2xl mb-2">✅</p>
        <p className="font-semibold text-neutral-800">
          {th ? "문의가 접수됐습니다." : "Message received."}
        </p>
        <p className="text-sm text-neutral-500 mt-1">
          {th ? "곧 연락 드리겠습니다." : "We'll be in touch soon."}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <p className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-600">
          ⚠️ {state.error}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {th ? "이름" : "Name"}
        </label>
        <input
          name="name"
          type="text"
          required
          maxLength={100}
          className="w-full rounded-xl border border-[#efe1db] px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {th ? "이메일" : "Email"}
        </label>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-xl border border-[#efe1db] px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {th ? "문의 유형" : "Type"}
        </label>
        <select
          name="type"
          required
          defaultValue=""
          className="w-full rounded-xl border border-[#efe1db] px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          <option value="" disabled>
            {th ? "선택하세요" : "Select…"}
          </option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {th ? "메시지" : "Message"}
        </label>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          className="w-full rounded-xl border border-[#efe1db] px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-2xl bg-rose-500 hover:bg-rose-600 active:bg-rose-700 disabled:opacity-50 px-6 py-3 text-white font-semibold text-base transition-colors"
      >
        {isPending
          ? th ? "전송 중…" : "Sending…"
          : th ? "문의 보내기" : "Send message"}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: TypeScript check**

```bash
cd cosmetics/web && npx tsc --noEmit 2>&1 | Select-Object -Last 10
```
(PowerShell)

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add cosmetics/web/components/ContactForm.tsx
git commit -m "feat(contact): ContactForm client component with useActionState"
```

---

## Task 3: Contact Page

**Files:**
- Create: `cosmetics/web/app/[locale]/contact/page.tsx`

Static params for `["th", "en"]` only. Metadata with canonical + hreflang. Page renders the `ContactForm`.

- [ ] **Step 1: Create the page**

Create `cosmetics/web/app/[locale]/contact/page.tsx`:

```tsx
import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { ContactForm } from "@/components/ContactForm";

const BASE = "https://bangkokfillers.com";

export function generateStaticParams() {
  return [{ locale: "th" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const th = locale === "th";
  return {
    title: th
      ? "ติดต่อเรา — BangkokFillers"
      : "Contact Us — BangkokFillers",
    description: th
      ? "สอบถามโฆษณา พาร์ทเนอร์ชิพ หรือข้อเสนอแนะ"
      : "Advertising, partnership, or general enquiries.",
    alternates: {
      canonical: `${BASE}/${locale}/contact`,
      languages: {
        th: `${BASE}/th/contact`,
        en: `${BASE}/en/contact`,
        "x-default": `${BASE}/th/contact`,
      },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeRaw } = await params;
  const locale = localeRaw as Locale;
  const th = locale === "th";

  return (
    <div className="max-w-lg mx-auto space-y-8 py-8">
      <header className="space-y-2 border-b border-[#efe1db] pb-6">
        <h1 className="font-serif-display text-3xl font-semibold text-neutral-900">
          {th ? "ติดต่อเรา" : "Contact Us"}
        </h1>
        <p className="text-neutral-500 text-base leading-relaxed">
          {th
            ? "สอบถามเรื่องโฆษณา พาร์ทเนอร์ชิพ หรือข้อเสนอแนะ — เราตอบทุกข้อความ"
            : "Advertising, partnerships, or general feedback — we reply to everything."}
        </p>
      </header>
      <ContactForm locale={locale} />
    </div>
  );
}
```

- [ ] **Step 2: Full build check**

```bash
cd cosmetics/web && npm run build 2>&1 | Select-Object -Last 20
```
(PowerShell)

Expected: build succeeds, `/th/contact` and `/en/contact` appear in static pages output.

- [ ] **Step 3: Run full test suite**

```bash
cd cosmetics/web && npm test
```

Expected: all tests pass (50+ passed).

- [ ] **Step 4: Commit**

```bash
git add "cosmetics/web/app/[locale]/contact/page.tsx"
git commit -m "feat(contact): /contact page with form and metadata"
```

---

## Task 4: Wire Up — Footer, media-kit, sitemap

**Files:**
- Modify: `cosmetics/web/components/Footer.tsx`
- Modify: `cosmetics/web/app/[locale]/media-kit/page.tsx`
- Modify: `cosmetics/web/lib/featured.ts`
- Modify: `cosmetics/web/app/sitemap.ts`

### Footer

Read `cosmetics/web/components/Footer.tsx`. Find the advertising contact block (around line 41–53). Replace the `<a href="mailto:...">` tag with a `<Link>` to the contact page. The `isTh` variable already exists.

- [ ] **Step 1: Update Footer.tsx**

Find this block (lines ~47–52):
```tsx
<a
  href="mailto:chillanel22@gmail.com"
  className="text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors whitespace-nowrap"
>
  chillanel22@gmail.com →
</a>
```

Replace with:
```tsx
<Link
  href={`/${locale}/contact`}
  className="text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors whitespace-nowrap"
>
  {isTh ? "문의하기 →" : "Get in touch →"}
</Link>
```

`Link` is already imported at the top of `Footer.tsx`.

### media-kit

- [ ] **Step 2: Update media-kit/page.tsx**

**2a. Remove `CONTACT_EMAIL` constant (line 9):**

Delete: `const CONTACT_EMAIL = "chillanel22@gmail.com";`

**2b. Fix TH FAQ answer (line ~140):**

Old:
```
"ราคาขึ้นอยู่กับ placement และระยะเวลา — ติดต่อ chillanel22@gmail.com เพื่อรับ proposal"
```
New:
```
"ราคาขึ้นอยู่กับ placement และระยะเวลา — กรอกแบบฟอร์มที่หน้าติดต่อเราเพื่อรับ proposal"
```

**2c. Fix EN FAQ answer (line ~144):**

Old:
```
"Pricing depends on placement and duration — email chillanel22@gmail.com for a proposal."
```
New:
```
"Pricing depends on placement and duration — fill in the contact form for a proposal."
```

**2d. Replace header CTA button (lines ~164–169):**

Old:
```tsx
<a
  href={`mailto:${CONTACT_EMAIL}`}
  className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-2xl px-6 py-3 transition-colors shadow-sm shadow-rose-200 text-sm"
>
  {isTh ? "ติดต่อเราตอนนี้ →" : "Contact us now →"}
</a>
```
New:
```tsx
<Link
  href={`/${locale}/contact`}
  className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-2xl px-6 py-3 transition-colors shadow-sm shadow-rose-200 text-sm"
>
  {isTh ? "ติดต่อเราตอนนี้ →" : "Contact us now →"}
</Link>
```

**2e. Replace bottom CTA section (lines ~288–294):**

Old:
```tsx
<a
  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(isTh ? "สอบถามโฆษณา BangkokFillers" : "Advertising inquiry — BangkokFillers")}`}
  className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-2xl px-8 py-4 transition-colors shadow-sm shadow-rose-200"
>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
  {isTh ? `อีเมลหาเราที่ ${CONTACT_EMAIL}` : `Email us at ${CONTACT_EMAIL}`}
</a>
```
New:
```tsx
<Link
  href={`/${locale}/contact`}
  className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-2xl px-8 py-4 transition-colors shadow-sm shadow-rose-200"
>
  {isTh ? "กรอกแบบฟอร์มติดต่อเรา →" : "Fill in our contact form →"}
</Link>
```

**Note:** `Link` is already imported at the top of `media-kit/page.tsx`.

### featured.ts

- [ ] **Step 3: Update lib/featured.ts comment**

Old (line 4):
```typescript
// Contact chillanel22@gmail.com to purchase a sponsored slot.
```
New:
```typescript
// Visit /contact to purchase a sponsored slot.
```

### sitemap.ts

- [ ] **Step 4: Add /th/contact to coreEntries()**

In `cosmetics/web/app/sitemap.ts`, inside `coreEntries()`, after the media-kit entry:

Old:
```typescript
out.push(entry(`${BASE}/th/media-kit`, 0.5, "monthly"));
```
New:
```typescript
out.push(entry(`${BASE}/th/media-kit`, 0.5, "monthly"));
out.push(entry(`${BASE}/th/contact`, 0.6, "monthly"));
```

### Verify

- [ ] **Step 5: Grep to confirm no email references remain**

```bash
grep -r "chillanel22@gmail.com\|umma@xx.gg\|CONTACT_EMAIL\|mailto:" cosmetics/web/app cosmetics/web/components cosmetics/web/lib
```
(PowerShell: `Select-String -Path "cosmetics\web\app\*","cosmetics\web\components\*","cosmetics\web\lib\*" -Pattern "chillanel22|umma@xx|CONTACT_EMAIL|mailto:" -Recurse`)

Expected: **no matches** (except the test file if it references email, which it doesn't).

- [ ] **Step 6: Build verify**

```bash
cd cosmetics/web && npm run build 2>&1 | Select-Object -Last 10
```

Expected: build succeeds, no TypeScript errors.

- [ ] **Step 7: Commit**

```bash
git add cosmetics/web/components/Footer.tsx "cosmetics/web/app/[locale]/media-kit/page.tsx" cosmetics/web/lib/featured.ts cosmetics/web/app/sitemap.ts
git commit -m "feat(contact): wire footer + media-kit + sitemap to /contact page"
```

---

## Task 5: Set Env Vars in Vercel (Config, No Code)

**Files:** None — Vercel dashboard or CLI only.

- [ ] **Step 1: Add TELEGRAM_BOT_TOKEN to Vercel**

```bash
cd cosmetics/web
npx vercel env add TELEGRAM_BOT_TOKEN production
# Paste the bot token when prompted
```

Or via Vercel dashboard → Project Settings → Environment Variables.

- [ ] **Step 2: Add TELEGRAM_CHAT_ID to Vercel**

```bash
npx vercel env add TELEGRAM_CHAT_ID production
# Paste the chat ID when prompted
```

- [ ] **Step 3: Redeploy**

After adding env vars, trigger a redeploy for them to take effect.

---

## Verification Checklist (Post-Deploy)

- [ ] Visit `https://bangkokfillers.com/th/contact` — form renders with all 4 fields
- [ ] Submit the form with valid data — Telegram message arrives in owner's chat
- [ ] Submit with empty name — error message appears inline, no page reload
- [ ] Check `https://bangkokfillers.com/th` footer — "문의하기 →" link to `/th/contact`
- [ ] Check `https://bangkokfillers.com/th/media-kit` — both CTAs link to `/th/contact`, no email visible
- [ ] `https://bangkokfillers.com/sitemap-0.xml` — includes `/th/contact`
- [ ] `grep -r "chillanel22\|umma@xx" cosmetics/web/` — zero results
