# -*- coding: utf-8 -*-
"""
hdmall_reparse.py — rebuild every HDmall-sourced package from the cached HTML.

Why this exists
---------------
The original `hdmall_insert.py` read each product card with

    data-event-value="([^"]{5,})"  ... data-price="([\\d.]+)"

and treated group 1 as the package *name*. It is not. On hdmall.co.th a card
carries two prices and no name in its data attributes:

    data-event-value="1790.0"   <- what the customer actually pays
    data-price="6000.0"         <- the struck-through list price
    data-link="health-check-up-49-items-program-basic-lab-plus-cancer-marker-..."
    <a aria-label="ตรวจสุขภาพ 49 รายการ โปรแกรม Basic Lab + Cancer Marker">

So 1,928 of 2,211 packages ended up named "1790.0" and priced at 6,000 THB —
the name was the real price and the price was the pre-discount one (median
1.26x, up to 3.4x too high). Everything downstream inherited the damage:
`fix_all_data.py` matches its category rules against the name, found nothing to
match, and fell back to bucketing by that inflated price, so the category of
every one of those rows is fiction too, as are the has_* inclusion flags.

This script re-reads the same cache and writes names from `data-link` (English,
readable, keyword-bearing), prices from `data-event-value`, and Thai names from
`aria-label`.

It also drops what was never a health check-up. The cached pages are hdmall
category listings, and their carousels cross-sell massage courses, acupuncture,
vaccines and circumcision — 1,480 of the 2,533 unique cards. A price-comparison
site for health check-ups listing "Thai massage 60 minutes" as a check-up
package is why those pages read as thin to a crawler.
"""
import argparse
import glob
import html
import os
import re
import unicodedata
from pathlib import Path

import pymysql

from config import DB_CONFIG

CACHE = Path(__file__).parent / "hdmall_cache"

# The card <div> is emitted in two layouts (`compact-package__item` in
# carousels, `card-package-list` in the main grid); both carry js-card-package
# and the same data-* attributes. Capture up to the closing ">" only — an
# attribute-repetition group backtracks catastrophically on a 600 KB page.
CARD_RE = re.compile(r'<div class="[^"]*js-card-package[^"]*"([^>]*)>')
ATTR_RE = re.compile(r'([a-z-]+)="([^"]*)"')
# aria-label on the card's first anchor is the Thai product name.
ARIA_RE = re.compile(r'aria-label="([^"]+)"')

# Diagnostics and screening stay; treatments, aesthetics and vaccinations go.
#
# Both patterns are matched against the *product* slug with the clinic's own
# slug already stripped off. Matching the raw link instead silently threw away
# every package from Avatreat Clinic ("treat"), Gentle Clinic ("gentle" is
# fine, but its circumcision listings carried an std-test suffix) and anyone
# whose brand happens to contain a treatment word.
EXCLUDE_RE = re.compile(
    r"vaccin|acupunctur|massage|surgery|circumcis|circum|botox|filler|laser|whitening"
    r"|braces|implant|iv-drip|-drip\b|physio|physical-therapy|rehab|counsel"
    r"|consult|treatment|therapy|course|slimming|hair|facial|scaling|lasik"
    r"|prolotherapy|\bprp\b|cupping|weight-loss|breast-aug|liposuc|tattoo|\bmask\b"
    r"|supplement|injection|needle|cryo|shockwave|stem-cell|freez|abortion"
    r"|contracept|steriliz|penis|\bspa\b|onsen|indiba|icsi|iui|fertility|prenatal"
    r"|detox|collagen|warts|room-service|bedroom|trainer|harmonizer|prep-|pep-"
)
INCLUDE_RE = re.compile(
    r"health-check|check-up|checkup|cheackup|check-health|health-care|screening"
    r"|screen-|annual-check|blood-test|lab-test|physical-exam|health-screen"
    r"|cancer-marker|tumor-marker|full-lab|basic-lab|pre-employ|pre-marri"
    r"|before-marriage|before-working|before-surgery|allerg|hormone|thyroid|hiv"
    r"|hpv-dna|cervical-cancer|\bstd\b|sti-|ekg|ecg|echo|ultrasound|x-ray|xray"
    r"|mri|ct-scan|colonoscopy|gastroscopy|endoscopy|cystoscop|mammogram"
    r"|bone-density|dexa|pap-smear|psa|urine|stool|liver|kidney|diabetes"
    r"|cholesterol|calcium-score|-test\b|test-|detects|detect-|examination"
    r"|analysis|profile|panel|hepatitis|covid|dengue|influenza|body-composition"
    r"|eye-exam|hearing|blood-group|blood-clotting|indications|heart|cardiac"
    r"|bone-|vitamin|\bdna\b|genes?\b|items\b"
)

