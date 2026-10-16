"""Decide which directory entries are actually veterinary facilities.

The clinic list came from Google Maps grid scans, and a grid scan returns
whatever sits near the probe point. Reading the 980 records by name turns up
human hospitals (โรงพยาบาลดีบุก, โรงพยาบาลถลาง, sub-district health-promoting
hospitals), a Makro, a Lotus, two massage shops, several tourist hotels, a
petrol station, a school, a locksmith, a hotpot restaurant, an astronomy park
and two elephant sanctuaries — plus pet businesses that are real but are not
clinics: groomers, pet shops, cat hotels, a Café Amazon branch that happens to
sit inside a vet hospital.

A directory of 980 "animal hospitals" where a tenth are not animal hospitals is
both useless to a reader and exactly the shape a search engine's quality systems
penalise. This writes `web-petbkk/data/hospital-excluded.json` ({id: reason}),
which the site uses to drop them from every page, list and sitemap entry.

Order of decisions, most confident first:

1. A DLD licence match is proof. Keep.
2. A veterinary word in the name (สัตวแพทย์, รักษาสัตว์, โรงพยาบาลสัตว์, animal
   hospital, vet…) is strong evidence, as is the word *clinic* standing next to
   an animal word (คลินิกหมาแมว, pet clinic). Bare คลินิก is not: it is the
   word clinic in any field of medicine. Keep — unless the name also says the
   entry is a *branch of something else* located at a vet hospital
   ("Café Amazon สาขารพ.สัตว์…", "Ship smile สาขารพ.สัตว์…").
3. Otherwise, drop on an explicit category pattern (human hospital, hotel,
   grooming, pet shop, restaurant, retail, government office …).
4. Anything left is kept. A false keep costs one thin page; a false drop
   deletes a real clinic's page.

Run:  python -m petvet.classify_directory [--report]
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

WEB = Path(__file__).resolve().parent.parent / "web-petbkk" / "data"

VET = re.compile(
    "|".join([
        "สัตวแพทย", "สัตว์แพทย", "รักษาสัตว์", "รักษ์สัตว์",
        "โรงพยาบาลสัตว", "รพ.?\\s*สัตว์", "รพส", "สถานพยาบาลสัตว", "ปศุสัตว์", "ทำหมัน",
        "ศูนย์โรคแมว", "ศูนย์สุขภาพสัตว", "ศูนย์พยาบาลสัตว", "ศูนย์บริการสุขภาพสัตว",
        "animal hospital", "animal clinic", "pet clinic", "pet hospital", "vet clinic",
        "veterinar", "animal care", "animal health", "pet wellness", "pet health",
        r"\bvet\b", "宠物医院",
    ]),
    re.I,
)

# "คลินิก" is just the word *clinic*, in any field of medicine, and on its own
# it used to be enough to keep a record (2026-10-16). That published a Phuket
# medical-technology lab with 3,867 reviews, a Chiang Mai orthopaedic surgery
# and a food court on level 2 of a human medical centre's car park as
# veterinary hospitals. It is evidence only next to an animal word — which the
# real vet clinics carry anyway, since every one of them says whose clinic it
# is: คลินิกรักษาสัตว์, คลินิกหมาแมว, pet clinic.
#
# Note this is only reached when a DLD licence match has already said no: a
# licensed animal clinic named nothing but "คลีนิกไตรขวัญ" is still kept, on
# the register's word rather than on its name.
CLINIC_WORD = re.compile("คลินิก|คลีนิก|คลินิค|clinic", re.I)
ANIMAL_WORD = re.compile(
    "|".join([
        "สัตว", "หมา(?!ล่า)", "แมว", "สุนัข", "เพ็ท", "เพ็ต", "นก", "กระต่าย",
        r"\bpets?\b", r"\bdogs?\b", r"\bcats?\b", "animal", "veterinar", r"\bvet\b", "宠物",
    ]),
    re.I,
)

# A business that merely *sits inside* a vet hospital is not one.
BRANCH_OF_OTHER = re.compile(r"(สาขา\s*(รพ\.?\s*สัตว์|โรงพยาบาลสัตว์))|(café|cafe|amazon|ship smile|kamu)", re.I)

DROP_PATTERNS: list[tuple[str, str]] = [
    # Human healthcare picked up by the grid scan.
    (r"โรงพยาบาลส่งเสริมสุขภาพ|สถานีอนามัย|อนามัยใน|health promoting hospital|ศูนย์บริการสาธารณสุข|"
     r"โรงพยาบาลตำรวจ|โรงพยาบาลเมืองพัทยา|โรงพยาบาลจอมเทียน|โรงพยาบาลสัตหีบ|โรงพยาบาลถลาง|"
     r"โรงพยาบาลดีบุก|โรงพยาบาลหางดง|thai polo hospital|สถาบันวิจัยวิทยาศาสตร์สุขภาพ|"
     r"ศูนย์ประกันสุขภาพ|การแพทย์สยาม|medhealthme|medical facility|"
     # Human specialities, from the records the bare-คลินิก keep used to pass:
     # a medical-technology lab (blood work for people) and an orthopaedic
     # surgery. เเพทย์ is a real typo in one listing — two เ for แ — so the
     # vowel is matched loosely here.
     r"เทคนิคการ[เแ]+พทย์|กระดูกและข้อ", "human healthcare"),
    # Lodging, food, retail, services.
    (r"โรงแรม|hotel|hostel|lodge|resort|อพาร์ทเมนท์|apartment|homestay|โฮมสเตย์", "lodging"),
    (r"คาเฟ่|cafe|café|amazon|ร้านอาหาร|shabu|หมาล่า|โอเด้ง|bakery|ครัว|restaurant|massage|นวด|"
     r"แม็คโคร|makro|โลตัส|lotus|ปตท|ptt station|จักรยาน|กุญแจ|ประปา|ship smile|kamu|"
     # A food court on level 2 of a human medical centre's car park, kept until
     # 2026-10-16 because its listing name contains the word คลินิก.
     r"ฟู้ดเวิลด์|food ?world|ศูนย์อาหาร|food court", "not a pet business"),
    (r"โรงเรียน|school|มหาวิทยาลัย(?!.*สัตว)|อุทยาน|พิพิธภัณฑ์|elephant|ช้าง(?!.*สัตวแพทย)|"
     r"foundation(?!.*vet)|nature reserve", "not a pet business"),
    # Pet businesses that are not clinics.
    (r"เพ็ทช็อป|เพ็ทชอป|pet ?shop|petshop|pet lovers|pet supplies|อาหารสัตว์|ขายอาหารสัตว์|"
     r"ร้านสินค้าสัตว์เลี้ยง|pet market|pet supply|ซัพพลาย|kingkongpet|petstopia|pet world|pet inn|"
     r"เพ็ทเวิลด์|แฮมสเตอร์|pet club|petclub", "pet retail"),
    (r"อาบน้ำ|ตัดขน|grooming|groom|salon|สปา(?!.*สัตวแพทย)|pet hotel|cat hotel|dog hotel|"
     r"โรงแรมแมว|โรงแรมหมา|โรงแรมสัตว์|รับฝาก|pet cremat|เผาสัตว์|training center|dog secret", "grooming / boarding"),
    # Administrative offices and defunct entries.
    (r"สำนักอนามัย|กองควบคุมโรค|สำนักควบคุม|สำนักงานปศุสัตว์|องค์กรพิทักษ์สัตว์|อาคารเฉลิมพระเกียรติ|"
     r"บริษัท\s*พร|housing|เจริญสินธานี|ปิดถาวร|permanently closed", "office / closed"),
]


# Read one by one: names a pattern cannot judge, but a person can.
MANUAL_DROPS = {
    "na": "no name on the listing",
    "tropical-beautybar": "beauty salon",
    "trail-and-tail": "dog-friendly cafe, not a clinic",
    "good-roots-rama-9": "shop inside a vet hospital",
    "รานเฮงดเพดชอปสวนจตจกร": "pet retail",
    "รานหลงมอยาสตว": "animal-medicine shop",
    "รานหมา": "pet retail",
    "บรษท-ยนเพสท-จำกด-เชยงใหม-unipest-chiang-mai": "pest control company",
    # Same business listed twice on the map. Both are 15 m or less from the
    # listing that keeps the reviews, and both are the copy with none.
    "芭提雅通罗宠物医院": "duplicate listing (Chinese name) of Thonglor Pet Hospital Pattaya",
    "โรงพยาบาลสตวหมาแมวสนปาตอง-2": "duplicate listing of โรงพยาบาลสัตว์หมาแมวสันป่าตอง",
}

# Where a dropped entry is a duplicate, its URL belongs on the surviving clinic
# page rather than on the city list.
DUPLICATE_OF = {
    "芭提雅通罗宠物医院": "thonglor-pet-hospital-2",
    "โรงพยาบาลสตวหมาแมวสนปาตอง-2": "rong-phayaban-sat-hmamaewsanpatong",
}


def classify(h: dict, licensed: bool) -> str | None:
    """Reason to exclude, or None to keep."""
    name = f"{h.get('name_th') or ''} {h.get('name_en') or ''}".strip()
    if h["id"] in MANUAL_DROPS:
        return MANUAL_DROPS[h["id"]]
    if licensed:
        return None
    veterinary_name = VET.search(name) or (CLINIC_WORD.search(name) and ANIMAL_WORD.search(name))
    if veterinary_name and not BRANCH_OF_OTHER.search(name):
        return None
    for pattern, reason in DROP_PATTERNS:
        if re.search(pattern, name, re.I):
            return reason
    if BRANCH_OF_OTHER.search(name):
        return "branch of another business inside a clinic"
    return None


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--report", action="store_true")
    args = ap.parse_args()

    hospitals = json.loads((WEB / "hospitals.json").read_text(encoding="utf-8"))
    licences = json.loads((WEB / "hospital-licenses.json").read_text(encoding="utf-8"))["licenses"]

    excluded: dict[str, str] = {}
    for h in hospitals:
        reason = classify(h, h["id"] in licences)
        if reason:
            excluded[h["id"]] = reason

    (WEB / "hospital-excluded.json").write_text(
        json.dumps({
            "note": "Directory entries that are not veterinary facilities. See petvet/classify_directory.py.",
            "excluded": dict(sorted(excluded.items())),
            "duplicate_of": DUPLICATE_OF,
        }, ensure_ascii=False, indent=1),
        encoding="utf-8",
    )

    by_reason: dict[str, int] = {}
    for r in excluded.values():
        by_reason[r] = by_reason.get(r, 0) + 1
    print(f"excluded {len(excluded)} of {len(hospitals)}")
    for r, n in sorted(by_reason.items(), key=lambda x: -x[1]):
        print(f"  {n:4d}  {r}")
    if args.report:
        names = {h["id"]: (h.get("name_th") or h.get("name_en") or "", h.get("city"), h.get("google_review_count")) for h in hospitals}
        for hid, r in sorted(excluded.items(), key=lambda x: x[1]):
            n, city, rev = names[hid]
            print(f"  DROP [{r:<34}] {n[:48]:<50} {city} rev={rev}")


if __name__ == "__main__":
    main()
