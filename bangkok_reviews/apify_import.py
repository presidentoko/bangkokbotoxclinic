"""Apify Google Maps Reviews 데이터셋을 우리 CSV 형식으로 변환한다.

2026-09-11 구글이 Maps 장소 패널을 리뷰 5개짜리 미리보기로 바꾸면서 자체
스크래퍼로는 업소당 5개밖에 못 받게 됐다(RAM·스크롤·IP·헤드리스 전부 배제 후
확인). 남은 4,102곳은 Apify kaix/google-maps-reviews-scraper 로 받는다.

입력 데이터에서 그대로 믿으면 안 되는 것 두 가지:

1. author.isLocalGuide 가 전량 false 다. 같은 레코드의 badgeLabel 은
   "Local Guide · 12 reviews", localGuideLevel 은 7 이다. 20곳 920건에서
   isLocalGuide=True 가 0건, badgeLabel 기준으로는 512건(56%)이었다.
   이 필드를 믿으면 사이트에 "0% Local Guides" 라는 거짓 통계가 실린다.

2. 리뷰의 56%가 태국어 원문이다. 기존 코퍼스는 전부 hl=en 으로 받아 영어로
   번역된 상태라, 원문을 섞으면 language_breakdown 이 깨지고 태국어가 그대로
   노출된다. textTranslated 가 태국어 리뷰의 99%를 덮으므로 그쪽을 우선한다.
"""
from __future__ import annotations

import argparse
import csv
import json
import re
from pathlib import Path

CHIJ_RE = re.compile(r"!19s(ChIJ[A-Za-z0-9_\-]+)")
HEX_RE = re.compile(r"!1s(0x[0-9a-f]+:0x[0-9a-f]+)")

REVIEW_HEADER = [
    "review_id", "place_id", "restaurant_name", "rating", "text",
    "author_name", "author_id", "author_uri", "author_photo_uri",
    "author_is_local_guide", "author_review_count", "author_photo_count",
    "relative_date", "spent_amount", "sort_source",
]
META_HEADER = [
    "review_id", "place_id", "food_rating", "service_rating",
    "atmosphere_rating", "meal_type", "price_per_person", "group_size",
    "wait_time", "reservation", "service_type", "recommended_dishes",
]


def place_id_to_filename(pid: str) -> str:
    return pid.replace("/", "_").replace(":", "_")


def is_local_guide(author: dict) -> int:
    """isLocalGuide 는 고장나 있다 — 배지 문구로 판정한다.

    localGuideLevel 을 폴백으로 쓰면 안 된다. 구글은 기여가 있는 계정이면
    거의 다 레벨을 매기므로(920건 중 903건에 레벨이 있었다) level>0 으로
    치면 98%가 Local Guide 가 된다. 기존 코퍼스의 실제 비율은 65% 이고,
    badgeLabel 기준은 56% 로 그 선에 가깝다. 뱃지는 구글이 리뷰 카드에
    직접 표시하는 것이라, 기존 스크래퍼가 읽던 "Local Guide" 문구와 같다.
    """
    if (author.get("badgeLabel") or "").strip().startswith("Local Guide"):
        return 1
    return 1 if author.get("hasLocalGuideBadge") else 0


def review_text(r: dict) -> str:
    """기존 코퍼스가 영어(hl=en)이므로 번역본을 우선한다."""
    return (r.get("textTranslated") or r.get("text") or "").strip()


def build_place_map(master_db: Path) -> dict[str, dict]:
    """ChIJ id -> {place_id(우리 형식), name} 매핑."""
    db = json.loads(master_db.read_text(encoding="utf-8"))
    out: dict[str, dict] = {}
    for r in db["restaurants"]:
        url = r.get("maps_url") or ""
        m = CHIJ_RE.search(url)
        if m:
            out[m.group(1)] = {"place_id": r["place_id"], "name": r.get("name", "")}
    return out


