"""Orchestrate: products + ingredient_db + review corpora -> scored, ranked master_db.json."""
from __future__ import annotations
import json, re, statistics, time
from pathlib import Path

from cosmetics import config, ingredients, scoring, review_aggregate

MASTER_DB = config.OUTPUT_DIR.parent / "web" / "data" / "master_db.json"
_VOL = re.compile(r"(\d+(?:\.\d+)?)\s*ml", re.I)

def _ml(volume: str) -> float:
    m = _VOL.search(volume or "")
    return float(m.group(1)) if m else 0.0

# --- product format / body-vs-face classification -------------------------
#
# Every concern this site ranks (acne, whitening, antiaging, pores, oilcontrol,
# sensitive) is a FACIAL concern, but the Konvy feed mixes in body lotions,
# body washes, hand creams and hair products. They were being ranked alongside
# facial skincare and winning: a 500ml body lotion held #1 for whitening and a
# 26ml acne sheet mask held #1 for antiaging.
_NON_FACIAL = re.compile(
    r"\b(body\s*(lotion|wash|cream|serum|scrub|mist|oil|butter|spray)"
    r"|hand\s*(cream|wash|lotion)|foot\s*(cream|scrub)"
    r"|shampoo|conditioner|hair\s*(mask|serum|oil|tonic|treatment)"
    r"|deodorant|antiperspirant|roll[-\s]?on"
    r"|shower\s*(gel|cream)|bath\s*(gel|salt))\b",
    re.I,
)

def _is_facial(name: str) -> bool:
    return not _NON_FACIAL.search(name or "")

# --- oral supplements (2026-08-14 expansion) -------------------------------
#
# "form" separates what you swallow from what you apply. A tablet/capsule/
# lozenge name is the trigger, but that alone is ambiguous: packaging borrows
# the same words for topical products — "SUISAI Beauty Clear Powder Wash
# [0.4g x 15 Capsules]" is a face wash sold in single-use pods, and "Puricas
# Anti Acne Serum Sachet" is a serum sample sachet. A topical product-type word
# anywhere in the name overrides the oral trigger.
_ORAL_FORM = re.compile(
    r"\b(tablets?|capsules?|softgels?|lozenges?|chewables?|effervescent"
    r"|เม็ด|แคปซูล)\b",
    re.I,
)
_TOPICAL_OVERRIDE = re.compile(
    r"\b(serum|cream|lotion|gel|toner|cleans(?:er|ing)|foam|mask|jelly|balm"
    r"|wash|primer|concealer|corrector|essence|sunscreen)\b",
    re.I,
)


def _form(name: str) -> str:
    n = name or ""
    if _ORAL_FORM.search(n) and not _TOPICAL_OVERRIDE.search(n):
        return "oral"
    return "topical"


_DOSE = re.compile(r"(\d[\d,]*(?:\.\d+)?)\s*(mg|mcg|g|iu)\b", re.I)
_SERVINGS = re.compile(
    r"(\d+)\s*(?:tablets?|capsules?|softgels?|lozenges?|เม็ด|แคปซูล)", re.I
)
_UNIT_TO_MG = {"mg": 1.0, "mcg": 0.001, "g": 1000.0, "iu": None}  # iu has no fixed mg


def _dose_mg(name: str) -> "float | None":
    """First mg/mcg/g dose mentioned in the name, normalised to mg.

    IU (used for fat-soluble vitamins by potency, not mass) is left unparsed
    rather than guessed — asserting a wrong mg figure would be worse than no
    figure, and none of the oral actives this launch scores (vitamin C,
    collagen, glutathione, biotin, zinc) are normally labelled in IU.
    """
    m = _DOSE.search(name or "")
    if not m:
        return None
    unit = m.group(2).lower()
    factor = _UNIT_TO_MG.get(unit)
    if factor is None:
        return None
    return float(m.group(1).replace(",", "")) * factor


def _servings(name: str) -> "int | None":
    m = _SERVINGS.search(name or "")
    return int(m.group(1)) if m else None