# HDmall appends its own fulfilment codes to every product slug. They are
# internal routing ("plus" = HDmall Plus, "lab-ml"/"lab-pl" = which partner lab
# draws the blood) and carry no meaning for a reader.
NOISE_TOKENS = re.compile(
    r"-hdmall-plus-lab-(?:ml|pl|hl)\b|-hdmall-plus\b|-lab-(?:ml|pl|hl)\b|-hdmall\b"
)


def slugify(text: str) -> str:
    """ASCII kebab-case, for matching a data-brand against a hospital name."""
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii").lower()
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", text)).strip("-")


# Words that should not be title-cased, and ones that must stay upper.
UPPER = {
    "ekg", "ecg", "ct", "mri", "hiv", "hpv", "psa", "cbc", "dna", "std", "sti",
    "bmi", "igg", "ige", "igg4", "cea", "afp", "tsh", "ldl", "hdl", "est",
    "dexa", "hbv", "hcv", "vip", "pcr", "usg", "tcm", "id", "vit",
}
LOWER = {"and", "or", "for", "of", "the", "with", "in", "at", "to", "a", "an", "over", "by"}


# brand -> the token suffix HDmall appends to that brand's product links.
# Populated by learn_brand_suffixes() before any parsing of names.
BRAND_SUFFIX: dict[str, str] = {}

# Words that a clinic's product slugs repeat but which belong to the package
# name, not the clinic — see learn_brand_suffixes().
GENERIC_TAIL = {
    "aged", "age", "ages", "years", "year", "old", "and", "or", "over", "up",
    "above", "more", "than", "for", "the", "with", "at", "of", "to", "in",
    "item", "items", "time", "times", "person", "people", "program", "package",
    "men", "women", "male", "female", "every", "all", "each", "only", "case",
    "cases", "test", "tests", "check", "checks", "plus", "level", "type",
    "types", "1", "2", "3",
}


def learn_brand_suffixes(cards: list[dict]) -> None:
    """Work out, per brand, which trailing tokens are the clinic's own slug.

    `data-brand` is often Thai ("กายคตา สหคลินิก") while the link suffix is a
    romanisation ("...-kayagata-clinic"), so slugifying the brand does not
    match. What does hold is that every product from one clinic ends in the
    same tokens — so take the longest common trailing token run across that
    brand's links and treat it as the suffix.
    """
    by_brand: dict[str, list[list[str]]] = {}
    for c in cards:
        by_brand.setdefault(c["brand"], []).append(NOISE_TOKENS.sub("", c["link"]).split("-"))

    for brand, links in by_brand.items():
        guess = slugify(brand)
        if len(links) >= 2:
            # Longest trailing run shared by at least 60% of the brand's links.
            # Requiring *all* of them collapses to nothing as soon as one
            # product was filed under a slightly different clinic spelling.
            best: list[str] = []
            for n in range(1, 8):
                runs: dict[tuple[str, ...], int] = {}
                for toks in links:
                    if len(toks) > n:
                        runs[tuple(toks[-n:])] = runs.get(tuple(toks[-n:]), 0) + 1
                if not runs:
                    break
                run, hits = max(runs.items(), key=lambda kv: kv[1])
                if hits < max(2, len(links) * 0.6):
                    break
                best = list(run)
            # The shared tail also picks up wording every product repeats
            # ("...-aged-15-years-and-over-santiraks-clinic"). Only the clinic
            # part should be stripped, so walk in from the left and drop
            # generic words until a brand-looking token is reached.
            while best and (best[0] in GENERIC_TAIL or best[0].isdigit()):
                best.pop(0)
            if best:
                guess = "-".join(best)
        BRAND_SUFFIX[brand] = guess


