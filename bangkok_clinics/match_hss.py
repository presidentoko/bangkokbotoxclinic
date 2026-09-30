"""Attach สบส. licence records to the dental clinics on bangkokbestclinic.com.

Input:  bangkok_clinics/output/hss_registry_raw.json  (hss_registry.py)
        web/data/master_db.json
Output: web/data/clinic-licenses.json  {clinic_id: licence}

The two sides are written in different languages: the register is Thai
throughout, the directory keeps English district names off Google Maps. Matching
on place names across that gap is where a directory starts inventing things, so
the rules avoid it:

1. The search result must be unique, or uniquely identified by a branch word
   ("สาขา สีลม") present on both sides.
2. The distinctive part of the Thai name — what is left after removing
   คลินิก / ทันตกรรม / ศูนย์ and spacing — must be equal on both sides, or one
   must contain the other with at least four Thai characters.
3. The register's province must be one the clinic's city could be in. Greater
   Bangkok is allowed to span its neighbouring provinces, because the directory
   files Nonthaburi and Samut Prakan clinics under Bangkok.

Anything ambiguous is left unmatched and listed by --report. A clinic with no
match is never described as unlicensed: the register is searched by registered
name, which is frequently not the name on the shopfront.
"""

from __future__ import annotations

import argparse
import json
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = Path(__file__).resolve().parent / "output" / "hss_registry_raw.json"
MASTER_DB = ROOT / "web" / "data" / "master_db.json"
OUT = ROOT / "web" / "data" / "clinic-licenses.json"

DENTAL_TYPES = {
    "Dental clinic", "Dentist", "Orthodontist", "Pediatric dentist",
    "Dental school", "Dental implants periodontist", "Dental hygienist",
    "Oral surgeon",
}

# Which provinces a city's clinics may legitimately sit in. Greater Bangkok is
# one labour market and the directory files its neighbours under Bangkok.
CITY_PROVINCES = {
    "bangkok": {"กรุงเทพมหานคร", "นนทบุรี", "สมุทรปราการ", "ปทุมธานี", "นครปฐม", "สมุทรสาคร"},
    "chiang-mai": {"เชียงใหม่"},
    "pattaya": {"ชลบุรี"},
    "phuket": {"ภูเก็ต"},
    "koh-samui": {"สุราษฎร์ธานี"},
    "hua-hin": {"ประจวบคีรีขันธ์", "เพชรบุรี"},
    "krabi": {"กระบี่"},
}

# Province names are not distinguishing: "The Color Smile Dental Clinic ปทุมธานี"
# and "คลินิกทันตกรรม ปทุมธานีทันตแพทย์" share nothing but the province they are
# both in, and the first pass matched them on it.
PROVINCES = [
    "กรุงเทพมหานคร", "กรุงเทพฯ", "กรุงเทพ", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ", "สมุทรสาคร",
    "นครปฐม", "เชียงใหม่", "เชียงราย", "ชลบุรี", "ระยอง", "ภูเก็ต", "สุราษฎร์ธานี", "กระบี่",
    "ประจวบคีรีขันธ์", "เพชรบุรี", "ขอนแก่น", "นครราชสีมา", "อุดรธานี", "พัทยา", "หัวหิน", "สมุย",
]

GENERIC = sorted(
    ["คลินิกทันตกรรม", "ศูนย์ทันตกรรม", "ทันตกรรม", "คลินิก", "คลีนิก", "คลินิค",
     "ศูนย์", "จำกัด", "บริษัท", "สาขา", "ทันตแพทย์", "ทันตคลินิก", "เดนทัล", "เดนทอล"]
    + PROVINCES,
    key=len, reverse=True,
)

BRANCH = re.compile(r"สาขา\s*([^\s()\-–,]+)")
THAI_ONLY = re.compile(r"[^฀-๿0-9]")


