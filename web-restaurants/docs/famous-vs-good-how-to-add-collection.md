# How to Add a New Famous vs Good Collection

## Overview

The `/famous-vs-good/[slug]` system is data-driven from `data/ig-seed.json`.
Adding a new city/category collection requires zero code changes — just add entries to the JSON file.

## Steps

### 1. Add entries to `data/ig-seed.json`

Add new objects with a new `category` slug. Example for Pattaya cafés:

```json
{
  "name": "Café XYZ",
  "ig_signal": "Frequently tagged on Instagram",
  "tag_count": null,
  "place_id": "0x311d5e4b...:0xabc123...",
  "district": "Central Pattaya",
  "city": "pattaya",
  "category": "pattaya-cafes"
}
```

**Category slug rules**: lowercase, hyphen-separated, pattern `{city}-{type}`.
Examples: `bangkok-cafes`, `bangkok-rooftop-bars`, `pattaya-cafes`.

**place_id**: use the Google Maps Place ID for exact matching. If unknown, leave `null`
and the matcher will try fuzzy name + district.

**tag_count**: only include if you have a verified source (e.g. Outscraper Instagram CSV).
If unknown, set to `null` — the card will show the qualitative `ig_signal` instead.

### 2. Deploy

That's it. The system automatically:
- Picks up the new category in `generateStaticParams` → creates the `/famous-vs-good/pattaya-cafes` route
- Adds the new slug to `sitemap.ts` → indexed by search engines
- Adds the new collection to `app/llms.txt/route.ts` → cited by AI assistants
- Shows the new card on the `/famous-vs-good` index page

### 3. Phase 2: Outscraper Instagram CSV

When real Instagram data is available:
1. Export CSV from Outscraper Instagram scraper
2. Run `ingestOutscraperInstagramCSV(csvPath)` from `lib/famous-vs-good.ts` (implement the TODO stub)
3. Write the output to `data/ig-seed.json` (or merge with existing entries)

## Thresholds

Gap thresholds are configurable constants at the top of `lib/famous-vs-good.ts`:
- `GAP_THRESHOLD_LOW = 75` — below this = "credibility gap"
- `GAP_THRESHOLD_HIGH = 85` — above this = "hype that holds up"

Adjust these after seeing the real data distribution.
