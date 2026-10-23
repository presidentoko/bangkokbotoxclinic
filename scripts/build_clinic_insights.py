"""Per-clinic aspect counts mined from every scraped review — the clinic sites'
counterpart of chillanel/scripts/extract-insights.mjs (2026-10-23).

Input:  web/data/master_db.json            (which clinics exist, id <-> place_id)
        review CSVs of every source in web/scripts/build_master_db.py SOURCES
Output: web/data/clinic-insights.json and web-cf/data/clinic-insights.json
        {"aspect_order": [...], "clinics": {clinic_id: [analysed, pos, neg, pos, neg, ...]}}

Numbers only — no review text leaves this script. Regex dictionaries in English
and Thai (the reviews are ~86% English, ~13% Thai), zero cost.

A review counts once per side per aspect; a negative hit wins over a positive
one in the same review; a cue preceded by a negation ("not painful",
"didn't explain", "ไม่แพง") is not counted on its own side.
"""

from __future__ import annotations

import csv
import importlib.util
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MASTER_DB = ROOT / "web" / "data" / "master_db.json"
OUTPUTS = [ROOT / "web" / "data" / "clinic-insights.json", ROOT / "web-cf" / "data" / "clinic-insights.json"]

csv.field_size_limit(10**8)

I = re.I
ASPECTS: dict[str, dict[str, list[re.Pattern]]] = {
    "painless": {
        "pos": [re.compile(p, I) for p in (
            r"\bpainless\b", r"\bpain[- ]free\b", r"\bno pain\b", r"\b(?:didn't|did not) (?:feel (?:any )?pain|hurt)\b",
            r"\bbarely felt\b", r"\bnot (?:painful|hurt)\b", r"\b(?:very |so |really )?gentle\b",
        )] + [re.compile(r"ไม่เจ็บ|มือเบา")],
        "neg": [re.compile(p, I) for p in (
            r"\b(?:very |so |really |extremely )?painful\b", r"\bhurt (?:a lot|so much|badly)\b", r"\bheavy[- ]handed\b", r"\brough\b",
        )] + [re.compile(r"เจ็บมาก|มือหนัก")],
    },
    "explanation": {
        "pos": [re.compile(p, I) for p in (
            r"\bexplain(?:ed|s|ing)? (?:everything|clearly|in detail|well|thoroughly|patiently|the (?:procedure|treatment|process|options|plan))\b",
            r"\bclear explanation", r"\btook (?:the|their|her|his) time to explain\b", r"\bpatiently explain",
        )] + [re.compile(r"อธิบาย(?:อย่าง)?(?:ละเอียด|ดี|ชัดเจน)")],
        "neg": [re.compile(p, I) for p in (
            r"\b(?:didn't|did not|never|no one|nobody|doesn't|does not) explain", r"\bwithout (?:any )?explanation\b", r"\bno explanation\b",
        )] + [re.compile(r"ไม่อธิบาย|ไม่ได้อธิบาย")],
    },
    "staff": {
        "pos": [re.compile(p, I) for p in (
            r"\bfriendly\b", r"\bwelcoming\b", r"\bpolite\b", r"\bkind\b(?! of)", r"\bcaring\b", r"\battentive\b",
        )] + [re.compile(r"ใจดี|เป็นกันเอง|บริการดี|น่ารัก")],
        "neg": [re.compile(p, I) for p in (
            r"\brude\b", r"\bunfriendly\b", r"\bimpolite\b", r"\barrogant\b", r"\bbad attitude\b", r"\bunprofessional\b",
        )] + [re.compile(r"ไม่สุภาพ|พูดจาไม่ดี|หน้าบึ้ง|บริการแย่")],
    },
    "cleanliness": {
        "pos": [re.compile(p, I) for p in (r"\bclean\b", r"\bspotless\b", r"\bhygienic\b", r"\bsterile\b")]
        + [re.compile(r"สะอาด")],
        "neg": [re.compile(p, I) for p in (r"\bdirty\b", r"\bnot (?:very |so )?clean\b", r"\bunhygienic\b", r"\bunclean\b")]
        + [re.compile(r"สกปรก|ไม่สะอาด")],
    },
    "value": {
        "pos": [re.compile(p, I) for p in (
            r"\breasonabl[ey] pric", r"\bfair pric", r"\baffordable\b", r"\bgood value\b", r"\bvalue for money\b",
            r"\bworth (?:it|every|the money|the price)\b", r"\bcheaper than\b",
        )] + [re.compile(r"ราคาไม่แพง|ราคาถูก|ราคาเหมาะสม|คุ้มค่า|คุ้มราคา")],
        "neg": [re.compile(p, I) for p in (
            r"\bover-?priced\b", r"\btoo expensive\b", r"\brip[- ]?off\b", r"\bovercharg", r"\bhidden (?:fee|charge|cost)",
        )] + [re.compile(r"แพงมาก|แพงเกิน|ราคาแพง|โก่งราคา")],
    },
    "english": {
        "pos": [re.compile(p, I) for p in (
            r"\b(?:speaks?|spoke|speaking) (?:good |great |fluent |perfect |excellent |very good )?english\b",
            r"\benglish (?:was|is) (?:good|fine|great|excellent|perfect)\b",
        )],
        "neg": [re.compile(p, I) for p in (
            r"\b(?:no|little|limited|poor|bad|broken) english\b",
            r"\b(?:do not|don't|didn't|doesn't|can't|couldn't|cannot) (?:speak|understand) (?:any |much )?english\b",
        )],
    },
}

