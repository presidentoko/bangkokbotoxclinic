#!/usr/bin/env python3
"""Build web/data/registry.json — every hospital on Thailand's official register.

Two public sources, both downloaded 2026-09-03 and kept in ./registry/ so the
build is reproducible without a network call:

  registry/ha.csv        Healthcare Accreditation Institute (Public Organisation),
                         สรพ. — https://data.ha.or.th/dataset/ebc2438a-4597-46e1-9e03-335b01c60981
                         1,491 hospitals with their MoPH hospital code, sector,
                         hospital type, and HA accreditation level + expiry.

  registry/priv_hos.csv  Bangkok Metropolitan Administration, private hospitals
                         licensed for inpatient stays —
                         https://data.bangkok.go.th/dataset/406e8d14-1fca-472a-9ee4-634d9cf073ed
                         129 rows keyed on the same hospital code, adding bed
                         count, phone, website and coordinates.

Why this matters: the site listed 321 businesses scraped from Google Maps, a
third of which are salons and labs, and it had no way to say whether any of
them is a licensed hospital. These files are the register itself. Every claim
they support is attributable — hospital code, accreditation level, the date it
was granted and the date it lapses.
"""
from __future__ import annotations

import csv
import io
import json
import re
from datetime import date
from pathlib import Path

HERE = Path(__file__).resolve().parent
REG = HERE / "registry"
OUT = HERE / "web" / "data" / "registry.json"

SOURCES = [
    {
        "name": "Healthcare Accreditation Institute (Public Organisation), Thailand",
        "name_th": "สถาบันรับรองคุณภาพสถานพยาบาล (องค์การมหาชน)",
        "url": "https://data.ha.or.th/dataset/ebc2438a-4597-46e1-9e03-335b01c60981",
        "file": "ha.csv",
        "downloaded": "2026-09-03",
        "provides": "hospital code, sector, hospital type, HA accreditation level and expiry",
    },
    {
        "name": "Bangkok Metropolitan Administration — private hospitals with inpatient beds",
        "name_th": "กรุงเทพมหานคร — ที่ตั้งโรงพยาบาลเอกชนที่รับผู้ป่วยค้างคืน",
        "url": "https://data.bangkok.go.th/dataset/406e8d14-1fca-472a-9ee4-634d9cf073ed",
        "file": "priv_hos.csv",
        "downloaded": "2026-09-03",
        "provides": "bed count, telephone, website, coordinates for Bangkok private hospitals",
    },
]

# 77 provinces. Slugs match the /city/[city] convention already in use
# (lowercase, hyphenated) so a province page can link straight to a city page
# where one exists.
PROVINCES: dict[str, str] = {
    "กรุงเทพมหานคร": "Bangkok",
    "กระบี่": "Krabi",
    "กาญจนบุรี": "Kanchanaburi",
    "กาฬสินธุ์": "Kalasin",
    "กำแพงเพชร": "Kamphaeng Phet",
    "ขอนแก่น": "Khon Kaen",
    "จันทบุรี": "Chanthaburi",
    "ฉะเชิงเทรา": "Chachoengsao",
    "ชลบุรี": "Chon Buri",
    "ชัยนาท": "Chai Nat",
    "ชัยภูมิ": "Chaiyaphum",
    "ชุมพร": "Chumphon",
    "เชียงราย": "Chiang Rai",
    "เชียงใหม่": "Chiang Mai",
    "ตรัง": "Trang",
    "ตราด": "Trat",
    "ตาก": "Tak",
    "นครนายก": "Nakhon Nayok",
    "นครปฐม": "Nakhon Pathom",
    "นครพนม": "Nakhon Phanom",
    "นครราชสีมา": "Nakhon Ratchasima",
    "นครศรีธรรมราช": "Nakhon Si Thammarat",
    "นครสวรรค์": "Nakhon Sawan",
    "นนทบุรี": "Nonthaburi",
    "นราธิวาส": "Narathiwat",
    "น่าน": "Nan",
    "บึงกาฬ": "Bueng Kan",
    "บุรีรัมย์": "Buri Ram",
    "ปทุมธานี": "Pathum Thani",
    "ประจวบคีรีขันธ์": "Prachuap Khiri Khan",
    "ปราจีนบุรี": "Prachin Buri",
    "ปัตตานี": "Pattani",
    "พระนครศรีอยุธยา": "Phra Nakhon Si Ayutthaya",
    "พะเยา": "Phayao",
    "พังงา": "Phang Nga",
    "พัทลุง": "Phatthalung",
    "พิจิตร": "Phichit",
    "พิษณุโลก": "Phitsanulok",
    "เพชรบุรี": "Phetchaburi",
    "เพชรบูรณ์": "Phetchabun",
    "แพร่": "Phrae",
    "ภูเก็ต": "Phuket",
    "มหาสารคาม": "Maha Sarakham",
    "มุกดาหาร": "Mukdahan",
    "แม่ฮ่องสอน": "Mae Hong Son",
    "ยโสธร": "Yasothon",
    "ยะลา": "Yala",
    "ร้อยเอ็ด": "Roi Et",
    "ระนอง": "Ranong",
    "ระยอง": "Rayong",
    "ราชบุรี": "Ratchaburi",
    "ลพบุรี": "Lop Buri",
    "ลำปาง": "Lampang",
    "ลำพูน": "Lamphun",
    "เลย": "Loei",
    "ศรีสะเกษ": "Si Sa Ket",
    "สกลนคร": "Sakon Nakhon",
    "สงขลา": "Songkhla",
    "สตูล": "Satun",
    "สมุทรปราการ": "Samut Prakan",
    "สมุทรสงคราม": "Samut Songkhram",
    "สมุทรสาคร": "Samut Sakhon",
    "สระแก้ว": "Sa Kaeo",
    "สระบุรี": "Saraburi",
    "สิงห์บุรี": "Sing Buri",
    "สุโขทัย": "Sukhothai",
    "สุพรรณบุรี": "Suphan Buri",
    "สุราษฎร์ธานี": "Surat Thani",
    "สุรินทร์": "Surin",
    "หนองคาย": "Nong Khai",
    "หนองบัวลำภู": "Nong Bua Lam Phu",
    "อ่างทอง": "Ang Thong",
    "อำนาจเจริญ": "Amnat Charoen",
    "อุดรธานี": "Udon Thani",
    "อุตรดิตถ์": "Uttaradit",
    "อุทัยธานี": "Uthai Thani",
    "อุบลราชธานี": "Ubon Ratchathani",
}

