"""구글 데이터가 없는 도시(치앙마이·푸켓)를 Wongnai 목록에서 시작해 만든다.

방콕·파타야는 구글 그리드로 식당을 모았고 Wongnai 는 나중에 붙였다. 새 도시는
순서를 뒤집는다. 9/11 이후 구글 장소 패널로는 리뷰를 5개밖에 못 받아 자체
스크래퍼로 도시를 새로 열 수 없고, Wongnai 는 지역 목록이 서버 렌더링이라
무료로 전체를 받을 수 있다.

  1. emit-search   Wongnai 이름 → compass/crawler-google-places 입력 JSON
  2. resolve       검색 결과를 Wongnai 좌표로 검증해 restaurants.csv 작성
                   + kaix 리뷰 수집용 2패스 JSON 생성
  3. (apify_import.py 로 리뷰 반입 → build_master_db.py)

검증 기준은 방콕 정답지 10곳 시험에서 정했다. 이름으로 검색하면 정답이 1순위
8곳·2순위 1곳이었고, 좌표 오차는 5~54m 였다. 그래서 후보는 2곳까지만 받고
Wongnai 좌표 150m 이내만 채택한다. kaix(리뷰 액터)에 검색 URL 을 넣는 방식은
같은 시험에서 3/10 이라 쓰지 않는다.
"""
from __future__ import annotations

import argparse
import csv
import html
import json
import math
from pathlib import Path
from urllib.parse import quote

HERE = Path(__file__).parent
ROOT = HERE.parent

# 좌표 한 점 + 반경으로 도시 전체를 덮는다. compass 는 실행당 한 점만 받는다.
CITY = {
    "chiang_mai": {"center": (18.7883, 98.9853), "radius_km": 25, "label": "Chiang Mai"},
    "phuket":     {"center": (7.8804, 98.3923),  "radius_km": 35, "label": "Phuket"},
}
MAX_METERS = 150

# compass 는 language="en" 을 줘도 카테고리를 좌표 지역 언어로 돌려준다
# (방콕 시험 15곳 중 12곳이 태국어). 기존 DB 는 전부 영어라 섞이면 페이지에
# 태국어 카테고리가 뜨고, 영어 키워드로 도는 tag_cuisines 가 놓친다.
#
# 번역을 기억으로 채우지 않는다 — 틀리면 식당에 거짓 분류를 붙인다. 아래는
# 같은 가게를 우리 DB(hl=en)와 compass 결과 양쪽에서 대조해 확인한 것만이다.
#   ร้านอาหาร 5/5 · ภัตตาคารอาหารทะเล 1/1 · ภัตตาคารอาหารไทย 1/1
# 목록에 없는 태국어 카테고리는 "Restaurant" 로 둔다. 모든 식당에 참인 값이라
# 틀린 분류가 되지 않고, 요리 태그는 이름과 리뷰 본문에서 따로 잡힌다.
# 대체된 카테고리는 resolve 가 집계해 출력한다 — 근거가 생기면 여기 추가.
TH_CATEGORY = {
    "ร้านอาหาร": "Restaurant",
    "ภัตตาคารอาหารทะเล": "Seafood restaurant",
    "ภัตตาคารอาหารไทย": "Thai restaurant",
}


def english_category(name: str, unmapped: dict) -> str:
    if not name or not any("฀" <= ch <= "๿" for ch in name):
        return name
    if name in TH_CATEGORY:
        return TH_CATEGORY[name]
    unmapped[name] = unmapped.get(name, 0) + 1
    return "Restaurant"


CSV_HEADER = ["place_id", "name", "primary_type", "formatted_address", "plus_code",
              "latitude", "longitude", "phone", "website", "menu_url", "rating",
              "total_reviews", "price_level", "price_symbol", "business_status",
              "editorial_summary", "maps_url"]


def meters(a: float, b: float, c: float, d: float) -> float:
    R = 6371000
    p1, p2 = math.radians(a), math.radians(c)
    h = (math.sin(math.radians(c - a) / 2) ** 2
         + math.cos(p1) * math.cos(p2) * math.sin(math.radians(d - b) / 2) ** 2)
    return 2 * R * math.asin(math.sqrt(h))