NEGATED_BEFORE = re.compile(r"\b(?:not|never|no|n't|wasn't|isn't|weren't|aren't|hardly|barely|minimally)\s+(?:\w+\s+){0,2}$", I)
TH_NEGATED_BEFORE = re.compile(r"ไม่\s?$")


def _negated(text: str, m: re.Match) -> bool:
    before = text[: m.start()]
    return bool(NEGATED_BEFORE.search(before) or TH_NEGATED_BEFORE.search(before))


def _hit(text: str, patterns: list[re.Pattern]) -> bool:
    for p in patterns:
        m = p.search(text)
        if m and not _negated(text, m):
            return True
    return False


def aspect_counts(texts: list[str]) -> dict[str, dict[str, int]]:
    out = {k: {"pos": 0, "neg": 0} for k in ASPECTS}
    for t in texts:
        for key, d in ASPECTS.items():
            if _hit(t, d["neg"]):
                out[key]["neg"] += 1
            elif _hit(t, d["pos"]):
                out[key]["pos"] += 1
    return out


def _review_dirs() -> list[Path]:
    spec = importlib.util.spec_from_file_location("bmd", ROOT / "web" / "scripts" / "build_master_db.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)  # main() is guarded by __name__
    dirs = [Path(s["reviews_dir"]) for s in mod.SOURCES]
    return [d for d in dict.fromkeys(dirs) if d.exists()]


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8")
    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    clinics = db["clinics"] if isinstance(db, dict) else db
    dirs = _review_dirs()
    result: dict[str, dict] = {}
    for c in clinics:
        fn = c["place_id"].replace(":", "_") + "_reviews.csv"
        seen: set[str] = set()
        texts: list[str] = []
        for d in dirs:
            p = d / fn
            if not p.exists():
                continue
            with open(p, encoding="utf-8-sig", errors="replace", newline="") as f:
                for r in csv.DictReader(f):
                    rid = r.get("review_id") or r.get("text", "")[:80]
                    if rid in seen:
                        continue
                    seen.add(rid)
                    if r.get("text"):
                        texts.append(r["text"])
        if len(texts) < 10:
            continue
        a = aspect_counts(texts)
        # 압축 형식: [analysed, pos, neg, pos, neg, ...] (ASPECT_ORDER 순) — 덴탈은
        # Cloudflare Workers Free 라 번들 크기가 빠듯하다(객체 형식의 1/3 크기).
        result[c["id"]] = [len(texts)] + [n for k in ASPECTS for n in (a[k]["pos"], a[k]["neg"])]
    payload = json.dumps({"generated": __import__("datetime").date.today().isoformat(),
                          "aspect_order": list(ASPECTS), "clinics": result},
                         ensure_ascii=False, separators=(",", ":"))
    for out in OUTPUTS:
        if out.parent.exists():
            out.write_text(payload, encoding="utf-8")
    print(f"{len(result)} clinics with 10+ review texts (of {len(clinics)}), from {len(dirs)} review dirs")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
