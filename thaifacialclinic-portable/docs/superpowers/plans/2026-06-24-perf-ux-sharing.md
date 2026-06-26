# thaifacialclinic.com — Performance / UX / Sharing Sprint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix render-blocking fonts, enable Next.js image optimization, fix mobile nav routing bugs, fix Fuse search dedup, and polish mobile UX — all within the thaifacialclinic-portable Next.js app.

**Architecture:** Targeted edits to existing files only (except one new route). No new dependencies. All changes are independently testable via `npm run build` and visual inspection in `npm run dev`.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v3, Fuse.js, next/font/google, next/image

## Global Constraints

- Working directory: `thaifacialclinic-portable/` — all paths below are relative to it
- Run `npm run build` after each task to catch TypeScript/build errors before committing
- Do NOT change `output: "export"` (already removed — site is dynamic)
- Do NOT add new npm packages (everything needed is already installed)
- Preserve all i18n (`lang` prop) behavior; do not hardcode English strings
- `trailingSlash: true` is set in next.config.mjs — all hrefs must end with `/`

---

### Task 1: Font Optimization (next/font/google)

**Problem:** `globals.css` has `@import url('https://fonts.googleapis.com/...')` which is render-blocking — browser stalls HTML parsing to download fonts from Google's server before rendering anything. This adds ~200-400ms to FCP.

**Fix:** Replace with `next/font/google` which inlines font CSS and self-hosts font files on Vercel's CDN.

**Files:**
- Modify: `app/globals.css` — remove @import line
- Modify: `app/layout.tsx` — add next/font/google, inject CSS variables
- Modify: `tailwind.config.ts` — use CSS variable references for font families
- Modify: `app/globals.css` — update font-family rules to use CSS vars

**Interfaces:**
- Produces: CSS variables `--font-fraunces` and `--font-jakarta` available globally

- [ ] **Step 1: Remove render-blocking @import from globals.css**

Open `app/globals.css`. Delete line 1 (the `@import url('https://fonts.googleapis.com/...')` line). The file should now start with `@tailwind base;`. Also update the `font-family` rules in the `body` and `h1,h2,h3` selectors to use CSS variables:

```css
/* app/globals.css — top of file, REMOVE this line: */
/* @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'); */

@tailwind base;
@tailwind components;
@tailwind utilities;
```

Then find the `body` selector and update:
```css
body {
  background: rgb(var(--bg));
  color: rgb(var(--fg));
  font-family: var(--font-jakarta), ui-sans-serif, system-ui, "Noto Sans KR", "Noto Sans Thai", sans-serif;
  @apply antialiased;
  font-feature-settings: "cv02", "cv03", "cv04", "cv11", "ss01";
  letter-spacing: -0.01em;
}

h1, h2, h3, .font-display {
  font-family: var(--font-fraunces), ui-serif, Georgia, serif;
  font-feature-settings: "ss01", "ss03";
}
```

- [ ] **Step 2: Add next/font/google to layout.tsx**

Open `app/layout.tsx`. Add font imports at the top and apply variables to `<html>`:

```tsx
import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/i18n";
import { CompareProvider } from "@/components/CompareContext";
// ... rest of imports unchanged

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
  weight: ["400", "500", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});
```

Then update the `<html>` tag in the return:
```tsx
<html lang="en" className={`${fraunces.variable} ${plusJakarta.variable}`}>
```

- [ ] **Step 3: Update tailwind.config.ts to use CSS variables**

Open `tailwind.config.ts`. Find `fontFamily` in `theme.extend` and update:

```ts
fontFamily: {
  display: ["var(--font-fraunces)", "ui-serif", "Georgia", "serif"],
  sans: ["var(--font-jakarta)", "Inter", "ui-sans-serif", "system-ui", "Noto Sans KR", "Noto Sans Thai", "sans-serif"],
  mono: ["JetBrains Mono", "ui-monospace", "monospace"],
},
```

- [ ] **Step 4: Verify build passes**

```bash
npm run build
```

Expected: Build completes with no errors. If you see "Module not found: Can't resolve 'next/font/google'", check that next version is ≥13 (`package.json` shows `"next": "^16.2.4"` so this is fine).

- [ ] **Step 5: Visual check in dev**

```bash
npm run dev
```

