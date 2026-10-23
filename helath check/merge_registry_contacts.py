"""Give the national directory an address and a phone number for each hospital.

registry.json carries all 1,491 hospitals on Thailand's register and, for
1,380 of them, no address, no phone, no coordinates and no website. That is
what /directory/<province> publishes: a reader who searches "hospitals in
Krabi" learns which are accredited and cannot call or find one of them.

This merges one Apify `crawler-google-places` run — 456 Thai queries built by
build_registry_apify_input.py, one place each, no reviews, no images — into
those rows.

## What decides a match

The address decides, and the name confirms it. That order, because the run
makes the point for itself: of 456 queries, 450 came back in the province the
register names, and reading the six that did not shows four hospitals that are
simply other hospitals — asked for Nakharin in Nakhon Si Thammarat it returned
Nam Phong in Khon Kaen, for Chonburi it returned Ko Sichang in Phetchabun, for
Fang in Chiang Mai it returned Ban Fang in Khon Kaen, and for CHG's Samut
Prakan geriatric licence it returned CGH Phahon Yothin in Bangkok. Two were
false alarms where Google writes the province in Latin.

The name test has to be loose in one direction and strict in the other, which
took reading all 72 rows a tight version rejected:

  * The register's name is usually the bare one. It files Benjarom Hospital as
    "เบญจรมย์" while Google says "Benjarom Hospital โรงพยาบาลเบญจรมย์";
    Chaiyaphum Ruamphaet is now "ชัยภูมิรวมแพทย์มัตสุบายาชิ"; Wirachsilp was
    bought and is "พริ้นซ์ วิรัชศิลป์". A length ratio throws all of these
    away, so containment is allowed at any ratio.
  * What containment cannot be allowed to do is match a short name inside a
    longer different one — "ฝาง" sits inside "บ้านฝาง" and "ชลบุรี" inside
    "เกาะสีชังชลบุรี", which is the Thai substring trap, no spaces to stop it.
    Both are rejected here by the province, and a four-character floor keeps
    the shortest names from relying on containment at all.
  * Google's category settles the rest. The register lists hospitals, so a
    record filed as a clinic, a department inside a hospital, a university
    faculty or a building is not the hospital we asked for: that is how
    Hat Yai came back as an emergency-medicine department and Ruamphaet Nong
    Khai as a general-practice clinic.

Nothing is overwritten. Every field written was empty before.

    python merge_registry_contacts.py <dataset.json> [--apply]
"""
from __future__ import annotations

import json
import re
import sys
from difflib import SequenceMatcher
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REGISTRY = ROOT / "web" / "data" / "registry.json"
TARGETS = ROOT / "registry" / "registry_apify_targets.json"

# Google categories that are not the hospital, whatever the name says.
NOT_A_HOSPITAL = (
    "คลินิก",          # clinic
    "แผนก",            # department within a hospital
    "ภาควิชา",         # academic department
    "อาคาร",           # building
    "สถาบันการศึกษา",  # educational institution
    "สถานที่ราชการ",   # government office
    "ร้าน",            # shop
    "สัตว",            # veterinary — none in this run, kept as a standing guard
)

# Words at the front of a name that say what kind of place it is rather than
# which one. Stripped from both sides before comparing.
FACILITY_PREFIX = (
    "โรงพยาบาลส่งเสริมสุขภาพ", "โรงพยาบาล", "รพ.", "รพ", "สถานพยาบาล",
    "ศูนย์การแพทย์", "สถาบัน", "ตึก",
)


def strip_latin(s: str) -> str:
    """Drop the Latin half of a bilingual title.

    Google gives many Thai hospitals both names in one string — "Thungsong
    Hospital โรงพยาบาลทุ่งสง", "โรงพยาบาลกรุงไทย Krungthai General Hospital".
    Comparing the whole string to a Thai-only register name scores it as a
    mismatch, so only the Thai is compared. A title with no Thai at all —
    "Pabhavej Hospital", "Hariphunchai Memorial Hospital Co., Ltd." — leaves
    nothing to compare and is handled by the caller.
    """
    return re.sub(r"[A-Za-z0-9&.,()'\"/-]+", " ", s or "")


def squash(s: str) -> str:
    """Thai letters only, no spaces: spelling without the spacing."""
    return re.sub(r"[^฀-๿]+", "", s or "")


def core(s: str) -> str:
    """A name with the facility word and any province tag removed."""
    out = squash(s)
    out = re.sub(r"จังหวัด.*$", "", out)
    for pre in FACILITY_PREFIX:
        p = squash(pre)
        if p and out.startswith(p):
            out = out[len(p):]
            break
    return out


def province_ok(target: dict, place: dict) -> bool:
    """Is the place in the province the register names?

    Accepts the Thai name or the Latin one — two addresses in this run spell
    it "Nakhonratchasima" and "Nakhon Si Thammarat" while the rest are Thai.
    """
    addr = place.get("address") or ""
    if target["province_th"] in addr:
        return True
    flat = re.sub(r"[^a-z]", "", addr.lower())
    return re.sub(r"[^a-z]", "", target["province_en"].lower()) in flat


