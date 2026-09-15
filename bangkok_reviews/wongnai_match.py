"""Wongnai 수집분을 우리 식당 DB 에 붙인다.

세 경로로 매칭한다.
  phone     전화번호가 하나라도 겹침. 가장 확실하다.
  geo+name  200m 이내이면서 이름 토큰이 절반 이상 겹침.
  geo50     50m 이내. 이름은 보지 않는다.

geo50 은 사이트에 표시하지 않는다. 쇼핑몰·푸드코트에서는 50m 안에 식당이
수십 개 겹쳐, 옆 가게 평점을 남의 페이지에 붙이게 된다. 실제 영업 중인
업소에 대한 허위 표시다. 다만 격차 통계는 세 경로가 거의 같게 나왔으므로
(phone +0.35 / geo+name +0.33 / geo50 +0.40, 2,250곳 시점) 분석용으로는 남긴다.

전화 매칭만으로는 18% 였다. 전화는 대표번호 하나만 적힌 경우가 많아 지점을
못 가르고, 태국은 같은 이름의 지점이 수십 개라 이름만으로도 못 가른다.
좌표를 더해 43% 가 됐다.
"""
from __future__ import annotations

import json
import math
import re
import unicodedata
from collections import Counter
from pathlib import Path

HERE = Path(__file__).parent


def digits(s: str) -> str:
    d = re.sub(r"\D", "", s or "")
    return "0" + d[2:] if d.startswith("66") else d


def phone_set(s: str) -> set[str]:
    parts = re.split(r"[,;/|]| or |\s{2,}", s or "")
    return {x for x in (digits(p) for p in parts) if len(x) >= 8}


def norm(s: str) -> str:
    s = unicodedata.normalize("NFKC", s or "").lower()
    return " ".join(re.sub(r"[^a-z0-9\u0e00-\u0e7f]+", " ", s).split())


def name_sim(a: str, b: str) -> float:
    A, B = set(norm(a).split()), set(norm(b).split())
    if not A or not B:
        return 0.0
    return len(A & B) / min(len(A), len(B))


def meters(a: float, b: float, c: float, d: float) -> float:
    R = 6371000
    p1, p2 = math.radians(a), math.radians(c)
    dp, dl = math.radians(c - a), math.radians(d - b)
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * R * math.asin(math.sqrt(h))


def main() -> int:
    det = json.loads((HERE / "wongnai" / "details.json").read_text(encoding="utf-8"))
    db = json.loads((HERE.parent / "web-restaurants" / "data" / "master_db.json")
                    .read_text(encoding="utf-8"))["restaurants"]
    ok = [v for v in det.values() if v.get("status") == "ok"]

    phone_idx: dict[str, dict] = {}
    for r in db:
        for p in phone_set(r.get("phone")):
            phone_idx.setdefault(p, r)

    CELL = 0.005  # ≈ 550m
    grid: dict[tuple, list] = {}
    for r in db:
        if r.get("lat") and r.get("lng"):
            grid.setdefault((round(r["lat"] / CELL), round(r["lng"] / CELL)), []).append(r)

    def near(lat: float, lng: float, radius: float) -> list[tuple[float, dict]]:
        k = (round(lat / CELL), round(lng / CELL))
        out = []
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                for r in grid.get((k[0] + dx, k[1] + dy), []):
                    d = meters(lat, lng, r["lat"], r["lng"])
                    if d <= radius:
                        out.append((d, r))
        out.sort(key=lambda t: t[0])
        return out

    matched: dict[str, dict] = {}
    how = Counter()
    for v in ok:
        hit = method = None
        for p in phone_set(v.get("phone")):
            if p in phone_idx:
                hit, method = phone_idx[p], "phone"
                break
        if not hit and v.get("lat"):
            cands = near(v["lat"], v["lng"], 200)
            scored = sorted(((name_sim(v.get("name"), r["name"]), d, r) for d, r in cands),
                            key=lambda t: (-t[0], t[1]))
            if scored and scored[0][0] >= 0.5:
                hit, method = scored[0][2], "geo+name"
            elif cands and cands[0][0] <= 50:
                hit, method = cands[0][1], "geo50"
        if not hit:
            continue
        pid = hit["place_id"]
        # 같은 식당에 여러 Wongnai 항목이 붙으면 더 확실한 경로를 남긴다.
        rank = {"phone": 0, "geo+name": 1, "geo50": 2}
        if pid in matched and rank[matched[pid]["match"]] <= rank[method]:
            continue
        how[method] += 1
        matched[pid] = {
            "source": "wongnai",
            "rating": v["rating"],
            "rating_count": v.get("rating_count") or 0,
            "url": v["url"],
            "match": method,
        }

    out = HERE / "wongnai" / "matched.json"
    out.write_text(json.dumps(matched, ensure_ascii=False, indent=1), encoding="utf-8")
    shown = sum(1 for m in matched.values() if m["match"] != "geo50")
    print(f"Wongnai {len(ok):,}곳 → 매칭 {len(matched):,}곳 ({len(matched)*100//len(ok)}%)")
    print(f"  방법별 {dict(how)}")
    print(f"  사이트 표시 대상(phone+geo+name) {shown:,}곳 · 분석 전용(geo50) {len(matched)-shown:,}곳")
    print(f"  → {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