# Supplement packaging states its active on the front of the box — "Vitamin C
# 1000mg", "Collagen Tripeptide" — it does not carry an INCI ingredient list,
# which is what ingredients.match() needs. So for oral products the active is
# read off the product name instead. This is reading the label, not guessing:
# the name IS the declared content, the way "1000mg" IS the declared dose.
# Scoped to the five actives this launch approved (see design notes); nothing
# outside that set is scored, so a general "Multivitamin" or "B-complex"
# correctly stays unmatched and out of the oral rankings.
_ORAL_ACTIVE_NAME_MAP = [
    (re.compile(r"\bvitamin\s*c\b|ascorbic\s*acid|\bbio\s*c\b|\bacerola\b", re.I), "Ascorbic Acid"),
    (re.compile(r"\bcollagen\b", re.I), "Collagen Peptide"),
    (re.compile(r"\bglutathion", re.I), "Glutathione"),
    (re.compile(r"\bzinc\b", re.I), "Zinc"),
    (re.compile(r"\bbiotin\b", re.I), "Biotin"),
]


def _oral_name_actives(name: str, ing_db: dict) -> list[dict]:
    out = []
    for pattern, key in _ORAL_ACTIVE_NAME_MAP:
        if key in ing_db and pattern.search(name or ""):
            e = ing_db[key]
            entry = {"inci": key, "role": e["role"],
                     "concern_efficacy": e["concern_efficacy"],
                     "safety_flags": e["safety_flags"]}
            if e.get("reference_dose_mg"):
                entry["reference_dose_mg"] = e["reference_dose_mg"]
            out.append(entry)
    return out


# --- makeup (2026-08-14 expansion) ------------------------------------------
#
# Buying intent for makeup is category-driven ("best concealer") rather than
# concern-driven ("best product for acne") the way skincare and supplements
# are, so makeup gets its own /makeup/{category} pages instead of a section on
# the concern pages — folding it in would mean sparse, oddly-framed sections
# on most concern pages, since most makeup carries no active ingredients to
# match a concern with.
#
# Only categories with enough population for a median to mean anything get a
# ranking page (the same >=8 threshold value_score's format classes use).
# BB/CC cream are folded into "foundation" — same face-base shopping intent,
# too few standalone listings (1 and 3) to need their own page.
_MAKEUP_PATTERNS = [
    ("concealer",  re.compile(r"\bconcealer\b", re.I)),
    ("cushion",    re.compile(r"\bcushion\b", re.I)),
    ("foundation", re.compile(r"\bfoundation\b|\bbb\s*cream\b|\bcc\s*cream\b", re.I)),
    ("powder",     re.compile(r"\bpowder\b", re.I)),
]
# Category keywords collide with non-makeup products: a folding comb has
# "cushion" in its name, an enzyme face-wash comes in powder form, a Thai
# herbal cooling powder (แป้งเย็น) is a skincare product despite "powder" in
# its name, and a body lotion can be named "powder lotion" for its finish.
_MAKEUP_OVERRIDE = re.compile(
    r"\b(comb|mirror|brush|sponge|puff|applicator|holder|case"
    r"|wash|herbal|body|lotion|fragrance\s*of)\b",
    re.I,
)
_SPF = re.compile(r"\bspf\s*(\d+)", re.I)


def _makeup_category(name: str) -> "str | None":
    n = name or ""
    if _MAKEUP_OVERRIDE.search(n):
        return None
    for label, pattern in _MAKEUP_PATTERNS:
        if pattern.search(n):
            return label
    return None


def _spf(name: str) -> "int | None":
    m = _SPF.search(name or "")
    return int(m.group(1)) if m else None


# Format classes for value_score. price-per-ml is only meaningful within a
# format: a 473ml cleanser will always look like better "value" than a 30ml
# serum, which is why large-volume products swept every ranking when they were
# all compared against one global median.
_FORMAT_PATTERNS = [
    ("mask",        re.compile(r"\b(sheet\s*mask|jelly\s*mask|mask|masque|patch)\b", re.I)),
    ("cleanser",    re.compile(r"\b(cleanser|cleansing|face\s*wash|facial\s*wash|foam|micellar|makeup\s*remover)\b", re.I)),
    ("toner",       re.compile(r"\b(toner|essence|mist|first\s*treatment|lotion\s*toner)\b", re.I)),
    ("serum",       re.compile(r"\b(serum|ampoule|booster|concentrate)\b", re.I)),
    ("sunscreen",   re.compile(r"\b(sunscreen|sun\s*cream|uv\s*(protector|shield)|spf)\b", re.I)),
    ("moisturizer", re.compile(r"\b(cream|moisturi[sz]er|gel\s*cream|emulsion|lotion|balm)\b", re.I)),
]

