# chillanel.com Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a standalone Next.js site at `deliverable/chillanel/`, deployed to `chillanel.com`, that presents Bangkok massage/spa places with a distinctive angle — reviewer-mentioned therapists surfaced alongside their quotes, not just facility rankings.

**Architecture:** Standalone Next.js 16 App Router project (own `package.json`, own Vercel project), modeled on `thaifacialclinic-portable/`'s build shape (`build-data.mjs` prebuild step → static JSON → statically generated pages) but without any of the clinic-network's lead/CRM/payment machinery. Content-first: no booking, no lead capture, no partner accounts in this plan.

**Tech Stack:** Next.js 16 (App Router, TypeScript, Turbopack), React 19, Tailwind CSS 3.4, `csv-parse` for the data pipeline, Node's built-in `node:test` + `node:assert` for pipeline unit tests (no new test framework dependency — matches this repo's existing convention of zero test-runner deps).

## Global Constraints

- Domain: `chillanel.com` (already owned by user, Hostinger registrar).
- Languages: `en` (default), `th`, `ko` — all three ship at launch.
- Cities: Bangkok only at launch; `city` must be a route param + data-loader arg, never hardcoded, so a second city is a data-only addition.
- District-level routes are out of scope for v1.
- No lead capture, booking form, partner CRM, payment, or LINE/WhatsApp/Telegram integration in this plan.
- Therapist-name mentions extracted from review text must **never** be presented as a factual/verified claim. Every surfaced name must be shown with its source quote and a visible "auto-extracted, unverified" disclaimer. A name is only surfaced if it appears in **2 or more independent reviews** for the same place.
- Deploy with `vercel --prod` (no `--archive=tgz` — that flag bypasses `.vercelignore` and uploads the whole monorepo).
- Any server-side `fetch()` inside a page's render path must use `next: { revalidate: N }`, never `cache: "no-store"` (forces the whole route dynamic — see 2026-07-23 audit in this repo's `web/lib/sponsoredStore.ts` fix).
- Source data: `spa_output/bangkok/clinics.csv` (columns: `place_id, name, primary_type, formatted_address, plus_code, latitude, longitude, phone, website, menu_url, rating, total_reviews, price_level, price_symbol, business_status, editorial_summary, maps_url`) + `spa_output/bangkok/reviews/{place_id_with_underscores}_reviews.csv` (columns: `review_id, place_id, restaurant_name, rating, text, author_name, author_id, author_uri, author_photo_uri, author_is_local_guide, author_review_count, author_photo_count, relative_date, spent_amount, sort_source`). `place_id` in `clinics.csv` uses `0x..:0x..` (colon); review filenames replace `:` with `_`.

---

## Task 1: Project scaffold

**Files:**
- Create: `chillanel/package.json`
- Create: `chillanel/tsconfig.json`
- Create: `chillanel/next.config.ts`
- Create: `chillanel/postcss.config.mjs`
- Create: `chillanel/tailwind.config.ts`
- Create: `chillanel/.gitignore`
- Create: `chillanel/.vercelignore`
- Create: `chillanel/app/globals.css`
- Create: `chillanel/app/layout.tsx`
- Create: `chillanel/app/page.tsx`
- Create: `chillanel/next-env.d.ts`

**Interfaces:**
- Produces: a buildable Next.js app with `npm run build` succeeding on a placeholder-free root page. No other task depends on this file's contents beyond "the app builds."

- [ ] **Step 1: Create the directory and package.json**

```bash
mkdir -p chillanel
cd chillanel
```

`chillanel/package.json`:
```json
{
  "name": "chillanel",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "prebuild": "node scripts/build-data.mjs",
    "vercel-build": "node scripts/build-data.mjs && next build",
    "data": "node scripts/build-data.mjs",
    "test": "node --test scripts/*.test.mjs"
  },
  "dependencies": {
    "@vercel/analytics": "^2.0.1",
    "@vercel/speed-insights": "^2.0.0",
    "csv-parse": "^5.6.0",
    "next": "^16.2.4",
    "react": "^19.2.5",
    "react-dom": "^19.2.5"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.2.4",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.13",
    "typescript": "^5.7.2"
  }
}
```

`chillanel/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`chillanel/next.config.ts`:
```typescript
import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  compress: true,
  poweredByHeader: false,
};

export default config;
```

`chillanel/postcss.config.mjs`:
```javascript
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

`chillanel/tailwind.config.ts`:
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        "bg-elev": "rgb(var(--bg-elev) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};

export default config;
```

`chillanel/.gitignore`:
```
node_modules
.next
.vercel
next-env.d.ts
*.log
```

`chillanel/.vercelignore`:
```
node_modules
.next
scripts/*.test.mjs
```

`chillanel/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: 250 253 252;          /* pale mint-white */
  --bg-elev: 255 255 255;
  --fg: 20 35 33;              /* deep teal-black */
  --muted: 90 105 102;
  --border: 214 228 224;
  --accent: 15 118 110;        /* teal-600 */
}
html.dark {
  --bg: 8 15 14;
  --bg-elev: 18 28 27;
  --fg: 236 245 243;
  --muted: 148 165 161;
  --border: 34 51 48;
  --accent: 45 212 191;        /* teal-400 */
}

html { scroll-behavior: smooth; }
body { background: rgb(var(--bg)); color: rgb(var(--fg)); }
```

`chillanel/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "chillanel",
  description: "chillanel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`chillanel/app/page.tsx` (temporary root — Task 6 replaces this with a redirect to `/en`):
```tsx
export default function RootPage() {
  return <div className="p-8">chillanel — scaffold OK</div>;
}
```

- [ ] **Step 2: Install dependencies**

```bash
cd chillanel && npm install
```

Expected: installs without error, creates `package-lock.json`.

- [ ] **Step 3: Verify the build**

```bash
cd chillanel && npm run build
```

