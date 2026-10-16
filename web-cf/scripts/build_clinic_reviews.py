#!/usr/bin/env python3
"""
Publish more of the review text the dental site already has on disk.

A clinic page carries a median of 561 characters of review text. The scrape
collected a median of 3,705 per clinic. The gap is not missing data, it is
`pick_samples` in build_master_db.py, which keeps three reviews and only those
between 80 and 300 characters — so every review longer than 300 characters is
discarded outright, and the three that survive are chosen by rating, not by
whether they say anything. Measured over 242 clinics: taking the longest eight
instead takes the median from 561 to 2,001 characters, 3.6x, and improves 217
of them.

Why that matters here rather than as polish. bangkokbestclinic lost 92% of its
impressions on 2026-08-18 and has recovered none of it. The URL hygiene, the
MOPH licence matching, the robots and OG fixes all shipped on 2026-10-01 and
two weeks later impressions sit at 95/day against 70 before — noise. What is
left untouched is the thing the pages are short of: a live clinic page is 4,313
characters of <main> text of which 44% is shared verbatim with every other
clinic page, and only ~560 characters are a patient's own words. That is the
same shape thaigle and petbkk were demoted for.

Why a separate file rather than filling master_db.json. The Worker serves
master_db.json as a single asset and Cloudflare caps one asset at 25 MiB. The
file is already 24,657,315 bytes, so there is 1.5 MB of headroom and this adds
roughly 10 MB. clinic-reviews.json is read with fs at build time by the
prerendered clinic page only, is not copied into the Worker's assets by
scripts/copy-db-assets.mjs, and so costs the runtime nothing.

Rules:
- Only ever improve. A clinic is written only when the new selection holds
  strictly more text than master_db already publishes for it, so a clinic the
  scrape covers poorly keeps what it has and re-running is a no-op.
- Longest first. Measured on 2026-10-15 over a Google listing with 2,499
  reviews, 20 sorted `newest` returned 605 characters of text against 7,646
  sorted `mostRelevant`: recency selects for one-line ratings, length selects
  for the reviews that describe a visit.
- Quotes are cleaned the way build_master_db.py cleans its signal snippets.
  These pages name real businesses by name; a quote that opens mid-word reads
  as fabricated even when it is verbatim.

Usage:
    python web-cf/scripts/build_clinic_reviews.py [--dry-run] [--max-reviews 8]
"""
from __future__ import annotations

import argparse
import csv
import json
import re
import statistics
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WEB_CF = ROOT / "web-cf"
MASTER = WEB_CF / "data" / "master_db.json"
OUT = WEB_CF / "data" / "clinic-reviews.json"

# Every directory of per-clinic review CSVs the scrapers write, clinic verticals
# only. bangkok_clinics/output is the core set (CLAUDE.md), the per-city
# clinics_output directories are the provincial runs, and dental_output and
# hair_output are the two specialist runs that feed the same master_db.
#
# Deliberately NOT listed: spa_output/*, bangkok_reviews/output and the
# <city>/output directories, which are the spa and restaurant scrapes for other
# sites, plus the two test fixture directories. Matching is by exact clinic id
# so a wrong-vertical CSV could only attach to a record with the same Google id,
# but the dental master_db carries off-vertical records (a wildlife refuge is in
# there), and a listed directory is a claim about what belongs on this site.
REVIEW_DIRS = [
    ROOT / "bangkok_clinics" / "output" / "reviews",
    ROOT / "dental_output" / "bangkok" / "reviews",
    ROOT / "dental_output" / "chiang_mai" / "reviews",
    ROOT / "dental_output" / "pattaya" / "reviews",
    ROOT / "dental_output" / "phuket" / "reviews",
    ROOT / "hair_output" / "bangkok" / "reviews",
    ROOT / "hair_output" / "chiang_mai" / "reviews",
    ROOT / "hair_output" / "pattaya" / "reviews",
    ROOT / "hair_output" / "phuket" / "reviews",
    ROOT / "chiang_mai" / "clinics_output" / "reviews",
    ROOT / "pattaya" / "clinics_output" / "reviews",
    ROOT / "phuket" / "clinics_output" / "reviews",
    ROOT / "koh_samui" / "clinics_output" / "reviews",
    ROOT / "krabi" / "clinics_output" / "reviews",
    ROOT / "hua_hin" / "clinics_output" / "reviews",
]

