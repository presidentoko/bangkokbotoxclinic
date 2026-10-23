#!/usr/bin/env python3
"""
A clinic's profile, computed from its reviews rather than copied out of them.

web-petbkk/data/hospital-profiles.json — for every published clinic with
enough reviews, a set of measurements nobody else publishes, plus at most three
short excerpts as evidence.

WHY THIS REPLACES THE QUOTE WALL

The 2026-10-16 review work took clinic pages from 744-1,198 characters of their
own to a median of 3,623 — but that text was other people's sentences, lifted
from Google Maps. Google already holds every one of them. Measured as "text not
repeated on other pages of this site" it looked unique; measured as "text that
exists only here" it was close to none. On a site recovering from a quality
demotion that is the wrong thing to be good at.

What does exist only here is what can be computed from 19,022 reviews read
together: how many owners praise how a vet explains things, whether the clinic
answers the people who left one star, whether the recent reviews are better or
worse than the old ones, whether foreign owners use it. Google Maps shows the
reviews; it does not count them.

WHAT IS DELIBERATELY NOT DONE

No generated prose. Writing "Owners praise this clinic's explanations" into
750 pages from one sentence template, with the numbers swapped, is precisely the
scaled content this site was demoted for — and having a language model write it
instead is the same thing with better grammar. The profile is published as
numbers and labels. A number can be checked; a templated sentence only looks
like it was written.

No count of animals that died. Owners write about it (298 reviews) and it is
the most serious thing a review can say, which is exactly why a raw count next
to a clinic's name would mislead: an emergency hospital sees the sickest
animals. It is not a measure of care.

THE SAMPLE, STATED

The reviews are, per clinic, the up-to-30 Google ranks "most relevant", not all
of them and not a random draw. Every figure is therefore published as "of the N
reviews we read", and the trend comparison is only made when both periods have
at least eight reviews and the gap is half a star or more.

Usage:
    python -m petvet.clinic_profile --audit     # theme precision, writes nothing
    python -m petvet.clinic_profile
"""
from __future__ import annotations

import argparse
import collections
import glob
import json
import random
import re
import statistics
from pathlib import Path

from petvet.review_signals import Term, RUN_DIR, WEB

OUT = WEB / "hospital-profiles.json"

# A clinic needs this many reviews read before a share means anything.
MIN_REVIEWS = 10
# Trend: both periods need this many reviews, and the gap must clear MIN_SHIFT.
TREND_MIN_EACH = 8
TREND_MIN_SHIFT = 0.5
# Twelve months before the 2026-10-16 run.
RECENT_FROM = "2025-10-16"

EXCERPTS = 3
EXCERPT_MAX = 180

# Praise is counted only from 4-5 star reviews and complaints only from 1-3,
# symmetrically. Both directions were measured wrong without it: a 5-star "a
# bit of a wait but worth it" is not a complaint, and in a 1-star review praise
# words are usually contrast — the audit's own sample had "ตัดสินใจย้ายที่รักษา
# อาการดีขึ้นมาก" ("we moved clinic and THEN it got much better") counted as a
# recovery at the clinic being complained about.
PRAISE = [
    Term("attentive", "ใส่ใจ ดูแลดี", "attentive care", r"ใส่ใจ|ดูแลดี|เอาใจใส่|ดูแลอย่างดี"),
    Term("explains", "อธิบายละเอียด", "explains clearly",
         r"อธิบายละเอียด|อธิบายดี|อธิบายชัดเจน|อธิบายเข้าใจง่าย|ให้คำแนะนำดี|แนะนำละเอียด"),
    Term("skilled", "หมอเก่ง", "skilled vet", r"หมอเก่ง|เก่งมาก|ชำนาญ|มีประสบการณ์"),
    Term("clean", "สะอาด", "clean", r"สะอาด"),
    Term("fairprice", "ราคาสมเหตุสมผล", "fair price",
         r"ราคาไม่แพง|ราคาถูก|ราคาเหมาะสม|ราคาย่อมเยา|คุ้มค่า|ราคาดี",
         negatable=False),  # these phrases carry their own ไม่ already
    Term("recovered", "อาการดีขึ้น/หาย", "pet recovered",
         r"หายดี|หายป่วย|อาการดีขึ้น|หายแล้ว|ช่วยชีวิต|รอดชีวิต"),
]
COMPLAINTS = [
    Term("wait", "รอนาน", "long wait", r"รอนาน|คิวนาน|รอคิวนาน|รอเป็นชั่วโมง"),
    Term("pricey", "ราคาสูง", "costly", r"แพง",
         blockers=[r"ไม่แพง\w*", r"กำแพง"]),
    Term("manner", "การพูดจา/บริการ", "staff manner",
         r"หยาบคาย|พูดไม่ดี|พูดจาไม่ดี|ไม่สุภาพ|ไม่ใส่ใจ|ไม่สนใจ|ไม่เป็นมิตร",
         negatable=False),
    Term("outcome", "ไม่หาย/รักษาผิด", "poor outcome",
         r"วินิจฉัยผิด|รักษาผิด|ผิดพลาด|ไม่หาย|อาการแย่ลง"),
]