def product_slug(link: str, brand: str) -> str:
    """The product part of an HDmall link, with the clinic and HDmall's own
    fulfilment codes removed.

    'health-check-up-49-items-program-basic-lab-plus-cancer-marker-hdmall-plus-lab-ml-chivi-clinic'
      -> 'health-check-up-49-items-program-basic-lab-plus-cancer-marker'
    """
    s = NOISE_TOKENS.sub("", link).strip("-")
    # Strip the learned suffix, then any progressively shorter prefix of it —
    # HDmall truncates long brand names ("...-w-plus-medic" for "W Plus
    # Medical Clinic").
    parts = (BRAND_SUFFIX.get(brand) or slugify(brand)).split("-")
    for n in range(len(parts), 0, -1):
        suffix = "-" + "-".join(parts[:n])
        if s.endswith(suffix) and len(s) > len(suffix) + 8:
            s = s[: -len(suffix)]
            break
    return s.strip("-")


def name_from_link(link: str, brand: str) -> str:
    """Turn a product slug into a readable English package name."""
    s = product_slug(link, brand)
    if not s:
        return ""

    words = []
    for i, w in enumerate(s.split("-")):
        if w == "plus":
            words.append("+")
        elif w in UPPER:
            words.append(w.upper())
        elif w in LOWER and i > 0:
            words.append(w)
        else:
            words.append(w.capitalize())
    out = " ".join(words)
    out = re.sub(r"\bCheck Up\b", "Check-Up", out)
    out = re.sub(r"\bX Ray\b", "X-Ray", out)
    out = re.sub(r"\s*\+\s*", " + ", out)
    return re.sub(r"\s+", " ", out).strip()


def parse_cards(path: Path) -> list[dict]:
    raw = path.read_text(encoding="utf-8", errors="ignore")
    out = []
    for m in CARD_RE.finditer(raw):
        attrs = dict(ATTR_RE.findall(m.group(1)))
        link = attrs.get("data-link")
        ev = attrs.get("data-event-value")
        if not link or not ev:
            continue
        try:
            price = float(ev)
        except ValueError:
            continue
        # HDmall lists a few 0-baht "enquire" placeholders and some six-figure
        # genetic panels; both are real, only the zero ones are useless.
        if price <= 0:
            continue
        try:
            list_price = float(attrs.get("data-price") or 0) or None
        except ValueError:
            list_price = None
        # The Thai name sits on the anchor immediately after the card div.
        tail = raw[m.end() : m.end() + 1200]
        aria = ARIA_RE.search(tail)
        out.append(
            {
                "link": link,
                "price": price,
                "list_price": list_price,
                "brand": html.unescape(attrs.get("data-brand", "")).strip(),
                "name_th": html.unescape(aria.group(1)).strip() if aria else None,
                "desc_th": re.sub(
                    r"<[^>]+>", "", html.unescape(attrs.get("data-description", ""))
                ).strip(),
            }
        )
    return out


def is_checkup(link: str, brand: str) -> bool:
    s = product_slug(link, brand)
    return bool(INCLUDE_RE.search(s)) and not EXCLUDE_RE.search(s)


# ---------------------------------------------------------------------------
# Category + inclusions, now that there is a real name to read.

