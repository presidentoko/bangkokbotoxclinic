# chillanel Trust Score — Design

**Goal:** Give every place a single 0–100 "Trust Score" that's a genuinely more informative signal than Google's raw star rating — inspired by sibling project thaigle.com's signature feature, but computed entirely from data already in chillanel's pipeline (rating, reviewCount, serviceThemes, moodKeywords), with zero new scraping and zero paid APIs.

**Context:** thaigle.com's published formula (from its own FAQ) is: Google rating (50pts) + review volume on a log scale (40pts) + Local Guide reviewer ratio (10pts) + reviewer authority (5pts). The last two components (15pts) depend on Google Maps reviewer-profile data chillanel never scraped (Local Guide badges, individual reviewer history) — there is no way to port them directly. This design replaces that 15-point bucket with a signal unique to chillanel's own pipeline: review-mined topic diversity.

## Formula

Three components, summing to a 0–100 score:

1. **Rating (50 pts max)** — `(rating / 5) × 50`. Linear. If `rating` is `null` (not observed in the live 734-place dataset, but the `Place` type allows it), this component is 0.

2. **Review volume (35 pts max)** — `min(35, 35 × log10(reviewCount + 1) / log10(2001))`. Log-scaled so review count differences matter more at the low end than the high end, capped at a normalization ceiling of 2000 reviews (≈ the 95th percentile of the live dataset — chosen so the bulk of the distribution spreads meaningfully across the full 0–35 range instead of clustering near the cap; verified empirically, see Verification below).

3. **Signal diversity (15 pts max)** — 1 point per distinct label detected across `serviceThemes` and `moodKeywords` combined (deduplicated), capped at 15 (the fixed universe: 8 `SERVICE_THEMES` + 7 `MOOD_KEYWORDS` from `scripts/extract-themes.mjs`, verified disjoint by the regression test added in Phase 3). Diversity, not frequency — a place mentioned for 3 different reasons (e.g. "Clean", "Quiet & relaxing", "Good value") scores higher than one mentioned 50 times for a single reason. Places with zero service-theme/mood-keyword data (71/734 in the live dataset, ~9.7%) score 0 on this component — no reweighting, no special-casing. This is an intentional, simple, defensible rule: it reads as "we don't have enough signal from your reviews yet," not as a penalty invented for its own sake.

Total: 50 + 35 + 15 = 100 max. **Each component is individually `Math.round()`'d first** (rating points are always already integers for 1-decimal ratings — `rating × 10` — but volume points from the log formula are not), **then summed** for the headline score. This is not just cosmetic: the breakdown display ("Rating: 45/50 · Reviews: 31/35 · Signal diversity: 12/15") must sum to exactly the headline number shown next to it, or the one thing this design relies on for credibility — "see the math yourself" — breaks the moment someone actually adds it up.

## Labels

| Score range | Label |
|---|---|
| 85–100 | Excellent |
| 70–84 | Good |
| 50–69 | Fair |
| 0–49 | Limited data |

Verified against the live 734-place dataset (see Verification): 15% Excellent / 50% Good / 33% Fair / 3% Limited — a real spread, not everyone clustering into one bucket.

## Where it's computed

Pure function in a new `chillanel/lib/trust-score.ts`, taking a `Place`-shaped object (or just the four fields it needs) and returning `{ score: number, label: "excellent" | "good" | "fair" | "limited", breakdown: { ratingPoints: number, volumePoints: number, diversityPoints: number } }`. Computed at **read time** in the Next.js app (like `priceMedian`/`averageRating`/`placeSummary` in earlier phases), not baked into `build-data.mjs`'s output JSON — it's a pure derivation of fields already present, so there's no reason to add it to the data pipeline or its own generated field. This also means it recomputes automatically on every request/build with zero extra wiring, exactly like every other derived-display value in the app.

## Where it's displayed

- **`PlaceCard`**: a compact badge — the number plus the label, small enough to fit next to the existing rating badge. Placement: near the existing `★ {rating}` pill in the card header.
- **Place detail page**: the score again, but **expandable/tappable to reveal the breakdown** — "Rating: 45/50 · Reviews: 31/35 · Signal diversity: 12/15". This is the core defensibility mechanism the whole design hinges on: instead of asking a reader to trust an opaque number, the page shows the exact arithmetic behind it. No separate methodology/FAQ page is needed for this — the breakdown lives right where the score is shown.

## Global Constraints (carried into implementation)

- No paid APIs, no new scraping — pure function over existing fields only.
- Null/empty-safe rendering, same convention as every prior phase: if a place somehow has neither rating nor reviewCount data (not observed live, but the type allows `rating: null`), the score should still compute (0 rating points) rather than throwing or hiding the badge — a Limited-data place is still a valid, displayable state, unlike (e.g.) `RatingBars`'s all-zero-distribution case which genuinely has nothing to draw.
- All new UI strings (label names, breakdown labels, badge copy) go through `chillanel/lib/i18n.ts` with en/th/ko translations.
- Pure function tested via `node --test` with plain object fixtures, no filesystem coupling — same pattern as `lib/summary.ts`, `lib/related.ts`, `lib/theme-stats.ts`.

## Verification (done during design, not implementation)

Ran the exact formula above against the live `chillanel/data/clinics.bangkok.json` (734 places) via a one-off `node -e` script:

- 0/734 places have `rating: null` (the null-handling branch is defensive/type-driven, not currently reachable in live data).
- Score distribution: min 24, p10 58, p25 65, p50 74, p75 81, p90 87, max 96.
- Band counts: Excellent 109 (14.8%), Good 363 (49.5%), Fair 242 (33.0%), Limited 20 (2.7%).
- Manually inspected top-5 and bottom-5 scored places — rankings match intuition (top: high rating + high volume + high diversity; bottom: low rating + few reviews + no diversity signal).

This numeric verification is not itself part of the implementation plan's task list — the implementation plan's unit tests re-derive the same formula from first principles (not by copying these specific numbers), but this confirms the formula produces sane, non-degenerate output before any code is written.

## Explicitly out of scope

- A separate public "how Trust Score works" methodology page (thaigle has one in its FAQ) — the inline breakdown on the place detail page serves the same transparency purpose without needing a whole new content page. Can be added later if the inline breakdown turns out not to be enough.
- Using therapist-mention data as a component — considered and rejected during brainstorming: only 29/734 places (4%) have therapist mentions, versus 655–663/734 (89–90%) with mood/theme data, so it would leave the overwhelming majority of places with a near-universal 0 on that component. Mood/theme diversity was chosen specifically for its much better real-data coverage.
