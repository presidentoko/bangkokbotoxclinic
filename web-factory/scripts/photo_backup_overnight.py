"""Google Maps photo backup.

master_db.json 의 모든 supplier 의 photos[] / hero_image URL 을 local 로 다운로드.
저장: public/photos/{place_id}/{n}.jpg
이후 master_db.json 의 photos[] 와 hero_image 를 새 path 로 교체.

Google CDN URL (lh3.googleusercontent.com/...) 은 정기적으로 rotate 되어
사이트가 깨지는 사고가 종종 발생 — 미리 백업.

산출:
    public/photos/{place_id}/0.jpg, 1.jpg, ...
    data/master_db.json — photos[] 및 hero_image 가 /photos/... 로 교체
    data/master_db.json.bak-pre-photos — 백업
    logs/photo_backup.log
"""
from __future__ import annotations

import hashlib
import json
import logging
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.error import HTTPError, URLError

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).parent
WEB = HERE.parent
DATA = WEB / "data"
PUBLIC = WEB / "public"
PHOTOS_DIR = PUBLIC / "photos"
PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
LOGS = WEB / "logs"
LOGS.mkdir(exist_ok=True)
LOG_FILE = LOGS / "photo_backup.log"

DB_PATH = DATA / "master_db.json"
DB_BAK  = DATA / "master_db.json.bak-pre-photos"

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36"
TIMEOUT = 20
MAX_WORKERS = 6  # Google CDN 동시 다운로드


def setup_logging() -> logging.Logger:
    log = logging.getLogger("photos")
    log.setLevel(logging.INFO)
    fh = logging.FileHandler(LOG_FILE, encoding="utf-8")
    fh.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s"))
    log.addHandler(fh)
    sh = logging.StreamHandler(sys.stdout)
    sh.setFormatter(logging.Formatter("%(levelname)s %(message)s"))
    log.addHandler(sh)
    return log


def download_one(url: str, dest: Path, log: logging.Logger) -> tuple[bool, int, str]:
    """Returns (ok, size_bytes, content_type)."""
    if dest.exists() and dest.stat().st_size > 1000:
        return True, dest.stat().st_size, "cached"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Referer": "https://www.google.com/maps"})
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            ctype = r.headers.get("Content-Type", "image/jpeg")
            body = r.read()
        if len(body) < 1000:
            return False, len(body), "too_small"
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(body)
        return True, len(body), ctype
    except HTTPError as e:
        return False, 0, f"http_{e.code}"
    except URLError as e:
        return False, 0, f"url_{type(e.reason).__name__}"
    except Exception as e:
        return False, 0, f"err_{type(e).__name__}"


def main() -> None:
    log = setup_logging()
    db = json.loads(DB_PATH.read_text(encoding="utf-8"))

    # 백업 (아직 없으면)
    if not DB_BAK.exists():
        DB_BAK.write_bytes(DB_PATH.read_bytes())
        log.info(f"backup: {DB_BAK}")

    # 다운로드 job 수집
    jobs: list[tuple[str, str, Path]] = []  # (place_id, url, dest)
    for s in db["suppliers"]:
        pid = s.get("id") or s.get("place_id")
        if not pid:
            continue
        urls = list(s.get("photos") or [])
        if not urls and s.get("hero_image"):
            urls = [s["hero_image"]]
        for i, url in enumerate(urls[:8]):  # 최대 8장
            if not url or not url.startswith("http"):
                continue
            if not url.startswith("https://lh"):
                # 이미 우리 도메인이면 skip
                continue
            dest = PHOTOS_DIR / pid / f"{i}.jpg"
            jobs.append((pid, url, dest))

    log.info(f"download jobs: {len(jobs)}")

    ok_count = 0
    fail_count = 0
    fail_by_reason: dict[str, int] = {}
    total_bytes = 0
    t0 = time.time()

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
        futures = {ex.submit(download_one, url, dest, log): (pid, url, dest) for pid, url, dest in jobs}
        for i, fut in enumerate(as_completed(futures), 1):
            pid, url, dest = futures[fut]
            try:
                ok, size, info = fut.result()
            except Exception as e:
                ok, size, info = False, 0, f"future_{type(e).__name__}"
            if ok:
                ok_count += 1
                total_bytes += size
            else:
                fail_count += 1
                fail_by_reason[info] = fail_by_reason.get(info, 0) + 1
            if i % 200 == 0:
                elapsed = time.time() - t0
                rate = i / elapsed
                eta = (len(jobs) - i) / rate
                log.info(f"  [{i:>5}/{len(jobs)}] ok={ok_count} fail={fail_count} {total_bytes/1024/1024:.1f}MB  rate={rate:.1f}/s eta={eta/60:.0f}min")

    log.info(f"  fail breakdown: {fail_by_reason}")
    log.info(f"  total: {ok_count} ok, {fail_count} fail, {total_bytes/1024/1024:.1f} MB")

    # master_db.json 의 photos[] / hero_image rewrite
    log.info("rewriting master_db.json with local paths …")
    rewritten = 0
    for s in db["suppliers"]:
        pid = s.get("id") or s.get("place_id")
        if not pid:
            continue
        new_photos: list[str] = []
        original = list(s.get("photos") or [])
        for i, _url in enumerate(original[:8]):
            local = PHOTOS_DIR / pid / f"{i}.jpg"
            if local.exists() and local.stat().st_size > 1000:
                new_photos.append(f"/photos/{pid}/{i}.jpg")
        if new_photos:
            s["photos"] = new_photos
            s["hero_image"] = new_photos[0]
            rewritten += 1
        elif (s.get("hero_image") or "").startswith("https://lh"):
            # hero only, no photos[] — also try
            local = PHOTOS_DIR / pid / "0.jpg"
            if local.exists():
                s["hero_image"] = f"/photos/{pid}/0.jpg"
                rewritten += 1

    DB_PATH.write_text(json.dumps(db, ensure_ascii=False, indent=2, allow_nan=False), encoding="utf-8")
    log.info(f"rewrote {rewritten} suppliers")
    log.info(f"DONE — public/photos size: {sum(p.stat().st_size for p in PHOTOS_DIR.rglob('*.jpg'))/1024/1024:.0f} MB")


if __name__ == "__main__":
    main()
