"""Attach DLD licence records to the clinics on thailandpethub.com.

Input:  web-petbkk/data/hospitals.json   (Google Maps-derived directory)
        web-petbkk/data/vet-registry.json (petvet/dld_registry.py)
Output: web-petbkk/data/hospital-licenses.json  {hospital_id: licence}

A wrong match is far worse than a missing one — it would print someone else's
licence number on a clinic's page — so the rules are deliberately narrow:

1. Location first. A registry row is only a candidate if its district (khet in
   Bangkok, amphoe elsewhere) appears in the clinic's address, and its province
   agrees with the clinic's city.
2. Names are compared in Thai, after removing the words every clinic shares
   ("โรงพยาบาลสัตว์", "คลินิกรักษาสัตว์" …), any Latin-script text, and
   punctuation. What is left is the distinctive core, e.g. "ศาลาแดง".
3. The cores must be equal, or one must contain the other with the shorter at
   least 4 Thai characters. Branch words ("สาขา X") must agree when both sides
   have one.
4. Exactly one best candidate. Ties are recorded in the report and left
   unmatched.

Everything unmatched stays unmatched; the site says nothing about those.
`--report` prints every decision for review.
"""

from __future__ import annotations

import argparse
import json
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "web-petbkk" / "data"
OVERRIDES = Path(__file__).resolve().parent / "registry_overrides.json"

CITY_PROVINCES = {
    "bangkok": {"กรุงเทพฯ", "กรุงเทพมหานคร"},
    "chiangmai": {"เชียงใหม่"},
    "pattaya": {"ชลบุรี"},
    "phuket": {"ภูเก็ต"},
}

# Longest first, so "โรงพยาบาลสัตว์" is removed before "สัตว์" could be.
GENERIC = sorted([
    "สถานพยาบาลสัตว์", "โรงพยาบาลสัตว์", "โรงพยาบาลสัตว์เล็ก", "โรงพยาบาล", "รพ.สัตว์", "รพ สัตว์", "รพ.",
    "คลินิกรักษาสัตว์", "คลีนิกรักษาสัตว์", "คลินิครักษาสัตว์", "คลินิกสัตวแพทย์", "คลินิกสัตว์แพทย์",
    "คลินิกสัตว์เลี้ยง", "คลินิกสัตว์", "คลีนิกสัตว์", "คลินิคสัตว์", "คลินิก", "คลีนิก", "คลินิค",
    "สัตวแพทย์", "สัตว์แพทย์", "รักษาสัตว์", "สัตว์เลี้ยง", "สัตว์",
    "จำกัด", "บริษัท", "ห้างหุ้นส่วน",
], key=len, reverse=True)

BRANCH = re.compile(r"สาขา\s*([^\s()\-–,]+)")


def core(name: str) -> tuple[str, str]:
    """(distinctive Thai core, branch word) of a clinic name."""
    s = name or ""
    branch = BRANCH.search(s)
    branch_word = re.sub(r"[^฀-๿0-9]", "", branch.group(1)) if branch else ""
    s = BRANCH.sub(" ", s)
    s = re.sub(r"\([^)]*\)", " ", s)
    s = re.sub(r"[A-Za-z]+", " ", s)
    for g in GENERIC:
        s = s.replace(g, " ")
    s = re.sub(r"[^฀-๿0-9]", "", s)
    return s, branch_word


THAI_DIGITS = str.maketrans("๐๑๒๓๔๕๖๗๘๙", "0123456789")


def digits(s: str) -> str:
    """Branch numbers ("ประดิพัทธ์ ๒", "สาขา 3") in Arabic numerals."""
    return "".join(re.findall(r"\d+", (s or "").translate(THAI_DIGITS)))


def is_hospital(name: str) -> bool:
    return bool(re.search(r"โรงพยาบาล|รพ\.?\s*สัตว์", name or ""))


def thai_len(s: str) -> int:
    return len(re.sub(r"[^฀-๿]", "", s))


