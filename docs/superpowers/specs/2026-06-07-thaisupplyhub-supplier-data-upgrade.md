# Spec: ThaiSupplyHub Supplier Page Data Upgrade

**Date:** 2026-06-07
**Site:** thaisupplyhub.com (`web-factory/`)
**Scope:** Supplier individual page (`/supplier/[id]`) — data enrichment + surface existing signals

---

## Problem

The supplier page template is comprehensive (TrustIndex, TrustGauges, IndustryRadar, MedalWall, PeerCompare, RFQ form), but most supplier records are data-sparse. Specifically:

- `dbd` is null for many suppliers → HeroCertificate renders empty
- `photos` is empty → gallery hidden
- `external_reviews` is empty → reviews section hidden
- MedalWall slots for ISO 9001, IATF 16949, HACCP, BOI are all `active: false` — the UI is there but nothing activates them
- `mentioned_topics` is populated from review NLP but **never displayed on the page**

The result: pages look thin despite having real signals already in the data.

## Goal

Make every supplier page feel substantive by:
1. Surfacing the `mentioned_topics` data as visible "Buyer Signals" badges
2. Activating MedalWall entries from existing topic data + new optional fields
3. Extending the `Supplier` type schema with new enrichment fields so the BOI scraper (future) can attach immediately
4. Displaying new fields (export markets, employee range) in the DBD section when present

---

## Approach: Hybrid (A → B)

Phase 1 (immediate): Surface existing data. Zero new scraping.
Phase 2 (schema prep): Extend type + display logic so future enrichment data plugs in with no further page changes.

---

## Section 1: Type Schema Extension

Add to `Supplier` in `lib/types.ts`:

```typescript
// ── Future enrichment fields (populated by BOI scraper / manual CSV) ──
boi_promoted?: boolean | null;
boi_activity?: string | null;        // e.g. "Electronic components manufacturing"
employee_range?: string | null;      // e.g. "200–500", "500+"
export_markets?: string[] | null;    // e.g. ["Japan", "Germany", "USA"]
iso_scope?: string | null;           // e.g. "ISO 9001:2015"
iatf_certified?: boolean | null;
haccp_certified?: boolean | null;
```

All fields optional/nullable — no existing records break, no migration needed. `master_db.json` records without these fields read as `undefined`.

---

## Section 2: MedalWall Activation Logic

File: `app/supplier/[id]/page.tsx` — the `medals` array.

Activation rules (in priority order):

| Medal | Condition |
|-------|-----------|
| ISO 9001 | `r.iso_scope != null` OR `topicCount("iso_certified") >= 2` |
| IATF 16949 | `r.iatf_certified === true` |
| HACCP | `r.haccp_certified === true` OR `topicCount("food_safety") >= 2` |
| BOI Promoted | `r.boi_promoted === true` |

Helper in page: `const topicCount = (key: string) => r.mentioned_topics.find(t => t.topic === key)?.count ?? 0`

Medal `sub` text logic:
- ISO: show `r.iso_scope` if present, else `"Mentioned in buyer reviews"`
- BOI: show `r.boi_activity` if present, else `"BOI-promoted company"`
- HACCP: `"Food safety certified"`

---

## Section 3: Buyer Signals Section (new)

New section inserted between TrustGauges and Categories chips in `app/supplier/[id]/page.tsx`.

Only renders if `r.mentioned_topics.length > 0`.

**Positive topics** (green badges): `high_quality`, `on_time`, `export_ready`, `oem_odm`, `responsive`, `competitive_price`, `low_moq`, `iso_certified`, `food_safety`, `english_support`, `chinese_support`, `korean_support`, `japanese_support`, `modern_machinery`, `clean_facility`, `bulk_orders`, `samples_available`, `factory_tour`, `experienced`, `low_moq`, `warehouse_large`, `good_packaging`, `good_location`, `friendly_staff`

**Warning topics** (orange badges): `poor_quality`, `delayed`, `unresponsive`, `expensive`, `outdated`

Display: chips with topic label from `TOPIC_LABELS` + count bubble. Topics with count=0 not shown. Warnings always shown if present (transparency signal). Section heading: "Buyer signals · from {N} reviews".

No new component needed — inline JSX in page or small `BuyerSignals` component in `components/`.

---

## Section 4: Export Markets + Employee Range Display

In the DBD details `<dl>` grid (existing `Detail` component), append when present:

```tsx
{r.export_markets?.length && (
  <Detail label="Export markets">
    {r.export_markets.join(" · ")}
  </Detail>
)}
{r.employee_range && (
  <Detail label="Employees">{r.employee_range}</Detail>
)}
```

Positioned after the `estate_name` detail row. Renders nothing when fields are absent.

---

## Files Changed

| File | Change |
|------|--------|
| `lib/types.ts` | Add 7 new optional fields to `Supplier` type |
| `app/supplier/[id]/page.tsx` | Medal activation logic, new Buyer Signals section, export/employee display |
| `components/BuyerSignals.tsx` | New component (or inline) — topic badge grid |

No changes to `data/master_db.json` schema or scraping pipeline in this spec.

---

## Out of Scope

- BOI scraper (separate pipeline task)
- Employee count data acquisition
- ISO/IATF scraping
- Estate page upgrades
- Homepage changes

---

## Success Criteria

- Every supplier with `mentioned_topics` data shows Buyer Signals badges
- Suppliers with 2+ `iso_certified` mentions show ISO medal as active
- New type fields compile cleanly with no TS errors
- No regressions on suppliers with empty data (page still renders)
- `next build` passes
