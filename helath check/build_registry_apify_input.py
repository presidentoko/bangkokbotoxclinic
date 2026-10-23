"""Queries for the registered hospitals the directory cannot give an address for.

web/data/registry.json holds all 1,491 hospitals on Thailand's national
register, and for 1,380 of them it holds no address, no phone, no coordinates
and no website — only the hospital code, the sector, the type and the HA
accreditation status. That is what /directory/<province> publishes today: a
reader who searches "hospitals in Krabi" is told which ones are accredited and
cannot call or find a single one of them.

Google Places has exactly the four fields missing, so this writes the search
terms for them, most-searched types first, because the budget buys a few
hundred places rather than all 1,380:

    private, regional, general, university teaching and Department of Medical
    Services hospitals  — 458 of them

Those are the hospitals people type the name of. The 768 community hospitals
are district facilities with little English name search; they are the long tail
and can wait for the next budget.

The register's only name is Thai and usually bare — "บุรีรัมย์", not
"โรงพยาบาลบุรีรัมย์" — so the facility word is prepended unless the name
already carries one, and the province is appended. Run with `language: "th"`
so the title comes back in Thai: it is the register's own name field, which
makes identity checkable. Asking for English titles would hand back a name that
cannot be compared to anything we hold, and the fields actually wanted here —
address, phone, coordinates — are the same in either language.

    python build_registry_apify_input.py [--limit 458]

Writes apify_input_registry.json and registry/registry_apify_targets.json,
the second keyed by hcode so the merge can check what came back against what
was asked for.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REGISTRY = ROOT / "web" / "data" / "registry.json"

# Most-searched first. A name search for a regional hospital is a person trying
# to find a real place; nobody searches a community hospital in English.
PRIORITY = [
    "Private hospital",
    "Regional hospital",
    "General hospital",
    "University teaching hospital",
    "Department of Medical Services hospital",
]

# Names that already say what kind of place they are.
HAS_FACILITY_WORD = ("โรงพยาบาล", "สถาบัน", "ศูนย์", "คลินิก", "คณะแพทยศาสตร์",
                     "กอง", "วิทยาลัย")

# The register came out of a spreadsheet and four names still carry its
# carriage returns as the literal text "_x000D_". Five more have the hospital's
# *type* glued onto the end of its name — "รวมแพทย์ฉะเชิงเทราโรงพยาบาลทั่วไป"
# is Ruamphat Chachoengsao, a general hospital, not a hospital called
# "Ruamphat Chachoengsao General Hospital". Searching the glued string finds
# nothing, and a search term that finds nothing is a term that comes back as
# some other hospital.
#
# Only the phrase forms are cut, and only away from the start:
# "คณะแพทยศาสตร์โรงพยาบาลรามาธิบดี" really is called that.
GLUED_TYPE = ("โรงพยาบาลทั่วไป", "โรงพยาบาลเฉพาะ")

# Ten rows carry the type at the *front* instead, where it is not preceded by
# the word โรงพยาบาล and so cannot be found by the rule above: the register
# writes Cancer Alliance Sriracha as "เฉพาะทางมะเร็งแคนเซอร์อลิอันซ์ ศรีราชา",
# cancer-specialty first and the hospital's own name after. Thai does not put
# spaces between the two, so there is nothing to split on and the prefixes are
# listed. All ten were read by eye; longest first, so the ผู้ป่วย variants do
# not match before the more specific ones.
LEADING_TYPE = (
    "เฉพาะประเภทผู้ป่วย ผู้สูงอายุ",
    "เฉพาะประเภทผู้ป่วยเรื้อรัง",
    "เฉพาะประเภทผู้ป่วยเด็ก",
    "เฉพาะประเภทผู้สูงอายุ",
    "เฉพาะทางศัลยกรรมตกแต่ง",
    "เฉพาะทางจักษุวิทยา",
    "เฉพาะทางแม่และเด็ก",
    "เฉพาะทางมะเร็ง",
    "ทั่วไป",
)


def clean_name(raw: str) -> str:
    name = " ".join((raw or "").replace("_x000D_", " ").split())
    for glued in GLUED_TYPE:
        at = name.find(glued)
        if at > 0:
            name = name[:at]
    # The type phrase can sit behind a leading โรงพยาบาล too — Phaet Rangsit
    # Mother and Child is filed as "โรงพยาบาลเฉพาะทางแม่และเด็กแพทย์รังสิต".
    head = "โรงพยาบาล" if name.startswith("โรงพยาบาล") else ""
    rest = name[len(head):]
    for lead in LEADING_TYPE:
        if rest.startswith(lead):
            rest = rest[len(lead):]
            break
    return " ".join((head + rest).split())


def query_for(h: dict) -> str:
    name = clean_name(h.get("name_th"))
    if not name.startswith(HAS_FACILITY_WORD):
        name = "โรงพยาบาล" + name
    return f"{name} {h['province_th']}"


def main(limit: int) -> int:
    reg = json.loads(REGISTRY.read_text(encoding="utf-8"))
    rows = reg["hospitals"]

    # "No contact details" means no phone and no coordinates. The 111 rows that
    # have them came from Bangkok Metropolitan Administration open data and
    # need nothing.
    missing = [h for h in rows if not h.get("tel") and not h.get("lat")]
    rank = {t: i for i, t in enumerate(PRIORITY)}
    wanted = [h for h in missing if h.get("type_en") in rank]
    wanted.sort(key=lambda h: (rank[h["type_en"]], h["province_en"], h["name_th"]))
    wanted = wanted[:limit]

    targets = [
        {
            "hcode": h["hcode"],
            "q": query_for(h),
            "name_th": h["name_th"],
            "province_en": h["province_en"],
            "province_th": h["province_th"],
            "province_slug": h["province_slug"],
            "type_en": h.get("type_en"),
            "sector": h["sector"],
        }
        for h in wanted
    ]

    payload = {
        # Deduplicated: two hcodes can clean down to one query (14534 and
        # 00024 are both Thonburi Chumphon, the second filed as its
        # children's unit). One place answers both, and the targets file
        # keeps every hcode against its query so the merge can fill both
        # register rows from it.
        "searchStringsArray": sorted({t["q"] for t in targets}),
        # One place per term. The query names a specific hospital; anything
        # below the first result is a different hospital, and paying for it
        # would only give the merge more wrong answers to reject.
        "maxCrawledPlacesPerSearch": 1,
        "language": "th",
        "countryCode": "th",
        "maxReviews": 0,
        "maxImages": 0,
        "maxQuestions": 0,
        "scrapePlaceDetailPage": True,
        "skipClosedPlaces": False,
    }

    (ROOT / "apify_input_registry.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")
    (ROOT / "registry" / "registry_apify_targets.json").write_text(
        json.dumps(targets, ensure_ascii=False, indent=1), encoding="utf-8")

    print(f"register {len(rows)}; without contact details {len(missing)}")
    print(f"asked for {len(targets)} ({limit} requested)\n")
    counts: dict[str, int] = {}
    for t in targets:
        counts[t["type_en"]] = counts.get(t["type_en"], 0) + 1
    for t in PRIORITY:
        if t in counts:
            print(f"  {t:<42} {counts[t]}")
    print("\nfirst five queries:")
    for t in targets[:5]:
        print(f"  {t['q']}")
    print("\nstill uncovered after this run:")
    left: dict[str, int] = {}
    for h in missing:
        if h not in wanted:
            k = h.get("type_en") or h.get("type_th") or "?"
            left[k] = left.get(k, 0) + 1
    for k, v in sorted(left.items(), key=lambda kv: -kv[1])[:6]:
        print(f"  {k:<42} {v}")
    return 0


if __name__ == "__main__":
    n = 458
    if "--limit" in sys.argv:
        n = int(sys.argv[sys.argv.index("--limit") + 1])
    sys.exit(main(n))