def _format_class(name: str) -> str:
    """Bucket a product by dosage form so value_score compares like with like."""
    for label, pattern in _FORMAT_PATTERNS:
        if pattern.search(name or ""):
            return label
    return "other"

def build_db(products: list[dict], reviews_by_id: dict,
             youtube_by_id: dict | None = None,
             watsons_by_id: dict | None = None,
             boots_by_id: dict | None = None) -> dict:
    db = ingredients.load_db()
    # prior mean rating across products that have ratings
    rated = [p["konvy_rating"] for p in products if p.get("konvy_rating")]
    prior = statistics.mean(rated) if rated else 4.2
    # price/ml for value_score, compared against the median of the SAME format
    # class rather than one global median. The old global median was the single
    # biggest ranking defect: value is 10% of total_score and a 473-500ml
    # cleanser or body lotion scored a perfect 100 on it against a median set
    # largely by 25-30ml serums and sheet masks, which is how body products came
    # to hold #1 on facial concern pages.
    for p in products:
        name = p.get("name", "")
        p["_form"] = _form(name)
        p["_makeup_cat"] = _makeup_category(name) if p["_form"] == "topical" else None
        p["_spf"] = _spf(name) if p["_makeup_cat"] else None
        if p["_form"] == "oral":
            p["_dose_mg"] = _dose_mg(name)
            p["_servings"] = _servings(name)
            p["_ppml"] = 0.0
            p["_format"] = "oral"
        elif p["_makeup_cat"]:
            p["_ppml"] = 0.0
            p["_format"] = "makeup:" + p["_makeup_cat"]
        else:
            ml = _ml(p.get("volume", ""))
            p["_ppml"] = (p["price_thb"] / ml) if (ml and p.get("price_thb")) else 0.0
            p["_format"] = _format_class(name)
    _all_ppml = [p["_ppml"] for p in products if p["_form"] == "topical" and p["_ppml"]]
    med_ppml = statistics.median(_all_ppml) if _all_ppml else 0.0

    _by_format: dict[str, list[float]] = {}
    for p in products:
        if p["_form"] == "topical" and p["_ppml"]:
            _by_format.setdefault(p["_format"], []).append(p["_ppml"])
    # A class needs enough members for its median to mean anything; below that,
    # fall back to the global median rather than to a median of three products.
    _MIN_CLASS_SIZE = 8
    med_by_format = {
        fmt: statistics.median(vals)
        for fmt, vals in _by_format.items()
        if len(vals) >= _MIN_CLASS_SIZE
    }
    print("  value_score medians by format: "
          + str({k: round(v, 3) for k, v in sorted(med_by_format.items())})
          + f" (global {med_ppml:.3f})")

    # Oral products compare on ฿/serving, never against topical ฿/ml — a tablet
    # has no meaningful volume, and _ml() already returns 0 for one so this
    # would otherwise silently default every supplement's value_score to 50.
    _oral_pps = []
    for p in products:
        if p["_form"] == "oral" and p.get("_servings") and p.get("price_thb"):
            p["_price_per_serving"] = p["price_thb"] / p["_servings"]
            _oral_pps.append(p["_price_per_serving"])
        else:
            p["_price_per_serving"] = 0.0
    med_pps = statistics.median(_oral_pps) if _oral_pps else 0.0
    if _oral_pps:
        print(f"  oral value_score median: ฿{med_pps:.2f}/serving (n={len(_oral_pps)})")

    # Makeup compares whole-item price within its own category — a concealer
    # and a loose powder aren't sold or priced by weight the way skincare is,
    # so ฿/g would compare unlike things the same way ฿/ml did for body lotions
    # vs. serums before that got fixed. Needs >=8 listings, same threshold as
    # every other median in this file, or the category isn't ranked (see the
    # empty-pool handling in the ranking loop below).
    _by_makeup_cat: dict[str, list[float]] = {}
    for p in products:
        if p.get("_makeup_cat") and p.get("price_thb"):
            _by_makeup_cat.setdefault(p["_makeup_cat"], []).append(p["price_thb"])
    med_by_makeup_cat = {
        cat: statistics.median(prices)
        for cat, prices in _by_makeup_cat.items()
        if len(prices) >= _MIN_CLASS_SIZE
    }
    if med_by_makeup_cat:
        print("  makeup value_score medians by category: "
              + str({k: round(v, 1) for k, v in sorted(med_by_makeup_cat.items())}))

    # Auto-promotion into a concern pool requires this much summed efficacy from
    # the product's matched actives for that concern.
    #
    # This used to gate on ingredient_score >= 30. ingredient_score is
    # `10 + min(eff_sum, 6)/6*90 - penalties`, so 30 was cleared by eff_sum = 2 —
    # a single ingredient with the weakest non-zero rating. Nearly every product
    # got auto-tagged into all six concerns, which is why concern_seeds reads
    # "acne|antiaging|oilcontrol|pores|whitening|sensitive" on almost every row
    # and why the concern pools stopped filtering anything at all.
    AUTO_SEED_MIN_EFFICACY = 4

    # review_score is scaled against the corpus, so the corpus stats have to be
    # known before any product is scored: the p5-p95 rating band and the largest
    # pooled review count. Cheap pre-pass — no ingredient matching involved.
    def _rating_sources(pp: dict) -> list[tuple[float, int]]:
        out = [(float(pp.get("konvy_rating") or 0), int(pp.get("konvy_review_count") or 0))]
        b = (boots_by_id or {}).get(pp["product_id"]) or {}
        # Only barcode-confirmed Boots joins count. Name similarity cannot tell
        # products apart within a brand, and a wrong join would move a ranking.
        if b.get("matched_by") == "ean" and (b.get("review_count") or 0) > 0:
            out.append((float(b.get("rating") or 0), int(b["review_count"])))
        return [(r, c) for r, c in out if r > 0 and c > 0]

    _pooled_ratings, _max_count = [], 1
    for pp in products:
        srcs = _rating_sources(pp)
        if not srcs:
            continue
        n = sum(c for _, c in srcs)
        _pooled_ratings.append(sum(r * c for r, c in srcs) / n)
        _max_count = max(_max_count, n)
    review_band = scoring.rating_band(_pooled_ratings)
    print(f"  review band (p5-p95): {review_band[0]:.2f}–{review_band[1]:.2f}  "
          f"max pooled reviews: {_max_count}")

    out_products = {}
    for p in products:
        ing_list = p.get("ingredients", [])
        if isinstance(ing_list, str):                      # scraper stores "|"-joined string
            ing_list = [x for x in ing_list.split("|") if x]
        analysis = ingredients.match(ing_list, db)
        if p["_form"] == "oral":
            have = {a["inci"] for a in analysis}
            analysis = analysis + [a for a in _oral_name_actives(p.get("name", ""), db)
                                   if a["inci"] not in have]
        rsum = review_aggregate.summarize(reviews_by_id.get(p["product_id"], []))

        # Review score pools every retailer that reports an aggregate rating.
        # Konvy was the only source; Boots publishes rating + number_of_reviews
        # for ~83% of its catalogue and is joined here by barcode. Pooling (see
        # scoring.review_score_multi) shrinks once against the shared prior, so
        # a second retailer sharpens the estimate instead of averaging it away.
        bt = (boots_by_id or {}).get(p["product_id"]) or {}
        rev = scoring.review_score_scaled(_rating_sources(p), review_band,
                                          prior_mean=prior, max_count=_max_count)
        ing, tot = {}, {}
        makeup_score = None
        if p["_form"] == "oral":
            val = scoring.value_score(p["_price_per_serving"], med_pps)
            for c in scoring.CONCERNS:
                ing[c] = scoring.oral_ingredient_score(analysis, c, p.get("_dose_mg"))
                tot[c] = scoring.total_score(ing[c], rev, val)
        elif p.get("_makeup_cat"):
            # No ingredient axis and no concern dimension — makeup never enters
            # a concern ranking, so ing/tot stay at 0 for shape-compatibility
            # with every other product record rather than being absent.
            val = scoring.value_score(p["price_thb"], med_by_makeup_cat.get(p["_makeup_cat"], 0.0))
            for c in scoring.CONCERNS:
                ing[c] = 0.0
                tot[c] = 0.0
            makeup_score = scoring.makeup_score(rev, val, p.get("_spf"))
        else:
            val = scoring.value_score(p["_ppml"], med_by_format.get(p["_format"], med_ppml))
            for c in scoring.CONCERNS:
                ing[c] = scoring.ingredient_score(analysis, c)
                tot[c] = scoring.total_score(ing[c], rev, val)
        pantip = _load_pantip(p["product_id"])
        rec = dict(p)
        form = rec.pop("_form")
        dose_mg = rec.pop("_dose_mg", None)
        servings = rec.pop("_servings", None)
        makeup_category = rec.pop("_makeup_cat", None)
        spf = rec.pop("_spf", None)
        rec.pop("_price_per_serving", None)
        rec.pop("_ppml", None)
        rec.pop("_format", None)
        rec.update({"ingredient_analysis": analysis, "ingredient_score": ing,
                    "review_score": rev, "value_score": val,
                    "total_score": tot, "review_summary": rsum,
                    "form": form, "dose_mg": dose_mg, "servings": servings,
                    "makeup_category": makeup_category, "spf": spf,
                    "makeup_score": makeup_score})
        if pantip is not None:
            rec["pantip"] = pantip
        yt = (youtube_by_id or {}).get(p["product_id"])
        if yt and yt.get("video_count", 0) > 0:
            rec["youtube"] = yt
        wt = (watsons_by_id or {}).get(p["product_id"])
        if wt and wt.get("review_count", 0) > 0:
            rec["watsons"] = wt
        if bt.get("matched_by") == "ean" and (bt.get("review_count") or 0) > 0:
            rec["boots"] = {
                "matched_name": bt.get("matched_name", ""),
                "rating": bt.get("rating", 0),
                "review_count": bt.get("review_count", 0),
                "ean": bt.get("ean", ""),
            }
        out_products[p["product_id"]] = rec

    # Derive concern_seeds from ingredient evidence, from scratch, every build.
    #
    # This used to ADD to whatever concern_seeds the product already carried. That
    # was cumulative and irreversible: main() merges freshly scraped products on top
    # of the products already in master_db.json, so each build re-read the seeds the
    # PREVIOUS build had auto-added and added more on top. Seeds could only ever
    # grow, never be revoked — 270 of 1,003 products had ended up tagged for all six
    # concerns, which is why the concern pools had stopped excluding anything.
    #
    # Rule ("evidence-first"):
    #   - product has ingredient_analysis -> seeds are exactly the concerns its
    #     actives support, falling back to its single strongest concern so a
    #     product is never orphaned out of every ranking;
    #   - product has no ingredient_analysis -> keep the recorded seeds. There is
    #     no evidence to prune with, and these are single-seed scraper rows anyway.
    #
    # Modelled against the current dataset before adopting: 988 unsupported
    # seed-assignments removed, 0 products dropped from every ranking.
    def _recorded_seeds(pp: dict) -> set[str]:
        seeds = pp.get("concern_seeds", "")
        if isinstance(seeds, list):
            return {s.strip() for s in seeds if s and s.strip()}
        return {s.strip() for s in seeds.split("|") if s.strip()}

    removed = added = 0
    for pp in out_products.values():
        recorded = _recorded_seeds(pp)
        analysis = pp.get("ingredient_analysis") or []
        if not analysis:
            derived = recorded
        else:
            eff = {c: sum(a["concern_efficacy"].get(c, 0) for a in analysis)
                   for c in scoring.CONCERNS}
            derived = {c for c, v in eff.items() if v >= AUTO_SEED_MIN_EFFICACY}
            if not derived:
                best = max(scoring.CONCERNS, key=lambda c: eff[c])
                derived = {best} if eff[best] > 0 else recorded
        removed += len(recorded - derived)
        added += len(derived - recorded)
        pp["concern_seeds"] = sorted(derived)
    print(f"  concern_seeds re-derived: -{removed} unsupported, +{added} newly supported")

    def _in_seeds(pp: dict, concern: str) -> bool:
        cs = pp.get("concern_seeds", "")
        if isinstance(cs, list):
            return concern in cs
        return concern in cs.split("|")

    # All six concerns are facial. Body/hair/deodorant products keep their own
    # product pages but must never appear in a facial ranking, and neither
    # should oral supplements or makeup — each gets its own parallel ranking
    # below, scored on what actually distinguishes it (dose, or review+value).
    # Before the makeup_category check was added here, an "Acne Care
    # Concealer" with a matched active could leak into the acne ranking
    # alongside actual treatment serums — a concealer is not a treatment no
    # matter what its ingredient list says.
    facial = [pp for pp in out_products.values()
             if pp.get("form") == "topical" and pp.get("makeup_category") is None
             and _is_facial(pp.get("name", ""))]
    excluded = len(out_products) - len(facial)
    if excluded:
        print(f"  excluded {excluded} non-topical-facial products from concern rankings")

    rankings = {}
    for c in scoring.CONCERNS:
        # No `or all products` fallback: an empty pool means the concern genuinely
        # has no qualifying products, and padding it with the entire catalogue is
        # what put products with zero relevant actives on the ranking pages.
        pool = [pp for pp in facial if _in_seeds(pp, c)]
        ranked = scoring.rank_products(pool, c)
        rankings[c] = [{"product_id": pp["product_id"], "total_score": pp["total_score"][c]} for pp in ranked]
        print(f"  ranked {len(ranked):>4} products -> {c}")

    # Oral rankings, parallel to the topical ones. A product qualifies only when
    # oral_ingredient_score actually produced a number above the floor — no
    # dose parsed, or a multi-active blend where the dose is ambiguous, both
    # score 0 for every concern and are correctly absent from every list here
    # (they still get a product page; see form/dose_mg/servings on the record).
    oral = [pp for pp in out_products.values() if pp.get("form") == "oral"]
    oral_rankings = {}
    for c in scoring.CONCERNS:
        pool = [pp for pp in oral if pp["ingredient_score"].get(c, 0) > 0]
        ranked = scoring.rank_products(pool, c)
        oral_rankings[c] = [{"product_id": pp["product_id"], "total_score": pp["total_score"][c]}
                            for pp in ranked]
    ranked_oral_total = sum(len(v) for v in oral_rankings.values())
    print(f"  oral supplements: {len(oral)} products, {ranked_oral_total} concern-ranking slots filled")

    # Makeup rankings, one list per category — not per concern, since makeup
    # is shopped by product type ("best concealer"), not skin concern. Only
    # categories that cleared the >=8-listing median threshold get ranked; a
    # category below that has no meaningful "value" comparison to rank on
    # (same empty-pool-means-no-page rule as the concern rankings above).
    makeup = [pp for pp in out_products.values() if pp.get("makeup_category")]
    makeup_rankings: dict[str, list[dict]] = {}
    for cat in med_by_makeup_cat:
        pool = sorted(
            (pp for pp in makeup if pp["makeup_category"] == cat),
            key=lambda pp: (pp["makeup_score"] or 0.0, pp.get("sold_count", 0)),
            reverse=True,
        )
        makeup_rankings[cat] = [{"product_id": pp["product_id"], "total_score": pp["makeup_score"]}
                                for pp in pool]
        print(f"  ranked {len(pool):>4} products -> makeup/{cat}")

    return {"generated_at": None, "products": out_products,
            "rankings": rankings, "oral_rankings": oral_rankings,
            "makeup_rankings": makeup_rankings}

