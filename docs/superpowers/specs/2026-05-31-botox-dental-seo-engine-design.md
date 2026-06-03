# Botox + Dental SEO Data Engine — Design Spec

- **Date:** 2026-05-31
- **Status:** Approved design (pre-implementation)
- **Pilot sites:** `bangkokbotoxclinic.com` (botox/injectables), `bangkokbestclinic.com` (dental) — same Vercel
- **Later:** `thaifacialclinic.com` (hair) joins the shared engine

## 1. Goal

Make the user's Thai medical-tourism clinic directory sites **cooler, stickier (longer time-on-site), and traffic-exploding** vs competitors. The **#1 objective is SEO organic traffic explosion**; engagement and authority follow from the same data strategy.

The scrapers are the *means*; the deliverable is a **content/data strategy** that decides what data to collect and how to turn it into ranking pages, refreshed daily.

## 2. Target Market

- **Primary:** English-speaking medical tourists (EU / Middle East / Australia / US) — high-value keywords like *hair transplant Thailand cost*, *botox Bangkok price*.
- **Secondary:** Korean medical tourists — Naver/Google KR SEO, KR-language pages powered by existing Naver/Pantip data.
- Pages generated in **EN + KR** with hreflang.

## 3. Strategy — Hybrid A+B

Programmatic long-tail page scale (**A**) where **every page is filled with unique multi-source data (B)** so nothing is thin content; daily refresh for freshness. Editorial intent content (**C**) only on top-of-funnel keywords.

Existing assets that make this strong:
1. A running **6-source collection fleet** (Google Maps, Pantip, Reddit, Naver, YouTube, Bookimed).
2. **Daily refresh** capability.
3. **Sister-site network** (cross-linking via existing `SisterSites` component).

## 4. SEO Page Architecture (6 page types)

Build pages by **search intent**, each filled with data competitors can't copy:

| # | Page type | Example keyword | Unique data that fills it | Scale |
|---|---|---|---|---|
| 1 | **Clinic profile** | *Dr. XX Clinic Bangkok* | Multi-source merged reviews, trust score, real price list, before/after, doctor credentials, languages | 1 per clinic (hundreds) |
| 2 | **Procedure × City** | *botox in Phuket* | Ranked clinic list + price range + mini-guide | procedure×city (dozens–hundreds) |
| 3 | **"Best N" ranking** | *10 best botox clinics Bangkok 2026* | Trust-score ranking, **refreshed monthly = freshness** | procedure×city |
| 4 | **Price/cost** | *dental implant cost Thailand 2026* | **Real price index** (multi-source) + comparison vs Korea/Turkey | per procedure (high-value head terms) |
| 5 | **Clinic comparison** | *Clinic A vs Clinic B* | Both clinics' data side-by-side (price, score, reviews) | long-tail (large) |
| 6 | **Procedure guide (C)** | *veneers vs crowns*, *is botox safe* | Informational answer + embedded live clinic/price data | per procedure (core only) |

Why it drives traffic: 1/2/5 = long-tail breadth (programmatic); 3/4 = high-value commercial terms kept fresh; 6 = top-of-funnel feeding internal links; unique price/review data avoids thin content and earns backlinks; EN+KR doubles surface area.

**Three-site structure (hub-and-spoke):** same engine, different procedure category per site. The general/hub site links out to the specialist sites; specialists cross-link back.

## 5. Data Model

Central entity **Clinic**, with Procedure / Price / Review attached. Source legend: ✅ existing fleet, 🆕 new.

### Clinic
| Group | Fields | Source |
|---|---|---|
| Identity | name (EN/Thai/KR), slug, address, city, geo, phone, LINE, WhatsApp, website | Google Maps ✅ |
| Trust | trust_score (0-100), score_breakdown, verified, fake-review detection | multi-source aggregate ✅ |
| Reviews (core moat) | per-source review_count & rating, aggregated rating, sentiment, representative quotes (multi-lang) | Google Maps, Pantip, Reddit, Naver, YouTube ✅ |
| Procedures & price | procedures offered, **per-procedure real price range (฿)**, packages | Pantip/Reddit price mentions ✅ + **official clinic-site price list 🆕** |
| Media | facility photos, **before/after gallery**, video testimonials | Google Maps ✅ + YouTube ✅ + clinic site 🆕 |
| Credentials (differentiator) | doctors & experience, certifications (JCI, Thai Medical Council), **languages spoken** | clinic official site 🆕 |
| Freshness | last_scraped, new_this_month, review_delta | fleet incremental ✅ |

### PriceIndex (the weapon for page type #4)
- Per `procedure × city`: min/median/max ฿, sample size, confidence, comparison vs Korea/Turkey, monthly trend.
- Source: clinic-site list prices 🆕 + Pantip/Reddit actual paid amounts ✅, cross-validated.