def our_place_id(r: dict, pmap: dict) -> tuple[str, str]:
    """Apify 레코드에서 우리 place_id 와 이름을 찾는다."""
    place = r.get("place") or {}
    chij = place.get("placeId") or ""
    if chij in pmap:
        return pmap[chij]["place_id"], pmap[chij]["name"]
    # 매핑에 없으면 googleMapsUri 안의 0x…:0x… 를 쓴다 — 그게 우리 형식이다.
    m = HEX_RE.search(place.get("googleMapsUri") or "")
    return (m.group(1) if m else ""), place.get("name", "")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("dataset", type=Path, help="Apify 데이터셋 JSON")
    ap.add_argument("--out", type=Path, default=Path("output/reviews"))
    ap.add_argument("--master-db", type=Path,
                    default=Path("../web-restaurants/data/master_db.json"))
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    pmap = build_place_map(args.master_db)
    rows = json.loads(args.dataset.read_text(encoding="utf-8"))

    by_place: dict[str, list] = {}
    names: dict[str, str] = {}
    unmapped = 0
    for r in rows:
        pid, name = our_place_id(r, pmap)
        if not pid:
            unmapped += 1
            continue
        by_place.setdefault(pid, []).append(r)
        names.setdefault(pid, name)

    print(f"리뷰 {len(rows)}건 · 식당 {len(by_place)}곳"
          + (f" · place_id 매핑 실패 {unmapped}건" if unmapped else ""))

    written = skipped = 0
    for pid, items in sorted(by_place.items()):
        fn = place_id_to_filename(pid)
        rp = args.out / f"{fn}_reviews.csv"
        mp = args.out / f"{fn}_meta.csv"

        # 이미 더 많이 모아둔 곳은 건드리지 않는다. 스크래퍼 쪽에도 같은
        # 가드가 있다 — 적게 받은 결과가 기존 수집분을 덮으면 안 된다.
        prev = 0
        if rp.exists():
            with open(rp, encoding="utf-8-sig", errors="replace") as f:
                prev = sum(1 for _ in csv.DictReader(f))
        if prev > len(items):
            print(f"  건너뜀 {names.get(pid,'')[:28]}: 기존 {prev} > 신규 {len(items)}")
            skipped += 1
            continue

        if args.dry_run:
            written += 1
            continue

        args.out.mkdir(parents=True, exist_ok=True)
        with open(rp, "w", newline="", encoding="utf-8-sig") as f:
            w = csv.writer(f, quoting=csv.QUOTE_NONNUMERIC)
            w.writerow(REVIEW_HEADER)
            for r in items:
                a = r.get("author") or {}
                w.writerow([
                    r.get("reviewId") or "", pid, names.get(pid, ""),
                    r.get("rating") or 0, review_text(r),
                    a.get("name") or "", a.get("id") or "",
                    a.get("profileUrl") or "", a.get("avatarUrl") or "",
                    is_local_guide(a),
                    a.get("reviewCount") or 0, a.get("photoCount") or 0,
                    r.get("relativeDate") or "", "", "apify",
                ])
        with open(mp, "w", newline="", encoding="utf-8-sig") as f:
            w = csv.writer(f, quoting=csv.QUOTE_NONNUMERIC)
            w.writerow(META_HEADER)
            for r in items:
                d = r.get("details") or {}
                if not any(d.values()):
                    continue
                w.writerow([
                    r.get("reviewId") or "", pid,
                    d.get("food") or "", d.get("service") or "",
                    d.get("atmosphere") or "", d.get("mealType") or "",
                    d.get("pricePerPerson") or "", d.get("groupSize") or "",
                    d.get("waitTime") or "", d.get("reservation") or "",
                    d.get("orderType") or "",
                    "; ".join(d.get("recommendedDishes") or [])
                    if isinstance(d.get("recommendedDishes"), list)
                    else (d.get("recommendedDishes") or ""),
                ])
        written += 1

    print(f"{'(dry-run) ' if args.dry_run else ''}작성 {written}곳 · 보존 {skipped}곳")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