SECTOR = {
    "เอกชน": "private",
    "รัฐในสังกัดสป.สธ.": "public",
    "รัฐในสังกัด สธ.": "public",
    "กระทรวงกลาโหม": "military",
    "สนง.ตำรวจแห่งชาติ": "police",
    "กรุงเทพมหานคร (สังกัด กทม.)": "public",
    "องค์กรปกครองส่วนท้องถิ่น": "public",
    "สภากาชาดไทย": "red-cross",
    "มูลนิธิ": "foundation",
}

TYPE_EN = {
    "รพช.": "Community hospital",
    "รพท.": "General hospital",
    "รพศ.": "Regional hospital",
    "เอกชน": "Private hospital",
    "สมาคมโรงพยาบาลเอกชน": "Private hospital",
    "โรงเรียนแพทย์": "University teaching hospital",
    "กรมการแพทย์": "Department of Medical Services hospital",
    "กรมสุขภาพจิต": "Psychiatric hospital",
    "กรมแพทย์ทหารบก": "Army hospital",
    "กรมแพทย์ทหารอากาศ": "Air Force hospital",
    "กรมแพทย์ทหารเรือ": "Navy hospital",
    "กรมอนามัย": "Health promotion hospital",
    "กรมควบคุมโรค": "Disease control hospital",
}

# HA has five published levels plus several "in progress" states. Anything that
# is not a granted level is reported as its own status rather than folded into
# "accredited" — the whole point of showing it is that it is checkable.
HA_LEVEL = {
    "ขั้นมาตรฐาน": ("standard", "Accredited (HA standard)"),
    "ขั้นก้าวหน้า": ("advanced", "Advanced HA"),
    "ขั้นพัฒนา ขั้นที่ 1": ("step1", "Step 1 (developing)"),
    "ขั้นพัฒนา ขั้นที่ 2": ("step2", "Step 2 (developing)"),
    "ไม่มีขั้น": ("none", "On the register, not yet accredited"),
    "อยู่ระหว่างกระบวนการต่ออายุ": ("renewing", "Renewal in progress"),
    "อยู่ระหว่างกระบวนการขั้นพัฒนา": ("in-progress", "Development in progress"),
    "อยู่ระหว่างกระบวนการขอรับรอง": ("in-progress", "Accreditation in progress"),
    "อยู่ระหว่างกระบวนการขอรับรองขั้นก้าวหน้า": ("in-progress", "Advanced accreditation in progress"),
}

# Size qualifiers the register appends to a name ("เกษมราษฎร์ แม่สาย โรงพยาบาล
# ทั่วไปขนาดเล็ก" = "...small general hospital"). They are a type, not part of
# the name, and they wreck name matching.
SIZE_QUALIFIER = re.compile(
    r"(โรงพยาบาล)?(ทั่วไป|เฉพาะทาง)?ขนาด(เล็ก|กลาง|ใหญ่)"
)


