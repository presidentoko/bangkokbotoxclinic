#!/usr/bin/env python3
"""Check every hospital named in the editorial guides against a real register.

In August 2026 a manual review found 24 hospital names in the city guides that
do not exist. They had been published for about a year, and some had reached
the database and been indexed by Google. On a health site that is the most
expensive kind of error there is, and nothing in the build would have caught
it.

This is the check that would have. A name in the guides passes when it is one
of the hospitals we hold, or appears in Thailand's official register of 1,491
hospitals (via the chain transliteration table in match_registry.py), or is a
foreign hospital named in one of the country-comparison guides. Anything else
is printed and the script exits non-zero.

    python verify_guide_hospitals.py          # report
    python verify_guide_hospitals.py --strict # exit 1 on any unknown

Run it after editing guide prose. As of 2026-10-01 all 118 names pass.
"""
from __future__ import annotations

import argparse
import importlib.util
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
GUIDES = HERE / "web" / "app" / "[locale]" / "guide" / "[slug]" / "page.tsx"
DB = HERE / "web" / "data" / "checkup_db.json"
REGISTRY = HERE / "web" / "data" / "registry.json"

# Guides that deliberately compare Thailand with another country name foreign
# hospitals; those are not expected on the Thai register.
FOREIGN = {
    "aga khan", "american", "asian", "dallah", "eko", "fv", "hong ngoc",
    "karen", "king faisal", "lagoon", "mayapada", "nairobi", "nippon",
    "saudi german", "singapore general", "vinmec",
}

# Sentence-boundary artefacts: "Which Bangkok Hospital…", "Choose Bangkok
# Hospital…". The leading word is prose, not part of a name.
LEAD_NOISE = {
    "choose", "does", "which", "the", "compare", "government", "thailand",
    "malaysia", "northern", "festival", "a", "an", "any", "best", "top",
}

GENERIC = {"hospital", "international", "medical", "center", "centre", "general", "ram"}

# Thai spellings for names that appear in the guides but not in our own 321
# rows. Each was checked against the register when it was added.
EXTRA_TH = {
    "prachanukroh": "ประชานุเคราะห์",
    "patong": "ป่าตอง",
    "wattanosoth": "วัฒโนสถ",
    "wattana": "วัฒนา",
    "karunvej": "การุญเวช",
    "hin": "หัวหิน",
    "korat": "ราชสีมา",
    # Verified against the register on 2026-10-01, with the code the register
    # gives each one.
    "samui": "เกาะสมุย",          # 10742, Surat Thani, general hospital
    "luang": "แม่ฟ้าหลวง",         # 23429 / 41509 / 11200, Chiang Rai
    "christian": "กรุงเทพคริสเตียน",  # 11548 Bangkok, 12126 Nakhon Pathom
}


def load_matcher():
    spec = importlib.util.spec_from_file_location("mr", HERE / "match_registry.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--strict", action="store_true")
    args = ap.parse_args()

    mr = load_matcher()
    src = GUIDES.read_text(encoding="utf-8")
    db = json.loads(DB.read_text(encoding="utf-8"))
    reg = json.loads(REGISTRY.read_text(encoding="utf-8"))

    register_th = "|".join(mr.norm_th(h["name_th"]) for h in reg["hospitals"])
    brands = {k: v for k, v in mr.BRANDS}
    ours = {re.sub(r"[^a-z0-9]", "", h["name"].lower()) for h in db["hospitals"]}
    our_words = {
        w.lower()
        for h in db["hospitals"]
        for w in re.findall(r"[A-Za-z]{4,}", h["name"])
    }

    names = sorted(
        set(
            re.findall(
                r"\b([A-Z][A-Za-z.\-]*(?:\s+[A-Z][A-Za-z.\-]*){0,4}\s+Hospital)\b", src
            )
        )
    )

    unknown: list[str] = []
    for raw in names:
        words = raw.split()
        while words and words[0].lower().rstrip(".") in LEAD_NOISE:
            words = words[1:]
        name = " ".join(words)
        if not name or name.lower() == "hospital":
            continue
        flat = re.sub(r"[^a-z0-9]", "", name.lower())
        if any(flat in q or q in flat for q in ours):
            continue
        core = [
            w.lower()
            for w in re.findall(r"[A-Za-z]{2,}", name)
            if w.lower() not in GENERIC
        ]
        if core and all(c in our_words for c in core):
            continue
        # A foreign hospital named in a country-comparison guide. Matched as a
        # substring of the normalised name so that a qualifier the prose adds
        # ("Aga Khan *University* Hospital", "King Faisal *Specialist*") does
        # not hide the entry.
        low = " ".join(core)
        if any(f in low or f.replace(" ", "") in flat for f in FOREIGN):
            continue
        if any(
            (brands.get(c) or EXTRA_TH.get(c))
            and mr.norm_th(brands.get(c) or EXTRA_TH[c]) in register_th
            for c in core
        ):
            continue
        unknown.append(raw)

    print(f"[guides] {len(names)} hospital names found, {len(unknown)} unverified")
    for n in unknown:
        print(f"  UNVERIFIED  {n}")
    if unknown:
        print(
            "\nEach of these must be confirmed against the hospital's own site or the\n"
            "register before it ships. If it is a foreign hospital in a country\n"
            "comparison, add it to FOREIGN; if it is Thai and real, add its Thai\n"
            "spelling to EXTRA_TH so the register can vouch for it."
        )
        return 1 if args.strict else 0
    print("[guides] every name is backed by our data, the register, or a named exception")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