Open `http://localhost:3000/en/` in browser. Open DevTools → Network → filter by "Font". You should see fonts loading from `/_next/static/media/` (self-hosted) instead of `fonts.gstatic.com`. The page should render with the same Fraunces display font and Plus Jakarta Sans body font.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css app/layout.tsx tailwind.config.ts
git commit -m "perf: replace render-blocking Google Fonts @import with next/font/google"
```

---

### Task 2: Image Optimization — Config

**Problem:** `next.config.mjs` has `images: { unoptimized: true }` which was needed during the static-export era. The site is now dynamic (no `output: "export"`), so Next.js can optimize images. Without this, every image is served at full original size — a clinic photo from Google Maps can be 800KB+ when only 200KB is needed.

**Files:**
- Modify: `next.config.mjs` — remove `unoptimized: true`, add `remotePatterns`, add `formats`

**Interfaces:**
- Produces: `next/image` optimization pipeline active for all configured remote domains

- [ ] **Step 1: Update next.config.mjs**

Replace the entire file with:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Google Maps / Places photos
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "lh4.googleusercontent.com" },
      { protocol: "https", hostname: "lh5.googleusercontent.com" },
      { protocol: "https", hostname: "lh6.googleusercontent.com" },
      { protocol: "https", hostname: "maps.googleapis.com" },
      // Bookimed CDN
      { protocol: "https", hostname: "cdn.bookimed.com" },
      { protocol: "https", hostname: "bookimed.com" },
      // Allow any subdomain of googleusercontent as fallback
      { protocol: "https", hostname: "**.googleusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  trailingSlash: true,
  typedRoutes: false,
  async headers() {
    return [
      {
        // Long-lived cache for all static assets in /public
        source: "/:path*\\.(ico|svg|png|jpg|jpeg|webp|avif|woff|woff2|ttf|otf|gif|mp4|webm)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: Build succeeds. If you see "hostname not configured" errors in the build output, add the missing hostname to `remotePatterns`.

- [ ] **Step 3: Commit**

```bash
git add next.config.mjs
git commit -m "perf: enable next/image optimization with remotePatterns + cache headers"
```

---

### Task 3: Image Optimization — Replace \<img\> with \<Image\>

**Problem:** Even with image optimization enabled, it only applies to `next/image` (`<Image>`) components — not raw `<img>` tags. The three most impactful components for LCP (Largest Contentful Paint) all use raw `<img>`:
- `Hero.tsx` — above-the-fold clinic photos (critical LCP)
- `ClinicCard.tsx` — grid thumbnails (most-seen images on homepage)
- `app/[lang]/clinic/[slug]/page.tsx` — clinic hero (critical LCP on detail page)

**Files:**
- Modify: `components/Hero.tsx` — replace `<img>` with `<Image>` in photo collage + mobile strip
- Modify: `components/ClinicCard.tsx` — replace `<img>` with `<Image>` in card thumbnail
- Modify: `app/[lang]/clinic/[slug]/page.tsx` — replace `<img>` with `<Image>` in clinic hero

**Interfaces:**
- Consumes: `remotePatterns` from Task 2 (must be done first)

- [ ] **Step 1: Fix Hero.tsx — desktop collage images**

Open `components/Hero.tsx`. Add import at top:
```tsx
import Image from "next/image";
```

Replace the three `<img>` tags in the `{/* Right: photo collage + trust ring */}` block. Find each one and replace:

```tsx
{/* Replace photos[0] <img>: */}
{photos[0] && (
  <Image
    src={photos[0].top_photo_url || ""}
    alt={photos[0].name}
    width={600}
    height={480}
    className="absolute right-4 top-0 h-[60%] w-[70%] rounded-2xl object-cover shadow-premium-lg ring-1 ring-white/10"
    referrerPolicy="no-referrer"
    loading="eager"
    priority
  />
)}

{/* Replace photos[1] <img>: */}
{photos[1] && (
  <Image
    src={photos[1].top_photo_url || ""}
    alt={photos[1].name}
    width={400}
    height={360}
    className="absolute left-0 top-[35%] h-[45%] w-[55%] rounded-2xl object-cover shadow-premium-lg ring-1 ring-white/10 animate-float"
    style={{ animationDelay: "-2s" }}
    referrerPolicy="no-referrer"
    loading="eager"
  />
)}