def load():
    rows = []
    for f in sorted(glob.glob(str(RUN_DIR / "*.json"))):
        rows += json.loads(Path(f).read_text(encoding="utf-8"))
    hospitals = json.loads((WEB / "hospitals.json").read_text(encoding="utf-8"))
    excluded = set(json.loads((WEB / "hospital-excluded.json").read_text(encoding="utf-8"))["excluded"])
    by_pid = {h["google_place_id_new"]: h["id"] for h in hospitals
              if h["id"] not in excluded and h.get("google_place_id_new")}
    seen, per = set(), collections.defaultdict(list)
    for r in rows:
        rid = r.get("reviewId")
        if rid and rid in seen:
            continue
        seen.add(rid)
        s = r.get("searchString") or ""
        pid = s[len("place_id:"):] if s.startswith("place_id:") else (r.get("placeId") or "")
        hid = by_pid.get(pid)
        if hid:
            per[hid].append(r)
    return per


def excerpt(text: str) -> str:
    """A short, whole-phrase excerpt. Thai separates phrases with spaces."""
    t = re.sub(r"\s+", " ", text).strip()
    if len(t) <= EXCERPT_MAX:
        return t
    cut = t.rfind(" ", 0, EXCERPT_MAX)
    return (t[:cut] if cut > 60 else t[:EXCERPT_MAX]).rstrip(" ,.") + " …"


def pick_excerpts(reviews: list[dict]) -> list[dict]:
    """
    Three excerpts in the clinic's own proportions of praise and complaint.

    Same rule as the quote selection (feedback_quote_selection_distorts_the_venue):
    longest-first over-represents one-star rants, a 4+ star gate turns the page
    into an advert. One seat goes to a 1-3 star review only when such reviews
    are at least a sixth of what we read, so the excerpts never paint a
    harsher — or a kinder — picture than the clinic's reviews do.
    """
    thai = [r for r in reviews
            if (r.get("originalLanguage") or "") == "th" and len((r.get("text") or "").strip()) >= 40]
    if not thai:
        return []
    good = sorted([r for r in thai if (r.get("stars") or 0) >= 4], key=lambda r: -len(r["text"]))
    bad = sorted([r for r in thai if (r.get("stars") or 5) <= 3], key=lambda r: -len(r["text"]))
    share_bad = len([r for r in reviews if (r.get("stars") or 5) <= 3]) / max(1, len(reviews))
    seats_bad = 1 if bad and share_bad >= 1 / 6 else 0
    chosen = bad[:seats_bad] + good[:EXCERPTS - seats_bad]
    if len(chosen) < EXCERPTS:
        chosen += [r for r in bad[seats_bad:] if r not in chosen][:EXCERPTS - len(chosen)]
    return [{"stars": r.get("stars"), "when": (r.get("publishedAtDate") or "")[:7], "text": excerpt(r["text"])}
            for r in chosen]