# Order matters: the first match wins. Gender rules deliberately sit below the
# organ/disease ones, because "4 cancer screening for men" is a cancer package
# that happens to be sold to men — filing it under `men` hides it from the page
# people actually search for.
#
# `\best\b` is anchored on both sides: an unanchored `est` matches inside
# "Test", which is in roughly a third of all package names and put 142 blood
# panels in the cardiac category.
CATEGORY_RULES = [
    (r"cancer|tumor|\bmarker|\bcea\b|\bafp\b|ca-?125|colonoscopy|mammogram|pap smear|cervical|\bhpv\b", "cancer"),
    (r"\bheart\b|cardiac|cardio|\bekg\b|\becg\b|electrocardio|echocardio|calcium score|treadmill|exercise stress|\best\b", "heart"),
    (r"senior|elder|aged 60|60 years|65 years|70 years", "senior"),
    (r"\bwomen\b|\bwoman\b|female|lady|ladies|gynec|ovarian|breast|uterus", "women"),
    (r"\bmen\b|\bmale\b|prostate|\bpsa\b|testosterone", "men"),
    (r"before marriage|pre-marri|pre-employ|before working", "basic"),
    (r"executive|premium|platinum|diamond|\bvip\b|\bgold\b|deluxe|advance|in-?depth|comprehensive", "executive"),
    (r"\bbasic\b|starter|essential|\bmini\b|\blite\b|\blight\b", "basic"),
    (r"standard|classic|regular|\bfull\b", "standard"),
]

INCLUSION_RULES = {
    "has_blood": r"blood|lab|cbc|cholesterol|glucose|liver|kidney|hormone|marker|allerg|vitamin|thyroid|hiv|hepatitis",
    "has_xray": r"x-?ray|chest",
    "has_ultrasound": r"ultrasound|usg|abdomen|abdominal|echo(?!cardio)",
    "has_ct": r"\bct\b|ct-scan|calcium-score|colonograph",
    "has_mri": r"\bmri\b",
    "has_ecg": r"\bekg\b|\becg\b|electrocardio|echocardio",
    "has_treadmill": r"treadmill|exercise stress|\best\b|exercise",
    "has_cancer_marker": r"cancer|tumor|marker|cea|afp|psa|ca-?125",
    "has_doctor_consult": r"doctor|physician|program|check-?up",
}


BOTH_GENDERS = re.compile(r"\bwomen (?:or|and|&) men\b|\bmen (?:or|and|&) women\b|male (?:or|and) female|for (?:all|every)")


def classify(name: str, price: float) -> str:
    n = name.lower()
    unisex = bool(BOTH_GENDERS.search(n))
    for pattern, cat in CATEGORY_RULES:
        if cat in ("women", "men") and unisex:
            continue  # "19 items for women or men" is not a women's package
        if re.search(pattern, n):
            return cat
    # Nothing in the name says what tier it is. HDmall's own listings are
    # priced tightly enough that the number of tests, and failing that the
    # price, is the honest signal — unlike the pre-fix code, this now runs on
    # the real transaction price rather than the struck-through one.
    # Price has the last word at the extremes. Counting tests alone filed a
    # 20-item genetic panel at 48,902 baht as "basic", which is the sort of
    # thing that makes a whole category listing untrustworthy.
    if price >= 15_000:
        return "executive"
    if price < 1_200:
        return "basic"
    items = re.search(r"(\d+)\s*items?\b", n)
    if items:
        count = int(items.group(1))
        if count <= 20:
            return "basic"
        if count <= 45:
            return "standard"
        return "executive"
    if price < 4_000:
        return "standard"
    return "executive"


def inclusions(name: str) -> dict:
    n = name.lower()
    flags = {k: (1 if re.search(v, n) else 0) for k, v in INCLUSION_RULES.items()}
    flags["has_blood"] = 1  # every check-up on HDmall draws blood
    flags["has_interpreter"] = 0
    return flags


