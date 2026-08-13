"""master_db 의 원격 사진 URL 을 실제로 열어보고 죽은 것을 떼어낸다.

Apify 가 긁어온 hero_image / photos 는 Google 이 서명해 발급한 임시 URL 이다
(lh3.googleusercontent.com/gps-cs-s/... , streetviewpixels-pa.googleapis.com/...).
서명이 만료되면 403 이 떨어진다. 표본 12건 중 6건이 이미 죽어 있었다.

죽은 URL 을 그대로 두면 카드가 깨진 이미지 아이콘을 띄운다. SupplierCard 는
사진이 *없으면* 이미지 영역을 통째로 건너뛰도록 되어 있으니, 못 쓸 URL 은
아예 없는 것으로 만드는 편이 낫다.

결과는 data/photo_url_cache.json 에 남긴다. auto_rebuild 는 10분마다 도는데
매번 5천 건을 다시 때릴 수는 없다 — 새로 들어온 URL 만 확인하고 나머지는
캐시를 쓴다. 오래된 OK 판정은 RECHECK_DAYS 지나면 다시 본다.

실행:
    python scripts/validate_photo_urls.py
    python scripts/validate_photo_urls.py --recheck-all
"""
from __future__ import annotations

import json
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from pathlib import Path

WEB = Path(__file__).resolve().parent.parent
MASTER_DB = WEB / "data" / "master_db.json"
CACHE = WEB / "data" / "photo_url_cache.json"

WORKERS = 24
TIMEOUT = 12
RECHECK_DAYS = 30
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36"


def check(url: str) -> bool:
    """HEAD 는 쓰지 않는다 — Google CDN 이 HEAD 에는 살아있는 URL 에도 403 을 준다.
    Range 로 앞 1KB 만 받아서 content-type 까지 확인한다."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Range": "bytes=0-1023"})
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            return r.status in (200, 206) and "image" in (r.headers.get("content-type") or "")
    except Exception:
        return False


def main() -> int:
    recheck_all = "--recheck-all" in sys.argv
    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    suppliers = db["suppliers"]

    cache: dict[str, dict] = {}
    if CACHE.exists() and not recheck_all:
        try:
            cache = json.loads(CACHE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            print("캐시 손상 — 새로 만듭니다")

    stale_before = (datetime.now(timezone.utc) - timedelta(days=RECHECK_DAYS)).isoformat()

    urls: set[str] = set()
    for s in suppliers:
        h = s.get("hero_image")
        if h and h.startswith("http"):
            urls.add(h)
        for p in (s.get("photos") or []):
            if isinstance(p, str) and p.startswith("http"):
                urls.add(p)

    todo = [
        u for u in urls
        if u not in cache
        or (cache[u].get("ok") and cache[u].get("at", "") < stale_before)
    ]
    print(f"원격 사진 URL {len(urls):,} 개 — 확인 필요 {len(todo):,} 개 (나머지는 캐시)")

    if todo:
        now = datetime.now(timezone.utc).isoformat()
        done = 0
        with ThreadPoolExecutor(max_workers=WORKERS) as pool:
            for url, ok in zip(todo, pool.map(check, todo)):
                cache[url] = {"ok": ok, "at": now}
                done += 1
                if done % 500 == 0:
                    print(f"  {done:,}/{len(todo):,}")
        CACHE.write_text(json.dumps(cache, separators=(",", ":")), encoding="utf-8")

    def alive(u: str | None) -> bool:
        if not u:
            return False
        if not u.startswith("http"):
            return True            # 로컬 /photos/... 백업은 그대로 신뢰
        return bool(cache.get(u, {}).get("ok"))

    dropped_hero = dropped_photos = 0
    for s in suppliers:
        if s.get("hero_image") and not alive(s["hero_image"]):
            # photos 안에 살아있는 게 있으면 그걸로 승격, 없으면 사진 없는 것으로.
            live = [p for p in (s.get("photos") or []) if alive(p)]
            s["hero_image"] = live[0] if live else None
            dropped_hero += 1
        if s.get("photos"):
            keep = [p for p in s["photos"] if alive(p)]
            dropped_photos += len(s["photos"]) - len(keep)
            s["photos"] = keep

    db["with_photos"] = sum(1 for s in suppliers if s.get("photos") or s.get("hero_image"))
    MASTER_DB.write_text(
        json.dumps(db, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
    )

    dead = sum(1 for v in cache.values() if not v.get("ok"))
    print(f"죽은 URL {dead:,} / {len(cache):,}")
    print(f"hero_image 교체·제거 {dropped_hero:,} · photos 항목 제거 {dropped_photos:,}")
    print(f"최종 사진 보유 supplier: {db['with_photos']:,}")
    return 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    raise SystemExit(main())