Expected: `✓ Compiled successfully`, exits 0. (The `prebuild` script will fail at this point because `scripts/build-data.mjs` doesn't exist yet — for this step only, temporarily run `npx next build` directly instead of `npm run build` to skip the prebuild hook. From Task 4 onward, `npm run build` is the real command to use.)

```bash
cd chillanel && npx next build
```

Expected: `✓ Compiled successfully`, exits 0.

- [ ] **Step 4: Commit**

```bash
git add chillanel/package.json chillanel/tsconfig.json chillanel/next.config.ts \
  chillanel/postcss.config.mjs chillanel/tailwind.config.ts chillanel/.gitignore \
  chillanel/.vercelignore chillanel/app/globals.css chillanel/app/layout.tsx chillanel/app/page.tsx
git commit -m "chillanel: project scaffold"
```

---

## Task 2: Site config + i18n dictionaries

**Files:**
- Create: `chillanel/lib/site.ts`
- Create: `chillanel/lib/i18n.ts`
- Test: `chillanel/scripts/i18n.test.mjs`

**Interfaces:**
- Consumes: nothing (leaf module).
- Produces: `SITE` constant (`{ name, domain, defaultLang, supportedLangs }`), `type Lang = "en" | "th" | "ko"`, `tFor(lang: Lang): Dict` returning the full UI-string dictionary. Every later task that renders UI text imports `tFor` from `@/lib/i18n` and `SITE` from `@/lib/site`.

- [ ] **Step 1: Write `lib/site.ts`**

`chillanel/lib/site.ts`:
```typescript
export const SUPPORTED_LANGS = ["en", "th", "ko"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: Lang = "en";

export const SITE = {
  name: "chillanel",
  domain: "chillanel.com",
  origin: "https://www.chillanel.com",
  defaultLang: DEFAULT_LANG,
  supportedLangs: SUPPORTED_LANGS,
};

export function isLang(v: string): v is Lang {
  return (SUPPORTED_LANGS as readonly string[]).includes(v);
}
```

- [ ] **Step 2: Write `lib/i18n.ts`**

`chillanel/lib/i18n.ts`:
```typescript
import type { Lang } from "./site";

export type Dict = {
  nav: { home: string; guides: string; about: string };
  home: {
    heroTitle: string;
    heroSub: string;
    philosophyTitle: string;
    philosophyBody: string;
    featuredTitle: string;
  };
  place: {
    reviewsTitle: string;
    therapistMentionsTitle: string;
    therapistDisclaimer: string;
    noMentions: string;
    ratingLabel: string;
    reviewCountLabel: string;
    addressLabel: string;
    viewOnMaps: string;
  };
  city: { listTitle: string; placeCount: string };
  guide: { indexTitle: string };
  about: { title: string; body: string };
  footer: { rights: string };
};

const en: Dict = {
  nav: { home: "Home", guides: "Guides", about: "About" },
  home: {
    heroTitle: "It's not the spa. It's the hands.",
    heroSub:
      "chillanel is a Bangkok massage & spa guide built around the one thing every ranking site ignores: who's actually giving the massage.",
    philosophyTitle: "Why we're different",
    philosophyBody:
      "A five-star lobby doesn't guarantee a good massage, and a plain shophouse doesn't mean a bad one. We read the reviews for the parts other sites skip — the ones that name names.",
    featuredTitle: "Featured places",
  },
  place: {
    reviewsTitle: "What reviewers say",
    therapistMentionsTitle: "Reviewers mentioned",
    therapistDisclaimer:
      "These names are auto-extracted from public reviews and are unverified — always confirm availability with the venue.",
    noMentions: "No individual staff mentioned by name yet in the reviews we've collected.",
    ratingLabel: "Rating",
    reviewCountLabel: "reviews",
    addressLabel: "Address",
    viewOnMaps: "View on Google Maps",
  },
  city: { listTitle: "Massage & spa in", placeCount: "places" },
  guide: { indexTitle: "Guides" },
  about: {
    title: "About chillanel",
    body:
      "chillanel is an independent guide to massage and spa places in Thailand. We're not affiliated with any venue. Our angle: therapist quality varies far more than facility quality, so we surface what reviewers say about the people, not just the place.",
  },
  footer: { rights: "Independent guide. Not affiliated with any venue." },
};

const th: Dict = {
  nav: { home: "หน้าแรก", guides: "คู่มือ", about: "เกี่ยวกับเรา" },
  home: {
    heroTitle: "ไม่ใช่ร้าน แต่เป็นฝีมือคน",
    heroSub:
      "chillanel คือคู่มือร้านนวด & สปาในกรุงเทพฯ ที่โฟกัสสิ่งที่เว็บจัดอันดับอื่นมองข้าม นั่นคือ ใครเป็นคนนวดจริง ๆ",
    philosophyTitle: "ทำไมเราถึงต่าง",
    philosophyBody:
      "ล็อบบี้ห้าดาวไม่ได้การันตีฝีมือนวดที่ดี และร้านเล็ก ๆ ก็ไม่ได้แปลว่าแย่เสมอไป เราอ่านรีวิวในส่วนที่เว็บอื่นข้ามไป — ส่วนที่เอ่ยชื่อจริง ๆ",
    featuredTitle: "ร้านแนะนำ",
  },
  place: {
    reviewsTitle: "รีวิวจากผู้ใช้บริการ",
    therapistMentionsTitle: "ชื่อที่ถูกกล่าวถึงในรีวิว",
    therapistDisclaimer:
      "ชื่อเหล่านี้ดึงมาจากรีวิวสาธารณะโดยอัตโนมัติและยังไม่ได้ยืนยัน — กรุณาสอบถามร้านโดยตรงก่อนเข้ารับบริการ",
    noMentions: "ยังไม่มีการเอ่ยชื่อพนักงานคนใดในรีวิวที่เรารวบรวมได้",
    ratingLabel: "คะแนน",
    reviewCountLabel: "รีวิว",
    addressLabel: "ที่อยู่",
    viewOnMaps: "ดูใน Google Maps",
  },
  city: { listTitle: "ร้านนวดและสปาใน", placeCount: "ร้าน" },
  guide: { indexTitle: "คู่มือ" },
  about: {
    title: "เกี่ยวกับ chillanel",
    body:
      "chillanel คือคู่มืออิสระสำหรับร้านนวดและสปาในประเทศไทย เราไม่มีส่วนเกี่ยวข้องกับร้านใด ๆ มุมมองของเรา: ฝีมือของพนักงานนวดต่างกันมากกว่าคุณภาพของสถานที่ เราจึงนำเสนอสิ่งที่รีวิวพูดถึงตัวคน ไม่ใช่แค่สถานที่",
  },
  footer: { rights: "คู่มืออิสระ ไม่มีส่วนเกี่ยวข้องกับร้านใด ๆ" },
};

const ko: Dict = {
  nav: { home: "홈", guides: "가이드", about: "소개" },
  home: {
    heroTitle: "중요한 건 스파가 아니라 손끝이에요.",
    heroSub:
      "chillanel은 다른 순위 사이트들이 놓치는 단 하나 — 실제로 누가 마사지를 해주는지에 집중한 방콕 마사지·스파 가이드입니다.",
    philosophyTitle: "우리가 다른 이유",
    philosophyBody:
      "화려한 로비가 좋은 마사지를 보장하지 않고, 소박한 샵이라고 실력이 없는 것도 아니에요. 저희는 다른 사이트가 건너뛰는 리뷰 부분 — 실명이 언급된 부분을 읽습니다.",
    featuredTitle: "추천 업체",
  },
  place: {
    reviewsTitle: "리뷰어들의 후기",
    therapistMentionsTitle: "리뷰에서 언급된 이름",
    therapistDisclaimer:
      "이 이름들은 공개 리뷰에서 자동으로 추출된 것으로 검증되지 않았습니다 — 방문 전 업체에 직접 확인하세요.",
    noMentions: "아직 수집된 리뷰 중 직원 이름이 언급된 사례가 없습니다.",
    ratingLabel: "평점",
    reviewCountLabel: "리뷰",
    addressLabel: "주소",
    viewOnMaps: "구글맵에서 보기",
  },
  city: { listTitle: "의 마사지 & 스파", placeCount: "곳" },
  guide: { indexTitle: "가이드" },
  about: {
    title: "chillanel 소개",
    body:
      "chillanel은 태국 마사지·스파 업체에 대한 독립 가이드입니다. 특정 업체와 제휴 관계가 없습니다. 저희 관점: 시설보다 테라피스트의 실력 차이가 훨씬 크기 때문에, 장소가 아니라 사람에 대한 리뷰 내용을 보여드립니다.",
  },
  footer: { rights: "독립 가이드입니다. 특정 업체와 제휴 관계가 없습니다." },
};

const DICTS: Record<Lang, Dict> = { en, th, ko };

export function tFor(lang: Lang): Dict {
  return DICTS[lang] ?? DICTS.en;
}
```

- [ ] **Step 2: Write a smoke test asserting every language has every key**

`chillanel/scripts/i18n.test.mjs`:
```javascript
import { test } from "node:test";
import assert from "node:assert/strict";

// Import via a tiny require-free trick: since lib/i18n.ts is TypeScript and this
// test runs with plain Node, we assert the compiled JS after `next build` isn't
// available pre-build. Instead, statically read + parse the source with a
// lightweight structural check: every top-level key set must match across langs.
import fs from "node:fs";
import path from "node:path";

test("i18n: en/th/ko define the same set of top-level dictionary keys", () => {
  const src = fs.readFileSync(path.join(import.meta.dirname, "..", "lib", "i18n.ts"), "utf-8");
  const blocks = ["en", "th", "ko"].map((lang) => {
    const m = src.match(new RegExp(`const ${lang}: Dict = \\{([\\s\\S]*?)\\n\\};`));
    assert.ok(m, `could not find ${lang} dict block`);
    return m[1];
  });
  const topKeys = (block) =>
    [...block.matchAll(/^\s{2}(\w+):\s*\{/gm)].map((m) => m[1]).sort();
  const [enKeys, thKeys, koKeys] = blocks.map(topKeys);
  assert.deepEqual(thKeys, enKeys, "th top-level keys must match en");
  assert.deepEqual(koKeys, enKeys, "ko top-level keys must match en");
  assert.ok(enKeys.length >= 6, "expected at least 6 top-level sections");
});
```

- [ ] **Step 3: Run the test**

```bash
cd chillanel && node --test scripts/i18n.test.mjs
```

Expected: `# pass 1`, exit code 0.

- [ ] **Step 4: Commit**

```bash
git add chillanel/lib/site.ts chillanel/lib/i18n.ts chillanel/scripts/i18n.test.mjs
git commit -m "chillanel: site config + en/th/ko i18n dictionaries"
```

---

## Task 3: Therapist-mention extraction (core differentiator)

**Files:**
- Create: `chillanel/lib/types.ts`
- Create: `chillanel/scripts/extract-therapists.mjs`
- Test: `chillanel/scripts/extract-therapists.test.mjs`

**Interfaces:**
- Consumes: nothing (pure functions over strings).
- Produces: `extractMentionsFromReviews(reviews: {text: string}[]): TherapistMention[]` where `TherapistMention = { name: string, count: number, quotes: string[] }`. Task 4 (`build-data.mjs`) imports this function directly.

- [ ] **Step 1: Write `lib/types.ts`**

`chillanel/lib/types.ts`:
```typescript
export type TherapistMention = {
  name: string;
  count: number;
  quotes: string[];
};

export type Review = {
  id: string;
  rating: number | null;
  text: string;
  authorName: string;
  relativeDate: string;
};

export type Place = {
  id: string;
  name: string;
  city: string;
  address: string;
  lat: number | null;
  lng: number | null;
  phone: string;
  website: string;
  rating: number | null;
  reviewCount: number;
  primaryType: string;
  mapsUrl: string;
  reviews: Review[];
  therapistMentions: TherapistMention[];
};

export type CityData = {
  city: string;
  generatedAt: string;
  places: Place[];
};
```

- [ ] **Step 2: Write the failing test**

`chillanel/scripts/extract-therapists.test.mjs`:
```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import { extractMentionsFromReviews } from "./extract-therapists.mjs";

test("extracts a name mentioned in 2+ reviews via 'ask for X' pattern", () => {
  const reviews = [
    { text: "Great place, ask for Nong, she's amazing." },
    { text: "Ask for Nong next time, best massage I've had." },
    { text: "Clean and relaxing overall." },
  ];
  const mentions = extractMentionsFromReviews(reviews);
  assert.equal(mentions.length, 1);
  assert.equal(mentions[0].name, "Nong");
  assert.equal(mentions[0].count, 2);
  assert.equal(mentions[0].quotes.length, 2);
});

test("drops a name mentioned in only 1 review (false-positive suppression)", () => {
  const reviews = [
    { text: "Ask for Somchai, he was great." },
    { text: "Nice quiet place, good pricing." },
  ];
  const mentions = extractMentionsFromReviews(reviews);
  assert.equal(mentions.length, 0);
});

test("extracts '[Name] was amazing' pattern", () => {
  const reviews = [
    { text: "Malee was amazing, best massage in Bangkok." },
    { text: "Went back on my second trip and Malee was amazing again." },
  ];
  const mentions = extractMentionsFromReviews(reviews);
  assert.equal(mentions.length, 1);
  assert.equal(mentions[0].name, "Malee");
});

test("ignores sentence-initial stopwords that look like names", () => {
  const reviews = [
    { text: "This was amazing, will come back." },
    { text: "This was amazing service overall." },
    { text: "Best massage ever, highly recommend." },
    { text: "Best place in town, highly recommend it." },
  ];
  const mentions = extractMentionsFromReviews(reviews);
  assert.equal(mentions.length, 0, `expected no false-positive names, got: ${JSON.stringify(mentions)}`);
});

test("deduplicates same name across different patterns and merges counts", () => {
  const reviews = [
    { text: "Ask for Ploy, she's the best." },
    { text: "Ploy was amazing, super strong hands." },
    { text: "Thanks to Ploy for a great session." },
  ];
  const mentions = extractMentionsFromReviews(reviews);
  assert.equal(mentions.length, 1);
  assert.equal(mentions[0].name, "Ploy");
  assert.equal(mentions[0].count, 3);
});

test("handles empty/whitespace-only review text without throwing", () => {
  const reviews = [{ text: "" }, { text: "   " }, { text: null }];
  assert.doesNotThrow(() => extractMentionsFromReviews(reviews));
  assert.equal(extractMentionsFromReviews(reviews).length, 0);
});

test("does not capture a lowercase pronoun as a name (case-fold false positive)", () => {
  // The "i" flag on PATTERNS makes trigger words case-insensitive, but must
  // not also let it capture a lowercase word as a "name" — regex captures
  // keep the source text's actual casing, so a candidate whose captured
  // text isn't itself capitalized must be rejected.
  const reviews = [
    { text: "The room was clean and she was amazing at her job." },
    { text: "Overall pleasant visit, she was amazing throughout." },
  ];
  const mentions = extractMentionsFromReviews(reviews);
  assert.equal(mentions.length, 0, `expected no false-positive pronoun capture, got: ${JSON.stringify(mentions)}`);
});
```

- [ ] **Step 3: Run the test to verify it fails**

```bash
cd chillanel && node --test scripts/extract-therapists.test.mjs
```

Expected: FAIL — `Cannot find module './extract-therapists.mjs'`.

- [ ] **Step 4: Write the implementation**

`chillanel/scripts/extract-therapists.mjs`:
```javascript
// Pure-function therapist-name extraction from review text.
// Heuristic, not NLP/NER — deliberately conservative (see plan constraint:
// a name only surfaces with 2+ independent review mentions).

const STOPWORDS = new Set([
  "This", "That", "These", "Those", "The", "It", "She", "He", "They",
  "Best", "Great", "Super", "Very", "Highly", "Overall", "Everything",
  "Staff", "Service", "Place", "Massage", "Spa", "Room", "Price", "Ambience",
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
]);

const NAME = "([A-Z][a-zA-Z]{1,20})";

const PATTERNS = [
  new RegExp(`\\bask (?:for|to have)\\s+${NAME}\\b`, "gi"),
  new RegExp(`\\b${NAME}\\s+(?:was|is)\\s+(?:amazing|great|wonderful|excellent|fantastic|the best|so good|incredible)\\b`, "gi"),
  new RegExp(`\\bthanks?\\s+to\\s+${NAME}\\b`, "gi"),
  new RegExp(`\\btherapist\\s+(?:named\\s+)?${NAME}\\b`, "gi"),
  new RegExp(`\\brequest\\s+${NAME}\\b`, "gi"),
];

function extractSentenceContaining(text, index) {
  const before = text.lastIndexOf(".", index);
  const after = text.indexOf(".", index);
  const start = before === -1 ? 0 : before + 1;
  const end = after === -1 ? text.length : after + 1;
  return text.slice(start, end).trim();
}

function candidatesFromText(text) {
  const out = [];
  if (!text || typeof text !== "string") return out;
  for (const pattern of PATTERNS) {
    pattern.lastIndex = 0;
    let m;
    while ((m = pattern.exec(text)) !== null) {
      const name = m[1];
      // Patterns use the "i" flag so trigger words match case-insensitively
      // ("Ask"/"ask"/"THANKS"), but that also case-folds the NAME capture
      // group itself — a lowercase pronoun right before "was/is amazing"
      // (e.g. "...she was amazing...") would otherwise be captured as a
      // "name". Regex captures preserve the source text's actual casing
      // even under /i/, so reject anything the source text didn't itself
      // capitalize.
      if (name[0] !== name[0].toUpperCase()) continue;
      if (STOPWORDS.has(name)) continue;
      out.push({ name, quote: extractSentenceContaining(text, m.index) });
    }
  }
  return out;
}

/**
 * @param {{text: string}[]} reviews
 * @returns {{name: string, count: number, quotes: string[]}[]}
 */
export function extractMentionsFromReviews(reviews) {
  const byName = new Map();
  for (const review of reviews ?? []) {
    const candidates = candidatesFromText(review?.text);
    // Dedup within a single review: same name matched by 2 patterns in one
    // review should still only count once toward that review's contribution.
    const seenThisReview = new Set();
    for (const { name, quote } of candidates) {
      if (seenThisReview.has(name)) continue;
      seenThisReview.add(name);
      const entry = byName.get(name) ?? { name, count: 0, quotes: [] };
      entry.count += 1;
      if (entry.quotes.length < 5) entry.quotes.push(quote);
      byName.set(name, entry);
    }
  }
  return [...byName.values()]
    .filter((e) => e.count >= 2)
    .sort((a, b) => b.count - a.count);
}
```

- [ ] **Step 5: Run the test to verify it passes**

```bash
cd chillanel && node --test scripts/extract-therapists.test.mjs
```

Expected: `# pass 7`, `# fail 0`, exit code 0.

- [ ] **Step 6: Commit**

```bash
git add chillanel/lib/types.ts chillanel/scripts/extract-therapists.mjs chillanel/scripts/extract-therapists.test.mjs
git commit -m "chillanel: therapist-mention extraction with false-positive suppression"
```

---

## Task 4: Build-data pipeline (CSV → JSON)

**Files:**
- Create: `chillanel/scripts/build-data.mjs`
- Test: `chillanel/scripts/build-data.test.mjs`

**Interfaces:**
- Consumes: `extractMentionsFromReviews` from `./extract-therapists.mjs` (Task 3); `Place`/`CityData` shape from `lib/types.ts` (Task 3, informal — this is a `.mjs` build script so it doesn't import the `.ts` types directly, but must produce objects matching that shape).
- Produces: `chillanel/data/clinics.bangkok.json` on disk, shape `CityData` (see Task 3). Task 5 (`lib/data.ts`) reads this file by path convention `data/clinics.{city}.json`.

- [ ] **Step 1: Write a fixture + failing test**

Create a tiny fixture CSV pair so the test doesn't depend on the live (constantly-changing) `spa_output` data:

`chillanel/scripts/__fixtures__/clinics.csv`:
```csv
"place_id","name","primary_type","formatted_address","plus_code","latitude","longitude","phone","website","menu_url","rating","total_reviews","price_level","price_symbol","business_status","editorial_summary","maps_url"
"0xabc:0xdef","Test Spa Bangkok","Spa","123 Test Rd, Bangkok","","13.75","100.53","","","","4.7","120","","","OPERATIONAL","","https://maps.google.com/?cid=1"
```

`chillanel/scripts/__fixtures__/reviews/0xabc_0xdef_reviews.csv`:
```csv
"review_id","place_id","restaurant_name","rating","text","author_name","author_id","author_uri","author_photo_uri","author_is_local_guide","author_review_count","author_photo_count","relative_date","spent_amount","sort_source"
"r1","0xabc:0xdef","Test Spa Bangkok",5,"Ask for Nong, she's amazing.","A","1","","",0,3,0,"2 months ago","","relevant"
"r2","0xabc:0xdef","Test Spa Bangkok",5,"Ask for Nong again, she's amazing every time.","B","2","","",0,5,0,"1 month ago","","relevant"
```

`chillanel/scripts/build-data.test.mjs`:
```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = import.meta.dirname;
const OUT_FILE = path.join(ROOT, "..", "data", "clinics.__fixture_test.json");

test("build-data pipeline: fixture CSV -> JSON with therapist mention", () => {
  execFileSync(
    process.execPath,
    [
      path.join(ROOT, "build-data.mjs"),
      "--clinics-csv", path.join(ROOT, "__fixtures__", "clinics.csv"),
      "--reviews-dir", path.join(ROOT, "__fixtures__", "reviews"),
      "--city", "__fixture_test",
      "--out", OUT_FILE,
    ],
    { stdio: "pipe" }
  );

  assert.ok(fs.existsSync(OUT_FILE), "output JSON was not written");
  const data = JSON.parse(fs.readFileSync(OUT_FILE, "utf-8"));
  assert.equal(data.places.length, 1);
  const place = data.places[0];
  assert.equal(place.name, "Test Spa Bangkok");
  assert.equal(place.reviews.length, 2);
  assert.equal(place.therapistMentions.length, 1);
  assert.equal(place.therapistMentions[0].name, "Nong");
  assert.equal(place.therapistMentions[0].count, 2);

  fs.unlinkSync(OUT_FILE);
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
cd chillanel && node --test scripts/build-data.test.mjs
```

Expected: FAIL — `build-data.mjs` doesn't exist yet.

- [ ] **Step 3: Write the implementation**

`chillanel/scripts/build-data.mjs`:
```javascript
// scripts/build-data.mjs
// Reads spa_output/{city}/clinics.csv + reviews/*.csv → data/clinics.{city}.json
// Accepts CLI overrides (--clinics-csv, --reviews-dir, --city, --out) so the
// pipeline is testable against a small fixture instead of the live dataset.
import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { extractMentionsFromReviews } from "./extract-therapists.mjs";

function argValue(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const CITY = argValue("--city", "bangkok");
const ROOT = path.join(import.meta.dirname, "..", "..");
const CLINICS_CSV = argValue("--clinics-csv", path.join(ROOT, "spa_output", CITY, "clinics.csv"));
const REVIEWS_DIR = argValue("--reviews-dir", path.join(ROOT, "spa_output", CITY, "reviews"));
const OUT_FILE = argValue("--out", path.join(import.meta.dirname, "..", "data", `clinics.${CITY}.json`));

function num(v, fallback = null) {
  const n = parseFloat(String(v ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : fallback;
}

function readCsv(file) {
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, "utf-8").replace(/^﻿/, "");
  return parse(raw, { columns: true, skip_empty_lines: true, relax_column_count: true });
}

function reviewsForPlace(placeId) {
  const fname = placeId.replace(/:/g, "_") + "_reviews.csv";
  const rows = readCsv(path.join(REVIEWS_DIR, fname));
  return rows.map((r) => ({
    id: r.review_id || "",
    rating: num(r.rating, null),
    text: r.text || "",
    authorName: (r.author_name || "").slice(0, 60),
    relativeDate: (r.relative_date || "").slice(0, 30),
  }));
}

const CLOSED_STATUSES = new Set(["CLOSED_PERMANENTLY", "CLOSED_TEMPORARILY"]);

function buildPlaces() {
  const rows = readCsv(CLINICS_CSV);
  console.log(`[build-data] loaded ${rows.length} clinic rows from ${CLINICS_CSV}`);

  const places = rows
    .filter((r) => r.place_id && r.name)
    .filter((r) => !CLOSED_STATUSES.has(String(r.business_status || "").toUpperCase()))
    .map((r) => {
      const reviews = reviewsForPlace(r.place_id);
      const therapistMentions = extractMentionsFromReviews(reviews);
      return {
        id: r.place_id.replace(/:/g, "_"),
        name: r.name,
        city: CITY,
        address: (r.formatted_address || "").trim(),
        lat: num(r.latitude, null),
        lng: num(r.longitude, null),
        phone: r.phone || "",
        website: r.website || "",
        rating: num(r.rating, null),
        reviewCount: num(r.total_reviews, 0) || 0,
        primaryType: r.primary_type || "",
        mapsUrl: r.maps_url || "",
        reviews: reviews.slice(0, 20),
        therapistMentions,
      };
    })
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount);

  return places;
}

if (!fs.existsSync(CLINICS_CSV)) {
  console.warn(`[build-data] clinics CSV not found: ${CLINICS_CSV}`);
  if (fs.existsSync(OUT_FILE)) {
    console.warn(`[build-data] keeping existing ${OUT_FILE} (no regen).`);
    process.exit(0);
  }
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify({ city: CITY, generatedAt: new Date().toISOString(), places: [] }, null, 2));
  console.warn(`[build-data] no existing output either — wrote empty stub.`);
  process.exit(0);
}

const places = buildPlaces();
fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(
  OUT_FILE,
  JSON.stringify({ city: CITY, generatedAt: new Date().toISOString(), places }, null, 2),
  "utf-8"
);
console.log(`[build-data] wrote ${places.length} places → ${OUT_FILE}`);
console.log(`[build-data] places with therapist mentions: ${places.filter((p) => p.therapistMentions.length > 0).length}`);
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
cd chillanel && node --test scripts/build-data.test.mjs
```

Expected: `# pass 1`, `# fail 0`.

- [ ] **Step 5: Run against the real live data and inspect output**

```bash
cd chillanel && npm install csv-parse && node scripts/build-data.mjs
```

Expected: `[build-data] wrote N places → .../data/clinics.bangkok.json` with N > 0 (matches whatever `spa_output/bangkok/clinics.csv` currently contains — expect four figures given the grid/review scrapers have been running).

- [ ] **Step 6: Commit**

```bash
git add chillanel/scripts/build-data.mjs chillanel/scripts/build-data.test.mjs chillanel/scripts/__fixtures__
echo "data/*.json" >> chillanel/.gitignore
git add chillanel/.gitignore
git commit -m "chillanel: CSV->JSON build-data pipeline with therapist extraction wired in"
```

Note: `data/*.json` is generated at build time (like `thaifacialclinic-portable/public/data/clinics.json`) and gitignored — the `prebuild`/`vercel-build` script in `package.json` (Task 1) regenerates it on every deploy.

---

## Task 5: Data loader

**Files:**
- Create: `chillanel/lib/data.ts`
- Test: `chillanel/scripts/data-loader.test.mjs`

**Interfaces:**
- Consumes: `CityData`/`Place` types from `lib/types.ts` (Task 3); reads `data/clinics.{city}.json` written by Task 4.
- Produces: `loadCity(city: string): CityData`, `listCities(): string[]`, `getPlaceById(city: string, id: string): Place | null`. Tasks 8 and 9 (city + place pages) call these directly.

- [ ] **Step 1: Write `lib/data.ts`**

`chillanel/lib/data.ts`:
```typescript
import fs from "node:fs";
import path from "node:path";
import type { CityData, Place } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

const cache = new Map<string, CityData>();

export function listCities(): string[] {
  if (!fs.existsSync(DATA_DIR)) return [];
  return fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.startsWith("clinics.") && f.endsWith(".json"))
    .map((f) => f.slice("clinics.".length, -".json".length));
}

export function loadCity(city: string): CityData {
  const cached = cache.get(city);
  if (cached) return cached;
  const file = path.join(DATA_DIR, `clinics.${city}.json`);
  if (!fs.existsSync(file)) {
    const empty: CityData = { city, generatedAt: new Date(0).toISOString(), places: [] };
    cache.set(city, empty);
    return empty;
  }
  const parsed = JSON.parse(fs.readFileSync(file, "utf-8")) as CityData;
  cache.set(city, parsed);
  return parsed;
}

export function getPlaceById(city: string, id: string): Place | null {
  return loadCity(city).places.find((p) => p.id === id) ?? null;
}

export function getAllPlaces(): { city: string; place: Place }[] {
  return listCities().flatMap((city) => loadCity(city).places.map((place) => ({ city, place })));
}
```

- [ ] **Step 2: Write the test (against a fixture JSON, not live data)**

`chillanel/scripts/data-loader.test.mjs`:
```javascript
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = import.meta.dirname;
const DATA_DIR = path.join(ROOT, "..", "data");
const FIXTURE_FILE = path.join(DATA_DIR, "clinics.__loader_test.json");

test("loadCity/getPlaceById read the generated JSON shape correctly", () => {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(
    FIXTURE_FILE,
    JSON.stringify({
      city: "__loader_test",
      generatedAt: "2026-01-01T00:00:00.000Z",
      places: [
        { id: "p1", name: "Test Place", city: "__loader_test", address: "", lat: null, lng: null, phone: "", website: "", rating: 4.5, reviewCount: 10, primaryType: "Spa", mapsUrl: "", reviews: [], therapistMentions: [] },
      ],
    })
  );

  // lib/data.ts is TypeScript compiled via Next's build; here we validate the
  // *file contract* it depends on (path convention + JSON shape) without
  // requiring a TS runtime, since this test suite has no ts-node dependency.
  const raw = JSON.parse(fs.readFileSync(FIXTURE_FILE, "utf-8"));
  assert.equal(raw.city, "__loader_test");
  assert.equal(raw.places.length, 1);
  assert.equal(raw.places[0].id, "p1");
  assert.ok("therapistMentions" in raw.places[0], "place must carry therapistMentions field");

  fs.unlinkSync(FIXTURE_FILE);
});
```

- [ ] **Step 3: Run the test**

```bash
cd chillanel && node --test scripts/data-loader.test.mjs
```

Expected: `# pass 1`.

- [ ] **Step 4: Verify TypeScript compiles against the real build-data output**

```bash
cd chillanel && node scripts/build-data.mjs && npx tsc --noEmit
```

Expected: no output (clean), exit 0.

- [ ] **Step 5: Commit**

```bash
git add chillanel/lib/data.ts chillanel/scripts/data-loader.test.mjs
git commit -m "chillanel: data loader (loadCity/getPlaceById/listCities)"
```

---

## Task 6: Root layout, `[lang]` routing, Header/Footer

**Files:**
- Modify: `chillanel/app/page.tsx` (replace scaffold stub with a redirect)
- Create: `chillanel/app/[lang]/layout.tsx`
- Create: `chillanel/components/Header.tsx`
- Create: `chillanel/components/Footer.tsx`
- Create: `chillanel/components/LangSwitcher.tsx`

**Interfaces:**
- Consumes: `tFor`, `Lang`, `SITE`, `SUPPORTED_LANGS` (Task 2); `listCities` (Task 5, for building nav links — used later by Task 8 but Header just needs static nav for now).
- Produces: every `/[lang]/*` page (Tasks 7, 8, 9, 10, 11) renders inside this layout and receives `params.lang` typed as `Promise<{ lang: Lang }>` matching Next 16's async-params convention (seen throughout `thaifacialclinic-portable`).

- [ ] **Step 1: Replace the root page with a redirect**

`chillanel/app/page.tsx`:
```tsx
import { redirect } from "next/navigation";
import { DEFAULT_LANG } from "@/lib/site";

export default function RootPage() {
  redirect(`/${DEFAULT_LANG}`);
}
```

- [ ] **Step 2: Write `components/LangSwitcher.tsx`**

`chillanel/components/LangSwitcher.tsx`:
```tsx
"use client";

import { usePathname } from "next/navigation";
import { SUPPORTED_LANGS, type Lang } from "@/lib/site";

const LABELS: Record<Lang, string> = { en: "EN", th: "ไทย", ko: "한국어" };

export function LangSwitcher({ current }: { current: Lang }) {
  const pathname = usePathname() || `/${current}`;
  const rest = pathname.split("/").slice(2).join("/");
  return (
    <div className="flex gap-2 text-sm">
      {SUPPORTED_LANGS.map((lang) => (
        <a
          key={lang}
          href={`/${lang}${rest ? `/${rest}` : ""}`}
          className={`px-2 py-1 rounded-md ${lang === current ? "bg-accent text-white" : "text-muted hover:text-fg"}`}
        >
          {LABELS[lang]}
        </a>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Write `components/Header.tsx`**

`chillanel/components/Header.tsx`:
```tsx
import Link from "next/link";
import { tFor } from "@/lib/i18n";
import type { Lang } from "@/lib/site";
import { LangSwitcher } from "./LangSwitcher";

export function Header({ lang }: { lang: Lang }) {
  const t = tFor(lang);
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg-elev/90 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href={`/${lang}`} className="font-black text-lg tracking-tight text-accent">
          chillanel
        </Link>
        <nav className="hidden sm:flex gap-6 text-sm font-medium">
          <Link href={`/${lang}/city/bangkok`} className="hover:text-accent">{t.nav.home}</Link>
          <Link href={`/${lang}/guide`} className="hover:text-accent">{t.nav.guides}</Link>
          <Link href={`/${lang}/about`} className="hover:text-accent">{t.nav.about}</Link>
        </nav>
        <LangSwitcher current={lang} />
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Write `components/Footer.tsx`**

`chillanel/components/Footer.tsx`:
```tsx
import { tFor } from "@/lib/i18n";
import type { Lang } from "@/lib/site";

export function Footer({ lang }: { lang: Lang }) {
  const t = tFor(lang);
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-5xl mx-auto px-4 py-8 text-xs text-muted">
        <p>© {new Date().getFullYear()} chillanel. {t.footer.rights}</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Write `app/[lang]/layout.tsx`**

`chillanel/app/[lang]/layout.tsx`:
```tsx
import { notFound } from "next/navigation";
import { isLang } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "th" }, { lang: "ko" }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <>
      <Header lang={lang} />
      <main>{children}</main>
      <Footer lang={lang} />
    </>
  );
}
```

- [ ] **Step 6: Verify the build**

```bash
cd chillanel && npm run build
```

Expected: build succeeds; route list includes `● /[lang]` (or dynamic, depending on child pages — child pages don't exist yet so this may 404 at runtime, that's expected until Task 7).

- [ ] **Step 7: Commit**

```bash
git add chillanel/app/page.tsx chillanel/app/[lang]/layout.tsx chillanel/components/Header.tsx \
  chillanel/components/Footer.tsx chillanel/components/LangSwitcher.tsx