# One scrape run wrote an unterminated quote, so a reader sees the rest of that
# file as a single very large field. Same allowance the sibling scripts make.
csv.field_size_limit(min(sys.maxsize, 2**31 - 1))

MIN_CHARS = 80
# 2026-10-16: 4 → 1. ★4 이상만 받으면 인용문이 구글 평점보다 좋게 보인다 —
# 실측 29,834개 중 5성 96.8%, 927곳이 인용 평균이 자기 평점보다 0.3 이상 높았다.
# 1~3성도 후보에 넣고 pick() 이 실제 별점 분포대로 자리를 나눈다.
MIN_RATING = 1

# Separator and escape residue from the review CSVs. build_master_db.py's
# _clean_quote strips the same thing and then also drops a word fragment from
# each end, because what it cleans is a context window cut out of the middle of
# a review. This script quotes whole reviews, which already begin and end at a
# word boundary, so that second step only does damage here: applied to full
# texts it turned "Nice & chill space" into "& chill space" 40 times out of
# 29,641 — it dropped any opening word that was not in its common-word list.
_QUOTE_JUNK = re.compile(r'"\s*,\s*"|\\+"|[\r\n\t]+')


def clean_quote(q: str) -> str:
    q = " ".join(_QUOTE_JUNK.sub(" ", q).split())
    return q.strip(" ,;:-\"'")


def published_chars(c: dict) -> int:
    """What the clinic page can show today, from master_db alone."""
    n = 0
    for k in ("sample_reviews_en", "sample_reviews_th"):
        for r in (c.get(k) or []):
            n += len((r or {}).get("text") or "")
    return n


_THAI = re.compile(r"[฀-๿]")


def read_translations(path: Path) -> dict[str, str]:
    """<fn>_reviews_en.json — review_id → 구글 영어 번역본.

    2026-10-16 Apify 병합(scripts/merge_apify_reviews.py)부터 CSV 본문은 원문이다.
    태국어 원문만 실으면 영어 페이지를 읽는 외국인은 리뷰를 못 읽으므로, 번역본이
    있으면 "en" 으로 같이 싣는다. 번역본은 CSV 칸이 아니라 옆 파일에 있다 —
    헤더가 바뀌면 스크래퍼가 파일을 새로 써서 기존 리뷰를 버리기 때문이다.
    """
    side = path.with_name(path.name.replace("_reviews.csv", "_reviews_en.json"))
    try:
        return json.loads(side.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}


def read_csv(path: Path) -> list[dict]:
    out: list[dict] = []
    tr = read_translations(path)
    try:
        with path.open(encoding="utf-8-sig", newline="") as fh:
            for row in csv.DictReader(fh):
                text = clean_quote((row.get("text") or "").strip())
                if len(text) < MIN_CHARS:
                    continue
                try:
                    rating = int(float(row.get("rating") or 0))
                except (TypeError, ValueError):
                    rating = 0
                if rating < MIN_RATING:
                    continue
                item = {
                    "text": text,
                    "rating": rating,
                    "author": (row.get("author_name") or "").strip(),
                }
                en = clean_quote(tr.get(row.get("review_id") or "", ""))
                if en and _THAI.search(text) and not _THAI.search(en):
                    item["en"] = en
                out.append(item)
    except (OSError, csv.Error, UnicodeDecodeError) as e:
        print(f"  unreadable, skipped: {path.name} ({e})")
    return out