def profile(reviews: list[dict]) -> dict | None:
    n = len(reviews)
    if n < MIN_REVIEWS:
        return None
    rec: dict = {"read": n}

    # Themes, as shares of the reviews read.
    def themes(terms, pool):
        out = {}
        for t in terms:
            hits = sum(1 for r in pool if t.find(r.get("text") or ""))
            if hits:
                out[t.key] = {"th": t.label_th, "en": t.label_en, "reviews": hits}
        return out

    low = [r for r in reviews if (r.get("stars") or 5) <= 3]
    high = [r for r in reviews if (r.get("stars") or 0) >= 4]
    rec["praise"] = themes(PRAISE, high)
    rec["complaints"] = {k: v for k, v in themes(COMPLAINTS, low).items() if v["reviews"] >= 2}
    rec["low_star_reviews"] = len(low)

    # Does the clinic answer — and does it answer the unhappy ones?
    replied = [r for r in reviews if (r.get("responseFromOwnerText") or "").strip()]
    neg = [r for r in reviews if (r.get("stars") or 5) <= 2]
    rec["replies"] = {
        "replied": len(replied),
        "negative": len(neg),
        "negative_replied": sum(1 for r in neg if (r.get("responseFromOwnerText") or "").strip()),
    }

    # Foreign owners. A clinic where a fifth of reviewers write in English,
    # Russian or Japanese is one a newcomer to Thailand can probably talk to.
    langs = collections.Counter(
        (r.get("originalLanguage") or "") for r in reviews if (r.get("text") or "").strip())
    with_text = sum(langs.values())
    foreign = sum(v for k, v in langs.items() if k and k != "th")
    rec["languages"] = {
        "with_text": with_text,
        "non_thai": foreign,
        "top": [k for k, _ in langs.most_common() if k and k != "th"][:3],
    }

    # Trend, only when the evidence is there.
    new = [r["stars"] for r in reviews if r.get("stars") and (r.get("publishedAtDate") or "") >= RECENT_FROM]
    old = [r["stars"] for r in reviews if r.get("stars") and r.get("publishedAtDate") and r["publishedAtDate"] < RECENT_FROM]
    if len(new) >= TREND_MIN_EACH and len(old) >= TREND_MIN_EACH:
        a, b = statistics.mean(new), statistics.mean(old)
        if abs(a - b) >= TREND_MIN_SHIFT:
            rec["trend"] = {"recent_avg": round(a, 2), "recent_n": len(new),
                            "older_avg": round(b, 2), "older_n": len(old)}

    # The star mix of what we read, so the reader can see the sample.
    rec["stars"] = {str(s): sum(1 for r in reviews if r.get("stars") == s) for s in (5, 4, 3, 2, 1)}
    rec["excerpts"] = pick_excerpts(reviews)
    return rec


def audit(per):
    random.seed(4)
    pool = [r for v in per.values() for r in v]
    for gname, terms, src in (("PRAISE (4-5 star only)", PRAISE,
                               [r for r in pool if (r.get("stars") or 0) >= 4]),
                              ("COMPLAINTS (1-3 star only)", COMPLAINTS,
                               [r for r in pool if (r.get("stars") or 5) <= 3])):
        print(f"\n===== {gname} =====")
        for t in terms:
            hits = []
            for r in src:
                text = r.get("text") or ""
                for m in t.find(text):
                    a, b = max(0, m.start() - 30), min(len(text), m.end() + 30)
                    hits.append(text[a:b].replace("\n", " "))
                    break
            print(f"\n  [{t.key}] {len(hits)} reviews")
            for s in random.sample(hits, min(4, len(hits))):
                print(f"      …{s}…")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--audit", action="store_true")
    args = ap.parse_args()
    per = load()
    if args.audit:
        audit(per)
        return 0

    out = {hid: p for hid, v in per.items() if (p := profile(v))}
    payload = {
        "source": "Google Maps reviews, up to 30 per clinic ranked most relevant, Apify run 2026-10-16",
        "built": "2026-10-23",
        "sample_note": (
            "Every figure is a count among the reviews read for that clinic, not among "
            "all of its reviews. Complaints are counted only from reviews of 1-3 stars."
        ),
        "hospitals": dict(sorted(out.items())),
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")

    print(f"profiles: {len(out)}  ({OUT.stat().st_size/1e6:.1f} MB)")
    print(f"  with trend: {sum(1 for p in out.values() if 'trend' in p)}")
    print(f"  with complaints: {sum(1 for p in out.values() if p['complaints'])}")
    print(f"  foreign-owner share >= 20%: "
          f"{sum(1 for p in out.values() if p['languages']['with_text'] and p['languages']['non_thai']/p['languages']['with_text'] >= .2)}")
    ex = [len(e['text']) for p in out.values() for e in p['excerpts']]
    print(f"  excerpts: {len(ex)}, median {int(statistics.median(ex))} chars")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