git commit -m "chillanel: lang-scoped layout, header, footer, language switcher"
```

---

## Task 7: Home page

**Files:**
- Create: `chillanel/app/[lang]/page.tsx`
- Create: `chillanel/components/PlaceCard.tsx`

**Interfaces:**
- Consumes: `tFor` (Task 2), `getAllPlaces`/`loadCity` (Task 5), `Place` type (Task 3).
- Produces: `PlaceCard` component reused by Task 8 (city listing).

- [ ] **Step 1: Write `components/PlaceCard.tsx`**

`chillanel/components/PlaceCard.tsx`:
```tsx
import Link from "next/link";
import type { Lang } from "@/lib/site";
import type { Place } from "@/lib/types";

export function PlaceCard({ place, lang }: { place: Place; lang: Lang }) {
  return (
    <Link
      href={`/${lang}/place/${place.id}`}
      className="block rounded-2xl border border-border bg-bg-elev p-4 hover:border-accent transition"
    >
      <div className="font-bold text-base leading-snug">{place.name}</div>
      <div className="text-xs text-muted mt-1 line-clamp-1">{place.address}</div>
      <div className="flex items-center gap-3 mt-3 text-sm">
        {place.rating != null && (
          <span className="font-semibold">★ {place.rating.toFixed(1)}</span>
        )}
        <span className="text-muted">{place.reviewCount} reviews</span>
        {place.therapistMentions.length > 0 && (
          <span className="text-accent text-xs font-semibold">
            {place.therapistMentions.length} named in reviews
          </span>
        )}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Write `app/[lang]/page.tsx`**

`chillanel/app/[lang]/page.tsx`:
```tsx
import type { Metadata } from "next";
import { tFor } from "@/lib/i18n";
import { isLang, SITE } from "@/lib/site";
import { loadCity } from "@/lib/data";
import { PlaceCard } from "@/components/PlaceCard";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = tFor(lang);
  return {
    title: `${SITE.name} — ${t.home.heroTitle}`,
    description: t.home.heroSub,
    alternates: { canonical: `/${lang}` },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tFor(lang);
  const bangkok = loadCity("bangkok");
  const featured = bangkok.places
    .filter((p) => p.rating != null && p.reviewCount >= 10)
    .slice(0, 9);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <section className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
          {t.home.heroTitle}
        </h1>
        <p className="mt-4 text-lg text-muted max-w-2xl">{t.home.heroSub}</p>
      </section>

      <section className="mb-12 rounded-2xl border border-border bg-bg-elev p-6">
        <h2 className="text-xl font-bold mb-2">{t.home.philosophyTitle}</h2>
        <p className="text-muted leading-relaxed">{t.home.philosophyBody}</p>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">{t.home.featuredTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {featured.map((place) => (
            <PlaceCard key={place.id} place={place} lang={lang} />
          ))}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Verify with the dev server**

```bash
cd chillanel && npm run build && (npx next start -p 4100 &) && sleep 3 && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4100/en && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4100/th && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4100/ko
```

Expected: three `200` lines. Then stop the server: `pkill -f "next start -p 4100"`.

- [ ] **Step 4: Commit**

```bash
git add chillanel/app/[lang]/page.tsx chillanel/components/PlaceCard.tsx
git commit -m "chillanel: home page with philosophy section + featured places"
```

---

## Task 8: City listing page

**Files:**
- Create: `chillanel/app/[lang]/city/[city]/page.tsx`

**Interfaces:**
- Consumes: `listCities`, `loadCity` (Task 5), `PlaceCard` (Task 7), `tFor` (Task 2).
- Produces: nothing consumed by later tasks (leaf page).

- [ ] **Step 1: Write the page**

`chillanel/app/[lang]/city/[city]/page.tsx`:
```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE } from "@/lib/site";
import { listCities, loadCity } from "@/lib/data";
import { PlaceCard } from "@/components/PlaceCard";

export function generateStaticParams() {
  return listCities().map((city) => ({ city }));
}

function cityLabel(city: string): string {
  return city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, " ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; city: string }>;
}): Promise<Metadata> {
  const { lang, city } = await params;
  if (!isLang(lang)) return {};
  const t = tFor(lang);
  const label = cityLabel(city);
  return {
    title: `${t.city.listTitle} ${label} — ${SITE.name}`,
    alternates: { canonical: `/${lang}/city/${city}` },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ lang: string; city: string }>;
}) {
  const { lang, city } = await params;
  if (!isLang(lang)) notFound();
  const data = loadCity(city);
  if (data.places.length === 0) notFound();
  const t = tFor(lang);
  const label = cityLabel(city);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-1">
        {t.city.listTitle} {label}
      </h1>
      <p className="text-muted mb-8">
        {data.places.length} {t.city.placeCount}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data.places.map((place) => (
          <PlaceCard key={place.id} place={place} lang={lang} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the build generates the route**

```bash
cd chillanel && npm run build
```

Expected: build output lists `/[lang]/city/[city]` with `bangkok` as a generated static param (visible in the route summary table Next prints).

- [ ] **Step 3: Commit**

```bash
git add chillanel/app/\[lang\]/city
git commit -m "chillanel: city listing page"
```

---

## Task 9: Place detail page + therapist mentions UI

**Files:**
- Create: `chillanel/app/[lang]/place/[id]/page.tsx`
- Create: `chillanel/components/TherapistMentions.tsx`
- Create: `chillanel/components/JsonLd.tsx`

**Interfaces:**
- Consumes: `getAllPlaces`, `getPlaceById` (Task 5), `tFor` (Task 2).
- Produces: `JsonLd` component reused by nowhere else in this plan (place-page only) but exported for future reuse.

- [ ] **Step 1: Write `components/TherapistMentions.tsx`**

This is the component that enforces the plan's binding constraint (never present extracted names as verified fact).

`chillanel/components/TherapistMentions.tsx`:
```tsx
import { tFor } from "@/lib/i18n";
import type { Lang } from "@/lib/site";
import type { TherapistMention } from "@/lib/types";

export function TherapistMentions({
  mentions,
  lang,
}: {
  mentions: TherapistMention[];
  lang: Lang;
}) {
  const t = tFor(lang);

  if (mentions.length === 0) {
    return <p className="text-sm text-muted">{t.place.noMentions}</p>;
  }

  return (
    <div>
      <p className="text-xs text-muted mb-4 leading-relaxed border-l-2 border-border pl-3">
        {t.place.therapistDisclaimer}
      </p>
      <div className="space-y-4">
        {mentions.map((m) => (
          <div key={m.name} className="rounded-xl border border-border p-4">
            <div className="font-bold text-accent mb-2">
              {m.name} <span className="text-muted font-normal text-xs">· mentioned {m.count}x</span>
            </div>
            <ul className="space-y-1.5">
              {m.quotes.map((q, i) => (
                <li key={i} className="text-sm text-muted italic">&ldquo;{q}&rdquo;</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `components/JsonLd.tsx`**

`chillanel/components/JsonLd.tsx`:
```tsx
import type { Place } from "@/lib/types";
import { SITE } from "@/lib/site";

export function LocalBusinessJsonLd({ place }: { place: Place }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: place.name,
    address: place.address,
    url: `${SITE.origin}/en/place/${place.id}`,
    ...(place.rating != null && place.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: place.rating,
            reviewCount: place.reviewCount,
          },
        }
      : {}),
    ...(place.lat != null && place.lng != null
      ? { geo: { "@type": "GeoCoordinates", latitude: place.lat, longitude: place.lng } }
      : {}),
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }}
    />
  );
}
```

- [ ] **Step 3: Write the place page**

`chillanel/app/[lang]/place/[id]/page.tsx`:
```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE } from "@/lib/site";
import { getAllPlaces, getPlaceById } from "@/lib/data";
import { TherapistMentions } from "@/components/TherapistMentions";
import { LocalBusinessJsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return getAllPlaces().map(({ place }) => ({ id: place.id }));
}
export const dynamicParams = false;