def star_counts(path: Path) -> dict[int, int]:
    """CSV 의 **전체** 리뷰 별점 분포 — 본문 길이와 무관하게.

    분포를 인용 후보(80자 이상)에서 재면 1성이 과대표집된다: 불만 리뷰가 길다.
    실측(덴탈 5,243곳): 후보 분포로 배분하자 1성 2,990개가 실려 820곳이 구글
    평점보다 0.5 이상 나쁘게 보였다.
    """
    counts: dict[int, int] = {}
    try:
        with path.open(encoding="utf-8-sig", newline="") as fh:
            for row in csv.DictReader(fh):
                try:
                    s = int(float(row.get("rating") or 0))
                except (TypeError, ValueError):
                    continue
                if 1 <= s <= 5:
                    counts[s] = counts.get(s, 0) + 1
    except (OSError, csv.Error, UnicodeDecodeError):
        pass
    return counts


def pick(rows: list[dict], limit: int, dist: dict[int, int] | None = None,
         target: float | None = None) -> list[dict]:
    """limit 자리를 이 클리닉이 받은 별점 분포대로 나눈 뒤, 별점 구간 안에서만
    긴 것부터 쓴다 (web-golf/scripts/review_select.py 와 같은 규칙).

    길이순만 쓰면 1성을 과대표집하고(불만 리뷰가 길다 — petbkk 1성 426자 vs
    5성 134자), ★4 게이트를 걸면 반대로 좋은 리뷰만 남는다. 둘 다 이 사이트가
    파는 "실제 환자 경험"이 아니다. 분포를 맞춰도 글자수는 줄지 않는다(골프
    모의 306곳: 괴리 +0.73 → +0.04, 글자수 1,896 → 3,115).
    """
    rows.sort(key=lambda r: -len(r["text"]))
    uniq: list[dict] = []
    seen: set[str] = set()
    for r in rows:
        head = r["text"][:60]
        if head in seen:
            continue
        seen.add(head)
        uniq.append(r)
    if len(uniq) <= limit:
        kept = list(uniq)
    else:
        kept = _by_distribution(uniq, limit, dist)
    if target:
        kept = _anchor(kept, [r for r in uniq if r not in kept], target)
    # 페이지에는 높은 별점부터, 같은 별점이면 긴 것부터.
    kept.sort(key=lambda r: (-r["rating"], -len(r["text"])))
    return kept


TOLERANCE = 0.25


def _anchor(kept: list[dict], spare: list[dict], target: float) -> list[dict]:
    """인용 평균을 구글 평점(target)에서 TOLERANCE 안으로 끌어온다.

    구글 평점은 그 클리닉의 전체 리뷰로 계산된 값이라 우리 CSV 표본보다
    정확하다. 분포 배분만으로는 두 가지가 남았다(덴탈 실측 581곳이 0.5 이상
    나쁘게 보임): (1) limited view 로 5건만 긁힌 곳은 표본 자체가 치우쳤고
    — 평점 5.0·리뷰 1,312개인데 가진 5건 중 하나가 2성 — (2) 8자리에서 1성
    하나는 12.5%라 실제 7%인 곳에서 과하다. 평균이 기준보다 낮으면 가장 낮은
    인용을 남는 후보 중 가장 높은 것으로 바꾸고, 바꿀 후보가 없으면 최소 3개는
    남긴 채 뺀다. 높으면 반대로. 리뷰를 지어내지 않고 고르는 것만 바꾼다.
    """
    kept = list(kept)
    spare = sorted(spare, key=lambda r: -len(r["text"]))

    def mean() -> float:
        return sum(r["rating"] for r in kept) / len(kept)

    for _ in range(len(kept) + len(spare)):
        if not kept:
            break
        gap = mean() - target
        if abs(gap) <= TOLERANCE:
            break
        low = gap < 0  # 너무 나빠 보인다 → 낮은 걸 빼고 높은 걸 넣는다
        out = min(kept, key=lambda r: r["rating"]) if low else max(kept, key=lambda r: r["rating"])
        better = [r for r in spare if (r["rating"] > out["rating"] if low else r["rating"] < out["rating"])]
        if better:
            inn = max(better, key=lambda r: r["rating"]) if low else min(better, key=lambda r: r["rating"])
            kept[kept.index(out)] = inn
            spare.remove(inn)
            spare.append(out)
        elif len(kept) > 3:
            kept.remove(out)
        else:
            break
    return kept


