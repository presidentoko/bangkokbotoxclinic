#!/usr/bin/env python3
"""
web-petbkk/data/review-report.json — what 19,022 reviews of Thai animal clinics
say, read together.

The data behind /hospital/report: the one page on this site that is research
rather than a directory entry. Every number is computed here from the
2026-10-16 review run and the per-clinic profiles (petvet/clinic_profile.py);
none is estimated, rounded up or borrowed.

Same sample caveat as the profiles: up to 30 reviews per clinic, the ones
Google ranks most relevant. The page states it.

Usage:
    python -m petvet.review_report
"""
from __future__ import annotations

import collections
import json
import statistics

from petvet.clinic_profile import load, PRAISE, COMPLAINTS
from petvet.review_signals import WEB

OUT = WEB / "review-report.json"


def pct(a, b):
    return round(a / b * 100, 1) if b else 0.0


def main():
    per = load()
    hospitals = {h["id"]: h for h in json.loads((WEB / "hospitals.json").read_text(encoding="utf-8"))}
    profiles = json.loads((WEB / "hospital-profiles.json").read_text(encoding="utf-8"))["hospitals"]

    allr = [r for v in per.values() for r in v]
    high = [r for r in allr if (r.get("stars") or 0) >= 4]
    low = [r for r in allr if (r.get("stars") or 5) <= 3]
    neg = [r for r in allr if (r.get("stars") or 5) <= 2]

    def share(terms, pool):
        out = []
        for t in terms:
            n = sum(1 for r in pool if t.find(r.get("text") or ""))
            out.append({"key": t.key, "th": t.label_th, "reviews": n, "pct": pct(n, len(pool))})
        return sorted(out, key=lambda x: -x["reviews"])

    langs = collections.Counter((r.get("originalLanguage") or "") for r in allr if (r.get("text") or "").strip())

    # Replies, per clinic with a profile.
    rates = []
    for hid, p in profiles.items():
        rates.append(p["replies"]["replied"] / p["read"])
    never = sum(1 for x in rates if x == 0)
    mostly = sum(1 for x in rates if x > 0.5)

    # What separates the best-rated clinics from the rest? Theme rates among
    # 4-5 star reviews, by the clinic's own Google rating band.
    def band(h):
        g = h.get("google_rating")
        if g is None:
            return None
        return "top" if g >= 4.8 else ("mid" if g >= 4.4 else "low")

    by_band = collections.defaultdict(list)
    low_by_band = collections.defaultdict(list)
    clinics_by_band = collections.Counter()
    for hid, v in per.items():
        b = band(hospitals.get(hid, {}))
        if not b or hid not in profiles:
            continue
        clinics_by_band[b] += 1
        by_band[b] += [r for r in v if (r.get("stars") or 0) >= 4]
        low_by_band[b] += [r for r in v if (r.get("stars") or 5) <= 3]
    separation = []
    for t in PRAISE:
        row = {"th": t.label_th, "key": t.key}
        for b in ("top", "mid", "low"):
            pool = by_band[b]
            row[b] = pct(sum(1 for r in pool if t.find(r.get("text") or "")), len(pool))
        separation.append(row)

    # Trend among profiled clinics where the evidence clears the bar.
    trend = [p["trend"] for p in profiles.values() if "trend" in p]
    up = sum(1 for t in trend if t["recent_avg"] > t["older_avg"])

    # Cities.
    city = {}
    for c in ("bangkok", "chiangmai", "pattaya", "phuket"):
        ids = [hid for hid in profiles if hospitals.get(hid, {}).get("city") == c]
        if not ids:
            continue
        ps = [profiles[i] for i in ids]
        rated = [hospitals[i]["google_rating"] for i in ids if hospitals[i].get("google_rating") is not None]
        wt = sum(p["languages"]["with_text"] for p in ps)
        city[c] = {
            "clinics": len(ids),
            "median_rating": round(statistics.median(rated), 2) if rated else None,
            "reply_rate": pct(sum(p["replies"]["replied"] for p in ps), sum(p["read"] for p in ps)),
            "negative_replied": pct(sum(p["replies"]["negative_replied"] for p in ps),
                                    sum(p["replies"]["negative"] for p in ps)),
            "foreign_share": pct(sum(p["languages"]["non_thai"] for p in ps), wt),
        }

    # Lists worth linking to.
    answerers = sorted(
        [(hid, p["replies"]["negative_replied"], p["replies"]["negative"]) for hid, p in profiles.items()
         if p["replies"]["negative"] >= 3 and p["replies"]["negative_replied"] / p["replies"]["negative"] >= 0.75],
        key=lambda x: (-x[1] / x[2], -x[2]))[:15]
    expat = sorted(
        [(hid, p["languages"]["non_thai"], p["languages"]["with_text"], p["languages"]["top"]) for hid, p in profiles.items()
         if p["languages"]["with_text"] and p["languages"]["non_thai"] >= 4
         and p["languages"]["non_thai"] / p["languages"]["with_text"] >= 0.25],
        key=lambda x: -x[1] / x[2])[:15]

    payload = {
        "built": "2026-10-23",
        "sample": {
            "reviews": len(allr),
            "clinics": len(per),
            "profiled": len(profiles),
            "high": len(high), "low": len(low), "negative": len(neg),
            "with_text": sum(langs.values()),
            "thai": langs.get("th", 0),
        },
        "languages": [{"code": k, "reviews": v} for k, v in langs.most_common() if k][:8],
        "praise": share(PRAISE, high),
        "complaints": share(COMPLAINTS, low),
        "replies": {
            "negative": len(neg),
            "negative_replied": sum(1 for r in neg if (r.get("responseFromOwnerText") or "").strip()),
            "clinics": len(rates), "never": never, "mostly": mostly,
        },
        "separation": separation,
        "bands": {b: clinics_by_band[b] for b in ("top", "mid", "low")},
        "trend": {"clinics": len(trend), "up": up, "down": len(trend) - up},
        "cities": city,
        "answerers": [{"id": h, "replied": a, "of": b} for h, a, b in answerers],
        "expat": [{"id": h, "non_thai": a, "of": b, "langs": l} for h, a, b, l in expat],
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps({k: payload[k] for k in ("sample", "replies", "bands", "trend")}, ensure_ascii=False, indent=1))
    print("praise:", [(x["key"], x["pct"]) for x in payload["praise"]])
    print("complaints:", [(x["key"], x["pct"]) for x in payload["complaints"]])
    print("separation (top/mid/low %):", [(x["key"], x["top"], x["mid"], x["low"]) for x in separation])
    print("cities:", json.dumps(city, ensure_ascii=False))
    print("answerers:", len(answerers), " expat:", len(expat))


if __name__ == "__main__":
    main()