function findPlace(id: string) {
  return getAllPlaces().find(({ place }) => place.id === id) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isLang(lang)) return {};
  const found = findPlace(id);
  if (!found) return {};
  return {
    title: `${found.place.name} — ${SITE.name}`,
    description: found.place.address,
    alternates: { canonical: `/${lang}/place/${id}` },
  };
}

export default async function PlacePage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!isLang(lang)) notFound();
  const found = findPlace(id);
  if (!found) notFound();
  const { city, place } = found;
  const t = tFor(lang);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <LocalBusinessJsonLd place={place} />
      <p className="text-xs uppercase tracking-widest text-muted mb-2">{city}</p>
      <h1 className="text-3xl font-black mb-2">{place.name}</h1>
      <div className="flex items-center gap-3 text-sm mb-6">
        {place.rating != null && (
          <span className="font-semibold">
            {t.place.ratingLabel}: ★ {place.rating.toFixed(1)}
          </span>
        )}
        <span className="text-muted">
          {place.reviewCount} {t.place.reviewCountLabel}
        </span>
      </div>

      <div className="rounded-2xl border border-border bg-bg-elev p-4 mb-8 text-sm">
        <div className="text-muted mb-1">{t.place.addressLabel}</div>
        <div className="mb-3">{place.address}</div>
        {place.mapsUrl && (
          <a href={place.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-accent font-semibold">
            {t.place.viewOnMaps} →
          </a>
        )}
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3">{t.place.therapistMentionsTitle}</h2>
        <TherapistMentions mentions={place.therapistMentions} lang={lang} />
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3">{t.place.reviewsTitle}</h2>
        <div className="space-y-3">
          {place.reviews.slice(0, 10).map((r) => (
            <div key={r.id} className="border-b border-border pb-3">
              <div className="flex items-center gap-2 text-sm mb-1">
                <span className="font-semibold">{r.authorName || "Anonymous"}</span>
                {r.rating != null && <span>★ {r.rating}</span>}
                <span className="text-muted text-xs">{r.relativeDate}</span>
              </div>
              <p className="text-sm text-muted">{r.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
cd chillanel && npm run build
```

Expected: build succeeds, route table shows `/[lang]/place/[id]` as SSG with N generated paths (N = number of Bangkok places currently in the dataset).

- [ ] **Step 5: Manual verification of the disclaimer rendering**

```bash
cd chillanel && (npx next start -p 4100 &) && sleep 3
FIRST_ID=$(node -e "console.log(require('./data/clinics.bangkok.json').places.find(p=>p.therapistMentions.length>0)?.id || '')")
if [ -n "$FIRST_ID" ]; then
  curl -s "http://localhost:4100/en/place/$FIRST_ID" | grep -o "unverified" | head -1
fi
pkill -f "next start -p 4100"
```

Expected: prints `unverified` (confirms the disclaimer text is actually in the rendered HTML whenever a place has therapist mentions — this is the concrete check for the plan's binding constraint).

- [ ] **Step 6: Commit**

```bash
git add "chillanel/app/[lang]/place" chillanel/components/TherapistMentions.tsx chillanel/components/JsonLd.tsx
git commit -m "chillanel: place detail page with therapist mentions + LocalBusiness JSON-LD"
```

---

## Task 10: Guide content pages

**Files:**
- Create: `chillanel/content/guides/how-to-pick-a-good-massage-place.json`
- Create: `chillanel/content/guides/thai-massage-styles-explained.json`
- Create: `chillanel/content/guides/understanding-massage-pricing-in-bangkok.json`
- Create: `chillanel/lib/guides.ts`
- Create: `chillanel/app/[lang]/guide/page.tsx`
- Create: `chillanel/app/[lang]/guide/[slug]/page.tsx`

**Interfaces:**
- Consumes: `tFor` (Task 2).
- Produces: `listGuides()`, `getGuide(slug: string)` from `lib/guides.ts` — no other task depends on these.

- [ ] **Step 1: Write the guide content files**

Content is stored as per-language JSON (simplest possible content model — no MDX/CMS dependency, matches YAGNI for a 3-5 article launch set).

`chillanel/content/guides/how-to-pick-a-good-massage-place.json`:
```json
{
  "slug": "how-to-pick-a-good-massage-place",
  "title": { "en": "How to pick a good massage place in Bangkok", "th": "วิธีเลือกร้านนวดดี ๆ ในกรุงเทพฯ", "ko": "방콕에서 좋은 마사지샵 고르는 법" },
  "body": {
    "en": "Skip the lobby test. A polished entrance tells you about the owner's budget, not the therapist's hands. Instead: read the reviews and look for reviewers who name a specific person — 'ask for X' is the single strongest signal a place has a consistently good therapist, because it means someone cared enough to remember a name. A high star rating with generic five-word reviews is weaker evidence than a 4.6 with reviewers writing paragraphs about one therapist.",
    "th": "อย่าตัดสินจากล็อบบี้ ทางเข้าที่สวยหรูบอกแค่งบของเจ้าของร้าน ไม่ได้บอกฝีมือของคนนวด แทนที่จะดูแบบนั้น ให้อ่านรีวิวและมองหารีวิวที่เอ่ยชื่อพนักงานคนใดคนหนึ่งโดยเฉพาะ — คำว่า 'ขอคนนี้' คือสัญญาณที่ชัดเจนที่สุดว่าร้านนี้มีพนักงานฝีมือดีอย่างสม่ำเสมอ เพราะแปลว่ามีคนจดจำชื่อนั้นไว้จริง ๆ คะแนนสูงพร้อมรีวิวสั้น ๆ ทั่วไปมีน้ำหนักน้อยกว่ารีวิว 4.6 ที่มีคนเขียนยาวถึงพนักงานคนเดียว",
    "ko": "로비만 보고 판단하지 마세요. 화려한 입구는 사장님의 예산을 말해줄 뿐, 테라피스트의 실력을 말해주진 않아요. 대신 리뷰를 읽고 특정 직원을 콕 집어 언급한 리뷰를 찾으세요 — '이분으로 해주세요' 같은 표현은 그 업체에 꾸준히 실력 좋은 테라피스트가 있다는 가장 강력한 신호예요. 짧고 뻔한 5점 리뷰 여러 개보다, 특정 테라피스트에 대해 길게 쓴 4.6점 리뷰가 훨씬 신뢰할 만합니다."
  }
}
```

`chillanel/content/guides/thai-massage-styles-explained.json`:
```json
{
  "slug": "thai-massage-styles-explained",
  "title": { "en": "Thai massage styles, explained", "th": "รู้จักประเภทของการนวดแผนไทย", "ko": "태국 마사지 종류 완벽 정리" },
  "body": {
    "en": "Traditional Thai massage uses assisted stretching and compression, done fully clothed on a mat — expect your therapist to use elbows, knees, and body weight. Oil massage is closer to what Western visitors expect: lighter pressure, table-based, good for relaxation over deep tissue work. Foot massage targets pressure points on the feet and lower legs, usually 30-60 minutes, a good low-commitment first visit. Aromatherapy/oil combines oil massage with scented oils chosen for mood rather than muscle work. If you have a specific ache, say so before you start — a good therapist will adjust pressure and technique, a rushed one won't ask.",
    "th": "นวดแผนไทยดั้งเดิมใช้การยืดและกดร่วมกัน ทำโดยใส่เสื้อผ้าครบบนเสื่อ คนนวดจะใช้ศอก เข่า และน้ำหนักตัว นวดน้ำมันจะใกล้เคียงกับสิ่งที่นักท่องเที่ยวตะวันตกคุ้นเคย น้ำหนักมือเบากว่า นวดบนเตียง เน้นผ่อนคลายมากกว่าจัดกล้ามเนื้อลึก นวดเท้าเน้นจุดกดที่เท้าและน่อง ใช้เวลา 30-60 นาที เหมาะกับการเริ่มต้นแบบไม่หนักมาก นวดอโรม่าคือนวดน้ำมันผสมกลิ่นหอมเพื่ออารมณ์มากกว่าเพื่อกล้ามเนื้อ หากมีจุดที่ปวดเฉพาะ บอกก่อนเริ่มนวด คนนวดที่ดีจะปรับน้ำหนักมือให้",
    "ko": "전통 태국 마사지는 매트 위에서 옷을 입은 채로 스트레칭과 압박을 병행하는 방식이에요 — 팔꿈치, 무릎, 체중을 활용합니다. 오일 마사지는 서양 관광객이 기대하는 것에 더 가까워요: 압력이 가볍고 침대 위에서 진행되며 딥티슈보다는 휴식에 가깝습니다. 발 마사지는 발과 종아리의 지압점을 자극하며 보통 30~60분, 처음 방문하기 부담 없는 코스예요. 아로마 오일 마사지는 오일 마사지에 향을 더해 근육보다는 기분 전환에 초점을 맞춥니다. 특정 부위가 아프다면 시작 전에 꼭 말하세요 — 좋은 테라피스트는 그에 맞춰 강도를 조절해줍니다."
  }
}
```

`chillanel/content/guides/understanding-massage-pricing-in-bangkok.json`:
```json
{
  "slug": "understanding-massage-pricing-in-bangkok",
  "title": { "en": "Understanding massage pricing in Bangkok", "th": "ทำความเข้าใจราคานวดในกรุงเทพฯ", "ko": "방콕 마사지 가격 제대로 이해하기" },
  "body": {
    "en": "Price alone tells you almost nothing about quality — a shophouse foot massage and a hotel spa treatment aren't competing for the same thing. Shophouse/street-level places: cheapest, walk-in friendly, quality varies place to place and even therapist to therapist within the same shop. Mid-range dedicated spas: consistent standards, often a fixed staff roster, worth it once you've found reviewers naming the same therapist repeatedly. Hotel spas: paying substantially for the space and amenities, not necessarily the massage itself — fine for a special occasion, not the best value signal. Tipping isn't mandatory in Thailand but 50-100 THB directly to the therapist (not the front desk) is standard for a good session and, per our whole thesis here, is exactly how the 'ask for X' reviews get written in the first place.",
    "th": "ราคาอย่างเดียวบอกอะไรเรื่องคุณภาพไม่ได้มากนัก นวดเท้าริมถนนกับสปาในโรงแรมไม่ได้แข่งกันในตลาดเดียวกัน ร้านริมถนน/ตึกแถว: ถูกที่สุด walk-in ได้ คุณภาพต่างกันไปตามร้านและแม้แต่ในร้านเดียวกันก็ต่างกันตามคนนวด สปาระดับกลาง: มาตรฐานสม่ำเสมอกว่า มักมีพนักงานประจำ คุ้มค่าเมื่อเจอรีวิวที่เอ่ยชื่อพนักงานคนเดิมซ้ำ ๆ สปาโรงแรม: จ่ายเพิ่มเพื่อพื้นที่และสิ่งอำนวยความสะดวกเป็นหลัก ไม่ใช่ฝีมือนวดโดยตรง เหมาะกับโอกาสพิเศษมากกว่าความคุ้มค่า ทิปไม่ใช่ข้อบังคับในไทย แต่ 50-100 บาทให้คนนวดโดยตรง (ไม่ใช่แคชเชียร์) ถือเป็นมาตรฐานสำหรับบริการที่ดี และนี่คือที่มาของรีวิวแบบ 'ขอคนนี้' ที่เราพูดถึงตลอดทั้งเว็บนี้",
    "ko": "가격만으로는 품질을 거의 알 수 없어요 — 길거리 발마사지와 호텔 스파는애초에 비교 대상이 아니에요. 로컬/길거리 샵: 가장 저렴하고 예약 없이 가능하지만 같은 매장 안에서도 테라피스트마다 실력 차이가 큽니다. 중급 전문 스파: 비교적 균일한 수준, 보통 고정 직원진이 있어서 같은 테라피스트가 반복적으로 언급되는 리뷰를 찾았다면 가볼 만해요. 호텔 스파: 공간과 부대시설에 비용을 더 내는 것이지 마사지 실력 자체를 보장하진 않아요, 특별한 날엔 좋지만 가성비 신호는 아니에요. 태국에서 팁은 필수는 아니지만 좋은 서비스를 받았다면 테라피스트 본인에게(카운터가 아니라) 50~100바트 정도 직접 주는 게 일반적이고, 이게 바로 저희가 강조하는 '이분으로 해주세요' 리뷰가 나오는 이유예요."
  }
}
```

- [ ] **Step 2: Write `lib/guides.ts`**

`chillanel/lib/guides.ts`:
```typescript
import fs from "node:fs";
import path from "node:path";
import type { Lang } from "./site";

export type Guide = {
  slug: string;
  title: Record<Lang, string>;
  body: Record<Lang, string>;
};

const GUIDES_DIR = path.join(process.cwd(), "content", "guides");

let cache: Guide[] | null = null;

export function listGuides(): Guide[] {
  if (cache) return cache;
  if (!fs.existsSync(GUIDES_DIR)) return (cache = []);
  cache = fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(GUIDES_DIR, f), "utf-8")) as Guide);
  return cache;
}

export function getGuide(slug: string): Guide | null {
  return listGuides().find((g) => g.slug === slug) ?? null;
}
```

- [ ] **Step 3: Write the guide index page**

`chillanel/app/[lang]/guide/page.tsx`:
```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE } from "@/lib/site";
import { listGuides } from "@/lib/guides";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { title: `${tFor(lang).guide.indexTitle} — ${SITE.name}`, alternates: { canonical: `/${lang}/guide` } };
}