def name_ok(target: dict, place: dict) -> tuple[bool, str]:
    """Same place? Returns (verdict, reason); the reason starts with "exact"
    when the two names are the same after stripping, which judge() uses."""
    ours = core(target["name_th"])
    theirs = core(strip_latin(place.get("title") or ""))
    if not theirs:
        # A Latin-only title. There is nothing to compare, so the province and
        # the category carry it alone — acceptable only because the query was
        # the register's own name plus its province, not a guess.
        return True, "Latin-only title; province and category only"
    if ours == theirs:
        return True, "exact"
    if len(ours) >= 4 and ours in theirs:
        return True, "register name inside the Google name"
    if len(theirs) >= 4 and theirs in ours:
        return True, "Google name inside the register name"
    # Same words, different order or extra ones between them: St Peter Eye
    # Hospital is "เซนต์ปีเตอร์ โรงพยาบาลเฉพาะทางตา" on the register and
    # "โรงพยาบาลตาเซนต์ปีเตอร์" on Google. Every word of ours of four or more
    # characters has to be in theirs; short words are too easy to find.
    words = [squash(w) for w in re.split(r"\s+", target["name_th"]) if len(squash(w)) >= 4]
    whole = squash(strip_latin(place.get("title") or ""))
    if words and all(w in whole for w in words):
        return True, "every word of the register name is in the Google name"
    ratio = SequenceMatcher(None, ours, theirs).ratio()
    if ratio >= 0.8:
        return True, f"name {ratio:.2f}"
    return False, f"name {ratio:.2f}: {target['name_th']!r} vs {place.get('title')!r}"


def judge(target: dict, place: dict) -> tuple[bool, str]:
    if place.get("permanentlyClosed"):
        return False, "Google says permanently closed"
    if not province_ok(target, place):
        return False, (f"address is not in {target['province_en']}: "
                       f"{(place.get('address') or '')[-46:]}")
    ok, why = name_ok(target, place)
    if not ok:
        return False, why
    # The category is the weakest field Google has. Trang Hospital is filed
    # as a building, the Institute of Dermatology as a school, the Institute
    # of Pathology as a government office — and in the English-language run
    # two provincial hospitals were "ATM". So when the name is exactly the
    # register's, or Google's own title calls the place a hospital, the
    # register's word stands. When the name only resembles ours, a category
    # that says clinic, department or building means Google returned a part
    # of something, or a neighbour, and that is not the hospital we asked for:
    # Hat Yai came back as an emergency-medicine department, Ruamphaet Nong
    # Khai as a general-practice clinic, Chersery Home as a different branch.
    cat = place.get("categoryName") or ""
    title = place.get("title") or ""
    if any(b in cat for b in NOT_A_HOSPITAL):
        if why == "exact" or title.startswith("โรงพยาบาล"):
            return True, f"{why}; register overrides category {cat!r}"
        return False, f"category is not a hospital: {cat}"
    return True, why


FIELDS = ("address_th", "tel", "website", "lat", "lng")


def fill(row: dict, place: dict) -> list[str]:
    """Write only what the register leaves empty."""
    loc = place.get("location") or {}
    new = {
        "address_th": place.get("address"),
        "tel": place.get("phone"),
        "website": place.get("website"),
        "lat": loc.get("lat"),
        "lng": loc.get("lng"),
    }
    done = []
    for key, value in new.items():
        if value not in (None, "") and not row.get(key):
            row[key] = value
            done.append(key)
    # Opening hours, the rating and the Google place are new columns for the
    # register; they are only ever added, never replaced.
    for key, value in (
        ("opening_hours", place.get("openingHours") or None),
        ("rating", place.get("totalScore")),
        ("review_count", place.get("reviewsCount")),
        ("google_place_id", place.get("placeId")),
        ("name_google", place.get("title")),
    ):
        if value not in (None, "", [], {}) and not row.get(key):
            row[key] = value
            done.append(key)
    return done


def main(dataset: str, apply: bool) -> int:
    places = json.loads(Path(dataset).read_text(encoding="utf-8"))
    targets = json.loads(TARGETS.read_text(encoding="utf-8"))
    reg = json.loads(REGISTRY.read_text(encoding="utf-8"))
    by_hcode = {h["hcode"]: h for h in reg["hospitals"]}

    by_query: dict[str, dict] = {}
    for p in places:
        by_query.setdefault(p.get("searchString"), p)

    filled: list[tuple[str, str, str]] = []
    rejected: list[tuple[str, str]] = []
    absent: list[str] = []
    for t in targets:
        row = by_hcode.get(t["hcode"])
        if row is None:
            continue
        place = by_query.get(t["q"])
        if place is None:
            absent.append(f"{t['name_th']} ({t['province_en']})")
            continue
        ok, why = judge(t, place)
        if not ok:
            rejected.append((f"{t['name_th']} ({t['province_en']})", why))
            continue
        done = fill(row, place)
        filled.append((t["name_th"], t["province_en"], ", ".join(done) or "nothing missing"))

    print(f"asked {len(targets)}  answered {len(targets) - len(absent)}  "
          f"accepted {len(filled)}  rejected {len(rejected)}\n")
    print(f"--- REJECTED {len(rejected)}")
    for name, why in rejected:
        print(f"  {name:<42} {why}")
    if absent:
        print(f"\n--- NO RESULT {len(absent)}")
        for a in absent:
            print(f"  {a}")

    have = sum(1 for h in reg["hospitals"] if h.get("tel") or h.get("lat"))
    print(f"\nregister rows with contact details: {have} of {len(reg['hospitals'])}")
    by_prov: dict[str, int] = {}
    for _n, prov, _f in filled:
        by_prov[prov] = by_prov.get(prov, 0) + 1
    print(f"provinces improved: {len(by_prov)}")
    for prov, n in sorted(by_prov.items(), key=lambda kv: -kv[1])[:10]:
        print(f"  {prov:<24} +{n}")

    if not apply:
        print("\n(dry run — pass --apply to write)")
        return 0

    REGISTRY.write_text(json.dumps(reg, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\nwrote {REGISTRY}")
    return 0


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    sys.exit(main(args[0], "--apply" in sys.argv))