def read_csv(path: Path) -> list[dict]:
    raw = path.read_bytes()
    for enc in ("utf-8-sig", "cp874", "utf-8"):
        try:
            return list(csv.DictReader(io.StringIO(raw.decode(enc))))
        except UnicodeDecodeError:
            continue
    raise SystemExit(f"cannot decode {path}")


def slugify(en: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", en.lower()).strip("-")


def clean_name(th: str) -> str:
    th = SIZE_QUALIFIER.sub("", (th or "").strip())
    return re.sub(r"\s+", " ", th).strip()


def parse_date(s: str) -> str | None:
    s = (s or "").strip()
    return s if re.fullmatch(r"\d{4}-\d{2}-\d{2}", s) else None


def main() -> int:
    ha = read_csv(REG / "ha.csv")
    bkk = read_csv(REG / "priv_hos.csv")

    beds_by_code: dict[str, dict] = {}
    for r in bkk:
        code = (r.get("id_hos") or "").strip()
        if not code:
            continue
        beds_by_code[code] = {
            "beds": int(r["num_bed"]) if (r.get("num_bed") or "").strip().isdigit() else None,
            "tel": (r.get("tel") or "").strip() or None,
            "website": (r.get("url") or "").strip() or None,
            "lat": float(r["lat"]) if (r.get("lat") or "").strip() else None,
            "lng": float(r["lng"]) if (r.get("lng") or "").strip() else None,
            "address_th": (r.get("address") or "").strip() or None,
            "district_th": (r.get("dname") or "").strip() or None,
            "name_th_bkk": (r.get("name") or "").strip() or None,
        }

    today = date.today().isoformat()
    out: list[dict] = []
    unknown_provinces: set[str] = set()

    for r in ha:
        province_th = (r.get("จังหวัด") or "").strip()
        province_en = PROVINCES.get(province_th)
        if not province_en:
            unknown_provinces.add(province_th)
            continue
        code = (r.get("H Code") or "").strip()
        raw_name = (r.get("โรงพยาบาล") or "").strip()
        level_th = (r.get("ขั้นเผยแพร่") or "").strip()
        level, level_en = HA_LEVEL.get(level_th, ("unknown", level_th or "Unknown"))
        expires = parse_date(r.get("วันหมดอายุ HA", ""))
        extra = beds_by_code.get(code, {})
        out.append(
            {
                "hcode": code or None,
                "name_th": clean_name(raw_name),
                "province_th": province_th,
                "province_en": province_en,
                "province_slug": slugify(province_en),
                "region": (r.get("เขต") or "").strip() or None,
                "sector": SECTOR.get((r.get("สังกัด") or "").strip(), "public"),
                "affiliation_th": (r.get("สังกัด") or "").strip() or None,
                "type_th": (r.get("ชนิดรพ") or "").strip() or None,
                "type_en": TYPE_EN.get((r.get("ชนิดรพ") or "").strip()),
                "ha_level": level,
                "ha_level_en": level_en,
                "ha_level_th": level_th or None,
                "ha_accredited_on": parse_date(r.get("วันรับรอง HA", "")),
                "ha_expires_on": expires,
                # Stated rather than inferred: an expiry in the past means the
                # certificate lapsed, which is a fact worth showing, not a
                # reason to hide the row.
                "ha_current": (expires is not None and expires >= today) if expires else None,
                "beds": extra.get("beds"),
                "tel": extra.get("tel"),
                "website": extra.get("website"),
                "lat": extra.get("lat"),
                "lng": extra.get("lng"),
                "address_th": extra.get("address_th"),
                "district_th": extra.get("district_th"),
            }
        )

    if unknown_provinces:
        print(f"[registry] unmapped provinces: {sorted(unknown_provinces)}")

    by_province: dict[str, int] = {}
    for h in out:
        by_province[h["province_slug"]] = by_province.get(h["province_slug"], 0) + 1

    payload = {
        "generated_at": today,
        "sources": SOURCES,
        "total": len(out),
        "provinces": sorted(
            (
                {
                    "slug": slugify(en),
                    "name_en": en,
                    "name_th": th,
                    "count": by_province.get(slugify(en), 0),
                }
                for th, en in PROVINCES.items()
            ),
            key=lambda p: -p["count"],
        ),
        "hospitals": sorted(out, key=lambda h: (h["province_en"], h["name_th"])),
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")

    accredited = sum(1 for h in out if h["ha_level"] in ("standard", "advanced"))
    with_beds = sum(1 for h in out if h["beds"])
    print(
        f"[registry] {len(out)} hospitals · {len(payload['provinces'])} provinces · "
        f"{accredited} HA-accredited · {with_beds} with a bed count · "
        f"{sum(1 for h in out if h['sector'] == 'private')} private"
    )
    print(f"[registry] wrote {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