def norm_place(s: str) -> str:
    s = re.sub(r"^(เขต|อำเภอ|อ\.|แขวง|ตำบล|ต\.)\s*", "", (s or "").strip())
    return re.sub(r"\s+", "", s)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--report", action="store_true")
    args = ap.parse_args()

    hospitals = json.loads((WEB / "hospitals.json").read_text(encoding="utf-8"))
    registry = json.loads((WEB / "vet-registry.json").read_text(encoding="utf-8"))
    overrides = json.loads(OVERRIDES.read_text(encoding="utf-8")) if OVERRIDES.exists() else {}

    by_province: dict[str, list[dict]] = defaultdict(list)
    for r in registry["records"]:
        by_province[r["province"]].append(r)

    out: dict[str, dict] = {}
    ties, used = [], defaultdict(list)
    for h in hospitals:
        if h["id"] in overrides:
            o = overrides[h["id"]]
            if o is None:
                continue
            rec = next((r for r in registry["records"] if r["license_no"] == o), None)
            if rec:
                out[h["id"]] = rec
            continue

        provinces = CITY_PROVINCES.get(h.get("city") or "bangkok", set())
        address = re.sub(r"\s+", "", h.get("address") or "")
        h_core, h_branch = core(h.get("name_th") or "")
        if thai_len(h_core) < 2:
            continue

        scored = []
        for p in provinces:
            for r in by_province.get(p, []):
                district = norm_place(r["district"])
                if not district or district not in address:
                    continue
                r_core, r_branch = core(r["name"])
                if thai_len(r_core) < 2:
                    continue
                if h_branch and r_branch and h_branch != r_branch:
                    continue
                sub = norm_place(r["subdistrict"])
                sub_ok = bool(sub and sub in address)
                h_num, r_num = digits(h_core), digits(r_core)
                if h_core == r_core:
                    score = 3
                elif (min(thai_len(h_core), thai_len(r_core)) >= 4
                      and (h_core in r_core or r_core in h_core)
                      # "ประดิพัทธ์" is not "ประดิพัทธ์ ๒": a number is a branch.
                      and h_num == r_num):
                    score = 2
                else:
                    continue
                # "Hospital" on one side and "clinic" on the other is how two
                # different businesses sharing a place name look. Only an exact
                # core in the same sub-district survives that.
                if is_hospital(h.get("name_th") or "") != is_hospital(r["name"]) and not (score == 3 and sub_ok):
                    continue
                if h_branch and h_branch == r_branch:
                    score += 1
                if sub_ok:
                    score += 1
                scored.append((score, r))

        if not scored:
            continue
        scored.sort(key=lambda x: -x[0])
        best = scored[0][0]
        top = [r for s, r in scored if s == best]
        distinct = {r["license_no"] for r in top}
        if len(distinct) > 1:
            ties.append((h["id"], h.get("name_th"), [(r["name"], r["license_no"]) for r in top]))
            continue
        out[h["id"]] = top[0]
        used[top[0]["license_no"]].append(h["id"])

    # One licence on two directory entries means one of the two is wrong (or
    # the directory has a duplicate). Keep neither rather than guess.
    for lic, ids in used.items():
        if len(ids) > 1:
            for i in ids:
                out.pop(i, None)
            ties.append(("(shared licence)", lic, ids))

    result = {
        hid: {
            "license_no": r["license_no"],
            "license_class": r["license_class"],
            "license_year_be": r["license_year_be"],
            "registered_name": r["name"],
        }
        for hid, r in sorted(out.items())
    }
    (WEB / "hospital-licenses.json").write_text(
        json.dumps({
            "source": registry["source"],
            "publisher": registry["publisher"],
            "retrieved": registry["retrieved"],
            "licenses": result,
        }, ensure_ascii=False, indent=1),
        encoding="utf-8",
    )

    by_city = defaultdict(lambda: [0, 0])
    for h in hospitals:
        c = h.get("city") or "bangkok"
        by_city[c][1] += 1
        if h["id"] in result:
            by_city[c][0] += 1
    print("matched per city:", {c: f"{m}/{n}" for c, (m, n) in by_city.items()})
    print("ties / shared licences left unmatched:", len(ties))
    if args.report:
        names = {h["id"]: h.get("name_th") for h in hospitals}
        for hid, r in sorted(result.items()):
            print(f"  {names[hid]}  ==>  {r['registered_name']}  [{r['license_no']}]")
        for t in ties:
            print("  TIE", t)


if __name__ == "__main__":
    main()