{/* Replace photos[2] <img>: */}
{photos[2] && (
  <Image
    src={photos[2].top_photo_url || ""}
    alt={photos[2].name}
    width={320}
    height={240}
    className="absolute bottom-0 right-0 h-[30%] w-[40%] rounded-2xl object-cover shadow-premium ring-1 ring-white/10"
    referrerPolicy="no-referrer"
    loading="lazy"
  />
)}
```

- [ ] **Step 2: Fix Hero.tsx — mobile photo strip**

Find the mobile strip block (`{/* Mobile photo strip */}`). Replace each `<img>` inside the `.map()`:

```tsx
{/* Mobile photo strip */}
<div className="-mx-2 flex gap-2 overflow-x-auto pb-2 lg:hidden">
  {photos.map((p, i) => p.top_photo_url && (
    <Image
      key={i}
      src={p.top_photo_url}
      alt={p.name}
      width={128}
      height={96}
      loading="lazy"
      referrerPolicy="no-referrer"
      className="h-24 w-32 shrink-0 rounded-xl object-cover ring-1 ring-white/10"
    />
  ))}
</div>
```

Also remove the `// eslint-disable-next-line @next/next/no-img-element` comments (they're no longer needed).

- [ ] **Step 3: Fix ClinicCard.tsx**

Open `components/ClinicCard.tsx`. Add import at top:
```tsx
import Image from "next/image";
```

Find the `<img>` inside the `{c.top_photo_url ? ( ... )}` block (inside the `<Link>` with `className="relative block aspect-[16/10] w-full overflow-hidden bg-navy-900"`). The parent already has `position: relative` from the `relative` class, so `fill` works:

```tsx
{c.top_photo_url ? (
  <Image
    src={c.top_photo_url}
    alt={c.name}
    fill
    loading="lazy"
    referrerPolicy="no-referrer"
    className="object-cover transition-transform duration-500 group-hover:scale-105"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
) : (
  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-navy-800 to-navy-950">
    {/* SVG unchanged */}
  </div>
)}
```

Remove the `// eslint-disable-next-line @next/next/no-img-element` comment.

- [ ] **Step 4: Fix clinic/[slug]/page.tsx hero image**

Open `app/[lang]/clinic/[slug]/page.tsx`. Add import near top:
```tsx
import Image from "next/image";
```

Find the clinic hero image block (around line 137-145):
```tsx
{/* Big photo with overlay */}
<div className="relative aspect-[21/9] w-full bg-navy-900">
  {c.top_photo_url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={c.top_photo_url}
      alt={c.name}
      className="h-full w-full object-cover"
      loading="eager"
      referrerPolicy="no-referrer"
    />
  ) : (
    <div className="h-full w-full bg-gradient-to-br from-navy-800 to-navy-950" />
  )}
```

Replace with:
```tsx
{/* Big photo with overlay */}
<div className="relative aspect-[21/9] w-full bg-navy-900">
  {c.top_photo_url ? (
    <Image
      src={c.top_photo_url}
      alt={c.name}
      fill
      className="object-cover"
      loading="eager"
      priority
      referrerPolicy="no-referrer"
      sizes="100vw"
    />
  ) : (
    <div className="h-full w-full bg-gradient-to-br from-navy-800 to-navy-950" />
  )}
```

- [ ] **Step 5: Build check**

```bash
npm run build
```

Expected: Build succeeds. If you see `Error: Invalid src prop` for any image, add the hostname to `remotePatterns` in `next.config.mjs`. Common missing domains: `maps.googleapis.com`, `streetviewpixels-pa.googleapis.com`.

- [ ] **Step 6: Visual check**

```bash
npm run dev
```

Open `http://localhost:3000/en/` — clinic card photos should load. Open DevTools → Network → filter by "Img". You should see requests to `/_next/image?url=...&w=...&q=75` instead of direct external URLs. This confirms optimization is active.

- [ ] **Step 7: Commit**

```bash
git add components/Hero.tsx components/ClinicCard.tsx "app/[lang]/clinic/[slug]/page.tsx"
git commit -m "perf: replace <img> with next/image in Hero, ClinicCard, clinic detail hero"
```

---

### Task 4: Bug Fixes (Batch)

**Four bugs fixed in one commit:**

1. **DirectoryClient Fuse rebuild** — `poolFuse` is recreated inside `filtered` useMemo every time query or sort changes, even though pool hasn't changed. Fix: separate pool and poolFuse into their own memos.

2. **MobileBottomNav `<a>` tags** — uses `<a href>` which triggers full-page reloads. Fix: use `<Link>` from next/link.

3. **MobileBottomNav active state** — tab hrefs are `/`, `/c`, `/saved`, `/compare` but actual pathnames are `/en/`, `/en/c/fue/`, etc. Active highlight never triggers. Fix: extract lang prefix from pathname.

4. **ShareToFriend text** — "verified across 5+ public sources" should say "6 independent sources".

**Files:**
- Modify: `components/DirectoryClient.tsx`
- Modify: `components/MobileBottomNav.tsx`
- Modify: `components/ShareToFriend.tsx`

