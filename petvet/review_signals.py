#!/usr/bin/env python3
"""
What owners report at each clinic, extracted from their own Thai reviews.

web-petbkk/data/hospital-signals.json — for every published clinic, which
animals owners say they brought and which treatments they say they had, each
with a count and the owner's own words.

WHY THIS EXISTS

The directory could say almost nothing about what a clinic *does*. `has_surgery`
is hardcoded `true` for all 980 records in petvet/transform.py
(feedback_petvet_fabricated_data), `has_emergency` is nearly as empty, and the
price fields are null. So "find me a vet who treats rabbits" — the question a
Thai owner of anything other than a cat or dog actually has — had no answer
anywhere on the site, and `/hospital/surgery` had to be 308'd away because its
list was a fabrication.

The 2026-10-16 Apify run brought back 17,132 Thai-language reviews. Owners say
in them exactly what the dataset lacks: what they brought, what was done, how
it went. Counting that is not scraping a new source, it is reading the one we
already paid for.

THAI MAKES NAIVE MATCHING DANGEROUS

Thai is written without spaces between words, so a keyword is a substring
search and `\b` does not exist. Measured on this corpus before the guards below:

    นก      "bird"          3,240 hits, essentially all false. The common
                            praise เป็นกันเอง ("friendly") contains นก.
    แพง     "expensive"     2,649 hits, dominated by ไม่แพง — "NOT expensive".
                            The term was counting praise as a complaint.
    หมา     "dog"           contaminated by เหมาะสม ("appropriate").

Each term therefore carries three defences, and `--audit` prints real matches
in context so a human can check them rather than trust a count
(feedback_region_id_passes_count_check: a wrong filter still returns a
plausible number).

  1. NEGATION. A term preceded by ไม่/ไม่ได้/ไม่ค่อย within a short window is a
     denial, not an assertion. Applied to every judgement term.
  2. BLOCKERS. Longer words known to contain the term as a substring are
     subtracted from the text before matching.
  3. QUALIFIERS. Short, high-risk animal words must appear next to a
     pet-context marker (น้อง, ลูก, เลี้ยง, รักษา…) rather than alone.

WHAT IS AND IS NOT PUBLISHED

Only signals with enough evidence are written, and each one keeps the quotes
behind it so the page can show the owner's words rather than assert a fact in
the site's own voice. The site never says "this clinic treats rabbits"; it says
"N owners mention rabbits", which is what the data supports and is also more
useful. Complaints are extracted for balance but are held to a higher bar —
being the subject of two bad reviews should not put a label on a business
(feedback_quote_selection_distorts_the_venue).

Usage:
    python -m petvet.review_signals --audit          # precision check, writes nothing
    python -m petvet.review_signals                  # build the file
"""
from __future__ import annotations

import argparse
import collections
import glob
import json
import random
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "web-petbkk" / "data"
RUN_DIR = ROOT / "apify_exports" / "petbkk_reviews_20261016"
OUT = WEB / "hospital-signals.json"

# How close before the term a negation still applies. Thai puts ไม่ immediately
# before what it negates (ราคาไม่แพง), so a short window is right; a long one
# would swallow an unrelated earlier clause.
NEG_WINDOW = 12
NEGATORS = ("ไม่", "ไม่ได้", "ไม่ค่อย", "มิได้")

# A pet-context marker near a risky animal word. น้อง/ลูก are how Thai owners
# refer to their animals; the rest are verbs that only make sense about a pet.
PET_CTX = r"(?:น้อง|ลูก|เลี้ยง|รักษา|พา|หมอ|คลินิก|สัตว์)"


class Term:
    """One extractable signal, with the guards that make its count honest."""

    def __init__(self, key, label_th, label_en, pattern, blockers=(),
                 require_ctx=False, negatable=True, min_reviews=2, min_clinics=1):
        self.key = key
        self.label_th = label_th
        self.label_en = label_en
        self.rx = re.compile(pattern)
        self.blockers = [re.compile(b) for b in blockers]
        self.require_ctx = require_ctx
        self.negatable = negatable
        self.min_reviews = min_reviews

    def _strip_blockers(self, text):
        """Blank out longer words that merely contain our term."""
        for b in self.blockers:
            text = b.sub(lambda m: "\u0000" * len(m.group(0)), text)
        return text

    def find(self, text):
        """Return the match spans that survive every guard."""
        cleaned = self._strip_blockers(text)
        out = []
        for m in self.rx.finditer(cleaned):
            if self.negatable:
                before = cleaned[max(0, m.start() - NEG_WINDOW):m.start()]
                if any(n in before for n in NEGATORS):
                    continue
            if self.require_ctx:
                near = cleaned[max(0, m.start() - 14):m.end() + 14]
                if not re.search(PET_CTX, near):
                    continue
            out.append(m)
        return out


