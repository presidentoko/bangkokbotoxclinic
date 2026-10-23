"""Attach สบส. health-establishment licences to chillanel places.

Input:  data/spa_licenses/hss_11_27.csv   (gdcatalog.go.th dataset gdpublish-hss_11_27,
                                          "รายการสถานประกอบการเพื่อสุขภาพที่ได้รับอนุญาต")
        chillanel/data/clinics.<city>.json
Output: chillanel/data/spa-licenses.json   {place_id: licence}

Same rules as bangkok_clinics/match_hss.py (dental): matching across the
Thai register and Google's mostly-English shop names is where a directory starts
inventing things, so only an unambiguous match is kept.

1. Take the Thai part of the Google name and the register's ShopName, and drop
   the generic words every massage shop shares (นวด, สปา, เพื่อสุขภาพ ...).
   What is left must be at least four Thai characters and equal on both sides.
2. The register row must be in a province the city could be in.
3. Exactly one register row may match, and no other place in the same city may
   reduce to the same key (two branches of one chain would both claim it).
4. Branch markers must agree: a "สาขา"/numbered shop never takes the licence
   of an unmarked shop of the same name.

A place with no match is never described as unlicensed — most Google names are
English and cannot be compared at all.
"""

from __future__ import annotations

import csv
import json
import re
import sys
from collections import defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REGISTER = ROOT / "data" / "spa_licenses" / "hss_11_27.csv"
CHILLANEL_DATA = ROOT / "chillanel" / "data"
OUT = CHILLANEL_DATA / "spa-licenses.json"
SOURCE_URL = "https://gdcatalog.go.th/dataset/gdpublish-hss_11_27"
REGISTER_AS_OF = "2024-04"  # the dataset's last resource update

CITY_PROVINCES = {
    "bangkok": {"กรุงเทพมหานคร", "นนทบุรี", "สมุทรปราการ", "ปทุมธานี"},
    "pattaya": {"ชลบุรี"},
    "phuket": {"ภูเก็ต"},
    "chiang_mai": {"เชียงใหม่"},
    "koh_samui": {"สุราษฎร์ธานี"},
    "hua_hin": {"ประจวบคีรีขันธ์", "เพชรบุรี"},
    "krabi": {"กระบี่"},
}

# Longest first so "นวดเพื่อสุขภาพ" goes before "นวด".
GENERIC = sorted([
    "นวดเพื่อเสริมความงาม", "นวดเพื่อสุขภาพ", "นวดแผนไทย", "เพื่อสุขภาพ", "นวดไทย",
    "แผนไทย", "ร้านนวด", "ร้าน", "นวด", "สปา", "และ", "แอนด์", "เดย์", "บิวตี้",
    "ความงาม", "สาขา", "บริษัท", "จำกัด", "ห้างหุ้นส่วน", "เฮลท์", "มาสสาจ", "มาสซาจ",
], key=len, reverse=True)

SERVICE_TYPES = {"นวด": "massage", "สปา": "spa"}


def name_key(name: str) -> str:
    thai = "".join(re.findall(r"[฀-๿]+", name))
    for g in GENERIC:
        thai = thai.replace(g, "")
    return thai


def is_branch(name: str) -> bool:
    return bool(re.search(r"สาขา|branch|[A-Za-z฀-๿]\d\b|\(\s*\d+\s*\)", name, re.I))


def main() -> int:
    register: dict[tuple[str, str], list[dict]] = defaultdict(list)
    with open(REGISTER, encoding="utf-8-sig", newline="") as f:
        for row in csv.DictReader(f):
            if row["ServiceType"] in SERVICE_TYPES:
                register[(row["Province"], name_key(row["ShopName"]))].append(row)

    licences: dict[str, dict] = {}
    report: dict[str, dict[str, int]] = {}
    for city, provinces in CITY_PROVINCES.items():
        path = CHILLANEL_DATA / f"clinics.{city}.json"
        if not path.exists():
            continue
        places = json.loads(path.read_text(encoding="utf-8"))
        places = places["places"] if isinstance(places, dict) else places
        keys = {p["id"]: name_key(p["name"]) for p in places}
        key_count: dict[str, int] = defaultdict(int)
        for k in keys.values():
            key_count[k] += 1
        stats = {"places": len(places), "thai_key": 0, "matched": 0, "ambiguous": 0}
        for p in places:
            k = keys[p["id"]]
            if len(k) < 4:
                continue
            stats["thai_key"] += 1
            hits = [r for prov in provinces for r in register.get((prov, k), [])]
            if len(hits) != 1 or key_count[k] != 1:
                if hits:
                    stats["ambiguous"] += 1
                continue
            r = hits[0]
            # 4. A branch ("สาขา 2", "Thapae2") must not inherit the licence of an
            #    unmarked shop of the same name — each branch is licensed separately.
            if is_branch(p["name"]) != is_branch(r["ShopName"]):
                stats["ambiguous"] += 1
                continue
            licences[p["id"]] = {
                "license_no": r["CertificateCode"],
                "registered_name": r["ShopName"],
                "service_type": SERVICE_TYPES[r["ServiceType"]],
                "province": r["Province"],
            }
            stats["matched"] += 1
        report[city] = stats

    OUT.write_text(json.dumps({
        "source": SOURCE_URL,
        "publisher": "Department of Health Service Support, Ministry of Public Health (กรมสนับสนุนบริการสุขภาพ)",
        "register_as_of": REGISTER_AS_OF,
        "retrieved": date.today().isoformat(),
        "licenses": licences,
    }, ensure_ascii=False, indent=1), encoding="utf-8")
    sys.stdout.reconfigure(encoding="utf-8")
    for city, s in report.items():
        print(f"{city:11s} {s}")
    print(f"total {len(licences)} → {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