def _load_youtube() -> dict:
    out = {}
    if config.REVIEWS_DIR.exists():
        for f in config.REVIEWS_DIR.glob("*_youtube.json"):
            pid = f.name.split("_youtube")[0]
            try:
                out[pid] = json.loads(f.read_text(encoding="utf-8"))
            except Exception:
                pass
    return out

def _load_boots() -> dict:
    """Boots aggregate ratings (no review prose — Boots publishes none)."""
    out = {}
    if config.REVIEWS_DIR.exists():
        for f in config.REVIEWS_DIR.glob("*_boots.json"):
            pid = f.name.split("_boots")[0]
            try:
                out[pid] = json.loads(f.read_text(encoding="utf-8"))
            except Exception:
                pass
    return out

def _load_watsons() -> dict:
    out = {}
    if config.REVIEWS_DIR.exists():
        for f in config.REVIEWS_DIR.glob("*_watsons.json"):
            pid = f.name.split("_watsons")[0]
            try:
                out[pid] = json.loads(f.read_text(encoding="utf-8"))
            except Exception:
                pass
    return out

def _load_reviews() -> dict:
    out = {}
    rdir = config.REVIEWS_DIR
    if rdir.exists():
        for f in rdir.glob("*_konvy.json"):
            pid = f.name.split("_")[0]
            try:
                data = json.loads(f.read_text(encoding="utf-8-sig"))
                if isinstance(data, dict):
                    # new format: {source, product_name, review_count, snippets, fetched_at}
                    out[pid] = data.get("snippets") or []
                elif isinstance(data, list):
                    out[pid] = data
                else:
                    out[pid] = []
            except Exception:
                out[pid] = []
    return out