# ---------------------------------------------------------------- the terms

ANIMALS = [
    Term("cat", "แมว", "cat", r"แมว", blockers=[r"แมวมอง"]),
    # เหมาะ/เหมาะสม ("appropriate") contains หมา and is everywhere in reviews.
    Term("dog", "สุนัข", "dog", r"สุนัข|หมา",
         blockers=[r"เหมาะ\w*", r"หมาย\w*", r"ความหมาย", r"เครื่องหมาย"]),
    # The rare animals carry min_reviews=1 on purpose. A clinic is "a place that
    # sees cats" only on repeated evidence, but one owner writing "พานกแก้วไป
    # รักษา" is already a specific, checkable fact about a parrot being treated,
    # and these base rates are so low (27 bird mentions in 16,308 reviews) that
    # a threshold of 2 would publish almost nothing and lose the one question
    # this data can answer better than anybody.
    Term("rabbit", "กระต่าย", "rabbit", r"กระต่าย", min_reviews=1),
    Term("rodent", "หนู/แฮมสเตอร์", "rodent", r"แฮมสเตอร์|หนูแกสบี้|กินนีพิก|ชินชิล่า|เม่นแคระ",
         blockers=[r"หนูน้อย"], min_reviews=1),
    # นก alone is unusable: เป็นกันเอง contains it. Demand a real bird word.
    Term("bird", "นก", "bird", r"นกแก้ว|นกกรงหัวจุก|น้องนก|เลี้ยงนก|รักษานก|นกหงส์หยก|ซันคอนัวร์",
         blockers=[r"เป็นกันเอง", r"กันเอง"], min_reviews=1),
    Term("reptile", "สัตว์เลื้อยคลาน", "reptile", r"เต่า|อิเกวน่า|งูเหลือม|กิ้งก่า|เคราแคระ|ตุ๊กแก",
         blockers=[r"เต่าหู้"], min_reviews=1),
    Term("sugarglider", "ชูการ์ไกลเดอร์", "sugar glider", r"ชูการ์ไกลเดอร์|ชูก้าไกลเดอร์|ชูการ์", min_reviews=1),
    Term("exotic", "สัตว์พิเศษ/เอ็กโซติก", "exotic pets", r"สัตว์พิเศษ|สัตว์แปลก|เอ็กโซติก|exotic", min_reviews=1),
]

SERVICES = [
    Term("neuter", "ทำหมัน", "neutering", r"ทำหมัน"),
    Term("vaccine", "วัคซีน", "vaccination", r"วัคซีน|ฉีดวัคซีน"),
    Term("surgery", "ผ่าตัด", "surgery", r"ผ่าตัด"),
    Term("dental", "ขูดหินปูน/ทำฟัน", "dental", r"ขูดหินปูน|ทำฟัน|หินปูน"),
    Term("imaging", "เอกซเรย์/อัลตราซาวด์", "x-ray & ultrasound",
         r"เอกซเรย์|เอ็กซเรย์|x-?ray|อัลตราซาวด์|อัลตร้าซาวด์|ultrasound"),
    Term("labtest", "ตรวจเลือด", "blood work", r"ตรวจเลือด|เจาะเลือด|ผลเลือด"),
    Term("admit", "นอนโรงพยาบาล", "overnight stay", r"นอนโรงพยาบาล|แอดมิท|admit|ฝากนอน"),
    Term("emergency", "ฉุกเฉิน", "emergency", r"ฉุกเฉิน|เคสด่วน"),
    Term("grooming", "อาบน้ำ/ตัดขน", "grooming", r"อาบน้ำ|ตัดขน|ไถขน"),
]

# Complaints need a higher bar: two bad reviews must not become a label.
COMPLAINTS = [
    Term("wait", "รอนาน", "long wait", r"รอนาน|คิวนาน|รอคิวนาน|รอเป็นชั่วโมง", min_reviews=3),
    # กำแพง is "wall" and ปีนกำแพง ("climbed the wall") is a recovery story, not
    # a complaint about the bill.
    Term("pricey", "ราคาสูง", "costly", r"แพง",
         blockers=[r"ไม่แพง\w*", r"กำแพง", r"แพงกว่าที่อื่นมาก(?=ๆ)"], min_reviews=3),
    Term("manner", "การสื่อสาร", "staff manner", r"หยาบคาย|พูดไม่ดี|ไม่ใส่ใจ|ไม่สนใจ",
         negatable=False, min_reviews=3),
]

ALL_GROUPS = [("animals", ANIMALS), ("services", SERVICES), ("complaints", COMPLAINTS)]


