# Learn Cooking Job — Schedule Setup

## Quick start (manual run)

```bash
# First run — full seed + collect + receipt
npx tsx jobs/learn-cooking/run.ts --full

# Subsequent runs — refresh reviews only
npx tsx jobs/learn-cooking/run.ts --refresh
```

## Schedule (Windows Task Scheduler)

- **Full seed** (weekly): `schtasks /create /tn "thaigle-learn-full" /tr "npx tsx jobs/learn-cooking/run.ts --full" /sc weekly /d MON /st 03:00`
- **Refresh** (daily): `schtasks /create /tn "thaigle-learn-refresh" /tr "npx tsx jobs/learn-cooking/run.ts --refresh" /sc daily /st 02:00`

## TODOs before production

1. Wire `fetchGooglePlaces()` → Outscraper `/maps/search-v3` API (`OUTSCRAPER_API_KEY` env var)
2. Wire `fetchGoogleReviews()` → Outscraper `/maps/reviews-v3` API
3. Wire OTA scrapers (Klook/GYG/Viator) via Webshare residential proxy (`WEBSHARE_PROXY_URL` env var)
4. Populate `jobs/learn-cooking/state.json` → `otaMatches` table after first manual matching pass
5. Install `@anthropic-ai/sdk` and `zod` packages if not already present: `npm install @anthropic-ai/sdk zod`

## State files

- `jobs/learn-cooking/state.json` — running state (place hashes, receipt status, OTA matches)
- `jobs/learn-cooking/review-queue.json` — places needing human review (high sponsored %, needs_review status)
