#!/usr/bin/env python3
"""
Dump the exact set of niche detail-page URLs the site would build right now.

Exists because backfilling a niche can *remove* pages: topNichePlaces() falls
back to returning unrated venues only while a niche has zero rated ones, so the
first venue to gain a rating closes the fallback and every un-backfilled venue
silently loses its page. It has bitten twice (spa -40, yoga -266). Run this
before and after every merge and diff the two.

Mirrors lib/niches.ts qualifyingNichePlaces + the slug field stored on each
record, so it reflects routing, not intent.

Usage:
    python scripts/niche_url_snapshot.py before.json
    python scripts/niche_url_snapshot.py after.json
    python scripts/niche_url_snapshot.py --diff before.json after.json
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NICHE_DIR = ROOT / "web-thaigle" / "data" / "by-niche"

BACKFILLED = {"spa", "yoga-pilates"}


def top_niche(places: list[dict]) -> list[dict]:
    open_ = [p for p in places if not p.get("permanently_closed")]
    rated = [p for p in open_
             if p["trust_score"] > 0 and p.get("rating") and (p.get("review_count") or 0) > 0]
    pool = rated if rated else [p for p in open_ if p["trust_score"] > 0]
    return sorted(pool, key=lambda p: p["trust_score"], reverse=True)


def qualifying(niche: str, places: list[dict]) -> list[dict]:
    top = top_niche(places)
    if niche not in BACKFILLED:
        return top
    ranked = {p["id"] for p in top}
    unrated = sorted(
        (p for p in places
         if p["id"] not in ranked and p["trust_score"] > 0 and not p.get("permanently_closed")),
        key=lambda p: p["trust_score"], reverse=True,
    )
    allp = top + unrated
    if niche != "spa":
        return allp
    return [p for p in allp
            if p["price_min_thb"] > 0 or p.get("top_review_text")
            or p.get("reviews_sample") or p.get("top_photo_url")]


def snapshot() -> dict[str, list[str]]:
    out: dict[str, list[str]] = {}
    for path in sorted(NICHE_DIR.glob("*.json")):
        places = json.loads(path.read_text(encoding="utf-8"))["places"]
        out[path.stem] = sorted(p["slug"] for p in qualifying(path.stem, places))
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--diff", nargs=2, metavar=("BEFORE", "AFTER"))
    ap.add_argument("out", nargs="?")
    args = ap.parse_args()

    if args.diff:
        before = json.loads(Path(args.diff[0]).read_text(encoding="utf-8"))
        after = json.loads(Path(args.diff[1]).read_text(encoding="utf-8"))
        lost_total = gained_total = 0
        for niche in sorted(set(before) | set(after)):
            b, a = set(before.get(niche, [])), set(after.get(niche, []))
            lost, gained = sorted(b - a), sorted(a - b)
            lost_total += len(lost)
            gained_total += len(gained)
            flag = "  <-- LOSS" if lost else ""
            print(f"{niche:16} {len(b):>5} -> {len(a):>5}   "
                  f"lost {len(lost):>4}  gained {len(gained):>4}{flag}")
            for s in lost[:40]:
                print(f"      LOST  {s}")
            if len(lost) > 40:
                print(f"      ... +{len(lost)-40} more")
        print(f"\ntotal lost {lost_total}, gained {gained_total}")
        return 1 if lost_total else 0

    snap = snapshot()
    total = sum(len(v) for v in snap.values())
    if args.out:
        Path(args.out).write_text(json.dumps(snap, ensure_ascii=False), encoding="utf-8")
    for niche, slugs in snap.items():
        print(f"{niche:16} {len(slugs):>5}")
    print(f"{'TOTAL':16} {total:>5}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