def _load_pantip(product_id: str) -> "dict | None":
    """Load and compact pantip review data for a product, or return None."""
    rdir = config.REVIEWS_DIR
    f = rdir / f"{product_id}_pantip.json"
    if not f.exists():
        return None
    try:
        raw = json.loads(f.read_text(encoding="utf-8"))
    except Exception:
        return None
    snippets = raw.get("snippets", [])[:4]
    compact_snippets = [
        {k: s[k] for k in ("text", "topic_id", "author") if k in s}
        for s in snippets
    ]
    return {
        "mention_count": raw.get("mention_count", 0),
        "thread_count": raw.get("thread_count", 0),
        "snippets": compact_snippets,
    }

def _load_ingredient_patches() -> dict[str, list[str]]:
    patch_file = config.STATE_DIR / "ingredient_patches.json"
    if patch_file.exists():
        try:
            return json.loads(patch_file.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def main() -> int:
    fresh_products = [json.loads(f.read_text(encoding="utf-8"))
                       for f in sorted((config.OUTPUT_DIR / "products").glob("*.json"))]

    # output/products/*.json is local, gitignored scrape-run state — it is NOT
    # guaranteed to still be on disk (a fresh checkout/session has none of it, as
    # happened here: a run that only got through 23 products before hitting the
    # VPN tunnel budget would otherwise silently REPLACE a 1002-product database
    # with a 23-product one). master_db.json itself is git-committed and durable,
    # so treat its existing products as the floor and layer fresh scrape results
    # on top, keyed by product_id (fresh wins on conflict). This also means a
    # rebuild now picks up review data collected into output/reviews/ this
    # session even for products whose own output/products/*.json wasn't re-fetched.
    existing_by_id: dict = {}
    if MASTER_DB.exists():
        try:
            existing_by_id = json.loads(MASTER_DB.read_text(encoding="utf-8")).get("products", {})
        except Exception:
            existing_by_id = {}
    merged_by_id = dict(existing_by_id)
    for p in fresh_products:
        merged_by_id[str(p["product_id"])] = p
    products = list(merged_by_id.values())
    if existing_by_id:
        print(f"merging {len(fresh_products)} freshly scraped product(s) with "
              f"{len(existing_by_id)} already in master_db.json -> {len(products)} total")

    # Apply ingredient backfill patches (products.csv is patched separately; merge here)
    patches = _load_ingredient_patches()
    if patches:
        patched = 0
        for p in products:
            pid = str(p.get("product_id", ""))
            if pid in patches and not p.get("ingredients"):
                ings = patches[pid]
                if ings:  # skip empty-list entries (confirmed no ingredients)
                    p["ingredients"] = "|".join(ings)
                    p["ingredient_count"] = len(ings)
                    patched += 1
        if patched:
            print(f"Applied ingredient patches: {patched} products updated")
    db = build_db(products, _load_reviews(), _load_youtube(), _load_watsons(), _load_boots())
    db["generated_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    MASTER_DB.parent.mkdir(parents=True, exist_ok=True)
    MASTER_DB.write_text(json.dumps(db, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"master_db: {len(db['products'])} products -> {MASTER_DB}")
    return 0

if __name__ == "__main__":
    import sys; sys.exit(main())
