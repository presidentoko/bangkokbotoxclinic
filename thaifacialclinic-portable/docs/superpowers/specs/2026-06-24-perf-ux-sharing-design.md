# thaifacialclinic.com — Performance, UX & Sharing Sprint Design
Date: 2026-06-24

## Goal
6-hour sprint to improve user acquisition (SEO/performance), dwell time, sharing virality, and fix all known bugs. Mobile-first throughout.

## Scope

### 1. Server / Performance Optimization (Priority: Critical)

**Font optimization**
- Remove CSS `@import url(googleapis...)` from `globals.css` (render-blocking)
- Replace with `next/font/google` in `layout.tsx` (Fraunces + Plus Jakarta Sans)
- Add `preconnect` hints removed as they become unnecessary with next/font

**Image optimization**
- Remove `images: { unoptimized: true }` from `next.config.mjs`
- Add `remotePatterns` for known external image CDNs (lh3.googleusercontent.com, cdn.bookimed.com, lh5.googleusercontent.com, maps.googleapis.com, etc.)
- Replace `<img>` with `<Image>` from `next/image` in above-the-fold components:
  - `Hero.tsx` — hero photo collage (LCP critical)
  - `ClinicCard.tsx` — card thumbnails
  - `FeaturedClinics.tsx` — featured clinic photos
- Keep `<img>` for below-fold / user-generated content where dimensions are unknown

**Cache headers**
- Add `headers()` to `next.config.mjs` for long-lived caching on `/public/*` static assets

### 2. Sharing / OG Images (Priority: Critical for virality)

**Clinic detail OG image**
- Currently clinic pages have no OG image → social share preview is blank
- Add `opengraph-image.tsx` route at `app/[lang]/clinic/[slug]/opengraph-image.tsx`
- Uses clinic's `top_photo_url` as background + name + trust score overlay
- Falls back to default `/og-default.png` if no photo

**ShareToFriend bug fixes**
- Fix share text: "verified across 5+ public sources" → "6 independent sources"
- Ensure `url` prop passed from clinic page is absolute (`${SITE.origin}/${lang}/clinic/${slug}/`)
- Add Facebook/Instagram copy-for-stories option

### 3. Bug Fixes

| Bug | File | Fix |
|-----|------|-----|
| Fuse re-created on every filter | `DirectoryClient.tsx` | Use the pre-built `fuse` index, don't re-create `poolFuse` inline — filter the pool separately |
| MobileBottomNav uses `<a>` | `MobileBottomNav.tsx` | Replace with `<Link>` from next/link for client-side navigation |
| ShareToFriend text wrong | `ShareToFriend.tsx` | "5+ sources" → "6 independent sources" |
| `<html lang="en">` hardcoded | `layout.tsx` | Accept lang param or set to "mul" (multilingual) |

### 4. Mobile UX Polish

- `MobileBottomNav`: fix active state detection for lang-prefixed routes (`/en/`, `/ko/`, etc.)
- `StickyMobileCTA`: verify safe-area-inset-bottom applied correctly
- Touch targets: audit key interactive elements for ≥44px tap target
- Ensure `meta viewport` has `viewport-fit=cover` for notch devices

### 5. Engagement

- Verify `ReadingProgressBar` has correct scroll target on clinic detail pages
- Add `scroll-margin-top` to section anchor IDs so sticky header doesn't cover them
- Ensure `NewsletterSignup` form submits to `/api/subscribe/` correctly

## Architecture

No new files except:
- `app/[lang]/clinic/[slug]/opengraph-image.tsx` (new — OG image route)
- `next.config.mjs` updated with remotePatterns + headers

All other changes are edits to existing files.

## Non-goals
- No new pages or routes (except OG image)
- No DB schema changes
- No new external dependencies

## Success Criteria
- Lighthouse Performance score improves (font + image fix → LCP improvement)
- Clinic share links show photo thumbnail on WhatsApp/LINE/Facebook
- Zero TypeScript errors
- Mobile bottom nav highlights correct tab on all lang routes