def core(name: str) -> tuple[str, str]:
    s = name or ""
    b = BRANCH.search(s)
    branch = THAI_ONLY.sub("", b.group(1)) if b else ""
    s = BRANCH.sub(" ", s)
    s = re.sub(r"\([^)]*\)", " ", s)
    s = re.sub(r"[A-Za-z]+", " ", s)
    for g in GENERIC:
        s = s.replace(g, " ")
    return THAI_ONLY.sub("", s), branch


def thai_len(s: str) -> int:
    return len(re.sub(r"[^฀-๿]", "", s))


def province_of(address: str) -> str:
    m = re.search(r"จังหวัด\s*([^\s]+)", address or "")
    return m.group(1) if m else ""


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--report", action="store_true")
    args = ap.parse_args()

    raw = json.loads(RAW.read_text(encoding="utf-8")) if RAW.exists() else {}
    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    clinics = db["clinics"] if isinstance(db, dict) and "clinics" in db else db
    by_id = {c["id"]: c for c in clinics if c.get("primary_type") in DENTAL_TYPES}

    matched: dict[str, dict] = {}
    ties: list[tuple] = []
    for cid, entry in raw.items():
        clinic = by_id.get(cid)
        rows = entry.get("rows") or []
        if not clinic or not rows:
            continue

        allowed = CITY_PROVINCES.get(clinic.get("city_slug") or "", set())
        c_core, c_branch = core(clinic.get("name") or "")
        if thai_len(c_core) < 3:
            continue

        candidates = []
        for r in rows:
            if allowed and province_of(r["address"]) not in allowed:
                continue
            r_core, r_branch = core(r["name"])
            if thai_len(r_core) < 3:
                continue
            if c_branch and r_branch and c_branch != r_branch:
                continue
            if c_core == r_core:
                score = 3
            # Containment only counts as a prefix. "We smile … ลำลูกกาคลอง2" and
            # "คลินิกทันตกรรมโกลว์ลำลูกกาคลอง2" contain one another's locality
            # and nothing else; requiring the shared part to start both names
            # keeps branch suffixes working and drops that class of false match.
            elif min(thai_len(c_core), thai_len(r_core)) >= 4 and (
                c_core.startswith(r_core) or r_core.startswith(c_core)
            ):
                score = 2
            else:
                continue
            if c_branch and c_branch == r_branch:
                score += 1
            candidates.append((score, r))

        if not candidates:
            continue
        best = max(c[0] for c in candidates)
        top = [r for s, r in candidates if s == best]
        if len({r["license_no"] for r in top}) > 1:
            ties.append((cid, clinic.get("name"), [(r["name"], r["license_no"]) for r in top]))
            continue
        matched[cid] = top[0]

    # One licence on two clinic pages means one of them is wrong.
    used = defaultdict(list)
    for cid, r in matched.items():
        used[r["license_no"]].append(cid)
    for lic, ids in used.items():
        if len(ids) > 1:
            for i in ids:
                matched.pop(i, None)
            ties.append(("(shared licence)", lic, ids))

    OUT.write_text(json.dumps({
        "source": "https://hosp.hss.moph.go.th/",
        "publisher": "กรมสนับสนุนบริการสุขภาพ กระทรวงสาธารณสุข",
        "retrieved": __import__("time").strftime("%Y-%m-%d"),
        "licenses": {
            cid: {
                "license_no": r["license_no"],
                "valid_until": r["valid_until"],
                "registered_name": r["name"],
            }
            for cid, r in sorted(matched.items())
        },
    }, ensure_ascii=False, indent=1), encoding="utf-8")

    queried = len(raw)
    with_rows = sum(1 for v in raw.values() if v.get("rows"))
    print(f"queried {queried} · {with_rows} returned rows · matched {len(matched)} · ties {len(ties)}")
    print(f"dental clinics in the directory: {len(by_id)}")
    if args.report:
        for cid, r in sorted(matched.items()):
            print(f"  {(by_id[cid].get('name') or '')[:44]:<46} => {r['name'][:40]:<42} {r['license_no']} ถึง {r['valid_until']}")
        for t in ties:
            print("  TIE", str(t)[:200])


if __name__ == "__main__":
    main()