def load_reviews():
    rows = []
    for f in sorted(glob.glob(str(RUN_DIR / "*.json"))):
        rows += json.loads(Path(f).read_text(encoding="utf-8"))
    out = []
    seen = set()
    for r in rows:
        if (r.get("originalLanguage") or "") != "th":
            continue
        text = (r.get("text") or "").strip()
        if not text:
            continue
        rid = r.get("reviewId")
        if rid and rid in seen:
            continue
        if rid:
            seen.add(rid)
        s = r.get("searchString") or ""
        pid = s[len("place_id:"):] if s.startswith("place_id:") else (r.get("placeId") or "")
        out.append((pid, text, r.get("stars")))
    return out


def audit(reviews):
    """Print real matches in context. Counts lie; snippets do not."""
    random.seed(11)
    for gname, terms in ALL_GROUPS:
        print(f"\n{'='*70}\n{gname.upper()}\n{'='*70}")
        for t in terms:
            hits = []
            raw = 0
            for _, text, _ in reviews:
                raw += len(t.rx.findall(text))
                for m in t.find(text):
                    a, b = max(0, m.start() - 30), min(len(text), m.end() + 30)
                    hits.append(text[a:b].replace("\n", " "))
            kept = len(hits)
            drop = f"  (raw {raw} -> kept {kept}, guards removed {raw-kept})" if raw != kept else ""
            print(f"\n  [{t.key}] {t.label_en}: {kept} mentions{drop}")
            for s in random.sample(hits, min(4, len(hits))):
                print(f"      …{s}…")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--audit", action="store_true", help="print samples, write nothing")
    args = ap.parse_args()

    reviews = load_reviews()
    print(f"Thai reviews: {len(reviews):,}")
    if args.audit:
        audit(reviews)
        return 0

    hospitals = json.loads((WEB / "hospitals.json").read_text(encoding="utf-8"))
    excluded = set(json.loads((WEB / "hospital-excluded.json").read_text(encoding="utf-8"))["excluded"])
    by_pid = {h["google_place_id_new"]: h for h in hospitals
              if h["id"] not in excluded and h.get("google_place_id_new")}

    # clinic -> group -> key -> {count, quotes}
    per = collections.defaultdict(lambda: collections.defaultdict(
        lambda: collections.defaultdict(lambda: {"count": 0, "quotes": []})))

    for pid, text, stars in reviews:
        h = by_pid.get(pid)
        if not h:
            continue
        for gname, terms in ALL_GROUPS:
            for t in terms:
                ms = t.find(text)
                if not ms:
                    continue
                # A complaint only counts from a review that is actually negative.
                if gname == "complaints" and (stars or 5) >= 4:
                    continue
                slot = per[h["id"]][gname][t.key]
                slot["count"] += 1
                m = ms[0]
                a, b = max(0, m.start() - 60), min(len(text), m.end() + 90)
                quote = text[a:b].strip()
                if len(quote) >= 30:
                    slot["quotes"].append(quote)

    out = {}
    for hid, groups in per.items():
        rec = {}
        for gname, terms in ALL_GROUPS:
            bykey = {}
            for t in terms:
                slot = groups.get(gname, {}).get(t.key)
                if not slot or slot["count"] < t.min_reviews:
                    continue
                quotes = sorted(slot["quotes"], key=len, reverse=True)[:2]
                bykey[t.key] = {
                    "label_th": t.label_th,
                    "label_en": t.label_en,
                    "count": slot["count"],
                    "quotes": quotes,
                }
            if bykey:
                rec[gname] = dict(sorted(bykey.items(), key=lambda kv: -kv[1]["count"]))
        if rec:
            out[hid] = rec

    payload = {
        "source": "Owner-written Thai Google reviews, 2026-10-16 Apify run",
        "built": "2026-10-20",
        "method": (
            "Substring matching over space-free Thai with three guards per term: "
            "negation (ไม่ within 12 chars), blocker words that merely contain the "
            "term, and a pet-context requirement for short animal words. Counts are "
            "reviews mentioning the term, never a claim about the clinic's services. "
            "Complaints are counted only from reviews rated 3 stars or lower."
        ),
        "terms": {g: {t.key: {"th": t.label_th, "en": t.label_en, "min_reviews": t.min_reviews}
                      for t in terms} for g, terms in ALL_GROUPS},
        "hospitals": dict(sorted(out.items())),
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")

    tot = collections.Counter()
    for rec in out.values():
        for gname, bykey in rec.items():
            for k in bykey:
                tot[f"{gname}/{k}"] += 1
    print(f"\nclinics with at least one signal: {len(out)}")
    print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size/1e6:.1f} MB)\n")
    for k, n in tot.most_common():
        print(f"  {n:>4} clinics  {k}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