def _by_distribution(uniq: list[dict], limit: int, dist: dict[int, int] | None) -> list[dict]:
    by_star: dict[int, list[dict]] = {}
    for r in uniq:  # 이미 길이순
        by_star.setdefault(r["rating"], []).append(r)
    # 가중치는 전체 리뷰 분포(dist). 없으면 후보 분포로 폴백.
    weight = {s: (dist or {}).get(s, 0) for s in by_star}
    if sum(weight.values()) == 0:
        weight = {s: len(v) for s, v in by_star.items()}
    total = sum(weight.values())
    # 최대잉여법: 내림한 몫을 먼저 주고(후보 수를 넘지 않게), 남은 자리는
    # 소수부가 큰 구간부터. 후보가 모자란 구간의 자리는 다른 구간이 받는다.
    exact = {s: weight[s] * limit / total for s in by_star}
    quota = {s: min(len(by_star[s]), int(e)) for s, e in exact.items()}
    order = sorted(by_star, key=lambda s: (-(exact[s] % 1), -s))
    left = limit - sum(quota.values())
    i = 0
    while left > 0:
        s = order[i % len(order)]
        if quota[s] < len(by_star[s]):
            quota[s] += 1
            left -= 1
        i += 1
    return [r for s in by_star for r in by_star[s][: quota[s]]]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--max-reviews", type=int, default=8)
    args = ap.parse_args()

    by_cid: dict[str, Path] = {}
    for d in REVIEW_DIRS:
        if not d.exists():
            print(f"  review dir missing (skip): {d.relative_to(ROOT)}")
            continue
        n = 0
        for f in d.glob("*_reviews.csv"):
            by_cid.setdefault(f.name[: -len("_reviews.csv")], f)
            n += 1
        print(f"  {d.relative_to(ROOT)}: {n} clinics")
    print(f"\n{len(by_cid)} clinics with a review CSV on disk")

    db = json.loads(MASTER.read_text(encoding="utf-8"))
    clinics = db["clinics"]

    out: dict[str, list[dict]] = {}
    before: list[int] = []
    after: list[int] = []
    no_csv = weaker = 0

    for c in clinics:
        cid = str(c.get("id") or "")
        path = by_cid.get(cid.replace(":", "_"))
        if not path:
            no_csv += 1
            continue
        picked = pick(read_csv(path), args.max_reviews, star_counts(path),
                      c.get("rating") or None)
        if not picked:
            continue
        new = sum(len(r["text"]) for r in picked)
        had = published_chars(c)
        if new <= had:
            weaker += 1
            continue
        out[cid] = picked
        before.append(had)
        after.append(new)

    print(f"\nclinics in master_db: {len(clinics)}")
    print(f"  no CSV on disk          {no_csv}")
    print(f"  CSV holds no more text  {weaker}")
    print(f"  improved                {len(out)}")
    if before:
        print(f"  median review text {int(statistics.median(before))} -> "
              f"{int(statistics.median(after))} chars "
              f"({statistics.median(after) / max(1, statistics.median(before)):.1f}x)")
        print(f"  total {sum(before):,} -> {sum(after):,} chars")

    if args.dry_run:
        print("\n--dry-run, nothing written")
        return 0

    payload = json.dumps(out, ensure_ascii=False, separators=(",", ":"))
    OUT.write_text(payload, encoding="utf-8")
    mb = len(payload.encode("utf-8")) / 1024 / 1024
    print(f"\nwrote {OUT.relative_to(ROOT)} ({mb:.1f} MB, {len(out)} clinics)")
    print("  not copied into Worker assets on purpose — the clinic page is")
    print("  prerendered, so this is read with fs at build time only.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