# HDmall labels a clinic with its Thai trading name. For the independent
# clinics that is also how the hospital row was created, so they match on the
# string. The hospitals below are the ones the storefront only ever names in
# Thai — mostly large private hospitals that carry real check-up catalogues and
# were missing from the site entirely. slug/English name/city, so a row can be
# created when it does not exist yet.
THAI_BRAND_ALIASES: dict[str, tuple[str, str, str]] = {
    "โรงพยาบาลบางมด": ("bangmod-hospital", "Bangmod Hospital", "Bangkok"),
    "คลินิกแล็บเซ็นเตอร์": ("lab-center-clinic", "Lab Center Clinic", "Bangkok"),
    "โรงพยาบาลเจ้าพระยา": ("chaophya-hospital", "Chaophya Hospital", "Bangkok"),
    "โรงพยาบาลพิษณุเวช พิษณุโลก": ("pitsanuvej-hospital", "Pitsanuvej Hospital Phitsanulok", "Phitsanulok"),
    "โรงพยาบาลรักษ์ข้อ": ("rakkhao-hospital", "Rakkhao Joint & Spine Hospital", "Bangkok"),
    "โรงพยาบาลเอเซีย": ("asia-hospital", "Asia Hospital", "Bangkok"),
    "โรงพยาบาลเอกชัย": ("ekachai-hospital", "Ekachai Hospital", "Samut Sakhon"),
    "โรงพยาบาลนครธน": ("nakornthon-hospital", "Nakornthon Hospital", "Bangkok"),
    "โรงพยาบาลบางปะกอก 8": ("bangpakok-8-hospital", "Bangpakok 8 Hospital", "Bangkok"),
    "โรงพยาบาลบางปะกอก 1": ("bangpakok-1-hospital", "Bangpakok 1 Hospital", "Bangkok"),
    "โรงพยาบาลวิชัยยุทธ": ("vichaiyut-hospital", "Vichaiyut Hospital", "Bangkok"),
    "โรงพยาบาลวิมุต": ("vimut-hospital", "Vimut Hospital", "Bangkok"),
    "โรงพยาบาลนวเวช": ("navavej-hospital", "Navavej International Hospital", "Bangkok"),
    "โรงพยาบาลปิยะเวท": ("piyavate-hospital", "Piyavate Hospital", "Bangkok"),
    "โรงพยาบาลนวมินทร์ 9": ("navamin-9-hospital", "Navamin 9 Hospital", "Bangkok"),
    "โรงพยาบาลยันฮี": ("yanhee-hospital", "Yanhee International Hospital", "Bangkok"),
    "กรุงเทพเมดิคัลแล็บ (bangkok medical laboratory)": ("bangkok-medical-laboratory", "Bangkok Medical Laboratory", "Bangkok"),
    # Already in the catalogue under an English name.
    "โรงพยาบาลพญาไท 1": ("phyathai-1", "Phyathai 1 Hospital", "Bangkok"),
    "โรงพยาบาลพญาไท 2": ("phyathai-2", "Phyathai 2 Hospital", "Bangkok"),
    "โรงพยาบาลพญาไท 3": ("phyathai-3", "Phyathai 3 Hospital", "Bangkok"),
    "โรงพยาบาลเปาโล เกษตร": ("paolo-kaset", "Paolo Hospital Kaset", "Bangkok"),
    # Not a clinic — HDmall's own "best sellers" carousel header.
    "โปรขายดี! hdmall แนะนำ": ("", "", ""),
}


def strip_trailing_brand(name: str, hospital_name: str) -> str:
    """Last-resort removal of the clinic's name from the end of a package name.

    learn_brand_suffixes() misses clinics whose products are too few or too
    inconsistently slugged to vote on a shared tail. Once a card is matched to
    a hospital row, though, the clinic's English name is known exactly — and
    "Screening Cancer EDIM Test Aged 20 Years over Kayagata Clinic" repeating
    the hospital name is noise on a page whose H1 is already that hospital.
    """
    words = name.split()
    hw = [w for w in re.split(r"[^A-Za-z0-9]+", hospital_name) if w]
    for n in range(min(len(hw), len(words) - 2), 0, -1):
        if [w.lower() for w in words[-n:]] == [w.lower() for w in hw[:n]]:
            return " ".join(words[:-n]).strip(" -–—,")
    return name


CAT_LABEL = {
    "executive": "Executive health check-up",
    "standard": "Standard health check-up",
    "basic": "Basic health check-up",
    "cancer": "Cancer screening",
    "heart": "Cardiac screening",
    "women": "Women's health check-up",
    "men": "Men's health check-up",
    "senior": "Senior health check-up",
}