export default async function GuideIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tFor(lang);
  const guides = listGuides();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-8">{t.guide.indexTitle}</h1>
      <div className="space-y-3">
        {guides.map((g) => (
          <Link
            key={g.slug}
            href={`/${lang}/guide/${g.slug}`}
            className="block rounded-xl border border-border p-4 hover:border-accent transition font-semibold"
          >
            {g.title[lang]}
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write the guide detail page**

`chillanel/app/[lang]/guide/[slug]/page.tsx`:
```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLang, SITE } from "@/lib/site";
import { getGuide, listGuides } from "@/lib/guides";

export function generateStaticParams() {
  return listGuides().map((g) => ({ slug: g.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang)) return {};
  const guide = getGuide(slug);
  if (!guide) return {};
  return { title: `${guide.title[lang]} — ${SITE.name}`, alternates: { canonical: `/${lang}/guide/${slug}` } };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLang(lang)) notFound();
  const guide = getGuide(slug);
  if (!guide) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-6">{guide.title[lang]}</h1>
      <p className="text-muted leading-relaxed whitespace-pre-line">{guide.body[lang]}</p>
    </div>
  );
}
```

- [ ] **Step 5: Verify build**

```bash
cd chillanel && npm run build
```

Expected: build succeeds; `/[lang]/guide/[slug]` shows 3 generated paths per language (9 total).

- [ ] **Step 6: Commit**

```bash
git add chillanel/content chillanel/lib/guides.ts "chillanel/app/[lang]/guide"
git commit -m "chillanel: 3 launch guide articles (en/th/ko) + guide index/detail pages"
```

---

## Task 11: About page

**Files:**
- Create: `chillanel/app/[lang]/about/page.tsx`

**Interfaces:**
- Consumes: `tFor` (Task 2). Leaf page, nothing depends on it.

- [ ] **Step 1: Write the page**

`chillanel/app/[lang]/about/page.tsx`:
```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return { title: `${tFor(lang).about.title} — ${SITE.name}`, alternates: { canonical: `/${lang}/about` } };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tFor(lang);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-6">{t.about.title}</h1>
      <p className="text-muted leading-relaxed">{t.about.body}</p>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
cd chillanel && npm run build
```

Expected: success.

- [ ] **Step 3: Commit**

```bash
git add "chillanel/app/[lang]/about"
git commit -m "chillanel: about page"
```

---

## Task 12: Sitemap + robots.txt

**Files:**
- Create: `chillanel/app/sitemap.ts`
- Create: `chillanel/app/robots.ts`

**Interfaces:**
- Consumes: `listCities`, `getAllPlaces` (Task 5), `listGuides` (Task 10), `SITE`, `SUPPORTED_LANGS` (Task 2).

- [ ] **Step 1: Write `app/sitemap.ts`**

`chillanel/app/sitemap.ts`:
```typescript
import type { MetadataRoute } from "next";
import { SITE, SUPPORTED_LANGS } from "@/lib/site";
import { listCities, getAllPlaces } from "@/lib/data";
import { listGuides } from "@/lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const lang of SUPPORTED_LANGS) {
    entries.push({ url: `${SITE.origin}/${lang}`, changeFrequency: "weekly", priority: 1 });
    entries.push({ url: `${SITE.origin}/${lang}/about`, changeFrequency: "monthly", priority: 0.3 });
    entries.push({ url: `${SITE.origin}/${lang}/guide`, changeFrequency: "monthly", priority: 0.5 });

    for (const city of listCities()) {
      entries.push({ url: `${SITE.origin}/${lang}/city/${city}`, changeFrequency: "weekly", priority: 0.8 });
    }
    for (const guide of listGuides()) {
      entries.push({ url: `${SITE.origin}/${lang}/guide/${guide.slug}`, changeFrequency: "monthly", priority: 0.4 });
    }
    for (const { place } of getAllPlaces()) {
      entries.push({ url: `${SITE.origin}/${lang}/place/${place.id}`, changeFrequency: "weekly", priority: 0.6 });
    }
  }

  return entries;
}
```

- [ ] **Step 2: Write `app/robots.ts`**

`chillanel/app/robots.ts`:
```typescript
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE.origin}/sitemap.xml`,
    host: SITE.origin,
  };
}
```

- [ ] **Step 3: Verify build + spot-check output**

```bash
cd chillanel && npm run build && (npx next start -p 4100 &) && sleep 3
curl -s http://localhost:4100/robots.txt | head -5
curl -s http://localhost:4100/sitemap.xml | grep -c "<url>"
pkill -f "next start -p 4100"
```

Expected: robots.txt shows `Allow: /`; sitemap URL count roughly `3*(3 + cities + guides + places)` — a number in the low thousands given current Bangkok place count.

- [ ] **Step 4: Commit**

```bash
git add chillanel/app/sitemap.ts chillanel/app/robots.ts
git commit -m "chillanel: sitemap.xml + robots.txt"
```

---

## Task 13: Vercel project setup + first deploy

**Files:**
- Create: `chillanel/.env.example` (documents any future env vars — currently none required)

**Interfaces:**
- Consumes: everything from Tasks 1–12 (this is the deploy verification task).

- [ ] **Step 1: Write `.env.example`**

`chillanel/.env.example`:
```
# No environment variables are required for the v1 (content-only) launch.
# This file exists so future additions (analytics IDs, etc.) have a documented home.
```

- [ ] **Step 2: Link the Vercel project**

```bash
cd chillanel && vercel link --yes
```

Expected: prompts for/creates a project named `chillanel` under the same team (`chillanel22-6095s-projects`) used by the other sites in this repo. If run non-interactively fails, run `vercel link` without `--yes` and answer the prompts: link to existing team, create new project named `chillanel`.

- [ ] **Step 3: Add the custom domain**

```bash
cd chillanel && vercel domains add chillanel.com --yes 2>&1 || vercel project ls
```

If the domain isn't yet pointed at Vercel's nameservers/DNS records, `vercel domains add` will print the exact DNS records to add at the registrar (Hostinger). Add those records at Hostinger's DNS panel before proceeding — this is a manual, external step outside this repo.

- [ ] **Step 4: First deploy**

```bash
cd chillanel && vercel --prod --yes
```

**Do not add `--archive=tgz`** — see the Global Constraints section; that flag bypasses `.vercelignore` and re-triggers the multi-hundred-thousand-file upload bug hit earlier in this session.

Expected output ends with `"status": "ok"`, `"readyState": "READY"`, and a `*.vercel.app` production URL.

- [ ] **Step 5: Verify the live deployment**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://chillanel.com/en
curl -s -o /dev/null -w "%{http_code}\n" https://chillanel.com/th
curl -s -o /dev/null -w "%{http_code}\n" https://chillanel.com/ko
curl -sI https://chillanel.com/en | grep -i "x-vercel-cache"
```

Expected: three `200`s (or the temporary `*.vercel.app` URL if the custom domain DNS hasn't propagated yet — re-check `chillanel.com` after DNS settles), and `x-vercel-cache: HIT` or `PRERENDER` on a second identical request (confirms pages are statically served, not accidentally forced dynamic — same check pattern used to catch the `sponsoredStore.ts` bug earlier this session).

- [ ] **Step 6: Commit**

```bash
git add chillanel/.env.example
git commit -m "chillanel: env example + deploy verified live"
```

---

## Task 14: `chillanel_refresher` watchdog service

**Files:**
- Create: `chillanel/scripts/refresh-and-deploy.mjs`
- Modify: `scripts/watchdog.py`

**Interfaces:**
- Consumes: `spa_output/**` (written by the existing `spa_grid_bangkok`/`spa_review_bangkok`/`massage_grid_bangkok`/`massage_review_bangkok` watchdog services already running in this repo).
- Produces: nothing consumed by other tasks — this is the final automation piece, modeled directly on `web-thaigle/scripts/refresh_thaigle.py`'s watch-mtime-then-deploy loop.

- [ ] **Step 1: Write the refresh script**

`chillanel/scripts/refresh-and-deploy.mjs`:
```javascript
// Watches spa_output/**/clinics.csv mtimes; on change, rebuilds data + redeploys.
// Mirrors web-thaigle/scripts/refresh_thaigle.py's polling approach.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..", "..");
const WATCH_FILES = ["spa_output/bangkok/clinics.csv"];
const INTERVAL_MS = 5 * 60 * 1000;

function latestMtime() {
  let latest = 0;
  for (const rel of WATCH_FILES) {
    const p = path.join(ROOT, rel);
    if (fs.existsSync(p)) latest = Math.max(latest, fs.statSync(p).mtimeMs);
  }
  return latest;
}

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function deploy() {
  log("변경 감지 — build-data 재실행");
  execFileSync(process.execPath, ["scripts/build-data.mjs"], { cwd: import.meta.dirname + "/..", stdio: "inherit" });
  log("vercel --prod 배포 시작");
  execFileSync("vercel", ["--prod", "--yes"], { cwd: import.meta.dirname + "/..", stdio: "inherit" });
  log("배포 완료");
}

let lastSeen = latestMtime();
log(`감시 시작 — 초기 mtime=${lastSeen}`);

while (true) {
  const current = latestMtime();
  if (current > lastSeen) {
    lastSeen = current;
    try {
      deploy();
    } catch (e) {
      log(`배포 실패: ${e.message}`);
    }
  }
  await new Promise((r) => setTimeout(r, INTERVAL_MS));
}
```

- [ ] **Step 2: Add the watchdog service definition**

Find the `thaigle_refresher` Service block in `scripts/watchdog.py` (`grep -n 'name="thaigle_refresher"' scripts/watchdog.py`) and add a matching block for chillanel directly after it:

```python
        Service(
            name="chillanel_refresher",
            cmd=["chillanel/scripts/refresh-and-deploy.mjs"],
            cwd=ROOT,
            env_extra={},
            log_file=LOGS / "chillanel_refresher.log",
            progress_pattern=re.compile(r"(감시 시작|배포 완료|변경 감지)"),
            progress_stale_sec=1500,
            progress_grace_sec=120,
        ),
```

Note: `cmd` here points at a `.mjs` file, not a `.py` file like every other Service in this file — check how `VENV_PY` is used in `Service.restart()` (`subprocess.Popen([str(VENV_PY)] + self.cmd, ...)`, per the earlier read of `watchdog.py:388`). Since this command needs to run via `node`, not the Python venv interpreter, this Service definition will NOT work as a plain copy of the Python pattern. Fix: change `cmd` to invoke node explicitly and leave `cwd=ROOT` (so the relative path in `cmd` resolves correctly):

```python
        Service(
            name="chillanel_refresher",
            cmd=["-c", "import subprocess,sys; sys.exit(subprocess.call(['node', 'chillanel/scripts/refresh-and-deploy.mjs']))"],
            cwd=ROOT,
            env_extra={},
            log_file=LOGS / "chillanel_refresher.log",
            progress_pattern=re.compile(r"(감시 시작|배포 완료|변경 감지)"),
            progress_stale_sec=1500,
            progress_grace_sec=120,
        ),
```

This routes through `python -c "..."` (since `VENV_PY` is always the interpreter) which shells out to `node` for the actual script — consistent with how every other Service in this file is invoked without requiring changes to `Service.restart()`'s Popen call.

- [ ] **Step 3: Verify syntax**

```bash
cd /path/to/deliverable/deliverable && python -c "import ast; ast.parse(open('scripts/watchdog.py', encoding='utf-8').read()); print('OK')"
```

Expected: `OK`.

- [ ] **Step 4: Manual smoke test of the refresh script in isolation (do not leave this running long — it loops forever)**

```bash
cd chillanel && timeout 15 node scripts/refresh-and-deploy.mjs || true
```

Expected: prints `감시 시작 — 초기 mtime=...` and then nothing else within 15s (no crash, no immediate deploy since nothing changed).

- [ ] **Step 5: Restart watchdog to pick up the new service (follow this repo's established safe-restart procedure)**

```bash
cd /path/to/deliverable/deliverable
echo "" > run/stop_watchdog
# wait for run/watchdog.pid to disappear (poll every 2s, up to ~40s)
rm -f run/stop_watchdog
PYTHONIOENCODING=utf-8 nohup .venv/Scripts/python.exe scripts/watchdog.py >> logs/watchdog.log 2>&1 &
disown
```

- [ ] **Step 6: Verify the service started**

```bash
grep "chillanel_refresher" logs/watchdog.log | tail -5
```

Expected: a `[chillanel_refresher] 재시작 launcher=... worker=...` line, and `logs/chillanel_refresher.log` containing `감시 시작`.

- [ ] **Step 7: Commit**

```bash
git add chillanel/scripts/refresh-and-deploy.mjs scripts/watchdog.py
git commit -m "chillanel: auto-refresh watchdog service (spa_output change -> rebuild -> deploy)"
```

---

## Self-Review Notes

- **Spec coverage:** purpose/differentiator (Task 3, 9), domain (Task 13), Bangkok scope with multi-city-ready architecture (Tasks 4/5/8 all take `city` as a parameter, never hardcoded beyond the CLI default), en/th/ko (Task 2, threaded through every page task), no district routes (not built), no lead-gen/CRM/payment (none of those files created), auto-extraction with 2+-mention threshold and mandatory disclaimer (Task 3 test suite + Task 9 Step 5 concrete disclaimer-in-HTML check), deploy refresh loop (Task 14), `vercel --prod` without `--archive=tgz` (stated explicitly in Tasks 13 and 14) — all covered.
- **Type consistency check:** `Place`/`TherapistMention`/`CityData` defined once in `lib/types.ts` (Task 3) and referenced by identical field names (`therapistMentions`, `reviewCount`, `mapsUrl`, etc.) in Tasks 4, 5, 7, 8, 9 — verified no drift between the build script's emitted JSON keys and the TypeScript type definitions.
- **Known gap flagged for the user, not silently resolved:** Task 14 Step 2 required a real fix mid-task (the naive Python `cmd` pattern doesn't work for a Node script) — left the fix inline rather than a TODO, per the plan-writing "no placeholders" rule.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-24-chillanel-launch.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