- [ ] **Step 1: Fix DirectoryClient.tsx — extract pool and poolFuse into separate memos**

Open `components/DirectoryClient.tsx`. After the existing `fuse` memo (line 31: `const fuse = useMemo(() => fuseIndex(clinics), [clinics]);`), add two new memos:

```tsx
// Filtered pool (city/proc/viral filters only — no search, no sort)
const pool = useMemo(() => clinics.filter((c) => {
  if (filterViral && c.is_suspected_viral) return false;
  if (procFilter && !c.procedures.includes(procFilter)) return false;
  if (cityFilter && c.city !== cityFilter) return false;
  return true;
}), [clinics, filterViral, procFilter, cityFilter]);

// Fuse index on pool — rebuilds only when pool changes (not on query/sort changes)
const poolFuse = useMemo(() => fuseIndex(pool), [pool]);
```

Then replace the entire `filtered` useMemo (currently lines 55–92) with this simpler version:

```tsx
const filtered = useMemo(() => {
  const q = query.trim();
  const list: Clinic[] = q
    ? poolFuse.search(q).map((r) => r.item)
    : [...pool];
  list.sort((a, b) => {
    const aP = isPaidPartner(a), bP = isPaidPartner(b);
    if (aP !== bP) return aP ? -1 : 1;
    if (sortKey === "reviews") return (b.review_count || 0) - (a.review_count || 0);
    if (sortKey === "rating") return (b.rating || 0) - (a.rating || 0);
    return b.trust_score - a.trust_score;
  });
  return list;
}, [pool, poolFuse, query, sortKey]);
```

Also delete the `const fuse = useMemo(() => fuseIndex(clinics), [clinics]);` line on line 31 since `pool` and `poolFuse` replace it entirely.

- [ ] **Step 2: Fix MobileBottomNav.tsx — Link + lang-aware active state**

Open `components/MobileBottomNav.tsx`. Add `Link` import:
```tsx
import Link from "next/link";
```

Replace the entire component body with the fixed version. The key changes: (a) derive `lang` from `pathname`, (b) build lang-aware hrefs, (c) use `<Link>` instead of `<a>`:

```tsx
export default function MobileBottomNav() {
  const pathname = usePathname();
  const [savedCount, setSavedCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    function readCount() {
      try {
        const raw = localStorage.getItem(KEY);
        const arr = raw ? JSON.parse(raw) : [];
        setSavedCount(Array.isArray(arr) ? arr.length : 0);
      } catch { setSavedCount(0); }
    }
    readCount();
    function onChange(e: Event) {
      setSavedCount(((e as CustomEvent<string[]>).detail || []).length);
    }
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);

  if (!mounted) return null;

  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin") || pathname?.startsWith("/onboarding")) return null;
  if (pathname && /\/clinic\//.test(pathname)) return null;

  // Extract lang prefix from path — fallback to "en"
  const langMatch = (pathname || "").match(/^\/([a-z]{2})\//);
  const lang = langMatch ? langMatch[1] : "en";

  const TABS = [
    {
      href: `/${lang}/`,
      label: "Home",
      icon: "🏠",
      match: (p: string) => p === `/${lang}/`,
    },
    {
      href: `/${lang}/c/`,
      label: "Browse",
      icon: "🔍",
      match: (p: string) => p.startsWith(`/${lang}/c/`),
    },
    {
      href: `/${lang}/saved/`,
      label: "Saved",
      icon: "❤",
      match: (p: string) => p.startsWith(`/${lang}/saved`),
    },
    {
      href: `/${lang}/compare/`,
      label: "Compare",
      icon: "⚖",
      match: (p: string) => p.startsWith(`/${lang}/compare`),
    },
  ];

  return (
    <nav
      className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t shadow-[0_-2px_8px_rgba(0,0,0,0.04)] print:hidden"
      style={{ borderColor: "rgb(var(--border))", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-4">
        {TABS.map((t) => {
          const isActive = t.match(pathname || "/");
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`relative flex flex-col items-center justify-center py-2.5 text-[10px] font-bold transition ${
                isActive ? "text-emerald-700" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span className="text-xl leading-none mb-0.5">{t.icon}</span>
              <span>{t.label}</span>
              {t.label === "Saved" && savedCount > 0 && (
                <span className="absolute top-1 right-1/2 translate-x-3 grid place-items-center h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-[9px] font-black">
                  {savedCount}
                </span>
              )}
              {isActive && <span className="absolute top-0 inset-x-6 h-0.5 bg-emerald-600 rounded-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Fix ShareToFriend.tsx — text fix**

Open `components/ShareToFriend.tsx`. Find line 16:
```tsx
const text = `Check out ${clinicName} on bkkclinics — verified across 5+ public sources.`;
```

Replace with:
```tsx
const text = `Check out ${clinicName} on Thai Facial Clinic — verified across 6 independent sources.`;
```

- [ ] **Step 4: Build check**

```bash
npm run build
```

Expected: no TypeScript errors. If `pool` useMemo causes a lint warning about missing deps, the deps array `[clinics, filterViral, procFilter, cityFilter]` is correct and intentional.

- [ ] **Step 5: Manual verify MobileBottomNav**

```bash
npm run dev
```

Open `http://localhost:3000/en/` on a mobile viewport (DevTools → device toolbar). The bottom nav should appear. The "Home" tab should be highlighted with a green indicator bar at top and `text-emerald-700`. Click "Browse" — it should navigate to `/en/c/` and highlight the Browse tab. No full page reload (client-side navigation).

- [ ] **Step 6: Commit**

```bash
git add components/DirectoryClient.tsx components/MobileBottomNav.tsx components/ShareToFriend.tsx
git commit -m "fix: Fuse memo split, MobileBottomNav Link+lang routing, ShareToFriend text"
```

---

### Task 5: Mobile UX Polish

**Two small improvements:**

1. **viewport-fit=cover** — without this, on iPhone notch/Dynamic Island, the bottom safe area is not respected and content can be hidden behind the home indicator.

2. **scroll-margin-top** — the sticky header is 64px (h-16). When clicking anchor links (`#directory`, `#how-it-works`), sections scroll to the exact top, making the first line of content hidden behind the header. Adding `scroll-margin-top` pushes the scroll target down by the header height.

**Files:**
- Modify: `app/layout.tsx` — add viewport export with `viewportFit: "cover"`
- Modify: `app/globals.css` — add scroll-margin-top for anchor-targeted sections

- [ ] **Step 1: Add viewport export to layout.tsx**

Open `app/layout.tsx`. After the `export const metadata` block, add:

```tsx
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
```

Note: The `Viewport` type must be imported from `"next"` and exported as `viewport` (separate from `metadata`). This replaces any `<meta name="viewport">` tag you might have elsewhere.

- [ ] **Step 2: Add scroll-margin-top in globals.css**

Open `app/globals.css`. After the `html { scroll-behavior: smooth; }` line, add:

```css
/* Prevent sticky header (h-16 = 64px) from covering anchor-scrolled sections */
section[id],
div[id="directory"],
div[id="how-it-works"] {
  scroll-margin-top: 5rem; /* 80px — header (64px) + comfortable gap */
}
```

- [ ] **Step 3: Build check**

```bash
npm run build
```

Expected: no errors. If TypeScript complains about `Viewport` not exported from `"next"`, use:
```tsx
import type { Viewport } from "next";
```
(It's a named export, not default.)

- [ ] **Step 4: Visual check**

```bash
npm run dev
```

On `http://localhost:3000/en/`, click the "Browse all clinics" CTA button which links to `#directory`. The directory section should scroll into view with a comfortable gap below the sticky header — not hiding under it.

On mobile (DevTools device toolbar with iPhone model), check that the bottom navigation doesn't overlap page content — `env(safe-area-inset-bottom)` should add padding on notch devices.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "fix: viewport-fit=cover for notch devices + scroll-margin-top for anchor sections"
```

---

## Self-Review Checklist

**Spec coverage:**
- ✅ Font optimization (Task 1)
- ✅ Image optimization config (Task 2)
- ✅ Image optimization components — Hero, ClinicCard, clinic detail (Task 3)
- ✅ DirectoryClient Fuse bug (Task 4)
- ✅ MobileBottomNav Link + lang-aware routing (Task 4)
- ✅ ShareToFriend text fix (Task 4)
- ✅ viewport-fit=cover + scroll-margin-top (Task 5)
- ✅ Cache headers (Task 2 — included in next.config.mjs)

**Placeholder scan:** No TBD/TODO/placeholder in any step.

**Type consistency:**
- `pool: Clinic[]` — defined in Task 4 Step 1, consumed only in Task 4 Step 1 (single file)
- `poolFuse: Fuse<Clinic>` — defined and consumed in Task 4 Step 1 (single file)
- `Image` from `"next/image"` — imported in each file where used
- `Viewport` from `"next"` — imported in Task 5 Step 1