def describe(name: str, cat: str, price: float, flags: dict, brand: str) -> str:
    items = re.search(r"(\d+)\s*items?", name.lower())
    bits = [f"{CAT_LABEL.get(cat, 'Health check-up')} at {brand}."]
    if items:
        bits.append(f"{items.group(1)} tests included.")
    covered = [
        label
        for key, label in [
            ("has_blood", "blood panel"),
            ("has_xray", "chest X-ray"),
            ("has_ultrasound", "ultrasound"),
            ("has_ecg", "ECG"),
            ("has_treadmill", "exercise stress test"),
            ("has_ct", "CT scan"),
            ("has_mri", "MRI"),
            ("has_cancer_marker", "cancer markers"),
            ("has_doctor_consult", "doctor consultation"),
        ]
        if flags.get(key)
    ]
    if covered:
        bits.append("Covers " + ", ".join(covered) + ".")
    bits.append(f"฿{price:,.0f}.")
    return " ".join(bits)


# ---------------------------------------------------------------------------


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true", help="write to the DB (default: dry run)")
    args = ap.parse_args()

    files = sorted(CACHE.glob("*.html"))
    cards: dict[str, dict] = {}
    # Each cached page is one clinic's HDmall storefront, and hdmall_insert.py
    # created that clinic's hospital row as "hdm-" + the first 45 characters of
    # the file name. Recording the page's own <h1> here gives an exact
    # brand -> hospital mapping, which name matching alone cannot do for the
    # clinics whose data-brand is Thai but whose hospital row is romanised.
    brand_to_slug: dict[str, str] = {}
    for f in files:
        raw_head = f.read_text(encoding="utf-8", errors="ignore")[:200_000]
        h1 = re.search(
            r'<h1[^>]*class="packages-header__title"[^>]*>\s*([^<]+?)\s*</h1>', raw_head
        )
        if h1:
            brand_to_slug.setdefault(
                html.unescape(h1.group(1)).strip().lower(), "hdm-" + f.stem[:45]
            )
        for c in parse_cards(f):
            # Same product appears in several category listings; first wins.
            cards.setdefault(c["link"], c)
    print(f"cached pages           : {len(files)}")
    print(f"unique product cards   : {len(cards)}")

    learn_brand_suffixes(list(cards.values()))
    keep = {k: v for k, v in cards.items() if is_checkup(k, v["brand"])}
    print(f"diagnostic / screening : {len(keep)}  (dropped {len(cards) - len(keep)} treatments, vaccines, aesthetics)")

    conn = pymysql.connect(**{**DB_CONFIG, "autocommit": False}, cursorclass=pymysql.cursors.DictCursor)
    with conn.cursor() as cur:
        cur.execute("SELECT id, slug, name FROM hospitals")
        hospitals = cur.fetchall()
    # Match on the slugified name where there is one, and on the raw string
    # otherwise: a Thai-only brand ("กายคตา สหคลินิก") slugifies to the empty
    # string, so keying solely on the slug files every Thai clinic under "" and
    # hands all their packages to whichever one was read last.
    by_brand: dict[str, dict] = {}
    for h in hospitals:
        if not h["name"]:
            continue
        by_brand.setdefault(h["name"].strip().lower(), h)
        if h.get("name_th"):
            by_brand.setdefault(h["name_th"].strip().lower(), h)
        key = slugify(h["name"])
        if key:
            by_brand.setdefault(key, h)

    by_slug = {h["slug"]: h for h in hospitals}

    # Create the aliased hospitals that do not exist yet, so their packages
    # have somewhere to land.
    created = 0
    if args.apply:
        with conn.cursor() as cur:
            for slug, name, city in THAI_BRAND_ALIASES.values():
                if not slug or slug in by_slug:
                    continue
                cur.execute(
                    "INSERT INTO hospitals (slug, name, area, city, jci) VALUES (%s,%s,%s,%s,0)",
                    (slug, name, city, city),
                )
                created += 1
            conn.commit()
            cur.execute("SELECT id, slug, name, name_th FROM hospitals")
            hospitals = cur.fetchall()
            by_slug = {h["slug"]: h for h in hospitals}
        if created:
            print(f"created {created} hospitals named only in Thai on HDmall")

    matched, unmatched = [], {}
    for link, c in keep.items():
        brand = c["brand"].strip().lower()
        alias = THAI_BRAND_ALIASES.get(brand)
        if alias is not None and not alias[0]:
            continue  # HDmall's own promo carousel, not a clinic
        h = (
            (by_slug.get(alias[0]) if alias else None)
            or by_slug.get(brand_to_slug.get(brand, "\0"))
            or by_brand.get(brand)
            or by_brand.get(slugify(c["brand"]) or "\0")
        )
        if not h:
            unmatched.setdefault(c["brand"], 0)
            unmatched[c["brand"]] += 1
            continue
        name = strip_trailing_brand(name_from_link(link, c["brand"]), h["name"])
        if not name or len(name) < 8:
            continue
        cat = classify(name, c["price"])
        flags = inclusions(name)
        matched.append(
            {
                "hospital_id": h["id"],
                "name": name[:255],
                "name_th": c["name_th"],
                "category": cat,
                "price": round(c["price"], 2),
                "description": describe(name, cat, c["price"], flags, h["name"]),
                "source_url": f"https://hdmall.co.th/health-checkup/{link}",
                **flags,
            }
        )

    print(f"matched to a hospital  : {len(matched)}")
    print(f"unmatched brands       : {len(unmatched)} ({sum(unmatched.values())} cards)")
    for b, n in sorted(unmatched.items(), key=lambda kv: -kv[1]):
        print(f"    {n:>3}  {b[:60]}")
    cats: dict[str, int] = {}
    for m in matched:
        cats[m["category"]] = cats.get(m["category"], 0) + 1
    print("categories             :", dict(sorted(cats.items(), key=lambda kv: -kv[1])))
    print(f"hospitals covered      : {len({m['hospital_id'] for m in matched})}")
    print("\nsample:")
    for m in matched[:12]:
        print(f"  ฿{m['price']:>9,.0f}  {m['category']:<10} {m['name'][:78]}")

    if not args.apply:
        print("\n(dry run — pass --apply to write)")
        return

    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) n FROM checkup_packages WHERE source_url LIKE '%hdmall%'")
        old = cur.fetchone()["n"]
        # Snapshots reference package ids; the broken rows' price history is a
        # record of the wrong price, so it goes with them.
        cur.execute(
            "DELETE FROM package_price_snapshots WHERE package_id IN"
            " (SELECT id FROM checkup_packages WHERE source_url LIKE '%hdmall%')"
        )
        cur.execute("DELETE FROM checkup_packages WHERE source_url LIKE '%hdmall%'")
        print(f"\ndeleted {old} mis-parsed HDmall rows")

        cols = (
            "hospital_id,name,category,price,currency,description,"
            "has_blood,has_xray,has_ultrasound,has_ct,has_mri,has_ecg,"
            "has_treadmill,has_cancer_marker,has_doctor_consult,has_interpreter,"
            "results_days,source_url,scraped_at"
        )
        sql = (
            f"INSERT INTO checkup_packages ({cols}) VALUES "
            "(%s,%s,%s,%s,'THB',%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,NOW())"
        )
        for m in matched:
            cur.execute(
                sql,
                (
                    m["hospital_id"], m["name"], m["category"], m["price"], m["description"],
                    m["has_blood"], m["has_xray"], m["has_ultrasound"], m["has_ct"],
                    m["has_mri"], m["has_ecg"], m["has_treadmill"], m["has_cancer_marker"],
                    m["has_doctor_consult"], m["has_interpreter"], 1, m["source_url"],
                ),
            )
    conn.commit()
    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) n, COUNT(price) p FROM checkup_packages")
        print("packages now:", cur.fetchone())
        cur.execute("SELECT category, COUNT(*) n FROM checkup_packages GROUP BY category ORDER BY n DESC")
        for r in cur.fetchall():
            print(f"  {r['category']:<12} {r['n']}")
    conn.close()


if __name__ == "__main__":
    main()