def wongnai_city(city: str) -> list[dict]:
    det = json.loads((HERE / "wongnai" / "details.json").read_text(encoding="utf-8"))
    return [dict(v, slug=k, name=html.unescape(v.get("name") or ""))
            for k, v in det.items()
            if v.get("status") == "ok" and v.get("region") == city
            and v.get("lat") and v.get("name")]


def emit_search(city: str, out_dir: Path, chunk: int) -> None:
    venues = wongnai_city(city)
    c = CITY[city]
    names = sorted({v["name"] for v in venues})
    out_dir.mkdir(parents=True, exist_ok=True)
    for i in range(0, len(names), chunk):
        part = names[i:i + chunk]
        cfg = {
            "searchStringsArray": part,
            "customGeolocation": {"type": "Point",
                                  "coordinates": [c["center"][1], c["center"][0]],
                                  "radiusKm": c["radius_km"]},
            "maxCrawledPlacesPerSearch": 2,
            "language": "en",
        }
        p = out_dir / f"search-{city}-{i // chunk + 1:02d}.json"
        p.write_text(json.dumps(cfg, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"  {p.name}  {len(part)}곳")
    print(f"{city}: Wongnai {len(venues)}곳 · 고유 이름 {len(names)}개")


def business_status(r: dict) -> str:
    if r.get("permanentlyClosed"):
        return "Permanently closed"
    if r.get("temporarilyClosed"):
        return "Temporarily closed"
    return "Open"


def resolve(city: str, datasets: list[Path], out_dir: Path) -> None:
    venues = wongnai_city(city)
    rows: list[dict] = []
    for p in datasets:
        rows.extend(json.loads(p.read_text(encoding="utf-8")))
    by_search: dict[str, list] = {}
    for r in rows:
        by_search.setdefault(r.get("searchString") or "", []).append(r)

    chosen: dict[str, dict] = {}      # fid → compass row
    wn_match: dict[str, dict] = {}    # fid → wongnai
    far = closed = none = 0
    for v in venues:
        cands = [r for r in by_search.get(v["name"], [])
                 if (r.get("location") or {}).get("lat") is not None and r.get("fid")]
        if not cands:
            none += 1
            continue
        d, best = min(((meters(v["lat"], v["lng"], r["location"]["lat"], r["location"]["lng"]), r)
                       for r in cands), key=lambda t: t[0])
        if d > MAX_METERS:
            far += 1          # 같은 이름의 다른 지점일 가능성이 크다
            continue
        if best.get("permanentlyClosed"):
            closed += 1
            continue
        chosen[best["fid"]] = best
        wn_match[best["fid"]] = v

    unmapped: dict[str, int] = {}
    city_dir = ROOT / city / "output"
    city_dir.mkdir(parents=True, exist_ok=True)
    csv_path = city_dir / "restaurants.csv"

    # 이 폴더엔 이미 데이터가 있을 수 있다. 2026-07-23 구글 그리드 스크래퍼가
    # 치앙마이 230곳(리뷰 105곳)·푸켓 332곳(리뷰 162곳)을 모아뒀다. 덮어쓰면
    # 식당 행이 사라지고 리뷰 파일만 고아로 남는다. 기존 행은 전부 유지하고,
    # 같은 place_id 가 양쪽에 있으면 기존 행을 쓴다(hl=en 으로 직접 긁은 원본).
    existing: dict[str, dict] = {}
    if csv_path.exists():
        with open(csv_path, encoding="utf-8-sig", errors="replace", newline="") as f:
            for row in csv.DictReader(f):
                if row.get("place_id"):
                    existing[row["place_id"]] = row
        backup = csv_path.with_name(f"restaurants.csv.bak-{__import__('datetime').date.today()}")
        if not backup.exists():
            backup.write_bytes(csv_path.read_bytes())

    added = 0
    with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f, quoting=csv.QUOTE_ALL)
        w.writerow(CSV_HEADER)
        for row in existing.values():
            w.writerow([row.get(k, "") for k in CSV_HEADER])
        for fid, r in chosen.items():
            if fid in existing:
                continue
            added += 1
            loc = r["location"]
            pid = r.get("placeId") or ""
            # 매칭 코드가 !19s(ChIJ) 와 !1s(0x..:0x..) 를 둘 다 읽으므로 둘 다 넣는다.
            maps_url = (f"https://www.google.com/maps/place/{quote(r.get('title') or '')}"
                        f"/data=!4m7!3m6!1s{fid}!8m2!3d{loc['lat']}!4d{loc['lng']}!19s{pid}")
            w.writerow([fid, r.get("title") or "", english_category(r.get("categoryName") or "", unmapped),
                        r.get("address") or "", r.get("plusCode") or "",
                        loc["lat"], loc["lng"], r.get("phone") or "", r.get("website") or "",
                        "", r.get("totalScore") or "", r.get("reviewsCount") or 0,
                        "", r.get("price") or "", business_status(r),
                        r.get("description") or "", maps_url])

    # Wongnai 매칭 기록 — 검색 자체가 Wongnai 에서 출발했고 좌표로 검증했다.
    mpath = HERE / "wongnai" / "matched.json"
    matched = json.loads(mpath.read_text(encoding="utf-8")) if mpath.exists() else {}
    for fid, v in wn_match.items():
        matched[fid] = {"source": "wongnai", "rating": v["rating"],
                        "rating_count": v.get("rating_count") or 0,
                        "url": v["url"], "match": "search"}
    mpath.write_text(json.dumps(matched, ensure_ascii=False, indent=1), encoding="utf-8")

    # kaix 리뷰 2패스 입력. 방콕 실측: 2패스가 추세 판정 가능 9% → 70%.
    rev_dir = city_dir / "reviews"

    def has_reviews(fid: str) -> bool:
        f = rev_dir / f"{fid.replace(':', '_')}_reviews.csv"
        if not f.exists():
            return False
        with open(f, encoding="utf-8-sig", errors="replace") as fh:
            return sum(1 for _ in csv.DictReader(fh)) >= 15

    need = {fid: r for fid, r in chosen.items() if r.get("placeId") and not has_reviews(fid)}
    ids = [r["placeId"] for r in need.values()]
    small = [r["placeId"] for r in need.values() if (r.get("reviewsCount") or 0) >= 150]
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / f"reviews-{city}-pass1.json").write_text(json.dumps(
        {"urls": ids, "maxReviews": 50, "language": "en"}, ensure_ascii=False, indent=1), encoding="utf-8")
    # 과거분 패스는 리뷰가 적은 집에선 대부분 중복이었다(방콕 배치3: 84% 중복).
    (out_dir / f"reviews-{city}-pass2-older.json").write_text(json.dumps(
        {"urls": small, "maxReviews": 30, "reviewsOlderThan": "2025-03-14", "language": "en"},
        ensure_ascii=False, indent=1), encoding="utf-8")

    print(f"{city}: Wongnai {len(venues)}곳")
    print(f"  채택 {len(chosen)} · 결과없음 {none} · {MAX_METERS}m 초과 {far} · 폐업 {closed}")
    print(f"  CSV: 기존 {len(existing)}행 유지 + 신규 {added}행 (중복 {len(chosen)-added})")
    print(f"  → {city_dir / 'restaurants.csv'}")
    print(f"  → 리뷰 pass1 {len(ids)}곳 · pass2 {len(small)}곳 (리뷰 150+ 만)")
    if unmapped:
        top = sorted(unmapped.items(), key=lambda t: -t[1])[:15]
        print(f"  ⚠ 'Restaurant' 로 대체한 태국어 카테고리 {len(unmapped)}종: {top}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("stage", choices=["emit-search", "resolve"])
    ap.add_argument("--city", required=True, choices=list(CITY))
    ap.add_argument("--datasets", nargs="*", type=Path, default=[])
    ap.add_argument("--chunk", type=int, default=1500)
    ap.add_argument("--out", type=Path, default=ROOT / "web-restaurants" / "data" / "apify" / "cities")
    args = ap.parse_args()
    if args.stage == "emit-search":
        emit_search(args.city, args.out, args.chunk)
    else:
        resolve(args.city, args.datasets, args.out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