### Procedure (catalog — the axis for page types #2/#3)
- Botox site: botox, filler, Ultherapy, skin boosters 🆕
- Dental site: implants, orthodontics, veneers, whitening, root canal 🆕 (dental data sources partially exist)
- Each procedure: definition, recovery time, candidacy, average price → guide page (#6) body.

### Two new collection components
1. **🆕 Clinic official-site scraper** — list prices, doctor credentials, certifications, languages. (Extends existing `clinic-enrichment/` folder. This is the "look at the sites and extract data" enrichment step.)
2. **🆕 Price extractor** — parse `฿XX,XXX` from reviews/site text → PriceIndex aggregation.

## 6. Daily Pipeline

```
[1.collect continuous] → [2.enrich nightly] → [3.build on-change] → [4.deploy daily] → [5.index ping]
```

| Stage | Work | Infra (♻️ reuse / 🆕 new) |
|---|---|---|
| 1. Collect (24/7) | VPN 8-port + Chrome Playwright incremental scrape per city×procedure: discovery (grid) + reviews (scraper) + 🆕 clinic-site enrichment | ♻️ watchdog, nordvpn_runner, scraper_grid, scraper / 🆕 clinic-site scraper |
| 2. Enrich (nightly) | multi-source **entity resolution (clinic dedupe)**, trust score, **price extraction → PriceIndex**, representative quotes & sentiment, **EN↔KR translation** | ♻️ master_db_builder pattern / 🆕 dedupe, price, translation modules |
| 3. Build (on data change) | canonical JSON → Next.js **incremental** generation of the 6 page types (changed pages only) | ♻️ watch_and_build.py |
| 4. Deploy (daily) | push to Vercel + "updated YYYY-MM-DD" freshness stamps | ♻️ auto_push_loop + Vercel |
| 5. Index (post-deploy) | sitemap update + **IndexNow ping** for fast Google/Bing recrawl | ♻️ indexnow_ping.py, sitemap.ts |
| Monitor | collection rate, disk, PIDs, freshness SLA | ♻️ health_monitor, throughput_monitor |

**Data flow:** `fleet incremental → run/<city> raw → nightly enrich → clinics.json + price_index.json → Next.js incremental build → Vercel deploy → IndexNow ping`.

**Cadence:** collection = continuous (rotating one workstream at a time); enrich + build + deploy + ping = **once nightly** → this is the concrete "add daily" mechanism.

## 7. Pilot Scope + No-Duplicate Strategy

Pilot = **botox + dental** sites, same Vercel. Critical requirement: **zero duplicate data/content across the two owned sites** (avoid Google duplicate-content penalty and self-cannibalization).

**Shared DB, non-overlapping site slices:**

| Layer | Rule |
|---|---|
| Clinic ownership | Botox site = botox/filler/injectable/skin clinics; Dental site = dental/implant/ortho clinics. **Split by procedure tag.** |
| Multi-specialty clinics | A clinic offering both may appear on both, but each page shows **only that niche's procedures/prices/reviews**; the rest is cross-linked via `SisterSites`. |
| Reviews/quotes | Each scraped review is **topic-classified** (botox vs dental vs general). Placed only on the matching site. General reviews used on **one site only**, or uniquely re-written per site — never identical text on both. |
| Generated text | Templates are **niche-specific** (different intros, data points). No "same template, swapped word." |
| Entity resolution | The same clinic is **never collected/stored twice**; one DB record, sites filter a projection. |
| Duplicate gate | Build-time text-similarity check across the two sites flags pages exceeding an overlap threshold. |

```
Shared scraper fleet + canonical DB (1 record/clinic, deduped)
        ├── botox filter  → botox.json  → bangkokbotoxclinic (Next.js)
        └── dental filter → dental.json → bangkokbestclinic  (Next.js)
              same build engine, niche-specific templates/copy
```

## 8. Rollout Order

1. **Shared engine** — canonical DB + dedupe + procedure tagging + price extraction + duplicate-detection gate.
2. **Dental first** (data source already exists: `dental_grid_runner.py`, `dental_review_bangkok`, `dental_output/`) → bangkokbestclinic 6 page types → deploy → index.
3. **Botox** (add procedure filter) → bangkokbotoxclinic, same treatment.
4. Turn on the **daily pipeline** → freshness.
5. After validation, **hair (thaifacialclinic)** joins the same engine.

## 9. Constraints

- **Single laptop / overheating:** the fleet previously forced shutdowns. Collection runs **one workstream at a time** (VPN 8 ports = one city/procedure fully utilized), heavy build runs **once nightly**. No simultaneous fan-out. (Optional future: move collection to cloud to allow true 24/7 full-throttle.)
- Scraping must respect target-site load (rate limits, VPN rotation already in place).

## 10. New Components Summary

1. Clinic official-site scraper (enrichment: prices, credentials, certifications, languages).
2. Price extractor → PriceIndex.
3. Procedure catalogs for botox and dental.
4. Entity-resolution / dedupe module across sources.
5. EN↔KR translation step.
6. Niche-specific Next.js page templates (6 types) for botox and dental sites.
7. Build-time duplicate-content detection gate.

## 11. Success Criteria

- Both sites publish the 6 page types, populated with real multi-source data (no thin/placeholder pages).
- **Zero cross-site duplicate content** (duplicate gate passes).
- Daily pipeline runs unattended: new/changed clinic data appears on the live sites the next morning with updated freshness stamps and IndexNow pings.
- Laptop runs the collection without thermal shutdown.
- (Outcome metric) growth in indexed pages and organic impressions over the following weeks.

## 12. Out of Scope (YAGNI for pilot)

- Hair site migration (step 5, after pilot validates).
- Cloud collection (optional future).
- Paid clinic placements / monetization mechanics (separate concern; `for-clinics`/revenue already partially exists).
- Chinese-market pages.
